import mammoth from 'mammoth';

// Define the supported file types
export type SupportedFileType = 'txt' | 'docx' | 'doc' | 'pdf';

export interface ParsedDocument {
  text: string;
  wordCount: number;
  lineCount: number;
  fileName: string;
  fileType: SupportedFileType;
  success: boolean;
  error?: string;
}

/**
 * Parse text from a TXT file
 */
const parseTxtFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        // Clean the content to remove any potential encoding issues
        const cleanContent = content
          .replace(/\r\n/g, '\n') // Normalize line endings
          .replace(/\r/g, '\n')
          // eslint-disable-next-line no-control-regex
          .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '') // Remove control characters
          .trim();
        resolve(cleanContent);
      } else {
        reject(new Error('Failed to read file content'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file, 'UTF-8');
  });
};

/**
 * Parse text from a DOCX file using mammoth
 */
const parseDocxFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        if (!arrayBuffer) {
          reject(new Error('Failed to read file as ArrayBuffer'));
          return;
        }

        const result = await mammoth.extractRawText({ arrayBuffer });
        if (result.value) {
          // Clean and normalize the extracted text
          const cleanText = result.value
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .trim();
          resolve(cleanText);
        } else {
          reject(new Error('No text content found in document'));
        }
      } catch (error) {
        reject(new Error(`Failed to parse DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Parse text from a PDF file (placeholder - would need pdf-parse in Node.js environment)
 * For browser environment, we'll show a helpful message
 */
const parsePdfFile = async (file: File): Promise<string> => {
  // PDF parsing in browser is complex and requires special handling
  // For now, we'll return an informative message
  throw new Error(
    'PDF parsing is not yet supported in the browser. Please convert your PDF to a TXT or DOCX file first, or copy and paste the text directly.'
  );
};

/**
 * Get file extension from filename
 */
const getFileExtension = (fileName: string): SupportedFileType | null => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (extension && ['txt', 'docx', 'doc', 'pdf'].includes(extension)) {
    return extension as SupportedFileType;
  }
  return null;
};

/**
 * Main document parsing function
 */
export const parseDocument = async (file: File): Promise<ParsedDocument> => {
  const fileName = file.name;
  const fileType = getFileExtension(fileName);

  if (!fileType) {
    return {
      text: '',
      wordCount: 0,
      lineCount: 0,
      fileName,
      fileType: 'txt', // fallback
      success: false,
      error: 'Unsupported file type. Please upload TXT, DOCX, or DOC files.'
    };
  }

  try {
    let text: string;

    switch (fileType) {
      case 'txt':
        text = await parseTxtFile(file);
        break;
      case 'docx':
      case 'doc':
        text = await parseDocxFile(file);
        break;
      case 'pdf':
        text = await parsePdfFile(file);
        break;
      default:
        throw new Error('Unsupported file type');
    }

    // Calculate statistics
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    const lineCount = text.split('\n').length;

    return {
      text,
      wordCount,
      lineCount,
      fileName,
      fileType,
      success: true
    };

  } catch (error) {
    return {
      text: '',
      wordCount: 0,
      lineCount: 0,
      fileName,
      fileType,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Validate file size (max 10MB)
 */
export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Check if file type is supported
 */
export const isSupportedFileType = (fileName: string): boolean => {
  const fileType = getFileExtension(fileName);
  return fileType !== null;
};