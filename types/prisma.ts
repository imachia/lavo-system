import { Prisma, PrismaClient } from '@prisma/client';

export type PrismaTransaction = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>;

export interface PrismaMiddlewareParams {
  model?: string;
  action: Prisma.PrismaAction;
  args: unknown;
  dataPath: string[];
  runInTransaction: boolean;
}

export type PrismaMiddlewareHandler = (
  params: PrismaMiddlewareParams,
  next: (params: PrismaMiddlewareParams) => Promise<unknown>
) => Promise<unknown>;

export interface ErrorWithCode extends Error {
  code?: string;
  meta?: {
    target?: string[];
  };
}
