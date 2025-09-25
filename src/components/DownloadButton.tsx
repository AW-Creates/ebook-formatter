import React, { useState } from 'react';

interface DownloadButtonProps {
  text: string;
  templateName: string;
  title: string;
  author: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  text, 
  templateName, 
  title, 
  author 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const downloadFile = async (format: 'epub' | 'pdf' | 'docx') => {
    try {
      setIsDownloading(format);
      
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/generate-${format}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          template_name: templateName,
          title,
          author
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to generate ${format.toUpperCase()}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // For mock server, just show success message
        alert(`✅ ${result.message}\nFilename: ${result.filename}\n\nNote: This is a demo - actual file download would happen in production.`);
      } else {
        throw new Error(result.message || `Failed to generate ${format.toUpperCase()}`);
      }
      
      setIsMenuOpen(false);
    } catch (error) {
      console.error(`Error downloading ${format}:`, error);
      alert(`Failed to download ${format.toUpperCase()}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
      >
        Download Book
      </button>
      
      {isMenuOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
          <div className="py-1">
            <button
              onClick={() => downloadFile('epub')}
              disabled={isDownloading === 'epub'}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              {isDownloading === 'epub' ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                  Generating EPUB...
                </span>
              ) : (
                'Download as EPUB'
              )}
            </button>
            
            <button
              onClick={() => downloadFile('pdf')}
              disabled={isDownloading === 'pdf'}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              {isDownloading === 'pdf' ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                  Generating PDF...
                </span>
              ) : (
                'Download as PDF'
              )}
            </button>
            
            <button
              onClick={() => downloadFile('docx')}
              disabled={isDownloading === 'docx'}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              {isDownloading === 'docx' ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                  Generating Word...
                </span>
              ) : (
                'Download as Word (.docx)'
              )}
            </button>
          </div>
        </div>
      )}
      
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default DownloadButton;