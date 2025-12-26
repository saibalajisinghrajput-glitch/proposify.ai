#!/bin/bash

# 🚀 FIX BACKEND SUBMODULE DEPLOYMENT ISSUE

echo "🔧 Fixing backend submodule deployment issue..."

# Navigate to backend directory
cd /Users/saibalajisinghrajput/Desktop/proposifyai/backend

echo "📁 Current directory: $(pwd)"
echo "📋 Checking backend git status..."
git status

echo ""
echo "➕ Adding backend/package.json to git..."
git add package.json

echo ""
echo "💬 Committing backend changes..."
git commit -m "Add start script for Render deployment

- Add start: node server.js to backend/package.json
- Required for Render deployment
- Enables npm start command"

echo ""
echo "🚀 Pushing backend to GitHub (master branch)..."
git push origin master

echo ""
echo "✅ Backend pushed successfully!"
echo "🔄 Now updating parent repository..."

# Go back to parent repository
cd /Users/saibalajisinghrajput/Desktop/proposifyai

echo ""
echo "📋 Checking parent repo status..."
git status

echo ""
echo "➕ Adding backend submodule update..."
git add backend

echo ""
echo "💬 Committing submodule update..."
git commit -m "Update backend submodule with start script

- Backend now has start: node server.js script
- Required for Render deployment
- Enables npm start command"

echo ""
echo "🚀 Pushing parent repository to master..."
git push origin master

echo ""
echo "🎉 SUCCESS: Both repositories updated!"
echo "🌐 Expected result: Render deployment should now succeed"
echo "🔍 Next step: Check Render dashboard for successful build"

