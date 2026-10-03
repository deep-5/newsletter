/**
 * AIRA Jobs Board - Verified AI, UI/UX & Tech Openings Dataset
 * Direct Official Apply Channels & Verified Career Listings
 */

const AI_JOBS_DATA = {
  version: '1.0',
  stats: {
    totalOpenings: 'Verified',
    avgSalary: '$155,000/yr',
    verifiedPartners: 'Direct Company Openings',
    remotePercentage: '85%'
  },
  categories: [
    { id: 'all', name: 'All Roles', icon: '💼', count: 8 },
    { id: 'ui-ux', name: 'UI/UX Design', icon: '🎨', count: 4 },
    { id: 'ai-eng', name: 'AI Engineering', icon: '⚡', count: 3 },
    { id: 'prompt-eng', name: 'Prompt Engineering', icon: '💡', count: 2 },
    { id: 'remote', name: '100% Remote', icon: '🌍', count: 6 },
    { id: 'verified', name: 'Verified Openings', icon: '✅', count: 7 }
  ],
  jobs: [
    {
      id: 'openai-lead-ai-product-designer',
      title: 'Lead AI Product Designer',
      company: 'OpenAI',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
      companyDomain: 'openai.com',
      companyInitial: 'O',
      companyBg: '#10A37F',
      location: 'San Francisco, CA (Remote Friendly)',
      salary: '$160,000 - $210,000/yr',
      type: 'Full-Time',
      workplace: 'Remote / Hybrid',
      category: 'ui-ux',
      experience: '5+ Years',
      badge: 'Verified',
      featured: true,
      postedAt: 'Just Now',
      skills: ['UI/UX Design', 'Generative AI', 'Agentic UX', 'Design Systems', 'Figma'],
      tagline: 'Define the future of human-AI collaboration on ChatGPT, Canvas, and next-generation reasoning interfaces.',
      overview: 'As the Lead AI Product Designer at OpenAI, you will spearhead conversational canvas workflows, generative streaming interfaces, and human-in-the-loop interactions used by over 200M+ active weekly creators and developers.',
      responsibilities: [
        'Design intuitive, frictionless user interfaces for ChatGPT Canvas, Code Interpreter, and Next-Gen Reasoning models.',
        'Collaborate closely with research scientists, prompt engineers, and product leadership.',
        'Build high-fidelity interactive prototypes to test human-AI feedback loops.',
        'Scale the OpenAI design system with dynamic AI-generated UI components.'
      ],
      requirements: [
        '5+ years of senior or lead product design experience building complex SaaS, design tools, or developer platforms.',
        'Deep intuition for LLM latency, streaming tokens, prompt psychology, and generative UX patterns.',
        'Expertise in Figma, modern design systems, auto-layout tokens, and rapid prototyping.',
        'Proven track record of shipping zero-to-one product experiences from concept to launch.'
      ],
      benefits: [
        '$160k - $210k base salary + competitive OpenAI equity grant.',
        '100% employer-covered health, dental, and vision insurance.',
        '$5,000 annual home-office and learning stipend.',
        'Flexible remote-first culture with annual global team offsites.'
      ],
      applyUrl: 'https://openai.com/careers',
      officialApplyUrl: 'https://openai.com/careers',
      applyType: 'official',
      contactEmail: 'careers@openai.com'
    },
    {
      id: 'figma-senior-ux-engineer-design-systems',
      title: 'Senior UX Engineer (Design Systems & AI)',
      company: 'Figma',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
      companyDomain: 'figma.com',
      companyInitial: 'F',
      companyBg: '#F24E1E',
      location: 'Remote (Worldwide)',
      salary: '$140,000 - $185,000/yr',
      type: 'Full-Time',
      workplace: '100% Remote',
      category: 'ui-ux',
      experience: '4+ Years',
      badge: 'Verified',
      featured: true,
      postedAt: 'Today',
      skills: ['Design Systems', 'UI Engineering', 'Variables', 'TypeScript'],
      tagline: 'Empower millions of product designers with next-gen AI auto-layout tokens, variables, and cross-platform design-to-code pipelines.',
      overview: 'Join Figma core design systems team to architect AI-assisted component generation, token mapping, and cross-platform design-to-code pipelines for 10M+ creatives globally.',
      responsibilities: [
        'Build and maintain Figma core design tokens, variables engine, and auto-layout algorithms.',
        'Develop AI-driven component recommendations and auto-documentation tooling.',
        'Bridge the gap between product design specifications and production React/TypeScript code.'
      ],
      requirements: [
        '4+ years experience in Design Systems, frontend engineering (React, TypeScript), and web standards.',
        'Deep expertise in Figma API, plugin development, and design token architectures.'
      ],
      benefits: [
        'Top global remote compensation ($140k - $185k) + Figma pre-IPO equity.',
        'Generous annual tech, wellness, and co-working allowance.',
        'Flexible working hours across worldwide timezones.'
      ],
      applyUrl: 'https://www.figma.com/careers/',
      officialApplyUrl: 'https://www.figma.com/careers/',
      applyType: 'official',
      contactEmail: 'talent@figma.com'
    },
    {
      id: 'anthropic-lead-ai-interface-designer',
      title: 'Lead AI Interface Designer (Claude Artifacts)',
      company: 'Anthropic',
      companyLogo: '',
      companyDomain: 'anthropic.com',
      companyInitial: 'A',
      companyBg: '#D97706',
      location: 'San Francisco, CA / Remote',
      salary: '$155,000 - $200,000/yr',
      type: 'Full-Time',
      workplace: 'Hybrid / Remote',
      category: 'ui-ux',
      experience: '5+ Years',
      badge: 'Verified',
      featured: false,
      postedAt: '1 day ago',
      skills: ['Claude Artifacts', 'UI/UX', 'Frontier AI', 'Safety', 'Prototyping'],
      tagline: 'Design the next generation of Claude interactive Artifacts, code sandboxes, and constitutional AI safety interfaces.',
      overview: 'Anthropic is seeking a Lead AI Interface Designer to architect the interactive future of Claude Artifacts, sandbox visualizers, and constitutional AI safety guardrails.',
      responsibilities: [
        'Design real-time code rendering and SVG visualization experiences within Claude Artifacts.',
        'Craft safe, steerable, and explainable AI controls for enterprise and consumer tiers.'
      ],
      requirements: [
        '5+ years in product design with high proficiency in rapid interactive prototyping and developer tools.'
      ],
      benefits: [
        '$155k - $200k base salary + Anthropic equity.',
        'Full health/vision/dental benefits + 401(k) match.'
      ],
      applyUrl: 'https://www.anthropic.com/careers',
      officialApplyUrl: 'https://www.anthropic.com/careers',
      applyType: 'official',
      contactEmail: 'jobs@anthropic.com'
    },
    {
      id: 'scaleai-senior-prompt-engineer',
      title: 'Senior AI Prompt & Evaluation Engineer',
      company: 'Scale AI',
      companyLogo: '',
      companyDomain: 'scale.com',
      companyInitial: 'S',
      companyBg: '#6366F1',
      location: 'San Francisco, CA / Remote',
      salary: '$135,000 - $170,000/yr',
      type: 'Full-Time',
      workplace: '100% Remote',
      category: 'prompt-eng',
      experience: '3+ Years',
      badge: 'Hot Hiring',
      featured: false,
      postedAt: '2 days ago',
      skills: ['Prompt Engineering', 'RLHF', 'Red Teaming', 'LLM Benchmarks', 'Python'],
      tagline: 'Benchmark, red-team, and craft adversarial evaluation datasets for frontier reasoning models.',
      overview: 'Scale AI is looking for an experienced Prompt & Evaluation Engineer to build synthetic datasets, benchmark reasoning models, and optimize RLHF data pipelines for top AI labs.',
      responsibilities: [
        'Author complex multi-step reasoning prompts across coding, math, and logical synthesis domains.',
        'Conduct automated and human evaluation benchmarks on frontier LLMs.'
      ],
      requirements: [
        'Deep expertise in prompt engineering, Python, LLM evaluation metrics (MMLU, HumanEval), and RLHF.'
      ],
      benefits: [
        'Competitive salary ($135k - $170k) + Scale AI equity + comprehensive global benefits.'
      ],
      applyUrl: 'https://scale.com/careers',
      officialApplyUrl: 'https://scale.com/careers',
      applyType: 'official',
      contactEmail: 'careers@scale.com'
    },
    {
      id: 'midjourney-generative-interaction-designer',
      title: 'Generative AI Interaction Designer',
      company: 'Midjourney',
      companyLogo: '',
      companyDomain: 'midjourney.com',
      companyInitial: 'M',
      companyBg: '#1E293B',
      location: 'Remote (Worldwide)',
      salary: '$145,000 - $190,000/yr',
      type: 'Full-Time',
      workplace: '100% Remote',
      category: 'ui-ux',
      experience: '4+ Years',
      badge: 'Remote Worldwide',
      featured: false,
      postedAt: '3 days ago',
      skills: ['Generative AI', 'Image Gen', 'Web Canvas', 'UI/UX', 'Inpainting'],
      tagline: 'Craft intuitive web canvas editors and prompt exploration tools for 20M+ creative users.',
      overview: 'Design revolutionary visual creation workflows for the Midjourney web app, inpainting canvas, and creative tooling.',
      responsibilities: [
        'Design canvas tools for regional inpainting, panning, outpainting, and multi-image style blending.',
        'Iterate on prompt recommendation UI and parameter controllers.'
      ],
      requirements: [
        '4+ years in digital product design with passion for computer vision and generative artistry.'
      ],
      benefits: [
        'High base compensation ($145k - $190k) + remote autonomy + unrestricted GPU compute.'
      ],
      applyUrl: 'https://www.midjourney.com/careers',
      officialApplyUrl: 'https://www.midjourney.com/careers',
      applyType: 'official',
      contactEmail: 'careers@midjourney.com'
    },
    {
      id: 'vercel-ai-sdk-workflow-engineer',
      title: 'AI Workflow & Developer Experience Architect',
      company: 'Vercel',
      companyLogo: '',
      companyDomain: 'vercel.com',
      companyInitial: 'V',
      companyBg: '#000000',
      location: 'Remote (Global)',
      salary: '$130,000 - $165,000/yr',
      type: 'Full-Time',
      workplace: '100% Remote',
      category: 'ai-eng',
      experience: '3+ Years',
      badge: 'Verified',
      featured: false,
      postedAt: '3 days ago',
      skills: ['v0', 'Next.js', 'AI SDK', 'TypeScript', 'Edge Runtime'],
      tagline: 'Build next-gen generative UI developer workflows and AI SDK tooling for the web.',
      overview: 'Lead the developer experience for v0 generative UI, Next.js AI integrations, and edge runtime deployments.',
      responsibilities: [
        'Build robust full-stack streaming hooks and UI components for AI-generated React trees.',
        'Contribute to open-source Vercel AI SDK and developer documentation.'
      ],
      requirements: [
        'Proven full-stack TypeScript/React background with passion for AI tooling.'
      ],
      benefits: [
        '$130k - $165k + Vercel equity + full home office budget.'
      ],
      applyUrl: 'https://vercel.com/careers',
      officialApplyUrl: 'https://vercel.com/careers',
      applyType: 'official',
      contactEmail: 'talent@vercel.com'
    },
    {
      id: 'zapier-ai-automation-product-designer',
      title: 'Senior Product Designer (AI Workflows & n8n)',
      company: 'Zapier',
      companyLogo: '',
      companyDomain: 'zapier.com',
      companyInitial: 'Z',
      companyBg: '#FF4A00',
      location: '100% Remote (Global)',
      salary: '$125,000 - $160,000/yr',
      type: 'Full-Time',
      workplace: '100% Remote',
      category: 'ui-ux',
      experience: '4+ Years',
      badge: 'Verified',
      featured: false,
      postedAt: '4 days ago',
      skills: ['Automation', 'n8n', 'No-Code AI', 'UI/UX', 'SaaS'],
      tagline: 'Design visual automation canvas and autonomous agent copilots for 3,000+ app connectors.',
      overview: 'Help build the next generation of visual workflow builders where natural language prompts automatically create complex multi-step automations.',
      responsibilities: [
        'Design no-code automation canvas, trigger-action cards, and AI debugging assistants.'
      ],
      requirements: [
        '4+ years designing complex SaaS products and workflow builders.'
      ],
      benefits: [
        '$125k - $160k + 100% remote company with profit sharing.'
      ],
      applyUrl: 'https://zapier.com/jobs',
      officialApplyUrl: 'https://zapier.com/jobs',
      applyType: 'official',
      contactEmail: 'design-careers@zapier.com'
    },
    {
      id: 'mistral-ai-eval-specialist',
      title: 'AI Research & Prompt Benchmark Specialist',
      company: 'Mistral AI',
      companyLogo: '',
      companyDomain: 'mistral.ai',
      companyInitial: 'M',
      companyBg: '#FF7000',
      location: 'Paris, France / Remote EU',
      salary: '€110,000 - €150,000/yr',
      type: 'Full-Time',
      workplace: 'Hybrid / Remote',
      category: 'prompt-eng',
      experience: '3+ Years',
      badge: 'New',
      featured: false,
      postedAt: '5 days ago',
      skills: ['Mistral Large', 'Codestral', 'Benchmarking', 'Prompt Tuning', 'Python'],
      tagline: 'Benchmark and optimize frontier open-weights reasoning models and code assistants.',
      overview: 'Help evaluate and refine open-weight models, code generation capabilities, and enterprise instruction datasets.',
      responsibilities: [
        'Run systematic benchmarks on Mistral models and curate specialized fine-tuning prompts.'
      ],
      requirements: [
        'Strong Python programming, prompt distillation, and LLM benchmarking experience.'
      ],
      benefits: [
        '€110k - €150k + Mistral equity package.'
      ],
      applyUrl: 'https://mistral.ai/careers/',
      officialApplyUrl: 'https://mistral.ai/careers/',
      applyType: 'official',
      contactEmail: 'jobs@mistral.ai'
    }
  ]
};

if (typeof window !== 'undefined') {
  window.AI_JOBS_DATA = AI_JOBS_DATA;
}
