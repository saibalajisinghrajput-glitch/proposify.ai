#!/bin/bash

# ProposifyAI System Verification Script
# Tests both MongoDB connection and system status

echo "🚀 ProposifyAI System Verification"
echo "=================================="

# Test 1: Check if Node.js is available
echo "📋 Step 1: Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi
echo "✅ Node.js version: $(node --version)"

# Test 2: Test MongoDB connection
echo ""
echo "📋 Step 2: Testing MongoDB connection..."
if [ -f "test_mongodb_connection.js" ]; then
    node test_mongodb_connection.js
    MONGODB_RESULT=$?
    if [ $MONGODB_RESULT -eq 0 ]; then
        echo "✅ MongoDB connection successful"
    else
        echo "❌ MongoDB connection failed - need to update connection string"
        echo "💡 Check MONGODB_AUTHENTICATION_COMPLETE_FIX.md for instructions"
    fi
else
    echo "❌ test_mongodb_connection.js not found"
fi

# Test 3: Check backend status
echo ""
echo "📋 Step 3: Checking backend status..."
BACKEND_URL="https://proposify-ai-6.onrender.com"
if curl -s -f "$BACKEND_URL/api/health" > /dev/null; then
    echo "✅ Backend is responding: $BACKEND_URL"
    
    # Get health status
    HEALTH_RESPONSE=$(curl -s "$BACKEND_URL/api/health")
    echo "📊 Health check response: $HEALTH_RESPONSE"
else
    echo "❌ Backend not responding at $BACKEND_URL"
    echo "💡 This might be due to MongoDB authentication issues"
fi

# Test 4: Check GitHub Pages frontend
echo ""
echo "📋 Step 4: Checking GitHub Pages frontend..."
FRONTEND_URL="https://saibalajisinghrajput-glitch.github.io/proposify.ai"
if curl -s -f "$FRONTEND_URL" > /dev/null; then
    echo "✅ Frontend is accessible: $FRONTEND_URL"
else
    echo "❌ Frontend not accessible at $FRONTEND_URL"
    echo "💡 Run ./deploy_github_pages.sh to deploy the frontend"
fi

# Test 5: Check if deployment scripts exist
echo ""
echo "📋 Step 5: Checking deployment scripts..."
if [ -f "deploy_github_pages.sh" ]; then
    echo "✅ GitHub Pages deployment script found"
else
    echo "❌ GitHub Pages deployment script missing"
fi

if [ -f "test_mongodb_connection.js" ]; then
    echo "✅ MongoDB test script found"
else
    echo "❌ MongoDB test script missing"
fi

# Summary
echo ""
echo "📋 Summary"
echo "=========="
echo "🎯 Backend URL: $BACKEND_URL"
echo "🌐 Frontend URL: $FRONTEND_URL"
echo ""
echo "📝 Next Steps:"
echo "1. If MongoDB failed: Update MONGODB_URI in Render dashboard"
echo "2. If frontend failed: Run ./deploy_github_pages.sh"
echo "3. After fixes: Re-run this script to verify everything works"

# CORS Test
echo ""
echo "📋 Step 6: Testing CORS configuration..."
echo "Testing if frontend can communicate with backend..."

# Create a simple CORS test
cat > cors_test.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>CORS Test</title>
</head>
<body>
    <h1>CORS Test</h1>
    <div id="result">Testing...</div>
    
    <script>
        const backendUrl = 'https://proposify-ai-6.onrender.com';
        
        fetch(backendUrl + '/api/health')
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then(data => {
                document.getElementById('result').innerHTML = 
                    '✅ CORS Test PASSED: ' + JSON.stringify(data);
            })
            .catch(error => {
                document.getElementById('result').innerHTML = 
                    '❌ CORS Test FAILED: ' + error.message;
            });
    </script>
</body>
</html>
EOF

echo "✅ CORS test file created: cors_test.html"
echo "💡 Open cors_test.html in a browser to test CORS"

echo ""
echo "🎉 Verification complete!"
echo ""
echo "🔗 Quick Links:"
echo "• Backend: https://proposify-ai-6.onrender.com"
echo "• Frontend: https://saibalajisinghrajput-glitch.github.io/proposify.ai"
echo "• MongoDB Atlas: https://cloud.mongodb.com/"
echo "• Render Dashboard: https://dashboard.render.com/"
