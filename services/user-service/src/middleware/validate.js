// middleware/validate.js

export const validate = schema => (req, res, next) => {
  // Parse the body safely
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(422).json({
      error: 'VALIDATION_ERROR',
      message: 'Invalid request',
      details: result.error.issues.map(e => e.message),
    });
  }

  req.body = result.data;
  next();
};
