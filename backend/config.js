// Backend Configuration
module.exports = {
  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/proposifyai',
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-production-2024',
  
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5001,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  
  // OpenAI Configuration (optional for fallback mode)
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
  
  // CORS Configuration
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  REACT_APP_API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  
  // Rate Limiting
  OPENAI_TIMEOUT: parseInt(process.env.OPENAI_TIMEOUT) || 30000,
  OPENAI_MAX_RETRIES: parseInt(process.env.OPENAI_MAX_RETRIES) || 3
};
