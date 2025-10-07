import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/requireRole.js';
import { validate } from '../middleware/validate.js';
import prisma from '../config/prisma.js';
import { hashPassword } from '../utils/password.js';

const router = Router();

const createAdminSchema = z
  .object({
    email: z.string().email(),
    role: z.enum(['site_admin', 'operator']),
    password: z.string().min(8),
  })
  .strict();

// super_admin can create site_admin and operator
router.post(
  '/users',
  authenticate,
  requireRole('super_admin'),
  validate(createAdminSchema),
  async (req, res, next) => {
    try {
      const { email, role, password } = req.body;
      const exists = await prisma.user.findUnique({ where: { email } });
      if (exists) return res.status(409).json({ error: 'EMAIL_EXISTS' });
      const { hash, algo } = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash: hash,
          passwordAlgo: algo,
          role,
          emailVerified: true,
          status: 'active',
        },
      });
      return res.status(201).json({ id: user.id });
    } catch (err) {
      return next(err);
    }
  }
);

export default router;
