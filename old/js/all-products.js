
const PROJECT_ID = "jqlee81t";
const DATASET = "production";
const LANGUAGE = "en";
const API_VERSION = "2026-10-21";

const container = document.querySelector("#product-cards");

/* ============================================================
   SANITY PRODUCT QUERY
============================================================ */

const productFields = `{
     _id,
     name,
     price,
     salePrice,
     isBestseller,
     isOnSale,
     "slug": slug.current,
     "image": images[0].asset->url,
     "brand": brand->{name},
     "category": category->{
          _id,
          name,
          title,
          "slug": slug.current
     },
     "mainFeature": mainFeature,
     "specGroups": technicalInfo[]{
          "rows": table[language == "en"][0].value.rows[]{
               cells
          }
     }
}`;

const query = `*[
     _type == "product" &&
     !(_id in path("drafts.**")) &&
     defined(slug.current)
] | order(name asc) ${productFields}`;

const url =
     `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;

/* ============================================================
   CATEGORY CONFIGURATION
============================================================ */

const categories = {
     excavators: {
          match: ["excavat", "ekskavaator"],
          name: "Excavators",
          primary: ["weight", "diggingHeight"],
          secondary: ["power", "diggingDepth", "diggingReach", "bucket"]
     },
     loaders: {
          match: ["loader", "laadur"],
          name: "Loaders",
          primary: ["weight", "load"],
          secondary: ["power", "liftHeight", "bucket", "speed"]
     },
     atvs: {
          match: ["atv", "quad"],
          name: "ATVs",
          primary: ["engine", "power"],
          secondary: ["clearance", "fuel", "speed", "weight"]
     },
     utvs: {
          match: ["utv", "side-by-side", "utility vehicle"],
          name: "UTVs",
          primary: ["power", "load"],
          secondary: ["engine", "towing", "clearance", "fuel"]
     },
     woodworking: {
          match: ["woodwork", "forestry", "chipper", "puidu", "mets"],
          name: "Woodworking",
          primary: ["power", "capacity"],
          secondary: ["diameter", "weight", "length", "speed"]
     },
     generators: {
          match: ["generator", "generaator"],
          name: "Generators",
          primary: ["power", "voltage"],
          secondary: ["frequency", "fuel", "capacity", "weight"]
     },
     compressors: {
          match: ["compressor", "kompressor"],
          name: "Compressors",
          primary: ["pressure", "airflow"],
          secondary: ["power", "capacity", "voltage", "weight"]
     },
     grasshoppers: {
          match: ["grasshopper", "grass reinforcement", "muruk"],
          name: "Grasshoppers",
          primary: ["load", "dimensions"],
          secondary: ["material", "thickness", "weight", "width"]
     },
     ramps: {
          match: ["ramp", "kaldtee"],
          name: "Access Ramps",
          primary: ["load", "length"],
          secondary: ["width", "weight", "material", "height"]
     },
     mats: {
          match: ["mat", "ground protection", "kaitsematt"],
          name: "Protection Mats",
          primary: ["load", "dimensions"],
          secondary: ["thickness", "material", "weight", "length"]
     }
};

/* ============================================================
   SPECIFICATION DEFINITIONS
============================================================ */

const definitions = {
     weight: {
          label: "Operating weight",
          aliases: ["operating weight", "operating mass", "machine weight", "weight"]
     },
     diggingHeight: {
          label: "Max. digging height",
          aliases: ["max. digging height", "maximum digging height"]
     },
     diggingDepth: {
          label: "Depth",
          aliases: ["max. digging depth", "maximum digging depth", "digging depth"]
     },
     diggingReach: {
          label: "Reach",
          aliases: ["max. digging reach", "maximum digging reach", "digging reach"]
     },
     power: {
          label: "Power",
          aliases: ["rated power", "engine power", "motor power", "prime power", "power"]
     },
     bucket: {
          label: "Bucket",
          aliases: ["bucket capacity", "bucket volume"]
     },
     load: {
          label: "Load",
          aliases: ["rated load", "rated capacity", "lifting capacity", "payload capacity", "load capacity"]
     },
     liftHeight: {
          label: "Lift height",
          aliases: ["max. lifting height", "maximum lifting height", "lifting height"]
     },
     speed: {
          label: "Speed",
          aliases: ["travel speed", "maximum speed", "max. speed"]
     },
     engine: {
          label: "Engine",
          aliases: ["engine displacement", "engine capacity", "displacement"]
     },
     clearance: {
          label: "Clearance",
          aliases: ["ground clearance"]
     },
     fuel: {
          label: "Fuel",
          aliases: ["fuel capacity", "fuel tank capacity", "fuel tank"]
     },
     towing: {
          label: "Towing",
          aliases: ["towing capacity"]
     },
     capacity: {
          label: "Capacity",
          aliases: ["processing capacity", "production capacity", "tank capacity", "capacity"]
     },
     diameter: {
          label: "Diameter",
          aliases: ["maximum log diameter", "max. diameter", "cutting diameter"]
     },
     voltage: {
          label: "Voltage",
          aliases: ["rated voltage", "output voltage", "voltage"]
     },
     frequency: {
          label: "Frequency",
          aliases: ["frequency"]
     },
     pressure: {
          label: "Pressure",
          aliases: ["working pressure", "operating pressure", "maximum pressure", "pressure"]
     },
     airflow: {
          label: "Airflow",
          aliases: ["free air delivery", "air delivery", "air flow", "airflow"]
     },
     dimensions: {
          label: "Dimensions",
          aliases: ["overall dimensions", "panel size", "dimensions"]
     },
     length: {
          label: "Length",
          aliases: ["overall length", "total length", "length"]
     },
     width: {
          label: "Width",
          aliases: ["overall width", "total width", "width"]
     },
     height: {
          label: "Height",
          aliases: ["overall height", "total height", "height"]
     },
     thickness: {
          label: "Thickness",
          aliases: ["thickness"]
     },
     material: {
          label: "Material",
          aliases: ["material"]
     }
};

/* ============================================================
   HELPERS
============================================================ */

function escapeHTML(value) {
     return String(value ?? "").replace(/[&<>"']/g, character => ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
     })[character]);
}

function normalize(value) {
     return String(value || "")
          .toLowerCase()
          .replace(/[^\p{L}\p{N}]+/gu, " ")
          .trim();
}

function localized(value) {
     if (typeof value === "string") return value;

     if (Array.isArray(value)) {
          return value.find(item => item.language === LANGUAGE)?.value
               || value.find(item => item.language === "et")?.value
               || "";
     }

     return "";
}

/* ============================================================
   CATEGORY DETECTION
============================================================ */

function getCategory(product) {
     const category = product.category || {};

     const raw = [
          localized(category.name),
          localized(category.title),
          category.slug,
          category._id
     ].filter(Boolean).join(" ").toLowerCase();

     for (const [key, config] of Object.entries(categories)) {
          if (config.match.some(term => raw.includes(term))) {
               return { key, ...config };
          }
     }

     return {
          key: "other",
          name: localized(category.name) || localized(category.title) || "Equipment",
          primary: ["weight", "power"],
          secondary: ["capacity", "dimensions", "speed", "length"]
     };
}

/* ============================================================
   EXTRACT SPECIFICATIONS
============================================================ */

function getAllSpecs(product) {
     return (product.specGroups || [])
          .flatMap(group => group.rows || [])
          .filter(row => {
               const cells = row.cells;

               return Array.isArray(cells) &&
                    cells.length >= 2 &&
                    cells[0] &&
                    cells[1] &&
                    !["-", "–", "n/a", "none"].includes(
                         normalize(cells[1])
                    );
          })
          .map(row => ({
               label: String(row.cells[0]).trim(),
               value: String(row.cells[1]).trim()
          }));
}

function findSpec(specs, key, used) {
     const definition = definitions[key];

     if (!definition) return null;

     for (const alias of definition.aliases) {
          const match = specs.find(spec =>
               !used.has(spec) &&
               normalize(spec.label) === normalize(alias)
          );

          if (match) {
               return {
                    source: match,
                    key,
                    label: definition.label,
                    value: match.value
               };
          }
     }

     for (const alias of definition.aliases) {
          if (normalize(alias).length < 8) continue;

          const match = specs.find(spec =>
               !used.has(spec) &&
               normalize(spec.label).includes(normalize(alias))
          );

          if (match) {
               return {
                    source: match,
                    key,
                    label: definition.label,
                    value: match.value
               };
          }
     }

     return null;
}

function cleanValue(value, key) {
     let result = String(value || "").trim();

     if (key === "power") {
          const match = result.match(
               /(\d+(?:[.,]\d+)?)\s*(kW|hp|PS)\b/i
          );

          if (match) {
               result = `${match[1]} ${match[2]}`;
          }
     }

     result = result.replace(
          /^(\d{4,7})\s*(mm|kg|cm)\b/i,
          (_, number, unit) =>
               `${Number(number).toLocaleString("en-IE")} ${unit}`
     );

     return result;
}

/* ============================================================
   CATEGORY-BASED SPECIFICATION SELECTION
============================================================ */

function selectSpecs(product, category) {
     const all = getAllSpecs(product);
     const used = new Set();

     const primary = [];
     const secondary = [];

     function add(key, target) {
          const limit = target === primary ? 2 : 4;

          if (target.length >= limit) return;

          const spec = findSpec(all, key, used);

          if (!spec) return;

          used.add(spec.source);

          target.push({
               label: spec.label,
               value: cleanValue(spec.value, key)
          });
     }

     category.primary.forEach(key => add(key, primary));

     if (primary.length < 2) {
          category.secondary.forEach(key => add(key, primary));
     }

     category.secondary.forEach(key => add(key, secondary));

     const fallbacks = [
          "power", "diggingDepth", "diggingReach", "bucket",
          "capacity", "load", "liftHeight", "speed",
          "weight", "dimensions", "fuel", "voltage",
          "length", "width", "pressure", "airflow"
     ];

     for (const key of fallbacks) {
          if (primary.length < 2) add(key, primary);
          if (secondary.length < 4) add(key, secondary);
     }

     const excluded = [
          "model", "type", "emissions",
          "number of cylinders"
     ];

     for (const spec of all) {
          if (primary.length >= 2 && secondary.length >= 4) break;
          if (used.has(spec)) continue;
          if (excluded.includes(normalize(spec.label))) continue;

          const value = cleanValue(spec.value);

          if (value.length > 22 || spec.label.length > 22) continue;

          const target = primary.length < 2 ? primary : secondary;

          target.push({
               label: spec.label,
               value
          });

          used.add(spec);
     }

     return { primary, secondary };
}

/* ============================================================
   ORIGINAL PRODUCT CARD
============================================================ */

function formatPrice(value) {
     return typeof value === "number"
          ? `€${value.toLocaleString("en-IE")}`
          : "Price on request";
}

function createCard(product) {
     const category = getCategory(product);

     const { primary, secondary } = selectSpecs(
          product,
          category
     );

     const isSale = product.isOnSale === true;
     const isBestseller = product.isBestseller === true;

     const tag = isSale
          ? "Promotion"
          : isBestseller
               ? "Best Seller"
               : "";

     const price = isSale && typeof product.salePrice === "number"
          ? product.salePrice
          : product.price;

     const mainHTML = primary.map(spec => `
          <div class="fr spec jsb">
               <p class="sp">${escapeHTML(spec.label)}:</p>
               <p class="an">${escapeHTML(spec.value)}</p>
          </div>
     `).join("");

     const summary = secondary.map(spec =>
          `${spec.label}: ${spec.value}`
     ).join(" · ");

     const summaryHTML = summary ? `
          <div class="spec vert fc g8">
               <p class="sp">Specs</p>
               <p class="an">${escapeHTML(summary)}</p>
          </div>
     ` : "";

     const link = product.slug
          ? `/pages/product-page.html?slug=${encodeURIComponent(product.slug)}`
          : "#";

     return `
          <a
               href="${escapeHTML(link)}"
               class="product card${isSale ? " sale" : ""}"
          >
               <div class="image-wrap">
                    <img
                         src="${escapeHTML(product.image || "")}"
                         alt="${escapeHTML(product.name)}"
                         decoding="async"
                         loading="lazy"
                         class="fs"
                    />

                    ${tag ? `
                         <span class="promotion-tag">${tag}</span>
                    ` : ""}
               </div>

               <div class="content fc">
                    <span class="category">
                         ${escapeHTML(category.name)}
                    </span>

                    <div class="fr jsb ae">
                         <h3>${escapeHTML(product.name)}</h3>
                         <p class="price">${formatPrice(price)}</p>
                    </div>

                    ${mainHTML}
                    ${summaryHTML}
               </div>
          </a>
     `;
}

/* ============================================================
   ALL EQUIPMENT FILTERS / PAGINATION
============================================================ */

(() => {
     'use strict';

     if (!container) return;

     const drawer = document.querySelector('#filter-menu');
     const overlay = document.querySelector('#filters-overlay');
     const pager = document.querySelector('#catalogue-pagination');

     if (!drawer || !overlay || !pager) {
          console.error('ETR Catalogue: Missing filter or pagination elements.');
          return;
     }

     const PAGE_SIZE = 9;

     let products = [];
     let results = [];
     let currentPage = 1;
     let drawerOpen = false;
     let previousFocus = null;

     const $ = selector => document.querySelector(selector);

     const $$ = selector => [
          ...document.querySelectorAll(selector)
     ];

     /* ============================================================
        FILTER HELPERS
     ============================================================ */

     function num(selector) {
          const input = $(selector);

          if (!input || input.value.trim() === '') {
               return null;
          }

          const value = Number(input.value);

          return Number.isFinite(value)
               ? value
               : null;
     }

     function chosen(type) {
          return $$('#filter-menu .filter-one.active')
               .filter(element => element.dataset.filter === type)
               .map(element => element.dataset.value);
     }

     /* ============================================================
        ORIGINAL FILTER BUTTONS
     ============================================================ */

     function filterButton(type, value, label, radio = false) {
          const button = document.createElement('button');

          button.type = 'button';
          button.className = 'filter-one fr g10';

          button.dataset.filter = type;
          button.dataset.value = value;

          button.setAttribute('aria-pressed', 'false');

          const mark = document.createElement('div');

          mark.className = radio
               ? 'rad fr jc'
               : 'box fr jc';

          if (radio) {
               mark.appendChild(document.createElement('div'));
          } else {
               mark.innerHTML = `
                    <svg viewBox="0 0 8 7" fill="currentColor">
                         <use href="#check"></use>
                    </svg>
               `;
          }

          const text = document.createElement('span');

          text.textContent = label;

          button.append(mark, text);

          return button;
     }

     /* ============================================================
        POPULATE CATEGORY AND BRAND FILTERS
     ============================================================ */

     function populateOptions() {
          const categoryWrap = $('#filter-category');
          const brandWrap = $('#filter-brand');

          if (categoryWrap) {
               categoryWrap.replaceChildren();

               const unique = new Map();

               products.forEach(product => {
                    const category = getCategory(product);

                    unique.set(category.key, category.name);
               });

               [...unique]
                    .sort((a, b) => a[1].localeCompare(b[1]))
                    .forEach(([key, label]) => {
                         categoryWrap.appendChild(
                              filterButton(
                                   'category',
                                   key,
                                   label
                              )
                         );
                    });
          }

          if (brandWrap) {
               brandWrap.replaceChildren();

               const values = [
                    ...new Set(
                         products
                              .map(product => localized(product.brand?.name))
                              .filter(Boolean)
                    )
               ].sort();

               values.forEach(value => {
                    brandWrap.appendChild(
                         filterButton(
                              'brand',
                              value,
                              value
                         )
                    );
               });
          }
     }

     /* ============================================================
        NUMERIC SPECIFICATION FILTERS
     ============================================================ */

     function metric(product, aliases, unit) {
          const spec = getAllSpecs(product).find(item => {
               return aliases.some(alias =>
                    normalize(item.label).includes(alias)
               );
          });

          if (!spec) return null;

          const text = spec.value
               .replace(/\s+/g, ' ')
               .replace(/(\d),(\d)/g, '$1.$2');

          const match = text.match(
               /([\d]+(?:\.\d+)?)\s*(kg|t|tonnes?|kw|hp|ps|w)\b/i
          );

          if (!match) return null;

          let value = Number(match[1]);

          const detectedUnit = match[2].toLowerCase();

          if (unit === 'kg') {
               if (detectedUnit === 'kg') {
                    return value;
               }

               if (
                    detectedUnit === 't' ||
                    detectedUnit.startsWith('tonne')
               ) {
                    return value * 1000;
               }

               return null;
          }

          if (unit === 'kw') {
               if (detectedUnit === 'kw') {
                    return value;
               }

               if (
                    detectedUnit === 'hp' ||
                    detectedUnit === 'ps'
               ) {
                    return value * 0.7457;
               }

               if (detectedUnit === 'w') {
                    return value / 1000;
               }
          }

          return null;
     }

     /* ============================================================
        MATCH PRODUCT AGAINST FILTERS
     ============================================================ */

     function matches(product) {
          const selectedCategories = chosen('category');
          const selectedBrands = chosen('brand');
          const selectedStatuses = chosen('status');

          const requestOnly = chosen('request').includes('yes');

          /* Category */

          if (
               selectedCategories.length &&
               !selectedCategories.includes(getCategory(product).key)
          ) {
               return false;
          }

          /* Brand */

          if (
               selectedBrands.length &&
               !selectedBrands.includes(
                    localized(product.brand?.name)
               )
          ) {
               return false;
          }

          /* Promotions / Best Sellers */

          if (
               selectedStatuses.length &&
               !selectedStatuses.some(status =>
                    status === 'sale'
                         ? product.isOnSale
                         : product.isBestseller
               )
          ) {
               return false;
          }

          /* Price */

          const price =
               product.isOnSale &&
               typeof product.salePrice === 'number' &&
               product.salePrice < product.price
                    ? product.salePrice
                    : product.price;

          if (
               requestOnly &&
               typeof price === 'number'
          ) {
               return false;
          }

          const minPrice = num('#price-min');
          const maxPrice = num('#price-max');

          if (
               minPrice !== null ||
               maxPrice !== null
          ) {
               if (typeof price !== 'number') {
                    return false;
               }

               if (
                    minPrice !== null &&
                    price < minPrice
               ) {
                    return false;
               }

               if (
                    maxPrice !== null &&
                    price > maxPrice
               ) {
                    return false;
               }
          }

          /* Operating Weight and Power */

          const numericFilters = [
               {
                    min: '#weight-min',
                    max: '#weight-max',
                    unit: 'kg',
                    aliases: [
                         'operating weight',
                         'operating mass',
                         'machine weight',
                         'töökaal'
                    ]
               },
               {
                    min: '#power-min',
                    max: '#power-max',
                    unit: 'kw',
                    aliases: [
                         'engine power',
                         'rated power',
                         'motor power',
                         'mootori võimsus',
                         'võimsus'
                    ]
               }
          ];

          for (const config of numericFilters) {
               const min = num(config.min);
               const max = num(config.max);

               if (min === null && max === null) {
                    continue;
               }

               const value = metric(
                    product,
                    config.aliases,
                    config.unit
               );

               if (value === null) {
                    return false;
               }

               if (
                    min !== null &&
                    value < min
               ) {
                    return false;
               }

               if (
                    max !== null &&
                    value > max
               ) {
                    return false;
               }
          }

          return true;
     }

     /* ============================================================
        RENDER PRODUCT GRID AND PAGINATION
     ============================================================ */

     function render() {
          const totalPages = Math.ceil(
               results.length / PAGE_SIZE
          );

          currentPage = Math.min(
               Math.max(currentPage, 1),
               Math.max(totalPages, 1)
          );

          const start = (currentPage - 1) * PAGE_SIZE;

          const visible = results.slice(
               start,
               start + PAGE_SIZE
          );

          container.innerHTML = visible.length
               ? visible.map(createCard).join('')
               : `
                    <p class="catalogue-empty">
                         No equipment matches these filters.
                    </p>
               `;

          const count = $('#catalogue-count');
          const resultsLabel = $('#results-label');

          if (count) {
               count.textContent =
                    `${results.length} equipment`;
          }

          if (resultsLabel) {
               resultsLabel.textContent = visible.length
                    ? `Showing ${start + 1}–${start + visible.length} of ${results.length}`
                    : 'No results';
          }

          pager.replaceChildren();

          /* ============================================================
             PAGINATION BUTTONS
          ============================================================ */

          function pageButton(label, target, disabled = false) {
               const button = document.createElement('button');

               button.type = 'button';
               button.textContent = label;
               button.disabled = disabled;

               if (
                    target === currentPage &&
                    String(label) === String(target)
               ) {
                    button.classList.add('active');
                    button.setAttribute('aria-current', 'page');
               }

               button.addEventListener('click', () => {
                    if (
                         target === currentPage ||
                         disabled
                    ) {
                         return;
                    }

                    currentPage = target;

                    render();

                    $('#shop-all')?.scrollIntoView({
                         behavior:
                              matchMedia(
                                   '(prefers-reduced-motion: reduce)'
                              ).matches
                                   ? 'instant'
                                   : 'smooth',

                         block: 'start'
                    });
               });

               pager.appendChild(button);
          }

          if (totalPages > 1) {
               pageButton(
                    '‹',
                    currentPage - 1,
                    currentPage === 1
               );

               for (let i = 1; i <= totalPages; i++) {
                    pageButton(String(i), i);
               }

               pageButton(
                    '›',
                    currentPage + 1,
                    currentPage === totalPages
               );
          }

          document.dispatchEvent(
               new CustomEvent('productsLoaded', {
                    detail: { container }
               })
          );
     }

     /* ============================================================
        APPLY FILTERS
     ============================================================ */

     function filterNow() {
          results = products.filter(matches);

          currentPage = 1;

          render();
     }

     /* ============================================================
        OPEN FILTER DRAWER
     ============================================================ */

     function openDrawer() {
          if (drawerOpen) return;

          drawerOpen = true;
          previousFocus = document.activeElement;

          drawer.inert = false;
          drawer.setAttribute('aria-hidden', 'false');

          drawer.classList.add('active');
          overlay.classList.add('active');

          $('#toggle-filters')?.setAttribute(
               'aria-expanded',
               'true'
          );

          document.body.classList.add(
               'filters-scroll-locked'
          );

          drawer.querySelector('.filter-close')?.focus({
               preventScroll: true
          });
     }

     /* ============================================================
        CLOSE FILTER DRAWER
     ============================================================ */

     function closeDrawer() {
          if (!drawerOpen) return;

          drawerOpen = false;

          drawer.classList.remove('active');
          overlay.classList.remove('active');

          drawer.inert = true;
          drawer.setAttribute('aria-hidden', 'true');

          $('#toggle-filters')?.setAttribute(
               'aria-expanded',
               'false'
          );

          document.body.classList.remove(
               'filters-scroll-locked'
          );

          if (previousFocus?.isConnected) {
               previousFocus.focus({
                    preventScroll: true
               });
          }
     }

     /* ============================================================
        DRAWER EVENT LISTENERS
     ============================================================ */

     $('#toggle-filters')?.addEventListener(
          'click',
          openDrawer
     );

     drawer.querySelector('.filter-close')?.addEventListener(
          'click',
          closeDrawer
     );

     overlay.addEventListener(
          'click',
          closeDrawer
     );

     document.addEventListener('keydown', event => {
          if (
               event.key === 'Escape' &&
               drawerOpen
          ) {
               closeDrawer();
          }
     });

     /* ============================================================
        FILTER ACCORDIONS AND CHECKBOXES
     ============================================================ */

     drawer.addEventListener('click', event => {
          const heading = event.target.closest('.filter-heading');

          if (heading) {
               const group = heading.closest('.filter-tab');

               if (!group) return;

               const closed = group.classList.toggle('closed');

               heading.setAttribute(
                    'aria-expanded',
                    String(!closed)
               );

               return;
          }

          const control = event.target.closest('.filter-one');

          if (control) {
               const active = control.classList.toggle('active');

               control.setAttribute(
                    'aria-pressed',
                    String(active)
               );

               filterNow();
          }
     });

     /* ============================================================
        NUMERIC INPUT CHANGES
     ============================================================ */

     drawer.addEventListener('input', event => {
          if (
               event.target.matches('input[type="number"]')
          ) {
               filterNow();
          }
     });

     /* ============================================================
        APPLY FILTERS
     ============================================================ */

     $('#apply-filters')?.addEventListener('click', () => {
          filterNow();
          closeDrawer();
     });

     /* ============================================================
        CLEAR FILTERS
     ============================================================ */

     $('#clear-filters')?.addEventListener('click', () => {
          drawer.querySelectorAll('.filter-one.active')
               .forEach(element => {
                    element.classList.remove('active');

                    element.setAttribute(
                         'aria-pressed',
                         'false'
                    );
               });

          drawer.querySelectorAll('input[type="number"]')
               .forEach(input => {
                    input.value = '';
               });

          filterNow();
     });

     /* ============================================================
        LOAD ALL PRODUCTS FROM SANITY
     ============================================================ */

     async function load() {
          container.innerHTML = `
               <p class="catalogue-empty">
                    Loading equipment...
               </p>
          `;

          try {
               const response = await fetch(url);

               if (!response.ok) {
                    throw new Error(
                         `Sanity HTTP ${response.status}`
                    );
               }

               const data = await response.json();

               if (data.error) {
                    throw new Error(
                         data.error.description || 'Sanity error'
                    );
               }

               if (!Array.isArray(data.result)) {
                    throw new Error(
                         'Invalid Sanity response'
                    );
               }

               products = data.result.filter(
                    product => product.slug && product.name
               );

               populateOptions();
               filterNow();

               console.log(
                    `ETR catalogue loaded ${products.length} published products`
               );

          } catch (error) {
               console.error(
                    'ETR catalogue failed:',
                    error
               );

               container.innerHTML = `
                    <p class="catalogue-empty">
                         Unable to load equipment.
                         Check the browser console.
                    </p>
               `;
          }
     }

     load();

})();
