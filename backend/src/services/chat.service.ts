/**
 * Chat Service
 * 
 * Business logic layer for chat analysis
 * Handles data processing, validation, and analysis orchestration
 * 
 * @module services/chat.service
 */

import { ChatAnalysisModel, ChatMessage } from '../models/chatModel';
import { parseWhatsAppChat } from '../utils/chatParser.js';
import { analyzeChat as analyzeChatUtil } from '../utils/chatAnalyzer';
import { validateMessages } from '../validators/chatValidator';

interface AnalyzeChatOptions {
  content: string;
  shouldEncrypt?: boolean;
  fileName?: string;
  fileSize?: number;
}

interface AnalysisResult {
  analysis: any;
  metadata: {
    totalMessages: number;
    uniqueUsers: number;
    fileSize?: number;
    fileName?: string;
    processingTime: string;
    encrypted: boolean;
    dateRange: {
      start: string | null;
      end: string | null;
    };
  };
}

/**
 * Chat Service Object
 * Provides all chat-related business logic operations
 */
class ChatService {
  /**
   * Analyze chat content
   */
  async analyzeChat(options: AnalyzeChatOptions): Promise<AnalysisResult> {
    const startTime = Date.now();
    const { content, shouldEncrypt = false, fileName, fileSize } = options;

    if (!content || content.trim().length === 0) {
      throw new Error('Empty chat content provided');
    }

    const chatModel = new ChatAnalysisModel();
    const parsedMessages = parseWhatsAppChat(content);
    
    if (!parsedMessages || parsedMessages.length === 0) {
      throw new Error('No valid messages found in chat file');
    }

    const validatedMessages = validateMessages(parsedMessages);
    
    validatedMessages.forEach(msgData => {
      chatModel.addMessage(new ChatMessage(msgData));
    });

    const analysis = analyzeChatUtil(validatedMessages);
    chatModel.setAnalysisResults(analysis);
    
    const processingTime = Date.now() - startTime;
    
    return {
      analysis,
      metadata: {
        totalMessages: chatModel.getTotalMessages(),
        uniqueUsers: chatModel.getUniqueUsersCount(),
        fileSize,
        fileName,
        processingTime: `${processingTime}ms`,
        encrypted: shouldEncrypt,
        dateRange: {
          start: analysis.dateRange?.start || null,
          end: analysis.dateRange?.end || null
        }
      }
    };
  }

  /**
   * Get chat statistics
   */
  async getStatistics(content: string): Promise<any> {
    if (!content || content.trim().length === 0) {
      throw new Error('Empty chat content provided');
    }

    const parsedMessages = parseWhatsAppChat(content);
    const validatedMessages = validateMessages(parsedMessages);
    
    const chatModel = new ChatAnalysisModel();
    validatedMessages.forEach(msgData => {
      chatModel.addMessage(new ChatMessage(msgData));
    });

    return {
      totalMessages: chatModel.getTotalMessages(),
      uniqueUsers: chatModel.getUniqueUsersCount(),
      averageMessageLength: validatedMessages.reduce((acc, msg) => acc + (msg.content?.length || 0), 0) / validatedMessages.length,
      hasMedia: validatedMessages.some(msg => msg.isMedia),
      dateRange: {
        start: validatedMessages[0]?.timestamp,
        end: validatedMessages[validatedMessages.length - 1]?.timestamp
      }
    };
  }

  /**
   * Validate chat file format
   */
  async validateFormat(content: string): Promise<boolean> {
    try {
      const parsedMessages = parseWhatsAppChat(content);
      return parsedMessages && parsedMessages.length > 0;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const chatService = new ChatService();
export default chatService;
