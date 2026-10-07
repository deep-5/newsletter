# AIRA Newsletter Article Ingestion Standards & Strict Rules

This document defines the **100% Locked Rules** for ingesting, parsing, formatting, and adding new articles from **AI PlanetX** (`https://www.aiplanetx.com/`) to the AIRA platform. Whenever new articles are added in the future, all of the following rules MUST be followed strictly.

---

## 1. Source Authenticity & 100% Verbatim Text
- **Source**: Exclusively authentic editions from AI PlanetX (`https://www.aiplanetx.com/`).
- **Verbatim Text**: 100% exact source text for all headlines, summaries, bullet points, tool descriptions, and tutorial workflows.
- **Zero Hallucination / Zero Rewriting**: Do not summarize or alter the technical facts, statistics, numbers, or company statements.

---

## 2. Strict Zero Sponsor / Zero Ad Policy
All third-party sponsored copy, ad placements, and affiliate promos MUST be strictly stripped out before saving to `data/articles.js`.

### Known Sponsor Ads to Filter:
- **HubSpot**: "HubSpot 200+ AI-Powered Income Ideas", "HubSpot Prospecting Agent", "200+ proven ways to make money".
- **The Code / Newsletters**: "Sign up for The Code", "The Ultimate Claude Code Guide", "Superhuman AI Newsletter", "TLDR AI", "The Shift".
- **Brands / Platforms**: "Roku Ads Manager", "Blu Dot", "Skydive Agent", "Remote removes the complexity", "Guru Conference", "Constant Contact", "MarketBeat (10 Best AI Stocks)", "Pioneer 2026", "Atlassian".
- **Prompts & Lead Magnets**: "22 Marketing Agents", "100+ Coding Prompts", "100+ Claude Code Hacks", "Turn AI into your income", "Save your spot".
- **Loose Placement**: Never include loose sponsor `<p>` tags located after story bullet points or at the bottom of the tools list.

---

## 3. Strict 4-Section Article Structure
Every article in `data/articles.js` MUST follow this exact HTML schema inside `body_html`:

```html
<div class="article-menu-intro-card">
  <!-- Greeting, menu items list, and coffee-break read time -->
</div>

<div class="article-main-body">
  <!-- 1. HOTTEST AI NEWS (Exactly 2 stories) -->
  <div class="article-section-header"><h2>🔥 Hottest AI News</h2></div>
  <div class="article-story-card">
    <div class="story-badge-row"><span class="story-company-badge">Category/Company</span></div>
    <h3 class="story-headline">Headline 1</h3>
    <div class="section-image-box"><img src="Exact_Beehiiv_Image_1" alt="..." class="section-inline-img" loading="lazy" referrerpolicy="no-referrer" /></div>
    <p>Lead Paragraph...</p>
    <p><b>Details:</b></p>
    <ul class="tech-news-bullets">
      <li>Detail 1</li>
      <li>Detail 2</li>
      <li>Detail 3</li>
    </ul>
    <p>Concluding Paragraph (Clean, No Ads)</p>
  </div>

  <div class="article-story-card">
    <!-- Story 2 with same structure and Image 2 -->
  </div>

  <!-- 2. TOP AI & SAAS TOOLS (Exactly 5 verified tools) -->
  <div class="article-section-header"><h2>🛠️ Top AI &amp; SaaS Tools</h2></div>
  <div class="article-tools-box">
    <ul class="tools-feature-list">
      <!-- Exactly 5 tools with links and deal tags -->
    </ul>
  </div>

  <!-- 3. AI TUTORIAL (1 complete step-by-step workflow) -->
  <div class="article-section-header"><h2>📚 AI Tutorial</h2></div>
  <div class="article-story-card">
    <div class="story-badge-row"><span class="story-company-badge">AI Tutorial</span></div>
    <h3 class="story-headline">Tutorial Title</h3>
    <div class="section-image-box"><img src="Exact_Tutorial_Image" alt="..." class="section-inline-img" loading="lazy" referrerpolicy="no-referrer" /></div>
    <p>Intro paragraph...</p>
    <ol class="tutorial-step-list">
      <!-- Step 1, Step 2, Step 3, etc. -->
    </ol>
    <p><span><b>Note</b></span>: Important workflow note or tip.</p>
  </div>

  <!-- 4. TOP AI & TECH NEWS (3-4 high-impact briefs) -->
  <div class="article-section-header"><h2>🌐 Top AI &amp; Tech News</h2></div>
  <div class="article-story-card">
    <ul class="tech-news-bullets">
      <!-- 3 to 4 briefs with source hyperlinks -->
    </ul>
  </div>

  <div class="article-signoff">
    Until next time,<br>
    <strong>AIRA</strong>
  </div>
</div>
```

---

## 4. Exact Image Mapping Rules
- **Hero Banner (`image_url`)**: Use `assets/aira-banner-template-v2.jpg?v=148.0` for card thumbnails.
- **Story 1 Inline Image**: First non-logo Beehiiv asset (`contentImgs[0]`).
- **Story 2 Inline Image**: Second non-logo Beehiiv asset (`contentImgs[2]`).
- **Tutorial Inline Image**: Tutorial screenshot/visual asset (`contentImgs[4]`).
- All image tags MUST include `loading="lazy"` and `referrerpolicy="no-referrer"`.

---

## 5. Excluded Sections (Zero Clutter)
Do NOT include the following sections in articles:
- ❌ AI Art Spotlight
- ❌ Prompt of the Day
- ❌ Featured AI Video Embeds
- ❌ Sponsored Courses or External Lead Magnets

---

## 6. Verification Checklist Before Committing
Whenever new articles are added:
1. Run `node scratch/verify_detailed_structure.js` to ensure 0 errors.
2. Verify all articles have 3 story cards, exactly 5 tools, 3 images, and 0 sponsor flags.
3. Test on `http://localhost:3000/#/home` and inner article pages.
4. Commit and push to GitHub `origin main`.
