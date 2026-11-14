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
    owner: "sdu-labs",
    name: "NarrAI-Storyteller",
    title: "NarrAI - Multi-Agent Storyteller",
    desc: "Experimental platform where multiple LLM agents collaborate to write interactive, branching storylines in real-time with user steering.",
    roles: ["Frontend", "AI / ML"],
    tech: ["Python", "LangGraph", "React", "FastAPI"],
    uni: "SDU",
    leader: "Alikhan Saparov",
    rating: 4.9,
    teamText: "3 / 5 members",
    updatedText: "2 hours ago",
    updatedDays: 0.1,
    likes: 42
  },
  {
    id: 2,
    type: "hackathon",
    owner: "astana-hub",
    name: "Almaty-Incubation-Jam",
    title: "Almaty Hub Incubation Hackathon",
    desc: "48-hour flagship hackathon building scalable civic-tech and AI startups. Multiple university student teams currently recruiting backend & ML builders.",
    roles: ["Backend", "AI / ML", "UI/UX"],
    tech: ["Python", "FastAPI", "PostgreSQL", "Docker"],
    uni: "Astana Hub",
    leader: "Astana Hub Org",
    rating: 4.8,
    teamText: "3 teams forming",
    updatedText: "5 hours ago",
    updatedDays: 0.2,
    likes: 68
  },
  {
    id: 3,
    type: "project",
    owner: "kbtu-fintech",
    name: "FinTrack-Student-API",
    title: "FinTrack Student Club API",
    desc: "High-performance financial tracking and transparent budget ledger API designed for university student clubs and event treasurers.",
    roles: ["QA", "Backend"],
    tech: ["Java", "PostgreSQL", "Docker"],
    uni: "KBTU",
    leader: "Dana Bekova",
    rating: 4.7,
    teamText: "2 / 4 members",
    updatedText: "1 day ago",
    updatedDays: 1,
    likes: 29
  },
  {
    id: 4,
    type: "project",
    owner: "nu-green-tech",
    name: "EcoCampus-Insights",
    title: "EcoCampus Insights Mobile",
    desc: "Cross-platform mobile app tracking campus energy usage and incentivizing sustainable student habits through gamified challenges.",
    roles: ["Mobile", "UI/UX", "Backend"],
    tech: ["Flutter", "Node.js", "PostgreSQL"],
    uni: "Nazarbayev University",
    leader: "Timur Nurlanov",
    rating: 4.9,
    teamText: "4 / 5 members",
    updatedText: "1 day ago",
    updatedDays: 1.2,
    likes: 51
  },
  {
    id: 5,
    type: "hackathon",
    owner: "cair-research",
    name: "CAIR-AI-Selection-2026",
    title: "CAIR Selection AI Competition",
    desc: "Applied NLP and LLM optimization challenge hosted by Center for AI Research. Looking for strong Python & prompt-engineering teammates.",
    roles: ["AI / ML", "Backend"],
    tech: ["Python", "LangGraph", "FastAPI"],
    uni: "Nazarbayev University",
    leader: "Amina Serikova",
    rating: 5.0,
    teamText: "5 teams forming",
    updatedText: "2 days ago",
    updatedDays: 2,
    likes: 84
  },
  {
    id: 6,
    type: "project",
    owner: "aitu-sec",
    name: "CyberDefense-Sandbox",
    title: "CyberDefense Red-Team Sandbox",
    desc: "Isolated containerized virtual labs for university students to practice network defense, CTF challenges, and penetration testing safely.",
    roles: ["Security", "Backend"],
    tech: ["Docker", "Go", "Python"],
    uni: "AITU",
    leader: "Dias Marat",
    rating: 4.6,
    teamText: "2 / 4 members",
    updatedText: "3 days ago",
    updatedDays: 3,
    likes: 37
  },
  {
    id: 7,
    type: "competition",
    owner: "icpc-kz-prep",
    name: "ICPC-Regional-Squad-B",
    title: "ICPC Regional Training Squad",
    desc: "Weekly dynamic programming, graph theory, and Div.1 Codeforces virtual contests preparing a 3-student team for upcoming regionals.",
    roles: ["Algorithms"],
    tech: ["C++", "Python"],
    uni: "KBTU",
    leader: "Erlan Tolegen",
    rating: 4.9,
    teamText: "2 / 3 members",
    updatedText: "4 days ago",
    updatedDays: 4,
    likes: 33
  },
  {
    id: 8,
    type: "hackathon",
    owner: "kbtu-jusan",
    name: "FinTech-Innovators-Jam",
    title: "FinTech Innovators Jam",
    desc: "Build next-gen micro-investing and student payment tools in 36 hours. Mentorship from senior banking engineers and cash prizes.",
    roles: ["Frontend", "Backend", "UI/UX"],
    tech: ["React", "Node.js", "Go", "PostgreSQL"],
    uni: "KBTU",
    leader: "Jusan & KBTU",
    rating: 4.5,
    teamText: "2 teams forming",
    updatedText: "5 days ago",
    updatedDays: 5,
    likes: 47
  },
  {
    id: 9,
    type: "project",
    owner: "sdu-edu",
    name: "StudySync-Peer-Notes",
    title: "StudySync Collaborative Notes",
    desc: "Real-time markdown workspace with AI flashcard generation and shared course roadmaps built by SDU sophomore students.",
    roles: ["Frontend", "UI/UX", "QA"],
    tech: ["React", "Node.js", "PostgreSQL"],
    uni: "SDU",
    leader: "Madina Karim",
    rating: 4.4,
    teamText: "3 / 6 members",
    updatedText: "6 days ago",
    updatedDays: 6,
    likes: 21
  },
  {
    id: 10,
    type: "competition",
    owner: "aitu-algo",
    name: "AITU-CodeCup-2026",
    title: "AITU Algorithmic CodeCup",
    desc: "Inter-university team competitive programming sprint focusing on greedy algorithms, segment trees, and speed problem solving.",
    roles: ["Algorithms"],
    tech: ["C++", "Java"],
    uni: "AITU",
    leader: "Nursultan Zhan",
    rating: 4.8,
    teamText: "4 teams forming",
    updatedText: "1 week ago",
    updatedDays: 7,
    likes: 39
  }
];

// ==========================================================================
// 2. Application State
// ==========================================================================

const state = {
  type: "all",
  roles: new Set(),
  tech: new Set(),
  uni: new Set(),
  minRating: 0,
  query: "",
  sortBy: "trending",
  starredIds: new Set([1, 5]),
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
    if (item.rating < state.minRating) return false;

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
        item.owner,
        item.name,
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
    if (state.sortBy === "rating") return b.rating - a.rating || b.likes - a.likes;
    if (state.sortBy === "likes") return b.likes - a.likes;
    if (state.sortBy === "newest") return a.updatedDays - b.updatedDays;
    // 'trending': weighted mix of likes, rating, and recency
    const scoreA = a.likes + a.rating * 10 - a.updatedDays * 3;
    const scoreB = b.likes + b.rating * 10 - b.updatedDays * 3;
    return scoreB - scoreA;
  });

  return filtered;
}

// ==========================================================================
// 4. Render Functions
// ==========================================================================

function renderCatalog() {
  const grid = document.getElementById("objects-grid");
  const countBadge = document.getElementById("result-count");
  const emptyState = document.getElementById("empty-state");
  if (!grid || !countBadge || !emptyState) return;

  const items = getFilteredListings();
  countBadge.textContent = items.length;

  renderActiveFiltersBar();

  if (items.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  grid.innerHTML = items.map(buildCardHTML).join("");

  // Attach card and star listeners
  grid.querySelectorAll(".hf-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = Number(card.getAttribute("data-id"));
      openDetailModal(id);
    });
  });

  grid.querySelectorAll(".hf-star-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const id = Number(btn.getAttribute("data-id"));
      toggleStar(id);
    });
  });
}

function buildCardHTML(item) {
  const meta = TYPE_META[item.type] || TYPE_META.project;
  const isStarred = state.starredIds.has(item.id);
  const isRequested = state.requestedIds.has(item.id);
  const displayLikes = item.likes + (isStarred ? 1 : 0);

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
          <div class="hf-slug" title="${escapeHTML(item.owner)}/${escapeHTML(item.name)}">
            <span class="hf-owner">${escapeHTML(item.owner)}</span><span class="hf-slash">/</span><span class="hf-name">${escapeHTML(item.name)}</span>
          </div>
        </div>
        <div class="hf-card-right">
          <span class="hf-type-badge ${meta.badgeClass}">${meta.label}</span>
          <button class="hf-star-btn ${isStarred ? "starred" : ""}" data-id="${item.id}" type="button" aria-label="Bookmark listing">
            <span>${isStarred ? "♥" : "♡"}</span>
            <span>${displayLikes}</span>
          </button>
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
          <span class="hf-meta-item hf-rating-pill">★ ${item.rating.toFixed(1)}</span>
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
  if (state.minRating > 0) {
    pills.push({ group: "rating", value: String(state.minRating), label: `Rating: ★ ${state.minRating}+` });
  }
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
    else if (group === "rating") isActive = state.minRating === Number(val);

    chip.classList.toggle("active", isActive);
  });
}

function removeSingleFilter(group, val) {
  if (group === "type") state.type = "all";
  else if (group === "role") state.roles.delete(val);
  else if (group === "tech") state.tech.delete(val);
  else if (group === "uni") state.uni.delete(val);
  else if (group === "rating") state.minRating = 0;
  else if (group === "query") {
    state.query = "";
    const input = document.getElementById("search-input");
    const clearBtn = document.getElementById("search-clear");
    if (input) input.value = "";
    clearBtn?.classList.add("hidden");
  }
  syncSidebarChips();
  renderCatalog();
}

function resetAllFilters() {
  state.type = "all";
  state.roles.clear();
  state.tech.clear();
  state.uni.clear();
  state.minRating = 0;
  state.query = "";

  const searchInput = document.getElementById("search-input");
  const searchClear = document.getElementById("search-clear");
  if (searchInput) searchInput.value = "";
  searchClear?.classList.add("hidden");

  syncSidebarChips();
  renderCatalog();
}

function toggleStar(id) {
  if (state.starredIds.has(id)) {
    state.starredIds.delete(id);
  } else {
    state.starredIds.add(id);
  }
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
      } else if (group === "rating") {
        state.minRating = Number(val);
      } else {
        const targetSet =
          group === "role" ? state.roles : group === "tech" ? state.tech : state.uni;
        if (targetSet.has(val)) targetSet.delete(val);
        else targetSet.add(val);
      }

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
    searchClear?.classList.toggle("hidden", state.query.length === 0);
    renderCatalog();
  });

  searchClear?.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    state.query = "";
    searchClear.classList.add("hidden");
    renderCatalog();
  });

  // Sort select
  document.getElementById("sort-select")?.addEventListener("change", e => {
    state.sortBy = e.target.value;
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

  document.getElementById("detail-slug").textContent = `${item.owner} / ${item.name}`;
  document.getElementById("detail-title").textContent = item.title;
  document.getElementById("detail-desc").textContent = item.desc;
  document.getElementById("detail-leader").textContent = item.leader;
  document.getElementById("detail-rating").textContent = `★ ${item.rating.toFixed(1)}`;
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

    const slugName = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "new-listing";
    const ownerSlug = uni.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "student";

    const newItem = {
      id: Date.now(),
      type,
      owner: `${ownerSlug}-team`,
      name: slugName,
      title,
      desc,
      roles: rolesRaw.split(",").map(s => s.trim()).filter(Boolean),
      tech: techRaw.split(",").map(s => s.trim()).filter(Boolean),
      uni,
      leader: "You (Verified Student)",
      rating: 5.0,
      teamText: type === "project" ? "1 / 4 members" : "1 team forming",
      updatedText: "Just now",
      updatedDays: 0,
      likes: 1
    };

    listings.unshift(newItem);
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

