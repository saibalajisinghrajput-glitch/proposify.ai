# 🚨 CRITICAL: REPLACE PLACEHOLDER VALUES WITH REAL VALUES

## ⚠️ YOU MUST DO THIS NOW - BACKEND WON'T WORK WITH PLACEHOLDERS

**Current Status**: Your Railway deployment has placeholder values that need to be replaced with REAL values.

---

## 🟢 STEP 1: FIX MONGODB_URI (Database Connection)

### How to get your real MongoDB URI:

1. **Go to**: https://cloud.mongodb.com
2. **Login** to your MongoDB Atlas account
3. **Select** your cluster (like `Cluster0`)
4. **Click**: "Connect" button
5. **Choose**: "Connect your application"
6. **Copy** the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/proposify?retryWrites=true&w=majority
   ```
7. **Replace** `your_mongodb_atlas_connection_string_here` with this REAL value

### If you don't have MongoDB Atlas:
1. **Go to**: https://cloud.mongodb.com
2. **Create free account**
3. **Create cluster** (free tier)
4. **Create database user**
5. **Get connection string**

---

## 🟢 STEP 2: FIX OPENAI_API_KEY (AI Features)

### How to get your real OpenAI API Key:

1. **Go to**: https://platform.openai.com/api-keys
2. **Login** to OpenAI account
3. **Click**: "Create new secret key"
4. **Copy** the key (starts with `sk-`)
5. **Replace** `your_openai_api_key_here` with this REAL value

### If you don't have OpenAI account:
1. **Go to**: https://platform.openai.com
2. **Create account**
3. **Add payment method** (required for API calls)
4. **Create API key**

---

## 🟢 STEP 3: FIX JWT_SECRET (Authentication)

### How to generate a real JWT Secret:

**Option 1 - Use this command** (in terminal):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2 - Use this online tool**:
- Go to: https://www.grc.com/passwords.htm
- Generate 32 random characters
- Copy the result

**Option 3 - Generate any random string**:
- Example: `9f3a1c8d2e4b7a6c1d9e8a7b6c5d4e3f`
- Just make it long and random

**Replace** `your_strong_random_secret_here` with this REAL value

---

## 🟢 STEP 4: FIX STRIPE KEYS (Optional - For Payments)

### How to get your real Stripe Keys:

1. **Go to**: https://dashboard.stripe.com/apikeys
2. **Login** to Stripe account
3. **In "Developers" section**: Click "API keys"
4. **Copy** these keys:

**For testing** (recommended for now):
- **Publishable key**: `pk_test_xxxxxxxxxx`
- **Secret key**: `sk_test_xxxxxxxxxx`

**For production** (later):
- **Publishable key**: `pk_live_xxxxxxxxxx`
- **Secret key**: `sk_live_xxxxxxxxxx`

**Replace**:
- `your_stripe_secret_key_here` with `sk_test_xxxxxxxxxx`
- `your_stripe_webhook_secret_here` with `whsec_xxxxxxxxxx` (from Webhooks section)

### If you don't have Stripe account:
1. **Go to**: https://stripe.com
2. **Create account**
3. **Verify account**
4. **Get test keys** (free to test)

---

## 🚀 STEP 5: UPDATE RAILWAY VARIABLES

### In Railway Dashboard:

1. **Go to**: Railway → Your Service → Variables
2. **Click**: "Raw Editor (ENV)"
3. **Replace EVERY placeholder** with real values:

```env
NODE_ENV=production
PORT=5001
ENABLE_DEMO_MODE=false

MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/proposify

OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx

JWT_SECRET=9f3a1c8d2e4b7a6c1d9e8a7b6c5d4e3f

STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

### ⚠️ IMPORTANT RULES:
- **No quotes**
- **No spaces around equals**
- **One variable per line**
- **Copy EXACTLY** (including all characters)

---

## 🔄 STEP 6: SAVE AND REDEPLOY

1. **Click**: "Save" in Railway
2. **Wait**: Railway will auto-redeploy
3. **Watch**: The deployment logs
4. **Success indicators**:
   - ✅ "Server running on port 5001"
   - ✅ "MongoDB connected successfully"
   - ✅ "Build completed successfully"

---

## 🧪 STEP 7: TEST YOUR BACKEND

### Test the health endpoint:
1. **Go to**: `https://YOUR-RAILWAY-DOMAIN/api/health`
2. **Expected response**: `{"status": "OK"}` or `{"status": "Backend is running"}`

### Test with curl:
```bash
curl https://YOUR-RAILWAY-DOMAIN/api/health
```

---

## ✅ SUCCESS CHECKLIST

**Before moving to frontend:**
- [ ] MongoDB URI has REAL connection string
- [ ] OpenAI API key has REAL `sk-` key
- [ ] JWT_SECRET has REAL random string
- [ ] Stripe keys have REAL test keys (or remove if not needed)
- [ ] Health check returns: `{"status": "OK"}`
- [ ] Railway logs show: "Server running on port 5001"
- [ ] Railway logs show: "MongoDB connected successfully"

**Once backend is working, we can:**
1. Update frontend API config
2. Deploy frontend to Vercel
3. Test the full application

---

## 🆘 TROUBLESHOOTING

**If health check fails:**
- Check Railway logs for errors
- Verify all variables are set correctly
- Ensure no extra spaces or quotes

**If MongoDB connection fails:**
- Verify connection string is correct
- Check username/password in connection string
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

**If OpenAI errors:**
- Verify API key starts with `sk-`
- Check OpenAI account has credits
- Ensure key is active (not expired)

---

**🎯 **PRIORITY**: Fix the MongoDB URI and OpenAI API key FIRST - these are critical for basic functionality!**

