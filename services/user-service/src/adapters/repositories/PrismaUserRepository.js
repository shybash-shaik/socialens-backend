import prisma from '../../config/prisma.js';
import { UserRepository } from '../../domain/repositories/UserRepository.js';

export class PrismaUserRepository extends UserRepository {
  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data) {
    return prisma.user.create({ data });
  }

  async updateById(id, updateData) {
    return prisma.user.update({ where: { id }, data: updateData });
  }
}
