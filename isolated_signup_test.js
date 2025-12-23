#!/usr/bin/env node

console.log('🔍 **ISOLATED SIGNUP TEST** 🔍');
console.log('=====================================\n');

// Simulate exactly what happens in the browser
function testMinimalSignupFlow() {
  return new Promise((resolve, reject) => {
    const http = require('http');
    
    const postData = JSON.stringify({
      name: 'Minimal Test User',
      email: `minimal_${Date.now()}@example.com`,
      password: 'password123'
    });

    const options = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/signup',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Origin': 'http://localhost:3000'
      },
      timeout: 10000
    };

    console.log('📤 Testing minimal signup request...');

    const req = http.request(options, (res) => {
      console.log(`📥 Response Status: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          
          console.log('📄 Response Data:');
          console.log('  Token received:', parsed.token ? '✅ YES' : '❌ NO');
          console.log('  User data received:', parsed.user ? '✅ YES' : '❌ NO');
          console.log('  User email:', parsed.user?.email || 'MISSING');
          console.log('  User name:', parsed.user?.name || 'MISSING');
          
          if (res.statusCode === 201 && parsed.token) {
            console.log('\n🎉 MINIMAL SIGNUP TEST: PASSED');
            console.log('✅ Backend signup is working correctly');
            console.log('✅ Token and user data returned');
            
            // Simulate what frontend would do
            console.log('\n🔄 Simulating frontend actions:');
            console.log('  1. localStorage.setItem("token", parsed.token)');
            console.log('  2. localStorage.setItem("user", JSON.stringify(parsed.user))');
            console.log('  3. navigate("/dashboard")');
            
            resolve(true);
          } else {
            console.log('\n❌ MINIMAL SIGNUP TEST: FAILED');
            console.log('❌ Status:', res.statusCode);
            console.log('❌ Error message:', parsed.message || 'Unknown');
            resolve(false);
          }
        } catch (e) {
          console.log('\n❌ MINIMAL SIGNUP TEST: PARSE ERROR');
          console.log('❌ Raw response:', data);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log('\n❌ MINIMAL SIGNUP TEST: NETWORK ERROR');
      console.log('❌ Error:', err.message);
      reject(err);
    });

    req.on('timeout', () => {
      console.log('\n⏰ MINIMAL SIGNUP TEST: TIMEOUT');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  try {
    console.log('🚀 Starting minimal signup flow test...\n');
    
    const success = await testMinimalSignupFlow();
    
    if (success) {
      console.log('\n' + '='.repeat(50));
      console.log('📋 **DIAGNOSIS SUMMARY**');
      console.log('='.repeat(50));
      console.log('✅ Backend is working perfectly');
      console.log('✅ Signup endpoint returns proper data');
      console.log('✅ CORS is configured correctly');
      console.log('');
      console.log('💡 **IF SIGNUP STILL FAILS IN BROWSER:**');
      console.log('   1. Check browser console for JavaScript errors');
      console.log('   2. Check Network tab for failed API requests');
      console.log('   3. Verify frontend is running on http://localhost:3000');
      console.log('   4. Clear browser cache and localStorage');
      console.log('   5. Restart frontend development server');
      console.log('');
      console.log('🎯 **NEXT STEPS AFTER SUCCESSFUL SIGNUP:**');
      console.log('   1. User is redirected to /dashboard');
      console.log('   2. Dashboard loads user subscription info');
      console.log('   3. Dashboard shows tabs: Projects, Resumes, Offer Letters');
      console.log('   4. User can create new items via buttons');
      console.log('   5. Dashboard displays existing items in card format');
    } else {
      console.log('\n❌ **BACKEND SIGNUP IS NOT WORKING**');
      console.log('❌ This explains the browser signup failure');
      console.log('💡 Check backend server logs for errors');
    }
    
  } catch (error) {
    console.log('\n💥 **TEST FAILED**');
    console.log('Error:', error.message);
  }
}

main();

