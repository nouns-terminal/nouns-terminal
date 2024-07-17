import { formatEther } from 'viem';
import { ImageData, getNounData } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk/dist/image/svg-builder';
import { Noun } from '../server/api/types';
import { http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

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

export function formatBidValue(value: bigint) {
  const s = formatEther(value);
  if (s.includes('.')) {
    return s;
  }
  return s + '.0';
}

export function createNounSVG(noun: Noun, isBackground?: boolean): string {
  if (!noun) {
    return '';
  }

  try {
    const data = getNounData(noun);
    const { parts, background } = data;

    let svgBinary;

    if (isBackground) {
      svgBinary = buildSVG(parts, ImageData.palette, background);
    } else {
      svgBinary = buildSVG(parts, ImageData.palette);
    }

    return 'data:image/svg+xml;base64,' + btoa(svgBinary);
  } catch (e) {
    console.error(e);
    return '';
  }
}
