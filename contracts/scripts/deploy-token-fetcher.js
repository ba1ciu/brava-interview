const hre = require("hardhat");

async function main() {
  console.log("Deploying TokenFetcher contract...");

  // Deploy TokenFetcher
  const TokenFetcher = await hre.ethers.getContractFactory("TokenFetcher");
  const tokenFetcher = await TokenFetcher.deploy();

  await tokenFetcher.waitForDeployment();
  
  const address = await tokenFetcher.getAddress();
  console.log(`TokenFetcher deployed to: ${address}`);
  
  // Verify on Etherscan if not on a local network
  const networkName = hre.network.name;
  if (networkName !== "hardhat" && networkName !== "localhost") {
    console.log("Waiting for block confirmations...");
    // Wait for a few block confirmations to ensure the contract is mined
    await tokenFetcher.deploymentTransaction().wait(5);
    
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
      });
      console.log("Contract verified on Etherscan!");
    } catch (error) {
      console.error("Error verifying contract:", error);
    }
  }

  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 