#!/usr/bin/env node
const http = require('http');

console.log('🔍 Testing backend connection...');

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/health',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  console.log(`✅ Backend is running! Status: ${res.statusCode}`);
  
  if (res.statusCode === 200) {
    console.log('🎉 Backend health check passed');
  } else {
    console.log('⚠️ Backend responding but with unexpected status:', res.statusCode);
  }
  
  res.on('data', (chunk) => {
    console.log('Response:', chunk.toString());
  });
});

req.on('error', (err) => {
  console.log('❌ Backend connection failed:', err.message);
  console.log('💡 This explains the "Connection failed" error in signup');
});

req.on('timeout', () => {
  console.log('⏰ Backend connection timed out');
  req.destroy();
});

req.end();

