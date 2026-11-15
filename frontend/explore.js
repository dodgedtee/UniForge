/**
 * UniForge - Explorer Hub Logic (Hugging Face Model Hub Inspired)
 * Handles multi-dimensional filtering, sorting, search, pagination, and listing creation.
 */

const {
  TYPE_META,
  getListings,
  addCustomListing,
  getRequestedIds,
  formatContributorsLabel,
  escapeHTML,
  showToast,
  setupFooterYear,
  setupMobileNav
} = window.UniForgeData;

// ==========================================================================
// 1. Application State
// ==========================================================================

let listings = getListings();
const ITEMS_PER_PAGE = 10;

const state = {
  type: "all",
  roles: new Set(),
  tech: new Set(),
  uni: new Set(),
  query: "",
  sortBy: "trending",
  currentPage: 1,
  requestedIds: getRequestedIds()
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
    <a class="hf-card" href="project.html?id=${item.id}">
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
          <span class="hf-meta-item">• ${escapeHTML(formatContributorsLabel(item, state.requestedIds, true))}</span>
        </div>
        <div class="hf-meta-group">
          ${requestedBadge}
          <span>${escapeHTML(item.updatedText)}</span>
        </div>
      </div>
    </a>
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
// 6. Create Listing Modal
// ==========================================================================

function setupCreateModal() {
  const createModal = document.getElementById("create-modal");
  const createForm = document.getElementById("create-form");
  const closeCreate = () => createModal?.classList.add("hidden");

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
      overview: desc,
      roles: rolesRaw.split(",").map(s => s.trim()).filter(Boolean),
      tech: techRaw.split(",").map(s => s.trim()).filter(Boolean),
      uni,
      leader: "You (Verified Student)",
      contributorsCount: 1,
      updatedText: "Just now",
      updatedDays: 0,
      likes: 1
    };

    addCustomListing(newItem);
    listings = getListings();
    state.currentPage = 1;
    closeCreate();
    renderCatalog();
    showToast(`Published "${title}" to UniForge Hub!`);
  });

  createModal?.addEventListener("click", e => {
    if (e.target === createModal) closeCreate();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeCreate();
  });
}

// ==========================================================================
// 7. Mobile Filter Drawer & Initialization
// ==========================================================================

function setupFilterDrawer() {
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

document.addEventListener("DOMContentLoaded", () => {
  applyInitialUrlFilter();
  setupFiltersAndSearch();
  setupCreateModal();
  setupMobileNav();
  setupFilterDrawer();
  setupFooterYear();
  renderCatalog();
});

window.addEventListener("pageshow", () => {
  listings = getListings();
  state.requestedIds = getRequestedIds();
  renderCatalog();
});

