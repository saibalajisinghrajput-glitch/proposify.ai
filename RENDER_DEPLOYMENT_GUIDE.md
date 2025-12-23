# 🚀 Render Deployment Guide for ProposifyAI Backend

## ✅ Backend Configuration Verified
- ✅ **Express.js server** with production-ready configuration
- ✅ **MongoDB Atlas integration** (will be configured)
- ✅ **OpenAI API integration** for AI generation
- ✅ **Stripe payment processing** set up
- ✅ **JWT authentication** with secure middleware
- ✅ **CORS configuration** for Vercel frontend compatibility
- ✅ **Rate limiting** and security headers
- ✅ **Health check endpoints** for monitoring

## 🎯 Step-by-Step Render Deployment

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### Step 2: Deploy to Render

1. **Go to Render.com**
   - Visit: https://render.com
   - Click "Sign Up" → Choose "Sign up with GitHub"

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select your `proposify.ai` repository

3. **Configure Web Service**
   - **Name**: `proposifyai-backend`
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (use root directory)

### Step 3: Environment Variables (CRITICAL)

In Render dashboard → Environment tab, add these **EXACT** values:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_uri
OPENAI_API_KEY=your_openai_key
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
ENABLE_DEMO_MODE=false
CLIENT_URL=https://proposifyai.vercel.app
```

**Important Notes:**
- Replace `your_mongodb_atlas_uri` with your MongoDB Atlas connection string
- Replace `your_openai_key` with your OpenAI API key
- Generate JWT_SECRET: `openssl rand -base64 32`
- Replace `your_stripe_key` with your Stripe secret key
- Replace `your_webhook_secret` with your Stripe webhook secret
- `CLIENT_URL` will be updated after frontend deployment

### Step 4: MongoDB Atlas Configuration

**Important**: Ensure your MongoDB Atlas cluster allows connections from Render:

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address" → "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Save changes

### Step 5: Deploy

1. Click "Create Web Service" in Render
2. Wait for build and deployment (3-5 minutes)
3. Monitor logs for any issues

### Step 6: Get Your Backend URL

After successful deployment, Render will provide:
- **Backend URL**: `https://proposify-backend.onrender.com`
- **Status**: Check if service is live and healthy

## 🔧 Backend Configuration Verification

Your backend is configured to:
- ✅ Listen on `0.0.0.0` (all interfaces)
- ✅ Use PORT from environment variables (10000 on Render)
- ✅ Connect to MongoDB Atlas
- ✅ Serve on production domain
- ✅ Enable CORS for Vercel frontend
- ✅ Disable demo mode completely
- ✅ Provide health check endpoints

## 📋 Expected Backend URL Format

Your Render deployment will give you:
```
https://[service-name].onrender.com
```

**Example**: `https://proposify-backend.onrender.com`

## 🔍 Post-Deployment Verification

### Health Check Test
```bash
curl https://[your-render-url]/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "ProposifyAI Backend is running!",
  "timestamp": "2024-XX-XXTXX:XX:XX.XXXZ",
  "database": "connected"
}
```

### API Health Check
```bash
curl https://[your-render-url]/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Backend is healthy",
  "version": "1.0.0",
  "environment": "production",
  "database": "connected"
}
```

## 🚨 Important Render Configuration

### Free Tier Limitations
- **Sleep**: Services sleep after 15 minutes of inactivity
- **Cold Start**: First request after sleep takes ~30 seconds
- **Database**: Use MongoDB Atlas (not Render's database)

### Environment Variables Required
All variables must be set in Render dashboard:
- `NODE_ENV=production` (required)
- `PORT=10000` (Render sets this automatically)
- `MONGODB_URI=...` (your Atlas connection string)
- `OPENAI_API_KEY=...` (for AI generation)
- `JWT_SECRET=...` (secure random string)
- `STRIPE_SECRET_KEY=...` (for payments)
- `STRIPE_WEBHOOK_SECRET=...` (for webhooks)
- `ENABLE_DEMO_MODE=false` (disable demo)
- `CLIENT_URL=...` (frontend URL)

## 🔗 Frontend Integration Notes

After deployment:
1. ✅ **Note your Render backend URL**: `https://proposify-backend.onrender.com`
2. ✅ **Update frontend API config** with new backend URL
3. ✅ **Deploy frontend to Vercel** separately
4. ✅ **Update CLIENT_URL** environment variable after frontend deployment

## 🎉 Success Indicators

✅ **Deployment Successful When:**
- Render shows "Live" status
- Health check returns 200 OK
- Database connection established
- No errors in deployment logs

✅ **Backend Ready for Frontend:**
- All API endpoints accessible
- CORS properly configured
- Authentication working
- AI generation functional

---

**🚀 Ready for Deployment**: Your backend is fully configured for Render deployment!
**📖 Configuration**: `render.yaml` included in project root
**🔗 Platform**: Render.com free tier
**🗄️ Database**: MongoDB Atlas (external)
