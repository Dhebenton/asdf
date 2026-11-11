
(() => {
     'use strict';

     function initNavigation() {
          const nav = document.querySelector('nav');
          if (!nav) return;

          const pageBlur = document.querySelector('.page-blur');
          const menuButton = nav.querySelector('.menu-button');
          const dropdown = nav.querySelector('.dropdown');
          const triggers = [...nav.querySelectorAll('[data-nav]')];
          const panels = [...nav.querySelectorAll('[data-dropdown]')];

          const breakpoint = window.matchMedia('(max-width: 1079px)');
          const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

          const DURATION = 470;
          const EASING = 'cubic-bezier(.76, 0, .24, 1)';
          const SCROLL_THRESHOLD = 60;

          const panelNames = panels.map(panel => panel.dataset.dropdown);
          const screenCache = new Map();

          let mobileNav = document.querySelector('.mobile-navigation');
          let mobileContent = null;

          let mobileOpen = false;
          let activeName = null;

          let currentScreen = null;
          let screenStack = [];
          let screenAnimating = false;
          let screenAnimations = [];
          let transitionVersion = 0;

          let lastScroll = window.scrollY;
          let scrollDistance = 0;
          let savedScroll = 0;
          let scrollLocked = false;

          const originalBodyStyles = {};

          /* ============================================================
             PAGE SCROLL LOCK
          ============================================================ */

          function lockScroll() {
               if (scrollLocked) return;

               savedScroll = window.scrollY;
               scrollLocked = true;

               ['position', 'top', 'left', 'right', 'width'].forEach(property => {
                    originalBodyStyles[property] = document.body.style[property];
               });

               document.body.style.position = 'fixed';
               document.body.style.top = `-${savedScroll}px`;
               document.body.style.left = '0';
               document.body.style.right = '0';
               document.body.style.width = '100%';

               document.body.classList.add('nav-scroll-locked');
          }

          function unlockScroll() {
               if (!scrollLocked) return;

               scrollLocked = false;

               Object.keys(originalBodyStyles).forEach(property => {
                    document.body.style[property] = originalBodyStyles[property];
               });

               document.body.classList.remove('nav-scroll-locked');

               window.scrollTo(0, savedScroll);

               lastScroll = savedScroll;
               scrollDistance = 0;
          }

          function updateOverlay() {
               const active = mobileOpen || activeName !== null;

               pageBlur?.classList.toggle('active', active);

               if (active) {
                    lockScroll();
               } else {
                    unlockScroll();
               }
          }

          /* ============================================================
             DESKTOP DROPDOWNS
          ============================================================ */

          function openDropdown(name) {
               if (breakpoint.matches) return;

               const nextPanel = panels.find(panel => {
                    return panel.dataset.dropdown === name;
               });

               if (!nextPanel || activeName === name) return;

               const previousIndex = panelNames.indexOf(activeName);
               const nextIndex = panelNames.indexOf(name);

               nav.dataset.direction =
                    previousIndex !== -1 && nextIndex < previousIndex
                         ? 'backward'
                         : 'forward';

               activeName = name;

               nav.style.transform = 'translateY(0%)';
               nav.classList.add('dropdown-open');

               triggers.forEach(trigger => {
                    const active = trigger.dataset.nav === name;

                    trigger.classList.toggle('active', active);
                    trigger.setAttribute('aria-expanded', String(active));
               });

               panels.forEach(panel => {
                    const active = panel === nextPanel;
                    const wasActive = panel.classList.contains('is-active');

                    panel.classList.remove('is-exiting');

                    if (!active && wasActive) {
                         panel.classList.add('is-exiting');
                    }

                    panel.classList.toggle('is-active', active);
                    panel.setAttribute('aria-hidden', String(!active));
                    panel.inert = !active;
               });

               updateOverlay();
          }

          function closeDropdown() {
               activeName = null;

               nav.classList.remove('dropdown-open');

               triggers.forEach(trigger => {
                    trigger.classList.remove('active');
                    trigger.setAttribute('aria-expanded', 'false');
               });

               panels.forEach(panel => {
                    panel.classList.remove('is-active', 'is-exiting');
                    panel.setAttribute('aria-hidden', 'true');
                    panel.inert = true;
               });

               updateOverlay();
          }

          /* ============================================================
             ELEMENT HELPERS
          ============================================================ */

          function create(tag, className = '', text = '') {
               const element = document.createElement(tag);

               if (className) element.className = className;
               if (text) element.textContent = text;

               return element;
          }

          function arrow() {
               const svg = document.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'svg'
               );

               const use = document.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'use'
               );

               svg.setAttribute('viewBox', '0 0 5 8');
               svg.setAttribute('fill', 'currentColor');

               use.setAttribute('href', '#chevron-right');

               svg.appendChild(use);

               return svg;
          }

          function createTab(label, callback) {
               const button = create('button', 'fr tabs heading jsb');

               button.type = 'button';
               button.append(document.createTextNode(label), arrow());
               button.addEventListener('click', callback);

               return button;
          }

          function createBack(label) {
               const button = create('button', 'go-back fr g10');

               button.type = 'button';
               button.append(arrow(), document.createTextNode(label));
               button.addEventListener('click', goBack);

               return button;
          }

          function createLink(source) {
               const link = create(
                    'a',
                    'fr tabs heading jsb',
                    source.textContent.trim()
               );

               link.href = source.getAttribute('href') || '#';

               return link;
          }

          /* ============================================================
             MOBILE SCREEN CACHE
          ============================================================ */

          function getScreenKey(state) {
               if (state.level === 0) return 'main';

               if (state.level === 1) {
                    return `section-${state.name}`;
               }

               return `links-${state.name}-${state.columnIndex}`;
          }

          function getScreen(state) {
               const key = getScreenKey(state);

               if (screenCache.has(key)) {
                    return screenCache.get(key);
               }

               let screen;

               if (state.level === 0) {
                    screen = buildMainScreen();
               } else if (state.level === 1) {
                    screen = buildSectionScreen(state);
               } else {
                    screen = buildLinksScreen(state);
               }

               screen.classList.add('mobile-screen');
               screen.dataset.screen = key;

               // Padding belongs to the screen, not the scroll container
               screen.classList.add('ch');

               screenCache.set(key, screen);

               return screen;
          }

          /* ============================================================
             FIRST MOBILE SCREEN
          ============================================================ */

          function buildMainScreen() {
               const screen = create(
                    'div',
                    'first-screen content fc g40 ch'
               );

               triggers.forEach(trigger => {
                    const name = trigger.dataset.nav;

                    const label = name === 'machinery'
                         ? 'Equipment'
                         : trigger.textContent.trim();

                    screen.appendChild(createTab(label, () => {
                         navigateTo({
                              level: 1,
                              name,
                              label
                         });
                    }));
               });

               const contact = nav.querySelector('.links .contact');

               if (contact) {
                    screen.appendChild(createLink(contact));
               }

               return screen;
          }

          /* ============================================================
             SECOND MOBILE SCREEN
          ============================================================ */

          function buildSectionScreen(state) {
               const screen = create(
                    'div',
                    'second-screen fc ch'
               );

               const panel = panels.find(panel => {
                    return panel.dataset.dropdown === state.name;
               });

               if (!panel) return screen;

               screen.appendChild(createBack('Main Menu'));

               const mainWrap = create('div', 'main-link-wrap fr');

               const mainLink = create(
                    'a',
                    'main-link',
                    `All ${state.label}`
               );

               const trigger = triggers.find(trigger => {
                    return trigger.dataset.nav === state.name;
               });

               mainLink.href = trigger?.getAttribute('href') || '#';

               mainWrap.appendChild(mainLink);
               screen.appendChild(mainWrap);

               const wrap = create('div', 'wrap fc g32');
               const columns = [...panel.querySelectorAll('.col')];

               columns.forEach((column, index) => {
                    const heading = column.querySelector('.heading');

                    if (!heading) return;

                    const label = heading.textContent.trim();

                    wrap.appendChild(createTab(label, () => {
                         navigateTo({
                              level: 2,
                              name: state.name,
                              label: state.label,
                              columnIndex: index
                         });
                    }));
               });

               /* ============================================================
                  CTA IMAGE
               ============================================================ */

               const sourceCTA = panel.querySelector('.nav-cta');

               if (sourceCTA) {
                    const cta = sourceCTA.cloneNode(true);
                    const image = cta.querySelector('img');

                    if (image) {
                         image.loading = 'eager';
                         image.decoding = 'async';
                    }

                    wrap.appendChild(cta);
               }

               screen.appendChild(wrap);

               return screen;
          }

          /* ============================================================
             THIRD MOBILE SCREEN
          ============================================================ */

          function buildLinksScreen(state) {
               const screen = create(
                    'div',
                    'third-screen fc g36 ch'
               );

               const panel = panels.find(panel => {
                    return panel.dataset.dropdown === state.name;
               });

               if (!panel) return screen;

               screen.appendChild(createBack(state.label));

               const wrap = create('div', 'wrap fc g32');
               const columns = [...panel.querySelectorAll('.col')];
               const column = columns[state.columnIndex];

               if (column) {
                    const links = [...column.querySelectorAll('a.link')];

                    links.forEach(link => {
                         wrap.appendChild(createLink(link));
                    });
               }

               screen.appendChild(wrap);

               return screen;
          }

          /* ============================================================
             PREPARE CTA IMAGES
          ============================================================ */

          function preloadCTAImages() {
               panels.forEach(panel => {
                    const source = panel.querySelector('.nav-cta img');
                    if (!source) return;

                    const src = source.getAttribute('src');
                    if (!src) return;

                    const preload = new Image();

                    preload.decoding = 'async';
                    preload.src = src;

                    // Build second screen once so its image stays mounted
                    const name = panel.dataset.dropdown;
                    const trigger = triggers.find(item => {
                         return item.dataset.nav === name;
                    });

                    if (trigger) {
                         getScreen({
                              level: 1,
                              name,
                              label: name === 'machinery'
                                   ? 'Equipment'
                                   : trigger.textContent.trim()
                         });
                    }
               });
          }

          /* ============================================================
             SCREEN TRANSITION STYLES
          ============================================================ */

          function resetScreenStyles(screen) {
               if (!screen) return;

               screen.style.position = '';
               screen.style.top = '';
               screen.style.left = '';
               screen.style.right = '';
               screen.style.width = '';
               screen.style.zIndex = '';
               screen.style.transform = '';
               screen.style.opacity = '';
               screen.style.pointerEvents = '';

               // Never remove .ch
               screen.classList.add('ch');
          }

          function stopScreenAnimations() {
               transitionVersion++;

               screenAnimations.forEach(animation => {
                    animation.cancel();
               });

               screenAnimations = [];
               screenAnimating = false;

               if (mobileContent) {
                    mobileContent.classList.remove('transitioning');
               }
          }

          /* ============================================================
             MOBILE SCREEN TRANSITIONS
          ============================================================ */

          function showScreen(state, direction = 1, animate = true) {
               if (!mobileContent || screenAnimating) return;

               const nextScreen = getScreen(state);
               const previousScreen = currentScreen;

               if (nextScreen === previousScreen) return;

               if (!previousScreen || !animate || reducedMotion.matches) {
                    resetScreenStyles(previousScreen);
                    resetScreenStyles(nextScreen);

                    mobileContent.replaceChildren(nextScreen);

                    nextScreen.inert = false;
                    currentScreen = nextScreen;

                    mobileContent.scrollTop = 0;

                    return;
               }

               screenAnimating = true;

               const version = ++transitionVersion;
               const oldScroll = mobileContent.scrollTop;
               const screenWidth = mobileContent.clientWidth;

               /*
                  Both screens are full-width.

                  The .ch padding is applied INSIDE each screen.

                  This means the padding moves WITH the screen
                  instead of being clipped by the parent.
               */

               previousScreen.style.position = 'absolute';
               previousScreen.style.top = `${-oldScroll}px`;
               previousScreen.style.left = '0';
               previousScreen.style.right = '0';
               previousScreen.style.width = '100%';
               previousScreen.style.zIndex = '1';
               previousScreen.style.pointerEvents = 'none';

               previousScreen.inert = true;

               nextScreen.style.position = 'relative';
               nextScreen.style.width = '100%';
               nextScreen.style.zIndex = '2';

               nextScreen.inert = false;

               mobileContent.classList.add('transitioning');

               // Keep both elements mounted while animating
               mobileContent.appendChild(nextScreen);
               mobileContent.scrollTop = 0;

               const offset = direction > 0
                    ? screenWidth
                    : -screenWidth;

               const outgoingOffset = -offset;

               const outgoing = previousScreen.animate([
                    {
                         transform: 'translate3d(0, 0, 0)'
                    },
                    {
                         transform: `translate3d(${outgoingOffset}px, 0, 0)`
                    }
               ], {
                    duration: DURATION,
                    easing: EASING,
                    fill: 'forwards'
               });

               const incoming = nextScreen.animate([
                    {
                         transform: `translate3d(${offset}px, 0, 0)`
                    },
                    {
                         transform: 'translate3d(0, 0, 0)'
                    }
               ], {
                    duration: DURATION,
                    easing: EASING,
                    fill: 'forwards'
               });

               screenAnimations = [outgoing, incoming];

               Promise.allSettled([
                    outgoing.finished,
                    incoming.finished
               ]).then(() => {
                    if (version !== transitionVersion) return;

                    outgoing.cancel();
                    incoming.cancel();

                    screenAnimations = [];

                    previousScreen.remove();

                    resetScreenStyles(previousScreen);
                    resetScreenStyles(nextScreen);

                    mobileContent.replaceChildren(nextScreen);

                    mobileContent.classList.remove('transitioning');

                    currentScreen = nextScreen;
                    screenAnimating = false;
               });
          }

          /* ============================================================
             MOBILE SCREEN NAVIGATION
          ============================================================ */

          function navigateTo(state) {
               if (screenAnimating) return;

               screenStack.push(state);

               showScreen(state, 1, true);
          }

          function goBack() {
               if (screenAnimating || screenStack.length <= 1) return;

               screenStack.pop();

               const previous = screenStack[screenStack.length - 1];

               showScreen(previous, -1, true);
          }

          function resetScreens() {
               if (!mobileContent) return;

               stopScreenAnimations();

               screenStack = [{ level: 0 }];

               const first = getScreen(screenStack[0]);

               screenCache.forEach(screen => {
                    resetScreenStyles(screen);
                    screen.inert = screen !== first;
               });

               mobileContent.replaceChildren(first);

               first.inert = false;
               currentScreen = first;

               mobileContent.scrollTop = 0;
          }

          /* ============================================================
             MOBILE MENU SETUP
          ============================================================ */

          function setupMobileNavigation() {
               if (!mobileNav) {
                    mobileNav = create('div', 'mobile-navigation');

                    const top = create('div', 'fr top ch jsb');

                    const sourceLogo = nav.querySelector('.logo');
                    const logo = sourceLogo?.cloneNode(true);

                    if (logo) top.appendChild(logo);

                    const closeButton = create(
                         'button',
                         'close fr jc'
                    );

                    closeButton.type = 'button';
                    closeButton.setAttribute(
                         'aria-label',
                         'Close menu'
                    );

                    const closeSvg = document.createElementNS(
                         'http://www.w3.org/2000/svg',
                         'svg'
                    );

                    const closeUse = document.createElementNS(
                         'http://www.w3.org/2000/svg',
                         'use'
                    );

                    closeSvg.setAttribute('viewBox', '0 0 9 9');
                    closeSvg.setAttribute('fill', 'currentColor');

                    closeUse.setAttribute('href', '#plus');

                    closeSvg.appendChild(closeUse);
                    closeButton.appendChild(closeSvg);

                    top.appendChild(closeButton);

                    const content = create(
                         'div',
                         'content-wrap'
                    );

                    const bottom = create(
                         'div',
                         'bottom fr g12'
                    );

                    const contact = create(
                         'a',
                         'button blue',
                         'Get In Touch'
                    );

                    contact.href = '/contact/';

                    bottom.appendChild(contact);

                    mobileNav.append(top, content, bottom);
               }

               if (mobileNav.parentElement !== document.body) {
                    document.body.appendChild(mobileNav);
               }

               mobileContent = mobileNav.querySelector('.content-wrap');

               if (!mobileContent) {
                    mobileContent = create('div', 'content-wrap');

                    const bottom = mobileNav.querySelector('.bottom');

                    if (bottom) {
                         mobileNav.insertBefore(mobileContent, bottom);
                    } else {
                         mobileNav.appendChild(mobileContent);
                    }
               }

               // Remove padding from parent, screens own their padding
               mobileContent.classList.remove('ch');

               mobileNav.setAttribute('role', 'dialog');
               mobileNav.setAttribute('aria-modal', 'true');
               mobileNav.setAttribute('aria-label', 'Main navigation');
               mobileNav.setAttribute('aria-hidden', 'true');

               mobileNav.inert = true;

               resetScreens();
               preloadCTAImages();

               mobileNav.querySelector('.close')?.addEventListener(
                    'click',
                    event => {
                         event.preventDefault();
                         closeMobile();
                    }
               );
          }

          /* ============================================================
             OPEN MOBILE NAVIGATION
          ============================================================ */

          function openMobile() {
               if (!breakpoint.matches || mobileOpen || !mobileNav) return;

               closeDropdown();
               resetScreens();

               mobileOpen = true;

               mobileNav.inert = false;
               mobileNav.setAttribute('aria-hidden', 'false');

               menuButton?.setAttribute('aria-expanded', 'true');

               nav.style.transform = 'translateY(0%)';

               updateOverlay();

               void mobileNav.offsetWidth;

               mobileNav.classList.add('active');

               mobileNav.querySelector('.close')?.focus({
                    preventScroll: true
               });
          }

          
          /* ============================================================
          CLOSE MOBILE NAVIGATION
          ============================================================ */

          function closeMobile() {
          if (!mobileOpen) return;

          mobileOpen = false;

          mobileNav.classList.remove('active');

          menuButton?.setAttribute('aria-expanded', 'false');

          // Prevent interaction while closing.
          mobileNav.inert = true;
          mobileNav.setAttribute('aria-hidden', 'true');

          stopScreenAnimations();

          // Keep the current screen visible until the exit finishes.
          const duration = 690;

          window.setTimeout(() => {
               // Do not reset if the menu has reopened.
               if (mobileOpen) return;

               resetScreens();
               updateOverlay();
          }, reducedMotion.matches ? 0 : duration);
          }


          /* ============================================================
             RESPONSIVE DOM MANAGEMENT
          ============================================================ */

          const dropdownPlaceholder = document.createComment(
               'Desktop dropdown placeholder'
          );

          function handleBreakpoint() {
               closeMobile();
               closeDropdown();

               if (breakpoint.matches) {
                    if (dropdown?.isConnected) {
                         dropdown.replaceWith(dropdownPlaceholder);
                    }

                    nav.style.transform = 'translateY(0%)';
               } else {
                    if (dropdownPlaceholder.isConnected && dropdown) {
                         dropdownPlaceholder.replaceWith(dropdown);
                    }

                    nav.style.transform = 'translateY(0%)';
               }

               lastScroll = window.scrollY;
               scrollDistance = 0;
          }

          /* ============================================================
             DESKTOP EVENTS
          ============================================================ */

          triggers.forEach(trigger => {
               trigger.setAttribute('aria-expanded', 'false');
               trigger.setAttribute('aria-haspopup', 'true');

               trigger.addEventListener('mouseenter', () => {
                    if (!breakpoint.matches) {
                         openDropdown(trigger.dataset.nav);
                    }
               });

               trigger.addEventListener('focus', () => {
                    if (!breakpoint.matches) {
                         openDropdown(trigger.dataset.nav);
                    }
               });
          });

          panels.forEach(panel => {
               panel.inert = true;
               panel.setAttribute('aria-hidden', 'true');
          });

          nav.addEventListener('mouseleave', () => {
               if (!breakpoint.matches) {
                    closeDropdown();
               }
          });

          nav.querySelectorAll('.links a:not([data-nav])').forEach(link => {
               link.addEventListener('mouseenter', () => {
                    if (!breakpoint.matches) {
                         closeDropdown();
                    }
               });
          });

          nav.addEventListener('focusout', event => {
               if (
                    !breakpoint.matches &&
                    !nav.contains(event.relatedTarget)
               ) {
                    closeDropdown();
               }
          });

          /* ============================================================
             MOBILE MENU BUTTON
          ============================================================ */

          if (menuButton) {
               menuButton.setAttribute('aria-expanded', 'false');
               menuButton.setAttribute('aria-label', 'Open navigation');

               menuButton.addEventListener('click', event => {
                    event.preventDefault();
                    event.stopPropagation();

                    if (!breakpoint.matches) return;

                    if (mobileOpen) {
                         closeMobile();
                    } else {
                         openMobile();
                    }
               });
          }

          /* ============================================================
             BACKGROUND BLUR
          ============================================================ */

          pageBlur?.addEventListener('click', () => {
               closeMobile();
               closeDropdown();
          });

          document.addEventListener('click', event => {
               if (mobileOpen) {
                    if (
                         !mobileNav.contains(event.target) &&
                         !menuButton?.contains(event.target)
                    ) {
                         closeMobile();
                    }

                    return;
               }

               if (activeName && !nav.contains(event.target)) {
                    closeDropdown();
               }
          });

          /* ============================================================
             KEYBOARD
          ============================================================ */

          document.addEventListener('keydown', event => {
               if (event.key !== 'Escape') return;

               if (mobileOpen) {
                    closeMobile();

                    menuButton?.focus({
                         preventScroll: true
                    });

                    return;
               }

               if (activeName) {
                    const previous = activeName;

                    closeDropdown();

                    triggers.find(trigger => {
                         return trigger.dataset.nav === previous;
                    })?.focus({
                         preventScroll: true
                    });
               }
          });

          /* ============================================================
             SCROLL HIDE / SHOW
          ============================================================ */

          window.addEventListener('scroll', () => {
               if (scrollLocked || mobileOpen || activeName) return;

               const currentScroll = window.scrollY;
               const delta = currentScroll - lastScroll;

               if (Math.sign(delta) !== Math.sign(scrollDistance)) {
                    scrollDistance = 0;
               }

               scrollDistance += delta;

               if (currentScroll <= 30) {
                    nav.style.transform = 'translateY(0%)';
                    scrollDistance = 0;
               } else if (scrollDistance >= SCROLL_THRESHOLD) {
                    nav.style.transform = 'translateY(-101%)';
                    scrollDistance = 0;
               } else if (scrollDistance <= -SCROLL_THRESHOLD) {
                    nav.style.transform = 'translateY(0%)';
                    scrollDistance = 0;
               }

               lastScroll = currentScroll;
          }, { passive: true });

          /* ============================================================
             INITIALISATION
          ============================================================ */

          setupMobileNavigation();
          handleBreakpoint();

          breakpoint.addEventListener('change', handleBreakpoint);

          window.addEventListener('pageshow', () => {
               closeMobile();
               closeDropdown();
          });
     }

     if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initNavigation, {
               once: true
          });
     } else {
          initNavigation();
     }
})();
