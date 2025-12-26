const OpenAI = require('openai');

// Configuration and validation
const config = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
  OPENAI_TIMEOUT: parseInt(process.env.OPENAI_TIMEOUT) || 30000, // 30 seconds
  OPENAI_MAX_RETRIES: parseInt(process.env.OPENAI_MAX_RETRIES) || 3,

  OPENAI_MAX_TOKENS: {
    proposal: parseInt(process.env.OPENAI_MAX_TOKENS_PROPOSAL) || 1500,
    contract: parseInt(process.env.OPENAI_MAX_TOKENS_CONTRACT) || 2000,
    resume: parseInt(process.env.OPENAI_MAX_TOKENS_RESUME) || 1200,
    offerLetter: parseInt(process.env.OPENAI_MAX_TOKENS_OFFER_LETTER) || 1500
  }
};

// Initialize OpenAI client with error handling
let openai = null;
let isOpenAIConfigured = false;

try {
  const apiKey = config.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️  OpenAI API key not found in environment variables');
  } else if (apiKey.startsWith('sk-') && apiKey.length > 40) {
    openai = new OpenAI({ apiKey });
    isOpenAIConfigured = true;
    console.log('✅ OpenAI client initialized successfully');
  } else {
    console.warn('⚠️  OpenAI API key format appears invalid');
  }
} catch (error) {
  console.error('❌ Failed to initialize OpenAI client:', error.message);
}


// Fallback content generators for natural, professional appearance
const generateFallbackProposal = (project) => {
  const clientInfo = project.clientName ? `for ${project.clientName}` : 'for our valued client';
  const contactInfo = project.clientPhone ? `\nClient Contact: ${project.clientPhone}` : '';
  const emailInfo = project.clientEmail ? `\nClient Email: ${project.clientEmail}` : '';
  const industry = project.clientIndustry === 'Other' && project.customIndustry ? project.customIndustry : project.clientIndustry;
  const service = project.serviceType === 'Other' && project.customService ? project.customService : project.serviceType;
  const currencySymbol = project.currency === 'USD' ? '$' : '₹';
  const budgetDisplay = `${project.budget}`;

  return `
# PROFESSIONAL SERVICES PROPOSAL ${clientInfo}

## Executive Summary

Thank you for the opportunity to present this proposal${clientInfo} for your ${service} initiative. Based on our understanding of your ${industry} business needs and the challenges facing organizations in ${project.country}, we have developed a comprehensive approach designed to deliver measurable value to your operation.

## Client Information${contactInfo}${emailInfo}

## Understanding Your Business Environment

The ${industry} sector in ${project.country} presents unique opportunities for growth and innovation. Organizations like yours are navigating increased competition while striving to maintain operational efficiency and deliver exceptional results to stakeholders.

Our team brings extensive experience working with ${industry} companies, giving us valuable insights into the specific requirements and regulatory considerations that impact projects in this sector.

## Our Proposed Solution

We propose a structured approach to your ${service} project that addresses your immediate needs while positioning your organization for long-term success.

**Phase 1: Discovery and Analysis**
- Comprehensive assessment of current processes and requirements
- Stakeholder interviews and workflow analysis
- Risk identification and mitigation planning

**Phase 2: Strategic Planning**
- Development of customized strategy aligned with your business objectives
- Resource allocation and timeline optimization
- Communication and change management protocols

**Phase 3: Implementation and Delivery**
- Phased rollout with regular checkpoints and progress reviews
- Quality assurance processes to ensure standards are met
- Documentation and knowledge transfer

**Phase 4: Review and Optimization**
- Performance evaluation against established metrics
- Continuous improvement recommendations
- Long-term sustainability planning

## Scope of Deliverables

Your investment of ${budgetDisplay} over ${project.timeline} includes:

✓ Strategic consultation and expert guidance
✓ Custom solution development and implementation
✓ Regular progress reporting and communication
✓ Quality assurance and testing protocols
✓ Documentation and training materials
✓ 30-day post-delivery support and optimization

## Timeline and Milestones

Our proposed timeline of ${project.timeline} is structured to deliver early wins while building toward your long-term objectives. Key milestones include:

- **Week 1-2**: Project kickoff and discovery phase
- **Week 3-4**: Strategy development and approval
- **Week 5-X**: Implementation and testing phases
- **Final Phase**: Delivery, documentation, and knowledge transfer

## Investment and Value Proposition

The investment of ${budgetDisplay} represents exceptional value considering:

- Direct access to industry expertise in ${industry}
- Proven methodology developed through similar projects
- Risk mitigation through structured approach
- Long-term partnership focused on your success
- Comprehensive support and ongoing optimization

## Why Choose Our Team

Our team brings specialized expertise in ${service} with particular strength in the ${industry} sector. We understand the unique challenges facing organizations in ${project.country} and have successfully delivered similar projects for companies facing comparable opportunities and constraints.

## Next Steps

We are excited about the potential to support your ${service} initiative and would welcome the opportunity to discuss this proposal in detail.

**Proposed Next Steps:**
1. Proposal review and feedback session
2. Contract negotiation and finalization
3. Project kickoff and team introduction
4. Discovery phase commencement

This proposal remains valid for 30 days from the date of submission. We look forward to the opportunity to contribute to your organization's continued success.

---

**Contact Information:**
[Your Company Name]
[Your Contact Information]
[Your Email and Phone]

*Prepared on ${new Date().toLocaleDateString()}*
`;
};



const generateFallbackContract = (project) => {
  const industry = project.clientIndustry === 'Other' && project.customIndustry ? project.customIndustry : project.clientIndustry;
  const service = project.serviceType === 'Other' && project.customService ? project.customService : project.serviceType;
  const currencySymbol = project.currency === 'USD' ? '$' : '₹';
  const budgetDisplay = `${project.budget}`;
  const clientCompany = project.clientCompany || project.clientName || 'Client';

  return `
# PROFESSIONAL SERVICES AGREEMENT

This Professional Services Agreement ("Agreement") is entered into between ProposifyAI ("Provider") and ${clientCompany} ("Client") on ${new Date().toLocaleDateString()}.

## ARTICLE 1: PARTIES AND DEFINITIONS

**Provider:** ProposifyAI, a professional services firm specializing in ${service}
**Client:** ${clientCompany}, operating within the ${industry} industry in ${project.country}
${project.clientPhone ? `**Client Contact:** ${project.clientPhone}` : ''}
${project.clientEmail ? `**Client Email:** ${project.clientEmail}` : ''}

This Agreement governs the provision of professional services related to the ${service} project, as described in detail below.

## ARTICLE 2: PROJECT SCOPE AND SERVICES

**Project Overview:**
The Provider agrees to deliver comprehensive ${service} services to support the Client's business objectives within the ${industry} sector.

**Services to be Provided:**
1. **Strategic Planning and Consultation**
   - Business requirements analysis and documentation
   - Strategic framework development
   - Implementation roadmap creation

2. **Professional Implementation Services**
   - Execution of agreed-upon deliverables
   - Quality assurance and testing protocols
   - Performance monitoring and optimization

3. **Communication and Reporting**
   - Regular progress updates and milestone reviews
   - Risk assessment and mitigation planning
   - Stakeholder communication management

4. **Knowledge Transfer and Support**
   - Documentation and training materials
   - Post-implementation support (30 days)
   - Ongoing consultation availability

**Project Timeline:** ${project.timeline}
**Total Project Value:** ${budgetDisplay}

## ARTICLE 3: FINANCIAL TERMS

**Compensation:**
Client agrees to pay Provider a total fee of ${budgetDisplay} for the services described in this Agreement.

**Payment Schedule:**
- 30% deposit upon contract execution
- 40% upon completion of Phase 2 (mid-project milestone)
- 30% upon final delivery and acceptance

**Payment Terms:**
All invoices are due within thirty (30) days of receipt. Late payments may incur a 1.5% monthly service charge.

## ARTICLE 4: INTELLECTUAL PROPERTY

**Work Product Ownership:**
Upon receipt of full payment, all custom work products, deliverables, and intellectual property created specifically for this project shall become the exclusive property of the Client.

**Pre-existing Materials:**
Any pre-existing intellectual property, methodologies, or materials owned by either party prior to this Agreement shall remain the property of that party.

## ARTICLE 5: CONFIDENTIALITY

Both parties acknowledge that they may have access to confidential business information during the course of this engagement. Each party agrees to:
- Maintain strict confidentiality of all proprietary information
- Use such information solely for purposes related to this project
- Not disclose confidential information to third parties without written consent

## ARTICLE 6: PERFORMANCE STANDARDS

**Quality Expectations:**
Provider will deliver services in a professional manner consistent with industry standards for ${industry} organizations in ${project.country}.

**Acceptance Criteria:**
Deliverables will be considered accepted upon completion of agreed-upon specifications and successful testing against predefined acceptance criteria.

## ARTICLE 7: TERM AND TERMINATION

**Project Duration:**
This Agreement shall remain in effect for the duration of the project, anticipated to be ${project.timeline}, unless terminated earlier in accordance with this Article.

**Termination Rights:**
Either party may terminate this Agreement with thirty (30) days written notice. Upon termination:
- Client shall pay for all services rendered up to the termination date
- Provider shall deliver all completed work products
- Confidentiality obligations shall survive termination

## ARTICLE 8: LIABILITY AND RISK MANAGEMENT

**Limitation of Liability:**
Provider's total liability under this Agreement shall not exceed the total fees paid by Client under this Agreement.

**Mutual Indemnification:**
Each party agrees to indemnify the other against third-party claims arising from their respective negligence or breach of this Agreement.

## ARTICLE 9: DISPUTE RESOLUTION

**Governing Law:**
This Agreement shall be governed by the laws of ${project.country}.

**Dispute Process:**
In the event of a dispute, the parties agree to:
1. First attempt resolution through good faith negotiation
2. If negotiation fails, pursue mediation before litigation
3. Use ${project.country} courts for any legal proceedings if necessary

## ARTICLE 10: GENERAL PROVISIONS

**Entire Agreement:**
This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements relating to the subject matter.

**Amendments:**
This Agreement may only be amended through written agreement signed by both parties.

**Severability:**
If any provision of this Agreement is found unenforceable, the remainder of the Agreement shall remain in full force and effect.

## ARTICLE 11: EXECUTION

By their signatures below, the parties acknowledge they have read, understood, and agree to be bound by the terms of this Agreement.

**PROVIDER:**
ProposifyAI

Signature: _________________________  Date: _________
Name: ProposifyAI Team
Title: Service Provider

**CLIENT:**
${clientCompany}

Signature: _________________________  Date: _________
Name: ${project.clientName || 'Client Contact'}
Title: Client Representative

---

**Contract Effective Date:** ${new Date().toLocaleDateString()}
**Document Reference:** PSA-${Date.now()}

*This document constitutes a legally binding agreement upon execution by both parties.*
`;

};



// Fallback Resume Generator
const generateFallbackResume = (resumeData) => {
  const { candidateName, phoneNumber, email, education, skills, experienceLevel, jobRole, country, resumeType } = resumeData;
  const skillsArray = Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(skill => skill.trim()) : ["JavaScript", "React", "Node.js"]);
  const formattedSkills = skillsArray.map(skill => `• ${skill}`).join('\n');

  return `
# ${candidateName.toUpperCase()}

**Contact Information:**
📧 Email: ${email}
📱 Phone: ${phoneNumber}
📍 Location: ${country}

---

## PROFESSIONAL SUMMARY

${experienceLevel === 'Fresher' 
  ? `Recent ${education} graduate with a passion for ${jobRole} and a strong foundation in ${skillsArray.slice(0, 3).join(', ')}. Eager to contribute fresh perspectives and learn from experienced professionals in a dynamic work environment.`
  : `Experienced ${jobRole} professional with a proven track record in ${skillsArray.slice(0, 3).join(', ')}. Skilled at delivering results-driven solutions and collaborating effectively with cross-functional teams.`
}

---

## EDUCATION

**${education}**
- Relevant coursework in key areas
- Strong academic performance
- [Graduation Year/Expected]

---

## TECHNICAL SKILLS

${formattedSkills}

---

## KEY STRENGTHS

${experienceLevel === 'Fresher' ? `
• Strong foundational knowledge in core technologies
• Quick learner with adaptability to new technologies
• Excellent problem-solving abilities
• Passionate about continuous learning and growth
• Strong communication and collaboration skills` : `
• ${experienceLevel} years of hands-on experience
• Proven track record of successful project delivery
• Strong leadership and mentoring abilities
• Expertise in modern development practices
• Excellent communication and stakeholder management skills`}

---

## ${experienceLevel === 'Fresher' ? 'PROJECTS & EXPERIENCE' : 'PROFESSIONAL EXPERIENCE'}

${experienceLevel === 'Fresher' ? `
**Academic Projects**
• [Project Name] - [Brief description of project and technologies used]
• [Project Name] - [Brief description of project and technologies used]
• [Project Name] - [Brief description of project and technologies used]

**Internship/Training**
• [Company Name] - [Role] - [Duration]
• [Key responsibilities and achievements]

**Leadership & Activities**
• [Student organization or volunteer work]
• [Any leadership roles or significant contributions]` : `
**[Previous Company Name]** | ${jobRole} | [Duration]
• Led development of [specific project/feature] resulting in [quantifiable impact]
• Collaborated with cross-functional teams to deliver [specific outcome]
• Implemented [technology/process] improvements that increased efficiency by [percentage]
• Mentored junior team members and contributed to knowledge sharing

**[Previous Company Name]** | [Position] | [Duration]
• Successfully managed [project type] from inception to completion
• Developed and maintained [technology/systems] for [business unit]
• Achieved [specific metric] improvement in [KPI] within [timeframe]`}

---

## ADDITIONAL INFORMATION

• ${resumeType} Resume for ${jobRole} positions
• Based in ${country}
• Available for immediate joining
• Strong verbal and written communication skills

---

*Resume prepared by ProposifyAI - Professional Resume Generator*
*Generated on ${new Date().toLocaleDateString()}*
`;
};


// Fallback Offer Letter Generator
const generateFallbackOfferLetter = (offerData) => {
  const { candidateName, position, employmentType, companyName, startDate, stipend, duration, country, hrContactDetails } = offerData;
  const formattedStipend = `₹${stipend.toLocaleString('en-IN')}`;
  const formattedStartDate = new Date(startDate).toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `
# OFFER LETTER

**Date:** ${new Date().toLocaleDateString('en-IN')}

**To:** ${candidateName}

**From:** ${companyName}

---

## EMPLOYMENT OFFER

Dear ${candidateName},

We are pleased to extend this offer of ${employmentType.toLowerCase()} employment for the position of **${position}** at ${companyName}. After careful consideration of your background, skills, and interview performance, we believe you would be a valuable addition to our team.

---

## POSITION DETAILS

**Position Title:** ${position}
**Employment Type:** ${employmentType}
**Department:** [Department Name]
**Reporting Manager:** [Manager Name]
**Work Location:** ${country}

${employmentType === 'Internship' ? `**Internship Duration:** ${duration || '[Duration to be specified]'}` : ''}

---

## COMPENSATION & BENEFITS

${employmentType === 'Internship' ? `
**Stipend:** ${formattedStipend} per month
**Payment Terms:** Monthly payment on the last working day of each month
` : `
**Annual Salary:** ${formattedStipend}
**Payment Terms:** Monthly salary credit on the last working day of each month
`}

**Additional Benefits:**
• Professional development opportunities
• Flexible working arrangements (where applicable)
• Health and wellness programs
• Performance-based increments

---

## TERMS OF EMPLOYMENT

**Start Date:** ${formattedStartDate}

**Working Hours:** [Standard office hours or shift details]
**Probation Period:** [90 days/6 months as applicable]
**Notice Period:** [Standard notice period requirements]

${employmentType === 'Internship' ? `
**Learning Objectives:**
• Gain hands-on experience in ${position} role
• Work on real-world projects and assignments
• Receive mentorship from experienced professionals
• Develop professional skills and industry knowledge

**Internship Commitment:**
• Full-time commitment for the duration specified
• Adherence to company policies and guidelines
• Maintain confidentiality of company information
• Participate actively in learning and development activities
` : `
**Key Responsibilities:**
• Lead and execute ${position} responsibilities as outlined in the job description
• Collaborate effectively with cross-functional teams
• Meet performance targets and objectives
• Maintain high standards of professionalism and ethics

**Performance Expectations:**
• Achieve quarterly and annual performance goals
• Participate in regular performance reviews
• Contribute to team success and company objectives
• Continuously develop skills and expertise
`}

---

## COMPANY POLICIES

By accepting this offer, you agree to:

• Maintain strict confidentiality of company information
• Comply with all company policies and procedures
• Respect intellectual property rights
• Uphold professional conduct and ethics standards
• Adhere to data protection and security guidelines

---

## ACCEPTANCE

This offer is contingent upon:
• Successful completion of background verification
• Presentation of required documents (educational certificates, ID proof, etc.)
• Medical fitness certificate (if required)

Please confirm your acceptance of this offer by signing and returning this letter by [Date - typically within 7 days of offer date].

If you have any questions or require clarification on any aspect of this offer, please feel free to contact us at ${hrContactDetails || '[HR Contact Information]'}.

---

We look forward to welcoming you to the ${companyName} team and wish you success in your ${employmentType.toLowerCase()} journey.

**Sincerely,**

**${companyName}**

---

**ACCEPTANCE:**

I, ${candidateName}, hereby accept the terms and conditions of employment as outlined in this offer letter.

**Signature:** ___________________________  **Date:** _______________

**Name:** ${candidateName}

---

*This offer letter is confidential and intended solely for the named candidate.*
*Document Reference: OL-${Date.now()}*
`;
};





const createResumePrompt = (resumeData) => {
  const { candidateName, phoneNumber, email, education, skills, experienceLevel, jobRole, country, resumeType } = resumeData;
  const skillsArray = Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(skill => skill.trim()) : ["JavaScript", "React", "Node.js"]);


  return `
You are a professional resume writer with 15+ years of experience creating ATS-friendly resumes for global job markets.

Generate a professional resume using the following details:

Candidate Name: ${candidateName}
Phone Number: ${phoneNumber}
Email: ${email}
Education: ${education}
Skills: ${skills}
Experience Level: ${experienceLevel}
Job Role: ${jobRole}
Country: ${country}
Resume Type: ${resumeType}

INSTRUCTIONS:
- Write in clear, natural, human-like language
- Avoid AI buzzwords like "leveraged", "synergy", "dynamic professional"
- Make the resume ATS-friendly
- Use bullet points where appropriate
- Keep content concise, professional, and realistic
- Match tone to the experience level
- Use industry-appropriate terminology
- Do NOT mention that this was generated by AI

STRUCTURE:
1. Header (Name, Phone, Email)
2. Professional Summary (3–4 lines)
3. Skills Section
4. Experience Section (or Internship / Academic Projects if Fresher)
5. Education Section
6. Additional Information (optional, if relevant)

The final output must look like a real resume written by a professional resume writer.
This should be different for everyone according to details given.
`;
};


const createOfferLetterPrompt = (offerData) => {
  const { candidateName, position, employmentType, companyName, startDate, stipend, duration, country, hrContactDetails } = offerData;
  const formattedStipend = `₹${stipend.toLocaleString('en-IN')}`;

  return `
You are an HR professional and legal documentation expert.

Generate a formal and professional offer letter using the following details:

Candidate Name: ${candidateName}
Position: ${position}
Employment Type: ${employmentType} (Internship / Full-time)
Company Name: ${companyName}
Start Date: ${startDate}
Salary or Stipend (INR): ${stipend}
Duration (if intern): ${duration}
Country: ${country}
HR Contact Details: ${hrContactDetails}

INSTRUCTIONS:
- Use formal HR and business language
- Follow standard corporate offer letter structure
- Ensure the tone is professional, clear, and welcoming
- Include legal clauses but keep them readable
- Avoid AI-style phrases
- Do NOT mention AI or automation
- Make it suitable for real company use

STRUCTURE:
1. Company Header
2. Greeting to Candidate
3. Position & Employment Type
4. Compensation Details
5. Start Date & Duration (if applicable)
6. Terms & Conditions
7. Confidentiality Clause
8. Acceptance Instructions
9. Signature Section (HR & Candidate)

The final letter must look like a genuine corporate offer letter suitable for official use.
`;
};

const generateResumeContent = async (resumeData) => {
  try {
    // Validate input data
    if (!resumeData.candidateName || !resumeData.phoneNumber || !resumeData.email || 
        !resumeData.education || !resumeData.skills || !resumeData.experienceLevel || 
        !resumeData.jobRole || !resumeData.country || !resumeData.resumeType) {
      throw new Error('Missing required resume data fields');
    }
    
    // Use fallback if OpenAI is not configured
    if (!isOpenAIConfigured) {
      console.log('📄 Using fallback resume generator (OpenAI not configured)');
      return generateFallbackResume(resumeData);
    }

    const prompt = createResumePrompt(resumeData);
    let lastError = null;

    // Retry logic with exponential backoff
    for (let attempt = 1; attempt <= config.OPENAI_MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.OPENAI_TIMEOUT);

        const response = await openai.chat.completions.create({
          model: config.OPENAI_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are a professional resume writer and career consultant. Create compelling, ATS-friendly resumes that showcase candidates effectively.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: config.OPENAI_MAX_TOKENS.resume,
          temperature: 0.7,
          timeout: config.OPENAI_TIMEOUT
        }, { signal: controller.signal });

        clearTimeout(timeoutId);

        if (response.choices && response.choices[0] && response.choices[0].message) {
          console.log(`✅ Resume generated successfully (attempt ${attempt})`);
          return response.choices[0].message.content.trim();
        }
        
        throw new Error('Invalid response format from OpenAI');
      } catch (error) {
        lastError = error;
        
        // Log error details for debugging
        if (error.name === 'AbortError') {
          console.warn(`⚠️  OpenAI request timed out (attempt ${attempt}/${config.OPENAI_MAX_RETRIES})`);
        } else if (error.status === 429) {
          console.warn(`⚠️  OpenAI rate limit hit (attempt ${attempt}/${config.OPENAI_MAX_RETRIES})`);
          // Exponential backoff for rate limits
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        } else {
          console.error(`❌ OpenAI API error (attempt ${attempt}):`, error.message);
        }
        
        if (attempt === config.OPENAI_MAX_RETRIES) break;
      }
    }

    // If all retries failed, use fallback
    console.warn('🔄 All OpenAI attempts failed, using fallback resume generator');
    return generateFallbackResume(resumeData);
    
  } catch (error) {
    console.error('❌ Error in generateResumeContent:', error.message);
    return generateFallbackResume(resumeData);
  }
};

const generateOfferLetterContent = async (offerData) => {
  try {
    // Validate input data
    if (!offerData.candidateName || !offerData.position || !offerData.employmentType || 
        !offerData.companyName || !offerData.startDate || !offerData.stipend || !offerData.country) {
      throw new Error('Missing required offer letter data fields');
    }
    
    // Use fallback if OpenAI is not configured
    if (!isOpenAIConfigured) {
      console.log('📄 Using fallback offer letter generator (OpenAI not configured)');
      return generateFallbackOfferLetter(offerData);
    }

    const prompt = createOfferLetterPrompt(offerData);
    let lastError = null;

    // Retry logic with exponential backoff
    for (let attempt = 1; attempt <= config.OPENAI_MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.OPENAI_TIMEOUT);

        const response = await openai.chat.completions.create({
          model: config.OPENAI_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are an HR professional and legal expert specializing in employment contracts and offer letters. Create comprehensive, legally sound offer letters.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: config.OPENAI_MAX_TOKENS.offerLetter,
          temperature: 0.6,
          timeout: config.OPENAI_TIMEOUT
        }, { signal: controller.signal });

        clearTimeout(timeoutId);

        if (response.choices && response.choices[0] && response.choices[0].message) {
          console.log(`✅ Offer letter generated successfully (attempt ${attempt})`);
          return response.choices[0].message.content.trim();
        }
        
        throw new Error('Invalid response format from OpenAI');
      } catch (error) {
        lastError = error;
        
        // Log error details for debugging
        if (error.name === 'AbortError') {
          console.warn(`⚠️  OpenAI request timed out (attempt ${attempt}/${config.OPENAI_MAX_RETRIES})`);
        } else if (error.status === 429) {
          console.warn(`⚠️  OpenAI rate limit hit (attempt ${attempt}/${config.OPENAI_MAX_RETRIES})`);
          // Exponential backoff for rate limits
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        } else {
          console.error(`❌ OpenAI API error (attempt ${attempt}):`, error.message);
        }
        
        if (attempt === config.OPENAI_MAX_RETRIES) break;
      }
    }

    // If all retries failed, use fallback
    console.warn('🔄 All OpenAI attempts failed, using fallback offer letter generator');
    return generateFallbackOfferLetter(offerData);
    
  } catch (error) {
    console.error('❌ Error in generateOfferLetterContent:', error.message);
    return generateFallbackOfferLetter(offerData);
  }
};

// Enhanced prompt engineering for natural, professional content
const createProposalPrompt = (project) => {
  const clientDetails = project.clientName ? `Client: ${project.clientName}` : 'Client: [Client Name]';
  const contactDetails = project.clientPhone ? `\nPhone: ${project.clientPhone}` : '';
  const emailDetails = project.clientEmail ? `\nEmail: ${project.clientEmail}` : '';
  const industry = project.clientIndustry === 'Other' && project.customIndustry ? project.customIndustry : project.clientIndustry;
  const service = project.serviceType === 'Other' && project.customService ? project.customService : project.serviceType;
  const currencySymbol = project.currency === 'USD' ? '$' : '₹';
  const budgetDisplay = `${project.budget}`;

  return `
Write a professional business proposal for a ${service} project in the ${industry} industry. 

**Client Information:**
${clientDetails}${contactDetails}${emailDetails}
Location: ${project.country}

**Project Details:**
- Service Type: ${service}
- Budget: ${budgetDisplay}
- Timeline: ${project.timeline}
- Industry: ${industry}

**Business Context:**
You are writing this proposal as an experienced business professional who understands the ${industry} industry. Write as if you have worked on similar projects before and understand the client's specific challenges and opportunities.

**Writing Style Requirements:**
- Use conversational, professional language that flows naturally
- Include specific industry insights and terminology relevant to ${industry}
- Reference real business scenarios and common challenges
- Avoid generic phrases - be specific and contextual
- Use varied sentence structures and professional vocabulary
- Include practical examples and realistic timelines
- Address potential concerns proactively
- Reference the client's specific location and business context

**Proposal Structure:**
1. **Opening Paragraph**: Acknowledge the client's specific situation and industry context
2. **Client Information Section**: Include contact details naturally
3. **Understanding**: Demonstrate knowledge of their business environment and challenges
4. **Proposed Solution**: Detailed approach tailored to their industry needs
5. **Scope & Deliverables**: Clear, specific outcomes they can expect
6. **Timeline & Milestones**: Realistic phases with practical milestones
7. **Investment & Value**: Justify the budget with clear ROI potential
8. **Why Choose Us**: Specific expertise relevant to their industry
9. **Next Steps**: Clear action items and timeline

**Tone**: Professional but approachable, confident without being pushy, knowledgeable about their industry

**Length**: 900-1300 words

Write this as a complete, standalone proposal that demonstrates deep understanding of their business needs and provides clear value.
`;
};



const createContractPrompt = (project) => {
  const clientDetails = project.clientName ? `Client: ${project.clientName}` : 'Client: [Client Name]';
  const clientCompany = project.clientCompany || project.clientName || 'Client';
  const contactDetails = project.clientPhone ? `\nPhone: ${project.clientPhone}` : '';
  const emailDetails = project.clientEmail ? `\nEmail: ${project.clientEmail}` : '';
  const industry = project.clientIndustry === 'Other' && project.customIndustry ? project.customIndustry : project.clientIndustry;
  const service = project.serviceType === 'Other' && project.customService ? project.customService : project.serviceType;
  const currencySymbol = project.currency === 'USD' ? '$' : '₹';
  const budgetDisplay = `${project.budget}`;

  return `
Draft a comprehensive service agreement for a ${service} project in the ${industry} industry.

**Parties Information:**
Provider: ProposifyAI
${clientDetails} (${clientCompany})${contactDetails}${emailDetails}
Location: ${project.country}

**Project Details:**
- Service Type: ${service}
- Project Value: ${budgetDisplay}
- Timeline: ${project.timeline}
- Industry: ${industry}

**Legal Context:**
Create this contract as an experienced legal professional who understands ${industry} regulations and standard business practices. The agreement should be fair, comprehensive, and protect both parties' interests.

**Writing Style Requirements:**
- Use clear, unambiguous legal language
- Include industry-standard clauses relevant to ${industry}
- Reference realistic business scenarios and potential issues
- Use varied sentence structures to avoid repetitive legalese
- Include practical examples where appropriate
- Address common concerns proactively
- Ensure clauses flow logically and build upon each other
- Reference client's specific details naturally throughout

**Contract Structure:**
1. **Parties & Definitions**: Clear identification with client contact details
2. **Project Scope**: Detailed description of services and deliverables
3. **Timeline & Milestones**: Realistic project phases and deadlines
4. **Payment Terms**: Clear financial obligations and schedules in INR
5. **Intellectual Property**: Ownership and usage rights
6. **Confidentiality**: Protection of sensitive business information
7. **Performance Standards**: Quality expectations and metrics
8. **Risk Management**: Liability limitations and indemnification
9. **Termination Clauses**: End-of-engagement procedures
10. **Dispute Resolution**: Conflict resolution mechanisms
11. **Governing Law**: Jurisdiction and applicable regulations
12. **General Terms**: Additional standard business provisions

**Legal Tone**: Professional, authoritative, protective of both parties, industry-aware

**Length**: 1200-1800 words

Write this as a complete, legally enforceable contract that demonstrates thorough understanding of business relationships and legal protections needed in the ${industry} sector.
`;
};

// Utility functions
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.replace(/[<>]/g, '').trim();
};

const validateProject = (project) => {
  if (!project || typeof project !== 'object') {
    throw new Error('Invalid project data provided');
  }
  
  const required = ['serviceType', 'clientIndustry', 'budget', 'timeline'];
  for (const field of required) {
    if (!project[field]) {
      // Check for custom fields if base fields are 'Other'
      if (field === 'serviceType' && project.serviceType === 'Other' && !project.customService) {
        throw new Error('Missing custom service specification');
      }
      if (field === 'clientIndustry' && project.clientIndustry === 'Other' && !project.customIndustry) {
        throw new Error('Missing custom industry specification');
      }
      if (!project[field] && project[field] !== 0) {
        throw new Error(`Missing required project field: ${field}`);
      }
    }
  }
  
  return true;
};


// Enhanced content generation with fallbacks and retry logic
const generateProposalContent = async (project) => {
  try {
    validateProject(project);
    
    // Temporarily disable OpenAI calls and use fallback for better reliability
    if (!isOpenAIConfigured) {
      console.log('📄 Using fallback proposal generator (OpenAI not configured)');
      return generateFallbackProposal(project);
    }

    // Quick fallback for rate-limited scenarios
    console.log('📄 Using fallback proposal generator (rate limit protection)');
    return generateFallbackProposal(project);

    const prompt = createProposalPrompt(project);
    let lastError = null;

    // Retry logic with exponential backoff
    for (let attempt = 1; attempt <= config.OPENAI_MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.OPENAI_TIMEOUT);

        const response = await openai.chat.completions.create({
          model: config.OPENAI_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are a professional business proposal writer. Create compelling, well-structured proposals that address client needs and drive business results.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: config.OPENAI_MAX_TOKENS.proposal,
          temperature: 0.7,
          timeout: config.OPENAI_TIMEOUT
        }, { signal: controller.signal });

        clearTimeout(timeoutId);

        if (response.choices && response.choices[0] && response.choices[0].message) {
          console.log(`✅ Proposal generated successfully (attempt ${attempt})`);
          return response.choices[0].message.content.trim();
        }
        
        throw new Error('Invalid response format from OpenAI');
      } catch (error) {
        lastError = error;
        
        // Log error details for debugging
        if (error.name === 'AbortError') {
          console.warn(`⚠️  OpenAI request timed out (attempt ${attempt}/${config.OPENAI_MAX_RETRIES})`);
        } else if (error.status === 429) {
          console.warn(`⚠️  OpenAI rate limit hit (attempt ${attempt}/${config.OPENAI_MAX_RETRIES})`);
          // Exponential backoff for rate limits
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        } else {
          console.error(`❌ OpenAI API error (attempt ${attempt}):`, error.message);
        }
        
        if (attempt === config.OPENAI_MAX_RETRIES) break;
      }
    }

    // If all retries failed, use fallback
    console.warn('🔄 All OpenAI attempts failed, using fallback proposal generator');
    return generateFallbackProposal(project);
    
  } catch (error) {
    console.error('❌ Error in generateProposalContent:', error.message);
    return generateFallbackProposal(project);
  }
};


const generateContractContent = async (project) => {
  try {
    validateProject(project);
    
    // Temporarily disable OpenAI calls and use fallback for better reliability
    if (!isOpenAIConfigured) {
      console.log('📄 Using fallback contract generator (OpenAI not configured)');
      return generateFallbackContract(project);
    }

    // Quick fallback for rate-limited scenarios
    console.log('📄 Using fallback contract generator (rate limit protection)');
    return generateFallbackContract(project);

    const prompt = createContractPrompt(project);
    let lastError = null;

    // Retry logic with exponential backoff
    for (let attempt = 1; attempt <= config.OPENAI_MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.OPENAI_TIMEOUT);

        const response = await openai.chat.completions.create({
          model: config.OPENAI_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are a legal expert specializing in service contracts. Create professional, legally sound agreements that protect both parties\' interests.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: config.OPENAI_MAX_TOKENS.contract,
          temperature: 0.5,
          timeout: config.OPENAI_TIMEOUT
        }, { signal: controller.signal });

        clearTimeout(timeoutId);

        if (response.choices && response.choices[0] && response.choices[0].message) {
          console.log(`✅ Contract generated successfully (attempt ${attempt})`);
          return response.choices[0].message.content.trim();
        }
        
        throw new Error('Invalid response format from OpenAI');
      } catch (error) {
        lastError = error;
        
        // Log error details for debugging
        if (error.name === 'AbortError') {
          console.warn(`⚠️  OpenAI request timed out (attempt ${attempt}/${config.OPENAI_MAX_RETRIES})`);
        } else if (error.status === 429) {
          console.warn(`⚠️  OpenAI rate limit hit (attempt ${attempt}/${config.OPENAI_MAX_RETRIES})`);
          // Exponential backoff for rate limits
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        } else {
          console.error(`❌ OpenAI API error (attempt ${attempt}):`, error.message);
        }
        
        if (attempt === config.OPENAI_MAX_RETRIES) break;
      }
    }

    // If all retries failed, use fallback
    console.warn('🔄 All OpenAI attempts failed, using fallback contract generator');
    return generateFallbackContract(project);
    
  } catch (error) {
    console.error('❌ Error in generateContractContent:', error.message);
    return generateFallbackContract(project);
  }
};

// Status and health check functions
const getStatus = () => {
  return {
    openaiConfigured: isOpenAIConfigured,
    apiKeyPresent: !!config.OPENAI_API_KEY,
    model: config.OPENAI_MODEL,
    timeout: config.OPENAI_TIMEOUT,
    maxRetries: config.OPENAI_MAX_RETRIES
  };
};


module.exports = {
  generateProposalContent,
  generateContractContent,
  generateResumeContent,
  generateOfferLetterContent,
  getStatus,
  generateFallbackProposal,
  generateFallbackContract,
  generateFallbackResume,
  generateFallbackOfferLetter
};

