-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('NEW', 'ACTIVE', 'VIP', 'WARNING', 'BLOCKED');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "status" "CustomerStatus" NOT NULL DEFAULT 'NEW';
