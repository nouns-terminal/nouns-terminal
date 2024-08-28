/* @name getAuctionLastQueriedBlock */
SELECT "value" FROM "state" WHERE "key" = 'auction_last_queried_block' LIMIT 1;

/* @name getTransferLastQueriedBlock */
SELECT "value" FROM "state" WHERE "key" = 'transfer_last_queried_block' LIMIT 1;

/* @name setAuctionLastQueriedBlock */
INSERT INTO "state" ("key", "value")
VALUES ('auction_last_queried_block', :lastBlockNumber!::INTEGER)
ON CONFLICT ("key") DO UPDATE SET
"value" = GREATEST("state"."value", :lastBlockNumber!::INTEGER);

/* @name setTransferLastQueriedBlock */
INSERT INTO "state" ("key", "value")
VALUES ('transfer_last_queried_block', :lastBlockNumber!::INTEGER)
ON CONFLICT ("key") DO UPDATE SET
"value" = GREATEST("state"."value", :lastBlockNumber!::INTEGER);

/* @name findBidsWithMissingTransactions */
SELECT "tx", "block", "auctionId", "walletAddress" FROM "bid" WHERE "bid"."timestamp" IS NULL ORDER BY "auctionId" DESC LIMIT :limit!::INTEGER;

/* @name updateBidTransactionMetadata */
UPDATE bid
SET
  "timestamp" = :timestamp, 
  "maxFeePerGas" = :maxFeePerGas,
  "walletBalance" = :walletBalance
WHERE "tx" = :txHash;

/* @name findUnindexedWallets */
(
  SELECT 
    "bid"."auctionId", 
    "bid"."walletAddress" as "address" 
  FROM "bid" 
  LEFT JOIN "wallet" 
    ON "bid"."walletAddress" = "wallet"."address" 
  WHERE "wallet"."ens" IS NULL AND "bid"."walletAddress" IS NOT NULL
)
UNION
(
  SELECT 
    NULL as "auctionId",
    "noun"."owner" as "address"
  FROM "noun"
  LEFT JOIN "wallet"
    ON "noun"."owner" = "wallet"."address"
  WHERE "wallet"."ens" IS NULL AND "noun"."owner" IS NOT NULL
)
ORDER BY "auctionId" DESC NULLS LAST
LIMIT :limit!::INTEGER;

/* @name updateWalletData */
INSERT INTO "wallet" ("address", "ens")
VALUES (:address!, :ens!)
ON CONFLICT ("address") DO UPDATE SET
  "ens" = :ens;

/* @name insertAuction */
INSERT INTO auction("id", "startTime", "endTime")
VALUES (:id!, :startTime!, :endTime!)
ON CONFLICT ("id") DO UPDATE SET
  "startTime" = EXCLUDED."startTime",
  "endTime" = EXCLUDED."endTime";

/* @name updateAuctionExtended */
UPDATE auction
SET "endTime" = GREATEST("auction"."endTime", :endTime::INTEGER)
WHERE auction.id = :id!;

/* @name updateAuctionSettled */
INSERT INTO auction("id", "startTime", "endTime", "winner", "price")
VALUES (:id!, 0, 0, :winner!, :price!)
ON CONFLICT ("id") DO UPDATE SET
  "winner" = EXCLUDED."winner",
  "price" = EXCLUDED."price";

/* @name insertAuctionBid */
INSERT INTO bid("tx", "index", "auctionId", "walletAddress", "value", "maxFeePerGas", "block", "extended")
VALUES (:tx!, :index!, :auctionId!, :walletAddress!, :value!, 0, :block!, :extended!)
ON CONFLICT DO NOTHING;

/* @name findUnindexedNouns */
SELECT * FROM "noun" WHERE "background" IS NULL ORDER BY "id" DESC LIMIT :limit!::INTEGER;

/* @name updateNounSeeds */
INSERT INTO "noun" ("id", "background", "body", "accessory", "head", "glasses")
VALUES (:id!, :background!, :body!, :accessory!, :head!, :glasses!)
ON CONFLICT ("id") DO UPDATE SET
  "background" = :background!,
  "body" = :body!,
  "accessory" = :accessory!,
  "head" = :head!,
  "glasses" = :glasses!;

  /* @name updateNounOwner */
INSERT INTO "noun" ("id", "owner")
VALUES (:id!, :owner!)
ON CONFLICT ("id") DO UPDATE SET
  "owner" = :owner!;

/* @name totalNounsSupply */
SELECT (MAX("id") - 1)::INTEGER AS count FROM "auction";

/* @name getLatestAuction */
SELECT * FROM "auction" ORDER BY "id" DESC LIMIT 1;

/* @name getLatestAuctionId */
SELECT "id" FROM auction ORDER BY id DESC LIMIT 1 OFFSET :offset!::INTEGER;

/* @name getAuctionById */
SELECT "id", "startTime", "endTime", "winner", "price"::TEXT FROM auction WHERE id = :id!::INTEGER;

/* @name getNounById */
SELECT * FROM noun WHERE id = :id!::INTEGER;

/* @name getBidsByAuctionId */
SELECT
  bid."tx", 
  bid."walletAddress", 
  bid."value"::TEXT,
  bid."walletBalance"::TEXT,
  bid."extended",
  bid."timestamp",
  bid."clientId",
  bid."maxFeePerGas"::TEXT
FROM
  bid
WHERE
  bid."auctionId" = :id!::INTEGER
ORDER BY
  bid.value DESC;

/* @name getWalletsByAuctionId */
WITH wins_count AS (
    SELECT winner, COUNT(*) AS count 
    FROM auction 
    GROUP BY winner
),
bid_counts AS (
    SELECT "walletAddress", COUNT(*) AS count
    FROM bid
    GROUP BY "walletAddress"
),
nouns_counts AS (
    SELECT "owner", COUNT(*) AS count
    FROM noun
    GROUP BY "owner"
)
SELECT
  b."walletAddress" AS "address",
  w.ens,
  COALESCE(bc.count, 0)::INT AS "bids", 
  COALESCE(nc.count, 0)::INT AS "nouns",
  COALESCE(wc.count, 0)::INT AS "wins"
FROM
  bid b
JOIN
  wallet w ON b."walletAddress" = w.address
LEFT JOIN
  wins_count wc ON wc.winner = b."walletAddress"
LEFT JOIN
  bid_counts bc ON bc."walletAddress" = w.address
LEFT JOIN
  nouns_counts nc ON nc."owner" = w.address
WHERE
  b."auctionId" = :id!::INTEGER;

/* @name findWalletsInLatestAuction */
SELECT DISTINCT ON (bid."walletAddress")
    bid."tx",
    bid."index",
    bid."walletAddress"
FROM bid
JOIN auction ON bid."auctionId" = auction.id
WHERE auction."winner" IS NULL
ORDER BY bid."walletAddress", bid."value" DESC;

/* @name updateWalletsValuesInLatestAuction */
UPDATE "public"."bid"
SET "walletBalance" = :walletBalance
WHERE "tx" = :tx::TEXT AND "index" = :index::INTEGER;

/* @name updateAuctionBidWithClientId */
UPDATE "public"."bid"
SET "clientId" = :clientId::INTEGER
WHERE "value" = :value! AND "auctionId" = :auctionId::INTEGER;

/* @name getNounPropertiesById */
WITH total_nouns AS (
  SELECT COUNT(*) AS total_count
  FROM public.noun
),
rarities AS (
  SELECT 
    body AS "id", 
    'body' AS "part",
    COUNT(*)::FLOAT / (SELECT total_count FROM total_nouns) AS rarity
  FROM public.noun
  GROUP BY body
  UNION ALL
  SELECT 
    accessory AS "id", 
    'accessory' AS "part",
    COUNT(*)::FLOAT / (SELECT total_count FROM total_nouns) AS rarity
  FROM public.noun
  GROUP BY accessory
  UNION ALL
  SELECT 
    head AS "id", 
    'head' AS "part",
    COUNT(*)::FLOAT / (SELECT total_count FROM total_nouns) AS rarity
  FROM public.noun
  GROUP BY head
  UNION ALL
  SELECT 
    glasses AS "id", 
    'glasses' AS "part",
    COUNT(*)::FLOAT / (SELECT total_count FROM total_nouns) AS rarity
  FROM public.noun
  GROUP BY glasses
)
SELECT 
  r."part",
  r."id",
  r.rarity
FROM 
  public.noun n
JOIN 
  rarities r
ON 
  (r."part" = 'background' AND r."id" = n.background) OR
  (r."part" = 'body' AND r."id" = n.body) OR
  (r."part" = 'accessory' AND r."id" = n.accessory) OR
  (r."part" = 'head' AND r."id" = n.head) OR
  (r."part" = 'glasses' AND r."id" = n.glasses)
WHERE 
  n.id = :id::INTEGER;

/* @name getAddressNouns */ 
SELECT "id", "background", "body", "accessory", "head", "glasses" FROM noun WHERE "owner" = :address!;

/* @name getAddressWins */ 
SELECT COUNT(*) FROM auction WHERE winner = :address!; 

/* @name getAddressLargestBid */
SELECT 
    "bid"."auctionId",
    "bid"."value",
    "noun"."accessory",
    "noun"."body",
    "noun"."background",
    "noun"."glasses",
    "noun"."head"
FROM 
    "bid"
LEFT JOIN "noun" ON "bid"."auctionId" = "noun"."id"
WHERE 
    "bid"."walletAddress" = :address!
    AND "bid"."value" = (
        SELECT MAX("value") 
        FROM "bid" 
        WHERE "walletAddress" = :address!
    );

/* @name getAddressBidsHistory */
SELECT 
    "bid"."auctionId",
    MAX("bid"."value") AS "maxBid",
    COUNT("bid"."walletAddress") AS "countBids",
    "auction"."winner" as "winner",
    MAX("bid"."timestamp") as "latestBidTime"
FROM 
    "bid"
LEFT JOIN "auction" on "bid"."auctionId" = "auction"."id" 
WHERE 
    "bid"."walletAddress" = :address!
GROUP BY 
    "bid"."auctionId", "auction"."winner";

/* @name getLastAuctionUnindexedWalletsSocials */
SELECT DISTINCT 
    "bid"."walletAddress"
FROM
    "bid"
LEFT JOIN
    "socials" ON "bid"."walletAddress" = "socials"."address"
WHERE
    "socials"."address" IS NULL AND
    "bid"."auctionId" IN (
        SELECT 
            "auctionId"
        FROM
            "bid"
        ORDER BY
            "auctionId" DESC
        LIMIT :limit!::INTEGER
    );

/* @name setAddressSocials */
INSERT INTO socials ("type", "nickname", "followers", "address") 
VALUES (:type, :nickname, :followers, :address!)
ON CONFLICT ("address") DO UPDATE SET
  "type" = :type,
  "nickname" = :nickname,
  "followers" = :followers;

/* @name getAddressDomains */
SELECT type, nickname, followers FROM socials WHERE address = :address! AND type = 'domain';

/* @name getAddressDapps */
SELECT type, nickname, followers FROM socials WHERE address = :address! AND type = 'farcaster';

/* @name getWalletByAddress */
SELECT wallet.address, wallet.ens, bio."bio"
FROM wallet 
LEFT JOIN bio on wallet.address = bio."bidder" 
WHERE address = :address!
ORDER BY bio."timestamp" DESC LIMIT 1;

/* @name insertWalletBio */
INSERT INTO bio ("bidder", "bio", "author") 
VALUES (:bidder, :bio, :author)
ON CONFLICT ("bio") DO NOTHING;

/* @name getPriceStats */
SELECT id, price FROM auction WHERE price IS NOT NULL ORDER BY id DESC LIMIT :days!;

/* @name getBidsStats */
SELECT bid."timestamp"
FROM bid
WHERE bid."auctionId" IN (
    SELECT bid."auctionId"
    FROM bid
    GROUP BY bid."auctionId" 
    ORDER BY bid."auctionId" DESC
    LIMIT :days!
);
