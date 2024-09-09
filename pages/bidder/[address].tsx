import SiteHead from '../../components/SiteHead';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import { Wallet } from '../../server/api/types';
import { GetServerSideProps } from 'next';
import getAddressData from '../../server/api/wallets';
import Auction from '../../components/Auction';
import { useState } from 'react';
import BidderProfile from '../../components/BidderProfile';

export default function BidderPage({
  bidderData,
  address,
}: {
  bidderData: Wallet;
  address: string;
}) {
  const [limit, setLimit] = useState(4);

  const data = {
    address,
    ens: bidderData.details.ens,
    wins: bidderData.wins.count || 0,
    bidsCount: bidderData.bidderHistory.reduce((acc, curr) => acc + Number(curr.countBids), 0) || 0,
    auctionsCount: bidderData.bidderHistory.length,
    largestBid: {
      id: bidderData.largestBid?.id,
      value: bidderData.largestBid?.value,
    },
    nouns: bidderData.nouns?.map((noun) => noun.id),
  };

  const dataStr = encodeURIComponent(JSON.stringify(data));
  const cacheBuster = Math.random().toString(36).substring(7);
  const ogImageRelativePath = `/api/bidder-opengraph-image?${cacheBuster}&data=${dataStr}`;

  return (
    <>
      <SiteHead title={`${address}`} ogImageRelativePath={ogImageRelativePath} />
      <SiteHeader />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div className="bidder-info">
          <BidderProfile wallet={bidderData} />
        </div>
        <div className="vertical-line" />
        <div className="auctions hide-on-mobile">
          {bidderData.bidderHistory && bidderData.bidderHistory.length > 0 ? (
            <>
              {bidderData.bidderHistory
                .sort((a, b) => b.auctionId - a.auctionId)
                .map((auction, index) => {
                  if (index > limit) {
                    return null;
                  }
                  return <Auction key={`bidder-auction-${index}`} auctionId={auction.auctionId} />;
                })}

              <div className="footer-offset">
                <button data-umami-event="Load More" onClick={() => setLimit((limit) => limit + 4)}>
                  Load More
                </button>
              </div>
              <div className="extra-space" />
            </>
          ) : (
            <div className="empty-section">Empty</div>
          )}
        </div>
      </div>
      <SiteFooter />
      <style jsx>{`
        .bidder-info {
          flex-grow: 1;
          max-width: 400px;
        }
        .auctions {
          flex-grow: 2;
          border-left: 1px solid var(--lines);
          width: 70%;
        }
        .footer-offset {
          height: 10rem;
          padding: 0px var(--s1);
          display: ${bidderData.bidderHistory.length > limit ? 'flex' : 'none'};
          flex-direction: column;
          align-items: center;
        }
        button {
          padding: var(--s-1) var(--s2);
          color: var(--mid-text);
          background-color: var(--surface-bg);
          border: none;
          cursor: pointer;
        }
        button:hover {
          color: var(--bright-text);
        }
        .empty-section {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          color: var(--low-text);
        }
        .extra-space {
          height: 5rem;
          display: ${bidderData.bidderHistory.length > limit ? 'none' : 'block'};
        }
        .vertical-line {
          width: 0.1px;
          background-color: var(--lines);
          height: 100vh;
        }
        @media only screen and (max-width: 600px) {
          .hide-on-mobile {
            display: none;
          }
        }
      `}</style>
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
