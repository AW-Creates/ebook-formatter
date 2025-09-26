import React, { useState, useRef, useMemo, useEffect } from 'react';
import './App.css';
import './styles/modern.css';
import './styles/brand.css';
import './styles/enhanced-templates.css';

// Import existing components and utilities
import { useToast, ToastContainer } from './components/Toast';
import { parseDocument, validateFileSize, isSupportedFileType } from './utils/documentParser';
import { createFormatter, FormattedSection } from './utils/textFormatter';
import ImageUpload from './components/ImageUpload';

// Import new modal components
import TemplateGallery from './components/TemplateGallery';
import ExportPanel from './components/ExportPanel';
import PreflightDrawer from './components/PreflightDrawer';

const App: React.FC = () => {
  // Content state (preserved from existing)
  const [text, setText] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('classic');
  const [bookTitle, setBookTitle] = useState<string>('Untitled Book');
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>({});
  const [formattedSections, setFormattedSections] = useState<FormattedSection[]>([]);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  
  // UI state (new professional modals)
  const [isGalleryOpen, setGalleryOpen] = useState(false);
  const [isExportOpen, setExportOpen] = useState(false);
  const [isPreflightOpen, setPreflightOpen] = useState(false);
  
  // Preview state
  const [viewMode, setViewMode] = useState<'ebook' | 'print'>('ebook');
  const [spreadMode, setSpreadMode] = useState<'single' | 'double'>('single');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Formatting options
  const [trimSize, setTrimSize] = useState<string>('6x9');
  const [fontPreset, setFontPreset] = useState<string>('literary-serif');
  const [marginTop, setMarginTop] = useState<number>(0.75);
  const [marginBottom, setMarginBottom] = useState<number>(0.75);
  const [marginInner, setMarginInner] = useState<number>(0.75);
  const [marginOuter, setMarginOuter] = useState<number>(0.5);
  const [showGuides, setShowGuides] = useState<{ margins: boolean; bleed: boolean; safe: boolean; baseline: boolean }>({ margins: true, bleed: false, safe: false, baseline: false });
  
  // Refs and utilities (preserved from existing)
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  
  // Enhanced text formatting with the new engine (preserved from existing)
  const formatter = useMemo(() => createFormatter({ template: selectedTemplate }), [selectedTemplate]);
  
  // Update formatted sections when text or template changes (preserved from existing)
  useMemo(() => {
    if (text.trim()) {
      const sections = formatter.formatText(text);
      setFormattedSections(sections);
    } else {
      setFormattedSections([]);
    }
  }, [text, formatter]);

  // Keyboard shortcuts: G (gallery), E (export), P (preflight)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.key.toLowerCase() === 'g') setGalleryOpen((v) => !v);
      if (e.key.toLowerCase() === 'e') setExportOpen((v) => !v);
      if (e.key.toLowerCase() === 'p') setPreflightOpen((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Existing handlers (preserved and enhanced)
  const handleImageInsert = (imageData: string, filename: string, isFullPage: boolean) => {
    setUploadedImages(prev => ({
      ...prev,
      [filename]: imageData
    }));

    const placeholder = isFullPage ? `[FULLPAGE:${filename}]` : `[IMAGE:${filename}]`;
    const beforeCursor = text.substring(0, cursorPosition);
    const afterCursor = text.substring(cursorPosition);
    const newText = beforeCursor + '\n' + placeholder + '\n' + afterCursor;
    
    setText(newText);
    const newCursorPosition = cursorPosition + placeholder.length + 2;
    setCursorPosition(newCursorPosition);
    
    toast.showSuccess(
      `${isFullPage ? 'Full-page' : 'Inline'} image added!`,
      `"${filename}" has been inserted`
    );
  };

  const handleSampleText = () => {
    const sampleText = `The Midnight Library

Chapter 1
Between Life and Death

In the space between life and death, there was a library. It stretched on infinitely, its shelves reaching heights that disappeared into shadow. The books here were not ordinary books—each one represented a different life that could have been lived.

Nora Seed found herself standing in the middle of this impossible place, her bare feet cold against the smooth floor. She wore the same hospital gown she had been wearing moments before, when the paramedics had been working on her body in the real world.

Chapter 2
The Librarian

"Welcome to the Midnight Library," said a voice behind her. Nora turned to see a woman approaching—someone who looked remarkably like her old school librarian, Mrs. Elm, except younger, more ethereal.

"This can't be real," Nora whispered, her voice echoing in the vast space.

Mrs. Elm smiled knowingly. "Reality is a flexible concept here. Each book on these shelves represents a different version of your life—a life you could have lived if you had made different choices."`;

    setText(sampleText);
    setBookTitle('The Midnight Library');
    toast.showInfo(
      'Sample content loaded',
      'Try different templates and see how your content looks!'
    );
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (preserved from existing)
    if (!isSupportedFileType(file.name)) {
      toast.showError(
        'Unsupported file type',
        'Please upload TXT, DOCX, or DOC files.'
      );
      event.target.value = '';
      return;
    }

    // Validate file size (10MB max) (preserved from existing)
    if (!validateFileSize(file, 10)) {
      toast.showError(
        'File too large',
        'Please upload files smaller than 10MB.'
      );
      event.target.value = '';
      return;
    }

    // Show loading state
    toast.showInfo(
      'Processing file...',
      'Extracting text content from your document.'
    );

    try {
      const result = await parseDocument(file);
      
      if (result.success) {
        setText(result.text);
        setBookTitle(result.fileName.replace(/\.[^/.]+$/, '') || 'Untitled Book');
        toast.showSuccess(
          'File uploaded successfully!',
          `Loaded "${result.fileName}" with ${result.wordCount} words and ${result.lineCount} lines.`
        );
      } else {
        toast.showError(
          'Failed to parse document',
          result.error || 'Unknown error occurred while processing the file.'
        );
        event.target.value = '';
      }
    } catch (error) {
      toast.showError(
        'Upload failed',
        'An unexpected error occurred while processing your file.'
      );
      event.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && fileInputRef.current) {
      // Create a fake input event
      const dt = new DataTransfer();
      dt.items.add(files[0]);
      fileInputRef.current.files = dt.files;
      
      // Trigger the upload handler
      const event = { target: { files: dt.files, value: '' } } as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(event);
    }
  };

  const handlePreview = () => {
    if (!text.trim()) {
      toast.showError('No content', 'Please upload or enter some content first!');
      return;
    }
    // Preview is already visible in the right panel
    toast.showInfo('Preview updated', 'Your formatted document is displayed in the preview panel.');
  };

  // Calculate stats
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const estimatedPages = Math.max(1, Math.ceil(wordCount / 250));
  const totalPages = Math.max(estimatedPages, 8); // Minimum 8 pages for demo

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-gray-200 flex flex-col font-sans relative">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-gray-700 bg-[#1E1E1E]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* Brand Logo */}
          <div className="h-8 w-8 rounded-xl bg-cyan-400 grid place-items-center text-black font-extrabold">Ef</div>
          <h1 className="text-2xl font-extrabold text-cyan-400 tracking-tight">Ebook Formatter</h1>
          {/* Light/Dark Toggle */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 border border-gray-700 rounded-xl p-1 ml-3">
            <button className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition">Dark</button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-gray-700 transition">Light</button>
          </div>
        </div>
        <nav className="space-x-8 text-sm font-medium">
          <a href="#" className="hover:text-cyan-400 transition">Pricing</a>
          <a href="#" className="hover:text-cyan-400 transition">Docs</a>
          <a href="#" className="hover:text-cyan-400 transition">Help</a>
          <a href="#" className="hover:text-cyan-400 transition">Login</a>
        </nav>
      </header>

      {/* Plan Ribbon */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-[#1E1E1E] to-[#1E1E1E]/60">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between text-sm">
          <div className="text-gray-400">You're on <span className="text-gray-200 font-medium">Free</span> · Pro unlocks additional templates, DOCX export, and brand presets.</div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 line-through mr-1">$19</span>
            <span className="text-cyan-300">$12/mo</span>
            <button className="ml-3 px-4 py-2 rounded-xl bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition">Upgrade to Pro</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl bg-[#232323] rounded-3xl border border-gray-700 shadow-2xl p-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Side: Upload + Options */}
          <div>
            {/* Upload Box */}
            <div 
              className="border-2 border-dashed border-cyan-400 rounded-2xl p-14 text-center hover:bg-[#272727] cursor-pointer transition" 
              aria-label="Upload manuscript"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.docx,.doc"
                onChange={handleFileUpload}
                className="hidden"
              />
              <svg className="mx-auto mb-4 h-12 w-12 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
              </svg>
              <p className="text-lg font-medium">Drag & drop your manuscript</p>
              <p className="text-sm text-gray-500 mt-1">or click to browse</p>
              <div className="mt-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleSampleText(); }}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:border-cyan-400 hover:text-cyan-300 transition"
                >
                  Use Sample Manuscript
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            {text && (
              <div className="mt-6 h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                <div className="h-2 w-full bg-cyan-400 transition-all duration-300"></div>
              </div>
            )}

            {/* Style From (Style DNA) - New professional feature */}
            <div className="mt-12 space-y-6">
              <h3 className="text-sm font-semibold text-gray-200">Style From</h3>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <input id="style-catalog" name="styleFrom" type="radio" defaultChecked className="accent-cyan-400" />
                  <label htmlFor="style-catalog" className="text-gray-300">Pick from Catalog <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-400">Inspired by</span></label>
                </div>
                <div className="flex items-center gap-2">
                  <input id="style-upload" name="styleFrom" type="radio" className="accent-cyan-400" />
                  <label htmlFor="style-upload" className="text-gray-300">Upload Reference (3–10 pages PDF) <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-400">Adaptive</span></label>
                </div>
                <div className="flex items-center gap-2">
                  <input id="style-blank" name="styleFrom" type="radio" className="accent-cyan-400" />
                  <label htmlFor="style-blank" className="text-gray-300">Start from Blank</label>
                </div>
              </div>

              {/* Similarity Slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm text-gray-400">Similarity</label>
                  <div className="text-xs text-gray-500">Exact ↔ Adaptive</div>
                </div>
                <input type="range" min="0" max="100" defaultValue="65" className="w-full accent-cyan-400" aria-label="Similarity" />
              </div>

              {/* Lock Toggles */}
              <div className="flex flex-wrap gap-2">
                {['Lock Fonts','Lock Trim','Lock Margins'].map((t)=> (
                  <button key={t} className="px-3 py-1.5 rounded-lg border border-gray-700 text-xs text-gray-300 hover:border-cyan-400 hover:text-cyan-300 transition" aria-pressed="false">{t}</button>
                ))}
              </div>

              {/* Analyze Button */}
              <button className="w-full px-4 py-3 rounded-xl border border-gray-700 text-gray-300 hover:border-cyan-400 hover:text-cyan-300 transition">Analyze style (PDF)</button>
            </div>

            {/* Formatting Options */}
            <div className="mt-12 space-y-8">
              {/* Template */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Choose Template</label>
                <div className="flex gap-3">
                  <select 
                    className="w-full bg-[#1A1A1A] border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                  >
                    <option value="classic">Classic Literature</option>
                    <option value="modern">Modern Fiction</option>
                    <option value="elegant">Elegant Typography</option>
                    <option value="scifi">Sci-Fi Style</option>
                  </select>
                  <button 
                    onClick={() => setGalleryOpen(true)} 
                    className="shrink-0 px-4 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition text-sm"
                  >
                    Gallery
                  </button>
                </div>
              </div>

              {/* Trim Size */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Trim Size</label>
                <select 
                  className="w-full bg-[#1A1A1A] border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  value={trimSize}
                  onChange={(e) => setTrimSize(e.target.value)}
                >
                  <option value="6x9">6 x 9 in (Standard Paperback)</option>
                  <option value="5.5x8.5">5.5 x 8.5 in</option>
                  <option value="8.5x11">8.5 x 11 in</option>
                </select>
              </div>

              {/* Font Presets */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Font Presets</label>
                <select 
                  className="w-full bg-[#1A1A1A] border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  value={fontPreset}
                  onChange={(e) => setFontPreset(e.target.value)}
                >
                  <option value="literary-serif">Literary Serif — (Merriweather + Source Sans)</option>
                  <option value="clean-sans">Clean Sans — (Inter + Inter)</option>
                  <option value="humanist">Humanist — (Source Serif + Source Sans)</option>
                  <option value="typewriter">Typewriter — (IBM Plex Mono + Inter)</option>
                </select>
                <p className="mt-2 text-xs text-gray-500">All fonts are open‑source and print‑safe.</p>
              </div>

              {/* Margin Controls */}
              <div>
                <label className="block text-sm text-gray-400 mb-3">Margins (in)</label>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: 'Top', value: marginTop, setter: setMarginTop },
                    { label: 'Bottom', value: marginBottom, setter: setMarginBottom },
                    { label: 'Inner', value: marginInner, setter: setMarginInner },
                    { label: 'Outer', value: marginOuter, setter: setMarginOuter },
                  ].map(({label, value, setter}) => (
                    <div key={label} className="flex items-center justify-between bg-[#1A1A1A] border border-gray-700 rounded-lg px-3 py-2">
                      <span className="text-gray-400">{label}</span>
                      <input 
                        className="w-20 bg-transparent text-right focus:outline-none" 
                        value={value} 
                        onChange={(e) => setter(parseFloat(e.target.value) || 0)}
                        type="number"
                        step="0.1"
                        min="0"
                        max="2"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Guides Toggle */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Guides</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(showGuides).map(([key, enabled]) => (
                    <button 
                      key={key} 
                      onClick={() => setShowGuides(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                      className={`px-3 py-1.5 rounded-lg border text-xs transition ${
                        enabled 
                          ? 'border-cyan-400 text-cyan-300 bg-cyan-400/10' 
                          : 'border-gray-700 text-gray-300 hover:border-cyan-400 hover:text-cyan-300'
                      }`}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Row */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <button 
                onClick={handlePreview}
                className="px-5 py-3 rounded-xl bg-cyan-400 text-black font-semibold shadow-md hover:bg-cyan-300 transition"
              >
                Preview
              </button>
              <button 
                onClick={() => setExportOpen(true)} 
                className="px-5 py-3 rounded-xl border border-cyan-400 text-cyan-400 font-semibold hover:bg-cyan-400 hover:text-black transition"
              >
                Export
              </button>
              <button className="px-5 py-3 rounded-xl border border-gray-700 text-gray-300 hover:border-cyan-400 hover:text-cyan-300 transition">
                Save Preset
              </button>
            </div>

            {/* Shortcuts */}
            <div className="mt-6 text-xs text-gray-500 text-center">
              <p>Shortcuts: <span className="text-gray-400">G</span> = Gallery, <span className="text-gray-400">P</span> = Preflight, <span className="text-gray-400">E</span> = Export</p>
            </div>

            {/* Getting Started Checklist - Only show if no content */}
            {!text.trim() && (
              <div className="mt-10 bg-[#1E1E1E] border border-gray-700 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-cyan-300">Getting Started</h4>
                  <button className="text-xs text-gray-400 hover:text-cyan-300">Hide</button>
                </div>
                <ul className="space-y-2 text-sm">
                  {[ 
                    'Upload or load the sample manuscript',
                    'Pick a template + trim size',
                    'Adjust margins and toggle guides',
                    'Preview in Ebook/Print view',
                    'Export as PDF/EPUB (Pro: DOCX)'
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1 h-4 w-4 rounded-full bg-cyan-400/20 border border-cyan-400/40"></span>
                      <span className="text-gray-300">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Side: Interactive Preview Panel */}
          <div className="bg-[#1A1A1A] rounded-2xl border border-gray-700 shadow-inner overflow-hidden flex flex-col">
            {/* Preview Toolbar */}
            <div className="flex items-center justify-between gap-3 border-b border-gray-700 px-4 py-3 bg-[#1E1E1E] sticky top-0">
              {/* View Mode Toggle */}
              <div className="inline-flex rounded-xl overflow-hidden border border-gray-700">
                <button 
                  onClick={() => setViewMode('ebook')}
                  className={`px-3 py-2 text-sm transition ${
                    viewMode === 'ebook' 
                      ? 'bg-cyan-400/20 text-cyan-300' 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  Ebook
                </button>
                <button 
                  onClick={() => setViewMode('print')}
                  className={`px-3 py-2 text-sm transition ${
                    viewMode === 'print' 
                      ? 'bg-cyan-400/20 text-cyan-300' 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  Print
                </button>
              </div>

              {/* Two-page toggle (print) */}
              {viewMode === 'print' && (
                <div className="hidden md:flex items-center gap-2 text-sm">
                  <label className="text-gray-400">Spread</label>
                  <button 
                    onClick={() => setSpreadMode('single')}
                    className={`px-3 py-2 rounded-lg border transition ${
                      spreadMode === 'single' 
                        ? 'border-cyan-400 text-cyan-300' 
                        : 'border-gray-700 hover:border-cyan-400 hover:text-cyan-300'
                    }`}
                  >
                    1-page
                  </button>
                  <button 
                    onClick={() => setSpreadMode('double')}
                    className={`px-3 py-2 rounded-lg border transition ${
                      spreadMode === 'double' 
                        ? 'border-cyan-400 text-cyan-300' 
                        : 'border-gray-700 hover:border-cyan-400 hover:text-cyan-300'
                    }`}
                  >
                    2-page
                  </button>
                </div>
              )}

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setZoomLevel(Math.max(25, zoomLevel - 25))}
                  className="h-9 w-9 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition grid place-items-center"
                >
                  –
                </button>
                <div className="px-3 py-1.5 text-sm text-gray-300 bg-[#2A2A2A] rounded-md min-w-[60px] text-center">
                  {zoomLevel}%
                </div>
                <button 
                  onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                  className="h-9 w-9 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition grid place-items-center"
                >
                  +
                </button>
                <button 
                  onClick={() => setZoomLevel(100)}
                  className="ml-2 px-3 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition text-sm"
                >
                  Fit Width
                </button>
                <button className="px-3 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition text-sm">
                  Fit Height
                </button>
                {/* Preflight toggle */}
                <button 
                  onClick={() => setPreflightOpen(true)} 
                  className="ml-2 px-3 py-2 rounded-lg border border-amber-500/50 text-amber-300 hover:border-amber-400 transition text-sm"
                >
                  Preflight
                </button>
              </div>
            </div>

            {/* Rulers */}
            <div className="relative">
              <div className="h-6 bg-[#141414] border-b border-gray-800 text-[10px] text-gray-500 flex items-end px-6 tracking-wider">0 1 2 3 4 5 6</div>
              <div className="absolute top-6 left-0 w-6 bottom-0 bg-[#141414] border-r border-gray-800 text-[10px] text-gray-500 flex flex-col items-center py-4 gap-6">0 1 2 3 4 5 6</div>
            </div>

            {/* Preview Body */}
            <div className="flex-1 grid grid-cols-6">
              {/* Thumbnails */}
              <aside className="hidden md:block col-span-1 border-r border-gray-800 bg-[#181818] overflow-y-auto p-3 space-y-3">
                {Array.from({ length: Math.min(totalPages, 20) }).map((_, i) => (
                  <div 
                    key={i} 
                    onClick={() => setCurrentPage(i + 1)}
                    className={`aspect-[3/4] w-full rounded-lg border cursor-pointer transition grid place-items-center text-xs ${
                      currentPage === i + 1 
                        ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300' 
                        : 'border-gray-700 bg-[#2A2A2A] text-gray-500 hover:border-cyan-400'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </aside>

              {/* Page Canvas */}
              <section className="col-span-6 md:col-span-5 bg-[#111111] p-6 overflow-auto preview-container">
                {text.trim() ? (
                  <div className="grid place-items-center">
                    <div 
                      className="relative w-[90%] max-w-[720px] aspect-[3/4] bg-white text-black rounded-xl shadow-2xl overflow-hidden"
                      style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center' }}
                    >
                      {/* Guides overlays */}
                      <div className="pointer-events-none absolute inset-0">
                        {showGuides.safe && (
                          <div className="absolute inset-6 border-2 border-cyan-300/40 rounded" />
                        )}
                        {showGuides.margins && (
                          <div className="absolute inset-10 border border-fuchsia-400/40 rounded" />
                        )}
                        {showGuides.bleed && (
                          <div className="absolute -inset-2 border border-amber-300/30 rounded" />
                        )}
                        {showGuides.baseline && (
                          <div className="absolute inset-0 opacity-20">
                            {Array.from({ length: 20 }).map((_, i) => (
                              <div key={i} className="h-px bg-blue-400 mb-6" />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Page gradient/curl */}
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_110%_110%,rgba(0,0,0,0.25),transparent_60%)]" />
                      
                      {/* Content */}
                      <div className="h-full w-full p-10 overflow-hidden">
                        <div 
                          className={`template-${selectedTemplate} h-full`}
                          dangerouslySetInnerHTML={{
                            __html: formatter.renderToHTML(formattedSections, uploadedImages)
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 text-xs text-gray-500 text-center">
                      <div>Page {currentPage} of {totalPages}</div>
                      <div className="mt-1">Template: <span className="capitalize">{selectedTemplate}</span></div>
                    </div>
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
              </section>
            </div>

            {/* Page Controls */}
            <div className="flex items-center justify-between border-t border-gray-800 px-4 py-3 bg-[#1E1E1E]">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Page</span>
                <input 
                  className="w-14 bg-[#2A2A2A] border border-gray-700 rounded-md px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-cyan-400" 
                  value={currentPage} 
                  onChange={(e) => {
                    const page = parseInt(e.target.value) || 1;
                    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
                  }}
                  type="number"
                  min="1"
                  max={totalPages}
                />
                <span>of {totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="px-3 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition text-sm disabled:opacity-50"
                >
                  Prev
                </button>
                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition text-sm disabled:opacity-50"
                >
                  Next
                </button>
                <button className="ml-2 px-3 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition text-sm">
                  Page Flip
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Template Gallery Modal */}
      <TemplateGallery 
        isOpen={isGalleryOpen}
        onClose={() => setGalleryOpen(false)}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={setSelectedTemplate}
      />

      {/* Export Panel */}
      <ExportPanel 
        isOpen={isExportOpen}
        onClose={() => setExportOpen(false)}
        text={text}
        formattedSections={formattedSections}
        selectedTemplate={selectedTemplate}
        bookTitle={bookTitle}
        author="Anonymous"
        uploadedImages={uploadedImages}
      />

      {/* Preflight Drawer */}
      <PreflightDrawer 
        isOpen={isPreflightOpen}
        onClose={() => setPreflightOpen(false)}
        text={text}
        selectedTemplate={selectedTemplate}
      />

      {/* Success Toast */}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />

      {/* Footer */}
      <footer className="px-8 py-8 border-t border-gray-700 text-center text-gray-500 text-sm z-10">
        © {new Date().getFullYear()} Ebook Formatter. All rights reserved.
      </footer>
    </div>
  );
};

export default App;