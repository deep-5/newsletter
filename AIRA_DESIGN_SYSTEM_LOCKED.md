# 🔒 AIRA Design System & Layout Guidelines (STRICTLY LOCKED)

> **IMPORTANT**: The following UI/UX layout, spacing, component architecture, and styling rules are permanently **LOCKED**. Any future features, pages, components, or tools added to the AIRA platform MUST strictly adhere to this exact design system without altering existing spacings, structures, or visual hierarchy.

---

## 1. 🎨 Typography & Colors
* **Primary Font**: `'Poppins', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
* **Color Palette**:
  * Primary Dark / Text: `#18181B` (Zinc-900)
  * Secondary Text: `#52525B` (Zinc-600)
  * Muted Text: `#71717A` (Zinc-500)
  * Card Background: `#FFFFFF` / Dark Mode: `#18181B`
  * Card Border: `1px solid #E5E7EB` / Dark Mode: `1px solid #27272A`
  * Brand Accent Green (Verified Check / CTAs): `#059669` / `#047857`
  * Badge Yellow (Promoted / Featured): `#FEF3C7` (Border: `#FDE68A`, Text: `#B45309`)

---

## 2. 📦 AI Tool Card Box Layout (LOCKED)
Each tool card must strictly follow this exact layout and CSS classes:

```html
<div class="tool-card [is-promoted-card] [is-featured]" data-tool-id="tool-id">
  <!-- 1. Header: Avatar on left + Title & Badges on right -->
  <div class="tool-card-header">
    <a href="#/tools/tool-id" class="tool-card-avatar-wrap">
      <img src="logo.png" alt="Tool logo" class="tool-logo-img" />
    </a>
    <div class="tool-header-content">
      <div class="tool-header-top-line">
        <h3 class="tool-card-name"><a href="#/tools/tool-id" class="tool-title-link">Tool Name</a></h3>
        <span class="tool-verified-check">
          <!-- 15x15 Green SVG checkmark -->
        </span>
      </div>
      <div class="tool-badges-wrap">
        <span class="tool-badge-category">Pure Clean Category Text</span>
        <span class="tool-badge-pricing pricing-freemium">FREEMIUM</span>
        <!-- Optional Promoted Badge -->
      </div>
    </div>
  </div>

  <!-- 2. Body: Clean 2-Line Description (<= 85 chars, no ellipses) -->
  <p class="tool-card-desc">Accurate 2-line description without text chopping.</p>

  <!-- 3. Footer: Details button on left + Visit Website on right -->
  <div class="tool-card-footer">
    <a href="#/tools/tool-id" class="tool-btn-details">Details</a>
    <a href="https://example.com" target="_blank" class="tool-btn-visit">
      <span>Visit Website</span>
      <!-- Arrow Icon -->
    </a>
  </div>
</div>
```

### 🚫 Permanently Disallowed in Cards:
* ❌ NO Star Rating pills (`★ 4.5 / 5.0`).
* ❌ NO Upvote buttons (`▲ 1050`).
* ❌ NO Category emojis or icons (`🎨`, `🏷️`). Category badges must be pure text.
* ❌ NO centered titles. Logos must always be top-left with titles beside them.

---

## 3. 📐 Grid & Spacing Rules
* **Container Max Width**: `1260px`
* **Directory Grid Columns**:
  * Desktop (`> 1100px`): `repeat(3, minmax(0, 1fr))` with `gap: 22px`
  * Tablet (`641px - 1100px`): `repeat(2, minmax(0, 1fr))` with `gap: 16px`
  * Mobile (`<= 640px`): `1fr` with `gap: 14px`
* **Card Dimensions**: `min-height: 190px`, `border-radius: 12px`, `padding: 16px`.

---

## 4. 📰 Content & Articles Standards (STRICTLY LOCKED)
* **100% Exact Verbatim Source Text Match (LOCKED)**: Every article ingested from source newsletters must retain 100% exact, word-for-word verbatim text without paraphrasing, rewriting, summarizing, or omitting any sentences, bullets, tools, or tutorial steps.
* **Standard Author**: All editorial content authored by **AIRA** (`assets/logo.svg`).
* **Uniform Hero Banner**: Every article uses `assets/aira-banner-template-v2.jpg`.
* **Zero Fabricated Content**: Strictly verified authentic data from original source editions.
* **Layout Consistency**: Hero header full-width grid background matching the homepage across all directory views.

---

## 5. 🚀 Deployment & Integrity
* All new additions must match existing CSS token classes without introducing conflicting ad-hoc wrappers.
* Always bump cache buster version in `index.html` upon production builds.
