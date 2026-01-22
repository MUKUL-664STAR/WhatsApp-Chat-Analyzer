/**
 * WhatsApp Chat Analyzer
 * 
 * Analyzes parsed WhatsApp chat data to extract insights such as:
 * - Daily new user joins
 * - Daily active users
 * - Users active for 4+ days in the last week
 * 
 * @module chatAnalyzer
 */

/**
 * Get date string in YYYY-MM-DD format
 * @param {Date} date - Date object
 * @returns {string} Date string
 */
const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get array of last N days from a reference date
 * @param {Date} fromDate - Reference date
 * @param {number} days - Number of days
 * @returns {Array} Array of date keys
 */
const getLastNDays = (fromDate, days = 7) => {
  const dateKeys = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(fromDate);
    date.setDate(date.getDate() - i);
    dateKeys.push(getDateKey(date));
  }
  return dateKeys;
};

/**
 * Format date key to readable format
 * @param {string} dateKey - Date key in YYYY-MM-DD format
 * @returns {string} Formatted date string
 */
const formatDateLabel = (dateKey) => {
  const [year, month, day] = dateKey.split('-');
  const date = new Date(year, month - 1, day);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[date.getMonth()]} ${day}`;
};

/**
 * Analyze parsed WhatsApp chat messages
 * @param {Array} messages - Array of parsed message objects
 * @returns {Object} Analysis results
 */
export const analyzeChat = (messages) => {
  // Find the latest date in the chat
  const latestDate = messages.reduce((latest, msg) => {
    return msg.date > latest ? msg.date : latest;
  }, new Date(0));

  // Get last 7 days from the latest date
  const last7Days = getLastNDays(latestDate, 7);

  // Initialize data structures
  const dailyJoins = {}; // { dateKey: Set of users }
  const dailyActiveUsers = {}; // { dateKey: Set of users }
  const userActivityDays = {}; // { user: Set of dateKeys }

  // Initialize all days with empty sets
  last7Days.forEach(day => {
    dailyJoins[day] = new Set();
    dailyActiveUsers[day] = new Set();
  });

  // Process all messages
  messages.forEach(msg => {
    const dateKey = getDateKey(msg.date);
    
    // Only process messages from the last 7 days
    if (!last7Days.includes(dateKey)) {
      return;
    }

    // Track join events
    if (msg.type === 'join' && msg.joinedUser) {
      if (!dailyJoins[dateKey]) {
        dailyJoins[dateKey] = new Set();
      }
      dailyJoins[dateKey].add(msg.joinedUser);
    }

    // Track active users (those who sent messages)
    if (msg.type === 'message' && msg.sender) {
      if (!dailyActiveUsers[dateKey]) {
        dailyActiveUsers[dateKey] = new Set();
      }
      dailyActiveUsers[dateKey].add(msg.sender);

      // Track user activity across days
      if (!userActivityDays[msg.sender]) {
        userActivityDays[msg.sender] = new Set();
      }
      userActivityDays[msg.sender].add(dateKey);
    }
  });

  // Prepare data for chart
  const chartData = {
    labels: last7Days.map(formatDateLabel),
    newUsers: last7Days.map(day => dailyJoins[day].size),
    activeUsers: last7Days.map(day => dailyActiveUsers[day].size)
  };

  // Find users active for 4+ days in the last 7 days
  const activeUsers4Plus = Object.entries(userActivityDays)
    .filter(([user, days]) => days.size >= 4)
    .map(([user, days]) => ({
      user,
      activeDays: days.size,
      dates: Array.from(days).sort()
    }))
    .sort((a, b) => b.activeDays - a.activeDays);

  // Calculate summary statistics
  const totalNewUsers = Object.values(dailyJoins)
    .reduce((sum, set) => sum + set.size, 0);
  
  const uniqueActiveUsers = new Set();
  Object.values(dailyActiveUsers).forEach(set => {
    set.forEach(user => uniqueActiveUsers.add(user));
  });

  const summary = {
    totalNewUsersLast7Days: totalNewUsers,
    totalActiveUsersLast7Days: uniqueActiveUsers.size,
    usersActive4PlusDays: activeUsers4Plus.length,
    averageNewUsersPerDay: (totalNewUsers / 7).toFixed(2),
    averageActiveUsersPerDay: (uniqueActiveUsers.size / 7).toFixed(2)
  };

  return {
    chartData,
    activeUsers4Plus,
    summary,
    dateRange: {
      start: last7Days[0],
      end: last7Days[last7Days.length - 1]
    }
  };
};
