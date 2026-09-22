const fs = require('fs');
const path = require('path');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
const lines = appJs.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('renderBookmarks') || line.includes('renderPostPage') || line.includes('updateArticlesGrid') || line.includes('main-articles-grid')) {
    console.log(`Line ${idx + 1}: ${line.trim().substring(0, 100)}`);
  }
});
