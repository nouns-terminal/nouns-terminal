import { Networkish } from '@ethersproject/providers';
import { Network, PerformActionRequest, ethers } from 'ethers';
import { logger } from './utils';

export default class RetryProvider extends ethers.JsonRpcProvider {
  public attempts: number;

  constructor(attempts: number, url?: string, network?: Networkish) {
    super(url, network, { staticNetwork: Network.from(network) });
    this.attempts = attempts;
  }

  public async _perform(req: PerformActionRequest) {
    let attempts = 0;
    while (true) {
      try {
        return await super._perform(req);
      } catch (error: any) {
        if (attempts < this.attempts) {
          console.log('Retrying...', attempts);
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 1_000));
        } else {
          logger.warn(error);
          throw error;
        }
      }
    }
  }
}
