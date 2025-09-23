import { Template } from '../utils/textParser';

export const templates: Record<string, Template> = {
  classic: {
    name: 'Classic',
    description: 'Traditional book styling with serif fonts and generous margins',
    css: `
      font-family: 'Georgia', 'Times New Roman', serif;
      line-height: 1.6;
      font-size: 14px;
      color: #2a2a2a;
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
      background: white;
      
      .chapter-heading {
        font-size: 24px;
        font-weight: 600;
        text-align: center;
        margin: 60px 0 40px 0;
        page-break-before: always;
        color: #1a1a1a;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 10px;
      }
      
      .paragraph {
        margin-bottom: 20px;
        text-align: justify;
        text-indent: 2em;
      }
      
      .paragraph:first-of-type {
        text-indent: 0;
      }
    `
  },
  
  modern: {
    name: 'Modern',
    description: 'Clean, contemporary design with sans-serif fonts and minimal styling',
    css: `
      font-family: 'Helvetica', 'Arial', sans-serif;
      line-height: 1.5;
      font-size: 15px;
      color: #374151;
      max-width: 650px;
      margin: 0 auto;
      padding: 30px 25px;
      background: white;
      
      .chapter-heading {
        font-size: 28px;
        font-weight: 300;
        margin: 50px 0 30px 0;
        page-break-before: always;
        color: #1f2937;
        border-left: 4px solid #3b82f6;
        padding-left: 20px;
      }
      
      .paragraph {
        margin-bottom: 18px;
        text-align: left;
      }
    `
  },
  
  elegant: {
    name: 'Elegant',
    description: 'Sophisticated typography with elegant spacing and refined details',
    css: `
      font-family: 'Georgia', 'Palatino', serif;
      line-height: 1.7;
      font-size: 14px;
      color: #1f2937;
      max-width: 580px;
      margin: 0 auto;
      padding: 50px 30px;
      background: white;
      
      .chapter-heading {
        font-size: 26px;
        font-weight: 400;
        text-align: center;
        margin: 80px 0 50px 0;
        page-break-before: always;
        color: #111827;
        text-transform: uppercase;
        letter-spacing: 2px;
        border-top: 1px solid #d1d5db;
        border-bottom: 1px solid #d1d5db;
        padding: 20px 0;
      }
      
      .paragraph {
        margin-bottom: 22px;
        text-align: justify;
        text-indent: 1.5em;
      }
      
      .paragraph:first-of-type {
        text-indent: 0;
        font-variant: small-caps;
      }
    `
  },
  
  scifi: {
    name: 'Sci-Fi',
    description: 'Futuristic styling with modern fonts and tech-inspired design',
    css: `
      font-family: 'Courier New', 'Monaco', monospace;
      line-height: 1.4;
      font-size: 13px;
      color: #059669;
      max-width: 700px;
      margin: 0 auto;
      padding: 25px;
      background: #0f172a;
      border-radius: 8px;
      
      .chapter-heading {
        font-size: 22px;
        font-weight: 700;
        text-align: left;
        margin: 40px 0 25px 0;
        page-break-before: always;
        color: #06b6d4;
        text-transform: uppercase;
        border: 2px solid #164e63;
        padding: 15px 20px;
        background: #0c4a6e;
        letter-spacing: 1px;
      }
      
      .paragraph {
        margin-bottom: 16px;
        text-align: left;
        padding-left: 15px;
        border-left: 2px solid #065f46;
      }
    `
  }
};