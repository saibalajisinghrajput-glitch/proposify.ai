const axios = require('axios');

async function testFinalSignup() {
  console.log('🧪 Testing Complete Signup Flow...\n');
  
  const timestamp = Date.now();
  const testEmail = `finaltest${timestamp}@example.com`;
  
  try {
    // Test 1: Backend signup endpoint
    console.log('1️⃣ Testing Backend Signup Endpoint');
    const signupResponse = await axios.post('http://localhost:5001/api/auth/signup', {
      name: 'Final Test User',
      email: testEmail,
      password: 'password123'
    });
    
    console.log('✅ Backend Signup Success!');
    console.log('   Status:', signupResponse.status);
    console.log('   User ID:', signupResponse.data.user.id);
    console.log('   User Email:', signupResponse.data.user.email);
    console.log('   Token Length:', signupResponse.data.token.length);
    
    // Test 2: Login with new user
    console.log('\n2️⃣ Testing Login with New User');
    const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
      email: testEmail,
      password: 'password123'
    });
    
    console.log('✅ Login Success!');
    console.log('   Status:', loginResponse.status);
    console.log('   User ID:', loginResponse.data.user.id);
    
    // Test 3: Verify token works for authenticated endpoint
    console.log('\n3️⃣ Testing Authenticated Endpoint');
    const authResponse = await axios.get('http://localhost:5001/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${signupResponse.data.token}`
      }
    });
    
    console.log('✅ Authenticated Request Success!');
    console.log('   Status:', authResponse.status);
    console.log('   Current User Email:', authResponse.data.email);
    
    console.log('\n🎉 ALL TESTS PASSED! Signup flow is working correctly.\n');
    
  } catch (error) {
    console.error('❌ Test Failed!');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('   No response - backend may be down');
    } else {
      console.error('   Error:', error.message);
    }  }
}
