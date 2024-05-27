// @ts-ignore
import jazzicon from '@metamask/jazzicon';
import { textStyle } from './Text';
import { formatEther, formatGwei } from 'viem';
import { useEffect, useRef } from 'react';
import { Bid, Wallet } from '../server/api/types';
import { atom, useAtom } from 'jotai';

export const hoveredAddress = atom('');

export type PendingBid = Bid & { ens: string | null };

type Props = {
  bids: readonly Bid[];
  wallets: readonly Wallet[];
  pendingBid: PendingBid | null;
  ended: boolean;
};

export default function BidsTable(props: Props) {
  const [address, setAddress] = useAtom(hoveredAddress);

  const lookup: { [address: string]: Wallet } = Object.fromEntries(
    props.wallets.map((wallet) => [wallet.address, wallet]),
  );

  if (props.pendingBid && !lookup[props.pendingBid.walletAddress]) {
    lookup[props.pendingBid.walletAddress] = {
      address: props.pendingBid.walletAddress,
      ens: props.pendingBid.ens,
      bids: 1,
      nouns: 0,
      wins: 0,
    };
  }

  const bids = props.pendingBid ? [props.pendingBid, ...props.bids] : props.bids;

  if (bids.length === 0) {
    return null;
  }

  return (
    <div className="container">
      <table>
        <tbody>
          <tr>
            <th>
              <div className="icon-placeholder" />
            </th>
            <th>Bidder</th>
            <th>Bid</th>
            <th>%change</th>
            <th>Gwei</th>
            <th>
              <span
                title="ETH balance left after placing this bid"
                style={{ whiteSpace: 'nowrap' }}
              >
                ETH&nbsp;LEFT&nbsp;[
                <span className="tooltip-svg">
                  <TooltipSVG />
                </span>
                ]
              </span>
            </th>
            <th>#All&nbsp;Bids</th>
            <th>#Wins</th>
            <th>When</th>
          </tr>
          {bids.map((bid, index) => (
            <tr
              key={bid.tx}
              onMouseEnter={() => setAddress(bid.walletAddress)}
              onMouseLeave={() => setAddress('')}
              className={address === bid.walletAddress ? 'hovered' : ''}
              style={{ opacity: bid === props.pendingBid ? 0.5 : 1 }}
            >
              <td>
                <Icon address={bid.walletAddress} />
              </td>
              <td>
                <div className="address">
                  <a
                    title={lookup[bid.walletAddress]?.ens || bid.walletAddress}
                    target="_blank"
                    rel="noreferrer"
                    href={`https://etherscan.io/address/${bid.walletAddress}`}
                  >
                    {lookup[bid.walletAddress]?.ens || bid.walletAddress}
                  </a>
                </div>
              </td>
              <td>{formatBalance(bid.value)}</td>
              <td>{formatPercentChanged(bid.value, props.bids[index + 1]?.value)}</td>
              <td>{formatGwei(BigInt(bid.maxFeePerGas)).split('.')[0]}</td>
              <td>{formatBalance(bid.walletBalance)}</td>
              <td>{lookup[bid.walletAddress]?.bids}</td>
              <td>{lookup[bid.walletAddress]?.wins || '0'}</td>
              <td>
                <a target="_blank" rel="noreferrer" href={`https://etherscan.io/tx/${bid.tx}`}>
                  {bid.timestamp
                    ? new Date(bid.timestamp * 1000)
                        .toLocaleString()
                        .replace(/, (\d):/, ',  $1:') // Add space to maintain the same characters count -> (6:35:23 PM) to ( 6:35:23 PM)
                        .replaceAll(' ', '\u00A0') // Replace spaces with unbreakeble spaces
                    : '-'}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .container {
          overflow: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          color: ${props.ended ? 'var(--mid-text)' : 'var(--bright-text)'};
        }
        th {
          ${textStyle({ variant: 'footnote', color: 'low-text' })}
          text-align: left;
        }
        tr {
          height: 2.7rem;
        }
        td:not(:first-child),
        th:not(:first-child) {
          padding-left: var(--s0);
        }
        tr:not(:last-child) {
          border-bottom: 1px solid var(--lines);
        }
        tr.hovered {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .icon-placeholder {
          width: 24px;
          height: 24px;
          background-color: var(--lines);
        }
        .address {
          max-width: 42ch;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        @media only screen and (max-width: 950px) {
          .address {
            max-width: 20ch;
          }
        }
        @media only screen and (min-width: 950px) and (max-width: 1200px) {
          .address {
            max-width: 35ch;
          }
        }
        th .tooltip-svg {
          color: var(--bright-text);
        }
      `}</style>
    </div>
  );
}

function formatBalance(balance?: string | null) {
  if (!balance) {
    return null;
  }

  let [a, b] = formatEther(BigInt(balance)).split('.');
  if (!b) {
    b = '0';
  }
  if (b.length > 2) {
    b = b.substring(0, 2);
  }

  return (
    <>
      Ξ{a}
      <small style={{ opacity: 0.5 }}>.{b}</small>
    </>
  );
}

function formatPercentChanged(value: string, prevValue?: string) {
  if (!prevValue) {
    return '';
  }

  const diff = ((BigInt(value) - BigInt(prevValue)) * 100n) / BigInt(prevValue);

  if (diff > 1000n) {
    return '∞';
  }

  return diff.toString() + '%';
}

export function Icon(props: { address: string }) {
  const iconRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const parent = iconRef.current;
    if (parent) {
      parent.innerHTML = '';
      const el = jazzicon(24, jsNumberForAddress(props.address));
      parent.appendChild(el);
    }
  }, [props.address]);

  return (
    <span className="icon" ref={iconRef}>
      <style jsx>{`
        .icon > :global(div) {
          border-radius: 0px !important;
        }
      `}</style>
    </span>
  );
}

function TooltipSVG() {
  return (
    <svg width={3} height={8} viewBox="0 0 3 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.125 0H1C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2H1.125H1.25C1.80228 2 2.25 1.55228 2.25 1C2.25 0.447715 1.80228 0 1.25 0H1.125Z"
        fill="currentColor"
      />
      <path
        d="M1.125 4H1C0.447715 4 0 4.44772 0 5V6V7C0 7.55228 0.447715 8 1 8H1.125H1.25C1.80228 8 2.25 7.55228 2.25 7V6V5C2.25 4.44772 1.80228 4 1.25 4H1.125Z"
        fill="currentColor"
      />
    </svg>
  );
}

// https://github.com/MetaMask/metamask-extension/blob/6e5c2f03bfbc4a0c8fa334b7beedb19cf35c9d73/ui/helpers/utils/icon-factory.js#L65
function jsNumberForAddress(address: string) {
  const addr = address.slice(2, 10);
  const seed = parseInt(addr, 16);
  return seed;
}
