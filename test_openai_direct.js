// Direct test of OpenAI configuration
require('dotenv').config({ path: './backend/.env' });

console.log('🔍 Environment Check:');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET (length: ' + process.env.OPENAI_API_KEY.length + ')' : 'NOT SET');
console.log('API Key starts with sk-:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.startsWith('sk-') : false);
console.log('');

const { getStatus } = require('./backend/utils/openai');

const status = getStatus();
console.log('📊 OpenAI Status:');
console.log(JSON.stringify(status, null, 2));

if (status.openaiConfigured) {
  console.log('\n✅ SUCCESS: OpenAI is properly configured!');
  console.log('🚀 AI generation should now work with real OpenAI API');
} else {
  console.log('\n❌ ISSUE: OpenAI is not configured properly');
}
