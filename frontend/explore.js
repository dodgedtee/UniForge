/**
 * UniForge - Explorer Hub Logic (Hugging Face Model Hub Inspired)
 * Handles multi-dimensional filtering, sorting, search, detail modals, and listing creation.
 */

// ==========================================================================
// 1. Catalog Dataset (Projects, Hackathons, Competitive Programming)
// ==========================================================================

const listings = [
  {
    id: 1,
    type: "project",
    title: "NarrAI - Multi-Agent Storyteller",
    desc: "Experimental platform where multiple LLM agents collaborate to write interactive, branching storylines in real-time with user steering.",
    roles: ["Frontend", "AI / ML"],
    tech: ["Python", "LangGraph", "React", "FastAPI"],
    uni: "SDU",
    leader: "Alikhan Saparov",
    teamText: "3 / 5 members",
    updatedText: "2 hours ago",
    updatedDays: 0.1,
    likes: 42
  },
  {
    id: 2,
    type: "hackathon",
    title: "Almaty Student Incubation Hackathon",
    desc: "48-hour flagship hackathon building scalable civic-tech and AI startups. Multiple university student teams currently recruiting backend & ML builders.",
    roles: ["Backend", "AI / ML", "UI/UX"],
    tech: ["Python", "FastAPI", "PostgreSQL", "Docker"],
    uni: "KBTU",
    leader: "KBTU Tech Hub",
    teamText: "3 teams forming",
    updatedText: "5 hours ago",
    updatedDays: 0.2,
    likes: 68
  },
  {
    id: 3,
    type: "project",
    title: "FinTrack Student Club API",
    desc: "High-performance financial tracking and transparent budget ledger API designed for university student clubs and event treasurers.",
    roles: ["QA", "Backend"],
    tech: ["Java", "PostgreSQL", "Docker"],
    uni: "KBTU",
    leader: "Dana Bekova",
    teamText: "2 / 4 members",
    updatedText: "1 day ago",
    updatedDays: 1,
    likes: 29
  },
  {
    id: 4,
    type: "project",
    title: "EcoCampus Insights Mobile",
    desc: "Cross-platform mobile app tracking campus energy usage and incentivizing sustainable student habits through gamified challenges.",
    roles: ["Mobile", "UI/UX", "Backend"],
    tech: ["Flutter", "Node.js", "PostgreSQL"],
    uni: "Nazarbayev University",
    leader: "Timur Nurlanov",
    teamText: "4 / 5 members",
    updatedText: "1 day ago",
    updatedDays: 1.2,
    likes: 51
  },
  {
    id: 5,
    type: "hackathon",
    title: "CAIR Selection AI Competition",
    desc: "Applied NLP and LLM optimization challenge hosted by Center for AI Research. Looking for strong Python & prompt-engineering teammates.",
    roles: ["AI / ML", "Backend"],
    tech: ["Python", "LangGraph", "FastAPI"],
    uni: "Nazarbayev University",
    leader: "Amina Serikova",
    teamText: "5 teams forming",
    updatedText: "2 days ago",
    updatedDays: 2,
    likes: 84
  },
  {
    id: 6,
    type: "project",
    title: "CyberDefense Red-Team Sandbox",
    desc: "Isolated containerized virtual labs for university students to practice network defense, CTF challenges, and penetration testing safely.",
    roles: ["Security", "Backend"],
    tech: ["Docker", "Go", "Python"],
    uni: "AITU",
    leader: "Dias Marat",
    teamText: "2 / 4 members",
    updatedText: "3 days ago",
    updatedDays: 3,
    likes: 37
  },
  {
    id: 7,
    type: "competition",
    title: "ICPC Regional Training Squad",
    desc: "Weekly dynamic programming, graph theory, and Div.1 Codeforces virtual contests preparing a 3-student team for upcoming regionals.",
    roles: ["Algorithms"],
    tech: ["C++", "Python"],
    uni: "KBTU",
    leader: "Erlan Tolegen",
    teamText: "2 / 3 members",
    updatedText: "4 days ago",
    updatedDays: 4,
    likes: 33
  },
  {
    id: 8,
    type: "hackathon",
    title: "FinTech Innovators Jam",
    desc: "Build next-gen micro-investing and student payment tools in 36 hours. Mentorship from senior banking engineers and cash prizes.",
    roles: ["Frontend", "Backend", "UI/UX"],
    tech: ["React", "Node.js", "Go", "PostgreSQL"],
    uni: "KBTU",
    leader: "Jusan & KBTU",
    teamText: "2 teams forming",
    updatedText: "5 days ago",
    updatedDays: 5,
    likes: 47
  },
  {
    id: 9,
    type: "project",
    title: "StudySync Collaborative Notes",
    desc: "Real-time markdown workspace with AI flashcard generation and shared course roadmaps built by SDU sophomore students.",
    roles: ["Frontend", "UI/UX", "QA"],
    tech: ["React", "Node.js", "PostgreSQL"],
    uni: "SDU",
    leader: "Madina Karim",
    teamText: "3 / 6 members",
    updatedText: "6 days ago",
    updatedDays: 6,
    likes: 21
  },
  {
    id: 10,
    type: "competition",
    title: "AITU Algorithmic CodeCup",
    desc: "Inter-university team competitive programming sprint focusing on greedy algorithms, segment trees, and speed problem solving.",
    roles: ["Algorithms"],
    tech: ["C++", "Java"],
    uni: "AITU",
    leader: "Nursultan Zhan",
    teamText: "4 teams forming",
    updatedText: "1 week ago",
    updatedDays: 7,
    likes: 39
  },
  {
    id: 11,
    type: "project",
    title: "MedScan Diagnostic Assistant",
    desc: "Open-source medical imaging triage assistant built by NU bioengineering and CS students using lightweight vision-language pipelines.",
    roles: ["AI / ML", "Frontend"],
    tech: ["Python", "FastAPI", "React"],
    uni: "Nazarbayev University",
    leader: "Arman Kassymov",
    teamText: "3 / 5 members",
    updatedText: "1 week ago",
    updatedDays: 8,
    likes: 56
  },
  {
    id: 12,
    type: "hackathon",
    title: "Civic & EdTech AI Sprint",
    desc: "36-hour challenge building transparent public-service automation and multilingual Kazakh/Russian document assistants.",
    roles: ["Backend", "AI / ML", "Security"],
    tech: ["Python", "Docker", "PostgreSQL"],
    uni: "AITU",
    leader: "AITU Innovation Lab",
    teamText: "6 teams forming",
    updatedText: "1 week ago",
    updatedDays: 9,
    likes: 63
  },
  {
    id: 13,
    type: "project",
    title: "Autonomous Drone Path Simulator",
    desc: "3D multi-agent pathfinding and obstacle avoidance simulator for search-and-rescue student robotics competitions.",
    roles: ["Algorithms", "Backend"],
    tech: ["C++", "Python", "Docker"],
    uni: "KBTU",
    leader: "Ilyas Akhmetov",
    teamText: "2 / 4 members",
    updatedText: "2 weeks ago",
    updatedDays: 10,
    likes: 44
  },
  {
    id: 14,
    type: "project",
    title: "DormSwap Campus Marketplace",
    desc: "Verified student-only mobile app for buying, selling, and exchanging textbooks, electronics, and dorm essentials on campus.",
    roles: ["Mobile", "UI/UX", "Backend"],
    tech: ["Flutter", "Node.js", "PostgreSQL"],
    uni: "SDU",
    leader: "Aigerim Tursyn",
    teamText: "3 / 5 members",
    updatedText: "2 weeks ago",
    updatedDays: 11,
    likes: 35
  },
  {
    id: 15,
    type: "hackathon",
    title: "AITU Interactive Web & Game Jam",
    desc: "Weekend creative coding jam focused on browser-based multiplayer experiences, WebGL shaders, and collaborative storytelling.",
    roles: ["Frontend", "UI/UX"],
    tech: ["React", "Node.js"],
    uni: "AITU",
    leader: "AITU DevClub",
    teamText: "4 teams forming",
    updatedText: "2 weeks ago",
    updatedDays: 12,
    likes: 49
  },
  {
    id: 16,
    type: "competition",
    title: "NU Open Competitive Programming Cup",
    desc: "5-hour ICPC-format team contest open to university students across Kazakhstan. Recruiting 3rd member proficient in C++ templates.",
    roles: ["Algorithms"],
    tech: ["C++", "Java"],
    uni: "Nazarbayev University",
    leader: "Sanzhar Omar",
    teamText: "2 / 3 members",
    updatedText: "2 weeks ago",
    updatedDays: 13,
    likes: 41
  },
  {
    id: 17,
    type: "project",
    title: "KubeLite Student Cloud Runner",
    desc: "Lightweight container orchestration dashboard allowing student teams to deploy hackathon backends in one click on university servers.",
    roles: ["Security", "Backend", "QA"],
    tech: ["Go", "Docker", "PostgreSQL"],
    uni: "KBTU",
    leader: "Olzhas Bekturov",
    teamText: "3 / 4 members",
    updatedText: "3 weeks ago",
    updatedDays: 14,
    likes: 58
  },
  {
    id: 18,
    type: "hackathon",
    title: "SDU EdTech Startup Weekend",
    desc: "Build and pitch a working EdTech MVP in 48 hours with mentorship from alumni founders and venture analysts.",
    roles: ["Frontend", "Backend", "Mobile", "UI/UX"],
    tech: ["React", "Flutter", "FastAPI"],
    uni: "SDU",
    leader: "SDU Technopark",
    teamText: "7 teams forming",
    updatedText: "3 weeks ago",
    updatedDays: 15,
    likes: 72
  },
  {
    id: 19,
    type: "project",
    title: "KazNLP Open Benchmark & Corpus",
    desc: "Collaborative open-source tool for cleaning, annotating, and evaluating Kazakh-language instruction datasets for student AI research.",
    roles: ["AI / ML", "QA"],
    tech: ["Python", "LangGraph", "PostgreSQL"],
    uni: "Nazarbayev University",
    leader: "Zere Suleimen",
    teamText: "4 / 6 members",
    updatedText: "3 weeks ago",
    updatedDays: 16,
    likes: 77
  },
  {
    id: 20,
    type: "competition",
    title: "SDU Winter ICPC Qualification Squad",
    desc: "Structured problem-solving bootcamp covering number theory, flows, and bitmasks ahead of winter university qualifiers.",
    roles: ["Algorithms"],
    tech: ["C++", "Python"],
    uni: "SDU",
    leader: "Baurzhan Ali",
    teamText: "2 / 3 members",
    updatedText: "1 month ago",
    updatedDays: 18,
    likes: 28
  }
];

// ==========================================================================
// 2. Application State
// ==========================================================================

const ITEMS_PER_PAGE = 10;

const state = {
  type: "all",
  roles: new Set(),
  tech: new Set(),
  uni: new Set(),
  query: "",
  sortBy: "trending",
  currentPage: 1,
  requestedIds: new Set(),
  activeDetailId: null
};

const TYPE_META = {
  project: { label: "Project", badgeClass: "badge-project", avatarClass: "avatar-project", letter: "P" },
  hackathon: { label: "Hackathon", badgeClass: "badge-hackathon", avatarClass: "avatar-hackathon", letter: "H" },
  competition: { label: "Competition", badgeClass: "badge-competition", avatarClass: "avatar-competition", letter: "C" }
};

// ==========================================================================
// 3. Filtering & Sorting Logic
// ==========================================================================

function getFilteredListings() {
  const q = state.query.trim().toLowerCase();

  const filtered = listings.filter(item => {
    if (state.type !== "all" && item.type !== state.type) return false;

    if (state.roles.size > 0) {
      const hasRole = item.roles.some(r => state.roles.has(r));
      if (!hasRole) return false;
    }

    if (state.tech.size > 0) {
      const hasTech = item.tech.some(t => state.tech.has(t));
      if (!hasTech) return false;
    }

    if (state.uni.size > 0 && !state.uni.has(item.uni)) return false;

    if (q) {
      const searchable = [
        item.title,
        item.desc,
        item.uni,
        item.leader,
        ...item.roles,
        ...item.tech
      ]
        .join(" ")
        .toLowerCase();
      if (!searchable.includes(q)) return false;
    }

    return true;
  });

  // Sort results
  filtered.sort((a, b) => {
    if (state.sortBy === "likes") return b.likes - a.likes;
    if (state.sortBy === "newest") return a.updatedDays - b.updatedDays;
    // 'trending': weighted mix of likes and recency
    const scoreA = a.likes - a.updatedDays * 3;
    const scoreB = b.likes - b.updatedDays * 3;
    return scoreB - scoreA;
  });

  return filtered;
}

// ==========================================================================
// 4. Render Functions
// ==========================================================================

function renderCatalog() {
  const grid = document.getElementById("objects-grid");
  const emptyState = document.getElementById("empty-state");
  const paginationBar = document.getElementById("pagination-bar");
  if (!grid || !emptyState) return;

  const items = getFilteredListings();

  renderActiveFiltersBar();

  if (items.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.remove("hidden");
    paginationBar?.classList.add("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  if (state.currentPage > totalPages) state.currentPage = totalPages;

  const startIdx = (state.currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = items.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  grid.innerHTML = pageItems.map(buildCardHTML).join("");

  // Attach card listeners
  grid.querySelectorAll(".hf-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = Number(card.getAttribute("data-id"));
      openDetailModal(id);
    });
  });

  renderPagination(totalPages);
}

function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = [1];
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

function renderPagination(totalPages) {
  const bar = document.getElementById("pagination-bar");
  if (!bar) return;

  if (totalPages <= 1) {
    bar.innerHTML = "";
    bar.classList.add("hidden");
    return;
  }

  bar.classList.remove("hidden");
  const current = state.currentPage;
  const pages = getPageNumbers(current, totalPages);

  const pageButtons = pages
    .map(p => {
      if (p === "...") {
        return `<span class="page-ellipsis" aria-hidden="true">…</span>`;
      }
      const isActive = p === current;
      return `<button class="page-btn ${isActive ? "active" : ""}" data-page="${p}" type="button" ${isActive ? 'aria-current="page"' : ""}>${p}</button>`;
    })
    .join("");

  bar.innerHTML = `
    <button class="page-btn" data-page="${current - 1}" type="button" ${current === 1 ? "disabled" : ""}>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      <span>Previous</span>
    </button>
    ${pageButtons}
    <button class="page-btn" data-page="${current + 1}" type="button" ${current === totalPages ? "disabled" : ""}>
      <span>Next</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  `;

  bar.querySelectorAll(".page-btn:not(:disabled)").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetPage = Number(btn.getAttribute("data-page"));
      if (!targetPage || targetPage === state.currentPage) return;
      state.currentPage = targetPage;
      renderCatalog();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function buildCardHTML(item) {
  const meta = TYPE_META[item.type] || TYPE_META.project;
  const isRequested = state.requestedIds.has(item.id);

  const roleTags = item.roles
    .map(r => `<span class="hf-tag hf-tag-role">${escapeHTML(r)}</span>`)
    .join("");

  const techTags = item.tech
    .map(t => `<span class="hf-tag">${escapeHTML(t)}</span>`)
    .join("");

  const requestedBadge = isRequested
    ? `<span class="hf-requested-pill">✓ Requested</span>`
    : "";

  return `
    <article class="hf-card" data-id="${item.id}" tabindex="0">
      <div class="hf-card-header">
        <div class="hf-card-identity">
          <div class="hf-avatar-badge ${meta.avatarClass}">${meta.letter}</div>
          <div class="hf-slug" title="${escapeHTML(item.title)}">
            <span class="hf-name">${escapeHTML(item.title)}</span>
          </div>
        </div>
        <div class="hf-card-right">
          <span class="hf-type-badge ${meta.badgeClass}">${meta.label}</span>
          <span class="hf-likes-badge" aria-label="${item.likes} likes">
            <span>♥</span>
            <span>${item.likes}</span>
          </span>
        </div>
      </div>

      <p class="hf-card-desc">${escapeHTML(item.desc)}</p>

      <div class="hf-tags-row">
        ${roleTags}
        ${techTags}
      </div>

      <div class="hf-card-footer">
        <div class="hf-meta-group">
          <span class="hf-meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            ${escapeHTML(item.uni)}
          </span>
          <span class="hf-meta-item">• ${escapeHTML(item.teamText)}</span>
        </div>
        <div class="hf-meta-group">
          ${requestedBadge}
          <span>${escapeHTML(item.updatedText)}</span>
        </div>
      </div>
    </article>
  `;
}

function renderActiveFiltersBar() {
  const bar = document.getElementById("active-filters-bar");
  const resetBtn = document.getElementById("btn-reset-filters");
  if (!bar || !resetBtn) return;

  const pills = [];

  if (state.type !== "all") {
    pills.push({ group: "type", value: state.type, label: `Type: ${TYPE_META[state.type]?.label || state.type}` });
  }
  state.roles.forEach(val => pills.push({ group: "role", value: val, label: `Role: ${val}` }));
  state.tech.forEach(val => pills.push({ group: "tech", value: val, label: `Tech: ${val}` }));
  state.uni.forEach(val => pills.push({ group: "uni", value: val, label: `Uni: ${val}` }));
  if (state.query.trim()) {
    pills.push({ group: "query", value: state.query, label: `Search: "${state.query.trim()}"` });
  }

  if (pills.length === 0) {
    bar.innerHTML = "";
    bar.classList.add("hidden");
    resetBtn.classList.add("hidden");
    return;
  }

  resetBtn.classList.remove("hidden");
  bar.classList.remove("hidden");
  bar.innerHTML = pills
    .map(
      p => `
      <button class="active-filter-pill" data-group="${escapeHTML(p.group)}" data-value="${escapeHTML(p.value)}" type="button">
        <span>${escapeHTML(p.label)}</span>
        <span>&times;</span>
      </button>
    `
    )
    .join("");

  bar.querySelectorAll(".active-filter-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      const group = btn.getAttribute("data-group");
      const val = btn.getAttribute("data-value");
      removeSingleFilter(group, val);
    });
  });
}

// ==========================================================================
// 5. Filter & Interaction Handlers
// ==========================================================================

function syncSidebarChips() {
  document.querySelectorAll(".filter-chip").forEach(chip => {
    const group = chip.getAttribute("data-filter");
    const val = chip.getAttribute("data-value");

    let isActive = false;
    if (group === "type") isActive = state.type === val;
    else if (group === "role") isActive = state.roles.has(val);
    else if (group === "tech") isActive = state.tech.has(val);
    else if (group === "uni") isActive = state.uni.has(val);

    chip.classList.toggle("active", isActive);
  });
}

function removeSingleFilter(group, val) {
  if (group === "type") state.type = "all";
  else if (group === "role") state.roles.delete(val);
  else if (group === "tech") state.tech.delete(val);
  else if (group === "uni") state.uni.delete(val);
  else if (group === "query") {
    state.query = "";
    const input = document.getElementById("search-input");
    const clearBtn = document.getElementById("search-clear");
    if (input) input.value = "";
    clearBtn?.classList.add("hidden");
  }
  state.currentPage = 1;
  syncSidebarChips();
  renderCatalog();
}

function resetAllFilters() {
  state.type = "all";
  state.roles.clear();
  state.tech.clear();
  state.uni.clear();
  state.query = "";
  state.currentPage = 1;

  const searchInput = document.getElementById("search-input");
  const searchClear = document.getElementById("search-clear");
  if (searchInput) searchInput.value = "";
  searchClear?.classList.add("hidden");

  syncSidebarChips();
  renderCatalog();
}

function setupFiltersAndSearch() {
  // Sidebar chip clicks
  document.querySelectorAll(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const group = chip.getAttribute("data-filter");
      const val = chip.getAttribute("data-value");

      if (group === "type") {
        state.type = val;
      } else {
        const targetSet =
          group === "role" ? state.roles : group === "tech" ? state.tech : state.uni;
        if (targetSet.has(val)) targetSet.delete(val);
        else targetSet.add(val);
      }

      state.currentPage = 1;
      syncSidebarChips();
      renderCatalog();
    });
  });

  // Reset buttons
  document.getElementById("btn-reset-filters")?.addEventListener("click", resetAllFilters);
  document.getElementById("btn-empty-reset")?.addEventListener("click", resetAllFilters);

  // Live search
  const searchInput = document.getElementById("search-input");
  const searchClear = document.getElementById("search-clear");

  searchInput?.addEventListener("input", e => {
    state.query = e.target.value;
    state.currentPage = 1;
    searchClear?.classList.toggle("hidden", state.query.length === 0);
    renderCatalog();
  });

  searchClear?.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    state.query = "";
    state.currentPage = 1;
    searchClear.classList.add("hidden");
    renderCatalog();
  });

  // Sort select
  document.getElementById("sort-select")?.addEventListener("change", e => {
    state.sortBy = e.target.value;
    state.currentPage = 1;
    renderCatalog();
  });
}

function applyInitialUrlFilter() {
  const params = new URLSearchParams(window.location.search);
  const typeParam = params.get("type");
  if (typeParam && TYPE_META[typeParam]) {
    state.type = typeParam;
    syncSidebarChips();
  }
}

// ==========================================================================
// 6. Modals (Object Detail & Create Listing)
// ==========================================================================

function openDetailModal(id) {
  const item = listings.find(l => l.id === id);
  if (!item) return;

  state.activeDetailId = id;
  const meta = TYPE_META[item.type] || TYPE_META.project;
  const modal = document.getElementById("detail-modal");
  const typeBadge = document.getElementById("detail-type-badge");

  typeBadge.textContent = meta.label;
  typeBadge.className = `hf-type-badge ${meta.badgeClass}`;

  document.getElementById("detail-title").textContent = item.title;
  document.getElementById("detail-desc").textContent = item.desc;
  document.getElementById("detail-leader").textContent = item.leader;
  document.getElementById("detail-uni").textContent = item.uni;
  document.getElementById("detail-team").textContent = item.teamText;

  document.getElementById("detail-roles").innerHTML = item.roles
    .map(r => `<span class="hf-tag hf-tag-role">${escapeHTML(r)}</span>`)
    .join("");
  document.getElementById("detail-tech").innerHTML = item.tech
    .map(t => `<span class="hf-tag">${escapeHTML(t)}</span>`)
    .join("");

  updateApplyButtonState();
  modal?.classList.remove("hidden");
}

function updateApplyButtonState() {
  const applyBtn = document.getElementById("detail-apply-btn");
  if (!applyBtn || state.activeDetailId === null) return;

  const isRequested = state.requestedIds.has(state.activeDetailId);
  applyBtn.textContent = isRequested ? "✓ Invitation Requested" : "Request Invitation";
  applyBtn.classList.toggle("btn-secondary", isRequested);
  applyBtn.classList.toggle("btn-primary", !isRequested);
}

function setupModals() {
  const detailModal = document.getElementById("detail-modal");
  const createModal = document.getElementById("create-modal");
  const createForm = document.getElementById("create-form");

  const closeDetail = () => detailModal?.classList.add("hidden");
  const closeCreate = () => createModal?.classList.add("hidden");

  document.getElementById("detail-close-btn")?.addEventListener("click", closeDetail);
  document.getElementById("detail-cancel-btn")?.addEventListener("click", closeDetail);

  document.getElementById("detail-apply-btn")?.addEventListener("click", () => {
    if (state.activeDetailId === null) return;
    const item = listings.find(l => l.id === state.activeDetailId);
    if (state.requestedIds.has(state.activeDetailId)) {
      state.requestedIds.delete(state.activeDetailId);
      showToast(`Cancelled invitation request for "${item?.title}".`);
    } else {
      state.requestedIds.add(state.activeDetailId);
      showToast(`Invitation request sent to ${item?.leader}!`);
    }
    updateApplyButtonState();
    renderCatalog();
  });

  const openCreate = () => {
    createForm?.reset();
    createModal?.classList.remove("hidden");
  };

  document.getElementById("btn-new-listing")?.addEventListener("click", openCreate);
  document.getElementById("mobile-btn-new-listing")?.addEventListener("click", openCreate);
  document.getElementById("create-close-btn")?.addEventListener("click", closeCreate);
  document.getElementById("create-cancel-btn")?.addEventListener("click", closeCreate);

  createForm?.addEventListener("submit", e => {
    e.preventDefault();
    const type = document.getElementById("new-type").value;
    const title = document.getElementById("new-title").value.trim();
    const uni = document.getElementById("new-uni").value.trim();
    const rolesRaw = document.getElementById("new-roles").value;
    const techRaw = document.getElementById("new-tech").value;
    const desc = document.getElementById("new-desc").value.trim();

    const newItem = {
      id: Date.now(),
      type,
      title,
      desc,
      roles: rolesRaw.split(",").map(s => s.trim()).filter(Boolean),
      tech: techRaw.split(",").map(s => s.trim()).filter(Boolean),
      uni,
      leader: "You (Verified Student)",
      teamText: type === "project" ? "1 / 4 members" : "1 team forming",
      updatedText: "Just now",
      updatedDays: 0,
      likes: 1
    };

    listings.unshift(newItem);
    state.currentPage = 1;
    closeCreate();
    renderCatalog();
    showToast(`Published "${title}" to UniForge Hub!`);
  });

  // Backdrop and Escape closing
  [detailModal, createModal].forEach(modal => {
    modal?.addEventListener("click", e => {
      if (e.target === modal) modal.classList.add("hidden");
    });
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeDetail();
      closeCreate();
    }
  });
}

// ==========================================================================
// 7. Mobile Navigation & Filter Drawer
// ==========================================================================

function setupResponsiveDrawers() {
  // Mobile navbar drawer
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const hamburgerIcon = toggleBtn?.querySelector(".hamburger-icon");
  const closeIcon = toggleBtn?.querySelector(".close-icon");

  if (toggleBtn && mobileMenu) {
    const toggleNav = open => {
      const isOpen = open !== undefined ? open : !mobileMenu.classList.contains("open");
      mobileMenu.classList.toggle("open", isOpen);
      hamburgerIcon?.classList.toggle("hidden", isOpen);
      closeIcon?.classList.toggle("hidden", !isOpen);
    };

    toggleBtn.addEventListener("click", () => toggleNav());
    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => toggleNav(false));
    });
  }

  // Mobile filter sidebar drawer
  const sidebar = document.getElementById("filter-sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  const openFilterBtn = document.getElementById("btn-mobile-filter");
  const closeFilterBtn = document.getElementById("btn-close-sidebar");

  const toggleSidebar = open => {
    sidebar?.classList.toggle("open", open);
    backdrop?.classList.toggle("hidden", !open);
  };

  openFilterBtn?.addEventListener("click", () => toggleSidebar(true));
  closeFilterBtn?.addEventListener("click", () => toggleSidebar(false));
  backdrop?.addEventListener("click", () => toggleSidebar(false));
}

// ==========================================================================
// 8. Utilities & Initialization
// ==========================================================================

function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${escapeHTML(message)}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3300);
}

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setupFooterYear() {
  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  applyInitialUrlFilter();
  setupFiltersAndSearch();
  setupModals();
  setupResponsiveDrawers();
  setupFooterYear();
  renderCatalog();
});

