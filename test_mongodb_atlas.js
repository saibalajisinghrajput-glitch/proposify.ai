#!/usr/bin/env node

/**
 * MongoDB Atlas Setup and Test Script
 * Run this after setting up MongoDB Atlas to test the connection
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('🔧 MongoDB Atlas Connection Test\n');

// Test 1: Check if .env file exists and has MONGODB_URI
console.log('📋 Step 1: Checking .env configuration...');
const envPath = path.join(__dirname, 'backend', '.env');

try {
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found in backend directory');
    console.log('📝 Please create backend/.env with your MongoDB Atlas connection string');
    return;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasMongoURI = envContent.includes('MONGODB_URI=mongodb+srv://');
  
  if (hasMongoURI) {
    console.log('✅ MongoDB Atlas connection string found in .env');
  } else {
    console.log('❌ MongoDB Atlas connection string not found in .env');
    console.log('📝 Please update MONGODB_URI in backend/.env with your connection string');
    return;
  }
} catch (error) {
  console.log('❌ Error reading .env file:', error.message);
  return;
}

// Test 2: Test backend connection
console.log('\n📋 Step 2: Testing backend connection...');

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const healthData = JSON.parse(data);
      console.log('✅ Backend is running');
      console.log(`📊 Status: ${healthData.status}`);
      console.log(`🗄️ Database: ${healthData.database}`);
      
      if (healthData.database === 'connected') {
        console.log('\n🎉 SUCCESS! MongoDB Atlas is connected!');
        console.log('\n✅ Next steps:');
        console.log('1. Go to http://localhost:3000/signup');
        console.log('2. Create an account with any email/password');
        console.log('3. You should be redirected to the dashboard');
        console.log('4. Return to homepage to see the dashboard button!');
        
        console.log('\n🎯 Dashboard Button Features:');
        console.log('• "📊 Go to Dashboard" button in hero section');
        console.log('• Quick Dashboard Access section with shortcuts');
        console.log('• Header navigation link');
        console.log('• Auto-appears when logged in');
        
      } else {
        console.log('\n⚠️ MongoDB is not connected yet');
        console.log('📝 Make sure you:');
        console.log('1. Updated MONGODB_URI in backend/.env');
        console.log('2. Restarted the backend server');
        console.log('3. Waited 2-3 minutes for MongoDB Atlas cluster to be ready');
      }
      
    } catch (error) {
      console.log('❌ Error parsing health response:', error.message);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Backend connection failed:', error.message);
  console.log('📝 Make sure backend server is running:');
  console.log('   cd backend && npm start');
});

req.end();
