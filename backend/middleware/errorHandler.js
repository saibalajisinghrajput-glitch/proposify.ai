// Comprehensive Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  console.error('🔴 ERROR CAUGHT:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    user: req.user?.id,
    timestamp: new Date().toISOString()
  });

  // MongoDB validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.keys(err.errors).map(field => ({
      field,
      message: err.errors[field].message,
      value: err.errors[field].value
    }));
    
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Invalid data provided',
      details: errors,
      timestamp: new Date().toISOString()
    });
  }

  // MongoDB cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Cast Error',
      message: 'Invalid ID format',
      field: err.path,
      value: err.value,
      timestamp: new Date().toISOString()
    });
  }

  // MongoDB duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      error: 'Duplicate Error',
      message: `${field} already exists`,
      field,
      timestamp: new Date().toISOString()
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Authentication Error',
      message: 'Invalid token',
      timestamp: new Date().toISOString()
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Authentication Error',
      message: 'Token expired',
      timestamp: new Date().toISOString()
    });
  }

  // Rate limit errors
  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      error: 'Rate Limit Error',
      message: 'Too many requests',
      retryAfter: err.retryAfter,
      timestamp: new Date().toISOString()
    });
  }

  // OpenAI API errors
  if (err.status === 429 || err.status === 503) {
    return res.status(429).json({
      success: false,
      error: 'AI Service Unavailable',
      message: 'AI service temporarily unavailable',
      retryAfter: 60,
      timestamp: new Date().toISOString()
    });
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: 'File Too Large',
      message: 'File size exceeds limit',
      maxSize: err.limit,
      timestamp: new Date().toISOString()
    });
  }

  // Network errors
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      error: 'Service Unavailable',
      message: 'Required service not available',
      timestamp: new Date().toISOString()
    });
  }

  // Default server error
  const status = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Internal server error';

  res.status(status).json({
    success: false,
    error: 'Server Error',
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    }),
    timestamp: new Date().toISOString(),
    requestId: req.id || 'unknown'
  });
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Custom error classes
class ValidationError extends Error {
  constructor(message, field, value) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
    this.status = 400;
  }
}

class AuthenticationError extends Error {
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
    this.status = 401;
  }
}

class AuthorizationError extends Error {
  constructor(message = 'Access denied') {
    super(message);
    this.name = 'AuthorizationError';
    this.status = 403;
  }
}

class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

class ConflictError extends Error {
  constructor(message = 'Resource conflict') {
    super(message);
    this.name = 'ConflictError';
    this.status = 409;
  }
}

class ServiceUnavailableError extends Error {
  constructor(message = 'Service temporarily unavailable') {
    super(message);
    this.name = 'ServiceUnavailableError';
    this.status = 503;
  }
}

module.exports = {
  errorHandler,
  asyncHandler,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  ServiceUnavailableError
};

