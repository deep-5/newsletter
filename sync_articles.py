#!/usr/bin/env python3
"""
AIRA Newsletter - Automated Article Synchronizer
Fetches new editions from https://aitoast.beehiiv.com/
Cleans and formats them in 100% AIRA style, and prepends to data/articles.js
"""

import urllib.request
import xml.etree.ElementTree as ET
import json
import re
import os
import sys
from datetime import datetime

# Configure utf-8 stdout for Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

WORKSPACE_DIR = os.path.abspath(os.path.dirname(__file__))
ARTICLES_JS_PATH = os.path.join(WORKSPACE_DIR, 'data', 'articles.js')
INDEX_HTML_PATH = os.path.join(WORKSPACE_DIR, 'index.html')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def fetch_url(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.read().decode('utf-8', errors='ignore')

def get_sitemap_posts():
    sitemap_url = "https://aitoast.beehiiv.com/sitemap.xml"
    req = urllib.request.Request(sitemap_url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        xml_data = resp.read()
    
    root = ET.fromstring(xml_data)
    posts = []
    for elem in root:
        loc = elem.find('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')
        lastmod = elem.find('{http://www.sitemaps.org/schemas/sitemap/0.9}lastmod')
        if loc is not None and loc.text and '/p/' in loc.text:
            slug = loc.text.split('/p/')[-1].strip('/')
            date_str = lastmod.text.split('T')[0] if lastmod is not None and lastmod.text else datetime.now().strftime('%Y-%m-%d')
            posts.append({
                'slug': slug,
                'url': loc.text.strip(),
                'iso_date': f"{date_str}T00:00:00Z",
                'raw_date': date_str
            })
    return posts

def format_display_date(date_str):
    try:
        dt = datetime.strptime(date_str, '%Y-%m-%d')
        return dt.strftime('%b %d, %Y')
    except Exception:
        return datetime.now().strftime('%b %d, %Y')

def calculate_reading_time(text):
    words = len(re.findall(r'\w+', text))
    mins = max(2, round(words / 200))
    return f"{mins} minutes"

def clean_and_format_article(html, slug, raw_date):
    # 1. Extract Title
    title_match = re.search(r'<meta\s+property=["\']og:title["\']\s+content=["\']([^"\']+)["\']', html)
    if not title_match:
        title_match = re.search(r'<title>([^<]+)</title>', html)
    title = title_match.group(1).replace(' | AI Toast', '').replace(' | AIRA', '').strip() if title_match else slug.replace('-', ' ').title()

    # 2. Extract Subtitle / Description
    desc_match = re.search(r'<meta\s+property=["\']og:description["\']\s+content=["\']([^"\']+)["\']', html)
    subtitle = desc_match.group(1).strip() if desc_match else ''

    # 3. Extract Hero Image
    img_match = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']', html)
    hero_image = img_match.group(1).strip() if img_match else 'assets/logo.jpg'

    # 4. Extract Article Body
    cb_idx = html.find('id="content-blocks"')
    if cb_idx != -1:
        tag_start = html.rfind('<div', 0, cb_idx)
        content_start = tag_start if tag_start != -1 else cb_idx
    else:
        byline_idx = html.find('bh__byline_social_wrapper')
        if byline_idx != -1:
            content_start = html.find('</div>', byline_idx)
        else:
            content_start = html.find('<h1')

    end_markers = [
        'Boost revenue and gain new customers',
        'Reach over 35K',
        'Reach over 25K',
        'SPONSOR US',
        'Sponsored by',
        'Keep Reading',
        'keep-reading',
        'What did you think of today',
        'Share this post',
        'share-this-post',
        'Was this email forwarded',
        'Rate this edition',
        'Leave a comment',
        'comments-section',
        'Powered by beehiiv',
        'bh__footer',
        'site-footer',
        'Authors',
        'authors/poonam-soni',
        'aria-label="Instagram"',
        'aria-label="Twitter"',
        'aria-label="LinkedIn"',
        'flex w-full flex-col items-center gap-y-4 sm:flex-row'
    ]

    content_end = len(html)
    for m in end_markers:
        idx = html.find(m, content_start)
        if idx != -1:
            tag_start = html.rfind('<div', content_start, idx)
            if tag_start != -1:
                content_end = min(content_end, tag_start)
            else:
                content_end = min(content_end, idx)

    raw_chunk = html[content_start:content_end]

    # Clean scripts, styles, svgs, forms, metadata
    c = re.sub(r'<script.*?</script>', '', raw_chunk, flags=re.DOTALL)
    c = re.sub(r'<style.*?</style>', '', c, flags=re.DOTALL)
    c = re.sub(r'<svg.*?</svg>', '', c, flags=re.DOTALL)
    c = re.sub(r'<form.*?</form>', '', c, flags=re.DOTALL)
    c = re.sub(r'<link[^>]*>', '', c)
    c = re.sub(r'<meta[^>]*>', '', c)
    c = re.sub(r'<!DOCTYPE[^>]*>', '', c, flags=re.IGNORECASE)
    c = re.sub(r'<html[^>]*>', '', c, flags=re.IGNORECASE)
    c = re.sub(r'</html>', '', c, flags=re.IGNORECASE)
    c = re.sub(r'<body[^>]*>', '', c, flags=re.IGNORECASE)
    c = re.sub(r'</body>', '', c, flags=re.IGNORECASE)
    c = re.sub(r'<head[^>]*>.*?</head>', '', c, flags=re.DOTALL | re.IGNORECASE)

    # Clean and replace all images with AIRA style section-image-box
    def process_img(match):
        img_tag = match.group(0)
        src_match = re.search(r'src=["\']([^"\']+)["\']', img_tag)
        if src_match:
            src = src_match.group(1)
            # Remove any logo, avatar, or banner
            if any(k in src for k in ['logo', 'profile_picture', 'steel_on_black', 'beehiiv_newsletter_banner', 'uploads/user', 'uploads/publication']):
                return ''
            return f'<div class="section-image-box"><img src="{src}" class="section-inline-img" loading="lazy" /></div>'
        return ''

    c = re.sub(r'<img[^>]*>', process_img, c)
    c = re.sub(r'<picture[^>]*>(?:(?!<\/picture>).)*?(?:steel_on_black|beehiiv_newsletter_banner|profile_picture).*?<\/picture>', '', c, flags=re.DOTALL | re.IGNORECASE)
    c = re.sub(r'<a[^>]*>(?:(?!<\/a>).)*?(?:steel_on_black|beehiiv_newsletter_banner|profile_picture).*?<\/a>', '', c, flags=re.DOTALL | re.IGNORECASE)
    c = re.sub(r'<div[^>]*class=["\']section-image-box["\'][^>]*>\s*</div>', '', c)

    # Clean unicode entities safely
    c = c.replace('\u2019', "'").replace('\u2018', "'").replace('\u201c', '"').replace('\u201d', '"')
    c = c.replace('\u2014', '—').replace('\u2013', '–').replace('\u2026', '...').replace('\ufffd', "'")
    c = c.replace('&rsquo;', "'").replace('&lsquo;', "'").replace('&rdquo;', '"').replace('&ldquo;', '"')
    c = c.replace('&mdash;', '—').replace('&ndash;', '–').replace('&hellip;', '...')

    # Strip sponsor tracker divs, "In partnership with" and magic.beehiiv blocks
    c = re.sub(r'<div[^>]*>\s*<p[^>]*>\s*<b[^>]*>\s*(?:In partnership with|Sponsored by)[^<]*</b>\s*</p>\s*(?:<a[^>]*>.*?</a>)?\s*</div>', '', c, flags=re.DOTALL | re.IGNORECASE)
    c = re.sub(r'<a[^>]*href=["\'][^"\']*magic\.beehiiv\.com[^"\']*["\'][^>]*>.*?</a>', '', c, flags=re.DOTALL | re.IGNORECASE)
    c = re.sub(r'<div[^>]*class=["\']section-image-box["\'][^>]*>\s*<img[^>]*magic\.beehiiv\.com[^>]*>\s*</div>', '', c, flags=re.DOTALL | re.IGNORECASE)

    # Clean publication-specific greetings and headers
    c = re.sub(r'Welcome(?: back)?,?\s*(?:Toastie Pals|Toasties|Toastie|Pals)!?', 'Welcome to AIRA!', c, flags=re.IGNORECASE)
    c = re.sub(r'Sneak peek of today\'s (?:AI Toast|AIRA|Toast):', "Here is what we're covering in today's edition:", c, flags=re.IGNORECASE)
    c = re.sub(r'Here\'?s what\'?s on the menu today:?', "Here is what we're breaking down today:", c, flags=re.IGNORECASE)
    c = re.sub(r'Total read time:?\s*About\s*(\d+)\s*minutes?[^<]*', r'Estimated reading time: \1 minutes.', c, flags=re.IGNORECASE)

    # Standardize and rewrite section headers
    c = re.sub(r'<i><b>Crispy Bites:?\s*</b></i>', '<strong>⚡ Key Summary:</strong> ', c, flags=re.IGNORECASE)
    c = re.sub(r'<b><i>Crispy Bites:?\s*</i></b>', '<strong>⚡ Key Summary:</strong> ', c, flags=re.IGNORECASE)
    c = re.sub(r'<b>Crispy Bites:?\s*</b>', '<strong>⚡ Key Summary:</strong> ', c, flags=re.IGNORECASE)
    c = re.sub(r'<i>Crispy Bites:?\s*</i>', '<strong>⚡ Key Summary:</strong> ', c, flags=re.IGNORECASE)
    c = re.sub(r'Crispy Bites:?', '<strong>⚡ Key Summary:</strong>', c, flags=re.IGNORECASE)

    c = re.sub(r'Quick AI News Bites|Quick AI Bites|Quick Toasts', '⚡ Quick AI News Bites', c, flags=re.IGNORECASE)
    c = re.sub(r'Personal Take:?', '<strong>💡 AIRA Perspective:</strong>', c, flags=re.IGNORECASE)
    c = re.sub(r'Key Insights:?', '<strong>🔍 Key Takeaways:</strong>', c, flags=re.IGNORECASE)
    c = re.sub(r'Superhero Tools', '🛠️ Featured AI Tools', c, flags=re.IGNORECASE)

    # 100% AIRA Branding Replacement
    c = re.sub(r'Long\s*Live\s*AI', 'AIRA', c, flags=re.IGNORECASE)
    c = re.sub(r'longliveai', 'AIRA', c, flags=re.IGNORECASE)
    c = re.sub(r'AI\s*Toast', 'AIRA', c, flags=re.IGNORECASE)
    c = re.sub(r'aitoast', 'AIRA', c, flags=re.IGNORECASE)
    c = re.sub(r'Poonam\s*Soni', 'AIRA Editorial', c, flags=re.IGNORECASE)
    c = re.sub(r'CodeByPoonam', 'AIRA', c, flags=re.IGNORECASE)
    c = re.sub(r'VIBEWITHPOONAM', 'AIRA', c, flags=re.IGNORECASE)
    c = re.sub(r'@longliveai', '@AIRA', c, flags=re.IGNORECASE)
    c = re.sub(r'@aitoast', '@AIRA', c, flags=re.IGNORECASE)
    c = re.sub(r'https:\/\/(?:AIRA|aitoast|longliveai)\.beehiiv\.com\/p\/([a-zA-Z0-9_-]+)', r'#/p/\1', c, flags=re.IGNORECASE)
    c = re.sub(r'https:\/\/(?:AIRA|aitoast|longliveai)\.beehiiv\.com[^\s"\'<]*', '#/', c, flags=re.IGNORECASE)

    # Remove old sponsor CTA blocks and survey tables
    c = re.sub(r'<div[^>]*>(?:(?!<\/div>).)*?(?:Boost revenue and gain new customers|Reach over \d+K AI enthusiasts|SPONSOR US|Partner With Us).*?<\/div>', '', c, flags=re.DOTALL | re.IGNORECASE)
    c = re.sub(r'<h[1-6][^>]*>(?:Boost revenue|Reach over \d+K|SPONSOR US|Partner With Us).*?</h[1-6]>', '', c, flags=re.IGNORECASE)
    c = re.sub(r'<table[^>]*>(?:(?!<\/table>).)*?(?:Did you like Today|participate in polls|Login.*?Subscribe).*?<\/table>', '', c, flags=re.DOTALL | re.IGNORECASE)
    c = re.sub(r'<div[^>]*>(?:(?!<\/div>).)*?(?:Did you like Today|participate in polls).*?<\/div>', '', c, flags=re.DOTALL | re.IGNORECASE)

    # Remove style, class mess and data attributes
    c = re.sub(r'style="[^"]*"', '', c)
    c = re.sub(r'data-[a-zA-Z0-9_-]+="[^"]*"', '', c)
    c = re.sub(r'translations="[^"]*"', '', c)
    c = re.sub(r'element="[^"]*"', '', c)
    c = re.sub(r'screen="[^"]*"', '', c)

    # Strip leading closing tags & trailing opening tags
    c = re.sub(r'^(?:\s*<\/(?:a|div|span|p|h1|h2|h3|h4|section|article)>\s*)+', '', c, flags=re.IGNORECASE)
    c = re.sub(r'(?:<div[^>]*>|<p[^>]*>|<span[^>]*>|<h4[^>]*>|<h3[^>]*>|\s*)+$', '', c, flags=re.IGNORECASE)

    for _ in range(4):
        c = re.sub(r'<div[^>]*>\s*</div>', '', c)
        c = re.sub(r'<p[^>]*>\s*</p>', '', c)
        c = re.sub(r'<span[^>]*>\s*</span>', '', c)
        c = re.sub(r'<div[^>]*class=["\']section-image-box["\'][^>]*>\s*</div>', '', c)

    c = re.sub(r'^(?:\s*<\/(?:a|div|span|p|h1|h2|h3|h4|section|article)>\s*)+', '', c, flags=re.IGNORECASE)
    c = re.sub(r'(?:<div[^>]*>|<p[^>]*>|<span[^>]*>|<h4[^>]*>|<h3[^>]*>|\s*)+$', '', c, flags=re.IGNORECASE)
    c = re.sub(r'\n\s*\n', '\n', c).strip()

    # Append AIRA author signoff
    c += '\n<div class="author-signoff" style="margin-top: 36px; padding-top: 20px; border-top: 1px solid var(--color-border);">Until next time,<br><strong>AIRA</strong></div>'

    # Determine Tag (News or Prompts)
    tag = "Prompts" if any(w in (title + " " + subtitle).lower() for w in ['prompt', 'guide', 'tutorial', 'course', 'how to', 'tips']) else "News"
    
    reading_time = calculate_reading_time(re.sub(r'<[^>]+>', '', c))

    return {
        "slug": slug,
        "title": title,
        "subtitle": subtitle,
        "image_url": hero_image,
        "author": "AIRA",
        "author_avatar": "assets/logo.jpg",
        "date": format_display_date(raw_date),
        "iso_date": f"{raw_date}T00:00:00Z",
        "reading_time": reading_time,
        "tag": tag,
        "likes": 200,
        "views": "5.0k",
        "featured": False,
        "body_html": c
    }

def sync():
    print("=" * 60)
    print("⚡ AIRA Newsletter - Synchronizing with AI Toast")
    print("=" * 60)

    # 1. Load existing articles
    if not os.path.exists(ARTICLES_JS_PATH):
        print(f"Error: {ARTICLES_JS_PATH} not found.")
        return False

    with open(ARTICLES_JS_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    start_idx = content.find('[')
    end_idx = content.rfind(']')
    existing_articles = json.loads(content[start_idx:end_idx+1])
    existing_slugs = {a['slug']: a for a in existing_articles}
    print(f"Current local database has {len(existing_articles)} articles.")

    # 2. Fetch remote sitemap
    remote_posts = get_sitemap_posts()
    print(f"Remote sitemap has {len(remote_posts)} articles.")

    new_posts = [p for p in remote_posts if p['slug'] not in existing_slugs]
    print(f"Found {len(new_posts)} new articles to import.")

    if not new_posts:
        print("✅ Database is completely up to date! No new articles found.")
        return False

    # 3. Process each new post
    added_articles = []
    for p in new_posts:
        slug = p['slug']
        print(f"\n📥 Fetching & formatting new edition: {slug}...")
        try:
            html = fetch_url(p['url'])
            article_data = clean_and_format_article(html, slug, p['raw_date'])
            added_articles.append(article_data)
            print(f"   ✓ Successfully formatted: {article_data['title']} ({article_data['date']})")
        except Exception as e:
            print(f"   ✗ Error processing {slug}: {e}")

    if not added_articles:
        print("No articles were successfully processed.")
        return False

    # 4. Combine and sort
    all_articles = added_articles + existing_articles
    all_articles.sort(key=lambda x: x.get('iso_date', ''), reverse=True)

    # Re-index IDs
    for i, a in enumerate(all_articles, 1):
        a['id'] = f"post-{i}"

    # 5. Write back to data/articles.js
    js_content = "/**\n * AIRA Newsletter Articles Database\n * Complete Collection of All Editions (100% AIRA Branded & Chronologically Sorted)\n */\n\nconst ARTICLES = " + json.dumps(all_articles, indent=2, ensure_ascii=False) + ";\n\nif (typeof module !== 'undefined' && module.exports) {\n  module.exports = { ARTICLES };\n}\n"

    with open(ARTICLES_JS_PATH, 'w', encoding='utf-8') as f:
        f.write(js_content)

    print(f"\n🎉 Successfully added {len(added_articles)} new articles! Total count is now: {len(all_articles)}")
    return True

if __name__ == '__main__':
    updated = sync()
    if updated:
        sys.exit(0)
    else:
        sys.exit(1)
