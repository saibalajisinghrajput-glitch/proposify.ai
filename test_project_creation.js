const axios = require('axios');

async function testProjectCreation() {
  try {
    console.log('=== Testing Project Creation ===');
    
    // First, let's test with a direct signup to get a valid token
    const uniqueEmail = `projecttest${Date.now()}@example.com`;
    console.log(`Creating user: ${uniqueEmail}`);
    
    const signupResponse = await axios.post('http://localhost:5001/api/auth/signup', {
      name: 'Project Test User',
      email: uniqueEmail,
      password: 'password123'
    });
    
    console.log('Signup successful!');
    const token = signupResponse.data.token;
    console.log('Token:', token.substring(0, 50) + '...');
    
    // Now test project creation with valid token
    console.log('\n=== Testing Project Creation ===');
    
    const projectData = {
      name: 'Test Project from API',
      description: 'Test project description',
      clientName: 'Test Client',
      clientCompany: 'Test Company',
      clientPhone: '+919876543210',
      clientEmail: 'client@test.com',
      clientIndustry: 'Technology',
      country: 'India',
      budget: '₹50,000 – ₹1,00,000',
      timeline: '1 month',
      serviceType: 'UI/UX Design'
    };
    
    console.log('Project data:', JSON.stringify(projectData, null, 2));
    
    const projectResponse = await axios.post('http://localhost:5001/api/projects', projectData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Project creation successful!');
    console.log('Status:', projectResponse.status);
    console.log('Project:', projectResponse.data);
    
  } catch (error) {
    console.error('=== Project Creation Failed ===');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received (Server might be down or CORS issue)');
    } else {
      console.error('Error:', error.message);
    }
  }
}

testProjectCreation();
