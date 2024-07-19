import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { Vitals } from './types';
import { getLiveAuctionData } from '../getAuctionData';
import { AuctionData } from '../api/types';
import { liveVitals } from './vitals';
import { observable } from '@trpc/server/observable';
import EventEmitter from 'events';
import { logger } from '../utils';
import getAddressData, { inserNewBio } from './wallets';

const log = logger.child({ source: 'router' });

const t = initTRPC.context().create();

const router = t.router;
const publicProcedure = t.procedure;
const ee = new EventEmitter().setMaxListeners(Infinity);

let anonymousOnline = 0;
const addressToSessions = new Map<string, number>();

const privateProcedure = publicProcedure
  .input(
    z.object({
      wallet: z.object({
        address: z.string(),
        isAuthor: z.boolean(),
      }),
    }),
  )
  .use(async (opts) => {
    if (!opts.input.wallet?.isAuthor) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not authorized to perform this action',
      });
    }
    return opts.next({
      ctx: {
        author: opts.input.wallet,
      },
    });
  });

const privateRouter = router({
  insertBio: privateProcedure
    .input(
      z.object({
        bidderAddress: z.string(),
        bioText: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await inserNewBio(input.bidderAddress, input.bioText, ctx.author.address);
    }),
});

export const appRouter = router({
  onLatest: publicProcedure
    .input(
      z.object({
        auctionId: z.number().nullish(),
      }),
    )
    .subscription(({ input }) => {
      return observable<AuctionData>((emit) => {
        return getLiveAuctionData(input.auctionId).subscribe((data) => {
          emit.next(data);
        });
      });
    }),
  vitals: publicProcedure.input(z.string().nullish()).subscription(() => {
    return observable<Vitals>((emit) => {
      return liveVitals.subscribe((data) => {
        emit.next(data);
      });
    });
  }),
  online: publicProcedure
    .input(
      z.object({
        address: z.string().optional(),
      }),
    )
    .subscription(({ input }) => {
      return observable<number>((emit) => {
        const onChange = () => {
          // Get the number of sessions
          emit.next(addressToSessions.size + anonymousOnline);
        };

        if (!input.address) {
          anonymousOnline++;
        } else {
          const userSessions = addressToSessions.get(input.address) || 0;
          addressToSessions.set(input.address, userSessions + 1);
        }

        ee.on('change', onChange);
        ee.emit('change');
        return () => {
          if (!input.address) {
            anonymousOnline--;
          } else {
            const userSessions = addressToSessions.get(input.address);
            if (userSessions === 1) {
              addressToSessions.delete(input.address);
            } else {
              addressToSessions.set(input.address, userSessions! - 1);
            }
          }
          ee.off('change', onChange);
          ee.emit('change');
        };
      });
    }),
  walletData: publicProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return getAddressData(input.address);
    }),
  private: privateRouter,
});

export type AppRouter = typeof appRouter;
