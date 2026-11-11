(() => {
    'use strict';

    const container = document.querySelector('#promotions-slider #product-cards');
    if (!container) return;

    const PROJECT_ID = 'jqlee81t';
    const DATASET = 'production';
    const API_VERSION = '2026-10-21';

    const fields = `{
        _id, name, price, salePrice, isBestseller, isOnSale,
        "slug": slug.current,
        "image": images[0].asset->url,
        "brand": brand->{name},
        "category": category->{name, title, "slug": slug.current},
        cardDescription,
        mainFeature,
        technicalInfo[]{table[]{language, value{rows[]{cells}}}}
    }`;

    const query = `*[
        _type == "product" &&
        !(_id in path("drafts.**")) &&
        defined(slug.current) &&
        (isBestseller == true || isOnSale == true)
    ] | order(isOnSale desc, isBestseller desc, name asc) ${fields}`;

    const endpoint = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;

    const copy = {
        en: {
            promotion: 'Promotion',
            bestseller: 'Best Seller',
            priceOnRequest: 'Price on request',
            learnMore: 'Learn More',
            enquire: 'Enquire',
            loading: 'Loading equipment…',
            empty: 'No promotional equipment is available right now.',
            error: 'Promotional equipment could not be loaded.',
            shopEmpty: 'No equipment is available in this category.',
            shopError: 'Equipment could not be loaded.',
            loadedOf: (loaded, total) => `Loaded ${loaded} of ${total} equipment`
        },
        et: {
            promotion: 'Pakkumine',
            bestseller: 'Populaarne',
            priceOnRequest: 'Hind päringul',
            learnMore: 'Vaata lähemalt',
            enquire: 'Küsi pakkumist',
            loading: 'Laadin tehnikat…',
            empty: 'Hetkel ei ole kampaaniatooteid saadaval.',
            error: 'Kampaaniatooteid ei õnnestunud laadida.',
            shopEmpty: 'Selles kategoorias pole tehnikat saadaval.',
            shopError: 'Tehnika laadimine ebaõnnestus.',
            loadedOf: (loaded, total) => `Laaditud ${loaded}/${total}`
        }
    };

    // Match authored EN/ET labels to compact card-safe names.
    const labelAliases = [
        { terms: ['operating weight', 'operating mass', 'machine weight', 'töökaal', 'mass'], en: 'Weight', et: 'Kaal' },
        { terms: ['rated power', 'engine power', 'motor power', 'nimivõimsus', 'mootori võimsus'], en: 'Power', et: 'Võimsus' },
        { terms: ['maximum digging depth', 'max digging depth', 'digging depth', 'maksimaalne kaevesügavus', 'kaevesügavus'], en: 'Max Dig Depth', et: 'Kaevesügavus' },
        { terms: ['maximum digging height', 'max digging height', 'digging height', 'maksimaalne kaeve kõrgus'], en: 'Max Dig Height', et: 'Kaevekõrgus' },
        { terms: ['maximum digging reach', 'max digging reach', 'digging reach', 'maximum digging radius', 'digging radius', 'kaeveulatus'], en: 'Dig Reach', et: 'Kaeveulatus' },
        { terms: ['bucket capacity', 'bucket volume', 'kopa maht'], en: 'Bucket', et: 'Kopp' },
        { terms: ['rated load', 'lifting capacity', 'payload capacity', 'load capacity', 'tõstevõime', 'nimikoormus'], en: 'Load', et: 'Tõstejõud' },
        { terms: ['maximum lifting height', 'max lifting height', 'lifting height', 'maksimaalne tõstekõrgus', 'tõstekõrgus'], en: 'Lift height', et: 'Tõstekõrgus' },
        { terms: ['engine displacement', 'displacement', 'engine capacity', 'töömaht'], en: 'Engine', et: 'Mootor' },
        { terms: ['processing capacity', 'production capacity', 'capacity', 'jõudlus', 'tootlikkus'], en: 'Capacity', et: 'Jõudlus' },
        { terms: ['working pressure', 'operating pressure', 'maximum pressure', 'pressure', 'töörõhk', 'rõhk'], en: 'Pressure', et: 'Rõhk' },
        { terms: ['free air delivery', 'air delivery', 'air flow', 'airflow', 'õhuvool'], en: 'Airflow', et: 'Õhuvool' },
        { terms: ['overall dimensions', 'dimensions', 'mõõtmed'], en: 'Size', et: 'Mõõtmed' },
        { terms: ['overall length', 'total length', 'length', 'pikkus'], en: 'Length', et: 'Pikkus' },
        { terms: ['overall width', 'total width', 'width', 'laius'], en: 'Width', et: 'Laius' },
        { terms: ['travel speed', 'maximum speed', 'max speed', 'speed', 'sõidukiirus', 'kiirus'], en: 'Speed', et: 'Kiirus' },
        { terms: ['fuel capacity', 'fuel tank capacity', 'fuel tank', 'kütusepaak'], en: 'Fuel', et: 'Kütus' },
        { terms: ['rated voltage', 'output voltage', 'voltage', 'nimipinge', 'pinge'], en: 'Voltage', et: 'Pinge' },
        { terms: ['ground clearance', 'kliirens'], en: 'Clearance', et: 'Kliirens' },
        { terms: ['towing capacity', 'haakevõime'], en: 'Towing', et: 'Haakevõime' },
        { terms: ['maximum log diameter', 'max diameter', 'cutting diameter', 'läbimõõt'], en: 'Diameter', et: 'Läbimõõt' },
        { terms: ['frequency', 'sagedus'], en: 'Frequency', et: 'Sagedus' },
        { terms: ['overall height', 'total height', 'height', 'kõrgus'], en: 'Height', et: 'Kõrgus' },
        { terms: ['thickness', 'paksus'], en: 'Thickness', et: 'Paksus' },
        { terms: ['material', 'materjal'], en: 'Material', et: 'Materjal' }
    ];

    const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);

    const normalize = value => String(value || '')
        .toLocaleLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, ' ')
        .trim();

    const currentLanguage = () => document.documentElement.lang === 'et' ? 'et' : 'en';

    const localized = (value, selected = currentLanguage()) => {
        if (typeof value === 'string') return value;
        if (!Array.isArray(value)) return '';

        return value.find(item => item.language === selected)?.value
            || value.find(item => item.language === 'en')?.value
            || value.find(item => item.language === 'et')?.value
            || '';
    };

    const shortLabel = (label, selected) => {
        const normalized = normalize(label);
        const alias = labelAliases.find(item => item.terms.some(term => normalized === normalize(term)));
        if (alias) return alias[selected];

        return String(label)
            .replace(/\bmaximum\b/gi, 'Max')
            .replace(/\bdigging\b/gi, 'Dig')
            .replace(/\boperating\b/gi, '')
            .replace(/\boverall\b/gi, '')
            .replace(/\brated\b/gi, '')
            .replace(/\bat ground level\b/gi, '')
            .replace(/\s{2,}/g, ' ')
            .trim();
    };

    const technicalSpecs = (product, selected) => (product.technicalInfo || [])
        .flatMap(group => {
            const table = group.table?.find(item => item.language === selected)
                || group.table?.find(item => item.language === 'en')
                || group.table?.find(item => item.language === 'et');

            return table?.value?.rows || [];
        })
        .map(row => ({ label: row.cells?.[0], value: row.cells?.[1] }))
        .filter(spec => spec.label && spec.value && !['-', 'n a', 'none'].includes(normalize(spec.value)));

    const selectSpecs = (product, selected) => {
        const selectedSpecs = [];
        const usedLabels = new Set();

        const add = (label, value) => {
            if (!label || !value || selectedSpecs.length >= 3) return;

            const compactLabel = shortLabel(label, selected);
            const key = normalize(compactLabel);
            const cleanValue = String(value).trim().replace(/\s*@\s*/g, ' / ');

            if (usedLabels.has(key) || cleanValue.length > 22) return;

            usedLabels.add(key);
            selectedSpecs.push({ label: compactLabel, value: cleanValue });
        };

        // Sanity's curated main feature always gets first priority.
        add(localized(product.mainFeature?.label, selected), product.mainFeature?.value);

        const specs = technicalSpecs(product, selected);

        // Prefer meaningful card specs before falling back to short table rows.
        labelAliases.forEach(alias => {
            const match = specs.find(spec => alias.terms.some(term => normalize(spec.label) === normalize(term)));
            if (match) add(match.label, match.value);
        });

        specs.forEach(spec => add(spec.label, spec.value));
        return selectedSpecs;
    };

    const formatPrice = (value, selected) => typeof value === 'number'
        ? new Intl.NumberFormat(selected === 'et' ? 'et-EE' : 'en-IE', {
            style: 'currency', currency: 'EUR', maximumFractionDigits: 0
        }).format(value)
        : copy[selected].priceOnRequest;

    const createCard = (product, selected) => {
        const text = copy[selected];
        const category = localized(product.category?.name, selected)
            || localized(product.category?.title, selected)
            || (selected === 'et' ? 'Tehnika' : 'Equipment');
        const brand = localized(product.brand?.name, selected) || product.brand?.name || '';
        const specs = selectSpecs(product, selected);
        const onSale = product.isOnSale === true;
        const tag = onSale ? text.promotion : product.isBestseller ? text.bestseller : '';
        const shownPrice = onSale && typeof product.salePrice === 'number' ? product.salePrice : product.price;
        const link = `/pages/product-page.html?slug=${encodeURIComponent(product.slug)}`;

        const specsHTML = specs.map(spec => `
            <div class="stat">
                <p class="sta" title="${escapeHTML(spec.label)}">${escapeHTML(spec.label)}:</p>
                <p class="ans" title="${escapeHTML(spec.value)}">${escapeHTML(spec.value)}</p>
            </div>
        `).join('');

        return `
            <a href="${escapeHTML(link)}" class="product${onSale ? ' sale' : ''} card">
                <div class="image-wrap fc">
                    ${tag ? `<span class="sale-tag">${escapeHTML(tag)}</span>` : ''}
                    <img src="${escapeHTML(product.image || '/assets/placeholder-1.png')}" alt="${escapeHTML(product.name)}" loading="lazy" decoding="async">
                </div>
                <div class="content fc">
                    <div class="tagss fr"><span>${escapeHTML(brand)}</span><span>/</span><span>${escapeHTML(category)}</span></div>
                    <div class="product-heading fr jsb">
                        <h3>${escapeHTML(product.name)}</h3>
                        <p class="price">${escapeHTML(formatPrice(shownPrice, selected))}</p>
                    </div>
                    ${specsHTML ? `<div class="fr stats-wrap">${specsHTML}</div>` : ''}
                    <div class="card-actions fr g16">
                        <span>${escapeHTML(text.learnMore)}</span>
                        <div class="sep"></div>
                        <span role="link" tabindex="0" data-enquire-url="${escapeHTML(link)}&amp;enquire=1">${escapeHTML(text.enquire)}</span>
                    </div>
                </div>
            </a>
        `;
    };

    let products = [];
    let loadFailed = false;
    let loading = true;

    const render = () => {
        const selected = currentLanguage();
        container.setAttribute('aria-busy', String(loading));

        if (loading) {
            container.innerHTML = `<p class="products-message">${escapeHTML(copy[selected].loading)}</p>`;
        } else if (loadFailed) {
            container.innerHTML = `<p class="products-message">${escapeHTML(copy[selected].error)}</p>`;
        } else if (!products.length) {
            container.innerHTML = `<p class="products-message">${escapeHTML(copy[selected].empty)}</p>`;
        } else {
            container.innerHTML = products.map(product => createCard(product, selected)).join('');
        }

        document.dispatchEvent(new CustomEvent('productsLoaded', { detail: { container } }));
    };

    const load = async () => {
        render();

        try {
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error(`Sanity HTTP ${response.status}`);

            const data = await response.json();
            if (!Array.isArray(data.result)) throw new Error('Invalid Sanity response');

            products = data.result.filter(product => product.slug && product.name);
        } catch (error) {
            loadFailed = true;
            console.error('ETR promotions failed to load:', error);
        }

        loading = false;
        render();
    };

    const initializeShop = () => {
        const section = document.querySelector('#shop-all');
        const grid = section?.querySelector('#shop-by');
        if (!section || !grid) return;

        const tabs = [...section.querySelectorAll('.tab[data-category]')];
        const counter = section.querySelector('.load-ammount');
        const loadMore = section.querySelector('.align .button');
        const slider = grid.closest('[data-slider]');
        const mobileMedia = window.matchMedia('(max-width: 774px)');
        const batchSize = 3;
        const mobileLimit = 9;
        let shopProducts = [];
        let activeCategory = tabs.find(tab => tab.classList.contains('active'))?.dataset.category || 'excavators';
        let visibleCount = batchSize;
        let failed = false;
        let shopLoading = true;

        const categoryText = product => normalize([
            localized(product.category?.name),
            localized(product.category?.title),
            product.category?.slug,
            product.name
        ].filter(Boolean).join(' '));

        const categoryAliases = {
            excavators: ['excavator', 'ekskavaator'],
            loaders: ['loader', 'laadur'],
            bandsaw: ['bandsaw', 'band saw', 'sawmill', 'saeraam', 'saekaat'],
            utvs: ['utv', 'side by side', 'side-by-side', 'utility vehicle'],
            atvs: ['atv', 'quad']
        };

        const filteredProducts = () => shopProducts.filter(product =>
            (categoryAliases[activeCategory] || []).some(term => categoryText(product).includes(normalize(term)))
        );

        const renderShop = (resetSlider = false) => {
            const selected = currentLanguage();
            const filtered = filteredProducts();
            const limit = mobileMedia.matches ? mobileLimit : visibleCount;
            const shown = filtered.slice(0, limit);

            if (shopLoading) {
                grid.innerHTML = `<p class="shop-empty">${escapeHTML(copy[selected].loading)}</p>`;
            } else if (failed) {
                grid.innerHTML = `<p class="shop-empty">${escapeHTML(copy[selected].shopError)}</p>`;
            } else if (!shown.length) {
                grid.innerHTML = `<p class="shop-empty">${escapeHTML(copy[selected].shopEmpty)}</p>`;
            } else {
                grid.innerHTML = shown.map(product => createCard(product, selected)).join('');
            }

            const loaded = Math.min(limit, filtered.length);
            if (counter) counter.textContent = shopLoading ? copy[selected].loading : copy[selected].loadedOf(loaded, filtered.length);

            if (loadMore) {
                const hasMore = !shopLoading && !failed && !mobileMedia.matches && visibleCount < filtered.length;
                loadMore.hidden = !hasMore;
                loadMore.style.display = hasMore ? '' : 'none';
            }

            if (resetSlider && slider) {
                document.dispatchEvent(new CustomEvent('sliderReset', { detail: { container: slider } }));
            }
            document.dispatchEvent(new CustomEvent('productsLoaded', { detail: { container: grid } }));
        };

        tabs.forEach(tab => {
            tab.setAttribute('aria-pressed', String(tab.dataset.category === activeCategory));
            tab.addEventListener('click', () => {
                activeCategory = tab.dataset.category;
                visibleCount = batchSize;
                tabs.forEach(button => {
                    const active = button === tab;
                    button.classList.toggle('active', active);
                    button.setAttribute('aria-pressed', String(active));
                });
                renderShop(true);
            });
        });

        loadMore?.addEventListener('click', () => {
            visibleCount += batchSize;
            renderShop();
        });
        mobileMedia.addEventListener('change', () => renderShop(true));
        document.addEventListener('etr:languagechange', () => renderShop(true));

        const allProductsQuery = `*[
            _type == "product" &&
            !(_id in path("drafts.**")) &&
            defined(slug.current)
        ] | order(name asc) ${fields}`;
        const allProductsEndpoint = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(allProductsQuery)}`;

        renderShop();
        fetch(allProductsEndpoint)
            .then(response => {
                if (!response.ok) throw new Error(`Sanity HTTP ${response.status}`);
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data.result)) throw new Error('Invalid Sanity response');
                shopProducts = data.result.filter(product => product.slug && product.name);
            })
            .catch(error => {
                failed = true;
                console.error('ETR shop by category failed to load:', error);
            })
            .finally(() => {
                shopLoading = false;
                renderShop(true);
            });
    };

    document.addEventListener('etr:languagechange', render);
    initializeShop();
    load();
})();
