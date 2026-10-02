/* ============================================================
   LEONIDA.RPF — GTA VI EDITIONS & PURCHASE REFERENCE DATABASE
   ------------------------------------------------------------
   Single source of truth for editions.html.

   This file records the market EXACTLY as Rockstar has documented
   it. Five distinct concepts are kept separate and must never be
   collapsed into one another:

     category: "game-edition"       Standard / Ultimate
     category: "upgrade"            Ultimate Edition Upgrade
     category: "purchase-format"    Digital / Physical Code-in-Box
     category: "preorder-benefit"   Vintage VC Pack / GTA+ month
     category: "collector-product"  The Goodtime State VC Collection

   Nothing here is a recommendation. No "best edition", no "worth
   it". Objective differences only, so the visitor decides.

   Every record carries its own provenance so a future maintainer
   can re-verify or expire a claim without touching page markup.

   To add a future offering: append one object to the relevant
   array below. No structural change is required.
   ============================================================ */

const EDITIONS_VERIFIED = "2026-10-02";

/* ------------------------------------------------------------
   SOURCES — every outbound link used on the page.
   type follows the project's sourcing hierarchy:
   "primary-official" > "platform-store" > "observation"
   ------------------------------------------------------------ */
const EDITION_SOURCES = {
    viSite: {
        id: "viSite",
        label: "Rockstar Games — Grand Theft Auto VI official site",
        type: "primary-official",
        typeLabel: "OFFICIAL — PRIMARY",
        url: "https://www.rockstargames.com/VI",
        note: "Edition selector, Ultimate Edition carousel, pre-order bonus carousel, Collector's Box teaser."
    },
    storeGame: {
        id: "storeGame",
        label: "Rockstar Store — Grand Theft Auto VI product page",
        type: "primary-official",
        typeLabel: "OFFICIAL — PRIMARY",
        url: "https://store.rockstargames.com/game/buy-gta-vi",
        note: "Compare Editions, code-in-box statement, physical price, full FAQ, pre-load date, store regions."
    },
    storeCollection: {
        id: "storeCollection",
        label: "Rockstar Store — The Goodtime State – Vice City Collection",
        type: "primary-official",
        typeLabel: "OFFICIAL — PRIMARY",
        url: "https://store.rockstargames.com/merchandise/gtavi-goodtime-state-vice-city-collection",
        note: "Collector's Box price, contents, dimensions, safety notice, ship date, purchase limit."
    },
    nwPreorder: {
        id: "nwPreorder",
        label: "Rockstar Newswire — Pre-Order Grand Theft Auto VI on June 25",
        type: "primary-official",
        typeLabel: "OFFICIAL — NEWSWIRE",
        url: "https://www.rockstargames.com/newswire/article/5171972o3ak5oa/pre-order-grand-theft-auto-vi-on-june-25",
        note: "Pre-order opening date, edition launch, pre-load and physical availability statements."
    },
    nwCollection: {
        id: "nwCollection",
        label: "Rockstar Newswire — Pre-Order The Goodtime State – Vice City Collection",
        type: "primary-official",
        typeLabel: "OFFICIAL — NEWSWIRE",
        url: "https://www.rockstargames.com/newswire/article/9k2a49ook82o57/pre-order-the-goodtime-state-vice-city-collection-now-while-supplies-l",
        note: "Collector's Box pre-order announcement, September 24, 2026."
    },
    psConcept: {
        id: "psConcept",
        label: "PlayStation Store — Grand Theft Auto VI (US)",
        type: "platform-store",
        typeLabel: "PLATFORM STORE",
        url: "https://store.playstation.com/en-us/concept/10000730",
        note: "US edition pricing, edition content bullets, pre-order bonus terms, PS5 Pro Enhanced."
    },
    psUpgrade: {
        id: "psUpgrade",
        label: "PlayStation Store — Grand Theft Auto VI: Ultimate Edition Upgrade",
        type: "platform-store",
        typeLabel: "PLATFORM STORE",
        url: "https://store.playstation.com/en-us/product/EP1004-PPSA01547_00-ULTEDTIONUPGRADE",
        note: "Full itemised Ultimate Edition content descriptions and destination list."
    },
    xbGame: {
        id: "xbGame",
        label: "Microsoft Store — Grand Theft Auto VI (US)",
        type: "platform-store",
        typeLabel: "PLATFORM STORE",
        url: "https://www.xbox.com/en-us/games/store/grand-theft-auto-vi/9nl3wwnzlzzn",
        note: "US edition pricing, add-on decomposition, 180-day GTA+ redemption window."
    },
    xbGameGB: {
        id: "xbGameGB",
        label: "Microsoft Store — Grand Theft Auto VI (UK)",
        type: "platform-store",
        typeLabel: "PLATFORM STORE",
        url: "https://www.xbox.com/en-gb/games/store/grand-theft-auto-vi/9nl3wwnzlzzn",
        note: "UK pricing for comparison against US figures."
    },
    xbUpgrade: {
        id: "xbUpgrade",
        label: "Microsoft Store — Grand Theft Auto VI: Ultimate Edition Upgrade",
        type: "platform-store",
        typeLabel: "PLATFORM STORE",
        url: "https://www.xbox.com/en-US/games/store/grand-theft-auto-vi-ultimate-edition-upgrade/9pn4llbr8rch",
        note: "Upgrade add-on product page and description."
    },
    psTerms: {
        id: "psTerms",
        label: "PlayStation Support — GTA VI offer terms",
        type: "primary-official",
        typeLabel: "OFFICIAL — PLATFORM TERMS",
        url: "https://www.playstation.com/support/games/gta-vi-offer-terms/",
        note: "Referenced by the PlayStation Store listing for GTA+ redemption terms and expiry."
    }
};

/* ------------------------------------------------------------
   STATUS VOCABULARY
   Availability is a recorded observation, not a promise. Each
   status is timestamped so the archive preserves history instead
   of silently overwriting the current store state.
   ------------------------------------------------------------ */
const AVAILABILITY = {
    preorder:   { label: "AVAILABLE FOR PRE-ORDER",     pill: "status-observed" },
    purchase:   { label: "AVAILABLE FOR PURCHASE",     pill: "status-confirmed" },
    upgrade:    { label: "UPGRADE AVAILABLE",          pill: "status-observed" },
    closed:     { label: "PRE-ORDER WINDOW CLOSED",    pill: "status-unresolved" },
    ended:      { label: "NO LONGER AVAILABLE",        pill: "status-disproven" },
    announced:  { label: "ANNOUNCED",                  pill: "status-reported" },
    unknown:    { label: "UNKNOWN",                    pill: "status-unresolved" }
};

/* ------------------------------------------------------------
   GAME EDITIONS
   Two exist. Rockstar publishes no third game edition.
   "Deluxe", "Collector's Edition", "Gold" and "Premium" as
   applied to the GAME are not official product names and are
   never used as such anywhere on this page.
   ------------------------------------------------------------ */
const GAME_EDITIONS = [
    {
        id: "gta6-standard",
        category: "game-edition",
        name: "Grand Theft Auto VI — Standard Edition",
        shortName: "Standard Edition",
        tagline: "The base game.",
        officialName: "Standard Edition",
        formats: ["digital", "code-in-box"],
        platforms: ["ps5", "xbox-series"],
        status: "preorder",
        statusVerified: EDITIONS_VERIFIED,
        includes: ["Grand Theft Auto VI"],
        officialDescription:
            "Get the standard edition of Grand Theft Auto VI along with pre-order bonuses.",
        image: "images/ed_standard_thumb.jpg",
        imageAlt: "Grand Theft Auto VI Standard Edition key art from the Rockstar Store comparison panel.",
        imageCaption: "OFFICIAL ARTWORK — ROCKSTAR STORE",
        prices: [
            { label: "US Digital / Code-in-Box", amount: "$79.99", currency: "USD", region: "US", platform: "Rockstar Store", status: "observed", sourceId: "storeGame" },
            { label: "US Standard Edition",      amount: "$79.99", currency: "USD", region: "US", platform: "PlayStation 5", status: "observed", sourceId: "psConcept" },
            { label: "US Standard Edition",      amount: "$79.99", currency: "USD", region: "US", platform: "Xbox Series X|S", status: "observed", sourceId: "xbGame" },
            { label: "UK Standard Edition",      amount: "£69.99", currency: "GBP", region: "UK", platform: "Xbox Series X|S", status: "observed", sourceId: "xbGameGB" }
        ],
        purchaseLinks: [
            { label: "ROCKSTAR STORE",  url: "https://store.rockstargames.com/game/buy-gta-vi", sourceId: "storeGame" },
            { label: "PLAYSTATION STORE", url: "https://store.playstation.com/en-us/product/EP1004-PPSA01547_00-GTAVISTANDARD001", sourceId: "psConcept" },
            { label: "XBOX STORE", url: "https://www.xbox.com/en-US/games/store/grand-theft-auto-vi/9p3h4968grsm", sourceId: "xbGame" }
        ],
        sources: ["viSite", "storeGame", "psConcept", "xbGame", "nwPreorder"]
    },
    {
        id: "gta6-ultimate",
        category: "game-edition",
        name: "Grand Theft Auto VI — Ultimate Edition",
        shortName: "Ultimate Edition",
        tagline: "The base game plus the documented Ultimate Edition content.",
        officialName: "Ultimate Edition",
        formats: ["digital"],
        platforms: ["ps5", "xbox-series"],
        status: "preorder",
        statusVerified: EDITIONS_VERIFIED,
        includes: ["Grand Theft Auto VI", "Ultimate Edition content (see below)"],
        officialDescription:
            "An exclusive collection of items threaded across all aspects of Jason and Lucia's story.",
        image: "images/ed_ultimate_boxart.jpg",
        imageAlt: "Grand Theft Auto VI Ultimate Edition promotional box art from the Rockstar Store comparison panel.",
        imageCaption: "OFFICIAL ARTWORK — ROCKSTAR STORE",
        prices: [
            { label: "US Ultimate Edition", amount: "$99.99", currency: "USD", region: "US", platform: "PlayStation 5", status: "observed", sourceId: "psConcept" },
            { label: "US Ultimate Edition", amount: "$99.99", currency: "USD", region: "US", platform: "Xbox Series X|S", status: "observed", sourceId: "xbGame" },
            { label: "UK Ultimate Edition", amount: "£89.99", currency: "GBP", region: "UK", platform: "Xbox Series X|S", status: "observed", sourceId: "xbGameGB" }
        ],
        purchaseLinks: [
            { label: "ROCKSTAR STORE", url: "https://store.rockstargames.com/game/buy-gta-vi", sourceId: "storeGame" },
            { label: "PLAYSTATION STORE", url: "https://store.playstation.com/en-us/product/EP1004-PPSA01547_00-GTAVIULTIMATE001", sourceId: "psConcept" },
            { label: "XBOX STORE", url: "https://www.xbox.com/en-US/games/store/grand-theft-auto-vi/9p3h4968grsm", sourceId: "xbGame" }
        ],
        sources: ["viSite", "storeGame", "psConcept", "psUpgrade", "xbGame", "nwPreorder"]
    }
];

/* ------------------------------------------------------------
   ULTIMATE EDITION CONTENT
   Every item Rockstar lists, each with its own official
   description. Deliberately NOT collapsed into "cars and guns" —
   the granular list is the point of the record.

   group: "content"     = granted in-game.
   group: "destination" = a location open only with this edition.
   Both come from the same Ultimate Edition Upgrade product
   description, which is the most complete official wording
   available (PlayStation / Microsoft add-on pages).
   ------------------------------------------------------------ */
const ULTIMATE_CONTENT = [
    {
        id: "grotti-cheetah",
        group: "content",
        name: "’95 Grotti Cheetah",
        type: "Vehicle",
        description: "Grotti's signature mid ’90s sports car and ode to Shore Drive, the ’95 Grotti Cheetah is complete with a minimalist, retro-futuristic livery and available to punctuate later-stage action."
    },
    {
        id: "hawk-little-morgan",
        group: "content",
        name: "Hawk & Little Morgan Revolvers",
        type: "Weapons",
        description: "His and hers versions of this powerful revolver with classic Vice City stylings sourced from the Vercetti Estate, including palm-tree-etched grips, engraved detailing, and high-performance scope."
    },
    {
        id: "personalized-weapon-variants",
        group: "content",
        name: "Personalized Weapon Variants",
        type: "Weapons",
        description: "Personalized sidearms with detailed engravings for Jason's Girardi ES9 pistol and Lucia's Klose K17 pistol."
    },
    {
        id: "vice-city-style",
        group: "content",
        name: "Vice City Style",
        type: "Appearance",
        description: "Whether poolside or side by side, Jason and Lucia can look the part with exclusive outfits, tattoos, and more."
    },
    {
        id: "jason-safehouse-vehicles",
        group: "content",
        name: "Jason’s Safehouse Vehicles",
        type: "Vehicles",
        description: "Switch gears and soak up the sun in an Army fatigue-tinged Dinka Enduro motorcycle or Crest Kayak."
    },
    {
        id: "ganado-retro-build",
        group: "content",
        name: "Ganado Retro Build",
        type: "Vehicle modification",
        description: "Inject some muscle and classic stylings into Jason's well-worn Vapid Ganado low-riding pickup with exclusive mods."
    },
    {
        id: "shitzu-squalo",
        group: "content",
        name: "Shitzu Squalo",
        type: "Watercraft",
        description: "Perfect for casting in Gambit Bay and reeling in catches of all sorts, this gradient pink and blue Squalo docked at Washington Beach is made open-ocean-ready with an explosives-laden weapons crate."
    },
    {
        id: "dominator-buggy",
        group: "content",
        name: "’67 Vapid Dominator Buggy & Garage",
        type: "Vehicle + garage",
        description: "A Mud Club monster offering impressive off-road handling for the backwoods of Mount Kalaga and beyond. Conveniently store it at the Paradise Garage in Watson Bay, which features a weapon locker plus a secure place to deposit stolen goods to be fenced."
    },
    {
        id: "goodtime-gear",
        group: "content",
        name: "Goodtime Gear",
        type: "Apparel",
        description: "A capsule collection of apparel and accessories inspired by the Goodtime State’s hit TV show character, Macca the Gator."
    },
    {
        id: "ptt-youngins",
        group: "content",
        name: "PTT Youngin$ Compound",
        type: "Gang compound",
        description: "Raid the compound of one of Southside Vice City’s loudest and most socially active gangs and escape safely to score some special items and distinct contraband."
    },
    {
        id: "classic-car-collection",
        group: "content",
        name: "Classic Car Collection",
        type: "Commission",
        description: "Track down a variety of abandoned classic and work-in-progress project cars and revitalize them to their former glory in this special commission from eccentric collector and local fixer, Wyman."
    },
    {
        id: "rideout-customs",
        group: "destination",
        name: "Rideout Customs",
        type: "Mod shop",
        description: "Transform vanilla vehicles into magnificent works of art with detailed interiors, exquisite rims, and donk stylings. Only open for business with the Ultimate Edition."
    },
    {
        id: "sara-unisex-salon",
        group: "destination",
        name: "Sara’s Unisex Salon",
        type: "Salon",
        description: "Get signature salon styles for both Jason and Lucia, including facial hair for Jason and makeup and nails for Lucia. Only open for business with the Ultimate Edition."
    },
    {
        id: "stock-305",
        group: "destination",
        name: "Stock 305",
        type: "Clothing store",
        description: "Style various unique and exclusive looks for Jason and Lucia at Stockyard’s premier destination for elevated streetwear. Only open for business with the Ultimate Edition."
    },
    {
        id: "electric-fang-tattoo",
        group: "destination",
        name: "Electric Fang Tattoo",
        type: "Tattoo parlor",
        description: "Choose from over 50 signature tattoos for both Jason and Lucia — all designed by the artist collective FAILE at Stockyard’s most iconic ink bar."
    },
    {
        id: "one-eyed-willies",
        group: "destination",
        name: "One-Eyed Willie’s",
        type: "Mod shop",
        description: "Visit Lake Leonida’s storied mod shop, specializing in off-road modifications and hand-painted automotive artistry. Only open for business with the Ultimate Edition."
    }
];

/* ------------------------------------------------------------
   ULTIMATE EDITION UPGRADE
   NOT a third edition and NOT a bundle. It is a separately
   purchasable add-on for people who already own Standard.
   ------------------------------------------------------------ */
const UPGRADE = {
    id: "gta6-ultimate-upgrade",
    category: "upgrade",
    name: "Grand Theft Auto VI: Ultimate Edition Upgrade",
    shortName: "Ultimate Edition Upgrade",
    tagline: "A separately purchasable add-on for Standard Edition owners.",
    whoCanBuy: "Owners of Grand Theft Auto VI: Standard Edition (digital, including a redeemed physical code-in-box).",
    where: "PlayStation Store and Microsoft Store, as a product add-on.",
    when: "Pre-orderable before launch; the Rockstar Store states a purchased game can be upgraded 'at any time' on PlayStation Store.",
    physicalEligibility:
        "Physical Standard Edition owners qualify once they redeem the download code from the box. The box itself carries no entitlement on its own.",
    requirement:
        "The PlayStation add-on listing states: Grand Theft Auto VI is required to access this content. GTAVI is sold separately.",
    adds: "The full Ultimate Edition content list — the eleven granted items and the five exclusive destinations recorded in ULTIMATE_CONTENT.",
    status: "preorder",
    statusVerified: EDITIONS_VERIFIED,
    image: "images/ed_ultimate_boxart.jpg",
    imageAlt: "Ultimate Edition artwork used by the platform add-on listings.",
    imageCaption: "OFFICIAL ARTWORK — ULTIMATE EDITION UPGRADE ADD-ON",
    prices: [
        { label: "US Ultimate Edition Upgrade", amount: "$20.00", currency: "USD", region: "US", platform: "Xbox Series X|S", status: "observed", sourceId: "xbGame" },
        { label: "UK Ultimate Edition Upgrade", amount: "£20.00", currency: "GBP", region: "UK", platform: "Xbox Series X|S", status: "observed", sourceId: "xbGameGB" },
        { label: "PlayStation upgrade price", amount: null, currency: "USD", region: "US", platform: "PlayStation 5", status: "unknown", sourceId: "psConcept", note: "Listed as an add-on; no public price captured at verification time." }
    ],
    purchaseLinks: [
        { label: "PLAYSTATION STORE", url: "https://store.playstation.com/en-us/product/EP1004-PPSA01547_00-ULTEDTIONUPGRADE", sourceId: "psUpgrade" },
        { label: "XBOX STORE", url: "https://www.xbox.com/en-US/games/store/grand-theft-auto-vi-ultimate-edition-upgrade/9pn4llbr8rch", sourceId: "xbUpgrade" }
    ],
    sources: ["storeGame", "psUpgrade", "xbUpgrade", "viSite"]
};

/* ------------------------------------------------------------
   PURCHASE FORMATS
   A format is how you receive the product. It is not an edition.
   ------------------------------------------------------------ */
const PURCHASE_FORMATS = [
    {
        id: "digital",
        category: "purchase-format",
        name: "Digital",
        shortName: "Digital",
        description: "The game delivered as a download to your platform account. No physical object is produced or shipped.",
        appliesTo: ["Grand Theft Auto VI — Standard Edition", "Grand Theft Auto VI — Ultimate Edition"],
        requirement: "An internet connection and a platform account are required to download the game.",
        status: "preorder",
        statusVerified: EDITIONS_VERIFIED,
        sources: ["viSite", "storeGame", "psConcept", "xbGame"]
    },
    {
        id: "code-in-box",
        category: "purchase-format",
        name: "Physical — Code-in-Box",
        shortName: "Physical (Code-in-Box)",
        description: "A physical retail box that contains a download code. NO DISC IS INCLUDED.",
        criticalDetail:
            "The box does not contain a game disc. Rockstar states the physical version contains a download code inside the box, present so the game can be pre-loaded on November 12, 2026.",
        appliesTo: ["Grand Theft Auto VI — Standard Edition only"],
        notAvailableFor: ["Grand Theft Auto VI — Ultimate Edition"],
        shippingStart: "November 12, 2026",
        shippingAfterLaunch: "After launch, physical orders ship in an estimated 1–7 days depending on the shipping option chosen at checkout.",
        availabilityNote: "Sold while supplies last, per the Rockstar Store listing.",
        status: "preorder",
        statusVerified: EDITIONS_VERIFIED,
        image: "images/ed_codeinbox.jpg",
        imageAlt: "GTA VI code-in-box physical packaging, flat front view, Sony variant.",
        imageCaption: "OFFICIAL PACKAGING — ROCKSTAR STORE",
        sources: ["storeGame", "nwPreorder", "viSite"]
    }
];

/* ------------------------------------------------------------
   CODE-IN-BOX RULES
   Documented separately because "physical" otherwise implies a
   disc, which is the single most common misreading.
   ------------------------------------------------------------ */
const CODE_IN_BOX = {
    id: "code-in-box-detail",
    containsDisc: false,
    containsCode: true,
    intro:
        "A code-in-box product is a physical package whose only functional contents are a printed download code and artwork. The game itself is always delivered digitally.",
    rules: [
        { label: "What is physically inside", value: "A printed download code, packaging and inserts. Rockstar states a disc will not be included in the box." },
        { label: "What is digitally redeemed", value: "The code redeems Grand Theft Auto VI: Standard Edition digitally against your platform account." },
        { label: "Does a disc exist", value: "No. The Rockstar Store states plainly: 'A disc will not be included in the box.'" },
        { label: "Why it exists", value: "The code allows pre-loading to begin on November 12, 2026 so a physical buyer can play at launch on November 19, 2026." },
        { label: "Shipping timing", value: "Shipping becomes available from November 12, 2026. After launch, orders ship in an estimated 1–7 days depending on the selected shipping option." },
        { label: "Tracking", value: "A shipping confirmation email with a tracking link is sent when the order ships. Some orders ship in multiple boxes, each with its own tracking number." },
        { label: "Purchase limit", value: "Limited to 1 purchase per person on the Rockstar Store." },
        { label: "Cancelling a pre-order", value: "Rockstar directs customers to contact its fulfilment partner Xsolla directly using the physical-item cancellation form, with order number and ordering email to hand." },
        { label: "Shipping regions", value: "Austria, Belgium, Canada, Czechia, Denmark, Finland, France, Germany, Ireland, Italy, Luxembourg, Netherlands, Norway, Poland, Portugal, Spain, Sweden, Switzerland, United Kingdom, United States. Duties and taxes may apply outside the US and UK." }
    ],
    codeRestrictions: {
        note: "PlayStation codes are region-locked. The Rockstar Store publishes three groupings.",
        groups: [
            { region: "North America", rule: "Purchases shipped to the United States and Canada only work for customers holding a PlayStation account registered to those countries." },
            { region: "United Kingdom", rule: "Purchases shipped to the United Kingdom only work for customers holding a PlayStation account in that country." },
            { region: "EU and Rest of Europe", rule: "Purchases shipped to any other Rockstar Store country only work for customers holding a PlayStation account in Austria, Belgium, Czechia, Denmark, Finland, France, Germany, Ireland, Italy, Luxembourg, Netherlands, Norway, Poland, Portugal, Spain, Sweden or Switzerland." }
        ],
        xboxHandling:
            "The published code-locking detail is expressed in PlayStation account terms. The Rockstar Store does not publish an equivalent PlayStation-style account matrix for Microsoft Store codes.",
        upgradeEffect:
            "Redeeming a code-in-box code produces a digital Standard Edition entitlement — the same entitlement that makes the Ultimate Edition Upgrade purchasable."
    }
};

/* ------------------------------------------------------------
   PRE-ORDER BENEFITS
   Temporary purchase-window incentives. They are NOT permanent
   game content and NOT part of any edition.
   ------------------------------------------------------------ */
const PREORDER_BENEFITS = [
    {
        id: "vintage-vice-city-pack",
        category: "preorder-benefit",
        name: "Vintage Vice City Pack",
        shortName: "Vintage Vice City Pack",
        tagline: "A pre-order bonus, not part of either edition.",
        officialLine: "Pre-order to get unique benefits that flash back to when the neon burned brightest.",
        eligibility: "All Grand Theft Auto VI pre-orders and purchases made before November 20, 2026.",
        deadline: "November 20, 2026 (Rockstar Store wording: order before November 20).",
        additionalCost: "No additional cost, per the Rockstar Store listing.",
        availabilityNote: "Listed on the platform stores as a separate pre-order bonus line item, separate from edition content.",
        status: "preorder",
        statusVerified: EDITIONS_VERIFIED,
        image: "images/VINTAGE_VICE_CITY_PACK_EXCLUSIVE_LOOKS.webp",
        imageAlt: "Vintage Vice City Pack exclusive looks promotional art.",
        imageCaption: "OFFICIAL PRE-ORDER BONUS ARTWORK",
        contents: [
            { name: "’55 Vapid Stanier Sedan", type: "Vehicle", description: "Cruise Shore Drive in this classic sedan." },
            { name: "Garage", type: "Personal garage", description: "The Shore Court personal garage, a stone's throw from the sands of Ocean Beach. It features a weapon locker plus a secure place to deposit stolen goods to be fenced." },
            { name: "Outfits & Hairstyles", type: "Appearance", description: "Exclusive looks for Jason and Lucia." },
            { name: "Exclusive Weapon Pattern", type: "Weapon skin", description: "Channel the Original Kingpin — a tropical-patterned weapon finish." }
        ],
        sources: ["viSite", "storeGame", "psConcept", "xbGame", "nwPreorder"]
    },
    {
        id: "gta-plus-month",
        category: "preorder-benefit",
        name: "One Month of GTA+",
        shortName: "One Month of GTA+",
        tagline: "A pre-order benefit. GTA+ is not permanently included with GTA VI.",
        officialLine: "Pre-order Grand Theft Auto VI and get one month of GTA+ on PlayStation 5 at no extra cost.",
        eligibility: "Players who pre-order digital versions of Grand Theft Auto VI. The Rockstar Store lists this specifically as a DIGITAL STORE pre-order bonus.",
        deadline: "Purchase prior to 19 November 2026 at 23:59:59 on PlayStation Store; the Rockstar Store states pre-order from PlayStation Store or Microsoft Store before November 20, 2026.",
        autoRenew: "After the free month, memberships auto-renew monthly at the regular monthly price until cancelled. Cancel at any time.",
        accountLimit: "Limited to one redemption per account, regardless of additional purchases. The subscription is non-transferable and can only be redeemed on the account used to pre-order.",
        redemption: {
            ps: ["Visit PlayStation Store and sign in to the same account used to pre-order GTA VI.", "Navigate to the GTA+ page and click “Join.”", "You will see confirmation that your free month of GTA+ has started."],
            xbox: ["Visit the Microsoft Store and sign in to the same account used to pre-order GTA VI.", "Navigate to the Offers & Credits page and click “Redeem” on the GTA+ offer.", "You will see confirmation that your free month of GTA+ has started."]
        },
        redemptionExpiry: {
            ps: "Must be redeemed on PlayStation Store by March 31, 2027.",
            xbox: "Must be redeemed within 180 days after your purchase of GTA VI."
        },
        platformDifference: "The redemption deadline differs by platform: a fixed calendar date on PlayStation, a rolling 180-day window on Xbox.",
        status: "preorder",
        statusVerified: EDITIONS_VERIFIED,
        sources: ["viSite", "storeGame", "psConcept", "psTerms", "xbGame"]
    }
];

/* ------------------------------------------------------------
   SEPARATE COLLECTOR PRODUCT
   Merchandise. NOT a game edition. The game is not included.
   ------------------------------------------------------------ */
const COLLECTOR_PRODUCT = {
    id: "goodtime-state-vc-collection",
    category: "collector-product",
    name: "Grand Theft Auto VI: The Goodtime State – Vice City Collection",
    shortName: "The Vice City Collection",
    tagline: "A premium Collector's Box. Merchandise — not a game edition.",
    productType: "Collector's Box — physical merchandise",
    officialDescription: "A premium Collector’s Box featuring all the essentials for a good time, inspired by Leonida’s hit TV show, Macca the Gator.",
    gameIncluded: false,
    gameIncludedEvidence:
        "The Rockstar Store product page states explicitly: “Grand Theft Auto VI game sold separately.”",
    isGameEdition: false,
    inspiration: "Leonida’s in-fiction hit television show, Macca the Gator.",
    price: { amount: "$399.99", currency: "USD", region: "US", platform: "Rockstar Store", status: "observed", sourceId: "storeCollection" },
    dimensions: "19 in x 13.5 in x 12.5 in",
    purchaseLimit: "Limited to 1 purchase per person. Purchase requires log-in to the Rockstar Store.",
    shippingNote: "This item is not eligible for free shipping.",
    availabilityNote: "Announced as a pre-order “while supplies last”; the listing describes the item as available in limited quantities.",
    shipFrom: "November 19, 2026",
    safety: "Warning: Choking hazard. Contains small parts and sharp points or edges. Not for children under 3. Adult collectibles. Not a toy. Ages 18+. Fragile.",
    status: "preorder",
    statusVerified: EDITIONS_VERIFIED,
    announced: "September 24, 2026",
    image: "images/ed_vicecity_collection_box.png",
    imageAlt: "The Goodtime State – Vice City Collection Collector's Box, closed, front view.",
    imageCaption: "OFFICIAL PRODUCT IMAGERY — ROCKSTAR STORE",
    imageOpen: "images/ed_vicecity_collection_open.png",
    contents: [
        { name: "Macca the Gator Figure", type: "Collectible", description: "Stash your valuables in the twist-open base of this figurine of Macca enjoying a smoke and a flamingo blood martini." },
        { name: "Oakley® Frogskins™ Sunglasses", type: "Accessories", description: "Block out the Leonida sun with matte black Oakley® Frogskins™ sunglasses, featuring Prizm Sapphire lenses and a Vice City pink GTAVI logo." },
        { name: "Leonida Keys Crossbody Bag", type: "Accessories", description: "Stow your essentials in a ripstop crossbody bag with patterned black and pink lining, woven patches, and a custom debossed YKK zipper pull." },
        { name: "New Era® 9FORTY Snapback Hat", type: "Accessories", description: "Look like a local in a New Era® 9FORTY A-Frame snapback hat with Vice City Leonida embellishments, embroidery, and appliques." },
        { name: "Macca the Gator Magnetic Mirror", type: "Collectible", description: "Reflect on your life choices in this electroplated pink glass mirror. Use as a tray or hang as artwork with two large rear-mounted magnets." },
        { name: "Chunkee the Manatee Shot Glass", type: "Collectible", description: "Knock one back with this shot glass featuring Chunkee the Manatee on the front and a laser-etched Rockstar Games logo on the bottom." },
        { name: "Vice City Collectible Swizzle Spoon", type: "Collectible", description: "Stir things up with a decorative spoon featuring a debossed enamel Vice City logo and a Rockstar Games logo tip." },
        { name: "Vice City Razor Blade Keychain", type: "Collectible", description: "Stay sharp with a metallic razor-blade-style keychain featuring embossed GTAVI and Vice City logos." },
        { name: "Leonida Keys Enamel Pin Set in Metal Tin", type: "Collectible", description: "Add Vice City flair anywhere with nine enamel pins in a custom tin." },
        { name: "Leonida Keys Sticker Pack in Stash Bag", type: "Collectible", description: "Nine crack-and-peel vinyl stickers in a stash bag for laptops, water bottles and anywhere else." },
        { name: "Double-Sided Souvenir Poster with Map of Leonida", type: "Collectible", description: "An illustrated Vice City Leonida poster featuring Macca the Gator characters on the front and a full map of Leonida on the back." }
    ],
    purchaseLinks: [
        { label: "ROCKSTAR STORE", url: "https://store.rockstargames.com/merchandise/gtavi-goodtime-state-vice-city-collection", sourceId: "storeCollection" }
    ],
    sources: ["storeCollection", "nwCollection", "viSite"]
};

            xbox: "Must be redeemed within 180 days after your purchase of GTA VI."

/* ------------------------------------------------------------
   PURCHASE TIMELINE
   Exact dates only, each tied to a source. Nothing inferred.
   ------------------------------------------------------------ */
const PURCHASE_TIMELINE = [
    {
        date: "2026-06-24",
        title: "Newswire announcement",
        body: "Rockstar Newswire publishes “Pre-Order Grand Theft Auto VI on June 25”, stating availability at midnight local time June 24, 2026.",
        sourceId: "nwPreorder"
    },
    {
        date: "2026-06-25",
        title: "Pre-orders open",
        body: "Global pre-orders open at midnight local time, including the Ultimate Edition. The Newswire post carries the update that GTA VI is available to pre-order globally.",
        sourceId: "nwPreorder"
    },
    {
        date: "2026-09-24",
        title: "Collector's Box pre-order",
        body: "Rockstar Newswire posts “Pre-Order The Goodtime State – Vice City Collection Now While Supplies Last”, announcing the separate collector product.",
        sourceId: "nwCollection"
    },
    {
        date: "2026-11-12",
        title: "Pre-load begins — digital and physical",
        body: "Digital pre-orders begin pre-loading on November 12. The physical code-in-box version becomes available to ship on November 12 so it can pre-load.",
        sourceId: "nwPreorder"
    },
    {
        date: "2026-11-19",
        title: "Release / Collector's Box ships",
        body: "Grand Theft Auto VI releases on PlayStation 5 and Xbox Series X|S. The Vice City Collection is stated as available to ship from this date.",
        sourceId: "storeGame"
    },
    {
        date: "2026-11-20",
        title: "Pre-order bonus cutoff",
        body: "Final day for the Vintage Vice City Pack and the free month of GTA+. The Rockstar Store states pre-orders and purchases before November 20 receive the Vintage Vice City Pack. PlayStation Store states the cutoff as 19 November 2026 at 23:59:59.",
        sourceId: "storeGame"
    },
    {
        date: "2027-03-31",
        title: "PlayStation GTA+ redemption expiry",
        body: "The free month of GTA+ must be redeemed on PlayStation Store by March 31, 2027. On Xbox the equivalent window is 180 days from purchase.",
        sourceId: "psTerms"
    }
];

/* ------------------------------------------------------------
   COMPARISON MATRIX
   Row labels are explicit about which concept each line
   describes, so an edition can never be read as a format or a
   bonus by accident.
   ------------------------------------------------------------ */
const COMPARISON_MATRIX = {
    groups: [
        {
            id: "game",
            label: "GAME EDITION",
            definition: "Which version of the game you are buying.",
            rows: [
                { label: "Official name", standard: "Grand Theft Auto VI — Standard Edition", ultimate: "Grand Theft Auto VI — Ultimate Edition" },
                { label: "Rockstar description", standard: "Get the standard edition of Grand Theft Auto VI along with pre-order bonuses.", ultimate: "An exclusive collection of items threaded across all aspects of Jason and Lucia’s story." },
                { label: "Contains the base game", standard: "Yes", ultimate: "Yes" },
                { label: "Ultimate Edition content", standard: "No", ultimate: "Yes" },
                { label: "Exclusive destinations", standard: "No", ultimate: "5 venues open only with the edition" }
            ]
        },
        {
            id: "format",
            label: "PURCHASE FORMAT",
            definition: "How the product is delivered. A format is not an edition.",
            rows: [
                { label: "Digital", standard: "Yes", ultimate: "Yes" },
                { label: "Physical (Code-in-Box)", standard: "Yes — while supplies last", ultimate: "Not available" },
                { label: "Contains a disc", standard: "No — download code only", ultimate: "No" }
            ]
        },
        {
            id: "upgrade",
            label: "UPGRADE",
            definition: "A separately purchasable add-on for people who already own the game.",
            rows: [
                { label: "Ultimate Edition Upgrade", standard: "Yes — bought separately", ultimate: "Already included" },
                { label: "Where the upgrade is sold", standard: "PlayStation Store, Microsoft Store", ultimate: "n/a — it is the content itself" }
            ]
        },
        {
            id: "bonus",
            label: "PRE-ORDER BENEFIT",
            definition: "Temporary incentives attached to the purchase window. Not permanent game content.",
            rows: [
                { label: "Vintage Vice City Pack", standard: "Yes — pre-order before Nov 20, 2026", ultimate: "Yes — pre-order before Nov 20, 2026" },
                { label: "One month of GTA+", standard: "Yes — digital pre-orders", ultimate: "Yes — digital pre-orders" },
                { label: "Part of permanent game content", standard: "No", ultimate: "No" }
            ]
        },
        {
            id: "collector",
            label: "SEPARATE COLLECTOR PRODUCT",
            definition: "Physical merchandise. Not a game edition and not a bonus.",
            rows: [
                { label: "The Goodtime State – Vice City Collection", standard: "Sold separately — game not included", ultimate: "Sold separately — game not included" }
            ]
        }
    ]
};

/* ------------------------------------------------------------
   EVIDENCE RECORD
   Each material claim gets its own row so a profile can never
   become an undifferentiated pile of assertions.
   "establishes" states what the source actually says.
   "limitations" states what it does not.
   ------------------------------------------------------------ */
const EVIDENCE_RECORDS = [
    {
        id: "EV-ED-001",
        claim: "Grand Theft Auto VI has two official game editions: Standard Edition and Ultimate Edition.",
        status: "confirmed",
        sourceId: "viSite",
        establishes: "The official site's “Choose Your Edition” selector offers exactly two tabs — Ultimate Edition (Digital) and Standard Edition (Digital or Code in Box).",
        limitations: "The selector does not enumerate every regional storefront, so it cannot rule out region-specific SKUs beyond those listed."
    },
    {
        id: "EV-ED-002",
        claim: "The Ultimate Edition is digital only.",
        status: "confirmed",
        sourceId: "viSite",
        establishes: "The edition selector labels Ultimate Edition as “Digital”, while Standard Edition is labelled “Digital or Code in Box”.",
        limitations: "Covers the selector's current labelling at verification time; a later physical Ultimate SKU would supersede this."
    },
    {
        id: "EV-ED-003",
        claim: "The physical product contains a download code and no disc.",
        status: "confirmed",
        sourceId: "storeGame",
        establishes: "The Rockstar Store states: “Physical versions will only contain a download code inside the box to support pre-load on November 12. A disc will not be included in the box.”",
        limitations: "Applies to the current physical SKU. Does not describe any future physical pressing."
    },
    {
        id: "EV-ED-004",
        claim: "The physical product is sold while supplies last.",
        status: "observed",
        sourceId: "storeGame",
        establishes: "The code-in-box panel carries the note “While supplies last, further details below”.",
        limitations: "No published stock level or restock schedule exists. Availability is not guaranteed beyond the verification date."
    },
    {
        id: "EV-ED-005",
        claim: "The Ultimate Edition Upgrade is a separately purchasable add-on for Standard Edition owners.",
        status: "confirmed",
        sourceId: "psUpgrade",
        establishes: "The upgrade is listed as its own PlayStation product add-on and states “Grand Theft Auto VI is required to access this content. GTAVI is sold separately.”",
        limitations: "Rockstar publishes no general upgrade policy document; eligibility follows from the ownership requirement stated on the add-on page."
    },
    {
        id: "EV-ED-006",
        claim: "A purchased game can be upgraded on PlayStation Store at any time.",
        status: "confirmed",
        sourceId: "storeGame",
        establishes: "The Rockstar Store's “Upgrade to the Ultimate Edition” panel states: “Purchased the game? Upgrade to the Ultimate Edition on PlayStation Store at any time.”",
        limitations: "The equivalent phrasing is not published for the Microsoft Store upgrade path."
    },
    {
        id: "EV-ED-007",
        claim: "Physical Standard Edition owners can upgrade after redeeming their code.",
        status: "inferred",
        sourceId: "storeGame",
        establishes: "The physical box yields a digital Standard Edition entitlement, and the upgrade requires only a Standard Edition copy.",
        limitations: "INFERENCE. Rockstar does not publish a sentence joining these two facts for physical buyers specifically. The chain is reasonable but not stated verbatim."
    },
    {
        id: "EV-ED-008",
        claim: "The Vintage Vice City Pack is a pre-order bonus available before November 20, 2026.",
        status: "confirmed",
        sourceId: "nwPreorder",
        establishes: "Newswire states: “All Grand Theft Auto VI pre-orders and purchases before November 20 will get the Vintage Vice City Pack.” The Rockstar Store repeats “Order before November 20 to get the Vintage Vice City Pack at no additional cost”.",
        limitations: "The Rockstar Store frames it as covering purchases, while platform stores frame it as a pre-order bonus. Same-day purchase eligibility is not separately clarified."
    },
    {
        id: "EV-ED-009",
        claim: "The one month of GTA+ applies to digital pre-orders, not physical purchases.",
        status: "confirmed",
        sourceId: "storeGame",
        establishes: "The Rockstar Store lists “Free Month of GTA+” under “Digital Store Pre-Order Bonus”, and eligibility requires pre-ordering from PlayStation Store or Microsoft Store.",
        limitations: "No explicit sentence excludes physical code-in-box buyers; the exclusion follows from the digital-store framing."
    }
];

/* Continuation of the evidence record. */
EVIDENCE_RECORDS.push(
    {
        id: "EV-ED-010",
        claim: "GTA+ redemption deadlines differ between PlayStation and Xbox.",
        status: "confirmed",
        sourceId: "storeGame",
        establishes: "PlayStation: “Must redeem on PlayStation Store by March 31, 2027.” Xbox: “Must redeem within 180 days after your purchase of GTAVI.”",
        limitations: "The two mechanisms differ in kind, not merely in date — a fixed calendar deadline versus a rolling window."
    },
    {
        id: "EV-ED-011",
        claim: "GTA+ auto-renews at the regular monthly price after the free month unless cancelled.",
        status: "confirmed",
        sourceId: "psTerms",
        establishes: "PlayStation's terms state the membership “auto-renews monthly at the regular monthly price until canceled. Cancel at any time.”",
        limitations: "Stated in PlayStation's terms for the PlayStation redemption. The Rockstar Store FAQ does not separately restate the renewal structure."
    },
    {
        id: "EV-ED-012",
        claim: "The Vice City Collection is merchandise and does not include the game.",
        status: "confirmed",
        sourceId: "storeCollection",
        establishes: "The Rockstar Store product page states: “Grand Theft Auto VI game sold separately.” It is categorised under Gear, not Games.",
        limitations: "None material. This is an explicit product-page statement."
    },
    {
        id: "EV-ED-013",
        claim: "The Vice City Collection is priced at $399.99 in the US.",
        status: "observed",
        sourceId: "storeCollection",
        establishes: "The Rockstar Store listing shows $399.99 for the product.",
        limitations: "US region only, observed at the verification date. Regional pricing for this product was not captured and may differ."
    },
    {
        id: "EV-ED-014",
        claim: "The Vice City Collection is a limited-quantity pre-order.",
        status: "observed",
        sourceId: "nwCollection",
        establishes: "Newswire announced it as “Pre-Order … Now While Supplies Last”; the store FAQ states the item is available in limited quantities with a one-per-person limit.",
        limitations: "No remaining stock figure is published. Availability may end without further notice."
    },
    {
        id: "EV-ED-015",
        claim: "No official Deluxe, Collector's, Gold or Premium game edition exists.",
        status: "confirmed",
        sourceId: "viSite",
        establishes: "The official edition selector presents only Standard and Ultimate. The Collector's Box is presented separately as a Collector's Box, not an edition.",
        limitations: "Absence of evidence at the verification date. Rockstar could introduce further SKUs later; the record is timestamped for that reason."
    },
    {
        id: "EV-ED-016",
        claim: "US pricing is $79.99 Standard and $99.99 Ultimate.",
        status: "observed",
        sourceId: "psConcept",
        establishes: "The PlayStation Store lists Standard Edition at $79.99 and Ultimate Edition at $99.99. The Microsoft Store and Rockstar Store show matching US figures.",
        limitations: "Observed at the verification date, US region. Prices can change and are not guaranteed to persist."
    },
    {
        id: "EV-ED-017",
        claim: "UK pricing differs from US pricing.",
        status: "observed",
        sourceId: "xbGameGB",
        establishes: "The UK Microsoft Store lists £69.99 Standard and £89.99 Ultimate.",
        limitations: "Only the Microsoft Store UK storefront was captured. UK PlayStation Store and Rockstar Store figures were not retrievable and are therefore not stated."
    },
    {
        id: "EV-ED-018",
        claim: "The Ultimate Edition Upgrade is listed at $20.00 in the US.",
        status: "observed",
        sourceId: "xbGame",
        establishes: "The Microsoft Store add-on listing shows $20.00 for Grand Theft Auto VI: Ultimate Edition Upgrade.",
        limitations: "Microsoft Store figure only. No PlayStation Store price for the upgrade was publicly visible, so none is asserted."
    }
);

/* ------------------------------------------------------------
   REGIONAL NOTES
   Only differences actually observed. One storefront's offering
   is never generalised to the whole world.
   ------------------------------------------------------------ */
const REGIONAL_NOTES = [
    {
        region: "United States",
        captured: true,
        prices: "Standard $79.99 · Ultimate $99.99 · Upgrade $20.00 · Collector's Box $399.99",
        note: "Captured from the PlayStation Store, Microsoft Store and Rockstar Store US storefronts.",
        sourceIds: ["psConcept", "xbGame", "storeGame", "storeCollection"]
    },
    {
        region: "United Kingdom",
        captured: true,
        prices: "Standard £69.99 · Ultimate £89.99 · Upgrade £20.00",
        note: "Captured from the Microsoft Store UK storefront only. UK PlayStation Store and Rockstar Store figures were not captured and are not asserted.",
        sourceIds: ["xbGameGB"]
    },
    {
        region: "Canada",
        captured: false,
        prices: null,
        note: "Canada sits inside the Rockstar Store's North America shipping region and the PlayStation North America code-lock group, but no Canadian price was captured. No figure is stated.",
        sourceIds: ["storeGame"]
    },
    {
        region: "Europe",
        captured: false,
        prices: null,
        note: "The Rockstar Store ships to 17 European countries and the PlayStation code-lock group lists 17 European account regions. No EU pricing was captured.",
        sourceIds: ["storeGame"]
    }
];

/* ------------------------------------------------------------
   GLOSSARY
   The distinction this section exists to preserve.
   ------------------------------------------------------------ */
const GLOSSARY = [
    { term: "STANDARD", definition: "The base game. Grand Theft Auto VI as published, with no Ultimate Edition content." },
    { term: "ULTIMATE", definition: "The base game plus the documented Ultimate Edition content — eleven granted items and five exclusive destinations." },
    { term: "ULTIMATE EDITION UPGRADE", definition: "A separately purchasable add-on for people who already own Standard Edition. Not a third edition, not a bundle." },
    { term: "PHYSICAL", definition: "A physical box containing a digital download code rather than a disc." },
    { term: "VINTAGE VICE CITY PACK", definition: "A pre-order bonus attached to the purchase window. Not part of any edition’s permanent content." },
    { term: "ONE MONTH OF GTA+", definition: "A pre-order benefit redeemed on a separate membership page. GTA+ is not permanently included with GTA VI and auto-renews unless cancelled." },
    { term: "VICE CITY COLLECTION", definition: "A separate physical Collector's Box merchandise product, not a third game edition. The Rockstar Store states the game is sold separately." }
];

