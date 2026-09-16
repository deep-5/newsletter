# 🔒 AIRA Article Ingestion & Verification Audit Rules (Locked Standard)

This document locks the permanent guidelines, filtering standards, and verification audit rules for any current or future articles ingested from source newsletters (e.g. AI Toast, Long Live AI).

---

## 🚫 1. What Must NEVER Be Added (Strictly Blocked)

1. **External Branding & Logo Banners**:
   - `LONGLIVEAI NEWSLETTER @longliveai` banner (`steel_on_black.png`)
   - `AI Toast` logo banner (`thumb_AI_Toast_Logo.png`)
   - Any external publication logo, badge, or header banner.

2. **External Author Names & Bylines**:
   - `Poonam Soni`, `@CodeByPoonam`, `Daniel Murray`, etc.
   - Any personal Twitter/X handles, LinkedIn URLs, or personal contact blurbs.

3. **Promotional & Sponsor Pitches**:
   - `Boost revenue and gain new customers by partnering with us...`
   - `Reach over 35K / 9000 / 50K AI enthusiasts with your product...`
   - `Join our newsletter to connect with tech professionals, investors...`
   - `[DM now!]` and partnership contact links.
   - Third-party sponsor ads (`AdQuick`, `Pacaso`, `KeepCart`, `Norton Neo`, `StackInfluence`, `ListKit`, `Attio`, `Mintlify`, `MavenAGI`, etc.).

4. **Voting Polls, Star Ratings & Reader Surveys**:
   - `What did you think of today's edition?`
   - `This helps tune future issues. Thanks for voting.`
   - `⭐⭐⭐⭐⭐ Loved it`, `⭐⭐⭐ Good, not great`, `⭐ Needs improvement`
   - `If this issue helped you make sense of AI’s chaos, forward it to a friend...`
   - Referral program snippets, leaderboards, and subscriber milestone announcements.

5. **Duplicate Cover Images**:
   - Top hero cover images must **never** be repeated inside the article body (`hero_dupes == 0`).

---

## ✅ 2. What MUST ALWAYS Be Included & Maintained

1. **100% Real Authentic Article Content**:
   - Complete news stories, technical breakdowns, research analysis, and software engineering deep-dives.

2. **Step-by-Step Tutorials & Prompt Formulas**:
   - Preserved inside formatted prompt blocks (`.article-practical-guide`).

3. **Authentic Section Diagrams & Technical Visuals**:
   - All genuine explanatory architecture diagrams, UI screenshots, and product visuals embedded within `.section-image-box`.

4. **Authentic Clean Tech Hyperlinks**:
   - All genuine outbound references (`openai.com`, `anthropic.com`, `techcrunch.com`, `blog.google`, `github.com`, `reuters.com`, `claude.ai`, etc.) formatted as clickable links with tracking/affiliate parameters removed.

5. **Exact Authentic Publication Dates**:
   - The original publication timestamp matching when the source published the article, strictly sorted **Latest to Oldest**.

6. **100% AIRA Brand Design System**:
   - `.article-lead-block` (Introductory summary)
   - `.article-briefing-box` (⚡ Key Takeaways)
   - Numbered `.article-section` cards (1., 2., 3.)
   - `.article-practical-guide` (🛠️ Implementation & Prompt Formulas)
   - `.article-analysis-card` (💡 The AIRA Strategic Perspective)
   - Standard AIRA signoff (`Until next time,<br><strong>AIRA</strong>`)

---

## 🔒 3. Automated Verification Audit Command

Whenever articles are updated or added, run the locked pipeline audit:
```bash
python scripts/aira_article_pipeline.py
```
**Passing criteria:**
- Bad text pattern hits: **0**
- Hero duplicates in body: **0**
- Ad / Banner images: **0**
- Chronological sort: **100% Valid**
