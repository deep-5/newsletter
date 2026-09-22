const fs = require('fs');
const path = require('path');

const alternativesData = {
  categories: [
    { id: "all", name: "All Software", icon: "⚡" },
    { id: "ai-coding", name: "AI Coding & Agents", icon: "💻" },
    { id: "ai-models", name: "AI Chatbots & Models", icon: "🤖" },
    { id: "productivity", name: "Productivity & Notes", icon: "📝" },
    { id: "database-spreadsheets", name: "Databases & Spreadsheets", icon: "📊" },
    { id: "design-media", name: "Design & Creative Tools", icon: "🎨" },
    { id: "automation", name: "Automation & Workflows", icon: "⚡" },
    { id: "communication", name: "Chat & Collaboration", icon: "💬" },
    { id: "project-management", name: "Project Management", icon: "📋" },
    { id: "developer-tools", name: "Dev Tools & APIs", icon: "🛠️" },
    { id: "security-cloud", name: "Security & Cloud Storage", icon: "🔒" },
    { id: "analytics-marketing", name: "Analytics & Marketing", icon: "📈" }
  ],
  software: [
    {
      id: "cursor-ide",
      slug: "cursor-ide",
      name: "Cursor IDE",
      category: "ai-coding",
      categoryName: "AI Coding & Agents",
      domain: "cursor.com",
      proprietaryUrl: "https://cursor.com",
      logo: "https://www.google.com/s2/favicons?domain=cursor.com&sz=128",
      tagline: "The AI-first code editor built on VS Code with background agentic features.",
      description: "Cursor is an AI-powered code editor with agentic coding capabilities, multi-file edits, and chat over codebase. Discover community-built, self-hosted, and open-source alternatives that run with your own local or private LLM keys.",
      alternatives: [
        {
          name: "Continue.dev",
          slug: "continue-dev",
          domain: "continue.dev",
          website: "https://continue.dev",
          github: "https://github.com/continuedev/continue",
          stars: "22.5k",
          license: "Apache 2.0",
          selfHosted: true,
          description: "Leading open-source AI code assistant extension for VS Code and JetBrains. Connect any local LLM (Ollama, LM Studio) or frontier API (Claude 3.7, DeepSeek V3, GPT-4o).",
          highlights: ["Local LLMs & Custom Models", "Tab Autocomplete & Chat", "Multi-file context with @codebase", "Zero vendor lock-in"],
          techStack: ["TypeScript", "Python", "Rust", "Ollama", "VS Code Extension"]
        },
        {
          name: "Aider",
          slug: "aider",
          domain: "aider.chat",
          website: "https://aider.chat",
          github: "https://github.com/paul-gauthier/aider",
          stars: "28.4k",
          license: "Apache 2.0",
          selfHosted: true,
          description: "Terminal-based AI pair programming tool that edits files directly in your local git repository and automatically commits changes with descriptive commit messages.",
          highlights: ["Git repo map optimization", "Multi-file synchronized edits", "Voice-to-code support", "Supports Claude 3.7 & DeepSeek-R1"],
          techStack: ["Python", "Git", "Treesitter", "OpenAI / Anthropic API"]
        },
        {
          name: "Void Editor",
          slug: "void-editor",
          domain: "voideditor.com",
          website: "https://voideditor.com",
          github: "https://github.com/voideditor/void",
          stars: "11.8k",
          license: "Apache 2.0",
          selfHosted: true,
          description: "Open-source AI-first code editor designed as an open, private alternative to Cursor. Control all data, models, and indexing locally.",
          highlights: ["VS Code fork with native AI UX", "Local codebase vector indexing", "Full privacy guarantee", "Custom model endpoints"],
          techStack: ["TypeScript", "Electron", "VS Code Core"]
        },
        {
          name: "Roo Code (Cline Fork)",
          slug: "roo-code",
          domain: "roocode.com",
          website: "https://roocode.com",
          github: "https://github.com/RooVetGit/Roo-Code",
          stars: "14.2k",
          license: "Apache 2.0",
          selfHosted: true,
          description: "Autonomous coding agent extension inside VS Code that executes terminal commands, browses files, and creates complete pull requests.",
          highlights: ["Autonomous multi-step execution", "Custom system prompts & rules", "MCP (Model Context Protocol) integration", "Diff approval workflow"],
          techStack: ["TypeScript", "VS Code Extension", "MCP"]
        },
        {
          name: "Tabby",
          slug: "tabby",
          domain: "tabbyml.github.io",
          website: "https://tabbyml.github.io/tabby",
          github: "https://github.com/TabbyML/tabby",
          stars: "26.1k",
          license: "Apache 2.0",
          selfHosted: true,
          description: "Self-hosted AI coding assistant server with enterprise grade code completion and indexing that runs completely on-premises on GPUs/CPUs.",
          highlights: ["100% Self-Hosted & Air-Gapped", "Enterprise SSO & Permissions", "Hardware accelerated inference", "Multi-editor plugins"],
          techStack: ["Rust", "CUDA", "WebAssembly"]
        }
      ]
    },
    {
      id: "chatgpt-plus",
      slug: "chatgpt-plus",
      name: "ChatGPT Plus",
      category: "ai-models",
      categoryName: "AI Chatbots & Models",
      domain: "openai.com",
      proprietaryUrl: "https://chatgpt.com",
      logo: "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
      tagline: "OpenAI's flagship conversational model interface with web search, canvas & voice.",
      description: "ChatGPT is the industry-leading chatbot interface. Discover open-source Web UIs that give you identical or superior capabilities while letting you plug in DeepSeek, Claude, Llama 3, and private local models.",
      alternatives: [
        {
          name: "Open WebUI",
          slug: "open-webui",
          domain: "openwebui.com",
          website: "https://openwebui.com",
          github: "https://github.com/open-webui/open-webui",
          stars: "68.9k",
          license: "MIT",
          selfHosted: true,
          description: "Extensible, feature-rich, and user-friendly self-hosted AI interface with full Ollama & OpenAI API compatibility, RAG, Web Search, and multi-user authentication.",
          highlights: ["Native Ollama & OpenAI API support", "Built-in RAG with document upload", "Web search & Python code execution", "Role-based access control"],
          techStack: ["Svelte", "FastAPI", "Python", "Docker"]
        },
        {
          name: "LibreChat",
          slug: "librechat",
          domain: "librechat.ai",
          website: "https://librechat.ai",
          github: "https://github.com/danny-avila/LibreChat",
          stars: "22.3k",
          license: "MIT",
          selfHosted: true,
          description: "Every AI in one platform: ChatGPT-clone web UI supporting OpenAI, Anthropic Claude, Gemini, DeepSeek, Mistral, Ollama, and custom plugins.",
          highlights: ["Multi-model conversation fork & split", "Artifacts viewer & code sandbox", "DALL-E & Stable Diffusion generation", "Speech-to-text & TTS"],
          techStack: ["Node.js", "React", "MongoDB", "Docker"]
        },
        {
          name: "Jan.ai",
          slug: "jan-ai",
          domain: "jan.ai",
          website: "https://jan.ai",
          github: "https://github.com/janhq/jan",
          stars: "25.1k",
          license: "AGPL-3.0",
          selfHosted: true,
          description: "Open-source 100% offline ChatGPT alternative desktop app that runs GGUF models directly on your hardware with 1-click model downloads.",
          highlights: ["100% offline & local", "Local OpenAI-compatible API server", "Cortex engine for fast inference", "Cross-platform (Mac, Win, Linux)"],
          techStack: ["TypeScript", "C++", "Electron"]
        },
        {
          name: "Chatbox",
          slug: "chatbox",
          domain: "chatboxai.app",
          website: "https://chatboxai.app",
          github: "https://github.com/Bin-Huang/chatbox",
          stars: "27.8k",
          license: "GPL-3.0",
          selfHosted: true,
          description: "Open-source cross-platform desktop client for AI models with local markdown rendering, prompt management, and cloud backup sync.",
          highlights: ["Bring your own API keys", "Built-in Prompt Library", "Local data encryption", "Mobile & Desktop apps"],
          techStack: ["React", "Tauri", "Rust"]
        }
      ]
    },
    {
      id: "claude-ai",
      slug: "claude-ai",
      name: "Anthropic Claude",
      category: "ai-models",
      categoryName: "AI Chatbots & Models",
      domain: "anthropic.com",
      proprietaryUrl: "https://claude.ai",
      logo: "https://www.google.com/s2/favicons?domain=anthropic.com&sz=128",
      tagline: "Anthropic's frontier reasoning model and live interactive Artifacts workspace.",
      description: "Claude is known for human-like writing, massive 200k+ context windows, and code artifacts. Discover open-source tools with interactive live artifact rendering and frontier reasoning support.",
      alternatives: [
        {
          name: "LibreChat Artifacts",
          slug: "librechat-artifacts",
          domain: "librechat.ai",
          website: "https://librechat.ai",
          github: "https://github.com/danny-avila/LibreChat",
          stars: "22.3k",
          license: "MIT",
          selfHosted: true,
          description: "Self-hosted UI featuring complete Claude-style Artifacts side-by-side execution with React, HTML, Mermaid, and SVG live renderers.",
          highlights: ["Side-by-side Artifacts preview", "Direct Claude 3.7 API integration", "Custom agents & tools", "Full conversation export"],
          techStack: ["React", "Node.js", "MongoDB"]
        },
        {
          name: "DeepSeek Chat",
          slug: "deepseek-chat",
          domain: "deepseek.com",
          website: "https://chat.deepseek.com",
          github: "https://github.com/deepseek-ai",
          stars: "75.4k",
          license: "MIT",
          selfHosted: true,
          description: "Open-weights frontier reasoning models (DeepSeek-R1 & V3) matching Claude Opus and OpenAI o1 performance at 90% lower inference costs.",
          highlights: ["Open-weights available on HuggingFace", "Full chain-of-thought visibility", "Top-tier math & coding benchmark scores", "Local deployment with Ollama / vLLM"],
          techStack: ["Python", "PyTorch", "vLLM", "GGUF"]
        },
        {
          name: "Lobe Chat",
          slug: "lobe-chat",
          domain: "lobehub.com",
          website: "https://lobehub.com",
          github: "https://github.com/lobehub/lobe-chat",
          stars: "54.1k",
          license: "MIT",
          selfHosted: true,
          description: "Modern, design-led open-source AI workspace with plugin ecosystem, multi-agent market, and visual artifact previews.",
          highlights: ["Design-focused aesthetic", "Plugin market & function calling", "Mobile-first PWA & desktop app", "Self-hosted with 1-click Vercel/Docker"],
          techStack: ["Next.js", "TypeScript", "Tailwind CSS"]
        }
      ]
    },
    {
      id: "perplexity-ai",
      slug: "perplexity-ai",
      name: "Perplexity AI",
      category: "ai-models",
      categoryName: "AI Chatbots & Models",
      domain: "perplexity.ai",
      proprietaryUrl: "https://perplexity.ai",
      logo: "https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128",
      tagline: "AI conversational answer engine with real-time web citations and synthesis.",
      description: "Perplexity provides live web-grounded research answers with citations. Discover open-source AI search engines that let you search the web using SearXNG or Google with local LLMs.",
      alternatives: [
        {
          name: "Perplexica",
          slug: "perplexica",
          domain: "github.com",
          website: "https://github.com/ItzCrazy-Ad/Perplexica",
          github: "https://github.com/ItzCrazy-Ad/Perplexica",
          stars: "18.7k",
          license: "MIT",
          selfHosted: true,
          description: "Open-source AI-powered search engine deep research tool that uses local LLMs (Ollama) and SearXNG to search the live web and synthesize answers.",
          highlights: ["SearXNG metasearch engine backend", "Multiple Focus Modes (Academic, YouTube, Writing)", "100% Local LLM or Cloud API support", "Interactive source citation previews"],
          techStack: ["Next.js", "SearXNG", "Ollama", "Docker"]
        },
        {
          name: "Khoj",
          slug: "khoj",
          domain: "khoj.dev",
          website: "https://khoj.dev",
          github: "https://github.com/khoj-ai/khoj",
          stars: "19.8k",
          license: "AGPL-3.0",
          selfHosted: true,
          description: "Open-source AI personal research assistant that searches the web and your personal notes (Obsidian, Notion, PDFs, Markdown, GitHub).",
          highlights: ["Web search + local second brain search", "Obsidian & Emacs integrations", "Automation & scheduled research digests", "Self-hosted privacy"],
          techStack: ["Python", "FastAPI", "React"]
        },
        {
          name: "MindSearch",
          slug: "mindsearch",
          domain: "github.com",
          website: "https://github.com/InternLM/MindSearch",
          github: "https://github.com/InternLM/MindSearch",
          stars: "6.2k",
          license: "Apache 2.0",
          selfHosted: true,
          description: "Multi-agent search engine framework that simulates human research workflows by breaking complex queries into dynamic sub-queries across hundreds of pages.",
          highlights: ["Multi-agent parallel web search", "Deep multi-page synthesis", "Visual graph thought tree", "Open-source weights"],
          techStack: ["Python", "LangChain", "Gradio"]
        }
      ]
    },
    {
      id: "midjourney",
      slug: "midjourney",
      name: "Midjourney",
      category: "design-media",
      categoryName: "Design & Creative Tools",
      domain: "midjourney.com",
      proprietaryUrl: "https://midjourney.com",
      logo: "https://www.google.com/s2/favicons?domain=midjourney.com&sz=128",
      tagline: "Proprietary photorealistic image generation model accessible via Discord and Web.",
      description: "Midjourney is a closed-source image generator. Explore top open-source image generation ecosystems that run on your local GPU with unlimited generation and no monthly subscriptions.",
      alternatives: [
        {
          name: "ComfyUI",
          slug: "comfyui",
          domain: "github.com",
          website: "https://github.com/comfyanonymous/ComfyUI",
          github: "https://github.com/comfyanonymous/ComfyUI",
          stars: "63.2k",
          license: "GPL-3.0",
          selfHosted: true,
          description: "The most powerful and modular visual node-based GUI for Stable Diffusion, Flux.1, SDXL, and video generation models with zero subscription fees.",
          highlights: ["Node-based workflow automation", "Support for Flux.1, SDXL, Stable Video", "Extremely fast GPU memory management", "Massive custom node community"],
          techStack: ["Python", "PyTorch", "JavaScript", "CUDA"]
        },
        {
          name: "Fooocus",
          slug: "fooocus",
          domain: "github.com",
          website: "https://github.com/lllyasviel/Fooocus",
          github: "https://github.com/lllyasviel/Fooocus",
          stars: "43.1k",
          license: "GPL-3.0",
          selfHosted: true,
          description: "Midjourney-style minimalist image generation software based on SDXL. Simple prompt interface with automatic prompt expansion and styles.",
          highlights: ["Midjourney-like prompt simplicity", "Outpainting & inpainting included", "Faceswap & image prompt mixing", "Runs on modest 4GB-8GB GPUs"],
          techStack: ["Python", "Gradio", "PyTorch"]
        },
        {
          name: "AUTOMATIC1111 WebUI",
          slug: "automatic1111-webui",
          domain: "github.com",
          website: "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
          github: "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
          stars: "148.5k",
          license: "AGPL-3.0",
          selfHosted: true,
          description: "The definitive open-source browser interface for Stable Diffusion models with ControlNet, LoRA management, and extensive extension support.",
          highlights: ["ControlNet & LoRA integrations", "Text2Img, Img2Img, Upscaling", "Extensive plugin marketplace", "Active open-source community"],
          techStack: ["Python", "Gradio", "PyTorch"]
        },
        {
          name: "InvokeAI",
          slug: "invokeai",
          domain: "invoke.com",
          website: "https://invoke.com",
          github: "https://github.com/invoke-ai/InvokeAI",
          stars: "24.8k",
          license: "Apache 2.0",
          selfHosted: true,
          description: "Professional creative engine for generative image workflows featuring an infinite canvas, board asset management, and commercial-safe pipelines.",
          highlights: ["Infinite Canvas editor", "Multi-model management", "Commercial-friendly license", "Clean pro studio UI"],
          techStack: ["TypeScript", "Python", "React"]
        }
      ]
    },
    {
      id: "notion",
      slug: "notion",
      name: "Notion",
      category: "productivity",
      categoryName: "Productivity & Notes",
      domain: "notion.so",
      proprietaryUrl: "https://notion.so",
      logo: "https://www.google.com/s2/favicons?domain=notion.so&sz=128",
      tagline: "All-in-one collaborative workspace for notes, docs, wikis, and databases.",
      description: "Notion is a popular cloud workspace. Explore privacy-first, self-hostable, and offline-first modular document platforms with local storage guarantees.",
      alternatives: [
        {
          name: "AppFlowy",
          slug: "appflowy",
          domain: "appflowy.io",
          website: "https://appflowy.io",
          github: "https://github.com/AppFlowy-IO/AppFlowy",
          stars: "57.8k",
          license: "AGPL-3.0",
          selfHosted: true,
          description: "Leading open-source Notion alternative built with Flutter and Rust. 100% offline-first, private, and customizable with local databases and Kanban.",
          highlights: ["100% offline-first data ownership", "Local database tables, grids & boards", "Built-in AI writing assistant", "Native apps on Mac, Win, Linux, iOS, Android"],
          techStack: ["Flutter", "Rust", "SQLite"]
        },
        {
          name: "AFFiNE",
          slug: "affine",
          domain: "affine.pro",
          website: "https://affine.pro",
          github: "https://github.com/toeverything/AFFiNE",
          stars: "45.2k",
          license: "MIT",
          selfHosted: true,
          description: "Next-generation knowledge base that merges docs, whiteboards, and database tables into one unified collaborative spatial workspace.",
          highlights: ["Docs + Infinite Canvas Whiteboard", "True privacy & self-hostable with Docker", "Real-time multi-user collaboration", "Block-based modularity"],
          techStack: ["TypeScript", "Rust", "React", "Docker"]
        },
        {
          name: "Anytype",
          slug: "anytype",
          domain: "anytype.io",
          website: "https://anytype.io",
          github: "https://github.com/anyproto/anytype-ts",
          stars: "16.4k",
          license: "Any Source Available",
          selfHosted: true,
          description: "Local-first, peer-to-peer encrypted operating system for your notes, tasks, ideas, and knowledge graph without centralized servers.",
          highlights: ["End-to-end encrypted & P2P sync", "Object-oriented relational databases", "Works completely without internet", "Beautiful modern visual design"],
          techStack: ["Go", "TypeScript", "Electron", "IPFS / Anysync"]
        },
        {
          name: "Obsidian",
          slug: "obsidian",
          domain: "obsidian.md",
          website: "https://obsidian.md",
          github: "https://github.com/obsidianmd",
          stars: "110k+",
          license: "Free Proprietary Local",
          selfHosted: true,
          description: "Sharp, extensible knowledge base that works on top of a local folder of plain text Markdown files with an enormous community plugin ecosystem.",
          highlights: ["Plain Markdown files on your disk", "Visual interactive knowledge graph", "1,500+ Community plugins & themes", "Fast, private & future-proof"],
          techStack: ["TypeScript", "Electron", "Markdown"]
        }
      ]
    },
    {
      id: "airtable",
      slug: "airtable",
      name: "Airtable",
      category: "database-spreadsheets",
      categoryName: "Databases & Spreadsheets",
      domain: "airtable.com",
      proprietaryUrl: "https://airtable.com",
      logo: "https://www.google.com/s2/favicons?domain=airtable.com&sz=128",
      tagline: "Relational database and spreadsheet hybrid for building no-code apps.",
      description: "Airtable charges heavy per-user fees and locks your business data into proprietary silos. Explore open-source, self-hosted relational databases that connect directly to PostgreSQL.",
      alternatives: [
        {
          name: "NocoDB",
          slug: "nocodb",
          domain: "nocodb.com",
          website: "https://nocodb.com",
          github: "https://github.com/nocodb/nocodb",
          stars: "50.1k",
          license: "AGPL-3.0",
          selfHosted: true,
          description: "Open-source Airtable alternative that transforms any PostgreSQL, MySQL, SQLite, or SQL Server into a smart spreadsheet UI with instant REST APIs.",
          highlights: ["Connects to existing SQL databases", "Grid, Gallery, Kanban & Form views", "Auto-generated Swagger REST & GraphQL APIs", "Fine-grained role permissions"],
          techStack: ["Vue.js", "Node.js", "PostgreSQL", "Docker"]
        },
        {
          name: "Baserow",
          slug: "baserow",
          domain: "baserow.io",
          website: "https://baserow.io",
          github: "https://github.com/bram2w/baserow",
          stars: "13.4k",
          license: "MIT",
          selfHosted: true,
          description: "Open-source no-code database built with Django and Nuxt. Create relational databases, calculate formulas, and integrate with n8n seamlessly.",
          highlights: ["Real-time collaborative editing", "Formula fields & lookup relations", "Self-hosted with Docker or Cloud", "Webhooks and API builder"],
          techStack: ["Python", "Django", "Nuxt.js", "PostgreSQL"]
        },
        {
          name: "Grist",
          slug: "grist",
          domain: "getgrist.com",
          website: "https://getgrist.com",
          github: "https://github.com/gristlabs/grist-core",
          stars: "8.6k",
          license: "Apache 2.0",
          selfHosted: true,
          description: "Spreadsheet database hybrid with full Python formula support, relational data modeling, custom access rules, and automated backups.",
          highlights: ["Full Python formulas support", "Custom dashboard widgets & linking", "Granular column/row access control", "SQLite data format"],
          techStack: ["Python", "TypeScript", "SQLite"]
        }
      ]
    },
    {
      id: "zapier",
      slug: "zapier",
      name: "Zapier",
      category: "automation",
      categoryName: "Automation & Workflows",
      domain: "zapier.com",
      proprietaryUrl: "https://zapier.com",
      logo: "https://www.google.com/s2/favicons?domain=zapier.com&sz=128",
      tagline: "Proprietary workflow automation tool connecting web apps via step-based rules.",
      description: "Zapier charges high task-based pricing with execution limits. Discover self-hosted, scalable automation platforms with hundreds of native integrations and unlimited executions.",
      alternatives: [
        {
          name: "n8n (Self-Hosted)",
          slug: "n8n",
          domain: "n8n.io",
          website: "https://n8n.io",
          github: "https://github.com/n8n-io/n8n",
          stars: "61.2k",
          license: "Sustainable Use License",
          selfHosted: true,
          description: "Fair-code licensed visual workflow automation tool with AI agent nodes, LangChain support, 400+ native integrations, and unlimited local executions.",
          highlights: ["Native AI Agent & LangChain nodes", "400+ integrations (Slack, Gmail, DBs)", "Full JavaScript & Python code execution", "Run locally with Docker with zero task limits"],
          techStack: ["TypeScript", "Vue.js", "Node.js", "Docker"]
        },
        {
          name: "Activepieces",
          slug: "activepieces",
          domain: "activepieces.com",
          website: "https://activepieces.com",
          github: "https://github.com/activepieces/activepieces",
          stars: "11.7k",
          license: "MIT",
          selfHosted: true,
          description: "Open-source no-code workflow automation tool designed specifically as a community-driven, 100% open Zapier alternative with modern TypeScript pieces.",
          highlights: ["100% MIT Licensed core", "Modern clean UI & intuitive builder", "Write custom pieces in TypeScript", "Self-hosted with Docker Compose"],
          techStack: ["TypeScript", "Angular", "Node.js", "PostgreSQL"]
        },
        {
          name: "Windmill",
          slug: "windmill",
          domain: "windmill.dev",
          website: "https://windmill.dev",
          github: "https://github.com/windmill-labs/windmill",
          stars: "13.8k",
          license: "AGPL-3.0",
          selfHosted: true,
          description: "Open-source developer platform for workflows, internal tools, scripts, and UIs. Turns Python, TypeScript, Go, and Bash scripts into scalable background jobs.",
          highlights: ["Fast Rust backend (10x faster execution)", "Auto-generated UIs for scripts", "Flow builder with branching & loops", "Enterprise secret management"],
          techStack: ["Rust", "TypeScript", "Python", "Svelte"]
        }
      ]
    },
    {
      id: "make",
      slug: "make",
      name: "Make (Integromat)",
      category: "automation",
      categoryName: "Automation & Workflows",
      domain: "make.com",
      proprietaryUrl: "https://make.com",
      logo: "https://www.google.com/s2/favicons?domain=make.com&sz=128",
      tagline: "Visual integration platform for designing complex multi-step automated workflows.",
      description: "Make charges per-operation and can get expensive quickly as data transfers scale. Discover open-source automation engines with infinite branches and self-hosted control.",
      alternatives: [
        {
          name: "n8n",
          slug: "n8n",
          domain: "n8n.io",
          website: "https://n8n.io",
          github: "https://github.com/n8n-io/n8n",
          stars: "61.2k",
          license: "Sustainable Use License",
          selfHosted: true,
          description: "Visual node-based workflow builder with complex data transformation, JSON mapping, webhooks, and sub-workflow executions.",
          highlights: ["Infinite branch & error routing", "Sub-workflow triggers", "Built-in webhook listener", "Self-hosted unlimited runs"],
          techStack: ["TypeScript", "Node.js", "Docker"]
        },
        {
          name: "Automatisch",
          slug: "automatisch",
          domain: "automatisch.io",
          website: "https://automatisch.io",
          github: "https://github.com/automatisch/automatisch",
          stars: "5.3k",
          license: "AGPL-3.0",
          selfHosted: true,
          description: "Open-source business automation tool that lets you connect services while keeping data within your private infrastructure.",
          highlights: ["Privacy & GDPR compliant", "No code required", "Self-hosted Docker setup", "Direct API triggers"],
          techStack: ["React", "Node.js", "PostgreSQL"]
        }
      ]
    },
    {
      id: "figma",
      slug: "figma",
      name: "Figma",
      category: "design-media",
      categoryName: "Design & Creative Tools",
      domain: "figma.com",
      proprietaryUrl: "https://figma.com",
      logo: "https://www.google.com/s2/favicons?domain=figma.com&sz=128",
      tagline: "Collaborative interface design, prototyping, and design system platform.",
      description: "Figma is a dominant cloud UI design tool. Discover open-source, web-standard SVG and CSS-based design platforms that you can self-host for your entire team.",
      alternatives: [
        {
          name: "Penpot",
          slug: "penpot",
          domain: "penpot.app",
          website: "https://penpot.app",
          github: "https://github.com/penpot/penpot",
          stars: "34.5k",
          license: "MPL-2.0",
          selfHosted: true,
          description: "First open-source web-based design and prototyping tool for cross-functional teams based natively on open web standards (SVG, CSS Flexbox & CSS Grid).",
          highlights: ["Native CSS Grid & Flexbox layout engine", "SVG native vector rendering", "Interactive prototyping & components", "Self-hosted on Docker"],
          techStack: ["Clojure", "ClojureScript", "SVG", "Docker"]
        },
        {
          name: "Lunacy",
          slug: "lunacy",
          domain: "icons8.com",
          website: "https://icons8.com/lunacy",
          github: "https://github.com/icons8/lunacy",
          stars: "5.1k",
          license: "Free Proprietary Local",
          selfHosted: true,
          description: "Free next-gen vector graphic design software with built-in graphics assets, AI tools (background removal, upscaler, avatar generator), and offline mode.",
          highlights: ["Works completely offline", "Built-in icons, photos & illustrations", "AI image enhancement tools", "Reads and writes Sketch & Figma files"],
          techStack: ["C#", ".NET Core", "Avalonia"]
        }
      ]
    },
    {
      id: "canva",
      slug: "canva",
      name: "Canva",
      category: "design-media",
      categoryName: "Design & Creative Tools",
      domain: "canva.com",
      proprietaryUrl: "https://canva.com",
      logo: "https://www.google.com/s2/favicons?domain=canva.com&sz=128",
      tagline: "Popular drag-and-drop graphic design and social media creative platform.",
      description: "Canva puts templates and export features behind paid plans. Explore free, open-source and web-based graphics editors for social media and design creation.",
      alternatives: [
        {
          name: "Photopea",
          slug: "photopea",
          domain: "photopea.com",
          website: "https://photopea.com",
          github: "https://github.com/photopea",
          stars: "58.4k",
          license: "Free Web",
          selfHosted: false,
          description: "Advanced web-based photo and graphics editor supporting PSD, AI, XD, Sketch, PDF, RAW, and standard web formats with zero installation.",
          highlights: ["Full Photoshop-like toolset in browser", "Opens PSD, AI, XD, Sketch files", "Runs entirely client-side", "Zero installation needed"],
          techStack: ["JavaScript", "HTML5 Canvas", "WebGL"]
        },
        {
          name: "Polotno Studio",
          slug: "polotno-studio",
          domain: "studio.polotno.com",
          website: "https://studio.polotno.com",
          github: "https://github.com/lavrton/polotno-studio",
          stars: "3.2k",
          license: "Open Source SDK",
          selfHosted: true,
          description: "Free web-based design editor built specifically as an open-source Canva replacement with social media presets, text effects, and image export.",
          highlights: ["Canva-like drag and drop UX", "No account or watermark required", "Stock photo & vector search", "Fast high-res PNG & PDF export"],
          techStack: ["React", "Konva.js", "TypeScript"]
        },
        {
          name: "GIMP",
          slug: "gimp",
          domain: "gimp.org",
          website: "https://gimp.org",
          github: "https://github.com/GNOME/gimp",
          stars: "5.8k",
          license: "GPL-3.0",
          selfHosted: true,
          description: "The classic open-source image manipulation program for photo retouching, image composition, and creative graphic authoring.",
          highlights: ["Full raster image manipulation", "Extensible with Python scripts", "Color management & high bit depth", "100% Free Forever"],
          techStack: ["C", "GTK", "GEGL"]
        }
      ]
    },
    {
      id: "slack",
      slug: "slack",
      name: "Slack",
      category: "communication",
      categoryName: "Chat & Collaboration",
      domain: "slack.com",
      proprietaryUrl: "https://slack.com",
      logo: "https://www.google.com/s2/favicons?domain=slack.com&sz=128",
      tagline: "Enterprise team chat, messaging channels, audio huddles, and bot workflows.",
      description: "Slack stores business communications on external servers and deletes message history on free tiers. Discover self-hosted, encrypted team collaboration platforms.",
      alternatives: [
        {
          name: "Mattermost",
          slug: "mattermost",
          domain: "mattermost.com",
          website: "https://mattermost.com",
          github: "https://github.com/mattermost/mattermost-server",
          stars: "31.2k",
          license: "AGPL-3.0",
          selfHosted: true,
          description: "Open-source, self-hosted Slack alternative for technical and enterprise teams with secure messaging, audio calls, incident response, and Kanban boards.",
          highlights: ["Full Slack UX compatibility & import", "Audio calls & screen sharing", "Built-in Playbooks & Boards", "Self-hosted compliance & security"],
          techStack: ["Go", "React", "PostgreSQL", "Docker"]
        },
        {
          name: "Zulip",
          slug: "zulip",
          domain: "zulip.com",
          website: "https://zulip.com",
          github: "https://github.com/zulip/zulip",
          stars: "21.6k",
          license: "Apache 2.0",
          selfHosted: true,
          description: "Open-source team chat app that combines the real-time speed of Slack with the organized threading structure of email discussions.",
          highlights: ["Unique stream & topic threading model", "Never lose context in busy teams", "Markdown formatting & LaTeX math", "100% Free Open-Source self-hosted"],
          techStack: ["Python", "Django", "TypeScript", "PostgreSQL"]
        },
        {
          name: "Element (Matrix)",
          slug: "element-matrix",
          domain: "element.io",
          website: "https://element.io",
          github: "https://github.com/element-hq/element-web",
          stars: "12.8k",
          license: "Apache 2.0",
          selfHosted: true,
          description: "Decentralized, end-to-end encrypted secure messaging and collaboration app built on the open Matrix communication standard.",
          highlights: ["End-to-End Encryption (E2EE)", "Decentralized federation across servers", "Voice & video group calling", "Bridges to Slack, Discord & WhatsApp"],
          techStack: ["TypeScript", "Matrix Protocol", "React"]
        }
      ]
    },
    {
      id: "jira",
      slug: "jira",
      name: "Jira Software",
      category: "project-management",
      categoryName: "Project Management",
      domain: "atlassian.com",
      proprietaryUrl: "https://atlassian.com/software/jira",
      logo: "https://www.google.com/s2/favicons?domain=atlassian.com&sz=128",
      tagline: "Issue tracking, agile sprint planning, and project management for software teams.",
      description: "Jira is complex, slow, and expensive for modern engineering teams. Explore lightweight, fast, open-source issue trackers and project management platforms.",
      alternatives: [
        {
          name: "Plane",
          slug: "plane",
          domain: "plane.so",
          website: "https://plane.so",
          github: "https://github.com/makeplane/plane",
          stars: "34.1k",
          license: "Apache 2.0",
          selfHosted: true,
          description: "Open-source software development project management tool built with a modern Linear-like aesthetic. Manage issues, cycles, modules, and roadmaps.",
          highlights: ["Fast, modern Linear-inspired UI", "Issues, Cycles, Modules & Pages", "GitHub & Slack synchronizations", "Self-hosted with Docker Compose"],
          techStack: ["Next.js", "Django", "TypeScript", "PostgreSQL"]
        },
        {
          name: "Taiga",
          slug: "taiga",
          domain: "taiga.io",
          website: "https://taiga.io",
          github: "https://github.com/taigaio/taiga-front",
          stars: "7.8k",
          license: "MPL-2.0",
          selfHosted: true,
          description: "Award-winning open-source project management system for agile developers, designers, and project managers with Scrum and Kanban boards.",
          highlights: ["Scrum & Kanban boards", "Custom estimation points & sprints", "Clean intuitive interface", "Self-hosted Docker deployment"],
          techStack: ["Python", "Angular", "PostgreSQL"]
        },
        {
          name: "Leantime",
          slug: "leantime",
          domain: "leantime.io",
          website: "https://leantime.io",
          github: "https://github.com/Leantime/leantime",
          stars: "6.9k",
          license: "GPL-2.0",
          selfHosted: true,
          description: "Open-source strategic project management system combining goals, ideas, roadmaps, and tasks tailored for ADHD and cross-functional teams.",
          highlights: ["Goal & strategy alignment", "Built-in idea boards & research", "Simple milestone tracking", "Self-hostable PHP/MySQL stack"],
          techStack: ["PHP", "JavaScript", "MySQL"]
        }
      ]
    },
    {
      id: "postman",
      slug: "postman",
      name: "Postman",
      category: "developer-tools",
      categoryName: "Dev Tools & APIs",
      domain: "postman.com",
      proprietaryUrl: "https://postman.com",
      logo: "https://www.google.com/s2/favicons?domain=postman.com&sz=128",
      tagline: "API platform for building and using APIs, testing, and team collections.",
      description: "Postman enforced cloud login and removed offline scratchpads. Discover open-source, local-first API clients that keep collections safely in your Git repositories.",
      alternatives: [
        {
          name: "Hoppscotch",
          slug: "hoppscotch",
          domain: "hoppscotch.io",
          website: "https://hoppscotch.io",
          github: "https://github.com/hoppscotch/hoppscotch",
          stars: "66.3k",
          license: "MIT",
          selfHosted: true,
          description: "Open-source lightweight, blazing-fast API development ecosystem with REST, GraphQL, WebSocket, SSE, and Socket.IO testing.",
          highlights: ["Blazing fast lightweight web & desktop UI", "REST, GraphQL, gRPC & WebSocket support", "Self-hostable with single Docker command", "Environment variables & test scripts"],
          techStack: ["Vue.js", "TypeScript", "Nuxt.js"]
        },
        {
          name: "Bruno",
          slug: "bruno",
          domain: "usebruno.com",
          website: "https://usebruno.com",
          github: "https://github.com/usebruno/bruno",
          stars: "31.8k",
          license: "MIT",
          selfHosted: true,
          description: "Fast, Git-friendly open-source API client that stores collections directly in plain text Bru markup files in your codebase folder.",
          highlights: ["Stores collections in your Git repository", "100% offline & local-first", "No cloud sync or forced account login", "Scripting with npm packages"],
          techStack: ["TypeScript", "Electron", "React"]
        },
        {
          name: "Yaak",
          slug: "yaak",
          domain: "yaak.app",
          website: "https://yaak.app",
          github: "https://github.com/mountain-loop/yaak",
          stars: "5.4k",
          license: "MIT",
          selfHosted: true,
          description: "Extremely fast desktop REST, GraphQL, and gRPC client built in Rust and Tauri with native OS performance and offline storage.",
          highlights: ["Built with Rust & Tauri (lightweight memory)", "Fast native macOS, Windows, Linux apps", "gRPC, REST & GraphQL in one tool", "Local SQLite storage"],
          techStack: ["Rust", "Tauri", "React"]
        }
      ]
    },
    {
      id: "1password",
      slug: "1password",
      name: "1Password",
      category: "security-cloud",
      categoryName: "Security & Cloud Storage",
      domain: "1password.com",
      proprietaryUrl: "https://1password.com",
      logo: "https://www.google.com/s2/favicons?domain=1password.com&sz=128",
      tagline: "Proprietary subscription password manager for individuals and enterprise teams.",
      description: "1Password requires a monthly subscription and stores passwords in proprietary cloud vaults. Discover open-source, audited password managers with zero-knowledge encryption.",
      alternatives: [
        {
          name: "Bitwarden / Vaultwarden",
          slug: "bitwarden",
          domain: "bitwarden.com",
          website: "https://bitwarden.com",
          github: "https://github.com/bitwarden/server",
          stars: "36.2k",
          license: "GPL-3.0",
          selfHosted: true,
          description: "The gold standard open-source password manager. Secure, end-to-end encrypted password storage with desktop, mobile, browser, and CLI apps.",
          highlights: ["Audited zero-knowledge encryption", "Lightweight self-hosting via Vaultwarden (Rust)", "Autofill on iOS, Android, and all browsers", "Passkey support & 2FA authenticator"],
          techStack: ["C#", "Rust", "TypeScript", "Docker"]
        },
        {
          name: "KeePassXC",
          slug: "keepassxc",
          domain: "keepassxc.org",
          website: "https://keepassxc.org",
          github: "https://github.com/keepassxreboot/keepassxc",
          stars: "22.5k",
          license: "GPL-2.0 / GPL-3.0",
          selfHosted: true,
          description: "Community-driven, cross-platform password manager that stores passwords in standard encrypted .kdbx files stored entirely locally.",
          highlights: ["100% offline & local file storage", "Hardware key support (YubiKey)", "Auto-type & browser integration", "No servers or cloud dependencies"],
          techStack: ["C++", "Qt5", "Argon2"]
        },
        {
          name: "Passbolt",
          slug: "passbolt",
          domain: "passbolt.com",
          website: "https://passbolt.com",
          github: "https://github.com/passbolt/passbolt_api",
          stars: "4.8k",
          license: "AGPL-3.0",
          selfHosted: true,
          description: "Open-source, privacy-first password manager specifically built for engineering and business teams with OpenPGP encryption and audit logs.",
          highlights: ["OpenPGP standard encryption", "Granular team sharing permissions", "REST API & CLI tool", "Self-hosted Docker deployment"],
          techStack: ["PHP", "OpenPGP", "MySQL"]
        }
      ]
    },
    {
      id: "google-drive",
      slug: "google-drive",
      name: "Google Drive",
      category: "security-cloud",
      categoryName: "Security & Cloud Storage",
      domain: "google.com/drive",
      proprietaryUrl: "https://google.com/drive",
      logo: "https://www.google.com/s2/favicons?domain=google.com&sz=128",
      tagline: "Cloud file storage, document backup, and Google Workspace integration.",
      description: "Google Drive scans user files and monetizes user data. Discover self-hosted private cloud storage platforms that turn your own servers or home NAS into private cloud storage.",
      alternatives: [
        {
          name: "Nextcloud",
          slug: "nextcloud",
          domain: "nextcloud.com",
          website: "https://nextcloud.com",
          github: "https://github.com/nextcloud/server",
          stars: "28.5k",
          license: "AGPL-3.0",
          selfHosted: true,
          description: "The most widely deployed self-hosted productivity and cloud storage platform. Full file sync, office document editing, calendar, and video calls.",
          highlights: ["100% Data privacy on your own server", "Collabora Online / OnlyOffice integration", "End-to-end encryption support", "Desktop & mobile automatic camera upload"],
          techStack: ["PHP", "Vue.js", "MySQL / PostgreSQL", "Docker"]
        },
        {
          name: "Syncthing",
          slug: "syncthing",
          domain: "syncthing.net",
          website: "https://syncthing.net",
          github: "https://github.com/syncthing/syncthing",
          stars: "66.4k",
          license: "MPL-2.0",
          selfHosted: true,
          description: "Continuous peer-to-peer file synchronization program that syncs files directly between your devices without storing data on any centralized cloud.",
          highlights: ["Peer-to-peer decentralized sync", "TLS encrypted device-to-device transfers", "No storage capacity limits", "Runs on Mac, Windows, Linux, Android, NAS"],
          techStack: ["Go", "Block Exchange Protocol", "Web UI"]
        },
        {
          name: "Seafile",
          slug: "seafile",
          domain: "seafile.com",
          website: "https://seafile.com",
          github: "https://github.com/haiwen/seafile",
          stars: "13.2k",
          license: "GPL-2.0",
          selfHosted: true,
          description: "High-performance self-hosted file sync and share solution with client-side encryption and Git-like block-level deduplication.",
          highlights: ["Blazing-fast C core sync engine", "Block-level delta sync", "Client-side library encryption", "Drive mapping for desktop"],
          techStack: ["C", "Python", "Django", "MySQL"]
        }
      ]
    },
    {
      id: "loom",
      slug: "loom",
      name: "Loom",
      category: "design-media",
      categoryName: "Design & Creative Tools",
      domain: "loom.com",
      proprietaryUrl: "https://loom.com",
      logo: "https://www.google.com/s2/favicons?domain=loom.com&sz=128",
      tagline: "Asynchronous video messaging and screen recording platform.",
      description: "Loom caps recordings on free plans and locks videos behind subscriptions. Discover open-source screen recording tools with instant link sharing and self-hosted storage.",
      alternatives: [
        {
          name: "Cap",
          slug: "cap",
          domain: "cap.so",
          website: "https://cap.so",
          github: "https://github.com/CapSoftware/Cap",
          stars: "8.9k",
          license: "AGPL-3.0",
          selfHosted: true,
          description: "Open-source Loom alternative with instant link sharing, camera bubble recording, and S3-compatible self-hosted video storage.",
          highlights: ["Camera bubble + screen recording", "Instant shareable links", "Uploads directly to your own S3/R2 bucket", "Lightweight native desktop app"],
          techStack: ["Rust", "Tauri", "Next.js", "TypeScript"]
        },
        {
          name: "Screenity",
          slug: "screenity",
          domain: "screenity.io",
          website: "https://screenity.io",
          github: "https://github.com/alyssaxuu/screenity",
          stars: "11.2k",
          license: "GPL-3.0",
          selfHosted: true,
          description: "The free and open-source screen recorder extension for Chrome. Annotate screens, blur sensitive data, and export to MP4/GIF.",
          highlights: ["Free with zero watermarks or limits", "On-screen drawing annotations", "Blur sensitive areas on screen", "Export to MP4, WebM, or GIF"],
          techStack: ["JavaScript", "WebRTC", "Browser Extension"]
        },
        {
          name: "OBS Studio",
          slug: "obs-studio",
          domain: "obsproject.com",
          website: "https://obsproject.com",
          github: "https://github.com/obsproject/obs-studio",
          stars: "61.5k",
          license: "GPL-2.0",
          selfHosted: true,
          description: "Industry-standard open-source video recording and live streaming software with scene compositing, audio mixing, and GPU encoding.",
          highlights: ["Professional multi-source compositing", "Hardware accelerated NVENC/AMD encoding", "Massive plugin ecosystem", "100% Free Open-Source forever"],
          techStack: ["C", "C++", "FFmpeg", "Qt"]
        }
      ]
    },
    {
      id: "google-analytics",
      slug: "google-analytics",
      name: "Google Analytics (GA4)",
      category: "analytics-marketing",
      categoryName: "Analytics & Marketing",
      domain: "analytics.google.com",
      proprietaryUrl: "https://analytics.google.com",
      logo: "https://www.google.com/s2/favicons?domain=google.com&sz=128",
      tagline: "Proprietary web and mobile app tracking with complex GA4 reports.",
      description: "Google Analytics tracks personal user data and requires cookie consent banners under GDPR. Discover lightweight, privacy-focused open-source analytics.",
      alternatives: [
        {
          name: "Plausible Analytics",
          slug: "plausible-analytics",
          domain: "plausible.io",
          website: "https://plausible.io",
          github: "https://github.com/plausible/analytics",
          stars: "20.1k",
          license: "AGPL-3.0",
          selfHosted: true,
          description: "Simple, lightweight (<1 KB script), and privacy-friendly Google Analytics alternative. Fully compliant with GDPR, CCPA, and PECR with no cookies required.",
          highlights: ["<1 KB lightweight tracking script", "Zero cookies & 100% GDPR compliant", "Clean single-page dashboard", "Self-hosted with Docker & ClickHouse"],
          techStack: ["Elixir", "Phoenix", "ClickHouse", "PostgreSQL"]
        },
        {
          name: "Umami",
          slug: "umami",
          domain: "umami.is",
          website: "https://umami.is",
          github: "https://github.com/umami-software/umami",
          stars: "24.8k",
          license: "MIT",
          selfHosted: true,
          description: "Open-source, self-hosted web analytics alternative to Google Analytics built with Node.js and Next.js that respects visitor privacy.",
          highlights: ["100% MIT Licensed", "Track custom events & pageviews", "Supports PostgreSQL & MySQL", "Clean modern UI"],
          techStack: ["Next.js", "Prisma", "PostgreSQL / MySQL"]
        },
        {
          name: "PostHog",
          slug: "posthog",
          domain: "posthog.com",
          website: "https://posthog.com",
          github: "https://github.com/PostHog/posthog",
          stars: "24.3k",
          license: "MIT / Open-Source",
          selfHosted: true,
          description: "The complete open-source product analytics suite: product analytics, session replays, feature flags, A/B testing, and user surveys in one platform.",
          highlights: ["Product analytics & funnels", "Session replays with privacy masking", "Feature flags & A/B testing", "Self-hostable enterprise analytics"],
          techStack: ["Python", "Django", "TypeScript", "ClickHouse", "React"]
        }
      ]
    },
    {
      id: "vercel",
      slug: "vercel",
      name: "Vercel / Netlify",
      category: "developer-tools",
      categoryName: "Dev Tools & APIs",
      domain: "vercel.com",
      proprietaryUrl: "https://vercel.com",
      logo: "https://www.google.com/s2/favicons?domain=vercel.com&sz=128",
      tagline: "Cloud deployment platform for frontend web apps and serverless functions.",
      description: "Vercel bandwidth and serverless function limits trigger surprising bills. Discover self-hosted PaaS solutions that turn any $5/month VPS into your own private Vercel.",
      alternatives: [
        {
          name: "Coolify",
          slug: "coolify",
          domain: "coolify.io",
          website: "https://coolify.io",
          github: "https://github.com/coollabsio/coolify",
          stars: "38.2k",
          license: "Apache 2.0",
          selfHosted: true,
          description: "An open-source, self-hostable Heroku & Vercel alternative. Deploy apps, databases, and services to your own server via Git with automated SSL certificates.",
          highlights: ["Auto-deploy on git push", "Free automatic SSL certificates", "1-click deploy databases (Postgres, Redis, Mongo)", "Deploy to any Linux server or VPS"],
          techStack: ["PHP", "Laravel", "Docker", "Tailwind CSS"]
        },
        {
          name: "Dokku",
          slug: "dokku",
          domain: "dokku.com",
          website: "https://dokku.com",
          github: "https://github.com/dokku/dokku",
          stars: "26.4k",
          license: "MIT",
          selfHosted: true,
          description: "The smallest PaaS implementation you've ever seen. Push code with `git push dokku main` and let Docker build and run your web apps automatically.",
          highlights: ["Simple git push deployment", "Heroku buildpack & Dockerfile support", "Zero-downtime deployments", "Extensible plugin architecture"],
          techStack: ["Go", "Bash", "Docker"]
        },
        {
          name: "CapRover",
          slug: "caprover",
          domain: "caprover.com",
          website: "https://caprover.com",
          github: "https://github.com/caprover/caprover",
          stars: "14.1k",
          license: "Apache 2.0",
          selfHosted: true,
          description: "Extremely easy-to-use self-hosted PaaS for NodeJS, Python, PHP, Ruby, Go, and Java applications with built-in Let's Encrypt SSL.",
          highlights: ["Visual web dashboard", "1-click app store (WordPress, Nextcloud, etc.)", "Docker Swarm clustering support", "Free SSL in one click"],
          techStack: ["TypeScript", "Node.js", "Docker Swarm"]
        }
      ]
    },
    {
      id: "supabase-firebase",
      slug: "supabase-firebase",
      name: "Firebase / Supabase",
      category: "database-spreadsheets",
      categoryName: "Databases & Spreadsheets",
      domain: "firebase.google.com",
      proprietaryUrl: "https://firebase.google.com",
      logo: "https://www.google.com/s2/favicons?domain=firebase.google.com&sz=128",
      tagline: "Backend-as-a-Service providing authentication, real-time database, and storage.",
      description: "Firebase locks developers into proprietary Google infrastructure. Discover self-hosted, lightweight backend suites with realtime data and authentication.",
      alternatives: [
        {
          name: "PocketBase",
          slug: "pocketbase",
          domain: "pocketbase.io",
          website: "https://pocketbase.io",
          github: "https://github.com/pocketbase/pocketbase",
          stars: "44.2k",
          license: "MIT",
          selfHosted: true,
          description: "Open-source backend in 1 single executable file. Embedded SQLite database with realtime subscriptions, built-in auth, and file storage.",
          highlights: ["Single lightweight binary (<20MB)", "Realtime database subscriptions", "OAuth2 & Email authentication", "Admin dashboard included"],
          techStack: ["Go", "SQLite", "Svelte"]
        },
        {
          name: "Appwrite",
          slug: "appwrite",
          domain: "appwrite.io",
          website: "https://appwrite.io",
          github: "https://github.com/appwrite/appwrite",
          stars: "45.8k",
          license: "BSD-3-Clause",
          selfHosted: true,
          description: "Complete end-to-end backend server for web, mobile, and flutter developers packaged as a set of Docker microservices.",
          highlights: ["Auth, Databases, Storage & Functions", "SDKs for React, Flutter, iOS, Android", "Webhooks & background workers", "Self-hosted with Docker"],
          techStack: ["PHP", "TypeScript", "Redis", "MariaDB / PostgreSQL"]
        }
      ]
    }
  ]
};

const filePath = path.join(__dirname, '..', 'data', 'alternatives.js');
const fileContent = `/**
 * AIRA Newsletter - 100% Curated Open-Source & Modern Software Alternatives Dataset
 * Total Curated Software Collections: ${alternativesData.software.length}
 */

const ALTERNATIVES_DATA = ${JSON.stringify(alternativesData, null, 2)};

if (typeof module !== 'undefined') {
  module.exports = ALTERNATIVES_DATA;
}
`;

fs.writeFileSync(filePath, fileContent, 'utf8');
console.log('Successfully written data/alternatives.js with ' + alternativesData.software.length + ' comprehensive software collections!');
