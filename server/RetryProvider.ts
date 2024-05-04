import { Networkish, StaticJsonRpcProvider } from '@ethersproject/providers';
import { ConnectionInfo, poll } from 'ethers/lib/utils';
import { logger } from './utils';

export default class RetryProvider extends StaticJsonRpcProvider {
  public attempts: number;

  constructor(attempts: number, url?: ConnectionInfo | string, network?: Networkish) {
    super(url, network);
    this.attempts = attempts;
  }

  public perform(method: string, params: any) {
    let attempts = 0;
    return poll(() => {
      attempts++;
      return super.perform(method, params).then(
        (result) => {
          return result;
        },
        (error: any) => {
          if (error.statusCode !== 429 || attempts >= this.attempts) {
            return Promise.reject(error);
          } else {
            logger.warn(error);
            return Promise.resolve(undefined);
          }
        }
      );
    });
  }
}
