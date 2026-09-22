const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain'
};

const sendEmailHandler = require('../api/send-email.js');
const subscribeHandler = require('../api/subscribe.js');

const server = http.createServer((req, res) => {
  const parsedUrl = req.url.split('?')[0];

  // Helper for json response
  res.status = function(code) {
    this.statusCode = code;
    return this;
  };
  res.json = function(data) {
    this.writeHead(this.statusCode || 200, { 'Content-Type': 'application/json' });
    this.end(JSON.stringify(data));
  };

  // 1. API Routes
  if (parsedUrl === '/api/send-email' || parsedUrl === '/api/subscribe') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        req.body = body ? JSON.parse(body) : {};
      } catch (e) {
        req.body = {};
      }
      if (parsedUrl === '/api/send-email') {
        sendEmailHandler(req, res);
      } else {
        subscribeHandler(req, res);
      }
    });
    return;
  }

  // 2. Static file serving
  let filePath = path.join(__dirname, '..', parsedUrl === '/' ? 'index.html' : parsedUrl);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, '..', 'index.html');
  }

  const ext = path.extname(filePath);
  const mime = mimeTypes[ext] || 'text/plain';

  res.writeHead(200, {
    'Content-Type': mime,
    'Access-Control-Allow-Origin': '*'
  });

  fs.createReadStream(filePath).pipe(res);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`⚡ AIRA Dev & Email Server listening on http://localhost:${PORT}`);
});
