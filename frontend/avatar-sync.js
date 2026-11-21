
/* UniForge — Shared Navbar Avatar */

document.addEventListener("DOMContentLoaded", () => {
    const avatar = document.querySelector(".navbar .profile-pic");
    if (!avatar) return;

    function updateNavbarAvatar() {
        try {
            const saved = localStorage.getItem("uniforge-demo-avatar");

            if (saved && /^data:image\/(?:png|jpeg|webp);base64,/.test(saved)) {
                avatar.src = saved;
            }
        } catch (error) {
            console.warn("Could not load navbar avatar:", error);
        }
    }

    updateNavbarAvatar();

    window.addEventListener("pageshow", updateNavbarAvatar);

    window.addEventListener("storage", event => {
        if (event.key === "uniforge-demo-avatar") {
            updateNavbarAvatar();
        }
    });
});
