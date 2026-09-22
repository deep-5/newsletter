/**
 * AIRA - Master AI Audio Reader & Narration Engine
 * Features:
 * 1. Global Floating Sticky Audio Player (Spotify/Podcast Style) with Progress Track
 * 2. Live Animated Equalizer Sound Waves (Dynamic dancing frequency bars)
 * 3. Homepage & Card Quick Listen (1-Click instant audio narration without leaving feed)
 * 4. Chunked speech synthesis (Prevents Mobile Safari & Android Chrome timeout freezes)
 * 5. 100% Free - Built using Native Web Speech API (Zero External Cost, ₹0)
 */

(function() {
  const airaAudioEngine = {
    isPlaying: false,
    isPaused: false,
    currentSlug: null,
    currentArticle: null,
    chunks: [],
    currentChunkIdx: 0,
    rate: 1.0,
    initialized: false,

    init() {
      if (this.initialized) return;
      this.initialized = true;

      // Pre-warm voices
      if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
        }
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.mountDOM());
      } else {
        this.mountDOM();
      }
    },

    mountDOM() {
      if (document.getElementById('aira-floating-player')) return;

      const playerEl = document.createElement('div');
      playerEl.id = 'aira-floating-player';
      playerEl.className = 'aira-floating-player hidden';
      playerEl.innerHTML = `
        <div class="floating-progress-track">
          <div class="floating-progress-bar" id="floating-progress-fill"></div>
        </div>
        <div class="floating-player-content">
          <div class="floating-player-left">
            <img src="assets/logo.jpg" alt="Article Cover" class="floating-thumb" id="floating-player-thumb" />
            <div class="sound-wave-bars" id="floating-sound-waves">
              <span class="bar bar-1"></span>
              <span class="bar bar-2"></span>
              <span class="bar bar-3"></span>
              <span class="bar bar-4"></span>
            </div>
            <div class="floating-meta">
              <a href="#/home" class="floating-title" id="floating-player-title">AIRA Article Narration</a>
              <div class="floating-status" id="floating-player-status">Ready to play</div>
            </div>
          </div>
          <div class="floating-player-controls">
            <div class="floating-speed-wrap">
              <button type="button" class="floating-speed-btn active" data-rate="1">1x</button>
              <button type="button" class="floating-speed-btn" data-rate="1.25">1.25x</button>
              <button type="button" class="floating-speed-btn" data-rate="1.5">1.5x</button>
            </div>
            <button type="button" class="floating-play-btn" id="floating-btn-play" title="Play / Pause">
              <span id="floating-play-icon">▶</span>
            </button>
            <button type="button" class="floating-close-btn" id="floating-btn-close" title="Stop & Close Player">✕</button>
          </div>
        </div>
      `;
      document.body.appendChild(playerEl);
      this.bindEvents();
    },

    bindEvents() {
      const playBtn = document.getElementById('floating-btn-play');
      const closeBtn = document.getElementById('floating-btn-close');

      if (playBtn) {
        playBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.togglePlay();
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.stop();
        });
      }

      const playerEl = document.getElementById('aira-floating-player');
      if (playerEl) {
        playerEl.querySelectorAll('.floating-speed-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const r = parseFloat(btn.getAttribute('data-rate'));
            if (r) this.setSpeed(r);
          });
        });
      }
    },

    cleanArticleText(articleObj) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = articleObj.body_html || '';
      tempDiv.querySelectorAll('script, style, button, svg, .ad-banner-mint, .ad-sidebar-card, .article-subscribe-card, .comments-section, .recommended-section').forEach(el => el.remove());
      const rawBody = (tempDiv.textContent || tempDiv.innerText || '').replace(/\s+/g, ' ').trim();
      const combined = `${articleObj.title}. ${articleObj.subtitle ? articleObj.subtitle + '.' : ''} ${rawBody}`;
      
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
    },

    getVoice() {
      if (!('speechSynthesis' in window)) return null;
      const voices = window.speechSynthesis.getVoices() || [];
      return voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Siri') || v.default)) ||
             voices.find(v => v.lang.startsWith('en')) || null;
    },

    findArticleBySlug(slug) {
      if (typeof state !== 'undefined' && state.articles && state.articles.length > 0) {
        const found = state.articles.find(a => a.slug === slug);
        if (found) return found;
      }
      if (typeof ARTICLES !== 'undefined' && Array.isArray(ARTICLES)) {
        return ARTICLES.find(a => a.slug === slug);
      }
      return null;
    },

    togglePlay(slug) {
      if (!('speechSynthesis' in window)) {
        if (typeof showToast === 'function') {
          showToast('Audio narration is not supported in this browser.');
        } else {
          alert('Audio narration is not supported in this browser.');
        }
        return;
      }

      // If a specific article is requested and it is different from current
      if (slug && slug !== this.currentSlug) {
        this.play(slug);
        return;
      }

      // If already playing current article
      if (this.isPlaying && !this.isPaused) {
        this.pause();
      } else if (this.isPlaying && this.isPaused) {
        this.resume();
      } else if (slug) {
        this.play(slug);
      } else if (this.currentArticle) {
        this.play(this.currentSlug);
      }
    },

    play(slug) {
      const article = this.findArticleBySlug(slug);
      if (!article) {
        console.warn('Audio reader could not find article with slug:', slug);
        return;
      }

      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      this.currentSlug = slug;
      this.currentArticle = article;
      this.chunks = this.cleanArticleText(article);
      this.currentChunkIdx = 0;
      this.isPlaying = true;
      this.isPaused = false;

      this.updateUI();
      this.speakNext();
    },

    speakNext() {
      if (!this.isPlaying || this.isPaused || !('speechSynthesis' in window)) return;

      if (this.currentChunkIdx >= this.chunks.length) {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentChunkIdx = 0;
        this.updateUI(true);
        return;
      }

      const chunkText = this.chunks[this.currentChunkIdx];
      const utterance = new SpeechSynthesisUtterance(chunkText);
      utterance.lang = 'en-US';
      utterance.rate = this.rate;
      utterance.pitch = 1.0;

      const voice = this.getVoice();
      if (voice) utterance.voice = voice;

      utterance.onend = () => {
        if (this.isPlaying && !this.isPaused) {
          this.currentChunkIdx++;
          this.updateUI();
          this.speakNext();
        }
      };

      utterance.onerror = (err) => {
        if (err.error !== 'canceled' && err.error !== 'interrupted') {
          if (this.isPlaying && !this.isPaused) {
            this.currentChunkIdx++;
            this.updateUI();
            this.speakNext();
          }
        }
      };

      window.speechSynthesis.speak(utterance);
    },

    pause() {
      if (!this.isPlaying) return;
      this.isPaused = true;
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      this.updateUI();
    },

    resume() {
      if (!this.isPlaying || !this.isPaused) return;
      this.isPaused = false;
      this.updateUI();
      this.speakNext();
    },

    stop() {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      this.isPlaying = false;
      this.isPaused = false;
      this.currentChunkIdx = 0;
      this.currentSlug = null;
      this.currentArticle = null;
      this.updateUI();
    },

    setSpeed(newRate) {
      this.rate = newRate;
      document.querySelectorAll('.floating-speed-btn, .tts-speed-btn').forEach(btn => {
        const r = parseFloat(btn.getAttribute('data-rate'));
        if (r === newRate) btn.classList.add('active');
        else btn.classList.remove('active');
      });

      if (this.isPlaying && !this.isPaused && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        this.speakNext();
      }
    },

    updateUI(isFinished = false) {
      const playerEl = document.getElementById('aira-floating-player');
      if (!playerEl) return;

      if (!this.currentArticle && !this.isPlaying) {
        playerEl.classList.add('hidden');
        this.syncCardButtons();
        this.syncInlinePlayer();
        return;
      }

      playerEl.classList.remove('hidden');

      const thumb = document.getElementById('floating-player-thumb');
      const title = document.getElementById('floating-player-title');
      const status = document.getElementById('floating-player-status');
      const icon = document.getElementById('floating-play-icon');
      const fill = document.getElementById('floating-progress-fill');
      const waves = document.getElementById('floating-sound-waves');

      if (thumb && this.currentArticle) {
        thumb.src = this.currentArticle.image_url || 'assets/logo.jpg';
      }
      if (title && this.currentArticle) {
        title.innerText = this.currentArticle.title || 'AIRA Narration';
        title.href = `#/p/${this.currentArticle.slug}`;
      }

      const totalChunks = Math.max(1, this.chunks.length);
      const progressPct = isFinished ? 100 : Math.round((this.currentChunkIdx / totalChunks) * 100);

      if (fill) fill.style.width = `${progressPct}%`;

      if (isFinished) {
        if (icon) icon.innerHTML = '▶';
        if (status) status.innerText = 'Completed • Tap to replay ✓';
        if (waves) waves.classList.remove('active');
      } else if (this.isPlaying && !this.isPaused) {
        if (icon) icon.innerHTML = '⏸';
        if (status) status.innerText = `Playing ${this.rate}x • ${progressPct}% completed`;
        if (waves) waves.classList.add('active');
      } else if (this.isPlaying && this.isPaused) {
        if (icon) icon.innerHTML = '▶';
        if (status) status.innerText = `Paused at ${progressPct}% • Tap to resume`;
        if (waves) waves.classList.remove('active');
      }

      this.syncCardButtons();
      this.syncInlinePlayer(isFinished, progressPct);
    },

    syncCardButtons() {
      document.querySelectorAll('.card-listen-btn').forEach(btn => {
        const slug = btn.getAttribute('data-slug');
        const iconSpan = btn.querySelector('.listen-btn-icon') || btn;
        const textSpan = btn.querySelector('.listen-btn-text');

        if (slug === this.currentSlug && this.isPlaying && !this.isPaused) {
          btn.classList.add('playing');
          if (iconSpan) iconSpan.innerHTML = '⏸';
          if (textSpan) textSpan.innerText = 'Playing';
        } else if (slug === this.currentSlug && this.isPaused) {
          btn.classList.add('playing');
          if (iconSpan) iconSpan.innerHTML = '▶';
          if (textSpan) textSpan.innerText = 'Paused';
        } else {
          btn.classList.remove('playing');
          if (iconSpan) iconSpan.innerHTML = '🎧';
          if (textSpan) textSpan.innerText = 'Listen';
        }
      });
    },

    syncInlinePlayer(isFinished = false, progressPct = 0) {
      const inlinePlayBtn = document.getElementById('btn-tts-play');
      const inlinePlayIcon = document.getElementById('tts-play-icon');
      const inlineStatus = document.getElementById('tts-status-text');
      const inlineTitle = document.getElementById('tts-title-label');
      const inlineWaves = document.getElementById('inline-sound-waves');

      if (!inlinePlayBtn) return;

      const currentViewingSlug = (typeof state !== 'undefined' && state.currentArticle) ? state.currentArticle.slug : null;

      if (isFinished) {
        if (inlinePlayIcon) inlinePlayIcon.innerHTML = '▶';
        if (inlineTitle) inlineTitle.innerHTML = 'Completed Narration';
        if (inlineStatus) inlineStatus.innerHTML = 'Finished • Tap to replay ✓';
        if (inlineWaves) inlineWaves.classList.remove('active');
      } else if (this.isPlaying && !this.isPaused && this.currentSlug === currentViewingSlug) {
        if (inlinePlayIcon) inlinePlayIcon.innerHTML = '⏸';
        if (inlineTitle) inlineTitle.innerHTML = 'Playing AI Voice...';
        if (inlineStatus) inlineStatus.innerHTML = `Playing ${this.rate}x • ${progressPct}% finished`;
        if (inlineWaves) inlineWaves.classList.add('active');
      } else if (this.isPlaying && this.isPaused && this.currentSlug === currentViewingSlug) {
        if (inlinePlayIcon) inlinePlayIcon.innerHTML = '▶';
        if (inlineTitle) inlineTitle.innerHTML = 'Paused Narration';
        if (inlineStatus) inlineStatus.innerHTML = `Paused at ${progressPct}% • Tap to resume`;
        if (inlineWaves) inlineWaves.classList.remove('active');
      } else {
        if (inlinePlayIcon) inlinePlayIcon.innerHTML = '▶';
        if (inlineTitle) inlineTitle.innerHTML = 'Listen to this edition';
        const readTime = (typeof state !== 'undefined' && state.currentArticle && state.currentArticle.reading_time) || '4 min read';
        if (inlineStatus) inlineStatus.innerHTML = `${readTime} • AI Voice Narration`;
        if (inlineWaves) inlineWaves.classList.remove('active');
      }
    }
  };

  window.airaAudioEngine = airaAudioEngine;
  airaAudioEngine.init();
})();
