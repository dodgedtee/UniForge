/**
 * UniForge - Project & Hackathon Detail Page Logic
 * Loads listing info by URL ?id=... and handles the Contribute flow.
 */

const ABOUT_LABELS = {
  project: "About This Project",
  hackathon: "About This Hackathon",
  competition: "About This Competition"
};

const CONTRIBUTE_LABELS = {
  project: "Ready to Contribute?",
  hackathon: "Ready to Join This Hackathon Team?",
  competition: "Ready to Join This Squad?"
};

function renderProjectDetail() {
  const { TYPE_META, getListings, getRequestedIds, toggleRequestedId, showToast } =
    window.UniForgeData;

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
  document.title = `${item.title} — UniForge`;

  const typeBadge = document.getElementById("project-type-badge");
  typeBadge.textContent = meta.label;
  typeBadge.className = `hf-type-badge ${meta.badgeClass}`;

  document.getElementById("project-likes-count").textContent = item.likes;
  document.getElementById("project-title").textContent = item.title;
  document.getElementById("project-summary").textContent = item.desc;
  document.getElementById("project-uni").textContent = item.uni;
  document.getElementById("project-leader").textContent = item.leader;
  document.getElementById("project-team").textContent = item.teamText;
  document.getElementById("project-updated").textContent = item.updatedText;

  document.getElementById("about-heading").textContent =
    ABOUT_LABELS[item.type] || ABOUT_LABELS.project;
  document.getElementById("project-overview").textContent = item.overview || item.desc;

  document.getElementById("contribute-heading").textContent =
    CONTRIBUTE_LABELS[item.type] || CONTRIBUTE_LABELS.project;

  const contributeForm = document.getElementById("contribute-form");
  const contributeBtn = document.getElementById("btn-contribute");
  const statusText = document.getElementById("contribute-status-text");
  const noteInput = document.getElementById("contribute-note");

  function syncContributeState() {
    const isRequested = getRequestedIds().has(item.id);
    if (isRequested) {
      contributeBtn.innerHTML = `<span>&#10003; Contribution Invite Sent</span>`;
      contributeBtn.classList.remove("btn-primary");
      contributeBtn.classList.add("btn-secondary");
      statusText.textContent = `Invite sent to ${item.leader} • Registered for contribution achievements. Click to withdraw.`;
      noteInput.disabled = true;
    } else {
      contributeBtn.innerHTML = `
        <span>Contribute</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      `;
      contributeBtn.classList.remove("btn-secondary");
      contributeBtn.classList.add("btn-primary");
      statusText.textContent = "Verified students • Registers project for future contribution achievements";
      noteInput.disabled = false;
    }
  }

  syncContributeState();

  contributeForm?.addEventListener("submit", e => {
    e.preventDefault();
    const added = toggleRequestedId(item.id);
    if (added) {
      showToast(`Invite sent to ${item.leader}! Project registered to count your future contributions.`);
    } else {
      showToast(`Withdrew contribution invite for "${item.title}".`);
    }
    syncContributeState();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  window.UniForgeData.setupMobileNav();
  window.UniForgeData.setupFooterYear();
  renderProjectDetail();
});

