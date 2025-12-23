# 🚀 Quick Deployment Checklist

Use this checklist to deploy your ProposifyAI application step-by-step.

## ✅ Pre-Deployment Setup

- [ ] Create GitHub repository and push your code
- [ ] Sign up for MongoDB Atlas (free tier)
- [ ] Sign up for Render (free tier)  
- [ ] Sign up for Vercel (free tier)
- [ ] Get OpenAI API key

## ✅ Step 1: MongoDB Atlas Setup

- [ ] Create cluster in MongoDB Atlas
- [ ] Create database user with read/write permissions
- [ ] Add IP access (0.0.0.0/0 for now)
- [ ] Copy connection string: `mongodb+srv://user:pass@cluster.mongodb.net/`
- [ ] Replace `<password>` in connection string with your DB user password

## ✅ Step 2: Backend Deployment (Render)

- [ ] Go to [Render.com](https://render.com)
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Configure:
  - Name: `proposifyai-backend`
  - Root Directory: `backend`
  - Build Command: `npm install`
  - Start Command: `npm start`
- [ ] Add Environment Variables:
  ```
  NODE_ENV=production
  MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/proposifyai?retryWrites=true&w=majority
  JWT_SECRET=your-super-secret-jwt-key-32-characters-min
  OPENAI_API_KEY=sk-your-openai-api-key-here
  PORT=10000
  ```
- [ ] Click "Create Web Service"
- [ ] **Save your backend URL**: `https://proposifyai-backend.onrender.com`

## ✅ Step 3: Frontend Deployment (Vercel)

- [ ] Go to [Vercel.com](https://vercel.com)
- [ ] Click "New Project"
- [ ] Import GitHub repository
- [ ] Configure:
  - Framework: Create React App
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `build`
- [ ] Add Environment Variable:
  ```
  REACT_APP_API_URL=https://proposifyai-backend.onrender.com/api
  ```
- [ ] Click "Deploy"
- [ ] **Save your frontend URL**: `https://your-app.vercel.app`

## ✅ Step 4: Update CORS (Important!)

Update your Render backend CORS to allow your Vercel domain:

1. In Render dashboard, go to your backend service
2. Go to "Environment" tab
3. Add this environment variable:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
4. Redeploy your backend service

## ✅ Step 5: Test Everything

- [ ] Visit your Vercel frontend URL
- [ ] Test user registration/login
- [ ] Create a project
- [ ] Generate a proposal
- [ ] Download proposal as PDF
- [ ] Generate a contract  
- [ ] Download contract as PDF
- [ ] Check browser console for errors

## 🔧 If Something Goes Wrong

### Backend Issues:
- Check Render logs for errors
- Verify all environment variables are set
- Test backend health: `https://your-backend.onrender.com/health`

### Frontend Issues:
- Check Vercel function logs
- Verify `REACT_APP_API_URL` is set correctly
- Check browser console for CORS errors

### Database Issues:
- Verify MongoDB connection string
- Check MongoDB Atlas cluster status
- Ensure IP access is configured

## 📋 Environment Variables Reference

### Render (Backend):
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/proposifyai
JWT_SECRET=your-32-character-secret
OPENAI_API_KEY=sk-your-key
PORT=10000
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Vercel (Frontend):
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
NODE_ENV=production
```

## 🎯 Your URLs

After deployment, your URLs will be:
- **Frontend (Vercel)**: `https://your-app-name.vercel.app`
- **Backend (Render)**: `https://your-backend-name.onrender.com`
- **Backend Health**: `https://your-backend.onrender.com/health`

---

**🎉 Once all tests pass, your ProposifyAI application is live in production!**
