const {
  EncryptMonetaryValue,
  DecryptMonetaryValue,
  ValidateAndEncryptAmount,
  DecryptAndParseAmount,
} = require('../src/utils/EncryptionUtil');

describe('EncryptionUtil Tests', () => {
  describe('EncryptMonetaryValue and DecryptMonetaryValue', () => {
    test('Should encrypt and decrypt a monetary value correctly', () => {
      const OriginalValue = '1234.56';
      const Encrypted = EncryptMonetaryValue(OriginalValue);
      const Decrypted = DecryptMonetaryValue(Encrypted);

      expect(Decrypted).toBe(OriginalValue);
    });

    test('Should produce different encrypted values for the same input', () => {
      const OriginalValue = '1000.00';
      const Encrypted1 = EncryptMonetaryValue(OriginalValue);
      const Encrypted2 = EncryptMonetaryValue(OriginalValue);

      // Due to random IV, encrypted values should be different
      expect(Encrypted1).not.toBe(Encrypted2);

      // But both should decrypt to the same value
      expect(DecryptMonetaryValue(Encrypted1)).toBe(OriginalValue);
      expect(DecryptMonetaryValue(Encrypted2)).toBe(OriginalValue);
    });

    test('Should handle numeric input', () => {
      const OriginalValue = 5000;
      const Encrypted = EncryptMonetaryValue(OriginalValue);
      const Decrypted = DecryptMonetaryValue(Encrypted);

      expect(Decrypted).toBe(String(OriginalValue));
    });

    test('Should throw error for invalid encrypted format', () => {
      expect(() => {
        DecryptMonetaryValue('invalid-format');
      }).toThrow();
    });
  });

  describe('ValidateAndEncryptAmount', () => {
    test('Should validate and encrypt a valid amount', () => {
      const Amount = '250.75';
      const Encrypted = ValidateAndEncryptAmount(Amount);

      expect(Encrypted).toBeTruthy();
      expect(typeof Encrypted).toBe('string');
      expect(Encrypted).toContain(':');
    });

    test('Should round amount to 2 decimal places', () => {
      const Amount = '100.999';
      const Encrypted = ValidateAndEncryptAmount(Amount);
      const Decrypted = DecryptMonetaryValue(Encrypted);

      expect(Decrypted).toBe('101');
    });

    test('Should throw error for negative amount', () => {
      expect(() => {
        ValidateAndEncryptAmount('-100');
      }).toThrow('Amount cannot be negative');
    });

    test('Should throw error for non-numeric amount', () => {
      expect(() => {
        ValidateAndEncryptAmount('not-a-number');
      }).toThrow('Amount must be a valid number');
    });

    test('Should handle zero amount', () => {
      const Amount = '0';
      const Encrypted = ValidateAndEncryptAmount(Amount);
      const Decrypted = DecryptMonetaryValue(Encrypted);

      expect(Decrypted).toBe('0');
    });
  });

  describe('DecryptAndParseAmount', () => {
    test('Should decrypt and parse amount to number', () => {
      const OriginalAmount = 1500.50;
      const Encrypted = ValidateAndEncryptAmount(OriginalAmount);
      const Parsed = DecryptAndParseAmount(Encrypted);

      expect(Parsed).toBe(OriginalAmount);
      expect(typeof Parsed).toBe('number');
    });

    test('Should handle integer amounts', () => {
      const OriginalAmount = 1000;
      const Encrypted = ValidateAndEncryptAmount(OriginalAmount);
      const Parsed = DecryptAndParseAmount(Encrypted);

      expect(Parsed).toBe(OriginalAmount);
    });
  });
});