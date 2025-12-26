#!/bin/bash

# GitHub Pages Frontend Deployment Script
# This script sets up and deploys the frontend to GitHub Pages

echo "🚀 Setting up GitHub Pages deployment for frontend..."

# Navigate to frontend directory
cd frontend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in frontend directory"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

# Install gh-pages if not already installed
if ! npm list gh-pages >/dev/null 2>&1; then
    echo "📦 Installing gh-pages..."
    npm install --save-dev gh-pages
fi

# Update package.json for GitHub Pages
echo "⚙️  Updating package.json for GitHub Pages..."

# Backup original package.json
cp package.json package.json.backup

# Update homepage and scripts
cat > package.json << EOF
{
  "name": "proposify-frontend",
  "version": "1.0.0",
  "description": "ProposifyAI Frontend - AI-powered proposal generation",
  "homepage": "https://saibalajisinghrajput-glitch.github.io/proposify.ai",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.3.0",
    "tailwindcss": "^3.2.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "react-scripts": "5.0.1",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "gh-pages": "^4.0.0"
  }
}
EOF

echo "✅ package.json updated for GitHub Pages"

# Create _redirects file for SPA routing
echo "🌐 Creating _redirects file for SPA routing..."
cat > build/_redirects << EOF
/*    /index.html   200
EOF

# Update API configuration
echo "🔧 Updating API configuration..."
mkdir -p src/config

cat > src/config/api.js << 'EOF'
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://proposify-ai-6.onrender.com'  // Your Render backend URL
  : 'http://localhost:5000';                // Local development

export const api = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
};

export default api;
EOF

echo "✅ API configuration updated"

# Build the project
echo "🏗️  Building the project..."
npm run build

# Deploy to GitHub Pages
echo "🚀 Deploying to GitHub Pages..."
npm run deploy

echo "🎉 Frontend deployed to GitHub Pages!"
echo "🌐 Your frontend is now available at: https://saibalajisinghrajput-glitch.github.io/proposify.ai"
echo "🔗 Backend API is at: https://proposify-ai-6.onrender.com"

# Verify deployment
echo "🔍 Verifying deployment..."
if [ -d "build" ]; then
    echo "✅ Build completed successfully"
else
    echo "❌ Build failed"
    exit 1
fi

echo "✅ GitHub Pages deployment setup complete!"
