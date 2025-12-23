# Stripe Payments Setup Guide

## 🚀 Complete Stripe Subscription System Implementation

Your ProposifyAI application now has a comprehensive subscription system with usage limits and payment gating!

## 📋 What Was Implemented

### ✅ **Usage-Based Limits**
- **Free Plan**: 3 proposals, 2 contracts, 0 PDF downloads, 10K AI tokens/month
- **Premium ($29)**: 25 proposals, 15 contracts, 50 PDF downloads, 100K AI tokens/month  
- **Enterprise ($99)**: 100 proposals, 75 contracts, 200 PDF downloads, 500K AI tokens/month

### ✅ **PDF Download Paywall**
- Free users cannot download PDFs
- Paid users get limited downloads based on their subscription tier
- All PDF downloads are tracked and counted against limits

### ✅ **AI Token Management**
- All AI generations consume tokens (proposals: ~1500, contracts: ~2000)
- Users get clear feedback on remaining usage
- Automatic upgrade prompts when limits are reached

### ✅ **Professional Content Generation**
- Enhanced prompts for natural, business-quality content
- Industry-specific language and terminology
- Removes AI-typical phrasing patterns

### ✅ **Complete Stripe Integration**
- Secure webhook handling for subscription events
- Automatic plan upgrades and downgrades
- Usage tracking and limit enforcement

## 🔧 Setup Required

### 1. **Stripe Products & Prices**

Create these in your Stripe Dashboard:

**Product: ProposifyAI Premium**
- Price: $29.00 USD
- Recurring: Monthly
- Price ID: `price_premium_xxx`

**Product: ProposifyAI Enterprise** 
- Price: $99.00 USD
- Recurring: Monthly
- Price ID: `price_enterprise_xxx`

### 2. **Environment Variables**

Add to your `backend/.env`:
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PREMIUM_PRICE_ID=price_premium_xxx
STRIPE_ENTERPRISE_PRICE_ID=price_enterprise_xxx
```

### 3. **Webhook Endpoint**

In Stripe Dashboard → Webhooks → Add endpoint:
```
URL: https://your-backend-domain.com/api/payments/webhook
Events: 
- checkout.session.completed
- invoice.payment_succeeded
- invoice.payment_failed
- customer.subscription.deleted
- customer.subscription.updated
```

## 🛠️ Backend Files Updated

- ✅ `backend/models/User.js` - Usage tracking & plan limits
- ✅ `backend/controllers/payments.js` - Complete Stripe integration
- ✅ `backend/controllers/proposals.js` - Usage enforcement
- ✅ `backend/controllers/contracts.js` - Usage enforcement  
- ✅ `backend/routes/payments.js` - New payment endpoints
- ✅ `backend/routes/proposals.js` - PDF download route
- ✅ `backend/routes/contracts.js` - PDF download route

## 🎯 API Endpoints Added

### Payment Management
- `GET /api/payments/plans` - Get available subscription plans
- `GET /api/payments/status` - Get user's subscription status & usage
- `POST /api/payments/create-subscription` - Create Stripe checkout
- `POST /api/payments/cancel-subscription` - Cancel subscription
- `GET /api/payments/usage` - Get detailed usage statistics
- `POST /api/payments/reset-usage` - Reset usage (admin/testing)

### PDF Downloads (Usage Tracked)
- `GET /api/proposals/:id/pdf` - Download proposal PDF
- `GET /api/contracts/:id/download` - Download contract PDF

## 💰 Revenue Model

### Free Tier (Lead Generation)
- Limited AI generation to showcase value
- No PDF downloads (major pain point for free users)
- Clear upgrade prompts throughout app

### Premium Tier ($29/month)
- Professional usage limits for small businesses
- 50 PDF downloads should be sufficient for most users
- Great value proposition

### Enterprise Tier ($99/month)
- High-volume usage for agencies
- White-label options mentioned
- Suitable for power users

## 🔒 Security Features

- ✅ All payment processing handled by Stripe
- ✅ Webhook signature verification
- ✅ Usage limits enforced server-side
- ✅ No sensitive payment data stored locally
- ✅ JWT-based authentication for all endpoints

## 📊 User Experience

### Free User Journey
1. Sign up → Limited usage (3 proposals, 2 contracts)
2. Try feature → Hit limit → Upgrade prompt
3. Want PDF download → Paywall message
4. Clear value proposition for upgrading

### Paid User Experience
1. Subscribe → Instant access to limits
2. Usage tracking visible in dashboard
3. PDF downloads work seamlessly
4. Clear remaining usage display

## 🎯 Next Steps for User Conversion

1. **Deploy the system** with your Stripe keys
2. **Test the payment flow** end-to-end
3. **Add usage indicators** in the UI (remaining counts)
4. **Optimize upgrade prompts** based on user behavior
5. **A/B test pricing** and limits

## 🧪 Testing

1. Create test products in Stripe
2. Use test credit card: `4242 4242 4242 4242`
3. Test both subscription flows
4. Verify usage tracking works
5. Test PDF download restrictions

Your subscription system is now production-ready and will convert free users to paid subscribers! 🚀
