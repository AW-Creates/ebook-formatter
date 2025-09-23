import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from .text_parser import parse_text, extract_title_and_chapters

def generate_pdf(text: str, template_name: str, title: str = None, author: str = None) -> bytes:
    """
    Generate a PDF file from text content with specified template styling using ReportLab.
    
    Args:
        text: Raw text content
        template_name: Name of the styling template to use
        title: Book title (optional, will be extracted from content if not provided)
        author: Author name (optional)
    
    Returns:
        bytes: PDF file data
    """
    # Parse the text content
    content_blocks = parse_text(text)
    extracted_title, chapters = extract_title_and_chapters(content_blocks)
    
    # Use provided title or extracted title
    book_title = title if title and title != 'Untitled Book' else extracted_title
    book_author = author if author and author != 'Anonymous' else 'Anonymous'
    
    # Create PDF buffer
    buffer = io.BytesIO()
    
    # Create document
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=18
    )
    
    # Get styles and create custom ones based on template
    styles = getSampleStyleSheet()
    story = []
    
    # Create template-specific styles
    title_style, heading_style, paragraph_style = get_template_styles(styles, template_name)
    
    # Add title page
    story.append(Spacer(1, 2*inch))
    story.append(Paragraph(book_title, title_style))
    story.append(Spacer(1, 0.5*inch))
    story.append(Paragraph(f"by {book_author}", styles['Normal']))
    story.append(PageBreak())
    
    # Add chapters
    for i, chapter in enumerate(chapters):
        if i > 0:  # Add page break before each chapter (except first)
            story.append(PageBreak())
        
        # Add chapter heading
        story.append(Spacer(1, 0.3*inch))
        story.append(Paragraph(chapter['title'], heading_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Add chapter content
        for paragraph_text in chapter['content']:
            # Clean up the text for PDF
            clean_text = paragraph_text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            story.append(Paragraph(clean_text, paragraph_style))
            story.append(Spacer(1, 12))
    
    # Build PDF
    doc.build(story)
    
    # Get PDF bytes
    buffer.seek(0)
    return buffer.read()

def get_template_styles(base_styles, template_name: str):
    """
    Create template-specific styles for PDF generation.
    """
    if template_name == 'classic':
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=base_styles['Title'],
            fontSize=24,
            alignment=TA_CENTER,
            fontName='Times-Bold',
            spaceAfter=30
        )
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=base_styles['Heading1'],
            fontSize=18,
            alignment=TA_CENTER,
            fontName='Times-Bold',
            spaceAfter=18
        )
        paragraph_style = ParagraphStyle(
            'CustomParagraph',
            parent=base_styles['Normal'],
            fontSize=12,
            fontName='Times-Roman',
            alignment=TA_JUSTIFY,
            leftIndent=20
        )
    
    elif template_name == 'modern':
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=base_styles['Title'],
            fontSize=28,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold',
            spaceAfter=30
        )
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=base_styles['Heading1'],
            fontSize=20,
            alignment=TA_LEFT,
            fontName='Helvetica-Bold',
            spaceAfter=16
        )
        paragraph_style = ParagraphStyle(
            'CustomParagraph',
            parent=base_styles['Normal'],
            fontSize=11,
            fontName='Helvetica',
            alignment=TA_LEFT
        )
    
    elif template_name == 'elegant':
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=base_styles['Title'],
            fontSize=26,
            alignment=TA_CENTER,
            fontName='Times-Bold',
            spaceAfter=30
        )
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=base_styles['Heading1'],
            fontSize=16,
            alignment=TA_CENTER,
            fontName='Times-Bold',
            spaceAfter=20
        )
        paragraph_style = ParagraphStyle(
            'CustomParagraph',
            parent=base_styles['Normal'],
            fontSize=12,
            fontName='Times-Roman',
            alignment=TA_JUSTIFY,
            leftIndent=15
        )
    
    elif template_name == 'scifi':
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=base_styles['Title'],
            fontSize=22,
            alignment=TA_CENTER,
            fontName='Courier-Bold',
            spaceAfter=30
        )
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=base_styles['Heading1'],
            fontSize=14,
            alignment=TA_LEFT,
            fontName='Courier-Bold',
            spaceAfter=14
        )
        paragraph_style = ParagraphStyle(
            'CustomParagraph',
            parent=base_styles['Normal'],
            fontSize=10,
            fontName='Courier',
            alignment=TA_LEFT,
            leftIndent=10
        )
    
    else:  # Default to classic
        return get_template_styles(base_styles, 'classic')
    
    return title_style, heading_style, paragraph_style
