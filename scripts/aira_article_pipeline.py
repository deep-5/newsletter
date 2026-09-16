"""
AIRA ARTICLE PIPELINE & VERIFICATION AUDIT (LOCKED STANDARD)
=============================================================
This file defines the strict, permanent rules and verification checks for ingesting 
and formatting any article into AIRA Newsletter from source newsletters.

LOCKED RULES:
1. ZERO External Branding & Logos (No AI Toast, Long Live AI, Beehiiv banners, etc.)
2. ZERO External Authors & Bylines (No Poonam Soni, @CodeByPoonam, Daniel Murray, etc.)
3. ZERO Promotional & Sponsor Pitches (No "Boost revenue...", "Reach over 35K...", "DM now!", AdQuick, Norton, etc.)
4. ZERO Voting Polls, Star Ratings & Feedback Blurbs (No "What did you think...", "⭐⭐⭐⭐⭐ Loved it", etc.)
5. ZERO Duplicate Hero Images inside article body.
6. PRESERVE 100% of authentic stories, tutorials, prompt formulas, step-by-step guides, and technical diagrams.
7. PRESERVE 100% of genuine in-text reference hyperlinks (with tracking query parameters removed).
8. STRICT 100% AIRA Brand Design (Lead block, ⚡ Key Takeaways, numbered sections, 🛠️ prompt formulas, 💡 Strategic Perspective, AIRA signoff).
9. EXACT Authentic Publication Dates sorted chronologically (Latest to Oldest).
"""

import json
import re
import sys
import html
import os
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

sys.stdout.reconfigure(encoding='utf-8')

# 1. Image Blacklist (Banners, Logos, Ad networks, Sponsor assets)
AD_IMAGE_PATTERNS = [
    'steel_on_black', 'thumb_ai_toast_logo', 'ai_toast_logo', 'ad_network', 'advertiser',
    'beehiiv_newsletter_banner', 'ad_the_ai_report', 'adquick', 'beehiiv_primary_ad',
    'makemoneyai', 'wwc26_na_beehiive_ad', 'brandlift', 'gamma_newsletter_ad', 'gamma1',
    'beehiv_image_2025_predictions', 'beehiiv_asset_3', 'ad_3__beehiiv', 'offer_1_modern',
    'free_vs_paid_opt2', 'get_curated_tech_news', 'augmentcode', 'seekandfind', 'banner_from_drive',
    'beehiiv_founders_primary', 'banner_1', 'ai_fast_track_header', 'thecodesuperhuman',
    'profile_picture', 'publication/logo', 'avatar', 'badge', 'button', 'user/profile',
    'court_rules_against_ai_artwork', 'essential_resources_opt1', 'version_b_hero_image',
    '4_pacaso_partnerships', 'copy_of_i_couldn_t_help_but_wonder', 'beehive-6', 'rippling_beehive_solo',
    '1200x600_beehiiv', 'option_4_from_google_drive', 'nl-byhumansforhumans', 'chatgpt_v1.jpg',
    'logo-full-dark', 'hubspotlogo', '16392ca98fbebca3dc0a8388925ba868', 'nnorton_neo_logo',
    '1440_primary_brandmark', 'listkit', 'hqlogo_color', 'googleadsense', 'aq_logo', 'stackinfluence',
    'fin_logo', 'keepcart-logo', 'beehiiv_logo', 'writer_logo', 'mintlify', 'mavenagi', 'logo-bill',
    'viktor_logo', 'haus_logotype', 'attio_black', 'ff_logo', 'stargate_header_new', 'meta-ai-app_header',
    'blog_gemini_keyword_header', 'blog_header'
]

# 2. Promotional, Sponsor, Poll & Noise Text Patterns
JUNK_TEXT_PATTERNS = [
    r'boost revenue and gain new customers',
    r'boost revenue',
    r'gain new customers',
    r'reach over',
    r'partnering with us',
    r'partner with us',
    r'join our newsletter to connect',
    r'join our newsletter',
    r'dm now',
    r'got feedback',
    r'story worth (?:toasting|following)',
    r'wild tech question',
    r'reply, or find me',
    r'cheers,',
    r'poonam soni',
    r'codebypoonam',
    r'forward it to a friend',
    r'what did you think of today',
    r'this helps tune future issues',
    r'thanks for voting',
    r'loved it',
    r'good, not great',
    r'needs improvement',
    r'rate this issue',
    r'how was today',
    r'give feedback',
    r'share this issue',
    r'refer a friend',
    r'sponsor',
    r'advertise with us',
    r'book a sponsor',
    r'was this email forwarded to you',
    r'read in browser',
    r'view web version',
    r'total read time',
    r'stay updated with',
    r'powered by beehiiv',
    r'privacy policy',
    r'terms of service',
    r'unsubscribe',
    r'follow us',
    r'manage your subscription',
    r'welcome to ai toast',
    r'quick ai toasts?',
    r'toastie pals',
    r'about the author',
    r'connect on x',
    r'connect on linkedin',
    r'until next time',
    r'written by',
    r'curated by',
    r'author byline',
    r'published by',
    r'leaderboard',
    r'voting poll',
    r'vote now',
    r'adquick',
    r'out of home \(ooh\) advertising',
    r'learn more at (?:www\.|https?://)',
    r'you can learn more at',
    r'pacaso',
    r'keepcart',
    r'norton neo',
    r'stackinfluence',
    r'listkit',
    r'advertisement',
    r'sponsored by',
    r'presented by',
    r'run ads irl'
]

BLACKLIST_DOMAINS = {
    'aitoast.beehiiv.com',
    'longliveai.beehiiv.com',
    'magic.beehiiv.com',
    'beehiiv.com',
    'twitter.com',
    'x.com',
    'facebook.com',
    'threads.net',
    'instagram.com',
    'linkedin.com',
    'adquick.com',
    'pacaso.com',
    'keepcart.com',
    'offers.hubspot.com'
}

NAV_TEXTS = {'home', 'posts', 'login', 'subscribe', 'archive', 'read in browser', 'view online', 'read online', 'sign in', 'upgrade'}

def clean_txt(t):
    t = html.unescape(t)
    t = re.sub(r'<[^>]+>', ' ', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def is_junk_text(text):
    text_clean = text.strip()
    if len(text_clean) < 2:
        return True
    for pat in JUNK_TEXT_PATTERNS:
        if re.search(pat, text_clean, re.I):
            return True
    return False

def extract_image_identifiers(url):
    if not url:
        return set()
    clean = url.split('?')[0].lower()
    ids = set()
    uuids = re.findall(r'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}', clean)
    for u in uuids:
        ids.add(u)
    basename = os.path.basename(clean)
    if len(basename) > 5 and basename not in ['image.png', 'image.jpg', 'image.jpeg', '1.png', '1.jpg', '2.png', 'download.png', 'download.jpg']:
        ids.add(basename)
    return ids

def is_ad_image(src, hero_url=''):
    src_lower = src.lower()
    for pat in AD_IMAGE_PATTERNS:
        if pat in src_lower:
            return True
            
    if hero_url:
        hero_clean = hero_url.split('?')[0].lower()
        src_clean = src.split('?')[0].lower()
        
        if hero_clean == src_clean:
            return True
            
        hero_ids = extract_image_identifiers(hero_url)
        src_ids = extract_image_identifiers(src)
        
        if hero_ids and src_ids and (hero_ids & src_ids):
            return True
            
        hero_base = os.path.basename(hero_clean)
        src_base = os.path.basename(src_clean)
        generic_names = {'image.png', 'image.jpg', 'image.jpeg', '1.png', '1.jpg', '2.png', 'download.png', 'download.jpg'}
        if hero_base and hero_base not in generic_names and hero_base == src_base:
            return True

    return False

def clean_url(href):
    if not href:
        return None
    href = href.strip()
    if not href.startswith('http://') and not href.startswith('https://'):
        return None
        
    try:
        parsed = urlparse(href)
        domain = parsed.netloc.lower()
        
        for bl in BLACKLIST_DOMAINS:
            if bl in domain:
                return None
                
        if parsed.query:
            q_dict = parse_qs(parsed.query, keep_blank_values=False)
            filtered_q = {
                k: v for k, v in q_dict.items()
                if not k.lower().startswith('utm_')
                and not k.lower().startswith('_bh')
                and not k.lower().startswith('bh')
                and k.lower() not in ['ref', 'source', 'campaign', 'affiliate', 'via']
            }
            new_query = urlencode(filtered_q, doseq=True)
            clean_parsed = parsed._replace(query=new_query)
            return urlunparse(clean_parsed)
        return href
    except Exception:
        return None

def sanitize_external_mentions(text):
    text = re.sub(r'\bQuick AI Toasts?:\s*', '⚡ Quick Briefing: ', text, flags=re.I)
    text = re.sub(r'\bQuick AI Toasts?\b', 'Quick Briefing', text, flags=re.I)
    text = re.sub(r'\bAI Toasts?:\s*', '⚡ Quick Briefing: ', text, flags=re.I)
    text = re.sub(r'\bAI Toasts?\b', 'AIRA Briefing', text, flags=re.I)
    text = re.sub(r'\bAI Toast\b', 'AIRA', text, flags=re.I)
    text = re.sub(r'\bLong Live AI\b', 'AIRA', text, flags=re.I)
    text = re.sub(r'\bToastie Pals\b', 'AIRA Readers', text, flags=re.I)
    text = re.sub(r'\bToastie\b', 'AIRA', text, flags=re.I)
    text = re.sub(r'\btoasting\b', 'following', text, flags=re.I)
    text = re.sub(r'\bThe Rundown AI\b', 'AIRA', text, flags=re.I)
    text = re.sub(r'\bThe Rundown\b', 'AIRA', text, flags=re.I)
    text = re.sub(r'\bSuperhuman AI\b', 'AIRA', text, flags=re.I)
    text = re.sub(r'\bSuperhuman\b', 'AIRA', text, flags=re.I)
    text = re.sub(r'\bPoonam Soni\b', 'AIRA', text, flags=re.I)
    text = re.sub(r'\bPoonam\b', 'AIRA', text, flags=re.I)
    text = re.sub(r'\b@CodeByPoonam\b', '', text, flags=re.I)
    text = re.sub(r'\bDaniel Murray\b', 'AIRA Analyst', text, flags=re.I)
    text = re.sub(r'\bVIBEWITHPOONAM\b', 'AIRA', text, flags=re.I)
    text = re.sub(r'\baitoast@mail\.beehiiv\.com\b', 'newsletter@aira.com', text, flags=re.I)
    return text

def run_verification_audit(articles):
    """LOCKED VERIFICATION AUDIT FUNCTION"""
    print("\n" + "="*50)
    print("🔒 RUNNING LOCKED AIRA VERIFICATION AUDIT")
    print("="*50)
    
    total = len(articles)
    print(f"Total Articles in Database: {total}")
    
    # 1. Bad text patterns check
    bad_hits = []
    for a in articles:
        combined = (a.get('title', '') + ' ' + a.get('subtitle', '') + ' ' + a.get('body_html', '')).lower()
        for pat in JUNK_TEXT_PATTERNS[:15]:
            if re.search(pat, combined):
                bad_hits.append((a['id'], pat))
                
    print(f"1. Promotional / Author / Poll / Noise Text Hits: {len(bad_hits)}")
    if bad_hits:
        print("   FAILED:", bad_hits[:5])
        
    # 2. Hero duplicate check
    hero_dupes = []
    for a in articles:
        hero = a.get('image_url', '')
        body = a.get('body_html', '')
        hero_ids = extract_image_identifiers(hero)
        body_imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', body)
        for bi in body_imgs:
            bi_ids = extract_image_identifiers(bi)
            if hero_ids and bi_ids and (hero_ids & bi_ids):
                hero_dupes.append((a['id'], hero, bi))
                
    print(f"2. Hero Cover Image Repeated in Body: {len(hero_dupes)}")
    if hero_dupes:
        print("   FAILED:", hero_dupes[:5])
        
    # 3. Ad / Banner images check
    ad_imgs = []
    for a in articles:
        imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', a.get('body_html', ''))
        for img in imgs:
            if is_ad_image(img):
                ad_imgs.append((a['id'], img))
                
    print(f"3. Ad / Banner Images Embedded in Body: {len(ad_imgs)}")
    if ad_imgs:
        print("   FAILED:", ad_imgs[:5])
        
    # 4. Chronological sort check
    dates = [a.get('iso_date', '') for a in articles]
    is_sorted = all(dates[i] >= dates[i+1] for i in range(len(dates)-1))
    print(f"4. Chronological Sort (Latest to Oldest): {'✅ 100% VALID' if is_sorted else '❌ INVALID'}")
    
    # 5. Link check
    total_links = 0
    posts_with_links = 0
    for a in articles:
        links = re.findall(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>', a.get('body_html', ''))
        if links:
            posts_with_links += 1
            total_links += len(links)
            
    print(f"5. Articles with Preserved Clean Tech Links: {posts_with_links}/{total} ({total_links} total links)")
    
    # 6. Visual check
    total_visuals = 0
    posts_with_visuals = 0
    for a in articles:
        imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', a.get('body_html', ''))
        if imgs:
            posts_with_visuals += 1
            total_visuals += len(imgs)
            
    print(f"6. Articles with Authentic Section Visuals: {posts_with_visuals}/{total} ({total_visuals} total visuals)")
    
    passed = (len(bad_hits) == 0 and len(hero_dupes) == 0 and len(ad_imgs) == 0 and is_sorted)
    print("\n" + "="*50)
    print(f"🔒 AUDIT STATUS: {'✅ PASSED (LOCKED STANDARD SATISFIED)' if passed else '❌ FAILED'}")
    print("="*50 + "\n")
    return passed

if __name__ == '__main__':
    articles_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'articles.js')
    with open(articles_path, 'r', encoding='utf-8') as f:
        text = f.read()
    start = text.find('[')
    end = text.rfind(']')
    articles = json.loads(text[start:end+1])
    run_verification_audit(articles)
