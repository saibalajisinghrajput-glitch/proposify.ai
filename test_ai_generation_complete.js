const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

const testData = {
  // Resume test data
  resume: {
    candidateName: 'John Doe',
    phoneNumber: '+1 (555) 123-4567',
    email: 'john.doe@email.com',
    education: 'Bachelor of Science in Computer Science\nUniversity of Technology\n2018-2022\nGPA: 3.8/4.0',
    skills: 'JavaScript, React, Node.js, Python, SQL',
    experienceLevel: 'Entry Level (0-2 years)',
    jobRole: 'Software Engineer',
    country: 'United States',
    resumeType: 'modern'
  },

  // Offer Letter test data
  offerLetter: {
    candidateName: 'Jane Smith',
    position: 'Frontend Developer',
    employmentType: 'Full-time',
    companyName: 'Tech Solutions Inc.',
    startDate: '2024-02-01',
    stipend: '$75,000',
    duration: '12 months',
    country: 'United States',
    hrContactDetails: 'Sarah Johnson, HR Manager\nEmail: sarah.johnson@company.com\nPhone: +1 (555) 987-6543'
  }
};

async function testResumeGeneration() {
  console.log('🧪 Testing Resume Generation...');
  
  try {
    const response = await axios.post(`${BASE_URL}/resumes/demo/generate`, {
      ...testData.resume,
      skills: testData.resume.skills.split(',').map(skill => skill.trim())
    });

    console.log('✅ Resume Generation Success');
    console.log('Response structure:', Object.keys(response.data));
    
    if (response.data.resume && response.data.resume.content) {
      console.log('📄 Resume content length:', response.data.resume.content.length);
      console.log('📄 Resume preview:', response.data.resume.content.substring(0, 200) + '...');
      return true;
    } else {
      console.log('❌ Resume response missing content');
      return false;
    }
  } catch (error) {
    console.log('❌ Resume Generation Failed');
    console.log('Error:', error.response?.data || error.message);
    return false;
  }
}

async function testOfferLetterGeneration() {
  console.log('\n🧪 Testing Offer Letter Generation...');
  
  try {
    const response = await axios.post(`${BASE_URL}/offer-letters/demo/generate`, testData.offerLetter);

    console.log('✅ Offer Letter Generation Success');
    console.log('Response structure:', Object.keys(response.data));
    
    if (response.data.offerLetter && response.data.offerLetter.content) {
      console.log('📄 Offer Letter content length:', response.data.offerLetter.content.length);
      console.log('📄 Offer Letter preview:', response.data.offerLetter.content.substring(0, 200) + '...');
      return true;
    } else {
      console.log('❌ Offer Letter response missing content');
      return false;
    }
  } catch (error) {
    console.log('❌ Offer Letter Generation Failed');
    console.log('Error:', error.response?.data || error.message);
    return false;
  }
}

async function testContractGeneration() {
  console.log('\n🧪 Testing Contract Generation (via ProjectForm)...');
  
  try {
    // Create project first
    const projectResponse = await axios.post(`${BASE_URL}/projects`, {
      name: 'Test Project',
      description: 'Test project for contract generation',
      clientName: 'Test Client',
      clientCompany: 'Test Company',
      clientPhone: '+1 (555) 123-4567',
      clientEmail: 'client@test.com',
      clientIndustry: 'Technology',
      country: 'United States',
      budget: '$10,000 – $25,000',
      currency: 'USD',
      timeline: '1 month',
      serviceType: 'Web Development'
    });

    const projectId = projectResponse.data.project._id;
    console.log('✅ Project created:', projectId);

    // Generate contract
    const contractResponse = await axios.post(`${BASE_URL}/contracts/generate`, {
      projectId: projectId
    });

    console.log('✅ Contract Generation Success');
    console.log('Response structure:', Object.keys(contractResponse.data));
    
    if (contractResponse.data.contract && contractResponse.data.contract.content) {
      console.log('📄 Contract content length:', contractResponse.data.contract.content.length);
      console.log('📄 Contract preview:', contractResponse.data.contract.content.substring(0, 200) + '...');
      return true;
    } else {
      console.log('❌ Contract response missing content');
      return false;
    }
  } catch (error) {
    console.log('❌ Contract Generation Failed');
    console.log('Error:', error.response?.data || error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting AI Generation Pipeline Tests\n');
  console.log('Base URL:', BASE_URL);
  console.log('========================================\n');

  const results = {
    resume: false,
    offerLetter: false,
    contract: false
  };

  // Test Resume Generation
  results.resume = await testResumeGeneration();

  // Test Offer Letter Generation
  results.offerLetter = await testOfferLetterGeneration();

  // Test Contract Generation
  results.contract = await testContractGeneration();

  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('========================================');
  console.log(`Resume Generation:     ${results.resume ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Offer Letter Generation: ${results.offerLetter ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Contract Generation:    ${results.contract ? '✅ PASS' : '❌ FAIL'}`);
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  console.log(`\nOverall: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED! AI Generation pipeline is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.');
  }

  return results;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, testResumeGeneration, testOfferLetterGeneration, testContractGeneration };
