/**
 * Crypto Helper
 * 
 * Provides encryption, decryption, and hashing utilities
 * Centralized crypto operations for the application
 * 
 * @module helpers/crypto.helper
 */

import CryptoJS from 'crypto-js';
import config from '../config';

/**
 * Encrypt data using AES encryption
 * @param {any} data - Data to encrypt
 * @returns {string} - Encrypted string
 */
export const encrypt = (data: any): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), config.ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (err) {
    throw err;
  }
};

/**
 * Decrypt data using AES decryption
 * @param {string} data - Encrypted string
 * @returns {any} - Decrypted data
 */
export const decrypt = (data: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(data, config.ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    throw error;
  }
};

/**
 * Hash a string using SHA-256
 * @param {string} text - Text to hash
 * @returns {string} - Hashed text (hex)
 */
export const hash = (text: string): string => {
  try {
    if (!text) {
      throw new Error('Text to hash cannot be empty');
    }

    const hashed = CryptoJS.SHA256(text + config.HASH_SALT).toString(CryptoJS.enc.Hex);
    return hashed;
  } catch (error) {
    console.error('Hashing error:', error);
    throw new Error('Failed to hash data');
  }
};

/**
 * Encrypt data (alias for backward compatibility)
 * @param {any} data - Data to encrypt
 * @returns {string} - Encrypted JSON string
 */
export const encryptData = encrypt;

/**
 * Decrypt data (alias for backward compatibility)
 * @param {string} encryptedData - Encrypted JSON string
 * @returns {any} - Decrypted data object
 */
export const decryptData = decrypt;

/**
 * Generate secure random token
 * @param {number} length - Token length
 * @returns {string} - Random token
 */
export const generateToken = (length: number = 32): string => {
  return CryptoJS.lib.WordArray.random(length / 2).toString(CryptoJS.enc.Hex);
};
