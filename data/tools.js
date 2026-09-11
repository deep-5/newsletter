/**
 * AIRA Newsletter - AI Tools & Categories Directory Dataset
 * Official Logos & Comprehensive Collection of 277+ AI Tools
 * Enriched with Top AI Tools from powerfulai.tools, Product Hunt, and Frontier Labs
 */

const AI_TOOLS_DATA = {
  "categories": [
    {
      "id": "all",
      "name": "All Tools",
      "icon": "✨"
    },
    {
      "id": "chatbot",
      "name": "Chatbot & LLMs",
      "icon": "💬"
    },
    {
      "id": "video-generator",
      "name": "Video Generator",
      "icon": "🎬"
    },
    {
      "id": "image-generator",
      "name": "Image & Art",
      "icon": "🎨"
    },
    {
      "id": "developer-tools",
      "name": "Developer Tools",
      "icon": "💻"
    },
    {
      "id": "productivity",
      "name": "Productivity",
      "icon": "⚡"
    },
    {
      "id": "writing",
      "name": "Writing & Copy",
      "icon": "✍️"
    },
    {
      "id": "audio-editing",
      "name": "Audio & Voice",
      "icon": "🎧"
    },
    {
      "id": "marketing",
      "name": "Marketing & SEO",
      "icon": "📈"
    },
    {
      "id": "design",
      "name": "Design & UI",
      "icon": "🖌️"
    },
    {
      "id": "social-media",
      "name": "Social Media",
      "icon": "📱"
    },
    {
      "id": "business",
      "name": "Business & Finance",
      "icon": "💼"
    },
    {
      "id": "research",
      "name": "Research & PDF",
      "icon": "📚"
    },
    {
      "id": "code-assistant",
      "name": "Code Assistant",
      "icon": "⌨️"
    },
    {
      "id": "presentations",
      "name": "Presentations",
      "icon": "📊"
    },
    {
      "id": "music",
      "name": "Music Generation",
      "icon": "🎵"
    },
    {
      "id": "text-to-speech",
      "name": "Text to Speech",
      "icon": "🎙️"
    },
    {
      "id": "video-editing",
      "name": "Video Editing",
      "icon": "✂️"
    },
    {
      "id": "ai-detection",
      "name": "AI Detection",
      "icon": "🔍"
    },
    {
      "id": "search-engine",
      "name": "Search Engine",
      "icon": "🔍"
    },
    {
      "id": "finance",
      "name": "Finance",
      "icon": "💰"
    },
    {
      "id": "education",
      "name": "Education & Learning",
      "icon": "🎓"
    },
    {
      "id": "3d",
      "name": "3D Generation",
      "icon": "🧊"
    },
    {
      "id": "avatars",
      "name": "Avatars",
      "icon": "👤"
    },
    {
      "id": "customer-support",
      "name": "Customer Support",
      "icon": "🎧"
    },
    {
      "id": "data-analysis",
      "name": "Data Analysis",
      "icon": "📉"
    },
    {
      "id": "e-commerce",
      "name": "E-Commerce",
      "icon": "🛍️"
    },
    {
      "id": "email-assistant",
      "name": "Email Assistant",
      "icon": "✉️"
    },
    {
      "id": "spreadsheets",
      "name": "Spreadsheets",
      "icon": "📑"
    },
    {
      "id": "sql",
      "name": "SQL",
      "icon": "🗄️"
    },
    {
      "id": "startup",
      "name": "Startup",
      "icon": "🚀"
    },
    {
      "id": "summarizer",
      "name": "Summarizer",
      "icon": "📋"
    },
    {
      "id": "transcriber",
      "name": "Transcriber",
      "icon": "📝"
    },
    {
      "id": "translation",
      "name": "Translation",
      "icon": "🌐"
    },
    {
      "id": "travel",
      "name": "Travel",
      "icon": "✈️"
    },
    {
      "id": "seo",
      "name": "SEO",
      "icon": "🎯"
    },
    {
      "id": "sales",
      "name": "Sales",
      "icon": "🤝"
    },
    {
      "id": "low-codeno-code",
      "name": "Low-code / No-code",
      "icon": "⚡"
    },
    {
      "id": "logo-generator",
      "name": "Logo Generator",
      "icon": "🏷️"
    },
    {
      "id": "legal-assistant",
      "name": "Legal Assistant",
      "icon": "⚖️"
    },
    {
      "id": "healthcare",
      "name": "Healthcare",
      "icon": "🏥"
    },
    {
      "id": "fitness",
      "name": "Fitness",
      "icon": "🏋️"
    },
    {
      "id": "gaming",
      "name": "Gaming & RPG",
      "icon": "🎮"
    },
    {
      "id": "prompts",
      "name": "Prompts & Guides",
      "icon": "💡"
    },
    {
      "id": "real-estate",
      "name": "Real Estate",
      "icon": "🏠"
    },
    {
      "id": "story-teller",
      "name": "Story Teller",
      "icon": "📖"
    },
    {
      "id": "podcasting",
      "name": "Podcasting",
      "icon": "📻"
    },
    {
      "id": "paraphraser",
      "name": "Paraphraser",
      "icon": "🔄"
    },
    {
      "id": "fashion",
      "name": "Fashion",
      "icon": "👗"
    },
    {
      "id": "gift-ideas",
      "name": "Gift Ideas",
      "icon": "🎁"
    },
    {
      "id": "coaching",
      "name": "Coaching",
      "icon": "🧭"
    },
    {
      "id": "life-assistant",
      "name": "Life Assistant",
      "icon": "🌱"
    },
    {
      "id": "fun",
      "name": "Fun",
      "icon": "🎉"
    },
    {
      "id": "general-writing",
      "name": "General Writing",
      "icon": "📝"
    },
    {
      "id": "copywriting",
      "name": "Copywriting",
      "icon": "✒️"
    },
    {
      "id": "speech",
      "name": "Speech",
      "icon": "🗣️"
    },
    {
      "id": "jobs",
      "name": "Jobs",
      "icon": "💼"
    },
    {
      "id": "development",
      "name": "Development",
      "icon": "⚙️"
    },
    {
      "id": "personalization",
      "name": "Personalization",
      "icon": "🎯"
    },
    {
      "id": "education-assistant",
      "name": "Education Assistant",
      "icon": "📚"
    },
    {
      "id": "image-editing",
      "name": "Image Editing",
      "icon": "🖼️"
    },
    {
      "id": "art",
      "name": "Art",
      "icon": "🎨"
    },
    {
      "id": "search",
      "name": "AI Search",
      "icon": "🔍"
    },
    {
      "id": "animation",
      "name": "Animation",
      "icon": "🎬"
    }
  ],
  "tools": [
    {
      "name": "Pippit AI",
      "category": "marketing",
      "categories": [
        "marketing",
        "video-generator",
        "social-media"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Popular",
      "description": "AI-powered creative video platform and marketing suite that turns product links into high-converting video ads and social media campaigns in seconds.",
      "url": "https://pippit.ai/",
      "icon": "⚡",
      "id": "pippit-ai",
      "domain": "pippit.ai",
      "image": "https://www.google.com/s2/favicons?domain=pippit.ai&sz=128"
    },
    {
      "name": "Hume AI",
      "category": "speech",
      "categories": [
        "speech",
        "audio-editing",
        "life-assistant"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Trending",
      "description": "The world's first empathic voice AI interface. Built on an expressive large language model that understands nuances, emotions, and voice tone.",
      "url": "https://www.hume.ai/",
      "icon": "🎙️",
      "id": "hume-ai",
      "domain": "hume.ai",
      "image": "https://www.google.com/s2/favicons?domain=hume.ai&sz=128"
    },
    {
      "name": "DeepSeek",
      "category": "chatbot",
      "categories": [
        "chatbot",
        "code-assistant",
        "developer-tools",
        "research"
      ],
      "pricing": "Free",
      "featured": true,
      "badge": "Top Choice",
      "description": "Revolutionary open-weight reasoning model matching frontier models in coding, mathematics, logic, and general problem-solving at fractional cost.",
      "url": "https://www.deepseek.com/",
      "icon": "🐋",
      "id": "deepseek",
      "domain": "deepseek.com",
      "image": "https://www.google.com/s2/favicons?domain=deepseek.com&sz=128"
    },
    {
      "name": "Hiding AI",
      "category": "ai-detection",
      "categories": [
        "ai-detection",
        "writing",
        "paraphraser"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Featured",
      "description": "Advanced AI text humanizer that rewrites AI-generated drafts into 100% natural, undetectable human-like prose bypassing leading AI detectors.",
      "url": "https://hiding.ai/",
      "icon": "🛡️",
      "id": "hiding-ai",
      "domain": "hiding.ai",
      "image": "https://www.google.com/s2/favicons?domain=hiding.ai&sz=128"
    },
    {
      "name": "Alphana",
      "category": "podcasting",
      "categories": [
        "podcasting",
        "video-editing",
        "social-media"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Featured",
      "description": "AI-driven content engine that transforms raw audio, video, and podcast episodes into viral clips, newsletters, LinkedIn posts, and show notes.",
      "url": "https://alphana.ai/",
      "icon": "📻",
      "id": "alphana",
      "domain": "alphana.ai",
      "image": "https://www.google.com/s2/favicons?domain=alphana.ai&sz=128"
    },
    {
      "name": "Blaze",
      "category": "social-media",
      "categories": [
        "social-media",
        "marketing",
        "copywriting"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Featured",
      "description": "The all-in-one AI marketing tool built specifically for solopreneurs, creators, and growth teams to scale social posting, blog articles, and ads.",
      "url": "https://www.blaze.ai/",
      "icon": "🔥",
      "id": "blaze",
      "domain": "blaze.ai",
      "image": "https://www.google.com/s2/favicons?domain=blaze.ai&sz=128"
    },
    {
      "name": "PimEyes",
      "category": "search-engine",
      "categories": [
        "search-engine",
        "ai-detection",
        "research"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Featured",
      "description": "Ultra-precise facial recognition reverse image search engine allowing users to monitor their digital footprint, copyright violations, and public exposure.",
      "url": "https://pimeyes.com/",
      "icon": "👁️",
      "id": "pimeyes",
      "domain": "pimeyes.com",
      "image": "https://www.google.com/s2/favicons?domain=pimeyes.com&sz=128"
    },
    {
      "name": "Freepik Pikaso",
      "category": "image-generator",
      "categories": [
        "image-generator",
        "design",
        "art"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Featured",
      "description": "Real-time AI drawing and image generation tool that turns your brush strokes, sketches, and webcam feeds into photorealistic 4K artwork instantly.",
      "url": "https://freepik.com/pikaso",
      "icon": "🎨",
      "id": "freepik-pikaso",
      "domain": "freepik.com",
      "image": "https://www.google.com/s2/favicons?domain=freepik.com&sz=128"
    },
    {
      "name": "Plus AI",
      "category": "presentations",
      "categories": [
        "presentations",
        "productivity",
        "business"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Featured",
      "description": "AI presentation maker integrated with Google Slides and PowerPoint. Create, edit, and design investor decks and executive pitch decks in minutes.",
      "url": "https://www.plusdocs.com/",
      "icon": "📊",
      "id": "plus-ai",
      "domain": "plusdocs.com",
      "image": "https://www.google.com/s2/favicons?domain=plusdocs.com&sz=128"
    },
    {
      "name": "Voilà",
      "category": "productivity",
      "categories": [
        "productivity",
        "life-assistant",
        "email-assistant"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Featured",
      "description": "Your all-in-one browser AI copilot. Write emails, summarize articles, translate pages, fix code, and ask anything with a simple shortcut on any webpage.",
      "url": "https://www.usevoila.com/",
      "icon": "✨",
      "id": "voilà",
      "domain": "usevoila.com",
      "image": "https://www.google.com/s2/favicons?domain=usevoila.com&sz=128"
    },
    {
      "name": "StartConvo",
      "category": "developer-tools",
      "categories": [
        "developer-tools",
        "chatbot",
        "customer-support"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Featured",
      "description": "AI conversation starter and interactive widget builder that increases website visitor engagement, captures qualified leads, and answers queries 24/7.",
      "url": "https://startconvo.vercel.app/",
      "icon": "💬",
      "id": "startconvo",
      "domain": "startconvo.vercel.app",
      "image": "https://www.google.com/s2/favicons?domain=startconvo.vercel.app&sz=128"
    },
    {
      "name": "Novius",
      "category": "startup",
      "categories": [
        "startup",
        "business",
        "data-analysis"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Featured",
      "description": "Next-generation AI business planning platform that analyzes market niches, generates financial models, forecasts revenue, and builds pitch decks.",
      "url": "https://www.novius.ai/",
      "icon": "🚀",
      "id": "novius",
      "domain": "novius.ai",
      "image": "https://www.google.com/s2/favicons?domain=novius.ai&sz=128"
    },
    {
      "name": "ChatGPT",
      "category": "chatbot",
      "categories": [
        "chatbot",
        "writing",
        "productivity",
        "code-assistant"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Industry Leader",
      "description": "OpenAI flagship AI conversational system powered by GPT-4o and o1 reasoning models with voice mode, image vision, and canvas editing.",
      "url": "https://chatgpt.com/",
      "icon": "🤖",
      "id": "chatgpt",
      "domain": "chatgpt.com",
      "image": "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128"
    },
    {
      "name": "Claude 3.5 Sonnet",
      "category": "chatbot",
      "categories": [
        "chatbot",
        "code-assistant",
        "writing",
        "research"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Top Rated",
      "description": "Frontier intelligence by Anthropic with interactive Artifacts, industry-leading coding benchmarks, nuanced writing, and reasoning.",
      "url": "https://claude.ai/",
      "icon": "🧠",
      "id": "claude-35-sonnet",
      "domain": "claude.ai",
      "image": "https://www.google.com/s2/favicons?domain=claude.ai&sz=128"
    },
    {
      "name": "Perplexity AI",
      "category": "search-engine",
      "categories": [
        "search-engine",
        "research",
        "chatbot",
        "productivity"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Top Search",
      "description": "AI conversational search engine that delivers direct, cited answers with real-time web exploration, academic research mode, and collections.",
      "url": "https://www.perplexity.ai/",
      "icon": "🔍",
      "id": "perplexity-ai",
      "domain": "perplexity.ai",
      "image": "https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128"
    },
    {
      "name": "Google Gemini",
      "category": "chatbot",
      "categories": [
        "chatbot",
        "productivity",
        "research",
        "developer-tools"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Multimodal",
      "description": "Google flagship multimodal AI assistant with 2M token context window, live video analysis, and integration with Google Workspace.",
      "url": "https://gemini.google.com/",
      "icon": "♊",
      "id": "google-gemini",
      "domain": "gemini.google.com",
      "image": "https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128"
    },
    {
      "name": "Grok 2",
      "category": "chatbot",
      "categories": [
        "chatbot",
        "search-engine",
        "fun"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Real-time",
      "description": "Real-time conversational model by xAI with direct access to X (Twitter) live data stream and unfiltered reasoning capabilities.",
      "url": "https://x.ai/",
      "icon": "⚡",
      "id": "grok-2",
      "domain": "x.ai",
      "image": "https://www.google.com/s2/favicons?domain=x.ai&sz=128"
    },
    {
      "name": "Poe",
      "category": "chatbot",
      "categories": [
        "chatbot",
        "developer-tools",
        "productivity"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Hub",
      "description": "Multi-bot platform aggregating Claude, GPT-4o, DALL-E, FLUX, Stable Diffusion, and custom community AI assistants in one UI.",
      "url": "https://poe.com/",
      "icon": "🐦",
      "id": "poe",
      "domain": "poe.com",
      "image": "https://www.google.com/s2/favicons?domain=poe.com&sz=128"
    },
    {
      "name": "Character.ai",
      "category": "fun",
      "categories": [
        "fun",
        "chatbot",
        "story-teller"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Popular",
      "description": "Create, converse, and roleplay with millions of believable AI personas, historical figures, game characters, and fictional worlds.",
      "url": "https://character.ai/",
      "icon": "🎭",
      "id": "characterai",
      "domain": "character.ai",
      "image": "https://www.google.com/s2/favicons?domain=character.ai&sz=128"
    },
    {
      "name": "Pi AI",
      "category": "life-assistant",
      "categories": [
        "life-assistant",
        "chatbot",
        "speech"
      ],
      "pricing": "Free",
      "featured": true,
      "badge": "Empathic",
      "description": "Supportive conversational AI companion designed for thoughtful conversations, daily advice, and emotional intelligence.",
      "url": "https://pi.ai/",
      "icon": "🌱",
      "id": "pi-ai",
      "domain": "pi.ai",
      "image": "https://www.google.com/s2/favicons?domain=pi.ai&sz=128"
    },
    {
      "name": "Mistral Le Chat",
      "category": "chatbot",
      "categories": [
        "chatbot",
        "code-assistant",
        "writing"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "Open AI",
      "description": "Mistral AI's conversational assistant powered by Mistral Large 2, offering state-of-the-art multilingual reasoning and coding.",
      "url": "https://chat.mistral.ai/",
      "icon": "🌪️",
      "id": "mistral-le-chat",
      "domain": "chat.mistral.ai",
      "image": "https://www.google.com/s2/favicons?domain=chat.mistral.ai&sz=128"
    },
    {
      "name": "HuggingChat",
      "category": "chatbot",
      "categories": [
        "chatbot",
        "developer-tools",
        "research"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "Open Source",
      "description": "Open-source AI chat platform powered by the latest community open-weight models like Llama 3.3, Command R+, and Qwen.",
      "url": "https://huggingface.co/chat/",
      "icon": "🤗",
      "id": "huggingchat",
      "domain": "huggingface.co",
      "image": "https://www.google.com/s2/favicons?domain=huggingface.co&sz=128"
    },
    {
      "name": "You.com",
      "category": "search-engine",
      "categories": [
        "search-engine",
        "chatbot",
        "productivity"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Smart Search",
      "description": "AI-powered search engine providing customized web browsing, live research agents, citation verification, and code generation.",
      "url": "https://you.com/",
      "icon": "🌐",
      "id": "youcom",
      "domain": "you.com",
      "image": "https://www.google.com/s2/favicons?domain=you.com&sz=128"
    },
    {
      "name": "Genspark",
      "category": "search-engine",
      "categories": [
        "search-engine",
        "research",
        "summarizer"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "AI Pages",
      "description": "AI search engine that generates custom, dynamic Sparkpages summarizing multi-source research for complex queries.",
      "url": "https://www.genspark.ai/",
      "icon": "✨",
      "id": "genspark",
      "domain": "genspark.ai",
      "image": "https://www.google.com/s2/favicons?domain=genspark.ai&sz=128"
    },
    {
      "name": "Phind",
      "category": "search-engine",
      "categories": [
        "search-engine",
        "developer-tools",
        "code-assistant"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Dev Search",
      "description": "Intelligent AI search engine tailored specifically for software engineers, debugging, framework documentation, and technical architecture.",
      "url": "https://www.phind.com/",
      "icon": "🔎",
      "id": "phind",
      "domain": "phind.com",
      "image": "https://www.google.com/s2/favicons?domain=phind.com&sz=128"
    },
    {
      "name": "Cursor",
      "category": "code-assistant",
      "categories": [
        "code-assistant",
        "developer-tools",
        "development"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Top Choice",
      "description": "AI-first code editor built on VS Code with predictive multi-line editing, codebase indexing, terminal execution, and deep diffing.",
      "url": "https://www.cursor.com/",
      "icon": "💻",
      "id": "cursor",
      "domain": "cursor.com",
      "image": "https://www.google.com/s2/favicons?domain=cursor.com&sz=128"
    },
    {
      "name": "GitHub Copilot",
      "category": "code-assistant",
      "categories": [
        "code-assistant",
        "developer-tools",
        "development"
      ],
      "pricing": "Paid",
      "featured": true,
      "badge": "Industry Standard",
      "description": "AI pair programmer by GitHub and Microsoft providing real-time code completion, test generation, and pull request reviews.",
      "url": "https://github.com/features/copilot",
      "icon": "🐙",
      "id": "github-copilot",
      "domain": "github.com",
      "image": "https://www.google.com/s2/favicons?domain=github.com&sz=128"
    },
    {
      "name": "v0 by Vercel",
      "category": "developer-tools",
      "categories": [
        "developer-tools",
        "design",
        "low-codeno-code",
        "development"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Hot",
      "description": "Generative UI system that builds clean React components, Tailwind CSS styling, and full modern web layouts from plain English prompts.",
      "url": "https://v0.dev/",
      "icon": "▲",
      "id": "v0-by-vercel",
      "domain": "v0.dev",
      "image": "https://www.google.com/s2/favicons?domain=v0.dev&sz=128"
    },
    {
      "name": "Bolt.new",
      "category": "developer-tools",
      "categories": [
        "developer-tools",
        "development",
        "low-codeno-code"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Trending",
      "description": "In-browser AI full-stack development environment that scaffolds, executes, tests, and deploys complete fullstack web applications live.",
      "url": "https://bolt.new/",
      "icon": "⚡",
      "id": "boltnew",
      "domain": "bolt.new",
      "image": "https://www.google.com/s2/favicons?domain=bolt.new&sz=128"
    },
    {
      "name": "Lovable.dev",
      "category": "developer-tools",
      "categories": [
        "developer-tools",
        "development",
        "low-codeno-code"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "New",
      "description": "Next-gen AI web app builder that generates full-stack web applications with Supabase backend, authentication, and responsive frontend.",
      "url": "https://lovable.dev/",
      "icon": "❤️",
      "id": "lovabledev",
      "domain": "lovable.dev",
      "image": "https://www.google.com/s2/favicons?domain=lovable.dev&sz=128"
    },
    {
      "name": "Windsurf (Codeium)",
      "category": "code-assistant",
      "categories": [
        "code-assistant",
        "developer-tools",
        "development"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Fast",
      "description": "Agentic IDE featuring Flow paradigms that collaborate with developers in real time, anticipating next edits and terminal actions.",
      "url": "https://codeium.com/windsurf",
      "icon": "🏄",
      "id": "windsurf-codeium",
      "domain": "codeium.com",
      "image": "https://www.google.com/s2/favicons?domain=codeium.com&sz=128"
    },
    {
      "name": "Replit Agent",
      "category": "developer-tools",
      "categories": [
        "developer-tools",
        "development",
        "code-assistant"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Autonomous",
      "description": "Autonomous AI software engineer that plans, writes, debugs, installs dependencies, and deploys full web apps from scratch in your browser.",
      "url": "https://replit.com/",
      "icon": "⚙️",
      "id": "replit-agent",
      "domain": "replit.com",
      "image": "https://www.google.com/s2/favicons?domain=replit.com&sz=128"
    },
    {
      "name": "Supermaven",
      "category": "code-assistant",
      "categories": [
        "code-assistant",
        "developer-tools"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Ultra Fast",
      "description": "Blazing fast AI code completion engine with 300,000 token context window and sub-second latency for developers.",
      "url": "https://supermaven.com/",
      "icon": "⚡",
      "id": "supermaven",
      "domain": "supermaven.com",
      "image": "https://www.google.com/s2/favicons?domain=supermaven.com&sz=128"
    },
    {
      "name": "Tabnine",
      "category": "code-assistant",
      "categories": [
        "code-assistant",
        "developer-tools"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Enterprise Safe",
      "description": "Privacy-first AI code assistant trained exclusively on open-source code with permissive licenses, deployable on-premise.",
      "url": "https://www.tabnine.com/",
      "icon": "⌨️",
      "id": "tabnine",
      "domain": "tabnine.com",
      "image": "https://www.google.com/s2/favicons?domain=tabnine.com&sz=128"
    },
    {
      "name": "Aider",
      "category": "developer-tools",
      "categories": [
        "developer-tools",
        "code-assistant"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "CLI AI",
      "description": "Command-line AI pair programming tool that edits multiple files across your local git repository with automated git commits.",
      "url": "https://aider.chat/",
      "icon": "💻",
      "id": "aider",
      "domain": "aider.chat",
      "image": "https://www.google.com/s2/favicons?domain=aider.chat&sz=128"
    },
    {
      "name": "Locofy.ai",
      "category": "development",
      "categories": [
        "development",
        "design",
        "developer-tools"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Figma to Code",
      "description": "Convert Figma and Adobe XD designs into responsive, production-ready React, React Native, Vue, and HTML/CSS code.",
      "url": "https://www.locofy.ai/",
      "icon": "🎨",
      "id": "locofyai",
      "domain": "locofy.ai",
      "image": "https://www.google.com/s2/favicons?domain=locofy.ai&sz=128"
    },
    {
      "name": "FlutterFlow AI",
      "category": "development",
      "categories": [
        "development",
        "low-codeno-code"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "App Builder",
      "description": "Visual app development platform for iOS, Android, and Web powered by AI GenAI page building and custom code synthesis.",
      "url": "https://flutterflow.io/",
      "icon": "📱",
      "id": "flutterflow-ai",
      "domain": "flutterflow.io",
      "image": "https://www.google.com/s2/favicons?domain=flutterflow.io&sz=128"
    },
    {
      "name": "Supabase AI",
      "category": "developer-tools",
      "categories": [
        "developer-tools",
        "sql",
        "development"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Database AI",
      "description": "Built-in AI SQL assistant and Postgres Vector database engine for building intelligent full-stack applications.",
      "url": "https://supabase.com/",
      "icon": "⚡",
      "id": "supabase-ai",
      "domain": "supabase.com",
      "image": "https://www.google.com/s2/favicons?domain=supabase.com&sz=128"
    },
    {
      "name": "Runway Gen-3 Alpha",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "video-editing",
        "art"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Top Choice",
      "description": "Industry-leading generative AI video model creating cinematic 4K video clips with precise camera control, motion brushes, and lip sync.",
      "url": "https://runwayml.com/",
      "icon": "🎬",
      "id": "runway-gen-3-alpha",
      "domain": "runwayml.com",
      "image": "https://www.google.com/s2/favicons?domain=runwayml.com&sz=128"
    },
    {
      "name": "Luma Dream Machine",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "3d",
        "art"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "High Fidelity",
      "description": "Next-generation video foundation model capable of generating highly realistic, physically coherent 3D camera sweeps and characters.",
      "url": "https://lumalabs.ai/dream-machine",
      "icon": "✨",
      "id": "luma-dream-machine",
      "domain": "lumalabs.ai",
      "image": "https://www.google.com/s2/favicons?domain=lumalabs.ai&sz=128"
    },
    {
      "name": "Kling AI",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "art"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Trending",
      "description": "Hyper-realistic video generation model supporting up to 2-minute 1080p clips with fluid physics simulations and complex character action.",
      "url": "https://klingai.com/",
      "icon": "🎥",
      "id": "kling-ai",
      "domain": "klingai.com",
      "image": "https://www.google.com/s2/favicons?domain=klingai.com&sz=128"
    },
    {
      "name": "Pika 2.0",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "video-editing",
        "fun"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Creative",
      "description": "Idea-to-video platform with Pikaffects (inflate, melt, explode, crush) and granular visual manipulation for viral creators.",
      "url": "https://pika.art/",
      "icon": "🦊",
      "id": "pika-20",
      "domain": "pika.art",
      "image": "https://www.google.com/s2/favicons?domain=pika.art&sz=128"
    },
    {
      "name": "Sora (OpenAI)",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "art"
      ],
      "pricing": "Paid",
      "featured": true,
      "badge": "Frontier",
      "description": "World simulator video generation model creating minute-long high-fidelity video scenes with accurate physical interactions.",
      "url": "https://openai.com/sora",
      "icon": "🌌",
      "id": "sora-openai",
      "domain": "openai.com",
      "image": "https://www.google.com/s2/favicons?domain=openai.com&sz=128"
    },
    {
      "name": "Haiper AI",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "art"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Fast Gen",
      "description": "Perceptual foundation model for creative video generation with HD upscaling and animated image-to-video workflows.",
      "url": "https://haiper.ai/",
      "icon": "🌊",
      "id": "haiper-ai",
      "domain": "haiper.ai",
      "image": "https://www.google.com/s2/favicons?domain=haiper.ai&sz=128"
    },
    {
      "name": "Opus Clip",
      "category": "video-editing",
      "categories": [
        "video-editing",
        "social-media",
        "marketing"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Viral Repurposing",
      "description": "Generative AI video repurposing tool that turns long YouTube videos, podcasts, and webinars into 10 viral TikToks and Reels with auto-captions.",
      "url": "https://www.opus.pro/",
      "icon": "✂️",
      "id": "opus-clip",
      "domain": "opus.pro",
      "image": "https://www.google.com/s2/favicons?domain=opus.pro&sz=128"
    },
    {
      "name": "CapCut AI",
      "category": "video-editing",
      "categories": [
        "video-editing",
        "social-media",
        "fun"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "Popular",
      "description": "All-in-one video editor with AI auto-captions, background removal, text-to-video, voice changer, and smart effects.",
      "url": "https://www.capcut.com/",
      "icon": "✂️",
      "id": "capcut-ai",
      "domain": "capcut.com",
      "image": "https://www.google.com/s2/favicons?domain=capcut.com&sz=128"
    },
    {
      "name": "InVideo AI",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "marketing",
        "social-media"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Automated",
      "description": "Type any topic or script to generate complete YouTube videos with voiceovers, background music, stock footage, and animations.",
      "url": "https://invideo.io/",
      "icon": "📹",
      "id": "invideo-ai",
      "domain": "invideo.io",
      "image": "https://www.google.com/s2/favicons?domain=invideo.io&sz=128"
    },
    {
      "name": "Veed.io AI",
      "category": "video-editing",
      "categories": [
        "video-editing",
        "transcriber",
        "marketing"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Online Studio",
      "description": "Online video suite with AI eye contact correction, auto subtitles, background cleanup, and text-to-speech voiceovers.",
      "url": "https://www.veed.io/",
      "icon": "🎬",
      "id": "veedio-ai",
      "domain": "veed.io",
      "image": "https://www.google.com/s2/favicons?domain=veed.io&sz=128"
    },
    {
      "name": "HeyGen",
      "category": "avatars",
      "categories": [
        "avatars",
        "video-generator",
        "translation",
        "marketing"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Top Avatar",
      "description": "AI avatar video creator for sales outreach, training, and localized marketing. Supports voice cloning and lip-sync video translation in 100+ languages.",
      "url": "https://www.heygen.com/",
      "icon": "👤",
      "id": "heygen",
      "domain": "heygen.com",
      "image": "https://www.google.com/s2/favicons?domain=heygen.com&sz=128"
    },
    {
      "name": "Synthesia",
      "category": "avatars",
      "categories": [
        "avatars",
        "video-generator",
        "education"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Enterprise",
      "description": "Enterprise AI video communications platform turning scripts into high-definition training and onboarding videos with lifelike AI avatars.",
      "url": "https://www.synthesia.io/",
      "icon": "🎥",
      "id": "synthesia",
      "domain": "synthesia.io",
      "image": "https://www.google.com/s2/favicons?domain=synthesia.io&sz=128"
    },
    {
      "name": "D-ID",
      "category": "avatars",
      "categories": [
        "avatars",
        "video-generator",
        "marketing"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Talking Photos",
      "description": "Transform any still portrait photo or avatar into a photorealistic talking presenter with natural facial expressions and speech.",
      "url": "https://www.d-id.com/",
      "icon": "👤",
      "id": "d-id",
      "domain": "d-id.com",
      "image": "https://www.google.com/s2/favicons?domain=d-id.com&sz=128"
    },
    {
      "name": "DeepBrain AI",
      "category": "avatars",
      "categories": [
        "avatars",
        "video-generator",
        "education"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "News AI",
      "description": "Realistic AI human avatars for video generation, news broadcasting, interactive kiosks, and customer guidance.",
      "url": "https://www.deepbrain.io/",
      "icon": "🧍",
      "id": "deepbrain-ai",
      "domain": "deepbrain.io",
      "image": "https://www.google.com/s2/favicons?domain=deepbrain.io&sz=128"
    },
    {
      "name": "Midjourney",
      "category": "image-generator",
      "categories": [
        "image-generator",
        "art",
        "design"
      ],
      "pricing": "Paid",
      "featured": true,
      "badge": "Top Choice",
      "description": "The gold standard AI image generator producing unparalleled artistic fidelity, photographic realism, texture depth, and character consistency.",
      "url": "https://www.midjourney.com/",
      "icon": "🎨",
      "id": "midjourney",
      "domain": "midjourney.com",
      "image": "https://www.google.com/s2/favicons?domain=midjourney.com&sz=128"
    },
    {
      "name": "FLUX.1",
      "category": "image-generator",
      "categories": [
        "image-generator",
        "art",
        "developer-tools"
      ],
      "pricing": "Free",
      "featured": true,
      "badge": "Open Weights",
      "description": "Next-generation open image model delivering remarkable prompt adherence, complex typography rendering, and photorealistic anatomy.",
      "url": "https://blackforestlabs.ai/",
      "icon": "⚡",
      "id": "flux1",
      "domain": "blackforestlabs.ai",
      "image": "https://www.google.com/s2/favicons?domain=blackforestlabs.ai&sz=128"
    },
    {
      "name": "Leonardo AI",
      "category": "image-generator",
      "categories": [
        "image-generator",
        "art",
        "gaming",
        "design"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Creator Favorite",
      "description": "Comprehensive creative suite with custom model fine-tuning, Canvas inpainting, real-time generation, and game asset workflows.",
      "url": "https://leonardo.ai/",
      "icon": "🦁",
      "id": "leonardo-ai",
      "domain": "leonardo.ai",
      "image": "https://www.google.com/s2/favicons?domain=leonardo.ai&sz=128"
    },
    {
      "name": "Ideogram 2.0",
      "category": "image-generator",
      "categories": [
        "image-generator",
        "design",
        "logo-generator"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Typography King",
      "description": "AI image generator famous for flawless typography, graphic design, posters, logos, and high-accuracy text rendering on apparel.",
      "url": "https://ideogram.ai/",
      "icon": "🔤",
      "id": "ideogram-20",
      "domain": "ideogram.ai",
      "image": "https://www.google.com/s2/favicons?domain=ideogram.ai&sz=128"
    },
    {
      "name": "DALL-E 3",
      "category": "image-generator",
      "categories": [
        "image-generator",
        "art",
        "chatbot"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "OpenAI",
      "description": "Integrated within ChatGPT, DALL-E 3 translates intricate text descriptions into highly detailed, creative illustrations and concepts.",
      "url": "https://openai.com/dall-e-3",
      "icon": "🖼️",
      "id": "dall-e-3",
      "domain": "openai.com",
      "image": "https://www.google.com/s2/favicons?domain=openai.com&sz=128"
    },
    {
      "name": "Adobe Firefly",
      "category": "image-generator",
      "categories": [
        "image-generator",
        "design",
        "image-editing"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Commercial Safe",
      "description": "Adobe's commercially safe generative AI for text-to-image, Generative Fill in Photoshop, and vector recoloring.",
      "url": "https://www.adobe.com/sensei/generative-ai/firefly.html",
      "icon": "🔥",
      "id": "adobe-firefly",
      "domain": "adobe.com",
      "image": "https://www.google.com/s2/favicons?domain=adobe.com&sz=128"
    },
    {
      "name": "Recraft.ai",
      "category": "design",
      "categories": [
        "design",
        "image-generator",
        "art"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Vector Gen",
      "description": "AI design tool capable of generating clean vector graphics, 3D icons, illustrations, and brand style consistency.",
      "url": "https://www.recraft.ai/",
      "icon": "✏️",
      "id": "recraftai",
      "domain": "recraft.ai",
      "image": "https://www.google.com/s2/favicons?domain=recraft.ai&sz=128"
    },
    {
      "name": "Canva Magic Studio",
      "category": "design",
      "categories": [
        "design",
        "social-media",
        "presentations",
        "marketing"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Essential",
      "description": "AI-powered creative suite for teams. Magic Expand, Magic Eraser, AI presentation builder, and one-click multi-format social resizing.",
      "url": "https://www.canva.com/magic-home/",
      "icon": "🖌️",
      "id": "canva-magic-studio",
      "domain": "canva.com",
      "image": "https://www.google.com/s2/favicons?domain=canva.com&sz=128"
    },
    {
      "name": "Photoroom",
      "category": "image-editing",
      "categories": [
        "image-editing",
        "e-commerce",
        "design",
        "marketing"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "E-Commerce",
      "description": "Instant background removal and studio product photography generator for online merchants, Shopify sellers, and marketplace listings.",
      "url": "https://www.photoroom.com/",
      "icon": "📸",
      "id": "photoroom",
      "domain": "photoroom.com",
      "image": "https://www.google.com/s2/favicons?domain=photoroom.com&sz=128"
    },
    {
      "name": "Magnific AI",
      "category": "image-editing",
      "categories": [
        "image-editing",
        "art",
        "design"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Ultra Res",
      "description": "State-of-the-art AI upscaler and enhancer that hallucinates incredible detail and photorealism into low-resolution illustrations and photos.",
      "url": "https://magnific.ai/",
      "icon": "🔍",
      "id": "magnific-ai",
      "domain": "magnific.ai",
      "image": "https://www.google.com/s2/favicons?domain=magnific.ai&sz=128"
    },
    {
      "name": "Clipdrop",
      "category": "image-editing",
      "categories": [
        "image-editing",
        "design",
        "developer-tools"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Suite",
      "description": "Ecosystem of AI photo editing apps: Cleanup, Relight, Image Upscaler, Background Remover, Uncrop, and Reimagine XL.",
      "url": "https://clipdrop.co/",
      "icon": "💧",
      "id": "clipdrop",
      "domain": "clipdrop.co",
      "image": "https://www.google.com/s2/favicons?domain=clipdrop.co&sz=128"
    },
    {
      "name": "Krea AI",
      "category": "art",
      "categories": [
        "art",
        "image-generator",
        "video-generator",
        "image-editing"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Real-time AI",
      "description": "Real-time AI generation canvas, image enhancer, video generator, and pattern tool for visual artists.",
      "url": "https://www.krea.ai/",
      "icon": "🎨",
      "id": "krea-ai",
      "domain": "krea.ai",
      "image": "https://www.google.com/s2/favicons?domain=krea.ai&sz=128"
    },
    {
      "name": "Khroma",
      "category": "design",
      "categories": [
        "design",
        "art"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "Color AI",
      "description": "AI color palette generator for designers that learns your taste in colors and generates endless harmonious palettes.",
      "url": "https://www.khroma.co/",
      "icon": "🌈",
      "id": "khroma",
      "domain": "khroma.co",
      "image": "https://www.google.com/s2/favicons?domain=khroma.co&sz=128"
    },
    {
      "name": "Looka",
      "category": "logo-generator",
      "categories": [
        "logo-generator",
        "design",
        "startup"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Branding",
      "description": "AI logo maker and complete brand kit designer that generates custom vector logos, business cards, and social headers in seconds.",
      "url": "https://looka.com/",
      "icon": "🏷️",
      "id": "looka",
      "domain": "looka.com",
      "image": "https://www.google.com/s2/favicons?domain=looka.com&sz=128"
    },
    {
      "name": "Brandmark.io",
      "category": "logo-generator",
      "categories": [
        "logo-generator",
        "design",
        "startup"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Logo AI",
      "description": "Create unique, professional logos, icons, and brand assets using deep learning neural networks.",
      "url": "https://brandmark.io/",
      "icon": "✨",
      "id": "brandmarkio",
      "domain": "brandmark.io",
      "image": "https://www.google.com/s2/favicons?domain=brandmark.io&sz=128"
    },
    {
      "name": "ElevenLabs",
      "category": "text-to-speech",
      "categories": [
        "text-to-speech",
        "speech",
        "audio-editing",
        "transcriber"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Industry Standard",
      "description": "Hyper-realistic generative AI voice synthesis, voice cloning, sound effects generation, and real-time Conversational AI in 32+ languages.",
      "url": "https://elevenlabs.io/",
      "icon": "🔊",
      "id": "elevenlabs",
      "domain": "elevenlabs.io",
      "image": "https://www.google.com/s2/favicons?domain=elevenlabs.io&sz=128"
    },
    {
      "name": "Suno AI",
      "category": "music",
      "categories": [
        "music",
        "fun",
        "art"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Viral Hit",
      "description": "Generate full radio-quality songs with vocals, instruments, lyrics, and arrangements across any genre from simple text prompts.",
      "url": "https://suno.com/",
      "icon": "🎵",
      "id": "suno-ai",
      "domain": "suno.com",
      "image": "https://www.google.com/s2/favicons?domain=suno.com&sz=128"
    },
    {
      "name": "Udio",
      "category": "music",
      "categories": [
        "music",
        "art"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Studio Quality",
      "description": "Studio-quality AI music generation by ex-DeepMind researchers featuring multi-track stem splitting, remixing, and lyrical control.",
      "url": "https://www.udio.com/",
      "icon": "🎹",
      "id": "udio",
      "domain": "udio.com",
      "image": "https://www.google.com/s2/favicons?domain=udio.com&sz=128"
    },
    {
      "name": "Descript",
      "category": "audio-editing",
      "categories": [
        "audio-editing",
        "video-editing",
        "transcriber",
        "podcasting"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Pro Editor",
      "description": "All-in-one audio and video editor where editing media is as easy as editing a text doc. Features AI voice cloning, filler word removal, and Studio Sound.",
      "url": "https://www.descript.com/",
      "icon": "🎙️",
      "id": "descript",
      "domain": "descript.com",
      "image": "https://www.google.com/s2/favicons?domain=descript.com&sz=128"
    },
    {
      "name": "Adobe Podcast AI",
      "category": "audio-editing",
      "categories": [
        "audio-editing",
        "podcasting"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Studio Sound",
      "description": "Enhance speech quality to sound like it was recorded in a professional soundproof studio with one single click.",
      "url": "https://podcast.adobe.com/enhance",
      "icon": "🎙️",
      "id": "adobe-podcast-ai",
      "domain": "podcast.adobe.com",
      "image": "https://www.google.com/s2/favicons?domain=podcast.adobe.com&sz=128"
    },
    {
      "name": "Cleanvoice AI",
      "category": "audio-editing",
      "categories": [
        "audio-editing",
        "podcasting"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Audio Cleanup",
      "description": "AI audio cleaner that removes filler words, mouth smacks, stuttering, and awkward silences from podcasts and voice recordings.",
      "url": "https://cleanvoice.ai/",
      "icon": "🧼",
      "id": "cleanvoice-ai",
      "domain": "cleanvoice.ai",
      "image": "https://www.google.com/s2/favicons?domain=cleanvoice.ai&sz=128"
    },
    {
      "name": "Soundraw.io",
      "category": "music",
      "categories": [
        "music",
        "audio-editing",
        "video-editing"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Royalty Free",
      "description": "AI music generator that lets creators compose customized, royalty-free background tracks for videos, games, and podcasts.",
      "url": "https://soundraw.io/",
      "icon": "🎼",
      "id": "soundrawio",
      "domain": "soundraw.io",
      "image": "https://www.google.com/s2/favicons?domain=soundraw.io&sz=128"
    },
    {
      "name": "Mubert",
      "category": "music",
      "categories": [
        "music",
        "fun"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Generative Music",
      "description": "Ecosystem of AI music generation for streaming, apps, games, and video content creators.",
      "url": "https://mubert.com/",
      "icon": "🎧",
      "id": "mubert",
      "domain": "mubert.com",
      "image": "https://www.google.com/s2/favicons?domain=mubert.com&sz=128"
    },
    {
      "name": "Speechify",
      "category": "text-to-speech",
      "categories": [
        "text-to-speech",
        "education",
        "productivity"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Leading App",
      "description": "Listen to any article, PDF, book, or email with natural celebrity AI voices (Snoop Dogg, Gwyneth Paltrow) at up to 4.5x speed.",
      "url": "https://speechify.com/",
      "icon": "🎧",
      "id": "speechify",
      "domain": "speechify.com",
      "image": "https://www.google.com/s2/favicons?domain=speechify.com&sz=128"
    },
    {
      "name": "Murf.ai",
      "category": "text-to-speech",
      "categories": [
        "text-to-speech",
        "speech",
        "marketing"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Voice Studio",
      "description": "Versatile AI voice generator with 120+ natural sounding text to speech voices for e-learning, advertisements, and presentations.",
      "url": "https://murf.ai/",
      "icon": "🗣️",
      "id": "murfai",
      "domain": "murf.ai",
      "image": "https://www.google.com/s2/favicons?domain=murf.ai&sz=128"
    },
    {
      "name": "Play.ht",
      "category": "text-to-speech",
      "categories": [
        "text-to-speech",
        "speech",
        "developer-tools"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Voice Clones",
      "description": "AI voice generator and voice cloning API powering conversational agents, audiobooks, and accessibility tools.",
      "url": "https://play.ht/",
      "icon": "🔊",
      "id": "playht",
      "domain": "play.ht",
      "image": "https://www.google.com/s2/favicons?domain=play.ht&sz=128"
    },
    {
      "name": "Otter.ai",
      "category": "transcriber",
      "categories": [
        "transcriber",
        "productivity",
        "business"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Meeting AI",
      "description": "AI meeting assistant that joins Zoom, Google Meet, and Teams calls to transcribe, capture slides, and summarize action items live.",
      "url": "https://otter.ai/",
      "icon": "📝",
      "id": "otterai",
      "domain": "otter.ai",
      "image": "https://www.google.com/s2/favicons?domain=otter.ai&sz=128"
    },
    {
      "name": "Fireflies.ai",
      "category": "transcriber",
      "categories": [
        "transcriber",
        "productivity",
        "business"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Automated Notes",
      "description": "AI conversation intelligence that records, transcribes, and searches all your voice conversations and team meetings.",
      "url": "https://fireflies.ai/",
      "icon": "💡",
      "id": "firefliesai",
      "domain": "fireflies.ai",
      "image": "https://www.google.com/s2/favicons?domain=fireflies.ai&sz=128"
    },
    {
      "name": "Castmagic",
      "category": "podcasting",
      "categories": [
        "podcasting",
        "summarizer",
        "social-media"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Content Engine",
      "description": "10x your audio content by turning podcast episodes and interviews into ready-to-publish show notes, timestamps, tweets, and blog posts.",
      "url": "https://www.castmagic.io/",
      "icon": "🎙️",
      "id": "castmagic",
      "domain": "castmagic.io",
      "image": "https://www.google.com/s2/favicons?domain=castmagic.io&sz=128"
    },
    {
      "name": "Podcastle",
      "category": "podcasting",
      "categories": [
        "podcasting",
        "audio-editing",
        "transcriber"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "All-in-One",
      "description": "Studio-quality recording, AI editing, multitrack audio enhancement, and text-to-speech in one easy-to-use web app.",
      "url": "https://podcastle.ai/",
      "icon": "📻",
      "id": "podcastle",
      "domain": "podcastle.ai",
      "image": "https://www.google.com/s2/favicons?domain=podcastle.ai&sz=128"
    },
    {
      "name": "Jasper AI",
      "category": "copywriting",
      "categories": [
        "copywriting",
        "writing",
        "marketing",
        "seo"
      ],
      "pricing": "Paid",
      "featured": true,
      "badge": "Enterprise Copy",
      "description": "Enterprise AI copilot for marketing teams that writes on-brand copy, multi-channel campaigns, blog posts, and performance ads.",
      "url": "https://www.jasper.ai/",
      "icon": "✍️",
      "id": "jasper-ai",
      "domain": "jasper.ai",
      "image": "https://www.google.com/s2/favicons?domain=jasper.ai&sz=128"
    },
    {
      "name": "Copy.ai",
      "category": "copywriting",
      "categories": [
        "copywriting",
        "marketing",
        "sales",
        "productivity"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "GTM Automation",
      "description": "AI platform combining LLMs with automated GTM workflows for lead enrichment, content generation, and inbound sales velocity.",
      "url": "https://www.copy.ai/",
      "icon": "📄",
      "id": "copyai",
      "domain": "copy.ai",
      "image": "https://www.google.com/s2/favicons?domain=copy.ai&sz=128"
    },
    {
      "name": "Writesonic",
      "category": "copywriting",
      "categories": [
        "copywriting",
        "seo",
        "marketing"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "SEO Engine",
      "description": "AI article writer and SEO optimization platform generating factual, search-engine ranked content with real-time Google search data.",
      "url": "https://writesonic.com/",
      "icon": "⚡",
      "id": "writesonic",
      "domain": "writesonic.com",
      "image": "https://www.google.com/s2/favicons?domain=writesonic.com&sz=128"
    },
    {
      "name": "QuillBot",
      "category": "paraphraser",
      "categories": [
        "paraphraser",
        "general-writing",
        "education",
        "summarizer"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Popular",
      "description": "Over 50M users rely on QuillBot for AI paraphrasing, grammar checking, summarization, citation generation, and essay writing.",
      "url": "https://quillbot.com/",
      "icon": "🔄",
      "id": "quillbot",
      "domain": "quillbot.com",
      "image": "https://www.google.com/s2/favicons?domain=quillbot.com&sz=128"
    },
    {
      "name": "Grammarly AI",
      "category": "general-writing",
      "categories": [
        "general-writing",
        "writing",
        "email-assistant",
        "productivity"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Essential",
      "description": "AI writing partner that improves clarity, grammar, tone, and conciseness directly across all your browser tabs and desktop apps.",
      "url": "https://www.grammarly.com/",
      "icon": "✅",
      "id": "grammarly-ai",
      "domain": "grammarly.com",
      "image": "https://www.google.com/s2/favicons?domain=grammarly.com&sz=128"
    },
    {
      "name": "Wordtune",
      "category": "general-writing",
      "categories": [
        "general-writing",
        "paraphraser",
        "writing"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Smart Rephrase",
      "description": "AI writing companion that understands what you want to say and suggests clear, compelling phrasing alternatives.",
      "url": "https://www.wordtune.com/",
      "icon": "📝",
      "id": "wordtune",
      "domain": "wordtune.com",
      "image": "https://www.google.com/s2/favicons?domain=wordtune.com&sz=128"
    },
    {
      "name": "Sudowrite",
      "category": "story-teller",
      "categories": [
        "story-teller",
        "writing",
        "art"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Novelist AI",
      "description": "The AI writing assistant built by and for novelists. Brainstorm plot twists, generate descriptions, expand chapters, and refine prose.",
      "url": "https://www.sudowrite.com/",
      "icon": "📖",
      "id": "sudowrite",
      "domain": "sudowrite.com",
      "image": "https://www.google.com/s2/favicons?domain=sudowrite.com&sz=128"
    },
    {
      "name": "ChatPDF",
      "category": "summarizer",
      "categories": [
        "summarizer",
        "research",
        "education",
        "productivity"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Study Favorite",
      "description": "Chat with any PDF document, research paper, textbook, financial report, or legal contract to get summaries and cited instant answers.",
      "url": "https://www.chatpdf.com/",
      "icon": "📑",
      "id": "chatpdf",
      "domain": "chatpdf.com",
      "image": "https://www.google.com/s2/favicons?domain=chatpdf.com&sz=128"
    },
    {
      "name": "Rytr",
      "category": "copywriting",
      "categories": [
        "copywriting",
        "writing",
        "marketing"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Fast Copy",
      "description": "Affordable AI writing assistant that helps you create high-quality content for blogs, emails, and social posts in seconds.",
      "url": "https://rytr.me/",
      "icon": "✒️",
      "id": "rytr",
      "domain": "rytr.me",
      "image": "https://www.google.com/s2/favicons?domain=rytr.me&sz=128"
    },
    {
      "name": "Anyword",
      "category": "copywriting",
      "categories": [
        "copywriting",
        "marketing",
        "data-analysis"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Performance Copy",
      "description": "AI copywriting platform with predictive performance scores to know which ad copy and headlines will convert best before launch.",
      "url": "https://anyword.com/",
      "icon": "📊",
      "id": "anyword",
      "domain": "anyword.com",
      "image": "https://www.google.com/s2/favicons?domain=anyword.com&sz=128"
    },
    {
      "name": "GPTZero",
      "category": "ai-detection",
      "categories": [
        "ai-detection",
        "education",
        "writing"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Standard Detector",
      "description": "The gold standard AI detector trusted by millions of educators and institutions to analyze text perplexity, burstiness, and origin.",
      "url": "https://gptzero.me/",
      "icon": "🛡️",
      "id": "gptzero",
      "domain": "gptzero.me",
      "image": "https://www.google.com/s2/favicons?domain=gptzero.me&sz=128"
    },
    {
      "name": "Originality.ai",
      "category": "ai-detection",
      "categories": [
        "ai-detection",
        "seo",
        "writing"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Web Publisher",
      "description": "Accurate AI content detector and plagiarism checker built specifically for web publishers, agencies, and SEOs.",
      "url": "https://originality.ai/",
      "icon": "🔍",
      "id": "originalityai",
      "domain": "originality.ai",
      "image": "https://www.google.com/s2/favicons?domain=originality.ai&sz=128"
    },
    {
      "name": "Copyleaks",
      "category": "ai-detection",
      "categories": [
        "ai-detection",
        "education"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Enterprise AI Check",
      "description": "Enterprise AI-based text analysis and plagiarism detection platform identifying AI-generated content in 30+ languages.",
      "url": "https://copyleaks.com/",
      "icon": "📑",
      "id": "copyleaks",
      "domain": "copyleaks.com",
      "image": "https://www.google.com/s2/favicons?domain=copyleaks.com&sz=128"
    },
    {
      "name": "Notion AI",
      "category": "productivity",
      "categories": [
        "productivity",
        "writing",
        "business",
        "data-analysis"
      ],
      "pricing": "Paid",
      "featured": true,
      "badge": "Top Rated",
      "description": "AI built directly inside your Notion workspace to search across all company docs, draft project roadmaps, and auto-fill database properties.",
      "url": "https://www.notion.so/product/ai",
      "icon": "📓",
      "id": "notion-ai",
      "domain": "notion.so",
      "image": "https://www.google.com/s2/favicons?domain=notion.so&sz=128"
    },
    {
      "name": "Gamma App",
      "category": "presentations",
      "categories": [
        "presentations",
        "design",
        "productivity"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Top Presentation",
      "description": "Generate gorgeous, interactive presentations, webpages, and docs from a prompt in under 30 seconds without wrestling with slide templates.",
      "url": "https://gamma.app/",
      "icon": "📊",
      "id": "gamma-app",
      "domain": "gamma.app",
      "image": "https://www.google.com/s2/favicons?domain=gamma.app&sz=128"
    },
    {
      "name": "Beautiful.ai",
      "category": "presentations",
      "categories": [
        "presentations",
        "design"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Smart Slides",
      "description": "Generative presentation software with intelligent slide templates that automatically adapt layout as you add content.",
      "url": "https://www.beautiful.ai/",
      "icon": "📑",
      "id": "beautifulai",
      "domain": "beautiful.ai",
      "image": "https://www.google.com/s2/favicons?domain=beautiful.ai&sz=128"
    },
    {
      "name": "Tome",
      "category": "presentations",
      "categories": [
        "presentations",
        "story-teller"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Story Deck",
      "description": "AI storytelling format that transforms product briefs, strategies, and pitches into visual dynamic presentations.",
      "url": "https://tome.app/",
      "icon": "📖",
      "id": "tome",
      "domain": "tome.app",
      "image": "https://www.google.com/s2/favicons?domain=tome.app&sz=128"
    },
    {
      "name": "Make.com",
      "category": "low-codeno-code",
      "categories": [
        "low-codeno-code",
        "business",
        "developer-tools"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Visual Power",
      "description": "Visual automation platform that connects thousands of web applications, AI models, APIs, and databases into complex background workflows.",
      "url": "https://www.make.com/",
      "icon": "🧩",
      "id": "makecom",
      "domain": "make.com",
      "image": "https://www.google.com/s2/favicons?domain=make.com&sz=128"
    },
    {
      "name": "Zapier Central",
      "category": "low-codeno-code",
      "categories": [
        "low-codeno-code",
        "productivity",
        "business"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Automation",
      "description": "Experimental AI workspace where you train autonomous bots to act across 6,000+ apps, data tables, and spreadsheets on your behalf.",
      "url": "https://zapier.com/central",
      "icon": "⚡",
      "id": "zapier-central",
      "domain": "zapier.com",
      "image": "https://www.google.com/s2/favicons?domain=zapier.com&sz=128"
    },
    {
      "name": "Browse AI",
      "category": "business",
      "categories": [
        "business",
        "developer-tools",
        "data-analysis"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Web Scraper",
      "description": "Extract structured data, monitor competitor price changes, and track web updates with zero coding by simply recording your browser actions.",
      "url": "https://browse.ai/",
      "icon": "🌐",
      "id": "browse-ai",
      "domain": "browse.ai",
      "image": "https://www.google.com/s2/favicons?domain=browse.ai&sz=128"
    },
    {
      "name": "Motion",
      "category": "productivity",
      "categories": [
        "productivity",
        "life-assistant",
        "business"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Smart Calendar",
      "description": "AI calendar and task manager that automatically builds your optimal daily schedule, plans project deadlines, and adapts to interruptions.",
      "url": "https://www.usemotion.com/",
      "icon": "📅",
      "id": "motion",
      "domain": "usemotion.com",
      "image": "https://www.google.com/s2/favicons?domain=usemotion.com&sz=128"
    },
    {
      "name": "Taskade AI",
      "category": "productivity",
      "categories": [
        "productivity",
        "business",
        "low-codeno-code"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "AI Agents",
      "description": "Collaborative workspace with custom AI agents that automate research, sprint planning, project workflows, and mind maps.",
      "url": "https://www.taskade.com/",
      "icon": "🤖",
      "id": "taskade-ai",
      "domain": "taskade.com",
      "image": "https://www.google.com/s2/favicons?domain=taskade.com&sz=128"
    },
    {
      "name": "Julius AI",
      "category": "data-analysis",
      "categories": [
        "data-analysis",
        "spreadsheets",
        "finance",
        "research"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Top Analyst",
      "description": "Your expert AI data scientist. Upload CSVs, Excel sheets, and databases to perform advanced statistical modeling, charts, and forecasts.",
      "url": "https://julius.ai/",
      "icon": "📉",
      "id": "julius-ai",
      "domain": "julius.ai",
      "image": "https://www.google.com/s2/favicons?domain=julius.ai&sz=128"
    },
    {
      "name": "Superhuman AI",
      "category": "email-assistant",
      "categories": [
        "email-assistant",
        "productivity"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Fast Email",
      "description": "The fastest email experience ever made, featuring instant AI auto-replies, email summaries, and conversational email drafting.",
      "url": "https://superhuman.com/",
      "icon": "⚡",
      "id": "superhuman-ai",
      "domain": "superhuman.com",
      "image": "https://www.google.com/s2/favicons?domain=superhuman.com&sz=128"
    },
    {
      "name": "Shortwave AI",
      "category": "email-assistant",
      "categories": [
        "email-assistant",
        "productivity"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Email Copilot",
      "description": "AI-powered email client for Gmail with instant thread summaries, voice dictation, and search over entire email histories.",
      "url": "https://www.shortwave.com/",
      "icon": "✉️",
      "id": "shortwave-ai",
      "domain": "shortwave.com",
      "image": "https://www.google.com/s2/favicons?domain=shortwave.com&sz=128"
    },
    {
      "name": "Rows.com",
      "category": "spreadsheets",
      "categories": [
        "spreadsheets",
        "data-analysis",
        "business"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Modern Sheet",
      "description": "The spreadsheet powered by AI with built-in integrations to OpenAI, LinkedIn, and Crunchbase for fast lead scoring and visual dashboards.",
      "url": "https://rows.com/",
      "icon": "📑",
      "id": "rowscom",
      "domain": "rows.com",
      "image": "https://www.google.com/s2/favicons?domain=rows.com&sz=128"
    },
    {
      "name": "Formula Bot",
      "category": "spreadsheets",
      "categories": [
        "spreadsheets",
        "data-analysis"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Excel AI",
      "description": "Generate and explain complex Excel and Google Sheets formulas, scripts, and SQL queries from plain English prompts.",
      "url": "https://formulabot.com/",
      "icon": "🧮",
      "id": "formula-bot",
      "domain": "formulabot.com",
      "image": "https://www.google.com/s2/favicons?domain=formulabot.com&sz=128"
    },
    {
      "name": "AI2sql",
      "category": "sql",
      "categories": [
        "sql",
        "developer-tools",
        "data-analysis"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "SQL Gen",
      "description": "Generate complex SQL queries, JOINs, subqueries, and regex patterns effortlessly by describing what you need in plain English.",
      "url": "https://www.ai2sql.io/",
      "icon": "🗄️",
      "id": "ai2sql",
      "domain": "ai2sql.io",
      "image": "https://www.google.com/s2/favicons?domain=ai2sql.io&sz=128"
    },
    {
      "name": "SQLChat",
      "category": "sql",
      "categories": [
        "sql",
        "developer-tools"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Chat SQL",
      "description": "Chat-based SQL client that lets you query, manipulate, and visualize your database using natural language.",
      "url": "https://www.sqlchat.ai/",
      "icon": "💬",
      "id": "sqlchat",
      "domain": "sqlchat.ai",
      "image": "https://www.google.com/s2/favicons?domain=sqlchat.ai&sz=128"
    },
    {
      "name": "Consensus",
      "category": "research",
      "categories": [
        "research",
        "education",
        "search-engine"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Science Backed",
      "description": "AI search engine for research papers that searches 200M+ peer-reviewed studies and provides consensus meters on scientific queries.",
      "url": "https://consensus.app/",
      "icon": "🔬",
      "id": "consensus",
      "domain": "consensus.app",
      "image": "https://www.google.com/s2/favicons?domain=consensus.app&sz=128"
    },
    {
      "name": "Elicit",
      "category": "research",
      "categories": [
        "research",
        "education"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Literature Review",
      "description": "AI research assistant that automates literature reviews, extracts data from papers, and summarizes empirical findings.",
      "url": "https://elicit.com/",
      "icon": "📚",
      "id": "elicit",
      "domain": "elicit.com",
      "image": "https://www.google.com/s2/favicons?domain=elicit.com&sz=128"
    },
    {
      "name": "Scite.ai",
      "category": "research",
      "categories": [
        "research",
        "education"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Smart Citations",
      "description": "Award-winning research platform providing smart citation analysis that shows whether studies support or contrast research claims.",
      "url": "https://scite.ai/",
      "icon": "📖",
      "id": "sciteai",
      "domain": "scite.ai",
      "image": "https://www.google.com/s2/favicons?domain=scite.ai&sz=128"
    },
    {
      "name": "Surfer SEO",
      "category": "seo",
      "categories": [
        "seo",
        "marketing",
        "copywriting"
      ],
      "pricing": "Paid",
      "featured": true,
      "badge": "Top SEO",
      "description": "AI content editor and keyword intelligence tool that analyzes top Google SERP competitors to give you real-time content scoring.",
      "url": "https://surferseo.com/",
      "icon": "🎯",
      "id": "surfer-seo",
      "domain": "surferseo.com",
      "image": "https://www.google.com/s2/favicons?domain=surferseo.com&sz=128"
    },
    {
      "name": "Semrush AI",
      "category": "seo",
      "categories": [
        "seo",
        "marketing",
        "social-media"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Marketing Suite",
      "description": "Comprehensive marketing toolkit for organic keyword search, backlink audits, competitor ad intelligence, and AI text rephrasing.",
      "url": "https://www.semrush.com/",
      "icon": "📈",
      "id": "semrush-ai",
      "domain": "semrush.com",
      "image": "https://www.google.com/s2/favicons?domain=semrush.com&sz=128"
    },
    {
      "name": "Frase.io",
      "category": "seo",
      "categories": [
        "seo",
        "writing",
        "marketing"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Content Briefs",
      "description": "AI-powered SEO tool that helps you research, write, and optimize high-ranking content in minutes.",
      "url": "https://www.frase.io/",
      "icon": "📝",
      "id": "fraseio",
      "domain": "frase.io",
      "image": "https://www.google.com/s2/favicons?domain=frase.io&sz=128"
    },
    {
      "name": "AdCreative.ai",
      "category": "marketing",
      "categories": [
        "marketing",
        "e-commerce",
        "design"
      ],
      "pricing": "Paid",
      "featured": true,
      "badge": "Ad Engine",
      "description": "Generate conversion-focused ad creatives, banners, and text in seconds backed by machine learning conversion data.",
      "url": "https://www.adcreative.ai/",
      "icon": "🎯",
      "id": "adcreativeai",
      "domain": "adcreative.ai",
      "image": "https://www.google.com/s2/favicons?domain=adcreative.ai&sz=128"
    },
    {
      "name": "Predis.ai",
      "category": "social-media",
      "categories": [
        "social-media",
        "marketing",
        "video-generator"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Social AI",
      "description": "Create complete social media posts: video reels, carousels, captions, and hashtags from simple text descriptions.",
      "url": "https://predis.ai/",
      "icon": "📱",
      "id": "predisai",
      "domain": "predis.ai",
      "image": "https://www.google.com/s2/favicons?domain=predis.ai&sz=128"
    },
    {
      "name": "Taplio",
      "category": "social-media",
      "categories": [
        "social-media",
        "writing",
        "marketing"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "LinkedIn Growth",
      "description": "The all-in-one AI tool for LinkedIn creators: generate high-performing posts, schedule content, and engage leads.",
      "url": "https://taplio.com/",
      "icon": "💼",
      "id": "taplio",
      "domain": "taplio.com",
      "image": "https://www.google.com/s2/favicons?domain=taplio.com&sz=128"
    },
    {
      "name": "Tweet Hunter",
      "category": "social-media",
      "categories": [
        "social-media",
        "marketing"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "X Growth",
      "description": "Grow your Twitter/X audience with AI tweet inspiration, viral thread generation, auto-DMs, and scheduling.",
      "url": "https://tweethunter.io/",
      "icon": "🐦",
      "id": "tweet-hunter",
      "domain": "tweethunter.io",
      "image": "https://www.google.com/s2/favicons?domain=tweethunter.io&sz=128"
    },
    {
      "name": "Meshy AI",
      "category": "3d",
      "categories": [
        "3d",
        "gaming",
        "art"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "3D Leader",
      "description": "Create production-ready 3D game models, texturing, and assets from 2D images or text prompts in under a minute with auto-retopology.",
      "url": "https://www.meshy.ai/",
      "icon": "🧊",
      "id": "meshy-ai",
      "domain": "meshy.ai",
      "image": "https://www.google.com/s2/favicons?domain=meshy.ai&sz=128"
    },
    {
      "name": "Tripo 3D",
      "category": "3d",
      "categories": [
        "3d",
        "gaming",
        "art"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Instant 3D",
      "description": "Generate textured 3D models with animations and mesh rigging from a single prompt or image in under 10 seconds.",
      "url": "https://www.tripo3d.ai/",
      "icon": "🧊",
      "id": "tripo-3d",
      "domain": "tripo3d.ai",
      "image": "https://www.google.com/s2/favicons?domain=tripo3d.ai&sz=128"
    },
    {
      "name": "Spline AI",
      "category": "3d",
      "categories": [
        "3d",
        "design",
        "developer-tools"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Web 3D",
      "description": "3D design tool with AI generation capabilities, allowing creators to prompt 3D objects, physics simulations, and interactive web scenes.",
      "url": "https://spline.design/ai",
      "icon": "🌐",
      "id": "spline-ai",
      "domain": "spline.design",
      "image": "https://www.google.com/s2/favicons?domain=spline.design&sz=128"
    },
    {
      "name": "Rodin (Deemos)",
      "category": "3d",
      "categories": [
        "3d",
        "art"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Hyper 3D",
      "description": "Generative 3D foundation model producing ultra-high resolution 3D avatars, digital humans, and sculptural assets.",
      "url": "https://hyperhuman.deemos.com/rodin",
      "icon": "🗿",
      "id": "rodin-deemos",
      "domain": "hyperhuman.deemos.com",
      "image": "https://www.google.com/s2/favicons?domain=hyperhuman.deemos.com&sz=128"
    },
    {
      "name": "Inworld AI",
      "category": "gaming",
      "categories": [
        "gaming",
        "developer-tools",
        "chatbot"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Gaming Engine",
      "description": "AI character engine for Unreal Engine, Unity, and Roblox that gives NPCs real-time unscripted dialogue, memory, and emotional behaviors.",
      "url": "https://inworld.ai/",
      "icon": "🎮",
      "id": "inworld-ai",
      "domain": "inworld.ai",
      "image": "https://www.google.com/s2/favicons?domain=inworld.ai&sz=128"
    },
    {
      "name": "Scenario",
      "category": "gaming",
      "categories": [
        "gaming",
        "art",
        "design"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Game Assets",
      "description": "Train custom AI image models on your game art style to generate 2D game assets, sprites, textures, and UI elements.",
      "url": "https://www.scenario.com/",
      "icon": "🕹️",
      "id": "scenario",
      "domain": "scenario.com",
      "image": "https://www.google.com/s2/favicons?domain=scenario.com&sz=128"
    },
    {
      "name": "Intercom Fin",
      "category": "customer-support",
      "categories": [
        "customer-support",
        "business",
        "chatbot"
      ],
      "pricing": "Paid",
      "featured": true,
      "badge": "Enterprise AI",
      "description": "Groundbreaking AI customer service bot that resolves up to 50% of support conversations instantly with zero hallucination guarantee.",
      "url": "https://www.intercom.com/fin",
      "icon": "🎧",
      "id": "intercom-fin",
      "domain": "intercom.com",
      "image": "https://www.google.com/s2/favicons?domain=intercom.com&sz=128"
    },
    {
      "name": "Chatbase",
      "category": "customer-support",
      "categories": [
        "customer-support",
        "chatbot",
        "developer-tools"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "No-Code Bot",
      "description": "Custom GPT chatbot builder trained on your website links, help docs, and PDFs to embed on any webpage in 2 minutes.",
      "url": "https://www.chatbase.co/",
      "icon": "💬",
      "id": "chatbase",
      "domain": "chatbase.co",
      "image": "https://www.google.com/s2/favicons?domain=chatbase.co&sz=128"
    },
    {
      "name": "Tidio Lyro",
      "category": "customer-support",
      "categories": [
        "customer-support",
        "e-commerce"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Support Agent",
      "description": "Conversational AI support bot for small businesses and e-commerce stores answering customer inquiries using support FAQs.",
      "url": "https://www.tidio.com/lyro/",
      "icon": "💬",
      "id": "tidio-lyro",
      "domain": "tidio.com",
      "image": "https://www.google.com/s2/favicons?domain=tidio.com&sz=128"
    },
    {
      "name": "Apollo.io AI",
      "category": "sales",
      "categories": [
        "sales",
        "marketing",
        "business"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "B2B Sales",
      "description": "All-in-one B2B sales intelligence platform with AI-personalized email sequences, 275M+ verified contacts, and deal analytics.",
      "url": "https://www.apollo.io/",
      "icon": "🤝",
      "id": "apolloio-ai",
      "domain": "apollo.io",
      "image": "https://www.google.com/s2/favicons?domain=apollo.io&sz=128"
    },
    {
      "name": "Clay.com",
      "category": "sales",
      "categories": [
        "sales",
        "data-analysis",
        "business"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "GTM Engine",
      "description": "Combine 75+ data providers, ChatGPT, and automated research workflows into automated B2B outbound campaigns that convert.",
      "url": "https://www.clay.com/",
      "icon": "🧱",
      "id": "claycom",
      "domain": "clay.com",
      "image": "https://www.google.com/s2/favicons?domain=clay.com&sz=128"
    },
    {
      "name": "CreatorKit AI",
      "category": "e-commerce",
      "categories": [
        "e-commerce",
        "video-generator",
        "marketing"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Shopify AI",
      "description": "Top-rated AI video and product photo generator for Shopify stores, producing high-converting TikTok and Meta ad creatives.",
      "url": "https://creatorkit.com/",
      "icon": "🛒",
      "id": "creatorkit-ai",
      "domain": "creatorkit.com",
      "image": "https://www.google.com/s2/favicons?domain=creatorkit.com&sz=128"
    },
    {
      "name": "Octane AI",
      "category": "e-commerce",
      "categories": [
        "e-commerce",
        "marketing"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Quiz AI",
      "description": "AI product recommendation quiz builder for Shopify merchants to increase conversion rates and collect zero-party data.",
      "url": "https://www.octaneai.com/",
      "icon": "🛍️",
      "id": "octane-ai",
      "domain": "octaneai.com",
      "image": "https://www.google.com/s2/favicons?domain=octaneai.com&sz=128"
    },
    {
      "name": "Khanmigo",
      "category": "education",
      "categories": [
        "education",
        "education-assistant"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Socratic Tutor",
      "description": "Khan Academy's AI-powered personal tutor that guides students step-by-step through math, science, and humanities without giving away answers.",
      "url": "https://www.khanacademy.org/khanmigo",
      "icon": "🎓",
      "id": "khanmigo",
      "domain": "khanacademy.org",
      "image": "https://www.google.com/s2/favicons?domain=khanacademy.org&sz=128"
    },
    {
      "name": "MagicSchool AI",
      "category": "education-assistant",
      "categories": [
        "education-assistant",
        "education",
        "writing"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Teachers #1",
      "description": "The leading AI platform for educators, generating lesson plans, rubric assessments, IEP summaries, and student feedback.",
      "url": "https://www.magicschool.ai/",
      "icon": "📚",
      "id": "magicschool-ai",
      "domain": "magicschool.ai",
      "image": "https://www.google.com/s2/favicons?domain=magicschool.ai&sz=128"
    },
    {
      "name": "Curipod",
      "category": "education-assistant",
      "categories": [
        "education-assistant",
        "education",
        "presentations"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Interactive",
      "description": "AI interactive lesson creator that generates interactive slides, word clouds, polls, and drawing activities for classrooms.",
      "url": "https://curipod.com/",
      "icon": "🎓",
      "id": "curipod",
      "domain": "curipod.com",
      "image": "https://www.google.com/s2/favicons?domain=curipod.com&sz=128"
    },
    {
      "name": "Duolingo Max",
      "category": "education",
      "categories": [
        "education",
        "translation",
        "fun"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Language AI",
      "description": "Language learning elevated by GPT-4 with Explain My Answer breakdowns and simulated video roleplay conversations.",
      "url": "https://www.duolingo.com/",
      "icon": "🦉",
      "id": "duolingo-max",
      "domain": "duolingo.com",
      "image": "https://www.google.com/s2/favicons?domain=duolingo.com&sz=128"
    },
    {
      "name": "Quizlet Q-Chat",
      "category": "education",
      "categories": [
        "education",
        "chatbot"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Flashcards",
      "description": "Interactive AI study coach that tests your understanding of flashcard sets with conversational quiz questions.",
      "url": "https://quizlet.com/",
      "icon": "📖",
      "id": "quizlet-q-chat",
      "domain": "quizlet.com",
      "image": "https://www.google.com/s2/favicons?domain=quizlet.com&sz=128"
    },
    {
      "name": "DeepL Translate",
      "category": "translation",
      "categories": [
        "translation",
        "productivity",
        "writing"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Accurate",
      "description": "The world's most accurate neural translation service, outperforming traditional machine translators in capturing tone, idioms, and context.",
      "url": "https://www.deepl.com/translator",
      "icon": "🌐",
      "id": "deepl-translate",
      "domain": "deepl.com",
      "image": "https://www.google.com/s2/favicons?domain=deepl.com&sz=128"
    },
    {
      "name": "Smartling AI",
      "category": "translation",
      "categories": [
        "translation",
        "business",
        "developer-tools"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Enterprise",
      "description": "Enterprise AI localization suite translating web apps, mobile apps, and marketing content automatically into 150+ locales.",
      "url": "https://www.smartling.com/",
      "icon": "🌐",
      "id": "smartling-ai",
      "domain": "smartling.com",
      "image": "https://www.google.com/s2/favicons?domain=smartling.com&sz=128"
    },
    {
      "name": "FinChat.io",
      "category": "finance",
      "categories": [
        "finance",
        "data-analysis",
        "business"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Wall Street",
      "description": "The AI research platform for financial analysts, equity researchers, and investors covering SEC filings, earnings call transcripts, and KPIs.",
      "url": "https://finchat.io/",
      "icon": "💰",
      "id": "finchatio",
      "domain": "finchat.io",
      "image": "https://www.google.com/s2/favicons?domain=finchat.io&sz=128"
    },
    {
      "name": "CoCounsel",
      "category": "legal-assistant",
      "categories": [
        "legal-assistant",
        "research",
        "business"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Legal AI",
      "description": "AI legal assistant powered by GPT-4 that conducts legal research, reviews contracts, searches depositions, and drafts memoranda.",
      "url": "https://casetext.com/cocounsel/",
      "icon": "⚖️",
      "id": "cocounsel",
      "domain": "casetext.com",
      "image": "https://www.google.com/s2/favicons?domain=casetext.com&sz=128"
    },
    {
      "name": "Harvey AI",
      "category": "legal-assistant",
      "categories": [
        "legal-assistant",
        "business"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Top Law Firms",
      "description": "Generative AI platform designed for top global law firms to assist in contract analysis, due diligence, and regulatory compliance.",
      "url": "https://www.harvey.ai/",
      "icon": "⚖️",
      "id": "harvey-ai",
      "domain": "harvey.ai",
      "image": "https://www.google.com/s2/favicons?domain=harvey.ai&sz=128"
    },
    {
      "name": "Glass Health",
      "category": "healthcare",
      "categories": [
        "healthcare",
        "education",
        "research"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Clinical AI",
      "description": "AI clinical notebook and differential diagnosis assistant designed to help medical professionals make faster clinical decisions.",
      "url": "https://glass.health/",
      "icon": "🏥",
      "id": "glass-health",
      "domain": "glass.health",
      "image": "https://www.google.com/s2/favicons?domain=glass.health&sz=128"
    },
    {
      "name": "Hippocratic AI",
      "category": "healthcare",
      "categories": [
        "healthcare",
        "customer-support"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Medical LLM",
      "description": "Safety-focused healthcare foundation model designed for non-diagnostic patient communication, follow-ups, and nurse assistance.",
      "url": "https://www.hippocraticai.com/",
      "icon": "🏥",
      "id": "hippocratic-ai",
      "domain": "hippocraticai.com",
      "image": "https://www.google.com/s2/favicons?domain=hippocraticai.com&sz=128"
    },
    {
      "name": "Roam Around",
      "category": "travel",
      "categories": [
        "travel",
        "life-assistant",
        "fun"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "Trip Planner",
      "description": "AI travel planner that creates custom multi-day vacation itineraries, food recommendations, and budget plans for any city worldwide.",
      "url": "https://www.roamaround.io/",
      "icon": "✈️",
      "id": "roam-around",
      "domain": "roamaround.io",
      "image": "https://www.google.com/s2/favicons?domain=roamaround.io&sz=128"
    },
    {
      "name": "Wonderplan",
      "category": "travel",
      "categories": [
        "travel",
        "life-assistant"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "Custom Itinerary",
      "description": "Personalized AI trip planner that tailors daily travel schedules to your interests, travel pace, companions, and budget.",
      "url": "https://wonderplan.ai/",
      "icon": "🗺️",
      "id": "wonderplan",
      "domain": "wonderplan.ai",
      "image": "https://www.google.com/s2/favicons?domain=wonderplan.ai&sz=128"
    },
    {
      "name": "Lalaland.ai",
      "category": "fashion",
      "categories": [
        "fashion",
        "e-commerce",
        "avatars"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Fashion Tech",
      "description": "Generate diverse hyper-realistic 3D AI fashion models to showcase digital apparel collections across any size and ethnicity.",
      "url": "https://lalaland.ai/",
      "icon": "👗",
      "id": "lalalandai",
      "domain": "lalaland.ai",
      "image": "https://www.google.com/s2/favicons?domain=lalaland.ai&sz=128"
    },
    {
      "name": "Botika",
      "category": "fashion",
      "categories": [
        "fashion",
        "e-commerce",
        "image-generator"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Apparel AI",
      "description": "Transforms plain clothing flat-lays and mannequin photos into on-model studio photoshoots for e-commerce apparel brands.",
      "url": "https://botika.io/",
      "icon": "✨",
      "id": "botika",
      "domain": "botika.io",
      "image": "https://www.google.com/s2/favicons?domain=botika.io&sz=128"
    },
    {
      "name": "Interior AI",
      "category": "real-estate",
      "categories": [
        "real-estate",
        "design",
        "image-generator"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Staging",
      "description": "Virtual staging and interior architectural design engine that turns construction photos into rendered luxury living spaces.",
      "url": "https://interiorai.com/",
      "icon": "🛋️",
      "id": "interior-ai",
      "domain": "interiorai.com",
      "image": "https://www.google.com/s2/favicons?domain=interiorai.com&sz=128"
    },
    {
      "name": "RoomGPT",
      "category": "real-estate",
      "categories": [
        "real-estate",
        "design",
        "image-generator"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Redesign",
      "description": "Upload a photo of your room and generate 8+ photorealistic interior redesign themes in seconds.",
      "url": "https://www.roomgpt.io/",
      "icon": "🏠",
      "id": "roomgpt",
      "domain": "roomgpt.io",
      "image": "https://www.google.com/s2/favicons?domain=roomgpt.io&sz=128"
    },
    {
      "name": "Freeletics AI",
      "category": "fitness",
      "categories": [
        "fitness",
        "life-assistant"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "AI Fitness",
      "description": "Personalized digital trainer that adapts high-intensity bodyweight workouts and nutrition to your energy levels and progress.",
      "url": "https://www.freeletics.com/",
      "icon": "🏃",
      "id": "freeletics-ai",
      "domain": "freeletics.com",
      "image": "https://www.google.com/s2/favicons?domain=freeletics.com&sz=128"
    },
    {
      "name": "Fitbod AI",
      "category": "fitness",
      "categories": [
        "fitness",
        "life-assistant"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Gym Coach",
      "description": "Personalized AI workout planner that builds daily strength routines based on your past performance and muscle recovery.",
      "url": "https://fitbod.me/",
      "icon": "🏋️",
      "id": "fitbod-ai",
      "domain": "fitbod.me",
      "image": "https://www.google.com/s2/favicons?domain=fitbod.me&sz=128"
    },
    {
      "name": "Rocky.ai",
      "category": "coaching",
      "categories": [
        "coaching",
        "life-assistant",
        "productivity"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Daily Coach",
      "description": "Interactive AI life coach and leadership mentor that guides your daily reflection, habit building, and strategic prioritization.",
      "url": "https://rocky.ai/",
      "icon": "🧭",
      "id": "rockyai",
      "domain": "rocky.ai",
      "image": "https://www.google.com/s2/favicons?domain=rocky.ai&sz=128"
    },
    {
      "name": "Fingerprint AI",
      "category": "coaching",
      "categories": [
        "coaching",
        "education",
        "business"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Leadership",
      "description": "Personalized leadership and executive coaching platform offering tactical feedback and communication assessments.",
      "url": "https://fingerprint.com/",
      "icon": "💡",
      "id": "fingerprint-ai",
      "domain": "fingerprint.com",
      "image": "https://www.google.com/s2/favicons?domain=fingerprint.com&sz=128"
    },
    {
      "name": "Resume.io AI",
      "category": "jobs",
      "categories": [
        "jobs",
        "writing",
        "productivity"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Career",
      "description": "Build ATS-friendly, professional resumes and cover letters with AI phrasing suggestions and industry-specific bullet points.",
      "url": "https://resume.io/",
      "icon": "💼",
      "id": "resumeio-ai",
      "domain": "resume.io",
      "image": "https://www.google.com/s2/favicons?domain=resume.io&sz=128"
    },
    {
      "name": "Teal AI",
      "category": "jobs",
      "categories": [
        "jobs",
        "productivity"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Job Tracker",
      "description": "All-in-one job search management platform with AI resume builder, job tracker, and keyword match scoring.",
      "url": "https://www.tealhq.com/",
      "icon": "💼",
      "id": "teal-ai",
      "domain": "tealhq.com",
      "image": "https://www.google.com/s2/favicons?domain=tealhq.com&sz=128"
    },
    {
      "name": "PromptBase",
      "category": "prompts",
      "categories": [
        "prompts",
        "art",
        "marketing"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Marketplace",
      "description": "Curated prompt marketplace for Midjourney, ChatGPT, DALL-E, and Stable Diffusion to generate premium assets with guaranteed outputs.",
      "url": "https://promptbase.com/",
      "icon": "💡",
      "id": "promptbase",
      "domain": "promptbase.com",
      "image": "https://www.google.com/s2/favicons?domain=promptbase.com&sz=128"
    },
    {
      "name": "FlowGPT",
      "category": "prompts",
      "categories": [
        "prompts",
        "chatbot",
        "fun"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "Community",
      "description": "Global community platform sharing, testing, and ranking thousands of prompt chains for coding, roleplay, gaming, and business.",
      "url": "https://flowgpt.com/",
      "icon": "🌊",
      "id": "flowgpt",
      "domain": "flowgpt.com",
      "image": "https://www.google.com/s2/favicons?domain=flowgpt.com&sz=128"
    },
    {
      "name": "PitchBob.io",
      "category": "startup",
      "categories": [
        "startup",
        "business",
        "presentations"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "VC Pitch",
      "description": "AI copilot for startup founders that turns raw business ideas into venture capital pitch decks, business models, and investor one-pagers.",
      "url": "https://pitchbob.io/",
      "icon": "🚀",
      "id": "pitchbobio",
      "domain": "pitchbob.io",
      "image": "https://www.google.com/s2/favicons?domain=pitchbob.io&sz=128"
    },
    {
      "name": "ValidatorAI",
      "category": "startup",
      "categories": [
        "startup",
        "business"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "Idea Validation",
      "description": "Submit your startup idea to receive objective AI feedback, market critiques, and lean validation suggestions.",
      "url": "https://www.validatorai.com/",
      "icon": "💡",
      "id": "validatorai",
      "domain": "validatorai.com",
      "image": "https://www.google.com/s2/favicons?domain=validatorai.com&sz=128"
    },
    {
      "name": "Giftastic AI",
      "category": "gift-ideas",
      "categories": [
        "gift-ideas",
        "life-assistant",
        "fun"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "Gift Finder",
      "description": "Find thoughtful, unique gift recommendations tailored to any recipient's personality, quirks, hobbies, and your budget.",
      "url": "https://giftastic.ai/",
      "icon": "🎁",
      "id": "giftastic-ai",
      "domain": "giftastic.ai",
      "image": "https://www.google.com/s2/favicons?domain=giftastic.ai&sz=128"
    },
    {
      "name": "Elfster AI",
      "category": "gift-ideas",
      "categories": [
        "gift-ideas",
        "fun"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "Secret Santa",
      "description": "AI-powered holiday wishlist builder and Secret Santa gift exchange generator with smart product pairing.",
      "url": "https://www.elfster.com/",
      "icon": "🎄",
      "id": "elfster-ai",
      "domain": "elfster.com",
      "image": "https://www.google.com/s2/favicons?domain=elfster.com&sz=128"
    },
    {
      "name": "Mutiny AI",
      "category": "personalization",
      "categories": [
        "personalization",
        "marketing",
        "business"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "B2B ABM",
      "description": "No-code AI platform that dynamically personalizes website copy, headlines, and calls-to-action for every target B2B buyer.",
      "url": "https://www.mutinyhq.com/",
      "icon": "🎯",
      "id": "mutiny-ai",
      "domain": "mutinyhq.com",
      "image": "https://www.google.com/s2/favicons?domain=mutinyhq.com&sz=128"
    },
    {
      "name": "Kaiber AI",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "art",
        "music"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Music Videos",
      "description": "AI creative video generator that turns audio tracks and concept art into psychedelic, animated music videos.",
      "url": "https://kaiber.ai/",
      "icon": "🎨",
      "id": "kaiber-ai",
      "domain": "kaiber.ai",
      "image": "https://www.google.com/s2/favicons?domain=kaiber.ai&sz=128"
    },
    {
      "name": "PixVerse AI",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "art"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "4K Video",
      "description": "Powerful generative AI video model creating realistic 4K video clips with multi-character choreography and anime styles.",
      "url": "https://pixverse.ai/",
      "icon": "🎥",
      "id": "pixverse-ai",
      "domain": "pixverse.ai",
      "image": "https://www.google.com/s2/favicons?domain=pixverse.ai&sz=128"
    },
    {
      "name": "Viggle AI",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "fun",
        "avatars"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "Motion Physics",
      "description": "Controllable video generation that maps any character image onto reference motion videos and viral dance moves.",
      "url": "https://viggle.ai/",
      "icon": "🕺",
      "id": "viggle-ai",
      "domain": "viggle.ai",
      "image": "https://www.google.com/s2/favicons?domain=viggle.ai&sz=128"
    },
    {
      "name": "Gling AI",
      "category": "video-editing",
      "categories": [
        "video-editing",
        "podcasting"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Auto Cut",
      "description": "AI video editing assistant designed for YouTube creators that automatically removes silences, filler words, and bad takes.",
      "url": "https://gling.ai/",
      "icon": "✂️",
      "id": "gling-ai",
      "domain": "gling.ai",
      "image": "https://www.google.com/s2/favicons?domain=gling.ai&sz=128"
    },
    {
      "name": "Munch AI",
      "category": "video-editing",
      "categories": [
        "video-editing",
        "social-media",
        "marketing"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Trend Analysis",
      "description": "Extracts the most engaging, trending short clips from long videos with auto-generated captions and SEO post copy.",
      "url": "https://www.getmunch.com/",
      "icon": "🎬",
      "id": "munch-ai",
      "domain": "getmunch.com",
      "image": "https://www.google.com/s2/favicons?domain=getmunch.com&sz=128"
    },
    {
      "name": "Upscayl",
      "category": "image-editing",
      "categories": [
        "image-editing",
        "art",
        "developer-tools"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "Open Source",
      "description": "Free and open-source AI image upscaler that enhances image sharpness and resolution up to 16x locally on your GPU.",
      "url": "https://upscayl.org/",
      "icon": "🔍",
      "id": "upscayl",
      "domain": "upscayl.org",
      "image": "https://www.google.com/s2/favicons?domain=upscayl.org&sz=128"
    },
    {
      "name": "Flair.ai",
      "category": "e-commerce",
      "categories": [
        "e-commerce",
        "design",
        "image-generator"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Product Photos",
      "description": "AI design tool for e-commerce branded content. Place your product in photorealistic custom studio environments.",
      "url": "https://flair.ai/",
      "icon": "✨",
      "id": "flairai",
      "domain": "flair.ai",
      "image": "https://www.google.com/s2/favicons?domain=flair.ai&sz=128"
    },
    {
      "name": "Pebblely",
      "category": "e-commerce",
      "categories": [
        "e-commerce",
        "design",
        "marketing"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Shopify AI",
      "description": "Turn single product photos into multiple marketing photos for Instagram, Facebook, and storefront banners in seconds.",
      "url": "https://pebblely.com/",
      "icon": "📸",
      "id": "pebblely",
      "domain": "pebblely.com",
      "image": "https://www.google.com/s2/favicons?domain=pebblely.com&sz=128"
    },
    {
      "name": "Uizard",
      "category": "design",
      "categories": [
        "design",
        "developer-tools",
        "low-codeno-code"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "UI Wireframe",
      "description": "AI UI/UX design tool that converts hand-drawn wireframe sketches and screenshots into editable digital prototypes.",
      "url": "https://uizard.io/",
      "icon": "📱",
      "id": "uizard",
      "domain": "uizard.io",
      "image": "https://www.google.com/s2/favicons?domain=uizard.io&sz=128"
    },
    {
      "name": "Relume AI",
      "category": "design",
      "categories": [
        "design",
        "low-codeno-code",
        "developer-tools"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Sitemap Gen",
      "description": "AI website builder that generates complete marketing site architecture, wireframes, and Figma components from prompts.",
      "url": "https://www.relume.io/",
      "icon": "🌐",
      "id": "relume-ai",
      "domain": "relume.io",
      "image": "https://www.google.com/s2/favicons?domain=relume.io&sz=128"
    },
    {
      "name": "LALAL.AI",
      "category": "audio-editing",
      "categories": [
        "audio-editing",
        "music"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Stem Splitter",
      "description": "Next-gen vocal remover and audio stem splitter extracting voice, drums, bass, guitar, and piano from any song.",
      "url": "https://www.lalal.ai/",
      "icon": "🎧",
      "id": "lalalai",
      "domain": "lalal.ai",
      "image": "https://www.google.com/s2/favicons?domain=lalal.ai&sz=128"
    },
    {
      "name": "Krisp.ai",
      "category": "audio-editing",
      "categories": [
        "audio-editing",
        "productivity"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Noise Cancel",
      "description": "AI noise cancellation app that eliminates background chatter, barking, and echo from microphone and speaker in calls.",
      "url": "https://krisp.ai/",
      "icon": "🎙️",
      "id": "krispai",
      "domain": "krisp.ai",
      "image": "https://www.google.com/s2/favicons?domain=krisp.ai&sz=128"
    },
    {
      "name": "Beatoven.ai",
      "category": "music",
      "categories": [
        "music",
        "video-editing"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Mood Music",
      "description": "Generate unique mood-based background music tracks tailored to your podcast or video pacing.",
      "url": "https://www.beatoven.ai/",
      "icon": "🎶",
      "id": "beatovenai",
      "domain": "beatoven.ai",
      "image": "https://www.google.com/s2/favicons?domain=beatoven.ai&sz=128"
    },
    {
      "name": "AIVA",
      "category": "music",
      "categories": [
        "music",
        "art"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Soundtrack AI",
      "description": "Artificial Intelligence Virtual Artist composing classical, cinematic, and electronic soundtracks for movies and games.",
      "url": "https://www.aiva.ai/",
      "icon": "🎻",
      "id": "aiva",
      "domain": "aiva.ai",
      "image": "https://www.google.com/s2/favicons?domain=aiva.ai&sz=128"
    },
    {
      "name": "Ollama",
      "category": "developer-tools",
      "categories": [
        "developer-tools",
        "chatbot"
      ],
      "pricing": "Free",
      "featured": true,
      "badge": "Local LLM",
      "description": "Run open-source large language models (Llama 3, DeepSeek, Mistral, Qwen) locally on macOS, Linux, and Windows with ease.",
      "url": "https://ollama.com/",
      "icon": "🦙",
      "id": "ollama",
      "domain": "ollama.com",
      "image": "https://www.google.com/s2/favicons?domain=ollama.com&sz=128"
    },
    {
      "name": "LM Studio",
      "category": "developer-tools",
      "categories": [
        "developer-tools",
        "chatbot"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "Local UI",
      "description": "Desktop app to discover, download, and run local LLMs completely offline on your computer with a friendly chat UI.",
      "url": "https://lmstudio.ai/",
      "icon": "💻",
      "id": "lm-studio",
      "domain": "lmstudio.ai",
      "image": "https://www.google.com/s2/favicons?domain=lmstudio.ai&sz=128"
    },
    {
      "name": "Continue.dev",
      "category": "code-assistant",
      "categories": [
        "code-assistant",
        "developer-tools"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "Open Copilot",
      "description": "The open-source AI code assistant for VS Code and JetBrains that connects to any LLM and local codebase embedding.",
      "url": "https://www.continue.dev/",
      "icon": "⏩",
      "id": "continuedev",
      "domain": "continue.dev",
      "image": "https://www.google.com/s2/favicons?domain=continue.dev&sz=128"
    },
    {
      "name": "Sourcegraph Cody",
      "category": "code-assistant",
      "categories": [
        "code-assistant",
        "developer-tools"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Codebase Graph",
      "description": "AI coding assistant that leverages Sourcegraph's code intelligence graph to understand entire multi-repo codebases.",
      "url": "https://sourcegraph.com/cody",
      "icon": "🧭",
      "id": "sourcegraph-cody",
      "domain": "sourcegraph.com",
      "image": "https://www.google.com/s2/favicons?domain=sourcegraph.com&sz=128"
    },
    {
      "name": "Qodo (CodiumAI)",
      "category": "code-assistant",
      "categories": [
        "code-assistant",
        "developer-tools"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Unit Testing",
      "description": "AI code integrity platform providing automated unit test generation, PR reviews, and code behavior analysis.",
      "url": "https://www.qodo.ai/",
      "icon": "🧪",
      "id": "qodo-codiumai",
      "domain": "qodo.ai",
      "image": "https://www.google.com/s2/favicons?domain=qodo.ai&sz=128"
    },
    {
      "name": "Decktopus AI",
      "category": "presentations",
      "categories": [
        "presentations",
        "business",
        "education"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Fast Decks",
      "description": "All-in-one presentation generator that creates tailored decks with voiceover recording, forms, and lead generation.",
      "url": "https://www.decktopus.com/",
      "icon": "🐙",
      "id": "decktopus-ai",
      "domain": "decktopus.com",
      "image": "https://www.google.com/s2/favicons?domain=decktopus.com&sz=128"
    },
    {
      "name": "SlidesAI.io",
      "category": "presentations",
      "categories": [
        "presentations",
        "education"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Google Slides",
      "description": "Create Google Slides presentations from plain text or bullet points in seconds with automated slide design.",
      "url": "https://www.slidesai.io/",
      "icon": "📊",
      "id": "slidesaiio",
      "domain": "slidesai.io",
      "image": "https://www.google.com/s2/favicons?domain=slidesai.io&sz=128"
    },
    {
      "name": "Saner.ai",
      "category": "life-assistant",
      "categories": [
        "life-assistant",
        "productivity",
        "summarizer"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Second Brain",
      "description": "AI note-taking app designed for overwhelmed entrepreneurs to capture thoughts, synthesize ideas, and retrieve notes.",
      "url": "https://saner.ai/",
      "icon": "🧠",
      "id": "sanerai",
      "domain": "saner.ai",
      "image": "https://www.google.com/s2/favicons?domain=saner.ai&sz=128"
    },
    {
      "name": "Raycast AI",
      "category": "productivity",
      "categories": [
        "productivity",
        "developer-tools"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Mac Launcher",
      "description": "Supercharge your macOS desktop launcher with inline AI chat, quick AI text rewriting, and custom prompt extensions.",
      "url": "https://www.raycast.com/core-features/ai",
      "icon": "⚡",
      "id": "raycast-ai",
      "domain": "raycast.com",
      "image": "https://www.google.com/s2/favicons?domain=raycast.com&sz=128"
    },
    {
      "name": "CSM 3D (Common Sense)",
      "category": "3d",
      "categories": [
        "3d",
        "gaming",
        "art"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "3D Worlds",
      "description": "Convert single images, videos, and sketches into production-ready 3D assets and Gaussian splats for game engines.",
      "url": "https://csm.ai/",
      "icon": "🌐",
      "id": "csm-3d-common-sense",
      "domain": "csm.ai",
      "image": "https://www.google.com/s2/favicons?domain=csm.ai&sz=128"
    },
    {
      "name": "Sloyd.ai",
      "category": "3d",
      "categories": [
        "3d",
        "gaming"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Fast Mesh",
      "description": "Prompt-based 3D model generator creating optimized game-ready 3D props with customizable geometry and UV unwrapping.",
      "url": "https://www.sloyd.ai/",
      "icon": "🎲",
      "id": "sloydai",
      "domain": "sloyd.ai",
      "image": "https://www.google.com/s2/favicons?domain=sloyd.ai&sz=128"
    },
    {
      "name": "Booth.ai",
      "category": "e-commerce",
      "categories": [
        "e-commerce",
        "image-generator",
        "marketing"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Studio Shot",
      "description": "Generate commercial quality product photography by uploading sample product shots and describing your desired vision.",
      "url": "https://www.booth.ai/",
      "icon": "📸",
      "id": "boothai",
      "domain": "booth.ai",
      "image": "https://www.google.com/s2/favicons?domain=booth.ai&sz=128"
    },
    {
      "name": "Lex.page",
      "category": "writing",
      "categories": [
        "writing",
        "general-writing",
        "productivity"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Modern Editor",
      "description": "Word processor with AI built-in. Offers smart autocomplete, title generation, and critique feedback for professional essays.",
      "url": "https://lex.page/",
      "icon": "🖋️",
      "id": "lexpage",
      "domain": "lex.page",
      "image": "https://www.google.com/s2/favicons?domain=lex.page&sz=128"
    },
    {
      "name": "NovelAI",
      "category": "story-teller",
      "categories": [
        "story-teller",
        "fun",
        "art"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Fantasy AI",
      "description": "AI-assisted authorship, storytelling, and companion platform powered by proprietary fine-tuned literary language models.",
      "url": "https://novelai.net/",
      "icon": "📚",
      "id": "novelai",
      "domain": "novelai.net",
      "image": "https://www.google.com/s2/favicons?domain=novelai.net&sz=128"
    },
    {
      "name": "Kagi Universal Summarizer",
      "category": "summarizer",
      "categories": [
        "summarizer",
        "research",
        "productivity"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Web Summary",
      "description": "Summarize any webpage, YouTube video, PDF file, or podcast into structured bullet points with high factual accuracy.",
      "url": "https://kagi.com/summarizer",
      "icon": "⚡",
      "id": "kagi-universal-summarizer",
      "domain": "kagi.com",
      "image": "https://www.google.com/s2/favicons?domain=kagi.com&sz=128"
    },
    {
      "name": "Nabla Copilot",
      "category": "healthcare",
      "categories": [
        "healthcare",
        "transcriber"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Clinical Notes",
      "description": "Ambient AI clinical assistant that transcribes patient consultations and generates structured EHR clinical notes.",
      "url": "https://www.nabla.com/",
      "icon": "🩺",
      "id": "nabla-copilot",
      "domain": "nabla.com",
      "image": "https://www.google.com/s2/favicons?domain=nabla.com&sz=128"
    },
    {
      "name": "Spellbook AI",
      "category": "legal-assistant",
      "categories": [
        "legal-assistant",
        "writing"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Legal Contracts",
      "description": "AI contract drafting and review assistant integrated directly inside Microsoft Word to review legal terms 10x faster.",
      "url": "https://www.spellbook.legal/",
      "icon": "📜",
      "id": "spellbook-ai",
      "domain": "spellbook.legal",
      "image": "https://www.google.com/s2/favicons?domain=spellbook.legal&sz=128"
    },
    {
      "name": "REimagineHome",
      "category": "real-estate",
      "categories": [
        "real-estate",
        "design",
        "image-generator"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Virtual Renovation",
      "description": "AI virtual staging and architectural renovation tool for real estate agents and homeowners.",
      "url": "https://www.reimaginehome.ai/",
      "icon": "🏡",
      "id": "reimaginehome",
      "domain": "reimaginehome.ai",
      "image": "https://www.google.com/s2/favicons?domain=reimaginehome.ai&sz=128"
    },
    {
      "name": "PromptHero",
      "category": "prompts",
      "categories": [
        "prompts",
        "art",
        "image-generator"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "Prompt Gallery",
      "description": "World's largest prompt database for Midjourney, Stable Diffusion, DALL-E, and ChatGPT with Millions of tested prompts.",
      "url": "https://prompthero.com/",
      "icon": "🦸",
      "id": "prompthero",
      "domain": "prompthero.com",
      "image": "https://www.google.com/s2/favicons?domain=prompthero.com&sz=128"
    },
    {
      "name": "AIPRM",
      "category": "prompts",
      "categories": [
        "prompts",
        "seo",
        "marketing"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Browser Extension",
      "description": "Curated 1-click prompt extension for ChatGPT with thousands of vetted marketing, SEO, and coding prompts.",
      "url": "https://www.aiprm.com/",
      "icon": "💡",
      "id": "aiprm",
      "domain": "aiprm.com",
      "image": "https://www.google.com/s2/favicons?domain=aiprm.com&sz=128"
    },
    {
      "name": "AI Dungeon",
      "category": "gaming",
      "categories": [
        "gaming",
        "story-teller",
        "fun"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Text RPG",
      "description": "Infinitely generated text adventure roleplaying game where your decisions shape procedural fantasy worlds in real time.",
      "url": "https://aidungeon.com/",
      "icon": "🐉",
      "id": "ai-dungeon",
      "domain": "aidungeon.com",
      "image": "https://www.google.com/s2/favicons?domain=aidungeon.com&sz=128"
    },
    {
      "name": "OpenAI Sora",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "creative"
      ],
      "pricing": "Paid",
      "featured": true,
      "badge": "Frontier Video",
      "description": "OpenAI's state-of-the-art text-to-video model capable of generating photorealistic, high-fidelity 1080p video scenes up to 60 seconds.",
      "url": "https://sora.com/",
      "icon": "🎥",
      "id": "openai-sora",
      "domain": "sora.com",
      "image": "https://www.google.com/s2/favicons?domain=sora.com&sz=128"
    },
    {
      "name": "Vidu AI",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "creative"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "1080p HD",
      "description": "Universal visual foundation model producing high-resolution video shots with natural lighting, complex motion, and anime styles.",
      "url": "https://www.vidu.studio/",
      "icon": "📽️",
      "id": "vidu-ai",
      "domain": "vidu.studio",
      "image": "https://www.google.com/s2/favicons?domain=vidu.studio&sz=128"
    },
    {
      "name": "MiniMax Video-01",
      "category": "video-generator",
      "categories": [
        "video-generator"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "Free Tier",
      "description": "State-of-the-art Chinese video foundation model offering cinematic camera movements and high-frame-rate rendering for free.",
      "url": "https://hailuoai.video/",
      "icon": "🎥",
      "id": "minimax-video-01",
      "domain": "hailuoai.video",
      "image": "https://www.google.com/s2/favicons?domain=hailuoai.video&sz=128"
    },
    {
      "name": "Creatify AI",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "marketing",
        "e-commerce"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "E-Commerce",
      "description": "Generates high-converting short-form video ads for TikTok, Instagram Reels, and YouTube Shorts from any product link or URL.",
      "url": "https://creatify.ai/",
      "icon": "🛍️",
      "id": "creatify-ai",
      "domain": "creatify.ai",
      "image": "https://www.google.com/s2/favicons?domain=creatify.ai&sz=128"
    },
    {
      "name": "Submagic",
      "category": "video-editing",
      "categories": [
        "video-editing",
        "social-media",
        "marketing"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Captions AI",
      "description": "Auto-generates dynamic animated captions, emojis, sound effects, and auto-b-rolls for short-form viral videos.",
      "url": "https://submagic.co/",
      "icon": "🪄",
      "id": "submagic",
      "domain": "submagic.co",
      "image": "https://www.google.com/s2/favicons?domain=submagic.co&sz=128"
    },
    {
      "name": "Captions.ai",
      "category": "video-editing",
      "categories": [
        "video-editing",
        "social-media",
        "creator-tools"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Studio Audio",
      "description": "Camera and video editing app featuring AI eye contact correction, background noise removal, smart zooms, and auto-captions.",
      "url": "https://www.captions.ai/",
      "icon": "📱",
      "id": "captions-ai",
      "domain": "captions.ai",
      "image": "https://www.google.com/s2/favicons?domain=captions.ai&sz=128"
    },
    {
      "name": "Topaz Video AI",
      "category": "video-editing",
      "categories": [
        "video-editing",
        "enhancement"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Pro Upscaler",
      "description": "Production-grade neural video upscaler that enhances footage to 4K/8K, de-interlaces, removes motion blur, and interpolates 60fps.",
      "url": "https://www.topazlabs.com/topaz-video-ai",
      "icon": "💎",
      "id": "topaz-video-ai",
      "domain": "topazlabs.com",
      "image": "https://www.google.com/s2/favicons?domain=topazlabs.com&sz=128"
    },
    {
      "name": "LivePortrait",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "avatars",
        "animation"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "Open Source",
      "description": "State-of-the-art open source portrait animation model that transfers facial expressions and head pose to static images in real time.",
      "url": "https://liveportrait.github.io/",
      "icon": "🎭",
      "id": "liveportrait",
      "domain": "liveportrait.github.io",
      "image": "https://www.google.com/s2/favicons?domain=liveportrait.github.io&sz=128"
    },
    {
      "name": "Arcads AI",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "avatars",
        "marketing"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Actor Ads",
      "description": "Convert text scripts into hyper-realistic UGC creator ads featuring authentic AI human actors without hiring influencers.",
      "url": "https://www.arcads.ai/",
      "icon": "🎬",
      "id": "arcads-ai",
      "domain": "arcads.ai",
      "image": "https://www.google.com/s2/favicons?domain=arcads.ai&sz=128"
    },
    {
      "name": "Stable Diffusion 3.5",
      "category": "image-generator",
      "categories": [
        "image-generator",
        "developer-tools",
        "creative"
      ],
      "pricing": "Free",
      "featured": true,
      "badge": "Open Weights",
      "description": "Stability AI's latest multimodal diffusion transformer model with unmatched prompt adherence and customizable LoRA training.",
      "url": "https://stability.ai/",
      "icon": "🎨",
      "id": "stable-diffusion-3-5",
      "domain": "stability.ai",
      "image": "https://www.google.com/s2/favicons?domain=stability.ai&sz=128"
    },
    {
      "name": "SeaArt AI",
      "category": "image-generator",
      "categories": [
        "image-generator",
        "anime",
        "creative"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Community Models",
      "description": "Creative AI community with hundreds of custom fine-tuned checkpoints for anime, hyperrealism, game assets, and character concepts.",
      "url": "https://www.seaart.ai/",
      "icon": "🌊",
      "id": "seaart-ai",
      "domain": "seaart.ai",
      "image": "https://www.google.com/s2/favicons?domain=seaart.ai&sz=128"
    },
    {
      "name": "DeepSeek R1",
      "category": "chatbot",
      "categories": [
        "chatbot",
        "developer-tools",
        "research"
      ],
      "pricing": "Free",
      "featured": true,
      "badge": "Open Reasoning",
      "description": "Open-weights frontier reasoning model rivaling OpenAI o1 on math, competitive programming, and complex multi-step logic at fraction cost.",
      "url": "https://chat.deepseek.com/",
      "icon": "🐋",
      "id": "deepseek-r1",
      "domain": "chat.deepseek.com",
      "image": "https://www.google.com/s2/favicons?domain=chat.deepseek.com&sz=128"
    },
    {
      "name": "Jan AI",
      "category": "chatbot",
      "categories": [
        "chatbot",
        "developer-tools",
        "privacy"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "100% Offline",
      "description": "Open-source desktop ChatGPT alternative that runs completely on your device without internet connection or telemetry.",
      "url": "https://jan.ai/",
      "icon": "🔒",
      "id": "jan-ai",
      "domain": "jan.ai",
      "image": "https://www.google.com/s2/favicons?domain=jan.ai&sz=128"
    },
    {
      "name": "Dify.ai",
      "category": "developer-tools",
      "categories": [
        "developer-tools",
        "chatbot",
        "workflow"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "LLM App Builder",
      "description": "Open-source LLM app development platform combining AI workflow orchestration, RAG pipelines, and multi-agent systems.",
      "url": "https://dify.ai/",
      "icon": "🧩",
      "id": "dify-ai",
      "domain": "dify.ai",
      "image": "https://www.google.com/s2/favicons?domain=dify.ai&sz=128"
    },
    {
      "name": "Claude Code",
      "category": "code-assistant",
      "categories": [
        "code-assistant",
        "developer-tools",
        "terminal"
      ],
      "pricing": "Paid",
      "featured": true,
      "badge": "Official Agent",
      "description": "Anthropic's command-line agentic coding assistant that reads entire codebases, edits multiple files, runs tests, and creates git commits.",
      "url": "https://docs.anthropic.com/en/docs/agents-and-tools/claude-code",
      "icon": "⌨️",
      "id": "claude-code",
      "domain": "docs.anthropic.com",
      "image": "https://www.google.com/s2/favicons?domain=docs.anthropic.com&sz=128"
    },
    {
      "name": "Trae AI",
      "category": "code-assistant",
      "categories": [
        "code-assistant",
        "developer-tools"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "Adaptive IDE",
      "description": "Adaptive AI-powered IDE by ByteDance that automates code refactoring, project generation, and contextual debugging.",
      "url": "https://www.trae.ai/",
      "icon": "🛠️",
      "id": "trae-ai",
      "domain": "trae.ai",
      "image": "https://www.google.com/s2/favicons?domain=trae.ai&sz=128"
    },
    {
      "name": "CodeRabbit",
      "category": "developer-tools",
      "categories": [
        "developer-tools",
        "code-assistant"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "AI Code Review",
      "description": "AI pull request reviewer that summarizes changes, catches bugs, validates edge cases, and suggests 1-click refactors on GitHub and GitLab.",
      "url": "https://coderabbit.ai/",
      "icon": "🐇",
      "id": "coderabbit",
      "domain": "coderabbit.ai",
      "image": "https://www.google.com/s2/favicons?domain=coderabbit.ai&sz=128"
    },
    {
      "name": "Stable Audio 2.0",
      "category": "music",
      "categories": [
        "music",
        "sound-effects"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Full Tracks",
      "description": "Stability AI's audio diffusion model capable of generating up to 3 minutes of coherent music tracks and custom sound effects at 44.1kHz.",
      "url": "https://stableaudio.com/",
      "icon": "🔊",
      "id": "stable-audio-2-0",
      "domain": "stableaudio.com",
      "image": "https://www.google.com/s2/favicons?domain=stableaudio.com&sz=128"
    },
    {
      "name": "Google NotebookLM",
      "category": "research",
      "categories": [
        "research",
        "productivity",
        "audio-editing"
      ],
      "pricing": "Free",
      "featured": true,
      "badge": "Audio Overviews",
      "description": "Personalized AI research assistant that synthesizes your source documents, notes, and PDFs into instant answers and two-host podcast deep dives.",
      "url": "https://notebooklm.google.com/",
      "icon": "📓",
      "id": "google-notebooklm",
      "domain": "notebooklm.google.com",
      "image": "https://www.google.com/s2/favicons?domain=notebooklm.google.com&sz=128"
    },
    {
      "name": "Granola AI",
      "category": "productivity",
      "categories": [
        "productivity",
        "transcription"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Notepad for Meetings",
      "description": "Smart notepad for meetings that transcribes conversations and formats your raw thoughts into clean executive action points.",
      "url": "https://www.granola.so/",
      "icon": "🥣",
      "id": "granola-ai",
      "domain": "granola.so",
      "image": "https://www.google.com/s2/favicons?domain=granola.so&sz=128"
    },
    {
      "name": "Fathom AI Notetaker",
      "category": "productivity",
      "categories": [
        "productivity",
        "transcription"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "100% Free Zoom AI",
      "description": "Free AI meeting recorder that records, transcribes, highlights, and summarizes your Zoom, Google Meet, and Teams calls.",
      "url": "https://fathom.video/",
      "icon": "🎙️",
      "id": "fathom-ai-notetaker",
      "domain": "fathom.video",
      "image": "https://www.google.com/s2/favicons?domain=fathom.video&sz=128"
    },
    {
      "name": "Relay.app",
      "category": "productivity",
      "categories": [
        "productivity",
        "automation"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Human-in-the-Loop",
      "description": "Modern workflow automation platform combining AI enrichment with human approval steps across apps like Notion, Linear, and Slack.",
      "url": "https://www.relay.app/",
      "icon": "🔗",
      "id": "relay-app",
      "domain": "relay.app",
      "image": "https://www.google.com/s2/favicons?domain=relay.app&sz=128"
    },
    {
      "name": "Reclaim.ai",
      "category": "productivity",
      "categories": [
        "productivity",
        "calendar"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Smart Calendar",
      "description": "AI calendar assistant that automatically schedules focus time, habits, and tasks around your existing meetings.",
      "url": "https://reclaim.ai/",
      "icon": "📅",
      "id": "reclaim-ai",
      "domain": "reclaim.ai",
      "image": "https://www.google.com/s2/favicons?domain=reclaim.ai&sz=128"
    },
    {
      "name": "Klap",
      "category": "video-editing",
      "categories": [
        "video-editing",
        "social-media",
        "shorts"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Viral Shorts",
      "description": "Turn YouTube videos into TikToks, Reels, and Shorts in 1 click with AI reframing, dynamic captions, and virality scoring.",
      "url": "https://klap.app/",
      "icon": "🎬",
      "id": "klap",
      "domain": "klap.app",
      "image": "https://www.google.com/s2/favicons?domain=klap.app&sz=128"
    },
    {
      "name": "Vidyo.ai",
      "category": "video-editing",
      "categories": [
        "video-editing",
        "social-media"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Video Repurpose",
      "description": "AI video repurposing platform for content creators and podcasters to create social media clips with auto-chapters and subtitles.",
      "url": "https://vidyo.ai/",
      "icon": "🎞️",
      "id": "vidyo-ai",
      "domain": "vidyo.ai",
      "image": "https://www.google.com/s2/favicons?domain=vidyo.ai&sz=128"
    },
    {
      "name": "Fliki",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "text-to-speech"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Blog to Video",
      "description": "Transform articles, tweets, and blog posts into narrated videos with lifelike AI voices and rich media libraries.",
      "url": "https://fliki.ai/",
      "icon": "🎙️",
      "id": "fliki",
      "domain": "fliki.ai",
      "image": "https://www.google.com/s2/favicons?domain=fliki.ai&sz=128"
    },
    {
      "name": "Playground AI",
      "category": "image-generator",
      "categories": [
        "image-generator",
        "design"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Mixed Canvas",
      "description": "Free-to-use AI image creator combining text prompts, image mixing, inpainting, and infinite canvas editing.",
      "url": "https://playground.com/",
      "icon": "🎠",
      "id": "playground-ai",
      "domain": "playground.com",
      "image": "https://www.google.com/s2/favicons?domain=playground.com&sz=128"
    },
    {
      "name": "VanceAI",
      "category": "image-generator",
      "categories": [
        "image-generator",
        "enhancement"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Photo Restorer",
      "description": "Full suite of photo enhancement tools including old photo restoration, anime upscaling, background removal, and denoise.",
      "url": "https://vanceai.com/",
      "icon": "✨",
      "id": "vanceai",
      "domain": "vanceai.com",
      "image": "https://www.google.com/s2/favicons?domain=vanceai.com&sz=128"
    },
    {
      "name": "Cutout.pro",
      "category": "image-generator",
      "categories": [
        "image-generator",
        "design"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Visual AI",
      "description": "Automated photo & video editing tool for cutout backgrounds, passport photo generation, photo colorization, and face cutout.",
      "url": "https://www.cutout.pro/",
      "icon": "✂️",
      "id": "cutout-pro",
      "domain": "cutout.pro",
      "image": "https://www.google.com/s2/favicons?domain=cutout.pro&sz=128"
    },
    {
      "name": "Let's Enhance",
      "category": "image-generator",
      "categories": [
        "image-generator",
        "enhancement"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "HD Upscaler",
      "description": "AI image upscaler and clarity enhancer that increases resolution up to 16x without losing fine textures.",
      "url": "https://letsenhance.io/",
      "icon": "🖼️",
      "id": "let-s-enhance",
      "domain": "letsenhance.io",
      "image": "https://www.google.com/s2/favicons?domain=letsenhance.io&sz=128"
    },
    {
      "name": "Undetectable AI",
      "category": "writing",
      "categories": [
        "writing",
        "ai-detection"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Humanizer",
      "description": "Rewrites and humanizes AI-generated text to bypass all major AI detectors like Turnitin, GPTZero, and Originality.ai.",
      "url": "https://undetectable.ai/",
      "icon": "🕵️",
      "id": "undetectable-ai",
      "domain": "undetectable.ai",
      "image": "https://www.google.com/s2/favicons?domain=undetectable.ai&sz=128"
    },
    {
      "name": "Jenni AI",
      "category": "writing",
      "categories": [
        "writing",
        "research",
        "academic"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Academic Writing",
      "description": "AI research paper and literature review assistant with auto-citations in APA, MLA, and Harvard formats.",
      "url": "https://jenni.ai/",
      "icon": "🎓",
      "id": "jenni-ai",
      "domain": "jenni.ai",
      "image": "https://www.google.com/s2/favicons?domain=jenni.ai&sz=128"
    },
    {
      "name": "Paperpal",
      "category": "writing",
      "categories": [
        "writing",
        "research"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Scientific Polish",
      "description": "AI academic grammar checker and language editor tailored specifically for journal submissions and medical manuscripts.",
      "url": "https://paperpal.com/",
      "icon": "📄",
      "id": "paperpal",
      "domain": "paperpal.com",
      "image": "https://www.google.com/s2/favicons?domain=paperpal.com&sz=128"
    },
    {
      "name": "Lovo.ai (Genny)",
      "category": "text-to-speech",
      "categories": [
        "text-to-speech",
        "video-editing"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Emotional Voices",
      "description": "Award-winning AI voice generator and video editor with 500+ emotional voices in 100+ languages.",
      "url": "https://lovo.ai/",
      "icon": "🗣️",
      "id": "lovo-ai-genny",
      "domain": "lovo.ai",
      "image": "https://www.google.com/s2/favicons?domain=lovo.ai&sz=128"
    },
    {
      "name": "Mem.ai",
      "category": "productivity",
      "categories": [
        "productivity",
        "notes"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Self-Organizing",
      "description": "The world's first self-organizing workspace powered by AI that automatically connects related ideas, notes, and research.",
      "url": "https://mem.ai/",
      "icon": "🧠",
      "id": "mem-ai",
      "domain": "mem.ai",
      "image": "https://www.google.com/s2/favicons?domain=mem.ai&sz=128"
    },
    {
      "name": "Bardeen AI",
      "category": "productivity",
      "categories": [
        "productivity",
        "automation",
        "scraping"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Browser Scraper",
      "description": "1-click browser automation tool that scrapes websites, enriches CRM leads, and syncs data to Google Sheets & Notion.",
      "url": "https://www.bardeen.ai/",
      "icon": "🤖",
      "id": "bardeen-ai",
      "domain": "bardeen.ai",
      "image": "https://www.google.com/s2/favicons?domain=bardeen.ai&sz=128"
    },
    {
      "name": "Ocoya",
      "category": "social-media",
      "categories": [
        "social-media",
        "marketing"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "All-in-one Social",
      "description": "AI-powered platform to create, schedule, and optimize social media graphics, copywriting, and e-commerce product posts.",
      "url": "https://www.ocoya.com/",
      "icon": "🚀",
      "id": "ocoya",
      "domain": "ocoya.com",
      "image": "https://www.google.com/s2/favicons?domain=ocoya.com&sz=128"
    },
    {
      "name": "Photomath AI",
      "category": "education",
      "categories": [
        "education",
        "math"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "Instant Math",
      "description": "Scan any handwritten math equation with your camera to get instant step-by-step solutions and interactive graphs.",
      "url": "https://photomath.com/",
      "icon": "📐",
      "id": "photomath-ai",
      "domain": "photomath.com",
      "image": "https://www.google.com/s2/favicons?domain=photomath.com&sz=128"
    },
    {
      "name": "Elsa Speak",
      "category": "education",
      "categories": [
        "education",
        "language",
        "voice"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Accent Coach",
      "description": "AI English speech coach that provides real-time pronunciation feedback, accent reduction, and fluently scored practice.",
      "url": "https://elsaspeak.com/",
      "icon": "🗣️",
      "id": "elsa-speak",
      "domain": "elsaspeak.com",
      "image": "https://www.google.com/s2/favicons?domain=elsaspeak.com&sz=128"
    },
    {
      "name": "Vapi AI",
      "category": "audio-editing",
      "categories": [
        "audio-editing",
        "developer-tools",
        "chatbot"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Voice Agent API",
      "description": "Voice AI developer platform for building ultra-low latency conversational voice assistants for phone calls and customer support.",
      "url": "https://vapi.ai/",
      "icon": "📞",
      "id": "vapi-ai",
      "domain": "vapi.ai",
      "image": "https://www.google.com/s2/favicons?domain=vapi.ai&sz=128"
    },
    {
      "name": "Retell AI",
      "category": "audio-editing",
      "categories": [
        "audio-editing",
        "chatbot",
        "business"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Phone AI",
      "description": "Conversational voice API for phone calls with realistic human interruptions and multi-turn live dialog.",
      "url": "https://www.retellai.com/",
      "icon": "📱",
      "id": "retell-ai",
      "domain": "retellai.com",
      "image": "https://www.google.com/s2/favicons?domain=retellai.com&sz=128"
    },
    {
      "name": "Bland AI",
      "category": "audio-editing",
      "categories": [
        "audio-editing",
        "business",
        "marketing"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Phone Calls",
      "description": "Automate millions of inbound and outbound customer phone calls using programmable conversational AI phone agents.",
      "url": "https://www.bland.ai/",
      "icon": "☎️",
      "id": "bland-ai",
      "domain": "bland.ai",
      "image": "https://www.google.com/s2/favicons?domain=bland.ai&sz=128"
    },
    {
      "name": "Cartesia",
      "category": "text-to-speech",
      "categories": [
        "text-to-speech",
        "voice",
        "developer-tools"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Ultra Low Latency",
      "description": "Sonic text-to-speech model offering sub-100ms realistic speech streaming for interactive voice bots.",
      "url": "https://cartesia.ai/",
      "icon": "⚡",
      "id": "cartesia",
      "domain": "cartesia.ai",
      "image": "https://www.google.com/s2/favicons?domain=cartesia.ai&sz=128"
    },
    {
      "name": "Hedra AI",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "avatars",
        "creative"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Character Studio",
      "description": "Expressive visual character creation engine that turns photos, audio tracks, and scripts into singing or talking video avatars.",
      "url": "https://www.hedra.com/",
      "icon": "🎭",
      "id": "hedra-ai",
      "domain": "hedra.com",
      "image": "https://www.google.com/s2/favicons?domain=hedra.com&sz=128"
    },
    {
      "name": "DomoAI",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "animation"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Video to Anime",
      "description": "Transforms real live-action videos into anime, 3D cartoon, illustration, and retro pixel animation styles.",
      "url": "https://domoai.app/",
      "icon": "⛩️",
      "id": "domoai",
      "domain": "domoai.app",
      "image": "https://www.google.com/s2/favicons?domain=domoai.app&sz=128"
    },
    {
      "name": "AnimateDiff",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "developer-tools"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "Open Source",
      "description": "Motion module framework for Stable Diffusion that turns text-to-image models into animation generators without extra tuning.",
      "url": "https://animatediff.github.io/",
      "icon": "🎞️",
      "id": "animatediff",
      "domain": "animatediff.github.io",
      "image": "https://www.google.com/s2/favicons?domain=animatediff.github.io&sz=128"
    },
    {
      "name": "Galileo AI",
      "category": "design",
      "categories": [
        "design",
        "ui"
      ],
      "pricing": "Paid",
      "featured": true,
      "badge": "Text to UI",
      "description": "Generate editable mobile and desktop UI screens, vector graphics, and UX layouts in Figma from natural language descriptions.",
      "url": "https://www.usegalileo.ai/",
      "icon": "📱",
      "id": "galileo-ai",
      "domain": "usegalileo.ai",
      "image": "https://www.google.com/s2/favicons?domain=usegalileo.ai&sz=128"
    },
    {
      "name": "Framer AI",
      "category": "design",
      "categories": [
        "design",
        "web-builder"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Website Builder",
      "description": "Generate, design, and publish responsive websites with custom CMS, animations, and zero code using Framer's AI builder.",
      "url": "https://www.framer.com/",
      "icon": "⚡",
      "id": "framer-ai",
      "domain": "framer.com",
      "image": "https://www.google.com/s2/favicons?domain=framer.com&sz=128"
    },
    {
      "name": "Dora AI",
      "category": "design",
      "categories": [
        "design",
        "3d",
        "web-builder"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "3D Websites",
      "description": "Generate 3D animated websites with interactive scroll models and immersive spatial effects directly from a text prompt.",
      "url": "https://www.dora.run/",
      "icon": "🌐",
      "id": "dora-ai",
      "domain": "dora.run",
      "image": "https://www.google.com/s2/favicons?domain=dora.run&sz=128"
    },
    {
      "name": "Amazon Q Developer",
      "category": "code-assistant",
      "categories": [
        "code-assistant",
        "developer-tools",
        "cloud"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "AWS Copilot",
      "description": "Generative AI assistant for software development with deep AWS infrastructure, architecture, security scanning, and transformation capabilities.",
      "url": "https://aws.amazon.com/q/developer/",
      "icon": "☁️",
      "id": "amazon-q-developer",
      "domain": "aws.amazon.com",
      "image": "https://www.google.com/s2/favicons?domain=aws.amazon.com&sz=128"
    },
    {
      "name": "Semantic Scholar AI",
      "category": "research",
      "categories": [
        "research",
        "academic"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "Free Academic",
      "description": "Free, AI-backed search engine for 200M+ academic research papers created by the Allen Institute for AI.",
      "url": "https://www.semanticscholar.org/",
      "icon": "🎓",
      "id": "semantic-scholar-ai",
      "domain": "semanticscholar.org",
      "image": "https://www.google.com/s2/favicons?domain=semanticscholar.org&sz=128"
    },
    {
      "name": "ResearchRabbit",
      "category": "research",
      "categories": [
        "research",
        "visualizer"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "Literature Map",
      "description": "Spotify for research papers that visualizes citation networks and recommends new literature based on your library collections.",
      "url": "https://www.researchrabbit.ai/",
      "icon": "🐇",
      "id": "researchrabbit",
      "domain": "researchrabbit.ai",
      "image": "https://www.google.com/s2/favicons?domain=researchrabbit.ai&sz=128"
    },
    {
      "name": "SciSpace",
      "category": "research",
      "categories": [
        "research",
        "summarizer"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Paper Copilot",
      "description": "AI research copilot to chat with research papers, extract tables, discover key takeaways, and simplify complex scientific jargon.",
      "url": "https://typeset.io/",
      "icon": "🪐",
      "id": "scispace",
      "domain": "typeset.io",
      "image": "https://www.google.com/s2/favicons?domain=typeset.io&sz=128"
    },
    {
      "name": "Humata AI",
      "category": "research",
      "categories": [
        "research",
        "productivity"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Fast Document QA",
      "description": "Ask questions and get instant answers from 1000-page enterprise technical documents, contracts, and financial prospectuses.",
      "url": "https://www.humata.ai/",
      "icon": "📑",
      "id": "humata-ai",
      "domain": "humata.ai",
      "image": "https://www.google.com/s2/favicons?domain=humata.ai&sz=128"
    },
    {
      "name": "PDFgear",
      "category": "research",
      "categories": [
        "research",
        "productivity"
      ],
      "pricing": "Free",
      "featured": false,
      "badge": "100% Free PDF AI",
      "description": "Full-featured desktop PDF editor and reader with free integrated ChatGPT summary and extraction capabilities.",
      "url": "https://www.pdfgear.com/",
      "icon": "📄",
      "id": "pdfgear",
      "domain": "pdfgear.com",
      "image": "https://www.google.com/s2/favicons?domain=pdfgear.com&sz=128"
    },
    {
      "name": "MarketMuse",
      "category": "marketing",
      "categories": [
        "marketing",
        "seo"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Content Strategy",
      "description": "AI content planning and auditing platform that analyzes entire website domains to identify topic authority gaps.",
      "url": "https://www.marketmuse.com/",
      "icon": "🏛️",
      "id": "marketmuse",
      "domain": "marketmuse.com",
      "image": "https://www.google.com/s2/favicons?domain=marketmuse.com&sz=128"
    },
    {
      "name": "ScaleNut",
      "category": "marketing",
      "categories": [
        "marketing",
        "seo"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Managed SEO",
      "description": "All-in-one SEO and content marketing platform that manages keyword research, content briefs, writing, and on-page optimization.",
      "url": "https://www.scalenut.com/",
      "icon": "🥜",
      "id": "scalenut",
      "domain": "scalenut.com",
      "image": "https://www.google.com/s2/favicons?domain=scalenut.com&sz=128"
    },
    {
      "name": "Defog AI",
      "category": "business",
      "categories": [
        "business",
        "developer-tools"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "SQL Queries",
      "description": "Embeddable generative AI that lets business users query internal SQL databases in natural language with high accuracy.",
      "url": "https://defog.ai/",
      "icon": "🗄️",
      "id": "defog-ai",
      "domain": "defog.ai",
      "image": "https://www.google.com/s2/favicons?domain=defog.ai&sz=128"
    },
    {
      "name": "Akkio",
      "category": "business",
      "categories": [
        "business",
        "marketing"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "No-Code Predictive AI",
      "description": "Generative business intelligence platform for agencies to predict customer churn, lead scoring, and revenue forecasts.",
      "url": "https://www.akkio.com/",
      "icon": "🔮",
      "id": "akkio",
      "domain": "akkio.com",
      "image": "https://www.google.com/s2/favicons?domain=akkio.com&sz=128"
    },
    {
      "name": "Numerous.ai",
      "category": "business",
      "categories": [
        "business",
        "productivity"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "ChatGPT in Sheets",
      "description": "Spreadsheet AI plugin that cleans messy data, generates text, categorizes rows, and executes bulk prompts in Google Sheets and Excel.",
      "url": "https://numerous.ai/",
      "icon": "📊",
      "id": "numerous-ai",
      "domain": "numerous.ai",
      "image": "https://www.google.com/s2/favicons?domain=numerous.ai&sz=128"
    },
    {
      "name": "Limitless AI",
      "category": "productivity",
      "categories": [
        "productivity",
        "transcription",
        "hardware"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Personal Memory",
      "description": "Wearable pendant and app that captures real-world conversations and meetings, giving you an infinite personalized memory.",
      "url": "https://www.limitless.ai/",
      "icon": "🔘",
      "id": "limitless-ai",
      "domain": "limitless.ai",
      "image": "https://www.google.com/s2/favicons?domain=limitless.ai&sz=128"
    },
    {
      "name": "Heptabase AI",
      "category": "research",
      "categories": [
        "research",
        "productivity",
        "visualizer"
      ],
      "pricing": "Paid",
      "featured": true,
      "badge": "Visual Second Brain",
      "description": "Spatial visual whiteboard that helps researchers, academics, and thinkers turn complex knowledge into organized concept cards.",
      "url": "https://heptabase.com/",
      "icon": "🗺️",
      "id": "heptabase-ai",
      "domain": "heptabase.com",
      "image": "https://www.google.com/s2/favicons?domain=heptabase.com&sz=128"
    },
    {
      "name": "Readwise Reader",
      "category": "productivity",
      "categories": [
        "productivity",
        "research",
        "summarizer"
      ],
      "pricing": "Paid",
      "featured": true,
      "badge": "Ghostreader",
      "description": "Read-it-later app with Ghostreader AI that summarizes articles, defines terms, and creates spaced-repetition flashcards.",
      "url": "https://readwise.io/read",
      "icon": "📖",
      "id": "readwise-reader",
      "domain": "readwise.io",
      "image": "https://www.google.com/s2/favicons?domain=readwise.io&sz=128"
    },
    {
      "name": "Pitch AI",
      "category": "presentations",
      "categories": [
        "presentations",
        "design"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "Collaborative Slides",
      "description": "Modern presentation software that turns prompts into designer-crafted slide decks with real-time team collaboration.",
      "url": "https://pitch.com/",
      "icon": "🎯",
      "id": "pitch-ai",
      "domain": "pitch.com",
      "image": "https://www.google.com/s2/favicons?domain=pitch.com&sz=128"
    },
    {
      "name": "Kaedim 3D",
      "category": "3d",
      "categories": [
        "3d",
        "gaming",
        "design"
      ],
      "pricing": "Paid",
      "featured": true,
      "badge": "Production 3D",
      "description": "Transforms 2D art and concept sketches into production-ready 3D digital game assets with clean quad topology in minutes.",
      "url": "https://www.kaedim3d.com/",
      "icon": "🗿",
      "id": "kaedim-3d",
      "domain": "kaedim3d.com",
      "image": "https://www.google.com/s2/favicons?domain=kaedim3d.com&sz=128"
    },
    {
      "name": "Polycam 3D AI",
      "category": "3d",
      "categories": [
        "3d",
        "creative"
      ],
      "pricing": "Freemium",
      "featured": true,
      "badge": "LiDAR & 3D Scan",
      "description": "Top LiDAR and photogrammetry 3D scanner app that captures real-world objects and generates Gaussian splatting models.",
      "url": "https://poly.cam/",
      "icon": "📱",
      "id": "polycam-3d-ai",
      "domain": "poly.cam",
      "image": "https://www.google.com/s2/favicons?domain=poly.cam&sz=128"
    },
    {
      "name": "Hour One",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "avatars",
        "enterprise"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Virtual Humans",
      "description": "Transforms text into high-production video presentations with lifelike virtual presenters and automatic localization.",
      "url": "https://hourone.ai/",
      "icon": "⏳",
      "id": "hour-one",
      "domain": "hourone.ai",
      "image": "https://www.google.com/s2/favicons?domain=hourone.ai&sz=128"
    },
    {
      "name": "Colossyan",
      "category": "video-generator",
      "categories": [
        "video-generator",
        "avatars",
        "education"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Workplace Training",
      "description": "AI video creator for workplace learning, compliance training, and HR onboarding with multi-avatar conversations.",
      "url": "https://www.colossyan.com/",
      "icon": "🏛️",
      "id": "colossyan",
      "domain": "colossyan.com",
      "image": "https://www.google.com/s2/favicons?domain=colossyan.com&sz=128"
    },
    {
      "name": "Akool",
      "category": "image-generator",
      "categories": [
        "image-generator",
        "video-generator",
        "marketing"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Face Swap & Avatars",
      "description": "Studio-grade face replacement, background change, and personalized video generation for marketing campaigns.",
      "url": "https://akool.com/",
      "icon": "🎭",
      "id": "akool",
      "domain": "akool.com",
      "image": "https://www.google.com/s2/favicons?domain=akool.com&sz=128"
    },
    {
      "name": "Hypotenuse AI",
      "category": "writing",
      "categories": [
        "writing",
        "e-commerce",
        "marketing"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "E-Commerce Catalog",
      "description": "Generates thousands of SEO-optimized product descriptions, category pages, and marketing copy in bulk from spreadsheet data.",
      "url": "https://www.hypotenuse.ai/",
      "icon": "📐",
      "id": "hypotenuse-ai",
      "domain": "hypotenuse.ai",
      "image": "https://www.google.com/s2/favicons?domain=hypotenuse.ai&sz=128"
    },
    {
      "name": "BypassGPT",
      "category": "writing",
      "categories": [
        "writing",
        "ai-detection"
      ],
      "pricing": "Paid",
      "featured": false,
      "badge": "Undetectable AI",
      "description": "AI text rewriter designed to bypass AI detectors like GPTZero, Copyleaks, and Turnitin with 100% human score.",
      "url": "https://bypassgpt.ai/",
      "icon": "🛡️",
      "id": "bypassgpt",
      "domain": "bypassgpt.ai",
      "image": "https://www.google.com/s2/favicons?domain=bypassgpt.ai&sz=128"
    },
    {
      "name": "Ludo.ai",
      "category": "gaming",
      "categories": [
        "gaming",
        "research",
        "design"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Game Ideation",
      "description": "The AI game development ideation platform that researches market trends, generates game concepts, and creates game design docs.",
      "url": "https://ludo.ai/",
      "icon": "🕹️",
      "id": "ludo-ai",
      "domain": "ludo.ai",
      "image": "https://www.google.com/s2/favicons?domain=ludo.ai&sz=128"
    },
    {
      "name": "Rosebud AI",
      "category": "gaming",
      "categories": [
        "gaming",
        "developer-tools",
        "web-builder"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Text to Game",
      "description": "AI game creation platform that builds 2D and 3D browser games from simple text prompts with instant shareable links.",
      "url": "https://rosebud.ai/",
      "icon": "🌹",
      "id": "rosebud-ai",
      "domain": "rosebud.ai",
      "image": "https://www.google.com/s2/favicons?domain=rosebud.ai&sz=128"
    },
    {
      "name": "Speak App",
      "category": "education",
      "categories": [
        "education",
        "language",
        "voice"
      ],
      "pricing": "Paid",
      "featured": true,
      "badge": "AI Conversation Tutor",
      "description": "OpenAI-backed language learning app that provides fluent spoken conversation practice and instant grammar corrections.",
      "url": "https://www.speak.com/",
      "icon": "🗣️",
      "id": "speak-app",
      "domain": "speak.com",
      "image": "https://www.google.com/s2/favicons?domain=speak.com&sz=128"
    },
    {
      "name": "Praktika AI",
      "category": "education",
      "categories": [
        "education",
        "language",
        "avatars"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Avatar English Coach",
      "description": "Learn English by having real spoken conversations with interactive 3D AI avatars and customized lesson plans.",
      "url": "https://praktika.ai/",
      "icon": "🎙️",
      "id": "praktika-ai",
      "domain": "praktika.ai",
      "image": "https://www.google.com/s2/favicons?domain=praktika.ai&sz=128"
    },
    {
      "name": "Equals",
      "category": "business",
      "categories": [
        "business",
        "productivity"
      ],
      "pricing": "Paid",
      "featured": true,
      "badge": "Next-gen BI Spreadsheet",
      "description": "Modern spreadsheet connected directly to your SQL data warehouse with built-in AI assistant for automated financial modeling.",
      "url": "https://equals.com/",
      "icon": "📊",
      "id": "equals",
      "domain": "equals.com",
      "image": "https://www.google.com/s2/favicons?domain=equals.com&sz=128"
    },
    {
      "name": "Polymer Search",
      "category": "business",
      "categories": [
        "business",
        "developer-tools"
      ],
      "pricing": "Freemium",
      "featured": false,
      "badge": "Auto Dashboards",
      "description": "Turns messy spreadsheets and CSVs into searchable, interactive data visualizer dashboards and pivot tables without formulas.",
      "url": "https://www.polymersearch.com/",
      "icon": "📈",
      "id": "polymer-search",
      "domain": "polymersearch.com",
      "image": "https://www.google.com/s2/favicons?domain=polymersearch.com&sz=128"
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AI_TOOLS_DATA;
}
