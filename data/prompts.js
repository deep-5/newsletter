/**
 * AIRA Newsletter - Curated AI Prompts Vault Dataset
 * 100+ Professional, Production-Ready Prompts for ChatGPT, Claude, Midjourney, Coding & Marketing
 */

const AI_PROMPTS_DATA = {
  categories: [
    { id: 'all', name: 'All Prompts', icon: '✨' },
    { id: 'coding', name: 'Coding & Dev', icon: '💻' },
    { id: 'midjourney', name: 'Image & Midjourney', icon: '🎨' },
    { id: 'marketing', name: 'Marketing & Ads', icon: '📈' },
    { id: 'writing', name: 'Writing & Content', icon: '✍️' },
    { id: 'seo', name: 'SEO & Growth', icon: '🔍' },
    { id: 'business', name: 'Business & Strategy', icon: '💼' },
    { id: 'productivity', name: 'Productivity & Ops', icon: '⚡' },
    { id: 'social-media', name: 'Social Media', icon: '📱' }
  ],
  prompts: [
    {
      id: 'prompt-1',
      title: 'Senior Full-Stack Code Architect & Refactorer',
      category: 'coding',
      targetModel: 'Claude 3.7 / ChatGPT 4o',
      description: 'Perform an exhaustive, production-grade architectural code review, find security vulnerabilities, and provide refactored clean code.',
      prompt: 'Act as a Principal Staff Software Engineer and Security Specialist. I will provide you with a code snippet or module.\n\nPlease analyze it across 5 critical dimensions:\n1. Architecture & Design Patterns (SOLID principles, cohesion, decoupling)\n2. Performance Bottlenecks & Big-O Time/Space Complexity\n3. Security Vulnerabilities (OWASP Top 10, sanitization, memory leaks)\n4. Error Handling, Edge Cases, and Resiliency\n5. Testability & Maintainability\n\nAfter your analysis, provide a fully refactored, commented, and type-safe drop-in replacement with comprehensive unit tests.\n\nCode to review:\n[INSERT CODE HERE]',
      tags: ['code-review', 'security', 'refactoring', 'architecture']
    },
    {
      id: 'prompt-2',
      title: 'Comprehensive Unit & Integration Test Suite Generator',
      category: 'coding',
      targetModel: 'ChatGPT / Claude',
      description: 'Generate 100% coverage test suites including happy path, error boundaries, mocks, and edge cases.',
      prompt: 'Act as a Senior QA Automation Engineer and Test-Driven Development (TDD) practitioner. Write an exhaustive unit and integration test suite using [INSERT TEST FRAMEWORK, e.g., Jest / PyTest / Vitest] for the following code.\n\nRequirements:\n- 100% branch and edge-case coverage\n- Explicit mocks for external APIs, databases, and network calls\n- Parameterized testing for input validation and boundary values\n- Readable descriptions following the \'Given-When-Then\' or \'Arrange-Act-Assert\' pattern.\n\nCode under test:\n[INSERT CODE HERE]',
      tags: ['testing', 'jest', 'pytest', 'unit-tests']
    },
    {
      id: 'prompt-3',
      title: 'REST & GraphQL API Contract Designer',
      category: 'coding',
      targetModel: 'Claude / ChatGPT',
      description: 'Design clean, scalable, and secure API contracts with OpenAPI specifications and schema validation.',
      prompt: 'Act as an Enterprise API Architect. Design a production-grade [RESTful / GraphQL] API specification for [INSERT FEATURE / SYSTEM, e.g., Multi-Tenant Subscription & Invoicing Engine].\n\nProvide:\n1. Complete endpoint definitions, HTTP verbs, and path parameters\n2. Request and Response payload schemas (JSON with types)\n3. HTTP Status Codes and standardized error responses\n4. Idempotency, rate limiting, and caching headers\n5. Complete OpenAPI 3.1 YAML schema definition.',
      tags: ['api', 'rest', 'graphql', 'openapi']
    },
    {
      id: 'prompt-4',
      title: 'Database Schema Optimizer & SQL Query Tuner',
      category: 'coding',
      targetModel: 'ChatGPT / Claude',
      description: 'Optimize slow SQL queries, design normalized relational schemas, and add strategic indexing.',
      prompt: 'Act as a Principal Database Administrator (DBA) specializing in PostgreSQL and MySQL. I need you to optimize the following query and schema.\n\n1. Explain why the query is performing sub-optimally (table scans, lock contention, Cartesian products).\n2. Provide the rewritten, high-performance query utilizing proper JOINs and CTEs.\n3. Recommend composite indexes, partitioning strategies, or materialized views to support high-throughput read/write operations.\n\nSlow Query and Schema:\n[INSERT QUERY & TABLE SCHEMA HERE]',
      tags: ['sql', 'database', 'postgres', 'performance']
    },
    {
      id: 'prompt-5',
      title: 'Regex & Pattern Matching Master',
      category: 'coding',
      targetModel: 'ChatGPT / Claude',
      description: 'Build robust, performant Regular Expressions with comprehensive breakdown and test cases.',
      prompt: 'Act as a Regex Expert. Create a battle-tested, high-performance Regular Expression to match: [INSERT REQUIREMENT, e.g., international phone numbers with optional country codes and extensions].\n\nProvide:\n1. The complete Regex pattern with flags\n2. Character-by-character explanation of how the pattern works\n3. Catastrophic backtracking analysis to prevent ReDoS attacks\n4. 5 valid test strings and 5 invalid test strings verifying all edge cases\n5. Code examples in JavaScript and Python.',
      tags: ['regex', 'javascript', 'python', 'validation']
    },
    {
      id: 'prompt-6',
      title: 'Modern React & Next.js Performance Optimizer',
      category: 'coding',
      targetModel: 'Claude / ChatGPT',
      description: 'Diagnose unnecessary re-renders, optimize bundle size, and implement React Server Components.',
      prompt: 'Act as a Senior React Core Engineer. Analyze this React component for performance issues and re-renders.\n\n1. Identify unnecessary re-renders and memory allocations.\n2. Apply useMemo, useCallback, React.memo, or server component architecture where genuinely beneficial.\n3. Implement proper Suspense boundaries, streaming, and optimistic updates.\n4. Output the cleaned, high-performance TypeScript code.\n\nComponent code:\n[INSERT REACT CODE HERE]',
      tags: ['react', 'nextjs', 'frontend', 'typescript']
    },
    {
      id: 'prompt-7',
      title: 'Hyper-Realistic Commercial Product Photography',
      category: 'midjourney',
      targetModel: 'Midjourney v6 / Flux.1',
      description: 'Generate ultra-realistic, studio-lit commercial product photographs for e-commerce and luxury brands.',
      prompt: 'Commercial luxury product photography of [INSERT PRODUCT, e.g., minimalist matte black mechanical wristwatch with gold indices], placed on a raw dark slate rock pedestal, subtle water droplets, soft studio rim lighting, dramatic chiaroscuro, cinematic depth of field, 85mm lens, f/1.8 aperture, Hasselblad medium format camera, ultra-detailed texture, high-end editorial advertisement --ar 16:9 --v 6.1 --style raw --q 2',
      tags: ['midjourney', 'flux', 'product', 'photography']
    },
    {
      id: 'prompt-8',
      title: 'Modern Cyberpunk & Neo-Tokyo Cinematic Scene',
      category: 'midjourney',
      targetModel: 'Midjourney v6 / Flux.1',
      description: 'Generate cinematic, neon-drenched cyberpunk urban landscapes with moody atmospheric lighting.',
      prompt: 'Cinematic film still of a bustling Neo-Tokyo rainy street market in 2088, towering holographic neon billboards reflecting in wet asphalt puddles, dense steam rising from street food vendors, flying autonomous vehicles overhead, cinematic teal and orange color grading, Blade Runner aesthetic, shot on 35mm anamorphic lens, Kodachrome film grain, photorealistic 8k resolution --ar 21:9 --v 6.1 --stylize 250',
      tags: ['midjourney', 'cyberpunk', 'cinematic', 'scifi']
    },
    {
      id: 'prompt-9',
      title: 'Clean Modern 3D Tech SaaS Claymorphism Icon',
      category: 'midjourney',
      targetModel: 'Midjourney v6 / Flux.1',
      description: 'Create sleek 3D tech icons with smooth isometric lighting for apps and websites.',
      prompt: 'Modern 3D isometric tech icon of a [INSERT CONCEPT, e.g., glowing quantum AI neural brain with floating data cubes], sleek claymorphism and frosted glass texture, vibrant gradient lighting in emerald green and deep violet, studio white background, soft ambient shadows, Octane Render, 8k resolution, minimalist Dribbble trend --ar 1:1 --v 6.1 --no text, watermark',
      tags: ['midjourney', '3d', 'icon', 'ui-design']
    },
    {
      id: 'prompt-10',
      title: 'Editorial Fashion Portrait with Natural Studio Light',
      category: 'midjourney',
      targetModel: 'Midjourney v6 / Flux.1',
      description: 'Capture Vogue-style editorial portraits with authentic skin textures and natural lighting.',
      prompt: 'High-fashion editorial portrait of a [INSERT SUBJECT, e.g., striking model wearing an avant-garde sculptural linen trench coat], golden hour sunlight casting geometric window shadows across the background, natural pores and authentic skin texture, caught in motion, shot on Leica M11 with 50mm Summilux f/1.4 lens, candid elegance, Vogue cover quality --ar 4:5 --v 6.1 --style raw',
      tags: ['midjourney', 'portrait', 'fashion', 'photography']
    },
    {
      id: 'prompt-11',
      title: 'Retro 80s Synthwave Sunset Landscape',
      category: 'midjourney',
      targetModel: 'Midjourney v6 / Flux.1',
      description: 'Generate nostalgic retro-futuristic synthwave landscapes with neon wireframes.',
      prompt: 'Retro synthwave 1980s digital art, glowing wireframe grid highway stretching towards a massive neon magenta and cyan sunset over digital mountains, vector palm tree silhouettes, low-poly aesthetics, CRT scanline glow, Outrun album art style, ultra-vibrant colors --ar 16:9 --v 6.1',
      tags: ['midjourney', 'synthwave', 'retro', 'art']
    },
    {
      id: 'prompt-12',
      title: 'High-Converting SaaS Landing Page Copywriter',
      category: 'marketing',
      targetModel: 'ChatGPT 4o / Claude 3.7',
      description: 'Write complete, high-converting landing page copy based on conversion psychology and pain points.',
      prompt: 'Act as an elite Direct-Response Copywriter and Conversion Rate Optimization (CRO) expert trained in frameworks from Eugene Schwartz and David Ogilvy.\n\nWrite a complete landing page copy for [INSERT PRODUCT / SERVICE].\n\nTarget Audience: [INSERT AUDIENCE]\nCore Problem: [INSERT PAIN POINT]\nKey Unique Mechanism: [INSERT UNIQUE VALUE]\n\nProvide:\n1. 5 High-Impact Hero Headlines & Subheaders (curiosity-driven, benefit-driven, pain-driven)\n2. Primary Call-to-Action (CTA) button copy with microcopy\n3. \'Problem-Agitate-Solve\' section\n4. 3 Core Benefit blocks (Features translated into tangible outcomes)\n5. Social Proof & Trust Badges layout plan\n6. 5 Objection-crushing FAQ questions and answers\n7. Exit-Intent Popup copy.',
      tags: ['copywriting', 'landing-page', 'marketing', 'conversion']
    },
    {
      id: 'prompt-13',
      title: 'Viral Meta & TikTok Video Ad Script Generator',
      category: 'marketing',
      targetModel: 'ChatGPT / Claude',
      description: 'Create hook-heavy, high-retention 30-60 second UGC and direct response video ad scripts.',
      prompt: 'Act as a Performance Creative Strategist specializing in TikTok, Instagram Reels, and Meta Ads. Write 3 distinct 45-second direct-response video ad scripts for [INSERT PRODUCT].\n\nFor each script, format as a 2-column table with [Visual Scene / Action] and [Audio / Voiceover / Sound Effect]:\n- Script 1: Negative Hook / Problem Callout (First 3 seconds must stop the scroll)\n- Script 2: \'Before vs After\' Transformation Story\n- Script 3: Social Proof / Customer Testimonial Breakdown\n\nInclude on-screen text callouts, music beat cues, and a clear, frictionless Call-to-Action at the end.',
      tags: ['tiktok', 'meta-ads', 'video-scripts', 'ugc']
    },
    {
      id: 'prompt-14',
      title: 'Complete 7-Day Email Welcome & Onboarding Sequence',
      category: 'marketing',
      targetModel: 'Claude / ChatGPT',
      description: 'Build an automated nurture email sequence that turns free subscribers into paying customers.',
      prompt: 'Act as a Retention & Lifecycle Email Marketing Specialist. Write an automated 5-email onboarding sequence for new signups of [INSERT APP / NEWSLETTER / PRODUCT].\n\nSequence structure:\n- Email 1 (Day 0): Immediate Welcome, Value Delivery & Whitelist Instructions\n- Email 2 (Day 1): Origin Story & \'The Big Shift\' in the Industry\n- Email 3 (Day 3): Case Study / Customer Breakthrough Story\n- Email 4 (Day 5): Overcoming the #1 Objection & Quick Win Tutorial\n- Email 5 (Day 7): Limited-Time Upgrade Offer with Urgency\n\nProvide 3 clickable subject lines for each email and clear CTA buttons.',
      tags: ['email-marketing', 'onboarding', 'lifecycle', 'retention']
    },
    {
      id: 'prompt-15',
      title: 'Programmatic SEO Pillar Page & Topic Cluster Planner',
      category: 'seo',
      targetModel: 'Claude 3.7 / ChatGPT',
      description: 'Plan comprehensive topic clusters and semantic keyword pillar architectures to dominate search rankings.',
      prompt: 'Act as an Enterprise Technical SEO Strategist. I want to build topical authority for the topic: [INSERT SEED KEYWORD / NICHE].\n\nGenerate:\n1. 1 Comprehensive Pillar Page Outline with H1, H2, and H3 structure targeting high-intent commercial keywords\n2. 10 Supporting Sub-Topic Cluster Articles with target search intent (Informational, Transactional, Navigating)\n3. Internal linking blueprint mapping how clusters pass PageRank to the pillar\n4. Recommended schema markup types (Article, FAQPage, HowTo)\n5. 5 Low-competition, high-volume long-tail keyword questions to answer in FAQs.',
      tags: ['seo', 'topic-clusters', 'content-strategy', 'ranking']
    },
    {
      id: 'prompt-16',
      title: 'Search Intent & Competitor Content Gap Analyzer',
      category: 'seo',
      targetModel: 'ChatGPT / Claude',
      description: 'Analyze competitor articles to find missing subtopics, outdated statistics, and ranking opportunities.',
      prompt: 'Act as a Senior SEO Content Auditor. I will provide you with the target keyword \'[INSERT TARGET KEYWORD]\' and summary of top-ranking competitor articles.\n\nAnalyze and identify:\n1. Critical content gaps (topics competitors missed or explained poorly)\n2. Information gain opportunities (original data, frameworks, or visual diagrams we can introduce)\n3. Suggested word count, heading hierarchy, and semantic entities (LSI keywords) to include\n4. An original, superior article outline that will outperform all competitors in E-E-A-T scores.',
      tags: ['seo', 'content-gap', 'competitor-analysis', 'eeat']
    },
    {
      id: 'prompt-17',
      title: 'Deep-Dive Thought Leadership Newsletter Essay',
      category: 'writing',
      targetModel: 'Claude 3.7 / ChatGPT',
      description: 'Write engaging, high-retention essays packed with original mental models, insights, and punchy prose.',
      prompt: 'Act as a world-class Tech Essayist and Newsletter Writer (in the style of Paul Graham, Ben Thompson, and Packy McCormick). Write an engaging 1,500-word deep-dive essay on: [INSERT TOPIC].\n\nGuidelines:\n- Hook the reader in the first 2 sentences with a non-obvious contrarian thesis.\n- Avoid generic AI clichés (\'In today\'s fast-paced world\', \'delve\', \'testament\').\n- Use short, punchy paragraphs, concrete real-world case studies, and clear mental models.\n- Include 3 tweetable quote blocks and a concluding actionable synthesis.',
      tags: ['newsletter', 'essay', 'thought-leadership', 'writing']
    },
    {
      id: 'prompt-18',
      title: 'Bestselling Non-Fiction Book Chapter Outliner',
      category: 'writing',
      targetModel: 'ChatGPT / Claude',
      description: 'Structure engaging, story-driven book chapters with narrative hooks and actionable frameworks.',
      prompt: 'Act as an Executive Book Editor from a top publishing house. Create a detailed chapter-by-chapter outline for a book titled \'[INSERT BOOK TITLE]\' about [INSERT TOPIC].\n\nFor each chapter, provide:\n1. Chapter Title & Punchy Subtitle\n2. The Core Psychological or Business Lesson\n3. An engaging opening narrative / historical anecdote\n4. 3 structured sub-sections with frameworks\n5. Practical exercise or takeaway for the reader.',
      tags: ['books', 'outlines', 'author', 'publishing']
    },
    {
      id: 'prompt-19',
      title: 'Y Combinator-Style Pitch Deck Teardown & Script',
      category: 'business',
      targetModel: 'Claude / ChatGPT',
      description: 'Craft a crisp, investor-ready 10-slide startup pitch deck narrative that hooks venture capitalists.',
      prompt: 'Act as a Partner at a Tier-1 Venture Capital firm (e.g. Sequoia / YC). I will tell you about my startup: [INSERT STARTUP SUMMARY].\n\nBuild a compelling 10-Slide Pitch Deck framework:\nSlide 1: Problem (The painful, urgent reality)\nSlide 2: Solution & \'Magic\' (The breakthrough)\nSlide 3: Market Size & TAM (Bottom-up calculation)\nSlide 4: Product & Demo Highlights\nSlide 5: Business Model & Unit Economics\nSlide 6: Traction & Key Metrics\nSlide 7: Unfair Advantage / Moat\nSlide 8: Competition Matrix (2x2 Axis)\nSlide 9: Team Pedigree\nSlide 10: The Ask & Milestones with Funding.\n\nAlso include the 2-minute spoken pitch script.',
      tags: ['startup', 'pitch-deck', 'fundraising', 'investors']
    },
    {
      id: 'prompt-20',
      title: 'SaaS Pricing Tier & Packaging Strategist',
      category: 'business',
      targetModel: 'ChatGPT / Claude',
      description: 'Design optimal Free, Pro, and Enterprise pricing tiers that maximize ARPU and reduce churn.',
      prompt: 'Act as a SaaS Monetization and Pricing Consultant. Design a value-metric based 3-tier pricing strategy for [INSERT SOFTWARE PRODUCT].\n\n1. Identify the single best Value Metric (e.g., seats, API calls, storage, revenue generated).\n2. Structure 3 tiers: Starter/Free Tier, Pro Tier (Sweet Spot for revenue), Enterprise Tier (Custom).\n3. Define feature gating rules (which features belong in Pro vs Enterprise without crippling adoption).\n4. Suggest annual billing discount percentages and psychological price anchor points.',
      tags: ['pricing', 'saas', 'monetization', 'strategy']
    },
    {
      id: 'prompt-21',
      title: 'Executive Daily Time-Blocking & Priority Engine',
      category: 'productivity',
      targetModel: 'ChatGPT / Claude',
      description: 'Transform chaotic to-do lists into Eisenhower matrix prioritized, time-blocked execution schedules.',
      prompt: 'Act as an Executive Chief of Staff and Productivity Coach. Here is my messy list of tasks and commitments for this week: [INSERT TASKS].\n\n1. Categorize all tasks into the Eisenhower Matrix (Urgent/Important, Important/Not Urgent, Delegate, Eliminate).\n2. Identify my \'Top 3 High-Leverage Rocks\' that move the needle most.\n3. Build a structured 5-day time-blocked calendar schedule (including deep work blocks, admin buffers, and context switches).\n4. Provide 3 specific tasks to automate or delegate immediately.',
      tags: ['time-management', 'productivity', 'calendar', 'planning']
    },
    {
      id: 'prompt-22',
      title: 'Complex PDF & Research Paper Synthesizer',
      category: 'productivity',
      targetModel: 'Claude 3.7 / ChatGPT',
      description: 'Extract core methodologies, data results, and key takeaways from technical research papers.',
      prompt: 'Act as a Senior Research Fellow. I will provide text from an academic research paper or industry whitepaper.\n\nSummarize the text using this structured format:\n1. Core Thesis & Research Question (1 sentence)\n2. Methodology & Key Datasets Used\n3. 5 Major Findings & Statistical Breakthroughs (with numerical data)\n4. Limitations & Edge Cases Acknowledged by the Authors\n5. Practical Commercial Applications & Next Steps for Industry Builders.\n\nText:\n[INSERT PAPER TEXT HERE]',
      tags: ['research', 'pdf-summary', 'synthesis', 'academics']
    },
    {
      id: 'prompt-23',
      title: 'Viral Twitter / X Thread Architect',
      category: 'social-media',
      targetModel: 'ChatGPT / Claude',
      description: 'Create viral, high-retention 7-10 tweet threads with scroll-stopping hooks and clear takeaways.',
      prompt: 'Act as a Ghostwriter for Top Tech Founders with over 500k followers on X/Twitter. Write a viral 8-tweet thread breaking down: [INSERT TOPIC].\n\nTweet 1: Irresistible Hook (Curiosity + High Stakes + Specific Result, under 240 chars)\nTweets 2-7: Actionable, step-by-step insights with bullet points and bold takeaways\nTweet 8: Strong summary + Call to Action (RT + Follow + Newsletter plug).\n\nKeep tone authoritative, concise, and zero fluff.',
      tags: ['twitter', 'threads', 'social-media', 'ghostwriting']
    },
    {
      id: 'prompt-24',
      title: 'LinkedIn Thought Leadership Carousel & Post',
      category: 'social-media',
      targetModel: 'Claude / ChatGPT',
      description: 'Write high-engagement LinkedIn posts formatted for readability, shares, and comment discussions.',
      prompt: 'Act as an Executive Brand Strategist on LinkedIn. Write a high-engagement LinkedIn post about [INSERT LESSON / INDUSTRY SHIFT].\n\nRequirements:\n- Strong 2-line hook before the \'...see more\' fold.\n- Short, rhythmic 1-2 sentence paragraphs with whitespace.\n- Personal storytelling blended with actionable business advice.\n- End with a thought-provoking open question that drives comments.\n- Provide slide-by-slide copy for a 5-slide visual PDF carousel to accompany the post.',
      tags: ['linkedin', 'personal-brand', 'carousel', 'networking']
    }
  ]
};
