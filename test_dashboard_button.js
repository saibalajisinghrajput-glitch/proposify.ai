#!/usr/bin/env node

/**
 * Test script to verify dashboard button functionality
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Dashboard Button Implementation...\n');

// Check if the Home.js file contains the dashboard functionality
const homeFilePath = path.join(__dirname, 'frontend', 'src', 'pages', 'Home.js');

try {
  const homeFileContent = fs.readFileSync(homeFilePath, 'utf8');
  
  // Test 1: Check if isLoggedIn state is implemented
  const hasIsLoggedInState = homeFileContent.includes('const [isLoggedIn, setIsLoggedIn] = useState(false)');
  console.log(`✅ Test 1 - isLoggedIn state: ${hasIsLoggedInState ? 'PASSED' : 'FAILED'}`);
  
  // Test 2: Check if localStorage token check is implemented
  const hasTokenCheck = homeFileContent.includes('localStorage.getItem(\'token\')');
  console.log(`✅ Test 2 - Token check implementation: ${hasTokenCheck ? 'PASSED' : 'FAILED'}`);
  
  // Test 3: Check if dashboard button exists for logged-in users
  const hasDashboardButton = homeFileContent.includes('to="/dashboard"') && 
                            homeFileContent.includes('Go to Dashboard');
  console.log(`✅ Test 3 - Dashboard button for logged users: ${hasDashboardButton ? 'PASSED' : 'FAILED'}`);
  
  // Test 4: Check if dashboard section exists
  const hasDashboardSection = homeFileContent.includes('Quick Dashboard Access');
  console.log(`✅ Test 4 - Dashboard section exists: ${hasDashboardSection ? 'PASSED' : 'FAILED'}`);
  
  // Test 5: Check if conditional rendering is implemented
  const hasConditionalRendering = homeFileContent.includes('{isLoggedIn &&');
  console.log(`✅ Test 5 - Conditional rendering: ${hasConditionalRendering ? 'PASSED' : 'FAILED'}`);
  
  // Test 6: Check if Header component has dashboard button (for existing auth users)
  const headerFilePath = path.join(__dirname, 'frontend', 'src', 'components', 'Header.js');
  const headerContent = fs.readFileSync(headerFilePath, 'utf8');
  const hasHeaderDashboard = headerContent.includes('to="/dashboard"') && 
                           headerContent.includes('Dashboard');
  console.log(`✅ Test 6 - Header dashboard link: ${hasHeaderDashboard ? 'PASSED' : 'FAILED'}`);
  
  console.log('\n📋 Summary:');
  const allTestsPassed = hasIsLoggedInState && hasTokenCheck && hasDashboardButton && 
                        hasDashboardSection && hasConditionalRendering && hasHeaderDashboard;
  
  if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED! Dashboard button has been successfully implemented.');
    console.log('\n📍 Dashboard button features added:');
    console.log('   • Main hero section: Shows "Go to Dashboard" button when logged in');
    console.log('   • Quick Access section: Dedicated dashboard section with shortcuts');
    console.log('   • Header navigation: Always visible dashboard link for authenticated users');
    console.log('   • Conditional rendering: Different buttons for logged-in vs. non-logged-in users');
    console.log('   • Auto-detection: Checks localStorage token to determine login status');
  } else {
    console.log('❌ Some tests failed. Please review the implementation.');
  }
  
  console.log('\n🚀 Next steps:');
  console.log('   • Visit http://localhost:3000 to see the changes');
  console.log('   • Login to see the dashboard button appear');
  console.log('   • Test navigation to /dashboard route');
  
} catch (error) {
  console.error('❌ Error reading files:', error.message);
}

console.log('\n' + '='.repeat(60));
