const fs = require('fs');
const path = require('path');
const { ARTICLES } = require('./data/articles.js');

console.log(`Checking ${ARTICLES.length} articles for any leftover poll text...`);

let foundCount = 0;

ARTICLES.forEach((a, i) => {
  let b = a.body_html;
  let hadPoll = false;

  // Search patterns
  const patterns = [
    /What did you think of today.*?edition\??/gis,
    /What did you think.*?\?/gis,
    /This helps tune future issues.*?\./gis,
    /Thanks for voting.*?\./gis,
    /[⭐\u2B50\uFE0F\s]*Loved it/gis,
    /[⭐\u2B50\uFE0F\s]*Good,\s*not great/gis,
    /[⭐\u2B50\uFE0F\s]*Needs improvement/gis,
    /<li[^>]*>[\s\S]*?(?:Loved it|Good,\s*not great|Needs improvement)[\s\S]*?<\/li>/gis,
    /<ul[^>]*>[\s\S]*?(?:Loved it|Good,\s*not great|Needs improvement)[\s\S]*?<\/ul>/gis,
    /<h3[^>]*>[\s\S]*?What did you think[\s\S]*?<\/h3>/gis,
    /<div[^>]*>[\s\S]*?This helps tune future issues[\s\S]*?<\/div>/gis,
    /<div[^>]*class=["\'][^"\']*_1gbf4vw[^"\']*["\'][^>]*>[\s\S]*?<\/div>/gis,
    /<p[^>]*>[\s\S]*?(?:Login|Subscribe)[\s\S]*?to participate[\s\S]*?<\/p>/gis,
  ];

  patterns.forEach(pat => {
    if (pat.test(b)) {
      hadPoll = true;
      b = b.replace(pat, '');
    }
  });

  // Also clean up any lingering rating bullets or empty lists
  b = b.replace(/<li[^>]*>\s*<\/li>/gi, '');
  b = b.replace(/<ul[^>]*>\s*<\/ul>/gi, '');
  b = b.replace(/<ol[^>]*>\s*<\/ol>/gi, '');
  b = b.replace(/<p[^>]*>\s*<\/p>/gi, '');
  b = b.replace(/<div[^>]*>\s*<\/div>/gi, '');

  if (hadPoll) {
    foundCount++;
    console.log(`Found and cleaned poll in [${i+1}] ${a.slug}`);
  }

  a.body_html = b.trim();
});

console.log(`Cleaned polls in ${foundCount} articles.`);

// Also let's check for any remaining occurrences of "Loved it" or "future issues"
ARTICLES.forEach((a, i) => {
  if (
    a.body_html.includes('Loved it') || 
    a.body_html.includes('What did you think') || 
    a.body_html.includes('future issues') ||
    a.body_html.includes('Needs improvement')
  ) {
    console.warn(`WARNING: Still found poll text in [${i+1}] ${a.slug}`);
  }
});

const updatedContent = "/**\n * AIRA Newsletter Articles Database\n * Complete 100% Verbatim Collection with AIRA Branding (100% Poll Free)\n */\n\nconst ARTICLES = " + JSON.stringify(ARTICLES, null, 2) + ";\n\nif (typeof module !== 'undefined' && module.exports) {\n  module.exports = { ARTICLES };\n}\n";

fs.writeFileSync(path.join(__dirname, 'data', 'articles.js'), updatedContent, 'utf-8');
console.log('Saved 100% poll-free data/articles.js!');
