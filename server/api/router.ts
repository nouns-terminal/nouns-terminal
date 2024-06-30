import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { Vitals } from './types';
import { getLiveAuctionData } from '../getAuctionData';
import { AuctionData } from '../api/types';
import { liveVitals } from './vitals';
import { observable } from '@trpc/server/observable';
import EventEmitter from 'events';
import { logger } from '../utils';
import getAddressData from './bidder';

const log = logger.child({ source: 'router' });

const t = initTRPC.context().create();

const router = t.router;
const procedure = t.procedure;
const ee = new EventEmitter().setMaxListeners(Infinity);

let anonymousOnline = 0;
const addressToSessions = new Map<string, number>();

export const appRouter = router({
  onLatest: procedure
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
  vitals: procedure.input(z.string().nullish()).subscription(() => {
    return observable<Vitals>((emit) => {
      return liveVitals.subscribe((data) => {
        emit.next(data);
      });
    });
  }),
  online: procedure
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
  walletData: procedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return getAddressData(input.address);
    }),
});

export type AppRouter = typeof appRouter;
