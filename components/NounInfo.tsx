import React from 'react';
import 'react-modern-drawer/dist/index.css';
import { Noun, NounProperty } from '../server/api/types';
import { getNounData } from '@nomonouns/assets';
import imageData from '@nomonouns/assets/dist/image-data.json';
import { createNounSVG } from '../utils/utils';
import Link from 'next/link';

export default function NounInfo({
  noun,
  nounProperties,
  winner,
  owner,
}: {
  noun: Noun | null;
  nounProperties: NounProperty[];
  winner: string;
  owner: string;
}) {
  if (!noun || !nounProperties || nounProperties.length < 4) {
    return null;
  }

  const { bgcolors } = imageData;
  const { parts } = getNounData(noun);

  const nounSVG = createNounSVG(noun, true);

  return (
    <>
      <div className="component">
        <Link
          href={`https://opensea.io/assets/ethereum/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03/${noun.id}`}
          target="_blank"
          rel="noreferrer"
        >
          <div className="image">
            <img src={nounSVG} alt={`Noun ${noun.id}`} width={120} height={120} />
          </div>
        </Link>
        <div className="traits">
          <div className="title">Traits</div>
          <table>
            <tbody>
              {parts.map((part, index) => (
                <tr key={`noun-stats-${index}`}>
                  <td style={{ color: 'var(--mid-text)' }}>{nounProperties[index].part}</td>
                  <td>{formatNounPropertyTitle(part.filename || '')}</td>
                  <td style={{ textAlign: 'right' }}>
                    {formatRarity(
                      Math.round(1 / nounProperties[index].rarity),
                      nounProperties[index].part,
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="hr" />
        </div>
        <div className="other">
          <div className="title">Other</div>
          <table>
            <tbody>
              <tr>
                <td style={{ color: 'var(--mid-text)' }}>Winner</td>
                <td>
                  <a
                    title={winner}
                    target="_blank"
                    rel="noreferrer"
                    href={`https://etherscan.io/address/${winner}`}
                  >
                    {winner}
                  </a>
                </td>
              </tr>

              <tr>
                <td style={{ color: 'var(--mid-text)' }}>Owner</td>
                {winner && (
                  <td>
                    <a
                      title={owner}
                      target="_blank"
                      rel="noreferrer"
                      href={`https://etherscan.io/address/${owner}`}
                    >
                      {owner}
                    </a>
                  </td>
                )}
              </tr>
            </tbody>
          </table>
          <div className="hr" />
        </div>
      </div>
      <style jsx>{`
        .component {
          padding: var(--s1);
        }
        .title {
          color: var(--low-text);
          margin-bottom: var(--s0);
        }
        .image {
          display: flex;
          justify-content: center;
          margin-bottom: var(--s1);
          background-color: #${bgcolors[noun.background]};
        }
        table {
          width: 100%;
        }
        th {
          text-align: left;
        }
        td {
          max-width: 15ch;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .hr {
          height: 1px;
          background-color: var(--lines);
          margin: var(--s1) 0;
        }
      `}</style>
    </>
  );
}

function formatNounPropertyTitle(filename: string) {
  const wordsToRemove = ['body', 'accessory', 'head', 'glasses'];
  let result = filename.replaceAll('-', ' ');

  wordsToRemove.forEach((word) => {
    const regex = new RegExp(word, 'gi');
    result = result.replace(regex, '');
  });

  return result;
}

function formatRarity(number: number, part: string) {
  const thresholds = {
    body: [25, 20, 15, 0],
    accessory: [250, 150, 100, 0],
    head: [350, 250, 150, 0],
    glasses: [25, 20, 15, 0],
    default: [0, 0, 0, 0],
  };

  let partThresholds = thresholds.default;
  switch (part) {
    case 'body':
      partThresholds = thresholds.body;
      break;
    case 'glasses':
      partThresholds = thresholds.glasses;
      break;
    case 'accessory':
      partThresholds = thresholds.accessory;
      break;
    case 'head':
      partThresholds = thresholds.head;
      break;
    default:
      break;
  }

  const getBars = (num: number, thresholds: number[]) => {
    const totalBars = 4;
    const colors = ['#E0A636', '#E09336', '#E07336', '#E03636'];
    const yellowBars = thresholds.filter((threshold) => num > threshold).length;
    const bars = Array.from({ length: totalBars }, (_, i) => (
      <svg key={i} width="1.2rem" viewBox="0 0 17 17" version="1.1" style={{ marginRight: '-9px' }}>
        <path d="M5 17h3v-17h-3v17z" fill={`${i < yellowBars ? colors[i] : 'var(--hint-text)'}`} />
      </svg>
    ));

    return <>{bars.reverse()}</>;
  };

  const bars = getBars(number, partThresholds);

  return (
    <>
      <span>{bars}</span>
    </>
  );
}
