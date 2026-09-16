/**
 * AIRA Newsletter - Open Source Software Alternatives Dataset
 * Curated list of top proprietary software tools and their open-source alternatives
 */

const ALTERNATIVES_DATA = {
  "categories": [
    {
      "id": "all",
      "name": "All Software",
      "icon": "\u2728"
    },
    {
      "id": "ai-coding",
      "name": "AI & Coding",
      "icon": "\ud83e\udd16"
    },
    {
      "id": "productivity",
      "name": "Productivity & Project",
      "icon": "\u26a1"
    },
    {
      "id": "design-media",
      "name": "Design & Media",
      "icon": "\ud83c\udfa8"
    },
    {
      "id": "devtools-cloud",
      "name": "DevTools & Backend",
      "icon": "\ud83d\udcbb"
    },
    {
      "id": "automation-analytics",
      "name": "Automation & Data",
      "icon": "\ud83d\udcc8"
    }
  ],
  "software": [
    {
      "slug": "claude-code",
      "name": "Claude Code",
      "category": "ai-coding",
      "categoryName": "AI & Coding",
      "domain": "claude.ai",
      "logo": "https://www.google.com/s2/favicons?domain=claude.ai&sz=128",
      "tagline": "Agentic CLI coding assistant from Anthropic that executes workflows in your terminal.",
      "proprietaryUrl": "https://claude.ai",
      "description": "Claude Code is an agentic command-line tool that enables developers to edit code, execute terminal commands, run unit tests, and implement complex features across large codebases using natural language.",
      "alternatives": [
        {
          "name": "OpenCode",
          "slug": "opencode",
          "domain": "opencode.ai",
          "logo": "https://www.google.com/s2/favicons?domain=github.com&sz=128",
          "stars": "18.4k",
          "license": "MIT",
          "selfHosted": true,
          "techStack": [
            "TypeScript",
            "Node.js",
            "LLM APIs"
          ],
          "website": "https://github.com/opencode-ai/opencode",
          "github": "https://github.com/opencode-ai/opencode",
          "description": "An open-source terminal-based AI coding assistant that indexes your repository, explains logic, and writes code across multiple files.",
          "highlights": [
            "Zero telemetry",
            "Supports local Ollama models",
            "Git integration"
          ]
        },
        {
          "name": "OpenHands",
          "slug": "openhands",
          "domain": "all-hands.dev",
          "logo": "https://www.google.com/s2/favicons?domain=all-hands.dev&sz=128",
          "stars": "42.8k",
          "license": "MIT",
          "selfHosted": true,
          "techStack": [
            "Python",
            "Docker",
            "React",
            "FastAPI"
          ],
          "website": "https://all-hands.dev",
          "github": "https://github.com/All-Hands-AI/OpenHands",
          "description": "A platform for software development agents capable of modifying code, running terminal commands, web browsing, and calling APIs.",
          "highlights": [
            "Sandboxed Docker environment",
            "Browser interaction",
            "Multi-agent coordination"
          ]
        },
        {
          "name": "Cline (Claude Dev)",
          "slug": "cline",
          "domain": "github.com",
          "logo": "https://www.google.com/s2/favicons?domain=github.com&sz=128",
          "stars": "24.5k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "techStack": [
            "TypeScript",
            "VS Code Extension",
            "MCP Protocol"
          ],
          "website": "https://github.com/cline/cline",
          "github": "https://github.com/cline/cline",
          "description": "Autonomous coding agent in VS Code that creates and edits files, executes terminal commands, and uses MCP tools with human approvals.",
          "highlights": [
            "Model Context Protocol (MCP)",
            "Diff preview before applying",
            "Custom API key support"
          ]
        },
        {
          "name": "Aider",
          "slug": "aider",
          "domain": "aider.chat",
          "logo": "https://www.google.com/s2/favicons?domain=aider.chat&sz=128",
          "stars": "28.1k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "techStack": [
            "Python",
            "Git",
            "Tree-Sitter"
          ],
          "website": "https://aider.chat",
          "github": "https://github.com/paul-gauthier/aider",
          "description": "AI pair programming in your terminal. Aider lets you pair with LLMs to edit code in your local git repository with automatic commits.",
          "highlights": [
            "Automatic git commits with sensible messages",
            "Whole repository map",
            "Multi-file refactoring"
          ]
        },
        {
          "name": "Zed AI",
          "slug": "zed",
          "domain": "zed.dev",
          "logo": "https://www.google.com/s2/favicons?domain=zed.dev&sz=128",
          "stars": "53.2k",
          "license": "GPL-3.0 / Apache 2.0",
          "selfHosted": true,
          "techStack": [
            "Rust",
            "GPUI",
            "Tree-Sitter"
          ],
          "website": "https://zed.dev",
          "github": "https://github.com/zed-industries/zed",
          "description": "High-performance, multiplayer code editor from the creators of Atom, featuring built-in AI assistance and custom model integration.",
          "highlights": [
            "Blazing fast Rust architecture",
            "Built-in AI Assistant panel",
            "Real-time collaborative editing"
          ]
        }
      ]
    },
    {
      "slug": "cursor",
      "name": "Cursor",
      "category": "ai-coding",
      "categoryName": "AI & Coding",
      "domain": "cursor.com",
      "logo": "https://www.google.com/s2/favicons?domain=cursor.com&sz=128",
      "tagline": "AI-first code editor designed for pair programming and deep codebase indexing.",
      "proprietaryUrl": "https://cursor.com",
      "description": "Cursor is a popular AI code editor fork of VS Code with smart auto-complete, codebase-wide chat, and agentic multi-file edits.",
      "alternatives": [
        {
          "name": "Void",
          "slug": "void",
          "domain": "voideditor.com",
          "logo": "https://www.google.com/s2/favicons?domain=voideditor.com&sz=128",
          "stars": "14.2k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "techStack": [
            "TypeScript",
            "Electron",
            "VS Code Fork"
          ],
          "website": "https://voideditor.com",
          "github": "https://github.com/voideditor/void",
          "description": "The open-source AI code editor alternative to Cursor. Void puts you in full control of your AI features, hosting, and API keys with zero telemetry.",
          "highlights": [
            "Direct API access",
            "Local model support with Ollama",
            "Privacy-first architecture"
          ]
        },
        {
          "name": "Continue",
          "slug": "continue",
          "domain": "continue.dev",
          "logo": "https://www.google.com/s2/favicons?domain=continue.dev&sz=128",
          "stars": "23.6k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "techStack": [
            "TypeScript",
            "Python",
            "VS Code & JetBrains"
          ],
          "website": "https://continue.dev",
          "github": "https://github.com/continuedev/continue",
          "description": "Leading open-source AI code assistant for VS Code and JetBrains. Connect any model (local or remote) to autocomplete and chat in your IDE.",
          "highlights": [
            "Context providers (@docs, @codebase)",
            "Works in VS Code & JetBrains",
            "Self-hosted LLMs"
          ]
        },
        {
          "name": "PearAI",
          "slug": "pearai",
          "domain": "trypear.ai",
          "logo": "https://www.google.com/s2/favicons?domain=trypear.ai&sz=128",
          "stars": "5.8k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "techStack": [
            "TypeScript",
            "VS Code Fork"
          ],
          "website": "https://trypear.ai",
          "github": "https://github.com/trypear/pearai-submodule",
          "description": "Open-source AI-powered code editor with curated best-in-class AI tools and seamless workflow integration.",
          "highlights": [
            "Integrated AI tools",
            "Transparent billing & open source",
            "Zero lock-in"
          ]
        },
        {
          "name": "Roo Code",
          "slug": "roo-code",
          "domain": "github.com",
          "logo": "https://www.google.com/s2/favicons?domain=github.com&sz=128",
          "stars": "11.9k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "techStack": [
            "TypeScript",
            "VS Code Extension"
          ],
          "website": "https://github.com/RooVetGit/Roo-Cline",
          "github": "https://github.com/RooVetGit/Roo-Cline",
          "description": "Advanced autonomous AI coding assistant extension for VS Code with multi-mode personas (Architect, Code, Ask) and MCP support.",
          "highlights": [
            "Multiple custom modes",
            "Custom system prompts",
            "Autonomous multi-step execution"
          ]
        }
      ]
    },
    {
      "slug": "chatgpt",
      "name": "ChatGPT / OpenAI",
      "category": "ai-coding",
      "categoryName": "AI & Coding",
      "domain": "openai.com",
      "logo": "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
      "tagline": "Conversational AI chatbot and frontier intelligence platform.",
      "proprietaryUrl": "https://chatgpt.com",
      "description": "ChatGPT is OpenAI's flagship conversational assistant capable of natural text generation, reasoning, coding, image creation, and web browsing.",
      "alternatives": [
        {
          "name": "LibreChat",
          "slug": "librechat",
          "domain": "librechat.ai",
          "logo": "https://www.google.com/s2/favicons?domain=librechat.ai&sz=128",
          "stars": "22.4k",
          "license": "MIT",
          "selfHosted": true,
          "techStack": [
            "TypeScript",
            "Node.js",
            "React",
            "MongoDB"
          ],
          "website": "https://librechat.ai",
          "github": "https://github.com/danny-avila/LibreChat",
          "description": "Enhanced open-source ChatGPT clone with support for OpenAI, Anthropic, Gemini, Mistral, Ollama, and multi-user authentication.",
          "highlights": [
            "Multi-model conversation presets",
            "Artifacts UI & code rendering",
            "Plugins & MCP tools"
          ]
        },
        {
          "name": "Open WebUI",
          "slug": "open-webui",
          "domain": "openwebui.com",
          "logo": "https://www.google.com/s2/favicons?domain=openwebui.com&sz=128",
          "stars": "68.5k",
          "license": "MIT",
          "selfHosted": true,
          "techStack": [
            "Python",
            "SvelteKit",
            "Docker",
            "FastAPI"
          ],
          "website": "https://openwebui.com",
          "github": "https://github.com/open-webui/open-webui",
          "description": "Self-hosted, extensible AI chat interface designed to work seamlessly with Ollama, OpenAI-compatible APIs, and local LLMs.",
          "highlights": [
            "RAG pipeline integration",
            "Voice/Audio support",
            "Granular role-based access control"
          ]
        },
        {
          "name": "Ollama",
          "slug": "ollama",
          "domain": "ollama.com",
          "logo": "https://www.google.com/s2/favicons?domain=ollama.com&sz=128",
          "stars": "118.2k",
          "license": "MIT",
          "selfHosted": true,
          "techStack": [
            "Go",
            "C++",
            "llama.cpp"
          ],
          "website": "https://ollama.com",
          "github": "https://github.com/ollama/ollama",
          "description": "Get up and running with large language models locally. Run Llama 3.3, DeepSeek-R1, Mistral, and Gemma on your own hardware.",
          "highlights": [
            "Run models 100% offline",
            "Fast REST API",
            "Cross-platform support (Mac, Linux, Windows)"
          ]
        },
        {
          "name": "Jan",
          "slug": "jan",
          "domain": "jan.ai",
          "logo": "https://www.google.com/s2/favicons?domain=jan.ai&sz=128",
          "stars": "27.3k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "techStack": [
            "TypeScript",
            "Electron",
            "C++"
          ],
          "website": "https://jan.ai",
          "github": "https://github.com/janhq/jan",
          "description": "Open-source, local-first alternative to ChatGPT that runs 100% offline on your desktop computer.",
          "highlights": [
            "100% offline and private",
            "Local OpenAI-compatible server",
            "Hardware acceleration"
          ]
        }
      ]
    },
    {
      "slug": "perplexity",
      "name": "Perplexity AI",
      "category": "ai-coding",
      "categoryName": "AI & Coding",
      "domain": "perplexity.ai",
      "logo": "https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128",
      "tagline": "AI conversational search engine delivering sourced and cited real-time answers.",
      "proprietaryUrl": "https://perplexity.ai",
      "description": "Perplexity AI is a conversational search engine that blends LLM summaries with real-time web retrieval and cited references.",
      "alternatives": [
        {
          "name": "Perplexica",
          "slug": "perplexica",
          "domain": "github.com",
          "logo": "https://www.google.com/s2/favicons?domain=github.com&sz=128",
          "stars": "19.8k",
          "license": "MIT",
          "selfHosted": true,
          "techStack": [
            "TypeScript",
            "Next.js",
            "SearXNG",
            "Ollama"
          ],
          "website": "https://github.com/ItzCrazyBlaze/Perplexica",
          "github": "https://github.com/ItzCrazyBlaze/Perplexica",
          "description": "Open-source AI-powered search engine that uses advanced machine learning algorithms to provide in-depth answers with citations.",
          "highlights": [
            "SearXNG meta-search engine backend",
            "Focus modes (Academic, Writing, YouTube, Reddit)",
            "Local LLM support"
          ]
        },
        {
          "name": "Khoj",
          "slug": "khoj",
          "domain": "khoj.dev",
          "logo": "https://www.google.com/s2/favicons?domain=khoj.dev&sz=128",
          "stars": "17.4k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "techStack": [
            "Python",
            "FastAPI",
            "React"
          ],
          "website": "https://khoj.dev",
          "github": "https://github.com/khoj-ai/khoj",
          "description": "Open-source, personal AI assistant for your second brain. Search and chat with your notes, docs, and the web.",
          "highlights": [
            "Obsidian, Emacs & Desktop apps",
            "Online & offline searching",
            "Multi-modal vision support"
          ]
        },
        {
          "name": "SearXNG",
          "slug": "searxng",
          "domain": "searxng.org",
          "logo": "https://www.google.com/s2/favicons?domain=searxng.org&sz=128",
          "stars": "15.6k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "techStack": [
            "Python",
            "Flask",
            "Jinja2"
          ],
          "website": "https://searxng.org",
          "github": "https://github.com/searxng/searxng",
          "description": "A privacy-respecting, open metasearch engine aggregating results from over 70 search services with zero user profiling.",
          "highlights": [
            "Zero tracking & no cookies",
            "70+ search engine providers",
            "Self-hostable in 1 Docker container"
          ]
        }
      ]
    },
    {
      "slug": "lovable",
      "name": "Lovable / v0 / Bolt.new",
      "category": "ai-coding",
      "categoryName": "AI & Coding",
      "domain": "lovable.dev",
      "logo": "https://www.google.com/s2/favicons?domain=lovable.dev&sz=128",
      "tagline": "Prompt-to-fullstack app generators that build complete working web apps from text prompts.",
      "proprietaryUrl": "https://lovable.dev",
      "description": "Lovable, v0, and Bolt.new generate full-stack web applications, UI designs, and databases from simple natural language prompts.",
      "alternatives": [
        {
          "name": "bolt.diy",
          "slug": "bolt-diy",
          "domain": "github.com",
          "logo": "https://www.google.com/s2/favicons?domain=github.com&sz=128",
          "stars": "16.7k",
          "license": "MIT",
          "selfHosted": true,
          "techStack": [
            "TypeScript",
            "Remix",
            "WebContainer API"
          ],
          "website": "https://github.com/stackblitz-labs/bolt.diy",
          "github": "https://github.com/stackblitz-labs/bolt.diy",
          "description": "Open-source prompt-to-app builder that lets you run full-stack applications in-browser with your own API keys or local Ollama models.",
          "highlights": [
            "Connect any LLM (OpenAI, Claude, Ollama, DeepSeek)",
            "Live in-browser preview",
            "Export full code zip or git repo"
          ]
        },
        {
          "name": "GPT-Engineer",
          "slug": "gpt-engineer",
          "domain": "gptengineer.app",
          "logo": "https://www.google.com/s2/favicons?domain=gptengineer.app&sz=128",
          "stars": "52.4k",
          "license": "MIT",
          "selfHosted": true,
          "techStack": [
            "Python",
            "Typer",
            "LLMs"
          ],
          "website": "https://gptengineer.app",
          "github": "https://github.com/gpt-engineer-org/gpt-engineer",
          "description": "Specify what you want it to build, the AI asks clarifying questions, and builds an entire codebase step by step.",
          "highlights": [
            "Clarifying question loop",
            "Multi-file generation",
            "Incremental editing mode"
          ]
        }
      ]
    },
    {
      "slug": "notebooklm",
      "name": "Google NotebookLM",
      "category": "ai-coding",
      "categoryName": "AI & Coding",
      "domain": "notebooklm.google",
      "logo": "https://www.google.com/s2/favicons?domain=google.com&sz=128",
      "tagline": "AI-powered personalized research assistant that transforms notes, PDFs, and docs into interactive audio podcasts.",
      "proprietaryUrl": "https://notebooklm.google",
      "description": "Google NotebookLM allows researchers and learners to ground AI on their own uploaded documents and create audio podcast overviews.",
      "alternatives": [
        {
          "name": "Open-NotebookLM",
          "slug": "open-notebooklm",
          "domain": "github.com",
          "logo": "https://www.google.com/s2/favicons?domain=github.com&sz=128",
          "stars": "8.4k",
          "license": "MIT",
          "selfHosted": true,
          "techStack": [
            "Python",
            "Gradio",
            "Whisper",
            "Kokoro TTS"
          ],
          "website": "https://github.com/gabrielchua/open-notebooklm",
          "github": "https://github.com/gabrielchua/open-notebooklm",
          "description": "Open-source implementation of NotebookLM podcast generation. Transforms PDFs and web pages into realistic two-host conversational audio podcasts.",
          "highlights": [
            "Multi-host natural voice synthesis",
            "Runs locally or on free Google Colab",
            "Customizable podcast tone & length"
          ]
        },
        {
          "name": "RAGFlow",
          "slug": "ragflow",
          "domain": "ragflow.io",
          "logo": "https://www.google.com/s2/favicons?domain=ragflow.io&sz=128",
          "stars": "31.9k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "techStack": [
            "Python",
            "Deep Learning OCR",
            "Elasticsearch",
            "Infinity"
          ],
          "website": "https://ragflow.io",
          "github": "https://github.com/infiniflow/ragflow",
          "description": "Open-source RAG engine based on deep document understanding. Extracts tables, images, formulas, and structured text from complex documents.",
          "highlights": [
            "Deep document understanding OCR",
            "Visual RAG pipeline builder",
            "Zero hallucinations retrieval"
          ]
        },
        {
          "name": "Quivr",
          "slug": "quivr",
          "domain": "quivr.app",
          "logo": "https://www.google.com/s2/favicons?domain=quivr.app&sz=128",
          "stars": "37.5k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "techStack": [
            "Python",
            "FastAPI",
            "Next.js",
            "Supabase"
          ],
          "website": "https://quivr.app",
          "github": "https://github.com/QuivrHQ/quivr",
          "description": "Your open-source generative AI second brain. Dump files (PDF, PPT, Word, Audio, Video) and chat with them instantly.",
          "highlights": [
            "Fast vector search",
            "Multi-brain organization",
            "Enterprise cloud & self-hosting"
          ]
        }
      ]
    },
    {
      "slug": "notion",
      "name": "Notion",
      "category": "productivity",
      "categoryName": "Productivity & Project",
      "domain": "notion.so",
      "logo": "https://www.google.com/s2/favicons?domain=notion.so&sz=128",
      "tagline": "Connected workspace for wiki, docs, notes, project management, and databases.",
      "proprietaryUrl": "https://notion.so",
      "description": "Notion is an all-in-one productivity app combining documents, relational databases, kanban boards, wikis, and AI writing tools.",
      "alternatives": [
        {
          "name": "AppFlowy",
          "slug": "appflowy",
          "domain": "appflowy.io",
          "logo": "https://www.google.com/s2/favicons?domain=appflowy.io&sz=128",
          "stars": "59.1k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "techStack": [
            "Rust",
            "Flutter",
            "PostgreSQL"
          ],
          "website": "https://appflowy.io",
          "github": "https://github.com/AppFlowy-IO/AppFlowy",
          "description": "Open-source Notion alternative with complete data security, offline-first architecture, and cross-platform desktop & mobile apps.",
          "highlights": [
            "100% data ownership",
            "Native desktop speed in Rust",
            "Built-in AppFlowy AI"
          ]
        },
        {
          "name": "AFFiNE",
          "slug": "affine",
          "domain": "affine.pro",
          "logo": "https://www.google.com/s2/favicons?domain=affine.pro&sz=128",
          "stars": "45.7k",
          "license": "MIT",
          "selfHosted": true,
          "techStack": [
            "TypeScript",
            "Rust",
            "React",
            "CRDTs"
          ],
          "website": "https://affine.pro",
          "github": "https://github.com/toeverything/AFFiNE",
          "description": "Next-gen collaborative knowledge base uniting docs, whiteboards, and database tables in a single canvas.",
          "highlights": [
            "Dual-view: Document + Whiteboard",
            "True privacy-first sync",
            "Hyper-responsive canvas"
          ]
        },
        {
          "name": "Outline",
          "slug": "outline",
          "domain": "getoutline.com",
          "logo": "https://www.google.com/s2/favicons?domain=getoutline.com&sz=128",
          "stars": "30.4k",
          "license": "BSL 1.1",
          "selfHosted": true,
          "techStack": [
            "TypeScript",
            "Node.js",
            "React",
            "PostgreSQL"
          ],
          "website": "https://www.getoutline.com",
          "github": "https://github.com/outline/outline",
          "description": "Fast, beautiful, collaborative knowledge base for growing teams. Markdown-compatible, structured, and searchable.",
          "highlights": [
            "Team permissions & SSO",
            "Instant search",
            "Real-time collaborative editing"
          ]
        },
        {
          "name": "Anytype",
          "slug": "anytype",
          "domain": "anytype.io",
          "logo": "https://www.google.com/s2/favicons?domain=anytype.io&sz=128",
          "stars": "18.2k",
          "license": "Any Source Available",
          "selfHosted": true,
          "techStack": [
            "Go",
            "TypeScript",
            "P2P Anysync"
          ],
          "website": "https://anytype.io",
          "github": "https://github.com/anyproto/anytype-ts",
          "description": "Peer-to-peer, local-first open environment for your notes, wikis, and tasks, encrypted end-to-end.",
          "highlights": [
            "P2P local-first synchronization",
            "Zero-knowledge encryption",
            "Graph-based object relations"
          ]
        }
      ]
    },
    {
      "slug": "obsidian",
      "name": "Obsidian",
      "category": "productivity",
      "categoryName": "Productivity & Project",
      "domain": "obsidian.md",
      "logo": "https://www.google.com/s2/favicons?domain=obsidian.md&sz=128",
      "tagline": "Local-first markdown knowledge base and personal wiki with bidirectional linking.",
      "proprietaryUrl": "https://obsidian.md",
      "description": "Obsidian is a personal knowledge management app that stores notes locally as plain Markdown files connected via graph links.",
      "alternatives": [
        {
          "name": "Logseq",
          "slug": "logseq",
          "domain": "logseq.com",
          "logo": "https://www.google.com/s2/favicons?domain=logseq.com&sz=128",
          "stars": "34.8k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "techStack": [
            "ClojureScript",
            "Electron",
            "Datascript"
          ],
          "website": "https://logseq.com",
          "github": "https://github.com/logseq/logseq",
          "description": "A privacy-first, open-source outliner knowledge base that works on top of local plain-text Markdown and Org-mode files.",
          "highlights": [
            "Outliner-first document structure",
            "Built-in PDF annotation & Flashcards",
            "Graph visualization"
          ]
        },
        {
          "name": "Joplin",
          "slug": "joplin",
          "domain": "joplinapp.org",
          "logo": "https://www.google.com/s2/favicons?domain=joplinapp.org&sz=128",
          "stars": "46.2k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "techStack": [
            "TypeScript",
            "React Native",
            "Electron",
            "SQLite"
          ],
          "website": "https://joplinapp.org",
          "github": "https://github.com/laurent22/joplin",
          "description": "Open-source note taking and to-do application with end-to-end encryption and multi-device cloud synchronization.",
          "highlights": [
            "End-to-end encryption (E2EE)",
            "Web clipper extension",
            "Sync via Nextcloud, Dropbox, WebDAV"
          ]
        },
        {
          "name": "SilverBullet",
          "slug": "silverbullet",
          "domain": "silverbullet.md",
          "logo": "https://www.google.com/s2/favicons?domain=silverbullet.md&sz=128",
          "stars": "5.9k",
          "license": "MIT",
          "selfHosted": true,
          "techStack": [
            "TypeScript",
            "Deno",
            "CodeMirror"
          ],
          "website": "https://silverbullet.md",
          "github": "https://github.com/silverbulletmd/silverbullet",
          "description": "Extensible, open-source personal knowledge management system running on clean markdown with live query templates.",
          "highlights": [
            "Queryable markdown blocks",
            "Runs in browser or Deno server",
            "Pluggable space-lua extension system"
          ]
        }
      ]
    },
    {
      "slug": "linear",
      "name": "Linear / Jira",
      "category": "productivity",
      "categoryName": "Productivity & Project",
      "domain": "linear.app",
      "logo": "https://www.google.com/s2/favicons?domain=linear.app&sz=128",
      "tagline": "Modern project tracking and issue management built for high-performance product teams.",
      "proprietaryUrl": "https://linear.app",
      "description": "Linear and Jira are industry standard tools for tracking software bugs, roadmaps, sprints, and product milestones.",
      "alternatives": [
        {
          "name": "Plane",
          "slug": "plane",
          "domain": "plane.so",
          "logo": "https://www.google.com/s2/favicons?domain=plane.so&sz=128",
          "stars": "33.9k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "techStack": [
            "TypeScript",
            "Python",
            "Django",
            "Next.js",
            "PostgreSQL"
          ],
          "website": "https://plane.so",
          "github": "https://github.com/makeplane/plane",
          "description": "Open-source project management platform alternative to Jira and Linear. Track issues, epics, cycles, and product roadmaps.",
          "highlights": [
            "Cycles, Modules & Roadmaps",
            "Linear-style fast keyboard shortcuts",
            "Docker & Kubernetes self-hosting"
          ]
        },
        {
          "name": "Taiga",
          "slug": "taiga",
          "domain": "taiga.io",
          "logo": "https://www.google.com/s2/favicons?domain=taiga.io&sz=128",
          "stars": "14.8k",
          "license": "MPL-2.0",
          "selfHosted": true,
          "techStack": [
            "Python",
            "Django",
            "Angular",
            "PostgreSQL"
          ],
          "website": "https://taiga.io",
          "github": "https://github.com/taigaio/taiga-front",
          "description": "Open-source agile project management tool with Scrum and Kanban boards designed for cross-functional teams.",
          "highlights": [
            "Scrum & Kanban support",
            "Gamification & analytics",
            "Custom workflows"
          ]
        }
      ]
    },
    {
      "slug": "airtable",
      "name": "Airtable",
      "category": "productivity",
      "categoryName": "Productivity & Project",
      "domain": "airtable.com",
      "logo": "https://www.google.com/s2/favicons?domain=airtable.com&sz=128",
      "tagline": "Low-code platform for creating relational databases with spreadsheet-like flexibility.",
      "proprietaryUrl": "https://airtable.com",
      "description": "Airtable combines the ease of a spreadsheet with the power of relational databases, automations, and custom views.",
      "alternatives": [
        {
          "name": "NocoDB",
          "slug": "nocodb",
          "domain": "nocodb.com",
          "logo": "https://www.google.com/s2/favicons?domain=nocodb.com&sz=128",
          "stars": "48.2k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "techStack": [
            "TypeScript",
            "Node.js",
            "Vue.js",
            "PostgreSQL/MySQL"
          ],
          "website": "https://nocodb.com",
          "github": "https://github.com/nocodb/nocodb",
          "description": "The open-source Airtable alternative. Transform any existing SQL database into a smart spreadsheet with collaborative views and REST APIs.",
          "highlights": [
            "Connects directly to MySQL, Postgres, SQLite",
            "Formula & rollup fields",
            "Instant REST & GraphQL APIs"
          ]
        },
        {
          "name": "Baserow",
          "slug": "baserow",
          "domain": "baserow.io",
          "logo": "https://www.google.com/s2/favicons?domain=baserow.io&sz=128",
          "stars": "20.1k",
          "license": "MIT",
          "selfHosted": true,
          "techStack": [
            "Python",
            "Django",
            "Nuxt.js",
            "PostgreSQL"
          ],
          "website": "https://baserow.io",
          "github": "https://github.com/bram2w/baserow",
          "description": "Open-source no-code database platform that gives you the powers of a developer without writing code.",
          "highlights": [
            "Infinite rows & real-time sync",
            "Application builder module",
            "Enterprise self-hosting"
          ]
        }
      ]
    },
    {
      "slug": "figma",
      "name": "Figma",
      "category": "design-media",
      "categoryName": "Design & Media",
      "domain": "figma.com",
      "logo": "https://www.google.com/s2/favicons?domain=figma.com&sz=128",
      "tagline": "Collaborative interface design, vector prototyping, and UI/UX design tool.",
      "proprietaryUrl": "https://figma.com",
      "description": "Figma is the leading browser-based collaborative UI/UX design and vector graphics editor used by design teams globally.",
      "alternatives": [
        {
          "name": "Penpot",
          "slug": "penpot",
          "domain": "penpot.app",
          "logo": "https://www.google.com/s2/favicons?domain=penpot.app&sz=128",
          "stars": "35.6k",
          "license": "MPL-2.0",
          "selfHosted": true,
          "techStack": [
            "Clojure",
            "ClojureScript",
            "SVG Native",
            "PostgreSQL"
          ],
          "website": "https://penpot.app",
          "github": "https://github.com/penpot/penpot",
          "description": "The first open-source design and prototyping platform built for cross-functional teams. Web-based, native SVG standards, and flexbox/grid layout.",
          "highlights": [
            "Native SVG & CSS standards",
            "Flexbox & Grid layout engines",
            "Self-hostable via Docker"
          ]
        }
      ]
    },
    {
      "slug": "canva",
      "name": "Canva / Adobe Photoshop",
      "category": "design-media",
      "categoryName": "Design & Media",
      "domain": "canva.com",
      "logo": "https://www.google.com/s2/favicons?domain=canva.com&sz=128",
      "tagline": "Visual design and raster image manipulation tools for social graphics and photo retouching.",
      "proprietaryUrl": "https://canva.com",
      "description": "Canva and Photoshop are graphic design and photo editing suites for creating banners, social media assets, and vector art.",
      "alternatives": [
        {
          "name": "GIMP",
          "slug": "gimp",
          "domain": "gimp.org",
          "logo": "https://www.google.com/s2/favicons?domain=gimp.org&sz=128",
          "stars": "8.3k",
          "license": "GPL-3.0",
          "selfHosted": true,
          "techStack": [
            "C",
            "GTK3",
            "GEGL"
          ],
          "website": "https://www.gimp.org",
          "github": "https://gitlab.gnome.org/GNOME/gimp",
          "description": "Cross-platform image editor available for GNU/Linux, macOS, Windows. Professional photo manipulation and graphic design.",
          "highlights": [
            "Layer masks & color curves",
            "Extensive plugin architecture",
            "Hardware accelerated GEGL engine"
          ]
        },
        {
          "name": "Krita",
          "slug": "krita",
          "domain": "krita.org",
          "logo": "https://www.google.com/s2/favicons?domain=krita.org&sz=128",
          "stars": "7.9k",
          "license": "GPL-3.0",
          "selfHosted": true,
          "techStack": [
            "C++",
            "Qt5",
            "OpenGL"
          ],
          "website": "https://krita.org",
          "github": "https://invent.kde.org/graphics/krita",
          "description": "Professional free and open-source painting program made by artists for concept art, texture and matte painters, and illustrations.",
          "highlights": [
            "100+ professional brush engines",
            "Vector & text tools",
            "Seamless texture wrap-around mode"
          ]
        }
      ]
    },
    {
      "slug": "capcut",
      "name": "CapCut / Premiere Pro",
      "category": "design-media",
      "categoryName": "Design & Media",
      "domain": "capcut.com",
      "logo": "https://www.google.com/s2/favicons?domain=capcut.com&sz=128",
      "tagline": "Video editing software for creating short-form reels, TikToks, and cinematic timelines.",
      "proprietaryUrl": "https://capcut.com",
      "description": "CapCut and Adobe Premiere Pro are timeline-based video editing suites with transitions, keyframe animation, and audio mixing.",
      "alternatives": [
        {
          "name": "Kdenlive",
          "slug": "kdenlive",
          "domain": "kdenlive.org",
          "logo": "https://www.google.com/s2/favicons?domain=kdenlive.org&sz=128",
          "stars": "5.6k",
          "license": "GPL-3.0",
          "selfHosted": true,
          "techStack": [
            "C++",
            "Qt",
            "MLT Framework",
            "FFmpeg"
          ],
          "website": "https://kdenlive.org",
          "github": "https://invent.kde.org/multimedia/kdenlive",
          "description": "Powerful multi-track video editing software with support for virtually all audio and video formats, effects, and subtitles.",
          "highlights": [
            "Multi-track timeline editing",
            "AI Speech-to-Text auto subtitles",
            "Color grading & LUT support"
          ]
        },
        {
          "name": "Shotcut",
          "slug": "shotcut",
          "domain": "shotcut.org",
          "logo": "https://www.google.com/s2/favicons?domain=shotcut.org&sz=128",
          "stars": "11.2k",
          "license": "GPL-3.0",
          "selfHosted": true,
          "techStack": [
            "C++",
            "Qt",
            "OpenGL",
            "FFmpeg"
          ],
          "website": "https://shotcut.org",
          "github": "https://github.com/mltframework/shotcut",
          "description": "Free, open source, cross-platform video editor supporting 4K resolution, timeline editing, audio filters, and video effects.",
          "highlights": [
            "Native 4K timeline editing",
            "Hardware accelerated encoding",
            "Audio mixing & loudness filters"
          ]
        }
      ]
    },
    {
      "slug": "slack",
      "name": "Slack / Discord",
      "category": "productivity",
      "categoryName": "Productivity & Project",
      "domain": "slack.com",
      "logo": "https://www.google.com/s2/favicons?domain=slack.com&sz=128",
      "tagline": "Team messaging, voice channels, file sharing, and workplace collaboration hub.",
      "proprietaryUrl": "https://slack.com",
      "description": "Slack and Discord are real-time team messaging platforms organized into channels, DMs, threads, voice calls, and integrations.",
      "alternatives": [
        {
          "name": "Mattermost",
          "slug": "mattermost",
          "domain": "mattermost.com",
          "logo": "https://www.google.com/s2/favicons?domain=mattermost.com&sz=128",
          "stars": "30.8k",
          "license": "AGPL-3.0 / Apache 2.0",
          "selfHosted": true,
          "techStack": [
            "Go",
            "React",
            "Redux",
            "PostgreSQL"
          ],
          "website": "https://mattermost.com",
          "github": "https://github.com/mattermost/mattermost",
          "description": "Secure, self-hosted Slack alternative for technical and operational teams requiring mission-critical privacy and compliance.",
          "highlights": [
            "Playbooks & incident response",
            "End-to-end self-hosting",
            "Enterprise security compliance"
          ]
        },
        {
          "name": "Rocket.Chat",
          "slug": "rocketchat",
          "domain": "rocket.chat",
          "logo": "https://www.google.com/s2/favicons?domain=rocket.chat&sz=128",
          "stars": "40.3k",
          "license": "GPL-3.0 / MIT",
          "selfHosted": true,
          "techStack": [
            "TypeScript",
            "Node.js",
            "React",
            "MongoDB"
          ],
          "website": "https://rocket.chat",
          "github": "https://github.com/RocketChat/Rocket.Chat",
          "description": "Open-source communications platform that enables real-time conversations across team chat, customer service, and federation.",
          "highlights": [
            "Matrix protocol federation",
            "Omnichannel customer support",
            "Audio/video conferencing"
          ]
        },
        {
          "name": "Zulip",
          "slug": "zulip",
          "domain": "zulip.com",
          "logo": "https://www.google.com/s2/favicons?domain=zulip.com&sz=128",
          "stars": "20.9k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "techStack": [
            "Python",
            "Django",
            "TypeScript",
            "PostgreSQL"
          ],
          "website": "https://zulip.com",
          "github": "https://github.com/zulip/zulip",
          "description": "Unique topic-based threading chat app that combines the immediacy of Slack with the productivity of email threads.",
          "highlights": [
            "Stream & topic threaded conversations",
            "Never miss important updates",
            "Extremely low bandwidth usage"
          ]
        }
      ]
    },
    {
      "slug": "supabase",
      "name": "Firebase / Supabase",
      "category": "devtools-cloud",
      "categoryName": "DevTools & Backend",
      "domain": "supabase.com",
      "logo": "https://www.google.com/s2/favicons?domain=supabase.com&sz=128",
      "tagline": "Open-source backend-as-a-service providing real-time database, auth, and edge functions.",
      "proprietaryUrl": "https://supabase.com",
      "description": "Supabase is the open source Firebase alternative providing PostgreSQL, real-time subscriptions, storage, and authentication.",
      "alternatives": [
        {
          "name": "Appwrite",
          "slug": "appwrite",
          "domain": "appwrite.io",
          "logo": "https://www.google.com/s2/favicons?domain=appwrite.io&sz=128",
          "stars": "47.2k",
          "license": "BSD-3-Clause",
          "selfHosted": true,
          "techStack": [
            "PHP",
            "Docker",
            "MariaDB",
            "Redis"
          ],
          "website": "https://appwrite.io",
          "github": "https://github.com/appwrite/appwrite",
          "description": "Secure end-to-end backend server for web, mobile, and flutter developers that takes out the complexity of building backends.",
          "highlights": [
            "Auth, Databases, Storage & Functions",
            "SDKs for Flutter, React, iOS, Android",
            "One-command Docker setup"
          ]
        },
        {
          "name": "PocketBase",
          "slug": "pocketbase",
          "domain": "pocketbase.io",
          "logo": "https://www.google.com/s2/favicons?domain=pocketbase.io&sz=128",
          "stars": "44.6k",
          "license": "MIT",
          "selfHosted": true,
          "techStack": [
            "Go",
            "SQLite",
            "Vue.js"
          ],
          "website": "https://pocketbase.io",
          "github": "https://github.com/pocketbase/pocketbase",
          "description": "Open-source backend in 1 single binary file. Real-time embedded database (SQLite) with authentication, file storage, and admin dashboard.",
          "highlights": [
            "Single executable file",
            "Blazing fast SQLite engine",
            "Built-in admin dashboard UI"
          ]
        }
      ]
    },
    {
      "slug": "zapier",
      "name": "Zapier / Make",
      "category": "automation-analytics",
      "categoryName": "Automation & Data",
      "domain": "zapier.com",
      "logo": "https://www.google.com/s2/favicons?domain=zapier.com&sz=128",
      "tagline": "No-code workflow automation connecting thousands of web applications.",
      "proprietaryUrl": "https://zapier.com",
      "description": "Zapier and Make are leading workflow automation services that automate actions between different online applications and services.",
      "alternatives": [
        {
          "name": "n8n",
          "slug": "n8n",
          "domain": "n8n.io",
          "logo": "https://www.google.com/s2/favicons?domain=n8n.io&sz=128",
          "stars": "62.4k",
          "license": "Fair-code (Sustainable)",
          "selfHosted": true,
          "techStack": [
            "TypeScript",
            "Node.js",
            "Vue.js",
            "Docker"
          ],
          "website": "https://n8n.io",
          "github": "https://github.com/n8n-io/n8n",
          "description": "Fair-code workflow automation platform with visual node-based editor, custom JavaScript/Python steps, and built-in AI agent capabilities.",
          "highlights": [
            "400+ built-in app integrations",
            "AI Agent & LangChain nodes",
            "Self-hostable with unlimited executions"
          ]
        },
        {
          "name": "Activepieces",
          "slug": "activepieces",
          "domain": "activepieces.com",
          "logo": "https://www.google.com/s2/favicons?domain=activepieces.com&sz=128",
          "stars": "13.1k",
          "license": "MIT",
          "selfHosted": true,
          "techStack": [
            "TypeScript",
            "Node.js",
            "Angular",
            "PostgreSQL"
          ],
          "website": "https://activepieces.com",
          "github": "https://github.com/activepieces/activepieces",
          "description": "The open-source Zapier alternative built for scale. Visual automation workflows with zero execution fees when self-hosted.",
          "highlights": [
            "100% MIT licensed core",
            "Modern clean visual canvas",
            "TypeScript-first connector SDK"
          ]
        },
        {
          "name": "Windmill",
          "slug": "windmill",
          "domain": "windmill.dev",
          "logo": "https://www.google.com/s2/favicons?domain=windmill.dev&sz=128",
          "stars": "14.9k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "techStack": [
            "Rust",
            "Svelte",
            "PostgreSQL"
          ],
          "website": "https://windmill.dev",
          "github": "https://github.com/windmill-labs/windmill",
          "description": "High-performance developer platform to turn scripts into internal tools, workflows, and UIs at extreme scale.",
          "highlights": [
            "Write code in Python, TypeScript, Go, Bash, SQL",
            "Blazing fast Rust engine",
            "Instant auto-generated UIs"
          ]
        }
      ]
    },
    {
      "slug": "postman",
      "name": "Postman",
      "category": "devtools-cloud",
      "categoryName": "DevTools & Backend",
      "domain": "postman.com",
      "logo": "https://www.google.com/s2/favicons?domain=postman.com&sz=128",
      "tagline": "API platform for building, testing, documenting, and consuming APIs.",
      "proprietaryUrl": "https://postman.com",
      "description": "Postman is an API platform used by developers to design, mock, test, and debug HTTP requests and collections.",
      "alternatives": [
        {
          "name": "Hoppscotch",
          "slug": "hoppscotch",
          "domain": "hoppscotch.io",
          "logo": "https://www.google.com/s2/favicons?domain=hoppscotch.io&sz=128",
          "stars": "65.7k",
          "license": "MIT",
          "selfHosted": true,
          "techStack": [
            "TypeScript",
            "Vue.js",
            "Nuxt.js"
          ],
          "website": "https://hoppscotch.io",
          "github": "https://github.com/hoppscotch/hoppscotch",
          "description": "Open-source, lightweight, web-based API development ecosystem. Fast, sleek, and supports REST, GraphQL, and WebSockets.",
          "highlights": [
            "Lightweight & PWA support",
            "GraphQL, WebSocket, SSE & gRPC",
            "Team collaboration"
          ]
        },
        {
          "name": "Bruno",
          "slug": "bruno",
          "domain": "usebruno.com",
          "logo": "https://www.google.com/s2/favicons?domain=usebruno.com&sz=128",
          "stars": "31.2k",
          "license": "MIT",
          "selfHosted": true,
          "techStack": [
            "JavaScript",
            "Electron",
            "React"
          ],
          "website": "https://www.usebruno.com",
          "github": "https://github.com/usebruno/bruno",
          "description": "Fast and git-friendly open-source API client that stores collections directly in a folder on your filesystem in plain text.",
          "highlights": [
            "Offline-first, no cloud required",
            "Version control with Git directly",
            "Zero data tracking"
          ]
        }
      ]
    },
    {
      "slug": "google-analytics",
      "name": "Google Analytics / Mixpanel",
      "category": "automation-analytics",
      "categoryName": "Automation & Data",
      "domain": "analytics.google.com",
      "logo": "https://www.google.com/s2/favicons?domain=google.com&sz=128",
      "tagline": "Web analytics service tracking user traffic, conversions, and behavioral funnels.",
      "proprietaryUrl": "https://analytics.google.com",
      "description": "Google Analytics and Mixpanel provide web traffic statistics, event tracking, and customer conversion insights.",
      "alternatives": [
        {
          "name": "Plausible Analytics",
          "slug": "plausible",
          "domain": "plausible.io",
          "logo": "https://www.google.com/s2/favicons?domain=plausible.io&sz=128",
          "stars": "20.8k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "techStack": [
            "Elixir",
            "Phoenix",
            "ClickHouse",
            "PostgreSQL"
          ],
          "website": "https://plausible.io",
          "github": "https://github.com/plausible/analytics",
          "description": "Simple, lightweight (< 1 KB) and privacy-first web analytics. No cookies and fully compliant with GDPR, CCPA and PECR.",
          "highlights": [
            "Cookie-free, no consent banners needed",
            "Ultra lightweight script (<1KB)",
            "Single-page clean dashboard"
          ]
        },
        {
          "name": "Umami",
          "slug": "umami",
          "domain": "umami.is",
          "logo": "https://www.google.com/s2/favicons?domain=umami.is&sz=128",
          "stars": "24.9k",
          "license": "MIT",
          "selfHosted": true,
          "techStack": [
            "TypeScript",
            "Next.js",
            "Prisma",
            "PostgreSQL/MySQL"
          ],
          "website": "https://umami.is",
          "github": "https://github.com/umami-software/umami",
          "description": "Umami is an easy-to-use, fast, privacy-focused open source alternative to Google Analytics.",
          "highlights": [
            "Unlimited websites support",
            "Fast Next.js & Prisma stack",
            "Zero personal data collection"
          ]
        },
        {
          "name": "PostHog",
          "slug": "posthog",
          "domain": "posthog.com",
          "logo": "https://www.google.com/s2/favicons?domain=posthog.com&sz=128",
          "stars": "24.1k",
          "license": "MIT",
          "selfHosted": true,
          "techStack": [
            "Python",
            "Django",
            "TypeScript",
            "ClickHouse"
          ],
          "website": "https://posthog.com",
          "github": "https://github.com/PostHog/posthog",
          "description": "Complete product analytics suite: session recording, feature flags, A/B testing, heatmaps, and SQL insights.",
          "highlights": [
            "Session replays & Heatmaps",
            "Feature flags & A/B testing",
            "ClickHouse petabyte scale"
          ]
        }
      ]
    },
    {
      "slug": "google-drive",
      "name": "Google Drive / Dropbox",
      "category": "productivity",
      "categoryName": "Productivity & Project",
      "domain": "drive.google.com",
      "logo": "https://www.google.com/s2/favicons?domain=google.com&sz=128",
      "tagline": "Cloud file storage, folder syncing, and document backup services.",
      "proprietaryUrl": "https://drive.google.com",
      "description": "Google Drive and Dropbox provide cloud-based file synchronization, sharing, and desktop folder mirroring.",
      "alternatives": [
        {
          "name": "Nextcloud",
          "slug": "nextcloud",
          "domain": "nextcloud.com",
          "logo": "https://www.google.com/s2/favicons?domain=nextcloud.com&sz=128",
          "stars": "27.5k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "techStack": [
            "PHP",
            "JavaScript",
            "PostgreSQL/MySQL",
            "Vue.js"
          ],
          "website": "https://nextcloud.com",
          "github": "https://github.com/nextcloud/server",
          "description": "Self-hosted productivity platform that keeps you in control. File storage, chat, calendars, contacts, and office suite.",
          "highlights": [
            "Complete self-hosted private cloud",
            "Built-in office document editing",
            "iOS, Android, Windows, Mac apps"
          ]
        },
        {
          "name": "Seafile",
          "slug": "seafile",
          "domain": "seafile.com",
          "logo": "https://www.google.com/s2/favicons?domain=seafile.com&sz=128",
          "stars": "12.8k",
          "license": "GPL-2.0",
          "selfHosted": true,
          "techStack": [
            "C",
            "Python",
            "Django",
            "React"
          ],
          "website": "https://www.seafile.com",
          "github": "https://github.com/haiwen/seafile",
          "description": "High performance file syncing and sharing solution designed for team reliability, speed, and client-side encryption.",
          "highlights": [
            "High performance file syncing in C",
            "Client-side library encryption",
            "Selective sync & drive mapping"
          ]
        }
      ]
    },
    {
      "slug": "spotify",
      "name": "Spotify",
      "category": "design-media",
      "categoryName": "Design & Media",
      "domain": "spotify.com",
      "logo": "https://www.google.com/s2/favicons?domain=spotify.com&sz=128",
      "tagline": "Digital music, podcast, and video streaming service with millions of tracks.",
      "proprietaryUrl": "https://spotify.com",
      "description": "Spotify is a commercial digital audio streaming service giving access to millions of songs, albums, and personalized playlists.",
      "alternatives": [
        {
          "name": "Spotube",
          "slug": "spotube",
          "domain": "spotube.krtirtho.dev",
          "logo": "https://www.google.com/s2/favicons?domain=github.com&sz=128",
          "stars": "35.2k",
          "license": "BSD-4-Clause",
          "selfHosted": false,
          "techStack": [
            "Flutter",
            "Dart",
            "YouTube & Spotify APIs"
          ],
          "website": "https://spotube.krtirtho.dev",
          "github": "https://github.com/KRTirtho/spotube",
          "description": "An open-source Spotify client that utilizes Spotify's metadata and YouTube/Piped as audio sources with zero ads and no telemetry.",
          "highlights": [
            "Zero ads & no premium account needed",
            "Cross-platform (Android, Mac, Windows, Linux)",
            "Time-synced lyrics"
          ]
        },
        {
          "name": "Navidrome",
          "slug": "navidrome",
          "domain": "navidrome.org",
          "logo": "https://www.google.com/s2/favicons?domain=navidrome.org&sz=128",
          "stars": "14.7k",
          "license": "GPL-3.0",
          "selfHosted": true,
          "techStack": [
            "Go",
            "React",
            "SQLite"
          ],
          "website": "https://www.navidrome.org",
          "github": "https://github.com/navidrome/navidrome",
          "description": "Open-source web-based music server and streamer. Listen to your own digital audio collection from any browser or Subsonic client.",
          "highlights": [
            "Extremely lightweight memory footprint",
            "Subsonic API compatible",
            "On-the-fly transcoding"
          ]
        }
      ]
    },
    {
      "slug": "netflix",
      "name": "Netflix / YouTube",
      "category": "design-media",
      "categoryName": "Design & Media",
      "domain": "netflix.com",
      "logo": "https://www.google.com/s2/favicons?domain=netflix.com&sz=128",
      "tagline": "On-demand video streaming platform for movies, series, and live entertainment.",
      "proprietaryUrl": "https://netflix.com",
      "description": "Netflix and YouTube provide online video playback, movie catalog streaming, and creator subscriptions.",
      "alternatives": [
        {
          "name": "Jellyfin",
          "slug": "jellyfin",
          "domain": "jellyfin.org",
          "logo": "https://www.google.com/s2/favicons?domain=jellyfin.org&sz=128",
          "stars": "39.8k",
          "license": "GPL-2.0",
          "selfHosted": true,
          "techStack": [
            "C#",
            ".NET",
            "Vue.js",
            "FFmpeg"
          ],
          "website": "https://jellyfin.org",
          "github": "https://github.com/jellyfin/jellyfin",
          "description": "The free software media system that puts you in control of managing and streaming your media with no strings attached.",
          "highlights": [
            "100% free with zero paywalls",
            "Hardware accelerated transcoding",
            "Clients for TV, Mobile, Desktop and Web"
          ]
        },
        {
          "name": "FreeTube",
          "slug": "freetube",
          "domain": "freetubeapp.io",
          "logo": "https://www.google.com/s2/favicons?domain=freetubeapp.io&sz=128",
          "stars": "16.4k",
          "license": "AGPL-3.0",
          "selfHosted": false,
          "techStack": [
            "TypeScript",
            "Electron",
            "Vue.js"
          ],
          "website": "https://freetubeapp.io",
          "github": "https://github.com/FreeTubeApp/FreeTube",
          "description": "Private open-source desktop YouTube client for Windows, Mac, and Linux built around privacy and ad-free viewing.",
          "highlights": [
            "Zero ads & sponsorblock built-in",
            "Local subscriptions without an account",
            "Privacy-first video streaming"
          ]
        }
      ]
    },
    {
      "slug": "vercel",
      "name": "Vercel / Heroku",
      "category": "devtools-cloud",
      "categoryName": "DevTools & Backend",
      "domain": "vercel.com",
      "logo": "https://www.google.com/s2/favicons?domain=vercel.com&sz=128",
      "tagline": "Cloud platform for frontend developers to build, preview, and ship web applications.",
      "proprietaryUrl": "https://vercel.com",
      "description": "Vercel and Heroku simplify application deployment, CI/CD pipelines, SSL certificates, and serverless hosting.",
      "alternatives": [
        {
          "name": "Coolify",
          "slug": "coolify",
          "domain": "coolify.io",
          "logo": "https://www.google.com/s2/favicons?domain=coolify.io&sz=128",
          "stars": "43.7k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "techStack": [
            "PHP",
            "Laravel",
            "Docker",
            "PostgreSQL"
          ],
          "website": "https://coolify.io",
          "github": "https://github.com/coollabsio/coolify",
          "description": "An open-source & self-hostable Heroku / Netlify / Vercel alternative. Deploy applications, databases, and services on your own servers.",
          "highlights": [
            "Deploy Next.js, Node, Python, Rust, Go",
            "Automatic SSL with Let's Encrypt",
            "One-click databases (Postgres, Mongo, Redis)"
          ]
        },
        {
          "name": "Dokku",
          "slug": "dokku",
          "domain": "dokku.com",
          "logo": "https://www.google.com/s2/favicons?domain=dokku.com&sz=128",
          "stars": "26.8k",
          "license": "MIT",
          "selfHosted": true,
          "techStack": [
            "Go",
            "Bash",
            "Docker"
          ],
          "website": "https://dokku.com",
          "github": "https://github.com/dokku/dokku",
          "description": "The smallest PaaS implementation you've ever seen. Push code to your own VPS with git push just like Heroku.",
          "highlights": [
            "Simple git push deployment",
            "Docker-powered execution",
            "Hundreds of plugins"
          ]
        }
      ]
    }
  ]
};
