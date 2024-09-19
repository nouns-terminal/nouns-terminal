import React, { useState } from 'react';
import AvaragePriceGraph from './AvaragePriceGraph';
import BidsCountGraph from './BidsCountGraph';
import { trpc } from '../utils/trpc';

export default function Graphs() {
  const [period, setPeriod] = useState<string>('3m');
  const { data } = trpc.statsData.useQuery();

  if (!data) {
    return null;
  }

  return (
    <div className="graphContainer">
      <div style={{ paddingLeft: 30 }}>
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
                periodData={data.prices.threeMonthPriceStats}
                backgroundShadowLimit={0.5}
              />
              <BidsCountGraph periodData={data.bids.threeMonthBidsStats} weeksAmount={13} />
            </>
          ) : period === '6m' ? (
            <>
              <AvaragePriceGraph
                periodData={data.prices.halfYearPriceStats}
                backgroundShadowLimit={1}
              />
              <BidsCountGraph periodData={data.bids.halfYearBidsStats} weeksAmount={26} />
            </>
          ) : (
            <>
              <AvaragePriceGraph
                periodData={data.prices.yearPriceStats}
                backgroundShadowLimit={3}
              />
              <BidsCountGraph periodData={data.bids.yearBidsStats} weeksAmount={52} />
            </>
          )}
        </div>
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
        .period_button {
          padding: 0 var(--s-2);
        }

        .period_button:first-child {
          padding-left: 0;
        }

        .period_button:last-child {
          padding-right: 0;
        }
        .graphContainer {
          width: 100%;
          padding: var(--s0) var(--s0) var(--s2) var(--s0);
          background: var(--surface-bg);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .graph {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
}
