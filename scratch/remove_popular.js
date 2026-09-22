const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
let code = fs.readFileSync(appJsPath, 'utf8');

// Remove Popular Posts widget HTML
const popularWidgetPattern = /<!-- Popular Posts Widget[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
code = code.replace(popularWidgetPattern, '');

// Also clean up any lingering references in renderHomePage layout comment
code = code.replace(
  '<!-- 2-Column Main Layout (Left: 8 Articles Grid | Right: Sidebar Ads & Popular Posts) -->',
  '<!-- 2-Column Main Layout (Left: Articles Grid | Right: Sidebar Widgets & Resources) -->'
);

code = code.replace(
  '<!-- Right Column: Sidebar Ads & Popular Posts -->',
  '<!-- Right Column: Sidebar Widgets & Resources -->'
);

fs.writeFileSync(appJsPath, code, 'utf8');
console.log('Successfully removed Popular Posts widget from js/app.js!');
