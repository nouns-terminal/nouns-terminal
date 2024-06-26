import 'dotenv/config';
import { forever, logger } from '../utils';
import { getLastAuctionUnindexedWalletsSocials, setAddressSocials } from '../db/queries';
import { Pool } from 'pg';
import { fetchQuery } from '@airstack/node';

type QueryResponse = {
  data: Data;
  error: Error;
};

type Data = {
  Wallet: Wallet;
};

type Error = {
  message: string;
};

type Wallet = {
  socials: Social[];
  domains: Domain[];
};

type Social = {
  dappName: string;
  followerCount: number;
  profileName: string;
};

type Domain = {
  name: string;
  isPrimary: boolean;
};

async function getAddressSocials(address: string) {
  const query = `
      query GetWalletInfo {
        Wallet(input: {identity: "${address}", blockchain: ethereum}) {
          domains(input: {limit: 50}) {
            name
            isPrimary
          }
          socials {
            dappName
            followerCount
            profileName
          }
        }
      }
    `;

  const { data, error }: QueryResponse = await fetchQuery(query);

  if (error) {
    log.error(error);
    return null;
  }

  return { address, ...data };
}

const log = logger.child({ indexer: 'socials' });

export default async function socials(connection: Pool) {
  log.info('Starting');

  async function process() {
    const wallets = await getLastAuctionUnindexedWalletsSocials.run({ limit: 100 }, connection);

    log.debug(`Rows: ${wallets.length}`, { rows: wallets });

    if (wallets.length === 0) {
      return false;
    }

    const data = await Promise.all(
      wallets.map((row) => getAddressSocials(row.walletAddress || '')),
    );

    for (const row of data) {
      const domainPromises =
        row?.Wallet.domains?.map((domain) => {
          return setAddressSocials.run(
            {
              address: row.address,
              type: 'domain',
              nickname: domain.name || '',
            },
            connection,
          );
        }) || [];

      const socialPromises =
        row?.Wallet.socials
          ?.map((social) => {
            if (!social) {
              return null;
            }

            return setAddressSocials.run(
              {
                address: row.address,
                type: social.dappName,
                followers: social.followerCount,
                nickname: social.profileName,
              },
              connection,
            );
          })
          .filter(Boolean) || [];

      const generalPromise = setAddressSocials.run(
        {
          address: row?.address || '',
        },
        connection,
      );

      await Promise.all([...domainPromises, ...socialPromises, generalPromise]);
    }

    return true;
  }

  await forever(process, log);
}
