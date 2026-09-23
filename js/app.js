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
    try {
      localStorage.setItem('aira_custom_articles', JSON.stringify(list));
    } catch (e) {
      console.warn('LocalStorage quota limit reached while saving articles:', e);
      try {
        localStorage.removeItem('aira_saved_alts');
        localStorage.setItem('aira_custom_articles', JSON.stringify(list));
      } catch (err2) {
        showToast('⚠️ Storage limit reached. Changes active in session.');
      }
    }
  }

  // Unified Custom Tools Helpers
  function getCustomTools() {
    try {
      const raw = localStorage.getItem('aira_custom_tools');
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function saveCustomTools(tools) {
    localStorage.setItem('aira_custom_tools', JSON.stringify(tools));
  }
  function getAllTools() {
    const baseTools = typeof AI_TOOLS_DATA !== 'undefined' ? (AI_TOOLS_DATA.tools || []) : [];
    const customTools = getCustomTools();
    const customIds = new Set(customTools.map(t => t.id));
    const filteredBase = baseTools.filter(t => !customIds.has(t.id));
    return [...customTools, ...filteredBase];
  }

  
  // =========================================================================
  // PWA (Progressive Web App) Service Worker & Install Prompt
  // =========================================================================
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('AIRA PWA ServiceWorker active with scope:', reg.scope))
        .catch(err => console.log('AIRA ServiceWorker registration failed:', err));
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
      const cleanImg = imageUrl || 'assets/logo.jpg';
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
    return `# AIRA 2026 AI Starter Kit: Top 100 Production AI Prompts
Generated exclusively for AIRA VIP Newsletter Subscribers.
Website: https://aira-newsletter.vercel.app/
Live Google Sheet: https://docs.google.com/spreadsheets/d/190nDBrA-I8J03VlsneEO3U3-z0ERqCfXdF0mwjyKZBY/edit?usp=sharing

---

## 📊 Live Google Spreadsheet Access
Access the full interactive database of 100+ Production Prompts:
👉 https://docs.google.com/spreadsheets/d/190nDBrA-I8J03VlsneEO3U3-z0ERqCfXdF0mwjyKZBY/edit?usp=sharing

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
    let text = "AIRA 2026 AI Tools Directory — Curated 400+ Collection\n";
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
      const raw = localStorage.getItem('aira_custom_deals');
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function saveCustomDeals(deals) {
    localStorage.setItem('aira_custom_deals', JSON.stringify(deals));
  }
  function getAllDeals() {
    const baseDeals = typeof AI_DEALS_DATA !== 'undefined' ? (AI_DEALS_DATA.deals || []) : [];
    const customDeals = getCustomDeals();
    const customIds = new Set(customDeals.map(d => d.id));
    const filteredBase = baseDeals.filter(d => !customIds.has(d.id));
    return [...customDeals, ...filteredBase];
  }

  // Tool Submissions Helpers
  function getToolSubmissions() {
    try {
      const raw = localStorage.getItem('aira_tool_submissions');
      const list = raw ? JSON.parse(raw) : [];
      // Normalize submissions with IDs & default status
      return list.map((s, idx) => ({
        id: s.id || `sub_${idx + 1}_${(s.toolName || 'tool').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        toolName: s.toolName || 'Unnamed Tool',
        toolUrl: s.toolUrl || '',
        category: s.category || 'productivity',
        pricing: s.pricing || 'Freemium',
        tagline: s.tagline || '',
        description: s.description || '',
        features: s.features || '',
        contactEmail: s.contactEmail || '',
        promoCode: s.promoCode || '',
        submittedAt: s.submittedAt || new Date().toISOString(),
        status: s.status || 'pending'
      }));
    } catch (e) { return []; }
  }
  function saveToolSubmissions(subs) {
    localStorage.setItem('aira_tool_submissions', JSON.stringify(subs));
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

  function downloadTextFile(filename, text) {
    try {
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
    } catch (e) {
      console.error('Download error:', e);
      showToast('Download started!');
    }
  }

  function getPromptsKitMarkdown() {
    return `# AIRA 2026 AI Starter Kit: Top 100 Production AI Prompts
Generated exclusively for AIRA VIP Newsletter Subscribers.
Website: https://aira-newsletter.vercel.app/

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
    let text = "AIRA 2026 AI Tools Directory — Curated 400+ Collection\n";
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
    if (hashPath === '/archive') return { name: 'home' }; // Redirected to home
    if (hashPath === '/admin' || hashPath === '/subscribers') return { name: 'admin' };
    if (hashPath === '/prompts') return { name: 'prompts' };
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
         (route.name === 'alternative-detail' && target === 'alternatives') ||
         (route.name === 'tool-detail' && target === 'tags')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'instant' });
    updateReadingProgress();

    // Dynamic Route Meta Tags
    if (route.name === 'home') {
      updateSocialMetaTags('AIRA | The One and Only AI Newsletter', 'The one and only AI newsletter. Join us and get the best AI news, tools, prompts, and tutorials completely FREE!');
    } else if (route.name === 'tags') {
      updateSocialMetaTags('AI Tools Directory (400+ Curated Tools) | AIRA', 'Explore top curated AI tools, community ratings, alternatives, and verified links.');
    } else if (route.name === 'alternatives') {
      updateSocialMetaTags('AI Software Alternatives & Competitors | AIRA', 'Find the best open-source and proprietary alternatives for top AI tools.');
    } else if (route.name === 'prompts') {
      updateSocialMetaTags('AI Prompts Vault - 100+ Production Prompts | AIRA', 'Master frontier LLMs with battle-tested production prompts.');
    } else if (route.name === 'compare') {
      updateSocialMetaTags('Compare Top AI Tools Side-by-Side | AIRA', 'Compare AI models, pricing, speed, and features side-by-side.');
    } else if (route.name === 'archive') {
      updateSocialMetaTags('Newsletter Archive | AIRA', 'Browse all previous editions of the AIRA Newsletter.');
    } else if (route.name === 'submit') {
      updateSocialMetaTags('Submit Your AI Tool | AIRA', 'Get your AI product featured to 500+ subscribers.');
    } else if (route.name === 'advertise') {
      updateSocialMetaTags('Advertise with AIRA | AIRA', 'Partner with AIRA to sponsor newsletter editions and tool spotlights.');
    }

    if (route.name === 'gate' || route.name === 'subscribe') {
      renderSubscribeGatePage();
    } else if (route.name === 'home') {
      renderHomePage();
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
            <img src="assets/logo.jpg" alt="AIRA" class="sub-landing-logo-img" onerror="this.src='assets/logo.svg'" />
          </div>
          
          <h1 class="sub-landing-title">AIRA</h1>
          
          <p class="sub-landing-tagline">
            Level up your AI knowledge in just 5 minutes | Join 500+ AI pioneers & engineers from top tech companies.
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
  // Featured AI Tools of the Week Generator
  // =========================================================================
  function getFeaturedToolsHTML() {
    const allTools = getAllTools();
    const featured = allTools.filter(t => t.featured || t.badge === 'Featured').slice(0, 4);
    const targetTools = featured.length >= 4 ? featured : allTools.slice(0, 4);

    return targetTools.map(tool => {
      const cleanDomain = (tool.domain || '').replace(/^https?:\/\//, '').split('/')[0] || 'ai.com';
      const logoUrl = tool.image || `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
      const duckLogo = 'https://icons.duckduckgo.com/ip3/' + cleanDomain + '.ico';
      const stats = getToolRatingStats(tool);

      return `
        <div class="featured-tool-showcase-card" onclick="if(!event.target.closest('a, button')) { window.location.hash='#/tools/${tool.id}'; }">
          <div class="ft-card-top-row">
            <div class="ft-tool-avatar">
              <img src="${logoUrl}" alt="${tool.name}" class="ft-logo-img" loading="lazy" onerror="if(!this.dataset.triedDuck){ this.dataset.triedDuck='true'; this.src='${duckLogo}'; } else { this.onerror=null; this.parentElement.innerHTML='<span style=\\'font-size:1.6rem;\\'>⚡</span>'; }" />
            </div>
            <div class="ft-badge-col">
              <span class="tool-badge-promoted"><span class="star">⭐</span> Promoted</span>
            </div>
          </div>

          <h3 class="ft-tool-name">
            <a href="#/tools/${tool.id}" class="ft-title-link">${tool.name}</a>
          </h3>

          <p class="ft-tool-tagline">${tool.description || ''}</p>

          <div class="ft-rating-row">
            <span class="ft-rating-star">★</span>
            <span class="ft-rating-score">${stats.rating.toFixed(1)}</span>
            <span class="ft-rating-count">(${stats.votes.toLocaleString()} votes)</span>
          </div>

          <div class="ft-actions-row">
            <a href="#/tools/${tool.id}" class="ft-btn-details">Details</a>
            <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="ft-btn-visit">
              <span>Visit</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>
        </div>
      `;
    }).join('');
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
            const cleanDomain = (t.domain || '').replace(/^https?:\/\//, '').split('/')[0] || 'ai.com';
            const iconSrc = t.image || `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=64`;
            const stats = getToolRatingStats(t);
            return `
              <div class="trending-tool-row" onclick="window.location.hash='#/tools/${t.id}';">
                <span class="trending-rank-num ${idx === 0 ? 'is-gold' : (idx === 1 ? 'is-silver' : (idx === 2 ? 'is-bronze' : ''))}">#${idx + 1}</span>
                <div class="trending-tool-icon">
                  <img src="${iconSrc}" alt="${escapeHtml(t.name)}" onerror="this.parentElement.innerHTML='⚡'" loading="lazy" />
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

      const ARTICLES_PER_PAGE = 8;
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

      const formatViews = (v, idx) => {
        if (!v) return `${(14.8 - idx * 0.9).toFixed(1)}k views`;
        const str = String(v).trim();
        if (str.toLowerCase().includes('view')) return str;
        return `${str} views`;
      };

      // Select top popular posts (Top 7)
      const popularArticles = [...state.articles]
        .sort((a, b) => parseViews(b.views) - parseViews(a.views))
        .slice(0, 7);

      feedInner.innerHTML = `
        <!-- Articles Header & Filter Pills -->
        <div class="feed-header">
          <h2 class="feed-title">${isSearching ? `Search Results (${filteredArticles.length})` : `Articles (Page ${state.homeCurrentPage} of ${totalPages})`}</h2>
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

        <!-- 1. Top Banner Ad -->
        <div class="ad-banner-mint">
          <div class="ad-banner-content-wrap">
            <span class="ad-tag-label">ADVERTISEMENT</span>
            <h3 class="ad-banner-title">Your Ad Here</h3>
            <p class="ad-banner-desc">Reach thousands of AI enthusiasts and professionals.</p>
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
          <!-- 2-Column Main Layout (Left: Articles Grid | Right: Sidebar Widgets & Resources) -->
          <div class="home-main-layout">
            
            <!-- Left Column: Articles Grid (Exact 8 Articles Per Page) -->
            <div class="home-articles-col">
              <!-- 2-Column Articles Grid -->
              <div class="articles-grid-2col" id="main-articles-grid">
                ${visibleArticles.map(article => `
                  <a href="#/p/${article.slug}" class="article-card">
                    <div class="card-image-wrap">
                      <img src="${article.image_url || 'assets/logo.jpg'}" alt="${article.title || 'AIRA Edition'}" class="card-thumbnail" loading="lazy" />
                      <span class="card-tag-badge">${article.tag || 'Frontier AI'}</span>
                    </div>
                    <div class="card-body">
                      <h3 class="card-title">${article.title || ''}</h3>
                      <p class="card-subtitle">${article.subtitle || ''}</p>
                      <div class="card-footer">
                        <div class="card-author-info">
                          <img src="${article.author_avatar || 'assets/logo.svg'}" alt="${article.author || 'AIRA Editorial Team'}" class="card-author-avatar" onerror="this.src='assets/logo.svg'" />
                          <span class="card-author-name">${article.author || 'AIRA Editorial Team'}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <button type="button" class="card-listen-btn" data-slug="${article.slug}" title="Listen to AI Voice Narration" onclick="event.preventDefault(); event.stopPropagation(); window.airaAudioEngine && window.airaAudioEngine.togglePlay('${article.slug}');">
                            <span class="listen-btn-icon">🎧</span>
                            <span class="listen-btn-text">Listen</span>
                          </button>
                          <span class="card-meta-date">${article.date || 'Sep 2026'} • ${article.reading_time || article.read_time || '4 min read'}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                `).join('')}
              </div>
            </div>

            <!-- Right Column: Sidebar Widgets & Resources -->
            <div class="home-sidebar-col">
              
              <!-- 1. Top 5 Trending AI Tools Leaderboard -->
              ${getTrendingToolsHTML()}

              <!-- 2. AIRA Pulse: Community Live Weekly AI Poll -->
              ${getCommunityPollHTML()}

              <!-- Sidebar Ad 1: Master AI Prompts Vault -->
              <div class="ad-sidebar-card">
                <span class="ad-tag-label">FEATURED RESOURCE</span>
                <h3 class="ad-sidebar-title">Master AI Prompts Vault</h3>
                <p class="ad-sidebar-desc">100+ battle-tested prompts for reasoning, coding, writing & automation.</p>
                <a href="#/prompts" class="ad-pill-btn">
                  <span>Open Prompts Vault</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>

              <!-- Sidebar Ad 2: 50 n8n Templates -->
              <div class="ad-sidebar-card">
                <span class="ad-tag-label">FREE BONUS</span>
                <h3 class="ad-sidebar-title">50 n8n Templates</h3>
                <p class="ad-sidebar-desc">Get top AI news, breakthroughs + instant access to AI Automation | 50 n8n Templates.</p>
                <button type="button" class="ad-pill-btn" onclick="document.getElementById('subscribe-modal').classList.add('active'); document.body.style.overflow='hidden';">
                  <span>Get 50 Templates</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>

              <!-- Sidebar Ad 3: Advertise with AIRA -->
              <div class="ad-sidebar-card" style="background: linear-gradient(145deg, #ECFDF5 0%, #D1FAE5 60%, #CCFBF1 100%);">
                <span class="ad-tag-label">SPONSORSHIP</span>
                <h3 class="ad-sidebar-title">Partner with AIRA</h3>
                <p class="ad-sidebar-desc">Put your brand in front of 500+ AI builders, founders, and engineers.</p>
                <a href="#/advertise" class="ad-pill-btn">
                  <span>View Media Kit</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>

            </div>
          </div>

              

          <!-- Centered Numbered Pagination Bar Across Full Container Width -->
          <div class="home-pagination-wrapper">
            ${renderPaginationHTML(state.homeCurrentPage, totalPages, 'home')}
          </div>

          <!-- 4. Full-Width Bottom Banner Ad -->
          <div class="ad-banner-mint" style="margin-top: 32px; margin-bottom: 24px;">
            <div class="ad-banner-content-wrap">
              <span class="ad-tag-label">FREE VIP ACCESS</span>
              <h3 class="ad-banner-title">Never Miss a Frontier AI Breakthrough</h3>
              <p class="ad-banner-desc">Daily frontier research, step-by-step tutorials and reasoning models delivered free.</p>
            </div>
            <button type="button" class="ad-pill-btn" onclick="document.getElementById('subscribe-modal').classList.add('active'); document.body.style.overflow='hidden';">
              <span>Subscribe Free ⚡</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
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
      state.homeCurrentPage = 1;
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
        state.homeCurrentPage = 1;
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
    updateSocialMetaTags(article.title, article.subtitle || article.title, article.image_url);

    const tldrBullets = [
      `<strong>Core Breakthrough:</strong> ${article.subtitle || 'Frontier AI model updates and key architectural milestones.'}`,
      `<strong>Workflow Impact:</strong> Substantial performance and inference acceleration for developers and teams.`,
      `<strong>Actionable Takeaway:</strong> Practical prompting strategies and tools ready to test in your workflow today.`
    ];

    const tldrBoxHtml = `
      <div class="article-tldr-box">
        <div class="tldr-header">
          <span class="tldr-badge">⚡ 30-SECOND EXECUTIVE SUMMARY</span>
          <span class="tldr-time-badge">• Quick Takeaways</span>
        </div>
        <ul class="tldr-bullets">
          ${tldrBullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `;

    const enrichedBodyHtml = linkToolMentionsInArticle(article.body_html);

    appContainer.innerHTML = `
      <article class="article-page-view">
        <div class="article-container">
          <!-- Breadcrumb -->
          <div class="breadcrumb-nav">
            <a href="#/" class="breadcrumb-link">Home</a>
            <span class="breadcrumb-separator">/</span>
            <a href="#/home" class="breadcrumb-link">Home</a>
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
                <img src="${article.author_avatar || 'assets/logo.svg'}" alt="${article.author || 'AIRA Editorial Team'}" class="article-author-img" onerror="this.src='assets/logo.svg'" />
                <div>
                  <div class="article-author-meta-name">${article.author || 'AIRA Editorial Team'}</div>
                  <div class="article-author-meta-date">${article.date || 'Sep 2026'} • ${article.reading_time || article.read_time || '4 min read'}</div>
                </div>
              </div>

              <div class="article-action-buttons">
                <button class="action-btn ${isLiked ? 'liked' : ''}" id="btn-like-post" data-slug="${article.slug}">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="${isLiked ? '#EF4444' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  <span id="like-count-display">${currentLikes}</span>
                </button>
                <button class="action-btn ${isBookmarked ? 'bookmarked' : ''}" id="btn-bookmark-post" data-slug="${article.slug}">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked ? '#10B981' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
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
            <img src="${article.image_url}" alt="${article.title}" class="article-hero-img" loading="lazy" referrerpolicy="no-referrer" />
          </div>

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

          <!-- Executive TL;DR Summary Box -->
          ${tldrBoxHtml}

          <!-- Body Content -->
          <div class="article-rich-body">
            ${enrichedBodyHtml || article.body_html}
          </div>

          <!-- Inline Subscribe Card (Exact Dark UI) -->
          <div class="article-subscribe-card">
            <div class="article-sub-badge">
              <span class="sub-bolt-icon">⚡</span>
            </div>
            <h3 class="article-sub-title">Stay Ahead in AI with AIRA</h3>
            <p class="article-sub-desc">Get top AI news, breakthroughs + instant access to AI Automation | 50 n8n Templates.</p>
            
            <form class="article-sub-form-dark" id="article-sub-form">
              <div class="sub-dark-input-wrap">
                <input type="email" class="sub-dark-input" placeholder="Your email address" required />
                <button type="submit" class="sub-dark-btn">Subscribe & Get 50 Templates 🎁</button>
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
                    <img src="${rec.image_url || 'assets/logo.jpg'}" alt="${rec.title || 'AIRA Article'}" class="kr-card-img" loading="lazy" />
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

    function renderToolCard(tool) {
      const pricingClass = `pricing-${(tool.pricing || 'free').toLowerCase().replace(/\s+/g, '-')}`;
      const firstCats = (tool.categories || [tool.category || 'productivity']).slice(0, 3);
      const cleanDomain = (tool.domain || '').replace(/^https?:\/\//, '').split('/')[0].trim() || 'ai.com';
      const logoUrl = tool.image || `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
      const duckLogo = `https://icons.duckduckgo.com/ip3/${cleanDomain}.ico`;
      const fallbackIcon = tool.icon || '⚡';
      const stats = getToolRatingStats(tool);

      return `
        <div class="tool-card ${tool.featured ? 'is-featured' : ''}" data-tool-id="${stats.id}" onclick="if(!event.target.closest('a, button')) { window.location.hash='#/tools/${tool.id}'; }">
          <div class="tool-card-top">
            <a href="#/tools/${tool.id}" class="tool-icon-avatar" title="View ${tool.name} details">
              <img src="${logoUrl}" alt="${tool.name} logo" class="tool-logo-img" loading="lazy" onerror="if(!this.dataset.triedDuck){ this.dataset.triedDuck='true'; this.src='${duckLogo}'; } else { this.onerror=null; this.parentElement.innerHTML='<span class=\\'tool-emoji\\'>${fallbackIcon}</span>'; }" />
            </a>
            <div class="tool-title-group">
              <div class="tool-badges-row">
                ${tool.badge ? `<span class="tool-badge-purpose">${tool.badge}</span>` : ''}
                ${isToolPromoted(tool) ? '<span class="tool-badge-promoted"><span class="star">⭐</span> Promoted</span>' : ''}
                <span class="tool-badge-pricing ${pricingClass}">${tool.pricing}</span>
                <span class="tool-rating-pill" title="AIRA Community Rating: ${stats.rating.toFixed(1)} / 5.0 (${stats.votes} votes)">★ ${stats.rating.toFixed(1)}</span>
              </div>
              <h3 class="tool-card-name" title="${tool.name}">
                <a href="#/tools/${tool.id}" class="tool-title-link">${tool.name}</a>
              </h3>
            </div>
          </div>

          <p class="tool-card-desc">${tool.description}</p>

          <div class="tool-card-bottom">
            <button type="button" class="tool-upvote-btn ${stats.hasVoted ? 'is-voted' : ''}" data-tool-id="${stats.id}" title="${stats.hasVoted ? 'Remove upvote' : 'Upvote tool'}" onclick="event.stopPropagation(); window.toggleToolVote('${stats.id}');">
              <span class="upvote-arrow">▲</span>
              <span class="upvote-count">${stats.votes}</span>
            </button>
            <div class="tool-card-actions">
              <a href="#/tools/${tool.id}" class="tool-details-btn" title="View details of ${tool.name}">
                <span>Details</span>
              </a>
              <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="tool-direct-visit-btn" title="Open ${tool.name}">
                <span>Visit</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            </div>
          </div>
        </div>
      `;
    }

    function updateView() {
      const filtered = getFilteredTools();
      const currentCatObj = categories.find(c => c.id === state.toolCategoryFilter);
      const currentCatName = currentCatObj ? currentCatObj.name : 'All Tools';

      const TOOLS_PER_PAGE = 12;
      const totalPages = Math.ceil(filtered.length / TOOLS_PER_PAGE);
      if (state.toolCurrentPage > totalPages && totalPages > 0) state.toolCurrentPage = 1;
      if (state.toolCurrentPage < 1) state.toolCurrentPage = 1;

      const pagedTools = filtered.slice(
        (state.toolCurrentPage - 1) * TOOLS_PER_PAGE,
        state.toolCurrentPage * TOOLS_PER_PAGE
      );

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
            const sponsorCtaHtml = `
              <div class="tool-sponsor-cta-card">
                <div class="tool-sponsor-cta-text">
                  <h4>🚀 AI Founder? Showcase Your Tool to 500+ Active Subscribers</h4>
                  <p>Get featured in our newsletter, top directory spot, and dedicated product review.</p>
                </div>
                <a href="#/advertise" class="tool-sponsor-cta-btn">
                  <span>Sponsor Spotlight</span>
                  <span style="font-size: 1.1rem;">→</span>
                </a>
              </div>
            `;
            renderedCards.splice(Math.min(3, renderedCards.length), 0, sponsorCtaHtml);
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
            <div style="margin-top: 16px; display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap;">
              <button type="button" class="btn-submit-tool-trigger btn-open-submit-modal-any" style="padding: 9px 18px; font-size: 0.9rem;">
                <span>➕ Submit Your AI Tool</span>
              </button>
              <a href="#/prompts" class="btn-cancel-modal" style="padding: 9px 16px; text-decoration: none; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 6px;">
                <span>✨ AI Prompts Vault</span>
              </a>
            </div>

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

          <!-- Featured AI Tools of the Week Showcase (Exact Same as Homepage) -->
          <div class="featured-tools-section" style="margin-top: 36px; margin-bottom: 28px; padding: 0; background: transparent; border: none;">
            <div class="featured-tools-header-row" style="margin-bottom: 16px;">
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

    const cleanDomain = (tool.domain || '').replace(/^https?:\/\//, '').split('/')[0].trim() || 'ai.com';
    const logoUrl = tool.image || `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
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
                <img src="${logoUrl}" alt="${tool.name} logo" class="tool-detail-logo-img" onerror="if(!this.dataset.triedDuck){ this.dataset.triedDuck='true'; this.src='${duckLogo}'; } else { this.onerror=null; this.parentElement.innerHTML='<span style=\\'font-size:2rem;\\'>${fallbackIcon}</span>'; }" />
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
                      <span class="tool-spec-val" style="font-size: 0.85rem; font-weight: 600; color: #047857; text-align: right; max-width: 170px;">${tool.inner_content.pricingDetails}</span>
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
                    <span class="tool-spec-val" style="color: #059669; font-weight: 700;">Verified ✓</span>
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

              <!-- Sidebar Ad: Level Up with AIRA -->
              <div class="ad-sidebar-card">
                <span class="ad-tag-label">FREE NEWSLETTER</span>
                <h3 class="ad-sidebar-title">Discover the Best AI Tools Every Week</h3>
                <p class="ad-sidebar-desc">Get our weekly curated list of breakthrough AI tools, prompts, and tutorials delivered to your inbox.</p>
                <button type="button" class="ad-pill-btn" onclick="document.getElementById('btn-subscribe-header') && document.getElementById('btn-subscribe-header').click();">
                  <span>Subscribe Free</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>

            </div>

          </div>

          <!-- Related Tools Section (Bottom) -->
          ${relatedTools.length > 0 ? `
            <div class="tool-related-section">
              <h2 class="tool-related-title">Related AI Tools in ${primaryCatName}</h2>
              <div class="tool-related-grid">
                ${relatedTools.map(rel => {
                  const relCleanDomain = (rel.domain || '').replace(/^https?:\/\//, '').split('/')[0].trim() || 'ai.com';
                  const relLogo = rel.image || `https://www.google.com/s2/favicons?domain=${relCleanDomain}&sz=128`;
                  const relDuckLogo = `https://icons.duckduckgo.com/ip3/${relCleanDomain}.ico`;
                  const relPricingClass = `pricing-${(rel.pricing || 'free').toLowerCase().replace(/\s+/g, '-')}`;
                  const relStats = getToolRatingStats(rel);
                  return `
                    <div class="tool-card" data-tool-id="${relStats.id}" onclick="if(!event.target.closest('a, button')) { window.location.hash='#/tools/${rel.id}'; }">
                      <div class="tool-card-top">
                        <a href="#/tools/${rel.id}" class="tool-icon-avatar" title="View ${rel.name}">
                          <img src="${relLogo}" alt="${rel.name}" class="tool-logo-img" loading="lazy" onerror="if(!this.dataset.triedDuck){ this.dataset.triedDuck='true'; this.src='${relDuckLogo}'; } else { this.onerror=null; this.parentElement.innerHTML='<span>${rel.icon || '⚡'}</span>'; }" />
                        </a>
                        <div class="tool-title-group">
                          <div class="tool-badges-row">
                            ${rel.badge ? `<span class="tool-badge-purpose">${rel.badge}</span>` : ''}
                            <span class="tool-badge-pricing ${relPricingClass}">${rel.pricing}</span>
                            <span class="tool-rating-pill" title="★ ${relStats.rating.toFixed(1)} (${relStats.votes} votes)">★ ${relStats.rating.toFixed(1)}</span>
                          </div>
                          <h3 class="tool-card-name">
                            <a href="#/tools/${rel.id}" class="tool-title-link">${rel.name}</a>
                          </h3>
                        </div>
                      </div>
                      <p class="tool-card-desc">${rel.description}</p>
                      <div class="tool-card-bottom">
                        <button type="button" class="tool-upvote-btn ${relStats.hasVoted ? 'is-voted' : ''}" data-tool-id="${relStats.id}" title="${relStats.hasVoted ? 'Remove upvote' : 'Upvote tool'}" onclick="event.stopPropagation(); window.toggleToolVote('${relStats.id}');">
                          <span class="upvote-arrow">▲</span>
                          <span class="upvote-count">${relStats.votes}</span>
                        </button>
                        <div class="tool-card-actions">
                          <a href="#/tools/${rel.id}" class="tool-details-btn">Details</a>
                          <a href="${rel.url}" target="_blank" rel="noopener noreferrer" class="tool-direct-visit-btn" title="Open ${rel.name}">
                            <span>Visit</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Full-Width Bottom Banner -->
          <div class="ad-banner-mint" style="margin-top: 48px;">
            <div class="ad-banner-content-wrap">
              <span class="ad-tag-label">AIRA DIRECTORY</span>
              <h3 class="ad-banner-title">Stay Ahead with the Latest AI Tools & Breakthroughs</h3>
              <p class="ad-banner-desc">Join 500+ engineers, creators, and founders getting our free weekly newsletter.</p>
            </div>
            <button type="button" class="ad-pill-btn" onclick="document.getElementById('btn-subscribe-header') && document.getElementById('btn-subscribe-header').click();">
              <span>Subscribe Free</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>

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
  // 5. Open Source Alternatives Directory View (/#/alternatives)
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
      <section class="alternatives-directory-view">
        <div class="container">
          <!-- Hero Section -->
          <div class="alt-hero-banner">
            <div class="alt-hero-badge">
              <span class="bolt">⚡</span>
              <span>AIRA Directory • ${allSoftware.length} Software • ${totalAltsCount.toLocaleString()}+ Open-Source Alternatives</span>
            </div>
            <h1 class="alt-hero-title">Alternatives to Popular Software</h1>
            <p class="alt-hero-desc">
              Discover <strong>${totalAltsCount.toLocaleString()}+</strong> curated top software alternatives, open-source tools, and competitor comparisons for <strong>${allSoftware.length}</strong> popular software platforms & AI services.
            </p>

            <!-- Search Form -->
            <form class="alt-search-form" id="alt-search-form" onsubmit="event.preventDefault();">
              <svg class="alt-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" id="alt-search-input" class="alt-search-input" placeholder="Search 350+ software tools or 2,400+ alternatives (e.g. Claude Code, Cursor, Notion, Figma, 1Password)..." value="${state.altSearchQuery}" autocomplete="off" />
              <button type="button" id="alt-search-clear" class="alt-search-clear-btn" style="display: ${state.altSearchQuery ? 'flex' : 'none'};" title="Clear">✕</button>
            </form>

            <!-- Categories Filter Wrapper (Clean Wrapped Grid, Same as AI Tools) -->
            <div class="categories-filter-wrapper" style="margin-top: 14px; border-top: 1px solid #F1F5F9; padding-top: 14px;">
              <div class="categories-filter-grid" id="alt-categories-bar">
                ${categories.map(cat => {
                  const count = getCategoryCount(cat.id);
                  const isActive = state.altCategoryFilter === cat.id;
                  return `
                    <button type="button" class="cat-filter-pill alt-cat-pill ${isActive ? 'active' : ''}" data-cat-id="${cat.id}">
                      <span class="cat-pill-icon">${cat.icon || '✨'}</span>
                      <span class="cat-pill-name">${cat.name}</span>
                      <span class="cat-pill-count">${count}</span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

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

      gridEl.innerHTML = pagedSoftware.map(item => {
        const altCount = item.alternatives ? item.alternatives.length : 0;
        const cleanDomain = (item.domain || '').replace(/^https?:\/\//, '').split('/')[0].trim();
        const logoUrl = item.logo || `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
        const topAltNames = (item.alternatives || []).slice(0, 3).map(a => a.name).join(', ');

        return `
          <a href="#/alternatives/${item.slug}" class="alt-software-card">
            <div class="alt-card-header">
              <div class="alt-logo-box">
                <img src="${logoUrl}" alt="${item.name}" class="alt-logo-img" loading="lazy" onerror="this.src='assets/logo.svg'" />
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
      }).join('');

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
                  <img src="${logoUrl}" alt="${item.name}" class="alt-detail-logo-img" onerror="this.src='assets/logo.svg'" />
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
                          <img src="${altLogo}" alt="${alt.name}" class="alt-item-logo-img" onerror="this.src='assets/logo.svg'" />
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
                    <img src="${rel.logo}" alt="${rel.name}" class="alt-related-logo" onerror="this.src='assets/logo.svg'" />
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
                <form id="inline-article-form" class="article-edit-form" novalidate>
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
                          <input type="text" id="editor-title" class="form-control-input" value="${(art.title || '').replace(/"/g, '&quot;')}" placeholder="e.g. Practical AI Plays, Shipped Fast" />
                        </div>
                        <div class="form-group">
                          <label class="form-label">URL Slug *</label>
                          <input type="text" id="editor-slug" class="form-control-input" value="${art.slug || ''}" placeholder="e.g. practical-ai-plays" />
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
                            <input type="text" id="editor-image" class="form-control-input" value="${art.image_url || 'assets/logo.jpg'}" placeholder="https://... or uploaded photo" />
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
                      <button type="button" id="btn-save-publish-bottom" class="btn-save-modal" style="font-size: 0.95rem; padding: 11px 32px; background: #00BA66; border: none; font-weight: 700; box-shadow: 0 2px 10px rgba(0,186,102,0.25);">
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
                <input type="text" id="modal-img-url-input" class="form-control-input" placeholder="https://example.com/image.jpg" />
              </div>

              <!-- Caption / Source Credit -->
              <div style="margin-bottom: 14px;">
                <label class="form-label" style="font-size: 0.8125rem;">Caption & Source Credit (Optional)</label>
                <input type="text" id="modal-img-caption-input" class="form-control-input" placeholder="e.g. Image Source: OpenAI / Midjourney / AIRA" />
              </div>

              <!-- Destination Link on Image -->
              <div style="margin-bottom: 14px;">
                <label class="form-label" style="font-size: 0.8125rem;">Clickable Link on Image (Optional)</label>
                <input type="text" id="modal-img-link-input" class="form-control-input" placeholder="https://... (When reader clicks photo)" />
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
              <input type="text" class="form-control-input story-inp-title" value="${(story.title || '').replace(/"/g, '&quot;')}" placeholder="e.g. AI Models Are Passing Real-World Benchmarks" style="font-weight: 700; font-size: 1.05rem;" />
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
                  <input type="text" class="form-control-input story-inp-image" value="${story.image || ''}" data-idx="${idx}" placeholder="https://... or uploaded image" style="font-size: 0.8125rem; margin-bottom: 6px;" />
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
                const dataUrl = await readAndOptimizeImage(file, 1000, 650, 0.78);
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

        tempModalImageSrc = currentImg;
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

        if (modalDropzone) {
          modalDropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            modalDropzone.style.borderColor = '#00BA66';
            modalDropzone.style.background = '#F0FDF4';
          });
          modalDropzone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            modalDropzone.style.borderColor = '#CBD5E1';
            modalDropzone.style.background = '#FFFFFF';
          });
          modalDropzone.addEventListener('drop', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            modalDropzone.style.borderColor = '#CBD5E1';
            modalDropzone.style.background = '#FFFFFF';
            const file = e.dataTransfer?.files?.[0];
            if (file) {
              try {
                showToast('Optimizing dropped picture... ⏳');
                tempModalImageSrc = await readAndOptimizeImage(file, 1000, 650, 0.78);
                if (modalPreviewImg) modalPreviewImg.src = tempModalImageSrc;
                if (modalPreviewCaption && modalCaptionInput) modalPreviewCaption.textContent = modalCaptionInput.value.trim();
                if (modalPreviewCard) modalPreviewCard.style.display = 'block';
                showToast('Image ready to apply! 🖼️');
              } catch (err) {
                showToast('Could not load dropped image file.');
              }
            }
          });
        }

        if (modalFileInput) {
          modalFileInput.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              try {
                showToast('Optimizing picture... ⏳');
                tempModalImageSrc = await readAndOptimizeImage(file, 1000, 650, 0.78);
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
            syncFormDataToCardData();
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

        // Universal Save & Publish Handler
        function executeSaveAndPublish(e) {
          if (e && e.preventDefault) e.preventDefault();
          syncFormDataToCardData();

          const origSlug = document.getElementById('edit-orig-slug')?.value || '';
          const isNewVal = document.getElementById('edit-is-new-val')?.value === 'true';
          const title = (document.getElementById('editor-title')?.value || '').trim();
          let slug = (document.getElementById('editor-slug')?.value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          const subtitle = (document.getElementById('editor-subtitle')?.value || '').trim();
          const tag = document.getElementById('editor-tag')?.value || 'News';
          const date = (document.getElementById('editor-date')?.value || '').trim() || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
          const reading_time = (document.getElementById('editor-reading-time')?.value || '').trim() || '4 minutes';
          const image_url = (document.getElementById('editor-image')?.value || '').trim() || 'assets/logo.jpg';
          const author = (document.getElementById('editor-author')?.value || '').trim() || 'AIRA';

          if (!title) {
            showToast('⚠️ Please enter an article title!');
            if (activeTab !== 'cards') setViewTab('cards');
            document.getElementById('editor-title')?.focus();
            return;
          }

          if (!slug) {
            slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          }
          if (!slug) {
            slug = 'post-' + Date.now();
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
            showToast('🎉 New newsletter edition published successfully!');

            // Automatically trigger newsletter broadcast to subscribers
            if (typeof window !== 'undefined' && window.EmailService) {
              const subList = JSON.parse(localStorage.getItem('aira_subscribers') || '[]');
              if (subList.length > 0 && confirm(`🚀 Broadcast newsletter email for "${newArt.title}" to all ${subList.length} subscribers now?`)) {
                window.EmailService.broadcastArticle(newArt).then(res => {
                  showToast(`🚀 Dispatched newsletter email to ${res.sent} subscribers!`);
                });
              }
            }
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
            } else {
              saveArticles([{
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
              }, ...state.articles]);
              showToast('💾 Article saved successfully!');
            }
          }

          state.adminEditingArticle = null;
          state.adminTab = 'articles';
          renderAdminPage();
        }

        const form = document.getElementById('inline-article-form');
        if (form) {
          form.addEventListener('submit', executeSaveAndPublish);
        }
        document.getElementById('btn-save-publish-top')?.addEventListener('click', executeSaveAndPublish);
        document.getElementById('btn-save-publish-bottom')?.addEventListener('click', executeSaveAndPublish);
      }

      renderEditorUi();
      return;
    }

    // =========================================================================
    // ADMIN DASHBOARD DATA PREPARATION
    // =========================================================================
    const rawSubscribers = JSON.parse(localStorage.getItem('aira_subscribers') || '[]');
    const normalizedSubscribers = rawSubscribers.map((item, idx) => {
      if (typeof item === 'string') {
        return { id: idx + 1, email: item, date: 'Earlier', source: 'Website Form' };
      }
      return { id: idx + 1, email: item.email, date: item.date || 'Earlier', source: item.source || 'Website Form' };
    });

    const allSubmissions = getToolSubmissions();
    const pendingSubmissions = allSubmissions.filter(s => (s.status || 'pending') === 'pending');
    const approvedSubmissions = allSubmissions.filter(s => s.status === 'approved');
    const rejectedSubmissions = allSubmissions.filter(s => s.status === 'rejected');

    const allToolsList = getAllTools();
    const allDealsList = getAllDeals();

    const rawComments = JSON.parse(localStorage.getItem('aira_comments') || '{}');
    const flatComments = [];
    Object.keys(rawComments).forEach(slug => {
      const postComments = rawComments[slug] || [];
      postComments.forEach((c, cIdx) => {
        flatComments.push({
          postSlug: slug,
          author: c.author || 'AI Enthusiast',
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

    // RENDER ADMIN DASHBOARD HTML (Design 2 Light SaaS Layout)
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
              ${pendingSubmissions.length > 0 ? `<span class="saas-nav-badge">${pendingSubmissions.length}</span>` : `<span class="saas-nav-count">${allSubmissions.length}</span>`}
            </button>
            <button type="button" class="saas-nav-btn ${activeTab === 'deals' ? 'active' : ''}" data-admin-tab="deals">
              <span>🏷️</span>
              <span>Deals & Monetization</span>
              <span class="saas-nav-count">${allDealsList.length}</span>
            </button>
            <button type="button" class="saas-nav-btn ${activeTab === 'articles' ? 'active' : ''}" data-admin-tab="articles">
              <span>📰</span>
              <span>Newsletter Articles</span>
              <span class="saas-nav-count">${state.articles.length}</span>
            </button>
            <button type="button" class="saas-nav-btn ${activeTab === 'subscribers' ? 'active' : ''}" data-admin-tab="subscribers">
              <span>📬</span>
              <span>Subscribers CRM</span>
              <span class="saas-nav-count">${normalizedSubscribers.length}</span>
            </button>
            <button type="button" class="saas-nav-btn ${activeTab === 'emails' ? 'active' : ''}" data-admin-tab="emails">
              <span>📧</span>
              <span>Email Automation</span>
              <span class="saas-nav-badge" style="background: #047857; color: white;">⚡ Auto</span>
            </button>
            <button type="button" class="saas-nav-btn ${activeTab === 'comments' ? 'active' : ''}" data-admin-tab="comments">
              <span>💬</span>
              <span>Comments Moderation</span>
              <span class="saas-nav-count">${flatComments.length}</span>
            </button>
            <button type="button" class="saas-nav-btn ${activeTab === 'settings' ? 'active' : ''}" data-admin-tab="settings">
              <span>⚙️</span>
              <span>Backup & Settings</span>
            </button>
          </nav>

          <div class="saas-sidebar-footer">
            <button type="button" class="saas-nav-btn ${activeTab === 'settings' ? 'active' : ''}" data-admin-tab="settings">
              <span>⚙️</span>
              <span>Settings</span>
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
              <span style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 0.72rem; font-weight: 700; color: #94A3B8; background: #E2E8F0; padding: 2px 6px; border-radius: 4px;">Ctrl K</span>
            </div>

            <div class="saas-topbar-actions">
              <button type="button" style="background: transparent; border: 1px solid #E2E8F0; border-radius: 10px; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748B; position: relative;" title="Pending Notifications" onclick="document.querySelector('[data-admin-tab=submissions]').click()">
                <span>🔔</span>
                ${pendingSubmissions.length > 0 ? `<span style="position: absolute; top: 7px; right: 7px; width: 8px; height: 8px; border-radius: 50%; background: #EF4444;"></span>` : ''}
              </button>

              <button type="button" class="saas-btn-primary" id="btn-topbar-new-article">
                <span>+</span>
                <span>New Article</span>
              </button>

              <div class="saas-user-pill">
                <img src="assets/logo.jpg" alt="Admin" class="saas-user-avatar" onerror="this.src='assets/logo.svg'" />
                <span>AIRA Editorial Team</span>
                <span style="color: #94A3B8; font-size: 0.75rem;">▾</span>
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
                      <div style="font-size: 0.78rem; font-weight: 700; color: #047857; margin-top: 4px; display: flex; align-items: center; gap: 4px;">
                        <span>↑ 12.4%</span>
                        <span style="color: #94A3B8; font-weight: 500;">this month</span>
                      </div>
                    </div>
                    <svg class="saas-sparkline-svg" viewBox="0 0 100 32">
                      <path d="M 0 28 Q 25 22, 50 14 T 100 4" fill="none" stroke="#047857" stroke-width="2.5" stroke-linecap="round"/>
                      <path d="M 0 28 Q 25 22, 50 14 T 100 4 L 100 32 L 0 32 Z" fill="rgba(4,120,87,0.08)"/>
                    </svg>
                  </div>
                </div>

                <!-- KPI 2: Submissions -->
                <div class="saas-kpi-card" style="cursor: pointer;" onclick="document.querySelector('[data-admin-tab=submissions]').click()">
                  <div class="saas-kpi-header">
                    <span class="saas-kpi-title">Pending Submissions</span>
                    <span class="saas-kpi-dots">•••</span>
                  </div>
                  <div class="saas-kpi-bottom">
                    <div>
                      <div class="saas-kpi-num" style="color: ${pendingSubmissions.length > 0 ? '#DC2626' : '#0F172A'};">${pendingSubmissions.length}</div>
                      <div style="font-size: 0.78rem; font-weight: 700; color: ${pendingSubmissions.length > 0 ? '#DC2626' : '#047857'}; margin-top: 4px;">
                        ${pendingSubmissions.length > 0 ? '⚠️ Review required' : '✓ All reviewed'}
                      </div>
                    </div>
                    <svg class="saas-sparkline-svg" viewBox="0 0 100 32">
                      <path d="M 0 24 Q 30 28, 60 16 T 100 8" fill="none" stroke="${pendingSubmissions.length > 0 ? '#EF4444' : '#047857'}" stroke-width="2.5" stroke-linecap="round"/>
                      <path d="M 0 24 Q 30 28, 60 16 T 100 8 L 100 32 L 0 32 Z" fill="${pendingSubmissions.length > 0 ? 'rgba(239,68,68,0.08)' : 'rgba(4,120,87,0.08)'}"/>
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
                      <div style="font-size: 0.78rem; font-weight: 700; color: #047857; margin-top: 4px; display: flex; align-items: center; gap: 4px;">
                        <span>↑ 8 added</span>
                        <span style="color: #94A3B8; font-weight: 500;">verified active</span>
                      </div>
                    </div>
                    <svg class="saas-sparkline-svg" viewBox="0 0 100 32">
                      <path d="M 0 26 Q 30 20, 65 10 T 100 4" fill="none" stroke="#047857" stroke-width="2.5" stroke-linecap="round"/>
                      <path d="M 0 26 Q 30 20, 65 10 T 100 4 L 100 32 L 0 32 Z" fill="rgba(4,120,87,0.08)"/>
                    </svg>
                  </div>
                </div>

                <!-- KPI 4: Published Articles -->
                <div class="saas-kpi-card" style="cursor: pointer;" onclick="document.querySelector('[data-admin-tab=articles]').click()">
                  <div class="saas-kpi-header">
                    <span class="saas-kpi-title">Published Articles</span>
                    <span class="saas-kpi-dots">•••</span>
                  </div>
                  <div class="saas-kpi-bottom">
                    <div>
                      <div class="saas-kpi-num">${state.articles.length}</div>
                      <div style="font-size: 0.78rem; font-weight: 700; color: #047857; margin-top: 4px; display: flex; align-items: center; gap: 4px;">
                        <span>✓ Issue ready</span>
                        <span style="color: #94A3B8; font-weight: 500;">this week</span>
                      </div>
                    </div>
                    <svg class="saas-sparkline-svg" viewBox="0 0 100 32">
                      <path d="M 0 22 Q 35 24, 65 10 T 100 4" fill="none" stroke="#047857" stroke-width="2.5" stroke-linecap="round"/>
                      <path d="M 0 22 Q 35 24, 65 10 T 100 4 L 100 32 L 0 32 Z" fill="rgba(4,120,87,0.08)"/>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Main 2-Column Split (65% / 35%) -->
              <div class="saas-dashboard-split">
                
                <!-- Left Column (65%): Pending Tool Submissions -->
                <div class="saas-panel-card">
                  <div class="saas-panel-header">
                    <h3 class="saas-panel-title">Pending AI Tool Submissions for Review</h3>
                    <span style="font-size: 0.8rem; font-weight: 700; color: #B45309; background: #FEF3C7; padding: 3px 10px; border-radius: 9999px;">
                      ${pendingSubmissions.length} pending
                    </span>
                  </div>
                  <p class="saas-panel-sub">Founders submit tools on /#/submit. Review and click "Approve & Publish" to go live.</p>

                  <div class="saas-submissions-grid">
                    ${pendingSubmissions.length === 0 ? `
                      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 12px;">
                        <div style="font-size: 2rem; margin-bottom: 8px;">✨</div>
                        <h4 style="font-size: 1rem; font-weight: 800; color: #0F172A; margin-bottom: 4px;">All submissions reviewed!</h4>
                        <p style="font-size: 0.85rem; color: #64748B; margin-bottom: 14px;">When new tools are submitted, they will appear here with 1-click approval.</p>
                        <a href="#/submit" target="_blank" class="saas-btn-primary" style="text-decoration: none; font-size: 0.8rem; display: inline-flex;">+ Submit a Tool</a>
                      </div>
                    ` : pendingSubmissions.map(sub => {
                      const cleanDomain = (sub.toolUrl || '').replace(/^https?:\/\//, '').split('/')[0].trim() || 'ai.com';
                      const logoUrl = `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
                      return `
                        <div class="saas-sub-card">
                          <div>
                            <div class="saas-sub-top">
                              <img src="${logoUrl}" alt="${sub.toolName}" class="saas-sub-logo" onerror="this.src='assets/logo.svg'" />
                              <div style="min-width: 0; flex: 1;">
                                <h4 class="saas-sub-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${sub.toolName}</h4>
                                <div style="display: flex; gap: 4px; align-items: center; margin-top: 2px;">
                                  <span class="tool-badge-pricing pricing-${(sub.pricing || 'freemium').toLowerCase().replace(/\s+/g, '-')}">${sub.pricing}</span>
                                  <span style="font-size: 0.7rem; color: #64748B;">${sub.category}</span>
                                </div>
                              </div>
                            </div>

                            <p class="saas-sub-info">
                              ${sub.tagline || sub.description || 'Modern AI product submitted for community curation.'}
                            </p>
                          </div>

                          <div>
                            <div style="font-size: 0.72rem; color: #94A3B8; margin-bottom: 10px;">
                              By <strong>${sub.contactEmail}</strong> • ${new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>

                            <div class="saas-sub-actions">
                              <button class="btn-saas-approve btn-quick-approve" data-sub-id="${sub.id}">
                                ✓ Approve & Publish
                              </button>
                              <button class="btn-saas-reject btn-reject-sub" data-sub-id="${sub.id}" title="Reject submission">
                                ✕
                              </button>
                              <a href="${sub.toolUrl}" target="_blank" class="btn-saas-reject" style="text-decoration: none;" title="Open website">
                                ↗
                              </a>
                            </div>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>

                <!-- Right Column (35%): Analytics & Top Deals -->
                <div style="display: flex; flex-direction: column; gap: 24px;">
                  
                  <!-- Growth Widget -->
                  <div class="saas-panel-card">
                    <div class="saas-panel-header">
                      <h3 class="saas-panel-title">Latest Subscribers Growth</h3>
                      <span style="font-size: 0.78rem; font-weight: 700; color: #047857;">+18.2% vs last week</span>
                    </div>

                    <!-- Mini Growth Curve SVG -->
                    <div style="margin: 16px 0; background: #F8FAFC; border-radius: 12px; padding: 12px; border: 1px solid #E2E8F0;">
                      <svg viewBox="0 0 300 80" style="width: 100%; height: 70px; overflow: visible;">
                        <defs>
                          <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#10B981" stop-opacity="0.3"/>
                            <stop offset="100%" stop-color="#10B981" stop-opacity="0.0"/>
                          </linearGradient>
                        </defs>
                        <path d="M 0 65 Q 50 60, 100 48 T 200 28 T 300 10 L 300 80 L 0 80 Z" fill="url(#growthGrad)"/>
                        <path d="M 0 65 Q 50 60, 100 48 T 200 28 T 300 10" fill="none" stroke="#047857" stroke-width="3" stroke-linecap="round"/>
                        <circle cx="300" cy="10" r="4" fill="#047857"/>
                      </svg>
                      <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: #94A3B8; margin-top: 4px;">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                      </div>
                    </div>

                    <!-- Latest 4 Subscribers -->
                    <div>
                      <div style="font-size: 0.8rem; font-weight: 700; color: #64748B; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Recent Signups</div>
                      ${normalizedSubscribers.length === 0 ? `
                        <div style="font-size: 0.82rem; color: #94A3B8; padding: 12px 0;">No subscribers recorded yet.</div>
                      ` : normalizedSubscribers.slice(-4).reverse().map(s => `
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #F1F5F9; font-size: 0.82rem;">
                          <div style="font-weight: 600; color: #0F172A; font-family: monospace; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">${s.email}</div>
                          <span style="font-size: 0.72rem; color: #64748B; background: #F1F5F9; padding: 2px 6px; border-radius: 4px;">${s.source}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>

                  <!-- Top Affiliate Deals Widget -->
                  <div class="saas-panel-card">
                    <div class="saas-panel-header">
                      <h3 class="saas-panel-title">Top Affiliate Deals</h3>
                      <button type="button" class="btn-overview-action" id="widget-btn-add-deal" style="background: transparent; border: none; font-size: 0.8rem; font-weight: 700; color: #047857; cursor: pointer;">+ Add Deal</button>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 12px;">
                      ${allDealsList.slice(0, 4).map(d => `
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px;">
                          <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="${d.image || 'assets/logo.svg'}" alt="${d.toolName}" style="width: 28px; height: 28px; border-radius: 6px; object-fit: cover;" onerror="this.src='assets/logo.svg'" />
                            <div>
                              <div style="font-weight: 700; font-size: 0.85rem; color: #0F172A;">${d.toolName}</div>
                              <span style="font-size: 0.72rem; color: #64748B;">${d.couponCode ? `Code: ${d.couponCode}` : 'Direct Discount'}</span>
                            </div>
                          </div>
                          <span style="font-size: 0.75rem; font-weight: 700; background: #FEF3C7; color: #B45309; padding: 3px 7px; border-radius: 6px;">${d.discountBadge}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>

                </div>

              </div>
            ` : ''}

            <!-- ============================================================= -->
            <!-- TAB 2: TOOL SUBMISSIONS -->
            <!-- ============================================================= -->
            ${activeTab === 'submissions' ? `
              <div class="saas-panel-card" style="margin-bottom: 24px;">
                <div class="saas-panel-header" style="flex-wrap: wrap; gap: 14px;">
                  <div>
                    <h3 class="saas-panel-title">AI Tool Submissions & Approvals (${allSubmissions.length})</h3>
                    <p class="saas-panel-sub" style="margin: 4px 0 0 0;">Review submissions, approve to publish live on /#/tools, or reject.</p>
                  </div>
                  <div style="display: flex; gap: 10px; align-items: center;">
                    <a href="#/submit" target="_blank" class="saas-btn-primary" style="text-decoration: none; font-size: 0.82rem;">🚀 Open Submit Form ↗</a>
                  </div>
                </div>

                <!-- Filters & Search -->
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; margin: 18px 0; flex-wrap: wrap;">
                  <div style="display: flex; gap: 8px; align-items: center; flex: 1; max-width: 400px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 8px 14px;">
                    <span style="color: #94A3B8;">🔍</span>
                    <input type="text" id="admin-search-submissions" value="${state.adminSubmissionSearch || ''}" placeholder="Search submissions by tool name, email..." style="width: 100%; border: none; background: transparent; outline: none; font-size: 0.9rem; color: #0F172A;" />
                  </div>

                  <div class="filter-pills" style="margin: 0;">
                    <button class="filter-pill ${subFilter === 'all' ? 'active' : ''}" data-sub-filter="all">All (${allSubmissions.length})</button>
                    <button class="filter-pill ${subFilter === 'pending' ? 'active' : ''}" data-sub-filter="pending">Pending (${pendingSubmissions.length})</button>
                    <button class="filter-pill ${subFilter === 'approved' ? 'active' : ''}" data-sub-filter="approved">Approved (${approvedSubmissions.length})</button>
                    <button class="filter-pill ${subFilter === 'rejected' ? 'active' : ''}" data-sub-filter="rejected">Rejected (${rejectedSubmissions.length})</button>
                  </div>
                </div>

                <!-- Submissions Cards Grid -->
                <div style="display: flex; flex-direction: column; gap: 14px;">
                  ${filteredSubmissions.length === 0 ? `
                    <div style="padding: 48px 20px; text-align: center; color: #64748B;">
                      <div style="font-size: 2.5rem; margin-bottom: 12px;">🚀</div>
                      <h4 style="font-size: 1.15rem; font-weight: 800; color: #0F172A; margin-bottom: 6px;">No tool submissions in this filter</h4>
                      <p style="font-size: 0.9rem;">Founders submit AI products via <code>/#/submit</code>.</p>
                    </div>
                  ` : filteredSubmissions.map(sub => {
                    const isPending = (sub.status || 'pending') === 'pending';
                    const isApproved = sub.status === 'approved';
                    const isRejected = sub.status === 'rejected';
                    const cleanDomain = (sub.toolUrl || '').replace(/^https?:\/\//, '').split('/')[0].trim() || 'ai.com';
                    const logoUrl = `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;

                    return `
                      <div class="saas-panel-card" style="border: 1px solid ${isPending ? '#FDE68A' : isApproved ? '#A7F3D0' : '#FECACA'}; background: ${isPending ? '#FFFDF5' : isApproved ? '#F8FDFB' : '#FFFBFB'}; padding: 18px;" data-sub-id="${sub.id}">
                        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 12px; flex-wrap: wrap;">
                          <div style="display: flex; align-items: center; gap: 12px;">
                            <img src="${logoUrl}" alt="${sub.toolName}" style="width: 44px; height: 44px; border-radius: 10px; object-fit: cover; border: 1px solid #E2E8F0;" onerror="this.src='assets/logo.svg'" />
                            <div>
                              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                                <h3 style="font-size: 1.25rem; font-weight: 900; color: #0F172A; margin: 0;">${sub.toolName}</h3>
                                <span class="tool-badge-pricing pricing-${(sub.pricing || 'freemium').toLowerCase().replace(/\s+/g, '-')}">${sub.pricing}</span>
                                <span class="tool-category-badge">${sub.category}</span>
                                ${isPending ? `<span style="font-size: 0.75rem; font-weight: 700; color: #B45309; background: #FEF3C7; padding: 2px 8px; border-radius: 6px;">⏳ Pending Review</span>` : ''}
                                ${isApproved ? `<span style="font-size: 0.75rem; font-weight: 700; color: #047857; background: #E8FDF2; padding: 2px 8px; border-radius: 6px;">✓ Live & Approved</span>` : ''}
                                ${isRejected ? `<span style="font-size: 0.75rem; font-weight: 700; color: #DC2626; background: #FEE2E2; padding: 2px 8px; border-radius: 6px;">✕ Rejected</span>` : ''}
                              </div>
                              <div style="font-size: 0.8rem; color: #64748B; margin-top: 3px;">
                                Submitted on ${new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • By <strong>${sub.contactEmail}</strong>
                              </div>
                            </div>
                          </div>

                          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                            ${isPending ? `
                              <button class="btn-saas-approve btn-approve-sub" data-sub-id="${sub.id}">
                                ✓ Approve & Publish
                              </button>
                              <button class="btn-saas-reject btn-reject-sub" data-sub-id="${sub.id}">
                                ✕ Reject
                              </button>
                            ` : ''}
                            
                            ${isApproved ? `
                              <a href="#/tools/${(sub.toolName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}" target="_blank" style="background: #E8FDF2; color: #047857; border: 1px solid #A7F3D0; font-weight: 700; padding: 7px 14px; border-radius: 8px; text-decoration: none; font-size: 0.82rem;">
                                🟢 View Live on Site ↗
                              </a>
                            ` : ''}

                            ${isRejected ? `
                              <button class="btn-saas-approve btn-approve-sub" data-sub-id="${sub.id}">
                                🔄 Re-approve
                              </button>
                            ` : ''}

                            <button class="btn-saas-reject btn-delete-sub" data-sub-id="${sub.id}" style="color: #EF4444;" title="Delete Submission">
                              🗑️
                            </button>
                          </div>
                        </div>

                        <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 14px; margin-bottom: 10px;">
                          <div style="font-weight: 700; font-size: 0.92rem; color: #0F172A; margin-bottom: 4px;">${sub.tagline}</div>
                          <p style="font-size: 0.85rem; color: #64748B; line-height: 1.45; margin: 0;">${sub.description}</p>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; font-size: 0.8rem; color: #64748B;">
                          <div><strong>Website:</strong> <a href="${sub.toolUrl}" target="_blank" style="color: #2563EB;">${sub.toolUrl} ↗</a></div>
                          <div><strong>Features:</strong> ${sub.features || 'Standard AI capabilities'}</div>
                          <div><strong>Promo Code:</strong> <span style="font-family: monospace; font-weight: 700; color: #B45309;">${sub.promoCode || 'None'}</span></div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            ` : ''}

            <!-- ============================================================= -->
            <!-- TAB 3: DEALS & MONETIZATION -->
            <!-- ============================================================= -->
            ${activeTab === 'deals' ? `
              <div class="saas-panel-card">
                <div class="saas-panel-header" style="flex-wrap: wrap; gap: 14px;">
                  <div>
                    <h3 class="saas-panel-title">Affiliate Deals & Monetization (${allDealsList.length})</h3>
                    <p class="saas-panel-sub" style="margin: 4px 0 0 0;">Manage discount coupons, affiliate links, and monetization campaigns.</p>
                  </div>
                  <div style="display: flex; gap: 10px;">
                    <button id="btn-open-add-deal-modal" class="saas-btn-primary">
                      ➕ Add New Deal
                    </button>
                  </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; margin: 18px 0; flex-wrap: wrap;">
                  <div style="display: flex; gap: 8px; align-items: center; flex: 1; max-width: 400px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 8px 14px;">
                    <span style="color: #94A3B8;">🔍</span>
                    <input type="text" id="admin-search-deals" value="${state.adminDealSearch || ''}" placeholder="Search deals by tool name, coupon code..." style="width: 100%; border: none; background: transparent; outline: none; font-size: 0.9rem; color: #0F172A;" />
                  </div>
                  <a href="#/deals" target="_blank" class="btn-saas-reject" style="text-decoration: none;">View Deals Hub ↗</a>
                </div>

                <div style="overflow-x: auto;">
                  <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
                    <thead>
                      <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; color: #64748B; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                        <th style="padding: 12px 16px;">Tool / Brand</th>
                        <th style="padding: 12px 16px;">Discount</th>
                        <th style="padding: 12px 16px;">Headline & Offer</th>
                        <th style="padding: 12px 16px;">Coupon Code</th>
                        <th style="padding: 12px 16px;">Affiliate URL</th>
                        <th style="padding: 12px 16px; text-align: right;">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${filteredDeals.map(d => `
                        <tr style="border-bottom: 1px solid #F1F5F9;">
                          <td style="padding: 12px 16px; white-space: nowrap;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                              <img src="${d.image || 'assets/logo.svg'}" alt="${d.toolName}" style="width: 32px; height: 32px; border-radius: 8px; object-fit: cover; border: 1px solid #E2E8F0;" onerror="this.src='assets/logo.svg'" />
                              <div>
                                <div style="font-weight: 800; color: #0F172A;">${d.toolName}</div>
                                <span style="font-size: 0.75rem; color: #64748B;">${d.category}</span>
                              </div>
                            </div>
                          </td>
                          <td style="padding: 12px 16px;">
                            <span style="background: #FEF3C7; color: #B45309; border: 1px solid #FDE68A; font-weight: 800; font-size: 0.75rem; padding: 3px 8px; border-radius: 6px;">${d.discountBadge}</span>
                          </td>
                          <td style="padding: 12px 16px; max-width: 240px;">
                            <div style="font-weight: 600; color: #0F172A; font-size: 0.85rem; line-height: 1.3;">${d.headline}</div>
                          </td>
                          <td style="padding: 12px 16px; font-family: monospace; font-weight: 700; color: #047857;">
                            ${d.couponCode || '—'}
                          </td>
                          <td style="padding: 12px 16px; max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                            <a href="${d.url}" target="_blank" style="color: #2563EB; font-size: 0.82rem; text-decoration: none;">${d.domain || d.url} ↗</a>
                          </td>
                          <td style="padding: 12px 16px; text-align: right; white-space: nowrap;">
                            <button class="btn-saas-reject btn-edit-deal" data-deal-id="${d.id}" style="padding: 5px 10px;">✏️ Edit</button>
                            <button class="btn-saas-reject btn-delete-deal" data-deal-id="${d.id}" style="padding: 5px 10px; color: #EF4444;">🗑️</button>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            ` : ''}

            <!-- ============================================================= -->
            <!-- TAB 4: ARTICLES & EDITORIAL BUILDER -->
            <!-- ============================================================= -->
            ${activeTab === 'articles' ? `
              <div class="saas-panel-card">
                <div class="saas-panel-header" style="flex-wrap: wrap; gap: 14px;">
                  <div>
                    <h3 class="saas-panel-title">Newsletter Articles Library (${filteredAdminArticles.length})</h3>
                    <p class="saas-panel-sub" style="margin: 4px 0 0 0;">Create, edit, and publish weekly AI newsletter editions.</p>
                  </div>
                  <div style="display: flex; gap: 10px;">
                    <button id="btn-add-new-article" class="saas-btn-primary">
                      ➕ New Article
                    </button>
                    <button id="btn-download-articles-js" class="btn-saas-reject" style="display: inline-flex; align-items: center; gap: 6px;">
                      💾 Export articles.js
                    </button>
                  </div>
                </div>

                <!-- Search & Filters -->
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; margin: 18px 0; flex-wrap: wrap;">
                  <div style="display: flex; gap: 8px; align-items: center; flex: 1; max-width: 400px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 8px 14px;">
                    <span style="color: #94A3B8;">🔍</span>
                    <input type="text" id="admin-search-articles" value="${state.adminArticleSearch || ''}" placeholder="Search articles by title, slug..." style="width: 100%; border: none; background: transparent; outline: none; font-size: 0.9rem; color: #0F172A;" />
                  </div>

                  <div class="filter-pills" style="margin: 0;">
                    <button class="filter-pill ${articleTagFilter === 'All' ? 'active' : ''}" data-admin-tag="All">All (${state.articles.length})</button>
                    <button class="filter-pill ${articleTagFilter === 'News' ? 'active' : ''}" data-admin-tag="News">News</button>
                    <button class="filter-pill ${articleTagFilter === 'Prompts' ? 'active' : ''}" data-admin-tag="Prompts">Prompts</button>
                  </div>
                </div>

                <div style="overflow-x: auto;">
                  <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
                    <thead>
                      <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; color: #64748B; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                        <th style="padding: 12px 16px;">Cover</th>
                        <th style="padding: 12px 16px;">Title & Slug</th>
                        <th style="padding: 12px 16px;">Category</th>
                        <th style="padding: 12px 16px;">Date</th>
                        <th style="padding: 12px 16px; text-align: right;">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${filteredAdminArticles.map(a => `
                        <tr style="border-bottom: 1px solid #F1F5F9;">
                          <td style="padding: 12px 16px; width: 60px;">
                            <img src="${a.image_url}" alt="${a.title}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover; border: 1px solid #E2E8F0;" onerror="this.src='assets/logo.jpg'" />
                          </td>
                          <td style="padding: 12px 16px; max-width: 360px;">
                            <div style="font-weight: 700; color: #0F172A; font-size: 0.92rem; line-height: 1.35; margin-bottom: 3px;">${a.title}</div>
                            <div style="font-size: 0.75rem; color: #94A3B8; font-family: monospace;">#slug: ${a.slug}</div>
                          </td>
                          <td style="padding: 12px 16px;">
                            <span style="background: #F1F5F9; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; color: #0F172A;">${a.tag || 'News'}</span>
                          </td>
                          <td style="padding: 12px 16px; color: #64748B; font-size: 0.8rem; white-space: nowrap;">
                            ${a.date || 'Recent'}
                          </td>
                          <td style="padding: 12px 16px; text-align: right; white-space: nowrap;">
                            <div style="display: inline-flex; gap: 6px; align-items: center;">
                              <button class="saas-btn-primary btn-edit-article" data-slug="${a.slug}" style="padding: 6px 12px; font-size: 0.8rem;">
                                ✏️ Edit
                              </button>
                              <button class="btn-broadcast-single-article" data-slug="${a.slug}" style="padding: 6px 10px; font-size: 0.8rem; background: #047857; color: #FFFFFF; border: none; border-radius: 6px; cursor: pointer; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;" title="Send this edition to all subscribers">
                                📧 Broadcast
                              </button>
                              <a href="#/p/${a.slug}" target="_blank" class="btn-saas-reject" style="padding: 6px 10px; font-size: 0.8rem; text-decoration: none;">
                                👁️ View
                              </a>
                              <button class="btn-saas-reject btn-delete-article" data-slug="${a.slug}" style="padding: 6px 10px; color: #EF4444;" title="Delete Article">
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            ` : ''}

            <!-- ============================================================= -->
            <!-- TAB 5: SUBSCRIBERS CRM -->
            <!-- ============================================================= -->
            ${activeTab === 'subscribers' ? `
              <div class="saas-panel-card">
                <div class="saas-panel-header" style="flex-wrap: wrap; gap: 14px;">
                  <div>
                    <h3 class="saas-panel-title">Subscribers CRM & Audience (${filteredSubscribers.length})</h3>
                    <p class="saas-panel-sub" style="margin: 4px 0 0 0;">Manage captured newsletter leads and export CSV for email broadcasting.</p>
                  </div>
                  <div style="display: flex; gap: 10px;">
                    <button id="btn-copy-emails" class="btn-saas-reject">
                      📋 Copy Emails
                    </button>
                    <button id="btn-export-csv" class="saas-btn-primary">
                      📥 Export CSV
                    </button>
                  </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; margin: 18px 0; flex-wrap: wrap;">
                  <div style="display: flex; gap: 8px; align-items: center; flex: 1; max-width: 400px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 8px 14px;">
                    <span style="color: #94A3B8;">🔍</span>
                    <input type="text" id="admin-search-subscribers" value="${state.adminSubscriberSearch || ''}" placeholder="Search subscribers by email..." style="width: 100%; border: none; background: transparent; outline: none; font-size: 0.9rem; color: #0F172A;" />
                  </div>
                </div>

                <div style="overflow-x: auto;">
                  <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
                    <thead>
                      <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; color: #64748B; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                        <th style="padding: 12px 18px;">#</th>
                        <th style="padding: 12px 18px;">Email Address</th>
                        <th style="padding: 12px 18px;">Date & Time</th>
                        <th style="padding: 12px 18px;">Form Source</th>
                        <th style="padding: 12px 18px; text-align: right;">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${filteredSubscribers.map((sub, idx) => `
                        <tr style="border-bottom: 1px solid #F1F5F9;">
                          <td style="padding: 14px 18px; color: #94A3B8;">${idx + 1}</td>
                          <td style="padding: 14px 18px; font-weight: 600; color: #0F172A; font-family: monospace; font-size: 0.9rem;">${sub.email}</td>
                          <td style="padding: 14px 18px; color: #64748B;">${sub.date}</td>
                          <td style="padding: 14px 18px;"><span style="background: #F1F5F9; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; color: #0F172A;">${sub.source}</span></td>
                          <td style="padding: 14px 18px; text-align: right;">
                            <button class="btn-saas-reject btn-delete-subscriber" data-email="${sub.email}" style="padding: 4px 8px; color: #EF4444;">🗑️</button>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            ` : ''}

            <!-- ============================================================= -->
            <!-- TAB 6: COMMENTS MODERATION -->
            <!-- ============================================================= -->
            ${activeTab === 'comments' ? `
              <div class="saas-panel-card">
                <div class="saas-panel-header">
                  <div>
                    <h3 class="saas-panel-title">Community Comments Moderation (${filteredComments.length})</h3>
                    <p class="saas-panel-sub" style="margin: 4px 0 0 0;">Moderate and remove reader comments across all article editions.</p>
                  </div>
                </div>

                <div style="overflow-x: auto; margin-top: 18px;">
                  <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
                    <thead>
                      <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; color: #64748B; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                        <th style="padding: 12px 16px;">Author</th>
                        <th style="padding: 12px 16px;">Article Slug</th>
                        <th style="padding: 12px 16px;">Comment Text</th>
                        <th style="padding: 12px 16px;">Date</th>
                        <th style="padding: 12px 16px; text-align: right;">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${filteredComments.map(c => `
                        <tr style="border-bottom: 1px solid #F1F5F9;">
                          <td style="padding: 12px 16px; font-weight: 700; color: #0F172A; white-space: nowrap;">${c.author}</td>
                          <td style="padding: 12px 16px; white-space: nowrap;">
                            <a href="#/p/${c.postSlug}" target="_blank" style="color: #2563EB; text-decoration: none;">#${c.postSlug} ↗</a>
                          </td>
                          <td style="padding: 12px 16px; color: #64748B; max-width: 320px;">${escapeHtml(c.text)}</td>
                          <td style="padding: 12px 16px; color: #94A3B8; font-size: 0.8rem; white-space: nowrap;">${c.date}</td>
                          <td style="padding: 12px 16px; text-align: right; white-space: nowrap;">
                            <button class="btn-saas-reject btn-delete-comment" data-slug="${c.postSlug}" data-index="${c.index}" style="padding: 5px 10px; color: #DC2626;">🗑️ Delete</button>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            ` : ''}

            <!-- ============================================================= -->
            <!-- TAB 7: BACKUP & SYSTEM SETTINGS -->
            <!-- ============================================================= -->
            ${activeTab === 'settings' ? `
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
                
                <!-- Full Backup -->
                <div class="saas-panel-card">
                  <div style="font-size: 2rem; margin-bottom: 12px;">📦</div>
                  <h3 class="saas-panel-title" style="margin-bottom: 6px;">1-Click Full System Backup</h3>
                  <p class="saas-panel-sub" style="margin-bottom: 20px;">
                    Download a complete JSON snapshot containing all articles, approved custom tools, submissions, deals, and subscribers.
                  </p>
                  <button id="btn-settings-export-backup" class="saas-btn-primary" style="background: #047857; width: 100%; justify-content: center; padding: 12px; margin-bottom: 16px;">
                    📥 Download Backup JSON File
                  </button>

                  <div style="border-top: 1px solid #E2E8F0; padding-top: 16px;">
                    <label style="display: block; font-weight: 700; font-size: 0.9rem; margin-bottom: 8px; color: #0F172A;">Restore from Backup File</label>
                    <input type="file" id="input-restore-backup" accept=".json" style="width: 100%; font-size: 0.85rem;" />
                  </div>
                </div>

                <!-- Supabase Cloud Connection -->
                <div class="saas-panel-card">
                  <div style="font-size: 2rem; margin-bottom: 12px;">⚡</div>
                  <h3 class="saas-panel-title" style="margin-bottom: 6px;">Cloud Database Sync</h3>
                  <p class="saas-panel-sub" style="margin-bottom: 14px;">
                    Connect Supabase backend to synchronize subscribers and ratings across reader devices.
                  </p>
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; font-family: monospace; font-size: 0.8rem; margin-bottom: 16px;">
                    Status: <strong>${typeof supabaseClient !== 'undefined' && supabaseClient ? '🟢 Supabase Cloud Active' : '⚪ LocalStorage Ready'}</strong><br/>
                    Config: <code>js/supabase.js</code>
                  </div>
                  <button id="btn-test-db-connection" class="btn-saas-reject" style="width: 100%; padding: 10px;">
                    🔍 Test Cloud Connection
                  </button>
                </div>

                <!-- Danger Zone -->
                <div class="saas-panel-card" style="grid-column: 1 / -1; border-color: #FECACA; background: #FFFBFB;">
                  <h3 class="saas-panel-title" style="color: #DC2626; margin-bottom: 6px;">⚠️ Danger Zone & Factory Reset</h3>
                  <p class="saas-panel-sub" style="margin-bottom: 16px;">
                    Restore original baseline states for individual sections if needed.
                  </p>
                  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    <button id="btn-reset-articles" class="btn-saas-reject" style="background: #FEE2E2; border-color: #FCA5A5; color: #DC2626;">
                      🔄 Reset Articles (192 Baseline)
                    </button>
                    <button id="btn-clear-custom-tools" class="btn-saas-reject">
                      🧹 Clear Custom Tools
                    </button>
                    <button id="btn-clear-custom-deals" class="btn-saas-reject">
                      🧹 Clear Custom Deals
                    </button>
                  </div>
                </div>

              </div>
            ` : ''}

            <!-- ============================================================= -->
            <!-- TAB 8: EMAIL AUTOMATION & NEWSLETTER BROADCASTS -->
            <!-- ============================================================= -->
            ${activeTab === 'emails' ? (() => {
              const emailLogs = typeof EmailService !== 'undefined' ? EmailService.getLogs() : [];
              const emailSettings = typeof EmailService !== 'undefined' ? EmailService.getSettings() : {};
              const welcomeCount = emailLogs.filter(l => l.type === 'welcome').length;
              const broadcastCount = emailLogs.filter(l => l.type === 'article_broadcast').length;
              
              return `
              <div style="display: flex; flex-direction: column; gap: 24px;">
                
                <!-- Top 4 Metrics -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
                  <div class="saas-kpi-card">
                    <div style="font-size: 0.8125rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Active Subscribers</div>
                    <div style="font-size: 1.8rem; font-weight: 900; color: #0F172A; margin: 4px 0;">${normalizedSubscribers.length}</div>
                    <div style="font-size: 0.8rem; color: #047857; font-weight: 700;">🟢 Live in Audience CRM</div>
                  </div>
                  <div class="saas-kpi-card">
                    <div style="font-size: 0.8125rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Welcome Emails Sent</div>
                    <div style="font-size: 1.8rem; font-weight: 900; color: #047857; margin: 4px 0;">${welcomeCount}</div>
                    <div style="font-size: 0.8rem; color: #64748B;">🎁 50 n8n Templates Included</div>
                  </div>
                  <div class="saas-kpi-card">
                    <div style="font-size: 0.8125rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Broadcast Editions Sent</div>
                    <div style="font-size: 1.8rem; font-weight: 900; color: #2563EB; margin: 4px 0;">${broadcastCount}</div>
                    <div style="font-size: 0.8rem; color: #64748B;">⚡ Newsletter Alerts</div>
                  </div>
                  <div class="saas-kpi-card">
                    <div style="font-size: 0.8125rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Delivery Engine</div>
                    <div style="font-size: 1.25rem; font-weight: 800; color: #0F172A; margin: 8px 0;">
                      ${emailSettings.resendApiKey ? 'Resend API 🚀' : emailSettings.webhookUrl ? 'n8n Webhook ⚡' : 'Auto Serverless 🟢'}
                    </div>
                    <div style="font-size: 0.8rem; color: #047857; font-weight: 600;">Automated Triggers Ready</div>
                  </div>
                </div>

                <!-- 1. Send / Broadcast Article Section -->
                <div class="saas-panel-card">
                  <div class="saas-panel-header" style="flex-wrap: wrap; gap: 12px;">
                    <div>
                      <h3 class="saas-panel-title">🚀 Broadcast Article Edition to All Subscribers</h3>
                      <p class="saas-panel-sub" style="margin: 4px 0 0 0;">Instantly send any published article as a responsive HTML newsletter email to all ${normalizedSubscribers.length} subscribers.</p>
                    </div>
                  </div>

                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 20px; margin-top: 18px;">
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px; align-items: flex-end; margin-bottom: 16px;">
                      <div>
                        <label style="display: block; font-weight: 700; font-size: 0.875rem; color: #0F172A; margin-bottom: 6px;">Select Article to Broadcast *</label>
                        <select id="email-broadcast-article-select" class="form-select" style="width: 100%; padding: 10px 14px; border: 1px solid #CBD5E1; border-radius: 8px; font-weight: 600; font-size: 0.9rem; background: #FFFFFF;">
                          ${state.articles.map((art, idx) => `
                            <option value="${art.slug}" ${idx === 0 ? 'selected' : ''}>
                              ${art.title} (${art.date || 'Recent'}) - [${art.tag || 'News'}]
                            </option>
                          `).join('')}
                        </select>
                      </div>

                      <div style="display: flex; gap: 10px;">
                        <button type="button" id="btn-preview-email-html" class="btn-saas-reject" style="flex: 1; padding: 10px; font-weight: 700;">
                          👁️ Preview HTML Email
                        </button>
                        <button type="button" id="btn-start-broadcast-send" class="saas-btn-primary" style="flex: 1; padding: 10px 18px; font-weight: 800; background: #047857;">
                          🚀 Send to All (${normalizedSubscribers.length})
                        </button>
                      </div>
                    </div>

                    <!-- Live Progress Bar (Hidden until broadcasting) -->
                    <div id="broadcast-progress-wrap" style="display: none; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin-top: 14px;">
                      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 8px;">
                        <span id="broadcast-progress-label">Dispatching newsletter emails...</span>
                        <span id="broadcast-progress-percent">0%</span>
                      </div>
                      <div style="width: 100%; height: 10px; background: #F1F5F9; border-radius: 999px; overflow: hidden;">
                        <div id="broadcast-progress-bar" style="width: 0%; height: 100%; background: #047857; transition: width 0.2s ease;"></div>
                      </div>
                      <div style="font-size: 0.75rem; color: #64748B; margin-top: 6px;" id="broadcast-progress-detail">Preparing subscriber queue...</div>
                    </div>
                  </div>
                </div>

                <!-- 2. Email Settings & Provider Configuration -->
                <div class="saas-panel-card">
                  <div class="saas-panel-header">
                    <div>
                      <h3 class="saas-panel-title">⚙️ Email Provider & Automation Settings</h3>
                      <p class="saas-panel-sub" style="margin: 4px 0 0 0;">Configure your preferred email delivery service (Resend API, n8n webhook, or Serverless SMTP).</p>
                    </div>
                  </div>

                  <form id="form-email-settings" style="margin-top: 18px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                      <div class="form-group">
                        <label class="form-label">Resend API Key (Recommended - 3,000 Free/Mo)</label>
                        <input type="password" id="input-resend-key" class="form-input" placeholder="re_1234567890abcdef..." value="${emailSettings.resendApiKey || ''}" />
                        <span style="font-size: 0.75rem; color: #64748B; margin-top: 3px; display: block;">Get your free API key at <a href="https://resend.com" target="_blank" style="color: #047857;">resend.com</a></span>
                      </div>

                      <div class="form-group">
                        <label class="form-label">n8n / Make / Webhook URL (Optional)</label>
                        <input type="url" id="input-email-webhook" class="form-input" placeholder="https://your-n8n-instance.com/webhook/aira-email" value="${emailSettings.webhookUrl || ''}" />
                        <span style="font-size: 0.75rem; color: #64748B; margin-top: 3px; display: block;">Triggers n8n / Make workflow on every signup & article release.</span>
                      </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                      <div class="form-group">
                        <label class="form-label">Sender Email Address</label>
                        <input type="text" id="input-sender-email" class="form-input" placeholder="AIRA Newsletter <onboarding@resend.dev>" value="${emailSettings.senderEmail || 'AIRA Newsletter <onboarding@resend.dev>'}" />
                      </div>

                      <div class="form-group">
                        <label class="form-label">Reply-To Email</label>
                        <input type="email" id="input-reply-to" class="form-input" placeholder="editorial@aira.news" value="${emailSettings.replyTo || 'editorial@aira.news'}" />
                      </div>

                      <div class="form-group">
                        <label class="form-label">Lead Magnet Link (50 Templates)</label>
                        <input type="url" id="input-lead-magnet" class="form-input" placeholder="https://docs.google.com/spreadsheets/..." value="${emailSettings.leadMagnetUrl || 'https://docs.google.com/spreadsheets/d/190nDBrA-I8J03VlsneEO3U3-z0ERqCfXdF0mwjyKZBY/edit?usp=sharing'}" />
                      </div>
                    </div>

                    <div style="display: flex; gap: 12px; align-items: center; justify-content: space-between; border-top: 1px solid #F1F5F9; padding-top: 16px; flex-wrap: wrap;">
                      <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="email" id="input-test-recipient" class="form-input" placeholder="Enter your email to test..." style="max-width: 260px;" />
                        <button type="button" id="btn-send-test-welcome" class="btn-saas-reject" style="padding: 8px 14px; font-weight: 600;">
                          📨 Send Test Welcome Email
                        </button>
                      </div>

                      <button type="submit" class="saas-btn-primary" style="padding: 9px 24px;">
                        💾 Save Email Settings
                      </button>
                    </div>
                  </form>
                </div>

                <!-- 3. Real-Time Email Delivery Audit Logs Table -->
                <div class="saas-panel-card">
                  <div class="saas-panel-header" style="flex-wrap: wrap; gap: 12px;">
                    <div>
                      <h3 class="saas-panel-title">📜 Email Delivery Activity & Audit Logs (${emailLogs.length})</h3>
                      <p class="saas-panel-sub" style="margin: 4px 0 0 0;">Real-time history of welcome emails, broadcasts, and test dispatches.</p>
                    </div>
                    ${emailLogs.length > 0 ? `
                      <button type="button" id="btn-clear-email-logs" class="btn-saas-reject" style="padding: 6px 12px; font-size: 0.8rem; color: #DC2626;">
                        🗑️ Clear Logs
                      </button>
                    ` : ''}
                  </div>

                  <div style="overflow-x: auto; margin-top: 16px;">
                    ${emailLogs.length === 0 ? `
                      <div style="text-align: center; padding: 32px 16px; color: #94A3B8; background: #F8FAFC; border-radius: 8px;">
                        No email dispatches recorded yet. Subscribe on the site or send a test email above to see live delivery logs!
                      </div>
                    ` : `
                      <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;">
                        <thead>
                          <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; color: #64748B; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                            <th style="padding: 10px 14px;">Status</th>
                            <th style="padding: 10px 14px;">Recipient Email</th>
                            <th style="padding: 10px 14px;">Type</th>
                            <th style="padding: 10px 14px;">Subject</th>
                            <th style="padding: 10px 14px;">Transport</th>
                            <th style="padding: 10px 14px;">Date & Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${emailLogs.map(log => `
                            <tr style="border-bottom: 1px solid #F1F5F9;">
                              <td style="padding: 10px 14px;">
                                <span style="display: inline-flex; align-items: center; gap: 4px; background: ${log.status === 'delivered' ? '#ECFDF5' : '#FEF2F2'}; color: ${log.status === 'delivered' ? '#047857' : '#DC2626'}; border: 1px solid ${log.status === 'delivered' ? '#A7F3D0' : '#FECACA'}; padding: 2px 8px; border-radius: 999px; font-size: 0.72rem; font-weight: 700;">
                                  ${log.status === 'delivered' ? '✓ Delivered' : '✕ Failed'}
                                </span>
                              </td>
                              <td style="padding: 10px 14px; font-weight: 600; font-family: monospace; color: #0F172A;">${log.recipient}</td>
                              <td style="padding: 10px 14px;">
                                <span style="background: #F1F5F9; color: #475569; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase;">
                                  ${log.type === 'welcome' ? '🎁 Welcome' : log.type === 'article_broadcast' ? '📰 Broadcast' : '🧪 Test'}
                                </span>
                              </td>
                              <td style="padding: 10px 14px; color: #334155; max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${log.subject}</td>
                              <td style="padding: 10px 14px; color: #64748B; font-size: 0.78rem;">${log.transport || 'API'}</td>
                              <td style="padding: 10px 14px; color: #94A3B8; font-size: 0.78rem; white-space: nowrap;">${log.dateFormatted || 'Just now'}</td>
                            </tr>
                          `).join('')}
                        </tbody>
                      </table>
                    `}
                  </div>
                </div>

              </div>
              `;
            })() : ''}

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

    // Sidebar collapse toggle
    const sidebarToggle = appContainer.querySelector('.saas-sidebar-toggle');
    const sidebarEl = appContainer.querySelector('.saas-admin-sidebar');
    if (sidebarToggle && sidebarEl) {
      sidebarToggle.addEventListener('click', () => {
        sidebarEl.classList.toggle('collapsed');
        sidebarToggle.textContent = sidebarEl.classList.contains('collapsed') ? '»' : '«';
      });
    }

    // Topbar Search input & shortcut
    const saasSearch = document.getElementById('saas-topbar-search');
    if (saasSearch) {
      saasSearch.addEventListener('input', (e) => {
        const val = e.target.value;
        if (state.adminTab === 'articles') state.adminArticleSearch = val;
        else if (state.adminTab === 'submissions') state.adminSubmissionSearch = val;
        else if (state.adminTab === 'deals') state.adminDealSearch = val;
        else if (state.adminTab === 'subscribers') state.adminSubscriberSearch = val;
        else {
          // In overview, search filters submissions and deals
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
        tag: defaultTmpl ? defaultTmpl.tag : 'News',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        reading_time: defaultTmpl ? defaultTmpl.readingTime : '4 minutes',
        image_url: 'assets/logo.jpg',
        author: 'AIRA',
        body_html: defaultTmpl ? defaultTmpl.body : ''
      };
      renderAdminPage();
    }

    // Topbar + New Article button
    const topbarNewArtBtn = document.getElementById('btn-topbar-new-article');
    if (topbarNewArtBtn) {
      topbarNewArtBtn.addEventListener('click', openNewArticleEditor);
    }

    // Widget Add Deal button in Overview
    const widgetAddDealBtn = document.getElementById('widget-btn-add-deal');
    if (widgetAddDealBtn) {
      widgetAddDealBtn.addEventListener('click', () => {
        state.adminTab = 'deals';
        renderAdminPage();
        const dealModal = document.getElementById('modal-deal-editor');
        if (dealModal) dealModal.classList.add('active');
      });
    }

    const overReviewSubs = document.getElementById('overview-btn-review-subs');
    if (overReviewSubs) {
      overReviewSubs.addEventListener('click', () => {
        state.adminTab = 'submissions';
        state.adminSubmissionFilter = 'pending';
        renderAdminPage();
      });
    }

    const overAddDeal = document.getElementById('overview-btn-add-deal');
    if (overAddDeal) {
      overAddDeal.addEventListener('click', () => {
        state.adminTab = 'deals';
        renderAdminPage();
        const dealModal = document.getElementById('modal-deal-editor');
        if (dealModal) dealModal.classList.add('active');
      });
    }

    const overExportCsv = document.getElementById('overview-btn-export-csv');
    if (overExportCsv) {
      overExportCsv.addEventListener('click', () => {
        state.adminTab = 'subscribers';
        renderAdminPage();
        const exportBtn = document.getElementById('btn-export-csv');
        if (exportBtn) exportBtn.click();
      });
    }

    const overFullBackup = document.getElementById('overview-btn-full-backup');
    if (overFullBackup) {
      overFullBackup.addEventListener('click', () => {
        exportFullSiteBackup();
      });
    }

    // 3. Submissions Approval & Actions
    function handleApproveSubmission(subId) {
      const subs = getToolSubmissions();
      const sub = subs.find(s => s.id === subId);
      if (!sub) return;

      sub.status = 'approved';
      sub.approvedAt = new Date().toISOString();
      saveToolSubmissions(subs);

      // Create live tool entry
      const customTools = getCustomTools();
      const toolSlug = (sub.toolName || 'tool').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const cleanDomain = (sub.toolUrl || '').replace(/^https?:\/\//, '').split('/')[0].trim() || 'ai.com';

      const newTool = {
        id: toolSlug,
        name: sub.toolName,
        url: sub.toolUrl,
        domain: cleanDomain,
        category: sub.category || 'productivity',
        categories: [sub.category || 'productivity'],
        pricing: sub.pricing || 'Freemium',
        description: sub.tagline || sub.description,
        longDescription: sub.description,
        features: sub.features ? sub.features.split(',').map(f => f.trim()).filter(Boolean) : [],
        badge: 'Community Verified',
        featured: true,
        image: `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`,
        submittedBy: sub.contactEmail,
        promoCode: sub.promoCode
      };

      const existingIdx = customTools.findIndex(t => t.id === toolSlug);
      if (existingIdx >= 0) customTools[existingIdx] = newTool;
      else customTools.unshift(newTool);
      saveCustomTools(customTools);

      // If promo code provided, auto-create a deal
      if (sub.promoCode) {
        const customDeals = getCustomDeals();
        const dealId = 'deal-' + toolSlug;
        const newDeal = {
          id: dealId,
          toolName: sub.toolName,
          toolId: toolSlug,
          category: sub.category || 'productivity',
          discountBadge: 'EXCLUSIVE',
          discountType: 'Discount',
          headline: `Exclusive Deal on ${sub.toolName}`,
          description: sub.tagline || sub.description,
          couponCode: sub.promoCode,
          expiryDate: 'Verified Active',
          verified: true,
          url: sub.toolUrl,
          domain: cleanDomain,
          image: `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`
        };
        const dealIdx = customDeals.findIndex(d => d.id === dealId);
        if (dealIdx >= 0) customDeals[dealIdx] = newDeal;
        else customDeals.unshift(newDeal);
        saveCustomDeals(customDeals);
      }

      showToast(`🎉 "${sub.toolName}" is approved & LIVE on /#/tools!`);
      renderAdminPage();
    }

    appContainer.querySelectorAll('.btn-approve-sub, .btn-quick-approve').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sid = e.currentTarget.getAttribute('data-sub-id');
        handleApproveSubmission(sid);
      });
    });

    appContainer.querySelectorAll('.btn-reject-sub').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sid = e.currentTarget.getAttribute('data-sub-id');
        const subs = getToolSubmissions();
        const sub = subs.find(s => s.id === sid);
        if (sub) {
          sub.status = 'rejected';
          saveToolSubmissions(subs);
          showToast(`Marked "${sub.toolName}" as rejected.`);
          renderAdminPage();
        }
      });
    });

    appContainer.querySelectorAll('.btn-delete-sub').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sid = e.currentTarget.getAttribute('data-sub-id');
        if (confirm('Delete this submission permanently?')) {
          let subs = getToolSubmissions();
          subs = subs.filter(s => s.id !== sid);
          saveToolSubmissions(subs);
          showToast('Submission deleted.');
          renderAdminPage();
        }
      });
    });

    appContainer.querySelectorAll('[data-sub-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        state.adminSubmissionFilter = e.currentTarget.getAttribute('data-sub-filter');
        renderAdminPage();
      });
    });

    const searchSubInput = document.getElementById('admin-search-submissions');
    if (searchSubInput) {
      searchSubInput.addEventListener('input', (e) => {
        state.adminSubmissionSearch = e.target.value;
        renderAdminPage();
        const el = document.getElementById('admin-search-submissions');
        if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
      });
    }

    // 4. Deals Manager Actions & Modal
    const openAddDealBtn = document.getElementById('btn-open-add-deal-modal');
    const dealModal = document.getElementById('modal-deal-editor');
    const closeDealModalBtn = document.getElementById('btn-close-deal-modal');
    const cancelDealModalBtn = document.getElementById('btn-cancel-deal-modal');
    const formDealEditor = document.getElementById('form-deal-editor');

    if (openAddDealBtn && dealModal) {
      openAddDealBtn.addEventListener('click', () => {
        document.getElementById('modal-deal-title').innerText = 'Add New Affiliate Deal';
        document.getElementById('deal-edit-id').value = '';
        document.getElementById('deal-input-tool-name').value = '';
        document.getElementById('deal-input-badge').value = '20% OFF';
        document.getElementById('deal-input-headline').value = '';
        document.getElementById('deal-input-desc').value = '';
        document.getElementById('deal-input-code').value = '';
        document.getElementById('deal-input-expiry').value = 'Verified Active';
        document.getElementById('deal-input-url').value = '';
        dealModal.classList.add('active');
      });
    }

    if (closeDealModalBtn && dealModal) {
      closeDealModalBtn.addEventListener('click', () => dealModal.classList.remove('active'));
    }
    if (cancelDealModalBtn && dealModal) {
      cancelDealModalBtn.addEventListener('click', () => dealModal.classList.remove('active'));
    }

    if (formDealEditor) {
      formDealEditor.addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = document.getElementById('deal-edit-id').value;
        const toolName = document.getElementById('deal-input-tool-name').value.trim();
        const category = document.getElementById('deal-input-category').value;
        const badge = document.getElementById('deal-input-badge').value.trim();
        const headline = document.getElementById('deal-input-headline').value.trim();
        const desc = document.getElementById('deal-input-desc').value.trim();
        const code = document.getElementById('deal-input-code').value.trim();
        const expiry = document.getElementById('deal-input-expiry').value.trim() || 'Verified Active';
        const url = document.getElementById('deal-input-url').value.trim();
        const cleanDomain = url.replace(/^https?:\/\//, '').split('/')[0].trim() || 'ai.com';

        const customDeals = getCustomDeals();
        const dealId = editId || `deal-${toolName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

        const dealObj = {
          id: dealId,
          toolName,
          toolId: toolName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          category,
          discountBadge: badge,
          discountType: 'Discount',
          headline,
          description: desc,
          couponCode: code,
          expiryDate: expiry,
          verified: true,
          url,
          domain: cleanDomain,
          image: `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`
        };

        const existingIdx = customDeals.findIndex(d => d.id === dealId);
        if (existingIdx >= 0) customDeals[existingIdx] = dealObj;
        else customDeals.unshift(dealObj);
        saveCustomDeals(customDeals);

        dealModal.classList.remove('active');
        showToast(`Deal for "${toolName}" saved successfully! 🏷️`);
        renderAdminPage();
      });
    }

    appContainer.querySelectorAll('.btn-edit-deal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const did = e.currentTarget.getAttribute('data-deal-id');
        const found = allDealsList.find(d => d.id === did);
        if (found && dealModal) {
          document.getElementById('modal-deal-title').innerText = `Edit Deal: ${found.toolName}`;
          document.getElementById('deal-edit-id').value = found.id;
          document.getElementById('deal-input-tool-name').value = found.toolName;
          document.getElementById('deal-input-category').value = found.category || 'productivity';
          document.getElementById('deal-input-badge').value = found.discountBadge;
          document.getElementById('deal-input-headline').value = found.headline;
          document.getElementById('deal-input-desc').value = found.description || '';
          document.getElementById('deal-input-code').value = found.couponCode || '';
          document.getElementById('deal-input-expiry').value = found.expiryDate || 'Verified Active';
          document.getElementById('deal-input-url').value = found.url;
          dealModal.classList.add('active');
        }
      });
    });

    appContainer.querySelectorAll('.btn-delete-deal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const did = e.currentTarget.getAttribute('data-deal-id');
        if (confirm('Delete this deal?')) {
          let customDeals = getCustomDeals();
          customDeals = customDeals.filter(d => d.id !== did);
          saveCustomDeals(customDeals);
          showToast('Deal deleted.');
          renderAdminPage();
        }
      });
    });

    const searchDealsInput = document.getElementById('admin-search-deals');
    if (searchDealsInput) {
      searchDealsInput.addEventListener('input', (e) => {
        state.adminDealSearch = e.target.value;
        renderAdminPage();
        const el = document.getElementById('admin-search-deals');
        if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
      });
    }

    // 5. Articles Management Event Handlers
    const searchArtInput = document.getElementById('admin-search-articles');
    if (searchArtInput) {
      searchArtInput.addEventListener('input', (e) => {
        state.adminArticleSearch = e.target.value;
        renderAdminPage();
        const el = document.getElementById('admin-search-articles');
        if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
      });
    }

    appContainer.querySelectorAll('[data-admin-tag]').forEach(pill => {
      pill.addEventListener('click', (e) => {
        state.adminArticleTag = e.target.getAttribute('data-admin-tag');
        renderAdminPage();
      });
    });

    const addNewArtBtn = document.getElementById('btn-add-new-article');
    if (addNewArtBtn) {
      addNewArtBtn.addEventListener('click', openNewArticleEditor);
    }

    appContainer.querySelectorAll('.btn-edit-article').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const slug = e.currentTarget.getAttribute('data-slug');
        const found = state.articles.find(a => a.slug === slug);
        if (found) {
          state.adminEditingArticle = found;
          renderAdminPage();
        }
      });
    });

    appContainer.querySelectorAll('.btn-delete-article').forEach(btn => {
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

    // 6. Subscribers Management Handlers
    const copyEmailsBtn = document.getElementById('btn-copy-emails');
    if (copyEmailsBtn) {
      copyEmailsBtn.addEventListener('click', () => {
        if (normalizedSubscribers.length === 0) {
          showToast('No emails to copy yet!');
          return;
        }
        const emailString = normalizedSubscribers.map(s => s.email).join(', ');
        navigator.clipboard.writeText(emailString).then(() => {
          showToast('All emails copied to clipboard! 📋');
        });
      });
    }

    const exportCsvBtn = document.getElementById('btn-export-csv');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
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
        showToast('Subscribers exported to CSV! 📥');
      });
    }

    const searchSubscribersInput = document.getElementById('admin-search-subscribers');
    if (searchSubscribersInput) {
      searchSubscribersInput.addEventListener('input', (e) => {
        state.adminSubscriberSearch = e.target.value;
        renderAdminPage();
        const el = document.getElementById('admin-search-subscribers');
        if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
      });
    }

    appContainer.querySelectorAll('.btn-delete-subscriber').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const email = e.currentTarget.getAttribute('data-email');
        if (confirm(`Remove subscriber "${email}"?`)) {
          let list = JSON.parse(localStorage.getItem('aira_subscribers') || '[]');
          list = list.filter(item => (typeof item === 'string' ? item : item.email) !== email);
          localStorage.setItem('aira_subscribers', JSON.stringify(list));
          state.subscribers = list;
          showToast('Subscriber removed.');
          renderAdminPage();
        }
      });
    });

    // 7. Comments Moderation Handlers
    appContainer.querySelectorAll('.btn-delete-comment').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const slug = e.currentTarget.getAttribute('data-slug');
        const cIdx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        if (confirm('Delete this comment permanently?')) {
          const comMap = JSON.parse(localStorage.getItem('aira_comments') || '{}');
          if (comMap[slug] && comMap[slug][cIdx] !== undefined) {
            comMap[slug].splice(cIdx, 1);
            if (comMap[slug].length === 0) delete comMap[slug];
            localStorage.setItem('aira_comments', JSON.stringify(comMap));
            state.comments = comMap;
            showToast('Comment deleted.');
            renderAdminPage();
          }
        }
      });
    });

    // 8. Full Site Backup & Restore
    function exportFullSiteBackup() {
      const backup = {
        version: '26.0',
        exportedAt: new Date().toISOString(),
        articles: state.articles,
        customTools: getCustomTools(),
        customDeals: getCustomDeals(),
        toolSubmissions: getToolSubmissions(),
        subscribers: JSON.parse(localStorage.getItem('aira_subscribers') || '[]'),
        comments: JSON.parse(localStorage.getItem('aira_comments') || '{}'),
        likes: JSON.parse(localStorage.getItem('aira_likes') || '{}')
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AIRA_Full_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('📦 Full site backup JSON downloaded!');
    }

    const exportBackupBtn = document.getElementById('btn-export-full-backup') || document.getElementById('btn-settings-export-backup');
    if (exportBackupBtn) {
      exportBackupBtn.addEventListener('click', exportFullSiteBackup);
    }

    const restoreBackupInput = document.getElementById('input-restore-backup');
    if (restoreBackupInput) {
      restoreBackupInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (data.articles) saveArticles(data.articles);
            if (data.customTools) saveCustomTools(data.customTools);
            if (data.customDeals) saveCustomDeals(data.customDeals);
            if (data.toolSubmissions) saveToolSubmissions(data.toolSubmissions);
            if (data.subscribers) localStorage.setItem('aira_subscribers', JSON.stringify(data.subscribers));
            if (data.comments) localStorage.setItem('aira_comments', JSON.stringify(data.comments));
            if (data.likes) localStorage.setItem('aira_likes', JSON.stringify(data.likes));
            showToast('🎉 Backup restored successfully! Refreshing dashboard...');
            setTimeout(() => renderAdminPage(), 1000);
          } catch (err) {
            alert('Invalid backup file format: ' + err.message);
          }
        };
        reader.readAsText(file);
      });
    }

    const testDbBtn = document.getElementById('btn-test-db-connection');
    if (testDbBtn) {
      testDbBtn.addEventListener('click', () => {
        if (typeof supabaseClient !== 'undefined' && supabaseClient) {
          showToast('🟢 Supabase Cloud Database is Active & Connected!');
        } else {
          showToast('⚪ Running in Local Client Storage mode. Add Supabase keys in js/supabase.js for live cloud sync.');
        }
      });
    }

    const resetArticlesBtn = document.getElementById('btn-reset-articles');
    if (resetArticlesBtn) {
      resetArticlesBtn.addEventListener('click', () => {
        if (confirm('Reset articles to the original 192 editions? This will discard custom local edits.')) {
          localStorage.removeItem('aira_custom_articles');
          state.articles = typeof ARTICLES !== 'undefined' ? ARTICLES : [];
          showToast('🔄 Restored default 192 articles!');
          renderAdminPage();
        }
      });
    }

    const clearToolsBtn = document.getElementById('btn-clear-custom-tools');
    if (clearToolsBtn) {
      clearToolsBtn.addEventListener('click', () => {
        if (confirm('Clear all custom approved AI tools from local storage?')) {
          localStorage.removeItem('aira_custom_tools');
          showToast('Custom tools cleared.');
          renderAdminPage();
        }
      });
    }

    const clearDealsBtn = document.getElementById('btn-clear-custom-deals');
    if (clearDealsBtn) {
      clearDealsBtn.addEventListener('click', () => {
        if (confirm('Clear all custom deals from local storage?')) {
          localStorage.removeItem('aira_custom_deals');
          showToast('Custom deals cleared.');
          renderAdminPage();
        }
      });
    }

    // 8. Email Automation & Broadcast Event Handlers
    appContainer.querySelectorAll('.btn-broadcast-single-article').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const slug = e.currentTarget.getAttribute('data-slug');
        const art = state.articles.find(a => a.slug === slug);
        if (!art) return;
        state.adminTab = 'emails';
        renderAdminPage();
        const selectEl = document.getElementById('email-broadcast-article-select');
        if (selectEl) selectEl.value = slug;
        showToast(`Selected "${art.title.slice(0, 24)}..." for newsletter broadcast!`);
      });
    });

    const previewEmailBtn = document.getElementById('btn-preview-email-html');
    const emailPreviewModal = document.getElementById('modal-email-preview');
    const closeEmailPreviewBtn = document.getElementById('btn-close-email-preview');
    if (previewEmailBtn && emailPreviewModal) {
      previewEmailBtn.addEventListener('click', () => {
        const selectEl = document.getElementById('email-broadcast-article-select');
        const slug = selectEl ? selectEl.value : (state.articles[0] ? state.articles[0].slug : '');
        const art = state.articles.find(a => a.slug === slug) || state.articles[0];
        if (!art) return;
        if (typeof window.EmailService !== 'undefined') {
          const html = window.EmailService.buildArticleBroadcastEmailHTML(art, 'subscriber@example.com');
          const iframe = document.getElementById('email-preview-iframe');
          if (iframe) {
            iframe.srcdoc = html;
          }
          emailPreviewModal.classList.add('active');
        }
      });
    }

    if (closeEmailPreviewBtn && emailPreviewModal) {
      closeEmailPreviewBtn.addEventListener('click', () => emailPreviewModal.classList.remove('active'));
    }

    const startBroadcastBtn = document.getElementById('btn-start-broadcast-send');
    if (startBroadcastBtn) {
      startBroadcastBtn.addEventListener('click', async () => {
        const selectEl = document.getElementById('email-broadcast-article-select');
        const slug = selectEl ? selectEl.value : '';
        const art = state.articles.find(a => a.slug === slug);
        if (!art) {
          showToast('Please select an article to broadcast!');
          return;
        }
        const list = JSON.parse(localStorage.getItem('aira_subscribers') || '[]');
        const subCount = list.length;
        if (subCount === 0) {
          showToast('No subscribers found in database yet! Add a subscriber to test.');
          return;
        }
        if (!confirm(`🚀 Broadcast newsletter edition "${art.title}" to all ${subCount} subscribers now?`)) {
          return;
        }

        const progressWrap = document.getElementById('broadcast-progress-wrap');
        const progressBar = document.getElementById('broadcast-progress-bar');
        const progressLabel = document.getElementById('broadcast-progress-label');
        const progressPercent = document.getElementById('broadcast-progress-percent');
        const progressDetail = document.getElementById('broadcast-progress-detail');

        if (progressWrap) progressWrap.style.display = 'block';
        startBroadcastBtn.disabled = true;
        startBroadcastBtn.textContent = 'Sending... ⏳';

        if (typeof window.EmailService !== 'undefined') {
          const res = await window.EmailService.broadcastArticle(art, null, (p) => {
            if (progressBar) progressBar.style.width = p.percent + '%';
            if (progressPercent) progressPercent.textContent = p.percent + '%';
            if (progressDetail) progressDetail.textContent = `Sent ${p.current} of ${p.total} (${p.lastEmail})`;
          });

          startBroadcastBtn.disabled = false;
          startBroadcastBtn.textContent = `🚀 Send to All (${subCount})`;
          if (res.success) {
            showToast(`🎉 Broadcasted "${art.title.slice(0, 24)}..." to ${res.sent} subscribers!`);
            setTimeout(() => renderAdminPage(), 1200);
          } else {
            showToast(`Broadcast completed with notices: ${res.error || 'Check logs'}`);
            setTimeout(() => renderAdminPage(), 1200);
          }
        }
      });
    }

    const emailSettingsForm = document.getElementById('form-email-settings');
    if (emailSettingsForm && typeof window.EmailService !== 'undefined') {
      emailSettingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const resendApiKey = document.getElementById('input-resend-key')?.value.trim() || '';
        const webhookUrl = document.getElementById('input-email-webhook')?.value.trim() || '';
        const senderEmail = document.getElementById('input-sender-email')?.value.trim() || '';
        const replyTo = document.getElementById('input-reply-to')?.value.trim() || '';
        const leadMagnetUrl = document.getElementById('input-lead-magnet')?.value.trim() || '';
        window.EmailService.saveSettings({ resendApiKey, webhookUrl, senderEmail, replyTo, leadMagnetUrl });
        showToast('Email settings saved successfully! 💾');
        renderAdminPage();
      });
    }

    const testWelcomeBtn = document.getElementById('btn-send-test-welcome');
    if (testWelcomeBtn && typeof window.EmailService !== 'undefined') {
      testWelcomeBtn.addEventListener('click', async () => {
        const input = document.getElementById('input-test-recipient');
        const email = input ? input.value.trim() : '';
        if (!email || !email.includes('@')) {
          showToast('Please enter a valid test recipient email address!');
          return;
        }
        testWelcomeBtn.disabled = true;
        testWelcomeBtn.textContent = 'Sending... ⏳';
        const res = await window.EmailService.sendTestEmail(email, 'welcome');
        testWelcomeBtn.disabled = false;
        testWelcomeBtn.textContent = '📨 Send Test Welcome Email';
        if (res.success) {
          showToast(`✨ Test Welcome Email sent to ${email}! Check logs below.`);
          renderAdminPage();
        } else {
          showToast(`Test send notice: ${res.error || 'Simulated delivery logged'}`);
          renderAdminPage();
        }
      });
    }

    const clearEmailLogsBtn = document.getElementById('btn-clear-email-logs');
    if (clearEmailLogsBtn) {
      clearEmailLogsBtn.addEventListener('click', () => {
        if (confirm('Clear all email audit logs?')) {
          localStorage.removeItem('aira_email_logs');
          showToast('Email logs cleared.');
          renderAdminPage();
        }
      });
    }
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
      <main id="top" class="prompt-library-main">
        <div class="prompt-vault-container">
          
          <!-- Hero Section (Centered & Polished) -->
          <section class="lib-hero-top">
            <div class="lib-hero__badge">⚡ AIRA Prompts Vault</div>
            <h1 class="lib-hero__title">Agentic Coding Prompts Library</h1>
            <p class="lib-hero__lede">
              Curated collection of <span id="hero-count">${ALL.length}</span> battle-tested prompts for frontier coding agents, built for
              <span class="inline-tool" data-mark="claude-code"><span class="inline-tool__mark">${TOOL_MARK['claude-code']}</span>Claude&nbsp;Code</span>,
              <span class="inline-tool" data-mark="codex"><span class="inline-tool__mark">${TOOL_MARK['codex']}</span>OpenAI&nbsp;Codex</span>, and
              <span class="inline-tool" data-mark="cursor"><span class="inline-tool__mark">${TOOL_MARK['cursor']}</span>Cursor&nbsp;IDE</span>.
              Select a task, customize the highlighted tokens, and copy in one click.
            </p>

            <!-- Center Search Bar -->
            <div class="hero-search-center">
              <svg class="hero-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/>
              </svg>
              <input id="search" type="search" placeholder="Search prompts by task, tool, keyword (e.g. Bug fix, Onboarding, Refactor, Plan)..." autocomplete="off" spellcheck="false" aria-label="Search prompts" />
              <button class="hero-search__clear" id="search-clear" type="button" aria-label="Clear search" hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
              <kbd class="hero-search__kbd" id="search-kbd">/</kbd>
            </div>
          </section>

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
      if (!t) return 'ai.com';
      return (t.domain || t.url || '').replace(/^https?:\/\//, '').split('/')[0].trim() || 'ai.com';
    }

    function getLogo(t) {
      if (!t) return 'assets/logo.svg';
      return t.image || `https://www.google.com/s2/favicons?domain=${getToolDomain(t)}&sz=128`;
    }

    appContainer.innerHTML = `
      <div class="tools-directory-page">
        <div class="container">
          <!-- Hero Header -->
          <div class="tools-hero-section" style="text-align: center; padding: 48px 0 32px 0;">
            <div class="tools-hero-badge" style="display: inline-flex; align-items: center; gap: 6px; background: #ECFDF5; color: #047857; padding: 6px 16px; border-radius: 9999px; font-weight: 700; font-size: 0.85rem; margin-bottom: 16px;">
              <span>⚔️</span> Side-by-Side Comparison
            </div>
            <h1 class="page-title" style="font-size: 2.75rem; margin-bottom: 12px;">AI Tool Comparison (VS Mode)</h1>
            <p class="page-description" style="max-width: 680px; margin: 0 auto 28px auto;">
              Compare specifications, pricing models, key capabilities, pros & cons side-by-side to make the smartest AI choice.
            </p>
          </div>

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
                      <img src="${getLogo(tool1)}" alt="${tool1?.name}" style="width: 32px; height: 32px; border-radius: 8px; object-fit: cover;" onerror="this.src='assets/logo.svg'" />
                      <div>
                        <div style="font-size: 1.15rem; font-weight: 900; color: #18181B;">${tool1?.name || 'Tool 1'}</div>
                        <span class="tool-badge-pricing pricing-${(tool1?.pricing || 'free').toLowerCase().replace(/\s+/g, '-')}">${tool1?.pricing || 'Free'}</span>
                      </div>
                    </div>
                  </th>
                  <th style="width: 39%;">
                    <div class="compare-col-header-wrap">
                      <img src="${getLogo(tool2)}" alt="${tool2?.name}" style="width: 32px; height: 32px; border-radius: 8px; object-fit: cover;" onerror="this.src='assets/logo.svg'" />
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
                  <td><strong style="color: #047857; font-size: 1rem;">${tool1?.pricing || 'Free'}</strong></td>
                  <td><strong style="color: #047857; font-size: 1rem;">${tool2?.pricing || 'Free'}</strong></td>
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
                    <div style="display: inline-flex; align-items: center; gap: 6px; background: #ECFDF5; color: #047857; font-weight: 800; padding: 6px 12px; border-radius: 8px; font-size: 0.85rem;">
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

    const savedToolIds = state.savedTools || [];
    const savedArticleSlugs = state.savedArticles || [];
    const savedAltSlugs = state.savedAlternatives || [];

    const savedToolsList = allTools.filter(t => savedToolIds.includes(t.id));
    const savedArticlesList = state.articles.filter(a => savedArticleSlugs.includes(a.slug));
    const savedAltsList = allAlts.filter(a => savedAltSlugs.includes(a.slug));

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
          ${list.map(tool => {
            const cleanDomain = (tool.domain || '').replace(/^https?:\/\//, '').split('/')[0].trim() || 'ai.com';
            const logoUrl = tool.image || `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
            return `
              <div class="tool-card" data-tool-id="${tool.id}">
                <div class="tool-card-top">
                  <a href="#/tools/${tool.id}" class="tool-icon-avatar">
                    <img src="${logoUrl}" alt="${tool.name}" class="tool-logo-img" onerror="this.src='assets/logo.svg'" />
                  </a>
                  <div class="tool-title-group">
                    <div class="tool-badges-row">
                      <span class="tool-badge-pricing pricing-${(tool.pricing || 'free').toLowerCase().replace(/\s+/g, '-')}">${tool.pricing}</span>
                    </div>
                    <h3 class="tool-card-name">
                      <a href="#/tools/${tool.id}" class="tool-title-link">${tool.name}</a>
                    </h3>
                  </div>
                </div>
                <p class="tool-card-desc">${tool.description}</p>
                <div class="tool-card-bottom">
                  <button type="button" class="btn-remove-bookmark" data-tool-id="${tool.id}" style="background: none; border: 1px solid #E4E4E7; color: #EF4444; font-size: 0.8rem; font-weight: 700; padding: 6px 12px; border-radius: 6px; cursor: pointer;">
                    Remove ✕
                  </button>
                  <div class="tool-card-actions">
                    <a href="#/tools/${tool.id}" class="tool-details-btn">Details</a>
                    <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="tool-direct-visit-btn">Visit ↗</a>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
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
                <img src="${article.image_url || 'assets/logo.jpg'}" alt="${article.title || 'AIRA Article'}" class="card-thumbnail" loading="lazy" />
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
      <div class="tools-directory-page">
        <div class="container">
          <!-- Hero Header -->
          <div class="tools-hero-section" style="text-align: center; padding: 48px 0 32px 0;">
            <div class="tools-hero-badge" style="display: inline-flex; align-items: center; gap: 6px; background: #FEF3C7; color: #B45309; padding: 6px 16px; border-radius: 9999px; font-weight: 700; font-size: 0.85rem; margin-bottom: 16px;">
              <span>🔖</span> Your Saved Library
            </div>
            <h1 class="page-title" style="font-size: 2.75rem; margin-bottom: 12px;">My Bookmarks</h1>
            <p class="page-description" style="max-width: 680px; margin: 0 auto 28px auto;">
              Quickly revisit your saved AI tools, newsletter editions, and open-source alternatives.
            </p>
          </div>

          <!-- Bookmarks Tabs -->
          <div class="bookmarks-tabs-bar">
            <button type="button" class="bookmark-tab-btn ${currentTab === 'tools' ? 'active' : ''}" data-tab="tools">
              <span>⚡ Saved AI Tools (${savedToolsList.length})</span>
            </button>
            <button type="button" class="bookmark-tab-btn ${currentTab === 'articles' ? 'active' : ''}" data-tab="articles">
              <span>📰 Saved Articles (${savedArticlesList.length})</span>
            </button>
            <button type="button" class="bookmark-tab-btn ${currentTab === 'alternatives' ? 'active' : ''}" data-tab="alternatives">
              <span>🔄 Saved Alternatives (${savedAltsList.length})</span>
            </button>
          </div>

          <!-- Content Area -->
          <div id="bookmarks-tab-content" style="margin-bottom: 60px;">
            ${currentTab === 'tools' ? renderSavedToolsHTML(savedToolsList) : ''}
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
      <div class="tools-directory-page">
        <div class="container">
          <!-- Hero Header -->
          <div class="tools-hero-section" style="text-align: center; padding: 48px 0 32px 0;">
            <div class="tools-hero-badge" style="display: inline-flex; align-items: center; gap: 6px; background: #ECFDF5; color: #047857; padding: 6px 16px; border-radius: 9999px; font-weight: 700; font-size: 0.85rem; margin-bottom: 16px;">
              <span>🚀</span> Creator & Founder Submissions
            </div>
            <h1 class="page-title" style="font-size: 2.75rem; margin-bottom: 12px;">Submit Your AI Tool</h1>
            <p class="page-description" style="max-width: 680px; margin: 0 auto 28px auto;">
              Get your product featured in front of 500+ AI enthusiasts, builders, investors, and engineers.
            </p>
          </div>

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
              <div style="width: 64px; height: 64px; border-radius: 50%; background: #ECFDF5; color: #047857; font-size: 2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto;">✓</div>
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
      <div class="tools-directory-page">
        <div class="container">
          <!-- Hero Header -->
          <div class="tools-hero-section" style="text-align: center; padding: 48px 0 32px 0;">
            <div class="tools-hero-badge" style="display: inline-flex; align-items: center; gap: 6px; background: #FEF3C7; color: #B45309; padding: 6px 16px; border-radius: 9999px; font-weight: 700; font-size: 0.85rem; margin-bottom: 16px;">
              <span>🏷️</span> Exclusive Discounts & Perks
            </div>
            <h1 class="page-title" style="font-size: 2.75rem; margin-bottom: 12px;">AI Deals & Discounts</h1>
            <p class="page-description" style="max-width: 680px; margin: 0 auto 28px auto;">
              Save big on top AI tools, developer platforms, and creator subscriptions with verified coupon codes and partnership deals.
            </p>

            <!-- Search Bar -->
            <div style="max-width: 580px; margin: 0 auto; position: relative;">
              <input type="text" id="deal-search-input" class="form-input" placeholder="Search deals by tool name or discount..." value="${escapeHtml(state.dealSearchQuery)}" style="width: 100%; padding: 14px 20px; border-radius: 9999px; font-size: 1rem; border: 1.5px solid #E4E4E7;" />
            </div>
          </div>

          <!-- Categories Bar -->
          <div class="cat-filter-scroll-wrapper" style="margin-bottom: 24px;">
            <div class="cat-filter-pills-row">
              ${categories.map(cat => `
                <button type="button" class="cat-filter-pill ${state.dealCategoryFilter === cat.id ? 'active' : ''}" data-cat="${cat.id}">
                  <span class="cat-pill-icon">${cat.icon || '🏷️'}</span>
                  <span class="cat-pill-name">${cat.name}</span>
                  <span class="cat-pill-count">${cat.id === 'all' ? allDeals.length : allDeals.filter(d => d.category === cat.id).length}</span>
                </button>
              `).join('')}
            </div>
          </div>

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
                  <span style="font-size: 0.78rem; font-weight: 700; color: #047857;">✓ Verified</span>
                </div>

                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                  <img src="${deal.image || 'assets/logo.svg'}" alt="${deal.toolName}" style="width: 40px; height: 40px; border-radius: 10px; object-fit: cover;" onerror="this.src='assets/logo.svg'" />
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

          <div style="margin: 60px 0 30px 0; text-align: center; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 32px 20px;">
            <h3 style="font-size: 1.25rem; font-weight: 800; color: #1E293B; margin-bottom: 6px;">Are you an AI tool creator?</h3>
            <p style="color: #64748B; font-size: 0.95rem; margin-bottom: 18px;">Offer an exclusive discount or promo code to 500+ AIRA readers.</p>
            <a href="#/submit" class="tool-details-btn" style="padding: 10px 20px; font-weight: 700;">Submit Your Deal →</a>
          </div>
        </div>
      </div>
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
  // 10. Advertise / Sponsorship Media Kit (/#/advertise)
  // =========================================================================
  function renderAdvertisePage() {
    appContainer.innerHTML = `
      <div class="tools-directory-page">
        <div class="container">
          <!-- Hero Header -->
          <div class="tools-hero-section" style="text-align: center; padding: 48px 0 32px 0;">
            <div class="tools-hero-badge" style="display: inline-flex; align-items: center; gap: 6px; background: #ECFDF5; color: #047857; padding: 6px 16px; border-radius: 9999px; font-weight: 700; font-size: 0.85rem; margin-bottom: 16px;">
              <span>⚡</span> Sponsorship & Media Kit
            </div>
            <h1 class="page-title" style="font-size: 2.75rem; margin-bottom: 12px;">Advertise with AIRA</h1>
            <p class="page-description" style="max-width: 680px; margin: 0 auto 28px auto;">
              Put your product, AI platform, or SaaS in front of 500+ top engineers, founders, researchers, and tech leaders every week.
            </p>
          </div>

          <!-- Audience Statistics Grid -->
          <div class="ad-stats-grid">
            <div class="ad-stat-card">
              <div class="ad-stat-num">500+</div>
              <div class="ad-stat-label">Active Subscribers</div>
            </div>
            <div class="ad-stat-card">
              <div class="ad-stat-num">46.8%</div>
              <div class="ad-stat-label">Average Open Rate</div>
            </div>
            <div class="ad-stat-card">
              <div class="ad-stat-num">14.2%</div>
              <div class="ad-stat-label">Click-Through Rate (CTR)</div>
            </div>
            <div class="ad-stat-card">
              <div class="ad-stat-num">68%</div>
              <div class="ad-stat-label">Senior Devs & Founders</div>
            </div>
          </div>

          <!-- Sponsorship Packages Grid -->
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="font-family: var(--font-header); font-size: 1.8rem; font-weight: 900; color: #18181B; margin-bottom: 8px;">Sponsorship Packages</h2>
            <p style="color: #71717A; font-size: 0.95rem;">High-visibility placements engineered for conversions and brand authority.</p>
          </div>

          <div class="ad-packages-grid">
            <!-- Package 1 -->
            <div class="ad-package-card featured">
              <span style="background: #ECFDF5; color: #047857; font-weight: 800; font-size: 0.78rem; padding: 4px 12px; border-radius: 9999px; width: fit-content; margin-bottom: 12px;">MOST POPULAR</span>
              <h3 style="font-size: 1.35rem; font-weight: 900; color: #18181B;">Primary Main Sponsor</h3>
              <div class="ad-package-price">$750 <span style="font-size: 0.9rem; font-weight: 500; color: #71717A;">/ edition</span></div>
              <p style="font-size: 0.9rem; color: #52525B; line-height: 1.5; margin-bottom: 20px;">
                Premium top-of-newsletter placement. 100-word product description, custom image/logo, and primary call-to-action button.
              </p>
              <ul style="list-style: none; padding: 0; margin-bottom: 24px; font-size: 0.88rem; color: #3F3F46; line-height: 2;">
                <li>✓ Top Header Banner Placement</li>
                <li>✓ 100 Words + High-Res Banner</li>
                <li>✓ Featured in Web Archive Edition</li>
                <li>✓ Performance & Click Analytics</li>
              </ul>
              <a href="#sponsor-form-section" class="btn-subscribe-nav" style="text-align: center; padding: 12px; margin-top: auto;">Book Main Sponsor</a>
            </div>

            <!-- Package 2 -->
            <div class="ad-package-card">
              <h3 style="font-size: 1.35rem; font-weight: 900; color: #18181B;">Tool Spotlight</h3>
              <div class="ad-package-price">$350 <span style="font-size: 0.9rem; font-weight: 500; color: #71717A;">/ edition</span></div>
              <p style="font-size: 0.9rem; color: #52525B; line-height: 1.5; margin-bottom: 20px;">
                Dedicated spotlight section within the "Tools of the Week" segment. Includes logo, 50-word pitch, and direct CTA link.
              </p>
              <ul style="list-style: none; padding: 0; margin-bottom: 24px; font-size: 0.88rem; color: #3F3F46; line-height: 2;">
                <li>✓ Mid-Newsletter Spotlight</li>
                <li>✓ 50 Words + Tool Logo + CTA</li>
                <li>✓ Permanent Directory Backlink</li>
                <li>✓ Performance Analytics</li>
              </ul>
              <a href="#sponsor-form-section" class="tool-details-btn" style="text-align: center; padding: 12px; margin-top: auto;">Book Tool Spotlight</a>
            </div>

            <!-- Package 3 -->
            <div class="ad-package-card">
              <h3 style="font-size: 1.35rem; font-weight: 900; color: #18181B;">Classified / Quick Link</h3>
              <div class="ad-package-price">$150 <span style="font-size: 0.9rem; font-weight: 500; color: #71717A;">/ edition</span></div>
              <p style="font-size: 0.9rem; color: #52525B; line-height: 1.5; margin-bottom: 20px;">
                Concise 2-line bullet mention in the curated resources & AI news section with direct hyperlink.
              </p>
              <ul style="list-style: none; padding: 0; margin-bottom: 24px; font-size: 0.88rem; color: #3F3F46; line-height: 2;">
                <li>✓ Classified Section Placement</li>
                <li>✓ 25 Words + Hyperlink</li>
                <li>✓ Quick 24h Turnaround</li>
              </ul>
              <a href="#sponsor-form-section" class="tool-details-btn" style="text-align: center; padding: 12px; margin-top: auto;">Book Classified</a>
            </div>
          </div>

          <!-- Booking Inquiry Form -->
          <div class="submit-form-card" id="sponsor-form-section" style="margin-bottom: 60px;">
            <h3 style="font-family: var(--font-header); font-size: 1.5rem; font-weight: 900; color: #18181B; margin-bottom: 8px;">Book Your Sponsorship Slot</h3>
            <p style="color: #71717A; font-size: 0.93rem; margin-bottom: 24px;">Fill out the details below and our partnerships team will reach out with available dates within 24 hours.</p>

            <form id="advertise-inquiry-form">
              <div class="form-group">
                <label class="form-label">Company / Brand Name <span class="req">*</span></label>
                <input type="text" name="companyName" class="form-input" placeholder="e.g., Anthropic, Cursor, Vercel" required />
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                  <label class="form-label">Work Email <span class="req">*</span></label>
                  <input type="email" name="workEmail" class="form-input" placeholder="sponsor@company.com" required />
                </div>

                <div class="form-group">
                  <label class="form-label">Interested Package <span class="req">*</span></label>
                  <select name="package" class="form-select" required>
                    <option value="Primary Main Sponsor ($750)">Primary Main Sponsor ($750)</option>
                    <option value="Tool Spotlight ($350)">Tool Spotlight ($350)</option>
                    <option value="Classified Quick Link ($150)">Classified Quick Link ($150)</option>
                    <option value="Custom Multi-Issue Bundle">Custom Multi-Issue Bundle</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Target Launch Date / Preferred Month</label>
                <input type="text" name="targetDate" class="form-input" placeholder="e.g., Next available edition / October 2026" />
              </div>

              <div class="form-group">
                <label class="form-label">Product Pitch or Campaign Goal</label>
                <textarea name="message" class="form-textarea" placeholder="Tell us about the product you want to promote..."></textarea>
              </div>

              <button type="submit" class="btn-subscribe-nav" style="width: 100%; padding: 14px; font-size: 1.05rem; border-radius: 10px; margin-top: 16px;">
                Send Sponsorship Inquiry ⚡
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    // Bind inquiry form
    const form = document.getElementById('advertise-inquiry-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const inquiry = {
          company: formData.get('companyName'),
          email: formData.get('workEmail'),
          pkg: formData.get('package'),
          targetDate: formData.get('targetDate'),
          message: formData.get('message'),
          date: new Date().toISOString()
        };
        const inquiries = JSON.parse(localStorage.getItem('aira_ad_inquiries') || '[]');
        inquiries.push(inquiry);
        localStorage.setItem('aira_ad_inquiries', JSON.stringify(inquiries));

        const card = document.getElementById('sponsor-form-section');
        if (card) {
          card.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
              <div style="width: 64px; height: 64px; border-radius: 50%; background: #ECFDF5; color: #047857; font-size: 2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto;">✓</div>
              <h2 style="font-size: 1.6rem; font-weight: 900; color: #18181B; margin-bottom: 12px;">Inquiry Received!</h2>
              <p style="color: #52525B; font-size: 1rem; max-width: 480px; margin: 0 auto 24px auto; line-height: 1.6;">
                Thank you for partnering with AIRA! Our sponsorship manager will reach out to <strong>${inquiry.email}</strong> with available dates and campaign slots within 24 hours.
              </p>
              <a href="#/home" class="btn-subscribe-nav">Return to Homepage</a>
            </div>
          `;
        }
        showToast('🎉 Sponsorship inquiry sent!');
      });
    }
  }

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

      showToast('🎉 Welcome to AIRA! Opening 50 n8n Templates...');
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
  function initSubmitToolModal() {
    const modal = document.getElementById('submit-tool-modal');
    const form = document.getElementById('submit-tool-form');
    const closeBtn = document.getElementById('btn-close-submit-modal');
    const cancelBtn = document.getElementById('btn-cancel-submit-modal');

    function openModal() {
      if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    }

    function closeModal() {
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    }

    // Attach click listeners for any submit tool buttons (navbar, hero, drawer, etc.)
    document.addEventListener('click', (e) => {
      if (e.target.closest('#btn-submit-tool-header, #btn-open-submit-modal, .btn-open-submit-modal-any, #mobile-drawer-submit-tool')) {
        e.preventDefault();
        const drawer = document.getElementById('mobile-nav-drawer');
        const backdrop = document.getElementById('mobile-nav-backdrop');
        if (drawer) drawer.classList.remove('active');
        if (backdrop) backdrop.classList.remove('active');
        openModal();
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

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
          domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '');
        } catch (err) {
          domain = name.toLowerCase().replace(/[^a-z0-9]+/g, '') + '.com';
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `tool-${Date.now()}`;
        const newTool = {
          id: slug,
          name: name,
          category: cat || 'business-productivity',
          categories: [cat || 'business-productivity'],
          pricing: pricing || 'Freemium',
          badge: 'Community Submitted',
          featured: false,
          description: desc,
          url: url.startsWith('http') ? url : `https://${url}`,
          domain: domain,
          image: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
          icon: '⚡',
          inner_content: {
            overview: overview || desc,
            pricingDetails: `${pricing} plan available`
          }
        };

        const existingCustom = getCustomTools();
        existingCustom.unshift(newTool);
        saveCustomTools(existingCustom);

        form.reset();
        closeModal();
        showToast(`🎉 "${name}" was successfully added to AIRA Directory!`);

        if (window.location.hash.startsWith('#/tags')) {
          renderCurrentRoute();
        } else {
          window.location.hash = '#/tags';
        }
      });
    }
  }

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
});
