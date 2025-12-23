#!/bin/bash

# 🚀 Quick Deployment Script for ProposifyAI
# Usage: ./quick-deploy.sh

echo "🚀 ProposifyAI Quick Deployment Script"
echo "======================================"

# Check if git repository exists
if [ ! -d ".git" ]; then
    echo "❌ No git repository found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin YOUR_REPO_URL"
    echo "   git push -u origin main"
    exit 1
fi

echo "✅ Git repository found"

# Check if production files exist
if [ ! -f "backend/.env.production" ] || [ ! -f "frontend/.env.production" ]; then
    echo "📋 Running production preparation..."
    node deploy-production.js full
fi

echo ""
echo "🎯 DEPLOYMENT READY!"
echo ""
echo "Next steps:"
echo "1. 🔧 Backend → https://railway.app"
echo "   - Deploy from GitHub repo"
echo "   - Select 'backend' folder"
echo "   - Add environment variables from backend/.env.production"
echo ""
echo "2. 🎨 Frontend → https://vercel.com"
echo "   - Deploy from GitHub repo"
echo "   - Root Directory: 'frontend'"
echo "   - Add environment variables from frontend/.env.production"
echo ""
echo "3. 🔄 Update CORS:"
echo "   - Add your Vercel URL to Railway CLIENT_URL"
echo "   - Restart Railway service"
echo ""
echo "4. 🌐 Test your live app!"
echo ""
echo "💡 Need help? Check DEPLOY_NOW_GUIDE.md for detailed instructions"
echo "🎉 Your AI app will be live in 30 minutes!"

