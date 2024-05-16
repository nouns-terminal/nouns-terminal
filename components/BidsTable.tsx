// @ts-ignore
import jazzicon from '@metamask/jazzicon';
import { textStyle } from './Text';
import { formatEther, formatUnits } from 'ethers/lib/utils';
import { useEffect, useRef } from 'react';
import { Bid, Wallet } from '../server/getAuctionData';
import { BigNumber } from 'ethers';
import { atom, useAtom } from 'jotai';

const hoveredAddress = atom('');

type Props = {
  bids: readonly Bid[];
  wallets: readonly Wallet[];
  ended: boolean;
};

export default function BidsTable(props: Props) {
  const [address, setAddress] = useAtom(hoveredAddress);

  const lookup: { [address: string]: Wallet } = Object.fromEntries(
    props.wallets.map((wallet) => [wallet.address, wallet])
  );

  if (props.bids.length === 0) {
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
            <th>ETH&nbsp;Balance</th>
            <th>#All&nbsp;Bids</th>
            <th>#Wins</th>
            <th>When</th>
          </tr>
          {props.bids.map((bid, index) => (
            <tr
              key={bid.tx}
              onMouseEnter={() => setAddress(bid.walletAddress)}
              onMouseLeave={() => setAddress('')}
              className={address === bid.walletAddress ? 'hovered' : ''}
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
              <td>{formatUnits(bid.maxFeePerGas, 'gwei').split('.')[0]}</td>
              <td>{formatBalance(lookup[bid.walletAddress]?.balance)}</td>
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
      `}</style>
    </div>
  );
}

function formatBalance(balance?: string | null) {
  if (!balance) {
    return null;
  }

  let [a, b] = formatEther(BigNumber.from(balance)).split('.');
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

  const diff = BigNumber.from(value)
    .sub(BigNumber.from(prevValue))
    .mul(100)
    .div(BigNumber.from(prevValue));

  if (diff.gt(1000)) {
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

// https://github.com/MetaMask/metamask-extension/blob/6e5c2f03bfbc4a0c8fa334b7beedb19cf35c9d73/ui/helpers/utils/icon-factory.js#L65
function jsNumberForAddress(address: string) {
  const addr = address.slice(2, 10);
  const seed = parseInt(addr, 16);
  return seed;
}
