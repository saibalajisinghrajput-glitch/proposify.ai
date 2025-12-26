


const Proposal = require('../models/Proposal');
const Project = require('../models/Project');
const User = require('../models/User');
const { generateProposalContent, getStatus } = require('../utils/openai');
const { generatePDF } = require('../utils/pdf');


const generateProposal = async (req, res) => {
  try {
    const { projectId } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user can generate proposal
    if (!user.canGenerateProposal()) {
      return res.status(403).json({ 
        message: 'Proposal generation limit reached for this month',
        usage: user.usage.proposalsGenerated,
        limit: user.planLimits.proposalsPerMonth,
        upgradeRequired: true
      });
    }

    // Estimate AI tokens needed (rough estimate based on content length)
    const estimatedTokens = 1500; // Average tokens for a proposal

    if (!user.canUseAI(estimatedTokens)) {
      return res.status(403).json({ 
        message: 'AI token limit reached for this month',
        usage: user.usage.aiTokensUsed,
        limit: user.planLimits.aiTokensPerMonth,
        upgradeRequired: true
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      user: req.user.id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    console.log('🚀 Starting proposal generation for project:', projectId);
    
    // Generate proposal content using the improved OpenAI utility
    const content = await generateProposalContent(project);

    const proposal = new Proposal({
      project: projectId,
      content
    });

    await proposal.save();

    // Update user usage
    user.incrementUsage('proposalsGenerated', 1);
    user.incrementUsage('aiTokensUsed', estimatedTokens);
    await user.save();
    
    // Log OpenAI status for debugging
    const status = getStatus();
    console.log('📊 OpenAI Status:', status);

    res.status(201).json({ 
      proposal,
      openaiStatus: status,
      message: 'Proposal generated successfully',
      usage: {
        proposalsGenerated: user.usage.proposalsGenerated,
        aiTokensUsed: user.usage.aiTokensUsed,
        remaining: {
          proposals: user.planLimits.proposalsPerMonth - user.usage.proposalsGenerated,
          tokens: user.planLimits.aiTokensPerMonth - user.usage.aiTokensUsed
        }
      }
    });
  } catch (error) {
    console.error('❌ Error generating proposal:', error);
    res.status(500).json({ 
      message: 'Failed to generate proposal',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};


const getProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findOne({
      _id: req.params.id,
      project: { $in: await Project.find({ user: req.user.id }).distinct('_id') }
    });

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Download proposal as PDF with usage tracking
const downloadProposalPDF = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user can download PDF
    if (!user.canDownloadPDF()) {
      return res.status(403).json({ 
        message: 'PDF download requires a paid subscription',
        usage: user.usage.pdfDownloads,
        limit: user.planLimits.pdfDownloadsPerMonth,
        upgradeRequired: true
      });
    }

    const proposal = await Proposal.findOne({
      _id: req.params.id,
      project: { $in: await Project.find({ user: req.user.id }).distinct('_id') }
    });

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    // Generate PDF
    const pdfBuffer = await generatePDF(proposal.content, `Proposal - ${proposal._id}`);

    // Update user usage
    user.incrementUsage('pdfDownloads', 1);
    await user.save();

    // Set response headers for PDF download
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="proposal-${proposal._id}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
};


const updateProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findOneAndUpdate(
      {
        _id: req.params.id,
        project: { $in: await Project.find({ user: req.user.id }).distinct('_id') }
      },
      req.body,
      { new: true }
    );

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  generateProposal,
  getProposal,
  updateProposal,
  downloadProposalPDF
};
