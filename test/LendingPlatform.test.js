const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LendingPlatform", function () {
    let LendingPlatform, lendingPlatform, Token, token;
    let owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        Token = await ethers.getContractFactory("Token");
        token = await Token.deploy();
        await token.deployed();

        LendingPlatform = await ethers.getContractFactory("LendingPlatform");
        lendingPlatform = await LendingPlatform.deploy(token.address);
        await lendingPlatform.deployed();
    });

    it("Should allow users to lend tokens", async function () {
        await token.mint(addr1.address, ethers.utils.parseUnits("1000", 18));
        await token.connect(addr1).approve(lendingPlatform.address, ethers.utils.parseUnits("500", 18));

        await lendingPlatform.connect(addr1).lend(ethers.utils.parseUnits("500", 18), 5, 60 * 60 * 24 * 7); // 1 hafta

        const loans = await lendingPlatform.loans(addr1.address, 0);
        expect(loans.amount.toString()).to.equal(ethers.utils.parseUnits("500", 18).toString());
        expect(loans.interestRate.toString()).to.equal("5");
        expect(loans.dueDate).to.be.above(Math.floor(Date.now() / 1000));
        expect(loans.dueDate).to.be.below(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7);
        expect(loans.repaid).to.equal(false);
    });

    it("Should allow users to repay a loan", async function () {
        await token.mint(addr1.address, ethers.utils.parseUnits("1000", 18));
        await token.connect(addr1).approve(lendingPlatform.address, ethers.utils.parseUnits("500", 18));

        await lendingPlatform.connect(addr1).lend(ethers.utils.parseUnits("500", 18), 5, 60 * 60 * 24 * 7);

        const loanIndex = 0;
        const loan = await lendingPlatform.loans(addr1.address, loanIndex);
        const repaymentAmount = loan.amount.add(loan.amount.mul(loan.interestRate).div(100));

        await token.mint(addr1.address, repaymentAmount);
        await token.connect(addr1).approve(lendingPlatform.address, repaymentAmount);

        await lendingPlatform.connect(addr1).repay(loanIndex);

        const updatedLoan = await lendingPlatform.loans(addr1.address, loanIndex);
        expect(updatedLoan.repaid).to.equal(true);
    });

    it("Should not allow repayment if the loan is already repaid", async function () {
        await token.mint(addr1.address, ethers.utils.parseUnits("1000", 18));
        await token.connect(addr1).approve(lendingPlatform.address, ethers.utils.parseUnits("500", 18));

        await lendingPlatform.connect(addr1).lend(ethers.utils.parseUnits("500", 18), 5, 60 * 60 * 24 * 7);
        await lendingPlatform.connect(addr1).repay(0);

        await expect(
            lendingPlatform.connect(addr1).repay(0)
        ).to.be.revertedWith("Loan already repaid");
    });

    it("Should not allow repayment if the loan is overdue", async function () {
        await token.mint(addr1.address, ethers.utils.parseUnits("1000", 18));
        await token.connect(addr1).approve(lendingPlatform.address, ethers.utils.parseUnits("500", 18));

        await lendingPlatform.connect(addr1).lend(ethers.utils.parseUnits("500", 18), 5, 1); // 1 saniye

        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 saniye bekle

        await expect(
            lendingPlatform.connect(addr1).repay(0)
        ).to.be.revertedWith("Loan overdue");
    });

    it("Should correctly handle multiple loans", async function () {
        await token.mint(addr1.address, ethers.utils.parseUnits("1000", 18));
        await token.connect(addr1).approve(lendingPlatform.address, ethers.utils.parseUnits("500", 18));

        await lendingPlatform.connect(addr1).lend(ethers.utils.parseUnits("500", 18), 5, 60 * 60 * 24 * 7); // 1 hafta
        await lendingPlatform.connect(addr1).lend(ethers.utils.parseUnits("200", 18), 10, 60 * 60 * 24 * 14); // 2 hafta

        const loans = await lendingPlatform.loans(addr1.address, 0);
        expect(loans.amount.toString()).to.equal(ethers.utils.parseUnits("500", 18).toString());
        
        const secondLoan = await lendingPlatform.loans(addr1.address, 1);
        expect(secondLoan.amount.toString()).to.equal(ethers.utils.parseUnits("200", 18).toString());
    });
});
