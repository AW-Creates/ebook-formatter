import React from 'react';
import { ContentBlock } from '../utils/textParser';
import { templates } from '../styles/templates';

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

interface PreviewPaneProps {
  content: ContentBlock[];
  template: string;
  customStyles?: Record<string, FontStyle>;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ content, template, customStyles }) => {
  const templateStyle = templates[template];

  if (!templateStyle) {
    return (
      <div className="p-4 text-center text-gray-500">
        Template not found
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Enter text or upload a document to see preview
      </div>
    );
  }

  // Generate custom CSS from font styles
  const generateCustomCSS = () => {
    if (!customStyles) return templateStyle.css;
    
    let customCSS = templateStyle.css;
    
    Object.entries(customStyles).forEach(([elementType, style]) => {
      const cssClass = elementType === 'paragraph' ? '.paragraph' : 
                      elementType === 'h1' ? '.chapter-heading' :
                      elementType === 'h2' ? '.sub-heading' :
                      elementType === 'quote' ? '.quote' : `.${elementType}`;
      
      const styleCSS = `
        ${cssClass} {
          font-family: ${style.fontFamily} !important;
          font-size: ${style.fontSize} !important;
          font-weight: ${style.fontWeight} !important;
          color: ${style.color} !important;
          line-height: ${style.lineHeight} !important;
          letter-spacing: ${style.letterSpacing} !important;
          text-align: ${style.textAlign} !important;
          margin-top: ${style.marginTop} !important;
          margin-bottom: ${style.marginBottom} !important;
        }`;
      
      customCSS += styleCSS;
    });
    
    return customCSS;
  };

  return (
    <div className="p-4 overflow-y-auto max-h-[500px]">
      <style dangerouslySetInnerHTML={{ __html: generateCustomCSS() }} />
      <div className="preview-content">
        {content.map((block, index) => (
          <div key={index}>
            {block.type === 'chapter' ? (
              <h1 className="chapter-heading">
                {block.content}
              </h1>
            ) : (
              <p className="paragraph">
                {block.content}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviewPane;