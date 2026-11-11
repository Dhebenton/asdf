(() => {
    'use strict';

    const container = document.querySelector('#catalogue-products');
    if (!container) return;

    const PROJECT_ID = 'jqlee81t';
    const DATASET = 'production';
    const API_VERSION = '2026-10-21';
    const params = new URLSearchParams(window.location.search);
    const requestedCategories = (params.get('categories') || params.get('category') || '')
        .split(',')
        .map(value => value.trim().toLocaleLowerCase())
        .filter(Boolean);
    const requestedBrand = (params.get('brand') || '').trim().toLocaleLowerCase();

    const fields = `{
        _id, name, price, salePrice, isOnSale,
        "slug": slug.current,
        "image": images[0].asset->url,
        "brand": brand->{name},
        "category": category->{name, title, "slug": slug.current},
        mainFeature,
        technicalInfo[]{table[]{language, value{rows[]{cells}}}}
    }`;
    const query = `*[
        _type == "product" &&
        !(_id in path("drafts.**")) &&
        defined(slug.current)
    ] | order(name asc) ${fields}`;
    const endpoint = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;

    const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
    const normalize = value => String(value || '')
        .toLocaleLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, ' ')
        .trim();
    const localized = value => {
        if (typeof value === 'string') return value;
        if (!Array.isArray(value)) return '';
        return value.find(item => item.language === 'en')?.value
            || value.find(item => item.language === 'et')?.value
            || '';
    };

    const aliases = {
        excavators: ['excavator', 'ekskavaator'],
        loaders: ['loader', 'laadur'],
        compressors: ['compressor', 'kompressor'],
        generators: ['generator', 'generaator'],
        woodworking: ['wood', 'forestry', 'chipper', 'sawmill', 'puit', 'mets', 'hakkur'],
        'wood-chippers': ['wood chipper', 'chipper', 'hakkur'],
        'mini-excavators': ['mini excavator', 'miniekskavaator'],
        'compact-loaders': ['compact loader', 'kompaktlaadur'],
        'access-ramps': ['access ramp', 'loading ramp', 'pealesõiduramp'],
        'protection-mats': ['protection mat', 'ground protection', 'kaitsematt'],
        'ground-reinforcement': ['ground reinforcement', 'ground mat', 'pinnasetugevdus'],
        utvs: ['utv', 'utility vehicle', 'side by side'],
        atvs: ['atv', 'quad']
    };

    const categoryText = product => normalize([
        localized(product.category?.name),
        localized(product.category?.title),
        product.category?.slug,
        product.name
    ].filter(Boolean).join(' '));

    const matchesCategory = product => !requestedCategories.length || requestedCategories.some(category =>
        (aliases[category] || [category]).some(term => categoryText(product).includes(normalize(term)))
    );
    const matchesBrand = product => !requestedBrand
        || normalize(localized(product.brand?.name)) === normalize(requestedBrand);

    const compactLabels = [
        ['Weight', ['operating weight', 'operating mass', 'machine weight']],
        ['Max Dig Depth', ['maximum digging depth', 'max digging depth', 'digging depth']],
        ['Max Dig Height', ['maximum digging height', 'max digging height', 'digging height']],
        ['Dig Reach', ['maximum digging reach', 'max digging reach', 'digging reach', 'maximum digging radius', 'digging radius']],
        ['Power', ['rated power', 'engine power', 'motor power', 'prime power']],
        ['Bucket', ['bucket capacity', 'bucket volume']],
        ['Load', ['rated load', 'rated capacity', 'lifting capacity', 'payload capacity', 'load capacity']],
        ['Lift Height', ['maximum lifting height', 'max lifting height', 'lifting height']],
        ['Speed', ['travel speed', 'maximum speed', 'max speed']],
        ['Engine', ['engine displacement', 'engine capacity', 'displacement']],
        ['Clearance', ['ground clearance']],
        ['Fuel', ['fuel capacity', 'fuel tank capacity', 'fuel tank']],
        ['Towing', ['towing capacity']],
        ['Capacity', ['processing capacity', 'production capacity', 'tank capacity']],
        ['Diameter', ['maximum log diameter', 'max diameter', 'cutting diameter']],
        ['Voltage', ['rated voltage', 'output voltage']],
        ['Frequency', ['frequency']],
        ['Pressure', ['working pressure', 'operating pressure', 'maximum pressure']],
        ['Airflow', ['free air delivery', 'air delivery', 'air flow']],
        ['Size', ['overall dimensions', 'panel size', 'dimensions']],
        ['Length', ['overall length', 'total length']],
        ['Width', ['overall width', 'total width']],
        ['Height', ['overall height', 'total height']],
        ['Thickness', ['thickness']],
        ['Material', ['material']]
    ];

    const compactLabel = label => {
        const normalized = normalize(label);
        const match = compactLabels.find(([, aliases]) => aliases.some(alias => normalized === normalize(alias)));
        if (match) return match[0];
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

    const getSpecs = product => {
        const selected = [];
        const add = (label, value) => {
            if (!label || !value || selected.length >= 3) return;
            selected.push({
                label: compactLabel(label),
                value: String(value).replace(/\s*@\s*/g, ' / ')
            });
        };
        add(localized(product.mainFeature?.label), product.mainFeature?.value);
        (product.technicalInfo || []).flatMap(group => {
            const table = group.table?.find(item => item.language === 'en') || group.table?.[0];
            return table?.value?.rows || [];
        }).forEach(row => add(row.cells?.[0], row.cells?.[1]));
        return selected;
    };

    const formatPrice = value => typeof value === 'number'
        ? new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
        : 'Price on request';

    const createCard = product => {
        const category = localized(product.category?.name) || localized(product.category?.title) || 'Equipment';
        const brand = localized(product.brand?.name) || '';
        const price = product.isOnSale && typeof product.salePrice === 'number' ? product.salePrice : product.price;
        const specs = getSpecs(product).map(spec => `
            <div class="stat">
                <p class="sta">${escapeHTML(spec.label)}:</p>
                <p class="ans">${escapeHTML(spec.value)}</p>
            </div>`).join('');
        return `
            <a href="/pages/product-page.html?slug=${encodeURIComponent(product.slug)}" class="product card">
                <div class="image-wrap fc">
                    <img src="${escapeHTML(product.image || '/assets/placeholder-1.png')}" alt="${escapeHTML(product.name)}" loading="lazy" decoding="async">
                </div>
                <div class="content fc">
                    <div class="tagss fr"><span>${escapeHTML(brand)}</span><span>/</span><span>${escapeHTML(category)}</span></div>
                    <div class="product-heading fr jsb">
                        <h3>${escapeHTML(product.name)}</h3>
                        <p class="price">${escapeHTML(formatPrice(price))}</p>
                    </div>
                    ${specs ? `<div class="fr stats-wrap">${specs}</div>` : ''}
                    <div class="card-actions fr g16"><span>Learn More</span><div class="sep"></div><span>Enquire</span></div>
                </div>
            </a>`;
    };

    const updateHeading = count => {
        const amount = document.querySelector('#shop-all-grid .ammount');
        if (amount) amount.textContent = `${count} Equipment`;
        const display = document.querySelector('#shop-all-grid .filter-display');
        if (display && requestedCategories.length) {
            display.childNodes[display.childNodes.length - 1].textContent = ` ${requestedCategories.join(', ')}`;
        } else if (display && requestedBrand) {
            display.childNodes[display.childNodes.length - 1].textContent = ` ${params.get('brand')}`;
        }
    };

    container.innerHTML = '<p class="catalogue-empty">Loading equipment…</p>';
    fetch(endpoint)
        .then(response => {
            if (!response.ok) throw new Error(`Sanity HTTP ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data.result)) throw new Error('Invalid Sanity response');
            const products = data.result.filter(product => product.slug && product.name && matchesCategory(product) && matchesBrand(product));
            updateHeading(products.length);
            container.innerHTML = products.length
                ? products.map(createCard).join('')
                : '<p class="catalogue-empty">No equipment matches this selection.</p>';
        })
        .catch(error => {
            console.error('ETR catalogue failed to load:', error);
            container.innerHTML = '<p class="catalogue-empty">Unable to load equipment.</p>';
        });
})();
