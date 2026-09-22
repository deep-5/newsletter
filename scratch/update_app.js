const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
let code = fs.readFileSync(appJsPath, 'utf8');

// 1. Update Sidebar Ad in renderHomePage
code = code.replace(
  /<div class="ad-sidebar-card">\s*<span class="ad-tag-label">VIP COMMUNITY<\/span>\s*<h3 class="ad-sidebar-title">Join 500\+ AI Builders<\/h3>\s*<p class="ad-sidebar-desc">[\s\S]*?<\/p>\s*<button type="button" class="ad-pill-btn" onclick="document\.getElementById\('subscribe-modal'\)\.classList\.add\('active'\); document\.body\.style\.overflow='hidden';">\s*<span>Join VIP Free<\/span>/,
  `<div class="ad-sidebar-card">
                <span class="ad-tag-label">FREE BONUS</span>
                <h3 class="ad-sidebar-title">50 n8n Templates</h3>
                <p class="ad-sidebar-desc">Get top AI news, breakthroughs + instant access to AI Automation | 50 n8n Templates.</p>
                <button type="button" class="ad-pill-btn" onclick="document.getElementById('subscribe-modal').classList.add('active'); document.body.style.overflow='hidden';">
                  <span>Get 50 Templates</span>`
);

// Also handle if previous text was present
code = code.replace(
  'Get top AI news, breakthroughs + instant access to the Top 100 Production AI Prompts.',
  'Get top AI news, breakthroughs + instant access to AI Automation | 50 n8n Templates.'
);

// 2. Update Article Reader bottom card
code = code.replace(
  '<button type="submit" class="sub-dark-btn">Subscribe & Get Prompts 🎁</button>',
  '<button type="submit" class="sub-dark-btn">Subscribe & Get 50 Templates 🎁</button>'
);

// 3. Update handleSubscribeSubmit toast
code = code.replace(
  "showToast('🎉 Welcome to AIRA! Opening Top 100 AI Prompts...');",
  "showToast('🎉 Welcome to AIRA! Opening 50 n8n Templates...');"
);

fs.writeFileSync(appJsPath, code, 'utf8');
console.log('Successfully updated js/app.js with 50 n8n templates copy!');
