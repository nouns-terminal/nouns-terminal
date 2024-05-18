import { useState } from 'react';
import { type AuctionData } from '../server/api/types';
import { trpc } from '../utils/trpc';
import AuctionHeader from './AuctionHeader';
import BidsTable from './BidsTable';
import { useIsLive } from './LiveStatus';

export default function Auction({ auctionId }: { auctionId?: number }) {
  const [data, setData] = useState<AuctionData | null | undefined>();

  trpc.useSubscription(['latest', { auctionId }], {
    onNext: setData,
  });

  if (!data) {
    return null;
  }

  const ended = !!data.auction.price;

  return (
    <div className="auction">
      <AuctionHeader
        id={data.auction.id}
        startTime={data.auction.startTime}
        endTime={data.auction.endTime}
        maxBid={data.bids[0]?.value}
        winner={
          (data.auction.winner &&
            data.wallets.find((w) => w.address === data.auction.winner)?.ens) ||
          data.auction.winner
        }
        noun={data.noun}
        ended={ended}
      />
      {data.bids.length < 1 ? (
        <div className="info">No bids yet</div>
      ) : (
        <>
          <div className="hr" />
          <BidsTable bids={data.bids} wallets={data.wallets} ended={ended} />
        </>
      )}
      {!ended && <LiveMarquee />}
      <style jsx>{`
        .auction {
          padding: var(--s1);
          padding-bottom: ${ended ? 'var(--s1)' : '0'};
          margin-bottom: ${ended ? '0' : 'var(--s1)'};
          background-color: ${ended ? 'var(--dark-bg)' : 'var(--surface-bg)'};
        }
        .hr {
          height: 1px;
          background-color: var(--lines);
          margin: var(--s1) 0;
        }
        .info {
          display: flex;
          justify-content: center;
          align-items: center;
          height: var(--s3);
          margin: var(--s1) 0;
          color: var(--mid-text);
        }
      `}</style>
    </div>
  );
}

function LiveMarquee() {
  const isLive = useIsLive();

  return (
    <div className="live">
      <div className="content">
        {(isLive ? '↑ LIVE AUCTION ' : 'LOADING…\u00A0\u00A0').repeat(50)}
      </div>

      <style jsx>{`
        .live {
          color: var(--dark-bg);
          background-color: ${isLive ? 'var(--green)' : 'var(--hint-text)'};
          overflow: hidden;
          white-space: nowrap;
          margin: var(--s1) calc(0px - var(--s1)) 0;
          padding: var(--s-3) var(--s1);
        }
        .content {
          animation: 120s scroll infinite linear;
        }

        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-1000px);
          }
        }
      `}</style>
    </div>
  );
}
