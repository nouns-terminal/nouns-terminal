import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { formatBidValue } from '../../utils/utils';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dataStr = searchParams.get('data');
  const data = JSON.parse(decodeURIComponent(dataStr || ''));

  const nouns: number[] = data.nouns;
  const address: string = data.address;
  const ens: string = data.ens;
  const wins: number = data.wins || 0;
  const bidsCount: number = data.bidsCount;
  const auctionsCount: number = data.auctionsCount;
  const largestBid: { id: number; value: string } = data.largestBid;

  const nounSVGs = nouns.map((id: number) => `https://noun.pics/${id}.svg`);
  const addressPfp = `https://ensdata.net/media/avatar/${address}`;

  const fontData = await fetch(
    new URL('../../public/fonts/ProtoMono-Regular.otf', import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          padding: '40px',
          fontFamily: '"Proto Mono", sans-serif',
          backgroundColor: '#000000',
          color: '#E0E0E0',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
            height: '100%',
          }}
        >
          <img
            src={addressPfp}
            alt={`Profile`}
            style={{
              width: '90%',
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
            height: '100%',
          }}
        >
          <span
            style={{
              fontSize: 45,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              maxWidth: '400px',
            }}
          >
            {ens ? ens : address}
          </span>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span
              style={{
                fontSize: 40,
                marginTop: '15px',
                color: '#999999',
              }}
            >
              Activity
            </span>
            <div style={{ display: 'flex', fontSize: 26, marginTop: '20px' }}>
              <span style={{ color: '#00C986' }}>
                {`${wins} ${wins > 1 ? 'Nouns' : 'Noun'} won`}
              </span>
              <span style={{ color: '#999999', margin: '0 5px' }}>•</span>
              <span
                style={{ color: '#999999' }}
              >{`from ${auctionsCount} ${auctionsCount > 1 ? 'aunctions' : 'auction'}`}</span>
            </div>
            <div style={{ display: 'flex', fontSize: 26, marginTop: '20px' }}>
              <span style={{ color: '#00C986' }}>{`${bidsCount}`}</span>
              <span style={{ color: '#999999', padding: '0 5px' }}>
                {`${bidsCount > 1 ? 'Bids' : 'Bid'} placed`}
              </span>
            </div>
            <div style={{ display: 'flex', fontSize: 26, marginTop: '20px' }}>
              <span
                style={{ color: '#FFB700', padding: '0 5px' }}
              >{`Ξ${formatBidValue(BigInt(largestBid.value))}`}</span>
              <span style={{ color: '#999999', padding: '0 5px' }}>•</span>
              <span style={{ padding: '0 5px' }}>{`Noun ${largestBid.id}`}</span>
              <img
                src={`https://noun.pics/${largestBid.id}.svg`}
                alt={`Noun ${largestBid.id}`}
                style={{
                  width: '30px',
                }}
                title={`Noun`}
              />
            </div>
            <div
              style={{
                marginTop: '20px',
                display: 'flex',
                flexWrap: 'wrap',
                maxHeight: '200px',
                maxWidth: '440px',
                overflow: 'hidden',
              }}
            >
              {nounSVGs &&
                nounSVGs.length > 0 &&
                nounSVGs.map((nounSVG: string, index: number) => (
                  <img
                    key={index}
                    src={nounSVG}
                    alt={`Noun`}
                    style={{
                      width: '58px',
                      margin: '5px 5px 5px 0',
                    }}
                    title={`Noun`}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Proto Mono',
          data: fontData,
          style: 'normal',
        },
      ],
    },
  );
}
