const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Collateral", function () {
    let Collateral, collateral, Token, token;
    let owner, user;

    beforeEach(async function () {
        [owner, user] = await ethers.getSigners();

        Token = await ethers.getContractFactory("Token");
        token = await Token.deploy();
        await token.deployed();

        Collateral = await ethers.getContractFactory("Collateral");
        collateral = await Collateral.deploy(token.address);
        await collateral.deployed();
    });

    it("Should allow users to deposit collateral", async function () {
        await token.mint(user.address, ethers.utils.parseUnits("1000", 18));
        await token.connect(user).approve(collateral.address, ethers.utils.parseUnits("500", 18));

        await collateral.connect(user).depositCollateral(ethers.utils.parseUnits("500", 18));

        expect(await collateral.collateral(user.address)).to.equal(ethers.utils.parseUnits("500", 18));
    });

    it("Should allow users to withdraw collateral", async function () {
        await token.mint(user.address, ethers.utils.parseUnits("1000", 18));
        await token.connect(user).approve(collateral.address, ethers.utils.parseUnits("500", 18));

        await collateral.connect(user).depositCollateral(ethers.utils.parseUnits("500", 18));
        await collateral.connect(user).withdrawCollateral(ethers.utils.parseUnits("300", 18));

        expect(await collateral.collateral(user.address)).to.equal(ethers.utils.parseUnits("200", 18));
    });

    it("Should not allow withdrawal of more collateral than deposited", async function () {
        await token.mint(user.address, ethers.utils.parseUnits("1000", 18));
        await token.connect(user).approve(collateral.address, ethers.utils.parseUnits("500", 18));

        await collateral.connect(user).depositCollateral(ethers.utils.parseUnits("500", 18));

        await expect(
            collateral.connect(user).withdrawCollateral(ethers.utils.parseUnits("600", 18))
        ).to.be.revertedWith("Insufficient collateral");
    });
});
