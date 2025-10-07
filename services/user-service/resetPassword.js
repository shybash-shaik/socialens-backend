import prisma from './src/config/prisma.js';
import { hashPassword } from './src/utils/password.js';
import logger from '../../shared/utils/logger.js';

async function main() {
  const email = process.env.RESET_EMAIL;
  const newPassword = process.env.RESET_PASSWORD;
  if (!email || !newPassword) {
    logger.error('Provide RESET_EMAIL and RESET_PASSWORD env vars');
    process.exit(1);
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      logger.error('User not found', { email });
      process.exit(1);
    }
    const { hash, algo } = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hash, passwordAlgo: algo },
    });
    logger.info('Password reset ok', { email });
  } catch (err) {
    logger.error('Failed to reset password', { error: err.message });
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
