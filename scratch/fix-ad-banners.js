const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replace .ad-banner-content-wrap { ... } before .ad-badge-circle
css = css.replace(
  /\.ad-banner-content-wrap\s*\{[^}]*display:\s*flex;[^}]*min-width:\s*0;\s*\}/m,
  `.ad-banner-content-wrap {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: flex-start;\n  gap: 4px;\n  min-width: 0;\n  flex: 1;\n}`
);

// In media query (max-width: 768px)
css = css.replace(
  /\.ad-banner-content-wrap\s*\{\s*align-items:\s*flex-start;\s*gap:\s*12px;\s*\}/m,
  `.ad-banner-content-wrap {\n    display: flex;\n    flex-direction: column;\n    align-items: flex-start;\n    justify-content: flex-start;\n    gap: 4px;\n    width: 100%;\n    min-width: 0;\n  }`
);

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Regex replace executed successfully.');
