# TokenFetcher Contract

This is a Hardhat project containing a `TokenFetcher` contract with a `fetchToken` function that allows users to fetch information about ERC20 tokens, including name, symbol, decimals, and the balance of a specified user.

## Project Structure

- `contracts/`: Smart contract source code
  - `TokenFetcher.sol`: Main contract with the fetchToken function
  - `TestToken.sol`: An ERC20 token for testing
- `scripts/`: Deployment and interaction scripts
  - `deploy-token-fetcher.js`: Deploy the TokenFetcher contract
  - `deploy-test-token.js`: Deploy the test token
  - `approve-test-token.js`: Approve the test token in the TokenFetcher
  - `fetch-token-info.js`: Fetch token information using the contract
- `test/`: Test files

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file with your private key and RPC URL:
```
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://virtual.sepolia.rpc.tenderly.co/a3f2b690-176c-4c64-9b8d-85a9893ef4e3
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

## Testing

Run the tests:
```
npx hardhat test
```

## Deployment

### Deploy to local network
```
npx hardhat node
npx hardhat run scripts/deploy-token-fetcher.js --network localhost
npx hardhat run scripts/deploy-test-token.js --network localhost
```

### Deploy to Sepolia testnet
```
npx hardhat run scripts/deploy-token-fetcher.js --network sepolia
npx hardhat run scripts/deploy-test-token.js --network sepolia
```

### Deploy to Devnet
```
npx hardhat run scripts/deploy-token-fetcher.js --network devnet
npx hardhat run scripts/deploy-test-token.js --network devnet
```

## Interacting with the Contracts

After deployment, set the contract addresses in your environment:
```
export TOKEN_FETCHER_ADDRESS=0x...
export TEST_TOKEN_ADDRESS=0x...
```

Then run:
```
# Approve the token in the TokenFetcher
npx hardhat run scripts/approve-test-token.js --network sepolia

# Fetch token information
npx hardhat run scripts/fetch-token-info.js --network sepolia
```

## TokenFetcher Contract Features

- `fetchToken(address tokenAddress, address userAddress)`: Fetches token name, symbol, decimals, and balance
- Token approval system to control which tokens can be fetched
- Owner can add or remove tokens from the approved list

## TestToken Contract

A simple ERC20 token for testing with customizable parameters:
- Name
- Symbol
- Decimals
- Initial supply

The test token can be used to verify the TokenFetcher functionality on any network.

## Networks

The project is configured to work with:
- Local Hardhat network
- Sepolia testnet
- Custom Devnet (ID: 9191919191)

The Devnet configuration matches the one found in the `src/utils/chains.ts` file.
