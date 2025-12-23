# MongoDB Atlas Setup - Step by Step Guide

## Quick 5-Minute Setup

### Step 1: Create MongoDB Atlas Account
1. **Go to:** https://cloud.mongodb.com/
2. **Click:** "Start Free" button (top right)
3. **Sign up with:** Your email address
4. **Verify:** Your email if prompted

### Step 2: Create Your First Project
1. **Click:** "Create Project" button
2. **Project Name:** Enter "ProposifyAI"
3. **Click:** "Create Project"
4. **Choose:** "Start with a free cluster" when asked

### Step 3: Build Your Free Database
1. **Cluster Tier:** Select "M0 Free" (512MB storage, free forever)
2. **Cloud Provider & Region:** 
   - Choose "AWS" 
   - Select "N. Virginia (us-east-1)" (closest to you)
3. **Cluster Name:** Leave as default or rename to "proposifyai-cluster"
4. **Click:** "Create Cluster"

### Step 4: Setup Database Access (2 minutes)
1. **Wait** for cluster to be created (shows "Creating..." initially)
2. **Click:** "Database Access" in left sidebar
3. **Click:** "Add New Database User"
4. **Authentication Method:** Select "Password"
5. **Username:** `proposifyai`
6. **Password:** `ProposifyAI123!`
7. **Database User Privileges:** Select "Atlas admin"
8. **Click:** "Add User"

### Step 5: Setup Network Access (30 seconds)
1. **Click:** "Network Access" in left sidebar
2. **Click:** "Add IP Address"
3. **Click:** "Allow access from anywhere" (0.0.0.0/0)
4. **Click:** "Confirm"

### Step 6: Get Connection String (1 minute)
1. **Go back** to "Clusters" in left sidebar
2. **Find your cluster** (proposifyai-cluster)
3. **Click:** "Connect" button
4. **Choose:** "Connect your application"
5. **Copy the connection string** (it looks like this):
   ```
   mongodb+srv://proposifyai:<password>@proposifyai-cluster.xxxxx.mongodb.net/test?retryWrites=true&w=majority
   ```

### Step 7: Update Backend Configuration
1. **Open** the file: `backend/.env`
2. **Replace** the MONGODB_URI line with your connection string:
   ```env
   MONGODB_URI=mongodb+srv://proposifyai:ProposifyAI123!@proposifyai-cluster.xxxxx.mongodb.net/test?retryWrites=true&w=majority
   JWT_SECRET=proposifyai_super_secret_jwt_key_2024_change_in_production
   NODE_ENV=development
   PORT=5001
   CLIENT_URL=http://localhost:3000
   ```

### Step 8: Restart Backend Server
```bash
cd backend
npm start
```

### Step 9: Test Connection
```bash
cd /Users/saibalajisinghrajput/Desktop/proposifyai
node test_backend_connection.js
```
**Expected result:** Should show "Database: connected"

### Step 10: Test Signup & Dashboard
1. **Go to:** http://localhost:3000/signup
2. **Create account** with any email/password
3. **Should redirect to dashboard** successfully
4. **Go back to homepage** - should see dashboard button!

## Troubleshooting

**If connection fails:**
- Make sure cluster is fully created (not "Creating..." status)
- Wait 2-3 minutes after creating cluster
- Check that network access is set to "Allow access from anywhere"

**If signup still fails:**
- Run: `node test_backend_connection.js` to verify database connection
- Check backend logs for any error messages

## Success Indicators
✅ Backend connection test shows "Database: connected"  
✅ Signup form submits without errors  
✅ Redirects to dashboard after signup  
✅ Dashboard button appears on homepage  

Your dashboard button is already implemented - it will automatically appear once MongoDB Atlas is connected!
