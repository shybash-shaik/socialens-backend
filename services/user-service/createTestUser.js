import prisma from './src/config/prisma.js';
import { hashPassword } from './src/utils/password.js';
import logger from '../../shared/utils/logger.js';

async function main() {
  try {
    const { hash, algo } = await hashPassword('password123');

    const newUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        passwordHash: hash,
        passwordAlgo: algo,
        firstName: 'Admin',
        lastName: 'User',
        role: 'client_admin',
        tenantId: 'test-tenant',
      },
    });
    logger.info('Created admin user', {
      userId: newUser.id,
      email: newUser.email,
    });
  } catch (error) {
    logger.error('Error creating test user', {
      message: error.message,
      stack: error.stack,
    });
  } finally {
    await prisma.$disconnect();
  }
}

main();
