#!/usr/bin/env node

console.log('🔍 Diagnosing frontend issue...');

// Test 1: Check if we can access the backend with correct headers
const http = require('http');

function testSignupWithCORS() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      name: 'CORS Test User',
      email: `cors_test_${Date.now()}@example.com`,
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
        'Origin': 'http://localhost:3000', // Simulate frontend origin
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type'
      }
    };

    const req = http.request(options, (res) => {
      console.log(`CORS Test Status: ${res.statusCode}`);
      console.log('CORS Headers:', res.headers);
      
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('CORS Response:', data);
        resolve({ status: res.statusCode, headers: res.headers, data });
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  try {
    console.log('🧪 Testing CORS preflight and signup...');
    const result = await testSignupWithCORS();
    
    if (result.status === 201) {
      console.log('✅ Backend signup works with CORS headers');
    } else {
      console.log('❌ Backend signup failed with CORS headers');
    }
    
  } catch (error) {
    console.log('❌ CORS test failed:', error.message);
  }
}

main();

