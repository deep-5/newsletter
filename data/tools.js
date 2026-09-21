/**
 * AIRA Newsletter - Curated AI Tools Directory Dataset
 * Strictly Sourced from powerfulai.tools directory standards.
 * Heavy focus on Free & Generous Freemium daily utility tools.
 */

const AI_TOOLS_DATA = {
  "categories": [
    {
      "id": "all",
      "name": "All Tools",
      "icon": "⚡"
    },
    {
      "id": "chatbot",
      "name": "Chatbots & LLMs",
      "icon": "💬"
    },
    {
      "id": "writing",
      "name": "Writing & Copywriting",
      "icon": "✍️"
    },
    {
      "id": "image-generator",
      "name": "Image & Art Generation",
      "icon": "🎨"
    },
    {
      "id": "video-generator",
      "name": "Video & Animation",
      "icon": "🎬"
    },
    {
      "id": "audio-editing",
      "name": "Voice, Audio & Music",
      "icon": "🎧"
    },
    {
      "id": "productivity",
      "name": "Productivity & Automation",
      "icon": "⚡"
    },
    {
      "id": "research",
      "name": "Research & PDF Analysis",
      "icon": "📚"
    },
    {
      "id": "education",
      "name": "Education & Students",
      "icon": "🎓"
    },
    {
      "id": "developer-tools",
      "name": "Coding & Dev Tools",
      "icon": "💻"
    },
    {
      "id": "marketing",
      "name": "Marketing & SEO",
      "icon": "📈"
    }
  ],
  "tools": [
    {
      "id": "chatgpt",
      "name": "ChatGPT",
      "category": "chatbot",
      "categories": [
        "chatbot",
        "writing",
        "productivity"
      ],
      "pricing": "Freemium",
      "badge": "Top Pick",
      "featured": true,
      "description": "OpenAI's conversational assistant with GPT-4o, GPT-4o mini, DALL-E image generation, and live web browsing.",
      "url": "https://chatgpt.com",
      "domain": "chatgpt.com",
      "icon": "🤖",
      "inner_content": {
        "overview": "ChatGPT by OpenAI is the world's most widely used AI assistant. It provides conversational reasoning, multimodal image analysis, DALL-E image generation, live web search, custom GPTs, and code execution in Python.",
        "features": [
          "GPT-4o multimodal vision, voice, text, and real-time reasoning",
          "Integrated web browsing with real-time citations and source attribution",
          "Python code interpreter capable of analyzing spreadsheets and generating charts",
          "Custom GPT store with thousands of specialized community workflows"
        ],
        "useCases": [
          "Daily conversational assistant for answering questions and brainstorming",
          "Drafting essays, emails, blog posts, and marketing content",
          "Data analysis, spreadsheet calculations, and Python code debugging"
        ],
        "pricingDetails": "Free tier with access to GPT-4o mini and limited GPT-4o. Plus plan at $20/month."
      }
    },
    {
      "id": "claude",
      "name": "Claude",
      "category": "chatbot",
      "categories": [
        "chatbot",
        "developer-tools",
        "writing"
      ],
      "pricing": "Freemium",
      "badge": "Top Pick",
      "featured": true,
      "description": "Anthropic's frontier AI assistant featuring extended thinking, 200k context window, and exceptional nuanced writing.",
      "url": "https://claude.ai",
      "domain": "anthropic.com",
      "icon": "🧠",
      "inner_content": {
        "overview": "Claude by Anthropic is renowned for its natural tone, deep reasoning abilities, and safe alignment. With its 200,000 token context window, Claude can analyze entire books, financial reports, or codebases in seconds.",
        "features": [
          "Extended thinking and chain-of-thought reasoning",
          "200,000 token context window for huge documents and datasets",
          "Claude Artifacts for live interactive React components, SVGs, and documents",
          "Exceptional writing style with zero generic robotic phrasing"
        ],
        "useCases": [
          "Complex coding, refactoring, and code review",
          "Analyzing massive PDFs, legal contracts, and academic papers in one prompt",
          "Writing high-stakes executive memos, articles, and documentation"
        ],
        "pricingDetails": "Free tier with daily usage limits. Pro tier at $20/month."
      }
    },
    {
      "id": "deepseek",
      "name": "DeepSeek",
      "category": "chatbot",
      "categories": [
        "chatbot",
        "developer-tools",
        "research"
      ],
      "pricing": "Free",
      "badge": "100% Free",
      "featured": true,
      "description": "Open-weight frontier reasoning and coding model matching top proprietary LLMs at zero cost.",
      "url": "https://chat.deepseek.com",
      "domain": "deepseek.com",
      "icon": "🐋",
      "inner_content": {
        "overview": "DeepSeek R1 is a breakthrough open-source reasoning model that uses reinforcement learning to achieve mathematical, coding, and logical problem-solving performance on par with proprietary frontier models. Available 100% free via its web chat and as downloadable open weights.",
        "features": [
          "Reinforcement-learning driven deep logical reasoning and chain-of-thought",
          "Advanced multi-language coding, algorithmic debugging, and math solving",
          "Completely free to use with generous context windows on web and mobile",
          "Downloadable open weights for local self-hosting via Ollama and LM Studio"
        ],
        "useCases": [
          "Free coding assistant for software developers and students",
          "Complex mathematical derivations and step-by-step problem solving",
          "In-depth research analysis, code refactoring, and logical synthesis"
        ],
        "pricingDetails": "100% Free on web/mobile apps. Open weights freely downloadable."
      }
    },
    {
      "id": "gemini",
      "name": "Google Gemini",
      "category": "chatbot",
      "categories": [
        "chatbot",
        "research",
        "productivity"
      ],
      "pricing": "Freemium",
      "badge": "Top Pick",
      "featured": true,
      "description": "Google's multimodal assistant powered by Gemini with a massive 1M-2M context window and Google Workspace integration.",
      "url": "https://gemini.google.com",
      "domain": "google.com",
      "icon": "✨",
      "inner_content": {
        "overview": "Google Gemini provides real-time multimodal reasoning across text, audio, video, and code. With seamless integration into Google Workspace (Docs, Gmail, Drive, YouTube), Gemini brings live Google Search accuracy to daily queries.",
        "features": [
          "Gemini 2.0 Flash and Pro multimodal reasoning engine",
          "Massive 1M+ token context window to ingest hours of video or huge documents",
          "Seamless integration with Google Drive, Gmail, Docs, Maps, and YouTube",
          "Real-time web search grounding with verified Google citations"
        ],
        "useCases": [
          "Summarizing YouTube videos and long Google Drive documents instantly",
          "Multimodal video, image, and document analysis",
          "Everyday research, trip planning, and email drafting"
        ],
        "pricingDetails": "Free tier with Gemini Flash. Advanced plan included in Google One AI Premium ($19.99/mo)."
      }
    },
    {
      "id": "perplexity",
      "name": "Perplexity AI",
      "category": "chatbot",
      "categories": [
        "chatbot",
        "research",
        "productivity"
      ],
      "pricing": "Freemium",
      "badge": "Trending",
      "featured": true,
      "description": "AI-powered answer engine that searches the live web and provides clean, citation-backed answers.",
      "url": "https://www.perplexity.ai",
      "domain": "perplexity.ai",
      "icon": "🔍",
      "inner_content": {
        "overview": "Perplexity AI is a next-generation conversational search engine that pairs frontier language models with live web indexing to deliver accurate, citation-backed answers with zero sponsored clutter.",
        "features": [
          "Pro Search with multi-step reasoning and deep web retrieval",
          "Direct citations with clickable source links on every factual statement",
          "Perplexity Spaces to organize research documents and collaborate",
          "Ability to toggle underlying models: Claude, GPT-4o, Sonar, DeepSeek"
        ],
        "useCases": [
          "Fact-checked research for academics, journalists, and professionals",
          "Comparing market products, tech stacks, and financial news",
          "Organizing multi-topic research binders in custom Spaces"
        ],
        "pricingDetails": "Free unlimited Quick Searches and daily Pro Searches. Pro plan at $20/month."
      }
    },
    {
      "id": "copilot",
      "name": "Microsoft Copilot",
      "category": "chatbot",
      "categories": [
        "chatbot",
        "productivity",
        "writing"
      ],
      "pricing": "Free",
      "badge": "100% Free",
      "featured": false,
      "description": "Microsoft's free AI assistant powered by GPT-4o and DALL-E 3 with Bing web search and Office integration.",
      "url": "https://copilot.microsoft.com",
      "domain": "microsoft.com",
      "icon": "🪟",
      "inner_content": {
        "overview": "Microsoft Copilot gives users free access to OpenAI's GPT-4o and DALL-E 3 image generation, connected directly to Bing live search. It works seamlessly across Windows, Edge, and mobile devices.",
        "features": [
          "Free access to GPT-4o models without subscription fees",
          "Built-in DALL-E 3 image generator for creating art and graphics",
          "Direct web browsing with real-time news and citations",
          "Integrated into Windows 11 taskbar and Microsoft Edge sidebar"
        ],
        "useCases": [
          "Everyday web search, question answering, and quick summaries",
          "Generating free AI images and visual concept mockups",
          "Summarizing web pages directly inside Microsoft Edge"
        ],
        "pricingDetails": "100% Free for web and mobile. Copilot Pro available for Microsoft 365 integration."
      }
    },
    {
      "id": "mistral-chat",
      "name": "Mistral Le Chat",
      "category": "chatbot",
      "categories": [
        "chatbot",
        "developer-tools",
        "research"
      ],
      "pricing": "Free",
      "badge": "100% Free",
      "featured": false,
      "description": "Mistral AI's free conversational platform powered by Mistral Large, Pixtral vision, and web search.",
      "url": "https://chat.mistral.ai",
      "domain": "mistral.ai",
      "icon": "🌪️",
      "inner_content": {
        "overview": "Le Chat is the official free assistant by European AI frontier lab Mistral AI. It features top-tier multilingual capabilities, coding assistance, document understanding with Pixtral, and integrated web search.",
        "features": [
          "Powered by flagship Mistral Large and Pixtral multimodal vision models",
          "Uncensored, direct, and exceptionally fast token generation speed",
          "Integrated live web search with clean source links",
          "Canvas feature for interactive document and code editing"
        ],
        "useCases": [
          "Multilingual translation and European language copywriting",
          "Fast coding, script generation, and technical problem solving",
          "Document inspection, PDF summarization, and image extraction"
        ],
        "pricingDetails": "100% Free during open beta with generous query allowances."
      }
    },
    {
      "id": "poe",
      "name": "Poe by Quora",
      "category": "chatbot",
      "categories": [
        "chatbot",
        "productivity"
      ],
      "pricing": "Freemium",
      "badge": "Multi-Model",
      "featured": false,
      "description": "Universal AI aggregator by Quora to access ChatGPT, Claude, Gemini, FLUX, and custom bots in one app.",
      "url": "https://poe.com",
      "domain": "poe.com",
      "icon": "📱",
      "inner_content": {
        "overview": "Poe by Quora is a unified ecosystem that provides access to virtually every major AI model (OpenAI, Anthropic, Google, Meta, Mistral, Stability) under a single interface with generous daily free computing points.",
        "features": [
          "All major LLMs in one place (GPT-4o, Claude, Gemini, DeepSeek)",
          "Daily free compute points replenished every 24 hours",
          "Create and monetize custom AI bots and workflows",
          "Cross-platform syncing across iOS, Android, macOS, and Web"
        ],
        "useCases": [
          "Comparing responses between different LLMs side-by-side",
          "Creating specialized prompt bots for specific tasks or teams",
          "Single hub for text, code, and image generation"
        ],
        "pricingDetails": "Generous daily free compute points. Premium subscription for heavy unlimited usage."
      }
    },
    {
      "id": "huggingchat",
      "name": "HuggingChat",
      "category": "chatbot",
      "categories": [
        "chatbot",
        "developer-tools"
      ],
      "pricing": "Free",
      "badge": "Open Source",
      "featured": false,
      "description": "Open-source alternative to ChatGPT by Hugging Face, allowing you to chat with any top open-weight model.",
      "url": "https://huggingface.co/chat",
      "domain": "huggingface.co",
      "icon": "🤗",
      "inner_content": {
        "overview": "HuggingChat is the leading open-source chat interface developed by Hugging Face. Users can switch between top open-weight models including Llama 3.3, DeepSeek R1, Mistral, Command R+, and Qwen with zero subscription fees.",
        "features": [
          "Switch between multiple cutting-edge open-source models with one click",
          "Integrated web search capability for real-time queries",
          "Community-created Custom Assistants and system prompt presets",
          "Completely open source and privacy-focused codebase"
        ],
        "useCases": [
          "Evaluating and benchmarking different open-source AI models",
          "Privacy-conscious daily chatbot for writing and coding",
          "Building custom conversational assistants on Hugging Face"
        ],
        "pricingDetails": "100% Free and open source provided by Hugging Face."
      }
    },
    {
      "id": "kimi-ai",
      "name": "Kimi AI",
      "category": "chatbot",
      "categories": [
        "chatbot",
        "research",
        "productivity"
      ],
      "pricing": "Free",
      "badge": "2M Context",
      "featured": false,
      "description": "Moonshot AI's assistant with 2-million-character context, live web search, and PDF analysis.",
      "url": "https://kimi.moonshot.cn",
      "domain": "moonshot.cn",
      "icon": "🌙",
      "inner_content": {
        "overview": "Kimi AI is an ultra-long context AI assistant developed by Moonshot AI. It is capable of processing up to 2 million characters in a single prompt, making it one of the most capable free tools for reading massive documents, financial books, and complex manuals.",
        "features": [
          "Massive 2-million-character ultra-long context window",
          "High-speed document parsing for PDFs, DOCX, and web links",
          "Integrated real-time internet search and synthesis",
          "Clean interface optimized for deep reading and knowledge extraction"
        ],
        "useCases": [
          "Analyzing whole annual financial reports and legal filings",
          "Summarizing entire textbooks and research papers",
          "Extracting key data points from 500+ page technical manuals"
        ],
        "pricingDetails": "100% Free on web and mobile apps."
      }
    },
    {
      "id": "quillbot",
      "name": "QuillBot",
      "category": "writing",
      "categories": [
        "writing",
        "education"
      ],
      "pricing": "Freemium",
      "badge": "Top Free Writing",
      "featured": true,
      "description": "Free AI paraphrasing tool, grammar checker, summarizer, citation generator, and translator.",
      "url": "https://quillbot.com",
      "domain": "quillbot.com",
      "icon": "🪶",
      "inner_content": {
        "overview": "QuillBot is the world's most trusted AI writing and paraphrasing companion used by over 50 million students and professionals. It rewrites sentences, corrects grammar, summarizes essays, and creates academic citations.",
        "features": [
          "Paraphraser with Standard, Fluency, Formal, Creative, and Shorten modes",
          "Advanced Grammar Checker that spots punctuation, tense, and spelling errors",
          "AI Summarizer: condense long articles or research papers into bullet points",
          "Free Citation Generator supporting APA, MLA, and Chicago citation styles"
        ],
        "useCases": [
          "Students polishing academic essays and generating accurate bibliographies",
          "Non-native English speakers improving fluency and natural phrasing",
          "Writers eliminating repetitive vocabulary and improving sentence variety"
        ],
        "pricingDetails": "Generous Free tier with 125 words per paraphrase. Premium for unlimited words."
      }
    },
    {
      "id": "grammarly",
      "name": "Grammarly AI",
      "category": "writing",
      "categories": [
        "writing",
        "productivity"
      ],
      "pricing": "Freemium",
      "badge": "Top Pick",
      "featured": true,
      "description": "AI communication assistant that catches errors, refines tone, and rewrites text across all desktop apps.",
      "url": "https://www.grammarly.com",
      "domain": "grammarly.com",
      "icon": "✍️",
      "inner_content": {
        "overview": "Grammarly is an essential writing assistant that operates across web browsers, email clients, Word, and desktop apps. Its generative AI rewrites emails, adjusts formality, and ensures clear, error-free communication.",
        "features": [
          "Real-time grammar, spelling, punctuation, and clarity suggestions",
          "Tone detector and rewriter (formal, casual, confident, empathetic)",
          "Generative AI prompts to reply to emails and brainstorm drafts in 1 click",
          "Browser extension and desktop app integrating seamlessly with your workflow"
        ],
        "useCases": [
          "Crafting professional business emails and client proposals",
          "Checking academic papers and thesis drafts for clarity and tone",
          "Refining everyday workplace messages on Slack, Teams, and Gmail"
        ],
        "pricingDetails": "Free tier with 100 AI prompt credits/mo and core grammar checks. Premium at $12/mo."
      }
    },
    {
      "id": "copy-ai",
      "name": "Copy.ai",
      "category": "writing",
      "categories": [
        "writing",
        "marketing"
      ],
      "pricing": "Freemium",
      "badge": "Marketing Copy",
      "featured": false,
      "description": "AI platform for sales and marketing teams to generate social copy, email campaigns, and SEO articles.",
      "url": "https://www.copy.ai",
      "domain": "copy.ai",
      "icon": "🚀",
      "inner_content": {
        "overview": "Copy.ai is a specialized generative copywriting platform tailored for marketers, agencies, and sales professionals. It provides over 90 templates for ad copy, cold outbound emails, blog outlines, and social posts.",
        "features": [
          "90+ dedicated copywriting templates for Facebook ads, Google search, and blogs",
          "Brand Voice engine to enforce your company's tone across all copy",
          "Infobase: store reusable company facts, product specs, and value propositions",
          "Workflow automation to generate bulk content from spreadsheets"
        ],
        "useCases": [
          "Marketers writing high-converting social media ads and sales landing pages",
          "Sales reps personalizing cold outbound outreach emails at scale",
          "Content creators brainstorming catchy video titles and email newsletters"
        ],
        "pricingDetails": "Free plan includes 2,000 words in Chat per month. Pro plan for unlimited words."
      }
    },
    {
      "id": "writesonic",
      "name": "Writesonic",
      "category": "writing",
      "categories": [
        "writing",
        "marketing"
      ],
      "pricing": "Freemium",
      "badge": "SEO Articles",
      "featured": false,
      "description": "AI writer trained on top-ranking Google content to generate SEO-optimized articles, landing pages, and ads.",
      "url": "https://writesonic.com",
      "domain": "writesonic.com",
      "icon": "⚡",
      "inner_content": {
        "overview": "Writesonic is an AI content creation platform built for SEO writers and agencies. Its Article Writer analyzes current top-ranking Google competitors to generate comprehensive, fact-checked, and keyword-optimized long-form articles.",
        "features": [
          "AI Article Writer with real-time Google search competitor analysis",
          "Chatsonic conversational AI assistant with live internet access",
          "Brand Voice personalization and automatic internal linking suggestions",
          "1-click export to WordPress, Webflow, and Shopify"
        ],
        "useCases": [
          "Publishing 2,500+ word SEO-optimized blog posts in minutes",
          "Generating high-converting e-commerce product descriptions",
          "Creating multi-channel marketing campaigns and Google Ad headlines"
        ],
        "pricingDetails": "Free trial with 25 credits. Paid plans start from $12/month."
      }
    },
    {
      "id": "rytr",
      "name": "Rytr",
      "category": "writing",
      "categories": [
        "writing",
        "marketing"
      ],
      "pricing": "Freemium",
      "badge": "10k Free Words/Mo",
      "featured": false,
      "description": "Fast, affordable AI writing assistant for blogs, emails, social ads, and product descriptions.",
      "url": "https://rytr.me",
      "domain": "rytr.me",
      "icon": "✍️",
      "inner_content": {
        "overview": "Rytr is an intuitive AI writing assistant that helps you create high-quality content in just a few seconds. With 40+ use cases and 20+ voice tones, Rytr generates catchy copy for emails, social media, and blogs.",
        "features": [
          "40+ pre-built use cases (blog outlines, email replies, YouTube descriptions)",
          "20+ tone selectors (convincing, enthusiastic, formal, casual, humble)",
          "Built-in plagiarism checker powered by Copyscape",
          "Generous 10,000 characters per month on the permanent free plan"
        ],
        "useCases": [
          "Freelancers drafting quick email templates and social captions",
          "E-commerce stores generating catchy product titles and bullet points",
          "Bloggers overcoming writer's block with outline and intro generation"
        ],
        "pricingDetails": "Free plan includes 10,000 characters per month. Unlimited plan from $7.50/mo."
      }
    },
    {
      "id": "notion-ai",
      "name": "Notion AI",
      "category": "writing",
      "categories": [
        "writing",
        "productivity"
      ],
      "pricing": "Freemium",
      "badge": "Connected Brain",
      "featured": false,
      "description": "Integrated AI assistant inside Notion that searches your entire workspace, drafts docs, and summarizes notes.",
      "url": "https://www.notion.so/product/ai",
      "domain": "notion.so",
      "icon": "📓",
      "inner_content": {
        "overview": "Notion AI connects directly to your Notion workspace. It can answer questions about your team's internal documentation, write meeting summaries, extract action items, and draft documentation with full contextual awareness.",
        "features": [
          "Q&A across your entire workspace: finds answers buried in company wikis",
          "Automated meeting notes summarizer and action-item extractor",
          "In-editor drafting for blog posts, PRDs, specs, and translation",
          "Autofill database tables with AI-generated summaries and tags"
        ],
        "useCases": [
          "Product managers drafting PRDs and feature specifications",
          "Teams organizing meeting transcripts and capturing immediate action items",
          "Building an automated internal company knowledge base and FAQ"
        ],
        "pricingDetails": "Free trial with complimentary AI responses. Add-on available for $8-10/user/mo."
      }
    },
    {
      "id": "hemingway-ai",
      "name": "Hemingway Editor Plus",
      "category": "writing",
      "categories": [
        "writing",
        "education"
      ],
      "pricing": "Freemium",
      "badge": "Readability",
      "featured": false,
      "description": "AI writing editor that highlights complex sentences, passive voice, and fixes readability issues.",
      "url": "https://hemingwayapp.com",
      "domain": "hemingwayapp.com",
      "icon": "📖",
      "inner_content": {
        "overview": "Hemingway Editor makes your writing bold and clear. It highlights wordy sentences, passive voice, unnecessary adverbs, and complex phrasing with color-coded alerts, while its AI rephrases sentences for maximum punch.",
        "features": [
          "Color-coded highlighting of hard-to-read sentences and passive voice",
          "One-click AI sentence shortener and tone adjuster",
          "Automated Grade Level readability scoring (Flesch-Kincaid index)",
          "Distraction-free markdown writing mode"
        ],
        "useCases": [
          "Simplifying dense technical documents and business memos",
          "Editing newsletter issues and articles to achieve Grade 5-8 readability",
          "Fixing passive voice and clumsy phrasing in marketing copy"
        ],
        "pricingDetails": "Free web version for core color-coded editing. Plus AI plan at $8.33/mo."
      }
    },
    {
      "id": "leonardo-ai",
      "name": "Leonardo.ai",
      "category": "image-generator",
      "categories": [
        "image-generator",
        "video-generator"
      ],
      "pricing": "Freemium",
      "badge": "150 Daily Free",
      "featured": true,
      "description": "Full-suite creative platform for generating game assets, marketing imagery, and motion videos with 150 daily free credits.",
      "url": "https://leonardo.ai",
      "domain": "leonardo.ai",
      "icon": "✨",
      "inner_content": {
        "overview": "Leonardo.ai (now part of Canva) is a comprehensive generative art studio. It offers fine-tuned community models, real-time AI canvas painting, motion video generation, and 150 daily free credits.",
        "features": [
          "150 free generation tokens replenished every single day",
          "Phoenix and Kino flagship models for cinematic photorealism",
          "Real-time Canvas editor: draw rough sketches and see instant AI renders",
          "Motion generator: turn any static image into an animated video loop"
        ],
        "useCases": [
          "Concept art, character design, and game asset production",
          "Creating photorealistic portraits, landscape backdrops, and product renders",
          "Generating animated social media visuals and YouTube thumbnails"
        ],
        "pricingDetails": "Generous 150 free credits refreshed every day. Paid tiers for unlimited generations."
      }
    },
    {
      "id": "recraft-ai",
      "name": "Recraft AI",
      "category": "image-generator",
      "categories": [
        "image-generator",
        "productivity"
      ],
      "pricing": "Freemium",
      "badge": "Top Design Pick",
      "featured": true,
      "description": "Design-first AI image and vector generator with precise style consistency, SVG export, and canvas editing.",
      "url": "https://www.recraft.ai",
      "domain": "recraft.ai",
      "icon": "🎨",
      "inner_content": {
        "overview": "Recraft AI is a professional AI design platform created specifically for digital artists, graphic designers, and marketers. It allows you to generate raster illustrations, 3D icons, photorealistic images, and clean vector SVGs.",
        "features": [
          "True vector SVG generation with infinitely scalable editable paths",
          "Recraft 20B image model with industry-leading text rendering and anatomy",
          "Brand style consistency: maintain exact color palettes and visual styles",
          "Infinite canvas with inpainting, outpainting, and background removal"
        ],
        "useCases": [
          "Creating professional vector icons, logos, and UI illustration assets",
          "Generating marketing graphics matching exact corporate brand colors",
          "High-resolution 3D renders and character concepts for web design"
        ],
        "pricingDetails": "Free tier with 50 daily credits and SVG export. Paid plans for commercial private mode."
      }
    },
    {
      "id": "flux-1",
      "name": "Flux.1 by BFL",
      "category": "image-generator",
      "categories": [
        "image-generator"
      ],
      "pricing": "Free",
      "badge": "Open Weights",
      "featured": true,
      "description": "State-of-the-art open image generation model from Black Forest Labs with incredible prompt fidelity.",
      "url": "https://blackforestlabs.ai",
      "domain": "blackforestlabs.ai",
      "icon": "🌌",
      "inner_content": {
        "overview": "FLUX.1 is the flagship 12-billion-parameter image generation model family created by Black Forest Labs (the original creators of Stable Diffusion). It delivers photorealism, perfect human anatomy, and precise text rendering.",
        "features": [
          "FLUX.1 Schnell: ultra-fast 4-step open-weight model for local and web generation",
          "Flawless typography rendering inside generated images and posters",
          "Exceptional complex prompt following and diverse artistic styles",
          "Freely usable locally via ComfyUI and Automatic1111"
        ],
        "useCases": [
          "Generating photorealistic marketing photography and product concepts",
          "Creating typography-heavy posters, book covers, and social graphics",
          "Local self-hosted image generation pipelines with zero subscription fees"
        ],
        "pricingDetails": "FLUX.1 [schnell] is Apache 2.0 open-source. Free on Hugging Face & Replicate."
      }
    },
    {
      "id": "ideogram",
      "name": "Ideogram 2.0",
      "category": "image-generator",
      "categories": [
        "image-generator",
        "marketing"
      ],
      "pricing": "Freemium",
      "badge": "Best Typography",
      "featured": false,
      "description": "State-of-the-art AI image generator renowned for rendering legible, artistic typography and graphic designs.",
      "url": "https://ideogram.ai",
      "domain": "ideogram.ai",
      "icon": "🅰️",
      "inner_content": {
        "overview": "Ideogram 2.0 is the premier AI tool for rendering accurate, beautifully stylized text inside images. Perfect for t-shirt graphics, typography posters, logos, and marketing banners.",
        "features": [
          "Best-in-class text rendering with accurate spelling and complex typography styles",
          "Color Palette picker to enforce specific brand hex codes in generations",
          "Magic Prompt enhancer that expands short descriptions into detailed prompts",
          "Generates high-resolution 1:1, 16:9, 9:16, and custom aspect ratios"
        ],
        "useCases": [
          "Designing graphic t-shirts, stickers, and merchandise prints",
          "Creating social media quote cards and promotional ad banners",
          "Generating logos with integrated brand slogans and lettering"
        ],
        "pricingDetails": "Free plan includes 10 free credits daily (40 images/day). Basic plans start at $8/mo."
      }
    },
    {
      "id": "canva-magic",
      "name": "Canva Magic Studio",
      "category": "image-generator",
      "categories": [
        "image-generator",
        "productivity",
        "marketing"
      ],
      "pricing": "Freemium",
      "badge": "Popular",
      "featured": false,
      "description": "All-in-one design suite with Magic Media, Magic Erase, Magic Switch, and instant presentation maker.",
      "url": "https://www.canva.com/magic-home",
      "domain": "canva.com",
      "icon": "🖌️",
      "inner_content": {
        "overview": "Canva Magic Studio brings AI generative tools directly into the beloved Canva drag-and-drop design ecosystem. Create AI images, remove backgrounds, reformat graphics for all social platforms, and draft presentations in one click.",
        "features": [
          "Magic Media: generate AI images, illustrations, and short videos from text",
          "Magic Eraser and Magic Grab: remove unwanted objects and edit photo elements",
          "Magic Switch: convert presentations into blog summaries or social posts automatically",
          "Magic Design: generate tailored social media templates from a single prompt"
        ],
        "useCases": [
          "Social media managers creating weeks of content in minutes",
          "Small business owners designing branded flyers, menus, and business cards",
          "Students and teachers creating engaging slideshow presentations"
        ],
        "pricingDetails": "Generous Free tier with access to core Magic tools. Canva Pro at $12.99/month."
      }
    },
    {
      "id": "clipdrop",
      "name": "Clipdrop by Jasper",
      "category": "image-generator",
      "categories": [
        "image-generator",
        "productivity"
      ],
      "pricing": "Freemium",
      "badge": "Photo Utilities",
      "featured": false,
      "description": "Suite of AI photo tools: background removal, image upscaler, relighting, and text removal.",
      "url": "https://clipdrop.co",
      "domain": "clipdrop.co",
      "icon": "✂️",
      "inner_content": {
        "overview": "Clipdrop is an ecosystem of AI-powered photo editing utilities. From instant background removal to relighting subjects with virtual studio lamps, Clipdrop simplifies professional image post-processing.",
        "features": [
          "Remove Background with surgical edge precision in under 2 seconds",
          "Relight: add customizable 3D light sources and colored studio gels to any photo",
          "Cleanup: erase unwanted powerlines, people, or watermarks seamlessly",
          "Image Upscaler: enhance resolution up to 16x with detail reconstruction"
        ],
        "useCases": [
          "E-commerce product photo cleanup and background replacement",
          "Portrait relighting and professional headshot enhancement",
          "Restoring low-resolution graphics for print and high-res displays"
        ],
        "pricingDetails": "Free tier with unlimited standard-definition exports. Pro at $9/month."
      }
    },
    {
      "id": "craiyon",
      "name": "Craiyon",
      "category": "image-generator",
      "categories": [
        "image-generator"
      ],
      "pricing": "Free",
      "badge": "100% Free",
      "featured": false,
      "description": "Completely free, unlimited AI image generator formerly known as DALL-E Mini with zero sign-up required.",
      "url": "https://www.craiyon.com",
      "domain": "craiyon.com",
      "icon": "🖍️",
      "inner_content": {
        "overview": "Craiyon (formerly DALL-E Mini) is one of the most accessible free AI image generators on the web. It requires no login, no credit card, and allows unlimited image generations across art, drawing, and photo styles.",
        "features": [
          "100% free and unlimited image generation with no mandatory account creation",
          "Choose between Art, Drawing, and Photo style generation engines",
          "Negative prompt support to remove unwanted elements from images",
          "Upscaling and prompt enhancement tools built into the generator"
        ],
        "useCases": [
          "Fun visual brainstorming, memes, and concept art exploration",
          "Students and teachers needing free images for classroom projects",
          "Quick visual mockups with zero sign-up friction"
        ],
        "pricingDetails": "100% Free with ad-supported generation. Paid ad-free tiers available."
      }
    },
    {
      "id": "kling-ai",
      "name": "Kling AI",
      "category": "video-generator",
      "categories": [
        "video-generator"
      ],
      "pricing": "Freemium",
      "badge": "Cinematic AI Video",
      "featured": true,
      "description": "State-of-the-art AI video generation model capable of creating 1080p cinematic scenes with realistic physics.",
      "url": "https://klingai.com",
      "domain": "klingai.com",
      "icon": "🎬",
      "inner_content": {
        "overview": "Kling AI (by Kuaishou) is one of the world's most capable AI video generation models. It produces high-definition 1080p videos up to 2 minutes long with exceptional physical simulation, complex motion, and realistic human expressions.",
        "features": [
          "Generates cinematic 1080p clips up to 2 minutes with fluid 30fps motion",
          "Text-to-Video and Image-to-Video generation modes",
          "Accurate real-world physics simulation (flowing water, gravity, inertia)",
          "Motion Brush and camera trajectory controls (pan, tilt, zoom, dolly)"
        ],
        "useCases": [
          "Creating cinematic B-roll and visual scenes for YouTube and films",
          "Animating still photos and product mockups into video advertisements",
          "Producing viral short-form clips for TikTok, Instagram Reels, and Shorts"
        ],
        "pricingDetails": "Free daily credits upon daily check-in (66 credits/day). Pro subscription available."
      }
    },
    {
      "id": "luma-dream-machine",
      "name": "Luma Dream Machine",
      "category": "video-generator",
      "categories": [
        "video-generator"
      ],
      "pricing": "Freemium",
      "badge": "Top Video Pick",
      "featured": true,
      "description": "High-fidelity AI video model creating realistic 5-second video shots with camera motion and character consistency.",
      "url": "https://lumalabs.ai/dream-machine",
      "domain": "lumalabs.ai",
      "icon": "🎥",
      "inner_content": {
        "overview": "Luma Dream Machine is a next-generation video model built directly on a scalable transformer architecture. It turns text prompts or reference images into fluid, photorealistic 5-second video sequences.",
        "features": [
          "Direct Transformer architecture for high spatial consistency and realism",
          "Keyframe interpolation: seamlessly morph between starting and ending frames",
          "Camera motion control: specify orbit, dolly, zoom, and drone fly-through shots",
          "Fast generation pipeline rendering high-definition video in ~120 seconds"
        ],
        "useCases": [
          "Creating dynamic camera tracking shots for product commercials",
          "Animating concept art and illustrations for cinematic pitch decks",
          "Generating surreal visual effects and seamless video loops"
        ],
        "pricingDetails": "Free tier with 30 free generations per month. Paid tiers start at $29.99/month."
      }
    },
    {
      "id": "runway-gen3",
      "name": "Runway Gen-3 Alpha",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "audio-editing"
      ],
      "pricing": "Freemium",
      "badge": "Industry Standard",
      "featured": true,
      "description": "Pioneering AI video generation platform with Gen-3 Alpha, Motion Brush, lip-sync, and camera controls.",
      "url": "https://runwayml.com",
      "domain": "runwayml.com",
      "icon": "🏃",
      "inner_content": {
        "overview": "Runway is the gold standard in generative video and visual effects. Used by Hollywood studios and indie creators alike, Runway Gen-3 Alpha enables unprecedented control over lighting, camera motion, and character acting.",
        "features": [
          "Gen-3 Alpha text-to-video, image-to-video, and video-to-video engines",
          "Motion Brush: paint specific parts of an image to animate only selected areas",
          "AI Lip Sync: synchronize characters' mouth movements with any audio voice track",
          "Full video editing suite with green screen removal and color grading"
        ],
        "useCases": [
          "Film pre-visualization, concept trailers, and music videos",
          "High-end advertising campaigns and visual effects shots",
          "Animating AI-generated characters with natural speech lip-sync"
        ],
        "pricingDetails": "Free starter tier with 125 one-time credits. Standard plan at $12/month."
      }
    },
    {
      "id": "capcut-ai",
      "name": "CapCut AI",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "audio-editing"
      ],
      "pricing": "Free",
      "badge": "100% Free Mobile/Web",
      "featured": true,
      "description": "ByteDance's all-in-one video editor with AI auto-captions, background removal, text-to-speech, and script-to-video.",
      "url": "https://www.capcut.com",
      "domain": "capcut.com",
      "icon": "✂️",
      "inner_content": {
        "overview": "CapCut is the world's most popular short-form video editor by ByteDance. Packed with cutting-edge AI features, it automates viral auto-captions, background removal, text-to-speech voiceovers, and full script-to-video creation completely free.",
        "features": [
          "Auto-Captions: generates styled, animated subtitles with word-by-word highlights",
          "Script-to-Video: converts a written prompt into a fully edited video with B-roll",
          "AI Background Removal: cut out people from videos without a green screen",
          "Smart voice isolation and automatic filler word (um, uh) removal"
        ],
        "useCases": [
          "Editing viral TikToks, Instagram Reels, and YouTube Shorts in minutes",
          "Adding dynamic, colorful subtitles to podcast clips and talking-head videos",
          "Creating faceless automated videos from text scripts"
        ],
        "pricingDetails": "100% Free with massive feature library. CapCut Pro for premium transitions."
      }
    },
    {
      "id": "opus-clip",
      "name": "Opus Clip",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "productivity"
      ],
      "pricing": "Freemium",
      "badge": "Viral Clips",
      "featured": false,
      "description": "Repurpose long YouTube videos and podcasts into 10 viral short clips with AI virality score and animated subtitles.",
      "url": "https://www.opus.pro",
      "domain": "opus.pro",
      "icon": "✂️",
      "inner_content": {
        "overview": "Opus Clip is an AI video repurposing tool. Paste any long YouTube link, and Opus Clip analyzes the footage, identifies the most engaging hooks, re-frames the speakers into 9:16 vertical video, and adds dynamic animated captions.",
        "features": [
          "AI Virality Score: ranks clip highlights based on engagement potential",
          "Auto-reframe: keeps the active speaker centered in vertical 9:16 aspect ratio",
          "Dynamic karaoke-style animated captions with emoji insertion",
          "B-roll insertion: automatically overlays contextual stock footage"
        ],
        "useCases": [
          "Podcasters turning 1-hour episodes into 15 viral shorts",
          "YouTubers multiplying their reach across TikTok, Instagram, and Shorts",
          "Educators and webinar hosts extracting actionable highlight reels"
        ],
        "pricingDetails": "Free tier with 60 minutes of video processing per month. Pro at $9.50/month."
      }
    },
    {
      "id": "pika-art",
      "name": "Pika Art",
      "category": "video-generator",
      "categories": [
        "video-generator"
      ],
      "pricing": "Freemium",
      "badge": "Pikaffects",
      "featured": false,
      "description": "Idea-to-video platform with Pikaffects (inflate, melt, crush, explode) and realistic camera movement.",
      "url": "https://pika.art",
      "domain": "pika.art",
      "icon": "⚡",
      "inner_content": {
        "overview": "Pika Art (Pika 2.0) is a playful and powerful AI video generation platform. Known for its viral 'Pikaffects' that can melt, inflate, crumble, or explode any object in an image, Pika makes video creation intuitive.",
        "features": [
          "Pikaffects: apply physics transformations (Melt, Inflate, Squish, Explode)",
          "Modify Region: edit specific objects or clothing directly inside video clips",
          "Seamless video expansion: extend video clip duration by 4 seconds iteratively",
          "Sound effects generator: automatically produces synchronized audio for video actions"
        ],
        "useCases": [
          "Creating viral meme videos and creative visual effects on social media",
          "Animating 2D characters, anime art, and digital illustrations",
          "Producing dynamic product advertisements with playful animations"
        ],
        "pricingDetails": "Free plan includes 150 daily initial credits. Standard plan at $8/month."
      }
    },
    {
      "id": "suno-ai",
      "name": "Suno AI",
      "category": "audio-editing",
      "categories": [
        "audio-editing"
      ],
      "pricing": "Freemium",
      "badge": "Top Music Pick",
      "featured": true,
      "description": "Generate full, radio-quality songs with vocals, lyrics, and instruments in any genre from a simple text prompt.",
      "url": "https://suno.com",
      "domain": "suno.com",
      "icon": "🎵",
      "inner_content": {
        "overview": "Suno AI is the world's leading generative music platform. With Suno v3.5 and v4, anyone can create full-length, broadcast-quality songs complete with vocals, instrumentation, and custom lyrics across any musical genre.",
        "features": [
          "Generates full 4-minute songs with studio-grade vocal and instrument fidelity",
          "Supports every musical genre: Pop, Rock, EDM, Hip-Hop, Classical, Jazz, Metal",
          "Custom Mode: input your own original lyrics and specify exact verse/chorus structures",
          "Audio inpainting: replace or extend specific sections of a generated song"
        ],
        "useCases": [
          "Content creators producing royalty-free background soundtracks for videos",
          "Musicians brainstorming melodies, chord progressions, and lyrical hooks",
          "Creating personalized songs for birthdays, celebrations, and brand jingles"
        ],
        "pricingDetails": "Free tier gives 50 credits every day (10 free songs/day). Pro plan at $8/month."
      }
    },
    {
      "id": "udio-ai",
      "name": "Udio AI",
      "category": "audio-editing",
      "categories": [
        "audio-editing"
      ],
      "pricing": "Freemium",
      "badge": "Studio Music",
      "featured": false,
      "description": "AI music creation platform by former DeepMind researchers with pristine vocal dynamics and audio stem separation.",
      "url": "https://www.udio.com",
      "domain": "udio.com",
      "icon": "🎹",
      "inner_content": {
        "overview": "Udio AI was founded by former Google DeepMind researchers to push the boundaries of AI music generation. It is renowned for emotional vocal performances, complex musical arrangements, and audio stem separation.",
        "features": [
          "Udio v1.5 with pristine 48kHz audio fidelity and realistic vocal vibrato",
          "Stem separation: download vocals, drums, bass, and instruments as separate tracks",
          "Audio-to-Audio: upload a rough melody or hum to transform it into a produced song",
          "Advanced extending and remixing controls for precise track arrangement"
        ],
        "useCases": [
          "Producers looking for unique vocal samples, beats, and stem tracks",
          "Soundtrack composers designing ambient gaming and film score cues",
          "Songwriters exploring complex harmonic arrangements and lyrical themes"
        ],
        "pricingDetails": "Free tier includes 10 free daily credits + 100 extra monthly credits."
      }
    },
    {
      "id": "elevenlabs",
      "name": "ElevenLabs",
      "category": "audio-editing",
      "categories": [
        "audio-editing",
        "productivity"
      ],
      "pricing": "Freemium",
      "badge": "Top Voice Pick",
      "featured": true,
      "description": "Industry-leading AI voice generator, voice cloner, and sound effects engine with lifelike human emotion.",
      "url": "https://elevenlabs.io",
      "domain": "elevenlabs.io",
      "icon": "🎙️",
      "inner_content": {
        "overview": "ElevenLabs is the undisputed leader in natural AI speech synthesis. Its neural voice models capture human intonation, whispers, laughter, and pacing across 32 languages, alongside instant voice cloning and sound effect generation.",
        "features": [
          "Ultra-realistic Text-to-Speech with emotional depth and subtle human cadence",
          "Instant Voice Cloning: clone any voice from a 1-minute audio recording",
          "AI Sound Effects: generate ambient room noise, cinematic booms, and Foley SFX",
          "Multilingual Dubbing: automatically translate video speech while keeping the original voice"
        ],
        "useCases": [
          "Audiobook narration, podcast voiceovers, and YouTube video narration",
          "Video game and animation character voice acting across 30+ languages",
          "Localizing corporate training videos and international marketing ads"
        ],
        "pricingDetails": "Free tier with 10,000 characters/month and custom voices. Starter plan at $5/mo."
      }
    },
    {
      "id": "adobe-podcast",
      "name": "Adobe Podcast AI",
      "category": "audio-editing",
      "categories": [
        "audio-editing"
      ],
      "pricing": "Free",
      "badge": "100% Free Studio Sound",
      "featured": true,
      "description": "Free AI audio tool that transforms cheap microphone recordings into professional soundproof studio audio.",
      "url": "https://podcast.adobe.com/enhance",
      "domain": "adobe.com",
      "icon": "🎧",
      "inner_content": {
        "overview": "Adobe Podcast Enhance Speech uses deep learning to eliminate background noise, room echo, and muffling from any voice recording, making it sound like it was recorded in a professional soundproof broadcast studio.",
        "features": [
          "Enhance Speech: removes heavy background chatter, wind, and room reverb in 1 click",
          "Mic Check: analyze your microphone setup and distance to optimize acoustics",
          "Preserves natural vocal warmth while removing harsh plosives and sibilance",
          "Simple web upload with instant before/after audio comparison"
        ],
        "useCases": [
          "Podcasters and remote interviewers fixing poor guest microphone audio",
          "YouTubers cleaning up outdoor vlogs and room echo without expensive mics",
          "Students and teachers clarifying recorded lectures and Zoom calls"
        ],
        "pricingDetails": "100% Free for standard audio enhancement up to 1 hour/day."
      }
    },
    {
      "id": "whisper-openai",
      "name": "OpenAI Whisper",
      "category": "audio-editing",
      "categories": [
        "audio-editing",
        "developer-tools"
      ],
      "pricing": "Free",
      "badge": "100% Free / Open Source",
      "featured": true,
      "description": "Open-source automatic speech recognition (ASR) system with near-human accuracy across 99+ languages.",
      "url": "https://github.com/openai/whisper",
      "domain": "openai.com",
      "icon": "👂",
      "inner_content": {
        "overview": "OpenAI Whisper is a state-of-the-art open-source speech recognition model trained on 680,000 hours of multilingual audio. It transcribes accents, background noise, and technical jargon with near-human precision.",
        "features": [
          "Supports speech-to-text transcription across 99+ languages",
          "Automatic language identification and English translation",
          "Robust to heavy background noise, technical acronyms, and regional accents",
          "100% open source and downloadable for free local offline execution"
        ],
        "useCases": [
          "Transcribing interviews, meeting recordings, and lectures with zero API costs",
          "Generating accurate `.srt` and `.vtt` subtitles for videos and podcasts",
          "Building local offline voice-controlled software and dictation tools"
        ],
        "pricingDetails": "100% Free and open source (MIT license)."
      }
    },
    {
      "id": "cleanvoice-ai",
      "name": "Cleanvoice AI",
      "category": "audio-editing",
      "categories": [
        "audio-editing",
        "productivity"
      ],
      "pricing": "Freemium",
      "badge": "Filler Remover",
      "featured": false,
      "description": "Automatically remove filler words (ums, ahs), stuttering, mouth clicks, and dead silences from audio.",
      "url": "https://cleanvoice.ai",
      "domain": "cleanvoice.ai",
      "icon": "🎙️",
      "inner_content": {
        "overview": "Cleanvoice is an artificial intelligence tool that removes filler sounds (um, uh, like), mouth clicks, stuttering, and awkward silences from your podcast episodes and audio recordings automatically.",
        "features": [
          "Detects and removes filler words in multiple languages and accents",
          "Eliminates lip smacks, saliva clicks, and heavy breathing sounds",
          "Timeline marker export: load edit points directly into Audacity, Premiere, or Reaper",
          "Auto-eq and sound level balancing across multiple interview hosts"
        ],
        "useCases": [
          "Podcasters cutting editing time from 2 hours down to 2 minutes",
          "Audiobook narrators cleaning up mouth noises and breath gasps",
          "Course creators making recorded lectures sound concise and professional"
        ],
        "pricingDetails": "Free trial with 30 minutes of audio processing. Pay-as-you-go available."
      }
    },
    {
      "id": "gamma-app",
      "name": "Gamma App",
      "category": "productivity",
      "categories": [
        "productivity",
        "writing"
      ],
      "pricing": "Freemium",
      "badge": "Top Presentations",
      "featured": true,
      "description": "Generate beautiful, interactive presentations, documents, and web pages from a simple text prompt in seconds.",
      "url": "https://gamma.app",
      "domain": "gamma.app",
      "icon": "📊",
      "inner_content": {
        "overview": "Gamma App is an AI presentation and document builder. Instead of spending hours aligning PowerPoint shapes, simply enter your topic or outline, and Gamma formats a polished, interactive slide deck or webpage.",
        "features": [
          "One-click presentation, document, and webpage generator from text prompts",
          "Flexible card-based layout system that looks modern on mobile and desktop",
          "Embed interactive widgets, forms, YouTube videos, and live websites",
          "Export to PowerPoint (.pptx), PDF, or share via a clean responsive link"
        ],
        "useCases": [
          "Startup founders creating investor pitch decks in under 10 minutes",
          "Professionals preparing client proposals, sales decks, and quarterly reviews",
          "Educators drafting engaging interactive classroom lesson modules"
        ],
        "pricingDetails": "Generous 400 free credits on sign-up + referral credits. Plus at $8/mo."
      }
    },
    {
      "id": "fathom-ai",
      "name": "Fathom AI Notetaker",
      "category": "productivity",
      "categories": [
        "productivity"
      ],
      "pricing": "Free",
      "badge": "100% Free for Individuals",
      "featured": true,
      "description": "Free AI meeting assistant that records, transcribes, highlights, and summarizes Zoom, Teams, and Google Meet calls.",
      "url": "https://fathom.video",
      "domain": "fathom.video",
      "icon": "📝",
      "inner_content": {
        "overview": "Fathom AI is a 100% free meeting assistant for Zoom, Microsoft Teams, and Google Meet. It records your meetings, produces accurate real-time transcripts, and generates structured action items automatically.",
        "features": [
          "100% free unlimited recording and transcription with zero time caps",
          "Instant AI meeting summaries and structured action items delivered right after calls",
          "1-click highlight button to bookmark key moments during live conversations",
          "Syncs meeting notes automatically to Notion, Slack, Google Docs, and HubSpot"
        ],
        "useCases": [
          "Remote teams eliminating manual meeting note-taking",
          "Consultants and freelancers capturing exact client requirements during calls",
          "Hiring managers summarizing candidate interviews with timestamped quotes"
        ],
        "pricingDetails": "100% Free with unlimited recording for individuals. Team plans available."
      }
    },
    {
      "id": "harpa-ai",
      "name": "HARPA AI",
      "category": "productivity",
      "categories": [
        "productivity",
        "developer-tools"
      ],
      "pricing": "Free",
      "badge": "100% Free Chrome Extension",
      "featured": true,
      "description": "Hybrid AI browser extension that automates web tasks, monitors price drops, and summarizes YouTube videos.",
      "url": "https://harpa.ai",
      "domain": "harpa.ai",
      "icon": "🌐",
      "inner_content": {
        "overview": "HARPA AI is a powerful Chrome extension that acts as your personal web copilot. It brings ChatGPT, Claude, and web automation directly to any tab, allowing you to monitor competitor price drops, extract page data, and summarize articles.",
        "features": [
          "Page monitoring: track price drops, restocks, and page changes on autopilot",
          "100+ built-in page commands: summarize articles, write replies, extract tables",
          "YouTube video summarizer with timestamped key takeaways",
          "Connects to your free ChatGPT or Claude web session with zero API costs"
        ],
        "useCases": [
          "Automating repetitive web data extraction and competitor price tracking",
          "Summarizing lengthy articles, Reddit threads, and research papers on any tab",
          "Writing contextual email replies and LinkedIn comments in 1 click"
        ],
        "pricingDetails": "100% Free Chrome extension (bring your own free ChatGPT/Claude account)."
      }
    },
    {
      "id": "make-ai",
      "name": "Make.com AI",
      "category": "productivity",
      "categories": [
        "productivity",
        "developer-tools"
      ],
      "pricing": "Freemium",
      "badge": "Visual Automation",
      "featured": false,
      "description": "Visual workflow automation platform to connect thousands of apps and integrate AI models with drag-and-drop.",
      "url": "https://www.make.com",
      "domain": "make.com",
      "icon": "🔄",
      "inner_content": {
        "overview": "Make (formerly Integromat) is a visual workflow automation platform. Build multi-step workflows connecting OpenAI, Claude, Google Sheets, Slack, Supabase, and 1,800+ apps without writing a single line of code.",
        "features": [
          "Drag-and-drop visual workflow canvas with unlimited branching logic",
          "Native modules for OpenAI, Anthropic, Gemini, Mistral, and Pinecone",
          "Real-time execution monitoring, error handling, and webhook triggers",
          "Pre-built automation templates for lead enrichment, content publishing, and CRM"
        ],
        "useCases": [
          "Automating AI content publishing from Google Sheets to WordPress and social media",
          "Routing and summarizing inbound customer support emails automatically",
          "Enriching sales leads with AI research before syncing to CRM databases"
        ],
        "pricingDetails": "Free plan includes 1,000 operations/month. Core plan starts at $9/month."
      }
    },
    {
      "id": "taskade-ai",
      "name": "Taskade AI",
      "category": "productivity",
      "categories": [
        "productivity"
      ],
      "pricing": "Freemium",
      "badge": "AI Team Workspace",
      "featured": false,
      "description": "Collaborative workspace for tasks, mind maps, and autonomous AI agents that work for your team.",
      "url": "https://www.taskade.com",
      "domain": "taskade.com",
      "icon": "⚡",
      "inner_content": {
        "overview": "Taskade is an AI-powered workspace combining project management, mind maps, notes, and custom autonomous AI agents. Teams can build specialized agents for research, marketing, and task execution.",
        "features": [
          "Custom AI Agents: build specialized virtual team members with custom knowledge",
          "Dynamic views: switch instantly between Kanban boards, mind maps, and lists",
          "AI Workflow Generator: turns high-level project goals into step-by-step checklists",
          "Real-time multi-user team collaboration and video chat built-in"
        ],
        "useCases": [
          "Managing team sprints and transforming ideas into actionable checklists",
          "Deploying autonomous AI agents to research topics and draft reports",
          "Creating collaborative mind maps and project documentation"
        ],
        "pricingDetails": "Generous Free tier with unlimited tasks and AI credits. Starter at $4/mo."
      }
    },
    {
      "id": "scribe-ai",
      "name": "Scribe AI",
      "category": "productivity",
      "categories": [
        "productivity",
        "education"
      ],
      "pricing": "Freemium",
      "badge": "Auto SOPs",
      "featured": false,
      "description": "Automatically capture your screen clicks and turn any process into a visual step-by-step SOP guide in seconds.",
      "url": "https://scribehow.com",
      "domain": "scribehow.com",
      "icon": "📜",
      "inner_content": {
        "overview": "Scribe turns any digital process into a visual, step-by-step guide with screenshots and annotated clicks. Simply hit record, complete your task, and Scribe writes the full Standard Operating Procedure (SOP).",
        "features": [
          "Automatic screenshot capture with annotated click highlights",
          "AI text generator that writes clear instructions for every step",
          "Export guides to PDF, HTML embed, Markdown, or share via link",
          "Redaction tools to blur sensitive personal information automatically"
        ],
        "useCases": [
          "Onboarding new team members with clear software walkthroughs",
          "Customer support teams creating visual help center articles",
          "Freelancers handing off completed projects and workflows to clients"
        ],
        "pricingDetails": "Free plan includes unlimited web guides. Pro plan at $12/month for desktop app."
      }
    },
    {
      "id": "magical-ai",
      "name": "Magical AI",
      "category": "productivity",
      "categories": [
        "productivity"
      ],
      "pricing": "Free",
      "badge": "100% Free Autofill",
      "featured": false,
      "description": "Free AI text expander and web autofill extension that automates repetitive typing and data entry across tabs.",
      "url": "https://www.getmagical.com",
      "domain": "getmagical.com",
      "icon": "🪄",
      "inner_content": {
        "overview": "Magical is a free productivity extension that eliminates repetitive typing and copy-pasting. It uses AI to write personalized emails, expand keyboard shortcuts, and transfer data between web tabs without APIs.",
        "features": [
          "AI Text Generator: drafts customized emails and replies in 1 click",
          "Keyboard shortcut text expansion for frequently used snippets and links",
          "Web data transfer: automatically pull data from LinkedIn or CRM into Google Sheets",
          "Zero integration setup: works out of the box on any webpage"
        ],
        "useCases": [
          "Recruiters sending personalized candidate outreach on LinkedIn",
          "Customer support agents speeding up ticket resolution with smart snippets",
          "Sales reps transferring lead info to spreadsheets in one click"
        ],
        "pricingDetails": "100% Free for individuals with generous monthly actions."
      }
    },
    {
      "id": "notebooklm",
      "name": "NotebookLM",
      "category": "research",
      "categories": [
        "research",
        "education",
        "audio-editing"
      ],
      "pricing": "Free",
      "badge": "100% Free by Google",
      "featured": true,
      "description": "Google's free personalized AI research assistant that turns notes and PDFs into deep insights and Audio Overviews.",
      "url": "https://notebooklm.google.com",
      "domain": "notebooklm.google.com",
      "icon": "📓",
      "inner_content": {
        "overview": "NotebookLM by Google is a virtual research assistant grounded entirely in your own uploaded source material (PDFs, Google Docs, YouTube videos, web links). It features the viral 'Audio Overview' that turns your notes into an engaging two-host podcast.",
        "features": [
          "Grounds all answers exclusively in your uploaded source documents with citations",
          "Audio Overview: generates lifelike, two-host podcast discussions of your notes",
          "Supports massive uploads: up to 50 sources per notebook (500,000 words each)",
          "Creates instant study guides, FAQ lists, timelines, and briefing docs"
        ],
        "useCases": [
          "Students synthesizing semester lecture notes and textbook chapters into podcasts",
          "Researchers analyzing dozens of scientific papers without hallucinated facts",
          "Executives digesting dense annual reports and competitive intelligence"
        ],
        "pricingDetails": "100% Free provided by Google with your Google account."
      }
    },
    {
      "id": "consensus-ai",
      "name": "Consensus AI",
      "category": "research",
      "categories": [
        "research",
        "education"
      ],
      "pricing": "Freemium",
      "badge": "Top Science Pick",
      "featured": true,
      "description": "AI academic search engine that extracts insights and synthesizes consensus directly from 200M+ peer-reviewed papers.",
      "url": "https://consensus.app",
      "domain": "consensus.app",
      "icon": "🔬",
      "inner_content": {
        "overview": "Consensus is an academic search engine that uses AI to extract findings directly from peer-reviewed scientific research. Ask any scientific question, and Consensus provides a 'Consensus Meter' summarizing scientific agreement.",
        "features": [
          "Indexes over 200 million peer-reviewed academic papers across all fields",
          "Consensus Meter: visual breakdown of whether scientific papers agree, disagree, or are neutral",
          "Direct citations with quality indicators (sample size, methodology, study type)",
          "Synthesize summaries of top 10 relevant studies in one click"
        ],
        "useCases": [
          "Health, wellness, and medical fact-checking backed by clinical trials",
          "Students and academic researchers finding supporting citations for literature reviews",
          "Journalists verifying scientific claims against peer-reviewed consensus"
        ],
        "pricingDetails": "Free tier with unlimited searches and Consensus summaries. Premium at $8.99/mo."
      }
    },
    {
      "id": "elicit-ai",
      "name": "Elicit AI",
      "category": "research",
      "categories": [
        "research",
        "education"
      ],
      "pricing": "Freemium",
      "badge": "Literature Review",
      "featured": false,
      "description": "AI research assistant that automates literature reviews, extracts data from 125M+ papers, and finds answers.",
      "url": "https://elicit.com",
      "domain": "elicit.com",
      "icon": "📚",
      "inner_content": {
        "overview": "Elicit uses language models to automate research workflows. It searches through 125 million academic papers, extracts structured data into custom comparison tables, and synthesizes key takeaways for literature reviews.",
        "features": [
          "Finds relevant papers even when keywords don't match exactly",
          "Extracts specific data columns (methodology, population, results) into tables",
          "Synthesizes research answers with direct references to paper paragraphs",
          "Upload your own PDFs to extract structured findings in bulk"
        ],
        "useCases": [
          "Graduate students and professors conducting systematic literature reviews",
          "Biotech and medical researchers screening clinical trial parameters",
          "Data analysts compiling scientific benchmarks across multiple studies"
        ],
        "pricingDetails": "Free tier with 5,000 initial credits. Plus plan at $10/month."
      }
    },
    {
      "id": "chatpdf",
      "name": "ChatPDF",
      "category": "research",
      "categories": [
        "research",
        "education"
      ],
      "pricing": "Freemium",
      "badge": "PDF Reader",
      "featured": false,
      "description": "Fast AI PDF reader to chat with any book, scientific paper, or manual with instant page references.",
      "url": "https://www.chatpdf.com",
      "domain": "chatpdf.com",
      "icon": "📄",
      "inner_content": {
        "overview": "ChatPDF allows you to interact with any PDF document as if it were a knowledgeable human. Upload research papers, financial reports, textbooks, or user manuals, and ask questions with clickable page citations.",
        "features": [
          "Upload any PDF and get an instant summary with suggested follow-up questions",
          "Clickable page source references verify every single answer",
          "Multilingual capability: ask in any language regardless of the document's language",
          "No registration required for quick document analysis"
        ],
        "useCases": [
          "Students studying textbook chapters and preparing for exams",
          "Lawyers and consultants reviewing long contracts and compliance filings",
          "Engineers quickly looking up specifications inside 500-page equipment manuals"
        ],
        "pricingDetails": "Free plan includes 2 PDFs daily (up to 120 pages each). Plus at $5/month."
      }
    },
    {
      "id": "pdfgear-ai",
      "name": "PDFgear AI",
      "category": "research",
      "categories": [
        "research",
        "productivity"
      ],
      "pricing": "Free",
      "badge": "100% Free Desktop/Mobile",
      "featured": true,
      "description": "Completely free, full-featured PDF editor and AI chatbot for Windows, Mac, and iOS with zero paywalls.",
      "url": "https://www.pdfgear.com",
      "domain": "pdfgear.com",
      "icon": "📑",
      "inner_content": {
        "overview": "PDFgear is a 100% free PDF reader and editor that integrates a powerful AI copilot. Unlike web-based tools with page limits, PDFgear runs locally on your PC or Mac to read, edit, convert, and chat with PDFs without fees.",
        "features": [
          "100% Free with zero page limits, watermarks, or subscription paywalls",
          "Integrated AI Copilot to summarize, extract data, and query large documents",
          "Full PDF editing suite: edit text, convert to Word, merge, split, and sign",
          "Available on Windows, macOS, iOS, and iPadOS"
        ],
        "useCases": [
          "Reading and querying massive 1,000+ page books and legal contracts",
          "Editing and signing PDF documents without paying for Adobe Acrobat",
          "Students extracting study guides and summaries completely free"
        ],
        "pricingDetails": "100% Free with all features included."
      }
    },
    {
      "id": "wolfram-alpha",
      "name": "Wolfram Alpha AI",
      "category": "education",
      "categories": [
        "education",
        "research"
      ],
      "pricing": "Free",
      "badge": "Computational Engine",
      "featured": true,
      "description": "Computational intelligence engine providing step-by-step math, physics, chemistry, and science solutions.",
      "url": "https://www.wolframalpha.com",
      "domain": "wolframalpha.com",
      "icon": "📐",
      "inner_content": {
        "overview": "Wolfram Alpha is the definitive computational knowledge engine. It uses curated algorithms and factual datasets to compute answers, plot graphs, and solve complex mathematical equations with exact step-by-step derivations.",
        "features": [
          "Computes exact solutions for calculus, algebra, statistics, and discrete math",
          "Step-by-step solution breakdowns for learning and homework verification",
          "Vast scientific knowledge base covering chemistry, physics, astronomy, and geography",
          "Natural language query parser converting math words into exact formulas"
        ],
        "useCases": [
          "STEM students solving complex calculus, differential equations, and physics problems",
          "Engineers and researchers verifying exact mathematical calculations",
          "Visualizing 2D and 3D mathematical functions and data distributions"
        ],
        "pricingDetails": "Free for standard computational queries. Pro tier for guided step-by-step."
      }
    },
    {
      "id": "khanmigo",
      "name": "Khanmigo by Khan Academy",
      "category": "education",
      "categories": [
        "education"
      ],
      "pricing": "Freemium",
      "badge": "Socratic Tutor",
      "featured": false,
      "description": "Khan Academy's AI guide that uses Socratic questioning to help students learn without giving away answers.",
      "url": "https://www.khanacademy.org/khanmigo",
      "domain": "khanacademy.org",
      "icon": "🎓",
      "inner_content": {
        "overview": "Khanmigo is an AI tutor developed by Khan Academy. Rather than simply giving students direct answers, Khanmigo uses the Socratic method to guide learners step-by-step through math, science, humanities, and coding challenges.",
        "features": [
          "Socratic tutoring method: prompts critical thinking instead of spoiling answers",
          "Deep alignment with standard K-12 and AP course curriculums",
          "Interactive coding tutor for learning JavaScript and Python",
          "Teacher tools: automatically creates lesson plans and student progress rubrics"
        ],
        "useCases": [
          "Students receiving personalized, patient 1-on-1 tutoring at their own pace",
          "Parents guiding children through difficult math and science homework",
          "Educators drafting customized classroom activities and discussion prompts"
        ],
        "pricingDetails": "Free for verified US teachers; low-cost monthly donation for learners."
      }
    },
    {
      "id": "photomath",
      "name": "Photomath by Google",
      "category": "education",
      "categories": [
        "education"
      ],
      "pricing": "Free",
      "badge": "100% Free Camera Math",
      "featured": false,
      "description": "Scan handwritten math problems with your camera to get instant step-by-step explanations and graphs.",
      "url": "https://photomath.com",
      "domain": "photomath.com",
      "icon": "📷",
      "inner_content": {
        "overview": "Photomath (acquired by Google) is the world's most downloaded math learning app. Simply snap a photo of any printed or handwritten math problem, and Photomath breaks down the solution with clear, step-by-step explanations.",
        "features": [
          "Instant camera scanning for both printed textbooks and messy handwriting",
          "Step-by-step solution breakdowns explaining the 'why' behind each mathematical step",
          "Interactive 2D graphing calculators and animated tutorial cards",
          "Covers arithmetic, algebra, trigonometry, calculus, and statistics"
        ],
        "useCases": [
          "Students checking homework answers and understanding missed steps",
          "Parents helping their children with modern algebra and calculus methods",
          "Self-learners brushing up on math fundamentals visually"
        ],
        "pricingDetails": "100% Free core scanning and step-by-step solutions on iOS and Android."
      }
    },
    {
      "id": "quizlet-qchat",
      "name": "Quizlet Q-Chat",
      "category": "education",
      "categories": [
        "education"
      ],
      "pricing": "Freemium",
      "badge": "Study Coach",
      "featured": false,
      "description": "AI study coach that quizzes you on your flashcards, tests your understanding, and tells fun stories to help you memorize.",
      "url": "https://quizlet.com",
      "domain": "quizlet.com",
      "icon": "🃏",
      "inner_content": {
        "overview": "Quizlet Q-Chat is an AI study coach built on OpenAI technology. It interacts with your Quizlet flashcard sets, challenging you with adaptive quiz questions and real-world scenarios to deepen active recall.",
        "features": [
          "Interactive Socratic coaching based directly on your study flashcards",
          "Adaptive difficulty: tests weaker concepts more frequently for spaced repetition",
          "Generates practice tests, multiple-choice questions, and written quizzes",
          "Supports millions of existing user-created study decks worldwide"
        ],
        "useCases": [
          "High school and college students prepping for midterms, finals, and SATs",
          "Medical and law students memorizing specialized terminology and case law",
          "Language learners practicing vocabulary in conversational sentences"
        ],
        "pricingDetails": "Free tier with basic flashcards and sample AI sessions. Quizlet Plus for unlimited."
      }
    },
    {
      "id": "tutor-ai",
      "name": "TutorAI",
      "category": "education",
      "categories": [
        "education"
      ],
      "pricing": "Free",
      "badge": "100% Free Course Maker",
      "featured": false,
      "description": "Type in any topic you want to learn, and TutorAI generates a complete modular course with lessons and quizzes.",
      "url": "https://www.tutorai.me",
      "domain": "tutorai.me",
      "icon": "👨‍🏫",
      "inner_content": {
        "overview": "TutorAI is an AI-powered educational platform that builds custom curriculum courses on demand. Enter any subject (e.g. 'Quantum Computing', 'Roman Architecture'), and TutorAI structures complete modules with interactive lessons.",
        "features": [
          "Instant course generation: breaks any topic into structured modules and lessons",
          "Interactive quizzes after every module to test retention",
          "'Ask AI' button inside every lesson for deeper explanations and analogies",
          "Track learning progress across multiple subject tracks"
        ],
        "useCases": [
          "Curious self-learners exploring new subjects from scratch",
          "Students needing structured introductory primers before advanced courses",
          "Professionals upskilling in AI, finance, history, or programming"
        ],
        "pricingDetails": "100% Free for core course generation and interactive lessons."
      }
    },
    {
      "id": "cursor",
      "name": "Cursor",
      "category": "developer-tools",
      "categories": [
        "developer-tools",
        "productivity"
      ],
      "pricing": "Freemium",
      "badge": "Top Pick",
      "featured": true,
      "description": "AI-first code editor fork of VS Code with codebase indexing, multi-file edits, and instant debugging.",
      "url": "https://www.cursor.com",
      "domain": "cursor.com",
      "icon": "⚡",
      "inner_content": {
        "overview": "Cursor is the world's most popular AI-native code editor. Built as a seamless fork of VS Code, it lets developers index their entire repository, make multi-file edits via natural language, and use Claude or GPT-4o inline.",
        "features": [
          "Full codebase semantic indexing with `@codebase` natural language querying",
          "Composer multi-file generation and editing across entire repositories",
          "Instant AI tab autocomplete with intelligent cursor jump prediction",
          "Direct terminal command generation and automated error fixing"
        ],
        "useCases": [
          "Building full-stack web and mobile apps at 5x speed",
          "Refactoring legacy codebases across dozens of connected files",
          "Debugging complex runtime errors and writing automated test suites"
        ],
        "pricingDetails": "Free tier with 2,000 completions and 50 slow premium requests. Pro at $20/month."
      }
    },
    {
      "id": "github-copilot",
      "name": "GitHub Copilot",
      "category": "developer-tools",
      "categories": [
        "developer-tools"
      ],
      "pricing": "Freemium",
      "badge": "Free for Students & OS",
      "featured": false,
      "description": "GitHub's AI pair programmer integrated across VS Code, Visual Studio, and JetBrains with multi-model choice.",
      "url": "https://github.com/features/copilot",
      "domain": "github.com",
      "icon": "🐙",
      "inner_content": {
        "overview": "GitHub Copilot is the pioneer AI pair programming extension. Built into GitHub and top IDEs, it offers multi-model switching, automated pull request reviews, and CLI command suggestions.",
        "features": [
          "Real-time code completions and full multi-line suggestions in your editor",
          "Copilot Chat with workspace-aware context and model selector",
          "Copilot CLI to turn natural language into shell commands",
          "Free for verified students, teachers, and popular open-source maintainers"
        ],
        "useCases": [
          "Writing repetitive boilerplate code, unit tests, and regular expressions",
          "Navigating unfamiliar programming languages and syntax patterns",
          "Automating code reviews and pull request summaries on GitHub"
        ],
        "pricingDetails": "Free for verified students & open-source maintainers. $10/month individual plan."
      }
    },
    {
      "id": "v0-vercel",
      "name": "v0 by Vercel",
      "category": "developer-tools",
      "categories": [
        "developer-tools",
        "productivity"
      ],
      "pricing": "Freemium",
      "badge": "Trending",
      "featured": true,
      "description": "Generative UI system by Vercel that produces production-ready React, Tailwind CSS, and Next.js components.",
      "url": "https://v0.dev",
      "domain": "v0.dev",
      "icon": "▲",
      "inner_content": {
        "overview": "v0 by Vercel is a generative AI frontend tool that turns natural language prompts and image mockups into clean, production-ready React, Next.js, and Tailwind CSS code with instant live interactive previews.",
        "features": [
          "Generates responsive React code with Tailwind CSS and shadcn/ui components",
          "Image-to-code: upload Figma screenshots or UI sketches to convert into code",
          "Direct one-click deployment to Vercel and npm component export",
          "Iterative chat prompting to refine UI elements and design tokens"
        ],
        "useCases": [
          "Rapid prototyping of SaaS landing pages and dashboards",
          "Converting design mockups and screenshots into clean React code",
          "Generating bespoke UI components for modern Next.js applications"
        ],
        "pricingDetails": "Free tier with daily renewable credits. Premium plans for team collaboration."
      }
    },
    {
      "id": "ollama",
      "name": "Ollama",
      "category": "developer-tools",
      "categories": [
        "developer-tools",
        "chatbot"
      ],
      "pricing": "Free",
      "badge": "100% Free / Open Source",
      "featured": true,
      "description": "Run open-source LLMs locally on your Mac, Windows, or Linux machine with a single terminal command.",
      "url": "https://ollama.com",
      "domain": "ollama.com",
      "icon": "🦙",
      "inner_content": {
        "overview": "Ollama is the premier open-source tool for running large language models locally on your machine. With support for DeepSeek R1, Llama 3.3, Mistral, Qwen, and Gemma, Ollama gives you total data privacy and zero API costs.",
        "features": [
          "Run top models locally: `ollama run deepseek-r1` or `ollama run llama3.3`",
          "Local REST API compatible with OpenAI SDK formats for easy integration",
          "Zero data leaves your computer — 100% offline and private",
          "Supports GPU acceleration across Apple Silicon, NVIDIA CUDA, and AMD ROCm"
        ],
        "useCases": [
          "Privacy-sensitive coding and confidential corporate data processing",
          "Offline AI assistant for developers and researchers with no internet",
          "Local backend engine for Obsidian, Cursor, and code plugins"
        ],
        "pricingDetails": "100% Free and open source software (MIT license)."
      }
    },
    {
      "id": "bolt-new",
      "name": "Bolt.new",
      "category": "developer-tools",
      "categories": [
        "developer-tools",
        "productivity"
      ],
      "pricing": "Freemium",
      "badge": "In-Browser Dev",
      "featured": false,
      "description": "In-browser AI web development environment powered by WebContainers to build and run fullstack apps.",
      "url": "https://bolt.new",
      "domain": "bolt.new",
      "icon": "⚡",
      "inner_content": {
        "overview": "Bolt.new by StackBlitz is an AI-powered development environment that runs entirely inside your browser using WebContainers. It can install npm packages, run Node.js servers, and build fullstack web applications without local setup.",
        "features": [
          "Full in-browser Node.js runtime and terminal execution",
          "Installs any npm package and runs modern full-stack frameworks (Vite, Next, Remix)",
          "Interactive side-by-side code editor and live browser preview",
          "One-click deployment to Netlify or GitHub repository sync"
        ],
        "useCases": [
          "Building and testing full-stack web applications without local dev setup",
          "Rapid prototyping of web apps with live backend servers and APIs",
          "Sharing reproducible interactive software demos with a single URL"
        ],
        "pricingDetails": "Free tier with daily token allowance. Pro plans for higher token limits."
      }
    },
    {
      "id": "phind",
      "name": "Phind",
      "category": "developer-tools",
      "categories": [
        "developer-tools",
        "research"
      ],
      "pricing": "Freemium",
      "badge": "Dev Search",
      "featured": false,
      "description": "Intelligent search engine for developers with frontier model reasoning and live code execution.",
      "url": "https://www.phind.com",
      "domain": "phind.com",
      "icon": "🔎",
      "inner_content": {
        "overview": "Phind is an AI search engine built specifically for programmers. It combines high-speed web search with customized coding LLMs to provide comprehensive, code-heavy answers with technical explanations.",
        "features": [
          "Fast technical search powered by specialized Phind-70B model",
          "Web search integration providing up-to-date documentation links",
          "Pair programming mode with multi-file code editing capabilities",
          "VS Code extension for in-editor context querying"
        ],
        "useCases": [
          "Solving complex coding problems and architectural decisions",
          "Exploring new API libraries and framework updates",
          "Pair programming directly inside VS Code"
        ],
        "pricingDetails": "Free tier with unlimited standard searches. Phind Pro for 500+ daily GPT-4o queries."
      }
    },
    {
      "id": "predis-ai",
      "name": "Predis.ai",
      "category": "marketing",
      "categories": [
        "marketing",
        "image-generator",
        "video-generator"
      ],
      "pricing": "Freemium",
      "badge": "Social AI",
      "featured": false,
      "description": "AI social media marketing platform that turns a text prompt into ready-to-publish reels, carousels, and captions.",
      "url": "https://predis.ai",
      "domain": "predis.ai",
      "icon": "📱",
      "inner_content": {
        "overview": "Predis.ai is an all-in-one AI social media generator. Give it a simple text prompt or website URL, and Predis generates branded video reels, multi-slide carousels, captions, and trending hashtags in your brand kit.",
        "features": [
          "Generates complete Instagram Reels, TikToks, and YouTube Shorts with voiceover",
          "Multi-slide carousel post generator with customizable design templates",
          "Brand Kit integration: automatically applies your company fonts and colors",
          "Competitor analysis engine to benchmark your niche engagement"
        ],
        "useCases": [
          "E-commerce brands generating dozens of product showcase videos",
          "Social media agencies automating client post creation calendars",
          "Solopreneurs maintaining a consistent multi-channel social presence"
        ],
        "pricingDetails": "Free plan includes 15 AI-generated posts per month. Solo plan at $29/mo."
      }
    },
    {
      "id": "taplio",
      "name": "Taplio",
      "category": "marketing",
      "categories": [
        "marketing",
        "writing"
      ],
      "pricing": "Freemium",
      "badge": "LinkedIn Growth",
      "featured": false,
      "description": "AI-powered LinkedIn growth assistant for generating viral posts, scheduling content, and finding leads.",
      "url": "https://taplio.com",
      "domain": "taplio.com",
      "icon": "💼",
      "inner_content": {
        "overview": "Taplio is an AI LinkedIn growth platform used by top founders and executives. It analyzes millions of high-performing LinkedIn posts to suggest viral post ideas, write engaging drafts, and manage scheduling.",
        "features": [
          "AI post generator trained on millions of viral LinkedIn hooks and formats",
          "Viral content library: discover what is trending in your specific industry",
          "Carousel creator: turns articles or tweets into downloadable LinkedIn PDF carousels",
          "Relationship builder and automated lead engagement tracking"
        ],
        "useCases": [
          "Founders building personal brands and thought leadership on LinkedIn",
          "B2B marketers driving organic inbound customer leads",
          "Consultants and recruiters expanding professional networks"
        ],
        "pricingDetails": "Free trial available with sample AI generations. Starter plan at $39/mo."
      }
    },
    {
      "id": "adcreative-ai",
      "name": "AdCreative.ai",
      "category": "marketing",
      "categories": [
        "marketing",
        "image-generator"
      ],
      "pricing": "Freemium",
      "badge": "High Conversion Ads",
      "featured": false,
      "description": "Generate high-converting conversion ad banners and texts using trained performance advertising AI models.",
      "url": "https://www.adcreative.ai",
      "domain": "adcreative.ai",
      "icon": "🎯",
      "inner_content": {
        "overview": "AdCreative.ai uses machine learning trained on millions of high-converting digital advertising campaigns. Upload your logo and product image to generate hundreds of conversion-optimized ad banners in seconds.",
        "features": [
          "Generates hundreds of ad creatives across all formats (1:1, 9:16, 16:9, 1.91:1)",
          "AI Conversion Score: rates each creative's predicted click-through rate",
          "Generates persuasive ad copy headlines for Facebook, Google, and LinkedIn",
          "Direct integrations with Meta Ads, Google Ads, and Pinterest Ads"
        ],
        "useCases": [
          "E-commerce stores creating hundreds of creative variations for A/B testing",
          "Performance marketing agencies scaling client ad spend profitably",
          "SaaS startups designing conversion-focused Google and Facebook ads"
        ],
        "pricingDetails": "Free trial with 10 free ad creative downloads. Starter at $29/mo."
      }
    }
  ]
};

if (typeof module !== 'undefined') {
  module.exports = AI_TOOLS_DATA;
}
