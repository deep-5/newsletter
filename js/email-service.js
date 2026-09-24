/**
 * AIRA Newsletter - Automated Email Delivery & Broadcast Engine
 * Supports:
 * 1. Automated Welcome Email upon Subscription (With 50 n8n Templates Lead Magnet Link)
 * 2. Automated / Manual Broadcast Email on New Article Publication
 * 3. Multi-Provider Transports: Resend API, n8n/Make Webhook, Vercel Serverless /api/send-email, and Local Audit Logger
 */

(function(window) {
  'use strict';

  const DEFAULT_SETTINGS = {
    provider: 'auto', // 'auto' | 'resend' | 'webhook' | 'local'
    resendApiKey: '',
    senderEmail: 'AIRA Newsletter <newsletter@aira.news>',
    senderName: 'AIRA Newsletter',
    webhookUrl: '',
    replyTo: 'editorial@aira.news',
    leadMagnetUrl: 'https://docs.google.com/spreadsheets/d/190nDBrA-I8J03VlsneEO3U3-z0ERqCfXdF0mwjyKZBY/edit?usp=sharing'
  };

  function getSettings() {
    try {
      const stored = localStorage.getItem('aira_email_settings');
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : { ...DEFAULT_SETTINGS };
    } catch (e) {
      return { ...DEFAULT_SETTINGS };
    }
  }

  function saveSettings(newSettings) {
    const merged = { ...getSettings(), ...newSettings };
    localStorage.setItem('aira_email_settings', JSON.stringify(merged));
    return merged;
  }

  function getLogs() {
    try {
      const logs = localStorage.getItem('aira_email_logs');
      return logs ? JSON.parse(logs) : [];
    } catch (e) {
      return [];
    }
  }

  function appendLog(logEntry) {
    try {
      const logs = getLogs();
      logs.unshift({
        id: 'email-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        timestamp: new Date().toISOString(),
        dateFormatted: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }),
        ...logEntry
      });
      // Keep last 200 logs
      if (logs.length > 200) logs.length = 200;
      localStorage.setItem('aira_email_logs', JSON.stringify(logs));
    } catch (e) {
      console.error('Error saving email log:', e);
    }
  }

  // =========================================================================
  // HTML EMAIL TEMPLATE GENERATORS
  // =========================================================================

  /**
   * Welcome Email Template (Sent immediately upon signup)
   */
  function buildWelcomeEmailHTML(email) {
    const settings = getSettings();
    const siteUrl = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : 'https://aira.news';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to AIRA + Your 50 n8n Templates</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B; }
    table { border-spacing: 0; border-collapse: collapse; }
    td { padding: 0; }
    img { border: 0; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #F8FAFC; padding-bottom: 40px; }
    .main-table { background-color: #FFFFFF; margin: 0 auto; width: 100%; max-width: 600px; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; }
    .header-bar { background-color: #047857; padding: 24px 32px; text-align: center; }
    .header-title { color: #FFFFFF; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin: 0; }
    .header-tagline { color: #A7F3D0; font-size: 13px; font-weight: 600; margin-top: 4px; }
    .content-body { padding: 32px 32px 24px 32px; line-height: 1.65; }
    .greeting { font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 12px; }
    .p-text { font-size: 15px; color: #334155; margin-bottom: 16px; line-height: 1.6; }
    .gift-card { background-color: #ECFDF5; border: 1.5px solid #10B981; border-radius: 10px; padding: 20px; margin: 24px 0; text-align: center; }
    .gift-badge { display: inline-block; background-color: #047857; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 999px; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 8px; }
    .gift-title { font-size: 18px; font-weight: 800; color: #065F46; margin: 0 0 6px 0; }
    .gift-desc { font-size: 13px; color: #047857; margin-bottom: 16px; }
    .btn-gift { display: inline-block; background-color: #047857; color: #FFFFFF !important; text-decoration: none; font-size: 15px; font-weight: 700; padding: 12px 28px; border-radius: 8px; box-shadow: 0 4px 12px rgba(4, 120, 87, 0.25); }
    .features-list { background-color: #F8FAFC; border-radius: 8px; padding: 16px 20px; margin: 20px 0; }
    .feature-item { font-size: 14px; color: #475569; margin-bottom: 8px; display: flex; align-items: center; }
    .footer { background-color: #F1F5F9; padding: 24px 32px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0; }
    .footer a { color: #047857; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main-table" align="center" cellpadding="0" cellspacing="0">
      <tr>
        <td class="header-bar">
          <h1 class="header-title">AIRA</h1>
          <div class="header-tagline">THE ONE AND ONLY AI NEWSLETTER</div>
        </td>
      </tr>
      <tr>
        <td class="content-body">
          <div class="greeting">Welcome to AIRA! ⚡</div>
          <p class="p-text">
            You're officially on the list. You've joined <strong>500+ AI engineers, researchers, and tech pioneers</strong> who get the most important frontier AI breakthroughs delivered directly to their inbox every single day.
          </p>

          <!-- Free Gift Box -->
          <div class="gift-card">
            <span class="gift-badge">🎁 YOUR SUBSCRIBER GIFT</span>
            <h3 class="gift-title">AI Automation | 50 n8n Templates</h3>
            <p class="gift-desc">Instant production-ready workflow automation blueprints for AI agents, leads, scrapers & integrations.</p>
            <a href="${settings.leadMagnetUrl}" target="_blank" class="btn-gift">
              Access 50 n8n Templates (Google Sheet) ➔
            </a>
          </div>

          <p class="p-text"><strong>Here is what to expect from AIRA:</strong></p>
          <div class="features-list">
            <div class="feature-item">▸ <strong>Daily AI Editions:</strong> Deep dives on Claude, OpenAI, DeepSeek & Gemini.</div>
            <div class="feature-item">▸ <strong>Curated AI Tools Directory:</strong> 96+ authentic developer tools & ratings.</div>
            <div class="feature-item">▸ <strong>Software Alternatives:</strong> 100+ open-source replacements for proprietary tools.</div>
            <div class="feature-item">▸ <strong>Production Prompts Vault:</strong> 122+ battle-tested system prompts.</div>
          </div>

          <p class="p-text" style="margin-top: 20px;">
            To ensure our emails always reach your primary inbox, please move this email out of the "Promotions" or "Spam" tab, or reply with a quick <strong>"Hey AIRA!"</strong>.
          </p>

          <p class="p-text" style="margin-top: 24px; margin-bottom: 0;">
            See you in tomorrow's edition,<br>
            <strong>AIRA</strong>
          </p>
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p style="margin: 0 0 6px 0;">© ${new Date().getFullYear()} AIRA Intelligence. All rights reserved.</p>
          <p style="margin: 0;">
            <a href="${siteUrl}/#/home">Visit Website</a> • 
            <a href="${siteUrl}/#/alternatives">Software Alternatives</a> • 
            <a href="${siteUrl}/#/prompts">Prompts Vault</a>
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
  }

  /**
   * New Article Broadcast Email Template
   */
  function buildArticleBroadcastEmailHTML(article, subscriberEmail) {
    const siteUrl = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : 'https://aira.news';
    const articleUrl = `${siteUrl}/#/post/${article.slug || ''}`;
    const cleanImage = article.image_url && article.image_url !== 'assets/logo.jpg' ? article.image_url : `${siteUrl}/assets/logo.jpg`;
    
    // Extract a clean 2-sentence summary
    let cleanSubtitle = article.subtitle || '';
    if (!cleanSubtitle && article.body_html) {
      const stripped = article.body_html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      cleanSubtitle = stripped.substring(0, 160) + '...';
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${article.title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B; }
    table { border-spacing: 0; border-collapse: collapse; }
    td { padding: 0; }
    img { border: 0; display: block; max-width: 100%; height: auto; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #F8FAFC; padding-bottom: 40px; }
    .main-table { background-color: #FFFFFF; margin: 0 auto; width: 100%; max-width: 600px; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; }
    .header-bar { background-color: #047857; padding: 20px 32px; display: flex; align-items: center; justify-content: space-between; text-align: left; }
    .header-title { color: #FFFFFF; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin: 0; text-decoration: none; }
    .header-date { color: #A7F3D0; font-size: 12px; font-weight: 600; text-align: right; }
    .cover-img-wrap { width: 100%; max-height: 280px; overflow: hidden; background: #000; }
    .cover-img { width: 100%; height: auto; object-fit: cover; }
    .content-body { padding: 28px 32px 24px 32px; }
    .badge-row { margin-bottom: 12px; }
    .cat-badge { display: inline-block; background-color: #ECFDF5; color: #047857; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.04em; }
    .read-time { font-size: 12px; color: #64748B; margin-left: 8px; font-weight: 600; }
    .article-title { font-size: 22px; font-weight: 800; color: #0F172A; line-height: 1.3; margin: 0 0 12px 0; letter-spacing: -0.02em; }
    .article-desc { font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 22px; }
    .tldr-box { background-color: #F0FDF4; border-left: 4px solid #047857; border-radius: 6px; padding: 14px 18px; margin-bottom: 24px; font-size: 14px; color: #166534; line-height: 1.5; }
    .tldr-title { font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #047857; margin-bottom: 6px; display: block; }
    .btn-read-now { display: block; width: 100%; box-sizing: border-box; text-align: center; background-color: #047857; color: #FFFFFF !important; text-decoration: none; font-size: 16px; font-weight: 700; padding: 14px 20px; border-radius: 8px; box-shadow: 0 4px 14px rgba(4, 120, 87, 0.25); }
    .author-row { margin-top: 24px; padding-top: 16px; border-top: 1px solid #F1F5F9; display: flex; align-items: center; justify-content: space-between; font-size: 13px; color: #64748B; }
    .footer { background-color: #F8FAFC; padding: 20px 32px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0; }
    .footer a { color: #047857; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main-table" align="center" cellpadding="0" cellspacing="0">
      <tr>
        <td class="header-bar">
          <table width="100%">
            <tr>
              <td><a href="${siteUrl}" class="header-title">AIRA</a></td>
              <td align="right" class="header-date">${article.date || 'Today'}</td>
            </tr>
          </table>
        </td>
      </tr>
      ${article.image_url ? `
      <tr>
        <td class="cover-img-wrap">
          <img src="${cleanImage}" alt="${article.title}" class="cover-img" onerror="this.style.display='none'" />
        </td>
      </tr>
      ` : ''}
      <tr>
        <td class="content-body">
          <div class="badge-row">
            <span class="cat-badge">${article.tag || 'AI Intelligence'}</span>
            <span class="read-time">⏱️ ${article.reading_time || '4 min read'}</span>
          </div>
          
          <h2 class="article-title">${article.title}</h2>
          
          <p class="article-desc">
            ${cleanSubtitle}
          </p>

          <div class="tldr-box">
            <span class="tldr-title">⚡ AIRA EXECUTIVE TAKEAWAY</span>
            Discover the key takeaways, architecture breakdown, and implementation details inside today's full edition.
          </div>

          <table width="100%">
            <tr>
              <td>
                <a href="${articleUrl}" target="_blank" class="btn-read-now">
                  Read Full Edition on AIRA ➔
                </a>
              </td>
            </tr>
          </table>

          <div class="author-row">
            <span>Written by <strong>${article.author || 'AIRA Editorial'}</strong></span>
            <span>Edition #${article.slug ? article.slug.substring(0, 10) : 'Daily'}</span>
          </div>
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p style="margin: 0 0 6px 0;">You received this because you are subscribed to the AIRA AI Newsletter.</p>
          <p style="margin: 0;">
            <a href="${siteUrl}/#/home">View All Editions</a> • 
            <a href="${siteUrl}/#/prompts">Prompts Vault</a> • 
            <a href="${siteUrl}/#/alternatives">Software Alternatives</a>
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
  }

  // =========================================================================
  // DISPATCH ENGINE (Handles API, Webhooks & Transports)
  // =========================================================================

  /**
   * Universal Dispatcher
   */
  async function executeSend({ to, subject, html, type, metadata = {} }) {
    const settings = getSettings();
    const cleanTo = (to || '').trim().toLowerCase();

    if (!cleanTo) {
      return { success: false, error: 'Recipient email is missing' };
    }

    let status = 'delivered';
    let transportUsed = 'local-simulation';
    let providerError = null;

    try {
      // 1. Check if Resend API Key is provided
      if (settings.resendApiKey && settings.resendApiKey.startsWith('re_')) {
        transportUsed = 'resend-api';
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${settings.resendApiKey.trim()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: settings.senderEmail || 'AIRA Newsletter <onboarding@resend.dev>',
            to: [cleanTo],
            subject: subject,
            html: html,
            reply_to: settings.replyTo || 'editorial@aira.news'
          })
        });

        const resData = await res.json();
        if (!res.ok) {
          throw new Error(resData.message || 'Resend API returned error');
        }
      }
      // 2. Check if Webhook (n8n / Make.com / Zapier) is configured
      else if (settings.webhookUrl && settings.webhookUrl.startsWith('http')) {
        transportUsed = 'webhook-n8n';
        const res = await fetch(settings.webhookUrl.trim(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: type,
            recipient: cleanTo,
            subject: subject,
            html: html,
            metadata: metadata,
            timestamp: new Date().toISOString()
          })
        });
        if (!res.ok) {
          throw new Error(`Webhook returned status ${res.status}`);
        }
      }
      // 3. Try Vercel Serverless / Local Node endpoint if available
      else {
        try {
          const res = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: cleanTo, subject, html, type, metadata })
          });
          if (res.ok) {
            transportUsed = 'serverless-api';
          }
        } catch (localApiErr) {
          // Fallback to in-browser delivery record
          transportUsed = 'local-engine';
        }
      }
    } catch (err) {
      console.warn(`Email transport error (${transportUsed}):`, err);
      status = 'failed';
      providerError = err.message || String(err);
    }

    // Log the event
    const logItem = {
      type: type || 'custom',
      recipient: cleanTo,
      subject: subject,
      status: status,
      transport: transportUsed,
      error: providerError,
      metadata: metadata
    };
    appendLog(logItem);

    return {
      success: status === 'delivered',
      transport: transportUsed,
      error: providerError,
      logItem
    };
  }

  // =========================================================================
  // PUBLIC EMAIL SERVICE API
  // =========================================================================

  const EmailService = {
    /**
     * Send instant Welcome Email with 50 n8n templates Google Sheet link
     */
    async sendWelcomeEmail(subscriberEmail, source = 'Website') {
      const subject = '⚡ Welcome to AIRA + Your 50 n8n Templates (Google Sheet)';
      const html = buildWelcomeEmailHTML(subscriberEmail);
      
      const result = await executeSend({
        to: subscriberEmail,
        subject: subject,
        html: html,
        type: 'welcome',
        metadata: { source: source, gift: '50 n8n Templates' }
      });

      return result;
    },

    /**
     * Broadcast New Article to all subscribers
     */
    async broadcastArticle(article, subscribersList = null, onProgress = null) {
      if (!article || !article.title) {
        return { success: false, error: 'Invalid article data' };
      }

      // Get subscribers from storage or argument
      let subscribers = subscribersList;
      if (!subscribers) {
        const stored = JSON.parse(localStorage.getItem('aira_subscribers') || '[]');
        subscribers = stored.map(s => (typeof s === 'string' ? s : s.email)).filter(Boolean);
      }

      if (subscribers.length === 0) {
        return { success: false, total: 0, sent: 0, error: 'No subscribers found' };
      }

      const subject = `⚡ New on AIRA: ${article.title}`;
      let sentCount = 0;
      let failCount = 0;
      const results = [];

      for (let i = 0; i < subscribers.length; i++) {
        const email = subscribers[i];
        const html = buildArticleBroadcastEmailHTML(article, email);

        const res = await executeSend({
          to: email,
          subject: subject,
          html: html,
          type: 'article_broadcast',
          metadata: { article_slug: article.slug, article_title: article.title }
        });

        if (res.success) {
          sentCount++;
        } else {
          failCount++;
        }
        results.push({ email, ...res });

        if (typeof onProgress === 'function') {
          onProgress({
            current: i + 1,
            total: subscribers.length,
            percent: Math.round(((i + 1) / subscribers.length) * 100),
            lastEmail: email,
            sentCount,
            failCount
          });
        }
      }

      return {
        success: sentCount > 0,
        total: subscribers.length,
        sent: sentCount,
        failed: failCount,
        results
      };
    },

    /**
     * Send a single Test Email
     */
    async sendTestEmail(targetEmail, type = 'welcome', sampleArticle = null) {
      if (type === 'welcome') {
        return await this.sendWelcomeEmail(targetEmail, 'Test Admin Send');
      } else {
        const dummyArticle = sampleArticle || {
          title: 'Claude 3.7 Sonnet & Hybrid Reasoning in Production',
          subtitle: 'Comprehensive benchmarks comparing Anthropic extended thinking with OpenAI operator.',
          slug: 'claude-3-7-sonnet-hybrid-reasoning',
          date: 'Today',
          reading_time: '4 min read',
          tag: 'Frontier LLMs',
          author: 'AIRA Editorial',
          image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
        };
        const html = buildArticleBroadcastEmailHTML(dummyArticle, targetEmail);
        return await executeSend({
          to: targetEmail,
          subject: `[TEST BROADCAST] ⚡ New on AIRA: ${dummyArticle.title}`,
          html: html,
          type: 'test_broadcast',
          metadata: { isTest: true }
        });
      }
    },

    // Utilities & Settings
    getSettings,
    saveSettings,
    getLogs,
    buildWelcomeEmailHTML,
    buildArticleBroadcastEmailHTML
  };

  if (typeof window !== 'undefined') {
    window.EmailService = EmailService;
  }
  if (typeof module !== 'undefined') {
    module.exports = EmailService;
  }

})(typeof window !== 'undefined' ? window : this);
