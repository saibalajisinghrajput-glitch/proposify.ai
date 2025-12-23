const axios = require('axios');

async function verify() {
  try {
    const email = `verify_${Date.now()}@test.com`;
    console.log('Sending request to', email);
    
    const res = await axios.post('http://localhost:5001/api/auth/signup', {
      name: 'Verify User',
      email: email,
      password: 'password123'
    }, {
      timeout: 5000 // 5s timeout
    });

    console.log('Success:', res.status, res.data);
  } catch (err) {
    console.error('Error:', err.message);
    if (err.response) {
      console.error('Response data:', err.response.data);
    }
  }
}

verify();

