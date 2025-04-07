import { isTenderlyVirtualTestNet, simulateFetchTokens } from '@/utils/tenderly';
import { ERC20_ABI, SAMPLE_TOKEN_ADDRESSES } from '@/utils/web3';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useAccount, useChainId, usePublicClient, useReadContracts, useWriteContract } from 'wagmi';

// Token configuration
const TOKENS = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: SAMPLE_TOKEN_ADDRESSES.USDC,
    decimals: 6,
    logo: '💵'
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    address: SAMPLE_TOKEN_ADDRESSES.LINK,
    decimals: 18,
    logo: '🔗'
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    address: SAMPLE_TOKEN_ADDRESSES.DAI,
    decimals: 18,
    logo: '🔶'
  }
];

export default function TransactionSimulator() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [amount, setAmount] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  
  // Check if we're using a Tenderly Virtual TestNet
  const isVirtualTestNet = isTenderlyVirtualTestNet(chainId);
  
  // Use wagmi hooks for contract interactions
  const { writeContractAsync } = useWriteContract();

  // Read token balance and allowance
  const tokenReadResults = useReadContracts({
    contracts: [
      {
        address: selectedToken.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      },
      {
        address: selectedToken.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'decimals',
      },
      {
        address: selectedToken.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'symbol',
      },
    ],
    query: {
      enabled: isConnected && !!address,
    },
  });

  // Extract values from read results
  const tokenBalance = tokenReadResults.data?.[0]?.result as bigint || BigInt(0);
  const tokenDecimals = tokenReadResults.data?.[1]?.result as number || selectedToken.decimals;
  const tokenSymbol = tokenReadResults.data?.[2]?.result as string || selectedToken.symbol;

  // Format token balance for display
  const formattedBalance = tokenBalance 
    ? parseFloat(ethers.formatUnits(tokenBalance, tokenDecimals)).toFixed(tokenDecimals === 6 ? 2 : 4)
    : '0.00';

  // Only render UI after component has mounted to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update when selected token changes
  useEffect(() => {
    // Reset state when token changes
    setAmount('');
    setSimulationResult(null);
    setErrorMessage('');
  }, [selectedToken]);

  // Function to simulate token transfer
  const simulateTransaction = async () => {
    if (!address) {
      setErrorMessage('Wallet not connected');
      return;
    }
    
    if (!amount) {
      setErrorMessage('Please enter amount');
      return;
    }

    // Validate amount
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setErrorMessage('Please enter a valid amount');
      return;
    }

    // Check if the user has enough balance
    const requestedAmountInWei = ethers.parseUnits(amount, tokenDecimals);
    if (requestedAmountInWei > tokenBalance) {
      setErrorMessage(`Insufficient ${tokenSymbol} balance`);
      return;
    }

    try {
      setIsSimulating(true);
      setErrorMessage('');
      setSimulationResult(null);
      setShowDetails(false);
      
      // Use Tenderly to simulate the fetchTokens operation
      const result = await simulateFetchTokens(
        address,
        selectedToken.address,
        amount,
        tokenDecimals,
        chainId
      );

      if (result.success) {
        setSimulationResult({
          success: true,
          gasEstimationEth: result.gasCostInEth || '0.000021',
          gasEstimationUSD: result.gasCostInUSD || '0.042',
          amount,
          tokenSymbol,
          tokenDecimals,
          tokenAddress: selectedToken.address,
          isVirtualTestNet,
          details: result.simulationDetails,
        });
      } else {
        setErrorMessage(result.error || 'Simulation failed');
      }
      
      setIsSimulating(false);
    } catch (error: any) {
      console.error('Simulation error:', error);
      setErrorMessage(error.message || 'Error simulating transaction');
      setIsSimulating(false);
    }
  };

  // Toggle showing additional simulation details
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Function to handle token transfer
  const handleTokenTransfer = async () => {
    if (!simulationResult || !address) return;

    try {
      // ¯\_(ツ)_/¯
    } catch (error: any) {
      console.error('Transfer error:', error);
      setErrorMessage(error.message || 'Error executing fetchTokens');
    }
  };

  // Don't render anything until after client-side hydration
  if (!mounted) return null;

  if (!isConnected) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Connect your wallet to simulate token transfers</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-4">
        {isVirtualTestNet && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800">
            Using Tenderly Virtual TestNet for simulation. Results will be more accurate and include detailed transaction tracing!
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Token</label>
          <div className="relative">
            <select
              value={selectedToken.symbol}
              onChange={(e) => {
                const token = TOKENS.find(t => t.symbol === e.target.value);
                if (token) setSelectedToken(token);
              }}
              className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {TOKENS.map((token) => (
                <option key={token.address} value={token.symbol}>
                  {token.logo} {token.name} ({token.symbol})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          {tokenReadResults.isSuccess && (
            <div className="mt-1 text-sm text-gray-600">
              Your balance: {formattedBalance} {tokenSymbol}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount ({tokenSymbol})</label>
          <input
            type="number"
            placeholder="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step={tokenDecimals === 6 ? "0.01" : "0.001"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {errorMessage && (
          <div className="text-red-500 text-sm">{errorMessage}</div>
        )}

        <button
          onClick={simulateTransaction}
          disabled={isSimulating || !amount}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md disabled:bg-blue-300"
        >
          {isSimulating ? (
            isVirtualTestNet ? 'Simulating on Virtual TestNet...' : 'Simulating with Tenderly...'
          ) : 'Simulate Token Fetch'}
        </button>

        {simulationResult && (
          <div className="mt-4 bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-lg mb-2">
              Simulation Results {simulationResult.isVirtualTestNet ? '(via Virtual TestNet)' : '(via Tenderly)'}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Token:</span>
                <span className="font-medium">{simulationResult.tokenSymbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">{simulationResult.amount} {simulationResult.tokenSymbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Gas (ETH):</span>
                <span className="font-medium">{simulationResult.gasEstimationEth} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Gas (USD):</span>
                <span className="font-medium">${simulationResult.gasEstimationUSD}</span>
              </div>
              
              {/* Show additional details for Virtual TestNet simulations */}
              {simulationResult.isVirtualTestNet && simulationResult.details && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <button 
                    onClick={toggleDetails}
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium focus:outline-none"
                  >
                    {showDetails ? 'Hide Advanced Details' : 'Show Advanced Details'}
                  </button>
                  
                  {showDetails && (
                    <div className="mt-2 text-sm">
                      {simulationResult.details.blockNumber && (
                        <div className="flex justify-between mt-1">
                          <span className="text-gray-600">Block Number:</span>
                          <span className="font-medium">{simulationResult.details.blockNumber}</span>
                        </div>
                      )}
                      
                      {simulationResult.details.logs && simulationResult.details.logs.length > 0 && (
                        <div className="mt-2">
                          <div className="text-gray-600 font-medium">Events Emitted:</div>
                          <div className="mt-1 bg-gray-100 p-2 rounded overflow-auto max-h-40">
                            <pre className="text-xs">{JSON.stringify(simulationResult.details.logs, null, 2)}</pre>
                          </div>
                        </div>
                      )}
                      
                      {simulationResult.details.trace && simulationResult.details.trace.length > 0 && (
                        <div className="mt-2">
                          <div className="text-gray-600 font-medium">Execution Trace:</div>
                          <div className="text-xs text-gray-500 mb-1">
                            (Showing first 3 items of {simulationResult.details.trace.length})
                          </div>
                          <div className="mt-1 bg-gray-100 p-2 rounded overflow-auto max-h-60">
                            <pre className="text-xs">{JSON.stringify(simulationResult.details.trace.slice(0, 3), null, 2)}</pre>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="mt-4">
              <button 
                onClick={handleTokenTransfer}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md disabled:bg-green-300"
              >
                Confirm and Fetch Tokens
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 