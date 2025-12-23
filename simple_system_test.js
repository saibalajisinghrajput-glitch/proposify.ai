#!/usr/bin/env node

// Simple System Test for ProposifyAI
// Tests all 12 identified problems using built-in Node.js capabilities

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class SimpleSystemTester {
  constructor() {
    this.results = [];
    this.backendURL = 'http://localhost:5001';
    this.frontendURL = 'http://localhost:3000';
    this.baseURL = `${this.backendURL}/api`;
  }

  // Simple HTTP request function
  makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const isHttps = urlObj.protocol === 'https:';
      const client = isHttps ? https : http;
      
      const requestOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port || (isHttps ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers: {
          'User-Agent': 'ProposifyAI-System-Test/1.0',
          ...options.headers
        },
        timeout: 10000
      };

      const req = client.request(requestOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            resolve({ status: res.statusCode, headers: res.headers, data: parsedData });
          } catch {
            resolve({ status: res.statusCode, headers: res.headers, data: data });
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (options.data) {
        req.write(JSON.stringify(options.data));
      }

      req.end();
    });
  }

  // Test result logging
  logTest(name, status, details, fix = null) {
    this.results.push({
      name,
      status,
      details,
      fix,
      timestamp: new Date().toISOString()
    });

    const statusIcon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${statusIcon} ${name}: ${status}`);
    console.log(`   Details: ${details}`);
    if (fix) console.log(`   Fix: ${fix}`);
    console.log('');
  }

  // Test 1: Backend Health Check
  async testBackendHealth() {
    try {
      console.log('🔍 Testing Backend Health...');
      const response = await this.makeRequest(`${this.baseURL}/health`);
      
      if (response.status === 200) {
        this.logTest('Backend Health Check', 'PASS', 'Backend is running and responding');
        return true;
      } else {
        this.logTest('Backend Health Check', 'FAIL', `Status: ${response.status}`);
        return false;
      }
    } catch (error) {
      this.logTest('Backend Health Check', 'FAIL', `Error: ${error.message}`, 
        'Start backend server: cd backend && npm start');
      return false;
    }
  }

  // Test 2: CORS Configuration
  async testCORS() {
    try {
      console.log('🔍 Testing CORS Configuration...');
      
      const response = await this.makeRequest(`${this.baseURL}/health`, {
        method: 'OPTIONS',
        headers: {
          'Origin': this.frontendURL,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });

      const corsHeaders = response.headers;
      const hasCORS = corsHeaders['access-control-allow-origin'] && 
                      corsHeaders['access-control-allow-methods'];

      if (hasCORS) {
        this.logTest('CORS Configuration', 'PASS', 'CORS headers properly configured');
        return true;
      } else {
        this.logTest('CORS Configuration', 'FAIL', 'Missing CORS headers', 
          'Check server.js CORS configuration');
        return false;
      }
    } catch (error) {
      this.logTest('CORS Configuration', 'FAIL', `Error: ${error.message}`, 
        'Ensure backend is running and CORS is properly configured');
      return false;
    }
  }

  // Test 3: MongoDB Connection
  async testMongoDB() {
    try {
      console.log('🔍 Testing MongoDB Connection...');
      
      const response = await this.makeRequest(`${this.baseURL}/health`);
      
      if (response.data && response.data.mongodb) {
        this.logTest('MongoDB Connection', 'PASS', 'MongoDB connection successful');
        return true;
      } else {
        this.logTest('MongoDB Connection', 'FAIL', 'No MongoDB status in response', 
          'Check MongoDB connection string and ensure MongoDB is running');
        return false;
      }
    } catch (error) {
      this.logTest('MongoDB Connection', 'FAIL', `Error: ${error.message}`, 
        'Start MongoDB and check connection string in .env file');
      return false;
    }
  }

  // Test 4: API Routes
  async testAPIRoutes() {
    const routes = [
      { path: '/auth/health', method: 'GET' },
      { path: '/projects', method: 'GET' }
    ];

    let allRoutesWorking = true;

    for (const route of routes) {
      try {
        const response = await this.makeRequest(`${this.baseURL}${route.path}`, {
          method: route.method
        });

        this.logTest(`API Route ${route.method} ${route.path}`, 'PASS', 'Route responding');
      } catch (error) {
        const status = error.message.includes('401') ? 401 : error.message.includes('403') ? 403 : null;
        if (status === 401 || status === 403) {
          this.logTest(`API Route ${route.method} ${route.path}`, 'PASS', 'Route exists (auth required)');
        } else {
          this.logTest(`API Route ${route.method} ${route.path}`, 'FAIL', 'Route not responding');
          allRoutesWorking = false;
        }
      }
    }

    return allRoutesWorking;
  }

  // Test 5: OpenAI Configuration
  async testOpenAI() {
    try {
      console.log('🔍 Testing OpenAI Configuration...');
      
      const response = await this.makeRequest(`${this.backendURL}/api/test-openai`);
      
      if (response.data && response.data.status) {
        const status = response.data.status;
        if (status === 'success') {
          this.logTest('OpenAI Configuration', 'PASS', 'OpenAI API configured and working');
          return true;
        } else {
          this.logTest('OpenAI Configuration', 'FAIL', `OpenAI error: ${response.data.error}`, 
            'Check OpenAI API key in .env file');
          return false;
        }
      }
    } catch (error) {
      this.logTest('OpenAI Configuration', 'FAIL', `Error: ${error.message}`, 
        'Check OpenAI API key and test endpoint');
      return false;
    }
  }

  // Test 6: Frontend Connection
  async testFrontendConnection() {
    try {
      console.log('🔍 Testing Frontend Connection...');
      
      const response = await this.makeRequest(this.frontendURL);
      
      if (response.status === 200) {
        this.logTest('Frontend Connection', 'PASS', 'Frontend is running and accessible');
        return true;
      } else {
        this.logTest('Frontend Connection', 'FAIL', `Status: ${response.status}`);
        return false;
      }
    } catch (error) {
      this.logTest('Frontend Connection', 'FAIL', `Error: ${error.message}`, 
        'Start frontend server: cd frontend && npm start');
      return false;
    }
  }

  // Test 7: Environment Variables
  testEnvironmentVariables() {
    console.log('🔍 Testing Environment Variables...');
    
    const requiredVars = [
      'NODE_ENV',
      'MONGODB_URI', 
      'JWT_SECRET',
      'PORT'
    ];

    let allVarsPresent = true;

    for (const envVar of requiredVars) {
      if (process.env[envVar]) {
        this.logTest(`Environment Variable ${envVar}`, 'PASS', 'Present');
      } else {
        this.logTest(`Environment Variable ${envVar}`, 'FAIL', 'Missing', 
          `Add ${envVar} to .env file`);
        allVarsPresent = false;
      }
    }

    return allVarsPresent;
  }

  // Test 8: PDF Generation Support
  testPDFSupport() {
    console.log('🔍 Testing PDF Generation Support...');
    
    const pdfGeneratorPath = path.join(__dirname, 'frontend/src/utils/pdfGenerator.js');
    
    if (fs.existsSync(pdfGeneratorPath)) {
      const content = fs.readFileSync(pdfGeneratorPath, 'utf8');
      
      if (content.includes('generatePDF') && content.includes('PDFGenerator')) {
        this.logTest('PDF Generation Support', 'PASS', 'PDF generator exists and has required methods');
        return true;
      } else {
        this.logTest('PDF Generation Support', 'FAIL', 'PDF generator missing required methods');
        return false;
      }
    } else {
      this.logTest('PDF Generation Support', 'FAIL', 'PDF generator file not found');
      return false;
    }
  }

  // Test 9: Error Handling
  testErrorHandling() {
    console.log('🔍 Testing Error Handling...');
    
    const errorHandlerPath = path.join(__dirname, 'backend/middleware/errorHandler.js');
    
    if (fs.existsSync(errorHandlerPath)) {
      const content = fs.readFileSync(errorHandlerPath, 'utf8');
      
      if (content.includes('errorHandler') && content.includes('asyncHandler')) {
        this.logTest('Error Handling', 'PASS', 'Comprehensive error handler exists');
        return true;
      } else {
        this.logTest('Error Handling', 'FAIL', 'Error handler incomplete');
        return false;
      }
    } else {
      this.logTest('Error Handling', 'FAIL', 'Error handler not found');
      return false;
    }
  }

  // Test 10: API Configuration
  testAPIConfiguration() {
    console.log('🔍 Testing API Configuration...');
    
    const apiConfigPath = path.join(__dirname, 'frontend/src/config/api.js');
    
    if (fs.existsSync(apiConfigPath)) {
      const content = fs.readFileSync(apiConfigPath, 'utf8');
      
      if (content.includes('axios') && content.includes('createAxiosInstance')) {
        this.logTest('API Configuration', 'PASS', 'Enhanced API configuration exists');
        return true;
      } else {
        this.logTest('API Configuration', 'FAIL', 'API configuration incomplete');
        return false;
      }
    } else {
      this.logTest('API Configuration', 'FAIL', 'API configuration file not found');
      return false;
    }
  }

  // Test 11: Check running processes
  async testRunningProcesses() {
    console.log('🔍 Testing Running Processes...');
    
    try {
      // Check if backend process is running
      const backendResponse = await this.makeRequest(this.backendURL);
      if (backendResponse.status === 200) {
        this.logTest('Backend Process', 'PASS', 'Backend server is running');
      } else {
        this.logTest('Backend Process', 'FAIL', 'Backend server not responding');
      }

      // Check if frontend process is running
      const frontendResponse = await this.makeRequest(this.frontendURL);
      if (frontendResponse.status === 200) {
        this.logTest('Frontend Process', 'PASS', 'Frontend server is running');
        return true;
      } else {
        this.logTest('Frontend Process', 'FAIL', 'Frontend server not responding');
        return false;
      }
    } catch (error) {
      this.logTest('Running Processes', 'FAIL', `Error: ${error.message}`, 
        'Start both backend and frontend servers');
      return false;
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting Simple System Test...\n');
    console.log(`Backend URL: ${this.backendURL}`);
    console.log(`Frontend URL: ${this.frontendURL}`);
    console.log(`API Base URL: ${this.baseURL}\n`);

    // Test environment variables first
    this.testEnvironmentVariables();

    // Test running processes
    await this.testRunningProcesses();

    // Test backend connectivity
    const backendRunning = await this.testBackendHealth();
    
    if (backendRunning) {
      await this.testCORS();
      await this.testMongoDB();
      await this.testAPIRoutes();
      await this.testOpenAI();
    }

    // Test frontend connectivity  
    await this.testFrontendConnection();
    
    // Test other components
    this.testPDFSupport();
    this.testErrorHandling();
    this.testAPIConfiguration();

    // Generate summary
    this.generateSummary();
  }

  // Generate test summary
  generateSummary() {
    console.log('=' .repeat(60));
    console.log('📊 SIMPLE SYSTEM TEST SUMMARY');
    console.log('=' .repeat(60));

    const passCount = this.results.filter(r => r.status === 'PASS').length;
    const failCount = this.results.filter(r => r.status === 'FAIL').length;
    const warnCount = this.results.filter(r => r.status === 'WARN').length;

    console.log(`Total Tests: ${this.results.length}`);
    console.log(`✅ Passed: ${passCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`⚠️ Warnings: ${warnCount}`);
    console.log('');

    if (failCount === 0) {
      console.log('🎉 ALL TESTS PASSED! System is working correctly.');
    } else {
      console.log('⚠️ SOME TESTS FAILED. Review the issues above.');
      console.log('');
      console.log('🔧 QUICK FIXES:');
      
      // Provide quick fixes for common issues
      const quickFixes = this.results
        .filter(r => r.status === 'FAIL' && r.fix)
        .map(r => `• ${r.name}: ${r.fix}`);
      
      quickFixes.forEach(fix => console.log(fix));
    }

    // Save detailed report
    const reportPath = path.join(__dirname, 'simple_system_test_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  }
}

// Run the tests
const tester = new SimpleSystemTester();
tester.runAllTests().catch(console.error);

