import ConnectButton from '@/components/ConnectButton';
import NetworkSwitcher from '@/components/NetworkSwitcher';
import TransactionSimulator from '@/components/TransactionSimulator';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export default function Home() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  // Only render UI after component has mounted to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>Custom Contract Token Fetcher</title>
        <meta name="description" content="Custom Contract Token Fetcher Challenge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">Custom Contract Token Fetcher</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Wallet Connection</h2>
            <p className="mb-4">Connect your wallet to fetch tokens using our custom contract.</p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>

          {mounted && isConnected && (
            <>
              <div className="max-w-3xl mx-auto mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-semibold mb-4">Network Selection</h2>
                  <p className="text-gray-600 mb-4">
                    Select a network or add our custom Devnet for enhanced features.
                  </p>
                  <NetworkSwitcher />
                </div>
              </div>

              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-semibold mb-4">Token Fetcher</h2>
                  <p className="text-gray-600 mb-4">
                    Fetch tokens using our custom contract. Select a token and amount, 
                    then simulate to see gas costs and execution details.
                  </p>
                  <TransactionSimulator />
                </div>
              </div>
            </>
          )}
          
          {mounted && !isConnected && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Token Fetcher</h2>
                <p className="text-gray-600">
                  Connect your wallet above to fetch tokens using our custom contract.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
} 