import { prisma } from '@/lib/db';

async function main() {
  try {
    // 1. Verificar se o enum existe
    const enumExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'customerstatus'
      );
    `;
    console.log('Enum exists:', enumExists);

    // 2. Recriar o enum se necessário
    if (!enumExists) {
      await prisma.$executeRaw`
        CREATE TYPE "CustomerStatus" AS ENUM ('NEW', 'ACTIVE', 'VIP', 'WARNING', 'BLOCKED')
      `;
    }

    // 3. Atualizar a coluna status
    await prisma.$executeRaw`
      ALTER TABLE "Customer" 
      ALTER COLUMN status SET DEFAULT 'NEW'::"CustomerStatus",
      ALTER COLUMN status SET NOT NULL
    `;

    console.log('Database updated successfully');
  } catch (error) {
    console.error('Error updating database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
