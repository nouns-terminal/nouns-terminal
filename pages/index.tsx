import type { NextPage } from 'next';
import { useState } from 'react';
import Auction from '../components/Auction';
import SiteFooter from '../components/SiteFooter';
import SiteHeader from '../components/SiteHeader';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const [limit, setLimit] = useState(4);

  return (
    <div>
      <SiteHeader />
      <SiteFooter />
      <Auction />
      {new Array(limit - 1).fill(0).map((_, idx) => (
        <Auction key={`auction-${idx}`} auctionId={-1 - idx} />
      ))}

      <div className="footer-offset">
        <button onClick={() => setLimit((limit) => limit + 5)}>Load More</button>
      </div>
      <style jsx>{`
        .footer-offset {
          height: 10rem;
          padding: 0px var(--s1);
          display: flex;
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
      `}</style>
    </div>
  );
};

export default Home;
