# 🚀 RAILWAY DEPLOYMENT - NEXT STEPS (AFTER GITHUB CONNECTION)

## ✅ STEP 1 COMPLETED: GitHub Connected to Railway

Now follow these exact steps to deploy your backend:

## 🎯 STEP 2: Create New Project (2 minutes)

### In Railway Dashboard:
1. **Click**: "New Project" (big blue button)
2. **Select**: "Deploy from GitHub repo"
3. **Find & Select**: `saibalajisinghrajput-glitch/proposify.ai`
4. **Click**: "Deploy Now"

## ⚙️ STEP 3: Configure Project Settings (1 minute)

**CRITICAL - Set these EXACTLY:**

### Basic Settings:
- **Project Name**: `proposify-backend`
- **Root Directory**: `backend` ← **MOST IMPORTANT**
- **Branch**: `master` (not main)
- **Runtime**: Node.js

### Root Directory Explanation:
Railway needs to know to deploy the `backend` folder specifically, not the entire repository.

## 🔧 STEP 4: Add Environment Variables (5 minutes)

**In Railway dashboard, go to Variables tab and add:**

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

### How to Get These Values:

**MongoDB URI**: 
- Go to https://cloud.mongodb.com
- Your cluster → Connect → Connection String
- Replace `your_username:your_password`

**OpenAI API Key**:
- Go to https://platform.openai.com/api-keys
- Create new key → Copy the `sk-...` key

**JWT Secret**:
- Generate any random string (e.g., `my-super-secret-jwt-key-12345`)

**Stripe Keys** (Optional for testing):
- Go to https://dashboard.stripe.com/apikeys
- Get test keys from "Developers" → "API keys"

## 🚀 STEP 5: Deploy (2-3 minutes)

1. **Click**: "Deploy" button
2. **Watch**: Real-time build logs in Railway dashboard
3. **Wait**: For "Build completed successfully" message
4. **Success**: Server status shows "Running" (green)

## 🌐 STEP 6: Get Your Live URL

**After successful deployment:**
- Railway shows: `https://your-project-name-production.up.railway.app`
- **Test**: Visit `https://your-url.up.railway.app/api/health`
- **Expected Response**: `{"status": "Backend is running"}`

## ✅ SUCCESS CHECKLIST

- [ ] Build logs show "Build completed successfully"
- [ ] Server status shows "Running" (green dot)
- [ ] Health check URL returns JSON: `{"status": "Backend is running"}`
- [ ] You can access your live backend URL

## 🆘 TROUBLESHOOTING

### If Build Fails:
- Check: Root directory = `backend`
- Check: Branch = `master`
- Check: All environment variables are added

### If Server Won't Start:
- Check: PORT = `5001`
- Check: NODE_ENV = `production`
- Check: All dependencies are in package.json

### If Database Connection Fails:
- Check: MongoDB URI format is correct
- Check: Username/password are right
- Check: MongoDB Atlas allows connections

---

**🎯 Total time from here: 10-15 minutes to get your live backend URL!**

**Once you have your Railway URL, you're ready to update the frontend and deploy it to Vercel!**

