(() => {
    'use strict';

    const grid = document.querySelector('#catalogue-products');
    const drawer = document.querySelector('#catalogue-filter');
    const overlay = document.querySelector('.background-blur');
    if (!grid || !drawer) return;

    const params = new URLSearchParams(location.search);
    const initialCategories = (params.get('categories') || params.get('category') || '').split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
    const initialBrands = (params.get('brands') || params.get('brand') || '').split(',').map(value => value.trim()).filter(Boolean);
    const initialBrand = initialBrands[0] || '';
    const industry = (params.get('industry') || '').trim().toLowerCase();
    const BATCH = 6;
    const state = {
        products: [], categories: new Set(initialCategories), brands: new Set(initialBrands),
        prices: new Set((params.get('price') || '').split(',').filter(Boolean)), visible: BATCH, loading: true, failed: false
    };

    const words = {
        en: {
            home: 'Home', all: 'All Equipment', categories: 'Categories', brands: 'Brands', industries: 'Industries',
            category: 'Category', brand: 'Brand', price: 'Price', availability: 'Availability', sale: 'On Sale', bestseller: 'Best Seller',
            low: 'Under €25,000', mid: '€25,000–€75,000', high: 'Over €75,000', loading: 'Loading equipment…',
            empty: 'No equipment matches these filters.', error: 'Unable to load equipment.', count: n => `${n} Equipment`,
            loaded: (n, total) => `Loaded ${n} of ${total} equipment`, learn: 'Learn More', enquire: 'Enquire', request: 'Price on request'
        },
        et: {
            home: 'Avaleht', all: 'Kogu tehnika', categories: 'Kategooriad', brands: 'Kaubamärgid', industries: 'Valdkonnad',
            category: 'Kategooria', brand: 'Kaubamärk', price: 'Hind', availability: 'Saadavus', sale: 'Soodushinnaga', bestseller: 'Populaarne',
            low: 'Alla 25 000 €', mid: '25 000–75 000 €', high: 'Üle 75 000 €', loading: 'Laadin tehnikat…',
            empty: 'Ükski masin ei vasta valitud filtritele.', error: 'Tehnika laadimine ebaõnnestus.', count: n => `${n} masinat`,
            loaded: (n, total) => `Laaditud ${n}/${total}`, learn: 'Vaata lähemalt', enquire: 'Küsi pakkumist', request: 'Hind päringul'
        }
    };
    const categoryMap = {
        excavators: ['Excavators', 'Ekskavaatorid', ['excavator', 'ekskavaator']],
        loaders: ['Loaders', 'Laadurid', ['loader', 'laadur']],
        compressors: ['Compressors', 'Kompressorid', ['compressor', 'kompressor']],
        generators: ['Generators', 'Generaatorid', ['generator', 'generaator']],
        woodworking: ['Woodworking', 'Puidutöö', ['wood', 'forestry', 'chipper', 'sawmill', 'puit', 'mets', 'hakkur']],
        utvs: ['UTVs', 'UTV-d', ['utv', 'utility vehicle', 'side by side']],
        atvs: ['ATVs', 'ATV-d', ['atv', 'quad']],
        'access-ramps': ['Access Ramps', 'Pealesõidurambid', ['access ramp', 'loading ramp', 'pealesõiduramp']],
        'protection-mats': ['Protection Mats', 'Kaitsematid', ['protection mat', 'ground protection', 'kaitsematt']],
        'ground-reinforcement': ['Ground Reinforcement', 'Pinnasetugevdus', ['ground reinforcement', 'ground mat', 'grasshopper', 'pinnasetugevdus']]
    };
    const aliases = {
        ...Object.fromEntries(Object.entries(categoryMap).map(([key, value]) => [key, value[2]])),
        'wood-chippers': categoryMap.woodworking[2], 'mini-excavators': ['mini excavator', 'miniekskavaator'], 'compact-loaders': ['compact loader', 'kompaktlaadur']
    };
    const industryNames = {
        en: { construction: 'Construction & Earthworks', agriculture: 'Agriculture & Farming', forestry: 'Forestry & Timber', infrastructure: 'Infrastructure & Utilities', landscaping: 'Landscaping & Groundskeeping', transport: 'Transport & Material Handling' },
        et: { construction: 'Ehitus ja pinnasetööd', agriculture: 'Põllumajandus', forestry: 'Metsandus ja puit', infrastructure: 'Taristu ja kommunaalteenused', landscaping: 'Haljastus ja heakord', transport: 'Transport ja materjalikäitlus' }
    };
    const specMap = [
        ['Weight', 'Kaal', ['operating weight', 'operating mass', 'machine weight']],
        ['Max Dig Depth', 'Kaevesügavus', ['maximum digging depth', 'max digging depth', 'digging depth']],
        ['Max Dig Height', 'Kaevekõrgus', ['maximum digging height', 'max digging height', 'digging height']],
        ['Dig Reach', 'Kaeveulatus', ['maximum digging reach', 'digging reach', 'maximum digging radius']],
        ['Power', 'Võimsus', ['rated power', 'engine power', 'motor power']], ['Bucket', 'Kopp', ['bucket capacity', 'bucket volume']],
        ['Load', 'Tõstejõud', ['rated load', 'lifting capacity', 'payload capacity', 'load capacity']],
        ['Lift Height', 'Tõstekõrgus', ['maximum lifting height', 'lifting height']], ['Speed', 'Kiirus', ['travel speed', 'maximum speed']],
        ['Engine', 'Mootor', ['engine displacement', 'engine capacity', 'displacement']], ['Clearance', 'Kliirens', ['ground clearance']],
        ['Fuel', 'Kütus', ['fuel capacity', 'fuel tank capacity']], ['Capacity', 'Jõudlus', ['processing capacity', 'production capacity', 'capacity']],
        ['Pressure', 'Rõhk', ['working pressure', 'operating pressure', 'maximum pressure']], ['Airflow', 'Õhuvool', ['free air delivery', 'air delivery', 'air flow']],
        ['Size', 'Mõõtmed', ['overall dimensions', 'dimensions']], ['Length', 'Pikkus', ['overall length', 'length']],
        ['Width', 'Laius', ['overall width', 'width']], ['Height', 'Kõrgus', ['overall height', 'height']]
    ];

    const language = () => document.documentElement.lang === 'et' ? 'et' : 'en';
    const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
    const normalize = value => String(value || '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
    const localized = (value, lang = language()) => typeof value === 'string' ? value : Array.isArray(value)
        ? value.find(item => item.language === lang)?.value || value.find(item => item.language === 'en')?.value || value.find(item => item.language === 'et')?.value || '' : '';
    const categoryText = product => normalize([localized(product.category?.name), localized(product.category?.title), product.category?.slug, product.name].filter(Boolean).join(' '));
    const categoryMatches = (product, key) => (aliases[key] || [key]).some(term => categoryText(product).includes(normalize(term)));
    const categoryKey = product => Object.keys(categoryMap).find(key => categoryMatches(product, key)) || 'other';
    const categoryName = (key, lang = language()) => categoryMap[key]?.[lang === 'et' ? 1 : 0] || key.replaceAll('-', ' ').replace(/\b\w/g, letter => letter.toUpperCase());
    const productPrice = product => product.isOnSale && typeof product.salePrice === 'number' ? product.salePrice : product.price;
    const priceMatches = (product, band) => {
        const price = productPrice(product);
        return typeof price === 'number' && (band === 'low' ? price < 25000 : band === 'mid' ? price >= 25000 && price <= 75000 : price > 75000);
    };

    const filtered = () => state.products.filter(product => {
        const categories = !state.categories.size || [...state.categories].some(key => categoryMatches(product, key));
        const productBrand = localized(product.brand?.name);
        const brands = !state.brands.size || [...state.brands].some(value => normalize(value) === normalize(productBrand));
        const prices = !state.prices.size || [...state.prices].some(value => priceMatches(product, value));
        return categories && brands && prices;
    });
    const shortSpec = (label, lang) => {
        const found = specMap.find(([, , values]) => values.some(value => normalize(value) === normalize(label)));
        return found ? found[lang === 'et' ? 1 : 0] : String(label).replace(/\bmaximum\b/gi, 'Max').replace(/\bdigging\b/gi, 'Dig').replace(/\boperating\b|\boverall\b|\brated\b/gi, '').replace(/\s{2,}/g, ' ').trim();
    };
    const specs = (product, lang) => {
        const output = [], used = new Set();
        const add = (label, value) => {
            if (!label || !value || output.length >= 3) return;
            const compact = shortSpec(label, lang);
            if (used.has(normalize(compact))) return;
            used.add(normalize(compact));
            output.push([compact, String(value).replace(/\s*@\s*/g, ' / ')]);
        };
        add(localized(product.mainFeature?.label, lang), product.mainFeature?.value);
        (product.technicalInfo || []).flatMap(group => (group.table?.find(item => item.language === lang) || group.table?.find(item => item.language === 'en') || group.table?.[0])?.value?.rows || []).forEach(row => add(row.cells?.[0], row.cells?.[1]));
        return output;
    };
    const card = (product, lang) => {
        const text = words[lang], brand = localized(product.brand?.name, lang), category = localized(product.category?.name, lang) || localized(product.category?.title, lang) || text.all;
        const price = productPrice(product), priceText = typeof price === 'number' ? new Intl.NumberFormat(lang === 'et' ? 'et-EE' : 'en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price) : text.request;
        const specHTML = specs(product, lang).map(([label, value]) => `<div class="stat"><p class="sta" title="${escape(label)}">${escape(label)}:</p><p class="ans">${escape(value)}</p></div>`).join('');
        const link = `/pages/product-page.html?slug=${encodeURIComponent(product.slug)}`;
        return `<a href="${link}" class="product${product.isOnSale ? ' sale' : ''} card"><div class="image-wrap fc"><img src="${escape(product.image || '/assets/placeholder-1.png')}" alt="${escape(product.name)}" loading="lazy" decoding="async"></div><div class="content fc"><div class="tagss fr"><span>${escape(brand)}</span><span>/</span><span>${escape(category)}</span></div><div class="product-heading fr jsb"><h3>${escape(product.name)}</h3><p class="price">${escape(priceText)}</p></div>${specHTML ? `<div class="fr stats-wrap">${specHTML}</div>` : ''}<div class="card-actions fr g16"><span>${text.learn}</span><div class="sep"></div><span role="link" tabindex="0" data-enquire-url="${link}&amp;enquire=1">${text.enquire}</span></div></div></a>`;
    };

    const option = (type, value, label, active) => `<button type="button" class="fr fil g10${active ? ' active' : ''}" data-filter="${type}" data-value="${escape(value)}" aria-pressed="${active}"><span class="fr checkbox"><svg viewBox="0 0 7 6" fill="currentColor"><use href="#check"></use></svg></span><span>${escape(label)}</span></button>`;
    const group = (label, type, content, open) => `<div class="filters-wrap fc${open ? '' : ' close'}"><button type="button" class="asd fr jsb" aria-expanded="${open}"><span class="filt-cat">${escape(label)}</span><svg viewBox="0 0 9 9" class="svg" fill="currentColor"><use href="#plus"></use></svg></button><div class="wrap fc as g12"><div class="spacer"></div>${content}</div></div>`;
    const renderFilters = () => {
        const lang = language(), text = words[lang];
        const source = initialBrand
            ? state.products.filter(product => normalize(localized(product.brand?.name)) === normalize(initialBrand))
            : initialCategories.length
                ? state.products.filter(product => initialCategories.some(key => categoryMatches(product, key)))
                : state.products;
        const categoryOptions = [...new Set(source.map(categoryKey))].filter(key => key !== 'other').sort((a, b) => categoryName(a, lang).localeCompare(categoryName(b, lang))).map(key => option('categories', key, categoryName(key, lang), state.categories.has(key))).join('');
        const brands = [...new Set(source.map(product => localized(product.brand?.name, lang)).filter(Boolean))].sort().map(brand => option('brands', brand, brand, [...state.brands].some(value => normalize(value) === normalize(brand)))).join('');
        const priceOptions = ['low', 'mid', 'high'].filter(band => source.some(product => priceMatches(product, band))).map(band => option('prices', band, text[band], state.prices.has(band))).join('');
        drawer.querySelector('.main-wrap').innerHTML = group(text.category, 'categories', categoryOptions, true) + group(text.brand, 'brands', brands, true) + group(text.price, 'prices', priceOptions, false);
        drawer.querySelectorAll('.filters-wrap:not(.close) .wrap').forEach(wrap => wrap.style.maxHeight = `${wrap.scrollHeight}px`);
    };
    const selectedSet = type => state[type];
    const activeLabel = (type, value, lang) => type === 'categories' ? categoryName(value, lang) : type === 'prices' ? words[lang][value] : type === 'availability' ? words[lang][value] : value;
    const render = () => {
        const lang = language(), text = words[lang], results = filtered(), shown = results.slice(0, state.visible);
        grid.innerHTML = state.loading ? `<p class="catalogue-empty">${text.loading}</p>` : state.failed ? `<p class="catalogue-empty">${text.error}</p>` : shown.length ? shown.map(product => card(product, lang)).join('') : `<p class="catalogue-empty">${text.empty}</p>`;
        document.querySelector('.ammount').textContent = text.count(results.length);
        document.querySelector('.load-ammount').textContent = state.loading ? text.loading : text.loaded(Math.min(state.visible, results.length), results.length);
        const loadMore = document.querySelector('#catalogue-load-more'), hasMore = !state.loading && !state.failed && state.visible < results.length;
        loadMore.hidden = !hasMore; loadMore.style.display = hasMore ? '' : 'none';
        const chips = [['categories', state.categories], ['brands', state.brands], ['prices', state.prices]].flatMap(([type, set]) => [...set].map(value => [type, value]));
        document.querySelector('.act-filter-wrap').innerHTML = chips.map(([type, value]) => `<button type="button" class="filter-display fr g10" data-remove="${type}" data-value="${escape(value)}"><svg viewBox="0 0 9 9" fill="currentColor"><use href="#plus"></use></svg>${escape(activeLabel(type, value, lang))}</button>`).join('');
    };
    const context = lang => initialBrand ? [words[lang].brands, '/pages/all-brands.html', initialBrand] : industry && industryNames[lang]?.[industry] ? [words[lang].industries, '/pages/all-industries.html', industryNames[lang][industry]] : initialCategories.length === 1 ? [words[lang].categories, '/pages/categories.html', categoryName(initialCategories[0], lang)] : [null, null, words[lang].all];
    const renderContext = () => {
        const lang = language(), [parent, href, label] = context(lang), target = document.querySelector('.breadcrumbs .content');
        target.innerHTML = `<a href="/">${words[lang].home}</a><svg viewBox="0 0 5 8" fill="currentColor"><use href="#chevron-right"></use></svg>${parent ? `<a href="${href}">${parent}</a><svg viewBox="0 0 5 8" fill="currentColor"><use href="#chevron-right"></use></svg>` : ''}<a class="active">${escape(label)}</a>`;
        const heading = document.querySelector('.section-heading h1'); delete heading.dataset.i18n; heading.textContent = label; document.title = `${label} | ETR Tehnika`;
    };
    const syncURL = () => {
        const url = new URL(window.location.href);
        ['category', 'categories', 'brand', 'brands', 'price', 'availability'].forEach(key => url.searchParams.delete(key));
        const categories = [...state.categories];
        const brands = [...state.brands];
        if (categories.length === 1) url.searchParams.set('category', categories[0]);
        if (categories.length > 1) url.searchParams.set('categories', categories.join(','));
        if (brands.length === 1) url.searchParams.set('brand', brands[0]);
        if (brands.length > 1) url.searchParams.set('brands', brands.join(','));
        if (state.prices.size) url.searchParams.set('price', [...state.prices].join(','));
        window.history.replaceState({}, '', url);
    };
    const update = () => { state.visible = BATCH; renderFilters(); render(); };
    const toggle = (type, value) => {
        const set = selectedSet(type), found = [...set].find(item => normalize(item) === normalize(value));
        found !== undefined ? set.delete(found) : set.add(value);
        syncURL();
        update();
    };
    const setDrawer = open => { drawer.classList.toggle('active', open); drawer.setAttribute('aria-hidden', String(!open)); overlay?.classList.toggle('active', open); overlay?.classList.toggle('zindex', open); document.body.classList.toggle('filters-open', open); };

    drawer.addEventListener('click', event => {
        const heading = event.target.closest('.asd');
        if (heading) { const section = heading.closest('.filters-wrap'), wrap = section.querySelector('.wrap'), close = !section.classList.contains('close'); if (close) wrap.style.maxHeight = `${wrap.scrollHeight}px`; requestAnimationFrame(() => { section.classList.toggle('close', close); heading.setAttribute('aria-expanded', String(!close)); wrap.style.maxHeight = close ? '0px' : `${wrap.scrollHeight}px`; }); return; }
        const control = event.target.closest('[data-filter]'); if (control) toggle(control.dataset.filter, control.dataset.value);
    });
    document.querySelector('.act-filter-wrap').addEventListener('click', event => { const chip = event.target.closest('[data-remove]'); if (chip) toggle(chip.dataset.remove, chip.dataset.value); });
    document.querySelector('#show-filters').addEventListener('click', () => setDrawer(true));
    drawer.querySelector('.close-bt').addEventListener('click', () => setDrawer(false)); drawer.querySelector('.button').addEventListener('click', () => setDrawer(false)); overlay?.addEventListener('click', () => setDrawer(false));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') setDrawer(false); });
    document.querySelector('#catalogue-load-more').addEventListener('click', () => { state.visible += BATCH; render(); });
    document.addEventListener('etr:languagechange', () => { renderContext(); renderFilters(); render(); });

    renderContext(); renderFilters(); render();
    const fields = `{_id,name,price,salePrice,isOnSale,isBestseller,"slug":slug.current,"image":images[0].asset->url,"brand":brand->{name},"category":category->{name,title,"slug":slug.current},mainFeature,technicalInfo[]{table[]{language,value{rows[]{cells}}}}}`;
    const query = `*[_type=="product"&&!(_id in path("drafts.**"))&&defined(slug.current)]|order(name asc)${fields}`;
    fetch(`https://jqlee81t.api.sanity.io/v2026-10-21/data/query/production?query=${encodeURIComponent(query)}`)
        .then(response => { if (!response.ok) throw new Error(`Sanity HTTP ${response.status}`); return response.json(); })
        .then(data => { if (!Array.isArray(data.result)) throw new Error('Invalid Sanity response'); state.products = data.result.filter(product => product.slug && product.name); })
        .catch(error => { state.failed = true; console.error('ETR catalogue failed:', error); })
        .finally(() => { state.loading = false; renderFilters(); render(); });
})();
