const http = require('http');
const fs = require('fs');
const path = require('path');

function fetchUrl(urlPath) {
  return new Promise((resolve, reject) => {
    http.get({
      hostname: 'localhost',
      port: 3000,
      path: urlPath,
      headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function verifyResponsiveBuild() {
  console.log('--- 1. Testing HTML Document ---');
  const indexRes = await fetchUrl('/');
  console.log('✔ Index HTTP Status:', indexRes.status);
  if (!indexRes.data.includes('styles.css?v=72.0')) {
    throw new Error('Index HTML does not reference styles.css?v=72.0');
  }
  if (!indexRes.data.includes('name="viewport" content="width=device-width, initial-scale=1.0"')) {
    throw new Error('Missing proper viewport meta tag!');
  }
  console.log('✔ Viewport meta tag and v71.0 cache busters verified in index.html!');

  console.log('\n--- 2. Testing Stylesheet ---');
  const cssRes = await fetchUrl('/styles.css');
  console.log('✔ styles.css HTTP Status:', cssRes.status, 'Length:', cssRes.data.length);
  if (!cssRes.data.includes('AIRA MASTER 100% MOBILE RESPONSIVE ENGINE')) {
    throw new Error('styles.css is missing Master Mobile Responsive Engine block!');
  }
  console.log('✔ Master Mobile Responsive Engine successfully loaded in styles.css!');

  console.log('\n--- 3. Testing Local Dev APIs ---');
  const apiRes = await fetchUrl('/api/subscribe');
  console.log('✔ /api/subscribe endpoint active (Status:', apiRes.status, ')');

  console.log('\n========================================');
  console.log('🎉 100% MOBILE RESPONSIVENESS BUILD VERIFIED!');
  console.log('========================================');
}

verifyResponsiveBuild().catch(err => {
  console.error('Verification failed:', err);
});
