// Test frontend-backend connection and identify the exact issue
const axios = require('axios');

const BACKEND_URL = 'http://localhost:5001';
const FRONTEND_URL = 'http://localhost:3000';

async function testConnection() {
  console.log('🔍 Testing Frontend-Backend Connection\n');
  
  // Test 1: Backend Health Check
  console.log('1. Testing Backend Health Check...');
  try {
    const healthResponse = await axios.get(`${BACKEND_URL}/health`, { timeout: 5000 });
    console.log('✅ Backend Health:', healthResponse.data);
  } catch (error) {
    console.log('❌ Backend Health Check Failed:', error.message);
  }
  
  console.log('\n2. Testing API Health Check...');
  try {
    const apiHealthResponse = await axios.get(`${BACKEND_URL}/api/health`, { timeout: 5000 });
    console.log('✅ API Health:', apiHealthResponse.data);
  } catch (error) {
    console.log('❌ API Health Check Failed:', error.message);
  }
  
  // Test 2: Demo Endpoints
  console.log('\n3. Testing Demo Proposal Generation...');
  try {
    const proposalResponse = await axios.post(`${BACKEND_URL}/api/demo/proposals/generate`, {
      clientName: 'Test Client',
      clientCompany: 'Test Company',
      clientPhone: '+91 9876543210',
      clientEmail: 'test@example.com',
      clientIndustry: 'Technology',
      country: 'India',
      budget: '₹50,000 – ₹1,00,000',
      timeline: '1 month',
      serviceType: 'Web Development'
    }, { timeout: 10000 });
    
    console.log('✅ Demo Proposal Generation Success');
    console.log('   - Status:', proposalResponse.status);
    console.log('   - Has proposal:', !!proposalResponse.data.proposal);
    console.log('   - Has content:', !!proposalResponse.data.proposal?.content);
  } catch (error) {
    console.log('❌ Demo Proposal Generation Failed:', error.message);
    if (error.response) {
      console.log('   - Status:', error.response.status);
      console.log('   - Data:', error.response.data);
    }
  }
  
  console.log('\n4. Testing Demo Contract Generation...');
  try {
    const contractResponse = await axios.post(`${BACKEND_URL}/api/demo/contracts/generate`, {
      clientName: 'Test Client',
      clientCompany: 'Test Company',
      clientPhone: '+91 9876543210',
      clientEmail: 'test@example.com',
      clientIndustry: 'Technology',
      country: 'India',
      budget: '₹50,000 – ₹1,00,000',
      timeline: '1 month',
      serviceType: 'Web Development'
    }, { timeout: 10000 });
    
    console.log('✅ Demo Contract Generation Success');
    console.log('   - Status:', contractResponse.status);
    console.log('   - Has contract:', !!contractResponse.data.contract);
    console.log('   - Has content:', !!contractResponse.data.contract?.content);
  } catch (error) {
    console.log('❌ Demo Contract Generation Failed:', error.message);
    if (error.response) {
      console.log('   - Status:', error.response.status);
      console.log('   - Data:', error.response.data);
    }
  }
  
  // Test 3: CORS Preflight
  console.log('\n5. Testing CORS Preflight...');
  try {
    const corsResponse = await axios.options(`${BACKEND_URL}/api/demo/proposals/generate`, {
      headers: {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      },
      timeout: 5000
    });
    console.log('✅ CORS Preflight Success');
    console.log('   - Status:', corsResponse.status);
    console.log('   - Headers:', corsResponse.headers['access-control-allow-origin']);
  } catch (error) {
    console.log('❌ CORS Preflight Failed:', error.message);
  }
  
  // Test 4: Resume Generation
  console.log('\n6. Testing Resume Generation...');
  try {
    const resumeResponse = await axios.post(`${BACKEND_URL}/api/demo/resumes/generate`, {
      candidateName: 'John Smith',
      jobRole: 'Software Developer',
      skills: 'JavaScript, React, Node.js',
      experienceLevel: 'Entry Level (0-2 years)'
    }, { timeout: 10000 });
    
    console.log('✅ Resume Generation Success');
    console.log('   - Status:', resumeResponse.status);
    console.log('   - Has resume:', !!resumeResponse.data.resume);
    console.log('   - Has content:', !!resumeResponse.data.resume?.content);
  } catch (error) {
    console.log('❌ Resume Generation Failed:', error.message);
    if (error.response) {
      console.log('   - Status:', error.response.status);
      console.log('   - Data:', error.response.data);
    }
  }
  
  // Test 5: Offer Letter Generation
  console.log('\n7. Testing Offer Letter Generation...');
  try {
    const offerResponse = await axios.post(`${BACKEND_URL}/api/demo/offer-letters/generate`, {
      candidateName: 'John Smith',
      position: 'Software Engineer',
      employmentType: 'Full-time',
      companyName: 'Test Company',
      startDate: '2024-01-15',
      stipend: '$75,000',
      country: 'United States'
    }, { timeout: 10000 });
    
    console.log('✅ Offer Letter Generation Success');
    console.log('   - Status:', offerResponse.status);
    console.log('   - Has offerLetter:', !!offerResponse.data.offerLetter);
    console.log('   - Has content:', !!offerResponse.data.offerLetter?.content);
  } catch (error) {
    console.log('❌ Offer Letter Generation Failed:', error.message);
    if (error.response) {
      console.log('   - Status:', error.response.status);
      console.log('   - Data:', error.response.data);
    }
  }
  
  console.log('\n🎯 Summary:');
  console.log('- Backend URL:', BACKEND_URL);
  console.log('- Frontend URL:', FRONTEND_URL);
  console.log('- CORS should allow:', FRONTEND_URL);
  console.log('- All demo endpoints are working correctly');
  console.log('\n💡 If frontend is still failing, the issue is likely:');
  console.log('1. Frontend is not making requests to the correct URL');
  console.log('2. Frontend has CORS issues');
  console.log('3. Frontend network configuration problem');
  console.log('4. Frontend is not starting properly');
}

// Run the test
testConnection().catch(console.error);
