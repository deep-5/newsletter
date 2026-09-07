const fs = require('fs');
const path = require('path');
const { ARTICLES } = require('./data/articles.js');

console.log(`Processing ${ARTICLES.length} articles to remove poll widgets...`);

ARTICLES.forEach((a, idx) => {
  let b = a.body_html;
  
  // Remove any poll containers from Beehiiv
  b = b.replace(/<div[^>]*class=["\'][^"\']*_1gbf4vw[^"\']*["\'][^>]*>.*?<\/div>\s*<\/div>\s*<\/div>/gis, '');
  b = b.replace(/<div[^>]*>.*?What did you think of today.*?<\/div>\s*<\/div>/gis, '');
  b = b.replace(/<h3[^>]*>What did you think of today.*?<\/h3>/gis, '');
  b = b.replace(/<div[^>]*>This helps tune future issues.*?<\/div>/gis, '');
  b = b.replace(/<ul[^>]*>\s*<li[^>]*><a[^>]*>⭐⭐⭐⭐⭐ Loved it.*?<\/ul>/gis, '');
  b = b.replace(/<p[^>]*>.*?Login.*?or.*?Subscribe.*?to participate.*?<\/p>/gis, '');
  
  // Remove direct text patterns if any
  b = b.replace(/What did you think of today(?:&#x27;|')s edition\??/gi, '');
  b = b.replace(/This helps tune future issues\.\s*Thanks for voting\./gi, '');
  b = b.replace(/⭐⭐⭐⭐⭐\s*Loved it/gi, '');
  b = b.replace(/⭐⭐⭐\s*Good,\s*not great/gi, '');
  b = b.replace(/⭐\s*Needs improvement/gi, '');
  b = b.replace(/Login\s+or\s+Subscribe\s+to\s+participate/gi, '');
  
  // Remove any leftover empty lists/paragraphs
  b = b.replace(/<ul[^>]*>\s*<\/ul>/gi, '');
  b = b.replace(/<p[^>]*>\s*<\/p>/gi, '');
  
  a.body_html = b.trim();
});

// Save cleaned articles
const updatedArticlesContent = "/**\n * AIRA Newsletter Articles Database\n * Complete 100% Verbatim Collection with AIRA Branding (Zero Polls)\n */\n\nconst ARTICLES = " + JSON.stringify(ARTICLES, null, 2) + ";\n\nif (typeof module !== 'undefined' && module.exports) {\n  module.exports = { ARTICLES };\n}\n";

fs.writeFileSync(path.join(__dirname, 'data', 'articles.js'), updatedArticlesContent, 'utf-8');
console.log('Cleaned all poll references from data/articles.js!');
