import { createTRPCNext } from '@trpc/next';
import { type AppRouter } from '../server/api/router';

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [],
    };
  },
});
