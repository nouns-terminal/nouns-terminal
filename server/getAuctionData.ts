import { LiveQuery, liveQuery } from './api/vitals';
import { Pool } from 'pg';
import {
  getAuctionById,
  getBidsByAuctionId,
  getLatestAuctionId,
  getNounById,
  getWalletsByAuctionId,
} from './db/queries';
import { AuctionData } from './api/types';

const liveCache = new Map();

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
