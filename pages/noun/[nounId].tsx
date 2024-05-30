import Auction from '../../components/Auction';
import SiteHead from '../../components/SiteHead';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import { GetServerSideProps } from 'next';
import getAuctionData from '../../server/getAuctionData';
import { AuctionData, Wallet } from '../../server/api/types';

export default function NounAuctionPage({ auctionData }: { auctionData: AuctionData }) {
  const lookup: { [address: string]: Wallet } = Object.fromEntries(
    auctionData.wallets.map((wallet) => [wallet.address, wallet]),
  );

  const data = {
    nounId: auctionData.auction.id,
    startTime: auctionData.auction.startTime,
    winnerAddress: auctionData.auction.winner,
    winnerENS: lookup[auctionData.auction.winner ?? '']?.ens || null,
    price: auctionData.auction.price,
    noun: auctionData.noun,
  };

  const dataStr = encodeURIComponent(JSON.stringify(data));
  const imgUrl = `/api/opengraph-image?data=${dataStr}`;

  return (
    <>
      <SiteHead
        title={`Noun ${auctionData.auction.id}`}
        image={imgUrl}
        url={`https://nouns.sh/noun/${auctionData.auction.id}`}
      />
      <SiteHeader />
      <Auction auctionId={auctionData.auction.id} auctionData={auctionData} />
      <SiteFooter />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auctionId = Number(context.query.nounId) > 0 ? Number(context.query.nounId) : 0;
  const auctionData = await getAuctionData(auctionId);

  if (!auctionData || !auctionData.auction) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      auctionData,
    },
  };
};
