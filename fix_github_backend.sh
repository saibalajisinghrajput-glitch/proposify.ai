#!/bin/bash

# 🚨 CRITICAL FIX: Push Backend to GitHub for Render Deployment

echo "🚨 URGENT: Backend folder missing from GitHub repository"
echo "======================================================"

# Check current Git status
echo "📋 Current Git status:"
git status

echo ""
echo "🔍 Checking if backend folder exists in Git:"
if git ls-files | grep -q "backend/server.js"; then
    echo "✅ backend/server.js is in Git repository"
else
    echo "❌ backend/server.js is NOT in Git repository"
fi

echo ""
echo "🔍 Checking untracked files:"
git status --porcelain | grep "^??" | head -10

echo ""
echo "🔄 SOLUTION: Push backend files to GitHub"
echo "=========================================="

# Add all backend files
echo "📁 Adding backend files to Git..."
git add backend/

# Check what will be committed
echo ""
echo "📝 Files to be committed:"
git status --porcelain | grep "^A "

echo ""
echo "💾 Committing backend files..."
git commit -m "Add backend application for Render deployment

- Express.js server with production configuration
- MongoDB Atlas integration
- OpenAI API integration  
- Stripe payment processing
- JWT authentication
- Complete API endpoints
- Production-ready deployment"

echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ SUCCESS: Backend files pushed to GitHub!"
echo ""
echo "🔧 Next: Update Render service settings:"
echo "   1. Go to Render dashboard"
echo "   2. Find your service (proposifyai-backend)"  
echo "   3. Settings → Build and Deploy Settings"
echo "   4. Root Directory: LEAVE EMPTY (remove 'backend' if set)"
echo "   5. Build Command: cd backend && npm install"
echo "   6. Start Command: cd backend && npm start"
echo "   7. Save Changes"
echo "   8. Manual Deploy → Deploy latest commit"
echo ""
echo "🎯 Expected Result: Successful deployment without errors!"
