/**
 * Summary Component
 * 
 * Displays summary statistics cards showing key metrics
 * from the chat analysis.
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.summary - Summary statistics object
 */

import React from 'react';

const Summary = ({ summary }) => {
  const cards = [
    {
      label: 'New Users',
      value: summary.totalNewUsersLast7Days,
      description: 'Users joined in last 7 days',
      gradient: 'from-teal-500 to-teal-600',
      icon: '👥',
      bgGradient: 'from-teal-50 to-teal-100',
    },
    {
      label: 'Active Users',
      value: summary.totalActiveUsersLast7Days,
      description: 'Users who sent messages',
      gradient: 'from-green-500 to-green-600',
      icon: '💬',
      bgGradient: 'from-green-50 to-green-100',
    },
    {
      label: 'Engaged Users',
      value: summary.usersActive4PlusDays,
      description: 'Active 4+ days last week',
      gradient: 'from-blue-500 to-blue-600',
      icon: '⭐',
      bgGradient: 'from-blue-50 to-blue-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`
            relative overflow-hidden bg-gradient-to-br ${card.bgGradient} 
            rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 
            transform hover:-translate-y-2 border border-gray-200
          `}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">{card.icon}</span>
              <div className={`px-3 py-1 bg-gradient-to-r ${card.gradient} text-white text-xs font-bold rounded-full`}>
                LIVE
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600 mb-2">
              {card.label}
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {card.value}
            </div>
            <div className="text-xs text-gray-600">
              {card.description}
            </div>
          </div>
          <div className={`h-1 bg-gradient-to-r ${card.gradient}`}></div>
        </div>
      ))}
    </div>
  );
};

export default Summary;
