const hre = require("hardhat");

async function main() {
  // Get the token and fetcher addresses from command line
  const tokenFetcherAddress = process.env.TOKEN_FETCHER_ADDRESS;
  const testTokenAddress = process.env.TEST_TOKEN_ADDRESS;
  
  if (!tokenFetcherAddress || !testTokenAddress) {
    console.error("Please set TOKEN_FETCHER_ADDRESS and TEST_TOKEN_ADDRESS environment variables");
    process.exit(1);
  }
  
  // Amount to transfer (default to 1 token with 18 decimals)
  const amount = process.env.TRANSFER_AMOUNT ? 
    hre.ethers.parseUnits(process.env.TRANSFER_AMOUNT, 18) : 
    hre.ethers.parseUnits("1", 18);
  
  console.log(`Fetching ${hre.ethers.formatUnits(amount, 18)} tokens from ${testTokenAddress}`);
  
  // Get contracts
  const TokenFetcher = await hre.ethers.getContractFactory("TokenFetcher");
  const tokenFetcher = TokenFetcher.attach(tokenFetcherAddress);
  
  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const testToken = TestToken.attach(testTokenAddress);
  
  // Get signer
  const [signer] = await hre.ethers.getSigners();
  const signerAddress = await signer.getAddress();
  
  // Check token balance
  const balance = await testToken.balanceOf(signerAddress);
  console.log(`Your balance: ${hre.ethers.formatUnits(balance, 18)} tokens`);
  
  if (balance < amount) {
    console.error("Error: Insufficient balance to transfer the requested amount");
    process.exit(1);
  }
  
  // Approve token transfer
  console.log("Approving TokenFetcher to spend tokens...");
  const approveTx = await testToken.approve(tokenFetcherAddress, amount);
  await approveTx.wait();
  console.log(`Approval transaction: ${approveTx.hash}`);
  
  try {
    // Fetch the token (transfers tokens to the TokenFetcher contract)
    console.log("Fetching tokens (transferring to TokenFetcher)...");
    const fetchTx = await tokenFetcher.fetchToken(testTokenAddress, amount);
    const receipt = await fetchTx.wait();
    
    console.log(`Transaction hash: ${fetchTx.hash}`);
    
    // Get token information from logs
    const events = receipt.logs
      .filter(log => log.address === tokenFetcherAddress)
      .map(log => {
        try {
          return TokenFetcher.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);
    
    const tokenFetchedEvent = events.find(event => event.name === 'TokenFetched');
    if (tokenFetchedEvent) {
      console.log("\nToken successfully fetched!");
      console.log(`Amount transferred: ${hre.ethers.formatUnits(tokenFetchedEvent.args.amount, 18)}`);
    }
    
    // Check new balances
    const newUserBalance = await testToken.balanceOf(signerAddress);
    const contractBalance = await testToken.balanceOf(tokenFetcherAddress);
    
    console.log("\nBalances after transfer:");
    console.log(`Your balance: ${hre.ethers.formatUnits(newUserBalance, 18)} tokens`);
    console.log(`TokenFetcher balance: ${hre.ethers.formatUnits(contractBalance, 18)} tokens`);
    
  } catch (error) {
    console.error("Error fetching token:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 