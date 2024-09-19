import 'dotenv/config';
import { createLogger, Logger, format, transports } from 'winston';
import { hostname } from 'os';
import qs from 'qs';
import { getAddress } from 'viem';
import { z } from 'zod';
import serverEnv from './serverEnv';

export async function forever(process: () => Promise<boolean>, log: Logger, delay?: number) {
  while (true) {
    try {
      const hasMore = await process();
      if (hasMore) {
        continue;
      }
    } catch (error) {
      log.error(error);
    }
    await sleep(delay || 5_000);
  }
}

export const addressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/)
  .transform((v) => getAddress(v));

export const bytes32Schema = z
  .string()
  .regex(/^(0x)?[a-fA-F0-9]{64}$/)
  .transform((v) => (v.startsWith('0x') ? v : '0x' + v) as `0x${string}`);

export const bytesSchema = z
  .string()
  .regex(/^(0x)?([a-fA-F0-9]{2})*$/)
  .transform((v) => (v.startsWith('0x') ? v : '0x' + v) as `0x${string}`);

export async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function checkIsAuthor(bidder: string, author?: string) {
  if (!author) {
    return false;
  }

  bidder = bidder.toLocaleLowerCase();
  author = author.toLocaleLowerCase();

  if (bidder === author) {
    return true;
  }

  return serverEnv.AUTHORS.includes(author);
}

export const logger = createLogger({
  level: serverEnv.LOG_LEVEL,
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
});

const { DATADOG_API_KEY } = serverEnv;

if (DATADOG_API_KEY) {
  const params = qs.stringify({
    'dd-api-key': DATADOG_API_KEY,
    ddsource: 'nodejs',
    service: 'nouns-api',
    hostname: hostname().toLowerCase(),
  });
  logger.add(
    new transports.Http({
      host: 'http-intake.logs.datadoghq.com',
      path: `/api/v2/logs?${params}`,
      ssl: true,
      level: 'debug',
    }),
  );
}
