import prisma from './src/config/prisma.js';
import { verifyPassword } from './src/utils/password.js';
import logger from '../../shared/utils/logger.js';

async function main() {
  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: 'admin@example.com' },
    });

    if (!user) {
      logger.error('User not found');
      return;
    }

    logger.info('User found', {
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Test password verification
    const isValid = await verifyPassword(
      'password123',
      user.passwordHash,
      user.passwordAlgo
    );
    logger.info('Password verification', { isValid });
  } catch (error) {
    logger.error('Test error', {
      message: error.message,
      stack: error.stack,
    });
  } finally {
    await prisma.$disconnect();
  }
}

main();
