




// API Configuration for Frontend - ENHANCED WITH ERROR HANDLING
import axios from 'axios';

const API_CONFIG = {
  // Development - Local backend
  development: {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
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

    // Request interceptor for debugging
    instance.interceptors.request.use(
      (request) => {
        console.log(`🔄 API Request: ${request.method?.toUpperCase()} ${request.url}`);
        console.log('Request data:', request.data);
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

