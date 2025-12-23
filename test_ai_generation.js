const { generateProposalContent, getStatus } = require('./backend/utils/openai');

async function testAI() {
  console.log('🧪 Testing AI Generation...\n');
  
  // Test status
  const status = getStatus();
  console.log('📊 OpenAI Status:', JSON.stringify(status, null, 2));
  console.log('\n' + '='.repeat(50) + '\n');
  
  if (!status.openaiConfigured) {
    console.log('❌ OpenAI not configured - using fallbacks');
    return;
  }
  
  // Test proposal generation
  const testProject = {
    clientName: "John Smith",
    clientCompany: "Tech Solutions Inc",
    clientPhone: "+91 98765 43210",
    clientEmail: "john@techsolutions.com",
    clientIndustry: "Technology",
    customIndustry: "",
    country: "India",
    budget: "₹1,00,000 – ₹5,00,000",
    currency: "INR",
    timeline: "3 months",
    serviceType: "Web Development",
    customService: ""
  };
  
  console.log('🚀 Testing Proposal Generation...');
  try {
    const proposal = await generateProposalContent(testProject);
    console.log('✅ Proposal Generated Successfully!');
    console.log('📄 Content Preview:', proposal.substring(0, 300) + '...');
    console.log('\n✅ AI GENERATION IS WORKING!');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testAI();
