#!/bin/bash

# MongoDB Installation and Setup Script for macOS
echo "🔧 Installing MongoDB Community Edition on macOS..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew not found. Installing Homebrew first..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Update Homebrew
echo "📦 Updating Homebrew..."
brew update

# Install MongoDB Community Edition
echo "🗄️ Installing MongoDB Community Edition..."
brew tap mongodb/brew
brew install mongodb-community

# Create data directory
echo "📁 Creating MongoDB data directory..."
sudo mkdir -p /usr/local/var/mongodb
sudo chown -R $(whoami) /usr/local/var/mongodb

# Start MongoDB as a background service
echo "🚀 Starting MongoDB service..."
brew services start mongodb-community

# Wait a moment for MongoDB to start
sleep 3

# Test MongoDB connection
echo "🧪 Testing MongoDB connection..."
if mongosh --eval "db.runCommand('ping')" > /dev/null 2>&1; then
    echo "✅ MongoDB is running successfully!"
    echo "🔗 Connection URL: mongodb://localhost:27017"
else
    echo "⚠️ MongoDB might still be starting. Trying alternative..."
    if mongo --eval "db.runCommand('ping')" > /dev/null 2>&1; then
        echo "✅ MongoDB is running successfully!"
    else
        echo "❌ MongoDB connection failed. Please check logs."
    fi
fi

echo ""
echo "🎯 Next steps:"
echo "1. Restart your backend server: cd backend && npm start"
echo "2. The backend should now connect to MongoDB"
echo "3. Try signing up at http://localhost:3000/signup"
echo "4. Once logged in, you'll see the dashboard button!"
echo ""
echo "📋 Quick commands:"
echo "   Start MongoDB: brew services start mongodb-community"
echo "   Stop MongoDB: brew services stop mongodb-community"
echo "   Check status: brew services list | grep mongodb"
