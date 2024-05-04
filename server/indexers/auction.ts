import 'dotenv/config';
import { ethers, Event } from 'ethers';
import { NounsAuctionHouse__factory } from '../../typechain';
import { TypedEventFilter } from '../../typechain/common';
import {
  AuctionBidEvent,
  AuctionCreatedEvent,
  AuctionExtendedEvent,
  AuctionSettledEvent,
} from '../../typechain/NounsAuctionHouse';
import { logger } from '../utils';
import { PoolClient } from 'pg';
import {
  getAuctionLastQueriedBlock,
  insertAuction,
  insertAuctionBid,
  setAuctionLastQueriedBlock,
  updateAuctionExtended,
  updateAuctionSettled,
} from './queries';

type AuctionHouseEvent =
  | AuctionCreatedEvent
  | AuctionExtendedEvent
  | AuctionSettledEvent
  | AuctionBidEvent;

const log = logger.child({ indexer: 'auction' });

export default async function auction(
  auctionAddress: string,
  connection: PoolClient,
  provider: ethers.providers.BaseProvider
) {
  log.info('Starting');
  const auctionHouse = NounsAuctionHouse__factory.connect(auctionAddress, provider);

  const filters: TypedEventFilter<AuctionHouseEvent>[] = [
    auctionHouse.filters.AuctionCreated(),
    auctionHouse.filters.AuctionExtended(),
    auctionHouse.filters.AuctionSettled(),
    auctionHouse.filters.AuctionBid(),
  ];

  async function maybeProcessEvent(event: AuctionHouseEvent) {
    try {
      log.debug('Processing event %s', event.event, { event });
      processEvent(connection, event);
    } catch (error) {
      log.error(error);
    }
  }

  filters.forEach((filter) =>
    auctionHouse.on(filter, (...args) => {
      // Ethers: the first N arguments are event args verbatim
      // The event object we care about is the last argument
      const event = args[args.length - 1] as AuctionHouseEvent;
      maybeProcessEvent(event);
    })
  );

  const result = await getAuctionLastQueriedBlock.run(undefined, connection);

  const lastQueriedBlock = result[0]?.value || 12985450; // Nouns Deployment -1
  let lastBlockNumber = lastQueriedBlock;

  log.debug('Loaded state', { lastQueriedBlock });
  const currentBlockNumber = await provider.getBlockNumber();

  for (const filter of filters) {
    const limit = 2_000;
    const pages = Math.ceil((currentBlockNumber - lastQueriedBlock) / limit);
    for (let page = 0; page <= pages; page += 1) {
      const blockFrom = lastQueriedBlock + page * limit + 1;
      const blockTo = Math.min(currentBlockNumber, lastQueriedBlock + (page + 1) * limit);

      if (blockFrom > currentBlockNumber) {
        break;
      }

      log.debug('Querying events', { blockFrom, blockTo });
      const events = await auctionHouse.queryFilter(filter, blockFrom, blockTo);

      for (const event of events) {
        await maybeProcessEvent(event);
        lastBlockNumber = Math.max(lastBlockNumber, event.blockNumber);
      }
    }
  }
  await setAuctionLastQueriedBlock.run({ lastBlockNumber }, connection);

  // Wait forever, otherwise the connection is released and the event handlers
  // won't be able to run SQL
  await new Promise((resolve) => {});
}

async function processEvent(connection: PoolClient, event: AuctionHouseEvent) {
  if (event.event === 'AuctionCreated') {
    const { nounId, startTime, endTime } = (event as AuctionCreatedEvent).args!;
    await insertAuction.run(
      { id: nounId.toNumber(), startTime: startTime.toNumber(), endTime: endTime.toNumber() },
      connection
    );
    return;
  }

  if (event.event === 'AuctionExtended') {
    const { nounId, endTime } = (event as AuctionExtendedEvent).args!;
    await updateAuctionExtended.run(
      { id: nounId.toNumber(), endTime: endTime.toNumber() },
      connection
    );
    return;
  }

  if (event.event === 'AuctionSettled') {
    const { nounId, winner, amount } = (event as AuctionSettledEvent).args!;
    await updateAuctionSettled.run(
      {
        id: nounId.toNumber(),
        winner: winner.toLowerCase(),
        price: amount.toString(),
      },
      connection
    );
    return;
  }

  if (event.event === 'AuctionBid') {
    const { nounId, sender, value, extended } = (event as AuctionBidEvent).args!;
    await insertAuctionBid.run(
      {
        tx: event.transactionHash,
        auctionId: nounId.toNumber(),
        walletAddress: sender.toLowerCase(),
        value: value.toString(),
        block: event.blockNumber,
        extended: extended,
      },
      connection
    );
    return;
  }

  log.warn('Nothing to do for this event', { event });
}
