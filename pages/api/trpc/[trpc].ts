import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '../../../server/api/router';

export default createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
