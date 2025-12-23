#!/bin/bash

echo "🚀 Deploying ProposifyAI Backend to Render..."

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: backend/package.json not found. Please run from project root."
    exit 1
fi

echo "✅ Backend files found"

# Install dependencies
echo "📦 Installing dependencies..."
cd backend
npm install --production

echo "✅ Dependencies installed"

# Test the server locally first
echo "🧪 Testing backend locally..."
node -e "
const app = require('./server');
console.log('✅ Backend server can be instantiated');
"

echo "🎉 Backend ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push code to GitHub repository"
echo "2. Go to render.com and create new Web Service"
echo "3. Connect your GitHub repository"
echo "4. Set build command: cd backend && npm install"
echo "5. Set start command: cd backend && npm start"
echo "6. Configure environment variables as shown in PRODUCTION_DEPLOYMENT_COMPLETE.md"
echo ""
echo "Backend deployment configuration is ready!"
