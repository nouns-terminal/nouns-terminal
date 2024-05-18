/* @name getAuctionLastQueriedBlock */
SELECT "value" FROM "state" WHERE "key" = 'auction_last_queried_block' LIMIT 1;

/* @name setAuctionLastQueriedBlock */
INSERT INTO "state" ("key", "value")
VALUES ('auction_last_queried_block', :lastBlockNumber!::INTEGER)
ON CONFLICT ("key") DO UPDATE SET
"value" = GREATEST("state"."value", :lastBlockNumber!::INTEGER);

/* @name findBidsWithMissingTransactions */
SELECT "tx", "block", "auctionId" FROM "bid" WHERE "bid"."timestamp" IS NULL ORDER BY "auctionId" DESC LIMIT :limit!::INTEGER;

/* @name updateBidTransactionMetadata */
UPDATE bid
SET
  "timestamp" = :timestamp, 
  "maxFeePerGas" = :maxFeePerGas
WHERE "tx" = :txHash;

/* @name findUnindexedWallets */
SELECT "bid"."auctionId", "bid"."walletAddress" as "address"
FROM "bid"
LEFT JOIN "wallet" ON "bid"."walletAddress" = "wallet"."address"
WHERE "ens" IS NULL ORDER BY "bid"."auctionId" DESC LIMIT :limit!::INTEGER;

/* @name updateWalletData */
INSERT INTO "wallet" ("address", "ens", "balanceEth", "balanceWeth", "nouns")
VALUES (:address!, :ens!, :balanceEth!, :balanceWeth!, :nouns!)
ON CONFLICT ("address") DO UPDATE SET
  "ens" = :ens,
  "balanceEth" = :balanceEth,
  "balanceWeth" = :balanceWeth,
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
INSERT INTO bid("tx", "auctionId", "walletAddress", "value", "maxFeePerGas", "block", "extended")
VALUES (:tx!, :auctionId!, :walletAddress!, :value!, 0, :block!, :extended!)
ON CONFLICT DO NOTHING;

/* @name findUnindexedNouns */
SELECT "auction"."id" as "id"
FROM "auction"
LEFT JOIN "noun" ON "auction"."id" = "noun"."id"
WHERE "background" IS NULL
ORDER BY "id" DESC
LIMIT :limit!::INTEGER;

/* @name updateNounSeeds */
INSERT INTO "noun" ("id", "background", "body", "accessory", "head", "glasses")
VALUES (:id!, :background!, :body!, :accessory!, :head!, :glasses!)
ON CONFLICT ("id") DO UPDATE SET
  "background" = :background!,
  "body" = :body!,
  "accessory" = :accessory!,
  "head" = :head!,
  "glasses" = :glasses!;

/* @name totalNounsSupply */
SELECT (MAX("id") - 1)::INTEGER AS count FROM "auction";

/* @name getLatestAuction */
SELECT * FROM "auction" ORDER BY "id" DESC LIMIT 1;
