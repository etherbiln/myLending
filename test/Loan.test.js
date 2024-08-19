const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Loan", function () {
    let Loan, loan, Token, token;
    let owner, lender, borrower;

    beforeEach(async function () {
        [owner, lender, borrower] = await ethers.getSigners();

        Token = await ethers.getContractFactory("Token");
        token = await Token.deploy();
        await token.deployed();

        Loan = await ethers.getContractFactory("Loan");
        loan = await Loan.deploy(token.address, lender.address, borrower.address, ethers.utils.parseUnits("500", 18), 5, Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7);
        await loan.deployed();
    });

    it("Should allow repayment of the loan", async function () {
        const amountToRepay = ethers.utils.parseUnits("500", 18).add(ethers.utils.parseUnits("500", 18).mul(5).div(100));
        
        await token.mint(borrower.address, amountToRepay);
        await token.connect(borrower).approve(loan.address, amountToRepay);

        await loan.connect(borrower).repay();

        expect(await loan.repaid()).to.equal(true);
    });

    it("Should not allow repayment if the loan is already repaid", async function () {
        const amountToRepay = ethers.utils.parseUnits("500", 18).add(ethers.utils.parseUnits("500", 18).mul(5).div(100));
        
        await token.mint(borrower.address, amountToRepay);
        await token.connect(borrower).approve(loan.address, amountToRepay);
        await loan.connect(borrower).repay();

        await expect(
            loan.connect(borrower).repay()
        ).to.be.revertedWith("Loan already repaid");
    });

    it("Should not allow repayment if the loan is overdue", async function () {
        await loan.setDueDate(Math.floor(Date.now() / 1000) - 60); // geçmiş bir tarih

        const amountToRepay = ethers.utils.parseUnits("500", 18).add(ethers.utils.parseUnits("500", 18).mul(5).div(100));
        
        await token.mint(borrower.address, amountToRepay);
        await token.connect(borrower).approve(loan.address, amountToRepay);

        await expect(
            loan.connect(borrower).repay()
        ).to.be.revertedWith("Loan overdue");
    });
});
