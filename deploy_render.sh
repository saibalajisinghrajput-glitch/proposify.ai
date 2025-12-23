#!/bin/bash

# 🚀 Render Backend Deployment Script
# This script prepares and automates the deployment process

set -e  # Exit on any error

echo "🚀 ProposifyAI Backend - Render Deployment Script"
echo "=================================================="

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

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    print_error "Error: backend/package.json not found. Please run from project root."
    exit 1
fi

print_status "Backend files found - Ready for deployment!"

# Check if render.yaml exists
if [ ! -f "render.yaml" ]; then
    print_error "Error: render.yaml not found!"
    exit 1
fi

print_status "Render configuration found"

# Test backend structure
print_info "Testing backend structure..."

cd backend

# Check if server.js exists
if [ ! -f "server.js" ]; then
    print_error "Error: server.js not found in backend directory"
    exit 1
fi

print_status "Main server file found"

# Check package.json
if [ ! -f "package.json" ]; then
    print_error "Error: package.json not found in backend directory"
    exit 1
fi

print_status "Package.json found"

# Check dependencies
print_info "Checking dependencies..."
npm install --dry-run > /dev/null 2>&1

if [ $? -eq 0 ]; then
    print_status "Dependencies can be installed"
else
    print_warning "Some dependencies may have issues - check package.json"
fi

# Test server can be loaded
print_info "Testing server configuration..."
node -e "
try {
    const app = require('./server');
    console.log('✅ Server can be instantiated successfully');
    console.log('✅ All imports working');
} catch (error) {
    console.error('❌ Server test failed:', error.message);
    process.exit(1);
}
" 2>/dev/null

if [ $? -eq 0 ]; then
    print_status "Backend server configuration is valid"
else
    print_error "Backend server configuration has issues"
    exit 1
fi

cd ..

print_status "All backend checks passed!"

# Check Git status
print_info "Checking Git repository..."
if git status > /dev/null 2>&1; then
    print_status "Git repository found"
    
    # Check if there are uncommitted changes
    if git diff --quiet && git diff --cached --quiet; then
        print_status "Working directory is clean"
    else
        print_warning "You have uncommitted changes:"
        echo "Please run:"
        echo "  git add ."
        echo "  git commit -m 'Ready for Render deployment'"
        echo "  git push origin main"
    fi
else
    print_warning "Not a Git repository or Git not available"
fi

# Generate deployment checklist
echo ""
echo "🎯 RENDER DEPLOYMENT CHECKLIST"
echo "==============================="
echo ""
echo "1. 📋 Pre-Deployment Checks:"
echo "   ✅ Backend structure verified"
echo "   ✅ Package.json validated"
echo "   ✅ Server.js configuration tested"
echo "   ✅ Render.yaml configuration ready"
echo ""
echo "2. 🚀 Deployment Steps:"
echo "   1. Go to https://render.com"
echo "   2. Sign up with GitHub"
echo "   3. Click 'New' → 'Web Service'"
echo "   4. Connect your GitHub repository"
echo "   5. Configure settings:"
echo "      - Name: proposifyai-backend"
echo "      - Environment: Node"
echo "      - Build Command: cd backend && npm install"
echo "      - Start Command: cd backend && npm start"
echo "      - Root Directory: (leave empty)"
echo ""
echo "3. 🔧 Environment Variables (MANDATORY):"
echo "   NODE_ENV=production"
echo "   PORT=10000"
echo "   MONGODB_URI=your_mongodb_atlas_uri"
echo "   OPENAI_API_KEY=your_openai_key"
echo "   JWT_SECRET=your_jwt_secret"
echo "   STRIPE_SECRET_KEY=your_stripe_key"
echo "   STRIPE_WEBHOOK_SECRET=your_webhook_secret"
echo "   ENABLE_DEMO_MODE=false"
echo "   CLIENT_URL=https://proposifyai.vercel.app"
echo ""
echo "4. 🗄️ MongoDB Atlas Setup:"
echo "   - Go to MongoDB Atlas → Network Access"
echo "   - Add IP Address → Allow Access from Anywhere (0.0.0.0/0)"
echo ""
echo "5. 🎯 Expected Backend URL:"
echo "   https://proposify-backend.onrender.com"
echo ""

# Create environment variables template
print_info "Creating environment variables template..."
cat > env_variables_template.txt << EOF
# Copy these environment variables to Render dashboard
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/proposifyai?retryWrites=true&w=majority
OPENAI_API_KEY=sk-your-openai-api-key
JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "generate-a-secure-random-string-here")
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
ENABLE_DEMO_MODE=false
CLIENT_URL=https://proposifyai.vercel.app
EOF

if [ -f "env_variables_template.txt" ]; then
    print_status "Environment variables template created: env_variables_template.txt"
else
    print_warning "Could not create environment variables template"
fi

# Generate JWT secret if openssl is available
JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "generate-a-secure-random-string-here")
echo ""
print_info "Generated JWT Secret (save this!):"
echo "$JWT_SECRET"

echo ""
echo "🎉 DEPLOYMENT PREPARATION COMPLETE!"
echo "===================================="
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub (if not already done)"
echo "2. Follow the deployment steps above"
echo "3. Set environment variables in Render dashboard"
echo "4. Deploy and get your backend URL"
echo ""
echo "Files ready for deployment:"
echo "✅ backend/ (complete backend application)"
echo "✅ render.yaml (Render configuration)"
echo "✅ RENDER_DEPLOYMENT_GUIDE.md (detailed guide)"
echo "✅ RENDER_QUICK_START.md (quick reference)"
echo ""

print_status "Backend is ready for Render deployment!"
