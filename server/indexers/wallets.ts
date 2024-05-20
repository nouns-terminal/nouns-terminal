import 'dotenv/config';
import { ethers } from 'ethers';
import { forever, logger } from '../utils';
import { findUnindexedWallets, updateWalletData } from './queries';
import { PoolClient } from 'pg';

const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

const abi = ['function balanceOf(address who) external view returns (uint256)'];

const log = logger.child({ indexer: 'wallets' });

export default async function wallets(
  nounsAddress: string,
  connection: PoolClient,
  provider: ethers.Provider,
) {
  log.info('Starting');
  const nouns = new ethers.Contract(nounsAddress, abi, provider);

  async function process() {
    const wallets = await findUnindexedWallets.run({ limit: 35 }, connection);
    log.debug(`Rows: ${wallets.length}`, { rows: wallets });

    if (wallets.length === 0) {
      return false;
    }

    //TODO: Make resolver for ens
    const ens = await Promise.all(
      wallets.map((row) => provider.lookupAddress(row.address).catch(() => null)),
    );
    const balancesNouns = await Promise.all(wallets.map((row) => nouns.balanceOf(row.address)));

    log.debug('Got data', { ens, balancesNouns });

    for (const [index, row] of wallets.entries()) {
      await updateWalletData.run(
        {
          address: row.address,
          ens: ens[index] || '',
          nouns: balancesNouns[index].toString(),
        },
        connection,
      );
    }

    return true;
  }

  await forever(process, log);
}
