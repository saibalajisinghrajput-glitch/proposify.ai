

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ObjectId } = mongoose.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  subscription: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    default: 'free'
  },
  stripeCustomerId: {
    type: String,
    sparse: true
  },
  stripeSubscriptionId: {
    type: String,
    sparse: true
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'canceled', 'past_due'],
    default: 'inactive'
  },
  trialEndsAt: {
    type: Date,
    default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days trial
  },

  // Usage tracking
  usage: {
    proposalsGenerated: {
      type: Number,
      default: 0
    },
    contractsGenerated: {
      type: Number,
      default: 0
    },
    resumesGenerated: {
      type: Number,
      default: 0
    },
    offerLettersGenerated: {
      type: Number,
      default: 0
    },
    pdfDownloads: {
      type: Number,
      default: 0
    },
    aiTokensUsed: {
      type: Number,
      default: 0
    },
    resetDate: {
      type: Date,
      default: Date.now
    }
  },
  // Plan limits
  planLimits: {
    proposalsPerMonth: {
      type: Number,
      default: 3
    },
    contractsPerMonth: {
      type: Number,
      default: 2
    },
    resumesPerMonth: {
      type: Number,
      default: 2
    },
    offerLettersPerMonth: {
      type: Number,
      default: 2
    },
    pdfDownloadsPerMonth: {
      type: Number,
      default: 0 // No PDF downloads for free
    },
    aiTokensPerMonth: {
      type: Number,
      default: 10000
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});



// Hash password before saving
userSchema.pre('save', async function() {
  console.log('Pre-save hook triggered');
  if (!this.isModified('password')) {
    console.log('Password not modified');
    return;
  }
  console.log('Hashing password...');
  this.password = await bcrypt.hash(this.password, 12);
  console.log('Password hashed');
});


// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if user can generate proposal
userSchema.methods.canGenerateProposal = function() {
  return this.usage.proposalsGenerated < this.planLimits.proposalsPerMonth;
};


// Check if user can generate contract
userSchema.methods.canGenerateContract = function() {
  return this.usage.contractsGenerated < this.planLimits.contractsPerMonth;
};

// Check if user can generate resume
userSchema.methods.canGenerateResume = function() {
  return this.usage.resumesGenerated < this.planLimits.resumesPerMonth;
};

// Check if user can generate offer letter
userSchema.methods.canGenerateOfferLetter = function() {
  return this.usage.offerLettersGenerated < this.planLimits.offerLettersPerMonth;
};

// Check if user can download PDF
userSchema.methods.canDownloadPDF = function() {
  return this.usage.pdfDownloads < this.planLimits.pdfDownloadsPerMonth && 
         this.planLimits.pdfDownloadsPerMonth > 0;
};

// Check if user can use AI (check tokens)
userSchema.methods.canUseAI = function(tokensNeeded = 0) {
  return this.usage.aiTokensUsed + tokensNeeded <= this.planLimits.aiTokensPerMonth;
};

// Increment usage
userSchema.methods.incrementUsage = function(type, amount = 1) {
  if (this.usage[type] !== undefined) {
    this.usage[type] += amount;
  }
};


// Reset monthly usage (call this monthly)
userSchema.methods.resetMonthlyUsage = function() {
  this.usage.proposalsGenerated = 0;
  this.usage.contractsGenerated = 0;
  this.usage.resumesGenerated = 0;
  this.usage.offerLettersGenerated = 0;
  this.usage.pdfDownloads = 0;
  this.usage.aiTokensUsed = 0;
  this.usage.resetDate = new Date();
};


// Update plan limits based on subscription
userSchema.methods.updatePlanLimits = function() {
  switch (this.subscription) {
    case 'premium':
      this.planLimits = {
        proposalsPerMonth: 25,
        contractsPerMonth: 15,
        resumesPerMonth: 20,
        offerLettersPerMonth: 20,
        pdfDownloadsPerMonth: 50,
        aiTokensPerMonth: 100000
      };
      break;
    case 'enterprise':
      this.planLimits = {
        proposalsPerMonth: 100,
        contractsPerMonth: 75,
        resumesPerMonth: 50,
        offerLettersPerMonth: 50,
        pdfDownloadsPerMonth: 200,
        aiTokensPerMonth: 500000
      };
      break;
    default: // free
      this.planLimits = {
        proposalsPerMonth: 3,
        contractsPerMonth: 2,
        resumesPerMonth: 2,
        offerLettersPerMonth: 2,
        pdfDownloadsPerMonth: 0,
        aiTokensPerMonth: 10000
      };
  }
};

// Get current subscription status
userSchema.methods.getSubscriptionStatus = function() {
  const now = new Date();
  
  // Check if trial is active
  if (this.trialEndsAt && this.trialEndsAt > now && this.subscription === 'free') {
    return 'trial';
  }
  
  // Check subscription status
  if (this.subscription !== 'free' && this.subscriptionStatus === 'active') {
    return 'active';
  }
  
  return 'inactive';
};

module.exports = mongoose.model('User', userSchema);
