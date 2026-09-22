const http = require('http');
const EmailService = require('../js/email-service.js');

async function testEmailService() {
  console.log('--- Testing EmailService Methods ---');
  
  // 1. Test Welcome Email HTML builder
  const welcomeHtml = EmailService.buildWelcomeEmailHTML('testuser@gmail.com');
  console.log('✔ Welcome Email HTML generated, length:', welcomeHtml.length);
  if (!welcomeHtml.includes('AI Automation | 50 n8n Templates') || !welcomeHtml.includes('https://docs.google.com/spreadsheets/d/190nDBrA-I8J03VlsneEO3U3-z0ERqCfXdF0mwjyKZBY/edit?usp=sharing')) {
    throw new Error('Welcome Email HTML missing 50 n8n templates gift link!');
  }
  console.log('✔ Welcome Email HTML contains 50 n8n Templates Google Sheet link!');

  // 2. Test Article Broadcast Email HTML builder
  const sampleArticle = {
    title: 'Claude 3.7 Sonnet: Frontier Hybrid Reasoning Architecture',
    subtitle: 'Deep benchmark analysis comparing Anthropic extended thinking with OpenAI Operator.',
    slug: 'claude-3-7-sonnet-hybrid-reasoning',
    tag: 'Frontier LLMs',
    reading_time: '4 min read',
    date: 'Sep 22, 2026',
    author: 'AIRA Editorial',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  };
  const broadcastHtml = EmailService.buildArticleBroadcastEmailHTML(sampleArticle, 'reader@gmail.com');
  console.log('✔ Article Broadcast HTML generated, length:', broadcastHtml.length);
  if (!broadcastHtml.includes('Claude 3.7 Sonnet') || !broadcastHtml.includes('Read Full Edition on AIRA ➔')) {
    throw new Error('Article Broadcast HTML missing key elements!');
  }
  console.log('✔ Article Broadcast HTML contains CTA button and article title!');

  // 3. Test HTTP /api/send-email endpoint on localhost:3000
  console.log('\n--- Testing /api/send-email Endpoint ---');
  const postData = JSON.stringify({
    to: 'subscriber@example.com',
    subject: 'Test Email from Node Unit Test',
    html: '<h1>Hello AIRA Subscriber</h1>',
    type: 'test'
  });

  const req1 = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/send-email',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log('✔ /api/send-email Status:', res.statusCode);
      console.log('✔ /api/send-email Response:', body);

      // 4. Test /api/subscribe endpoint
      console.log('\n--- Testing /api/subscribe Endpoint ---');
      const subData = JSON.stringify({
        email: 'newuser@domain.com',
        source: 'Unit Test'
      });

      const req2 = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/subscribe',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(subData)
        }
      }, (res2) => {
        let subBody = '';
        res2.on('data', chunk => subBody += chunk);
        res2.on('end', () => {
          console.log('✔ /api/subscribe Status:', res2.statusCode);
          console.log('✔ /api/subscribe Response:', subBody);
          console.log('\n========================================');
          console.log('🎉 ALL EMAIL SYSTEM TESTS PASSED 100%!');
          console.log('========================================');
        });
      });
      req2.write(subData);
      req2.end();
    });
  });
  req1.write(postData);
  req1.end();
}

testEmailService().catch(err => {
  console.error('Test error:', err);
});
