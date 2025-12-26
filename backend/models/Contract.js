const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  content: { type: String, required: true },
  clauses: [{ type: String }],
  status: { type: String, enum: ['draft', 'generated', 'sent'], default: 'generated' },
}, { timestamps: true });

module.exports = mongoose.model('Contract', contractSchema);
