"use strict";
/**
 * Crypto Service using crypto-js
 *
 * Provides encryption, decryption, and hashing utilities
 * using crypto-js library for enhanced security
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEncryption = exports.encryptAnalysisResults = exports.decryptUserData = exports.encryptUserData = exports.generateToken = exports.hmacHash = exports.hash = exports.decrypt = exports.encrypt = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
// Use environment variable or default key (should be set in production)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'whatsapp-chat-analyzer-secret-key-2026';
const HASH_SALT = process.env.HASH_SALT || 'chat-analyzer-salt';
/**
 * Encrypt data using AES encryption
 * @param {String} text - Plain text to encrypt
 * @returns {String} - Encrypted text (Base64)
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
 * @param {String} encryptedText - Encrypted text (Base64)
 * @returns {String} - Decrypted plain text
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
 * Hash data using SHA256
 * @param {String} text - Text to hash
 * @returns {String} - Hashed text (hex)
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
 * Hash data using HMAC-SHA256 for better security
 * @param {String} text - Text to hash
 * @param {String} secret - Secret key for HMAC
 * @returns {String} - HMAC hash (hex)
 */
const hmacHash = (text, secret = ENCRYPTION_KEY) => {
    try {
        if (!text) {
            throw new Error('Text to hash cannot be empty');
        }
        const hashed = crypto_js_1.default.HmacSHA256(text, secret).toString(crypto_js_1.default.enc.Hex);
        return hashed;
    }
    catch (error) {
        console.error('HMAC hashing error:', error);
        throw new Error('Failed to generate HMAC hash');
    }
};
exports.hmacHash = hmacHash;
/**
 * Generate a secure random token
 * @param {Number} length - Length of token (default: 32)
 * @returns {String} - Random token (hex)
 */
const generateToken = (length = 32) => {
    try {
        const randomBytes = crypto_js_1.default.lib.WordArray.random(length);
        return randomBytes.toString(crypto_js_1.default.enc.Hex);
    }
    catch (error) {
        console.error('Token generation error:', error);
        throw new Error('Failed to generate token');
    }
};
exports.generateToken = generateToken;
/**
 * Encrypt user identifiers in analysis results
 * @param {Array} users - Array of user identifiers
 * @returns {Array} - Array of encrypted user objects
 */
const encryptUserData = (users) => {
    try {
        if (!Array.isArray(users)) {
            throw new Error('Users must be an array');
        }
        return users.map(user => ({
            user: (0, exports.encrypt)(user),
            encrypted: true,
            hash: (0, exports.hash)(user) // Add hash for verification without decryption
        }));
    }
    catch (error) {
        console.error('User data encryption error:', error);
        throw new Error('Failed to encrypt user data');
    }
};
exports.encryptUserData = encryptUserData;
/**
 * Decrypt user identifiers
 * @param {Array} encryptedUsers - Array of encrypted user objects
 * @returns {Array} - Array of decrypted user identifiers
 */
const decryptUserData = (encryptedUsers) => {
    try {
        if (!Array.isArray(encryptedUsers)) {
            throw new Error('Encrypted users must be an array');
        }
        return encryptedUsers.map(item => {
            if (item.encrypted) {
                return (0, exports.decrypt)(item.user);
            }
            return item.user || item;
        });
    }
    catch (error) {
        console.error('User data decryption error:', error);
        throw new Error('Failed to decrypt user data');
    }
};
exports.decryptUserData = decryptUserData;
/**
 * Encrypt complete analysis results
 * @param {Object} analysisData - Analysis results object
 * @returns {Object} - Encrypted analysis results
 */
const encryptAnalysisResults = (analysisData) => {
    try {
        const encrypted = Object.assign(Object.assign({}, analysisData), { encrypted: true, encryptedAt: new Date().toISOString() });
        // Encrypt sensitive user data
        if (analysisData.activeUsers4Plus && Array.isArray(analysisData.activeUsers4Plus)) {
            encrypted.activeUsers4Plus = (0, exports.encryptUserData)(analysisData.activeUsers4Plus.map(u => u.user || u));
        }
        // Encrypt daily user lists if present
        if (analysisData.dailyData && Array.isArray(analysisData.dailyData)) {
            encrypted.dailyData = analysisData.dailyData.map(day => (Object.assign(Object.assign({}, day), { activeUsers: day.activeUsers ? (0, exports.encryptUserData)(day.activeUsers) : [], newUsers: day.newUsers ? (0, exports.encryptUserData)(day.newUsers) : [] })));
        }
        return encrypted;
    }
    catch (error) {
        console.error('Analysis encryption error:', error);
        throw new Error('Failed to encrypt analysis results');
    }
};
exports.encryptAnalysisResults = encryptAnalysisResults;
/**
 * Verify if encrypted data can be decrypted
 * @param {String} encryptedText - Encrypted text to verify
 * @returns {Boolean} - True if valid, false otherwise
 */
const verifyEncryption = (encryptedText) => {
    try {
        const decrypted = (0, exports.decrypt)(encryptedText);
        return !!decrypted;
    }
    catch (error) {
        return false;
    }
};
exports.verifyEncryption = verifyEncryption;
exports.default = {
    encrypt: exports.encrypt,
    decrypt: exports.decrypt,
    hash: exports.hash,
    hmacHash: exports.hmacHash,
    generateToken: exports.generateToken,
    encryptUserData: exports.encryptUserData,
    decryptUserData: exports.decryptUserData,
    encryptAnalysisResults: exports.encryptAnalysisResults,
    verifyEncryption: exports.verifyEncryption
};
//# sourceMappingURL=cryptoService.js.map