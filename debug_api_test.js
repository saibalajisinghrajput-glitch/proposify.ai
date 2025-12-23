#!/usr/bin/env node

// Debug API Test - Identify specific failures
const axios = require('axios');

async function debugAPI() {
  const baseURL = 'http://localhost:5002/api';
  
  console.log('🔍 Debug API Test Starting...\n');
  
  // Test 1: Health Check
  try {
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
  
  // Test 2: Signup Endpoint
  try {
    console.log('\n2. Testing signup endpoint...');
    const signupData = {
      name: 'Test User',
      email: `test_${Date.now()}@example.com`,
      password: 'password123'
    };
    const signupResponse = await axios.post(`${baseURL}/auth/signup`, signupData, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Signup passed:', signupResponse.status);
    console.log('   Token:', signupResponse.data.token ? 'Present' : 'Missing');
  } catch (error) {
    console.log('❌ Signup failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
  
  // Test 3: Login Endpoint
  try {
    console.log('\n3. Testing login endpoint...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };
    const loginResponse = await axios.post(`${baseURL}/auth/login`, loginData, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Login passed:', loginResponse.status);
  } catch (error) {
    console.log('❌ Login failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
  
  // Test 4: Demo Routes
  try {
    console.log('\n4. Testing demo proposal generation...');
    const demoData = {
      clientName: 'Demo Client',
      clientCompany: 'Demo Company'
    };
    const demoResponse = await axios.post(`${baseURL}/demo/proposals/generate`, demoData, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Demo generation passed:', demoResponse.status);
    console.log('   Proposal ID:', demoResponse.data.proposal?._id);
  } catch (error) {
    console.log('❌ Demo generation failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
  
  // Test 5: CORS Headers
  try {
    console.log('\n5. Testing CORS headers...');
    const corsResponse = await axios.options(`${baseURL}/auth/signup`, {
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    console.log('✅ CORS check passed');
    console.log('   Headers:', corsResponse.headers['access-control-allow-origin']);
  } catch (error) {
    console.log('❌ CORS check failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Headers:', error.response.headers);
    }
  }
  
  console.log('\n🎯 Debug API Test Complete');
}

debugAPI().catch(console.error);
