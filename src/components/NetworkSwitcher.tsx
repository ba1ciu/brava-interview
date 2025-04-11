import { devnet } from '@/utils/chains';
import { useEffect, useState } from 'react';
import { useChainId, useConfig, useSwitchChain } from 'wagmi';

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function NetworkSwitcher() {
  const config = useConfig();
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();
  const [mounted, setMounted] = useState(false);
  
  // Only render UI after component has mounted to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until after client-side hydration
  if (!mounted) return null;

  // Function to handle adding Devnet to MetaMask
  const addDevnetToWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed!');
      return;
    }

    try {
      // Request to add the custom chain to MetaMask
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${devnet.id.toString(16)}`,
            chainName: devnet.name,
            nativeCurrency: devnet.nativeCurrency,
            rpcUrls: devnet.rpcUrls.default.http,
            blockExplorerUrls: devnet.blockExplorers ? [devnet.blockExplorers.default.url] : undefined,
          },
        ],
      });
    } catch (error) {
      console.error('Error adding Devnet to MetaMask:', error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="bg-gray-100 px-4 py-2 rounded-lg">
        <span className="font-medium">Network: </span>
        <span className="text-blue-600">
          {chains.find(chain => chain.id === chainId)?.name || `Chain ID ${chainId}`}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {chains.map((chain) => (
          <button
            key={chain.id}
            onClick={() => switchChain({ chainId: chain.id })}
            className={`px-3 py-1 rounded-md text-sm ${
              chain.id === chainId
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {chain.name}
          </button>
        ))}
        
        {/* Button to add Devnet to wallet */}
        <button
          onClick={addDevnetToWallet}
          className="px-3 py-1 rounded-md text-sm bg-green-500 hover:bg-green-600 text-white"
        >
          Add Devnet to Wallet
        </button>
      </div>
      
      {chainId !== devnet.id && (
        <div className="text-xs text-green-600 mt-1">
          👉 Try our new Devnet for enhanced simulation features!
        </div>
      )}
    </div>
  );
} 