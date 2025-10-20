import { verifyAccessToken } from '../utils/jwt.js';

export function authenticate(req, res, next) {
  try {
    let token;

    // First, try to get token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    } else {
      // If no header, try to get from cookies
      token = req.cookies?.accessToken;
    }

    if (!token) {
      return res.status(401).json({ error: 'UNAUTHORIZED' });
    }

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
