import '../styles/globals.css';
// import '@rainbow-me/rainbowkit/styles.css';
// import { darkTheme, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { ConnectKitProvider, ConnectKitButton, getDefaultClient } from 'connectkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import type { AppProps } from 'next/app';
import { withTRPC } from '@trpc/next';
import { type AppRouter } from '../server/api/router';
import { createWSClient, wsLink } from '@trpc/client/links/wsLink';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { createTRPCClient } from '@trpc/client';
import getConfig from 'next/config';
import LiveStatus from '../components/LiveStatus';
import Head from 'next/head';

const { publicRuntimeConfig } = getConfig();
const { APP_URL, WS_URL } = publicRuntimeConfig;

// const { chains, provider } = configureChains(
//   [chain.mainnet],
//   [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
// );

// const { connectors } = getDefaultWallets({
//   appName: 'Nouns Auction',
//   chains,
// });

// const wagmiClient = createClient({
//   autoConnect: true,
//   connectors,
//   provider,
// });

const client = createClient(
  getDefaultClient({
    appName: 'Nouns Auction',
    alchemyId: process.env.ALCHEMY_ID!,
    chains: [chain.mainnet],
  })
);

function MyApp({ Component, pageProps }: AppProps) {
  //   <RainbowKitProvider
  //     chains={chains}
  //     showRecentTransactions={true}
  //     theme={darkTheme({
  //       accentColor: 'var(--yellow)',
  //       accentColorForeground: 'black',
  //       borderRadius: 'none',
  //       fontStack: 'system',
  //       overlayBlur: 'small',
  //     })}
  //   >
  //   </RainbowKitProvider>

  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider
        theme="midnight"
        customTheme={{
          '--ck-border-radius': 0,
          '--ck-font-family': '"Proto Mono", sans-serif',
        }}
      >
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
      </ConnectKitProvider>
    </WagmiConfig>
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
