import { formatUnits, parseUnits } from 'ethers';

// Common ERC20 ABI for basic functions
export const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' }
    ],
    outputs: [
      { name: 'balance', type: 'uint256' }
    ]
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    outputs: [
      { name: 'remaining', type: 'uint256' }
    ]
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: '', type: 'uint8' }
    ]
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: '', type: 'string' }
    ]
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' }
    ],
    outputs: [
      { name: 'success', type: 'bool' }
    ]
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' }
    ],
    outputs: [
      { name: 'success', type: 'bool' }
    ]
  },
  {
    name: 'Transfer',
    type: 'event',
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' }
    ]
  },
  {
    name: 'Approval',
    type: 'event',
    anonymous: false,
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'spender', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' }
    ]
  }
];

export const CONTRACT_ABI = [
  {
    name: 'fetchToken',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'tokenAddress', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: []
  }
];

// Contract address for the custom contract
export const CONTRACT_ADDRESS = '0x171B3d88530F1eD54831278d7B569CaA55AbaA65'; // Replace with your actual contract address

// Sample ERC20 token addresses on Sepolia
export const SAMPLE_TOKEN_ADDRESSES = {
  USDC: '0xf08A50178dfcDe18524640EA6618a1f965821715', // Sepolia USDC
  LINK: '0x779877A7B0D9E8603169DdbD7836e478b4624789', // Sepolia LINK 
  DAI: '0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6',  // Sepolia DAI
};

// Format balance to a readable string
export function formatTokenBalance(balance: bigint, decimals: number): string {
  return formatUnits(balance, decimals);
}

// Convert amount to token units
export function parseTokenAmount(amount: string, decimals: number): bigint {
  return parseUnits(amount, decimals);
}

// Format address for display
export function formatAddress(address: string, length = 4): string {
  if (!address) return '';
  return `${address.substring(0, 2 + length)}...${address.substring(address.length - length)}`;
}

// Estimate gas for a transaction
export async function estimateGasForTransaction(
  to: string, 
  value: bigint,
  data: string,
  provider: any
): Promise<bigint> {
  try {
    const gasEstimate = await provider.estimateGas({
      to,
      value,
      data,
    });
    
    // Add a 10% buffer to the gas estimate
    return (gasEstimate * BigInt(110)) / BigInt(100);
  } catch (error) {
    console.error('Error estimating gas:', error);
    throw error;
  }
}

// Basic transaction simulator interface
export interface TransactionSimulation {
  success: boolean;
  gasUsed?: bigint;
  error?: string;
  gasCostInEth?: string;
  gasCostInUSD?: string;
  simulationDetails?: {
    blockNumber?: string;
    trace?: any[];
    logs?: any[];
    [key: string]: any; // Allow for additional details
  };
} 