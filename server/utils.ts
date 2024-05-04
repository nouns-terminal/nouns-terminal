import { createLogger, Logger, format, transports } from 'winston';
import { hostname } from 'os';
import qs from 'qs';

export async function forever(process: () => Promise<boolean>, log: Logger) {
  while (true) {
    try {
      const hasMore = await process();
      if (hasMore) {
        continue;
      }
    } catch (error) {
      log.error(error);
    }
    await sleep(5_000);
  }
}

export async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export const logger = createLogger({
  level: 'debug',
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
    format.json()
  ),
});

const { DATADOG_API_KEY } = process.env;

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
    })
  );
}
