"use strict";
/**
 * Chat Controller
 *
 * Handles HTTP requests and coordinates between routes and services.
 * Follows MVC pattern - this is the Controller layer.
 * Routes requests to appropriate services and returns responses.
 *
 * @module controllers/chatController
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatistics = exports.analyzeChat = exports.analyzeChatFile = exports.healthCheck = void 0;
const chat_service_js_1 = require("../services/chat.service.js");
const responseHandler_js_1 = require("../middleware/responseHandler.js");
/**
 * Health check controller
 * @param {Request} req
 * @param {Response} res
 */
exports.healthCheck = (0, responseHandler_js_1.asyncHandler)(async (req, res) => {
    const data = {
        status: 'ok',
        version: '2.0.0',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    };
    return (0, responseHandler_js_1.sendSuccess)(res, data, 'WhatsApp Chat Analyzer API is running', 200);
});
/**
 * Analyze chat file controller
 * Delegates business logic to service layer
 * @param {Request} req
 * @param {Response} res
 */
exports.analyzeChatFile = (0, responseHandler_js_1.asyncHandler)(async (req, res) => {
    // File validation already done by middleware
    const { file, query } = req;
    const shouldEncrypt = query.encrypt === true || query.encrypt === 'true';
    // Convert buffer to string
    const chatContent = file.buffer.toString('utf-8').trim();
    if (!chatContent) {
        const error = new Error('Empty file uploaded');
        error.statusCode = 400;
        error.code = 'EMPTY_FILE';
        throw error;
    }
    // Call service layer for business logic
    const result = await (0, chat_service_js_1.analyzeChatService)({
        content: chatContent,
        shouldEncrypt,
        fileName: file.originalname,
        fileSize: file.size
    });
    // Return success response
    return (0, responseHandler_js_1.sendSuccess)(res, result.analysis, 'Chat analyzed successfully', 200, metadata);
});
/**
 * Legacy analyze chat controller (for backward compatibility)
 * @deprecated Use analyzeChatFile instead
 */
exports.analyzeChat = exports.analyzeChatFile;
/**
 * Get analysis statistics controller
 * @param {Request} req
 * @param {Response} res
 */
exports.getStatistics = (0, responseHandler_js_1.asyncHandler)(async (req, res) => {
    const data = {
        totalAnalysesPerformed: 0, // Would come from database in production
        averageProcessingTime: '250ms',
        supportedFormats: ['WhatsApp iOS', 'WhatsApp Android'],
        maxFileSize: '10MB',
        features: [
            'Daily activity tracking',
            'User engagement metrics',
            'New user detection',
            'Data encryption support'
        ]
    };
    return (0, responseHandler_js_1.sendSuccess)(res, data, 'Statistics retrieved successfully', 200);
});
result.metadata;
//# sourceMappingURL=chatController.js.map