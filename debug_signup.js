const axios = require('axios');

async function debugSignup() {
  console.log('🔍 Starting comprehensive signup debug...\n');

  // Test 1: Check if backend is running
  console.log('1️⃣ Testing backend connection...');
  try {
    const healthResponse = await axios.get('http://localhost:5001/health', {
      timeout: 5000
    });
    console.log('✅ Backend is running:', healthResponse.data);
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    console.log('💡 Solution: Start the backend server with `cd backend && npm start`');
    return;
  }

  // Test 2: Check API health endpoint
  console.log('\n2️⃣ Testing API health endpoint...');
  try {
    const apiHealthResponse = await axios.get('http://localhost:5001/api/health', {
      timeout: 5000
    });
    console.log('✅ API health check passed:', apiHealthResponse.data);
  } catch (error) {
    console.error('❌ API health check failed:', error.message);
  }

  // Test 3: Test signup with detailed logging
  console.log('\n3️⃣ Testing signup endpoint...');
  const testEmail = `debug_test_${Date.now()}@example.com`;
  
  try {
    const signupResponse = await axios.post('http://localhost:5001/api/auth/signup', {
      name: 'Debug Test User',
      email: testEmail,
      password: 'testpassword123'
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Signup successful!');
    console.log('Status:', signupResponse.status);

    console.log('Response data:', {
      hasToken: !!signupResponse.data.token,
      userEmail: signupResponse.data.user?.email,
      userName: signupResponse.data.user?.name
    });

    // Test 4: Try to login with the same credentials
    console.log('\n4️⃣ Testing login with created user...');
    try {
      const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
        email: testEmail,
        password: 'testpassword123'
      }, {
        timeout: 5000
      });

      console.log('✅ Login successful!');
      console.log('Login response:', {
        hasToken: !!loginResponse.data.token,
        userEmail: loginResponse.data.user?.email
      });
    } catch (loginError) {
      console.error('❌ Login failed:', loginError.response?.data || loginError.message);
    }

  } catch (signupError) {
    console.error('❌ Signup failed!');
    console.error('Status:', signupError.response?.status);
    console.error('Error data:', signupError.response?.data);
    console.error('Error message:', signupError.message);
    
    if (signupError.response?.data?.error) {
      console.error('Detailed error:', signupError.response.data.error);
    }
  }

  console.log('\n🏁 Debug complete!');
}

debugSignup();
