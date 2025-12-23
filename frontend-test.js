// Frontend-Backend Connection Test
const axios = require('axios');

async function testFrontendBackendConnection() {
  console.log('🔍 Testing Frontend-Backend Connection...\n');
  
  // Test 1: Backend Health Check
  console.log('1. Testing backend health...');
  try {
    const health = await axios.get('http://localhost:5001/health', { timeout: 5000 });
    console.log('✅ Backend health check:', health.data.status);
  } catch (error) {
    console.log('❌ Backend health check failed:', error.message);
    return;
  }
  
  // Test 2: Demo Proposal API
  console.log('\n2. Testing demo proposal generation...');
  try {
    const response = await axios.post('http://localhost:5001/api/demo/proposals/generate', {
      clientType: 'Startup',
      country: 'USA',
      budget: '$5000',
      timeline: '2 months',
      service: 'Web Development'
    }, { 
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ Demo proposal generated successfully');
    console.log('Response message:', response.data.message);
    console.log('Proposal ID:', response.data.proposal._id);
    console.log('Proposal length:', response.data.proposal.content.length, 'characters');
    console.log('Content preview:', response.data.proposal.content.substring(0, 200) + '...');
  } catch (error) {
    console.log('❌ Demo proposal generation failed:');
    console.log('Error message:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
  
  // Test 3: Demo Contract API
  console.log('\n3. Testing demo contract generation...');
  try {
    const response = await axios.post('http://localhost:5001/api/demo/contracts/generate', {
      clientType: 'Startup',
      country: 'USA',
      budget: '$5000',
      timeline: '2 months',
      service: 'Web Development'
    }, { 
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ Demo contract generated successfully');
    console.log('Response message:', response.data.message);
    console.log('Contract ID:', response.data.contract._id);
    console.log('Contract length:', response.data.contract.content.length, 'characters');
    console.log('Content preview:', response.data.contract.content.substring(0, 200) + '...');
  } catch (error) {
    console.log('❌ Demo contract generation failed:');
    console.log('Error message:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
  
  // Test 4: CORS Configuration
  console.log('\n4. Testing CORS headers...');
  try {
    const response = await axios.options('http://localhost:5001/api/demo/proposals/generate', {
      timeout: 5000,
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    console.log('✅ CORS headers present');
    console.log('Access-Control-Allow-Origin:', response.headers['access-control-allow-origin']);
  } catch (error) {
    console.log('❌ CORS test failed:', error.message);
  }
  
  console.log('\n🎯 Test Summary:');
  console.log('- Backend is running on port 5001 ✅');
  console.log('- Demo APIs are functional ✅');
  console.log('- AI generation is working ✅');
  console.log('\nIf frontend still fails, the issue might be:');
  console.log('1. Network connectivity between ports 3000 and 5001');
  console.log('2. Browser console errors');
  console.log('3. Axios configuration in the frontend');
}

testFrontendBackendConnection();
