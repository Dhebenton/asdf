
(() => {
  "use strict";

  const settings = {
    duration: 650,
    momentum: 180,
    dragThreshold: 5
  };

  const clamp = (value, min, max) =>
    Math.max(min, Math.min(max, value));

  const instances = new WeakMap();

  function initialiseSlider(root) {
    if (instances.has(root)) return instances.get(root);

    const track = root.querySelector("[data-slider-track]");
    const prev = root.querySelector(".slider-prev");
    const next = root.querySelector(".slider-next");
    const progress = root.querySelector(".progress-indicator");

    if (!track || !prev || !next || !progress) return null;

    const breakpoint = Number(root.dataset.sliderBreakpoint || 0);
    const minWidth = Number(root.dataset.sliderMin || 0);

    const media = breakpoint
      ? window.matchMedia(`(max-width: ${breakpoint}px)`)
      : null;

    let slides = [];
    let positions = [0];

    let enabled = false;
    let index = 0;
    let current = 0;
    let maxScroll = 0;

    let animation = null;
    let dragging = false;
    let moved = false;
    let pointerId = null;

    let startX = 0;
    let startY = 0;
    let startPosition = 0;

    let lastX = 0;
    let lastTime = 0;
    let dragVelocity = 0;

    let suppressClick = false;
    let resizeFrame = null;

    // POSITIONING

    function measure() {
      slides = [...track.children];

      if (!slides.length) {
        positions = [0];
        maxScroll = 0;
        return;
      }

      const first = slides[0].offsetLeft;
      const viewportWidth = root.clientWidth;

      maxScroll = Math.max(
        0,
        track.scrollWidth - viewportWidth
      );

      const rawPositions = slides.map(slide =>
        clamp(slide.offsetLeft - first, 0, maxScroll)
      );

      positions = rawPositions.filter(
        (position, i) =>
          i === 0 || position - rawPositions[i - 1] > 1
      );

      if (!positions.length) positions = [0];

      if (
        maxScroll > 1 &&
        maxScroll - positions[positions.length - 1] > 1
      ) {
        positions.push(maxScroll);
      }
    }

    function render() {
      track.style.transform = enabled
        ? `translate3d(${-current}px, 0, 0)`
        : "";
    }

    function nearest(value) {
      let closest = 0;
      let distance = Infinity;

      positions.forEach((position, i) => {
        const difference = Math.abs(position - value);

        if (difference < distance) {
          distance = difference;
          closest = i;
        }
      });

      return closest;
    }

    // PROGRESS INDICATOR

    function createProgress() {
      progress.innerHTML = positions.map(() =>
        "<div></div>"
      ).join("");
    }

    function updateState() {
      const canSlide = enabled && positions.length > 1;

      prev.disabled = !canSlide;
      next.disabled = !canSlide;

      prev.classList.toggle("inactive", !canSlide);
      next.classList.toggle("inactive", !canSlide);

      progress.querySelectorAll("div").forEach((bar, i) => {
        bar.classList.toggle("active", i === index);
      });
    }

    // ANIMATION

    function stopAnimation() {
      if (animation !== null) {
        cancelAnimationFrame(animation);
        animation = null;
      }
    }

    function animateTo(destination) {
      stopAnimation();

      destination = clamp(destination, 0, maxScroll);

      const start = current;
      const distance = destination - start;
      const startTime = performance.now();

      if (Math.abs(distance) < 0.5) {
        current = destination;
        render();
        return;
      }

      function tick(now) {
        if (!enabled) {
          animation = null;
          return;
        }

        const t = clamp(
          (now - startTime) / settings.duration,
          0,
          1
        );

        const eased = 1 - Math.pow(1 - t, 3);

        current = start + distance * eased;
        render();

        if (t < 1) {
          animation = requestAnimationFrame(tick);
        } else {
          current = destination;
          render();
          animation = null;
        }
      }

      animation = requestAnimationFrame(tick);
    }

    // NAVIGATION

    function goTo(newIndex) {
      if (!enabled || positions.length <= 1) return;

      index = (
        (newIndex % positions.length) + positions.length
      ) % positions.length;

      updateState();
      animateTo(positions[index]);
    }

    prev.addEventListener("click", () => {
      goTo(index - 1);
    });

    next.addEventListener("click", () => {
      goTo(index + 1);
    });

    // POINTER DRAGGING

    track.addEventListener("pointerdown", event => {
      if (!enabled || positions.length <= 1) return;
      if (dragging) return;

      if (
        event.pointerType === "mouse" &&
        event.button !== 0
      ) return;

      stopAnimation();

      dragging = true;
      moved = false;
      pointerId = event.pointerId;

      startX = event.clientX;
      startY = event.clientY;
      startPosition = current;

      lastX = event.clientX;
      lastTime = performance.now();
      dragVelocity = 0;

      suppressClick = false;
    });

    root.addEventListener("pointermove", event => {
      if (!dragging || event.pointerId !== pointerId) return;

      const differenceX = startX - event.clientX;
      const differenceY = startY - event.clientY;

      if (!moved) {
        if (
          Math.abs(differenceY) > Math.abs(differenceX) &&
          Math.abs(differenceY) > settings.dragThreshold
        ) {
          dragging = false;
          pointerId = null;
          return;
        }

        if (Math.abs(differenceX) > settings.dragThreshold) {
          moved = true;
          track.classList.add("dragging");

          if (event.pointerType === "mouse") {
            try {
              root.setPointerCapture(event.pointerId);
            } catch (error) {}
          }
        }
      }

      if (!moved) return;

      if (event.cancelable) event.preventDefault();

      const now = performance.now();
      const elapsed = Math.max(now - lastTime, 1);

      const instantVelocity =
        (lastX - event.clientX) / elapsed;

      dragVelocity =
        dragVelocity * 0.2 +
        instantVelocity * 0.8;

      lastX = event.clientX;
      lastTime = now;

      current = clamp(
        startPosition + differenceX,
        0,
        maxScroll
      );

      render();
    });

    // DRAG RELEASE

    function finishDrag(event, cancelled = false) {
      if (!dragging || event.pointerId !== pointerId) return;

      const wasMoved = moved;

      dragging = false;
      moved = false;
      pointerId = null;

      track.classList.remove("dragging");

      if (root.hasPointerCapture?.(event.pointerId)) {
        root.releasePointerCapture(event.pointerId);
      }

      if (!wasMoved) return;

      suppressClick = true;

      const projected = cancelled
        ? current
        : clamp(
            current + dragVelocity * settings.momentum,
            0,
            maxScroll
          );

      index = nearest(projected);

      updateState();
      animateTo(positions[index]);
    }

    root.addEventListener("pointerup", event => {
      finishDrag(event);
    });

    root.addEventListener("pointercancel", event => {
      finishDrag(event, true);
    });

    root.addEventListener("lostpointercapture", event => {
      if (dragging && event.pointerId === pointerId) {
        finishDrag(event, true);
      }
    });

    // PREVENT CLICKS AFTER DRAGGING

    root.addEventListener("click", event => {
      if (!suppressClick) return;
      if (!track.contains(event.target)) return;

      event.preventDefault();
      event.stopPropagation();

      suppressClick = false;
    }, true);

    track.addEventListener("dragstart", event => {
      if (enabled) event.preventDefault();
    });

    // RESPONSIVE LOGIC

    function refresh(reset = false) {
      if (dragging) return;

      const shouldEnable =
        (!media || media.matches) &&
        (!minWidth || window.innerWidth >= minWidth);

      stopAnimation();

      const wasEnabled = enabled;
      enabled = shouldEnable;

      root.classList.toggle("slider-active", enabled);

      if (!enabled) {
        index = 0;
        current = 0;

        track.style.transform = "";

        prev.disabled = true;
        next.disabled = true;

        prev.classList.add("inactive");
        next.classList.add("inactive");

        return;
      }

      measure();
      createProgress();

      if (reset || !wasEnabled) {
        index = 0;
        current = 0;
      } else {
        index = clamp(index, 0, positions.length - 1);
        current = positions[index] || 0;
      }

      render();
      updateState();
    }

    // REFRESH AFTER DYNAMIC CONTENT CHANGES

    const resizeObserver = new ResizeObserver(() => {
      if (resizeFrame !== null) return;

      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = null;
        refresh();
      });
    });

    function observeSlides(reset = false) {
      resizeObserver.disconnect();
      resizeObserver.observe(root);

      slides = [...track.children];

      slides.forEach(slide => {
        resizeObserver.observe(slide);
      });

      refresh(reset);
    }

    const mutationObserver = new MutationObserver(() => {
      observeSlides(true);
    });

    mutationObserver.observe(track, {
      childList: true
    });

    // MEDIA AND WINDOW RESIZE

    if (media) {
      media.addEventListener("change", () => {
        refresh(true);
      });
    }

    window.addEventListener("resize", () => {
      refresh();
    });

    // PUBLIC INSTANCE METHODS

    const instance = {
      refresh() {
        observeSlides();
      },

      reset() {
        stopAnimation();

        index = 0;
        current = 0;

        observeSlides(true);
      }
    };

    instances.set(root, instance);
    root.dataset.sliderInitialized = "true";


    observeSlides(true);

    return instance;
  }


  function initSliders() {
    document.querySelectorAll("[data-slider]").forEach(root => {
      const track = root.querySelector("[data-slider-track]");

      if (!track) return;

      const instance = initialiseSlider(root);

      if (instance) {
        instance.refresh();
      }
    });
  }


  function handleProductsLoaded(event) {
    const changedContainer = event.detail?.container;

    if (!changedContainer) {
      initSliders();
      return;
    }

    const root = changedContainer.closest("[data-slider]");

    if (!root) return;

    const instance = initialiseSlider(root);

    if (instance) {
      instance.refresh();
    }
  }


  function handleSliderReset(event) {
    const root = event.detail?.container;

    if (!root || !root.matches?.("[data-slider]")) return;

    const instance = initialiseSlider(root);

    if (instance) {
      instance.reset();
    }
  }


  function start() {
    initSliders();
  }

  document.addEventListener(
    "productsLoaded",
    handleProductsLoaded
  );

  document.addEventListener(
    "sliderReset",
    handleSliderReset
  );

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, {
      once: true
    });
  } else {
    start();
  }

})();
