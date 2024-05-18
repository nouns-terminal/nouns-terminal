import { LiveQuery, liveQuery } from './api/vitals';
import { Pool } from 'pg';
import {
  getAuctionById,
  getBidsByAuctionId,
  getLatestAuctionId,
  getNounById,
  getWalletsByAuctionId,
} from './indexers/queries';

export type Bid = {
  tx: string;
  walletAddress: string;
  value: string;
  extended: boolean;
  timestamp: number;
  maxFeePerGas: string;
};

export type Wallet = {
  address: string;
  ens: string | null;
  bids: number;
  nouns: number | null;
  balance: string | null;
  wins: number | null;
};

export type Auction = {
  id: number;
  startTime: number;
  endTime: number;
  winner: string | null;
  price: string | null;
};

export type Noun = {
  id: number;
  background: number;
  body: number;
  accessory: number;
  head: number;
  glasses: number;
};

export type AuctionData = {
  auction: Auction;
  noun: Noun | null;
  bids: Bid[];
  wallets: Wallet[];
};

const liveCache = new Map();

async function timed<T>(f: Promise<T>): Promise<T> {
  const start = Date.now();
  const result = await f;
  const total = Date.now() - start;
  console.log('FFFFF', { total });
  return result;
}

export function getLiveAuctionData(id?: number | null): LiveQuery<AuctionData> {
  if (!liveCache.has(id)) {
    liveCache.set(
      id,
      liveQuery(() => getAuctionData(id))
    );
  }

  return liveCache.get(id);
}

export default async function getAuctionData(id?: number | null) {
  const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });

  if (id == null) {
    const [res] = await getLatestAuctionId.run({ offset: 0 }, pgPool);
    id = res.id;
  } else if (id < 0) {
    const [res] = await getLatestAuctionId.run({ offset: -id }, pgPool);
    id = res.id;
  }

  const [auction] = await getAuctionById.run({ id }, pgPool);
  const [noun] = await getNounById.run({ id }, pgPool);
  const bids = await getBidsByAuctionId.run({ id }, pgPool);
  const wallets = await getWalletsByAuctionId.run({ id }, pgPool);

  return {
    auction,
    noun,
    bids,
    wallets,
  };
}
