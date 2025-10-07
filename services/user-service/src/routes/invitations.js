import express from 'express';
import { InvitationService } from '../services/InvitationService.js';
import { requireAny } from '../middleware/requireRole.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Create invitation
// SUPER_ADMIN -> CLIENT_ADMIN, CLIENT_ADMIN -> CLIENT_USER
router.post(
  '/',
  authenticate,
  requireAny(['super_admin', 'client_admin']),
  async (req, res, next) => {
    try {
      const inviterRole = req.user.role;
      const { email, role, tenantId, authType } = req.body;

      if (inviterRole === 'super_admin') {
        if (role !== 'client_admin') {
          return res.status(400).json({ error: 'INVALID_ROLE_TARGET' });
        }
      } else if (inviterRole === 'client_admin') {
        if (role !== 'client_user') {
          return res.status(400).json({ error: 'INVALID_ROLE_TARGET' });
        }
      } else {
        return res.status(403).json({ error: 'FORBIDDEN' });
      }

      const result = await InvitationService.createInvitation({
        email,
        role,
        tenantId,
        authType,
        invitedByUserId: req.user.id,
        issueTempPassword: authType !== 'totp',
      });

      return res.status(201).json(result);
    } catch (err) {
      return next(err);
    }
  }
);

// Accept invitation (public)
router.post('/accept', async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const result = await InvitationService.acceptInvitation({
      token,
      password,
    });
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
});

export default router;
