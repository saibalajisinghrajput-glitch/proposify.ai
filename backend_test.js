const axios = require('axios');

async function comprehensiveBackendTest() {
  console.log('=== Comprehensive Backend Test ===\n');
  
  // Test 1: Check if backend is responding
  console.log('1. Testing backend connectivity...');
  try {
    const healthResponse = await axios.get('http://localhost:5001/health', {
      timeout: 5000
    });
    console.log('✅ Backend is running:', healthResponse.data);
  } catch (error) {
    console.log('❌ Backend not accessible:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('   → Backend server is not running on port 5001');
    }
    return;
  }
  
  // Test 2: Check environment variables
  console.log('\n2. Checking environment variables...');
  try {
    // Try to get environment info from the server
    const envResponse = await axios.get('http://localhost:5001/api/health', {
      timeout: 5000
    });
    console.log('✅ API health check:', envResponse.data);
  } catch (error) {
    console.log('❌ API health check failed:', error.message);
  }
  
  // Test 3: Test signup endpoint directly
  console.log('\n3. Testing signup endpoint...');
  try {
    const uniqueEmail = `backendtest${Date.now()}@example.com`;
    
    const signupResponse = await axios.post('http://localhost:5001/api/auth/signup', {
      name: 'Backend Test User',
      email: uniqueEmail,
      password: 'password123'
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Signup successful!');
    console.log('Status:', signupResponse.status);
    console.log('Token received:', signupResponse.data.token ? 'YES' : 'NO');
    console.log('User data received:', signupResponse.data.user ? 'YES' : 'NO');
    
    if (signupResponse.data.token) {
      console.log('Token preview:', signupResponse.data.token.substring(0, 30) + '...');
    }
    
  } catch (error) {
    console.log('❌ Signup failed!');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Status Text:', error.response.statusText);
      console.log('Data:', error.response.data);
    } else if (error.request) {
      console.log('Request timeout or no response');
    } else {
      console.log('Error:', error.message);
    }
  }
  
  // Test 4: Test if CORS is working
  console.log('\n4. Testing CORS headers...');
  try {
    const corsResponse = await axios.options('http://localhost:5001/api/auth/signup', {
      timeout: 5000
    });
    console.log('✅ CORS preflight successful');
    console.log('CORS headers:', corsResponse.headers['access-control-allow-origin']);
  } catch (error) {
    console.log('❌ CORS test failed:', error.message);
  }
  
  console.log('\n=== Test Complete ===');
}

comprehensiveBackendTest();
