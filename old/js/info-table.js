document.addEventListener("DOMContentLoaded", () => {
     if (!window.matchMedia("(max-width: 769px)").matches) return;

    const breakpoint = 770;
    const openDelay = 0;

    const pageBlur = document.querySelector(".page-blur");
    const cards = document.querySelectorAll(".info-table");

    let activePanel = null;
    let openTimer = null;
    let closeTimer = null;

    const panels = [];

    // Create all panels once
    cards.forEach((card, index) => {
        const picture = card.querySelector("picture");
        const heading = card.querySelector("h3");
        const paragraph = card.querySelector("p");

        const panel = document.createElement("div");
        panel.className = "info-table-content";
        panel.dataset.index = index;

        // Close icon
        const close = document.createElement("button");
        close.type = "button";
        close.className = "icon yes-hmobile fr jc";
        close.setAttribute("aria-label", "Close details");

        close.innerHTML = `
            <svg viewBox="0 0 8 8" fill="currentColor">
                <use href="#plus"></use>
            </svg>
        `;

        panel.appendChild(close);

        // Heading
        if (heading) {
            panel.appendChild(heading.cloneNode(true));
        }

        // Paragraph
        if (paragraph) {
            panel.appendChild(paragraph.cloneNode(true));
        }

        // Image at bottom
        if (picture) {
            const imageWrap = document.createElement("div");
            imageWrap.className = "image-wrap";

            const clonedPicture = picture.cloneNode(true);
            const img = clonedPicture.querySelector("img");

            if (img) {
                img.loading = "eager";
                img.decoding = "async";
                img.fetchPriority = "high";
            }

            imageWrap.appendChild(clonedPicture);
            panel.appendChild(imageWrap);
        }

        document.body.appendChild(panel);
        panels.push(panel);

        // Close from icon
        close.addEventListener("click", e => {
            e.stopPropagation();
            closePanel();
        });

        // Open matching panel
        card.addEventListener("click", () => {
            if (window.innerWidth > breakpoint) return;
            openPanel(panel);
        });
    });

    function openPanel(panel) {
        clearTimeout(openTimer);
        clearTimeout(closeTimer);

        // Deactivate other panels
        panels.forEach(item => {
            if (item !== panel) {
                item.classList.remove("active");
            }
        });

        activePanel = panel;
        pageBlur?.classList.add("active");

        // 0.2s delay
        openTimer = setTimeout(() => {
            if (activePanel === panel) {
                panel.classList.add("active");
            }
        }, openDelay);
    }

    function closePanel() {
        clearTimeout(openTimer);
        clearTimeout(closeTimer);

        if (!activePanel) {
            pageBlur?.classList.remove("active");
            return;
        }

        activePanel.classList.remove("active");
        activePanel = null;

        pageBlur?.classList.remove("active");
    }

    // Close when clicking overlay
    pageBlur?.addEventListener("click", closePanel);

    // Close on Escape
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            closePanel();
        }
    });

    // Close when switching to desktop
    window.addEventListener("resize", () => {
        if (window.innerWidth > breakpoint) {
            closePanel();
        }
    });
});