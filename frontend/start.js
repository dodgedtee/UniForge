/**
 * UniForge - Landing Page JavaScript
 * Handles navigation, modal forms, and UI interactions.
 */

// ==========================================================================
// 1. Mobile Menu Toggle
// ==========================================================================
function setupMobileMenu() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const hamburgerIcon = toggleBtn?.querySelector(".hamburger-icon");
  const closeIcon = toggleBtn?.querySelector(".close-icon");

  if (!toggleBtn || !mobileMenu) return;

  function toggle(open) {
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

  toggleBtn.addEventListener("click", () => toggle());

  // Close when clicking mobile links
  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => toggle(false));
  });

  // Close when clicking outside
  document.addEventListener("click", e => {
    if (!toggleBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      toggle(false);
    }
  });
}

// ==========================================================================
// 2. Sign Up / Early Access Modal
// ==========================================================================
function setupModal() {
  const modal = document.getElementById("join-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const cancelBtn = document.getElementById("modal-cancel-btn");
  const form = document.getElementById("join-form");

  const btnNavJoin = document.getElementById("btn-nav-join");
  const btnMobileJoin = document.getElementById("mobile-btn-join");
  const btnCtaSignup = document.getElementById("btn-cta-signup");

  function openModal() {
    form?.reset();
    modal?.classList.remove("hidden");
  }

  function closeModal() {
    modal?.classList.add("hidden");
  }

  btnNavJoin?.addEventListener("click", openModal);
  btnMobileJoin?.addEventListener("click", openModal);
  btnCtaSignup?.addEventListener("click", openModal);

  closeBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);

  // Close on backdrop click
  modal?.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !modal?.classList.contains("hidden")) {
      closeModal();
    }
  });

  // Handle Form Submission
  form?.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("student-name").value.trim();
    const uni = document.getElementById("student-uni").value.trim();

    closeModal();
    showToast(`Welcome, ${name}! Your student access for ${uni} has been submitted.`);
  });
}

// ==========================================================================
// 3. Smooth Scrolling
// ==========================================================================
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// ==========================================================================
// 4. Toast Notification Utility
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

// ==========================================================================
// 5. Dynamic Footer Year
// ==========================================================================
function setupFooterYear() {
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// ==========================================================================
// 6. Initialization
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupModal();
  setupSmoothScroll();
  setupFooterYear();
});
