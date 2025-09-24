import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onFileProcessed: (text: string, filename: string, structure: any) => void;
  onError: (error: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed, onError }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    console.log('Starting file upload:', file.name, file.size);

    // Check file type
    const allowedTypes = ['.txt', '.docx', '.pdf'];
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExt)) {
      onError('Please upload a .txt, .docx, or .pdf file');
      return;
    }

    // Check file size (16MB limit)
    if (file.size > 16 * 1024 * 1024) {
      onError('File size must be less than 16MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // For development, always use localhost. For production, Vercel will set the env var
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('Uploading to:', `${apiUrl}/api/upload-document`);
      
      const response = await fetch(`${apiUrl}/api/upload-document`, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Upload success:', data);
      onFileProcessed(data.text, data.filename, data.structure);
      
    } catch (error) {
      console.error('Upload error:', error);
      onError(error instanceof Error ? error.message : 'Upload failed - check if backend is running');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-area ${dragOver ? 'drag-over' : ''} ${isUploading ? 'uploading' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.docx,.pdf"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {isUploading ? (
          <div className="upload-status">
            <div className="animate-spin w-4 h-4 border-b-2 border-blue-600 rounded-full"></div>
            <p className="text-gray-600 text-sm ml-2">Processing...</p>
          </div>
        ) : (
          <div className="upload-prompt">
            <svg className="w-5 h-5 text-gray-400 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm font-medium text-blue-600 mr-2">
              Choose File
            </span>
            <span className="text-xs text-gray-500">
              or drag & drop (.txt, .docx, .pdf)
            </span>
          </div>
        )}
      </div>

      <style>{`
        .file-upload-container {
          margin: 0.5rem 0;
        }

        .file-upload-area {
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          padding: 0.75rem 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
        }

        .file-upload-area:hover {
          border-color: #3b82f6;
          background: #f0f9ff;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        }

        .file-upload-area.drag-over {
          border-color: #3b82f6;
          background: #dbeafe;
          transform: scale(1.01);
        }

        .file-upload-area.uploading {
          border-color: #10b981;
          background: #f0fdf4;
          cursor: not-allowed;
        }

        .upload-status {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-prompt {
          color: #4b5563;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
        }

        @media (max-width: 640px) {
          .file-upload-area {
            padding: 0.75rem;
            min-height: 50px;
          }
          .upload-prompt {
            flex-direction: column;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FileUpload;