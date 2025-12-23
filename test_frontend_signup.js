const axios = require('axios');

// Simulate the frontend signup process
async function testFrontendSignup() {
  try {
    // Use the same base URL that the frontend would use
    const baseURL = 'http://localhost:5001/api';
    const uniqueEmail = `frontend_test_${Date.now()}@example.com`;
    
    console.log(`Testing frontend signup flow...`);
    console.log(`API Base URL: ${baseURL}`);
    console.log(`Test email: ${uniqueEmail}`);
    
    const response = await axios.post(`${baseURL}/auth/signup`, {
      name: 'Frontend Test User',
      email: uniqueEmail,
      password: 'password123'
    });

    console.log('✅ Frontend signup test PASSED!');
    console.log('Status:', response.status);
    console.log('Token received:', !!response.data.token);
    console.log('User data received:', !!response.data.user);
    console.log('User email:', response.data.user?.email);
    
    // Test that the token can be used for authenticated requests
    const authResponse = await axios.get(`${baseURL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${response.data.token}`
      }
    });
    
    console.log('✅ Token validation PASSED!');
    console.log('Authenticated user email:', authResponse.data?.email);
    
  } catch (error) {
    console.error('❌ Frontend signup test FAILED!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Message:', error.response.data?.message);
    } else if (error.request) {
      console.error('No response received (Server might be down or CORS issue)');
    } else {
      console.error('Error:', error.message);
    }
  }
}

testFrontendSignup();


