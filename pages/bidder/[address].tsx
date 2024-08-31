import SiteHead from '../../components/SiteHead';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import BidderProfileHeader from '../../components/BidderProfileHeader';
import BidderProfileInfo from '../../components/BidderProfileInfo';
import { Wallet } from '../../server/api/types';
import { GetServerSideProps } from 'next';
import getAddressData from '../../server/api/wallets';

export default function BidderPage({
  bidderData,
  address,
}: {
  bidderData: Wallet;
  address: string;
}) {
  const data = {
    address,
    ens: bidderData.details.ens,
    wins: bidderData.wins.count,
    bidsCount: bidderData.bidderHistory.reduce((acc, curr) => acc + Number(curr.countBids), 0) || 0,
    auctionsCount: bidderData.bidderHistory.length,
    largestBid: { id: bidderData.largestBid.id, value: bidderData.largestBid.value },
    nouns: bidderData.nouns?.map((noun) => noun.id),
  };

  const dataStr = encodeURIComponent(JSON.stringify(data));
  const cacheBuster = Math.random().toString(36).substring(7);
  const ogImageRelativePath = `/api/bidder-opengraph-image?${cacheBuster}&data=${dataStr}`;

  return (
    <>
      <SiteHead title={`${address}`} ogImageRelativePath={ogImageRelativePath} />
      <SiteHeader />
      <BidderProfileHeader
        address={address}
        details={bidderData.details}
        balance={bidderData.balance}
        nouns={bidderData.nouns}
        domains={bidderData.domains}
        dapps={bidderData.dapps}
      />
      <BidderProfileInfo
        wins={Number(bidderData.wins.count || 0)}
        bidderHistory={bidderData.bidderHistory}
        address={address}
        largestBid={bidderData.largestBid}
        balance={bidderData.balance.eth}
        bio={bidderData.details.bio}
      />
      <div style={{ height: 'var(--s4)' }} />
      <SiteFooter />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const address = context.query.address;
  const bidderData = await getAddressData(address?.toString().toLocaleLowerCase() || '');

  if (!bidderData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      bidderData,
      address,
    },
  };
};
