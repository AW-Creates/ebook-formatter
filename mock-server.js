const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock API endpoints
app.get('/', (req, res) => {
  res.json({
    message: "Ebook Formatter Mock API",
    version: "1.0.0",
    endpoints: [
      "/api/generate-epub",
      "/api/generate-pdf", 
      "/api/generate-docx"
    ]
  });
});

app.post('/api/generate-epub', (req, res) => {
  const { text, template_name, title, author } = req.body;
  
  // Mock response - in real implementation, this would generate an EPUB
  setTimeout(() => {
    res.json({
      success: true,
      message: 'EPUB generation complete',
      filename: `${title.replace(/[^a-z0-9]/gi, '_')}.epub`
    });
  }, 2000); // Simulate processing time
});

app.post('/api/generate-pdf', (req, res) => {
  const { text, template_name, title, author } = req.body;
  
  // Mock response - in real implementation, this would generate a PDF
  setTimeout(() => {
    res.json({
      success: true,
      message: 'PDF generation complete',
      filename: `${title.replace(/[^a-z0-9]/gi, '_')}.pdf`
    });
  }, 2000);
});

app.post('/api/generate-docx', (req, res) => {
  const { text, template_name, title, author } = req.body;
  
  // Mock response - in real implementation, this would generate a DOCX
  setTimeout(() => {
    res.json({
      success: true,
      message: 'DOCX generation complete', 
      filename: `${title.replace(/[^a-z0-9]/gi, '_')}.docx`
    });
  }, 2000);
});

app.post('/api/upload-document', (req, res) => {
  // Mock file upload response
  res.json({
    text: 'Sample extracted text from uploaded document...\n\nChapter 1\nThe Beginning\n\nThis is sample content that would be extracted from your uploaded file.',
    file_type: 'text',
    filename: 'uploaded-document.txt',
    structure: {
      chapters: 1,
      paragraphs: 3,
      word_count: 50
    }
  });
});

app.get('/api/templates', (req, res) => {
  res.json({
    'classic': {
      'name': 'Classic',
      'description': 'Traditional book styling with serif fonts'
    },
    'modern': {
      'name': 'Modern',
      'description': 'Clean, contemporary design with sans-serif fonts'
    },
    'elegant': {
      'name': 'Elegant',
      'description': 'Sophisticated typography with elegant spacing'
    },
    'scifi': {
      'name': 'Sci-Fi',
      'description': 'Futuristic styling perfect for science fiction'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
});