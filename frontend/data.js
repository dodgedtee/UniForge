/**
 * UniForge - Shared Catalog Data & Storage Helpers
 * Used by both explore.html and project.html so listings and requests stay in sync.
 */

(() => {
const DEFAULT_LISTINGS = [
  {
    id: 1,
    type: "project",
    title: "NarrAI - Multi-Agent Storyteller",
    desc: "Experimental platform where multiple LLM agents collaborate to write interactive, branching storylines in real-time with user steering.",
    overview:
      "NarrAI explores how specialized AI agents (Worldbuilder, Character Lead, and Plot Critic) can coordinate via stateful graphs to generate coherent, interactive fiction. Students working on this project gain hands-on experience with multi-agent orchestration, streaming WebSocket UIs, and prompt evaluation.",
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
    overview:
      "A 48-hour inter-university build sprint focused on launching real civic-tech, FinTech, and campus utility MVPs. Participating teams pitch to industry mentors and alumni founders at the end of the weekend.",
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
    overview:
      "Student organizations often track event budgets across messy spreadsheets. FinTrack provides a clean REST API with role-based approvals, receipt attachments, and automated expense reports tailored for university clubs.",
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
    overview:
      "EcoCampus connects dorms and university departments through friendly sustainability challenges. Students log recycling and energy-saving actions, earn campus badges, and track real-time leaderboard impact.",
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
    overview:
      "An applied AI research competition testing retrieval-augmented generation, structured extraction, and inference latency optimization on real multilingual datasets.",
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
    overview:
      "Designed for university cybersecurity clubs, CyberDefense Sandbox spins up ephemeral Docker network topologies where students can practice offensive/defensive scenarios without risking campus networks.",
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
    overview:
      "A focused 3-person competitive programming squad training together twice a week on 5-hour virtual ICPC problem sets, followed by editorial upsolving sessions.",
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
    overview:
      "Focused on practical personal finance tools for university students: bill-splitting, scholarship budgeting, and transparent group trip tracking with instant UX.",
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
    overview:
      "StudySync turns lecture notes into structured study guides and spaced-repetition flashcards that classmates can co-edit and review together before midterms.",
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
    overview:
      "An inter-university algorithmic competition bringing together student coders to tackle classic data structures, math, and optimization problems under time pressure.",
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
    overview:
      "MedScan is an educational research tool exploring fast local triage summaries for clinical study datasets, pairing a Python FastAPI inference service with a clean React viewer.",
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
    overview:
      "Students collaborate to solve real administrative and educational bottlenecks with secure document parsing, bilingual search, and clear citation trails.",
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
    overview:
      "A simulation testbed for testing A*, RRT*, and multi-drone collision avoidance algorithms before deploying code onto physical student robotics hardware.",
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
    overview:
      "DormSwap replaces chaotic dorm group chats with a clean, student-verified marketplace featuring campus pickup spots, saved searches, and fair peer reviews.",
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
    overview:
      "A 48-hour creative engineering sprint where programmers and UI/UX designers team up to ship playable browser games and interactive web experiments.",
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
    overview:
      "An official-style 5-hour ICPC contest testing algorithmic breadth, debugging discipline, and teamwork across 10–12 challenging problems.",
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
    overview:
      "KubeLite simplifies deploying Dockerized student projects with automatic preview URLs, log streaming, and resource quotas tailored for university lab clusters.",
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
    overview:
      "An intensive weekend dedicated to reimagining university learning tools — from adaptive exam prep to peer tutoring marketplaces.",
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
    overview:
      "KazNLP empowers student researchers to build higher-quality Kazakh NLP models through transparent dataset curation, deduplication, and reproducible evaluation suites.",
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
    overview:
      "Peer-led competitive programming study group preparing SDU students for winter regional qualifiers through structured topic sheets and mock rounds.",
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

const TYPE_META = {
  project: { label: "Project", badgeClass: "badge-project", avatarClass: "avatar-project", letter: "P" },
  hackathon: { label: "Hackathon", badgeClass: "badge-hackathon", avatarClass: "avatar-hackathon", letter: "H" },
  competition: { label: "Competition", badgeClass: "badge-competition", avatarClass: "avatar-competition", letter: "C" }
};

const STORAGE_KEYS = {
  CUSTOM_LISTINGS: "uniforge_custom_listings",
  REQUESTED_IDS: "uniforge_requested_ids"
};

function readStorageJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorageJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or private mode failures
  }
}

function getListings() {
  const custom = readStorageJSON(STORAGE_KEYS.CUSTOM_LISTINGS, []);
  return [...custom, ...DEFAULT_LISTINGS];
}

function addCustomListing(item) {
  const custom = readStorageJSON(STORAGE_KEYS.CUSTOM_LISTINGS, []);
  custom.unshift(item);
  writeStorageJSON(STORAGE_KEYS.CUSTOM_LISTINGS, custom);
}

function getRequestedIds() {
  return new Set(readStorageJSON(STORAGE_KEYS.REQUESTED_IDS, []));
}

function toggleRequestedId(id) {
  const set = getRequestedIds();
  let added = false;
  if (set.has(id)) {
    set.delete(id);
  } else {
    set.add(id);
    added = true;
  }
  writeStorageJSON(STORAGE_KEYS.REQUESTED_IDS, Array.from(set));
  return added;
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

function setupFooterYear() {
  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function setupMobileNav() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const hamburgerIcon = toggleBtn?.querySelector(".hamburger-icon");
  const closeIcon = toggleBtn?.querySelector(".close-icon");

  if (!toggleBtn || !mobileMenu) return;

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

window.UniForgeData = {
  TYPE_META,
  getListings,
  addCustomListing,
  getRequestedIds,
  toggleRequestedId,
  escapeHTML,
  showToast,
  setupFooterYear,
  setupMobileNav
};
})();

