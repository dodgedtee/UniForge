const projects = [
  {
    id: 1,
    title: "some project",
    desc: "description of some project",
    tech: ["Python", "LangGraph", "React", "FastAPI"],
    role: "Frontend Developer",
    uni: "SDU University"
  },
  {
    id: 2,
    title: "FinTrack API",
    desc: "A robust, high-performance financial tracking API designed for student clubs to manage budgets and event expenses seamlessly.",
    tech: ["Java", "Spring Boot", "PostgreSQL"],
    role: "QA Tester",
    uni: "KBTU"
  },
  {
    id: 3,
    title: "EcoCampus Insights",
    desc: "Mobile application tracking campus energy usage and incentivizing sustainable choices among students via gamification.",
    tech: ["React Native", "Node.js", "MongoDB"],
    role: "UI/UX Designer",
    uni: "Nazarbayev University"
  },
  {
    id: 4,
    title: "CyberDefense Sandbox",
    desc: "An isolated virtual environment for practicing network security protocols and red-team penetration testing scenarios.",
    tech: ["Docker", "Bash", "Go"],
    role: "Security Enthusiast",
    uni: "AIT"
  }
];

const hackathons = [
  {
    id: 1,
    title: "Almaty Hub Incubation Hackathon",
    org: "Astana Hub",
    date: "Nov 15 - 17, 2026",
    teamsCount: 3,
    lookingFor: "Backend Devs"
  },
  {
    id: 2,
    title: "CAIR Selection Competition",
    org: "Center for AI Research",
    date: "Dec 01 - 02, 2026",
    teamsCount: 5,
    lookingFor: "ML/NLP Specialists"
  },
  {
    id: 3,
    title: "FinTech Innovators Jam",
    org: "Jusan Bank & KBTU",
    date: "Dec 10 - 12, 2026",
    teamsCount: 2,
    lookingFor: "Blockchain Devs"
  }
];

const myRequests = [
  {
    id: 101,
    title: "Almaty Hub Incubation Hackathon",
    org: "Astana Hub",
    date: "Nov 15 - 17, 2026",
    teamsCount: 1,
    lookingFor: "Full-Stack Dev",
    status: "Pending Response"
  }
];

let currentMatchmakingTab = "upcoming";

const icons = {
  mapPin: `
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  `,
  briefcase: `
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  `,
  arrowRight: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  `,
  calendar: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  `,
  users: `
    <svg class="metric-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,
  search: `
    <svg class="metric-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,
  chevronRight: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  `
};

function renderProjects(projectList) {
  const container = document.getElementById("projects-grid");
  if (!container) return;

  if (projectList.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--slate-500); padding: 2rem;">No open projects found.</p>`;
    return;
  }

  container.innerHTML = projectList
    .map(proj => {
      const techTags = proj.tech
        .map(t => `<span class="tech-tag">${escapeHTML(t)}</span>`)
        .join("");

      return `
        <article class="project-card" data-id="${proj.id}">
          <div class="project-header">
            <div>
              <h3 class="project-title">${escapeHTML(proj.title)}</h3>
              <div class="project-uni">
                ${icons.mapPin}
                <span>${escapeHTML(proj.uni)}</span>
              </div>
            </div>
            <span class="badge-active">Active</span>
          </div>

          <p class="project-desc">${escapeHTML(proj.desc)}</p>

          <div class="meta-group">
            <div>
              <span class="meta-label">Tech Stack</span>
              <div class="tech-stack-container">
                ${techTags}
              </div>
            </div>
            <div>
              <span class="meta-label">Looking For</span>
              <div class="role-badge">
                ${icons.briefcase}
                <span>${escapeHTML(proj.role)}</span>
              </div>
            </div>
          </div>

          <button class="btn btn-dark btn-contribute" data-title="${escapeHTML(proj.title)}">
            <span>Contribute</span>
            ${icons.arrowRight}
          </button>
        </article>
      `;
    })
    .join("");

  container.querySelectorAll(".btn-contribute").forEach(button => {
    button.addEventListener("click", e => {
      e.stopPropagation();
      const title = button.getAttribute("data-title");
      showToast(`Request to contribute to "${title}" sent!`);
    });
  });
}

function renderHackathons(hackathonList) {
  const container = document.getElementById("hackathons-list");
  if (!container) return;

  if (hackathonList.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--slate-500); padding: 2rem; background: var(--white); border-radius: 0.75rem; border: 1px dashed var(--slate-300);">
        <p style="margin-bottom: 0.5rem; font-weight: 500;">No matchmaking requests yet.</p>
        <p style="font-size: 0.875rem;">Create a request to find hackathon teammates.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = hackathonList
    .map(hack => {
      const statusBadge = hack.status
        ? `<div style="font-size: 0.75rem; color: var(--blue-600); font-weight: 600; margin-top: 0.25rem;">Status: ${escapeHTML(hack.status)}</div>`
        : "";

      return `
        <article class="hackathon-card" data-id="${hack.id}">
          <div class="hackathon-accent-bar"></div>
          <div class="hackathon-content">
            <div class="hackathon-icon-box">
              ${icons.calendar}
            </div>
            <div class="hackathon-details">
              <h4 class="hackathon-title">${escapeHTML(hack.title)}</h4>
              <p class="hackathon-meta">${escapeHTML(hack.org)} • ${escapeHTML(hack.date)}</p>
              ${statusBadge}

              <div class="hackathon-metrics">
                <div class="metric-item">
                  ${icons.users}
                  <span><span class="teams-count-bold">${hack.teamsCount} teams</span> currently forming</span>
                </div>
                <div class="metric-item">
                  ${icons.search}
                  <span>High demand: <span class="demand-tag">${escapeHTML(hack.lookingFor)}</span></span>
                </div>
              </div>

              <button class="btn-view-teams" data-title="${escapeHTML(hack.title)}">
                <span>View Teams</span>
                ${icons.chevronRight}
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  container.querySelectorAll(".btn-view-teams").forEach(button => {
    button.addEventListener("click", e => {
      e.stopPropagation();
      const title = button.getAttribute("data-title");
      showToast(`Loading teams for "${title}"...`);
    });
  });
}

function setupTabs() {
  const tabUpcoming = document.getElementById("tab-upcoming");
  const tabRequests = document.getElementById("tab-requests");

  if (!tabUpcoming || !tabRequests) return;

  tabUpcoming.addEventListener("click", () => {
    if (currentMatchmakingTab === "upcoming") return;
    currentMatchmakingTab = "upcoming";
    tabUpcoming.classList.add("active");
    tabRequests.classList.remove("active");
    renderHackathons(hackathons);
  });

  tabRequests.addEventListener("click", () => {
    if (currentMatchmakingTab === "requests") return;
    currentMatchmakingTab = "requests";
    tabRequests.classList.add("active");
    tabUpcoming.classList.remove("active");
    renderHackathons(myRequests);
  });
}

function setupMobileMenu() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const hamburgerIcon = toggleBtn?.querySelector(".hamburger-icon");
  const closeIcon = toggleBtn?.querySelector(".close-icon");

  if (!toggleBtn || !mobileMenu) return;

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !mobileMenu.classList.contains("open");
    if (isOpen) {
      mobileMenu.classList.add("open");
      hamburgerIcon?.classList.add("hidden");
      closeIcon?.classList.remove("hidden");
    } else {
      mobileMenu.classList.remove("open");
      hamburgerIcon?.classList.remove("hidden");
      closeIcon?.classList.add("hidden");
    }
  }

  toggleBtn.addEventListener("click", () => toggleMenu());

  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  document.addEventListener("click", e => {
    if (!toggleBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      toggleMenu(false);
    }
  });
}

function setupModal() {
  const modal = document.getElementById("action-modal");
  const modalTitle = document.getElementById("modal-title");
  const closeBtn = document.getElementById("modal-close-btn");
  const cancelBtn = document.getElementById("modal-cancel-btn");
  const form = document.getElementById("action-form");

  const btnNewPost = document.getElementById("btn-new-post");
  const btnMobileNewPost = document.getElementById("mobile-btn-new-post");
  const btnListHackathon = document.getElementById("btn-list-hackathon");

  let activeModalType = "project";

  function openModal(type) {
    activeModalType = type;
    if (type === "project") {
      modalTitle.textContent = "Share a Project";
      document.querySelector('label[for="post-uni"]').textContent = "University";
      document.querySelector('label[for="post-role"]').textContent = "Looking For (Role)";
      document.getElementById("post-role").placeholder = "e.g. Frontend Developer";
      document.getElementById("post-tech").parentElement.style.display = "flex";
    } else {
      modalTitle.textContent = "List a Hackathon";
      document.querySelector('label[for="post-uni"]').textContent = "Organizer / Host";
      document.querySelector('label[for="post-role"]').textContent = "Key Demand Role";
      document.getElementById("post-role").placeholder = "e.g. AI / ML Specialists";
      document.getElementById("post-tech").parentElement.style.display = "none";
    }

    form.reset();
    modal.classList.remove("hidden");
  }

  function closeModal() {
    modal.classList.add("hidden");
  }

  btnNewPost?.addEventListener("click", () => openModal("project"));
  btnMobileNewPost?.addEventListener("click", () => openModal("project"));
  btnListHackathon?.addEventListener("click", () => openModal("hackathon"));

  closeBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);

  modal?.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });

  form?.addEventListener("submit", e => {
    e.preventDefault();

    const title = document.getElementById("post-title").value.trim();
    const uni = document.getElementById("post-uni").value.trim();
    const role = document.getElementById("post-role").value.trim();
    const techRaw = document.getElementById("post-tech").value.trim();
    const desc = document.getElementById("post-desc").value.trim();

    if (activeModalType === "project") {
      const tech = techRaw ? techRaw.split(",").map(t => t.trim()).filter(Boolean) : ["General"];
      const newProj = {
        id: Date.now(),
        title,
        desc,
        tech,
        role,
        uni
      };
      projects.unshift(newProj);
      renderProjects(projects);
      showToast("Project successfully published!");
    } else {
      const newHack = {
        id: Date.now(),
        title,
        org: uni,
        date: "Upcoming (2026)",
        teamsCount: 1,
        lookingFor: role
      };
      hackathons.unshift(newHack);
      if (currentMatchmakingTab === "upcoming") {
        renderHackathons(hackathons);
      }
      showToast("Hackathon successfully listed!");
    }

    closeModal();
  });
}

function setupHeroActions() {
  const btnFindProject = document.getElementById("btn-find-project");
  const btnFindTeammates = document.getElementById("btn-find-teammates");
  const viewAllProjectsDesktop = document.getElementById("view-all-projects-desktop");
  const viewAllProjectsMobile = document.getElementById("view-all-projects-mobile");

  btnFindProject?.addEventListener("click", () => {
    const target = document.getElementById("projects-section");
    target?.scrollIntoView({ behavior: "smooth" });
  });

  btnFindTeammates?.addEventListener("click", () => {
    const target = document.getElementById("matchmaking-section");
    target?.scrollIntoView({ behavior: "smooth" });
  });

  const handleViewAll = e => {
    e.preventDefault();
    showToast("Displaying all verified student projects.");
  };

  viewAllProjectsDesktop?.addEventListener("click", handleViewAll);
  viewAllProjectsMobile?.addEventListener("click", handleViewAll);
}

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
  }, 3000);
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
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderProjects(projects);
  renderHackathons(hackathons);
  setupTabs();
  setupMobileMenu();
  setupModal();
  setupHeroActions();
  setupFooterYear();
});

