// Debug script to test the exact frontend API flow
const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

async function testProposalGeneration() {
    console.log('🔍 Testing Proposal Generation Flow...\n');
    
    const testData = {
        clientName: 'Debug Test Client',
        clientCompany: 'Debug Test Company',
        clientPhone: '+91 9876543210',
        clientEmail: 'debug@example.com',
        clientIndustry: 'Technology',
        country: 'India',
        budget: '₹50,000 – ₹1,00,000',
        timeline: '1 month',
        serviceType: 'Web Development'
    };
    
    try {
        console.log('📤 Sending POST request to:', `${API_BASE}/demo/proposals/generate`);
        console.log('📋 Request data:', JSON.stringify(testData, null, 2));
        
        const response = await axios.post(`${API_BASE}/demo/proposals/generate`, testData, {
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        console.log('\n✅ SUCCESS! Response received:');
        console.log('📊 Status:', response.status);
        console.log('📊 Headers:', response.headers);
        console.log('📊 Response data keys:', Object.keys(response.data));
        
        if (response.data.proposal) {
            console.log('\n📄 Proposal content length:', response.data.proposal.content?.length);
            console.log('📄 First 200 chars of content:');
            console.log(response.data.proposal.content?.substring(0, 200) + '...');
        }
        
        return { success: true, data: response.data };
        
    } catch (error) {
        console.log('\n❌ ERROR! Request failed:');
        
        if (error.response) {
            console.log('📊 Server responded with error:', error.response.status);
            console.log('📊 Error data:', error.response.data);
        } else if (error.request) {
            console.log('📊 No response received from server');
            console.log('📊 Request details:', error.request);
        } else {
            console.log('📊 Request setup error:', error.message);
        }
        
        return { success: false, error: error.message };
    }
}

async function testContractGeneration() {
    console.log('\n\n🔍 Testing Contract Generation Flow...\n');
    
    const testData = {
        clientName: 'Debug Test Client',
        clientCompany: 'Debug Test Company',
        clientPhone: '+91 9876543210',
        clientEmail: 'debug@example.com',
        clientIndustry: 'Technology',
        country: 'India',
        budget: '₹50,000 – ₹1,00,000',
        timeline: '1 month',
        serviceType: 'Web Development'
    };
    
    try {
        console.log('📤 Sending POST request to:', `${API_BASE}/demo/contracts/generate`);
        console.log('📋 Request data:', JSON.stringify(testData, null, 2));
        
        const response = await axios.post(`${API_BASE}/demo/contracts/generate`, testData, {
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        console.log('\n✅ SUCCESS! Response received:');
        console.log('📊 Status:', response.status);
        console.log('📊 Headers:', response.headers);
        console.log('📊 Response data keys:', Object.keys(response.data));
        
        if (response.data.contract) {
            console.log('\n📄 Contract content length:', response.data.contract.content?.length);
            console.log('📄 First 200 chars of content:');
            console.log(response.data.contract.content?.substring(0, 200) + '...');
        }
        
        return { success: true, data: response.data };
        
    } catch (error) {
        console.log('\n❌ ERROR! Request failed:');
        
        if (error.response) {
            console.log('📊 Server responded with error:', error.response.status);
            console.log('📊 Error data:', error.response.data);
        } else if (error.request) {
            console.log('📊 No response received from server');
            console.log('📊 Request details:', error.request);
        } else {
            console.log('📊 Request setup error:', error.message);
        }
        
        return { success: false, error: error.message };
    }
}

// Run tests
async function runTests() {
    console.log('🚀 Starting Generation Debug Tests...\n');
    console.log('=' * 60);
    
    const proposalResult = await testProposalGeneration();
    const contractResult = await testContractGeneration();
    
    console.log('\n' + '=' * 60);
    console.log('📋 FINAL RESULTS:');
    console.log('Proposal Generation:', proposalResult.success ? '✅ WORKING' : '❌ FAILED');
    console.log('Contract Generation:', contractResult.success ? '✅ WORKING' : '❌ FAILED');
    
    if (!proposalResult.success || !contractResult.success) {
        console.log('\n🚨 ISSUE DETECTED: Some generations are failing');
        console.log('This could be the source of the "failed to generate" error.');
    } else {
        console.log('\n🎉 All tests passed! The backend API is working correctly.');
        console.log('If frontend still shows "failed to generate", the issue is likely in frontend error handling.');
    }
}

runTests().catch(console.error);
