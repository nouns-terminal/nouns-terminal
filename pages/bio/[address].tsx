import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import SiteHeader from '../../components/SiteHeader';
import BidderBio from '../../components/BidderBio';
import ClientOnly from '../../components/ClientOnly';
import SiteHead from '../../components/SiteHead';
import SiteFooter from '../../components/SiteFooter';

export default function AddressBio() {
  const router = useRouter();
  const bidder = trpc.walletData.useQuery({
    address: router.query.address?.toString().toLowerCase() || '',
  });

  if (!bidder.data) {
    return (
      <>
        <SiteHead />
        <SiteHeader />
        <div className="bidder-status">{bidder.isLoading ? 'Loading…' : 'Bidder not found'}</div>
        <SiteFooter />
        <style jsx>
          {`
            @keyframes pulse {
              50% {
                opacity: 0.5;
              }
            }
            .bidder-status {
              display: flex;
              height: 90vh;
              justify-content: center;
              align-items: center;
              text-align: center;
              white-space: nowrap;
              ${bidder.isLoading
                ? 'animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;'
                : ''}
            }
          `}
        </style>
      </>
    );
  }

  return (
    <>
      <SiteHead />
      <SiteHeader />
      <ClientOnly>
        <BidderBio bidder={bidder.data.details} />
      </ClientOnly>
      <SiteFooter />
    </>
  );
}
