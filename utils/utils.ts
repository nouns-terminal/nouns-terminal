import { formatEther } from 'viem';
import { ImageData, getNounData } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk/dist/image/svg-builder';
import { Noun } from '../server/api/types';

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
