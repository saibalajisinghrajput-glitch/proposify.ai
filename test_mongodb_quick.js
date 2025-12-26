// Quick MongoDB Connection Test
// Usage: node test_mongodb_quick.js "your-mongodb-connection-string"

const mongoose = require('mongoose');

const connectionString = process.argv[2];

if (!connectionString) {
  console.log('❌ Usage: node test_mongodb_quick.js "your-mongodb-connection-string"');
  console.log('Example: node test_mongodb_quick.js "mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/test"');
  process.exit(1);
}

async function testQuick() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log('✅ SUCCESS: MongoDB connected!');
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📊 Collections: ${collections.length > 0 ? collections.map(c => c.name).join(', ') : 'No collections found'}`);
    
    await mongoose.disconnect();
    console.log('🎉 Connection test PASSED!');
    process.exit(0);
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
    
    if (error.message.includes('bad auth')) {
      console.log('💡 Fix: Check username/password in connection string');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('💡 Fix: Check cluster name in connection string');
    }
    
    process.exit(1);
  }
}

testQuick();
