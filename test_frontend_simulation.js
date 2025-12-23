
// Test script to simulate the exact frontend API flow
const https = require('https');
const http = require('http');

// Simulate the exact same API call that the frontend makes
async function testFrontendGeneration() {
    console.log('🧪 Testing Frontend Generation Flow...\n');
    
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
        serviceType: 'Web Development'
    };
    
    try {
        console.log('📤 Making the exact same request as frontend...');
        console.log('URL:', endpoint);
        console.log('Data:', JSON.stringify(formData, null, 2));
        
        const response = await axios.post(endpoint, formData, {
            timeout: 60000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        console.log('\n✅ SUCCESS! Frontend should receive:');
        console.log('Status:', response.status);
        console.log('Response keys:', Object.keys(response.data));
        
        // Check if the response structure matches what frontend expects
        if (response.data.proposal && response.data.proposal.content) {
            console.log('\n✅ Response structure matches frontend expectations');
            console.log('Proposal ID:', response.data.proposal._id);
            console.log('Content length:', response.data.proposal.content.length);
            console.log('First 100 chars:', response.data.proposal.content.substring(0, 100) + '...');
        } else {
            console.log('\n❌ Response structure does NOT match frontend expectations');
            console.log('Available keys:', Object.keys(response.data));
        }
        
        return { success: true, response: response.data };
        
    } catch (error) {
        console.log('\n❌ FAILED! Frontend would see this error:');
        
        if (error.response) {
            console.log('Server Error:', error.response.status);
            console.log('Error Data:', error.response.data);
        } else if (error.request) {
            console.log('Network Error: No response received');
        } else {
            console.log('Request Error:', error.message);
        }
        
        return { success: false, error: error.message };
    }
}

async function testContractGeneration() {
    console.log('\n\n🧪 Testing Contract Generation Flow...\n');
    
    const baseURL = 'http://localhost:5001/api';
    const endpoint = `${baseURL}/demo/contracts/generate`;
    
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
        console.log('📤 Making the exact same request as frontend...');
        console.log('URL:', endpoint);
        console.log('Data:', JSON.stringify(formData, null, 2));
        
        const response = await axios.post(endpoint, formData, {
            timeout: 60000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        console.log('\n✅ SUCCESS! Frontend should receive:');
        console.log('Status:', response.status);
        console.log('Response keys:', Object.keys(response.data));
        
        // Check if the response structure matches what frontend expects
        if (response.data.contract && response.data.contract.content) {
            console.log('\n✅ Response structure matches frontend expectations');
            console.log('Contract ID:', response.data.contract._id);
            console.log('Content length:', response.data.contract.content.length);
            console.log('First 100 chars:', response.data.contract.content.substring(0, 100) + '...');
        } else {
            console.log('\n❌ Response structure does NOT match frontend expectations');
            console.log('Available keys:', Object.keys(response.data));
        }
        
        return { success: true, response: response.data };
        
    } catch (error) {
        console.log('\n❌ FAILED! Frontend would see this error:');
        
        if (error.response) {
            console.log('Server Error:', error.response.status);
            console.log('Error Data:', error.response.data);
        } else if (error.request) {
            console.log('Network Error: No response received');
        } else {
            console.log('Request Error:', error.message);
        }
        
        return { success: false, error: error.message };
    }
}

async function runTests() {
    console.log('🚀 Starting Frontend Simulation Tests...\n');
    console.log('=' * 60);
    
    const proposalResult = await testFrontendGeneration();
    const contractResult = await testContractGeneration();
    
    console.log('\n' + '=' * 60);
    console.log('📋 FINAL RESULTS:');
    console.log('Proposal Generation:', proposalResult.success ? '✅ WORKING' : '❌ FAILED');
    console.log('Contract Generation:', contractResult.success ? '✅ WORKING' : '❌ FAILED');
    
    if (!proposalResult.success || !contractResult.success) {
        console.log('\n🚨 ISSUE FOUND: API is not working as expected');
        console.log('This explains why frontend shows "failed to generate"');
    } else {
        console.log('\n🤔 API is working, but frontend still shows error');
        console.log('Issue is likely in frontend error handling or CORS');
    }
}

runTests().catch(console.error);
