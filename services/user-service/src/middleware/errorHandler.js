import { AppError } from '../domain/errors/AppError.js';

export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res
      .status(err.status)
      .json({ error: err.code, message: err.message });
  }
  return res
    .status(500)
    .json({ error: 'INTERNAL_ERROR', message: 'Internal error' });
}
