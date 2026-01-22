/**
 * ErrorMessage Component
 * 
 * Displays error messages with dismiss functionality.
 * 
 * @component
 * @param {Object} props
 * @param {string} props.message - Error message to display
 * @param {Function} props.onDismiss - Callback when error is dismissed
 */

import React from 'react';

const ErrorMessage = ({ message, onDismiss }) => {
  return (
    <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-xl shadow-lg p-6 mb-6 animate-shake">
      <div className="flex items-start gap-4">
        <div className="text-4xl flex-shrink-0">⚠️</div>
        <div className="flex-1">
          <div className="text-lg font-bold text-red-800 mb-1">Error</div>
          <div className="text-red-700">{message}</div>
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-red-600 hover:text-red-800 hover:bg-red-200 rounded-full p-2 transition-all duration-200 text-xl font-bold"
          aria-label="Dismiss error"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
