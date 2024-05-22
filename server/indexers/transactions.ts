import 'dotenv/config';
import { ethers } from 'ethers';
import { forever, logger } from '../utils';
import { PoolClient } from 'pg';
import { findBidsWithMissingTransactions, updateBidTransactionMetadata } from './queries';

const log = logger.child({ indexer: 'transactions' });

export default async function transactions(connection: PoolClient, provider: ethers.Provider) {
  log.info('Starting');

  async function process() {
    const bids = await findBidsWithMissingTransactions.run({ limit: 5 }, connection);

    if (bids.length === 0) {
      return false;
    }

    const txs = await Promise.all(bids.map((row) => provider.getTransaction(row.tx)));
    const blocks = await Promise.all(bids.map((row) => provider.getBlock(row.block)));
    const balancesInBlocks = await Promise.all(
      bids.map((row) => provider.getBalance(row.walletAddress, row.block)),
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

    return true;
  }

  await forever(process, log);
}
