-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('NEW', 'ACTIVE', 'VIP', 'WARNING', 'BLOCKED');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "status" "CustomerStatus" NOT NULL DEFAULT 'NEW';
