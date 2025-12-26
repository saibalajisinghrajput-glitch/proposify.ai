const mongoose = require('mongoose');

const offerLetterSchema = new mongoose.Schema({
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
  position: {
    type: String,
    required: true,
    trim: true
  },

  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'],
    required: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  stipend: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  hrContactDetails: {
    type: String,
    trim: true
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

module.exports = mongoose.model('OfferLetter', offerLetterSchema);
