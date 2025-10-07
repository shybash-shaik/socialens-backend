// routes/auth.js
import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { AuthController } from '../controllers/AuthController.js';
import speakeasy from 'speakeasy';
import { authenticate } from '../middleware/authenticate.js';
import prisma from '../config/prisma.js';

const router = Router();

const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    otp: z.string().optional(),
  })
  .strict();

const refreshSchema = z
  .object({
    refreshToken: z.string().min(1),
  })
  .strict();

router.post('/login', validate(loginSchema), AuthController.login);
router.post('/refresh', validate(refreshSchema), AuthController.refresh);
router.post('/logout', validate(refreshSchema), AuthController.logout);

// TOTP: generate/setup secret for current user (must be authenticated)
router.post('/totp/setup', authenticate, async (req, res, next) => {
  try {
    const secret = speakeasy.generateSecret({ length: 20, name: 'SociaLens' });
    await prisma.user.update({
      where: { id: req.user.id },
      data: { totpSecret: secret.base32, totpEnabled: false },
    });
    return res.json({
      otpauthUrl: secret.otpauth_url,
      base32: secret.base32,
    });
  } catch (err) {
    return next(err);
  }
});

// TOTP: verify code and enable
const totpVerifySchema = z.object({ otp: z.string().min(6).max(6) }).strict();

router.post(
  '/totp/verify',
  authenticate,
  validate(totpVerifySchema),
  async (req, res, next) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (!user || !user.totpSecret)
        return res.status(400).json({ error: 'TOTP_NOT_INITIALIZED' });

      const ok = speakeasy.totp.verify({
        secret: user.totpSecret,
        encoding: 'base32',
        token: req.body.otp,
        window: 1,
      });
      if (!ok) return res.status(422).json({ error: 'INVALID_OTP' });

      await prisma.user.update({
        where: { id: user.id },
        data: { totpEnabled: true },
      });
      return res.json({ ok: true });
    } catch (err) {
      return next(err);
    }
  }
);

export default router;
