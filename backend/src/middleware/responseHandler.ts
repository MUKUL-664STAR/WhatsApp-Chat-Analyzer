/**
 * Response Handler Middleware
 * 
 * Provides standardized response formats for success and error cases
 */

/**
 * Success response handler
 * @param {Object} res - Express response object
 * @param {Object} data - Response data
 * @param {String} message - Success message
 * @param {Number} statusCode - HTTP status code (default: 200)
 * @param {Object} metadata - Additional metadata
 */
export const sendSuccess = (res, data, message = 'Success', statusCode = 200, metadata = {}) => {
  const response = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  // Add metadata if provided
  if (Object.keys(metadata).length > 0) {
    response.metadata = metadata;
  }

  return res.status(statusCode).json(response);
};

/**
 * Error response handler
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code (default: 500)
 * @param {String} errorCode - Custom error code
 * @param {Object} details - Error details
 */
export const sendError = (res, message = 'Internal Server Error', statusCode = 500, errorCode = 'INTERNAL_ERROR', details = null) => {
  const response = {
    success: false,
    message,
    errorCode,
    timestamp: new Date().toISOString(),
  };

  // Add error details in development mode
  if (details && process.env.NODE_ENV !== 'production') {
    response.details = details;
  }

  return res.status(statusCode).json(response);
};

/**
 * Async handler wrapper for controllers
 * Catches errors and passes them to error handler
 * @param {Function} fn - Async controller function
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Joi validation errors
  if (err.isJoi) {
    return sendError(
      res,
      err.details[0].message,
      400,
      'VALIDATION_ERROR',
      err.details
    );
  }

  // Multer file upload errors
  if (err.name === 'MulterError') {
    return sendError(
      res,
      `File upload error: ${err.message}`,
      400,
      'FILE_UPLOAD_ERROR'
    );
  }

  // Custom application errors
  if (err.statusCode) {
    return sendError(
      res,
      err.message,
      err.statusCode,
      err.code || 'APPLICATION_ERROR'
    );
  }

  // Default server error
  return sendError(
    res,
    'An unexpected error occurred',
    500,
    'INTERNAL_SERVER_ERROR',
    process.env.NODE_ENV !== 'production' ? err.stack : null
  );
};
