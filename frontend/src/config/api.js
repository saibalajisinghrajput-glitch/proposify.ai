




// API Configuration for Frontend - ENHANCED WITH ERROR HANDLING
import axios from 'axios';

const API_CONFIG = {
  // Development - Local backend
  development: {
    BASE_URL: process.env.REACT_APP_API_URL || 'https://proposify-ai-6.onrender.com/api',
    TIMEOUT: 60000, // Increased timeout to 60 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
  },

  // Production - Backend API URL
  production: {
    BASE_URL: process.env.REACT_APP_API_URL || 'https://proposifyai-backend.onrender.com/api',
    TIMEOUT: 60000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 2000
  },

  // Get current environment
  getCurrentConfig() {
    const env = process.env.NODE_ENV || process.env.REACT_APP_ENVIRONMENT || 'development';
    return this[env] || this.development;
  },

  // Get base URL for API calls
  getBaseURL() {
    return this.getCurrentConfig().BASE_URL;
  },

  // Enhanced axios instance with comprehensive error handling
  createAxiosInstance() {
    const config = this.getCurrentConfig();

    const instance = axios.create({
      baseURL: config.BASE_URL,
      timeout: config.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    // Mock Data for Client-Side Simulation
    const processMockRequest = async (config) => {
      console.log('🎭 Processing Mock Request for:', config.url);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 1. Auth: Login
      if (config.url.includes('/auth/login')) {
        const { email } = JSON.parse(config.data);
        return {
          status: 200,
          data: {
            token: 'mock-jwt-token-12345',
            user: {
              id: 'mock-user-id',
              name: 'Demo User',
              email: email || 'demo@example.com'
            }
          }
        };
      }

      // 2. Auth: Signup
      if (config.url.includes('/auth/signup')) {
        const { name, email } = JSON.parse(config.data);
        return {
          status: 201,
          data: {
            token: 'mock-jwt-token-12345',
            user: {
              id: 'mock-user-id',
              name: name,
              email: email
            }
          }
        };
      }

      // 3. AI Generation (Resume, Offer Letter, Contract)
      if (config.url.includes('/resume/generate') || config.url.includes('/offer-letter/generate') || config.url.includes('/contract/generate')) {
        return {
          status: 200,
          data: {
            content: `
# AI Generated Document
(Simulated Content for Demo)

## Professional Summary
Highly motivated professional with a proven track record of success. Dedicated to continuous improvement and delivering high-quality results.

## Experience
- **Senior Developer** | Tech Corp | 2020 - Present
  - Led a team of 5 developers to build scalable web applications.
  - Improved system performance by 40%.
  
- **Junior Developer** | Startup Inc | 2018 - 2020
  - Developed frontend features using React.
  - Collaborated with designers to implement responsive UIs.

## Education
- **B.S. Computer Science** | University of Technology | 2018

*Note: This is a demo response generated client-side because the backend server is not connected.*
        `
          }
        };
      }

      // 4. Health Check
      if (config.url.includes('/health')) {
        return { status: 200, data: { status: 'ok', mode: 'mock' } };
      }

      return Promise.reject(new Error('Mock endpoint not found'));
    };

    // Request interceptor for debugging and Mocking
    instance.interceptors.request.use(
      async (request) => {
        console.log(`🔄 API Request: ${request.method?.toUpperCase()} ${request.url}`);

        // ENABLE MOCK MODE IF BACKEND IS UNREACHABLE
        // We act as if the interceptor "handled" the request by throwing a special error 
        // that we catch in the response interceptor, OR we can just return a promise that resolves to the mock response
        // But axios interceptors usually expect a config object returned.

        // STRATEGY: We attach a flag to the config to retry with mock if it fails?
        // Simpler: We check if we are on the live GitHub Pages site (which has no backend).
        // const isLiveDemo = window.location.hostname.includes('github.io');

        // if (isLiveDemo) {
        //    console.warn('⚠️ Running in Live Demo Mode (Client-Side Mock)');
        //    request.adapter = async (config) => {
        //      return processMockRequest(config);
        //    };
        // }

        return request;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    instance.interceptors.response.use(
      (response) => {
        console.log(`✅ API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`);
        return response;
      },
      async (error) => {
        const config = error.config || {};
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        console.error('❌ API Error Details:');
        console.error('  Status:', status);
        console.error('  Message:', message);
        console.error('  URL:', config.url);
        console.error('  Method:', config.method);

        // Enhanced error classification
        if (error.code === 'ECONNABORTED') {
          console.error('  Type: TIMEOUT - Request took too long');
          return Promise.reject(new Error('Request timeout - please try again'));
        } else if (error.code === 'ECONNREFUSED') {
          console.error('  Type: CONNECTION_REFUSED - Backend not running');
          return Promise.reject(new Error('Cannot connect to server - please check if backend is running'));
        } else if (error.code === 'ENOTFOUND') {
          console.error('  Type: DNS_ERROR - Domain not found');
          return Promise.reject(new Error('Server not found - please check the URL'));
        } else if (status === 429) {
          console.error('  Type: RATE_LIMIT - Too many requests');
          return Promise.reject(new Error('Too many requests - please wait a moment'));
        } else if (status === 500) {
          console.error('  Type: SERVER_ERROR - Internal server error');
          return Promise.reject(new Error('Server error - please try again later'));
        } else if (status === 404) {
          console.error('  Type: NOT_FOUND - Endpoint not found');
          return Promise.reject(new Error('API endpoint not found'));
        } else if (status === 403) {
          console.error('  Type: FORBIDDEN - Access denied');
          return Promise.reject(new Error('Access denied - please check your permissions'));
        } else {
          console.error('  Type: UNKNOWN_ERROR');
          return Promise.reject(new Error(`Network error: ${message}`));
        }
      }
    );

    return instance;
  },

  // Helper function to get environment
  getEnvironment() {
    return process.env.NODE_ENV || process.env.REACT_APP_ENVIRONMENT || 'development';
  },

  // Check if in production
  isProduction() {
    return this.getEnvironment() === 'production';
  },

  // Health check function
  async checkBackendHealth() {
    try {
      const response = await axios.get(`${this.getBaseURL()}/health`, {
        timeout: 5000
      });
      console.log('✅ Backend Health Check:', response.data);
      return { healthy: true, data: response.data };
    } catch (error) {
      console.error('❌ Backend Health Check Failed:', error.message);
      return { healthy: false, error: error.message };
    }
  }
};

// Create and export the axios instance
const apiClient = API_CONFIG.createAxiosInstance();
export { apiClient };
export default API_CONFIG;

