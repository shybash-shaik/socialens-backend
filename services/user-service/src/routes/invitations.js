import express from 'express';
import prisma from '../config/prisma.js';
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

// Get invitation details (public)
router.get('/:token', async (req, res, next) => {
  try {
    const { token } = req.params;
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      select: {
        email: true,
        role: true,
        authType: true,
        expiresAt: true,
        acceptedAt: true,
        status: true,
      },
    });

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    if (invitation.expiresAt.getTime() < Date.now()) {
      return res.status(410).json({ error: 'Invitation expired' });
    }

    if (invitation.acceptedAt) {
      return res.status(409).json({ error: 'Invitation already accepted' });
    }

    return res.json(invitation);
  } catch (err) {
    return next(err);
  }
});

// Accept invitation (public)
router.post('/accept', async (req, res, next) => {
  try {
    const { token, password, firstName, lastName } = req.body;
    const result = await InvitationService.acceptInvitation({
      token,
      password,
      firstName,
      lastName,
    });
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
});

export default router;
