# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is an ebook formatting web application that converts text into publication-ready formats (EPUB, PDF, Word). The architecture consists of:

- **Frontend**: React TypeScript SPA with dual-pane editor/preview interface
- **Backend**: Flask API with format generation capabilities
- **Deployment**: Frontend on Vercel, Backend on Railway/Heroku/Render

## Development Commands

### Frontend (React TypeScript)
```bash
# Development server
cd frontend && npm start        # Starts dev server at http://localhost:3000
npm start                       # If already in root (uses root package.json)

# Build and deployment  
cd frontend && npm run build    # Production build
npm run vercel-build           # Vercel-specific build command

# Testing
cd frontend && npm test        # Run test suite
```

### Backend (Flask Python)
```bash
# Setup virtual environment (Windows)
cd backend
python -m venv venv
venv\Scripts\activate

# Install dependencies and run
pip install -r requirements.txt
python app.py                  # Starts API server at http://localhost:5000

# Alternative: Set Flask environment
set FLASK_ENV=development && python app.py
```

### Full Stack Development
Run both servers simultaneously:
1. Backend: `cd backend && python app.py` (port 5000)
2. Frontend: `cd frontend && npm start` (port 3000)

## Architecture Overview

### Frontend Structure (`src/`)
- **App.tsx**: Main component with dual-pane layout, file upload, and template selection
- **components/**: Reusable React components
  - `DownloadButton.tsx`: Multi-format download with API integration
  - `ImageUpload.tsx`: Image insertion for manuscripts  
  - `PreviewPane.tsx`: Real-time formatted preview
  - `Toast.tsx`: Notification system
- **styles/**: CSS template definitions (classic, modern, elegant, sci-fi)

### Backend Structure (`backend/`)
- **app.py**: Flask API with CORS, file upload, and format generation endpoints
- **generators/**: Core formatting modules
  - `epub_generator.py`: EPUB format generation using ebooklib
  - `pdf_generator.py`: PDF generation using ReportLab
  - `docx_generator.py`: Word document generation using python-docx
  - `document_parser.py`: Text extraction from uploaded files
  - `templates.py`: CSS styling definitions for all templates
  - `text_parser.py`: Chapter detection and text structuring

### Key API Endpoints
- `POST /api/generate-epub` - Generate EPUB file
- `POST /api/generate-pdf` - Generate PDF file  
- `POST /api/generate-docx` - Generate Word document
- `POST /api/upload-document` - Extract text from uploaded files
- `GET /api/templates` - Get available styling templates

## Template System

The application uses a template-based styling system with four predefined styles:

1. **Classic**: Traditional serif fonts with generous margins
2. **Modern**: Clean sans-serif with minimal styling
3. **Elegant**: Sophisticated typography with refined spacing
4. **Sci-Fi**: Futuristic monospace with dark theme

Templates are defined in `backend/generators/templates.py` with CSS styling and applied during format generation.

## File Processing Flow

1. User uploads document or pastes text
2. Frontend sends content to appropriate API endpoint
3. Backend parses text structure (chapters, paragraphs)
4. Template CSS is applied based on user selection
5. Format-specific generator creates output file
6. File is returned as download response

## Development Environment Setup

### Prerequisites
- Node.js 14+ and npm
- Python 3.8+ 
- Git

### Environment Variables
- Frontend: `REACT_APP_API_URL` (points to backend API)
- Backend: `FLASK_ENV`, `PORT` (optional)

## Testing Strategy

- Frontend uses React Testing Library and Jest
- Run tests with `npm test` in frontend directory
- Backend testing would require pytest (not currently implemented)

## Deployment Architecture

- **Frontend**: Deployed to Vercel with automatic GitHub integration
- **Backend**: Deployed to Railway/Heroku/Render with Python runtime
- **CORS**: Configured in Flask backend to allow frontend domain
- **File Storage**: Uses temporary files for downloads (no persistent storage)

## Performance Considerations

- PDF generation can be memory-intensive for large documents
- File downloads use temporary file system (cleanup handled automatically)
- Frontend preview updates in real-time as user types
- API endpoints process files synchronously (no background jobs)

## Common Issues

- **CORS errors**: Ensure Flask-CORS is configured and API_URL is correct
- **Memory issues**: PDF generation may require hosting plan upgrades
- **File upload limits**: Backend configured for 16MB max file size
- **Template rendering**: CSS styles applied server-side during generation

## Project-Specific Rules

- All React components should be TypeScript with proper interface definitions
- Use custom CSS classes following existing naming conventions
- Backend generators should handle errors gracefully and return proper HTTP status codes
- Template CSS must be compatible with all three output formats (EPUB, PDF, DOCX)
- File operations should use temporary files with proper cleanup