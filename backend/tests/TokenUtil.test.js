const {
  GenerateToken,
  VerifyToken,
  ExtractTokenFromHeader,
} = require('../src/utils/TokenUtil');

describe('TokenUtil Tests', () => {
  const MockUser = {
    UserId: 1,
    Username: 'testuser',
    Email: 'test@example.com',
    Department: 'IT',
  };

  describe('GenerateToken', () => {
    test('Should generate a valid JWT token', () => {
      const Token = GenerateToken(MockUser);

      expect(Token).toBeTruthy();
      expect(typeof Token).toBe('string');
      expect(Token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    test('Should include user data in token payload', () => {
      const Token = GenerateToken(MockUser);
      const Decoded = VerifyToken(Token);

      expect(Decoded.UserId).toBe(MockUser.UserId);
      expect(Decoded.Username).toBe(MockUser.Username);
      expect(Decoded.Email).toBe(MockUser.Email);
      expect(Decoded.Department).toBe(MockUser.Department);
    });
  });

  describe('VerifyToken', () => {
    test('Should verify and decode a valid token', () => {
      const Token = GenerateToken(MockUser);
      const Decoded = VerifyToken(Token);

      expect(Decoded).toBeTruthy();
      expect(Decoded.UserId).toBe(MockUser.UserId);
    });

    test('Should throw error for invalid token', () => {
      expect(() => {
        VerifyToken('invalid.token.here');
      }).toThrow();
    });

    test('Should throw error for malformed token', () => {
      expect(() => {
        VerifyToken('not-a-token');
      }).toThrow();
    });
  });

  describe('ExtractTokenFromHeader', () => {
    test('Should extract token from valid Bearer header', () => {
      const Token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
      const Header = `Bearer ${Token}`;
      const Extracted = ExtractTokenFromHeader(Header);

      expect(Extracted).toBe(Token);
    });

    test('Should return null for missing header', () => {
      const Extracted = ExtractTokenFromHeader(null);
      expect(Extracted).toBeNull();
    });

    test('Should return null for invalid header format', () => {
      const Extracted = ExtractTokenFromHeader('InvalidFormat token');
      expect(Extracted).toBeNull();
    });

    test('Should return null for header without Bearer prefix', () => {
      const Extracted = ExtractTokenFromHeader('token-without-bearer');
      expect(Extracted).toBeNull();
    });
  });
});