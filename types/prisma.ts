import { Prisma, PrismaClient } from '@prisma/client';

export type PrismaTransaction = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>;

export interface PrismaMiddlewareParams {
  model?: Prisma.ModelName;
  action: string;
  args: unknown;
  dataPath: string[];
  runInTransaction: boolean;
}

export type PrismaMiddlewareHandler = (params: PrismaMiddlewareParams) => Promise<unknown>;

export interface ErrorWithCode extends Error {
  code?: string;
  meta?: {
    target?: string[];
  };
}
