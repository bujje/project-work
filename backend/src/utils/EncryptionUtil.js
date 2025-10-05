const crypto = require('crypto');
require('dotenv').config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '11111111111111111111111111111111';
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

// Ensure the key is exactly 32 bytes for AES-256
const GetEncryptionKey = () => {
  const Key = Buffer.from(ENCRYPTION_KEY);
  if (Key.length !== 32) {
    throw new Error('Encryption key must be exactly 32 characters for AES-256');
  }
  return Key;
};

/**
 * Encrypts a monetary value using AES-256-CBC
 * @param {string|number} PlainText - The value to encrypt
 * @returns {string} Encrypted value in format: iv:encryptedData
 */
const EncryptMonetaryValue = (PlainText) => {
  try {
    const TextToEncrypt = String(PlainText);
    const InitializationVector = crypto.randomBytes(IV_LENGTH);
    const Cipher = crypto.createCipheriv(ALGORITHM, GetEncryptionKey(), InitializationVector);
    
    let Encrypted = Cipher.update(TextToEncrypt, 'utf8', 'hex');
    Encrypted += Cipher.final('hex');
    
    // Return IV and encrypted data separated by colon
    return InitializationVector.toString('hex') + ':' + Encrypted;
  } catch (Err) {
    console.error('Encryption error:', Err);
    throw new Error('Failed to encrypt monetary value');
  }
};

/**
 * Decrypts a monetary value encrypted with AES-256-CBC
 * @param {string} EncryptedText - The encrypted value in format: iv:encryptedData
 * @returns {string} Decrypted value
 */
const DecryptMonetaryValue = (EncryptedText) => {
  try {
    const Parts = EncryptedText.split(':');
    if (Parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    
    const InitializationVector = Buffer.from(Parts[0], 'hex');
    const EncryptedData = Parts[1];
    
    const Decipher = crypto.createDecipheriv(ALGORITHM, GetEncryptionKey(), InitializationVector);
    
    let Decrypted = Decipher.update(EncryptedData, 'hex', 'utf8');
    Decrypted += Decipher.final('utf8');
    
    return Decrypted;
  } catch (Err) {
    console.error('Decryption error:', Err);
    throw new Error('Failed to decrypt monetary value');
  }
};

/**
 * Validates and encrypts a monetary amount
 * @param {string|number} Amount - The amount to validate and encrypt
 * @returns {string} Encrypted amount
 */
const ValidateAndEncryptAmount = (Amount) => {
  console.log('Validating and encrypting amount:', Amount);
  const NumericAmount = parseFloat(Amount);
  
  if (isNaN(NumericAmount)) {
    throw new Error('Amount must be a valid number');
  }
  
  if (NumericAmount < 0) {
    throw new Error('Amount cannot be negative');
  }
  
  // Round to 2 decimal places for monetary values
  const RoundedAmount = Math.round(NumericAmount * 100) / 100;
  console.log('Rounded amount:', RoundedAmount);
  
  const Encrypted = EncryptMonetaryValue(RoundedAmount.toString());
  console.log('Encrypted result:', Encrypted);
  return Encrypted;
};

/**
 * Decrypts and parses a monetary amount
 * @param {string} EncryptedAmount - The encrypted amount
 * @returns {number} Decrypted amount as a number
 */
const DecryptAndParseAmount = (EncryptedAmount) => {
  const DecryptedValue = DecryptMonetaryValue(EncryptedAmount);
  return parseFloat(DecryptedValue);
};

module.exports = {
  EncryptMonetaryValue,
  DecryptMonetaryValue,
  ValidateAndEncryptAmount,
  DecryptAndParseAmount,
};