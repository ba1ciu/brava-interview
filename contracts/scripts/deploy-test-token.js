const hre = require("hardhat");

async function main() {
  console.log("Deploying TestToken contract...");
  
  // Token parameters
  const name = "Test Token";
  const symbol = "TST";
  const decimals = 18;
  const initialSupply = 1000000; // 1 million tokens
  
  // Deploy TestToken
  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const testToken = await TestToken.deploy(name, symbol, decimals, initialSupply);
  
  await testToken.waitForDeployment();
  
  const address = await testToken.getAddress();
  console.log(`TestToken deployed to: ${address}`);
  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`Decimals: ${decimals}`);
  console.log(`Initial Supply: ${initialSupply} tokens`);
  
  // Verify on Etherscan if not on a local network
  const networkName = hre.network.name;
  if (networkName !== "hardhat" && networkName !== "localhost") {
    console.log("Waiting for block confirmations...");
    // Wait for a few block confirmations to ensure the contract is mined
    await testToken.deploymentTransaction().wait(5);
    
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [name, symbol, decimals, initialSupply],
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