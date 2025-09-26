// Enhanced Text Formatting Engine
// Inspired by TextDoc's smart formatting approach

export interface FormattingOptions {
  template: string;
  fontSize?: string;
  lineSpacing?: number;
  margins?: string;
  chapterStyle?: string;
  textAlignment?: string;
  pageBreaks?: string;
}

export interface FormattedSection {
  type: 'title' | 'chapter' | 'paragraph' | 'image' | 'spacer';
  content: string;
  level?: number;
  metadata?: Record<string, any>;
}

export class TextFormatter {
  private options: FormattingOptions;

  constructor(options: FormattingOptions) {
    this.options = options;
  }

  // Smart text processing inspired by TextDoc
  formatText(rawText: string): FormattedSection[] {
    const lines = rawText.split('\n');
    const sections: FormattedSection[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Handle empty lines as spacers
      if (!trimmed) {
        sections.push({ type: 'spacer', content: '' });
        continue;
      }
      
      // Smart chapter detection (improved from TextDoc)
      const chapterMatch = this.detectChapter(trimmed);
      if (chapterMatch) {
        sections.push({
          type: 'chapter',
          content: trimmed,
          level: chapterMatch.level,
          metadata: { 
            number: chapterMatch.number,
            title: chapterMatch.title 
          }
        });
        continue;
      }
      
      // Smart title detection (enhanced from current implementation)
      if (this.isTitle(trimmed, i, lines)) {
        sections.push({
          type: 'title',
          content: trimmed,
          level: this.getTitleLevel(trimmed)
        });
        continue;
      }
      
      // Handle image placeholders
      if (trimmed.startsWith('[IMAGE:') || trimmed.startsWith('[FULLPAGE:')) {
        const isFullPage = trimmed.startsWith('[FULLPAGE:');
        const filename = trimmed.match(/\[(?:IMAGE|FULLPAGE):(.+?)\]/)?.[1];
        
        sections.push({
          type: 'image',
          content: trimmed,
          metadata: { isFullPage, filename }
        });
        continue;
      }
      
      // Regular paragraphs with smart formatting
      sections.push({
        type: 'paragraph',
        content: this.formatParagraph(trimmed)
      });
    }
    
    return sections;
  }

  // Enhanced chapter detection with multiple patterns
  private detectChapter(text: string): { level: number; number?: string; title?: string } | null {
    const patterns = [
      // Traditional: "Chapter 1", "Chapter One", etc.
      /^chapter\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten)(\s*[:\-–—]\s*(.*))?$/i,
      // Roman numerals: "Chapter I", "Chapter II", etc.
      /^chapter\s+([ivxlcdm]+)(\s*[:\-–—]\s*(.*))?$/i,
      // Simple numbers: "1.", "2.", etc.
      /^(\d+)\.(\s*(.*))?$/,
      // Part indicators: "Part 1", "Part I", etc.
      /^part\s+(\d+|[ivxlcdm]+|one|two|three)(\s*[:\-–—]\s*(.*))?$/i,
      // Section indicators
      /^section\s+(\d+)(\s*[:\-–—]\s*(.*))?$/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return {
          level: 1,
          number: match[1],
          title: match[3] || match[2]?.trim()
        };
      }
    }

    return null;
  }

  // Smart title detection (improved logic)
  private isTitle(text: string, index: number, lines: string[]): boolean {
    // First non-empty line is likely a title
    if (index === 0) return true;
    
    // All caps and short (likely a title)
    if (text === text.toUpperCase() && text.length < 100) return true;
    
    // Centered-looking text (no punctuation at the end, relatively short)
    if (text.length < 60 && !text.match(/[.!?]$/)) {
      const nextLine = lines[index + 1]?.trim();
      // If next line is empty or also looks like a title, this is probably a title
      if (!nextLine || nextLine.length < 60) return true;
    }
    
    // Title case detection
    const words = text.split(' ');
    const titleCaseWords = words.filter(word => 
      word.length > 0 && word[0] === word[0].toUpperCase()
    );
    
    // If most words are title case and it's not too long
    if (titleCaseWords.length / words.length > 0.7 && text.length < 80) {
      return true;
    }
    
    return false;
  }

  // Determine title level based on content and context
  private getTitleLevel(text: string): number {
    if (text === text.toUpperCase()) return 1; // Main title
    if (text.length < 30) return 2; // Subtitle
    return 3; // Section title
  }

  // Enhanced paragraph formatting
  private formatParagraph(text: string): string {
    // Remove excessive whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    // Smart quote conversion
    text = text.replace(/"([^"]*)"/g, '\u201C$1\u201D'); // Straight to curly quotes
    text = text.replace(/'([^']*)'/g, '\u2018$1\u2019'); // Straight to curly apostrophes
    
    // Em dash formatting
    text = text.replace(/\s--\s/g, '\u2014');
    text = text.replace(/\s-\s/g, ' \u2013 '); // En dash for ranges
    
    // Ellipsis formatting
    text = text.replace(/\.{3,}/g, '\u2026');
    
    return text;
  }

  // Generate CSS for template
  getTemplateCSS(): string {
    const { template } = this.options;
    
    const templates = {
      classic: `
        font-family: 'Georgia', 'Times New Roman', serif;
        line-height: 1.6;
        color: #2c2c2c;
        max-width: 650px;
        margin: 0 auto;
      `,
      modern: `
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        line-height: 1.7;
        color: #333;
        max-width: 700px;
        margin: 0 auto;
        letter-spacing: -0.01em;
      `,
      elegant: `
        font-family: 'Crimson Text', 'Georgia', serif;
        line-height: 1.8;
        color: #1a1a1a;
        max-width: 600px;
        margin: 0 auto;
        font-size: 18px;
      `,
      scifi: `
        font-family: 'SF Mono', 'Monaco', 'Roboto Mono', monospace;
        line-height: 1.5;
        color: #0f172a;
        max-width: 680px;
        margin: 0 auto;
        letter-spacing: 0.02em;
      `
    };
    
    return templates[template as keyof typeof templates] || templates.modern;
  }

  // Generate HTML with proper styling using enhanced CSS classes
  renderToHTML(sections: FormattedSection[], uploadedImages: Record<string, string> = {}): string {
    const templateClass = `template-${this.options.template}`;
    
    let html = `<div class="${templateClass}">`;
    
    sections.forEach((section, index) => {
      switch (section.type) {
        case 'title':
          const titleLevel = section.level || 1;
          const titleTag = titleLevel === 1 ? 'h1' : titleLevel === 2 ? 'h2' : 'h3';
          html += `<${titleTag}>${section.content}</${titleTag}>`;
          break;
          
        case 'chapter':
          html += `<h2>${section.content}</h2>`;
          break;
          
        case 'paragraph':
          html += `<p>${section.content}</p>`;
          break;
          
        case 'image':
          const { isFullPage, filename } = section.metadata || {};
          if (filename && uploadedImages[filename]) {
            const imageClass = isFullPage ? 'image-fullpage' : 'image-inline';
            html += `<img src="${uploadedImages[filename]}" alt="${filename}" class="${imageClass}" />`;
          }
          break;
          
        case 'spacer':
          html += '<div class="spacer"></div>';
          break;
      }
    });
    
    html += '</div>';
    return html;
  }

  // Export formatted text as different formats
  exportAsMarkdown(sections: FormattedSection[]): string {
    return sections.map(section => {
      switch (section.type) {
        case 'title':
          const level = section.level || 1;
          return '#'.repeat(level) + ' ' + section.content;
        case 'chapter':
          return '## ' + section.content;
        case 'paragraph':
          return section.content;
        case 'image':
          const { filename, isFullPage } = section.metadata || {};
          return `![${filename || 'Image'}](${filename})${isFullPage ? ' {.full-page}' : ''}`;
        case 'spacer':
          return '';
        default:
          return section.content;
      }
    }).join('\n\n');
  }

  // Export as plain text with smart formatting
  exportAsText(sections: FormattedSection[]): string {
    return sections.map(section => {
      switch (section.type) {
        case 'title':
          return section.content.toUpperCase() + '\n' + '='.repeat(section.content.length);
        case 'chapter':
          return '\n\n' + section.content + '\n' + '-'.repeat(section.content.length);
        case 'paragraph':
          return section.content;
        case 'image':
          return `[Image: ${section.metadata?.filename || 'Image placeholder'}]`;
        case 'spacer':
          return '';
        default:
          return section.content;
      }
    }).join('\n\n');
  }
}

// Factory function for creating formatters
export function createFormatter(options: FormattingOptions): TextFormatter {
  return new TextFormatter(options);
}

// Utility function for quick formatting
export function formatTextQuick(text: string, template: string = 'modern'): string {
  const formatter = new TextFormatter({ template });
  const sections = formatter.formatText(text);
  return formatter.renderToHTML(sections);
}