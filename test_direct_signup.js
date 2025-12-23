const https = require('https');
const http = require('http');

// Simple HTTP request function
function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            body: JSON.parse(body)
          };
          resolve(response);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function testSignupDirect() {
  console.log('=== DIRECT SIGNUP TEST ===');
  
  try {
    const uniqueEmail = `direct_test_${Date.now()}@example.com`;
    const testData = JSON.stringify({
      name: 'Direct Test User',
      email: uniqueEmail,
      password: 'password123'
    });

    console.log('Making request to: http://localhost:5001/api/auth/signup');
    console.log('Test email:', uniqueEmail);

    const response = await makeRequest('http://localhost:5001/api/auth/signup', testData);

    console.log('✅ SUCCESS!');
    console.log('Status Code:', response.status);
    console.log('Response:', response.body);
    
    if (response.body.token) {
      console.log('Token received: Yes');
      console.log('Token length:', response.body.token.length);
    }
    
    if (response.body.user) {
      console.log('User data received: Yes');
      console.log('User email:', response.body.user.email);
    }

  } catch (error) {
    console.error('❌ FAILED!');
    console.error('Error:', error.message);
  }
}

testSignupDirect().then(() => {
  console.log('Test completed.');
  process.exit(0);
}).catch(error => {
  console.error('Test error:', error);
  process.exit(1);
});


