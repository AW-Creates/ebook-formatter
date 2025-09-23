import io
from ebooklib import epub
from .text_parser import parse_text, extract_title_and_chapters
from .templates import get_template_css

def generate_epub(text: str, template_name: str, title: str = None, author: str = None) -> bytes:
    """
    Generate an EPUB file from text content with specified template styling.
    
    Args:
        text: Raw text content
        template_name: Name of the styling template to use
        title: Book title (optional, will be extracted from content if not provided)
        author: Author name (optional)
    
    Returns:
        bytes: EPUB file data
    """
    # Parse the text content
    content_blocks = parse_text(text)
    extracted_title, chapters = extract_title_and_chapters(content_blocks)
    
    # Use provided title or extracted title
    book_title = title if title and title != 'Untitled Book' else extracted_title
    book_author = author if author and author != 'Anonymous' else 'Anonymous'
    
    # Create EPUB book
    book = epub.EpubBook()
    
    # Set metadata
    book.set_identifier('ebook-formatter-' + str(hash(text))[:10])
    book.set_title(book_title)
    book.set_language('en')
    book.add_author(book_author)
    
    # Get template CSS
    css_content = get_template_css(template_name)
    
    # Create CSS file
    nav_css = epub.EpubItem(
        uid="nav_css",
        file_name="style/nav.css",
        media_type="text/css",
        content=css_content
    )
    book.add_item(nav_css)
    
    # Create chapters
    epub_chapters = []
    spine = ['nav']
    
    for i, chapter in enumerate(chapters):
        chapter_id = f'chapter_{i+1}'
        chapter_filename = f'chapter_{i+1}.xhtml'
        
        # Build chapter content
        chapter_html = f'''<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>{chapter['title']}</title>
    <link rel="stylesheet" type="text/css" href="style/nav.css"/>
</head>
<body>
    <h{chapter['level']} class="chapter-heading">{chapter['title']}</h{chapter['level']}>
'''
        
        for paragraph in chapter['content']:
            chapter_html += f'    <p class="paragraph">{paragraph}</p>\n'
        
        chapter_html += '''</body>
</html>'''
        
        # Create EPUB chapter
        epub_chapter = epub.EpubHtml(
            title=chapter['title'],
            file_name=chapter_filename,
            lang='en'
        )
        epub_chapter.content = chapter_html
        
        # Add chapter to book
        book.add_item(epub_chapter)
        epub_chapters.append(epub_chapter)
        spine.append(epub_chapter)
    
    # Define Table of Contents
    book.toc = tuple(epub_chapters)
    
    # Add navigation files
    book.add_item(epub.EpubNcx())
    book.add_item(epub.EpubNav())
    
    # Define CSS style
    book.spine = spine
    
    # Generate EPUB file
    epub_io = io.BytesIO()
    epub.write_epub(epub_io, book, {})
    epub_io.seek(0)
    
    return epub_io.read()