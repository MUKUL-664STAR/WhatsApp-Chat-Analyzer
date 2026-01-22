/**
 * ActiveUsersList Component
 * 
 * Displays a list of users who were active for 4 or more days in the last week.
 * Shows user details and activity badges.
 * 
 * @component
 * @param {Object} props
 * @param {Array} props.users - Array of user objects with activity information
 */

import React from 'react';

const ActiveUsersList = ({ users }) => {
  /**
   * Get initials from user identifier
   * @param {string} user - User identifier
   * @returns {string} Initials
   */
  const getInitials = (user) => {
    if (user.startsWith('+')) {
      // For phone numbers, use first two digits after country code
      const digits = user.replace(/\D/g, '');
      return digits.slice(-2);
    }
    // For names, use first two characters
    return user.slice(0, 2).toUpperCase();
  };

  /**
   * Format user identifier for display
   * @param {string} user - User identifier
   * @returns {string} Formatted user string
   */
  const formatUser = (user) => {
    if (user.startsWith('+')) {
      return `User ${user.slice(-4)}`;
    }
    return user;
  };

  /**
   * Get badge color based on activity level
   * @param {number} days - Number of active days
   * @returns {string} CSS class
   */
  const getBadgeColor = (days) => {
    if (days === 7) return 'badge-gold';
    if (days >= 5) return 'badge-silver';
    return 'badge-bronze';
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🤷</div>
        <p className="text-gray-600">No users were active for 4 or more days in the last week.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((userObj, index) => (
        <div
          key={index}
          className="group bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-l-4 border-transparent hover:border-whatsapp-primary"
        >
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-whatsapp-primary to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {getInitials(userObj.user)}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 group-hover:text-whatsapp-dark transition-colors">
                  {formatUser(userObj.user)}
                </h4>
                <p className="text-sm text-gray-500">
                  Active on {userObj.activeDays} day{userObj.activeDays !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div
              className={`
                px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 shadow-md
                ${userObj.activeDays === 7 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900' 
                  : userObj.activeDays >= 5 
                  ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800' 
                  : 'bg-gradient-to-r from-orange-400 to-orange-500 text-white'
                }
              `}
            >
              <span className="text-lg">
                {userObj.activeDays === 7 ? '🏆' : userObj.activeDays >= 5 ? '⭐' : '✨'}
              </span>
              {userObj.activeDays}/7 days
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActiveUsersList;
