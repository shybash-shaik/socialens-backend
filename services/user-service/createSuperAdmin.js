import prisma from './src/config/prisma.js';
import { hashPassword } from './src/utils/password.js';
import logger from '../../shared/utils/logger.js';

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL || 'superadmin@example.com';
  const password = process.env.SUPER_ADMIN_PASSWORD || 'Strong#Password1';
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      logger.info('Super admin already exists', { email, id: existing.id });
      return;
    }
    const { hash, algo } = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hash,
        passwordAlgo: algo,
        role: 'super_admin',
        emailVerified: true,
        status: 'active',
      },
    });
    logger.info('Created super admin', { id: user.id, email });
  } catch (err) {
    logger.error('Failed to create super admin', { error: err.message });
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
