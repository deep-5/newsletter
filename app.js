/**
 * AIRA Newsletter - Application Controller & Router
 * Brand: AIRA
 * Connected with Supabase Database Backend
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure articles data is loaded
  const articles = typeof ARTICLES !== 'undefined' ? ARTICLES : [];
  
  // App state
  const state = {
    currentRoute: '',
    selectedTag: 'All',
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

  function navigate(path) {
    window.location.hash = path;
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
  // 1. Homepage View
  // =========================================================================
  function renderHomePage() {
    const filteredArticles = state.selectedTag === 'All' 
      ? articles 
      : articles.filter(a => a.tag.toLowerCase() === state.selectedTag.toLowerCase());

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
            <a href="https://instagram.com" target="_blank" rel="noopener" class="social-icon-btn" title="Instagram">
              <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://threads.net" target="_blank" rel="noopener" class="social-icon-btn" title="Threads">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/></svg>
            </a>
            <a href="https://x.com" target="_blank" rel="noopener" class="social-icon-btn" title="X (Twitter)">
              <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener" class="social-icon-btn" title="Discord">
              <svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener" class="social-icon-btn" title="LinkedIn">
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
              <button class="filter-pill ${state.selectedTag === 'All' ? 'active' : ''}" data-tag="All">All</button>
              <button class="filter-pill ${state.selectedTag === 'News' ? 'active' : ''}" data-tag="News">News</button>
            </div>
          </div>

          <div class="articles-grid">
            ${filteredArticles.map(article => `
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
        renderHomePage();
      });
    });
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

    const recommendedArticles = articles.filter(a => a.slug !== article.slug).slice(0, 2);

    appContainer.innerHTML = `
      <article class="article-page-view">
        <div class="article-container">
          <!-- Breadcrumb -->
          <div class="breadcrumb-nav">
            <a href="#/" class="breadcrumb-link">Home</a>
            <span>/</span>
            <a href="#/" class="breadcrumb-link">Posts</a>
            <span>/</span>
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

          <!-- Rating Poll Widget -->
          <div class="poll-box">
            <h3 class="poll-heading">What did you think of today's edition?</h3>
            <div class="poll-options">
              <button class="poll-btn ${postPoll === 'loved' ? 'selected' : ''}" data-vote="loved">⭐⭐⭐⭐⭐ Loved it</button>
              <button class="poll-btn ${postPoll === 'good' ? 'selected' : ''}" data-vote="good">⭐⭐⭐ Good, not great</button>
              <button class="poll-btn ${postPoll === 'needs_work' ? 'selected' : ''}" data-vote="needs_work">⭐ Needs improvement</button>
            </div>
          </div>

          <!-- Inline Subscribe Card -->
          <div class="article-subscribe-card">
            <img src="assets/logo.jpg" alt="AIRA" class="article-sub-logo" onerror="this.src='assets/logo.svg'" />
            <h3 class="article-sub-title">Stay Ahead in AI with AIRA</h3>
            <p class="article-sub-desc">Get the latest breakthroughs, model benchmarks, tools, and tutorials delivered straight to your inbox.</p>
            <form class="subscribe-form-hero" id="article-sub-form">
              <input type="email" class="subscribe-input" placeholder="Your email address" required />
              <button type="submit" class="subscribe-btn-hero">Subscribe</button>
            </form>
          </div>

          <!-- Discussion Section -->
          <section class="comments-section">
            <h3 class="comments-header">Discussion (${postComments.length})</h3>
            <form class="comment-input-box" id="comment-form">
              <input type="text" id="comment-name-input" placeholder="Your Name (Optional)" style="padding: 10px 14px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: 0.95rem;" />
              <textarea class="comment-textarea" placeholder="Share your thoughts on this edition..." required></textarea>
              <div class="comment-submit-row">
                <button type="submit" class="comment-submit-btn">Post Comment</button>
              </div>
            </form>

            <div class="comments-list" id="comments-list">
              ${postComments.length === 0 ? '<p style="color: var(--color-text-muted); font-size: 0.9375rem;">No comments yet. Start the conversation!</p>' : ''}
              ${postComments.map(c => `
                <div class="comment-item">
                  <div class="comment-author-row">
                    <span class="comment-author-name">${c.author}</span>
                    <span class="comment-date">${c.date}</span>
                  </div>
                  <p class="comment-text">${c.text}</p>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- Recommended Reading -->
          <section class="recommended-section">
            <div class="recommended-header">
              <h3 class="recommended-title">Keep Reading</h3>
              <a href="#/" class="btn-view-more">View all articles →</a>
            </div>
            <div class="articles-grid" style="grid-template-columns: repeat(2, 1fr);">
              ${recommendedArticles.map(rec => `
                <a href="#/p/${rec.slug}" class="article-card">
                  <div class="card-image-wrap">
                    <img src="${rec.image_url}" alt="${rec.title}" class="card-thumbnail" loading="lazy" />
                  </div>
                  <div class="card-body">
                    <h3 class="card-title">${rec.title}</h3>
                    <p class="card-subtitle">${rec.subtitle}</p>
                    <div class="card-footer">
                      <span class="card-meta-date">${rec.date} • ${rec.reading_time}</span>
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

    // Bind Poll Options
    document.querySelectorAll('.poll-btn').forEach(btn => {
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
  // 3. Archive View
  // =========================================================================
  function renderArchivePage() {
    appContainer.innerHTML = `
      <section class="archive-page-view">
        <div class="article-container">
          <h1 class="page-title">Archive</h1>
          <p class="page-description">Complete chronological history of all AIRA newsletter editions.</p>

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
                <span class="card-tag-badge" style="position: static;">${articles.length} posts</span>
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
  // 6. Search & Modal Handlers
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
      ? articles.slice(0, 4) 
      : articles.filter(a => 
          a.title.toLowerCase().includes(q) || 
          a.subtitle.toLowerCase().includes(q)
        );

    if (matches.length === 0) {
      searchResults.innerHTML = '<p style="padding: 16px; color: var(--color-text-muted); text-align: center;">No articles found matching "' + query + '"</p>';
      return;
    }

    searchResults.innerHTML = matches.map(m => `
      <div class="search-result-item" onclick="window.location.hash='#/p/${m.slug}'; document.getElementById('search-modal').classList.remove('active'); document.body.style.overflow='';">
        <h5>${m.title}</h5>
        <p>${m.subtitle}</p>
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
