import { useEffect, useState } from 'react';
import { SlideOverContent, type AuctionData } from '../server/api/types';
import { trpc } from '../utils/trpc';
import AuctionHeader from './AuctionHeader';
import BidsTable, { PendingBid } from './BidsTable';
import { useIsLive } from './LiveStatus';
import { useAccount } from 'wagmi';
import SlideOver from './SlideOver';
import NounInfo from './NounInfo';
import BidderProfile from './BidderProfile';
import Menu from './Menu';

export default function Auction({
  auctionId,
  auctionData,
}: {
  auctionId?: number;
  auctionData?: AuctionData;
}) {
  const [data, setData] = useState<AuctionData | null | undefined>(auctionData);
  const [pendingBid, setPendingBid] = useState<PendingBid | null>(null);
  const [slideOver, setSlideOver] = useState<SlideOverContent | null>(null);

  trpc.onLatest.useSubscription(
    { auctionId },
    {
      onData: (data: AuctionData) => {
        setData(data);
        if (data.bids.find((b) => pendingBid && b.tx === pendingBid.tx)) {
          setPendingBid(null);
        }
      },
    },
  );

  if (!data) {
    return null;
  }

  const ended = !!data.auction.price;

  const walletEns = (address: string | null) =>
    (data.wallets && address && data.wallets.find((w) => w.address === address)?.ens) || null;

  return (
    <>
      <SlideOver isOpen={!!slideOver} onClose={() => setSlideOver(null)}>
        {slideOver && slideOver.type === 'noun' ? (
          <NounInfo
            noun={data.noun}
            nounProperties={data.nounProperties}
            owner={data.noun?.owner || ''}
            winner={data.auction.winner || ''}
          />
        ) : slideOver && slideOver.type === 'bidder' ? (
          <BidderProfile address={slideOver.address} />
        ) : null}
      </SlideOver>
      <div className="auction">
        <AuctionHeader
          id={data.auction.id}
          startTime={data.auction.startTime}
          endTime={data.auction.endTime}
          maxBid={data.bids[0]?.value}
          winner={{ address: data.auction.winner || '', ens: walletEns(data.auction.winner) }}
          owner={{ address: data.noun?.owner || '', ens: walletEns(data.noun?.owner || null) }}
          noun={data.noun}
          ended={ended}
          onSubmitBid={setPendingBid}
          onNounClick={setSlideOver}
          onBidderClick={setSlideOver}
        />
        {!pendingBid && data.bids.length < 1 ? (
          <div className="info" data-testid="bids-table">
            No bids yet
          </div>
        ) : (
          <>
            <div className="hr" />
            <BidsTable
              bids={data.bids}
              wallets={data.wallets}
              pendingBid={pendingBid}
              ended={ended}
              onBidderClick={setSlideOver}
            />
          </>
        )}
        {!ended && <LiveMarquee to={data.auction.endTime * 1000} />}
      </div>
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
    </>
  );
}

function LiveMarquee({ to }: { to: number }) {
  const [online, setOnline] = useState(0);
  const isLive = useIsLive();
  const now = useNow();
  const delta = to - now;
  const isSettling = delta <= 0;
  const { address } = useAccount();
  const userStatus = `${online} ${online > 1 ? 'users' : 'user'} ONLINE `;
  const liveStatus = isSettling ? '↑ SETTLING\u00A0 ↑ ' : '↑ LIVE AUCTION ↑ ';
  const status = isLive ? liveStatus + userStatus : 'LOADING…\u00A0\u00A0';

  trpc.online.useSubscription({ address }, { onData: setOnline });

  return (
    <div className="live">
      <div className="content">{status.repeat(50)}</div>

      <style jsx>{`
        .live {
          color: var(--dark-bg);
          background-color: ${isLive
            ? isSettling
              ? 'var(--yellow)'
              : 'var(--green)'
            : 'var(--hint-text)'};
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

function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return now;
}
