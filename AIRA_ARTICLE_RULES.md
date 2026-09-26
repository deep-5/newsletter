# 🔒 AIRA Master Article Protocol (Permanently Locked Standard)

This document is the **single source of truth** for adding, formatting, and publishing all present and future newsletter articles on **AIRA**. Every new article must strictly adhere to this locked protocol.

---

## 📝 1. 100% Exact Verbatim Source Text Match Standard (STRICTLY LOCKED)
- **Zero Paraphrasing / Zero Rewriting**: Every single sentence, headline, paragraph, bullet point, tool description, tutorial step, code snippet, and tech news item must be copied **100% word-for-word verbatim** from the source newsletter edition.
- **Zero Missing / Truncated Text**: Never cut, condense, or omit any details, specs, bullet points, sub-lists, code snippets, or takeaways.
- **Preserve Verbatim Typography**: Keep all authentic bold text (`<b>...</b>`), italics (`<i>...</i>`), code formatting (`<code>...</code>`), and quotes exactly as written in the original source.
- **Verbatim Authenticity**: AI assistant rewriting or summarizing is strictly prohibited. The content must remain 100% authentic to the source edition.

---

## 📸 2. Cover Image Standard (100% Uniform)
- **Top Hero Cover Picture**: Every single article in `data/articles.js` must use `assets/aira-banner-template-v2.jpg` (AIRA Option 2 Custom Cover Banner with real inner newsletter phone mockup).
- **Zero Variation**: All articles share this exact branded cover banner for 100% aesthetic uniformity.

---

## 🔗 3. Zero-Redirect & 100% Clean Direct Links Standard (Strictly Locked)
- **NO Third-Party Redirects**: NEVER use `go.aiplanetx.com/...` or any third-party intermediary redirect links.
- **Direct Official Websites Only**: Every tool and product link must point directly to its official root website (*e.g., `https://brandolia.ai/`, `https://usefoyer.com/`, `https://honeylog.io/`, `https://agentichq.com/`, `https://bizreply.co/`, `https://growify.ai/`, `https://vois.studio/`, `https://acadle.com/`*).
- **Zero External Tracking Parameters**: All `utm_source=www.aiplanetx.com`, `utm_medium=referral`, and `beehiiv` tracking query parameters must be completely stripped from all URLs.
- **Clean Browsing Experience**: When a user hovers or clicks on any link across AIRA, no other publication or third-party domain name is ever visible.

---

## 📑 4. Content Extraction Protocol (From Source Editions)
When ingesting an article from the source (e.g. AI PlanetX), extract the following with **100% verbatim precision**:

1. **Title & Subtitle**: Exact original headlines.
2. **Menu Intro Overview**: Summary list of the 5 main topics.
3. **🔥 Hottest AI News (Top 2 Major Stories)**:
   - **Company Tag**: (`OpenAI`, `Anthropic`, `Meta`, `Google`, `DeepMind`, `Apple`, etc.)
   - **Story Headline**: Exact title.
   - **Authentic Story Image**: The exact high-res photo/screenshot from the story (*e.g., Masayoshi Son & Sam Altman photo, benchmark diagram, hardware thumbnail*). NEVER use the cover banner or generic placeholder inside the body.
   - **Story Text & Details (100% Verbatim)**: Complete facts, pricing, specs, lead paragraph, full bullet points list, and concluding paragraph.
   - **Verified Target Links**: Direct clean links to official research papers, announcements, and models.
4. **🛠️ Top AI & SaaS Tools (5 Curated Tools - 100% Verbatim)**:
   - Tool name, direct official website link, exact verbatim description from source, and deal badges (`Lifetime Deal`, `Free`, `Free to Try`).
5. **📚 AI Tutorial / Workflow (100% Verbatim Step-by-Step Practical Guide)**:
   - Exact tutorial headline.
   - Authentic tutorial screenshot/cover.
   - Full verbatim step-by-step actionable workflow with formatted prompts, code snippets, and nested lists.
   - **Pro Tip / Note** callout box.
6. **🌐 Top AI & Tech News (4 Quick Hits - 100% Verbatim)**:
   - 4 bullet points with direct media source links (`BBC`, `Microsoft Research`, `Adobe`, `The Information`, `Reuters`, `Axios`, `CleanTechnica`, `The Next Web`).

---

## 🚫 4. What to ALWAYS Exclude (Zero Tolerance)
- ❌ **NO AI Art Spotlight**: Skip all Midjourney/ChatGPT prompt gallery sections.
- ❌ **NO 3rd-Party Sponsor Ads**: Block all paid sponsor promotions (*Roku Ads Manager, Superhuman Newsletter, Blu Dot, Remote.com, Marketing Against The Grain, etc.*).
- ❌ **NO External Branding / Colors**: Block external publication logos, author bylines, external social widgets, and external colors like AI PlanetX purple (`#660DB7`).

---

## 🎨 5. AIRA Design System & Color Palette
- **Section Headers (`.article-section-header`)**: AIRA Dark Graphite Bar (`background: #090D16; color: #FFFFFF;` | Dark mode: `#18181B`).
- **Company / Topic Badges (`.story-company-badge`)**: AIRA Emerald Badge (`color: #059669; background: rgba(5, 150, 105, 0.1);`).
- **Cards (`.article-story-card`)**: Elevated white cards (`border: 1px solid #E2E8F0; border-radius: 14px;` | Dark mode: `#18181B`).
- **Tools Panel (`.article-tools-box`)**: Clean light gray box (`#F8FAFC;` with `✦` bullets).
- **Tutorial Steps (`.tutorial-step-list`)**: Ordered list with bold headings and code blocks.
- **Sign-off (`.article-signoff`)**: Standard `"Until next time,<br><strong>AIRA</strong>"`.

---

## 🚀 6. Deployment & Cache Protocol
Whenever an article is added or modified:
1. Validate syntax: `node -c data/articles.js`.
2. Bump cache version: e.g. `v95` in `sw.js`, `v95.0` in `index.html`, and `95.0` in `js/app.js` (`CURRENT_DATA_VERSION`).
3. Commit and push to GitHub:
   ```bash
   "C:\Users\Deep\.gemini\antigravity\tools\git\cmd\git.exe" add data/articles.js index.html js/app.js styles.css sw.js AIRA_ARTICLE_RULES.md
   "C:\Users\Deep\.gemini\antigravity\tools\git\cmd\git.exe" commit -m "..."
   "C:\Users\Deep\.gemini\antigravity\tools\git\cmd\git.exe" push origin main
   ```
4. Verify live deployment at `https://aira-newsletter.vercel.app/`.
