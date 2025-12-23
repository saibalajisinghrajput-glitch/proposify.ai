# 🚀 ProposifyAI - Production Deployment Guide

This guide will walk you through deploying your ProposifyAI application to production with:
- **Frontend**: Vercel
- **Backend**: Render  
- **Database**: MongoDB Atlas

---

## 📋 Prerequisites

Before deploying, ensure you have:
- [ ] GitHub repository with your code
- [ ] Vercel account (free tier available)
- [ ] Render account (free tier available)
- [ ] MongoDB Atlas account (free tier available)
- [ ] OpenAI API key (for AI features)

---

## 🗄️ Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up/Login to your account
3. Click "Build a Database"
4. Choose **Free Tier** (M0)
5. Select a cloud provider and region (choose closest to your users)
6. Create a cluster name (e.g., "proposifyai-prod")
7. Click "Create Cluster"

### 1.2 Configure Database Access
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username (e.g., "proposifyai_user")
5. Generate a strong password (save it!)
6. Select "Read and write to any database" role
7. Click "Add User"

### 1.3 Configure Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" (0.0.0.0/0) for development
4. For production, consider restricting to specific IPs
5. Click "Confirm"

### 1.4 Get Connection String
1. Go back to "Clusters"
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. **Important**: Replace `<password>` with your actual database user password

---

## ⚙️ Step 2: Backend Deployment on Render

### 2.1 Prepare Backend for Deployment
1. Create a new file `render.yaml` in your backend directory:
```yaml
services:
  - type: web
    name: proposifyai-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: OPENAI_API_KEY
        sync: false
      - key: STRIPE_SECRET_KEY
        sync: false
```

### 2.2 Update Backend Package.json
Ensure your `backend/package.json` has the correct scripts:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 2.3 Update Environment Configuration
Update `backend/server.js` to use process.env.PORT for Render:
```javascript
// Add this near the end of server.js
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 2.4 Create Render Service
1. Go to [Render](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: `proposifyai-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for production)

### 2.5 Set Environment Variables in Render
After creating the service, go to "Environment" tab and add:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/proposifyai?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
OPENAI_API_KEY=sk-your-openai-api-key-here
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
PORT=10000
```

**⚠️ Important**: 
- Use your actual MongoDB connection string
- Generate a strong JWT_SECRET (32+ characters)
- Add your OpenAI API key
- Add Stripe keys if using payments

### 2.6 Deploy Backend
1. Click "Create Web Service"
2. Render will automatically build and deploy
3. Note your backend URL (e.g., `https://proposifyai-backend.onrender.com`)

---

## 🌐 Step 3: Frontend Deployment on Vercel

### 3.1 Update Frontend API URLs
Update your frontend to use the Render backend URL:

Create `frontend/.env.production`:
```env
REACT_APP_API_URL=https://proposifyai-backend.onrender.com/api
```

Update API calls in frontend code:
- Change `http://localhost:5001` to `https://proposifyai-backend.onrender.com/api`
- Or use environment variable: `${process.env.REACT_APP_API_URL}`

### 3.2 Update Frontend Configuration
Ensure `frontend/package.json` has correct build scripts:
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

### 3.3 Create Vercel Deployment
1. Go to [Vercel](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3.4 Set Environment Variables in Vercel
In Vercel project settings, add:

```env
REACT_APP_API_URL=https://proposifyai-backend.onrender.com/api
```

### 3.5 Deploy Frontend
1. Click "Deploy"
2. Vercel will build and deploy automatically
3. Note your frontend URL (e.g., `https://proposifyai.vercel.app`)

---

## 🔧 Step 4: Update CORS and API Endpoints

### 4.1 Update Backend CORS
Update `backend/server.js` to allow your Vercel domain:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000', // for local development
    'https://your-app.vercel.app', // your actual Vercel URL
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

### 4.2 Update Frontend API Calls
Ensure all API calls use the correct base URL:
```javascript
// In your API service files
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Example API call
const response = await axios.get(`${API_BASE_URL}/proposals/${id}`);
```

---

## ✅ Step 5: Verification and Testing

### 5.1 Test Backend Health
Visit your Render backend URL:
```
https://your-backend.onrender.com/health
```
You should see a health check response.

### 5.2 Test Frontend
Visit your Vercel frontend URL:
```
https://your-app.vercel.app
```
The app should load without errors.

### 5.3 Test Core Functionality
1. **Registration/Login**: Create account and login
2. **Project Creation**: Create a new project
3. **Proposal Generation**: Generate a proposal
4. **Contract Generation**: Generate a contract
5. **PDF Download**: Download proposals/contracts as PDFs

### 5.4 Check Browser Console
- Open browser developer tools
- Check for any API errors or CORS issues
- Verify all network requests are successful

---

## 🚨 Common Deployment Mistakes to Avoid

### Backend Issues:
- **❌ Forgetting to set NODE_ENV=production**
- **❌ Using localhost URLs in production**
- **❌ Not updating CORS settings**
- **❌ Missing environment variables**
- **❌ Using free tier limits without monitoring**

### Frontend Issues:
- **❌ Not building the production version**
- **❌ Hardcoding localhost URLs**
- **❌ Forgetting to set REACT_APP_API_URL**
- **❌ Not handling API failures gracefully**

### Database Issues:
- **❌ Using development database in production**
- **❌ Not securing database with IP restrictions**
- **❌ Weak database passwords**
- **❌ Not monitoring database usage**

### General Issues:
- **❌ Not testing the deployed version**
- **❌ Ignoring deployment logs**
- **❌ Not setting up monitoring**
- **❌ Forgetting to update API documentation**

---

## 🔒 Security Checklist

- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Secure MongoDB Atlas with IP restrictions
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (automatic on Vercel/Render)
- [ ] Set up proper CORS configuration
- [ ] Use production MongoDB cluster
- [ ] Monitor API usage and rate limits

---

## 📊 Monitoring and Maintenance

### 5.1 Set Up Monitoring
- **Render**: Built-in metrics and logs
- **Vercel**: Function logs and analytics
- **MongoDB Atlas**: Performance monitoring

### 5.2 Regular Maintenance
- Monitor free tier limits
- Update dependencies regularly
- Backup database regularly
- Review security logs
- Monitor API usage

---

## 🎯 Quick Start Commands

If deploying locally for testing:
```bash
# Backend
cd backend
npm install
npm start

# Frontend  
cd frontend
npm install
npm start
```

---

## 📞 Support

If you encounter issues:
1. Check deployment logs on Render/Vercel
2. Verify all environment variables
3. Test API endpoints directly
4. Check browser console for frontend errors
5. Review MongoDB Atlas connection

**Remember**: Free tiers have limitations - monitor usage to avoid unexpected downtime!
