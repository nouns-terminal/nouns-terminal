import { ethers, parseEther } from 'ethers';
import EventEmitter from 'events';
import { logger, sleep } from '../utils';
import { Vitals } from './types';
import deepEqual from 'deep-equal';
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
  const gasPrice = feeData.gasPrice || 0n;
  return gasPrice.toString();
}

async function fetchAdjustedTotalSupply() {
  const dao = NounsDAO__factory.connect(NOUNS_DAO_ADDRESS, provider);
  return Number(await dao.adjustedTotalSupply());
}

async function fetchTreasuryBalance() {
  const abi = ['function balanceOf(address who) external view returns (uint256)'];

  const TREASURY_V1 = '0x0BC3807Ec262cB779b38D65b38158acC3bfedE10';
  const VOTE_REFUNDS = '0x6f3E6272A167e8AcCb32072d08E0957F9c79223d';
  const TOKEN_BUYER = '0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5';
  const CLIENT_INCENTIVES_REWARDS_PROXY = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
  const PAYER_CONTRACT = '0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D';

  const STETH_ADDRESS = '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84';
  const RETH_ADDRESS = '0xae78736cd615f374d3085123a210448e74fc6393';
  const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
  const WSTETH_ADDRESS = '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0';
  const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

  const stETH = new ethers.Contract(STETH_ADDRESS, abi, provider);
  const rETH = new ethers.Contract(RETH_ADDRESS, abi, provider);
  const wETH = new ethers.Contract(WETH_ADDRESS, abi, provider);
  const wstETH = new ethers.Contract(WSTETH_ADDRESS, abi, provider);
  const usdc = new ethers.Contract(USDC_ADDRESS, abi, provider);

  const [
    ethBalanceNounsTreasury,
    stEthNounsTreasuryBalance,
    rEthBalanceNounsTreasury,
    wEthBalanceNounsTreasury,
    wstEthBalanceNounsTreasury,
    usdcBalanceNounsTreasury,
    ethBalanceVoteRefunds,
    ethBalanceTokenBuyer,
    usdcBalancePayerContract,
    wEthBalanceClientIncentives,
    ethBalanceTreasuryV1,
  ] = await Promise.all([
    provider.getBalance(NOUNS_TREASURY_ADDRESS),
    stETH.balanceOf(NOUNS_TREASURY_ADDRESS),
    rETH.balanceOf(NOUNS_TREASURY_ADDRESS),
    wETH.balanceOf(NOUNS_TREASURY_ADDRESS),
    wstETH.balanceOf(NOUNS_TREASURY_ADDRESS),
    usdc.balanceOf(NOUNS_TREASURY_ADDRESS),
    provider.getBalance(VOTE_REFUNDS),
    provider.getBalance(TOKEN_BUYER),
    usdc.balanceOf(PAYER_CONTRACT),
    wETH.balanceOf(CLIENT_INCENTIVES_REWARDS_PROXY),
    provider.getBalance(TREASURY_V1),
  ]);

  const totalUsdc: bigint = usdcBalanceNounsTreasury + usdcBalancePayerContract;
  const usd = Number(totalUsdc / 1_000_000n);
  const price = await fetchEtherPrice();
  const eth = parseEther((usd / price).toString());

  return (
    eth +
    ethBalanceNounsTreasury +
    ethBalanceTreasuryV1 +
    stEthNounsTreasuryBalance +
    rEthBalanceNounsTreasury +
    wEthBalanceNounsTreasury +
    wstEthBalanceNounsTreasury +
    ethBalanceVoteRefunds +
    ethBalanceTokenBuyer +
    wEthBalanceClientIncentives
  ).toString();
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
