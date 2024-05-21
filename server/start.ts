import 'dotenv/config';
import auction from './indexers/auction';
import transactions from './indexers/transactions';
import wallets from './indexers/wallets';
import { logger } from './utils';
import express from 'express';
import { NOUNS_AUCTION_HOUSE_ADDRESS, NOUNS_TOKEN_ADDRESS } from '../utils/constants';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { appRouter } from './api/router';
import next from 'next';
import ws from 'ws';
import http from 'http';
import expressWinston from 'express-winston';
import RetryProvider from './RetryProvider';
import { Pool, PoolClient } from 'pg';
import nouns from './indexers/nouns';
import { getLatestAuction } from './indexers/queries';

async function main() {
  const port = parseInt(process.env.PORT || '3003', 10);
  const provider = new RetryProvider(10, process.env.PROVIDER_URL);

  const app = express();
  const nextjs = next({ dev: process.env.NODE_ENV !== 'production' });
  const nextHandle = nextjs.getRequestHandler();
  const nextUpgrade = nextjs.getUpgradeHandler();

  const trpcws = new ws.Server({ noServer: true, path: '/trpc' });
  const handler = applyWSSHandler({ wss: trpcws, router: appRouter });

  const server = http.createServer(app);
  const httpLogger = logger.child({ service: 'http' });

  const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });
  pgPool.on('connect', () => logger.info('Connected to the database'));
  pgPool.on('error', (error) => logger.error(error));

  const router = express.Router();

  router.get('/health', async (req, res) => {
    const latestAuction = await getLatestAuction.run(undefined, pgPool);
    const latestBlock = await provider.getBlock('latest');
    res.json({ success: true, latestAuction, latestBlock });
  });

  router.all('*', (req, res) => nextHandle(req, res));

  app.use(expressWinston.logger({ winstonInstance: httpLogger, level: 'debug' }));
  app.use(router);
  app.use(expressWinston.errorLogger({ winstonInstance: httpLogger }));

  server.on('upgrade', (request, socket, head) => {
    const baseURL = `http://'${request.headers.host}/`;
    const { pathname } = new URL(request.url!, baseURL);

    if (pathname === '/trpc') {
      trpcws.handleUpgrade(request, socket as any, head, (client) => {
        trpcws.emit('connection', client, request);
      });
    } else {
      nextUpgrade(request, socket, head);
    }
  });

  process.on('SIGTERM', () => {
    handler.broadcastReconnectNotification();
  });

  await nextjs.prepare();
  await new Promise((resolve) => server.listen(port, () => resolve(undefined)));

  logger.info('Server listening at http://localhost:%s', port, {
    env: process.env.NODE_ENV || 'development',
  });

  const withPgClient = async (callback: (client: PoolClient) => Promise<void>) => {
    const client = await pgPool.connect();
    try {
      await callback(client);
    } finally {
      client.release();
    }
  };

  await Promise.all([
    withPgClient((connection) => auction(NOUNS_AUCTION_HOUSE_ADDRESS, connection, provider)),
    withPgClient((connection) => wallets(NOUNS_TOKEN_ADDRESS, connection, provider)),
    withPgClient((connection) => nouns(NOUNS_TOKEN_ADDRESS, connection, provider)),
    withPgClient((connection) => transactions(connection, provider)),
  ]);
}

main().catch((e) => {
  logger.error(e);
  process.exit(1);
});
