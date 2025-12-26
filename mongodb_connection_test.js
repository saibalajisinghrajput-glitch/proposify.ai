// MongoDB Connection Diagnostic Script
// This script tests your MongoDB Atlas connection to identify authentication issues

const mongoose = require('mongoose');

async function testConnection(connectionString, testName = 'Connection Test') {
  console.log(`\n🔍 ${testName}`);
  console.log(`Connection String: ${connectionString.substring(0, 50)}...`);
  console.log('---');

  try {
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    
    console.log('✅ MongoDB connected successfully!');
    
    // Test basic operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📊 Available collections: ${collections.map(c => c.name).join(', ')}`);
    
    await mongoose.disconnect();
    return { success: true, error: null };
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}`);
    console.log(`🔍 Error type: ${error.name}`);
    
    // Provide specific guidance
    if (error.message.includes('bad auth')) {
      console.log('💡 AUTHENTICATION ERROR: Username/password incorrect or user doesn\'t exist');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('💡 NETWORK ERROR: Check cluster name and network connectivity');
    } else if (error.message.includes('timeout')) {
      console.log('💡 TIMEOUT ERROR: Connection string may be incorrect or cluster is down');
    }
    
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🧪 MongoDB Atlas Connection Diagnostic Tool');
  console.log('===========================================');

  const connectionString = process.argv[2] || process.env.MONGODB_URI;
  
  if (!connectionString) {
    console.log('❌ No connection string provided!');
    console.log('Usage: node mongodb_connection_test.js "your-connection-string"');
    process.exit(1);
  }

  const result = await testConnection(connectionString);
  
  if (result.success) {
    console.log('\n🎉 Connection test PASSED!');
  } else {
    console.log('\n💥 Connection test FAILED!');
    console.log('\n📋 Next steps:');
    console.log('1. Go to https://cloud.mongodb.com/');
    console.log('2. Select your cluster');
    console.log('3. Click "Connect" → "Connect your application"');
    console.log('4. Copy the connection string');
    console.log('5. Replace <password> with your database user password');
    console.log('6. Replace <dbname> with your database name');
  }
  
  process.exit(result.success ? 0 : 1);
}

main().catch(console.error);
