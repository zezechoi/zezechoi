# K-Beauty Global B2B Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the portfolio read within 30 seconds as a seven-year overseas-sales and global B2B candidate who can extend account development and export operations into brand and local-market communication.

**Architecture:** Keep the existing static editorial design. Put archive metadata and issue records in one browser-readable JavaScript data file, then render both the homepage preview and archive list from a shared UI script. Add a PowerShell content guard for identity hierarchy, factual wording, data consistency, links, and responsive CSS.

**Tech Stack:** Static HTML/CSS/JavaScript, PowerShell verification, Chrome headless visual checks

## Global Constraints

- Preserve the current premium, editorial, minimal visual system.
- Keep the hierarchy “sales → brand/marketing → research/AI” across all pages.
- Use only claims supported by the supplied facts; remove market-count and full-cycle closing overclaims.
- Keep desktop and mobile layouts responsive.
- Calculate archive issue counts, category counts, dates, and Edition from one data source.
- Do not introduce a build framework or external runtime dependency.

---

### Task 1: Add executable content and data guards

**Files:**
- Create: `tests/portfolio-content-check.ps1`

**Interfaces:**
- Consumes: `index.html`, `archive.html`, `cv.html`, `portfolio-data.js`, `portfolio-ui.js`
- Produces: exit code `0` only when identity, accuracy, data, link, and mobile rules pass

- [ ] **Step 1: Write assertions for the required role title, capability order, selected-work labels, banned overclaims, shared scripts, nine archive issues, non-zero fallbacks, local links, and mobile overflow rules.**
- [ ] **Step 2: Run `powershell -ExecutionPolicy Bypass -File tests/portfolio-content-check.ps1` and verify it fails against the current marketer-first pages.**
- [ ] **Step 3: Keep the test unchanged while Tasks 2–4 implement the requirements.**

### Task 2: Create the canonical archive data source

**Files:**
- Create: `portfolio-data.js`
- Create: `portfolio-ui.js`
- Modify: `archive.html`
- Modify: `index.html`

**Interfaces:**
- Produces: `window.PORTFOLIO_DATA.meta`, `window.PORTFOLIO_DATA.archive.issues`
- Consumes: DOM hooks `[data-portfolio-latest]`, `[data-portfolio-archive]`, `[data-portfolio-count]`, `[data-portfolio-edition]`, `[data-portfolio-updated]`

- [ ] **Step 1: Store Edition, last-updated date, series labels, categories, and all nine published posts in `portfolio-data.js`.**
- [ ] **Step 2: Render three latest K-Beauty strategy issues on the homepage and all issues on the archive page from `portfolio-ui.js`.**
- [ ] **Step 3: Derive article/category counts and filter behavior from the same issue array, while keeping accurate non-zero HTML fallbacks.**
- [ ] **Step 4: Run the content guard and confirm data-source assertions pass.**

### Task 3: Reframe the homepage around overseas sales

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: factual career evidence supplied in the portfolio brief
- Produces: recruiter-scannable Hero, metrics, Selected Work, Capabilities, Experience, About, and Contact sections

- [ ] **Step 1: Replace the hero identity with “Global B2B Sales & Brand Operations”, “K-Beauty 해외영업 / 글로벌 B2B”, and an Italian Luxury → K-Beauty transition line.**
- [ ] **Step 2: Replace unsupported market-count metrics and solo-responsibility wording with account, order, supplier, and exhibition evidence.**
- [ ] **Step 3: Rebuild Selected Work cards for T&S Trading, Saturn Bath, and Mondrian AI with Role / Scope / Actions / Outcome labels.**
- [ ] **Step 4: Reorder and rewrite Capabilities as Global Account Management, New Market Development, Brand & Market Communication, and AI-Enabled Operations.**
- [ ] **Step 5: Put paid employment before independent research and shorten About/Contact copy so marketing reads as a sales-enabling skill.**
- [ ] **Step 6: Add mobile wrapping and width constraints for navigation, hero stamp, headings, and metadata.**

### Task 4: Align archive and CV language

**Files:**
- Modify: `archive.html`
- Modify: `cv.html`

**Interfaces:**
- Consumes: `portfolio-data.js` metadata and the same factual hierarchy as the homepage
- Produces: a global-business archive introduction and a one-page recruiter-facing CV

- [ ] **Step 1: Rewrite the archive introduction around product USP, channel choice, market entry, and global expansion potential.**
- [ ] **Step 2: Update archive navigation/back-strip labels to “Global B2B Sales & Brand Operations”.**
- [ ] **Step 3: Rewrite the CV summary, metrics, experience bullets, and tools around seven years of overseas sales and B2B marketing without unsupported claims.**
- [ ] **Step 4: Run the content guard until all copy and consistency assertions pass.**

### Task 5: Verify behavior and rendered output

**Files:**
- Verify: `index.html`
- Verify: `archive.html`
- Verify: `cv.html`
- Generate: `cv.pdf`

**Interfaces:**
- Produces: test logs, desktop/mobile screenshots, and a current one-page PDF

- [ ] **Step 1: Run the PowerShell content guard and inspect all local href/src targets.**
- [ ] **Step 2: Render homepage and archive at desktop and 390px mobile widths; verify no horizontal clipping and readable hierarchy.**
- [ ] **Step 3: Exercise All / Strategy / Market Research filters and all nine external post links.**
- [ ] **Step 4: Print `cv.html` to `cv.pdf`, verify A4 page count, and inspect the rendered page.**
- [ ] **Step 5: Search the repository for every banned overclaim and report any remaining intentional historical copy separately.**
- [ ] **Step 6: Commit reviewed changes, merge into `main`, push, and verify the deployed Vercel pages.**

