// testPrisma.js
import prisma from './src/config/prisma.js'; // adjust the path if needed
import logger from '../shared/utils/logger.js';

async function main() {
  try {
    // 1. Create a test user
    const newUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
        passwordAlgo: 'bcrypt',
        firstName: 'Shybash',
        lastName: 'Shaik',
        role: 'client_user', // use a valid role from your Role enum
      },
    });
    logger.info('Created user', { userId: newUser.id });

    // 2. Fetch all users
    const users = await prisma.user.findMany();
    logger.info('All users', { count: users.length });

    // 3. Fetch a single user by email
    const singleUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });
    logger.info('Single user', { userId: singleUser?.id });
  } catch (error) {
    logger.error('Prisma test error', {
      message: error.message,
      stack: error.stack,
    });
  } finally {
    await prisma.$disconnect();
  }
}

main();
