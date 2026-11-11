(() => {
    'use strict';

    const nav = document.querySelector('nav');
    if (!nav) return;

    const languageButton = nav.querySelector('#language-switcher');
    const languageSelect = nav.querySelector('.language-select');
    const languageOptions = [...nav.querySelectorAll('[data-language]')];
    const menuButton = nav.querySelector('.menu-button');
    const mobileMenu = document.querySelector('.nav-menu-tablet');
    const closeButton = mobileMenu?.querySelector('.close-bt');
    const backgroundBlur = document.querySelector('.background-blur');
    const mobileBreakpoint = window.matchMedia('(max-width: 1080px)');

    const translations = {
        en: {
            navMachinery: 'Machinery',
            navBrands: 'Brands',
            navIndustries: 'Industries',
            navServicing: 'Servicing',
            navFinance: 'Finance',
            navAbout: 'About Us',
            navContact: 'Contact',
            navMessage: 'Send Us A Message',
            heroTitle: 'Reliable machinery for demanding applications <br>with expert guidance and support across Estonia.',
            browseCategories: 'Browse Categories',
            speakExpert: 'Speak To An Expert',
            nationwideSupport: 'Nationwide Support',
            rightEquipment: 'Choosing the Right Equipment',
            equipmentAdvice: 'Equipment, Advice and Support',
            serviceEverywhere: 'Service and assistance across Estonia, <br>wherever the work takes you.',
            guidanceFinance: 'Expert guidance, finance and trade-in options, to <br>support the right decision from selection to purchase.',
            etrCombines: 'ETR combines machinery sales with expert guidance, financing, <br>servicing and nationwide support across Estonia.',
            ongoingSupport: 'Ongoing Support',
            beyondSale: 'Support Beyond the Sale',
            practicalAdvice: 'Practical advice from machine selection, <br>through to purchase and delivery.',
            warrantySupport: 'Servicing, warranty and nationwide technical support, <br>to keep your equipment performing throughout ownership.',
            flexibleFinance: 'Flexible Financing',
            financeOptions: 'Finance and trade-in options, to make <br>purchasing your next machine easier.',
            categoriesHeading: 'Browse Equipment By Category',
            browseMoreCategories: 'Browse More Categories',
            categoryExcavators: 'Excavators',
            categoryExcavatorsDescription: 'Excavation, Digging & Groundwork',
            categoryLoaders: 'Loaders',
            categoryLoadersDescription: 'Lifting & Material Movement',
            categoryUtvs: 'UTVs',
            categoryUtvsDescription: 'Transport, Work & Utility',
            categoryAtvs: 'ATVs',
            categoryAtvsDescription: 'All-Terrain Work & Exploration',
            categoryWoodworking: 'Woodworking',
            categoryWoodworkingDescription: 'Forestry & Timber Processing',
            categoryGenerators: 'Generators',
            categoryGeneratorsDescription: 'Reliable Power Anywhere',
            brandsHeading: 'Browse Equipment by Brand.',
            brandAflatekLabel: 'Browse Aflatek products',
            brandHeraclesLabel: 'Browse Heracles products',
            brandLantzmannLabel: 'Browse Lantzmann products',
            brandGeoworksLabel: 'Browse Geoworks products',
            brandShantuiLabel: 'Browse Shantui products',
            brandLoncinLabel: 'Browse Loncin products',
            brandCastloadersLabel: 'Browse Castloaders products',
            promotionsHeading: 'Promotions & Best Sellers',
            previousSlide: 'Previous product',
            nextSlide: 'Next product',
            industriesHeading: 'Browse By Industry',
            industryConstruction: 'Construction & Earthworks',
            industryConstructionProducts: 'Excavators, loaders, compressors, generators',
            industryAgriculture: 'Agriculture & Farming',
            industryAgricultureProducts: 'Loaders, ATVs, UTVs, access ramps',
            industryForestry: 'Forestry & Timber',
            industryForestryProducts: 'Wood chippers, loaders, UTVs, generators',
            industryInfrastructure: 'Infrastructure & Utilities',
            industryInfrastructureProducts: 'Excavators, compressors, generators, protection mats',
            industryLandscaping: 'Landscaping & Groundskeeping',
            industryLandscapingProducts: 'Mini excavators, compact loaders, ATVs, ground reinforcement',
            industryTransport: 'Transport & Material Handling',
            industryTransportProducts: 'Loaders, UTVs, access ramps, protection mats',
            shopHeading: 'Shop By Category',
            shopExcavators: 'Excavators',
            shopLoaders: 'Loaders',
            shopBandsaws: 'Bandsaw Frames',
            shopUtvs: 'UTV',
            shopAtvs: 'ATV',
            loadMore: 'Load More',
            shantuiBannerTitle: 'Shantui excavators and loaders, <br> exclusively available through ETR.',
            shantuiBannerButton: 'Browse Shantui Equipment',
            aboutHeading: 'The People, Experience and Expertise <br>Behind Every ETR Customer Relationship.',
            aboutExperience: 'Years of experience supplying construction and excavation equipment across Estonia',
            aboutBrands: 'Equipment brands brought together to help you compare and choose the right machinery',
            aboutMachines: 'Machines supplied and delivered to businesses and customers throughout Estonia',
            aboutSpecialists: 'Equipment specialists available to help you choose, finance and maintain your machinery',
            leadershipHeading: 'Leadership',
            teamAfterSales: 'After-Sales',
            teamSales: 'Sales',
            teamProductSales: 'Product & Sales',
            teamJoosepDescription: 'Joosep Hein oversees after-sales service, helping customers with equipment maintenance, technical support, and assistance.',
            teamTanelDescription: 'Tanel-Patrick Epner leads sales operations, coordinating customer enquiries, relationships, and machinery purchasing across ETR.',
            teamMarisDescription: 'Maris Ristal manages product and sales enquiries, helping customers compare machinery, specifications, and purchasing requirements.',
            teamAveDescription: 'Ave Pärn handles product and sales enquiries, assisting customers with equipment selection, information, and purchase arrangements.',
            teamJoosepRole: 'After-Sales Service Manager',
            teamTanelRole: 'Sales Director',
            teamProductSalesRole: 'Product & Sales Manager',
            phoneLabel: 'Phone:',
            emailLabel: 'Email:',
            waysHeading: 'More Ways to Purchase, Finance And <br class="no-tablet">Manage Your <br class="yes-tablet"/> Machinery and Equipment',
            tradeInTitle: 'Trade In Your Existing Machine',
            tradeInText: 'Put the value of your current equipment towards your next purchase with a straightforward trade-in process.',
            financingTitle: 'Explore Equipment Financing Options',
            financingText: 'Flexible financing solutions to help you spread the cost of your next machine with payment options suited to your business.',
            pointersHeading: 'Why Customers Across Estonia <br>Choose ETR for Their Equipment',
            pointerAdviceTitle: 'Advice Before You Buy',
            pointerAdviceText: 'We help you choose the right machine and the attachments that go with it, so your investment fits the work you do from day one.',
            pointerFinanceTitle: 'Flexible Financing Options',
            pointerFinanceText: 'Financing developed with credit institutions, so the equipment you need stays within reach whatever the size of your company or budget.',
            pointerServiceTitle: 'Servicing and Warranty',
            pointerServiceText: "Maintenance and repairs from our team, with a warranty on repair work and the manufacturer's warranty on spare parts.",
            pointerSupportTitle: 'Support Across Estonia',
            pointerSupportText: 'Technical support and service are available nationwide, so help is never far from the job, wherever in Estonia you work.',
            faqHeading: 'Common Questions',
            faqMachinery: 'Machinery',
            faqService: 'Servicing & Warranty',
            faqTeam: 'Our Team',
            faqChooseQ: 'How do I choose the right machine for my requirements?',
            faqChooseA: 'Our team can help you compare machinery based on your workload, site conditions and budget, ensuring you find equipment suited to your requirements.',
            faqViewQ: 'Can I view the machinery before making a purchase?',
            faqViewA: 'You can contact our team to arrange a viewing of available machinery at our location in Peetri, Estonia. Availability may vary between models.',
            faqFinanceQ: 'Do you offer financing and equipment trade-in options?',
            faqFinanceA: 'Yes, we can assist with financing options and equipment trade-ins to help make your next machinery purchase more straightforward and manageable.',
            faqRepairsQ: 'What types of machinery servicing and repairs do you provide?',
            faqRepairsA: 'We provide machinery servicing, fault diagnosis and repairs, alongside technical guidance to help maintain equipment performance and minimise unnecessary downtime.',
            faqWarrantyQ: 'Does purchased machinery come with warranty coverage?',
            faqWarrantyA: 'Warranty coverage depends on the machine, manufacturer and purchase conditions. Our team can explain the applicable terms before you make a purchase.',
            faqPartsQ: 'Can you help source replacement parts for my equipment?',
            faqPartsA: 'Our team can assist with identifying and sourcing suitable replacement parts for supported machinery brands, subject to availability and compatibility.',
            faqLocationQ: 'Where is ETR located and which areas do you serve?',
            faqLocationA: 'Our head office is located at Läike tee 1 in Peetri, Harju County. We supply machinery and support customers throughout Estonia.',
            faqContactQ: 'How can I speak with someone about equipment enquiries?',
            faqContactA: 'You can reach our team through the contact page for assistance with machinery selection, product availability, financing and technical enquiries.',
            faqAdviceQ: 'Can your team provide advice on machinery and attachments?',
            faqAdviceA: 'Yes, our specialists can help you understand equipment specifications, compare available models and identify suitable attachments for your intended applications.',
            coverageHeading: 'Full Service Coverage Across Estonia',
            coverageText: 'ETR provides servicing, repairs and technical support to keep customers’ machinery operating reliably across Estonia.',
            coverageButton: 'Learn More About Servicing',
            headOffice: 'Head Office',
            officeAddress: 'Läike tee 1, Peetri Rae Parish, 75312 Harju County, Estonia',
            ctaHeading: 'Talk to our experts about finding the right <br>equipment and support for your next project',
            footerEquipment: 'Equipment',
            footerAllCategories: 'All Categories',
            footerAllBrands: 'All Brands',
            footerResources: 'Resources',
            footerService: 'Service & Warranty',
            footerFinancing: 'Financing Options',
            footerTradeIn: 'Trade-In Options',
            footerAbout: 'About ETR',
            footerContact: 'Contact Us',
            footerLocation: 'Our Location',
            footerCopyright: '© 2026 ETR Tehnika. All rights reserved.',
            breadcrumbHome: 'Home',
            aboutPageMetaTitle: 'About ETR Tehnika | Machinery Expertise Across Estonia',
            aboutPageMetaDescription: 'Meet ETR Tehnika and the specialists helping businesses across Estonia choose, finance, service and maintain dependable machinery.',
            aboutPageHero: 'We believe the right machinery starts with understanding <br class="mobile-no">the work and the people who depend on it every day.',
            aboutPageIntroHeading: 'Helping businesses find the right machinery through practical advice<br> and a clear understanding of their needs.',
            aboutPageIntroHeadingMobile: 'The right machinery starts with understanding your needs.',
            aboutPageIntroTextOne: 'ETR provides machinery servicing, repairs and technical support to help customers maintain their equipment and keep it operating reliably. We understand the importance of dependable machinery and provide practical, knowledgeable support throughout its working life.',
            aboutPageIntroTextOneMobile: 'ETR provides machinery servicing, repairs and technical support to help customers maintain their equipment and keep it operating reliably.',
            aboutPageIntroTextTwo: "Our experienced team offers assistance tailored to each customer's requirements, from diagnosing technical issues to carrying out necessary repairs and maintenance. We also provide guidance on equipment operation, servicing and spare parts across our range of machinery brands, helping customers maintain performance and make informed decisions about their equipment.",
            aboutPageIntroTextTwoMobile: "Our experienced team offers practical assistance tailored to each customer's requirements, from identifying technical issues to carrying out necessary repairs. We also provide guidance on equipment operation, maintenance and spare parts across our range of machinery brands.",
            aboutWhyHeading: 'Why Choose ETR',
            aboutWhySupportTitle: 'Reliable Equipment Support',
            aboutWhySupportText: 'Access practical servicing and repair assistance from an experienced team familiar with the machinery we supply, helping keep your equipment in working condition.',
            aboutWhyGuidanceTitle: 'Experienced Technical Guidance',
            aboutWhyGuidanceText: 'Receive knowledgeable advice on machinery maintenance, operation and technical issues, with support tailored to your equipment and requirements.',
            aboutWhyWarrantyTitle: 'Warranty & Peace of Mind',
            aboutWhyWarrantyText: 'Benefit from warranty coverage on completed repair work, alongside manufacturer warranties on spare parts, giving you confidence in the support behind your equipment.',
            allCategoriesHeading: 'All Categories',
            allIndustriesHeading: 'All Industries',
            allBrandsHeading: 'All Brands',
            categoriesMetaTitle: 'Equipment Categories | ETR Tehnika',
            categoriesMetaDescription: 'Browse ETR Tehnika equipment categories, from excavators and loaders to generators, compressors, access ramps and ground protection.',
            industriesMetaTitle: 'Industries We Support | ETR Tehnika',
            industriesMetaDescription: 'Find machinery for construction, agriculture, forestry, infrastructure, landscaping and material handling across Estonia.',
            brandsMetaTitle: 'Equipment Brands | ETR Tehnika',
            brandsMetaDescription: 'Browse trusted machinery brands available from ETR Tehnika, including Shantui, Heracles, Loncin, Lantzmann, Geoworks and more.',
            categoryCompressors: 'Compressors',
            categoryCompressorsDescription: 'Compressed Air & Site Work',
            categoryGrasshoppers: 'Grasshoppers',
            categoryGrasshoppersDescription: 'Ground Stability & Reinforcement',
            categoryAccessRamps: 'Access Ramps',
            categoryAccessRampsDescription: 'Safe Access & Easy Loading',
            categoryProtectionMats: 'Protection Mats',
            categoryProtectionMatsDescription: 'Ground & Surface Protection',
            brandShantuiDescription: 'Powerful construction machinery built for demanding work.',
            brandHeraclesDescription: 'Versatile loaders designed for everyday performance.',
            brandLoncinDescription: 'Reliable ATVs and utility vehicles for work and adventure.',
            brandLantzmannDescription: 'Practical forestry and woodworking equipment built to perform.',
            brandGeoworksDescription: 'Durable ground reinforcement and access solutions.',
            brandBertzDescription: 'Compact excavators designed for precision and versatility.',
            brandCastloadersDescription: 'Compact articulated loaders built for challenging environments.',
            brandAflatekDescription: 'Dependable compressed air equipment for professional applications.',
            allEquipmentHeading: 'All Equipment',
            catalogueMetaTitle: 'All Equipment | ETR Tehnika',
            catalogueMetaDescription: 'Browse ETR Tehnika machinery and filter equipment by category, brand, availability and price.',
            filtersHeading: 'Filters',
            applyFilters: 'Apply Filters',
            showFilters: 'Show Filters',
            servicePageHeading: 'Service & Warranty',
            financingPageHeading: 'Financing Options',
            tradeInPageHeading: 'Trade-In Options',
            contactPageHeading: 'Contact Us',
            contactMetaTitle: 'Contact ETR Tehnika | Machinery Sales & Support',
            contactMetaDescription: 'Contact ETR Tehnika for machinery sales, financing, servicing and practical equipment support across Estonia.',
            contactStart: 'Start the conversation',
            contactIntro: 'Contact our team for machinery enquiries, financing options or servicing, <br>and get practical guidance suited to your requirements.',
            contactPhone: 'Phone Number',
            contactPhoneShort: 'Phone',
            contactEmail: 'Email',
            contactSocial: 'Social Media',
            contactOffice: 'Office',
            contactAddressRegion: 'Harju County, Estonia',
            contactSpecialist: 'Speak To A Specialist',
            formName: 'Name',
            formMessage: 'Message',
            formSend: 'Send Message',
            formSuccessHeading: 'Message Sent',
            formSuccessText: 'Thank you. A member of our team will be in touch shortly.',
            formSendAnother: 'Send Another Message'
        },
        et: {
            navMachinery: 'Masinad',
            navBrands: 'Kaubamärgid',
            navIndustries: 'Valdkonnad',
            navServicing: 'Hooldus',
            navFinance: 'Finantseerimine',
            navAbout: 'Meist',
            navContact: 'Kontakt',
            navMessage: 'Saada meile sõnum',
            heroTitle: 'Usaldusväärne tehnika nõudlikuks tööks <br>koos asjatundliku nõu ja toega üle Eesti.',
            browseCategories: 'Vaata kategooriaid',
            speakExpert: 'Küsi spetsialistilt',
            nationwideSupport: 'Üleriigiline tugi',
            rightEquipment: 'Õige tehnika valimine',
            equipmentAdvice: 'Tehnika, nõu ja tugi',
            serviceEverywhere: 'Hooldus ja abi kõikjal Eestis, <br>kuhu töö teid ka ei viiks.',
            guidanceFinance: 'Asjatundlik nõu, finantseerimine ja vahetus, et <br>teha õige otsus valikust ostuni.',
            etrCombines: 'ETR ühendab masinate müügi, asjatundliku nõu, finantseerimise, <br>hoolduse ja üleriigilise toe.',
            ongoingSupport: 'Pidev tugi',
            beyondSale: 'Tugi ka pärast ostu',
            practicalAdvice: 'Praktiline nõu masina valikust <br>kuni ostu ja tarneni.',
            warrantySupport: 'Hooldus, garantii ja üleriigiline tehniline tugi, <br>et teie masin töötaks kogu kasutusaja.',
            flexibleFinance: 'Paindlik finantseerimine',
            financeOptions: 'Finantseerimine ja vahetus muudavad <br>järgmise masina ostu lihtsamaks.',
            categoriesHeading: 'Sirvi tehnikat kategooria järgi',
            browseMoreCategories: 'Vaata rohkem kategooriaid',
            categoryExcavators: 'Ekskavaatorid',
            categoryExcavatorsDescription: 'Kaevamine ja pinnasetööd',
            categoryLoaders: 'Laadurid',
            categoryLoadersDescription: 'Tõstmine ja materjalivedu',
            categoryUtvs: 'UTV-d',
            categoryUtvsDescription: 'Transport, töö ja vedu',
            categoryAtvs: 'ATV-d',
            categoryAtvsDescription: 'Maastikutöö ja avastamine',
            categoryWoodworking: 'Puidutöö',
            categoryWoodworkingDescription: 'Metsandus ja puidutöötlus',
            categoryGenerators: 'Generaatorid',
            categoryGeneratorsDescription: 'Kindel elekter kõikjal',
            brandsHeading: 'Sirvi tehnikat kaubamärgi järgi.',
            brandAflatekLabel: 'Vaata Aflateki tooteid',
            brandHeraclesLabel: 'Vaata Heraclese tooteid',
            brandLantzmannLabel: 'Vaata Lantzmanni tooteid',
            brandGeoworksLabel: 'Vaata Geoworksi tooteid',
            brandShantuiLabel: 'Vaata Shantui tooteid',
            brandLoncinLabel: 'Vaata Loncini tooteid',
            brandCastloadersLabel: 'Vaata Castloadersi tooteid',
            promotionsHeading: 'Pakkumised ja populaarsemad',
            previousSlide: 'Eelmine toode',
            nextSlide: 'Järgmine toode',
            industriesHeading: 'Sirvi valdkonna järgi',
            industryConstruction: 'Ehitus ja pinnasetööd',
            industryConstructionProducts: 'Ekskavaatorid, laadurid, kompressorid, generaatorid',
            industryAgriculture: 'Põllumajandus',
            industryAgricultureProducts: 'Laadurid, ATV-d, UTV-d, pealesõidurambid',
            industryForestry: 'Metsandus ja puit',
            industryForestryProducts: 'Puiduhakkurid, laadurid, UTV-d, generaatorid',
            industryInfrastructure: 'Taristu ja kommunaalteenused',
            industryInfrastructureProducts: 'Ekskavaatorid, kompressorid, generaatorid, kaitsematid',
            industryLandscaping: 'Haljastus ja heakord',
            industryLandscapingProducts: 'Miniekskavaatorid, kompaktlaadurid, ATV-d, pinnasetugevdus',
            industryTransport: 'Transport ja materjalikäitlus',
            industryTransportProducts: 'Laadurid, UTV-d, pealesõidurambid, kaitsematid',
            shopHeading: 'Sirvi kategooria järgi',
            shopExcavators: 'Ekskavaatorid',
            shopLoaders: 'Laadurid',
            shopBandsaws: 'Lintsaeraamid',
            shopUtvs: 'UTV-d',
            shopAtvs: 'ATV-d',
            loadMore: 'Laadi juurde',
            shantuiBannerTitle: 'Shantui ekskavaatorid ja laadurid, <br>saadaval ainult ETR-i kaudu.',
            shantuiBannerButton: 'Vaata Shantui tehnikat',
            aboutHeading: 'Inimesed, kogemus ja asjatundlikkus <br>iga ETR-i kliendisuhte taga.',
            aboutExperience: 'Aastat kogemust ehitus- ja kaevetehnika tarnimisel üle Eesti',
            aboutBrands: 'Tehnikabrändi, mis aitavad võrrelda ja valida sobiva masina',
            aboutMachines: 'Masinat tarnitud ettevõtetele ja klientidele üle Eesti',
            aboutSpecialists: 'Tehnikaspetsialisti, kes aitavad masinat valida, finantseerida ja hooldada',
            leadershipHeading: 'Juhtkond',
            teamAfterSales: 'Müügijärgne teenindus',
            teamSales: 'Müük',
            teamProductSales: 'Tooted ja müük',
            teamJoosepDescription: 'Joosep Hein juhib müügijärgset teenindust ning aitab kliente tehnika hoolduse, tehnilise toe ja nõustamisega.',
            teamTanelDescription: 'Tanel-Patrick Epner juhib müügitegevust ning koordineerib klientide päringuid, suhteid ja tehnika ostmist.',
            teamMarisDescription: 'Maris Ristal tegeleb toote- ja müügipäringutega ning aitab klientidel võrrelda masinaid, tehnilisi näitajaid ja ostuvõimalusi.',
            teamAveDescription: 'Ave Pärn tegeleb toote- ja müügipäringutega ning aitab kliente tehnika valiku, info ja ostukorraldusega.',
            teamJoosepRole: 'Müügijärgse teeninduse juht',
            teamTanelRole: 'Müügidirektor',
            teamProductSalesRole: 'Toote- ja müügijuht',
            phoneLabel: 'Telefon:',
            emailLabel: 'E-post:',
            waysHeading: 'Rohkem võimalusi tehnika ostmiseks, finantseerimiseks <br class="no-tablet">ja haldamiseks',
            tradeInTitle: 'Anna olemasolev masin vahetusse',
            tradeInText: 'Kasuta olemasoleva tehnika väärtust järgmise ostu sissemaksena lihtsa vahetusprotsessi kaudu.',
            financingTitle: 'Tutvu tehnika finantseerimisvõimalustega',
            financingText: 'Paindlikud finantseerimislahendused aitavad jagada järgmise masina maksumuse teie ettevõttele sobivateks makseteks.',
            pointersHeading: 'Miks kliendid üle Eesti <br>valivad oma tehnikapartneriks ETR-i',
            pointerAdviceTitle: 'Nõu enne ostu',
            pointerAdviceText: 'Aitame valida õige masina ja sobivad lisaseadmed, et investeering vastaks teie tööle juba esimesest päevast.',
            pointerFinanceTitle: 'Paindlikud finantseerimisvõimalused',
            pointerFinanceText: 'Koostöös krediidiasutustega loodud finantseerimine hoiab vajaliku tehnika kättesaadavana sõltumata ettevõtte suurusest või eelarvest.',
            pointerServiceTitle: 'Hooldus ja garantii',
            pointerServiceText: 'Meie meeskonna hooldus ja remont koos remonditööde garantii ning tootja varuosagarantiiga.',
            pointerSupportTitle: 'Tugi üle Eesti',
            pointerSupportText: 'Tehniline tugi ja hooldus on saadaval üle Eesti, nii et abi pole töökohast kunagi kaugel.',
            faqHeading: 'Korduma kippuvad küsimused',
            faqMachinery: 'Tehnika',
            faqService: 'Hooldus ja garantii',
            faqTeam: 'Meie meeskond',
            faqChooseQ: 'Kuidas valida oma vajadustele sobiv masin?',
            faqChooseA: 'Meie meeskond aitab võrrelda masinaid töökoormuse, objekti tingimuste ja eelarve järgi, et leida teie vajadustele sobiv tehnika.',
            faqViewQ: 'Kas tehnikat saab enne ostmist vaatama tulla?',
            faqViewA: 'Võtke meiega ühendust, et leppida kokku saadaoleva tehnika vaatamine Peetris. Mudelite saadavus võib erineda.',
            faqFinanceQ: 'Kas pakute finantseerimist ja tehnika vahetust?',
            faqFinanceA: 'Jah, aitame finantseerimise ja tehnika vahetusega, et järgmise masina ost oleks lihtsam ja paremini hallatav.',
            faqRepairsQ: 'Millist tehnika hooldust ja remonti pakute?',
            faqRepairsA: 'Pakume masinate hooldust, rikete diagnostikat ja remonti ning tehnilist nõustamist, et säilitada jõudlus ja vähendada seisakuid.',
            faqWarrantyQ: 'Kas ostetud tehnikale kehtib garantii?',
            faqWarrantyA: 'Garantii sõltub masinast, tootjast ja ostutingimustest. Meie meeskond selgitab tingimusi enne ostu.',
            faqPartsQ: 'Kas aitate leida tehnikale varuosi?',
            faqPartsA: 'Aitame tuvastada ja hankida toetatud tehnikabrändidele sobivaid varuosi vastavalt saadavusele ja ühilduvusele.',
            faqLocationQ: 'Kus ETR asub ja milliseid piirkondi teenindate?',
            faqLocationA: 'Meie peakontor asub aadressil Läike tee 1, Peetri, Harjumaa. Tarnime tehnikat ja toetame kliente üle Eesti.',
            faqContactQ: 'Kuidas saan tehnikapäringuga spetsialistiga rääkida?',
            faqContactA: 'Võtke meiega ühendust kontaktilehe kaudu, et saada abi tehnika valiku, saadavuse, finantseerimise ja tehniliste küsimustega.',
            faqAdviceQ: 'Kas teie meeskond nõustab masinate ja lisaseadmete valikul?',
            faqAdviceA: 'Jah, meie spetsialistid aitavad mõista tehnilisi näitajaid, võrrelda mudeleid ja leida sobivad lisaseadmed.',
            coverageHeading: 'Täielik hoolduskatvus üle Eesti',
            coverageText: 'ETR pakub hooldust, remonti ja tehnilist tuge, et klientide masinad töötaksid usaldusväärselt üle Eesti.',
            coverageButton: 'Loe hoolduse kohta lähemalt',
            headOffice: 'Peakontor',
            officeAddress: 'Läike tee 1, Peetri, Rae vald, 75312 Harjumaa, Eesti',
            ctaHeading: 'Räägi meie spetsialistidega, et leida järgmise<br>projekti jaoks õige tehnika ja tugi',
            footerEquipment: 'Tehnika',
            footerAllCategories: 'Kõik kategooriad',
            footerAllBrands: 'Kõik kaubamärgid',
            footerResources: 'Teenused',
            footerService: 'Hooldus ja garantii',
            footerFinancing: 'Finantseerimisvõimalused',
            footerTradeIn: 'Vahetusvõimalused',
            footerAbout: 'ETR-ist',
            footerContact: 'Võta ühendust',
            footerLocation: 'Meie asukoht',
            footerCopyright: '© 2026 ETR Tehnika. Kõik õigused kaitstud.',
            breadcrumbHome: 'Avaleht',
            aboutPageMetaTitle: 'ETR Tehnikast | Masinate asjatundjad üle Eesti',
            aboutPageMetaDescription: 'Tutvu ETR Tehnika ja spetsialistidega, kes aitavad ettevõtetel üle Eesti valida, finantseerida, hooldada ja töökorras hoida usaldusväärseid masinaid.',
            aboutPageHero: 'Usume, et õige tehnika valik algab töö <br class="mobile-no">ja seda iga päev tegevate inimeste mõistmisest.',
            aboutPageIntroHeading: 'Aitame ettevõtetel leida õige tehnika praktilise nõu<br> ja nende vajaduste selge mõistmise kaudu.',
            aboutPageIntroHeadingMobile: 'Õige tehnika algab teie vajaduste mõistmisest.',
            aboutPageIntroTextOne: 'ETR pakub masinate hooldust, remonti ja tehnilist tuge, et klientide tehnika püsiks töökorras ja töötaks usaldusväärselt. Mõistame töökindlate masinate tähtsust ning pakume praktilist ja asjatundlikku tuge kogu nende kasutusaja jooksul.',
            aboutPageIntroTextOneMobile: 'ETR pakub masinate hooldust, remonti ja tehnilist tuge, et klientide tehnika püsiks töökorras ja töötaks usaldusväärselt.',
            aboutPageIntroTextTwo: 'Meie kogenud meeskond pakub iga kliendi vajadustele kohandatud abi alates tehniliste probleemide tuvastamisest kuni vajaliku remondi ja hoolduseni. Samuti nõustame masinate kasutamise, hoolduse ja varuosade teemal, aidates säilitada jõudlust ja teha teadlikke otsuseid.',
            aboutPageIntroTextTwoMobile: 'Meie kogenud meeskond pakub praktilist ja vajadustele kohandatud abi alates tehniliste probleemide tuvastamisest kuni remondini. Samuti nõustame masinate kasutamise, hoolduse ja varuosade teemal.',
            aboutWhyHeading: 'Miks valida ETR',
            aboutWhySupportTitle: 'Usaldusväärne tehnikatugi',
            aboutWhySupportText: 'Saate praktilist hooldus- ja remondiabi kogenud meeskonnalt, kes tunneb meie tarnitavaid masinaid ning aitab neid töökorras hoida.',
            aboutWhyGuidanceTitle: 'Kogenud tehniline nõustamine',
            aboutWhyGuidanceText: 'Saate asjatundlikku nõu masinate hoolduse, kasutamise ja tehniliste küsimuste kohta vastavalt teie tehnikale ja vajadustele.',
            aboutWhyWarrantyTitle: 'Garantii ja meelerahu',
            aboutWhyWarrantyText: 'Remonditööde garantii ja tootja varuosagarantii annavad kindluse, et teie tehnika taga on usaldusväärne tugi.',
            allCategoriesHeading: 'Kõik kategooriad',
            allIndustriesHeading: 'Kõik valdkonnad',
            allBrandsHeading: 'Kõik kaubamärgid',
            categoriesMetaTitle: 'Tehnika kategooriad | ETR Tehnika',
            categoriesMetaDescription: 'Sirvi ETR Tehnika kategooriaid ekskavaatoritest ja laaduritest generaatorite, kompressorite, pealesõidurampide ja pinnakaitseni.',
            industriesMetaTitle: 'Valdkonnad, mida toetame | ETR Tehnika',
            industriesMetaDescription: 'Leia sobiv tehnika ehituseks, põllumajanduseks, metsanduseks, taristutöödeks, haljastuseks ja materjalikäitluseks üle Eesti.',
            brandsMetaTitle: 'Tehnikabrändid | ETR Tehnika',
            brandsMetaDescription: 'Sirvi ETR Tehnika usaldusväärseid masinabrände, sealhulgas Shantui, Heracles, Loncin, Lantzmann, Geoworks ja teised.',
            categoryCompressors: 'Kompressorid',
            categoryCompressorsDescription: 'Suruõhk ja objektitööd',
            categoryGrasshoppers: 'Pinnasetugevdajad',
            categoryGrasshoppersDescription: 'Pinnase stabiilsus ja tugevdamine',
            categoryAccessRamps: 'Pealesõidurambid',
            categoryAccessRampsDescription: 'Ohutu ligipääs ja lihtne laadimine',
            categoryProtectionMats: 'Kaitsematid',
            categoryProtectionMatsDescription: 'Pinnase ja katete kaitse',
            brandShantuiDescription: 'Võimas ehitustehnika nõudlikeks töödeks.',
            brandHeraclesDescription: 'Mitmekülgsed laadurid igapäevaseks tööks.',
            brandLoncinDescription: 'Usaldusväärsed ATV-d ja tarbesõidukid tööks ning seiklusteks.',
            brandLantzmannDescription: 'Praktiline metsandus- ja puidutöötehnika, mis on loodud tulemusi andma.',
            brandGeoworksDescription: 'Vastupidavad pinnasetugevdus- ja ligipääsulahendused.',
            brandBertzDescription: 'Täpsed ja mitmekülgsed kompaktekskavaatorid.',
            brandCastloadersDescription: 'Kompaktsed liigendraamiga laadurid keerukatesse tingimustesse.',
            brandAflatekDescription: 'Töökindel suruõhutehnika professionaalseks kasutuseks.',
            allEquipmentHeading: 'Kogu tehnika',
            catalogueMetaTitle: 'Kogu tehnika | ETR Tehnika',
            catalogueMetaDescription: 'Sirvi ETR Tehnika masinaid ning filtreeri valikut kategooria, kaubamärgi, saadavuse ja hinna järgi.',
            filtersHeading: 'Filtrid',
            applyFilters: 'Rakenda filtrid',
            showFilters: 'Näita filtreid',
            servicePageHeading: 'Hooldus ja garantii',
            financingPageHeading: 'Finantseerimisvõimalused',
            tradeInPageHeading: 'Tehnika vahetusvõimalused',
            contactPageHeading: 'Võta ühendust',
            contactMetaTitle: 'Võta ühendust | ETR Tehnika müük ja tugi',
            contactMetaDescription: 'Võta ETR Tehnikaga ühendust masinate müügi, finantseerimise, hoolduse ja praktilise tehnilise toe küsimustes üle Eesti.',
            contactStart: 'Alustame vestlust',
            contactIntro: 'Võta meie meeskonnaga ühendust tehnika, finantseerimise või hoolduse küsimustes <br>ning saa oma vajadustele vastavat praktilist nõu.',
            contactPhone: 'Telefoninumber',
            contactPhoneShort: 'Telefon',
            contactEmail: 'E-post',
            contactSocial: 'Sotsiaalmeedia',
            contactOffice: 'Kontor',
            contactAddressRegion: 'Harju maakond, Eesti',
            contactSpecialist: 'Räägi spetsialistiga',
            formName: 'Nimi',
            formMessage: 'Sõnum',
            formSend: 'Saada sõnum',
            formSuccessHeading: 'Sõnum saadetud',
            formSuccessText: 'Aitäh. Meie meeskonna liige võtab sinuga peagi ühendust.',
            formSendAnother: 'Saada uus sõnum'
        }
    };

    const readStoredLanguage = () => {
        try {
            return window.localStorage.getItem('etr-language');
        } catch {
            return null;
        }
    };

    const storeLanguage = language => {
        try {
            window.localStorage.setItem('etr-language', language);
        } catch {
            // Translation still works when storage is unavailable.
        }
    };

    const setLanguage = language => {
        const selected = translations[language] ? language : 'en';

        document.documentElement.lang = selected;
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const value = translations[selected][element.dataset.i18n];
            if (value) element.innerHTML = value;
        });

        document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
            const value = translations[selected][element.dataset.i18nAriaLabel];
            if (value) element.setAttribute('aria-label', value);
        });

        document.querySelectorAll('[data-i18n-content]').forEach(element => {
            const value = translations[selected][element.dataset.i18nContent];
            if (value) element.setAttribute('content', value);
        });

        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const value = translations[selected][element.dataset.i18nTitle];
            if (value) document.title = value;
        });

        languageOptions.forEach(option => {
            const isSelected = option.dataset.language === selected;
            option.classList.toggle('active', isSelected);
            option.setAttribute('aria-pressed', String(isSelected));
        });

        languageButton?.setAttribute(
            'aria-label',
            selected === 'en' ? 'Choose language, English selected' : 'Vali keel, valitud eesti keel'
        );
        storeLanguage(selected);
        document.dispatchEvent(new CustomEvent('etr:languagechange', {
            detail: { language: selected }
        }));
    };

    const setLanguageMenu = open => {
        languageButton?.classList.toggle('active', open);
        languageSelect?.classList.toggle('active', open);
        languageButton?.setAttribute('aria-expanded', String(open));
        languageSelect?.setAttribute('aria-hidden', String(!open));
    };

    const closeMobileMenu = (restoreFocus = false) => {
        if (!mobileMenu?.classList.contains('active')) return;

        mobileMenu.classList.remove('active');
        backgroundBlur?.classList.remove('active');
        document.body.classList.remove('nav-open');
        menuButton?.setAttribute('aria-expanded', 'false');
        menuButton?.setAttribute('aria-label', 'Open navigation');
        mobileMenu.setAttribute('aria-hidden', 'true');

        if (restoreFocus) menuButton?.focus({ preventScroll: true });
    };

    const openMobileMenu = () => {
        if (!mobileMenu || !mobileBreakpoint.matches) return;

        setLanguageMenu(false);
        mobileMenu.classList.add('active');
        backgroundBlur?.classList.add('active');
        document.body.classList.add('nav-open');
        menuButton?.setAttribute('aria-expanded', 'true');
        menuButton?.setAttribute('aria-label', 'Close navigation');
        mobileMenu.setAttribute('aria-hidden', 'false');
        closeButton?.focus({ preventScroll: true });
    };

    languageButton?.addEventListener('click', event => {
        event.stopPropagation();
        const willOpen = !languageSelect?.classList.contains('active');
        setLanguageMenu(willOpen);
    });

    languageSelect?.addEventListener('click', event => {
        const option = event.target.closest('[data-language]');
        if (option) setLanguage(option.dataset.language);
        setLanguageMenu(false);
    });

    menuButton?.addEventListener('click', event => {
        event.stopPropagation();
        if (mobileMenu?.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    closeButton?.addEventListener('click', () => closeMobileMenu(true));
    backgroundBlur?.addEventListener('click', () => {
        setLanguageMenu(false);
        closeMobileMenu();
    });

    mobileMenu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => closeMobileMenu());
    });

    document.addEventListener('click', event => {
        const enquiryLink = event.target.closest('[data-enquire-url]');
        if (enquiryLink) {
            event.preventDefault();
            event.stopPropagation();
            window.location.assign(enquiryLink.dataset.enquireUrl);
            return;
        }

        if (!languageSelect?.contains(event.target) && !languageButton?.contains(event.target)) {
            setLanguageMenu(false);
        }
    });

    document.addEventListener('keydown', event => {
        const enquiryLink = event.target.closest('[data-enquire-url]');
        if (!enquiryLink || (event.key !== 'Enter' && event.key !== ' ')) return;
        event.preventDefault();
        window.location.assign(enquiryLink.dataset.enquireUrl);
    });

    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;

        if (mobileMenu?.classList.contains('active')) {
            closeMobileMenu(true);
        } else if (languageSelect?.classList.contains('active')) {
            setLanguageMenu(false);
            languageButton?.focus({ preventScroll: true });
        }
    });

    mobileBreakpoint.addEventListener('change', event => {
        if (!event.matches) closeMobileMenu();
    });

    if (document.body.classList.contains('home-page')) {
        let lastScroll = window.scrollY;
        let scrollDistance = 0;
        const scrollThreshold = 60;

        window.addEventListener('scroll', () => {
        if (mobileMenu?.classList.contains('active') || languageSelect?.classList.contains('active')) return;

        const currentScroll = window.scrollY;
        const delta = currentScroll - lastScroll;

        if (Math.sign(delta) !== Math.sign(scrollDistance)) scrollDistance = 0;
        scrollDistance += delta;

        if (currentScroll <= 30) {
            nav.style.transform = 'translateY(0%)';
            scrollDistance = 0;
        } else if (scrollDistance >= scrollThreshold) {
            nav.style.transform = 'translateY(-101%)';
            setLanguageMenu(false);
            scrollDistance = 0;
        } else if (scrollDistance <= -scrollThreshold) {
            nav.style.transform = 'translateY(0%)';
            scrollDistance = 0;
        }

            lastScroll = currentScroll;
        }, { passive: true });
    } else {
        nav.style.transform = 'none';
    }

    mobileMenu?.setAttribute('aria-hidden', 'true');
    setLanguage(readStoredLanguage() || 'en');
})();
