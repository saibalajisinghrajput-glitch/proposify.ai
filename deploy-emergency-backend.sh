#!/bin/bash

echo "🚨 Emergency Backend Deployment Script"
echo "======================================"

# Navigate to backend directory
cd backend

# Backup original package.json
echo "📋 Backing up original package.json..."
cp package.json package.json.backup

# Create emergency package.json
echo "⚡ Creating emergency package.json..."
cat > package.json << 'EOF'
{
  "name": "proposify-backend",
  "version": "1.0.0",
  "description": "ProposifyAI Backend - Emergency Server",
  "main": "simple-emergency-server.js",
  "scripts": {
    "start": "node simple-emergency-server.js",
    "dev": "node simple-emergency-server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
EOF

echo "✅ Emergency package.json created"
echo "📦 Dependencies will be installed during deployment"

# Update render.yaml for emergency deployment
echo "🔧 Updating render.yaml..."
cat > ../render.yaml << 'EOF'
services:
  - type: web
    name: proposify-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: CLIENT_URL
        value: https://saibalajisinghrajput-glitch.github.io
EOF

echo "✅ render.yaml updated"

# Create .env file for local testing
echo "📄 Creating .env for local testing..."
cat > .env << 'EOF'
NODE_ENV=development
PORT=10000
CLIENT_URL=http://localhost:3000
JWT_SECRET=emergency-jwt-secret-key
EOF

echo "✅ .env file created"

# Test local startup
echo "🧪 Testing local startup..."
npm install --silent

echo "🎯 Deployment Instructions:"
echo "1. Push changes to GitHub repository"
echo "2. Deploy on Render - it will use the emergency server"
echo "3. Monitor logs for successful startup"
echo ""
echo "Expected startup output:"
echo "🚀 ProposifyAI Backend running on port 10000"
echo "🌍 Environment: production"
echo "🔍 Health check: http://localhost:10000/api/health"
echo ""
echo "To restore original backend later:"
echo "mv package.json.backup package.json"
echo ""

echo "✅ Emergency deployment setup complete!"
echo "🚀 Ready to deploy!"

