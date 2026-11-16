(() => {
  "use strict";

  const section = document.querySelector("#product-media");
  const track = section?.querySelector("[data-slider-track]");

  if (!section || !track) return;

  const arrowIcon = `
    <svg viewBox="0 0 11 8" fill="currentColor" aria-hidden="true">
      <path d="m7.45005.0837298.06184.0618462-.00095.000951L10.8535 3.48811l.0628.06184.0837.08278-3.48906 3.48811-.06089.06279-.08278.08469-.08278-.08373-.61846-.61846-.08278-.08183.08183-.08278.06185-.0628 2.15509-2.15509H0v-1.0999h8.88202L6.58325.784015 7.36727 0z"/>
    </svg>`;

  const expandIcon = `
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
      <path d="M7.5 3H3v4.5M12.5 3H17v4.5M7.5 17H3v-4.5M12.5 17H17v-4.5"/>
    </svg>`;

  const closeIcon = `
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
      <path d="M4 4l12 12M16 4L4 16"/>
    </svg>`;

  const overlay = document.createElement("div");
  overlay.className = "media-lightbox";
  overlay.hidden = true;
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Product media viewer");
  overlay.innerHTML = `
    <button type="button" class="media-lightbox-button media-lightbox-close" aria-label="Close media viewer">${closeIcon}</button>
    <button type="button" class="media-lightbox-button media-lightbox-prev" aria-label="Previous image">${arrowIcon}</button>
    <div class="media-lightbox-stage">
      <img class="media-lightbox-image" alt="">
    </div>
    <button type="button" class="media-lightbox-button media-lightbox-next" aria-label="Next image">${arrowIcon}</button>
    <p class="media-lightbox-count" aria-live="polite"></p>`;

  document.body.appendChild(overlay);

  const image = overlay.querySelector(".media-lightbox-image");
  const stage = overlay.querySelector(".media-lightbox-stage");
  const count = overlay.querySelector(".media-lightbox-count");
  const closeButton = overlay.querySelector(".media-lightbox-close");
  const prevButton = overlay.querySelector(".media-lightbox-prev");
  const nextButton = overlay.querySelector(".media-lightbox-next");

  let items = [];
  let index = 0;
  let returnFocus = null;
  let touchStartX = null;

  function collectItems() {
    items = [...track.querySelectorAll(":scope > picture > img")]
      .filter(item => item.currentSrc || item.src)
      .map(item => ({
        src: item.currentSrc || item.src,
        alt: item.alt || "Product image"
      }));
  }

  function show(newIndex) {
    if (!items.length) return;

    index = (newIndex + items.length) % items.length;
    image.src = items[index].src;
    image.alt = items[index].alt;
    count.textContent = `${index + 1} / ${items.length}`;

    const hasMultiple = items.length > 1;
    prevButton.hidden = !hasMultiple;
    nextButton.hidden = !hasMultiple;
  }

  function open(startIndex, trigger) {
    collectItems();
    if (!items.length) return;

    returnFocus = trigger;
    overlay.hidden = false;
    document.body.classList.add("media-lightbox-open");
    show(startIndex);
    closeButton.focus({ preventScroll: true });
  }

  function close() {
    if (overlay.hidden) return;

    overlay.hidden = true;
    image.removeAttribute("src");
    document.body.classList.remove("media-lightbox-open");
    returnFocus?.focus({ preventScroll: true });
  }

  function addEnlargeButtons() {
    const pictures = [...track.querySelectorAll(":scope > picture")];

    pictures.forEach((picture, pictureIndex) => {
      if (picture.querySelector(".media-enlarge-button")) return;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "media-enlarge-button";
      button.setAttribute("aria-label", `Enlarge image ${pictureIndex + 1}`);
      button.innerHTML = expandIcon;
      button.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        open(pictureIndex, button);
      });
      picture.appendChild(button);
    });
  }

  closeButton.addEventListener("click", close);
  prevButton.addEventListener("click", () => show(index - 1));
  nextButton.addEventListener("click", () => show(index + 1));

  overlay.addEventListener("click", event => {
    if (event.target === overlay || event.target === stage) close();
  });

  document.addEventListener("keydown", event => {
    if (overlay.hidden) return;

    if (["Escape", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      event.preventDefault();
    }

    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") show(index - 1);
    if (event.key === "ArrowRight") show(index + 1);

    if (event.key === "Tab") {
      const controls = [closeButton, prevButton, nextButton]
        .filter(control => !control.hidden);
      const current = controls.indexOf(document.activeElement);

      if (event.shiftKey && current <= 0) {
        event.preventDefault();
        controls[controls.length - 1].focus();
      } else if (!event.shiftKey && current === controls.length - 1) {
        event.preventDefault();
        controls[0].focus();
      }
    }
  });

  stage.addEventListener("pointerdown", event => {
    touchStartX = event.pointerType === "touch" ? event.clientX : null;
  });

  stage.addEventListener("pointerup", event => {
    if (touchStartX === null) return;

    const distance = event.clientX - touchStartX;
    touchStartX = null;

    if (Math.abs(distance) < 45) return;
    show(index + (distance < 0 ? 1 : -1));
  });

  const observer = new MutationObserver(addEnlargeButtons);
  observer.observe(track, { childList: true });

  document.addEventListener("productsLoaded", event => {
    if (event.detail?.container === track) addEnlargeButtons();
  });

  addEnlargeButtons();
})();
