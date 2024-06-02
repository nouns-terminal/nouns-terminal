import 'dotenv/config';
import { ethers } from 'ethers';
import { forever, logger } from '../utils';
import { findUnindexedNouns, updateNounSeeds } from '../db/queries';
import { PoolClient } from 'pg';
import { NounsToken__factory } from '../../typechain';

const log = logger.child({ indexer: 'nouns' });

export default async function nouns(
  nounsAddress: string,
  connection: PoolClient,
  provider: ethers.Provider,
) {
  log.info('Starting');
  const nouns = NounsToken__factory.connect(nounsAddress, provider);

  async function process() {
    const rows = await findUnindexedNouns.run({ limit: 10 }, connection);
    log.debug(`Rows: ${rows.length}`, { rows: rows });

    if (rows.length === 0) {
      return false;
    }

    const seeds = await Promise.all(rows.map((row) => nouns.seeds(row.id)));

    log.debug('Got data', { seeds });

    for (const [index, row] of seeds.entries()) {
      await updateNounSeeds.run(
        {
          id: rows[index].id,
          background: Number(row.background),
          body: Number(row.body),
          accessory: Number(row.accessory),
          head: Number(row.head),
          glasses: Number(row.glasses),
        },
        connection,
      );
    }

    return true;
  }

  await forever(process, log);
}
