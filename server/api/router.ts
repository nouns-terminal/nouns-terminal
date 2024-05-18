import * as trpc from '@trpc/server';
import { z } from 'zod';
import { Vitals } from './types';
import getAuctionData, { getLiveAuctionData } from '../getAuctionData';
import { AuctionData } from '../api/types';
import { liveVitals } from './vitals';

export const appRouter = trpc
  .router()
  .query('hello', {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
      };
    },
  })
  .query('latest', {
    input: z.object({
      auctionId: z.number().nullish(),
    }),
    async resolve({ input }) {
      return getAuctionData(input.auctionId);
    },
  })
  .subscription('latest', {
    input: z.object({
      auctionId: z.number().nullish(),
    }),
    resolve({ input }) {
      return new trpc.Subscription<AuctionData>((emit) => {
        return getLiveAuctionData(input.auctionId).subscribe((data) => {
          emit.data(data);
        });
      });
    },
  })
  .subscription('vitals', {
    resolve() {
      return new trpc.Subscription<Vitals>((emit) => {
        return liveVitals.subscribe((data) => {
          emit.data(data);
        });
      });
    },
  })
  .subscription('keep-alive', {
    resolve() {
      return new trpc.Subscription<number>((emit) => {
        emit.data(Date.now());
        const interval = setInterval(() => emit.data(Date.now()), 3_000);
        return () => clearInterval(interval);
      });
    },
  });

export type AppRouter = typeof appRouter;
