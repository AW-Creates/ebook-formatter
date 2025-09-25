import React from 'react';
import { templates } from '../styles/templates';

interface PreviewPaneProps {
  content: any[];
  template: string;
  customStyles?: Record<string, any>;
  uploadedImages?: Record<string, string>;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ content, template, customStyles, uploadedImages = {} }) => {
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
            ) : block.type === 'image' ? (
              <div className={`image-container ${block.fullPage ? 'full-page-image' : 'inline-image'}`}>
                {uploadedImages[block.imageUrl] ? (
                  // Display actual uploaded image
                  <div className="uploaded-image">
                    <img 
                      src={uploadedImages[block.imageUrl]} 
                      alt={block.imageAlt || block.imageUrl}
                      className={`uploaded-image-display ${
                        block.fullPage 
                          ? 'w-full h-auto max-h-[400px] object-contain border-2 border-purple-200 rounded-lg' 
                          : 'max-w-full h-auto max-h-[200px] object-contain border border-gray-200 rounded'
                      }`}
                    />
                    <div className={`image-caption text-center mt-2 ${
                      block.fullPage ? 'text-sm font-medium text-purple-700' : 'text-xs text-gray-600'
                    }`}>
                      {block.fullPage ? `Full Page: ${block.imageUrl}` : `Inline: ${block.imageUrl}`}
                    </div>
                  </div>
                ) : (
                  // Display placeholder if image not found
                  <div className="image-placeholder">
                    <div className="image-icon">
                      <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="image-info">
                      <p className="image-title">{block.fullPage ? 'Full Page Image' : 'Inline Image'}</p>
                      <p className="image-filename">{block.imageUrl}</p>
                      <p className="image-alt">{block.imageAlt}</p>
                      <p className="text-xs text-red-500 mt-1">Image not uploaded</p>
                    </div>
                  </div>
                )}
              </div>
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