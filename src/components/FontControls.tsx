import React, { useState } from 'react';

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

interface FontControlsProps {
  elementType: string;
  currentStyle: FontStyle;
  onStyleChange: (elementType: string, newStyle: FontStyle) => void;
}

const FontControls: React.FC<FontControlsProps> = ({ elementType, currentStyle, onStyleChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const fontFamilies = [
    { value: 'Georgia, serif', label: 'Georgia (Serif)' },
    { value: 'Times New Roman, serif', label: 'Times New Roman' },
    { value: 'Palatino, serif', label: 'Palatino' },
    { value: 'Arial, sans-serif', label: 'Arial (Sans-serif)' },
    { value: 'Helvetica, sans-serif', label: 'Helvetica' },
    { value: 'Calibri, sans-serif', label: 'Calibri' },
    { value: 'Courier New, monospace', label: 'Courier New (Mono)' },
    { value: 'Monaco, monospace', label: 'Monaco' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
    { value: 'Garamond, serif', label: 'Garamond' }
  ];

  const fontWeights = [
    { value: '300', label: 'Light' },
    { value: '400', label: 'Normal' },
    { value: '500', label: 'Medium' },
    { value: '600', label: 'Semi-bold' },
    { value: '700', label: 'Bold' },
    { value: '800', label: 'Extra-bold' }
  ];

  const textAlignments = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
    { value: 'justify', label: 'Justify' }
  ];

  const handleChange = (property: keyof FontStyle, value: string) => {
    const newStyle = { ...currentStyle, [property]: value };
    onStyleChange(elementType, newStyle);
  };

  const elementLabels: Record<string, string> = {
    h1: 'Main Headings (H1)',
    h2: 'Sub Headings (H2)',
    h3: 'Minor Headings (H3)',
    paragraph: 'Body Text',
    quote: 'Quotes',
    emphasis: 'Emphasis/Italic',
    strong: 'Strong/Bold',
    caption: 'Captions'
  };

  return (
    <div className="font-controls-container">
      <div 
        className="font-controls-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h4 className="text-sm font-medium text-gray-700">
          {elementLabels[elementType] || elementType}
        </h4>
        <svg 
          className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isExpanded && (
        <div className="font-controls-content">
          {/* Font Family */}
          <div className="control-group">
            <label className="control-label">Font Family</label>
            <select
              value={currentStyle.fontFamily}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              className="control-select"
            >
              {fontFamilies.map(font => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size and Weight */}
          <div className="control-row">
            <div className="control-group">
              <label className="control-label">Size</label>
              <input
                type="text"
                value={currentStyle.fontSize}
                onChange={(e) => handleChange('fontSize', e.target.value)}
                className="control-input"
                placeholder="16px"
              />
            </div>
            <div className="control-group">
              <label className="control-label">Weight</label>
              <select
                value={currentStyle.fontWeight}
                onChange={(e) => handleChange('fontWeight', e.target.value)}
                className="control-select"
              >
                {fontWeights.map(weight => (
                  <option key={weight.value} value={weight.value}>
                    {weight.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Color and Alignment */}
          <div className="control-row">
            <div className="control-group">
              <label className="control-label">Color</label>
              <input
                type="color"
                value={currentStyle.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="control-color"
              />
            </div>
            <div className="control-group">
              <label className="control-label">Alignment</label>
              <select
                value={currentStyle.textAlign}
                onChange={(e) => handleChange('textAlign', e.target.value)}
                className="control-select"
              >
                {textAlignments.map(align => (
                  <option key={align.value} value={align.value}>
                    {align.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Line Height and Letter Spacing */}
          <div className="control-row">
            <div className="control-group">
              <label className="control-label">Line Height</label>
              <input
                type="text"
                value={currentStyle.lineHeight}
                onChange={(e) => handleChange('lineHeight', e.target.value)}
                className="control-input"
                placeholder="1.4"
              />
            </div>
            <div className="control-group">
              <label className="control-label">Letter Spacing</label>
              <input
                type="text"
                value={currentStyle.letterSpacing}
                onChange={(e) => handleChange('letterSpacing', e.target.value)}
                className="control-input"
                placeholder="0px"
              />
            </div>
          </div>

          {/* Margins */}
          <div className="control-row">
            <div className="control-group">
              <label className="control-label">Margin Top</label>
              <input
                type="text"
                value={currentStyle.marginTop}
                onChange={(e) => handleChange('marginTop', e.target.value)}
                className="control-input"
                placeholder="0px"
              />
            </div>
            <div className="control-group">
              <label className="control-label">Margin Bottom</label>
              <input
                type="text"
                value={currentStyle.marginBottom}
                onChange={(e) => handleChange('marginBottom', e.target.value)}
                className="control-input"
                placeholder="16px"
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .font-controls-container {
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          margin-bottom: 0.5rem;
          background: white;
        }

        .font-controls-header {
          padding: 0.75rem 1rem;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #f3f4f6;
          background: #f9fafb;
        }

        .font-controls-header:hover {
          background: #f3f4f6;
        }

        .font-controls-content {
          padding: 1rem;
        }

        .control-group {
          margin-bottom: 0.75rem;
        }

        .control-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .control-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.25rem;
        }

        .control-input, .control-select {
          width: 100%;
          padding: 0.375rem 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }

        .control-input:focus, .control-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .control-color {
          width: 100%;
          height: 2rem;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .control-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default FontControls;