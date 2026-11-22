/**
 * UniForge - Project, Hackathon & Competition Detail Page Logic
 * Loads listing info by URL ?id=... and tailors roles & join/contribute flow by listing type.
 */

const DETAIL_COPY = {
  project: {
    aboutHeading: "About This Project",
    participantsLabel: "Contributing now:",
    contributeHeading: "Ready to Contribute?",
    contributeSubtitle:
      "Send an invite request to register your participation and start counting your contributions toward your student achievements.",
    noteLabel: "Short Note / GitHub or Portfolio Link (Optional)",
    notePlaceholder: "Share how you'd like to help or link your GitHub profile...",
    idleStatus: "Verified students • Registers project for future contribution achievements",
    sentStatus: leader =>
      `Invite sent to ${leader} • Registered for your future contribution achievements.`,
    idleBtn: "Contribute",
    sentBtn: "&#10003; Contribution Invite Sent"
  },
  hackathon: {
    aboutHeading: "About This Hackathon",
    participantsLabel: "Teammates:",
    contributeHeading: "Ready to Join This Hackathon Team?",
    contributeSubtitle:
      "Choose an open role and send a teammate request directly to the hackathon team lead.",
    noteLabel: "Skills, Hackathon Experience, or GitHub Link (Optional)",
    notePlaceholder: "Share your tech stack, past hackathons, or GitHub/portfolio link...",
    idleStatus: "Verified students • Direct teammate request to hackathon lead",
    sentStatus: leader => `Team join request sent to ${leader}.`,
    idleBtn: "Request to Join Team",
    sentBtn: "&#10003; Join Request Sent"
  },
  competition: {
    aboutHeading: "About This Competition",
    participantsLabel: "Teammates:",
    contributeHeading: "Ready to Join This Squad?",
    contributeSubtitle:
      "Pick the role you want to cover and apply to join this competition squad.",
    noteLabel: "Contest Handle / Algorithmic Experience or Note (Optional)",
    notePlaceholder: "Share your Codeforces/LeetCode handle, language preference, or contest history...",
    idleStatus: "Verified students • Direct teammate request to squad lead",
    sentStatus: leader => `Squad join request sent to ${leader}.`,
    idleBtn: "Request to Join Squad",
    sentBtn: "&#10003; Join Request Sent"
  }
};

function renderProjectDetail() {
  const {
    TYPE_META,
    getListings,
    getRequestedIds,
    addRequestedId,
    getLikedIds,
    toggleLikedId,
    getLikesCount,
    isTeamListing,
    formatParticipantsLabel,
    escapeHTML
  } = window.UniForgeData;

  const params = new URLSearchParams(window.location.search);
  const idParam = Number(params.get("id"));
  const listings = getListings();
  const item = listings.find(entry => entry.id === idParam);

  const contentEl = document.getElementById("project-content");
  const notFoundEl = document.getElementById("project-not-found");

  if (!item) {
    contentEl?.classList.add("hidden");
    notFoundEl?.classList.remove("hidden");
    return;
  }

  notFoundEl?.classList.add("hidden");
  contentEl?.classList.remove("hidden");

  const meta = TYPE_META[item.type] || TYPE_META.project;
  const copy = DETAIL_COPY[item.type] || DETAIL_COPY.project;
  const isTeam = isTeamListing(item);

  document.title = `${item.title} — UniForge`;

  const typeBadge = document.getElementById("project-type-badge");
  typeBadge.textContent = meta.label;
  typeBadge.className = `hf-type-badge ${meta.badgeClass}`;

  const likesBtn = document.getElementById("project-likes");
  const likesCountEl = document.getElementById("project-likes-count");

  if (!isTeam && likesBtn && likesCountEl) {
    likesBtn.classList.remove("hidden");
    const syncLikesState = () => {
      const likedIds = getLikedIds();
      const isLiked = likedIds.has(item.id);
      const count = getLikesCount(item, likedIds);
      likesCountEl.textContent = count;
      likesBtn.classList.toggle("is-liked", isLiked);
      likesBtn.setAttribute("aria-pressed", String(isLiked));
      likesBtn.setAttribute("aria-label", `${count} likes`);
      likesBtn.title = isLiked ? "Unlike" : "Like";
    };
    syncLikesState();
    likesBtn.addEventListener("click", () => {
      toggleLikedId(item.id);
      syncLikesState();
    });
  } else {
    likesBtn?.classList.add("hidden");
  }

  document.getElementById("project-title").textContent = item.title;
  document.getElementById("project-summary").textContent = item.desc;
  document.getElementById("project-uni").textContent = item.uni;


    // Project Status and GitHub
    const existingExtra = document.getElementById("project-extra-info");
    existingExtra?.remove();

    if (item.type === "project") {
        const extraInfo = document.createElement("div");
        extraInfo.id = "project-extra-info";

        const status = document.createElement("p");
        const statusValue = item.status === "completed"
            ? "Completed"
            : "In Progress";

        status.textContent = `Project Status: ${statusValue}`;
        extraInfo.appendChild(status);

        // GitHub URL is optional
        if (item.github) {
            try {
                const url = new URL(item.github);

                if (
                    url.protocol === "https:" &&
                    ["github.com", "www.github.com"].includes(
                        url.hostname.toLowerCase()
                    ) &&
                    !url.username &&
                    !url.password
                ) {
                    const link = document.createElement("a");

                    link.href = url.href;
                    link.textContent = "View on GitHub ↗";
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";

                    extraInfo.appendChild(link);
                }
            } catch (error) {
                console.warn("Invalid project GitHub URL:", error);
            }
        }

        document.getElementById("project-uni")
            .insertAdjacentElement("afterend", extraInfo);
    }

  document.getElementById("project-leader").textContent = item.leader;
  document.getElementById("project-participants-label").textContent = copy.participantsLabel;
  document.getElementById("project-created").textContent =
    item.createdText || item.updatedText || "Recently";

  document.getElementById("about-heading").textContent = copy.aboutHeading;
  document.getElementById("project-overview").textContent = item.overview || item.desc;

  // Open roles section shown for hackathons & competitions only
  const rolesSection = document.getElementById("project-roles-section");
  const rolesListEl = document.getElementById("project-roles");
  const roleGroup = document.getElementById("contribute-role-group");
  const roleSelect = document.getElementById("contribute-role");

  if (isTeam) {
    const rolesList = item.roles && item.roles.length > 0 ? item.roles : ["Teammate"];
    rolesSection?.classList.remove("hidden");
    if (rolesListEl) {
      rolesListEl.innerHTML = rolesList
        .map(r => `<span class="hf-tag hf-tag-role">${escapeHTML(r)}</span>`)
        .join("");
    }
    roleGroup?.classList.remove("hidden");
    if (roleSelect) {
      roleSelect.required = true;
      roleSelect.innerHTML = rolesList
        .map(r => `<option value="${escapeHTML(r)}">${escapeHTML(r)}</option>`)
        .join("");
    }
  } else {
    rolesSection?.classList.add("hidden");
    roleGroup?.classList.add("hidden");
    if (roleSelect) roleSelect.required = false;
  }

  document.getElementById("contribute-heading").textContent = copy.contributeHeading;
  document.getElementById("contribute-subtitle").textContent = copy.contributeSubtitle;
  document.getElementById("contribute-note-label").textContent = copy.noteLabel;

  const contributeForm = document.getElementById("contribute-form");
  const contributeBtn = document.getElementById("btn-contribute");
  const statusText = document.getElementById("contribute-status-text");
  const noteInput = document.getElementById("contribute-note");
  if (noteInput) noteInput.placeholder = copy.notePlaceholder;

  function syncActionState() {
    const requestedIds = getRequestedIds();
    const isRequested = requestedIds.has(item.id);
    document.getElementById("project-participants").textContent = formatParticipantsLabel(
      item,
      requestedIds
    );
    if (isRequested) {
      contributeBtn.innerHTML = `<span>${copy.sentBtn}</span>`;
      contributeBtn.classList.remove("btn-primary");
      contributeBtn.classList.add("btn-secondary");
      contributeBtn.disabled = true;
      statusText.textContent = copy.sentStatus(item.leader);
      if (roleSelect) roleSelect.disabled = true;
      noteInput.disabled = true;
    } else {
      contributeBtn.innerHTML = `
        <span>${copy.idleBtn}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      `;
      contributeBtn.classList.remove("btn-secondary");
      contributeBtn.classList.add("btn-primary");
      contributeBtn.disabled = false;
      statusText.textContent = copy.idleStatus;
      if (roleSelect) roleSelect.disabled = false;
      noteInput.disabled = false;
    }
  }

  syncActionState();

  contributeForm?.addEventListener("submit", e => {
    e.preventDefault();
    if (getRequestedIds().has(item.id)) return;
    addRequestedId(item.id);
    syncActionState();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  window.UniForgeData.setupMobileNav();
  window.UniForgeData.setupFooterYear();
  renderProjectDetail();
});
