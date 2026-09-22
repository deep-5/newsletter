const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
let code = fs.readFileSync(appJsPath, 'utf8');

const targetSection = `              <!-- Sidebar Ad 1: Master AI Prompts Vault -->
              <div class="ad-sidebar-card">
                <span class="ad-tag-label">FEATURED RESOURCE</span>
                <h3 class="ad-sidebar-title">Master AI Prompts Vault</h3>
                <p class="ad-sidebar-desc">100+ battle-tested prompts for reasoning, coding, writing & automation.</p>
                <a href="#/prompts" class="ad-pill-btn">
                  <span>Open Prompts Vault</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>

              

          <!-- Centered Numbered Pagination Bar Across Full Container Width -->`;

const replacementSection = `              <!-- Sidebar Ad 1: Master AI Prompts Vault -->
              <div class="ad-sidebar-card">
                <span class="ad-tag-label">FEATURED RESOURCE</span>
                <h3 class="ad-sidebar-title">Master AI Prompts Vault</h3>
                <p class="ad-sidebar-desc">100+ battle-tested prompts for reasoning, coding, writing & automation.</p>
                <a href="#/prompts" class="ad-pill-btn">
                  <span>Open Prompts Vault</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>

              <!-- Sidebar Ad 2: 50 n8n Templates -->
              <div class="ad-sidebar-card">
                <span class="ad-tag-label">FREE BONUS</span>
                <h3 class="ad-sidebar-title">50 n8n Templates</h3>
                <p class="ad-sidebar-desc">Get top AI news, breakthroughs + instant access to AI Automation | 50 n8n Templates.</p>
                <button type="button" class="ad-pill-btn" onclick="document.getElementById('subscribe-modal').classList.add('active'); document.body.style.overflow='hidden';">
                  <span>Get 50 Templates</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>

              <!-- Sidebar Ad 3: Advertise with AIRA -->
              <div class="ad-sidebar-card" style="background: linear-gradient(145deg, #ECFDF5 0%, #D1FAE5 60%, #CCFBF1 100%);">
                <span class="ad-tag-label">SPONSORSHIP</span>
                <h3 class="ad-sidebar-title">Partner with AIRA</h3>
                <p class="ad-sidebar-desc">Put your brand in front of 500+ AI builders, founders, and engineers.</p>
                <a href="#/advertise" class="ad-pill-btn">
                  <span>View Media Kit</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>

            </div>
          </div>

          <!-- Centered Numbered Pagination Bar Across Full Container Width -->`;

code = code.replace(targetSection, replacementSection);
fs.writeFileSync(appJsPath, code, 'utf8');
console.log('Successfully fixed sidebar in js/app.js!');
