const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidateName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  education: {
    type: String,
    required: true,
    trim: true
  },
  skills: {
    type: String,
    required: true,
    trim: true
  },

  experienceLevel: {
    type: String,
    enum: ['Entry Level (0-2 years)', 'Mid Level (2-5 years)', 'Senior Level (5-10 years)', 'Executive Level (10+ years)'],
    required: true
  },
  jobRole: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },

  resumeType: {
    type: String,
    enum: ['modern', 'classic', 'professional', 'creative'],
    required: true
  },
  content: {
    type: String,
    required: true
  },

  isGenerated: {
    type: Boolean,
    default: true
  },
  pdfUrl: {
    type: String,
    default: null
  },
  pdfGenerated: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema);
