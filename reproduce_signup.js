const axios = require('axios');

async function testSignup() {
  try {
    const uniqueEmail = `test${Date.now()}@example.com`;
    console.log(`Attempting signup with email: ${uniqueEmail}`);

    const response = await axios.post('http://localhost:5001/api/auth/signup', {
      name: 'Test User',
      email: uniqueEmail,
      password: 'password123'
    });

    console.log('Signup Successful!');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
  } catch (error) {
    console.error('Signup Failed!');
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

testSignup();

