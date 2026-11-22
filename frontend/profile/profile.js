
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


    const githubInput = document.getElementById("edit-github");
    const linkedinInput = document.getElementById("edit-linkedin");
    const telegramInput = document.getElementById("edit-telegram");

    const githubLink = document.getElementById("social-github");
    const linkedinLink = document.getElementById("social-linkedin");
    const telegramLink = document.getElementById("social-telegram");
    const socialEmpty = document.getElementById("social-empty");


    const storageKey = "uniforge-demo-profile";
    let previousFocus = null;

    // Default information shown before the first save
    
    const defaultProfile = {
        name: nameEl.textContent.trim(),
        university: universityEl.textContent.trim(),
        role: roleEl.textContent.trim(),
        about: aboutEl.textContent.trim(),
        skills: Array.from(skillsEl.querySelectorAll(".skill-tag"))
            .map(skill => skill.textContent.trim()),
        github: "",
        linkedin: "",
        telegram: ""
    };


    function validSocialUrl(value, platform) {
        if (!value) return "";

        try {
            const url = new URL(value);

            if (url.protocol !== "https:") return null;

            const allowedHosts = {
                github: ["github.com", "www.github.com"],
                linkedin: ["linkedin.com", "www.linkedin.com"],
                telegram: ["t.me"]
            };

            if (!allowedHosts[platform].includes(url.hostname.toLowerCase())) {
                return null;
            }

            if (url.username || url.password || url.pathname === "/") {
                return null;
            }

            return url.href;
        } catch {
            return null;
        }
    }

    function renderSocialLinks(profile) {
        const links = [
            [githubLink, profile.github, "github"],
            [linkedinLink, profile.linkedin, "linkedin"],
            [telegramLink, profile.telegram, "telegram"]
        ];

        let visibleCount = 0;

        links.forEach(([element, value, platform]) => {
            const url = validSocialUrl(value || "", platform);

            if (url) {
                element.href = url;
                element.classList.remove("hidden");
                visibleCount++;
            } else {
                element.removeAttribute("href");
                element.classList.add("hidden");
            }
        });

        socialEmpty.classList.toggle("hidden", visibleCount > 0);
    }


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
        renderSocialLinks(profile);
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

            
            return {
                ...defaultProfile,
                ...parsed,
                github: parsed.github || "",
                linkedin: parsed.linkedin || "",
                telegram: parsed.telegram || ""
            };

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


        const savedProfile = loadProfile();

        githubInput.value = savedProfile.github || "";
        linkedinInput.value = savedProfile.linkedin || "";
        telegramInput.value = savedProfile.telegram || "";


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
            )],
            github: githubInput.value.trim(),
            linkedin: linkedinInput.value.trim(),
            telegram: telegramInput.value.trim()
        };


        if (!profile.name || !profile.university || !profile.role) {
            alert("Please fill in all required fields.");
            return;
        }


        for (const platform of ["github", "linkedin", "telegram"]) {
            const value = profile[platform];
            const url = validSocialUrl(value, platform);

            if (url === null) {
                alert(`Please enter a valid HTTPS ${platform} profile URL.`);
                return;
            }

            profile[platform] = url;
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




/* ==================================================
   UniForge Profile Photo Crop Editor
   ================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const avatarBtn = document.getElementById("avatar-upload-btn");
    const avatarInput = document.getElementById("avatar-file-input");
    const avatarImage = document.getElementById("profile-avatar-image");
    const defaultAvatar = document.getElementById("default-avatar");
    const changeLink = document.getElementById("change-avatar-link");

    const photoModal = document.getElementById("photo-modal");
    const closeBtn = document.getElementById("close-photo-modal");
    const cancelBtn = document.getElementById("cancel-photo-btn");
    const saveBtn = document.getElementById("save-photo-btn");
    const resetBtn = document.getElementById("reset-photo-btn");
    const zoomSlider = document.getElementById("crop-zoom");

    const canvas = document.getElementById("crop-canvas");
    const ctx = canvas.getContext("2d");

    const avatarKey = "uniforge-demo-avatar";
    const sourceKey = "uniforge-demo-avatar-source";

    const SIZE = 360;
    const RADIUS = 150;

    let image = null;
    let originalSource = "";
    let offsetX = 0;
    let offsetY = 0;
    let zoom = 1;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let previousFocus = null;

    // Show saved circular avatar
    function displayAvatar(src) {
        avatarImage.src = src;
        avatarImage.classList.remove("hidden");
        defaultAvatar.classList.add("hidden");
    }

    try {
        const saved = localStorage.getItem(avatarKey);
        if (saved && saved.startsWith("data:image/")) {
            displayAvatar(saved);
        }
    } catch (error) {
        console.warn("Avatar loading failed:", error);
    }

    // Calculate image size to cover the circular crop
    function getGeometry() {
        const baseScale = Math.max(
            (RADIUS * 2) / image.width,
            (RADIUS * 2) / image.height
        );

        const scale = baseScale * zoom;

        return {
            width: image.width * scale,
            height: image.height * scale
        };
    }

    // Prevent empty space inside the avatar
    function clampOffset() {
        if (!image) return;

        const { width, height } = getGeometry();

        const maxX = (width - RADIUS * 2) / 2;
        const maxY = (height - RADIUS * 2) / 2;

        offsetX = Math.max(-maxX, Math.min(maxX, offsetX));
        offsetY = Math.max(-maxY, Math.min(maxY, offsetY));
    }

    function drawImage(targetCtx, size, circularOnly = false) {
        if (!image) return;

        const ratio = size / SIZE;
        const { width, height } = getGeometry();

        targetCtx.clearRect(0, 0, size, size);

        if (circularOnly) {
            targetCtx.save();
            targetCtx.beginPath();
            targetCtx.arc(
                size / 2,
                size / 2,
                RADIUS * ratio,
                0,
                Math.PI * 2
            );
            targetCtx.clip();
        }

        targetCtx.drawImage(
            image,
            (SIZE / 2 + offsetX - width / 2) * ratio,
            (SIZE / 2 + offsetY - height / 2) * ratio,
            width * ratio,
            height * ratio
        );

        if (circularOnly) {
            targetCtx.restore();
        }
    }

    function renderCrop() {
        if (!image) return;

        ctx.fillStyle = "#e2e8f0";
        ctx.fillRect(0, 0, SIZE, SIZE);

        drawImage(ctx, SIZE);

        // Darken everything outside the circular avatar
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, SIZE, SIZE);
        ctx.arc(
            SIZE / 2,
            SIZE / 2,
            RADIUS,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = "rgba(15, 23, 42, 0.55)";
        ctx.fill("evenodd");
        ctx.restore();

        // Blue circular crop guide
        ctx.beginPath();
        ctx.arc(
            SIZE / 2,
            SIZE / 2,
            RADIUS,
            0,
            Math.PI * 2
        );
        ctx.strokeStyle = "#2563eb";
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    function resetCrop() {
        zoom = 1;
        offsetX = 0;
        offsetY = 0;
        zoomSlider.value = "1";
        renderCrop();
    }

    function closeModal() {
        photoModal.classList.add("hidden");
        dragging = false;
        image = null;
        previousFocus?.focus();
    }

    // Load a photo into the crop editor
    function openEditor(source) {
        const newImage = new Image();

        newImage.onload = () => {
            image = newImage;
            originalSource = source;

            previousFocus = document.activeElement;
            resetCrop();

            photoModal.classList.remove("hidden");
            closeBtn.focus();
        };

        newImage.onerror = () => {
            alert("Could not open the selected image.");
        };

        newImage.src = source;
    }

    // Open previously saved photo for adjustment
    avatarBtn.addEventListener("click", () => {
        let source = "";

        try {
            source = localStorage.getItem(sourceKey)
                || localStorage.getItem(avatarKey)
                || "";
        } catch (error) {
            console.warn("Could not access saved photo:", error);
        }

        if (source) {
            openEditor(source);
        } else {
            avatarInput.click();
        }
    });

    changeLink.addEventListener("click", () => {
        avatarInput.click();
    });

    // Select a new image
    avatarInput.addEventListener("change", () => {
        const file = avatarInput.files?.[0];
        if (!file) return;

        const types = ["image/jpeg", "image/png", "image/webp"];

        if (!types.includes(file.type)) {
            alert("Please choose a JPG, PNG or WebP image.");
            avatarInput.value = "";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("Maximum image size is 2 MB.");
            avatarInput.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const source = reader.result;
            if (typeof source !== "string") return;

            // Resize source to reduce browser storage usage
            const tempImage = new Image();

            tempImage.onload = () => {
                const maxSize = 1200;
                const scale = Math.min(
                    1,
                    maxSize / Math.max(
                        tempImage.width,
                        tempImage.height
                    )
                );

                const tempCanvas = document.createElement("canvas");
                tempCanvas.width = Math.round(tempImage.width * scale);
                tempCanvas.height = Math.round(tempImage.height * scale);

                const tempCtx = tempCanvas.getContext("2d");
                tempCtx.drawImage(
                    tempImage,
                    0,
                    0,
                    tempCanvas.width,
                    tempCanvas.height
                );

                openEditor(tempCanvas.toDataURL("image/jpeg", 0.82));
            };

            tempImage.onerror = () => {
                alert("Could not process this image.");
            };

            tempImage.src = source;
        };

        reader.onerror = () => {
            alert("Could not read the image.");
        };

        reader.readAsDataURL(file);
        avatarInput.value = "";
    });

    // Drag image with mouse or touch
    canvas.addEventListener("pointerdown", event => {
        if (!image) return;

        dragging = true;
        lastX = event.clientX;
        lastY = event.clientY;

        canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointermove", event => {
        if (!dragging || !image) return;

        const rect = canvas.getBoundingClientRect();
        const factor = SIZE / rect.width;

        offsetX += (event.clientX - lastX) * factor;
        offsetY += (event.clientY - lastY) * factor;

        lastX = event.clientX;
        lastY = event.clientY;

        clampOffset();
        renderCrop();
    });

    function stopDragging() {
        dragging = false;
    }

    canvas.addEventListener("pointerup", stopDragging);
    canvas.addEventListener("pointercancel", stopDragging);
    canvas.addEventListener("lostpointercapture", stopDragging);

    // Zoom slider
    zoomSlider.addEventListener("input", () => {
        zoom = Number(zoomSlider.value);
        clampOffset();
        renderCrop();
    });

    resetBtn.addEventListener("click", resetCrop);

    // Save exact circular crop
    saveBtn.addEventListener("click", () => {
        if (!image) return;

        const output = document.createElement("canvas");
        output.width = 300;
        output.height = 300;

        const outputCtx = output.getContext("2d");

        // Scale circle to fill the whole output
        const scale = output.width / (RADIUS * 2);
        const { width, height } = getGeometry();

        outputCtx.beginPath();
        outputCtx.arc(150, 150, 150, 0, Math.PI * 2);
        outputCtx.clip();

        outputCtx.drawImage(
            image,
            (offsetX - width / 2 + RADIUS) * scale,
            (offsetY - height / 2 + RADIUS) * scale,
            width * scale,
            height * scale
        );

        const result = output.toDataURL("image/png");

        try {
            // Save source first, then the cropped avatar
            localStorage.setItem(sourceKey, originalSource);
            localStorage.setItem(avatarKey, result);

            displayAvatar(result);
            closeModal();
        } catch (error) {
            console.warn("Saving failed:", error);
            alert("Not enough browser storage to save photo.");
        }
    });

    closeBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);

    photoModal.addEventListener("click", event => {
        if (event.target === photoModal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", event => {
        if (photoModal.classList.contains("hidden")) return;

        if (event.key === "Escape") {
            closeModal();
        }

        if (event.key === "Tab") {
            const controls = [
                closeBtn,
                zoomSlider,
                resetBtn,
                cancelBtn,
                saveBtn
            ];

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
});




/* ==========================================
   UniForge — My Projects
   Shared Integration with Explore
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("add-project-btn");
    const modal = document.getElementById("project-modal");
    const modalTitle = document.getElementById("project-modal-title");
    const closeBtn = document.getElementById("close-project-modal");
    const cancelBtn = document.getElementById("cancel-project-btn");
    const form = document.getElementById("project-form");

    const nameInput = document.getElementById("project-name");
    const descriptionInput = document.getElementById("project-description");
    const technologiesInput = document.getElementById("project-technologies");
    const universityInput = document.getElementById("project-university");
    const rolesInput = document.getElementById("project-roles");
    const githubInput = document.getElementById("project-github");
    const statusInput = document.getElementById("project-status");

    const projectsList = document.getElementById("profile-projects");
    const emptyState = document.getElementById("projects-empty");

    const data = window.UniForgeData;
    const LEGACY_KEY = "uniforge-demo-projects";

    let projects = [];
    let editingProjectId = null;
    let previousFocus = null;

    if (!data ||
        typeof data.getMyListings !== "function" ||
        typeof data.addCustomListing !== "function" ||
        typeof data.updateListing !== "function" ||
        typeof data.deleteListing !== "function") {
        console.error("UniForge shared data is not available.");
        return;
    }

    // Current profile information
    function getProfileInfo() {
        return {
            name: document.getElementById("profile-name")
                ?.textContent.trim() || "You",
            university: document.getElementById("profile-university")
                ?.textContent.trim() || "Not specified"
        };
    }

    // Load projects from the shared Explore storage
    function loadProjects() {
        return data.getMyListings().filter(item =>
            item.type === "project"
        );
    }

    // Migrate older Profile projects without deleting them
    function migrateLegacyProjects() {
        let oldProjects;

        try {
            oldProjects = JSON.parse(
                localStorage.getItem(LEGACY_KEY) || "[]"
            );
        } catch (error) {
            console.warn("Cannot read older projects:", error);
            return;
        }

        if (!Array.isArray(oldProjects)) return;

        const ownerId = data.getCurrentUserId();
        if (!ownerId) return;

        const info = getProfileInfo();

        oldProjects.forEach(old => {
            if (
                !old ||
                typeof old.id !== "string" ||
                typeof old.name !== "string" ||
                typeof old.description !== "string"
            ) return;

            // Do not import the same old project twice
            const alreadyExists = data.getListings().some(
                item =>
                    item.ownerId === ownerId &&
                    item.legacyProfileId === old.id
            );

            if (alreadyExists) return;

            // Shared listings use numeric IDs
            const existingIds = new Set(
                data.getListings().map(item => item.id)
            );

            let id = Date.now();

            while (existingIds.has(id)) {
                id++;
            }

            const newItem = {
                id,
                type: "project",
                ownerId,
                legacyProfileId: old.id,
                title: old.name,
                desc: old.description,
                overview: old.description,
                tech: Array.isArray(old.technologies)
                    ? old.technologies.filter(
                        t => typeof t === "string"
                    )
                    : [],
                roles: [],
                uni: info.university,
                leader: info.name,
                github: typeof old.github === "string"
                    ? old.github : "",
                status: ["in-progress", "completed"].includes(old.status)
                    ? old.status : "in-progress",
                contributorsCount: 1,
                createdText: "Previously added",
                createdDays: 0,
                likes: 0
            };

            data.addCustomListing(newItem);

            const imported = data.getListings().some(
                item => item.id === id &&
                        item.ownerId === ownerId
            );

            if (!imported) {
                console.warn("Could not import:", old.name);
            }
        });

        // Original localStorage data is kept as a backup
    }

    function validateGithubUrl(value) {
        if (!value) return "";

        try {
            const url = new URL(value);

            if (
                url.protocol !== "https:" ||
                !["github.com", "www.github.com"].includes(
                    url.hostname.toLowerCase()
                ) ||
                url.username ||
                url.password ||
                url.pathname === "/"
            ) {
                return null;
            }

            return url.href;
        } catch {
            return null;
        }
    }

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;

        return element;
    }

    // Render shared project cards
    function renderProjects() {
        projects = loadProjects();
        projectsList.replaceChildren();

        emptyState.classList.toggle(
            "hidden",
            projects.length > 0
        );

        projects.forEach(project => {
            const card = createElement(
                "article",
                "project-item"
            );

            const top = createElement(
                "div",
                "project-item-top"
            );

            const title = createElement(
                "h3",
                "project-item-title"
            );

            const titleLink = createElement(
                "a",
                "",
                project.title
            );

            titleLink.href =
                "../project.html?id=" +
                encodeURIComponent(project.id);

            title.appendChild(titleLink);

            const statusValue = project.status === "completed"
                ? "completed" : "in-progress";

            const status = createElement(
                "span",
                `project-status project-status-${statusValue}`,
                statusValue === "completed"
                    ? "Completed"
                    : "In Progress"
            );

            top.append(title, status);

            const description = createElement(
                "p",
                "project-item-description",
                project.desc || ""
            );

            const techList = createElement(
                "div",
                "project-tech-list"
            );

            (project.tech || []).forEach(technology => {
                techList.appendChild(
                    createElement(
                        "span",
                        "project-tech-tag",
                        technology
                    )
                );
            });

            const actions = createElement(
                "div",
                "project-item-actions"
            );

            if (project.github) {
                const github = validateGithubUrl(project.github);

                if (github) {
                    const link = createElement(
                        "a",
                        "project-github-link",
                        "GitHub ↗"
                    );

                    link.href = github;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";

                    actions.appendChild(link);
                }
            }

            const viewBtn = createElement(
                "a",
                "project-action-btn",
                "View"
            );

            viewBtn.href =
                "../project.html?id=" +
                encodeURIComponent(project.id);

            const editBtn = createElement(
                "button",
                "project-action-btn",
                "Edit"
            );

            editBtn.type = "button";
            editBtn.addEventListener("click", () => {
                openEditModal(project.id);
            });

            const deleteBtn = createElement(
                "button",
                "project-action-btn project-delete-btn",
                "Delete"
            );

            deleteBtn.type = "button";
            deleteBtn.addEventListener("click", () => {
                deleteProject(project.id);
            });

            actions.append(viewBtn, editBtn, deleteBtn);
            card.append(top, description, techList, actions);

            projectsList.appendChild(card);
        });
    }

    function openAddModal() {
        editingProjectId = null;
        form.reset();

        modalTitle.textContent = "Add New Project";
        previousFocus = document.activeElement;

        modal.classList.remove("hidden");
        nameInput.focus();
    }

    function openEditModal(id) {
        const project = projects.find(
            item => item.id === id
        );

        if (!project) return;

        editingProjectId = id;

        nameInput.value = project.title;
        descriptionInput.value = project.desc || "";
        universityInput.value = project.uni || "";
        rolesInput.value = (project.roles || []).join(", ");
        technologiesInput.value = (project.tech || [])
            .join(", ");
        githubInput.value = project.github || "";
        statusInput.value = project.status || "in-progress";

        modalTitle.textContent = "Edit Project";
        previousFocus = document.activeElement;

        modal.classList.remove("hidden");
        nameInput.focus();
    }

    function closeModal() {
        modal.classList.add("hidden");
        editingProjectId = null;
        previousFocus?.focus();
    }

    function deleteProject(id) {
        const project = projects.find(
            item => item.id === id
        );

        if (!project) return;

        if (!confirm(
            `Are you sure you want to delete "${project.title}"?`
        )) return;

        const success = data.deleteListing(id);

        if (!success) {
            alert("Could not delete this project.");
            return;
        }

        renderProjects();
    }

    // Add or update a project using shared storage
    form.addEventListener("submit", event => {
        event.preventDefault();

        const uni = universityInput.value.trim();

        const roles = [...new Set(
            rolesInput.value
                .split(",")
                .map(value => value.trim())
                .filter(Boolean)
        )];

        const title = nameInput.value.trim();
        const desc = descriptionInput.value.trim();

        const tech = [...new Set(
            technologiesInput.value
                .split(",")
                .map(value => value.trim())
                .filter(Boolean)
        )];

        const github = validateGithubUrl(
            githubInput.value.trim()
        );

        const status = statusInput.value;

        if (!title || !desc || !uni) {
            alert("Project name, description and university are required.");
            return;
        }

        if (github === null) {
            alert("Enter a valid HTTPS GitHub URL.");
            githubInput.focus();
            return;
        }

        if (!["in-progress", "completed"].includes(status)) {
            alert("Select a valid project status.");
            return;
        }

        const projectData = {
            title,
            desc,
            overview: desc,
            uni,
            roles,
            tech,
            github,
            status
        };

        if (editingProjectId !== null) {
            const success = data.updateListing(
                editingProjectId,
                projectData
            );

            if (!success) {
                alert("Could not update this project.");
                return;
            }
        } else {
            const ownerId = data.getCurrentUserId();

            if (!ownerId) {
                alert("Demo user ID is not available.");
                return;
            }

            const info = getProfileInfo();

            const existingIds = new Set(
                data.getListings().map(item => item.id)
            );

            let id = Date.now();

            while (existingIds.has(id)) id++;

            const newItem = {
                id,
                type: "project",
                ownerId,
                ...projectData,
                leader: info.name,
                contributorsCount: 1,
                createdText: "Just now",
                createdDays: 0,
                likes: 0
            };

            data.addCustomListing(newItem);

            // Check that the listing was actually stored
            const saved = data.getListings().some(
                item =>
                    item.id === id &&
                    item.ownerId === ownerId
            );

            if (!saved) {
                alert("Could not save the new project.");
                return;
            }
        }

        renderProjects();
        closeModal();
    });

    addBtn.addEventListener("click", openAddModal);
    closeBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", event => {
        if (event.target === modal) closeModal();
    });

    document.addEventListener("keydown", event => {
        if (modal.classList.contains("hidden")) return;

        if (event.key === "Escape") {
            closeModal();
            return;
        }

        if (event.key === "Tab") {
            const controls = Array.from(
                modal.querySelectorAll(
                    "button, input, textarea, select"
                )
            ).filter(element => !element.disabled);

            const first = controls[0];
            const last = controls[controls.length - 1];

            if (event.shiftKey &&
                document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey &&
                document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });

    // Initial synchronization
    migrateLegacyProjects();
    renderProjects();

    // Refresh after returning to Profile
    window.addEventListener("pageshow", renderProjects);

    // Refresh when shared storage changes in another tab
    window.addEventListener("storage", event => {
        if (event.key === "uniforge_custom_listings") {
            renderProjects();
        }
    });
});



/* ==========================================
   Profile Back Navigation
   ========================================== */

document.getElementById("profile-back-link")
    ?.addEventListener("click", event => {
        const referrer = document.referrer;

        if (!referrer) return;

        try {
            const previousPage = new URL(referrer);

            if (
                previousPage.origin === window.location.origin &&
                previousPage.pathname !== window.location.pathname &&
                window.history.length > 1
            ) {
                event.preventDefault();
                window.history.back();
            }
        } catch (error) {
            console.warn("Unable to read previous page:", error);
        }
    });
