import { PrismaClient } from '@prisma/client';

// PrismaClient singleton for serverless/hot-reload environments
// Ensures only one instance across module reloads to avoid connection leaks
const globalForPrisma = global;

if (!globalForPrisma.__prisma) {
  globalForPrisma.__prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

const prisma = globalForPrisma.__prisma;

export default prisma;
