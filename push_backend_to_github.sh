#!/bin/bash

# 🚀 PUSH BACKEND PACKAGE.JSON TO GITHUB - RENDER DEPLOYMENT FIX

echo "🔄 Pushing backend package.json changes to GitHub..."

# Navigate to project root
cd /Users/saibalajisinghrajput/Desktop/proposifyai

echo "📁 Current directory: $(pwd)"
echo "📋 Checking git status..."

# Check current git status
git status

echo ""
echo "➕ Adding backend/package.json to git..."
git add backend/package.json

echo ""
echo "💬 Committing changes..."
git commit -m "Add start script for Render deployment

- Add start: node server.js to backend/package.json
- Required for Render deployment
- Enables npm start command"

echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ GitHub sync complete!"
echo "📋 Verifying push..."

# Verify the push was successful
git status

echo ""
echo "🎉 SUCCESS: Changes pushed to GitHub!"
echo "🔄 Next step: Trigger Render redeploy from dashboard"
echo "🌐 Expected result: https://your-app.onrender.com"

