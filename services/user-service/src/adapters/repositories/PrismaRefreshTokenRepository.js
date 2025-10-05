import prisma from '../../config/prisma.js';
import { RefreshTokenRepository } from '../../domain/repositories/RefreshTokenRpository.js';

export class PrismaRefreshTokenRepository extends RefreshTokenRepository {
  async create(data) {
    return prisma.refreshToken.create({ data });
  }

  async findValidByHash(tokenHash) {
    return prisma.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
    });
  }

  async revokeById(id) {
    return prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId) {
    return prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
