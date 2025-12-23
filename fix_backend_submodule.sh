#!/bin/bash

# 🚨 BACKEND SUBMODULE FIX SCRIPT
# This script fixes the GitHub repository by removing the backend submodule
# and adding it as a regular folder for Render deployment

set -e  # Exit on any error

echo "🔧 Starting Backend Submodule Fix..."
echo "=================================================="

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    echo "Please run this script from the root of your proposify.ai repository"
    exit 1
fi

echo "✅ Git repository detected"

# Step 1: Check if backend is a submodule
echo ""
echo "📋 Step 1: Checking submodule status..."
if git config --get-regexp 'submodule\.' | grep -q 'backend'; then
    echo "✅ Backend is configured as a submodule - will remove it"
    IS_SUBMODULE=true
else
    echo "ℹ️  Backend is not configured as a submodule"
    IS_SUBMODULE=false
fi

# Step 2: Backup backend if it exists
echo ""
echo "📋 Step 2: Creating backup..."
if [ -d "backend" ]; then
    echo "📦 Creating backup at ~/Desktop/backend-backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p ~/Desktop
    cp -r backend ~/Desktop/backend-backup-$(date +%Y%m%d-%H%M%S)
    echo "✅ Backup created successfully"
else
    echo "⚠️  No backend folder found locally"
fi

# Step 3: Remove submodule if it exists
if [ "$IS_SUBMODULE" = true ]; then
    echo ""
    echo "📋 Step 3: Removing backend submodule..."
    
    # Deinitialize submodule
    echo "🗑️  Deinitializing submodule..."
    git submodule deinit -f backend || true
    
    # Remove from index
    echo "🗑️  Removing from git index..."
    git rm -f backend || true
    
    # Remove from git config
    echo "🗑️  Cleaning git configuration..."
    git config --remove-section submodule.backend 2>/dev/null || true
    
    # Remove cached files
    echo "🗑️  Removing cached files..."
    rm -rf .git/modules/backend 2>/dev/null || true
    
    # Remove .gitmodules if it contains only backend
    if [ -f ".gitmodules" ]; then
        if grep -q "backend" .gitmodules; then
            echo "🗑️  Removing .gitmodules file..."
            rm -f .gitmodules
        fi
    fi
    
    echo "✅ Submodule removal completed"
else
    echo ""
    echo "📋 Step 3: No submodule to remove"
fi

# Step 4: Check git status
echo ""
echo "📋 Step 4: Checking git status..."
git status --porcelain

# Step 5: Commit changes
echo ""
echo "📋 Step 5: Committing submodule removal..."
git add -A
if git diff --cached --quiet; then
    echo "ℹ️  No changes to commit"
else
    git commit -m "Remove backend submodule - prepare for Render deployment"
    echo "✅ Changes committed successfully"
fi

# Step 6: Push to GitHub
echo ""
echo "📋 Step 6: Pushing changes to GitHub..."
if git remote -v | grep -q origin; then
    git push origin master
    echo "✅ Changes pushed to GitHub successfully"
else
    echo "⚠️  No origin remote found. Please set up remote manually:"
    echo "   git remote add origin https://github.com/saibalajisinghrajput-glitch/proposify.ai"
    echo "   git push -u origin master"
fi

# Step 7: Verify structure
echo ""
echo "📋 Step 7: Verifying repository structure..."
if [ -d "backend" ]; then
    echo "✅ Backend folder exists as regular directory"
    echo "📄 Backend contains:"
    ls -la backend/ | head -10
else
    echo "❌ Backend folder missing!"
    echo "📥 Restoring from backup..."
    if [ -d "~/Desktop/backend-backup-"* ]; then
        LATEST_BACKUP=$(ls -t ~/Desktop/backend-backup-* | head -1)
        cp -r "$LATEST_BACKUP" ./backend
        echo "✅ Backend restored from backup"
    else
        echo "❌ No backup found!"
        exit 1
    fi
fi

# Step 8: Add backend as regular folder
echo ""
echo "📋 Step 8: Adding backend as regular folder..."
if [ -d "backend" ]; then
    git add backend/
    git commit -m "Add backend as regular folder with proper package.json for Render"
    git push origin master
    echo "✅ Backend added as regular folder"
else
    echo "❌ Backend folder still missing!"
    exit 1
fi

# Step 9: Final verification
echo ""
echo "📋 Step 9: Final verification..."
echo "🔍 Checking repository structure:"
echo "📁 Root files:"
ls -la | grep -E "(^\.|\.md$|frontend|backend)" || true

echo ""
echo "📁 Backend files (if exists):"
if [ -d "backend" ]; then
    echo "✅ Backend folder exists"
    echo "📄 Backend package.json:"
    if [ -f "backend/package.json" ]; then
        echo "✅ package.json exists"
        echo "📋 Scripts in package.json:"
        grep -A 5 '"scripts"' backend/package.json || echo "No scripts found"
    else
        echo "❌ package.json missing!"
    fi
else
    echo "❌ Backend folder missing!"
fi

echo ""
echo "🎉 BACKEND SUBMODULE FIX COMPLETED!"
echo "=================================================="
echo ""
echo "✅ Repository structure fixed"
echo "✅ Backend is now a regular folder (not submodule)"
echo "✅ All changes pushed to GitHub"
echo ""
echo "🚀 Next steps:"
echo "1. Go to https://render.com"
echo "2. Create new Web Service"
echo "3. Connect GitHub repository: saibalajisinghrajput-glitch/proposify.ai"
echo "4. Set Root Directory: backend"
echo "5. Build Command: npm install"
echo "6. Start Command: npm start"
echo "7. Deploy and get your backend URL!"
echo ""
echo "💡 Your backend should now deploy successfully on Render!"
