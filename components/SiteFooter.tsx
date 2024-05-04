import { MouseEvent, useEffect, useState } from 'react';
import { GasIcon, HoareIcon, TortoiseIcon } from './Icons';
import Logo from './Logo';
import Text from './Text';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import ClientOnly from './ClientOnly';
import { trpc } from '../utils/trpc';
import { Vitals } from '../server/api/types';
import { BigNumber } from 'ethers';
import { formatEther, formatUnits } from 'ethers/lib/utils';
import { useIsLive } from './LiveStatus';

type GasPreset = 'average' | 'instant';
const gasPreset = atomWithStorage<GasPreset>('nouns.gas_preset', 'average');

export default function SiteFooter() {
  const [vitals, setVitals] = useState<Vitals | null>(null);
  trpc.useSubscription(['vitals'], { onNext: setVitals });

  const isLive = useIsLive();

  return (
    <footer>
      <div className="info">
        <VitalsStatus isLive={isLive} vitals={vitals} />
      </div>
      <div className="logo">
        <Text variant="large-title">
          <Logo />
        </Text>
      </div>
      <div className="presets">
        <TreasuryStatus vitals={vitals} />
      </div>
      <style jsx>{`
        footer {
          display: flex;
          position: fixed;
          overflow: auto;
          gap: var(--s1);
          bottom: 0;
          left: 0;
          right: 0;
          backdrop-filter: blur(10px);
          background: rgba(15, 16, 17, 0.83);
          padding: var(--s1);
          border-top: 1px solid var(--lines);
          z-index: 1;
        }
        .info {
          flex: 1 0 40ch;
          display: flex;
          gap: var(--s0);
          align-items: center;
        }
        .logo {
          flex: 1 1 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .presets {
          display: flex;
          flex: 1 0 40ch;
          gap: var(--s0);
          align-items: center;
          justify-content: flex-end;
        }
        @media (max-width: 800px) {
          .info,
          .logo,
          .presets {
            flex-grow: 0;
            flex-shrink: 1;
          }
        }
      `}</style>
    </footer>
  );
}

function VitalsStatus({ isLive, vitals }: { isLive: boolean; vitals: Vitals | null }) {
  return (
    <>
      <GreenDot connected={isLive} />
      <Text variant="body" bold color="mid-text">
        {isLive ? 'Live\u00A0Data' : 'Loading…\u00A0'}
      </Text>
      <VR />
      <Text variant="body" bold color="mid-text">
        <Text variant="body" bold color="bright-text">
          ETH
        </Text>
        &nbsp;
        {formatUsdPrice(vitals?.usdPrice)}
      </Text>
      <VR />
      <Text variant="body" bold color="mid-text">
        <Text variant="body" bold color="bright-text">
          GWEI
        </Text>
        &nbsp;
        {formatGwei(vitals?.gasPriceInWei)}
      </Text>
    </>
  );
}

function TreasuryStatus({ vitals }: { vitals: Vitals | null }) {
  return (
    <>
      <Text variant="body" bold color="mid-text">
        <Text variant="body" bold color="bright-text">
          Treasury
        </Text>
        &nbsp;
        {vitals
          ? 'Ξ' +
            Math.round(
              Number(formatEther(BigNumber.from(vitals.treasuryBalanceInWei)))
            ).toLocaleString('en-US')
          : '-'}
      </Text>
      <VR />
      <Text variant="body" bold color="mid-text">
        <Text variant="body" bold color="bright-text">
          NAV
        </Text>
        &nbsp;
        {vitals
          ? 'Ξ' +
            Number(
              formatEther(BigNumber.from(vitals.treasuryBalanceInWei).div(vitals.nounsSold))
            ).toFixed(2)
          : '-'}
      </Text>
    </>
  );
}

export function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return now;
}

function formatUsdPrice(price?: number) {
  if (!price) {
    return '$' + '\u00A0'.repeat(8);
  }

  return (
    '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
}

function formatGwei(price?: string) {
  if (!price) {
    return '-';
  }

  return Math.round(Number(formatUnits(BigNumber.from(price), 'gwei')));
}

function VR() {
  return (
    <div className="vr">
      <style jsx>{`
        .vr {
          width: 1px;
          height: 1.3rem;
          background-color: var(--lines);
        }
      `}</style>
    </div>
  );
}

function PresetsToggle() {
  const [preset, setPreset] = useAtom(gasPreset);

  const handleChange = (newPreset: GasPreset) => {
    return (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setPreset(newPreset);
    };
  };

  return (
    <div className="presets">
      <GasIcon /> Presets
      <VR />
      <a
        href="#"
        onClick={handleChange('average')}
        className={preset === 'average' ? 'selected' : ''}
      >
        <TortoiseIcon /> Average
      </a>
      <VR />
      <a
        href="#"
        onClick={handleChange('instant')}
        className={preset === 'instant' ? 'selected' : ''}
      >
        <HoareIcon /> Instant
      </a>
      <style jsx>{`
        .presets {
          display: flex;
          gap: var(--s0);
          color: var(--low-text);
          align-items: center;
          justify-content: flex-end;
        }
        a {
          color: var(--mid-text);
        }
        a:hover {
          color: var(--light-yellow);
        }
        .selected {
          color: var(--yellow);
        }
      `}</style>
    </div>
  );
}

function GreenDot({ connected }: { connected: boolean }) {
  return (
    <div className="ring-container">
      {connected && <div className="ringring"></div>}
      <div className="circle"></div>
      <style jsx>{`
        .ring-container {
          position: relative;
          width: 15px;
          height: 15px;
          padding: 2.5px;
        }

        .circle {
          width: 10px;
          height: 10px;
          background-color: ${connected ? 'var(--green)' : 'var(--mid-text)'};
          border-radius: 50%;
          position: absolute;
        }

        .ringring {
          background: var(--green);
          border: 3px solid var(--green);
          border-radius: 30px;
          height: 25px;
          width: 25px;
          position: absolute;
          margin: -7.5px;
          animation: pulsate 2s ease-out;
          animation-iteration-count: infinite;
          opacity: 0;
        }
        @keyframes pulsate {
          0% {
            transform: scale(0.1, 0.1);
            opacity: 0;
          }
          20% {
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1, 1.1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
