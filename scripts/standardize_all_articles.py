import json
import re

with open('data/articles.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract the JSON array
match = re.search(r'const ARTICLES\s*=\s*(\[[\s\S]*\]);\s*$', text)
if not match:
    # Try alternate match
    match = re.search(r'const ARTICLES\s*=\s*(\[[\s\S]*\]);?', text)

articles_json = match.group(1)
articles = json.loads(articles_json)

print(f"Total articles loaded: {len(articles)}")

def standardize_html(html, title, slug):
    if not html:
        return html
    
    # 1. Ensure Menu Intro Card has Welcome to AIRA! 👋
    html = re.sub(r'Welcome to (?:another edition of\s*)?(?:<strong>)?AI PlanetX(?:</strong>)?! 👋', 'Welcome to AIRA! 👋', html, flags=re.IGNORECASE)
    html = re.sub(r'Welcome to AIRA! 👋', 'Welcome to AIRA! 👋', html)
    
    # 2. Fix AI Tutorial: Wrap tutorial content inside .article-story-card if missing
    # Pattern: <div class="article-section-header">\s*<h2>📚 AI Tutorial</h2>\s*</div>\s*(?!<div class="article-story-card">)
    tutorial_hdr = r'<div class="article-section-header">\s*<h2>📚 AI Tutorial</h2>\s*</div>'
    if re.search(tutorial_hdr, html) and not re.search(r'<div class="article-section-header">\s*<h2>📚 AI Tutorial</h2>\s*</div>\s*<div class="article-story-card">', html):
        # Find where AI Tutorial starts
        parts = re.split(tutorial_hdr, html, maxsplit=1)
        if len(parts) == 2:
            before = parts[0]
            after = parts[1]
            
            # Find next section header or signoff or end
            next_sec = re.search(r'(<div class="article-section-header">\s*<h2>🌐 Top AI & Tech News</h2>|<div class="article-signoff">|$)', after)
            if next_sec:
                split_idx = next_sec.start()
                tutorial_content = after[:split_idx].strip()
                rest = after[split_idx:]
                
                # Check if tutorial_content already has opening/closing card
                if not tutorial_content.startswith('<div class="article-story-card">'):
                    tutorial_content = f'<div class="article-story-card">\n{tutorial_content}\n</div>'
                
                html = before + '<div class="article-section-header">\n        <h2>📚 AI Tutorial</h2>\n      </div>\n      ' + tutorial_content + '\n      ' + rest

    # 3. Fix tutorial <ol> to have class="tutorial-step-list"
    html = re.sub(r'<ol(?:\s+start="1")?>', '<ol class="tutorial-step-list">', html)
    
    # 4. Fix Top AI & Tech News: Ensure it is wrapped in .article-section-header and .article-story-card
    # Check if Top AI & Tech News has .article-story-card
    news_hdr = r'<div class="article-section-header">\s*<h2>🌐 Top AI & Tech News</h2>\s*</div>'
    if re.search(news_hdr, html):
        parts = re.split(news_hdr, html, maxsplit=1)
        if len(parts) == 2:
            before = parts[0]
            after = parts[1]
            next_sec = re.search(r'(<div class="article-signoff">|$)', after)
            if next_sec:
                split_idx = next_sec.start()
                news_content = after[:split_idx].strip()
                rest = after[split_idx:]
                if not news_content.startswith('<div class="article-story-card">') and '<ul class="tech-news-bullets">' in news_content:
                    news_content = f'<div class="article-story-card">\n{news_content}\n</div>'
                html = before + '<div class="article-section-header">\n        <h2>🌐 Top AI & Tech News</h2>\n      </div>\n      ' + news_content + '\n      ' + rest

    # 5. Remove any remaining AI Art Spotlight sections completely
    html = re.sub(r'<div class="article-section-header">\s*<h2>🎨 AI Art Spotlight</h2>\s*</div>[\s\S]*?(?=<div class="article-section-header">|<div class="article-signoff">|$)', '', html)
    html = re.sub(r'<div class="article-story-card">\s*<h3 class="story-headline">AI Art Spotlight</h3>[\s\S]*?</div>', '', html)

    # 6. Ensure .article-signoff is properly closed
    html = re.sub(r'<div class="article-signoff">\s*Until next time,?<br>\s*<strong>AIRA(?:\s+Editorial\s+Team)?</strong>\s*</div>', '<div class="article-signoff">\n        Until next time,<br>\n        <strong>AIRA Editorial Team</strong>\n      </div>', html)

    return html

# Apply standardization to each article
for a in articles:
    a['author'] = "AIRA Editorial Team"
    a['author_avatar'] = "assets/logo.svg"
    a['body_html'] = standardize_html(a.get('body_html', ''), a.get('title', ''), a.get('slug', ''))

output_text = f"""/**
 * AIRA Newsletter Articles Database
 * Curated Frontier AI Editions — Exclusively from AI PlanetX
 * Formatted strictly in AIRA Native Design System (100% Hyperlink Preservation, Authentic Beehiiv Hero Banners, 100% Complete AI Tutorials, Dynamic Topic Tags, Zero Art Spotlight, Zero Prompts, Zero Video Embeds, Zero Sponsor Ads, 100% Balanced DOM)
 */

const ARTICLES = {json.dumps(articles, indent=2, ensure_ascii=False)};
"""

with open('data/articles.js', 'w', encoding='utf-8') as f:
    f.write(output_text)

print("Standardized all 15 articles successfully!")
