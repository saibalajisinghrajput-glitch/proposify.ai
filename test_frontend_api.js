#!/usr/bin/env node
const axios = require('axios');

async function testFrontendAPI() {
  console.log('🧪 Testing frontend API call...');
  
  try {
    // Test the exact call that the frontend would make
    const response = await axios.post('http://localhost:5001/api/auth/signup', {
      name: 'Frontend Test User',
      email: `frontend_test_${Date.now()}@example.com`,
      password: 'password123'
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Frontend API call successful!');
    console.log('Status:', response.status);
    console.log('Token:', response.data.token ? 'Received ✅' : 'Missing ❌');
    console.log('User data:', response.data.user ? 'Received ✅' : 'Missing ❌');
    
  } catch (error) {
    console.log('❌ Frontend API call failed!');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else if (error.request) {
      console.log('Network Error - No response received');
      console.log('This suggests the backend is not accessible from frontend context');
    } else {
      console.log('Error:', error.message);
    }
  }
}

testFrontendAPI();

