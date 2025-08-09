import { PrismaClient } from '@prisma/client';
import { PrismaMiddlewareParams, PrismaMiddlewareHandler, ErrorWithCode } from '~/types/prisma';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  const client = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  // Adiciona interceptor para reconexão automática
  client.$use(async (params, next) => {
    try {
      return await next(params);
    } catch (error: unknown) {
      const err = error as ErrorWithCode;
      if (err?.message?.includes('Engine is not yet connected')) {
        console.log('Tentando reconectar...');
        await client.$connect();
        return next(params);
      }
      throw error;
    }
  });

  return client;
};

// Garante uma única instância do Prisma Client
export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

// Inicializa a conexão
prisma.$connect().catch((error) => {
  console.error('Erro ao conectar com o banco:', error);
});
