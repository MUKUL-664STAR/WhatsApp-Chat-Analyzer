/**
 * Chat Analysis Routes
 * 
 * Defines all routes related to chat analysis functionality
 * 
 * @module routes/chatRoutes
 */

import { Router, Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import chatController from '../controllers/chatController';
import {
  validateFileUpload,
  validateQueryParams,
} from '../validators/chatValidator';

const router = Router();

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only .txt files are allowed'));
    }
  },
});

/**
 * @route GET /health
 * @desc Health check endpoint
 * @access Public
 */
router.get('/health', chatController.healthCheck);

/**
 * @route POST /analyze
 * @desc Analyze WhatsApp chat file
 * @access Public
 */
router.post(
  '/analyze',
  upload.single('chatFile'),
  validateFileUpload,
  validateQueryParams,
  chatController.analyzeChatFile
);

/**
 * @route GET /statistics
 * @desc Get API usage statistics
 * @access Public
 */
router.get('/statistics', chatController.getStatistics);

export default router;
