import Head from 'next/head';

type Props = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
};

export default function SiteHead({ title, description, image, url }: Props) {
  return (
    <Head>
      <title>{title || 'Nouns Terminal'}</title>
      <meta name="description" content={description || 'Advanced interface for Nouns Auction'} />
      <meta property="og:title" content={title || 'Nouns Terminal'} />
      <meta
        property="og:description"
        content={description || 'Advanced interface for Nouns Auction'}
      />
      <meta property="og:url" content={url || 'https://nouns.sh/'} />
      <meta property="og:image" content={image || 'https://nouns.sh/og_image.png'} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@w1nt3r_eth" />
      <meta name="twitter:title" content={title || 'Nouns Terminal'} />
      <meta
        name="twitter:description"
        content={description || 'Advanced interface for Nouns Auction'}
      />
      <meta name="twitter:image" content={image || 'https://nouns.sh/og_image.png'} />
      <link rel="icon" href="/favicon.png" />
    </Head>
  );
}
