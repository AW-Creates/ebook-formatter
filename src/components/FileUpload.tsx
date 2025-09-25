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

      // Use relative path for Vercel serverless functions, fallback to localhost for development
      const isDevelopment = process.env.NODE_ENV === 'development';
      const apiUrl = isDevelopment 
        ? (process.env.REACT_APP_API_URL || 'http://localhost:5000')
        : '';
      
      const uploadUrl = isDevelopment 
        ? `${apiUrl}/api/upload-document`
        : '/api/upload-document';
      
      console.log('Uploading to:', uploadUrl);
      
      const response = await fetch(uploadUrl, {
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
    <div className="modern-upload-container">
      <div
        className={`modern-upload-area ${
          dragOver ? 'drag-active' : ''
        } ${isUploading ? 'uploading' : ''}`}
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
        
        <div className="upload-content">
          {isUploading ? (
            <div className="upload-loading">
              <div className="modern-spinner"></div>
              <h4>Processing Document</h4>
              <p>Extracting text and analyzing structure...</p>
            </div>
          ) : (
            <div className="upload-idle">
              <div className="upload-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h4>{dragOver ? 'Drop your document here' : 'Upload Document'}</h4>
              <p>
                Drag and drop your file here, or{' '}
                <span className="upload-link">browse files</span>
              </p>
              <div className="supported-formats">
                <span className="format-badge">TXT</span>
                <span className="format-badge">DOCX</span>
                <span className="format-badge">PDF</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .modern-upload-container {
          margin: var(--space-6, 1.5rem) 0;
        }

        .modern-upload-area {
          position: relative;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
          backdrop-filter: blur(12px);
          border: 2px dashed var(--gray-300, #d1d5db);
          border-radius: var(--radius-xl, 1rem);
          padding: var(--space-8, 2rem) var(--space-6, 1.5rem);
          text-align: center;
          cursor: pointer;
          transition: all var(--transition-slow, 300ms cubic-bezier(0.4, 0, 0.2, 1));
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .modern-upload-area::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
          opacity: 0;
          transition: opacity var(--transition);
          z-index: 0;
        }

        .modern-upload-area:hover {
          border-color: var(--primary-400);
          transform: translateY(-2px);
          box-shadow: var(--shadow-xl);
        }

        .modern-upload-area:hover::before {
          opacity: 0.5;
        }

        .modern-upload-area.drag-active {
          border-color: var(--primary-500);
          background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
          transform: scale(1.02);
          box-shadow: var(--shadow-2xl);
        }

        .modern-upload-area.uploading {
          border-color: var(--success-400);
          background: linear-gradient(135deg, var(--success-50) 0%, var(--success-100) 100%);
          cursor: not-allowed;
        }

        .upload-content {
          position: relative;
          z-index: 1;
        }

        .upload-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto var(--space-3, 0.75rem);
          background: linear-gradient(135deg, var(--primary-500, #0ea5e9) 0%, var(--primary-600, #0284c7) 100%);
          border-radius: var(--radius-lg, 0.75rem);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all var(--transition, 200ms);
          box-shadow: 0 2px 4px rgba(14, 165, 233, 0.2);
        }

        .modern-upload-area:hover .upload-icon {
          transform: scale(1.1) rotate(5deg);
          box-shadow: var(--shadow-lg);
        }

        .upload-icon svg {
          width: 24px;
          height: 24px;
        }

        .upload-idle h4 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--gray-900);
          margin: 0 0 var(--space-2) 0;
        }

        .upload-idle p {
          font-size: 0.875rem;
          color: var(--gray-600);
          margin: 0 0 var(--space-4) 0;
          line-height: 1.5;
        }

        .upload-link {
          color: var(--primary-600);
          font-weight: 500;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .supported-formats {
          display: flex;
          justify-content: center;
          gap: var(--space-2);
          margin-top: var(--space-4);
        }

        .format-badge {
          padding: var(--space-1) var(--space-3);
          background: var(--gray-100);
          color: var(--gray-600);
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: var(--radius);
          border: 1px solid var(--gray-200);
        }

        .upload-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .upload-loading h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--gray-900);
          margin: var(--space-4) 0 var(--space-2) 0;
        }

        .upload-loading p {
          font-size: 0.875rem;
          color: var(--gray-600);
          margin: 0;
        }

        .modern-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--gray-200);
          border-top: 3px solid var(--primary-500);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .modern-upload-area {
            padding: var(--space-8);
            margin: var(--space-4) 0;
          }
          
          .upload-icon {
            width: 48px;
            height: 48px;
          }
          
          .upload-icon svg {
            width: 24px;
            height: 24px;
          }
          
          .supported-formats {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};

export default FileUpload;