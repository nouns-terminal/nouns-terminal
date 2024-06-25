import React from 'react';
import Stack from './Stack';
import Text from './Text';
import { trpc } from '../utils/trpc';
import { formatEther } from 'viem';
import { ExternalLinkIcon } from './Icons';
import { ImageData, getNounData } from '@nouns/assets';
import { Noun, BidderHistory } from '../server/api/types';
import { buildSVG } from '@nouns/sdk/dist/image/svg-builder';
import Link from 'next/link';

export default function BidderProfile({ address }: { address: string | null }) {
  if (!address) {
    return null;
  }

  const wallet = trpc.walletData.useQuery({ address: address });

  return (
    <>
      <ProfileHeader
        address={address}
        ens={wallet.data?.ens}
        balance={wallet.data?.balance}
        nouns={wallet.data?.nouns as Noun[]}
      />
      <ProfileInfo
        wins={Number(wallet.data?.wins.count || 0)}
        bidderHistory={wallet.data?.bidderHistory as BidderHistory[]}
        address={address}
        largestBid={wallet.data?.largestBid}
      />
    </>
  );
}

function ProfileHeader({
  address,
  ens,
  balance,
  nouns,
}: {
  address: string;
  ens: string | null | undefined;
  balance:
    | {
        eth: string | undefined;
        usd: string | undefined;
      }
    | undefined;
  nouns: Noun[] | undefined;
}) {
  const nounSVGs = nouns?.map((noun) => createNounSVG(noun, true));

  return (
    <div style={{ backgroundColor: 'var(--dark-bg)' }}>
      <div className="content">
        <Stack direction="column" gap={-1}>
          <Text variant="large-title" bold color="bright-text">
            {parseAddress(address)}
            <a
              title={parseAddress(address)}
              target="_blank"
              rel="noreferrer"
              href={`https://etherscan.io/address/${address}`}
              className="external-link"
            >
              <ExternalLinkIcon />
            </a>
          </Text>
          {ens && (
            <Text variant="headline" bold color="low-text">
              {ens}
            </Text>
          )}
          <div className="dotted-hr" />
        </Stack>
        <div className="balance">
          <Stack direction="column" gap={1}>
            <Text variant="title-1" bold color="low-text">
              Balance
            </Text>
            <Stack direction="column" gap={-1}>
              <Text variant="large-title" bold color="bright-text">
                Ξ{formatEther(BigInt(balance?.eth || 0)).slice(0, 6)}
              </Text>
              <Text variant="headline" bold color="low-text">
                {formatUsdPrice(Number(balance?.usd || '0'))}
              </Text>
            </Stack>
          </Stack>
          <div className="extra-space" />
          <div className="nouns">
            {nouns &&
              nounSVGs &&
              nounSVGs.length > 0 &&
              nounSVGs.map((nounSVG, index) => (
                <Link
                  href={
                    nouns[index].id % 10 === 0
                      ? `https://opensea.io/assets/ethereum/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03/${nouns[index].id}`
                      : `/noun/${nouns[index].id}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  key={index}
                >
                  <img
                    src={nounSVG}
                    alt={`Noun ${nouns[index].id}`}
                    style={{ paddingBottom: 'var(--s-2)', width: '24px' }}
                  />
                </Link>
              ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        .dotted-hr {
          height: 1px;
          background-image: linear-gradient(to right, var(--lines) 90%, rgba(0, 0, 0, 0) 10%);
          background-size: var(--s2) 1px;
          margin: var(--s1) 0 var(--s1);
        }
        .extra-space {
          width: var(--s5);
        }
        .content {
          padding: var(--s1) var(--s1) 0;
        }
        .external-link {
          margin-left: var(--s-2);
          color: var(--low-text);
        }
        .external-link:hover {
          color: var(--bright-text);
        }
        .balance {
          display: flex;
          align-items: flex-start;
          direction: column;
          justify-content: left;
        }
        .nouns {
          display: flex;
          flex-wrap: wrap;
          gap: var(${'--s-2'});
        }
      `}</style>
      <HorizontalLine />
    </div>
  );
}

function ProfileInfo({
  wins,
  bidderHistory,
  address,
  largestBid,
}: {
  wins: number;
  bidderHistory: BidderHistory[] | undefined;
  address: string;
  largestBid:
    | {
        id: number;
        value: string;
        noun: Noun;
      }
    | undefined;
}) {
  if (!largestBid || !bidderHistory) {
    return null;
  }

  const totalBidsCount = bidderHistory?.reduce((acc, curr) => acc + Number(curr.countBids), 0) || 0;
  const nounSVG = createNounSVG(largestBid?.noun as Noun);

  return (
    <div className="content">
      <Stack direction="column" gap={1}>
        <Text variant="title-1" bold color="low-text">
          Bidder Strength
        </Text>
        <Text variant="title-2" bold color="low-text">
          <Text variant="title-2" bold color="yellow">
            {wins >= 3 ? '★★★' : wins >= 1 ? '★★' : '★'}
          </Text>
          &nbsp;
          <Text variant="title-2" bold color="low-text">
            •&nbsp;{wins >= 3 ? 'Strong Bidder' : wins >= 1 ? 'Medium Bidder' : 'Weak Bidder'}
          </Text>
        </Text>
        <Text variant="body" color="low-text">
          <span style={{ lineHeight: 'var(--s1)' }}>
            Based on total wallet worth, total nouns held, number of previous rounds lost, and
            others factors.
          </span>
        </Text>
      </Stack>
      <HorizontalLine />
      <Stack direction="column" gap={-1}>
        <span>
          <Text variant="title-2" bold color="green">
            {`${wins} ${wins > 1 ? 'Nouns' : 'Noun'} won`}
          </Text>
          <Text variant="title-2" bold color="mid-text">
            &nbsp;•&nbsp;{`from ${totalBidsCount} ${totalBidsCount > 1 ? 'bids' : 'bid'}`}
          </Text>
        </span>
        {bidderHistory && (
          <>
            <span className="bidder-history">
              <Text variant="body" color={'bright-text'}>
                {bidderHistory.map((activity, index) => (
                  <span key={index}>
                    <Link
                      href={`/noun/${activity.auctionId}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color:
                          activity.winner === address ? 'var(--bright-text)' : 'var(--low-text)',
                        lineHeight: 'var(--s1)',
                      }}
                    >
                      {activity.auctionId}
                    </Link>
                    {bidderHistory.length - 1 === index ? '' : ', '}
                  </span>
                ))}
              </Text>
            </span>
            <HorizontalLine />
          </>
        )}
        <Stack direction="column" gap={2}>
          <Stack direction="column" gap={0}>
            <Text variant="title-1" bold color="low-text">
              Largest bid:
            </Text>
            <Text variant="large-title" bold color="low-text">
              <Text variant="large-title" bold color="yellow">
                {formatEther(BigInt(largestBid?.value || '0'))}
              </Text>
              &nbsp;•&nbsp;
              <Text variant="large-title" bold color="bright-text">
                <Link target="_blank" rel="noreferrer" href={`/noun/${largestBid?.id}`}>
                  {`Noun #${largestBid?.id}`}&nbsp;
                </Link>
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href={`https://opensea.io/assets/ethereum/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03/${largestBid?.id}`}
                >
                  <img src={nounSVG} alt={`Noun ${largestBid?.id}`} style={{ width: '24px' }} />
                </Link>
              </Text>
            </Text>
          </Stack>
          <Stack direction="column" gap={0}>
            <Text variant="title-1" bold color="low-text">
              Recent Activity:
            </Text>
            <div className="activity-table">
              <table>
                <tbody>
                  {bidderHistory
                    .sort((a, b) => b.auctionId - a.auctionId)
                    .map((activity, index) => (
                      <tr key={index}>
                        <td>
                          <Link
                            href={`/noun/${activity.auctionId}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            #{activity.auctionId}
                          </Link>
                        </td>
                        <td className="dot">•</td>
                        <td>{formatBalance(BigInt(activity.maxBid))}</td>
                        <td className="dot">•</td>
                        <td>{`${activity.countBids} ${Number(activity.countBids) > 1 ? 'bids' : 'bid'}`}</td>
                        <td className="dot">•</td>
                        <td
                          style={{
                            color: `${activity.winner === address ? 'var(--green)' : 'var(--red)'}`,
                          }}
                        >
                          {activity.winner === address ? 'WON' : 'LOST'}
                        </td>
                        <td style={{ color: 'var(--low-text)', textAlign: 'right' }}>
                          <span suppressHydrationWarning>
                            {formatTime(Number(activity.latestBidTime) * 1000)}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Stack>
        </Stack>
      </Stack>
      <style jsx>{`
        .content {
          padding: 0 var(--s1) 0;
        }
        .bidder-history {
          max-height: 6rem;
          overflow-y: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          color: var(--bright-text);
          font-weight: 600;
          font-size: 1.1rem;
          white-space: nowrap;
        }
        .activity-table {
          max-height: 13rem;
          overflow-y: auto;
        }
        .dot {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 20px;
          color: var(--low-text);
        }
      `}</style>
    </div>
  );
}

function HorizontalLine() {
  return (
    <>
      <div className="hr" />
      <style jsx>{`
        .hr {
          height: 1px;
          background-color: var(--lines);
          margin: var(--s1) 0 var(--s1);
        }
      `}</style>
    </>
  );
}

function parseAddress(address: string) {
  return `${address.slice(0, 4)}…${address.slice(-5)}`;
}

function formatUsdPrice(amount: number) {
  const bigint = BigInt(Math.floor(amount));
  const num = formatEther(bigint);

  const formatted = Number(num).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return '$' + formatted;
}

function createNounSVG(noun: Noun, isBackground?: boolean): string {
  const data = getNounData(noun);
  const { parts, background } = data;

  let svgBinary;

  if (isBackground) {
    svgBinary = buildSVG(parts, ImageData.palette, background);
  } else {
    svgBinary = buildSVG(parts, ImageData.palette);
  }

  return 'data:image/svg+xml;base64,' + btoa(svgBinary);
}

function formatTime(lastActivity: number) {
  const pad2 = (n: number) => n.toString().padStart(2, ' ');
  const delta = Date.now() - lastActivity;
  const years = Math.floor(delta / (60 * 60 * 24 * 365 * 1000));
  const months = Math.floor(delta / (60 * 60 * 24 * 30 * 1000));
  const days = Math.floor(delta / (24 * 60 * 60 * 1000));
  const hours = Math.floor(delta / (60 * 60 * 1000));

  if (hours < 24) {
    return `${pad2(hours)}h ago`;
  } else if (days < 30) {
    return `${pad2(days)}d ago`;
  } else if (months < 12) {
    return `${pad2(months)}m ago`;
  }

  return `${pad2(years)}y ago`;
}

function formatBalance(balance: bigint, prefix = 'Ξ') {
  let [a, b] = formatEther(balance).split('.');
  if (!b) {
    b = '0';
  }
  if (b.length > 2) {
    b = b.substring(0, 2);
  }

  if (a == '0' && b == '00') {
    prefix = '<';
    b = '01';
  }

  return (
    <>
      {prefix}
      {a}
      <small style={{ opacity: 0.5 }}>.{b}</small>
    </>
  );
}