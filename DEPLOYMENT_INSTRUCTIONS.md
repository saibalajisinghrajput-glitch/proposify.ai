# 🎯 ProposifyAI - Public Deployment Instructions

## 📋 Prerequisites
- GitHub account
- MongoDB Atlas account (for database)
- OpenAI API key
- Stripe account (for payments)

## 🚀 Deployment Steps

### Step 1: Deploy Backend to Render

1. Go to [Render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: proposifyai-backend
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node.js

5. Set Environment Variables in Render:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/proposifyai
   JWT_SECRET=your-super-secure-jwt-secret-here
   OPENAI_API_KEY=sk-your-openai-api-key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   CLIENT_URL=https://your-vercel-frontend-url.vercel.app
   ENABLE_DEMO_MODE=false
   ```

### Step 2: Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com) and sign up
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: build

5. Set Environment Variables in Vercel:
   ```
   REACT_APP_API_URL=https://your-render-backend-url.onrender.com/api
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   REACT_APP_APP_NAME=ProposifyAI
   ```

### Step 3: Update CORS Configuration

After frontend deployment, update CLIENT_URL in Render environment variables:
```
CLIENT_URL=https://your-vercel-frontend-url.vercel.app
```

### Step 4: Test Deployment

1. Visit your Vercel URL to test the frontend
2. Test user registration and login
3. Verify API connectivity
4. Test document generation features

## 🎉 Success Indicators

- ✅ Backend health endpoint responds
- ✅ Frontend loads without errors
- ✅ User registration works
- ✅ Login authentication succeeds
- ✅ Dashboard is accessible
- ✅ No console errors in browser

## 🔧 Troubleshooting

- **CORS Errors**: Update CLIENT_URL in backend environment variables
- **Database Connection**: Check MongoDB Atlas IP whitelist
- **Build Failures**: Verify Node.js version compatibility
- **API 404 Errors**: Check REACT_APP_API_URL configuration

## 📞 Support Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas](https://docs.atlas.mongodb.com)

---
**Deployment Status**: Ready for production! 🚀
