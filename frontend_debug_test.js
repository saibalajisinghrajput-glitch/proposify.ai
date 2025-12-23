const axios = require('axios');

async function testProjectCreationFromFrontend() {
  try {
    console.log('=== Testing Project Creation as Frontend Would ===');
    
    // First signup to get a valid token (simulating frontend flow)
    const uniqueEmail = `frontendtest${Date.now()}@example.com`;
    console.log(`1. Creating user: ${uniqueEmail}`);
    
    const signupResponse = await axios.post('http://localhost:5001/api/auth/signup', {
      name: 'Frontend Test User',
      email: uniqueEmail,
      password: 'password123'
    });
    
    console.log('✅ Signup successful!');
    const token = signupResponse.data.token;
    console.log('Token length:', token.length);
    
    // Now test project creation with the exact same data the frontend would send
    console.log('\n2. Testing project creation...');
    
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
    
    console.log('Project data:', JSON.stringify(projectData, null, 2));
    
    const projectResponse = await axios.post('http://localhost:5001/api/projects', projectData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Project creation successful!');
    console.log('Status:', projectResponse.status);
    console.log('Response:', projectResponse.data);
    
  } catch (error) {
    console.error('❌ Project Creation Failed');
    console.error('Error type:', error.constructor.name);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received');
      console.error('Request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
  }
}

testProjectCreationFromFrontend();
