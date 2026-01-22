"use strict";
/**
 * Application Configuration
 * Centralizes all environment variables and app settings
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    // Server Configuration
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_PREFIX: process.env.API_PREFIX || '/api',
    // CORS Configuration
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    // File Upload Configuration
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES || '.txt').split(','),
    UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
    // Timezone Configuration
    DEFAULT_TIMEZONE: process.env.DEFAULT_TIMEZONE || 'Asia/Kolkata',
    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    // Security
    RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
};
//# sourceMappingURL=index.js.map