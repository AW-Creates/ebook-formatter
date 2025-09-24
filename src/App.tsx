import React, { useState, useEffect } from 'react';
import './App.css';
import { parseText } from './utils/textParser';
import { templates } from './styles/templates';
import PreviewPane from './components/PreviewPane';
import DownloadButton from './components/DownloadButton';
import FileUpload from './components/FileUpload';
import FontControls from './components/FontControls';

interface FontStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  lineHeight: string;
  letterSpacing: string;
  textAlign: string;
  marginTop: string;
  marginBottom: string;
}

const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('classic');
  const [parsedContent, setParsedContent] = useState<any[]>([]);
  const [bookTitle, setBookTitle] = useState<string>('Untitled Book');
  const [author, setAuthor] = useState<string>('Anonymous');
  const [currentView, setCurrentView] = useState<'simple' | 'advanced'>('simple');
  const [uploadError, setUploadError] = useState<string>('');
  const [documentStructure, setDocumentStructure] = useState<any>(null);
  
  // Font styles for different elements
  const [fontStyles, setFontStyles] = useState<Record<string, FontStyle>>({
    h1: {
      fontFamily: 'Georgia, serif',
      fontSize: '24px',
      fontWeight: '600',
      color: '#1a1a1a',
      lineHeight: '1.2',
      letterSpacing: '0px',
      textAlign: 'center',
      marginTop: '60px',
      marginBottom: '40px'
    },
    h2: {
      fontFamily: 'Georgia, serif',
      fontSize: '20px',
      fontWeight: '600',
      color: '#1a1a1a',
      lineHeight: '1.3',
      letterSpacing: '0px',
      textAlign: 'left',
      marginTop: '40px',
      marginBottom: '20px'
    },
    paragraph: {
      fontFamily: 'Georgia, serif',
      fontSize: '14px',
      fontWeight: '400',
      color: '#2a2a2a',
      lineHeight: '1.6',
      letterSpacing: '0px',
      textAlign: 'justify',
      marginTop: '0px',
      marginBottom: '20px'
    },
    quote: {
      fontFamily: 'Georgia, serif',
      fontSize: '14px',
      fontWeight: '400',
      color: '#555555',
      lineHeight: '1.5',
      letterSpacing: '0px',
      textAlign: 'left',
      marginTop: '20px',
      marginBottom: '20px'
    }
  });

  // Parse text whenever it changes
  useEffect(() => {
    if (text.trim()) {
      const parsed = parseText(text);
      setParsedContent(parsed);
    } else {
      setParsedContent([]);
    }
  }, [text]);

  const handleTemplateChange = (templateName: string) => {
    setSelectedTemplate(templateName);
  };

  const handleFileProcessed = (extractedText: string, filename: string, structure: any) => {
    setText(extractedText);
    setDocumentStructure(structure);
    setUploadError('');
    
    // Extract title from filename if not set
    if (bookTitle === 'Untitled Book') {
      const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
      setBookTitle(nameWithoutExt);
    }
  };

  const handleFileError = (error: string) => {
    setUploadError(error);
    setTimeout(() => setUploadError(''), 5000); // Clear error after 5 seconds
  };

  const handleFontStyleChange = (elementType: string, newStyle: FontStyle) => {
    setFontStyles(prev => ({
      ...prev,
      [elementType]: newStyle
    }));
  };

  const sampleText = `My Amazing Novel

Chapter 1
The Beginning

It was a dark and stormy night, and the old mansion stood silently against the backdrop of rolling thunder. Sarah pulled her coat tighter as she approached the imposing front door.

The wind howled through the ancient oak trees that surrounded the property, their branches creaking ominously in the darkness. She had been looking forward to this moment for months, but now that she was here, doubt began to creep into her mind.

Chapter 2
The Discovery

Inside the mansion, dust particles danced in the pale moonlight that filtered through the tall windows. Sarah's footsteps echoed in the vast hallway as she made her way toward the library.

The room was exactly as her grandmother had described it - filled with countless books that reached from floor to ceiling. But it was the old wooden desk in the center that caught her attention.`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Ebook Formatter
            </h1>
            <div className="text-sm text-gray-500">
              Format your book professionally
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="mb-6 space-y-4">
          {/* Error Display */}
          {uploadError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">{uploadError}</p>
            </div>
          )}

          {/* View Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setCurrentView('simple')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  currentView === 'simple'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Simple
              </button>
              <button
                onClick={() => setCurrentView('advanced')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  currentView === 'advanced'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Advanced
              </button>
            </div>

            {/* Document Structure Info */}
            {documentStructure && (
              <div className="text-xs text-gray-500">
                📊 {documentStructure.headings?.length || 0} headings, {documentStructure.word_count} words
              </div>
            )}
          </div>

          {/* Title and Author inputs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Book Title"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Author Name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Simple View Controls */}
          {currentView === 'simple' && (
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4">
              {/* Template Selector */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="template-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Style:
                </label>
                <select
                  id="template-select"
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="flex-1 sm:flex-initial px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(templates).map(([key, template]) => (
                    <option key={key} value={key}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {/* Sample Text Button */}
                <button
                  onClick={() => setText(sampleText)}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Load Sample
                </button>

                {/* Download Button */}
                {text.trim() && (
                  <div className="flex-1 sm:flex-initial">
                    <DownloadButton
                      text={text}
                      templateName={selectedTemplate}
                      title={bookTitle}
                      author={author}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* File Upload */}
          <FileUpload
            onFileProcessed={handleFileProcessed}
            onError={handleFileError}
          />
        </div>

        {/* Layout based on view mode */}
        {currentView === 'simple' ? (
          /* Simple Dual Pane Layout */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 min-h-[400px] lg:min-h-[600px]">
            {/* Input Pane */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                <h2 className="text-lg font-semibold text-gray-900">
                  Your Text
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Paste your book content here or upload a document.
                </p>
              </div>
              <div className="p-4">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your book content here..."
                  className="w-full h-[500px] p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>
            </div>

            {/* Preview Pane */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                <h2 className="text-lg font-semibold text-gray-900">
                  Live Preview
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  See how your book will look with the selected template
                </p>
              </div>
              <PreviewPane 
                content={parsedContent}
                template={selectedTemplate}
                customStyles={fontStyles}
              />
            </div>
          </div>
        ) : (
          /* Advanced Three-Column Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 min-h-[400px] lg:min-h-[600px]">
            {/* Input Pane */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                <h2 className="text-lg font-semibold text-gray-900">
                  Content
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Your book text
                </p>
              </div>
              <div className="p-4">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste or upload your content..."
                  className="w-full h-[450px] p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs"
                />
                
                {/* Advanced Controls */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={selectedTemplate}
                      onChange={(e) => handleTemplateChange(e.target.value)}
                      className="px-2 py-1 text-xs border border-gray-300 rounded"
                    >
                      {Object.entries(templates).map(([key, template]) => (
                        <option key={key} value={key}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                    
                    {text.trim() && (
                      <DownloadButton
                        text={text}
                        templateName={selectedTemplate}
                        title={bookTitle}
                        author={author}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Font Controls Pane */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                <h2 className="text-lg font-semibold text-gray-900">
                  Font Controls
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Customize each element
                </p>
              </div>
              <div className="p-4 h-[500px] overflow-y-auto">
                <div className="space-y-2">
                  {Object.keys(fontStyles).map(elementType => (
                    <FontControls
                      key={elementType}
                      elementType={elementType}
                      currentStyle={fontStyles[elementType]}
                      onStyleChange={handleFontStyleChange}
                    />
                  ))}
                </div>
                
                <div className="mt-6 p-3 bg-blue-50 rounded-md">
                  <p className="text-xs text-blue-700 mb-2">💡 Pro Tip:</p>
                  <p className="text-xs text-blue-600">
                    Changes apply instantly to the preview. Create your perfect custom template!
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Pane */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                <h2 className="text-lg font-semibold text-gray-900">
                  Live Preview
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Real-time formatting
                </p>
              </div>
              <PreviewPane 
                content={parsedContent}
                template={selectedTemplate}
                customStyles={fontStyles}
              />
            </div>
          </div>
        )}

        {/* Template Description */}
        {templates[selectedTemplate] && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-1">
              {templates[selectedTemplate].name} Template
            </h3>
            <p className="text-sm text-blue-700">
              {templates[selectedTemplate].description}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
