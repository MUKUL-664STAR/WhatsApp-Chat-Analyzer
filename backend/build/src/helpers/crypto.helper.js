"use strict";
/**
 * Crypto Helper
 *
 * Provides encryption, decryption, and hashing utilities
 * Centralized crypto operations for the application
 *
 * @module helpers/crypto.helper
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.maskSensitiveData = exports.encryptAnalysisResults = exports.decryptData = exports.encryptData = exports.hashPhoneNumber = exports.hash = exports.decrypt = exports.encrypt = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
// Use environment variable or default key (should be set in production)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'whatsapp-chat-analyzer-secret-key-2026';
const HASH_SALT = process.env.HASH_SALT || 'chat-analyzer-salt';
/**
 * Encrypt data using AES encryption
 * @param {string} text - Plain text to encrypt
 * @returns {string} - Encrypted text (Base64)
 */
const encrypt = (text) => {
    try {
        if (!text) {
            throw new Error('Text to encrypt cannot be empty');
        }
        const encrypted = crypto_js_1.default.AES.encrypt(text, ENCRYPTION_KEY).toString();
        return encrypted;
    }
    catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
};
exports.encrypt = encrypt;
/**
 * Decrypt data using AES decryption
 * @param {string} encryptedText - Encrypted text (Base64)
 * @returns {string} - Decrypted plain text
 */
const decrypt = (encryptedText) => {
    try {
        if (!encryptedText) {
            throw new Error('Encrypted text cannot be empty');
        }
        const decrypted = crypto_js_1.default.AES.decrypt(encryptedText, ENCRYPTION_KEY);
        const plainText = decrypted.toString(crypto_js_1.default.enc.Utf8);
        if (!plainText) {
            throw new Error('Decryption failed - invalid key or corrupted data');
        }
        return plainText;
    }
    catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
};
exports.decrypt = decrypt;
/**
 * Hash a string using SHA-256
 * @param {string} text - Text to hash
 * @returns {string} - Hashed text (hex)
 */
const hash = (text) => {
    try {
        if (!text) {
            throw new Error('Text to hash cannot be empty');
        }
        const hashed = crypto_js_1.default.SHA256(text + HASH_SALT).toString(crypto_js_1.default.enc.Hex);
        return hashed;
    }
    catch (error) {
        console.error('Hashing error:', error);
        throw new Error('Failed to hash data');
    }
};
exports.hash = hash;
/**
 * Hash phone number for privacy
 * @param {string} phoneNumber - Phone number to hash
 * @returns {string} - Hashed phone number
 */
const hashPhoneNumber = (phoneNumber) => {
    try {
        const normalized = phoneNumber.replace(/[^\d+]/g, '');
        return (0, exports.hash)(normalized);
    }
    catch (error) {
        console.error('Phone number hashing error:', error);
        return phoneNumber;
    }
};
exports.hashPhoneNumber = hashPhoneNumber;
/**
 * Encrypt sensitive user data in analysis results
 * @param {any} data - Data to encrypt
 * @returns {string} - Encrypted JSON string
 */
const encryptData = (data) => {
    try {
        const jsonString = JSON.stringify(data);
        return (0, exports.encrypt)(jsonString);
    }
    catch (error) {
        console.error('Data encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
};
exports.encryptData = encryptData;
/**
 * Decrypt sensitive user data
 * @param {string} encryptedData - Encrypted JSON string
 * @returns {any} - Decrypted data object
 */
const decryptData = (encryptedData) => {
    try {
        const jsonString = (0, exports.decrypt)(encryptedData);
        return JSON.parse(jsonString);
    }
    catch (error) {
        console.error('Data decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
};
exports.decryptData = decryptData;
/**
 * Encrypt sensitive fields in analysis results before sending to frontend
 * @param {any} analysis - Analysis results object
 * @returns {any} - Analysis with encrypted sensitive data
 */
const encryptAnalysisResults = (analysis) => {
    try {
        // Create a deep copy to avoid mutating original
        const encrypted = JSON.parse(JSON.stringify(analysis));
        // Encrypt user names if present
        if (encrypted.userStats) {
            Object.keys(encrypted.userStats).forEach(user => {
                const stats = encrypted.userStats[user];
                stats.encryptedName = (0, exports.encrypt)(user);
                stats.hashedPhone = (0, exports.hashPhoneNumber)(user);
            });
        }
        // Encrypt message content samples if present
        if (encrypted.messageSamples) {
            encrypted.messageSamples = encrypted.messageSamples.map((msg) => (Object.assign(Object.assign({}, msg), { encryptedContent: (0, exports.encrypt)(msg.content || ''), encryptedSender: (0, exports.encrypt)(msg.sender || ''), content: '[ENCRYPTED]', sender: '[ENCRYPTED]' })));
        }
        // Add encryption metadata
        encrypted.metadata = Object.assign(Object.assign({}, encrypted.metadata), { encrypted: true, encryptionTimestamp: new Date().toISOString(), algorithm: 'AES-256' });
        return encrypted;
    }
    catch (error) {
        console.error('Analysis encryption error:', error);
        return analysis; // Return original if encryption fails
    }
};
exports.encryptAnalysisResults = encryptAnalysisResults;
/**
 * Mask sensitive information (partial encryption for display)
 * @param {string} text - Text to mask
 * @param {number} visibleChars - Number of characters to show at start/end
 * @returns {string} - Masked text
 */
const maskSensitiveData = (text, visibleChars = 2) => {
    if (!text || text.length <= visibleChars * 2) {
        return text;
    }
    const start = text.substring(0, visibleChars);
    const end = text.substring(text.length - visibleChars);
    const masked = '*'.repeat(Math.max(text.length - (visibleChars * 2), 3));
    return `${start}${masked}${end}`;
};
exports.maskSensitiveData = maskSensitiveData;
/**
 * Generate secure random token
 * @param {number} length - Token length
 * @returns {string} - Random token
 */
const generateToken = (length = 32) => {
    return crypto_js_1.default.lib.WordArray.random(length / 2).toString(crypto_js_1.default.enc.Hex);
};
exports.generateToken = generateToken;
//# sourceMappingURL=crypto.helper.js.map