import { Chain } from 'wagmi/chains';

// Define a custom devnet chain
export const devnet: Chain = {
  id: 5141514151, // Using Sepolia's chain ID for compatibility
  name: 'Devnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_TENDERLY_VIRTUAL_TESTNET_RPC!],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_TENDERLY_VIRTUAL_TESTNET_RPC!],
    },
  },
  blockExplorers: {
    default: {
      name: 'Tenderly Explorer',
      url: 'https://dashboard.tenderly.co/explorer/devnet/',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14353601,
    },
  },
}; 