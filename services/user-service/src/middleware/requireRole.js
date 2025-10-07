// Role hierarchy helpers
const PLATFORM_ORDER = ['super_admin', 'site_admin', 'operator'];
const CLIENT_ORDER = ['client_admin', 'client_user'];

function isPlatform(role) {
  return PLATFORM_ORDER.includes(role);
}

function isClient(role) {
  return CLIENT_ORDER.includes(role);
}

export function requireRole(requiredRole) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'UNAUTHORIZED' });
    const role = user.role;

    if (isPlatform(requiredRole)) {
      if (!isPlatform(role))
        return res.status(403).json({ error: 'FORBIDDEN' });
      if (PLATFORM_ORDER.indexOf(role) > PLATFORM_ORDER.indexOf(requiredRole)) {
        return res.status(403).json({ error: 'FORBIDDEN' });
      }
      return next();
    }

    if (isClient(requiredRole)) {
      if (!isClient(role)) return res.status(403).json({ error: 'FORBIDDEN' });
      if (CLIENT_ORDER.indexOf(role) > CLIENT_ORDER.indexOf(requiredRole)) {
        return res.status(403).json({ error: 'FORBIDDEN' });
      }
      return next();
    }

    return res.status(403).json({ error: 'FORBIDDEN' });
  };
}

export function requireAny(allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'UNAUTHORIZED' });
    if (allowedRoles.includes(user.role)) return next();
    return res.status(403).json({ error: 'FORBIDDEN' });
  };
}
