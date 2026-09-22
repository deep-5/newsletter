const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

const audioCss = `
/* ==========================================================================
   MASTER AI AUDIO READER & NARRATION ENGINE (100% FREE WEB SPEECH)
   ========================================================================== */

/* Animated Equalizer Sound Waves */
.sound-wave-bars {
  display: inline-flex;
  align-items: flex-end;
  gap: 2.5px;
  height: 18px;
  width: 18px;
  flex-shrink: 0;
}

.sound-wave-bars .bar {
  width: 2.5px;
  background: #047857;
  border-radius: 999px;
  height: 4px;
  transition: height 0.2s ease;
}

.sound-wave-bars.active .bar-1 { animation: soundWave 0.75s ease-in-out infinite alternate; }
.sound-wave-bars.active .bar-2 { animation: soundWave 1.05s ease-in-out infinite 0.2s alternate; }
.sound-wave-bars.active .bar-3 { animation: soundWave 0.85s ease-in-out infinite 0.4s alternate; }
.sound-wave-bars.active .bar-4 { animation: soundWave 1.15s ease-in-out infinite 0.1s alternate; }

@keyframes soundWave {
  0% { height: 3px; }
  50% { height: 16px; }
  100% { height: 5px; }
}

body.dark-mode .sound-wave-bars .bar {
  background: #34D399;
}

/* Homepage & Card Quick Listen Button */
.card-listen-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 9px;
  background: #ECFDF5;
  border: 1px solid #A7F3D0;
  border-radius: 999px;
  color: #047857;
  font-family: var(--font-header);
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
  line-height: 1;
}

.card-listen-btn:hover {
  background: #047857;
  color: #FFFFFF;
  border-color: #047857;
  transform: translateY(-1px);
}

.card-listen-btn.playing {
  background: #047857;
  color: #FFFFFF;
  border-color: #047857;
  box-shadow: 0 2px 8px rgba(4, 120, 87, 0.35);
}

body.dark-mode .card-listen-btn {
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.3);
  color: #34D399;
}

body.dark-mode .card-listen-btn:hover,
body.dark-mode .card-listen-btn.playing {
  background: #059669;
  color: #FFFFFF;
  border-color: #059669;
}

/* Article Inline TTS Player */
.article-tts-player {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  border-radius: 14px;
  padding: 14px 20px;
  margin-bottom: 28px;
  box-shadow: 0 2px 10px rgba(4, 120, 87, 0.04);
}

.tts-play-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #047857;
  color: #FFFFFF;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
  font-size: 0.95rem;
}

.tts-play-btn:hover {
  background: #065F46;
  transform: scale(1.05);
}

.tts-info-group {
  flex: 1;
  min-width: 0;
}

.tts-label {
  font-size: 0.88rem;
  font-weight: 750;
  color: #065F46;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tts-status-text {
  font-size: 0.78rem;
  color: #047857;
  margin-top: 2px;
}

.tts-speed-btn {
  background: #FFFFFF;
  border: 1px solid #A7F3D0;
  color: #065F46;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tts-speed-btn.active {
  background: #047857;
  color: #FFFFFF;
  border-color: #047857;
}

/* Global Floating Sticky Audio Player (Spotify / Podcast Style) */
.aira-floating-player {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(0);
  width: calc(100% - 32px);
  max-width: 720px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(16, 185, 129, 0.35);
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.14), 0 2px 8px rgba(16, 185, 129, 0.12);
  z-index: 9999;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
  overflow: hidden;
}

.aira-floating-player.hidden {
  transform: translateX(-50%) translateY(140%);
  opacity: 0;
  pointer-events: none;
}

.floating-progress-track {
  width: 100%;
  height: 4px;
  background: rgba(16, 185, 129, 0.15);
  position: relative;
}

.floating-progress-bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #10B981, #059669);
  transition: width 0.25s ease;
}

.floating-player-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  gap: 12px;
}

.floating-player-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.floating-thumb {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.floating-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.floating-title {
  font-family: var(--font-header);
  font-size: 0.88rem;
  font-weight: 750;
  color: #0F172A;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.floating-title:hover {
  color: #047857;
}

.floating-status {
  font-family: var(--font-body);
  font-size: 0.72rem;
  color: #047857;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 1px;
}

.floating-player-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.floating-speed-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #F1F5F9;
  padding: 3px 5px;
  border-radius: 999px;
}

.floating-speed-btn {
  background: transparent;
  border: none;
  font-size: 0.72rem;
  font-weight: 700;
  color: #64748B;
  padding: 3px 7px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.floating-speed-btn.active {
  background: #047857;
  color: #FFFFFF;
}

.floating-play-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #047857;
  color: #FFFFFF;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.95rem;
  box-shadow: 0 4px 14px rgba(4, 120, 87, 0.35);
  transition: transform 0.15s ease, background 0.15s ease;
}

.floating-play-btn:hover {
  transform: scale(1.06);
  background: #065F46;
}

.floating-close-btn {
  background: transparent;
  border: none;
  color: #94A3B8;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  transition: color 0.15s ease;
}

.floating-close-btn:hover {
  color: #0F172A;
}

/* Dark Mode Overrides for Audio Reader */
body.dark-mode .aira-floating-player {
  background: rgba(15, 23, 42, 0.95);
  border-color: rgba(52, 211, 153, 0.28);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55);
}
body.dark-mode .floating-title {
  color: #F8FAFC;
}
body.dark-mode .floating-title:hover {
  color: #34D399;
}
body.dark-mode .floating-status {
  color: #34D399;
}
body.dark-mode .floating-speed-wrap {
  background: #1E293B;
}
body.dark-mode .floating-speed-btn {
  color: #94A3B8;
}
body.dark-mode .floating-speed-btn.active {
  background: #059669;
  color: #FFFFFF;
}
body.dark-mode .floating-close-btn {
  color: #64748B;
}
body.dark-mode .floating-close-btn:hover {
  color: #F8FAFC;
}
body.dark-mode .article-tts-player {
  background: rgba(16, 185, 129, 0.08);
  border-color: rgba(16, 185, 129, 0.25);
}
body.dark-mode .tts-label {
  color: #34D399;
}
body.dark-mode .tts-status-text {
  color: #A7F3D0;
}
body.dark-mode .tts-speed-btn {
  background: #1E293B;
  border-color: rgba(16, 185, 129, 0.3);
  color: #94A3B8;
}
body.dark-mode .tts-speed-btn.active {
  background: #059669;
  color: #FFFFFF;
  border-color: #059669;
}

@media (max-width: 640px) {
  .aira-floating-player {
    bottom: 12px;
    width: calc(100% - 20px);
    border-radius: 14px;
  }
  .floating-player-content {
    padding: 8px 12px;
    gap: 8px;
  }
  .floating-thumb {
    width: 36px;
    height: 36px;
  }
  .floating-title {
    max-width: 140px;
    font-size: 0.82rem;
  }
  .floating-play-btn {
    width: 36px;
    height: 36px;
  }
  .floating-speed-wrap {
    display: none;
  }
}
`;

if (!css.includes('aira-floating-player')) {
  css += '\n' + audioCss + '\n';
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('✔ Appended audioCss directly to styles.css');
} else {
  console.log('✔ aira-floating-player already in styles.css');
}
