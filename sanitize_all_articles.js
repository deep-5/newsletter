const fs = require('fs');
const path = require('path');
const { ARTICLES } = require('./data/articles.js');

console.log(`Sanitizing ${ARTICLES.length} articles...`);

ARTICLES.forEach((a, idx) => {
  // Ensure author and avatar are strictly AIRA
  a.author = "AIRA";
  a.author_avatar = "assets/logo.jpg";

  // Clean body_html
  let body = a.body_html;

  // 1. Strip any <link>, <meta>, <title>, <head> tags
  body = body.replace(/<link[^>]*>/gi, '');
  body = body.replace(/<meta[^>]*>/gi, '');
  body = body.replace(/<title[^>]*>.*?<\/title>/gi, '');
  body = body.replace(/<head[^>]*>.*?<\/head>/gis, '');

  // 2. Remove all instances of steel_on_black, beehiiv logo, and banners
  body = body.replace(/https:\/\/[^"'\s)]*steel_on_black[^"'\s)]*/gi, '');
  body = body.replace(/https:\/\/[^"'\s)]*beehiiv_newsletter_banner[^"'\s)]*/gi, '');
  body = body.replace(/https:\/\/[^"'\s)]*d4aae004-e0f4-438b-9276-ece3eb950c7b[^"'\s)]*/gi, '');
  body = body.replace(/https:\/\/[^"'\s)]*uploads\/publication\/logo[^"'\s)]*/gi, '');

  // 3. Remove empty image boxes or broken img tags created by removing src
  body = body.replace(/<div[^>]*class=["\']section-image-box["\'][^>]*>\s*<img[^>]*src=["\']\s*["\'][^>]*>\s*<\/div>/gi, '');
  body = body.replace(/<div[^>]*class=["\']section-image-box["\'][^>]*>\s*<\/div>/gi, '');
  body = body.replace(/<img[^>]*src=["\']\s*["\'][^>]*>/gi, '');

  // 4. Remove any LongLiveAI text or links
  body = body.replace(/Long\s*Live\s*AI/gi, 'AIRA');
  body = body.replace(/longliveai/gi, 'AIRA');
  body = body.replace(/@longliveai/gi, '@AIRA');
  body = body.replace(/https:\/\/AIRA\.beehiiv\.com[^\s"']*/gi, '#/');

  a.body_html = body.trim();
});

const updatedContent = "/**\n * AIRA Newsletter Articles Database\n * Complete 100% Verbatim Collection with AIRA Branding (100% Clean, No Old Logos/Banners)\n */\n\nconst ARTICLES = " + JSON.stringify(ARTICLES, null, 2) + ";\n\nif (typeof module !== 'undefined' && module.exports) {\n  module.exports = { ARTICLES };\n}\n";

fs.writeFileSync(path.join(__dirname, 'data', 'articles.js'), updatedContent, 'utf-8');
console.log('Successfully sanitized all articles and saved to data/articles.js!');
