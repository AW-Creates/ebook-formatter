# 🚀 Deployment Guide

This guide will help you deploy the Ebook Formatter application to production.

## Frontend Deployment (Vercel)

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub** (if not done already):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ebook-formatter.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Sign in with GitHub
   - Click "Import Git Repository"
   - Select your `ebook-formatter` repository
   - Vercel will automatically detect it as a React app
   - Click "Deploy"

3. **Configure Environment Variables** (if needed):
   - In Vercel dashboard, go to your project settings
   - Add environment variables:
     - `REACT_APP_API_URL` = `https://your-backend-api-url.com`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Link to existing project or create new one

## Backend Deployment

### Option 1: Railway (Recommended)

1. **Prepare for Railway**:
   - Create `Procfile` in the backend directory:
     ```
     web: python app.py
     ```
   
   - Create `runtime.txt` in the backend directory:
     ```
     python-3.11.0
     ```

2. **Deploy on Railway**:
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Create "New Project" > "Deploy from GitHub repo"
   - Select your repository
   - Set root directory to `backend`
   - Add environment variables if needed

### Option 2: Heroku

1. **Install Heroku CLI** and login:
   ```bash
   heroku login
   ```

2. **Create Heroku app**:
   ```bash
   heroku create your-app-name
   ```

3. **Deploy**:
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Option 3: Render

1. Go to [render.com](https://render.com)
2. Connect GitHub repository
3. Create "Web Service"
4. Set:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.com
```

### Backend
No specific environment variables needed for basic setup.

## Post-Deployment Steps

1. **Update API URL**: After deploying the backend, update the frontend environment variable `REACT_APP_API_URL` with the actual backend URL.

2. **Test the Application**: 
   - Verify that the frontend loads correctly
   - Test text input and preview functionality  
   - Test all three download formats (EPUB, PDF, DOCX)

3. **Update README**: Replace placeholder URLs in README.md with your actual deployment URLs.

## Troubleshooting

### Frontend Issues
- **Build fails**: Check that all dependencies are installed
- **API calls fail**: Verify CORS is enabled in backend and API URL is correct

### Backend Issues
- **Dependencies fail**: Ensure requirements.txt is up to date
- **Memory issues**: PDF generation can be memory-intensive; consider upgrading hosting plan

### CORS Issues
- Ensure Flask-CORS is properly configured in backend
- Add your frontend domain to allowed origins

## Monitoring

- **Vercel**: Built-in analytics and error tracking
- **Railway/Render**: Built-in logging and metrics
- **Heroku**: Use Heroku logs: `heroku logs --tail`

## Scaling Considerations

- **Frontend**: Vercel handles scaling automatically
- **Backend**: Consider adding Redis for caching, database for user content
- **File Processing**: For high volume, consider background job processing