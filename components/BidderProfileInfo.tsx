import React from 'react';
import Stack from './Stack';
import Text from './Text';
import { formatEther } from 'viem';
import { Noun, BidderHistory } from '../server/api/types';
import Link from 'next/link';
import { createNounSVG } from '../utils/utils';
import { formatBalance } from '../utils/reactUtils';
import HorizontalLine from './HorizontalLine';
import { ExternalLinkIcon } from './Icons';

export default function BidderProfileInfo({
  wins,
  bidderHistory,
  address,
  largestBid,
  balance,
  bio,
}: {
  wins: number;
  bidderHistory?: BidderHistory[];
  address: string;
  largestBid?: {
    id: number;
    value: string;
    noun: Noun;
  } | null;
  balance?: string;
  bio?: string | null;
}) {
  const totalBidsCount = bidderHistory?.reduce((acc, curr) => acc + Number(curr.countBids), 0) || 0;
  const nounSVG = createNounSVG(largestBid?.noun as Noun);

  return (
    <div className="content">
      <Stack direction="column" gap={-1}>
        <span style={{ whiteSpace: 'pre' }}>
          <Text variant="title-2" bold color="green">
            {`${wins} ${wins > 1 ? 'Nouns' : 'Noun'} won`}
          </Text>
          <Text variant="title-2" bold color="mid-text">
            &nbsp;•&nbsp;{`from ${totalBidsCount} ${totalBidsCount > 1 ? 'bids' : 'bid'}`}
          </Text>
        </span>
        {bidderHistory && bidderHistory.length > 0 ? (
          <Text variant="body" color={'bright-text'}>
            {bidderHistory
              .sort((a, b) => b.auctionId - a.auctionId)
              .map((activity, index) => (
                <span key={index}>
                  <Link
                    href={`/noun/${activity.auctionId}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: activity.winner === address ? 'var(--bright-text)' : 'var(--low-text)',
                      lineHeight: 'var(--s1)',
                    }}
                  >
                    {activity.auctionId}
                  </Link>
                  {bidderHistory.length - 1 === index ? '' : ', '}
                </span>
              ))}
          </Text>
        ) : (
          <EmptySection height="2rem" />
        )}
        <HorizontalLine />
        <Stack direction="column" gap={2}>
          <Stack direction="column" gap={0}>
            <Text variant="title-1" bold color="low-text">
              Largest bid:
            </Text>
            {largestBid ? (
              <Text variant="large-title" bold color="low-text">
                <Text variant="large-title" bold color="yellow">
                  {Number(formatEther(BigInt(largestBid?.value || '0'))) < 0.01
                    ? '<0.01'
                    : formatEther(BigInt(largestBid?.value || '0'))}
                </Text>
                &nbsp;•&nbsp;
                <Text variant="large-title" bold color="bright-text">
                  <Link target="_blank" rel="noreferrer" href={`/noun/${largestBid?.id}`}>
                    Noun&nbsp;{`#${largestBid?.id}`}
                  </Link>
                  {nounSVG && (
                    <Link
                      target="_blank"
                      rel="noreferrer"
                      href={`https://opensea.io/assets/ethereum/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03/${largestBid?.id}`}
                    >
                      <img
                        src={nounSVG}
                        alt={`Noun ${largestBid?.id}`}
                        style={{ width: '24px' }}
                        className="hide-on-mobile"
                      />
                    </Link>
                  )}
                </Text>
              </Text>
            ) : (
              <EmptySection height="2rem" />
            )}
          </Stack>
          <Stack direction="column" gap={0}>
            <Text variant="title-1" bold color="low-text">
              Recent Activity:
            </Text>
            {bidderHistory && bidderHistory.length > 0 ? (
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
                          {activity.winner ? (
                            <td
                              style={{
                                color: `${activity.winner === address ? 'var(--green)' : 'var(--red)'}`,
                              }}
                            >
                              {activity.winner === address ? 'WON' : 'LOST'}
                            </td>
                          ) : (
                            <td
                              style={{
                                color: `var(--dark-bg)`,
                                backgroundColor: `var(--green)`,
                              }}
                            >
                              Live
                            </td>
                          )}
                          <td style={{ color: 'var(--low-text)', textAlign: 'right' }}>
                            <span suppressHydrationWarning>
                              {formatLastActivityTime(Number(activity.latestBidTime) * 1000)}
                              <span className="hide-on-mobile">&nbsp;ago</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptySection height="6rem" />
            )}
          </Stack>
        </Stack>
        <HorizontalLine />
        <Stack direction="column" gap={0}>
          <Text variant="title-1" bold color="low-text">
            Bio
            <a href={`/bio/${address}`} target="_blank" rel="noreferrer" className="bio-link">
              <ExternalLinkIcon />
            </a>
          </Text>
          {bio ? <span className="bio-text">{bio}</span> : <EmptySection height="6rem" />}
        </Stack>
      </Stack>
      <style jsx>{`
        .content {
          padding: 0 var(--s1) 0;
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
          max-height: 11rem;
          overflow-y: auto;
        }
        td {
          text-align: center;
        }
        .dot {
          width: 20px;
          color: var(--low-text);
        }
        .bio-text {
          line-height: var(--s1);
          max-height: 17rem;
          overflow-y: auto;
        }
        .bio-link {
          margin: 0 var(--s-2);
          color: var(--low-text);
        }
        .bio-link:hover {
          color: var(--bright-text);
        }
        @media only screen and (max-width: 600px) {
          .hide-on-mobile {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

function EmptySection({ height }: { height: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'var(--low-text)',
        height: height,
      }}
    >
      Empty
    </div>
  );
}

function formatLastActivityTime(lastActivity: number) {
  const pad2 = (n: number) => n.toString().padStart(2, ' ');
  const delta = Date.now() - lastActivity;
  const years = Math.floor(delta / (60 * 60 * 24 * 365 * 1000));
  const months = Math.floor(delta / (60 * 60 * 24 * 30 * 1000));
  const days = Math.floor(delta / (24 * 60 * 60 * 1000));
  const hours = Math.floor(delta / (60 * 60 * 1000));

  if (hours < 24) {
    return `${pad2(hours)}h`;
  } else if (days < 30) {
    return `${pad2(days)}d`;
  } else if (months < 12) {
    return `${pad2(months)}m`;
  }

  return `${pad2(years)}y`;
}
