const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'styles.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Remove any previous AIRA MASTER block if present so we cleanly replace it
const markerIndex = cssContent.indexOf('/* ==========================================================================\n   AIRA MASTER 100% MOBILE RESPONSIVE ENGINE');
if (markerIndex !== -1) {
  cssContent = cssContent.substring(0, markerIndex).trim();
}

const masterResponsiveEngine = `
/* ==========================================================================
   AIRA MASTER 100% MOBILE RESPONSIVE ENGINE & UI BUG FIXES
   Guarantees pixel-perfect rendering on all devices (320px - 1440px)
   ========================================================================== */

/* Strict Global Viewport & Reset */
html, body {
  overflow-x: hidden !important;
  width: 100% !important;
  max-width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: border-box !important;
  -webkit-text-size-adjust: 100% !important;
}

*, *::before, *::after {
  box-sizing: border-box !important;
}

#app-content,
main,
section,
.hero-section,
.feed-section,
.site-header,
.site-footer,
.container,
.nav-wrapper,
#feed-container-inner,
.feed-header,
.ad-banner-mint,
.home-main-layout,
.home-articles-col,
.home-sidebar-col,
.articles-grid-2col,
.article-card,
.card-image-wrap,
.card-thumbnail,
.articles-grid,
.prompts-grid,
.prompts-grid-3col,
.alt-grid,
.alt-software-card,
.deals-grid-3col,
.tools-grid {
  min-width: 0 !important;
  box-sizing: border-box !important;
}

img, video, iframe, embed, object {
  max-width: 100% !important;
  height: auto;
}

/* --------------------------------------------------------------------------
   1. TABLET & MEDIUM SCREENS (max-width: 992px)
   -------------------------------------------------------------------------- */
@media screen and (max-width: 992px) {
  .nav-center-links {
    display: none !important;
  }

  .btn-hamburger-mobile {
    display: flex !important;
  }

  .btn-submit-tool-nav {
    display: none !important;
  }

  .home-main-layout {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    max-width: 100% !important;
    gap: 28px !important;
  }

  .home-articles-col,
  .home-sidebar-col {
    width: 100% !important;
    max-width: 100% !important;
  }

  .home-sidebar-col {
    margin-top: 12px !important;
  }

  .saas-admin-wrapper {
    flex-direction: column !important;
  }

  .saas-admin-sidebar {
    width: 100% !important;
    min-width: 100% !important;
    height: auto !important;
    position: static !important;
    border-right: none !important;
    border-bottom: 1px solid #E2E8F0 !important;
  }

  .saas-sidebar-nav {
    display: flex !important;
    flex-direction: row !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    gap: 6px !important;
    padding: 8px 12px !important;
  }

  .saas-nav-btn {
    white-space: nowrap !important;
    flex-shrink: 0 !important;
    padding: 7px 12px !important;
    font-size: 0.8125rem !important;
  }

  .saas-topbar {
    padding: 10px 14px !important;
    flex-wrap: wrap !important;
    gap: 10px !important;
  }

  .saas-search-input-wrap {
    max-width: 100% !important;
    width: 100% !important;
    order: 2 !important;
  }

  .saas-topbar-actions {
    width: 100% !important;
    justify-content: space-between !important;
    order: 1 !important;
  }
}

/* --------------------------------------------------------------------------
   2. MOBILE & SMARTPHONES (max-width: 768px)
   -------------------------------------------------------------------------- */
@media screen and (max-width: 768px) {
  .container {
    width: 100% !important;
    max-width: 100% !important;
    padding-left: 16px !important;
    padding-right: 16px !important;
  }

  .hero-section {
    width: 100% !important;
    max-width: 100% !important;
    padding: 32px 0 20px 0 !important;
  }

  .hero-tagline,
  .search-form-hero {
    width: 100% !important;
    max-width: 100% !important;
  }

  /* Articles Grid: 100% 1-Column Stack */
  .articles-grid-2col,
  .articles-grid,
  .prompts-grid-3col,
  .prompts-grid,
  .deals-grid-3col {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    max-width: 100% !important;
    gap: 18px !important;
  }

  .article-card {
    width: 100% !important;
    max-width: 100% !important;
    border-radius: 14px !important;
    overflow: hidden !important;
  }

  .card-image-wrap {
    width: 100% !important;
    max-width: 100% !important;
    aspect-ratio: 16 / 9 !important;
    overflow: hidden !important;
  }

  .card-thumbnail {
    width: 100% !important;
    max-width: 100% !important;
    height: 100% !important;
    aspect-ratio: 16 / 9 !important;
    object-fit: cover !important;
  }

  .card-body {
    padding: 16px 14px !important;
  }

  .card-title {
    font-size: 1.08rem !important;
    line-height: 1.35 !important;
    margin-bottom: 8px !important;
  }

  .card-subtitle {
    font-size: 0.85rem !important;
    line-height: 1.45 !important;
    margin-bottom: 12px !important;
  }

  .card-footer {
    margin-top: 10px !important;
    font-size: 0.78rem !important;
    padding-top: 10px !important;
    border-top: 1px solid #F1F5F9 !important;
  }

  /* Mint Ad Banners */
  .ad-banner-mint {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    width: 100% !important;
    max-width: 100% !important;
    padding: 18px 16px !important;
    gap: 14px !important;
    border-radius: 14px !important;
    text-align: left !important;
  }

  .ad-banner-content-wrap {
    gap: 10px !important;
  }

  .ad-banner-title {
    font-size: 1.15rem !important;
  }

  .ad-banner-desc {
    font-size: 0.85rem !important;
  }

  .ad-pill-btn {
    width: 100% !important;
    justify-content: center !important;
    padding: 11px 18px !important;
    font-size: 0.9rem !important;
    text-align: center !important;
  }

  /* Filter Pills Horizontal Scroll */
  .filter-pills,
  .prompt-source-tabs-wrap {
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    flex-wrap: nowrap !important;
    padding-bottom: 6px !important;
  }

  .filter-pill,
  .prompt-source-tab-btn {
    white-space: nowrap !important;
    flex-shrink: 0 !important;
  }

  /* Article Reader */
  .article-reader-container {
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 14px !important;
  }

  .article-header-title {
    font-size: 1.7rem !important;
    line-height: 1.25 !important;
    letter-spacing: -0.02em !important;
  }

  .article-header-subtitle {
    font-size: 0.98rem !important;
    line-height: 1.45 !important;
  }

  .article-content-body {
    font-size: 1rem !important;
    line-height: 1.65 !important;
  }

  .article-content-body pre {
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    padding: 12px 14px !important;
    border-radius: 8px !important;
    font-size: 0.82rem !important;
    max-width: 100% !important;
  }

  .article-content-body table {
    display: block !important;
    width: 100% !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }

  .article-floating-actions {
    position: static !important;
    transform: none !important;
    flex-direction: row !important;
    justify-content: center !important;
    margin: 24px auto !important;
    gap: 12px !important;
  }

  /* Master Footer */
  .site-footer {
    width: 100% !important;
    max-width: 100% !important;
    padding: 36px 0 24px 0 !important;
  }

  .footer-top-banner {
    width: 100% !important;
    max-width: 100% !important;
    padding: 22px 16px !important;
    border-radius: 14px !important;
    margin-bottom: 30px !important;
  }

  .footer-top-title {
    font-size: 1.35rem !important;
  }

  .footer-top-subtitle {
    font-size: 0.88rem !important;
    margin-bottom: 16px !important;
  }

  .footer-top-input-wrap {
    display: flex !important;
    flex-direction: column !important;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    gap: 10px !important;
    width: 100% !important;
  }

  .footer-top-input {
    background: #FFFFFF !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 9999px !important;
    padding: 12px 18px !important;
    width: 100% !important;
    font-size: 0.875rem !important;
  }

  .footer-top-btn {
    width: 100% !important;
    justify-content: center !important;
    padding: 12px 20px !important;
    border-radius: 9999px !important;
    font-size: 0.92rem !important;
  }

  .footer-main-grid {
    display: flex !important;
    flex-direction: column !important;
    gap: 28px !important;
    border-bottom: 1px solid #E2E8F0 !important;
    padding-bottom: 28px !important;
  }

  .footer-col-brand,
  .footer-col {
    text-align: center !important;
    width: 100% !important;
  }

  .footer-brand-header,
  .footer-social-row {
    justify-content: center !important;
  }

  .footer-brand-desc {
    margin: 10px auto 16px auto !important;
    max-width: 440px !important;
  }

  .footer-col-title::after {
    left: 50% !important;
    transform: translateX(-50%) !important;
  }

  .footer-links-list li a {
    justify-content: center !important;
  }
}

/* --------------------------------------------------------------------------
   3. SMALL MOBILES (max-width: 640px)
   -------------------------------------------------------------------------- */
@media screen and (max-width: 640px) {
  /* Header */
  .site-header {
    height: 56px !important;
    min-height: 56px !important;
    width: 100% !important;
  }

  .brand-logo-img {
    width: 28px !important;
    height: 28px !important;
  }

  .brand-title {
    font-size: 1.15rem !important;
  }

  .btn-subscribe-nav {
    padding: 6px 11px !important;
    font-size: 0.78rem !important;
    font-weight: 700 !important;
  }

  .nav-right-actions {
    gap: 8px !important;
  }

  .nav-right-actions #btn-bookmarks-nav {
    display: none !important;
  }

  /* Breaking News Ticker */
  .breaking-news-ticker-wrap {
    padding: 5px 10px !important;
    font-size: 0.75rem !important;
    width: 100% !important;
  }

  .ticker-label-badge {
    font-size: 0.65rem !important;
    padding: 2px 6px !important;
    margin-right: 8px !important;
  }

  .ticker-headline-link {
    font-size: 0.75rem !important;
  }

  /* Hero Section */
  .hero-logo-box {
    margin-bottom: 12px !important;
  }

  .hero-logo-img {
    width: 64px !important;
    height: 64px !important;
  }

  .hero-title {
    font-size: 2.1rem !important;
    margin-bottom: 6px !important;
  }

  .hero-tagline {
    font-size: 0.92rem !important;
    line-height: 1.45 !important;
    margin-bottom: 18px !important;
  }

  .search-form-hero {
    width: 100% !important;
    max-width: 100% !important;
    padding: 3px 4px 3px 12px !important;
    margin-bottom: 14px !important;
  }

  .search-input-hero {
    font-size: 0.875rem !important;
    padding: 6px 4px !important;
    min-width: 0 !important;
  }

  .search-btn-hero {
    padding: 7px 14px !important;
    font-size: 0.8125rem !important;
    border-radius: 9999px !important;
    flex-shrink: 0 !important;
  }

  .social-bar-hero {
    gap: 8px !important;
    margin-top: 12px !important;
  }

  .social-icon-btn {
    width: 36px !important;
    height: 36px !important;
  }

  /* Sidebar Widgets */
  .sidebar-trending-tools-widget,
  .sidebar-poll-widget,
  .ad-sidebar-card {
    padding: 16px 14px !important;
    border-radius: 12px !important;
    width: 100% !important;
  }

  .trending-tool-row {
    padding: 8px 10px !important;
    gap: 10px !important;
  }

  .trending-tool-name {
    font-size: 0.875rem !important;
  }

  .trending-tool-desc-short {
    font-size: 0.75rem !important;
  }

  .poll-question-text {
    font-size: 0.95rem !important;
  }

  .poll-option-row {
    padding: 10px 12px !important;
  }

  .poll-option-title {
    font-size: 0.85rem !important;
  }

  /* Pagination Bar */
  .aira-pagination-bar {
    gap: 5px !important;
    padding: 6px 0 !important;
    width: 100% !important;
  }

  .pagination-pill-btn {
    height: 34px !important;
    padding: 0 10px !important;
    font-size: 0.78rem !important;
  }

  .pagination-num-btn {
    width: 34px !important;
    height: 34px !important;
    font-size: 0.8rem !important;
  }

  /* Alternatives Directory */
  .alt-grid {
    display: flex !important;
    flex-direction: column !important;
    gap: 14px !important;
    width: 100% !important;
  }

  .alt-hero-banner {
    padding: 20px 14px !important;
    border-radius: 12px !important;
    margin-bottom: 16px !important;
    width: 100% !important;
  }

  .alt-hero-title {
    font-size: 1.45rem !important;
  }

  .alt-hero-desc {
    font-size: 0.825rem !important;
    margin-bottom: 14px !important;
  }

  .alt-search-form {
    width: 100% !important;
    max-width: 100% !important;
  }

  .alt-software-card {
    width: 100% !important;
    padding: 14px 14px !important;
  }

  .alt-detail-hero {
    padding: 16px 14px !important;
    border-radius: 10px !important;
    width: 100% !important;
  }

  .alt-detail-hero-top {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 10px !important;
  }

  .alt-detail-title {
    font-size: 1.35rem !important;
  }

  .alt-detail-desc {
    font-size: 0.825rem !important;
  }

  .alt-detail-actions-row {
    width: 100% !important;
  }

  .alt-btn-visit-prop,
  .alt-btn-back-dir {
    flex: 1 !important;
    justify-content: center !important;
    text-align: center !important;
  }

  .alt-ranked-item {
    padding: 16px 14px !important;
    width: 100% !important;
  }

  .alt-item-header {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 10px !important;
  }

  .alt-item-links {
    width: 100% !important;
    justify-content: flex-start !important;
  }

  /* Modals */
  .modal-box,
  .submit-modal-box,
  .admin-modal-box,
  .lead-magnet-modal-box {
    width: 94vw !important;
    max-width: 94vw !important;
    padding: 20px 16px !important;
    border-radius: 12px !important;
    max-height: 88vh !important;
    margin: 16px auto !important;
  }

  .modal-header h3 {
    font-size: 1.2rem !important;
  }

  /* Admin Studio & Dashboard */
  .saas-kpi-grid {
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important;
  }

  .saas-panel-card {
    padding: 16px 14px !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }
}

/* --------------------------------------------------------------------------
   4. EXTRA NARROW MOBILE (max-width: 380px)
   -------------------------------------------------------------------------- */
@media screen and (max-width: 380px) {
  .brand-title {
    font-size: 1.05rem !important;
  }

  .btn-subscribe-nav {
    padding: 5px 9px !important;
    font-size: 0.75rem !important;
  }

  .hero-title {
    font-size: 1.85rem !important;
  }

  .pagination-pill-btn.btn-page-first,
  .pagination-pill-btn.btn-page-last {
    display: none !important;
  }
}
`;

cssContent += '\n' + masterResponsiveEngine + '\n';
fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log('✔ Master Mobile Responsive Engine cleanly written to styles.css!');
