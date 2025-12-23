// Simple test script using native Node.js modules
const http = require('http');

function makeRequest(url, data) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(data))
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    reject(new Error('Invalid JSON response'));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(JSON.stringify(data));
        req.end();
    });
}

async function testGeneration() {
    console.log('🧪 Testing Frontend Generation Flow...\n');
    
    const endpoint = 'http://localhost:5001/api/demo/proposals/generate';
    const formData = {
        clientName: 'Test Client',
        clientCompany: 'Test Company',
        clientPhone: '+91 1234567890',
        clientEmail: 'test@example.com',
        clientIndustry: 'Technology',
        country: 'India',
        budget: '₹50,000 – ₹1,00,000',
        timeline: '1 month',
        serviceType: 'Web Development'
    };
    
    try {
        console.log('📤 Making request to:', endpoint);
        const response = await makeRequest(endpoint, formData);
        
        console.log('\n✅ SUCCESS! Response details:');
        console.log('Status:', response.status);
        console.log('Response keys:', Object.keys(response.data));
        
        if (response.data.proposal && response.data.proposal.content) {
            console.log('\n✅ Proposal structure is correct');
            console.log('Content length:', response.data.proposal.content.length);
            console.log('First 100 chars:', response.data.proposal.content.substring(0, 100) + '...');
        } else {
            console.log('\n❌ Proposal structure is wrong');
            console.log('Available data:', JSON.stringify(response.data, null, 2));
        }
        
        return { success: true, response: response.data };
        
    } catch (error) {
        console.log('\n❌ FAILED! Error details:');
        console.log('Error:', error.message);
        return { success: false, error: error.message };
    }
}

testGeneration().then(result => {
    console.log('\n' + '=' * 60);
    console.log('📋 FINAL RESULT:');
    console.log('Success:', result.success ? '✅ WORKING' : '❌ FAILED');
    
    if (!result.success) {
        console.log('\n🚨 API ISSUE FOUND');
    } else {
        console.log('\n🤔 API working, frontend issue likely');
    }
}).catch(console.error);
