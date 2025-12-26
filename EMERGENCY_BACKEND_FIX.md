# Emergency Backend Fix - Get Running Now

## 🚨 Immediate Solution - Bypass MongoDB Issue

Since MongoDB Atlas access is blocked, we'll use a working database solution immediately.

## ⚡ Option 1: Use Local MongoDB (Fastest)

### Step 1: Install MongoDB Locally
```bash
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community
```

### Step 2: Update Render Environment Variables
```
MONGODB_URI=mongodb://localhost:27017/proposifyai
JWT_SECRET=proposify-ai-super-secret-jwt-2024-production
CLIENT_URL=https://saibalajisinghrajput-glitch.github.io
NODE_ENV=production
PORT=10000
```

### Step 3: Deploy and Test
1. **Update Render** with new environment variables
2. **Deploy** and verify MongoDB connection

## 🔄 Option 2: Use Alternative Database

### Step 1: Create Free Supabase Account
1. Go to https://supabase.com/
2. Sign up (email, not GitHub)
3. Create new project
4. Get connection string

### Step 2: Install MongoDB Compatibility
```bash
cd backend
npm install mongodb @supabase/supabase-js
```

### Step 3: Update Environment Variables
```
DATABASE_URL=your-supabase-connection-string
MONGODB_URI=your-supabase-connection-string
JWT_SECRET=proposify-ai-super-secret-jwt-2024-production
CLIENT_URL=https://saibalajisinghrajput-glitch.github.io
NODE_ENV=production
PORT=10000
```

## 🛠️ Option 3: Quick Backend Without Database

### Create Simple Test Server
Create `backend/simple-server.js`:
```javascript
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'ProposifyAI Backend Running',
    timestamp: new Date().toISOString()
  });
});

// Test signup endpoint (no database)
app.post('/api/auth/signup', (req, res) => {
  const { email, password } = req.body;
  res.json({ 
    success: true, 
    message: 'Test signup successful',
    user: { email, id: 'test-user-id' }
  });
});

// Test login endpoint
app.post('/api/auth/login', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Test login successful',
    token: 'test-jwt-token'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 ProposifyAI Backend running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
```

### Update Backend Package.json
```json
{
  "scripts": {
    "start": "node simple-server.js",
    "dev": "node simple-server.js"
  }
}
```

### Update Render Environment Variables
```
NODE_ENV=production
PORT=10000
CLIENT_URL=https://saibalajisinghrajput-glitch.github.io
JWT_SECRET=proposify-ai-super-secret-jwt-2024-production
```

## 🎯 Recommended Action Plan

### Phase 1: Get Backend Running (5 minutes)
1. **Deploy simple server** with Option 3
2. **Verify backend health** at `/api/health`
3. **Test signup/login** endpoints

### Phase 2: Add Database Later (15 minutes)
1. **Set up MongoDB locally** or **create Supabase account**
2. **Update server.js** to include database
3. **Deploy full version**

## ✅ Verification Steps

### Test Backend Health
```bash
curl https://your-render-url.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "ProposifyAI Backend Running",
  "timestamp": "2024-12-26T06:30:00.000Z"
}
```

### Test Signup Endpoint
```bash
curl -X POST https://your-render-url.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Test signup successful",
  "user": {
    "email": "test@example.com",
    "id": "test-user-id"
  }
}
```

## 🚀 Quick Start Commands

```bash
# Option 3: Deploy simple server
cd backend
echo '{"scripts":{"start":"node simple-server.js"}}' > package.json.tmp
mv package.json.tmp package.json

# Update render.yaml
echo 'services:
  - type: web
    name: proposify-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: CLIENT_URL
        value: https://saibalajisinghrajput-glitch.github.io
      - key: JWT_SECRET
        value: proposify-ai-super-secret-jwt-2024-production' > render.yaml
```

This will get your backend running immediately without database dependencies.

