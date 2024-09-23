import Head from 'next/head';
import { useRouter } from 'next/router';
type Props = {
  title?: string;
  description?: string;
  ogImageRelativePath?: string;
};

export default function SiteHead({
  title = 'Nouns Terminal',
  description = 'Advanced interface for Nouns Auction',
  ogImageRelativePath = '/og_image.png',
}: Props) {
  const router = useRouter();
  const previewImageFull = `https://nouns.sh${ogImageRelativePath}`;
  const url = `https://nouns.sh${router.asPath.replace(/\/$/, '')}`;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={previewImageFull} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@w1nt3r_eth" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={previewImageFull} />
      <link rel="icon" href="/favicon.png" />
    </Head>
  );
}
