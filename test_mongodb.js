
const mongoose = require('mongoose');

async function testMongoDBConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI || 'Not set');

    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/proposifyai');
    console.log('✅ MongoDB connected successfully');
    console.log('Host:', conn.connection.host);
    console.log('Database:', conn.connection.name);

    // Test creating a simple user
    const User = require('./models/User');
    const testUser = new User({
      name: 'Test User',
      email: 'test_mongo@example.com',
      password: 'testpassword123'
    });

    await testUser.save();
    console.log('✅ Test user created successfully');

    // Clean up
    await User.deleteOne({ email: 'test_mongo@example.com' });
    console.log('✅ Test user deleted');

    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    console.error('Full error:', error);
  }
}

testMongoDBConnection();

