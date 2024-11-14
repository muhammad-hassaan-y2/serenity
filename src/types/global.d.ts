// src/types/global.d.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // Extend globalThis with the prisma property
  /* eslint-disable-next-line no-var */
  var prisma: PrismaClient | undefined;
}

export {};