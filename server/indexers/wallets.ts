import 'dotenv/config';
import { ethers } from 'ethers';
import { forever, logger } from '../utils';
import { findUnindexedWallets, updateWalletData } from '../db/queries';
import { PoolClient } from 'pg';

const log = logger.child({ indexer: 'wallets' });

export default async function wallets(connection: PoolClient, provider: ethers.AbstractProvider) {
  log.info('Starting');

  async function process() {
    const wallets = await findUnindexedWallets.run({ limit: 35 }, connection);
    log.debug(`Rows: ${wallets.length}`, { rows: wallets });

    if (wallets.length === 0) {
      return false;
    }

    //TODO: Make resolver for ens
    const ens = await Promise.all(
      wallets.map((row) => provider.lookupAddress(row.address || '').catch(() => null)),
    );

    log.debug('Got data', { ens });

    for (const [index, row] of wallets.entries()) {
      await updateWalletData.run(
        {
          address: row.address || '',
          ens: ens[index] || '',
        },
        connection,
      );
    }

    return true;
  }

  await forever(process, log);
}
