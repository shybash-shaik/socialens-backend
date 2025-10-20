import { randomUUID } from 'crypto';
import prisma from '../config/prisma.js';
import { hashPassword } from '../utils/password.js';
import { publishEvent } from '../queues/emailQueue.js';
import speakeasy from 'speakeasy';

const DEFAULT_INVITE_TTL_HOURS = Number(process.env.INVITE_TTL_HOURS || 48);

export class InvitationService {
  static async createInvitation({
    email,
    role,
    tenantId,
    authType, // 'totp' | 'otp'
    invitedByUserId,
    issueTempPassword = true,
  }) {
    const token = randomUUID();
    const expiresAt = new Date(
      Date.now() + DEFAULT_INVITE_TTL_HOURS * 60 * 60 * 1000
    );

    let tempPasswordHash = null;
    let tempPasswordPlain = null;
    if (issueTempPassword && authType !== 'totp') {
      tempPasswordPlain = randomUUID().slice(0, 10);
      const { hash } = await hashPassword(tempPasswordPlain);
      tempPasswordHash = hash;
    }

    const invitation = await prisma.invitation.create({
      data: {
        email,
        token,
        role,
        tenantId: tenantId || null,
        invitedBy: invitedByUserId,
        temporaryPasswordHash: tempPasswordHash,
        authType,
        expiresAt,
      },
    });

    // Publish invitation created event for Notification Service (non-blocking)
    try {
      await publishEvent('invitation.created', {
        email,
        token,
        tempPassword: tempPasswordPlain,
        authType,
        invitationId: invitation.id,
      });
    } catch (error) {
      console.error('Failed to publish invitation event:', error);
      // Don't fail the invitation creation if event publishing fails
    }

    return { id: invitation.id, token, expiresAt };
  }

  static async acceptInvitation({ token, password, firstName, lastName }) {
    return await prisma.$transaction(async tx => {
      const invite = await tx.invitation.findUnique({ where: { token } });
      if (!invite) throw new Error('Invitation not found');
      if (invite.acceptedAt) throw new Error('Invitation already accepted');
      if (invite.expiresAt.getTime() < Date.now())
        throw new Error('Invitation expired');

      let passwordHash;
      let passwordAlgo;
      if (invite.authType === 'totp') {
        if (!password) throw new Error('Password required');
        const hp = await hashPassword(password);
        passwordHash = hp.hash;
        passwordAlgo = hp.algo;
      } else {
        if (!password && !invite.temporaryPasswordHash)
          throw new Error('Password required');
        if (password) {
          const hp = await hashPassword(password);
          passwordHash = hp.hash;
          passwordAlgo = hp.algo;
        } else {
          // Note: user will be required to change password on first login (future enhancement)
          passwordHash = invite.temporaryPasswordHash;
          passwordAlgo = process.env.PASSWORD_HASH_ALGO || 'argon2id';
        }
      }

      const user = await tx.user.create({
        data: {
          email: invite.email,
          firstName,
          lastName,
          passwordHash,
          passwordAlgo,
          role: invite.role,
          tenantId: invite.tenantId,
          invitedBy: invite.invitedBy,
          status: 'active',
          emailVerified: true,
          totpEnabled: invite.authType === 'totp',
          totpSecret:
            invite.authType === 'totp'
              ? speakeasy.generateSecret().base32
              : null,
        },
      });

      await tx.invitation.update({
        where: { token },
        data: { acceptedAt: new Date(), status: 'accepted' },
      });

      return { userId: user.id };
    });
  }
}
