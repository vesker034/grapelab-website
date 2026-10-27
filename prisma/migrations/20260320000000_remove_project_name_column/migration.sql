-- Check rawName column
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "raw_name" TEXT;

-- Update rawName where rawName is null
UPDATE "projects"
SET "raw_name" = "name"
WHERE "raw_name" IS NULL OR "raw_name" = '';


-- Resolve duplicate raw_name values
UPDATE "projects" p
SET "raw_name" = p."raw_name" || '_' || p."id"
WHERE p."id" IN (
    SELECT id
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY raw_name ORDER BY id) AS rn
        FROM "projects"
    ) ranked
    WHERE rn > 1
);
-- Set rawName not null
ALTER TABLE "projects" ALTER COLUMN "raw_name" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "projects_raw_name_key"
    ON "projects" ("raw_name");

-- Drop name column
ALTER TABLE "projects" DROP COLUMN "name";
