import '@/styles/globals.css';
import { devnet } from '@/utils/chains';
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useState } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

// Create wagmi config
const config = createConfig({
  chains: [mainnet, sepolia, devnet],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [devnet.id]: http('https://virtual.sepolia.rpc.tenderly.co/3e543b33-fe1b-4ce6-9af9-bb6d848f06b0'),
  },
});

export default function App({ Component, pageProps }: AppProps) {
  // Create a new QueryClient for each request (rather than singleton)
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Don't retry on the server
        retry: false,
        // Don't refetch on window focus in development
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={pageProps.dehydratedState}>
          <Head>
            <title>Custom Contract Token Fetcher</title>
          </Head>
          <Component {...pageProps} />
        </HydrationBoundary>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 