// Comprehensive Frontend-Backend Connection Debug
const axios = require('axios');

async function debugFrontendBackendConnection() {
  console.log('🔍 COMPREHENSIVE FRONTEND-BACKEND DEBUG\n');
  
  // Test 1: Check Backend Health
  console.log('1️⃣ Testing Backend Health Endpoint...');
  try {
    const healthResponse = await axios.get('http://localhost:5001/health', { timeout: 5000 });
    console.log('✅ Backend Health: OK');
    console.log('Response:', healthResponse.data);
  } catch (error) {
    console.log('❌ Backend Health: FAILED');
    console.log('Error:', error.message);
  }
  
  console.log('\n2️⃣ Testing API Health Endpoint...');
  try {
    const apiHealthResponse = await axios.get('http://localhost:5001/api/health', { timeout: 5000 });
    console.log('✅ API Health: OK');
    console.log('Response:', apiHealthResponse.data);
  } catch (error) {
    console.log('❌ API Health: FAILED');
    console.log('Error:', error.message);
  }
  
  // Test 3: Test Demo Proposal Generation
  console.log('\n3️⃣ Testing Demo Proposal Generation...');
  try {
    const proposalResponse = await axios.post(
      'http://localhost:5001/api/demo/proposals/generate',
      {
        clientName: 'Debug Client',
        clientCompany: 'Debug Company',
        clientPhone: '+91 9876543210',
        clientEmail: 'debug@example.com',
        clientIndustry: 'Technology',
        country: 'India',
        budget: '₹50,000 – ₹1,00,000',
        timeline: '1 month',
        serviceType: 'Web Development',
        currency: 'INR'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    console.log('✅ Demo Proposal: SUCCESS');
    console.log('Status:', proposalResponse.status);
    console.log('Has proposal data:', !!proposalResponse.data.proposal);
    console.log('Content length:', proposalResponse.data.proposal?.content?.length || 0);
    
  } catch (error) {
    console.log('❌ Demo Proposal: FAILED');
    console.log('Status:', error.response?.status);
    console.log('Error message:', error.message);
    console.log('Response data:', error.response?.data);
  }
  
  // Test 4: Test Demo Contract Generation
  console.log('\n4️⃣ Testing Demo Contract Generation...');
  try {
    const contractResponse = await axios.post(
      'http://localhost:5001/api/demo/contracts/generate',
      {
        clientName: 'Debug Client',
        clientCompany: 'Debug Company',
        clientPhone: '+91 9876543210',
        clientEmail: 'debug@example.com',
        clientIndustry: 'Technology',
        country: 'India',
        budget: '₹50,000 – ₹1,00,000',
        timeline: '1 month',
        serviceType: 'Web Development',
        currency: 'INR'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    console.log('✅ Demo Contract: SUCCESS');
    console.log('Status:', contractResponse.status);
    console.log('Has contract data:', !!contractResponse.data.contract);
    console.log('Content length:', contractResponse.data.contract?.content?.length || 0);
    
  } catch (error) {
    console.log('❌ Demo Contract: FAILED');
    console.log('Status:', error.response?.status);
    console.log('Error message:', error.message);
    console.log('Response data:', error.response?.data);
  }
  
  // Test 5: CORS Preflight Test
  console.log('\n5️⃣ Testing CORS Preflight...');
  try {
    const corsResponse = await axios.options(
      'http://localhost:5001/api/demo/proposals/generate',
      {
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'content-type'
        },
        timeout: 5000
      }
    );
    console.log('✅ CORS Preflight: OK');
    console.log('CORS Headers:', corsResponse.headers['access-control-allow-origin']);
    
  } catch (error) {
    console.log('❌ CORS Preflight: FAILED');
    console.log('Error:', error.message);
  }
  
  // Test 6: Simulate Frontend API Configuration
  console.log('\n6️⃣ Testing Frontend API Configuration...');
  const API_CONFIG = {
    development: {
      BASE_URL: 'http://localhost:5001/api',
      TIMEOUT: 30000
    },
    getCurrentConfig() {
      const env = 'development';
      return this[env] || this.development;
    },
    getBaseURL() {
      return this.getCurrentConfig().BASE_URL;
    }
  };
  
  const baseURL = API_CONFIG.getBaseURL();
  const endpoint = `${baseURL}/demo/proposals/generate`;
  
  console.log('📡 Frontend API Base URL:', baseURL);
  console.log('📡 Full Endpoint:', endpoint);
  
  try {
    const frontendSimResponse = await axios.post(endpoint, {
      clientName: 'Frontend Test',
      clientCompany: 'Frontend Company',
      clientPhone: '+91 9876543210',
      clientEmail: 'frontend@example.com',
      clientIndustry: 'Technology',
      country: 'India',
      budget: '₹50,000 – ₹1,00,000',
      timeline: '1 month',
      serviceType: 'Web Development',
      currency: 'INR'
    }, {
      timeout: 30000
    });
    
    console.log('✅ Frontend Simulation: SUCCESS');
    console.log('Response structure:', Object.keys(frontendSimResponse.data));
    
  } catch (error) {
    console.log('❌ Frontend Simulation: FAILED');
    console.log('Error type:', error.code);
    console.log('Error message:', error.message);
    console.log('Response status:', error.response?.status);
    console.log('Response data:', error.response?.data);
  }
  
  console.log('\n🎯 DIAGNOSIS SUMMARY:');
  console.log('If all tests above pass but frontend still fails, the issue is likely:');
  console.log('1. Frontend running on wrong port or environment');
  console.log('2. Browser CORS policy blocking requests');
  console.log('3. Network/firewall issues');
  console.log('4. Frontend code validation or state management issues');
  
  console.log('\n🔧 RECOMMENDED SOLUTIONS:');
  console.log('1. Check browser console for CORS errors');
  console.log('2. Verify frontend is running on http://localhost:3000');
  console.log('3. Check network tab in browser developer tools');
  console.log('4. Add more detailed error logging to frontend component');
}

debugFrontendBackendConnection();
