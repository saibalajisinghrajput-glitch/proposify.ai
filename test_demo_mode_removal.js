/**
 * Demo Mode Removal Verification Test
 * This test verifies that all demo mode functionality has been removed
 * and the app now functions as a real production product.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

class DemoModeRemovalTest {
  constructor() {
    this.results = [];
    this.backendUrl = 'http://localhost:5001';
    this.frontendUrl = 'http://localhost:3000';
  }

  log(testName, status, message, details = null) {
    const result = {
      test: testName,
      status,
      message,
      timestamp: new Date().toISOString(),
      details
    };
    this.results.push(result);
    
    const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${testName}: ${message}`);
    if (details) {
      console.log(`   Details: ${JSON.stringify(details, null, 2)}`);
    }
  }

  async testBackendConfiguration() {
    console.log('\n🔧 Testing Backend Configuration...');
    
    try {
      // Test 1: Backend starts without demo mode environment variable
      const response = await axios.get(`${this.backendUrl}/api/health`, { timeout: 5000 });
      const health = response.data;
      
      // Verify no demo mode references
      const hasDemoMode = JSON.stringify(health).toLowerCase().includes('demo');
      
      this.log(
        'Backend Demo Mode Removal',
        hasDemoMode ? 'FAIL' : 'PASS',
        hasDemoMode ? 'Backend still contains demo mode references' : 'Backend demo mode successfully removed',
        { health, hasDemoMode }
      );

      // Test 2: Verify production environment
      const environment = health.environment || 'not set';
      this.log(
        'Production Environment',
        environment === 'production' ? 'PASS' : 'WARN',
        `Environment set to: ${environment}`,
        { expected: 'production', actual: environment }
      );

      // Test 3: Verify database is connected
      const dbStatus = health.database;
      this.log(
        'Database Connection',
        dbStatus === 'connected' ? 'PASS' : 'FAIL',
        `Database status: ${dbStatus}`,
        { expected: 'connected', actual: dbStatus }
      );

    } catch (error) {
      this.log(
        'Backend Configuration',
        'FAIL',
        `Backend not accessible: ${error.message}`,
        { error: error.message }
      );
    }
  }

  async testAuthenticationRequirements() {
    console.log('\n🔐 Testing Authentication Requirements...');
    
    try {
      // Test 1: Try to access protected route without token
      try {
        await axios.get(`${this.backendUrl}/api/auth/profile`, { 
          timeout: 5000,
          headers: {}
        });
        this.log(
          'Protected Route Access Without Token',
          'FAIL',
          'Protected route accessible without authentication'
        );
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          this.log(
            'Protected Route Access Without Token',
            'PASS',
            'Protected route properly requires authentication',
            { status: error.response.status }
          );
        } else {
          this.log(
            'Protected Route Access Without Token',
            'WARN',
            'Unexpected error when accessing protected route',
            { status: error.response?.status, error: error.message }
          );
        }
      }

      // Test 2: Verify no demo endpoints exist
      const demoEndpoints = [
        '/api/demo/proposals/generate',
        '/api/demo/resumes/generate', 
        '/api/demo/offer-letters/generate',
        '/api/demo/contracts/generate'
      ];

      for (const endpoint of demoEndpoints) {
        try {
          await axios.post(`${this.backendUrl}${endpoint}`, {}, { timeout: 3000 });
          this.log(
            `Demo Endpoint ${endpoint}`,
            'FAIL',
            'Demo endpoint still accessible'
          );
        } catch (error) {
          if (error.response?.status === 404) {
            this.log(
              `Demo Endpoint ${endpoint}`,
              'PASS',
              'Demo endpoint properly removed'
            );
          } else {
            this.log(
              `Demo Endpoint ${endpoint}`,
              'WARN',
              'Demo endpoint returned unexpected response',
              { status: error.response?.status }
            );
          }
        }
      }

    } catch (error) {
      this.log(
        'Authentication Requirements',
        'FAIL',
        `Authentication test failed: ${error.message}`,
        { error: error.message }
      );
    }
  }

  async testFrontendDemoRemoval() {
    console.log('\n🎨 Testing Frontend Demo Removal...');
    
    try {

      // Check if DemoGenerator component exists
      const demoGeneratorPath = path.join(__dirname, 'frontend', 'src', 'pages', 'DemoGenerator.js');
      const demoGeneratorExists = fs.existsSync(demoGeneratorPath);
      
      this.log(
        'DemoGenerator Component Removal',
        demoGeneratorExists ? 'FAIL' : 'PASS',
        demoGeneratorExists ? 'DemoGenerator component still exists' : 'DemoGenerator component successfully removed',
        { path: demoGeneratorPath, exists: demoGeneratorExists }
      );

      // Check App.js for demo route references
      const appJsPath = path.join(__dirname, 'frontend', 'src', 'App.js');
      const appJsContent = fs.readFileSync(appJsPath, 'utf8');
      
      const hasDemoRoute = appJsContent.includes('DemoGenerator') || appJsContent.includes('/demo');
      const hasDemoMode = appJsContent.includes('enableDemo') || appJsContent.includes('ENABLE_DEMO_MODE');
      
      this.log(
        'App.js Demo Route Removal',
        hasDemoRoute || hasDemoMode ? 'FAIL' : 'PASS',
        hasDemoRoute || hasDemoMode ? 'App.js still contains demo references' : 'App.js demo routes successfully removed',
        { hasDemoRoute, hasDemoMode }
      );


      // Check PrivateRoute for demo bypass
      const privateRoutePath = path.join(__dirname, 'frontend', 'src', 'components', 'PrivateRoute.js');
      const privateRouteContent = fs.readFileSync(privateRoutePath, 'utf8');
      
      const hasDemoBypass = privateRouteContent.includes('enableDemo') || privateRouteContent.includes('ENABLE_DEMO_MODE');
      
      this.log(
        'PrivateRoute Demo Bypass Removal',
        hasDemoBypass ? 'FAIL' : 'PASS',
        hasDemoBypass ? 'PrivateRoute still contains demo bypass' : 'PrivateRoute demo bypass successfully removed',
        { hasDemoBypass }
      );

    } catch (error) {
      this.log(
        'Frontend Demo Removal',
        'FAIL',
        `Frontend test failed: ${error.message}`,
        { error: error.message }
      );
    }
  }

  async testProductionReadiness() {
    console.log('\n🚀 Testing Production Readiness...');
    
    try {

      // Test 1: Check environment configuration
      const serverJsPath = path.join(__dirname, 'backend', 'server.js');
      const serverContent = fs.readFileSync(serverJsPath, 'utf8');
      
      // Check for production defaults
      const hasDemoMode = serverContent.includes('ENABLE_DEMO_MODE');
      const hasDemoFallback = serverContent.includes('Starting in DEMO MODE');
      const hasMongoOptional = serverContent.includes('optional for demo mode');
      
      this.log(
        'Production Configuration',
        hasDemoMode || hasDemoFallback || hasMongoOptional ? 'FAIL' : 'PASS',
        hasDemoMode || hasDemoFallback || hasMongoOptional ? 'Server still has demo mode fallbacks' : 'Server configured for production',
        { hasDemoMode, hasDemoFallback, hasMongoOptional }
      );

      // Test 2: Check mandatory database connection
      const hasOptionalDB = serverContent.includes('but don\'t fail if it doesn\'t work');
      
      this.log(
        'Mandatory Database Connection',
        hasOptionalDB ? 'FAIL' : 'PASS',
        hasOptionalDB ? 'Database connection is still optional' : 'Database connection is mandatory',
        { hasOptionalDB }
      );

      // Test 3: Check error handling for missing database
      const hasExitOnDBError = serverContent.includes('process.exit(1)');
      
      this.log(
        'Database Error Handling',
        hasExitOnDBError ? 'PASS' : 'WARN',
        hasExitOnDBError ? 'Application properly exits on database failure' : 'Application may not handle database failures properly',
        { hasExitOnDBError }
      );

    } catch (error) {
      this.log(
        'Production Readiness',
        'FAIL',
        `Production readiness test failed: ${error.message}`,
        { error: error.message }
      );
    }
  }

  generateReport() {
    console.log('\n📊 Demo Mode Removal Test Report');
    console.log('='.repeat(50));
    
    const passCount = this.results.filter(r => r.status === 'PASS').length;
    const failCount = this.results.filter(r => r.status === 'FAIL').length;
    const warnCount = this.results.filter(r => r.status === 'WARN').length;
    const totalCount = this.results.length;
    
    console.log(`\nSummary:`);
    console.log(`  Total Tests: ${totalCount}`);
    console.log(`  Passed: ${passCount} ✅`);
    console.log(`  Failed: ${failCount} ❌`);
    console.log(`  Warnings: ${warnCount} ⚠️`);
    
    const successRate = ((passCount / totalCount) * 100).toFixed(1);
    console.log(`  Success Rate: ${successRate}%`);
    
    console.log(`\nDetailed Results:`);
    this.results.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
      console.log(`  ${icon} ${result.test}: ${result.message}`);
      if (result.details) {
        console.log(`     ${JSON.stringify(result.details, null, 4)}`);
      }
    });
    
    // Overall assessment
    console.log('\n' + '='.repeat(50));
    if (failCount === 0) {
      console.log('🎉 SUCCESS: Demo mode has been completely removed!');
      console.log('✅ The application is now ready for production use.');
      console.log('✅ All authentication requirements are enforced.');
      console.log('✅ Database connection is mandatory.');
      console.log('✅ No demo routes or components remain.');
    } else {
      console.log('⚠️  PARTIAL SUCCESS: Demo mode removal incomplete.');
      console.log(`❌ ${failCount} test(s) failed - review failed tests above.`);
    }
    
    // Save report to file
    const reportPath = path.join(__dirname, 'demo_mode_removal_report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      summary: {
        total: totalCount,
        passed: passCount,
        failed: failCount,
        warnings: warnCount,
        successRate: `${successRate}%`
      },
      results: this.results,
      timestamp: new Date().toISOString()
    }, null, 2));
    
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    
    return {
      success: failCount === 0,
      passCount,
      failCount,
      warnCount,
      successRate
    };
  }

  async runAllTests() {
    console.log('🧪 Starting Demo Mode Removal Verification Tests...');
    console.log('This will verify that all demo mode functionality has been removed.');
    
    await this.testBackendConfiguration();
    await this.testAuthenticationRequirements();
    await this.testFrontendDemoRemoval();
    await this.testProductionReadiness();
    
    return this.generateReport();
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new DemoModeRemovalTest();
  tester.runAllTests().then(result => {
    process.exit(result.success ? 0 : 1);
  }).catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = DemoModeRemovalTest;
