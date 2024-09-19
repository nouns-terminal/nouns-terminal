import Stack from './Stack';
import Text from './Text';

export default function Menu() {
  return (
    <div className="menu-container">
      <Stack direction="column" gap={1}>
        <Text variant="title-1" color="mid-text">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/nouns-terminal/nouns-terminal/"
            className="link"
          >
            Github
          </a>
        </Text>
        <Text variant="title-1" color="mid-text">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://warpcast.com/nouns-terminal"
            className="link"
          >
            Farcaster
          </a>
        </Text>
        <Text variant="title-1" color="mid-text">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://opensea.io/collection/nouns"
            className="link"
          >
            OpenSea
          </a>
        </Text>
        <Text variant="title-1" color="mid-text">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://stats.nouns.sh/share/iNRTi5xKcW5QJRAM/nouns.sh"
            className="link"
          >
            Analytics
          </a>
        </Text>
        <Text variant="title-1" color="mid-text">
          <a target="_blank" rel="noreferrer" href="https://nouns.camp/" className="link">
            Governance
          </a>
        </Text>
        <Text variant="title-1" color="mid-text">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/nouns-terminal/nouns-terminal/issues/new"
            className="link"
          >
            Report a bug
          </a>
        </Text>
      </Stack>
      <style jsx>{`
        .link:hover {
          color: var(--bright-text);
        }
        .menu-container {
          margin: var(--s2);
        }
      `}</style>
    </div>
  );
}
