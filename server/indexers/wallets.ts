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
  provider: ethers.providers.BaseProvider
) {
  log.info('Starting');
  const weth = new ethers.Contract(WETH, abi, provider);
  const nouns = new ethers.Contract(nounsAddress, abi, provider);

  async function process() {
    const wallets = await findUnindexedWallets.run({ limit: 1 }, connection);
    log.debug(`Rows: ${wallets.length}`, { rows: wallets });

    if (wallets.length === 0) {
      return false;
    }

    const ens = await Promise.all(wallets.map((row) => provider.lookupAddress(row.address)));
    const balancesEth = await Promise.all(wallets.map((row) => provider.getBalance(row.address)));
    const balancesWeth = await Promise.all(wallets.map((row) => weth.balanceOf(row.address)));
    const balancesNouns = await Promise.all(wallets.map((row) => nouns.balanceOf(row.address)));

    log.debug('Got data', { ens, balancesEth, balancesWeth, balancesNouns });

    for (const [index, row] of wallets.entries()) {
      await updateWalletData.run(
        {
          address: row.address,
          ens: ens[index] || '',
          balanceEth: balancesEth[index].toString(),
          balanceWeth: balancesWeth[index].toString(),
          nouns: balancesNouns[index].toString(),
        },
        connection
      );
    }

    return true;
  }

  await forever(process, log);
}
