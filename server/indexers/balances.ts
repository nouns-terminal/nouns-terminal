import 'dotenv/config';
import { ethers } from 'ethers';
import { forever, logger } from '../utils';
import { PoolClient } from 'pg';
import { findWalletsInLatestAuction, updateWalletsValuesInLatestAuction } from './queries';

const log = logger.child({ indexer: 'balances' });

export default async function balances(connection: PoolClient, provider: ethers.Provider) {
  log.info('Starting');

  async function process() {
    const latestBids = await findWalletsInLatestAuction.run(undefined, connection);

    if (latestBids.length === 0) {
      return false;
    }

    const latestBalances = await Promise.all(
      latestBids.map((row) => provider.getBalance(row.walletAddress)),
    );
    for (const [index, row] of latestBids.entries()) {
      await updateWalletsValuesInLatestAuction.run(
        {
          tx: row.tx,
          index: row.index,
          walletBalance: latestBalances[index].toString(),
        },
        connection,
      );
    }

    return false;
  }

  await forever(process, log, 300_000);
}
