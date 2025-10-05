const { VerifyToken, ExtractTokenFromHeader } = require('../utils/TokenUtil');

/**
 * Middleware to authenticate requests using JWT
 */
const AuthenticateRequest = (Request, Response, Next) => {
  try {
    const Token = ExtractTokenFromHeader(Request.headers.authorization);

    if (!Token) {
      return Response.status(401).json({
        Success: false,
        Message: 'Access denied. No token provided.',
      });
    }

    const DecodedToken = VerifyToken(Token);
    Request.User = DecodedToken;
    Next();
  } catch (Err) {
    return Response.status(401).json({
      Success: false,
      Message: Err.message || 'Invalid token',
    });
  }
};

/**
 * Middleware to check if user is authenticated (optional authentication)
 */
const OptionalAuthentication = (Request, Response, Next) => {
  try {
    const Token = ExtractTokenFromHeader(Request.headers.authorization);

    if (Token) {
      const DecodedToken = VerifyToken(Token);
      Request.User = DecodedToken;
    }

    Next();
  } catch (Err) {
    // Continue without authentication
    Next();
  }
};

module.exports = {
  AuthenticateRequest,
  OptionalAuthentication,
};