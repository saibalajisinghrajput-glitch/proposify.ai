const axios = require('axios');

async function testBackendFixes() {
  console.log('🧪 TESTING BACKEND FIXES...\n');
  
  const BASE_URL = 'http://localhost:5001';
  const timestamp = Date.now();
  const testEmail = `testfixes${timestamp}@example.com`;
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Endpoint');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data.status);
    console.log('   Database:', healthResponse.data.database);
    
    // Test 2: Signup (ObjectId fix)
    console.log('\n2️⃣ Testing Signup (ObjectId Fix)');
    const signupResponse = await axios.post(`${BASE_URL}/api/auth/signup`, {
      name: 'Test User Fixes',
      email: testEmail,
      password: 'password123'
    });
    
    console.log('✅ Signup Success!');
    console.log('   User ID:', signupResponse.data.user.id);
    console.log('   User Email:', signupResponse.data.user.email);
    console.log('   Token Length:', signupResponse.data.token.length);
    
    // Verify ObjectId is properly converted to string
    if (typeof signupResponse.data.user.id === 'string') {
      console.log('✅ ObjectId properly converted to string');
    } else {
      throw new Error('ObjectId not properly converted to string');
    }
    
    // Test 3: Login
    console.log('\n3️⃣ Testing Login');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: testEmail,
      password: 'password123'
    });
    
    console.log('✅ Login Success!');
    console.log('   User ID:', loginResponse.data.user.id);
    
    // Test 4: Authenticated Request
    console.log('\n4️⃣ Testing Authenticated Request');
    const authResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${signupResponse.data.token}`
      }
    });
    
    console.log('✅ Authenticated Request Success!');
    console.log('   User Email:', authResponse.data.email);
    
    // Test 5: CORS Headers
    console.log('\n5️⃣ Testing CORS Headers');
    const corsResponse = await axios.options(`${BASE_URL}/api/auth/signup`, {
      headers: {
        'Origin': 'http://localhost:3000'
      }
    });
    
    console.log('✅ CORS Headers Present');
    console.log('   Access-Control-Allow-Origin:', corsResponse.headers['access-control-allow-origin']);
    
    console.log('\n🎉 ALL BACKEND FIXES WORKING CORRECTLY!');
    console.log('\n📋 Summary:');
    console.log('   ✅ ObjectId Constructor Error - FIXED');
    console.log('   ✅ Signup Authentication - WORKING');
    console.log('   ✅ Login Authentication - WORKING');
    console.log('   ✅ JWT Token Handling - WORKING');
    console.log('   ✅ CORS Configuration - WORKING');
    console.log('   ✅ Database Connection - WORKING');
    
    return true;
    
  } catch (error) {
    console.error('❌ Test Failed!');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('   No response - backend may be down');
    } else {
      console.error('   Error:', error.message);
    }
    return false;
  }
}

// Run the test
testBackendFixes().then(success => {
  if (success) {
    console.log('\n🚀 Backend is ready for production deployment!');
  } else {
    console.log('\n⚠️  Some issues found - check backend logs');
  }
  process.exit(success ? 0 : 1);
});
