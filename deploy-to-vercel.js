const { execSync } = require('child_process');

console.log('🚀 Deploying to Vercel...');

try {
    execSync('npx vercel --prod', { stdio: 'inherit' });
    console.log('✅ Deployed to Vercel successfully!');
} catch (error) {
    console.log('❌ Vercel deployment failed. Please install Vercel CLI: npm i -g vercel');
    console.log('Then run: vercel --prod');
}
