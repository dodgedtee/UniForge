/**
 * UniForge - Shared JWT Auth & Backend API Client
 * Connects frontend pages to the FastAPI + SQLite + JWT backend.
 */

(() => {
  const TOKEN_KEY = "uniforge_auth_token";
  const USER_KEY = "uniforge_auth_user";
  const PROFILE_KEY = "uniforge-demo-profile";
  const DEMO_USER_ID_KEY = "uniforge_demo_user_id";

  function resolveApiBase() {
    const override = window.UNIFORGE_API_BASE;
    if (override) return String(override).replace(/\/$/, "");
    const { protocol, hostname, port, origin } = window.location;
    if ((protocol === "http:" || protocol === "https:") && port === "8000") {
      return origin;
    }
    if ((protocol === "http:" || protocol === "https:") && hostname && !port) {
      return origin;
    }
    return "http://127.0.0.1:8000";
  }

  const API_BASE = resolveApiBase();

  function getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY) || "";
    } catch {
      return "";
    }
  }

  function getUser() {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function syncLegacyProfile(user) {
    if (!user) return;
    try {
      localStorage.setItem(DEMO_USER_ID_KEY, `user-${user.id}`);
      localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify({
          name: user.full_name || "Student",
          university: user.university || "SDU",
          role: user.role || "Frontend",
          about: user.about || "",
          skills: Array.isArray(user.skills) ? user.skills : [],
          github: user.github || "",
          linkedin: user.linkedin || "",
          telegram: user.telegram || ""
        })
      );
    } catch {
      // Ignore storage quota issues
    }
  }

  function setSession(token, user) {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        syncLegacyProfile(user);
      }
    } catch {
      // Ignore storage errors
    }
  }

  function clearSession() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // Ignore storage errors
    }
  }

  function isLoggedIn() {
    return Boolean(getToken() && getUser());
  }

  function extractErrorMessage(data, fallback) {
    if (!data) return fallback;
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail) && data.detail.length > 0) {
      const first = data.detail[0];
      return first?.msg || fallback;
    }
    return fallback;
  }

  async function apiRequest(path, options = {}) {
    const headers = {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    };

    const token = getToken();
    if (token && options.auth !== false) {
      headers.Authorization = `Bearer ${token}`;
    }

    let response;
    try {
      response = await fetch(`${API_BASE}${path}`, {
        method: options.method || "GET",
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined
      });
    } catch {
      throw new Error(
        `Cannot reach UniForge API at ${API_BASE}. Start the FastAPI server with: uvicorn backend.main:app --reload`
      );
    }

    if (response.status === 204) return null;

    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!response.ok) {
      if (response.status === 401 && options.clearOn401 !== false && token) {
        clearSession();
      }
      const err = new Error(extractErrorMessage(payload, `Request failed (${response.status})`));
      err.status = response.status;
      throw err;
    }

    return payload;
  }

  async function register(data) {
    const res = await apiRequest("/api/auth/register", {
      method: "POST",
      body: data,
      auth: false,
      clearOn401: false
    });
    setSession(res.access_token, res.user);
    return res;
  }

  async function login(email, password) {
    const res = await apiRequest("/api/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
      clearOn401: false
    });
    setSession(res.access_token, res.user);
    return res;
  }

  async function refreshMe() {
    if (!getToken()) return null;
    const user = await apiRequest("/api/auth/me");
    setSession(getToken(), user);
    return user;
  }

  async function updateProfile(profileData) {
    const user = await apiRequest("/api/auth/me", {
      method: "PUT",
      body: profileData
    });
    setSession(getToken(), user);
    return user;
  }

  async function logout() {
    if (getToken()) {
      try {
        await apiRequest("/api/auth/logout", { method: "POST" });
      } catch {
        // Proceed with local sign-out even if server is offline
      }
    }
    clearSession();
  }

  function resolveAuthHref() {
    const inSubfolder = /\/profile\//i.test(window.location.pathname);
    return inSubfolder ? "../auth.html" : "auth.html";
  }

  function syncNavbarAuth() {
    const user = getUser();
    const loggedIn = isLoggedIn();
    const authHref = resolveAuthHref();

    document.querySelectorAll("[data-auth-link]").forEach(el => {
      if (loggedIn) {
        el.textContent = "Sign Out";
        el.setAttribute("href", "#");
        el.onclick = async e => {
          e.preventDefault();
          await logout();
          window.location.href = authHref;
        };
      } else {
        el.textContent = el.getAttribute("data-auth-logged-out") || "Sign In";
        el.setAttribute("href", authHref);
        el.onclick = null;
      }
    });

    const profileLink = document.getElementById("user-profile");
    if (profileLink && loggedIn && user?.full_name) {
      profileLink.title = `${user.full_name} (${user.university})`;
    }
  }

  window.UniForgeAuth = {
    API_BASE,
    getToken,
    getUser,
    isLoggedIn,
    setSession,
    clearSession,
    apiRequest,
    register,
    login,
    refreshMe,
    updateProfile,
    logout,
    syncNavbarAuth
  };

  document.addEventListener("DOMContentLoaded", syncNavbarAuth);
})();
