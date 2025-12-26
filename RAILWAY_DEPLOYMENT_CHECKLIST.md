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
