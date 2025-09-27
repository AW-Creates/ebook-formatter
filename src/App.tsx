'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css';
import './styles/modern.css';
import './styles/brand.css';
import './styles/enhanced-templates.css';

// Types
interface ManuscriptFile {
  name: string
  size: number
  type: string
  content: string
  uploadedAt: Date
}

interface FormattingSettings {
  template: string
  trimSize: string
  fontPreset: string
  margins: {
    top: number
    bottom: number
    inner: number
    outer: number
  }
  styleFrom: 'catalog' | 'upload' | 'blank'
  similarity: number
  locks: {
    fonts: boolean
    trim: boolean
    margins: boolean
  }
  guides: {
    margins: boolean
    bleed: boolean
    safeArea: boolean
    baselineGrid: boolean
  }
}

interface AppState {
  manuscript: ManuscriptFile | null
  isProcessing: boolean
  processingStep: string
  error: string | null
  previewData: any[]
  currentPage: number
  totalPages: number
  zoom: number
  viewMode: 'ebook' | 'print'
  showGuides: boolean
}

export default function EbookFormatterUI() {
  // UI state (default CLOSED per user requirements)
  const [isGalleryOpen, setGalleryOpen] = useState(false)
  const [isExportOpen, setExportOpen] = useState(false)
  const [isPreflightOpen, setPreflightOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  
  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Main application state
  const [appState, setAppState] = useState<AppState>({
    manuscript: null,
    isProcessing: false,
    processingStep: '',
    error: null,
    previewData: [],
    currentPage: 1,
    totalPages: 248,
    zoom: 100,
    viewMode: 'ebook',
    showGuides: true
  })
  
  // Formatting settings state
  const [settings, setSettings] = useState<FormattingSettings>({
    template: 'Classic Novel',
    trimSize: '6 x 9 in (Standard Paperback)',
    fontPreset: 'Literary Serif — (Merriweather + Source Sans)',
    margins: {
      top: 0.75,
      bottom: 0.75,
      inner: 0.75,
      outer: 0.5
    },
    styleFrom: 'catalog',
    similarity: 65,
    locks: {
      fonts: false,
      trim: false,
      margins: false
    },
    guides: {
      margins: true,
      bleed: true,
      safeArea: true,
      baselineGrid: false
    }
  })
  
  // Toast notification function (defined early for use in callbacks)
  const showToastNotification = useCallback((message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 4000)
  }, [])
  
  // File handling functions
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return
    
    const file = files[0]
    
    // Validate file type
    const allowedTypes = ['text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/markdown']
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|docx|md)$/i)) {
      setAppState(prev => ({ ...prev, error: 'Please select a .txt, .docx, or .md file' }))
      return
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setAppState(prev => ({ ...prev, error: 'File size must be less than 10MB' }))
      return
    }
    
    setAppState(prev => ({ 
      ...prev, 
      isProcessing: true, 
      processingStep: 'Reading file...', 
      error: null 
    }))
    
    // Read file content
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const manuscript: ManuscriptFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        content: content,
        uploadedAt: new Date()
      }
      
      setAppState(prev => ({
        ...prev,
        manuscript,
        isProcessing: false,
        processingStep: '',
        totalPages: Math.ceil(content.length / 2000) // Rough estimate
      }))
      
      showToastNotification(`${file.name} uploaded successfully!`)
    }
    
    reader.onerror = () => {
      setAppState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: 'Failed to read file' 
      }))
    }
    
    reader.readAsText(file)
  }, [showToastNotification])
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])
  
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }
  
  const loadSampleManuscript = useCallback(() => {
    const sampleContent = `Chapter 1: The Beginning

This is a sample manuscript to demonstrate the ebook formatter. It contains multiple paragraphs, chapters, and formatting elements that will be processed and formatted according to your chosen template.

The formatter handles various text elements including headings, body text, and scene breaks. Each element is styled according to professional publishing standards.

Chapter 2: The Development

As the story progresses, the formatting system maintains consistent spacing, typography, and layout throughout the document. This ensures a professional appearance in both digital and print formats.

The system supports various output formats including PDF for print and EPUB for digital distribution.`
    
    const manuscript: ManuscriptFile = {
      name: 'sample-manuscript.txt',
      size: sampleContent.length,
      type: 'text/plain',
      content: sampleContent,
      uploadedAt: new Date()
    }
    
    setAppState(prev => ({
      ...prev,
      manuscript,
      totalPages: Math.ceil(sampleContent.length / 2000)
    }))
    
    showToastNotification('Sample manuscript loaded!')
  }, [showToastNotification])
  
  // Settings update functions
  const updateSettings = useCallback((updates: Partial<FormattingSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }, [])
  
  const updateMargin = useCallback((margin: keyof FormattingSettings['margins'], value: number) => {
    setSettings(prev => ({
      ...prev,
      margins: { ...prev.margins, [margin]: value }
    }))
  }, [])
  
  const toggleLock = useCallback((lock: keyof FormattingSettings['locks']) => {
    setSettings(prev => ({
      ...prev,
      locks: { ...prev.locks, [lock]: !prev.locks[lock] }
    }))
  }, [])
  
  const toggleGuide = useCallback((guide: keyof FormattingSettings['guides']) => {
    setSettings(prev => ({
      ...prev,
      guides: { ...prev.guides, [guide]: !prev.guides[guide] }
    }))
  }, [])
  
  // Preview functions
  const updateZoom = useCallback((newZoom: number) => {
    setAppState(prev => ({ ...prev, zoom: Math.max(25, Math.min(400, newZoom)) }))
  }, [])
  
  const goToPage = useCallback((page: number) => {
    setAppState(prev => ({ 
      ...prev, 
      currentPage: Math.max(1, Math.min(prev.totalPages, page)) 
    }))
  }, [])
  
  // Keyboard shortcuts: G (gallery), E (export), P (preflight)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return
      if (e.key.toLowerCase() === 'g') setGalleryOpen((v) => !v)
      if (e.key.toLowerCase() === 'e') setExportOpen((v) => !v)
      if (e.key.toLowerCase() === 'p') setPreflightOpen((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-gray-200 flex flex-col font-sans relative">
      {/* ===== Header ===== */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-gray-700 bg-[#1E1E1E]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          {/* Brand Logo (swap with your SVG/PNG) */}
          <div className="h-8 w-8 rounded-xl bg-cyan-400 grid place-items-center text-black font-extrabold">Ef</div>
          <h1 className="text-2xl font-extrabold text-cyan-400 tracking-tight">Ebook Formatter</h1>
          {/* Light/Dark Toggle (UI only) */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 border border-gray-700 rounded-xl p-1 ml-3">
            <button className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition">Dark</button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-gray-700 transition">Light</button>
          </div>
        </div>
        <nav className="space-x-8 text-sm font-medium">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#" className="hover:text-cyan-400 transition" onClick={(e) => e.preventDefault()}>Pricing</a>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#" className="hover:text-cyan-400 transition" onClick={(e) => e.preventDefault()}>Docs</a>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#" className="hover:text-cyan-400 transition" onClick={(e) => e.preventDefault()}>Help</a>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#" className="hover:text-cyan-400 transition" onClick={(e) => e.preventDefault()}>Login</a>
        </nav>
      </header>

      {/* ===== Plan Ribbon / Upgrade CTA ===== */}
      <div className="sticky top-[68px] z-20 border-b border-gray-800 bg-gradient-to-r from-[#1E1E1E] to-[#1E1E1E]/60">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between text-sm">
          <div className="text-gray-400">You're on <span className="text-gray-200 font-medium">Free</span> · Pro unlocks additional templates, DOCX export, and brand presets.</div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 line-through mr-1">$19</span>
            <span className="text-cyan-300">$12/mo</span>
            <button className="ml-3 px-4 py-2 rounded-xl bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition">Upgrade to Pro</button>
          </div>
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl bg-[#232323] rounded-3xl border border-gray-700 shadow-2xl p-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ===== Left Side: Upload + Options ===== */}
          <div>
            {/* Upload Box */}
            <div 
              onClick={handleUploadClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition ${
                appState.manuscript 
                  ? 'border-green-400 bg-green-400/10' 
                  : appState.error 
                  ? 'border-red-400 bg-red-400/10'
                  : 'border-cyan-400 hover:bg-[#272727]'
              }`} 
              aria-label="Upload manuscript"
            >
              {appState.isProcessing ? (
                <>
                  <div className="mx-auto mb-4 h-12 w-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-lg font-medium">{appState.processingStep}</p>
                  <p className="text-sm text-gray-500 mt-1">Please wait...</p>
                </>
              ) : appState.manuscript ? (
                <>
                  <svg className="mx-auto mb-4 h-12 w-12 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-medium text-green-400">{appState.manuscript.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{(appState.manuscript.size / 1024).toFixed(1)} KB • {appState.totalPages} pages estimated</p>
                  <p className="text-xs text-gray-400 mt-2">Click to upload a different file</p>
                </>
              ) : appState.error ? (
                <>
                  <svg className="mx-auto mb-4 h-12 w-12 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-medium text-red-400">Upload Error</p>
                  <p className="text-sm text-red-300 mt-1">{appState.error}</p>
                  <p className="text-xs text-gray-400 mt-2">Click to try again</p>
                </>
              ) : (
                <>
                  <svg className="mx-auto mb-4 h-12 w-12 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                  <p className="text-lg font-medium">Drag & drop your manuscript</p>
                  <p className="text-sm text-gray-500 mt-1">or click to browse (.txt, .docx, .md)</p>
                </>
              )}
              
              {!appState.isProcessing && (
                <div className="mt-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); loadSampleManuscript(); }}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:border-cyan-400 hover:text-cyan-300 transition"
                  >
                    Use Sample Manuscript
                  </button>
                </div>
              )}
            </div>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.docx,.md,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/markdown"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />

            {/* Progress Bar */}
            {appState.isProcessing ? (
              <div className="mt-6 h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                <div className="h-2 w-full bg-cyan-400 animate-pulse"></div>
              </div>
            ) : appState.manuscript ? (
              <div className="mt-6 h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                <div className="h-2 w-full bg-green-400 transition-all duration-500"></div>
              </div>
            ) : null}

            {/* ===== Style From (Style DNA) ===== */}
            <div className="mt-12 space-y-6">
              <h3 className="text-sm font-semibold text-gray-200">Style From</h3>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <input 
                    id="style-catalog" 
                    name="styleFrom" 
                    type="radio" 
                    checked={settings.styleFrom === 'catalog'}
                    onChange={() => updateSettings({ styleFrom: 'catalog' })}
                    className="accent-cyan-400" 
                  />
                  <label htmlFor="style-catalog" className="text-gray-300">Pick from Catalog <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-400">Inspired by</span></label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    id="style-upload" 
                    name="styleFrom" 
                    type="radio" 
                    checked={settings.styleFrom === 'upload'}
                    onChange={() => updateSettings({ styleFrom: 'upload' })}
                    className="accent-cyan-400" 
                  />
                  <label htmlFor="style-upload" className="text-gray-300">Upload Reference (3–10 pages PDF) <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-400">Adaptive</span></label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    id="style-blank" 
                    name="styleFrom" 
                    type="radio" 
                    checked={settings.styleFrom === 'blank'}
                    onChange={() => updateSettings({ styleFrom: 'blank' })}
                    className="accent-cyan-400" 
                  />
                  <label htmlFor="style-blank" className="text-gray-300">Start from Blank</label>
                </div>
              </div>

              {/* Similarity Slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm text-gray-400">Similarity</label>
                  <div className="text-xs text-gray-500">Exact ↔ Adaptive ({settings.similarity}%)</div>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={settings.similarity}
                  onChange={(e) => updateSettings({ similarity: parseInt(e.target.value) })}
                  className="w-full accent-cyan-400" 
                  aria-label="Similarity" 
                />
              </div>

              {/* Lock Toggles */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Lock Fonts', key: 'fonts' as const },
                  { label: 'Lock Trim', key: 'trim' as const },
                  { label: 'Lock Margins', key: 'margins' as const }
                ].map(({ label, key }) => (
                  <button 
                    key={key}
                    onClick={() => toggleLock(key)}
                    className={`px-3 py-1.5 rounded-lg border text-xs transition ${
                      settings.locks[key] 
                        ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300' 
                        : 'border-gray-700 text-gray-300 hover:border-cyan-400 hover:text-cyan-300'
                    }`} 
                    aria-pressed={settings.locks[key]}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Analyze Button (for upload path) */}
              <button className="w-full px-4 py-3 rounded-xl border border-gray-700 text-gray-300 hover:border-cyan-400 hover:text-cyan-300 transition">Analyze style (PDF)</button>
            </div>

            {/* ===== Formatting Options ===== */}
            <div className="mt-12 space-y-8">
              {/* Template */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Choose Template</label>
                <div className="flex gap-3">
                  <select 
                    value={settings.template}
                    onChange={(e) => updateSettings({ template: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option>Classic Novel</option>
                    <option>Modern Non-Fiction</option>
                    <option>Academic</option>
                    <option>Poetry Collection</option>
                    <option>Technical Manual</option>
                  </select>
                  <button onClick={() => setGalleryOpen(true)} className="shrink-0 px-4 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition text-sm">Gallery</button>
                </div>
              </div>

              {/* Trim Size */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Trim Size</label>
                <select 
                  value={settings.trimSize}
                  onChange={(e) => updateSettings({ trimSize: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option>6 x 9 in (Standard Paperback)</option>
                  <option>5.5 x 8.5 in (Digest)</option>
                  <option>5 x 8 in (Mass Market)</option>
                  <option>7 x 10 in (Royal)</option>
                  <option>8.5 x 11 in (Letter)</option>
                  <option>6.14 x 9.21 in (A5)</option>
                </select>
              </div>

              {/* Font Presets */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Font Presets</label>
                <select 
                  value={settings.fontPreset}
                  onChange={(e) => updateSettings({ fontPreset: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option>Literary Serif — (Merriweather + Source Sans)</option>
                  <option>Clean Sans — (Inter + Inter)</option>
                  <option>Humanist — (Source Serif + Source Sans)</option>
                  <option>Typewriter — (IBM Plex Mono + Inter)</option>
                  <option>Classic — (EB Garamond + Source Sans)</option>
                  <option>Modern — (Poppins + Open Sans)</option>
                </select>
                <p className="mt-2 text-xs text-gray-500">All fonts are open‑source and print‑safe.</p>
              </div>

              {/* Margin Controls (UI only) */}
              <div>
                <label className="block text-sm text-gray-400 mb-3">Margins (in)</label>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: 'Top', key: 'top' as const },
                    { label: 'Bottom', key: 'bottom' as const },
                    { label: 'Inner', key: 'inner' as const },
                    { label: 'Outer', key: 'outer' as const },
                  ].map(({label, key}) => (
                    <div key={label} className="flex items-center justify-between bg-[#1A1A1A] border border-gray-700 rounded-lg px-3 py-2">
                      <span className="text-gray-400">{label}</span>
                      <input 
                        type="number"
                        min="0.1"
                        max="2"
                        step="0.05"
                        value={settings.margins[key]}
                        onChange={(e) => updateMargin(key, parseFloat(e.target.value) || 0.1)}
                        className="w-20 bg-transparent text-right focus:outline-none text-gray-200" 
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Guides Toggle */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Guides</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Margins', key: 'margins' as const },
                    { label: 'Bleed', key: 'bleed' as const },
                    { label: 'Safe Area', key: 'safeArea' as const },
                    { label: 'Baseline Grid', key: 'baselineGrid' as const }
                  ].map(({ label, key }) => (
                    <button 
                      key={key}
                      onClick={() => toggleGuide(key)}
                      className={`px-3 py-1.5 rounded-lg border text-xs transition ${
                        settings.guides[key] 
                          ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300' 
                          : 'border-gray-700 text-gray-300 hover:border-cyan-400 hover:text-cyan-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Row */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <button className="px-5 py-3 rounded-xl bg-cyan-400 text-black font-semibold shadow-md hover:bg-cyan-300 transition">Preview</button>
              <button onClick={() => setExportOpen(true)} className="px-5 py-3 rounded-xl border border-cyan-400 text-cyan-400 font-semibold hover:bg-cyan-400 hover:text-black transition">Export</button>
              <button className="px-5 py-3 rounded-xl border border-gray-700 text-gray-300 hover:border-cyan-400 hover:text-cyan-300 transition">Save Preset</button>
            </div>

            {/* Shortcuts */}
            <div className="mt-6 text-xs text-gray-500 text-center">
              <p>Shortcuts: <span className="text-gray-400">G</span> = Gallery, <span className="text-gray-400">P</span> = Preflight, <span className="text-gray-400">E</span> = Export</p>
            </div>

            {/* Onboarding Checklist */}
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
          </div>

          {/* ===== Right Side: Interactive Preview Panel ===== */}
          <div className="bg-[#1A1A1A] rounded-2xl border border-gray-700 shadow-inner overflow-hidden flex flex-col">
            {/* Preview Toolbar */}
            <div className="flex items-center justify-between gap-3 border-b border-gray-700 px-4 py-3 bg-[#1E1E1E] sticky top-0">
              {/* View Mode Toggle */}
              <div className="inline-flex rounded-xl overflow-hidden border border-gray-700">
                <button 
                  onClick={() => setAppState(prev => ({ ...prev, viewMode: 'ebook' }))}
                  className={`px-3 py-2 text-sm transition ${
                    appState.viewMode === 'ebook' 
                      ? 'bg-cyan-400/20 text-cyan-300' 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  Ebook
                </button>
                <button 
                  onClick={() => setAppState(prev => ({ ...prev, viewMode: 'print' }))}
                  className={`px-3 py-2 text-sm transition ${
                    appState.viewMode === 'print' 
                      ? 'bg-cyan-400/20 text-cyan-300' 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  Print
                </button>
              </div>

              {/* Two-page toggle (print) */}
              <div className="hidden md:flex items-center gap-2 text-sm">
                <label className="text-gray-400">Spread</label>
                <button className="px-3 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition">1-page</button>
                <button className="px-3 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition">2-page</button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => updateZoom(appState.zoom - 25)}
                  className="h-9 w-9 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition grid place-items-center"
                >
                  –
                </button>
                <div className="px-3 py-1.5 text-sm text-gray-300 bg-[#2A2A2A] rounded-md">{appState.zoom}%</div>
                <button 
                  onClick={() => updateZoom(appState.zoom + 25)}
                  className="h-9 w-9 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition grid place-items-center"
                >
                  +
                </button>
                <button 
                  onClick={() => updateZoom(100)}
                  className="ml-2 px-3 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition text-sm"
                >
                  Fit Width
                </button>
                <button 
                  onClick={() => updateZoom(75)}
                  className="px-3 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition text-sm"
                >
                  Fit Height
                </button>
                {/* Preflight toggle */}
                <button onClick={() => setPreflightOpen(true)} className="ml-2 px-3 py-2 rounded-lg border border-amber-500/50 text-amber-300 hover:border-amber-400 transition text-sm">Preflight</button>
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
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] w-full bg-[#2A2A2A] rounded-lg border border-gray-700 hover:border-cyan-400 transition grid place-items-center text-xs text-gray-500">
                    {i + 1}
                  </div>
                ))}
              </aside>

              {/* Page Canvas + Guides + Compare */}
              <section className="col-span-6 md:col-span-5 bg-[#111111] p-6 overflow-auto">
                <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-2">
                  {/* Left Preview (Current Template) */}
                  <div className="grid place-items-center">
                    <div className="relative w-[90%] max-w-[720px] aspect-[3/4] bg-white text-black rounded-xl shadow-2xl overflow-hidden">
                      {/* Guides overlays (UI only) */}
                      <div className="pointer-events-none absolute inset-0">
                        {/* Safe area */}
                        <div className="absolute inset-6 border-2 border-cyan-300/40 rounded" />
                        {/* Margin box */}
                        <div className="absolute inset-10 border border-fuchsia-400/40 rounded" />
                        {/* Bleed */}
                        <div className="absolute -inset-2 border border-amber-300/30 rounded" />
                      </div>
                      {/* Page gradient/curl */}
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_110%_110%,rgba(0,0,0,0.25),transparent_60%)]" />
                      <div className="h-full w-full p-10 overflow-hidden">
                        <h3 className="font-serif text-xl mb-2">Chapter 1 · The Predator's Smile</h3>
                        <p className="text-[13px] leading-6 text-gray-800 line-clamp-[14]">
                          Interactive preview placeholder. Use the toolbar to switch modes, spreads, zoom, and fit. Guides above illustrate margins, bleed, and safe areas.
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">Current Template</div>
                    {/* Delta chips */}
                    <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                      {['Leading +6%','Margins −0.1in','Drop caps: on'].map((d)=> (
                        <span key={d} className="px-2 py-1 rounded-md bg-gray-800 border border-gray-700 text-gray-300">{d}</span>
                      ))}
                    </div>
                  </div>

                  {/* Right Preview (Compare Template) */}
                  <div className="grid place-items-center">
                    <div className="relative w-[90%] max-w-[720px] aspect-[3/4] bg-white text-black rounded-xl shadow-2xl overflow-hidden">
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_110%_110%,rgba(0,0,0,0.25),transparent_60%)]" />
                      <div className="absolute left-3 top-3 text-[10px] bg-black/60 text-white px-2 py-1 rounded">Compare: Classic YA Serif (Inspired by)</div>
                      <div className="h-full w-full p-10 overflow-hidden">
                        <h3 className="font-serif text-xl mb-2">Chapter 1 · The Predator's Smile</h3>
                        <p className="text-[13px] leading-6 text-gray-800 line-clamp-[14]">
                          Side-by-side compare mock. Adaptive style-match preserves feel while honoring your chosen trim and fonts (unless locked).
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">Compare Template</div>
                    <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                      {['Font → EB Garamond','Running heads: title|author','Scene break: ⁘'].map((d)=> (
                        <span key={d} className="px-2 py-1 rounded-md bg-gray-800 border border-gray-700 text-gray-300">{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Page Controls */}
            <div className="flex items-center justify-between border-t border-gray-800 px-4 py-3 bg-[#1E1E1E]">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Page</span>
                <input 
                  type="number"
                  min="1"
                  max={appState.totalPages}
                  value={appState.currentPage}
                  onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                  className="w-14 bg-[#2A2A2A] border border-gray-700 rounded-md px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-200" 
                />
                <span>of {appState.totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => goToPage(appState.currentPage - 1)}
                  disabled={appState.currentPage <= 1}
                  className="px-3 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <button 
                  onClick={() => goToPage(appState.currentPage + 1)}
                  disabled={appState.currentPage >= appState.totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
                <button 
                  onClick={() => showToastNotification('Page flip animation coming soon!')}
                  className="ml-2 px-3 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition text-sm"
                >
                  Page Flip
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ===== Template Gallery Modal ===== */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 modal-overlay" onClick={(e) => e.target === e.currentTarget && setGalleryOpen(false)}>
          <div className="w-full max-w-5xl max-h-[90vh] bg-[#1E1E1E] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col modal-content">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-cyan-300">Template Gallery</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Some templates require <span className="text-gray-200 font-medium">Pro</span></span>
                <button className="text-sm px-3 py-1.5 rounded-lg bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition">Upgrade</button>
                <button onClick={() => setGalleryOpen(false)} className="text-sm px-3 py-1.5 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition">Close</button>
              </div>
            </div>
            <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto flex-1 modal-scroll">
              {[
                { name: 'Classic YA Serif', tag: 'Inspired by classic children/YA serif', pro: false },
                { name: 'Modern Non-Fiction', tag: 'Inspired by clean sans layouts', pro: false },
                { name: 'Academic Notes', tag: 'Inspired by scholarly formats', pro: true },
                { name: 'Memoir Humanist', tag: 'Inspired by humanist hybrids', pro: false },
                { name: 'Poetry Wide', tag: 'Inspired by poetry spreads', pro: true },
                { name: 'Short Stories', tag: 'Inspired by lit mags', pro: true },
              ].map((t) => (
                <div key={t.name} className="bg-[#232323] border border-gray-700 rounded-xl overflow-hidden hover:border-cyan-400 transition">
                  <div className="relative aspect-[3/4] bg-[#111111] grid place-items-center text-gray-500">
                    Preview
                    {t.pro && (
                      <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/30">PRO</span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{t.name}</div>
                        <div className="text-[10px] text-gray-500">{t.tag}</div>
                      </div>
                      <button className={`${t.pro ? 'border-fuchsia-500/50 text-fuchsia-300 hover:border-fuchsia-400 hover:text-fuchsia-200' : 'border-gray-700 hover:border-cyan-400 hover:text-cyan-300'} px-3 py-1.5 rounded-lg text-sm border transition`}>{t.pro ? 'Unlock Pro' : 'Use'}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== Export Panel (bottom sheet) ===== */}
      {isExportOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-[55] bg-black/40 backdrop-blur-sm modal-overlay" onClick={(e) => e.target === e.currentTarget && setExportOpen(false)}>
          <div className="mx-auto w-full max-w-6xl bg-[#1E1E1E] border-t border-gray-700 rounded-t-2xl shadow-2xl p-6 m-4 mb-0 modal-content">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="font-semibold text-cyan-300">Export</h4>
                <p className="text-xs text-gray-500">Select format(s) and review estimates.</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                {['PDF','EPUB','DOCX'].map((fmt) => (
                  <button key={fmt} className={`px-3 py-1.5 rounded-lg border transition ${fmt === 'DOCX' ? 'border-fuchsia-500/50 text-fuchsia-300 hover;border-fuchsia-400 hover:text-fuchsia-200' : 'border-gray-700 hover:border-cyan-400 hover:text-cyan-300'}`}>{fmt === 'DOCX' ? 'DOCX · Pro' : fmt}</button>
                ))}
                <button className="px-4 py-2 rounded-xl bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition">Download</button>
                <button onClick={() => setExportOpen(false)} className="px-3 py-1.5 rounded-lg border border-gray-700 text-sm hover:border-cyan-400 hover:text-cyan-300 transition">Close</button>
              </div>
            </div>
            <div className="mt-4 grid sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-[#232323] border border-gray-700 rounded-xl p-4">
                <div className="text-gray-400">Estimated Pages</div>
                <div className="text-2xl font-semibold mt-1">248</div>
              </div>
              <div className="bg-[#232323] border border-gray-700 rounded-xl p-4">
                <div className="text-gray-400">Estimated File Size</div>
                <div className="text-2xl font-semibold mt-1">3.4 MB</div>
              </div>
              <div className="bg-[#232323] border border-gray-700 rounded-xl p-4">
                <div className="text-gray-400">Includes</div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {['Fonts embedded','Hyperlinked TOC','Bleed (print)'].map((i)=> (
                    <span key={i} className="px-2 py-1 rounded-md border border-gray-700 text-xs text-gray-300">{i}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Preflight Drawer ===== */}
      {isPreflightOpen && (
        <>
          <div className="fixed inset-0 z-[50] bg-black/40 backdrop-blur-sm" onClick={() => setPreflightOpen(false)}></div>
          <aside className="fixed right-0 top-[112px] bottom-0 w-full sm:w-[380px] z-[55] bg-[#1E1E1E] border-l border-gray-700 shadow-2xl p-5 overflow-y-auto modal-content modal-scroll" aria-label="Preflight">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-amber-300">Preflight</h4>
            <button onClick={() => setPreflightOpen(false)} className="text-xs px-2 py-1 rounded-lg border border-gray-700 text-gray-300 hover:border-cyan-400 hover:text-cyan-300 transition">Close</button>
          </div>
          <p className="mt-1 text-xs text-gray-500">We scan pages for common print issues and suggest quick fixes.</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="bg-[#232323] border border-gray-700 rounded-lg p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-gray-200">Widows/Orphans</div>
                  <div className="text-xs text-gray-500">12 paragraphs affected</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-2 py-1 rounded-md border border-gray-700 text-xs text-gray-300 hover:border-cyan-400">Fix</button>
                  <button className="px-2 py-1 rounded-md border border-gray-700 text-xs text-gray-300 hover:border-cyan-400">Explain</button>
                </div>
              </div>
            </li>
            <li className="bg-[#232323] border border-gray-700 rounded-lg p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-gray-200">Hyphenation Density</div>
                  <div className="text-xs text-gray-500">High on pages 34–37</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-2 py-1 rounded-md border border-gray-700 text-xs text-gray-300 hover:border-cyan-400">Balance Rag</button>
                  <button className="px-2 py-1 rounded-md border border-gray-700 text-xs text-gray-300 hover:border-cyan-400">Add Soft Hyphens</button>
                </div>
              </div>
            </li>
            <li className="bg-[#232323] border border-gray-700 rounded-lg p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-gray-200">Image Bleed</div>
                  <div className="text-xs text-gray-500">2 images beyond safe area</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-2 py-1 rounded-md border border-gray-700 text-xs text-gray-300 hover:border-cyan-400">Auto-fit</button>
                  <button className="px-2 py-1 rounded-md border border-gray-700 text-xs text-gray-300 hover:border-cyan-400">Show Guides</button>
                </div>
              </div>
            </li>
          </ul>
        </aside>
        </>
      )}

      {/* ===== Toast Notification ===== */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-[70]" aria-live="polite">
          <div className="bg-[#1E1E1E] border border-gray-700 rounded-xl shadow-xl px-4 py-3 flex items-start gap-3 toast-notification">
            <div className="h-6 w-6 rounded-full bg-cyan-400/20 border border-cyan-400/40 grid place-items-center">
              <span className="text-cyan-300 text-sm">✓</span>
            </div>
            <div className="text-sm">
              <div className="text-gray-100 font-medium">{toastMessage}</div>
            </div>
            <button 
              onClick={() => setShowToast(false)}
              className="ml-2 text-gray-400 hover:text-gray-200 transition"
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* ===== Footer ===== */}
      <footer className="px-8 py-8 border-t border-gray-700 text-center text-gray-500 text-sm z-10">
        © {new Date().getFullYear()} Ebook Formatter. All rights reserved.
      </footer>

      {/* Note: Swap favicon via <link rel="icon" ...> in your app's HTML head. */}

      {/**
       * === Jest + React Testing Library (create __tests__/EbookFormatterUI.test.tsx) ===
       *
       * import { render, screen, fireEvent } from '@testing-library/react'
       * import '@testing-library/jest-dom'
       * import EbookFormatterUI from '../src/components/EbookFormatterUI'
       *
       * test('renders header and actions', () => {
       *   render(<EbookFormatterUI />)
       *   expect(screen.getByText(/Ebook Formatter/i)).toBeInTheDocument()
       *   expect(screen.getByText(/Upgrade to Pro/i)).toBeInTheDocument()
       *   expect(screen.getByText(/Export/i)).toBeInTheDocument()
       * })
       *
       * test('gallery and export are closed by default', () => {
       *   render(<EbookFormatterUI />)
       *   expect(screen.queryByText(/Template Gallery/i)).not.toBeInTheDocument()
       *   expect(screen.queryByText(/^Export$/i)).not.to.BeInTheDocument()
       * })
       *
       * test('opens gallery via button and closes it', () => {
       *   render(<EbookFormatterUI />)
       *   fireEvent.click(screen.getByText(/Gallery/i))
       *   expect(screen.getByText(/Template Gallery/i)).toBeInTheDocument()
       *   fireEvent.click(screen.getByText(/^Close$/))
       *   expect(screen.queryByText(/Template Gallery/i)).not.toBeInTheDocument()
       * })
       *
       * test('opens export via button and closes it', () => {
       *   render(<EbookFormatterUI />)
       *   fireEvent.click(screen.getByText(/^Export$/))
       *   // Panel has Download + Close
       *   expect(screen.getByText(/Download/i)).toBeInTheDocument()
       *   fireEvent.click(screen.getByText(/^Close$/))
       *   expect(screen.queryByText(/Download/i)).not.toBeInTheDocument()
       * })
       *
       * test('preflight is closed by default and opens from toolbar', () => {
       *   render(<EbookFormatterUI />)
       *   expect(screen.queryByLabelText(/Preflight/i)).not.toBeInTheDocument()
       *   fireEvent.click(screen.getByText(/^Preflight$/))
       *   expect(screen.getByLabelText(/Preflight/i)).toBeInTheDocument()
       * })
       */}
    </div>
  )
}
