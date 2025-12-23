const axios = require('axios');

async function testSignupFlow() {
  console.log('=== Testing Signup Flow ===\n');
  
  try {
    // Test 1: Check backend health
    console.log('1. Testing backend health...');
    const healthResponse = await axios.get('http://localhost:5001/health');
    console.log('✅ Backend is running:', healthResponse.data);
    
    // Test 2: Test signup endpoint
    console.log('\n2. Testing signup endpoint...');
    const uniqueEmail = `test${Date.now()}@example.com`;
    
    const signupResponse = await axios.post('http://localhost:5001/api/auth/signup', {
      name: 'Test User',
      email: uniqueEmail,
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Signup successful!');
    console.log('Status:', signupResponse.status);
    console.log('Token received:', !!signupResponse.data.token);
    console.log('User data:', signupResponse.data.user);
    
    // Test 3: Test the token with project creation
    console.log('\n3. Testing project creation with token...');
    const token = signupResponse.data.token;
    
    const projectData = {
      name: 'sai balaji',
      description: 'jn',
      clientName: 'Chandra sekhar',
      clientCompany: 'THEWALL& WOOD',
      clientPhone: '+919010988498',
      clientEmail: 'chendrasekharsingh8888@gmail.com',
      clientIndustry: 'Education',
      country: 'India',
      budget: '₹25,000 – ₹50,000',
      currency: 'INR',
      timeline: '1 week',
      serviceType: 'Web Development'
    };
    
    const projectResponse = await axios.post('http://localhost:5001/api/projects', projectData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Project creation successful!');
    console.log('Status:', projectResponse.status);
    console.log('Project ID:', projectResponse.data._id);
    
  } catch (error) {
    console.error('❌ Test failed!');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else if (error.request) {
      console.log('No response received');
    } else {
      console.log('Error:', error.message);
    }
  }
}

testSignupFlow();
