import React, { useState } from 'react';
import { FormattedSection } from '../utils/textFormatter';
import { exportDocument } from '../utils/exportUtility';

interface DownloadButtonProps {
  text: string;
  templateName: string;
  title: string;
  author: string;
  uploadedImages?: Record<string, string>;
  formattedSections?: FormattedSection[];
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  text, 
  templateName, 
  title, 
  author,
  uploadedImages = {},
  formattedSections
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  // Format the text if formatted sections not provided
  const getFormattedSections = (): FormattedSection[] => {
    if (formattedSections) return formattedSections;
    
    // Import lazily here to avoid circular dependencies
    const { createFormatter } = require('../utils/textFormatter');
    const formatter = createFormatter({ template: templateName });
    return formatter.formatText(text);
  };

  // Local export using the new export utility
  const localExport = async (format: 'html' | 'jsx' | 'markdown' | 'txt' | 'docx') => {
    try {
      setIsDownloading(format);
      
      // Get sections
      const sections = getFormattedSections();
      
      // Export the document with proper metadata
      await exportDocument({
        format: format as any,
        sections,
        template: templateName,
        filename: `${title.replace(/\s+/g, '-').toLowerCase()}.${format}`,
        uploadedImages,
        metadata: {
          title,
          author,
          description: `Formatted with Ebook Formatter using the ${templateName} template.`
        }
      });
      
      setIsMenuOpen(false);
    } catch (error) {
      console.error(`Error exporting as ${format}:`, error);
      alert(`Failed to export as ${format.toUpperCase()}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDownloading(null);
    }
  };

  // Server-based export for formats requiring backend processing
  const serverExport = async (format: 'epub' | 'pdf' | 'docx') => {
    try {
      setIsDownloading(format);
      
      // Use relative path for production (Vercel) or localhost for development
      const apiUrl = process.env.NODE_ENV === 'production' ? '' : (process.env.REACT_APP_API_URL || 'http://localhost:5000');
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
        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 font-semibold transform hover:scale-[1.02] shadow-lg"
      >
        Export Book
      </button>
      
      {isMenuOpen && (
        <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-lg shadow-xl border border-gray-200 z-10 overflow-hidden">
          {/* Local export options - new from TextDoc */}
          <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Client-Side Export</h3>
          </div>
          <div className="py-1">
            <button
              onClick={() => localExport('html')}
              disabled={!!isDownloading}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 flex items-center"
            >
              {isDownloading === 'html' ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                  Generating HTML...
                </span>
              ) : (
                <>
                  <span className="w-5 h-5 mr-2 text-orange-500">📄</span>
                  Download as HTML
                </>
              )}
            </button>
            
            <button
              onClick={() => localExport('markdown')}
              disabled={!!isDownloading}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 flex items-center"
            >
              {isDownloading === 'markdown' ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                  Generating Markdown...
                </span>
              ) : (
                <>
                  <span className="w-5 h-5 mr-2 text-blue-500">📝</span>
                  Download as Markdown
                </>
              )}
            </button>
            
            <button
              onClick={() => localExport('jsx')}
              disabled={!!isDownloading}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 flex items-center"
            >
              {isDownloading === 'jsx' ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                  Generating JSX...
                </span>
              ) : (
                <>
                  <span className="w-5 h-5 mr-2 text-cyan-500">⚛️</span>
                  Download as React Component
                </>
              )}
            </button>

            <button
              onClick={() => localExport('txt')}
              disabled={!!isDownloading}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 flex items-center"
            >
              {isDownloading === 'txt' ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                  Generating TXT...
                </span>
              ) : (
                <>
                  <span className="w-5 h-5 mr-2 text-gray-500">📄</span>
                  Download as TXT
                </>
              )}
            </button>
          </div>
          
          {/* Server export options - original */}
          <div className="bg-gray-50 px-3 py-2 border-b border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Server-Side Export</h3>
          </div>
          <div className="py-1">
            <button
              onClick={() => serverExport('epub')}
              disabled={!!isDownloading}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 flex items-center"
            >
              {isDownloading === 'epub' ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                  Generating EPUB...
                </span>
              ) : (
                <>
                  <span className="w-5 h-5 mr-2 text-green-500">📚</span>
                  Download as EPUB
                </>
              )}
            </button>
            
            <button
              onClick={() => serverExport('pdf')}
              disabled={!!isDownloading}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 flex items-center"
            >
              {isDownloading === 'pdf' ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                  Generating PDF...
                </span>
              ) : (
                <>
                  <span className="w-5 h-5 mr-2 text-red-500">📕</span>
                  Download as PDF
                </>
              )}
            </button>
            
            <button
              onClick={() => serverExport('docx')}
              disabled={!!isDownloading}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 flex items-center"
            >
              {isDownloading === 'docx' ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                  Generating Word...
                </span>
              ) : (
                <>
                  <span className="w-5 h-5 mr-2 text-blue-600">📘</span>
                  Download as Word (.docx)
                </>
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