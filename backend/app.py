from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import tempfile
import io
from datetime import datetime
import re

# Import our file generators
from generators.epub_generator import generate_epub
from generators.pdf_generator import generate_pdf  
from generators.docx_generator import generate_docx

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains on all routes

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
    app.run(debug=True, host='0.0.0.0', port=5000)