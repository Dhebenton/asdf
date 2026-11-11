(() => {
    'use strict';

    const track = document.querySelector('#teams-slider [data-slider-track]');
    if (!track) return;

    const people = [
        {
            name: 'Joosep Hein',
            teamKey: 'teamAfterSales',
            team: 'After-Sales',
            descriptionKey: 'teamJoosepDescription',
            description: 'Joosep Hein oversees after-sales service, helping customers with equipment maintenance, technical support, and assistance.',
            roleKey: 'teamJoosepRole',
            role: 'After-Sales Service Manager',
            phoneHref: '+37256831391',
            phone: '+372 5683 1391',
            email: 'joosep@etrtehnika.ee'
        },
        {
            name: 'Tanel-Patrick Epner',
            teamKey: 'teamSales',
            team: 'Sales',
            descriptionKey: 'teamTanelDescription',
            description: 'Tanel-Patrick Epner leads sales operations, coordinating customer enquiries, relationships, and machinery purchasing across ETR.',
            roleKey: 'teamTanelRole',
            role: 'Sales Director',
            phoneHref: '+37253425735',
            phone: '+372 5342 5735',
            email: 'tanel.epner@etrtehnika.ee'
        },
        {
            name: 'Maris Ristal',
            teamKey: 'teamProductSales',
            team: 'Product & Sales',
            descriptionKey: 'teamMarisDescription',
            description: 'Maris Ristal manages product and sales enquiries, helping customers compare machinery, specifications, and purchasing requirements.',
            roleKey: 'teamProductSalesRole',
            role: 'Product & Sales Manager',
            phoneHref: '+3725547367',
            phone: '+372 5547367',
            email: 'Maris.Ristal@etrtehnika.ee'
        },
        {
            name: 'Ave Pärn',
            teamKey: 'teamProductSales',
            team: 'Product & Sales',
            descriptionKey: 'teamAveDescription',
            description: 'Ave Pärn handles product and sales enquiries, assisting customers with equipment selection, information, and purchase arrangements.',
            roleKey: 'teamProductSalesRole',
            role: 'Product & Sales Manager',
            phoneHref: '+3725571526',
            phone: '+372 5571526',
            email: 'Ave.parn@etrtehnika.ee'
        }
    ];

    const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);

    track.innerHTML = people.map(person => `
        <div class="tra teams-card">
            <div class="image-wrap fr">
                <img src="/assets/person-placeholder.png" alt="${escapeHTML(person.name)}" loading="lazy" decoding="async">
                <div class="cover tra fc">
                    <div class="fr jsb">
                        <span class="position" data-i18n="${person.teamKey}">${escapeHTML(person.team)}</span>
                        <div class="icon tra fr jc">
                            <svg viewBox="0 0 9 9" fill="currentColor"><use href="#plus"></use></svg>
                        </div>
                    </div>
                    <p class="name heading">${escapeHTML(person.name)}</p>
                    <p class="des" data-i18n="${person.descriptionKey}">${escapeHTML(person.description)}</p>
                    <div class="contact-wrap fr g16">
                        <div class="heading fc g16">
                            <span class="heading" data-i18n="phoneLabel">Phone:</span>
                            <span class="heading" data-i18n="emailLabel">Email:</span>
                        </div>
                        <div class="fc g16">
                            <a href="tel:${person.phoneHref}" class="ans">${escapeHTML(person.phone)}</a>
                            <a href="mailto:${escapeHTML(person.email)}" class="ans">${escapeHTML(person.email)}</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="fc bot g10">
                <h3>${escapeHTML(person.name)}</h3>
                <p class="position" data-i18n="${person.roleKey}">${escapeHTML(person.role)}</p>
            </div>
        </div>
    `).join('');
})();
