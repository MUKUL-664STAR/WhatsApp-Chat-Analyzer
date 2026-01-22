/**
 * LoadingSpinner Component
 * 
 * Displays a loading animation while chat is being analyzed.
 * 
 * @component
 */

import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-gray-200 border-t-whatsapp-primary rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">
          📊
        </div>
      </div>
      <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">
        Analyzing your chat...
      </p>
      <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
    </div>
  );
};

export default LoadingSpinner;
