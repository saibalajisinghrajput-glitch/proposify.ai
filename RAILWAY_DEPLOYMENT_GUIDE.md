# 🚀 Railway Deployment Guide for ProposifyAI Backend

## Prerequisites Checklist

✅ **Backend Structure Verified:**
- ✅ `backend/package.json` - Node.js dependencies configured
- ✅ `backend/server.js` - Production-ready Express server
- ✅ `backend/railway.toml` - Railway configuration file
- ✅ Environment variables properly configured in code

## Step-by-Step Railway Deployment

### STEP 1: Prepare Your Repository

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

### STEP 2: Deploy to Railway

1. **Go to Railway.app**
   - Visit: https://railway.app
   - Click "Login" → Choose "Login with GitHub"

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Find and select `proposify.ai` repository
   - Railway will automatically detect it's a monorepo

3. **Configure Backend Deployment**
   - Railway will ask you to specify the root directory
   - **IMPORTANT**: Set the root directory to `backend/`
   - Railway will automatically detect it's a Node.js project

### STEP 3: Set Environment Variables (MANDATORY)

In Railway dashboard, go to your project → Variables tab and add these **EXACT** values:

```env
NODE_ENV=production
PORT=5001
MONGODB_URI=your_mongodb_atlas_uri
OPENAI_API_KEY=your_openai_key
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
ENABLE_DEMO_MODE=false
```

**Important Notes:**
- Replace `your_mongodb_atlas_uri` with your actual MongoDB Atlas connection string
- Replace `your_openai_key` with your OpenAI API key
- Replace `your_jwt_secret` with a secure random string (use `openssl rand -base64 32`)
- Replace `your_stripe_key` with your Stripe secret key
- Replace `your_webhook_secret` with your Stripe webhook secret

### STEP 4: Railway Configuration

Railway will automatically use your `railway.toml` file:
```toml
web: node server.js
```

### STEP 5: Deploy

1. Click "Deploy" in Railway dashboard
2. Railway will build and deploy your backend
3. Wait for deployment to complete (usually 2-5 minutes)

### STEP 6: Get Your Backend URL

After successful deployment, Railway will provide you with:
- **Backend URL**: `https://proposify-backend.up.railway.app`
- This is your production backend endpoint

## Expected Backend URL Format

Your Railway deployment will give you a URL like:
```
https://[random-name].up.railway.app
```

**Example**: `https://proposify-backend.up.railway.app`

## Post-Deployment Verification

### Health Check
Test your deployed backend:
```bash
curl https://[your-railway-url]/health
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
curl https://[your-railway-url]/api/health
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

## Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check that `backend/package.json` exists
   - Verify Node.js version compatibility
   - Check for missing dependencies

2. **Environment Variables Not Working**
   - Ensure all variables are set in Railway dashboard
   - Variable names must match exactly
   - Restart deployment after adding variables

3. **Database Connection Issues**
   - Verify MongoDB Atlas URI is correct
   - Check IP whitelist in MongoDB Atlas
   - Ensure database is accessible from Railway IPs

4. **CORS Issues**
   - Frontend URL will be automatically added to CORS
   - No additional CORS configuration needed

## Next Steps

After backend deployment:
1. ✅ Note your Railway backend URL
2. ✅ Update frontend API configuration with new backend URL
3. ✅ Deploy frontend to Vercel/Netlify
4. ✅ Test full application functionality

## Railway Backend Features

✅ **Production Ready Features:**
- MongoDB database connection
- JWT authentication
- OpenAI integration for AI generation
- Stripe payment processing
- PDF generation
- Rate limiting
- CORS configuration
- Error handling
- Health check endpoints

## Support

If you encounter issues during deployment:
1. Check Railway deployment logs
2. Verify environment variables
3. Test database connectivity
4. Check application logs in Railway dashboard

---

**✅ Deployment Status**: Ready for Railway deployment
**📦 Package**: backend/ directory
**🚀 Platform**: Railway.app
**🔧 Configuration**: railway.toml included
