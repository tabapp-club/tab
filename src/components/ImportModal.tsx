'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { config } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { Upload, Loader2 } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void; // Callback to refetch data after successful upload
}

const ImportModal = ({ isOpen, onClose, onUploadSuccess }: ImportModalProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadResult, setUploadResult] = useState<{total_records: number, total_uploaded: number} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

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
      setUploadSuccess(false); // Reset success state when new file is selected
      setUploadResult(null); // Reset upload result when new file is selected
      setUploadError(null); // Reset error state when new file is selected
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
    if (!selectedFile || !user?.accessToken) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${config.api.baseURL}/upload-csv`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.accessToken}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status: ${response.status}`);
      }

            const result = await response.json();

            setUploadSuccess(true);
      setUploadResult(result.data);

      // Call the callback to refetch data
      if (onUploadSuccess) {
        onUploadSuccess();
      }

    } catch (error: any) {
      setUploadError(error.message || 'Failed to upload file. Please try again.');
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in-0">
      <div className="bg-white rounded-xl border border-[#e9e9e9] max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e9e9e9] bg-gradient-to-r from-[#9747FF]/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#9747FF] flex items-center justify-center text-white text-lg">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-[#2a2a2f]">
                Import Customers Data
              </h3>
              <p className="text-[12px] text-[#626266] mt-0.5">
                Upload a CSV or Excel file to import customer data
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isUploading}
            className="text-[#626266] hover:text-[#2a2a2f] hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-6 py-6">

          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-[#9747FF] bg-purple-50'
                : selectedFile
                  ? uploadSuccess
                    ? 'border-green-400 bg-green-50'
                    : isUploading
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-green-300 bg-green-50'
                  : 'border-gray-300 bg-gray-50'
            }`}
          >
          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                {uploadSuccess ? <SuccessIcon /> : isUploading ? <LoadingIcon /> : <FileIcon />}
              </div>
              <div>
                <p className="text-[14px] font-medium text-[#2a2a2f]">{selectedFile.name}</p>
                <p className="text-[12px] text-gray-500">{formatFileSize(selectedFile.size)}</p>

                {/* Upload Status */}
                {isUploading && (
                  <div className="mt-3">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-[#9747FF]" />
                      <p className="text-[12px] text-[#9747FF] font-medium">Uploading...</p>
                    </div>
                  </div>
                )}

                {/* Success Result */}
                {uploadSuccess && uploadResult && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-[12px] text-green-600 font-medium">Upload completed successfully!</p>
                    </div>
                    <div className="text-[11px] text-green-700 space-y-1 text-center">
                      <p>Total records processed: <span className="font-semibold">{uploadResult.total_records}</span></p>
                      <p>Successfully uploaded: <span className="font-semibold">{uploadResult.total_uploaded}</span></p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {!uploadSuccess && (
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setUploadError(null);
                      setUploadResult(null);
                    }}
                    className="text-[12px] text-red-500 hover:text-red-700 transition-colors"
                  >
                    Remove file
                  </button>
                  {uploadError && (
                    <button
                      onClick={() => {
                        setUploadError(null);
                        // Reset states to allow re-upload
                        setUploadSuccess(false);
                        setUploadResult(null);
                      }}
                      className="text-[12px] text-[#9747FF] hover:underline transition-colors font-medium"
                    >
                      Try again
                    </button>
                  )}
                </div>
              )}

              {/* Success Actions */}
              {uploadSuccess && (
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setUploadSuccess(false);
                      setUploadResult(null);
                      setUploadError(null);
                    }}
                    className="text-[12px] text-[#9747FF] hover:underline transition-colors font-medium"
                  >
                    Upload another file
                  </button>
                </div>
              )}
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
                    className="text-[#9747FF] hover:underline"
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

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e9e9e9] mt-6">
            {uploadSuccess ? (
              <Button
                type="button"
                onClick={onClose}
                className="bg-[#9747FF] hover:bg-[#9747FF]/90 text-white text-sm rounded"
              >
                Close
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isUploading}
                  className="text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="bg-[#9747FF] hover:bg-[#9747FF]/90 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Import'
                  )}
                </Button>
              </>
            )}
          </div>
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

const SuccessIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="8" fill="#10B981" fillOpacity="0.1"/>
    <path d="M20 24L22 26L28 20" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="24" cy="24" r="16" stroke="#10B981" strokeWidth="2"/>
  </svg>
);

const LoadingIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="8" fill="#9747FF" fillOpacity="0.1"/>
    <circle cx="24" cy="24" r="16" stroke="#9747FF" strokeWidth="2" strokeDasharray="4 4" className="animate-spin"/>
  </svg>
);

export default ImportModal;
