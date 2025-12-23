// Test script to debug frontend API calls
const axios = require('axios');

async function testFrontendAPICall() {
  console.log('🔍 Testing Frontend API Call Simulation');
  
  // Simulate the exact API call from DemoGenerator.js
  const baseURL = 'http://localhost:5001/api';
  const endpoint = `${baseURL}/demo/proposals/generate`;
  
  const testData = {
    clientName: 'Test Client',
    clientCompany: 'Test Company',
    clientPhone: '+91 9876543210',
    clientEmail: 'test@example.com',
    clientIndustry: 'Technology',
    country: 'India',
    budget: '₹50,000 – ₹1,00,000',
    timeline: '1 month',
    serviceType: 'Web Development',
    currency: 'INR'
  };
  
  console.log('📡 API Endpoint:', endpoint);
  console.log('📋 Request Data:', JSON.stringify(testData, null, 2));
  
  try {
    console.log('🚀 Making API request...');
    const response = await axios.post(endpoint, testData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('✅ API Response Status:', response.status);
    console.log('📊 Response Data Keys:', Object.keys(response.data));
    
    if (response.data.proposal) {
      console.log('📄 Proposal Content Length:', response.data.proposal.content.length);
      console.log('📄 Proposal Preview:', response.data.proposal.content.substring(0, 200) + '...');
    }
    
    console.log('🎉 API Call Successful!');
    return response.data;
    
  } catch (error) {
    console.error('❌ API Call Failed!');
    console.error('Error Message:', error.message);
    
    if (error.response) {
      console.error('Status Code:', error.response.status);
      console.error('Response Data:', error.response.data);
      console.error('Response Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No Response Received - Network Issue');
      console.error('Request Details:', error.request);
    }
    
    return null;
  }
}

// Test contract generation as well
async function testContractAPI() {
  console.log('\n🔍 Testing Contract API Call');
  
  const baseURL = 'http://localhost:5001/api';
  const endpoint = `${baseURL}/demo/contracts/generate`;
  
  const testData = {
    clientName: 'Test Client',
    clientCompany: 'Test Company',
    clientPhone: '+91 9876543210',
    clientEmail: 'test@example.com',
    clientIndustry: 'Technology',
    country: 'India',
    budget: '₹50,000 – ₹1,00,000',
    timeline: '1 month',
    serviceType: 'Web Development',
    currency: 'INR'
  };
  
  try {
    const response = await axios.post(endpoint, testData);
    console.log('✅ Contract API Response Status:', response.status);
    
    if (response.data.contract) {
      console.log('📄 Contract Content Length:', response.data.contract.content.length);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Contract API Call Failed:', error.message);
    return null;
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Frontend API Debug Tests...\n');
  
  const proposalResult = await testFrontendAPICall();
  const contractResult = await testContractAPI();
  
  console.log('\n📊 Test Results Summary:');
  console.log('Proposal Test:', proposalResult ? '✅ PASSED' : '❌ FAILED');
  console.log('Contract Test:', contractResult ? '✅ PASSED' : '❌ FAILED');
  
  if (proposalResult && contractResult) {
    console.log('\n🎉 Both API calls working perfectly! The issue is likely in the frontend component logic.');
  } else {
    console.log('\n⚠️  API issues detected. Check backend status and configuration.');
  }
}

runTests();
