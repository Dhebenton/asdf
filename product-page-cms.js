
(() => {
     'use strict';

     /* ============================================================
        CONFIGURATION
     ============================================================ */

     const PROJECT_ID = 'jqlee81t';
     const DATASET = 'production';
     const API_VERSION = '2026-10-21';
     const currentLanguage = () => document.documentElement.lang === 'en' ? 'en' : 'et';

     const MAX_SPECS = 11;
     const INITIAL_ATTACHMENTS = 4;
     const ATTACHMENTS_PER_PAGE = 2;

     const CATEGORY_FILTERS = Object.freeze({
          'cat-atv': 'atvs',
          'cat-ekskavaatorid': 'excavators',
          'cat-generaatorid': 'generators',
          'cat-kompressorid': 'compressors',
          'cat-laadurid': 'loaders',
          'cat-murukarjed': 'ground-reinforcement',
          'cat-pealesoiduteed': 'access-ramps',
          'cat-pinnasekaitsematid': 'protection-mats',
          'cat-puidutoo': 'woodworking',
          'cat-utv': 'utvs'
     });

     const API = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`;

     const $ = (selector, parent = document) => parent.querySelector(selector);
     const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

     /* ============================================================
        SANITY QUERIES
     ============================================================ */

     const productQuery = `*[
          _type == "product" &&
          !(_id in path("drafts.**")) &&
          slug.current == $slug
     ][0]{
          _id,
          name,
          price,
          salePrice,
          isOnSale,
          "slug": slug.current,
          shortDescription,
          longDescription,
          mainFeature,
          videos,
          addOns,
          "brandId": brand._ref,
          "brand": brand->{
               name,
               "slug": slug.current
          },
          "category": category->{
               _id,
               name,
               title,
               "slug": slug.current
          },
          "images": images[]{
               alt,
               "url": asset->url
          },
          "brochure": brochure.asset->{
               url,
               originalFilename,
               size
          },
          "technicalInfo": technicalInfo[]{
               "tables": table[]{
                    language,
                    "rows": value.rows[]{
                         cells
                    }
               }
          }
     }`;

     const addonsQuery = `*[
          _type == "addOnSet" &&
          !(_id in path("drafts.**")) &&
          brand._ref == $brandId
     ]{
          "items": items[]{
               _key,
               name,
               image{
                    "url": asset->url,
                    "ref": asset._ref
               }
          }
     }`;

     /* ============================================================
        HELPERS
     ============================================================ */

     function escapeHTML(value) {
          return String(value ?? '').replace(/[&<>"']/g, character => ({
               '&': '&amp;',
               '<': '&lt;',
               '>': '&gt;',
               '"': '&quot;',
               "'": '&#39;'
          })[character]);
     }

     function localized(value) {
          if (typeof value === 'string') return value;

          if (Array.isArray(value)) {
               const language = currentLanguage();

               return (
                    value.find(item => item.language === language && item.value)?.value ||
                    value.find(item => item.language === 'et' && item.value)?.value ||
                    value.find(item => item.language === 'en' && item.value)?.value ||
                    value.find(item => item.value)?.value ||
                    ''
               );
          }

          return '';
     }

     function productWords() {
          return currentLanguage() === 'et'
               ? {
                    equipment: 'Masinad',
                    home: 'Avaleht',
                    productDescriptionFallback: 'Tootekirjeldus lisatakse peagi.',
                    longDescriptionFallback: 'Täpsem tootekirjeldus lisatakse peagi.',
                    specification: 'Tehnilised andmed',
                    toBeConfirmed: 'Täpsustamisel',
                    priceOnRequest: 'Hind päringul',
                    vat: 'Hind sisaldab käibemaksu 24%',
                    viewSpecificationSheet: 'Vaata tehnilist lehte',
                    features: 'Omadused',
                    specifications: 'Tehnilised andmed',
                    media: 'Meedia',
                    attachments: 'Lisavarustus',
                    playVideo: 'Esita video',
                    equipmentSpecifications: 'Toote tehnilised andmed',
                    specificationSheet: 'Tehniline leht',
                    productSpecifications: 'Toote spetsifikatsioonid',
                    previousSlide: 'Eelmine slaid',
                    nextSlide: 'Järgmine slaid',
                    getInTouch: 'Võta ühendust',
                    sendEnquiry: 'Saada päring',
                    closeEnquiry: 'Sulge päring',
                    selectedEquipment: 'Valitud masin',
                    selectedAttachments: 'Valitud lisavarustus',
                    yourDetails: 'Teie andmed',
                    firstName: 'Eesnimi',
                    lastName: 'Perekonnanimi',
                    emailRequired: 'E-post (kohustuslik)',
                    phoneRequired: 'Telefoninumber (kohustuslik)',
                    purchasingFor: 'Ostja',
                    business: 'Ettevõte',
                    personal: 'Eraisik',
                    intendedPayment: 'Soovitud makseviis',
                    fullPayment: 'Täismakse',
                    finance: 'Finantseerimine',
                    message: 'Sõnum',
                    typeMessage: 'Kirjutage oma sõnum siia',
                    enquirySent: 'Päring saadetud',
                    enquiryThanks: 'Täname. Meie meeskonna liige võtab teiega peagi ühendust.',
                    sendMessage: 'Saada sõnum'
               }
               : {
                    equipment: 'Equipment',
                    home: 'Home',
                    productDescriptionFallback: 'Product description to be added.',
                    longDescriptionFallback: 'Detailed product description to be added.',
                    specification: 'Specification',
                    toBeConfirmed: 'To be confirmed',
                    priceOnRequest: 'Price on request',
                    vat: 'VAT Included',
                    viewSpecificationSheet: 'View Specification Sheet',
                    features: 'Features',
                    specifications: 'Specifications',
                    media: 'Media',
                    attachments: 'Attachments',
                    playVideo: 'Play video',
                    equipmentSpecifications: 'Equipment specifications',
                    specificationSheet: 'Specification Sheet',
                    productSpecifications: 'Product Specifications',
                    previousSlide: 'Previous slide',
                    nextSlide: 'Next slide',
                    getInTouch: 'Get In Touch',
                    sendEnquiry: 'Send An Enquiry',
                    closeEnquiry: 'Close enquiry',
                    selectedEquipment: 'Selected Equipment',
                    selectedAttachments: 'Selected Attachments',
                    yourDetails: 'Your Details',
                    firstName: 'First Name',
                    lastName: 'Last Name',
                    emailRequired: 'Email (Required)',
                    phoneRequired: 'Phone Number (Required)',
                    purchasingFor: 'Purchasing For',
                    business: 'Business',
                    personal: 'Personal',
                    intendedPayment: 'Intended Payment',
                    fullPayment: 'Full Payment',
                    finance: 'Finance',
                    message: 'Message',
                    typeMessage: 'Type your message here',
                    enquirySent: 'Enquiry Sent',
                    enquiryThanks: 'Thank you. A member of our team will be in touch shortly.',
                    sendMessage: 'Send Message'
               };
     }

     function sanityImageURL(image) {
          const url = typeof image === 'string' ? image : image?.url;

          if (/^https:\/\//i.test(url || '')) return url;

          const reference = typeof image === 'string'
               ? image
               : image?.ref || image?.asset?._ref || image?._ref;
          const match = String(reference || '').match(
               /^image-([a-f\d]+)-(\d+x\d+)-([a-z\d]+)$/i
          );

          if (!match) return '';

          const [, id, dimensions, format] = match;

          return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dimensions}.${format}`;
     }

     function normalize(value) {
          return String(value ?? '')
               .toLowerCase()
               .normalize('NFD')
               .replace(/[\u0300-\u036f]/g, '')
               .replace(/[^\p{L}\p{N}]+/gu, ' ')
               .trim();
     }

     async function fetchSanity(query, variables = {}) {
          const params = new URLSearchParams({ query });

          Object.entries(variables).forEach(([name, value]) => {
               params.set(`$${name}`, JSON.stringify(value));
          });

          const response = await fetch(`${API}?${params}`);

          if (!response.ok) {
               throw new Error(`Sanity HTTP ${response.status}`);
          }

          const data = await response.json();

          if (data.error) {
               throw new Error(data.error.description || 'Sanity request failed');
          }

          return data.result;
     }

     function getSlug() {
          const parameters = new URLSearchParams(location.search);
          const selected = parameters.get('slug') || parameters.get('product');

          if (selected) return selected.trim();

          const path = location.pathname.split('/').filter(Boolean);
          const index = path.lastIndexOf('equipment');

          return index >= 0 && path[index + 1]
               ? decodeURIComponent(path[index + 1])
               : '';
     }

     function formatPrice(amount) {
          return typeof amount === 'number' && Number.isFinite(amount)
               ? `€${new Intl.NumberFormat(currentLanguage() === 'et' ? 'et-EE' : 'en-IE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
               }).formatToParts(amount).map(part => part.type === 'decimal' ? '.' : part.value).join('')}`
               : productWords().priceOnRequest;
     }

     /* ============================================================
        LOADING STYLES
     ============================================================ */

     function injectStyles() {
          if ($('#etr-product-loading-styles')) return;

          const style = document.createElement('style');

          style.id = 'etr-product-loading-styles';

          style.textContent = `
               @keyframes etrSkeleton {
                    0% {
                         background-position: 130% 0;
                    }

                    100% {
                         background-position: -130% 0;
                    }
               }

               .etr-skeleton {
                    background: linear-gradient(
                         100deg,
                         #ededed 20%,
                         #f8f8f8 40%,
                         #ededed 60%
                    );
                    background-size: 220% 100%;
                    animation: etrSkeleton 1.7s ease-in-out infinite;
                    border-radius: 2px;
               }

               main.prod.etr-loading .content-wrap {
                    position: relative;
               }

               main.prod.etr-loading .content-wrap > :not(.etr-skeleton-lines) {
                    visibility: hidden;
               }

               .etr-skeleton-lines {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    pointer-events: none;
               }

               .etr-skeleton-lines .etr-skeleton:nth-child(1) {
                    width: 36%;
                    height: 14px;
               }

               .etr-skeleton-lines .etr-skeleton:nth-child(2) {
                    width: 78%;
                    height: 28px;
               }

               .etr-skeleton-lines .etr-skeleton:nth-child(3) {
                    width: 94%;
                    height: 12px;
                    margin-top: 10px;
               }

               .etr-skeleton-lines .etr-skeleton:nth-child(4) {
                    width: 65%;
                    height: 12px;
               }

               .etr-skeleton-lines .etr-skeleton:nth-child(5) {
                    width: 40%;
                    height: 28px;
                    margin-top: 18px;
               }

               .etr-skeleton-lines .etr-skeleton:nth-child(n+6) {
                    width: 85%;
                    height: 26px;
                    margin-top: 8px;
               }

               main.prod .image-wrap {
                    position: relative;
                    isolation: isolate;
                    min-height: 260px;
               }

               main.prod .image-wrap.etr-image-loading::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    z-index: 2;
                    pointer-events: none;
                    background: linear-gradient(
                         100deg,
                         #eaeaea 20%,
                         #f7f7f7 40%,
                         #eaeaea 60%
                    );
                    background-size: 220% 100%;
                    animation: etrSkeleton 1.7s ease-in-out infinite;
                    opacity: 1;
                    transition: opacity 550ms ease-in-out;
               }

               main.prod .image-wrap.etr-image-loaded::after {
                    opacity: 0;
               }

               main.prod .image-wrap picture {
                    display: flex;
                    width: 100%;
                    height: 100%;
               }

               main.prod .image-wrap .etr-product-image {
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    opacity: 0;
                    transition: opacity 550ms ease-in-out;
               }

               main.prod .image-wrap .etr-product-image.etr-image-ready {
                    opacity: 1;
               }

               @media (prefers-reduced-motion: reduce) {
                    .etr-skeleton,
                    main.prod .image-wrap.etr-image-loading::after {
                         animation: none;
                    }

                    main.prod .image-wrap .etr-product-image,
                    main.prod .image-wrap.etr-image-loading::after {
                         transition-duration: 0ms;
                    }
               }
          `;

          document.head.appendChild(style);
     }

     /* ============================================================
        INITIAL SKELETON
     ============================================================ */

     function startSkeleton() {
          injectStyles();

          const main = $('main.prod');
          const content = $('main.prod .content-wrap');
          const imageWrap = $('main.prod .image-wrap');

          if (!main || !content) return;

          main.classList.add('etr-loading');
          main.setAttribute('aria-busy', 'true');

          if (imageWrap) {
               imageWrap.replaceChildren();
               imageWrap.classList.add('etr-image-loading');
               imageWrap.classList.remove('etr-image-loaded');
          }

          const lines = document.createElement('div');

          lines.className = 'etr-skeleton-lines';
          lines.setAttribute('aria-hidden', 'true');

          for (let i = 0; i < 8; i++) {
               const line = document.createElement('div');

               line.className = 'etr-skeleton';
               lines.appendChild(line);
          }

          content.appendChild(lines);
     }

     function finishSkeleton() {
          const main = $('main.prod');

          main?.classList.remove('etr-loading');
          main?.removeAttribute('aria-busy');

          $$('.etr-skeleton-lines').forEach(element => element.remove());
     }

     /* ============================================================
        PRODUCT IMAGE
     ============================================================ */

     async function loadProductImage(product) {
          const words = productWords();
          const imageWrap = $('main.prod .image-wrap');

          if (!imageWrap) return;

          const url = product.images?.find(item => item.url)?.url;

          if (!url) {
               imageWrap.classList.add('etr-image-loaded');
               imageWrap.classList.remove('etr-image-loading');
               return;
          }

          const preload = new Image();

          preload.decoding = 'async';
          preload.src = url;

          try {
               await preload.decode();
          } catch (error) {
               console.error('Unable to load product image:', error);

               imageWrap.classList.remove('etr-image-loading');
               return;
          }

          const picture = document.createElement('picture');

          picture.className = 'fr';

          const image = document.createElement('img');

          image.src = url;
          image.alt = localized(product.name) || product.name || words.equipment;
          image.loading = 'eager';
          image.decoding = 'async';
          image.className = 'etr-product-image';

          picture.appendChild(image);
          imageWrap.replaceChildren(picture);

          requestAnimationFrame(() => {
               requestAnimationFrame(() => {
                    image.classList.add('etr-image-ready');
                    imageWrap.classList.add('etr-image-loaded');
               });
          });
     }

     /* ============================================================
        SPECIFICATIONS
     ============================================================ */

     function getSpecs(product) {
          const specs = [];

          for (const group of product.technicalInfo || []) {
               const tables = group.tables || [];

               const table =
                    tables.find(item => item.language === currentLanguage() && item.rows?.length) ||
                    tables.find(item => item.language === 'et' && item.rows?.length) ||
                    tables.find(item => item.language === 'en' && item.rows?.length) ||
                    tables.find(item => item.rows?.length);

               if (!table) continue;

               for (const row of table.rows || []) {
                    const [label, value] = row.cells || [];

                    if (!String(label ?? '').trim() || !String(value ?? '').trim()) {
                         continue;
                    }

                    if (
                         ['n a', 'none', 'null'].includes(normalize(value)) ||
                         String(value).trim() === '-'
                    ) {
                         continue;
                    }

                    specs.push({
                         label: String(label).trim(),
                         value: String(value).trim()
                    });
               }
          }

          return specs;
     }

     function getHeroStats(product, specs) {
          const words = productWords();
          const selected = [];
          const used = new Set();

          const feature = product.mainFeature;

          if (feature?.value && localized(feature.label)) {
               selected.push({
                    label: localized(feature.label),
                    value: String(feature.value)
               });

               used.add(normalize(localized(feature.label)));
          }

          const preferred = [
               'operating weight',
               'operating mass',
               'engine power',
               'rated power',
               'max digging depth',
               'maximum digging depth',
               'digging depth',
               'rated load',
               'lifting capacity',
               'bucket capacity',
               'working pressure',
               'motor power',
               'power',
               'capacity',
               'travel speed'
          ];

          for (const name of preferred) {
               if (selected.length >= 3) break;

               const candidate = specs.find(spec => {
                    return normalize(spec.label) === name &&
                         !used.has(normalize(spec.label));
               });

               if (!candidate) continue;

               selected.push(candidate);
               used.add(normalize(candidate.label));
          }

          for (const spec of specs) {
               if (selected.length >= 3) break;

               if (used.has(normalize(spec.label))) continue;
               if (spec.value.length > 50) continue;

               selected.push(spec);
               used.add(normalize(spec.label));
          }

          while (selected.length < 3) {
               selected.push({
                    label: words.specification,
                    value: words.toBeConfirmed
               });
          }

          return selected.slice(0, 3);
     }

     /* ============================================================
        MAIN PRODUCT CONTENT
     ============================================================ */

     function renderHero(product, specs) {
          const words = productWords();
          const content = $('main.prod .content-wrap');

          const brand =
               localized(product.brand?.name) ||
               words.equipment;

          const category =
               localized(product.category?.name) ||
               localized(product.category?.title) ||
               words.equipment;

          const categoryFilter =
               CATEGORY_FILTERS[product.category?._id] ||
               String(product.category?.slug || '').trim();

          const categoryURL = categoryFilter
               ? `/pages/all-products.html?category=${encodeURIComponent(categoryFilter)}`
               : '/pages/all-products.html';

          const name = String(localized(product.name) || product.name || words.equipment).trim();

          const title = normalize(name).includes(normalize(category))
               ? name
               : `${name} ${category}`;

          const description =
               localized(product.shortDescription) ||
               words.productDescriptionFallback;

          const onSale =
               product.isOnSale === true &&
               typeof product.salePrice === 'number' &&
               typeof product.price === 'number' &&
               product.salePrice < product.price;

          const price = onSale ? product.salePrice : product.price;

          if (content) {
               content.innerHTML = `
                    <span class="title">
                         ${escapeHTML(brand)} ${escapeHTML(category)}
                    </span>

                    <h1>${escapeHTML(title)}</h1>

                    <p class="sub">${escapeHTML(description)}</p>

                    <div class="fr price-wrap${onSale ? ' promotion' : ''}">
                         <p>
                              ${escapeHTML(formatPrice(price))}
                              ${onSale ? `
                                   <s class="old-price">
                                        ${escapeHTML(formatPrice(product.price))}
                                   </s>
                              ` : ''}
                         </p>
                         <span>${words.vat}</span>
                    </div>

                    ${getHeroStats(product, specs).map(spec => `
                         <div class="spec fc g14">
                              <p class="an">${escapeHTML(spec.label)}:</p>
                              <p class="sp">${escapeHTML(spec.value)}</p>
                         </div>
                    `).join('')}
               `;
          }

          const breadcrumbs = $('.breadcrumbs .content');

          if (breadcrumbs) {
               const separator = `
                    <svg viewBox="0 0 5 8" fill="currentColor">
                         <use href="#chevron-right"></use>
                    </svg>
               `;

               breadcrumbs.innerHTML = `
                    <a href="/">${words.home}</a>
                    ${separator}
                    <a href="/pages/all-products.html">${words.equipment}</a>
                    ${separator}
                    <a href="${escapeHTML(categoryURL)}">${escapeHTML(category)}</a>
                    ${separator}
                    <span class="active">${escapeHTML(name)}</span>
               `;
          }

          document.title = `${name} | ETR Tehnika`;

          const meta = $('meta[name="description"]');

          if (meta) meta.content = description.slice(0, 160);
     }

     /* ============================================================
        LONG DESCRIPTION
     ============================================================ */

     function renderLongDescription(product) {
          const words = productWords();
          const target = $('#description-black .column');

          if (!target) return;

          const content = localized(product.longDescription);

          const paragraphs = content
               ? content.split(/\n\s*\n|\n/).filter(Boolean)
               : [words.longDescriptionFallback];

          target.innerHTML = paragraphs.map(paragraph => `
               <p class="heading">${escapeHTML(paragraph.trim())}</p>
          `).join('');
     }

     /* ============================================================
        SPECIFICATION TABLE
     ============================================================ */

     function renderSpecs(product, allSpecs) {
          const words = productWords();
          const section = $('#spec-table');

          if (!section) return false;

          const specs = allSpecs.slice(0, MAX_SPECS);

          section.hidden = specs.length === 0;

          if (!specs.length) return false;

          const table = $('.table', section);

          if (table) {
               table.innerHTML = specs.map((spec, index) => `
                    <div class="table-row${index % 2 === 0 ? ' bgr' : ''}">
                         <p class="spec">${escapeHTML(spec.label)}</p>
                         <p class="unit">${escapeHTML(spec.value)}</p>
                    </div>
               `).join('');
          }

          const heading = $('.wrapper > h2', section);
          const brochure = product.brochure;

          section.classList.toggle('ae', !brochure?.url);
          heading?.classList.toggle('column', !brochure?.url);

          if (heading?.nextElementSibling) {
               heading.nextElementSibling.classList.add('je');
          }

          const button = $('.spec-sheet', section);
          const downloadColumn = button?.parentElement;

          if (downloadColumn) {
               downloadColumn.hidden = !brochure?.url;
               downloadColumn.style.display = brochure?.url ? '' : 'none';
          }

          if (button && brochure?.url) {
               button.hidden = false;

               const existingLabel = $('.etr-brochure-label', button);

               if (existingLabel) existingLabel.remove();

               [...button.childNodes].forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                         node.remove();
                    }
               });

               const label = document.createElement('span');

               label.className = 'etr-brochure-label';

               label.textContent = words.viewSpecificationSheet;

               button.appendChild(label);

               button.onclick = () => {
                    window.open(
                         brochure.url,
                         '_blank',
                         'noopener,noreferrer'
                    );
               };
          }

          return true;
     }

     /* ============================================================
        MEDIA VIDEO HELPERS
     ============================================================ */

     
function youtubeID(url) {
     try {
          const parsed = new URL(url);
          const hostname = parsed.hostname.toLowerCase();

          if (
               hostname === 'youtu.be' ||
               hostname === 'www.youtu.be'
          ) {
               return parsed.pathname.split('/')[1] || null;
          }

          if ([
               'youtube.com',
               'www.youtube.com',
               'm.youtube.com',
               'youtube-nocookie.com',
               'www.youtube-nocookie.com'
          ].includes(hostname)) {
               if (
                    parsed.pathname.startsWith('/shorts/') ||
                    parsed.pathname.startsWith('/embed/') ||
                    parsed.pathname.startsWith('/live/')
               ) {
                    return parsed.pathname.split('/')[2] || null;
               }

               return parsed.searchParams.get('v');
          }
     } catch (error) {
          return null;
     }

     return null;
}

/* ============================================================
   MEDIA - YOUTUBE FIRST, IMAGES AFTER
============================================================ */

function renderMedia(product) {
     const section = document.querySelector('.media-slider');
     const slider = section?.querySelector('[data-slider]');
     const track = section?.querySelector('[data-slider-track]');

     if (!section || !slider || !track) return false;

     const images = (product.images || []).filter(item => item?.url);

     const videos = (
          Array.isArray(product.videos) ? product.videos : []
     ).filter(item => typeof item === 'string');

     const youtube = videos.find(url => youtubeID(url));

     const direct = videos.find(url => {
          return /\.(mp4|webm)(\?|$)/i.test(url);
     });

     const videoUrl = youtube || direct || '';
     const id = youtubeID(videoUrl);
     const hasVideo = !!videoUrl;

     section.hidden = !(hasVideo || images.length);

     if (section.hidden) return false;

     const fragment = document.createDocumentFragment();

     /* ============================================================
        FIRST SLIDE - VIDEO
     ============================================================ */

     if (hasVideo) {
          const card = document.createElement('div');

          card.className = 'video-player';
          card.dataset.mediaType = id ? 'youtube' : 'video';

          const poster = document.createElement('picture');
          poster.className = 'fr';

          const posterImg = document.createElement('img');

          posterImg.src = id
               ? `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`
               : images[0]?.url || '';

          posterImg.alt = `${product.name} video thumbnail`;
          posterImg.loading = 'eager';
          posterImg.decoding = 'async';

          poster.appendChild(posterImg);
          card.appendChild(poster);

          const play = document.createElement('button');

          play.type = 'button';
          play.className = 'play-button fr jc';
          play.setAttribute(
               'aria-label',
               `Play ${product.name} video`
          );

          play.innerHTML = `
               <svg viewBox="0 0 15 20" fill="none">
                    <path
                         d="M0 19.0667V0L14.7333 9.53333L0 19.0667Z"
                         fill="white"
                    />
               </svg>
          `;

          play.addEventListener('click', () => {
               if (id) {
                    const frame = document.createElement('iframe');

                    frame.className = 'etr-video-frame';

                    frame.src =
                         `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;

                    frame.title = `${product.name} video`;

                    frame.allow =
                         'autoplay; encrypted-media; picture-in-picture; fullscreen';

                    frame.allowFullscreen = true;

                    card.replaceChildren(frame);
               } else {
                    const player = document.createElement('video');

                    player.className = 'etr-video-frame';
                    player.src = videoUrl;
                    player.controls = true;
                    player.autoplay = true;
                    player.playsInline = true;

                    card.replaceChildren(player);
                    player.play().catch(() => {});
               }
          });

          card.appendChild(play);
          fragment.appendChild(card);
     }

     /* ============================================================
        REMAINING SLIDES - PRODUCT IMAGES
     ============================================================ */

     for (const item of images) {
          const picture = document.createElement('picture');

          picture.className = 'fr';

          const image = document.createElement('img');

          image.src = item.url;
          image.alt = localized(item.alt) || product.name;
          image.loading = 'lazy';
          image.decoding = 'async';

          picture.appendChild(image);
          fragment.appendChild(picture);
     }

     track.replaceChildren(fragment);

     const heading = section.querySelector('h2');

     if (heading) {
          heading.textContent = `${product.name} Media`;
     }

     document.dispatchEvent(
          new CustomEvent('sliderReset', {
               detail: { container: slider }
          })
     );

     document.dispatchEvent(
          new CustomEvent('productsLoaded', {
               detail: { container: track }
          })
     );

     return true;
}


     /* ============================================================
        MEDIA
     ============================================================ */

     function renderMedia(product) {
          const words = productWords();
          const productName = localized(product.name) || product.name || words.equipment;
          const section = $('.media-slider');
          const track = section && $('[data-slider-track]', section);

          if (!track) return false;

          const images = (product.images || []).filter(item => item.url);

          const video = (product.videos || []).find(item => {
               return typeof item === 'string' && item.trim();
          });

          const videoID = video ? youtubeID(video) : null;

          const hasVideo = !!(
               video &&
               (
                    videoID ||
                    /\.(mp4|webm)(\?|$)/i.test(video)
               )
          );

          section.hidden = !images.length && !hasVideo;

          if (section.hidden) return false;

          track.replaceChildren();

          if (hasVideo) {
               const frame = document.createElement('div');

               frame.className = 'video-player';

               const poster = images[0]?.url || '';

               frame.innerHTML = `
                    ${poster ? `
                         <picture class="fr">
                              <img
                                   src="${escapeHTML(poster)}"
                                   alt="${escapeHTML(productName)} video"
                                   loading="lazy"
                                   decoding="async"
                              >
                         </picture>
                    ` : ''}

                    <button
                         type="button"
                         class="play-button fr jc"
                         aria-label="${words.playVideo}"
                    >
                         <svg viewBox="0 0 15 20" fill="none">
                              <path
                                   d="M0 19.0667V0L14.7333 9.53333L0 19.0667Z"
                                   fill="white"
                              />
                         </svg>
                    </button>
               `;

               $('.play-button', frame).addEventListener('click', () => {
                    if (videoID) {
                         const iframe = document.createElement('iframe');

                         iframe.src =
                              `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoID)}?autoplay=1&rel=0`;

                         iframe.title = `${productName} video`;
                         iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
                         iframe.allowFullscreen = true;

                         iframe.style.cssText =
                              'width:100%;height:100%;aspect-ratio:16/9;border:0';

                         frame.replaceChildren(iframe);
                    } else {
                         const player = document.createElement('video');

                         player.src = video;
                         player.controls = true;
                         player.autoplay = true;
                         player.playsInline = true;
                         player.style.height = '100%';

                         frame.replaceChildren(player);

                         player.play().catch(() => {});
                    }
               });

               track.appendChild(frame);
          }

          images.forEach(item => {
               const picture = document.createElement('picture');

               picture.className = 'fr';

               const image = document.createElement('img');

               image.src = item.url;
               image.alt = localized(item.alt) || productName;
               image.loading = 'lazy';
               image.decoding = 'async';

               picture.appendChild(image);
               track.appendChild(picture);
          });

          const heading = $('h2', section);

          if (heading) {
               heading.textContent = `${productName} ${words.media}`;
          }

          document.dispatchEvent(new CustomEvent('sliderReset', {
               detail: {
                    container: $('[data-slider]', section)
               }
          }));

          document.dispatchEvent(new CustomEvent('productsLoaded', {
               detail: {
                    container: track
               }
          }));

          return true;
     }

     /* ============================================================
        FETCH ATTACHMENTS
     ============================================================ */

     async function getAttachments(product) {
          const keys = (product.addOns || []).filter(Boolean);

          if (!keys.length) return [];

          let items = [];

          if (product.brandId) {
               const sets = await fetchSanity(addonsQuery, {
                    brandId: product.brandId
               });

               items = (sets || []).flatMap(set => set.items || []);
          }

          const map = new Map(
               items.map(item => [item._key, item])
          );

          return keys
               .map(key => map.get(key))
               .filter(Boolean)
               .map(item => ({
                    key: item._key,
                    name: localized(item.name) || item._key.replace(/-/g, ' '),
                    translations: item.name,
                    image: sanityImageURL(item.image)
               }));
     }

     /* ============================================================
        RENDER ATTACHMENTS
     ============================================================ */

     function renderAttachments(attachments) {
          const section = $('#attachments');

          if (!section) return false;

          const grid = $('.attachment-grid', section);

          section.hidden = !attachments.length || !grid;
          section.style.display = section.hidden ? 'none' : '';

          if (section.hidden) return false;

          const button = $('.load-more, .button.small.grey', section);
          const counter = $('.load-ammount', section);

          const selected = new Set();

          let visible = Math.min(
               INITIAL_ATTACHMENTS,
               attachments.length
          );

          function draw() {
               const words = currentLanguage() === 'et'
                    ? {
                         heading: 'Lisavarustus',
                         include: 'Lisa',
                         loadMore: 'Laadi juurde',
                         showing: (shown, total) => `Kuvatud ${shown}/${total} lisavarustust`
                    }
                    : {
                         heading: 'Attachments',
                         include: 'Include',
                         loadMore: 'Load More',
                         showing: (shown, total) => `Showing ${shown} of ${total} attachments`
                    };

               const heading = $('h2', section);

               if (heading) heading.textContent = words.heading;

               grid.innerHTML = attachments.slice(0, visible).map(item => `
                    <div class="attachment card" data-addon="${escapeHTML(item.key)}">
                         <img
                              src="${escapeHTML(item.image || '/assets/avatar.png')}"
                              alt="${escapeHTML(item.name)}"
                              loading="lazy"
                              decoding="async"
                         >

                         <div class="content fr jsb">
                              <h3>${escapeHTML(item.name)}</h3>

                              <button
                                   type="button"
                                   class="include fr g10${selected.has(item.key) ? ' active' : ''}"
                                   aria-pressed="${selected.has(item.key)}"
                              >
                                   <div class="checkbox fr jc">
                                        <svg viewBox="0 0 8 7" fill="currentColor">
                                             <use href="#check"></use>
                                        </svg>
                                   </div>
                                   ${words.include}
                              </button>
                         </div>
                    </div>
               `).join('');

               if (counter) {
                    counter.textContent = words.showing(visible, attachments.length);
               }

               if (button) {
                    button.textContent = words.loadMore;
                    button.hidden = visible >= attachments.length;
               }
          }

          grid.addEventListener('click', event => {
               const toggle = event.target.closest('button.include');
               const card = toggle?.closest('[data-addon]');

               if (!card) return;

               const key = card.dataset.addon;

               if (selected.has(key)) {
                    selected.delete(key);
               } else {
                    selected.add(key);
               }

               toggle.classList.toggle(
                    'active',
                    selected.has(key)
               );

               toggle.setAttribute(
                    'aria-pressed',
                    String(selected.has(key))
               );
          });

          button?.addEventListener('click', () => {
               visible = Math.min(
                    visible + ATTACHMENTS_PER_PAGE,
                    attachments.length
               );

               draw();
          });

          document.addEventListener('etr:languagechange', () => {
               attachments.forEach(item => {
                    item.name = localized(item.translations) || item.key.replace(/-/g, ' ');
               });
               draw();
          });

          window.ETRSelectedAttachments = () => {
               return attachments.filter(item => selected.has(item.key));
          };

          draw();

          return true;
     }

     /* ============================================================
        CTA NAVIGATION
     ============================================================ */

     function setupSectionNavigation(product, available) {
          const words = productWords();
          const productName = localized(product.name) || product.name || words.equipment;
          /*
             FIRST CTA (MOBILE)

             Product name and enquiry button only.
             No section navigation links.
          */

          const mobileCTA = $('.cta-wrap.yes-hmobile');

          if (mobileCTA) {
               const name = $('.name', mobileCTA);
               const links = $('.links', mobileCTA);

               if (name) {
                    name.textContent = productName;
               }

               if (links) {
                    links.replaceChildren();
               }
          }

          /*
             SECOND CTA

             Only this CTA gets section links.
          */

          const sectionCTA = $('.cta-wrap.two');

          if (!sectionCTA) {
               console.warn(
                    'Missing .cta-wrap.two. Add the class "two" to the second CTA.'
               );

               return;
          }

          const name = $('.name', sectionCTA);

          if (name) {
               name.textContent = productName;
          }

          const links = $('.links', sectionCTA);

          if (!links) return;

          /*
             Find the actual sections.
          */

          const features = $('#features') || $('.c.second.fc');
          const media = $('#product-media') || $('.media-slider');

          if (features) features.id = 'features';
          if (media) media.id = 'product-media';

          const sections = [
               {
                    label: words.features,
                    id: 'features',
                    available: !!features
               },
               {
                    label: words.specifications,
                    id: 'spec-table',
                    available: available.specs
               },
               {
                    label: words.media,
                    id: 'product-media',
                    available: available.media
               },
               {
                    label: words.attachments,
                    id: 'attachments',
                    available: available.attachments
               }
          ].filter(section => section.available);

          links.innerHTML = sections.map(section => `
               <a href="#${section.id}">
                    ${section.label}
               </a>
          `).join('');

          /*
             Smooth scrolling is only attached to
             the links in the second CTA.
          */

          links.addEventListener('click', event => {
               const link = event.target.closest('a[href^="#"]');

               if (!link) return;

               const selector = link.getAttribute('href');
               const target = document.querySelector(selector);

               if (!target) return;

               event.preventDefault();

               const stickyCTAs = $$('.cta-wrap').filter(element => {
                    const style = getComputedStyle(element);
                    const rectangle = element.getBoundingClientRect();

                    return (
                         style.position === 'sticky' &&
                         style.display !== 'none' &&
                         rectangle.height > 0
                    );
               });

               const offset = stickyCTAs.reduce((total, element) => {
                    return total + element.getBoundingClientRect().height;
               }, 0) + 16;

               const top =
                    window.scrollY +
                    target.getBoundingClientRect().top -
                    offset;

               window.scrollTo({
                    top: Math.max(0, top),
                    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
                         ? 'instant'
                         : 'smooth'
               });

               history.replaceState(null, '', selector);
          });
     }

     function refreshProductLanguage(product) {
          const words = productWords();
          const specs = getSpecs(product);
          const productName = localized(product.name) || product.name || words.equipment;
          const setText = (selector, value) => {
               const element = $(selector);
               if (element) element.textContent = value;
          };

          renderHero(product, specs);
          renderLongDescription(product);
          renderSpecs(product, specs);

          setText('#spec-table .wrapper > h2', words.equipmentSpecifications);
          setText('#spec-table .down > h3', words.specificationSheet);
          setText('#spec-table .column > h3', words.productSpecifications);

          $$('.cta-wrap .name').forEach(element => {
               element.textContent = productName;
          });

          const sectionLabels = {
               '#features': words.features,
               '#spec-table': words.specifications,
               '#product-media': words.media,
               '#attachments': words.attachments
          };

          $$('.cta-wrap.two .links a[href^="#"]').forEach(link => {
               const label = sectionLabels[link.getAttribute('href')];
               if (label) link.textContent = label;
          });

          const mediaHeading = $('#product-media h2');
          if (mediaHeading) mediaHeading.textContent = `${productName} ${words.media}`;

          const playButton = $('#product-media .play-button');
          if (playButton) playButton.setAttribute('aria-label', words.playVideo);

          const previousSlide = $('#product-media .slider-prev');
          const nextSlide = $('#product-media .slider-next');
          previousSlide?.setAttribute('aria-label', words.previousSlide);
          nextSlide?.setAttribute('aria-label', words.nextSlide);

          setText('.cta-wrap.two .button.grey', words.getInTouch);
          $$('[data-open-enquiry]').forEach(button => {
               button.textContent = words.sendEnquiry;
          });

          setText('.enquiry-flow .top h2', words.sendEnquiry);
          const closeEnquiry = $('.enquiry-close');
          closeEnquiry?.setAttribute('aria-label', words.closeEnquiry);
          setText('.selected-equipment > h3', words.selectedEquipment);
          setText('.selected-attachments > h3', words.selectedAttachments);
          setText('#product-enquiry-form > h3', words.yourDetails);

          const firstName = $('#product-enquiry-form [name="firstName"]');
          const lastName = $('#product-enquiry-form [name="lastName"]');
          const message = $('#enquiry-message');
          if (firstName) firstName.placeholder = words.firstName;
          if (lastName) lastName.placeholder = words.lastName;
          if (message) message.placeholder = words.typeMessage;

          setText('label[for="enquiry-email"]', words.emailRequired);
          setText('label[for="enquiry-phone"]', words.phoneRequired);
          setText('label[for="enquiry-message"]', words.message);

          const choiceLabels = $$('#product-enquiry-form .fc.flex.g6 > label');
          if (choiceLabels[0]) choiceLabels[0].textContent = words.purchasingFor;
          if (choiceLabels[1]) choiceLabels[1].textContent = words.intendedPayment;

          setText('[data-radio-value="Business"] span', words.business);
          setText('[data-radio-value="Personal"] span', words.personal);
          setText('[data-radio-value="Full Payment"] span', words.fullPayment);
          setText('[data-radio-value="Finance"] span', words.finance);
          setText('.enquiry-success h3', words.enquirySent);
          setText('.enquiry-success p', words.enquiryThanks);
          setText('.enquiry-submit', words.sendMessage);

          const productImage = $('main.prod .etr-product-image');
          if (productImage) productImage.alt = productName;
     }

     /* ============================================================
        INITIALISE
     ============================================================ */

     async function initialiseProductPage() {
          const main = $('main.prod');

          if (!main) return;

          startSkeleton();

          const slug = getSlug();

          if (!slug) {
               finishSkeleton();

               const heading = $('main.prod h1');

               if (heading) {
                    heading.textContent = 'No product selected';
               }

               console.error('Missing product slug');
               return;
          }

          try {
               const product = await fetchSanity(productQuery, {
                    slug
               });

               if (!product) {
                    throw new Error(`Product not found: ${slug}`);
               }

               document.addEventListener('etr:languagechange', () => {
                    refreshProductLanguage(product);
               });

               const specs = getSpecs(product);

               /*
                  Image loads separately, so text does not
                  need to wait for the image to decode.
               */

               const imagePromise = loadProductImage(product);

               renderHero(product, specs);
               renderLongDescription(product);

               const hasSpecs = renderSpecs(product, specs);
               const hasMedia = renderMedia(product);

               refreshProductLanguage(product);

               finishSkeleton();

               let attachments = [];

               try {
                    attachments = await getAttachments(product);
               } catch (error) {
                    console.error(
                         'Unable to fetch attachments:',
                         error
                    );
               }

               const hasAttachments = renderAttachments(attachments);

               setupSectionNavigation(product, {
                    specs: hasSpecs,
                    media: hasMedia,
                    attachments: hasAttachments
               });

               refreshProductLanguage(product);

               document.dispatchEvent(new CustomEvent('etr:productloaded', {
                    detail: { product }
               }));

               await imagePromise;

               console.log('ETR product loaded:', product.name);

          } catch (error) {
               finishSkeleton();

               console.error('ETR product page failed:', error);

               const heading = $('main.prod h1');

               if (heading) {
                    heading.textContent = 'Unable to load equipment';
               }

               const imageWrap = $('main.prod .image-wrap');

               imageWrap?.classList.remove('etr-image-loading');
          }
     }

     /* ============================================================
        DOM READY
     ============================================================ */

     if (document.readyState === 'loading') {
          document.addEventListener(
               'DOMContentLoaded',
               initialiseProductPage,
               { once: true }
          );
     } else {
          initialiseProductPage();
     }

})();
