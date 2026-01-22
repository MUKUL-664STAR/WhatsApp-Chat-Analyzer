/**
 * Chat Validation Schemas
 * 
 * Joi validation schemas for chat analysis endpoints
 */

import Joi from 'joi';

/**
 * Validation schema for file upload
 */
export const uploadFileSchema = Joi.object({
  file: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid('text/plain', 'application/octet-stream').required(),
    size: Joi.number().max(10 * 1024 * 1024).required(), // 10MB max
    buffer: Joi.binary().required(),
  }).required().messages({
    'any.required': 'Chat file is required',
    'string.empty': 'File cannot be empty',
  }),
});

/**
 * Validation schema for query parameters
 */
export const queryParamsSchema = Joi.object({
  encrypt: Joi.boolean().optional(),
  days: Joi.number().integer().min(1).max(30).optional().default(7),
  format: Joi.string().valid('json', 'csv').optional().default('json'),
}).options({ stripUnknown: true });

/**
 * Validation schema for chat message
 */
export const chatMessageSchema = Joi.object({
  timestamp: Joi.date().optional(),
  date: Joi.date().optional(),
  user: Joi.string().trim().min(1).max(100).optional(),
  message: Joi.string().trim().min(1).max(10000).optional(),
  type: Joi.string().valid('user', 'system').optional(),
}).or('timestamp', 'date').or('user', 'message');

/**
 * Middleware to validate file upload
 */
export const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    const error = new Error('No file uploaded');
    error.statusCode = 400;
    error.code = 'NO_FILE';
    return next(error);
  }

  const { error } = uploadFileSchema.validate({ file: req.file });
  if (error) {
    error.statusCode = 400;
    error.code = 'INVALID_FILE';
    return next(error);
  }

  next();
};

/**
 * Middleware to validate query parameters
 */
export const validateQueryParams = (req, res, next) => {
  const { error, value } = queryParamsSchema.validate(req.query);
  
  if (error) {
    error.statusCode = 400;
    error.code = 'INVALID_QUERY';
    return next(error);
  }

  // Replace query with validated and sanitized values
  req.query = value;
  next();
};

/**
 * Validate chat messages array
 */
export const validateMessages = (messages) => {
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
