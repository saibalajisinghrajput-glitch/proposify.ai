#!/bin/bash

# 🚀 ProposifyAI - Quick Deployment Script
# This script automates the deployment process for both frontend and backend

echo "🚀 Starting ProposifyAI Public Deployment..."
echo "=================================================="

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the proposifyai root directory"
    exit 1
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Check Node.js and npm
echo ""
echo "🔍 Checking dependencies..."
command -v node >/dev/null 2>&1 || { print_error "Node.js is not installed"; exit 1; }
command -v npm >/dev/null 2>&1 || { print_error "npm is not installed"; exit 1; }
print_status "Node.js and npm are installed"

# Step 2: Clean and rebuild frontend
echo ""
echo "🏗️  Preparing frontend for deployment..."
cd frontend

# Check if build already exists
if [ -d "build" ]; then
    print_info "Cleaning existing build..."
    rm -rf build
fi

print_info "Installing frontend dependencies..."
npm install --silent

print_info "Building frontend for production..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Frontend build completed successfully"
else
    print_error "Frontend build failed"
    exit 1
fi

cd ..

# Step 3: Check backend dependencies
echo ""
echo "🔧 Checking backend configuration..."
cd backend

print_info "Installing backend dependencies..."
npm install --silent

print_status "Backend dependencies installed"

cd ..

# Step 4: Environment setup
echo ""
echo "⚙️  Environment configuration..."
print_info "Creating environment files..."

# Frontend .env for production
cat > frontend/.env.production << EOL
REACT_APP_API_URL=https://your-backend-url.railway.app/api
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
EOL

# Backend .env template
cat > backend/.env.production << EOL
NODE_ENV=production
PORT=5001
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_URL=https://your-vercel-domain.vercel.app
EOL

print_status "Environment files created"

# Step 5: Create deployment package
echo ""
echo "📦 Creating deployment package..."
mkdir -p deployment-package

# Copy frontend build
cp -r frontend/build deployment-package/frontend

# Copy backend files
cp -r backend deployment-package/

# Copy deployment guides
cp DEPLOYMENT_GUIDE_PUBLIC.md deployment-package/

print_status "Deployment package created"

# Step 6: Generate deployment instructions
echo ""
echo "📋 Generating deployment instructions..."

cat > deployment-package/DEPLOYMENT_STEPS.md << EOL
# 🚀 ProposifyAI - Deployment Instructions

## Quick Deploy Options

### Option 1: Vercel (Recommended for Frontend)
1. Go to [vercel.com](https://vercel.com)
2. Sign up/sign in with GitHub
3. Import this repository
4. Set build command: \`npm run build\`
5. Set output directory: \`build\`
6. Add environment variable: \`REACT_APP_API_URL=https://your-backend.railway.app/api\`
7. Deploy

### Option 2: Netlify (Alternative)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the \`frontend\` folder to deploy
3. Or connect GitHub repository
4. Set build command: \`npm run build\`
5. Set publish directory: \`build\`

### Option 3: Railway (Backend)
1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Select backend folder
4. Add environment variables from \`.env.production\`
5. Deploy

### Option 4: Render (Backend)
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set build command: \`npm install\`
5. Set start command: \`npm start\`
6. Add environment variables

## Environment Variables Needed

### Frontend (.env.production)
\`\`\`
REACT_APP_API_URL=https://your-backend-url.railway.app/api
REACT_APP_ENVIRONMENT=production
\`\`\`

### Backend (.env.production)
\`\`\`
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/proposifyai
JWT_SECRET=your_secure_jwt_secret
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_URL=https://your-frontend-domain.vercel.app
\`\`\`

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
Check the comprehensive guide in \`DEPLOYMENT_GUIDE_PUBLIC.md\` for detailed instructions.
EOL

print_status "Deployment instructions generated"

# Step 7: Create simple launch script for Vercel
cat > deploy-to-vercel.js << EOL
const { execSync } = require('child_process');

console.log('🚀 Deploying to Vercel...');

try {
    execSync('npx vercel --prod', { stdio: 'inherit' });
    console.log('✅ Deployed to Vercel successfully!');
} catch (error) {
    console.log('❌ Vercel deployment failed. Please install Vercel CLI: npm i -g vercel');
    console.log('Then run: vercel --prod');
}
EOL

# Step 8: Final summary
echo ""
echo "🎉 DEPLOYMENT PREPARATION COMPLETE!"
echo "=================================="
print_status "Frontend build: frontend/build/"
print_status "Backend ready: backend/"
print_status "Environment files created"
print_status "Deployment package: deployment-package/"
print_status "Instructions generated: deployment-package/DEPLOYMENT_STEPS.md"

echo ""
echo "🌐 NEXT STEPS:"
echo "1. Choose your deployment platform (Vercel recommended for frontend)"
echo "2. Deploy the frontend (frontend/build/ or full repository)"
echo "3. Deploy the backend (backend/ folder)"
echo "4. Set up MongoDB Atlas database"
echo "5. Configure environment variables"
echo "6. Test the live application"

echo ""
print_info "Full deployment guide: DEPLOYMENT_GUIDE_PUBLIC.md"
print_info "Quick instructions: deployment-package/DEPLOYMENT_STEPS.md"

echo ""
print_warning "IMPORTANT: Don't forget to:"
print_warning "- Set up your MongoDB Atlas connection"
print_warning "- Get your OpenAI API key"
print_warning "- Configure Stripe keys (if using payments)"
print_warning "- Update CORS settings for your domain"

echo ""
print_status "Ready for public launch! 🚀"

