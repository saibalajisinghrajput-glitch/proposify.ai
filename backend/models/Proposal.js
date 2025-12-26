const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['draft', 'generated', 'sent'], default: 'generated' },
}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);
