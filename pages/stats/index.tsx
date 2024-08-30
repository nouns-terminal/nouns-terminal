import React from 'react';
import { trpc } from '../../utils/trpc';
import AvaragePriceGraph from '../../components/AvaragePriceGraph';
import BidsCountGraph from '../../components/BidsCountGraph';
import Tabs from 'rc-tabs';

export default function Stats() {
  const states = trpc.statsData.useQuery();

  const items = [
    {
      key: '3m',
      label: '3m',
      children: (
        <>
          <AvaragePriceGraph
            periodData={states.data?.prices.threeMonthPriceStats}
            backgroundShadowLimit={3}
          />
          <BidsCountGraph periodData={states.data?.bids.threeMonthBidsStats} weeksAmount={13} />
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
            periodData={states.data?.prices.halfYearPriceStats}
            backgroundShadowLimit={5}
          />
          <BidsCountGraph periodData={states.data?.bids.halfYearBidsStats} weeksAmount={26} />
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
          <AvaragePriceGraph
            periodData={states.data?.prices.yearPriceStats}
            backgroundShadowLimit={10}
          />
          <BidsCountGraph periodData={states.data?.bids.yearBidsStats} weeksAmount={52} />
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
