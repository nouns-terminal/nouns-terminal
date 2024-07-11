import { LiveQuery, liveQuery } from './api/vitals';
import { Pool } from 'pg';
import {
  getAuctionById,
  getBidsByAuctionId,
  getLatestAuctionId,
  getNounById,
  getNounPropertiesById,
  getWalletsByAuctionId,
} from './db/queries';
import { AuctionData, Bid } from './api/types';

const liveCache = new Map();
const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });

export function getLiveAuctionData(id?: number | null): LiveQuery<AuctionData> {
  if (!liveCache.has(id)) {
    liveCache.set(
      id,
      liveQuery(() => getAuctionData(id)),
    );
  }

  return liveCache.get(id);
}

export default async function getAuctionData(id?: number | null) {
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
  const nounProperties = await getNounPropertiesById.run({ id }, pgPool);

  const bidsWithBalanceChange = bids.map((bid) => ({
    ...bid,
    walletBalanceChange: null as null | string,
  }));

  const lastSeenBalance = new Map<string, bigint>();
  for (let i = bidsWithBalanceChange.length - 1; i >= 0; i--) {
    const bid = bidsWithBalanceChange[i];
    if (bid.walletBalance == null) {
      continue;
    }

    const lastBalance = lastSeenBalance.get(bid.walletAddress);
    if (lastBalance) {
      bid.walletBalanceChange = (
        BigInt(bid.walletBalance) +
        BigInt(bid.value!) -
        lastBalance
      ).toString();
    }

    lastSeenBalance.set(bid.walletAddress, BigInt(bid.walletBalance) + BigInt(bid.value!));
  }

  return {
    auction,
    noun,
    bids: bidsWithBalanceChange,
    wallets,
    nounProperties,
  };
}
