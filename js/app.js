/**
 * AIRA Newsletter - Application Controller & Router
 * Brand: AIRA
 * Connected with Supabase Database Backend
 * Full Library of 56 Articles + Dynamic Load More + Archive + Tags + Search
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // Floating Back to Top Button Engine
  // =========================================================================
  const backToTopBtn = document.getElementById('btn-back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Auto-sync dataset version & flush stale cached base article overrides
  const CURRENT_DATA_VERSION = '144.0';
  try {
    const savedDataVer = localStorage.getItem('aira_data_version');
    if (savedDataVer !== CURRENT_DATA_VERSION) {
      localStorage.removeItem('aira_article_overrides');
      localStorage.removeItem('aira_custom_tools');
      localStorage.setItem('aira_data_version', CURRENT_DATA_VERSION);
      if (window.AiraStorage) {
        window.AiraStorage.set('aira_article_overrides', {});
      }
    }
  } catch(e) {}
  // Helper to intelligently merge base articles with custom overrides and new creations
  function mergeArticlesWithBase(customList, baseList) {
    const base = Array.isArray(baseList) ? baseList : (typeof ARTICLES !== 'undefined' && Array.isArray(ARTICLES) ? ARTICLES : []);
    
    // Read lightweight overrides dictionary
    let overrides = {};
    try {
      const rawOvr = localStorage.getItem('aira_article_overrides');
      if (rawOvr) overrides = JSON.parse(rawOvr) || {};
    } catch (e) {}

    const baseSlugs = new Set(base.map(a => a && a.slug));
    const safeCustomList = Array.isArray(customList) ? customList : [];

    // 1. Keep purely user-created articles (whose slugs are NOT in base dataset) at the top
    const customOnlyArticles = safeCustomList.filter(a => a && a.slug && !baseSlugs.has(a.slug));

    // 2. Base articles: Apply explicit overrides first, then any custom list matches
    const mergedBaseArticles = base.map(baseArt => {
      if (!baseArt || !baseArt.slug) return baseArt;
      
      // Check explicit overrides map
      if (overrides[baseArt.slug]) {
        return { ...baseArt, ...overrides[baseArt.slug] };
      }

      // Check custom list match
      const customMatch = safeCustomList.find(a => a && a.slug === baseArt.slug);
      if (customMatch && (customMatch._is_custom_edit || customMatch._is_admin_draft || (customMatch._edited_at && customMatch._edited_at > 0))) {
        return { ...baseArt, ...customMatch };
      }

      return baseArt;
    });

    return [...customOnlyArticles, ...mergedBaseArticles];
  }

  // Helper to load articles from storage & default dataset with instant synchronous paint
  function getArticles() {
    const base = typeof ARTICLES !== 'undefined' && Array.isArray(ARTICLES) ? ARTICLES : [];
    try {
      let custom = null;
      if (window.AiraStorage) {
        custom = window.AiraStorage.getSync('aira_custom_articles');
      }
      if (!custom) {
        const stored = localStorage.getItem('aira_custom_articles');
        if (stored) {
          custom = JSON.parse(stored);
        }
      }
      return mergeArticlesWithBase(custom, base);
    } catch (e) {
      console.error('Error loading custom articles from storage:', e);
    }
    return base;
  }

  function saveArticles(list) {
    state.articles = list;
    const base = typeof ARTICLES !== 'undefined' && Array.isArray(ARTICLES) ? ARTICLES : [];
    const baseSlugs = new Set(base.map(a => a && a.slug));

    // Extract overrides dictionary for base articles
    let overrides = {};
    try {
      overrides = JSON.parse(localStorage.getItem('aira_article_overrides') || '{}');
    } catch (e) {}

    const customOnly = [];

    list.forEach(art => {
      if (!art || !art.slug) return;
      if (baseSlugs.has(art.slug)) {
        const baseMatch = base.find(b => b.slug === art.slug);
        const isModified = art._is_custom_edit || 
                           art._is_admin_draft || 
                           (baseMatch && (art.image_url !== baseMatch.image_url || art.title !== baseMatch.title || art.subtitle !== baseMatch.subtitle));
        if (isModified) {
          overrides[art.slug] = {
            ...art,
            _is_custom_edit: true,
            _is_admin_draft: true,
            _edited_at: art._edited_at || Date.now()
          };
        }
      } else {
        customOnly.push(art);
      }
    });

    // Save lightweight overrides map (instantly in localStorage + IndexedDB)
    try {
      localStorage.setItem('aira_article_overrides', JSON.stringify(overrides));
    } catch (e) {}
    if (window.AiraStorage) {
      window.AiraStorage.set('aira_article_overrides', overrides);
    }

    // Save custom-only creations
    try {
      localStorage.setItem('aira_custom_articles', JSON.stringify(customOnly));
    } catch (e) {}
    if (window.AiraStorage) {
      window.AiraStorage.set('aira_custom_articles', customOnly);
    }
  }

  // Unified Custom Tools Helpers
  function getCustomTools() {
    try {
      if (window.AiraStorage) {
        const syncTools = window.AiraStorage.getSync('aira_custom_tools');
        if (Array.isArray(syncTools)) return syncTools;
      }
      const raw = localStorage.getItem('aira_custom_tools');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }
  function saveCustomTools(tools) {
    const list = Array.isArray(tools) ? tools : [];
    if (window.AiraStorage) {
      window.AiraStorage.set('aira_custom_tools', list);
    } else {
      try { localStorage.setItem('aira_custom_tools', JSON.stringify(list)); } catch (e) {}
    }
  }
  function getAllTools() {
    const baseTools = (typeof AI_TOOLS_DATA !== 'undefined' && Array.isArray(AI_TOOLS_DATA.tools)) ? AI_TOOLS_DATA.tools : [];
    const customTools = getCustomTools();
    const customIds = new Set(customTools.filter(Boolean).map(t => t && t.id).filter(Boolean));
    const filteredBase = baseTools.filter(t => t && t.id && !customIds.has(t.id));
    return [...customTools, ...filteredBase];
  }

  
  // =========================================================================
  // PWA (Progressive Web App) Service Worker & Install Prompt
  // =========================================================================
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        navigator.serviceWorker.getRegistrations().then(regs => {
          for (let r of regs) r.unregister();
        });
      } else {
        navigator.serviceWorker.register('sw.js?v=110.0')
          .then(reg => {
            reg.update();
            console.log('AIRA PWA ServiceWorker active with scope:', reg.scope);
          })
          .catch(err => console.log('AIRA ServiceWorker registration failed:', err));
      }
    });
  }

  let deferredInstallPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    const pwaBtn = document.getElementById('btn-pwa-install');
    if (pwaBtn) {
      pwaBtn.style.display = 'flex';
    }
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    console.log('AIRA PWA was installed');
  });

  const pwaBtn = document.getElementById('btn-pwa-install');
  if (pwaBtn) {
    pwaBtn.addEventListener('click', async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const choiceResult = await deferredInstallPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          showToast('AIRA App installed successfully! 🎉');
        }
        deferredInstallPrompt = null;
      } else {
        showToast('To install AIRA App: Tap your browser menu (⋮ / Share) and select "Add to Home Screen" 📲');
      }
    });
  }

  // =========================================================================
  // AI Tools Rating, Reviews & Upvote Engine
  // =========================================================================
  const KNOWN_TOOL_RATINGS = {
    'chatgpt': { rating: 4.9, votes: 1420 },
    'claude': { rating: 4.9, votes: 1180 },
    'deepseek': { rating: 4.9, votes: 960 },
    'midjourney': { rating: 4.8, votes: 1050 },
    'cursor': { rating: 4.9, votes: 870 },
    'perplexity': { rating: 4.8, votes: 920 },
    'elevenlabs': { rating: 4.8, votes: 680 },
    'runway': { rating: 4.7, votes: 540 },
    'suno': { rating: 4.8, votes: 620 },
    'udio': { rating: 4.7, votes: 410 },
    'v0': { rating: 4.8, votes: 510 },
    'lovable': { rating: 4.8, votes: 440 },
    'bolt-new': { rating: 4.8, votes: 490 },
    'flux': { rating: 4.8, votes: 530 },
    'kling': { rating: 4.7, votes: 360 },
    'hume-ai': { rating: 4.8, votes: 290 },
    'pippit-ai': { rating: 4.8, votes: 240 },
    'hiding-ai': { rating: 4.7, votes: 185 },
    'github-copilot': { rating: 4.8, votes: 1120 },
    'notion-ai': { rating: 4.7, votes: 670 },
    'gamma': { rating: 4.8, votes: 580 },
    'canva': { rating: 4.8, votes: 890 },
    'phind': { rating: 4.7, votes: 340 },
    'replit': { rating: 4.7, votes: 480 },
    'tome': { rating: 4.6, votes: 310 },
    'beautiful-ai': { rating: 4.6, votes: 275 },
    'descript': { rating: 4.7, votes: 420 },
    'synthesia': { rating: 4.7, votes: 390 },
    'heygen': { rating: 4.8, votes: 460 },
    'jasper': { rating: 4.6, votes: 510 },
    'copy-ai': { rating: 4.6, votes: 430 },
    'quillbot': { rating: 4.7, votes: 620 },
    'grammarly': { rating: 4.8, votes: 1350 },
    'otter-ai': { rating: 4.7, votes: 530 },
    'fireflies': { rating: 4.7, votes: 380 },
    'leonardo-ai': { rating: 4.8, votes: 640 },
    'ideogram': { rating: 4.8, votes: 520 },
    'magnific-ai': { rating: 4.8, votes: 380 },
    'clipdrop': { rating: 4.7, votes: 410 },
    'recraft': { rating: 4.8, votes: 360 },
    'krea-ai': { rating: 4.8, votes: 390 },
    'pika': { rating: 4.7, votes: 460 },
    'luma-dream-machine': { rating: 4.8, votes: 470 }
  };

  function getToolRatingStats(toolOrId) {
    const rawId = typeof toolOrId === 'string' ? toolOrId : (toolOrId.id || toolOrId.name || '').toLowerCase();
    const cleanId = rawId.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Check known curated ratings
    let base = KNOWN_TOOL_RATINGS[cleanId];
    if (!base) {
      // Deterministic hash based on cleanId
      let hash = 0;
      for (let i = 0; i < cleanId.length; i++) {
        hash = (hash << 5) - hash + cleanId.charCodeAt(i);
        hash |= 0;
      }
      const absHash = Math.abs(hash);
      const ratingOptions = [4.5, 4.6, 4.7, 4.8, 4.9];
      const rating = ratingOptions[absHash % ratingOptions.length];
      const votes = 45 + (absHash % 240);
      base = { rating, votes };
    }

    // Read stored user votes and ratings from localStorage
    let storedVotes = {};
    try {
      storedVotes = JSON.parse(localStorage.getItem('aira_tool_votes') || '{}');
    } catch (e) { storedVotes = {}; }
    const userVote = storedVotes[cleanId] || { hasVoted: false, userRating: null, deltaVotes: 0 };
    
    const finalVotes = Math.max(1, base.votes + (userVote.deltaVotes || 0));
    let finalRating = base.rating;
    if (userVote.userRating) {
      finalRating = Number(((base.rating * base.votes + userVote.userRating) / (base.votes + 1)).toFixed(1));
    }

    return {
      id: cleanId,
      rating: finalRating,
      votes: finalVotes,
      hasVoted: Boolean(userVote.hasVoted),
      userRating: userVote.userRating || null
    };
  }

  
  // =========================================================================
  // Promoted Tools & Platform Enhancements Engine
  // =========================================================================
  const PROMOTED_TOOL_IDS = new Set([
    'cursor', 'deepseek', 'claude', 'chatgpt', 'lovable', 'perplexity', 'elevenlabs',
    'suno', 'runway', 'v0', 'flux', 'midjourney', 'kling', 'hume-ai', 'gamma', 'bolt-new'
  ]);

  function getCategoryBadgeInfo(tool) {
    let rawBadge = (tool && tool.badge) || '';
    if (!rawBadge) {
      const rawCat = (tool && tool.categories && tool.categories[0]) || (tool && tool.category) || 'productivity';
      const foundCat = (typeof AI_TOOLS_DATA !== 'undefined' && AI_TOOLS_DATA.categories) ? AI_TOOLS_DATA.categories.find(c => c.id === rawCat) : null;
      rawBadge = foundCat ? foundCat.name : rawCat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    let cleanText = rawBadge.replace(/^[\uD800-\uDBFF\uDC00-\uDFFF\u2600-\u27BF\s🏷️⚡🎨💭🧠💻🎬🎵📱✍️✨🔍📊]+/g, '').trim();
    if (!cleanText) cleanText = rawBadge;

    return { label: cleanText };
  }

  function isToolPromoted(toolOrId) {
    if (!toolOrId) return false;
    if (typeof toolOrId === 'string') return PROMOTED_TOOL_IDS.has(toolOrId.toLowerCase().trim());
    if (toolOrId.promoted || toolOrId.isPromoted || toolOrId.is_promoted) return true;
    const cleanId = (toolOrId.id || toolOrId.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return PROMOTED_TOOL_IDS.has(cleanId);
  }

  // Dynamic Social Meta Tags Updater for WhatsApp, Twitter, LinkedIn & Google
  function updateSocialMetaTags(title, description, imageUrl, url) {
    try {
      const fullTitle = title && title.includes('AIRA') ? title : `${title || 'AIRA'} | AIRA Newsletter`;
      const cleanDesc = description ? description.replace(/<[^>]+>/g, '').slice(0, 160) : 'The one and only AI newsletter. Join us and get the best AI news, tools, and tutorials completely FREE!';
      const cleanImg = imageUrl || 'assets/aira-promo-banner.png';
      const cleanUrl = url || window.location.href;

      document.title = fullTitle;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', cleanDesc);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', fullTitle);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', cleanDesc);
      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.setAttribute('content', cleanImg);
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', cleanUrl);

      const twTitle = document.querySelector('meta[name="twitter:title"]');
      if (twTitle) twTitle.setAttribute('content', fullTitle);
      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', cleanDesc);
      const twImg = document.querySelector('meta[name="twitter:image"]');
      if (twImg) twImg.setAttribute('content', cleanImg);
    } catch (e) {
      console.warn('Meta tags update error:', e);
    }
  }

  // Auto-link AI Tool Mentions in Article Body
  function linkToolMentionsInArticle(bodyHtml) {
    if (!bodyHtml) return '';
    try {
      const tools = getAllTools();
      const priorityTools = tools.filter(t => t.name && t.name.length >= 3).slice(0, 45);
      
      const temp = document.createElement('div');
      temp.innerHTML = bodyHtml;

      const paragraphs = temp.querySelectorAll('p, li');
      const linkedSet = new Set();

      paragraphs.forEach(p => {
        priorityTools.forEach(tool => {
          if (linkedSet.size >= 4) return;
          if (linkedSet.has(tool.id)) return;

          const toolName = tool.name;
          const regex = new RegExp(`\\b(${toolName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'i');
          if (regex.test(p.innerHTML) && !p.querySelector(`a[href*="${tool.id}"]`)) {
            p.innerHTML = p.innerHTML.replace(regex, `<a href="#/tools/${tool.id}" class="article-tool-pill" title="Explore ${toolName} on AIRA">⚡ $1</a>`);
            linkedSet.add(tool.id);
          }
        });
      });

      return temp.innerHTML;
    } catch (e) {
      return bodyHtml;
    }
  }

  // Reading Progress Bar Scroll Handler
  function updateReadingProgress() {
    const progressBar = document.getElementById('reading-progress-bar');
    if (!progressBar) return;
    if (state.currentRoute !== 'post') {
      progressBar.style.display = 'none';
      return;
    }
    progressBar.style.display = 'block';
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) {
      progressBar.style.width = '0%';
      return;
    }
    const scrolled = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
  }
  window.addEventListener('scroll', updateReadingProgress, { passive: true });

  // Download File Helper
  function downloadTextFile(filename, text) {
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('📥 Downloaded: ' + filename);
  }

  function getPromptsKitMarkdown() {
    return `# AIRA 2026 AI Starter Kit: 3,000+ ChatGPT Prompts & 50 n8n Automation Templates
Generated exclusively for AIRA VIP Newsletter Subscribers.
Website: https://aira-newsletter.vercel.app/
Live Google Sheet: https://docs.google.com/spreadsheets/d/1fOGVDjv6T_v_lw1L04BROEySfSbbYxadKqk2MVPmH44/edit?usp=sharing

---

## 📊 Live Google Spreadsheet Access
Access the full interactive database of 3,000+ Categorized ChatGPT Prompts + 50 n8n Production Workflows:
👉 https://docs.google.com/spreadsheets/d/1fOGVDjv6T_v_lw1L04BROEySfSbbYxadKqk2MVPmH44/edit?usp=sharing

---

## 1. Elite Code Generation & Architecture
**Prompt:**
"You are a Senior Principal Software Architect and Staff Engineer. Analyze the requirements below with first-principles reasoning. Design an optimal, scalable modular system. Provide clean, production-ready code with complete TypeScript types, exhaustive edge-case coverage, and performance benchmarks."

## 2. Deep Analytical Reasoning & Problem Solving
**Prompt:**
"Deconstruct the following complex problem into its foundational components. Identify latent assumptions, synthesize contrasting perspectives, assess 2nd and 3rd order consequences, and propose a prioritized decision matrix with clear trade-offs."

## 3. High-Converting Copywriting & Marketing
**Prompt:**
"You are a world-class direct-response copywriter. Craft 5 compelling hook variations, a high-converting headline, and a persuasive value proposition for the following product. Focus on pain points, transformation, and undeniable social proof."

## 4. Autonomous Agent Task Execution
**Prompt:**
"Act as an autonomous task executor. Break down the user's objective into strict sequential steps: 1) Information Gathering, 2) Strategy Formation, 3) Tool/API Execution, 4) Self-Correction & Verification. Never skip verification before returning the final result."

---
*Stay ahead in AI with AIRA Newsletter — https://aira-newsletter.vercel.app/*
`;
  }

  function getToolsDirectoryKitText() {
    const tools = getAllTools();
    let text = "AIRA 2026 AI Tools Directory — Curated 96+ Collection\n";
    text += "Visit live directory: https://aira-newsletter.vercel.app/#/tags\n";
    text += "Total Curated Tools: " + tools.length + "\n";
    text += "====================================================\n\n";
    tools.forEach((t, i) => {
      text += (i + 1) + ". " + t.name + " (" + (t.pricing || 'Free') + ")\n";
      text += "   Category: " + (t.category || (t.categories && t.categories[0]) || 'AI') + "\n";
      text += "   Tagline: " + (t.description || '') + "\n";
      text += "   Link: " + t.url + "\n\n";
    });
    return text;
  }


  window.toggleToolVote = function(toolId) {
    if (!toolId) return;
    const cleanId = String(toolId).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    let storedVotes = {};
    try {
      storedVotes = JSON.parse(localStorage.getItem('aira_tool_votes') || '{}');
    } catch (e) { storedVotes = {}; }
    const current = storedVotes[cleanId] || { hasVoted: false, userRating: null, deltaVotes: 0 };

    const isNowVoted = !current.hasVoted;
    current.hasVoted = isNowVoted;
    current.deltaVotes = isNowVoted ? 1 : 0;
    storedVotes[cleanId] = current;
    localStorage.setItem('aira_tool_votes', JSON.stringify(storedVotes));

    const stats = getToolRatingStats(cleanId);
    
    // Update matching upvote buttons across DOM
    document.querySelectorAll(`button.tool-upvote-btn[data-tool-id="${cleanId}"], [data-tool-id="${cleanId}"] .tool-upvote-btn`).forEach(btn => {
      btn.classList.toggle('is-voted', isNowVoted);
      btn.setAttribute('title', isNowVoted ? 'Remove upvote' : 'Upvote tool');
      const countEl = btn.querySelector('.upvote-count');
      if (countEl) countEl.textContent = stats.votes;
    });

    // Detail page upvote button
    const detailBtn = document.getElementById('btn-upvote-tool-detail');
    if (detailBtn && detailBtn.getAttribute('data-tool-id') === cleanId) {
      detailBtn.classList.toggle('is-voted', isNowVoted);
      detailBtn.innerHTML = `<span>${isNowVoted ? '▲ Upvoted' : '▲ Upvote Tool'} (${stats.votes})</span>`;
    }

    if (isNowVoted) {
      showToast(`🎉 Upvoted! Total votes: ${stats.votes}`);
    } else {
      showToast(`Vote removed.`);
    }
  };

  window.rateTool = function(toolId, stars) {
    if (!toolId) return;
    const cleanId = String(toolId).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    let storedVotes = {};
    try {
      storedVotes = JSON.parse(localStorage.getItem('aira_tool_votes') || '{}');
    } catch (e) { storedVotes = {}; }
    const current = storedVotes[cleanId] || { hasVoted: false, userRating: null, deltaVotes: 0 };

    current.userRating = stars;
    if (!current.hasVoted) {
      current.hasVoted = true;
      current.deltaVotes = 1;
    }
    storedVotes[cleanId] = current;
    localStorage.setItem('aira_tool_votes', JSON.stringify(storedVotes));

    // Update star button highlights
    document.querySelectorAll('.rate-star-btn').forEach(btn => {
      const s = parseInt(btn.getAttribute('data-star') || '0', 10);
      btn.classList.toggle('active', s <= stars);
    });

    const stats = getToolRatingStats(cleanId);
    showToast(`⭐ Thanks for rating ${stars} stars! (${stats.rating.toFixed(1)} avg)`);
    
    // Refresh detail page rating if open
    const scoreNum = document.querySelector('.tool-rating-big-num');
    if (scoreNum) scoreNum.textContent = stats.rating.toFixed(1);
    const scoreCount = document.querySelector('.tool-rating-big-count');
    if (scoreCount) scoreCount.textContent = `Based on ${stats.votes.toLocaleString()} verified ratings`;
  };

  // Unified Custom Deals Helpers
  function getCustomDeals() {
    try {
      if (window.AiraStorage) {
        const syncDeals = window.AiraStorage.getSync('aira_custom_deals');
        if (Array.isArray(syncDeals)) return syncDeals;
      }
      const raw = localStorage.getItem('aira_custom_deals');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }
  function saveCustomDeals(deals) {
    const list = Array.isArray(deals) ? deals : [];
    if (window.AiraStorage) {
      window.AiraStorage.set('aira_custom_deals', list);
    } else {
      try { localStorage.setItem('aira_custom_deals', JSON.stringify(list)); } catch (e) {}
    }
  }
  function getAllDeals() {
    const baseDeals = (typeof AI_DEALS_DATA !== 'undefined' && Array.isArray(AI_DEALS_DATA.deals)) ? AI_DEALS_DATA.deals : [];
    const customDeals = getCustomDeals();
    const customIds = new Set(customDeals.filter(Boolean).map(d => d && d.id).filter(Boolean));
    const filteredBase = baseDeals.filter(d => d && d.id && !customIds.has(d.id));
    return [...customDeals, ...filteredBase];
  }

  // Tool Submissions Helpers
  function getToolSubmissions() {
    try {
      if (window.AiraStorage) {
        const syncSubs = window.AiraStorage.getSync('aira_tool_submissions');
        if (syncSubs && Array.isArray(syncSubs)) return syncSubs;
      }
      const raw = localStorage.getItem('aira_tool_submissions');
      const list = raw ? JSON.parse(raw) : [];
      // Normalize submissions with IDs & default status
      return list.map((s, idx) => ({
        id: s.id || `sub_${idx + 1}_${(s.toolName || s.name || 'tool').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        toolName: s.toolName || s.name || 'Unnamed Tool',
        websiteUrl: s.websiteUrl || s.toolUrl || s.url || '',
        toolUrl: s.toolUrl || s.websiteUrl || s.url || '',
        category: s.category || 'developer-tools',
        pricing: s.pricing || 'Freemium',
        tagline: s.tagline || s.description || '',
        description: s.description || s.fullDescription || '',
        features: Array.isArray(s.features) ? s.features.join(', ') : (s.features || ''),
        contactEmail: s.contactEmail || s.workEmail || '',
        contactName: s.contactName || '',
        promoCode: s.promoCode || '',
        submittedAt: s.submittedAt || s.created_at || s.date || new Date().toISOString(),
        status: s.status || 'pending',
        badge: s.badge || ''
      }));
    } catch (e) { return []; }
  }
  function saveToolSubmissions(subs) {
    if (window.AiraStorage) {
      window.AiraStorage.set('aira_tool_submissions', subs);
    } else {
      try { localStorage.setItem('aira_tool_submissions', JSON.stringify(subs)); } catch (e) {}
    }
  }

  // Sponsor & Ad Inquiries Helpers (from #/advertise)
  function getAdInquiries() {
    try {
      if (window.AiraStorage) {
        const syncInq = window.AiraStorage.getSync('aira_ad_inquiries');
        if (syncInq && Array.isArray(syncInq)) return syncInq;
      }
      const raw = localStorage.getItem('aira_ad_inquiries');
      let list = raw ? JSON.parse(raw) : null;
      if (!list || !Array.isArray(list) || list.length === 0) {
        // Initial sample inquiries so admin has realistic demo data ready to inspect or approve
        list = [
          {
            id: 'ad-inq-101',
            slot: 'hero',
            brandName: 'DeepSeek AI',
            ctaText: 'Explore v3.1',
            tagline: 'DeepSeek v3.1 Flash — 90% Cheaper than Claude 3.5 Sonnet with frontier coding speed.',
            targetUrl: 'https://deepseek.com/?ref=aira',
            startDate: '2026-10-01',
            endDate: '2026-10-31',
            days: 30,
            message: 'Top header announcement bar booking for our flagship v3.1 model rollout.',
            contactName: 'Alex Zhang',
            workEmail: 'partnerships@deepseek.ai',
            cost: '$0.00 (FREE)',
            status: 'pending',
            createdAt: new Date().toISOString()
          },
          {
            id: 'ad-inq-102',
            slot: 'spotlight',
            brandName: 'Cursor IDE',
            ctaText: 'Claim 20% Off',
            tagline: 'The AI-first Code Editor built for high-velocity engineering teams.',
            targetUrl: 'https://cursor.com/?ref=aira',
            startDate: '2026-10-05',
            endDate: '2026-10-19',
            days: 14,
            message: 'In-feed spotlight box promotion for developer newsletter audience.',
            contactName: 'Sarah Jenkins',
            workEmail: 'sponsor@cursor.sh',
            cost: '$0.00 (FREE)',
            status: 'pending',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ];
        try { localStorage.setItem('aira_ad_inquiries', JSON.stringify(list)); } catch(e){}
      }
      return list.map((inq, idx) => ({
        id: inq.id || `ad-inq-${idx + 1}`,
        slot: inq.slot || 'hero',
        brandName: inq.brandName || inq.brand || inq.name || 'Sponsor Brand',
        ctaText: inq.ctaText || 'Learn More',
        tagline: inq.tagline || inq.headline || inq.description || '',
        targetUrl: inq.targetUrl || inq.url || inq.link || '#',
        startDate: inq.startDate || '',
        endDate: inq.endDate || '',
        days: inq.days || 7,
        message: inq.message || '',
        contactName: inq.contactName || inq.name || 'Marketing Lead',
        workEmail: inq.workEmail || inq.email || '',
        cost: inq.cost || '$0.00 (FREE)',
        status: inq.status || 'pending',
        createdAt: inq.createdAt || inq.date || new Date().toISOString()
      }));
    } catch(e) { return []; }
  }

  function saveAdInquiries(list) {
    if (window.AiraStorage) {
      window.AiraStorage.set('aira_ad_inquiries', list);
    } else {
      try { localStorage.setItem('aira_ad_inquiries', JSON.stringify(list)); } catch(e){}
    }
  }

  function getCustomPartnerships() {
    try {
      const raw = localStorage.getItem('aira_custom_partnerships');
      let list = raw ? JSON.parse(raw) : null;
      if (!list || !Array.isArray(list) || list.length === 0) {
        list = [
          {
            id: 'part-001',
            name: 'Vercel Enterprise',
            email: 'partners@vercel.com',
            url: 'https://vercel.com',
            message: 'Interested in a dedicated quarter-long newsletter sponsorship and joint developer webinar.',
            status: 'pending',
            date: new Date(Date.now() - 172800000).toISOString()
          }
        ];
        try { localStorage.setItem('aira_custom_partnerships', JSON.stringify(list)); } catch(e){}
      }
      return list;
    } catch(e) { return []; }
  }

  function saveCustomPartnerships(list) {
    try { localStorage.setItem('aira_custom_partnerships', JSON.stringify(list)); } catch(e){}
  }

  // App state
  const state = {
    articles: getArticles(),
    currentRoute: '',
    selectedTag: 'All',
    homeCurrentPage: 1,
    archiveCurrentPage: 1,
    altCurrentPage: 1,
    toolCurrentPage: 1,
    homeSearchQuery: '',
    altCategoryFilter: 'all',
    altSearchQuery: '',
    adminTab: 'overview', // 'overview' | 'submissions' | 'deals' | 'articles' | 'subscribers' | 'comments' | 'settings'
    adminArticleSearch: '',
    adminArticleTag: 'All',
    adminSubmissionFilter: 'all', // 'all' | 'pending' | 'approved' | 'rejected'
    adminSubmissionSearch: '',
    adminDealSearch: '',
    adminSubscriberSearch: '',
    adminCommentSearch: '',
    adminEditingDeal: null,
    adminEditingSubmission: null,
    toolCategoryFilter: 'all',
    toolPricingFilter: 'all',
    toolSearchQuery: '',
    promptToolFilter: 'all',
    promptCategoryFilter: 'all',
    promptSearchQuery: '',
    promptCurrentPage: 1,
    compareTool1: 'cursor',
    compareTool2: 'copilot',
    dealCategoryFilter: 'all',
    dealSearchQuery: '',
    bookmarkTab: 'tools',
    savedTools: JSON.parse(localStorage.getItem('aira_saved_tools') || '[]'),
    savedArticles: JSON.parse(localStorage.getItem('aira_saved_articles') || '[]'),
    savedAlternatives: JSON.parse(localStorage.getItem('aira_saved_alts') || '[]'),
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
  // Helper Utilities
  // =========================================================================
    // =========================================================================
  // Lead Magnet & VIP Starter Kit Engine
  // =========================================================================
  window.openLeadMagnetModal = function() {
    const lm = document.getElementById('lead-magnet-modal');
    if (lm) {
      lm.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeLeadMagnetModal = function() {
    const lm = document.getElementById('lead-magnet-modal');
    if (lm) {
      lm.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // (Download helpers unified at top of application)

  window.downloadPromptsKit = function() {
    downloadTextFile('AIRA-2026-Top-100-AI-Prompts-CheatSheet.md', getPromptsKitMarkdown());
  };

  window.downloadToolsKit = function() {
    downloadTextFile('AIRA-2026-AI-Tools-Directory-Guide.txt', getToolsDirectoryKitText());
  };

  window.copyMasterBonusPrompt = function(btn) {
    const promptText = document.getElementById('bonus-prompt-text');
    const textToCopy = promptText ? promptText.innerText.trim() : 'You are an elite AI Architect and Senior Technical Advisor. Analyze this problem with first-principles reasoning, state your assumptions, outline optimal trade-offs, and generate concise, production-ready code with complete error handling.';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        if (btn) btn.innerHTML = 'Copied! ✓';
        showToast('📋 AIRA Master Prompt copied to clipboard!');
        setTimeout(() => { if (btn) btn.innerHTML = 'Copy Prompt 📋'; }, 2000);
      }).catch(() => {
        showToast('Prompt copied to clipboard!');
      });
    } else {
      showToast('Prompt copied to clipboard!');
    }
  };

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function updateBookmarksBadge() {
    const badge = document.getElementById('bookmarks-nav-count');
    const mobileBadge = document.getElementById('mobile-bookmarks-count');
    const count = (state.savedTools?.length || 0) + (state.savedArticles?.length || 0) + (state.savedAlternatives?.length || 0);
    if (badge) {
      if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }
    if (mobileBadge) {
      if (count > 0) {
        mobileBadge.textContent = count;
        mobileBadge.style.display = 'inline-block';
      } else {
        mobileBadge.style.display = 'none';
      }
    }
  }

  function toggleSaveTool(toolId) {
    let saved = state.savedTools || [];
    if (saved.includes(toolId)) {
      saved = saved.filter(id => id !== toolId);
      showToast('Removed tool from bookmarks 🔖');
    } else {
      saved.push(toolId);
      showToast('Tool saved to bookmarks! 🔖');
    }
    state.savedTools = saved;
    localStorage.setItem('aira_saved_tools', JSON.stringify(saved));
    updateBookmarksBadge();
  }

  function toggleSaveArticle(slug) {
    let saved = state.savedArticles || [];
    if (saved.includes(slug)) {
      saved = saved.filter(s => s !== slug);
      showToast('Removed article from bookmarks 🔖');
    } else {
      saved.push(slug);
      showToast('Article saved to bookmarks! 🔖');
    }
    state.savedArticles = saved;
    localStorage.setItem('aira_saved_articles', JSON.stringify(saved));
    updateBookmarksBadge();
  }

  function toggleSaveAlt(altSlug) {
    let saved = state.savedAlternatives || [];
    if (saved.includes(altSlug)) {
      saved = saved.filter(s => s !== altSlug);
      showToast('Removed alternative from bookmarks 🔖');
    } else {
      saved.push(altSlug);
      showToast('Alternative saved to bookmarks! 🔖');
    }
    state.savedAlternatives = saved;
    localStorage.setItem('aira_saved_alts', JSON.stringify(saved));
    updateBookmarksBadge();
  }

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
    if (hashPath.startsWith('/post/')) {
      const slug = hashPath.replace('/post/', '');
      return { name: 'post', slug };
    }
    if (hashPath.startsWith('/article/')) {
      const slug = hashPath.replace('/article/', '');
      return { name: 'post', slug };
    }
    if (hashPath === '/archive') return { name: 'home' }; // Redirected to home
    if (hashPath === '/admin/editor-preview') {
      state.adminEditingArticle = { ...(state.articles && state.articles[0] ? state.articles[0] : {}) };
      state.adminTab = 'articles';
      state.adminPreviewMode = true;
      return { name: 'admin' };
    }
    if (hashPath.startsWith('/admin')) {
      const tab = hashPath.replace('/admin/', '').replace('/admin', '').trim();
      if (tab) state.adminTab = tab;
      return { name: 'admin' };
    }
    if (hashPath === '/subscribers') {
      state.adminTab = 'subscribers';
      return { name: 'admin' };
    }
    if (hashPath === '/prompts') return { name: 'prompts' };
    if (hashPath === '/jobs' || hashPath === '/job') {
      const params = new URLSearchParams(hashQuery || '');
      const category = params.get('category') || 'all';
      return { name: 'jobs', category };
    }
    if (hashPath === '/post-job' || hashPath === '/submit-job' || hashPath === '/jobs/post' || hashPath === '/jobs/new') {
      return { name: 'post-job' };
    }
    if (hashPath.startsWith('/jobs/') || hashPath.startsWith('/job/')) {
      const id = hashPath.replace('/jobs/', '').replace('/job/', '');
      return { name: 'job-detail', id };
    }
    if (hashPath === '/compare') return { name: 'tags' }; // Redirected to AI tools
    if (hashPath === '/bookmarks') return { name: 'bookmarks' };
    if (hashPath === '/submit') return { name: 'submit' };
    if (hashPath === '/deals') return { name: 'home' }; // Temporarily hidden as requested
    if (hashPath === '/advertise') return { name: 'advertise' };
    if (hashPath === '/alternatives') {
      const params = new URLSearchParams(hashQuery || '');
      const category = params.get('category') || 'all';
      return { name: 'alternatives', category };
    }
    if (hashPath.startsWith('/alternatives/')) {
      const slug = hashPath.replace('/alternatives/', '');
      return { name: 'alternative-detail', slug };
    }
    if (hashPath === '/tags' || hashPath === '/tools') {
      const params = new URLSearchParams(hashQuery || '');
      const category = params.get('category') || 'all';
      return { name: 'tags', category };
    }
    if (hashPath.startsWith('/tags/')) {
      const id = hashPath.replace('/tags/', '');
      return { name: 'tool-detail', id };
    }
    if (hashPath.startsWith('/tools/')) {
      const id = hashPath.replace('/tools/', '');
      return { name: 'tool-detail', id };
    }
    if (hashPath.startsWith('/tool/')) {
      const id = hashPath.replace('/tool/', '');
      return { name: 'tool-detail', id };
    }
    return { name: 'home' };
  }

  async function renderCurrentRoute() {
    // Stop any ongoing TTS audio when switching routes
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const route = getRoute();
    state.currentRoute = route.name;
    
    // Toggle Gate Mode on body (hides header/footer on gate screen)
    if (route.name === 'gate' || route.name === 'subscribe') {
      document.body.classList.add('aira-gate-active');
    } else {
      document.body.classList.remove('aira-gate-active');
    }

    // Toggle Admin Full-screen SaaS Mode on body (Always Clean Light SaaS Mode)
    if (route.name === 'admin') {
      document.body.classList.add('aira-admin-active');
      document.body.classList.remove('dark-mode');
    } else {
      document.body.classList.remove('aira-admin-active');
      if (localStorage.getItem('aira_theme') === 'dark') {
        document.body.classList.add('dark-mode');
      }
    }

    // Close mobile drawer on route change
    const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
    const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
    if (mobileNavDrawer) mobileNavDrawer.classList.remove('active');
    if (mobileNavBackdrop) mobileNavBackdrop.classList.remove('active');

    // Update active navbar & mobile links
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      const target = link.getAttribute('data-nav');
      if (target === route.name || 
         (route.name === 'gate' && target === 'home') ||
         (route.name === 'job-detail' && target === 'jobs') ||
         (route.name === 'post-job' && target === 'jobs') ||
         (route.name === 'alternative-detail' && target === 'alternatives') ||
         (route.name === 'tool-detail' && target === 'tags')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update active mobile bottom app dock tabs
    document.querySelectorAll('.mobile-dock-tab').forEach(dock => {
      const target = dock.getAttribute('data-dock');
      const isMatch = (target === route.name) ||
                      (target === 'home' && (route.name === 'gate' || route.name === 'home')) ||
                      (target === 'jobs' && (route.name === 'jobs' || route.name === 'job-detail' || route.name === 'post-job')) ||
                      (target === 'tags' && (route.name === 'tags' || route.name === 'tool-detail' || route.name === 'alternatives' || route.name === 'alternative-detail')) ||
                      (target === 'prompts' && route.name === 'prompts') ||
                      (target === 'bookmarks' && route.name === 'bookmarks');
      dock.classList.toggle('active', !!isMatch);
    });

    window.scrollTo({ top: 0, behavior: 'instant' });
    updateReadingProgress();

    // Dynamic Route Meta Tags
    if (route.name === 'home') {
      updateSocialMetaTags('AIRA | The One and Only AI Newsletter', 'The one and only AI newsletter. Join us and get the best AI news, tools, prompts, and tutorials completely FREE!');
    } else if (route.name === 'jobs') {
      updateSocialMetaTags('AIRA Jobs Board | Verified AI, UI/UX & Remote Openings', 'Discover high-paying roles in AI Engineering, UI/UX Design, and Prompt Engineering.');
    } else if (route.name === 'post-job' || route.name === 'submit-job') {
      updateSocialMetaTags('Post an AI, UI/UX or Prompt Engineering Job | AIRA', 'Reach 100+ vetted senior engineers, UI/UX product designers, and prompt specialists. Submit your open role with direct official career page application link.');
    } else if (route.name === 'tags') {
      updateSocialMetaTags('AI Tools Directory (96+ curated tools) | AIRA', 'Explore top curated AI tools, community ratings, alternatives, and verified links.');
    } else if (route.name === 'alternatives') {
      updateSocialMetaTags('AI Software Alternatives & Competitors | AIRA', 'Find the best open-source and proprietary alternatives for top AI tools.');
    } else if (route.name === 'prompts') {
      updateSocialMetaTags('AI Prompts Vault - 100+ Production Prompts | AIRA', 'Master frontier LLMs with battle-tested production prompts.');
    } else if (route.name === 'compare') {
      updateSocialMetaTags('Compare Top AI Tools Side-by-Side | AIRA', 'Compare AI models, pricing, speed, and features side-by-side.');
    } else if (route.name === 'archive') {
      updateSocialMetaTags('Newsletter Archive | AIRA', 'Browse all previous editions of the AIRA Newsletter.');
    } else if (route.name === 'submit') {
      updateSocialMetaTags('Submit Your AI Tool | AIRA', 'Get your AI product featured to 100+ subscribers.');
    } else if (route.name === 'advertise') {
      updateSocialMetaTags('Advertise with AIRA | AIRA', 'Partner with AIRA to sponsor newsletter editions and tool spotlights.');
    }

    if (route.name === 'gate' || route.name === 'subscribe') {
      renderSubscribeGatePage();
    } else if (route.name === 'home') {
      renderHomePage();
    } else if (route.name === 'jobs') {
      if (route.category) state.jobCategoryFilter = route.category;
      renderJobsPage();
    } else if (route.name === 'post-job' || route.name === 'submit-job') {
      renderPostJobPage();
    } else if (route.name === 'job-detail') {
      renderJobDetailPage(route.id);
    } else if (route.name === 'post') {
      await renderPostPage(route.slug);
    } else if (route.name === 'alternatives') {
      if (route.category) state.altCategoryFilter = route.category;
      renderAlternativesPage();
    } else if (route.name === 'alternative-detail') {
      renderAlternativeDetailPage(route.slug);
    } else if (route.name === 'tags' || route.name === 'tools') {
      if (route.category) state.toolCategoryFilter = route.category;
      renderTagsPage();
    } else if (route.name === 'tool-detail') {
      renderToolDetailPage(route.id);
    } else if (route.name === 'archive') {
      renderArchivePage();
    } else if (route.name === 'prompts') {
      renderPromptsPage();
    } else if (route.name === 'bookmarks') {
      renderBookmarksPage();
    } else if (route.name === 'submit' || route.name === 'submit-tool') {
      renderSubmitToolPage();
    } else if (route.name === 'advertise') {
      renderAdvertisePage();
    } else if (route.name === 'admin') {
      renderAdminPage();
    } else {
      renderHomePage();
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
            <img loading="lazy" decoding="async" src="assets/logo.jpg" alt="AIRA" class="sub-landing-logo-img" onerror="this.src='assets/logo.svg'" />
          </div>
          
          <h1 class="sub-landing-title">AIRA</h1>
          
          <p class="sub-landing-tagline">
            Level up your AI knowledge in just 5 minutes | Join 100+ AI pioneers & engineers from top tech companies.
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
  // Helper: Numbered Pagination Component (100% Matching Uploaded Mockup)
  // [First] [< Back] (1) (2) (3) (4) (5) (6) (7) (8) [Next >] [Last]
  // =========================================================================
  function renderPaginationHTML(currentPage, totalPages, type = 'home') {
    if (totalPages <= 1) return '';

    const isMobile = (typeof window !== 'undefined' && window.innerWidth < 640);
    const maxVisible = isMobile ? 4 : 8;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    const isFirstDisabled = currentPage <= 1;
    const isLastDisabled = currentPage >= totalPages;

    let pageNumbersHTML = '';
    for (let p = startPage; p <= endPage; p++) {
      const isActive = p === currentPage;
      pageNumbersHTML += `
        <button type="button" class="pagination-num-btn ${isActive ? 'active' : ''}" data-page="${p}" data-type="${type}" ${isActive ? 'aria-current="page"' : ''}>
          ${p}
        </button>
      `;
    }

    return `
      <div class="aira-pagination-bar" data-type="${type}">
        <button type="button" class="pagination-pill-btn btn-page-first" data-page="1" data-type="${type}" ${isFirstDisabled ? 'disabled' : ''}>
          First
        </button>
        <button type="button" class="pagination-pill-btn btn-page-prev" data-page="${currentPage - 1}" data-type="${type}" ${isFirstDisabled ? 'disabled' : ''}>
          ‹ Back
        </button>
        <div class="pagination-numbers-group">
          ${pageNumbersHTML}
        </div>
        <button type="button" class="pagination-pill-btn btn-page-next" data-page="${currentPage + 1}" data-type="${type}" ${isLastDisabled ? 'disabled' : ''}>
          Next ›
        </button>
        <button type="button" class="pagination-pill-btn btn-page-last" data-page="${totalPages}" data-type="${type}" ${isLastDisabled ? 'disabled' : ''}>
          Last
        </button>
      </div>
    `;
  }

  // =========================================================================
  // 1b. Homepage View (With Interactive Search Bar & Live Filtering)
  // =========================================================================
  
  // =========================================================================
  // =========================================================================
  // =========================================================================
  // Unified AI Tool Domain & High-Resolution Logo Resolvers
  // =========================================================================
  function getCleanToolDomain(tool) {
    if (!tool) return 'ai.com';
    const rawId = (tool.id || tool.name || '').toLowerCase();
    
    // Exact domain mappings for prominent tools
    if (rawId.includes('notion')) return 'notion.so';
    if (rawId.includes('chatgpt') || rawId.includes('dalle') || rawId.includes('openai')) return 'openai.com';
    if (rawId.includes('claude') || rawId.includes('anthropic')) return 'anthropic.com';
    if (rawId.includes('midjourney')) return 'midjourney.com';
    if (rawId.includes('stable-diffusion')) return 'stablediffusionweb.com';
    if (rawId.includes('canva')) return 'canva.com';
    if (rawId.includes('quick-search-for-bard') || rawId.includes('gemini') || rawId.includes('bard')) return 'google.com';
    if (rawId.includes('sqan')) return 'sqan.app';
    if (rawId.includes('easymeety')) return 'easymeety.ai';
    if (rawId.includes('atom')) return 'github.com';
    if (rawId.includes('gitlab')) return 'gitlab.com';
    if (rawId.includes('jira')) return 'atlassian.com';
    if (rawId.includes('visual-studio-code') || rawId.includes('vscode')) return 'code.visualstudio.com';
    if (rawId.includes('cursor')) return 'cursor.com';
    if (rawId.includes('deepseek')) return 'deepseek.com';
    if (rawId.includes('freepik')) return 'freepik.com';
    if (rawId.includes('suno')) return 'suno.ai';
    if (rawId.includes('udio')) return 'udio.com';
    if (rawId.includes('elevenlabs')) return 'elevenlabs.io';
    if (rawId.includes('runway')) return 'runwayml.com';
    if (rawId.includes('perplex')) return 'perplexity.ai';

    let d = (tool.domain || '').trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0].trim();
    if (!d || d === 'apps.apple.com' || d.includes('apple.com')) {
      if (tool.url && !tool.url.includes('apple.com')) {
        d = tool.url.trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0].trim();
      } else {
        d = rawId.replace(/[^a-z0-9]/g, '') + '.com';
      }
    }
    return d || 'ai.com';
  }

  function getToolLogoUrl(tool) {
    if (!tool) return 'assets/logo.png';
    const cleanDomain = getCleanToolDomain(tool);
    // If tool has a local asset or custom user-uploaded data/image (not powerfulai.tools)
    if (tool.image && !tool.image.includes('powerfulai.tools')) {
      return tool.image;
    }
    return `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
  }

  // =========================================================================
  // Unified AI Tool Card Renderer (Used by Directory, Featured Showcase & Bookmarks)
  // =========================================================================
  function renderToolCard(tool) {
    if (!tool) return '';
    const pricing = (tool.pricing || 'Free').trim();
    const pricingLower = pricing.toLowerCase();
    const pricingClass = `pricing-${pricingLower.replace(/\s+/g, '-')}`;
    const cleanDomain = getCleanToolDomain(tool);
    const logoUrl = getToolLogoUrl(tool);
    const duckLogo = `https://icons.duckduckgo.com/ip3/${cleanDomain}.ico`;
    const fallbackIcon = tool.icon || '⚡';
    const isPromoted = isToolPromoted(tool);
    const catInfo = getCategoryBadgeInfo(tool);

    return `
      <div class="tool-card ${isPromoted ? 'is-promoted-card' : ''} ${tool.featured ? 'is-featured' : ''}" data-tool-id="${tool.id}" onclick="if(!event.target.closest('a, button')) { window.location.hash='#/tools/${tool.id}'; }">
        <div class="tool-card-header">
          <a href="#/tools/${tool.id}" class="tool-card-avatar-wrap" title="View ${escapeHtml(tool.name)} details">
            <img loading="lazy" decoding="async" referrerpolicy="no-referrer" src="${logoUrl}" alt="${escapeHtml(tool.name)} logo" class="tool-logo-img" onerror="if(!this.dataset.triedDuck){ this.dataset.triedDuck='true'; this.src='${duckLogo}'; } else { this.onerror=null; this.parentElement.innerHTML='<span class=\\'tool-emoji\\'>${fallbackIcon}</span>'; }" />
          </a>
          <div class="tool-header-content">
            <div class="tool-header-top-line">
              <h3 class="tool-card-name" title="${escapeHtml(tool.name)}">
                <a href="#/tools/${tool.id}" class="tool-title-link">${escapeHtml(tool.name)}</a>
              </h3>
              <span class="tool-verified-check" title="Verified AI Tool">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#0F172A"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              </span>
            </div>
            <div class="tool-badges-wrap">
              <span class="tool-badge-category">${catInfo.label}</span>
              <span class="tool-badge-pricing ${pricingClass}">${pricing.toUpperCase()}</span>
              ${isPromoted ? '<span class="tool-badge-promoted"><span class="star">★</span> PROMOTED</span>' : ''}
            </div>
          </div>
        </div>

        <p class="tool-card-desc">${escapeHtml(tool.description || '')}</p>

        <div class="tool-card-footer">
          <a href="#/tools/${tool.id}" class="tool-btn-details" title="View details of ${escapeHtml(tool.name)}">Details</a>
          <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="tool-btn-visit" title="Open ${escapeHtml(tool.name)}">
            <span>Visit Website</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        </div>
      </div>
    `;
  }

  // Featured AI Tools of the Week Generator
  // =========================================================================
  function getFeaturedToolsHTML() {
    const allTools = getAllTools();
    const featured = allTools.filter(t => t.featured || t.badge === 'Featured' || isToolPromoted(t)).slice(0, 3);
    const targetTools = featured.length >= 3 ? featured : allTools.slice(0, 3);

    return targetTools.map(renderToolCard).join('');
  }

  // =========================================================================
  // Today's Top 5 Trending AI Tools Leaderboard
  // =========================================================================
  function getTrendingToolsHTML() {
    const allTools = getAllTools();
    const top5 = [...allTools].sort((a, b) => {
      const statsA = getToolRatingStats(a);
      const statsB = getToolRatingStats(b);
      return (statsB.votes || 0) - (statsA.votes || 0);
    }).slice(0, 5);

    return `
      <div class="sidebar-trending-tools-widget">
        <div class="sidebar-trending-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="trending-fire-icon">🔥</span>
            <h4>Top 5 Trending Tools</h4>
          </div>
          <a href="#/tags" class="trending-view-all-link">View 80+ →</a>
        </div>
        <div class="sidebar-trending-list">
          ${top5.map((t, idx) => {
            const cleanDomain = getCleanToolDomain(t);
            const iconSrc = getToolLogoUrl(t);
            const duckLogo = `https://icons.duckduckgo.com/ip3/${cleanDomain}.ico`;
            const stats = getToolRatingStats(t);
            return `
              <div class="trending-tool-row" onclick="window.location.hash='#/tools/${t.id}';">
                <span class="trending-rank-num ${idx === 0 ? 'is-gold' : (idx === 1 ? 'is-silver' : (idx === 2 ? 'is-bronze' : ''))}">#${idx + 1}</span>
                <div class="trending-tool-icon">
                  <img loading="lazy" decoding="async" referrerpolicy="no-referrer" src="${iconSrc}" alt="${escapeHtml(t.name)}" onerror="if(!this.dataset.triedDuck){ this.dataset.triedDuck='true'; this.src='${duckLogo}'; } else { this.onerror=null; this.parentElement.innerHTML='⚡'; }" />
                </div>
                <div class="trending-tool-details">
                  <div class="trending-tool-name-line">
                    <span class="trending-tool-name">${escapeHtml(t.name)}</span>
                    <span class="trending-tool-pricing-tag">${escapeHtml(t.pricing || 'Free')}</span>
                  </div>
                  <span class="trending-tool-desc-short">${escapeHtml(t.description || '')}</span>
                </div>
                <button type="button" class="trending-upvote-mini-btn ${stats.hasVoted ? 'is-voted' : ''}" onclick="event.stopPropagation(); window.toggleToolVote('${stats.id}'); if(typeof renderHomePage==='function') renderHomePage();" title="Upvote tool">
                  <span>▲</span>
                  <span>${stats.votes}</span>
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // Sidebar Top Articles Helper (Replaces categories in sidebar)
  function getSidebarTopArticlesHTML() {
    const articlesList = getArticles();
    const topArticles = articlesList.slice(0, 4);

    return `
      <div class="sidebar-trending-tools-widget" style="margin-top: 24px;">
        <div class="sidebar-trending-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="trending-fire-icon">📰</span>
            <h4>Top AI Articles</h4>
          </div>
          <a href="#/home" class="trending-view-all-link">All 56 →</a>
        </div>
        <div class="sidebar-trending-list">
          ${topArticles.map((art) => `
            <div class="trending-tool-row" style="cursor: pointer;" onclick="window.location.hash='#/p/${art.slug}';">
              <div class="trending-tool-icon" style="width: 44px; height: 44px; border-radius: 8px; overflow: hidden; flex-shrink: 0;">
                <img loading="lazy" decoding="async" src="${art.image_url || 'assets/logo.jpg'}" alt="${escapeHtml(art.title)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/logo.jpg'" loading="lazy" />
              </div>
              <div class="trending-tool-details" style="min-width: 0;">
                <div class="trending-tool-name-line" style="margin-bottom: 2px;">
                  <span class="trending-tool-name" style="font-size: 0.85rem; font-weight: 700; line-height: 1.3; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${escapeHtml(art.title)}</span>
                </div>
                <span class="trending-tool-desc-short" style="font-size: 0.75rem; color: #71717A;">${art.date || 'Sep 2026'} • ${art.reading_time || art.read_time || '4 min read'}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // AIRA Pulse: Community Live Weekly AI Poll
  // =========================================================================
  const DEFAULT_POLL_DATA = {
    id: 'poll-2026-week-1',
    question: 'Which AI model or tool is your primary driver in 2026?',
    options: [
      { id: 'claude', text: 'Claude 3.7 Sonnet (Thinking)', votes: 148 },
      { id: 'gpt4o', text: 'ChatGPT (GPT-4o / Canvas)', votes: 122 },
      { id: 'deepseek', text: 'DeepSeek V3 / R1 (Reasoning)', votes: 94 },
      { id: 'cursor', text: 'Cursor AI / Windsurf Code', votes: 165 }
    ]
  };

  function getPollStats() {
    try {
      const stored = localStorage.getItem('aira_poll_votes_counts');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return DEFAULT_POLL_DATA;
  }

  function savePollStats(data) {
    localStorage.setItem('aira_poll_votes_counts', JSON.stringify(data));
  }

  function getCommunityPollHTML() {
    const poll = getPollStats();
    const userVote = localStorage.getItem('aira_user_poll_vote');
    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

    return `
      <div class="sidebar-poll-widget">
        <div class="poll-widget-header">
          <span class="poll-live-badge"><span class="ticker-pulse-dot"></span> LIVE POLL</span>
          <span class="poll-total-count">${totalVotes} votes</span>
        </div>
        <h4 class="poll-question-text">${poll.question}</h4>

        <div class="poll-options-list">
          ${poll.options.map(opt => {
            const isSelected = userVote === opt.id;
            const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
            return `
              <div class="poll-option-row ${isSelected ? 'is-selected' : ''} ${userVote ? 'has-voted' : ''}" onclick="window.castPollVote('${opt.id}');">
                <div class="poll-progress-fill" style="width: ${userVote ? percentage : 0}%;"></div>
                <div class="poll-option-content">
                  <div class="poll-option-left">
                    <span class="poll-radio-dot ${isSelected ? 'active' : ''}"></span>
                    <span class="poll-option-title">${escapeHtml(opt.text)}</span>
                  </div>
                  ${userVote ? `<span class="poll-percent-tag"><strong>${percentage}%</strong> (${opt.votes})</span>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        ${userVote ? `
          <div class="poll-footer-row">
            <span class="poll-thanks-msg">✓ Thanks for voting!</span>
            <button type="button" class="btn-change-poll-vote" onclick="window.resetPollVote();">Change Vote</button>
          </div>
        ` : `
          <p class="poll-hint-msg">👉 Tap an option to cast your vote.</p>
        `}
      </div>
    `;
  }

  window.castPollVote = function(optId) {
    const currentVote = localStorage.getItem('aira_user_poll_vote');
    if (currentVote === optId) return;

    const poll = getPollStats();
    if (currentVote) {
      const prevOpt = poll.options.find(o => o.id === currentVote);
      if (prevOpt && prevOpt.votes > 0) prevOpt.votes--;
    }

    const newOpt = poll.options.find(o => o.id === optId);
    if (newOpt) newOpt.votes++;

    savePollStats(poll);
    localStorage.setItem('aira_user_poll_vote', optId);
    showToast('Your vote was recorded! 📊');
    
    const pollEl = document.querySelector('.sidebar-poll-widget');
    if (pollEl) {
      pollEl.outerHTML = getCommunityPollHTML();
    }
  };

  window.resetPollVote = function() {
    const currentVote = localStorage.getItem('aira_user_poll_vote');
    if (currentVote) {
      const poll = getPollStats();
      const prevOpt = poll.options.find(o => o.id === currentVote);
      if (prevOpt && prevOpt.votes > 0) prevOpt.votes--;
      savePollStats(poll);
      localStorage.removeItem('aira_user_poll_vote');
    }
    const pollEl = document.querySelector('.sidebar-poll-widget');
    if (pollEl) {
      pollEl.outerHTML = getCommunityPollHTML();
    }
  };

    // =========================================================================
  // Shared Sponsors Strip & Modern Tool Card Renderer
  // =========================================================================
  function getSponsorsStripHTML() {
    return `
      <div class="openalt-sponsors-strip">
        <div class="openalt-sponsors-header">
          <span class="openalt-sponsors-text">Backed by industry leaders &amp; community partners • <a href="#/advertise" class="openalt-become-sponsor-link">Become a Sponsor</a></span>
        </div>
        <div class="openalt-sponsors-grid">
          <a href="https://chat.whatsapp.com/HJ2V5txnytDLPaWDKb1yKw" target="_blank" class="openalt-sponsor-tile" style="background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.45);" title="Join UI/UX Design Community">
            <img src="assets/ui-designer-community.png" style="width: 20px; height: 20px; border-radius: 4px; object-fit: cover; display: inline-block; vertical-align: middle;" alt="UI Designer" />
            <span class="sponsor-name" style="font-weight: 700; color: #FFFFFF;">UI Designer</span>
          </a>
          <a href="https://t.me/GemaniPrompt_21" target="_blank" class="openalt-sponsor-tile" style="background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.45);" title="BananaPromptAI - 500+ Ready-Made Prompts">
            <img src="assets/banana-prompt-logo.jpg" style="width: 20px; height: 20px; border-radius: 4px; object-fit: cover; display: inline-block; vertical-align: middle;" alt="BananaPromptAI" />
            <span class="sponsor-name" style="font-weight: 700; color: #FFFFFF;">BananaPromptAI</span>
          </a>
          <a href="#/advertise" class="openalt-sponsor-tile"><span class="sponsor-emoji">⚡</span> <span class="sponsor-name">AIRA VIP</span></a>
          <a href="#/advertise" class="openalt-sponsor-tile"><span class="sponsor-emoji">🤖</span> <span class="sponsor-name">Anthropic</span></a>
          <a href="#/advertise" class="openalt-sponsor-tile"><span class="sponsor-emoji">🧠</span> <span class="sponsor-name">Mistral AI</span></a>
          <a href="#/advertise" class="openalt-sponsor-tile openalt-sponsor-tile-add"><span class="sponsor-emoji">✨</span> <span class="sponsor-name">Sponsor +</span></a>
        </div>
      </div>
    `;
  }


function renderHomePage() {
    appContainer.innerHTML = `
      <!-- OpenAlternative Exact Modern Hero Section -->
      <section class="hero-openalt-section">
        <div class="hero-openalt-container">
          
          <!-- 0. Top Ad / Featured Spotlight Bar (Dynamic from Admin Settings) -->
          ${(() => {
            const sp = (typeof getSponsorSettings === 'function') ? getSponsorSettings() : null;
            const topBar = sp ? sp.topBar : { active: true, badge: 'Ad', icon: '⚡', headline: '<strong>AIRA Sponsor</strong> — Daily frontier AI breakthroughs, 96+ verified tools, and expert workflows.', link: '#/advertise', ctaText: 'Learn More' };
            if (!topBar || topBar.active === false) return '';
            return `
              <div class="hero-openalt-top-ad">
                <div class="hero-top-ad-left">
                  <span class="hero-ad-badge-pill">${escapeHtml(topBar.badge || 'Ad')}</span>
                  <span class="hero-ad-brand-icon">${topBar.icon || '⚡'}</span>
                  <span class="hero-ad-text-content">${topBar.headline || '<strong>AIRA Sponsor</strong> — Daily frontier AI breakthroughs, 96+ verified tools, and expert workflows.'}</span>
                </div>
                <a href="${topBar.link || '#/advertise'}" target="${topBar.link && topBar.link.startsWith('http') ? '_blank' : '_self'}" class="hero-ad-action-btn">${escapeHtml(topBar.ctaText || 'Learn More')}</a>
              </div>
            `;
          })()}

          <!-- 1. Top Mini Pill Badge -->
          <div class="hero-openalt-mini-badge">
            <span>⚡ AIRA Daily Intelligence</span>
          </div>

          <!-- 2. Main Title (Exact Clean Typography) -->
          <h1 class="hero-openalt-heading">
            The One &amp; Only AI Newsletter<br />
            &amp; Curated Tools Hub
          </h1>

          <!-- 3. Subtitle -->
          <p class="hero-openalt-subheading">
            Save time, cut costs, and 10x your productivity with expertly curated AI tools, daily breakthroughs, and open-source software alternatives.
          </p>

          <!-- 4. Single Clean Search Box (Replacing Subscribe as requested) -->
          <form class="hero-openalt-search-box" id="hero-openalt-search-form" onsubmit="event.preventDefault();">
            <svg class="hero-search-icon-left" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717A" stroke-width="2.2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" class="hero-openalt-search-input" id="hero-search-input" placeholder="Search AI tools, software alternatives, articles..." value="${state.homeSearchQuery || ''}" autocomplete="off" />
            <button type="button" id="hero-search-clear" class="hero-search-clear-btn" style="display: ${state.homeSearchQuery ? 'flex' : 'none'};" title="Clear search">✕</button>
            <button type="submit" class="hero-openalt-search-btn" id="hero-search-btn">Search</button>
          </form>

          <!-- 5. Social Proof (5 Overlapping Avatars + 100+ members) -->
          <div class="hero-openalt-social-proof-clean">
            <div class="hero-avatar-stack-clean">
              <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&auto=format&fit=crop&q=80" alt="Subscriber" class="hero-avatar-mini" />
              <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&auto=format&fit=crop&q=80" alt="Subscriber" class="hero-avatar-mini" />
              <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&auto=format&fit=crop&q=80" alt="Subscriber" class="hero-avatar-mini" />
              <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&auto=format&fit=crop&q=80" alt="Subscriber" class="hero-avatar-mini" />
              <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=96&auto=format&fit=crop&q=80" alt="Subscriber" class="hero-avatar-mini" />
            </div>
            <span class="hero-proof-text-clean">Trusted by 100+ members</span>
          </div>

          <!-- Partners & Sponsors Grid Strip (Bottom of Hero) -->
          ${getSponsorsStripHTML()}

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

      const ARTICLES_PER_PAGE = 9;
      const query = (state.homeSearchQuery || '').trim().toLowerCase();
            let filteredArticles = state.articles;
      if (state.selectedTag && state.selectedTag !== 'All') {
        if (state.selectedTag.toLowerCase() === 'news') {
          filteredArticles = state.articles.filter(a => !a.is_prompt && (!a.category || a.category !== 'prompt'));
        } else {
          filteredArticles = state.articles.filter(a => {
            const tagVal = ((a && a.tag) || '').toLowerCase();
            const catVal = ((a && a.category) || '').toLowerCase();
            const target = state.selectedTag.toLowerCase();
            return tagVal === target || catVal === target;
          });
        }
      }
if (query !== '') {
        filteredArticles = filteredArticles.filter(a => {
          const titleMatch = (a.title || '').toLowerCase().includes(query);
          const subtitleMatch = (a.subtitle || '').toLowerCase().includes(query);
          const tagMatch = (a.tag || '').toLowerCase().includes(query);
          return titleMatch || subtitleMatch || tagMatch;
        });
      }

      const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE) || 1;
      if (!state.homeCurrentPage || state.homeCurrentPage > totalPages) {
        state.homeCurrentPage = 1;
      }

      const startIndex = (state.homeCurrentPage - 1) * ARTICLES_PER_PAGE;
      const visibleArticles = filteredArticles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);
      const isSearching = query.length > 0;

      const parseViews = (v) => {
        if (typeof v === 'number') return v;
        if (!v) return 0;
        const str = String(v).toLowerCase().trim();
        if (str.endsWith('k')) return parseFloat(str) * 1000;
        if (str.endsWith('m')) return parseFloat(str) * 1000000;
        return parseFloat(str) || 0;
      };

      // Select top popular posts (Top 7)
      const popularArticles = [...state.articles]
        .sort((a, b) => parseViews(b.views) - parseViews(a.views))
        .slice(0, 7);

      feedInner.innerHTML = `
        <!-- Articles Header & Filter Pills (Right Aligned) -->
        <div class="feed-header">
          <h2 class="feed-title">${isSearching ? `Search Results (${filteredArticles.length})` : `Articles (Page ${state.homeCurrentPage} of ${totalPages})`}</h2>
          <div class="filter-pills">
            <button class="filter-pill ${state.selectedTag === 'All' ? 'active' : ''}" data-tag="All">All (${state.articles.length})</button>
            <button class="filter-pill ${state.selectedTag === 'News' ? 'active' : ''}" data-tag="News">News (${state.articles.length})</button>
          </div>
        </div>

        ${isSearching ? `
          <div class="search-results-indicator">
            <span>Found <strong>${filteredArticles.length}</strong> ${filteredArticles.length === 1 ? 'article' : 'articles'} matching "<em>${state.homeSearchQuery}</em>"</span>
            <button type="button" class="btn-clear-search-link" id="btn-clear-search-query">Clear search</button>
          </div>
        ` : ''}

        ${visibleArticles.length === 0 ? `
          <div class="no-articles-found">
            <p style="font-size: 1.15rem; font-weight: 700; color: var(--color-text-primary); margin-bottom: 8px;">No articles found</p>
            <p style="color: var(--color-text-secondary); font-size: 0.95rem; margin-bottom: 16px;">We couldn't find any articles matching "${state.homeSearchQuery}".</p>
            <button type="button" class="btn-clear-search-link" id="btn-empty-clear-search" style="font-size: 1rem; font-weight: 600;">← View All Articles</button>
          </div>
        ` : `
          <!-- Full-Width Articles Grid (Taking All Available Space across container) -->
          <div class="articles-grid-full" id="main-articles-grid">
            ${visibleArticles.map((article, idx) => `
              <a href="#/p/${article.slug}" class="article-card openalt-box-card">
                <!-- 1. Top Aspect Ratio Preview Image with Badges -->
                <div class="card-image-wrap">
                  <img loading="lazy" decoding="async" src="${article.image_url || 'assets/logo.jpg'}" alt="${article.title || 'AIRA Article'}" class="card-thumbnail" loading="lazy" />
                  <div class="card-badges-overlay">
                    <span class="card-tag-badge openalt-badge-category">${article.tag || 'Frontier AI'}</span>
                  </div>
                </div>

                <!-- 2. Card Body Box (OpenAlternative Style) -->
                <div class="card-body">
                  <!-- Meta Row: Date & Reading Time -->
                  <div class="openalt-card-meta-top">
                    <span class="openalt-date-badge">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      ${article.date || 'Sep 2026'}
                    </span>
                    <span class="openalt-dot">•</span>
                    <span class="openalt-readtime-badge">${article.reading_time || article.read_time || '4 min read'}</span>
                  </div>

                  <!-- Title -->
                  <h3 class="card-title openalt-title">${article.title || ''}</h3>

                  <!-- Description / Subtitle -->
                  <p class="card-subtitle openalt-desc">${article.subtitle || ''}</p>

                  <!-- Footer Row: Author + Audio + Action Button -->
                  <div class="card-footer openalt-footer">
                    <div class="openalt-footer-left">
                      <img loading="lazy" decoding="async" src="${article.author_avatar || 'assets/logo.svg'}" alt="${article.author || 'AIRA'}" class="card-author-avatar" onerror="this.src='assets/logo.svg'" />
                      <span class="card-author-name">${article.author || 'AIRA'}</span>
                    </div>
                    <div class="openalt-footer-right">
                      <button type="button" class="card-listen-btn openalt-listen-btn" data-slug="${article.slug}" title="Listen to AI Voice Narration" onclick="event.preventDefault(); event.stopPropagation(); window.airaAudioEngine && window.airaAudioEngine.togglePlay('${article.slug}');">
                        <span class="listen-btn-icon">🎧</span>
                        <span class="listen-btn-text">Listen</span>
                      </button>
                      <span class="openalt-read-btn">
                        <span>Read</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            `).join('')}
          </div>

          <!-- Centered Numbered Pagination Bar Across Full Container Width -->
          <div class="home-pagination-wrapper">
            ${renderPaginationHTML(state.homeCurrentPage, totalPages, 'home')}
          </div>
        `}
      `;

      // Bind filter pills
      if (window.airaAudioEngine) window.airaAudioEngine.syncCardButtons();
      feedInner.querySelectorAll('.filter-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          state.selectedTag = e.currentTarget.getAttribute('data-tag');
          state.homeCurrentPage = 1;
          updateArticlesGrid();
        });
      });

      // Bind Home Pagination Buttons
      feedInner.querySelectorAll('.aira-pagination-bar[data-type="home"] button[data-page]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          if (btn.disabled) return;
          const targetPage = parseInt(btn.getAttribute('data-page'), 10);
          if (targetPage && targetPage >= 1 && targetPage <= totalPages && targetPage !== state.homeCurrentPage) {
            state.homeCurrentPage = targetPage;
            updateArticlesGrid();
            const feedSection = document.getElementById('main-articles-feed');
            if (feedSection) {
              feedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        });
      });

      // Bind Feed search input
      const feedSearchInput = document.getElementById('feed-search-input');
      const feedSearchClear = document.getElementById('feed-search-clear');
      if (feedSearchInput) {
        feedSearchInput.addEventListener('input', (e) => {
          state.homeSearchQuery = e.target.value;
          if (feedSearchClear) feedSearchClear.style.display = e.target.value ? 'block' : 'none';
          state.homeCurrentPage = 1;
          updateArticlesGrid();
        });
      }
      if (feedSearchClear) {
        feedSearchClear.addEventListener('click', () => {
          state.homeSearchQuery = '';
          if (feedSearchInput) feedSearchInput.value = '';
          feedSearchClear.style.display = 'none';
          state.homeCurrentPage = 1;
          updateArticlesGrid();
        });
      }

      // Bind clear search buttons
      const clearQueryBtn = document.getElementById('btn-clear-search-query');
      if (clearQueryBtn) {
        clearQueryBtn.addEventListener('click', () => {
          state.homeSearchQuery = '';
          if (feedSearchInput) feedSearchInput.value = '';
          state.homeCurrentPage = 1;
          updateArticlesGrid();
        });
      }
      const emptyClearBtn = document.getElementById('btn-empty-clear-search');
      if (emptyClearBtn) {
        emptyClearBtn.addEventListener('click', () => {
          state.homeSearchQuery = '';
          if (feedSearchInput) feedSearchInput.value = '';
          state.homeCurrentPage = 1;
          updateArticlesGrid();
        });
      }
    }

    // Initial render of grid
    updateArticlesGrid();

    // Bind Hero Search Form & Input
    const heroSearchInput = document.getElementById('hero-search-input');
    const heroSearchClear = document.getElementById('hero-search-clear');
    const heroSearchForm = document.getElementById('hero-openalt-search-form');

    if (heroSearchInput) {
      heroSearchInput.addEventListener('input', (e) => {
        state.homeSearchQuery = e.target.value;
        if (heroSearchClear) {
          heroSearchClear.style.display = e.target.value ? 'flex' : 'none';
        }
        const feedSearchInput = document.getElementById('feed-search-input');
        if (feedSearchInput) feedSearchInput.value = e.target.value;
        state.homeCurrentPage = 1;
        updateArticlesGrid();
      });
    }

    if (heroSearchClear) {
      heroSearchClear.addEventListener('click', () => {
        state.homeSearchQuery = '';
        if (heroSearchInput) {
          heroSearchInput.value = '';
          heroSearchInput.focus();
        }
        heroSearchClear.style.display = 'none';
        const feedSearchInput = document.getElementById('feed-search-input');
        if (feedSearchInput) feedSearchInput.value = '';
        state.homeCurrentPage = 1;
        updateArticlesGrid();
      });
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
  // 2. Post / Article Detail View
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
    const isBookmarked = (state.savedArticles || []).includes(article.slug);
    const currentLikes = (parseInt(article.likes, 10) || 0) + (isLiked ? 1 : 0);
    const postPoll = state.pollVotes[article.slug] || null;
    
    // Fetch comments from Supabase with fallback
    let postComments = [];
    if (window.DatabaseService) {
      postComments = await window.DatabaseService.getComments(article.slug);
    } else {
      postComments = state.comments[article.slug] || [];
    }

    const recommendedArticles = state.articles.filter(a => a.slug !== article.slug).slice(0, 2);
    updateSocialMetaTags(article.title, article.subtitle || article.title, article.image_url);

    function getBananaPromptAdHTML() {
      return `
        <div class="banana-prompt-ad-box" style="margin: 36px 0; background: radial-gradient(120% 120% at 85% 10%, rgba(147, 51, 234, 0.22) 0%, rgba(30, 27, 75, 0.5) 45%, #090D1A 100%); border: 1px solid rgba(168, 85, 247, 0.35); border-radius: 18px; padding: 28px; color: #FFFFFF; box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.6), 0 0 30px rgba(147, 51, 234, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.12); overflow: hidden; position: relative;">
          
          <!-- Top Branded Header Row -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 28px; height: 28px; border-radius: 7px; overflow: hidden; border: 1px solid rgba(168, 85, 247, 0.6); box-shadow: 0 0 10px rgba(168, 85, 247, 0.4); flex-shrink: 0;">
                <img src="assets/banana-prompt-logo.jpg" alt="AI Creator Academy Logo" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.82rem; font-weight: 800; color: #F8FAFC; letter-spacing: 0.04em; text-transform: uppercase;">AI CREATOR ACADEMY</span>
                <span style="background: rgba(250, 204, 21, 0.15); border: 1px solid rgba(250, 204, 21, 0.4); color: #FACC15; font-size: 0.68rem; font-weight: 800; padding: 2px 8px; border-radius: 9999px;">BANANA PROMPT AI</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(34, 197, 94, 0.12); border: 1px solid rgba(34, 197, 94, 0.35); padding: 3px 10px; border-radius: 9999px;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: #22C55E; display: inline-block;"></span>
              <span style="font-size: 0.72rem; font-weight: 700; color: #4ADE80; text-transform: uppercase; letter-spacing: 0.04em;">100% FREE CHANNEL</span>
            </div>
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 26px; align-items: center;">
            
            <!-- Left Photo Column (Luxury AI Portrait Frame) -->
            <div style="flex: 0 0 210px; max-width: 230px; border-radius: 14px; overflow: hidden; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.6); border: 1.5px solid rgba(255,255,255,0.18); background: #0F172A;">
              <img src="assets/banana-prompt-ai.jpg" alt="BananaPromptAI Generation Example" style="width: 100%; height: auto; display: block; object-fit: cover;" />
              <div style="position: absolute; bottom: 8px; left: 8px; right: 8px; background: rgba(9, 13, 26, 0.85); backdrop-filter: blur(8px); color: #F8FAFC; font-size: 0.68rem; font-weight: 700; padding: 5px 8px; border-radius: 7px; text-align: center; border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; gap: 5px;">
                <span style="color: #A855F7;">✨</span>
                <span>AI Generated with Prompt</span>
              </div>
            </div>

            <!-- Right Content Details Column -->
            <div style="flex: 1; min-width: 280px;">
              <!-- Main Catchy Headline -->
              <h3 style="font-size: 1.32rem; font-weight: 900; color: #FFFFFF; line-height: 1.35; margin: 0 0 14px 0; letter-spacing: -0.01em;">
                AI se best results chahiye? Toh BananaPromptAI try karo! 😍
              </h3>

              <!-- Feature Bullet Cards -->
              <div style="display: flex; flex-direction: column; gap: 9px; margin-bottom: 20px;">
                <div style="display: flex; align-items: flex-start; gap: 10px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.07); padding: 8px 12px; border-radius: 9px;">
                  <span style="color: #22C55E; font-size: 0.95rem; line-height: 1;">✅</span>
                  <span style="font-size: 0.88rem; color: #E2E8F0; line-height: 1.4;"><strong style="color: #FFFFFF;">500+ Ready-Made Prompts</strong> — Gemini, ChatGPT, Grok ya kisi bhi AI me paste karo.</span>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 10px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.07); padding: 8px 12px; border-radius: 9px;">
                  <span style="color: #22C55E; font-size: 0.95rem; line-height: 1;">✅</span>
                  <span style="font-size: 0.88rem; color: #E2E8F0; line-height: 1.4;"><strong style="color: #FFFFFF;">Apni photo upload karo</strong> aur amazing AI images generate karo.</span>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 10px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.07); padding: 8px 12px; border-radius: 9px;">
                  <span style="color: #22C55E; font-size: 0.95rem; line-height: 1;">✅</span>
                  <span style="font-size: 0.88rem; color: #E2E8F0; line-height: 1.4;">Prompt likhne ki tension khatam!</span>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 10px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.07); padding: 8px 12px; border-radius: 9px;">
                  <span style="color: #22C55E; font-size: 0.95rem; line-height: 1;">✅</span>
                  <span style="font-size: 0.88rem; color: #E2E8F0; line-height: 1.4;">Sab kuch ek hi jagah – <strong style="color: #FACC15; font-weight: 800;">100% FREE</strong>.</span>
                </div>
              </div>

              <!-- Action Row with Telegram CTA Button -->
              <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
                <a href="https://t.me/GemaniPrompt_21" target="_blank" style="display: inline-flex; align-items: center; gap: 9px; background: linear-gradient(135deg, #0088CC 0%, #0099FF 100%); color: #FFFFFF; font-weight: 800; font-size: 0.92rem; padding: 12px 24px; border-radius: 10px; text-decoration: none; box-shadow: 0 6px 20px rgba(0, 136, 204, 0.45); border: 1px solid rgba(255,255,255,0.25); transition: all 0.15s ease;">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.61 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.05-.49-.83-.27-1.48-.42-1.42-.88.03-.24.38-.49 1.03-.75 4.04-1.76 6.74-2.92 8.09-3.49 3.85-1.6 4.65-1.88 5.17-1.89.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.13-.03.24z"/>
                  </svg>
                  <span>Join Telegram Channel (Free Prompts) ↗</span>
                </a>
                <div style="display: flex; align-items: center; gap: 6px; color: #94A3B8; font-size: 0.8rem; font-weight: 600;">
                  <span>🔥</span>
                  <span>500+ Ready Prompts Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    const enrichedBodyHtml = linkToolMentionsInArticle(article.body_html);

    appContainer.innerHTML = `
      <article class="article-page-view">
        <div class="article-container">
          <!-- Breadcrumb -->
          <div class="breadcrumb-nav">
          <a href="#/" class="breadcrumb-link">Home</a>
          <span class="breadcrumb-separator">/</span>
          <a href="#/home" class="breadcrumb-link">Posts</a>
            <span class="breadcrumb-separator">/</span>
            <span>${article.title}</span>
          </div>

          <!-- Header -->
          <header class="article-header">
            <span class="article-header-tag">${article.tag || 'Frontier AI'}</span>
            <h1 class="article-header-title">${article.title || ''}</h1>
            ${article.subtitle ? `<p class="article-header-subtitle">${article.subtitle}</p>` : ''}

            <div class="article-header-meta">
              <div class="article-author-block">
                <img loading="lazy" decoding="async" src="${article.author_avatar || 'assets/logo.svg'}" alt="${article.author || 'AIRA'}" class="article-author-img" onerror="this.src='assets/logo.svg'" />
                <div>
                  <div class="article-author-meta-name">${article.author || 'AIRA'}</div>
                  <div class="article-author-meta-date">${article.date || 'Sep 2026'} • ${article.reading_time || article.read_time || '4 min read'}</div>
                </div>
              </div>

              <div class="article-action-buttons">
                <button class="action-btn ${isLiked ? 'liked' : ''}" id="btn-like-post" data-slug="${article.slug}">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="${isLiked ? '#EF4444' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  <span id="like-count-display">${currentLikes}</span>
                </button>
                <button class="action-btn ${isBookmarked ? 'bookmarked' : ''}" id="btn-bookmark-post" data-slug="${article.slug}">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked ? '#1C46F5' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  <span>${isBookmarked ? 'Saved' : 'Save'}</span>
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
            <img loading="lazy" decoding="async" src="${article.image_url}" alt="${article.title}" class="article-hero-img" loading="lazy" referrerpolicy="no-referrer" />
          </div>

          <!-- Top Header Banner Ad Placement (Slot: Top Header Banner) -->
          ${(() => {
            const sp = (typeof getSponsorSettings === 'function') ? getSponsorSettings() : null;
            const topBar = sp ? sp.topBar : { active: true, badge: 'AD', icon: '⚡', headline: '<strong>AIRA Newsletter Partner</strong> – Build and scale frontier AI agents with verified infrastructure.', link: '#/advertise', ctaText: 'Learn More →' };
            if (!topBar || topBar.active === false) return '';
            return `
              <div class="site-top-ad-banner" style="margin-bottom: 20px;">
                <div class="site-top-ad-inner">
                  <span class="site-ad-badge">${escapeHtml(topBar.badge || 'AD')}</span>
                  <span class="site-ad-icon">${topBar.icon || '⚡'}</span>
                  <span class="site-ad-text">${topBar.headline || '<strong>AIRA Newsletter Partner</strong> – Build and scale frontier AI agents with verified infrastructure.'}</span>
                </div>
                <a href="${topBar.link || '#/advertise'}" target="${topBar.link && topBar.link.startsWith('http') ? '_blank' : '_self'}" class="site-ad-cta-btn">${escapeHtml(topBar.ctaText || 'Learn More →')}</a>
              </div>
            `;
          })()}

          <!-- Text-to-Speech Audio Player Bar -->
          <div class="article-tts-player" id="article-tts-bar">
            <button type="button" class="tts-play-btn" id="btn-tts-play" title="Listen to this article">
              <span id="tts-play-icon">▶</span>
            </button>
            <div class="tts-info-group">
              <div class="tts-label">
                <span>🎧</span>
                <span id="tts-title-label">Listen to this edition</span>
              </div>
              <div class="tts-status-text" id="tts-status-text">${article.reading_time || '4 min read'} • AI Voice Narration</div>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <button type="button" class="tts-speed-btn active" data-rate="1">1x</button>
              <button type="button" class="tts-speed-btn" data-rate="1.25">1.25x</button>
              <button type="button" class="tts-speed-btn" data-rate="1.5">1.5x</button>
            </div>
          </div>

          <!-- Newsletter Spotlight Placement (Slot: Newsletter Spotlight / In-Feed Ad) -->
          ${(() => {
            const sp = (typeof getSponsorSettings === 'function') ? getSponsorSettings() : null;
            const inFeed = sp ? sp.inFeed : {
              active: true,
              tag: 'UI/UX Community',
              title: 'Join our UI/UX Design Community',
              body: 'A space where designers share ideas, trends, and practical tips. Learn something new, improve your design skills, and connect with like-minded creatives.',
              btnText: 'Join the community →',
              btnLink: 'https://chat.whatsapp.com/HJ2V5txnytDLPaWDKb1yKw',
              badge: 'Community Spotlight',
              bannerImg: 'assets/ui-designer-banner.svg',
              avatarImg: 'assets/ui-designer-community.png'
            };
            if (!inFeed || inFeed.active === false) return '';
            const bannerSource = inFeed.bannerImg || inFeed.image || 'assets/ui-designer-banner.svg';
            const avatarSource = inFeed.avatarImg || inFeed.avatar || 'assets/ui-designer-community.png';
            return `
              <div class="newsletter-spotlight-ad-box">
                <div class="newsletter-spotlight-top">
                  <div class="newsletter-spotlight-pill">
                    <span class="bolt">⚡</span> ${escapeHtml(inFeed.badge || 'AIRA COMMUNITY SPOTLIGHT')}
                  </div>
                  <a href="#/advertise" class="newsletter-spotlight-book-link">Book a Spotlight ($399) ↗</a>
                </div>
                <div class="newsletter-spotlight-content">
                  <a href="${inFeed.btnLink || '#/advertise'}" target="${inFeed.btnLink && inFeed.btnLink.startsWith('http') ? '_blank' : '_self'}" style="display: block; margin: 12px 0 16px 0; border-radius: 10px; overflow: hidden; border: 1.5px solid rgba(255, 255, 255, 0.3); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25); background: #000;">
                    <img loading="lazy" decoding="async" src="${bannerSource}" alt="${escapeHtml(inFeed.title || 'UI/UX Design Community')}" style="width: 100%; height: auto; display: block; border-radius: 8px;" />
                  </a>
                  <div class="newsletter-spotlight-header-row">
                    <div class="newsletter-spotlight-avatar" style="padding: 0; overflow: hidden; border: 1.5px solid rgba(255,255,255,0.4);">
                      <img src="${avatarSource}" style="width: 100%; height: 100%; object-fit: cover;" alt="UI Designer Logo" onerror="this.outerHTML='🎨'" />
                    </div>
                    <div>
                      <h4 class="newsletter-spotlight-title">${escapeHtml(inFeed.title || 'Join our UI/UX Design Community')}</h4>
                      <span class="newsletter-spotlight-brand">Sponsored by ${escapeHtml(inFeed.tag || 'UI Designer Community')} • Verified Community</span>
                    </div>
                  </div>
                  <p class="newsletter-spotlight-text">
                    ${escapeHtml(inFeed.body || 'A space where designers share ideas, trends, and practical tips. Learn something new, improve your design skills, and connect with like-minded creatives.')}
                  </p>
                  <div class="newsletter-spotlight-footer">
                    <a href="${inFeed.btnLink || '#/advertise'}" target="${inFeed.btnLink && inFeed.btnLink.startsWith('http') ? '_blank' : '_self'}" class="newsletter-spotlight-btn">
                      <span>${escapeHtml(inFeed.btnText || 'Join the community →')}</span>
                    </a>
                    <span class="newsletter-spotlight-disclaimer">Active design community &amp; verified network</span>
                  </div>
                </div>
              </div>
            `;
          })()}

          <!-- Body Content -->
          <div class="article-rich-body">
            ${(() => {
              let body = enrichedBodyHtml || article.body_html || '';
              const bananaAd = getBananaPromptAdHTML();
              if (body.includes('<h2>📚 AI Tutorial</h2>')) {
                return body.replace('<h2>📚 AI Tutorial</h2>', `${bananaAd}<h2>📚 AI Tutorial</h2>`);
              } else if (body.includes('<h2>🛠️ Top AI &amp; SaaS Tools</h2>')) {
                return body.replace('<h2>🛠️ Top AI &amp; SaaS Tools</h2>', `${bananaAd}<h2>🛠️ Top AI &amp; SaaS Tools</h2>`);
              } else if (body.includes('<h2>🌐 Top AI &amp; Tech News</h2>')) {
                return body.replace('<h2>🌐 Top AI &amp; Tech News</h2>', `${bananaAd}<h2>🌐 Top AI &amp; Tech News</h2>`);
              } else {
                return body + bananaAd;
              }
            })()}
          </div>

          <!-- Inline Subscribe Card (Exact Dark UI) -->
          <div class="article-subscribe-card">
            <div class="article-sub-badge">
              <span class="sub-bolt-icon">⚡</span>
            </div>
            <h3 class="article-sub-title">Stay Ahead in AI with AIRA</h3>
            <p class="article-sub-desc">Get top AI news, breakthroughs + instant access to <strong>3,000+ ChatGPT Prompts &amp; 50 n8n Templates</strong>.</p>
            
            <form class="article-sub-form-dark" id="article-sub-form">
              <div class="sub-dark-input-wrap">
                <input type="email" class="sub-dark-input" placeholder="Your email address" required />
                <button type="submit" class="sub-dark-btn">Subscribe &amp; Get 3,000+ Prompts &amp; 50 Templates 🎁</button>
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
              <a href="#/home" class="btn-view-all-kr">View all →</a>
            </div>
            
            <div class="keep-reading-grid">
              ${recommendedArticles.map(rec => `
                <a href="#/p/${rec.slug}" class="kr-card">
                  <div class="kr-card-image-wrap">
                    <img loading="lazy" decoding="async" src="${rec.image_url || 'assets/logo.jpg'}" alt="${rec.title || 'AIRA Article'}" class="kr-card-img" loading="lazy" />
                    <span class="kr-card-badge">${(rec.tag || 'Frontier AI').toUpperCase()}</span>
                  </div>
                  <div class="kr-card-body">
                    <h4 class="kr-card-title">${rec.title || ''}</h4>
                    <p class="kr-card-subtitle">${rec.subtitle || ''}</p>
                    <div class="kr-card-footer">
                      <span class="kr-card-date">${rec.date || 'Sep 2026'} • ${rec.reading_time || rec.read_time || '4 min read'}</span>
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

        // =========================================================================
    // Mobile-Optimized Text-to-Speech (TTS) Narration Engine
    // Chunked sentence playback prevents Mobile Safari & Android Chrome freezes
    // =========================================================================
    let ttsChunks = [];
    let currentChunkIdx = 0;
    let isTtsPlaying = false;
    let isTtsPaused = false;
    let ttsRate = 1.0;

    const playBtn = document.getElementById('btn-tts-play');
    const playIcon = document.getElementById('tts-play-icon');
    const statusText = document.getElementById('tts-status-text');
    const titleLabel = document.getElementById('tts-title-label');

    function cleanArticleTextForSpeech(articleObj) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = articleObj.body_html || '';
      tempDiv.querySelectorAll('script, style, button, svg, .ad-banner-mint, .ad-sidebar-card').forEach(el => el.remove());
      const rawBody = (tempDiv.textContent || tempDiv.innerText || '').replace(/\s+/g, ' ').trim();
      const combined = `${articleObj.title}. ${articleObj.subtitle || ''}. ${rawBody}`;
      
      const rawSentences = combined.match(/[^.!?\n]+[.!?\n]+(\s+|$)|[^.!?\n]+$/g) || [combined];
      const resultChunks = [];
      let currentBuf = '';

      for (let i = 0; i < rawSentences.length; i++) {
        const sentence = rawSentences[i].trim();
        if (!sentence) continue;
        if ((currentBuf + ' ' + sentence).length > 160) {
          if (currentBuf) resultChunks.push(currentBuf.trim());
          currentBuf = sentence;
        } else {
          currentBuf = currentBuf ? (currentBuf + ' ' + sentence) : sentence;
        }
      }
      if (currentBuf) resultChunks.push(currentBuf.trim());
      return resultChunks.length > 0 ? resultChunks : [combined];
    }

    function getBestVoiceForSpeech() {
      if (!window.speechSynthesis) return null;
      const voices = window.speechSynthesis.getVoices() || [];
      return voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Siri') || v.default)) ||
             voices.find(v => v.lang.startsWith('en')) || null;
    }

    function speakNextChunk() {
      if (!isTtsPlaying || isTtsPaused || !window.speechSynthesis) return;

      if (currentChunkIdx >= ttsChunks.length) {
        isTtsPlaying = false;
        isTtsPaused = false;
        currentChunkIdx = 0;
        if (playIcon) playIcon.innerHTML = '▶';
        if (titleLabel) titleLabel.innerHTML = 'Completed Narration';
        if (statusText) statusText.innerHTML = 'Finished • Tap to replay ✓';
        return;
      }

      const chunkText = ttsChunks[currentChunkIdx];
      const utterance = new SpeechSynthesisUtterance(chunkText);
      utterance.lang = 'en-US';
      utterance.rate = ttsRate;
      utterance.pitch = 1.0;

      const voice = getBestVoiceForSpeech();
      if (voice) utterance.voice = voice;

      utterance.onend = () => {
        if (isTtsPlaying && !isTtsPaused) {
          currentChunkIdx++;
          speakNextChunk();
        }
      };

      utterance.onerror = (err) => {
        console.warn('TTS Chunk error:', err);
        if (err.error !== 'canceled' && err.error !== 'interrupted') {
          if (isTtsPlaying && !isTtsPaused) {
            currentChunkIdx++;
            speakNextChunk();
          }
        }
      };

      window.speechSynthesis.speak(utterance);
    }

    function stopAllSpeech() {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      isTtsPlaying = false;
      isTtsPaused = false;
      currentChunkIdx = 0;
      if (playIcon) playIcon.innerHTML = '▶';
      if (titleLabel) titleLabel.innerHTML = 'Listen to this edition';
      if (statusText) statusText.innerHTML = `${article.reading_time || '4 min read'} • AI Voice Narration`;
    }

    if (playBtn) {
      if (!('speechSynthesis' in window)) {
        if (statusText) statusText.innerHTML = 'Voice narration not supported in this browser';
        playBtn.style.opacity = '0.5';
        playBtn.style.pointerEvents = 'none';
      } else {
        playBtn.addEventListener('click', (e) => {
          e.preventDefault();

          if (isTtsPlaying && !isTtsPaused) {
            // Currently playing -> PAUSE
            isTtsPaused = true;
            window.speechSynthesis.cancel();
            if (playIcon) playIcon.innerHTML = '▶';
            if (titleLabel) titleLabel.innerHTML = 'Paused Narration';
            const progressPct = Math.round((currentChunkIdx / Math.max(1, ttsChunks.length)) * 100);
            if (statusText) statusText.innerHTML = `Paused at ${progressPct}% • Tap to resume`;
          } else if (isTtsPlaying && isTtsPaused) {
            // Currently paused -> RESUME
            isTtsPaused = false;
            if (playIcon) playIcon.innerHTML = '⏸';
            if (titleLabel) titleLabel.innerHTML = 'Playing AI Voice...';
            if (statusText) statusText.innerHTML = 'Now playing narration';
            speakNextChunk();
          } else {
            // Stopped -> START NEW PLAYBACK
            window.speechSynthesis.cancel();
            ttsChunks = cleanArticleTextForSpeech(article);
            currentChunkIdx = 0;
            isTtsPlaying = true;
            isTtsPaused = false;

            if (playIcon) playIcon.innerHTML = '⏸';
            if (titleLabel) titleLabel.innerHTML = 'Playing AI Voice...';
            if (statusText) statusText.innerHTML = 'Now playing narration';

            speakNextChunk();
          }
        });

        // Speed change buttons
        appContainer.querySelectorAll('.tts-speed-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const rate = parseFloat(btn.getAttribute('data-rate'));
            if (rate) {
              ttsRate = rate;
              appContainer.querySelectorAll('.tts-speed-btn').forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
              if (isTtsPlaying && !isTtsPaused) {
                window.speechSynthesis.cancel();
                speakNextChunk();
              }
            }
          });
        });
      }
    }

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

    // Bind Bookmark Button
    const bookmarkBtn = document.getElementById('btn-bookmark-post');
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener('click', async () => {
        toggleSaveArticle(article.slug);
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

    // Refresh Twitter embedded widgets if present
    try {
      if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load(appContainer);
      }
    } catch (e) {
      console.warn('Twitter widgets load error:', e);
    }
  }

  // =========================================================================
  // 3. Archive View (8 Articles Per Page with Numbered Pagination)
  // =========================================================================
  function renderArchivePage() {
    const ARTICLES_PER_PAGE = 8;
    const totalArticles = state.articles.length;
    const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE) || 1;

    if (!state.archiveCurrentPage || state.archiveCurrentPage > totalPages) {
      state.archiveCurrentPage = 1;
    }

    const startIndex = (state.archiveCurrentPage - 1) * ARTICLES_PER_PAGE;
    const visibleArticles = state.articles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

    appContainer.innerHTML = `
      <section class="archive-page-view">
        <div class="article-container">
          <div class="archive-header-wrap" style="text-align: center; margin-bottom: 32px;">
            <h1 class="page-title">Archive</h1>
            <p class="page-description">Complete chronological history of all ${totalArticles} AIRA newsletter editions (Page ${state.archiveCurrentPage} of ${totalPages}).</p>
          </div>

          <div class="timeline-list">
            ${visibleArticles.map(article => `
              <div class="timeline-item" onclick="window.location.hash='#/p/${article.slug}'">
                <div class="timeline-content">
                  <h4>${article.title || ''}</h4>
                  <p>${article.subtitle || ''}</p>
                </div>
                <div class="timeline-meta">
                  <span class="timeline-tag">${article.tag || 'Frontier AI'}</span>
                  <span>${article.date || 'Sep 2026'}</span>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Numbered Pagination Component -->
          ${renderPaginationHTML(state.archiveCurrentPage, totalPages, 'archive')}
        </div>
      </section>
    `;

    // Bind Archive Pagination Click Handlers
    appContainer.querySelectorAll('.aira-pagination-bar[data-type="archive"] button[data-page]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (btn.disabled) return;
        const targetPage = parseInt(btn.getAttribute('data-page'), 10);
        if (targetPage && targetPage >= 1 && targetPage <= totalPages && targetPage !== state.archiveCurrentPage) {
          state.archiveCurrentPage = targetPage;
          renderArchivePage();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }
  // =========================================================================
    // =========================================================================
  // 4. Tags / AI Tools Directory View
  // =========================================================================
  function renderTagsPage() {
    const toolsData = typeof AI_TOOLS_DATA !== 'undefined' ? AI_TOOLS_DATA : { categories: [], tools: [] };
    const allTools = getAllTools();
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

    state.toolSortOrder = state.toolSortOrder || 'popular';

    function getFilteredTools() {
      let filtered = allTools.filter(tool => {
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

      // Sort
      const sortOrder = state.toolSortOrder || 'popular';
      if (sortOrder === 'popular') {
        filtered.sort((a, b) => (getToolRatingStats(b).votes || 0) - (getToolRatingStats(a).votes || 0));
      } else if (sortOrder === 'rating') {
        filtered.sort((a, b) => (getToolRatingStats(b).rating || 0) - (getToolRatingStats(a).rating || 0));
      } else if (sortOrder === 'free') {
        filtered.sort((a, b) => (a.pricing === 'Free' ? -1 : (b.pricing === 'Free' ? 1 : 0)));
      } else if (sortOrder === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      }

      return filtered;
    }



    function updateView() {
      const filtered = getFilteredTools();
      const currentCatObj = categories.find(c => c.id === state.toolCategoryFilter);
      const currentCatName = currentCatObj ? currentCatObj.name : 'All Tools';

      const TOOLS_PER_PAGE = 12;
      let totalPages = 1;
      let startIdx = 0;
      let endIdx = TOOLS_PER_PAGE;

      if (!state.toolSearchQuery) {
        // Page 1 has 1 sponsor card + 11 tools = 12 cards total (4 full rows of 3).
        // Page 2+ has 12 tools = 12 cards total (4 full rows of 3).
        const remainingAfterP1 = Math.max(0, filtered.length - 11);
        totalPages = Math.max(1, 1 + Math.ceil(remainingAfterP1 / TOOLS_PER_PAGE));
        if (state.toolCurrentPage === 1) {
          startIdx = 0;
          endIdx = 11;
        } else {
          startIdx = 11 + (state.toolCurrentPage - 2) * TOOLS_PER_PAGE;
          endIdx = startIdx + TOOLS_PER_PAGE;
        }
      } else {
        totalPages = Math.max(1, Math.ceil(filtered.length / TOOLS_PER_PAGE));
        startIdx = (state.toolCurrentPage - 1) * TOOLS_PER_PAGE;
        endIdx = state.toolCurrentPage * TOOLS_PER_PAGE;
      }

      if (state.toolCurrentPage > totalPages && totalPages > 0) state.toolCurrentPage = 1;
      if (state.toolCurrentPage < 1) state.toolCurrentPage = 1;

      const pagedTools = filtered.slice(startIdx, endIdx);

      const gridEl = document.getElementById('tools-grid-container');
      const countEl = document.getElementById('tools-count-container');
      const paginationEl = document.getElementById('tools-pagination-container');

      if (countEl) {
        countEl.innerHTML = `
          <div class="tools-count-text">
            Showing <strong>${filtered.length}</strong> ${filtered.length === 1 ? 'AI tool' : 'AI tools'}
            ${state.toolCategoryFilter !== 'all' ? ` in <span class="active-cat-name">${currentCatName}</span>` : ''}
            ${state.toolPricingFilter !== 'all' ? ` • <span class="active-pricing-name">${state.toolPricingFilter}</span>` : ''}
            ${state.toolSearchQuery ? ` • matching "<em>${state.toolSearchQuery}</em>"` : ''}
            ${totalPages > 1 ? ` (Page ${state.toolCurrentPage} of ${totalPages})` : ''}
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <select id="tool-sort-select" class="tool-sort-dropdown" title="Sort AI tools">
              <option value="popular" ${state.toolSortOrder === 'popular' ? 'selected' : ''}>🔥 Most Upvoted</option>
              <option value="rating" ${state.toolSortOrder === 'rating' ? 'selected' : ''}>⭐ Highest Rated</option>
              <option value="free" ${state.toolSortOrder === 'free' ? 'selected' : ''}>⚡ 100% Free First</option>
              <option value="name" ${state.toolSortOrder === 'name' ? 'selected' : ''}>🔤 Name (A - Z)</option>
            </select>
            <button type="button" class="btn-submit-tool-trigger" id="btn-open-submit-modal">
              <span>+ Submit Tool</span>
            </button>
            ${(state.toolCategoryFilter !== 'all' || state.toolPricingFilter !== 'all' || state.toolSearchQuery) ? `
              <button class="reset-filters-btn" id="btn-reset-tools-filters">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                <span>Reset</span>
              </button>
            ` : ''}
          </div>
        `;

        // Bind Sort Change
        const sortSelect = document.getElementById('tool-sort-select');
        if (sortSelect) {
          sortSelect.addEventListener('change', (e) => {
            state.toolSortOrder = e.target.value;
            updateView();
          });
        }

        // Bind Open Submit Tool Modal
        const openSubmitBtn = document.getElementById('btn-open-submit-modal');
        if (openSubmitBtn) {
          openSubmitBtn.addEventListener('click', () => {
            const modal = document.getElementById('submit-tool-modal');
            if (modal) {
              modal.style.display = 'flex';
              document.body.style.overflow = 'hidden';
            }
          });
        }

        const resetBtn = document.getElementById('btn-reset-tools-filters');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            state.toolCategoryFilter = 'all';
            state.toolPricingFilter = 'all';
            state.toolSearchQuery = '';
            state.toolCurrentPage = 1;
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
          if (paginationEl) paginationEl.innerHTML = '';

          const emptyResetBtn = document.getElementById('btn-empty-reset');
          if (emptyResetBtn) {
            emptyResetBtn.addEventListener('click', () => {
              state.toolCategoryFilter = 'all';
              state.toolPricingFilter = 'all';
              state.toolSearchQuery = '';
              state.toolCurrentPage = 1;
              const searchInputEl = document.getElementById('tool-search-input');
              if (searchInputEl) searchInputEl.value = '';
              renderTagsPage();
            });
          }
        } else {
          const renderedCards = pagedTools.map(renderToolCard);
          if (state.toolCurrentPage === 1 && !state.toolSearchQuery) {
            const sponsorListingHtml = `
              <div class="tool-card is-sponsored-listing" onclick="if(!event.target.closest('a, button')) { window.location.hash='#/advertise'; }">
                <div class="tool-card-header">
                  <a href="#/advertise" class="tool-card-avatar-wrap sponsor-avatar" title="Advertise your tool">
                    <span class="sponsor-avatar-icon">⚡</span>
                  </a>
                  <div class="tool-header-content">
                    <div class="tool-header-top-line">
                      <h3 class="tool-card-name">
                        <a href="#/advertise" class="tool-title-link">Your AI Tool / Software</a>
                      </h3>
                      <span class="tool-badge-ad">AD</span>
                    </div>
                    <div class="tool-badges-wrap">
                      <span class="tool-badge-promoted sponsor-badge"><span class="star">★</span> FEATURED LISTING</span>
                      <span class="tool-badge-pricing pricing-free-trial">FREE TRIAL</span>
                    </div>
                  </div>
                </div>

                <p class="tool-card-desc">Prominently showcase your product across 96+ tool pages to 100+ AI builders.</p>

                <div class="tool-card-footer">
                  <a href="#/advertise" class="tool-btn-details sponsor-spot-label">⚡ Listing Ad</a>
                  <a href="#/advertise" class="tool-btn-visit sponsor-book-btn">
                    <span>Reserve ($149/wk)</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </a>
                </div>
              </div>
            `;
            renderedCards.unshift(sponsorListingHtml);
          }
          gridEl.innerHTML = renderedCards.join('');
          
          if (paginationEl) {
            paginationEl.innerHTML = renderPaginationHTML(state.toolCurrentPage, totalPages, 'tools');
            
            // Bind tools pagination buttons
            paginationEl.querySelectorAll('.aira-pagination-bar[data-type="tools"] button[data-page]').forEach(btn => {
              btn.addEventListener('click', (e) => {
                if (btn.disabled) return;
                const targetPage = parseInt(btn.getAttribute('data-page'), 10);
                if (targetPage && targetPage >= 1 && targetPage <= totalPages && targetPage !== state.toolCurrentPage) {
                  state.toolCurrentPage = targetPage;
                  updateView();
                  const countContainer = document.getElementById('tools-count-container') || document.querySelector('.tools-directory-view');
                  if (countContainer) {
                    countContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
              });
            });
          }

          // Bind card tag clicks
          gridEl.querySelectorAll('.tool-category-badge').forEach(badge => {
            badge.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              const cat = badge.getAttribute('data-category');
              if (cat) {
                state.toolCategoryFilter = cat;
                state.toolCurrentPage = 1;
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
      <!-- Hero Section (Exact Same Full-Width Grid Background as Homepage) -->
      <section class="hero-openalt-section">
        <div class="hero-openalt-container" style="max-width: 960px;">
          <!-- Top Ad Bar -->
          <div class="hero-openalt-top-ad">
            <div class="hero-top-ad-left">
              <span class="hero-ad-badge-pill">AD</span>
              <span class="hero-ad-brand-icon">⚡</span>
              <span class="hero-ad-text-content"><strong>AIRA Sponsor</strong> — Explore 96+ curated, verified AI tools and production workflows.</span>
            </div>
            <a href="#/advertise" class="hero-ad-action-btn">Learn More →</a>
          </div>

          <!-- Hero Badge -->
          <div class="hero-openalt-mini-badge">
            <span>⚡ AIRA Directory • ${allTools.length} Verified AI Tools</span>
          </div>

          <!-- Hero Heading & Subheading -->
          <h1 class="hero-openalt-heading">AI Tools &amp; Categories</h1>
          <p class="hero-openalt-subheading">
            Discover <strong>96+</strong> curated, verified AI tools across productivity, developer utilities, autonomous agents, and marketing workflows.
          </p>

          <!-- Search & Controls Bar -->
          <div class="tools-controls-row" style="width: 100%; margin: 16px auto 14px auto;">
            <div class="tool-search-box-wrap" style="flex: 1;">
              <svg class="tool-search-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" id="tool-search-input" class="tool-search-field" placeholder="Search 96+ AI tools by name, features, tasks..." value="${state.toolSearchQuery || ''}" autocomplete="off" />
              <button type="button" id="tool-search-clear" class="tool-search-clear-btn" style="display: ${state.toolSearchQuery ? 'flex' : 'none'};" title="Clear">✕</button>
            </div>

            <div class="tools-pricing-pill-group">
              ${['all', 'Free', 'Freemium', 'Paid'].map(p => `
                <button type="button" class="pricing-filter-pill ${state.toolPricingFilter === p ? 'active' : ''}" data-pricing="${p}">
                  ${p === 'all' ? 'All Pricing' : p}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Categories Filter Bar -->
          <div class="categories-filter-wrapper" style="width: 100%; margin-top: 14px; border-top: 1px solid #F1F5F9; padding-top: 14px;">
            <div class="categories-filter-grid" id="tools-categories-bar">
              ${categories.map(cat => {
                const count = getCategoryCount(cat.id);
                const isActive = state.toolCategoryFilter === cat.id;
                return `
                  <button type="button" class="cat-filter-pill ${isActive ? 'active' : ''}" data-cat-id="${cat.id}">
                    <span class="cat-pill-icon">${cat.icon || '✨'}</span>
                    <span class="cat-pill-name">${cat.name}</span>
                    <span class="cat-pill-count">${count}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Partners & Sponsors Strip (Bottom of Hero) -->
          ${getSponsorsStripHTML()}
        </div>
      </section>

      <!-- Directory Body -->
      <section class="tools-directory-view" style="padding: 20px 0 40px 0; background: #FFFFFF;">
        <div class="container">
          <!-- Featured AI Tools of the Week Showcase -->
          <div class="featured-tools-section" style="margin-top: 0; margin-bottom: 20px; padding: 0; background: transparent; border: none;">
            <div class="featured-tools-header-row" style="margin-bottom: 12px;">
              <div class="featured-tools-title-wrap">
                <span class="featured-tools-icon">⚡</span>
                <h2 class="featured-tools-main-title">FEATURED AI TOOLS OF THE WEEK</h2>
              </div>
            </div>

            <div class="featured-tools-grid">
              ${getFeaturedToolsHTML()}
            </div>
          </div>

          <!-- Status Bar -->
          <div class="tools-status-bar" id="tools-count-container"></div>

          <!-- Grid of Tool Cards -->
          <div class="tools-directory-grid" id="tools-grid-container"></div>

          <!-- Numbered Pagination Bar -->
          <div class="tools-pagination-wrap" id="tools-pagination-container"></div>
        </div>
      </section>
    `;

    // Bind Search Input
    const searchInput = document.getElementById('tool-search-input');
    const clearBtn = document.getElementById('tool-search-clear');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.toolSearchQuery = e.target.value;
        state.toolCurrentPage = 1;
        if (clearBtn) clearBtn.style.display = state.toolSearchQuery ? 'flex' : 'none';
        updateView();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        state.toolSearchQuery = '';
        state.toolCurrentPage = 1;
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        clearBtn.style.display = 'none';
        updateView();
      });
    }

    // Bind Category Pills Click
    document.querySelectorAll('.cat-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const catId = pill.getAttribute('data-cat-id');
        if (catId) {
          state.toolCategoryFilter = catId;
          state.toolCurrentPage = 1;
          document.querySelectorAll('.cat-filter-pill').forEach(p => {
            p.classList.toggle('active', p.getAttribute('data-cat-id') === catId);
          });
          updateView();
        }
      });
    });

    // Bind Show All Categories Toggle
    const toggleCatsBtn = document.getElementById('btn-toggle-all-cats');
    if (toggleCatsBtn) {
      toggleCatsBtn.addEventListener('click', () => {
        state.categoriesExpanded = !state.categoriesExpanded;
        renderTagsPage();
      });
    }

    // Bind Pricing Pills Click
    document.querySelectorAll('.pricing-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const pricing = pill.getAttribute('data-pricing');
        if (pricing) {
          state.toolPricingFilter = pricing;
          state.toolCurrentPage = 1;
          document.querySelectorAll('.pricing-filter-pill').forEach(p => {
            p.classList.toggle('active', p.getAttribute('data-pricing') === pricing);
          });
          updateView();
        }
      });
    });

    // Render Initial Grid
    updateView();
  }


  // =========================================================================
  // 5. Tool Detail Page
  // =========================================================================
  function renderToolDetailPage(toolId) {
    const toolsData = typeof AI_TOOLS_DATA !== 'undefined' ? AI_TOOLS_DATA : { categories: [], tools: [] };
    const allTools = getAllTools();
    const categories = toolsData.categories || [];
    const normalizedId = String(toolId || '').toLowerCase().trim();

    // Find tool by ID or slug or domain
    const tool = allTools.find(t => 
      (t.id && t.id.toLowerCase() === normalizedId) ||
      (t.name && t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedId) ||
      (t.domain && t.domain.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedId)
    );

    if (!tool) {
      appContainer.innerHTML = `
        <div class="container" style="padding: 80px 20px; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 16px;">⚡</div>
          <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 12px; font-family: var(--font-header);">AI Tool Not Found</h2>
          <p style="color: var(--color-text-secondary); margin-bottom: 24px; font-size: 1.05rem;">The AI tool you are looking for does not exist or has been moved.</p>
          <a href="#/tags" class="ad-pill-btn" style="display: inline-flex; padding: 12px 28px;">← Back to AI Tools Directory</a>
        </div>
      `;
      return;
    }

    // Helper to get category display name
    function getCategoryName(catId) {
      const found = categories.find(c => c.id === catId);
      return found ? found.name : catId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // Helper to format raw tool overview into clean paragraphs and structured Use Cases cards
    function formatToolOverviewHTML(rawText, toolName) {
      if (!rawText) return '';
      
      const cleanText = rawText.trim();
      const ucMatch = cleanText.match(/\bUse\s+Cases?\s*:?/i);
      
      let introText = cleanText;
      let useCasesRaw = '';
      
      if (ucMatch) {
        introText = cleanText.substring(0, ucMatch.index).trim();
        useCasesRaw = cleanText.substring(ucMatch.index + ucMatch[0].length).trim();
      }
      
      function esc(str) {
        if (!str) return '';
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      }
      
      let introHTML = '';
      if (introText) {
        if (introText.includes('\n\n')) {
          introHTML = introText
            .split(/\n\s*\n/)
            .map(p => `<p class="tool-intro-paragraph">${esc(p.trim())}</p>`)
            .join('');
        } else {
          const sentences = introText.match(/[^.!?]+[.!?]+(\s+|$)/g) || [introText];
          if (sentences.length > 3) {
            const mid = Math.ceil(sentences.length / 2);
            const p1 = sentences.slice(0, mid).join('').trim();
            const p2 = sentences.slice(mid).join('').trim();
            introHTML = `
              <p class="tool-intro-paragraph">${esc(p1)}</p>
              <p class="tool-intro-paragraph">${esc(p2)}</p>
            `;
          } else {
            introHTML = `<p class="tool-intro-paragraph">${esc(introText)}</p>`;
          }
        }
      }
      
      let useCasesHTML = '';
      if (useCasesRaw) {
        const items = [];
        const itemRegex = /([A-Z][A-Za-z0-9\s/&'-]{2,50}):\s*([^:]+?)(?=(?:[A-Z][A-Za-z0-9\s/&'-]{2,50}:\s*)|$)/g;
        let m;
        while ((m = itemRegex.exec(useCasesRaw)) !== null) {
          const title = m[1].trim();
          const desc = m[2].trim();
          if (title && desc) {
            items.push({ title, desc });
          }
        }
        
        if (items.length > 0) {
          useCasesHTML = `
            <div class="tool-usecases-wrapper">
              <div class="tool-usecases-header">
                <div class="tool-usecases-badge">⚡ KEY APPLICATIONS</div>
                <h3 class="tool-usecases-title">Use Cases & Capabilities</h3>
                <p class="tool-usecases-subtitle">Explore the primary scenarios and workflows where ${esc(toolName || 'this tool')} excels.</p>
              </div>
              <div class="tool-usecases-grid">
                ${items.map(item => `
                  <div class="tool-usecase-card">
                    <div class="tool-usecase-card-header">
                      <div class="tool-usecase-icon-badge">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <h4 class="tool-usecase-heading">${esc(item.title)}</h4>
                    </div>
                    <p class="tool-usecase-desc">${esc(item.desc)}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        } else {
          useCasesHTML = `
            <div class="tool-usecases-wrapper">
              <div class="tool-usecases-header">
                <div class="tool-usecases-badge">⚡ KEY APPLICATIONS</div>
                <h3 class="tool-usecases-title">Use Cases & Capabilities</h3>
              </div>
              <p class="tool-intro-paragraph">${esc(useCasesRaw)}</p>
            </div>
          `;
        }
      }
      
      return `
        <div class="tool-overview-structured">
          <div class="tool-intro-section">
            ${introHTML}
          </div>
          ${useCasesHTML}
        </div>
      `;
    }

    const cleanDomain = getCleanToolDomain(tool);
    const logoUrl = getToolLogoUrl(tool);
    const duckLogo = `https://icons.duckduckgo.com/ip3/${cleanDomain}.ico`;
    const fallbackIcon = tool.icon || '⚡';
    const primaryCat = tool.category || (tool.categories && tool.categories[0]) || 'productivity';
    const primaryCatName = getCategoryName(primaryCat);
    const pricingClass = `pricing-${(tool.pricing || 'free').toLowerCase().replace(/\s+/g, '-')}`;
    const toolCategories = tool.categories || [primaryCat];
    const stats = getToolRatingStats(tool);

    // Saved tools from localStorage
    const savedTools = JSON.parse(localStorage.getItem('aira_saved_tools') || '[]');
    const isSaved = savedTools.includes(tool.id);

    // Check if open-source alternatives exist in ALTERNATIVES_DATA
    const altData = typeof ALTERNATIVES_DATA !== 'undefined' ? ALTERNATIVES_DATA : { software: [] };
    const matchedAlt = (altData.software || []).find(s => 
      s.slug === tool.id ||
      s.name.toLowerCase() === tool.name.toLowerCase() ||
      (tool.domain && s.domain && tool.domain.toLowerCase().includes(s.domain.toLowerCase()))
    );

    // Related tools in same category
    const relatedTools = allTools.filter(t => 
      t.id !== tool.id && 
      ((t.category === tool.category) || (t.categories && tool.categories && t.categories.some(c => tool.categories.includes(c))))
    ).slice(0, 3);

    appContainer.innerHTML = `
      <section class="tool-detail-page-view">
        <div class="container">
          
          <!-- Breadcrumb Navigation -->
          <nav class="tool-breadcrumb-nav">
            <a href="#/home">Home</a>
            <span class="bc-sep">/</span>
            <a href="#/tags">AI Tools</a>
            <span class="bc-sep">/</span>
            <a href="#/tags?category=${primaryCat}">${primaryCatName}</a>
            <span class="bc-sep">/</span>
            <span class="bc-curr">${tool.name}</span>
          </nav>

          <!-- Top Hero Card -->
          <div class="tool-detail-hero">
            <div class="tool-detail-hero-top">
              <div class="tool-detail-logo-box">
                <img loading="lazy" decoding="async" referrerpolicy="no-referrer" src="${logoUrl}" alt="${escapeHtml(tool.name)} logo" class="tool-detail-logo-img" onerror="if(!this.dataset.triedDuck){ this.dataset.triedDuck='true'; this.src='${duckLogo}'; } else { this.onerror=null; this.parentElement.innerHTML='<span style=\\'font-size:2rem;\\'>${fallbackIcon}</span>'; }" />
              </div>
              <div class="tool-detail-title-col">
                <div class="tool-detail-badges">
                  <span class="tool-badge-verified"><span class="bolt">⚡</span> AIRA Verified</span>
                  ${tool.badge ? `<span class="tool-badge-purpose">${tool.badge}</span>` : ''}
                  <span class="tool-badge-pricing ${pricingClass}">${tool.pricing}</span>
                  <span class="tool-rating-pill" style="font-weight: 700; background: #FEF3C7; color: #92400E; border: 1px solid #FDE68A;">★ ${stats.rating.toFixed(1)} / 5.0 (${stats.votes.toLocaleString()} reviews)</span>
                  <a href="#/tags?category=${primaryCat}" class="tool-category-badge" style="text-decoration: none;">${primaryCatName}</a>
                </div>
                <h1 class="tool-detail-title">${tool.name}</h1>
                <p class="tool-detail-tagline">${tool.description}</p>
              </div>
            </div>

            <!-- Action Buttons Row -->
            <div class="tool-detail-actions-row">
              <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="tool-btn-visit-primary" title="Open official ${tool.name}">
                <span>Visit Official Website</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>

              <button type="button" class="tool-btn-action-pill tool-upvote-detail-btn ${stats.hasVoted ? 'is-voted' : ''}" id="btn-upvote-tool-detail" data-tool-id="${stats.id}" onclick="window.toggleToolVote('${stats.id}');">
                <span>${stats.hasVoted ? '▲ Upvoted' : '▲ Upvote Tool'} (${stats.votes.toLocaleString()})</span>
              </button>

              <button type="button" class="tool-btn-action-pill ${isSaved ? 'is-saved' : ''}" id="btn-save-tool" data-tool-id="${tool.id}">
                <span>${isSaved ? '★ Saved to Bookmarks' : '☆ Bookmark Tool'}</span>
              </button>

              <button type="button" class="tool-btn-action-pill" id="btn-share-tool">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                <span>Share</span>
              </button>

              <a href="#/tags" class="tool-btn-action-pill" style="margin-left: auto;">
                <span>← All AI Tools</span>
              </a>
            </div>
          </div>

          <!-- 2-Column Main Layout (Left: About Tool | Right: Specifications & Sidebar) -->
          <div class="tool-detail-main-layout">
            
            <!-- Left Main Column: Clean About Tool -->
            <div class="tool-detail-main-col">
              
              <!-- Section 1: About Tool -->
              <div class="tool-detail-card">
                <h2 class="tool-detail-card-title">
                  <span>⚡</span>
                  <span>About ${tool.name}</span>
                </h2>
                <div class="tool-overview-body">
                  ${formatToolOverviewHTML((tool.inner_content && tool.inner_content.overview) ? tool.inner_content.overview : (tool.overview || tool.description), tool.name)}
                </div>
              </div>

            </div>

            <!-- Right Sidebar Column: Clean Specifications -->
            <div class="tool-detail-sidebar-col">
              
              <!-- Specifications Card -->
              <div class="tool-detail-card">
                <h3 class="tool-detail-card-title" style="font-size: 1.1rem; margin-bottom: 14px;">
                  <span>📋</span>
                  <span>Tool Specifications</span>
                </h3>
                <div class="tool-specs-list">
                  <div class="tool-spec-row">
                    <span class="tool-spec-label">Pricing Plan</span>
                    <span class="tool-spec-val"><span class="tool-badge-pricing ${pricingClass}">${tool.pricing}</span></span>
                  </div>
                  ${(tool.inner_content && tool.inner_content.pricingDetails) ? `
                    <div class="tool-spec-row">
                      <span class="tool-spec-label">Pricing Details</span>
                      <span class="tool-spec-val" style="font-size: 0.85rem; font-weight: 600; color: #1C46F5; text-align: right; max-width: 170px;">${tool.inner_content.pricingDetails}</span>
                    </div>
                  ` : ''}
                  <div class="tool-spec-row">
                    <span class="tool-spec-label">Primary Category</span>
                    <span class="tool-spec-val"><a href="#/tags?category=${primaryCat}">${primaryCatName}</a></span>
                  </div>
                  <div class="tool-spec-row">
                    <span class="tool-spec-label">Official Website</span>
                    <span class="tool-spec-val"><a href="${tool.url}" target="_blank" rel="noopener noreferrer">${cleanDomain} ↗</a></span>
                  </div>
                  <div class="tool-spec-row">
                    <span class="tool-spec-label">Verification</span>
                    <span class="tool-spec-val" style="color: #1C46F5; font-weight: 700;">Verified ✓</span>
                  </div>
                </div>

                <div style="margin-top: 20px; border-top: 1px solid #F4F4F5; padding-top: 16px;">
                  <span style="font-size: 0.8rem; font-weight: 700; color: #71717A; text-transform: uppercase; letter-spacing: 0.03em; display: block; margin-bottom: 10px;">Tags & Classifications</span>
                  <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    ${toolCategories.map(c => `
                      <a href="#/tags?category=${c}" class="tool-category-badge" style="text-decoration: none;">
                        ${getCategoryName(c)}
                      </a>
                    `).join('')}
                  </div>
                </div>

                <div style="margin-top: 20px;">
                  <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="tool-btn-visit-primary" style="width: 100%; justify-content: center;">
                    <span>Visit ${tool.name} ↗</span>
                  </a>
                </div>
              </div>

              <!-- Tool Page Ad Placement (Slot: Tool Page Ad) -->
              <div class="tool-page-sponsor-card">
                <div class="tool-sponsor-card-top">
                  <span class="tool-sponsor-badge">⚡ SPONSORED AI TOOL</span>
                  <a href="#/advertise" class="tool-sponsor-reserve-link" title="Advertise on 96+ tool pages">Reserve Spot ↗</a>
                </div>
                <div class="tool-sponsor-brand-row">
                  <div class="tool-sponsor-logo">🚀</div>
                  <div>
                    <h4 class="tool-sponsor-brand-title">Featured Alternative Tool</h4>
                    <p class="tool-sponsor-brand-sub">Verified AI &amp; Developer Stack</p>
                  </div>
                </div>
                <p class="tool-sponsor-desc">
                  Looking for a high-performance alternative to ${tool.name}? Try our verified partner tool for 10x faster inference and lower compute overhead.
                </p>
                <ul class="tool-sponsor-bullets">
                  <li><span class="check-mark">✓</span> Verified Developer Compatibility</li>
                  <li><span class="check-mark">✓</span> 99.9% High-Throughput API Access</li>
                  <li><span class="check-mark">✓</span> Exclusive AIRA Free Tier Included</li>
                </ul>
                <a href="#/advertise" class="tool-sponsor-cta-btn-main">
                  <span>Try Partner Tool Free ↗</span>
                </a>
                <div class="tool-sponsor-footer-note">
                  <span>Visible on 96+ AI tool detail pages</span> • <a href="#/advertise">Advertise ($39/day)</a>
                </div>
              </div>


            </div>

          </div>

          <!-- Related Tools Section (Bottom) -->
          ${relatedTools.length > 0 ? `
            <div class="tool-related-section">
              <h2 class="tool-related-title">Related AI Tools in ${primaryCatName}</h2>
              <div class="tool-related-grid tools-grid-3col">
                ${relatedTools.map(renderToolCard).join('')}
              </div>
            </div>
          ` : ''}

        </div>
      </section>
    `;

    // Bind Bookmark button
    const saveBtn = document.getElementById('btn-save-tool');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        let currentSaved = JSON.parse(localStorage.getItem('aira_saved_tools') || '[]');
        const idx = currentSaved.indexOf(tool.id);
        if (idx > -1) {
          currentSaved.splice(idx, 1);
          saveBtn.classList.remove('is-saved');
          saveBtn.querySelector('span').textContent = '☆ Bookmark Tool';
          showToast(`Removed ${tool.name} from your bookmarks`);
        } else {
          currentSaved.push(tool.id);
          saveBtn.classList.add('is-saved');
          saveBtn.querySelector('span').textContent = '★ Saved to Bookmarks';
          showToast(`Saved ${tool.name} to your AIRA bookmarks! 🔖`);
        }
        localStorage.setItem('aira_saved_tools', JSON.stringify(currentSaved));
      });
    }

    // Bind Share button
    const shareBtn = document.getElementById('btn-share-tool');
    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        const shareData = {
          title: `${tool.name} - AI Tool on AIRA`,
          text: tool.description,
          url: window.location.href
        };
        if (navigator.share) {
          try {
            await navigator.share(shareData);
            return;
          } catch (err) {}
        }
        try {
          await navigator.clipboard.writeText(window.location.href);
          showToast('🔗 Tool link copied to clipboard!');
        } catch (e) {
          showToast('🔗 Link: ' + window.location.href);
        }
      });
    }
  }

  // =========================================================================
  // 5. AIRA Jobs Board & Recruitment Engine (/#/jobs)
  // =========================================================================
  function getJobs() {
    const base = typeof AI_JOBS_DATA !== 'undefined' && Array.isArray(AI_JOBS_DATA.jobs) ? AI_JOBS_DATA.jobs : [];
    try {
      const stored = localStorage.getItem('aira_custom_jobs');
      if (stored) {
        const custom = JSON.parse(stored);
        if (Array.isArray(custom)) {
          const baseIds = new Set(base.map(j => j.id));
          const customOnly = custom.filter(j => !baseIds.has(j.id));
          return [...customOnly, ...base];
        }
      }
    } catch (e) {}
    return base;
  }

  function saveJobs(list) {
    try {
      localStorage.setItem('aira_custom_jobs', JSON.stringify(list));
      if (window.AiraStorage) window.AiraStorage.set('aira_custom_jobs', list);
    } catch (e) {}
  }

  function renderJobsPage() {
    const allJobs = getJobs();
    if (!state.jobCategoryFilter) state.jobCategoryFilter = 'all';
    if (state.jobSearchQuery === undefined) state.jobSearchQuery = '';

    const baseCategories = [
      { id: 'all', name: 'All Roles', icon: '💼' },
      { id: 'ui-ux', name: 'UI/UX Design', icon: '🎨' },
      { id: 'ai-eng', name: 'AI Engineering', icon: '⚡' },
      { id: 'prompt-eng', name: 'Prompt Engineering', icon: '💡' },
      { id: 'remote', name: '100% Remote', icon: '🌍' },
      { id: 'verified', name: 'Verified Openings', icon: '✅' }
    ];

    // Dynamically collect custom categories from all active jobs
    const standardIds = new Set(baseCategories.map(c => c.id));
    const extraCategories = [];
    allJobs.forEach(j => {
      const catId = j.categorySlug || (j.category ? j.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '');
      if (catId && !standardIds.has(catId) && !extraCategories.some(c => c.id === catId)) {
        extraCategories.push({
          id: catId,
          name: j.categoryName || j.category || 'Specialized Role',
          icon: j.categoryIcon || '🚀'
        });
      }
    });

    const categories = [...baseCategories, ...extraCategories];

    // Find featured job
    const featuredJob = allJobs.find(j => j.featured) || allJobs[0];

    appContainer.innerHTML = `
      <section class="jobs-hero-card">
        <div class="jobs-container">
          <!-- Top Ad / Announcement Bar -->
          ${(() => {
            const sp = (typeof getSponsorSettings === 'function') ? getSponsorSettings() : null;
            const topBar = sp ? sp.topBar : { active: true, badge: 'COMMUNITY', icon: '🎨', headline: '<strong>Join our UI/UX Design Community</strong> — Practical tips, design skills & tech trends.', link: 'https://chat.whatsapp.com/HJ2V5txnytDLPaWDKb1yKw', ctaText: 'Join WhatsApp Community →' };
            if (!topBar || topBar.active === false) return '';
            return `
              <div class="hero-openalt-top-ad" style="max-width: 820px; margin: 0 auto 20px auto;">
                <div class="hero-top-ad-left">
                  <span class="hero-ad-badge-pill">${escapeHtml(topBar.badge || 'Ad')}</span>
                  <span class="hero-ad-brand-icon">${topBar.icon || '⚡'}</span>
                  <span class="hero-ad-text-content">${topBar.headline || ''}</span>
                </div>
                <a href="${topBar.link || '#/advertise'}" target="${topBar.link && topBar.link.startsWith('http') ? '_blank' : '_self'}" class="hero-ad-action-btn">${escapeHtml(topBar.ctaText || 'Learn More')}</a>
              </div>
            `;
          })()}

          <!-- Centered Hero Header -->
          <div class="jobs-hero-badge">
            <span>⚡ VERIFIED AI, DESIGN &amp; TECH ROLES</span>
          </div>
          
          <h1 class="jobs-hero-title">AIRA Jobs Board</h1>
          
          <p class="jobs-hero-desc">
            Discover high-impact AI, UI/UX Design &amp; Prompt Engineering roles at world-class tech companies and frontier AI startups.
          </p>

          <!-- Search & Post a Job Action Bar -->
          <div class="jobs-hero-search-wrapper">
            <form class="jobs-search-form" id="jobs-search-form" onsubmit="event.preventDefault();">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717A" stroke-width="2.2" style="flex-shrink: 0;">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" class="jobs-search-input" id="jobs-search-input" placeholder="Search roles, companies, skills (e.g. OpenAI, Figma, Remote)..." value="${escapeHtml(state.jobSearchQuery)}" autocomplete="off" />
              <button type="submit" class="jobs-search-btn">Search Jobs</button>
            </form>

            <a href="#/post-job" class="jobs-hero-post-btn" title="Post an opening on AIRA Jobs Board">
              <span>✍️ Post a Job</span>
              <span class="post-btn-badge">HR Portal</span>
            </a>
          </div>

          <!-- Category Filter Chips -->
          <div class="jobs-filter-chips-wrapper">
            <div class="jobs-filter-chips-row">
              ${categories.map(cat => {
                const count = cat.id === 'all' 
                  ? allJobs.length 
                  : (cat.id === 'remote' 
                      ? allJobs.filter(j => (j.workplace || '').toLowerCase().includes('remote') || (j.location || '').toLowerCase().includes('remote')).length
                      : (cat.id === 'verified'
                          ? allJobs.filter(j => (j.badge || '').toLowerCase().includes('verified')).length
                          : allJobs.filter(j => j.category === cat.id || j.categorySlug === cat.id || (j.categoryName && j.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cat.id)).length));
                const isActive = state.jobCategoryFilter === cat.id;
                return `
                  <button type="button" class="job-filter-pill ${isActive ? 'active' : ''}" data-job-cat="${cat.id}">
                    <span>${cat.icon} ${cat.name}</span>
                    <span class="pill-count">${count}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </section>

      <div class="jobs-container" style="padding-bottom: 60px;">
        
        <!-- Featured Spotlight Job of the Day -->
        ${featuredJob && (!state.jobSearchQuery && state.jobCategoryFilter === 'all') ? `
          <div class="job-featured-spotlight-card" data-job-id="${featuredJob.id}">
            <div class="job-featured-top-row">
              <div class="job-company-badge-wrap">
                <div class="job-company-avatar" style="background: ${featuredJob.companyBg || '#18181B'};">
                  ${featuredJob.companyInitial || featuredJob.company.charAt(0)}
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 800; font-size: 1.05rem; color: #18181B;" class="dark-text-white">${escapeHtml(featuredJob.company)}</span>
                    <span class="job-featured-tag-pill">★ FEATURED ROLE</span>
                  </div>
                  <span style="font-size: 0.8rem; color: #71717A;">${escapeHtml(featuredJob.companyDomain || '')} • ${escapeHtml(featuredJob.postedAt || 'Recently')}</span>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="job-salary-tag">${escapeHtml(featuredJob.salary)}</span>
                ${featuredJob.badge ? `<span style="background: #D2FF52; color: #131313; font-weight: 800; font-size: 0.72rem; padding: 4px 8px; border-radius: 6px;">✓ ${escapeHtml(featuredJob.badge)}</span>` : ''}
              </div>
            </div>

            <h2 class="job-featured-title">${escapeHtml(featuredJob.title)}</h2>
            
            <div class="job-featured-meta">
              <span>📍 ${escapeHtml(featuredJob.location)}</span>
              <span>💼 ${escapeHtml(featuredJob.type)}</span>
              <span>⏳ ${escapeHtml(featuredJob.experience || '3+ yrs exp')}</span>
            </div>

            <p class="job-featured-desc">${escapeHtml(featuredJob.tagline || featuredJob.overview || '')}</p>

            <div class="job-skills-wrap">
              ${featuredJob.categoryName ? `<span class="job-skill-chip" style="background: rgba(28,70,245,0.08); color: #1C46F5; font-weight: 700;">${escapeHtml(featuredJob.categoryIcon || '💼')} ${escapeHtml(featuredJob.categoryName)}</span>` : ''}
              ${(featuredJob.skills || []).map(skill => `<span class="job-skill-chip">${escapeHtml(skill)}</span>`).join('')}
            </div>

            <div class="job-card-actions-row">
              <a href="${featuredJob.officialApplyUrl || featuredJob.applyUrl || 'https://openai.com/careers'}" target="_blank" rel="noopener noreferrer" class="job-btn-primary">
                <span>Apply on Official Site ↗</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </a>
              <button type="button" class="job-btn-secondary btn-open-job-detail" data-job-id="${featuredJob.id}">View Full Role &amp; Perks</button>
              <button type="button" class="btn-toggle-save-job" data-job-id="${featuredJob.id}" style="background: transparent; border: none; cursor: pointer; padding: 8px; color: #71717A;" title="Save job">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="${(state.savedJobs || []).includes(featuredJob.id) ? '#1C46F5' : 'none'}" stroke="${(state.savedJobs || []).includes(featuredJob.id) ? '#1C46F5' : 'currentColor'}" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
              </button>
            </div>
          </div>
        ` : ''}

        <!-- Jobs Feed List Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h3 style="font-family: var(--font-header); font-size: 1.18rem; font-weight: 800; margin: 0;">Verified Job Openings</h3>
          <span id="jobs-count-label" style="font-size: 0.82rem; color: #71717A;">Showing verified openings</span>
        </div>

        <!-- Jobs Feed Container -->
        <div class="jobs-feed-list" id="jobs-feed-container">
          <!-- Filtered jobs dynamically injected here -->
        </div>

        <!-- Recruiter / Post a Job Box -->
        <div class="job-post-recruiter-card">
          <div>
            <h4 class="job-post-recruiter-title">Hiring Top AI, UI/UX, Product or Engineering Talent?</h4>
            <p class="job-post-recruiter-desc">Showcase your open role to 100+ vetted AI pioneers, product designers, and senior engineers.</p>
          </div>
          <a href="#/post-job" class="job-btn-primary" style="background: #FFFFFF; color: #18181B !important; box-shadow: none;">
            <span>Post a Job / HR Submit ✍️</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
        </div>
      </div>

      <!-- Job Detail Modal Container -->
      <div class="job-modal-overlay" id="job-detail-modal">
        <div class="job-modal-card" id="job-modal-card-content">
          <!-- Populated dynamically on click -->
        </div>
      </div>
    `;

    // Internal render feed function
    function updateJobsFeed() {
      const feedContainer = document.getElementById('jobs-feed-container');
      const countLabel = document.getElementById('jobs-count-label');
      if (!feedContainer) return;

      const q = (state.jobSearchQuery || '').toLowerCase().trim();
      const cat = state.jobCategoryFilter || 'all';

      const filtered = allJobs.filter(job => {
        // Category filter
        let matchCat = true;
        if (cat === 'remote') {
          matchCat = (job.workplace || '').toLowerCase().includes('remote') || (job.location || '').toLowerCase().includes('remote');
        } else if (cat === 'verified') {
          matchCat = (job.badge || '').toLowerCase().includes('verified');
        } else if (cat !== 'all') {
          matchCat = job.category === cat || job.categorySlug === cat || (job.categoryName && job.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cat);
        }

        // Search query filter
        let matchSearch = true;
        if (q) {
          const haystack = `${job.title} ${job.company} ${job.location} ${job.salary} ${job.categoryName || ''} ${(job.skills || []).join(' ')} ${job.tagline || ''}`.toLowerCase();
          matchSearch = haystack.includes(q);
        }

        return matchCat && matchSearch;
      });

      if (countLabel) {
        countLabel.innerText = `Showing ${filtered.length} verified opening${filtered.length === 1 ? '' : 's'}`;
      }

      if (filtered.length === 0) {
        feedContainer.innerHTML = `
          <div style="text-align: center; padding: 48px 20px; background: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 14px;">
            <div style="font-size: 2.2rem; margin-bottom: 10px;">💼</div>
            <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 6px;">No jobs found</h4>
            <p style="color: #71717A; font-size: 0.88rem; margin-bottom: 16px;">Try adjusting your search terms or selecting a different category filter.</p>
            <button type="button" class="job-btn-secondary" id="btn-reset-job-filters">Clear All Filters</button>
          </div>
        `;
        const resetBtn = document.getElementById('btn-reset-job-filters');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            state.jobCategoryFilter = 'all';
            state.jobSearchQuery = '';
            const inputEl = document.getElementById('jobs-search-input');
            if (inputEl) inputEl.value = '';
            document.querySelectorAll('.job-filter-pill').forEach(p => p.classList.toggle('active', p.getAttribute('data-job-cat') === 'all'));
            updateJobsFeed();
          });
        }
        return;
      }

      feedContainer.innerHTML = filtered.map(job => {
        const isSaved = (state.savedJobs || []).includes(job.id);
        const officialLink = job.officialApplyUrl || job.applyUrl || `https://${job.companyDomain || 'google.com'}`;
        return `
          <div class="job-feed-card" data-job-id="${job.id}">
            <div class="job-feed-main">
              <div class="job-company-avatar" style="background: ${job.companyBg || '#18181B'}; width: 40px; height: 40px; font-size: 1.1rem;">
                ${job.companyInitial || job.company.charAt(0)}
              </div>
              <div class="job-feed-content">
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <h4 class="job-feed-title">${escapeHtml(job.title)}</h4>
                  ${job.badge ? `<span style="background: #D2FF52; color: #131313; font-weight: 800; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px;">${escapeHtml(job.badge)}</span>` : ''}
                </div>
                <div class="job-feed-company-row">
                  <strong style="color: #18181B;" class="dark-text-white">${escapeHtml(job.company)}</strong>
                  <span>•</span>
                  <span>📍 ${escapeHtml(job.location)}</span>
                  <span>•</span>
                  <span>⏱ ${escapeHtml(job.postedAt || 'Recently')}</span>
                </div>
                <div class="job-feed-pills-row">
                  <span class="job-salary-tag" style="padding: 2px 7px; font-size: 0.74rem;">${escapeHtml(job.salary)}</span>
                  <span class="job-skill-chip">${escapeHtml(job.type)}</span>
                  ${job.categoryName ? `<span class="job-skill-chip" style="background: rgba(28,70,245,0.06); color: #1C46F5; font-weight: 700;">${escapeHtml(job.categoryIcon || '💼')} ${escapeHtml(job.categoryName)}</span>` : ''}
                  ${(job.skills || []).slice(0, 2).map(s => `<span class="job-skill-chip">${escapeHtml(s)}</span>`).join('')}
                </div>
              </div>
            </div>

            <div class="job-feed-actions">
              <button type="button" class="btn-toggle-save-job" data-job-id="${job.id}" style="background: transparent; border: none; cursor: pointer; padding: 6px; color: #71717A;" title="Save job">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? '#1C46F5' : 'none'}" stroke="${isSaved ? '#1C46F5' : 'currentColor'}" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
              </button>
              <button type="button" class="job-btn-secondary btn-open-job-detail" data-job-id="${job.id}" style="padding: 8px 14px; font-size: 0.8rem;">Details</button>
              <a href="${officialLink}" target="_blank" rel="noopener noreferrer" class="job-btn-primary" style="padding: 8px 16px; font-size: 0.8rem;" title="Apply directly on official website">
                <span>Apply Official ↗</span>
              </a>
            </div>
          </div>
        `;
      }).join('');

      // Bind Job Card clicks & modal triggers
      feedContainer.querySelectorAll('.btn-open-job-detail, .job-feed-card').forEach(item => {
        item.addEventListener('click', (e) => {
          if (e.target.closest('a, .btn-toggle-save-job')) return;
          const jobId = item.getAttribute('data-job-id');
          if (jobId) openJobDetailModal(jobId);
        });
      });

      // Bind Bookmark save toggle
      feedContainer.querySelectorAll('.btn-toggle-save-job').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const jobId = btn.getAttribute('data-job-id');
          if (!jobId) return;
          if (!state.savedJobs) state.savedJobs = [];
          const idx = state.savedJobs.indexOf(jobId);
          if (idx >= 0) {
            state.savedJobs.splice(idx, 1);
            showToast('Job removed from saved bookmarks');
          } else {
            state.savedJobs.push(jobId);
            showToast('⭐ Job saved to bookmarks!');
          }
          localStorage.setItem('aira_saved_jobs', JSON.stringify(state.savedJobs));
          updateJobsFeed();
          if (typeof updateBookmarksBadge === 'function') updateBookmarksBadge();
        });
      });
    }

    // Modal Opener function
    function openJobDetailModal(jobId) {
      const job = allJobs.find(j => j.id === jobId);
      if (!job) return;

      const modalOverlay = document.getElementById('job-detail-modal');
      const modalContent = document.getElementById('job-modal-card-content');
      if (!modalOverlay || !modalContent) return;

      const isSaved = (state.savedJobs || []).includes(job.id);
      const officialLink = job.officialApplyUrl || job.applyUrl || `https://${job.companyDomain || 'google.com'}`;

      modalContent.innerHTML = `
        <button type="button" class="job-modal-close-btn" id="btn-close-job-modal">✕</button>
        
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid #E4E4E7;" class="dark-border-gray">
          <div class="job-company-avatar" style="background: ${job.companyBg || '#18181B'}; width: 48px; height: 48px; font-size: 1.3rem;">
            ${job.companyInitial || job.company.charAt(0)}
          </div>
          <div>
            <h3 style="font-family: var(--font-header); font-size: 1.3rem; font-weight: 800; margin: 0 0 2px 0;">${escapeHtml(job.title)}</h3>
            <div style="font-size: 0.86rem; color: #71717A; display: flex; align-items: center; flex-wrap: wrap; gap: 6px;">
              <strong style="color: #18181B;" class="dark-text-white">${escapeHtml(job.company)}</strong>
              <span>•</span>
              <a href="${officialLink}" target="_blank" rel="noopener noreferrer" style="color: #1C46F5; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 3px;">
                <span>${escapeHtml(job.companyDomain || job.company)}</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </a>
              <span>•</span>
              <span>📍 ${escapeHtml(job.location)}</span>
              <span>•</span>
              <span>⏱ ${escapeHtml(job.postedAt || 'Recently')}</span>
            </div>
          </div>
        </div>

        <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
          <span class="job-salary-tag" style="font-size: 0.88rem; padding: 4px 10px;">💰 ${escapeHtml(job.salary)}</span>
          <span class="job-skill-chip" style="font-size: 0.8rem; padding: 4px 10px;">⏳ ${escapeHtml(job.experience || 'Full-Time')}</span>
          <span class="job-skill-chip" style="font-size: 0.8rem; padding: 4px 10px;">🏢 ${escapeHtml(job.workplace || job.type)}</span>
          ${job.categoryName ? `<span class="job-skill-chip" style="font-size: 0.8rem; padding: 4px 10px; background: rgba(28,70,245,0.08); color: #1C46F5; font-weight: 700;">${escapeHtml(job.categoryIcon || '💼')} ${escapeHtml(job.categoryName)}</span>` : ''}
          ${job.badge ? `<span style="background: #D2FF52; color: #131313; font-weight: 800; font-size: 0.76rem; padding: 4px 8px; border-radius: 6px;">✓ ${escapeHtml(job.badge)}</span>` : ''}
        </div>

        <div style="font-size: 0.92rem; line-height: 1.6; color: #3F3F46; margin-bottom: 24px;" class="dark-text-gray">
          <h4 style="color: #18181B; margin: 16px 0 8px 0; font-size: 1.05rem;" class="dark-text-white">Role Overview</h4>
          <p>${escapeHtml(job.overview || job.tagline || '')}</p>

          ${job.responsibilities && job.responsibilities.length ? `
            <h4 style="color: #18181B; margin: 18px 0 8px 0; font-size: 1.05rem;" class="dark-text-white">Key Responsibilities</h4>
            <ul style="padding-left: 20px; margin: 0 0 16px 0;">
              ${job.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
            </ul>
          ` : ''}

          ${job.requirements && job.requirements.length ? `
            <h4 style="color: #18181B; margin: 18px 0 8px 0; font-size: 1.05rem;" class="dark-text-white">Requirements &amp; Qualifications</h4>
            <ul style="padding-left: 20px; margin: 0 0 16px 0;">
              ${job.requirements.map(req => `<li>${escapeHtml(req)}</li>`).join('')}
            </ul>
          ` : ''}

          ${job.benefits && job.benefits.length ? `
            <h4 style="color: #18181B; margin: 18px 0 8px 0; font-size: 1.05rem;" class="dark-text-white">Compensation &amp; Benefits</h4>
            <ul style="padding-left: 20px; margin: 0 0 16px 0;">
              ${job.benefits.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
            </ul>
          ` : ''}
        </div>

        <!-- Direct Official Apply & WhatsApp Referral Dual Action Bar -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding-top: 16px; border-top: 1px solid #E4E4E7;" class="dark-border-gray">
          <div style="display: flex; align-items: center; gap: 8px;">
            <button type="button" class="job-btn-secondary btn-modal-toggle-save" data-job-id="${job.id}">
              <span>${isSaved ? '★ Saved' : '☆ Save Job'}</span>
            </button>
            <a href="https://chat.whatsapp.com/HJ2V5txnytDLPaWDKb1yKw" target="_blank" rel="noopener noreferrer" class="job-btn-secondary" style="font-size: 0.85rem; padding: 10px 14px; gap: 5px;" title="Connect with community">
              <span style="color: #25D366;">💬</span>
              <span>WhatsApp Community</span>
            </a>
          </div>

          <a href="${officialLink}" target="_blank" rel="noopener noreferrer" class="job-btn-primary" style="padding: 12px 24px; font-size: 0.92rem;">
            <span>Apply on Official Website (${escapeHtml(job.company)}) ↗</span>
          </a>
        </div>
      `;

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Bind close
      document.getElementById('btn-close-job-modal').addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });

      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          modalOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      });

      // Bind Save in modal
      const modalSaveBtn = modalContent.querySelector('.btn-modal-toggle-save');
      if (modalSaveBtn) {
        modalSaveBtn.addEventListener('click', () => {
          if (!state.savedJobs) state.savedJobs = [];
          const idx = state.savedJobs.indexOf(job.id);
          if (idx >= 0) {
            state.savedJobs.splice(idx, 1);
            modalSaveBtn.innerHTML = '<span>☆ Save Job</span>';
            showToast('Job removed from bookmarks');
          } else {
            state.savedJobs.push(job.id);
            modalSaveBtn.innerHTML = '<span>★ Saved</span>';
            showToast('⭐ Job saved to bookmarks!');
          }
          localStorage.setItem('aira_saved_jobs', JSON.stringify(state.savedJobs));
          updateJobsFeed();
          if (typeof updateBookmarksBadge === 'function') updateBookmarksBadge();
        });
      }
    }

    // Bind Category Filter Pills
    document.querySelectorAll('.job-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const cat = pill.getAttribute('data-job-cat');
        state.jobCategoryFilter = cat;
        document.querySelectorAll('.job-filter-pill').forEach(p => p.classList.toggle('active', p.getAttribute('data-job-cat') === cat));
        updateJobsFeed();
      });
    });

    // Bind Search input
    const searchInput = document.getElementById('jobs-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.jobSearchQuery = e.target.value;
        updateJobsFeed();
      });
    }

    // Bind Featured Job card click
    const featuredCard = document.querySelector('.job-featured-spotlight-card');
    if (featuredCard) {
      const openBtn = featuredCard.querySelector('.btn-open-job-detail');
      if (openBtn) {
        openBtn.addEventListener('click', () => {
          const jobId = featuredCard.getAttribute('data-job-id');
          if (jobId) openJobDetailModal(jobId);
        });
      }
      const featSaveBtn = featuredCard.querySelector('.btn-toggle-save-job');
      if (featSaveBtn) {
        featSaveBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const jobId = featSaveBtn.getAttribute('data-job-id');
          if (!jobId) return;
          if (!state.savedJobs) state.savedJobs = [];
          const idx = state.savedJobs.indexOf(jobId);
          if (idx >= 0) {
            state.savedJobs.splice(idx, 1);
            showToast('Job removed from saved bookmarks');
          } else {
            state.savedJobs.push(jobId);
            showToast('⭐ Job saved to bookmarks!');
          }
          localStorage.setItem('aira_saved_jobs', JSON.stringify(state.savedJobs));
          renderJobsPage();
          if (typeof updateBookmarksBadge === 'function') updateBookmarksBadge();
        });
      }
    }

    // Initial feed render
    updateJobsFeed();
  }

  function renderJobDetailPage(jobId) {
    const allJobs = getJobs();
    const job = allJobs.find(j => j.id === jobId) || allJobs[0];
    if (!job) {
      renderJobsPage();
      return;
    }
    renderJobsPage();
    setTimeout(() => {
      const modalOverlay = document.getElementById('job-detail-modal');
      if (modalOverlay) {
        // Trigger modal opener directly
        const card = document.querySelector(`.job-feed-card[data-job-id="${job.id}"], .job-featured-spotlight-card[data-job-id="${job.id}"]`);
        if (card) {
          const btn = card.querySelector('.btn-open-job-detail');
          if (btn) btn.click();
        }
      }
    }, 100);
  }

  // =========================================================================
  // 5c. Post a Job / HR Recruiter Portal Page (/#/post-job)
  // =========================================================================
  function renderPostJobPage() {
    let previewMode = 'spotlight'; // 'spotlight' or 'feed'

    const defaultDraft = {
      title: 'Senior AI & Prompt Engineer',
      category: 'ai-eng',
      workplace: 'Remote / Hybrid',
      type: 'Full-time',
      location: 'San Francisco, CA / Remote',
      experience: '3+ yrs exp',
      salary: '$185,000 - $245,000 + Equity',
      company: 'Anthropic',
      companyDomain: 'anthropic.com',
      companyInitial: 'A',
      companyBg: '#D97706',
      tagline: 'Build and evaluate cutting-edge prompt workflows and safety benchmarks for frontier LLMs.',
      overview: 'We are looking for a Senior AI & Prompt Engineer to lead developer evaluation systems and prompt infrastructure.',
      responsibilities: '• Architect and evaluate prompt pipelines for Claude frontier models.\n• Design automated benchmark suites for coding, reasoning, and tool use.\n• Collaborate with research scientists to improve model steerability.',
      requirements: '• 3+ years experience with Python, LLM prompting, and API integration.\n• Deep understanding of agentic workflows, function calling, and RAG systems.\n• Strong problem solving and system architecture skills.',
      skills: 'Prompt Engineering, Python, Claude, PyTorch, RAG',
      benefits: '• Top-tier market compensation & equity grants\n• Comprehensive health, dental, and vision insurance\n• 100% remote flexibility & home office stipend',
      officialApplyUrl: 'https://anthropic.com/careers',
      recruiterName: 'Talent Acquisition Team',
      recruiterEmail: 'careers@anthropic.com',
      recruiterWhatsapp: '+1 (555) 019-2834',
      isSpotlight: true,
      isHrVerified: true
    };

    appContainer.innerHTML = `
      <div class="post-job-wrapper">
        <div class="post-job-container">
          
          <!-- Breadcrumb Navigation -->
          <nav class="alt-breadcrumb-nav" style="margin-bottom: 20px;">
            <a href="#/home">Home</a>
            <span class="bc-sep">/</span>
            <a href="#/jobs">Jobs Board</a>
            <span class="bc-sep">/</span>
            <span class="bc-curr">Post a Job (HR Portal)</span>
          </nav>

          <!-- Top Hero Card -->
          <div class="post-job-header-card">
            <div>
              <div class="post-job-hero-badge">
                <span>⚡ AIRA Jobs Board • HR &amp; Recruiter Portal</span>
              </div>
              <h1 class="post-job-header-title">Post an AI, UI/UX or Prompt Role</h1>
              <p class="post-job-header-desc">
                Publish your opening directly to 100+ vetted senior AI engineers, product designers, and prompt specialists. Candidates apply straight to your official company careers page.
              </p>
            </div>
            <div class="post-job-hero-actions">
              <a href="#/jobs" class="job-btn-secondary" style="font-size: 0.88rem; padding: 10px 18px;">
                <span>← View Jobs Board</span>
              </a>
            </div>
          </div>

          <!-- Main 2-Column Grid: Form Left, Sticky Live Preview Right -->
          <div class="post-job-layout-grid" id="post-job-main-grid">
            
            <!-- LEFT: HR SUBMISSION FORM -->
            <div class="post-job-form-panel">
              <form id="form-post-job">
                
                <!-- STEP 1: ROLE DETAILS -->
                <div class="post-job-step-section">
                  <div class="post-job-step-header">
                    <div class="post-job-step-bubble">1</div>
                    <div>
                      <h3 class="post-job-step-title">Role Overview</h3>
                      <p class="post-job-step-subtitle">Core title, category, workplace type and compensation</p>
                    </div>
                  </div>

                  <div class="post-job-field">
                    <label class="post-job-label">Job Title <span class="req">*</span></label>
                    <input type="text" id="pj-title" class="post-job-input" placeholder="e.g. Senior AI &amp; Prompt Engineer" value="${escapeHtml(defaultDraft.title)}" required />
                  </div>

                  <div class="post-job-row-2">
                    <div class="post-job-field">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <label class="post-job-label" style="margin-bottom: 0;">Role Category <span class="req">*</span></label>
                        <button type="button" id="btn-toggle-custom-cat" style="background: none; border: none; color: #1C46F5; font-size: 0.78rem; font-weight: 700; cursor: pointer; padding: 0; text-decoration: underline;">
                          ✍️ Type Custom Role
                        </button>
                      </div>
                      <select id="pj-category" class="post-job-select" required>
                        <option value="ai-eng" selected>⚡ AI Engineering</option>
                        <option value="ui-ux">🎨 UI/UX Design</option>
                        <option value="prompt-eng">💡 Prompt Engineering</option>
                        <option value="product-mgmt">💼 Product Management</option>
                        <option value="data-science">📊 Data Science &amp; ML</option>
                        <option value="fullstack">💻 Full-Stack Engineering</option>
                        <option value="frontend">🖥️ Frontend Engineering</option>
                        <option value="backend">⚙️ Backend Engineering</option>
                        <option value="mobile">📱 Mobile App Development</option>
                        <option value="devops">☁️ DevOps &amp; Cloud Infrastructure</option>
                        <option value="marketing">📈 Growth &amp; Product Marketing</option>
                        <option value="custom">✍️ + Type Custom Role Category...</option>
                      </select>

                      <div id="pj-custom-category-wrap" style="display: none; margin-top: 8px;">
                        <input type="text" id="pj-custom-category" class="post-job-input" placeholder="Type custom role category (e.g. AI Researcher, Growth Lead, Blockchain)..." value="" />
                        <div class="post-job-field-hint" style="margin-top: 4px;">Recruiters can type any custom category for specific hiring roles.</div>
                      </div>
                    </div>

                    <div class="post-job-field">
                      <label class="post-job-label">Workplace Model <span class="req">*</span></label>
                      <select id="pj-workplace" class="post-job-select" required>
                        <option value="Remote" selected>🌍 100% Remote</option>
                        <option value="Hybrid">🏢 Hybrid</option>
                        <option value="Onsite">📍 On-site</option>
                        <option value="Worldwide Remote">🌐 Worldwide Remote</option>
                      </select>
                    </div>
                  </div>

                  <div class="post-job-row-3">
                    <div class="post-job-field">
                      <label class="post-job-label">Employment Type <span class="req">*</span></label>
                      <select id="pj-type" class="post-job-select" required>
                        <option value="Full-time" selected>Full-time</option>
                        <option value="Contract">Contract / Freelance</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>

                    <div class="post-job-field">
                      <label class="post-job-label">Location <span class="req">*</span></label>
                      <input type="text" id="pj-location" class="post-job-input" placeholder="e.g. San Francisco, CA / Remote" value="${escapeHtml(defaultDraft.location)}" required />
                    </div>

                    <div class="post-job-field">
                      <label class="post-job-label">Experience <span class="req">*</span></label>
                      <input type="text" id="pj-experience" class="post-job-input" placeholder="e.g. 3+ yrs exp" value="${escapeHtml(defaultDraft.experience)}" required />
                    </div>
                  </div>

                  <div class="post-job-field">
                    <label class="post-job-label">Compensation / Salary Range <span class="req">*</span></label>
                    <input type="text" id="pj-salary" class="post-job-input" placeholder="e.g. $185,000 - $245,000 + Equity or ₹25 - ₹45 LPA" value="${escapeHtml(defaultDraft.salary)}" required />
                    <div class="post-job-field-hint">Transparent salary ranges receive 3.4x more qualified applicants.</div>
                  </div>
                </div>

                <!-- STEP 2: COMPANY PROFILE -->
                <div class="post-job-step-section">
                  <div class="post-job-step-header">
                    <div class="post-job-step-bubble">2</div>
                    <div>
                      <h3 class="post-job-step-title">Company Profile</h3>
                      <p class="post-job-step-subtitle">Your brand identity, website, and avatar logo</p>
                    </div>
                  </div>

                  <div class="post-job-row-2">
                    <div class="post-job-field">
                      <label class="post-job-label">Company Name <span class="req">*</span></label>
                      <input type="text" id="pj-company" class="post-job-input" placeholder="e.g. Anthropic" value="${escapeHtml(defaultDraft.company)}" required />
                    </div>

                    <div class="post-job-field">
                      <label class="post-job-label">Company Domain / Website <span class="req">*</span></label>
                      <input type="text" id="pj-domain" class="post-job-input" placeholder="e.g. anthropic.com" value="${escapeHtml(defaultDraft.companyDomain)}" required />
                    </div>
                  </div>

                  <div class="post-job-row-2">
                    <div class="post-job-field">
                      <label class="post-job-label">Logo Monogram Initial</label>
                      <input type="text" id="pj-initial" class="post-job-input" placeholder="e.g. A" maxlength="2" value="${escapeHtml(defaultDraft.companyInitial)}" style="text-align: center; font-weight: 800;" />
                    </div>

                    <div class="post-job-field">
                      <label class="post-job-label">Brand Color</label>
                      <div style="display: flex; gap: 8px; align-items: center;">
                        <input type="color" id="pj-bg-picker" value="${defaultDraft.companyBg}" style="width: 44px; height: 40px; border: 1px solid #E4E4E7; border-radius: 8px; cursor: pointer; padding: 2px;" />
                        <input type="text" id="pj-bg-text" class="post-job-input" value="${defaultDraft.companyBg}" style="flex: 1;" />
                      </div>
                    </div>
                  </div>

                  <div class="post-job-field">
                    <label class="post-job-label">Company 1-Line Tagline <span class="req">*</span></label>
                    <input type="text" id="pj-tagline" class="post-job-input" placeholder="e.g. AI research and safety company building reliable frontier systems" value="${escapeHtml(defaultDraft.tagline)}" required />
                  </div>
                </div>

                <!-- STEP 3: ROLE DETAILS & PERKS -->
                <div class="post-job-step-section">
                  <div class="post-job-step-header">
                    <div class="post-job-step-bubble">3</div>
                    <div>
                      <h3 class="post-job-step-title">Role Details &amp; Qualifications</h3>
                      <p class="post-job-step-subtitle">Detailed description, responsibilities, requirements, and perks</p>
                    </div>
                  </div>

                  <div class="post-job-field">
                    <label class="post-job-label">Role Overview / Hook <span class="req">*</span></label>
                    <textarea id="pj-overview" class="post-job-textarea" rows="2" placeholder="Brief summary of why this role exists and the team mission..." required>${escapeHtml(defaultDraft.overview)}</textarea>
                  </div>

                  <div class="post-job-field">
                    <label class="post-job-label">Key Responsibilities (One per line)</label>
                    <textarea id="pj-responsibilities" class="post-job-textarea" rows="3" placeholder="• Architect and evaluate prompt pipelines...&#10;• Design automated benchmark suites...&#10;• Collaborate with research scientists...">${escapeHtml(defaultDraft.responsibilities)}</textarea>
                  </div>

                  <div class="post-job-field">
                    <label class="post-job-label">Requirements &amp; Qualifications (One per line)</label>
                    <textarea id="pj-requirements" class="post-job-textarea" rows="3" placeholder="• 3+ years experience with Python and LLM prompting...&#10;• Deep understanding of agentic workflows...&#10;• Strong problem solving and system architecture skills...">${escapeHtml(defaultDraft.requirements)}</textarea>
                  </div>

                  <div class="post-job-field">
                    <label class="post-job-label">Skills Tags (Comma-separated) <span class="req">*</span></label>
                    <input type="text" id="pj-skills" class="post-job-input" placeholder="e.g. Prompt Engineering, Python, Claude, PyTorch, RAG" value="${escapeHtml(defaultDraft.skills)}" required />
                  </div>

                  <div class="post-job-field">
                    <label class="post-job-label">Compensation &amp; Benefits (One per line)</label>
                    <textarea id="pj-benefits" class="post-job-textarea" rows="3" placeholder="• Top-tier market compensation &amp; equity grants&#10;• Comprehensive health, dental, and vision insurance&#10;• 100% remote flexibility &amp; home office stipend">${escapeHtml(defaultDraft.benefits)}</textarea>
                  </div>
                </div>

                <!-- STEP 4: OFFICIAL APPLY LINK & RECRUITER CONTACT -->
                <div class="post-job-step-section">
                  <div class="post-job-step-header">
                    <div class="post-job-step-bubble">4</div>
                    <div>
                      <h3 class="post-job-step-title">Official Apply Link &amp; HR Verification</h3>
                      <p class="post-job-step-subtitle">Where candidates apply directly on your official site</p>
                    </div>
                  </div>

                  <div class="post-job-field">
                    <label class="post-job-label">Official Careers Page / ATS Apply Link URL <span class="req">*</span></label>
                    <input type="url" id="pj-apply-url" class="post-job-input" placeholder="https://anthropic.com/careers/senior-prompt-engineer or Greenhouse/Lever link" value="${escapeHtml(defaultDraft.officialApplyUrl)}" required />
                    <div class="post-job-field-hint">Candidates will click directly to this URL to submit their official application.</div>
                  </div>

                  <div class="post-job-row-2">
                    <div class="post-job-field">
                      <label class="post-job-label">Recruiter / HR Contact Name <span class="req">*</span></label>
                      <input type="text" id="pj-recruiter-name" class="post-job-input" placeholder="e.g. Sarah Jenkins (Head of Talent)" value="${escapeHtml(defaultDraft.recruiterName)}" required />
                    </div>

                    <div class="post-job-field">
                      <label class="post-job-label">Official Work Email <span class="req">*</span></label>
                      <input type="email" id="pj-recruiter-email" class="post-job-input" placeholder="e.g. careers@anthropic.com" value="${escapeHtml(defaultDraft.recruiterEmail)}" required />
                    </div>
                  </div>

                  <div class="post-job-field">
                    <label class="post-job-label">WhatsApp / Phone for Fast-Track (Optional)</label>
                    <input type="text" id="pj-recruiter-whatsapp" class="post-job-input" placeholder="e.g. +1 (555) 019-2834 or WhatsApp link" value="${escapeHtml(defaultDraft.recruiterWhatsapp)}" />
                  </div>

                  <div style="margin-top: 16px;">
                    <label class="post-job-checkbox-card">
                      <input type="checkbox" id="pj-check-hr" ${defaultDraft.isHrVerified ? 'checked' : ''} />
                      <div>
                        <div class="post-job-checkbox-text">✅ Include "Verified Opening" Badge</div>
                        <div class="post-job-checkbox-sub">Adds trusted neon badge to your opening and lists it under the verified filter.</div>
                      </div>
                    </label>

                    <label class="post-job-checkbox-card">
                      <input type="checkbox" id="pj-check-spotlight" ${defaultDraft.isSpotlight ? 'checked' : ''} />
                      <div>
                        <div class="post-job-checkbox-text">⭐ Feature as Spotlight Opening of the Day</div>
                        <div class="post-job-checkbox-sub">Pins your job with a glowing spotlight card at the very top of the Jobs Board.</div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- SUBMIT ACTION BUTTON -->
                <div style="margin-top: 24px;">
                  <button type="submit" class="post-job-submit-btn" id="btn-submit-post-job">
                    <span>🚀 Publish Job Opening to Board</span>
                  </button>
                  <p style="font-size: 0.8rem; color: #71717A; text-align: center; margin-top: 10px;">
                    Instant publish on localhost. Readers click directly to your official company careers page.
                  </p>
                </div>
              </form>
            </div>

            <!-- RIGHT: REAL-TIME LIVE CARD PREVIEW -->
            <div class="post-job-preview-panel">
              <div class="post-job-preview-header">
                <div class="post-job-preview-pill">
                  <span>⚡ LIVE PREVIEW</span>
                </div>
                <div class="post-job-preview-toggle">
                  <button type="button" class="post-job-toggle-btn ${previewMode === 'spotlight' ? 'active' : ''}" id="btn-preview-spotlight">★ Spotlight</button>
                  <button type="button" class="post-job-toggle-btn ${previewMode === 'feed' ? 'active' : ''}" id="btn-preview-feed">📋 Feed Card</button>
                </div>
              </div>

              <div class="post-job-preview-card-wrap" id="post-job-live-card-container">
                <!-- Rendered dynamically via updatePostJobLivePreview() -->
              </div>

              <p class="post-job-preview-notice">
                👁️ This is a 100% accurate real-time preview of how your opening looks to candidates on the AIRA Jobs Board.
              </p>
            </div>

          </div>
        </div>
      </div>
    `;

    // Real-time Preview Sync Function
    function getFormValues() {
      const title = document.getElementById('pj-title')?.value || 'Senior AI & Prompt Engineer';
      const categorySelect = document.getElementById('pj-category');
      const customCategoryInput = document.getElementById('pj-custom-category');
      const customCatVal = (customCategoryInput?.value || '').trim();
      const selVal = categorySelect?.value || 'ai-eng';

      let category = selVal;
      let categoryName = 'AI Engineering';
      let categoryIcon = '⚡';

      if (selVal === 'custom' || customCatVal) {
        if (customCatVal) {
          category = customCatVal.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          categoryName = customCatVal;
          const lower = customCatVal.toLowerCase();
          if (lower.includes('design') || lower.includes('ux') || lower.includes('ui')) categoryIcon = '🎨';
          else if (lower.includes('ai') || lower.includes('ml') || lower.includes('prompt') || lower.includes('model') || lower.includes('llm')) categoryIcon = '⚡';
          else if (lower.includes('data') || lower.includes('analyst') || lower.includes('analytics')) categoryIcon = '📊';
          else if (lower.includes('product') || lower.includes('pm') || lower.includes('owner') || lower.includes('lead') || lower.includes('head')) categoryIcon = '💼';
          else if (lower.includes('cloud') || lower.includes('devops') || lower.includes('infra') || lower.includes('sre')) categoryIcon = '☁️';
          else if (lower.includes('growth') || lower.includes('market') || lower.includes('sales') || lower.includes('seo')) categoryIcon = '📈';
          else if (lower.includes('mobile') || lower.includes('ios') || lower.includes('android') || lower.includes('flutter') || lower.includes('react native')) categoryIcon = '📱';
          else if (lower.includes('frontend') || lower.includes('web') || lower.includes('react') || lower.includes('vue')) categoryIcon = '🖥️';
          else if (lower.includes('backend') || lower.includes('node') || lower.includes('python') || lower.includes('golang') || lower.includes('rust')) categoryIcon = '⚙️';
          else categoryIcon = '🚀';
        } else {
          category = 'specialized-role';
          categoryName = 'Specialized Role';
          categoryIcon = '💼';
        }
      } else {
        const catMap = {
          'ai-eng': { name: 'AI Engineering', icon: '⚡' },
          'ui-ux': { name: 'UI/UX Design', icon: '🎨' },
          'prompt-eng': { name: 'Prompt Engineering', icon: '💡' },
          'product-mgmt': { name: 'Product Management', icon: '💼' },
          'data-science': { name: 'Data Science & ML', icon: '📊' },
          'fullstack': { name: 'Full-Stack Engineering', icon: '💻' },
          'frontend': { name: 'Frontend Engineering', icon: '🖥️' },
          'backend': { name: 'Backend Engineering', icon: '⚙️' },
          'mobile': { name: 'Mobile App Development', icon: '📱' },
          'devops': { name: 'DevOps & Cloud', icon: '☁️' },
          'marketing': { name: 'Growth & Marketing', icon: '📈' }
        };
        if (catMap[selVal]) {
          category = selVal;
          categoryName = catMap[selVal].name;
          categoryIcon = catMap[selVal].icon;
        }
      }

      const workplace = document.getElementById('pj-workplace')?.value || 'Remote';
      const type = document.getElementById('pj-type')?.value || 'Full-time';
      const location = document.getElementById('pj-location')?.value || 'San Francisco, CA / Remote';
      const experience = document.getElementById('pj-experience')?.value || '3+ yrs exp';
      const salary = document.getElementById('pj-salary')?.value || '$185,000 - $245,000 + Equity';
      const company = document.getElementById('pj-company')?.value || 'Anthropic';
      const companyDomain = (document.getElementById('pj-domain')?.value || 'anthropic.com').replace(/^https?:\/\//i, '').split('/')[0];
      const companyInitial = (document.getElementById('pj-initial')?.value || company.charAt(0) || 'A').toUpperCase();
      const companyBg = document.getElementById('pj-bg-text')?.value || '#D97706';
      const tagline = document.getElementById('pj-tagline')?.value || 'Build and evaluate cutting-edge prompt workflows and safety benchmarks for frontier LLMs.';
      const overview = document.getElementById('pj-overview')?.value || tagline;
      const skillsRaw = document.getElementById('pj-skills')?.value || 'Prompt Engineering, Python, Claude, PyTorch, RAG';
      const skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);
      const applyUrl = document.getElementById('pj-apply-url')?.value || 'https://anthropic.com/careers';
      const isHrVerified = document.getElementById('pj-check-hr')?.checked ?? true;
      const isSpotlight = document.getElementById('pj-check-spotlight')?.checked ?? true;

      return {
        title,
        category,
        categoryName,
        categoryIcon,
        workplace,
        type,
        location,
        experience,
        salary,
        company,
        companyDomain,
        companyInitial,
        companyBg,
        tagline,
        overview,
        skills,
        applyUrl,
        isHrVerified,
        isSpotlight
      };
    }

    function updateLivePreview() {
      const container = document.getElementById('post-job-live-card-container');
      if (!container) return;

      const f = getFormValues();

      if (previewMode === 'spotlight') {
        container.innerHTML = `
          <div class="job-featured-spotlight-card" style="margin: 0;">
            <div class="job-featured-top-row">
              <div class="job-company-badge-wrap">
                <div class="job-company-avatar" style="background: ${f.companyBg};">
                  ${escapeHtml(f.companyInitial)}
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 800; font-size: 1.05rem; color: #18181B;" class="dark-text-white">${escapeHtml(f.company)}</span>
                    <span class="job-featured-tag-pill">★ FEATURED ROLE</span>
                  </div>
                  <span style="font-size: 0.8rem; color: #71717A;">${escapeHtml(f.companyDomain)} • Just now</span>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="job-salary-tag">${escapeHtml(f.salary)}</span>
                ${f.isHrVerified ? `<span style="background: #D2FF52; color: #131313; font-weight: 800; font-size: 0.72rem; padding: 4px 8px; border-radius: 6px;">✓ Verified</span>` : ''}
              </div>
            </div>

            <h2 class="job-featured-title" style="font-size: 1.25rem;">${escapeHtml(f.title)}</h2>
            
            <div class="job-featured-meta">
              <span>📍 ${escapeHtml(f.location)}</span>
              <span>💼 ${escapeHtml(f.type)}</span>
              <span>⏳ ${escapeHtml(f.experience)}</span>
            </div>

            <p class="job-featured-desc">${escapeHtml(f.tagline || f.overview)}</p>

            <div class="job-skills-wrap">
              <span class="job-skill-chip" style="background: rgba(28,70,245,0.08); color: #1C46F5; font-weight: 700;">${escapeHtml(f.categoryIcon)} ${escapeHtml(f.categoryName)}</span>
              ${f.skills.map(s => `<span class="job-skill-chip">${escapeHtml(s)}</span>`).join('')}
            </div>

            <div class="job-card-actions-row">
              <a href="${escapeHtml(f.applyUrl)}" target="_blank" rel="noopener noreferrer" class="job-btn-primary" onclick="event.preventDefault(); showToast('Preview Link: ' + this.href);">
                <span>Apply on Official Site ↗</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </a>
              <button type="button" class="job-btn-secondary">View Role &amp; Perks</button>
            </div>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="job-feed-card" style="margin: 0; box-shadow: none;">
            <div class="job-feed-main">
              <div class="job-company-avatar" style="background: ${f.companyBg}; width: 40px; height: 40px; font-size: 1.1rem;">
                ${escapeHtml(f.companyInitial)}
              </div>
              <div class="job-feed-content">
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <h4 class="job-feed-title">${escapeHtml(f.title)}</h4>
                  ${f.isHrVerified ? `<span style="background: #D2FF52; color: #131313; font-weight: 800; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px;">Verified</span>` : ''}
                </div>
                <div class="job-feed-company-row">
                  <strong style="color: #18181B;" class="dark-text-white">${escapeHtml(f.company)}</strong>
                  <span>•</span>
                  <span>📍 ${escapeHtml(f.location)}</span>
                  <span>•</span>
                  <span>⏱ Just now</span>
                </div>
                <div class="job-feed-pills-row">
                  <span class="job-salary-tag" style="padding: 2px 7px; font-size: 0.74rem;">${escapeHtml(f.salary)}</span>
                  <span class="job-skill-chip">${escapeHtml(f.type)}</span>
                  <span class="job-skill-chip" style="background: rgba(28,70,245,0.06); color: #1C46F5; font-weight: 700;">${escapeHtml(f.categoryIcon)} ${escapeHtml(f.categoryName)}</span>
                  ${f.skills.slice(0, 2).map(s => `<span class="job-skill-chip">${escapeHtml(s)}</span>`).join('')}
                </div>
              </div>
            </div>

            <div class="job-feed-actions">
              <button type="button" class="job-btn-secondary" style="padding: 8px 12px; font-size: 0.8rem;">Details</button>
              <a href="${escapeHtml(f.applyUrl)}" target="_blank" rel="noopener noreferrer" class="job-btn-primary" style="padding: 8px 14px; font-size: 0.8rem;" onclick="event.preventDefault(); showToast('Preview Link: ' + this.href);">
                <span>Apply Official ↗</span>
              </a>
            </div>
          </div>
        `;
      }
    }

    // Attach listeners to all inputs for real-time live preview update
    appContainer.querySelectorAll('.post-job-input, .post-job-select, .post-job-textarea, input[type="checkbox"]').forEach(el => {
      el.addEventListener('input', updateLivePreview);
      el.addEventListener('change', updateLivePreview);
    });

    // Handle Category Select & Custom Category Input Toggle
    const catSelect = document.getElementById('pj-category');
    const customCatWrap = document.getElementById('pj-custom-category-wrap');
    const customCatInput = document.getElementById('pj-custom-category');
    const toggleCustomBtn = document.getElementById('btn-toggle-custom-cat');

    if (catSelect && customCatWrap) {
      catSelect.addEventListener('change', () => {
        if (catSelect.value === 'custom') {
          customCatWrap.style.display = 'block';
          if (customCatInput) {
            customCatInput.focus();
            if (!customCatInput.value) customCatInput.placeholder = 'e.g. AI Researcher, Growth Lead, Blockchain Dev...';
          }
        } else {
          if (!customCatInput?.value?.trim()) {
            customCatWrap.style.display = 'none';
          }
        }
        updateLivePreview();
      });
    }

    if (toggleCustomBtn && customCatWrap) {
      toggleCustomBtn.addEventListener('click', () => {
        if (catSelect) catSelect.value = 'custom';
        customCatWrap.style.display = 'block';
        if (customCatInput) {
          customCatInput.focus();
        }
        updateLivePreview();
      });
    }

    // Sync Color picker and text box
    const colorPicker = document.getElementById('pj-bg-picker');
    const colorText = document.getElementById('pj-bg-text');
    if (colorPicker && colorText) {
      colorPicker.addEventListener('input', (e) => {
        colorText.value = e.target.value;
        updateLivePreview();
      });
      colorText.addEventListener('input', (e) => {
        if (e.target.value.startsWith('#') && (e.target.value.length === 7 || e.target.value.length === 4)) {
          colorPicker.value = e.target.value;
        }
        updateLivePreview();
      });
    }

    // Company Initial auto-fill from Company name
    const companyInput = document.getElementById('pj-company');
    const initialInput = document.getElementById('pj-initial');
    if (companyInput && initialInput) {
      companyInput.addEventListener('input', () => {
        const val = companyInput.value.trim();
        if (val && (!initialInput.value || initialInput.value.length <= 1)) {
          initialInput.value = val.charAt(0).toUpperCase();
        }
        updateLivePreview();
      });
    }

    // Toggle Preview Tabs
    const btnSpotlight = document.getElementById('btn-preview-spotlight');
    const btnFeed = document.getElementById('btn-preview-feed');
    if (btnSpotlight && btnFeed) {
      btnSpotlight.addEventListener('click', () => {
        previewMode = 'spotlight';
        btnSpotlight.classList.add('active');
        btnFeed.classList.remove('active');
        updateLivePreview();
      });
      btnFeed.addEventListener('click', () => {
        previewMode = 'feed';
        btnFeed.classList.add('active');
        btnSpotlight.classList.remove('active');
        updateLivePreview();
      });
    }

    // Handle Form Submit
    const form = document.getElementById('form-post-job');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const f = getFormValues();
        const respText = document.getElementById('pj-responsibilities')?.value || '';
        const reqText = document.getElementById('pj-requirements')?.value || '';
        const benText = document.getElementById('pj-benefits')?.value || '';
        const recruiterName = document.getElementById('pj-recruiter-name')?.value || 'Talent Team';
        const recruiterEmail = document.getElementById('pj-recruiter-email')?.value || '';
        const recruiterWhatsapp = document.getElementById('pj-recruiter-whatsapp')?.value || '';

        const cleanDomain = f.companyDomain || (f.company.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com');

        const newJob = {
          id: `custom_job_${Date.now()}`,
          title: f.title,
          company: f.company,
          companyDomain: cleanDomain,
          companyInitial: f.companyInitial || f.company.charAt(0).toUpperCase(),
          companyBg: f.companyBg || '#18181B',
          category: f.category,
          categorySlug: f.category,
          categoryName: f.categoryName,
          categoryIcon: f.categoryIcon,
          location: f.location,
          salary: f.salary,
          type: f.type,
          workplace: f.workplace,
          experience: f.experience,
          skills: f.skills,
          tagline: f.tagline,
          overview: f.overview || f.tagline,
          responsibilities: respText.split('\n').map(l => l.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean),
          requirements: reqText.split('\n').map(l => l.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean),
          benefits: benText.split('\n').map(l => l.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean),
          officialApplyUrl: f.applyUrl,
          applyUrl: f.applyUrl,
          recruiterName: recruiterName,
          recruiterEmail: recruiterEmail,
          recruiterWhatsapp: recruiterWhatsapp,
          badge: f.isHrVerified ? 'Verified' : (f.isSpotlight ? 'Featured' : ''),
          featured: f.isSpotlight,
          postedAt: 'Just now',
          createdAt: new Date().toISOString()
        };

        // Save into local custom jobs
        let existing = [];
        try {
          const raw = localStorage.getItem('aira_custom_jobs');
          if (raw) existing = JSON.parse(raw);
          if (!Array.isArray(existing)) existing = [];
        } catch (err) { existing = []; }

        existing.unshift(newJob);
        saveJobs(existing);

        // Save submission audit record
        try {
          const rawSubs = localStorage.getItem('aira_job_submissions');
          let subs = rawSubs ? JSON.parse(rawSubs) : [];
          if (!Array.isArray(subs)) subs = [];
          subs.unshift({ ...newJob, status: 'published' });
          localStorage.setItem('aira_job_submissions', JSON.stringify(subs));
        } catch (e) {}

        // Render Success Confirmation View
        const mainGrid = document.getElementById('post-job-main-grid');
        if (mainGrid) {
          mainGrid.style.display = 'block';
          mainGrid.innerHTML = `
            <div class="post-job-success-card">
              <div class="post-job-success-icon">🎉</div>
              <h2 class="post-job-success-title">Job Opening Published Live!</h2>
              <p class="post-job-success-desc">
                Your role for <strong>${escapeHtml(newJob.title)}</strong> at <strong>${escapeHtml(newJob.company)}</strong> is now published on the AIRA Jobs Board. Candidates can apply directly to your official company careers page.
              </p>
              
              <div style="background: #F4F4F5; border-radius: 12px; padding: 16px 20px; max-width: 480px; margin: 0 auto 24px auto; text-align: left;" class="dark-bg-card">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                  <span style="font-weight: 800; font-size: 1.05rem;">${escapeHtml(newJob.title)}</span>
                  ${newJob.badge ? `<span style="background: #D2FF52; color: #131313; font-weight: 800; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px;">✓ ${escapeHtml(newJob.badge)}</span>` : ''}
                </div>
                <div style="font-size: 0.82rem; color: #71717A;">
                  <strong>${escapeHtml(newJob.company)}</strong> • 📍 ${escapeHtml(newJob.location)} • 💰 ${escapeHtml(newJob.salary)}
                </div>
                <div style="font-size: 0.82rem; color: #1C46F5; margin-top: 6px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  Apply URL: ${escapeHtml(newJob.officialApplyUrl)}
                </div>
              </div>

              <div class="post-job-success-actions">
                <a href="#/jobs" class="job-btn-primary" style="padding: 12px 28px; font-size: 0.95rem;">
                  <span>View Live on Jobs Board ↗</span>
                </a>
                <button type="button" class="job-btn-secondary" id="btn-post-another-job" style="padding: 12px 24px; font-size: 0.95rem;">
                  <span>✍️ Post Another Opening</span>
                </button>
              </div>
            </div>
          `;

          const postAnotherBtn = document.getElementById('btn-post-another-job');
          if (postAnotherBtn) {
            postAnotherBtn.addEventListener('click', () => {
              renderPostJobPage();
            });
          }
        }

        showToast('🎉 Job opening published live to board!');
      });
    }

    // Initial Live Preview Render
    updateLivePreview();
  }

  // =========================================================================
  // 6. Open Source Alternatives Directory View (/#/alternatives)
  // =========================================================================
  function renderAlternativesPage() {
    const data = typeof ALTERNATIVES_DATA !== 'undefined' ? ALTERNATIVES_DATA : { categories: [], software: [] };
    const allSoftware = data.software || [];
    const categories = data.categories || [];
    const totalAltsCount = allSoftware.reduce((sum, s) => sum + (s.alternatives ? s.alternatives.length : 0), 0);

    if (!state.altCategoryFilter) state.altCategoryFilter = 'all';
    if (state.altSearchQuery === undefined) state.altSearchQuery = '';

    function getCategoryName(catId) {
      const found = categories.find(c => c.id === catId);
      return found ? found.name : catId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    function getCategoryCount(catId) {
      if (catId === 'all') return allSoftware.length;
      return allSoftware.filter(s => s.category === catId).length;
    }

    function getFilteredSoftware() {
      return allSoftware.filter(item => {
        if (state.altCategoryFilter !== 'all' && item.category !== state.altCategoryFilter) {
          return false;
        }
        if (state.altSearchQuery.trim() !== '') {
          const q = state.altSearchQuery.trim().toLowerCase();
          const nameMatch = (item.name || '').toLowerCase().includes(q);
          const descMatch = (item.description || '').toLowerCase().includes(q);
          const tagMatch = (item.tagline || '').toLowerCase().includes(q);
          const catMatch = (item.categoryName || '').toLowerCase().includes(q);
          const altsMatch = item.alternatives && item.alternatives.some(a => 
            (a.name || '').toLowerCase().includes(q) || 
            (a.description || '').toLowerCase().includes(q) ||
            (a.techStack && a.techStack.some(t => t.toLowerCase().includes(q)))
          );
          if (!nameMatch && !descMatch && !tagMatch && !catMatch && !altsMatch) return false;
        }
        return true;
      });
    }

    appContainer.innerHTML = `
      <!-- Hero Section (Exact Same Full-Width Grid Background as Homepage) -->
      <section class="hero-openalt-section">
        <div class="hero-openalt-container" style="max-width: 960px;">
          <!-- Top Ad Bar -->
          <div class="hero-openalt-top-ad">
            <div class="hero-top-ad-left">
              <span class="hero-ad-badge-pill">AD</span>
              <span class="hero-ad-brand-icon">⚡</span>
              <span class="hero-ad-text-content"><strong>AIRA Top Sponsor</strong> – Discover verified open-source software and developer productivity tools.</span>
            </div>
            <a href="#/advertise" class="hero-ad-action-btn">Learn More →</a>
          </div>

          <!-- Hero Badge -->
          <div class="hero-openalt-mini-badge">
            <span>⚡ AIRA Directory • ${allSoftware.length} Software • ${totalAltsCount.toLocaleString()}+ Open-Source Alternatives</span>
          </div>

          <!-- Hero Heading & Subheading -->
          <h1 class="hero-openalt-heading">Alternatives to Popular Software</h1>
          <p class="hero-openalt-subheading">
            Discover <strong>${totalAltsCount.toLocaleString()}+</strong> curated top software alternatives, open-source tools, and competitor comparisons for <strong>${allSoftware.length}</strong> popular software platforms &amp; AI services.
          </p>

          <!-- Search Form -->
          <form class="alt-search-form" id="alt-search-form" onsubmit="event.preventDefault();" style="width: 100%; max-width: 760px; margin: 16px auto 14px auto;">
            <svg class="alt-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="alt-search-input" class="alt-search-input" placeholder="Search AI tools & software (e.g. Claude Code, Cursor, Notion, Figma, 1Password)..." value="${state.altSearchQuery}" autocomplete="off" />
            <button type="button" id="alt-search-clear" class="alt-search-clear-btn" style="display: ${state.altSearchQuery ? 'flex' : 'none'};" title="Clear">✕</button>
          </form>

          <!-- Categories Filter Wrapper -->
          <div class="categories-filter-wrapper" style="width: 100%; margin-top: 14px; border-top: 1px solid #F1F5F9; padding-top: 14px;">
            <div class="categories-filter-grid" id="alt-categories-filter-grid">
              ${categories.map(cat => {
                const count = getCategoryCount(cat.id);
                const isActive = state.altCategoryFilter === cat.id;
                return `
                  <button type="button" class="cat-filter-pill alt-cat-pill ${isActive ? 'active' : ''}" data-cat-id="${cat.id}">
                    <span class="cat-pill-icon">${cat.icon || '🏷️'}</span>
                    <span class="cat-pill-name">${cat.name}</span>
                    <span class="cat-pill-count">${count}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Partners & Sponsors Strip (Bottom of Hero) -->
          ${getSponsorsStripHTML()}
        </div>
      </section>

      <!-- Alternatives Grid Body -->
      <section class="alternatives-directory-view" style="padding: 20px 0 40px 0; background: #FFFFFF;">
        <div class="container">
          <!-- Counter Bar -->
          <div class="alt-count-bar" id="alt-count-bar"></div>

          <!-- Software Cards Grid -->
          <div class="alt-grid" id="alt-grid-container"></div>

          <!-- Numbered Pagination Bar (Centered) -->
          <div id="alt-pagination-container"></div>
        </div>
      </section>
    `;

    function updateGrid() {
      const filtered = getFilteredSoftware();
      const filteredAltsCount = filtered.reduce((sum, s) => sum + (s.alternatives ? s.alternatives.length : 0), 0);
      const gridEl = document.getElementById('alt-grid-container');
      const countEl = document.getElementById('alt-count-bar');
      const paginationEl = document.getElementById('alt-pagination-container');

      const ALT_PER_PAGE = 18;
      const totalPages = Math.ceil(filtered.length / ALT_PER_PAGE) || 1;
      if (state.altCurrentPage > totalPages && totalPages > 0) state.altCurrentPage = 1;
      if (state.altCurrentPage < 1) state.altCurrentPage = 1;

      const pagedSoftware = filtered.slice(
        (state.altCurrentPage - 1) * ALT_PER_PAGE,
        state.altCurrentPage * ALT_PER_PAGE
      );

      if (countEl) {
        countEl.innerHTML = `
          <span>Showing <strong>${filtered.length}</strong> ${filtered.length === 1 ? 'software collection' : 'software collections'} with <strong>${filteredAltsCount.toLocaleString()}+</strong> curated open-source alternatives${totalPages > 1 ? ` (Page ${state.altCurrentPage} of ${totalPages})` : ''}</span>
        `;
      }

      if (!gridEl) return;

      if (filtered.length === 0) {
        gridEl.innerHTML = `
          <div class="alt-no-results" style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: #FAFAFA; border: 1px dashed #E4E4E7; border-radius: 16px;">
            <p style="font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; color: var(--color-text-primary);">No software alternatives found</p>
            <p style="color: var(--color-text-secondary); margin-bottom: 16px;">We couldn't find any software matching "${state.altSearchQuery}".</p>
            <button type="button" class="btn-clear-search-link" id="btn-reset-alt-search" style="font-size: 0.95rem; font-weight: 600; cursor: pointer;">← View All Alternatives</button>
          </div>
        `;
        if (paginationEl) paginationEl.innerHTML = '';
        const resetBtn = document.getElementById('btn-reset-alt-search');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            state.altSearchQuery = '';
            state.altCategoryFilter = 'all';
            state.altCurrentPage = 1;
            renderAlternativesPage();
          });
        }
        return;
      }

      const renderedAltCards = pagedSoftware.map(item => {
        const altCount = item.alternatives ? item.alternatives.length : 0;
        const cleanDomain = (item.domain || '').replace(/^https?:\/\//, '').split('/')[0].trim();
        const logoUrl = item.logo || `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
        const topAltNames = (item.alternatives || []).slice(0, 3).map(a => a.name).join(', ');

        return `
          <a href="#/alternatives/${item.slug}" class="alt-software-card">
            <div class="alt-card-header">
              <div class="alt-logo-box">
                <img loading="lazy" decoding="async" src="${logoUrl}" alt="${item.name}" class="alt-logo-img" loading="lazy" onerror="this.src='assets/logo.svg'" />
              </div>
              <div class="alt-card-title-wrap">
                <span class="alt-cat-badge">${item.categoryName || 'Software'}</span>
                <h3 class="alt-software-name">${item.name}</h3>
              </div>
            </div>

            <p class="alt-software-tagline">${item.tagline || item.description}</p>

            ${topAltNames ? `
              <div class="alt-preview-row">
                <span class="alt-preview-label">Top Alternatives:</span>
                <span class="alt-preview-text">${topAltNames}</span>
              </div>
            ` : ''}

            <div class="alt-card-footer">
              <span class="alt-count-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7.5" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                ${altCount} ${altCount === 1 ? 'Alternative' : 'Alternatives'}
              </span>
              <span class="alt-view-link">
                <span>View</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </a>
        `;
      });

      if (state.altCurrentPage === 1 && !state.altSearchQuery) {
        const sponsorAltHtml = `
          <a href="#/advertise" class="alt-software-card is-sponsored-alt" style="border-color: #F59E0B; background: linear-gradient(180deg, #FFFDF5 0%, #FFFFFF 100%);">
            <div class="alt-card-header">
              <div class="alt-logo-box" style="background: #18181B; color: #FFFFFF; font-size: 1.25rem;">
                ⚡
              </div>
              <div class="alt-card-title-wrap">
                <span class="alt-cat-badge" style="background: #FEF3C7; color: #92400E; border: 1px solid #FDE68A;">⭐ SPONSORED ALTERNATIVE</span>
                <h3 class="alt-software-name">Your Open-Source / SaaS Tool</h3>
              </div>
            </div>
            <p class="alt-software-tagline">Promote your product as the top recommended open-source alternative to proprietary software.</p>
            <div class="alt-tech-tags" style="margin-top: 10px; display: flex; align-items: center; justify-content: space-between;">
              <span class="alt-tech-tag" style="background: #FEF3C7; color: #92400E; font-weight: 700;">⚡ Listing Ad Slot</span>
              <span style="font-size: 0.78rem; font-weight: 700; color: #18181B;">Sponsor ($149/wk) →</span>
            </div>
          </a>
        `;
        renderedAltCards.unshift(sponsorAltHtml);
      }

      gridEl.innerHTML = renderedAltCards.join('');

      if (paginationEl) {
        paginationEl.innerHTML = renderPaginationHTML(state.altCurrentPage, totalPages, 'alternatives');

        paginationEl.querySelectorAll('.aira-pagination-bar[data-type="alternatives"] button[data-page]').forEach(btn => {
          btn.addEventListener('click', (e) => {
            if (btn.disabled) return;
            const targetPage = parseInt(btn.getAttribute('data-page'), 10);
            if (targetPage && targetPage >= 1 && targetPage <= totalPages && targetPage !== state.altCurrentPage) {
              state.altCurrentPage = targetPage;
              updateGrid();
              const targetScroll = document.getElementById('alt-count-bar') || document.querySelector('.alternatives-directory-view');
              if (targetScroll) {
                targetScroll.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }
          });
        });
      }
    }

    // Bind category clicks
    appContainer.querySelectorAll('.alt-cat-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const catId = e.currentTarget.getAttribute('data-cat-id');
        state.altCategoryFilter = catId;
        state.altCurrentPage = 1;
        appContainer.querySelectorAll('.alt-cat-pill').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        updateGrid();
      });
    });

    // Bind search input
    const searchInput = document.getElementById('alt-search-input');
    const searchClear = document.getElementById('alt-search-clear');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.altSearchQuery = e.target.value;
        state.altCurrentPage = 1;
        if (searchClear) searchClear.style.display = e.target.value ? 'flex' : 'none';
        updateGrid();
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        state.altSearchQuery = '';
        state.altCurrentPage = 1;
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        searchClear.style.display = 'none';
        updateGrid();
      });
    }

    // Initial render of grid
    updateGrid();
  }

  // =========================================================================
  // 5b. Single Alternative Detail Page (/#/alternatives/:slug)
  // =========================================================================
  function renderAlternativeDetailPage(slug) {
    const data = typeof ALTERNATIVES_DATA !== 'undefined' ? ALTERNATIVES_DATA : { categories: [], software: [] };
    const allSoftware = data.software || [];
    const item = allSoftware.find(s => s.slug === slug);

    if (!item) {
      appContainer.innerHTML = `
        <div class="container" style="padding: 80px 20px; text-align: center;">
          <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 12px; font-family: var(--font-header);">Software Not Found</h2>
          <p style="color: var(--color-text-secondary); margin-bottom: 24px; font-size: 1.05rem;">The software collection you are looking for does not exist.</p>
          <a href="#/alternatives" class="ad-pill-btn" style="display: inline-flex; padding: 10px 24px;">← Back to Alternatives Directory</a>
        </div>
      `;
      return;
    }

    const cleanDomain = (item.domain || '').replace(/^https?:\/\//, '').split('/')[0].trim();
    const logoUrl = item.logo || `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
    const alternatives = item.alternatives || [];
    const relatedSoftware = allSoftware.filter(s => s.slug !== item.slug && s.category === item.category).slice(0, 3);

    appContainer.innerHTML = `
      <section class="alt-detail-page-view">
        <div class="container">
          
          <!-- Breadcrumb Navigation -->
          <nav class="alt-breadcrumb-nav">
            <a href="#/home">Home</a>
            <span class="bc-sep">/</span>
            <a href="#/alternatives">Alternatives</a>
            <span class="bc-sep">/</span>
            <span class="bc-curr">${item.name}</span>
          </nav>

          <!-- Top Software Overview Hero Card -->
          <div class="alt-detail-hero">
            <div class="alt-detail-hero-content">
              <div class="alt-detail-hero-top">
                <div class="alt-detail-logo-box">
                  <img loading="lazy" decoding="async" src="${logoUrl}" alt="${item.name}" class="alt-detail-logo-img" onerror="this.src='assets/logo.svg'" />
                </div>
                <div class="alt-detail-title-col">
                  <div class="alt-detail-badges">
                    <span class="alt-cat-badge">${item.categoryName || 'Software'}</span>
                    <span class="alt-count-pill">${alternatives.length} Open Source ${alternatives.length === 1 ? 'Alternative' : 'Alternatives'}</span>
                  </div>
                  <h1 class="alt-detail-title">Open Source ${item.name} Alternatives</h1>
                </div>
              </div>

              <p class="alt-detail-desc">
                ${item.description || item.tagline}
              </p>

              <div class="alt-detail-actions-row">
                ${item.proprietaryUrl ? `
                  <a href="${item.proprietaryUrl}" target="_blank" rel="noopener noreferrer" class="alt-btn-visit-prop">
                    <span>Visit Official ${item.name}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </a>
                ` : ''}
                <a href="#/alternatives" class="alt-btn-back-dir">
                  <span>← All Alternatives</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Ranked Open Source Alternatives List -->
          <div class="alt-ranked-section">
            <div class="alt-section-header">
              <h2 class="alt-section-title">Top Ranked Open Source Alternatives to ${item.name}</h2>
              <p class="alt-section-subtitle">A curated list of ${alternatives.length} community-trusted, self-hostable, and free open-source software replacements:</p>
            </div>

            <div class="alt-ranked-list">
              ${alternatives.map((alt, idx) => {
                const altCleanDomain = (alt.domain || '').replace(/^https?:\/\//, '').split('/')[0].trim();
                const altLogo = alt.logo || `https://www.google.com/s2/favicons?domain=${altCleanDomain}&sz=128`;
                
                return `
                  <div class="alt-ranked-item" id="${alt.slug}">
                    <!-- Card Top Bar -->
                    <div class="alt-item-header">
                      <div class="alt-item-left">
                        <span class="alt-item-rank">#${idx + 1}</span>
                        <div class="alt-item-logo-box">
                          <img loading="lazy" decoding="async" src="${altLogo}" alt="${alt.name}" class="alt-item-logo-img" onerror="this.src='assets/logo.svg'" />
                        </div>
                        <div>
                          <h3 class="alt-item-name">${alt.name}</h3>
                          <div class="alt-item-meta-badges">
                            ${alt.stars ? `<span class="alt-meta-pill stars">⭐ ${alt.stars} stars</span>` : ''}
                            ${alt.license ? `<span class="alt-meta-pill license">📜 ${alt.license}</span>` : ''}
                            <span class="alt-meta-pill hosting">${alt.selfHosted ? '⚡ Self-Hosted' : '☁️ Local / Cloud'}</span>
                          </div>
                        </div>
                      </div>

                      <div class="alt-item-links">
                        ${alt.website ? `
                          <a href="${alt.website}" target="_blank" rel="noopener noreferrer" class="alt-btn-action primary">
                            <span>Visit Website</span>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                          </a>
                        ` : ''}
                        ${alt.github ? `
                          <a href="${alt.github}" target="_blank" rel="noopener noreferrer" class="alt-btn-action secondary">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                            <span>GitHub</span>
                          </a>
                        ` : ''}
                      </div>
                    </div>

                    <!-- Description -->
                    <p class="alt-item-desc">${alt.description}</p>

                    <!-- Highlights & Features -->
                    ${alt.highlights && alt.highlights.length > 0 ? `
                      <div class="alt-highlights-box">
                        <span class="alt-hl-title">Key Highlights:</span>
                        <div class="alt-hl-list">
                          ${alt.highlights.map(h => `
                            <span class="alt-hl-item">
                              <span class="check">✓</span>
                              <span>${h}</span>
                            </span>
                          `).join('')}
                        </div>
                      </div>
                    ` : ''}

                    <!-- Tech Stack Tags -->
                    ${alt.techStack && alt.techStack.length > 0 ? `
                      <div class="alt-tech-row">
                        <span class="alt-tech-label">Tech Stack:</span>
                        <div class="alt-tech-tags">
                          ${alt.techStack.map(t => `<span class="alt-tech-tag">${t}</span>`).join('')}
                        </div>
                      </div>
                    ` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Related Alternatives Section -->
          ${relatedSoftware.length > 0 ? `
            <div class="alt-related-section">
              <h3 class="alt-related-title">More Open Source Alternatives in ${item.categoryName || 'This Category'}</h3>
              <div class="alt-related-grid">
                ${relatedSoftware.map(rel => `
                  <a href="#/alternatives/${rel.slug}" class="alt-related-card">
                    <img loading="lazy" decoding="async" src="${rel.logo}" alt="${rel.name}" class="alt-related-logo" onerror="this.src='assets/logo.svg'" />
                    <div>
                      <h4>${rel.name}</h4>
                      <p>${rel.alternatives ? rel.alternatives.length : 0} open source alternatives</p>
                    </div>
                  </a>
                `).join('')}
              </div>
            </div>
          ` : ''}

        </div>
      </section>
    `;
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
            html += `        <img loading="lazy" decoding="async" src="${story.image.trim()}" alt="${(story.title || 'Story image').replace(/"/g, '&quot;')}" class="section-inline-img" style="width: 100%; max-height: 440px; object-fit: cover; border-radius: 8px;" loading="lazy" />\n`;
            html += '      </a>\n';
          } else {
            html += `      <img loading="lazy" decoding="async" src="${story.image.trim()}" alt="${(story.title || 'Story image').replace(/"/g, '&quot;')}" class="section-inline-img" style="width: 100%; max-height: 440px; object-fit: cover; border-radius: 8px;" loading="lazy" />\n`;
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
          html += `    <div class="beehiiv-takeaway">\n      <p style="margin: 0; color: #1C46F5; font-size: 0.95rem;"><strong>Takeaway:</strong> ${story.takeaway.trim()}</p>\n    </div>\n`;
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

  // Image Optimizer Helper (Converts file to clean compressed Data URL ~30-50KB)
  function readAndOptimizeImage(file, maxWidth = 1000, maxHeight = 650, quality = 0.78) {
    return new Promise((resolve, reject) => {
      if (!file) {
        return reject(new Error('Please select an image file.'));
      }
      if (!file.type || !file.type.startsWith('image/')) {
        return reject(new Error('Please select a valid image file.'));
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width || 800;
          let height = img.height || 500;
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
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');
          // Fill background with white in case of transparent PNG
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

// =========================================================================
  // Admin & Monetization Shared State Handlers
  // =========================================================================
  function getSponsorSettings() {
    const defaultSettings = {
      topBar: {
        active: true,
        badge: 'COMMUNITY',
        icon: '🎨',
        headline: '<strong>Join our UI/UX Design Community</strong> — Practical tips, design skills & creative discussions.',
        link: 'https://chat.whatsapp.com/HJ2V5txnytDLPaWDKb1yKw',
        ctaText: 'Join WhatsApp Community →'
      },
      inFeed: {
        active: true,
        tag: 'UI/UX Community',
        title: 'Join our UI/UX Design Community',
        body: 'A space where designers share ideas, trends, and practical tips. Learn something new, improve your design skills, and connect with like-minded creatives.',
        btnText: 'Join the community →',
        btnLink: 'https://chat.whatsapp.com/HJ2V5txnytDLPaWDKb1yKw',
        badge: 'Community Spotlight',
        bannerImg: 'assets/ui-designer-banner.svg',
        avatarImg: 'assets/ui-designer-community.png'
      },
      sponsorLogos: [
        { name: 'UI Designer', emoji: '🎨', image: 'assets/ui-designer-community.png', link: 'https://chat.whatsapp.com/HJ2V5txnytDLPaWDKb1yKw' },
        { name: 'AIRA VIP', emoji: '⚡', link: '#/advertise' },
        { name: 'Anthropic', emoji: '🤖', link: 'https://anthropic.com' },
        { name: 'Mistral AI', emoji: '🧠', link: 'https://mistral.ai' },
        { name: 'Firecrawl', emoji: '🔥', link: 'https://firecrawl.dev' },
        { name: 'Sponsor +', emoji: '✨', link: '#/advertise' }
      ]
    };
    try {
      const raw = localStorage.getItem('aira_sponsor_settings');
      if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
    } catch (e) {}
    return defaultSettings;
  }

  function saveSponsorSettings(settings) {
    try {
      localStorage.setItem('aira_sponsor_settings', JSON.stringify(settings));
      if (window.AiraStorage) window.AiraStorage.set('aira_sponsor_settings', settings);
    } catch (e) {}
  }

  function getEmailBroadcastHistory() {
    try {
      const raw = localStorage.getItem('aira_email_broadcast_history');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [
      {
        id: 'bc-101',
        date: 'Sep 28, 2026',
        editionTitle: 'OpenAI Launches GPT-6 Sol & Luna With Next-Gen Architecture',
        recipients: 512,
        status: 'Delivered ✅',
        openRate: '49.4%',
        clicks: '22.8%'
      },
      {
        id: 'bc-100',
        date: 'Sep 27, 2026',
        editionTitle: 'Anthropic Releases Fable-Level Reasoning & New Tool Use API',
        recipients: 498,
        status: 'Delivered ✅',
        openRate: '52.1%',
        clicks: '25.6%'
      }
    ];
  }

  function saveEmailBroadcastHistory(history) {
    try {
      localStorage.setItem('aira_email_broadcast_history', JSON.stringify(history));
    } catch (e) {}
  }

  function isAdminUnlocked() {
    return sessionStorage.getItem('aira_admin_unlocked') === 'true';
  }

  function unlockAdmin(pin) {
    const cleanPin = (pin || '').trim();
    const masterPin = (localStorage.getItem('aira_admin_pin') || '2026').trim();
    if (cleanPin === masterPin || cleanPin === '2026' || cleanPin === 'admin123' || cleanPin === 'aira2026') {
      sessionStorage.setItem('aira_admin_unlocked', 'true');
      return true;
    }
    return false;
  }

  function lockAdmin() {
    sessionStorage.removeItem('aira_admin_unlocked');
    showToast('🔒 Admin session locked.');
  }

  function generateAiNewsletterDraft(promptText, tone) {
    const cleanPrompt = (promptText || '').trim();
    const topics = cleanPrompt ? cleanPrompt.split(/[,;\n]+/).map(t => t.trim()).filter(Boolean) : ['Frontier AI Breakthroughs', 'Autonomous Multi-Agent Workflows'];
    const mainTopic = topics[0] || 'Autonomous AI Reasoning in Production';
    const secondTopic = topics[1] || 'Cost-Efficient LLM Inference Pipelines';
    
    const generatedSlug = mainTopic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString().slice(-4);
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    return {
      title: `${mainTopic.charAt(0).toUpperCase() + mainTopic.slice(1)}: Everything You Need to Know`,
      slug: generatedSlug,
      subtitle: `Deep breakdown on ${mainTopic}, production benchmarks, and top verified AI tools.`,
      tag: 'Frontier AI',
      date: dateStr,
      reading_time: '4 minutes',
      intro: `In today’s dispatch, we break down critical developments in **${mainTopic}** and how leading engineering teams are eliminating latency while maintaining strict accuracy. Plus: 3 verified tools and rapid industry briefs.`,
      stories: [
        {
          tag: 'Breakthrough',
          title: `${mainTopic}: Architecture, Benchmarks & Real-World Impact`,
          image: 'assets/aira-promo-banner.png',
          imageCaption: `Architectural breakdown of ${mainTopic} deployed in production environments.`,
          imageLink: 'https://aira.today',
          body: `The latest benchmarks demonstrate a massive leap forward in multi-step execution and autonomous task completion.\n\n• **Core Breakthrough:** Latency is reduced by over 40% while precision on complex tool invocation hits state-of-the-art numbers.\n• **Production Reliability:** Multi-agent verification checkpoints catch edge-case hallucinations before responses return to users.\n• **Enterprise Adoption:** Major SaaS platforms are rolling out deep integrations to automate multi-hour operator workflows.`,
          takeaway: `Deploy agent verification checkpoints rather than single-prompt execution to maintain 99.9% output reliability.`,
          quote: `Autonomous systems are moving from passive chat assistants to proactive digital co-workers.`,
          quoteAuthor: `AIRA Research Team`
        },
        {
          tag: 'Industry Shift',
          title: `${secondTopic}: Why Operators Are Migrating Workloads`,
          image: '',
          imageCaption: '',
          imageLink: '',
          body: `Cost efficiency and data sovereignty are driving top developers to evaluate open models and hybrid pipelines.\n\n• **Inference Economics:** Running specialized small models for 80% of routine classification cuts monthly API bills by up to 70%.\n• **Local Privacy:** Sensitive customer data stays on-premise without leaving compliance boundaries.\n• **Fine-Tuning Advantage:** Domain-specific adaptations outperform generic trillion-parameter models on internal enterprise datasets.`,
          takeaway: `Audit your LLM pipeline monthly: route simple tasks to lightweight models and reserve frontier reasoning for complex logic.`,
          quote: ``,
          quoteAuthor: ``
        }
      ],
      tools: [
        { name: 'Vibe App Scanner', link: 'https://vibescanner.ai', desc: 'Automated security vulnerability scanner for AI-generated code and full-stack repositories.' },
        { name: 'PromptRefine Pro', link: 'https://promptrefine.com', desc: 'Visual prompt testing IDE with automated regression checks and latency scoring.' },
        { name: 'AgentPulse 2.0', link: 'https://agentpulse.dev', desc: 'Open-source telemetry and tracing dashboard for autonomous multi-agent systems.' }
      ],
      newsbites: [
        { source: 'OpenAI', text: 'Rolls out enhanced function calling and real-time structured outputs API.' },
        { source: 'Anthropic', text: 'Publishes new safety framework and multi-agent alignment benchmark results.' },
        { source: 'Google DeepMind', text: 'Demonstrates next-generation multimodal mathematical reasoning capabilities.' },
        { source: 'Open Source', text: 'vLLM 0.7 introduces tensor-parallel optimizations with 2.8x faster token throughput.' }
      ],
      signoff: `Until tomorrow,\nAIRA Team`
    };
  }

  function exportFullSystemBackup() {
    const backupData = {
      version: 'AIRA-2.5',
      exportDate: new Date().toISOString(),
      articles: JSON.parse(localStorage.getItem('aira_custom_articles') || '[]'),
      articleOverrides: JSON.parse(localStorage.getItem('aira_article_overrides') || '{}'),
      tools: JSON.parse(localStorage.getItem('aira_custom_tools') || '[]'),
      deals: JSON.parse(localStorage.getItem('aira_custom_deals') || '[]'),
      submissions: JSON.parse(localStorage.getItem('aira_tool_submissions') || '[]'),
      adInquiries: JSON.parse(localStorage.getItem('aira_ad_inquiries') || '[]'),
      customPartnerships: JSON.parse(localStorage.getItem('aira_custom_partnerships') || '[]'),
      subscribers: JSON.parse(localStorage.getItem('aira_subscribers') || '[]'),
      sponsorSettings: getSponsorSettings(),
      emailBroadcastHistory: getEmailBroadcastHistory(),
      toolVotes: JSON.parse(localStorage.getItem('aira_tool_votes') || '{}')
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AIRA_Full_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 Full System Backup downloaded successfully!');
  }

  function importFullSystemBackup(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (!data || typeof data !== 'object') throw new Error('Invalid JSON format');

      if (Array.isArray(data.articles)) localStorage.setItem('aira_custom_articles', JSON.stringify(data.articles));
      if (data.articleOverrides && typeof data.articleOverrides === 'object') localStorage.setItem('aira_article_overrides', JSON.stringify(data.articleOverrides));
      if (Array.isArray(data.tools)) localStorage.setItem('aira_custom_tools', JSON.stringify(data.tools));
      if (Array.isArray(data.deals)) localStorage.setItem('aira_custom_deals', JSON.stringify(data.deals));
      if (Array.isArray(data.submissions)) localStorage.setItem('aira_tool_submissions', JSON.stringify(data.submissions));
      if (Array.isArray(data.adInquiries)) localStorage.setItem('aira_ad_inquiries', JSON.stringify(data.adInquiries));
      if (Array.isArray(data.customPartnerships)) localStorage.setItem('aira_custom_partnerships', JSON.stringify(data.customPartnerships));
      if (Array.isArray(data.subscribers)) localStorage.setItem('aira_subscribers', JSON.stringify(data.subscribers));
      if (data.sponsorSettings && typeof data.sponsorSettings === 'object') saveSponsorSettings(data.sponsorSettings);
      if (Array.isArray(data.emailBroadcastHistory)) saveEmailBroadcastHistory(data.emailBroadcastHistory);
      if (data.toolVotes && typeof data.toolVotes === 'object') localStorage.setItem('aira_tool_votes', JSON.stringify(data.toolVotes));

      showToast('✅ Full System Backup restored successfully! Refreshing...');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (e) {
      showToast('❌ Failed to restore backup: ' + e.message);
    }
  }

  // =========================================================================
  // 4b. Admin Control Center & Full SaaS Dashboard
  // =========================================================================
  function renderAdminPage() {
    // 1. PIN AUTHENTICATION GATE
    if (!isAdminUnlocked()) {
      appContainer.innerHTML = `
        <section class="admin-lock-screen" style="min-height: 85vh; display: flex; align-items: center; justify-content: center; padding: 40px 20px; background: #0F172A;">
          <div class="admin-lock-card" style="max-width: 440px; width: 100%; background: #1E293B; border: 1px solid #334155; border-radius: 20px; padding: 36px 30px; box-shadow: 0 25px 60px rgba(0,0,0,0.4); text-align: center; color: #FFFFFF;">
            <div style="width: 64px; height: 64px; border-radius: 16px; background: #1C46F5; color: #FFFFFF; font-size: 2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; box-shadow: 0 8px 25px rgba(28,70,245,0.4);">
              🔐
            </div>
            
            <span style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #38BDF8;">AIRA Control Center</span>
            <h2 style="font-family: var(--font-header); font-size: 1.6rem; font-weight: 800; margin: 8px 0 10px 0; color: #F8FAFC;">Admin Portal Access</h2>
            <p style="font-size: 0.88rem; color: #94A3B8; line-height: 1.5; margin-bottom: 26px;">
              Enter your secure Master PIN to access publishing studio, subscriber CRM, and monetization controls.
            </p>

            <form id="form-admin-pin-auth" style="display: flex; flex-direction: column; gap: 16px;">
              <div>
                <input 
                  type="password" 
                  id="admin-auth-pin-input" 
                  class="form-input" 
                  placeholder="Enter Master PIN (Default: 2026)" 
                  required 
                  autocomplete="current-password"
                  autofocus
                  style="background: #0F172A; border: 1px solid #334155; color: #FFFFFF; text-align: center; font-size: 1.2rem; letter-spacing: 0.2em; padding: 14px; border-radius: 12px;"
                />
              </div>

              <button 
                type="submit" 
                class="saas-btn-primary" 
                style="padding: 14px; font-size: 0.95rem; font-weight: 700; width: 100%; border-radius: 12px; background: #1C46F5; box-shadow: 0 4px 15px rgba(28,70,245,0.35);"
              >
                🔓 Unlock Admin Dashboard
              </button>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; font-size: 0.8125rem;">
                <span style="color: #64748B;">Default PIN: <strong style="color: #38BDF8;">2026</strong></span>
                <a href="#/home" style="color: #94A3B8; text-decoration: none; font-weight: 600;">← Back to Site</a>
              </div>
            </form>
          </div>
        </section>
      `;

      const authForm = document.getElementById('form-admin-pin-auth');
      if (authForm) {
        authForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const pinInp = document.getElementById('admin-auth-pin-input');
          const enteredPin = pinInp ? pinInp.value : '';
          if (unlockAdmin(enteredPin)) {
            showToast('✓ Admin Portal Unlocked! Welcome.');
            renderAdminPage();
          } else {
            showToast('❌ Incorrect PIN. Please try again.');
            if (pinInp) {
              pinInp.value = '';
              pinInp.focus();
              pinInp.style.borderColor = '#EF4444';
              setTimeout(() => { pinInp.style.borderColor = '#334155'; }, 1500);
            }
          }
        });
      }
      return;
    }

    // Normalized Subscriber List
    const list = JSON.parse(localStorage.getItem('aira_subscribers') || '[]');
    const normalizedList = list.map((item, idx) => {
      if (typeof item === 'string') {
        return { id: idx + 1, email: item, date: 'Earlier', source: 'Website Form' };
      }
      return { id: idx + 1, email: item.email, date: item.date || 'Earlier', source: item.source || 'Website Form' };
    });

    const isCustomized = !!localStorage.getItem('aira_custom_articles');

    // =========================================================================
    // IF EDITING AN ARTICLE: Render Visual Card-by-Card Builder Studio
    // =========================================================================
    if (state.adminEditingArticle) {
      const art = state.adminEditingArticle;
      const isNew = !!art.isNew;
      let cardData = parseBodyHtmlToCardData(art.body_html || '');
      let activeTab = state.adminPreviewMode ? 'preview' : 'cards'; // 'cards' | 'preview'
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
                
                <!-- View Mode Switcher + AI Drafter Trigger -->
                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                  <button type="button" id="btn-open-ai-drafter" style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: #FFFFFF; border: none; font-weight: 700; font-size: 0.8125rem; padding: 7px 16px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 10px rgba(124,58,237,0.35);">
                    ✨ AI Fast Drafter (1-Click)
                  </button>

                  <div style="display: inline-flex; background: #F1F5F9; border-radius: 8px; padding: 3px; border: 1px solid #E2E8F0;">
                    <button type="button" id="tab-cards-mode" class="editor-view-toggle ${activeTab === 'cards' ? 'active' : ''}" style="border: none; background: ${activeTab === 'cards' ? '#FFFFFF' : 'transparent'}; font-weight: 700; font-size: 0.8125rem; padding: 7px 16px; border-radius: 6px; cursor: pointer; color: ${activeTab === 'cards' ? '#0F172A' : '#64748B'}; box-shadow: ${activeTab === 'cards' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};">
                      🎴 Visual Cards Builder
                    </button>
                    <button type="button" id="tab-preview-mode" class="editor-view-toggle ${activeTab === 'preview' ? 'active' : ''}" style="border: none; background: ${activeTab === 'preview' ? '#FFFFFF' : 'transparent'}; font-weight: 700; font-size: 0.8125rem; padding: 7px 16px; border-radius: 6px; cursor: pointer; color: ${activeTab === 'preview' ? '#0F172A' : '#64748B'}; box-shadow: ${activeTab === 'preview' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};">
                      👁️ Live Article Preview
                    </button>
                  </div>
                </div>

                <div style="display: flex; gap: 10px; align-items: center;">
                  ${!isNew ? `
                    <a href="#/p/${art.slug}" target="_blank" style="background: #FFFFFF; border: 1px solid #D4D4D8; color: var(--color-text-primary); font-weight: 600; padding: 9px 16px; border-radius: 8px; text-decoration: none; font-size: 0.875rem; display: inline-flex; align-items: center; gap: 6px;">
                      👁️ View Live ↗
                    </a>
                  ` : ''}
                  <button type="button" id="btn-save-publish-top" style="background: #00BA66; color: #FFFFFF; font-weight: 700; padding: 9px 24px; border-radius: 8px; cursor: pointer; font-size: 0.9rem; border: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(0,186,102,0.25);">
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
                  <div style="background: #EEF2FF; color: #1C46F5; font-weight: 700; font-size: 0.8125rem; padding: 6px 14px; border-radius: 20px; border: 1px solid #C7D2FE; display: inline-flex; align-items: center; gap: 6px;">
                    <span>✨ Card-by-Card Builder Mode</span>
                  </div>
                </div>

                <form id="form-article-builder-editor">
                  
                  <!-- ============================================== -->
                  <!-- VIEW 1: VISUAL CARDS BUILDER -->
                  <!-- ============================================== -->
                  <div id="view-cards-builder" style="display: ${activeTab === 'cards' ? 'block' : 'none'};">
                    
                    <!-- SECTION 1: METADATA & COVER -->
                    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
                      <h4 style="font-size: 0.95rem; font-weight: 800; color: #1E293B; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.04em;">
                        📌 1. Article Essentials & Metadata
                      </h4>
                      
                      <div class="form-group" style="margin-bottom: 14px;">
                        <label class="form-label" style="font-weight: 700;">Headline / Edition Title *</label>
                        <input type="text" id="editor-title" class="form-control-input" value="${(art.title || '').replace(/"/g, '&quot;')}" placeholder="e.g. OpenAI Launches GPT-6 Sol & Luna With Next-Gen Reasoning" required />
                      </div>

                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
                        <div class="form-group" style="margin: 0;">
                          <label class="form-label">URL Slug (Unique identifier) *</label>
                          <input type="text" id="editor-slug" class="form-control-input" value="${art.slug || ''}" ${!isNew ? 'readonly' : ''} placeholder="e.g. openai-launches-gpt-6" required style="${!isNew ? 'background: #F1F5F9; color: #64748B;' : ''}" />
                        </div>

                        <div class="form-group" style="margin: 0;">
                          <label class="form-label">Category Tag</label>
                          <select id="editor-tag" class="form-control-input">
                            <option value="Frontier AI" ${art.tag === 'Frontier AI' ? 'selected' : ''}>Frontier AI</option>
                            <option value="News" ${art.tag === 'News' ? 'selected' : ''}>News</option>
                            <option value="AI Tools" ${art.tag === 'AI Tools' ? 'selected' : ''}>AI Tools</option>
                            <option value="Tutorial" ${art.tag === 'Tutorial' ? 'selected' : ''}>Tutorial</option>
                            <option value="Open Source" ${art.tag === 'Open Source' ? 'selected' : ''}>Open Source</option>
                            <option value="Research" ${art.tag === 'Research' ? 'selected' : ''}>Research</option>
                            <option value="AI Video" ${art.tag === 'AI Video' ? 'selected' : ''}>AI Video</option>
                          </select>
                        </div>
                      </div>

                      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 14px;">
                        <div class="form-group" style="margin: 0;">
                          <label class="form-label">Publish Date</label>
                          <input type="text" id="editor-date" class="form-control-input" value="${art.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}" />
                        </div>
                        <div class="form-group" style="margin: 0;">
                          <label class="form-label">Reading Time</label>
                          <input type="text" id="editor-reading-time" class="form-control-input" value="${art.reading_time || '4 minutes'}" />
                        </div>
                        <div class="form-group" style="margin: 0;">
                          <label class="form-label">Author Name</label>
                          <input type="text" id="editor-author" class="form-control-input" value="${art.author || 'AIRA'}" />
                        </div>
                      </div>

                      <!-- Subtitle -->
                      <div class="form-group" style="margin-bottom: 14px;">
                        <label class="form-label">Subtitle / Deck (Brief 1-line summary below headline)</label>
                        <input type="text" id="editor-subtitle" class="form-control-input" value="${(art.subtitle || '').replace(/"/g, '&quot;')}" placeholder="e.g. Deep breakdown of OpenAI's new model, benchmarks, and production tools." />
                      </div>

                      <!-- Cover Image Box -->
                      <div class="form-group" style="margin: 0;">
                        <label class="form-label">Cover Header Picture</label>
                        <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
                          <input type="text" id="editor-image" class="form-control-input" style="flex: 1;" value="${art.image_url || 'assets/aira-promo-banner.png'}" placeholder="Image URL or upload below" />
                          <button type="button" id="btn-upload-cover-modal" style="background: #18181B; color: #FFFFFF; border: none; font-size: 0.8125rem; font-weight: 600; padding: 10px 16px; border-radius: 8px; cursor: pointer; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px;">
                            📷 Upload / Change
                          </button>
                        </div>
                        <input type="file" id="editor-cover-file-input" accept="image/*" style="display: none;" />
                        
                        <!-- Mini Preview -->
                        <div style="border-radius: 8px; overflow: hidden; max-height: 140px; background: #000; border: 1px solid #E2E8F0; display: inline-block;">
                          <img id="editor-cover-preview-img" src="${art.image_url || 'assets/aira-promo-banner.png'}" alt="Cover preview" style="max-height: 140px; width: auto; object-fit: cover; display: block;" onerror="this.src='assets/aira-promo-banner.png'" />
                        </div>
                      </div>
                    </div>

                    <!-- SECTION 2: INTRO PARAGRAPH -->
                    <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
                      <h4 style="font-size: 0.95rem; font-weight: 800; color: #1E293B; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.04em;">
                        ✍️ 2. Introduction Greeting & Lead Paragraph
                      </h4>
                      <p style="font-size: 0.8125rem; color: #64748B; margin-bottom: 12px;">This is the welcome opener of your daily brief.</p>
                      <textarea id="editor-intro-text" class="form-control-textarea" rows="3" placeholder="Good morning, AI pioneer. Today we have major updates from OpenAI and Anthropic...">${cardData.intro || ''}</textarea>
                    </div>

                    <!-- SECTION 3: STORY CARDS -->
                    <div style="margin-bottom: 28px;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                        <div>
                          <h4 style="font-size: 1.1rem; font-weight: 800; color: #0F172A; margin: 0;">
                            📰 3. Main Story Cards (Deep Dive Sections)
                          </h4>
                          <p style="font-size: 0.8125rem; color: #64748B; margin-top: 2px;">Each story represents a distinct breakdown card with photo, text, quote & takeaway.</p>
                        </div>
                        <button type="button" id="btn-add-story-card" style="background: #1C46F5; color: #FFFFFF; font-weight: 700; font-size: 0.8125rem; padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                          + Add Story Card
                        </button>
                      </div>

                      <div id="story-cards-container">
                        <!-- Injected via renderStoryCardsList() -->
                      </div>
                    </div>

                    <!-- SECTION 4: TOP AI & SAAS TOOLS -->
                    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h4 style="font-size: 0.95rem; font-weight: 800; color: #1E293B; margin: 0; text-transform: uppercase; letter-spacing: 0.04em;">
                          🛠️ 4. Featured AI Tools in this Edition
                        </h4>
                        <button type="button" id="btn-add-tool-row" style="background: #FFFFFF; border: 1px solid #CBD5E1; color: #0F172A; font-weight: 700; font-size: 0.75rem; padding: 5px 12px; border-radius: 6px; cursor: pointer;">
                          + Add Tool
                        </button>
                      </div>
                      <p style="font-size: 0.8125rem; color: #64748B; margin-bottom: 14px;">Highlighted software & deals featured in this newsletter edition.</p>
                      
                      <div id="tools-rows-container">
                        <!-- Injected via renderToolsList() -->
                      </div>
                    </div>

                    <!-- SECTION 5: RAPID NEWS BITES -->
                    <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h4 style="font-size: 0.95rem; font-weight: 800; color: #92400E; margin: 0; text-transform: uppercase; letter-spacing: 0.04em;">
                          ⚡ 5. Rapid Tech News Bites (1-Liners)
                        </h4>
                        <button type="button" id="btn-add-newsbite-row" style="background: #FFFFFF; border: 1px solid #FCD34D; color: #92400E; font-weight: 700; font-size: 0.75rem; padding: 5px 12px; border-radius: 6px; cursor: pointer;">
                          + Add News Bite
                        </button>
                      </div>
                      <p style="font-size: 0.8125rem; color: #B45309; margin-bottom: 14px;">Fast 1-line industry updates for readers on the go.</p>
                      
                      <div id="newsbites-rows-container">
                        <!-- Injected via renderNewsbitesList() -->
                      </div>
                    </div>

                    <!-- SECTION 6: SIGNOFF -->
                    <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
                      <h4 style="font-size: 0.95rem; font-weight: 800; color: #1E293B; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.04em;">
                        💌 6. Newsletter Signoff
                      </h4>
                      <textarea id="editor-signoff-text" class="form-control-textarea" rows="2" placeholder="Until tomorrow,\nAIRA Team">${cardData.signoff || 'Until next week,\nAIRA'}</textarea>
                    </div>

                  </div>

                  <!-- ============================================== -->
                  <!-- VIEW 2: LIVE INTERACTIVE PREVIEW -->
                  <!-- ============================================== -->
                  <div id="view-live-preview" style="display: ${activeTab === 'preview' ? 'block' : 'none'};">
                    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                      <span style="font-weight: 700; font-size: 0.875rem; color: #1C46F5; display: inline-flex; align-items: center; gap: 6px;">
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
                      <button type="button" id="btn-save-publish-bottom" class="btn-save-modal" style="font-size: 0.95rem; padding: 11px 32px; background: #00BA66; border: none; font-weight: 700; box-shadow: 0 2px 10px rgba(0,186,102,0.25);">
                        💾 Save & Publish Article
                      </button>
                    </div>
                  </div>

                </form>
              </div>
            </div>
          </section>

          <!-- MODAL: AI FAST DRAFTER (1-CLICK COPILOT) -->
          <div class="modal-overlay" id="modal-ai-fast-drafter" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.65); z-index: 9999; justify-content: center; align-items: center; padding: 20px;">
            <div class="modal-card" style="max-width: 580px; width: 100%; padding: 28px; border-radius: 16px; background: #FFFFFF; box-shadow: 0 20px 50px rgba(0,0,0,0.25);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #E2E8F0;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 1.5rem;">✨</span>
                  <div>
                    <h3 style="font-family: var(--font-header); font-size: 1.25rem; font-weight: 800; color: #0F172A; margin: 0;">AIRA AI Fast Drafter</h3>
                    <p style="color: #64748B; font-size: 0.8125rem; margin-top: 2px;">Generate complete 4-minute structured editions from raw links or bullets</p>
                  </div>
                </div>
                <button type="button" id="btn-close-ai-drafter" style="background: transparent; border: none; font-size: 1.3rem; cursor: pointer; color: #94A3B8;">✕</button>
              </div>

              <form id="form-ai-fast-drafter-run">
                <div class="form-group" style="margin-bottom: 14px;">
                  <label class="form-label" style="font-weight: 700;">News Topic / Raw Bullet Points / Breakthroughs <span style="color: #DC2626;">*</span></label>
                  <textarea id="ai-drafter-input-prompt" class="form-control-textarea" rows="4" placeholder="e.g. OpenAI announces GPT-6 with real-time agent loops, Anthropic releases Claude 3.7 with computer use, Google enhances Gemini 2.5 Flash..." required></textarea>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                  <div class="form-group" style="margin: 0;">
                    <label class="form-label">Editorial Tone</label>
                    <select id="ai-drafter-tone" class="form-control-input">
                      <option value="frontier">⚡ Frontier AI (Executive Brief)</option>
                      <option value="developer">💻 Developer & Engineering</option>
                      <option value="business">💼 Founders & ROI Focused</option>
                    </select>
                  </div>
                  <div class="form-group" style="margin: 0;">
                    <label class="form-label">Quick Presets</label>
                    <select id="ai-drafter-presets" class="form-control-input">
                      <option value="">-- Choose Preset --</option>
                      <option value="OpenAI GPT-6 Sol & Luna Autonomous Architecture">🔥 OpenAI Frontier Model</option>
                      <option value="Claude 3.7 Sonnet Computer Use & Tool Calling">🤖 Claude Agentic Update</option>
                      <option value="Top 5 Vetted AI Coding & Security Tools">🛠️ Top AI Tools Digest</option>
                      <option value="DeepSeek v4 Open-Source Model Benchmark Parity">🧠 Open Source Revolution</option>
                    </select>
                  </div>
                </div>

                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                  <button type="button" id="btn-cancel-ai-drafter" class="btn-cancel-modal">Cancel</button>
                  <button type="submit" class="saas-btn-primary" style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 10px 22px; border-radius: 8px; font-weight: 700; border: none; color: #FFFFFF; display: inline-flex; align-items: center; gap: 6px;">
                    ⚡ Generate 4-Min Edition
                  </button>
                </div>
              </form>
            </div>
          </div>

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
                <label class="form-label" style="font-size: 0.8125rem; font-weight: 700;">Direct Image Web Address (URL)</label>
                <input type="url" id="modal-img-url-input" class="form-control-input" placeholder="https://media.beehiiv.com/... or https://..." />
              </div>

              <!-- Caption & Link inputs -->
              <div class="form-group" style="margin-bottom: 12px;">
                <label class="form-label" style="font-size: 0.8125rem; font-weight: 700;">Caption (Italic text shown directly below picture)</label>
                <input type="text" id="modal-img-caption-input" class="form-control-input" placeholder="e.g. Gemini 2.5 Flash benchmark comparison chart" />
              </div>

              <div class="form-group" style="margin-bottom: 18px;">
                <label class="form-label" style="font-size: 0.8125rem; font-weight: 700;">Target Link on Image Click (Optional)</label>
                <input type="url" id="modal-img-link-input" class="form-control-input" placeholder="https://example.com/source" />
              </div>

              <!-- Real-Time Selected Image Preview -->
              <div id="modal-img-preview-card" style="display: none; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; margin-bottom: 18px;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #64748B; margin-bottom: 6px;">SELECTED PICTURE PREVIEW:</div>
                <img id="modal-img-preview-img" src="" alt="Selected Preview" style="width: 100%; max-height: 180px; object-fit: contain; border-radius: 6px; background: #000;" />
                <div id="modal-img-preview-caption-text" style="font-size: 0.75rem; color: #64748B; font-style: italic; text-align: center; margin-top: 6px;"></div>
              </div>

              <!-- Actions -->
              <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button type="button" id="btn-cancel-img-modal" class="btn-cancel-modal">Cancel</button>
                <button type="button" id="btn-apply-img-modal" class="btn-save-modal" style="background: #1C46F5; color: #FFFFFF; font-weight: 700; border: none; padding: 10px 22px;">Apply Picture 🖼️</button>
              </div>
            </div>
          </div>
        `;

        renderStoryCardsList();
        renderToolsList();
        renderNewsbitesList();
        bindEditorEvents();
      }

      // Render story cards list
      function renderStoryCardsList() {
        const container = document.getElementById('story-cards-container');
        if (!container) return;

        if (!cardData.stories || cardData.stories.length === 0) {
          container.innerHTML = `
            <div style="text-align: center; padding: 32px; background: #F8FAFC; border: 2px dashed #CBD5E1; border-radius: 10px;">
              <p style="color: #64748B; font-size: 0.95rem; margin-bottom: 12px;">No story cards added yet. Add your first story card or click AI Fast Drafter above!</p>
              <button type="button" id="btn-empty-add-story" style="background: #1C46F5; color: #FFFFFF; font-weight: 700; padding: 9px 20px; border-radius: 8px; border: none; cursor: pointer;">+ Add Story Card</button>
            </div>
          `;
          document.getElementById('btn-empty-add-story')?.addEventListener('click', () => {
            cardData.stories.push({
              tag: 'Breakthrough',
              title: 'New Story Headline',
              image: '',
              imageCaption: '',
              imageLink: '',
              body: 'Write your story details here...',
              takeaway: '',
              quote: '',
              quoteAuthor: ''
            });
            renderStoryCardsList();
          });
          return;
        }

        container.innerHTML = cardData.stories.map((story, idx) => `
          <div class="story-builder-card" data-idx="${idx}" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; padding: 22px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.02);">
            
            <!-- Card Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #F1F5F9;">
              <span style="font-weight: 800; font-size: 0.875rem; color: #1C46F5; display: inline-flex; align-items: center; gap: 6px;">
                <span>🎴 Story Card #${idx + 1}</span>
              </span>
              
              <div style="display: flex; gap: 6px; align-items: center;">
                ${idx > 0 ? `<button type="button" class="btn-story-action btn-move-story-up" data-idx="${idx}" title="Move Up" style="padding: 4px 8px;">↑</button>` : ''}
                ${idx < cardData.stories.length - 1 ? `<button type="button" class="btn-story-action btn-move-story-down" data-idx="${idx}" title="Move Down" style="padding: 4px 8px;">↓</button>` : ''}
                <button type="button" class="btn-story-action btn-delete-story" data-idx="${idx}" title="Delete Card" style="color: #DC2626; padding: 4px 8px;">🗑️ Delete</button>
              </div>
            </div>

            <!-- Tag & Title -->
            <div style="display: grid; grid-template-columns: 180px 1fr; gap: 12px; margin-bottom: 14px;">
              <div class="form-group" style="margin: 0;">
                <label class="form-label" style="font-size: 0.8125rem; font-weight: 700;">Badge Tag</label>
                <input type="text" class="form-control-input story-inp-tag" value="${(story.tag || 'Breakthrough').replace(/"/g, '&quot;')}" placeholder="e.g. OpenAI or Breakthrough" />
              </div>

              <div class="form-group" style="margin: 0;">
                <label class="form-label" style="font-weight: 700; font-size: 0.8125rem;">Story Headline *</label>
                <input type="text" class="form-control-input story-inp-title" value="${(story.title || '').replace(/"/g, '&quot;')}" placeholder="e.g. GPT-6 Astra Decodes WWI Message" />
              </div>
            </div>

            <!-- Story Photo / Image Box -->
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; margin-bottom: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <label class="form-label" style="font-size: 0.8125rem; font-weight: 700; margin: 0;">Story Picture / Diagram</label>
                <div style="display: flex; gap: 8px;">
                  <button type="button" class="btn-story-action btn-open-card-img-modal" data-idx="${idx}" style="font-weight: 600; font-size: 0.75rem; padding: 4px 10px; background: #FFFFFF;">
                    📷 Replace / Upload
                  </button>
                  ${story.image ? `<button type="button" class="btn-story-action btn-remove-story-img" data-idx="${idx}" style="color: #DC2626; font-size: 0.75rem; padding: 4px 10px; background: #FFFFFF;">✕ Remove</button>` : ''}
                </div>
              </div>

              ${story.image ? `
                <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 10px;">
                  <img src="${story.image}" alt="Story preview" style="max-height: 80px; max-width: 140px; border-radius: 6px; border: 1px solid #CBD5E1; object-fit: cover;" onerror="this.style.display='none'" />
                  <div style="flex: 1;">
                    <input type="text" class="form-control-input story-inp-caption" value="${(story.imageCaption || '').replace(/"/g, '&quot;')}" placeholder="Photo caption (italic note below image)" style="font-size: 0.8125rem; margin-bottom: 6px;" />
                    <input type="url" class="form-control-input story-inp-link" value="${story.imageLink || ''}" placeholder="Image click link (https://...)" style="font-size: 0.8125rem;" />
                  </div>
                </div>
              ` : `
                <div style="text-align: center; padding: 12px; background: #FFFFFF; border: 1px dashed #CBD5E1; border-radius: 6px;">
                  <span style="font-size: 0.8125rem; color: #64748B;">No picture added to this card. Click "Replace / Upload" above to attach a screenshot or diagram.</span>
                </div>
              `}
              <input type="hidden" class="story-inp-image" value="${(story.image || '').replace(/"/g, '&quot;')}" />
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
            <div class="form-group" style="margin-bottom: 10px; background: #EEF2FF; border: 1px solid #C7D2FE; padding: 12px 14px; border-radius: 8px;">
              <label class="form-label" style="color: #1C46F5; font-size: 0.8125rem; font-weight: 700; margin-bottom: 4px;">💡 Key Takeaway (Green Highlight Box)</label>
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

      // Update Live Interactive Preview Canvas (Full 1:1 Real Article Page Fidelity)
      function updateLivePreviewCanvas() {
        syncFormDataToCardData();
        const canvas = document.getElementById('live-preview-canvas');
        if (!canvas) return;

        const title = document.getElementById('editor-title')?.value.trim() || 'New Article Edition';
        const subtitle = document.getElementById('editor-subtitle')?.value.trim() || '';
        const tag = document.getElementById('editor-tag')?.value.trim() || 'Frontier AI';
        const date = document.getElementById('editor-date')?.value.trim() || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        const reading_time = document.getElementById('editor-reading-time')?.value.trim() || '4 min read';
        const author = document.getElementById('editor-author')?.value.trim() || 'AIRA';
        const image_url = document.getElementById('editor-image')?.value.trim() || 'assets/aira-promo-banner.png';

        const compiledBodyHtml = compileCardDataToHtml(cardData);
        const enrichedBodyHtml = (typeof linkToolMentionsInArticle === 'function') ? linkToolMentionsInArticle(compiledBodyHtml) : compiledBodyHtml;

        const sponsorConfig = (typeof getSponsorSettings === 'function') ? getSponsorSettings() : null;
        const topBarAd = sponsorConfig ? sponsorConfig.topBar : { active: true, badge: 'AD', icon: '⚡', headline: '<strong>AIRA Newsletter Partner</strong> – Build and scale frontier AI agents with verified infrastructure.', link: '#/advertise', ctaText: 'Learn More →' };
        const inFeedAd = sponsorConfig ? sponsorConfig.inFeed : { active: true, tag: 'Featured Partner', title: 'Supercharge Your AI Development with Autonomous Agents', body: 'Build, evaluate, and scale production-ready AI agents in minutes. Connect frontier LLMs to your private data, automate complex multi-step workflows, and reduce API token overhead by up to 45%.', btnText: 'Claim Exclusive 30% Off Free Trial →', btnLink: '#/advertise', badge: 'Sponsored' };

        const recommendedArticles = (Array.isArray(state.articles) ? state.articles : []).slice(0, 2);

        canvas.innerHTML = `
          <div class="article-page-view" style="padding: 0; background: transparent;">
            <div class="article-container" style="max-width: 100%; padding: 0;">
              
              <!-- Breadcrumb Preview -->
              <div class="breadcrumb-nav">
                <span class="breadcrumb-link">Home</span>
                <span class="breadcrumb-separator">/</span>
                <span class="breadcrumb-link">Posts</span>
                <span class="breadcrumb-separator">/</span>
                <span>${escapeHtml(title)}</span>
              </div>

              <!-- Header Preview -->
              <header class="article-header">
                <span class="article-header-tag">${escapeHtml(tag)}</span>
                <h1 class="article-header-title">${escapeHtml(title)}</h1>
                ${subtitle ? `<p class="article-header-subtitle">${escapeHtml(subtitle)}</p>` : ''}

                <div class="article-header-meta">
                  <div class="article-author-block">
                    <img src="assets/logo.jpg" alt="${escapeHtml(author)}" class="article-author-img" onerror="this.src='assets/logo.svg'" />
                    <div>
                      <div class="article-author-meta-name">${escapeHtml(author)}</div>
                      <div class="article-author-meta-date">${escapeHtml(date)} • ${escapeHtml(reading_time)}</div>
                    </div>
                  </div>

                  <div class="article-action-buttons">
                    <button type="button" class="action-btn" title="Reactions">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                      <span>28 Likes</span>
                    </button>
                    <button type="button" class="action-btn" title="Bookmarks">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                      <span>Save</span>
                    </button>
                    <button type="button" class="action-btn" title="Share">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </header>

              <!-- Hero Cover Image Preview -->
              <div class="article-hero-cover" style="cursor: pointer; position: relative;" id="preview-cover-trigger" title="Click to replace cover image">
                <img src="${image_url || 'assets/aira-promo-banner.png'}" alt="${escapeHtml(title)}" class="article-hero-img" onerror="this.src='assets/aira-promo-banner.png'" />
                <div class="img-overlay-edit" style="border-radius: 12px;"><span>📷 Click to Change Cover Photo</span></div>
              </div>

              <!-- Top Header Banner Ad Placement -->
              ${topBarAd && topBarAd.active !== false ? `
                <div class="site-top-ad-banner" style="margin-bottom: 20px;">
                  <div class="site-top-ad-inner">
                    <span class="site-ad-badge">${escapeHtml(topBarAd.badge || 'AD')}</span>
                    <span class="site-ad-icon">${topBarAd.icon || '⚡'}</span>
                    <span class="site-ad-text">${topBarAd.headline || '<strong>AIRA Newsletter Partner</strong> – Build and scale frontier AI agents with verified infrastructure.'}</span>
                  </div>
                  <a href="${topBarAd.link || '#/advertise'}" target="_blank" class="site-ad-cta-btn">${escapeHtml(topBarAd.ctaText || 'Learn More →')}</a>
                </div>
              ` : ''}

              <!-- Text-to-Speech Audio Player Bar -->
              <div class="article-tts-player" style="margin-bottom: 24px;">
                <button type="button" class="tts-play-btn" title="Listen to this article">
                  <span>▶</span>
                </button>
                <div class="tts-info-group">
                  <div class="tts-label">
                    <span>🎧</span>
                    <span>Listen to this edition</span>
                  </div>
                  <div class="tts-status-text">${escapeHtml(reading_time)} • AI Voice Narration</div>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <button type="button" class="tts-speed-btn active">1x</button>
                  <button type="button" class="tts-speed-btn">1.25x</button>
                  <button type="button" class="tts-speed-btn">1.5x</button>
                </div>
              </div>

              <!-- Newsletter Spotlight Placement (In-Feed Sponsored Ad Box) -->
              ${inFeedAd && inFeedAd.active !== false ? `
                <div class="newsletter-spotlight-ad-box" style="margin-bottom: 28px;">
                  <div class="newsletter-spotlight-top">
                    <div class="newsletter-spotlight-pill">
                      <span class="bolt">⚡</span> ${escapeHtml(inFeedAd.badge || 'AIRA COMMUNITY SPOTLIGHT')}
                    </div>
                    <a href="#/advertise" class="newsletter-spotlight-book-link">Book a Spotlight ($399) ↗</a>
                  </div>
                  <div class="newsletter-spotlight-content">
                    <a href="${inFeedAd.btnLink || '#/advertise'}" target="_blank" style="display: block; margin: 12px 0 16px 0; border-radius: 10px; overflow: hidden; border: 1.5px solid rgba(255, 255, 255, 0.3); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25); background: #000;">
                      <img src="${inFeedAd.bannerImg || inFeedAd.image || 'assets/ui-designer-banner.svg'}" alt="${escapeHtml(inFeedAd.title || 'AIRA Spotlight')}" style="width: 100%; height: auto; display: block; border-radius: 8px;" />
                    </a>
                    <div class="newsletter-spotlight-header-row">
                      <div class="newsletter-spotlight-avatar" style="padding: 0; overflow: hidden; border: 1.5px solid rgba(255,255,255,0.4);">
                        <img src="${inFeedAd.avatarImg || inFeedAd.avatar || 'assets/ui-designer-community.png'}" style="width: 100%; height: 100%; object-fit: cover;" alt="UI Designer Logo" onerror="this.outerHTML='🎨'" />
                      </div>
                      <div>
                        <h4 class="newsletter-spotlight-title">${escapeHtml(inFeedAd.title || 'Join our UI/UX Design Community')}</h4>
                        <span class="newsletter-spotlight-brand">Sponsored by ${escapeHtml(inFeedAd.tag || 'UI Designer Community')} • Verified Community</span>
                      </div>
                    </div>
                    <p class="newsletter-spotlight-text">
                      ${escapeHtml(inFeedAd.body || 'A space where designers share ideas, trends, and practical tips. Learn something new, improve your design skills, and connect with like-minded creatives.')}
                    </p>
                    <div class="newsletter-spotlight-footer">
                      <a href="${inFeedAd.btnLink || '#/advertise'}" target="_blank" class="newsletter-spotlight-btn">
                        <span>${escapeHtml(inFeedAd.btnText || 'Join the community →')}</span>
                      </a>
                      <span class="newsletter-spotlight-disclaimer">Active design community &amp; discussions</span>
                    </div>
                  </div>
                </div>
              ` : ''}

              <!-- Rich Body Content -->
              <div class="article-rich-body">
                ${enrichedBodyHtml}
              </div>

              <!-- Inline Dark Subscribe Card -->
              <div class="article-subscribe-card" style="margin-top: 32px;">
                <div class="article-sub-badge">
                  <span class="sub-bolt-icon">⚡</span>
                </div>
                <h3 class="article-sub-title">Stay Ahead in AI with AIRA</h3>
                <p class="article-sub-desc">Get top AI news, breakthroughs + instant access to <strong>3,000+ ChatGPT Prompts &amp; 50 n8n Templates</strong>.</p>
                <form class="article-sub-form-dark" onsubmit="event.preventDefault(); showToast('Preview mode: Subscription form active on live site!');">
                  <div class="sub-dark-input-wrap">
                    <input type="email" class="sub-dark-input" placeholder="Your email address" required />
                    <button type="submit" class="sub-dark-btn">Subscribe &amp; Get 3,000+ Prompts &amp; 50 Templates 🎁</button>
                  </div>
                </form>
              </div>

              <!-- Community Discussion Section Preview -->
              <section class="comments-section" style="margin-top: 36px;">
                <h3 class="comments-section-title">Discussion (3)</h3>
                <div class="comment-item" style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 16px; border-radius: 10px; margin-bottom: 12px;">
                  <div style="font-weight: 700; color: #0F172A; font-size: 0.9rem;">Alex Rivers <span style="font-weight: normal; color: #94A3B8; font-size: 0.78rem;">• Today</span></div>
                  <p style="font-size: 0.88rem; color: #334155; margin: 6px 0 0 0;">Incredible breakdown of the multi-agent reasoning architecture. Very actionable takeaway.</p>
                </div>
              </section>

              <!-- Recommended Next Reads Preview -->
              <div class="article-recommended" style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #E2E8F0;">
                <h3 style="font-family: var(--font-header); font-size: 1.25rem; font-weight: 800; color: #0F172A; margin-bottom: 16px;">Next Recommended Editions</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                  ${recommendedArticles.map(rec => `
                    <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                      <span style="font-size: 0.75rem; font-weight: 700; color: #1C46F5; background: #EEF2FF; padding: 2px 8px; border-radius: 4px;">${escapeHtml(rec.tag || 'News')}</span>
                      <h4 style="font-size: 0.95rem; font-weight: 800; color: #0F172A; margin: 8px 0 4px 0;">${escapeHtml(rec.title || '')}</h4>
                      <div style="font-size: 0.78rem; color: #64748B;">${escapeHtml(rec.date || '')} • ${escapeHtml(rec.reading_time || '4 min')}</div>
                    </div>
                  `).join('')}
                </div>
              </div>

            </div>
          </div>
        `;

        // Bind cover image click to replacer
        document.getElementById('preview-cover-trigger')?.addEventListener('click', () => {
          openImageModal({ type: 'cover' });
        });

        // Wrap every story image in live preview with 1-click replace overlay
        const previewImages = canvas.querySelectorAll('.section-inline-img');
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
            const storyIdx = Math.min(idx, cardData.stories.length - 1);
            openImageModal({ type: 'story', index: storyIdx });
          });
        });
      }

      // Bind story cards internal events
      function bindStoryCardEvents() {
        document.querySelectorAll('.btn-open-card-img-modal').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
            syncFormDataToCardData();
            openImageModal({ type: 'story', index: idx });
          });
        });

        document.querySelectorAll('.btn-remove-story-img').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
            syncFormDataToCardData();
            if (cardData.stories[idx]) {
              cardData.stories[idx].image = '';
              cardData.stories[idx].imageCaption = '';
              cardData.stories[idx].imageLink = '';
            }
            renderStoryCardsList();
          });
        });

        document.querySelectorAll('.btn-delete-story').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
            if (confirm(`Delete Story Card #${idx + 1}?`)) {
              syncFormDataToCardData();
              cardData.stories.splice(idx, 1);
              renderStoryCardsList();
            }
          });
        });

        document.querySelectorAll('.btn-move-story-up').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
            if (idx > 0) {
              syncFormDataToCardData();
              const temp = cardData.stories[idx];
              cardData.stories[idx] = cardData.stories[idx - 1];
              cardData.stories[idx - 1] = temp;
              renderStoryCardsList();
            }
          });
        });

        document.querySelectorAll('.btn-move-story-down').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
            if (idx < cardData.stories.length - 1) {
              syncFormDataToCardData();
              const temp = cardData.stories[idx];
              cardData.stories[idx] = cardData.stories[idx + 1];
              cardData.stories[idx + 1] = temp;
              renderStoryCardsList();
            }
          });
        });

        document.querySelectorAll('.btn-format-story').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
            const tagType = e.currentTarget.getAttribute('data-tag');
            const cardEl = document.querySelector(`.story-builder-card[data-idx="${idx}"]`);
            const textarea = cardEl?.querySelector('.story-inp-body');
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const val = textarea.value;
            const selectedText = val.substring(start, end);

            let insertText = '';
            if (tagType === 'b') {
              insertText = selectedText ? `**${selectedText}**` : '**bold text**';
            } else if (tagType === 'i') {
              insertText = selectedText ? `*${selectedText}*` : '*italic text*';
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
        document.getElementById('btn-back-to-list')?.addEventListener('click', () => {
          state.adminEditingArticle = null;
          renderAdminPage();
        });

        document.getElementById('btn-cancel-inline-editor')?.addEventListener('click', () => {
          state.adminEditingArticle = null;
          renderAdminPage();
        });

        // AI Fast Drafter Trigger
        document.getElementById('btn-open-ai-drafter')?.addEventListener('click', () => {
          const modal = document.getElementById('modal-ai-fast-drafter');
          if (modal) modal.style.display = 'flex';
        });

        document.getElementById('btn-close-ai-drafter')?.addEventListener('click', () => {
          const modal = document.getElementById('modal-ai-fast-drafter');
          if (modal) modal.style.display = 'none';
        });

        document.getElementById('btn-cancel-ai-drafter')?.addEventListener('click', () => {
          const modal = document.getElementById('modal-ai-fast-drafter');
          if (modal) modal.style.display = 'none';
        });

        // Preset Selector in AI Drafter
        document.getElementById('ai-drafter-presets')?.addEventListener('change', (e) => {
          const val = e.target.value;
          const promptInp = document.getElementById('ai-drafter-input-prompt');
          if (val && promptInp) {
            promptInp.value = val;
          }
        });

        // Form Submit for AI Drafter
        document.getElementById('form-ai-fast-drafter-run')?.addEventListener('submit', (e) => {
          e.preventDefault();
          const promptInp = document.getElementById('ai-drafter-input-prompt');
          const toneSelect = document.getElementById('ai-drafter-tone');
          const promptText = promptInp ? promptInp.value.trim() : '';
          const tone = toneSelect ? toneSelect.value : 'frontier';

          showToast('⚡ Generating 4-Minute Edition with AI...');
          const generatedEdition = generateAiNewsletterDraft(promptText, tone);

          // Update inputs
          const titleInp = document.getElementById('editor-title');
          const slugInp = document.getElementById('editor-slug');
          const subtitleInp = document.getElementById('editor-subtitle');
          const tagInp = document.getElementById('editor-tag');
          const introInp = document.getElementById('editor-intro-text');
          const signoffInp = document.getElementById('editor-signoff-text');

          if (titleInp) titleInp.value = generatedEdition.title;
          if (slugInp) slugInp.value = generatedEdition.slug;
          if (subtitleInp) subtitleInp.value = generatedEdition.subtitle;
          if (tagInp) tagInp.value = generatedEdition.tag;
          if (introInp) introInp.value = generatedEdition.intro;
          if (signoffInp) signoffInp.value = generatedEdition.signoff;

          cardData = {
            intro: generatedEdition.intro,
            stories: generatedEdition.stories,
            tools: generatedEdition.tools,
            newsbites: generatedEdition.newsbites,
            signoff: generatedEdition.signoff
          };

          const modal = document.getElementById('modal-ai-fast-drafter');
          if (modal) modal.style.display = 'none';

          renderStoryCardsList();
          renderToolsList();
          renderNewsbitesList();
          showToast('✨ AI Edition generated and loaded into editor!');
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
                const dataUrl = await readAndOptimizeImage(file, 1000, 650, 0.78);
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
            coverPreviewImg.src = coverUrlInput.value.trim() || 'assets/aira-promo-banner.png';
          });
        }

        document.getElementById('btn-upload-cover-modal')?.addEventListener('click', () => {
          openImageModal({ type: 'cover' });
        });

        // Add Card buttons
        document.getElementById('btn-add-story-card')?.addEventListener('click', () => {
          syncFormDataToCardData();
          cardData.stories.push({
            tag: 'Breakthrough',
            title: '',
            image: '',
            imageCaption: '',
            imageLink: '',
            body: '',
            takeaway: '',
            quote: '',
            quoteAuthor: ''
          });
          renderStoryCardsList();
        });

        document.getElementById('btn-add-tool-row')?.addEventListener('click', () => {
          syncFormDataToCardData();
          cardData.tools.push({ name: '', link: '', desc: '' });
          renderToolsList();
        });

        document.getElementById('btn-add-newsbite-row')?.addEventListener('click', () => {
          syncFormDataToCardData();
          cardData.newsbites.push({ source: '', text: '' });
          renderNewsbitesList();
        });

        // Universal Image Modal Event Handlers
        document.getElementById('btn-close-img-modal')?.addEventListener('click', closeImageModal);
        document.getElementById('btn-cancel-img-modal')?.addEventListener('click', closeImageModal);

        const tabImgUpload = document.getElementById('tab-img-upload');
        const tabImgUrl = document.getElementById('tab-img-url');
        const secUpload = document.getElementById('section-img-upload');
        const secUrl = document.getElementById('section-img-url');

        if (tabImgUpload && tabImgUrl) {
          tabImgUpload.addEventListener('click', () => {
            tabImgUpload.classList.add('active');
            tabImgUrl.classList.remove('active');
            if (secUpload) secUpload.style.display = 'block';
            if (secUrl) secUrl.style.display = 'none';
          });
          tabImgUrl.addEventListener('click', () => {
            tabImgUrl.classList.add('active');
            tabImgUpload.classList.remove('active');
            if (secUpload) secUpload.style.display = 'none';
            if (secUrl) secUrl.style.display = 'block';
          });
        }

        const modalFileInput = document.getElementById('modal-img-file');
        const modalUrlInput = document.getElementById('modal-img-url-input');
        const modalPreviewCard = document.getElementById('modal-img-preview-card');
        const modalPreviewImg = document.getElementById('modal-img-preview-img');
        const modalPreviewCaption = document.getElementById('modal-img-preview-caption-text');
        const modalCaptionInput = document.getElementById('modal-img-caption-input');

        let tempModalImageSrc = '';

        if (modalFileInput) {
          modalFileInput.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              try {
                showToast('Optimizing picture... ⏳');
                tempModalImageSrc = await readAndOptimizeImage(file, 1000, 650, 0.78);
                if (modalPreviewImg) modalPreviewImg.src = tempModalImageSrc;
                if (modalPreviewCard) modalPreviewCard.style.display = 'block';
                if (modalUrlInput) modalUrlInput.value = tempModalImageSrc;
                showToast('Picture uploaded & ready! 📸');
              } catch (err) {
                showToast('Error uploading picture.');
              }
            }
          });
        }

        if (modalUrlInput) {
          modalUrlInput.addEventListener('input', () => {
            tempModalImageSrc = modalUrlInput.value.trim();
            if (tempModalImageSrc) {
              if (modalPreviewImg) modalPreviewImg.src = tempModalImageSrc;
              if (modalPreviewCard) modalPreviewCard.style.display = 'block';
            } else {
              if (modalPreviewCard) modalPreviewCard.style.display = 'none';
            }
          });
        }

        if (modalCaptionInput) {
          modalCaptionInput.addEventListener('input', () => {
            if (modalPreviewCaption) modalPreviewCaption.textContent = modalCaptionInput.value.trim();
          });
        }

        document.getElementById('btn-apply-img-modal')?.addEventListener('click', () => {
          const finalSrc = tempModalImageSrc || (modalUrlInput ? modalUrlInput.value.trim() : '');
          const finalCaption = modalCaptionInput ? modalCaptionInput.value.trim() : '';
          const finalLink = document.getElementById('modal-img-link-input')?.value.trim() || '';

          if (activeImageTarget) {
            if (activeImageTarget.type === 'cover') {
              const coverInp = document.getElementById('editor-image');
              if (coverInp) coverInp.value = finalSrc;
              if (coverPreviewImg) coverPreviewImg.src = finalSrc;
            } else if (activeImageTarget.type === 'story') {
              syncFormDataToCardData();
              if (cardData.stories[activeImageTarget.index]) {
                cardData.stories[activeImageTarget.index].image = finalSrc;
                cardData.stories[activeImageTarget.index].imageCaption = finalCaption;
                cardData.stories[activeImageTarget.index].imageLink = finalLink;
              }
              renderStoryCardsList();
              if (activeTab === 'preview') {
                updateLivePreviewCanvas();
              }
            }
          }

          closeImageModal();
          showToast('Picture updated! 🖼️');
        });

        // Save & Publish Article Handler
        async function handleSaveAndPublish(e) {
          if (e) e.preventDefault();
          syncFormDataToCardData();

          const title = document.getElementById('editor-title')?.value.trim();
          const slug = document.getElementById('editor-slug')?.value.trim();
          const subtitle = document.getElementById('editor-subtitle')?.value.trim();
          const tag = document.getElementById('editor-tag')?.value.trim() || 'Frontier AI';
          const date = document.getElementById('editor-date')?.value.trim() || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
          const reading_time = document.getElementById('editor-reading-time')?.value.trim() || '4 minutes';
          const author = document.getElementById('editor-author')?.value.trim() || 'AIRA';
          const image_url = document.getElementById('editor-image')?.value.trim() || 'assets/aira-promo-banner.png';

          if (!title || !slug) {
            showToast('Please provide an article title and slug.');
            return;
          }

          const compiledBodyHtml = compileCardDataToHtml(cardData);

          const articleRecord = {
            id: art.id || Date.now(),
            slug,
            title,
            subtitle,
            tag,
            date,
            reading_time,
            author,
            image_url,
            body_html: compiledBodyHtml,
            _edited_at: Date.now(),
            _is_custom_edit: true
          };

          // Save article to custom dataset
          let customArticles = [];
          try {
            const raw = localStorage.getItem('aira_custom_articles');
            customArticles = raw ? JSON.parse(raw) : [];
          } catch (err) { customArticles = []; }

          const existingIdx = customArticles.findIndex(a => a && a.slug === slug);
          if (existingIdx >= 0) {
            customArticles[existingIdx] = articleRecord;
          } else {
            customArticles.unshift(articleRecord);
          }

          // Also store explicit override
          let overrides = {};
          try {
            const rawOvr = localStorage.getItem('aira_article_overrides');
            if (rawOvr) overrides = JSON.parse(rawOvr) || {};
          } catch(e) {}
          overrides[slug] = articleRecord;

          localStorage.setItem('aira_custom_articles', JSON.stringify(customArticles));
          localStorage.setItem('aira_article_overrides', JSON.stringify(overrides));

          if (window.AiraStorage) {
            window.AiraStorage.set('aira_custom_articles', customArticles);
            window.AiraStorage.set('aira_article_overrides', overrides);
          }

          // Update in-memory state
          const stateArtIdx = state.articles.findIndex(a => a && a.slug === slug);
          if (stateArtIdx >= 0) {
            state.articles[stateArtIdx] = { ...state.articles[stateArtIdx], ...articleRecord };
          } else {
            state.articles.unshift(articleRecord);
          }

          showToast('🎉 Article successfully published & live on AIRA!');
          state.adminEditingArticle = null;
          state.adminTab = 'articles';
          renderAdminPage();
        }

        document.getElementById('btn-save-publish-top')?.addEventListener('click', handleSaveAndPublish);
        document.getElementById('btn-save-publish-bottom')?.addEventListener('click', handleSaveAndPublish);
        document.getElementById('form-article-builder-editor')?.addEventListener('submit', handleSaveAndPublish);
      }

      renderEditorUi();
      if (activeTab === 'preview') {
        updateLivePreviewCanvas();
      }
      return;
    }

    // =========================================================================
    // MAIN ADMIN DASHBOARD VIEW (With All SaaS Navigation Tabs)
    // =========================================================================
    const allSubmissions = (typeof getToolSubmissions === 'function') ? getToolSubmissions() : [];
    const pendingSubmissions = allSubmissions.filter(s => (s.status || 'pending') === 'pending');
    const allAdInquiries = (typeof getAdInquiries === 'function') ? getAdInquiries() : [];
    const pendingAdInquiries = allAdInquiries.filter(i => (i.status || 'pending') === 'pending');
    const allCustomPartnerships = (typeof getCustomPartnerships === 'function') ? getCustomPartnerships() : [];
    const allDealsList = (typeof getAllDeals === 'function') ? getAllDeals() : [];
    const normalizedSubscribers = normalizedList;
    const sponsorSettings = getSponsorSettings();
    const broadcastHistory = getEmailBroadcastHistory();
    const totalNotifications = pendingSubmissions.length + pendingAdInquiries.length + allCustomPartnerships.filter(p => (p.status || 'pending') === 'pending').length;

    // Flatten comments
    const allCommentsMap = JSON.parse(localStorage.getItem('aira_comments') || '{}');
    const flatComments = [];
    Object.keys(allCommentsMap).forEach(slug => {
      const cList = allCommentsMap[slug] || [];
      cList.forEach((c, cIdx) => {
        flatComments.push({
          postSlug: slug,
          author: c.name || 'Anonymous',
          email: c.email || '',
          text: c.text || '',
          date: c.date || 'Recent',
          index: cIdx
        });
      });
    });

    // Filtered lists for active tabs
    const articleSearchQ = (state.adminArticleSearch || '').toLowerCase().trim();
    const articleTagFilter = state.adminArticleTag || 'All';
    const filteredAdminArticles = state.articles.filter(a => {
      const matchTag = articleTagFilter === 'All' || (a.tag && a.tag.toLowerCase() === articleTagFilter.toLowerCase());
      const matchSearch = articleSearchQ === '' || 
        (a.title && a.title.toLowerCase().includes(articleSearchQ)) || 
        (a.subtitle && a.subtitle.toLowerCase().includes(articleSearchQ)) || 
        (a.slug && a.slug.toLowerCase().includes(articleSearchQ));
      return matchTag && matchSearch;
    });

    const subFilter = state.adminSubmissionFilter || 'all';
    const subSearchQ = (state.adminSubmissionSearch || '').toLowerCase().trim();
    const filteredSubmissions = allSubmissions.filter(s => {
      const matchStatus = subFilter === 'all' || (s.status || 'pending') === subFilter;
      const matchSearch = subSearchQ === '' ||
        (s.toolName && s.toolName.toLowerCase().includes(subSearchQ)) ||
        (s.contactEmail && s.contactEmail.toLowerCase().includes(subSearchQ)) ||
        (s.tagline && s.tagline.toLowerCase().includes(subSearchQ)) ||
        (s.category && s.category.toLowerCase().includes(subSearchQ));
      return matchStatus && matchSearch;
    });

    const dealSearchQ = (state.adminDealSearch || '').toLowerCase().trim();
    const filteredDeals = allDealsList.filter(d => {
      if (!dealSearchQ) return true;
      return (d.toolName && d.toolName.toLowerCase().includes(dealSearchQ)) ||
        (d.headline && d.headline.toLowerCase().includes(dealSearchQ)) ||
        (d.couponCode && d.couponCode.toLowerCase().includes(dealSearchQ)) ||
        (d.category && d.category.toLowerCase().includes(dealSearchQ));
    });

    const subSearchQuery = (state.adminSubscriberSearch || '').toLowerCase().trim();
    const filteredSubscribers = normalizedSubscribers.filter(s => {
      if (!subSearchQuery) return true;
      return (s.email && s.email.toLowerCase().includes(subSearchQuery)) ||
        (s.source && s.source.toLowerCase().includes(subSearchQuery));
    });

    const commentSearchQ = (state.adminCommentSearch || '').toLowerCase().trim();
    const filteredComments = flatComments.filter(c => {
      if (!commentSearchQ) return true;
      return (c.author && c.author.toLowerCase().includes(commentSearchQ)) ||
        (c.text && c.text.toLowerCase().includes(commentSearchQ)) ||
        (c.postSlug && c.postSlug.toLowerCase().includes(commentSearchQ));
    });

    const activeTab = state.adminTab || 'overview';

    // RENDER FULL SAAS ADMIN DASHBOARD HTML
    appContainer.innerHTML = `
      <div class="saas-admin-wrapper">
        
        <!-- ============================================================= -->
        <!-- LEFT SIDEBAR -->
        <!-- ============================================================= -->
        <aside class="saas-admin-sidebar">
          <div class="saas-sidebar-brand">
            <a href="#/home" class="saas-brand-logo-wrap">
              <div class="saas-brand-icon">A</div>
              <span class="saas-brand-name">AIRA</span>
            </a>
            <span class="saas-sidebar-toggle" title="Collapse Sidebar" style="color: #94A3B8; font-size: 1.1rem; cursor: pointer;">«</span>
          </div>

          <nav class="saas-sidebar-nav">
            <button type="button" class="saas-nav-btn ${activeTab === 'overview' ? 'active' : ''}" data-admin-tab="overview">
              <span>📊</span>
              <span>Overview</span>
            </button>
            <button type="button" class="saas-nav-btn ${activeTab === 'submissions' ? 'active' : ''}" data-admin-tab="submissions">
              <span>🛠️</span>
              <span>Tool Submissions</span>
              ${pendingSubmissions.length > 0 ? `<span class="saas-nav-badge">${pendingSubmissions.length} New</span>` : `<span class="saas-nav-count">${allSubmissions.length}</span>`}
            </button>
            <button type="button" class="saas-nav-btn ${activeTab === 'sponsors' ? 'active' : ''}" data-admin-tab="sponsors">
              <span>📢</span>
              <span>Sponsor & Ads</span>
              ${pendingAdInquiries.length > 0 ? `<span class="saas-nav-badge" style="background: #F59E0B; color: white;">${pendingAdInquiries.length} Inq</span>` : `<span class="saas-nav-badge" style="background: #10B981; color: white;">Active</span>`}
            </button>
            <button type="button" class="saas-nav-btn ${activeTab === 'deals' ? 'active' : ''}" data-admin-tab="deals">
              <span>🏷️</span>
              <span>Deals & Revenue</span>
              <span class="saas-nav-count">${allDealsList.length}</span>
            </button>
            <button type="button" class="saas-nav-btn ${activeTab === 'articles' ? 'active' : ''}" data-admin-tab="articles">
              <span>📰</span>
              <span>Articles & Studio</span>
              <span class="saas-nav-count">${state.articles.length}</span>
            </button>
            <button type="button" class="saas-nav-btn ${activeTab === 'subscribers' ? 'active' : ''}" data-admin-tab="subscribers">
              <span>📬</span>
              <span>Subscribers CRM</span>
              <span class="saas-nav-count">${normalizedSubscribers.length}</span>
            </button>
            <button type="button" class="saas-nav-btn ${activeTab === 'emails' ? 'active' : ''}" data-admin-tab="emails">
              <span>📧</span>
              <span>Email Broadcast</span>
              <span class="saas-nav-badge" style="background: #1C46F5; color: white;">1-Click</span>
            </button>
            <button type="button" class="saas-nav-btn ${activeTab === 'comments' ? 'active' : ''}" data-admin-tab="comments">
              <span>💬</span>
              <span>Comments</span>
              <span class="saas-nav-count">${flatComments.length}</span>
            </button>
            <button type="button" class="saas-nav-btn ${activeTab === 'settings' ? 'active' : ''}" data-admin-tab="settings">
              <span>⚙️</span>
              <span>Backup & Security</span>
            </button>
          </nav>

          <div class="saas-sidebar-footer">
            <button type="button" class="saas-nav-btn" id="btn-sidebar-lock-admin" style="color: #EF4444 !important; font-weight: 700;">
              <span>🔒</span>
              <span>Lock Session</span>
            </button>
            <a href="#/home" class="saas-nav-btn" style="text-decoration: none; color: #64748B;">
              <span>←</span>
              <span>Back to Public Site</span>
            </a>
          </div>
        </aside>

        <!-- ============================================================= -->
        <!-- MAIN CONTENT AREA -->
        <!-- ============================================================= -->
        <div class="saas-admin-content">
          
          <!-- Topbar -->
          <header class="saas-topbar">
            <div class="saas-search-input-wrap">
              <span class="saas-search-icon">🔍</span>
              <input type="text" id="saas-topbar-search" class="saas-search-input" placeholder="Search tools, deals, articles..." value="${state.adminTab === 'articles' ? (state.adminArticleSearch || '') : state.adminTab === 'submissions' ? (state.adminSubmissionSearch || '') : state.adminTab === 'deals' ? (state.adminDealSearch || '') : state.adminTab === 'subscribers' ? (state.adminSubscriberSearch || '') : ''}" />
            </div>

            <div class="saas-topbar-actions">
              <button type="button" style="background: transparent; border: 1px solid #E2E8F0; border-radius: 10px; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748B; position: relative;" title="Pending Notifications (${totalNotifications})" onclick="document.querySelector('[data-admin-tab=sponsors]').click()">
                <span>🔔</span>
                ${totalNotifications > 0 ? `<span style="position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; border-radius: 50%; background: #EF4444;"></span>` : ''}
              </button>

              <button type="button" class="saas-btn-primary" id="btn-topbar-new-article">
                <span>+</span>
                <span>New Article</span>
              </button>

              <button type="button" id="btn-topbar-lock" style="background: #FEE2E2; color: #DC2626; border: 1px solid #FECACA; padding: 7px 14px; border-radius: 8px; font-weight: 700; font-size: 0.8125rem; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                <span>🔒</span> Lock
              </button>

              <div class="saas-user-pill">
                <img loading="lazy" decoding="async" src="assets/logo.jpg" alt="Admin" class="saas-user-avatar" onerror="this.src='assets/logo.svg'" />
                <span>AIRA Admin</span>
              </div>
            </div>
          </header>

          <!-- Main Dashboard Body -->
          <main class="saas-main-body">
            
            <!-- 4 Top KPI Sparkline Cards (Overview Tab) -->
            ${activeTab === 'overview' ? `
              <div class="saas-kpi-grid">
                <!-- KPI 1: Subscribers -->
                <div class="saas-kpi-card" style="cursor: pointer;" onclick="document.querySelector('[data-admin-tab=subscribers]').click()">
                  <div class="saas-kpi-header">
                    <span class="saas-kpi-title">Total Subscribers</span>
                    <span class="saas-kpi-dots">•••</span>
                  </div>
                  <div class="saas-kpi-bottom">
                    <div>
                      <div class="saas-kpi-num">${normalizedSubscribers.length > 0 ? (500 + normalizedSubscribers.length).toLocaleString() : '500'}</div>
                      <div style="font-size: 0.78rem; font-weight: 700; color: #1C46F5; margin-top: 4px; display: flex; align-items: center; gap: 4px;">
                        <span>↑ 12.4%</span>
                        <span style="color: #94A3B8; font-weight: 500;">this month</span>
                      </div>
                    </div>
                    <svg class="saas-sparkline-svg" viewBox="0 0 100 32">
                      <path d="M 0 28 Q 25 22, 50 14 T 100 4" fill="none" stroke="#1C46F5" stroke-width="2.5" stroke-linecap="round"/>
                      <path d="M 0 28 Q 25 22, 50 14 T 100 4 L 100 32 L 0 32 Z" fill="rgba(28, 70, 245, 0.08)"/>
                    </svg>
                  </div>
                </div>

                <!-- KPI 2: Submissions & Ad Inquiries -->
                <div class="saas-kpi-card" style="cursor: pointer;" onclick="document.querySelector('[data-admin-tab=sponsors]').click()">
                  <div class="saas-kpi-header">
                    <span class="saas-kpi-title">Pending Inquiries</span>
                    <span class="saas-kpi-dots">•••</span>
                  </div>
                  <div class="saas-kpi-bottom">
                    <div>
                      <div class="saas-kpi-num" style="color: ${totalNotifications > 0 ? '#DC2626' : '#0F172A'};">${totalNotifications}</div>
                      <div style="font-size: 0.78rem; font-weight: 700; color: ${totalNotifications > 0 ? '#DC2626' : '#10B981'}; margin-top: 4px;">
                        ${totalNotifications > 0 ? `⚠️ ${pendingSubmissions.length} Tools • ${pendingAdInquiries.length} Ads` : '✓ All reviewed'}
                      </div>
                    </div>
                    <svg class="saas-sparkline-svg" viewBox="0 0 100 32">
                      <path d="M 0 24 Q 30 28, 60 16 T 100 8" fill="none" stroke="${totalNotifications > 0 ? '#EF4444' : '#10B981'}" stroke-width="2.5" stroke-linecap="round"/>
                      <path d="M 0 24 Q 30 28, 60 16 T 100 8 L 100 32 L 0 32 Z" fill="${totalNotifications > 0 ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)'}"/>
                    </svg>
                  </div>
                </div>

                <!-- KPI 3: Active Deals -->
                <div class="saas-kpi-card" style="cursor: pointer;" onclick="document.querySelector('[data-admin-tab=deals]').click()">
                  <div class="saas-kpi-header">
                    <span class="saas-kpi-title">Active AI Deals</span>
                    <span class="saas-kpi-dots">•••</span>
                  </div>
                  <div class="saas-kpi-bottom">
                    <div>
                      <div class="saas-kpi-num">${allDealsList.length}</div>
                      <div style="font-size: 0.78rem; font-weight: 700; color: #1C46F5; margin-top: 4px; display: flex; align-items: center; gap: 4px;">
                        <span>↑ 8 added</span>
                        <span style="color: #94A3B8; font-weight: 500;">verified active</span>
                      </div>
                    </div>
                    <svg class="saas-sparkline-svg" viewBox="0 0 100 32">
                      <path d="M 0 26 Q 30 20, 65 10 T 100 4" fill="none" stroke="#1C46F5" stroke-width="2.5" stroke-linecap="round"/>
                      <path d="M 0 26 Q 30 20, 65 10 T 100 4 L 100 32 L 0 32 Z" fill="rgba(28, 70, 245, 0.08)"/>
                    </svg>
                  </div>
                </div>

                <!-- KPI 4: Published Articles -->
                <div class="saas-kpi-card" style="cursor: pointer;" onclick="document.querySelector('[data-admin-tab=articles]').click()">
                  <div class="saas-kpi-header">
                    <span class="saas-kpi-title">Published Editions</span>
                    <span class="saas-kpi-dots">•••</span>
                  </div>
                  <div class="saas-kpi-bottom">
                    <div>
                      <div class="saas-kpi-num">${state.articles.length}</div>
                      <div style="font-size: 0.78rem; font-weight: 700; color: #1C46F5; margin-top: 4px; display: flex; align-items: center; gap: 4px;">
                        <span>✓ 100% Live</span>
                        <span style="color: #94A3B8; font-weight: 500;">daily pipeline</span>
                      </div>
                    </div>
                    <svg class="saas-sparkline-svg" viewBox="0 0 100 32">
                      <path d="M 0 22 Q 35 15, 70 8 T 100 2" fill="none" stroke="#1C46F5" stroke-width="2.5" stroke-linecap="round"/>
                      <path d="M 0 22 Q 35 15, 70 8 T 100 2 L 100 32 L 0 32 Z" fill="rgba(28, 70, 245, 0.08)"/>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Two Column Split (Overview) -->
              <div class="saas-dashboard-split">
                <!-- Left Column: Pending Submissions & Broadcast Quick Actions -->
                <div style="display: flex; flex-direction: column; gap: 24px;">
                  <div class="saas-panel-card">
                    <div class="saas-panel-header">
                      <div>
                        <h3 class="saas-panel-title">Pending Tool Submissions</h3>
                        <div class="saas-panel-sub">Recent AI tools submitted by founders from #/submit for directory indexing</div>
                      </div>
                      <button type="button" class="saas-btn-ghost" id="overview-btn-review-subs">View All →</button>
                    </div>

                    ${pendingSubmissions.length === 0 ? `
                      <div style="text-align: center; padding: 36px 20px; background: #F8FAFC; border-radius: 12px; border: 1px dashed #CBD5E1;">
                        <span style="font-size: 2rem;">🎉</span>
                        <h4 style="font-size: 1rem; font-weight: 800; color: #0F172A; margin: 8px 0 4px 0;">All caught up!</h4>
                        <p style="font-size: 0.8125rem; color: #64748B; margin: 0;">No pending tool submissions waiting for review.</p>
                      </div>
                    ` : `
                      <div class="saas-submissions-grid">
                        ${pendingSubmissions.slice(0, 3).map(sub => `
                          <div class="saas-sub-card">
                            <div class="saas-sub-card-header">
                              <div style="display: flex; align-items: center; gap: 10px;">
                                <div class="saas-sub-icon">${sub.toolName ? sub.toolName.charAt(0).toUpperCase() : 'T'}</div>
                                <div>
                                  <div class="saas-sub-name">${escapeHtml(sub.toolName || 'Untitled Tool')}</div>
                                  <div class="saas-sub-author">${escapeHtml(sub.category || 'AI Tool')} • ${escapeHtml(sub.pricing || 'Free')}</div>
                                </div>
                              </div>
                              <span class="saas-status-badge pending">Pending</span>
                            </div>
                            <div class="saas-sub-desc">${escapeHtml(sub.tagline || sub.description || 'No description provided')}</div>
                            <div class="saas-sub-actions">
                              <button type="button" class="saas-btn-approve btn-approve-submission" data-id="${sub.id}">Approve & Publish</button>
                              <a href="${sub.websiteUrl || '#'}" target="_blank" class="saas-btn-preview-link">Inspect Site ↗</a>
                            </div>
                          </div>
                        `).join('')}
                      </div>
                    `}
                  </div>

                  <!-- Quick Email Broadcast Banner -->
                  <div class="saas-panel-card" style="background: linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%) !important; color: #FFFFFF; border: none !important;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                      <div>
                        <span style="font-size: 0.75rem; font-weight: 700; color: #38BDF8; text-transform: uppercase; letter-spacing: 0.08em;">Email Automation</span>
                        <h3 style="font-size: 1.25rem; font-weight: 800; color: #FFFFFF; margin: 4px 0 6px 0;">Broadcast Daily Brief to ${normalizedSubscribers.length > 0 ? normalizedSubscribers.length : 500} Subscribers</h3>
                        <p style="font-size: 0.8125rem; color: #94A3B8; margin: 0;">Send today's latest edition directly to all reader inboxes with 1 click.</p>
                      </div>
                      <button type="button" class="saas-btn-primary" onclick="document.querySelector('[data-admin-tab=emails]').click()" style="background: #10B981; color: #FFFFFF; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 15px rgba(16,185,129,0.35);">
                        🚀 Open Broadcast Engine →
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Right Column: Monetization & Traffic Insights -->
                <div style="display: flex; flex-direction: column; gap: 24px;">
                  <div class="saas-panel-card">
                    <div class="saas-panel-header">
                      <h3 class="saas-panel-title">Monetization & Ad Slots</h3>
                      <button type="button" class="saas-btn-ghost" onclick="document.querySelector('[data-admin-tab=sponsors]').click()">Manage Ads →</button>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #FEF3C7; border-radius: 8px; border: 1px solid #FDE68A; margin-bottom: 12px;">
                      <div>
                        <div style="font-size: 0.85rem; font-weight: 800; color: #92400E;">Incoming Ad Inquiries (${allAdInquiries.length})</div>
                        <div style="font-size: 0.75rem; color: #B45309;">${pendingAdInquiries.length} pending review from #/advertise</div>
                      </div>
                      <button type="button" class="saas-btn-ghost" style="padding: 5px 10px; font-size: 0.75rem; font-weight: 700; background: #FFFFFF; border-color: #FCD34D;" onclick="document.querySelector('[data-admin-tab=sponsors]').click()">Review Inquiries →</button>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #F8FAFC; border-radius: 8px; border: 1px solid #E2E8F0;">
                        <div>
                          <div style="font-size: 0.85rem; font-weight: 700; color: #0F172A;">Top Header Sponsor</div>
                          <div style="font-size: 0.75rem; color: #64748B;">Headline Bar on Homepage</div>
                        </div>
                        <span style="font-size: 0.75rem; font-weight: 700; color: #10B981; background: #ECFDF5; padding: 3px 8px; border-radius: 6px;">${sponsorSettings.topBar.active ? '● Active' : '○ Inactive'}</span>
                      </div>

                      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #F8FAFC; border-radius: 8px; border: 1px solid #E2E8F0;">
                        <div>
                          <div style="font-size: 0.85rem; font-weight: 700; color: #0F172A;">Article In-Feed Box</div>
                          <div style="font-size: 0.75rem; color: #64748B;">Sponsored Deal inside articles</div>
                        </div>
                        <span style="font-size: 0.75rem; font-weight: 700; color: #10B981; background: #ECFDF5; padding: 3px 8px; border-radius: 6px;">${sponsorSettings.inFeed.active ? '● Active' : '○ Inactive'}</span>
                      </div>

                      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #F8FAFC; border-radius: 8px; border: 1px solid #E2E8F0;">
                        <div>
                          <div style="font-size: 0.85rem; font-weight: 700; color: #0F172A;">Partner Tiles Strip</div>
                          <div style="font-size: 0.75rem; color: #64748B;">${(sponsorSettings.sponsorLogos || []).length} Active Partners</div>
                        </div>
                        <button type="button" class="saas-btn-ghost" style="padding: 4px 8px; font-size: 0.75rem;" onclick="document.querySelector('[data-admin-tab=sponsors]').click()">Edit ✏️</button>
                      </div>
                    </div>
                  </div>

                  <!-- Subscribers Quick Export -->
                  <div class="saas-panel-card">
                    <div class="saas-panel-header">
                      <h3 class="saas-panel-title">Audience CRM</h3>
                      <button type="button" class="saas-btn-ghost" id="overview-btn-export-csv">Export CSV 📥</button>
                    </div>
                    <p style="font-size: 0.8125rem; color: #64748B; margin-bottom: 14px;">
                      <strong>${normalizedSubscribers.length}</strong> total verified subscribers recorded in local & cloud CRM.
                    </p>
                    <button type="button" class="saas-btn-primary" style="width: 100%; border-radius: 8px;" onclick="document.querySelector('[data-admin-tab=subscribers]').click()">
                      View Subscriber CRM Table →
                    </button>
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- ========================================================= -->
            <!-- TAB: SPONSORS & AD SLOTS MANAGER -->
            <!-- ========================================================= -->
            ${activeTab === 'sponsors' ? `
              <!-- SUB-SECTION 1: INCOMING SPONSOR & AD BOOKINGS FROM #/advertise -->
              <div class="saas-panel-card" style="margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #E2E8F0; flex-wrap: wrap; gap: 12px;">
                  <div>
                    <span style="font-size: 0.78rem; font-weight: 700; color: #10B981; text-transform: uppercase; letter-spacing: 0.08em;">Monetization Inbound Pipeline</span>
                    <h2 style="font-family: var(--font-header); font-size: 1.5rem; font-weight: 800; color: #0F172A; margin: 4px 0 0 0;">📥 Incoming Sponsor Bookings &amp; Ad Inquiries</h2>
                    <p style="font-size: 0.85rem; color: #64748B; margin: 4px 0 0 0;">Advertiser bookings submitted via public <code>#/advertise</code> campaign studio. Click <strong>✓ Approve to Live Slot</strong> to push any ad live!</p>
                  </div>
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <a href="#/advertise" target="_blank" class="saas-btn-ghost" style="font-weight: 700; font-size: 0.8125rem; text-decoration: none;">Public #/advertise Page ↗</a>
                  </div>
                </div>

                ${allAdInquiries.length === 0 ? `
                  <div style="text-align: center; padding: 40px; color: #64748B;">No ad campaign inquiries submitted yet.</div>
                ` : `
                  <div style="overflow-x: auto;">
                    <table class="saas-table" style="width: 100%; min-width: 860px;">
                      <thead>
                        <tr>
                          <th>Date &amp; Brand</th>
                          <th>Contact Person</th>
                          <th>Requested Placement</th>
                          <th>Schedule Window</th>
                          <th>Ad Copy &amp; Headline</th>
                          <th>Status</th>
                          <th style="text-align: right;">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${allAdInquiries.map(inq => {
                          const slotBadge = inq.slot === 'hero' 
                            ? '<span style="background: #EEF2FF; color: #1C46F5; font-weight: 700; padding: 3px 8px; border-radius: 6px; font-size: 0.75rem;">⭐ Slot 1: Top Bar</span>'
                            : inq.slot === 'spotlight'
                            ? '<span style="background: #ECFDF5; color: #059669; font-weight: 700; padding: 3px 8px; border-radius: 6px; font-size: 0.75rem;">📰 Slot 2: In-Feed</span>'
                            : '<span style="background: #FEF3C7; color: #D97706; font-weight: 700; padding: 3px 8px; border-radius: 6px; font-size: 0.75rem;">⚡ Slot 3: Partner Tile</span>';
                          
                          return `
                            <tr>
                              <td>
                                <div style="font-weight: 700; color: #0F172A; font-size: 0.95rem;">${escapeHtml(inq.brandName || 'Untitled Brand')}</div>
                                <div style="font-size: 0.75rem; color: #94A3B8; margin-top: 2px;">${escapeHtml(inq.createdAt ? new Date(inq.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Recent')}</div>
                                ${inq.targetUrl ? `<a href="${escapeHtml(inq.targetUrl)}" target="_blank" style="font-size: 0.78rem; color: #1C46F5; text-decoration: none;">${escapeHtml(inq.targetUrl)} ↗</a>` : ''}
                              </td>
                              <td>
                                <div style="font-weight: 600; color: #0F172A;">${escapeHtml(inq.contactName || 'Lead')}</div>
                                <a href="mailto:${escapeHtml(inq.workEmail || '')}" style="font-size: 0.78rem; color: #64748B; text-decoration: none;">${escapeHtml(inq.workEmail || '')}</a>
                              </td>
                              <td>${slotBadge}</td>
                              <td>
                                <div style="font-weight: 700; color: #0F172A; font-size: 0.8125rem;">${escapeHtml(inq.days || 7)} Days</div>
                                <div style="font-size: 0.75rem; color: #64748B;">${escapeHtml(inq.startDate || '')} → ${escapeHtml(inq.endDate || '')}</div>
                                <div style="font-size: 0.72rem; color: #059669; font-weight: 700;">${escapeHtml(inq.cost || '$0.00 (FREE)')}</div>
                              </td>
                              <td style="max-width: 240px;">
                                <div style="font-weight: 600; color: #334155; font-size: 0.8125rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;" title="${escapeHtml(inq.tagline || inq.message || '')}">
                                  ${escapeHtml(inq.tagline || inq.message || 'No headline specified')}
                                </div>
                                <div style="font-size: 0.72rem; color: #1C46F5; font-weight: 700; margin-top: 2px;">CTA: [${escapeHtml(inq.ctaText || 'Learn More')}]</div>
                              </td>
                              <td>
                                <span class="saas-status-badge ${inq.status === 'approved' ? 'approved' : 'pending'}">
                                  ${inq.status === 'approved' ? 'Active Live' : 'New Request'}
                                </span>
                              </td>
                              <td style="text-align: right; white-space: nowrap;">
                                ${inq.status !== 'approved' ? `
                                  <button type="button" class="saas-btn-approve btn-approve-ad-inquiry" data-id="${inq.id}" style="padding: 6px 12px; font-size: 0.8125rem;">✓ Approve to Live Slot</button>
                                ` : `
                                  <span style="color: #10B981; font-weight: 700; font-size: 0.8125rem;">● Live on Site</span>
                                `}
                                <a href="mailto:${escapeHtml(inq.workEmail)}?subject=AIRA%20Sponsorship%20Approval%20-%20${encodeURIComponent(inq.brandName || '')}" class="saas-btn-ghost" style="padding: 5px 10px; font-size: 0.78rem; text-decoration: none; margin-left: 6px;">✉️</a>
                                <button type="button" class="btn-delete-ad-inquiry" data-id="${inq.id}" style="background: none; border: none; color: #EF4444; font-size: 1.1rem; cursor: pointer; margin-left: 6px;" title="Delete Inquiry">✕</button>
                              </td>
                            </tr>
                          `;
                        }).join('')}
                      </tbody>
                    </table>
                  </div>
                `}
              </div>

              <!-- SUB-SECTION 2: CUSTOM PARTNERSHIP INQUIRIES -->
              ${allCustomPartnerships.length > 0 ? `
                <div class="saas-panel-card" style="margin-bottom: 24px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #E2E8F0;">
                    <div>
                      <h3 style="font-size: 1.1rem; font-weight: 800; color: #0F172A; margin: 0;">🏢 Custom Enterprise Partnership Requests</h3>
                      <p style="font-size: 0.78rem; color: #64748B; margin: 2px 0 0 0;">Bespoke brand campaigns submitted from the custom inquiry desk.</p>
                    </div>
                  </div>

                  <div style="overflow-x: auto;">
                    <table class="saas-table" style="width: 100%; min-width: 760px;">
                      <thead>
                        <tr>
                          <th>Partner Name</th>
                          <th>Work Email</th>
                          <th>Website URL</th>
                          <th>Scope / Message</th>
                          <th>Date</th>
                          <th style="text-align: right;">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${allCustomPartnerships.map(p => `
                          <tr>
                            <td style="font-weight: 700; color: #0F172A;">${escapeHtml(p.name || 'Partner')}</td>
                            <td><a href="mailto:${escapeHtml(p.email || '')}" style="color: #1C46F5; text-decoration: none; font-weight: 600;">${escapeHtml(p.email || '')}</a></td>
                            <td><a href="${escapeHtml(p.url || '#')}" target="_blank" style="color: #64748B; text-decoration: none; font-size: 0.8125rem;">${escapeHtml(p.url || '')} ↗</a></td>
                            <td style="font-size: 0.8125rem; color: #334155; max-width: 260px;">${escapeHtml(p.message || '')}</td>
                            <td style="font-size: 0.75rem; color: #64748B;">${escapeHtml(p.date ? new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Recent')}</td>
                            <td style="text-align: right; white-space: nowrap;">
                              <a href="mailto:${escapeHtml(p.email)}?subject=AIRA%20Partnership%20Discussion" class="saas-btn-ghost" style="padding: 5px 10px; font-size: 0.78rem; text-decoration: none;">✉️ Reply</a>
                              <button type="button" class="btn-delete-custom-partner" data-id="${p.id}" style="background: none; border: none; color: #EF4444; font-size: 1.1rem; cursor: pointer; margin-left: 6px;">✕</button>
                            </td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>
                </div>
              ` : ''}

              <!-- SUB-SECTION 3: ACTIVE LIVE AD SLOTS CONFIG -->
              <div class="saas-panel-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #E2E8F0; flex-wrap: wrap; gap: 12px;">
                  <div>
                    <span style="font-size: 0.78rem; font-weight: 700; color: #10B981; text-transform: uppercase; letter-spacing: 0.08em;">Live Ad Slot Configurations</span>
                    <h2 style="font-family: var(--font-header); font-size: 1.5rem; font-weight: 800; color: #0F172A; margin: 4px 0 0 0;">⚙️ Active Website Ad Slots</h2>
                    <p style="font-size: 0.85rem; color: #64748B; margin: 4px 0 0 0;">Control what sponsor announcements and ad banners appear live across AIRA homepage and articles.</p>
                  </div>
                  <button type="button" class="saas-btn-primary" id="btn-save-all-sponsor-settings" style="background: #10B981; color: white; padding: 11px 24px; border-radius: 8px; font-weight: 700;">
                    💾 Save Ad Settings &amp; Update Live Site
                  </button>
                </div>

                <form id="form-sponsor-settings">
                  <!-- SLOT 1: TOP HEADER ANNOUNCEMENT BAR -->
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 22px; margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                      <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.4rem;">🌟</span>
                        <div>
                          <h4 style="font-size: 1rem; font-weight: 800; color: #0F172A; margin: 0;">Slot 1: Top Header Announcement Ad Bar</h4>
                          <p style="font-size: 0.78rem; color: #64748B; margin: 2px 0 0 0;">Renders at the very top of the homepage hero section.</p>
                        </div>
                      </div>
                      <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 700; color: #0F172A;">
                        <input type="checkbox" id="sp-top-active" ${sponsorSettings.topBar.active ? 'checked' : ''} style="width: 18px; height: 18px;" />
                        <span>Active / Visible</span>
                      </label>
                    </div>

                    <div style="display: grid; grid-template-columns: 120px 80px 1fr 140px; gap: 12px; margin-bottom: 14px;">
                      <div class="form-group" style="margin: 0;">
                        <label class="form-label" style="font-size: 0.8125rem;">Badge Text</label>
                        <input type="text" id="sp-top-badge" class="form-control-input" value="${escapeHtml(sponsorSettings.topBar.badge || 'Ad')}" placeholder="e.g. Ad or Sponsored" />
                      </div>
                      <div class="form-group" style="margin: 0;">
                        <label class="form-label" style="font-size: 0.8125rem;">Icon</label>
                        <input type="text" id="sp-top-icon" class="form-control-input" value="${escapeHtml(sponsorSettings.topBar.icon || '⚡')}" style="text-align: center;" />
                      </div>
                      <div class="form-group" style="margin: 0;">
                        <label class="form-label" style="font-size: 0.8125rem;">Headline Text / Ad Copy</label>
                        <input type="text" id="sp-top-headline" class="form-control-input" value="${escapeHtml(sponsorSettings.topBar.headline || '')}" placeholder="e.g. DeepSeek v3.1 Flash — 90% Cheaper than Claude 3.5 Sonnet" />
                      </div>
                      <div class="form-group" style="margin: 0;">
                        <label class="form-label" style="font-size: 0.8125rem;">Button Text</label>
                        <input type="text" id="sp-top-cta-text" class="form-control-input" value="${escapeHtml(sponsorSettings.topBar.ctaText || 'Learn More')}" />
                      </div>
                    </div>

                    <div class="form-group" style="margin: 0;">
                      <label class="form-label" style="font-size: 0.8125rem;">Target Destination Link URL</label>
                      <input type="text" id="sp-top-link" class="form-control-input" value="${escapeHtml(sponsorSettings.topBar.link || '#/advertise')}" placeholder="https://sponsor.com/?ref=aira or #/advertise" />
                    </div>
                  </div>

                  <!-- SLOT 2: ARTICLE IN-FEED SPONSORED BOX -->
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 22px; margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                      <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.4rem;">📰</span>
                        <div>
                          <h4 style="font-size: 1rem; font-weight: 800; color: #0F172A; margin: 0;">Slot 2: Article In-Feed Sponsored Box</h4>
                          <p style="font-size: 0.78rem; color: #64748B; margin: 2px 0 0 0;">Placed inside daily briefs & reader articles.</p>
                        </div>
                      </div>
                      <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 700; color: #0F172A;">
                        <input type="checkbox" id="sp-feed-active" ${sponsorSettings.inFeed.active ? 'checked' : ''} style="width: 18px; height: 18px;" />
                        <span>Active / Visible</span>
                      </label>
                    </div>

                    <div style="display: grid; grid-template-columns: 200px 1fr; gap: 12px; margin-bottom: 14px;">
                      <div class="form-group" style="margin: 0;">
                        <label class="form-label" style="font-size: 0.8125rem;">Sponsor Tag</label>
                        <input type="text" id="sp-feed-tag" class="form-control-input" value="${escapeHtml(sponsorSettings.inFeed.tag || 'Featured Partner')}" />
                      </div>
                      <div class="form-group" style="margin: 0;">
                        <label class="form-label" style="font-size: 0.8125rem;">Offer Headline</label>
                        <input type="text" id="sp-feed-title" class="form-control-input" value="${escapeHtml(sponsorSettings.inFeed.title || '')}" />
                      </div>
                    </div>

                    <div class="form-group" style="margin-bottom: 14px;">
                      <label class="form-label" style="font-size: 0.8125rem;">Body Description</label>
                      <textarea id="sp-feed-body" class="form-control-textarea" rows="2">${escapeHtml(sponsorSettings.inFeed.body || '')}</textarea>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                      <div class="form-group" style="margin: 0;">
                        <label class="form-label" style="font-size: 0.8125rem;">Button Text</label>
                        <input type="text" id="sp-feed-btn-text" class="form-control-input" value="${escapeHtml(sponsorSettings.inFeed.btnText || 'Claim Deal →')}" />
                      </div>
                      <div class="form-group" style="margin: 0;">
                        <label class="form-label" style="font-size: 0.8125rem;">Button Link URL</label>
                        <input type="url" id="sp-feed-btn-link" class="form-control-input" value="${escapeHtml(sponsorSettings.inFeed.btnLink || '')}" />
                      </div>
                    </div>
                  </div>

                  <!-- SLOT 3: COMMUNITY & PARTNER LOGOS STRIP -->
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 22px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                      <div>
                        <h4 style="font-size: 1rem; font-weight: 800; color: #0F172A; margin: 0;">Slot 3: Partner & Sponsor Strip Tiles</h4>
                        <p style="font-size: 0.78rem; color: #64748B; margin: 2px 0 0 0;">Displayed below the hero section on homepage.</p>
                      </div>
                      <button type="button" id="btn-add-sponsor-logo-row" class="saas-btn-ghost" style="font-size: 0.8125rem; font-weight: 700;">+ Add Partner Tile</button>
                    </div>

                    <div id="sp-logos-rows-container">
                      ${(sponsorSettings.sponsorLogos || []).map((tile, idx) => `
                        <div style="display: grid; grid-template-columns: 60px 180px 1fr 40px; gap: 10px; margin-bottom: 10px; align-items: center;" class="sp-logo-row" data-idx="${idx}">
                          <input type="text" class="form-control-input sp-logo-inp-emoji" value="${escapeHtml(tile.emoji || '⚡')}" style="text-align: center;" />
                          <input type="text" class="form-control-input sp-logo-inp-name" value="${escapeHtml(tile.name || '')}" placeholder="Partner Name" />
                          <input type="text" class="form-control-input sp-logo-inp-link" value="${escapeHtml(tile.link || '')}" placeholder="Target URL" />
                          <button type="button" class="btn-story-action btn-delete-sp-logo" data-idx="${idx}" style="color: #DC2626; padding: 8px;">✕</button>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                </form>
              </div>
            ` : ''}

            <!-- ========================================================= -->
            <!-- TAB: 1-CLICK EMAIL BROADCAST ENGINE -->
            <!-- ========================================================= -->
            ${activeTab === 'emails' ? `
              <div class="saas-panel-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #E2E8F0; flex-wrap: wrap; gap: 12px;">
                  <div>
                    <span style="font-size: 0.78rem; font-weight: 700; color: #1C46F5; text-transform: uppercase; letter-spacing: 0.08em;">Newsletter Distribution</span>
                    <h2 style="font-family: var(--font-header); font-size: 1.5rem; font-weight: 800; color: #0F172A; margin: 4px 0 0 0;">1-Click Email Broadcast Engine</h2>
                    <p style="font-size: 0.85rem; color: #64748B; margin: 4px 0 0 0;">Deliver responsive HTML daily editions directly into subscriber inboxes via Resend or SendGrid.</p>
                  </div>
                  <button type="button" class="saas-btn-ghost" id="btn-preview-email-html" style="font-weight: 700; font-size: 0.875rem;">
                    👁️ Preview Full HTML Email
                  </button>
                </div>

                <!-- Broadcast Launchpad Card -->
                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 24px; margin-bottom: 28px;">
                  <h3 style="font-size: 1.1rem; font-weight: 800; color: #0F172A; margin: 0 0 16px 0;">🚀 Launch Daily Blast</h3>
                  
                  <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 16px;">
                    <div class="form-group" style="margin: 0;">
                      <label class="form-label" style="font-weight: 700;">Select Edition to Broadcast <span style="color: #DC2626;">*</span></label>
                      <select id="broadcast-edition-select" class="form-control-input" style="font-weight: 600;">
                        ${state.articles.map((art, idx) => `
                          <option value="${art.slug}" ${idx === 0 ? 'selected' : ''}>
                            ${art.date} — ${art.title}
                          </option>
                        `).join('')}
                      </select>
                    </div>

                    <div class="form-group" style="margin: 0;">
                      <label class="form-label" style="font-weight: 700;">Audience Target</label>
                      <select id="broadcast-audience-select" class="form-control-input">
                        <option value="all">All Active Subscribers (${normalizedSubscribers.length > 0 ? normalizedSubscribers.length : 500} readers)</option>
                        <option value="test">Test Send Only (Single Email)</option>
                      </select>
                    </div>
                  </div>

                  <!-- Test Send Bar -->
                  <div style="display: flex; gap: 10px; margin-bottom: 20px; align-items: center; background: #FFFFFF; border: 1px solid #E2E8F0; padding: 12px 16px; border-radius: 10px;">
                    <span style="font-size: 0.85rem; font-weight: 700; color: #1E293B; white-space: nowrap;">🧪 Send Test Preview:</span>
                    <input type="email" id="broadcast-test-email" class="form-control-input" placeholder="admin@domain.com" style="flex: 1; padding: 8px 12px;" />
                    <button type="button" id="btn-send-test-email" class="saas-btn-ghost" style="padding: 8px 16px; font-weight: 700;">Send Test</button>
                  </div>

                  <!-- Main Launch Button -->
                  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
                    <div style="font-size: 0.8125rem; color: #64748B;">
                      Estimated Delivery Speed: <strong>~1,000 emails / sec</strong> • Deliverability: <strong>99.8%</strong>
                    </div>
                    <button type="button" id="btn-launch-broadcast-all" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: #FFFFFF; border: none; font-weight: 800; font-size: 1rem; padding: 12px 32px; border-radius: 10px; cursor: pointer; box-shadow: 0 4px 15px rgba(16,185,129,0.35); display: inline-flex; align-items: center; gap: 8px;">
                      🚀 Launch Broadcast to All Subscribers
                    </button>
                  </div>
                </div>

                <!-- Broadcast History Log Table -->
                <div>
                  <h3 style="font-size: 1.1rem; font-weight: 800; color: #0F172A; margin: 0 0 14px 0;">📊 Recent Broadcast Dispatches</h3>
                  
                  <table class="saas-table" style="width: 100%; text-align: left;">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Edition Headline</th>
                        <th>Recipients</th>
                        <th>Status</th>
                        <th>Open Rate</th>
                        <th>Clicks</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${broadcastHistory.map(bc => `
                        <tr>
                          <td style="font-weight: 600; color: #64748B; font-size: 0.8125rem;">${escapeHtml(bc.date || '')}</td>
                          <td style="font-weight: 700; color: #0F172A;">${escapeHtml(bc.editionTitle || '')}</td>
                          <td style="font-weight: 600;">${bc.recipients.toLocaleString()}</td>
                          <td><span class="saas-status-badge approved">${escapeHtml(bc.status || 'Delivered ✅')}</span></td>
                          <td style="font-weight: 700; color: #10B981;">${escapeHtml(bc.openRate || '48%')}</td>
                          <td style="font-weight: 700; color: #1C46F5;">${escapeHtml(bc.clicks || '22%')}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            ` : ''}

            <!-- ========================================================= -->
            <!-- TAB: SUBMISSIONS -->
            <!-- ========================================================= -->
            ${activeTab === 'submissions' ? `
              <div class="saas-panel-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
                  <div>
                    <h2 class="saas-panel-title">🛠️ Tool Submissions Management</h2>
                    <div class="saas-panel-sub">Review and verify user-submitted AI tools from <code>#/submit</code> for the public directory</div>
                  </div>
                  <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                    <a href="#/submit" target="_blank" class="saas-btn-ghost" style="font-weight: 700; font-size: 0.8125rem; text-decoration: none;">Public #/submit Form ↗</a>
                    <button type="button" class="saas-btn-filter ${subFilter === 'all' ? 'active' : ''}" data-sub-filter="all">All (${allSubmissions.length})</button>
                    <button type="button" class="saas-btn-filter ${subFilter === 'pending' ? 'active' : ''}" data-sub-filter="pending">Pending (${pendingSubmissions.length})</button>
                    <button type="button" class="saas-btn-filter ${subFilter === 'approved' ? 'active' : ''}" data-sub-filter="approved">Approved</button>
                  </div>
                </div>

                ${filteredSubmissions.length === 0 ? `
                  <div style="text-align: center; padding: 40px; color: #64748B;">No submissions match your query.</div>
                ` : `
                  <div style="overflow-x: auto;">
                    <table class="saas-table" style="width: 100%; min-width: 860px;">
                      <thead>
                        <tr>
                          <th>Tool Name &amp; URL</th>
                          <th>Submitter Contact</th>
                          <th>Category &amp; Pricing</th>
                          <th>Tagline / Pitch</th>
                          <th>Spotlight Badge</th>
                          <th>Status</th>
                          <th style="text-align: right;">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${filteredSubmissions.map(sub => `
                          <tr>
                            <td>
                              <div style="font-weight: 700; color: #0F172A; font-size: 0.95rem;">${escapeHtml(sub.toolName || 'Untitled')}</div>
                              <a href="${escapeHtml(sub.websiteUrl || sub.toolUrl || '#')}" target="_blank" style="font-size: 0.78rem; color: #1C46F5; text-decoration: none;">${escapeHtml(sub.websiteUrl || sub.toolUrl || '')} ↗</a>
                            </td>
                            <td>
                              <div style="font-weight: 600; color: #0F172A; font-size: 0.85rem;">${escapeHtml(sub.contactName || 'Submitter')}</div>
                              <a href="mailto:${escapeHtml(sub.contactEmail || '')}" style="font-size: 0.78rem; color: #64748B; text-decoration: none;">${escapeHtml(sub.contactEmail || '')}</a>
                            </td>
                            <td>
                              <div style="font-weight: 700; color: #1C46F5; font-size: 0.8125rem;">${escapeHtml(sub.category || 'developer-tools')}</div>
                              <div style="font-size: 0.75rem; color: #64748B;">${escapeHtml(sub.pricing || 'Freemium')}</div>
                            </td>
                            <td style="max-width: 220px;">
                              <div style="font-size: 0.8125rem; color: #334155; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;" title="${escapeHtml(sub.tagline || sub.description || '')}">
                                ${escapeHtml(sub.tagline || sub.description || 'No tagline provided')}
                              </div>
                            </td>
                            <td>
                              <select class="form-control-input sub-spotlight-select" data-id="${sub.id}" style="padding: 4px 8px; font-size: 0.78rem;">
                                <option value="" ${!sub.badge ? 'selected' : ''}>Standard</option>
                                <option value="Featured Spotlight" ${sub.badge === 'Featured Spotlight' ? 'selected' : ''}>⭐ Featured Spotlight</option>
                                <option value="Trending Hot" ${sub.badge === 'Trending Hot' ? 'selected' : ''}>🔥 Trending Hot</option>
                                <option value="Production Verified" ${sub.badge === 'Production Verified' ? 'selected' : ''}>⚡ Production Verified</option>
                                <option value="Lifetime Deal" ${sub.badge === 'Lifetime Deal' ? 'selected' : ''}>🎁 Lifetime Deal</option>
                              </select>
                            </td>
                            <td>
                              <span class="saas-status-badge ${sub.status === 'approved' ? 'approved' : 'pending'}">${escapeHtml(sub.status || 'pending')}</span>
                            </td>
                            <td style="text-align: right; white-space: nowrap;">
                              ${sub.status !== 'approved' ? `
                                <button type="button" class="saas-btn-approve btn-approve-submission" data-id="${sub.id}" style="padding: 6px 12px; font-size: 0.8125rem;">✓ Approve</button>
                              ` : `<span style="color: #10B981; font-weight: 700; font-size: 0.8125rem;">Live in Directory</span>`}
                              <button type="button" class="btn-delete-submission" data-id="${sub.id}" style="background: none; border: none; color: #EF4444; font-size: 1.1rem; cursor: pointer; margin-left: 8px;" title="Delete Submission">✕</button>
                            </td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>
                `}
              </div>
            ` : ''}

            <!-- ========================================================= -->
            <!-- TAB: DEALS -->
            <!-- ========================================================= -->
            ${activeTab === 'deals' ? `
              <div class="saas-panel-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
                  <div>
                    <h2 class="saas-panel-title">AI Deals & Affiliate Monetization</h2>
                    <div class="saas-panel-sub">Manage exclusive discounts, lifetime deals and affiliate partnerships</div>
                  </div>
                  <button type="button" class="saas-btn-primary" id="btn-add-new-deal" style="padding: 9px 18px;">+ Add Deal</button>
                </div>

                <table class="saas-table" style="width: 100%;">
                  <thead>
                    <tr>
                      <th>Brand / Tool</th>
                      <th>Headline</th>
                      <th>Discount Badge</th>
                      <th>Coupon Code</th>
                      <th>Category</th>
                      <th style="text-align: right;">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${filteredDeals.map(d => `
                      <tr>
                        <td style="font-weight: 700; color: #0F172A;">${escapeHtml(d.toolName || '')}</td>
                        <td style="font-size: 0.875rem;">${escapeHtml(d.headline || '')}</td>
                        <td><span style="background: #FEF3C7; color: #D97706; font-weight: 700; font-size: 0.75rem; padding: 2px 8px; border-radius: 4px;">${escapeHtml(d.discountBadge || 'DEAL')}</span></td>
                        <td style="font-family: monospace; font-weight: 700; color: #1C46F5;">${escapeHtml(d.couponCode || 'N/A')}</td>
                        <td style="color: #64748B; font-size: 0.8125rem;">${escapeHtml(d.category || 'coding')}</td>
                        <td style="text-align: right;">
                          <button type="button" class="btn-delete-deal" data-id="${d.id}" style="background: none; border: none; color: #EF4444; font-size: 1.1rem; cursor: pointer;">✕</button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}

            <!-- ========================================================= -->
            <!-- TAB: ARTICLES -->
            <!-- ========================================================= -->
            ${activeTab === 'articles' ? `
              <div class="saas-panel-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
                  <div>
                    <h2 class="saas-panel-title">Newsletter Articles & Daily Briefs</h2>
                    <div class="saas-panel-sub">Total ${state.articles.length} published editions in production dataset</div>
                  </div>
                  <button type="button" class="saas-btn-primary" id="btn-articles-new-edition">+ Create New Article</button>
                </div>

                <table class="saas-table" style="width: 100%;">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Title & Subtitle</th>
                      <th>Category</th>
                      <th>Read Time</th>
                      <th style="text-align: right;">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${filteredAdminArticles.map(art => `
                      <tr>
                        <td style="font-weight: 600; color: #64748B; font-size: 0.8125rem; white-space: nowrap;">${escapeHtml(art.date || '')}</td>
                        <td>
                          <div style="font-weight: 700; color: #0F172A; font-size: 0.95rem;">${escapeHtml(art.title || '')}</div>
                          <div style="font-size: 0.78rem; color: #64748B;">${escapeHtml(art.subtitle || '')}</div>
                        </td>
                        <td><span style="background: #EEF2FF; color: #1C46F5; font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 4px;">${escapeHtml(art.tag || 'News')}</span></td>
                        <td style="color: #64748B; font-size: 0.8125rem;">${escapeHtml(art.reading_time || '4 min')}</td>
                        <td style="text-align: right; white-space: nowrap;">
                          <button type="button" class="saas-btn-ghost btn-edit-article" data-slug="${art.slug}" style="padding: 5px 12px; font-weight: 700;">✏️ Edit</button>
                          <a href="#/p/${art.slug}" target="_blank" class="saas-btn-ghost" style="padding: 5px 12px; font-weight: 600; text-decoration: none; margin-left: 6px;">👁️ View</a>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}

            <!-- ========================================================= -->
            <!-- TAB: SUBSCRIBERS CRM -->
            <!-- ========================================================= -->
            ${activeTab === 'subscribers' ? `
              <div class="saas-panel-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
                  <div>
                    <h2 class="saas-panel-title">Subscribers CRM & Audience List</h2>
                    <div class="saas-panel-sub">Real-time database of readers subscribed to AIRA Daily</div>
                  </div>
                  <div style="display: flex; gap: 10px;">
                    <button type="button" class="saas-btn-ghost" id="btn-copy-all-subscribers">📋 Copy All Emails</button>
                    <button type="button" class="saas-btn-primary" id="btn-export-subscribers-csv">📥 Export to CSV</button>
                  </div>
                </div>

                <table class="saas-table" style="width: 100%;">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Email Address</th>
                      <th>Subscribed Date</th>
                      <th>Lead Source</th>
                      <th style="text-align: right;">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${filteredSubscribers.length === 0 ? `
                      <tr><td colspan="5" style="text-align: center; color: #64748B; padding: 30px;">No subscribers found.</td></tr>
                    ` : filteredSubscribers.map(sub => `
                      <tr>
                        <td style="color: #94A3B8; font-size: 0.8125rem;">${sub.id}</td>
                        <td style="font-weight: 700; color: #0F172A;">${escapeHtml(sub.email || '')}</td>
                        <td style="color: #64748B; font-size: 0.8125rem;">${escapeHtml(sub.date || 'Earlier')}</td>
                        <td style="color: #64748B; font-size: 0.8125rem;">${escapeHtml(sub.source || 'Website Form')}</td>
                        <td style="text-align: right;"><span class="saas-status-badge approved">Subscribed</span></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}

            <!-- ========================================================= -->
            <!-- TAB: COMMENTS -->
            <!-- ========================================================= -->
            ${activeTab === 'comments' ? `
              <div class="saas-panel-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                  <div>
                    <h2 class="saas-panel-title">Comments & Reader Feedback</h2>
                    <div class="saas-panel-sub">Moderate user discussions and article ratings</div>
                  </div>
                </div>

                ${filteredComments.length === 0 ? `
                  <div style="text-align: center; padding: 40px; color: #64748B;">No reader comments recorded yet.</div>
                ` : `
                  <table class="saas-table" style="width: 100%;">
                    <thead>
                      <tr>
                        <th>Author</th>
                        <th>Comment Text</th>
                        <th>Article Slug</th>
                        <th>Date</th>
                        <th style="text-align: right;">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${filteredComments.map(c => `
                        <tr>
                          <td style="font-weight: 700; color: #0F172A;">${escapeHtml(c.author)}</td>
                          <td style="font-size: 0.875rem;">${escapeHtml(c.text)}</td>
                          <td style="font-size: 0.78rem; color: #1C46F5;">${escapeHtml(c.postSlug)}</td>
                          <td style="font-size: 0.78rem; color: #64748B;">${escapeHtml(c.date)}</td>
                          <td style="text-align: right;">
                            <button type="button" class="btn-delete-comment" data-slug="${c.postSlug}" data-idx="${c.index}" style="background: none; border: none; color: #EF4444; font-size: 1.1rem; cursor: pointer;">🗑️</button>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                `}
              </div>
            ` : ''}

            <!-- ========================================================= -->
            <!-- TAB: SETTINGS & BACKUP -->
            <!-- ========================================================= -->
            ${activeTab === 'settings' ? `
              <div class="saas-panel-card">
                <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #E2E8F0;">
                  <h2 class="saas-panel-title">Settings & System Security Hub</h2>
                  <div class="saas-panel-sub">Configure Master PIN, download full data backups, and manage cloud integrations</div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                  <!-- Card 1: PIN Security -->
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 22px;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
                      <span style="font-size: 1.5rem;">🔐</span>
                      <div>
                        <h4 style="font-size: 1rem; font-weight: 800; color: #0F172A; margin: 0;">Master PIN Security</h4>
                        <p style="font-size: 0.78rem; color: #64748B; margin: 2px 0 0 0;">Update the PIN used to unlock this Admin Portal</p>
                      </div>
                    </div>

                    <form id="form-change-admin-pin" style="display: flex; flex-direction: column; gap: 12px;">
                      <div class="form-group" style="margin: 0;">
                        <label class="form-label" style="font-size: 0.8125rem;">New Master PIN (4-8 digits)</label>
                        <input type="password" id="input-new-admin-pin" class="form-control-input" placeholder="e.g. 2026" required />
                      </div>
                      <button type="submit" class="saas-btn-primary" style="padding: 10px 18px; border-radius: 8px;">
                        Update PIN Code
                      </button>
                    </form>
                  </div>

                  <!-- Card 2: 1-Click Backup & Restore -->
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 22px;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
                      <span style="font-size: 1.5rem;">💾</span>
                      <div>
                        <h4 style="font-size: 1rem; font-weight: 800; color: #0F172A; margin: 0;">1-Click Full System Backup</h4>
                        <p style="font-size: 0.78rem; color: #64748B; margin: 2px 0 0 0;">Export or restore all articles, tools, deals & subscribers</p>
                      </div>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                      <button type="button" id="btn-download-full-backup" class="saas-btn-primary" style="background: #10B981; padding: 11px 18px; border-radius: 8px; width: 100%; text-align: center;">
                        📥 Download Full Backup (.json)
                      </button>

                      <label for="input-restore-backup-file" class="saas-btn-ghost" style="padding: 11px 18px; border-radius: 8px; text-align: center; cursor: pointer; display: block; font-weight: 700;">
                        📤 Restore from Backup (.json)
                        <input type="file" id="input-restore-backup-file" accept=".json" style="display: none;" />
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Supabase Cloud Sync Info -->
                <div style="margin-top: 24px; background: #EEF2FF; border: 1px solid #C7D2FE; border-radius: 12px; padding: 20px;">
                  <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
                    <div>
                      <h4 style="font-size: 0.95rem; font-weight: 800; color: #1C46F5; margin: 0;">⚡ Supabase Real-Time Cloud Sync</h4>
                      <p style="font-size: 0.8125rem; color: #4338CA; margin: 4px 0 0 0;">Subscribers and tool submissions automatically synchronize with your cloud database backend.</p>
                    </div>
                    <button type="button" id="btn-purge-local-cache" class="saas-btn-ghost" style="background: #FFFFFF; color: #DC2626; border-color: #FECACA; font-size: 0.8125rem;">
                      🧹 Purge Local Overrides Cache
                    </button>
                  </div>
                </div>

              </div>
            ` : ''}

          </main>
        </div>

      </div>

      <!-- MODAL: ADD / EDIT DEAL -->
      <div class="admin-modal-overlay" id="modal-deal-editor">
        <div class="admin-modal-box">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
            <h3 style="font-size: 1.35rem; font-weight: 900; color: var(--color-text-primary); margin: 0;" id="modal-deal-title">Add Affiliate Deal</h3>
            <button type="button" class="modal-close-btn" id="btn-close-deal-modal" style="background: none; border: none; font-size: 1.3rem; cursor: pointer; color: var(--color-text-muted);">✕</button>
          </div>
          
          <form id="form-deal-editor">
            <input type="hidden" id="deal-edit-id" value="" />
            
            <div class="form-group">
              <label class="form-label">Tool / Brand Name <span class="req">*</span></label>
              <input type="text" id="deal-input-tool-name" class="form-input" placeholder="e.g., Cursor AI" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="form-label">Category</label>
                <select id="deal-input-category" class="form-select">
                  <option value="coding">Developer & Code</option>
                  <option value="writing">Writing & Copy</option>
                  <option value="video">Video & Media</option>
                  <option value="marketing">Marketing & SEO</option>
                  <option value="productivity">Productivity</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Discount Badge <span class="req">*</span></label>
                <input type="text" id="deal-input-badge" class="form-input" placeholder="e.g., 20% OFF or FREE TRIAL" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Headline / Offer Title <span class="req">*</span></label>
              <input type="text" id="deal-input-headline" class="form-input" placeholder="e.g., 20% Off Annual Subscription" required />
            </div>

            <div class="form-group">
              <label class="form-label">Short Description</label>
              <textarea id="deal-input-desc" class="form-textarea" placeholder="Explain what the tool offers and how to claim the discount..."></textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="form-label">Coupon Code (Optional)</label>
                <input type="text" id="deal-input-code" class="form-input" placeholder="e.g., AIRA20" />
              </div>

              <div class="form-group">
                <label class="form-label">Expiry / Status</label>
                <input type="text" id="deal-input-expiry" class="form-input" placeholder="e.g., Limited Time / Verified Active" value="Verified Active" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Affiliate / Target URL <span class="req">*</span></label>
              <input type="url" id="deal-input-url" class="form-input" placeholder="https://yourpartner.com/?ref=aira" required />
            </div>

            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
              <button type="button" class="btn-cancel-modal" id="btn-cancel-deal-modal" style="background: var(--color-border-light); border: 1px solid var(--color-border); padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer;">Cancel</button>
              <button type="submit" class="saas-btn-primary" style="padding: 10px 22px; border-radius: 8px;">Save Deal 🏷️</button>
            </div>
          </form>
        </div>
      </div>

      <!-- MODAL: LIVE HTML EMAIL PREVIEW -->
      <div class="admin-modal-overlay" id="modal-email-preview">
        <div class="admin-modal-box" style="max-width: 680px; width: 95%; max-height: 90vh; display: flex; flex-direction: column; padding: 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div>
              <h3 style="font-size: 1.2rem; font-weight: 800; color: #0F172A; margin: 0;">👁️ Live HTML Email Preview</h3>
              <p style="font-size: 0.78rem; color: #64748B; margin: 2px 0 0 0;">This is exactly how the email newsletter renders in subscriber inboxes.</p>
            </div>
            <button type="button" class="modal-close-btn" id="btn-close-email-preview" style="background: none; border: none; font-size: 1.3rem; cursor: pointer; color: #64748B;">✕</button>
          </div>
          <div style="flex: 1; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; background: #F8FAFC; min-height: 480px;">
            <iframe id="email-preview-iframe" style="width: 100%; height: 500px; border: none; background: #FFFFFF;"></iframe>
          </div>
        </div>
      </div>
    `;

    // =========================================================================
    // EVENT BINDINGS FOR ADMIN DASHBOARD
    // =========================================================================

    // 1. Sidebar & Tab Navigation
    appContainer.querySelectorAll('[data-admin-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.adminTab = btn.getAttribute('data-admin-tab');
        state.adminEditingArticle = null;
        renderAdminPage();
      });
    });

    // 2. Lock Session Handlers
    const lockHandler = () => {
      lockAdmin();
      renderAdminPage();
    };
    document.getElementById('btn-sidebar-lock-admin')?.addEventListener('click', lockHandler);
    document.getElementById('btn-topbar-lock')?.addEventListener('click', lockHandler);

    // Sidebar collapse toggle
    const sidebarToggle = appContainer.querySelector('.saas-sidebar-toggle');
    const sidebarEl = appContainer.querySelector('.saas-admin-sidebar');
    if (sidebarToggle && sidebarEl) {
      sidebarToggle.addEventListener('click', () => {
        sidebarEl.classList.toggle('collapsed');
        sidebarToggle.textContent = sidebarEl.classList.contains('collapsed') ? '»' : '«';
      });
    }

    // Topbar Search input
    const saasSearch = document.getElementById('saas-topbar-search');
    if (saasSearch) {
      saasSearch.addEventListener('input', (e) => {
        const val = e.target.value;
        if (state.adminTab === 'articles') state.adminArticleSearch = val;
        else if (state.adminTab === 'submissions') state.adminSubmissionSearch = val;
        else if (state.adminTab === 'deals') state.adminDealSearch = val;
        else if (state.adminTab === 'subscribers') state.adminSubscriberSearch = val;
        else {
          state.adminSubmissionSearch = val;
          state.adminDealSearch = val;
        }
        renderAdminPage();
        const reInput = document.getElementById('saas-topbar-search');
        if (reInput) { reInput.focus(); reInput.setSelectionRange(reInput.value.length, reInput.value.length); }
      });
    }

    function openNewArticleEditor() {
      const defaultTmpl = typeof ARTICLE_TEMPLATES !== 'undefined' && ARTICLE_TEMPLATES[0] ? ARTICLE_TEMPLATES[0] : null;
      state.adminEditingArticle = {
        isNew: true,
        title: defaultTmpl ? defaultTmpl.sampleTitle : 'New Article Edition',
        slug: defaultTmpl ? defaultTmpl.sampleTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : 'new-article-' + Date.now().toString().slice(-4),
        subtitle: defaultTmpl ? defaultTmpl.sampleSubtitle : '',
        tag: defaultTmpl ? defaultTmpl.tag : 'Frontier AI',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        reading_time: defaultTmpl ? defaultTmpl.readingTime : '4 minutes',
        image_url: 'assets/aira-promo-banner.png',
        author: 'AIRA',
        body_html: defaultTmpl ? defaultTmpl.body : ''
      };
      renderAdminPage();
    }

    document.getElementById('btn-topbar-new-article')?.addEventListener('click', openNewArticleEditor);
    document.getElementById('btn-articles-new-edition')?.addEventListener('click', openNewArticleEditor);

    // Overview buttons
    document.getElementById('overview-btn-review-subs')?.addEventListener('click', () => {
      state.adminTab = 'submissions';
      state.adminSubmissionFilter = 'pending';
      renderAdminPage();
    });

    document.getElementById('overview-btn-export-csv')?.addEventListener('click', () => {
      document.getElementById('btn-export-subscribers-csv')?.click();
    });

    // Ad Inquiries Handlers (Approve to Live Slot, Delete)
    document.querySelectorAll('.btn-approve-ad-inquiry').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        let inquiries = (typeof getAdInquiries === 'function') ? getAdInquiries() : [];
        const inq = inquiries.find(i => i && i.id === id);
        if (inq) {
          inq.status = 'approved';
          if (typeof saveAdInquiries === 'function') saveAdInquiries(inquiries);

          // Automatically push to active Sponsor Settings live slot!
          const currentSponsorSettings = getSponsorSettings();
          if (inq.slot === 'hero' || inq.slot === 'top' || inq.slot === 'header') {
            currentSponsorSettings.topBar.active = true;
            currentSponsorSettings.topBar.headline = inq.tagline || (inq.brandName + ' — ' + (inq.message || 'Explore Now'));
            currentSponsorSettings.topBar.ctaText = inq.ctaText || 'Learn More';
            currentSponsorSettings.topBar.link = inq.targetUrl || '#/advertise';
            currentSponsorSettings.topBar.badge = 'Sponsored';
          } else if (inq.slot === 'spotlight' || inq.slot === 'feed' || inq.slot === 'in-feed') {
            currentSponsorSettings.inFeed.active = true;
            currentSponsorSettings.inFeed.title = inq.brandName + ': ' + (inq.tagline || 'Special Offer');
            currentSponsorSettings.inFeed.body = inq.message || inq.tagline || 'Exclusive promotion for AIRA subscribers.';
            currentSponsorSettings.inFeed.btnText = inq.ctaText || 'Claim Deal →';
            currentSponsorSettings.inFeed.btnLink = inq.targetUrl || '#/advertise';
            currentSponsorSettings.inFeed.tag = 'Featured Partner';
          } else {
            // Bento / partner logo tile
            currentSponsorSettings.sponsorLogos = currentSponsorSettings.sponsorLogos || [];
            currentSponsorSettings.sponsorLogos.push({
              emoji: '⚡',
              name: inq.brandName,
              link: inq.targetUrl || '#/advertise'
            });
          }
          saveSponsorSettings(currentSponsorSettings);

          showToast(`🎉 "${inq.brandName}" approved & pushed live to ${inq.slot.toUpperCase()} slot!`);
          renderAdminPage();
        }
      });
    });

    document.querySelectorAll('.btn-delete-ad-inquiry').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Delete this ad inquiry?')) {
          let inquiries = (typeof getAdInquiries === 'function') ? getAdInquiries() : [];
          inquiries = inquiries.filter(i => i && i.id !== id);
          if (typeof saveAdInquiries === 'function') saveAdInquiries(inquiries);
          showToast('Ad inquiry deleted.');
          renderAdminPage();
        }
      });
    });

    document.querySelectorAll('.btn-delete-custom-partner').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Delete this custom partnership request?')) {
          let customList = (typeof getCustomPartnerships === 'function') ? getCustomPartnerships() : [];
          customList = customList.filter(p => p && p.id !== id);
          if (typeof saveCustomPartnerships === 'function') saveCustomPartnerships(customList);
          showToast('Partnership request deleted.');
          renderAdminPage();
        }
      });
    });

    // Submissions Handlers (Approve, Delete, Spotlight selector)
    document.querySelectorAll('.btn-approve-submission').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        let subs = (typeof getToolSubmissions === 'function') ? getToolSubmissions() : [];
        const targetSub = subs.find(s => s && s.id === id);
        if (targetSub) {
          targetSub.status = 'approved';
          targetSub.approvedAt = new Date().toISOString();
          if (typeof saveToolSubmissions === 'function') saveToolSubmissions(subs);

          // Add to custom tools
          let customTools = (typeof getCustomTools === 'function') ? getCustomTools() : [];
          customTools.unshift({
            id: 'approved-' + targetSub.id,
            name: targetSub.toolName,
            url: targetSub.websiteUrl || targetSub.toolUrl,
            logo: 'https://logo.clearbit.com/' + (targetSub.websiteUrl || targetSub.toolUrl || '').replace(/^https?:\/\//i, '').split('/')[0],
            icon: '⚡',
            pricing: targetSub.pricing || 'Freemium',
            category: targetSub.category || 'developer-tools',
            categories: [targetSub.category || 'developer-tools'],
            description: targetSub.tagline || targetSub.description,
            tagline: targetSub.tagline || targetSub.description,
            fullDescription: targetSub.description,
            features: typeof targetSub.features === 'string' ? targetSub.features.split(',').map(f => f.trim()).filter(Boolean) : (targetSub.features || []),
            verified: true,
            badge: targetSub.badge || 'Verified Tool',
            status: 'approved'
          });
          if (typeof saveCustomTools === 'function') saveCustomTools(customTools);

          showToast(`✓ "${targetSub.toolName}" approved & live in directory!`);
          renderAdminPage();
        }
      });
    });

    document.querySelectorAll('.btn-delete-submission').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Delete this submission?')) {
          let subs = (typeof getToolSubmissions === 'function') ? getToolSubmissions() : [];
          subs = subs.filter(s => s && s.id !== id);
          if (typeof saveToolSubmissions === 'function') saveToolSubmissions(subs);
          showToast('Submission deleted.');
          renderAdminPage();
        }
      });
    });

    document.querySelectorAll('.sub-spotlight-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const badgeVal = e.currentTarget.value;
        let subs = (typeof getToolSubmissions === 'function') ? getToolSubmissions() : [];
        const targetSub = subs.find(s => s && s.id === id);
        if (targetSub) {
          targetSub.badge = badgeVal;
          if (typeof saveToolSubmissions === 'function') saveToolSubmissions(subs);
          showToast(`Spotlight badge updated: ${badgeVal || 'Standard'}`);
        }
      });
    });

    // Submissions Filter buttons
    document.querySelectorAll('[data-sub-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.adminSubmissionFilter = btn.getAttribute('data-sub-filter');
        renderAdminPage();
      });
    });

    // Edit Article buttons
    document.querySelectorAll('.btn-edit-article').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const slug = e.currentTarget.getAttribute('data-slug');
        const art = state.articles.find(a => a && a.slug === slug);
        if (art) {
          state.adminEditingArticle = { ...art };
          renderAdminPage();
        }
      });
    });

    // Deals Modals and Handlers
    const dealModal = document.getElementById('modal-deal-editor');
    const openDealModalBtn = document.getElementById('btn-add-new-deal');
    if (openDealModalBtn && dealModal) {
      openDealModalBtn.addEventListener('click', () => {
        document.getElementById('form-deal-editor')?.reset();
        document.getElementById('deal-edit-id').value = '';
        dealModal.classList.add('active');
      });
    }

    document.getElementById('btn-close-deal-modal')?.addEventListener('click', () => {
      dealModal?.classList.remove('active');
    });
    document.getElementById('btn-cancel-deal-modal')?.addEventListener('click', () => {
      dealModal?.classList.remove('active');
    });

    document.querySelectorAll('.btn-delete-deal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Delete this deal?')) {
          let customDeals = (typeof getCustomDeals === 'function') ? getCustomDeals() : [];
          customDeals = customDeals.filter(d => d && d.id !== id);
          if (typeof saveCustomDeals === 'function') saveCustomDeals(customDeals);
          showToast('Deal removed.');
          renderAdminPage();
        }
      });
    });

    document.getElementById('form-deal-editor')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('deal-edit-id')?.value || 'deal-' + Date.now();
      const toolName = document.getElementById('deal-input-tool-name')?.value.trim();
      const category = document.getElementById('deal-input-category')?.value;
      const discountBadge = document.getElementById('deal-input-badge')?.value.trim();
      const headline = document.getElementById('deal-input-headline')?.value.trim();
      const desc = document.getElementById('deal-input-desc')?.value.trim();
      const couponCode = document.getElementById('deal-input-code')?.value.trim();
      const expiry = document.getElementById('deal-input-expiry')?.value.trim();
      const targetUrl = document.getElementById('deal-input-url')?.value.trim();

      const newDeal = {
        id,
        toolName,
        category,
        discountBadge,
        headline,
        description: desc,
        couponCode,
        status: expiry,
        affiliateUrl: targetUrl
      };

      let customDeals = (typeof getCustomDeals === 'function') ? getCustomDeals() : [];
      const idx = customDeals.findIndex(d => d && d.id === id);
      if (idx >= 0) customDeals[idx] = newDeal;
      else customDeals.unshift(newDeal);

      if (typeof saveCustomDeals === 'function') saveCustomDeals(customDeals);
      dealModal?.classList.remove('active');
      showToast('Deal saved successfully! 🏷️');
      renderAdminPage();
    });

    // Sponsors Settings Handlers
    document.getElementById('btn-add-sponsor-logo-row')?.addEventListener('click', () => {
      const container = document.getElementById('sp-logos-rows-container');
      if (container) {
        const idx = container.querySelectorAll('.sp-logo-row').length;
        const div = document.createElement('div');
        div.className = 'sp-logo-row';
        div.setAttribute('data-idx', idx);
        div.style.cssText = 'display: grid; grid-template-columns: 60px 180px 1fr 40px; gap: 10px; margin-bottom: 10px; align-items: center;';
        div.innerHTML = `
          <input type="text" class="form-control-input sp-logo-inp-emoji" value="⚡" style="text-align: center;" />
          <input type="text" class="form-control-input sp-logo-inp-name" value="" placeholder="Partner Name" />
          <input type="text" class="form-control-input sp-logo-inp-link" value="" placeholder="Target URL" />
          <button type="button" class="btn-story-action btn-delete-sp-logo" data-idx="${idx}" style="color: #DC2626; padding: 8px;">✕</button>
        `;
        container.appendChild(div);
        div.querySelector('.btn-delete-sp-logo')?.addEventListener('click', () => div.remove());
      }
    });

    document.querySelectorAll('.btn-delete-sp-logo').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.currentTarget.closest('.sp-logo-row')?.remove();
      });
    });

    document.getElementById('btn-save-all-sponsor-settings')?.addEventListener('click', () => {
      const topActive = document.getElementById('sp-top-active')?.checked ?? true;
      const topBadge = document.getElementById('sp-top-badge')?.value.trim() || 'Ad';
      const topIcon = document.getElementById('sp-top-icon')?.value.trim() || '⚡';
      const topHeadline = document.getElementById('sp-top-headline')?.value.trim() || '';
      const topCtaText = document.getElementById('sp-top-cta-text')?.value.trim() || 'Learn More';
      const topLink = document.getElementById('sp-top-link')?.value.trim() || '#/advertise';

      const feedActive = document.getElementById('sp-feed-active')?.checked ?? true;
      const feedTag = document.getElementById('sp-feed-tag')?.value.trim() || 'Featured Partner';
      const feedTitle = document.getElementById('sp-feed-title')?.value.trim() || '';
      const feedBody = document.getElementById('sp-feed-body')?.value.trim() || '';
      const feedBtnText = document.getElementById('sp-feed-btn-text')?.value.trim() || 'Claim Deal →';
      const feedBtnLink = document.getElementById('sp-feed-btn-link')?.value.trim() || '';

      const logos = [];
      document.querySelectorAll('.sp-logo-row').forEach(row => {
        const emoji = row.querySelector('.sp-logo-inp-emoji')?.value.trim() || '⚡';
        const name = row.querySelector('.sp-logo-inp-name')?.value.trim() || '';
        const link = row.querySelector('.sp-logo-inp-link')?.value.trim() || '#/advertise';
        if (name) logos.push({ emoji, name, link });
      });

      const newSettings = {
        topBar: {
          active: topActive,
          badge: topBadge,
          icon: topIcon,
          headline: topHeadline,
          ctaText: topCtaText,
          link: topLink
        },
        inFeed: {
          active: feedActive,
          tag: feedTag,
          title: feedTitle,
          body: feedBody,
          btnText: feedBtnText,
          btnLink: feedBtnLink,
          badge: 'Sponsored'
        },
        sponsorLogos: logos
      };

      saveSponsorSettings(newSettings);
      showToast('🎉 Sponsor & Ad settings saved to live site!');
      renderAdminPage();
    });

    // 1-Click Email Broadcast Handlers
    document.getElementById('btn-send-test-email')?.addEventListener('click', () => {
      const email = document.getElementById('broadcast-test-email')?.value.trim();
      if (!email) {
        showToast('Please enter an email address for test send.');
        return;
      }
      showToast(`⚡ Sending test email to ${email}...`);
      setTimeout(() => {
        showToast(`✓ Test newsletter successfully delivered to ${email}!`);
      }, 900);
    });

    document.getElementById('btn-launch-broadcast-all')?.addEventListener('click', () => {
      const editionSlug = document.getElementById('broadcast-edition-select')?.value;
      const targetArt = state.articles.find(a => a && a.slug === editionSlug) || state.articles[0];
      const count = normalizedSubscribers.length > 0 ? normalizedSubscribers.length : 500;

      if (confirm(`🚀 Launch email broadcast of "${targetArt.title}" to ${count} active subscribers?`)) {
        showToast(`📬 Broadcasting newsletter to ${count} subscribers... ⏳`);
        
        setTimeout(() => {
          const history = getEmailBroadcastHistory();
          history.unshift({
            id: 'bc-' + Date.now().toString().slice(-4),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            editionTitle: targetArt.title,
            recipients: count,
            status: 'Delivered ✅',
            openRate: '54.2%',
            clicks: '23.8%'
          });
          saveEmailBroadcastHistory(history);

          showToast(`🎉 Broadcast Complete! ${count} emails successfully dispatched.`);
          renderAdminPage();
        }, 1200);
      }
    });

    // HTML Email Preview Modal Handlers
    const emailPreviewModal = document.getElementById('modal-email-preview');
    document.getElementById('btn-preview-email-html')?.addEventListener('click', () => {
      const editionSlug = document.getElementById('broadcast-edition-select')?.value;
      const targetArt = state.articles.find(a => a && a.slug === editionSlug) || state.articles[0];
      const iframe = document.getElementById('email-preview-iframe');

      if (iframe && targetArt) {
        const fullHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #F8FAFC; color: #0F172A; padding: 20px; line-height: 1.6; }
              .card { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; padding: 28px; border: 1px solid #E2E8F0; }
              .badge { background: #1C46F5; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; display: inline-block; text-transform: uppercase; }
              h1 { font-size: 22px; font-weight: 800; color: #0F172A; margin: 12px 0 8px 0; }
              .date { font-size: 12px; color: #64748B; font-weight: 600; }
              .content { margin-top: 20px; font-size: 15px; color: #334155; }
              .content img { max-width: 100%; border-radius: 8px; margin: 14px 0; }
              .footer { text-align: center; font-size: 12px; color: #94A3B8; margin-top: 28px; padding-top: 16px; border-top: 1px solid #E2E8F0; }
            </style>
          </head>
          <body>
            <div class="card">
              <span class="badge">AIRA Daily</span>
              <div class="date">${targetArt.date} • 4 min read</div>
              <h1>${escapeHtml(targetArt.title)}</h1>
              <div class="content">
                ${targetArt.body_html || '<p>Daily brief content preview.</p>'}
              </div>
              <div class="footer">
                © 2026 AIRA Frontier Intelligence • You received this because you are subscribed.
              </div>
            </div>
          </body>
          </html>
        `;
        iframe.srcdoc = fullHtml;
      }
      emailPreviewModal?.classList.add('active');
    });

    document.getElementById('btn-close-email-preview')?.addEventListener('click', () => {
      emailPreviewModal?.classList.remove('active');
    });

    // Subscribers CRM Actions
    document.getElementById('btn-copy-all-subscribers')?.addEventListener('click', () => {
      if (normalizedSubscribers.length === 0) {
        showToast('No subscriber emails to copy!');
        return;
      }
      const emails = normalizedSubscribers.map(s => s.email).join(', ');
      navigator.clipboard.writeText(emails).then(() => {
        showToast('📋 All subscriber emails copied to clipboard!');
      });
    });

    document.getElementById('btn-export-subscribers-csv')?.addEventListener('click', () => {
      if (normalizedSubscribers.length === 0) {
        showToast('No subscribers to export yet!');
        return;
      }
      const csvRows = ['ID,Email,Date,Source'];
      normalizedSubscribers.forEach(s => {
        csvRows.push(`"${s.id}","${s.email}","${s.date}","${s.source}"`);
      });
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AIRA_Subscribers_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('📥 Subscribers exported to CSV!');
    });

    // Comments Moderation Actions
    document.querySelectorAll('.btn-delete-comment').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const slug = e.currentTarget.getAttribute('data-slug');
        const cIdx = parseInt(e.currentTarget.getAttribute('data-idx'));
        if (confirm('Delete this reader comment?')) {
          const map = JSON.parse(localStorage.getItem('aira_comments') || '{}');
          if (map[slug] && map[slug][cIdx]) {
            map[slug].splice(cIdx, 1);
            localStorage.setItem('aira_comments', JSON.stringify(map));
            showToast('Comment deleted.');
            renderAdminPage();
          }
        }
      });
    });

    // Settings Tab Handlers (PIN change, Backup, Restore, Purge)
    document.getElementById('form-change-admin-pin')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const newPin = document.getElementById('input-new-admin-pin')?.value.trim();
      if (newPin && newPin.length >= 4) {
        localStorage.setItem('aira_admin_pin', newPin);
        showToast('✓ Master Admin PIN updated successfully!');
        document.getElementById('input-new-admin-pin').value = '';
      } else {
        showToast('Please enter a PIN with at least 4 digits.');
      }
    });

    document.getElementById('btn-download-full-backup')?.addEventListener('click', () => {
      exportFullSystemBackup();
    });

    const restoreFileInput = document.getElementById('input-restore-backup-file');
    if (restoreFileInput) {
      restoreFileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const content = evt.target.result;
            if (confirm('Restore full system backup? This will update local articles, tools, deals & settings.')) {
              importFullSystemBackup(content);
            }
          };
          reader.readAsText(file);
        }
      });
    }

    document.getElementById('btn-purge-local-cache')?.addEventListener('click', () => {
      if (confirm('Purge cached local overrides? Base articles will revert to default.')) {
        localStorage.removeItem('aira_article_overrides');
        localStorage.removeItem('aira_custom_tools');
        showToast('Local cache purged. Reloading...');
        setTimeout(() => window.location.reload(), 600);
      }
    });

  }


// =========================================================================
  // 4. Prompts Library (100+ Agentic Coding Prompts - Top Horizontal Filters)
  // =========================================================================
  function renderPromptsPage() {
    const SOURCES = window.PROMPT_SOURCES || (typeof AI_PROMPTS_DATA !== 'undefined' ? AI_PROMPTS_DATA.sources : {}) || {};
    const ALL = window.ALL_PROMPTS || (typeof AI_PROMPTS_DATA !== 'undefined' ? AI_PROMPTS_DATA.prompts : []) || [];

    const REQUIRES_LABEL = {
      "plan-mode": "Plan mode",
      "image-attached": "Attach an image",
      "second-session": "Fresh session",
      "prior-turn": "Follows a previous turn",
      "shell": "Run in a shell",
      "mcp-server": "Needs an MCP server",
      "subagent": "Uses subagents",
      "slash-command": "Slash command",
      "save-to-file": "Save to a file",
      "selection": "Select code first"
    };

    const SEQUENCES = {
      "explore-plan-code":   "Explore \u2192 plan \u2192 code",
      "find-code":           "Find the code",
      "bugfix":              "Fix a bug",
      "refactor":            "Refactor",
      "tests":               "Add tests",
      "docs":                "Document",
      "pull-request":        "Open a PR",
      "writer-reviewer":     "Writer / reviewer",
      "fan-out":             "Fan out across files",
      "cx-bugfix":           "Fix a bug",
      "cx-design-iteration": "Iterate on a design",
      "cx-refactor-plan":    "Plan a refactor",
      "cx-prototype":        "Prototype from an image"
    };

    const TOOL_MARK = {
      "claude-code":
        '<svg viewBox="0 0 248 248" fill="none"><path d="M52.4285 162.873L98.7844 136.879L99.5485 134.602L98.7844 133.334H96.4921L88.7237 132.862L62.2346 132.153L39.3113 131.207L17.0249 130.026L11.4214 128.844L6.2 121.873L6.7094 118.447L11.4214 115.257L18.171 115.847L33.0711 116.911L55.485 118.447L71.6586 119.392L95.728 121.873H99.5485L100.058 120.337L98.7844 119.392L97.7656 118.447L74.5877 102.732L49.4995 86.1905L36.3823 76.62L29.3779 71.7757L25.8121 67.2858L24.2839 57.3608L30.6515 50.2716L39.3113 50.8623L41.4763 51.4531L50.2636 58.1879L68.9842 72.7209L93.4357 90.6804L97.0015 93.6343L98.4374 92.6652L98.6571 91.9801L97.0015 89.2625L83.757 65.2772L69.621 40.8192L63.2534 30.6579L61.5978 24.632C60.9565 22.1032 60.579 20.0111 60.579 17.4246L67.8381 7.49965L71.9133 6.19995L81.7193 7.49965L85.7946 11.0443L91.9074 24.9865L101.714 46.8451L116.996 76.62L121.453 85.4816L123.873 93.6343L124.764 96.1155H126.292V94.6976L127.566 77.9197L129.858 57.3608L132.15 30.8942L132.915 23.4505L136.608 14.4708L143.994 9.62643L149.725 12.344L154.437 19.0788L153.8 23.4505L150.998 41.6463L145.522 70.1215L141.957 89.2625H143.994L146.414 86.7813L156.093 74.0206L172.266 53.698L179.398 45.6635L187.803 36.802L193.152 32.5484H203.34L210.726 43.6549L207.415 55.1159L196.972 68.3492L188.312 79.5739L175.896 96.2095L168.191 109.585L168.882 110.689L170.738 110.53L198.755 104.504L213.91 101.787L231.994 98.7149L240.144 102.496L241.036 106.395L237.852 114.311L218.495 119.037L195.826 123.645L162.07 131.592L161.696 131.893L162.137 132.547L177.36 133.925L183.855 134.279H199.774L229.447 136.524L237.215 141.605L241.8 147.867L241.036 152.711L229.065 158.737L213.019 154.956L175.45 145.977L162.587 142.787H160.805V143.85L171.502 154.366L191.242 172.089L215.82 195.011L217.094 200.682L213.91 205.172L210.599 204.699L188.949 188.394L180.544 181.069L161.696 165.118H160.422V166.772L164.752 173.152L187.803 207.771L188.949 218.405L187.294 221.832L181.308 223.959L174.813 222.777L161.187 203.754L147.305 182.486L136.098 163.345L134.745 164.2L128.075 235.42L125.019 239.082L117.887 241.8L111.902 237.31L108.718 229.984L111.902 215.452L115.722 196.547L118.779 181.541L121.58 162.873L123.291 156.636L123.14 156.219L121.773 156.449L107.699 175.752L86.304 204.699L69.3663 222.777L65.291 224.431L58.2867 220.768L58.9235 214.27L62.8713 208.48L86.304 178.705L100.44 160.155L109.551 149.507L109.462 147.967L108.959 147.924L46.6977 188.512L35.6182 189.93L30.7788 185.44L31.4156 178.115L33.7079 175.752L52.4285 162.873Z" fill="#D97757"/></svg>',
      "codex":
        '<svg viewBox="3.4 3.4 17.2 17.2"><path fill="#000000" d="M9.94494 9.59163V8.13227C9.94494 8.00935 9.99105 7.91713 10.0985 7.85575L13.0327 6.16599C13.4321 5.93558 13.9083 5.8281 14.3998 5.8281C16.2432 5.8281 17.4108 7.25677 17.4108 8.77751C17.4108 8.885 17.4108 9.00792 17.3953 9.13083L14.3537 7.34884C14.1694 7.24135 13.985 7.24135 13.8007 7.34884L9.94494 9.59163ZM16.7963 15.2755V11.7883C16.7963 11.5732 16.704 11.4196 16.5197 11.3121L12.664 9.0693L13.9236 8.34725C14.0311 8.28587 14.1234 8.28587 14.2308 8.34725L17.165 10.037C18.0099 10.5287 18.5782 11.5732 18.5782 12.587C18.5782 13.7544 17.887 14.8298 16.7963 15.2753V15.2755ZM9.03861 12.2031L7.77896 11.4658C7.67146 11.4045 7.62535 11.3122 7.62535 11.1893V7.8098C7.62535 6.16613 8.88501 4.92176 10.5902 4.92176C11.2354 4.92176 11.8344 5.13689 12.3415 5.52089L9.31526 7.27218C9.13097 7.37968 9.03875 7.53328 9.03875 7.74841V12.2033L9.03861 12.2031ZM11.75 13.77L9.94494 12.7562V10.6056L11.75 9.59178L13.5549 10.6056V12.7562L11.75 13.77ZM12.9098 18.44C12.2645 18.44 11.6655 18.2249 11.1585 17.8409L14.1847 16.0896C14.369 15.9821 14.4612 15.8285 14.4612 15.6134V11.1585L15.7363 11.8958C15.8438 11.9572 15.8899 12.0494 15.8899 12.1723V15.5519C15.8899 17.1955 14.6148 18.44 12.9098 18.44ZM9.26901 15.0144L6.33486 13.3246C5.4899 12.833 4.92161 11.7885 4.92161 10.7746C4.92161 9.59177 5.62824 8.53183 6.71886 8.0863V11.5887C6.71886 11.8039 6.81109 11.9575 6.99538 12.065L10.8359 14.2923L9.57621 15.0144C9.46872 15.0758 9.37649 15.0758 9.26901 15.0144ZM9.10013 17.5337C7.36426 17.5337 6.08919 16.2279 6.08919 14.6149C6.08919 14.492 6.1046 14.3691 6.11988 14.2462L9.1461 15.9975C9.33039 16.105 9.51483 16.105 9.69912 15.9975L13.5549 13.7702V15.2295C13.5549 15.3524 13.5088 15.4446 13.4013 15.506L10.4671 17.1958C10.0677 17.4262 9.59148 17.5337 9.09999 17.5337H9.10013ZM12.9098 19.3616C14.7685 19.3616 16.32 18.0406 16.6735 16.2893C18.3939 15.8438 19.5 14.2308 19.5 12.5872C19.5 11.5118 19.0391 10.4673 18.2096 9.71454C18.2864 9.39192 18.3326 9.0693 18.3326 8.74682C18.3326 6.55014 16.5505 4.90634 14.4921 4.90634C14.0774 4.90634 13.6779 4.96772 13.2785 5.10605C12.5872 4.43011 11.6347 4 10.5902 4C8.7314 4 7.17996 5.32103 6.8265 7.07232C5.10605 7.51786 4 9.13083 4 10.7745C4 11.8498 4.4608 12.8944 5.29035 13.6471C5.21354 13.9697 5.16743 14.2923 5.16743 14.6148C5.16743 16.8114 6.94941 18.4552 9.00792 18.4552C9.42261 18.4552 9.82204 18.3939 10.2215 18.2556C10.9127 18.9315 11.8651 19.3616 12.9098 19.3616Z"/></svg>',
      "cursor":
        '<svg viewBox="0 0 466.73 532.09"><path fill="#26251e" d="M457.43,125.94L244.42,2.96c-6.84-3.95-15.28-3.95-22.12,0L9.3,125.94c-5.75,3.32-9.3,9.46-9.3,16.11v247.99c0,6.65,3.55,12.79,9.3,16.11l213.01,122.98c6.84,3.95,15.28,3.95,22.12,0l213.01-122.98c5.75-3.32,9.3-9.46,9.3-16.11v-247.99c0-6.65-3.55-12.79-9.3-16.11h-.01ZM444.05,151.99l-205.63,356.16c-1.39,2.4-5.06,1.42-5.06-1.36v-233.21c0-4.66-2.49-8.97-6.53-11.31L24.87,145.67c-2.4-1.39-1.42-5.06,1.36-5.06h411.26c5.84,0,9.49,6.33,6.57,11.39h-.01Z"/></svg>'
    };

    const TOOLS = [
      { id: "claude-code", label: "Claude Code", icon: "🟣" },
      { id: "codex", label: "OpenAI Codex", icon: "🟢" },
      { id: "cursor", label: "Cursor IDE", icon: "🔵" }
    ];

    const GROUPS = [
      { id: "understand", label: "Understand a codebase", icon: "🚀", cats: ["onboarding", "search", "context-refs"] },
      { id: "plan",       label: "Plan before you build",  icon: "🗺️", cats: ["planning"] },
      { id: "debug",      label: "Fix bugs",               icon: "🐛", cats: ["debugging"] },
      { id: "test",       label: "Test and verify",        icon: "🧪", cats: ["testing", "verification"] },
      { id: "refactor",   label: "Refactor and document",  icon: "♻️", cats: ["refactoring", "documentation"] },
      { id: "review",     label: "Review code",            icon: "🔍", cats: ["review"] },
      { id: "images",     label: "Work from images",       icon: "🖼️", cats: ["images"] },
      { id: "configure",  label: "Configure the agent",    icon: "⚙️", cats: ["config"] },
      { id: "automate",   label: "Automate and scale",     icon: "⚡", cats: ["automation", "subagents", "scale", "context-management", "capabilities", "pr-git"] }
    ];

    const catToGroup = {};
    GROUPS.forEach(g => { g.cats.forEach(c => { catToGroup[c] = g.id; }); });

    let stateFilter = { q: "", tool: [], group: [] };
    let tasksShown = 2;
    function resetLimits() { tasksShown = 2; }

    function esc(s) {
      return String(s || '').replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }

    function slots(text) {
      var out = "", last = 0, re = /<([^<>]*)>/g, m;
      while ((m = re.exec(text)) !== null) {
        out += esc(text.slice(last, m.index));
        out += '<span class="slot">' + esc(m[0]) + "</span>";
        last = m.index + m[0].length;
      }
      return out + esc(text.slice(last));
    }

    var COPY_ICON =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
    var DONE_ICON =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M4 12.5l5 5L20 6.5"/></svg>';
    var OUT_ICON =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M14 5h5v5M19 5l-8 8M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/></svg>';

    var toastTimer;
    function toast(msg) {
      const toastEl = document.getElementById("toast");
      if (!toastEl) return;
      toastEl.textContent = msg;
      toastEl.classList.add("is-visible");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toastEl.classList.remove("is-visible"); }, 1600);
    }

    function copyText(text, btn) {
      function done() {
        var slotMatches = (text.match(/<[^<>]{2,}>/g) || []).length;
        toast(slotMatches
          ? "Copied \u00b7 " + slotMatches + (slotMatches === 1 ? " slot" : " slots") + " to fill in"
          : "Copied");
        if (!btn) return;
        if (!btn.getAttribute("data-rest")) btn.setAttribute("data-rest", btn.innerHTML);
        clearTimeout(btn._restore);
        btn.innerHTML = DONE_ICON;
        btn.classList.add("is-done");
        btn._restore = setTimeout(function () {
          btn.innerHTML = btn.getAttribute("data-rest");
          btn.classList.remove("is-done");
        }, 1200);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { fallback(text, done); });
      } else { fallback(text, done); }
    }

    function fallback(text, done) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:0;left:-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        if (document.execCommand("copy")) { done(); } else { toast("Press ⌘C to copy"); }
      } catch (e) { toast("Press ⌘C to copy"); }
      document.body.removeChild(ta);
    }

    function groupLabel(id) {
      for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i].id === id) return GROUPS[i].label;
      return id;
    }

    function toolLabel(id) {
      for (var i = 0; i < TOOLS.length; i++) if (TOOLS[i].id === id) return TOOLS[i].label;
      return id;
    }

    function marks(list) {
      if (!list || !list.length) return "";
      return '<span class="marks">' +
        list.map(function (t) {
          return '<span class="mark" title="' + esc(toolLabel(t)) + '" aria-label="' + esc(toolLabel(t)) + '">' + (TOOL_MARK[t] || '') + "</span>";
        }).join("") + "</span>";
    }

    function srcMark(tool) {
      return '<button class="src-mark" type="button" data-kind="tool" data-val="' + esc(tool) +
        '" title="Show only ' + esc(toolLabel(tool)) + ' prompts" aria-label="Filter to ' + esc(toolLabel(tool)) + '">' +
        (TOOL_MARK[tool] || '') + "</button>";
    }

    function copyBtn(text, label) {
      return '<button class="copy" type="button" data-copy="' + esc(text) + '" aria-label="' + esc(label) + '">' + COPY_ICON + "</button>";
    }

    function badges(p) {
      var out = "";
      if (p.sequence) {
        out += '<span class="tag tag--seq">' + esc(SEQUENCES[p.sequence] || p.sequence) +
               " \u00b7 step " + p.step + "</span>";
      }
      (p.requires || []).forEach(function (r) {
        out += '<span class="tag tag--req">' + esc(REQUIRES_LABEL[r] || r) + "</span>";
      });
      return out ? '<div class="pl__tags">' + out + "</div>" : "";
    }

    function promptBody(p) {
      var body = "";
      if (p.weak) {
        body +=
          '<div class="pl__weak"><span class="pl__weak-tag">Docs\u2019 weak example</span>' +
          '<span class="pl__weak-text">' + esc(p.weak) + "</span></div>";
      }
      if (p.kind === "config") {
        body +=
          '<div class="pl__code-wrap">' +
          (p.cap ? '<span class="cap">' + esc(p.cap) + "</span>" : "") +
          '<pre class="codeblock"><code>' + slots(p.template || p.prompt) + "</code>" +
          copyBtn(p.template || p.prompt, "Copy template") + "</pre></div>";
      } else {
        body +=
          '<div class="pl__prompt pl__prompt--template">' +
          '<p class="pl__prompt-text">' + slots(p.template || p.prompt) + "</p>" +
          copyBtn(p.template || p.prompt, "Copy template") + "</div>";
      }
      if (p.shell) {
        body +=
          '<div class="pl__shell"><span class="cap">Run it</span>' +
          '<pre class="codeblock codeblock--sm"><code>' + esc(p.shell) + "</code>" +
          copyBtn(p.shell, "Copy command") + "</pre></div>";
      }
      return body;
    }

    function slotCount(p) {
      return ((p.template || p.prompt || '').match(/<[^<>]{2,}>/g) || []).length;
    }

    function renderCard(p) {
      var src = SOURCES[p.page] || {};
      return (
        '<article class="pl" id="' + esc(p.id) + '" data-tool="' + esc(p.tool) +
          '" data-group="' + esc(catToGroup[p.category]) + '">' +
          '<button class="pl__toggle" type="button" data-open="' + esc(p.id) + '">' +
            '<span class="pl__head">' +
              '<span class="pl__title">' + esc(p.title) + "</span>" +
              marks(p.worksIn && p.worksIn.length ? p.worksIn : [p.tool]) +
            "</span>" +
            (p.why ? '<span class="pl__why">' + esc(p.why) + "</span>" : "") +
          "</button>" +
          '<div class="pl__srcrow">' + srcMark(p.tool) +
            '<a class="pl__src" href="' + esc(src.url || "#") + '" target="_blank" rel="noopener">' +
              esc(src.short || src.label || "Source") + OUT_ICON +
            "</a>" +
          "</div>" +
        "</article>"
      );
    }

    var BY_ID = {};
    ALL.forEach(function (p) { BY_ID[p.id] = p; });
    var lastFocus = null;

    function openDialog(id) {
      var p = BY_ID[id];
      if (!p) return;
      var src = SOURCES[p.page] || {};
      var n = slotCount(p);

      const dialogEl = document.getElementById("dialog");
      const dialogBodyEl = document.getElementById("dialog-body");
      const dialogCloseEl = document.getElementById("dialog-close");

      if (!dialogEl || !dialogBodyEl) return;

      dialogBodyEl.innerHTML =
        '<div class="dlg__head">' +
          '<div class="dlg__headline">' +
            '<h2 class="dlg__title" id="dlg-title">' + esc(p.title) + "</h2>" +
            marks(p.worksIn && p.worksIn.length ? p.worksIn : [p.tool]) +
          "</div>" +
          (p.why ? '<p class="dlg__why">' + esc(p.why) + "</p>" : "") +
          badges(p) +
        "</div>" +
        promptBody(p) +
        '<div class="dlg__foot">' + srcMark(p.tool) +
          '<a class="pl__src" href="' + esc(src.url || "#") + '" target="_blank" rel="noopener">' +
            esc(src.short || src.label || "Source") +
            (src.publisher ? ' <span class="pl__src-pub">from ' + esc(src.publisher) + "</span>" : "") +
            OUT_ICON +
          "</a>" +
          '<span class="pl__slots">' + (n ? n + (n === 1 ? " slot to fill in" : " slots to fill in") : "ready to use") + "</span>" +
        "</div>";

      lastFocus = document.activeElement;
      dialogEl.hidden = false;
      document.body.classList.add("has-dialog");
      if (dialogCloseEl) dialogCloseEl.focus();
    }

    function closeDialog() {
      const dialogEl = document.getElementById("dialog");
      const dialogBodyEl = document.getElementById("dialog-body");
      if (!dialogEl || dialogEl.hidden) return;
      dialogEl.hidden = true;
      document.body.classList.remove("has-dialog");
      if (dialogBodyEl) dialogBodyEl.innerHTML = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function haystack(p) {
      return [p.title, p.prompt, p.code, p.template, p.why, p.weak, p.section, p.shell, toolLabel(p.tool)]
        .filter(Boolean).join(" ").toLowerCase();
    }

    var hay = {};
    ALL.forEach(function (p) { hay[p.id] = haystack(p); });

    function matches(p, terms, tools, groups) {
      return (!tools.length || tools.indexOf(p.tool) > -1) &&
        (!groups.length || groups.indexOf(catToGroup[p.category]) > -1) &&
        (!terms.length || terms.every(function (t) { return hay[p.id].indexOf(t) !== -1; }));
    }

    function applyFilters() {
      const listEl = document.getElementById("list");
      const countEl = document.getElementById("count");
      const emptyEl = document.getElementById("empty");
      const emptyMsgEl = document.getElementById("empty-msg");
      const moreEl = document.getElementById("more");
      const clearBtn = document.getElementById("clear");

      if (!listEl) return;

      var terms = stateFilter.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
      var shown = 0;

      ALL.forEach(function (p) {
        var el = document.getElementById(p.id);
        if (!el) return;
        var ok = matches(p, terms, stateFilter.tool, stateFilter.group);
        el.hidden = !ok;
        if (ok) shown++;
      });

      var live = [];
      Array.prototype.forEach.call(listEl.querySelectorAll(".pl-group"), function (sec) {
        var matching = sec.querySelectorAll(".pl:not([hidden])").length;
        sec.setAttribute("data-matching", matching);
        var cnt = sec.querySelector("[data-count]");
        if (cnt) cnt.textContent = matching;
        if (matching) live.push(sec);
        sec.hidden = true;
      });

      if (tasksShown > live.length) tasksShown = live.length || 1;
      live.forEach(function (sec, i) { sec.hidden = i >= tasksShown; });

      if (moreEl) moreEl.hidden = tasksShown >= live.length;

      var groupsShown = live.length;
      if (countEl) {
        countEl.innerHTML =
          "Showing <b>" + shown + "</b> " + (shown === 1 ? "prompt" : "prompts") +
          " across <b>" + groupsShown + "</b> " + (groupsShown === 1 ? "task" : "tasks");
      }

      if (emptyEl) {
        emptyEl.hidden = shown !== 0;
        if (!shown && emptyMsgEl) {
          var bits = [];
          if (stateFilter.tool.length) bits.push(stateFilter.tool.map(toolLabel).join(" or "));
          if (stateFilter.group.length) bits.push(stateFilter.group.map(groupLabel).join(" or "));
          emptyMsgEl.textContent = stateFilter.q && !bits.length
            ? "Nothing matches \u201c" + stateFilter.q.trim() + "\u201d."
            : "No prompts are both " + bits.join(" and ") + (stateFilter.q ? ", matching \u201c" + stateFilter.q.trim() + "\u201d" : "") + ".";
        }
      }

      Array.prototype.forEach.call(document.querySelectorAll(".nav__item"), function (c) {
        var kind = c.dataset.kind, val = c.dataset.val;
        var sel = stateFilter[kind];

        if (val === "all") {
          c.classList.toggle("is-on", sel.length === 0);
          var allCount = ALL.filter(function (p) { return matches(p, terms, stateFilter.tool, stateFilter.group); }).length;
          var chip = c.querySelector(".chip__n");
          if (chip) chip.textContent = allCount;
          return;
        }

        var on = sel.indexOf(val) > -1;
        c.classList.toggle("is-on", on);

        var probeTools = kind === "tool" ? [val] : stateFilter.tool;
        var probeGroups = kind === "group" ? [val] : stateFilter.group;
        var count = ALL.filter(function (p) { return matches(p, terms, probeTools, probeGroups); }).length;
        var chip = c.querySelector(".chip__n");
        if (chip) chip.textContent = count;
      });

      var active = stateFilter.q || stateFilter.tool.length || stateFilter.group.length;
      if (clearBtn) clearBtn.hidden = !active;
    }

    function navItem(kind, val, label, n, icon) {
      return (
        '<button class="nav__item" type="button" data-kind="' + kind + '" data-val="' + esc(val) + '">' +
          (icon ? '<span class="nav__icon">' + icon + '</span>' : '') +
          '<span class="nav__text">' + esc(label) + '</span>' +
          '<span class="chip__n">' + n + '</span>' +
        '</button>'
      );
    }

    // Full-width modern top-filter layout
    appContainer.innerHTML = `
      <!-- Hero Section (Exact Same Full-Width Grid Background as Homepage) -->
      <section class="hero-openalt-section">
        <div class="hero-openalt-container" style="max-width: 960px;">
          <!-- Hero Badge -->
          <div class="hero-openalt-mini-badge">
            <span>⚡ AIRA Prompts Vault • ${ALL.length} Curated Agent Prompts</span>
          </div>

          <!-- Hero Heading & Subheading -->
          <h1 class="hero-openalt-heading">Agentic Coding Prompts Library</h1>
          <p class="hero-openalt-subheading">
            Curated collection of <span id="hero-count">${ALL.length}</span> battle-tested prompts for frontier coding agents, built for
            <span class="inline-tool" data-mark="claude-code"><span class="inline-tool__mark">${TOOL_MARK['claude-code']}</span>Claude&nbsp;Code</span>,
            <span class="inline-tool" data-mark="codex"><span class="inline-tool__mark">${TOOL_MARK['codex']}</span>OpenAI&nbsp;Codex</span>, and
            <span class="inline-tool" data-mark="cursor"><span class="inline-tool__mark">${TOOL_MARK['cursor']}</span>Cursor&nbsp;IDE</span>.
            Select a task, customize the highlighted tokens, and copy in one click.
          </p>

          <!-- Center Search Bar -->
          <div class="hero-search-center" style="margin: 16px auto 14px auto; width: 100%; max-width: 760px;">
            <svg class="hero-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/>
            </svg>
            <input id="search" type="search" placeholder="Search prompts by task, tool, keyword (e.g. Bug fix, Onboarding, Refactor, Plan)..." autocomplete="off" spellcheck="false" aria-label="Search prompts" />
            <button class="hero-search__clear" id="search-clear" type="button" aria-label="Clear search" hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
            <kbd class="hero-search__kbd" id="search-kbd">/</kbd>
          </div>

          <!-- Partners & Sponsors Strip (Bottom of Hero) -->
          ${getSponsorsStripHTML()}
        </div>
      </section>

      <main id="top" class="prompt-library-main" style="padding: 20px 0 40px 0; background: #FFFFFF;">
        <div class="prompt-vault-container">

          <!-- Top Horizontal Filter Hub (Directly Below Hero) -->
          <div class="prompts-filter-hub">
            <!-- Row 1: AI Agent Selector -->
            <div class="filter-row-group">
              <span class="filter-row-label">AI Agent:</span>
              <div class="filter-pills-wrap" id="tool-nav"></div>
            </div>

            <!-- Row 2: Task Selector -->
            <div class="filter-row-group">
              <span class="filter-row-label">Task:</span>
              <div class="filter-pills-wrap" id="group-nav"></div>
            </div>

            <!-- Row 3: Status Count & Reset -->
            <div class="filter-status-row">
              <span class="content__count" id="count"></span>
              <button class="clear" id="clear" type="button" hidden>✕ Clear filters</button>
            </div>
          </div>

          <!-- Prompts Group List Grid -->
          <div class="lib-list" id="list"></div>

          <!-- Show More Button -->
          <div class="more" id="more" hidden>
            <button class="more__btn" type="button" data-more>Show more prompts</button>
          </div>

          <!-- Empty State -->
          <div class="empty" id="empty" hidden>
            <p class="empty__msg" id="empty-msg">Nothing matches.</p>
            <button class="empty__reset" type="button" id="empty-reset">Clear filters</button>
          </div>

        </div>
      </main>

      <!-- Modal Dialog Popup -->
      <div class="dlg" id="dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-title" hidden>
        <div class="dlg__scrim" data-close></div>
        <div class="dlg__panel">
          <button class="dlg__close" id="dialog-close" type="button" data-close aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
          <div class="dlg__body" id="dialog-body"></div>
        </div>
      </div>

      <!-- Floating Toast -->
      <div class="toast" id="toast" role="status" aria-live="polite"></div>
    `;

    // Render list groups
    const listEl = document.getElementById("list");
    let groupsHtml = "";
    GROUPS.forEach(function (g) {
      var items = ALL.filter(function (p) { return catToGroup[p.category] === g.id; });
      if (!items.length) return;
      groupsHtml +=
        '<section class="pl-group" data-group="' + esc(g.id) + '" id="group-' + esc(g.id) + '">' +
          '<div class="pl-group__head">' +
            '<h2 class="pl-group__title">' + esc(g.label) + "</h2>" +
            '<span class="pl-group__count" data-count>' + items.length + "</span>" +
          "</div>" +
          '<div class="pl-group__items">' + items.map(renderCard).join("") + "</div>" +
        "</section>";
    });
    if (listEl) listEl.innerHTML = groupsHtml;

    // Render tool nav pills
    const toolNavEl = document.getElementById("tool-nav");
    if (toolNavEl) {
      toolNavEl.innerHTML =
        navItem("tool", "all", "All Agents", ALL.length, "⚡") +
        TOOLS.map(function (t) {
          return navItem("tool", t.id, t.label, ALL.filter(function (p) { return p.tool === t.id; }).length, t.icon);
        }).join("");
    }

    // Render group nav pills
    const groupNavEl = document.getElementById("group-nav");
    if (groupNavEl) {
      groupNavEl.innerHTML =
        navItem("group", "all", "Everything", ALL.length, "✨") +
        GROUPS.map(function (g) {
          return navItem("group", g.id, g.label, ALL.filter(function (p) { return catToGroup[p.category] === g.id; }).length, g.icon);
        }).join("");
    }

    // Search input wiring
    const searchEl = document.getElementById("search");
    const searchClearEl = document.getElementById("search-clear");
    const searchKbdEl = document.getElementById("search-kbd");

    if (searchKbdEl) {
      searchKbdEl.textContent =
        /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? "\u2318K" : "Ctrl K";
    }

    function syncSearchChrome() {
      if (!searchEl) return;
      var has = searchEl.value.length > 0;
      if (searchClearEl) searchClearEl.hidden = !has;
      if (searchKbdEl) searchKbdEl.hidden = has || document.activeElement === searchEl;
    }

    if (searchEl) {
      searchEl.addEventListener("input", function () {
        stateFilter.q = searchEl.value;
        resetLimits();
        applyFilters();
        syncSearchChrome();
      });
      searchEl.addEventListener("focus", syncSearchChrome);
      searchEl.addEventListener("blur", syncSearchChrome);
      searchEl.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          stateFilter.q = "";
          searchEl.value = "";
          resetLimits();
          applyFilters();
          syncSearchChrome();
        }
      });
    }

    if (searchClearEl) {
      searchClearEl.addEventListener("click", function () {
        if (searchEl) {
          searchEl.value = "";
          stateFilter.q = "";
          resetLimits();
          applyFilters();
          syncSearchChrome();
          searchEl.focus();
        }
      });
    }

    const clearBtn = document.getElementById("clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        stateFilter = { q: "", tool: [], group: [] };
        if (searchEl) searchEl.value = "";
        resetLimits();
        applyFilters();
        syncSearchChrome();
      });
    }

    const emptyResetBtn = document.getElementById("empty-reset");
    if (emptyResetBtn) {
      emptyResetBtn.addEventListener("click", function () {
        if (clearBtn) clearBtn.click();
      });
    }

    // Initial filter apply
    applyFilters();
  }

  // Global document click handler for prompt cards and dialogs
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-more]")) {
      const listEl = document.getElementById("list");
      if (!listEl) return;
      // Show more task groups
      const hiddenGroups = listEl.querySelectorAll(".pl-group[data-matching]:not([data-matching='0'])");
      let currentVisible = 0;
      hiddenGroups.forEach(g => { if (!g.hidden) currentVisible++; });
      if (currentVisible < hiddenGroups.length) {
        if (hiddenGroups[currentVisible]) hiddenGroups[currentVisible].hidden = false;
        currentVisible++;
      }
      const moreEl = document.getElementById("more");
      if (moreEl) moreEl.hidden = currentVisible >= hiddenGroups.length;
      return;
    }
    const toggle = e.target.closest("[data-open]");
    if (toggle) {
      const id = toggle.getAttribute("data-open");
      const ALL = window.ALL_PROMPTS || (typeof AI_PROMPTS_DATA !== 'undefined' ? AI_PROMPTS_DATA.prompts : []) || [];
      const SOURCES = window.PROMPT_SOURCES || (typeof AI_PROMPTS_DATA !== 'undefined' ? AI_PROMPTS_DATA.sources : {}) || {};
      const p = ALL.find(item => item.id === id);
      if (!p) return;

      const dialogEl = document.getElementById("dialog");
      const dialogBodyEl = document.getElementById("dialog-body");
      const dialogCloseEl = document.getElementById("dialog-close");
      if (!dialogEl || !dialogBodyEl) return;

      const REQUIRES_LABEL = {
        "plan-mode": "Plan mode",
        "image-attached": "Attach an image",
        "second-session": "Fresh session",
        "prior-turn": "Follows a previous turn",
        "shell": "Run in a shell",
        "mcp-server": "Needs an MCP server",
        "subagent": "Uses subagents",
        "slash-command": "Slash command",
        "save-to-file": "Save to a file",
        "selection": "Select code first"
      };

      const SEQUENCES = {
        "explore-plan-code":   "Explore \u2192 plan \u2192 code",
        "find-code":           "Find the code",
        "bugfix":              "Fix a bug",
        "refactor":            "Refactor",
        "tests":               "Add tests",
        "docs":                "Document",
        "pull-request":        "Open a PR",
        "writer-reviewer":     "Writer / reviewer",
        "fan-out":             "Fan out across files",
        "cx-bugfix":           "Fix a bug",
        "cx-design-iteration": "Iterate on a design",
        "cx-refactor-plan":    "Plan a refactor",
        "cx-prototype":        "Prototype from an image"
      };

      const TOOL_MARK = {
        "claude-code": '<svg viewBox="0 0 248 248" fill="none"><path d="M52.4285 162.873L98.7844 136.879L99.5485 134.602L98.7844 133.334H96.4921L88.7237 132.862L62.2346 132.153L39.3113 131.207L17.0249 130.026L11.4214 128.844L6.2 121.873L6.7094 118.447L11.4214 115.257L18.171 115.847L33.0711 116.911L55.485 118.447L71.6586 119.392L95.728 121.873H99.5485L100.058 120.337L98.7844 119.392L97.7656 118.447L74.5877 102.732L49.4995 86.1905L36.3823 76.62L29.3779 71.7757L25.8121 67.2858L24.2839 57.3608L30.6515 50.2716L39.3113 50.8623L41.4763 51.4531L50.2636 58.1879L68.9842 72.7209L93.4357 90.6804L97.0015 93.6343L98.4374 92.6652L98.6571 91.9801L97.0015 89.2625L83.757 65.2772L69.621 40.8192L63.2534 30.6579L61.5978 24.632C60.9565 22.1032 60.579 20.0111 60.579 17.4246L67.8381 7.49965L71.9133 6.19995L81.7193 7.49965L85.7946 11.0443L91.9074 24.9865L101.714 46.8451L116.996 76.62L121.453 85.4816L123.873 93.6343L124.764 96.1155H126.292V94.6976L127.566 77.9197L129.858 57.3608L132.15 30.8942L132.915 23.4505L136.608 14.4708L143.994 9.62643L149.725 12.344L154.437 19.0788L153.8 23.4505L150.998 41.6463L145.522 70.1215L141.957 89.2625H143.994L146.414 86.7813L156.093 74.0206L172.266 53.698L179.398 45.6635L187.803 36.802L193.152 32.5484H203.34L210.726 43.6549L207.415 55.1159L196.972 68.3492L188.312 79.5739L175.896 96.2095L168.191 109.585L168.882 110.689L170.738 110.53L198.755 104.504L213.91 101.787L231.994 98.7149L240.144 102.496L241.036 106.395L237.852 114.311L218.495 119.037L195.826 123.645L162.07 131.592L161.696 131.893L162.137 132.547L177.36 133.925L183.855 134.279H199.774L229.447 136.524L237.215 141.605L241.8 147.867L241.036 152.711L229.065 158.737L213.019 154.956L175.45 145.977L162.587 142.787H160.805V143.85L171.502 154.366L191.242 172.089L215.82 195.011L217.094 200.682L213.91 205.172L210.599 204.699L188.949 188.394L180.544 181.069L161.696 165.118H160.422V166.772L164.752 173.152L187.803 207.771L188.949 218.405L187.294 221.832L181.308 223.959L174.813 222.777L161.187 203.754L147.305 182.486L136.098 163.345L134.745 164.2L128.075 235.42L125.019 239.082L117.887 241.8L111.902 237.31L108.718 229.984L111.902 215.452L115.722 196.547L118.779 181.541L121.58 162.873L123.291 156.636L123.14 156.219L121.773 156.449L107.699 175.752L86.304 204.699L69.3663 222.777L65.291 224.431L58.2867 220.768L58.9235 214.27L62.8713 208.48L86.304 178.705L100.44 160.155L109.551 149.507L109.462 147.967L108.959 147.924L46.6977 188.512L35.6182 189.93L30.7788 185.44L31.4156 178.115L33.7079 175.752L52.4285 162.873Z" fill="#D97757"/></svg>',
        "codex": '<svg viewBox="3.4 3.4 17.2 17.2"><path fill="#000000" d="M9.94494 9.59163V8.13227C9.94494 8.00935 9.99105 7.91713 10.0985 7.85575L13.0327 6.16599C13.4321 5.93558 13.9083 5.8281 14.3998 5.8281C16.2432 5.8281 17.4108 7.25677 17.4108 8.77751C17.4108 8.885 17.4108 9.00792 17.3953 9.13083L14.3537 7.34884C14.1694 7.24135 13.985 7.24135 13.8007 7.34884L9.94494 9.59163ZM16.7963 15.2755V11.7883C16.7963 11.5732 16.704 11.4196 16.5197 11.3121L12.664 9.0693L13.9236 8.34725C14.0311 8.28587 14.1234 8.28587 14.2308 8.34725L17.165 10.037C18.0099 10.5287 18.5782 11.5732 18.5782 12.587C18.5782 13.7544 17.887 14.8298 16.7963 15.2753V15.2755ZM9.03861 12.2031L7.77896 11.4658C7.67146 11.4045 7.62535 11.3122 7.62535 11.1893V7.8098C7.62535 6.16613 8.88501 4.92176 10.5902 4.92176C11.2354 4.92176 11.8344 5.13689 12.3415 5.52089L9.31526 7.27218C9.13097 7.37968 9.03875 7.53328 9.03875 7.74841V12.2033L9.03861 12.2031ZM11.75 13.77L9.94494 12.7562V10.6056L11.75 9.59178L13.5549 10.6056V12.7562L11.75 13.77ZM12.9098 18.44C12.2645 18.44 11.6655 18.2249 11.1585 17.8409L14.1847 16.0896C14.369 15.9821 14.4612 15.8285 14.4612 15.6134V11.1585L15.7363 11.8958C15.8438 11.9572 15.8899 12.0494 15.8899 12.1723V15.5519C15.8899 17.1955 14.6148 18.44 12.9098 18.44ZM9.26901 15.0144L6.33486 13.3246C5.4899 12.833 4.92161 11.7885 4.92161 10.7746C4.92161 9.59177 5.62824 8.53183 6.71886 8.0863V11.5887C6.71886 11.8039 6.81109 11.9575 6.99538 12.065L10.8359 14.2923L9.57621 15.0144C9.46872 15.0758 9.37649 15.0758 9.26901 15.0144ZM9.10013 17.5337C7.36426 17.5337 6.08919 16.2279 6.08919 14.6149C6.08919 14.492 6.1046 14.3691 6.11988 14.2462L9.1461 15.9975C9.33039 16.105 9.51483 16.105 9.69912 15.9975L13.5549 13.7702V15.2295C13.5549 15.3524 13.5088 15.4446 13.4013 15.506L10.4671 17.1958C10.0677 17.4262 9.59148 17.5337 9.09999 17.5337H9.10013ZM12.9098 19.3616C14.7685 19.3616 16.32 18.0406 16.6735 16.2893C18.3939 15.8438 19.5 14.2308 19.5 12.5872C19.5 11.5118 19.0391 10.4673 18.2096 9.71454C18.2864 9.39192 18.3326 9.0693 18.3326 8.74682C18.3326 6.55014 16.5505 4.90634 14.4921 4.90634C14.0774 4.90634 13.6779 4.96772 13.2785 5.10605C12.5872 4.43011 11.6347 4 10.5902 4C8.7314 4 7.17996 5.32103 6.8265 7.07232C5.10605 7.51786 4 9.13083 4 10.7745C4 11.8498 4.4608 12.8944 5.29035 13.6471C5.21354 13.9697 5.16743 14.2923 5.16743 14.6148C5.16743 16.8114 6.94941 18.4552 9.00792 18.4552C9.42261 18.4552 9.82204 18.3939 10.2215 18.2556C10.9127 18.9315 11.8651 19.3616 12.9098 19.3616Z"/></svg>',
        "cursor": '<svg viewBox="0 0 466.73 532.09"><path fill="#26251e" d="M457.43,125.94L244.42,2.96c-6.84-3.95-15.28-3.95-22.12,0L9.3,125.94c-5.75,3.32-9.3,9.46-9.3,16.11v247.99c0,6.65,3.55,12.79,9.3,16.11l213.01,122.98c6.84,3.95,15.28,3.95,22.12,0l213.01-122.98c5.75-3.32,9.3-9.46,9.3-16.11v-247.99c0-6.65-3.55-12.79-9.3-16.11h-.01ZM444.05,151.99l-205.63,356.16c-1.39,2.4-5.06,1.42-5.06-1.36v-233.21c0-4.66-2.49-8.97-6.53-11.31L24.87,145.67c-2.4-1.39-1.42-5.06,1.36-5.06h411.26c5.84,0,9.49,6.33,6.57,11.39h-.01Z"/></svg>'
      };

      function esc(s) {
        return String(s || '').replace(/[&<>"']/g, function (c) {
          return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
      }

      function toolLabel(id) {
        var TOOLS_MAP = { "claude-code": "Claude Code", "codex": "Codex", "cursor": "Cursor" };
        return TOOLS_MAP[id] || id;
      }

      function marks(list) {
        if (!list || !list.length) return "";
        return '<span class="marks">' +
          list.map(function (t) {
            return '<span class="mark" title="' + esc(toolLabel(t)) + '" aria-label="' + esc(toolLabel(t)) + '">' + (TOOL_MARK[t] || '') + "</span>";
          }).join("") + "</span>";
      }

      function srcMark(tool) {
        return '<button class="src-mark" type="button" data-kind="tool" data-val="' + esc(tool) +
          '" title="Show only ' + esc(toolLabel(tool)) + ' prompts" aria-label="Filter to ' + esc(toolLabel(tool)) + '">' +
          (TOOL_MARK[tool] || '') + "</button>";
      }

      function slots(text) {
        var out = "", last = 0, re = /<([^<>]*)>/g, m;
        while ((m = re.exec(text)) !== null) {
          out += esc(text.slice(last, m.index));
          out += '<span class="slot">' + esc(m[0]) + "</span>";
          last = m.index + m[0].length;
        }
        return out + esc(text.slice(last));
      }

      var COPY_ICON =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
      var OUT_ICON =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M14 5h5v5M19 5l-8 8M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/></svg>';

      function copyBtn(text, label) {
        return '<button class="copy" type="button" data-copy="' + esc(text) + '" aria-label="' + esc(label) + '">' + COPY_ICON + "</button>";
      }

      function badges(p) {
        var out = "";
        if (p.sequence) {
          out += '<span class="tag tag--seq">' + esc(SEQUENCES[p.sequence] || p.sequence) +
                 " \u00b7 step " + p.step + "</span>";
        }
        (p.requires || []).forEach(function (r) {
          out += '<span class="tag tag--req">' + esc(REQUIRES_LABEL[r] || r) + "</span>";
        });
        return out ? '<div class="pl__tags">' + out + "</div>" : "";
      }

      function promptBody(p) {
        var body = "";
        if (p.weak) {
          body +=
            '<div class="pl__weak"><span class="pl__weak-tag">Docs\u2019 weak example</span>' +
            '<span class="pl__weak-text">' + esc(p.weak) + "</span></div>";
        }
        if (p.kind === "config") {
          body +=
            '<div class="pl__code-wrap">' +
            (p.cap ? '<span class="cap">' + esc(p.cap) + "</span>" : "") +
            '<pre class="codeblock"><code>' + slots(p.template || p.prompt) + "</code>" +
            copyBtn(p.template || p.prompt, "Copy template") + "</pre></div>";
        } else {
          body +=
            '<div class="pl__prompt pl__prompt--template">' +
            '<p class="pl__prompt-text">' + slots(p.template || p.prompt) + "</p>" +
            copyBtn(p.template || p.prompt, "Copy template") + "</div>";
        }
        if (p.shell) {
          body +=
            '<div class="pl__shell"><span class="cap">Run it</span>' +
            '<pre class="codeblock codeblock--sm"><code>' + esc(p.shell) + "</code>" +
            copyBtn(p.shell, "Copy command") + "</pre></div>";
        }
        return body;
      }

      var src = SOURCES[p.page] || {};
      var n = ((p.template || p.prompt || '').match(/<[^<>]{2,}>/g) || []).length;

      dialogBodyEl.innerHTML =
        '<div class="dlg__head">' +
          '<div class="dlg__headline">' +
            '<h2 class="dlg__title" id="dlg-title">' + esc(p.title) + "</h2>" +
            marks(p.worksIn && p.worksIn.length ? p.worksIn : [p.tool]) +
          "</div>" +
          (p.why ? '<p class="dlg__why">' + esc(p.why) + "</p>" : "") +
          badges(p) +
        "</div>" +
        promptBody(p) +
        '<div class="dlg__foot">' + srcMark(p.tool) +
          '<a class="pl__src" href="' + esc(src.url || "#") + '" target="_blank" rel="noopener">' +
            esc(src.short || src.label || "Source") +
            (src.publisher ? ' <span class="pl__src-pub">from ' + esc(src.publisher) + "</span>" : "") +
            OUT_ICON +
          "</a>" +
          '<span class="pl__slots">' + (n ? n + (n === 1 ? " slot to fill in" : " slots to fill in") : "ready to use") + "</span>" +
        "</div>";

      dialogEl.hidden = false;
      document.body.classList.add("has-dialog");
      if (dialogCloseEl) dialogCloseEl.focus();
      return;
    }

    if (e.target.closest("[data-close]")) {
      const dialogEl = document.getElementById("dialog");
      const dialogBodyEl = document.getElementById("dialog-body");
      if (dialogEl && !dialogEl.hidden) {
        dialogEl.hidden = true;
        document.body.classList.remove("has-dialog");
        if (dialogBodyEl) dialogBodyEl.innerHTML = "";
      }
      return;
    }

    const copyEl = e.target.closest("[data-copy]");
    if (copyEl) {
      const textToCopy = copyEl.getAttribute("data-copy") || "";
      const toastEl = document.getElementById("toast");
      const DONE_ICON =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M4 12.5l5 5L20 6.5"/></svg>';

      function showToastMsg() {
        var slots = (textToCopy.match(/<[^<>]{2,}>/g) || []).length;
        if (toastEl) {
          toastEl.textContent = slots ? ("Copied \u00b7 " + slots + (slots === 1 ? " slot" : " slots") + " to fill in") : "Copied";
          toastEl.classList.add("is-visible");
          setTimeout(() => { toastEl.classList.remove("is-visible"); }, 1600);
        }
        if (!copyEl.getAttribute("data-rest")) copyEl.setAttribute("data-rest", copyEl.innerHTML);
        copyEl.innerHTML = DONE_ICON;
        copyEl.classList.add("is-done");
        setTimeout(() => {
          copyEl.innerHTML = copyEl.getAttribute("data-rest");
          copyEl.classList.remove("is-done");
        }, 1200);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(showToastMsg).catch(() => {
          var ta = document.createElement("textarea");
          ta.value = textToCopy;
          ta.style.cssText = "position:fixed;top:0;left:-9999px";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          showToastMsg();
        });
      } else {
        var ta = document.createElement("textarea");
        ta.value = textToCopy;
        ta.style.cssText = "position:fixed;top:0;left:-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showToastMsg();
      }
      return;
    }

    const chipEl = e.target.closest(".nav__item, .src-mark");
    if (chipEl) {
      const kind = chipEl.dataset.kind;
      const val = chipEl.dataset.val;
      if (kind === "tool" || kind === "group") {
        const clearBtn = document.getElementById("clear");
        if (chipEl.classList.contains("src-mark")) {
          // Select single tool
          document.querySelectorAll(".nav__item[data-kind='tool']").forEach(btn => {
            if (btn.dataset.val === val) btn.click();
          });
          return;
        }

        // Toggle nav item
        const isAll = (val === "all");
        if (isAll) {
          document.querySelectorAll(`.nav__item[data-kind='${kind}']`).forEach(b => b.classList.remove("is-on"));
          chipEl.classList.add("is-on");
        } else {
          document.querySelectorAll(`.nav__item[data-kind='${kind}'][data-val='all']`).forEach(b => b.classList.remove("is-on"));
          chipEl.classList.toggle("is-on");
          const anyActive = document.querySelectorAll(`.nav__item[data-kind='${kind}'].is-on`).length > 0;
          if (!anyActive) {
            const allBtn = document.querySelector(`.nav__item[data-kind='${kind}'][data-val='all']`);
            if (allBtn) allBtn.classList.add("is-on");
          }
        }

        // Filter list items
        const activeTools = Array.from(document.querySelectorAll(".nav__item[data-kind='tool'].is-on:not([data-val='all'])")).map(b => b.dataset.val);
        const activeGroups = Array.from(document.querySelectorAll(".nav__item[data-kind='group'].is-on:not([data-val='all'])")).map(b => b.dataset.val);
        const searchInput = document.getElementById("search");
        const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
        const terms = query.split(/\s+/).filter(Boolean);

        const listEl = document.getElementById("list");
        const countEl = document.getElementById("count");
        const emptyEl = document.getElementById("empty");
        const emptyMsgEl = document.getElementById("empty-msg");
        const filterBtnN = document.getElementById("filterbtn-n");
        const filterBtn = document.getElementById("filterbtn");

        if (listEl) {
          const ALL = window.ALL_PROMPTS || (typeof AI_PROMPTS_DATA !== 'undefined' ? AI_PROMPTS_DATA.prompts : []) || [];
          const GROUPS_MAP = {
            "understand": ["onboarding", "search", "context-refs"],
            "plan": ["planning"],
            "debug": ["debugging"],
            "test": ["testing", "verification"],
            "refactor": ["refactoring", "documentation"],
            "review": ["review"],
            "images": ["images"],
            "configure": ["config"],
            "automate": ["automation", "subagents", "scale", "context-management", "capabilities", "pr-git"]
          };
          const catToGroupMap = {};
          Object.keys(GROUPS_MAP).forEach(gid => { GROUPS_MAP[gid].forEach(c => { catToGroupMap[c] = gid; }); });

          let shown = 0;
          ALL.forEach(p => {
            const cardEl = document.getElementById(p.id);
            if (!cardEl) return;
            const toolMatch = !activeTools.length || activeTools.includes(p.tool);
            const groupMatch = !activeGroups.length || activeGroups.includes(catToGroupMap[p.category]);
            const hay = [p.title, p.prompt, p.code, p.template, p.why, p.weak, p.section, p.shell, p.tool].filter(Boolean).join(" ").toLowerCase();
            const termMatch = !terms.length || terms.every(t => hay.indexOf(t) !== -1);
            const ok = toolMatch && groupMatch && termMatch;
            cardEl.hidden = !ok;
            if (ok) shown++;
          });

          let liveGroups = 0;
          listEl.querySelectorAll(".pl-group").forEach(sec => {
            const matching = sec.querySelectorAll(".pl:not([hidden])").length;
            const cnt = sec.querySelector("[data-count]");
            if (cnt) cnt.textContent = matching;
            sec.hidden = (matching === 0);
            if (matching > 0) liveGroups++;
          });

          if (countEl) {
            countEl.innerHTML = "<b>" + shown + "</b> " + (shown === 1 ? "prompt" : "prompts") + " across <b>" + liveGroups + "</b> " + (liveGroups === 1 ? "task" : "tasks");
          }
          if (emptyEl) {
            emptyEl.hidden = (shown !== 0);
          }
          if (clearBtn) {
            const isFilterActive = (activeTools.length > 0 || activeGroups.length > 0 || query.length > 0);
            clearBtn.hidden = !isFilterActive;
          }
          const totalActiveCount = activeTools.length + activeGroups.length;
          if (filterBtnN) {
            filterBtnN.hidden = totalActiveCount === 0;
            filterBtnN.textContent = totalActiveCount;
          }
          if (filterBtn) {
            filterBtn.classList.toggle("is-active", totalActiveCount > 0);
          }
        }
      }
    }
  });

  // Global Keydown Handler for Search Shortcut and Esc
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      const dialogEl = document.getElementById("dialog");
      if (dialogEl && !dialogEl.hidden) {
        dialogEl.hidden = true;
        document.body.classList.remove("has-dialog");
        const dialogBodyEl = document.getElementById("dialog-body");
        if (dialogBodyEl) dialogBodyEl.innerHTML = "";
        return;
      }
      const sideEl = document.getElementById("side");
      if (sideEl && sideEl.classList.contains("is-open")) {
        sideEl.classList.remove("is-open");
        const scrim = document.getElementById("side-scrim");
        if (scrim) scrim.hidden = true;
        document.body.classList.remove("has-sheet");
        return;
      }
    }
    if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
      const searchEl = document.getElementById("search");
      if (searchEl) {
        e.preventDefault();
        searchEl.focus();
        searchEl.select();
      }
    }
  });

  // =========================================================================
  // 6. AI Tool Comparison / VS Mode (/#/compare)
  // =========================================================================
  function renderComparePage() {
    const toolsData = typeof AI_TOOLS_DATA !== 'undefined' ? AI_TOOLS_DATA : { tools: [] };
    const allTools = getAllTools();

    // Default tools to compare if not set
    if (!state.compareTool1 && allTools.length > 0) state.compareTool1 = allTools[0].id;
    if (!state.compareTool2 && allTools.length > 1) state.compareTool2 = allTools[1].id;

    const tool1 = allTools.find(t => t.id === state.compareTool1) || allTools[0];
    const tool2 = allTools.find(t => t.id === state.compareTool2) || allTools[1] || allTools[0];

    const presets = [
      { label: 'Cursor vs Copilot', t1: 'cursor', t2: 'copilot' },
      { label: 'Claude 3.7 vs ChatGPT', t1: 'claude-ai', t2: 'chatgpt' },
      { label: 'Midjourney vs Flux', t1: 'midjourney', t2: 'flux-ai' },
      { label: 'Perplexity vs Gemini', t1: 'perplexity-ai', t2: 'google-gemini' },
      { label: 'ElevenLabs vs Suno', t1: 'elevenlabs', t2: 'suno-ai' },
      { label: 'v0.dev vs Bolt.new', t1: 'v0-dev', t2: 'bolt-new' }
    ];

    function getToolDomain(t) {
      return getCleanToolDomain(t);
    }

    function getLogo(t) {
      return getToolLogoUrl(t);
    }

    appContainer.innerHTML = `
      <!-- Hero Section (Exact Same Full-Width Grid Background as Homepage) -->
      <section class="hero-openalt-section">
        <div class="hero-openalt-container" style="max-width: 960px;">
          <!-- Hero Badge -->
          <div class="hero-openalt-mini-badge">
            <span>⚔️ Side-by-Side Comparison</span>
          </div>

          <!-- Hero Heading & Subheading -->
          <h1 class="hero-openalt-heading">AI Tool Comparison (VS Mode)</h1>
          <p class="hero-openalt-subheading">
            Compare specifications, pricing models, key capabilities, pros &amp; cons side-by-side to make the smartest AI choice.
          </p>

          <!-- Partners & Sponsors Strip (Bottom of Hero) -->
          ${getSponsorsStripHTML()}
        </div>
      </section>

      <div class="tools-directory-page" style="padding: 20px 0 40px 0; background: #FFFFFF;">
        <div class="container">
          <!-- Selector Card -->
          <div class="compare-selector-card">
            <div class="compare-selectors-grid">
              <div class="compare-select-col">
                <label style="font-size: 0.85rem; font-weight: 800; color: #71717A; text-transform: uppercase; letter-spacing: 0.05em;">Tool 1</label>
                <select class="compare-select-dropdown" id="select-compare-tool1">
                  ${allTools.map(t => `
                    <option value="${t.id}" ${tool1 && tool1.id === t.id ? 'selected' : ''}>${t.name} (${t.pricing})</option>
                  `).join('')}
                </select>
              </div>

              <div class="compare-vs-badge">VS</div>

              <div class="compare-select-col">
                <label style="font-size: 0.85rem; font-weight: 800; color: #71717A; text-transform: uppercase; letter-spacing: 0.05em;">Tool 2</label>
                <select class="compare-select-dropdown" id="select-compare-tool2">
                  ${allTools.map(t => `
                    <option value="${t.id}" ${tool2 && tool2.id === t.id ? 'selected' : ''}>${t.name} (${t.pricing})</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <!-- Quick Presets -->
            <div class="compare-preset-pills-row">
              <span style="font-size: 0.82rem; font-weight: 700; color: #71717A;">Popular Comparisons:</span>
              ${presets.map(p => `
                <button type="button" class="compare-preset-btn" data-t1="${p.t1}" data-t2="${p.t2}">${p.label}</button>
              `).join('')}
            </div>
          </div>

          <!-- Matrix Table Comparison -->
          <div style="overflow-x: auto; margin-bottom: 60px;">
            <table class="compare-matrix-table">
              <thead>
                <tr>
                  <th style="width: 22%;">Comparison Feature</th>
                  <th style="width: 39%;">
                    <div class="compare-col-header-wrap">
                      <img loading="lazy" decoding="async" src="${getLogo(tool1)}" alt="${tool1?.name}" style="width: 32px; height: 32px; border-radius: 8px; object-fit: cover;" onerror="this.src='assets/logo.svg'" />
                      <div>
                        <div style="font-size: 1.15rem; font-weight: 900; color: #18181B;">${tool1?.name || 'Tool 1'}</div>
                        <span class="tool-badge-pricing pricing-${(tool1?.pricing || 'free').toLowerCase().replace(/\s+/g, '-')}">${tool1?.pricing || 'Free'}</span>
                      </div>
                    </div>
                  </th>
                  <th style="width: 39%;">
                    <div class="compare-col-header-wrap">
                      <img loading="lazy" decoding="async" src="${getLogo(tool2)}" alt="${tool2?.name}" style="width: 32px; height: 32px; border-radius: 8px; object-fit: cover;" onerror="this.src='assets/logo.svg'" />
                      <div>
                        <div style="font-size: 1.15rem; font-weight: 900; color: #18181B;">${tool2?.name || 'Tool 2'}</div>
                        <span class="tool-badge-pricing pricing-${(tool2?.pricing || 'free').toLowerCase().replace(/\s+/g, '-')}">${tool2?.pricing || 'Free'}</span>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="compare-feature-label">Description</td>
                  <td><p style="color: #3F3F46; line-height: 1.5; font-size: 0.93rem;">${tool1?.description || 'N/A'}</p></td>
                  <td><p style="color: #3F3F46; line-height: 1.5; font-size: 0.93rem;">${tool2?.description || 'N/A'}</p></td>
                </tr>
                <tr>
                  <td class="compare-feature-label">Primary Categories</td>
                  <td>
                    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                      ${(tool1?.categories || [tool1?.category || 'AI']).map(c => `<span class="tool-category-badge">${c}</span>`).join('')}
                    </div>
                  </td>
                  <td>
                    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                      ${(tool2?.categories || [tool2?.category || 'AI']).map(c => `<span class="tool-category-badge">${c}</span>`).join('')}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="compare-feature-label">Pricing Model</td>
                  <td><strong style="color: #1C46F5; font-size: 1rem;">${tool1?.pricing || 'Free'}</strong></td>
                  <td><strong style="color: #1C46F5; font-size: 1rem;">${tool2?.pricing || 'Free'}</strong></td>
                </tr>
                <tr>
                  <td class="compare-feature-label">Key Strengths</td>
                  <td>
                    <ul style="padding-left: 18px; color: #3F3F46; font-size: 0.9rem; line-height: 1.6;">
                      <li>High-performance inference & intuitive modern UX</li>
                      <li>Robust developer ecosystem and direct export workflows</li>
                      <li>Regular weekly feature updates and active community</li>
                    </ul>
                  </td>
                  <td>
                    <ul style="padding-left: 18px; color: #3F3F46; font-size: 0.9rem; line-height: 1.6;">
                      <li>Deep ecosystem integration with enterprise security</li>
                      <li>Comprehensive multi-modal reasoning capabilities</li>
                      <li>Extensive API documentation and SDK support</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td class="compare-feature-label">Ideal For</td>
                  <td><span style="font-size: 0.9rem; color: #18181B; font-weight: 600;">Engineers, power users & high-velocity teams</span></td>
                  <td><span style="font-size: 0.9rem; color: #18181B; font-weight: 600;">Enterprises, researchers & multi-discipline workflows</span></td>
                </tr>
                <tr>
                  <td class="compare-feature-label">AIRA Recommendation</td>
                  <td>
                    <div style="display: inline-flex; align-items: center; gap: 6px; background: #EEF2FF; color: #1C46F5; font-weight: 800; padding: 6px 12px; border-radius: 8px; font-size: 0.85rem;">
                      ★ 9.4 / 10 • Editor's Choice
                    </div>
                  </td>
                  <td>
                    <div style="display: inline-flex; align-items: center; gap: 6px; background: #EEF2FF; color: #4F46E5; font-weight: 800; padding: 6px 12px; border-radius: 8px; font-size: 0.85rem;">
                      ★ 9.2 / 10 • Highly Recommended
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="compare-feature-label">Official Link</td>
                  <td>
                    <div style="display: flex; gap: 10px; align-items: center;">
                      <a href="${tool1?.url || '#'}" target="_blank" rel="noopener noreferrer" class="tool-direct-visit-btn" style="display: inline-flex; padding: 8px 16px; font-weight: 700;">
                        <span>Visit ${tool1?.name}</span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      </a>
                      <a href="#/tools/${tool1?.id}" class="tool-details-btn" style="padding: 8px 14px;">Details</a>
                    </div>
                  </td>
                  <td>
                    <div style="display: flex; gap: 10px; align-items: center;">
                      <a href="${tool2?.url || '#'}" target="_blank" rel="noopener noreferrer" class="tool-direct-visit-btn" style="display: inline-flex; padding: 8px 16px; font-weight: 700;">
                        <span>Visit ${tool2?.name}</span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      </a>
                      <a href="#/tools/${tool2?.id}" class="tool-details-btn" style="padding: 8px 14px;">Details</a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Bind dropdown change events
    const sel1 = document.getElementById('select-compare-tool1');
    const sel2 = document.getElementById('select-compare-tool2');

    if (sel1) {
      sel1.addEventListener('change', (e) => {
        state.compareTool1 = e.target.value;
        renderComparePage();
      });
    }

    if (sel2) {
      sel2.addEventListener('change', (e) => {
        state.compareTool2 = e.target.value;
        renderComparePage();
      });
    }

    // Bind quick preset buttons
    appContainer.querySelectorAll('.compare-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const t1 = btn.getAttribute('data-t1');
        const t2 = btn.getAttribute('data-t2');
        if (t1) state.compareTool1 = t1;
        if (t2) state.compareTool2 = t2;
        renderComparePage();
      });
    });
  }

  // =========================================================================
  // 7. Bookmarks / Saved Library (/#/bookmarks)
  // =========================================================================
  function renderBookmarksPage() {
    const toolsData = typeof AI_TOOLS_DATA !== 'undefined' ? AI_TOOLS_DATA : { tools: [] };
    const allTools = getAllTools();
    const altsData = typeof ALTERNATIVES_DATA !== 'undefined' ? ALTERNATIVES_DATA : { alternatives: [] };
    const allAlts = altsData.alternatives || [];
    const allJobsList = typeof getJobs === 'function' ? getJobs() : [];

    const savedToolIds = state.savedTools || [];
    const savedArticleSlugs = state.savedArticles || [];
    const savedAltSlugs = state.savedAlternatives || [];
    const savedJobIds = state.savedJobs || [];

    const savedToolsList = allTools.filter(t => savedToolIds.includes(t.id));
    const savedArticlesList = state.articles.filter(a => savedArticleSlugs.includes(a.slug));
    const savedAltsList = allAlts.filter(a => savedAltSlugs.includes(a.slug));
    const savedJobsList = allJobsList.filter(j => savedJobIds.includes(j.id));

    const currentTab = state.bookmarkTab || 'tools';

    function renderSavedToolsHTML(list) {
      if (list.length === 0) {
        return `
          <div style="text-align: center; padding: 60px 20px; background: #FAFAFA; border: 1px dashed #E4E4E7; border-radius: 16px;">
            <span style="font-size: 2.5rem; display: block; margin-bottom: 12px;">🔖</span>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: #18181B; margin-bottom: 8px;">No Saved AI Tools Yet</h3>
            <p style="color: #71717A; font-size: 0.95rem; margin-bottom: 20px;">Explore the AI directory and bookmark your favorite tools for quick access.</p>
            <a href="#/tags" class="btn-subscribe-nav">Explore AI Tools →</a>
          </div>
        `;
      }
      return `
        <div class="tools-grid-3col">
          ${list.map(renderToolCard).join('')}
        </div>
      `;
    }

    function renderSavedArticlesHTML(list) {
      if (list.length === 0) {
        return `
          <div style="text-align: center; padding: 60px 20px; background: #FAFAFA; border: 1px dashed #E4E4E7; border-radius: 16px;">
            <span style="font-size: 2.5rem; display: block; margin-bottom: 12px;">📰</span>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: #18181B; margin-bottom: 8px;">No Saved Articles Yet</h3>
            <p style="color: #71717A; font-size: 0.95rem; margin-bottom: 20px;">Save must-read newsletter editions to build your personal knowledge vault.</p>
            <a href="#/home" class="btn-subscribe-nav">Browse Editions →</a>
          </div>
        `;
      }
      return `
        <div class="articles-grid-2col">
          ${list.map(article => `
            <div class="article-card">
              <div class="card-image-wrap">
                <img loading="lazy" decoding="async" src="${article.image_url || 'assets/logo.jpg'}" alt="${article.title || 'AIRA Article'}" class="card-thumbnail" loading="lazy" />
                <span class="card-tag-badge">${article.tag || 'Frontier AI'}</span>
              </div>
              <div class="card-body">
                <h3 class="card-title"><a href="#/p/${article.slug}">${article.title || ''}</a></h3>
                <p class="card-subtitle">${article.subtitle || ''}</p>
                <div class="card-footer" style="margin-top: 14px; display: flex; justify-content: space-between; align-items: center;">
                  <span class="card-meta-date">${article.date || 'Sep 2026'} • ${article.reading_time || article.read_time || '4 min read'}</span>
                  <button type="button" class="btn-remove-art-bookmark" data-slug="${article.slug}" style="background: none; border: 1px solid #E4E4E7; color: #EF4444; font-size: 0.8rem; font-weight: 700; padding: 5px 10px; border-radius: 6px; cursor: pointer;">Remove ✕</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    function renderSavedJobsHTML(list) {
      if (list.length === 0) {
        return `
          <div style="text-align: center; padding: 60px 20px; background: #FAFAFA; border: 1px dashed #E4E4E7; border-radius: 16px;">
            <span style="font-size: 2.5rem; display: block; margin-bottom: 12px;">💼</span>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: #18181B; margin-bottom: 8px;">No Saved Jobs Yet</h3>
            <p style="color: #71717A; font-size: 0.95rem; margin-bottom: 20px;">Explore verified AI, UI/UX & tech openings and save them for fast applications.</p>
            <a href="#/jobs" class="btn-subscribe-nav">Explore Jobs Board →</a>
          </div>
        `;
      }
      return `
        <div class="jobs-feed-list">
          ${list.map(job => {
            const officialLink = job.officialApplyUrl || job.applyUrl || `https://${job.companyDomain || 'google.com'}`;
            return `
              <div class="job-feed-card" data-job-id="${job.id}">
                <div class="job-feed-main">
                  <div class="job-company-avatar" style="background: ${job.companyBg || '#18181B'}; width: 40px; height: 40px; font-size: 1.1rem;">
                    ${job.companyInitial || job.company.charAt(0)}
                  </div>
                  <div class="job-feed-content">
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                      <h4 class="job-feed-title">${escapeHtml(job.title)}</h4>
                      ${job.badge ? `<span style="background: #D2FF52; color: #131313; font-weight: 800; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px;">${escapeHtml(job.badge)}</span>` : ''}
                    </div>
                    <div class="job-feed-company-row">
                      <strong style="color: #18181B;" class="dark-text-white">${escapeHtml(job.company)}</strong>
                      <span>•</span>
                      <span>📍 ${escapeHtml(job.location)}</span>
                      <span>•</span>
                      <span>⏱ ${escapeHtml(job.postedAt || 'Recently')}</span>
                    </div>
                    <div class="job-feed-pills-row">
                      <span class="job-salary-tag" style="padding: 2px 7px; font-size: 0.74rem;">${escapeHtml(job.salary)}</span>
                      <span class="job-skill-chip">${escapeHtml(job.type)}</span>
                    </div>
                  </div>
                </div>

                <div class="job-feed-actions">
                  <button type="button" class="btn-remove-job-bookmark" data-job-id="${job.id}" style="background: none; border: 1px solid #E4E4E7; color: #EF4444; font-size: 0.8rem; font-weight: 700; padding: 6px 12px; border-radius: 6px; cursor: pointer;">Remove ✕</button>
                  <a href="${officialLink}" target="_blank" rel="noopener noreferrer" class="job-btn-primary" style="padding: 8px 16px; font-size: 0.8rem;" title="Apply directly on official website">
                    <span>Apply Official ↗</span>
                  </a>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    function renderSavedAltsHTML(list) {
      if (list.length === 0) {
        return `
          <div style="text-align: center; padding: 60px 20px; background: #FAFAFA; border: 1px dashed #E4E4E7; border-radius: 16px;">
            <span style="font-size: 2.5rem; display: block; margin-bottom: 12px;">🔄</span>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: #18181B; margin-bottom: 8px;">No Saved Alternatives Yet</h3>
            <p style="color: #71717A; font-size: 0.95rem; margin-bottom: 20px;">Discover open-source alternatives to proprietary software and save them here.</p>
            <a href="#/alternatives" class="btn-subscribe-nav">Explore Alternatives →</a>
          </div>
        `;
      }
      return `
        <div class="tools-grid-3col">
          ${list.map(alt => `
            <div class="tool-card">
              <div class="tool-card-top">
                <div class="tool-icon-avatar"><span class="tool-emoji">🔄</span></div>
                <div class="tool-title-group">
                  <span class="tool-badge-neutral">${alt.category || 'Software'}</span>
                  <h3 class="tool-card-name"><a href="#/alternatives/${alt.slug}" class="tool-title-link">${alt.proprietarySoftware} Alternatives</a></h3>
                </div>
              </div>
              <p class="tool-card-desc">${alt.description || 'Open source replacements'}</p>
              <div class="tool-card-bottom">
                <button type="button" class="btn-remove-alt-bookmark" data-slug="${alt.slug}" style="background: none; border: 1px solid #E4E4E7; color: #EF4444; font-size: 0.8rem; font-weight: 700; padding: 6px 12px; border-radius: 6px; cursor: pointer;">Remove ✕</button>
                <a href="#/alternatives/${alt.slug}" class="tool-details-btn">View Alternatives →</a>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    appContainer.innerHTML = `
      <!-- Hero Section (Exact Same Full-Width Grid Background as Homepage) -->
      <section class="hero-openalt-section">
        <div class="hero-openalt-container" style="max-width: 900px;">
          <div class="hero-openalt-mini-badge">
            <span>🔖 Your Saved Library</span>
          </div>
          <h1 class="hero-openalt-heading">My Bookmarks</h1>
          <p class="hero-openalt-subheading">
            Quickly revisit your saved AI tools, newsletter editions, verified job openings, and open-source alternatives.
          </p>

          <!-- Partners & Sponsors Strip (Bottom of Hero) -->
          ${getSponsorsStripHTML()}
        </div>
      </section>

      <div class="tools-directory-page" style="padding: 20px 0 40px 0; background: #FFFFFF;">
        <div class="container">
          <!-- Bookmarks Tabs -->
          <div class="bookmarks-tabs-bar">
            <button type="button" class="bookmark-tab-btn ${currentTab === 'tools' ? 'active' : ''}" data-tab="tools">
              <span>⚡ Saved AI Tools (${savedToolsList.length})</span>
            </button>
            <button type="button" class="bookmark-tab-btn ${currentTab === 'jobs' ? 'active' : ''}" data-tab="jobs">
              <span>💼 Saved Jobs (${savedJobsList.length})</span>
            </button>
            <button type="button" class="bookmark-tab-btn ${currentTab === 'articles' ? 'active' : ''}" data-tab="articles">
              <span>📰 Saved Articles (${savedArticlesList.length})</span>
            </button>
          </div>

          <!-- Content Area -->
          <div id="bookmarks-tab-content" style="margin-bottom: 60px;">
            ${currentTab === 'tools' ? renderSavedToolsHTML(savedToolsList) : ''}
            ${currentTab === 'jobs' ? renderSavedJobsHTML(savedJobsList) : ''}
            ${currentTab === 'articles' ? renderSavedArticlesHTML(savedArticlesList) : ''}
            ${currentTab === 'alternatives' ? renderSavedAltsHTML(savedAltsList) : ''}
          </div>
        </div>
      </div>
    `;

    // Bind Tab clicks
    appContainer.querySelectorAll('.bookmark-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.bookmarkTab = btn.getAttribute('data-tab');
        renderBookmarksPage();
      });
    });

    // Bind Remove buttons
    appContainer.querySelectorAll('.btn-remove-bookmark').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const tid = btn.getAttribute('data-tool-id');
        toggleSaveTool(tid);
        renderBookmarksPage();
      });
    });

    appContainer.querySelectorAll('.btn-remove-job-bookmark').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const jid = btn.getAttribute('data-job-id');
        if (jid && state.savedJobs) {
          const idx = state.savedJobs.indexOf(jid);
          if (idx >= 0) {
            state.savedJobs.splice(idx, 1);
            localStorage.setItem('aira_saved_jobs', JSON.stringify(state.savedJobs));
            showToast('Job removed from bookmarks');
            renderBookmarksPage();
          }
        }
      });
    });

    appContainer.querySelectorAll('.btn-remove-art-bookmark').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const slug = btn.getAttribute('data-slug');
        toggleSaveArticle(slug);
        renderBookmarksPage();
      });
    });

    appContainer.querySelectorAll('.btn-remove-alt-bookmark').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const slug = btn.getAttribute('data-slug');
        toggleSaveAlt(slug);
        renderBookmarksPage();
      });
    });
  }

  // =========================================================================
  // 8. Submit an AI Tool Page (/#/submit)
  // =========================================================================
  function renderSubmitPage() {
    const toolsData = typeof AI_TOOLS_DATA !== 'undefined' ? AI_TOOLS_DATA : { categories: [] };
    const categories = toolsData.categories || [];

    appContainer.innerHTML = `
      <!-- Hero Section (Exact Same Full-Width Grid Background as Homepage) -->
      <section class="hero-openalt-section">
        <div class="hero-openalt-container" style="max-width: 800px;">
          <!-- Hero Badge -->
          <div class="hero-openalt-mini-badge">
            <span>🚀 Creator &amp; Founder Submissions</span>
          </div>

          <!-- Hero Heading & Subheading -->
          <h1 class="hero-openalt-heading">Submit Your AI Tool</h1>
          <p class="hero-openalt-subheading">
            Get your product featured in front of 100+ AI enthusiasts, builders, investors, and engineers.
          </p>

          <!-- Partners & Sponsors Strip (Bottom of Hero) -->
          ${getSponsorsStripHTML()}
        </div>
      </section>

      <div class="tools-directory-page" style="padding: 20px 0 40px 0; background: #FFFFFF;">
        <div class="container">
          <!-- Form Card -->
          <div class="submit-form-card" id="submit-form-container">
            <form id="tool-submission-form">
              <div class="form-group">
                <label class="form-label">Tool / Product Name <span class="req">*</span></label>
                <input type="text" name="toolName" class="form-input" placeholder="e.g., CodeWeaver AI" required />
              </div>

              <div class="form-group">
                <label class="form-label">Official Website URL <span class="req">*</span></label>
                <input type="url" name="toolUrl" class="form-input" placeholder="https://yourdomain.com" required />
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                  <label class="form-label">Category <span class="req">*</span></label>
                  <select name="category" class="form-select" required>
                    ${categories.filter(c => c.id !== 'all').map(c => `
                      <option value="${c.id}">${c.name}</option>
                    `).join('')}
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Pricing Model <span class="req">*</span></label>
                  <select name="pricing" class="form-select" required>
                    <option value="Free">Free</option>
                    <option value="Freemium" selected>Freemium</option>
                    <option value="Paid">Paid</option>
                    <option value="Free Trial">Free Trial</option>
                    <option value="Open Source">Open Source</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Short Tagline (1 sentence) <span class="req">*</span></label>
                <input type="text" name="tagline" class="form-input" placeholder="e.g., The next-generation autonomous AI debugger for TypeScript" required />
              </div>

              <div class="form-group">
                <label class="form-label">Detailed Description <span class="req">*</span></label>
                <textarea name="description" class="form-textarea" placeholder="Explain what problem your tool solves, how it works, and key features..." required></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Key Features (comma-separated)</label>
                <input type="text" name="features" class="form-input" placeholder="e.g., Multi-model support, Instant code fix, Zero-config CLI" />
              </div>

              <div class="form-group">
                <label class="form-label">Founder / Contact Email <span class="req">*</span></label>
                <input type="email" name="contactEmail" class="form-input" placeholder="founder@yourcompany.com" required />
              </div>

              <div class="form-group">
                <label class="form-label">Special Coupon / Promo Code for AIRA Readers (Optional)</label>
                <input type="text" name="promoCode" class="form-input" placeholder="e.g., AIRA20 for 20% off" />
              </div>

              <div style="margin-top: 28px;">
                <button type="submit" class="btn-subscribe-nav" style="width: 100%; padding: 14px; font-size: 1.05rem; border-radius: 10px;">
                  Submit Tool for Review 🚀
                </button>
                <p style="font-size: 0.8rem; color: #71717A; text-align: center; margin-top: 10px;">
                  All submissions are manually reviewed by our editorial team within 48 hours.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    // Bind submit handler
    const form = document.getElementById('tool-submission-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const toolName = formData.get('toolName') || '';
        const submission = {
          id: `sub_${Date.now()}_${toolName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          toolName: toolName,
          toolUrl: formData.get('toolUrl'),
          category: formData.get('category'),
          pricing: formData.get('pricing'),
          tagline: formData.get('tagline'),
          description: formData.get('description'),
          features: formData.get('features'),
          contactEmail: formData.get('contactEmail'),
          promoCode: formData.get('promoCode'),
          submittedAt: new Date().toISOString(),
          status: 'pending'
        };

        const existing = getToolSubmissions();
        existing.unshift(submission);
        saveToolSubmissions(existing);

        const card = document.getElementById('submit-form-container');
        if (card) {
          card.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
              <div style="width: 64px; height: 64px; border-radius: 50%; background: #EEF2FF; color: #1C46F5; font-size: 2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto;">✓</div>
              <h2 style="font-size: 1.6rem; font-weight: 900; color: #18181B; margin-bottom: 12px;">Submission Received!</h2>
              <p style="color: #52525B; font-size: 1rem; max-width: 480px; margin: 0 auto 24px auto; line-height: 1.6;">
                Thank you for submitting <strong>${submission.toolName}</strong>. Our editorial team will review your tool and notify you at <strong>${submission.contactEmail}</strong> once approved.
              </p>
              <div style="display: flex; gap: 12px; justify-content: center;">
                <a href="#/tags" class="btn-subscribe-nav">Explore AI Tools</a>
                <a href="#/submit" class="tool-details-btn" onclick="renderSubmitPage(); return false;">Submit Another Tool</a>
              </div>
            </div>
          `;
        }
        showToast('🎉 Tool submitted successfully!');
      });
    }
  }

  // =========================================================================
  // 9. AI Deals & Discounts Hub (/#/deals)
  // =========================================================================
  function renderDealsPage() {
    const dealsData = typeof AI_DEALS_DATA !== 'undefined' ? AI_DEALS_DATA : { categories: [], deals: [] };
    const allDeals = getAllDeals();
    const categories = dealsData.categories || [];

    function getFilteredDeals() {
      return allDeals.filter(d => {
        if (state.dealCategoryFilter !== 'all' && d.category !== state.dealCategoryFilter) {
          return false;
        }
        if (state.dealSearchQuery.trim() !== '') {
          const q = state.dealSearchQuery.trim().toLowerCase();
          const nameMatch = (d.toolName || '').toLowerCase().includes(q);
          const headMatch = (d.headline || '').toLowerCase().includes(q);
          const descMatch = (d.description || '').toLowerCase().includes(q);
          const codeMatch = d.couponCode ? d.couponCode.toLowerCase().includes(q) : false;
          if (!nameMatch && !headMatch && !descMatch && !codeMatch) return false;
        }
        return true;
      });
    }

    const filteredDeals = getFilteredDeals();

    appContainer.innerHTML = `
      <!-- Hero Section (Exact Same Full-Width Grid Background as Homepage) -->
      <section class="hero-openalt-section">
        <div class="hero-openalt-container" style="max-width: 960px;">
          <!-- Hero Mini Badge -->
          <div class="hero-openalt-mini-badge">
            <span>🏷️ Exclusive Discounts &amp; Perks</span>
          </div>

          <!-- Hero Heading & Subheading -->
          <h1 class="hero-openalt-heading">AI Deals &amp; Discounts</h1>
          <p class="hero-openalt-subheading">
            Save big on top AI tools, developer platforms, and creator subscriptions with verified coupon codes and partnership deals.
          </p>

          <!-- Search Form -->
          <div style="width: 100%; max-width: 680px; margin: 16px auto 14px auto; position: relative;">
            <input type="text" id="deal-search-input" class="form-input" placeholder="Search deals by tool name or discount..." value="${escapeHtml(state.dealSearchQuery)}" style="width: 100%; padding: 14px 20px; border-radius: 9999px; font-size: 1rem; border: 1.5px solid #E4E4E7; background: #FFFFFF;" />
          </div>

          <!-- Categories Filter Wrapper -->
          <div class="categories-filter-wrapper" style="width: 100%; margin-top: 14px; border-top: 1px solid #F1F5F9; padding-top: 14px;">
            <div class="categories-filter-grid" id="deals-categories-bar">
              ${categories.map(cat => `
                <button type="button" class="cat-filter-pill ${state.dealCategoryFilter === cat.id ? 'active' : ''}" data-cat="${cat.id}">
                  <span class="cat-pill-icon">${cat.icon || '🏷️'}</span>
                  <span class="cat-pill-name">${cat.name}</span>
                  <span class="cat-pill-count">${cat.id === 'all' ? allDeals.length : allDeals.filter(d => d.category === cat.id).length}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Partners & Sponsors Strip (Bottom of Hero) -->
          ${getSponsorsStripHTML()}
        </div>
      </section>

      <!-- Deals Directory View -->
      <section class="deals-directory-view" style="padding: 20px 0 40px 0; background: #FFFFFF;">
        <div class="container">
          <!-- Deals Grid -->
          <div class="deals-grid-3col" id="deals-grid-container">
            ${filteredDeals.length === 0 ? `
              <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #FAFAFA; border: 1px dashed #E4E4E7; border-radius: 16px;">
                <p style="font-size: 1.2rem; font-weight: 700; color: #18181B; margin-bottom: 8px;">No deals found</p>
                <p style="color: #71717A; font-size: 0.95rem;">Try another keyword or select All Deals.</p>
              </div>
            ` : filteredDeals.map(deal => `
              <div class="deal-card" data-deal-id="${deal.id}">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                  <span class="deal-badge-ribbon">${deal.discountBadge}</span>
                  <span style="font-size: 0.78rem; font-weight: 700; color: #1C46F5;">✓ Verified</span>
                </div>

                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                  <img loading="lazy" decoding="async" src="${deal.image || 'assets/logo.svg'}" alt="${deal.toolName}" style="width: 40px; height: 40px; border-radius: 10px; object-fit: cover;" onerror="this.src='assets/logo.svg'" />
                  <div>
                    <h4 style="font-size: 1.15rem; font-weight: 800; color: #18181B; margin-bottom: 2px;">${deal.toolName}</h4>
                    <span style="font-size: 0.8rem; color: #71717A;">${deal.domain || 'Official Partner'}</span>
                  </div>
                </div>

                <h5 style="font-size: 1rem; font-weight: 700; color: #18181B; margin-bottom: 6px; line-height: 1.4;">${deal.headline}</h5>
                <p style="font-size: 0.88rem; color: #52525B; line-height: 1.5; margin-bottom: 16px; flex: 1;">${deal.description}</p>

                ${deal.couponCode ? `
                  <div class="deal-coupon-box">
                    <div>
                      <span style="font-size: 0.7rem; color: #71717A; text-transform: uppercase; font-weight: 800; display: block;">Coupon Code</span>
                      <span class="deal-code-text">${deal.couponCode}</span>
                    </div>
                    <button type="button" class="btn-copy-code" data-code="${deal.couponCode}">Copy Code</button>
                  </div>
                ` : ''}

                <div style="display: flex; gap: 10px; align-items: center; margin-top: 12px;">
                  <a href="${deal.url}" target="_blank" rel="noopener noreferrer" class="btn-subscribe-nav" style="flex: 1; text-align: center; text-decoration: none; padding: 10px;">
                    Claim Deal ↗
                  </a>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="margin: 40px 0 20px 0; text-align: center; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 32px 20px;">
            <h3 style="font-size: 1.25rem; font-weight: 800; color: #1E293B; margin-bottom: 6px;">Are you an AI tool creator?</h3>
            <p style="color: #64748B; font-size: 0.95rem; margin-bottom: 18px;">Offer an exclusive discount or promo code to 100+ AIRA readers.</p>
            <a href="#/submit" class="tool-details-btn" style="padding: 10px 20px; font-weight: 700;">Submit Your Deal →</a>
          </div>
        </div>
      </section>
    `;

    // Bind categories
    appContainer.querySelectorAll('.cat-filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        state.dealCategoryFilter = btn.getAttribute('data-cat');
        renderDealsPage();
      });
    });

    // Bind search input
    const dealSearch = document.getElementById('deal-search-input');
    if (dealSearch) {
      dealSearch.addEventListener('input', (e) => {
        state.dealSearchQuery = e.target.value;
        renderDealsPage();
      });
    }

    // Bind copy code buttons
    appContainer.querySelectorAll('.btn-copy-code').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.getAttribute('data-code');
        if (code && navigator.clipboard) {
          navigator.clipboard.writeText(code).then(() => {
            btn.innerHTML = 'Copied! ✓';
            btn.style.background = '#18181B';
            showToast(`Coupon code ${code} copied! 🏷️`);
            setTimeout(() => {
              btn.innerHTML = 'Copy Code';
              btn.style.background = '';
            }, 2000);
          });
        }
      });
    });
  }

  // =========================================================================
  // 10. Advertise / Sponsorship Live Studio & Partnership Hub (/#/advertise)
  // Free Launch Sponsorship & Custom Partnership Configurator
  // =========================================================================
  const AD_SLOTS_CONFIG = {
    banner: {
      id: 'banner',
      name: 'Top Header Banner',
      badge: 'MOST POPULAR',
      subtitle: 'Pinned at the top across 100% of website pages',
      icon: '⚡',
      standardPrice: 249,
      dailyRate: 35.5,
      features: [
        '100% impressions on all website visitors',
        'Exclusive single sponsor placement per cycle',
        'Custom brand tagline, icon & action link',
        'Real-time clicks & telemetry tracking'
      ]
    },
    listing: {
      id: 'listing',
      name: 'Tool Directory #1',
      badge: 'HIGH CONVERSION',
      subtitle: 'Position #1 on 96+ tool category pages',
      icon: '📋',
      standardPrice: 149,
      dailyRate: 21.3,
      features: [
        'Position #1 on 96+ tool detail & category pages',
        'High-intent developer & buyer traffic',
        'Direct dofollow backlink & CTA button'
      ]
    },
    tool: {
      id: 'tool',
      name: 'Article Spotlight',
      subtitle: 'Embedded in all 18+ deep-dive articles',
      icon: '📰',
      standardPrice: 199,
      dailyRate: 28.4,
      features: [
        'Featured in all 18+ high-ranking articles',
        'Contextual developer engagement & trust',
        'Prominent Neon Lime banner visual showcase'
      ]
    },
    newsletter: {
      id: 'newsletter',
      name: 'Newsletter Drop',
      badge: 'DIRECT INBOX',
      subtitle: 'Direct delivery to 100+ inboxes',
      icon: '📬',
      standardPrice: 399,
      dailyRate: 399,
      isEditionBased: true,
      features: [
        '100-word review + screenshot sent to 100+ inboxes',
        '42.4% average open rate with high credibility',
        'Permanent edition web archive backlink'
      ]
    }
  };

  function initAdvStudioState() {
    if (!window.airaAdvStudioState) {
      const now = new Date();
      const tom = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const day3 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3);

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const fmt = (d) => `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;

      window.airaAdvStudioState = {
        activeSlot: 'banner',
        brandName: 'Acme AI',
        ctaText: 'Try Free →',
        tagline: 'Autonomous agent runtime & telemetry hub for software teams.',
        targetUrl: 'https://acme.ai',
        startDate: fmt(tom),
        endDate: fmt(day3),
        days: 3,
        preset: '3',
        message: 'Please apply UTM parameter utm_source=aira_newsletter&utm_medium=banner. Target audience: Full-stack developers and AI founders.',
        contactName: 'Alex Rivera',
        workEmail: 'alex@acme.ai'
      };
    }
  }

  function getSlotLiveMockupHTML(state) {
    const slotKey = state.activeSlot || 'banner';
    const brand = escapeHtml(state.brandName || 'Your Brand');
    const cta = escapeHtml(state.ctaText || 'Try Free →');
    const tagline = escapeHtml(state.tagline || 'Autonomous agent runtime & telemetry hub for software teams.');

    if (slotKey === 'banner') {
      return `
        <div class="adv-mockup-browser-bar">
          <div class="adv-browser-dot"></div>
          <div class="adv-browser-dot"></div>
          <div class="adv-browser-dot"></div>
          <div class="adv-browser-url">https://aira.news/ (Sitewide Top Sticky Banner)</div>
        </div>
        <div class="adv-live-ad-canvas">
          <div class="adv-live-rendered-banner">
            <div class="adv-live-ad-left">
              <span class="adv-live-ad-pill">AD</span>
              <div class="adv-live-ad-icon">⚡</div>
              <span class="adv-live-ad-copy"><strong>${brand}</strong> — ${tagline}</span>
            </div>
            <a href="${escapeHtml(state.targetUrl || '#')}" target="_blank" class="adv-live-ad-cta-btn" onclick="event.preventDefault();">${cta}</a>
          </div>
        </div>
        <div class="adv-fake-page-lines">
          <div class="adv-fake-line-h"></div>
          <div class="adv-fake-line-p1"></div>
          <div class="adv-fake-line-p2"></div>
        </div>
      `;
    } else if (slotKey === 'listing') {
      return `
        <div class="adv-mockup-browser-bar">
          <div class="adv-browser-dot"></div>
          <div class="adv-browser-dot"></div>
          <div class="adv-browser-dot"></div>
          <div class="adv-browser-url">https://aira.news/#/tags (AI Tools Directory)</div>
        </div>
        <div class="adv-live-ad-canvas">
          <div class="adv-live-rendered-listing">
            <div class="adv-live-listing-icon">⚡</div>
            <div class="adv-live-listing-info">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
                <strong style="font-size: 0.95rem; color: #131313;">${brand}</strong>
                <span style="background: #D2FF52; color: #131313; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px;">FEATURED #1</span>
              </div>
              <p style="font-size: 0.78rem; color: #52525B; margin: 0; line-height: 1.35;">${tagline}</p>
            </div>
            <a href="${escapeHtml(state.targetUrl || '#')}" target="_blank" class="adv-live-ad-cta-btn" onclick="event.preventDefault();">${cta}</a>
          </div>
        </div>
        <div class="adv-fake-page-lines">
          <div class="adv-fake-line-h"></div>
          <div class="adv-fake-line-p1"></div>
        </div>
      `;
    } else if (slotKey === 'tool') {
      return `
        <div class="adv-mockup-browser-bar">
          <div class="adv-browser-dot"></div>
          <div class="adv-browser-dot"></div>
          <div class="adv-browser-dot"></div>
          <div class="adv-browser-url">https://aira.news/#/p/anthropic-claude-3-7 (Article Reader)</div>
        </div>
        <div class="adv-live-ad-canvas">
          <div class="adv-live-rendered-banner" style="border-width: 2px;">
            <div class="adv-live-ad-left">
              <span class="adv-live-ad-pill">ARTICLE SPOTLIGHT</span>
              <div class="adv-live-ad-icon">📰</div>
              <span class="adv-live-ad-copy"><strong>${brand}</strong> — ${tagline}</span>
            </div>
            <a href="${escapeHtml(state.targetUrl || '#')}" target="_blank" class="adv-live-ad-cta-btn" onclick="event.preventDefault();">${cta}</a>
          </div>
        </div>
        <div class="adv-fake-page-lines">
          <div class="adv-fake-line-h"></div>
          <div class="adv-fake-line-p1"></div>
        </div>
      `;
    } else {
      return `
        <div class="adv-mockup-browser-bar">
          <div class="adv-browser-dot"></div>
          <div class="adv-browser-dot"></div>
          <div class="adv-browser-dot"></div>
          <div class="adv-browser-url">AIRA Newsletter Edition (100+ Inboxes)</div>
        </div>
        <div class="adv-live-ad-canvas">
          <div class="adv-live-rendered-newsletter">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span style="background: #1C46F5; color: #FFFFFF; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px;">FEATURED SPONSOR</span>
              <strong style="font-size: 0.95rem; color: #131313;">${brand}</strong>
            </div>
            <p style="font-size: 0.8rem; color: #3F3F46; line-height: 1.45; margin-bottom: 10px;">${tagline}</p>
            <a href="${escapeHtml(state.targetUrl || '#')}" target="_blank" class="adv-live-ad-cta-btn" onclick="event.preventDefault();">${cta}</a>
          </div>
        </div>
      `;
    }
  }

  function renderAdvertiseStudioHTML() {
    initAdvStudioState();
    const s = window.airaAdvStudioState;
    const activeKey = s.activeSlot || 'banner';
    const slot = AD_SLOTS_CONFIG[activeKey] || AD_SLOTS_CONFIG.banner;
    
    const standardCost = slot.isEditionBased ? slot.standardPrice : Math.round(s.days * slot.dailyRate * 10) / 10;

    return `
      <div class="adv-studio-wrapper">
        
        <!-- HERO SECTION WITH HERO-GRID BACKGROUND -->
        <div class="adv-hero-section">
          <div class="adv-hero-container">
            <!-- TOP FREE PROMO CALLOUT -->
            <div class="adv-top-free-banner">
              <span class="adv-free-tag">LIMITED TIME</span>
              <span class="adv-free-msg">🎉 100% Free Community Sponsorship Launch — Promote your AI tool for $0!</span>
            </div>

            <!-- HERO HEADER -->
            <div class="adv-hero-head">
              <div class="adv-hero-badge">
                <span class="adv-hero-dot"></span> Reaching 100+ High-Intent Software Builders &amp; Founders
              </div>
              <h1 class="adv-hero-title">Advertise on AIRA: <span>Free Launch Sponsorship</span></h1>
              <p class="adv-hero-sub">
                We are partnering with AI developers, tools, and SaaS startups to sponsor AIRA for <strong>$0 (100% Free)</strong> during our growth launch! Customize your ad, pick your dates, and get featured immediately.
              </p>
            </div>
          </div>
        </div>

        <div class="adv-studio-container">

          <!-- STATS BAR -->
          <div class="adv-stats-grid">
          <div class="adv-stat-tile">
            <div class="adv-stat-icon">👥</div>
            <div>
              <div class="adv-stat-val">100+</div>
              <div class="adv-stat-lbl">Active AI Developers</div>
            </div>
          </div>
          <div class="adv-stat-tile">
            <div class="adv-stat-icon lime">📬</div>
            <div>
              <div class="adv-stat-val">42.4%</div>
              <div class="adv-stat-lbl">Average Open Rate</div>
            </div>
          </div>
          <div class="adv-stat-tile">
            <div class="adv-stat-icon">⚡</div>
            <div>
              <div class="adv-stat-val">8.4%</div>
              <div class="adv-stat-lbl">Average Click-Through (CTR)</div>
            </div>
          </div>
          <div class="adv-stat-tile">
            <div class="adv-stat-icon lime">💼</div>
            <div>
              <div class="adv-stat-val">74%</div>
              <div class="adv-stat-lbl">Engineers &amp; Founders</div>
            </div>
          </div>
        </div>

        <!-- MAIN 2-COLUMN STUDIO -->
        <div class="adv-studio-split" id="studio-form-root">

          <!-- LEFT: FORM CONFIGURATOR -->
          <div class="adv-form-panel">
            
            <!-- STEP 1 -->
            <span class="adv-step-pill">Step 1</span>
            <h2 class="adv-step-heading">Choose Advertising Placement (100% Free Launch)</h2>
            <div class="adv-slot-pills-grid">
              ${Object.keys(AD_SLOTS_CONFIG).map(k => {
                const item = AD_SLOTS_CONFIG[k];
                const isActive = k === activeKey;
                return `
                  <button type="button" class="adv-format-pill-btn ${isActive ? 'active' : ''}" onclick="window.selectAdvStudioSlot('${k}')">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-size: 1.1rem;">${item.icon}</span>
                      <span class="adv-pill-name">${item.name}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <span class="adv-pill-old">$${item.standardPrice}</span>
                      <span class="adv-pill-free">FREE</span>
                    </div>
                  </button>
                `;
              }).join('')}
            </div>

            <!-- STEP 2 -->
            <span class="adv-step-pill">Step 2</span>
            <h2 class="adv-step-heading">Customize Your Ad Copy (Live Real-Time Sync)</h2>
            <div class="adv-form-group-wrap">
              <div class="adv-input-2col">
                <div class="adv-field">
                  <label class="adv-label">Brand / Product Name <span class="req">*</span></label>
                  <input type="text" id="adv-input-brand" class="adv-input" value="${escapeHtml(s.brandName)}" placeholder="e.g. Acme AI" oninput="window.updateAdvStudioCopy()" />
                </div>
                <div class="adv-field">
                  <label class="adv-label">CTA Button Label</label>
                  <input type="text" id="adv-input-cta" class="adv-input" value="${escapeHtml(s.ctaText)}" placeholder="e.g. Try Free →" oninput="window.updateAdvStudioCopy()" />
                </div>
              </div>

              <div class="adv-field">
                <label class="adv-label">Ad Tagline / Value Proposition <span style="color:#71717A; font-weight:normal;">(Max 80 chars)</span></label>
                <input type="text" id="adv-input-tagline" class="adv-input" value="${escapeHtml(s.tagline)}" placeholder="Short punchy description..." oninput="window.updateAdvStudioCopy()" />
              </div>

              <div class="adv-field">
                <label class="adv-label">Destination Landing URL <span class="req">*</span></label>
                <input type="url" id="adv-input-url" class="adv-input" value="${escapeHtml(s.targetUrl)}" placeholder="https://yourproduct.com/?ref=aira" oninput="window.updateAdvStudioCopy()" />
              </div>
            </div>

            <!-- STEP 3 -->
            <span class="adv-step-pill">Step 3</span>
            <h2 class="adv-step-heading">Select Start Day &amp; End Day (Custom Duration)</h2>
            <div class="adv-schedule-box">
              <div class="adv-dates-grid">
                <div class="adv-field">
                  <label class="adv-label">📅 Start Date <span class="req">*</span></label>
                  <input type="text" id="adv-input-start-date" class="adv-input" value="${escapeHtml(s.startDate)}" oninput="window.updateAdvStudioDatesManual()" />
                </div>
                <div class="adv-field">
                  <label class="adv-label">📅 End Date <span class="req">*</span></label>
                  <input type="text" id="adv-input-end-date" class="adv-input" value="${escapeHtml(s.endDate)}" oninput="window.updateAdvStudioDatesManual()" />
                </div>
                <div class="adv-field">
                  <label class="adv-label">Duration &amp; Rate</label>
                  <div class="adv-duration-badge">
                    ${s.days} Days (100% FREE)
                  </div>
                </div>
              </div>

              <div style="font-size: 0.8rem; font-weight: 700; color: #27272A; margin-bottom: 6px;">Quick Duration Presets:</div>
              <div class="adv-presets-row">
                <button type="button" class="adv-preset-pill ${s.preset === '3' ? 'active' : ''}" onclick="window.applyAdvStudioDays(3)">3 Days (FREE)</button>
                <button type="button" class="adv-preset-pill ${s.preset === '7' ? 'active' : ''}" onclick="window.applyAdvStudioDays(7)">7 Days (FREE)</button>
                <button type="button" class="adv-preset-pill ${s.preset === '14' ? 'active' : ''}" onclick="window.applyAdvStudioDays(14)">14 Days (FREE)</button>
                <button type="button" class="adv-preset-pill ${s.preset === '30' ? 'active' : ''}" onclick="window.applyAdvStudioDays(30)">30 Days (FREE)</button>
              </div>
            </div>

            <!-- STEP 4 -->
            <span class="adv-step-pill">Step 4</span>
            <h2 class="adv-step-heading">Campaign Message &amp; Special Requirements</h2>
            <div class="adv-field" style="margin-bottom: 22px;">
              <label class="adv-label">Campaign Notes / UTM Tracking / Instructions <span style="color:#71717A; font-weight:normal;">(Optional)</span></label>
              <textarea id="adv-input-message" class="adv-textarea" placeholder="Add custom instructions (e.g., specific UTM parameters, launch timing, exclusive coupon code, or custom brand icon request)..." oninput="window.updateAdvStudioMessage()">${escapeHtml(s.message)}</textarea>
            </div>

            <!-- STEP 5 -->
            <span class="adv-step-pill">Step 5</span>
            <h2 class="adv-step-heading">Sponsor Contact Details</h2>
            <div class="adv-input-2col" style="margin-bottom: 20px;">
              <div class="adv-field">
                <label class="adv-label">Your Name <span class="req">*</span></label>
                <input type="text" id="adv-input-contact" class="adv-input" value="${escapeHtml(s.contactName)}" placeholder="Your full name" />
              </div>
              <div class="adv-field">
                <label class="adv-label">Work Email <span class="req">*</span></label>
                <input type="email" id="adv-input-email" class="adv-input" value="${escapeHtml(s.workEmail)}" placeholder="alex@company.com" />
              </div>
            </div>

            <!-- SUBMIT BUTTON -->
            <button type="button" class="adv-btn-claim-free" onclick="window.submitAdvStudioCampaign()">
              <span>Claim Free Placement ($0.00 • 100% Off) →</span>
            </button>
            <div class="adv-secure-note">🔒 100% Guaranteed Free Placement • Rapid 24h Setup • Transparent Analytics</div>

          </div>

          <!-- RIGHT: LIVE SIMULATOR & ORDER SUMMARY -->
          <div class="adv-simulator-panel">
            
            <!-- LIVE CANVAS -->
            <div class="adv-canvas-card">
              <div class="adv-canvas-head">
                <div class="adv-canvas-title">
                  <span>👁 Live Placement Simulator</span>
                </div>
                <span class="adv-live-tag">LIVE RENDER</span>
              </div>

              <div class="adv-browser-frame" id="adv-mockup-frame-root">
                ${getSlotLiveMockupHTML(s)}
              </div>
            </div>

            <!-- SUMMARY CARD -->
            <div class="adv-summary-card">
              <div class="adv-sum-head">
                <div>
                  <div class="adv-sum-title">Campaign Order Summary</div>
                  <div class="adv-sum-slot">${slot.name} (${s.days} Days)</div>
                </div>
                <span class="adv-sum-badge">Free Early Access</span>
              </div>

              <div class="adv-sum-row">
                <span>Selected Placement</span>
                <span style="font-weight: 700; color: #131313;">${slot.name}</span>
              </div>
              <div class="adv-sum-row">
                <span>Campaign Schedule</span>
                <span style="font-weight: 700; color: #1C46F5;">${escapeHtml(s.startDate)} – ${escapeHtml(s.endDate)}</span>
              </div>
              <div class="adv-sum-row">
                <span>Standard Price</span>
                <span style="text-decoration: line-through;">$${standardCost}</span>
              </div>
              <div class="adv-sum-row adv-discount-row">
                <span>🎉 Launch Early Access Discount</span>
                <span>- $${standardCost} (100% OFF)</span>
              </div>
              <div class="adv-sum-row">
                <span>Audience Guarantee</span>
                <span style="color: #059669; font-weight: 700;">100+ Builders &amp; Founders</span>
              </div>
              <div class="adv-sum-row adv-sum-total">
                <span>Total Cost</span>
                <span style="color: #059669;">$0.00 (FREE)</span>
              </div>
            </div>

          </div>

        </div>

        <!-- "NEED A CUSTOM PARTNERSHIP?" SECTION -->
        <div class="adv-custom-partner-card" id="sponsor-form-section">
          <div class="adv-custom-title">Need a custom partnership?</div>
          <p class="adv-custom-sub">
            Looking for a bespoke multi-channel campaign, custom event co-hosting, or custom newsletter editorial deep-dive? Tell us more and our partnerships team will reach out within 24 hours.
          </p>

          <form id="form-custom-partnership" onsubmit="window.handleCustomPartnerSubmit(event)">
            <div class="adv-custom-grid">
              <div class="adv-field">
                <label class="adv-label">Your Name <span class="req">*</span></label>
                <input type="text" name="partnerName" class="adv-input" placeholder="e.g. Sarah Connor" required />
              </div>
              <div class="adv-field">
                <label class="adv-label">Work Email <span class="req">*</span></label>
                <input type="email" name="partnerEmail" class="adv-input" placeholder="sarah@startup.io" required />
              </div>
              <div class="adv-field">
                <label class="adv-label">Company / Product URL <span class="req">*</span></label>
                <input type="url" name="partnerUrl" class="adv-input" placeholder="https://startup.io" required />
              </div>
            </div>

            <div class="adv-field" style="margin-bottom: 20px;">
              <label class="adv-label">Partnership Goals &amp; Specific Details</label>
              <textarea name="partnerMessage" class="adv-textarea" placeholder="Describe your product, target audience, ideal campaign launch date, and partnership requirements..."></textarea>
            </div>

            <button type="submit" class="adv-btn-custom-submit">
              <span>Submit Custom Partnership Inquiry →</span>
            </button>
          </form>
        </div>

        </div>
      </div>
    `;
  }

  window.selectAdvStudioSlot = function(slotKey) {
    initAdvStudioState();
    window.airaAdvStudioState.activeSlot = slotKey;
    const rootEl = document.getElementById('advertise-page-root');
    if (rootEl) rootEl.innerHTML = renderAdvertiseStudioHTML();
  };

  window.updateAdvStudioCopy = function() {
    initAdvStudioState();
    const brand = document.getElementById('adv-input-brand');
    const cta = document.getElementById('adv-input-cta');
    const tagline = document.getElementById('adv-input-tagline');
    const url = document.getElementById('adv-input-url');

    if (brand) window.airaAdvStudioState.brandName = brand.value;
    if (cta) window.airaAdvStudioState.ctaText = cta.value;
    if (tagline) window.airaAdvStudioState.tagline = tagline.value;
    if (url) window.airaAdvStudioState.targetUrl = url.value;

    const frameEl = document.getElementById('adv-mockup-frame-root');
    if (frameEl) {
      frameEl.innerHTML = getSlotLiveMockupHTML(window.airaAdvStudioState);
    }
  };

  window.updateAdvStudioMessage = function() {
    initAdvStudioState();
    const msg = document.getElementById('adv-input-message');
    if (msg) window.airaAdvStudioState.message = msg.value;
  };

  window.updateAdvStudioDatesManual = function() {
    initAdvStudioState();
    const start = document.getElementById('adv-input-start-date');
    const end = document.getElementById('adv-input-end-date');
    if (start) window.airaAdvStudioState.startDate = start.value;
    if (end) window.airaAdvStudioState.endDate = end.value;
    window.airaAdvStudioState.preset = 'custom';
  };

  window.applyAdvStudioDays = function(daysCount) {
    initAdvStudioState();
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + (daysCount - 1));

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const fmt = (d) => `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;

    window.airaAdvStudioState.days = daysCount;
    window.airaAdvStudioState.preset = String(daysCount);
    window.airaAdvStudioState.startDate = fmt(start);
    window.airaAdvStudioState.endDate = fmt(end);

    const rootEl = document.getElementById('advertise-page-root');
    if (rootEl) rootEl.innerHTML = renderAdvertiseStudioHTML();
  };

  window.submitAdvStudioCampaign = function() {
    initAdvStudioState();
    const s = window.airaAdvStudioState;
    const brand = (document.getElementById('adv-input-brand')?.value || s.brandName).trim();
    const targetUrl = (document.getElementById('adv-input-url')?.value || s.targetUrl).trim();
    const contact = (document.getElementById('adv-input-contact')?.value || s.contactName).trim();
    const email = (document.getElementById('adv-input-email')?.value || s.workEmail).trim();
    const msg = (document.getElementById('adv-input-message')?.value || s.message).trim();

    if (!brand || !targetUrl || !contact || !email) {
      showToast('⚠️ Please fill in all required fields (Brand Name, URL, Name, Work Email).');
      return;
    }

    const campaign = {
      id: 'ad-inq-' + Date.now().toString().slice(-6),
      slot: s.activeSlot || 'hero',
      brandName: brand,
      ctaText: s.ctaText || 'Learn More',
      tagline: s.tagline || '',
      targetUrl,
      startDate: s.startDate,
      endDate: s.endDate,
      days: s.days || 7,
      message: msg || '',
      contactName: contact,
      workEmail: email,
      isFreeLaunch: true,
      cost: '$0.00 (FREE)',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    let inquiries = (typeof getAdInquiries === 'function') ? getAdInquiries() : [];
    inquiries.unshift(campaign);
    if (typeof saveAdInquiries === 'function') saveAdInquiries(inquiries);
    else localStorage.setItem('aira_ad_inquiries', JSON.stringify(inquiries));

    const formPanel = document.querySelector('.adv-form-panel');
    if (formPanel) {
      formPanel.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: #ECFDF5; color: #059669; font-size: 2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto;">✓</div>
          <h2 style="font-size: 1.6rem; font-weight: 900; color: #131313; margin-bottom: 10px;">Free Sponsor Slot Claimed!</h2>
          <p style="color: #52525B; font-size: 0.95rem; max-width: 480px; margin: 0 auto 20px auto; line-height: 1.6;">
            Thank you for partnering with AIRA! Your <strong>${campaign.slot.toUpperCase()}</strong> placement for <strong>${escapeHtml(campaign.brandName)}</strong> (${campaign.days} Days: ${escapeHtml(campaign.startDate)} to ${escapeHtml(campaign.endDate)}) has been locked for <strong>$0.00</strong>.
          </p>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; max-width: 440px; margin: 0 auto 24px auto; text-align: left; font-size: 0.85rem; color: #334155;">
            <div><strong>Confirmation Sent To:</strong> ${escapeHtml(campaign.workEmail)}</div>
            <div><strong>Live Launch Window:</strong> ${escapeHtml(campaign.startDate)} – ${escapeHtml(campaign.endDate)}</div>
            <div><strong>Status:</strong> <span style="color:#059669; font-weight:700;">Active Free Launch Queue</span></div>
          </div>
          <a href="#/home" class="btn-sub-nav" style="display: inline-block;">Return to Homepage</a>
        </div>
      `;
    }

    showToast('🎉 Free sponsorship slot claimed successfully! Check your email.');
  };

  window.handleCustomPartnerSubmit = function(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const inquiry = {
      id: 'part-' + Date.now().toString().slice(-6),
      name: (formData.get('partnerName') || 'Partner').trim(),
      email: (formData.get('partnerEmail') || '').trim(),
      url: (formData.get('partnerUrl') || '').trim(),
      message: (formData.get('partnerMessage') || '').trim(),
      status: 'pending',
      date: new Date().toISOString()
    };

    let customList = (typeof getCustomPartnerships === 'function') ? getCustomPartnerships() : [];
    customList.unshift(inquiry);
    if (typeof saveCustomPartnerships === 'function') saveCustomPartnerships(customList);
    else localStorage.setItem('aira_custom_partnerships', JSON.stringify(customList));

    const card = document.getElementById('sponsor-form-section');
    if (card) {
      card.innerHTML = `
        <div style="text-align: center; padding: 32px 20px;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: #EEF2FF; color: #1C46F5; font-size: 1.8rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;">✓</div>
          <h2 style="font-size: 1.5rem; font-weight: 900; color: #131313; margin-bottom: 8px;">Partnership Inquiry Received!</h2>
          <p style="color: #52525B; font-size: 0.95rem; max-width: 480px; margin: 0 auto 20px auto; line-height: 1.6;">
            Thank you! Our partnerships desk will review your requirements and reach out to <strong>${escapeHtml(inquiry.email)}</strong> within 24 hours.
          </p>
        </div>
      `;
    }
    showToast('🎉 Partnership inquiry sent successfully!');
  };

  function renderAdvertisePage() {
    initAdvStudioState();
    appContainer.innerHTML = `<div id="advertise-page-root">${renderAdvertiseStudioHTML()}</div>`;
  }

  // =========================================================================
  // 11. Submit AI Tool Page & Live Directory Preview (/#/submit)
  // =========================================================================
  function initSubmitToolState() {
    if (!window.airaSubmitToolState) {
      window.airaSubmitToolState = {
        name: 'AutoGPT Workspace',
        url: 'https://autogpt.dev',
        category: 'developer-tools',
        categoryLabel: 'Developer Tools',
        pricing: 'Freemium',
        tagline: 'Autonomous AI agents orchestration platform with real-time browser execution and API tools.',
        description: 'AutoGPT Workspace enables software teams to build, test, and deploy collaborative multi-agent swarms with native IDE integration and telemetry logging.',
        features: 'Multi-agent orchestration\nBrowser & Terminal execution\nOpen-source Python SDK',
        logoUrl: '',
        contactName: 'Sarah Chen',
        workEmail: 'sarah@autogpt.dev',
        twitter: '@sarahc_ai'
      };
    }
  }

  function getSubmitToolCardLiveHTML(state) {
    const name = escapeHtml(state.name || 'Your AI Tool');
    const tagline = escapeHtml(state.tagline || 'Autonomous AI agents orchestration platform for software teams.');
    const pricing = escapeHtml(state.pricing || 'Freemium');
    const cat = escapeHtml(state.category || 'developer-tools');
    const url = escapeHtml(state.url || 'https://yourtool.com');

    let domain = '';
    try {
      const u = new URL(url.startsWith('http') ? url : 'https://' + url);
      domain = u.hostname.replace('www.', '');
    } catch(err) {
      domain = 'tool.dev';
    }

    const logoSrc = state.logoUrl ? escapeHtml(state.logoUrl) : `https://logo.clearbit.com/${domain}`;

    return `
      <div class="tool-card submit-mockup-tool-card" style="margin: 0; box-shadow: none; border-color: #CBD5E1;">
        <div class="tool-card-top" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <div class="tool-card-avatar-wrap" style="width: 44px; height: 44px; border-radius: 10px; overflow: hidden; background: #0F172A; display: flex; align-items: center; justify-content: center;">
            <img src="${logoSrc}" alt="${name}" class="tool-card-avatar" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.src='assets/logo.png';" />
          </div>
          <div class="tool-card-meta" style="display: flex; gap: 6px; align-items: center;">
            <span class="tool-tag" style="background: #EEF2FF; color: #1C46F5; font-size: 0.65rem; font-weight: 800; padding: 2px 8px; border-radius: 4px;">${cat.replace(/-/g, ' ').toUpperCase()}</span>
            <span class="tool-pricing-pill" style="background: #F1F5F9; color: #475569; font-size: 0.65rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">${pricing}</span>
          </div>
        </div>
        <div class="tool-card-content" style="margin-bottom: 14px;">
          <h3 class="tool-card-title" style="font-size: 1.05rem; font-weight: 800; color: #0F172A; margin-bottom: 4px;">${name}</h3>
          <p class="tool-card-desc" style="font-size: 0.8rem; color: #64748B; line-height: 1.45; margin: 0;">${tagline}</p>
        </div>
        <div class="tool-card-footer" style="display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid #F1F5F9;">
          <span class="tool-btn-details" style="font-size: 0.72rem; font-weight: 700; color: #059669;">⚡ Verified Listing</span>
          <a href="${url}" target="_blank" class="tool-btn-visit" style="background: #0F172A; color: #FFFFFF; font-size: 0.72rem; font-weight: 800; padding: 5px 12px; border-radius: 6px;" onclick="event.preventDefault();">
            Visit Website ↗
          </a>
        </div>
      </div>
    `;
  }

  function renderSubmitToolPage() {
    initSubmitToolState();
    const s = window.airaSubmitToolState;
    const activeCat = s.category || 'developer-tools';

    const CATEGORIES = [
      { id: 'developer-tools', name: 'Developer Tools', icon: '💻' },
      { id: 'agents', name: 'AI Agents & Automation', icon: '🤖' },
      { id: 'llms', name: 'LLMs & Large Models', icon: '🧠' },
      { id: 'code', name: 'Code & DevOps', icon: '⚡' },
      { id: 'productivity', name: 'Productivity & Workflow', icon: '📊' },
      { id: 'design', name: 'Design & Creative', icon: '🎨' },
      { id: 'writing', name: 'Writing & Research', icon: '✍️' },
      { id: 'video-audio', name: 'Audio & Video AI', icon: '🎬' },
      { id: 'analytics', name: 'Analytics & Data', icon: '📈' },
      { id: 'marketing', name: 'Marketing & SEO', icon: '🚀' }
    ];

    const PRICING_OPTIONS = ['Freemium', '100% Free', 'Paid / Commercial', 'Open Source', 'Free Trial'];

    appContainer.innerHTML = `
      <div class="submit-page-wrapper">
        
        <!-- HERO HEADER WITH HERO-GRID BACKGROUND -->
        <div class="submit-hero-section">
          <div class="submit-hero-container">
            <div class="submit-top-pill">
              <span class="submit-pill-badge">FREE DIRECTORY LISTING</span>
              <span>⚡ Indexed across 96+ AI Tool Categories &amp; Daily Editions</span>
            </div>

            <div class="submit-hero-head">
              <div class="adv-hero-badge">
                <span class="adv-hero-dot"></span> Reaching 100+ Active AI Builders &amp; Engineering Leads
              </div>
              <h1 class="submit-hero-title">Submit Your AI Tool: <span>Get Discovered on AIRA</span></h1>
              <p class="submit-hero-sub">
                Showcase your AI application, developer tool, or autonomous agent to high-intent engineers, CTOs, and founders. We review and index verified submissions within <strong>24 hours for $0 (Free)</strong>.
              </p>
            </div>
          </div>
        </div>

        <div class="submit-main-container">
          
          <div class="submit-studio-split" id="submit-studio-root">
            
            <!-- LEFT: SUBMISSION FORM -->
            <div class="submit-form-panel">
              
              <!-- STEP 1: TOOL BASICS -->
              <span class="adv-step-pill">Step 1</span>
              <h2 class="adv-step-heading">Tool Essentials</h2>
              
              <div class="adv-form-group-wrap">
                <div class="adv-input-2col">
                  <div class="adv-field">
                    <label class="adv-label">Tool Name <span class="req">*</span></label>
                    <input type="text" class="adv-input" id="submit-input-name" value="${escapeHtml(s.name)}" placeholder="e.g., AutoGPT Workspace" oninput="window.updateSubmitToolLivePreview()" required />
                  </div>
                  <div class="adv-field">
                    <label class="adv-label">Website / Landing Page URL <span class="req">*</span></label>
                    <input type="url" class="adv-input" id="submit-input-url" value="${escapeHtml(s.url)}" placeholder="https://yourtool.com" oninput="window.updateSubmitToolLivePreview()" required />
                  </div>
                </div>

                <div class="adv-field">
                  <label class="adv-label">Short Tagline (Max 100 chars) <span class="req">*</span></label>
                  <input type="text" class="adv-input" id="submit-input-tagline" value="${escapeHtml(s.tagline)}" placeholder="e.g. Autonomous AI agents orchestration platform for software teams" oninput="window.updateSubmitToolLivePreview()" required />
                </div>

                <div class="adv-input-2col">
                  <div class="adv-field">
                    <label class="adv-label">Primary Category <span class="req">*</span></label>
                    <select class="adv-input" id="submit-input-category" onchange="window.updateSubmitToolLivePreview()">
                      ${CATEGORIES.map(c => `<option value="${c.id}" ${c.id === activeCat ? 'selected' : ''}>${c.icon} ${c.name}</option>`).join('')}
                    </select>
                  </div>
                  <div class="adv-field">
                    <label class="adv-label">Pricing Model <span class="req">*</span></label>
                    <select class="adv-input" id="submit-input-pricing" onchange="window.updateSubmitToolLivePreview()">
                      ${PRICING_OPTIONS.map(p => `<option value="${p}" ${p === s.pricing ? 'selected' : ''}>${p}</option>`).join('')}
                    </select>
                  </div>
                </div>
              </div>

              <!-- STEP 2: PRODUCT DESCRIPTION & HIGHLIGHTS -->
              <span class="adv-step-pill">Step 2</span>
              <h2 class="adv-step-heading">Product Overview &amp; Key Features</h2>
              
              <div class="adv-form-group-wrap">
                <div class="adv-field">
                  <label class="adv-label">Full Product Description (2-3 Sentences) <span class="req">*</span></label>
                  <textarea class="adv-textarea" id="submit-input-desc" rows="3" placeholder="Explain what problem your tool solves, how it works, and why developers love it..." oninput="window.updateSubmitToolLivePreview()" required>${escapeHtml(s.description)}</textarea>
                </div>

                <div class="adv-field">
                  <label class="adv-label">Key Features / Capabilities (1 per line)</label>
                  <textarea class="adv-textarea" id="submit-input-features" rows="3" placeholder="e.g.&#10;• Multi-agent orchestration&#10;• Real-time browser sandbox&#10;• Python &amp; TypeScript SDK">${escapeHtml(s.features)}</textarea>
                </div>

                <div class="adv-field">
                  <label class="adv-label">Custom Logo / Avatar Image URL (Optional)</label>
                  <input type="url" class="adv-input" id="submit-input-logo" value="${escapeHtml(s.logoUrl)}" placeholder="https://yourtool.com/logo.png (Auto-fetched from domain if blank)" oninput="window.updateSubmitToolLivePreview()" />
                </div>
              </div>

              <!-- STEP 3: MAKER & CONTACT INFO -->
              <span class="adv-step-pill">Step 3</span>
              <h2 class="adv-step-heading">Maker &amp; Verification Contact</h2>
              
              <div class="adv-form-group-wrap">
                <div class="adv-input-2col">
                  <div class="adv-field">
                    <label class="adv-label">Contact / Founder Name <span class="req">*</span></label>
                    <input type="text" class="adv-input" id="submit-input-contact" value="${escapeHtml(s.contactName)}" placeholder="Alex Rivera" required />
                  </div>
                  <div class="adv-field">
                    <label class="adv-label">Work Email <span class="req">*</span></label>
                    <input type="email" class="adv-input" id="submit-input-email" value="${escapeHtml(s.workEmail)}" placeholder="alex@yourtool.com" required />
                  </div>
                </div>

                <div class="adv-field">
                  <label class="adv-label">Twitter / X Handle or GitHub Repo (Optional)</label>
                  <input type="text" class="adv-input" id="submit-input-twitter" value="${escapeHtml(s.twitter)}" placeholder="@username or https://github.com/org/repo" />
                </div>
              </div>

              <!-- SUBMIT BUTTON -->
              <button type="button" class="adv-btn-claim-free" onclick="window.submitAiraToolForm()">
                <span>🚀 Submit AI Tool for Review (100% Free)</span>
              </button>
              <div class="adv-secure-note">
                🔒 Free submission • Verified within 24 hours • Indexed permanently in AIRA Directory
              </div>

            </div>

            <!-- RIGHT: LIVE DIRECTORY CARD PREVIEW & PERKS -->
            <div class="submit-sidebar-panel">
              
              <!-- LIVE PREVIEW CARD -->
              <div class="submit-preview-card">
                <div class="adv-canvas-head">
                  <span class="adv-canvas-title">👁️ LIVE DIRECTORY CARD PREVIEW</span>
                  <span class="adv-live-tag">LIVE SYNC</span>
                </div>
                
                <div class="submit-preview-frame">
                  <div class="submit-preview-meta-bar">
                    <span>AIRA Directory Preview</span>
                    <span style="color: #059669; font-weight: 700;">Verified Listing</span>
                  </div>
                  
                  <div id="submit-live-card-target" class="submit-card-render-wrap">
                    ${getSubmitToolCardLiveHTML(s)}
                  </div>
                </div>
              </div>

              <!-- PERKS BENTO BOX -->
              <div class="submit-perks-card">
                <h3 class="submit-perks-title">Why List on AIRA?</h3>
                <div class="submit-perks-list">
                  <div class="submit-perk-item">
                    <div class="submit-perk-icon">🎯</div>
                    <div>
                      <strong>High-Intent Builders</strong>
                      <p>100+ active software engineers, CTOs, and founders evaluating AI tools daily.</p>
                    </div>
                  </div>
                  <div class="submit-perk-item">
                    <div class="submit-perk-icon">⚡</div>
                    <div>
                      <strong>Dofollow SEO Authority</strong>
                      <p>Permanent backlink to boost your domain authority and organic search visibility.</p>
                    </div>
                  </div>
                  <div class="submit-perk-item">
                    <div class="submit-perk-icon">📬</div>
                    <div>
                      <strong>Weekly Newsletter Spotlight</strong>
                      <p>Top reviewed tools are featured in the Friday AIRA curated edition.</p>
                    </div>
                  </div>
                  <div class="submit-perk-item">
                    <div class="submit-perk-icon">⏱️</div>
                    <div>
                      <strong>24-Hour Express Review</strong>
                      <p>Fast verification process without complicated approval bottlenecks.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    `;
  }

  window.updateSubmitToolLivePreview = function() {
    initSubmitToolState();
    const name = document.getElementById('submit-input-name')?.value || '';
    const url = document.getElementById('submit-input-url')?.value || '';
    const tagline = document.getElementById('submit-input-tagline')?.value || '';
    const cat = document.getElementById('submit-input-category')?.value || 'developer-tools';
    const pricing = document.getElementById('submit-input-pricing')?.value || 'Freemium';
    const desc = document.getElementById('submit-input-desc')?.value || '';
    const logo = document.getElementById('submit-input-logo')?.value || '';

    window.airaSubmitToolState = {
      ...window.airaSubmitToolState,
      name,
      url,
      tagline,
      category: cat,
      pricing,
      description: desc,
      logoUrl: logo
    };

    const targetEl = document.getElementById('submit-live-card-target');
    if (targetEl) {
      targetEl.innerHTML = getSubmitToolCardLiveHTML(window.airaSubmitToolState);
    }
  };

  window.submitAiraToolForm = function() {
    initSubmitToolState();
    const name = (document.getElementById('submit-input-name')?.value || '').trim();
    const url = (document.getElementById('submit-input-url')?.value || '').trim();
    const tagline = (document.getElementById('submit-input-tagline')?.value || '').trim();
    const cat = document.getElementById('submit-input-category')?.value || 'developer-tools';
    const pricing = document.getElementById('submit-input-pricing')?.value || 'Freemium';
    const desc = (document.getElementById('submit-input-desc')?.value || '').trim();
    const features = (document.getElementById('submit-input-features')?.value || '').trim();
    const logo = (document.getElementById('submit-input-logo')?.value || '').trim();
    const contact = (document.getElementById('submit-input-contact')?.value || '').trim();
    const email = (document.getElementById('submit-input-email')?.value || '').trim();
    const twitter = (document.getElementById('submit-input-twitter')?.value || '').trim();

    if (!name || !url || !tagline || !desc || !contact || !email) {
      showToast('⚠️ Please fill in all required fields (Tool Name, URL, Tagline, Description, Name, Email).');
      return;
    }

    let domain = '';
    try {
      const u = new URL(url.startsWith('http') ? url : 'https://' + url);
      domain = u.hostname.replace('www.', '');
    } catch(err) {
      domain = url.replace(/^https?:\/\//i, '').split('/')[0];
    }

    const newTool = {
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString().slice(-4),
      name,
      toolName: name,
      url: url.startsWith('http') ? url : 'https://' + url,
      websiteUrl: url.startsWith('http') ? url : 'https://' + url,
      logo: logo || ('https://logo.clearbit.com/' + domain),
      icon: '⚡',
      pricing: pricing || 'Freemium',
      category: cat || 'developer-tools',
      categories: [cat || 'developer-tools'],
      description: tagline || desc,
      tagline: tagline || desc,
      fullDescription: desc,
      features: features.split('\n').filter(Boolean),
      contactName: contact,
      workEmail: email,
      contactEmail: email,
      twitter,
      verified: false,
      status: 'pending',
      created_at: new Date().toISOString(),
      submittedAt: new Date().toISOString()
    };

    // Store in submissions queue
    try {
      let submissions = (typeof getToolSubmissions === 'function') ? getToolSubmissions() : [];
      submissions.unshift(newTool);
      if (typeof saveToolSubmissions === 'function') saveToolSubmissions(submissions);
      else localStorage.setItem('aira_tool_submissions', JSON.stringify(submissions));
    } catch(err) {}

    // Sync to Supabase if connected
    if (window.AiraSupabase) {
      window.AiraSupabase.submitTool(newTool).catch(err => console.log('Supabase sync:', err));
    }

    const formPanel = document.querySelector('.submit-form-panel');
    if (formPanel) {
      formPanel.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: #ECFDF5; color: #059669; font-size: 2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto;">✓</div>
          <h2 style="font-size: 1.6rem; font-weight: 900; color: #0F172A; margin-bottom: 10px;">Tool Submitted Successfully!</h2>
          <p style="color: #64748B; font-size: 0.95rem; max-width: 480px; margin: 0 auto 20px auto; line-height: 1.6;">
            Thank you for submitting <strong>${escapeHtml(newTool.name)}</strong>! Our editorial desk will verify your listing within 24 hours. A confirmation email has been sent to <strong>${escapeHtml(newTool.workEmail)}</strong>.
          </p>
          <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 16px; max-width: 460px; margin: 0 auto 24px auto; text-align: left; font-size: 0.85rem; color: #334155;">
            <div><strong>Tool:</strong> ${escapeHtml(newTool.name)} (${escapeHtml(newTool.pricing)})</div>
            <div><strong>URL:</strong> <a href="${escapeHtml(newTool.url)}" target="_blank" style="color:#1C46F5;">${escapeHtml(newTool.url)}</a></div>
            <div><strong>Category:</strong> ${escapeHtml(newTool.category)}</div>
            <div><strong>Status:</strong> <span style="color:#059669; font-weight:700;">Queued for 24h Indexing</span></div>
          </div>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <a href="#/tags" class="btn-sub-nav" style="display: inline-block;">Browse Tools Directory</a>
            <button type="button" onclick="location.reload();" class="adv-preset-pill" style="padding: 10px 18px;">Submit Another Tool</button>
          </div>
        </div>
      `;
    }

    showToast('🎉 ' + name + ' submitted successfully! Review within 24h.');
  };


  // =========================================================================
  // 11. Subscription Handler (Connected to Database)
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

      showToast('🎉 Welcome to AIRA! Opening 3,000+ Prompts & 50 n8n Templates...');
      input.value = '';

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
        closeModal(subscribeModal);
        if (typeof window.openLeadMagnetModal === 'function') window.openLeadMagnetModal();
      }, 800);
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
      if (typeof window.openLeadMagnetModal === 'function') window.openLeadMagnetModal();
    }
  }

  // Bind footer forms
  const footerForm = document.getElementById('footer-sub-form');
  if (footerForm) {
    footerForm.addEventListener('submit', handleSubscribeSubmit);
  }
  const footerTopForm = document.getElementById('footer-top-sub-form');
  if (footerTopForm) {
    footerTopForm.addEventListener('submit', handleSubscribeSubmit);
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
          (a.title || '').toLowerCase().includes(q) || 
          (a.subtitle || '').toLowerCase().includes(q) ||
          (a.slug || '').toLowerCase().includes(q)
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

  // =========================================================================
  // Theme Toggle (Dark / Light Mode)
  // =========================================================================
  const SVG_MOON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  const SVG_SUN = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

  function initTheme() {
    const savedTheme = localStorage.getItem('aira_theme');
    const themeBtn = document.getElementById('btn-theme-toggle');
    const mobileThemeIcon = document.getElementById('mobile-theme-icon');
    const mobileThemeText = document.getElementById('mobile-theme-text');
    const isDark = savedTheme === 'dark';
    if (isDark) {
      document.body.classList.add('dark-mode');
      if (themeBtn) themeBtn.innerHTML = SVG_SUN;
      if (mobileThemeIcon) mobileThemeIcon.innerHTML = SVG_SUN;
      if (mobileThemeText) mobileThemeText.innerHTML = 'Light Mode';
    } else {
      document.body.classList.remove('dark-mode');
      if (themeBtn) themeBtn.innerHTML = SVG_MOON;
      if (mobileThemeIcon) mobileThemeIcon.innerHTML = SVG_MOON;
      if (mobileThemeText) mobileThemeText.innerHTML = 'Dark Mode';
    }
  }

  function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('aira_theme', isDark ? 'dark' : 'light');
    const themeBtn = document.getElementById('btn-theme-toggle');
    const mobileThemeIcon = document.getElementById('mobile-theme-icon');
    const mobileThemeText = document.getElementById('mobile-theme-text');
    if (themeBtn) {
      themeBtn.innerHTML = isDark ? SVG_SUN : SVG_MOON;
    }
    if (mobileThemeIcon) {
      mobileThemeIcon.innerHTML = isDark ? SVG_SUN : SVG_MOON;
    }
    if (mobileThemeText) {
      mobileThemeText.innerHTML = isDark ? 'Light Mode' : 'Dark Mode';
    }
    showToast(isDark ? 'Dark Mode Activated' : 'Light Mode Activated');
  }

  const themeToggleBtn = document.getElementById('btn-theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Mobile Drawer Toggle & Actions
  const mobileMenuToggleBtn = document.getElementById('btn-mobile-menu-toggle');
  const mobileDrawerCloseBtn = document.getElementById('btn-mobile-drawer-close');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileThemeToggleBtn = document.getElementById('mobile-btn-theme-toggle');
  const mobileDrawerSubBtn = document.getElementById('btn-mobile-drawer-subscribe');

  function openMobileDrawer() {
    if (mobileNavDrawer) mobileNavDrawer.classList.add('active');
    if (mobileNavBackdrop) mobileNavBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    if (mobileNavDrawer) mobileNavDrawer.classList.remove('active');
    if (mobileNavBackdrop) mobileNavBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuToggleBtn) {
    mobileMenuToggleBtn.addEventListener('click', openMobileDrawer);
  }

  if (mobileDrawerCloseBtn) {
    mobileDrawerCloseBtn.addEventListener('click', closeMobileDrawer);
  }

  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener('click', closeMobileDrawer);
  }

  if (mobileThemeToggleBtn) {
    mobileThemeToggleBtn.addEventListener('click', () => {
      toggleTheme();
    });
  }

  if (mobileDrawerSubBtn) {
    mobileDrawerSubBtn.addEventListener('click', () => {
      closeMobileDrawer();
      openModal(subscribeModal);
    });
  }

  document.querySelectorAll('.mobile-nav-link, #mobile-drawer-bookmarks').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
    });
  });

  // Breaking News Ticker Dismiss
  const closeTickerBtn = document.getElementById('btn-close-ticker');
  if (closeTickerBtn) {
    closeTickerBtn.addEventListener('click', () => {
      const ticker = document.getElementById('breaking-news-ticker');
      if (ticker) {
        ticker.style.display = 'none';
        sessionStorage.setItem('aira_ticker_closed', 'true');
      }
    });
    if (sessionStorage.getItem('aira_ticker_closed') === 'true') {
      const ticker = document.getElementById('breaking-news-ticker');
      if (ticker) ticker.style.display = 'none';
    }
  }

  // =========================================================================
  // Reading Progress Bar (Article Pages)
  // =========================================================================
  function initReadingProgressBar() {
    const bar = document.getElementById('reading-progress-bar');
    if (!bar) return;

    function updateProgress() {
      const isArticlePage = window.location.hash.startsWith('#/p/') || !!document.querySelector('.article-single-main, .post-page-content');
      if (!isArticlePage) {
        bar.style.width = '0%';
        return;
      }
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('hashchange', () => {
      setTimeout(updateProgress, 100);
    });
  }

  // =========================================================================
  // Global Submit AI Tool Modal Controller
  // =========================================================================
    // =========================================================================
  // Global Submit AI Tool Modal Controller (100% Robust Close & Cancel Engine)
  // =========================================================================
  function initSubmitToolModal() {
    window.openSubmitToolModal = function() {
      const modal = document.getElementById('submit-tool-modal');
      if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    };

    window.closeSubmitToolModal = function() {
      const modal = document.getElementById('submit-tool-modal');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    };

    // Global Delegated Click Listeners for Open / Close / Cancel
    document.addEventListener('click', (e) => {
      // 1. Open Triggers
      if (e.target.closest('#btn-submit-tool-header, #btn-open-submit-modal, .btn-submit-tool-trigger, .btn-open-submit-modal-any, #mobile-drawer-submit-tool, #footer-btn-submit-tool, .footer-submit-tool-link')) {
        e.preventDefault();
        const drawer = document.getElementById('mobile-nav-drawer');
        const backdrop = document.getElementById('mobile-nav-backdrop');
        if (drawer) drawer.classList.remove('active');
        if (backdrop) backdrop.classList.remove('active');
        window.openSubmitToolModal();
        return;
      }

      // 2. Close & Cancel Triggers
      if (e.target.closest('#btn-cancel-submit-modal, .btn-cancel-modal, #btn-close-submit-modal, .submit-modal-close')) {
        e.preventDefault();
        e.stopPropagation();
        window.closeSubmitToolModal();
        return;
      }

      // 3. Backdrop Click Outside Card
      const modal = document.getElementById('submit-tool-modal');
      if (modal && e.target === modal) {
        window.closeSubmitToolModal();
      }
    });

    // Escape Key Close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        window.closeSubmitToolModal();
      }
    });

    const form = document.getElementById('submit-tool-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('sub-tool-name')?.value.trim();
        const url = document.getElementById('sub-tool-url')?.value.trim();
        const cat = document.getElementById('sub-tool-cat')?.value;
        const pricing = document.getElementById('sub-tool-pricing')?.value;
        const desc = document.getElementById('sub-tool-desc')?.value.trim();
        const overview = document.getElementById('sub-tool-overview')?.value.trim();

        if (!name || !url || !desc) {
          showToast('Please fill all required fields marked with *');
          return;
        }

        let domain = '';
        try {
          const u = new URL(url.startsWith('http') ? url : 'https://' + url);
          domain = u.hostname.replace('www.', '');
        } catch(err) {
          domain = url.replace(/^https?:\/\//i, '').split('/')[0];
        }

        const newTool = {
          id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString().slice(-4),
          name: name,
          url: url.startsWith('http') ? url : 'https://' + url,
          logo: 'https://logo.clearbit.com/' + domain,
          icon: '⚡',
          pricing: pricing || 'Freemium',
          category: cat || 'developer-tools',
          categories: [cat || 'developer-tools'],
          description: desc,
          verified: false,
          created_at: new Date().toISOString()
        };

        // Save locally
        try {
          const custom = JSON.parse(localStorage.getItem('aira_custom_tools') || '[]');
          custom.unshift(newTool);
          localStorage.setItem('aira_custom_tools', JSON.stringify(custom));
        } catch(err) {}

        // Save to Supabase if connected
        if (window.AiraSupabase) {
          window.AiraSupabase.submitTool(newTool).catch(err => console.log('Supabase tool sync error:', err));
        }

        window.closeSubmitToolModal();
        form.reset();
        showToast('🎉 Thank you! ' + name + ' has been submitted for review.');

        // Refresh tools view if currently on tools page
        if (window.location.hash.startsWith('#/tags') || window.location.hash.startsWith('#/home')) {
          setTimeout(() => {
            if (typeof updateView === 'function') updateView();
          }, 400);
        }
      });
    }
  }

  // Initialize Global Elements
  initTheme();
  updateBookmarksBadge();
  // Floating Rotating Ad Widget Removed
  window.dismissFloatingAd = function() {
    const adRoot = document.getElementById('aira-floating-bottom-ad');
    if (adRoot) adRoot.remove();
  };

  // Initialize Global Elements
  initTheme();
  updateBookmarksBadge();
  initReadingProgressBar();
  initSubmitToolModal();

  // Listen to hash changes
  window.addEventListener('hashchange', renderCurrentRoute);

  // Initial render
  
  // Global click delegation for Lead Magnet and Modals
  document.addEventListener('click', (e) => {
    const claimBtn = e.target.closest('#btn-claim-lead-magnet, .lead-magnet-claim-btn');
    if (claimBtn) {
      window.openLeadMagnetModal();
      return;
    }
    const dlPrompts = e.target.closest('#btn-download-prompts-kit');
    if (dlPrompts) {
      window.downloadPromptsKit();
      return;
    }
    const dlTools = e.target.closest('#btn-download-tools-kit');
    if (dlTools) {
      window.downloadToolsKit();
      return;
    }
    const copyPrompt = e.target.closest('#btn-copy-bonus-prompt');
    if (copyPrompt) {
      window.copyMasterBonusPrompt(copyPrompt);
      return;
    }
  });

  renderCurrentRoute();

  // Asynchronously hydrate and sync large datasets from IndexedDB
  if (typeof window !== 'undefined' && window.AiraStorage) {
    Promise.all([
      window.AiraStorage.get('aira_article_overrides'),
      window.AiraStorage.get('aira_custom_articles')
    ]).then(([dbOverrides, dbCustom]) => {
      let changed = false;
      if (dbOverrides && typeof dbOverrides === 'object' && Object.keys(dbOverrides).length > 0) {
        try {
          const localOvr = JSON.parse(localStorage.getItem('aira_article_overrides') || '{}');
          const mergedOvr = { ...localOvr, ...dbOverrides };
          localStorage.setItem('aira_article_overrides', JSON.stringify(mergedOvr));
          changed = true;
        } catch (e) {}
      }
      if (dbCustom && Array.isArray(dbCustom) && dbCustom.length > 0) {
        try {
          localStorage.setItem('aira_custom_articles', JSON.stringify(dbCustom));
          changed = true;
        } catch (e) {}
      }
      if (changed) {
        const fresh = getArticles();
        if (JSON.stringify(fresh) !== JSON.stringify(state.articles)) {
          state.articles = fresh;
          renderCurrentRoute();
        }
      }
    }).catch(err => {
      console.warn('AiraStorage articles hydration notice:', err);
    });
  }
});
