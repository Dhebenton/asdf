
(() => {
     'use strict';

     function initialiseEnquiry() {
          const enquiry = document.querySelector('.enquiry-flow');
          const blur = document.querySelector('.background-blur');
          const form = document.querySelector('#product-enquiry-form');
          const success = enquiry?.querySelector('.enquiry-success');
          const submitButton = enquiry?.querySelector('.enquiry-submit');
          const formStatus = enquiry?.querySelector('.form-status');

          if (!enquiry || !blur || !form || !success || !submitButton || !formStatus) {
               console.error('ETR Enquiry: Missing enquiry HTML, background blur or form.');
               return;
          }

          const closeButton = enquiry.querySelector('.enquiry-close');
          const equipmentSection = enquiry.querySelector('.selected-equipment');
          const equipmentList = enquiry.querySelector('.selected-equipment-list');
          const attachmentsSection = enquiry.querySelector('.selected-attachments');
          const attachmentsList = enquiry.querySelector('.selected-attachments-list');

          if (
               !closeButton ||
               !equipmentSection ||
               !equipmentList ||
               !attachmentsSection ||
               !attachmentsList
          ) {
               console.error('ETR Enquiry: Selected equipment or attachment elements are missing.');
               return;
          }

          let active = false;
          let product = null;
          let attachments = [];
          let previousFocus = null;
          let scrollPosition = 0;
          let previousStyles = null;

          function selectRadio(option) {
               const name = option.dataset.radioName;

               enquiry.querySelectorAll(`[data-radio-name="${name}"]`).forEach(item => {
                    const selected = item === option;
                    item.classList.toggle('active', selected);
                    item.setAttribute('aria-checked', String(selected));
               });
          }

          function clearRadios() {
               enquiry.querySelectorAll('[data-radio-name]').forEach(item => {
                    item.classList.remove('active');
                    item.setAttribute('aria-checked', 'false');
               });
          }

          function resetSuccess() {
               enquiry.classList.remove('success');
               success.setAttribute('aria-hidden', 'true');
               form.removeAttribute('aria-hidden');
               form.inert = false;
               submitButton.type = 'submit';
               submitButton.setAttribute('form', 'product-enquiry-form');
               submitButton.textContent = 'Send Message';
               submitButton.disabled = false;
               formStatus.hidden = true;
               formStatus.textContent = '';
          }

          function showSuccess() {
               enquiry.classList.add('success');
               success.setAttribute('aria-hidden', 'false');
               form.setAttribute('aria-hidden', 'true');
               form.inert = true;
               submitButton.type = 'button';
               submitButton.removeAttribute('form');
               submitButton.textContent = 'Close';
               submitButton.disabled = false;

               requestAnimationFrame(() => {
                    success.querySelector('h3')?.focus({ preventScroll: true });
               });
          }

          enquiry.addEventListener('click', event => {
               const option = event.target.closest('[data-radio-name]');
               if (option) selectRadio(option);
          });

          enquiry.addEventListener('keydown', event => {
               const option = event.target.closest('[data-radio-name]');
               if (!option || (event.key !== 'Enter' && event.key !== ' ')) return;
               event.preventDefault();
               selectRadio(option);
          });

          submitButton.addEventListener('click', () => {
               if (enquiry.classList.contains('success')) closeEnquiry();
          });

          /* ============================================================
             GET PRODUCT INFORMATION
          ============================================================ */

          function getProduct() {
               const names = [
                    document.querySelector('.cta-wrap.two .name')?.textContent,
                    document.querySelector('.cta-wrap.yes-hmobile .name')?.textContent,
                    document.querySelector('main.prod h1')?.textContent
               ];

               const invalid = new Set([
                    '',
                    'equipment',
                    'loading equipment...',
                    'unable to load equipment',
                    'no product selected'
               ]);

               const name = names
                    .map(value => String(value || '').trim())
                    .find(value => !invalid.has(value.toLowerCase()));

               if (!name) return null;

               const params = new URLSearchParams(location.search);

               let slug = params.get('slug') || params.get('product');

               if (!slug) {
                    const parts = location.pathname.split('/').filter(Boolean);
                    const index = parts.lastIndexOf('equipment');

                    slug = index >= 0 ? parts[index + 1] || '' : '';
               }

               return {
                    name,
                    slug
               };
          }

          function getAttachments() {
               if (typeof window.ETRSelectedAttachments !== 'function') {
                    return [];
               }

               try {
                    const items = window.ETRSelectedAttachments();

                    if (!Array.isArray(items)) return [];

                    return items.map(item => ({
                         key: String(item.key || ''),
                         name: String(item.name || item.key || 'Attachment')
                    }));
               } catch (error) {
                    console.error('ETR Enquiry: Cannot read attachments.', error);
                    return [];
               }
          }

          /* ============================================================
             SELECTED ITEM BUTTONS
          ============================================================ */

          function createRemoveButton(name, callback) {
               const button = document.createElement('button');

               button.type = 'button';
               button.className = 'select fr jsb';
               button.setAttribute('aria-label', `Remove ${name}`);

               const text = document.createElement('span');
               text.textContent = name;

               const svg = document.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'svg'
               );

               svg.setAttribute('viewBox', '0 0 8 8');
               svg.setAttribute('fill', 'currentColor');

               const use = document.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'use'
               );

               use.setAttribute('href', '#plus');

               svg.appendChild(use);
               button.append(text, svg);

               button.addEventListener('click', callback);

               return button;
          }

          /* ============================================================
             RENDER EQUIPMENT
          ============================================================ */

          function renderEquipment() {
               equipmentList.replaceChildren();

               equipmentSection.hidden = !product;

               if (!product) return;

               equipmentList.appendChild(
                    createRemoveButton(product.name, () => {
                         product = null;
                         renderEquipment();

                         // A product enquiry cannot continue
                         // without the selected equipment.
                         closeEnquiry();
                    })
               );
          }

          /* ============================================================
             RENDER ATTACHMENTS
          ============================================================ */

          function renderAttachments() {
               attachmentsList.replaceChildren();

               attachmentsSection.hidden = attachments.length === 0;

               attachments.forEach(item => {
                    attachmentsList.appendChild(
                         createRemoveButton(item.name, () => {
                              removeAttachment(item.key);
                         })
                    );
               });
          }

          function removeAttachment(key) {
               attachments = attachments.filter(item => item.key !== key);

               /*
                  Update the original attachment selection
                  in product-page-cms.js through its existing
                  Include button handler.
               */

               const card = [
                    ...document.querySelectorAll('#attachments [data-addon]')
               ].find(item => item.dataset.addon === key);

               const toggle = card?.querySelector('button.include');

               if (toggle?.classList.contains('active')) {
                    toggle.click();
               }

               renderAttachments();

               if (!product) {
                    closeEnquiry();
               }
          }

          /* ============================================================
             SCROLL LOCK
          ============================================================ */

          function lockScroll() {
               if (previousStyles) return;

               scrollPosition = window.scrollY;

               previousStyles = {
                    position: document.body.style.position,
                    top: document.body.style.top,
                    left: document.body.style.left,
                    right: document.body.style.right,
                    width: document.body.style.width,
                    overflow: document.body.style.overflow
               };

               document.body.style.position = 'fixed';
               document.body.style.top = `-${scrollPosition}px`;
               document.body.style.left = '0';
               document.body.style.right = '0';
               document.body.style.width = '100%';
               document.body.style.overflow = 'hidden';

               document.body.classList.add('enquiry-scroll-locked');
          }

          function unlockScroll() {
               if (!previousStyles) return;

               Object.entries(previousStyles).forEach(([key, value]) => {
                    document.body.style[key] = value;
               });

               previousStyles = null;

               document.body.classList.remove('enquiry-scroll-locked');

               window.scrollTo({
                    top: scrollPosition,
                    behavior: 'instant'
               });
          }

          /* ============================================================
             OPEN ENQUIRY
          ============================================================ */

          function openEnquiry() {
               if (active) return;

               const selectedProduct = getProduct();

               if (!selectedProduct) {
                    console.warn(
                         'ETR Enquiry: Product not loaded yet. Cannot open enquiry.'
                    );

                    return;
               }

               product = selectedProduct;
               attachments = getAttachments();

               renderEquipment();
               renderAttachments();

               previousFocus = document.activeElement;

               active = true;

               enquiry.inert = false;
               enquiry.setAttribute('aria-hidden', 'false');

               // The blur is shared with the navigation.
               // This class puts it underneath the enquiry.
               blur.classList.add('active', 'top-zindex');

               lockScroll();

               // Allow the browser to register the initial
               // opacity before triggering the transition.
               void enquiry.offsetWidth;

               enquiry.classList.add('active');

               requestAnimationFrame(() => {
                    closeButton.focus({ preventScroll: true });
               });
          }

          /* ============================================================
             CLOSE ENQUIRY
          ============================================================ */

          function closeEnquiry() {
               if (!active) return;

               active = false;

               enquiry.classList.remove('active');
               enquiry.setAttribute('aria-hidden', 'true');
               enquiry.inert = true;

               blur.classList.remove('active', 'top-zindex');

               unlockScroll();

               form.reset();
               clearRadios();
               resetSuccess();

               if (previousFocus?.isConnected) {
                    previousFocus.focus({ preventScroll: true });
               }
          }

          /* ============================================================
             OPEN BUTTON TARGETING
          ============================================================ */

          /*
             Event delegation means buttons can exist anywhere
             on the page or be inserted dynamically.

             Only [data-open-enquiry] triggers this form.
          */

          document.addEventListener('click', event => {
               const button = event.target.closest('[data-open-enquiry]');

               if (!button) return;

               event.preventDefault();
               event.stopPropagation();

               openEnquiry();
          }, true);

          /* ============================================================
             CLOSE EVENTS
          ============================================================ */

          closeButton.addEventListener('click', event => {
               event.preventDefault();
               closeEnquiry();
          });

          blur.addEventListener('click', event => {
               if (!active) return;

               event.preventDefault();
               event.stopImmediatePropagation();

               closeEnquiry();
          }, true);

          document.addEventListener('keydown', event => {
               if (!active) return;

               if (event.key === 'Escape') {
                    event.preventDefault();
                    closeEnquiry();
                    return;
               }

               if (event.key !== 'Tab') return;

               const focusable = [
                    ...enquiry.querySelectorAll(
                         'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]'
                    )
               ].filter(element => {
                    if (element.closest('[hidden]')) return false;

                    return element.getClientRects().length > 0;
               });

               if (!focusable.length) {
                    event.preventDefault();
                    return;
               }

               const first = focusable[0];
               const last = focusable[focusable.length - 1];

               if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
               } else if (
                    !event.shiftKey &&
                    document.activeElement === last
               ) {
                    event.preventDefault();
                    first.focus();
               }
          });

          /* ============================================================
             FORM SUBMISSION
          ============================================================ */

          form.addEventListener('submit', async event => {
               event.preventDefault();

               if (!product) {
                    closeEnquiry();
                    return;
               }

               if (!form.reportValidity()) return;

               const purchasingFor = enquiry.querySelector('[data-radio-name="purchasingFor"].active');
               const payment = enquiry.querySelector('[data-radio-name="payment"].active');

               const data = new FormData(form);

               const payload = {
                    product: { ...product },
                    attachments: [...attachments],

                    customer: {
                         firstName: String(data.get('firstName') || '').trim(),
                         lastName: String(data.get('lastName') || '').trim(),
                         email: String(data.get('email') || '').trim(),
                         phone: String(data.get('phone') || '').trim(),
                         purchasingFor: purchasingFor?.dataset.radioValue || '',
                         payment: payment?.dataset.radioValue || '',
                         message: String(data.get('message') || '').trim()
                    },

                    pageURL: location.href
               };

               submitButton.disabled = true;
               submitButton.textContent = document.documentElement.lang === 'et' ? 'Saadan…' : 'Sending…';
               formStatus.hidden = true;

               try {
                    await window.ETRSupabase.insert('equipment_enquiries', {
                         product_name: payload.product.name,
                         product_slug: payload.product.slug || null,
                         attachments: payload.attachments,
                         first_name: payload.customer.firstName,
                         last_name: payload.customer.lastName,
                         email: payload.customer.email,
                         phone: payload.customer.phone,
                         purchasing_for: payload.customer.purchasingFor || null,
                         payment_method: payload.customer.payment || null,
                         message: payload.customer.message || null,
                         page_url: payload.pageURL
                    });

                    document.dispatchEvent(new CustomEvent('etrEnquirySubmit', { detail: payload }));
                    showSuccess();
               } catch (error) {
                    console.error('ETR enquiry submission failed:', error);
                    formStatus.textContent = document.documentElement.lang === 'et'
                         ? 'Päringu saatmine ebaõnnestus. Palun proovi uuesti.'
                         : 'Unable to send your enquiry. Please try again.';
                    formStatus.hidden = false;
                    submitButton.disabled = false;
                    submitButton.textContent = document.documentElement.lang === 'et' ? 'Saada sõnum' : 'Send Message';
               }
          });

          /* ============================================================
             INITIAL STATE
          ============================================================ */

          enquiry.classList.remove('active');
          enquiry.setAttribute('aria-hidden', 'true');
          enquiry.inert = true;

          window.ETREnquiry = {
               open: openEnquiry,
               close: closeEnquiry,
               isOpen: () => active,
               getSelection: () => ({
                    product,
                    attachments: [...attachments]
               })
          };

          if (new URLSearchParams(location.search).get('enquire') === '1') {
               const openWhenReady = () => {
                    if (getProduct()) openEnquiry();
               };

               document.addEventListener('etr:productloaded', openWhenReady, { once: true });
               openWhenReady();
          }

          console.log('ETR enquiry initialized');
     }

     /* ============================================================
        INITIALISATION
     ============================================================ */

     if (document.readyState === 'loading') {
          document.addEventListener(
               'DOMContentLoaded',
               initialiseEnquiry,
               { once: true }
          );
     } else {
          initialiseEnquiry();
     }
})();
