'use client'
import { useState, useEffect } from 'react'
import './App.css';
import './styles/modern.css';
import './styles/brand.css';
import './styles/enhanced-templates.css';

export default function EbookFormatterUI() {
  // UI state (default CLOSED per user requirements)
  const [isGalleryOpen, setGalleryOpen] = useState(false)
  const [isExportOpen, setExportOpen] = useState(false)
  const [isPreflightOpen, setPreflightOpen] = useState(false)

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
      <header className="flex items-center justify-between px-8 py-5 border-b border-gray-700 bg-[#1E1E1E]/80 backdrop-blur-md sticky top-0 z-40">
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
          <button className="hover:text-cyan-400 transition">Pricing</button>
          <button className="hover:text-cyan-400 transition">Docs</button>
          <button className="hover:text-cyan-400 transition">Help</button>
          <button className="hover:text-cyan-400 transition">Login</button>
        </nav>
      </header>

      {/* ===== Plan Ribbon / Upgrade CTA ===== */}
      <div className="sticky top-[68px] z-30 border-b border-gray-800 bg-gradient-to-r from-[#1E1E1E] to-[#1E1E1E]/60">
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
            <div className="border-2 border-dashed border-cyan-400 rounded-2xl p-14 text-center hover:bg-[#272727] cursor-pointer transition" aria-label="Upload manuscript">
              <svg className="mx-auto mb-4 h-12 w-12 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
              </svg>
              <p className="text-lg font-medium">Drag & drop your manuscript</p>
              <p className="text-sm text-gray-500 mt-1">or click to browse</p>
              <div className="mt-4">
                <button className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:border-cyan-400 hover:text-cyan-300 transition">
                  Use Sample Manuscript
                </button>
              </div>
            </div>

            {/* Progress Bar Placeholder */}
            <div className="mt-6 h-2 w-full bg-gray-700 rounded-full overflow-hidden" aria-hidden>
              <div className="h-2 w-1/3 bg-cyan-400 animate-pulse"></div>
            </div>

            {/* ===== Style From (Style DNA) ===== */}
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

              {/* Analyze Button (for upload path) */}
              <button className="w-full px-4 py-3 rounded-xl border border-gray-700 text-gray-300 hover:border-cyan-400 hover:text-cyan-300 transition">Analyze style (PDF)</button>
            </div>

            {/* ===== Formatting Options ===== */}
            <div className="mt-12 space-y-8">
              {/* Template */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Choose Template</label>
                <div className="flex gap-3">
                  <select className="w-full bg-[#1A1A1A] border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400">
                    <option>Classic Novel</option>
                    <option>Modern Non-Fiction</option>
                    <option>Academic</option>
                  </select>
                  <button onClick={() => setGalleryOpen(true)} className="shrink-0 px-4 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition text-sm">Gallery</button>
                </div>
              </div>

              {/* Trim Size */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Trim Size</label>
                <select className="w-full bg-[#1A1A1A] border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400">
                  <option>6 x 9 in (Standard Paperback)</option>
                  <option>5.5 x 8.5 in</option>
                  <option>8.5 x 11 in</option>
                </select>
              </div>

              {/* Font Presets */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Font Presets</label>
                <select className="w-full bg-[#1A1A1A] border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400">
                  <option>Literary Serif — (Merriweather + Source Sans)</option>
                  <option>Clean Sans — (Inter + Inter)</option>
                  <option>Humanist — (Source Serif + Source Sans)</option>
                  <option>Typewriter — (IBM Plex Mono + Inter)</option>
                </select>
                <p className="mt-2 text-xs text-gray-500">All fonts are open‑source and print‑safe.</p>
              </div>

              {/* Margin Controls (UI only) */}
              <div>
                <label className="block text-sm text-gray-400 mb-3">Margins (in)</label>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: 'Top', val: '0.75' },
                    { label: 'Bottom', val: '0.75' },
                    { label: 'Inner', val: '0.75' },
                    { label: 'Outer', val: '0.5' },
                  ].map(({label,val}) => (
                    <div key={label} className="flex items-center justify-between bg-[#1A1A1A] border border-gray-700 rounded-lg px-3 py-2">
                      <span className="text-gray-400">{label}</span>
                      <input className="w-20 bg-transparent text-right focus:outline-none" defaultValue={val} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Guides Toggle */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Guides</label>
                <div className="flex flex-wrap gap-2">
                  {['Margins','Bleed','Safe Area','Baseline Grid'].map((g) => (
                    <button key={g} className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:border-cyan-400 hover:text-cyan-300 transition text-xs">{g}</button>
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
                <button className="px-3 py-2 text-sm bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30 transition">Ebook</button>
                <button className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 transition">Print</button>
              </div>

              {/* Two-page toggle (print) */}
              <div className="hidden md:flex items-center gap-2 text-sm">
                <label className="text-gray-400">Spread</label>
                <button className="px-3 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition">1-page</button>
                <button className="px-3 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition">2-page</button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <button className="h-9 w-9 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition grid place-items-center">–</button>
                <div className="px-3 py-1.5 text-sm text-gray-300 bg-[#2A2A2A] rounded-md">100%</div>
                <button className="h-9 w-9 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition grid place-items-center">+</button>
                <button className="ml-2 px-3 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition text-sm">Fit Width</button>
                <button className="px-3 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition text-sm">Fit Height</button>
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
                <input className="w-14 bg-[#2A2A2A] border border-gray-700 rounded-md px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-cyan-400" defaultValue={1} />
                <span>of 248</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition text-sm">Prev</button>
                <button className="px-3 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition text-sm">Next</button>
                <button className="ml-2 px-3 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition text-sm">Page Flip</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ===== Template Gallery Modal ===== */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-6">
          <div className="w-full max-w-5xl bg-[#1E1E1E] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-cyan-300">Template Gallery</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Some templates require <span className="text-gray-200 font-medium">Pro</span></span>
                <button className="text-sm px-3 py-1.5 rounded-lg bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition">Upgrade</button>
                <button onClick={() => setGalleryOpen(false)} className="text-sm px-3 py-1.5 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition">Close</button>
              </div>
            </div>
            <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="mx-auto w-full max-w-6xl bg-[#1E1E1E] border-t border-gray-700 rounded-t-2xl shadow-2xl p-6">
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
        <aside className="fixed right-0 top-[112px] bottom-0 w-full sm:w-[380px] z-50 bg-[#1E1E1E] border-l border-gray-700 shadow-2xl p-5 overflow-y-auto" aria-label="Preflight">
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
      )}

      {/* ===== Success Toast (visible mock) ===== */}
      <div className="fixed bottom-6 right-6 z-50" aria-live="polite">
        <div className="bg-[#1E1E1E] border border-gray-700 rounded-xl shadow-xl px-4 py-3 flex items-start gap-3">
          <div className="h-6 w-6 rounded-full bg-cyan-400/20 border border-cyan-400/40 grid place-items-center">
            <span className="text-cyan-300 text-sm">✓</span>
          </div>
          <div className="text-sm">
            <div className="text-gray-100 font-medium">Export complete</div>
            <div className="text-gray-400">Your PDF is ready to download.</div>
          </div>
          <button className="ml-2 text-sm px-3 py-1.5 rounded-lg bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition">Open</button>
        </div>
      </div>

      {/* ===== Footer ===== */}
      <footer className="px-8 py-8 border-t border-gray-700 text-center text-gray-500 text-sm z-10">
        © {new Date().getFullYear()} Ebook Formatter. All rights reserved.
      </footer>

      {/* Note: Swap favicon via <link rel="icon" ...> in your app's HTML head. */}

    </div>
  )
}
