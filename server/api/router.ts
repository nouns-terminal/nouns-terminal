import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { Vitals } from './types';
import getAuctionData, { getLiveAuctionData } from '../getAuctionData';
import { AuctionData } from '../api/types';
import { liveVitals } from './vitals';
import { observable } from '@trpc/server/observable';

const t = initTRPC.context().create();

const router = t.router;
const procedure = t.procedure;

export const appRouter = router({
  latest: procedure
    .input(
      z.object({
        auctionId: z.number().nullish(),
      })
    )
    .query(async ({ input }) => {
      return getAuctionData(input.auctionId);
    }),
  onLatest: procedure
    .input(
      z.object({
        auctionId: z.number().nullish(),
      })
    )
    .subscription(({ input }) => {
      return observable<AuctionData>((emit) => {
        return getLiveAuctionData(input.auctionId).subscribe((data) => {
          emit.next(data);
        });
      });
    }),
  vitals: procedure.input(z.string().nullish()).subscription(() => {
    return observable<Vitals>((emit) => {
      return liveVitals.subscribe((data) => {
        emit.next(data);
      });
    });
  }),
  'keep-alive': procedure.subscription(() => {
    return observable<number>((emit) => {
      emit.next(Date.now());
      const interval = setInterval(() => emit.next(Date.now()), 3_000);
      return () => clearInterval(interval);
    });
  }),
});

export type AppRouter = typeof appRouter;
