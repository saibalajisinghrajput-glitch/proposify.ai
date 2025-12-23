#!/usr/bin/env node

const axios = require('axios');

// Test exactly what the frontend Signup.js component does
async function testActualFrontendSignup() {
  try {
    // This simulates what happens in frontend/src/config/api.js
    const getCurrentConfig = () => {
      const env = process.env.NODE_ENV || process.env.REACT_APP_ENVIRONMENT || 'development';
      const configs = {
        development: {
          BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
          TIMEOUT: 30000
        },
        production: {
          BASE_URL: process.env.REACT_APP_API_URL || 'https://proposifyai-backend.onrender.com/api',
          TIMEOUT: 30000
        }
      };
      return configs[env] || configs.development;
    };

    const config = getCurrentConfig();
    const baseURL = config.BASE_URL;
    
    const uniqueEmail = `actual_frontend_${Date.now()}@example.com`;
    
    console.log('=== FRONTEND SIGNUP SIMULATION ===');
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('API Base URL:', baseURL);
    console.log('Test email:', uniqueEmail);
    
    // This simulates the axios.post call in Signup.js
    const response = await axios.post(`${baseURL}/auth/signup`, {
      name: 'Actual Frontend Test',
      email: uniqueEmail,
      password: 'password123'
    }, {
      timeout: config.TIMEOUT,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ SUCCESS! Signup completed');
    console.log('Status:', response.status);
    console.log('Response data keys:', Object.keys(response.data));
    console.log('Token length:', response.data.token ? response.data.token.length : 0);
    console.log('User data:', response.data.user ? 'Present' : 'Missing');
    
    if (response.data.token) {
      console.log('Token preview:', response.data.token.substring(0, 50) + '...');
    }
    
    // Simulate the localStorage.setItem calls
    console.log('Would set localStorage items:');
    console.log('- token:', !!response.data.token);
    console.log('- user:', !!response.data.user);
    
  } catch (error) {
    console.error('❌ FAILED! Signup error:');
    
    if (error.response) {
      console.error('HTTP Status:', error.response.status);
      console.error('Response Data:', error.response.data);
      console.error('Error Message:', error.response.data?.message || 'No message');
    } else if (error.request) {
      console.error('Network Error: No response received');
      console.error('This could mean:');
      console.error('- Backend server is not running on port 5001');
      console.error('- CORS is blocking the request');
      console.error('- Network connectivity issues');
    } else {
      console.error('Request Error:', error.message);
    }
  }
}

testActualFrontendSignup();


