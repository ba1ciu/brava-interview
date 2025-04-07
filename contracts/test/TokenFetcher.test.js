const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenFetcher", function () {
  let tokenFetcher;
  let testToken;
  let owner;
  let user;
  
  const tokenName = "Test Token";
  const tokenSymbol = "TST";
  const tokenDecimals = 18;
  const initialSupply = 1000000; // 1 million tokens
  
  beforeEach(async function () {
    // Get signers
    [owner, user] = await ethers.getSigners();
    
    // Deploy TestToken
    const TestToken = await ethers.getContractFactory("TestToken");
    testToken = await TestToken.deploy(tokenName, tokenSymbol, tokenDecimals, initialSupply);
    await testToken.waitForDeployment();
    
    // Deploy TokenFetcher
    const TokenFetcher = await ethers.getContractFactory("TokenFetcher");
    tokenFetcher = await TokenFetcher.deploy();
    await tokenFetcher.waitForDeployment();
    
    // Get contract addresses
    testTokenAddress = await testToken.getAddress();
    tokenFetcherAddress = await tokenFetcher.getAddress();
    
    // Transfer some tokens to the user
    await testToken.transfer(user.address, ethers.parseUnits("1000", tokenDecimals));
  });
  
  describe("Token Fetching", function () {
    it("Should transfer tokens from caller to the contract", async function () {
      const transferAmount = ethers.parseUnits("100", tokenDecimals);
      
      // Approve the TokenFetcher contract to spend user's tokens
      await testToken.connect(user).approve(tokenFetcherAddress, transferAmount);
      
      // Check initial balances
      const userInitialBalance = await testToken.balanceOf(user.address);
      const contractInitialBalance = await testToken.balanceOf(tokenFetcherAddress);
      
      // Fetch tokens
      const result = await tokenFetcher.connect(user).fetchToken(testTokenAddress, transferAmount);
      
      // Check final balances
      const userFinalBalance = await testToken.balanceOf(user.address);
      const contractFinalBalance = await testToken.balanceOf(tokenFetcherAddress);
      
      // Verify balances changed correctly
      expect(userFinalBalance).to.equal(userInitialBalance - transferAmount);
      expect(contractFinalBalance).to.equal(contractInitialBalance + transferAmount);
      
      // Verify returned information is correct
      expect(result.name).to.equal(tokenName);
      expect(result.symbol).to.equal(tokenSymbol);
      expect(result.decimals).to.equal(tokenDecimals);
      expect(result.fetchedAmount).to.equal(transferAmount);
    });
    
    it("Should fail if transfer amount is 0", async function () {
      const transferAmount = 0;
      
      await expect(
        tokenFetcher.fetchToken(testTokenAddress, transferAmount)
      ).to.be.revertedWith("Amount must be greater than 0");
    });
    
    it("Should fail if token address is zero", async function () {
      const transferAmount = ethers.parseUnits("100", tokenDecimals);
      
      await expect(
        tokenFetcher.fetchToken(ethers.ZeroAddress, transferAmount)
      ).to.be.revertedWith("Invalid token address");
    });
    
    it("Should fail if not approved", async function () {
      const transferAmount = ethers.parseUnits("100", tokenDecimals);
      
      // Don't approve the TokenFetcher contract to spend tokens
      
      await expect(
        tokenFetcher.connect(user).fetchToken(testTokenAddress, transferAmount)
      ).to.be.reverted; // Either with token-specific message or our "Token transfer failed"
    });
  });
}); 