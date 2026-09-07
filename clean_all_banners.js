const fs = require('fs');
const path = require('path');
const { ARTICLES } = require('./data/articles.js');

console.log('Total articles in database:', ARTICLES.length);

// Clean generic thumbnail for articles that had the beehiiv banner
const DEFAULT_FALLBACK_IMAGE = "https://beehiiv-images-production.s3.amazonaws.com/uploads/asset/file/e0ed541f-7336-49b2-a1c0-c9b79b713cb9/Newsletter_Images.jpg?t=1787624037";

let modifiedCount = 0;

ARTICLES.forEach((a, idx) => {
  // 1. Check image_url
  if (
    a.image_url.includes('beehiiv_newsletter_banner') || 
    a.image_url.includes('d4aae004-e0f4-438b-9276-ece3eb950c7b') ||
    a.image_url.includes('steel_on_black')
  ) {
    console.log(`[Cover] Fixing image_url for post ${idx+1}: ${a.slug}`);
    a.image_url = DEFAULT_FALLBACK_IMAGE;
    modifiedCount++;
  }

  // 2. Ensure author_avatar is user's logo
  a.author_avatar = "assets/logo.jpg";
  a.author = "AIRA";

  // 3. Clean body_html of any steel_on_black, beehiiv_newsletter_banner, or longliveai logos/banners
  let body = a.body_html;
  
  // Remove picture/anchor blocks containing the banner or steel_on_black
  body = body.replace(/<div[^>]*class=["\']section-image-box["\'][^>]*>\s*<img[^>]*steel_on_black[^>]*>\s*<\/div>/gi, '');
  body = body.replace(/<div[^>]*class=["\'][^"\']*section-image-box[^"\']*["\'][^>]*>\s*<img[^>]*(?:beehiiv_newsletter_banner|d4aae004-e0f4-438b-9276-ece3eb950c7b)[^>]*>\s*<\/div>/gi, '');
  body = body.replace(/<picture[^>]*>(?:(?!<\/picture>).)*?(?:steel_on_black|beehiiv_newsletter_banner|d4aae004-e0f4-438b-9276-ece3eb950c7b).*?<\/picture>/gis, '');
  body = body.replace(/<a[^>]*>(?:(?!<\/a>).)*?(?:steel_on_black|beehiiv_newsletter_banner|d4aae004-e0f4-438b-9276-ece3eb950c7b).*?<\/a>/gis, '');
  body = body.replace(/<img[^>]*steel_on_black[^>]*>/gi, '');
  body = body.replace(/<img[^>]*(?:beehiiv_newsletter_banner|d4aae004-e0f4-438b-9276-ece3eb950c7b)[^>]*>/gi, '');
  
  // Remove any remaining mentions of longliveai
  body = body.replace(/Long Live AI/gi, 'AIRA');
  body = body.replace(/longliveai/gi, 'AIRA');
  body = body.replace(/@longliveai/gi, '@AIRA');
  body = body.replace(/https:\/\/AIRA\.beehiiv\.com[^\s"']*/gi, '#/');

  a.body_html = body;
});

console.log(`Modified ${modifiedCount} articles.`);

// Write updated articles back to d:\newzletr\data\articles.js
const updatedContent = "/**\n * AIRA Newsletter Articles Database\n * Complete 100% Verbatim Collection with AIRA Branding (Zero LongLiveAI Banners)\n */\n\nconst ARTICLES = " + JSON.stringify(ARTICLES, null, 2) + ";\n\nif (typeof module !== 'undefined' && module.exports) {\n  module.exports = { ARTICLES };\n}\n";

fs.writeFileSync(path.join(__dirname, 'data', 'articles.js'), updatedContent, 'utf-8');
console.log('Successfully cleaned all articles and saved to data/articles.js!');
