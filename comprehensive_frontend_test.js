#!/usr/bin/env node

const http = require('http');

// This simulates exactly what the React frontend does
function simulateFrontendSignup() {
  console.log('🧪 Simulating frontend signup...');
  
  return new Promise((resolve, reject) => {
    const uniqueEmail = `frontend_${Date.now()}@example.com`;
    const postData = JSON.stringify({
      name: 'Frontend Test User',
      email: uniqueEmail,
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
        'Origin': 'http://localhost:3000', // React dev server origin
        'User-Agent': 'Mozilla/5.0 (compatible; React-Client)'
      },
      timeout: 15000
    };

    console.log('📤 Sending request to:', `${options.hostname}:${options.port}${options.path}`);

    const req = http.request(options, (res) => {
      console.log('📥 Response status:', res.statusCode);
      console.log('📥 Response headers:', res.headers);

      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        console.log('📄 Response body:', responseData);
        
        try {
          const parsed = JSON.parse(responseData);
          
          if (res.statusCode === 201 && parsed.token && parsed.user) {
            console.log('✅ SUCCESS: Frontend signup simulation worked!');
            console.log('✅ Token received:', parsed.token ? 'Yes' : 'No');
            console.log('✅ User data received:', parsed.user ? 'Yes' : 'No');
            resolve(parsed);
          } else {
            console.log('❌ FAILED: Frontend signup simulation failed');
            console.log('❌ Status:', res.statusCode);
            console.log('❌ Message:', parsed.message || 'No message');
            resolve(null);
          }
        } catch (e) {
          console.log('❌ FAILED: Could not parse response as JSON');
          console.log('❌ Raw response:', responseData);
          resolve(null);
        }
      });
    });

    req.on('error', (err) => {
      console.log('❌ NETWORK ERROR:', err.message);
      console.log('❌ This suggests a connection issue between frontend and backend');
      reject(err);
    });

    req.on('timeout', () => {
      console.log('⏰ REQUEST TIMED OUT after 15 seconds');
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

// Test CORS preflight
function testCORSPreflight() {
  console.log('🌐 Testing CORS preflight request...');
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/signup',
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type'
      }
    };

    const req = http.request(options, (res) => {
      console.log('🌐 CORS Preflight Status:', res.statusCode);
      console.log('🌐 CORS Headers:', res.headers);
      
      if (res.statusCode === 200 || res.statusCode === 204) {
        console.log('✅ CORS preflight successful');
        resolve(true);
      } else {
        console.log('❌ CORS preflight failed');
        resolve(false);
      }
    });

    req.on('error', reject);
    req.end();
  });
}

async function main() {
  try {
    console.log('🚀 Starting comprehensive frontend-backend test...\n');
    
    // Test 1: CORS preflight
    await testCORSPreflight();
    console.log('');
    
    // Test 2: Actual signup
    const result = await simulateFrontendSignup();
    
    if (result) {
      console.log('\n🎉 FRONTEND-BACKEND CONNECTION WORKS!');
      console.log('🎯 The signup should work in the browser.');
      console.log('💡 If you still see "Connection failed", check:');
      console.log('   - Browser network tab for actual error');
      console.log('   - Console for JavaScript errors');
      console.log('   - Build process if using production build');
    } else {
      console.log('\n❌ FRONTEND-BACKEND CONNECTION FAILED');
      console.log('💡 This explains the "Connection failed" error');
    }
    
  } catch (error) {
    console.log('\n❌ TEST FAILED:', error.message);
  }
}

main();

