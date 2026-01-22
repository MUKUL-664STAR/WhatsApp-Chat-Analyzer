"use strict";
/**
 * Chat Service
 *
 * Business logic layer for chat analysis
 * Handles data processing, validation, and analysis orchestration
 *
 * @module services/chat.service
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateChatFormat = exports.getChatStatistics = exports.analyzeChatService = void 0;
const chatModel_js_1 = require("../models/chatModel.js");
const chatParser_js_1 = require("../utils/chatParser.js");
const chatAnalyzer_js_1 = require("../utils/chatAnalyzer.js");
const chatValidator_js_1 = require("../validators/chatValidator.js");
const crypto_helper_js_1 = require("../helpers/crypto.helper.js");
/**
 * Main service to analyze chat content
 * @param {AnalyzeChatOptions} options - Chat analysis options
 * @returns {Promise<AnalysisResult>} - Analysis results with metadata
 */
const analyzeChatService = async (options) => {
    var _a, _b;
    const startTime = Date.now();
    const { content, shouldEncrypt = false, fileName, fileSize } = options;
    try {
        // Validate content
        if (!content || content.trim().length === 0) {
            throw new Error('Empty chat content provided');
        }
        // Create model instance
        const chatModel = new chatModel_js_1.ChatAnalysisModel();
        // Parse the chat content
        const parsedMessages = (0, chatParser_js_1.parseWhatsAppChat)(content);
        if (!parsedMessages || parsedMessages.length === 0) {
            throw new Error('No valid messages found in chat file');
        }
        // Validate parsed messages using Joi
        const validatedMessages = (0, chatValidator_js_1.validateMessages)(parsedMessages);
        // Add messages to model
        validatedMessages.forEach(msgData => {
            const message = new chatModel_js_1.ChatMessage(msgData);
            chatModel.addMessage(message);
        });
        // Analyze the parsed messages
        const analysis = (0, chatAnalyzer_js_1.analyzeChat)(validatedMessages);
        chatModel.setAnalysisResults(analysis);
        // Encrypt sensitive data if requested
        const finalAnalysis = shouldEncrypt
            ? (0, crypto_helper_js_1.encryptAnalysisResults)(analysis)
            : analysis;
        // Calculate processing time
        const processingTime = Date.now() - startTime;
        // Prepare metadata
        const metadata = {
            totalMessages: chatModel.getTotalMessages(),
            uniqueUsers: chatModel.getUniqueUsersCount(),
            fileSize,
            fileName,
            processingTime: `${processingTime}ms`,
            encrypted: shouldEncrypt,
            dateRange: {
                start: ((_a = analysis.dateRange) === null || _a === void 0 ? void 0 : _a.start) || null,
                end: ((_b = analysis.dateRange) === null || _b === void 0 ? void 0 : _b.end) || null
            }
        };
        return {
            analysis: finalAnalysis,
            metadata
        };
    }
    catch (error) {
        console.error('Chat analysis service error:', error);
        throw error;
    }
};
exports.analyzeChatService = analyzeChatService;
/**
 * Get chat statistics without full analysis
 * @param {string} content - Chat content
 * @returns {Promise<any>} - Basic statistics
 */
const getChatStatistics = async (content) => {
    var _a, _b;
    try {
        if (!content || content.trim().length === 0) {
            throw new Error('Empty chat content provided');
        }
        const parsedMessages = (0, chatParser_js_1.parseWhatsAppChat)(content);
        const validatedMessages = (0, chatValidator_js_1.validateMessages)(parsedMessages);
        const chatModel = new chatModel_js_1.ChatAnalysisModel();
        validatedMessages.forEach(msgData => {
            chatModel.addMessage(new chatModel_js_1.ChatMessage(msgData));
        });
        return {
            totalMessages: chatModel.getTotalMessages(),
            uniqueUsers: chatModel.getUniqueUsersCount(),
            averageMessageLength: validatedMessages.reduce((acc, msg) => { var _a; return acc + (((_a = msg.content) === null || _a === void 0 ? void 0 : _a.length) || 0); }, 0) / validatedMessages.length,
            hasMedia: validatedMessages.some(msg => msg.isMedia),
            dateRange: {
                start: (_a = validatedMessages[0]) === null || _a === void 0 ? void 0 : _a.timestamp,
                end: (_b = validatedMessages[validatedMessages.length - 1]) === null || _b === void 0 ? void 0 : _b.timestamp
            }
        };
    }
    catch (error) {
        console.error('Statistics service error:', error);
        throw error;
    }
};
exports.getChatStatistics = getChatStatistics;
/**
 * Validate chat file format
 * @param {string} content - Chat content
 * @returns {Promise<boolean>} - Validation result
 */
const validateChatFormat = async (content) => {
    try {
        const parsedMessages = (0, chatParser_js_1.parseWhatsAppChat)(content);
        return parsedMessages && parsedMessages.length > 0;
    }
    catch (error) {
        return false;
    }
};
exports.validateChatFormat = validateChatFormat;
//# sourceMappingURL=chat.service.js.map