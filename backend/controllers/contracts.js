


const Contract = require('../models/Contract');
const Project = require('../models/Project');
const User = require('../models/User');
const { generateContractContent } = require('../utils/openai');
const { generatePDF } = require('../utils/pdf');


const generateContract = async (req, res) => {
  try {
    const { projectId } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user can generate contract
    if (!user.canGenerateContract()) {
      return res.status(403).json({ 
        message: 'Contract generation limit reached for this month',
        usage: user.usage.contractsGenerated,
        limit: user.planLimits.contractsPerMonth,
        upgradeRequired: true
      });
    }

    // Estimate AI tokens needed
    const estimatedTokens = 2000; // Average tokens for a contract

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


    const content = await generateContractContent(project);

    const contract = new Contract({
      project: projectId,
      content,
      clauses: [
        'Scope of Work',
        'Payment Terms',
        'Timeline and Milestones',
        'Intellectual Property Rights',
        'Confidentiality',
        'Termination',
        'Governing Law'
      ]
    });

    await contract.save();

    // Update user usage
    user.incrementUsage('contractsGenerated', 1);
    user.incrementUsage('aiTokensUsed', estimatedTokens);
    await user.save();

    res.status(201).json({ 
      contract,
      message: 'Contract generated successfully',
      usage: {
        contractsGenerated: user.usage.contractsGenerated,
        aiTokensUsed: user.usage.aiTokensUsed,
        remaining: {
          contracts: user.planLimits.contractsPerMonth - user.usage.contractsGenerated,
          tokens: user.planLimits.aiTokensPerMonth - user.usage.aiTokensUsed
        }
      }
    });
  } catch (error) {
    console.error('Error generating contract:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getContract = async (req, res) => {
  try {
    const contract = await Contract.findOne({
      _id: req.params.id,
      project: { $in: await Project.find({ user: req.user.id }).distinct('_id') }
    });

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    res.json(contract);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Download contract as PDF with usage tracking
const downloadContractPDF = async (req, res) => {
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

    const contract = await Contract.findOne({
      _id: req.params.id,
      project: { $in: await Project.find({ user: req.user.id }).distinct('_id') }
    });

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Generate PDF
    const pdfBuffer = await generatePDF(contract.content, `Contract - ${contract._id}`);

    // Update user usage
    user.incrementUsage('pdfDownloads', 1);
    await user.save();

    // Set response headers for PDF download
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="contract-${contract._id}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
};



const updateContract = async (req, res) => {
  try {
    const contract = await Contract.findOneAndUpdate(
      {
        _id: req.params.id,
        project: { $in: await Project.find({ user: req.user.id }).distinct('_id') }
      },
      req.body,
      { new: true }
    );

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    res.json(contract);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  generateContract,
  getContract,
  updateContract,
  downloadContractPDF
};
