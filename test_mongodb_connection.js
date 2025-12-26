const mongoose = require('mongoose');

async function testMongoDBConnection() {
    console.log('🔧 Testing MongoDB Atlas connection...');
    
    // Test multiple connection possibilities
    const connectionStrings = [
        process.env.MONGODB_URI,
        'mongodb+srv://admin:admin123@cluster0.mongodb.net/proposifyai?retryWrites=true&w=majority',
        'mongodb+srv://proposifyai:proposifyai123@cluster0.mongodb.net/proposifyai?retryWrites=true&w=majority',
        'mongodb+srv://testuser:testpass@cluster0.mongodb.net/proposifyai?retryWrites=true&w=majority'
    ].filter(Boolean);
    
    for (let i = 0; i < connectionStrings.length; i++) {
        const uri = connectionStrings[i];
        const maskedUri = uri.replace(/\/\/.*@/, '//[HIDDEN]@');
        console.log(`\n🔍 Testing connection ${i + 1}/${connectionStrings.length}: ${maskedUri}`);
        
        try {
            const conn = await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                maxPoolSize: 10,
                bufferCommands: false,
            });
            
            console.log('✅ SUCCESS! Connected to MongoDB Atlas');
            console.log('📊 Database:', conn.connection.db.databaseName);
            console.log('🗂️  Collections:', await conn.connection.db.listCollections().then(cols => cols.map(c => c.name)));
            
            // Test user creation
            const User = conn.connection.model('User', new mongoose.Schema({ name: String, email: String }));
            const testUser = new User({ name: 'Test User', email: 'test@example.com' });
            await testUser.save();
            console.log('✅ Database operations working');
            
            // Clean up test user
            await User.deleteOne({ email: 'test@example.com' });
            
            return { success: true, uri };
            
        } catch (error) {
            console.log(`❌ Failed: ${error.message}`);
        }
    }
    
    console.log('\n🚨 All connection attempts failed. Please check:');
    console.log('1. MongoDB Atlas credentials');
    console.log('2. Database user permissions');
    console.log('3. Network access (IP whitelist)');
    
    return { success: false };
}

// Run the test
testMongoDBConnection().then(result => {
    if (result.success) {
        console.log('\n🎉 Working connection string found! Update your Render environment variables.');
        process.exit(0);
    } else {
        console.log('\n💡 Need to fix MongoDB connection string');
        process.exit(1);
    }
}).catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
});
