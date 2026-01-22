/**
 * WhatsApp Chat Parser
 * 
 * Parses WhatsApp exported chat files and extracts structured message data.
 * Handles various message types including regular messages, system messages,
 * user join events, and media messages.
 * 
 * @module chatParser
 */

/**
 * Regular expression to match WhatsApp message lines
 * Format: date, time - sender: message
 * Examples:
 * - "3/30/21, 1:23 PM - +91 16 91994: Message text"
 * - "4/1/21, 4:54 AM - +91 68 42122 joined using this group's invite link"
 * - "07/10/24, 10:17 pm - Sunny Bhai: Message text" (lowercase am/pm)
 */
const MESSAGE_REGEX = /^(\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}\s(?:AM|PM|am|pm))\s-\s(.+?):\s(.+)$/i;
const SYSTEM_MESSAGE_REGEX = /^(\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}\s(?:AM|PM|am|pm))\s-\s(.+)$/i;

/**
 * Parse a date string from WhatsApp format to Date object
 * @param {string} dateString - Date string in format "M/D/YY, H:MM AM/PM"
 * @returns {Date} Parsed date object
 */
const parseWhatsAppDate = (dateString) => {
  try {
    // Handle format: "3/30/21, 1:23 PM" or "07/10/24, 10:17 pm"
    // Replace non-breaking spaces and normalize
    const normalizedString = dateString.replace(/[\u202F\u00A0]/g, ' ');
    
    const parts = normalizedString.split(',');
    const datePart = parts[0].trim();
    const timePart = parts[1].trim();
    
    const [month, day, year] = datePart.split('/');
    
    // Split time part by space, but handle cases where period might be missing
    const timeParts = timePart.split(/\s+/).filter(p => p);
    if (timeParts.length < 2) {
      console.error('Invalid time format:', dateString);
      return null;
    }
    
    const time = timeParts[0];
    const period = timeParts[1];
    const [hours, minutes] = time.split(':');
    
    let hour = parseInt(hours);
    const isPM = period && period.toLowerCase() === 'pm';
    const isAM = period && period.toLowerCase() === 'am';
    
    if (isPM && hour !== 12) hour += 12;
    if (isAM && hour === 12) hour = 0;
    
    // Assuming 21st century for 2-digit years
    const fullYear = year.length === 2 ? 2000 + parseInt(year) : parseInt(year);
    
    return new Date(fullYear, parseInt(month) - 1, parseInt(day), hour, parseInt(minutes));
  } catch (error) {
    console.error('Error parsing date:', dateString, error);
    return null;
  }
};

/**
 * Extract phone number from sender string
 * @param {string} sender - Sender string (e.g., "+91 16 91994" or "John")
 * @returns {string} Normalized sender identifier
 */
const normalizeSender = (sender) => {
  // Remove spaces and keep only digits and + sign for phone numbers
  if (sender.includes('+')) {
    return sender.replace(/\s/g, '');
  }
  return sender.trim();
};

/**
 * Check if message is a user join event
 * @param {string} message - Message text
 * @returns {boolean} True if message is a join event
 */
const isJoinEvent = (message) => {
  return (
    message.includes('joined using this group\'s invite link') ||
    message.includes('added you') ||
    message.includes('added ')
  );
};

/**
 * Extract user identifier from join event message
 * @param {string} systemMessage - System message text
 * @returns {string|null} User identifier or null
 */
const extractJoinedUser = (systemMessage) => {
  // Handle "X joined using this group's invite link"
  const joinMatch = systemMessage.match(/^(.+?)\sjoined using/);
  if (joinMatch) {
    return normalizeSender(joinMatch[1]);
  }
  
  // Handle "X added Y"
  const addedMatch = systemMessage.match(/added\s(.+?)$/);
  if (addedMatch) {
    return normalizeSender(addedMatch[1]);
  }
  
  return null;
};

/**
 * Parse WhatsApp chat export file content
 * @param {string} chatContent - Raw chat file content
 * @returns {Array} Array of parsed message objects
 */
export const parseWhatsAppChat = (chatContent) => {
  const lines = chatContent.split('\n');
  const messages = [];
  let currentMessage = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) continue;

    // Try to match regular message format (sender: message)
    const messageMatch = line.match(MESSAGE_REGEX);
    if (messageMatch) {
      const [, dateStr, sender, content] = messageMatch;
      const date = parseWhatsAppDate(dateStr);
      
      if (date) {
        currentMessage = {
          date,
          dateString: dateStr,
          sender: normalizeSender(sender),
          content: content.trim(),
          type: 'message'
        };
        messages.push(currentMessage);
      }
      continue;
    }

    // Try to match system message format (no sender, just action)
    const systemMatch = line.match(SYSTEM_MESSAGE_REGEX);
    if (systemMatch) {
      const [, dateStr, content] = systemMatch;
      const date = parseWhatsAppDate(dateStr);
      
      if (date) {
        // Check if it's a join event
        if (isJoinEvent(content)) {
          const joinedUser = extractJoinedUser(content);
          currentMessage = {
            date,
            dateString: dateStr,
            content: content.trim(),
            type: 'join',
            joinedUser: joinedUser
          };
          messages.push(currentMessage);
        } else {
          // Other system messages
          currentMessage = {
            date,
            dateString: dateStr,
            content: content.trim(),
            type: 'system'
          };
          messages.push(currentMessage);
        }
      }
      continue;
    }

    // If line doesn't match pattern, it's a continuation of previous message
    if (currentMessage && currentMessage.type === 'message') {
      currentMessage.content += '\n' + line;
    }
  }

  return messages;
};
