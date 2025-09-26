import React, { useState, useRef } from 'react';
import './App.css';
import './styles/modern.css';
import './styles/brand.css';
import ImageUpload from './components/ImageUpload';
import DownloadButton from './components/DownloadButton';
import { useToast, ToastContainer } from './components/Toast';


const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('classic');
  const [bookTitle] = useState<string>('Untitled Book');
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>({});
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const toast = useToast();

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
    toast.showInfo(
      'Sample content loaded',
      'Try different templates and see how your content looks!'
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    // Only handle text files directly
    if (fileExtension === 'txt') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          // Clean the content to remove any potential encoding issues
          const cleanContent = content
            .replace(/\r\n/g, '\n') // Normalize line endings
            .replace(/\r/g, '\n')
            // eslint-disable-next-line no-control-regex
            .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '') // Remove control characters
            .trim();
            
          setText(cleanContent);
          toast.showSuccess(
            'File uploaded successfully!',
            `Loaded "${file.name}" with ${cleanContent.split('\n').length} lines.`
          );
        }
      };
      reader.readAsText(file, 'UTF-8'); // Explicitly specify UTF-8 encoding
    } else if (fileExtension === 'docx' || fileExtension === 'doc' || fileExtension === 'pdf') {
      // For binary files, show a message that they need to be converted first
      toast.showError(
        'File type not directly supported',
        `${fileExtension?.toUpperCase()} files need to be converted to text first. Please save your document as a .txt file and upload it again.`
      );
      // Clear the input
      event.target.value = '';
    } else {
      toast.showError(
        'Unsupported file type',
        'Please upload a .txt file for direct text processing.'
      );
      // Clear the input
      event.target.value = '';
    }
  };


  return (
    <div className="min-h-screen bg-[#1A1A1A] text-gray-200 flex flex-col font-sans relative">
      {/* Dark Theme Header */}
      <header className="dark-header">
        <div className="flex items-center justify-between px-8 py-5">
          <div className="flex items-center gap-3">
            {/* Brand Logo */}
            <div className="h-8 w-8 rounded-xl bg-cyan-400 grid place-items-center text-black font-extrabold">
              Ef
            </div>
            <h1 className="brand-logo">Ebook Formatter</h1>
            
            {/* Light/Dark Toggle */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 border border-gray-700 rounded-xl p-1 ml-3">
              <button className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition">Dark</button>
              <button className="px-3 py-1.5 rounded-lg hover:bg-gray-700 transition">Light</button>
            </div>
          </div>
          
          <nav className="space-x-8 text-sm font-medium">
            <button className="hover:text-cyan-400 transition">Pricing</button>
            <button className="hover:text-cyan-400 transition">Docs</button>
            <button className="hover:text-cyan-400 transition">Help</button>
            <button className="hover:text-cyan-400 transition">Login</button>
          </nav>
        </div>
      </header>

      {/* Plan Ribbon / Upgrade CTA */}
      <div className="sticky top-[68px] z-30 border-b border-gray-800 bg-gradient-to-r from-[#1E1E1E] to-[#1E1E1E]/60">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between text-sm">
          <div className="text-gray-400">
            You're on <span className="text-gray-200 font-medium">Free</span> • Pro unlocks additional templates, DOCX export, and brand presets.
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 line-through mr-1">$19</span>
            <span className="text-cyan-300">$12/mo</span>
            <button className="ml-3 px-4 py-2 rounded-xl bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Split Panel Design */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl bg-[#232323] rounded-3xl border border-gray-700 shadow-2xl p-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Left Panel - Controls */}
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white mb-6">Format Your Manuscript</h3>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">Upload File</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center w-full py-4 border-2 border-dashed border-cyan-400 rounded-xl cursor-pointer hover:border-cyan-300 transition-colors group"
                  >
                    <div className="text-center">
                      <svg className="mx-auto h-8 w-8 text-cyan-400 group-hover:text-cyan-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-cyan-400 group-hover:text-cyan-300 font-medium">Upload text file or drag & drop</p>
                      <p className="text-gray-400 text-xs mt-1">TXT files up to 10MB</p>
                    </div>
                  </label>
                  
                  <div className="text-center text-gray-400">or</div>
                  
                  <button
                    onClick={handleSampleText}
                    className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
                  >
                    Try Sample Content
                  </button>
                </div>
              </div>
              
              {/* Template Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">Choose Template</label>
                <select 
                  value={selectedTemplate} 
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                >
                  <option value="classic">Classic Literature</option>
                  <option value="modern">Modern Fiction</option>
                  <option value="elegant">Elegant Typography</option>
                  <option value="scifi">Sci-Fi Style</option>
                </select>
              </div>
              
              {/* Advanced Options Toggle */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="advanced-mode"
                  checked={showAdvanced}
                  onChange={(e) => setShowAdvanced(e.target.checked)}
                  className="w-4 h-4 text-cyan-400 bg-gray-800 border-gray-600 rounded focus:ring-cyan-400 focus:ring-2"
                />
                <label htmlFor="advanced-mode" className="text-sm font-medium text-gray-300">
                  Advanced formatting options
                </label>
              </div>
              
              {/* Download Button */}
              <div className="pt-6">
                {text.trim() ? (
                  <DownloadButton 
                    text={text}
                    templateName={selectedTemplate}
                    title={bookTitle}
                    author="Anonymous"
                  />
                ) : (
                  <button
                    disabled
                    className="w-full py-4 bg-gradient-to-r disabled:from-gray-600 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-200 disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    Upload content to continue
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Panel - Live Preview */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-600">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Live Preview</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Theme:</span>
                <span className="capitalize text-cyan-400">{selectedTemplate}</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-8 h-[600px] max-h-[600px] shadow-inner overflow-y-auto overflow-x-hidden">
              {text.trim() ? (
                <div 
                  className={`prose prose-lg max-w-none ${
                    selectedTemplate === 'classic' ? 'font-serif' : 'font-sans'
                  }`}
                  style={{
                    fontFamily: selectedTemplate === 'classic' ? 'Georgia, serif' : 
                               selectedTemplate === 'academic' ? 'Times New Roman, serif' :
                               'system-ui, sans-serif'
                  }}
                >
                  {text.split('\n').map((line, index) => {
                    // Handle empty lines as spacers
                    if (!line.trim()) {
                      return <div key={index} className="h-4"></div>;
                    }
                    
                    // Handle chapter titles
                    if (line.toLowerCase().startsWith('chapter ') || line.match(/^chapter\s+\d+/i)) {
                      return (
                        <h2 key={index} className="text-2xl font-bold mb-6 mt-8 first:mt-0 text-center text-gray-900">
                          {line}
                        </h2>
                      );
                    }
                    
                    // Handle book titles (first non-empty line or lines that look like titles)
                    if (index === 0 || (line.length < 50 && !line.includes('.') && line === line.toUpperCase())) {
                      return (
                        <h1 key={index} className="text-3xl font-bold mb-8 mt-4 text-center text-gray-900">
                          {line}
                        </h1>
                      );
                    }
                    
                    // Handle image placeholders
                    if (line.startsWith('[IMAGE:') || line.startsWith('[FULLPAGE:')) {
                      const isFullPage = line.startsWith('[FULLPAGE:');
                      const filename = line.match(/\[(?:IMAGE|FULLPAGE):(.+?)\]/)?.[1];
                      
                      if (filename && uploadedImages[filename]) {
                        return (
                          <div key={index} className={`my-6 ${isFullPage ? 'text-center' : 'inline-block mr-4 float-left'}`}>
                            <img 
                              src={uploadedImages[filename]} 
                              alt={filename}
                              className={isFullPage ? 'max-w-full h-auto mx-auto rounded-lg shadow-md' : 'w-32 h-32 object-cover rounded-lg shadow-md'}
                            />
                          </div>
                        );
                      } else {
                        return (
                          <div key={index} className={`my-4 p-4 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center ${isFullPage ? 'block' : 'inline-block mr-4 w-32'}`}>
                            <div className="text-gray-500">
                              <svg className="mx-auto h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-sm font-medium">{isFullPage ? 'Full Page' : 'Inline'} Image</p>
                              <p className="text-xs">{filename || 'Image placeholder'}</p>
                            </div>
                          </div>
                        );
                      }
                    }
                    
                    // Regular text lines
                    return (
                      <p key={index} className="mb-3 leading-relaxed text-gray-800">
                        {line}
                      </p>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <svg className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium mb-2">Your formatted book will appear here</p>
                  <p className="text-sm text-center max-w-xs">Upload your manuscript or try sample content to see the live preview</p>
                </div>
              )}
            </div>
          </div>
          
        </div>
        
        {/* Advanced Options Panel */}
        {showAdvanced && (
          <div className="w-full max-w-6xl mt-8 bg-[#2a2a2a] rounded-2xl border border-gray-600 p-8">
            <h4 className="text-xl font-bold text-white mb-6">Advanced Formatting Options</h4>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Font Size</label>
                <select className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent">
                  <option value="12pt">12pt (Standard)</option>
                  <option value="11pt">11pt (Compact)</option>
                  <option value="14pt">14pt (Large)</option>
                </select>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Line Spacing</label>
                <select className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent">
                  <option value="1.5">1.5 (Recommended)</option>
                  <option value="1.0">1.0 (Single)</option>
                  <option value="2.0">2.0 (Double)</option>
                </select>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Page Margins</label>
                <select className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent">
                  <option value="standard">Standard (1 inch)</option>
                  <option value="narrow">Narrow (0.75 inch)</option>
                  <option value="wide">Wide (1.25 inch)</option>
                </select>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Chapter Style</label>
                <select className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent">
                  <option value="centered">Centered with space</option>
                  <option value="left">Left-aligned</option>
                  <option value="decorative">Decorative headers</option>
                </select>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Text Alignment</label>
                <select className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent">
                  <option value="justified">Justified</option>
                  <option value="left">Left-aligned</option>
                  <option value="center">Centered</option>
                </select>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Page Breaks</label>
                <select className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent">
                  <option value="auto">Auto (Recommended)</option>
                  <option value="chapter">Before each chapter</option>
                  <option value="none">No page breaks</option>
                </select>
              </div>
            </div>
            
            {/* Image Upload for Advanced Mode */}
            <div className="mt-8">
              <ImageUpload 
                onImageInsert={handleImageInsert}
                disabled={false}
              />
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
