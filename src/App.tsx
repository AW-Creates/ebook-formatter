import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import './styles/modern.css';
import './styles/brand.css';
import { parseText } from './utils/textParser';
import { templates } from './styles/templates';
import PreviewPane from './components/PreviewPane';
import DownloadButton from './components/DownloadButton';
import FileUpload from './components/FileUpload';
import FontControls from './components/FontControls';
import ImageUpload from './components/ImageUpload';
import TemplateShowcase from './components/TemplateShowcase';
import { useToast, ToastContainer } from './components/Toast';

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
  const [advancedTab, setAdvancedTab] = useState<'editor' | 'typography'>('editor');
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>({});
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [workflowStep, setWorkflowStep] = useState<'upload' | 'template' | 'customize' | 'preview' | 'export'>('upload');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const toast = useToast();
  
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
      if (workflowStep === 'upload') {
        setWorkflowStep('template');
      }
    } else {
      setParsedContent([]);
    }
  }, [text, workflowStep]);

  const handleFileProcessed = (extractedText: string, filename: string, structure: any) => {
    setText(extractedText);
    setDocumentStructure(structure);
    setUploadError('');
    setUploadSuccess('');
    
    // Extract title from filename if not set
    if (bookTitle === 'Untitled Book') {
      const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
      setBookTitle(nameWithoutExt);
    }

    // Progress workflow and show success
    setWorkflowStep('template');
    toast.showSuccess(
      'Document uploaded successfully!',
      `Loaded "${filename}" with ${extractedText.split('\n').length} lines. Choose a template next.`
    );
  };

  const handleFileError = (error: string) => {
    setUploadError(error);
    setUploadSuccess(''); 
    toast.showError('Upload failed', error);
    setTimeout(() => setUploadError(''), 5000);
  };

  const handleFontStyleChange = (elementType: string, newStyle: FontStyle) => {
    setFontStyles(prev => ({
      ...prev,
      [elementType]: newStyle
    }));
  };

  const handleCursorPositionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  const handleTextareaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setCursorPosition(target.selectionStart);
  };

  const handleImageInsert = (imageData: string, filename: string, isFullPage: boolean) => {
    // Store the image data
    setUploadedImages(prev => ({
      ...prev,
      [filename]: imageData
    }));

    // Create the appropriate placeholder
    const placeholder = isFullPage ? `[FULLPAGE:${filename}]` : `[IMAGE:${filename}]`;
    
    // Insert at cursor position
    const beforeCursor = text.substring(0, cursorPosition);
    const afterCursor = text.substring(cursorPosition);
    const newText = beforeCursor + '\n' + placeholder + '\n' + afterCursor;
    
    setText(newText);
    
    // Update cursor position to be after the inserted text
    const newCursorPosition = cursorPosition + placeholder.length + 2; // +2 for the newlines
    setCursorPosition(newCursorPosition);
    
    // Show success notification
    toast.showSuccess(
      `${isFullPage ? 'Full-page' : 'Inline'} image added!`,
      `"${filename}" has been inserted at cursor position ${cursorPosition}`
    );
    
    // Focus the textarea and set cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 100);
  };

  const handleTemplateChange = (templateName: string) => {
    setSelectedTemplate(templateName);
    toast.showInfo(
      'Template updated',
      `Switched to ${templateName} template. Check the preview to see changes.`
    );
  };

  const handleSampleText = () => {
    const sampleText = `My Amazing Novel

Chapter 1
The Beginning

It was a dark and stormy night, and the old mansion stood silently against the backdrop of rolling thunder. Sarah pulled her coat tighter as she approached the imposing front door.

The wind howled through the ancient oak trees that surrounded the property, their branches creaking ominously in the darkness. She had been looking forward to this moment for months, but now that she was here, doubt began to creep into her mind.

Chapter 2
The Discovery

Inside the mansion, dust particles danced in the pale moonlight that filtered through the tall windows. Sarah's footsteps echoed in the vast hallway as she made her way toward the library.

The room was exactly as her grandmother had described it - filled with countless books that reached from floor to ceiling. But it was the old wooden desk in the center that caught her attention.`;

    setText(sampleText);
    setWorkflowStep('template');
    setShowOnboarding(false);
    toast.showInfo(
      'Sample content loaded',
      'Try different templates and see how your content looks!'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50">
      {/* Premium Brand Header */}
      <header className="brand-header relative">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between py-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="brand-logo">Manuscript Studio</h1>
                <p className="brand-tagline">Turn raw manuscripts into publish-ready ebooks in minutes</p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-8">
              <div className="flex items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">Professional Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm font-medium">Instant Preview</span>
                </div>
              </div>
              
              <button className="btn-premium btn-outline bg-white/10 border-white/30 text-white hover:bg-white/20">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Onboarding Hero Section */}
        {showOnboarding && (
          <div className="text-center mb-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Transform Your Manuscript Into a <span className="text-purple-600">Professional Ebook</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Upload your raw manuscript and watch it transform into a beautifully formatted, 
                publish-ready ebook in minutes. No design skills required.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <button 
                  onClick={() => setShowOnboarding(false)}
                  className="btn-premium btn-primary px-8 py-4 text-lg"
                >
                  Get Started Free
                </button>
                <button 
                  onClick={handleSampleText}
                  className="btn-premium btn-outline px-8 py-4 text-lg"
                >
                  Try Sample Content
                </button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Upload Anything</h3>
                  <p className="text-gray-600">Word docs, text files, or paste directly. We'll handle the rest.</p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9a2 2 0 00-2 2v12a4 4 0 004 4h10a2 2 0 002-2V7a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Choose Template</h3>
                  <p className="text-gray-600">Professional templates for every genre and style.</p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Download Ready</h3>
                  <p className="text-gray-600">Export as PDF, EPUB, or DOCX. Ready for publishing platforms.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="premium-card mb-8">
          <div className="premium-card-header">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
              📄 Upload Your Manuscript
            </h2>
            <p className="text-gray-600">
              Start by uploading your document or pasting your content directly
            </p>
          </div>
          <div className="premium-card-content">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <FileUpload 
                  onFileProcessed={handleFileProcessed}
                  onError={handleFileError}
                />
                
                <div className="mt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Book Title
                      </label>
                      <input
                        type="text"
                        value={bookTitle}
                        onChange={(e) => setBookTitle(e.target.value)}
                        placeholder="My Amazing Novel"
                        className="premium-input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Jane Doe"
                        className="premium-input w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={handleSampleText}
                  className="btn-premium btn-outline w-full py-4"
                >
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Try with Sample Content
                  </div>
                </button>
                
                {text.trim() && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-emerald-800 mb-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Content Ready!
                    </div>
                    <div className="text-sm text-emerald-700">
                      <p><strong>{text.length.toLocaleString()}</strong> characters</p>
                      <p><strong>{text.split('\n').length.toLocaleString()}</strong> lines</p>
                      <p><strong>{parsedContent.length}</strong> content blocks detected</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Template Selection */}
        {text.trim() && (
          <div className="premium-card mb-8">
            <div className="premium-card-header">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                🎨 Choose Your Template
              </h2>
              <p className="text-gray-600">
                Select a professional template that matches your content style
              </p>
            </div>
            <div className="premium-card-content">
              <TemplateShowcase 
                selectedTemplate={selectedTemplate}
                onSelectTemplate={handleTemplateChange}
                showDescription={false}
              />
            </div>
          </div>
        )}

        {/* Content Editor and Preview */}
        {text.trim() && (
          <div className="premium-card mb-8">
            <div className="premium-card-header">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                    🚀 Edit & Preview
                  </h2>
                  <p className="text-gray-600">
                    Make final adjustments and see your formatted ebook
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setCurrentView('simple')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        currentView === 'simple'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Simple
                    </button>
                    <button
                      onClick={() => setCurrentView('advanced')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        currentView === 'advanced'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Advanced
                    </button>
                  </div>
                  
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
            <div className="premium-card-content">
              {currentView === 'simple' ? (
                /* Simple Two-Column Layout */
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Content Editor */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">Content Editor</h3>
                    <textarea
                      ref={textareaRef}
                      value={text}
                      onChange={handleCursorPositionChange}
                      onClick={handleTextareaClick}
                      onKeyUp={(e) => setCursorPosition((e.target as HTMLTextAreaElement).selectionStart)}
                      placeholder="Chapter 1\nThe Beginning\n\nIt was a dark and stormy night..."
                      className="premium-input premium-textarea w-full min-h-[400px]"
                    />
                    <div className="text-xs text-gray-500 mt-2">
                      {text.split('\n').length} lines | {text.length} characters | Cursor: {cursorPosition}
                    </div>
                    
                    {/* Image Upload */}
                    <div className="mt-4">
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">Add Images</h4>
                      <ImageUpload 
                        onImageInsert={handleImageInsert}
                        disabled={false}
                      />
                    </div>
                  </div>
                  
                  {/* Live Preview */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">Live Preview</h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                      <PreviewPane 
                        content={parsedContent}
                        template={selectedTemplate}
                        customStyles={fontStyles}
                        uploadedImages={uploadedImages}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Advanced Mode with Tabs */
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Tabbed Left Panel */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200 bg-gray-50">
                      <nav className="flex" aria-label="Tabs">
                        <button
                          onClick={() => setAdvancedTab('editor')}
                          className={`flex-1 py-3 px-4 text-center border-b-2 font-medium text-sm transition-colors ${
                            advancedTab === 'editor'
                              ? 'border-purple-500 text-purple-600 bg-white'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          Content Editor
                        </button>
                        <button
                          onClick={() => setAdvancedTab('typography')}
                          className={`flex-1 py-3 px-4 text-center border-b-2 font-medium text-sm transition-colors ${
                            advancedTab === 'typography'
                              ? 'border-purple-500 text-purple-600 bg-white'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          Typography
                        </button>
                      </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-4">
                      {advancedTab === 'editor' ? (
                        <div>
                          <textarea
                            ref={textareaRef}
                            value={text}
                            onChange={handleCursorPositionChange}
                            onClick={handleTextareaClick}
                            onKeyUp={(e) => setCursorPosition((e.target as HTMLTextAreaElement).selectionStart)}
                            className="premium-input premium-textarea w-full min-h-[300px] mb-4"
                          />
                          <div className="text-xs text-gray-500 mb-4">
                            Cursor: {cursorPosition} | Lines: {text.split('\n').length}
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-sm text-gray-900 mb-2">Add Images</h4>
                            <ImageUpload 
                              onImageInsert={handleImageInsert}
                              disabled={false}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="h-[400px] overflow-y-auto">
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
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Live Preview */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">Live Preview</h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                      <PreviewPane 
                        content={parsedContent}
                        template={selectedTemplate}
                        customStyles={fontStyles}
                        uploadedImages={uploadedImages}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Toast Notifications */}
        <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
      </main>
    </div>
  );
};

export default App;