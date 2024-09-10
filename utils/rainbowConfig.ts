import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { mainnet } from 'viem/chains';

export const config = getDefaultConfig({
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
