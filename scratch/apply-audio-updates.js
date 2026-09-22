const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// 1. Update Homepage Article Card in updateArticlesGrid (around line 1370)
const oldCardFooter = `<div class="card-footer">
                        <div class="card-author-info">
                          <img src="\${article.author_avatar || 'assets/logo.svg'}" alt="\${article.author || 'AIRA Editorial Team'}" class="card-author-avatar" onerror="this.src='assets/logo.svg'" />
                          <span class="card-author-name">\${article.author || 'AIRA Editorial Team'}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <span class="card-meta-date">\${article.date || 'Sep 2026'} • \${article.reading_time || article.read_time || '4 min read'}</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-text-muted); flex-shrink: 0;"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                        </div>
                      </div>`;

const newCardFooter = `<div class="card-footer">
                        <div class="card-author-info">
                          <img src="\${article.author_avatar || 'assets/logo.svg'}" alt="\${article.author || 'AIRA Editorial Team'}" class="card-author-avatar" onerror="this.src='assets/logo.svg'" />
                          <span class="card-author-name">\${article.author || 'AIRA Editorial Team'}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <button type="button" class="card-listen-btn" data-slug="\${article.slug}" title="Listen to AI Voice Narration" onclick="event.preventDefault(); event.stopPropagation(); window.airaAudioEngine && window.airaAudioEngine.togglePlay('\${article.slug}');">
                            <span class="listen-btn-icon">🎧</span>
                            <span class="listen-btn-text">Listen</span>
                          </button>
                          <span class="card-meta-date">\${article.date || 'Sep 2026'} • \${article.reading_time || article.read_time || '4 min read'}</span>
                        </div>
                      </div>`;

if (appJs.includes(oldCardFooter)) {
  appJs = appJs.replace(oldCardFooter, newCardFooter);
  console.log('✔ Replaced homepage article card footer with Quick Listen button');
} else {
  console.log('⚠ oldCardFooter not found verbatim, trying regex...');
  appJs = appJs.replace(
    /<div style="display: flex; align-items: center; gap: 8px;">\s*<span class="card-meta-date">\$\{article\.date \|\| 'Sep 2026'\} • \$\{article\.reading_time \|\| article\.read_time \|\| '4 min read'\}<\/span>\s*<svg[^>]*>.*?<\/svg>\s*<\/div>/s,
    `<div style="display: flex; align-items: center; gap: 8px;">
                          <button type="button" class="card-listen-btn" data-slug="\${article.slug}" title="Listen to AI Voice Narration" onclick="event.preventDefault(); event.stopPropagation(); window.airaAudioEngine && window.airaAudioEngine.togglePlay('\${article.slug}');">
                            <span class="listen-btn-icon">🎧</span>
                            <span class="listen-btn-text">Listen</span>
                          </button>
                          <span class="card-meta-date">\${article.date || 'Sep 2026'} • \${article.reading_time || article.read_time || '4 min read'}</span>
                        </div>`
  );
  console.log('✔ Regex replacement for card-listen-btn applied');
}

// 2. Update Keep Reading Cards in renderPostPage
const oldKrFooter = `<div class="kr-card-footer">
                      <span class="kr-card-date">\${rec.date || 'Sep 2026'} • \${rec.reading_time || rec.read_time || '4 min read'}</span>
                      <span class="kr-card-read-more">Read →</span>
                    </div>`;

const newKrFooter = `<div class="kr-card-footer">
                      <button type="button" class="card-listen-btn" data-slug="\${rec.slug}" title="Listen to AI Voice Narration" onclick="event.preventDefault(); event.stopPropagation(); window.airaAudioEngine && window.airaAudioEngine.togglePlay('\${rec.slug}');">
                        <span class="listen-btn-icon">🎧</span>
                        <span class="listen-btn-text">Listen</span>
                      </button>
                      <span class="kr-card-date">\${rec.date || 'Sep 2026'} • \${rec.reading_time || rec.read_time || '4 min read'}</span>
                      <span class="kr-card-read-more">Read →</span>
                    </div>`;

if (appJs.includes(oldKrFooter)) {
  appJs = appJs.replace(oldKrFooter, newKrFooter);
  console.log('✔ Replaced keep-reading card footer with Quick Listen button');
}

// 3. Update Inline Article TTS Player in renderPostPage
const oldInlineTts = `<!-- Text-to-Speech Audio Player Bar -->
          <div class="article-tts-player" id="article-tts-bar">
            <button type="button" class="tts-play-btn" id="btn-tts-play" title="Listen to this article">
              <span id="tts-play-icon">▶</span>
            </button>
            <div class="tts-info-group">
              <div class="tts-label">
                <span>🎧</span>
                <span id="tts-title-label">Listen to this edition</span>
              </div>
              <div class="tts-status-text" id="tts-status-text">\${article.reading_time || '4 min read'} • AI Voice Narration</div>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <button type="button" class="tts-speed-btn active" data-rate="1">1x</button>
              <button type="button" class="tts-speed-btn" data-rate="1.25">1.25x</button>
              <button type="button" class="tts-speed-btn" data-rate="1.5">1.5x</button>
            </div>
          </div>`;

const newInlineTts = `<!-- Text-to-Speech Audio Player Bar with Live Sound Waves -->
          <div class="article-tts-player" id="article-tts-bar">
            <button type="button" class="tts-play-btn" id="btn-tts-play" title="Listen to this article" onclick="event.preventDefault(); window.airaAudioEngine && window.airaAudioEngine.togglePlay('\${article.slug}');">
              <span id="tts-play-icon">▶</span>
            </button>
            <div class="sound-wave-bars" id="inline-sound-waves">
              <span class="bar bar-1"></span>
              <span class="bar bar-2"></span>
              <span class="bar bar-3"></span>
              <span class="bar bar-4"></span>
            </div>
            <div class="tts-info-group">
              <div class="tts-label">
                <span id="tts-title-label">Listen to this edition</span>
              </div>
              <div class="tts-status-text" id="tts-status-text">\${article.reading_time || '4 min read'} • AI Voice Narration</div>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <button type="button" class="tts-speed-btn active" data-rate="1" onclick="event.preventDefault(); window.airaAudioEngine && window.airaAudioEngine.setSpeed(1);">1x</button>
              <button type="button" class="tts-speed-btn" data-rate="1.25" onclick="event.preventDefault(); window.airaAudioEngine && window.airaAudioEngine.setSpeed(1.25);">1.25x</button>
              <button type="button" class="tts-speed-btn" data-rate="1.5" onclick="event.preventDefault(); window.airaAudioEngine && window.airaAudioEngine.setSpeed(1.5);">1.5x</button>
            </div>
          </div>`;

if (appJs.includes(oldInlineTts)) {
  appJs = appJs.replace(oldInlineTts, newInlineTts);
  console.log('✔ Replaced inline TTS player bar with sound wave synced player');
}

// 4. In updateArticlesGrid, call syncCardButtons
if (appJs.includes('feedInner.querySelectorAll(\'.filter-pill\')')) {
  appJs = appJs.replace(
    'feedInner.querySelectorAll(\'.filter-pill\')',
    'if (window.airaAudioEngine) window.airaAudioEngine.syncCardButtons();\n      feedInner.querySelectorAll(\'.filter-pill\')'
  );
  console.log('✔ Added syncCardButtons call to updateArticlesGrid');
}

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✔ app.js updated successfully!');
