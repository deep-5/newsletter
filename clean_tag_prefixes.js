const fs = require('fs');
const path = require('path');
const { ARTICLES } = require('./data/articles.js');

ARTICLES.forEach(a => {
  let b = a.body_html;
  // Clean hanging prefix characters
  b = b.replace(/^[a-zA-Z0-9_\-\s]+">/gm, '');
  b = b.replace(/dream-post-content-doc">\s*/g, '');
  b = b.replace(/<div class="dream-post-content-imageBlock _2fealp0"\s*>\s*<\/div>/g, '');
  b = b.replace(/<div[^>]*class=["\'][^"\']*_2fealp0[^"\']*["\'][^>]*>\s*<\/div>/g, '');
  b = b.replace(/<div[^>]*class=["\'][^"\']*_7pt7ks0[^"\']*["\'][^>]*>\s*<div[^>]*class=["\'][^"\']*_7pt7ks1[^"\']*["\'][^>]*>\s*<\/div>\s*<\/div>/g, '<hr style="border: none; border-top: 1px solid var(--color-border); margin: 36px 0;" />');
  a.body_html = b.trim();
});

const updatedContent = "/**\n * AIRA Newsletter Articles Database\n * Complete 100% Verbatim Collection with AIRA Branding (56 Full Editions)\n */\n\nconst ARTICLES = " + JSON.stringify(ARTICLES, null, 2) + ";\n\nif (typeof module !== 'undefined' && module.exports) {\n  module.exports = { ARTICLES };\n}\n";

fs.writeFileSync(path.join(__dirname, 'data', 'articles.js'), updatedContent, 'utf-8');
console.log('Cleaned hanging tag prefixes across all articles!');
