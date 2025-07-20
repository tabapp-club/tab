'use client';

import { useState, useRef } from 'react';

interface ImportModalProps {
  onClose: () => void;
}

const ImportModal = ({ onClose }: ImportModalProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedFileTypes = ['.csv', '.xlsx', '.xls'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const validateFile = (file: File) => {
    if (file.size > maxFileSize) {
      setUploadError('File size must be less than 10MB');
      return false;
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedFileTypes.includes(fileExtension)) {
      setUploadError('Please upload a CSV or Excel file');
      return false;
    }

    setUploadError(null);
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would typically upload the file to your server
      console.log('Uploading file:', selectedFile.name);

      // Close modal on success
      onClose();
    } catch (error) {
      setUploadError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

    return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Transparent blur background overlay */}
      <div className="fixed inset-0 backdrop-blur-setTimeout(() => {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
      }, timeout); bg-opacity-10"></div>

      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 w-full max-w-md relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-semibold text-[#2a2a2f]">Import Customers</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-[#7856FF] bg-purple-50'
              : selectedFile
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 bg-gray-50'
          }`}
        >
          {selectedFile ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <FileIcon />
              </div>
              <div>
                <p className="text-[14px] font-medium text-[#2a2a2f]">{selectedFile.name}</p>
                <p className="text-[12px] text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-[12px] text-red-500 hover:text-red-700 transition-colors"
              >
                Remove file
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <UploadIcon />
              </div>
              <div>
                <p className="text-[14px] font-medium text-[#2a2a2f] mb-1">
                  Drag and drop a file here
                </p>
                <p className="text-[12px] text-gray-500 mb-3">
                  or{' '}
                  <button
                    onClick={handleBrowseClick}
                    className="text-[#7856FF] hover:underline"
                  >
                    browse files
                  </button>
                </p>
                <p className="text-[11px] text-gray-400">
                  Supported formats: CSV, Excel (.xlsx, .xls)
                </p>
                <p className="text-[11px] text-gray-400">
                  Maximum file size: 10MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {uploadError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-[12px] text-red-600">{uploadError}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className={`flex-1 px-4 py-2 rounded-md text-[14px] font-medium transition-colors ${
              selectedFile && !isUploading
                ? 'bg-[#7856FF] text-white hover:bg-[#6B46E5]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Import'}
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedFileTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

// Icon Components
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="8" fill="#F3F4F6"/>
    <path d="M24 16V32M16 24L24 16L32 24" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FileIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="8" fill="#10B981" fillOpacity="0.1"/>
    <path d="M18 14H26L32 20V34C32 34.5523 31.5523 35 31 35H17C16.4477 35 16 34.5523 16 34V16C16 15.4477 16.4477 15 17 15Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M26 14V20H32" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default ImportModal;
