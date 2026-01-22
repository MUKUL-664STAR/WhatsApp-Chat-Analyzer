/**
 * Chat Controller
 *
 * Handles HTTP requests and coordinates between routes and services.
 * Follows MVC pattern - this is the Controller layer.
 *
 * @module controllers/chatController
 */

import { Response, NextFunction } from "express";
import chatService from "../services/chat.service";
import { sendSuccess } from "../middleware/responseHandler";
import { encryptData } from "../helpers/crypto.helper";

const chatController = {
  /**
   * Health check endpoint
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next function
   * @returns {Promise<void>}
   */
  healthCheck: async (req: any, res: Response, next: NextFunction) => {
    try {
      const data = {
        status: "ok",
        version: "2.0.0",
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
      };

      return sendSuccess(
        res,
        data,
        "WhatsApp Chat Analyzer API is running",
        200,
      );
    } catch (e) {
      return next(e);
    }
  },

  /**
   * Analyze uploaded chat file
   * @param {Request} req - Express request object with file
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next function
   * @returns {Promise<void>}
   */
  analyzeChatFile: async (req: any, res: Response, next: NextFunction) => {
    try {
      const file = req.file;

      const chatContent = file.buffer.toString("utf-8").trim();

      if (!chatContent) {
        const error: any = new Error("Empty file uploaded");
        error.statusCode = 400;
        error.code = "EMPTY_FILE";
        throw error;
      }

      const result = await chatService.analyzeChat({
        content: chatContent,
        shouldEncrypt: false,
        fileName: file.originalname,
        fileSize: file.size,
      });

      console.log("📊 Analysis Result:", JSON.stringify(result, null, 2));

      // Prepare response data
      const responseData = {
        data: result.analysis,
        metadata: result.metadata,
        message: "Chat analyzed successfully",
        success: true,
        timestamp: new Date().toISOString(),
      };

      console.log(
        "📦 Response Data (before encryption):",
        JSON.stringify(responseData, null, 2),
      );

      // Always encrypt the response
      const encryptedData = encryptData(responseData);
      console.log("🔐 Encrypted Data:", encryptedData);
      console.log("📤 Sending Encrypted Response to Frontend");

      return res.status(200).json({
        success: true,
        encrypted: true,
        data: encryptedData,
        message: "Chat analyzed and encrypted successfully",
      });
    } catch (e) {
      return next(e);
    }
  },

  /**
   * Get general statistics about the analyzer
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next function
   * @returns {Promise<void>}
   */
  getStatistics: async (req: any, res: Response, next: NextFunction) => {
    try {
      const data = {
        totalAnalysesPerformed: 0,
        averageProcessingTime: "250ms",
        supportedFormats: ["WhatsApp iOS", "WhatsApp Android"],
        maxFileSize: "10MB",
        features: [
          "Daily activity tracking",
          "User engagement metrics",
          "New user detection",
          "Data encryption support",
        ],
      };

      return sendSuccess(res, data, "Statistics retrieved successfully", 200);
    } catch (e) {
      return next(e);
    }
  },
};

export default chatController;
