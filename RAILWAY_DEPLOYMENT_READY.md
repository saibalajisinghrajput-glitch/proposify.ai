# 🚀 RAILWAY BACKEND DEPLOYMENT GUIDE

## ✅ STEP 1: PRE-DEPLOYMENT VERIFICATION

Your backend is ready for Railway deployment! I've verified the repository structure:

**✅ Repository Status:**
- Backend is NOT a submodule (good!)
- All backend files are properly tracked
- package.json is correctly configured
- GitHub repository is clean and ready

## 🎯 STEP 2: RAILWAY DEPLOYMENT

### **Go to Railway.app**
1. **Navigate to:** https://railway.app
2. **Login with GitHub** (use your GitHub account)

### **Create New Project**
1. **Click:** "New Project"
2. **Select:** "Deploy from GitHub repo"
3. **Choose:** `saibalajisinghrajput-glitch/proposify.ai`

### **Backend Configuration**
Since you have a monorepo (frontend + backend), configure Railway:

**Root Directory:** `backend` ← **IMPORTANT**

### **Environment Variables (MANDATORY)**
Add these exact environment variables in Railway Dashboard:

```bash
NODE_ENV=production
PORT=5001
MONGODB_URI=your_mongodb_atlas_uri
OPENAI_API_KEY=your_openai_key
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
ENABLE_DEMO_MODE=false
```

**Where to get these values:**
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `OPENAI_API_KEY`: From https://platform.openai.com/api-keys
- `JWT_SECRET`: Any secure random string (use `openssl rand -hex 32`)
- `STRIPE_SECRET_KEY`: From Stripe Dashboard
- `STRIPE_WEBHOOK_SECRET`: From Stripe Webhook settings

### **Deploy**
1. **Click:** "Deploy"
2. **Wait:** ~2-3 minutes for build and deploy

## ✅ STEP 3: GET YOUR BACKEND URL

After successful deployment, Railway will provide:
```
https://your-app-name.up.railway.app
```

**Example:** `https://proposify-backend-abc123.up.railway.app`

## 🔧 STEP 4: VERIFY DEPLOYMENT

Test your deployed backend:

```bash
# Test health endpoint
curl https://your-backend-url.up.railway.app/api/health

# Should return: {"status":"Server is running"}
```

## 📋 DEPLOYMENT CHECKLIST

- [ ] Logged into Railway.app
- [ ] Created new project from GitHub
- [ ] Set Root Directory to `backend`
- [ ] Added all 8 environment variables
- [ ] Deployed successfully
- [ ] Got Railway backend URL
- [ ] Tested health endpoint

## 🎉 SUCCESS INDICATORS

When deployment succeeds, you'll see:
- ✅ **Build:** "Build completed successfully"
- ✅ **Deploy:** "Deploy completed successfully" 
- ✅ **URL:** Railway provides your backend URL
- ✅ **Test:** Health endpoint responds

## 🚨 TROUBLESHOOTING

**If deployment fails:**
1. Check environment variables are set correctly
2. Verify Root Directory is `backend`
3. Check Railway logs for errors
4. Ensure all dependencies are in package.json

## 📞 NEXT STEPS

After successful backend deployment:
1. **Save your Railway backend URL**
2. **Update frontend API configuration** (if needed)
3. **Proceed to frontend deployment**
4. **Connect frontend to backend**

---

**🎯 Ready to deploy? Follow the steps above and get your Railway backend URL!**
