# 🚀 GET YOUR REAL VALUES (YOU HAVE ACCOUNTS)

## 📋 QUICK EXTRACTION GUIDE

Since you already have accounts, let's get the real values quickly:

---

## 🗄️ MONGODB ATLAS - GET CONNECTION STRING

### Step 1: Get MongoDB URI
1. **Go to**: https://cloud.mongodb.com
2. **Login** to your account
3. **Click**: "Clusters" in left sidebar
4. **Click**: "Connect" on your cluster
5. **Choose**: "Connect your application"
6. **Copy** the connection string (format: `mongodb+srv://...`)
7. **Replace** `<password>` with your actual database password
8. **Final format**:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/proposify?retryWrites=true&w=majority
   ```

---

## 🤖 OPENAI - GET API KEY

### Step 2: Get OpenAI API Key
1. **Go to**: https://platform.openai.com/api-keys
2. **Login** to your OpenAI account
3. **Click**: "Create new secret key"
4. **Name**: "proposify-backend"
5. **Click**: "Create secret key"
6. **Copy**: The key (starts with `sk-`)
7. **Save**: It somewhere safe

---

## 🔐 GENERATE JWT SECRET

### Step 3: Generate JWT Secret (Quick Command)

**Run this in your terminal:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Copy the result** - this is your JWT_SECRET

---

## 💳 STRIPE - GET TEST KEYS (OPTIONAL)

### Step 4: Get Stripe Keys (Optional)
1. **Go to**: https://dashboard.stripe.com/apikeys
2. **Login** to Stripe
3. **In "Developers" section**: Click "API keys"
4. **Copy**:
   - **Secret key**: `sk_test_xxxxxxxxxx`
   - **Webhook secret**: Get from "Webhooks" section (starts with `whsec_`)

---

## ⚡ UPDATE RAILWAY - COPY YOUR VALUES

### Step 5: Update Railway Variables

**In Railway Dashboard:**
1. **Go to**: Your service → Variables
2. **Click**: "Raw Editor (ENV)"
3. **Replace ALL placeholders** with your REAL values:

```env
NODE_ENV=production
PORT=5001
ENABLE_DEMO_MODE=false

MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/proposify?retryWrites=true&w=majority

OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

JWT_SECRET=9f3a1c8d2e4b7a6c1d9e8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6

STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

**Example with real values:**
```env
NODE_ENV=production
PORT=5001
ENABLE_DEMO_MODE=false

MONGODB_URI=mongodb+srv://proposifyuser:MyPassword123@cluster0.abcd.mongodb.net/proposify?retryWrites=true&w=majority

OPENAI_API_KEY=sk-1234567890abcdef1234567890abcdef1234567890abcdef1234567890

JWT_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef

STRIPE_SECRET_KEY=sk_test_51234567890abcdef1234567890abcdef
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef1234567890abcdef
```

### Step 6: Save and Deploy
1. **Click**: "Save"
2. **Wait**: For auto-redeployment (2-3 minutes)
3. **Watch**: Logs for success

---

## 🧪 TEST YOUR BACKEND

### Step 7: Verify It's Working

**Test your health endpoint:**
1. **Go to**: `https://YOUR-RAILWAY-DOMAIN/api/health`
2. **Expected response**: `{"status": "OK"}` or `{"status": "Backend is running"}`

**Alternative test with curl:**
```bash
curl https://YOUR-RAILWAY-DOMAIN/api/health
```

---

## ✅ SUCCESS CHECKLIST

**Backend is working when**:
- [ ] Railway logs show: "Server running on port 5001"
- [ ] Railway logs show: "MongoDB connected successfully"
- [ ] Health check returns: `{"status": "OK"}`
- [ ] No errors in deployment logs

---

## 🚨 COMMON ISSUES

**If MongoDB connection fails:**
- Check if IP access allows 0.0.0.0/0 in Network Access
- Verify username/password in connection string
- Ensure cluster status is "Available"

**If OpenAI errors:**
- Verify API key starts with `sk-`
- Check account has billing setup
- Ensure API key is active

**If deployment fails:**
- Check build logs in Railway
- Verify no extra spaces in variables
- Ensure all required variables are set

---

## 🎯 WHAT YOU NEED TO COPY

**Please share these values with me:**

1. **MONGODB_URI**: `mongodb+srv://...` (your connection string)
2. **OPENAI_API_KEY**: `sk-...` (your OpenAI API key)
3. **JWT_SECRET**: `a1b2c3...` (generated random string)
4. **STRIPE_SECRET_KEY**: `sk_test_...` (optional, from Stripe)

Once you have these values and Railway is updated, we can:
1. **Test the backend** 
2. **Update frontend API config**
3. **Deploy frontend to Vercel**
4. **Have a fully working application!**

---

**💡 Quick tip**: Copy these values into a text file first, then paste into Railway to avoid typos!

