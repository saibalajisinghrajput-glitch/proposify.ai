# Quick MongoDB Setup Guide

## Fastest Solution: MongoDB Atlas (Cloud - 5 minutes)

### Step 1: Create Free MongoDB Atlas Account
1. Go to https://cloud.mongodb.com/
2. Click "Start Free"
3. Sign up with your email
4. Create a new project (name it "ProposifyAI")

### Step 2: Create Free Cluster
1. Click "Build a Database"
2. Choose "M0 Free" (free tier)
3. Name your cluster: "proposifyai-cluster"
4. Click "Create"

### Step 3: Setup Database Access
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `proposifyai`
5. Password: `ProposifyAI123!`
6. Role: "Atlas admin" (for development)
7. Click "Add User"

### Step 4: Setup Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go back to "Clusters"
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. It will look like: `mongodb+srv://proposifyai:<password>@proposifyai-cluster.xxxxx.mongodb.net/test?retryWrites=true&w=majority`

### Step 6: Update Backend Configuration
Replace the `MONGODB_URI` in your `backend/.env` file with your connection string:

```env
MONGODB_URI=mongodb+srv://proposifyai:ProposifyAI123!@proposifyai-cluster.xxxxx.mongodb.net/test?retryWrites=true&w=majority
JWT_SECRET=proposifyai_super_secret_jwt_key_2024_change_in_production
NODE_ENV=development
PORT=5001
CLIENT_URL=http://localhost:3000
```

### Step 7: Restart Backend
```bash
cd backend
npm start
```

### Step 8: Test Connection
```bash
node test_backend_connection.js
```
Should show "Database: connected"

### Step 9: Test Signup
1. Go to http://localhost:3000/signup
2. Create account with any email/password
3. Should redirect to dashboard
4. Go back to homepage - should see dashboard button!

## Benefits of MongoDB Atlas:
✅ Free forever (512MB storage)
✅ No local installation needed
✅ Accessible from anywhere
✅ Automatic backups
✅ Production-ready

## Your Dashboard Button is Ready!
Once MongoDB is connected, the dashboard button will automatically appear on the homepage when you're logged in.
