import React, { useState, useCallback } from 'react';
import { Upload, FileText, Loader, CheckCircle, XCircle } from 'lucide-react';
import { uploadDocument } from '../services/documentService';

const FileUpload = ({ onUploadComplete, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = async (file) => {
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload PDF, DOCX, or image files.');
      return;
    }

    setUploading(true);
    setError('');
    setProgress(0);
    setStatus('Uploading...');

    try {
      const response = await uploadDocument(file, (percent) => {
        setProgress(percent);
        if (percent === 100) {
          setStatus('Processing document...');
        }
      });

      if (response.success) {
        setStatus('Document processed successfully!');
        setTimeout(() => {
          setUploading(false);
          setProgress(0);
          setStatus('');
          if (onUploadComplete) {
            onUploadComplete(response.data);
          }
        }, 2000);
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to upload document');
      setUploading(false);
      setProgress(0);
      setStatus('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={disabled ? undefined : handleDragOver}
        onDragLeave={disabled ? undefined : handleDragLeave}
        onDrop={disabled ? undefined : handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
          isDragging && !disabled
            ? 'border-yellow-400 bg-yellow-500 bg-opacity-10 scale-[1.02]'
            : 'border-yellow-500 border-opacity-30 bg-gray-800 bg-opacity-40'
        } ${uploading || disabled ? 'pointer-events-none opacity-60' : 'hover:border-yellow-400 hover:bg-opacity-60'}`}
      >
        {!uploading ? (
          <>
            <Upload className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
            <h3 className="text-xl font-bold text-yellow-400 mb-2">
              Drop your document here
            </h3>
            <p className="text-yellow-500 text-opacity-70 mb-6">
              or click to browse files
            </p>
            <input
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.txt"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading || disabled}
            />
            <div className="flex items-center justify-center gap-2 text-sm text-yellow-500 text-opacity-50">
              <FileText className="w-4 h-4" />
              <span>Supports PDF, DOCX, Images</span>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <Loader className="w-16 h-16 mx-auto text-yellow-400 animate-spin" />
            <div className="space-y-2">
              <p className="text-yellow-400 font-semibold">{status}</p>
              {progress > 0 && progress < 100 && (
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              {progress === 100 && (
                <div className="flex items-center justify-center gap-2 text-yellow-400">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
