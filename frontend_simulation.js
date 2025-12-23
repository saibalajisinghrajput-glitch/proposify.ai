const axios = require('axios');

async function simulateFrontendRequest() {
  try {
    console.log('=== Simulating Frontend Request ===');
    
    // Step 1: Signup to get a valid token
    const uniqueEmail = `simtest${Date.now()}@example.com`;
    console.log(`1. Signing up user: ${uniqueEmail}`);
    
    const signupResponse = await axios.post('http://localhost:5001/api/auth/signup', {
      name: 'Sim Test User',
      email: uniqueEmail,
      password: 'password123'
    });
    
    console.log('✅ Signup successful!');
    const token = signupResponse.data.token;
    console.log('Token:', token.substring(0, 50) + '...');
    
    // Step 2: Test what the frontend would send
    const formData = {
      name: 'sai balaji',
      description: 'jn',
      clientName: 'Chandra sekhar',
      clientCompany: 'THEWALL& WOOD',
      clientPhone: '+919010988498',
      clientEmail: 'chendrasekharsingh8888@gmail.com',
      clientIndustry: 'Education',
      customIndustry: '',
      country: 'India',
      budget: '₹25,000 – ₹50,000',
      currency: 'INR',
      timeline: '1 week',
      serviceType: 'Web Development',
      customService: ''
    };
    
    // Step 3: Simulate frontend processing (what ProjectForm.js does)
    const submissionData = {
      ...formData,
      clientIndustry: formData.clientIndustry === 'Other' ? formData.customIndustry : formData.clientIndustry,
      serviceType: formData.serviceType === 'Other' ? formData.customService : formData.serviceType
    };
    
    console.log('2. Frontend processed data:', JSON.stringify(submissionData, null, 2));
    
    // Step 4: Make the request exactly like the frontend would
    console.log('3. Making request to: http://localhost:5001/api/projects');
    
    const projectResponse = await axios.post('http://localhost:5001/api/projects', submissionData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Project creation successful!');
    console.log('Status:', projectResponse.status);
    console.log('Response:', projectResponse.data);
    
  } catch (error) {
    console.error('❌ Request failed');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Data:', error.response.data);
    }
    
    if (error.request) {
      console.error('Request details:', error.request);
    }
  }
}

simulateFrontendRequest();
