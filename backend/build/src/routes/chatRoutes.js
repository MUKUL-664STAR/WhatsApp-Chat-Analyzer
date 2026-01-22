"use strict";
/**
 * Chat Analysis Routes
 *
 * Defines all routes related to chat analysis functionality
 *
 * @module routes/chatRoutes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const chatController_1 = require("../controllers/chatController");
const chatValidator_1 = require("../validators/chatValidator");
const router = (0, express_1.Router)();
// Configure multer for file uploads (memory storage)
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/plain') {
            cb(null, true);
        }
        else {
            cb(new Error('Only .txt files are allowed'));
        }
    },
});
/**
 * @route GET /health
 * @desc Health check endpoint
 * @access Public
 */
router.get('/health', chatController_1.healthCheck);
/**
 * @route POST /analyze
 * @desc Analyze WhatsApp chat file
 * @access Public
 */
router.post('/analyze', upload.single('chatFile'), chatValidator_1.validateFileUpload, chatValidator_1.validateQueryParams, chatController_1.analyzeChatFile);
/**
 * @route GET /statistics
 * @desc Get API usage statistics
 * @access Public
 */
router.get('/statistics', chatController_1.getStatistics);
exports.default = router;
//# sourceMappingURL=chatRoutes.js.map