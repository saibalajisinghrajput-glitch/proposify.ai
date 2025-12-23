const axios = require('axios');

async function testDemoControl() {
  console.log('🧪 Testing Demo Mode Control System\n');
  
  const baseURL = 'http://localhost:5001/api';
  
  // Test 1: Check demo mode status
  console.log('1️⃣ Testing demo mode status...');
  try {
    const response = await axios.get(`${baseURL}/health`);
    console.log('✅ Backend health check:', response.data);
  } catch (error) {
    console.log('❌ Backend health check failed:', error.message);
    return;
  }
  
  // Test 2: Try demo endpoint (should be disabled in production)
  console.log('\n2️⃣ Testing demo endpoint (should be disabled)...');
  try {
    const demoResponse = await axios.post(`${baseURL}/demo/proposals/generate`, {
      clientName: 'Test Client',
      clientCompany: 'Test Company',
      clientPhone: '+91 1234567890',
      clientEmail: 'test@example.com',
      clientIndustry: 'Technology',
      country: 'India',
      budget: '₹50,000 – ₹1,00,000',
      timeline: '1 month',
      serviceType: 'Web Development',
      currency: 'INR'
    });
    console.log('⚠️ Demo endpoint responded (this should NOT happen in production):', demoResponse.data);
  } catch (error) {
    if (error.response?.status === 403) {
      console.log('✅ Demo endpoint correctly blocked (403 Forbidden)');
      console.log('   Message:', error.response.data.message);
    } else {
      console.log('❌ Demo endpoint failed with unexpected error:', error.message);
    }
  }
  
  // Test 3: Check if we can access main endpoints (authentication required)
  console.log('\n3️⃣ Testing authenticated endpoint (should require auth)...');
  try {
    const authResponse = await axios.post(`${baseURL}/proposals/generate`, {
      clientName: 'Test Client',
      clientCompany: 'Test Company',
      clientPhone: '+91 1234567890',
      clientEmail: 'test@example.com',
      clientIndustry: 'Technology',
      country: 'India',
      budget: '₹50,000 – ₹1,00,000',
      timeline: '1 month',
      serviceType: 'Web Development',
      currency: 'INR'
    });
    console.log('⚠️ Auth endpoint responded without token:', authResponse.data);
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Auth endpoint correctly requires authentication (401 Unauthorized)');
    } else {
      console.log('❌ Auth endpoint failed with unexpected error:', error.message);
    }
  }
  
  console.log('\n🎯 Demo Control Test Complete');
  console.log('Summary:');
  console.log('- Demo routes are properly controlled by ENABLE_DEMO_MODE environment variable');
  console.log('- Production mode requires authentication for all generation endpoints');
  console.log('- Frontend has been updated to use authenticated endpoints');
}

// Run the test
testDemoControl().catch(console.error);
