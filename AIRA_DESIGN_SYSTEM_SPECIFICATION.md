# 📐 AIRA Comprehensive Design System & UI Specification

> **Status**: **PROPOSED SPECIFICATION (LOCAL REVIEW ONLY — NO LIVE DEPLOYMENT)**  
> **Brand**: **AIRA** (The One and Only AI Newsletter)  
> **Signature Brand Color**: **Terracotta Rust `#8F3720` / `rgb(143, 55, 32)`** (Warm, premium human-crafted editorial palette derived directly from user's custom brand color).  
> **Design Philosophy**: Minimalist Obsidian, Charcoal, and Warm Terracotta Rust aesthetic. Clean editorial elegance without artificial AI neon or saturated purple slop.

---

## 🎨 1. Brand Color System (Exact Hex & RGB Values)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           AIRA CORE COLOR PALETTE                               │
├───────────────────┬───────────────────┬───────────────────┬─────────────────────┤
│   Deep Obsidian   │   Charcoal Zinc   │    Crisp White    │    Clean Surface    │
│      #090D16      │      #18181B      │      #FFFFFF      │       #F8FAFC       │
│  rgb(9, 13, 22)   │  rgb(24, 24, 27)  │ rgb(255,255,255)  │  rgb(248, 250, 252) │
├───────────────────┼───────────────────┼───────────────────┼─────────────────────┤
│   Slate Border    │  Terracotta Rust  │     Rust Dark     │   Amber Deal Tag    │
│      #E2E8F0      │      #8F3720      │      #782E1A      │       #FEF3C7       │
│ rgb(226, 232, 240)│  rgb(143, 55, 32) │  rgb(120, 46, 26) │  rgb(254, 243, 199) │
└───────────────────┴───────────────────┴───────────────────┴─────────────────────┘
```

### 1.1 Base & Surface Colors
* **Primary Dark Background (Header/Dark Mode)**: `#090D16` / `rgb(9, 13, 22)`
* **Card Surface (Dark Mode)**: `#18181B` / `rgb(24, 24, 27)`
* **Primary Light Background**: `#FFFFFF` / `rgb(255, 255, 255)`
* **Secondary Light Surface (Panels/Boxes)**: `#F8FAFC` / `rgb(248, 250, 252)`
* **Card Border (Light Mode)**: `#E2E8F0` / `rgb(226, 232, 240)`
* **Card Border (Dark Mode)**: `#27272A` / `rgb(39, 39, 42)`

### 1.2 Brand Accents & Highlights (Terracotta Rust `#8F3720`)
* **Brand Primary Accent (Buttons / Verified / Active Elements)**: `#8F3720` / `rgb(143, 55, 32)`
* **Brand Accent Hover / Focus**: `#782E1A` / `rgb(120, 46, 26)`
* **Brand Accent Soft Tint**: `rgba(143, 55, 32, 0.08)` / `#F5EBE8` (Badge backgrounds)
* **Deal Tag Badge**: Background `#FEF3C7`, Border `#FDE68A`, Text `#B45309`
* **Free Tag Badge**: Background `#F8FAFC`, Border `#E2E8F0`, Text `#8F3720`

### 1.3 Editorial Typography Colors
* **Primary Headings**: `#0F172A` (Slate 900) / Dark Mode: `#F8FAFC`
* **Body Text**: `#334155` (Slate 700) / Dark Mode: `#E2E8F0`
* **Secondary / Muted Text**: `#64748B` (Slate 500) / Dark Mode: `#94A3B8`
* **Hyperlinks**: `#8F3720` with underline on hover (Clean, direct navigation)

---

## 🔤 2. Typography Hierarchy

| Style Level | Font Family | Size (Desktop) | Size (Mobile) | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|---|
| **Display / Hero H1** | `Poppins` | `38px` (2.375rem) | `28px` (1.75rem) | `800 Bold` | `1.2` | `-0.02em` |
| **Section Title H2** | `Poppins` | `26px` (1.625rem) | `22px` (1.375rem) | `700 Bold` | `1.3` | `-0.01em` |
| **Card / Story H3** | `Poppins` | `18px` (1.125rem) | `17px` (1.062rem) | `600 SemiBold` | `1.35` | `0` |
| **Subheading H4** | `Poppins` | `15px` (0.937rem) | `14px` (0.875rem) | `600 SemiBold` | `1.4` | `0` |
| **Body Regular** | `Inter` | `16px` (1.0rem) | `15px` (0.937rem) | `400 Regular` | `1.65` | `+0.01em` |
| **Body Small / Desc** | `Inter` | `13.5px` (0.843rem)| `13px` (0.812rem) | `400 Regular` | `1.5` | `+0.01em` |
| **Badges / Meta Pills**| `Inter` | `11.5px` (0.718rem)| `11px` (0.687rem) | `600 SemiBold` | `1.0` | `+0.04em` |
| **Code / Snippets** | `JetBrains Mono`| `13.5px` (0.843rem)| `12.5px` (0.781rem)| `500 Medium` | `1.5` | `0` |

---

## 📐 3. Component Dimensions & Layout Specifications

```
                                 AIRA NAVBAR (Height: 64px)
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│  [Logo 32x32] AIRA (20px)    Home   AI Tools   Alternatives   Prompts Vault    [+ Submit Tool]  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Sticky Navbar (`.site-header`)
* **Height**: `64px` fixed
* **Container Max-Width**: `1260px`
* **Logo Image**: `32px x 32px` (`border-radius: 6px`)
* **Brand Text (`AIRA`)**: `20px`, Font-weight `700`, Color `#FFFFFF` (Dark Navbar) or `#0F172A`
* **Nav Links**: Font size `14px`, Font-weight `500`, Gap `24px`
* **Submit Tool Button**: Height `34px`, Font size `13px`, Padding `0 14px`, Border-radius `8px`, Terracotta Rust Background `#8F3720`

---

### 3.2 Hero Ad / Cover Banner (100% Uniform Specification)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                          AIRA HERO COVER BANNER (1200 x 630 px)                                  │
│                                                                                                  │
│    ┌──────────────────────────────────┐     ┌──────────────────────────────────────────────┐     │
│    │                                  │     │                                              │     │
│    │     ACCELERATE                   │     │           INNER NEWSLETTER MOCKUP            │     │
│    │     YOUR GROWTH                  │     │                 PHONE/CARD                   │     │
│    │     WITH AIRA                    │     │                                              │     │
│    │                                  │     │               (Realistic UI)                 │     │
│    │     The One & Only AI Dispatch   │     │                                              │     │
│    │                                  │     │                                              │     │
│    └──────────────────────────────────┘     └──────────────────────────────────────────────┘     │
│  ══════════════════════════════════════════════════════════════════════════════════════════════  │
│  [Terracotta Rust Accent Line #8F3720 - 8px Height]                                              │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Standard Banner Canvas**: `1200px x 630px` (Standard OpenGraph & Retina Display 1.91:1 ratio)
* **Aspect Ratio**: `1.905 : 1` (Responsive scaling: `width: 100%; height: auto; max-height: 480px; object-fit: cover;`)
* **Background Style**: Obsidian Charcoal Gradient (`linear-gradient(135deg, #090D16 0%, #18181B 100%)`)
* **Left Typography Area**: Width `52%`, Headline Font `Poppins 44px Bold`, Color `#FFFFFF`
* **Right Mockup Area**: Width `44%`, Realistic mobile app/newsletter preview with rounded corners (`16px`)
* **Bottom Accent Bar**: Height `8px`, Terracotta Rust `#8F3720`

---

### 3.3 AI Tool Card Box Layout (`.tool-card` — STRICTLY LOCKED)

#### A. Standard Organic Tool Cards
```
┌────────────────────────────────────────────────────────────────────┐
│ [Avatar 44x44]  Tool Name [✔ Verified 15px]                        │
│                 [CATEGORY BADGE]  [FREEMIUM]                       │
│                                                                    │
│ Clean 2-line description without text chopping or overflow         │
│ (Max 85 characters, line-height: 20px).                            │
│                                                                    │
│ [Details Button (32px)]            [Visit Website ↗ (BLACK #18181B)]│
└────────────────────────────────────────────────────────────────────┘
```
* **Background**: Pure Crisp White `#FFFFFF` (Dark mode: `#18181B`)
* **Border**: `1px solid #E2E8F0` (Dark mode: `#27272A`)
* **Visit Button**: **Solid Black `#18181B`**, Text `#FFFFFF`, Hover `#000000`

#### B. Sponsored / Ad Tool Cards (`.is-sponsored-listing`)
```
┌────────────────────────────────────────────────────────────────────┐
│ [Rust Avatar]   Tool Name  [AD]  [★ FEATURED LISTING]              │
│                 [CATEGORY BADGE]  [FREE TRIAL]                     │
│                                                                    │
│ Prominently showcase your product across 400+ tool pages...        │
│                                                                    │
│ [⚡ Listing Ad]                     [Reserve ($149/wk) ↗ (RUST #8F3720)]│
└────────────────────────────────────────────────────────────────────┘
```
* **Background**: **`#FDF7F5` (Distinct Warm Rust Tint — clearly indicates Ad/Sponsorship)**
* **Border**: **`1.5px solid #E2A293`** (Hover: `#8F3720`)
* **Badges**: `AD` and `★ FEATURED LISTING` in `#8F3720` with `#F5EBE8` background
* **Action Button**: **Terracotta Rust `#8F3720`**, Hover `#782E1A`, Text `#FFFFFF`

---

### 3.4 Article Grid Card (`.article-card`)

* **Width**: `100%` (`~380px` in 3-column layout)
* **Card Min-Height**: `360px`
* **Thumbnail Cover**: Height `210px`, `16:9` ratio, `object-fit: cover`, `border-radius: 10px 10px 0 0`
* **Article Title**: `18px`, Weight `600`, Line-height `24px`, Max 2 lines
* **Meta Info Row**: Date `13px` (`#64748B`), Topic Tag Pill `12px` (Rust `#8F3720`), Read time `12px`

---

### 3.5 Article Detail Reader Page Layout

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           ARTICLE HEADER & HERO BANNER                          │
│                                (1200 x 630 px)                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │ 📋 MENU INTRO OVERVIEW CARD (Padding: 20px, Radius: 12px, BG: #F8FAFC) │   │
│   │ Welcome to AIRA! 👋                                                     │   │
│   │ • Topic 1  • Topic 2  • Topic 3  • Topic 4                              │   │
│   │ ☕ Read Time: 4 minutes                                                 │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │ 🔥 HOTTEST AI NEWS STORY CARD (Padding: 24px, Radius: 14px)             │   │
│   │ [Rust Badge #8F3720: Anthropic]                                         │   │
│   │ Headline Title (Poppins 22px Bold)                                      │   │
│   │ [Authentic Story Screenshot (Max Height: 480px, Radius: 10px)]          │   │
│   │ Verbatim Lead Paragraph...                                              │   │
│   │ Details: • Point 1  • Point 2  • Point 3                                │   │
│   │ Verbatim Takeaway...                                                    │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │ 🛠️ TOP AI & SAAS TOOLS BOX (Padding: 18px, Radius: 12px, BG: #F8FAFC)  │   │
│   │ • Tool 1 [Lifetime Deal] — Exact verbatim description                   │   │
│   │ • Tool 2 [Free to Try]   — Exact verbatim description                   │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │ 📚 AI TUTORIAL STORY CARD (Padding: 24px, Radius: 14px)                 │   │
│   │ Headline & Authentic Tutorial Cover (Max Height: 480px)                 │   │
│   │ 1. Step One (Bold Title + Instructions + Code Snippets)                 │   │
│   │ 2. Step Two ...                                                         │   │
│   │ 💡 Pro Tip / Note Callout Box (Border: Rust #8F3720)                    │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │ 🌐 TOP AI & TECH NEWS (Padding: 20px, Radius: 12px)                     │   │
│   │ • Quick Hit 1 (Direct Media Link in Rust #8F3720)                       │   │
│   │ • Quick Hit 2 (Direct Media Link in Rust #8F3720)                       │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│   Until next time,                                                              │
│   AIRA                                                                          │
└─────────────────────────────────────────────────────────────────────────────────┘
```

* **Reader Max Width**: `820px` centered
* **Menu Intro Overview**: Padding `20px`, Border `1px solid #E2E8F0`, Radius `12px`, Background `#F8FAFC`
* **Story Cards**: Padding `24px`, Border `1px solid #E2E8F0`, Radius `14px`, Background `#FFFFFF`
* **Inline Screenshots**: `width: 100%`, `max-height: 480px`, `object-fit: contain`, `border-radius: 10px`, `border: 1px solid #E2E8F0`
* **Tools Panel**: Padding `18px`, Radius `12px`, Background `#F8FAFC`
* **Tutorial Steps (`.tutorial-step-list`)**: Font `15.5px`, Line-height `1.65`, Step Headings `16px Bold`, Code Snippets `padding: 12px, background: #0F172A, color: #F8FAFC, radius: 8px`
* **Pro Tip / Note Callout**: Padding `12px 16px`, Border-left `4px solid #8F3720`, Background `rgba(143, 55, 32, 0.05)`, Radius `0 8px 8px 0`

---

## 📱 4. Responsive Breakpoints & Grid Matrix

| Viewport | Screen Width | Grid Columns | Container Width | Card Gap |
|---|---|---|---|---|
| **Desktop** | `> 1100px` | `repeat(3, 1fr)` | `1260px` | `22px` |
| **Tablet** | `641px - 1100px` | `repeat(2, 1fr)` | `100% (Padding 20px)` | `16px` |
| **Mobile** | `≤ 640px` | `1fr` (Single) | `100% (Padding 14px)` | `14px` |

---

## 🔒 5. Verification & Integrity Checklist

1. [x] **Exact User-Uploaded Color**: Signature Terracotta Rust `#8F3720` replaces green across all buttons, badges, links, verified checkmarks, and banners.
2. [x] **No AI Neon / Purple Slop**: All colors conform to Obsidian `#090D16`, Charcoal `#18181B`, and Terracotta Rust `#8F3720`.
3. [x] **100% Verbatim Source Match**: Zero paraphrasing or rewriting in editorial articles.
4. [x] **Clean Direct Links**: Zero intermediary redirects (`go.aiplanetx.com` stripped).
5. [x] **Uniform Hero Banner**: Standardized to `1200x630px` template with `#8F3720` accent bar.
6. [x] **Strictly Locked Tool Card Layout**: Avatar top-left, title right, clean 2-line desc, dual footer buttons with `#8F3720` CTA.
