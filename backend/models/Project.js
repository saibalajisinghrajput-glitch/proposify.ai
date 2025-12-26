const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Client Contact Details
  clientName: { type: String, required: true },
  clientCompany: { type: String, required: true }, // Added Company Name
  clientPhone: { type: String, required: true },
  clientEmail: { type: String },
  
  // Business Details
  clientIndustry: { type: String, required: true },
  customIndustry: { type: String },
  country: { type: String, required: true },
  
  // Project Requirements
  budget: { type: String, required: true }, // Changed to String to store ranges like "₹10,000 – ₹25,000"
  currency: { type: String, default: 'INR' }, // Currency is always INR as per requirements
  timeline: { type: String, required: true },
  serviceType: { type: String, required: true },
  customService: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);

