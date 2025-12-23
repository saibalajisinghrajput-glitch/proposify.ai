# Quick Fix: Enable Signup and Dashboard Access

## Problem
The signup isn't working because MongoDB is not connected to the backend.

## Solution Options

### Option 1: Use Free Cloud MongoDB (Recommended - Quick Setup)

1. **Create free MongoDB account:**
   - Go to https://cloud.mongodb.com/
   - Sign up for free
   - Create a new project
   - Create a free cluster (M0)

2. **Get connection string:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: mongodb+srv://username:password@cluster.mongodb.net/test?retryWrites=true&w=majority)

3. **Update backend configuration:**
   - Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=development
   ```

4. **Restart backend server:**
   ```bash
   cd backend
   npm start
   ```

### Option 2: Install Local MongoDB
Run the installation script I created:
```bash
chmod +x install_mongodb.sh
./install_mongodb.sh
```

## Testing the Fix

1. **Check backend connection:**
   ```bash
   node test_backend_connection.js
   ```
   Should show "Database: connected"

2. **Test signup:**
   - Go to http://localhost:3000/signup
   - Create an account with any email/password
   - Should redirect to dashboard

3. **Verify dashboard button:**
   - After login, go to http://localhost:3000
   - Should see "📊 Go to Dashboard" button
   - Should see "Quick Dashboard Access" section

## Demo Mode (Alternative)

Since the backend has demo mode enabled, you can also:
1. Go to http://localhost:3000/demo
2. Generate documents without signing up
3. But to access the real dashboard, you need MongoDB connected

## Quick Environment File
Create this in `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/proposifyai
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Then restart the backend server.
