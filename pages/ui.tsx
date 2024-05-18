import { parseEther } from 'ethers';
import Bidding from '../components/Bidding';
import Logo from '../components/Logo';
import SiteHeader from '../components/SiteHeader';
import Stack from '../components/Stack';
import Text from '../components/Text';

export default function UI() {
  return (
    <div className="container">
      <Stack direction="column" gap={0}>
        <div style={{ fontSize: '2rem' }}>
          <Logo />
        </div>
        <SiteHeader />
        <Text variant="large-title" color="bright-text">
          Large Title
        </Text>
        <Text variant="title-1" color="bright-text">
          Title 1
        </Text>
        <Text variant="title-2" color="bright-text">
          Title 2
        </Text>
        <Text variant="title-3" color="bright-text">
          Title 3
        </Text>
        <Text variant="headline" color="bright-text">
          Headline
        </Text>
        <Text variant="body" color="bright-text">
          Body
        </Text>
        <Text variant="subhead" color="bright-text">
          Subhead
        </Text>
        <Text variant="footnote" color="bright-text">
          Footnote
        </Text>
        <Stack direction="row" gap={0}>
          <div className="box box-1" />
          <div className="box box-2" />
          <div className="vline" />
          <Stack direction="column" gap={-1}>
            <Text variant="large-title" color="bright-text">
              Text Color
            </Text>
            <Text variant="large-title" color="mid-text">
              Text Color
            </Text>
            <Text variant="large-title" color="low-text">
              Text Color
            </Text>
            <Text variant="large-title" color="hint-text">
              Text Color
            </Text>
          </Stack>
          <Stack direction="column" gap={-1}>
            <Text variant="large-title" color="yellow">
              Text Color
            </Text>
            <Text variant="large-title" color="green">
              Text Color
            </Text>
            <Text variant="large-title" color="red">
              Text Color
            </Text>
            <Text variant="large-title" color="blue">
              Text Color
            </Text>
            <Text variant="large-title" color="pink">
              Text Color
            </Text>
          </Stack>
        </Stack>
        <Bidding currentBid={parseEther('88')} onSubmitBid={async (bid) => console.log(bid)} />
        <Bidding currentBid={parseEther('0.1')} onSubmitBid={async (bid) => console.log(bid)} />
        <Bidding currentBid={parseEther('0')} onSubmitBid={async (bid) => console.log(bid)} />
        {/* <AuctionHeader />
        <BidsTable /> */}
      </Stack>
      <style jsx>{`
        .container {
          padding: var(--s0);
        }
        .box {
          width: 156px;
          height: 156px;
          border-radius: 10px;
        }
        .box-1 {
          background-color: var(--dark-bg);
          border: solid 1px var(--lines);
        }
        .box-2 {
          background-color: var(--surface-bg);
        }
        .vline {
          width: 1px;
          height: auto;
          background-color: var(--lines);
        }
      `}</style>
    </div>
  );
}
