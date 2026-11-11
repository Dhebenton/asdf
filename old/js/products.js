
const PROJECT_ID = "jqlee81t";
const DATASET = "production";
const LANGUAGE = "en";
const API_VERSION = "2026-10-21";

const container = document.querySelector("#product-cards");

// ORIGINAL PROMOTIONS QUERY

const productFields = `{
  _id,
  name,
  price,
  salePrice,
  isBestseller,
  isOnSale,
  "slug": slug.current,
  "image": images[0].asset->url,
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
  (isBestseller == true || isOnSale == true)
]${productFields}`;

const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;

// CATEGORY CONFIGURATION

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

// SPECIFICATION DEFINITIONS

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

// HELPERS

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[c]);
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
    return value.find(v => v.language === LANGUAGE)?.value
      || value.find(v => v.language === "et")?.value
      || "";
  }

  return "";
}

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

// SPECIFICATION SELECTION

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

// ORIGINAL CARD GENERATION

function formatPrice(value) {
  return typeof value === "number"
    ? `€${value.toLocaleString("en-IE")}`
    : "Price on request";
}

function createCard(product) {
  const category = getCategory(product);
  const { primary, secondary } = selectSpecs(product, category);

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

// ORIGINAL BEST SELLERS / PROMOTIONS FETCH

async function loadProducts() {
  if (!container) {
    console.error("Missing #product-cards container");
    return;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Sanity HTTP ${response.status}`);
    }

    const { result = [] } = await response.json();

    container.innerHTML = result.map(createCard).join("");

    console.log(`Loaded ${result.length} Sanity products`);

    document.dispatchEvent(new CustomEvent("productsLoaded", {
      detail: { container }
    }));

  } catch (error) {
    console.error("Failed to load products:", error);
  }
}

loadProducts();


// ======================================================
// SHOP BY CATEGORY
// ======================================================

function initializeShopByCategory() {
  const section = document.querySelector("#shop-all");
  if (!section) return;

  const grid = section.querySelector("#shop-by");
  if (!grid) return;

  const slider = grid.closest("[data-slider]");
  const tabs = [...section.querySelectorAll(".tab")];
  const counter = section.querySelector(".load-ammount");
  const loadMore = section.querySelector(".no-tablet button");

  const tabCategories = [
    "excavators",
    "loaders",
    "bandsaw",
    "utvs",
    "atvs"
  ];

  const BATCH_SIZE = 3;
  const mobileMedia = window.matchMedia("(max-width: 1024px)");

  let products = [];
  let visibleCount = BATCH_SIZE;
  let activeCategory = "excavators";

  const initialTab = tabs.findIndex(tab =>
    tab.classList.contains("active")
  );

  if (initialTab >= 0 && tabCategories[initialTab]) {
    activeCategory = tabCategories[initialTab];
  }

  // ALL PUBLISHED PRODUCTS QUERY

  const shopQuery = `*[
    _type == "product" &&
    !(_id in path("drafts.**"))
  ]${productFields}`;

  const shopURL =
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(shopQuery)}`;

  // CATEGORY MATCHING

  function isBandsaw(product) {
    const category = product.category || {};

    const text = normalize([
      localized(category.name),
      localized(category.title),
      category.slug,
      product.name
    ].filter(Boolean).join(" "));

    return [
      "bandsaw",
      "band saw",
      "sawmill",
      "saeraam",
      "saekaat"
    ].some(term => text.includes(term));
  }

  function matchesCategory(product) {
    const category = getCategory(product).key;

    if (activeCategory === "bandsaw") {
      return isBandsaw(product);
    }

    if (category === activeCategory) return true;
    if (category !== "other") return false;

    // Fallback for products without a recognised category.

    const name = normalize(localized(product.name));

    const aliases = {
      excavators: ["excavator", "ekskavaator"],
      loaders: ["loader", "laadur"],
      utvs: ["utv", "side by side", "side-by-side"],
      atvs: ["atv", "quad"]
    };

    return (aliases[activeCategory] || []).some(term =>
      (` ${name} `).includes(` ${normalize(term)} `)
    );
  }

  function filteredProducts() {
    return products.filter(matchesCategory);
  }

  // RENDER PRODUCTS

  function renderShop(resetSlider = false) {
    const filtered = filteredProducts();
    const mobile = mobileMedia.matches;

    // Desktop shows 3 at a time.
    // Tablet/mobile makes all category products available.

    const shown = mobile
      ? filtered.slice(0, 8)
     : filtered.slice(0, visibleCount);

    grid.innerHTML = shown.length
      ? shown.map(createCard).join("")
      : '<p class="shop-empty">No equipment available in this category.</p>';

    // LIVE COUNTER

    if (counter) {
      const loaded = Math.min(mobile ? 8 : visibleCount, filtered.length);

      counter.textContent =
        `Loaded ${loaded} of ${filtered.length} equipment`;
    }

    // LOAD MORE BUTTON

    if (loadMore) {
      const hasMore = !mobile && visibleCount < filtered.length;

      loadMore.hidden = !hasMore;
      loadMore.style.display = hasMore ? "" : "none";
    }

    // NOTIFY UNIVERSAL SLIDER

    if (resetSlider && slider) {
      document.dispatchEvent(new CustomEvent("sliderReset", {
        detail: { container: slider }
      }));
    }

    document.dispatchEvent(new CustomEvent("productsLoaded", {
      detail: { container: grid }
    }));
  }

  // TABS

  tabs.forEach((tab, index) => {
    const categoryKey = tabCategories[index];

    if (!categoryKey) return;

    tab.setAttribute(
      "aria-pressed",
      String(activeCategory === categoryKey)
    );

    tab.addEventListener("click", () => {
      if (activeCategory === categoryKey) return;

      activeCategory = categoryKey;
      visibleCount = BATCH_SIZE;

      tabs.forEach(button => {
        const selected = button === tab;

        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });

      renderShop(true);
    });
  });

  // LOAD MORE

  loadMore?.addEventListener("click", () => {
    if (mobileMedia.matches) return;

    const total = filteredProducts().length;

    if (visibleCount >= total) return;

    visibleCount += BATCH_SIZE;
    renderShop();
  });

  // RESPONSIVE SWITCHING

  mobileMedia.addEventListener("change", () => {
    renderShop(true);
  });

  // INITIAL LOADING STATE

  if (counter) {
    counter.textContent = "Loading equipment...";
  }

  if (loadMore) {
    loadMore.hidden = true;
  }

  // FETCH SHOP PRODUCTS

  async function loadShopProducts() {
    try {
      const response = await fetch(shopURL);

      if (!response.ok) {
        throw new Error(`Sanity HTTP ${response.status}`);
      }

      const { result } = await response.json();

      if (!Array.isArray(result)) {
        throw new Error("Invalid Sanity response");
      }

      products = result;

      console.log(`Shop loaded ${products.length} products`);

      renderShop(true);

    } catch (error) {
      console.error("Failed to load Shop By Category:", error);

      grid.innerHTML =
        '<p class="shop-empty">Unable to load equipment.</p>';

      if (counter) {
        counter.textContent = "Unable to load equipment";
      }

      if (loadMore) {
        loadMore.hidden = true;
        loadMore.style.display = "none";
      }
    }
  }

  loadShopProducts();
}

// INITIALISE SHOP

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeShopByCategory,
    { once: true }
  );
} else {
  initializeShopByCategory();
}
