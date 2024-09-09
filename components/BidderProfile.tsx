import React from 'react';
import { trpc } from '../utils/trpc';
import { Noun, BidderHistory, Wallet } from '../server/api/types';
import BidderProfileHeader from './BidderProfileHeader';
import BidderProfileInfo from './BidderProfileInfo';

type Props = {
  address?: string;
  wallet?: Wallet;
};

export default function BidderProfile(props: Props) {
  const walletDataTRPC = trpc.walletData.useQuery(
    { address: props.address || '' },
    {
      enabled: !props.wallet,
    },
  );

  const data = props.wallet || walletDataTRPC.data;

  if (!data) {
    return null;
  }

  return (
    <>
      <BidderProfileHeader
        address={data.details.address}
        details={data.details}
        balance={data.balance}
        nouns={data.nouns as Noun[]}
        domains={data.domains}
        dapps={data.dapps}
      />
      <BidderProfileInfo
        wins={Number(data.wins.count)}
        bidderHistory={data.bidderHistory as BidderHistory[]}
        address={data.details.address}
        largestBid={data.largestBid}
        bio={data.details.bio}
      />
      <div style={{ height: 'var(--s4)' }} />
    </>
  );
}
