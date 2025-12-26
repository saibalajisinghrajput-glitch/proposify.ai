const OfferLetter = require('../models/OfferLetter');
const User = require('../models/User');
const { generateOfferLetterContent, getStatus } = require('../utils/openai');

const generateOfferLetter = async (req, res) => {
  try {
    const {
      candidateName,
      position,
      employmentType,
      companyName,
      startDate,
      stipend,
      duration,
      country,
      hrContactDetails
    } = req.body;

    // Basic validation
    if (!candidateName || !position || !employmentType || !companyName || 
        !startDate || !stipend || !country) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['candidateName', 'position', 'employmentType', 'companyName', 'startDate', 'stipend', 'country']
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user can generate offer letter
    if (!user.canGenerateOfferLetter()) {
      return res.status(403).json({
        message: 'Offer letter generation limit reached for this month',
        usage: user.usage.offerLettersGenerated,
        limit: user.planLimits.offerLettersPerMonth,
        upgradeRequired: true
      });
    }

    // Estimate AI tokens needed
    const estimatedTokens = 1000;

    if (!user.canUseAI(estimatedTokens)) {
      return res.status(403).json({
        message: 'AI token limit reached for this month',
        usage: user.usage.aiTokensUsed,
        limit: user.planLimits.aiTokensPerMonth,
        upgradeRequired: true
      });
    }

    console.log('🚀 Starting offer letter generation for:', candidateName);

    // Generate offer letter content
    const content = await generateOfferLetterContent({
      candidateName,
      position,
      employmentType,
      companyName,
      startDate,
      stipend,
      duration,
      country,
      hrContactDetails
    });

    const offerLetter = new OfferLetter({
      user: req.user.id,
      candidateName,
      position,
      employmentType,
      companyName,
      startDate,
      stipend,
      duration,
      country,
      hrContactDetails,
      content,
      isGenerated: true
    });

    await offerLetter.save();

    // Update user usage
    user.incrementUsage('offerLettersGenerated', 1);
    user.incrementUsage('aiTokensUsed', estimatedTokens);
    await user.save();

    // Log OpenAI status for debugging
    const status = getStatus();
    console.log('📊 OpenAI Status:', status);

    res.status(201).json({
      offerLetter,
      openaiStatus: status,
      message: 'Offer letter generated successfully',
      usage: {
        offerLettersGenerated: user.usage.offerLettersGenerated,
        aiTokensUsed: user.usage.aiTokensUsed,
        remaining: {
          offerLetters: user.planLimits.offerLettersPerMonth - user.usage.offerLettersGenerated,
          tokens: user.planLimits.aiTokensPerMonth - user.usage.aiTokensUsed
        }
      }
    });
  } catch (error) {
    console.error('❌ Error generating offer letter:', error);
    res.status(500).json({
      message: 'Failed to generate offer letter',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};

const getOfferLetter = async (req, res) => {
  try {
    const offerLetter = await OfferLetter.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!offerLetter) {
      return res.status(404).json({ message: 'Offer letter not found' });
    }

    res.json(offerLetter);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserOfferLetters = async (req, res) => {
  try {
    const offerLetters = await OfferLetter.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ offerLetters });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateOfferLetter = async (req, res) => {
  try {
    const offerLetter = await OfferLetter.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      req.body,
      { new: true }
    );

    if (!offerLetter) {
      return res.status(404).json({ message: 'Offer letter not found' });
    }

    res.json(offerLetter);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


const deleteOfferLetter = async (req, res) => {
  try {
    const offerLetter = await OfferLetter.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!offerLetter) {
      return res.status(404).json({ message: 'Offer letter not found' });
    }

    res.json({ message: 'Offer letter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const generateOfferLetterPDF = async (req, res) => {
  try {
    const offerLetter = await OfferLetter.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!offerLetter) {
      return res.status(404).json({ message: 'Offer letter not found' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has paid subscription for PDF downloads
    if (user.subscription !== 'paid') {
      return res.status(403).json({
        message: 'PDF download is only available for paid subscribers',
        upgradeRequired: true
      });
    }

    // Generate PDF content
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Offer Letter - ${offerLetter.candidateName}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .company-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .date { font-size: 14px; color: #666; margin-bottom: 20px; }
          .recipient { margin-bottom: 20px; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 18px; font-weight: bold; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px; }
          .content { line-height: 1.8; }
          pre { white-space: pre-wrap; font-family: inherit; }
          .signature-section { margin-top: 50px; padding-top: 30px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">${offerLetter.companyName.toUpperCase()}</div>
          <div class="date">Date: ${new Date().toLocaleDateString()}</div>
        </div>
        
        <div class="recipient">
          <strong>To:</strong> ${offerLetter.candidateName}<br>
          <strong>From:</strong> ${offerLetter.companyName}
        </div>

        <div class="content">
          ${offerLetter.content.replace(/\n/g, '<br>')}
        </div>

        <div class="signature-section">
          <p><strong>ACCEPTANCE:</strong></p>
          <p>I, ${offerLetter.candidateName}, hereby accept the terms and conditions of employment as outlined in this offer letter.</p>
          <br><br>
          <p><strong>Signature:</strong> ___________________________ &nbsp;&nbsp;&nbsp; <strong>Date:</strong> _______________</p>
          <p><strong>Name:</strong> ${offerLetter.candidateName}</p>
        </div>

        <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #999;">
          Generated by ProposifyAI on ${new Date().toLocaleDateString()}
        </div>
      </body>
      </html>
    `;

    // Update offer letter with PDF info
    offerLetter.pdfGenerated = true;
    offerLetter.pdfUrl = `/api/offer-letters/${offerLetter._id}/pdf`;
    await offerLetter.save();

    res.json({
      offerLetter,
      pdfContent,
      message: 'PDF generated successfully'
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
};

const downloadOfferLetterPDF = async (req, res) => {
  try {
    const offerLetter = await OfferLetter.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!offerLetter) {
      return res.status(404).json({ message: 'Offer letter not found' });
    }

    const user = await User.findById(req.user.id);
    if (!user || user.subscription !== 'paid') {
      return res.status(403).json({
        message: 'PDF download is only available for paid subscribers',
        upgradeRequired: true
      });
    }

    // Generate PDF content
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Offer Letter - ${offerLetter.candidateName}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .company-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .date { font-size: 14px; color: #666; margin-bottom: 20px; }
          .recipient { margin-bottom: 20px; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 18px; font-weight: bold; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px; }
          .content { line-height: 1.8; }
          pre { white-space: pre-wrap; font-family: inherit; }
          .signature-section { margin-top: 50px; padding-top: 30px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">${offerLetter.companyName.toUpperCase()}</div>
          <div class="date">Date: ${new Date().toLocaleDateString()}</div>
        </div>
        
        <div class="recipient">
          <strong>To:</strong> ${offerLetter.candidateName}<br>
          <strong>From:</strong> ${offerLetter.companyName}
        </div>

        <div class="content">
          ${offerLetter.content.replace(/\n/g, '<br>')}
        </div>

        <div class="signature-section">
          <p><strong>ACCEPTANCE:</strong></p>
          <p>I, ${offerLetter.candidateName}, hereby accept the terms and conditions of employment as outlined in this offer letter.</p>
          <br><br>
          <p><strong>Signature:</strong> ___________________________ &nbsp;&nbsp;&nbsp; <strong>Date:</strong> _______________</p>
          <p><strong>Name:</strong> ${offerLetter.candidateName}</p>
        </div>

        <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #999;">
          Generated by ProposifyAI on ${new Date().toLocaleDateString()}
        </div>
      </body>
      </html>
    `;

    // Set headers for PDF download
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="offer-letter-${offerLetter.candidateName.replace(/\s+/g, '-')}.html"`);
    res.send(pdfContent);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    res.status(500).json({ message: 'Failed to download PDF' });
  }
};

module.exports = {
  generateOfferLetter,
  getOfferLetter,
  getUserOfferLetters,
  updateOfferLetter,
  deleteOfferLetter,
  generateOfferLetterPDF,
  downloadOfferLetterPDF
};
