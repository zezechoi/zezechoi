(function () {
  "use strict";

  const data = window.PORTFOLIO_DATA;
  if (!data) return;

  const pad = value => String(value).padStart(2, "0");
  const displayDate = value => value.replaceAll("-", ".");
  const categoryLabel = category => data.archive.categories[category] || category;

  function updateMetadata() {
    document.querySelectorAll("[data-portfolio-edition]").forEach(el => {
      el.textContent = data.meta.edition;
    });
    document.querySelectorAll("[data-portfolio-updated]").forEach(el => {
      el.textContent = data.meta.updated;
      if (el.tagName === "TIME") el.dateTime = data.meta.updatedIso;
    });
    document.querySelectorAll("[data-portfolio-volume]").forEach(el => {
      el.textContent = data.meta.archiveVolume;
    });
    document.querySelectorAll("[data-portfolio-season]").forEach(el => {
      el.textContent = data.meta.season;
    });

    const issues = data.archive.issues;
    const counts = issues.reduce((result, issue) => {
      result[issue.category] = (result[issue.category] || 0) + 1;
      return result;
    }, {});

    document.querySelectorAll('[data-portfolio-count="all"]').forEach(el => {
      el.textContent = pad(issues.length);
    });
    document.querySelectorAll("[data-portfolio-count]").forEach(el => {
      const key = el.dataset.portfolioCount;
      if (key !== "all") el.textContent = pad(counts[key] || 0);
    });
    document.querySelectorAll("[data-portfolio-total]").forEach(el => {
      el.textContent = `${issues.length} published · ${data.archive.series.length} series`;
    });
    document.querySelectorAll("[data-portfolio-series-count]").forEach(el => {
      el.textContent = data.archive.series.length;
    });
  }

  function latestIssueRow(issue) {
    return `
      <a href="${issue.url}" target="_blank" rel="noopener" class="kb-row" style="text-decoration:none;color:inherit;">
        <span class="num">vol.${issue.volume}</span>
        <div class="brand">${issue.brand}<span class="ko">${issue.brandKo}</span></div>
        <div class="topic"><strong>${issue.title}</strong></div>
        <span class="meta">Published<span class="arrow">→</span></span>
      </a>`;
  }

  function renderLatestIssues() {
    document.querySelectorAll("[data-portfolio-latest]").forEach(container => {
      const limit = Number(container.dataset.limit || 3);
      const latest = data.archive.issues
        .filter(issue => issue.category === "strategy")
        .slice(0, limit);
      container.innerHTML = latest.map(latestIssueRow).join("");
    });
  }

  function archiveIssueCard(issue) {
    return `
      <a href="${issue.url}" target="_blank" rel="noopener" class="card" data-category="${issue.category}" data-brand="${issue.id}" data-date="${issue.date}">
        <div class="card-date">${displayDate(issue.date)}</div>
        <div class="card-body">
          <span class="card-series">「${issue.series}」 vol.${issue.volume}</span>
          <div class="brand">${issue.brand}<span class="ko">${issue.brandKo}</span></div>
          <h3>${issue.title}</h3>
          <p>${issue.summaryHtml}</p>
          <span class="card-link">View on Instagram →</span>
        </div>
        <div class="card-tag">${categoryLabel(issue.category)}</div>
      </a>`;
  }

  function renderArchiveIssues() {
    document.querySelectorAll("[data-portfolio-archive]").forEach(container => {
      container.innerHTML = data.archive.issues.map(archiveIssueCard).join("");
    });
  }

  function applyArchiveFilter(filter) {
    const cards = [...document.querySelectorAll("[data-portfolio-archive] .card")];
    const empty = document.getElementById("empty");
    let visible = 0;

    cards.forEach(card => {
      const show = filter === "all" || card.dataset.category === filter;
      card.hidden = !show;
      if (show) visible += 1;
    });

    document.querySelectorAll("[data-filter]").forEach(button => {
      button.classList.toggle("active", button.dataset.filter === filter);
      button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
    });

    if (empty) empty.hidden = visible !== 0;
  }

  function initializeArchiveFilters() {
    document.querySelectorAll("[data-filter]").forEach(button => {
      button.addEventListener("click", () => applyArchiveFilter(button.dataset.filter));
    });

    document.querySelectorAll("[data-cat]").forEach(row => {
      row.addEventListener("click", event => {
        event.preventDefault();
        applyArchiveFilter(row.dataset.cat);
        document.getElementById("recent")?.scrollIntoView({ behavior: "smooth" });
      });
    });

    if (document.querySelector("[data-portfolio-archive]")) {
      applyArchiveFilter("all");
    }
  }

  updateMetadata();
  renderLatestIssues();
  renderArchiveIssues();
  initializeArchiveFilters();
})();
