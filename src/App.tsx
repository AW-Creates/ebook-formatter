import React, { useState, useEffect } from 'react';
import './App.css';
import './styles/modern.css';
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
  const [uploadSuccess, setUploadSuccess] = useState<string>('');
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
    setUploadSuccess(`✅ Successfully loaded "${filename}"`);
    setTimeout(() => setUploadSuccess(''), 4000); // Clear success after 4 seconds
    
    // Extract title from filename if not set
    if (bookTitle === 'Untitled Book') {
      const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
      setBookTitle(nameWithoutExt);
    }
  };

  const handleFileError = (error: string) => {
    setUploadError(error);
    setUploadSuccess(''); // Clear any success message
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #f0f9ff 100%)' }}>
      {/* Modern Header */}
      <header className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div>
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-white to-blue-50 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Ebook Formatter
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  Transform manuscripts into beautiful ebooks
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-blue-100 text-sm">
                <span className="inline-flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Professional Quality
                </span>
              </div>
              <div className="text-blue-100 text-sm">
                <span className="inline-flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Instant Preview
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-4">
        {/* Modern Control Panel */}
        <div className="card mb-8 animate-fade-in">
          <div className="card-content">
            {/* Alerts */}
            {uploadError && (
              <div className="alert alert-error animate-slide-in">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{uploadError}</span>
              </div>
            )}
            
            {uploadSuccess && (
              <div className="alert alert-success animate-slide-in">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{uploadSuccess}</span>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column - Project Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Book Title</label>
                      <input
                        type="text"
                        placeholder="Enter your book title"
                        value={bookTitle}
                        onChange={(e) => setBookTitle(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Author Name</label>
                      <input
                        type="text"
                        placeholder="Enter author name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Mode & Stats */}
              <div className="lg:w-80 space-y-4">
                {/* View Toggle */}
                <div>
                  <label className="form-label">Editing Mode</label>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setCurrentView('simple')}
                      className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        currentView === 'simple'
                          ? 'bg-white text-gray-900 shadow-sm transform scale-[1.02]'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        Simple
                      </span>
                    </button>
                    <button
                      onClick={() => setCurrentView('advanced')}
                      className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        currentView === 'advanced'
                          ? 'bg-white text-gray-900 shadow-sm transform scale-[1.02]'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                        </svg>
                        Advanced
                      </span>
                    </button>
                  </div>
                </div>

                {/* Document Stats */}
                {documentStructure && (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Document Analysis
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-600">
                        <span className="font-medium">{documentStructure.word_count.toLocaleString()}</span> words
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">{documentStructure.headings?.length || 0}</span> headings
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">{documentStructure.total_lines.toLocaleString()}</span> lines
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">{documentStructure.quotes?.length || 0}</span> quotes
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <FileUpload
          onFileProcessed={handleFileProcessed}
          onError={handleFileError}
        />

        {/* Simple Mode Quick Actions */}
        {currentView === 'simple' && (
          <div className="card mb-8 animate-fade-in">
            <div className="card-header">
              <div className="card-title">Quick Actions</div>
              <div className="card-description">Choose a style template and get started</div>
            </div>
            <div className="card-content">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                {/* Template Selector */}
                <div className="flex-1">
                  <label className="form-label">Style Template</label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    className="form-input"
                  >
                    {Object.entries(templates).map(([key, template]) => (
                      <option key={key} value={key}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setText(sampleText)}
                    className="btn btn-secondary"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Load Sample
                  </button>

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
        )}

        {/* Layout based on view mode */}
        {currentView === 'simple' ? (
          /* Simple Dual Pane Layout */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            {/* Input Pane */}
            <div className="card">
              <div className="card-header">
                <div className="card-title flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Your Content
                </div>
                <div className="card-description">
                  {text.trim() ? 'Edit your content below or upload a new document.' : 'Start by typing or uploading your manuscript'}
                </div>
              </div>
              <div className="card-content pt-0">
                <div className="relative">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Start writing your story here...\n\nOr upload a document using the upload area above."
                    className="w-full min-h-[500px] max-h-[800px] p-4 border border-gray-200 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm leading-relaxed transition-all"
                    style={{ 
                      fontFamily: 'var(--font-mono, monospace)',
                      height: Math.max(500, Math.min(800, (text.split('\n').length * 24) + 100)) + 'px'
                    }}
                  />
                  <div className="absolute top-4 right-4 text-xs text-gray-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded border border-gray-200 shadow-sm">
                    {text.length} characters • {text.split('\n').length} lines
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Pane */}
            <div className="card">
              <div className="card-header">
                <div className="card-title flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Live Preview
                </div>
                <div className="card-description flex items-center justify-between">
                  <span>Real-time formatting with {templates[selectedTemplate]?.name} template</span>
                  {text.trim() && (
                    <span className="badge badge-primary">{parsedContent.length} elements</span>
                  )}
                </div>
              </div>
              <div className="card-content pt-0">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <PreviewPane 
                    content={parsedContent}
                    template={selectedTemplate}
                    customStyles={fontStyles}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Advanced Three-Column Layout */
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-in">
            {/* Input Pane */}
            <div className="card">
              <div className="card-header py-4">
                <div className="card-title flex items-center gap-2 text-base">
                  <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  Content Editor
                </div>
                <div className="card-description text-xs">
                  Raw manuscript text
                </div>
              </div>
              <div className="card-content pt-0">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your manuscript content here..."
                  className="w-full min-h-[400px] max-h-[600px] p-4 border border-gray-200 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm leading-relaxed transition-all"
                  style={{ 
                    fontFamily: 'var(--font-mono, monospace)',
                    height: Math.max(400, Math.min(600, (text.split('\n').length * 22) + 80)) + 'px'
                  }}
                />
                
                {/* Advanced Controls */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Base Template</label>
                      <select
                        value={selectedTemplate}
                        onChange={(e) => handleTemplateChange(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {Object.entries(templates).map(([key, template]) => (
                          <option key={key} value={key}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {text.trim() && (
                      <div className="flex items-end">
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
              </div>
            </div>

            {/* Font Controls Pane */}
            <div className="card">
              <div className="card-header py-4">
                <div className="card-title flex items-center gap-2 text-base">
                  <div className="w-6 h-6 bg-orange-100 rounded-md flex items-center justify-center">
                    <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9a2 2 0 00-2 2v12a4 4 0 004 4h10a2 2 0 002-2V7a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                  Typography Controls
                </div>
                <div className="card-description text-xs">
                  Fine-tune every element
                </div>
              </div>
              <div className="card-content pt-0">
                <div className="h-[500px] overflow-y-auto">
                  <div className="space-y-4">
                    {Object.keys(fontStyles).map(elementType => (
                      <FontControls
                        key={elementType}
                        elementType={elementType}
                        currentStyle={fontStyles[elementType]}
                        onStyleChange={handleFontStyleChange}
                      />
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-900 mb-1">Pro Tips</p>
                        <p className="text-xs text-blue-700">
                          All changes apply instantly to the preview. Create your perfect custom template and save it for future use!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Pane */}
            <div className="card">
              <div className="card-header py-4">
                <div className="card-title flex items-center gap-2 text-base">
                  <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
                    <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  Live Preview
                </div>
                <div className="card-description text-xs">
                  Dynamic formatting preview
                </div>
              </div>
              <div className="card-content pt-0">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <PreviewPane 
                    content={parsedContent}
                    template={selectedTemplate}
                    customStyles={fontStyles}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Template Description */}
        {templates[selectedTemplate] && (
          <div className="mt-8 card animate-fade-in">
            <div className="card-content">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9a2 2 0 00-2 2v12a4 4 0 004 4h10a2 2 0 002-2V7a2 2 0 00-2-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {templates[selectedTemplate].name} Template
                  </h3>
                  <p className="text-gray-600">
                    {templates[selectedTemplate].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
