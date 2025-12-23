# 🚀 ProposifyAI - Deployment Instructions

## Quick Deploy Options

### Option 1: Vercel (Recommended for Frontend)
1. Go to [vercel.com](https://vercel.com)
2. Sign up/sign in with GitHub
3. Import this repository
4. Set build command: `npm run build`
5. Set output directory: `build`
6. Add environment variable: `REACT_APP_API_URL=https://your-backend.railway.app/api`
7. Deploy

### Option 2: Netlify (Alternative)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `frontend` folder to deploy
3. Or connect GitHub repository
4. Set build command: `npm run build`
5. Set publish directory: `build`

### Option 3: Railway (Backend)
1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Select backend folder
4. Add environment variables from `.env.production`
5. Deploy

### Option 4: Render (Backend)
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables

## Environment Variables Needed

### Frontend (.env.production)
```
REACT_APP_API_URL=https://your-backend-url.railway.app/api
REACT_APP_ENVIRONMENT=production
```

### Backend (.env.production)
```
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/proposifyai
JWT_SECRET=your_secure_jwt_secret
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

## Database Setup
1. Go to [MongoDB Atlas](https://mongodb.com/cloud/atlas)
2. Create free account and cluster
3. Get connection string
4. Update MONGODB_URI in backend environment

## Post-Deployment Testing
1. Test frontend loads correctly
2. Test user registration/login
3. Test AI generation features
4. Test PDF export functionality
5. Test all API endpoints

## Custom Domain (Optional)
- Vercel: Add custom domain in project settings
- Railway: Add custom domain in service settings
- Update CORS settings in backend accordingly

## Support
Check the comprehensive guide in `DEPLOYMENT_GUIDE_PUBLIC.md` for detailed instructions.
