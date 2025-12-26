# 🚀 RAILWAY DEPLOYMENT STEPS - SIMPLE GUIDE

## STEP 1: Setup Railway Account
1. **Go to**: https://railway.app
2. **Click**: "Login" (top right)
3. **Select**: "Login with GitHub"
4. **Authorize** Railway to access your GitHub

## STEP 2: Create New Project
1. **Click**: "New Project" (big blue button)
2. **Select**: "Deploy from GitHub repo"
3. **Find**: `saibalajisinghrajput-glitch/proposify.ai`
4. **Click**: "Deploy Now"

## STEP 3: Configure Project Settings
**⚠️ CRITICAL - Set these EXACTLY:**

1. **Project Name**: `proposify-backend`
2. **Root Directory**: `backend` ← **MOST IMPORTANT**
3. **Branch**: `master` (not main)
4. **Runtime**: Node.js

## STEP 4: Add Environment Variables
**In Railway dashboard, add these variables:**

```
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/proposify?retryWrites=true&w=majority
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_super_secret_jwt_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
ENABLE_DEMO_MODE=false
```

## STEP 5: Deploy
1. **Click**: "Deploy" button
2. **Wait**: 2-3 minutes for build
3. **Watch**: Real-time build logs
4. **Success**: Green "Build completed" message

## STEP 6: Get Your Live URL
**After deployment succeeds:**
- Railway shows: `https://your-project-name-production.up.railway.app`
- **Test**: Visit `https://your-url.up.railway.app/api/health`
- **Expected**: `{"status": "Backend is running"}`

## ✅ SUCCESS CHECKLIST
- [ ] Build logs show "Build completed successfully"
- [ ] Server status shows "Running" (green)
- [ ] Health check URL returns JSON response
- [ ] You can access your live backend

## 🆘 IF SOMETHING GOES WRONG

### Build Fails
- Check: Root directory = `backend`
- Check: Branch = `master`
- Check: All environment variables added

### Server Won't Start
- Check: PORT = `5001`
- Check: NODE_ENV = `production`
- Check: All dependencies in package.json

### Can't Connect to Database
- Check: MongoDB URI format is correct
- Check: Username/password are right
- Check: MongoDB Atlas allows connections

---

**🎯 Total time: 10-15 minutes to get your live backend URL!**

