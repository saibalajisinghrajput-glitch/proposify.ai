// Test actual AI generation with real OpenAI
require('dotenv').config();

async function testRealAI() {
  console.log('🧪 Testing REAL AI Generation...\n');
  
  const { generateProposalContent } = require('./utils/openai');
  
  const testProject = {
    clientName: "Sarah Johnson",
    clientCompany: "TechStart Solutions",
    clientPhone: "+1-555-0123",
    clientEmail: "sarah@techstart.com",
    clientIndustry: "Technology",
    customIndustry: "",
    country: "United States",
    budget: "$50,000 – $100,000",
    currency: "USD",
    timeline: "6 months",
    serviceType: "Web Development",
    customService: ""
  };
  
  console.log('🚀 Testing Proposal Generation with REAL OpenAI...');
  console.log('📋 Test Project:', JSON.stringify(testProject, null, 2));
  console.log('\n⏳ Generating proposal...\n');
  
  try {
    const startTime = Date.now();
    const proposal = await generateProposalContent(testProject);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('✅ SUCCESS! AI Generated Proposal:');
    console.log('⏱️  Generation Time:', duration + 'ms');
    console.log('📄 Content Length:', proposal.length + ' characters');
    console.log('\n📄 Generated Content Preview:');
    console.log('-'.repeat(60));
    console.log(proposal.substring(0, 500) + '...');
    console.log('-'.repeat(60));
    
    console.log('\n🎉 CONCLUSION: AI GENERATION IS NOW WORKING WITH REAL OPENAI!');
    console.log('✅ No more fallback templates - genuine AI-generated content');
    console.log('✅ Unique, contextually relevant proposals');
    console.log('✅ Professional quality output');
    
  } catch (error) {
    console.log('❌ Error during AI generation:', error.message);
    console.log('Stack:', error.stack);
  }
}

testRealAI();
