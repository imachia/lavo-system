-- Drop existing enum if exists
DROP TYPE IF EXISTS "CustomerStatus" CASCADE;

-- Recreate enum
CREATE TYPE "CustomerStatus" AS ENUM ('NEW', 'ACTIVE', 'VIP', 'WARNING', 'BLOCKED');

-- Drop status column if exists
ALTER TABLE "Customer" DROP COLUMN IF EXISTS "status";

-- Add status column
ALTER TABLE "Customer" ADD COLUMN "status" "CustomerStatus" NOT NULL DEFAULT 'NEW';

-- Verify enum exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'customerstatus'
    ) THEN
        RAISE EXCEPTION 'CustomerStatus enum not created properly';
    END IF;
END
$$;
