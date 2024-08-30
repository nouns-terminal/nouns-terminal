import React from 'react';
import Tabs from 'rc-tabs';
import AvaragePriceGraph from './AvaragePriceGraph';
import BidsCountGraph from './BidsCountGraph';
import { GraphsData } from '../server/api/types';

export default function Graphs({ states }: { states: GraphsData | undefined }) {
  if (!states) {
    return;
  }
  const items = [
    {
      key: '3m',
      label: '3m',
      children: (
        <>
          <AvaragePriceGraph
            periodData={states.prices.threeMonthPriceStats}
            backgroundShadowLimit={0.5}
          />
          <BidsCountGraph periodData={states.bids.threeMonthBidsStats} weeksAmount={13} />
        </>
      ),
      destroyInactiveTabPane: true,
    },
    {
      key: '1',
      label: '|',
      children: '',
      destroyInactiveTabPane: true,
      disabled: true,
    },
    {
      key: '6m',
      label: '6m',
      children: (
        <>
          <AvaragePriceGraph
            periodData={states.prices.halfYearPriceStats}
            backgroundShadowLimit={1}
          />
          <BidsCountGraph periodData={states.bids.halfYearBidsStats} weeksAmount={26} />
        </>
      ),
      destroyInactiveTabPane: true,
    },
    {
      key: '2',
      label: '|',
      children: '',
      destroyInactiveTabPane: true,
      disabled: true,
    },
    {
      key: '1y',
      label: '1y',
      children: (
        <>
          <AvaragePriceGraph periodData={states.prices.yearPriceStats} backgroundShadowLimit={3} />
          <BidsCountGraph periodData={states.bids.yearBidsStats} weeksAmount={52} />
        </>
      ),
      destroyInactiveTabPane: true,
    },
  ];
  return (
    <>
      <Tabs tabBarGutter={5} tabPosition="top" items={items} defaultActiveKey="3m" />
      <style>{`
        .rc-tabs-nav-list {
          display: flex;
          color: var(--mid-text)
        }
        .rc-tabs-tab-active {
          color: var(--bright-text)
        }
        .rc-tabs-ink-bar-animated {
          display: none;
        }
      `}</style>
    </>
  );
}
