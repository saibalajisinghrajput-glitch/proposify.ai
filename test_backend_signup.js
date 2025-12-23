const axios = require('axios');

async function testBackendConnection() {
  console.log('Testing backend connection...');
  
  // Test health endpoint first
  try {
    const healthResponse = await axios.get('http://localhost:5001/health', { timeout: 5000 });
    console.log('✅ Health check passed:', healthResponse.data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }

  // Test API health endpoint
  try {
    const apiHealthResponse = await axios.get('http://localhost:5001/api/health', { timeout: 5000 });
    console.log('✅ API health check passed:', apiHealthResponse.data);
  } catch (error) {
    console.error('❌ API health check failed:', error.message);
    return false;
  }

  return true;
}

async function testSignup() {
  console.log('\nTesting signup endpoint...');
  
  const testUser = {
    name: 'Test User',
    email: `test_${Date.now()}@example.com`,
    password: 'password123'
  };

  try {
    console.log('Sending signup request...');
    const response = await axios.post('http://localhost:5001/api/auth/signup', testUser, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Signup successful!');
    console.log('Status:', response.status);
    console.log('Token:', response.data.token ? 'Received' : 'Missing');
    console.log('User:', response.data.user);

    return true;
  } catch (error) {
    console.error('❌ Signup failed!');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received');
    } else {
      console.error('Error:', error.message);
    }
    
    return false;
  }
}

async function runTests() {
  console.log('=== Backend Signup Debug Test ===\n');
  
  const backendConnected = await testBackendConnection();
  
  if (!backendConnected) {
    console.log('\n🔧 Backend is not running. Please start it with:');
    console.log('cd backend && npm start');
    return;
  }
  
  const signupWorking = await testSignup();
  
  if (!signupWorking) {
    console.log('\n🔧 Backend is running but signup is failing.');
    console.log('Check the backend logs for detailed error messages.');
  } else {
    console.log('\n✅ Signup is working correctly!');
  }
}

runTests().catch(console.error);

