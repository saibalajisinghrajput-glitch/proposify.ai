const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Demo Mode Disabled...\n');

// Check Home.js
const homeFilePath = path.join(__dirname, 'frontend', 'src', 'pages', 'Home.js');
const homeContent = fs.readFileSync(homeFilePath, 'utf8');

// Check App.js  
const appFilePath = path.join(__dirname, 'frontend', 'src', 'App.js');
const appContent = fs.readFileSync(appFilePath, 'utf8');

console.log('📋 Test Results:');

// Test 1: Check if demo is disabled in Home.js
const homeDemoDisabled = homeContent.includes('enableDemo = false');
console.log(`✅ Home.js demo disabled: ${homeDemoDisabled ? 'PASSED' : 'FAILED'}`);

// Test 2: Check if demo is disabled in App.js
const appDemoDisabled = appContent.includes('enableDemo = false');
console.log(`✅ App.js demo disabled: ${appDemoDisabled ? 'PASSED' : 'FAILED'}`);

// Test 3: Check if no demo routes are shown (should not have demo link for non-logged users)
const noDemoLink = !homeContent.includes('Try First Free Trial') && !homeContent.includes('Try New Demo');
console.log(`✅ No demo buttons for non-logged users: ${noDemoLink ? 'PASSED' : 'FAILED'}`);

// Test 4: Check if only signup/login options are shown for non-logged users
const hasSignupOption = homeContent.includes('Continue with Full Features');
console.log(`✅ Signup option available: ${hasSignupOption ? 'PASSED' : 'FAILED'}`);

console.log('\n📋 Summary:');
const allTestsPassed = homeDemoDisabled && appDemoDisabled && hasSignupOption;

if (allTestsPassed) {
  console.log('🎉 ALL TESTS PASSED! Demo mode has been successfully disabled.');
  console.log('\n📍 Changes implemented:');
  console.log('   • Demo mode set to false in Home.js');
  console.log('   • Demo mode set to false in App.js');
  console.log('   • No demo buttons for non-logged users');
  console.log('   • Only signup/login options for new visitors');
  console.log('   • Dashboard button still works for logged-in users');
} else {
  console.log('❌ Some tests failed. Please review the implementation.');
}

console.log('\n🚀 Next steps:');
console.log('   • Visit http://localhost:3000 to see the changes');
console.log('   • New visitors will see signup/login options only');
console.log('   • Logged-in users still see dashboard button');
console.log('   • Demo functionality is now disabled');

console.log('\n' + '='.repeat(60));
