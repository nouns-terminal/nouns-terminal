import 'dotenv/config';
import { ContractEventPayload, ethers } from 'ethers';
import { NounsAuctionHouse__factory } from '../../typechain';
import {
  AuctionBidEvent,
  AuctionCreatedEvent,
  AuctionExtendedEvent,
  AuctionSettledEvent,
  AuctionBidWithClientIdEvent,
} from '../../typechain/NounsAuctionHouse';
import { logger } from '../utils';
import { Pool } from 'pg';
import {
  getAuctionLastQueriedBlock,
  insertAuction,
  insertAuctionBid,
  setAuctionLastQueriedBlock,
  updateAuctionExtended,
  updateAuctionSettled,
  updateAuctionBidWithClientId,
} from '../db/queries';

type AuctionHouseEventLog =
  | AuctionCreatedEvent.Log
  | AuctionExtendedEvent.Log
  | AuctionSettledEvent.Log
  | AuctionBidEvent.Log
  | AuctionBidWithClientIdEvent.Log;

const log = logger.child({ indexer: 'auction' });

const genesisBlock = Number(process.env.GENESIS_BLOCK || '12985450'); // 12985450 - Nouns Deployment -1

export default async function auction(
  auctionAddress: string,
  connection: Pool,
  provider: ethers.Provider,
) {
  log.info('Starting');
  const auctionHouse = NounsAuctionHouse__factory.connect(auctionAddress, provider);

  const filters = [
    auctionHouse.filters.AuctionCreated(),
    auctionHouse.filters.AuctionExtended(),
    auctionHouse.filters.AuctionSettled(),
    auctionHouse.filters.AuctionBid(),
    auctionHouse.filters.AuctionBidWithClientId(),
  ];

  async function maybeProcessEvent(event: AuctionHouseEventLog) {
    try {
      log.debug('Processing event %s', event.eventName, { event });
      processEvent(connection, event);
    } catch (error) {
      log.error(error);
    }
  }

  filters.forEach((filter) =>
    auctionHouse.on(filter, (...args) => {
      // Ethers: the first N arguments are event args verbatim
      // The event object we care about is the last argument
      const payload = args[args.length - 1] as unknown as ContractEventPayload;

      maybeProcessEvent(payload.log as unknown as AuctionHouseEventLog);
    }),
  );

  const result = await getAuctionLastQueriedBlock.run(undefined, connection);

  const currentBlockNumber = await provider.getBlockNumber();
  const lastQueriedBlock = result[0]?.value || genesisBlock;
  let lastBlockNumber = lastQueriedBlock;

  log.debug('Loaded state', { lastQueriedBlock });
  const limit = 1_000_000;
  const pages = Math.ceil((currentBlockNumber - lastQueriedBlock) / limit);

  for (let page = 0; page <= pages; page += 1) {
    const blockFrom = lastQueriedBlock + page * limit + 1;
    const blockTo = Math.min(currentBlockNumber, lastQueriedBlock + (page + 1) * limit);

    if (blockFrom > currentBlockNumber) {
      break;
    }

    log.debug('Querying events', { blockFrom, blockTo });

    const events = await Promise.all(
      filters.map((filter) => auctionHouse.queryFilter(filter, blockFrom, blockTo)),
    );

    const allEvents = events
      .flat()
      .sort((a, b) => a.blockNumber - b.blockNumber || a.index - b.index);

    for (const event of allEvents) {
      await maybeProcessEvent(event);
      lastBlockNumber = Math.max(lastBlockNumber, event.blockNumber);
    }

    await setAuctionLastQueriedBlock.run({ lastBlockNumber }, connection);
  }

  // Wait forever, otherwise the connection is released and the event handlers
  // won't be able to run SQL
  await new Promise((resolve) => {});
}

async function processEvent(connection: Pool, eventLog: AuctionHouseEventLog) {
  if (eventLog.eventName === 'AuctionCreated') {
    const { nounId, startTime, endTime } = (eventLog as AuctionCreatedEvent.Log).args;
    await insertAuction.run(
      { id: Number(nounId), startTime: Number(startTime), endTime: Number(endTime) },
      connection,
    );
    return;
  }

  if (eventLog.eventName === 'AuctionExtended') {
    const { nounId, endTime } = (eventLog as AuctionExtendedEvent.Log).args;
    await updateAuctionExtended.run({ id: Number(nounId), endTime: Number(endTime) }, connection);
    return;
  }

  if (eventLog.eventName === 'AuctionSettled') {
    const { nounId, winner, amount } = (eventLog as AuctionSettledEvent.Log).args;
    await updateAuctionSettled.run(
      {
        id: Number(nounId),
        winner: winner.toLowerCase(),
        price: amount.toString(),
      },
      connection,
    );
    return;
  }

  if (eventLog.eventName === 'AuctionBid') {
    const { nounId, sender, value, extended } = (eventLog as AuctionBidEvent.Log).args;
    await insertAuctionBid.run(
      {
        tx: eventLog.transactionHash,
        index: eventLog.transactionIndex,
        auctionId: Number(nounId),
        walletAddress: sender.toLowerCase(),
        value: value.toString(),
        block: eventLog.blockNumber,
        extended: extended,
      },
      connection,
    );
    return;
  }

  if (eventLog.eventName === 'AuctionBidWithClientId') {
    const { nounId, clientId, value } = (eventLog as AuctionBidWithClientIdEvent.Log).args;
    await updateAuctionBidWithClientId.run(
      {
        auctionId: Number(nounId), // Noun id and auction id are the same
        clientId: Number(clientId),
        value: Number(value),
      },
      connection,
    );
    return;
  }

  log.warn('Nothing to do for this event', { event: eventLog });
}
