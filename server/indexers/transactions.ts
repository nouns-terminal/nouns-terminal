import 'dotenv/config';
import { ethers } from 'ethers';
import { forever, logger } from '../utils';
import { PoolClient } from 'pg';
import {
  findBidsWithMissingTransactions,
  updateBidTransactionMetadata,
  findWalletsInLatestAuction,
  updateWalletsValuesInLatestAuction,
} from './queries';

const log = logger.child({ indexer: 'transactions' });

export default async function transactions(connection: PoolClient, provider: ethers.Provider) {
  log.info('Starting');

  async function process() {
    const bids = await findBidsWithMissingTransactions.run({ limit: 5 }, connection);
    const latestBids = await findWalletsInLatestAuction.run(undefined, connection);

    log.debug(`Rows: ${bids.length}`);

    if (bids.length === 0) {
      return false;
    }

    const txs = await Promise.all(bids.map((row) => provider.getTransaction(row.tx)));
    const blocks = await Promise.all(bids.map((row) => provider.getBlock(row.block)));
    const balancesInBlocks = await Promise.all(
      bids.map((row) => provider.getBalance(row.walletAddress, row.block)),
    );
    const latestBalances = await Promise.all(
      latestBids.map((row) => provider.getBalance(row.walletAddress)),
    );

    for (const [index, row] of bids.entries()) {
      await updateBidTransactionMetadata.run(
        {
          txHash: row.tx,
          timestamp: blocks[index]?.timestamp || null,
          maxFeePerGas:
            txs[index]?.maxFeePerGas?.toString() || txs[index]?.gasLimit.toString() || null,
          walletBalance: balancesInBlocks[index]?.toString() || null,
        },
        connection,
      );
    }
    for (const [index, row] of latestBids.entries()) {
      await updateWalletsValuesInLatestAuction.run(
        {
          id: row.id,
          walletBalance: latestBalances[index].toString() || null,
        },
        connection,
      );
    }

    return true;
  }

  await forever(process, log);
}
