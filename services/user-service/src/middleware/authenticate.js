import { verifyAccessToken } from '../utils/jwt.js';

export function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'UNAUTHORIZED' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyAccessToken(token);

    // Set user info on request object
    req.user = {
      id: decoded.sub,
      role: decoded.role,
      tenantId: decoded.tenantId,
    };

    next();
  } catch {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }
}
