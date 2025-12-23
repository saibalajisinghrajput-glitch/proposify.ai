// Test script for non-demo AI generation functionality
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

// Test user credentials (you can modify these)
const testUser = {
  email: 'test@example.com',
  password: 'testpassword123',
  name: 'Test User'
};

async function testNonDemoAIGeneration() {
  console.log('🧪 Testing Non-Demo AI Generation');
  console.log('=====================================\n');

  try {
    // Step 1: Register/Login
    console.log('1️⃣  Registering/Login user...');
    
    // First try to login
    let authResponse;
    try {
      authResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ User logged in successfully');
    } catch (loginError) {
      if (loginError.response?.status === 401) {
        // User doesn't exist, register them
        console.log('📝 User not found, registering new user...');
        authResponse = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
        console.log('✅ User registered successfully');
      } else {
        throw loginError;
      }
    }

    const token = authResponse.data.token;
    console.log('🔑 Token received:', token.substring(0, 20) + '...');
    console.log('');

    // Step 2: Create a project
    console.log('2️⃣  Creating test project...');
    const projectData = {
      name: 'AI Generation Test Project',
      description: 'Testing non-demo AI generation functionality',
      clientName: 'John Doe',
      clientCompany: 'Tech Corp',
      clientPhone: '+91 9876543210',
      clientEmail: 'john@techcorp.com',
      clientIndustry: 'Technology',
      country: 'India',
      budget: '₹50,000 – ₹1,00,000',
      currency: 'INR',
      timeline: '1 month',
      serviceType: 'Web Development'
    };

    const projectResponse = await axios.post(`${API_BASE_URL}/projects`, projectData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const projectId = projectResponse.data.project._id;
    console.log('✅ Project created:', projectId);
    console.log('');

    // Step 3: Test Proposal Generation
    console.log('3️⃣  Testing Proposal Generation...');
    try {
      const proposalResponse = await axios.post(`${API_BASE_URL}/proposals/generate`, {
        projectId: projectId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Proposal generated successfully!');
      console.log('📄 Proposal ID:', proposalResponse.data.proposal._id);
      console.log('📊 Content length:', proposalResponse.data.proposal.content.length, 'characters');
      console.log('💡 First 200 characters:');
      console.log(proposalResponse.data.proposal.content.substring(0, 200) + '...');
      console.log('');

      // Check usage tracking
      if (proposalResponse.data.usage) {
        console.log('📈 Usage Information:');
        console.log('- Proposals Generated:', proposalResponse.data.usage.proposalsGenerated);
        console.log('- AI Tokens Used:', proposalResponse.data.usage.aiTokensUsed);
        console.log('- Remaining Proposals:', proposalResponse.data.usage.remaining.proposals);
        console.log('- Remaining Tokens:', proposalResponse.data.usage.remaining.tokens);
      }
      console.log('');

    } catch (proposalError) {
      console.error('❌ Proposal generation failed:');
      console.error('Status:', proposalError.response?.status);
      console.error('Message:', proposalError.response?.data?.message);
      
      if (proposalError.response?.status === 403) {
        console.log('💡 This might be due to plan limits. Check user plan and limits.');
      }
      console.log('');
    }

    // Step 4: Test Contract Generation
    console.log('4️⃣  Testing Contract Generation...');
    try {
      const contractResponse = await axios.post(`${API_BASE_URL}/contracts/generate`, {
        projectId: projectId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Contract generated successfully!');
      console.log('📄 Contract ID:', contractResponse.data.contract._id);
      console.log('📊 Content length:', contractResponse.data.contract.content.length, 'characters');
      console.log('💡 First 200 characters:');
      console.log(contractResponse.data.contract.content.substring(0, 200) + '...');
      console.log('');

    } catch (contractError) {
      console.error('❌ Contract generation failed:');
      console.error('Status:', contractError.response?.status);
      console.error('Message:', contractError.response?.data?.message);
      
      if (contractError.response?.status === 403) {
        console.log('💡 This might be due to plan limits. Check user plan and limits.');
      }
      console.log('');
    }

    // Step 5: Test Unauthorized Access
    console.log('5️⃣  Testing Unauthorized Access...');
    try {
      const unauthorizedResponse = await axios.post(`${API_BASE_URL}/proposals/generate`, {
        projectId: projectId
        // No Authorization header
      });
      console.log('❌ This should have failed!');
    } catch (unauthorizedError) {
      if (unauthorizedError.response?.status === 401) {
        console.log('✅ Unauthorized access properly blocked');
      } else {
        console.log('⚠️  Unexpected error:', unauthorizedError.response?.status);
      }
    }
    console.log('');

    console.log('🎉 Non-Demo AI Generation Test Complete!');
    console.log('=====================================');
    
  } catch (error) {
    console.error('💥 Test failed with error:');
    console.error(error.message);
    
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
  }
}

// Additional helper functions
async function checkUserPlan(token) {
  console.log('📋 Checking user plan and limits...');
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('👤 User Plan:', response.data.user.plan);
    console.log('📊 Usage:', response.data.user.usage);
    console.log('🎯 Limits:', response.data.user.planLimits);
    
  } catch (error) {
    console.error('Failed to get user profile:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testNonDemoAIGeneration()
    .then(() => {
      console.log('\n✅ All tests completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Test suite failed:', error.message);
      process.exit(1);
    });
}

module.exports = { testNonDemoAIGeneration };
