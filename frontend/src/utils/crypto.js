/**
 * Crypto Utility
 * 
 * Handles encryption and decryption of data on the frontend
 * Uses CryptoJS library for AES encryption
 */

import CryptoJS from 'crypto-js';

// Must match the backend encryption key
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'whatsapp-chat-analyzer-secret-key-2026';

/**
 * Decrypt data received from backend
 * @param {string} encryptedData - Encrypted string from backend
 * @returns {any} - Decrypted data object
 */
export const decrypt = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Encrypt data to send to backend (if needed)
 * @param {any} data - Data to encrypt
 * @returns {string} - Encrypted string
 */
export const encrypt = (data) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};
