-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "CustomerStatus" AS ENUM ('NEW', 'ACTIVE', 'VIP', 'WARNING', 'BLOCKED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AlterTable
DO $$ BEGIN
    ALTER TABLE "Customer" ADD COLUMN "status" "CustomerStatus" NOT NULL DEFAULT 'NEW';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;
