import { PrismaUserRepository } from '../adapters/repositories/PrismaUserRepository.js';
import { PrismaRefreshTokenRepository } from '../adapters/repositories/PrismaRefreshTokenRepository.js';
import { AuthService } from '../domain/services/AuthService.js';

// Compose controller dependencies (repositories + domain service)
const userRepository = new PrismaUserRepository();
const refreshTokenRepository = new PrismaRefreshTokenRepository();
const authService = new AuthService({ userRepository, refreshTokenRepository });

export const AuthController = {
  async login(req, res, next) {
    try {
      const result = await authService.loginWithPassword({
        email: req.body.email,
        password: req.body.password,
        userAgent: req.headers['user-agent'],
        ip: req.ip,
      });
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  },

  async refresh(req, res, next) {
    try {
      const result = await authService.refresh({
        refreshToken: req.body.refreshToken,
        userAgent: req.headers['user-agent'],
        ip: req.ip,
      });
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  },

  async logout(req, res, next) {
    try {
      const result = await authService.logout({
        refreshToken: req.body.refreshToken,
      });
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  },
};
