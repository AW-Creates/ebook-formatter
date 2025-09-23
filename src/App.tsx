import React, { useState, useEffect } from 'react';
import './App.css';
import { parseText } from './utils/textParser';
import { templates } from './styles/templates';
import PreviewPane from './components/PreviewPane';
import DownloadButton from './components/DownloadButton';

const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('classic');
  const [parsedContent, setParsedContent] = useState<any[]>([]);
  const [bookTitle, setBookTitle] = useState<string>('Untitled Book');
  const [author, setAuthor] = useState<string>('Anonymous');

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
        <div className="mb-6 flex flex-wrap items-center gap-4">
          {/* Title and Author inputs */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Book Title"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Author Name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Template Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="template-select" className="text-sm font-medium text-gray-700">
              Style:
            </label>
            <select
              id="template-select"
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(templates).map(([key, template]) => (
                <option key={key} value={key}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sample Text Button */}
          <button
            onClick={() => setText(sampleText)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
          >
            Load Sample Text
          </button>

          {/* Download Button */}
          {text.trim() && (
            <DownloadButton
              text={text}
              templateName={selectedTemplate}
              title={bookTitle}
              author={author}
            />
          )}
        </div>

        {/* Dual Pane Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px]">
          {/* Input Pane */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b bg-gray-50 rounded-t-lg">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Text
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Paste your book content here. Chapter headings will be automatically detected.
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
            />
          </div>
        </div>

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
