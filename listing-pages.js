(() => {
    'use strict';

    const page = window.location.pathname.split('/').pop();
    const configs = {
        'all-products.html': {
            headingKey: 'allEquipmentHeading',
            heading: 'All Equipment',
            cards: []
        },
        'service-warranty.html': { headingKey: 'servicePageHeading', heading: 'Service & Warranty', cards: [] },
        'financing-options.html': { headingKey: 'financingPageHeading', heading: 'Financing Options', cards: [] },
        'trade-in-options.html': { headingKey: 'tradeInPageHeading', heading: 'Trade-In Options', cards: [] },
        'contact.html': { headingKey: 'contactPageHeading', heading: 'Contact Us', cards: [] },
        'product-page.html': { headingKey: 'allEquipmentHeading', heading: 'Equipment', cards: [] },
        'categories.html': {
            headingKey: 'allCategoriesHeading',
            heading: 'All Categories',
            cards: [
                ['categoryExcavators', 'categoryExcavatorsDescription', '/pages/all-products.html?category=excavators'],
                ['categoryLoaders', 'categoryLoadersDescription', '/pages/all-products.html?category=loaders'],
                ['categoryUtvs', 'categoryUtvsDescription', '/pages/all-products.html?category=utvs'],
                ['categoryAtvs', 'categoryAtvsDescription', '/pages/all-products.html?category=atvs'],
                ['categoryWoodworking', 'categoryWoodworkingDescription', '/pages/all-products.html?category=woodworking'],
                ['categoryGenerators', 'categoryGeneratorsDescription', '/pages/all-products.html?category=generators'],
                ['categoryCompressors', 'categoryCompressorsDescription', '/pages/all-products.html?category=compressors'],
                ['categoryGrasshoppers', 'categoryGrasshoppersDescription', '/pages/all-products.html?category=ground-reinforcement'],
                ['categoryAccessRamps', 'categoryAccessRampsDescription', '/pages/all-products.html?category=access-ramps'],
                ['categoryProtectionMats', 'categoryProtectionMatsDescription', '/pages/all-products.html?category=protection-mats']
            ]
        },
        'all-industries.html': {
            headingKey: 'allIndustriesHeading',
            heading: 'All Industries',
            cards: [
                ['industryConstruction', 'industryConstructionProducts', '/pages/all-products.html?industry=construction&categories=excavators,loaders,compressors,generators'],
                ['industryAgriculture', 'industryAgricultureProducts', '/pages/all-products.html?industry=agriculture&categories=loaders,atvs,utvs,access-ramps'],
                ['industryForestry', 'industryForestryProducts', '/pages/all-products.html?industry=forestry&categories=wood-chippers,loaders,utvs,generators'],
                ['industryInfrastructure', 'industryInfrastructureProducts', '/pages/all-products.html?industry=infrastructure&categories=excavators,compressors,generators,protection-mats'],
                ['industryLandscaping', 'industryLandscapingProducts', '/pages/all-products.html?industry=landscaping&categories=mini-excavators,compact-loaders,atvs,ground-reinforcement'],
                ['industryTransport', 'industryTransportProducts', '/pages/all-products.html?industry=transport&categories=loaders,utvs,access-ramps,protection-mats']
            ]
        },
        'all-brands.html': {
            headingKey: 'allBrandsHeading',
            heading: 'All Brands',
            cards: [
                [null, 'brandShantuiDescription', '/pages/all-products.html?brand=Shantui'],
                [null, 'brandHeraclesDescription', '/pages/all-products.html?brand=Heracles'],
                [null, 'brandLoncinDescription', '/pages/all-products.html?brand=Loncin'],
                [null, 'brandLantzmannDescription', '/pages/all-products.html?brand=Lantzmann'],
                [null, 'brandGeoworksDescription', '/pages/all-products.html?brand=Geoworks'],
                [null, 'brandBertzDescription', '/pages/all-products.html?brand=Bert%C5%BE'],
                [null, 'brandCastloadersDescription', '/pages/all-products.html?brand=Castloaders'],
                [null, 'brandAflatekDescription', '/pages/all-products.html?brand=Aflatek']
            ]
        }
    };
    const config = configs[page];
    if (!config) return;

    const nav = `
        <nav class="tra">
            <div class="content ch fr g44">
                <a href="/" class="fr logo" aria-label="ETR Tehnika home"><svg viewBox="0 0 101 14" fill="currentColor"><use href="#logo"></use></svg></a>
                <div class="links-wrap"><div class="links fr g24">
                    <a href="/pages/all-products.html" data-i18n="navMachinery">Machinery</a>
                    <a href="/pages/all-brands.html" data-i18n="navBrands">Brands</a>
                    <a href="/pages/all-industries.html" data-i18n="navIndustries">Industries</a>
                    <a href="/pages/service-warranty.html" data-i18n="navServicing">Servicing</a>
                    <a href="/pages/about.html" data-i18n="navAbout">About Us</a>
                    <a href="/pages/contact.html" data-i18n="navContact">Contact</a>
                </div></div>
                <div class="fr g14"><button id="language-switcher" class="fr jc" type="button" aria-label="Choose language" aria-haspopup="true" aria-expanded="false" aria-controls="language-select"><svg viewBox="0 0 13 13" fill="currentColor"><use href="#globe"></use></svg></button></div>
                <button class="yes-tablet menu-button" type="button" aria-expanded="false" aria-label="Open navigation" aria-controls="mobile-navigation"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" fill="none" viewBox="0 0 16 12"><path fill="#010204" d="M16 0H0v1.37143h16zM16 5.02857H0V6.4h16zM16 10.0571H0v1.3715h16z"></path></svg></button>
            </div>
            <div class="language-select tra" id="language-select" aria-hidden="true"><button class="active" type="button" data-language="en" lang="en">English</button><button type="button" data-language="et" lang="et">Eesti</button></div>
        </nav>
        <div class="background-blur"></div>
        <div class="nav-menu-tablet ch yes-tablet" id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Main navigation"><div class="wrap">
            <div class="top fr jsb"><a href="/" class="fr logo" aria-label="ETR Tehnika home"><svg viewBox="0 0 101 14" fill="currentColor"><use href="#logo"></use></svg></a><button class="icon close-bt" type="button" aria-label="Close navigation"><svg viewBox="0 0 9 9" fill="currentColor"><use href="#plus"></use></svg></button></div>
            <div class="link fc"><a href="/pages/all-products.html" data-i18n="navMachinery">Machinery</a><a href="/pages/all-brands.html" data-i18n="navBrands">Brands</a><a href="/pages/all-industries.html" data-i18n="navIndustries">Industries</a><a href="/pages/service-warranty.html" data-i18n="navServicing">Servicing</a><a href="/pages/financing-options.html" data-i18n="navFinance">Finance</a><a href="/pages/about.html" data-i18n="navAbout">About Us</a><a href="/pages/contact.html" data-i18n="navContact">Contact</a></div>
            <a href="/pages/contact.html" class="button" data-i18n="navMessage">Send Us A Message</a>
        </div></div>`;

    const breadcrumbs = document.querySelector('.breadcrumbs');
    if (!document.querySelector('nav')) breadcrumbs?.insertAdjacentHTML('beforebegin', nav);
    const breadcrumbLinks = breadcrumbs?.querySelectorAll('a');
    if (breadcrumbLinks?.[0]) {
        breadcrumbLinks[0].href = '/';
        breadcrumbLinks[0].dataset.i18n = 'breadcrumbHome';
    }
    if (breadcrumbLinks?.[1]) {
        breadcrumbLinks[1].href = window.location.pathname;
        breadcrumbLinks[1].dataset.i18n = config.headingKey;
    }
    const heading = document.querySelector('.section-heading h1');
    if (heading) heading.dataset.i18n = config.headingKey;

    const cards = [...document.querySelectorAll('#categories-section > .card, #brands-grid-section > .filter-card')];
    cards.forEach((card, index) => {
        const item = config.cards[index];
        if (!item) return;
        const [titleKey, descriptionKey, href] = item;
        card.href = href;
        const title = card.querySelector(page === 'categories.html' ? 'span' : 'h3');
        const description = card.querySelector(page === 'categories.html' ? 'h3' : 'p');
        if (title && titleKey) title.dataset.i18n = titleKey;
        if (description) description.dataset.i18n = descriptionKey;
    });

    const ways = document.querySelector('#way-to-buy');
    if (ways) {
        const waysHeading = ways.querySelector('h2');
        if (waysHeading) waysHeading.dataset.i18n = 'waysHeading';
        const expert = ways.querySelector('.button-arrow');
        if (expert) {
            expert.href = '/pages/contact.html';
            expert.insertAdjacentHTML('beforeend', '<span data-i18n="speakExpert">Speak To An Expert</span>');
            [...expert.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).forEach(node => node.remove());
        }
        const waysCards = ways.querySelectorAll('.black-card');
        if (waysCards[0]) {
            waysCards[0].href = '/pages/trade-in-options.html';
            waysCards[0].querySelector('h3').dataset.i18n = 'tradeInTitle';
            waysCards[0].querySelector('p').dataset.i18n = 'tradeInText';
        }
        if (waysCards[1]) {
            waysCards[1].href = '/pages/financing-options.html';
            waysCards[1].querySelector('h3').dataset.i18n = 'financingTitle';
            waysCards[1].querySelector('p').dataset.i18n = 'financingText';
        }
    }

    const cta = document.querySelector('#call-to-action');
    if (cta) {
        cta.querySelector('h2').dataset.i18n = 'ctaHeading';
        const button = cta.querySelector('.button');
        button.href = '/pages/contact.html';
        button.dataset.i18n = 'speakExpert';
    }

    const footer = document.querySelector('footer');
    if (footer) footer.outerHTML = `
        <footer class="background-black ch">
            <a href="/" class="logo fr"><svg viewBox="0 0 101 14" fill="currentColor"><use href="#logo"></use></svg></a>
            <div class="links-wrap fr as g100">
                <div class="links tra fc g12"><h3 data-i18n="footerEquipment">Equipment</h3><a href="/pages/all-products.html?category=excavators" data-i18n="shopExcavators">Excavators</a><a href="/pages/all-products.html?category=generators" data-i18n="categoryGenerators">Generators</a><a href="/pages/all-products.html?category=loaders" data-i18n="shopLoaders">Loaders</a><a href="/pages/categories.html" data-i18n="footerAllCategories">All Categories</a></div>
                <div class="links mobile-no tra fc g12"><h3 data-i18n="navBrands">Brands</h3><a href="/pages/all-products.html?brand=Shantui">Shantui</a><a href="/pages/all-products.html?brand=Heracles">Heracles</a><a href="/pages/all-products.html?brand=Lantzmann">Lantzmann</a><a href="/pages/all-brands.html" data-i18n="footerAllBrands">All Brands</a></div>
                <div class="links tra fc g12"><h3 data-i18n="footerResources">Resources</h3><a href="/pages/service-warranty.html" data-i18n="footerService">Service & Warranty</a><a href="/pages/financing-options.html" data-i18n="footerFinancing">Financing Options</a><a href="/pages/trade-in-options.html" data-i18n="footerTradeIn">Trade-In Options</a></div>
                <div class="links tra fc g12"><h3>ETR</h3><a href="/pages/about.html" data-i18n="footerAbout">About ETR</a><a href="/pages/contact.html" data-i18n="footerContact">Contact Us</a><a href="/pages/contact.html" data-i18n="footerLocation">Our Location</a></div>
            </div>
            <div class="socials-wrap fr g28"><a href="https://www.facebook.com/ETRTEHNIKA" class="fr" target="_blank" rel="noopener noreferrer"><img src="/assets/facebook.svg" alt="Facebook"></a><a href="https://www.youtube.com/@ETRTEHNIKA" class="fr" target="_blank" rel="noopener noreferrer"><img class="youtube" src="/assets/youtube.svg" alt="YouTube"></a></div>
            <div class="seperator fr jsb"><span data-i18n="footerCopyright">© 2026 ETR Tehnika. All rights reserved.</span></div>
        </footer>`;
})();
