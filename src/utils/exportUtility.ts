// Enhanced Export Utility
// Supports multiple formats inspired by TextDoc: JSX, Markdown, DOCX, TXT

import { FormattedSection, TextFormatter } from './textFormatter';

export interface ExportOptions {
  format: 'html' | 'jsx' | 'markdown' | 'txt' | 'docx';
  filename?: string;
  template: string;
  sections: FormattedSection[];
  uploadedImages?: Record<string, string>;
  metadata?: {
    title?: string;
    author?: string;
    description?: string;
  };
}

export class ExportUtility {
  private options: ExportOptions;
  private formatter: TextFormatter;

  constructor(options: ExportOptions) {
    this.options = options;
    this.formatter = new TextFormatter({ template: options.template });
  }

  // Main export function
  async export(): Promise<void> {
    const { format } = this.options;

    switch (format) {
      case 'html':
        this.exportAsHTML();
        break;
      case 'jsx':
        this.exportAsJSX();
        break;
      case 'markdown':
        this.exportAsMarkdown();
        break;
      case 'txt':
        this.exportAsTXT();
        break;
      case 'docx':
        this.exportAsDOCX();
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  // Export as HTML with embedded styles
  private exportAsHTML(): void {
    const { sections, uploadedImages = {}, metadata = {} } = this.options;
    const filename = this.options.filename || `${metadata.title || 'document'}.html`;

    // Generate complete HTML document
    const htmlContent = this.generateFullHTML(sections, uploadedImages, metadata);
    
    this.downloadFile(htmlContent, filename, 'text/html');
  }

  // Export as JSX component (inspired by TextDoc)
  private exportAsJSX(): void {
    const { sections, uploadedImages = {}, metadata = {} } = this.options;
    const filename = this.options.filename || `${metadata.title || 'Document'}.jsx`;

    const componentName = this.sanitizeComponentName(metadata.title || 'Document');
    let jsxContent = `import React from 'react';\n\n`;
    jsxContent += `const ${componentName} = () => {\n`;
    jsxContent += `  return (\n`;
    jsxContent += `    <div className="document-container" style={documentStyles}>\n`;

    // Generate JSX for each section
    sections.forEach((section, index) => {
      switch (section.type) {
        case 'title':
          const level = section.level || 1;
          const Tag = level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3';
          jsxContent += `      <${Tag} className="title level-${level}" style={titleStyles.level${level}}>\n`;
          jsxContent += `        ${this.escapeJSX(section.content)}\n`;
          jsxContent += `      </${Tag}>\n`;
          break;

        case 'chapter':
          jsxContent += `      <h2 className="chapter" style={chapterStyles}>\n`;
          jsxContent += `        ${this.escapeJSX(section.content)}\n`;
          jsxContent += `      </h2>\n`;
          break;

        case 'paragraph':
          jsxContent += `      <p className="paragraph" style={paragraphStyles}>\n`;
          jsxContent += `        ${this.escapeJSX(section.content)}\n`;
          jsxContent += `      </p>\n`;
          break;

        case 'image':
          const { filename, isFullPage } = section.metadata || {};
          if (filename && uploadedImages[filename]) {
            const className = isFullPage ? 'image-fullpage' : 'image-inline';
            jsxContent += `      <img \n`;
            jsxContent += `        src="${uploadedImages[filename]}" \n`;
            jsxContent += `        alt="${filename}" \n`;
            jsxContent += `        className="${className}" \n`;
            jsxContent += `        style={${isFullPage ? 'fullPageImageStyles' : 'inlineImageStyles'}} \n`;
            jsxContent += `      />\n`;
          }
          break;

        case 'spacer':
          jsxContent += `      <div className="spacer" style={spacerStyles} />\n`;
          break;
      }
    });

    jsxContent += `    </div>\n`;
    jsxContent += `  );\n`;
    jsxContent += `};\n\n`;

    // Add styles object
    jsxContent += this.generateJSXStyles();
    jsxContent += `\nexport default ${componentName};\n`;

    this.downloadFile(jsxContent, filename, 'text/javascript');
  }

  // Export as Markdown
  private exportAsMarkdown(): void {
    const { sections, metadata = {} } = this.options;
    const filename = this.options.filename || `${metadata.title || 'document'}.md`;

    let markdownContent = '';

    // Add frontmatter if metadata exists
    if (metadata.title || metadata.author || metadata.description) {
      markdownContent += '---\n';
      if (metadata.title) markdownContent += `title: "${metadata.title}"\n`;
      if (metadata.author) markdownContent += `author: "${metadata.author}"\n`;
      if (metadata.description) markdownContent += `description: "${metadata.description}"\n`;
      markdownContent += '---\n\n';
    }

    // Convert sections to markdown
    markdownContent += this.formatter.exportAsMarkdown(sections);

    this.downloadFile(markdownContent, filename, 'text/markdown');
  }

  // Export as enhanced TXT
  private exportAsTXT(): void {
    const { sections, metadata = {} } = this.options;
    const filename = this.options.filename || `${metadata.title || 'document'}.txt`;

    let textContent = '';

    // Add header if metadata exists
    if (metadata.title) {
      textContent += metadata.title.toUpperCase() + '\n';
      textContent += '='.repeat(metadata.title.length) + '\n\n';
    }
    if (metadata.author) {
      textContent += `By ${metadata.author}\n\n`;
    }
    if (metadata.description) {
      textContent += metadata.description + '\n\n';
    }

    // Add formatted content
    textContent += this.formatter.exportAsText(sections);

    this.downloadFile(textContent, filename, 'text/plain');
  }

  // Export as DOCX (enhanced version)
  private exportAsDOCX(): void {
    // For now, create an enhanced HTML version that can be saved as DOCX
    // In a full implementation, you'd use a library like officegen or docx
    const { sections, uploadedImages = {}, metadata = {} } = this.options;
    const filename = this.options.filename || `${metadata.title || 'document'}.html`;

    const docxCompatibleHTML = this.generateDOCXCompatibleHTML(sections, uploadedImages, metadata);
    
    // Set proper MIME type for Word documents
    this.downloadFile(docxCompatibleHTML, filename, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  }

  // Generate complete HTML document
  private generateFullHTML(sections: FormattedSection[], uploadedImages: Record<string, string>, metadata: any): string {
    const templateCSS = this.formatter.getTemplateCSS();
    const bodyHTML = this.formatter.renderToHTML(sections, uploadedImages);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.title || 'Document'}</title>
    <style>
        body {
            ${templateCSS}
            padding: 2rem;
            max-width: 8.5in;
            margin: 0 auto;
            background: white;
            font-size: 16px;
        }
        
        @media print {
            body {
                padding: 1in;
                margin: 0;
            }
        }
        
        @page {
            margin: 1in;
            size: letter;
        }
    </style>
</head>
<body>
    ${bodyHTML}
</body>
</html>
    `.trim();
  }

  // Generate DOCX-compatible HTML
  private generateDOCXCompatibleHTML(sections: FormattedSection[], uploadedImages: Record<string, string>, metadata: any): string {
    // Generate HTML that's compatible with Word's HTML import
    let html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta charset="utf-8">
    <title>${metadata.title || 'Document'}</title>
    <!--[if gte mso 9]>
    <xml>
        <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>90</w:Zoom>
            <w:DoNotPromptForConvert/>
            <w:DoNotShowInsertionsAndDeletions/>
        </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
        body { font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.5; }
        h1 { font-size: 18pt; font-weight: bold; text-align: center; page-break-before: always; }
        h2 { font-size: 16pt; font-weight: bold; text-align: center; page-break-before: always; }
        h3 { font-size: 14pt; font-weight: bold; }
        p { margin: 0; text-indent: 0.5in; text-align: justify; }
    </style>
</head>
<body>
    `;

    sections.forEach(section => {
      switch (section.type) {
        case 'title':
          const level = section.level || 1;
          html += `<h${level}>${this.escapeHTML(section.content)}</h${level}>`;
          break;
        case 'chapter':
          html += `<h2>${this.escapeHTML(section.content)}</h2>`;
          break;
        case 'paragraph':
          html += `<p>${this.escapeHTML(section.content)}</p>`;
          break;
        case 'spacer':
          html += '<p>&nbsp;</p>';
          break;
      }
    });

    html += '</body></html>';
    return html;
  }

  // Generate JSX styles object
  private generateJSXStyles(): string {
    return `
const documentStyles = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  lineHeight: 1.7,
  color: '#333',
  maxWidth: '700px',
  margin: '0 auto',
  padding: '2rem'
};

const titleStyles = {
  level1: {
    fontSize: '2.5em',
    margin: '2em 0 1.5em 0',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  level2: {
    fontSize: '2em',
    margin: '1.5em 0 1em 0',
    textAlign: 'center',
    fontWeight: '600'
  },
  level3: {
    fontSize: '1.5em',
    margin: '1.2em 0 0.8em 0',
    fontWeight: '600'
  }
};

const chapterStyles = {
  fontSize: '2.2em',
  margin: '3em 0 2em 0',
  textAlign: 'center',
  fontWeight: 'bold',
  borderBottom: '2px solid #e2e2e2',
  paddingBottom: '0.5em'
};

const paragraphStyles = {
  margin: '1.2em 0',
  textAlign: 'justify',
  textIndent: '1.5em'
};

const fullPageImageStyles = {
  display: 'block',
  maxWidth: '100%',
  height: 'auto',
  margin: '2em auto',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
};

const inlineImageStyles = {
  float: 'left',
  width: '200px',
  height: '200px',
  objectFit: 'cover',
  margin: '0 1.5em 1em 0',
  borderRadius: '6px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
};

const spacerStyles = {
  height: '1.5em'
};
    `.trim();
  }

  // Utility functions
  private sanitizeComponentName(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9]/g, '')
      .replace(/^[^a-zA-Z]/, 'Component')
      .replace(/^\w/, c => c.toUpperCase());
  }

  private escapeJSX(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/{/g, '&#123;')
      .replace(/}/g, '&#125;');
  }

  private escapeHTML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Factory function for easy usage
export function exportDocument(options: ExportOptions): Promise<void> {
  const exporter = new ExportUtility(options);
  return exporter.export();
}

// Quick export functions
export function exportAsHTML(sections: FormattedSection[], template: string, filename?: string, metadata?: any): void {
  const exporter = new ExportUtility({
    format: 'html',
    sections,
    template,
    filename,
    metadata
  });
  exporter.export();
}

export function exportAsJSX(sections: FormattedSection[], template: string, filename?: string, metadata?: any): void {
  const exporter = new ExportUtility({
    format: 'jsx',
    sections,
    template,
    filename,
    metadata
  });
  exporter.export();
}

export function exportAsMarkdown(sections: FormattedSection[], template: string, filename?: string, metadata?: any): void {
  const exporter = new ExportUtility({
    format: 'markdown',
    sections,
    template,
    filename,
    metadata
  });
  exporter.export();
}