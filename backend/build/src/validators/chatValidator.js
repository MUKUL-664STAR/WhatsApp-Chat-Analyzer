"use strict";
/**
 * Chat Validation Schemas
 *
 * Joi validation schemas for chat analysis endpoints
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMessages = exports.validateQueryParams = exports.validateFileUpload = exports.chatMessageSchema = exports.queryParamsSchema = exports.uploadFileSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Validation schema for file upload
 */
exports.uploadFileSchema = joi_1.default.object({
    file: joi_1.default.object({
        fieldname: joi_1.default.string().required(),
        originalname: joi_1.default.string().required(),
        encoding: joi_1.default.string().required(),
        mimetype: joi_1.default.string().valid('text/plain', 'application/octet-stream').required(),
        size: joi_1.default.number().max(10 * 1024 * 1024).required(), // 10MB max
        buffer: joi_1.default.binary().required(),
    }).required().messages({
        'any.required': 'Chat file is required',
        'string.empty': 'File cannot be empty',
    }),
});
/**
 * Validation schema for query parameters
 */
exports.queryParamsSchema = joi_1.default.object({
    encrypt: joi_1.default.boolean().optional(),
    days: joi_1.default.number().integer().min(1).max(30).optional().default(7),
    format: joi_1.default.string().valid('json', 'csv').optional().default('json'),
}).options({ stripUnknown: true });
/**
 * Validation schema for chat message
 */
exports.chatMessageSchema = joi_1.default.object({
    timestamp: joi_1.default.date().optional(),
    date: joi_1.default.date().optional(),
    user: joi_1.default.string().trim().min(1).max(100).optional(),
    message: joi_1.default.string().trim().min(1).max(10000).optional(),
    type: joi_1.default.string().valid('user', 'system').optional(),
}).or('timestamp', 'date').or('user', 'message');
/**
 * Middleware to validate file upload
 */
const validateFileUpload = (req, res, next) => {
    if (!req.file) {
        const error = new Error('No file uploaded');
        error.statusCode = 400;
        error.code = 'NO_FILE';
        return next(error);
    }
    const { error } = exports.uploadFileSchema.validate({ file: req.file });
    if (error) {
        error.statusCode = 400;
        error.code = 'INVALID_FILE';
        return next(error);
    }
    next();
};
exports.validateFileUpload = validateFileUpload;
/**
 * Middleware to validate query parameters
 */
const validateQueryParams = (req, res, next) => {
    const { error, value } = exports.queryParamsSchema.validate(req.query);
    if (error) {
        error.statusCode = 400;
        error.code = 'INVALID_QUERY';
        return next(error);
    }
    // Replace query with validated and sanitized values
    req.query = value;
    next();
};
exports.validateQueryParams = validateQueryParams;
/**
 * Validate chat messages array
 */
const validateMessages = (messages) => {
    if (!Array.isArray(messages) || messages.length === 0) {
        const error = new Error('No valid messages found in chat');
        error.statusCode = 400;
        error.code = 'NO_MESSAGES';
        throw error;
    }
    // Basic validation - check for required fields from parser
    // Parser returns: { date, sender, content, type } or { date, content, type, joinedUser }
    const validatedMessages = messages.filter(msg => {
        return msg &&
            typeof msg === 'object' &&
            msg.date &&
            msg.content &&
            msg.type;
    });
    if (validatedMessages.length === 0) {
        const error = new Error('No valid messages found after filtering');
        error.statusCode = 400;
        error.code = 'INVALID_MESSAGE_FORMAT';
        throw error;
    }
    return validatedMessages;
};
exports.validateMessages = validateMessages;
//# sourceMappingURL=chatValidator.js.map