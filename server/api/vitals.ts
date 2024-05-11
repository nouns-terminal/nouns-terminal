import { BigNumber, ethers } from 'ethers';
import EventEmitter from 'events';
import { logger, sleep } from '../utils';
import { Vitals } from './types';
import deepEqual from 'deep-equal';
import { Pool } from 'pg';
import { totalNounsSupply } from '../indexers/queries';
import RetryProvider from '../RetryProvider';
import { NOUNS_DAO_ADDRESS, NOUNS_TREASURY_ADDRESS } from '../../utils/constants';
import { NounsDAO__factory } from '../../typechain';

const log = logger.child({ source: 'live-query' });
const provider = new RetryProvider(5, process.env.PROVIDER_URL!);

async function fetchEtherPrice() {
  const response = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=ETH');
  const body = await response.json();
  return Number(body.data.rates.USD);
}

async function fetchGasPrice() {
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice || BigNumber.from(0);
  return gasPrice.toString();
}

async function fetchAdjustedTotalSupply() {
  const dao = NounsDAO__factory.connect(NOUNS_DAO_ADDRESS, provider);
  return (await dao.adjustedTotalSupply()).toNumber();
}

async function fetchTreasuryBalance() {
  const STETH_ADDRESS = '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84';
  const RETH_ADDRESS = '0xae78736cd615f374d3085123a210448e74fc6393';
  const abi = ['function balanceOf(address who) external view returns (uint256)'];
  const stETH = new ethers.Contract(STETH_ADDRESS, abi, provider);
  const rETH = new ethers.Contract(RETH_ADDRESS, abi, provider);

  const [ethBalance, stEthBalance, rEthBalance] = await Promise.all([
    provider.getBalance(NOUNS_TREASURY_ADDRESS),
    stETH.balanceOf(NOUNS_TREASURY_ADDRESS),
    rETH.balanceOf(NOUNS_TREASURY_ADDRESS),
  ]);
  return ethBalance.add(stEthBalance).add(rEthBalance).toString();
}

async function fetchData(): Promise<Vitals> {
  const [usdPrice, gasPriceInWei, adjustedTotalSupply, treasuryBalanceInWei] = await Promise.all([
    fetchEtherPrice(),
    fetchGasPrice(),
    fetchAdjustedTotalSupply(),
    fetchTreasuryBalance(),
  ]);

  return { usdPrice, gasPriceInWei, adjustedTotalSupply, treasuryBalanceInWei };
}

export type LiveQuery<T> = {
  subscribe: (callback: (data: T) => void) => () => void;
};

export function liveQuery<T>(query: () => Promise<T>): LiveQuery<T> {
  const emitter = new EventEmitter();
  emitter.setMaxListeners(Infinity);

  let latestValue: T | null = null;
  let process: Promise<void> | null = null;

  async function poll() {
    while (emitter.listenerCount('data') > 0) {
      const newValue = await query().catch((error) => {
        log.error(error);
        return latestValue;
      });

      if (!deepEqual(newValue, latestValue)) {
        latestValue = newValue;
        emitter.emit('data', newValue);
      }

      await sleep(2_000);
    }

    process = null;
  }

  return {
    subscribe(callback) {
      // Feed the latest value right away
      if (latestValue !== null) {
        callback(latestValue);
      }

      emitter.on('data', callback);

      // Start polling if we haven't already
      if (process === null) {
        process = poll();
      }
      return () => {
        emitter.off('data', callback);
      };
    },
  };
}

export const liveVitals = liveQuery(fetchData);
