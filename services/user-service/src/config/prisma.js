import { PrismaClient } from '@prisma/client';

if (!global.__prisma) {
  global.__prisma = new PrismaClient();
}

const prisma = global.__prisma;

export default prisma;
