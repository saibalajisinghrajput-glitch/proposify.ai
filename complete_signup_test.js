const axios = require('axios');

async function completeSignupFlowTest() {
  try {
    console.log('=== Complete Signup Flow Test ===\n');
    
    // Step 1: Test if backend is accessible
    console.log('1. Testing backend health...');
    try {
      const healthResponse = await axios.get('http://localhost:5001/health');
      console.log('✅ Backend is running:', healthResponse.data);
    } catch (error) {
      console.log('❌ Backend health check failed:', error.message);
      return;
    }
    
    // Step 2: Test environment variables
    console.log('\n2. Checking environment variables...');
    const jwtSecret = process.env.JWT_SECRET || 'not set';
    const mongoUri = process.env.MONGODB_URI || 'not set';
    console.log('JWT_SECRET:', jwtSecret);
    console.log('MONGODB_URI:', mongoUri);
    
    // Step 3: Test signup with detailed logging
    console.log('\n3. Testing signup...');
    const uniqueEmail = `completetest${Date.now()}@example.com`;
    console.log('Email:', uniqueEmail);
    
    try {
      const signupResponse = await axios.post('http://localhost:5001/api/auth/signup', {
        name: 'Complete Test User',
        email: uniqueEmail,
        password: 'password123'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Signup successful!');
      console.log('Status:', signupResponse.status);
      console.log('Response data:', JSON.stringify(signupResponse.data, null, 2));
      
      // Step 4: Test if we can use the token to access protected routes
      console.log('\n4. Testing token validity...');
      const token = signupResponse.data.token;
      
      try {
        const meResponse = await axios.get('http://localhost:5001/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('✅ Token valid, user data:', JSON.stringify(meResponse.data, null, 2));
      } catch (error) {
        console.log('❌ Token validation failed:', error.response?.data || error.message);
      }
      
    } catch (error) {
      console.log('❌ Signup failed!');
      
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Status Text:', error.response.statusText);
        console.log('Headers:', error.response.headers);
        console.log('Data:', error.response.data);
      } else if (error.request) {
        console.log('No response received');
        console.log('Request:', error.request);
      } else {
        console.log('Error:', error.message);
      }
    }
    
    // Step 5: Test MongoDB connection
    console.log('\n5. Testing MongoDB connection...');
    try {
      const mongoose = require('mongoose');
      const mongoConnected = mongoose.connection.readyState === 1;
      console.log('MongoDB connected:', mongoConnected ? 'YES' : 'NO');
      console.log('Connection state:', mongoose.connection.readyState);
    } catch (error) {
      console.log('MongoDB check failed:', error.message);
    }
    
  } catch (error) {
    console.error('Test failed with error:', error.message);
  }
}

completeSignupFlowTest();
