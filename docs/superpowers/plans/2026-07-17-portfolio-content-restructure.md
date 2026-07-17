# Portfolio Content Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition the portfolio around six years of overseas sales and one year of B2B marketing, while tightening recruiter-facing proof across the homepage, archive, CV, and PDF.

**Architecture:** Keep the existing single-file HTML/CSS structure and visual system. Update each surface from the same copy hierarchy—`해외영업 · 글로벌 세일즈·마케팅` first, evidence second, K-Beauty independent work clearly separated from employment—and validate text with deterministic searches before visual QA.

**Tech Stack:** Static HTML/CSS/JavaScript, Chrome headless PDF printing, Poppler `pdfinfo` and `pdftoppm`, Git.

## Global Constraints

- Primary positioning: `해외영업 · 글로벌 세일즈·마케팅`.
- Career summary: `해외영업 6년 · B2B 마케팅 1년`.
- Independent K-Beauty work starts in `2026` and must never be presented as employment.
- Do not invent revenue, reduction-rate, conversion-rate, or error-prevention KPIs.
- Keep the current typography, color system, responsive breakpoints, and static-site architecture.
- Homepage shows only K-Beauty Files vol.7, vol.6, and vol.5; archive retains all nine published cards.
- CV PDF must remain one A4 page.

---

## File Map

- Modify: `index.html` — recruiter-facing positioning, evidence hierarchy, latest K-Beauty issues, experience, About, and contact copy.
- Modify: `archive.html` — stable metadata, accurate published counts, unsupported-claim removal, placeholder removal, and portfolio backlink title.
- Modify: `cv.html` — one-page résumé source synchronized with the homepage.
- Regenerate: `zezechoi-cv.pdf` — downloadable A4 résumé generated from `cv.html`.
- Create during verification only: `.tmp/cv-render-1.png` — temporary PDF visual-QA image; do not commit.

---

### Task 1: Homepage Positioning and Recruiter Scan

**Files:**
- Modify: `index.html:5-7`
- Modify: `index.html:1097-1186`
- Modify: `index.html:1242-1248`
- Modify: `index.html:1343-1412`
- Modify: `index.html:1600-1637`

**Interfaces:**
- Consumes: approved role hierarchy from the design spec.
- Produces: the canonical role, career duration, Hero, capability, contact, and footer copy used by the CV task.

- [ ] **Step 1: Run the positioning guard and confirm it fails before editing**

```powershell
$old = rg -n "Premium Brand Operator|Open for K-Beauty Roles|7년간 한국과 세계 사이|5\+<span class=\"unit\">brands|마케터 시선으로 분석한 K-뷰티 브랜드|Continuous · 2024—|다른 누구에게도 없는|AI-Native Marketer|K-Beauty 글로벌 포지션 탐색 중" index.html
if ($LASTEXITCODE -eq 0) { throw "Old positioning remains:`n$old" }
```

Expected: FAIL and print the existing strings.

- [ ] **Step 2: Replace page metadata and the Hero with the canonical overseas-sales-first copy**

```html
<title>Zeze Choi — Global Sales &amp; Marketing · K-Beauty</title>
<meta name="description" content="해외영업 6년 · B2B 마케팅 1년. 이태리 럭셔리 브랜드 6개 운영과 6개국 신규 거래선 발굴 경험으로 K-뷰티의 해외 시장을 연결합니다. — 최지예 Zeze Choi">
```

```html
<div class="nav-status"><span class="dot-live"></span>Open for Global Sales &amp; Marketing Roles</div>
```

```html
<div class="hero-stamp">
  <span class="bar"></span>
  <span>Global Sales &amp; Marketing · Overseas Sales → K-Beauty</span>
  <span>·</span>
  <span>Seoul, KR</span>
</div>

<div class="hero-thesis">
  <h1 class="hero-line-1">
    6년의 해외영업 경험 위에,<br>
    <strong>마케팅의 시선을 더했습니다.</strong>
  </h1>
  <h1 class="hero-line-2">
    <span class="arrow">→</span> 다음은,<br>
    <span class="accent">K-뷰티의 해외 시장</span>으로.
  </h1>
</div>

<p class="hero-en">
  Six years in overseas sales and one year in B2B marketing — operating six Italian luxury interior brands in Korea and building new business across six markets. Now bringing that commercial and brand perspective to K-beauty’s global growth.
</p>
```

Use this value in the Hero metadata:

```html
<span class="val">해외영업 · 글로벌 세일즈·마케팅 포지션 탐색 중</span>
```

- [ ] **Step 3: Correct current-work metrics and capability claims**

Use these exact replacements:

```html
<div class="metric-num">7<span class="unit">brands</span></div>
<p class="metric-desc">운영자의 시선으로 분석한 K-뷰티 브랜드.</p>
```

```html
<span class="work-id">SI002 · Continuous · 2026—</span>
```

```html
<h2 class="sec-title">경력을 연결하는 <span class="soft">네 가지 교차점.</span></h2>
```

```html
<div class="cap-headline">AI-Native Operator</div>
```

- [ ] **Step 4: Synchronize Contact and footer positioning**

```html
Currently · 해외영업 · 글로벌 세일즈·마케팅 포지션 탐색 중<br>
Building · K-Beauty Files 연재 · Claude Code 자동화
```

```html
<span>© 2026 최지예 Zeze Choi · Global Sales &amp; Marketing</span>
```

Keep the existing edition date unchanged in `index.html` during this task.

- [ ] **Step 5: Re-run the positioning guard**

Run the Step 1 command again.

Expected: PASS with no output.

- [ ] **Step 6: Commit the recruiter-scan update**

```powershell
git add index.html
git commit -m "refactor: center portfolio on overseas sales"
```

---

### Task 2: Homepage Work Evidence, Experience, and About

**Files:**
- Modify: `index.html:457-476`
- Modify: `index.html:1198-1211`
- Modify: `index.html:1422-1510`
- Modify: `index.html:1050-1068`

**Interfaces:**
- Consumes: homepage positioning established in Task 1.
- Produces: structured evidence for T&S Trading and a clear employment-versus-independent-project timeline.

- [ ] **Step 1: Run the evidence guard and confirm it fails**

```powershell
$old = rg -n "오류 사전 차단|의사결정 흐름 단축|브랜드 음성을 처음부터 정의|한 번 포기했던 꿈|Experience · 2017—2025|>LATEST<" index.html
if ($LASTEXITCODE -eq 0) { throw "Unsupported or stale evidence remains:`n$old" }
```

Expected: FAIL and print the existing strings.

- [ ] **Step 2: Add compact case-study styles for OW001**

Insert after `.work-desc strong`:

```css
  .work-case {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px 24px;
    margin-top: 4px;
  }
  .work-case-item {
    padding-top: 12px;
    border-top: 1px solid var(--border-subtle);
  }
  .work-case-label {
    display: block;
    margin-bottom: 6px;
    font-family: var(--mono);
    font-size: 9.5px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--accent);
  }
  .work-case-item p {
    font-size: 13px;
    line-height: 1.6;
    color: var(--text-soft);
  }
```

Add this declaration inside the existing mobile media query:

```css
    .work-case { grid-template-columns: 1fr; }
```

- [ ] **Step 3: Replace OW001 description with Context, Responsibility, Decision, Deliverable, and Operational Effect**

```html
<h3 class="work-title">이태리 럭셔리 인테리어 6개 브랜드 한국 운영 — 통합 가이드 체계 구축</h3>
<div class="work-case">
  <div class="work-case-item">
    <span class="work-case-label">Context</span>
    <p>이태리 럭셔리 인테리어 6개 브랜드를 한국에서 동시에 운영하며 본사 가이드·국내 사양·출시 일정을 조율해야 했습니다.</p>
  </div>
  <div class="work-case-item">
    <span class="work-case-label">Responsibility</span>
    <p>6개 브랜드의 한국 커뮤니케이션과 패키징·라벨 확인 흐름을 담당했습니다.</p>
  </div>
  <div class="work-case-item">
    <span class="work-case-label">Decision</span>
    <p>브랜드별로 흩어진 확인 항목을 하나의 가이드와 캘린더 기준으로 통합했습니다.</p>
  </div>
  <div class="work-case-item">
    <span class="work-case-label">Deliverable</span>
    <p>패키징·라벨 통합 체크리스트 · 납기 캘린더 · 본사–한국 확인 흐름</p>
  </div>
  <div class="work-case-item">
    <span class="work-case-label">Operational Effect</span>
    <p>출시 전 확인 단계와 책임 범위가 명확해져 누락 가능성을 줄이고 커뮤니케이션 기준을 맞췄습니다.</p>
  </div>
</div>
```

- [ ] **Step 4: Add the current independent project above employment and relabel T&S Trading**

Change the section label to:

```html
<span>Experience · 2017—Present</span>
```

Insert this as the first `.career-row`:

```html
<article class="career-row feature">
  <div class="career-period">
    <div class="latest">CURRENT · INDEPENDENT PROJECT</div>
    2026 — Present
  </div>
  <div>
    <h3 class="career-co">Independent K-Beauty Research</h3>
    <div class="career-role">Brand Analysis · AI Content · Self-Initiated</div>
    <p class="career-bizh">해외영업과 B2B 마케팅 경험을 K-뷰티 브랜드 분석과 AI 콘텐츠 제작으로 확장.</p>
  </div>
  <div class="career-detail">
    <ul>
      <li>K-Beauty Files 브랜드 분석 <strong>7편</strong> 및 현장 노트 <strong>2편</strong> 기획·발행</li>
      <li>뷰티·패션 AI 영상 챌린지 우수상 · AI 실전 활용 프로그램 우수 수료</li>
      <li>Claude Code로 리서치·콘텐츠·아카이브 사이트 운영 흐름 구축</li>
    </ul>
    <div class="career-learned">정규 고용이 아닌 독립 프로젝트입니다.</div>
  </div>
</article>
```

Remove `feature` from the T&S article and replace its period block with:

```html
<div class="career-period">
  <div class="latest">RECENT ROLE</div>
  2023 — 2025
</div>
```

- [ ] **Step 5: Replace unsupported T&S and Mondrian wording**

Use these T&S details:

```html
<li>이태리 본사 <strong>6개 브랜드</strong>의 한국 커뮤니케이션과 운영 일정 담당</li>
<li>브랜드별 확인 항목을 패키징·라벨 통합 체크리스트로 정리</li>
<li>납기 캘린더와 본사–한국 확인 흐름을 구축해 확인 단계와 책임 범위를 명확화</li>
<li>이태리 본사와 국내 파트너 사이의 사양·일정·메시지 조율</li>
```

Use this Mondrian summary:

```html
<p class="career-bizh">브랜드 톤앤매너 가이드를 채널별 콘텐츠에 적용. 블로그·뉴스 기사·인터뷰 콘텐츠 제작·발행, Owned Media와 PR 운영.</p>
```

Use this Mondrian learned line:

```html
<div class="career-learned">B2B 브랜드의 메시지를 콘텐츠와 PR로 실행하는 법을 배웠습니다.</div>
```

- [ ] **Step 6: Replace About with present-value-first copy**

```html
<span>About — Global Sales to K-Beauty</span>
```

```html
<h2 class="sec-title">해외영업 6년, 마케팅 1년.<br><span class="soft">다음은 K-뷰티의 세계 시장으로.</span></h2>
```

```html
<p class="lede">6년간 해외영업을 담당하며 이태리 럭셔리 인테리어 브랜드 6개의 한국 시장 운영과 6개국 신규 거래선 발굴을 경험했습니다.</p>

<p>이후 1년간 B2B 마케팅을 맡아 콘텐츠와 PR을 실행했고, 지금은 두 경험을 <strong>K-뷰티의 해외 시장 확장</strong>에 연결하고 있습니다.</p>

<p>퍼스널컬러 교육과 성분 공부를 기반으로 매주 K-뷰티 브랜드를 분석하고 기록합니다. 한 번 미뤄두었던 뷰티에 대한 관심을 독립적인 리서치와 콘텐츠 제작으로 다시 증명하고 있습니다.</p>
```

- [ ] **Step 7: Re-run the evidence guard**

Run the Step 1 command again.

Expected: PASS with no output.

- [ ] **Step 8: Commit the evidence hierarchy**

```powershell
git add index.html
git commit -m "refactor: strengthen portfolio evidence hierarchy"
```

---

### Task 3: Homepage K-Beauty Files Scan Length

**Files:**
- Modify: `index.html:1265-1321`

**Interfaces:**
- Consumes: archive URL and current newest-first ordering.
- Produces: a three-item homepage preview linking to the full archive.

- [ ] **Step 1: Verify that seven issue rows currently exist**

```powershell
$count = (rg -o 'class="kb-row"' index.html | Measure-Object).Count
if ($count -ne 3) { throw "Expected final count 3; current count is $count" }
```

Expected: FAIL with current count `7`.

- [ ] **Step 2: Keep only vol.7 WHIPPED, vol.6 DEMAF, and vol.5 FROMRIER**

Delete the complete `.kb-row` anchors for vol.4 TORRIDEN, vol.3 PARNELL, vol.2 HYAAH, and vol.1 KARED. Preserve the remaining rows and their Instagram URLs unchanged.

Replace the CTA with:

```html
<div class="kb-cta">
  <a href="archive.html">View all issues →</a>
</div>
```

- [ ] **Step 3: Re-run the count and ordering checks**

```powershell
$count = (rg -o 'class="kb-row"' index.html | Measure-Object).Count
if ($count -ne 3) { throw "Homepage must contain exactly 3 K-Beauty rows; found $count" }
$volumes = rg -o 'vol\.[0-9]+' index.html | Select-Object -First 3
if (($volumes -join ',') -ne 'vol.7,vol.6,vol.5') { throw "Unexpected order: $($volumes -join ',')" }
```

Expected: PASS.

- [ ] **Step 4: Commit the homepage archive preview**

```powershell
git add index.html
git commit -m "refactor: show latest K-beauty issues on homepage"
```

---

### Task 4: Archive Metadata, Claims, and Stable Counts

**Files:**
- Modify: `archive.html:706-785`
- Modify: `archive.html:823-880`
- Modify: `archive.html:937-1025`

**Interfaces:**
- Consumes: all nine existing archive cards and both series names.
- Produces: an archive with no speculative calendar, no unsupported numeric claims, and card-derived published counts.

- [ ] **Step 1: Run the archive guard and confirm it fails**

```powershell
$old = rg -n "Insight Archive · Vol\. 01|Volume 09|연 매출 200억|1년 매출 70억|2년 누적 100억|2024 올리브영 마스크팩 1위|인디 클린 뷰티|2026 Q2|Last updated 2026\.07\.10|Premium Brand Operator" archive.html
if ($LASTEXITCODE -eq 0) { throw "Stale archive content remains:`n$old" }
```

Expected: FAIL and print the existing strings.

- [ ] **Step 2: Replace archive metadata with stable labels**

```html
<span>Insight Archive · 2026</span>
```

```html
<aside class="editor-note-aside">
  <span class="accent">— From the Editor</span>
  2 Series · Ongoing<br>
  Seoul / 2026
</aside>
```

Update the portfolio backlink to:

```html
<a href="index.html">← Zeze Choi · Global Sales &amp; Marketing</a>
```

Update the footer to:

```html
<footer>
  <span>© 2026 최지예 Zeze Choi · Insight Archive</span>
  <span>2 Series · Ongoing</span>
</footer>
```

- [ ] **Step 3: Replace the Pipeline pulse card with an evidence-based Lens card**

Replace the current Edition and Pipeline cards with:

```html
<div class="pulse-stat">
  <span class="label-sm">Published</span>
  <span class="pulse-num"><span data-stat="articles">09</span></span>
  <span class="pulse-sub">두 시리즈 누적 발행</span>
</div>
<div class="pulse-stat">
  <span class="label-sm">Lens</span>
  <span class="pulse-num" style="font-size:clamp(28px, 3.2vw, 42px);line-height:1.1">Brand<br>+ Field</span>
  <span class="pulse-sub">브랜드 전략 · 현장 기록</span>
</div>
```

- [ ] **Step 4: Remove unsupported numbers while preserving each thesis**

Use these exact card paragraphs:

```html
<p>크림케이크에서 영감받은 휩드 크림 클렌저. <strong>"휩드는 바르는 걸 팔지 않는다, 주고 싶은 마음을 판다"</strong> — 제품 경험을 선물 심리와 입소문으로 확장한 브랜드의 결정.</p>
```

```html
<p>판테놀 앰플 + <strong>"피부 장벽학개론"</strong> 강의·미션 챌린지. CEO의 교육 백그라운드를 비즈니스 모델로 연결해 <strong>"디마프는 화장품을 팔지 않는다, 가르친다"</strong>는 관점을 만든 브랜드.</p>
```

```html
<p>저분자 히알루론산이 표면이 아니라 속으로. <strong>"토리든은 유행이 아니었다, 성분이었다"</strong>는 한 문장으로 성분 중심의 브랜드 선택을 읽었습니다.</p>
```

- [ ] **Step 5: Remove the entire Editorial Calendar section**

Delete the complete `<section class="upcoming-section">` block, including its `upcoming-list` and `upcoming-row`.

- [ ] **Step 6: Simplify automatic counts to published cards only**

Replace the first archive script IIFE with:

```javascript
  // 발행된 카드 데이터에서 통계 자동 계산
  (function () {
    const realCards = [...document.querySelectorAll('.card:not(.placeholder)')];
    const published = realCards.length;
    const pad = n => String(n).padStart(2, '0');

    const articles = document.querySelector('[data-stat="articles"]');
    if (articles) articles.textContent = pad(published);

    document.querySelectorAll('[data-count]').forEach(el => {
      const cat = el.dataset.count;
      const count = realCards.filter(card => card.dataset.category === cat).length;
      el.textContent = pad(count);
    });

    const totalEl = document.querySelector('[data-cats-total]');
    if (totalEl) totalEl.textContent = `${published} published · 2 series`;
  })();
```

- [ ] **Step 7: Verify claims, placeholders, and card count**

```powershell
$old = rg -n "Insight Archive · Vol\. 01|Volume 09|연 매출 200억|1년 매출 70억|2년 누적 100억|2024 올리브영 마스크팩 1위|인디 클린 뷰티|2026 Q2|Last updated 2026\.07\.10|Premium Brand Operator|upcoming-row|data-stat=\"pipeline\"" archive.html
if ($LASTEXITCODE -eq 0) { throw "Archive cleanup incomplete:`n$old" }
$cards = (rg -o 'class="card"' archive.html | Measure-Object).Count
if ($cards -ne 9) { throw "Archive must retain 9 cards; found $cards" }
```

Expected: PASS.

- [ ] **Step 8: Commit the archive cleanup**

```powershell
git add archive.html
git commit -m "refactor: make archive metadata and claims durable"
```

---

### Task 5: CV Synchronization and PDF Regeneration

**Files:**
- Modify: `cv.html:260-337`
- Regenerate: `zezechoi-cv.pdf`
- Create temporarily: `.tmp/cv-render-1.png`

**Interfaces:**
- Consumes: canonical role and career wording from Tasks 1 and 2.
- Produces: the downloadable one-page A4 CV used by `index.html`.

- [ ] **Step 1: Run the CV text guard and confirm it fails**

```powershell
$old = rg -n "Premium Brand Operator|7년간 한국과 세계 사이|본사가 보낸 한 줄|9 issues|출시 사양 오류 사전 차단" cv.html
if ($LASTEXITCODE -eq 0) { throw "CV is not synchronized:`n$old" }
```

Expected: FAIL and print the existing strings.

- [ ] **Step 2: Replace the CV title, summary, and fourth metric**

```html
<div class="cv-title">Global Sales &amp; Marketing · 해외영업 6년 · B2B 마케팅 1년</div>
```

```html
<p class="cv-summary">
  <strong>6년간 해외영업</strong>으로 신규 시장과 파트너를 발굴하고, <strong>1년간 B2B 마케팅</strong>으로 브랜드의 메시지를 콘텐츠와 PR로 실행했습니다. 이태리 럭셔리 인테리어 6개 브랜드의 한국 시장 운영과 6개국 신규 거래선 발굴 경험을 바탕으로, 다음은 <strong>K-뷰티의 해외 시장</strong>을 연결하고자 합니다.
</p>
```

```html
<div class="cv-metric"><div class="num">2 series</div><div class="lab">K-뷰티 분석 · 현장 기록</div></div>
```

- [ ] **Step 3: Add a dated Independent Project entry before T&S Trading**

Insert after the Experience heading:

```html
<div class="job">
  <div class="job-head">
    <div><span class="job-co">Independent K-Beauty Research</span><span class="job-role">Independent Project · Brand Analysis &amp; AI Content</span></div>
    <span class="job-period">2026 — Present</span>
  </div>
  <ul>
    <li><strong>K-Beauty Files</strong> 브랜드 분석 7편·현장 노트 2편 기획 및 발행</li>
    <li>AI 영상 챌린지 우수상, Claude Code 기반 리서치·콘텐츠·아카이브 운영 흐름 구축</li>
  </ul>
</div>
```

Remove the separate `Self-Initiated · 직접 만든 일` section to avoid duplicating the same project and save vertical space.

- [ ] **Step 4: Synchronize employment wording**

Use these T&S bullets:

```html
<li>이태리 본사 <strong>6개 브랜드</strong>의 한국 커뮤니케이션과 운영 일정 담당</li>
<li>브랜드별 확인 항목을 패키징·라벨 통합 체크리스트로 정리</li>
<li>납기 캘린더와 본사–한국 확인 흐름을 구축해 확인 단계와 책임 범위를 명확화</li>
```

Use these Mondrian bullets:

```html
<li>브랜드 <strong>톤앤매너 가이드를 채널별 콘텐츠에 적용</strong> · 블로그·뉴스 기사·인터뷰 콘텐츠 제작·발행</li>
<li>SNS·홈페이지 Owned Media 및 PR 운영, 내외부 행사 기획</li>
<li>해외 파트너 발굴 및 정부지원 수출사업 제안서 작성</li>
```

- [ ] **Step 5: Verify CV text before printing**

```powershell
$old = rg -n "Premium Brand Operator|7년간 한국과 세계 사이|본사가 보낸 한 줄|9 issues|출시 사양 오류 사전 차단|Self-Initiated · 직접 만든 일" cv.html
if ($LASTEXITCODE -eq 0) { throw "CV cleanup incomplete:`n$old" }
rg -n "Global Sales &amp; Marketing|해외영업 6년|B2B 마케팅 1년|Independent K-Beauty Research|2026 — Present" cv.html
```

Expected: no old strings; all five canonical strings found.

- [ ] **Step 6: Print the CV to PDF with Chrome**

```powershell
$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$url = 'file:///' + ((Resolve-Path 'cv.html').Path -replace '\\','/')
& $chrome --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="$(Resolve-Path '.').Path\zezechoi-cv.pdf" $url
if ($LASTEXITCODE -ne 0) { throw "Chrome PDF generation failed" }
```

Expected: Chrome reports that bytes were written to `zezechoi-cv.pdf`.

- [ ] **Step 7: Verify one-page A4 geometry and render for visual inspection**

```powershell
New-Item -ItemType Directory -Force .tmp | Out-Null
pdfinfo zezechoi-cv.pdf | Select-String 'Pages|Page size'
pdftoppm -png -f 1 -singlefile -r 150 zezechoi-cv.pdf .tmp/cv-render-1
```

Expected:

```text
Pages:           1
Page size:       595.28 x 841.89 pts (A4)
```

Open `.tmp/cv-render-1.png` with the image inspection tool. Confirm that no line is clipped, no section overlaps, Korean text renders, and the footer remains inside the page.

- [ ] **Step 8: Commit the synchronized CV source and PDF**

```powershell
git add cv.html zezechoi-cv.pdf
git commit -m "refactor: align CV with global sales positioning"
```

Do not add `.tmp`.

---

### Task 6: Integrated Static-Site Verification

**Files:**
- Verify: `index.html`
- Verify: `archive.html`
- Verify: `cv.html`
- Verify: `zezechoi-cv.pdf`

**Interfaces:**
- Consumes: all earlier task outputs.
- Produces: a clean, internally consistent deployable repository.

- [ ] **Step 1: Verify stale strings are absent across deployable sources**

```powershell
$stale = rg -n "Premium Brand Operator|Open for K-Beauty Roles|5\+<span class=\"unit\">brands|Continuous · 2024—|다른 누구에게도 없는|브랜드 음성을 처음부터 정의|연 매출 200억|2년 누적 100억|2024 올리브영 마스크팩 1위|2026 Q2|Last updated 2026\.07\.10 · Vol\. 01|9 issues" index.html archive.html cv.html
if ($LASTEXITCODE -eq 0) { throw "Stale content remains:`n$stale" }
```

Expected: PASS.

- [ ] **Step 2: Verify required positioning and chronology**

```powershell
$required = @(
  '해외영업 · 글로벌 세일즈·마케팅',
  '6년의 해외영업 경험 위에',
  'B2B 마케팅 1년',
  'Experience · 2017—Present',
  'CURRENT · INDEPENDENT PROJECT',
  '2026 — Present'
)
foreach ($text in $required) {
  if (-not (Select-String -Path index.html,cv.html -SimpleMatch $text)) { throw "Missing required text: $text" }
}
```

Expected: PASS.

- [ ] **Step 3: Verify item counts and external link targets**

```powershell
$homeRows = (rg -o 'class="kb-row"' index.html | Measure-Object).Count
$archiveCards = (rg -o 'class="card"' archive.html | Measure-Object).Count
if ($homeRows -ne 3) { throw "Homepage K-Beauty row count: $homeRows" }
if ($archiveCards -ne 9) { throw "Archive card count: $archiveCards" }

$requiredLinks = @(
  'archive.html',
  'zezechoi-cv.pdf',
  'https://www.linkedin.com/in/claire-choi-6b97ba117',
  'mailto:iamzezechoi@gmail.com',
  'https://www.instagram.com/zeze_beautynote/'
)
foreach ($link in $requiredLinks) {
  if (-not (Select-String -Path index.html -SimpleMatch $link)) { throw "Missing homepage link: $link" }
}
```

Expected: PASS.

- [ ] **Step 4: Inspect final diffs and repository cleanliness**

```powershell
git diff --check
git status --short
git log -6 --oneline
```

Expected: `git diff --check` has no output; only `.tmp/` may be untracked; each implementation task has its own commit.

- [ ] **Step 5: Remove the temporary render and verify clean status**

```powershell
Remove-Item -LiteralPath '.tmp\cv-render-1.png' -Force
if ((Get-ChildItem -LiteralPath '.tmp' -Force | Measure-Object).Count -eq 0) { Remove-Item -LiteralPath '.tmp' -Force }
git status --short
```

Expected: clean working tree.

- [ ] **Step 6: Push the verified commits**

```powershell
git push origin main
```

Expected: remote `main` advances to the final local commit.
