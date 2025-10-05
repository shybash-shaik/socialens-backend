// routes/auth.js
import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { AuthController } from '../controllers/AuthController.js';

const router = Router();

const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
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

export default router;
