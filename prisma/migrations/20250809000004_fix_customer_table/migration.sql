-- Primeiro, vamos dropar e recriar o enum corretamente
DO $$ BEGIN
  DROP TYPE IF EXISTS "CustomerStatus";
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

CREATE TYPE "CustomerStatus" AS ENUM ('NEW', 'ACTIVE', 'VIP', 'WARNING', 'BLOCKED');

-- Agora, vamos garantir que a tabela Customer tenha todos os campos necessários
ALTER TABLE IF EXISTS "Customer" 
  ALTER COLUMN "storeId" SET NOT NULL,
  ALTER COLUMN "name" SET NOT NULL,
  ALTER COLUMN "email" DROP NOT NULL,
  ALTER COLUMN "phone" DROP NOT NULL,
  ALTER COLUMN "imageUrl" SET NOT NULL;

-- Adicionar ou atualizar a coluna status
DO $$ BEGIN
  ALTER TABLE "Customer" ADD COLUMN "status" "CustomerStatus" NOT NULL DEFAULT 'NEW';
EXCEPTION
  WHEN duplicate_column THEN 
    ALTER TABLE "Customer" ALTER COLUMN "status" TYPE "CustomerStatus" USING "status"::text::"CustomerStatus",
                          ALTER COLUMN "status" SET NOT NULL,
                          ALTER COLUMN "status" SET DEFAULT 'NEW';
END $$;

-- Garantir que as colunas de data estão corretas
DO $$ BEGIN
  ALTER TABLE "Customer" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "Customer" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;
