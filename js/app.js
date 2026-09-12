/**
 * AIRA Newsletter - Application Controller & Router
 * Brand: AIRA
 * Connected with Supabase Database Backend
 * Full Library of 56 Articles + Dynamic Load More + Archive + Tags + Search
 */

document.addEventListener('DOMContentLoaded', () => {
  // Helper to load articles from localStorage or default dataset
  function getArticles() {
    try {
      const stored = localStorage.getItem('aira_custom_articles');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading custom articles from storage:', e);
    }
    return typeof ARTICLES !== 'undefined' ? ARTICLES : [];
  }

  function saveArticles(list) {
    state.articles = list;
    localStorage.setItem('aira_custom_articles', JSON.stringify(list));
  }
  
  // App state
  const state = {
    articles: getArticles(),
    currentRoute: '',
    selectedTag: 'All',
    displayedCount: 9,
    homeSearchQuery: '',
    adminTab: 'subscribers',
    adminArticleSearch: '',
    adminArticleTag: 'All',
    toolCategoryFilter: 'all',
    toolPricingFilter: 'all',
    toolSearchQuery: '',
    likedPosts: JSON.parse(localStorage.getItem('aira_likes') || '{}'),
    pollVotes: JSON.parse(localStorage.getItem('aira_polls') || '{}'),
    comments: JSON.parse(localStorage.getItem('aira_comments') || '{}'),
    subscribers: JSON.parse(localStorage.getItem('aira_subscribers') || '[]')
  };

  // DOM Elements
  const appContainer = document.getElementById('app-content');
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const subscribeModal = document.getElementById('subscribe-modal');
  const toastContainer = document.getElementById('toast-container');

  // =========================================================================
  // Toast Notifications
  // =========================================================================
  function showToast(message, duration = 3000) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.innerHTML = `<span>⚡</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(16px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }

  // =========================================================================
  // Routing Logic
  // =========================================================================
  function getRoute() {
    const rawHash = window.location.hash.slice(1);
    const [hashPath, hashQuery] = rawHash.split('?');
    const isUnlocked = localStorage.getItem('aira_subscribed') === 'true' || 
                       localStorage.getItem('aira_unlocked') === 'true' || 
                       sessionStorage.getItem('aira_unlocked') === 'true';

    // When opening root URL for the first time without unlock: show Gate
    if (!hashPath || hashPath === '/' || hashPath === '') {
      if (!isUnlocked) {
        return { name: 'gate' };
      }
      return { name: 'home' };
    }
    if (hashPath === '/home') return { name: 'home' };
    if (hashPath === '/subscribe') {
      if (isUnlocked) {
        return { name: 'home' };
      }
      return { name: 'subscribe' };
    }
    if (hashPath.startsWith('/p/')) {
      const slug = hashPath.replace('/p/', '');
      return { name: 'post', slug };
    }
    if (hashPath === '/archive') return { name: 'archive' };
    if (hashPath === '/admin' || hashPath === '/subscribers') return { name: 'admin' };
    if (hashPath === '/tags') {
      const params = new URLSearchParams(hashQuery || '');
      const category = params.get('category') || 'all';
      return { name: 'tags', category };
    }
    return { name: 'home' };
  }

  async function renderCurrentRoute() {
    const route = getRoute();
    state.currentRoute = route.name;
    
    // Toggle Gate Mode on body (hides header/footer on gate screen)
    if (route.name === 'gate' || route.name === 'subscribe') {
      document.body.classList.add('aira-gate-active');
    } else {
      document.body.classList.remove('aira-gate-active');
    }

    // Update active navbar link
    document.querySelectorAll('.nav-link').forEach(link => {
      const target = link.getAttribute('data-nav');
      if (target === route.name || (route.name === 'gate' && target === 'home')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'instant' });

    if (route.name === 'gate' || route.name === 'subscribe') {
      renderSubscribeGatePage();
    } else if (route.name === 'home') {
      renderHomePage();
    } else if (route.name === 'post') {
      await renderPostPage(route.slug);
    } else if (route.name === 'archive') {
      renderArchivePage();
    } else if (route.name === 'admin') {
      renderAdminPage();
    } else if (route.name === 'tags') {
      if (route.category && route.category !== 'all') {
        state.toolCategoryFilter = route.category;
      }
      renderTagsPage();
    }
  }

  // =========================================================================
  // 1. Dedicated Subscribe Landing Gate (Appears before entering website)
  // =========================================================================
  function renderSubscribeGatePage() {
    appContainer.innerHTML = `
      <section class="subscribe-landing-page">
        <div class="sub-landing-container">
          <div class="sub-landing-icon-card">
            <img src="assets/logo.jpg" alt="AIRA" class="sub-landing-logo-img" onerror="this.src='assets/logo.svg'" />
          </div>
          
          <h1 class="sub-landing-title">AIRA</h1>
          
          <p class="sub-landing-tagline">
            Level up your AI knowledge in just 5 minutes | Join ALL people from Google, OpenAI, Meta, Apple.
          </p>
          
          <form class="sub-pill-form" id="gate-sub-form">
            <div class="sub-pill-wrap">
              <input type="email" class="sub-pill-input" placeholder="Enter Your Email" required autocomplete="email" />
              <button type="submit" class="sub-pill-btn">Subscribe</button>
            </div>
          </form>
        </div>
      </section>
    `;

    // Bind Gate Subscribe Form
    const gateForm = document.getElementById('gate-sub-form');
    if (gateForm) {
      gateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = gateForm.querySelector('.sub-pill-input');
        const submitBtn = gateForm.querySelector('.sub-pill-btn');
        const email = input ? input.value.trim() : '';
        if (!email) return;

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'Subscribing...';
        }

        try {
          if (window.DatabaseService) {
            await window.DatabaseService.subscribe(email, 'Landing Gate Page');
          } else {
            const list = JSON.parse(localStorage.getItem('aira_subscribers') || '[]');
            if (!list.includes(email)) {
              list.push(email);
              localStorage.setItem('aira_subscribers', JSON.stringify(list));
            }
          }

          sessionStorage.setItem('aira_unlocked', 'true');
          localStorage.setItem('aira_unlocked', 'true');
          localStorage.setItem('aira_subscribed', 'true');

          if (submitBtn) submitBtn.innerHTML = 'Subscribed! ✓';
          showToast('🎉 Welcome to AIRA! Access granted.');

          setTimeout(() => {
            window.location.hash = '#/home';
          }, 600);
        } catch (err) {
          console.error('Subscription error:', err);
          sessionStorage.setItem('aira_unlocked', 'true');
          localStorage.setItem('aira_unlocked', 'true');
          localStorage.setItem('aira_subscribed', 'true');
          window.location.hash = '#/home';
        }
      });
    }
  }

  // =========================================================================
  // 1b. Homepage View (With Interactive Search Bar & Live Filtering)
  // =========================================================================
  function renderHomePage() {
    appContainer.innerHTML = `
      <!-- Clean AIRA Hero Section with Search Bar -->
      <section class="hero-section">
        <div class="container">
          <div class="hero-logo-box">
            <img src="assets/logo.jpg" alt="AIRA Logo" class="hero-logo-img" onerror="this.src='assets/logo.svg'" />
          </div>
          <h1 class="hero-title">AIRA</h1>
          <p class="hero-tagline">The one and only AI newsletter. Join us and get the best AI news, tools, and tutorials completely FREE!</p>
          
          <form class="search-form-hero" id="hero-search-form" onsubmit="event.preventDefault();">
            <svg class="hero-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="hero-search-input" class="search-input-hero" placeholder="Search newsletter articles, AI news, topics..." value="${state.homeSearchQuery || ''}" autocomplete="off" />
            <button type="button" id="hero-search-clear" class="hero-search-clear-btn" style="display: ${state.homeSearchQuery ? 'flex' : 'none'};" title="Clear search">✕</button>
            <button type="submit" class="search-btn-hero" id="hero-search-btn">Search</button>
          </form>

          <div class="social-bar-hero">
            <a href="https://whatsapp.com/channel/0029VbC1KWlICVfsFtYhmZ3B" target="_blank" rel="noopener" class="social-icon-btn" title="WhatsApp">
              <svg viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.99.54 1.761.819 2.796.82 3.18 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.807-5.768-5.807zm0 10.455c-.933 0-1.62-.276-2.434-.76l-.174-.103-1.802.472.48-1.758-.113-.18c-.534-.848-.815-1.523-.815-2.36 0-2.618 2.13-4.748 4.748-4.748 2.617 0 4.747 2.13 4.747 4.748 0 2.618-2.13 4.748-4.748 4.748zm2.607-3.565c-.143-.072-.847-.418-.978-.466-.131-.048-.226-.072-.321.072-.095.143-.369.466-.452.561-.083.096-.167.108-.31.036-.143-.072-.603-.222-1.149-.707-.424-.378-.711-.845-.794-.988-.083-.143-.009-.22.063-.291.064-.064.143-.167.214-.25.072-.084.095-.144.143-.239.048-.096.024-.179-.012-.25-.036-.072-.321-.774-.44-1.06-.116-.28-.234-.241-.321-.246l-.274-.005c-.095 0-.25.036-.381.179-.131.143-.5 488-.5 1.19 0 .702.512 1.38 1.583 2.809 1.488 1.987 2.106 2.059 2.487 2.059.512 0 .976-.321 1.119-.774.143-.452.143-.845.1-.929-.048-.083-.143-.131-.286-.202zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.981-1.306A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.636 0-3.17-.487-4.457-1.326l-.32-.209-2.955.775.789-2.88-.228-.363A8.136 8.136 0 0 1 3.833 12c0-4.503 3.664-8.167 8.167-8.167 4.503 0 8.167 3.664 8.167 8.167 0 4.503-3.664 8.167-8.167 8.167z"/></svg>
            </a>
            <a href="https://t.me/aira_update" target="_blank" rel="noopener" class="social-icon-btn" title="Telegram">
              <svg viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/ai-tools-&-ai-news/?viewAsMember=true" target="_blank" rel="noopener" class="social-icon-btn" title="LinkedIn">
              <svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.85 6.44a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/></svg>
            </a>
          </div>
        </div>
      </section>

      <!-- Articles Feed Section -->
      <section class="feed-section" id="main-articles-feed">
        <div class="container" id="feed-container-inner"></div>
      </section>
    `;

    function updateArticlesGrid() {
      const feedInner = document.getElementById('feed-container-inner');
      if (!feedInner) return;

      const query = (state.homeSearchQuery || '').trim().toLowerCase();
      let filteredArticles = state.selectedTag === 'All' 
        ? state.articles 
        : state.articles.filter(a => a.tag.toLowerCase() === state.selectedTag.toLowerCase());

      if (query !== '') {
        filteredArticles = filteredArticles.filter(a => {
          const titleMatch = (a.title || '').toLowerCase().includes(query);
          const subtitleMatch = (a.subtitle || '').toLowerCase().includes(query);
          const tagMatch = (a.tag || '').toLowerCase().includes(query);
          return titleMatch || subtitleMatch || tagMatch;
        });
      }

      // Initial count of 6 articles matches the 2x3 grid in mockup
      if (!state.displayedCount || state.displayedCount < 6) {
        state.displayedCount = 6;
      }

      const visibleArticles = filteredArticles.slice(0, state.displayedCount);
      const hasMore = filteredArticles.length > state.displayedCount;
      const isSearching = query.length > 0;

      // Select top popular posts
      const popularArticles = [...state.articles]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 4);

      feedInner.innerHTML = `
        <!-- Articles Header & Filter Pills -->
        <div class="feed-header">
          <h2 class="feed-title">${isSearching ? `Search Results (${filteredArticles.length})` : 'Articles'}</h2>
          <div class="filter-pills">
            <button class="filter-pill ${state.selectedTag === 'All' ? 'active' : ''}" data-tag="All">All (${state.articles.length})</button>
            <button class="filter-pill ${state.selectedTag === 'News' ? 'active' : ''}" data-tag="News">News</button>
            <button class="filter-pill ${state.selectedTag === 'Prompts' ? 'active' : ''}" data-tag="Prompts">Prompts & Guides</button>
          </div>
        </div>

        ${isSearching ? `
          <div class="search-results-indicator">
            <span>Found <strong>${filteredArticles.length}</strong> ${filteredArticles.length === 1 ? 'article' : 'articles'} matching "<em>${state.homeSearchQuery}</em>"</span>
            <button type="button" class="btn-clear-search-link" id="btn-clear-search-query">Clear search</button>
          </div>
        ` : ''}

        <!-- 1. Top Banner Ad (100% Matching Uploaded Mockup) -->
        <div class="ad-banner-mint">
          <div class="ad-banner-content-wrap">
            <div class="ad-badge-circle">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#047857" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m3 11 18-5v12L3 14v-3z"/>
                <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
                <path d="M15 15h.01"/>
              </svg>
            </div>
            <div>
              <span class="ad-tag-label">ADVERTISEMENT</span>
              <h3 class="ad-banner-title">Your Ad Here</h3>
              <p class="ad-banner-desc">Reach thousands of AI enthusiasts and professionals.</p>
            </div>
          </div>
          <a href="mailto:sponsor@aira.com?subject=Advertise%20with%20AIRA" class="ad-pill-btn" target="_blank" rel="noopener">
            <span>Get Started</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>

        ${visibleArticles.length === 0 ? `
          <div class="no-articles-found">
            <p style="font-size: 1.15rem; font-weight: 700; color: var(--color-text-primary); margin-bottom: 8px;">No articles found</p>
            <p style="color: var(--color-text-secondary); font-size: 0.95rem; margin-bottom: 16px;">We couldn't find any articles matching "${state.homeSearchQuery}".</p>
            <button type="button" class="btn-clear-search-link" id="btn-empty-clear-search" style="font-size: 1rem; font-weight: 600;">← View All Articles</button>
          </div>
        ` : `
          <!-- 2-Column Main Layout (Left: Articles & Feed Banner | Right: Sidebar Ads & Popular Posts) -->
          <div class="home-main-layout">
            
            <!-- Left Column: Articles Grid & In-Article Banner -->
            <div class="home-articles-col">
              <!-- 2-Column Articles Grid -->
              <div class="articles-grid-2col" id="main-articles-grid">
                ${visibleArticles.map(article => `
                  <a href="#/p/${article.slug}" class="article-card">
                    <div class="card-image-wrap">
                      <img src="${article.image_url}" alt="${article.title}" class="card-thumbnail" loading="lazy" />
                      <span class="card-tag-badge">${article.tag}</span>
                    </div>
                    <div class="card-body">
                      <h3 class="card-title">${article.title}</h3>
                      <p class="card-subtitle">${article.subtitle}</p>
                      <div class="card-footer">
                        <div class="card-author-info">
                          <img src="${article.author_avatar}" alt="${article.author}" class="card-author-avatar" onerror="this.src='assets/logo.svg'" />
                          <span class="card-author-name">${article.author}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <span class="card-meta-date">${article.date} • ${article.reading_time}</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-text-muted); flex-shrink: 0;"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                        </div>
                      </div>
                    </div>
                  </a>
                `).join('')}
              </div>

              <!-- 4. In-Article Banner (At the End of Article List) -->
              <div class="ad-banner-mint" style="margin-top: 12px; margin-bottom: 24px;">
                <div class="ad-banner-content-wrap">
                  <div class="ad-badge-circle">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#047857" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                  </div>
                  <div>
                    <span class="ad-tag-label">ADVERTISEMENT</span>
                    <h3 class="ad-banner-title">Level Up Your AI Skills</h3>
                    <p class="ad-banner-desc">Learn from top resources, build real projects and get future ready.</p>
                  </div>
                </div>
                <a href="#/tags" class="ad-pill-btn">
                  <span>Explore Courses</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>

              <!-- Load More Button -->
              ${hasMore ? `
                <div class="load-more-wrap" style="margin-top: 24px;">
                  <button id="btn-load-more" class="btn-load-more">
                    <span>Load more articles</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                </div>
              ` : ''}
            </div>

            <!-- Right Column: Sidebar Ads & Popular Posts -->
            <div class="home-sidebar-col">
              
              <!-- 2. Right Sidebar Ad (Top) -->
              <div class="ad-sidebar-card">
                <div>
                  <span class="ad-tag-label">ADVERTISEMENT</span>
                  <h3 class="ad-sidebar-title">Build Smarter with AI</h3>
                  <p class="ad-sidebar-desc">Discover tools, courses and resources to grow your skills and career.</p>
                  <a href="#/tags" class="ad-pill-btn">
                    <span>Explore Now</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </a>
                </div>
                <div class="ad-sidebar-illu-laptop">
                  <div class="laptop-illu-card">
                    <div class="laptop-illu-screen">[ AI ]</div>
                    <div class="laptop-illu-base"></div>
                  </div>
                </div>
              </div>

              <!-- Popular Posts Widget -->
              <div class="sidebar-widget-popular">
                <div class="sidebar-popular-header">
                  <span>🔥</span>
                  <h4>Popular Posts</h4>
                </div>
                <div class="sidebar-popular-list">
                  ${popularArticles.map(p => `
                    <a href="#/p/${p.slug}" class="popular-post-item">
                      <img src="${p.image_url}" alt="${p.title}" class="popular-post-thumb" loading="lazy" />
                      <div class="popular-post-info">
                        <h5 class="popular-post-title">${p.title}</h5>
                        <span class="popular-post-views">${(p.views ? (p.views / 1000).toFixed(1) + 'k' : '4.2k')} views</span>
                      </div>
                    </a>
                  `).join('')}
                </div>
              </div>

              <!-- 3. In-Content / Sidebar Ad (Bottom) -->
              <div class="ad-sidebar-card">
                <div>
                  <span class="ad-tag-label">ADVERTISEMENT</span>
                  <h3 class="ad-sidebar-title">Grow Your Skills with AI</h3>
                  <p class="ad-sidebar-desc">Courses • Tools • Resources</p>
                  <a href="#/tags" class="ad-pill-btn">
                    <span>Learn More</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </a>
                </div>
                <div class="ad-sidebar-illu-growth">
                  <div class="growth-illu-box">
                    <div class="growth-bar growth-bar-1"></div>
                    <div class="growth-bar growth-bar-2"></div>
                    <div class="growth-bar growth-bar-3"></div>
                    <div class="growth-bar growth-bar-4">
                      <span class="growth-arrow">↗</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        `}
      `;

      // Bind filter pills
      feedInner.querySelectorAll('.filter-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          state.selectedTag = e.currentTarget.getAttribute('data-tag');
          state.displayedCount = 6;
          updateArticlesGrid();
        });
      });

      // Bind Load More button
      const loadMoreBtn = document.getElementById('btn-load-more');
      if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
          state.displayedCount += 6;
          updateArticlesGrid();
        });
      }

      // Bind clear search buttons
      const clearQueryBtn = document.getElementById('btn-clear-search-query');
      if (clearQueryBtn) {
        clearQueryBtn.addEventListener('click', clearHeroSearch);
      }
      const emptyClearBtn = document.getElementById('btn-empty-clear-search');
      if (emptyClearBtn) {
        emptyClearBtn.addEventListener('click', clearHeroSearch);
      }
    }

    function clearHeroSearch() {
      state.homeSearchQuery = '';
      const heroSearchInput = document.getElementById('hero-search-input');
      if (heroSearchInput) {
        heroSearchInput.value = '';
        heroSearchInput.focus();
      }
      const heroSearchClear = document.getElementById('hero-search-clear');
      if (heroSearchClear) heroSearchClear.style.display = 'none';
      state.displayedCount = 6;
      updateArticlesGrid();
    }

    // Initial render of grid
    updateArticlesGrid();

    // Bind hero search input
    const heroSearchInput = document.getElementById('hero-search-input');
    const heroSearchClear = document.getElementById('hero-search-clear');
    const heroSearchForm = document.getElementById('hero-search-form');

    if (heroSearchInput) {
      heroSearchInput.addEventListener('input', (e) => {
        state.homeSearchQuery = e.target.value;
        if (heroSearchClear) {
          heroSearchClear.style.display = e.target.value ? 'flex' : 'none';
        }
        state.displayedCount = 6;
        updateArticlesGrid();
      });
    }

    if (heroSearchClear) {
      heroSearchClear.addEventListener('click', clearHeroSearch);
    }

    if (heroSearchForm) {
      heroSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const feedSection = document.getElementById('main-articles-feed');
        if (feedSection) {
          feedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }

  // =========================================================================
  // 2. Full Article Reader View
  // =========================================================================
  async function renderPostPage(slug) {
    const article = state.articles.find(a => a.slug === slug);
    if (!article) {
      appContainer.innerHTML = `
        <div class="article-container" style="padding: 80px 20px; text-align: center;">
          <h2 style="font-family: var(--font-header); font-size: 2rem; margin-bottom: 16px;">Article Not Found</h2>
          <p style="color: var(--color-text-secondary); margin-bottom: 24px;">The newsletter edition you are looking for does not exist.</p>
          <a href="#/home" class="btn-subscribe-nav">Return to Homepage</a>
        </div>
      `;
      return;
    }

    const isLiked = !!state.likedPosts[article.slug];
    const currentLikes = article.likes + (isLiked ? 1 : 0);
    const postPoll = state.pollVotes[article.slug] || null;
    
    // Fetch comments from Supabase with fallback
    let postComments = [];
    if (window.DatabaseService) {
      postComments = await window.DatabaseService.getComments(article.slug);
    } else {
      postComments = state.comments[article.slug] || [];
    }

    const recommendedArticles = state.articles.filter(a => a.slug !== article.slug).slice(0, 2);

    appContainer.innerHTML = `
      <article class="article-page-view">
        <div class="article-container">
          <!-- Breadcrumb -->
          <div class="breadcrumb-nav">
            <a href="#/" class="breadcrumb-link">Home</a>
            <span class="breadcrumb-separator">/</span>
            <a href="#/archive" class="breadcrumb-link">Posts</a>
            <span class="breadcrumb-separator">/</span>
            <span>${article.title}</span>
          </div>

                    <!-- Header -->
          <header class="article-header">
            <span class="article-header-tag">${article.tag}</span>
            <h1 class="article-header-title">${article.title}</h1>
            <p class="article-header-subtitle">${article.subtitle}</p>

            <div class="article-header-meta">
              <div class="article-author-block">
                <img src="${article.author_avatar}" alt="${article.author}" class="article-author-img" onerror="this.src='assets/logo.svg'" />
                <div>
                  <div class="article-author-meta-name">${article.author}</div>
                  <div class="article-author-meta-date">${article.date} • ${article.reading_time}</div>
                </div>
              </div>

              <div class="article-action-buttons">
                <button class="action-btn ${isLiked ? 'liked' : ''}" id="btn-like-post" data-slug="${article.slug}">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="${isLiked ? '#EF4444' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  <span id="like-count-display">${currentLikes}</span>
                </button>
                <button class="action-btn" id="btn-share-post" data-title="${encodeURIComponent(article.title)}">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </header>

          <!-- Hero Cover Image -->
          <div class="article-hero-cover">
            <img src="${article.image_url}" alt="${article.title}" class="article-hero-img" loading="lazy" referrerpolicy="no-referrer" />
          </div>

          <!-- Body Content -->
          <div class="article-rich-body">
            ${article.body_html}
          </div>

          <!-- Inline Subscribe Card (Exact Dark UI) -->
          <div class="article-subscribe-card">
            <div class="article-sub-badge">
              <span class="sub-bolt-icon">⚡</span>
            </div>
            <h3 class="article-sub-title">Stay Ahead in AI with AIRA</h3>
            <p class="article-sub-desc">Get the latest breakthroughs, model benchmarks, tools, and tutorials delivered straight to your inbox.</p>
            
            <form class="article-sub-form-dark" id="article-sub-form">
              <div class="sub-dark-input-wrap">
                <input type="email" class="sub-dark-input" placeholder="Your email address" required />
                <button type="submit" class="sub-dark-btn">Subscribe</button>
              </div>
            </form>
          </div>

          <!-- Discussion Section (Exact Minimalist Clean UI) -->
          <section class="comments-section">
            <h3 class="comments-section-title">Discussion (${postComments.length})</h3>
            
            <form class="comment-composer-card" id="comment-form">
              <input type="text" id="comment-name-input" class="comment-name-input" placeholder="Your Name (Optional)" />
              <textarea class="comment-textarea" placeholder="Share your thoughts on this edition..." rows="3" required></textarea>
              <div class="comment-submit-row">
                <button type="submit" class="comment-submit-btn">Post Comment</button>
              </div>
            </form>

            <div class="comments-list" id="comments-list">
              ${postComments.length === 0 ? `
                <p class="comments-empty-text">No comments yet. Start the conversation!</p>
              ` : postComments.map(c => `
                <div class="comment-item">
                  <div class="comment-item-avatar">${(c.author || 'A').charAt(0).toUpperCase()}</div>
                  <div class="comment-item-content">
                    <div class="comment-author-row">
                      <span class="comment-author-name">${c.author}</span>
                      <span class="comment-date">${c.date}</span>
                    </div>
                    <p class="comment-text">${c.text}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- Recommended Reading ("Keep Reading" 2-Card Grid Design) -->
          <section class="recommended-section">
            <div class="recommended-header-row">
              <div class="recommended-header-left">
                <h3 class="recommended-title">Keep Reading</h3>
                <p class="recommended-subtitle">More popular editions from AIRA</p>
              </div>
              <a href="#/archive" class="btn-view-all-kr">View all →</a>
            </div>
            
            <div class="keep-reading-grid">
              ${recommendedArticles.map(rec => `
                <a href="#/p/${rec.slug}" class="kr-card">
                  <div class="kr-card-image-wrap">
                    <img src="${rec.image_url}" alt="${rec.title}" class="kr-card-img" loading="lazy" />
                    <span class="kr-card-badge">${(rec.tag || 'News').toUpperCase()}</span>
                  </div>
                  <div class="kr-card-body">
                    <h4 class="kr-card-title">${rec.title}</h4>
                    <p class="kr-card-subtitle">${rec.subtitle || ''}</p>
                    <div class="kr-card-footer">
                      <span class="kr-card-date">${rec.date} • ${rec.reading_time}</span>
                      <span class="kr-card-read-more">Read →</span>
                    </div>
                  </div>
                </a>
              `).join('')}
            </div>
          </section>
        </div>
      </article>
    `;

    // Bind Like Button
    const likeBtn = document.getElementById('btn-like-post');
    if (likeBtn) {
      likeBtn.addEventListener('click', async () => {
        const liked = !!state.likedPosts[article.slug];
        if (liked) {
          delete state.likedPosts[article.slug];
        } else {
          state.likedPosts[article.slug] = true;
          if (window.DatabaseService) {
            await window.DatabaseService.recordLike(article.slug);
          }
          showToast('Liked this edition! ❤️');
        }
        localStorage.setItem('aira_likes', JSON.stringify(state.likedPosts));
        await renderPostPage(article.slug);
      });
    }

    // Bind Share Button
    const shareBtn = document.getElementById('btn-share-post');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('Link copied to clipboard! 📋');
          });
        } else {
          showToast('Share link ready!');
        }
      });
    }

    // Bind Article Inline Subscribe
    const artSubForm = document.getElementById('article-sub-form');
    if (artSubForm) {
      artSubForm.addEventListener('submit', handleSubscribeSubmit);
    }

    // Bind Comment Submission
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
      commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('comment-name-input');
        const textarea = commentForm.querySelector('.comment-textarea');
        const text = textarea.value.trim();
        const author = nameInput ? nameInput.value.trim() || 'AI Enthusiast' : 'AI Enthusiast';
        if (!text) return;

        if (window.DatabaseService) {
          await window.DatabaseService.postComment(article.slug, author, text);
        }

        showToast('Comment posted! 💬');
        await renderPostPage(article.slug);
      });
    }
  }

  // =========================================================================
  // 3. Archive View (All 56 Articles Chronologically)
  // =========================================================================
  function renderArchivePage() {
    appContainer.innerHTML = `
      <section class="archive-page-view">
        <div class="article-container">
          <h1 class="page-title">Archive</h1>
          <p class="page-description">Complete chronological history of all ${state.articles.length} AIRA newsletter editions and guides.</p>

          <div class="timeline-list">
            ${state.articles.map(article => `
              <div class="timeline-item" onclick="window.location.hash='#/p/${article.slug}'">
                <div class="timeline-content">
                  <h4>${article.title}</h4>
                  <p>${article.subtitle}</p>
                </div>
                <div class="timeline-meta">
                  <span>${article.date}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
  // =========================================================================
  // 4. Tags / AI Tools Directory View
  // =========================================================================
  function renderTagsPage() {
    const toolsData = typeof AI_TOOLS_DATA !== 'undefined' ? AI_TOOLS_DATA : { categories: [], tools: [] };
    const allTools = toolsData.tools || [];
    const categories = toolsData.categories || [];

    // Helper to get category display name
    function getCategoryName(catId) {
      const found = categories.find(c => c.id === catId);
      return found ? found.name : catId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // Helper to calculate tool count per category
    function getCategoryCount(catId) {
      if (catId === 'all') return allTools.length;
      return allTools.filter(t => (t.categories && t.categories.includes(catId)) || t.category === catId).length;
    }

    const initialVisibleCount = 18;
    const activeIndex = categories.findIndex(c => c.id === state.toolCategoryFilter);
    const isExpanded = state.categoriesExpanded || (activeIndex >= initialVisibleCount);
    const visibleCategories = isExpanded ? categories : categories.slice(0, initialVisibleCount);
    const hasMore = categories.length > initialVisibleCount;

    function getFilteredTools() {
      return allTools.filter(tool => {
        // Category filter
        if (state.toolCategoryFilter !== 'all') {
          const matchCat = (tool.categories && tool.categories.includes(state.toolCategoryFilter)) || tool.category === state.toolCategoryFilter;
          if (!matchCat) return false;
        }

        // Pricing filter
        if (state.toolPricingFilter !== 'all') {
          if (tool.pricing.toLowerCase() !== state.toolPricingFilter.toLowerCase()) return false;
        }

        // Search query
        if (state.toolSearchQuery.trim() !== '') {
          const q = state.toolSearchQuery.trim().toLowerCase();
          const nameMatch = tool.name.toLowerCase().includes(q);
          const descMatch = tool.description.toLowerCase().includes(q);
          const catMatch = tool.categories ? tool.categories.some(c => c.toLowerCase().includes(q)) : false;
          const badgeMatch = tool.badge ? tool.badge.toLowerCase().includes(q) : false;
          if (!nameMatch && !descMatch && !catMatch && !badgeMatch) return false;
        }

        return true;
      });
    }

    function renderToolCard(tool) {
      const pricingClass = `pricing-${(tool.pricing || 'free').toLowerCase().replace(/\s+/g, '-')}`;
      const firstCats = (tool.categories || [tool.category || 'productivity']).slice(0, 3);
      const cleanDomain = (tool.domain || '').replace(/^https?:\/\//, '').split('/')[0].trim() || 'ai.com';
      const logoUrl = tool.image || `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
      const duckLogo = `https://icons.duckduckgo.com/ip3/${cleanDomain}.ico`;
      const fallbackIcon = tool.icon || '⚡';

      return `
        <div class="tool-card ${tool.featured ? 'is-featured' : ''}" data-tool-id="${tool.id}">
          <div class="tool-card-top">
            <div class="tool-icon-avatar">
              <img src="${logoUrl}" alt="${tool.name} logo" class="tool-logo-img" loading="lazy" onerror="if(!this.dataset.triedDuck){ this.dataset.triedDuck='true'; this.src='${duckLogo}'; } else { this.onerror=null; this.parentElement.innerHTML='<span class=\\'tool-emoji\\'>${fallbackIcon}</span>'; }" />
            </div>
            <div class="tool-title-group">
              <div class="tool-badges-row">
                ${tool.featured ? `<span class="tool-badge-featured"><span class="bolt">⚡</span> ${tool.badge || 'Featured'}</span>` : (tool.badge ? `<span class="tool-badge-neutral">${tool.badge}</span>` : '')}
                <span class="tool-badge-pricing ${pricingClass}">${tool.pricing}</span>
              </div>
              <h3 class="tool-card-name" title="${tool.name}">${tool.name}</h3>
            </div>
          </div>

          <p class="tool-card-desc">${tool.description}</p>

          <div class="tool-card-bottom">
            <div class="tool-pill-tags">
              ${firstCats.map(c => `
                <button type="button" class="tool-category-badge" data-category="${c}">
                  ${getCategoryName(c)}
                </button>
              `).join('')}
            </div>

            <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="tool-direct-visit-btn" title="Open ${tool.name}">
              <span>Visit</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>
        </div>
      `;
    }

    function updateView() {
      const filtered = getFilteredTools();
      const currentCatObj = categories.find(c => c.id === state.toolCategoryFilter);
      const currentCatName = currentCatObj ? currentCatObj.name : 'All Tools';

      const gridEl = document.getElementById('tools-grid-container');
      const countEl = document.getElementById('tools-count-container');

      if (countEl) {
        countEl.innerHTML = `
          <div class="tools-count-text">
            Showing <strong>${filtered.length}</strong> ${filtered.length === 1 ? 'AI tool' : 'AI tools'}
            ${state.toolCategoryFilter !== 'all' ? ` in <span class="active-cat-name">${currentCatName}</span>` : ''}
            ${state.toolPricingFilter !== 'all' ? ` • <span class="active-pricing-name">${state.toolPricingFilter}</span>` : ''}
            ${state.toolSearchQuery ? ` • matching "<em>${state.toolSearchQuery}</em>"` : ''}
          </div>
          ${(state.toolCategoryFilter !== 'all' || state.toolPricingFilter !== 'all' || state.toolSearchQuery) ? `
            <button class="reset-filters-btn" id="btn-reset-tools-filters">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              <span>Reset filters</span>
            </button>
          ` : ''}
        `;

        const resetBtn = document.getElementById('btn-reset-tools-filters');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            state.toolCategoryFilter = 'all';
            state.toolPricingFilter = 'all';
            state.toolSearchQuery = '';
            const searchInputEl = document.getElementById('tool-search-input');
            if (searchInputEl) searchInputEl.value = '';
            const clearBtnEl = document.getElementById('tool-search-clear');
            if (clearBtnEl) clearBtnEl.style.display = 'none';
            document.querySelectorAll('.cat-filter-pill').forEach(p => {
              p.classList.toggle('active', p.getAttribute('data-cat-id') === 'all');
            });
            document.querySelectorAll('.pricing-filter-pill').forEach(p => {
              p.classList.toggle('active', p.getAttribute('data-pricing') === 'all');
            });
            updateView();
          });
        }
      }

      if (gridEl) {
        if (filtered.length === 0) {
          gridEl.innerHTML = `
            <div class="tools-empty-state">
              <div class="empty-state-icon">⚡</div>
              <h3 class="empty-state-title">No AI tools found</h3>
              <p class="empty-state-desc">No tools matched your active search or filters. Try adjusting your query or resetting filters.</p>
              <button class="empty-reset-action-btn" id="btn-empty-reset">Show All AI Tools</button>
            </div>
          `;
          const emptyResetBtn = document.getElementById('btn-empty-reset');
          if (emptyResetBtn) {
            emptyResetBtn.addEventListener('click', () => {
              state.toolCategoryFilter = 'all';
              state.toolPricingFilter = 'all';
              state.toolSearchQuery = '';
              const searchInputEl = document.getElementById('tool-search-input');
              if (searchInputEl) searchInputEl.value = '';
              renderTagsPage();
            });
          }
        } else {
          gridEl.innerHTML = filtered.map(renderToolCard).join('');
          // Bind card tag clicks
          gridEl.querySelectorAll('.tool-category-badge').forEach(badge => {
            badge.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              const cat = badge.getAttribute('data-category');
              if (cat) {
                state.toolCategoryFilter = cat;
                const idx = categories.findIndex(c => c.id === cat);
                if (idx >= initialVisibleCount) {
                  state.categoriesExpanded = true;
                  renderTagsPage();
                } else {
                  document.querySelectorAll('.cat-filter-pill').forEach(p => {
                    const isMatch = p.getAttribute('data-cat-id') === cat;
                    p.classList.toggle('active', isMatch);
                  });
                  updateView();
                }
              }
            });
          });
        }
      }
    }

    appContainer.innerHTML = `
      <section class="tools-directory-view">
        <div class="container">
          <!-- Directory Hero Header -->
          <div class="tools-hero-banner">
            <div class="tools-hero-badge">
              <span class="bolt">⚡</span>
              <span>AIRA Directory • ${allTools.length} AI Tools • ${categories.length - 1} Categories</span>
            </div>
            <h1 class="tools-hero-title">AI Tools & Categories</h1>
            <p class="tools-hero-subtitle">
              Discover, compare, and explore the most powerful AI tools, models, and apps across every workflow.
            </p>

            <!-- Search & Pricing Control Bar -->
            <div class="tools-controls-row">
              <div class="tool-search-box-wrap">
                <svg class="tool-search-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" id="tool-search-input" class="tool-search-field" placeholder="Search by tool name, use-case, features..." value="${state.toolSearchQuery}" />
                <button type="button" id="tool-search-clear" class="tool-search-clear-btn" style="display: ${state.toolSearchQuery ? 'flex' : 'none'};">✕</button>
              </div>

              <div class="tools-pricing-pill-group">
                <button type="button" class="pricing-filter-pill ${state.toolPricingFilter === 'all' ? 'active' : ''}" data-pricing="all">All</button>
                <button type="button" class="pricing-filter-pill ${state.toolPricingFilter === 'Free' ? 'active' : ''}" data-pricing="Free">Free</button>
                <button type="button" class="pricing-filter-pill ${state.toolPricingFilter === 'Freemium' ? 'active' : ''}" data-pricing="Freemium">Freemium</button>
                <button type="button" class="pricing-filter-pill ${state.toolPricingFilter === 'Paid' ? 'active' : ''}" data-pricing="Paid">Paid</button>
              </div>
            </div>

            <!-- Categories Clean Responsive Box -->
            <div class="categories-filter-wrapper">
              <div class="categories-filter-grid" id="categories-filter-grid">
                ${visibleCategories.map(cat => {
                  const count = getCategoryCount(cat.id);
                  const isActive = state.toolCategoryFilter === cat.id;
                  return `
                    <button type="button" class="cat-filter-pill ${isActive ? 'active' : ''}" data-cat-id="${cat.id}">
                      <span class="cat-pill-icon">${cat.icon || '🏷️'}</span>
                      <span class="cat-pill-name">${cat.name}</span>
                      <span class="cat-pill-count">${count}</span>
                    </button>
                  `;
                }).join('')}
              </div>

              ${hasMore ? `
                <div class="categories-toggle-row">
                  <button type="button" class="btn-toggle-all-cats" id="btn-toggle-all-cats">
                    <span>${isExpanded ? 'Show Less ▴' : `Show All ${categories.length} Categories (${categories.length - initialVisibleCount} more) ▾`}</span>
                  </button>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Status Bar -->
          <div class="tools-status-bar" id="tools-count-container"></div>

          <!-- Grid of Tool Cards -->
          <div class="tools-directory-grid" id="tools-grid-container"></div>
        </div>
      </section>
    `;

    // Bind Category Filter Buttons
    document.querySelectorAll('.cat-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const catId = pill.getAttribute('data-cat-id');
        state.toolCategoryFilter = catId;
        document.querySelectorAll('.cat-filter-pill').forEach(p => p.classList.toggle('active', p === pill));
        updateView();
      });
    });

    // Bind Toggle All Categories Button
    const toggleCatsBtn = document.getElementById('btn-toggle-all-cats');
    if (toggleCatsBtn) {
      toggleCatsBtn.addEventListener('click', () => {
        state.categoriesExpanded = !isExpanded;
        renderTagsPage();
      });
    }

    // Bind Pricing Filter Buttons
    document.querySelectorAll('.pricing-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const pricing = pill.getAttribute('data-pricing');
        state.toolPricingFilter = pricing;
        document.querySelectorAll('.pricing-filter-pill').forEach(p => p.classList.toggle('active', p === pill));
        updateView();
      });
    });

    // Bind Search Input
    const searchInput = document.getElementById('tool-search-input');
    const searchClear = document.getElementById('tool-search-clear');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.toolSearchQuery = e.target.value;
        if (searchClear) {
          searchClear.style.display = e.target.value ? 'flex' : 'none';
        }
        updateView();
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        state.toolSearchQuery = '';
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        searchClear.style.display = 'none';
        updateView();
      });
    }

    // Initial render of cards
    updateView();
  }

  // =========================================================================
  // Article Templates & Card Data Library for Visual Studio
  // =========================================================================
  const ARTICLE_TEMPLATES = [
    {
      id: 'beehiiv-signal',
      name: '🐝 Beehiiv Signature (Story Cards)',
      tag: 'News',
      readingTime: '4 minutes',
      desc: 'Top Green Banner (THE SIGNAL) + Story Cards + Takeaways + Tool Stack + Quotes',
      sampleTitle: 'Practical plays, shipped fast 🚀',
      sampleSubtitle: 'PLUS: All you need for AI agents that convert, micro-products that win, and tools that end fatigue',
      cardData: {
        intro: 'Hey there, this week we are cutting through the noise and focusing on what actually moves companies forward.\n\nHere is the playbook: just three stories and one clear action item from your AI arsenal, contextualized for maximum growth. No fluffy AI hype, just practical plays, shipped fast.',
        stories: [
          {
            tag: 'GROWTH / CASE STUDY',
            title: 'AI touches the physical world',
            image: 'assets/logo.jpg',
            imageCaption: 'Robotics in action - Courtesy: OpenAI & Physical Intelligence',
            imageLink: '',
            body: 'Robotics moves beyond labs and enters factory floors. Instead of code-only tasks, models are now picking, grasping, packing, and sorting with autonomy that surpasses traditional deterministic automation by 4x across initial pilots.',
            takeaway: 'Look for physical or hardware touchpoints where multimodal reasoning can eliminate manual triage.',
            quote: 'The next wave of AI isn\'t chatbots answering your questions, it\'s AI models taking autonomous actions in the physical world.',
            quoteAuthor: 'Jensen Huang'
          },
          {
            tag: 'AI / TECH / TRENDS',
            title: '01: The new feed is your inbox',
            image: 'assets/logo.jpg',
            imageCaption: 'Image Source: AIRA Research & Insights',
            imageLink: '',
            body: 'Audiences are shifting attention to curated email newsletters where algorithms cannot hide content. Direct distribution builds higher affinity, 6x higher conversion on offers, and guaranteed inbox delivery.',
            takeaway: 'You will be in a position where you can command audience attention without paying gatekeeper tax on every post.',
            quote: '',
            quoteAuthor: ''
          },
          {
            tag: 'CREATOR ECONOMY',
            title: '02: Micro-monetization is back',
            image: 'assets/logo.jpg',
            imageCaption: 'Micro-payments and direct-to-creator paradigm',
            imageLink: '',
            body: 'Tiny paid perks, tokenized access, and micro-subscriptions generate higher lifetime values than bloated courses. Readers pay for speed, clarity, and instant access.',
            takeaway: 'Package one core solution that saves 2 to 10 hours. Price it for impulsive purchase and instant ROI.',
            quote: '',
            quoteAuthor: ''
          }
        ],
        tools: [
          { name: 'Flux Pro', link: 'https://blackforestlabs.ai', desc: 'State-of-the-art AI imagery model for photoreal cover banners.' },
          { name: 'Claude Code', link: 'https://anthropic.com', desc: 'AI agent for instant multi-file software engineering in terminal.' },
          { name: 'ClickTailwind', link: 'https://tailwindcss.com', desc: 'Curates everything you need for responsive web cards.' }
        ],
        newsbites: [
          { source: 'Mistral AI', text: 'Secures €3B round for next-gen models.' },
          { source: 'Google DeepMind', text: 'Releases new multimodal benchmark.' },
          { source: 'NVIDIA', text: 'Unveils next-generation AI accelerators with 4x memory bandwidth.' }
        ],
        signoff: 'Until next week,\nAIRA'
      }
    },
    {
      id: 'news-standard',
      name: '📰 Standard AI News Edition',
      tag: 'News',
      readingTime: '4 minutes',
      desc: 'Intro briefing + 2 Main stories + Takeaway boxes + Featured tools + News bites',
      sampleTitle: 'Next-Gen AI Breakthrough: Key Insights & Industry Impact',
      sampleSubtitle: 'Plus: Top AI Tools and Weekly Intelligence Breakdown',
      cardData: {
        intro: 'Welcome back to AIRA — your essential intelligence briefing on cutting-edge AI breakthroughs, models, tools, and tutorials.\n\nHere is what we are unpacking in today\'s edition:',
        stories: [
          {
            tag: '01: MAJOR HEADLINE',
            title: 'Breakthrough Model Capabilities Announced',
            image: 'assets/logo.jpg',
            imageCaption: 'Image Source: AIRA Intelligence',
            imageLink: '',
            body: 'A new frontier model release has shattered previous reasoning benchmarks across mathematics, coding, and logical inference.\n\nDevelopers can now access this directly via API at 50% lower cost per token.',
            takeaway: 'Integrate automated reasoning pipelines early to capture market share.',
            quote: '',
            quoteAuthor: ''
          },
          {
            tag: '02: ENTERPRISE',
            title: 'Strategic AI Infrastructure Consolidations',
            image: 'assets/logo.jpg',
            imageCaption: 'Enterprise cloud deployments in 2026',
            imageLink: '',
            body: 'Global enterprises are rapidly consolidating their AI infrastructure to build customized internal agents with full data privacy guarantees.',
            takeaway: 'Enterprise security and compliance are driving faster adoption of self-hosted weights.',
            quote: '',
            quoteAuthor: ''
          }
        ],
        tools: [
          { name: 'AgentX', link: 'https://example.com', desc: 'Automates customer support workflows and data entry.' },
          { name: 'CodeRefactor AI', link: 'https://example.com', desc: 'Full-stack code refactoring and bug identification.' }
        ],
        newsbites: [
          { source: 'OpenAI', text: 'Deploys real-time reasoning models to enterprise tiers.' },
          { source: 'Meta AI', text: 'Expands real-time voice translation features.' }
        ],
        signoff: 'Until next time,\nAIRA'
      }
    },
    {
      id: 'tool-review',
      name: '🛠️ AI Tool Review & Breakdown',
      tag: 'AI Tools',
      readingTime: '5 minutes',
      desc: 'Tool overview + Specs + Killer features + Verdict & Takeaway',
      sampleTitle: 'Hands-On Review: Testing the Most Powerful AI Coding Workspace',
      sampleSubtitle: 'Features, Benchmarks, Pros & Cons, and How It Compares to Alternatives',
      cardData: {
        intro: 'Welcome back to AIRA. Today we are diving deep into a comprehensive review of a groundbreaking AI productivity tool designed to transform developer workflows.',
        stories: [
          {
            tag: 'TOOL SPOTLIGHT',
            title: 'Overview & What It Does',
            image: 'assets/logo.jpg',
            imageCaption: 'Platform interface and workflow automation',
            imageLink: '',
            body: 'This platform combines modern language models with a deeply integrated workspace, allowing users to build and automate complex tasks in minutes.\n\nKey Specs:\n• Category: AI Coding & Productivity\n• Pricing: Free Starter tier / $20 per month Pro\n• Best For: Engineers, Designers, and Solo Founders',
            takeaway: 'Saves 5-10 hours weekly for active developers.',
            quote: '',
            quoteAuthor: ''
          },
          {
            tag: 'VERDICT',
            title: 'Top Features & Final Score',
            image: 'assets/logo.jpg',
            imageCaption: 'Benchmark results vs alternatives',
            imageLink: '',
            body: 'Top Features:\n1. Autonomous Workspace Agents: Multi-file refactoring without manual intervention.\n2. Infinite Context Indexing: Instant codebase recall.\n3. One-Click Staging Deployments.\n\nOverall Score: 9.2 / 10. A must-try tool for any modern creator or engineer.',
            takeaway: 'Start on the free tier to benchmark against your existing stack.',
            quote: '',
            quoteAuthor: ''
          }
        ],
        tools: [],
        newsbites: [],
        signoff: 'Until next time,\nAIRA'
      }
    },
    {
      id: 'prompt-tutorial',
      name: '💡 AI Prompt & Step-by-Step Tutorial',
      tag: 'Prompts',
      readingTime: '4 minutes',
      desc: 'Goal + Copyable master prompt + Step-by-step tutorial + Pro-tips',
      sampleTitle: 'Master Prompting: The Exact Framework to Generate Flawless Code',
      sampleSubtitle: 'Step-by-Step Guide, Copy-Paste Prompt Template, and Real-World Examples',
      cardData: {
        intro: 'Welcome to AIRA\'s prompt engineering masterclass. In this edition, we share an exact formula you can use right away to generate clean, bug-free outputs from any frontier model.',
        stories: [
          {
            tag: 'THE FRAMEWORK',
            title: 'Why Generic Prompts Fail & The Solution',
            image: 'assets/logo.jpg',
            imageCaption: 'Structured prompt framework architecture',
            imageLink: '',
            body: 'Most people give models vague instructions like "Write code for a login page". The model has to guess constraints, framework choices, and security considerations.\n\nInstead, structured role prompting with explicit constraints yields 10x better results.',
            takeaway: 'Always define the Persona, Task, Tech Constraints, and Output Format.',
            quote: '',
            quoteAuthor: ''
          },
          {
            tag: 'STEP-BY-STEP',
            title: 'How to Implement the Framework',
            image: 'assets/logo.jpg',
            imageCaption: 'Execution workflow in Claude & ChatGPT',
            imageLink: '',
            body: 'Follow these 3 steps:\n• Step 1: Set the Persona & Role (define seniority).\n• Step 2: Provide Domain Constraints (list libraries & schemas).\n• Step 3: Force Verification (ask model to double-check its logic before producing output).',
            takeaway: 'Always include one "Bad Example" to show the model what mistakes to avoid.',
            quote: '',
            quoteAuthor: ''
          }
        ],
        tools: [],
        newsbites: [],
        signoff: 'Until next time,\nAIRA'
      }
    },
    {
      id: 'blank-clean',
      name: '📄 Clean Simple Starter',
      tag: 'News',
      readingTime: '3 minutes',
      desc: 'Single story starter with image, description, and takeaway',
      sampleTitle: 'Title of Your New Article Edition',
      sampleSubtitle: 'Subtitle or key highlight of this edition',
      cardData: {
        intro: 'Welcome back to AIRA — your essential intelligence briefing on cutting-edge AI breakthroughs, models, tools, and tutorials.',
        stories: [
          {
            tag: '01: MAIN STORY',
            title: 'Main Headline of Your Story',
            image: 'assets/logo.jpg',
            imageCaption: 'Image Source: AIRA Intelligence',
            imageLink: '',
            body: 'Write your story text here. Simply type paragraphs or bullet points directly.\n\nYou can easily upload your own picture or paste an image web link above.',
            takeaway: 'Key takeaway or action item for your readers.',
            quote: '',
            quoteAuthor: ''
          }
        ],
        tools: [],
        newsbites: [],
        signoff: 'Until next time,\nAIRA'
      }
    }
  ];

  function parseBodyHtmlToCardData(html) {
    const defaultData = ARTICLE_TEMPLATES[0].cardData;
    if (!html || typeof html !== 'string' || !html.trim()) {
      return JSON.parse(JSON.stringify(defaultData));
    }
    const strip = (s) => (s || '').replace(/<[^>]+>/g, '').trim();

    if (html.includes('beehiiv-card')) {
      const cardRegex = /<div class="beehiiv-card[^"]*">([\s\S]*?)<\/div>\s*(?=(?:<div class="beehiiv-card|<div class="author-signoff"|<\/div>\s*$))/gi;
      const matches = [...html.matchAll(cardRegex)];
      if (matches.length > 0) {
        let intro = '';
        const stories = [];
        const tools = [];
        const newsbites = [];
        let signoff = 'Until next week,\nAIRA';

        matches.forEach((m, idx) => {
          const block = m[1];
          if (block.includes('beehiiv-banner-header') || (idx === 0 && !block.includes('beehiiv-headline') && !block.includes('<h2') && !block.includes('<h3'))) {
            intro = strip(block.replace(/<div class="beehiiv-banner-header"[\s\S]*?<\/div>/i, ''));
          } else if (block.includes('Tool Stack') || block.includes('Featured AI Tools') || block.includes('🛠️')) {
            const toolMatches = [...block.matchAll(/<strong><a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>:?<\/strong>\s*:?\s*([\s\S]*?)(?:<\/p>|$)/gi)];
            toolMatches.forEach(tm => {
              tools.push({
                name: strip(tm[2]),
                link: tm[1] === '#' ? '' : tm[1],
                desc: strip(tm[3])
              });
            });
          } else if (block.includes('News Bites') || block.includes('Quick AI News') || block.includes('⚡')) {
            const biteMatches = [...block.matchAll(/<li>(?:<strong>)?([\s\S]*?)(?:<\/strong>)?\s*:?\s*([\s\S]*?)<\/li>/gi)];
            biteMatches.forEach(bm => {
              newsbites.push({
                source: strip(bm[1]).replace(/:$/, ''),
                text: strip(bm[2])
              });
            });
          } else {
            const tagM = block.match(/<span class="beehiiv-tag">([\s\S]*?)<\/span>/i);
            const headM = block.match(/<h[23][^>]*class="beehiiv-headline"[^>]*>([\s\S]*?)<\/h[23]>/i) || block.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/i);
            const imgM = block.match(/<img[^>]+src="([^">]+)"[^>]*>/i);
            const linkM = block.match(/<a[^>]+href="([^">]+)"[^>]*>\s*<img/i);
            const captionM = block.match(/<(?:small|p)[^>]*class="beehiiv-caption"[^>]*>([\s\S]*?)<\/(?:small|p)>/i) || block.match(/<small[^>]*>([\s\S]*?)<\/small>/i);
            const takeawayM = block.match(/<div class="beehiiv-takeaway">([\s\S]*?)<\/div>/i);
            const quoteM = block.match(/<div class="beehiiv-quote">([\s\S]*?)<\/div>/i);
            let quoteAuthor = '';
            let quoteText = '';
            if (quoteM) {
              const authorM = quoteM[1].match(/<div class="author">([\s\S]*?)<\/div>/i);
              if (authorM) quoteAuthor = strip(authorM[1]).replace(/^[—–-]\s*/, '');
              quoteText = strip(quoteM[1].replace(/<div class="author"[\s\S]*?<\/div>/i, '')).replace(/^"|"$/g, '');
            }

            let bodyText = block
              .replace(/<span class="beehiiv-tag"[\s\S]*?<\/span>/gi, '')
              .replace(/<h[23][\s\S]*?<\/h[23]>/gi, '')
              .replace(/<div class="section-image-box"[\s\S]*?<\/div>/gi, '')
              .replace(/<img[^>]*>/gi, '')
              .replace(/<div class="beehiiv-takeaway"[\s\S]*?<\/div>/gi, '')
              .replace(/<div class="beehiiv-quote"[\s\S]*?<\/div>/gi, '')
              .trim();

            stories.push({
              tag: tagM ? strip(tagM[1]) : `Story ${stories.length + 1}`,
              title: headM ? strip(headM[1]) : 'Story Headline',
              image: imgM ? imgM[1] : '',
              imageCaption: captionM ? strip(captionM[1]) : '',
              imageLink: linkM ? linkM[1] : '',
              body: bodyText,
              takeaway: takeawayM ? strip(takeawayM[1]).replace(/^Takeaway:\s*/i, '') : '',
              quote: quoteText,
              quoteAuthor: quoteAuthor
            });
          }
        });

        const signoffM = html.match(/<div class="author-signoff"[^>]*>([\s\S]*?)<\/div>/i);
        if (signoffM) signoff = strip(signoffM[1].replace(/<br\s*\/?>/gi, '\n'));

        return {
          intro: intro || defaultData.intro,
          stories: stories.length > 0 ? stories : defaultData.stories,
          tools: tools.length > 0 ? tools : defaultData.tools,
          newsbites: newsbites.length > 0 ? newsbites : defaultData.newsbites,
          signoff
        };
      }
    }

    const headingRegex = /<h([234])[^>]*>([\s\S]*?)<\/h\1>/gi;
    const matches = [...html.matchAll(headingRegex)];
    
    if (matches.length > 0) {
      const introHtml = html.slice(0, matches[0].index).replace(/^<div id="content-blocks">\s*(?:<div>)?/i, '').trim();
      const stories = [];
      const tools = [];
      const newsbites = [];

      matches.forEach((m, i) => {
        const nextStart = (i + 1 < matches.length) ? matches[i + 1].index : html.length;
        const sectionContent = html.slice(m.index + m[0].length, nextStart);
        const title = strip(m[2]);

        if (title.includes('Featured AI Tools') || title.includes('Tool Stack') || title.includes('🛠️')) {
          const toolMatches = [...sectionContent.matchAll(/<strong><a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>:?<\/strong>\s*:?\s*([\s\S]*?)(?:<\/p>|$)/gi)];
          toolMatches.forEach(tm => {
            tools.push({
              name: strip(tm[2]),
              link: tm[1] === '#' ? '' : tm[1],
              desc: strip(tm[3])
            });
          });
        } else if (title.includes('News Bites') || title.includes('Quick AI News') || title.includes('⚡')) {
          const biteMatches = [...sectionContent.matchAll(/<li>(?:<strong>)?([\s\S]*?)(?:<\/strong>)?\s*:?\s*([\s\S]*?)<\/li>/gi)];
          biteMatches.forEach(bm => {
            newsbites.push({
              source: strip(bm[1]).replace(/:$/, ''),
              text: strip(bm[2])
            });
          });
        } else {
          const imgM = sectionContent.match(/<img[^>]+src="([^">]+)"[^>]*>/i);
          const linkM = sectionContent.match(/<a[^>]+href="([^">]+)"[^>]*>\s*<img/i);
          const captionM = sectionContent.match(/<small[^>]*>([\s\S]*?)<\/small>/i) || sectionContent.match(/<p[^>]*class="[^"]*caption[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
          const takeawayM = sectionContent.match(/<div class="[^"]*(?:takeaway|perspective)[^"]*"[^>]*>([\s\S]*?)<\/div>/i);

          let cleanBody = sectionContent
            .replace(/<div class="section-image-box"[\s\S]*?<\/div>/gi, '')
            .replace(/<img[^>]*>/gi, '')
            .replace(/<div class="[^"]*(?:takeaway|perspective)[^"]*"[\s\S]*?<\/div>/gi, '')
            .replace(/<div class="author-signoff"[\s\S]*?<\/div>/gi, '')
            .replace(/<\/div>\s*<\/div>\s*$/i, '')
            .trim();

          stories.push({
            tag: `0${stories.length + 1}: ${title.split(':')[0] || 'STORY'}`.slice(0, 24).toUpperCase(),
            title: title.replace(/^[\d\s.:\p{Emoji}]+/u, '').trim() || title,
            image: imgM ? imgM[1] : '',
            imageCaption: captionM ? strip(captionM[1]) : '',
            imageLink: linkM ? linkM[1] : '',
            body: cleanBody,
            takeaway: takeawayM ? strip(takeawayM[1]).replace(/^.*?(?:Takeaway|Perspective):\s*/i, '') : '',
            quote: '',
            quoteAuthor: ''
          });
        }
      });

      const signoffM = html.match(/<div class="author-signoff"[^>]*>([\s\S]*?)<\/div>/i);
      const signoff = signoffM ? strip(signoffM[1].replace(/<br\s*\/?>/gi, '\n')) : 'Until next week,\nAIRA';

      return {
        intro: strip(introHtml) || defaultData.intro,
        stories: stories.length > 0 ? stories : defaultData.stories,
        tools: tools.length > 0 ? tools : defaultData.tools,
        newsbites: newsbites.length > 0 ? newsbites : defaultData.newsbites,
        signoff
      };
    }

    return JSON.parse(JSON.stringify(defaultData));
  }

  function compileCardDataToHtml(cardData) {
    let html = '<div id="content-blocks">\n';

    if (cardData.intro && cardData.intro.trim()) {
      html += '  <div class="beehiiv-card border-green" style="margin-bottom: 24px;">\n';
      html += '    <div class="beehiiv-banner-header">THE SIGNAL</div>\n';
      const introLines = cardData.intro.trim().split(/\n\n+/);
      introLines.forEach(line => {
        html += `    <p>${line.trim().replace(/\n/g, '<br/>')}</p>\n`;
      });
      html += '  </div>\n\n';
    }

    if (Array.isArray(cardData.stories)) {
      cardData.stories.forEach((story, idx) => {
        html += `  <!-- Story Card ${idx + 1} -->\n`;
        html += '  <div class="beehiiv-card border-green">\n';
        
        if (story.tag && story.tag.trim()) {
          html += `    <span class="beehiiv-tag">${story.tag.trim()}</span>\n`;
        }
        
        if (story.title && story.title.trim()) {
          html += `    <h2 class="beehiiv-headline">${story.title.trim()}</h2>\n`;
        }

        if (story.image && story.image.trim()) {
          html += '    <div class="section-image-box" style="margin: 18px 0; text-align: center;">\n';
          if (story.imageLink && story.imageLink.trim()) {
            html += `      <a href="${story.imageLink.trim()}" target="_blank" rel="noopener noreferrer">\n`;
            html += `        <img src="${story.image.trim()}" alt="${(story.title || 'Story image').replace(/"/g, '&quot;')}" class="section-inline-img" style="width: 100%; max-height: 440px; object-fit: cover; border-radius: 8px;" loading="lazy" />\n`;
            html += '      </a>\n';
          } else {
            html += `      <img src="${story.image.trim()}" alt="${(story.title || 'Story image').replace(/"/g, '&quot;')}" class="section-inline-img" style="width: 100%; max-height: 440px; object-fit: cover; border-radius: 8px;" loading="lazy" />\n`;
          }
          if (story.imageCaption && story.imageCaption.trim()) {
            html += `      <small><p class="beehiiv-caption">${story.imageCaption.trim()}</p></small>\n`;
          }
          html += '    </div>\n';
        }

        if (story.body && story.body.trim()) {
          const bodyContent = story.body.trim();
          if (bodyContent.includes('<p>') || bodyContent.includes('<ul>') || bodyContent.includes('<div>')) {
            html += `    ${bodyContent}\n`;
          } else {
            const paras = bodyContent.split(/\n\n+/).filter(p => p.trim());
            paras.forEach(p => {
              html += `    <p>${p.trim().replace(/\n/g, '<br/>')}</p>\n`;
            });
          }
        }

        if (story.takeaway && story.takeaway.trim()) {
          html += `    <div class="beehiiv-takeaway">\n      <p style="margin: 0; color: #166534; font-size: 0.95rem;"><strong>Takeaway:</strong> ${story.takeaway.trim()}</p>\n    </div>\n`;
        }

        if (story.quote && story.quote.trim()) {
          html += `    <div class="beehiiv-quote">\n      "${story.quote.trim()}"\n`;
          if (story.quoteAuthor && story.quoteAuthor.trim()) {
            html += `      <div class="author">— ${story.quoteAuthor.trim()}</div>\n`;
          }
          html += '    </div>\n';
        }

        html += '  </div>\n\n';
      });
    }

    if (Array.isArray(cardData.tools) && cardData.tools.length > 0) {
      html += '  <!-- Featured Tools -->\n';
      html += '  <div class="beehiiv-card border-green">\n';
      html += '    <h3 style="font-family: var(--font-header); font-size: 1.25rem; font-weight: 800; color: #0F172A; margin: 0 0 14px 0;">\n';
      html += '      🛠️ Tool Stack of the Week:\n';
      html += '    </h3>\n';
      html += '    <div style="display: flex; flex-direction: column; gap: 10px;">\n';
      cardData.tools.forEach(t => {
        html += `      <p style="margin: 0;"><strong><a href="${t.link || '#'}" class="beehiiv-link" target="_blank">${t.name || 'Tool'}</a>:</strong> ${t.desc || ''}</p>\n`;
      });
      html += '    </div>\n';
      html += '  </div>\n\n';
    }

    if (Array.isArray(cardData.newsbites) && cardData.newsbites.length > 0) {
      html += '  <!-- Quick News Bites -->\n';
      html += '  <div class="beehiiv-card border-green">\n';
      html += '    <h3 style="font-family: var(--font-header); font-size: 1.25rem; font-weight: 800; color: #0F172A; margin: 0 0 14px 0;">\n';
      html += '      ⚡ Quick AI News Bites\n';
      html += '    </h3>\n';
      html += '    <ul style="margin: 0 0 0 20px; padding: 0; line-height: 1.6;">\n';
      cardData.newsbites.forEach(b => {
        html += `      <li><strong>${b.source || 'News'}:</strong> ${b.text || ''}</li>\n`;
      });
      html += '    </ul>\n';
      html += '  </div>\n\n';
    }

    if (cardData.signoff && cardData.signoff.trim()) {
      html += '  <div class="author-signoff" style="margin-top: 36px; padding-top: 20px; border-top: 1px solid var(--color-border); font-size: 1rem;">\n';
      html += `    ${cardData.signoff.trim().replace(/\n/g, '<br/>')}\n`;
      html += '  </div>\n';
    }

    html += '</div>';
    return html;
  }

  // Image Optimizer Helper (Converts file to clean compressed Data URL)
  function readAndOptimizeImage(file, maxWidth = 1200, maxHeight = 900, quality = 0.85) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        return reject(new Error('Please select a valid image file.'));
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // =========================================================================
  // 4b. Admin Control Center & Articles Editor (#/admin or #/subscribers)
  // =========================================================================
  function renderAdminPage() {
    const list = JSON.parse(localStorage.getItem('aira_subscribers') || '[]');
    const normalizedList = list.map((item, idx) => {
      if (typeof item === 'string') {
        return { id: idx + 1, email: item, date: 'Earlier', source: 'Website Form' };
      }
      return { id: idx + 1, email: item.email, date: item.date || 'Earlier', source: item.source || 'Website Form' };
    });

    const isCustomized = !!localStorage.getItem('aira_custom_articles');

    // IF EDITING AN ARTICLE: Render Visual Card-by-Card Builder Studio
    if (state.adminEditingArticle) {
      const art = state.adminEditingArticle;
      const isNew = !!art.isNew;
      let cardData = parseBodyHtmlToCardData(art.body_html || '');
      let activeTab = 'cards'; // 'cards' | 'preview'
      let activeImageTarget = null; // { type: 'cover' } or { type: 'story', index: i }

      function renderEditorUi() {
        appContainer.innerHTML = `
          <section class="admin-page-view" style="padding: 32px 0 80px 0;">
            <div class="container" style="max-width: 980px;">
              <!-- Top Action Bar -->
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
                <button type="button" id="btn-back-to-list" style="background: #F4F4F5; border: 1px solid #E4E4E7; color: var(--color-text-primary); font-weight: 600; padding: 9px 16px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-size: 0.875rem;">
                  ← Back to Articles List
                </button>
                
                <!-- View Mode Switcher: Cards Builder vs Live Preview -->
                <div style="display: inline-flex; background: #F1F5F9; border-radius: 8px; padding: 3px; border: 1px solid #E2E8F0;">
                  <button type="button" id="tab-cards-mode" class="editor-view-toggle ${activeTab === 'cards' ? 'active' : ''}" style="border: none; background: ${activeTab === 'cards' ? '#FFFFFF' : 'transparent'}; font-weight: 700; font-size: 0.8125rem; padding: 7px 16px; border-radius: 6px; cursor: pointer; color: ${activeTab === 'cards' ? '#0F172A' : '#64748B'}; box-shadow: ${activeTab === 'cards' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};">
                    🎴 Visual Cards Builder
                  </button>
                  <button type="button" id="tab-preview-mode" class="editor-view-toggle ${activeTab === 'preview' ? 'active' : ''}" style="border: none; background: ${activeTab === 'preview' ? '#FFFFFF' : 'transparent'}; font-weight: 700; font-size: 0.8125rem; padding: 7px 16px; border-radius: 6px; cursor: pointer; color: ${activeTab === 'preview' ? '#0F172A' : '#64748B'}; box-shadow: ${activeTab === 'preview' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};">
                    👁️ Live Article Preview
                  </button>
                </div>

                <div style="display: flex; gap: 10px; align-items: center;">
                  ${!isNew ? `
                    <a href="#/p/${art.slug}" target="_blank" style="background: #FFFFFF; border: 1px solid #D4D4D8; color: var(--color-text-primary); font-weight: 600; padding: 9px 16px; border-radius: 8px; text-decoration: none; font-size: 0.875rem; display: inline-flex; align-items: center; gap: 6px;">
                      👁️ View Live ↗
                    </a>
                  ` : ''}
                  <button type="submit" form="inline-article-form" style="background: #00BA66; color: #FFFFFF; font-weight: 700; padding: 9px 24px; border-radius: 8px; cursor: pointer; font-size: 0.9rem; border: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(0,186,102,0.25);">
                    💾 Save & Publish
                  </button>
                </div>
              </div>

              <!-- Main Card Container -->
              <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
                
                <!-- Studio Header -->
                <div style="margin-bottom: 22px; padding-bottom: 16px; border-bottom: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                  <div>
                    <span style="font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted);">AIRA Visual Article Studio</span>
                    <h2 style="font-family: var(--font-header); font-size: 1.75rem; font-weight: 800; color: var(--color-text-primary); margin-top: 4px;">
                      ${isNew ? '➕ Create New Article Edition' : '✏️ Edit Article: ' + (art.title || '')}
                    </h2>
                  </div>
                  <div style="background: #E8FDF2; color: #047857; font-weight: 700; font-size: 0.8125rem; padding: 6px 14px; border-radius: 20px; border: 1px solid #A7F3D0; display: inline-flex; align-items: center; gap: 6px;">
                    ✨ 100% Visual Form (No HTML Code Needed)
                  </div>
                </div>

                <!-- Ready-Made Template Selector Bar -->
                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 18px 20px; margin-bottom: 28px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                    <span style="font-weight: 700; font-size: 0.95rem; color: #0F172A; display: inline-flex; align-items: center; gap: 6px;">
                      ✨ Ready-Made Templates (Click to Auto-Fill Cards)
                    </span>
                    <span style="color: var(--color-text-muted); font-size: 0.8125rem;">Select any template to populate story cards & layout</span>
                  </div>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;">
                    ${ARTICLE_TEMPLATES.map(tmpl => `
                      <button type="button" class="btn-select-template" data-template-id="${tmpl.id}" style="text-align: left; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 12px 14px; cursor: pointer; transition: all 0.15s ease;">
                        <div style="font-weight: 700; font-size: 0.875rem; color: #1E293B; margin-bottom: 3px;">${tmpl.name}</div>
                        <div style="font-size: 0.75rem; color: #64748B; line-height: 1.35;">${tmpl.desc}</div>
                      </button>
                    `).join('')}
                  </div>
                </div>

                <!-- FORM -->
                <form id="inline-article-form" class="article-edit-form">
                  <input type="hidden" id="edit-orig-slug" value="${art.slug || ''}" />
                  <input type="hidden" id="edit-is-new-val" value="${isNew ? 'true' : 'false'}" />

                  <!-- ============================================== -->
                  <!-- VIEW 1: VISUAL CARDS BUILDER -->
                  <!-- ============================================== -->
                  <div id="view-cards-builder" style="display: ${activeTab === 'cards' ? 'block' : 'none'};">
                    
                    <!-- Section 1: Article Header & Cover Photo -->
                    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 22px; margin-bottom: 24px;">
                      <h3 style="font-size: 1.1rem; font-weight: 800; color: #0F172A; margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px;">
                        📌 1. Article Details & Cover Photo
                      </h3>
                      
                      <div class="form-grid-row">
                        <div class="form-group">
                          <label class="form-label">Article Title *</label>
                          <input type="text" id="editor-title" class="form-control-input" value="${(art.title || '').replace(/"/g, '&quot;')}" placeholder="e.g. Practical AI Plays, Shipped Fast" required />
                        </div>
                        <div class="form-group">
                          <label class="form-label">URL Slug *</label>
                          <input type="text" id="editor-slug" class="form-control-input" value="${art.slug || ''}" placeholder="e.g. practical-ai-plays" required />
                        </div>
                      </div>

                      <div class="form-group">
                        <label class="form-label">Subtitle / Sub-headline</label>
                        <input type="text" id="editor-subtitle" class="form-control-input" value="${(art.subtitle || '').replace(/"/g, '&quot;')}" placeholder="e.g. Plus: How to Turn Off the Gemini Watermark" />
                      </div>

                      <div class="form-grid-row form-grid-3">
                        <div class="form-group">
                          <label class="form-label">Category Tag *</label>
                          <select id="editor-tag" class="form-control-input">
                            <option value="News" ${art.tag === 'News' ? 'selected' : ''}>News</option>
                            <option value="Prompts" ${art.tag === 'Prompts' ? 'selected' : ''}>Prompts & Guides</option>
                            <option value="AI Tools" ${art.tag === 'AI Tools' ? 'selected' : ''}>AI Tools</option>
                            <option value="Tutorials" ${art.tag === 'Tutorials' ? 'selected' : ''}>Tutorials</option>
                          </select>
                        </div>
                        <div class="form-group">
                          <label class="form-label">Publication Date</label>
                          <input type="text" id="editor-date" class="form-control-input" value="${art.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}" />
                        </div>
                        <div class="form-group">
                          <label class="form-label">Reading Time</label>
                          <input type="text" id="editor-reading-time" class="form-control-input" value="${art.reading_time || '4 minutes'}" />
                        </div>
                      </div>

                      <!-- Article Cover Image Box with Live Preview & Direct Upload -->
                      <div class="form-group" style="margin-top: 14px;">
                        <label class="form-label" style="display: flex; justify-content: space-between;">
                          <span>Article Cover Picture *</span>
                          <span style="font-weight: 400; color: #64748B;">Upload photo or paste web link</span>
                        </label>
                        
                        <div style="display: grid; grid-template-columns: 140px 1fr; gap: 16px; align-items: center; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 14px;">
                          <div style="text-align: center;">
                            <img id="editor-cover-preview-img" src="${art.image_url || 'assets/logo.jpg'}" alt="Cover Preview" style="width: 130px; height: 86px; border-radius: 6px; object-fit: cover; border: 1px solid #E2E8F0;" onerror="this.src='assets/logo.jpg'" />
                          </div>
                          
                          <div>
                            <div style="display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
                              <label class="btn-upload-photo-direct" style="padding: 8px 16px;">
                                📷 Upload Cover Photo
                                <input type="file" id="editor-cover-file-input" accept="image/*" style="display: none;" />
                              </label>
                              <button type="button" id="btn-modal-cover-img" class="btn-story-action">
                                🌐 Advanced Image Tool
                              </button>
                            </div>
                            <input type="url" id="editor-image" class="form-control-input" value="${art.image_url || 'assets/logo.jpg'}" placeholder="https://... or uploaded photo" />
                          </div>
                        </div>
                      </div>

                      <div class="form-group" style="margin-top: 14px; margin-bottom: 0;">
                        <label class="form-label">Author Name</label>
                        <input type="text" id="editor-author" class="form-control-input" value="${art.author || 'AIRA'}" />
                      </div>
                    </div>

                    <!-- Section 2: Newsletter Briefing / Intro (The Signal) -->
                    <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 22px; margin-bottom: 24px;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h3 style="font-size: 1.05rem; font-weight: 800; color: #166534; margin: 0; display: flex; align-items: center; gap: 6px;">
                          📢 2. Newsletter Briefing / Intro Banner (THE SIGNAL)
                        </h3>
                        <span style="font-size: 0.78rem; font-weight: 600; color: #166534; background: #DCFCE7; padding: 3px 10px; border-radius: 12px;">Top Banner</span>
                      </div>
                      <p style="font-size: 0.8125rem; color: #15803D; margin-bottom: 10px;">Short executive intro or briefing summarizing what readers will learn in this edition.</p>
                      <textarea id="editor-intro-text" class="form-control-textarea" rows="3" placeholder="Welcome back to AIRA... In this edition: story 1, story 2, and key tools.">${cardData.intro || ''}</textarea>
                    </div>

                    <!-- Section 3: Story Cards Section -->
                    <div style="margin-bottom: 24px;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
                        <div>
                          <h3 style="font-size: 1.2rem; font-weight: 800; color: #0F172A; margin: 0; display: flex; align-items: center; gap: 8px;">
                            📰 3. Story Cards (<span id="story-count-badge">${cardData.stories.length}</span> Stories)
                          </h3>
                          <p style="font-size: 0.8125rem; color: #64748B; margin-top: 2px;">Each story card has its own title, picture, description text, and takeaway.</p>
                        </div>
                        <button type="button" id="btn-add-story-top" class="btn-save-modal" style="background: #18181B; padding: 8px 18px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
                          ➕ Add Story Card
                        </button>
                      </div>

                      <!-- Container where individual story cards render -->
                      <div id="story-cards-container">
                        <!-- Rendered via renderStoryCardsList() -->
                      </div>

                      <!-- Big Add Story Button at bottom -->
                      <button type="button" id="btn-add-story-bottom" class="btn-add-card-big">
                        ➕ Add Another Story Card
                      </button>
                    </div>

                    <!-- Section 4: Featured Tools (Optional) -->
                    <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 22px; margin-bottom: 24px;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                        <h3 style="font-size: 1.05rem; font-weight: 800; color: #1E40AF; margin: 0; display: flex; align-items: center; gap: 6px;">
                          🛠️ 4. Featured AI Tools of the Week (Optional)
                        </h3>
                        <button type="button" id="btn-add-tool-row" class="btn-story-action" style="background: #FFFFFF; color: #1E40AF; border-color: #93C5FD; font-weight: 700;">
                          ➕ Add Tool
                        </button>
                      </div>
                      <div id="tools-rows-container">
                        <!-- Rendered via renderToolsList() -->
                      </div>
                    </div>

                    <!-- Section 5: Quick News Bites (Optional) -->
                    <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 12px; padding: 22px; margin-bottom: 24px;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                        <h3 style="font-size: 1.05rem; font-weight: 800; color: #92400E; margin: 0; display: flex; align-items: center; gap: 6px;">
                          ⚡ 5. Quick AI News Bites (Optional)
                        </h3>
                        <button type="button" id="btn-add-newsbite-row" class="btn-story-action" style="background: #FFFFFF; color: #92400E; border-color: #FCD34D; font-weight: 700;">
                          ➕ Add News Bite
                        </button>
                      </div>
                      <div id="newsbites-rows-container">
                        <!-- Rendered via renderNewsbitesList() -->
                      </div>
                    </div>

                    <!-- Section 6: Author Signoff -->
                    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 22px; margin-bottom: 24px;">
                      <h3 style="font-size: 1.05rem; font-weight: 800; color: #0F172A; margin: 0 0 10px 0; display: flex; align-items: center; gap: 6px;">
                        ✍️ 6. Signoff Note
                      </h3>
                      <textarea id="editor-signoff-text" class="form-control-textarea" rows="2" placeholder="Until next week,
AIRA Team">${cardData.signoff || 'Until next week,\nAIRA'}</textarea>
                    </div>

                  </div>

                  <!-- ============================================== -->
                  <!-- VIEW 2: LIVE INTERACTIVE PREVIEW -->
                  <!-- ============================================== -->
                  <div id="view-live-preview" style="display: ${activeTab === 'preview' ? 'block' : 'none'};">
                    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                      <span style="font-weight: 700; font-size: 0.875rem; color: #047857; display: inline-flex; align-items: center; gap: 6px;">
                        💡 Live Preview Mode: Click on any photo to change/replace it with 1 click!
                      </span>
                      <button type="button" id="btn-return-to-builder" style="background: #18181B; color: #FFFFFF; font-size: 0.8125rem; font-weight: 600; padding: 6px 14px; border-radius: 6px; cursor: pointer; border: none;">
                        ← Back to Cards Builder
                      </button>
                    </div>

                    <!-- Live Rendered Newsletter Canvas -->
                    <div id="live-preview-canvas" class="article-rich-body" style="border: 1px solid #E2E8F0; border-radius: 12px; padding: 32px 28px; background: #FFFFFF; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
                      <!-- Injected via updateLivePreviewCanvas() -->
                    </div>
                  </div>

                  <!-- Bottom Submit & Cancel Actions -->
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--color-border); flex-wrap: wrap; gap: 12px;">
                    <button type="button" id="btn-cancel-inline-editor" class="btn-cancel-modal">
                      ✕ Cancel & Discard
                    </button>
                    
                    <div style="display: flex; gap: 12px; align-items: center;">
                      <button type="button" id="btn-switch-preview-bottom" style="background: #F4F4F5; border: 1px solid #D4D4D8; color: #18181B; font-weight: 600; padding: 11px 20px; border-radius: 8px; cursor: pointer; font-size: 0.9rem;">
                        ${activeTab === 'cards' ? '👁️ Preview Live Newsletter' : '🎴 Edit Cards'}
                      </button>
                      <button type="submit" class="btn-save-modal" style="font-size: 0.95rem; padding: 11px 32px; background: #00BA66; border: none; font-weight: 700; box-shadow: 0 2px 10px rgba(0,186,102,0.25);">
                        💾 Save & Publish Article
                      </button>
                    </div>
                  </div>

                </form>
              </div>
            </div>
          </section>

          <!-- Universal Beehiiv Image Replacer Modal -->
          <div class="modal-overlay" id="beehiiv-image-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.65); z-index: 9999; justify-content: center; align-items: center; padding: 20px;">
            <div class="modal-card" style="max-width: 520px; width: 100%; padding: 26px; border-radius: 12px; background: #FFFFFF; box-shadow: 0 20px 50px rgba(0,0,0,0.25); max-height: 90vh; overflow-y: auto;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--color-border);">
                <div>
                  <h3 style="font-family: var(--font-header); font-size: 1.25rem; font-weight: 800; color: #18181B; margin: 0;">🖼️ Upload & Replace Picture</h3>
                  <p style="color: var(--color-text-muted); font-size: 0.8125rem; margin-top: 2px;">Upload from device or paste web link with caption & link</p>
                </div>
                <button type="button" id="btn-close-img-modal" style="background: transparent; border: none; font-size: 1.3rem; cursor: pointer; color: #71717A; padding: 4px 8px;">✕</button>
              </div>

              <!-- Mode Selector Tabs -->
              <div style="display: flex; gap: 8px; margin-bottom: 16px; background: #F4F4F5; padding: 4px; border-radius: 8px;">
                <button type="button" id="tab-img-upload" class="modal-tab-btn active">📁 Upload from Device</button>
                <button type="button" id="tab-img-url" class="modal-tab-btn">🌐 Image Web URL</button>
              </div>

              <!-- Upload Zone -->
              <div id="section-img-upload" style="margin-bottom: 16px;">
                <label for="modal-img-file" class="image-drop-zone" id="modal-img-dropzone">
                  <div style="font-size: 2.2rem; margin-bottom: 6px;">📤</div>
                  <div style="font-weight: 700; font-size: 0.92rem; color: #1E293B;">Click to select photo or drag here</div>
                  <div style="font-size: 0.75rem; color: #64748B; margin-top: 4px;">Supports PNG, JPG, WebP (Auto-optimized)</div>
                  <input type="file" id="modal-img-file" accept="image/*" style="display: none;" />
                </label>
              </div>

              <!-- Web URL Zone -->
              <div id="section-img-url" style="display: none; margin-bottom: 16px;">
                <label class="form-label" style="font-size: 0.8125rem;">Image Direct URL *</label>
                <input type="url" id="modal-img-url-input" class="form-control-input" placeholder="https://example.com/image.jpg" />
              </div>

              <!-- Caption / Source Credit -->
              <div style="margin-bottom: 14px;">
                <label class="form-label" style="font-size: 0.8125rem;">Caption & Source Credit (Optional)</label>
                <input type="text" id="modal-img-caption-input" class="form-control-input" placeholder="e.g. Image Source: OpenAI / Midjourney / AIRA" />
              </div>

              <!-- Destination Link on Image -->
              <div style="margin-bottom: 14px;">
                <label class="form-label" style="font-size: 0.8125rem;">Clickable Link on Image (Optional)</label>
                <input type="url" id="modal-img-link-input" class="form-control-input" placeholder="https://... (When reader clicks photo)" />
              </div>

              <!-- Live Preview Card inside Modal -->
              <div id="modal-img-preview-card" style="display: none; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; margin-bottom: 18px; text-align: center;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #64748B; text-align: left; margin-bottom: 8px;">IMAGE PREVIEW:</div>
                <img id="modal-img-preview-img" src="" alt="Preview" style="max-width: 100%; max-height: 220px; border-radius: 8px; object-fit: cover; border: 1px solid #E2E8F0;" />
                <div id="modal-img-preview-caption-text" style="font-size: 0.75rem; color: #64748B; margin-top: 6px; font-style: italic;"></div>
              </div>

              <!-- Modal Footer Actions -->
              <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid var(--color-border); padding-top: 16px;">
                <button type="button" id="btn-cancel-img-modal" class="btn-cancel-modal" style="padding: 9px 18px; font-size: 0.875rem;">Cancel</button>
                <button type="button" id="btn-insert-img-confirm" class="btn-save-modal" style="padding: 9px 22px; font-size: 0.875rem; background: #00BA66;">✨ Apply Picture</button>
              </div>
            </div>
          </div>
        `;

        // Render sub-components
        renderStoryCardsList();
        renderToolsList();
        renderNewsbitesList();
        bindEditorEvents();
      }

      // Render all story cards into DOM
      function renderStoryCardsList() {
        const container = document.getElementById('story-cards-container');
        const countBadge = document.getElementById('story-count-badge');
        if (countBadge) countBadge.textContent = cardData.stories.length;
        if (!container) return;

        container.innerHTML = cardData.stories.map((story, idx) => `
          <div class="story-builder-card" data-story-idx="${idx}">
            <!-- Card Header -->
            <div class="story-builder-header">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="story-badge">Story #${idx + 1}</span>
                <input type="text" class="form-control-input story-inp-tag" value="${(story.tag || '').replace(/"/g, '&quot;')}" placeholder="Category Tag (e.g. 01: BREAKTHROUGH)" style="max-width: 240px; font-size: 0.8125rem; padding: 4px 10px; font-weight: 700;" />
              </div>
              
              <div class="story-actions-bar">
                ${idx > 0 ? `<button type="button" class="btn-story-action btn-move-story-up" data-idx="${idx}" title="Move story up">⬆️</button>` : ''}
                ${idx < cardData.stories.length - 1 ? `<button type="button" class="btn-story-action btn-move-story-down" data-idx="${idx}" title="Move story down">⬇️</button>` : ''}
                ${cardData.stories.length > 1 ? `<button type="button" class="btn-story-action btn-story-delete btn-delete-story" data-idx="${idx}" title="Delete this story card">🗑️ Delete</button>` : ''}
              </div>
            </div>

            <!-- Story Title -->
            <div class="form-group" style="margin-bottom: 14px;">
              <label class="form-label" style="font-size: 0.8125rem; font-weight: 700;">Story Headline / Title *</label>
              <input type="text" class="form-control-input story-inp-title" value="${(story.title || '').replace(/"/g, '&quot;')}" placeholder="e.g. AI Models Are Passing Real-World Benchmarks" required style="font-weight: 700; font-size: 1.05rem;" />
            </div>

            <!-- Story Picture Card with 1-Click Upload & Live Preview -->
            <div class="story-image-preview-box">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 0.8125rem; font-weight: 700; color: #334155;">📷 Story Picture & Caption:</span>
                ${story.image ? `<button type="button" class="btn-story-action btn-remove-story-img" data-idx="${idx}" style="color: #DC2626; font-size: 0.75rem;">✕ Remove Photo</button>` : ''}
              </div>

              <div style="display: grid; grid-template-columns: 140px 1fr; gap: 14px; align-items: center; text-align: left;">
                <div style="text-align: center;">
                  <img src="${story.image || 'assets/logo.jpg'}" class="story-img-preview" alt="Story preview" style="width: 130px; height: 90px; border-radius: 6px; object-fit: cover; border: 1px solid #E2E8F0;" onerror="this.src='assets/logo.jpg'" />
                </div>
                <div>
                  <div style="display: flex; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;">
                    <label class="btn-upload-photo-direct">
                      📷 Upload Photo
                      <input type="file" class="story-file-upload-input" data-idx="${idx}" accept="image/*" style="display: none;" />
                    </label>
                    <button type="button" class="btn-story-action btn-open-story-img-modal" data-idx="${idx}">
                      🌐 Replace / Link Photo
                    </button>
                  </div>
                  <input type="url" class="form-control-input story-inp-image" value="${story.image || ''}" data-idx="${idx}" placeholder="https://... or uploaded image" style="font-size: 0.8125rem; margin-bottom: 6px;" />
                  <input type="text" class="form-control-input story-inp-caption" value="${(story.imageCaption || '').replace(/"/g, '&quot;')}" placeholder="Caption & Credit (e.g. Image Source: OpenAI / AIRA)" style="font-size: 0.8125rem;" />
                </div>
              </div>
            </div>

            <!-- Story Body Content / Paragraphs -->
            <div class="form-group" style="margin-bottom: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <label class="form-label" style="font-size: 0.8125rem; font-weight: 700; margin: 0;">Story Text & Paragraphs *</label>
                <div style="display: flex; gap: 4px;">
                  <button type="button" class="btn-story-action btn-format-story" data-idx="${idx}" data-tag="b" title="Add Bold text" style="padding: 2px 8px;"><b>B</b></button>
                  <button type="button" class="btn-story-action btn-format-story" data-idx="${idx}" data-tag="i" title="Add Italic text" style="padding: 2px 8px;"><i>I</i></button>
                  <button type="button" class="btn-story-action btn-format-story" data-idx="${idx}" data-tag="link" title="Add Link" style="padding: 2px 8px;">🔗</button>
                  <button type="button" class="btn-story-action btn-format-story" data-idx="${idx}" data-tag="bullet" title="Add Bullet point" style="padding: 2px 8px;">• List</button>
                </div>
              </div>
              <textarea class="form-control-textarea story-inp-body" rows="5" placeholder="Write your story breakdown and details here. Simply type paragraphs or bullet points without any code.">${story.body || ''}</textarea>
            </div>

            <!-- Key Takeaway Box -->
            <div class="form-group" style="margin-bottom: 10px; background: #F0FDF4; border: 1px solid #BBF7D0; padding: 12px 14px; border-radius: 8px;">
              <label class="form-label" style="color: #166534; font-size: 0.8125rem; font-weight: 700; margin-bottom: 4px;">💡 Key Takeaway (Green Highlight Box)</label>
              <input type="text" class="form-control-input story-inp-takeaway" value="${(story.takeaway || '').replace(/"/g, '&quot;')}" placeholder="e.g. Actionable advice or takeaway for the reader" style="background: #FFFFFF;" />
            </div>

            <!-- Quote Box (Optional) -->
            <div style="display: grid; grid-template-columns: 1fr 200px; gap: 10px;">
              <div class="form-group" style="margin: 0;">
                <input type="text" class="form-control-input story-inp-quote" value="${(story.quote || '').replace(/"/g, '&quot;')}" placeholder="💬 Quote (Optional): e.g. The next wave of AI isn't chatbots..." style="font-size: 0.8125rem;" />
              </div>
              <div class="form-group" style="margin: 0;">
                <input type="text" class="form-control-input story-inp-quote-author" value="${(story.quoteAuthor || '').replace(/"/g, '&quot;')}" placeholder="Quote Author (e.g. Jensen Huang)" style="font-size: 0.8125rem;" />
              </div>
            </div>

          </div>
        `).join('');

        bindStoryCardEvents();
      }

      // Render tools list
      function renderToolsList() {
        const container = document.getElementById('tools-rows-container');
        if (!container) return;

        if (!cardData.tools || cardData.tools.length === 0) {
          container.innerHTML = `<div style="font-size: 0.8125rem; color: #64748B; font-style: italic;">No featured tools added yet. Click "+ Add Tool" above to add tools to this edition.</div>`;
          return;
        }

        container.innerHTML = cardData.tools.map((tool, idx) => `
          <div style="display: grid; grid-template-columns: 180px 220px 1fr 40px; gap: 8px; margin-bottom: 8px; align-items: center;" class="tool-row" data-tool-idx="${idx}">
            <input type="text" class="form-control-input tool-inp-name" value="${(tool.name || '').replace(/"/g, '&quot;')}" placeholder="Tool Name (e.g. Flux Pro)" style="font-size: 0.8125rem; font-weight: 700;" />
            <input type="url" class="form-control-input tool-inp-link" value="${tool.link || ''}" placeholder="Link (https://...)" style="font-size: 0.8125rem;" />
            <input type="text" class="form-control-input tool-inp-desc" value="${(tool.desc || '').replace(/"/g, '&quot;')}" placeholder="Brief description of capability..." style="font-size: 0.8125rem;" />
            <button type="button" class="btn-story-action btn-delete-tool" data-idx="${idx}" style="color: #DC2626; padding: 6px;" title="Remove tool">✕</button>
          </div>
        `).join('');

        container.querySelectorAll('.btn-delete-tool').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
            syncFormDataToCardData();
            cardData.tools.splice(idx, 1);
            renderToolsList();
          });
        });
      }

      // Render newsbites list
      function renderNewsbitesList() {
        const container = document.getElementById('newsbites-rows-container');
        if (!container) return;

        if (!cardData.newsbites || cardData.newsbites.length === 0) {
          container.innerHTML = `<div style="font-size: 0.8125rem; color: #92400E; font-style: italic;">No quick news bites added yet. Click "+ Add News Bite" above to add 1-line rapid updates.</div>`;
          return;
        }

        container.innerHTML = cardData.newsbites.map((bite, idx) => `
          <div style="display: grid; grid-template-columns: 200px 1fr 40px; gap: 8px; margin-bottom: 8px; align-items: center;" class="newsbite-row" data-bite-idx="${idx}">
            <input type="text" class="form-control-input bite-inp-source" value="${(bite.source || '').replace(/"/g, '&quot;')}" placeholder="Source / Company (e.g. OpenAI)" style="font-size: 0.8125rem; font-weight: 700;" />
            <input type="text" class="form-control-input bite-inp-text" value="${(bite.text || '').replace(/"/g, '&quot;')}" placeholder="One-line news update..." style="font-size: 0.8125rem;" />
            <button type="button" class="btn-story-action btn-delete-bite" data-idx="${idx}" style="color: #DC2626; padding: 6px;" title="Remove news bite">✕</button>
          </div>
        `).join('');

        container.querySelectorAll('.btn-delete-bite').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
            syncFormDataToCardData();
            cardData.newsbites.splice(idx, 1);
            renderNewsbitesList();
          });
        });
      }

      // Sync form inputs to cardData in memory
      function syncFormDataToCardData() {
        const introEl = document.getElementById('editor-intro-text');
        if (introEl) cardData.intro = introEl.value.trim();

        const signoffEl = document.getElementById('editor-signoff-text');
        if (signoffEl) cardData.signoff = signoffEl.value.trim();

        // Sync story cards
        const storyCardsEls = document.querySelectorAll('.story-builder-card');
        storyCardsEls.forEach((cardEl, idx) => {
          if (cardData.stories[idx]) {
            const tag = cardEl.querySelector('.story-inp-tag')?.value.trim() || '';
            const title = cardEl.querySelector('.story-inp-title')?.value.trim() || '';
            const image = cardEl.querySelector('.story-inp-image')?.value.trim() || '';
            const caption = cardEl.querySelector('.story-inp-caption')?.value.trim() || '';
            const link = cardEl.querySelector('.story-inp-link')?.value.trim() || '';
            const body = cardEl.querySelector('.story-inp-body')?.value.trim() || '';
            const takeaway = cardEl.querySelector('.story-inp-takeaway')?.value.trim() || '';
            const quote = cardEl.querySelector('.story-inp-quote')?.value.trim() || '';
            const quoteAuthor = cardEl.querySelector('.story-inp-quote-author')?.value.trim() || '';

            cardData.stories[idx] = {
              ...cardData.stories[idx],
              tag,
              title,
              image,
              imageCaption: caption,
              imageLink: link,
              body,
              takeaway,
              quote,
              quoteAuthor
            };
          }
        });

        // Sync tools
        const toolRows = document.querySelectorAll('.tool-row');
        cardData.tools = [];
        toolRows.forEach(row => {
          const name = row.querySelector('.tool-inp-name')?.value.trim() || '';
          const link = row.querySelector('.tool-inp-link')?.value.trim() || '';
          const desc = row.querySelector('.tool-inp-desc')?.value.trim() || '';
          if (name || desc) {
            cardData.tools.push({ name, link, desc });
          }
        });

        // Sync newsbites
        const biteRows = document.querySelectorAll('.newsbite-row');
        cardData.newsbites = [];
        biteRows.forEach(row => {
          const source = row.querySelector('.bite-inp-source')?.value.trim() || '';
          const text = row.querySelector('.bite-inp-text')?.value.trim() || '';
          if (source || text) {
            cardData.newsbites.push({ source, text });
          }
        });
      }

      // Update Live Interactive Preview Canvas
      function updateLivePreviewCanvas() {
        syncFormDataToCardData();
        const canvas = document.getElementById('live-preview-canvas');
        if (!canvas) return;

        const compiledHtml = compileCardDataToHtml(cardData);
        canvas.innerHTML = compiledHtml;

        // Wrap every image in live preview with 1-click replace overlay
        const previewImages = canvas.querySelectorAll('img');
        previewImages.forEach((img, idx) => {
          const wrapper = document.createElement('div');
          wrapper.className = 'live-preview-image-wrap';
          wrapper.title = 'Click to replace or upload picture';
          img.parentNode.insertBefore(wrapper, img);
          wrapper.appendChild(img);

          const overlay = document.createElement('div');
          overlay.className = 'img-overlay-edit';
          overlay.innerHTML = '<span>📷 Click to Replace Picture</span>';
          wrapper.appendChild(overlay);

          wrapper.addEventListener('click', () => {
            // Find corresponding story
            const storyIdx = Math.min(idx, cardData.stories.length - 1);
            openImageModal({ type: 'story', index: storyIdx });
          });
        });
      }

      // Bind story cards internal events (upload file, delete, move up/down, format helpers)
      function bindStoryCardEvents() {
        // Direct Photo File Upload on Story Card
        document.querySelectorAll('.story-file-upload-input').forEach(inp => {
          inp.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            const idx = parseInt(e.target.getAttribute('data-idx'));
            if (file) {
              try {
                showToast('Optimizing picture... ⏳');
                const dataUrl = await readAndOptimizeImage(file, 1200, 800, 0.85);
                syncFormDataToCardData();
                if (cardData.stories[idx]) {
                  cardData.stories[idx].image = dataUrl;
                }
                renderStoryCardsList();
                showToast('Story picture updated! 🖼️');
              } catch (err) {
                showToast('Could not load image file.');
              }
            }
          });
        });

        // Image URL input live preview
        document.querySelectorAll('.story-inp-image').forEach(inp => {
          inp.addEventListener('input', (e) => {
            const idx = parseInt(e.target.getAttribute('data-idx'));
            const cardEl = document.querySelector(`.story-builder-card[data-story-idx="${idx}"]`);
            const previewImg = cardEl?.querySelector('.story-img-preview');
            if (previewImg) {
              previewImg.src = e.target.value.trim() || 'assets/logo.jpg';
            }
          });
        });

        // Open Image Modal for specific story
        document.querySelectorAll('.btn-open-story-img-modal').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
            openImageModal({ type: 'story', index: idx });
          });
        });

        // Remove story image
        document.querySelectorAll('.btn-remove-story-img').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
            syncFormDataToCardData();
            if (cardData.stories[idx]) {
              cardData.stories[idx].image = '';
              cardData.stories[idx].imageCaption = '';
            }
            renderStoryCardsList();
            showToast('Picture removed from story.');
          });
        });

        // Move story up
        document.querySelectorAll('.btn-move-story-up').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
            if (idx > 0) {
              syncFormDataToCardData();
              const item = cardData.stories.splice(idx, 1)[0];
              cardData.stories.splice(idx - 1, 0, item);
              renderStoryCardsList();
            }
          });
        });

        // Move story down
        document.querySelectorAll('.btn-move-story-down').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
            if (idx < cardData.stories.length - 1) {
              syncFormDataToCardData();
              const item = cardData.stories.splice(idx, 1)[0];
              cardData.stories.splice(idx + 1, 0, item);
              renderStoryCardsList();
            }
          });
        });

        // Delete story
        document.querySelectorAll('.btn-delete-story').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
            if (cardData.stories.length > 1) {
              syncFormDataToCardData();
              cardData.stories.splice(idx, 1);
              renderStoryCardsList();
              showToast('Story card removed.');
            }
          });
        });

        // Story Text formatting helpers (Bold, Italic, Link, List)
        document.querySelectorAll('.btn-format-story').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
            const tagType = e.currentTarget.getAttribute('data-tag');
            const cardEl = document.querySelector(`.story-builder-card[data-story-idx="${idx}"]`);
            const textarea = cardEl?.querySelector('.story-inp-body');
            if (!textarea) return;

            const start = textarea.selectionStart || 0;
            const end = textarea.selectionEnd || 0;
            const val = textarea.value;
            const selectedText = val.substring(start, end);

            let insertText = '';
            if (tagType === 'b') {
              insertText = selectedText ? `<strong>${selectedText}</strong>` : '<strong>bold text</strong>';
            } else if (tagType === 'i') {
              insertText = selectedText ? `<em>${selectedText}</em>` : '<em>italic text</em>';
            } else if (tagType === 'link') {
              const url = prompt('Enter link URL (e.g. https://example.com):', 'https://');
              if (url && url !== 'https://') {
                insertText = `<a href="${url}" class="beehiiv-link" target="_blank">${selectedText || 'link text'}</a>`;
              }
            } else if (tagType === 'bullet') {
              insertText = '\n• ' + (selectedText || 'Key point detail here');
            }

            if (insertText) {
              textarea.value = val.substring(0, start) + insertText + val.substring(end);
              textarea.focus();
              textarea.selectionStart = textarea.selectionEnd = start + insertText.length;
            }
          });
        });
      }

      // Universal Image Modal Logic
      function openImageModal(target) {
        activeImageTarget = target;
        const modal = document.getElementById('beehiiv-image-modal');
        const urlInput = document.getElementById('modal-img-url-input');
        const captionInput = document.getElementById('modal-img-caption-input');
        const linkInput = document.getElementById('modal-img-link-input');
        const previewCard = document.getElementById('modal-img-preview-card');
        const previewImg = document.getElementById('modal-img-preview-img');
        const previewCaption = document.getElementById('modal-img-preview-caption-text');
        const fileInput = document.getElementById('modal-img-file');

        if (!modal) return;
        if (fileInput) fileInput.value = '';

        let currentImg = '';
        let currentCaption = '';
        let currentLink = '';

        if (target.type === 'cover') {
          const coverInput = document.getElementById('editor-image');
          currentImg = coverInput ? coverInput.value.trim() : '';
        } else if (target.type === 'story' && cardData.stories[target.index]) {
          const s = cardData.stories[target.index];
          currentImg = s.image || '';
          currentCaption = s.imageCaption || '';
          currentLink = s.imageLink || '';
        }

        if (urlInput) urlInput.value = currentImg;
        if (captionInput) captionInput.value = currentCaption;
        if (linkInput) linkInput.value = currentLink;

        if (currentImg) {
          if (previewImg) previewImg.src = currentImg;
          if (previewCaption) previewCaption.textContent = currentCaption;
          if (previewCard) previewCard.style.display = 'block';
        } else {
          if (previewCard) previewCard.style.display = 'none';
        }

        modal.style.display = 'flex';
      }

      function closeImageModal() {
        const modal = document.getElementById('beehiiv-image-modal');
        if (modal) modal.style.display = 'none';
        activeImageTarget = null;
      }

      // Bind all editor interactions
      function bindEditorEvents() {
        // Back and Cancel buttons
        document.getElementById('btn-back-to-list')?.addEventListener('click', () => {
          state.adminEditingArticle = null;
          renderAdminPage();
        });

        document.getElementById('btn-cancel-inline-editor')?.addEventListener('click', () => {
          state.adminEditingArticle = null;
          renderAdminPage();
        });

        // Tab Switching: Cards Builder vs Live Preview
        const tabCards = document.getElementById('tab-cards-mode');
        const tabPreview = document.getElementById('tab-preview-mode');
        const viewCards = document.getElementById('view-cards-builder');
        const viewPreview = document.getElementById('view-live-preview');
        const btnReturn = document.getElementById('btn-return-to-builder');
        const btnSwitchBottom = document.getElementById('btn-switch-preview-bottom');

        function setViewTab(tab) {
          activeTab = tab;
          if (tab === 'cards') {
            if (viewCards) viewCards.style.display = 'block';
            if (viewPreview) viewPreview.style.display = 'none';
            if (tabCards) { tabCards.style.background = '#FFFFFF'; tabCards.style.color = '#0F172A'; tabCards.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }
            if (tabPreview) { tabPreview.style.background = 'transparent'; tabPreview.style.color = '#64748B'; tabPreview.style.boxShadow = 'none'; }
            if (btnSwitchBottom) btnSwitchBottom.textContent = '👁️ Preview Live Newsletter';
          } else {
            syncFormDataToCardData();
            updateLivePreviewCanvas();
            if (viewCards) viewCards.style.display = 'none';
            if (viewPreview) viewPreview.style.display = 'block';
            if (tabPreview) { tabPreview.style.background = '#FFFFFF'; tabPreview.style.color = '#0F172A'; tabPreview.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }
            if (tabCards) { tabCards.style.background = 'transparent'; tabCards.style.color = '#64748B'; tabCards.style.boxShadow = 'none'; }
            if (btnSwitchBottom) btnSwitchBottom.textContent = '🎴 Edit Cards';
          }
        }

        if (tabCards) tabCards.addEventListener('click', () => setViewTab('cards'));
        if (tabPreview) tabPreview.addEventListener('click', () => setViewTab('preview'));
        if (btnReturn) btnReturn.addEventListener('click', () => setViewTab('cards'));
        if (btnSwitchBottom) {
          btnSwitchBottom.addEventListener('click', () => {
            setViewTab(activeTab === 'cards' ? 'preview' : 'cards');
          });
        }

        // Auto slug generator on new title
        const titleInp = document.getElementById('editor-title');
        const slugInp = document.getElementById('editor-slug');
        if (titleInp && slugInp && isNew) {
          titleInp.addEventListener('input', () => {
            slugInp.value = titleInp.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          });
        }

        // Cover Image direct file upload
        const coverFileInput = document.getElementById('editor-cover-file-input');
        const coverUrlInput = document.getElementById('editor-image');
        const coverPreviewImg = document.getElementById('editor-cover-preview-img');
        if (coverFileInput && coverUrlInput) {
          coverFileInput.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              try {
                showToast('Optimizing cover image... ⏳');
                const dataUrl = await readAndOptimizeImage(file, 1400, 900, 0.85);
                coverUrlInput.value = dataUrl;
                if (coverPreviewImg) coverPreviewImg.src = dataUrl;
                showToast('Cover image ready! 🖼️');
              } catch (err) {
                showToast('Error loading cover photo.');
              }
            }
          });
        }

        if (coverUrlInput && coverPreviewImg) {
          coverUrlInput.addEventListener('input', () => {
            coverPreviewImg.src = coverUrlInput.value.trim() || 'assets/logo.jpg';
          });
        }

        document.getElementById('btn-modal-cover-img')?.addEventListener('click', () => {
          openImageModal({ type: 'cover' });
        });

        // Add Story buttons
        const handleAddStory = () => {
          syncFormDataToCardData();
          cardData.stories.push({
            tag: `0${cardData.stories.length + 1}: NEW STORY`.slice(0, 24).toUpperCase(),
            title: 'New Story Headline',
            image: 'assets/logo.jpg',
            imageCaption: 'Image Source: AIRA Intelligence',
            imageLink: '',
            body: 'Write your story explanation here. Simply type paragraphs or bullet points without any code.',
            takeaway: 'Key takeaway for readers.',
            quote: '',
            quoteAuthor: ''
          });
          renderStoryCardsList();
          showToast('Added new story card! 📝');
          // Scroll to new card
          const lastCard = document.querySelector('.story-builder-card:last-child');
          if (lastCard) lastCard.scrollIntoView({ behavior: 'smooth' });
        };

        document.getElementById('btn-add-story-top')?.addEventListener('click', handleAddStory);
        document.getElementById('btn-add-story-bottom')?.addEventListener('click', handleAddStory);

        // Add Tool button
        document.getElementById('btn-add-tool-row')?.addEventListener('click', () => {
          syncFormDataToCardData();
          if (!cardData.tools) cardData.tools = [];
          cardData.tools.push({ name: '', link: '', desc: '' });
          renderToolsList();
        });

        // Add News Bite button
        document.getElementById('btn-add-newsbite-row')?.addEventListener('click', () => {
          syncFormDataToCardData();
          if (!cardData.newsbites) cardData.newsbites = [];
          cardData.newsbites.push({ source: '', text: '' });
          renderNewsbitesList();
        });

        // Ready-Made Template Presets Handler
        document.querySelectorAll('.btn-select-template').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const tmplId = e.currentTarget.getAttribute('data-template-id');
            const tmpl = ARTICLE_TEMPLATES.find(t => t.id === tmplId);
            if (tmpl) {
              if (confirm(`Load template "${tmpl.name}"? This will populate the story cards.`)) {
                cardData = JSON.parse(JSON.stringify(tmpl.cardData));
                if (titleInp && (!titleInp.value || isNew)) titleInp.value = tmpl.sampleTitle || titleInp.value;
                if (slugInp && (!slugInp.value || isNew)) slugInp.value = (tmpl.sampleTitle || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                const subtitleInp = document.getElementById('editor-subtitle');
                if (subtitleInp && (!subtitleInp.value || isNew)) subtitleInp.value = tmpl.sampleSubtitle || subtitleInp.value;
                const tagSelect = document.getElementById('editor-tag');
                if (tagSelect && tmpl.tag) tagSelect.value = tmpl.tag;
                const introInp = document.getElementById('editor-intro-text');
                if (introInp) introInp.value = cardData.intro || '';
                const signoffInp = document.getElementById('editor-signoff-text');
                if (signoffInp) signoffInp.value = cardData.signoff || '';

                renderStoryCardsList();
                renderToolsList();
                renderNewsbitesList();
                showToast(`✨ Loaded template "${tmpl.name}"!`);
              }
            }
          });
        });

        // Universal Image Modal Event Handlers
        const btnCloseModal = document.getElementById('btn-close-img-modal');
        const btnCancelModal = document.getElementById('btn-cancel-img-modal');
        const tabUpload = document.getElementById('tab-img-upload');
        const tabUrl = document.getElementById('tab-img-url');
        const secUpload = document.getElementById('section-img-upload');
        const secUrl = document.getElementById('section-img-url');
        const modalFileInput = document.getElementById('modal-img-file');
        const modalDropzone = document.getElementById('modal-img-dropzone');
        const modalUrlInput = document.getElementById('modal-img-url-input');
        const modalCaptionInput = document.getElementById('modal-img-caption-input');
        const modalLinkInput = document.getElementById('modal-img-link-input');
        const modalPreviewCard = document.getElementById('modal-img-preview-card');
        const modalPreviewImg = document.getElementById('modal-img-preview-img');
        const modalPreviewCaption = document.getElementById('modal-img-preview-caption-text');
        const btnConfirmImg = document.getElementById('btn-insert-img-confirm');

        if (btnCloseModal) btnCloseModal.addEventListener('click', closeImageModal);
        if (btnCancelModal) btnCancelModal.addEventListener('click', closeImageModal);

        if (tabUpload && tabUrl) {
          tabUpload.addEventListener('click', () => {
            tabUpload.classList.add('active');
            tabUrl.classList.remove('active');
            if (secUpload) secUpload.style.display = 'block';
            if (secUrl) secUrl.style.display = 'none';
          });
          tabUrl.addEventListener('click', () => {
            tabUrl.classList.add('active');
            tabUpload.classList.remove('active');
            if (secUpload) secUpload.style.display = 'none';
            if (secUrl) secUrl.style.display = 'block';
          });
        }

        let tempModalImageSrc = '';

        if (modalFileInput) {
          modalFileInput.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              try {
                showToast('Optimizing picture... ⏳');
                tempModalImageSrc = await readAndOptimizeImage(file, 1200, 800, 0.85);
                if (modalPreviewImg) modalPreviewImg.src = tempModalImageSrc;
                if (modalPreviewCaption && modalCaptionInput) modalPreviewCaption.textContent = modalCaptionInput.value.trim();
                if (modalPreviewCard) modalPreviewCard.style.display = 'block';
                showToast('Image ready to apply! 🖼️');
              } catch (err) {
                showToast('Could not load image file.');
              }
            }
          });
        }

        if (modalUrlInput) {
          modalUrlInput.addEventListener('input', () => {
            tempModalImageSrc = modalUrlInput.value.trim();
            if (modalPreviewImg) modalPreviewImg.src = tempModalImageSrc;
            if (modalPreviewCaption && modalCaptionInput) modalPreviewCaption.textContent = modalCaptionInput.value.trim();
            if (modalPreviewCard) modalPreviewCard.style.display = tempModalImageSrc ? 'block' : 'none';
          });
        }

        if (modalCaptionInput) {
          modalCaptionInput.addEventListener('input', () => {
            if (modalPreviewCaption) modalPreviewCaption.textContent = modalCaptionInput.value.trim();
          });
        }

        if (btnConfirmImg) {
          btnConfirmImg.addEventListener('click', () => {
            const finalImg = tempModalImageSrc || (modalUrlInput ? modalUrlInput.value.trim() : '');
            const finalCaption = modalCaptionInput ? modalCaptionInput.value.trim() : '';
            const finalLink = modalLinkInput ? modalLinkInput.value.trim() : '';

            if (activeImageTarget) {
              if (activeImageTarget.type === 'cover') {
                if (coverUrlInput) coverUrlInput.value = finalImg;
                if (coverPreviewImg) coverPreviewImg.src = finalImg || 'assets/logo.jpg';
              } else if (activeImageTarget.type === 'story' && cardData.stories[activeImageTarget.index]) {
                cardData.stories[activeImageTarget.index].image = finalImg;
                cardData.stories[activeImageTarget.index].imageCaption = finalCaption;
                cardData.stories[activeImageTarget.index].imageLink = finalLink;
                renderStoryCardsList();
                if (activeTab === 'preview') {
                  updateLivePreviewCanvas();
                }
              }
              showToast('Picture updated successfully! 🖼️');
            }
            closeImageModal();
          });
        }

        // Form Submit Handler
        const form = document.getElementById('inline-article-form');
        if (form) {
          form.addEventListener('submit', (e) => {
            e.preventDefault();
            syncFormDataToCardData();

            const origSlug = document.getElementById('edit-orig-slug').value;
            const isNewVal = document.getElementById('edit-is-new-val').value === 'true';
            const title = document.getElementById('editor-title').value.trim();
            let slug = document.getElementById('editor-slug').value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            const subtitle = document.getElementById('editor-subtitle').value.trim();
            const tag = document.getElementById('editor-tag').value;
            const date = document.getElementById('editor-date').value.trim() || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
            const reading_time = document.getElementById('editor-reading-time').value.trim() || '4 minutes';
            const image_url = document.getElementById('editor-image').value.trim() || 'assets/logo.jpg';
            const author = document.getElementById('editor-author').value.trim() || 'AIRA';

            if (!title || !slug) {
              showToast('Please fill in article title and slug!');
              return;
            }

            // Compile clean HTML from cardData behind the scenes
            const body_html = compileCardDataToHtml(cardData);

            if (isNewVal) {
              if (state.articles.some(a => a.slug === slug)) {
                slug = slug + '-' + Date.now().toString().slice(-4);
              }
              const newArt = {
                id: 'post-' + Date.now(),
                slug,
                title,
                subtitle,
                image_url,
                author,
                author_avatar: 'assets/logo.jpg',
                date,
                iso_date: new Date().toISOString(),
                reading_time,
                tag,
                likes: 0,
                views: '1.0k',
                featured: false,
                body_html
              };
              saveArticles([newArt, ...state.articles]);
              showToast('🎉 New article published successfully!');
            } else {
              const idx = state.articles.findIndex(a => a.slug === origSlug);
              if (idx !== -1) {
                state.articles[idx] = {
                  ...state.articles[idx],
                  slug,
                  title,
                  subtitle,
                  image_url,
                  author,
                  date,
                  reading_time,
                  tag,
                  body_html
                };
                saveArticles([...state.articles]);
                showToast('💾 Article changes saved successfully!');
              }
            }

            state.adminEditingArticle = null;
            renderAdminPage();
          });
        }
      }

      renderEditorUi();
      return;
    }

    // LIST VIEW: Filtered articles
    const searchQ = (state.adminArticleSearch || '').toLowerCase().trim();
    const tagFilter = state.adminArticleTag || 'All';
    const filteredAdminArticles = state.articles.filter(a => {
      const matchTag = tagFilter === 'All' || (a.tag && a.tag.toLowerCase() === tagFilter.toLowerCase());
      const matchSearch = searchQ === '' || 
        (a.title && a.title.toLowerCase().includes(searchQ)) || 
        (a.subtitle && a.subtitle.toLowerCase().includes(searchQ)) || 
        (a.slug && a.slug.toLowerCase().includes(searchQ));
      return matchTag && matchSearch;
    });

    appContainer.innerHTML = `
      <section class="admin-page-view" style="padding: 40px 0 80px 0;">
        <div class="container" style="max-width: 1040px;">
          
          <!-- Admin Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
            <div>
              <span style="font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted);">AIRA Admin Control</span>
              <h1 style="font-family: var(--font-header); font-size: 2.2rem; font-weight: 800; color: var(--color-text-primary); margin-top: 4px;">Admin Dashboard</h1>
              <p style="color: var(--color-text-secondary); font-size: 0.95rem; margin-top: 4px;">Manage subscribers and live newsletter articles catalog.</p>
            </div>

            ${state.adminTab === 'subscribers' ? `
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button id="btn-copy-emails" style="background: #FFFFFF; border: 1px solid #D4D4D8; color: #18181B; font-weight: 600; padding: 10px 18px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-size: 0.875rem;">
                  📋 Copy All Emails
                </button>
                <button id="btn-export-csv" style="background: #18181B; color: #FFFFFF; font-weight: 600; padding: 10px 18px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-size: 0.875rem;">
                  📥 Export to CSV
                </button>
              </div>
            ` : `
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button id="btn-add-new-article" style="background: #18181B; color: #FFFFFF; font-weight: 600; padding: 10px 18px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-size: 0.875rem;">
                  ➕ New Article
                </button>
                <button id="btn-download-articles-js" style="background: #FFFFFF; border: 1px solid #D4D4D8; color: #18181B; font-weight: 600; padding: 10px 18px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-size: 0.875rem;">
                  💾 Download articles.js
                </button>
                ${isCustomized ? `
                  <button id="btn-reset-articles" style="background: #FEE2E2; border: 1px solid #FCA5A5; color: #DC2626; font-weight: 600; padding: 10px 16px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-size: 0.875rem;" title="Reset to original 192 articles">
                    🔄 Reset Defaults
                  </button>
                ` : ''}
              </div>
            `}
          </div>

          <!-- Navigation Tabs -->
          <div class="admin-tabs-nav">
            <button class="admin-tab-btn ${state.adminTab === 'articles' ? 'active' : ''}" id="tab-articles">
              📝 Articles & Editor (${state.articles.length})
            </button>
            <button class="admin-tab-btn ${state.adminTab === 'subscribers' ? 'active' : ''}" id="tab-subscribers">
              📬 Subscribers (${normalizedList.length})
            </button>
          </div>

          <!-- TAB: ARTICLES EDITOR & MANAGEMENT -->
          ${state.adminTab === 'articles' ? `
            <!-- Search & Filter Controls -->
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap;">
              <div style="display: flex; gap: 8px; align-items: center; flex: 1; max-width: 420px; background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 8px; padding: 8px 14px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-text-muted);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" id="admin-search-articles" value="${state.adminArticleSearch || ''}" placeholder="Search articles by title, slug..." style="width: 100%; border: none; background: transparent; outline: none; font-size: 0.9rem;" />
              </div>

              <div class="filter-pills" style="margin: 0;">
                <button class="filter-pill ${tagFilter === 'All' ? 'active' : ''}" data-admin-tag="All">All (${state.articles.length})</button>
                <button class="filter-pill ${tagFilter === 'News' ? 'active' : ''}" data-admin-tag="News">News</button>
                <button class="filter-pill ${tagFilter === 'Prompts' ? 'active' : ''}" data-admin-tag="Prompts">Prompts</button>
              </div>
            </div>

            <!-- Articles Table -->
            <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
              <div style="padding: 16px 20px; border-bottom: 1px solid var(--color-border); font-weight: 700; font-size: 1.05rem; display: flex; justify-content: space-between; align-items: center;">
                <span>Articles (${filteredAdminArticles.length})</span>
                <span style="font-size: 0.8125rem; font-weight: 500; color: var(--color-text-muted);">Click "Edit" to modify any article</span>
              </div>

              ${filteredAdminArticles.length === 0 ? `
                <div style="padding: 48px 20px; text-align: center; color: var(--color-text-muted);">
                  <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
                  <h4 style="font-size: 1.1rem; color: var(--color-text-primary); margin-bottom: 6px;">No articles found</h4>
                  <p style="font-size: 0.9rem;">Try adjusting your search query or click "+ New Article" to write a new edition.</p>
                </div>
              ` : `
                <div style="overflow-x: auto;">
                  <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
                    <thead>
                      <tr style="background: #FAFAFA; border-bottom: 1px solid var(--color-border); color: var(--color-text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                        <th style="padding: 12px 16px;">Cover</th>
                        <th style="padding: 12px 16px;">Title & Slug</th>
                        <th style="padding: 12px 16px;">Category</th>
                        <th style="padding: 12px 16px;">Date</th>
                        <th style="padding: 12px 16px; text-align: right;">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${filteredAdminArticles.map(a => `
                        <tr style="border-bottom: 1px solid var(--color-border-light);">
                          <td style="padding: 12px 16px; width: 60px;">
                            <img src="${a.image_url}" alt="${a.title}" style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover; border: 1px solid var(--color-border);" onerror="this.src='assets/logo.jpg'" />
                          </td>
                          <td style="padding: 12px 16px; max-width: 380px;">
                            <div style="font-weight: 700; color: var(--color-text-primary); font-size: 0.95rem; line-height: 1.35; margin-bottom: 4px;">${a.title}</div>
                            <div style="font-size: 0.75rem; color: var(--color-text-muted); font-family: monospace;">#slug: ${a.slug}</div>
                          </td>
                          <td style="padding: 12px 16px;">
                            <span style="background: #F4F4F5; padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; color: #18181B;">${a.tag || 'News'}</span>
                          </td>
                          <td style="padding: 12px 16px; color: var(--color-text-secondary); white-space: nowrap; font-size: 0.8125rem;">
                            ${a.date || 'Recent'}
                          </td>
                          <td style="padding: 12px 16px; text-align: right; white-space: nowrap;">
                            <div style="display: inline-flex; gap: 8px; align-items: center;">
                              <button class="btn-edit-article" data-slug="${a.slug}" style="background: #18181B; color: #FFFFFF; font-weight: 600; padding: 7px 14px; border-radius: 6px; cursor: pointer; font-size: 0.8125rem;">
                                ✏️ Edit
                              </button>
                              <a href="#/p/${a.slug}" target="_blank" style="background: #F4F4F5; border: 1px solid #E4E4E7; color: var(--color-text-primary); font-weight: 600; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 0.8125rem;">
                                👁️ View
                              </a>
                              <button class="btn-delete-article" data-slug="${a.slug}" style="background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; font-weight: 600; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 0.8125rem;" title="Delete Article">
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              `}
            </div>
          ` : `
            <!-- TAB: SUBSCRIBERS -->
            <!-- Metric Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px;">
              <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <div style="font-size: 0.8125rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">Total Subscribers</div>
                <div style="font-size: 2.2rem; font-weight: 800; font-family: var(--font-header); color: var(--color-text-primary); margin-top: 6px;">${normalizedList.length}</div>
              </div>
              <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <div style="font-size: 0.8125rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">Published Editions</div>
                <div style="font-size: 2.2rem; font-weight: 800; font-family: var(--font-header); color: var(--color-text-primary); margin-top: 6px;">${state.articles.length}</div>
              </div>
              <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <div style="font-size: 0.8125rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">Storage Backend</div>
                <div style="font-size: 1.15rem; font-weight: 700; color: #10B981; margin-top: 12px;">● Connected</div>
              </div>
            </div>

            <!-- Subscribers Table -->
            <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
              <div style="padding: 16px 20px; border-bottom: 1px solid var(--color-border); font-weight: 700; font-size: 1.05rem; display: flex; justify-content: space-between; align-items: center;">
                <span>Subscribers (${normalizedList.length})</span>
                <span style="font-size: 0.8125rem; font-weight: 500; color: var(--color-text-muted);">Real-Time</span>
              </div>
              
              ${normalizedList.length === 0 ? `
                <div style="padding: 48px 20px; text-align: center; color: var(--color-text-muted);">
                  <div style="font-size: 2.5rem; margin-bottom: 12px;">📬</div>
                  <h4 style="font-size: 1.1rem; color: var(--color-text-primary); margin-bottom: 6px;">No subscribers yet</h4>
                  <p style="font-size: 0.9rem;">Whenever someone enters their email on any form, it will show up here instantly.</p>
                </div>
              ` : `
                <div style="overflow-x: auto;">
                  <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
                    <thead>
                      <tr style="background: #FAFAFA; border-bottom: 1px solid var(--color-border); color: var(--color-text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                        <th style="padding: 12px 18px;">#</th>
                        <th style="padding: 12px 18px;">Email Address</th>
                        <th style="padding: 12px 18px;">Date & Time</th>
                        <th style="padding: 12px 18px;">Form Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${normalizedList.map(sub => `
                        <tr style="border-bottom: 1px solid var(--color-border-light);">
                          <td style="padding: 14px 18px; color: var(--color-text-muted);">${sub.id}</td>
                          <td style="padding: 14px 18px; font-weight: 600; color: var(--color-text-primary); font-family: monospace; font-size: 0.9rem;">${sub.email}</td>
                          <td style="padding: 14px 18px; color: var(--color-text-secondary);">${sub.date}</td>
                          <td style="padding: 14px 18px;"><span style="background: #F4F4F5; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; color: #18181B;">${sub.source}</span></td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              `}
            </div>
          `}
        </div>
      </section>
    `;

    // Bind Tabs
    const tabSubscribers = document.getElementById('tab-subscribers');
    if (tabSubscribers) {
      tabSubscribers.addEventListener('click', () => {
        state.adminTab = 'subscribers';
        state.adminEditingArticle = null;
        renderAdminPage();
      });
    }

    const tabArticles = document.getElementById('tab-articles');
    if (tabArticles) {
      tabArticles.addEventListener('click', () => {
        state.adminTab = 'articles';
        state.adminEditingArticle = null;
        renderAdminPage();
      });
    }

    // Bind Copy Emails
    const copyBtn = document.getElementById('btn-copy-emails');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (normalizedList.length === 0) {
          showToast('No emails to copy yet!');
          return;
        }
        const emailString = normalizedList.map(s => s.email).join(', ');
        navigator.clipboard.writeText(emailString).then(() => {
          showToast('All emails copied to clipboard! 📋');
        });
      });
    }

    // Bind Export CSV
    const exportBtn = document.getElementById('btn-export-csv');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        if (normalizedList.length === 0) {
          showToast('No subscribers to export yet!');
          return;
        }
        const csvRows = ['ID,Email,Date,Source'];
        normalizedList.forEach(s => {
          csvRows.push(`"${s.id}","${s.email}","${s.date}","${s.source}"`);
        });
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AIRA_Subscribers_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Subscribers exported to CSV! 📥');
      });
    }

    // Bind Article Search
    const searchInput = document.getElementById('admin-search-articles');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.adminArticleSearch = e.target.value;
        renderAdminPage();
        const inputNow = document.getElementById('admin-search-articles');
        if (inputNow) {
          inputNow.focus();
          inputNow.setSelectionRange(inputNow.value.length, inputNow.value.length);
        }
      });
    }

    // Bind Tag Filter Pills
    document.querySelectorAll('[data-admin-tag]').forEach(pill => {
      pill.addEventListener('click', (e) => {
        state.adminArticleTag = e.target.getAttribute('data-admin-tag');
        renderAdminPage();
      });
    });

    // Bind Add New Article
    const addNewBtn = document.getElementById('btn-add-new-article');
    if (addNewBtn) {
      addNewBtn.addEventListener('click', () => {
        const defaultTmpl = ARTICLE_TEMPLATES[0];
        state.adminEditingArticle = {
          isNew: true,
          title: defaultTmpl.sampleTitle,
          slug: defaultTmpl.sampleTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          subtitle: defaultTmpl.sampleSubtitle,
          tag: defaultTmpl.tag,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          reading_time: defaultTmpl.readingTime,
          image_url: 'assets/logo.jpg',
          author: 'AIRA',
          body_html: defaultTmpl.body
        };
        renderAdminPage();
      });
    }

    // Bind Edit Article Buttons
    document.querySelectorAll('.btn-edit-article').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const slug = e.currentTarget.getAttribute('data-slug');
        const found = state.articles.find(a => a.slug === slug);
        if (found) {
          state.adminEditingArticle = found;
          renderAdminPage();
        }
      });
    });

    // Bind Delete Article Buttons
    document.querySelectorAll('.btn-delete-article').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const slug = e.currentTarget.getAttribute('data-slug');
        const found = state.articles.find(a => a.slug === slug);
        if (!found) return;
        if (confirm(`Are you sure you want to delete "${found.title}"?`)) {
          const updated = state.articles.filter(a => a.slug !== slug);
          saveArticles(updated);
          showToast(`🗑️ Article "${found.title.slice(0, 24)}..." deleted.`);
          renderAdminPage();
        }
      });
    });

    // Bind Download articles.js
    const downloadJsBtn = document.getElementById('btn-download-articles-js');
    if (downloadJsBtn) {
      downloadJsBtn.addEventListener('click', () => {
        const jsContent = `/**\n * AIRA Newsletter Articles Database\n * Total ${state.articles.length} Editions\n */\n\nconst ARTICLES = ${JSON.stringify(state.articles, null, 2)};\n`;
        const blob = new Blob([jsContent], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `articles.js`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('articles.js downloaded! 💾');
      });
    }

    // Bind Reset Articles to Defaults
    const resetBtn = document.getElementById('btn-reset-articles');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset articles to the original 192 editions? This will discard custom local edits.')) {
          localStorage.removeItem('aira_custom_articles');
          state.articles = typeof ARTICLES !== 'undefined' ? ARTICLES : [];
          showToast('🔄 Restored default 192 articles!');
          renderAdminPage();
        }
      });
    }
  }

  // =========================================================================
  // 5. Subscription Handler (Connected to Database)
  // =========================================================================
  async function handleSubscribeSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const input = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const email = input ? input.value.trim() : '';
    if (!email) return;

    // Detect form source
    let source = 'AIRA Website Form';
    if (form.id === 'hero-sub-form') source = 'Homepage Hero';
    else if (form.id === 'article-sub-form') source = 'Article Reader Card';
    else if (form.id === 'modal-sub-form') source = 'Navbar Modal';
    else if (form.id === 'footer-sub-form') source = 'Site Footer';

    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Subscribe';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Subscribing...';
    }

    try {
      if (window.DatabaseService) {
        await window.DatabaseService.subscribe(email, source);
      } else {
        const list = JSON.parse(localStorage.getItem('aira_subscribers') || '[]');
        if (!list.includes(email)) {
          list.push(email);
          localStorage.setItem('aira_subscribers', JSON.stringify(list));
        }
      }

      sessionStorage.setItem('aira_unlocked', 'true');
      localStorage.setItem('aira_unlocked', 'true');
      localStorage.setItem('aira_subscribed', 'true');

      if (submitBtn) {
        submitBtn.innerHTML = 'Subscribed! ✓';
      }

      showToast('🎉 Welcome to AIRA! Your email has been saved.');
      input.value = '';

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
        closeModal(subscribeModal);
      }, 1500);
    } catch (err) {
      console.error('Subscription error:', err);
      sessionStorage.setItem('aira_unlocked', 'true');
      localStorage.setItem('aira_unlocked', 'true');
      localStorage.setItem('aira_subscribed', 'true');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
      showToast('Subscription saved! 🚀');
      input.value = '';
      closeModal(subscribeModal);
    }
  }

  // Bind footer form
  const footerForm = document.getElementById('footer-sub-form');
  if (footerForm) {
    footerForm.addEventListener('submit', handleSubscribeSubmit);
  }

  // Bind modal form
  const modalSubForm = document.getElementById('modal-sub-form');
  if (modalSubForm) {
    modalSubForm.addEventListener('submit', handleSubscribeSubmit);
  }

  // =========================================================================
  // 6. Search & Modal Handlers (Fast index over all articles)
  // =========================================================================
  function openModal(modal) {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Global search trigger
  const searchBtn = document.getElementById('btn-search-trigger');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      openModal(searchModal);
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
        performSearch('');
      }
    });
  }

  // Subscribe nav button
  const subNavBtn = document.getElementById('btn-subscribe-header');
  if (subNavBtn) {
    subNavBtn.addEventListener('click', () => {
      openModal(subscribeModal);
    });
  }

  // Close modals on overlay / click
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('.modal-close-btn')) {
        closeModal(modal);
      }
    });
  });

  // Real-time Search Filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });
  }

  function performSearch(query) {
    if (!searchResults) return;
    const q = query.trim().toLowerCase();
    const matches = q === '' 
      ? state.articles.slice(0, 6) 
      : state.articles.filter(a => 
          a.title.toLowerCase().includes(q) || 
          a.subtitle.toLowerCase().includes(q) ||
          a.slug.toLowerCase().includes(q)
        ).slice(0, 10);

    if (matches.length === 0) {
      searchResults.innerHTML = '<p style="padding: 16px; color: var(--color-text-muted); text-align: center;">No articles found matching "' + query + '"</p>';
      return;
    }

    searchResults.innerHTML = matches.map(m => `
      <div class="search-result-item" onclick="window.location.hash='#/p/${m.slug}'; document.getElementById('search-modal').classList.remove('active'); document.body.style.overflow='';">
        <h5>${m.title}</h5>
        <p>${m.subtitle || m.date}</p>
      </div>
    `).join('');
  }

  // Keyboard Shortcuts (Ctrl+K to search, Esc to close)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openModal(searchModal);
      if (searchInput) {
        searchInput.focus();
      }
    } else if (e.key === 'Escape') {
      closeModal(searchModal);
      closeModal(subscribeModal);
      if (articleEditModal) closeModal(articleEditModal);
    }
  });

  // Listen to hash changes
  window.addEventListener('hashchange', renderCurrentRoute);

  // Initial render
  renderCurrentRoute();
});
