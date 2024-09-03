/* eslint-disable jsx-a11y/alt-text */
// @ts-ignore
import jazzicon from '@metamask/jazzicon';
import { textStyle } from './Text';
import { formatEther, formatGwei } from 'viem';
import { useEffect, useRef, useState } from 'react';
import type { Bid, SlideOverContent, WalletDetails } from '../server/api/types';
import { atom, useAtom } from 'jotai';
import ClientOnly from './ClientOnly';
import { ClientIdIcon, TooltipIcon } from './Icons';
import { formatBalance } from '../utils/reactUtils';

export const hoveredAddress = atom('');

export type PendingBid = Bid & { ens: string | null };

type Props = {
  bids: readonly Bid[];
  wallets: readonly WalletDetails[];
  pendingBid: PendingBid | null;
  ended: boolean;
  onBidderClick: (content: SlideOverContent) => void;
};

export default function BidsTable(props: Props) {
  const [address, setAddress] = useAtom(hoveredAddress);

  const lookup: { [address: string]: WalletDetails } = Object.fromEntries(
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
        <tbody data-testid="bids-table">
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
                title="Max ETH liquidity available to the bidder at the time of the bid"
                style={{ whiteSpace: 'nowrap' }}
              >
                MAX&nbsp;BID&nbsp;[
                <span className="tooltip-svg">
                  <TooltipIcon />
                </span>
                ]
              </span>
            </th>
            <th>#Bids</th>
            <th>#Wins</th>
            <th>#Nouns</th>
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
                  <span
                    data-testid="wallet-address"
                    onClick={() => {
                      props.onBidderClick({ type: 'bidder', address: bid.walletAddress });
                    }}
                  >
                    {lookup[bid.walletAddress]?.ens || bid.walletAddress}
                  </span>
                </div>
              </td>
              <td>{formatBalance(BigInt(bid.value))}</td>
              <td>{formatPercentChanged(bid.value, props.bids[index + 1]?.value)}</td>
              <td>{formatGwei(BigInt(bid.maxFeePerGas)).split('.')[0]}</td>
              <td>
                {formatBalance(BigInt(bid.walletBalance ?? 0) + BigInt(bid.value))}
                {bid.walletBalanceChange &&
                  Math.max(Number(formatEther(BigInt(bid.walletBalanceChange)))) > 0.01 && (
                    <span
                      style={{
                        color: bid.walletBalanceChange.startsWith('-')
                          ? 'var(--red)'
                          : 'var(--green)',
                      }}
                    >
                      {' '}
                      {formatBalance(BigInt(bid.walletBalanceChange), '+')}
                    </span>
                  )}
              </td>
              <td>{lookup[bid.walletAddress]?.bids}</td>
              <td>{lookup[bid.walletAddress]?.wins || ' '}</td>
              <td>{lookup[bid.walletAddress]?.nouns || ' '}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://etherscan.io/tx/${bid.tx}`}
                  suppressHydrationWarning
                >
                  {bid.timestamp
                    ? new Date(bid.timestamp * 1000)
                        .toLocaleString()
                        .replace(/, (\d):/, ',  $1:') // Add space to maintain the same characters count -> (6:35:23 PM) to ( 6:35:23 PM)
                        .replaceAll(' ', '\u00A0') // Replace spaces with unbreakeble spaces
                    : '-'}
                </a>
                <ClientIdIcon clientId={bid.clientId || 0} />
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
          width: 42ch;
          cursor: pointer;
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

function Avatar({
  address,
  visible,
  onSuccess,
}: {
  address: string;
  visible: boolean;
  onSuccess: () => void;
}) {
  return (
    <ClientOnly>
      <img
        src={`https://ensdata.net/media/avatar/${address}`}
        onLoad={onSuccess}
        width={visible ? 24 : 0}
        height={visible ? 24 : 0}
      />
    </ClientOnly>
  );
}

export function Icon(props: { address: string }) {
  const iconRef = useRef<HTMLSpanElement>(null);
  const [avatarLoaded, setAvatarLoaded] = useState(false);

  useEffect(() => {
    const parent = iconRef.current;
    if (parent) {
      parent.innerHTML = '';
      const el = jazzicon(24, jsNumberForAddress(props.address));
      parent.appendChild(el);
    }
  }, [props.address]);

  return (
    <>
      <Avatar
        address={props.address}
        visible={avatarLoaded}
        onSuccess={() => setAvatarLoaded(true)}
      />

      {!avatarLoaded && (
        <span className="icon" ref={iconRef}>
          <style jsx>{`
            .icon > :global(div) {
              border-radius: 0px !important;
            }
          `}</style>
        </span>
      )}
    </>
  );
}

// https://github.com/MetaMask/metamask-extension/blob/6e5c2f03bfbc4a0c8fa334b7beedb19cf35c9d73/ui/helpers/utils/icon-factory.js#L65
function jsNumberForAddress(address: string) {
  const addr = address.slice(2, 10);
  const seed = parseInt(addr, 16);
  return seed;
}
