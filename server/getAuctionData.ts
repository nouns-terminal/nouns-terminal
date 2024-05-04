import { createPool, sql } from 'slonik';
import { number } from 'zod';
import { LiveQuery, liveQuery } from './api/vitals';

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
  const pool = await createPool(process.env.DATABASE_URL!);

  return await pool.connect(async (connection) => {
    if (typeof id !== 'number') {
      const res = await connection.one<{ id: number }>(
        sql`SELECT "id" FROM auction ORDER BY id DESC LIMIT 1`
      );
      id = res.id;
    } else if (id < 0) {
      const res = await connection.one<{ id: number }>(
        sql`SELECT "id" FROM auction ORDER BY id DESC LIMIT 1 OFFSET ${-id}`
      );
      id = res.id;
    }

    const auction = await connection.one<Auction>(
      sql`SELECT "id", "startTime", "endTime", "winner", "price"::TEXT FROM auction WHERE id = ${id}`
    );

    const noun = await connection.maybeOne<Noun>(sql`SELECT * FROM noun WHERE id = ${id}`);

    const bids = await connection.query<Bid>(sql`
      SELECT
        bid."tx", 
        bid."walletAddress", 
        bid."value"::TEXT,
        bid."extended",
        bid."timestamp",
        bid."maxFeePerGas"::TEXT
      FROM
        bid
      WHERE
        bid."auctionId" = ${auction.id}
      ORDER BY
        bid.value DESC
    `);

    const wallets = await connection.query<Wallet>(sql`
      SELECT DISTINCT
        bid."walletAddress" as "address",
        wallet.ens,
        "wallet_bids_count"."bidsCount" as "bids",
        "wallet"."nouns" as "nouns",
        (wallet."balanceEth" + wallet."balanceWeth")::TEXT as "balance"
      FROM
        wallet_bids_count,
        bid,
        wallet
      WHERE
        bid."walletAddress" = "wallet_bids_count"."walletAddress"
        AND wallet.address = bid."walletAddress"
        AND bid."auctionId" = ${auction.id};
    `);

    return {
      auction,
      noun,
      bids: bids.rows,
      wallets: wallets.rows,
    };
  });
}
