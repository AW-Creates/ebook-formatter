export interface ContentBlock {
  type: 'chapter' | 'paragraph' | 'image';
  content: string;
  level?: number;
  imageUrl?: string;
  imageAlt?: string;
  fullPage?: boolean;
}

export interface Template {
  name: string;
  description: string;
  css: string;
}

export const parseText = (text: string): ContentBlock[] => {
  if (!text.trim()) {
    return [];
  }

  const lines = text.trim().split('\n');
  const contentBlocks: ContentBlock[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      continue;
    }

    // Check if line is an image placeholder
    if (isImagePlaceholder(trimmedLine)) {
      const imageData = parseImagePlaceholder(trimmedLine);
      contentBlocks.push({
        type: 'image',
        content: imageData.alt || 'Full page image',
        imageUrl: imageData.url,
        imageAlt: imageData.alt,
        fullPage: imageData.fullPage
      });
    }
    // Check if line is a chapter heading
    else if (isChapterHeading(trimmedLine)) {
      contentBlocks.push({
        type: 'chapter',
        content: trimmedLine,
        level: getHeadingLevel(trimmedLine)
      });
    } else {
      contentBlocks.push({
        type: 'paragraph',
        content: trimmedLine
      });
    }
  }

  return contentBlocks;
};

const isChapterHeading = (line: string): boolean => {
  const lineLower = line.toLowerCase().trim();

  // Common chapter patterns
  const chapterPatterns = [
    /^chapter\s+\d+/,
    /^chapter\s+[ivxlcdm]+/, // Roman numerals
    /^ch\s+\d+/,
    /^\d+\.\s/, // "1. Chapter title"
    /^prologue$/,
    /^epilogue$/,
    /^introduction$/,
    /^preface$/,
    /^acknowledgments?$/,
    /^acknowledgements?$/,
    /^about\s+the\s+author$/,
    /^part\s+[ivxlcdm]+/,
    /^part\s+\d+/,
    /^book\s+[ivxlcdm]+/,
    /^book\s+\d+/
  ];

  for (const pattern of chapterPatterns) {
    if (pattern.test(lineLower)) {
      return true;
    }
  }

  // Check if line is all caps and short (likely a title)
  if (line === line.toUpperCase() && line.length < 50) {
    return true;
  }

  // Check if line is significantly shorter than average paragraph
  // and doesn't end with punctuation (except question/exclamation marks for titles)
  if (line.length < 100 && !line.endsWith('.') && !line.endsWith(',')) {
    // Additional check: if it contains typical title words
    const titleWords = ['chapter', 'prologue', 'epilogue', 'part', 'book'];
    if (titleWords.some(word => lineLower.includes(word))) {
      return true;
    }
  }

  return false;
};

const getHeadingLevel = (line: string): number => {
  const lineLower = line.toLowerCase().trim();

  // Main chapters are level 1
  if (/^chapter\s+\d+/.test(lineLower)) {
    return 1;
  }

  // Parts/Books are higher level (smaller number = higher level)
  if (/^(part|book)\s+/.test(lineLower)) {
    return 1;
  }

  // Prologue, epilogue are level 1
  if (['prologue', 'epilogue'].includes(lineLower)) {
    return 1;
  }

  // Introduction, preface are level 2
  if (['introduction', 'preface'].includes(lineLower)) {
    return 2;
  }

  // Acknowledgments, about author are level 3
  if (/^(acknowledgments?|acknowledgements?|about\s+the\s+author)$/.test(lineLower)) {
    return 3;
  }

  // Default to level 1 for other headings
  return 1;
};

const isImagePlaceholder = (line: string): boolean => {
  // Match patterns like [IMAGE:filename.jpg] or [FULLPAGE:filename.png] or [IMG:url]
  const imagePatterns = [
    /^\[IMAGE:[^\]]+\]$/i,
    /^\[FULLPAGE:[^\]]+\]$/i,
    /^\[IMG:[^\]]+\]$/i,
    /^\[CHAPTER-IMAGE:[^\]]+\]$/i
  ];
  
  return imagePatterns.some(pattern => pattern.test(line.trim()));
};

interface ImageData {
  url: string;
  alt: string;
  fullPage: boolean;
}

const parseImagePlaceholder = (line: string): ImageData => {
  const trimmed = line.trim();
  
  // Extract content between brackets
  const match = trimmed.match(/^\[([^:]+):([^\]]+)\]$/i);
  if (!match) {
    return { url: '', alt: 'Image', fullPage: false };
  }
  
  const [, type, content] = match;
  const isFullPage = type.toUpperCase() === 'FULLPAGE' || type.toUpperCase() === 'CHAPTER-IMAGE';
  
  // Handle different URL types
  let url = content;
  let alt = content;
  
  // If it looks like a filename, create a more descriptive alt text
  if (content.includes('.')) {
    const filename = content.split('/').pop() || content;
    alt = filename.split('.')[0].replace(/[-_]/g, ' ');
  }
  
  return {
    url,
    alt: alt.charAt(0).toUpperCase() + alt.slice(1),
    fullPage: isFullPage
  };
};
