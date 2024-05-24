import '../styles/globals.css';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getDefaultConfig, midnightTheme, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { withTRPC } from '@trpc/next';
import { type AppRouter } from '../server/api/router';
import { createWSClient, wsLink } from '@trpc/client/links/wsLink';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import getConfig from 'next/config';
import LiveStatus from '../components/LiveStatus';
import Head from 'next/head';
import merge from 'lodash.merge';

const { publicRuntimeConfig } = getConfig();
const { APP_URL } = publicRuntimeConfig;

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}

const config = getDefaultConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(process.env.PROVIDER_URL!),
  },

  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

  // Required App Info
  appName: 'Nouns Terminal',

  // Optional App Info
  appDescription: 'Advanced interface for Nouns Auction',
  appUrl: 'https://nouns.sh/', // your app's url
  appIcon: 'https://nouns.sh/favicon.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
});

const queryClient = new QueryClient();

const customTheme = merge(midnightTheme(), {
  colors: {
    modalBackground: 'var(--surface-bg)',
  },
  fonts: {
    body: '"Proto Mono", sans-serif',
  },
} as Theme);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme}>
          <Component {...pageProps} />
          <LiveStatus />
          <Head>
            <title>Nouns Terminal</title>
            <meta name="description" content="Advanced interface for Nouns Auction" />
            <meta property="og:title" content="Nouns Terminal" />
            <meta property="og:description" content="Advanced interface for Nouns Auction" />
            <meta property="og:url" content="https://nouns.sh/" />
            <meta property="og:image" content="https://nouns.sh/og_image.png" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content="@w1nt3r_eth" />
            <meta name="twitter:title" content="Nouns Terminal" />
            <meta name="twitter:description" content="Advanced interface for Nouns Auction" />
            <meta name="twitter:image" content="https://nouns.sh/og_image.png" />
            <link rel="icon" href="/favicon.png" />
          </Head>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // reference for render.com
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export let latestWebSocket: WebSocket | null = null;

function getEndingLink() {
  if (typeof window === 'undefined') {
    return httpBatchLink({
      url: `${APP_URL}/api/trpc`,
    });
  }

  class TrackedWebSocket extends WebSocket {
    constructor(url: string | URL, protocols?: string | string[]) {
      super(url, protocols);
      latestWebSocket = this;
    }
  }

  return wsLink<AppRouter>({
    client: createWSClient({
      WebSocket: TrackedWebSocket,
      url: getBaseUrl().replace(/^http/, 'ws') + '/trpc',
      retryDelayMs: (attemptIndex) =>
        attemptIndex === 0 ? 0 : Math.min(1_000 * 2 ** attemptIndex, 5_000),
    }),
  });
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    return {
      url: `${getBaseUrl()}/api/trpc`,
      links: [getEndingLink()],
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
