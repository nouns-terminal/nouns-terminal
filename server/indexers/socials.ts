import 'dotenv/config';
import { forever, logger } from '../utils';
import { getLastAuctionUnindexedWalletsSocials, setAddressSocials } from '../db/queries';
import { Pool } from 'pg';

interface QueryResponse {
  data: Data;
}

type Data = {
  Wallet: Wallet;
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

const AIRSTACK_API_URL = 'https://api.airstack.xyz/graphql';
const AIRSTACK_API_KEY = process.env.AIRSTACK_API_KEY;

const log = logger.child({ indexer: 'socials' });

export default async function socials(connection: Pool) {
  log.info('Starting');

  async function process() {
    if (!AIRSTACK_API_KEY) {
      log.error('No AIRSTACK_API_KEY provided');
      return false;
    }

    const wallets = await getLastAuctionUnindexedWalletsSocials.run({ limit: 100 }, connection);

    log.debug(`Rows: ${wallets.length}`, { rows: wallets });

    if (wallets.length === 0) {
      return false;
    }

    const data = await Promise.all(
      wallets.map((row) => fetchAddressSocials(row.walletAddress || '')),
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

async function fetchAddressSocials(address: string) {
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

  try {
    const res = await fetch(AIRSTACK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: AIRSTACK_API_KEY!,
      },
      body: JSON.stringify({ query }),
    });
    const json = (await res?.json()) as QueryResponse;
    const data = json?.data;
    return { address, ...data };
  } catch (e) {
    log.error('Cannot fetch data from Airstack', { error: e });
    return null;
  }
}
