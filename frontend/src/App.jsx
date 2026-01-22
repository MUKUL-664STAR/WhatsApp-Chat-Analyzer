/**
 * WhatsApp Chat Analyzer - Main Application Component
 * 
 * This is the root component that manages the application state and orchestrates
 * the file upload, API communication, and results display.
 * 
 * @component
 */

import React, { useState } from 'react';
import FileUpload from './components/FileUpload.jsx';
import ChartDisplay from './components/ChartDisplay.jsx';
import ActiveUsersList from './components/ActiveUsersList.jsx';
import Summary from './components/Summary.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import { decrypt } from './utils/crypto.js';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle file upload and analysis
   * @param {File} file - The uploaded chat file
   */
  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    setAnalysisData(null);

    try {
      const formData = new FormData();
      formData.append('chatFile', file);

      console.log('📤 Sending request to backend...');
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze chat file');
      }

      const result = await response.json();
      console.log('📥 Received response from backend:', result);

      // Check if data is encrypted
      if (result.encrypted && result.data) {
        console.log('🔐 Decrypting data...');
        const decryptedData = decrypt(result.data);
        console.log('✅ Decrypted data:', decryptedData);
        setAnalysisData(decryptedData.data);
      } else {
        // Fallback for unencrypted data
        console.log('📊 Using plain data');
        setAnalysisData(result.data);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error analyzing chat:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset the application state
   */
  const handleReset = () => {
    setAnalysisData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-whatsapp-dark via-whatsapp-dark to-teal-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="text-5xl">💬</div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              WhatsApp Chat Analyzer
            </h1>
          </div>
          <p className="text-lg text-teal-50 ml-16">
            Analyze your WhatsApp group chat activity and engagement
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* File Upload Section */}
          {!analysisData && !loading && (
            <FileUpload onFileUpload={handleFileUpload} />
          )}

          {/* Loading State */}
          {loading && <LoadingSpinner />}

          {/* Error State */}
          {error && (
            <ErrorMessage message={error} onDismiss={() => setError(null)} />
          )}

          {/* Results Section */}
          {analysisData && !loading && (
            <div className="space-y-8 animate-fade-in">
              {/* Summary Cards */}
              <Summary summary={analysisData.summary} />

              {/* Chart Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-3xl">📊</span>
                  Last 7 Days Activity
                </h2>
                <ChartDisplay data={analysisData.chartData} />
              </div>

              {/* Active Users List */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-3xl">⭐</span>
                  Users Active 4+ Days (Last Week)
                </h2>
                <ActiveUsersList users={analysisData.activeUsers4Plus} />
              </div>

              {/* Reset Button */}
              <div className="text-center pt-8 border-t border-gray-200">
                <button
                  onClick={handleReset}
                  className="px-8 py-3 bg-white text-whatsapp-dark font-semibold rounded-xl border-2 border-whatsapp-dark hover:bg-whatsapp-dark hover:text-white transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  Analyze Another Chat
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-gray-600 mb-2">
            Export your WhatsApp group chat and analyze user engagement patterns
          </p>
          <p className="text-sm text-gray-500">
            <strong className="text-whatsapp-primary">Privacy Note:</strong> All analysis is done locally. Your chat data is not stored or shared.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
