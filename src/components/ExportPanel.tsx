import React, { useState } from 'react';
import { FormattedSection } from '../utils/textFormatter';
import { exportDocument } from '../utils/exportUtility';

interface ExportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  formattedSections: FormattedSection[];
  selectedTemplate: string;
  bookTitle: string;
  author: string;
  uploadedImages?: Record<string, string>;
}

type ExportFormat = 'html' | 'jsx' | 'markdown' | 'txt' | 'docx' | 'pdf' | 'epub';

interface ExportOption {
  format: ExportFormat;
  label: string;
  description: string;
  pro: boolean;
  available: boolean; // Client-side vs server-side
}

const exportOptions: ExportOption[] = [
  {
    format: 'html',
    label: 'HTML',
    description: 'Complete web document with embedded styles',
    pro: false,
    available: true
  },
  {
    format: 'markdown',
    label: 'Markdown',
    description: 'Plain text formatting with frontmatter',
    pro: false,
    available: true
  },
  {
    format: 'jsx',
    label: 'React Component',
    description: 'JSX component with styling objects',
    pro: false,
    available: true
  },
  {
    format: 'txt',
    label: 'Enhanced Text',
    description: 'Smart formatted plain text',
    pro: false,
    available: true
  },
  {
    format: 'pdf',
    label: 'PDF',
    description: 'Print-ready document with professional formatting',
    pro: false,
    available: false // Server-side
  },
  {
    format: 'epub',
    label: 'EPUB',
    description: 'E-book format for digital readers',
    pro: false,
    available: false // Server-side
  },
  {
    format: 'docx',
    label: 'DOCX',
    description: 'Microsoft Word document with formatting',
    pro: true,
    available: true
  }
];

const ExportPanel: React.FC<ExportPanelProps> = ({
  isOpen,
  onClose,
  text,
  formattedSections,
  selectedTemplate,
  bookTitle,
  author,
  uploadedImages = {}
}) => {
  const [selectedFormats, setSelectedFormats] = useState<ExportFormat[]>(['pdf']);
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);

  if (!isOpen) return null;

  const toggleFormat = (format: ExportFormat) => {
    setSelectedFormats(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  };

  const handleExport = async (format: ExportFormat) => {
    if (!text.trim()) {
      alert('Please upload or enter some content first!');
      return;
    }

    const option = exportOptions.find(opt => opt.format === format);
    if (option?.pro) {
      alert('This export format requires Pro. Upgrade to unlock all export formats!');
      return;
    }

    setIsExporting(format);

    try {
      if (option?.available) {
        // Client-side export using existing utilities
        await exportDocument({
          format: format as any,
          sections: formattedSections,
          template: selectedTemplate,
          filename: `${bookTitle.replace(/\s+/g, '-').toLowerCase()}.${format}`,
          uploadedImages,
          metadata: {
            title: bookTitle,
            author,
            description: `Formatted with Ebook Formatter using the ${selectedTemplate} template.`
          }
        });
      } else {
        // Server-side export (mock for now)
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
        alert(`${format.toUpperCase()} export complete! File would be downloaded in production.`);
      }
    } catch (error) {
      console.error(`Export failed for ${format}:`, error);
      alert(`Failed to export as ${format.toUpperCase()}. Please try again.`);
    } finally {
      setIsExporting(null);
    }
  };

  const handleBulkExport = async () => {
    if (selectedFormats.length === 0) {
      alert('Please select at least one format to export.');
      return;
    }

    for (const format of selectedFormats) {
      await handleExport(format);
      // Small delay between exports
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  // Calculate estimates
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const estimatedPages = Math.max(1, Math.ceil(wordCount / 250)); // ~250 words per page
  const estimatedFileSize = Math.max(0.1, (text.length / 1024 / 1024) * 1.5).toFixed(1); // Rough estimate

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto w-full max-w-6xl bg-[#1E1E1E] border-t border-gray-700 rounded-t-2xl shadow-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="font-semibold text-cyan-300">Export</h4>
            <p className="text-xs text-gray-500">Select format(s) and review estimates.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBulkExport}
              disabled={selectedFormats.length === 0 || isExporting !== null}
              className="px-4 py-2 rounded-xl bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? `Exporting ${isExporting.toUpperCase()}...` : `Download (${selectedFormats.length})`}
            </button>
            <button 
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-gray-700 text-sm hover:border-cyan-400 hover:text-cyan-300 transition"
            >
              Close
            </button>
          </div>
        </div>

        {/* Export Format Options */}
        <div className="grid gap-3 mb-6 sm:grid-cols-2 lg:grid-cols-4">
          {exportOptions.map((option) => (
            <div
              key={option.format}
              className={`relative bg-[#232323] border rounded-xl p-4 cursor-pointer transition ${\n                selectedFormats.includes(option.format)\n                  ? 'border-cyan-400 ring-2 ring-cyan-400/20'\n                  : 'border-gray-700 hover:border-gray-600'\n              }`}
              onClick={() => !option.pro && toggleFormat(option.format)}
            >
              {option.pro && (
                <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/30">
                  PRO
                </span>
              )}
              
              <div className="flex items-center justify-between mb-2">
                <h5 className={`font-medium ${\n                  option.pro ? 'text-fuchsia-300' : 'text-gray-200'\n                }`}>
                  {option.label}
                </h5>
                <div className="flex items-center gap-2">
                  {!option.available && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      SERVER
                    </span>
                  )}
                  <input
                    type="checkbox"
                    checked={selectedFormats.includes(option.format)}
                    onChange={() => toggleFormat(option.format)}
                    disabled={option.pro}
                    className="w-4 h-4 text-cyan-400 bg-gray-800 border-gray-600 rounded focus:ring-cyan-400 focus:ring-2"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400">{option.description}</p>
              
              {option.available && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExport(option.format);
                  }}
                  disabled={isExporting === option.format || option.pro}
                  className={`mt-3 w-full px-3 py-1.5 rounded-lg text-xs border transition ${\n                    option.pro\n                      ? 'border-fuchsia-500/50 text-fuchsia-300'\n                      : 'border-gray-700 hover:border-cyan-400 hover:text-cyan-300'\n                  } disabled:opacity-50`}
                >
                  {isExporting === option.format ? 'Exporting...' : option.pro ? 'Upgrade' : 'Export Now'}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Export Statistics */}
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-[#232323] border border-gray-700 rounded-xl p-4">
            <div className="text-gray-400">Estimated Pages</div>
            <div className="text-2xl font-semibold mt-1">{estimatedPages}</div>
            <div className="text-xs text-gray-500 mt-1">~{wordCount} words</div>
          </div>
          <div className="bg-[#232323] border border-gray-700 rounded-xl p-4">
            <div className="text-gray-400">Estimated File Size</div>
            <div className="text-2xl font-semibold mt-1">{estimatedFileSize} MB</div>
            <div className="text-xs text-gray-500 mt-1">Varies by format</div>
          </div>
          <div className="bg-[#232323] border border-gray-700 rounded-xl p-4">
            <div className="text-gray-400">Includes</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {['Fonts embedded','Smart formatting','Template styles'].map((feature) => (
                <span key={feature} className="px-2 py-1 rounded-md border border-gray-700 text-xs text-gray-300">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;