import React, { useState } from 'react';
import AvaragePriceGraph from './AvaragePriceGraph';
import BidsCountGraph from './BidsCountGraph';
import { GraphsData } from '../server/api/types';

export default function Graphs({ stats }: { stats?: GraphsData }) {
  if (!stats) {
    return null;
  }
  const [period, setPeriod] = useState<string>('3m');

  return (
    <div className="container">
      <div className="period_buttons">
        <span
          className={`period_button ${period === '3m' ? 'period_button_selected' : ''}`}
          onClick={() => setPeriod('3m')}
        >
          3m
        </span>
        |
        <span
          className={`period_button ${period === '6m' ? 'period_button_selected' : ''}`}
          onClick={() => setPeriod('6m')}
        >
          6m
        </span>
        |
        <span
          className={`period_button ${period === '1y' ? 'period_button_selected' : ''}`}
          onClick={() => setPeriod('1y')}
        >
          1y
        </span>
      </div>
      <div className="graph">
        {period === '3m' ? (
          <>
            <AvaragePriceGraph
              periodData={stats.prices.threeMonthPriceStats}
              backgroundShadowLimit={0.5}
            />
            <BidsCountGraph periodData={stats.bids.threeMonthBidsStats} weeksAmount={13} />
          </>
        ) : period === '6m' ? (
          <>
            <AvaragePriceGraph
              periodData={stats.prices.halfYearPriceStats}
              backgroundShadowLimit={1}
            />
            <BidsCountGraph periodData={stats.bids.halfYearBidsStats} weeksAmount={26} />
          </>
        ) : (
          <>
            <AvaragePriceGraph periodData={stats.prices.yearPriceStats} backgroundShadowLimit={3} />
            <BidsCountGraph periodData={stats.bids.yearBidsStats} weeksAmount={52} />
          </>
        )}
      </div>
      <style jsx>{`
        .period_buttons {
          margin-bottom: var(--s1);
          color: var(--mid-text);
        }
        .period_buttons > span {
          cursor: pointer;
        }
        .period_button_selected {
          color: var(--bright-text);
        }
      `}</style>
    </div>
  );
}
