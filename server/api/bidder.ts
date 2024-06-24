import { logger } from '../utils';
import RetryProvider from '../RetryProvider';
import { Pool } from 'pg';
import {
  getAddressBidsHistory,
  getAddressLargestBid,
  getAddressNouns,
  getAddressWins,
} from '../db/queries';
import { Noun } from './types';

const log = logger.child({ source: 'bidder' });
const provider = new RetryProvider(5, process.env.PROVIDER_URL!);

async function fetchEtherPrice() {
  const response = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=ETH');
  const body = await response.json();
  return Number(body.data.rates.USD);
}

async function fetchAddressBalance(address: string) {
  const etherPrice = await fetchEtherPrice();
  const ethBalance = await provider.getBalance(address);
  const usdBalance = Number(ethBalance) * Math.round(etherPrice);

  return {
    eth: ethBalance.toString(),
    usd: usdBalance.toString(),
  };
}

async function getAddressDataFromDB(address: string) {
  const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });

  const nouns = await getAddressNouns.run({ address }, pgPool);
  const [wins] = await getAddressWins.run({ address }, pgPool);
  const [largestBid] = await getAddressLargestBid.run({ address }, pgPool);
  const bidderHistory = await getAddressBidsHistory.run({ address }, pgPool);

  return {
    nouns,
    wins,
    largestBid: {
      id: largestBid.auctionId,
      value: largestBid.value,
      noun: {
        id: largestBid.auctionId,
        background: largestBid.background,
        body: largestBid.body,
        accessory: largestBid.accessory,
        head: largestBid.head,
        glasses: largestBid.glasses,
      } as Noun,
    },
    bidderHistory,
  };
}

export default async function getAddressData(address: string) {
  const [ens, balance, data] = await Promise.all([
    provider.lookupAddress(address || '').catch(() => null),
    fetchAddressBalance(address),
    getAddressDataFromDB(address),
  ]);
  return { ens, balance, ...data };
}
