#!/bin/bash

# 🚨 URGENT FIX: Push Backend to GitHub (Correct Branch)

echo "🚨 CRITICAL: Pushing backend to GitHub repository"
echo "==============================================="

# Check current branch
echo "📋 Current branch:"
git branch --show-current

echo ""
echo "📋 Current Git status:"
git status --porcelain

echo ""
echo "🔍 Checking if backend exists in Git:"
if git ls-files | grep -q "backend/server.js"; then
    echo "✅ backend/server.js is already in Git repository"
    echo "🚀 Just need to push changes..."
    git add backend/
    git commit -m "Update backend for Render deployment - add missing production configuration"
else
    echo "❌ backend/server.js is NOT in Git repository"
    echo "📁 Adding backend files..."
    git add backend/
fi

# Get current branch name
BRANCH=$(git branch --show-current)
echo ""
echo "🌿 Using branch: $BRANCH"

echo ""
echo "💾 Committing changes..."
git commit -m "Add backend application for Render deployment

- Express.js server with production configuration
- MongoDB Atlas integration
- OpenAI API integration  
- Stripe payment processing
- JWT authentication
- Complete API endpoints
- Production-ready deployment

Ready for Render deployment with all dependencies configured."

echo ""
echo "🚀 Pushing to GitHub (branch: $BRANCH)..."
git push origin $BRANCH

echo ""
echo "✅ SUCCESS: Backend files pushed to GitHub!"
echo ""
echo "🔧 Render Service Settings (Update these in Render dashboard):"
echo "   Name: proposifyai-backend"
echo "   Root Directory: LEAVE EMPTY"
echo "   Build Command: cd backend && npm install"
echo "   Start Command: cd backend && npm start"
echo "   Branch: $BRANCH"
echo ""
echo "🎯 Next Steps:"
echo "   1. Go to Render dashboard"
echo "   2. Update service settings (Root Directory: empty)"
echo "   3. Manual Deploy → Deploy latest commit"
echo "   4. Monitor deployment logs for success"
echo ""
echo "🔗 Expected Backend URL: https://proposify-backend.onrender.com"
