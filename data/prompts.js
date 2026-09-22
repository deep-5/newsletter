/**
 * 100+ Agentic Coding Prompts from Anthropic, OpenAI, and Cursor
 * Exact authentic data from https://agentic-coding-prompts.netlify.app/
 */

window.PROMPT_SOURCES = {
  "cc-workflows": {
    "short": "Common Workflows",
    "label": "Claude Code docs — Common workflows",
    "publisher": "Anthropic",
    "url": "https://code.claude.com/docs/en/common-workflows"
  },
  "cc-best-practices": {
    "short": "Best Practices",
    "label": "Claude Code docs — Best practices",
    "publisher": "Anthropic",
    "url": "https://code.claude.com/docs/en/best-practices"
  },
  "cx-prompting": {
    "short": "Prompting",
    "label": "Codex docs — Prompting",
    "publisher": "OpenAI",
    "url": "https://learn.chatgpt.com/docs/prompting"
  },
  "cx-agents-md": {
    "short": "AGENTS.md",
    "label": "Codex docs — Custom instructions with AGENTS.md",
    "publisher": "OpenAI",
    "url": "https://learn.chatgpt.com/docs/agent-configuration/agents-md"
  },
  "cu-rules": {
    "short": "Rules",
    "label": "Cursor docs — Rules",
    "publisher": "Cursor",
    "url": "https://cursor.com/docs/rules"
  },
  "cu-best-practices": {
    "short": "Agent Best Practices",
    "label": "Cursor blog — Best practices for coding with agents",
    "publisher": "Cursor",
    "url": "https://cursor.com/blog/agent-best-practices"
  }
};

window.ALL_PROMPTS = [
  {
    "id": "cc-overview",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "onboarding",
    "section": "Get a quick codebase overview",
    "title": "Get a high-level overview",
    "prompt": "give me an overview of this codebase",
    "template": "I'm new to this codebase. Give me an overview before I start work.\n\nCover:\n- What this project does, in two sentences\n- The main entry points, and how a request or command flows through them\n- The directory layout, and what belongs in each top-level folder\n- The key data models and where they're defined\n- Which conventions are enforced (linting, typing, test style) and where they're configured\n\nRead the README, the package manifests and the config files first. Where the code contradicts the README, say so. That's usually where the real conventions live.\n\nDon't change any files.",
    "why": "Asking for the overview in one line gets you a README paraphrase. Naming what you want covered gets you the parts the README leaves out.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-architecture",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "onboarding",
    "section": "Get a quick codebase overview",
    "title": "Ask about architecture patterns",
    "prompt": "explain the main architecture patterns used here",
    "template": "Explain the main architecture patterns used in this codebase.\n\nFor each pattern:\n- Name it, and point at two or three files where it's actually used\n- Say what problem it solves here specifically\n- Say whether it's applied consistently, or only in some parts, and if so which\n\nAlso cover:\n- How the layers are separated, and what's allowed to depend on what\n- Where the patterns break down, and whether that looks deliberate or accidental\n\nRead the code, not just the README or the folder names. If two parts of the codebase use conflicting approaches, tell me which one is newer.\n\nIf this codebase is small or plain enough that it has no real patterns to speak of, say so and describe how it's actually organised. Don't name patterns that aren't there.\n\nRead only. Don't change anything.",
    "why": "Asking which patterns are actually followed, rather than which are present, is what separates the real architecture from the one someone intended.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-data-models",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "onboarding",
    "section": "Get a quick codebase overview",
    "title": "Ask about data models",
    "prompt": "what are the key data models?",
    "template": "What are the key data models in this codebase?\n\nFor each one:\n- Where it's defined, and where it's persisted\n- The fields that matter, and which are required\n- Its relationships to the other models, and the direction of those relationships\n- Any invariant the code assumes but doesn't enforce in the type or the schema\n\nThen give me the handful of models I'd need to understand before touching <the billing flow>, in the order I should read them.\n\nIf the same concept is modelled twice in different layers, say so and show me both.\n\nIf this codebase has no real data models, say so and tell me where it holds state instead. Don't promote incidental objects to models to fill the answer out.\n\nRead only, don't edit.",
    "why": "The relationships and the invariants are the parts you can't reconstruct from reading a schema file on your own.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-auth-handled",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "onboarding",
    "section": "Get a quick codebase overview",
    "title": "Ask how authentication works",
    "prompt": "how is authentication handled?",
    "template": "How is authentication handled in this codebase?\n\nCover:\n- The mechanism, sessions or JWTs or OAuth or something else, and which library provides it\n- Where a request is authenticated, and where it's authorised, they're often different places\n- How credentials and secrets are stored and read\n- How sessions or tokens expire, and how they're refreshed\n- Which routes or handlers are exempt, and why\n\nName the file and function for each point. Don't summarise from middleware names, read what they do.\n\nFlag anything that looks like an auth check that can be bypassed, or a route that's unprotected by omission rather than by intent.\n\nIf this codebase has no authentication at all, say so and stop. Don't describe what it would look like if it had some.\n\nRead only. Don't change anything.",
    "why": "Authentication answers are only trustworthy when the agent has been told to name where the checks live rather than describe the intent.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-find-files",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "search",
    "section": "Find relevant code",
    "title": "Locate the files behind a feature",
    "prompt": "find the files that handle user authentication",
    "template": "Find the files that handle <user authentication>.\n\nFor each file, give me:\n- The path\n- One line on its role in <authentication>\n- Whether it's core to the flow or peripheral\n\nThen tell me:\n- Which file is the entry point, the one I should read first\n- Where the tests for this live, or that there aren't any\n- Anything named as if it's part of this but isn't, or is dead\n\nSearch by behaviour, not just filename. Grep for the relevant calls and imports rather than trusting the directory layout.\n\nIf nothing here handles <user authentication>, say so and stop rather than offering me the nearest thing you found.\n\nRead only. Don't explain the whole flow yet, I'll ask for that next.",
    "why": "Asking for the entry point and the tests alongside the files gives you somewhere to start reading instead of a flat list.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "find-code",
    "step": 1
  },
  {
    "id": "cc-files-interact",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "search",
    "section": "Find relevant code",
    "title": "Ask how components interact",
    "prompt": "how do these authentication files work together?",
    "template": "Now explain how the <authentication> files you just listed work together.\n\nWalk me through:\n- Which file calls which, and in what order, for <a normal login>\n- What state is shared between them, and where it lives\n- Where the boundaries are: what each file owns and what it delegates\n- Which of them I'd have to change together, and which are safe to change alone\n\nUse the file paths from your list, not generic names.\n\nFinish with the two or three coupling points that would surprise someone changing this for the first time.\n\nRead only. Where the wiring is dynamic and you can't follow it statically, say so instead of guessing.\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself.",
    "why": "This is the follow-up that turns a file list into a mental model, so it should name the files you just found rather than restate the search.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "find-code",
    "step": 2
  },
  {
    "id": "cc-trace-flow",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "search",
    "section": "Find relevant code",
    "title": "Trace an execution flow end to end",
    "prompt": "trace the login process from front-end to database",
    "template": "Trace <the login process> end to end, from <the front-end entry point> through to <the database>.\n\nFor each hop, tell me:\n- The file and function that handles it\n- What it receives, and what it passes on\n- Where validation, authorisation and error handling happen\n\nFinish with a numbered list of the files involved, in order.\n\nRead the code rather than inferring from names. Flag any step where the path branches, or where you're inferring rather than reading. Read only, don't change anything.\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself.",
    "why": "A trace is only useful if you can tell which parts were read and which were guessed.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "find-code",
    "step": 3
  },
  {
    "id": "cc-share-error",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "debugging",
    "section": "Fix bugs efficiently",
    "title": "Share the error",
    "prompt": "I'm seeing an error when I run npm test",
    "template": "I'm seeing an error when I run <npm test>.\n\nHere's the output:\n```\n<paste the full error, including the stack trace>\n```\n\nContext:\n- <It started after I changed src/auth/session.ts>\n- <It fails every run / roughly one run in three>\n- <It passes on CI but fails locally, or vice versa>\n\nBefore proposing anything:\n1. Run <npm test> yourself and confirm you see the same failure\n2. Read the code the stack trace points at\n3. Tell me the root cause in one sentence\n\nDon't fix it yet, and don't guess from the message alone. If you can't reproduce it, say so and tell me what you need.",
    "why": "Pasting the error is half the prompt. The other half is telling it to reproduce the failure before it forms a theory.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "bugfix",
    "step": 1
  },
  {
    "id": "cc-fix-options",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "debugging",
    "section": "Fix bugs efficiently",
    "title": "Ask for fix recommendations",
    "prompt": "suggest a few ways to fix the @ts-ignore in user.ts",
    "template": "Now suggest a few ways to fix <the @ts-ignore in user.ts>.\n\nRead the surrounding code first and tell me what's actually being hidden there.\n\nThen give me two or three distinct options. For each:\n- What changes, and roughly how much\n- What it costs: risk, blast radius, anything it makes harder later\n- Whether it fixes the root cause you named, or just quiets the symptom\n\nRank them, and say which you'd pick and why.\n\nDon't edit anything yet. If one option is clearly right and the others are strawmen, tell me that rather than padding the list to three.\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself.",
    "why": "Asking for options with trade-offs makes the agent surface the choice it would otherwise make silently on your behalf.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "bugfix",
    "step": 2
  },
  {
    "id": "cc-apply-fix",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "debugging",
    "section": "Fix bugs efficiently",
    "title": "Apply the chosen fix",
    "prompt": "update user.ts to add the null check you suggested",
    "template": "Go with <the null check> you suggested. Apply it to <user.ts>.\n\nJust that option, not a combination of the others.\n\nWhile you're there:\n- Remove <the @ts-ignore> it was hiding behind, don't leave it in place\n- Add a test that fails without this change and passes with it\n- Keep the diff to <user.ts> and its test file unless you need to change something else, in which case tell me first\n\nThen run <npm test> and show me the output, including the command you ran.\n\nIf, now that you're in the file, the option you recommended turns out to be wrong, stop and tell me rather than switching to another one.\n\nIf this repo has no test runner, stop and tell me before installing one or writing a harness.",
    "why": "Naming which of its own suggestions you picked prevents the agent quietly implementing a blend of all of them.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "bugfix",
    "step": 3
  },
  {
    "id": "cc-find-deprecated",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "refactoring",
    "section": "Refactor code",
    "title": "Identify legacy code",
    "prompt": "find deprecated API usage in our codebase",
    "template": "Find deprecated API usage across this codebase.\n\nInclude:\n- Deprecated calls from our dependencies, check the changelogs and the deprecation warnings in the installed versions\n- Our own internal APIs marked deprecated in comments, annotations or docstrings\n- Patterns that still work but are superseded in the language or framework version this project targets\n\nFor each finding: the file and line, what replaces it, and whether it's scheduled to break or just discouraged.\n\nGroup by how urgent it is, not by directory. Put anything that breaks on the next major upgrade at the top.\n\nDon't change anything yet. If the codebase is large, tell me how you scoped the search and what you skipped. If you find nothing deprecated, say so plainly. An empty list is a good answer here, not a failed search.",
    "why": "A deprecation sweep is only actionable if it distinguishes what is scheduled to break from what is merely old.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "refactor",
    "step": 1
  },
  {
    "id": "cc-suggest-refactor",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "refactoring",
    "section": "Refactor code",
    "title": "Get refactoring recommendations",
    "prompt": "suggest how to refactor utils.js to use modern JavaScript features",
    "template": "Now suggest how to refactor <utils.js> to use <modern JavaScript features>, including anything from that list that lands in this file.\n\nRead the whole file first, plus a couple of its callers.\n\nFor each suggestion:\n- The current code, quoted\n- What you'd change it to\n- What it buys us: clarity, safety, fewer lines, a real bug avoided\n- Whether behaviour changes at all, including edge cases like <null, undefined and empty input>\n\nSeparate them into: worth doing, marginal, and not worth the churn. Be honest about the third group, I'd rather have a short list.\n\nDon't edit the file yet. Also tell me what our toolchain and target runtime actually support, so we don't propose something that won't build. If the file is already fine as it is, say so instead of finding three things.\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself.",
    "why": "Asking which changes are not worth making is what keeps a modernisation list from becoming a churn list.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "refactor",
    "step": 2
  },
  {
    "id": "cc-apply-refactor",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "refactoring",
    "section": "Refactor code",
    "title": "Refactor while preserving behavior",
    "prompt": "refactor utils.js to use ES2024 features while maintaining the same behavior",
    "template": "Now apply the refactor to <utils.js>, using <ES2024 features>, while keeping behaviour identical.\n\nDo the changes you classified as worth doing. Skip the marginal ones unless I asked for them.\n\nConstraints:\n- No change to the exported API: same names, same signatures, same return shapes\n- Same behaviour on edge cases, including <null, undefined, empty arrays and thrown errors>\n- Don't add dependencies\n- Don't reformat or reorder code you aren't otherwise changing, keep the diff readable\n\nWhen you're done, show me:\n- The diff, grouped by the change you were making\n- Anywhere behaviour could differ even slightly, however unlikely\n\nIf a planned change turns out to alter behaviour, skip it and tell me.\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself.",
    "why": "Behaviour preservation has to be stated as a constraint and then demonstrated, otherwise a refactor quietly becomes a rewrite.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "refactor",
    "step": 3
  },
  {
    "id": "cc-verify-refactor",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "refactoring",
    "section": "Refactor code",
    "title": "Verify the refactoring",
    "prompt": "run tests for the refactored code",
    "template": "Run the tests for the code you just refactored in <utils.js>.\n\nShow me:\n- The exact command you ran\n- The full output, pass and fail, not a summary\n\nThen tell me:\n- Which of the functions you changed are actually exercised by those tests, and which aren't covered at all\n- Whether any test needed changing to pass, and if so, exactly what changed and why. A test edited to match new behaviour means the refactor changed behaviour.\n\nIf anything fails, fix it and run again, showing both runs.\n\nDon't declare it done on a green suite alone. If coverage of the refactored paths is thin, say so plainly.\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself.\n\nIf this repo has no test runner, stop and tell me before installing one or writing a harness.",
    "why": "A green suite proves nothing if the refactored code was never covered, so ask what the tests actually touched.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "refactor",
    "step": 4
  },
  {
    "id": "cc-find-untested",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "testing",
    "section": "Work with tests",
    "title": "Identify untested code",
    "prompt": "find functions in NotificationsService.swift that are not covered by tests",
    "template": "Find the code in <NotificationsService.swift> that isn't covered by tests.\n\nFor each gap, tell me:\n- The function or branch that's untested\n- What could break without it being caught\n- Whether it's genuinely worth testing, or not. Say so plainly, I'd rather have a short honest list than a complete one\n\nRank by risk, not by line count.\n\nRead the test files to work out what's covered. Don't assume a coverage tool exists, and if you run one, tell me which. If this repo has no tests at all, say so and stop rather than listing every function in the file.\n\nDon't write the tests yet. Show me the list first.",
    "why": "Ranking by risk and inviting it to say 'not worth testing' is what stops you getting a coverage-shaped wish list.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "tests",
    "step": 1
  },
  {
    "id": "cc-add-tests",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "testing",
    "section": "Work with tests",
    "title": "Generate test scaffolding",
    "prompt": "add tests for the notification service",
    "template": "Add tests for <the notification service>, covering the gaps you identified.\n\nStart with the highest-risk ones on that list. If you decide to skip any of them, say which and why.\n\nBefore writing, read two or three existing tests in <the test directory> and follow them: same framework, same file naming, same setup and assertion style.\n\nConstraints:\n- Avoid mocks. Use real objects or fixtures where practical, and tell me if a mock is genuinely unavoidable.\n- One behaviour per test, named so a failure explains itself without opening the file.\n- Test observable behaviour, not internals.\n- Don't change <the notification service> itself. If a function is untestable as written, tell me instead of refactoring it.\n\nRun the tests when you're done and show me the output.\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself.\n\nIf this repo has no test runner, stop and tell me before installing one or writing a harness.",
    "why": "Pointing at the gaps you already found, and at the existing tests to imitate, is what stops the agent writing a parallel test style of its own.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "tests",
    "step": 2
  },
  {
    "id": "cc-edge-tests",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "testing",
    "section": "Work with tests",
    "title": "Add edge-condition cases",
    "prompt": "add test cases for edge conditions in the notification service",
    "template": "Now add test cases for the edge conditions in <the notification service>, on top of the tests you just wrote.\n\nCover:\n- <Empty and missing input, a single recipient, and the largest realistic batch>\n- <A failing or slow delivery channel, and what happens to the rest of the batch>\n- <Duplicate or repeated sends, and anything time or timezone dependent>\n- Any edge case you spot in the implementation that I haven't listed\n\nFollow the same conventions as the tests already in the file.\n\nWhere the current behaviour on an edge case looks like a bug rather than a decision, tell me instead of writing a test that locks it in.\n\nRun everything and show me the output, including anything you couldn't set up a case for.\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself.",
    "why": "Edge-case tests written against current behaviour will happily lock in a bug, so the agent needs permission to call one out instead.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "tests",
    "step": 3
  },
  {
    "id": "cc-run-fix-tests",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "testing",
    "section": "Work with tests",
    "title": "Run and repair the new tests",
    "prompt": "run the new tests and fix any failures",
    "template": "Run the new tests for <the notification service> and fix any failures.\n\nFor each failure, before changing anything:\n- Say whether the test is wrong or the code is wrong\n- If the code is wrong, that's a real bug. Tell me before you patch it, don't fold a production fix into a test-fixing pass.\n\nDon't make a test pass by weakening it: no deleting assertions, no loosening a comparison, no wrapping in try/catch, no skipping.\n\nWhen everything passes, show me:\n- The command you ran and the full output\n- Every test you modified, and why\n- Any real bug you found in <the service> itself\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself.\n\nIf this repo has no test runner, stop and tell me before installing one or writing a harness.",
    "why": "The instruction that matters is about which side is wrong: a failure is sometimes the test finding a real bug, not a test needing a tweak.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "tests",
    "step": 4
  },
  {
    "id": "cc-pr-direct",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "pr-git",
    "section": "Create pull requests",
    "title": "Create a PR in one line",
    "prompt": "create a pr for my changes",
    "template": "Create a PR for my changes.\n\n- Read the full diff and the branch's commits. Don't ask me what changed.\n- Write a title that says what the change does, not which files moved\n- In the description: what changed and why, what a reviewer should look at closely, and how to test it\n- Call out anything risky or hard to reverse\n- Use `gh pr create`, and give me the URL when it's open\n\nIf the diff contains unrelated changes, tell me before opening it rather than describing them as one thing. If I'm on <main>, branch first. If there's nothing to open a PR for, say so and stop.\n\nIf `gh` isn't installed or authenticated, or this isn't a GitHub remote, stop and tell me instead of reaching for another tool.",
    "why": "It reads the diff itself, so the useful instructions are about the description and what to flag, not about what changed.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-pr-summarize",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "pr-git",
    "section": "Create pull requests",
    "title": "Summarize your changes first",
    "prompt": "summarize the changes I've made to the authentication module",
    "template": "Summarise the changes I've made to <the authentication module>.\n\nRead the diff against <main> and the branch's commits yourself. Don't ask me what changed.\n\nGive me:\n- What changed, grouped by intent rather than by file\n- Why each group appears to be there, and say when you're inferring\n- Anything behaviour-changing, especially around <auth, permissions or session lifetime>\n- Anything that looks unrelated to <the authentication work> and might belong in a separate PR\n- Anything half-finished: TODOs, commented-out code, debug logging, stray console output\n\nIf the diff is empty, or there's nothing on this branch that isn't already on <main>, say so and stop.\n\nDon't commit or open anything yet. This is for me to check before we write the PR.",
    "why": "Summarising before opening the PR gives you a chance to catch the unrelated change while it is still cheap to split out.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "pull-request",
    "step": 1
  },
  {
    "id": "cc-pr-create",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "pr-git",
    "section": "Create pull requests",
    "title": "Generate the pull request",
    "prompt": "create a pr",
    "template": "Now create the PR, using that summary.\n\n- Title: what the change does, not which files moved\n- Description: what changed and why, what a reviewer should look at closely, and how to test it\n- Use `gh pr create`, target <main>, and give me the URL when it's open\n\nIf I'm on <main>, branch first. Commit anything uncommitted with a message that matches the summary.\n\nIf `gh` isn't installed or authenticated, or this isn't a GitHub remote, stop and tell me. Commit and push, then give me the compare URL, but don't reach for another tool on your own.\n\nDon't include the items you flagged as unrelated. If they can't be separated cleanly, stop and tell me before opening it.",
    "why": "Step two is lighter on purpose: the summary is already in context, so the prompt only needs to cover the mechanics.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "pull-request",
    "step": 2
  },
  {
    "id": "cc-pr-enhance",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "pr-git",
    "section": "Create pull requests",
    "title": "Refine the PR description",
    "prompt": "enhance the PR description with more context about the security improvements",
    "template": "Enhance the PR description with more context about <the security improvements>.\n\nAdd:\n- What the vulnerability or weakness was, in terms a reviewer outside <the auth team> will follow\n- What the fix does, and why this approach over the alternatives\n- The blast radius: what else touches this, and what breaks if the fix is wrong\n- How a reviewer can verify it, including <the specific test or request to try>\n\nKeep the existing summary of what changed, expand around it rather than rewriting it.\n\nDon't overstate the severity, and don't include anything a reader shouldn't see in a public repo: no unpatched details of <other systems>, no tokens, no internal URLs.\n\nUpdate the PR and show me the final description.\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself.",
    "why": "A description gets edited well when the agent is told which reader it is writing for and what that reader needs to check.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "pull-request",
    "step": 3
  },
  {
    "id": "cc-find-undocumented",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "documentation",
    "section": "Handle documentation",
    "title": "Identify undocumented code",
    "prompt": "find functions without proper JSDoc comments in the auth module",
    "template": "Find functions without proper JSDoc comments in <the auth module>.\n\nFirst, read a few well-documented functions elsewhere in the codebase and tell me what \"proper\" means here: which tags we use, whether we document params and returns and throws, how much prose is normal. If there's nothing well documented to go on, say so and tell me you're using the JSDoc defaults instead. Don't present an invented house style as ours.\n\nThen list, for <the auth module>:\n- Functions with no doc comment at all\n- Functions with a comment that's incomplete against that convention, and what's missing\n- Functions with a comment that no longer matches what the code does\n\nSkip private helpers whose behaviour is obvious from the name, and say that you skipped them.\n\nRank by how public the function is and how easy it is to misuse. Don't write any documentation yet.",
    "why": "\"Proper\" is the load-bearing word, so define it against the project's own convention before asking what's missing.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "docs",
    "step": 1
  },
  {
    "id": "cc-add-jsdoc",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "documentation",
    "section": "Handle documentation",
    "title": "Generate documentation",
    "prompt": "add JSDoc comments to the undocumented functions in auth.js",
    "template": "Add JSDoc comments to the undocumented functions you found in <auth.js>.\n\nFor each one:\n- What it does, and why a caller would reach for it\n- Each parameter, including what's optional and what a valid value looks like\n- The return value, and what it means when it's <null or empty>\n- What it throws, and when\n- Side effects: <network calls, writes, cache invalidation, anything not obvious from the name>\n\nMatch the tag style and tone of the existing docs.\n\nDon't restate the signature in prose. Don't document behaviour you haven't confirmed by reading the body, and if a function's behaviour is unclear, leave it and tell me rather than writing a plausible guess.\n\nDon't change any code, comments only.\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself.",
    "why": "Docs that restate the signature are noise, so the prompt has to ask for the parts a reader cannot get from the types.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "docs",
    "step": 2
  },
  {
    "id": "cc-improve-docs",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "documentation",
    "section": "Handle documentation",
    "title": "Review and enhance",
    "prompt": "improve the generated documentation with more context and examples",
    "template": "Improve the documentation you just generated with more context and examples.\n\nFor the functions that are hardest to use correctly:\n- Add a short usage example, realistic to this codebase, using types and helpers that actually exist here\n- Say what the common mistake is, or what surprises a first-time caller\n- Link to <the related function or module> a reader will need next\n\nKeep it proportionate: <a one-line getter> doesn't need an example. Say which functions you left alone and why.\n\nEvery example must be code that would actually run. Check the names and signatures you use against the source. If you can't verify an example, don't include it.\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself.",
    "why": "The second pass is where examples come from, and an example that was never run is a liability rather than an improvement.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "docs",
    "step": 3
  },
  {
    "id": "cc-check-doc-standards",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "documentation",
    "section": "Handle documentation",
    "title": "Check against project standards",
    "prompt": "check if the documentation follows our project standards",
    "template": "Check whether the documentation we just added follows our project standards.\n\nFind the standard first: look for <CONTRIBUTING.md, a style guide, lint rules for docs, or an eslint jsdoc config>. Tell me what you found. If there's no written standard, say so and infer the convention from the best-documented existing module instead. If there isn't one of those either, say that too and stop, rather than grading our docs against a standard you made up.\n\nThen report:\n- Anywhere the new docs deviate, with the file, the line, and the rule\n- Anywhere the codebase's existing docs already deviate, so I know if we're the exception\n- Anything the standard doesn't cover but should\n\nRun <the docs lint command> if one exists, and show me the command and the output.\n\nReport first, don't fix. Style nits and real problems in separate lists.\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself.",
    "why": "Checking against a written standard, and saying when there isn't one, is the difference between an audit and an opinion.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "docs",
    "step": 4
  },
  {
    "id": "cc-img-what",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "images",
    "section": "Work with images",
    "title": "Ask what an image shows",
    "prompt": "What does this image show?",
    "template": "What does this image show?\n\nTell me:\n- What it is: <a screenshot, a diagram, a photo of a whiteboard, a chart>\n- The content, read out in a sensible order, including any text you can make out\n- What it seems to be for, and what it's telling me\n\nThen, separately, anything you're unsure about: text that's too small or blurred to read, parts that are cut off, elements whose meaning is ambiguous.\n\nDescribe what's actually there before interpreting it. If you can't read something, say so rather than filling it in from context.",
    "why": "Splitting what is visible from what it implies keeps the agent from narrating a confident story over an ambiguous picture.",
    "requires": [
      "image-attached"
    ],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-img-ui",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "images",
    "section": "Work with images",
    "title": "Describe a screenshot's UI",
    "prompt": "Describe the UI elements in this screenshot",
    "template": "Describe the UI elements in this screenshot.\n\nGo through it top to bottom, left to right, and for each element give me:\n- What it is: <button, input, table, nav, modal, toast>\n- Its label or content, transcribed exactly\n- Its state where visible: <disabled, selected, focused, loading, error>\n- What it's nested inside\n\nThen summarise:\n- The layout structure and the visual hierarchy\n- What the primary action on this screen appears to be\n\nTranscribe text exactly rather than paraphrasing it. Where an icon has no label and its meaning isn't obvious, say so instead of guessing what it does.",
    "why": "Asking for state and hierarchy, not just a component inventory, is what makes the description usable for building or reviewing the screen.",
    "requires": [
      "image-attached"
    ],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-img-diagram",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "images",
    "section": "Work with images",
    "title": "Critique a diagram",
    "prompt": "Are there any problematic elements in this diagram?",
    "template": "Are there any problematic elements in this diagram?\n\nFirst, read it back to me: the nodes, the connections, and the flow as you understand it. That tells me whether it communicates what it's meant to.\n\nThen look for problems:\n- Ambiguity: arrows without direction or label, boxes whose role isn't clear, inconsistent shapes or naming\n- Logical gaps: missing steps, dead ends, cycles that look unintended\n- Missing failure paths, only the happy path shown\n- Overload: too much on one diagram, or two concerns mixed together\n- Anything unreadable: overlaps, cut-off text, low contrast\n\nSeparate what's wrong from what's merely unclear. If the diagram reads fine, say so rather than finding something.",
    "why": "The useful critique of a diagram is about what it fails to communicate, which the agent will only look for if you name the categories.",
    "requires": [
      "image-attached"
    ],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-img-error",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "images",
    "section": "Work with images",
    "title": "Debug from a screenshot",
    "prompt": "Here's a screenshot of the error. What's causing it?",
    "template": "Here's a screenshot of the error I'm hitting.\n\nTell me:\n- What's failing, based on what's visible\n- The most likely cause in this codebase specifically. Go and read the relevant files, don't guess from the message alone\n- How to reproduce it deterministically\n- The fix, and how I can verify it worked\n\nIf the screenshot doesn't contain enough to be sure, tell me what else you need instead of guessing.",
    "why": "Without the instruction to go and read the code, you get a plausible guess from the error text alone.",
    "requires": [
      "image-attached"
    ],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-img-schema",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "images",
    "section": "Work with images",
    "title": "Plan a change from a schema image",
    "prompt": "This is our current database schema. How should we modify it for the new feature?",
    "template": "This is our current database schema. How should we modify it for <the new feature>?\n\n<The feature needs to: describe it in two or three lines, including what gets read and written and how often.>\n\nGive me:\n- The tables and columns to add or change, with types and nullability\n- New relationships and the constraints or indexes they need\n- What existing queries or code this affects\n- The migration path, in steps that each leave the app working, including how existing rows get backfilled\n\nCall out anything that can't be reversed once it's shipped.\n\nRead the image against the actual schema in the repo, wherever that lives: migrations, models, or a schema file. If the diagram is out of date, tell me before designing on top of it. If you can't find the schema in the repo at all, say so and work from the image alone, and tell me you're doing that.\n\nDon't write the migration yet.",
    "why": "Schema changes are migrations, so the answer is only useful if it includes the path from the current data to the new shape.",
    "requires": [
      "image-attached"
    ],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-img-css",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "images",
    "section": "Work with images",
    "title": "Generate CSS from a mockup",
    "prompt": "Generate CSS to match this design mockup",
    "template": "Generate CSS to match this design mockup.\n\nConstraints:\n- Use our existing design tokens and variables rather than hardcoded values wherever one fits. Read <styles/tokens.css> first. If there's no token file, tell me and use plain values.\n- Write <plain CSS / our Tailwind classes / CSS modules>, matching how <the rest of the app> is styled\n- Match spacing, typography, colour and border treatment as closely as you can\n- Make it responsive: tell me what you assume happens at <mobile widths>, since the mockup only shows one size\n\nWhen you're done, list:\n- Every value you estimated from the image rather than took from a token, so I can check them\n- Anything in the mockup you couldn't reproduce in CSS, and what it would need",
    "why": "A mockup contains values the agent has to estimate, and a list of the estimates is the only way you know where to check it.",
    "requires": [
      "image-attached"
    ],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-img-html",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "images",
    "section": "Work with images",
    "title": "Recreate a component's markup",
    "prompt": "What HTML structure would recreate this component?",
    "template": "What HTML structure would recreate this component?\n\nGive me:\n- The markup, with class names following the convention used in <src/components/>. If there's no consistent convention there, say so and pick one, and tell me which.\n- Semantic elements where they apply: <button, nav, ul, table, label>, not divs with click handlers\n- Accessible names for every interactive element, plus any aria attributes the visible states imply\n- A short note on which parts would be props or slots rather than fixed content\n\nThen list the states the image doesn't show but the component will need: <hover, focus, disabled, empty, loading, error>.\n\nMarkup only, no styling yet. Where the image doesn't tell you whether something is <a link or a button>, say so and give me your assumption.",
    "why": "Asking for semantics and accessible names up front is cheaper than retrofitting them onto a wall of nested divs.",
    "requires": [
      "image-attached"
    ],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-ref-file",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "context-refs",
    "section": "Reference files and directories",
    "title": "Reference a single file with @",
    "prompt": "Explain the logic in @src/utils/auth.js",
    "template": "Explain the logic in <@src/utils/auth.js>.\n\nGo through it in this order:\n- What the file is responsible for, in one sentence\n- Each exported function: what it takes, what it returns, and when it throws\n- <The token expiry handling> specifically, line by line\n- Any state or module-level variable that persists between calls\n\nThen tell me:\n- Who calls this, and what they assume about it\n- Anything here that looks like a bug rather than a decision\n\nQuote the lines you're describing so I can follow along. Where the logic depends on a file you haven't read, say so and read that file too rather than inferring from the name.\n\nRead only. Don't change anything.",
    "why": "The @ reference puts the real file in context, so the only thing left to get right is telling it which parts of the file you care about.",
    "requires": [],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-ref-dir",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "context-refs",
    "section": "Reference files and directories",
    "title": "Reference a directory with @",
    "prompt": "What's the structure of @src/components?",
    "template": "What's the structure of <@src/components>?\n\nI want the organising principle, not a file listing:\n- How the directory is grouped, and what decides where a new file goes\n- The naming conventions in use, including any that are only followed most of the time\n- Which files are the canonical examples I should imitate\n- What's shared, and what's local to one feature\n- Anything that clearly predates the current convention\n\nOpen a few representative files to check, don't infer the conventions from filenames alone. If the directory is flat or small enough that there's no organising principle to find, say so rather than describing one.\n\nFinish with: where would <a new settings panel> go, and which existing file should I copy the shape of?\n\nRead only.",
    "why": "Pointing @ at a directory loads the tree, not the contents, so ask for the organising principle rather than a file listing you could get from ls.",
    "requires": [],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-ref-mcp",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "context-refs",
    "section": "Reference files and directories",
    "title": "Reference an MCP resource",
    "prompt": "Show me the data from @github:repos/owner/repo/issues",
    "template": "Show me the data from <@github:repos/owner/repo/issues>.\n\nDon't just dump it. Give me:\n- A table of the <10> most relevant items with <number, title, author, age, labels>\n- The grouping that actually matters here: <by label, then by age>\n- Anything that looks stale, duplicated, or already fixed in the code\n\nThen cross-reference against this repo: for <the top three>, tell me which files would need to change and whether the issue still reproduces on <main>.\n\nIf the resource returns paginated or truncated data, say how much you actually saw rather than presenting a partial list as complete. Read only, don't post or edit anything upstream.",
    "why": "An MCP resource comes back as raw data, so the useful part of the prompt is what you want done to it once it lands.",
    "requires": [
      "mcp-server"
    ],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-scheduled-task",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "automation",
    "section": "Run Claude on a schedule",
    "title": "Write a scheduled task with explicit success criteria",
    "prompt": "Review open PRs labeled `needs-review`, leave inline comments on any issues, and post a summary in the `#eng-reviews` Slack channel.",
    "template": "Review open PRs labeled <`needs-review`>, leave inline comments on any issues, and post a summary in the <`#eng-reviews`> Slack channel.\n\nFor each PR:\n- Read the full diff, plus the files it touches, before commenting\n- Comment only on correctness, security and missing tests. No style or naming opinions.\n- Put each comment on the exact line it refers to, and say what input triggers the problem\n- If a PR is clean, leave no comments and record it as clean\n\nSkip PRs that are drafts, or that you've already commented on since their last push.\n\nThe Slack summary should have: PRs reviewed, PRs needing changes with a one-line reason each, and anything you couldn't assess.\n\nDon't approve, merge or close anything. If the label matches nothing, post nothing and exit quietly. If you have no tool connected that can post to that channel, write the summary to <review-summary.md> instead and say that's what you did.",
    "why": "A scheduled run has nobody watching it, so every judgement call it will hit has to be decided in the prompt before it ever runs.",
    "requires": [
      "mcp-server"
    ],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-cap-pr",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "capabilities",
    "section": "Ask Claude about its capabilities",
    "title": "Ask whether it can open PRs",
    "prompt": "can Claude Code create pull requests?",
    "template": "Can Claude Code create pull requests?\n\nAnswer with specifics:\n- The exact commands you'd run in this repo to go from working tree to open PR\n- What has to exist first: the CLI installed and authenticated, a remote configured, branch permissions\n- Which of those steps will prompt me for permission, and which won't\n- What you can't do: approving, merging, or acting as another user\n\nThen check this repo and tell me whether the prerequisites are actually in place here.\n\nWhere your answer depends on a version or setting, say which. If you're not sure, say so instead of describing a feature that may not exist.",
    "why": "Asking the tool about itself is only useful if you ask for the exact commands and the permissions they need, not a yes.",
    "requires": [],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-cap-permissions",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "capabilities",
    "section": "Ask Claude about its capabilities",
    "title": "Ask how permissions work",
    "prompt": "how does Claude Code handle permissions?",
    "template": "How does Claude Code handle permissions?\n\nCover:\n- The permission modes, and what each one will and won't do without asking\n- Where rules live: project settings, user settings, enterprise policy, and which wins\n- The syntax for allow and deny rules, with a worked example for a shell command, a file edit and a web fetch\n- What is never auto-approved regardless of settings\n\nThen show me the current effective configuration for this project and explain what it permits in practice.\n\nGive me the two or three rules most people should add first, and say what each one gives up. Where the docs and the settings you can actually read disagree, tell me which you're going by.",
    "why": "The permission model is the difference between an agent you can leave alone and one you can't, and most people learn it by getting surprised.",
    "requires": [],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-cap-skills",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "capabilities",
    "section": "Ask Claude about its capabilities",
    "title": "List available skills",
    "prompt": "what skills are available?",
    "template": "What skills are available?\n\nFor each one, give me:\n- The name, and one line on what it does\n- Where it comes from: personal, project, or plugin\n- The phrasing that actually triggers it\n\nThen answer the part the list doesn't:\n- Which of these are relevant to this repo and which are noise here\n- Any two that overlap, and how you'd choose between them\n- Anything I'd expect to have but don't\n\nShow me one concrete example of invoking the one you'd reach for most often here.\n\nList only skills you can actually see loaded right now. Don't include ones you assume exist.",
    "why": "Skills only help if you know which one fires when, and the list alone doesn't tell you that.",
    "requires": [],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-cap-mcp",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "capabilities",
    "section": "Ask Claude about its capabilities",
    "title": "Ask how to use MCP",
    "prompt": "how do I use MCP with Claude Code?",
    "template": "How do I use MCP with Claude Code?\n\nExplain:\n- What an MCP server gives you that built-in tools don't: tools, resources, prompts\n- The exact commands to add, list, and remove a server\n- The scope options, where the config file lands for each, and which to use for a server the whole team needs\n- How authentication works for a remote server, and where credentials are stored\n- How to reference a server's resources with @ once it's connected\n\nThen show me what's currently connected in this project, and walk through adding <the server I actually want> end to end, including how I verify it's working.\n\nFlag anything that's version-dependent or that changed recently.",
    "why": "MCP setup fails at the boring end, scope and auth, so ask about those rather than the concept.",
    "requires": [],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-cap-bedrock",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "capabilities",
    "section": "Ask Claude about its capabilities",
    "title": "Ask about Bedrock configuration",
    "prompt": "how do I configure Claude Code for Amazon Bedrock?",
    "template": "How do I configure Claude Code for Amazon Bedrock?\n\nGive me:\n- The environment variables to set, with an example value for each\n- How credentials are resolved: profile, SSO, instance role, and what takes precedence\n- The IAM permissions needed, as a minimal policy\n- How model ids are written for Bedrock, and how to pin <the model I want> in <region>\n- Which features behave differently or are unavailable on Bedrock\n\nThen give me a one-command check that proves the connection works, and the three most common failure messages with what each one actually means.\n\nSay where this is version-dependent. Don't guess at an ARN format or a policy action, tell me if you need to check the docs.",
    "why": "Bedrock is mostly environment variables and IAM, and the failure messages don't tell you which one you got wrong.",
    "requires": [],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-cap-limits",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "capabilities",
    "section": "Ask Claude about its capabilities",
    "title": "Ask about its limitations",
    "prompt": "what are the limitations of Claude Code?",
    "template": "What are the limitations of Claude Code?\n\nBe concrete rather than diplomatic. Cover:\n- What you cannot do at all in this environment\n- What you can do but reliably do badly, and the tell that it's going wrong\n- Context limits: what falls out of context, when, and what I lose when it does\n- Where your knowledge is stale, and how I'd know\n- Tasks in this repo specifically that I should not hand you\n\nFor each limitation, give me the workaround if there is one, and say plainly when there isn't.\n\nDon't soften this into a list of strengths. I'm asking so I can decide what to do myself.",
    "why": "Knowing where the tool is weak is what stops you handing it the task it will quietly do badly.",
    "requires": [],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-subagent-investigate",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "subagents",
    "section": "Delegate research to subagents",
    "title": "Delegate an investigation",
    "prompt": "use a subagent to investigate how our auth system handles token refresh",
    "template": "Use a subagent to investigate how <our auth system handles token refresh>.\n\nHave it read widely: <src/auth>, the callers, the tests, and the git history where the behaviour is unclear.\n\nReport back only:\n- How it works now, in a short summary\n- The specific files and functions, with line numbers\n- Where the refresh can fail, and what happens to the user when it does\n- Anything that would trap someone changing this\n\nKeep the file reads in the subagent context. I want the findings, not the transcript.\n\nRead only, no edits. If the subagent couldn't determine something, say so rather than filling the gap with a plausible answer.",
    "why": "A subagent has its own context window, so the win is that the reading happens somewhere other than your session.",
    "requires": [
      "subagent"
    ],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-pipe-commits",
    "page": "cc-workflows",
    "tool": "claude-code",
    "category": "automation",
    "section": "Pipe Claude into scripts",
    "title": "Pipe git log into Claude",
    "prompt": "summarize these recent commits",
    "shell": "git log --oneline -20 | claude -p \"summarize these recent commits\"",
    "template": "Summarize these recent commits.\n\nI've piped in the log on stdin. Work only from what's there.\n\nGive me:\n- <3 to 5> themes, each with the commit subjects that belong to it\n- Anything that looks like a revert, a hotfix, or a rushed follow-up\n- Commit messages too vague to classify, listed separately\n\nFormat it as <markdown bullets I can paste into a standup note>. Keep it under <150> words.\n\nDon't read the repo and don't infer intent beyond the messages. If the log is too thin to say anything useful, say that instead of padding.",
    "why": "Piping means the input arrives on stdin with no repo context attached, so the prompt has to say what shape the answer should take.",
    "requires": [
      "shell"
    ],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-verify-email",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "verification",
    "section": "Provide verification criteria",
    "title": "State the test cases up front",
    "weak": "implement a function that validates email addresses",
    "prompt": "write a validateEmail function. example test cases: user@example.com is true, invalid is false, user@.com is false. run the tests after implementing",
    "template": "Write a <validateEmail> function in <src/utils/validate.ts>.\n\nIt must satisfy these cases:\n- <user@example.com> → <true>\n- <invalid> → <false>\n- <user@.com> → <false>\n- <add the cases that matter in your domain>\n\nWork in this order:\n1. Write the tests from that list first\n2. Then the implementation\n3. Run the tests and iterate until they all pass\n4. Show me the final test output\n\nFollow the existing style in <src/utils/>. Don't add a validation library, <keep it dependency-free>.\n\nIf any case in my list is wrong or contradictory, tell me before implementing it.\n\nIf this repo has no test runner, stop and tell me before installing one or writing a harness.",
    "why": "Handing over the test cases in the prompt gives the agent something to check itself against, so it stops when it's right rather than when it looks done.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-verify-ui",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "verification",
    "section": "Verify UI changes visually",
    "title": "Make the agent compare against the design",
    "weak": "make the dashboard look better",
    "prompt": "[paste screenshot] implement this design. take a screenshot of the result and compare it to the original. list differences and fix them",
    "template": "Implement this design in <src/components/Dashboard.tsx>.\n\nThen verify it visually, don't just tell me it's done:\n1. Run the app and take a screenshot of the result at <the same width as the design>\n2. Compare your screenshot to the original, side by side\n3. List every difference you can see: spacing, sizes, colour, weight, alignment, anything missing\n4. Fix them and repeat until the list is only things that genuinely can't be matched\n\nShow me the final screenshot and the remaining differences with a reason for each.\n\nUse <our existing components and tokens> where they fit. If you can't take a screenshot, say so rather than asserting it matches.",
    "why": "Screenshotting its own result and diffing it against the design is what replaces the agent's opinion that the UI looks right.",
    "requires": [
      "image-attached"
    ],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-verify-root-cause",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "verification",
    "section": "Address root causes, not symptoms",
    "title": "Forbid suppressing the error",
    "weak": "the build is failing",
    "prompt": "the build fails with this error: [paste error]. fix it and verify the build succeeds. address the root cause, don't suppress the error",
    "template": "The build fails with this error:\n```\n<paste the full error output>\n```\n\nFix it, and address the root cause.\n\nBefore patching:\n- Reproduce it with <the build command> and confirm you see the same failure\n- Tell me the root cause in one sentence, and what introduced it\n\nDon't get past it by: suppressing or ignoring the error, adding <@ts-ignore, eslint-disable, a broad try/catch or a type assertion>, loosening <the compiler or lint config>, pinning a dependency backwards, or deleting the failing code.\n\nIf the honest fix is bigger than you expected, stop and tell me rather than reaching for one of those.\n\nWhen you're done, run <the build> and show me the command and the full output.",
    "why": "Naming the specific evasions is what makes the ban stick, because \"fix the root cause\" alone is agreeable and unenforceable.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-explore",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "planning",
    "section": "Explore first, then plan, then code",
    "title": "Explore in plan mode",
    "prompt": "read /src/auth and understand how we handle sessions and login.\nalso look at how we manage environment variables for secrets.",
    "template": "Read <src/auth> and explain how <sessions and login> work here.\n\nBefore we change anything, I want to understand:\n- The main flow, end to end\n- Where <environment variables and secrets> are read, and how they're managed\n- Anything surprising, inconsistent, or clearly legacy\n- Which files I'd need to touch to change <this behaviour>\n\nRead only. Don't edit, don't propose a fix yet, and don't write code.\n\nWhere you're unsure, say so rather than filling the gap.",
    "why": "The value here is the constraint: reading without permission to edit is what stops it solving the wrong problem at speed.",
    "requires": [
      "plan-mode"
    ],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "explore-plan-code",
    "step": 1
  },
  {
    "id": "cc-plan",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "planning",
    "section": "Explore first, then plan, then code",
    "title": "Ask for an implementation plan",
    "prompt": "I want to add Google OAuth. What files need to change?\nWhat's the session flow? Create a plan.",
    "template": "I want to add <Google OAuth>.\n\nProduce a plan covering:\n- Which files change, and what changes in each\n- The <session> flow after the change, step by step\n- New dependencies or config, and why each is needed\n- What could break, and how we'd know\n- The order to do it in, so the repo works and tests pass at every step\n\nDon't write the code yet. Show me the plan and wait. I want to review it before you touch anything.\n\nFlag any decision with a real trade-off, and give me your recommendation with the reasoning.\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself.",
    "why": "Asking for the failure modes and the ordering surfaces the decisions you'd otherwise discover halfway through the implementation.",
    "requires": [
      "plan-mode"
    ],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "explore-plan-code",
    "step": 2
  },
  {
    "id": "cc-implement",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "planning",
    "section": "Explore first, then plan, then code",
    "title": "Implement from the plan, with tests",
    "prompt": "implement the OAuth flow from your plan. write tests for the\ncallback handler, run the test suite and fix any failures.",
    "template": "Implement <the OAuth flow> from your plan.\n\nAs you go:\n- Follow the plan's ordering, and tell me if you need to deviate from it\n- Write tests for <the callback handler>, including the failure cases\n- Run the full test suite and fix anything you break\n\nWhen you're done, show me:\n- The test output\n- A summary of what changed, against the plan\n- Anything you skipped, deferred, or did differently, and why\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself.\n\nIf this repo has no test runner, stop and tell me before installing one or writing a harness.",
    "why": "Asking what it skipped is the part people leave out, and it's where the surprises are.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "explore-plan-code",
    "step": 3
  },
  {
    "id": "cc-commit-pr",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "planning",
    "section": "Explore first, then plan, then code",
    "title": "Commit and open a PR",
    "prompt": "commit with a descriptive message and open a PR",
    "template": "Commit the work with a descriptive message and open a PR.\n\nCommit:\n- Message says what changed and why, not which files moved\n- Split into separate commits if the work has distinct parts\n- Follow the format of the recent commits on <main>\n\nPR:\n- Describe what we built, referencing <the plan> we agreed\n- Note anything implemented differently from the plan, and why\n- Say what a reviewer should look at closely, and how to test it\n- Use <gh pr create> and give me the URL\n\nBefore committing: run <the test suite and the linter>, show me the output, and don't commit if anything fails. If there are unrelated changes in the working tree, tell me instead of sweeping them in. If I'm on <main>, branch first.\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself.",
    "why": "Closing the loop back to the plan is what makes the PR reviewable by someone who was not in the session with you.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "explore-plan-code",
    "step": 4
  },
  {
    "id": "cc-scope-task",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "testing",
    "section": "Scope the task",
    "title": "Name the file, the scenario, the preference",
    "weak": "add tests for foo.py",
    "prompt": "write a test for foo.py covering the edge case where the user is logged out. avoid mocks.",
    "template": "Write tests for <src/foo.py>.\n\nCover:\n- <the happy path>\n- <the edge case where the user is logged out>\n- Any error or boundary condition you spot while reading the file\n\nFollow the patterns already in <tests/>: same framework, same naming, same assertion style. Read two or three existing test files before you write anything.\n\nConstraints:\n- Avoid mocks. Use real objects or fixtures where practical, and tell me if a mock is genuinely unavoidable.\n- One behaviour per test, named so the failure message explains itself without opening the file.\n- Test observable behaviour, not internals.\n\nRun the tests when you're done and show me the output.\n\nIf this repo has no test runner, stop and tell me before installing one or writing a harness.",
    "why": "Naming the case and banning mocks is the difference between tests that catch regressions and tests that assert the mock was called.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-point-sources",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "search",
    "section": "Point to sources",
    "title": "Direct it at the source that holds the answer",
    "weak": "why does ExecutionFactory have such a weird api?",
    "prompt": "look through ExecutionFactory's git history and summarize how its api came to be",
    "template": "Look through <ExecutionFactory>'s git history and summarise how its API came to be.\n\nUse <git log --follow>, <git log -p> and <git blame> on <the file>. Read the commit messages and the diffs, and follow any issue or PR numbers they reference.\n\nTell me:\n- The shape it started as\n- The changes that made it what it is now, in order, with the commit and the date\n- What each change was solving, in the author's own words where the message says\n- Which parts of the current API exist for a reason that still applies, and which are leftovers from <a constraint we no longer have>\n\nDistinguish what the history states from what you're inferring. If the history is thin or the file was moved and the trail breaks, say so.\n\nRead only, don't change anything.",
    "why": "The technique is naming the source that holds the answer: history explains why an API is shaped oddly in a way the current code never can.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-reference-patterns",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "refactoring",
    "section": "Reference existing patterns",
    "title": "Point at a canonical example in your codebase",
    "weak": "add a calendar widget",
    "prompt": "look at how existing widgets are implemented on the home page to understand the patterns. HotDogWidget.php is a good example. follow the pattern to implement a new calendar widget that lets the user select a month and paginate forwards/backwards to pick a year. build from scratch without libraries other than the ones already used in the codebase.",
    "template": "Implement <a calendar widget that lets the user select a month and paginate forwards and backwards to pick a year>.\n\nBefore writing anything, read <HotDogWidget.php> and <the other widgets on the home page> to learn the pattern this codebase uses: file layout, naming, how state is held, how components are registered and rendered.\n\nThen follow that pattern:\n- Match the existing structure rather than inventing a new one\n- Build from scratch using only libraries already in the codebase, don't add dependencies\n- If the existing pattern genuinely doesn't fit what I'm asking for, stop and tell me why instead of working around it\n\nWhen you're done, show me the new files and point out anywhere you deviated from the pattern.",
    "why": "Pointing at one good file that already exists beats any amount of describing the convention you want.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-describe-symptom",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "debugging",
    "section": "Describe the symptom",
    "title": "Symptom, likely location, and what fixed looks like",
    "weak": "fix the login bug",
    "prompt": "users report that login fails after session timeout. check the auth flow in src/auth/, especially token refresh. write a failing test that reproduces the issue, then fix it",
    "template": "Bug: <users report that login fails after session timeout>.\n\nWhere I think it lives: <src/auth/, especially token refresh>\n\nSteps to reproduce:\n1. <first step>\n2. <second step>\n3. <what I expect vs what actually happens>\n\nFrequency: <every time / intermittent, roughly one in three>\n\nBefore you fix anything:\n- Write a failing test that reproduces this, and show me it failing\n- Tell me the root cause in one sentence\n\nThen fix it, run the suite, and show me the output.\n\nAddress the root cause. Don't suppress the error, catch-and-ignore it, or add a defensive guard that hides the symptom. Don't change <the public API shape>.\n\nIf this repo has no test runner, stop and tell me before installing one or writing a harness.",
    "why": "A failing test written before the fix is what stops the agent declaring victory on a symptom it merely hid.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-open-ended",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "search",
    "section": "Provide specific context in your prompts",
    "title": "The deliberately vague exploration prompt",
    "prompt": "what would you improve in this file?",
    "template": "What would you improve in <this file>?\n\nRead the whole thing first. Then tell me what stands out, in whatever order matters most, and don't work from a checklist. I'm deliberately not telling you what to look for.\n\nFor each thing: what it is, why it matters, and how much it would take to change.\n\nBe blunt about what's actually worth doing versus what's just not how you'd have written it, and put those in separate lists. If the file is fine, say so.\n\nDon't change anything yet.",
    "why": "The vagueness is the technique: a narrow question gets you answers about what you already suspected, and this one surfaces what you didn't ask about.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-learn-cli",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "automation",
    "section": "Use CLI tools",
    "title": "Teach it an unfamiliar CLI",
    "prompt": "Use 'foo-cli-tool --help' to learn about foo tool, then use it to solve A, B, C.",
    "template": "Use `<foo-cli-tool> --help` to learn the tool, then use it to <solve A, B, C>.\n\nWork in this order:\n1. Read the top-level help, then the help for the subcommands you'll need\n2. Tell me the exact commands you plan to run, and what each one does, before running any that change state\n3. Run them, and show me the real output\n\nConstraints:\n- Use only flags you saw in the help output. Don't recall them from memory.\n- If the tool is unavailable or the version differs from what the help suggests, stop and tell me\n- <Nothing destructive without asking first>\n\nIf a step fails, show the error and what you changed rather than retrying silently. Finish by telling me which commands worked, so I can save them.",
    "why": "Sending it to `--help` first is what stops it inventing flags for a tool that postdates its training.",
    "requires": [],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-hook-eslint",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "config",
    "section": "Set up hooks",
    "title": "Have Claude write a hook",
    "prompt": "Write a hook that runs eslint after every file edit",
    "template": "Write a hook that runs <eslint> after every file edit.\n\nRequirements:\n- Fire on the file-editing tools only, and only for <*.js, *.jsx, *.ts, *.tsx>\n- Lint just the file that was edited, not the whole project\n- Feed the errors back to you so you fix them in the same turn\n- Stay quiet when the file is clean\n- Don't block on <warnings>, only <errors>\n\nBefore writing it:\n- Check how <eslint> is actually invoked in this repo, package scripts included\n- If it isn't set up here at all, say so and stop rather than installing it or guessing a command\n- Tell me which settings file you're putting this in and why\n\nAfter writing it, show me the config, explain the JSON field by field, and test it by editing a file and showing me the hook output. If it doesn't fire, debug it rather than telling me it should work.",
    "why": "A hook turns a convention you keep repeating into something the harness enforces, so you stop having to notice.",
    "requires": [
      "save-to-file"
    ],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-hook-block",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "config",
    "section": "Set up hooks",
    "title": "Have Claude write a blocking hook",
    "prompt": "Write a hook that blocks writes to the migrations folder.",
    "template": "Write a hook that blocks writes to <the migrations folder>.\n\nRequirements:\n- Block the file-editing tools on <db/migrations/**>, and block <Bash> commands that would write there too\n- Return a message that says why it's blocked and what to do instead: <add a new migration, never edit an existing one>\n- Allow reads. I still want you able to look at them.\n- <Allow creating new files in that folder, block modifying existing ones> if that distinction is expressible; if it isn't, tell me\n\nAfter writing it:\n- Show me the config and explain each field\n- Test it: try an edit that should be blocked and one that should be allowed, and show both results\n- Tell me what this does not cover, so I know the gaps rather than assuming it's airtight",
    "why": "A deny rule you write once is more reliable than an instruction you have to remember to repeat every session.",
    "requires": [
      "save-to-file"
    ],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-subagent-security",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "subagents",
    "section": "Create custom subagents",
    "title": "Invoke a subagent explicitly",
    "prompt": "Use a subagent to review this code for security issues.",
    "template": "Use a subagent to review <this code / the current diff> for security issues.\n\nHave it look for:\n- Input trusted before it's validated, especially anything reaching <a query, a shell, or a filesystem path>\n- Authorisation checks missing, or applied after the effect\n- Secrets, tokens or PII that could be logged, cached or committed\n- Error paths that fail open or leak internals to the caller\n- Unsafe defaults: <permissive CORS, disabled TLS verification, wildcard permissions>\n\nFor each finding: file and line, the input that triggers it, the consequence, and the fix.\n\nRank by severity and report severity honestly. Where a category is clean, say so rather than filling it. Don't fix anything yet, show me the list first.",
    "why": "A security pass in a fresh subagent context doesn't inherit the reasoning that produced the code, which is the whole reason it catches anything.",
    "requires": [
      "subagent"
    ],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-q-logging",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "onboarding",
    "section": "Ask codebase questions",
    "title": "How does logging work?",
    "prompt": "How does logging work?",
    "template": "How does logging work here?\n\nIf this codebase has no logging at all, say so and stop. Don't infer a convention from one stray print statement, and don't suggest one unless I ask.\n\nCover:\n- The library, where it's configured, and how a logger is obtained in a normal file\n- The levels in use, and what the team appears to mean by each\n- Structured fields that are expected on every line: <request id, user id, environment>\n- Where logs go in <development> and in <production>\n- What must never be logged here: secrets, tokens, PII\n\nShow me two real examples from the codebase, one routine and one error path, and quote them.\n\nFinish with the exact line I should write to log <an error in a new request handler>, matching local convention. If the codebase does this inconsistently, say which pattern is the current one.",
    "why": "The question you're really asking is what to write in the line you're about to add, so ask for that.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-q-endpoint",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "onboarding",
    "section": "Ask codebase questions",
    "title": "How do I make a new API endpoint?",
    "prompt": "How do I make a new API endpoint?",
    "template": "How do I make a new API endpoint here?\n\nGive me the full checklist, in order:\n- Where the route file goes, and how it gets registered\n- Request validation: where schemas live and how they're wired in\n- Auth and permissions: what a route must declare, and what happens if it doesn't\n- Error handling and response shape conventions\n- Tests: which file, which patterns\n- Anything else that has to be updated: <types, client SDK, OpenAPI spec, docs>\n\nBase this on reading two or three recently added endpoints, not on general framework knowledge. Name the one you consider the best example to copy. If this codebase has no HTTP layer, or too few endpoints to show a convention, say so and stop rather than describing how the framework does it in general.\n\nThen walk me through it concretely for <POST /widgets>. Don't write the code yet, show me the steps and the files first.",
    "why": "Every codebase has an unwritten checklist for adding a route, and asking for it as steps is how you get the whole thing.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-q-syntax",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "onboarding",
    "section": "Ask codebase questions",
    "title": "Ask about a specific line",
    "prompt": "What does `async move { ... }` do on line 134 of `foo.rs`?",
    "template": "What does <`async move { ... }`> do on line <134> of <`foo.rs`>?\n\nExplain in two parts:\n1. The language feature itself, briefly, and what it changes about <ownership and lifetimes> here\n2. Why it's needed on this specific line: what breaks if you drop <`move`>, and what is being captured\n\nAlso tell me:\n- What the surrounding code is doing that makes this necessary\n- Whether the same pattern is used elsewhere in this file, and consistently\n- The simpler thing that would not work, and why\n\nQuote the lines you're referring to. If the answer depends on a type defined elsewhere, go and read it rather than assuming. Read only.",
    "why": "You can look up the language feature anywhere. What you can't look up is why it's needed on that particular line.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-q-edge-cases",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "onboarding",
    "section": "Ask codebase questions",
    "title": "Ask what edge cases a class handles",
    "prompt": "What edge cases does `CustomerOnboardingFlowImpl` handle?",
    "template": "What edge cases does <`CustomerOnboardingFlowImpl`> handle?\n\nFor each one:\n- The condition being handled\n- Where in the code it's handled, quoted\n- What happens when it triggers: <error, retry, silent default>\n\nThen, separately, the more useful half: which edge cases does it appear NOT to handle? Read the callers to see what inputs actually reach it, and check <null, empty, duplicate, concurrent and out-of-order> arrivals.\n\nFlag anything handled inconsistently across the different paths through this code.\n\nRank the gaps by what would actually happen in production. Where you're unsure whether something is deliberate, say so rather than listing it as a bug. Read only, don't change anything.",
    "why": "The handled cases are visible in the code. The unhandled ones are what you actually needed to know.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-q-why",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "onboarding",
    "section": "Ask codebase questions",
    "title": "Ask why one call was chosen over another",
    "prompt": "Why does this code call `foo()` instead of `bar()` on line 333?",
    "template": "Why does this code call <`foo()`> instead of <`bar()`> on line <333> of <the file>?\n\nWork it out rather than rationalising it:\n- What each function actually does differently, having read both\n- What in the surrounding context makes the difference matter here\n- What the git history and commit messages say about this line, and about when it changed\n- Whether the other call site convention in this file agrees\n\nThen tell me plainly which it is:\n- A deliberate decision, and what would break if I swapped it\n- An accident or a leftover, and safe to change\n- Or you can't tell from the available evidence\n\nDon't invent a justification for it. \"No reason I can find\" is a valid and useful answer. Read only.",
    "why": "Asking why forces it to find the reason or admit there isn't one, and both answers are useful before you change the line.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-interview",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "planning",
    "section": "Let Claude interview you",
    "title": "Have Claude interview you into a spec",
    "prompt": "I want to build [brief description]. Interview me in detail using the AskUserQuestion tool.\n\nAsk about technical implementation, UI/UX, edge cases, concerns, and tradeoffs. Don't ask obvious questions, dig into the hard parts I might not have considered.\n\nKeep interviewing until we've covered everything, then write a complete spec to SPEC.md.",
    "template": "I want to build <one sentence on what you're building>.\n\nInterview me in detail before we write anything. Ask about technical implementation, UI and UX, edge cases, failure modes, and the trade-offs I haven't considered. Skip the obvious questions, dig into the parts I'm most likely to have got wrong.\n\nAsk one thing at a time and let my answer shape the next question. Keep going until there's nothing important unresolved, then tell me what you'd still call uncertain.\n\nFinally, write a complete spec to SPEC.md. It should:\n- Name the files and interfaces involved\n- State what is explicitly out of scope\n- End with an end-to-end verification step that proves the feature works\n\nDon't write implementation code. The spec is the deliverable.",
    "why": "You get asked about the parts you hadn't thought about yet, which is the whole point of writing a spec before code.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cc-undo",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "context-management",
    "section": "Course-correct early and often",
    "title": "Revert the last change",
    "prompt": "Undo that",
    "template": "Undo that.\n\nSpecifically, revert <the last change to src/api/routes.ts>, back to the state before your last edit.\n\nThen show me:\n- Which files you reverted, and which you couldn't\n- `git diff` for those files, so I can see the current state myself\n\nBe explicit about what is not covered: anything you did through the shell (file writes, moves, deletes, installs, migrations) and anything changed outside this session isn't checkpointed and won't be restored by this. List anything in that category that you ran, so I can undo it by hand.\n\nDon't redo the work or attempt a corrected version. Stop after reverting and wait for me.",
    "why": "Only edits made through the file tools are checkpointed: anything done via Bash, or by another process, is not coming back, so undo early and verify rather than trusting it.",
    "requires": [],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-compact-focus",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "context-management",
    "section": "Manage context aggressively",
    "title": "Compact with a focus",
    "prompt": "/compact Focus on the API changes",
    "template": "/compact Focus on <the API changes>.\n\nKeep, in full:\n- <The endpoints we changed and the new request and response shapes>\n- The decisions we made and the reasons, especially the ones we argued about\n- Every file we modified, by path\n- The test and build commands we've been running, verbatim\n- What's still unfinished, and what I asked for next\n\nDrop:\n- <The exploration of the old auth code>\n- Tool output we already acted on, and anything we tried and abandoned\n\nAfter compacting, tell me in a few lines what you kept and what you dropped, so I can correct you before we carry on rather than discovering the gap later.",
    "why": "Compaction without a focus keeps a fair summary of everything, which is rarely what you need next.",
    "requires": [
      "slash-command"
    ],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-compact-rule",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "context-management",
    "section": "Manage context aggressively",
    "title": "Customize what survives compaction",
    "prompt": "When compacting, always preserve the full list of modified files and any test commands",
    "template": "## Context management\n\nWhen compacting, always preserve:\n- The full list of modified files, by path, including ones already committed\n- Any test, lint or build commands used in this session, verbatim\n- <The current task and the acceptance criteria I stated for it>\n- <Decisions made and rejected, with the reason>\n- <Anything I explicitly asked you not to do>\n\nSafe to drop:\n- <Tool output that has already been acted on>\n- <File contents that can be re-read on demand>\n\nAfter compacting, state in two or three lines what was preserved and what was dropped.",
    "why": "This is not a message you send once, it belongs in CLAUDE.md so every future compaction in this repo obeys it without being asked.",
    "requires": [
      "save-to-file"
    ],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-subagents-shorthand",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "subagents",
    "section": "Use subagents for investigation",
    "title": "Delegate research, shorthand",
    "prompt": "use subagents to investigate X",
    "template": "Use subagents to investigate <X: the thing you want understood, in one line>.\n\nWhere to look: <the directories, files or history most likely to hold the answer>\n\nReport back only:\n- A short summary of how it works\n- The specific files and functions involved\n- What already exists that I'd otherwise rebuild\n- The open questions you couldn't resolve\n\nKeep the file reads in the subagent context. I want the conclusions, not the transcript.\n\nRead only. Where the answer is uncertain, say so rather than guessing.",
    "why": "This one is deliberately schematic: name the thing, name the places to look, name what comes back, and it works for anything.",
    "requires": [
      "subagent"
    ],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-subagents-auth",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "subagents",
    "section": "Use subagents for investigation",
    "title": "Delegate research with reuse in mind",
    "prompt": "Use subagents to investigate how our authentication system handles token\nrefresh, and whether we have any existing OAuth utilities I should reuse.",
    "template": "Use subagents to investigate how <our authentication system handles token refresh>, and whether we already have <OAuth utilities> I should reuse.\n\nHave them read widely, but report back only:\n- How it currently works, in a short summary\n- The specific files and functions involved\n- What already exists that I'd otherwise rebuild\n- Anything that looks like a trap for someone changing this\n\nKeep the file reads in the subagent context. I want the findings, not the transcript.",
    "why": "The point is what comes back, not what gets read. Saying so keeps the file reads out of your context.",
    "requires": [
      "subagent"
    ],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-headless-explain",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "automation",
    "section": "Run non-interactive mode",
    "title": "One-off query",
    "prompt": "Explain what this project does",
    "shell": "claude -p \"Explain what this project does\"",
    "template": "Explain what this project does.\n\nI'm reading this in a terminal, so keep it tight:\n- One sentence on what the project is\n- What it does, in <5> bullets\n- The entry point I'd open first, and why\n- The one thing that would surprise someone new here\n\nUnder <200> words, plain prose and bullets, no headings and no code blocks.\n\nRead the README, the package manifest and the top-level layout. Where the README and the code disagree, go with the code and say so. If you can't tell what this is, say that rather than guessing from the directory name.",
    "why": "Plain text output is for a human reading a terminal, so ask for something short enough to actually read there.",
    "requires": [
      "shell"
    ],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-headless-json",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "automation",
    "section": "Run non-interactive mode",
    "title": "Structured output for scripts",
    "prompt": "List all API endpoints",
    "shell": "claude -p \"List all API endpoints\" --output-format json",
    "template": "List all API endpoints.\n\nReturn a JSON array. Each element must have exactly these keys:\n- \"method\": the HTTP verb, uppercase\n- \"path\": the route as declared, params included\n- \"file\": path relative to the repo root\n- \"line\": line number\n- \"auth\": the middleware or guard protecting it, or null\n\nRules:\n- Output the array and nothing else. No prose, no markdown fence, no trailing commentary.\n- Sort by path, then method.\n- Where a route is registered dynamically and you can't resolve it statically, include it with \"path\" set to the expression and add \"dynamic\": true.\n- If you find none, return [].",
    "why": "With --output-format json a script is parsing the result, so the schema has to be in the prompt or you'll be regexing prose.",
    "requires": [
      "shell"
    ],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-headless-stream",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "automation",
    "section": "Run non-interactive mode",
    "title": "Streaming for real-time processing",
    "prompt": "Analyze this log file",
    "shell": "claude -p \"Analyze this log file\" --output-format stream-json --verbose",
    "template": "Analyze this log file: <path/to/app.log>.\n\nI'm consuming this as it streams, so emit findings incrementally:\n- Work through the file in order and report each finding as you reach it, one self-contained line at a time\n- Each line: timestamp, severity, the error class, and the count so far\n- Don't hold everything back for a summary at the end\n\nFlag as you go:\n- <Repeated errors, stack traces, and any gap in timestamps longer than a minute>\n- The first occurrence of each distinct error, since that's usually the cause\n\nEnd with a short summary of the top <5> issues by frequency. If the file is missing, truncated or unparseable, say so on the first line rather than at the end.",
    "why": "Streaming exists so a downstream consumer can act before the run finishes, which only pays off if the output arrives in usable units.",
    "requires": [
      "shell"
    ],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-writer",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "review",
    "section": "Run multiple Claude sessions",
    "title": "Writer/Reviewer: session A implements",
    "prompt": "Implement a rate limiter for our API endpoints",
    "template": "Implement <a rate limiter for our API endpoints>.\n\nRequirements:\n- <Per-key limits, configurable window, and a clear 429 response with Retry-After>\n- Follow the patterns already in <src/middleware/>. Read a couple of the existing files first.\n- Use only libraries already in the codebase unless you ask me first\n\nAs you go:\n- Write tests, including <the boundary case at exactly the limit and concurrent requests>\n- Run the suite and show me the output\n\nWhen you're done, write down the decisions you made and the trade-offs you rejected, plus anything you're unsure about. I'm going to hand the code to a second session that hasn't seen this conversation, so it needs to stand on its own.\n\nIf this repo has no test runner, stop and tell me before installing one or writing a harness.",
    "why": "This is session A, and its job is to leave behind something a fresh reviewer can judge without you having to explain it.",
    "requires": [
      "second-session"
    ],
    "worksIn": [
      "claude-code"
    ],
    "sequence": "writer-reviewer",
    "step": 1
  },
  {
    "id": "cc-reviewer",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "review",
    "section": "Run multiple Claude sessions",
    "title": "Writer/Reviewer: session B reviews in fresh context",
    "prompt": "Review the rate limiter implementation in @src/middleware/rateLimiter.ts. Look for edge cases, race conditions, and consistency with our existing middleware patterns.",
    "template": "Review <src/middleware/rateLimiter.ts>.\n\nYou haven't seen the reasoning that produced this code. Evaluate it on its own terms.\n\nLook for:\n- Edge cases and boundary conditions that aren't handled\n- Race conditions and concurrency issues\n- Inconsistency with the patterns in <the rest of our middleware>\n- Error paths that fail silently or lose information\n\nFor each finding: quote the line, say what input or sequence triggers it, and what the consequence is. Rank by severity.\n\nWhere you're unsure whether something is a real bug, say so explicitly rather than padding the list.",
    "why": "Reviewing in the session that wrote the code inherits its assumptions. A fresh context is the entire technique.",
    "requires": [
      "second-session"
    ],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "writer-reviewer",
    "step": 2
  },
  {
    "id": "cc-feedback-loop",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "review",
    "section": "Run multiple Claude sessions",
    "title": "Writer/Reviewer: feed the review back",
    "prompt": "Here's the review feedback: [Session B output]. Address these issues.",
    "template": "Here's the review feedback from a session that hasn't seen our conversation:\n\n<paste session B's output here>\n\nWork through it in this order:\n1. Sort every point into: real and worth fixing, real but out of scope, or wrong. Say which, in one line each, before changing anything.\n2. For anything you think is wrong, say why, with the code that shows it. Don't just accept a finding because a reviewer made it.\n3. Fix the first category. For each fix, add or extend a test that would have caught it.\n4. Run the full suite and show me the output.\n\nDon't rewrite anything the review didn't raise. Finish with a list of what you fixed, what you're pushing back on, and what you'd want the reviewer to look at again.\n\nIf this repo has no test runner, stop and tell me before installing one or writing a harness.",
    "why": "The writer session will defend its own work by default, so the value is in making it triage the review rather than obey it.",
    "requires": [
      "second-session"
    ],
    "worksIn": [
      "claude-code"
    ],
    "sequence": "writer-reviewer",
    "step": 3
  },
  {
    "id": "cc-fanout-list",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "scale",
    "section": "Fan out across files",
    "title": "Generate the task list first",
    "prompt": "list all 2,000 Python files that need migrating and save the list to files.txt",
    "template": "List all <Python files that need migrating> and save the list to <files.txt>.\n\nInclusion rules:\n- <Files under src/ that import the legacy module>\n- Exclude <tests, generated files, vendored code, and anything under migrations/>\n- One path per line, relative to the repo root, no other text in the file\n\nSort by <smallest first>, so the early runs are the cheap ones.\n\nThen report back, separately from the file:\n- The total count\n- <5 to 10> files you'd call risky or unusual, and why\n- Anything you weren't sure whether to include\n\nDon't migrate anything yet. I want to read the list and check the count is plausible before it gets fed into a loop. If nothing matches the rules, write an empty file and tell me the count is zero rather than loosening them to find something.",
    "why": "The list is a real artefact: it makes the batch resumable, reviewable, and countable before you spend anything running it.",
    "requires": [],
    "worksIn": [
      "claude-code"
    ],
    "sequence": "fan-out",
    "step": 1
  },
  {
    "id": "cc-fanout-migrate",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "scale",
    "section": "Fan out across files",
    "title": "The per-file fan-out prompt",
    "prompt": "Migrate $file from React to Vue. Return OK or FAIL.",
    "shell": "for file in $(cat files.txt); do\n  claude -p \"Migrate $file from React to Vue. Return OK or FAIL.\" \\\n    --allowedTools \"Edit,Bash(git commit *)\"\ndone",
    "template": "Migrate $file from <React to Vue>. Return OK or FAIL.\n\nRules for each run:\n- Touch only $file and <its co-located test and style files>. Nothing else.\n- Preserve behaviour exactly. Don't take the opportunity to improve anything.\n- Follow the pattern in <src/components/Example.vue>\n- <Commit with the message \"migrate: $file\">\n\nOutput format, and nothing else:\n- `OK <path>` if it migrated and <the build passes for that file>\n- `FAIL <path>: <one-line reason>` if anything is unclear, unusual, or fails\n\nWhen in doubt, FAIL. A skipped file I can retry is much cheaper than a silently broken one. If $file doesn't exist or is empty, print `FAIL` with that as the reason and stop, don't go looking for something else to migrate.",
    "why": "This prompt only makes sense inside the shell loop, where $file is substituted per iteration: run it interactively and $file is just an empty string.",
    "requires": [
      "shell"
    ],
    "worksIn": [
      "claude-code"
    ],
    "sequence": "fan-out",
    "step": 2
  },
  {
    "id": "cc-auto-lint",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "scale",
    "section": "Run autonomously with auto mode",
    "title": "Autonomous run with background safety checks",
    "prompt": "fix all lint errors",
    "shell": "claude --permission-mode auto -p \"fix all lint errors\"",
    "template": "Fix all lint errors.\n\nIf this repo has no linter configured, stop and report that. Don't pick one, install one, or invent a style to enforce.\n\nScope:\n- <src/ only>. Don't touch <config, generated files, or anything under vendor/>\n- Fix <errors>. Leave <warnings> alone.\n- Prefer <the autofixer> first, then handle what's left by hand\n\nHard limits:\n- Never silence a rule to make it pass: no <eslint-disable>, no rule downgrades, no config edits\n- Don't change behaviour to satisfy a linter. If the only fix is a real code change, skip that file and list it.\n- Don't commit, push, or install anything\n\nWhen you're done, run the full test suite and the linter again, and report: files changed, errors fixed, errors skipped with the reason for each, and whether the tests still pass.\n\nIf this repo has no test runner, stop and tell me before installing one or writing a harness.",
    "why": "Auto mode removes the prompts, not the need for boundaries: whatever you would have said no to has to be written down first.",
    "requires": [
      "shell"
    ],
    "worksIn": [
      "claude-code"
    ]
  },
  {
    "id": "cc-adversarial-review",
    "page": "cc-best-practices",
    "tool": "claude-code",
    "category": "review",
    "section": "Add an adversarial review step",
    "title": "Review the diff against the plan",
    "prompt": "Use a subagent to review the rate limiter diff against PLAN.md. Check that\nevery requirement is implemented, the listed edge cases have tests, and\nnothing outside the task's scope changed. Report gaps, not style preferences.",
    "template": "Review <the rate limiter diff> against <PLAN.md>, in a fresh context.\n\nIf <PLAN.md> does not exist or you cannot read it, stop and tell me. Do not review against an inferred plan, and do not report an all-clear you could not verify.\n\nCheck that:\n- Every requirement in the plan is actually implemented, not just started\n- The edge cases the plan lists have tests that would fail if the behaviour regressed\n- Nothing outside the stated scope changed\n- The tests exercise real behaviour rather than asserting on mocks\n\nReport gaps that affect correctness or the stated requirements.\n\nDon't report style preferences, naming opinions, or suggestions for extra abstraction. I'll treat those as noise. If the work is sound, say so plainly rather than finding something to report.",
    "why": "A reviewer told to find gaps will always find some. Telling it to report only what affects correctness is what keeps the output actionable.",
    "requires": [
      "second-session"
    ],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cx-explain-flow",
    "page": "cx-prompting",
    "tool": "codex",
    "category": "onboarding",
    "section": "Explain a codebase",
    "title": "Explain the request flow, with gotchas",
    "prompt": "Explain how the request flows through the selected code.\n\nInclude:\n- a short summary of the responsibilities of each module involved\n- what data is validated and where\n- one or two \"gotchas\" to watch for when changing this",
    "template": "Explain how <a request> flows through <the selected code, or @path/to/file>.\n\nInclude:\n- A short summary of what each module involved is responsible for\n- What data is validated, and exactly where\n- Where errors are caught, and what happens to them\n- One or two gotchas to watch for when changing this\n\nThen give me the flow as a numbered list of steps, and list the files involved in order.\n\nRead the code rather than inferring from names. If part of the path is dynamic and you can't follow it statically, say so instead of filling the gap.",
    "why": "Naming the output shape up front is what turns a wandering explanation into something you can act on.",
    "requires": [
      "selection"
    ],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cx-numbered-flow",
    "page": "cx-prompting",
    "tool": "codex",
    "category": "onboarding",
    "section": "Explain a codebase",
    "title": "Ask for a numbered flow plus the files",
    "prompt": "Summarize the request flow as a numbered list of steps. Then list the files involved.",
    "template": "Now reshape that explanation into something I can work from.\n\nOutputs:\n- The <request> flow as a numbered list of steps, in execution order, one step per hop\n- For each step: the file and the function that handles it\n- Then a flat list of every file involved, in the order it is reached\n\nInclude:\n- The commands or searches you ran to confirm the ordering\n- Any step you inferred rather than read, marked as inferred\n\nConstraints:\n- Do not re-explain the architecture. I have that from your last answer.\n- No prose paragraphs between the steps. Keep each step to one line.\n- Do not change any files.\n\nIf the explanation you are reshaping isn't in this conversation, stop and tell me rather than tracing the flow again from scratch.",
    "why": "Reshaping an explanation you already have into a numbered list plus a file list turns prose you skim into a checklist you can work from.",
    "requires": [
      "prior-turn"
    ],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cx-protocol",
    "page": "cx-prompting",
    "tool": "codex",
    "category": "onboarding",
    "section": "Explain a codebase",
    "title": "Understand a service protocol from named files",
    "prompt": "I need to understand the protocol used by this service. Read @foo.ts @schema.ts and explain the schema and request/response flow. Focus on required vs optional fields and backward compatibility rules.",
    "template": "I need to understand the protocol used by <this service>.\n\nRead <@foo.ts> and <@schema.ts>, then explain:\n- The schema, field by field, including which fields are required and which are optional\n- The request/response flow\n- The backward-compatibility rules: what's safe to add, what isn't, what's versioned\n\nCall out:\n- Anywhere the code and the schema disagree\n- Anywhere a field is documented as optional but treated as required in practice\n- Anything that would silently break an older client",
    "why": "Asking where the code and the schema disagree is what turns a summary into a finding.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cx-bug-repro",
    "page": "cx-prompting",
    "tool": "codex",
    "category": "debugging",
    "section": "Fix a bug",
    "title": "Bug report with repro steps and constraints",
    "prompt": "Bug: Clicking \"Save\" on the settings screen sometimes shows \"Saved\" but doesn't persist the change.\n\nRepro:\n1) Start the app: npm run dev\n2) Go to /settings\n3) Toggle \"Enable alerts\"\n4) Click Save\n5) Refresh the page: the toggle resets\n\nConstraints:\n- Do not change the API shape.\n- Keep the fix minimal and add a regression test if feasible.\n\nStart by reproducing the bug locally, then propose a patch and run checks.",
    "template": "Bug: <clicking \"Save\" on the settings screen sometimes shows \"Saved\" but doesn't persist the change>.\n\nRepro:\n1) <Start the app: npm run dev>\n2) <Go to /settings>\n3) <Toggle \"Enable alerts\">\n4) <Click Save>\n5) <Refresh the page: the toggle resets>\n\nFrequency: <intermittent, roughly one in three attempts>\nExpected: <the toggle stays on after a refresh>\n\nConstraints:\n- Do not change the API shape.\n- Keep the fix minimal, and add a regression test if feasible.\n- <Don't touch anything outside src/settings/>\n\nWork in this order:\n1. Reproduce the bug locally and confirm you've seen it fail\n2. Tell me the root cause in one sentence before patching\n3. Propose the patch\n4. Run the smallest relevant checks this repo defines, and report the commands and their results\n\nIf you cannot reproduce the bug, stop and tell me what you tried rather than patching the code you suspect.\n\nIf this repo has no test runner or no linter, say so and skip that check rather than installing one or writing a harness.",
    "why": "The best-structured prompt the three vendors published. Situation, evidence, guardrails, and the order of work, all declared.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "cx-bugfix",
    "step": 1
  },
  {
    "id": "cx-post-fix-checks",
    "page": "cx-prompting",
    "tool": "codex",
    "category": "verification",
    "section": "Fix a bug",
    "title": "Run the smallest relevant checks and report them",
    "prompt": "After the fix, run lint + the smallest relevant test suite. Report the commands and results.",
    "template": "Now that the fix is in, verify it.\n\nRun:\n- <the lint or format check this repo defines>\n- The smallest test suite that covers <the code you just changed>, not the full suite\n- <the regression test you added>\n\nReport:\n- Each command exactly as you ran it\n- Its exit status and the relevant lines of output, pasted, not summarised\n- Anything you could not run, and why\n\nConstraints:\n- Do not edit tests or config to make a command pass. If something fails, show me the failure.\n- Do not widen the scope of the fix while you are here.\n\nIf any check fails, stop and tell me before attempting another change.\n\nIf this repo has no test runner or no linter, say so and skip that check rather than installing one or writing a harness.",
    "why": "Asking for the commands and their output is what separates a fix that was verified from one that was merely asserted.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "cx-bugfix",
    "step": 2
  },
  {
    "id": "cx-verify-in-ui",
    "page": "cx-prompting",
    "tool": "codex",
    "category": "verification",
    "section": "Fix a bug",
    "title": "Ask how to verify the fix yourself",
    "prompt": "Find the bug causing \"Saved\" to show without persisting changes. After proposing the fix, tell me how to verify it in the UI.",
    "template": "Before I accept the fix, tell me how to verify it myself in the UI.\n\nInclude:\n- The command to start the app, and the exact URL or route to open\n- The click-by-click steps to reproduce <the original \"Saved\" without persisting> case\n- What I should see now, and what I would have seen before the fix\n- One negative check: something that should still work and that this change could plausibly have broken\n\nAlso tell me:\n- Any state I need to reset first, such as <a stale session, a seeded record or a cached build>\n- Which part of the behaviour you confirmed yourself, and which part only I can confirm\n\nDo not tell me to just check the tests pass. I want the manual path.\n\nIf this change has no user-visible surface, say so and give me the smallest manual check that does exist instead of inventing a screen.\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself.",
    "why": "The agent can prove the code changed, only you can prove the bug is gone, so ask for the steps that let you check by hand.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "cx-bugfix",
    "step": 3
  },
  {
    "id": "cx-unit-test",
    "page": "cx-prompting",
    "tool": "codex",
    "category": "testing",
    "section": "Write tests",
    "title": "Write a test that follows existing conventions",
    "prompt": "Write a unit test for this function. Follow conventions used in other tests.",
    "template": "Write a unit test for the selected function.\n\nInclude:\n- The happy path\n- <the boundary cases: empty, null, and the largest realistic input>\n- Any error the function is meant to raise\n\nConstraints:\n- Follow the conventions used in other tests in <tests/>. Read two of them first: same framework, same file location, same naming, same assertion style.\n- Do not add a test framework, helper library or fixture system that this repo does not already use.\n- One behaviour per test, named so the failure message is readable without opening the file.\n\nOutputs:\n- The test file\n- The command you ran and its output\n- Any case you chose not to cover, and why\n\nIf this repo has no existing tests to copy from, say so and tell me what you fell back on. If it has no test runner at all, stop and tell me before installing one.",
    "why": "A test written to the codebase's own conventions gets reviewed and kept, one written in a foreign style gets rewritten.",
    "requires": [
      "selection"
    ],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cx-test-edges",
    "page": "cx-prompting",
    "tool": "codex",
    "category": "testing",
    "section": "Write tests",
    "title": "Cover the happy path plus edge cases",
    "prompt": "Add a test for the invert_list function in @transform.ts. Cover the happy path plus edge cases.",
    "template": "Add tests for <the invert_list function in @transform.ts>.\n\nCover:\n- The happy path\n- <Empty input, a single element, and the largest realistic input>\n- <Invalid or unexpected types>\n- Any edge case you spot while reading the implementation that I haven't listed\n\nFollow the conventions in <the existing tests>: same framework, same structure, same naming. If there are no existing tests to copy from, say so and tell me what you fell back on.\n\nWhere the current behaviour on an edge case looks like a bug rather than a decision, tell me instead of writing a test that locks it in.\n\nRun the tests and show me the output.\n\nIf this repo has no test runner, stop and tell me before installing one or writing a harness.",
    "why": "Without the last instruction, an agent writing tests against buggy behaviour will happily lock the bug in.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cx-dashboard-image",
    "page": "cx-prompting",
    "tool": "codex",
    "category": "images",
    "section": "Prototype from a screenshot",
    "title": "Build from an image with stack constraints and outputs",
    "prompt": "Create a new dashboard based on this image.\n\nConstraints:\n- Use react, vite, and tailwind. Write the code in typescript.\n- Match spacing, typography, and layout as closely as possible.\n\nOutputs:\n- A new route/page that renders the UI\n- Any small components needed\n- README.md with instructions to run it locally",
    "template": "Create <a new dashboard> based on this image.\n\nConstraints:\n- Use <react, vite and tailwind>. Write the code in <typescript>.\n- Match spacing, typography and layout as closely as possible.\n- <Use our existing components where they fit rather than building new ones.>\n\nOutputs:\n- A new <route/page> that renders the UI\n- Any small components needed\n- README.md with instructions to run it locally\n\nWhen you're done, start the dev server and tell me the URL to view it. Then list anything in the image you couldn't match, and why.",
    "why": "Declaring the outputs is what gets you a runnable thing rather than a component with no way in.",
    "requires": [
      "image-attached"
    ],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "cx-prototype",
    "step": 1
  },
  {
    "id": "cx-dev-server",
    "page": "cx-prompting",
    "tool": "codex",
    "category": "verification",
    "section": "Prototype from a screenshot",
    "title": "Ask for the local URL to view it",
    "prompt": "Start the dev server and tell me the local URL/route to view the prototype.",
    "template": "Now start the dev server so I can look at what you built.\n\nOutputs:\n- The exact command you ran to start it\n- The local URL, including the port and the specific route for the prototype, not just the site root\n- Any environment variable or config the server needed to boot\n\nInclude:\n- The first lines of server output, so I can see it actually came up\n- Any warnings or build errors it printed, even if the page still renders\n\nConstraints:\n- Do not kill or restart a server that is already running on <that port>. Tell me instead.\n- Do not change the app's code to get it booting. If something blocks startup, report it and stop.\n\nIf this project has no dev server, say so and tell me how else to open what you built.\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself.",
    "why": "A prototype you cannot open is not a prototype, so make handing you a working URL part of the job.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "cx-prototype",
    "step": 2
  },
  {
    "id": "cx-settings-screenshot",
    "page": "cx-prompting",
    "tool": "codex",
    "category": "images",
    "section": "Prototype from a screenshot",
    "title": "Match a screenshot and the project's own patterns",
    "prompt": "Create a new settings page. Use the attached screenshot as the target UI.\nFollow design and visual patterns from other files in this project.",
    "template": "Create <a new settings page>. Use the attached screenshot as the target UI.\n\nConstraints:\n- Follow the design and visual patterns already in this project. Read <two or three neighbouring pages and the shared component directory> before writing anything.\n- Use existing components, tokens and spacing scales where they fit. Do not introduce a new styling approach or a new UI library.\n- Where the screenshot and the project's own patterns conflict, follow the project and tell me where you did.\n\nOutputs:\n- The new <route/page> and any components it needs\n- A list of the existing files you copied patterns from\n- Anything in the screenshot you could not match, and why",
    "why": "A screenshot gives the target, the project gives the house style, and saying so stops you getting a pixel-perfect page that looks nothing like the rest of the app.",
    "requires": [
      "image-attached"
    ],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cx-styling-options",
    "page": "cx-prompting",
    "tool": "codex",
    "category": "images",
    "section": "Iterate on design",
    "title": "Ask for a small set of options",
    "prompt": "Propose 2-3 styling improvements for the landing page.",
    "template": "Propose 2-3 styling improvements for <the landing page>.\n\nFor each option, include:\n- A name and one sentence on the idea\n- What specifically changes: <typography, spacing, colour, hierarchy>\n- Which files and components it would touch\n- The risk or trade-off, including anything it could break on <mobile>\n\nConstraints:\n- Read the page and its styles first. Base the options on what is actually there, not on generic design advice.\n- Stay within the existing design tokens and component set.\n- Do not change any files yet. I will pick one.\n\nEnd with which option you would choose and why.",
    "why": "Asking for a few described options instead of one applied change gives you something to choose between before any code moves.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "cx-design-iteration",
    "step": 1
  },
  {
    "id": "cx-pick-option",
    "page": "cx-prompting",
    "tool": "codex",
    "category": "images",
    "section": "Iterate on design",
    "title": "Pick an option and scope the change",
    "prompt": "Go with option 2.\n\nChange only the header:\n- make the typography more editorial\n- increase whitespace\n- ensure it still looks good on mobile",
    "template": "Go with option 2 from the options you just gave me.\n\nChange only <the header>:\n- <make the typography more editorial>\n- <increase whitespace>\n- Ensure it still looks good on <mobile>\n\nConstraints:\n- Nothing outside <the header component and its styles> changes. Not the nav, not the hero, not shared tokens used elsewhere.\n- Use existing tokens and scales. Do not add new colours or fonts.\n- Do not apply anything from options 1 or 3.\n\nOutputs:\n- The diff, file by file\n- The breakpoints you checked, and what you did at each\n- Anything from option 2 you deliberately left out, and why\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself.",
    "why": "Choosing one of the options it just offered, and fencing the change to one component, is what keeps a styling pass from drifting across the page.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "cx-design-iteration",
    "step": 2
  },
  {
    "id": "cx-next-iteration",
    "page": "cx-prompting",
    "tool": "codex",
    "category": "images",
    "section": "Iterate on design",
    "title": "Iterate while holding the layout fixed",
    "prompt": "Next iteration: reduce visual noise.\nKeep the layout, but simplify colors and remove any redundant borders.",
    "template": "Next iteration on what you just changed: reduce visual noise.\n\nKeep the layout exactly as it is now. Within that:\n- Simplify the colour usage, <fewer distinct values, more reuse of the existing tokens>\n- Remove redundant borders, dividers and shadows where <spacing> already does the separating\n- <Reduce the number of distinct font sizes and weights>\n\nConstraints:\n- No repositioning, no resizing, no reordering. If something only works by moving an element, tell me instead of doing it.\n- Do not touch <the header work from the previous turn> beyond these noise reductions.\n- Keep contrast at or above what it was. Say so if any change lowers it.\n\nOutputs: the diff, and a short before-and-after list of what you removed.\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself.",
    "why": "Naming what stays fixed is what makes an iteration an iteration rather than a second redesign on top of the first.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "cx-design-iteration",
    "step": 3
  },
  {
    "id": "cx-plan-refactor",
    "page": "cx-prompting",
    "tool": "codex",
    "category": "planning",
    "section": "Plan a refactor",
    "title": "Plan a refactor with goals and constraints",
    "prompt": "$plan\n\nWe need to refactor the auth subsystem to:\n- split responsibilities (token parsing vs session loading vs permissions)\n- reduce circular imports\n- improve testability\n\nConstraints:\n- No user-visible behavior changes\n- Keep public APIs stable\n- Include a step-by-step migration plan",
    "template": "We need to refactor <the auth subsystem> to:\n- <split responsibilities: token parsing vs session loading vs permissions>\n- <reduce circular imports>\n- <improve testability>\n\nConstraints:\n- No user-visible behaviour changes\n- Keep public APIs stable\n- Ship it in milestones, each of which leaves the repo working and its checks passing\n\nGive me a plan with:\n- Exactly which files move or change in each milestone\n- The order, and why that order\n- A rollback strategy for each milestone\n- The check that proves each milestone landed. If this repo has no automated tests, say so and tell me what to use instead.\n- What we'd measure to know the refactor achieved its goals\n\nDon't write code yet. I'll review the plan, then ask you to implement one milestone at a time.",
    "why": "Milestones that each leave the repo working are what make a large refactor abandonable halfway through.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "cx-refactor-plan",
    "step": 1
  },
  {
    "id": "cx-revise-plan",
    "page": "cx-prompting",
    "tool": "codex",
    "category": "planning",
    "section": "Plan a refactor",
    "title": "Revise the plan before executing",
    "prompt": "Revise the plan to:\n- specify exactly which files move in each milestone\n- include a rollback strategy",
    "template": "Revise the plan you just gave me before we start.\n\nAdd to each milestone:\n- Exactly which files move, are created, or are deleted, by path\n- The order of operations within the milestone\n- A rollback strategy: what to revert, and how to tell the revert was clean\n- The check that proves the milestone landed, <the specific test command or suite>\n\nConstraints:\n- Every milestone must leave the repo working and its checks passing. If one cannot, split it.\n- If this repo has no automated tests, say so and use whatever check it does have as the proof for each milestone.\n- Keep the goals and constraints from the original plan unchanged.\n- Still no code. Plan only.\n\nAlso tell me: which milestone you are least confident about, and which files you could not confidently place because <the imports are dynamic or generated>.\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself.",
    "why": "A plan without file-level moves and a rollback is a description, not something you can start on Monday and abandon on Tuesday.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "cx-refactor-plan",
    "step": 2
  },
  {
    "id": "cx-implement-milestone",
    "page": "cx-prompting",
    "tool": "codex",
    "category": "planning",
    "section": "Plan a refactor",
    "title": "Execute one milestone at a time",
    "prompt": "Implement Milestone 1 from the plan.",
    "template": "Implement <Milestone 1> from the revised plan. Only that milestone.\n\nConstraints:\n- Move and change exactly the files the plan lists for this milestone. Nothing from Milestone 2 onwards, even if it is a one-line change while you are in the file.\n- No user-visible behaviour changes. Public APIs stay stable.\n- If the plan turns out to be wrong about a file, stop and tell me rather than improvising a different split.\n\nWhen done, report:\n- The diff, grouped by the plan's steps\n- The commands you ran to verify it and their output\n- Anything you deviated from, and why\n- Whether the repo is in a state I could ship or revert cleanly right now\n\nThen stop. I will review before <the next milestone>.",
    "why": "Executing one milestone at a time keeps every stopping point a working repo, which is the only reason milestones were worth planning.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "sequence": "cx-refactor-plan",
    "step": 3
  },
  {
    "id": "cx-review",
    "page": "cx-prompting",
    "tool": "codex",
    "category": "review",
    "section": "Review code",
    "title": "Run a review",
    "prompt": "/review",
    "template": "/review\n\nFocus on <the changes in src/payments/>.\n\nLook for: correctness bugs, unhandled errors, and anything that could lose or double-charge data.\n\nSkip: formatting, naming preferences, and suggestions to add abstraction.\n\nFor each finding give the file and line, what triggers it, and the consequence. If a category is clean, say so rather than filling it.",
    "why": "The bare command reviews everything at once, so the value is in naming the one thing you want looked at and the noise you do not want back.",
    "requires": [
      "slash-command"
    ],
    "worksIn": [
      "codex"
    ]
  },
  {
    "id": "cx-review-focus",
    "page": "cx-prompting",
    "tool": "codex",
    "category": "review",
    "section": "Review code",
    "title": "Run a focused review",
    "prompt": "/review Focus on edge cases and security issues",
    "template": "Review <the current diff>. Focus on edge cases and security issues.\n\nSpecifically:\n- Input that isn't validated before it's trusted\n- Authorisation checks that are missing or in the wrong place\n- Secrets, tokens or credentials that could be logged or committed\n- Boundary conditions: empty, null, very large, concurrent, repeated\n- Error paths that leak information or fail open\n\nFor each finding: the file and line, the input that triggers it, and the consequence. Rank by severity.\n\nWhere you find nothing in a category, say so rather than filling it.",
    "why": "Naming the categories, and asking it to say when a category is clean, is what stops a review padding itself out.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cx-review-gh",
    "page": "cx-prompting",
    "tool": "codex",
    "category": "review",
    "section": "Review code",
    "title": "Trigger a review from a pull request",
    "prompt": "@codex review",
    "template": "@codex review\n\nFocus on:\n- <the migration in db/migrations/ and every caller it affects>\n- Correctness and data loss over style\n- Whether <the new column> is handled everywhere the old shape was\n\nInclude:\n- The file and line for every finding, as an inline comment where you can\n- What input or sequence triggers it\n- Your confidence, and anything you could not check from the diff alone\n\nSkip formatting and naming opinions. If a file is clean, say so rather than finding something to say.",
    "why": "Paste this as a comment on the pull request itself, not in your terminal: it needs the Codex GitHub app installed on the repo, and it puts the findings where the discussion already is, so the whole team sees them.",
    "requires": [
      "slash-command"
    ],
    "worksIn": [
      "codex"
    ]
  },
  {
    "id": "cx-review-gh-security",
    "page": "cx-prompting",
    "tool": "codex",
    "category": "review",
    "section": "Review code",
    "title": "Trigger a security-focused PR review",
    "prompt": "@codex review for security vulnerabilities and security concerns",
    "template": "@codex review for security vulnerabilities and security concerns\n\nFocus on:\n- Input that is trusted before it is validated\n- Authorisation checks that are missing, or that run after the effect\n- Secrets, tokens or credentials that could be logged, committed or returned in a response\n- Injection paths: <SQL, shell, template, path traversal>\n- Error handling that fails open or leaks internals to the client\n\nFor each finding: file and line, the input that triggers it, the impact, and how confident you are.\n\nDo not report dependency-scanner noise or style issues. Where a category is clean, say so explicitly.",
    "why": "Paste this as a comment on the pull request, which needs the Codex GitHub app installed on the repo: a security-scoped review there gives you a quotable record of what was checked before the merge.",
    "requires": [
      "slash-command"
    ],
    "worksIn": [
      "codex"
    ]
  },
  {
    "id": "cx-docs-update",
    "page": "cx-prompting",
    "tool": "codex",
    "category": "documentation",
    "section": "Update documentation",
    "title": "Update docs and validate the links",
    "prompt": "Update the \"advanced features\" documentation to provide authentication troubleshooting guidance. Verify that all links are valid.",
    "template": "Update <the \"advanced features\" documentation> to <provide authentication troubleshooting guidance>.\n\nInclude:\n- <The three or four failures users actually hit, and what each looks like>\n- The fix for each, with the exact commands or config\n- How to tell which one you're hitting\n\nMatch the voice and structure of the surrounding docs. Read a couple of neighbouring pages first.\n\nThen check every link in the page you changed by resolving it: for an internal link, open the target path. List any that are broken. Where a link points somewhere you can't reach, list it as unverified rather than calling it valid.\n\nDon't document behaviour you haven't confirmed in the code.",
    "why": "The last line is the one that matters: documenting behaviour nobody confirmed is how docs start lying.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cx-agents-global",
    "page": "cx-agents-md",
    "tool": "codex",
    "category": "config",
    "kind": "config",
    "section": "Custom instructions with AGENTS.md",
    "title": "Global working agreements",
    "cap": "~/.codex/AGENTS.md",
    "code": "## Working agreements\n\n- Always run `npm test` after modifying JavaScript files.\n- Prefer `pnpm` when installing dependencies.\n- Ask for confirmation before adding new production dependencies.",
    "template": "# Global working agreements\n\nThese apply to every repo I work in. Repo-specific rules live in that repo's AGENTS.md.\n\n## Tooling\n\n- Prefer `<pnpm>` when installing dependencies. Fall back to whatever the repo's lockfile implies.\n- Use `<rg>` for search rather than `grep -r`.\n- Run `<npm test>` after modifying JavaScript files, unless the repo defines its own test command.\n\n## Workflow\n\n- Ask before adding a new production dependency. Dev dependencies are fine.\n- Never commit to <main>. Create a branch first.\n- Show me the commands you ran and their output, not a summary of them.\n- When you are unsure between two approaches, stop and ask. Do not pick one and note it at the end.\n\n## Boundaries\n\n- Never rewrite git history on a pushed branch.\n- Never edit generated files, lockfiles or anything under `<dist/>`.\n- Do not force-push, ever.",
    "why": "The global file at ~/.codex/AGENTS.md is for how you work everywhere, your tools and your habits, so keep anything repo-specific out of it or it will be wrong in half your projects.",
    "requires": [
      "save-to-file"
    ],
    "worksIn": [
      "codex"
    ]
  },
  {
    "id": "cx-agents-repo",
    "page": "cx-agents-md",
    "tool": "codex",
    "category": "config",
    "kind": "config",
    "section": "Custom instructions with AGENTS.md",
    "title": "Repository-level expectations",
    "cap": "AGENTS.md",
    "code": "## Repository expectations\n\n- Run `npm run lint` before opening a pull request.\n- Document public utilities in `docs/` when you change behavior.",
    "template": "# Repository expectations\n\n## Commands\n\n- `<npm run lint>`: lint. Run it before opening a pull request.\n- `<npm run typecheck>`: typecheck. Run after a series of edits.\n- `<npm test -- path/to/file>`: run one test file. Prefer this over the full suite.\n- `<npm run db:migrate>`: apply migrations locally.\n\n## Code style\n\n- <ES modules only. No CommonJS `require`.>\n- <Named exports only. No default exports.>\n- See `<src/components/Button.tsx>` for the canonical component structure.\n\n## Workflow\n\n- Document public utilities in `<docs/>` when you change their behaviour.\n- <Every API route needs a test in `tests/api/` before the PR opens.>\n\n## Boundaries\n\n- <Migrations are append-only. Add a new one, never edit an existing one.>\n- <Do not touch `src/generated/`. It is produced by `npm run codegen`.>\n- <Nested services may override these rules. Check for a nested AGENTS file before assuming.>",
    "why": "The repo root AGENTS.md is for what this codebase does differently from the default, the commands and conventions an agent cannot guess, not things any competent agent already knows.",
    "requires": [
      "save-to-file"
    ],
    "worksIn": [
      "codex"
    ]
  },
  {
    "id": "cx-agents-override",
    "page": "cx-agents-md",
    "tool": "codex",
    "category": "config",
    "kind": "config",
    "section": "Custom instructions with AGENTS.md",
    "title": "Nested directory override",
    "cap": "services/payments/AGENTS.override.md",
    "code": "## Payments service rules\n\n- Use `make test-payments` instead of `npm test`.\n- Never rotate API keys without notifying the security channel.",
    "template": "# Payments service rules\n\nThese override the repo root AGENTS.md for everything under `<services/payments/>`.\n\n## Commands, replacing the repo defaults\n\n- Use `<make test-payments>` instead of `<npm test>`. The root command does not start <the sandbox gateway> and will pass on broken code.\n- Use `<make fixtures>` to reseed. Do not hand-edit <the fixture JSON>.\n\n## Rules specific to this service\n\n- <Money is integer minor units. Never a float, never a JS number for totals.>\n- <Every external call goes through `client.ts` so it is retried and logged. No direct fetch.>\n- <Webhook handlers must be idempotent. Assume every event arrives twice.>\n\n## Boundaries\n\n- Never rotate API keys without notifying <the security channel> first.\n- <Never log a full card number, token or webhook payload, even at debug level.>\n- <Do not change the ledger schema here. That is a separate, reviewed change.>",
    "why": "A nested AGENTS.override.md is for the one directory where the repo-wide rules are actively wrong, so it should contain only the differences and the extra caution that subtree needs.",
    "requires": [
      "save-to-file"
    ],
    "worksIn": [
      "codex"
    ]
  },
  {
    "id": "cx-config-toml",
    "page": "cx-agents-md",
    "tool": "codex",
    "category": "config",
    "kind": "config",
    "section": "Custom instructions with AGENTS.md",
    "title": "Fallback instruction filenames",
    "cap": "~/.codex/config.toml",
    "code": "project_doc_fallback_filenames = [\"TEAM_GUIDE.md\", \".agents.md\"]\nproject_doc_max_bytes = 65536",
    "template": "# ~/.codex/config.toml\n# Settings for Codex itself. Instructions belong in AGENTS.md, not here.\n\n# Other filenames to treat as instruction files when a repo has no AGENTS.md.\n# Useful for repos that already standardised on their own name.\nproject_doc_fallback_filenames = [\"<TEAM_GUIDE.md>\", \"<.agents.md>\"]\n\n# Maximum bytes read from each instruction file. Anything past this is ignored\n# silently. The default is 32 KiB, so this line doubles it.\nproject_doc_max_bytes = 65536  # <raise if your AGENTS.md is long>",
    "why": "~/.codex/config.toml is settings, not instructions, so it holds the knobs that decide which instruction files Codex reads and how much of them, and nothing about how to write code.",
    "requires": [
      "save-to-file"
    ],
    "worksIn": [
      "codex"
    ]
  },
  {
    "id": "cu-mermaid",
    "page": "cu-best-practices",
    "tool": "cursor",
    "category": "planning",
    "section": "Plan before coding",
    "title": "Ask for a Mermaid diagram of a subsystem",
    "prompt": "Create a Mermaid diagram showing the data flow for our authentication system, including OAuth providers, session management, and token refresh.",
    "template": "Create a Mermaid diagram showing <the data flow for our authentication system>, including <OAuth providers, session management and token refresh>.\n\nBefore drawing it, read the actual implementation. The diagram should reflect what the code does, not what the docs claim. If you can't find that subsystem in this codebase, say so and stop rather than diagramming a typical one.\n\nRequirements:\n- Show the sequence of calls, not just which components exist\n- Mark where state is persisted, and where it expires\n- Mark the failure paths, not only the happy path\n- Keep it readable: if it needs more than about 15 nodes, split it into two diagrams\n\nSave it to <docs/auth-flow.md>, and list anything you couldn't determine from the code.",
    "why": "Diagrams drawn from filenames look right and teach nothing. Telling it to read the implementation first is the whole difference.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cu-q-logging",
    "page": "cu-best-practices",
    "tool": "cursor",
    "category": "onboarding",
    "section": "Learn the codebase",
    "title": "How does logging work in this project?",
    "prompt": "How does logging work in this project?",
    "template": "How does logging work in this project?\n\nIf this project has no logging at all, say so and stop rather than describing what it should have.\n\nAnswer as if you're onboarding me on my first day. Cover:\n- Which library or wrapper we use, and where it's configured\n- How I get a logger in <a new service file>, with a copyable line\n- The levels in use, and what each one is actually reserved for here\n- Where the output goes in <local dev> and in <production>\n- What must never be logged: tokens, PII, request bodies, whatever this codebase already redacts\n\nShow your work: cite the file and line for each answer, and quote the single best example of a correct log call in this repo.\n\nIf logging is done two different ways in different areas, say so and tell me which one is newer. Don't describe the general practice, describe this project. Read only, change nothing.",
    "why": "Onboarding by interrogation: you ask the agent the question you would have asked the last engineer who worked here, and you make it answer from the code rather than from convention.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cu-q-endpoint",
    "page": "cu-best-practices",
    "tool": "cursor",
    "category": "onboarding",
    "section": "Learn the codebase",
    "title": "How do I add a new API endpoint?",
    "prompt": "How do I add a new API endpoint?",
    "template": "How do I add a new API endpoint?\n\nDon't answer from the framework docs. Pick the most recently added endpoint in this repo, read it end to end, and derive the answer from it.\n\nIf this project has no API endpoints yet, say so and stop rather than answering from the framework's tutorial.\n\nGive me:\n1. Every file I have to create or touch, in order, with paths\n2. Where routing is registered, and whether that's manual or automatic\n3. How input validation, auth and error responses are done here\n4. What tests exist for that endpoint, and where they live\n5. Anything easy to forget: <types, OpenAPI spec, client SDK, migrations>\n\nThen walk the same checklist for a hypothetical <POST /widgets> so I can see the shape.\n\nName the endpoint you used as your model. If two conventions exist, show both and say which is current. Read only, don't write the endpoint yet.",
    "why": "Turns a vague how-do-I into a checklist derived from a real endpoint, so your first contribution matches the repo instead of the framework's tutorial.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cu-q-edge-cases",
    "page": "cu-best-practices",
    "tool": "cursor",
    "category": "onboarding",
    "section": "Learn the codebase",
    "title": "Ask what edge cases a flow handles",
    "prompt": "What edge cases does `CustomerOnboardingFlow` handle?",
    "template": "What edge cases does <CustomerOnboardingFlow> handle?\n\nIf you can't find it, say so and stop rather than guessing which code I mean.\n\nFor each one:\n- The condition being handled\n- Where in the code it's handled\n- What happens when it triggers\n\nThen, separately: which edge cases does it appear NOT to handle? Read the callers to see what inputs actually reach it.\n\nFlag anything handled inconsistently across the different paths through this code.\n\nRead only, don't change anything.",
    "why": "The second half is the valuable half. What it doesn't handle is what you actually needed to know.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cu-q-why",
    "page": "cu-best-practices",
    "tool": "cursor",
    "category": "onboarding",
    "section": "Learn the codebase",
    "title": "Ask why one call was chosen over another",
    "prompt": "Why are we calling `setUser()` instead of `createUser()` on line 1738?",
    "template": "Why are we calling <`setUser()`> instead of <`createUser()`> on <line 1738 of src/session.ts>?\n\nRead both functions before answering. Tell me:\n- What each one actually does differently: side effects, validation, what it writes\n- What would break at this call site if I swapped them\n- Whether this looks deliberate or accidental, and what evidence points either way\n\nCheck the history: `git log -L 1738,1738:<src/session.ts>` and the commit message or PR that introduced it.\n\nDo not guess from the names. If the code and the history don't explain the choice, say plainly that it looks unintentional rather than inventing a rationale. Read only.",
    "why": "Interrogating one specific decision, at one specific line, is how you find the constraint nobody wrote down.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cu-specific",
    "page": "cu-best-practices",
    "tool": "cursor",
    "category": "testing",
    "section": "Write specific prompts",
    "title": "Name the case, the pattern, the constraint",
    "weak": "add tests for auth.ts",
    "prompt": "Write a test case for auth.ts covering the logout edge case, using the patterns in __tests__/ and avoiding mocks.",
    "template": "Write tests for <auth.ts>, covering <the logout edge case>.\n\nUse the patterns in <__tests__/>: same structure, same naming, same assertion style. Read a couple of the existing tests first. If there are none to read, say so and tell me what you fell back on.\n\nConstraints:\n- Avoid mocks. If one is genuinely unavoidable, tell me why.\n- Test observable behaviour, not implementation details.\n- Name each test so the failure message explains what broke, without opening the file.\n\nAlso list any edge case around <logout> that you think needs a test but that I haven't asked for.",
    "why": "Cursor's own before/after. The named case, the pattern to follow, and the thing to avoid are all doing work.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cu-pr-command",
    "page": "cu-best-practices",
    "tool": "cursor",
    "category": "pr-git",
    "section": "Git workflows",
    "title": "A /pr command as a numbered procedure",
    "prompt": "Create a pull request for the current changes.\n\n1. Look at the staged and unstaged changes with `git diff`\n2. Write a clear commit message based on what changed\n3. Commit and push to the current branch\n4. Use `gh pr create` to open a pull request with title/description\n5. Return the PR URL when done",
    "template": "Create a pull request for the current changes.\n\n1. Look at the staged and unstaged changes with `git diff`\n2. Write a clear commit message based on what actually changed, not which files were touched\n3. Commit and push to the current branch\n4. Use `gh pr create` to open a pull request with a title and description covering what changed, why, and how to test it\n5. Return the PR URL when done\n\nIf the diff contains unrelated changes, stop and tell me before committing.\nIf the current branch is <main>, create a new branch first.",
    "why": "Numbered procedures survive being saved as a reusable command in a way prose doesn't.",
    "requires": [],
    "worksIn": [
      "claude-code",
      "codex",
      "cursor"
    ]
  },
  {
    "id": "cu-rules-example",
    "page": "cu-best-practices",
    "tool": "cursor",
    "category": "config",
    "kind": "config",
    "section": "Iterate setup gradually",
    "title": "A starter rules file",
    "cap": ".cursor/rules/",
    "code": "# Commands\n\n- `npm run build`: Build the project\n- `npm run typecheck`: Run the typechecker\n- `npm run test`: Run tests (prefer single test files for speed)\n\n# Code style\n\n- Use ES modules (import/export), not CommonJS (require)\n- Destructure imports when possible: `import { foo } from 'bar'`\n- See `components/Button.tsx` for canonical component structure\n\n# Workflow\n\n- Always typecheck after making a series of code changes\n- API routes go in `app/api/` following existing patterns",
    "template": "---\nalwaysApply: true\n---\n\n# Commands\n\n- `<npm run build>`: build the project\n- `<npm run typecheck>`: run the typechecker\n- `<npm run test>`: run tests (prefer single test files for speed)\n- `<npm run lint -- --fix>`: lint and autofix\n\n# Code style\n\n- <Use ES modules (import/export), not CommonJS (require)>\n- <Destructure imports when possible: `import { foo } from 'bar'`>\n- See `<components/Button.tsx>` for canonical component structure\n- <Named exports only, no default exports>\n\n# Workflow\n\n- API routes go in `<app/api/>` following existing patterns\n- <Never commit directly to main. Branch first.>\n\n# Boundaries\n\n- <Never edit files in `dist/` or `build/`, they're generated>\n- <Don't add a dependency without asking>\n- <Migrations are append-only: add a new one, never edit an existing one>",
    "why": "Commands the agent can't guess, one canonical file to imitate, and the boundaries it must not cross. Everything else it already knows.",
    "requires": [
      "save-to-file"
    ],
    "worksIn": [
      "cursor"
    ]
  },
  {
    "id": "cu-rule-always",
    "page": "cu-rules",
    "tool": "cursor",
    "category": "config",
    "kind": "config",
    "section": "Rules",
    "title": "Always applied",
    "cap": "Always applied",
    "code": "---\nalwaysApply: true\n---\n\n- All source files must include the company copyright header\n- When you are unsure about implementation details, read the relevant\n  source files before proposing changes\n- Never modify generated files in the `dist/` or `build/` directories",
    "template": "---\nalwaysApply: true\n---\n\n- All source files must include the company copyright header\n- Never modify generated files in the `<dist/>` or `<build/>` directories\n- <Never commit directly to `main`. Branch first.>\n- <Don't add a dependency without asking.>\n- <Release steps live in `@docs/release.md`. Follow that file, don't improvise.>",
    "why": "This one is loaded into every single request, so it earns its cost only if every line is true everywhere in the repo. Keep it to the handful of rules an agent cannot infer: anything true of one directory belongs in a globs rule, anything the linter already enforces belongs nowhere, and a long procedure should be referenced as a file rather than pasted in.",
    "requires": [
      "save-to-file"
    ],
    "worksIn": [
      "cursor"
    ]
  },
  {
    "id": "cu-rule-globs",
    "page": "cu-rules",
    "tool": "cursor",
    "category": "config",
    "kind": "config",
    "section": "Rules",
    "title": "Auto-attached by file pattern",
    "cap": "Auto-attached by file pattern",
    "code": "---\nglobs: src/components/**/*.tsx\nalwaysApply: false\n---\n\n- Use named exports, not default exports\n- Co-locate styles in a module CSS file next to the component\n- Keep components under 200 lines. Extract subcomponents into the same\n  directory when a file grows beyond that\n- Prefer composition over prop drilling. Pass children or render props\n  instead of threading data through multiple layers",
    "template": "---\nglobs: <src/components/**/*.tsx>\nalwaysApply: false\n---\n\n- <Use named exports, not default exports>\n- <Co-locate styles in a module CSS file next to the component>\n- <Keep components under 200 lines. Extract subcomponents into the same directory when a file grows beyond that>\n- <Prefer composition over prop drilling. Pass children or render props instead of threading data through multiple layers>\n- <Props interfaces are named ComponentNameProps and exported>\n- <Every interactive element needs an accessible name, see `components/Button.tsx`>\n- <No data fetching inside components. Fetch in the route and pass data down.>",
    "why": "Scoped by glob, so it costs nothing on the requests it doesn't apply to.",
    "requires": [
      "save-to-file"
    ],
    "worksIn": [
      "cursor"
    ]
  },
  {
    "id": "cu-rule-description",
    "page": "cu-rules",
    "tool": "cursor",
    "category": "config",
    "kind": "config",
    "section": "Rules",
    "title": "Agent-selected based on description",
    "cap": "Agent-selected based on description",
    "code": "---\ndescription: RPC service conventions and patterns for the backend\nalwaysApply: false\n---\n\n- Define each service in its own file under `src/services/`\n- Always validate inputs at the service boundary before passing data\n  to internal functions\n- Return structured error objects with a `code` and `message` field,\n  never throw raw strings\n- Add a `@service-template.ts` reference file when creating a new\n  service for the standard boilerplate",
    "template": "---\ndescription: <RPC service conventions and patterns for the backend. Applies when adding, editing or reviewing anything under src/services/, defining a new service method, or changing service error handling.>\nalwaysApply: false\n---\n\n- Define each service in its own file under `<src/services/>`\n- Always validate inputs at the service boundary before passing data to internal functions\n- Return structured error objects with a `code` and `message` field, never throw raw strings\n- <Every method gets a timeout and an explicit retry policy. No unbounded retries.>\n- When creating a new service, follow `@<service-template.ts>` for the standard boilerplate",
    "why": "Nothing loads this file except the `description` line, so write that line as a retrieval query: name the domain, the filenames and the words you would actually type when the rule should fire. If the rule keeps not firing, the description is wrong, not the body.",
    "requires": [
      "save-to-file"
    ],
    "worksIn": [
      "cursor"
    ]
  },
  {
    "id": "cu-rule-manual",
    "page": "cu-rules",
    "tool": "cursor",
    "category": "config",
    "kind": "config",
    "section": "Rules",
    "title": "Manual, only via @-mention",
    "cap": "Manual — only via @-mention",
    "code": "---\nalwaysApply: false\n---\n\n- Every database migration must have both `up` and `down` functions\n  so it can be fully reversed\n- Never alter a column type in-place. Add a new column, backfill,\n  then drop the old one in a separate migration\n- Reference the template for the expected file structure\n\n@migration-template.sql",
    "template": "---\nalwaysApply: false\n---\n\n# Database migrations. Invoked by @-mention only.\n\n## Rules\n\n- Every migration must have both `up` and `down` functions so it can be fully reversed\n- Never alter a column type in-place. Add a new column, backfill, then drop the old one in a separate migration.\n- Never edit a migration that has already run. Migrations are append-only.\n- <Every new column is nullable or has a default. No NOT NULL without a backfill step.>\n- <Index creation on a large table must be concurrent.>\n\n## Procedure\n\n1. Generate the migration with `<npm run migrate:create>`\n2. Write `up` and `down`, then show me both before running anything\n3. Run `<npm run migrate:up>` then `<npm run migrate:down>` locally to prove it reverses\n4. Report the exact SQL that will run in production\n\nReference the template for the expected file structure.\n\n@<migration-template.sql>",
    "why": "It fires only when you @-mention it, so it costs nothing the rest of the time and can be as long and as specific as the task deserves.",
    "requires": [
      "save-to-file"
    ],
    "worksIn": [
      "cursor"
    ]
  },
  {
    "id": "cu-hooks-json",
    "page": "cu-best-practices",
    "tool": "cursor",
    "category": "automation",
    "kind": "config",
    "section": "Long-running agent loop",
    "title": "Stop-hook configuration",
    "cap": ".cursor/hooks.json",
    "code": "{\n  \"version\": 1,\n  \"hooks\": {\n    \"stop\": [{ \"command\": \"bun run .cursor/hooks/grind.ts\" }]\n  }\n}",
    "template": "{\n  \"version\": 1,\n  \"hooks\": {\n    \"stop\": [\n      { \"command\": \"<bun run .cursor/hooks/grind.ts>\" }\n    ]\n  }\n}",
    "why": "A stop hook fires when the agent thinks it's finished, which is exactly the moment you can hand it back its own unfinished checklist; the script it points at should read <.cursor/scratchpad.md>, exit quietly on DONE, stop at a fixed iteration cap, and otherwise print the follow-up that puts the agent back to work.",
    "requires": [
      "save-to-file"
    ],
    "worksIn": [
      "cursor"
    ]
  },
  {
    "id": "cu-hook-followup",
    "page": "cu-best-practices",
    "tool": "cursor",
    "category": "automation",
    "section": "Long-running agent loop",
    "title": "The follow-up message the hook re-injects",
    "prompt": "[Iteration ${input.loop_count + 1}/${MAX_ITERATIONS}] Continue working. Update .cursor/scratchpad.md with DONE when complete.",
    "template": "[Iteration ${input.loop_count + 1}/${MAX_ITERATIONS}] Continue working. Update .cursor/scratchpad.md with DONE when complete.\n\nBefore continuing:\n- Re-read .cursor/scratchpad.md and pick the first item that is not finished\n- Append one line saying which item you're on and what you did last iteration\n\nRules for this loop:\n- Work on one item, verify it with <npm run test>, then update the scratchpad\n- Write DONE only when every item is checked off and the tests pass\n- If you are blocked or repeating yourself, write BLOCKED plus the reason instead of DONE and stop\n- Don't start new work that isn't on the list\n- If an item can't be verified because <npm run test> doesn't exist or doesn't cover it, write BLOCKED plus the reason rather than marking it done",
    "why": "You never type this one: your stop-hook script emits it, and `${input.loop_count + 1}` and `${MAX_ITERATIONS}` are variables that script substitutes, not slots to fill. It is the single message that turns a stopped agent back into a working one, so it has to carry the whole loop contract.",
    "requires": [],
    "worksIn": [
      "cursor"
    ]
  }
];

// AIRA compatibility export
const AI_PROMPTS_DATA = {
  sources: window.PROMPT_SOURCES,
  prompts: window.ALL_PROMPTS
};
