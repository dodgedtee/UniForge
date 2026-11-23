/**
 * UniForge - Authorization Page Controller (Sign In & Student Registration)
 */

document.addEventListener("DOMContentLoaded", () => {
  const auth = window.UniForgeAuth;
  if (!auth) return;

  const tabLogin = document.getElementById("tab-login");
  const tabRegister = document.getElementById("tab-register");
  const loginPanel = document.getElementById("login-panel");
  const registerPanel = document.getElementById("register-panel");
  const alertBox = document.getElementById("auth-alert");

  const sessionBanner = document.getElementById("active-session-banner");
  const sessionNameEl = document.getElementById("session-user-name");
  const sessionMetaEl = document.getElementById("session-user-meta");
  const logoutBtn = document.getElementById("btn-session-logout");

  const loginSubmitBtn = document.getElementById("btn-login-submit");
  const registerSubmitBtn = document.getElementById("btn-register-submit");

  function showAlert(message, type = "error") {
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = `auth-alert alert-${type}`;
  }

  function clearAlert() {
    if (!alertBox) return;
    alertBox.textContent = "";
    alertBox.className = "auth-alert hidden";
  }

  function setMode(mode) {
    const isRegister = mode === "register";
    tabLogin?.classList.toggle("active", !isRegister);
    tabRegister?.classList.toggle("active", isRegister);
    tabLogin?.setAttribute("aria-selected", String(!isRegister));
    tabRegister?.setAttribute("aria-selected", String(isRegister));
    loginPanel?.classList.toggle("hidden", isRegister);
    registerPanel?.classList.toggle("hidden", !isRegister);
    clearAlert();
  }

  function getSafeNextUrl() {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next && /^[a-zA-Z0-9._/-]+(\?[a-zA-Z0-9=&_%-]+)?$/.test(next) && !next.startsWith("//")) {
      return next;
    }
    return "explore.html";
  }

  function renderSessionBanner(user) {
    if (!sessionBanner) return;
    if (!user) {
      sessionBanner.classList.add("hidden");
      return;
    }
    sessionNameEl.textContent = user.full_name || "Student";
    sessionMetaEl.textContent = `${user.email} • ${user.university} • ${user.role}`;
    sessionBanner.classList.remove("hidden");
  }

  // Initial tab from URL (?mode=register)
  const initialParams = new URLSearchParams(window.location.search);
  if (initialParams.get("mode") === "register") {
    setMode("register");
  }

  tabLogin?.addEventListener("click", () => setMode("login"));
  tabRegister?.addEventListener("click", () => setMode("register"));

  document.querySelectorAll("[data-switch-tab]").forEach(btn => {
    btn.addEventListener("click", () => setMode(btn.getAttribute("data-switch-tab")));
  });

  // Password show/hide toggles
  document.querySelectorAll("[data-toggle-password]").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-toggle-password");
      const input = document.getElementById(targetId);
      if (!input) return;
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      btn.textContent = showing ? "Show" : "Hide";
      btn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    });
  });

  // Validate existing JWT session if present
  if (auth.isLoggedIn()) {
    renderSessionBanner(auth.getUser());
    auth.refreshMe().then(renderSessionBanner).catch(() => {
      renderSessionBanner(null);
    });
  }

  logoutBtn?.addEventListener("click", async () => {
    await auth.logout();
    renderSessionBanner(null);
    showAlert("You have been signed out.", "success");
  });

  // Sign In submission
  loginPanel?.addEventListener("submit", async e => {
    e.preventDefault();
    clearAlert();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
      showAlert("Please enter your email and password.");
      return;
    }

    loginSubmitBtn.disabled = true;
    loginSubmitBtn.querySelector("span").textContent = "Signing in...";

    try {
      await auth.login(email, password);
      showAlert("Signed in successfully! Redirecting...", "success");
      window.location.href = getSafeNextUrl();
    } catch (err) {
      showAlert(err.message || "Could not sign in.");
    } finally {
      loginSubmitBtn.disabled = false;
      loginSubmitBtn.querySelector("span").textContent = "Sign In";
    }
  });

  // Create Account submission
  registerPanel?.addEventListener("submit", async e => {
    e.preventDefault();
    clearAlert();

    const full_name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const university = document.getElementById("reg-university").value;
    const role = document.getElementById("reg-role").value;
    const password = document.getElementById("reg-password").value;
    const confirmPassword = document.getElementById("reg-password-confirm").value;
    const skills = Array.from(
      document.querySelectorAll('#reg-skills input[type="checkbox"]:checked')
    ).map(input => input.value);

    if (!full_name || full_name.length < 2) {
      showAlert("Please enter your full name (at least 2 characters).");
      return;
    }
    if (!email) {
      showAlert("Please enter your student email address.");
      return;
    }
    if (!university) {
      showAlert("Please select your university.");
      return;
    }
    if (!role) {
      showAlert("Please select your primary role.");
      return;
    }
    if (password.length < 8) {
      showAlert("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      showAlert("Passwords do not match.");
      return;
    }

    registerSubmitBtn.disabled = true;
    registerSubmitBtn.querySelector("span").textContent = "Creating account...";

    try {
      await auth.register({ full_name, email, password, university, role, skills });
      showAlert("Account created! Redirecting...", "success");
      window.location.href = getSafeNextUrl();
    } catch (err) {
      showAlert(err.message || "Could not create account.");
    } finally {
      registerSubmitBtn.disabled = false;
      registerSubmitBtn.querySelector("span").textContent = "Create Account";
    }
  });
});
