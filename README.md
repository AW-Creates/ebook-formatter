# 📚 Ebook Formatting Web Application

A professional web application that allows authors to format their books by pasting text, selecting styling templates, and downloading publication-ready files in multiple formats (EPUB, PDF, Word).

![Ebook Formatter Demo](https://via.placeholder.com/800x400/2563eb/ffffff?text=Ebook+Formatter+Demo)

## 🚀 Live Demo

- **Frontend**: [https://your-app.vercel.app](https://your-app.vercel.app)
- **API**: [https://your-api.herokuapp.com](https://your-api.herokuapp.com)

## ✨ Features

- **Dual-Pane Interface**: Text input on the left, live preview on the right
- **Smart Text Parsing**: Automatically detects chapter headings and structures content
- **Professional Templates**: 4 beautiful styling options (Classic, Modern, Elegant, Sci-Fi)
- **Multi-Format Export**: Generate EPUB, PDF, and Word documents
- **Real-Time Preview**: See your book's formatting as you type
- **Responsive Design**: Works perfectly on desktop and mobile

## 🏗️ Project Structure

```
ebook-formatter/
├── frontend/          # React TypeScript application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # Styling templates
│   └── public/
├── backend/           # Flask API server
│   ├── generators/        # File generation modules
│   │   ├── epub_generator.py
│   │   ├── pdf_generator.py
│   │   ├── docx_generator.py
│   │   ├── text_parser.py
│   │   └── templates.py
│   └── app.py
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React** with TypeScript
- **Custom CSS** (Tailwind-inspired)
- **Responsive Design**

### Backend
- **Flask** (Python)
- **ebooklib** - EPUB generation
- **ReportLab** - PDF generation
- **python-docx** - Word document generation
- **Flask-CORS** - Cross-origin requests

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ and npm
- Python 3.8+
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ebook-formatter.git
   cd ebook-formatter
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # macOS/Linux
   pip install -r requirements.txt
   python app.py
   ```
   The API will be available at `http://localhost:5000`

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```
   The app will be available at `http://localhost:3000`

## 📦 Deployment

### Frontend (Vercel)
The frontend is automatically deployed to Vercel from the main branch.

### Backend (Heroku/Railway)
The backend API can be deployed to any Python hosting service.

## 🎯 How to Use

1. **Enter Book Details**: Add your book title and author name
2. **Paste Your Content**: Copy and paste your manuscript into the left pane
3. **Choose a Template**: Select from Classic, Modern, Elegant, or Sci-Fi styles
4. **Preview**: See your formatted book in the right pane
5. **Download**: Choose EPUB, PDF, or Word format and download your file

## 📖 Template Styles

- **Classic**: Traditional serif fonts with elegant margins
- **Modern**: Clean sans-serif design with minimal styling  
- **Elegant**: Sophisticated typography with refined spacing
- **Sci-Fi**: Futuristic monospace fonts with tech-inspired design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for accessible book formatting tools
- Thanks to the open-source community for the amazing libraries
