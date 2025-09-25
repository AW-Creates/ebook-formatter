import React from 'react';

interface TemplateShowcaseProps {
  selectedTemplate: string;
  onSelectTemplate: (templateKey: string) => void;
  showDescription?: boolean;
}

const professionalTemplates = {
  classic: {
    name: "Classic Novel",
    category: "Fiction",
    description: "Perfect for novels, memoirs, and narrative works. Features elegant typography with generous margins and chapter styling reminiscent of traditional publishing.",
    features: ["Serif typography", "Chapter breaks", "Generous margins", "Classic styling"],
    preview: {
      title: "Chapter One",
      subtitle: "The Beginning",
      paragraph: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness...",
    },
    color: "bg-amber-50 border-amber-200"
  },
  modern: {
    name: "Modern Non-Fiction",
    category: "Business & Self-Help",
    description: "Clean, contemporary design ideal for business books, self-help guides, and educational content. Emphasizes readability with modern sans-serif fonts.",
    features: ["Sans-serif typography", "Clean headers", "Wide layout", "Modern spacing"],
    preview: {
      title: "Key Principles",
      subtitle: "Foundation for Success",
      paragraph: "The most successful people share certain fundamental characteristics that set them apart from the crowd...",
    },
    color: "bg-blue-50 border-blue-200"
  },
  academic: {
    name: "Academic Paper",
    category: "Research & Education",
    description: "Professional academic styling with proper spacing, citations support, and formal typography. Perfect for research papers, theses, and educational materials.",
    features: ["Academic formatting", "Citation ready", "Formal typography", "Research focused"],
    preview: {
      title: "Abstract",
      subtitle: "Research Methodology",
      paragraph: "This study examines the correlation between digital transformation initiatives and organizational performance...",
    },
    color: "bg-emerald-50 border-emerald-200"
  },
  elegant: {
    name: "Elegant Literary",
    category: "Poetry & Literary",
    description: "Sophisticated design for poetry, literary works, and premium publications. Features refined typography and artistic spacing for maximum visual impact.",
    features: ["Premium typography", "Artistic spacing", "Literary styling", "Refined layout"],
    preview: {
      title: "Autumn Reflections",
      subtitle: "A Collection",
      paragraph: "In the whisper of falling leaves, we find the poetry of seasons changing, each rustle a verse in nature's eternal song...",
    },
    color: "bg-purple-50 border-purple-200"
  }
};

const TemplateShowcase: React.FC<TemplateShowcaseProps> = ({ 
  selectedTemplate, 
  onSelectTemplate,
  showDescription = true 
}) => {
  return (
    <div className="template-showcase-container">
      {showDescription && (
        <div className="text-center mb-8">
          <h2 className="brand-logo text-2xl text-gray-900 mb-3">Choose Your Template Style</h2>
          <p className="brand-tagline text-gray-600 max-w-2xl mx-auto">
            Each template is professionally designed for specific genres and use cases. 
            Select the one that best matches your manuscript's style and audience.
          </p>
        </div>
      )}

      <div className="template-showcase">
        {Object.entries(professionalTemplates).map(([key, template]) => (
          <div
            key={key}
            className={`template-card ${selectedTemplate === key ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}
            onClick={() => onSelectTemplate(key)}
          >
            <div className="template-preview">
              {/* Mini Book Preview */}
              <div className="flex items-center justify-center h-full p-6">
                <div className={`w-full max-w-[200px] h-32 ${template.color} rounded-lg border-2 p-3 transform rotate-1 shadow-md`}>
                  <div className="text-center space-y-2">
                    <h4 className="font-serif font-bold text-xs text-gray-800 truncate">
                      {template.preview.title}
                    </h4>
                    <p className="font-serif text-xs text-gray-600 truncate">
                      {template.preview.subtitle}
                    </p>
                    <div className="space-y-1">
                      <div className="h-1 bg-gray-300 rounded w-full"></div>
                      <div className="h-1 bg-gray-300 rounded w-4/5"></div>
                      <div className="h-1 bg-gray-300 rounded w-full"></div>
                      <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Badge */}
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200">
                  {template.category}
                </span>
              </div>

              {/* Selection Indicator */}
              {selectedTemplate === key && (
                <div className="absolute top-3 left-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            <div className="template-info">
              <div className="mb-3">
                <h3 className="template-title">{template.name}</h3>
                <p className="template-description">{template.description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-xs text-gray-500">Professional Grade</span>
                  </div>
                  
                  {selectedTemplate === key ? (
                    <span className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Selected
                    </span>
                  ) : (
                    <button className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors">
                      Select →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Template Comparison */}
      {showDescription && (
        <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-amber-50 rounded-xl border border-purple-100">
          <div className="text-center mb-4">
            <h3 className="font-serif text-lg font-semibold text-gray-900 mb-2">
              Not sure which template to choose?
            </h3>
            <p className="text-sm text-gray-600">
              All templates are fully customizable with our Advanced Typography Controls
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/60 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">📚 For Fiction & Narratives</h4>
              <p className="text-gray-700">Choose <strong>Classic Novel</strong> or <strong>Elegant Literary</strong> for storytelling that needs traditional, readable typography.</p>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">💼 For Business & Education</h4>
              <p className="text-gray-700">Choose <strong>Modern Non-Fiction</strong> or <strong>Academic Paper</strong> for professional, clean presentation of information.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateShowcase;