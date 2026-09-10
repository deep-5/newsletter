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
    const isUnlocked = sessionStorage.getItem('aira_unlocked') === 'true';

    // When opening root URL for the first time without unlock: show Gate
    if (!hashPath || hashPath === '/' || hashPath === '') {
      if (!isUnlocked) {
        return { name: 'gate' };
      }
      return { name: 'home' };
    }
    if (hashPath === '/home') return { name: 'home' };
    if (hashPath === '/subscribe') return { name: 'subscribe' };
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
          localStorage.setItem('aira_subscribed', 'true');

          if (submitBtn) submitBtn.innerHTML = 'Subscribed! ✓';
          showToast('🎉 Welcome to AIRA! Access granted.');

          setTimeout(() => {
            window.location.hash = '#/home';
          }, 600);
        } catch (err) {
          console.error('Subscription error:', err);
          sessionStorage.setItem('aira_unlocked', 'true');
          window.location.hash = '#/home';
        }
      });
    }
  }

  // =========================================================================
  // 1b. Homepage View (With Dynamic Load More & Clean AIRA Hero)
  // =========================================================================
  function renderHomePage() {
    const filteredArticles = state.selectedTag === 'All' 
      ? state.articles 
      : state.articles.filter(a => a.tag.toLowerCase() === state.selectedTag.toLowerCase());

    const visibleArticles = filteredArticles.slice(0, state.displayedCount);
    const hasMore = filteredArticles.length > state.displayedCount;

    appContainer.innerHTML = `
      <!-- Clean AIRA Hero Section -->
      <section class="hero-section">
        <div class="container">
          <div class="hero-logo-box">
            <img src="assets/logo.jpg" alt="AIRA Logo" class="hero-logo-img" onerror="this.src='assets/logo.svg'" />
          </div>
          <h1 class="hero-title">AIRA</h1>
          <p class="hero-tagline">The one and only AI newsletter. Join us and get the best AI news, tools, and tutorials completely FREE!</p>
          
          <form class="subscribe-form-hero" id="hero-sub-form">
            <input type="email" class="subscribe-input" placeholder="Enter your email" required />
            <button type="submit" class="subscribe-btn-hero">Subscribe</button>
          </form>

          <div class="social-bar-hero">
            <a href="https://whatsapp.com/channel/0029VbC1KWlICVfsFtYhmZ3B" target="_blank" rel="noopener" class="social-icon-btn" title="WhatsApp">
              <svg viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.99.54 1.761.819 2.796.82 3.18 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.807-5.768-5.807zm0 10.455c-.933 0-1.62-.276-2.434-.76l-.174-.103-1.802.472.48-1.758-.113-.18c-.534-.848-.815-1.523-.815-2.36 0-2.618 2.13-4.748 4.748-4.748 2.617 0 4.747 2.13 4.747 4.748 0 2.618-2.13 4.748-4.748 4.748zm2.607-3.565c-.143-.072-.847-.418-.978-.466-.131-.048-.226-.072-.321.072-.095.143-.369.466-.452.561-.083.096-.167.108-.31.036-.143-.072-.603-.222-1.149-.707-.424-.378-.711-.845-.794-.988-.083-.143-.009-.22.063-.291.064-.064.143-.167.214-.25.072-.084.095-.144.143-.239.048-.096.024-.179-.012-.25-.036-.072-.321-.774-.44-1.06-.116-.28-.234-.241-.321-.246l-.274-.005c-.095 0-.25.036-.381.179-.131.143-.5 488-.5 1.19 0 .702.512 1.38 1.583 2.809 1.488 1.987 2.106 2.059 2.487 2.059.512 0 .976-.321 1.119-.774.143-.452.143-.845.1-.929-.048-.083-.143-.131-.286-.202zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.981-1.306A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.636 0-3.17-.487-4.457-1.326l-.32-.209-2.955.775.789-2.88-.228-.363A8.136 8.136 0 0 1 3.833 12c0-4.503 3.664-8.167 8.167-8.167 4.503 0 8.167 3.664 8.167 8.167 0 4.503-3.664 8.167-8.167 8.167z"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/ai-tools-&-ai-news/?viewAsMember=true" target="_blank" rel="noopener" class="social-icon-btn" title="LinkedIn">
              <svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.85 6.44a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/></svg>
            </a>
          </div>
        </div>
      </section>

      <!-- Articles Feed -->
      <section class="feed-section">
        <div class="container">
          <div class="feed-header">
            <h2 class="feed-title">Articles</h2>
            <div class="filter-pills">
              <button class="filter-pill ${state.selectedTag === 'All' ? 'active' : ''}" data-tag="All">All (${state.articles.length})</button>
              <button class="filter-pill ${state.selectedTag === 'News' ? 'active' : ''}" data-tag="News">News</button>
              <button class="filter-pill ${state.selectedTag === 'Prompts' ? 'active' : ''}" data-tag="Prompts">Prompts & Guides</button>
            </div>
          </div>

          <div class="articles-grid" id="main-articles-grid">
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
                    <span class="card-meta-date">${article.date} • ${article.reading_time}</span>
                  </div>
                </div>
              </a>
            `).join('')}
          </div>

          ${hasMore ? `
            <div class="load-more-wrap">
              <button id="btn-load-more" class="btn-load-more">
                <span>Load more articles</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
              </button>
            </div>
          ` : ''}
        </div>
      </section>
    `;

    // Bind hero form
    const heroForm = document.getElementById('hero-sub-form');
    if (heroForm) {
      heroForm.addEventListener('submit', handleSubscribeSubmit);
    }

    // Bind filter pills
    document.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        state.selectedTag = e.target.getAttribute('data-tag');
        state.displayedCount = 9;
        renderHomePage();
      });
    });

    // Bind Load More button
    const loadMoreBtn = document.getElementById('btn-load-more');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        state.displayedCount += 9;
        renderHomePage();
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
            <img src="${article.image_url}" alt="${article.title}" class="article-hero-img" />
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
      const pricingClass = `pricing-${tool.pricing.toLowerCase().replace(/\s+/g, '-')}`;
      const firstCats = (tool.categories || [tool.category]).slice(0, 3);
      const logoUrl = tool.image || `https://www.google.com/s2/favicons?domain=${tool.domain || 'ai.com'}&sz=128`;
      const fallbackIcon = tool.icon || '⚡';

      return `
        <div class="tool-card ${tool.featured ? 'is-featured' : ''}" data-tool-id="${tool.id}">
          <div class="tool-card-top">
            <div class="tool-icon-avatar">
              <img src="${logoUrl}" alt="${tool.name} logo" class="tool-logo-img" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML='<span class=\\'tool-emoji\\'>${fallbackIcon}</span>';" />
            </div>
            <div class="tool-title-group">
              <div class="tool-badges-row">
                ${tool.featured ? `<span class="tool-badge-featured"><span class="bolt">⚡</span> ${tool.badge || 'Featured'}</span>` : (tool.badge ? `<span class="tool-badge-neutral">${tool.badge}</span>` : '')}
                <span class="tool-badge-pricing ${pricingClass}">${tool.pricing}</span>
              </div>
              <h3 class="tool-card-name">${tool.name}</h3>
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
                document.querySelectorAll('.cat-filter-pill').forEach(p => {
                  const isMatch = p.getAttribute('data-cat-id') === cat;
                  p.classList.toggle('active', isMatch);
                  if (isMatch) p.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                });
                updateView();
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

            <!-- Categories Horizontal Filter List -->
            <div class="categories-filter-wrapper">
              <div class="categories-filter-scroll" id="categories-filter-scroll">
                ${categories.map(cat => {
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
        pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        updateView();
      });
    });

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
  // Article Templates & Snippets Library for Admin Studio
  // =========================================================================
  const ARTICLE_TEMPLATES = [
    {
      id: 'beehiiv-signal',
      name: '🐝 Beehiiv Signature (The Signal)',
      tag: 'News',
      readingTime: '4 minutes',
      desc: 'Top Green Banner (THE SIGNAL) + Story Cards + Takeaways + Tool Stack + Quotes',
      sampleTitle: 'Practical plays, shipped fast 🚀',
      sampleSubtitle: 'PLUS: All you need for AI agents that convert, micro-products that win, and tools that end fatigue',
      body: `<div class="beehiiv-newsletter-body">
  <!-- Card 1: THE SIGNAL Header Card -->
  <div class="beehiiv-card border-green">
    <div class="beehiiv-banner-header">
      THE SIGNAL
    </div>
    <p>Hey there, this week we are cutting through the noise and focusing on what actually moves companies forward.</p>
    <p><strong>Here is the playbook:</strong> just three stories and one clear action item from your AI arsenal, contextualized for <a href="#" class="beehiiv-link">maximum growth</a>. No fluffy AI hype, just practical plays, shipped fast, and now done for you below.</p>
    <div style="font-size: 0.85rem; color: #64748B; margin-top: 12px; font-style: italic;">
      ⏱️ Estimated reading time: 4 minutes
    </div>
  </div>

  <!-- Card 2: Growth / Case Study Card with Image, Caption & Quote -->
  <div class="beehiiv-card border-green">
    <span class="beehiiv-tag">GROWTH / CASE STUDY</span>
    <h2 class="beehiiv-headline">
      🌍 AI touches the real world
    </h2>
    
    <div class="section-image-box" style="margin: 18px 0; text-align: center;">
      <img src="assets/logo.jpg" class="section-inline-img" style="width: 100%; max-height: 420px; object-fit: cover; border-radius: 8px;" loading="lazy" />
      <small><p class="beehiiv-caption">Robotics in action - Courtesy: OpenAI & Physical Intelligence</p></small>
    </div>

    <p>Robotics moves beyond labs and <a href="#" class="beehiiv-link">enters factory floors</a>. Instead of code-only tasks, models are now picking, grasping, packing, and sorting with autonomy that surpasses traditional deterministic automation by 4x across initial pilots.</p>
    
    <div class="beehiiv-quote">
      "The next wave of AI isn't chatbots answering your questions, it's AI models taking autonomous actions in the physical world."
      <div class="author">— Jensen Huang</div>
    </div>
  </div>

  <!-- Card 3: 01: The new feed is your inbox -->
  <div class="beehiiv-card border-green">
    <span class="beehiiv-tag">AI / TECH / TRENDS</span>
    <h2 class="beehiiv-headline">
      01: The new feed is your inbox
    </h2>
    
    <div class="section-image-box" style="margin: 18px 0; text-align: center;">
      <img src="assets/logo.jpg" class="section-inline-img" style="width: 100%; max-height: 420px; object-fit: cover; border-radius: 8px;" loading="lazy" />
      <small><p class="beehiiv-caption">Image Source: AIRA Research & Insights</p></small>
    </div>

    <p>Audiences are shifting attention to <a href="#" class="beehiiv-link">curated email newsletters</a> where algorithms can't hide content. Direct distribution builds higher affinity, 6x higher conversion on offers, and guaranteed inbox delivery.</p>

    <div class="beehiiv-takeaway">
      <p style="margin: 0; color: #166534; font-size: 0.95rem;"><strong>Takeaway:</strong> You will be in a position where you can command audience attention without paying gatekeeper tax on every post.</p>
    </div>
  </div>

  <!-- Card 4: 02: Micro-monetization is back -->
  <div class="beehiiv-card border-green">
    <span class="beehiiv-tag">CREATOR ECONOMY</span>
    <h2 class="beehiiv-headline">
      02: Micro-monetization is back
    </h2>
    
    <div class="section-image-box" style="margin: 18px 0; text-align: center;">
      <img src="assets/logo.jpg" class="section-inline-img" style="width: 100%; max-height: 420px; object-fit: cover; border-radius: 8px;" loading="lazy" />
      <small><p class="beehiiv-caption">Micro-payments and direct-to-creator paradigm</p></small>
    </div>

    <p>Tiny paid perks, tokenized access, and micro-subscriptions generate higher lifetime values than bloated courses. Readers pay for speed, clarity, and instant access.</p>

    <div class="beehiiv-takeaway">
      <p style="margin: 0; color: #166534; font-size: 0.95rem;"><strong>Takeaway:</strong> Package one core solution that saves <a href="#" class="beehiiv-link">2 to 10 hours</a>. Price it for impulsive purchase and instant ROI.</p>
    </div>
  </div>

  <!-- Card 5: 03: Real-time visuals, zero rendering -->
  <div class="beehiiv-card border-green">
    <span class="beehiiv-tag">AI TOOLS</span>
    <h2 class="beehiiv-headline">
      03: Real-time visuals, zero rendering
    </h2>
    
    <div class="section-image-box" style="margin: 18px 0; text-align: center;">
      <img src="assets/logo.jpg" class="section-inline-img" style="width: 100%; max-height: 420px; object-fit: cover; border-radius: 8px;" loading="lazy" />
      <small><p class="beehiiv-caption">Real-time generative UI in action</p></small>
    </div>

    <p>Generative software interfaces are updating on the fly. Web apps produce custom dashboards and code layouts in real-time matching user intent.</p>

    <div class="beehiiv-takeaway">
      <p style="margin: 0; color: #166534; font-size: 0.95rem;"><strong>Takeaway:</strong> Ship tools with dynamic UI layouts that tailor to each user session.</p>
    </div>
  </div>

  <!-- Card 6: Maker Playbook & Tool Stack Card -->
  <div class="beehiiv-card border-green">
    <h3 style="font-family: var(--font-header); font-size: 1.25rem; font-weight: 800; color: #0F172A; margin-top: 0; margin-bottom: 12px;">
      04: Maker Playbook:
    </h3>
    <ul style="margin: 0 0 20px 20px; padding: 0; line-height: 1.6;">
      <li>Set up a recurring cadence: 1 live email every 48 hours for brand gravity.</li>
      <li>One flagship asset + 3 micro-products that solve immediate friction.</li>
      <li>Repurpose each edition into a 4-part social breakdown for organic reach.</li>
    </ul>

    <h3 style="font-family: var(--font-header); font-size: 1.25rem; font-weight: 800; color: #0F172A; margin-top: 24px; margin-bottom: 12px; border-top: 1px dashed #E2E8F0; padding-top: 18px;">
      🛠️ Tool Stack of the Week:
    </h3>
    <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
      <p style="margin: 0;"><strong><a href="#" class="beehiiv-link">Flux Pro</a>:</strong> State-of-the-art AI imagery model for photoreal cover banners.</p>
      <p style="margin: 0;"><strong><a href="#" class="beehiiv-link">Claude Code</a>:</strong> AI agent for instant multi-file software engineering.</p>
      <p style="margin: 0;"><strong><a href="#" class="beehiiv-link">ClickTailwind</a>:</strong> Curates everything you need for responsive web cards.</p>
    </div>

    <div class="beehiiv-quote">
      "Execution isn't rare. What is rare is consistent delivery that compounds value week over week."
      <div class="author">— AIRA Intel</div>
    </div>
  </div>

  <!-- Signoff -->
  <div class="author-signoff" style="margin-top: 36px; padding-top: 20px; border-top: 1px solid var(--color-border); font-size: 1rem;">
    Until next week,<br><strong>AIRA</strong>
  </div>
</div>`
    },
    {
      id: 'news-standard',
      name: '📰 Standard AI News Edition',
      tag: 'News',
      readingTime: '4 minutes',
      desc: 'Intro briefing + Main story + 💡 AIRA Perspective + Featured tools + News bites',
      sampleTitle: 'Next-Gen AI Breakthrough: Key Insights & Industry Impact',
      sampleSubtitle: 'Plus: Top AI Tools and Weekly Intelligence Breakdown',
      body: `<div id="content-blocks">
  <div>
    <p>Welcome back to AIRA — your essential intelligence briefing on cutting-edge AI breakthroughs, models, tools, and tutorials.</p>
    <p>Here is what we are unpacking in today's edition:</p>
    <ul>
      <li><strong>Major Headline:</strong> Breakthrough model launch and capabilities</li>
      <li><strong>Enterprise Move:</strong> Strategic AI partnership and funding</li>
      <li><strong>Super Tools:</strong> 4 high-leverage productivity tools</li>
      <li><strong>⚡ Quick AI News Bites:</strong> 4 Rapid industry updates</li>
    </ul>
    <p><em>Estimated reading time: 4 minutes.</em></p>
  </div>

  <div>
    <h2>🚀 Major Story: Breakthrough Model Capabilities</h2>
    <div class="section-image-box" style="margin: 20px 0; text-align: center;">
      <img src="assets/logo.jpg" class="section-inline-img" style="max-width: 100%; border-radius: 8px;" loading="lazy" />
      <small><p style="color: var(--color-text-muted); font-size: 0.8rem; margin-top: 6px;">Image Source: AIRA Intelligence</p></small>
    </div>
    <p>OpenAI has officially announced their newest frontier model, featuring unprecedented reasoning capabilities and autonomous task execution.</p>
    <ul>
      <li><strong>Key Benchmark:</strong> Outperforms existing models on complex reasoning benchmarks by 38%.</li>
      <li><strong>Direct Computer Control:</strong> Capable of interacting with native software, APIs, and workflows in real time.</li>
      <li><strong>Availability:</strong> Rolling out to all Pro and Enterprise subscribers starting this week.</li>
    </ul>
    <div class="aira-perspective-box" style="background: #F8FAFC; border-left: 4px solid #18181B; border-radius: 8px; padding: 18px 22px; margin: 24px 0;">
      <p style="margin: 0; font-size: 1rem; color: #18181B;"><strong>💡 AIRA Perspective:</strong> The shift from conversational chatbots to action-oriented agents is accelerating. Companies that integrate these automated workflows will see massive productivity gains.</p>
    </div>
  </div>

  <div>
    <h2>🏢 Enterprise Move: Strategic AI Integration</h2>
    <p>Global enterprises are rapidly consolidating their AI infrastructure to build customized internal agents.</p>
    <ul>
      <li><strong>Deployment Scale:</strong> Over 50,000 corporate seats enabled across Fortune 500 companies.</li>
      <li><strong>Security & Privacy:</strong> Fully on-premise and VPC compliance guarantees zero data retention.</li>
    </ul>
  </div>

  <div>
    <h3>🛠️ Featured AI Tools (Productivity & Coding)</h3>
    <p><strong><a href="#" target="_blank">Tool 1</a>:</strong> AI agent that automates customer support workflows and data entry.</p>
    <p><strong><a href="#" target="_blank">Tool 2</a>:</strong> Full-stack code refactoring and bug identification assistant.</p>
    <p><strong><a href="#" target="_blank">Tool 3</a>:</strong> Research synthesizer that turns 100-page PDFs into executive briefs.</p>
  </div>

  <div>
    <h4>⚡ ⚡ Quick AI News Bites</h4>
    <ul>
      <li><strong>Mistral AI:</strong> Raises €3B in fresh funding round to build open-weights models.</li>
      <li><strong>Google DeepMind:</strong> Releases new multimodal benchmark for robotic control.</li>
      <li><strong>Meta AI:</strong> Expands real-time voice translation across WhatsApp and Instagram.</li>
      <li><strong>NVIDIA:</strong> Unveils next-generation AI accelerators with 4x memory bandwidth.</li>
    </ul>
  </div>

  <div class="author-signoff" style="margin-top: 36px; padding-top: 20px; border-top: 1px solid var(--color-border);">
    Until next time,<br><strong>AIRA</strong>
  </div>
</div>`
    },
    {
      id: 'tool-review',
      name: '🛠️ AI Tool Review & Breakdown',
      tag: 'AI Tools',
      readingTime: '5 minutes',
      desc: 'Tool overview + Specs card + Top 3 features + Pros/Cons grid + AIRA verdict',
      sampleTitle: 'Hands-On Review: Testing the Most Powerful AI Coding Workspace',
      sampleSubtitle: 'Features, Benchmarks, Pros & Cons, and How It Compares to Alternatives',
      body: `<div id="content-blocks">
  <div>
    <p>Welcome back to AIRA. Today we are diving deep into a comprehensive review of a groundbreaking AI productivity tool designed to transform developer workflows.</p>
  </div>

  <div>
    <h2>🌟 Tool Spotlight: Overview & What It Does</h2>
    <p>This platform combines modern language models with a deeply integrated workspace, allowing users to build and automate complex tasks in minutes.</p>
    
    <div style="background: #F8FAFC; border: 1px solid #E4E4E7; border-left: 4px solid #10B981; border-radius: 8px; padding: 20px; margin: 24px 0;">
      <h4 style="margin-top: 0; margin-bottom: 12px; font-size: 1.1rem; color: #0F172A;">⚡ Quick Specifications</h4>
      <p style="margin: 6px 0;"><strong>Category:</strong> AI Coding & Productivity</p>
      <p style="margin: 6px 0;"><strong>Pricing:</strong> Free Starter tier / $20 per month Pro</p>
      <p style="margin: 6px 0;"><strong>Key Integrations:</strong> GitHub, VS Code, Slack, Terminal</p>
      <p style="margin: 6px 0;"><strong>Best For:</strong> Engineers, Designers, and Solo Founders</p>
    </div>
  </div>

  <div>
    <h3>🚀 Top 3 Killer Features</h3>
    <ul>
      <li><strong>1. Autonomous Workspace Agents:</strong> Handles multi-file refactoring, dependency updates, and automated testing without manual intervention.</li>
      <li><strong>2. Infinite Context Indexing:</strong> Searches and recalls entire project codebases with zero latency.</li>
      <li><strong>3. One-Click Staging Deployments:</strong> Generates live shareable previews with temporary sandbox environments.</li>
    </ul>
  </div>

  <div>
    <h3>⚖️ Pros & Cons</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0;">
      <div style="background: #F0FDF4; border: 1px solid #BBF7D0; padding: 18px; border-radius: 8px;">
        <strong style="color: #166534; font-size: 1rem;">✅ What We Loved</strong>
        <ul style="margin: 10px 0 0 16px; padding: 0; font-size: 0.95rem; line-height: 1.6;">
          <li>Blazing fast response times</li>
          <li>Accurate multi-file reasoning</li>
          <li>Generous free monthly quota</li>
        </ul>
      </div>
      <div style="background: #FEF2F2; border: 1px solid #FECACA; padding: 18px; border-radius: 8px;">
        <strong style="color: #991B1B; font-size: 1rem;">⚠️ What Needs Work</strong>
        <ul style="margin: 10px 0 0 16px; padding: 0; font-size: 0.95rem; line-height: 1.6;">
          <li>Requires fast internet connection</li>
          <li>Steep learning curve for custom plugins</li>
        </ul>
      </div>
    </div>
  </div>

  <div>
    <h3>💡 The AIRA Verdict</h3>
    <p>Overall Score: <strong>9.2 / 10</strong>. A must-try tool for any modern creator or engineer looking to 10x their output.</p>
  </div>

  <div class="author-signoff" style="margin-top: 36px; padding-top: 20px; border-top: 1px solid var(--color-border);">
    Until next time,<br><strong>AIRA</strong>
  </div>
</div>`
    },
    {
      id: 'prompt-tutorial',
      name: '💡 AI Prompt & Step-by-Step Tutorial',
      tag: 'Prompts',
      readingTime: '4 minutes',
      desc: 'Goal explanation + Copyable master prompt block + Step-by-step tutorial + Pro tips',
      sampleTitle: 'Master Prompting: The Exact Framework to Generate Flawless Code',
      sampleSubtitle: 'Step-by-Step Guide, Copy-Paste Prompt Template, and Real-World Examples',
      body: `<div id="content-blocks">
  <div>
    <p>Welcome to AIRA's prompt engineering masterclass. In this edition, we share an exact formula you can use right away to generate clean, bug-free outputs from any frontier model.</p>
  </div>

  <div>
    <h2>🎯 Why Generic Prompts Fail</h2>
    <p>Most people give models vague instructions like <em>"Write code for a login page"</em>. The model has to guess constraints, framework choices, and security considerations.</p>
    <p>Instead, structured role prompting with constraints yields 10x better results.</p>
  </div>

  <div>
    <h2>📋 The Master Copy-Paste Prompt</h2>
    <p>Copy this prompt directly into ChatGPT, Claude, or Gemini:</p>
    
    <div style="background: #18181B; color: #F4F4F5; padding: 22px; border-radius: 8px; font-family: monospace; font-size: 0.875rem; line-height: 1.6; margin: 20px 0; border: 1px solid #27272A; white-space: pre-wrap;">Act as a Senior AI Software Architect. Your task is to design and implement:

[INSERT TASK / FEATURE DESCRIPTION HERE]

Tech Stack & Constraints:
- Architecture: Clean, modular, responsive
- Performance: Zero unnecessary dependencies
- Error Handling: Comprehensive edge case validation

Output Format:
1. High-level architectural overview (3 bullet points)
2. Complete, copy-paste ready code block with comments
3. Verification and test cases</div>
  </div>

  <div>
    <h3>🛠️ Step-by-Step Implementation</h3>
    <ol>
      <li><strong>Step 1: Set the Persona & Role:</strong> Clearly define the expertise level you expect.</li>
      <li><strong>Step 2: Provide Domain Constraints:</strong> List libraries, frameworks, or database schemas.</li>
      <li><strong>Step 3: Force Verification:</strong> Ask the model to double-check its logic before producing the final code.</li>
    </ol>
  </div>

  <div class="aira-perspective-box" style="background: #F8FAFC; border-left: 4px solid #18181B; border-radius: 8px; padding: 18px 22px; margin: 24px 0;">
    <p style="margin: 0; font-size: 1rem; color: #18181B;"><strong>💡 Pro-Tip:</strong> Always include one "Bad Example" in your prompt to show the model what mistakes to specifically avoid.</p>
  </div>

  <div class="author-signoff" style="margin-top: 36px; padding-top: 20px; border-top: 1px solid var(--color-border);">
    Until next time,<br><strong>AIRA</strong>
  </div>
</div>`
    },
    {
      id: 'weekly-roundup',
      name: '⚡ Weekly AI Roundup (Top 5 Stories)',
      tag: 'News',
      readingTime: '3 minutes',
      desc: '5 Numbered stories with clean highlights, stats, and takeaways',
      sampleTitle: 'The AI Weekly: 5 Major Breakthroughs You Might Have Missed',
      sampleSubtitle: 'Model Releases, Open Source Surprises, and Global Policy Updates',
      body: `<div id="content-blocks">
  <div>
    <p>Welcome back to AIRA's weekly roundup. Here is our curated summary of the 5 most important developments in artificial intelligence this week.</p>
  </div>

  <div>
    <h2>1. 🤖 Major Model Upgrade Released</h2>
    <p>A new frontier model release has shattered previous reasoning benchmarks across mathematics, coding, and logical inference.</p>
    <ul>
      <li><strong>Key Stat:</strong> Achieved a 94.2% score on competitive coding benchmarks.</li>
      <li><strong>Impact:</strong> Available to all developers via API at 50% lower cost per token.</li>
    </ul>
  </div>

  <div>
    <h2>2. 🧠 Open Source Innovation Surges</h2>
    <p>A new open-weights model capable of running locally on consumer laptops has been released, matching models 5x its size.</p>
  </div>

  <div>
    <h2>3. ⚡ Autonomous AI Agents in Production</h2>
    <p>Leading tech companies report that automated AI agents are now resolving over 40% of standard IT tickets without human intervention.</p>
  </div>

  <div>
    <h2>4. 💼 Venture Capital & Tech Mergers</h2>
    <p>Over $4.2B in venture funding was deployed this week into specialized AI hardware and energy infrastructure startups.</p>
  </div>

  <div>
    <h2>5. 🛡️ Global Safety & Governance Guidelines</h2>
    <p>International regulatory bodies convened to establish universal evaluation standards for autonomous AI agents.</p>
  </div>

  <div class="author-signoff" style="margin-top: 36px; padding-top: 20px; border-top: 1px solid var(--color-border);">
    Until next time,<br><strong>AIRA</strong>
  </div>
</div>`
    },
    {
      id: 'blank-clean',
      name: '📄 Clean Minimal Starter',
      tag: 'News',
      readingTime: '3 minutes',
      desc: 'Minimal clean layout with header, paragraph, bullet list, and signoff',
      sampleTitle: 'Title of Your New Article Edition',
      sampleSubtitle: 'Subtitle or key highlight of this edition',
      body: `<div id="content-blocks">
  <div>
    <p>Welcome back to AIRA — your essential intelligence briefing on cutting-edge AI breakthroughs, models, tools, and tutorials.</p>
  </div>

  <div>
    <h2>Main Section Title</h2>
    <p>Write your article content here...</p>
    <ul>
      <li><strong>Key Point 1:</strong> Detail here.</li>
      <li><strong>Key Point 2:</strong> Detail here.</li>
    </ul>
  </div>

  <div class="author-signoff" style="margin-top: 36px; padding-top: 20px; border-top: 1px solid var(--color-border);">
    Until next time,<br><strong>AIRA</strong>
  </div>
</div>`
    }
  ];

  const SNIPPETS = {
    beehiiv_card: `
<div class="beehiiv-card border-green">
  <span class="beehiiv-tag">CATEGORY / TAG</span>
  <h2 class="beehiiv-headline">
    🌟 Story Title Here
  </h2>
  <p>Write your story breakdown paragraph here with <a href="#" class="beehiiv-link">bold highlight link</a>.</p>
  <div class="beehiiv-takeaway">
    <p style="margin: 0; color: #166534; font-size: 0.95rem;"><strong>Takeaway:</strong> Key action item or takeaway for readers.</p>
  </div>
</div>
`,
    beehiiv_banner: `
<div class="beehiiv-card border-green">
  <div class="beehiiv-banner-header">
    THE SIGNAL
  </div>
  <p>Introductory briefing content goes here...</p>
</div>
`,
    takeaway: `
<div class="beehiiv-takeaway">
  <p style="margin: 0; color: #166534; font-size: 0.95rem;"><strong>Takeaway:</strong> Add actionable summary here.</p>
</div>
`,
    quote: `
<div class="beehiiv-quote">
  "Add inspiring or key thought quote here."
  <div class="author">— Author / Speaker</div>
</div>
`,
    toolstack: `
<div class="beehiiv-card border-green">
  <h3 style="font-family: var(--font-header); font-size: 1.25rem; font-weight: 800; color: #0F172A; margin: 0 0 14px 0;">
    🛠️ Tool Stack of the Week:
  </h3>
  <div style="display: flex; flex-direction: column; gap: 10px;">
    <p style="margin: 0;"><strong><a href="#" class="beehiiv-link">Tool Name 1</a>:</strong> Description of tool and capabilities.</p>
    <p style="margin: 0;"><strong><a href="#" class="beehiiv-link">Tool Name 2</a>:</strong> Description of tool and capabilities.</p>
  </div>
</div>
`,
    h2: '\n<h2>🌟 Section Heading Here</h2>\n',
    p: '\n<p>Write your detailed paragraph explanation here...</p>\n',
    ul: '\n<ul>\n  <li><strong>Point 1:</strong> Key detail explanation.</li>\n  <li><strong>Point 2:</strong> Key detail explanation.</li>\n  <li><strong>Point 3:</strong> Key detail explanation.</li>\n</ul>\n',
    perspective: '\n<div class="aira-perspective-box" style="background: #F8FAFC; border-left: 4px solid #18181B; border-radius: 8px; padding: 18px 22px; margin: 22px 0;">\n  <p style="margin: 0; font-size: 1rem; color: #18181B;"><strong>💡 AIRA Perspective:</strong> Add your analytical takeaway and future implications here.</p>\n</div>\n',
    prompt: '\n<div style="background: #18181B; color: #F4F4F5; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 0.875rem; line-height: 1.6; margin: 20px 0; border: 1px solid #27272A; white-space: pre-wrap;">Act as a Senior AI Specialist.\n\nTask: [Insert Task Here]\n\nOutput Format:\n- Key Insights\n- Step-by-Step Plan</div>\n',
    newsbites: '\n<div style="margin: 24px 0;">\n  <h4>⚡ ⚡ Quick AI News Bites</h4>\n  <ul>\n    <li><strong>Company A:</strong> Releases new model update with benchmark improvements.</li>\n    <li><strong>Company B:</strong> Announces major AI partnership for enterprise automation.</li>\n  </ul>\n</div>\n',
    signoff: '\n<div class="author-signoff" style="margin-top: 36px; padding-top: 20px; border-top: 1px solid var(--color-border);">\n  Until next week,<br><strong>AIRA</strong>\n</div>\n'
  };

  function insertTextAtCursor(el, text) {
    if (!el) return;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const val = el.value;
    el.value = val.substring(0, start) + text + val.substring(end);
    el.selectionStart = el.selectionEnd = start + text.length;
    el.focus();
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

    // IF EDITING AN ARTICLE: Render Full-Screen Inline Editor Studio
    if (state.adminEditingArticle) {
      const art = state.adminEditingArticle;
      const isNew = !!art.isNew;

      appContainer.innerHTML = `
        <section class="admin-page-view" style="padding: 36px 0 80px 0;">
          <div class="container" style="max-width: 980px;">
            <!-- Top Action Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
              <button type="button" id="btn-back-to-list" style="background: #F4F4F5; border: 1px solid #E4E4E7; color: var(--color-text-primary); font-weight: 600; padding: 9px 16px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-size: 0.875rem;">
                ← Back to Articles List
              </button>
              
              <div style="display: flex; gap: 10px; align-items: center;">
                ${!isNew ? `
                  <a href="#/p/${art.slug}" target="_blank" style="background: #FFFFFF; border: 1px solid #D4D4D8; color: var(--color-text-primary); font-weight: 600; padding: 9px 16px; border-radius: 8px; text-decoration: none; font-size: 0.875rem; display: inline-flex; align-items: center; gap: 6px;">
                    👁️ View Live ↗
                  </a>
                ` : ''}
                <button type="submit" form="inline-article-form" style="background: #18181B; color: #FFFFFF; font-weight: 700; padding: 9px 24px; border-radius: 8px; cursor: pointer; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 6px;">
                  💾 Save & Publish
                </button>
              </div>
            </div>

            <!-- Editor Card -->
            <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
              <div style="margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--color-border);">
                <span style="font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted);">AIRA Article Studio</span>
                <h2 style="font-family: var(--font-header); font-size: 1.75rem; font-weight: 800; color: var(--color-text-primary); margin-top: 4px;">
                  ${isNew ? '➕ Create New Article Edition' : '✏️ Edit Article: ' + (art.title || '')}
                </h2>
              </div>

              <!-- Ready-Made Template Selector Bar -->
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 18px 20px; margin-bottom: 28px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                  <span style="font-weight: 700; font-size: 0.95rem; color: #0F172A; display: inline-flex; align-items: center; gap: 6px;">
                    ✨ Article Templates (Click to Load)
                  </span>
                  <span style="color: var(--color-text-muted); font-size: 0.8125rem;">Select any template to instantly load pre-formatted layouts</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;">
                  ${ARTICLE_TEMPLATES.map(tmpl => `
                    <button type="button" class="btn-select-template" data-template-id="${tmpl.id}" style="text-align: left; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 12px 14px; cursor: pointer;">
                      <div style="font-weight: 700; font-size: 0.875rem; color: #1E293B; margin-bottom: 3px;">${tmpl.name}</div>
                      <div style="font-size: 0.75rem; color: #64748B; line-height: 1.35;">${tmpl.desc}</div>
                    </button>
                  `).join('')}
                </div>
              </div>

              <form id="inline-article-form" class="article-edit-form">
                <input type="hidden" id="edit-orig-slug" value="${art.slug || ''}" />
                <input type="hidden" id="edit-is-new-val" value="${isNew ? 'true' : 'false'}" />

                <div class="form-grid-row">
                  <div class="form-group">
                    <label class="form-label">Article Title *</label>
                    <input type="text" id="editor-title" class="form-control-input" value="${(art.title || '').replace(/"/g, '&quot;')}" placeholder="e.g. Anthropic Unveils Claude 3.7 Sonnet" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">URL Slug *</label>
                    <input type="text" id="editor-slug" class="form-control-input" value="${art.slug || ''}" placeholder="e.g. anthropic-unveils-claude-3-7" required />
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

                <div class="form-grid-row">
                  <div class="form-group">
                    <label class="form-label">Cover Image URL / Upload</label>
                    <div style="display: flex; gap: 8px; align-items: center;">
                      <input type="url" id="editor-image" class="form-control-input" value="${art.image_url || 'assets/logo.jpg'}" style="flex: 1;" placeholder="https://... or upload" />
                      <label for="editor-cover-file-input" style="background: #18181B; color: #FFFFFF; font-weight: 600; font-size: 0.8125rem; padding: 10px 14px; border-radius: var(--radius-sm); cursor: pointer; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px;" title="Upload photo from device">
                        📁 Upload Cover
                        <input type="file" id="editor-cover-file-input" accept="image/*" style="display: none;" />
                      </label>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Author Name</label>
                    <input type="text" id="editor-author" class="form-control-input" value="${art.author || 'AIRA'}" />
                  </div>
                </div>

                <!-- Body Editor with Visual WYSIWYG & HTML Mode -->
                <div class="form-group" style="margin-top: 14px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
                    <div>
                      <label class="form-label" style="margin: 0; font-size: 0.95rem; font-weight: 700;">Article Body Studio *</label>
                      <span style="font-size: 0.8125rem; color: #047857; font-weight: 600; margin-left: 6px;">✨ Visual Interactive Editor (Click & Type Directly)</span>
                    </div>
                    
                    <!-- Mode Toggle: Visual vs HTML Code -->
                    <div style="display: inline-flex; background: #F1F5F9; border-radius: 6px; padding: 2px;">
                      <button type="button" id="tab-visual-mode" class="editor-view-toggle active" style="border: none; background: #FFFFFF; font-weight: 700; font-size: 0.78rem; padding: 6px 14px; border-radius: 4px; cursor: pointer; color: #0F172A; box-shadow: 0 1px 2px rgba(0,0,0,0.08);">✨ Visual Editor</button>
                      <button type="button" id="tab-code-mode" class="editor-view-toggle" style="border: none; background: transparent; font-weight: 600; font-size: 0.78rem; padding: 6px 14px; border-radius: 4px; cursor: pointer; color: #64748B;">📝 HTML Code</button>
                    </div>
                  </div>

                  <!-- Visual Toolbar -->
                  <div id="editor-rich-toolbar" class="editor-rich-toolbar">
                    <!-- Row 1: Formatting Tools -->
                    <div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center;">
                      <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: #64748B; margin-right: 4px;">Format:</span>
                      <button type="button" class="editor-rich-btn btn-rich-format" data-cmd="bold" title="Bold (Ctrl+B)"><b>B</b></button>
                      <button type="button" class="editor-rich-btn btn-rich-format" data-cmd="italic" title="Italic (Ctrl+I)"><i>I</i></button>
                      <button type="button" class="editor-rich-btn btn-rich-format" data-cmd="underline" title="Underline (Ctrl+U)"><u>U</u></button>
                      <button type="button" class="editor-rich-btn btn-rich-format" data-cmd="createLink" title="Insert Link">🔗 Link</button>
                      <button type="button" class="editor-rich-btn btn-rich-format" data-cmd="unlink" title="Remove Link">🔗✕</button>
                      <span style="color: #CBD5E1; margin: 0 2px;">|</span>
                      <button type="button" class="editor-rich-btn btn-rich-format" data-cmd="formatBlock" data-val="H2" title="H2 Heading">H2</button>
                      <button type="button" class="editor-rich-btn btn-rich-format" data-cmd="formatBlock" data-val="H3" title="H3 Subheading">H3</button>
                      <button type="button" class="editor-rich-btn btn-rich-format" data-cmd="formatBlock" data-val="P" title="Normal Paragraph">P</button>
                      <button type="button" class="editor-rich-btn btn-rich-format" data-cmd="insertUnorderedList" title="Bullet List">• List</button>
                      <button type="button" class="editor-rich-btn btn-rich-format" data-cmd="insertOrderedList" title="Numbered List">1. List</button>
                      <button type="button" class="editor-rich-btn btn-rich-format" data-cmd="removeFormat" title="Clear Formatting">🧹 Clear</button>
                    </div>

                    <!-- Row 2: Beehiiv Components & Cards Inserter -->
                    <div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center; padding-top: 6px; border-top: 1px solid #E2E8F0;">
                      <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: #047857; margin-right: 4px;">🐝 Beehiiv Cards:</span>
                      <button type="button" id="btn-open-image-studio" class="btn-component-insert" style="background: #18181B; color: #FFFFFF; font-weight: 700; border: none; box-shadow: 0 1px 3px rgba(0,0,0,0.15);">
                        🖼️ + Add / Upload Image
                      </button>
                      <button type="button" class="btn-component-insert btn-insert-visual-block" data-block="beehiiv_card" style="background: #E8FDF2; color: #047857; font-weight: 700; border: 1px solid #A7F3D0;">+ 🟢 Story Card</button>
                      <button type="button" class="btn-component-insert btn-insert-visual-block" data-block="beehiiv_banner" style="background: #E8FDF2; color: #047857; font-weight: 700; border: 1px solid #A7F3D0;">+ 🏷️ Banner</button>
                      <button type="button" class="btn-component-insert btn-insert-visual-block" data-block="takeaway" style="background: #FEF3C7; color: #92400E; font-weight: 700; border: 1px solid #FDE68A;">+ 💡 Takeaway</button>
                      <button type="button" class="btn-component-insert btn-insert-visual-block" data-block="toolstack" style="background: #EFF6FF; color: #1D4ED8; font-weight: 700; border: 1px solid #BFDBFE;">+ 🛠️ Tool Stack</button>
                      <button type="button" class="btn-component-insert btn-insert-visual-block" data-block="quote" style="background: #F3E8FF; color: #6B21A8; font-weight: 700; border: 1px solid #E9D5FF;">+ 💬 Quote Box</button>
                      <button type="button" class="btn-component-insert btn-insert-visual-block" data-block="prompt" style="background: #FFFFFF; color: #18181B; font-weight: 600; border: 1px solid #CBD5E1;">📋 Prompt Box</button>
                      <button type="button" class="btn-component-insert btn-insert-visual-block" data-block="signoff" style="background: #FFFFFF; color: #18181B; font-weight: 600; border: 1px solid #CBD5E1;">✍️ Signoff</button>
                    </div>
                  </div>

                  <!-- Helpful Visual Tip -->
                  <div id="visual-editor-tip" style="margin-bottom: 8px; font-size: 0.78rem; color: #64748B; display: flex; align-items: center; gap: 6px;">
                    <span>💡 <strong>Tip:</strong> Neeche diye hue visual cards ya text par kahin bhi click karein aur directly Word / Notion ki tarah likhein!</span>
                  </div>

                  <!-- Visual Canvas (Default WYSIWYG) -->
                  <div id="editor-visual-canvas" class="article-rich-body beehiiv-visual-canvas" contenteditable="true" spellcheck="true">${art.body_html || ''}</div>

                  <!-- Textarea Code Editor (Hidden by default, shown in HTML mode) -->
                  <textarea id="editor-body" class="form-control-textarea" style="display: none; min-height: 480px; font-family: monospace; font-size: 0.875rem;">${art.body_html || ''}</textarea>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--color-border);">
                  <button type="button" id="btn-cancel-inline-editor" class="btn-cancel-modal">Cancel</button>
                  <button type="submit" class="btn-save-modal" style="font-size: 0.95rem; padding: 11px 28px;">💾 Save & Publish</button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <!-- Beehiiv Image Inserter Modal -->
        <div class="modal-overlay" id="beehiiv-image-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9999; justify-content: center; align-items: center; padding: 20px;">
          <div class="modal-card" style="max-width: 520px; width: 100%; padding: 26px; border-radius: 12px; background: #FFFFFF; box-shadow: 0 20px 50px rgba(0,0,0,0.25); max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--color-border);">
              <div>
                <h3 style="font-family: var(--font-header); font-size: 1.25rem; font-weight: 800; color: #18181B; margin: 0;">🖼️ Insert Image (Beehiiv Style)</h3>
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
                <div style="font-weight: 700; font-size: 0.92rem; color: #1E293B;">Click to select or drag image here</div>
                <div style="font-size: 0.75rem; color: #64748B; margin-top: 4px;">Supports PNG, JPG, WebP, GIF (Auto-optimized)</div>
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
              <input type="text" id="modal-img-caption-input" class="form-control-input" placeholder="e.g. Image Source: OpenAI / Midjourney / Reuters" />
            </div>

            <!-- Destination Link on Image -->
            <div style="margin-bottom: 14px;">
              <label class="form-label" style="font-size: 0.8125rem;">Clickable Link on Image (Optional)</label>
              <input type="url" id="modal-img-link-input" class="form-control-input" placeholder="https://... (When reader clicks photo)" />
            </div>

            <!-- Alt Text -->
            <div style="margin-bottom: 16px;">
              <label class="form-label" style="font-size: 0.8125rem;">Alt Text / Description (Optional)</label>
              <input type="text" id="modal-img-alt-input" class="form-control-input" placeholder="e.g. AI Model Architecture Diagram" />
            </div>

            <!-- Live Preview Card inside Modal -->
            <div id="modal-img-preview-card" style="display: none; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; margin-bottom: 18px; text-align: center;">
              <div style="font-size: 0.75rem; font-weight: 700; color: #64748B; text-align: left; margin-bottom: 8px;">LIVE PREVIEW:</div>
              <img id="modal-img-preview-img" src="" alt="Preview" style="max-width: 100%; max-height: 220px; border-radius: 8px; object-fit: cover; border: 1px solid #E2E8F0;" />
              <div id="modal-img-preview-caption-text" style="font-size: 0.75rem; color: #64748B; margin-top: 6px; font-style: italic;"></div>
            </div>

            <!-- Modal Footer Actions -->
            <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid var(--color-border); padding-top: 16px;">
              <button type="button" id="btn-cancel-img-modal" class="btn-cancel-modal" style="padding: 9px 18px; font-size: 0.875rem;">Cancel</button>
              <button type="button" id="btn-insert-img-confirm" class="btn-save-modal" style="padding: 9px 22px; font-size: 0.875rem;">✨ Insert into Article</button>
            </div>
          </div>
        </div>
      `;

      // Bind Back Button
      document.getElementById('btn-back-to-list')?.addEventListener('click', () => {
        state.adminEditingArticle = null;
        renderAdminPage();
      });

      document.getElementById('btn-cancel-inline-editor')?.addEventListener('click', () => {
        state.adminEditingArticle = null;
        renderAdminPage();
      });

      // Cover Image File Upload Handler
      const coverFileInput = document.getElementById('editor-cover-file-input');
      const coverUrlInput = document.getElementById('editor-image');
      if (coverFileInput && coverUrlInput) {
        coverFileInput.addEventListener('change', async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            try {
              showToast('Optimizing cover image... ⏳');
              const dataUrl = await readAndOptimizeImage(file, 1400, 900, 0.85);
              coverUrlInput.value = dataUrl;
              showToast('Cover image ready! 🖼️');
            } catch (err) {
              showToast('Error loading image. Please try another file.');
            }
          }
        });
      }

      // Auto-generate slug on typing title when new
      const titleInp = document.getElementById('editor-title');
      const slugInp = document.getElementById('editor-slug');
      if (titleInp && slugInp && isNew) {
        titleInp.addEventListener('input', () => {
          slugInp.value = titleInp.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        });
      }

      // Beehiiv Image Inserter Modal Logic
      const imgModal = document.getElementById('beehiiv-image-modal');
      const openImgStudioBtn = document.getElementById('btn-open-image-studio');
      const closeImgModalBtn = document.getElementById('btn-close-img-modal');
      const cancelImgModalBtn = document.getElementById('btn-cancel-img-modal');
      const tabImgUpload = document.getElementById('tab-img-upload');
      const tabImgUrl = document.getElementById('tab-img-url');
      const sectionImgUpload = document.getElementById('section-img-upload');
      const sectionImgUrl = document.getElementById('section-img-url');
      const modalImgFileInput = document.getElementById('modal-img-file');
      const modalImgDropzone = document.getElementById('modal-img-dropzone');
      const modalImgUrlInput = document.getElementById('modal-img-url-input');
      const modalImgCaptionInput = document.getElementById('modal-img-caption-input');
      const modalImgLinkInput = document.getElementById('modal-img-link-input');
      const modalImgAltInput = document.getElementById('modal-img-alt-input');
      const modalImgPreviewCard = document.getElementById('modal-img-preview-card');
      const modalImgPreviewImg = document.getElementById('modal-img-preview-img');
      const modalImgPreviewCaption = document.getElementById('modal-img-preview-caption-text');
      const btnInsertImgConfirm = document.getElementById('btn-insert-img-confirm');

      let currentSelectedImgSrc = '';

      function updateModalImagePreview() {
        if (currentSelectedImgSrc) {
          modalImgPreviewImg.src = currentSelectedImgSrc;
          const caption = modalImgCaptionInput.value.trim();
          modalImgPreviewCaption.textContent = caption || '';
          modalImgPreviewCard.style.display = 'block';
        } else {
          modalImgPreviewCard.style.display = 'none';
        }
      }

      function openImageModal() {
        if (!imgModal) return;
        currentSelectedImgSrc = '';
        if (modalImgFileInput) modalImgFileInput.value = '';
        if (modalImgUrlInput) modalImgUrlInput.value = '';
        if (modalImgCaptionInput) modalImgCaptionInput.value = '';
        if (modalImgLinkInput) modalImgLinkInput.value = '';
        if (modalImgAltInput) modalImgAltInput.value = '';
        updateModalImagePreview();
        imgModal.style.display = 'flex';
      }

      function closeImageModal() {
        if (!imgModal) return;
        imgModal.style.display = 'none';
      }

      if (openImgStudioBtn) openImgStudioBtn.addEventListener('click', openImageModal);
      if (closeImgModalBtn) closeImgModalBtn.addEventListener('click', closeImageModal);
      if (cancelImgModalBtn) cancelImgModalBtn.addEventListener('click', closeImageModal);

      // Tab switching in Image Modal
      if (tabImgUpload && tabImgUrl) {
        tabImgUpload.addEventListener('click', () => {
          tabImgUpload.classList.add('active');
          tabImgUrl.classList.remove('active');
          if (sectionImgUpload) sectionImgUpload.style.display = 'block';
          if (sectionImgUrl) sectionImgUrl.style.display = 'none';
        });

        tabImgUrl.addEventListener('click', () => {
          tabImgUrl.classList.add('active');
          tabImgUpload.classList.remove('active');
          if (sectionImgUpload) sectionImgUpload.style.display = 'none';
          if (sectionImgUrl) sectionImgUrl.style.display = 'block';
        });
      }

      // Handle Modal File Upload
      if (modalImgFileInput) {
        modalImgFileInput.addEventListener('change', async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            try {
              showToast('Optimizing image... ⏳');
              currentSelectedImgSrc = await readAndOptimizeImage(file, 1200, 800, 0.85);
              if (!modalImgAltInput.value) {
                modalImgAltInput.value = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
              }
              updateModalImagePreview();
              showToast('Image ready! 🖼️');
            } catch (err) {
              showToast('Could not load image file.');
            }
          }
        });
      }

      // Drag & Drop for Image Modal
      if (modalImgDropzone) {
        ['dragenter', 'dragover'].forEach(eventName => {
          modalImgDropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            modalImgDropzone.classList.add('dragover');
          });
        });
        ['dragleave', 'drop'].forEach(eventName => {
          modalImgDropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            modalImgDropzone.classList.remove('dragover');
          });
        });
        modalImgDropzone.addEventListener('drop', async (e) => {
          const file = e.dataTransfer?.files?.[0];
          if (file) {
            try {
              showToast('Optimizing image... ⏳');
              currentSelectedImgSrc = await readAndOptimizeImage(file, 1200, 800, 0.85);
              if (!modalImgAltInput.value) {
                modalImgAltInput.value = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
              }
              updateModalImagePreview();
              showToast('Image ready! 🖼️');
            } catch (err) {
              showToast('Could not load image file.');
            }
          }
        });
      }

      // URL input changes
      if (modalImgUrlInput) {
        modalImgUrlInput.addEventListener('input', () => {
          currentSelectedImgSrc = modalImgUrlInput.value.trim();
          updateModalImagePreview();
        });
      }

      // Caption input changes
      if (modalImgCaptionInput) {
        modalImgCaptionInput.addEventListener('input', () => {
          updateModalImagePreview();
        });
      }

      // Visual Canvas & Code Textarea Elements
      const visualCanvas = document.getElementById('editor-visual-canvas');
      const codeTextarea = document.getElementById('editor-body');
      const tabVisual = document.getElementById('tab-visual-mode');
      const tabCode = document.getElementById('tab-code-mode');
      const tipEl = document.getElementById('visual-editor-tip');

      function syncVisualToCode() {
        if (visualCanvas && codeTextarea) {
          codeTextarea.value = visualCanvas.innerHTML;
        }
      }

      function syncCodeToVisual() {
        if (visualCanvas && codeTextarea) {
          visualCanvas.innerHTML = codeTextarea.value;
        }
      }

      if (visualCanvas) {
        ['input', 'keyup', 'paste', 'blur'].forEach(evt => {
          visualCanvas.addEventListener(evt, syncVisualToCode);
        });
      }

      if (codeTextarea) {
        codeTextarea.addEventListener('input', syncCodeToVisual);
      }

      // Helper to insert HTML directly into visual editor canvas or fallback to code
      function insertVisualBlock(html) {
        if (!visualCanvas) return;
        visualCanvas.focus();
        const sel = window.getSelection();
        let inserted = false;
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          if (visualCanvas.contains(range.commonAncestorContainer)) {
            range.deleteContents();
            const temp = document.createElement('div');
            temp.innerHTML = html.trim();
            const frag = document.createDocumentFragment();
            let node, lastNode;
            while ((node = temp.firstChild)) {
              lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
            if (lastNode) {
              const newRange = document.createRange();
              newRange.setStartAfter(lastNode);
              newRange.collapse(true);
              sel.removeAllRanges();
              sel.addRange(newRange);
            }
            inserted = true;
          }
        }
        if (!inserted) {
          const temp = document.createElement('div');
          temp.innerHTML = html.trim();
          while (temp.firstChild) {
            visualCanvas.appendChild(temp.firstChild);
          }
        }
        syncVisualToCode();
      }

      // Rich Formatting Actions (Bold, Italic, Link, H2, H3, Lists, Clear)
      document.querySelectorAll('.btn-rich-format').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const cmd = btn.getAttribute('data-cmd');
          const val = btn.getAttribute('data-val') || null;
          if (visualCanvas) visualCanvas.focus();
          if (cmd === 'createLink') {
            const url = prompt('Enter link URL (e.g. https://example.com):', 'https://');
            if (url && url.trim() && url !== 'https://') {
              document.execCommand('createLink', false, url.trim());
              visualCanvas.querySelectorAll('a:not(.beehiiv-link)').forEach(a => {
                a.classList.add('beehiiv-link');
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
              });
            }
          } else if (cmd === 'formatBlock') {
            document.execCommand('formatBlock', false, `<${val}>`);
          } else {
            document.execCommand(cmd, false, val);
          }
          syncVisualToCode();
        });
      });

      // Insert Visual Beehiiv Cards / Blocks
      document.querySelectorAll('.btn-insert-visual-block').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const blockType = e.currentTarget.getAttribute('data-block');
          const snippetHtml = SNIPPETS[blockType];
          if (!snippetHtml) return;
          insertVisualBlock(snippetHtml);
          showToast(`Inserted ${blockType.replace(/_/g, ' ').toUpperCase()} card! 📝`);
        });
      });

      // Handle Save Submission
      const form = document.getElementById('inline-article-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
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
          
          let body_html = '';
          if (tabVisual && tabVisual.classList.contains('active') && visualCanvas) {
            syncVisualToCode();
            body_html = visualCanvas.innerHTML.trim();
          } else if (codeTextarea) {
            body_html = codeTextarea.value.trim();
          }

          if (!title || !slug || !body_html) {
            showToast('Please fill in title, slug, and body content!');
            return;
          }

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
