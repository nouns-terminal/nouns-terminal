DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'migrations') THEN
        CREATE TABLE migrations (
            version INT PRIMARY KEY,
            comment TEXT NOT NULL,
            applied_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
        INSERT INTO migrations (version, comment) VALUES (0, 'Initial version');
    END IF;
END
$$;

--

DO $$
DECLARE
    current_version INT;
BEGIN
    SELECT MAX(version) INTO current_version FROM migrations;
    RAISE NOTICE 'Current migration version is: %', current_version;
END
$$;

--

DO $$
DECLARE
    migration_version INT := 1;
    migration_comment TEXT := 'Create auction table';
BEGIN
    IF (SELECT MAX(version) FROM migrations) < migration_version THEN
        RAISE NOTICE '%', migration_comment;
        CREATE TABLE "public"."auction" (
            "id" int4 NOT NULL,
            "startTime" int4 NOT NULL,
            "endTime" int4 NOT NULL,
            "winner" text,
            "price" numeric(78,0),
            PRIMARY KEY ("id")
        );
        CREATE INDEX idx_auction_id_desc ON public.auction("id" DESC);
        INSERT INTO migrations (version, comment) VALUES (migration_version, migration_comment);
    END IF;
END
$$;

--

DO $$
DECLARE
    migration_version INT := 2;
    migration_comment TEXT := 'Create bid table';
BEGIN
    IF (SELECT MAX(version) FROM migrations) < migration_version THEN
        RAISE NOTICE '%', migration_comment;
        CREATE TABLE "public"."bid" (
            "tx" text NOT NULL,
            "index" int4 NOT NULL,
            "auctionId" int4 NOT NULL,
            "walletAddress" text NOT NULL,
            "value" numeric(78,0) NOT NULL,
            "clientId" int4 DEFAULT NULL,
            "maxFeePerGas" numeric(78,0) NOT NULL,
            "block" int4 NOT NULL,
            "walletBalance" numeric(78,0) DEFAULT NULL,
            "extended" bool NOT NULL,
            "timestamp" int4,
            PRIMARY KEY ("tx", "index")
        );
        CREATE INDEX idx_bid_tx ON public.bid("tx");
        CREATE INDEX idx_bid_auctionId_value ON public.bid("auctionId", value DESC);
        CREATE INDEX idx_bid_walletAddress_auctionId ON public.bid("walletAddress", "auctionId" DESC);
        INSERT INTO migrations (version, comment) VALUES (migration_version, migration_comment);
    END IF;
END
$$;

--

DO $$
DECLARE
    migration_version INT := 3;
    migration_comment TEXT := 'Create noun table';
BEGIN
    IF (SELECT MAX(version) FROM migrations) < migration_version THEN
        RAISE NOTICE '%', migration_comment;
        CREATE TABLE "public"."noun" (
            "id" int4 NOT NULL,
            "background" int4 NOT NULL,
            "body" int4 NOT NULL,
            "accessory" int4 NOT NULL,
            "head" int4 NOT NULL,
            "glasses" int4 NOT NULL,
            PRIMARY KEY ("id")
        );
        INSERT INTO migrations (version, comment) VALUES (migration_version, migration_comment);
    END IF;
END
$$;

--

DO $$
DECLARE
    migration_version INT := 4;
    migration_comment TEXT := 'Create wallet table';
BEGIN
    IF (SELECT MAX(version) FROM migrations) < migration_version THEN
        RAISE NOTICE '%', migration_comment;
        CREATE TABLE "public"."wallet" (
            "address" text NOT NULL,
            "ens" text,
            "nouns" int4,
            PRIMARY KEY ("address")
        );
        INSERT INTO migrations (version, comment) VALUES (migration_version, migration_comment);
    END IF;
END
$$;

--

DO $$
DECLARE
    migration_version INT := 5;
    migration_comment TEXT := 'Create state table';
BEGIN
    IF (SELECT MAX(version) FROM migrations) < migration_version THEN
        RAISE NOTICE '%', migration_comment;
        CREATE TABLE "public"."state" (
            "key" text NOT NULL,
            "value" int4,
            PRIMARY KEY ("key")
        );
        INSERT INTO migrations (version, comment) VALUES (migration_version, migration_comment);
    END IF;
END
$$;

--

DO $$
DECLARE
    migration_version INT := 6;
    migration_comment TEXT := 'Add owner to noun table and attributes optional';
BEGIN
    IF (SELECT MAX(version) FROM migrations) < migration_version THEN
        RAISE NOTICE '%', migration_comment;
        ALTER TABLE "public"."noun" ADD COLUMN "owner" text;
        ALTER TABLE "public"."noun" ALTER COLUMN "background" DROP NOT NULL;
        ALTER TABLE "public"."noun" ALTER COLUMN "body" DROP NOT NULL;
        ALTER TABLE "public"."noun" ALTER COLUMN "accessory" DROP NOT NULL;
        ALTER TABLE "public"."noun" ALTER COLUMN "head" DROP NOT NULL;
        ALTER TABLE "public"."noun" ALTER COLUMN "glasses" DROP NOT NULL;
        INSERT INTO migrations (version, comment) VALUES (migration_version, migration_comment);
    END IF;
END
$$;

--

DO $$
DECLARE
    migration_version INT := 7;
    migration_comment TEXT := 'Remove unused nouns field from wallet table';
BEGIN
    IF (SELECT MAX(version) FROM migrations) < migration_version THEN
        RAISE NOTICE '%', migration_comment;
        ALTER TABLE "public"."wallet" DROP COLUMN "nouns";
        INSERT INTO migrations (version, comment) VALUES (migration_version, migration_comment);
    END IF;
END
$$;

--

DO $$
DECLARE
    migration_version INT := 8;
    migration_comment TEXT := 'Add index to noun owner';
BEGIN
    IF (SELECT MAX(version) FROM migrations) < migration_version THEN
        RAISE NOTICE '%', migration_comment;
        CREATE INDEX idx_noun_owner ON noun("owner");
        INSERT INTO migrations (version, comment) VALUES (migration_version, migration_comment);
    END IF;
END
$$;

--

DO $$
DECLARE
    migration_version INT := 9;
    migration_comment TEXT := 'Create socials table';
BEGIN
    IF (SELECT MAX(version) FROM migrations) < migration_version THEN
        RAISE NOTICE '%', migration_comment;
        CREATE TABLE "public"."socials" (
            "type" text,
            "nickname" text,
            "followers" INT,
            "address" text NOT NULL,
            PRIMARY KEY ("address")
        );
        INSERT INTO migrations (version, comment) VALUES (migration_version, migration_comment);
    END IF;
END
$$;

--

CREATE OR REPLACE FUNCTION notify_when_new_auction()
RETURNS trigger AS $$
BEGIN
	IF (OLD."background" IS DISTINCT FROM NEW."background") THEN
    	PERFORM pg_notify('auction_started', NEW.id::text);
  	END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    migration_version INT := 10;
    migration_comment TEXT := 'Create function and trigger for auction created notification';
BEGIN
    IF (SELECT MAX(version) FROM migrations) < migration_version THEN
        RAISE NOTICE '%', migration_comment;
        CREATE TRIGGER new_auction_created_trigger
        AFTER INSERT OR UPDATE ON "public"."noun"
        FOR EACH ROW EXECUTE FUNCTION notify_when_new_auction();
        INSERT INTO migrations (version, comment) VALUES (migration_version, migration_comment);
    END IF;
END
$$;

--

CREATE OR REPLACE FUNCTION notify_when_auction_settled()
RETURNS trigger AS $$
BEGIN
	IF (OLD."winner" IS DISTINCT FROM NEW."winner") THEN
    	PERFORM pg_notify('auction_settled', NEW.id::text);
  	END IF;
  RETURN NEW;
  
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    migration_version INT := 11;
    migration_comment TEXT := 'Create function and trigger for auction settled notification';
BEGIN
    IF (SELECT MAX(version) FROM migrations) < migration_version THEN
        RAISE NOTICE '%', migration_comment;
        CREATE TRIGGER auction_settled_trigger
        AFTER INSERT OR UPDATE ON "public"."auction"
        FOR EACH ROW EXECUTE FUNCTION notify_when_auction_settled();
        INSERT INTO migrations (version, comment) VALUES (migration_version, migration_comment);
    END IF;
END
$$;
