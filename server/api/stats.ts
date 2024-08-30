import { logger } from '../utils';
import { Pool } from 'pg';
import { getPriceStats, getBidsStats } from '../db/queries';

const log = logger.child({ source: 'stats' });
const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });
const days = getDays();

async function getPrices() {
  const threeMonthPriceStats = await getPriceStats.run({ days: days.threeMonth }, pgPool);
  const halfYearPriceStats = await getPriceStats.run({ days: days.halfYear }, pgPool);
  const yearPriceStats = await getPriceStats.run({ days: days.year }, pgPool);

  return {
    threeMonthPriceStats,
    halfYearPriceStats,
    yearPriceStats,
  };
}

async function getBids() {
  const threeMonthBidsStats = await getBidsStats.run({ days: days.threeMonth }, pgPool);
  const halfYearBidsStats = await getBidsStats.run({ days: days.halfYear }, pgPool);
  const yearBidsStats = await getBidsStats.run({ days: days.year }, pgPool);

  return {
    threeMonthBidsStats,
    halfYearBidsStats,
    yearBidsStats,
  };
}

export default async function getStatsData() {
  const priceStats = await getPrices();
  const bidsStats = await getBids();

  return { prices: { ...priceStats }, bids: { ...bidsStats } };
}

function getDays() {
  return {
    threeMonth: 90,
    halfYear: 180,
    year: 365,
  };
}
