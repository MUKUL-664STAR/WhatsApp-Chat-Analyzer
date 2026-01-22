"use strict";
/**
 * Encryption Service
 *
 * Provides encryption and decryption for sensitive chat data.
 * Uses AES-256-CBC encryption for data security.
 *
 * @module services/encryptionService
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.decryptAnalysisResults = exports.encryptAnalysisResults = exports.hash = exports.decrypt = exports.encrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto_1.default.randomBytes(32);
const IV_LENGTH = 16;
/**
 * Encrypt text
 * @param {string} text - Text to encrypt
 * @returns {string} Encrypted text with IV prepended
 */
const encrypt = (text) => {
    try {
        const iv = crypto_1.default.randomBytes(IV_LENGTH);
        const cipher = crypto_1.default.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        // Prepend IV to encrypted data
        return iv.toString('hex') + ':' + encrypted;
    }
    catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
};
exports.encrypt = encrypt;
/**
 * Decrypt text
 * @param {string} text - Encrypted text with IV
 * @returns {string} Decrypted text
 */
const decrypt = (text) => {
    try {
        const parts = text.split(':');
        if (parts.length !== 2) {
            throw new Error('Invalid encrypted data format');
        }
        const iv = Buffer.from(parts[0], 'hex');
        const encryptedText = parts[1];
        const decipher = crypto_1.default.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
};
exports.decrypt = decrypt;
/**
 * Hash sensitive data (one-way)
 * @param {string} data - Data to hash
 * @returns {string} Hashed data
 */
const hash = (data) => {
    return crypto_1.default.createHash('sha256').update(data).digest('hex');
};
exports.hash = hash;
/**
 * Encrypt user identifiers in analysis results
 * @param {Object} analysisResults
 * @returns {Object} Results with encrypted user IDs
 */
const encryptAnalysisResults = (analysisResults) => {
    try {
        const encrypted = Object.assign({}, analysisResults);
        // Encrypt user identifiers in activeUsers4Plus
        if (encrypted.activeUsers4Plus) {
            encrypted.activeUsers4Plus = encrypted.activeUsers4Plus.map(user => (Object.assign(Object.assign({}, user), { user: (0, exports.encrypt)(user.user), encrypted: true })));
        }
        return encrypted;
    }
    catch (error) {
        console.error('Error encrypting results:', error);
        return analysisResults;
    }
};
exports.encryptAnalysisResults = encryptAnalysisResults;
/**
 * Decrypt user identifiers in analysis results
 * @param {Object} analysisResults
 * @returns {Object} Results with decrypted user IDs
 */
const decryptAnalysisResults = (analysisResults) => {
    try {
        const decrypted = Object.assign({}, analysisResults);
        // Decrypt user identifiers in activeUsers4Plus
        if (decrypted.activeUsers4Plus) {
            decrypted.activeUsers4Plus = decrypted.activeUsers4Plus.map(user => {
                if (user.encrypted) {
                    return Object.assign(Object.assign({}, user), { user: (0, exports.decrypt)(user.user), encrypted: false });
                }
                return user;
            });
        }
        return decrypted;
    }
    catch (error) {
        console.error('Error decrypting results:', error);
        return analysisResults;
    }
};
exports.decryptAnalysisResults = decryptAnalysisResults;
/**
 * Generate secure token
 * @returns {string} Random token
 */
const generateToken = () => {
    return crypto_1.default.randomBytes(32).toString('hex');
};
exports.generateToken = generateToken;
//# sourceMappingURL=encryptionService.js.map