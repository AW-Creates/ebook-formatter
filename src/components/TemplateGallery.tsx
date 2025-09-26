import React from 'react';

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplate: string;
  onSelectTemplate: (template: string) => void;
}

interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  tag: string;
  pro: boolean;
  preview: string;
}

const templates: TemplateInfo[] = [
  {
    id: 'classic',
    name: 'Classic Literature',
    description: 'Traditional serif styling with elegant typography',
    tag: 'Inspired by classic literature',
    pro: false,
    preview: 'Chapter 1 · The Beginning\n\nIt was a dark and stormy night...'
  },
  {
    id: 'modern',
    name: 'Modern Fiction',
    description: 'Clean contemporary design with system fonts',
    tag: 'Inspired by modern publishers',
    pro: false,
    preview: 'Chapter One\nThe Discovery\n\nSarah walked through the door...'
  },
  {
    id: 'elegant',
    name: 'Elegant Typography',
    description: 'Sophisticated literary styling with premium fonts',
    tag: 'Inspired by literary magazines',
    pro: false,
    preview: 'CHAPTER I\nIn the Beginning\n\nOnce upon a time in a distant...'
  },
  {
    id: 'scifi',
    name: 'Sci-Fi Style',
    description: 'Futuristic technical design with monospace elements',
    tag: 'Inspired by sci-fi publications',
    pro: false,
    preview: '001 - INITIALIZATION\n\nThe system hummed to life...'
  },
  {
    id: 'academic',
    name: 'Academic Notes',
    description: 'Scholarly format with references and footnotes',
    tag: 'Inspired by academic journals',
    pro: true,
    preview: 'Chapter 1: Introduction\n\nThe theoretical framework...'
  },
  {
    id: 'memoir',
    name: 'Memoir Humanist',
    description: 'Personal narrative style with humanist typography',
    tag: 'Inspired by memoir publications',
    pro: true,
    preview: 'Chapter One\nMemories\n\nI remember the day when...'
  },
  {
    id: 'poetry',
    name: 'Poetry Wide',
    description: 'Wide format optimized for poetry and verse',
    tag: 'Inspired by poetry collections',
    pro: true,
    preview: 'Untitled\n\nRoses are red,\nViolets are blue...'
  },
  {
    id: 'shortstories',
    name: 'Short Stories',
    description: 'Literary magazine style for short fiction',
    tag: 'Inspired by literary magazines',
    pro: true,
    preview: 'The Last Dance\n\nShe walked into the room...'
  }
];

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  isOpen,
  onClose,
  selectedTemplate,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  const handleTemplateSelect = (templateId: string, isPro: boolean) => {
    if (isPro) {
      // Show upgrade prompt for Pro templates
      alert('This template requires Pro. Upgrade to unlock all premium templates!');
      return;
    }
    onSelectTemplate(templateId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-6">
      <div className="w-full max-w-5xl bg-[#1E1E1E] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-cyan-300">Template Gallery</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Some templates require <span className="text-gray-200 font-medium">Pro</span></span>
            <button className="text-sm px-3 py-1.5 rounded-lg bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition">
              Upgrade
            </button>
            <button 
              onClick={onClose}
              className="text-sm px-3 py-1.5 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-300 transition"
            >
              Close
            </button>
          </div>
        </div>
        
        <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 max-h-[70vh] overflow-y-auto">
          {templates.map((template) => (
            <div 
              key={template.id} 
              className={`bg-[#232323] border rounded-xl overflow-hidden transition cursor-pointer ${
                selectedTemplate === template.id 
                  ? 'border-cyan-400 ring-2 ring-cyan-400/20' 
                  : 'border-gray-700 hover:border-cyan-400'
              }`}
              onClick={() => handleTemplateSelect(template.id, template.pro)}
            >
              <div className="relative aspect-[3/4] bg-[#111111] p-4 overflow-hidden">
                {template.pro && (
                  <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/30">
                    PRO
                  </span>
                )}
                
                {/* Template Preview */}
                <div className="h-full bg-white text-black p-3 rounded-md shadow-sm overflow-hidden text-xs">
                  <div 
                    className={`h-full ${template.id === 'classic' ? 'font-serif' : 'font-sans'}`}
                    style={{ 
                      fontSize: '10px',
                      lineHeight: '1.3',
                      color: '#1a1a1a'
                    }}
                  >
                    {template.preview.split('\n').map((line, i) => (
                      <div key={i} className={i === 0 ? 'font-bold mb-2' : 'mb-1'}>
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-200">{template.name}</div>
                    <div className="text-[10px] text-gray-500 mb-1">{template.tag}</div>
                    <div className="text-xs text-gray-400">{template.description}</div>
                  </div>
                  <button 
                    className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                      template.pro 
                        ? 'border-fuchsia-500/50 text-fuchsia-300 hover:border-fuchsia-400 hover:text-fuchsia-200' 
                        : selectedTemplate === template.id
                        ? 'border-cyan-400 text-cyan-300 bg-cyan-400/10'
                        : 'border-gray-700 hover:border-cyan-400 hover:text-cyan-300'
                    }`}
                  >
                    {template.pro ? 'Unlock Pro' : selectedTemplate === template.id ? 'Selected' : 'Use'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;