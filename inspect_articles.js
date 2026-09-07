const { ARTICLES } = require('./data/articles.js');
console.log('Total articles in database:', ARTICLES.length);

ARTICLES.slice(0, 5).forEach((a, i) => {
  console.log(`\n========================================`);
  console.log(`[${i+1}] Slug: ${a.slug}`);
  console.log(`Title: ${a.title}`);
  console.log(`Body HTML Length: ${a.body_html.length}`);
  console.log(`Body Snippet:`);
  console.log(a.body_html.substring(0, 400));
});
