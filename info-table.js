document.addEventListener('DOMContentLoaded', () => {
    const breakpoint = 770;
    const cards = [...document.querySelectorAll('.info-table')];
    if (!cards.length) return;

    const overlay = document.querySelector('.page-blur');
    const panels = cards.map((card, index) => {
        const panel = document.createElement('div');
        panel.className = 'info-table-content';
        panel.dataset.index = index;
        panel.innerHTML = `
            <button type="button" class="icon yes-hmobile fr jc" aria-label="Close details">
                <svg viewBox="0 0 8 8" fill="currentColor"><use href="#plus"></use></svg>
            </button>`;

        const heading = card.querySelector('h3');
        const paragraph = card.querySelector('p');
        const picture = card.querySelector('picture');
        if (heading) panel.appendChild(heading.cloneNode(true));
        if (paragraph) panel.appendChild(paragraph.cloneNode(true));
        if (picture) {
            const imageWrap = document.createElement('div');
            imageWrap.className = 'image-wrap';
            imageWrap.appendChild(picture.cloneNode(true));
            panel.appendChild(imageWrap);
        }
        document.body.appendChild(panel);
        return panel;
    });

    let activePanel = null;
    const closePanel = () => {
        activePanel?.classList.remove('active');
        activePanel = null;
        overlay?.classList.remove('active');
    };
    const openPanel = panel => {
        if (window.innerWidth > breakpoint) return;
        panels.forEach(item => item.classList.toggle('active', item === panel));
        activePanel = panel;
        overlay?.classList.add('active');
    };

    cards.forEach((card, index) => card.addEventListener('click', () => openPanel(panels[index])));
    panels.forEach(panel => panel.querySelector('button')?.addEventListener('click', event => {
        event.stopPropagation();
        closePanel();
    }));
    overlay?.addEventListener('click', closePanel);
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closePanel();
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > breakpoint) closePanel();
    });
});
