import '@/styles/globals.css';
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useState } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

// Create wagmi config
const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
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