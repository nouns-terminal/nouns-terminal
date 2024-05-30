import Auction from '../../components/Auction';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import getAuctionData from '../../server/getAuctionData';
import { AuctionData } from '../../server/api/types';

export default function NounAuctionPage({ auctionData }: { auctionData: AuctionData }) {
  return (
    <>
      <Head>
        <title>Noun {auctionData.auction.id}</title>
      </Head>
      <SiteHeader />
      <Auction auctionId={auctionData.auction.id} />
      <SiteFooter />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auctionId = Number(context.query.nounId) > 0 ? Number(context.query.nounId) : 0;
  const auctionData = await getAuctionData(auctionId);

  return {
    props: {
      auctionData,
    },
  };
};
