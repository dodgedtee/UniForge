
document.addEventListener("DOMContentLoaded", () => {
    const editBtn = document.getElementById("edit-profile-btn");
    const modal = document.getElementById("edit-modal");
    const closeBtn = document.getElementById("close-edit-modal");
    const cancelBtn = document.getElementById("cancel-edit");
    const form = document.getElementById("edit-profile-form");

    const nameEl = document.getElementById("profile-name");
    const universityEl = document.getElementById("profile-university");
    const roleEl = document.getElementById("profile-role");
    const aboutEl = document.getElementById("profile-about");
    const skillsEl = document.getElementById("profile-skills");

    const nameInput = document.getElementById("edit-name");
    const universityInput = document.getElementById("edit-university");
    const roleInput = document.getElementById("edit-role");
    const aboutInput = document.getElementById("edit-about");
    const skillsInput = document.getElementById("edit-skills");

    const storageKey = "uniforge-demo-profile";
    let previousFocus = null;

    // Default information shown before the first save
    const defaultProfile = {
        name: nameEl.textContent.trim(),
        university: universityEl.textContent.trim(),
        role: roleEl.textContent.trim(),
        about: aboutEl.textContent.trim(),
        skills: Array.from(skillsEl.querySelectorAll(".skill-tag"))
            .map(skill => skill.textContent.trim())
    };

    function renderProfile(profile) {
        nameEl.textContent = profile.name;
        universityEl.textContent = profile.university;
        roleEl.textContent = profile.role;
        aboutEl.textContent = profile.about;

        skillsEl.replaceChildren();

        profile.skills.forEach(skill => {
            const tag = document.createElement("span");
            tag.className = "skill-tag";
            tag.textContent = skill;
            skillsEl.appendChild(tag);
        });
    }

    function loadProfile() {
        try {
            const saved = localStorage.getItem(storageKey);

            if (!saved) return defaultProfile;

            const parsed = JSON.parse(saved);

            if (
                typeof parsed.name !== "string" ||
                typeof parsed.university !== "string" ||
                typeof parsed.role !== "string" ||
                typeof parsed.about !== "string" ||
                !Array.isArray(parsed.skills) ||
                !parsed.skills.every(s => typeof s === "string")
            ) {
                return defaultProfile;
            }

            return parsed;
        } catch (error) {
            console.warn("Profile could not be loaded:", error);
            return defaultProfile;
        }
    }

    function openModal() {
        nameInput.value = nameEl.textContent.trim();
        universityInput.value = universityEl.textContent.trim();
        roleInput.value = roleEl.textContent.trim();
        aboutInput.value = aboutEl.textContent.trim();

        skillsInput.value = Array.from(
            skillsEl.querySelectorAll(".skill-tag")
        ).map(skill => skill.textContent.trim()).join(", ");

        previousFocus = document.activeElement;
        modal.classList.remove("hidden");
        nameInput.focus();
    }

    function closeModal() {
        modal.classList.add("hidden");
        previousFocus?.focus();
    }

    // Load saved data when opening the page
    renderProfile(loadProfile());

    editBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", event => {
        if (modal.classList.contains("hidden")) return;

        if (event.key === "Escape") {
            closeModal();
        }

        if (event.key === "Tab") {
            const controls = Array.from(
                modal.querySelectorAll(
                    "button, input, textarea"
                )
            ).filter(el => !el.disabled);

            const first = controls[0];
            const last = controls[controls.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });

    form.addEventListener("submit", event => {
        event.preventDefault();

        const profile = {
            name: nameInput.value.trim(),
            university: universityInput.value.trim(),
            role: roleInput.value.trim(),
            about: aboutInput.value.trim(),
            skills: [...new Set(
                skillsInput.value
                    .split(",")
                    .map(skill => skill.trim())
                    .filter(Boolean)
            )]
        };

        if (!profile.name || !profile.university || !profile.role) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            localStorage.setItem(storageKey, JSON.stringify(profile));
        } catch (error) {
            console.warn("Profile could not be saved:", error);
            alert("Could not save your profile in this browser.");
            return;
        }

        renderProfile(profile);
        closeModal();
    });
});
