// Test AI Generation with Real OpenAI
const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

async function testAIGeneration() {
  console.log('🧪 Testing AI Generation with Real OpenAI...\n');

  try {
    // Test 1: Generate Resume
    console.log('📄 Testing Resume Generation...');
    const resumeResponse = await axios.post(`${API_BASE}/resumes/generate`, {
      candidateName: 'Alex Johnson',
      phoneNumber: '+1-555-0123',
      email: 'alex.johnson@email.com',
      education: 'Bachelor of Computer Science',
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
      experienceLevel: 'Experienced',
      jobRole: 'Software Developer',
      country: 'United States',
      resumeType: 'Professional'
    });

    console.log('✅ Resume generated successfully!');
    console.log('📝 Resume preview (first 200 chars):');
    console.log(resumeResponse.data.content.substring(0, 200) + '...\n');

    // Test 2: Generate Proposal
    console.log('📋 Testing Proposal Generation...');
    const proposalResponse = await axios.post(`${API_BASE}/proposals/generate`, {
      serviceType: 'Web Development',
      clientIndustry: 'Technology',
      clientName: 'TechCorp Solutions',
      clientEmail: 'contact@techcorp.com',
      clientPhone: '+1-555-9876',
      budget: 25000,
      timeline: '3 months',
      country: 'United States',
      clientCompany: 'TechCorp Solutions Inc.'
    });

    console.log('✅ Proposal generated successfully!');
    console.log('📝 Proposal preview (first 200 chars):');
    console.log(proposalResponse.data.content.substring(0, 200) + '...\n');

    // Test 3: Generate Contract
    console.log('📜 Testing Contract Generation...');
    const contractResponse = await axios.post(`${API_BASE}/contracts/generate`, {
      serviceType: 'Web Development',
      clientIndustry: 'Technology',
      clientName: 'TechCorp Solutions',
      clientEmail: 'contact@techcorp.com',
      clientPhone: '+1-555-9876',
      budget: 25000,
      timeline: '3 months',
      country: 'United States',
      clientCompany: 'TechCorp Solutions Inc.'
    });

    console.log('✅ Contract generated successfully!');
    console.log('📝 Contract preview (first 200 chars):');
    console.log(contractResponse.data.content.substring(0, 200) + '...\n');

    // Test 4: Generate Offer Letter
    console.log('📧 Testing Offer Letter Generation...');
    const offerResponse = await axios.post(`${API_BASE}/offer-letters/generate`, {
      candidateName: 'Sarah Williams',
      position: 'Frontend Developer',
      employmentType: 'Full-time',
      companyName: 'TechCorp Solutions',
      startDate: '2024-02-01',
      stipend: 75000,
      country: 'United States',
      hrContactDetails: 'hr@techcorp.com'
    });

    console.log('✅ Offer Letter generated successfully!');
    console.log('📝 Offer Letter preview (first 200 chars):');
    console.log(offerResponse.data.content.substring(0, 200) + '...\n');

    console.log('🎉 ALL AI GENERATION TESTS PASSED!');
    console.log('✅ OpenAI is working correctly for all document types');
    console.log('🚀 Your app now generates high-quality, AI-powered documents!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testAIGeneration();
