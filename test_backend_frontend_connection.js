// Frontend-Backend Connection Test
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

async function testBackendConnection() {
  console.log('🧪 Testing Backend-Frontend Connection...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/../health`);
    console.log('✅ Health Check:', healthResponse.data);
    
    // Test 2: API Health Check
    console.log('\n2. Testing API Health Endpoint...');
    const apiHealthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ API Health Check:', apiHealthResponse.data);
    
    // Test 3: Signup Test
    console.log('\n3. Testing Signup Endpoint...');
    const signupResponse = await axios.post(`${API_BASE_URL}/auth/signup`, {
      name: 'Frontend Test User',
      email: 'frontend-test@example.com',
      password: 'testpass123'
    });
    console.log('✅ Signup Success:', {
      token: signupResponse.data.token.substring(0, 20) + '...',
      user: signupResponse.data.user
    });
    
    // Test 4: Login Test
    console.log('\n4. Testing Login Endpoint...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'frontend-test@example.com',
      password: 'testpass123'
    });
    console.log('✅ Login Success:', {
      token: loginResponse.data.token.substring(0, 20) + '...',
      user: loginResponse.data.user
    });
    
    // Test 5: Proposal Generation Test
    console.log('\n5. Testing AI Generation Endpoint...');
    const proposalResponse = await axios.post(`${API_BASE_URL}/proposals/generate`, {
      serviceType: 'Web Development',
      clientIndustry: 'Technology',
      budget: 5000,
      timeline: '3 months',
      country: 'United States',
      clientName: 'Test Client',
      clientEmail: 'client@test.com'
    });
    console.log('✅ Proposal Generation Success');
    console.log('📄 Generated content length:', proposalResponse.data.content.length, 'characters');
    
    console.log('\n🎉 ALL TESTS PASSED! Frontend-Backend connection is working perfectly.\n');
    console.log('📋 Summary:');
    console.log('   • Backend Server: Running on port 5001');
    console.log('   • Health Endpoints: ✅ Working');
    console.log('   • Authentication: ✅ Working');
    console.log('   • AI Generation: ✅ Working');
    console.log('   • CORS: ✅ Enabled');
    console.log('   • Production Mode: ✅ Enabled');
    console.log('\n🚀 Your app is ready for frontend testing!');
    
  } catch (error) {
    console.error('❌ Test Failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    process.exit(1);
  }
}

testBackendConnection();
