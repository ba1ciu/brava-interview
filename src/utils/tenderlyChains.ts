// Note: In wagmi V2, we would create a chain definition as follows:
// For this example, we'll use a simple object that matches the Chain interface

// Get the Tenderly Virtual TestNet RPC URL from environment variables
const TENDERLY_VIRTUAL_TESTNET_RPC = 
  process.env.NEXT_PUBLIC_TENDERLY_VIRTUAL_TESTNET_RPC;

// Define a Tenderly Virtual TestNet chain
// This is a sample configuration - adjust the values to match your specific Virtual TestNet
export const tenderlyVirtualTestNet = {
  id: 73571, // Replace with your Virtual TestNet's chain ID
  name: 'Tenderly Virtual TestNet',
  network: 'tenderly-testnet',
  nativeCurrency: {
    name: 'Virtual Ether',
    symbol: 'vETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [TENDERLY_VIRTUAL_TESTNET_RPC || ''],
    },
    public: {
      http: [TENDERLY_VIRTUAL_TESTNET_RPC || ''],
    },
  },
  blockExplorers: {
    default: {
      name: 'Tenderly Explorer',
      url: 'https://dashboard.tenderly.co/explorer/vnet/', // Update with your Virtual TestNet's explorer URL
    },
  },
  // Add ENS registry and other contracts if available in your Virtual TestNet
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14353601,
    },
    // Add other contracts as needed
  },
}; 