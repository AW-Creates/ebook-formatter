import React from 'react';
import { ContentBlock } from '../utils/textParser';
import { templates } from '../styles/templates';

interface PreviewPaneProps {
  content: ContentBlock[];
  template: string;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ content, template }) => {
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
        Enter text to see preview
      </div>
    );
  }

  return (
    <div className="p-4 overflow-y-auto max-h-[500px]">
      <style dangerouslySetInnerHTML={{ __html: templateStyle.css }} />
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