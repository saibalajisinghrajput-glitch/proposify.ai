#!/usr/bin/env node

const http = require('http');

console.log('🔍 SIMPLE SIGNUP TEST');
console.log('====================');

const postData = JSON.stringify({
  name: 'Simple Test User',
  email: `simple_test_${Date.now()}@example.com`,
  password: 'password123'
});

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/auth/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Making request to:', `http://${options.hostname}:${options.port}${options.path}`);

const req = http.request(options, (res) => {
  let data = '';
  
  console.log(`Response status: ${res.statusCode}`);
  console.log('Response headers:', res.headers);

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response body:', data);
    
    try {
      const parsed = JSON.parse(data);
      console.log('✅ SUCCESS! Parsed response:');
      console.log('- Token received:', !!parsed.token);
      console.log('- User data received:', !!parsed.user);
      if (parsed.user) {
        console.log('- User email:', parsed.user.email);
      }
    } catch (e) {
      console.log('❌ Failed to parse response as JSON');
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Request failed: ${e.message}`);
});

req.write(postData);
req.end();

console.log('Request sent, waiting for response...');


