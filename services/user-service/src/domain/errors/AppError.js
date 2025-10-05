export class AppError extends Error {
  constructor(message, status = 400, code = 'BAD_REQUEST', cause) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    if (cause) this.cause = cause;
  }
}

export const UnauthorizedError = (message = 'Unauthorized') =>
  new AppError(message, 401, 'UNAUTHORIZED');

export const ForbiddenError = (message = 'Forbidden') =>
  new AppError(message, 403, 'FORBIDDEN');

export const NotFoundError = (message = 'Not Found') =>
  new AppError(message, 404, 'NOT_FOUND');

export const ConflictError = (message = 'Conflict') =>
  new AppError(message, 409, 'CONFLICT');

export const ValidationError = (message = 'Validation Error') =>
  new AppError(message, 422, 'VALIDATION_ERROR');
