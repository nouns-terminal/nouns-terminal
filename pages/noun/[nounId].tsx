import { useRouter } from 'next/router';
import Auction from '../../components/Auction';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';

export default function NounAuctionPage() {
  const router = useRouter();
  const nounId = Number(router.query.nounId) > 0 ? Number(router.query.nounId) : 0;
  return (
    <>
      <SiteHeader />
      <Auction auctionId={nounId} />
      <SiteFooter />
    </>
  );
}
