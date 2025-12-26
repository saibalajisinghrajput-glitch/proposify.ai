

const User = require('../models/User');

// Only initialize Stripe if the key is available
const stripe = process.env.STRIPE_SECRET_KEY 
  ? require('stripe')(process.env.STRIPE_SECRET_KEY) 
  : null;

// Plan configurations
const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    proposalsPerMonth: 3,
    contractsPerMonth: 2,
    pdfDownloadsPerMonth: 0,
    aiTokensPerMonth: 10000,
    features: [
      '3 proposals per month',
      '2 contracts per month', 
      'Basic AI generation',
      'No PDF downloads'
    ]
  },
  premium: {
    name: 'Premium',
    price: 29,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    proposalsPerMonth: 25,
    contractsPerMonth: 15,
    pdfDownloadsPerMonth: 50,
    aiTokensPerMonth: 100000,
    features: [
      '25 proposals per month',
      '15 contracts per month',
      'Unlimited PDF downloads',
      'Advanced AI generation',
      'Priority support'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    proposalsPerMonth: 100,
    contractsPerMonth: 75,
    pdfDownloadsPerMonth: 200,
    aiTokensPerMonth: 500000,
    features: [
      '100 proposals per month',
      '75 contracts per month',
      '200 PDF downloads per month',
      'Premium AI generation',
      'White-label options',
      'Dedicated support'
    ]
  }
};



// Get available plans
const getPlans = async (req, res) => {
  try {
    res.json({ plans: PLANS });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch plans' });
  }
};

// Get user subscription status and usage
const getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const status = user.getSubscriptionStatus();
    const currentPlan = PLANS[user.subscription];
    
    // Calculate days remaining in trial/subscription
    let daysRemaining = null;
    if (status === 'trial' && user.trialEndsAt) {
      const now = new Date();
      const diffTime = user.trialEndsAt - now;
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    res.json({
      subscription: user.subscription,
      status: status,
      currentPlan: currentPlan,
      usage: user.usage,
      planLimits: user.planLimits,
      daysRemaining: daysRemaining,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ message: 'Failed to fetch subscription status' });
  }
};

const createSubscription = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!stripe) {
      return res.status(503).json({ message: 'Payment processing not available' });
    }

    if (!PLANS[plan] || plan === 'free') {
      return res.status(400).json({ message: 'Invalid subscription plan' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let customer;
    if (user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user._id.toString()
        }
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    const priceId = PLANS[plan].priceId;
    if (!priceId) {
      return res.status(400).json({ message: 'Price ID not configured for this plan' });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription?canceled=true`,
      metadata: {
        userId: user._id.toString(),
        plan: plan
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ message: 'Payment processing failed' });
  }
};

// Cancel subscription
const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.stripeSubscriptionId) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    if (!stripe) {
      return res.status(503).json({ message: 'Payment processing not available' });
    }

    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    res.json({ message: 'Subscription will be canceled at the end of the current period' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ message: 'Failed to cancel subscription' });
  }
};

// Get user's usage statistics
const getUsageStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const status = user.getSubscriptionStatus();
    
    res.json({
      usage: user.usage,
      planLimits: user.planLimits,
      subscriptionStatus: status,
      subscription: user.subscription
    });
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    res.status(500).json({ message: 'Failed to fetch usage statistics' });
  }
};

// Reset usage (admin function - for testing)
const resetUsage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.resetMonthlyUsage();
    await user.save();

    res.json({ message: 'Usage reset successfully', usage: user.usage });
  } catch (error) {
    console.error('Error resetting usage:', error);
    res.status(500).json({ message: 'Failed to reset usage' });
  }
};


const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const plan = session.metadata.plan;

        if (userId && plan) {
          const user = await User.findById(userId);
          if (user) {
            user.subscription = plan;
            user.subscriptionStatus = 'active';
            user.stripeSubscriptionId = session.subscription;
            user.updatePlanLimits();
            await user.save();
            console.log(`User ${userId} upgraded to ${plan} plan`);
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        const subscriptionId = invoice.subscription;

        const user = await User.findOne({ 
          $or: [
            { stripeCustomerId: customerId },
            { stripeSubscriptionId: subscriptionId }
          ]
        });

        if (user) {
          user.subscriptionStatus = 'active';
          await user.save();
          console.log(`Payment succeeded for user ${user._id}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer;

        const user = await User.findOne({ stripeCustomerId: customerId });
        if (user) {
          user.subscriptionStatus = 'past_due';
          await user.save();
          console.log(`Payment failed for user ${user._id}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const user = await User.findOne({ stripeSubscriptionId: subscription.id });

        if (user) {
          user.subscription = 'free';
          user.subscriptionStatus = 'inactive';
          user.stripeSubscriptionId = null;
          user.updatePlanLimits(); // Reset to free plan limits
          user.resetMonthlyUsage();
          await user.save();
          console.log(`Subscription canceled for user ${user._id}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const user = await User.findOne({ stripeSubscriptionId: subscription.id });

        if (user) {
          user.subscriptionStatus = subscription.status;
          if (subscription.status === 'active') {
            // Update plan limits if subscription is active
            // You might want to determine the plan from the subscription items
          }
          await user.save();
          console.log(`Subscription updated for user ${user._id}: ${subscription.status}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

module.exports = {
  createSubscription,
  handleWebhook,
  getPlans,
  getSubscriptionStatus,
  cancelSubscription,
  getUsageStats,
  resetUsage
};
