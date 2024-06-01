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
INSERT INTO "wallet" ("address", "ens", "nouns")
VALUES (:address!, :ens!, :nouns!)
ON CONFLICT ("address") DO UPDATE SET
  "ens" = :ens,
  "nouns" = :nouns;

/* @name insertAuction */
INSERT INTO auction("id", "startTime", "endTime")
VALUES (:id!, :startTime!, :endTime!)
ON CONFLICT DO NOTHING;


/* @name updateAuctionExtended */
UPDATE auction
SET "endTime" = GREATEST("auction"."endTime", :endTime::INTEGER)
WHERE auction.id = :id!;

/* @name updateAuctionSettled */
UPDATE auction
SET "winner" = :winner!, "price" = :price!
WHERE auction.id = :id!;

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
)
SELECT
  b."walletAddress" AS "address",
  w.ens,
  bc.count AS "bids", 
  w."nouns", 
  wc.count AS "wins"
FROM
  bid b
JOIN
  wallet w ON b."walletAddress" = w.address
LEFT JOIN
  wins_count wc ON wc.winner = b."walletAddress"
LEFT JOIN
  bid_counts bc ON bc."walletAddress" = w.address
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
