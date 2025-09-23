from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import tempfile
import io
from datetime import datetime
import re

# Import our file generators
from generators.epub_generator import generate_epub
from generators.pdf_generator import generate_pdf  
from generators.docx_generator import generate_docx
from generators.document_parser import extract_text_from_file, detect_document_structure

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains on all routes

# Configure file uploads
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def home():
    return jsonify({
        "message": "Ebook Formatter API",
        "version": "1.0.0",
        "endpoints": [
            "/api/generate-epub",
            "/api/generate-pdf", 
            "/api/generate-docx"
        ]
    })

@app.route('/api/generate-epub', methods=['POST'])
def generate_epub_endpoint():
    try:
        data = request.json
        text = data.get('text', '')
        template_name = data.get('template_name', 'classic')
        title = data.get('title', 'Untitled Book')
        author = data.get('author', 'Anonymous')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
            
        # Generate EPUB file
        epub_data = generate_epub(text, template_name, title, author)
        
        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.epub')
        temp_file.write(epub_data)
        temp_file.close()
        
        return send_file(
            temp_file.name,
            as_attachment=True,
            download_name=f"{title.replace(' ', '_')}.epub",
            mimetype='application/epub+zip'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-pdf', methods=['POST'])
def generate_pdf_endpoint():
    try:
        data = request.json
        text = data.get('text', '')
        template_name = data.get('template_name', 'classic')
        title = data.get('title', 'Untitled Book')
        author = data.get('author', 'Anonymous')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
            
        # Generate PDF file
        pdf_data = generate_pdf(text, template_name, title, author)
        
        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
        temp_file.write(pdf_data)
        temp_file.close()
        
        return send_file(
            temp_file.name,
            as_attachment=True,
            download_name=f"{title.replace(' ', '_')}.pdf",
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-docx', methods=['POST'])
def generate_docx_endpoint():
    try:
        data = request.json
        text = data.get('text', '')
        template_name = data.get('template_name', 'classic')
        title = data.get('title', 'Untitled Book')
        author = data.get('author', 'Anonymous')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
            
        # Generate DOCX file
        docx_data = generate_docx(text, template_name, title, author)
        
        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.docx')
        temp_file.write(docx_data.getvalue())
        temp_file.close()
        
        return send_file(
            temp_file.name,
            as_attachment=True,
            download_name=f"{title.replace(' ', '_')}.docx",
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload-document', methods=['POST'])
def upload_document():
    """Handle document upload and text extraction"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not supported. Please upload .txt, .docx, or .pdf files'}), 400
        
        # Read file data
        file_data = file.read()
        
        # Extract text from file
        extracted_text, file_type = extract_text_from_file(file_data, file.filename)
        
        # Analyze document structure
        structure = detect_document_structure(extracted_text)
        
        return jsonify({
            'text': extracted_text,
            'file_type': file_type,
            'filename': file.filename,
            'structure': structure
        })
        
    except Exception as e:
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500

@app.route('/api/templates', methods=['GET'])
def get_templates():
    """Get available styling templates"""
    templates = {
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
    }
    return jsonify(templates)

if __name__ == '__main__':
    # Ensure generators directory exists
    os.makedirs('generators', exist_ok=True)
    
    # Get port from environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    
    # Run in debug mode only in development
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
