import pkg from "@prisma/client";
import type { PrismaClient as PrismaClientType } from "@prisma/client";

const { PrismaClient } = pkg;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType;
};

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
