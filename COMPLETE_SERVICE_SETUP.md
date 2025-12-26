# 🚀 COMPLETE SETUP GUIDE - ALL SERVICES

## 📋 WHAT WE'LL SET UP TODAY

1. **MongoDB Atlas** (Database)
2. **OpenAI API** (AI Features)
3. **JWT Secret** (Authentication)
4. **Stripe** (Payments - Optional)

---

## 🗄️ STEP 1: MONGODB ATLAS SETUP

### Create MongoDB Atlas Account

1. **Go to**: https://cloud.mongodb.com
2. **Click**: "Start Free"
3. **Sign up** with email or Google account
4. **Verify email** if required

### Create Cluster

1. **Click**: "Create a cluster"
2. **Choose**: "M0 Free" (no cost)
3. **Select**: Closest region (e.g., "us-east-1")
4. **Name**: Leave as default or rename to "proposify-cluster"
5. **Click**: "Create cluster" (takes 1-2 minutes)

### Create Database User

1. **Go to**: "Database Access" in left sidebar
2. **Click**: "Add New Database User"
3. **Authentication method**: "Password"
4. **Username**: `proposifyuser`
5. **Password**: Generate strong password (save it!)
6. **Database User Privileges**: "Atlas admin"
7. **Click**: "Add User"

### Setup Network Access

1. **Go to**: "Network Access" in left sidebar
2. **Click**: "Add IP Address"
3. **Click**: "Allow access from anywhere" (0.0.0.0/0)
4. **Click**: "Confirm"

### Get Connection String

1. **Go back to**: "Clusters" in left sidebar
2. **Click**: "Connect" on your cluster
3. **Choose**: "Connect your application"
4. **Copy**: The connection string
5. **Replace** `<password>` with your database user password
6. **Final format**:
   ```
   mongodb+srv://proposifyuser:YOUR_PASSWORD@proposify-cluster.xxxxx.mongodb.net/proposify?retryWrites=true&w=majority
   ```

---

## 🤖 STEP 2: OPENAI API SETUP

### Create OpenAI Account

1. **Go to**: https://platform.openai.com
2. **Click**: "Sign up"
3. **Sign up** with email or Google account
4. **Verify phone number** if required

### Add Payment Method

1. **Go to**: "Billing" in left sidebar
2. **Click**: "Add payment method"
3. **Enter**: Credit card details
4. **Set usage limits**: Start with $5-10

### Create API Key

1. **Go to**: "API keys" in left sidebar
2. **Click**: "Create new secret key"
3. **Name**: "proposify-backend"
4. **Click**: "Create secret key"
5. **Copy**: The key (starts with `sk-`)
6. **Save**: It somewhere safe (you can't see it again!)

---

## 🔐 STEP 3: GENERATE JWT SECRET

### Generate Secure Random String

**Option 1 - Using Node.js**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2 - Using Online Generator**:
1. **Go to**: https://www.grc.com/passwords.htm
2. **Generate**: 64 random characters
3. **Copy**: The result

**Example JWT Secret**:
```
9f3a1c8d2e4b7a6c1d9e8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6
```

---

## 💳 STEP 4: STRIPE SETUP (OPTIONAL)

### Create Stripe Account

1. **Go to**: https://stripe.com
2. **Click**: "Start now"
3. **Sign up** with email
4. **Verify email** and phone

### Get Test API Keys

1. **Go to**: https://dashboard.stripe.com/apikeys
2. **Sign in** to Stripe dashboard
3. **In "Developers" section**: Click "API keys"
4. **Copy**:
   - **Publishable key**: `pk_test_xxxxxxxxxx`
   - **Secret key**: `sk_test_xxxxxxxxxx`

### Setup Webhooks (Optional)

1. **Go to**: "Webhooks" in left sidebar
2. **Click**: "Add endpoint"
3. **Endpoint URL**: `https://YOUR-RAILWAY-DOMAIN/api/webhooks/stripe`
4. **Events**: Select "payment_intent.succeeded"
5. **Click**: "Add endpoint"
6. **Copy**: The webhook signing secret (starts with `whsec_`)

---

## ⚡ QUICK SUMMARY - COPY THESE VALUES

**After completing all setups, you'll have**:

```
MONGODB_URI=mongodb+srv://proposifyuser:YOUR_PASSWORD@proposify-cluster.xxxxx.mongodb.net/proposify?retryWrites=true&w=majority

OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

JWT_SECRET=9f3a1c8d2e4b7a6c1d9e8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6

STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

---

## 🚀 STEP 5: UPDATE RAILWAY

### In Railway Dashboard:

1. **Go to**: Your service → Variables
2. **Click**: "Raw Editor (ENV)"
3. **Replace** all placeholder values with your REAL values:

```env
NODE_ENV=production
PORT=5001
ENABLE_DEMO_MODE=false

MONGODB_URI=mongodb+srv://proposifyuser:YOUR_PASSWORD@proposify-cluster.xxxxx.mongodb.net/proposify?retryWrites=true&w=majority

OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

JWT_SECRET=9f3a1c8d2e4b7a6c1d9e8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6

STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

4. **Click**: "Save"
5. **Wait**: For auto-redeployment
6. **Watch**: Logs for success messages

---

## 🧪 STEP 6: TEST YOUR BACKEND

### Test Health Endpoint:
1. **Go to**: `https://YOUR-RAILWAY-DOMAIN/api/health`
2. **Expected**: `{"status": "OK"}` or `{"status": "Backend is running"}`

### Test with curl:
```bash
curl https://YOUR-RAILWAY-DOMAIN/api/health
```

---

## ✅ SUCCESS INDICATORS

**Your backend is working if**:
- [ ] MongoDB Atlas shows cluster as "Available"
- [ ] OpenAI account has positive balance
- [ ] Railway logs show: "Server running on port 5001"
- [ ] Railway logs show: "MongoDB connected successfully"
- [ ] Health check returns: `{"status": "OK"}`

---

## 💰 COST BREAKDOWN

**Monthly costs (approximate)**:
- **MongoDB Atlas**: FREE (M0 cluster)
- **OpenAI API**: $5-20 (depending on usage)
- **Railway**: FREE (for small projects)
- **Stripe**: FREE (only pay when you make money)

**Total**: ~$5-20/month for basic usage

---

## 🆘 TROUBLESHOOTING

**MongoDB connection fails**:
- Check IP access: Add 0.0.0.0/0 in Network Access
- Verify username/password in connection string
- Ensure cluster is "Available" (not "Creating")

**OpenAI errors**:
- Verify API key starts with `sk-`
- Check account has credits in Billing
- Ensure API key is active

**Railway deployment fails**:
- Check build logs in Railway dashboard
- Verify all environment variables are set
- Ensure no extra spaces in variable values

---

**🎯 Next step: Once backend is working, we'll update the frontend API config and deploy to Vercel!**

