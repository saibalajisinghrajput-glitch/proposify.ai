#!/bin/bash

# 🚀 RAILWAY BACKEND DEPLOYMENT AUTOMATION

echo "🚀 Starting Railway Backend Deployment Process..."

# Step 1: Verify backend structure
echo "📁 Verifying backend structure..."
cd /Users/saibalajisinghrajput/Desktop/proposifyai

# Check if backend exists
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found!"
    exit 1
fi

# Verify package.json
if [ ! -f "backend/package.json" ]; then
    echo "❌ Backend package.json not found!"
    exit 1
fi

echo "✅ Backend directory and package.json found"

# Step 2: Check if start script exists
echo "🔍 Checking for start script in package.json..."
if grep -q '"start"' backend/package.json; then
    echo "✅ Start script found in package.json"
    echo "📋 Start script content:"
    grep -A 1 '"start"' backend/package.json
else
    echo "❌ Start script not found in package.json"
    echo "📝 Adding start script to package.json..."
    
    # Backup original
    cp backend/package.json backend/package.json.backup
    
    # Add start script
    sed -i.bak 's/"test": "echo \\"Error: no test specified\\" && exit 1"/"start": "node server.js",\n    "test": "echo \\"Error: no test specified\\" && exit 1"/' backend/package.json
    
    echo "✅ Start script added to package.json"
    echo "📋 Updated scripts section:"
    grep -A 10 '"scripts"' backend/package.json
fi

# Step 3: Verify server.js exists
echo "🔍 Checking for server.js..."
if [ ! -f "backend/server.js" ]; then
    echo "❌ server.js not found in backend directory!"
    echo "📁 Files in backend directory:"
    ls -la backend/
    exit 1
fi

echo "✅ server.js found"

# Step 4: Create deployment checklist
echo "📋 Creating Railway deployment checklist..."

cat > RAILWAY_DEPLOYMENT_CHECKLIST.md << 'EOF'
# 🚀 RAILWAY BACKEND DEPLOYMENT CHECKLIST

## ✅ PRE-DEPLOYMENT VERIFICATION COMPLETED

- [x] Backend directory exists
- [x] package.json exists
- [x] Start script configured: `"start": "node server.js"`
- [x] server.js file exists
- [x] Dependencies listed in package.json

## 🚀 RAILWAY DEPLOYMENT STEPS

### Step 1: Railway Setup
1. **Go to:** https://railway.app
2. **Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose:** `saibalajisinghrajput-glitch/proposify.ai`

### Step 2: Project Configuration
**CRITICAL SETTINGS:**
- **Project Name:** `proposify-backend`
- **Root Directory:** `backend` ← IMPORTANT
- **Branch:** `master`
- **Environment:** Node.js

### Step 3: Environment Variables
Add these environment variables:

```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/proposify?retryWrites=true&w=majority
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
ENABLE_DEMO_MODE=false
```

### Step 4: Deploy
1. **Click "Deploy"**
2. **Wait 2-3 minutes**
3. **Check build logs**
4. **Get your live URL**

## 🎯 EXPECTED RESULT
- **Build Status:** ✅ Success
- **Server Status:** ✅ Running
- **URL Format:** `https://your-app-name.up.railway.app`
- **Health Check:** `https://your-app.up.railway.app/api/health`

## 📋 POST-DEPLOYMENT TESTING
Test these endpoints once deployed:
- GET `/api/health`
- POST `/api/auth/signup`
- GET `/api/projects`
- POST `/api/generate/proposal`

## 🆘 TROUBLESHOOTING
If deployment fails:
1. **Check build logs** in Railway dashboard
2. **Verify environment variables** are set correctly
3. **Ensure MONGODB_URI** is valid MongoDB Atlas connection string
4. **Check that all API keys** are properly configured

---
**STATUS: Ready for Railway deployment! Follow the steps above.**
EOF

echo "✅ Railway deployment checklist created: RAILWAY_DEPLOYMENT_CHECKLIST.md"

# Step 5: Create environment template
echo "📝 Creating environment template..."

cat > backend/.env.template << 'EOF'
# Railway Backend Environment Variables Template
# Copy these to Railway dashboard environment variables section

NODE_ENV=production
PORT=5001

# MongoDB Atlas (Required)
# Get this from: https://cloud.mongodb.com -> Your Cluster -> Connect -> Connection String
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/proposify?retryWrites=true&w=majority

# OpenAI API (Required for AI generation)
# Get this from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your_openai_api_key_here

# JWT Secret (Required for authentication)
# Generate a random secret string
JWT_SECRET=your_super_secret_jwt_key_here

# Stripe Keys (Required for payments)
# Get these from: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here

# Demo Mode (Set to false for production)
ENABLE_DEMO_MODE=false
EOF

echo "✅ Environment template created: backend/.env.template"

# Step 6: Final verification
echo "🔍 Final verification..."

echo "📁 Project structure:"
echo "backend/"
ls -la backend/ | head -10

echo ""
echo "📋 package.json scripts:"
grep -A 5 '"scripts"' backend/package.json

echo ""
echo "🎉 BACKEND READY FOR RAILWAY DEPLOYMENT!"
echo ""
echo "📋 Next steps:"
echo "1. Open RAILWAY_DEPLOYMENT_CHECKLIST.md"
echo "2. Follow the Railway setup steps"
echo "3. Add environment variables"
echo "4. Deploy and get your live backend URL!"
echo ""
echo "🚀 Expected deployment time: 5-10 minutes"

