const { validationResult } = require('express-validator');

/**
 * Middleware to validate request data using express-validator
 */
const ValidateRequest = (Request, Response, Next) => {
  const Errors = validationResult(Request);

  if (!Errors.isEmpty()) {
    return Response.status(400).json({
      Success: false,
      Message: 'Validation failed',
      Errors: Errors.array().map(Error => ({
        Field: Error.path || Error.param,
        Message: Error.msg,
      })),
    });
  }

  Next();
};

/**
 * Sanitizes string input to prevent XSS attacks
 */
const SanitizeInput = (Input) => {
  if (typeof Input !== 'string') {
    return Input;
  }

  return Input
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
};

/**
 * Middleware to sanitize request body
 */
const SanitizeRequestBody = (Request, Response, Next) => {
  if (Request.body && typeof Request.body === 'object') {
    Object.keys(Request.body).forEach(Key => {
      if (typeof Request.body[Key] === 'string') {
        Request.body[Key] = SanitizeInput(Request.body[Key]);
      }
    });
  }

  Next();
};

module.exports = {
  ValidateRequest,
  SanitizeInput,
  SanitizeRequestBody,
};