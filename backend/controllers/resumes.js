const Resume = require('../models/Resume');
const User = require('../models/User');
const { generateResumeContent, getStatus } = require('../utils/openai');

const generateResume = async (req, res) => {
  try {
    const {
      candidateName,
      phoneNumber,
      email,
      education,
      skills,
      experienceLevel,
      jobRole,
      country,
      resumeType
    } = req.body;

    // Basic validation
    if (!candidateName || !phoneNumber || !email || !education || !skills || 
        !experienceLevel || !jobRole || !country || !resumeType) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['candidateName', 'phoneNumber', 'email', 'education', 'skills', 'experienceLevel', 'jobRole', 'country', 'resumeType']
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user can generate resume
    if (!user.canGenerateResume()) {
      return res.status(403).json({
        message: 'Resume generation limit reached for this month',
        usage: user.usage.resumesGenerated,
        limit: user.planLimits.resumesPerMonth,
        upgradeRequired: true
      });
    }

    // Estimate AI tokens needed
    const estimatedTokens = 800;

    if (!user.canUseAI(estimatedTokens)) {
      return res.status(403).json({
        message: 'AI token limit reached for this month',
        usage: user.usage.aiTokensUsed,
        limit: user.planLimits.aiTokensPerMonth,
        upgradeRequired: true
      });
    }

    console.log('🚀 Starting resume generation for:', candidateName);


    // Generate resume content (skills should be a string for AI generation)
    const content = await generateResumeContent({
      candidateName,
      phoneNumber,
      email,
      education,
      skills: typeof skills === 'string' ? skills : skills.join(', '),
      experienceLevel,
      jobRole,
      country,
      resumeType
    });

    const resume = new Resume({
      user: req.user.id,
      candidateName,
      phoneNumber,
      email,
      education,
      skills,
      experienceLevel,
      jobRole,
      country,
      resumeType,
      content,
      isGenerated: true
    });

    await resume.save();

    // Update user usage
    user.incrementUsage('resumesGenerated', 1);
    user.incrementUsage('aiTokensUsed', estimatedTokens);
    await user.save();

    // Log OpenAI status for debugging
    const status = getStatus();
    console.log('📊 OpenAI Status:', status);

    res.status(201).json({
      resume,
      openaiStatus: status,
      message: 'Resume generated successfully',
      usage: {
        resumesGenerated: user.usage.resumesGenerated,
        aiTokensUsed: user.usage.aiTokensUsed,
        remaining: {
          resumes: user.planLimits.resumesPerMonth - user.usage.resumesGenerated,
          tokens: user.planLimits.aiTokensPerMonth - user.usage.aiTokensUsed
        }
      }
    });
  } catch (error) {
    console.error('❌ Error generating resume:', error);
    res.status(500).json({
      message: 'Failed to generate resume',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};

const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ resumes });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      req.body,
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const generateResumePDF = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
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

    // Generate PDF content (simplified version)
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Resume - ${resume.candidateName}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .name { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          .contact { font-size: 14px; color: #666; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 18px; font-weight: bold; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px; }
          .content { line-height: 1.6; }
          pre { white-space: pre-wrap; font-family: inherit; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="name">${resume.candidateName.toUpperCase()}</div>
          <div class="contact">
            📧 ${resume.email} | 📱 ${resume.phoneNumber} | 📍 ${resume.country}
          </div>
        </div>
        <div class="content">
          ${resume.content.replace(/\n/g, '<br>')}
        </div>
        <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #999;">
          Generated by ProposifyAI on ${new Date().toLocaleDateString()}
        </div>
      </body>
      </html>
    `;

    // Update resume with PDF info
    resume.pdfGenerated = true;
    resume.pdfUrl = `/api/resumes/${resume._id}/pdf`;
    await resume.save();

    res.json({
      resume,
      pdfContent,
      message: 'PDF generated successfully'
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
};

const downloadResumePDF = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
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
        <title>Resume - ${resume.candidateName}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .name { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          .contact { font-size: 14px; color: #666; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 18px; font-weight: bold; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px; }
          .content { line-height: 1.6; }
          pre { white-space: pre-wrap; font-family: inherit; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="name">${resume.candidateName.toUpperCase()}</div>
          <div class="contact">
            📧 ${resume.email} | 📱 ${resume.phoneNumber} | 📍 ${resume.country}
          </div>
        </div>
        <div class="content">
          ${resume.content.replace(/\n/g, '<br>')}
        </div>
        <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #999;">
          Generated by ProposifyAI on ${new Date().toLocaleDateString()}
        </div>
      </body>
      </html>
    `;

    // Set headers for PDF download
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="resume-${resume.candidateName.replace(/\s+/g, '-')}.html"`);
    res.send(pdfContent);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    res.status(500).json({ message: 'Failed to download PDF' });
  }
};

module.exports = {
  generateResume,
  getResume,
  getUserResumes,
  updateResume,
  deleteResume,
  generateResumePDF,
  downloadResumePDF
};
