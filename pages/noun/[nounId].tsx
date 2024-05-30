import Auction from '../../components/Auction';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import getAuctionData from '../../server/getAuctionData';
import { AuctionData } from '../../server/api/types';

export default function NounAuctionPage({ auctionData }: { auctionData: AuctionData }) {
  const data = {
    nounId: auctionData.auction.id,
    startTime: auctionData.auction.startTime,
    winner: auctionData.auction.winner,
    price: auctionData.auction.price,
    noun: auctionData.noun,
  };
  const dataStr = encodeURIComponent(JSON.stringify(data));
  const imgUrl = `${process.env.APP_URL ? process.env.APP_URL : 'http://localhost:3003'}/api/opengraph-image?data=${dataStr}`;
  return (
    <>
      <Head>
        <title>Noun {auctionData.auction.id}</title>
        <meta name="description" content="Advanced interface for Nouns Auction" />
        <meta property="og:title" content={`Noun ${auctionData.auction.id}`} />
        <meta property="og:description" content="Advanced interface for Nouns Auction" />
        <meta property="og:image" content={imgUrl} />
        <meta property="og:url" content={`https://nouns.sh/noun/${auctionData.auction.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@w1nt3r_eth" />
        <meta name="twitter:title" content={`Noun ${auctionData.auction.id}`} />
        <meta name="twitter:description" content="Advanced interface for Nouns Auction" />
        <meta name="twitter:image" content={imgUrl} />
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
