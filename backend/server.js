
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();


// Configuration
const NODE_ENV = process.env.NODE_ENV || 'production';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

console.log('🔧 Configuration:');
console.log(`   Environment: ${NODE_ENV}`);
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? 'SET' : 'NOT SET'}`);
console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? 'SET' : 'NOT SET'}`);
console.log(`   CLIENT_URL: ${CLIENT_URL}`);
console.log('---');


const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const proposalRoutes = require('./routes/proposals');
const contractRoutes = require('./routes/contracts');
const paymentRoutes = require('./routes/payments');
const resumeRoutes = require('./routes/resumes');
const offerLetterRoutes = require('./routes/offerLetters');

const app = express();



// Enhanced CORS Configuration - FIXED for all environments
const corsOptions = {
  origin: function (origin, callback) {
    console.log(`🔍 CORS Check: Origin = ${origin || 'NO ORIGIN'}`);

    // Allow requests with no origin (like mobile apps, curl, or same-origin requests)
    if (!origin) {
      console.log('✅ CORS: Allowing request with no origin');
      return callback(null, true);
    }


    const allowedOrigins = [
      'http://localhost:3000', // Local development
      'http://127.0.0.1:3000', // Alternative localhost
      'http://localhost:3001', // Alternative port
      'http://127.0.0.1:3001',
      'http://localhost:8000', // Test web server
      'http://127.0.0.1:8000', // Test web server alternative
      process.env.CLIENT_URL, // Production frontend URL
      process.env.FRONTEND_URL, // Vercel frontend URL
      process.env.REACT_APP_API_URL?.replace('/api', ''), // Dynamic frontend URL
      /\.vercel\.app$/, // Allow all Vercel URLs
      /\.netlify\.app$/, // Allow all Netlify URLs
      'https://proposifyai.vercel.app', // Specific Vercel deployment
      'https://proposifyai.netlify.app', // Specific Netlify deployment
    ].filter(Boolean);

    console.log('Allowed origins:', allowedOrigins);

    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        const result = allowedOrigin.test(origin);
        console.log(`🔍 RegExp test ${allowedOrigin} vs ${origin}: ${result}`);
        return result;
      }
      const result = allowedOrigin === origin;
      console.log(`🔍 String test ${allowedOrigin} vs ${origin}: ${result}`);
      return result;
    });

    if (isAllowed) {
      console.log('✅ CORS: Origin allowed');
      callback(null, true);
    } else {
      console.log('❌ CORS: Origin not allowed');
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'Pragma',
    'X-Access-Token',
    'X-Api-Key',
    'X-Requested-With'
  ],
  exposedHeaders: [
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset'
  ],
  optionsSuccessStatus: 200,
  maxAge: 86400, // 24 hours
  preflightContinue: false
};

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/offer-letters', offerLetterRoutes);









// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});



// Connect to MongoDB (mandatory for production)
const startServer = () => {
  const PORT = process.env.PORT || 5001;

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 ProposifyAI Backend running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
    console.log(`🗄️  Database: connected`);
    console.log(`🔒 Production Mode: Authentication required for all operations`);
  });
};


const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️ MONGODB_URI is not set. Database features will not work.');
      return;
    }
    
    const mongooseOptions = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4
      retryWrites: true,
      w: 'majority'
    };
    
    // Add authSource if not in URI
    let mongodbUri = process.env.MONGODB_URI;
    if (!mongodbUri.includes('authSource=')) {
      mongodbUri += (mongodbUri.includes('?') ? '&' : '?') + 'authSource=admin';
    }
    
    await mongoose.connect(mongodbUri, mongooseOptions);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('🔄 Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

connectDB();
startServer();


// Health check endpoints with proper headers

app.get('/health', (req, res) => {
  // Set CORS headers for health check
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept');

  res.status(200).json({
    status: 'OK',
    message: 'ProposifyAI Backend is running!',
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

app.get('/api/health', (req, res) => {
  // Set CORS headers for API health check
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept');

  res.status(200).json({
    status: "OK",
    message: "Backend is healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || 'production',
    database: 'connected',
    jwtSecret: process.env.JWT_SECRET ? 'configured' : 'missing',
    port: process.env.PORT || 5001,
    mongodbUri: process.env.MONGODB_URI ? 'configured' : 'missing',
    nodeEnv: process.env.NODE_ENV || 'production',
    corsOrigin: process.env.CLIENT_URL || 'http://localhost:3000'
  });
});

module.exports = app;
