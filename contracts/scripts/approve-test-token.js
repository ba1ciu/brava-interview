const hre = require("hardhat");

async function main() {
  // Get the token and fetcher addresses from command line
  const tokenFetcherAddress = process.env.TOKEN_FETCHER_ADDRESS;
  const testTokenAddress = process.env.TEST_TOKEN_ADDRESS;
  
  if (!tokenFetcherAddress || !testTokenAddress) {
    console.error("Please set TOKEN_FETCHER_ADDRESS and TEST_TOKEN_ADDRESS environment variables");
    process.exit(1);
  }
  
  console.log(`Approving test token ${testTokenAddress} on TokenFetcher at ${tokenFetcherAddress}`);
  
  // Get the TokenFetcher contract
  const TokenFetcher = await hre.ethers.getContractFactory("TokenFetcher");
  const tokenFetcher = TokenFetcher.attach(tokenFetcherAddress);
  
  // Approve the token
  const tx = await tokenFetcher.approveToken(testTokenAddress);
  await tx.wait();
  
  console.log(`Transaction hash: ${tx.hash}`);
  console.log("Test token approved in TokenFetcher!");
  
  // Verify the token is approved
  const isApproved = await tokenFetcher.approvedTokens(testTokenAddress);
  console.log(`Token approval status: ${isApproved}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 