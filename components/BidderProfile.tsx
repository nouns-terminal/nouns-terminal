import React from 'react';
import { trpc } from '../utils/trpc';
import { Noun, BidderHistory } from '../server/api/types';
import BidderProfileHeader from './BidderProfileHeader';
import BidderProfileInfo from './BidderProfileInfo';

export default function BidderProfile({ address }: { address: string | null }) {
  if (!address) {
    return null;
  }

  const wallet = trpc.walletData.useQuery({ address: address });

  return (
    <>
      <BidderProfileHeader
        address={address}
        ens={wallet.data?.ens}
        balance={wallet.data?.balance}
        nouns={wallet.data?.nouns as Noun[]}
        domains={wallet.data?.domains}
        dapps={wallet.data?.dapps}
      />
      <BidderProfileInfo
        wins={Number(wallet.data?.wins.count || 0)}
        bidderHistory={wallet.data?.bidderHistory as BidderHistory[]}
        address={address}
        largestBid={wallet.data?.largestBid}
        balance={wallet.data?.balance.eth}
      />
      <div style={{ height: 'var(--s2)' }} />
    </>
  );
}
