const { MongoClient } = require('mongodb');

async function testDirectConnection() {
  const uri = 'mongodb+srv://saibalajisingh:saibalaji@123@cluster0.ysrijw9.mongodb.net/test?retryWrites=true&w=majority';
  const client = new MongoClient(uri);

  try {
    console.log('🔧 Testing direct MongoDB Atlas connection...');
    console.log(`📡 Connecting to: ${uri.split('@')[1].split('?')[0]}`);
    
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test database operations
    const db = client.db('test');
    const collections = await db.listCollections().toArray();
    console.log(`📋 Database 'test' has ${collections.length} collections`);
    
    // Create a test document
    const result = await db.collection('test_collection').insertOne({
      message: 'Connection test successful!',
      timestamp: new Date(),
      test: true
    });
    console.log(`📝 Test document inserted with ID: ${result.insertedId}`);
    
    // Read it back
    const doc = await db.collection('test_collection').findOne({ _id: result.insertedId });
    console.log(`📖 Retrieved document: ${doc.message}`);
    
    console.log('\n🎉 MongoDB Atlas is fully operational!');
    console.log('✅ Your database is ready for the dashboard button!');
    
    return true;
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:');
    console.error('Error details:', error.message);
    
    if (error.message.includes('ECONNREFUSED') || error.message.includes('getaddrinfo')) {
      console.log('\n💡 Possible issues:');
      console.log('   • MongoDB Atlas cluster is still provisioning (wait 2-3 minutes)');
      console.log('   • Network connectivity issues');
      console.log('   • Cluster IP whitelist not configured');
    } else if (error.message.includes('authentication')) {
      console.log('\n💡 Possible issues:');
      console.log('   • Username or password incorrect');
      console.log('   • Database user doesn\'t exist');
    } else if (error.message.includes('timeout')) {
      console.log('\n💡 Possible issues:');
      console.log('   • MongoDB Atlas cluster is still starting up');
      console.log('   • Connection timeout - cluster may still be provisioning');
    }
    
    return false;
  } finally {
    await client.close();
  }
}

// Run the test
testDirectConnection().then(success => {
  if (success) {
    console.log('\n🚀 Ready to test the dashboard button!');
  } else {
    console.log('\n⏳ MongoDB Atlas may still be provisioning. Try again in 2-3 minutes.');
  }
}).catch(console.error);
