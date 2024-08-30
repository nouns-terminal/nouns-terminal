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
  const { nounId, startTime, winnerAddress, winnerENS, price } = data;
  const nounSVG = `https://noun.pics/${nounId}.svg`;
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
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100%' }}>
          <img alt={`Noun ${nounId}`} src={nounSVG} width="50%" height="100%" />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignContent: 'center',
              justifyContent: 'center',
              color: '#E0E0E0',
              marginLeft: '50px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '50px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: 25,
                }}
              >
                {new Date(Number(startTime) * 1000).toDateString()}
              </div>
              <div
                style={{
                  display: 'flex',
                  color: '#FFB700',
                  fontSize: 45,
                }}
              >
                Noun {nounId}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '50px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  color: '#999999',
                  fontSize: 25,
                }}
              >
                Winning Bid
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 45,
                }}
              >
                {price ? `Ξ${formatBidValue(BigInt(price))}` : '—'}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  color: '#999999',
                  fontSize: 25,
                }}
              >
                Won By
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 45,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  maxWidth: '400px',
                }}
              >
                {winnerENS || winnerAddress || '—'}
              </div>
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
