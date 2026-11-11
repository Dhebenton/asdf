(() => {
    'use strict';

    const page = location.pathname.split('/').pop();
    const pages = {
        'service-warranty.html': {
            en: {
                title: 'Service & Warranty', metaTitle: 'Service & Warranty | ETR Tehnika', metaDescription: 'ETR Tehnika provides machinery servicing, repairs, technical support and warranty guidance across Estonia.', contact: 'Get In Touch',
                introHeading: 'Equipment Servicing & Support',
                intro: [
                    'ETR provides machinery servicing, repairs and technical support to help customers maintain their equipment and keep it operating reliably. We understand the importance of dependable machinery and provide practical, knowledgeable support throughout its working life.',
                    'ETR provides machinery servicing, repairs and technical support to help customers maintain their equipment and keep it operating reliably.',
                    "Our experienced team offers assistance tailored to each customer's requirements, from diagnosing technical issues to carrying out necessary repairs and maintenance. We also provide guidance on equipment operation, servicing and spare parts across our range of machinery brands, helping customers maintain performance and make informed decisions about their equipment.",
                    "Our experienced team offers practical assistance tailored to each customer's requirements, from identifying technical issues to carrying out necessary repairs. We also provide guidance on equipment operation, maintenance and spare parts across our range of machinery brands."
                ],
                listHeading: 'Equipment Services & Support',
                list: ['Machinery servicing and maintenance', 'Equipment diagnostics and troubleshooting', 'Mechanical repairs', 'Technical advice and assistance', 'Spare parts guidance and support', 'Equipment operation guidance', 'Warranty-related enquiries', 'Repairs covered by workmanship warranty'],
                whyHeading: 'Why Choose ETR',
                whyTitles: ['Reliable Equipment Support', 'Experienced Technical Guidance', 'Warranty & Peace of Mind'],
                whyTexts: ['Access practical servicing and repair assistance from an experienced team familiar with the machinery we supply, helping keep your equipment in working condition.', 'Receive knowledgeable advice on machinery maintenance, operation and technical issues, with support tailored to your equipment and requirements.', 'Benefit from warranty coverage on completed repair work, alongside manufacturer warranties on spare parts, giving you confidence in the support behind your equipment.']
            },
            et: {
                title: 'Hooldus ja garantii', metaTitle: 'Hooldus ja garantii | ETR Tehnika', metaDescription: 'ETR Tehnika pakub masinate hooldust, remonti, tehnilist tuge ja garantiialast nõustamist üle Eesti.', contact: 'Võta ühendust',
                introHeading: 'Tehnika hooldus ja tugi',
                intro: ['ETR pakub masinate hooldust, remonti ja tehnilist tuge, et klientide tehnika püsiks töökorras ja töötaks usaldusväärselt. Mõistame töökindlate masinate tähtsust ning pakume praktilist ja asjatundlikku tuge kogu nende kasutusaja jooksul.', 'ETR pakub masinate hooldust, remonti ja tehnilist tuge, et klientide tehnika püsiks töökorras ja töötaks usaldusväärselt.', 'Meie kogenud meeskond pakub iga kliendi vajadustele kohandatud abi alates rikete tuvastamisest kuni remondi ja hoolduseni. Samuti nõustame masinate kasutamise, hoolduse ja varuosade teemal, aidates säilitada jõudlust ja teha teadlikke otsuseid.', 'Meie kogenud meeskond pakub praktilist abi tehniliste probleemide tuvastamisest kuni remondini ning nõustab masinate kasutamise, hoolduse ja varuosade teemal.'],
                listHeading: 'Tehnika teenused ja tugi',
                list: ['Masinate hooldus ja korrashoid', 'Tehnika diagnostika ja rikete tuvastamine', 'Mehaanilised remonditööd', 'Tehniline nõustamine ja abi', 'Varuosade nõustamine ja tugi', 'Masinate kasutamise juhendamine', 'Garantiiga seotud päringud', 'Töögarantiiga kaetud remonditööd'],
                whyHeading: 'Miks valida ETR', whyTitles: ['Usaldusväärne tehnikatugi', 'Kogenud tehniline nõustamine', 'Garantii ja meelerahu'],
                whyTexts: ['Saate praktilist hooldus- ja remondiabi kogenud meeskonnalt, kes tunneb meie tarnitavaid masinaid ning aitab neid töökorras hoida.', 'Saate asjatundlikku nõu masinate hoolduse, kasutamise ja tehniliste küsimuste kohta vastavalt teie tehnikale ja vajadustele.', 'Remonditööde garantii ja tootja varuosagarantii annavad kindluse, et teie tehnika taga on usaldusväärne tugi.']
            }
        },
        'financing-options.html': {
            en: {
                title: 'Financing Options', metaTitle: 'Equipment Financing Options | ETR Tehnika', metaDescription: 'Explore machinery financing options with guidance from ETR Tehnika and external financing partners.', contact: 'Get In Touch',
                introHeading: 'Equipment Financing & Guidance',
                intro: ['ETR helps customers explore financing options when purchasing machinery and equipment through external financing partners. We understand that buying equipment is an important decision and can help you find out what financing possibilities may be available for your purchase.', 'ETR helps customers explore machinery financing options through external financing partners, with guidance on how to make an enquiry.', 'Our team can discuss the equipment you are interested in and provide information about the next steps for a financing enquiry. Any financing arrangement, including eligibility, costs and repayment conditions, is subject to assessment and the terms offered by the relevant financing partner.', 'Our team can explain the enquiry process and help you explore available options. Financing approval, costs and terms depend on the relevant financing partner.'],
                listHeading: 'Financing Information & Support',
                list: ['Financing enquiries for machinery purchases', 'Information on available financing routes', 'Guidance on starting an application', 'Assistance identifying suitable equipment', 'Questions about the purchase process', 'Communication with financing partners', 'Information about possible next steps', 'Clarification of partner terms and conditions'],
                whyHeading: 'Why Choose ETR', whyTitles: ['Financing Through External Partners', 'Clear Guidance Throughout the Process', 'Options Based on Your Enquiry'],
                whyTexts: ['Explore possible financing arrangements through external partners, with ETR available to help you understand how to begin an enquiry for your chosen equipment.', 'Receive practical information about the process, the details you may need to provide and the next steps to discuss with a financing partner.', 'Financing possibilities depend on the equipment and individual circumstances, with all applications and terms assessed by the relevant financing provider.']
            },
            et: {
                title: 'Finantseerimisvõimalused', metaTitle: 'Tehnika finantseerimisvõimalused | ETR Tehnika', metaDescription: 'Tutvu masinate finantseerimisvõimalustega ETR Tehnika ja väliste finantseerimispartnerite toel.', contact: 'Võta ühendust',
                introHeading: 'Tehnika finantseerimine ja nõustamine',
                intro: ['ETR aitab klientidel väliste finantseerimispartnerite kaudu tutvuda masinate ja tehnika ostu finantseerimisvõimalustega. Mõistame, et tehnika ost on oluline otsus, ning aitame välja selgitada, millised lahendused võivad teie ostule sobida.', 'ETR aitab klientidel tutvuda masinate finantseerimisvõimalustega väliste partnerite kaudu ja selgitab päringu alustamist.', 'Meie meeskond arutab teid huvitavat tehnikat ja selgitab finantseerimispäringu järgmisi samme. Sobivus, kulud ja tagasimaksetingimused sõltuvad partneri hinnangust ja pakutavatest tingimustest.', 'Meie meeskond selgitab päringuprotsessi ja aitab võimalustega tutvuda. Heakskiit, kulud ja tingimused sõltuvad finantseerimispartnerist.'],
                listHeading: 'Finantseerimisinfo ja tugi',
                list: ['Masinaostu finantseerimispäringud', 'Info saadaolevate finantseerimisvõimaluste kohta', 'Abi taotluse alustamisel', 'Abi sobiva tehnika leidmisel', 'Ostuprotsessiga seotud küsimused', 'Suhtlus finantseerimispartneritega', 'Info võimalike järgmiste sammude kohta', 'Partneri tingimuste selgitamine'],
                whyHeading: 'Miks valida ETR', whyTitles: ['Finantseerimine väliste partnerite kaudu', 'Selge nõustamine kogu protsessi jooksul', 'Teie päringul põhinevad võimalused'],
                whyTexts: ['Tutvuge võimalike finantseerimislahendustega väliste partnerite kaudu. ETR aitab mõista, kuidas valitud tehnika kohta päringut alustada.', 'Saate praktilist teavet protsessi, vajalike andmete ja finantseerimispartneriga arutatavate järgmiste sammude kohta.', 'Finantseerimisvõimalused sõltuvad tehnikast ja taotleja olukorrast ning kõik taotlused ja tingimused hindab vastav partner.']
            }
        },
        'trade-in-options.html': {
            en: {
                title: 'Trade-In Options', metaTitle: 'Equipment Trade-In Options | ETR Tehnika', metaDescription: 'Trade in existing machinery and apply its value towards your next equipment purchase with guidance from ETR Tehnika.', contact: 'Get In Touch',
                introHeading: 'Equipment Trade-In Support',
                intro: ['ETR helps customers trade in existing machinery and apply its value towards a new equipment purchase. We provide a clear starting point for discussing your current machine and the equipment you would like to purchase next.', 'ETR helps customers trade in existing machinery and use its value towards their next equipment purchase.', 'Our team can review the information about your machine, discuss its condition and explain the next steps. Any trade-in value depends on the equipment, age, condition, service history and current market demand.', 'Our team can discuss your current machine and explain the trade-in process. Final value depends on its condition, history and market demand.'],
                listHeading: 'Trade-In Information & Support',
                list: ['Initial trade-in enquiries', 'Review of equipment details', 'Condition and service-history discussion', 'Guidance on required photographs and information', 'Indicative equipment valuation', 'Selection of replacement machinery', 'Applying trade-in value to your purchase', 'Clear next steps from enquiry to agreement'],
                whyHeading: 'Why Choose ETR', whyTitles: ['Straightforward Equipment Review', 'Value Towards Your Next Machine', 'Practical Guidance Throughout'],
                whyTexts: ['Share the details of your existing machine with a team that understands equipment and can explain the factors affecting its trade-in value.', 'Use the agreed value of your current equipment towards a suitable replacement from our machinery range.', 'Receive clear guidance on the information required, the assessment process and the next steps towards completing a trade-in.']
            },
            et: {
                title: 'Tehnika vahetusvõimalused', metaTitle: 'Tehnika vahetusvõimalused | ETR Tehnika', metaDescription: 'Anna olemasolev masin vahetusse ja kasuta selle väärtust järgmise tehnika ostuks ETR Tehnika abiga.', contact: 'Võta ühendust',
                introHeading: 'Tehnika vahetuse tugi',
                intro: ['ETR aitab klientidel anda olemasoleva masina vahetusse ja kasutada selle väärtust uue tehnika ostuks. Pakume selget lähtekohta praeguse masina ja järgmise ostu arutamiseks.', 'ETR aitab anda olemasoleva masina vahetusse ja kasutada selle väärtust järgmise tehnika ostuks.', 'Meie meeskond vaatab üle masina andmed, arutab selle seisukorda ja selgitab järgmisi samme. Vahetusväärtus sõltub tehnikast, vanusest, seisukorrast, hooldusajaloost ja turu nõudlusest.', 'Meie meeskond arutab teie praegust masinat ja selgitab vahetusprotsessi. Lõplik väärtus sõltub seisukorrast, ajaloost ja turu nõudlusest.'],
                listHeading: 'Vahetuse info ja tugi',
                list: ['Esmased vahetuspäringud', 'Tehnika andmete ülevaatus', 'Seisukorra ja hooldusajaloo arutamine', 'Juhised fotode ja vajaliku info kohta', 'Tehnika esialgne väärtuse hindamine', 'Asendusmasina valimine', 'Vahetusväärtuse kasutamine ostul', 'Selged järgmised sammud päringust kokkuleppeni'],
                whyHeading: 'Miks valida ETR', whyTitles: ['Lihtne tehnika ülevaatus', 'Väärtus järgmise masina ostuks', 'Praktiline tugi kogu protsessi jooksul'],
                whyTexts: ['Jagage olemasoleva masina andmeid meeskonnaga, kes tunneb tehnikat ja selgitab selle vahetusväärtust mõjutavaid tegureid.', 'Kasutage praeguse tehnika kokkulepitud väärtust sobiva asendusmasina ostuks meie valikust.', 'Saate selged juhised vajaliku info, hindamisprotsessi ja vahetuse lõpuleviimise järgmiste sammude kohta.']
            }
        }
    };

    const config = pages[page];
    if (!config) return;
    const bind = (element, key) => { if (element) element.dataset.infoKey = key; };
    bind(document.querySelector('.breadcrumbs a.active'), 'title');
    bind(document.querySelector('#info-page-call-to-action h1'), 'title');
    const contact = document.querySelector('#info-page-call-to-action .button');
    bind(contact, 'contact'); if (contact) contact.href = '/pages/contact.html';
    bind(document.querySelector('section.first h2'), 'introHeading');
    [...document.querySelectorAll('section.first .column > .fc.g20:first-of-type p.text')].forEach((element, index) => bind(element, `intro.${index}`));
    bind(document.querySelector('section.first h3'), 'listHeading');
    [...document.querySelectorAll('section.first .list p.text')].forEach((element, index) => bind(element, `list.${index}`));
    bind(document.querySelector('section.second h2'), 'whyHeading');
    [...document.querySelectorAll('section.second .info-table h3')].forEach((element, index) => bind(element, `whyTitles.${index}`));
    [...document.querySelectorAll('section.second .info-table p')].forEach((element, index) => bind(element, `whyTexts.${index}`));

    const valueAt = (source, path) => path.split('.').reduce((value, part) => value?.[Number.isNaN(Number(part)) ? part : Number(part)], source);
    const apply = () => {
        const language = document.documentElement.lang === 'et' ? 'et' : 'en';
        const text = config[language];
        document.querySelectorAll('[data-info-key]').forEach(element => {
            const value = valueAt(text, element.dataset.infoKey);
            if (value) element.textContent = value;
        });
        document.title = text.metaTitle;
        document.querySelector('meta[name="description"]')?.setAttribute('content', text.metaDescription);
        const cover = document.querySelector('#info-page-cover img');
        if (cover) cover.alt = text.title;
    };

    document.addEventListener('etr:languagechange', apply);
    apply();
})();
