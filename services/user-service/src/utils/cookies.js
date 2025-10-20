// utils/cookies.js
export function setAuthCookies(res, accessToken, refreshToken) {
  // Set HTTP-only cookies (prevents XSS attacks)
  res.cookie('accessToken', accessToken, {
    httpOnly: false, // Can't be accessed by JavaScript for development
    secure: false, // Allow HTTP in development
    sameSite: 'lax', // Allow cross-site in development
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: '/',
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: false, // Can't be accessed by JavaScript for development
    secure: false, // Allow HTTP in development
    sameSite: 'lax', // Allow cross-site in development
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

export function clearAuthCookies(res) {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
}

export function getTokenFromCookie(req) {
  return (
    req.cookies.accessToken || req.headers.authorization?.replace('Bearer ', '')
  );
}
