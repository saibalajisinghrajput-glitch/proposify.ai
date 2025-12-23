const axios = require('axios');

async function comprehensiveSignupTest() {
  console.log('🔍 COMPREHENSIVE SIGNUP DIAGNOSTIC TEST');
  console.log('========================================');
  
  // Test 1: Backend Health Check
  console.log('\n1. Testing Backend Health...');
  try {
    const healthResponse = await axios.get('http://localhost:5001/health', { timeout: 5000 });
    console.log('✅ Backend is healthy:', healthResponse.data.status);
  } catch (error) {
    console.error('❌ Backend health check failed:', error.message);
    return;
  }

  // Test 2: CORS Preflight Check
  console.log('\n2. Testing CORS Headers...');
  try {
    const corsResponse = await axios.options('http://localhost:5001/api/auth/signup', {
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      },
      timeout: 5000
    });
    console.log('✅ CORS headers present');
    console.log('Access-Control-Allow-Origin:', corsResponse.headers['access-control-allow-origin']);
    console.log('Access-Control-Allow-Methods:', corsResponse.headers['access-control-allow-methods']);
  } catch (error) {
    console.error('❌ CORS check failed:', error.message);
  }

  // Test 3: Actual Signup with Frontend-like Headers
  console.log('\n3. Testing Frontend-like Signup Request...');
  const testEmail = `comprehensive_test_${Date.now()}@example.com`;
  
  try {
    const signupResponse = await axios.post('http://localhost:5001/api/auth/signup', {
      name: 'Comprehensive Test User',
      email: testEmail,
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000',
        'User-Agent': 'Mozilla/5.0 (compatible; Frontend-Test/1.0)'
      },
      timeout: 10000
    });

    console.log('✅ Signup SUCCESS!');
    console.log('Status:', signupResponse.status);
    console.log('Token received:', !!signupResponse.data.token);
    console.log('User data received:', !!signupResponse.data.user);
    
    if (signupResponse.data.user) {
      console.log('User ID:', signupResponse.data.user.id);
      console.log('User Email:', signupResponse.data.user.email);
    }

    // Test 4: Immediate Login Test
    console.log('\n4. Testing Immediate Login with New Account...');
    try {
      const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
        email: testEmail,
        password: 'password123'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000'
        }
      });

      console.log('✅ Login SUCCESS!');
      console.log('Login token received:', !!loginResponse.data.token);
      
    } catch (loginError) {
      console.error('❌ Login failed:', loginError.response?.data?.message || loginError.message);
    }

  } catch (error) {
    console.error('❌ Signup FAILED!');
    
    if (error.response) {
      console.error('HTTP Status:', error.response.status);
      console.error('Error Data:', error.response.data);
      console.error('Error Message:', error.response.data?.message || 'No message provided');
      
      // Common error scenarios
      if (error.response.status === 400) {
        console.log('\n💡 This is likely a validation error. Check:');
        console.log('- Email format');
        console.log('- Password requirements');
        console.log('- Required fields');
      } else if (error.response.status === 409) {
        console.log('\n💡 This is a conflict error. Check:');
        console.log('- Email already exists');
      } else if (error.response.status >= 500) {
        console.log('\n💡 This is a server error. Check:');
        console.log('- Backend logs');
        console.log('- Database connection');
      }
    } else if (error.request) {
      console.error('Network Error: No response received');
      console.log('\n💡 This suggests:');
      console.log('- Backend server is down');
      console.log('- CORS is blocking the request');
      console.log('- Network connectivity issues');
      console.log('- Wrong port or URL');
    } else {
      console.error('Request Error:', error.message);
    }
  }

  // Test 5: Environment Check
  console.log('\n5. Environment Information:');
  console.log('Node.js version:', process.version);
  console.log('Current working directory:', process.cwd());
  console.log('Timestamp:', new Date().toISOString());
}

comprehensiveSignupTest().then(() => {
  console.log('\n🏁 Comprehensive test completed.');
  process.exit(0);
}).catch(error => {
  console.error('\n💥 Test crashed:', error);
  process.exit(1);
});


