import { PrismaUserRepository } from '../adapters/repositories/PrismaUserRepository.js';
import { PrismaRefreshTokenRepository } from '../adapters/repositories/PrismaRefreshTokenRepository.js';
import { AuthService } from '../domain/services/AuthService.js';
import { setAuthCookies } from '../utils/cookies.js';

// Compose controller dependencies (repositories + domain service)
const userRepository = new PrismaUserRepository();
const refreshTokenRepository = new PrismaRefreshTokenRepository();
const authService = new AuthService({ userRepository, refreshTokenRepository });

export const AuthController = {
  async login(req, res, next) {
    try {
      const { email, password, otp } = req.body;

      // Check if user has TOTP enabled
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // If TOTP is enabled and no OTP provided, return OTP_REQUIRED
      if (user.totpEnabled && !otp) {
        return res.status(401).json({ message: 'OTP_REQUIRED' });
      }

      const result = await authService.loginWithPassword({
        email,
        password,
        otp,
        userAgent: req.headers['user-agent'],
        ip: req.ip,
      });

      // Set cookies for development (http)
      setAuthCookies(
        res,
        result.tokens.accessToken,
        result.tokens.refreshToken
      );

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

  async getUserDetails(req, res, next) {
    try {
      const user = await userRepository.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Return relevant user information, excluding sensitive data
      return res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        totpEnabled: user.totpEnabled,
      });
    } catch (err) {
      return next(err);
    }
  },
};
