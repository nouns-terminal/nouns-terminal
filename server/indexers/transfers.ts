import 'dotenv/config';
import { ContractEventPayload, ethers } from 'ethers';
import { NounsToken__factory } from '../../typechain';
import { forever, logger } from '../utils';
import { Pool } from 'pg';
import {
  getTransferLastQueriedBlock,
  setTransferLastQueriedBlock,
  updateNounOwner,
} from '../db/queries';
import { TransferEvent } from '../../typechain/NounsToken';
import serverEnv from '../serverEnv';

type NounsTokenEventLog = TransferEvent.Log;

const log = logger.child({ indexer: 'transfer' });

export default async function transfers(
  nounAddress: string,
  connection: Pool,
  provider: ethers.Provider,
) {
  log.info('Starting');
  const nouns = NounsToken__factory.connect(nounAddress, provider);

  async function maybeProcessEvent(event: NounsTokenEventLog) {
    try {
      log.debug('Processing event %s', event.eventName, { event });
      await processEvent(connection, event);
    } catch (error) {
      log.error(error);
    }
  }

  let liveLogs = [] as NounsTokenEventLog[];
  nouns.on(nouns.filters.Transfer(), (...args) => {
    // Ethers: the first N arguments are event args verbatim
    // The event object we care about is the last argument
    const payload = args[args.length - 1] as unknown as ContractEventPayload;

    liveLogs.push(payload.log as unknown as NounsTokenEventLog);
  });

  const result = await getTransferLastQueriedBlock.run(undefined, connection);

  const currentBlockNumber = await provider.getBlockNumber();
  const lastQueriedBlock = result[0]?.value || serverEnv.GENESIS_BLOCK;
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
    const events: Array<NounsTokenEventLog> = await nouns.queryFilter(
      nouns.filters.Transfer(),
      blockFrom,
      blockTo,
    );

    const sortedEvents = events
      .flat()
      .sort((a, b) => a.blockNumber - b.blockNumber || a.index - b.index);

    for (const event of sortedEvents) {
      await maybeProcessEvent(event);
      lastBlockNumber = Math.max(lastBlockNumber, event.blockNumber);
    }

    await setTransferLastQueriedBlock.run({ lastBlockNumber }, connection);
  }

  await forever(
    async () => {
      const toProcess = liveLogs.sort((a, b) => a.blockNumber - b.blockNumber || a.index - b.index);
      liveLogs = [];

      for (const log of toProcess) {
        await maybeProcessEvent(log);
      }

      return liveLogs.length > 0;
    },
    log,
    60_000,
  );
}

async function processEvent(connection: Pool, eventLog: NounsTokenEventLog) {
  if (eventLog.eventName === 'Transfer') {
    const { to, tokenId } = (eventLog as TransferEvent.Log).args;

    await updateNounOwner.run(
      {
        id: Number(tokenId),
        owner: to.toLowerCase(),
      },
      connection,
    );

    return;
  }

  log.warn('Nothing to do for this event', { event: eventLog });
}
