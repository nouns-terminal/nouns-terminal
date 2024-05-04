import { createReactQueryHooks } from '@trpc/react';
import { type AppRouter } from '../server/api/router';

export const trpc = createReactQueryHooks<AppRouter>();
