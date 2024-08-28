import { logger } from '../utils';
import { Pool } from 'pg';
import { getPriceStats, getBidsStats } from '../db/queries';

const log = logger.child({ source: 'stats' });
const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });
const days = getDays();

async function getPrices() {
  const weekPriceStats = await getPriceStats.run({ days: 7 }, pgPool);
  const monthPriceStats = await getPriceStats.run({ days: days.inMonth }, pgPool);
  const yearPriceStats = await getPriceStats.run({ days: days.inYear }, pgPool);

  return {
    weekPriceStats,
    monthPriceStats,
    yearPriceStats,
  };
}

async function getBids() {
  const weekBidsStats = await getBidsStats.run({ days: 7 }, pgPool);
  const monthBidsStats = await getBidsStats.run({ days: days.inMonth }, pgPool);
  const yearBidsStats = await getBidsStats.run({ days: days.inYear }, pgPool);

  return {
    weekBidsStats,
    monthBidsStats,
    yearBidsStats,
  };
}

export default async function getStatsData() {
  const priceStats = await getPrices();
  const bidsStats = await getBids();

  return { prices: { ...priceStats }, bids: { ...bidsStats } };
}

function getDays() {
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return {
    inMonth: new Date(year, month, 0).getDate(),
    inYear: (year % 4 === 0 && year % 100 > 0) || year % 400 == 0 ? 366 : 365,
  };
}
