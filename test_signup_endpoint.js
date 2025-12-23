#!/usr/bin/env node
const http = require('http');

console.log('🧪 Testing signup endpoint...');

const postData = JSON.stringify({
  name: 'Test User',
  email: `test${Date.now()}@example.com`,
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
  },
  timeout: 10000
};

const req = http.request(options, (res) => {
  console.log(`✅ Signup request status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:', data);
    try {
      const parsed = JSON.parse(data);
      if (parsed.token) {
        console.log('🎉 Signup successful! Token received.');
      } else {
        console.log('❌ Signup failed:', parsed.message || 'Unknown error');
      }
    } catch (e) {
      console.log('📝 Raw response (not JSON):', data);
    }
  });
});

req.on('error', (err) => {
  console.log('❌ Signup request failed:', err.message);
});

req.on('timeout', () => {
  console.log('⏰ Signup request timed out');
  req.destroy();
});

req.write(postData);
req.end();

