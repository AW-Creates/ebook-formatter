const formidable = require('formidable');
const fs = require('fs');

// Configure allowed file types and max size
const ALLOWED_EXTENSIONS = ['txt', 'docx', 'pdf'];
const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB

function allowed_file(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
}

async function extractTextFromFile(buffer, filename) {
  const ext = filename.split('.').pop().toLowerCase();
  
  switch (ext) {
    case 'txt':
      try {
        return { text: buffer.toString('utf-8'), type: 'text' };
      } catch (error) {
        // Fallback to latin-1 if UTF-8 fails
        return { text: buffer.toString('latin-1'), type: 'text' };
      }
    
    case 'docx':
      try {
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        return { text: result.value, type: 'docx' };
      } catch (error) {
        throw new Error(`Error processing DOCX file: ${error.message}`);
      }
    
    case 'pdf':
      try {
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(buffer);
        return { text: data.text, type: 'pdf' };
      } catch (error) {
        throw new Error(`Error processing PDF file: ${error.message}`);
      }
    
    default:
      throw new Error(`Unsupported file format: ${ext}`);
  }
}

function detectDocumentStructure(text) {
  const lines = text.split('\n');
  const structure = {
    headings: [],
    quotes: [],
    lists: [],
    emphasis: [],
    total_lines: lines.length,
    word_count: text.split(/\s+/).filter(word => word.length > 0).length
  };
  
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    // Detect potential headings
    if (trimmed.length < 80 && (
      trimmed === trimmed.toUpperCase() ||
      trimmed.startsWith('Chapter') ||
      trimmed.startsWith('CHAPTER') ||
      trimmed.startsWith('Part') ||
      trimmed.startsWith('PART') ||
      /^\d+/.test(trimmed.substring(0, 10))
    )) {
      structure.headings.push({
        text: trimmed,
        line_number: i,
        type: 'heading'
      });
    }
    
    // Detect quotes
    if (trimmed.startsWith('"') || trimmed.startsWith("'") || 
        trimmed.startsWith('"') || trimmed.startsWith('    ')) {
      structure.quotes.push({
        text: trimmed,
        line_number: i,
        type: 'quote'
      });
    }
    
    // Detect lists
    if (trimmed.startsWith('•') || trimmed.startsWith('*') || 
        trimmed.startsWith('-') || /^[0-9]+\./.test(trimmed) || 
        /^[a-z]\./.test(trimmed)) {
      structure.lists.push({
        text: trimmed,
        line_number: i,
        type: 'list_item'
      });
    }
  });
  
  return structure;
}

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the multipart form data
    const form = new formidable.IncomingForm({
      maxFileSize: MAX_FILE_SIZE,
      keepExtensions: true,
      multiples: false
    });

    // Use promise-based parsing
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });
    
    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Handle both array and single file cases
    const uploadedFile = Array.isArray(file) ? file[0] : file;
    
    if (!uploadedFile.originalFilename || uploadedFile.originalFilename === '') {
      return res.status(400).json({ error: 'No file selected' });
    }

    if (!allowed_file(uploadedFile.originalFilename)) {
      return res.status(400).json({ 
        error: 'File type not supported. Please upload .txt, .docx, or .pdf files' 
      });
    }

    // Read file data
    const fileBuffer = fs.readFileSync(uploadedFile.filepath);

    // Extract text from file
    const { text: extractedText, type: fileType } = await extractTextFromFile(
      fileBuffer, 
      uploadedFile.originalFilename
    );

    // Analyze document structure
    const structure = detectDocumentStructure(extractedText);

    // Clean up temporary file
    try {
      fs.unlinkSync(uploadedFile.filepath);
    } catch (cleanupError) {
      console.warn('Failed to cleanup temp file:', cleanupError);
    }

    return res.status(200).json({
      text: extractedText,
      file_type: fileType,
      filename: uploadedFile.originalFilename,
      structure: structure
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: `Error processing file: ${error.message}` 
    });
  }
}