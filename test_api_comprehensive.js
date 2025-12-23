const axios = require('axios');

const BASE_URL = 'http://localhost:5001';

// Test user credentials
const testUser = {
  email: 'testuser123@example.com',
  password: 'testpass123',
  name: 'Test User Resume'
};

let authToken = null;
let userId = null;

// Helper function to make authenticated requests
const makeAuthRequest = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` })
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(`API Error (${method} ${endpoint}):`, error.response.status, error.response.data);
    } else {
      console.error(`Request Error (${method} ${endpoint}):`, error.message);
    }
    throw error;
  }
};

// Test authentication
const testAuthentication = async () => {
  console.log('🔐 Testing Authentication...');
  
  try {
    // Try to signup
    console.log('📝 Attempting signup...');
    const signupResponse = await makeAuthRequest('POST', '/api/auth/signup', testUser);
    console.log('✅ Signup successful:', signupResponse.message);
    
    // Login
    console.log('🔑 Attempting login...');
    const loginResponse = await makeAuthRequest('POST', '/api/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    
    authToken = loginResponse.token;
    userId = loginResponse.user.id;
    console.log('✅ Login successful with token:', authToken.substring(0, 20) + '...');
    return true;
    
  } catch (error) {
    if (error.response && error.response.data.message === 'User already exists') {
      console.log('👤 User already exists, trying login...');
      
      // Try to login with existing user
      try {
        const loginResponse = await makeAuthRequest('POST', '/api/auth/login', {
          email: testUser.email,
          password: testUser.password
        });
        
        authToken = loginResponse.token;
        userId = loginResponse.user.id;
        console.log('✅ Login successful with token:', authToken.substring(0, 20) + '...');
        return true;
      } catch (loginError) {
        console.error('❌ Login failed:', loginError.response?.data || loginError.message);
        return false;
      }
    } else {
      console.error('❌ Authentication failed:', error.response?.data || error.message);
      return false;
    }
  }
};

// Test Resume Generation
const testResumeGeneration = async () => {
  console.log('📄 Testing Resume Generation...');
  
  if (!authToken) {
    console.error('❌ No authentication token available');
    return false;
  }
  
  const resumeData = {
    candidateName: 'Alice Johnson',
    phoneNumber: '+91-9876543210',
    email: 'alice.johnson@example.com',
    education: 'M.Tech in Computer Science',
    skills: 'React, Node.js, MongoDB, AWS, Docker',
    experienceLevel: 'Experienced',
    jobRole: 'Full Stack Developer',
    country: 'India',
    resumeType: 'Professional'
  };
  
  try {
    const response = await makeAuthRequest('POST', '/api/resumes/generate', resumeData);
    console.log('✅ Resume Generation API Success!');
    console.log('📊 Response:', {
      message: response.message,
      usage: response.usage,
      contentLength: response.resume?.content?.length || 0
    });
    return true;
  } catch (error) {
    console.error('❌ Resume Generation API Failed:', error.response?.data || error.message);
    return false;
  }
};

// Test Offer Letter Generation
const testOfferLetterGeneration = async () => {
  console.log('📋 Testing Offer Letter Generation...');
  
  if (!authToken) {
    console.error('❌ No authentication token available');
    return false;
  }
  
  const offerLetterData = {
    candidateName: 'Bob Wilson',
    position: 'Frontend Developer',
    employmentType: 'Full-time',
    companyName: 'Innovation Labs',
    startDate: '2024-02-01',
    stipend: 950000,
    duration: null,
    country: 'India',
    hrContactDetails: 'hr@innovationlabs.com'
  };
  
  try {
    const response = await makeAuthRequest('POST', '/api/offer-letters/generate', offerLetterData);
    console.log('✅ Offer Letter Generation API Success!');
    console.log('📊 Response:', {
      message: response.message,
      usage: response.usage,
      contentLength: response.offerLetter?.content?.length || 0
    });
    return true;
  } catch (error) {
    console.error('❌ Offer Letter Generation API Failed:', error.response?.data || error.message);
    return false;
  }
};

// Run comprehensive test
const runApiTest = async () => {
  console.log('🚀 Starting Comprehensive API Test...\n');
  
  // Test authentication first
  const authSuccess = await testAuthentication();
  
  if (!authSuccess) {
    console.log('\n❌ Authentication failed. Cannot proceed with API tests.');
    return;
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Test Resume Generation
  const resumeSuccess = await testResumeGeneration();
  
  console.log('\n' + '='.repeat(50));
  
  // Test Offer Letter Generation
  const offerLetterSuccess = await testOfferLetterGeneration();
  
  console.log('\n' + '='.repeat(50));
  
  // Final Results
  console.log('\n📊 FINAL TEST RESULTS:');
  console.log('Authentication:     ', authSuccess ? '✅ PASSED' : '❌ FAILED');
  console.log('Resume Generation:  ', resumeSuccess ? '✅ PASSED' : '❌ FAILED');
  console.log('Offer Letter Gen:   ', offerLetterSuccess ? '✅ PASSED' : '❌ FAILED');
  
  const overallSuccess = authSuccess && resumeSuccess && offerLetterSuccess;
  
  if (overallSuccess) {
    console.log('\n🎉 ALL TESTS PASSED! Resume & Offer Letter generation is fully functional.');
    console.log('💡 If the frontend is still failing, check:');
    console.log('   - Frontend API configuration');
    console.log('   - CORS settings');
    console.log('   - Token storage/retrieval');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above to fix the issues.');
  }
};

// Run the test
runApiTest().catch(console.error);
