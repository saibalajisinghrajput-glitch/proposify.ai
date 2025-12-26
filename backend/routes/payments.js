
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  createSubscription, 
  handleWebhook,
  getPlans,
  getSubscriptionStatus,
  cancelSubscription,
  getUsageStats,
  resetUsage
} = require('../controllers/payments');

// Get available subscription plans
router.get('/plans', auth, getPlans);

// Get user's subscription status and usage
router.get('/status', auth, getSubscriptionStatus);

// Create new subscription
router.post('/create-subscription', auth, createSubscription);

// Cancel subscription
router.post('/cancel-subscription', auth, cancelSubscription);

// Get usage statistics
router.get('/usage', auth, getUsageStats);

// Reset usage (for testing purposes)
router.post('/reset-usage', auth, resetUsage);

// Stripe webhook (no auth required)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
