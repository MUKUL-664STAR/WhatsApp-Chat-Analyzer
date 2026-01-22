/**
 * Application Configuration
 * Centralizes all environment variables and app settings
 * 
 * @module config
 */

const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_PREFIX: process.env.API_PREFIX || '/api',
  
  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // File Upload Configuration
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
  ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES || '.txt').split(','),
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  
  // Application Settings
  DEFAULT_TIMEZONE: process.env.DEFAULT_TIMEZONE || 'Asia/Kolkata',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  
  // Encryption
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'whatsapp-chat-analyzer-secret-key-2026',
  HASH_SALT: process.env.HASH_SALT || 'chat-analyzer-salt',
};

export default config;
