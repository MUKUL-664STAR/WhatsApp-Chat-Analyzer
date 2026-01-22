/**
 * ChartDisplay Component
 * 
 * Displays a bar chart showing daily new users and active users
 * using Chart.js and react-chartjs-2.
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.data - Chart data with labels, newUsers, and activeUsers arrays
 */

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartDisplay = ({ data }) => {
  // Chart configuration with modern styling
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Active Users (Sent Messages)',
        data: data.activeUsers,
        backgroundColor: 'rgba(37, 211, 102, 0.8)',
        borderColor: 'rgba(37, 211, 102, 1)',
        borderWidth: 3,
        borderRadius: 8,
        barThickness: 50,
        hoverBackgroundColor: 'rgba(37, 211, 102, 1)',
        shadowOffsetX: 3,
        shadowOffsetY: 3,
        shadowBlur: 10,
        shadowColor: 'rgba(37, 211, 102, 0.5)',
      },
      {
        label: 'New Users (Joined)',
        data: data.newUsers,
        backgroundColor: 'rgba(7, 94, 84, 0.8)',
        borderColor: 'rgba(7, 94, 84, 1)',
        borderWidth: 3,
        borderRadius: 8,
        barThickness: 50,
        hoverBackgroundColor: 'rgba(7, 94, 84, 1)',
        shadowOffsetX: 3,
        shadowOffsetY: 3,
        shadowBlur: 10,
        shadowColor: 'rgba(7, 94, 84, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 15,
          font: {
            size: 13,
            weight: '500',
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
          },
          usePointStyle: true,
          pointStyle: 'circle',
          color: '#303030',
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(7, 94, 84, 0.95)',
        padding: 12,
        titleFont: {
          size: 13,
          weight: '500',
        },
        bodyFont: {
          size: 12,
        },
        borderColor: 'rgba(37, 211, 102, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value} user${value !== 1 ? 's' : ''}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
          },
          callback: function (value) {
            return Number.isInteger(value) ? value : '';
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        title: {
          display: true,
          text: 'Number of Users',
          font: {
            size: 13,
            weight: '600',
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
        title: {
          display: true,
          text: 'Last 7 Days',
          font: {
            size: 13,
            weight: '600',
          },
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div className="space-y-6">
      <div className="h-96 sm:h-[450px]">
        <Bar data={chartData} options={options} />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded shadow-md flex-shrink-0"></div>
          <p className="text-sm text-gray-700">
            <strong className="text-gray-900">Green bars:</strong> Users who sent messages each day
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gradient-to-br from-teal-600 to-teal-700 rounded shadow-md flex-shrink-0"></div>
          <p className="text-sm text-gray-700">
            <strong className="text-gray-900">Teal bars:</strong> New users who joined each day
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChartDisplay;
