const { generateResumeContent, generateOfferLetterContent } = require('./backend/utils/openai');

// Test Resume Generation
const testResumeGeneration = async () => {
  console.log('🧪 Testing Resume Generation...');
  
  const resumeData = {
    candidateName: 'John Doe',
    phoneNumber: '+91-9876543210',
    email: 'john.doe@example.com',
    education: 'B.Tech in Computer Science',
    skills: 'JavaScript, React, Node.js, Python, SQL',
    experienceLevel: 'Fresher',
    jobRole: 'Software Developer',
    country: 'India',
    resumeType: 'Professional'
  };

  try {
    const content = await generateResumeContent(resumeData);
    console.log('✅ Resume Generation Successful!');
    console.log('Content preview:', content.substring(0, 200) + '...');
    return true;
  } catch (error) {
    console.error('❌ Resume Generation Failed:', error.message);
    return false;
  }
};

// Test Offer Letter Generation
const testOfferLetterGeneration = async () => {
  console.log('🧪 Testing Offer Letter Generation...');
  
  const offerData = {
    candidateName: 'Jane Smith',
    position: 'Software Engineer',
    employmentType: 'Full-time',
    companyName: 'TechCorp India',
    startDate: '2024-01-15',
    stipend: 800000,
    duration: null,
    country: 'India',
    hrContactDetails: 'hr@techcorp.com'
  };

  try {
    const content = await generateOfferLetterContent(offerData);
    console.log('✅ Offer Letter Generation Successful!');
    console.log('Content preview:', content.substring(0, 200) + '...');
    return true;
  } catch (error) {
    console.error('❌ Offer Letter Generation Failed:', error.message);
    return false;
  }
};

// Run Tests
const runTests = async () => {
  console.log('🚀 Starting Resume & Offer Letter Generation Tests...\n');
  
  const resumeSuccess = await testResumeGeneration();
  console.log('\n');
  
  const offerLetterSuccess = await testOfferLetterGeneration();
  
  console.log('\n📊 Test Results:');
  console.log(`Resume Generation: ${resumeSuccess ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Offer Letter Generation: ${offerLetterSuccess ? '✅ PASSED' : '❌ FAILED'}`);
  
  if (resumeSuccess && offerLetterSuccess) {
    console.log('\n🎉 All tests passed! Resume & Offer Letter generation is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
};

runTests();
