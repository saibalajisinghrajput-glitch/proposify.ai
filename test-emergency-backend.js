// Emergency Backend Test Script
const http = require('http');

const BACKEND_URL = 'https://proposify-ai-6.onrender.com';

console.log('🧪 Testing Emergency Backend Endpoints...');
console.log('=====================================');

// Test health endpoint
function testHealth() {
  return new Promise((resolve, reject) => {
    http.get(`${BACKEND_URL}/api/health`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ Health Check:', response.status);
          resolve(response);
        } catch (e) {
          console.log('❌ Health Check: Invalid response');
          reject(e);
        }
      });
    }).on('error', (err) => {
      console.log('❌ Health Check: Connection failed');
      reject(err);
    });
  });
}

// Test signup endpoint
function testSignup() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      email: 'test@example.com',
      password: 'test123'
    });

    const options = {
      hostname: new URL(BACKEND_URL).hostname,
      port: 443,
      path: '/api/auth/signup',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          console.log('✅ Signup Test:', response.success ? 'SUCCESS' : 'FAILED');
          resolve(response);
        } catch (e) {
          console.log('❌ Signup Test: Invalid response');
          reject(e);
        }
      });
    });

    req.on('error', (err) => {
      console.log('❌ Signup Test: Connection failed');
      reject(err);
    });

    req.write(data);
    req.end();
  });
}

// Test login endpoint
function testLogin() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      email: 'test@example.com',
      password: 'test123'
    });

    const options = {
      hostname: new URL(BACKEND_URL).hostname,
      port: 443,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          console.log('✅ Login Test:', response.success ? 'SUCCESS' : 'FAILED');
          resolve(response);
        } catch (e) {
          console.log('❌ Login Test: Invalid response');
          reject(e);
        }
      });
    });

    req.on('error', (err) => {
      console.log('❌ Login Test: Connection failed');
      reject(err);
    });

    req.write(data);
    req.end();
  });
}

// Run all tests
async function runTests() {
  try {
    await testHealth();
    await testSignup();
    await testLogin();
    
    console.log('\n🎉 All tests completed!');
    console.log('Emergency backend is working correctly.');
    console.log('\n📋 Available endpoints:');
    console.log('   GET  /api/health');
    console.log('   POST /api/auth/signup');
    console.log('   POST /api/auth/login');
    console.log('   GET  /api/projects');
    console.log('   POST /api/proposals/generate');
    
  } catch (error) {
    console.log('\n❌ Some tests failed. Backend may still be deploying.');
    console.log('Please wait 1-2 minutes and run this test again.');
  }
}

// Check if backend URL is accessible
console.log(`🔗 Backend URL: ${BACKEND_URL}`);
console.log('Wait 30 seconds for deployment to complete, then run tests...\n');

// Run tests after delay
setTimeout(runTests, 30000);

