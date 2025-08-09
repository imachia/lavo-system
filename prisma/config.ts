import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaConfig = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Configurações adicionais do cliente
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
  // Configurações de conexão
  connection: {
    maxWait: 5000, // 5 segundos máximo de espera
    timeout: 10000, // 10 segundos timeout
  },
};

export function createPrismaClient() {
  const client = new PrismaClient(prismaConfig);
  
  // Interceptor para reiniciar conexão em caso de erro
  client.$use(async (params, next) => {
    try {
      return await next(params);
    } catch (error: any) {
      if (error?.message?.includes('Engine is not yet connected')) {
        await client.$connect();
        return next(params);
      }
      throw error;
    }
  });

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
