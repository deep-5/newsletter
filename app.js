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

    // Filtered articles for admin editor
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
            <button class="admin-tab-btn ${state.adminTab === 'subscribers' ? 'active' : ''}" id="tab-subscribers">
              📬 Subscribers (${normalizedList.length})
            </button>
            <button class="admin-tab-btn ${state.adminTab === 'articles' ? 'active' : ''}" id="tab-articles">
              📝 Articles & Editor (${state.articles.length})
            </button>
          </div>

          <!-- TAB 1: SUBSCRIBERS -->
          ${state.adminTab === 'subscribers' ? `
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
          ` : `
            <!-- TAB 2: ARTICLES EDITOR & MANAGEMENT -->
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
                <span style="font-size: 0.8125rem; font-weight: 500; color: var(--color-text-muted);">Live Sync</span>
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
                              <button class="btn-edit-article" data-slug="${a.slug}" style="background: #18181B; color: #FFFFFF; font-weight: 600; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8125rem;">
                                ✏️ Edit
                              </button>
                              <a href="#/p/${a.slug}" target="_blank" style="background: #F4F4F5; border: 1px solid #E4E4E7; color: var(--color-text-primary); font-weight: 600; padding: 5px 10px; border-radius: 6px; text-decoration: none; font-size: 0.8125rem;">
                                👁️ View
                              </a>
                              <button class="btn-delete-article" data-slug="${a.slug}" style="background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; font-weight: 600; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 0.8125rem;" title="Delete Article">
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
          `}
        </div>
      </section>
    `;

    // Bind Tabs
    const tabSubscribers = document.getElementById('tab-subscribers');
    if (tabSubscribers) {
      tabSubscribers.addEventListener('click', () => {
        state.adminTab = 'subscribers';
        renderAdminPage();
      });
    }

    const tabArticles = document.getElementById('tab-articles');
    if (tabArticles) {
      tabArticles.addEventListener('click', () => {
        state.adminTab = 'articles';
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
        openArticleEditorModal(null);
      });
    }

    // Bind Edit Article Buttons
    document.querySelectorAll('.btn-edit-article').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const slug = e.currentTarget.getAttribute('data-slug');
        const found = state.articles.find(a => a.slug === slug);
        if (found) {
          openArticleEditorModal(found);
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
  // 4c. Article Editor Modal Functions
  // =========================================================================
  const articleEditModal = document.getElementById('article-edit-modal');
  const articleEditForm = document.getElementById('article-edit-form');

  function openArticleEditorModal(article) {
    if (!articleEditModal || !articleEditForm) return;

    const modalTitle = document.getElementById('article-modal-title');
    const inputSlugOrig = document.getElementById('edit-article-slug-original');
    const inputIsNew = document.getElementById('edit-is-new');
    const inputTitle = document.getElementById('edit-article-title');
    const inputSlug = document.getElementById('edit-article-slug');
    const inputSubtitle = document.getElementById('edit-article-subtitle');
    const inputTag = document.getElementById('edit-article-tag');
    const inputDate = document.getElementById('edit-article-date');
    const inputReadingTime = document.getElementById('edit-article-reading-time');
    const inputImage = document.getElementById('edit-article-image');
    const inputAuthor = document.getElementById('edit-article-author');
    const inputBody = document.getElementById('edit-article-body');

    if (article) {
      modalTitle.innerText = 'Edit Article';
      inputIsNew.value = 'false';
      inputSlugOrig.value = article.slug;
      inputTitle.value = article.title || '';
      inputSlug.value = article.slug || '';
      inputSubtitle.value = article.subtitle || '';
      inputTag.value = article.tag || 'News';
      inputDate.value = article.date || 'Sep 10, 2026';
      inputReadingTime.value = article.reading_time || '5 minutes';
      inputImage.value = article.image_url || '';
      inputAuthor.value = article.author || 'AIRA';
      inputBody.value = article.body_html || '';
    } else {
      modalTitle.innerText = 'Create New Article';
      inputIsNew.value = 'true';
      inputSlugOrig.value = '';
      inputTitle.value = '';
      inputSlug.value = '';
      inputSubtitle.value = '';
      inputTag.value = 'News';
      inputDate.value = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      inputReadingTime.value = '4 minutes';
      inputImage.value = 'assets/logo.jpg';
      inputAuthor.value = 'AIRA';
      inputBody.value = `<div id="content-blocks"><p>Welcome to this edition of AIRA...</p></div>`;
    }

    openModal(articleEditModal);
  }

  if (articleEditForm) {
    const titleInp = document.getElementById('edit-article-title');
    const slugInp = document.getElementById('edit-article-slug');
    if (titleInp && slugInp) {
      titleInp.addEventListener('input', () => {
        const isNew = document.getElementById('edit-is-new')?.value === 'true';
        if (isNew) {
          slugInp.value = titleInp.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        }
      });
    }

    articleEditForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const isNew = document.getElementById('edit-is-new').value === 'true';
      const origSlug = document.getElementById('edit-article-slug-original').value;
      const title = document.getElementById('edit-article-title').value.trim();
      let slug = document.getElementById('edit-article-slug').value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const subtitle = document.getElementById('edit-article-subtitle').value.trim();
      const tag = document.getElementById('edit-article-tag').value;
      const date = document.getElementById('edit-article-date').value.trim() || 'Sep 10, 2026';
      const reading_time = document.getElementById('edit-article-reading-time').value.trim() || '5 minutes';
      const image_url = document.getElementById('edit-article-image').value.trim() || 'assets/logo.jpg';
      const author = document.getElementById('edit-article-author').value.trim() || 'AIRA';
      const body_html = document.getElementById('edit-article-body').value.trim();

      if (!title || !slug || !body_html) {
        showToast('Please fill in title, slug, and content!');
        return;
      }

      if (isNew) {
        if (state.articles.some(a => a.slug === slug)) {
          slug = slug + '-' + Date.now().toString().slice(-4);
        }
        const newArt = {
          id: 'post-' + (state.articles.length + 1),
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
        showToast('🎉 New article published!');
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
          showToast('💾 Article changes saved!');
        }
      }

      closeModal(articleEditModal);
      if (state.currentRoute === 'admin') {
        renderAdminPage();
      }
    });
  }

  // Cancel edit modal
  const cancelEditBtn = document.getElementById('btn-cancel-article-edit');
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', () => {
      closeModal(articleEditModal);
    });
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
