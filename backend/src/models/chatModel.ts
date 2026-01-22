/**
 * Chat Model
 * 
 * Data model for chat analysis with validation and business logic.
 * Follows MVC pattern - this is the Model layer.
 * 
 * @module models/chatModel
 */

export class ChatMessage {
  constructor(data) {
    this.date = data.date;
    this.dateString = data.dateString;
    this.sender = data.sender;
    this.content = data.content;
    this.type = data.type;
    this.joinedUser = data.joinedUser;
    this.encrypted = false;
  }

  /**
   * Validate message data
   * @returns {boolean} True if valid
   */
  isValid() {
    return (
      this.date instanceof Date &&
      this.date.toString() !== 'Invalid Date' &&
      typeof this.content === 'string' &&
      this.content.length > 0
    );
  }

  /**
   * Check if message is within date range
   * @param {Date} startDate 
   * @param {Date} endDate 
   * @returns {boolean}
   */
  isInDateRange(startDate, endDate) {
    return this.date >= startDate && this.date <= endDate;
  }

  /**
   * Get formatted date
   * @returns {string}
   */
  getFormattedDate() {
    return this.date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}

export class ChatAnalysisModel {
  constructor() {
    this.messages = [];
    this.users = new Set();
    this.joinEvents = [];
    this.analysisResults = null;
  }

  /**
   * Add message to model
   * @param {ChatMessage} message 
   */
  addMessage(message) {
    if (message.isValid()) {
      this.messages.push(message);
      if (message.sender) {
        this.users.add(message.sender);
      }
      if (message.type === 'join' && message.joinedUser) {
        this.joinEvents.push({
          user: message.joinedUser,
          date: message.date
        });
      }
    }
  }

  /**
   * Get messages by type
   * @param {string} type 
   * @returns {Array}
   */
  getMessagesByType(type) {
    return this.messages.filter(msg => msg.type === type);
  }

  /**
   * Get messages by date range
   * @param {Date} startDate 
   * @param {Date} endDate 
   * @returns {Array}
   */
  getMessagesByDateRange(startDate, endDate) {
    return this.messages.filter(msg => msg.isInDateRange(startDate, endDate));
  }

  /**
   * Get total message count
   * @returns {number}
   */
  getTotalMessages() {
    return this.messages.length;
  }

  /**
   * Get unique users count
   * @returns {number}
   */
  getUniqueUsersCount() {
    return this.users.size;
  }

  /**
   * Set analysis results
   * @param {Object} results 
   */
  setAnalysisResults(results) {
    this.analysisResults = results;
  }

  /**
   * Get analysis results
   * @returns {Object}
   */
  getAnalysisResults() {
    return this.analysisResults;
  }

  /**
   * Clear all data
   */
  clear() {
    this.messages = [];
    this.users.clear();
    this.joinEvents = [];
    this.analysisResults = null;
  }
}
