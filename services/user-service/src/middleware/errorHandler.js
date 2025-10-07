import { AppError } from '../domain/errors/AppError.js';
import logger from '../../../../shared/utils/logger.js';

// Centralized error handler for the service
// Converts domain AppError to proper HTTP responses; hides internals otherwise
export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    logger.warn('Handled AppError', {
      code: err.code,
      status: err.status,
      message: err.message,
    });
    return res
      .status(err.status)
      .json({ error: err.code, message: err.message });
  }
  logger.error('Unhandled error', { message: err.message, stack: err.stack });
  return res
    .status(500)
    .json({ error: 'INTERNAL_ERROR', message: 'Internal error' });
}
