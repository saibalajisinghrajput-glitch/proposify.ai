#!/bin/bash

# Complete System Deployment Script
echo "🚀 Starting Complete System Deployment..."

# Step 1: Deploy Frontend to GitHub Pages
echo "📦 Deploying Frontend..."
cd frontend

# Update homepage in package.json if needed
if ! grep -q "saibalajisinghrajput-glitch.github.io/proposify.ai" package.json; then
    echo "📍 Updating homepage URL..."
    sed -i '' 's|"homepage": ".*"|"homepage": "https://saibalajisinghrajput-glitch.github.io/proposify.ai"|g' package.json
fi

# Build and deploy
npm install --silent
npm run build --silent

# Add to git and push
git add -A
git commit -m "Deploy frontend - $(date)" || echo "No changes to commit"
git push origin main || git push origin master

cd ..

# Step 2: Deploy Backend to Render
echo "🔧 Deploying Backend..."

# Create environment file for Render
cat > .env.production << EOF
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-for-production-2024-proposify-ai
MONGODB_URI=mongodb+srv://proposify-user:ProposifyAI2024@proposifyai.km9d9.mongodb.net/proposifyai?retryWrites=true&w=majority
CLIENT_URL=https://saibalajisinghrajput-glitch.github.io
OPENAI_API_KEY=
EOF

# Commit and push backend changes
cd backend
git add -A
git commit -m "Deploy backend with MongoDB fix - $(date)" || echo "No changes to commit"
git push origin main || git push origin master
cd ..

echo "✅ Deployment Complete!"
echo "Frontend: https://saibalajisinghrajput-glitch.github.io/proposify.ai"
echo "Backend: https://proposify-ai-6.onrender.com"
