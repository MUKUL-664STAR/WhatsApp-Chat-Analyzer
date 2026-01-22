/**
 * FileUpload Component
 * 
 * Handles file selection and upload with drag-and-drop support.
 * Validates file type and provides user instructions.
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onFileUpload - Callback function when file is uploaded
 */

import React, { useState, useRef } from 'react';

const FileUpload = ({ onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  /**
   * Handle file selection
   * @param {File} file - Selected file
   */
  const handleFileSelect = (file) => {
    // Validate file type
    if (file && file.type === 'text/plain') {
      setSelectedFile(file);
    } else {
      alert('Please select a valid text file (.txt)');
    }
  };

  /**
   * Handle file input change
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  /**
   * Handle drag over event
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  /**
   * Handle drag leave event
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  /**
   * Handle file drop
   */
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  /**
   * Handle upload button click
   */
  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  /**
   * Trigger file input click
   */
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div
        className={`
          relative bg-white rounded-2xl shadow-xl p-8 sm:p-12 
          border-2 border-dashed transition-all duration-300 cursor-pointer
          ${dragOver 
            ? 'border-whatsapp-primary bg-green-50 scale-[1.02]' 
            : 'border-gray-300 hover:border-whatsapp-primary hover:shadow-2xl'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && handleClick()}
      >
        <div className="text-center">
          <div className="text-7xl mb-6 animate-bounce">{dragOver ? '📥' : '📁'}</div>
          <p className="text-xl font-semibold text-gray-800 mb-2">
            {selectedFile
              ? `Selected: ${selectedFile.name}`
              : 'Click to select or drag and drop your WhatsApp chat file'}
          </p>
          <p className="text-sm text-gray-500">Accepts .txt files only (Max 10MB)</p>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,text/plain"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload chat file"
        />
      </div>

      {selectedFile && (
        <div className="mt-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 flex items-center justify-between border border-green-200">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📄</div>
            <div>
              <p className="font-semibold text-gray-800">{selectedFile.name}</p>
              <p className="text-sm text-gray-600">
                Size: {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button
            onClick={handleUpload}
            className="px-6 py-3 bg-gradient-to-r from-whatsapp-primary to-green-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Analyze Chat 🚀
          </button>
        </div>
      )}

      <div className="mt-8 bg-white rounded-xl p-6 border-l-4 border-whatsapp-primary shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">📋</span>
          How to export your WhatsApp chat:
        </h3>
        <ol className="space-y-2 text-gray-700 ml-6 list-decimal">
          <li>Open the WhatsApp group chat you want to analyze</li>
          <li>Tap on the group name at the top</li>
          <li>Scroll down and select <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-whatsapp-dark">"Export chat"</code></li>
          <li>Choose <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-whatsapp-dark">"Without Media"</code></li>
          <li>Save the file and upload it here</li>
        </ol>
      </div>
    </div>
  );
};

export default FileUpload;
