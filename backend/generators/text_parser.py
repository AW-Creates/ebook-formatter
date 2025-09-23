import re
from typing import List, Dict, Tuple

def parse_text(text: str) -> List[Dict[str, str]]:
    """
    Parse raw text into structured content with chapters and paragraphs.
    
    Args:
        text (str): Raw text input from user
        
    Returns:
        List[Dict]: List of content blocks with type and content
    """
    if not text.strip():
        return []
    
    lines = text.strip().split('\n')
    content_blocks = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Check if line is a chapter heading
        if is_chapter_heading(line):
            content_blocks.append({
                'type': 'chapter',
                'content': line,
                'level': get_heading_level(line)
            })
        else:
            content_blocks.append({
                'type': 'paragraph',
                'content': line
            })
    
    return content_blocks

def is_chapter_heading(line: str) -> bool:
    """
    Determine if a line is likely a chapter heading.
    
    Args:
        line (str): Line of text to check
        
    Returns:
        bool: True if line appears to be a chapter heading
    """
    line_lower = line.lower().strip()
    
    # Common chapter patterns
    chapter_patterns = [
        r'^chapter\s+\d+',
        r'^chapter\s+[ivxlcdm]+',  # Roman numerals
        r'^ch\s+\d+',
        r'^\d+\.\s',  # "1. Chapter title"
        r'^prologue$',
        r'^epilogue$',
        r'^introduction$',
        r'^preface$',
        r'^acknowledgments?$',
        r'^acknowledgements?$',
        r'^about\s+the\s+author$',
        r'^part\s+[ivxlcdm]+',
        r'^part\s+\d+',
        r'^book\s+[ivxlcdm]+',
        r'^book\s+\d+'
    ]
    
    for pattern in chapter_patterns:
        if re.match(pattern, line_lower):
            return True
    
    # Check if line is all caps and short (likely a title)
    if line.isupper() and len(line) < 50:
        return True
    
    # Check if line is significantly shorter than average paragraph
    # and doesn't end with punctuation (except question/exclamation marks for titles)
    if len(line) < 100 and not line.endswith(('.', ',')):
        # Additional check: if it contains typical title words
        title_words = ['chapter', 'prologue', 'epilogue', 'part', 'book']
        if any(word in line_lower for word in title_words):
            return True
    
    return False

def get_heading_level(line: str) -> int:
    """
    Determine the heading level (1-6) for a chapter heading.
    
    Args:
        line (str): Chapter heading line
        
    Returns:
        int: Heading level (1-6)
    """
    line_lower = line.lower().strip()
    
    # Main chapters are level 1
    if re.match(r'^chapter\s+\d+', line_lower):
        return 1
    
    # Parts/Books are higher level (smaller number = higher level)
    if re.match(r'^(part|book)\s+', line_lower):
        return 1
    
    # Prologue, epilogue are level 1
    if line_lower in ['prologue', 'epilogue']:
        return 1
    
    # Introduction, preface are level 2
    if line_lower in ['introduction', 'preface']:
        return 2
    
    # Acknowledgments, about author are level 3
    if re.match(r'^(acknowledgments?|acknowledgements?|about\s+the\s+author)$', line_lower):
        return 3
    
    # Default to level 1 for other headings
    return 1

def extract_title_and_chapters(content_blocks: List[Dict[str, str]]) -> Tuple[str, List[Dict[str, str]]]:
    """
    Extract book title and organize chapters.
    
    Args:
        content_blocks: List of parsed content blocks
        
    Returns:
        Tuple of (book_title, chapters_list)
    """
    if not content_blocks:
        return "Untitled Book", []
    
    title = "Untitled Book"
    chapters = []
    current_chapter = None
    
    for block in content_blocks:
        if block['type'] == 'chapter':
            # If we have a previous chapter, save it
            if current_chapter:
                chapters.append(current_chapter)
            
            # Start new chapter
            current_chapter = {
                'title': block['content'],
                'level': block['level'],
                'content': []
            }
            
            # If this is the first heading and looks like a book title, use it
            if not chapters and len(chapters) == 0 and not re.match(r'^chapter\s+\d+', block['content'].lower()):
                title = block['content']
            
        elif block['type'] == 'paragraph':
            if current_chapter:
                current_chapter['content'].append(block['content'])
            else:
                # Content before any chapter heading - create a default chapter
                if not current_chapter:
                    current_chapter = {
                        'title': 'Chapter 1',
                        'level': 1,
                        'content': []
                    }
                current_chapter['content'].append(block['content'])
    
    # Don't forget the last chapter
    if current_chapter:
        chapters.append(current_chapter)
    
    return title, chapters