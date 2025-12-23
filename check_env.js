require('dotenv').config({ path: './backend/.env' });

console.log('Checking MONGODB_URI...');
if (process.env.MONGODB_URI) {
  console.log('MONGODB_URI is SET.');
  if (process.env.MONGODB_URI.includes('localhost') || process.env.MONGODB_URI.includes('127.0.0.1')) {
    console.log('It appears to be a LOCAL URI.');
  } else {
    console.log('It appears to be a REMOTE URI.');
  }
} else {
  console.log('MONGODB_URI is NOT SET.');
}

