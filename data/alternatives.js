/**
 * AIRA Newsletter - 100% Curated Open-Source & Modern Software Alternatives Dataset
 * Total Software Collections: 34
 */
const ALTERNATIVES_DATA = {
  "categories": [
    {
      "id": "all",
      "name": "All Software",
      "icon": "⚡"
    },
    {
      "id": "ai-coding",
      "name": "AI Coding & Agents",
      "icon": "💻"
    },
    {
      "id": "ai-models",
      "name": "AI Chatbots & Models",
      "icon": "🤖"
    },
    {
      "id": "productivity",
      "name": "Productivity & Notes",
      "icon": "📝"
    },
    {
      "id": "database-spreadsheets",
      "name": "Databases & Spreadsheets",
      "icon": "📊"
    },
    {
      "id": "design-media",
      "name": "Design & Creative Tools",
      "icon": "🎨"
    },
    {
      "id": "automation",
      "name": "Automation & Workflows",
      "icon": "⚡"
    },
    {
      "id": "communication",
      "name": "Chat & Collaboration",
      "icon": "💬"
    },
    {
      "id": "project-management",
      "name": "Project Management",
      "icon": "📋"
    },
    {
      "id": "developer-tools",
      "name": "Dev Tools & APIs",
      "icon": "🛠️"
    },
    {
      "id": "security-cloud",
      "name": "Security & Cloud Storage",
      "icon": "🔒"
    },
    {
      "id": "analytics-marketing",
      "name": "Analytics & Marketing",
      "icon": "📈"
    }
  ],
  "software": [
    {
      "id": "github",
      "slug": "github",
      "name": "GitHub",
      "domain": "github.com",
      "logo": "https://www.google.com/s2/favicons?domain=github.com&sz=128",
      "category": "developer-tools",
      "categoryName": "Code Hosting & DevOps",
      "icon": "🐙",
      "description": "The world's largest code hosting and collaboration platform, owned by Microsoft.",
      "pricing": "Freemium ($4-$21/mo)",
      "officialUrl": "https://github.com",
      "alternatives": [
        {
          "id": "gitlab",
          "name": "GitLab CE",
          "domain": "gitlab.com",
          "logo": "https://www.google.com/s2/favicons?domain=gitlab.com&sz=128",
          "tagline": "Open-source comprehensive DevOps platform",
          "badge": "Open-Source (MIT)",
          "badgeType": "free",
          "description": "Complete self-hosted DevOps platform with Git repository management, CI/CD pipelines, and code review.",
          "stars": "24.5k",
          "license": "MIT",
          "url": "https://gitlab.com",
          "icon": "🦊",
          "features": [
            "Self-hostable",
            "Integrated CI/CD runners",
            "Container registry",
            "Issue tracking"
          ]
        },
        {
          "id": "gitea",
          "name": "Gitea / Forgejo",
          "domain": "gitea.com",
          "logo": "https://www.google.com/s2/favicons?domain=gitea.com&sz=128",
          "tagline": "Painless self-hosted Git service written in Go",
          "badge": "100% Free (MIT)",
          "badgeType": "free",
          "description": "Ultra-lightweight self-hosted Git server that runs on Raspberry Pi and minimal servers.",
          "stars": "43.2k",
          "license": "MIT",
          "url": "https://gitea.com",
          "icon": "☕",
          "features": [
            "Ultra-lightweight RAM footprint",
            "Built-in CI/CD actions",
            "Docker support",
            "GitHub-like UI"
          ]
        }
      ]
    },
    {
      "id": "trello-asana",
      "slug": "trello-asana",
      "name": "Trello / Asana",
      "domain": "trello.com",
      "logo": "https://www.google.com/s2/favicons?domain=trello.com&sz=128",
      "category": "project-management",
      "categoryName": "Kanban & Task Management",
      "icon": "📋",
      "description": "Visual Kanban board and project management software with per-seat monthly subscription tiers.",
      "pricing": "Freemium ($5-$17/mo)",
      "officialUrl": "https://trello.com",
      "alternatives": [
        {
          "id": "focalboard",
          "name": "Focalboard",
          "domain": "focalboard.com",
          "logo": "https://www.google.com/s2/favicons?domain=focalboard.com&sz=128",
          "tagline": "Open-source multilingual project management alternative to Trello",
          "badge": "Open-Source (AGPL-3.0)",
          "badgeType": "free",
          "description": "Self-hosted project management tool for individuals and teams, built by Mattermost.",
          "stars": "19.8k",
          "license": "AGPL-3.0",
          "url": "https://focalboard.com",
          "icon": "📌",
          "features": [
            "Kanban, table, and calendar views",
            "Self-hosted Docker",
            "Multi-user collaboration",
            "No per-seat fee"
          ]
        },
        {
          "id": "planka",
          "name": "Planka",
          "domain": "planka.app",
          "logo": "https://www.google.com/s2/favicons?domain=planka.app&sz=128",
          "tagline": "Elegant, real-time open-source Kanban board",
          "badge": "100% Free (AGPL)",
          "badgeType": "free",
          "description": "Modern real-time Kanban board for workgroups and individuals.",
          "stars": "7.4k",
          "license": "AGPL-3.0",
          "url": "https://planka.app",
          "icon": "🗂️",
          "features": [
            "Real-time board updates",
            "Custom backgrounds",
            "Timer & attachments",
            "Docker compose ready"
          ]
        }
      ]
    },
    {
      "id": "google-forms",
      "slug": "google-forms",
      "name": "Google Forms / SurveyMonkey",
      "domain": "surveymonkey.com",
      "logo": "https://www.google.com/s2/favicons?domain=surveymonkey.com&sz=128",
      "category": "analytics-marketing",
      "categoryName": "Surveys & User Research",
      "icon": "📊",
      "description": "Leading survey platforms with strict branding and paywalls on advanced logic.",
      "pricing": "Paid ($25-$99/mo)",
      "officialUrl": "https://surveymonkey.com",
      "alternatives": [
        {
          "id": "heyform",
          "name": "HeyForm",
          "domain": "heyform.net",
          "logo": "https://www.google.com/s2/favicons?domain=heyform.net&sz=128",
          "tagline": "Open-source online form builder",
          "badge": "Open-Source",
          "badgeType": "free",
          "description": "Customizable drag-and-drop form builder with interactive conversational UI.",
          "stars": "6.2k",
          "license": "AGPL-3.0",
          "url": "https://heyform.net",
          "icon": "📝",
          "features": [
            "No-code drag and drop",
            "Self-hosted Docker",
            "Custom domains",
            "Unlimited inputs"
          ]
        }
      ]
    },
    {
      "id": "hubspot",
      "slug": "hubspot",
      "name": "HubSpot",
      "domain": "hubspot.com",
      "logo": "https://www.google.com/s2/favicons?domain=hubspot.com&sz=128",
      "category": "analytics-marketing",
      "categoryName": "Marketing & Inbound CRM",
      "icon": "🎯",
      "description": "Inbound marketing, sales, and service software known for steep pricing jumps at scale.",
      "pricing": "Paid ($20-$800/mo)",
      "officialUrl": "https://hubspot.com",
      "alternatives": [
        {
          "id": "erpnext",
          "name": "ERPNext CRM",
          "domain": "erpnext.com",
          "logo": "https://www.google.com/s2/favicons?domain=erpnext.com&sz=128",
          "tagline": "Open-source comprehensive business suite",
          "badge": "100% Free & Open-Source",
          "badgeType": "free",
          "description": "Full-featured open-source CRM, sales pipeline, and marketing automation.",
          "stars": "18.1k",
          "license": "GPL-3.0",
          "url": "https://erpnext.com",
          "icon": "🏢",
          "features": [
            "Complete CRM & pipeline",
            "Email campaigns",
            "Self-hosted",
            "No license fees"
          ]
        }
      ]
    },
    {
      "id": "posthog-mixpanel",
      "slug": "posthog-mixpanel",
      "name": "Mixpanel / Amplitude",
      "domain": "mixpanel.com",
      "logo": "https://www.google.com/s2/favicons?domain=mixpanel.com&sz=128",
      "category": "analytics-marketing",
      "categoryName": "Product Analytics & Session Replay",
      "icon": "📈",
      "description": "Product analytics and user tracking platforms with steep event-volume pricing.",
      "pricing": "Paid ($20-$800/mo)",
      "officialUrl": "https://mixpanel.com",
      "alternatives": [
        {
          "id": "posthog",
          "name": "PostHog",
          "domain": "posthog.com",
          "logo": "https://www.google.com/s2/favicons?domain=posthog.com&sz=128",
          "tagline": "Open-source product analytics suite",
          "badge": "Open-Source (MIT)",
          "badgeType": "free",
          "description": "The open-source all-in-one product suite with analytics, session replay, feature flags, and A/B testing.",
          "stars": "22.5k",
          "license": "MIT",
          "url": "https://posthog.com",
          "icon": "🦔",
          "features": [
            "Product analytics",
            "Session replays",
            "Feature flags",
            "Generous free tier (1M events)"
          ]
        },
        {
          "id": "umami",
          "name": "Umami Analytics",
          "domain": "umami.is",
          "logo": "https://www.google.com/s2/favicons?domain=umami.is&sz=128",
          "tagline": "Simple, fast, privacy-focused open-source analytics",
          "badge": "100% Open-Source (MIT)",
          "badgeType": "free",
          "description": "Lightweight, privacy-focused alternative to Google Analytics with no cookie banners required.",
          "stars": "22.1k",
          "license": "MIT",
          "url": "https://umami.is",
          "icon": "🌱",
          "features": [
            "GDPR compliant without cookies",
            "Self-hosted Docker",
            "Clean real-time UI",
            "Lightweight script"
          ]
        }
      ]
    },
    {
      "id": "grammarly",
      "slug": "grammarly",
      "name": "Grammarly",
      "domain": "grammarly.com",
      "logo": "https://www.google.com/s2/favicons?domain=grammarly.com&sz=128",
      "category": "productivity",
      "categoryName": "Grammar & Writing Assistants",
      "icon": "✍️",
      "description": "AI-powered writing and grammar assistant with paid monthly premium subscriptions.",
      "pricing": "Freemium ($12-$30/mo)",
      "officialUrl": "https://grammarly.com",
      "alternatives": [
        {
          "id": "languagetool",
          "name": "LanguageTool",
          "domain": "languagetool.org",
          "logo": "https://www.google.com/s2/favicons?domain=languagetool.org&sz=128",
          "tagline": "Open-source multilingual grammar, style, and spell checker",
          "badge": "Open-Source & Free Tier",
          "badgeType": "free",
          "description": "Trusted by millions for open-source multilingual grammar checking across 30+ languages.",
          "stars": "12.4k",
          "license": "LGPL-2.1",
          "url": "https://languagetool.org",
          "icon": "🔤",
          "features": [
            "Checks 30+ languages",
            "Browser extensions",
            "Self-hostable Java server",
            "Privacy-first design"
          ]
        }
      ]
    },
    {
      "id": "calendly",
      "slug": "calendly",
      "name": "Calendly",
      "category": "productivity",
      "categoryName": "Productivity & Scheduling",
      "icon": "📅",
      "description": "Popular scheduling automation platform for booking meetings and appointments without email ping-pong.",
      "pricing": "Freemium ($10/mo)",
      "officialUrl": "https://calendly.com",
      "alternatives": [
        {
          "id": "cal-com",
          "name": "Cal.com",
          "tagline": "Open-source scheduling infrastructure for everyone",
          "badge": "100% Free & Open-Source",
          "badgeType": "free",
          "description": "The leading open-source alternative to Calendly with full privacy control, unlimited event types, and self-hosting support.",
          "stars": "34.5k",
          "license": "AGPL-3.0",
          "url": "https://cal.com",
          "icon": "📆",
          "features": [
            "Self-hostable",
            "Unlimited booking links",
            "Custom branding",
            "No tracking",
            "Stripe payment integration"
          ],
          "domain": "cal.com",
          "logo": "https://www.google.com/s2/favicons?domain=cal.com&sz=128"
        },
        {
          "id": "easy-appointments",
          "name": "Easy!Appointments",
          "tagline": "Open-source appointment scheduler",
          "badge": "Free & Open-Source",
          "badgeType": "free",
          "description": "Lightweight self-hosted booking system that syncs with Google Calendar.",
          "stars": "3.8k",
          "license": "GPL-3.0",
          "url": "https://easyappointments.org",
          "icon": "⏱️",
          "features": [
            "Google Calendar sync",
            "Multi-provider support",
            "Mobile responsive",
            "Free forever"
          ],
          "domain": "easyappointments.org",
          "logo": "https://www.google.com/s2/favicons?domain=easyappointments.org&sz=128"
        }
      ],
      "domain": "calendly.com",
      "logo": "https://www.google.com/s2/favicons?domain=calendly.com&sz=128"
    },
    {
      "id": "docusign",
      "slug": "docusign",
      "name": "DocuSign",
      "category": "productivity",
      "categoryName": "Legal & E-Signatures",
      "icon": "✍️",
      "description": "Industry-standard electronic signature and agreement management software with costly per-envelope pricing.",
      "pricing": "Paid ($10-$40/mo)",
      "officialUrl": "https://docusign.com",
      "alternatives": [
        {
          "id": "documenso",
          "name": "Documenso",
          "tagline": "The open-source DocuSign alternative",
          "badge": "100% Open-Source",
          "badgeType": "free",
          "description": "Modern open-source e-signature platform built for trust, security, and full document ownership.",
          "stars": "9.2k",
          "license": "AGPL-3.0",
          "url": "https://documenso.com",
          "icon": "📄",
          "features": [
            "Self-hostable",
            "Unlimited signatures",
            "Developer API",
            "Legally binding e-signatures",
            "Full audit trail"
          ],
          "domain": "documenso.com",
          "logo": "https://www.google.com/s2/favicons?domain=documenso.com&sz=128"
        },
        {
          "id": "signhouse",
          "name": "SignHouse",
          "tagline": "Efficient eSignature software",
          "badge": "Generous Free Tier",
          "badgeType": "freemium",
          "description": "Fast, modern electronic signature tool with generous free envelopes.",
          "stars": "1.5k",
          "license": "Proprietary Free",
          "url": "https://useizesign.com",
          "icon": "🖋️",
          "features": [
            "Instant signing",
            "PDF editing",
            "Mobile signing",
            "Free tier"
          ],
          "domain": "useizesign.com",
          "logo": "https://www.google.com/s2/favicons?domain=useizesign.com&sz=128"
        }
      ],
      "domain": "docusign.com",
      "logo": "https://www.google.com/s2/favicons?domain=docusign.com&sz=128"
    },
    {
      "id": "typeform",
      "slug": "typeform",
      "name": "Typeform",
      "category": "analytics-marketing",
      "categoryName": "Forms & Surveys",
      "icon": "📋",
      "description": "Interactive conversational form and survey builder with high monthly subscription costs.",
      "pricing": "Paid ($25-$83/mo)",
      "officialUrl": "https://typeform.com",
      "alternatives": [
        {
          "id": "typebot",
          "name": "Typebot",
          "tagline": "Open-source conversational form and chatbot builder",
          "badge": "Open-Source & Free",
          "badgeType": "free",
          "description": "Build high-converting conversational forms, quiz flows, and lead-gen bots with open-source flexibility.",
          "stars": "8.4k",
          "license": "AGPL-3.0",
          "url": "https://typebot.io",
          "icon": "🤖",
          "features": [
            "Visual drag-and-drop flow",
            "Native webhook & WhatsApp support",
            "Self-host with Docker",
            "Unlimited responses"
          ],
          "domain": "typebot.io",
          "logo": "https://www.google.com/s2/favicons?domain=typebot.io&sz=128"
        },
        {
          "id": "formbricks",
          "name": "Formbricks",
          "tagline": "Open-source experience management & micro-surveys",
          "badge": "Open-Source",
          "badgeType": "free",
          "description": "Privacy-first user research and survey suite designed to run in-app or via link.",
          "stars": "6.1k",
          "license": "AGPL-3.0",
          "url": "https://formbricks.com",
          "icon": "🧱",
          "features": [
            "In-app micro-surveys",
            "Privacy-first tracking",
            "Webhook integrations",
            "Self-hostable"
          ],
          "domain": "formbricks.com",
          "logo": "https://www.google.com/s2/favicons?domain=formbricks.com&sz=128"
        },
        {
          "id": "tally",
          "name": "Tally Forms",
          "tagline": "The simplest way to create forms for free",
          "badge": "99% Free Forever",
          "badgeType": "freemium",
          "description": "Notion-like form builder that offers 99% of its features completely free without response limits.",
          "stars": "5.0k",
          "license": "Freemium",
          "url": "https://tally.so",
          "icon": "📝",
          "features": [
            "Unlimited forms and responses",
            "Notion-style markdown editor",
            "Custom domains",
            "Zero paywalls on basic logic"
          ],
          "domain": "tally.so",
          "logo": "https://www.google.com/s2/favicons?domain=tally.so&sz=128"
        }
      ],
      "domain": "typeform.com",
      "logo": "https://www.google.com/s2/favicons?domain=typeform.com&sz=128"
    },
    {
      "id": "salesforce",
      "slug": "salesforce",
      "name": "Salesforce CRM",
      "category": "analytics-marketing",
      "categoryName": "CRM & Sales",
      "icon": "💼",
      "description": "Complex enterprise CRM with steep licensing fees and high implementation overhead.",
      "pricing": "Paid ($25-$300/mo/user)",
      "officialUrl": "https://salesforce.com",
      "alternatives": [
        {
          "id": "twenty-crm",
          "name": "Twenty CRM",
          "tagline": "Building the open-source alternative to Salesforce",
          "badge": "100% Open-Source",
          "badgeType": "free",
          "description": "Modern, fast, and community-driven CRM designed to give businesses full control over customer data.",
          "stars": "23.8k",
          "license": "AGPL-3.0",
          "url": "https://twenty.com",
          "icon": "✨",
          "features": [
            "Modern GraphQL API",
            "Self-hostable Docker",
            "Custom object schemas",
            "No per-seat pricing locks"
          ],
          "domain": "twenty.com",
          "logo": "https://www.google.com/s2/favicons?domain=twenty.com&sz=128"
        },
        {
          "id": "chatwoot-crm",
          "name": "Chatwoot",
          "tagline": "Open-source customer engagement platform",
          "badge": "Open-Source",
          "badgeType": "free",
          "description": "Omnichannel customer support and relationship tool connecting WhatsApp, Email, and Livechat.",
          "stars": "21.2k",
          "license": "AGPL-3.0",
          "url": "https://chatwoot.com",
          "icon": "💬",
          "features": [
            "Omnichannel inbox",
            "WhatsApp & Telegram API",
            "Self-hosted",
            "Multi-agent support"
          ],
          "domain": "chatwoot.com",
          "logo": "https://www.google.com/s2/favicons?domain=chatwoot.com&sz=128"
        }
      ],
      "domain": "salesforce.com",
      "logo": "https://www.google.com/s2/favicons?domain=salesforce.com&sz=128"
    },
    {
      "id": "bitly",
      "slug": "bitly",
      "name": "Bitly",
      "category": "developer-tools",
      "categoryName": "Link Management & QR Codes",
      "icon": "🔗",
      "description": "Link shortener and QR code platform with strict limits on free link creation and analytics.",
      "pricing": "Freemium ($8-$199/mo)",
      "officialUrl": "https://bitly.com",
      "alternatives": [
        {
          "id": "dub-co",
          "name": "Dub.co",
          "tagline": "Open-source link management for modern marketing teams",
          "badge": "Open-Source & Free Tier",
          "badgeType": "free",
          "description": "The modern open-source Bitly alternative with custom domains, geo-targeting, QR codes, and rich analytics.",
          "stars": "18.5k",
          "license": "AGPL-3.0",
          "url": "https://dub.co",
          "icon": "⚡",
          "features": [
            "Custom domain branding",
            "Geo-targeted redirection",
            "Dynamic QR codes",
            "Real-time analytics engine"
          ],
          "domain": "dub.co",
          "logo": "https://www.google.com/s2/favicons?domain=dub.co&sz=128"
        },
        {
          "id": "kutt-it",
          "name": "Kutt.it",
          "tagline": "Modern URL shortener with rich support for custom domains",
          "badge": "Free & Open-Source",
          "badgeType": "free",
          "description": "Clean, lightweight open-source link shortener you can deploy on your own server.",
          "stars": "6.5k",
          "license": "MIT",
          "url": "https://kutt.it",
          "icon": "✂️",
          "features": [
            "MIT Licensed",
            "REST API",
            "Custom domains",
            "Self-host in 2 minutes"
          ],
          "domain": "kutt.it",
          "logo": "https://www.google.com/s2/favicons?domain=kutt.it&sz=128"
        }
      ],
      "domain": "bitly.com",
      "logo": "https://www.google.com/s2/favicons?domain=bitly.com&sz=128"
    },
    {
      "id": "shopify",
      "slug": "shopify",
      "name": "Shopify",
      "category": "developer-tools",
      "categoryName": "E-Commerce Platforms",
      "icon": "🛍️",
      "description": "Hosted e-commerce platform with monthly fees and transaction cuts on non-Shopify payments.",
      "pricing": "Paid ($39-$399/mo + %)",
      "officialUrl": "https://shopify.com",
      "alternatives": [
        {
          "id": "medusa-js",
          "name": "Medusa.js",
          "tagline": "The open-source Shopify alternative for developers",
          "badge": "100% Open-Source (MIT)",
          "badgeType": "free",
          "description": "Modular headless commerce platform built on Node.js with complete frontend flexibility and zero transaction fees.",
          "stars": "27.4k",
          "license": "MIT",
          "url": "https://medusajs.com",
          "icon": "🐙",
          "features": [
            "Headless commerce architecture",
            "Multi-currency and multi-region",
            "Zero vendor fees",
            "Next.js starter storefronts"
          ],
          "domain": "medusajs.com",
          "logo": "https://www.google.com/s2/favicons?domain=medusajs.com&sz=128"
        },
        {
          "id": "saleor-commerce",
          "name": "Saleor",
          "tagline": "Composable headless commerce platform",
          "badge": "Open-Source (BSD-3)",
          "badgeType": "free",
          "description": "Ultra-fast GraphQL-powered headless commerce engine for global multi-channel retail.",
          "stars": "20.1k",
          "license": "BSD-3-Clause",
          "url": "https://saleor.io",
          "icon": "🛒",
          "features": [
            "GraphQL API first",
            "Multi-warehouse inventory",
            "Global localization",
            "Self-hostable"
          ],
          "domain": "saleor.io",
          "logo": "https://www.google.com/s2/favicons?domain=saleor.io&sz=128"
        }
      ],
      "domain": "shopify.com",
      "logo": "https://www.google.com/s2/favicons?domain=shopify.com&sz=128"
    },
    {
      "id": "hashicorp-vault",
      "slug": "hashicorp-vault",
      "name": "HashiCorp Vault / Doppler",
      "category": "security-cloud",
      "categoryName": "Secrets & Environment Management",
      "icon": "🔐",
      "description": "Secret and key management systems that transitioned to BSL licenses and high SaaS pricing.",
      "pricing": "Paid / BSL License",
      "officialUrl": "https://www.vaultproject.io",
      "alternatives": [
        {
          "id": "infisical",
          "name": "Infisical",
          "tagline": "Open-source secret management platform",
          "badge": "Open-Source (MIT)",
          "badgeType": "free",
          "description": "End-to-end encrypted secret management platform for syncing environment variables across teams and CI/CD pipelines.",
          "stars": "15.8k",
          "license": "MIT",
          "url": "https://infisical.com",
          "icon": "🔒",
          "features": [
            "End-to-end encryption",
            "Automatic secret scanning in Git",
            "Kubernetes & Docker integrations",
            "Self-hostable"
          ],
          "domain": "infisical.com",
          "logo": "https://www.google.com/s2/favicons?domain=infisical.com&sz=128"
        },
        {
          "id": "bitwarden-secrets",
          "name": "Bitwarden Secrets Manager",
          "tagline": "Developer-first secrets management",
          "badge": "Open-Source & Free Tier",
          "badgeType": "free",
          "description": "Secure storage and injection of API keys, tokens, and credentials for developers.",
          "stars": "7.2k",
          "license": "GPL-3.0",
          "url": "https://bitwarden.com/products/secrets-manager/",
          "icon": "🛡️",
          "features": [
            "Zero-knowledge encryption",
            "CLI & SDK integrations",
            "Free tier for small teams",
            "Audit logs"
          ],
          "domain": "bitwarden.com",
          "logo": "https://www.google.com/s2/favicons?domain=bitwarden.com&sz=128"
        }
      ],
      "domain": "vaultproject.io",
      "logo": "https://www.google.com/s2/favicons?domain=vaultproject.io&sz=128"
    },
    {
      "id": "intercom",
      "slug": "intercom",
      "name": "Intercom / Zendesk",
      "category": "communication",
      "categoryName": "Customer Support & Live Chat",
      "icon": "💬",
      "description": "Customer messaging software with expensive per-seat pricing and high AI resolution add-ons.",
      "pricing": "Paid ($39-$139/seat/mo)",
      "officialUrl": "https://intercom.com",
      "alternatives": [
        {
          "id": "chatwoot-support",
          "name": "Chatwoot",
          "tagline": "Open-source customer engagement suite",
          "badge": "100% Open-Source",
          "badgeType": "free",
          "description": "The open-source alternative to Intercom. Unified inbox for Live Chat, Email, WhatsApp, Facebook, and Twitter.",
          "stars": "21.2k",
          "license": "AGPL-3.0",
          "url": "https://chatwoot.com",
          "icon": "🗨️",
          "features": [
            "Self-hosted on Docker",
            "Omnichannel customer messaging",
            "Mobile apps for agents",
            "No per-agent fees"
          ],
          "domain": "chatwoot.com",
          "logo": "https://www.google.com/s2/favicons?domain=chatwoot.com&sz=128"
        },
        {
          "id": "papercups",
          "name": "Papercups",
          "tagline": "Open-source live customer chat",
          "badge": "Open-Source (MIT)",
          "badgeType": "free",
          "description": "Lightweight open-source chat widget that embeds directly into React and web apps.",
          "stars": "5.6k",
          "license": "MIT",
          "url": "https://papercups.io",
          "icon": "☕",
          "features": [
            "MIT Licensed",
            "React widget component",
            "Slack inbox integration",
            "Self-hostable"
          ],
          "domain": "papercups.io",
          "logo": "https://www.google.com/s2/favicons?domain=papercups.io&sz=128"
        }
      ],
      "domain": "intercom.com",
      "logo": "https://www.google.com/s2/favicons?domain=intercom.com&sz=128"
    },
    {
      "id": "cursor-ide",
      "slug": "cursor-ide",
      "name": "Cursor IDE",
      "category": "ai-coding",
      "categoryName": "AI Coding & Agents",
      "domain": "cursor.com",
      "proprietaryUrl": "https://cursor.com",
      "logo": "https://www.google.com/s2/favicons?domain=cursor.com&sz=128",
      "tagline": "The AI-first code editor built on VS Code with background agentic features.",
      "description": "Cursor is an AI-powered code editor with agentic coding capabilities, multi-file edits, and chat over codebase. Discover community-built, self-hosted, and open-source alternatives that run with your own local or private LLM keys.",
      "alternatives": [
        {
          "name": "Continue.dev",
          "slug": "continue-dev",
          "domain": "continue.dev",
          "website": "https://continue.dev",
          "github": "https://github.com/continuedev/continue",
          "stars": "22.5k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "description": "Leading open-source AI code assistant extension for VS Code and JetBrains. Connect any local LLM (Ollama, LM Studio) or frontier API (Claude 3.7, DeepSeek V3, GPT-4o).",
          "highlights": [
            "Local LLMs & Custom Models",
            "Tab Autocomplete & Chat",
            "Multi-file context with @codebase",
            "Zero vendor lock-in"
          ],
          "techStack": [
            "TypeScript",
            "Python",
            "Rust",
            "Ollama",
            "VS Code Extension"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=continue.dev&sz=128"
        },
        {
          "name": "Aider",
          "slug": "aider",
          "domain": "aider.chat",
          "website": "https://aider.chat",
          "github": "https://github.com/paul-gauthier/aider",
          "stars": "28.4k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "description": "Terminal-based AI pair programming tool that edits files directly in your local git repository and automatically commits changes with descriptive commit messages.",
          "highlights": [
            "Git repo map optimization",
            "Multi-file synchronized edits",
            "Voice-to-code support",
            "Supports Claude 3.7 & DeepSeek-R1"
          ],
          "techStack": [
            "Python",
            "Git",
            "Treesitter",
            "OpenAI / Anthropic API"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=aider.chat&sz=128"
        },
        {
          "name": "Void Editor",
          "slug": "void-editor",
          "domain": "voideditor.com",
          "website": "https://voideditor.com",
          "github": "https://github.com/voideditor/void",
          "stars": "11.8k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "description": "Open-source AI-first code editor designed as an open, private alternative to Cursor. Control all data, models, and indexing locally.",
          "highlights": [
            "VS Code fork with native AI UX",
            "Local codebase vector indexing",
            "Full privacy guarantee",
            "Custom model endpoints"
          ],
          "techStack": [
            "TypeScript",
            "Electron",
            "VS Code Core"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=voideditor.com&sz=128"
        },
        {
          "name": "Roo Code (Cline Fork)",
          "slug": "roo-code",
          "domain": "roocode.com",
          "website": "https://roocode.com",
          "github": "https://github.com/RooVetGit/Roo-Code",
          "stars": "14.2k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "description": "Autonomous coding agent extension inside VS Code that executes terminal commands, browses files, and creates complete pull requests.",
          "highlights": [
            "Autonomous multi-step execution",
            "Custom system prompts & rules",
            "MCP (Model Context Protocol) integration",
            "Diff approval workflow"
          ],
          "techStack": [
            "TypeScript",
            "VS Code Extension",
            "MCP"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=roocode.com&sz=128"
        },
        {
          "name": "Tabby",
          "slug": "tabby",
          "domain": "tabbyml.github.io",
          "website": "https://tabbyml.github.io/tabby",
          "github": "https://github.com/TabbyML/tabby",
          "stars": "26.1k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "description": "Self-hosted AI coding assistant server with enterprise grade code completion and indexing that runs completely on-premises on GPUs/CPUs.",
          "highlights": [
            "100% Self-Hosted & Air-Gapped",
            "Enterprise SSO & Permissions",
            "Hardware accelerated inference",
            "Multi-editor plugins"
          ],
          "techStack": [
            "Rust",
            "CUDA",
            "WebAssembly"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=tabbyml.github.io&sz=128"
        }
      ]
    },
    {
      "id": "chatgpt-plus",
      "slug": "chatgpt-plus",
      "name": "ChatGPT Plus",
      "category": "ai-models",
      "categoryName": "AI Chatbots & Models",
      "domain": "openai.com",
      "proprietaryUrl": "https://chatgpt.com",
      "logo": "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
      "tagline": "OpenAI's flagship conversational model interface with web search, canvas & voice.",
      "description": "ChatGPT is the industry-leading chatbot interface. Discover open-source Web UIs that give you identical or superior capabilities while letting you plug in DeepSeek, Claude, Llama 3, and private local models.",
      "alternatives": [
        {
          "name": "Open WebUI",
          "slug": "open-webui",
          "domain": "openwebui.com",
          "website": "https://openwebui.com",
          "github": "https://github.com/open-webui/open-webui",
          "stars": "68.9k",
          "license": "MIT",
          "selfHosted": true,
          "description": "Extensible, feature-rich, and user-friendly self-hosted AI interface with full Ollama & OpenAI API compatibility, RAG, Web Search, and multi-user authentication.",
          "highlights": [
            "Native Ollama & OpenAI API support",
            "Built-in RAG with document upload",
            "Web search & Python code execution",
            "Role-based access control"
          ],
          "techStack": [
            "Svelte",
            "FastAPI",
            "Python",
            "Docker"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=openwebui.com&sz=128"
        },
        {
          "name": "LibreChat",
          "slug": "librechat",
          "domain": "librechat.ai",
          "website": "https://librechat.ai",
          "github": "https://github.com/danny-avila/LibreChat",
          "stars": "22.3k",
          "license": "MIT",
          "selfHosted": true,
          "description": "Every AI in one platform: ChatGPT-clone web UI supporting OpenAI, Anthropic Claude, Gemini, DeepSeek, Mistral, Ollama, and custom plugins.",
          "highlights": [
            "Multi-model conversation fork & split",
            "Artifacts viewer & code sandbox",
            "DALL-E & Stable Diffusion generation",
            "Speech-to-text & TTS"
          ],
          "techStack": [
            "Node.js",
            "React",
            "MongoDB",
            "Docker"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=librechat.ai&sz=128"
        },
        {
          "name": "Jan.ai",
          "slug": "jan-ai",
          "domain": "jan.ai",
          "website": "https://jan.ai",
          "github": "https://github.com/janhq/jan",
          "stars": "25.1k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "description": "Open-source 100% offline ChatGPT alternative desktop app that runs GGUF models directly on your hardware with 1-click model downloads.",
          "highlights": [
            "100% offline & local",
            "Local OpenAI-compatible API server",
            "Cortex engine for fast inference",
            "Cross-platform (Mac, Win, Linux)"
          ],
          "techStack": [
            "TypeScript",
            "C++",
            "Electron"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=jan.ai&sz=128"
        },
        {
          "name": "Chatbox",
          "slug": "chatbox",
          "domain": "chatboxai.app",
          "website": "https://chatboxai.app",
          "github": "https://github.com/Bin-Huang/chatbox",
          "stars": "27.8k",
          "license": "GPL-3.0",
          "selfHosted": true,
          "description": "Open-source cross-platform desktop client for AI models with local markdown rendering, prompt management, and cloud backup sync.",
          "highlights": [
            "Bring your own API keys",
            "Built-in Prompt Library",
            "Local data encryption",
            "Mobile & Desktop apps"
          ],
          "techStack": [
            "React",
            "Tauri",
            "Rust"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=chatboxai.app&sz=128"
        }
      ]
    },
    {
      "id": "claude-ai",
      "slug": "claude-ai",
      "name": "Anthropic Claude",
      "category": "ai-models",
      "categoryName": "AI Chatbots & Models",
      "domain": "anthropic.com",
      "proprietaryUrl": "https://claude.ai",
      "logo": "https://www.google.com/s2/favicons?domain=anthropic.com&sz=128",
      "tagline": "Anthropic's frontier reasoning model and live interactive Artifacts workspace.",
      "description": "Claude is known for human-like writing, massive 200k+ context windows, and code artifacts. Discover open-source tools with interactive live artifact rendering and frontier reasoning support.",
      "alternatives": [
        {
          "name": "LibreChat Artifacts",
          "slug": "librechat-artifacts",
          "domain": "librechat.ai",
          "website": "https://librechat.ai",
          "github": "https://github.com/danny-avila/LibreChat",
          "stars": "22.3k",
          "license": "MIT",
          "selfHosted": true,
          "description": "Self-hosted UI featuring complete Claude-style Artifacts side-by-side execution with React, HTML, Mermaid, and SVG live renderers.",
          "highlights": [
            "Side-by-side Artifacts preview",
            "Direct Claude 3.7 API integration",
            "Custom agents & tools",
            "Full conversation export"
          ],
          "techStack": [
            "React",
            "Node.js",
            "MongoDB"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=librechat.ai&sz=128"
        },
        {
          "name": "DeepSeek Chat",
          "slug": "deepseek-chat",
          "domain": "deepseek.com",
          "website": "https://chat.deepseek.com",
          "github": "https://github.com/deepseek-ai",
          "stars": "75.4k",
          "license": "MIT",
          "selfHosted": true,
          "description": "Open-weights frontier reasoning models (DeepSeek-R1 & V3) matching Claude Opus and OpenAI o1 performance at 90% lower inference costs.",
          "highlights": [
            "Open-weights available on HuggingFace",
            "Full chain-of-thought visibility",
            "Top-tier math & coding benchmark scores",
            "Local deployment with Ollama / vLLM"
          ],
          "techStack": [
            "Python",
            "PyTorch",
            "vLLM",
            "GGUF"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=deepseek.com&sz=128"
        },
        {
          "name": "Lobe Chat",
          "slug": "lobe-chat",
          "domain": "lobehub.com",
          "website": "https://lobehub.com",
          "github": "https://github.com/lobehub/lobe-chat",
          "stars": "54.1k",
          "license": "MIT",
          "selfHosted": true,
          "description": "Modern, design-led open-source AI workspace with plugin ecosystem, multi-agent market, and visual artifact previews.",
          "highlights": [
            "Design-focused aesthetic",
            "Plugin market & function calling",
            "Mobile-first PWA & desktop app",
            "Self-hosted with 1-click Vercel/Docker"
          ],
          "techStack": [
            "Next.js",
            "TypeScript",
            "Tailwind CSS"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=lobehub.com&sz=128"
        }
      ]
    },
    {
      "id": "perplexity-ai",
      "slug": "perplexity-ai",
      "name": "Perplexity AI",
      "category": "ai-models",
      "categoryName": "AI Chatbots & Models",
      "domain": "perplexity.ai",
      "proprietaryUrl": "https://perplexity.ai",
      "logo": "https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128",
      "tagline": "AI conversational answer engine with real-time web citations and synthesis.",
      "description": "Perplexity provides live web-grounded research answers with citations. Discover open-source AI search engines that let you search the web using SearXNG or Google with local LLMs.",
      "alternatives": [
        {
          "name": "Perplexica",
          "slug": "perplexica",
          "domain": "github.com",
          "website": "https://github.com/ItzCrazy-Ad/Perplexica",
          "github": "https://github.com/ItzCrazy-Ad/Perplexica",
          "stars": "18.7k",
          "license": "MIT",
          "selfHosted": true,
          "description": "Open-source AI-powered search engine deep research tool that uses local LLMs (Ollama) and SearXNG to search the live web and synthesize answers.",
          "highlights": [
            "SearXNG metasearch engine backend",
            "Multiple Focus Modes (Academic, YouTube, Writing)",
            "100% Local LLM or Cloud API support",
            "Interactive source citation previews"
          ],
          "techStack": [
            "Next.js",
            "SearXNG",
            "Ollama",
            "Docker"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=github.com&sz=128"
        },
        {
          "name": "Khoj",
          "slug": "khoj",
          "domain": "khoj.dev",
          "website": "https://khoj.dev",
          "github": "https://github.com/khoj-ai/khoj",
          "stars": "19.8k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "description": "Open-source AI personal research assistant that searches the web and your personal notes (Obsidian, Notion, PDFs, Markdown, GitHub).",
          "highlights": [
            "Web search + local second brain search",
            "Obsidian & Emacs integrations",
            "Automation & scheduled research digests",
            "Self-hosted privacy"
          ],
          "techStack": [
            "Python",
            "FastAPI",
            "React"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=khoj.dev&sz=128"
        },
        {
          "name": "MindSearch",
          "slug": "mindsearch",
          "domain": "github.com",
          "website": "https://github.com/InternLM/MindSearch",
          "github": "https://github.com/InternLM/MindSearch",
          "stars": "6.2k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "description": "Multi-agent search engine framework that simulates human research workflows by breaking complex queries into dynamic sub-queries across hundreds of pages.",
          "highlights": [
            "Multi-agent parallel web search",
            "Deep multi-page synthesis",
            "Visual graph thought tree",
            "Open-source weights"
          ],
          "techStack": [
            "Python",
            "LangChain",
            "Gradio"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=github.com&sz=128"
        }
      ]
    },
    {
      "id": "midjourney",
      "slug": "midjourney",
      "name": "Midjourney",
      "category": "design-media",
      "categoryName": "Design & Creative Tools",
      "domain": "midjourney.com",
      "proprietaryUrl": "https://midjourney.com",
      "logo": "https://www.google.com/s2/favicons?domain=midjourney.com&sz=128",
      "tagline": "Proprietary photorealistic image generation model accessible via Discord and Web.",
      "description": "Midjourney is a closed-source image generator. Explore top open-source image generation ecosystems that run on your local GPU with unlimited generation and no monthly subscriptions.",
      "alternatives": [
        {
          "name": "ComfyUI",
          "slug": "comfyui",
          "domain": "github.com",
          "website": "https://github.com/comfyanonymous/ComfyUI",
          "github": "https://github.com/comfyanonymous/ComfyUI",
          "stars": "63.2k",
          "license": "GPL-3.0",
          "selfHosted": true,
          "description": "The most powerful and modular visual node-based GUI for Stable Diffusion, Flux.1, SDXL, and video generation models with zero subscription fees.",
          "highlights": [
            "Node-based workflow automation",
            "Support for Flux.1, SDXL, Stable Video",
            "Extremely fast GPU memory management",
            "Massive custom node community"
          ],
          "techStack": [
            "Python",
            "PyTorch",
            "JavaScript",
            "CUDA"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=github.com&sz=128"
        },
        {
          "name": "Fooocus",
          "slug": "fooocus",
          "domain": "github.com",
          "website": "https://github.com/lllyasviel/Fooocus",
          "github": "https://github.com/lllyasviel/Fooocus",
          "stars": "43.1k",
          "license": "GPL-3.0",
          "selfHosted": true,
          "description": "Midjourney-style minimalist image generation software based on SDXL. Simple prompt interface with automatic prompt expansion and styles.",
          "highlights": [
            "Midjourney-like prompt simplicity",
            "Outpainting & inpainting included",
            "Faceswap & image prompt mixing",
            "Runs on modest 4GB-8GB GPUs"
          ],
          "techStack": [
            "Python",
            "Gradio",
            "PyTorch"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=github.com&sz=128"
        },
        {
          "name": "AUTOMATIC1111 WebUI",
          "slug": "automatic1111-webui",
          "domain": "github.com",
          "website": "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
          "github": "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
          "stars": "148.5k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "description": "The definitive open-source browser interface for Stable Diffusion models with ControlNet, LoRA management, and extensive extension support.",
          "highlights": [
            "ControlNet & LoRA integrations",
            "Text2Img, Img2Img, Upscaling",
            "Extensive plugin marketplace",
            "Active open-source community"
          ],
          "techStack": [
            "Python",
            "Gradio",
            "PyTorch"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=github.com&sz=128"
        },
        {
          "name": "InvokeAI",
          "slug": "invokeai",
          "domain": "invoke.com",
          "website": "https://invoke.com",
          "github": "https://github.com/invoke-ai/InvokeAI",
          "stars": "24.8k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "description": "Professional creative engine for generative image workflows featuring an infinite canvas, board asset management, and commercial-safe pipelines.",
          "highlights": [
            "Infinite Canvas editor",
            "Multi-model management",
            "Commercial-friendly license",
            "Clean pro studio UI"
          ],
          "techStack": [
            "TypeScript",
            "Python",
            "React"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=invoke.com&sz=128"
        }
      ]
    },
    {
      "id": "notion",
      "slug": "notion",
      "name": "Notion",
      "category": "productivity",
      "categoryName": "Productivity & Notes",
      "domain": "notion.so",
      "proprietaryUrl": "https://notion.so",
      "logo": "https://www.google.com/s2/favicons?domain=notion.so&sz=128",
      "tagline": "All-in-one collaborative workspace for notes, docs, wikis, and databases.",
      "description": "Notion is a popular cloud workspace. Explore privacy-first, self-hostable, and offline-first modular document platforms with local storage guarantees.",
      "alternatives": [
        {
          "name": "AppFlowy",
          "slug": "appflowy",
          "domain": "appflowy.io",
          "website": "https://appflowy.io",
          "github": "https://github.com/AppFlowy-IO/AppFlowy",
          "stars": "57.8k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "description": "Leading open-source Notion alternative built with Flutter and Rust. 100% offline-first, private, and customizable with local databases and Kanban.",
          "highlights": [
            "100% offline-first data ownership",
            "Local database tables, grids & boards",
            "Built-in AI writing assistant",
            "Native apps on Mac, Win, Linux, iOS, Android"
          ],
          "techStack": [
            "Flutter",
            "Rust",
            "SQLite"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=appflowy.io&sz=128"
        },
        {
          "name": "AFFiNE",
          "slug": "affine",
          "domain": "affine.pro",
          "website": "https://affine.pro",
          "github": "https://github.com/toeverything/AFFiNE",
          "stars": "45.2k",
          "license": "MIT",
          "selfHosted": true,
          "description": "Next-generation knowledge base that merges docs, whiteboards, and database tables into one unified collaborative spatial workspace.",
          "highlights": [
            "Docs + Infinite Canvas Whiteboard",
            "True privacy & self-hostable with Docker",
            "Real-time multi-user collaboration",
            "Block-based modularity"
          ],
          "techStack": [
            "TypeScript",
            "Rust",
            "React",
            "Docker"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=affine.pro&sz=128"
        },
        {
          "name": "Anytype",
          "slug": "anytype",
          "domain": "anytype.io",
          "website": "https://anytype.io",
          "github": "https://github.com/anyproto/anytype-ts",
          "stars": "16.4k",
          "license": "Any Source Available",
          "selfHosted": true,
          "description": "Local-first, peer-to-peer encrypted operating system for your notes, tasks, ideas, and knowledge graph without centralized servers.",
          "highlights": [
            "End-to-end encrypted & P2P sync",
            "Object-oriented relational databases",
            "Works completely without internet",
            "Beautiful modern visual design"
          ],
          "techStack": [
            "Go",
            "TypeScript",
            "Electron",
            "IPFS / Anysync"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=anytype.io&sz=128"
        },
        {
          "name": "Obsidian",
          "slug": "obsidian",
          "domain": "obsidian.md",
          "website": "https://obsidian.md",
          "github": "https://github.com/obsidianmd",
          "stars": "110k+",
          "license": "Free Proprietary Local",
          "selfHosted": true,
          "description": "Sharp, extensible knowledge base that works on top of a local folder of plain text Markdown files with an enormous community plugin ecosystem.",
          "highlights": [
            "Plain Markdown files on your disk",
            "Visual interactive knowledge graph",
            "1,500+ Community plugins & themes",
            "Fast, private & future-proof"
          ],
          "techStack": [
            "TypeScript",
            "Electron",
            "Markdown"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=obsidian.md&sz=128"
        }
      ]
    },
    {
      "id": "airtable",
      "slug": "airtable",
      "name": "Airtable",
      "category": "database-spreadsheets",
      "categoryName": "Databases & Spreadsheets",
      "domain": "airtable.com",
      "proprietaryUrl": "https://airtable.com",
      "logo": "https://www.google.com/s2/favicons?domain=airtable.com&sz=128",
      "tagline": "Relational database and spreadsheet hybrid for building no-code apps.",
      "description": "Airtable charges heavy per-user fees and locks your business data into proprietary silos. Explore open-source, self-hosted relational databases that connect directly to PostgreSQL.",
      "alternatives": [
        {
          "name": "NocoDB",
          "slug": "nocodb",
          "domain": "nocodb.com",
          "website": "https://nocodb.com",
          "github": "https://github.com/nocodb/nocodb",
          "stars": "50.1k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "description": "Open-source Airtable alternative that transforms any PostgreSQL, MySQL, SQLite, or SQL Server into a smart spreadsheet UI with instant REST APIs.",
          "highlights": [
            "Connects to existing SQL databases",
            "Grid, Gallery, Kanban & Form views",
            "Auto-generated Swagger REST & GraphQL APIs",
            "Fine-grained role permissions"
          ],
          "techStack": [
            "Vue.js",
            "Node.js",
            "PostgreSQL",
            "Docker"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=nocodb.com&sz=128"
        },
        {
          "name": "Baserow",
          "slug": "baserow",
          "domain": "baserow.io",
          "website": "https://baserow.io",
          "github": "https://github.com/bram2w/baserow",
          "stars": "13.4k",
          "license": "MIT",
          "selfHosted": true,
          "description": "Open-source no-code database built with Django and Nuxt. Create relational databases, calculate formulas, and integrate with n8n seamlessly.",
          "highlights": [
            "Real-time collaborative editing",
            "Formula fields & lookup relations",
            "Self-hosted with Docker or Cloud",
            "Webhooks and API builder"
          ],
          "techStack": [
            "Python",
            "Django",
            "Nuxt.js",
            "PostgreSQL"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=baserow.io&sz=128"
        },
        {
          "name": "Grist",
          "slug": "grist",
          "domain": "getgrist.com",
          "website": "https://getgrist.com",
          "github": "https://github.com/gristlabs/grist-core",
          "stars": "8.6k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "description": "Spreadsheet database hybrid with full Python formula support, relational data modeling, custom access rules, and automated backups.",
          "highlights": [
            "Full Python formulas support",
            "Custom dashboard widgets & linking",
            "Granular column/row access control",
            "SQLite data format"
          ],
          "techStack": [
            "Python",
            "TypeScript",
            "SQLite"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=getgrist.com&sz=128"
        }
      ]
    },
    {
      "id": "zapier",
      "slug": "zapier",
      "name": "Zapier",
      "category": "automation",
      "categoryName": "Automation & Workflows",
      "domain": "zapier.com",
      "proprietaryUrl": "https://zapier.com",
      "logo": "https://www.google.com/s2/favicons?domain=zapier.com&sz=128",
      "tagline": "Proprietary workflow automation tool connecting web apps via step-based rules.",
      "description": "Zapier charges high task-based pricing with execution limits. Discover self-hosted, scalable automation platforms with hundreds of native integrations and unlimited executions.",
      "alternatives": [
        {
          "name": "n8n (Self-Hosted)",
          "slug": "n8n",
          "domain": "n8n.io",
          "website": "https://n8n.io",
          "github": "https://github.com/n8n-io/n8n",
          "stars": "61.2k",
          "license": "Sustainable Use License",
          "selfHosted": true,
          "description": "Fair-code licensed visual workflow automation tool with AI agent nodes, LangChain support, 400+ native integrations, and unlimited local executions.",
          "highlights": [
            "Native AI Agent & LangChain nodes",
            "400+ integrations (Slack, Gmail, DBs)",
            "Full JavaScript & Python code execution",
            "Run locally with Docker with zero task limits"
          ],
          "techStack": [
            "TypeScript",
            "Vue.js",
            "Node.js",
            "Docker"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=n8n.io&sz=128"
        },
        {
          "name": "Activepieces",
          "slug": "activepieces",
          "domain": "activepieces.com",
          "website": "https://activepieces.com",
          "github": "https://github.com/activepieces/activepieces",
          "stars": "11.7k",
          "license": "MIT",
          "selfHosted": true,
          "description": "Open-source no-code workflow automation tool designed specifically as a community-driven, 100% open Zapier alternative with modern TypeScript pieces.",
          "highlights": [
            "100% MIT Licensed core",
            "Modern clean UI & intuitive builder",
            "Write custom pieces in TypeScript",
            "Self-hosted with Docker Compose"
          ],
          "techStack": [
            "TypeScript",
            "Angular",
            "Node.js",
            "PostgreSQL"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=activepieces.com&sz=128"
        },
        {
          "name": "Windmill",
          "slug": "windmill",
          "domain": "windmill.dev",
          "website": "https://windmill.dev",
          "github": "https://github.com/windmill-labs/windmill",
          "stars": "13.8k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "description": "Open-source developer platform for workflows, internal tools, scripts, and UIs. Turns Python, TypeScript, Go, and Bash scripts into scalable background jobs.",
          "highlights": [
            "Fast Rust backend (10x faster execution)",
            "Auto-generated UIs for scripts",
            "Flow builder with branching & loops",
            "Enterprise secret management"
          ],
          "techStack": [
            "Rust",
            "TypeScript",
            "Python",
            "Svelte"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=windmill.dev&sz=128"
        }
      ]
    },
    {
      "id": "make",
      "slug": "make",
      "name": "Make (Integromat)",
      "category": "automation",
      "categoryName": "Automation & Workflows",
      "domain": "make.com",
      "proprietaryUrl": "https://make.com",
      "logo": "https://www.google.com/s2/favicons?domain=make.com&sz=128",
      "tagline": "Visual integration platform for designing complex multi-step automated workflows.",
      "description": "Make charges per-operation and can get expensive quickly as data transfers scale. Discover open-source automation engines with infinite branches and self-hosted control.",
      "alternatives": [
        {
          "name": "n8n",
          "slug": "n8n",
          "domain": "n8n.io",
          "website": "https://n8n.io",
          "github": "https://github.com/n8n-io/n8n",
          "stars": "61.2k",
          "license": "Sustainable Use License",
          "selfHosted": true,
          "description": "Visual node-based workflow builder with complex data transformation, JSON mapping, webhooks, and sub-workflow executions.",
          "highlights": [
            "Infinite branch & error routing",
            "Sub-workflow triggers",
            "Built-in webhook listener",
            "Self-hosted unlimited runs"
          ],
          "techStack": [
            "TypeScript",
            "Node.js",
            "Docker"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=n8n.io&sz=128"
        },
        {
          "name": "Automatisch",
          "slug": "automatisch",
          "domain": "automatisch.io",
          "website": "https://automatisch.io",
          "github": "https://github.com/automatisch/automatisch",
          "stars": "5.3k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "description": "Open-source business automation tool that lets you connect services while keeping data within your private infrastructure.",
          "highlights": [
            "Privacy & GDPR compliant",
            "No code required",
            "Self-hosted Docker setup",
            "Direct API triggers"
          ],
          "techStack": [
            "React",
            "Node.js",
            "PostgreSQL"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=automatisch.io&sz=128"
        }
      ]
    },
    {
      "id": "figma",
      "slug": "figma",
      "name": "Figma",
      "category": "design-media",
      "categoryName": "Design & Creative Tools",
      "domain": "figma.com",
      "proprietaryUrl": "https://figma.com",
      "logo": "https://www.google.com/s2/favicons?domain=figma.com&sz=128",
      "tagline": "Collaborative interface design, prototyping, and design system platform.",
      "description": "Figma is a dominant cloud UI design tool. Discover open-source, web-standard SVG and CSS-based design platforms that you can self-host for your entire team.",
      "alternatives": [
        {
          "name": "Penpot",
          "slug": "penpot",
          "domain": "penpot.app",
          "website": "https://penpot.app",
          "github": "https://github.com/penpot/penpot",
          "stars": "34.5k",
          "license": "MPL-2.0",
          "selfHosted": true,
          "description": "First open-source web-based design and prototyping tool for cross-functional teams based natively on open web standards (SVG, CSS Flexbox & CSS Grid).",
          "highlights": [
            "Native CSS Grid & Flexbox layout engine",
            "SVG native vector rendering",
            "Interactive prototyping & components",
            "Self-hosted on Docker"
          ],
          "techStack": [
            "Clojure",
            "ClojureScript",
            "SVG",
            "Docker"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=penpot.app&sz=128"
        },
        {
          "name": "Lunacy",
          "slug": "lunacy",
          "domain": "icons8.com",
          "website": "https://icons8.com/lunacy",
          "github": "https://github.com/icons8/lunacy",
          "stars": "5.1k",
          "license": "Free Proprietary Local",
          "selfHosted": true,
          "description": "Free next-gen vector graphic design software with built-in graphics assets, AI tools (background removal, upscaler, avatar generator), and offline mode.",
          "highlights": [
            "Works completely offline",
            "Built-in icons, photos & illustrations",
            "AI image enhancement tools",
            "Reads and writes Sketch & Figma files"
          ],
          "techStack": [
            "C#",
            ".NET Core",
            "Avalonia"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=icons8.com&sz=128"
        }
      ]
    },
    {
      "id": "canva",
      "slug": "canva",
      "name": "Canva",
      "category": "design-media",
      "categoryName": "Design & Creative Tools",
      "domain": "canva.com",
      "proprietaryUrl": "https://canva.com",
      "logo": "https://www.google.com/s2/favicons?domain=canva.com&sz=128",
      "tagline": "Popular drag-and-drop graphic design and social media creative platform.",
      "description": "Canva puts templates and export features behind paid plans. Explore free, open-source and web-based graphics editors for social media and design creation.",
      "alternatives": [
        {
          "name": "Photopea",
          "slug": "photopea",
          "domain": "photopea.com",
          "website": "https://photopea.com",
          "github": "https://github.com/photopea",
          "stars": "58.4k",
          "license": "Free Web",
          "selfHosted": false,
          "description": "Advanced web-based photo and graphics editor supporting PSD, AI, XD, Sketch, PDF, RAW, and standard web formats with zero installation.",
          "highlights": [
            "Full Photoshop-like toolset in browser",
            "Opens PSD, AI, XD, Sketch files",
            "Runs entirely client-side",
            "Zero installation needed"
          ],
          "techStack": [
            "JavaScript",
            "HTML5 Canvas",
            "WebGL"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=photopea.com&sz=128"
        },
        {
          "name": "Polotno Studio",
          "slug": "polotno-studio",
          "domain": "studio.polotno.com",
          "website": "https://studio.polotno.com",
          "github": "https://github.com/lavrton/polotno-studio",
          "stars": "3.2k",
          "license": "Open Source SDK",
          "selfHosted": true,
          "description": "Free web-based design editor built specifically as an open-source Canva replacement with social media presets, text effects, and image export.",
          "highlights": [
            "Canva-like drag and drop UX",
            "No account or watermark required",
            "Stock photo & vector search",
            "Fast high-res PNG & PDF export"
          ],
          "techStack": [
            "React",
            "Konva.js",
            "TypeScript"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=studio.polotno.com&sz=128"
        },
        {
          "name": "GIMP",
          "slug": "gimp",
          "domain": "gimp.org",
          "website": "https://gimp.org",
          "github": "https://github.com/GNOME/gimp",
          "stars": "5.8k",
          "license": "GPL-3.0",
          "selfHosted": true,
          "description": "The classic open-source image manipulation program for photo retouching, image composition, and creative graphic authoring.",
          "highlights": [
            "Full raster image manipulation",
            "Extensible with Python scripts",
            "Color management & high bit depth",
            "100% Free Forever"
          ],
          "techStack": [
            "C",
            "GTK",
            "GEGL"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=gimp.org&sz=128"
        }
      ]
    },
    {
      "id": "slack",
      "slug": "slack",
      "name": "Slack",
      "category": "communication",
      "categoryName": "Chat & Collaboration",
      "domain": "slack.com",
      "proprietaryUrl": "https://slack.com",
      "logo": "https://www.google.com/s2/favicons?domain=slack.com&sz=128",
      "tagline": "Enterprise team chat, messaging channels, audio huddles, and bot workflows.",
      "description": "Slack stores business communications on external servers and deletes message history on free tiers. Discover self-hosted, encrypted team collaboration platforms.",
      "alternatives": [
        {
          "name": "Mattermost",
          "slug": "mattermost",
          "domain": "mattermost.com",
          "website": "https://mattermost.com",
          "github": "https://github.com/mattermost/mattermost-server",
          "stars": "31.2k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "description": "Open-source, self-hosted Slack alternative for technical and enterprise teams with secure messaging, audio calls, incident response, and Kanban boards.",
          "highlights": [
            "Full Slack UX compatibility & import",
            "Audio calls & screen sharing",
            "Built-in Playbooks & Boards",
            "Self-hosted compliance & security"
          ],
          "techStack": [
            "Go",
            "React",
            "PostgreSQL",
            "Docker"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=mattermost.com&sz=128"
        },
        {
          "name": "Zulip",
          "slug": "zulip",
          "domain": "zulip.com",
          "website": "https://zulip.com",
          "github": "https://github.com/zulip/zulip",
          "stars": "21.6k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "description": "Open-source team chat app that combines the real-time speed of Slack with the organized threading structure of email discussions.",
          "highlights": [
            "Unique stream & topic threading model",
            "Never lose context in busy teams",
            "Markdown formatting & LaTeX math",
            "100% Free Open-Source self-hosted"
          ],
          "techStack": [
            "Python",
            "Django",
            "TypeScript",
            "PostgreSQL"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=zulip.com&sz=128"
        },
        {
          "name": "Element (Matrix)",
          "slug": "element-matrix",
          "domain": "element.io",
          "website": "https://element.io",
          "github": "https://github.com/element-hq/element-web",
          "stars": "12.8k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "description": "Decentralized, end-to-end encrypted secure messaging and collaboration app built on the open Matrix communication standard.",
          "highlights": [
            "End-to-End Encryption (E2EE)",
            "Decentralized federation across servers",
            "Voice & video group calling",
            "Bridges to Slack, Discord & WhatsApp"
          ],
          "techStack": [
            "TypeScript",
            "Matrix Protocol",
            "React"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=element.io&sz=128"
        }
      ]
    },
    {
      "id": "jira",
      "slug": "jira",
      "name": "Jira Software",
      "category": "project-management",
      "categoryName": "Project Management",
      "domain": "atlassian.com",
      "proprietaryUrl": "https://atlassian.com/software/jira",
      "logo": "https://www.google.com/s2/favicons?domain=atlassian.com&sz=128",
      "tagline": "Issue tracking, agile sprint planning, and project management for software teams.",
      "description": "Jira is complex, slow, and expensive for modern engineering teams. Explore lightweight, fast, open-source issue trackers and project management platforms.",
      "alternatives": [
        {
          "name": "Plane",
          "slug": "plane",
          "domain": "plane.so",
          "website": "https://plane.so",
          "github": "https://github.com/makeplane/plane",
          "stars": "34.1k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "description": "Open-source software development project management tool built with a modern Linear-like aesthetic. Manage issues, cycles, modules, and roadmaps.",
          "highlights": [
            "Fast, modern Linear-inspired UI",
            "Issues, Cycles, Modules & Pages",
            "GitHub & Slack synchronizations",
            "Self-hosted with Docker Compose"
          ],
          "techStack": [
            "Next.js",
            "Django",
            "TypeScript",
            "PostgreSQL"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=plane.so&sz=128"
        },
        {
          "name": "Taiga",
          "slug": "taiga",
          "domain": "taiga.io",
          "website": "https://taiga.io",
          "github": "https://github.com/taigaio/taiga-front",
          "stars": "7.8k",
          "license": "MPL-2.0",
          "selfHosted": true,
          "description": "Award-winning open-source project management system for agile developers, designers, and project managers with Scrum and Kanban boards.",
          "highlights": [
            "Scrum & Kanban boards",
            "Custom estimation points & sprints",
            "Clean intuitive interface",
            "Self-hosted Docker deployment"
          ],
          "techStack": [
            "Python",
            "Angular",
            "PostgreSQL"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=taiga.io&sz=128"
        },
        {
          "name": "Leantime",
          "slug": "leantime",
          "domain": "leantime.io",
          "website": "https://leantime.io",
          "github": "https://github.com/Leantime/leantime",
          "stars": "6.9k",
          "license": "GPL-2.0",
          "selfHosted": true,
          "description": "Open-source strategic project management system combining goals, ideas, roadmaps, and tasks tailored for ADHD and cross-functional teams.",
          "highlights": [
            "Goal & strategy alignment",
            "Built-in idea boards & research",
            "Simple milestone tracking",
            "Self-hostable PHP/MySQL stack"
          ],
          "techStack": [
            "PHP",
            "JavaScript",
            "MySQL"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=leantime.io&sz=128"
        }
      ]
    },
    {
      "id": "postman",
      "slug": "postman",
      "name": "Postman",
      "category": "developer-tools",
      "categoryName": "Dev Tools & APIs",
      "domain": "postman.com",
      "proprietaryUrl": "https://postman.com",
      "logo": "https://www.google.com/s2/favicons?domain=postman.com&sz=128",
      "tagline": "API platform for building and using APIs, testing, and team collections.",
      "description": "Postman enforced cloud login and removed offline scratchpads. Discover open-source, local-first API clients that keep collections safely in your Git repositories.",
      "alternatives": [
        {
          "name": "Hoppscotch",
          "slug": "hoppscotch",
          "domain": "hoppscotch.io",
          "website": "https://hoppscotch.io",
          "github": "https://github.com/hoppscotch/hoppscotch",
          "stars": "66.3k",
          "license": "MIT",
          "selfHosted": true,
          "description": "Open-source lightweight, blazing-fast API development ecosystem with REST, GraphQL, WebSocket, SSE, and Socket.IO testing.",
          "highlights": [
            "Blazing fast lightweight web & desktop UI",
            "REST, GraphQL, gRPC & WebSocket support",
            "Self-hostable with single Docker command",
            "Environment variables & test scripts"
          ],
          "techStack": [
            "Vue.js",
            "TypeScript",
            "Nuxt.js"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=hoppscotch.io&sz=128"
        },
        {
          "name": "Bruno",
          "slug": "bruno",
          "domain": "usebruno.com",
          "website": "https://usebruno.com",
          "github": "https://github.com/usebruno/bruno",
          "stars": "31.8k",
          "license": "MIT",
          "selfHosted": true,
          "description": "Fast, Git-friendly open-source API client that stores collections directly in plain text Bru markup files in your codebase folder.",
          "highlights": [
            "Stores collections in your Git repository",
            "100% offline & local-first",
            "No cloud sync or forced account login",
            "Scripting with npm packages"
          ],
          "techStack": [
            "TypeScript",
            "Electron",
            "React"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=usebruno.com&sz=128"
        },
        {
          "name": "Yaak",
          "slug": "yaak",
          "domain": "yaak.app",
          "website": "https://yaak.app",
          "github": "https://github.com/mountain-loop/yaak",
          "stars": "5.4k",
          "license": "MIT",
          "selfHosted": true,
          "description": "Extremely fast desktop REST, GraphQL, and gRPC client built in Rust and Tauri with native OS performance and offline storage.",
          "highlights": [
            "Built with Rust & Tauri (lightweight memory)",
            "Fast native macOS, Windows, Linux apps",
            "gRPC, REST & GraphQL in one tool",
            "Local SQLite storage"
          ],
          "techStack": [
            "Rust",
            "Tauri",
            "React"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=yaak.app&sz=128"
        }
      ]
    },
    {
      "id": "1password",
      "slug": "1password",
      "name": "1Password",
      "category": "security-cloud",
      "categoryName": "Security & Cloud Storage",
      "domain": "1password.com",
      "proprietaryUrl": "https://1password.com",
      "logo": "https://www.google.com/s2/favicons?domain=1password.com&sz=128",
      "tagline": "Proprietary subscription password manager for individuals and enterprise teams.",
      "description": "1Password requires a monthly subscription and stores passwords in proprietary cloud vaults. Discover open-source, audited password managers with zero-knowledge encryption.",
      "alternatives": [
        {
          "name": "Bitwarden / Vaultwarden",
          "slug": "bitwarden",
          "domain": "bitwarden.com",
          "website": "https://bitwarden.com",
          "github": "https://github.com/bitwarden/server",
          "stars": "36.2k",
          "license": "GPL-3.0",
          "selfHosted": true,
          "description": "The gold standard open-source password manager. Secure, end-to-end encrypted password storage with desktop, mobile, browser, and CLI apps.",
          "highlights": [
            "Audited zero-knowledge encryption",
            "Lightweight self-hosting via Vaultwarden (Rust)",
            "Autofill on iOS, Android, and all browsers",
            "Passkey support & 2FA authenticator"
          ],
          "techStack": [
            "C#",
            "Rust",
            "TypeScript",
            "Docker"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=bitwarden.com&sz=128"
        },
        {
          "name": "KeePassXC",
          "slug": "keepassxc",
          "domain": "keepassxc.org",
          "website": "https://keepassxc.org",
          "github": "https://github.com/keepassxreboot/keepassxc",
          "stars": "22.5k",
          "license": "GPL-2.0 / GPL-3.0",
          "selfHosted": true,
          "description": "Community-driven, cross-platform password manager that stores passwords in standard encrypted .kdbx files stored entirely locally.",
          "highlights": [
            "100% offline & local file storage",
            "Hardware key support (YubiKey)",
            "Auto-type & browser integration",
            "No servers or cloud dependencies"
          ],
          "techStack": [
            "C++",
            "Qt5",
            "Argon2"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=keepassxc.org&sz=128"
        },
        {
          "name": "Passbolt",
          "slug": "passbolt",
          "domain": "passbolt.com",
          "website": "https://passbolt.com",
          "github": "https://github.com/passbolt/passbolt_api",
          "stars": "4.8k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "description": "Open-source, privacy-first password manager specifically built for engineering and business teams with OpenPGP encryption and audit logs.",
          "highlights": [
            "OpenPGP standard encryption",
            "Granular team sharing permissions",
            "REST API & CLI tool",
            "Self-hosted Docker deployment"
          ],
          "techStack": [
            "PHP",
            "OpenPGP",
            "MySQL"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=passbolt.com&sz=128"
        }
      ]
    },
    {
      "id": "google-drive",
      "slug": "google-drive",
      "name": "Google Drive",
      "category": "security-cloud",
      "categoryName": "Security & Cloud Storage",
      "domain": "google.com/drive",
      "proprietaryUrl": "https://google.com/drive",
      "logo": "https://www.google.com/s2/favicons?domain=google.com/drive&sz=128",
      "tagline": "Cloud file storage, document backup, and Google Workspace integration.",
      "description": "Google Drive scans user files and monetizes user data. Discover self-hosted private cloud storage platforms that turn your own servers or home NAS into private cloud storage.",
      "alternatives": [
        {
          "name": "Nextcloud",
          "slug": "nextcloud",
          "domain": "nextcloud.com",
          "website": "https://nextcloud.com",
          "github": "https://github.com/nextcloud/server",
          "stars": "28.5k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "description": "The most widely deployed self-hosted productivity and cloud storage platform. Full file sync, office document editing, calendar, and video calls.",
          "highlights": [
            "100% Data privacy on your own server",
            "Collabora Online / OnlyOffice integration",
            "End-to-end encryption support",
            "Desktop & mobile automatic camera upload"
          ],
          "techStack": [
            "PHP",
            "Vue.js",
            "MySQL / PostgreSQL",
            "Docker"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=nextcloud.com&sz=128"
        },
        {
          "name": "Syncthing",
          "slug": "syncthing",
          "domain": "syncthing.net",
          "website": "https://syncthing.net",
          "github": "https://github.com/syncthing/syncthing",
          "stars": "66.4k",
          "license": "MPL-2.0",
          "selfHosted": true,
          "description": "Continuous peer-to-peer file synchronization program that syncs files directly between your devices without storing data on any centralized cloud.",
          "highlights": [
            "Peer-to-peer decentralized sync",
            "TLS encrypted device-to-device transfers",
            "No storage capacity limits",
            "Runs on Mac, Windows, Linux, Android, NAS"
          ],
          "techStack": [
            "Go",
            "Block Exchange Protocol",
            "Web UI"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=syncthing.net&sz=128"
        },
        {
          "name": "Seafile",
          "slug": "seafile",
          "domain": "seafile.com",
          "website": "https://seafile.com",
          "github": "https://github.com/haiwen/seafile",
          "stars": "13.2k",
          "license": "GPL-2.0",
          "selfHosted": true,
          "description": "High-performance self-hosted file sync and share solution with client-side encryption and Git-like block-level deduplication.",
          "highlights": [
            "Blazing-fast C core sync engine",
            "Block-level delta sync",
            "Client-side library encryption",
            "Drive mapping for desktop"
          ],
          "techStack": [
            "C",
            "Python",
            "Django",
            "MySQL"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=seafile.com&sz=128"
        }
      ]
    },
    {
      "id": "loom",
      "slug": "loom",
      "name": "Loom",
      "category": "design-media",
      "categoryName": "Design & Creative Tools",
      "domain": "loom.com",
      "proprietaryUrl": "https://loom.com",
      "logo": "https://www.google.com/s2/favicons?domain=loom.com&sz=128",
      "tagline": "Asynchronous video messaging and screen recording platform.",
      "description": "Loom caps recordings on free plans and locks videos behind subscriptions. Discover open-source screen recording tools with instant link sharing and self-hosted storage.",
      "alternatives": [
        {
          "name": "Cap",
          "slug": "cap",
          "domain": "cap.so",
          "website": "https://cap.so",
          "github": "https://github.com/CapSoftware/Cap",
          "stars": "8.9k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "description": "Open-source Loom alternative with instant link sharing, camera bubble recording, and S3-compatible self-hosted video storage.",
          "highlights": [
            "Camera bubble + screen recording",
            "Instant shareable links",
            "Uploads directly to your own S3/R2 bucket",
            "Lightweight native desktop app"
          ],
          "techStack": [
            "Rust",
            "Tauri",
            "Next.js",
            "TypeScript"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=cap.so&sz=128"
        },
        {
          "name": "Screenity",
          "slug": "screenity",
          "domain": "screenity.io",
          "website": "https://screenity.io",
          "github": "https://github.com/alyssaxuu/screenity",
          "stars": "11.2k",
          "license": "GPL-3.0",
          "selfHosted": true,
          "description": "The free and open-source screen recorder extension for Chrome. Annotate screens, blur sensitive data, and export to MP4/GIF.",
          "highlights": [
            "Free with zero watermarks or limits",
            "On-screen drawing annotations",
            "Blur sensitive areas on screen",
            "Export to MP4, WebM, or GIF"
          ],
          "techStack": [
            "JavaScript",
            "WebRTC",
            "Browser Extension"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=screenity.io&sz=128"
        },
        {
          "name": "OBS Studio",
          "slug": "obs-studio",
          "domain": "obsproject.com",
          "website": "https://obsproject.com",
          "github": "https://github.com/obsproject/obs-studio",
          "stars": "61.5k",
          "license": "GPL-2.0",
          "selfHosted": true,
          "description": "Industry-standard open-source video recording and live streaming software with scene compositing, audio mixing, and GPU encoding.",
          "highlights": [
            "Professional multi-source compositing",
            "Hardware accelerated NVENC/AMD encoding",
            "Massive plugin ecosystem",
            "100% Free Open-Source forever"
          ],
          "techStack": [
            "C",
            "C++",
            "FFmpeg",
            "Qt"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=obsproject.com&sz=128"
        }
      ]
    },
    {
      "id": "google-analytics",
      "slug": "google-analytics",
      "name": "Google Analytics (GA4)",
      "category": "analytics-marketing",
      "categoryName": "Analytics & Marketing",
      "domain": "analytics.google.com",
      "proprietaryUrl": "https://analytics.google.com",
      "logo": "https://www.google.com/s2/favicons?domain=analytics.google.com&sz=128",
      "tagline": "Proprietary web and mobile app tracking with complex GA4 reports.",
      "description": "Google Analytics tracks personal user data and requires cookie consent banners under GDPR. Discover lightweight, privacy-focused open-source analytics.",
      "alternatives": [
        {
          "name": "Plausible Analytics",
          "slug": "plausible-analytics",
          "domain": "plausible.io",
          "website": "https://plausible.io",
          "github": "https://github.com/plausible/analytics",
          "stars": "20.1k",
          "license": "AGPL-3.0",
          "selfHosted": true,
          "description": "Simple, lightweight (<1 KB script), and privacy-friendly Google Analytics alternative. Fully compliant with GDPR, CCPA, and PECR with no cookies required.",
          "highlights": [
            "<1 KB lightweight tracking script",
            "Zero cookies & 100% GDPR compliant",
            "Clean single-page dashboard",
            "Self-hosted with Docker & ClickHouse"
          ],
          "techStack": [
            "Elixir",
            "Phoenix",
            "ClickHouse",
            "PostgreSQL"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=plausible.io&sz=128"
        },
        {
          "name": "Umami",
          "slug": "umami",
          "domain": "umami.is",
          "website": "https://umami.is",
          "github": "https://github.com/umami-software/umami",
          "stars": "24.8k",
          "license": "MIT",
          "selfHosted": true,
          "description": "Open-source, self-hosted web analytics alternative to Google Analytics built with Node.js and Next.js that respects visitor privacy.",
          "highlights": [
            "100% MIT Licensed",
            "Track custom events & pageviews",
            "Supports PostgreSQL & MySQL",
            "Clean modern UI"
          ],
          "techStack": [
            "Next.js",
            "Prisma",
            "PostgreSQL / MySQL"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=umami.is&sz=128"
        },
        {
          "name": "PostHog",
          "slug": "posthog",
          "domain": "posthog.com",
          "website": "https://posthog.com",
          "github": "https://github.com/PostHog/posthog",
          "stars": "24.3k",
          "license": "MIT / Open-Source",
          "selfHosted": true,
          "description": "The complete open-source product analytics suite: product analytics, session replays, feature flags, A/B testing, and user surveys in one platform.",
          "highlights": [
            "Product analytics & funnels",
            "Session replays with privacy masking",
            "Feature flags & A/B testing",
            "Self-hostable enterprise analytics"
          ],
          "techStack": [
            "Python",
            "Django",
            "TypeScript",
            "ClickHouse",
            "React"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=posthog.com&sz=128"
        }
      ]
    },
    {
      "id": "vercel",
      "slug": "vercel",
      "name": "Vercel / Netlify",
      "category": "developer-tools",
      "categoryName": "Dev Tools & APIs",
      "domain": "vercel.com",
      "proprietaryUrl": "https://vercel.com",
      "logo": "https://www.google.com/s2/favicons?domain=vercel.com&sz=128",
      "tagline": "Cloud deployment platform for frontend web apps and serverless functions.",
      "description": "Vercel bandwidth and serverless function limits trigger surprising bills. Discover self-hosted PaaS solutions that turn any $5/month VPS into your own private Vercel.",
      "alternatives": [
        {
          "name": "Coolify",
          "slug": "coolify",
          "domain": "coolify.io",
          "website": "https://coolify.io",
          "github": "https://github.com/coollabsio/coolify",
          "stars": "38.2k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "description": "An open-source, self-hostable Heroku & Vercel alternative. Deploy apps, databases, and services to your own server via Git with automated SSL certificates.",
          "highlights": [
            "Auto-deploy on git push",
            "Free automatic SSL certificates",
            "1-click deploy databases (Postgres, Redis, Mongo)",
            "Deploy to any Linux server or VPS"
          ],
          "techStack": [
            "PHP",
            "Laravel",
            "Docker",
            "Tailwind CSS"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=coolify.io&sz=128"
        },
        {
          "name": "Dokku",
          "slug": "dokku",
          "domain": "dokku.com",
          "website": "https://dokku.com",
          "github": "https://github.com/dokku/dokku",
          "stars": "26.4k",
          "license": "MIT",
          "selfHosted": true,
          "description": "The smallest PaaS implementation you've ever seen. Push code with `git push dokku main` and let Docker build and run your web apps automatically.",
          "highlights": [
            "Simple git push deployment",
            "Heroku buildpack & Dockerfile support",
            "Zero-downtime deployments",
            "Extensible plugin architecture"
          ],
          "techStack": [
            "Go",
            "Bash",
            "Docker"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=dokku.com&sz=128"
        },
        {
          "name": "CapRover",
          "slug": "caprover",
          "domain": "caprover.com",
          "website": "https://caprover.com",
          "github": "https://github.com/caprover/caprover",
          "stars": "14.1k",
          "license": "Apache 2.0",
          "selfHosted": true,
          "description": "Extremely easy-to-use self-hosted PaaS for NodeJS, Python, PHP, Ruby, Go, and Java applications with built-in Let's Encrypt SSL.",
          "highlights": [
            "Visual web dashboard",
            "1-click app store (WordPress, Nextcloud, etc.)",
            "Docker Swarm clustering support",
            "Free SSL in one click"
          ],
          "techStack": [
            "TypeScript",
            "Node.js",
            "Docker Swarm"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=caprover.com&sz=128"
        }
      ]
    },
    {
      "id": "supabase-firebase",
      "slug": "supabase-firebase",
      "name": "Firebase / Supabase",
      "category": "database-spreadsheets",
      "categoryName": "Databases & Spreadsheets",
      "domain": "firebase.google.com",
      "proprietaryUrl": "https://firebase.google.com",
      "logo": "https://www.google.com/s2/favicons?domain=firebase.google.com&sz=128",
      "tagline": "Backend-as-a-Service providing authentication, real-time database, and storage.",
      "description": "Firebase locks developers into proprietary Google infrastructure. Discover self-hosted, lightweight backend suites with realtime data and authentication.",
      "alternatives": [
        {
          "name": "PocketBase",
          "slug": "pocketbase",
          "domain": "pocketbase.io",
          "website": "https://pocketbase.io",
          "github": "https://github.com/pocketbase/pocketbase",
          "stars": "44.2k",
          "license": "MIT",
          "selfHosted": true,
          "description": "Open-source backend in 1 single executable file. Embedded SQLite database with realtime subscriptions, built-in auth, and file storage.",
          "highlights": [
            "Single lightweight binary (<20MB)",
            "Realtime database subscriptions",
            "OAuth2 & Email authentication",
            "Admin dashboard included"
          ],
          "techStack": [
            "Go",
            "SQLite",
            "Svelte"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=pocketbase.io&sz=128"
        },
        {
          "name": "Appwrite",
          "slug": "appwrite",
          "domain": "appwrite.io",
          "website": "https://appwrite.io",
          "github": "https://github.com/appwrite/appwrite",
          "stars": "45.8k",
          "license": "BSD-3-Clause",
          "selfHosted": true,
          "description": "Complete end-to-end backend server for web, mobile, and flutter developers packaged as a set of Docker microservices.",
          "highlights": [
            "Auth, Databases, Storage & Functions",
            "SDKs for React, Flutter, iOS, Android",
            "Webhooks & background workers",
            "Self-hosted with Docker"
          ],
          "techStack": [
            "PHP",
            "TypeScript",
            "Redis",
            "MariaDB / PostgreSQL"
          ],
          "logo": "https://www.google.com/s2/favicons?domain=appwrite.io&sz=128"
        }
      ]
    }
  ]
};
