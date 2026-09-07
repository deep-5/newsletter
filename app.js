/**
 * AIRA Newsletter - Application Controller & Router
 * Brand: AIRA
 * Connected with Supabase Database Backend
 * Full Library of 56 Articles + Dynamic Load More + Archive + Tags + Search
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure articles data is loaded
  const articles = typeof ARTICLES !== 'undefined' ? ARTICLES : [];
  
  // App state
  const state = {
    currentRoute: '',
    selectedTag: 'All',
    displayedCount: 9,
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
    const hash = window.location.hash.slice(1);
    if (!hash || hash === '/' || hash === '') return { name: 'home' };
    if (hash.startsWith('/p/')) {
      const slug = hash.replace('/p/', '');
      return { name: 'post', slug };
    }
    if (hash === '/archive') return { name: 'archive' };
    if (hash === '/tags') return { name: 'tags' };
    return { name: 'home' };
  }

  async function renderCurrentRoute() {
    const route = getRoute();
    state.currentRoute = route.name;
    
    // Update active navbar link
    document.querySelectorAll('.nav-link').forEach(link => {
      const target = link.getAttribute('data-nav');
      if (target === route.name) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'instant' });

    if (route.name === 'home') {
      renderHomePage();
    } else if (route.name === 'post') {
      await renderPostPage(route.slug);
    } else if (route.name === 'archive') {
      renderArchivePage();
    } else if (route.name === 'tags') {
      renderTagsPage();
    }
  }

  // =========================================================================
  // 1. Homepage View (With Dynamic Load More)
  // =========================================================================
  function renderHomePage() {
    const filteredArticles = state.selectedTag === 'All' 
      ? articles 
      : articles.filter(a => a.tag.toLowerCase() === state.selectedTag.toLowerCase());

    const visibleArticles = filteredArticles.slice(0, state.displayedCount);
    const hasMore = filteredArticles.length > state.displayedCount;

    appContainer.innerHTML = `
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container">
          <div class="hero-logo-box">
            <img src="assets/logo.jpg" alt="AIRA Logo" class="hero-logo-img" onerror="this.src='assets/logo.svg'" />
          </div>
          <h1 class="hero-title">AIRA</h1>
          <p class="hero-tagline">The one and only AI newsletter. Join us and get the best AI news, tools, and tutorials completely FREE!</p>
          
          <form class="subscribe-form-hero" id="hero-sub-form">
            <input type="email" class="subscribe-input" placeholder="Enter your email" required />
            <button type="submit" class="subscribe-btn-hero">Join free</button>
          </form>

          <div class="social-bar-hero">
            <a href="https://whatsapp.com/channel/0029VbC1KWlICVfsFtYhmZ3B" target="_blank" rel="noopener" class="social-icon-btn" title="WhatsApp">
              <svg viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.99.54 1.761.819 2.796.82 3.18 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.807-5.768-5.807zm0 10.455c-.933 0-1.62-.276-2.434-.76l-.174-.103-1.802.472.48-1.758-.113-.18c-.534-.848-.815-1.523-.815-2.36 0-2.618 2.13-4.748 4.748-4.748 2.617 0 4.747 2.13 4.747 4.748 0 2.618-2.13 4.748-4.747 4.748zm2.607-3.565c-.143-.072-.847-.418-.978-.466-.131-.048-.226-.072-.321.072-.095.143-.369.466-.452.561-.083.096-.167.108-.31.036-.143-.072-.603-.222-1.149-.707-.424-.378-.711-.845-.794-.988-.083-.143-.009-.22.063-.291.064-.064.143-.167.214-.25.072-.084.095-.144.143-.239.048-.096.024-.179-.012-.25-.036-.072-.321-.774-.44-1.06-.116-.28-.234-.241-.321-.246l-.274-.005c-.095 0-.25.036-.381.179-.131.143-.5 488-.5 1.19 0 .702.512 1.38 1.583 2.809 1.488 1.987 2.106 2.059 2.487 2.059.512 0 .976-.321 1.119-.774.143-.452.143-.845.1-.929-.048-.083-.143-.131-.286-.202zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.981-1.306A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.636 0-3.17-.487-4.457-1.326l-.32-.209-2.955.775.789-2.88-.228-.363A8.136 8.136 0 0 1 3.833 12c0-4.503 3.664-8.167 8.167-8.167 4.503 0 8.167 3.664 8.167 8.167 0 4.503-3.664 8.167-8.167 8.167z"/></svg>
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
              <button class="filter-pill ${state.selectedTag === 'All' ? 'active' : ''}" data-tag="All">All (${articles.length})</button>
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
    const article = articles.find(a => a.slug === slug);
    if (!article) {
      appContainer.innerHTML = `
        <div class="article-container" style="padding: 80px 20px; text-align: center;">
          <h2 style="font-family: var(--font-header); font-size: 2rem; margin-bottom: 16px;">Article Not Found</h2>
          <p style="color: var(--color-text-secondary); margin-bottom: 24px;">The newsletter edition you are looking for does not exist.</p>
          <a href="#/" class="btn-subscribe-nav">Return to Homepage</a>
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

    const recommendedArticles = articles.filter(a => a.slug !== article.slug).slice(0, 3);

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

          <!-- Feedback Rating Box (Exact Requested Design) -->
          <div class="edition-feedback-card">
            <h3 class="feedback-card-title">What did you think of today's edition?</h3>
            <div class="feedback-card-buttons">
              <button class="feedback-pill-btn ${postPoll === 'loved' ? 'active' : ''}" data-vote="loved">
                <span>⭐⭐⭐⭐⭐</span> <span>Loved it</span>
              </button>
              <button class="feedback-pill-btn ${postPoll === 'good' ? 'active' : ''}" data-vote="good">
                <span>⭐⭐⭐</span> <span>Good, not great</span>
              </button>
              <button class="feedback-pill-btn ${postPoll === 'needs_work' ? 'active' : ''}" data-vote="needs_work">
                <span>⭐</span> <span>Needs improvement</span>
              </button>
            </div>
          </div>

          <!-- Inline Subscribe Card (Premium Clean Modern Card) -->
          <div class="article-subscribe-card">
            <div class="article-sub-badge">
              <img src="assets/logo.jpg" alt="AIRA" class="article-sub-logo" onerror="this.src='assets/logo.svg'" />
            </div>
            <h3 class="article-sub-title">Stay Ahead in Artificial Intelligence</h3>
            <p class="article-sub-desc">Join 50,000+ engineers, founders, and leaders getting our free weekly breakdowns of AI models, tools, and breakthroughs.</p>
            
            <form class="article-sub-form-clean" id="article-sub-form">
              <div class="sub-input-wrap">
                <input type="email" class="sub-clean-input" placeholder="Enter your email..." required />
                <button type="submit" class="sub-clean-btn">Subscribe Free</button>
              </div>
              <span class="sub-guarantee-text">⚡ Free weekly edition • No spam • Unsubscribe anytime</span>
            </form>
          </div>

          <!-- Discussion Section (Modern Substack/Beehiiv Style) -->
          <section class="comments-section">
            <div class="comments-header-row">
              <h3 class="comments-header">Discussion <span class="comments-count-pill">${postComments.length}</span></h3>
            </div>
            
            <form class="comment-composer-card" id="comment-form">
              <div class="comment-composer-top">
                <div class="comment-user-avatar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <input type="text" id="comment-name-input" class="comment-name-field" placeholder="Your name (optional)" />
              </div>
              <textarea class="comment-textarea" placeholder="Write a thoughtful comment..." rows="3" required></textarea>
              <div class="comment-composer-footer">
                <span class="comment-hint-text">Be respectful and constructive</span>
                <button type="submit" class="comment-submit-btn">Post Comment</button>
              </div>
            </form>

            <div class="comments-list" id="comments-list">
              ${postComments.length === 0 ? `
                <div class="comments-empty-state">
                  <div class="empty-icon-wrap">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  </div>
                  <p class="empty-title">No comments yet</p>
                  <p class="empty-subtitle">Be the first to share your thoughts on this edition!</p>
                </div>
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

          <!-- Recommended Reading (Exact Image 2 Design) -->
          <section class="recommended-section">
            <h3 class="recommended-title">Keep Reading</h3>
            
            <div class="keep-reading-list">
              ${recommendedArticles.map(rec => `
                <a href="#/p/${rec.slug}" class="keep-reading-item">
                  <div class="kr-thumb-wrap">
                    <img src="${rec.image_url}" alt="${rec.title}" class="kr-thumb-img" loading="lazy" />
                    <span class="kr-tag-badge">${rec.tag || 'News'}</span>
                  </div>
                  <div class="kr-content">
                    <div class="kr-meta-top">${rec.date} • ${rec.reading_time}</div>
                    <h4 class="kr-title">${rec.title}</h4>
                    <p class="kr-subtitle">${rec.subtitle}</p>
                    <div class="kr-brand-row">
                      <span class="kr-bolt-icon">⚡</span>
                      <span class="kr-brand-name">AIRA</span>
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

    // Bind Feedback Rating Buttons
    document.querySelectorAll('.feedback-pill-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const vote = e.currentTarget.getAttribute('data-vote');
        state.pollVotes[article.slug] = vote;
        localStorage.setItem('aira_polls', JSON.stringify(state.pollVotes));
        if (window.DatabaseService) {
          await window.DatabaseService.recordPollVote(article.slug, vote);
        }
        showToast('Thanks for your feedback! 🌟');
        await renderPostPage(article.slug);
      });
    });

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
          <p class="page-description">Complete chronological history of all ${articles.length} AIRA newsletter editions and guides.</p>

          <div class="timeline-list">
            ${articles.map(article => `
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
  // 4. Tags View
  // =========================================================================
  function renderTagsPage() {
    const newsCount = articles.filter(a => a.tag === 'News').length;
    const promptsCount = articles.filter(a => a.tag === 'Prompts').length;

    appContainer.innerHTML = `
      <section class="tags-page-view">
        <div class="article-container">
          <h1 class="page-title">Tags</h1>
          <p class="page-description">Explore AIRA newsletter topics and coverage.</p>

          <div class="timeline-list">
            <div class="timeline-item" onclick="window.location.hash='#/'">
              <div class="timeline-content">
                <h4>News & Research</h4>
                <p>The latest breakthrough models, AI agents, enterprise updates, and research papers.</p>
              </div>
              <div class="timeline-meta">
                <span class="card-tag-badge" style="position: static;">${newsCount} posts</span>
              </div>
            </div>

            <div class="timeline-item" onclick="window.location.hash='#/'">
              <div class="timeline-content">
                <h4>Prompts & Workflows</h4>
                <p>Actionable prompt engineering patterns, cheat codes, automation workflows, and productivity guides.</p>
              </div>
              <div class="timeline-meta">
                <span class="card-tag-badge" style="position: static;">${promptsCount} posts</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================================
  // 5. Subscription Handler (Connected to Supabase)
  // =========================================================================
  async function handleSubscribeSubmit(e) {
    e.preventDefault();
    const input = e.target.querySelector('input[type="email"]');
    const email = input.value.trim();
    if (!email) return;

    if (window.DatabaseService) {
      await window.DatabaseService.subscribe(email);
    } else {
      if (!state.subscribers.includes(email)) {
        state.subscribers.push(email);
        localStorage.setItem('aira_subscribers', JSON.stringify(state.subscribers));
      }
    }

    input.value = '';
    showToast('🎉 Welcome to AIRA! Check your inbox for updates.');
    closeModal(subscribeModal);
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
  // 6. Search & Modal Handlers (Fast index over all 56 articles)
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
      ? articles.slice(0, 6) 
      : articles.filter(a => 
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
    }
  });

  // Listen to hash changes
  window.addEventListener('hashchange', renderCurrentRoute);

  // Initial render
  renderCurrentRoute();
});
