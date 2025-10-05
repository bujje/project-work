const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generates a JWT token for a user
 * @param {Object} UserPayload - User data to include in token
 * @returns {string} JWT token
 */
const GenerateToken = (UserPayload) => {
  const Payload = {
    UserId: UserPayload.UserId,
    Username: UserPayload.Username,
    Email: UserPayload.Email,
    Department: UserPayload.Department,
  };

  return jwt.sign(Payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verifies and decodes a JWT token
 * @param {string} Token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const VerifyToken = (Token) => {
  try {
    return jwt.verify(Token, JWT_SECRET);
  } catch (Err) {
    if (Err.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (Err.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

/**
 * Extracts token from Authorization header
 * @param {string} AuthorizationHeader - Authorization header value
 * @returns {string|null} Extracted token or null
 */
const ExtractTokenFromHeader = (AuthorizationHeader) => {
  if (!AuthorizationHeader) {
    return null;
  }

  const Parts = AuthorizationHeader.split(' ');
  if (Parts.length === 2 && Parts[0] === 'Bearer') {
    return Parts[1];
  }

  return null;
};

module.exports = {
  GenerateToken,
  VerifyToken,
  ExtractTokenFromHeader,
};