import { logger } from '../utils';
import RetryProvider from '../RetryProvider';
import { Pool } from 'pg';
import {
  getAddressBidsHistory,
  getAddressDomains,
  getAddressLargestBid,
  getAddressNouns,
  getAddressDapps,
  getAddressWins,
  getWalletByAddress,
  insertWalletBio,
} from '../db/queries';
import { Noun } from './types';

const log = logger.child({ source: 'bidder' });
const provider = new RetryProvider(5, process.env.PROVIDER_URL!);
const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });
const socialUrls = new Map<string | null, string>([
  ['farcaster', 'https://warpcast.com/'],
  [null, 'https://etherscan.io/address/'],
]);

async function fetchEtherPrice() {
  const response = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=ETH');
  const body = await response.json();
  return Number(body.data.rates.USD);
}

async function fetchAddressBalance(address: string) {
  const etherPrice = await fetchEtherPrice();
  const ethBalance = await provider.getBalance(address);
  const usdBalance = ethBalance * BigInt(Math.round(etherPrice));

  return {
    eth: ethBalance.toString(),
    usd: usdBalance.toString(),
  };
}

async function getAddressDataFromDB(walletAddress: string) {
  const [details] = await getWalletByAddress.run({ address: walletAddress }, pgPool);
  const nouns = await getAddressNouns.run({ address: walletAddress }, pgPool);
  const [wins] = await getAddressWins.run({ address: walletAddress }, pgPool);
  const [largestBid] = await getAddressLargestBid.run({ address: walletAddress }, pgPool);
  const bidderHistory = await getAddressBidsHistory.run({ address: walletAddress }, pgPool);
  const domains = await getAddressDomains.run({ address: walletAddress }, pgPool);
  const dapps = await getAddressDapps.run({ address: walletAddress }, pgPool);

  const { address, ens = null, bio = null } = details;

  const largestBidDetails = largestBid
    ? {
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
      }
    : null;

  return {
    details: address ? details : { address: walletAddress, ens, bio },
    nouns,
    wins,
    largestBid: largestBidDetails,
    bidderHistory,
    domains,
    dapps: dapps.map((dapp) => ({
      ...dapp,
      url: `${socialUrls.get(dapp.type)}${dapp.nickname}`,
    })),
  };
}

export async function inserNewBio(bidder: string, bio: string, author: string) {
  return await insertWalletBio.run({ author, bidder, bio }, pgPool);
}

export default async function getAddressData(address: string) {
  if (!address) {
    return null;
  }
  const [balance, data] = await Promise.all([
    fetchAddressBalance(address),
    getAddressDataFromDB(address),
  ]);
  return { balance, ...data };
}
