import os
import io
from typing import Union, Tuple
from docx import Document
import PyPDF2
import tempfile

def extract_text_from_file(file_data: bytes, filename: str) -> Tuple[str, str]:
    """
    Extract text from uploaded file based on file extension.
    
    Args:
        file_data: Raw file data
        filename: Original filename with extension
        
    Returns:
        Tuple of (extracted_text, file_type)
    """
    file_ext = os.path.splitext(filename)[1].lower()
    
    if file_ext == '.txt':
        return extract_from_txt(file_data), 'text'
    elif file_ext == '.docx':
        return extract_from_docx(file_data), 'docx'
    elif file_ext == '.pdf':
        return extract_from_pdf(file_data), 'pdf'
    else:
        raise ValueError(f"Unsupported file format: {file_ext}")

def extract_from_txt(file_data: bytes) -> str:
    """Extract text from .txt file."""
    try:
        # Try UTF-8 first
        return file_data.decode('utf-8')
    except UnicodeDecodeError:
        # Fallback to latin-1
        return file_data.decode('latin-1', errors='ignore')

def extract_from_docx(file_data: bytes) -> str:
    """Extract text from .docx file."""
    with tempfile.NamedTemporaryFile() as temp_file:
        temp_file.write(file_data)
        temp_file.flush()
        
        doc = Document(temp_file.name)
        text_content = []
        
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                text_content.append(paragraph.text.strip())
        
        return '\n\n'.join(text_content)

def extract_from_pdf(file_data: bytes) -> str:
    """Extract text from .pdf file."""
    with io.BytesIO(file_data) as pdf_stream:
        pdf_reader = PyPDF2.PdfReader(pdf_stream)
        text_content = []
        
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text.strip():
                text_content.append(page_text.strip())
        
        return '\n\n'.join(text_content)

def detect_document_structure(text: str) -> dict:
    """
    Analyze document structure to detect different text elements.
    
    Args:
        text: Raw text content
        
    Returns:
        Dictionary with detected structure information
    """
    lines = text.split('\n')
    structure = {
        'headings': [],
        'quotes': [],
        'lists': [],
        'emphasis': [],
        'total_lines': len(lines),
        'word_count': len(text.split())
    }
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
            
        # Detect potential headings (short lines, all caps, or numbered)
        if len(line) < 80 and (
            line.isupper() or 
            line.startswith(('Chapter', 'CHAPTER', 'Part', 'PART')) or
            any(char.isdigit() for char in line[:10])
        ):
            structure['headings'].append({
                'text': line,
                'line_number': i,
                'type': 'heading'
            })
        
        # Detect quotes (lines starting with quotes or indented)
        if line.startswith(('"', "'", '"', '"')) or line.startswith('    '):
            structure['quotes'].append({
                'text': line,
                'line_number': i,
                'type': 'quote'
            })
        
        # Detect lists (lines starting with bullets, numbers, or dashes)
        if line.startswith(('•', '*', '-', '1.', '2.', '3.', 'a.', 'b.', 'c.')):
            structure['lists'].append({
                'text': line,
                'line_number': i,
                'type': 'list_item'
            })
    
    return structure