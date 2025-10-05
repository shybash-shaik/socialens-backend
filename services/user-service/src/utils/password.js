import argon2 from 'argon2';
import bcrypt from 'bcryptjs';

const PASSWORD_ALGO = process.env.PASSWORD_HASH_ALGO || 'argon2id';
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS || 12);

export async function hashPassword(plain) {
  if (PASSWORD_ALGO === 'bcrypt') {
    const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
    return { hash: await bcrypt.hash(plain, salt), algo: 'bcrypt' };
  }
  return {
    hash: await argon2.hash(plain, { type: argon2.argon2id }),
    algo: 'argon2id',
  };
}

export async function verifyPassword(plain, hash, algo = 'argon2id') {
  if (algo === 'bcrypt') return bcrypt.compare(plain, hash);
  return argon2.verify(hash, plain);
}
