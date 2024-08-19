async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();
    await token.deployed();
    console.log("Token deployed to:", token.address);
  
    const LendingPlatform = await ethers.getContractFactory("LendingPlatform");
    const lendingPlatform = await LendingPlatform.deploy(token.address);
    await lendingPlatform.deployed();
    console.log("LendingPlatform deployed to:", lendingPlatform.address);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  