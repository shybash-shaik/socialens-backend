import { verifyPassword } from '../../utils/password.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../utils/jwt.js';
import { sha256 } from '../../utils/token.js';
import { UnauthorizedError, NotFoundError } from '../errors/AppError.js';

// Orchestrates user authentication and refresh token lifecycle
export class AuthService {
  constructor({ userRepository, refreshTokenRepository }) {
    // Data access adapters are injected to keep domain logic decoupled from persistence
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
  }

  async loginWithPassword({ email, password, userAgent, ip }) {
    // Authenticate user by email and password
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw UnauthorizedError('Invalid credentials');

    // Verify password hash and algorithm
    const ok = await verifyPassword(
      password,
      user.password_hash,
      user.password_algo
    );
    if (!ok) throw UnauthorizedError('Invalid credentials');

    // Generate JWT access and refresh tokens
    // Note: TOTP (2FA) can be added later by gating access token issuance
    const accessToken = signAccessToken({
      sub: user.id,
      role: user.role,
      tenantId: user.tenant_id,
    });
    const refreshToken = signRefreshToken({ sub: user.id });

    // Persist refresh token hash (not the token itself) for rotation and revocation
    await this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash: sha256(refreshToken),
      userAgent: userAgent || null,
      ip: ip || null,
      expiresAt: new Date(
        Date.now() + this._ttlMs(process.env.JWT_REFRESH_EXPIRES_IN || '7d')
      ),
    });

    // Return user info and tokens
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenant_id,
      },
      tokens: { accessToken, refreshToken },
    };
  }

  async refresh({ refreshToken, userAgent, ip }) {
    // Verify and decode refresh token
    const decoded = verifyRefreshToken(refreshToken);
    const tokenHash = sha256(refreshToken);

    // Find valid stored refresh token by hash
    const stored = await this.refreshTokenRepository.findValidByHash(tokenHash);
    if (!stored || stored.userId !== decoded.sub)
      throw UnauthorizedError('Invalid refresh token');

    // Revoke old refresh token (rotate)
    await this.refreshTokenRepository.revokeById(stored.id);

    // Find user by ID from decoded token
    const user = await this.userRepository.findById(decoded.sub);
    if (!user) throw NotFoundError('User not found');

    // Generate new access and refresh tokens
    const accessToken = signAccessToken({
      sub: user.id,
      role: user.role,
      tenantId: user.tenant_id,
    });
    const newRefreshToken = signRefreshToken({ sub: user.id });

    // Store new refresh token hash with metadata
    await this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash: sha256(newRefreshToken),
      userAgent: userAgent || null,
      ip: ip || null,
      expiresAt: new Date(
        Date.now() + this._ttlMs(process.env.JWT_REFRESH_EXPIRES_IN || '7d')
      ),
    });

    // Return new tokens
    return { tokens: { accessToken, refreshToken: newRefreshToken } };
  }

  async logout({ refreshToken }) {
    // Revoke refresh token on logout (idempotent)
    const tokenHash = sha256(refreshToken);
    const stored = await this.refreshTokenRepository.findValidByHash(tokenHash);
    if (stored) await this.refreshTokenRepository.revokeById(stored.id);
    return { ok: true };
  }

  _ttlMs(ttlString) {
    // Parse TTL string like "7d" or "15m" into milliseconds; defaults to 7d
    const match = /^(\d+)([smhd])$/.exec(ttlString);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7 days
    const v = Number(match[1]);
    const u = match[2];
    const mult = { s: 1000, m: 60000, h: 3600000, d: 86400000 }[u];
    return v * mult;
  }
}
