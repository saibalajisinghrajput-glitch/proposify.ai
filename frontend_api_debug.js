// Test to identify the exact frontend API issue
const http = require('http');
const { URL } = require('url');

function simulateAxiosCall(url, data, timeout = 60000) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(data)),
                'User-Agent': 'axios/1.6.7' // Simulate axios user agent
            }
        };

        // Simulate timeout
        const timeoutId = setTimeout(() => {
            reject(new Error('timeout of 60000ms exceeded'));
        }, timeout);

        const req = http.request(options, (res) => {
            clearTimeout(timeoutId);
            
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    // Check if response is JSON
                    const contentType = res.headers['content-type'] || '';
                    if (contentType.includes('application/json')) {
                        const parsed = JSON.parse(responseData);
                        resolve({
                            status: res.statusCode,
                            statusText: res.statusMessage,
                            headers: res.headers,
                            data: parsed
                        });
                    } else {
                        reject(new Error(`Invalid JSON response: ${responseData}`));
                    }
                } catch (e) {
                    reject(new Error(`Invalid JSON response: ${responseData}`));
                }
            });
        });

        req.on('error', (error) => {
            clearTimeout(timeoutId);
            reject(error);
        });

        req.write(JSON.stringify(data));
        req.end();
    });
}

async function testFrontendAxiosSimulation() {
    console.log('🧪 Testing Frontend Axios Call Simulation...\n');
    
    const baseURL = 'http://localhost:5001/api';
    const endpoint = `${baseURL}/demo/proposals/generate`;
    
    const formData = {
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
    };
    
    try {
        console.log('📤 Simulating Frontend Axios Call...');
        console.log('URL:', endpoint);
        console.log('Method: POST');
        console.log('Headers: Content-Type: application/json, Accept: application/json');
        console.log('Timeout: 60000ms');
        console.log('Data:', JSON.stringify(formData, null, 2));
        
        const response = await simulateAxiosCall(endpoint, formData);
        
        console.log('\n✅ SUCCESS! Axios would receive:');
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.log('Headers:', response.headers);
        console.log('Response Data Keys:', Object.keys(response.data));
        
        // Check response structure exactly as frontend expects
        if (response.data.proposal && response.data.proposal.content) {
            console.log('\n✅ Response matches frontend expectations');
            console.log('Proposal ID:', response.data.proposal._id);
            console.log('Content length:', response.data.proposal.content.length);
            console.log('Demo flag:', response.data.demo);
            console.log('Message:', response.data.message);
            
            // Test frontend content extraction logic
            const result = {
                type: 'proposal',
                content: response.data.proposal.content,
                id: response.data.proposal._id
            };
            
            console.log('\n🎯 Frontend would set:');
            console.log('result.type:', result.type);
            console.log('result.content length:', result.content.length);
            console.log('result.id:', result.id);
            
        } else {
            console.log('\n❌ Response structure does NOT match frontend expectations');
            console.log('Available keys:', Object.keys(response.data));
        }
        
        return { success: true, response };
        
    } catch (error) {
        console.log('\n❌ FAILED! This is what frontend would see:');
        
        if (error.message.includes('timeout')) {
            console.log('ERROR: timeout of 60000ms exceeded');
        } else if (error.code === 'ECONNREFUSED') {
            console.log('ERROR: connect ECONNREFUSED localhost:5001');
        } else if (error.code === 'ENOTFOUND') {
            console.log('ERROR: getaddrinfo ENOTFOUND localhost');
        } else {
            console.log('ERROR:', error.message);
        }
        
        return { success: false, error: error.message };
    }
}

async function testCORSHeaders() {
    console.log('\n\n🌐 Testing CORS Headers...\n');
    
    const url = 'http://localhost:5001/api/demo/proposals/generate';
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
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
            })
        });
        
        console.log('CORS Test Response:');
        console.log('Status:', response.status);
        console.log('CORS Headers:');
        response.headers.forEach((value, key) => {
            if (key.toLowerCase().includes('access-control')) {
                console.log(`  ${key}: ${value}`);
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ CORS Test PASSED - Backend allows frontend requests');
        } else {
            console.log('❌ CORS Test FAILED');
        }
        
    } catch (error) {
        console.log('❌ CORS Test ERROR:', error.message);
    }
}

async function runAllTests() {
    console.log('🚀 Starting Comprehensive Frontend API Analysis...\n');
    console.log('=' * 70);
    
    const axiosResult = await testFrontendAxiosSimulation();
    await testCORSHeaders();
    
    console.log('\n' + '=' * 70);
    console.log('📋 DIAGNOSIS SUMMARY:');
    console.log('Axios Simulation:', axiosResult.success ? '✅ PASSED' : '❌ FAILED');
    
    if (axiosResult.success) {
        console.log('\n🤔 BACKEND IS WORKING PERFECTLY!');
        console.log('The issue is likely in the browser environment:');
        console.log('  - CORS policy blocking requests');
        console.log('  - Browser console showing different error than Node.js');
        console.log('  - Frontend not handling the successful response correctly');
        console.log('\n💡 RECOMMENDATION: Check browser console for actual error');
    } else {
        console.log('\n🚨 BACKEND ISSUE FOUND!');
        console.log('Error:', axiosResult.error);
    }
}

runAllTests().catch(console.error);
