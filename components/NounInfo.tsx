import React from 'react';
import 'react-modern-drawer/dist/index.css';
import { Noun, NounProperty } from '../server/api/types';
import { getNounData } from '@nouns/assets';
import imageData from '@nouns/assets/dist/image-data.json';
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
                <tr key={index}>
                  <td style={{ color: 'var(--mid-text)' }}>{nounProperties[index].part}</td>
                  <td>{formatNounPropertyTitle(part.filename || '')}</td>
                  <td style={{ color: 'var(--yellow)', textAlign: 'right' }}>
                    {formatRarity((nounProperties[index].rarity * 100).toString())}
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

function formatRarity(number: string, prefix = '') {
  let [a, b] = number.split('.');
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
      {a}.{b}
      {'%'}
    </>
  );
}
