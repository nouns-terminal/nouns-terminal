import Head from 'next/head';

type Props = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
};

export default function SiteHead({
  title = 'Nouns Terminal',
  description = 'Advanced interface for Nouns Auction',
  image = '/og_image.png',
  url = process.env.APP_URL,
}: Props) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@w1nt3r_eth" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="icon" href="/favicon.png" />
    </Head>
  );
}
