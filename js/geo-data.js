/* ============================================================
   LEONIDA.RPF — GET TO KNOW LEONIDA · GEOGRAPHIC DATABASE
   ------------------------------------------------------------
   Single source of truth for geography.html.

   THE CENTRAL FINDING OF THIS SECTION:

   Rockstar Games has officially named SEVEN places. Not
   seventy. Seven. They are the titles of Rockstar's own place
   artwork, the destinations linked from its "Only in Leonida"
   page, and one facility named in official character copy.

   A far larger list of counties, districts, neighbourhoods,
   highways, an international airport and a raceway circulates
   widely. NONE of it is established by Rockstar, and the
   community wiki that carries it banners its own Leonida page
   as possibly containing leaked development content.

   This file therefore keeps two hard separations:

     1. GEO_PLACES     — Rockstar-attributable only.
     2. GEO_UNVERIFIED — named by third parties, NOT evidence.
                          Never plotted, never used to infer
                          structure, never mixed into the map.

   Unknown stays UNKNOWN. A smaller honest map beats a
   detailed fabricated one.

   To add a place once Rockstar names it: append one object to
   GEO_PLACES and add its source ID to GEO_SOURCES. Nothing
   else in the architecture changes.
   ============================================================ */

const GEO_VERIFIED = "2026-10-02";

/* ------------------------------------------------------------
   SOURCES
   type follows the project hierarchy in README.md:
     "primary-official"       Rockstar / Take-Two, first party
     "official-marketing"     first party, promotional register
     "attributable-statement" named developer / public record
     "real-world"             genuine Earth, used ONLY for
                              comparison, never for Leonida
     "unverified"             third-party claim, NOT evidence
   ------------------------------------------------------------ */
const GEO_SOURCES = {
    viSite: {
        id: "viSite",
        label: "Rockstar Games — Grand Theft Auto VI official site",
        type: "primary-official",
        typeLabel: "OFFICIAL — PRIMARY",
        url: "https://www.rockstargames.com/VI",
        note: "Setting synopsis, the 'Only in Leonida' destination index, 'Vice City, USA.', and the 'Goodtime State' brand used on merchandise."
    },
    viPlaces: {
        id: "viPlaces",
        label: "Rockstar Games — 'Only in Leonida' (People & Places)",
        type: "primary-official",
        typeLabel: "OFFICIAL — PRIMARY",
        url: "https://www.rockstargames.com/VI/only-in-leonida",
        note: "The six linked destination profiles, the 'sunshine state' framing line, and the per-place character associations."
    },
    viShots: {
        id: "viShots",
        label: "Rockstar Games — official screenshot & artwork index",
        type: "primary-official",
        typeLabel: "OFFICIAL — PRIMARY",
        url: "https://www.rockstargames.com/VI/media/screenshots",
        note: "Rockstar's own place artwork titles — the authoritative index of which place names are official."
    },
    trailer1: {
        id: "trailer1",
        label: "Rockstar Games — Grand Theft Auto VI Trailer 1 (4 Dec 2023)",
        type: "primary-official",
        typeLabel: "OFFICIAL — TRAILER",
        url: "https://www.rockstargames.com/VI/trailer-1",
        note: "First public use of 'the state of Leonida' and 'the darkest side of the sunniest place in America'."
    },
    storeGame: {
        id: "storeGame",
        label: "Rockstar Store — Grand Theft Auto VI product page",
        type: "primary-official",
        typeLabel: "OFFICIAL — PRIMARY",
        url: "https://store.rockstargames.com/game/buy-gta-vi",
        note: "Reprints the setting synopsis; establishes the release date and the coastal city-and-keys framing."
    },
    storeCollection: {
        id: "storeCollection",
        label: "Rockstar Store — The Goodtime State – Vice City Collection",
        type: "official-marketing",
        typeLabel: "OFFICIAL — MERCHANDISE",
        url: "https://store.rockstargames.com/merchandise/gtavi-goodtime-state-vice-city-collection",
        note: "'The Goodtime State' as a state brand, Macca the Gator as a Leonida TV show, Chunkee the Manatee, and a souvenir poster carrying a map of Leonida."
    },
    nelson: {
        id: "nelson",
        label: "Rockstar North — Rob Nelson, co-studio head (map scale)",
        type: "attributable-statement",
        typeLabel: "ATTRIBUTABLE — DEVELOPER",
        url: "https://www.rockstargames.com/VI",
        note: "State map at roughly 2x GTA V, with Vice City alone at roughly 2x Los Santos. Already logged as CNF-009 in confirmed.html."
    },
    playstation: {
        id: "playstation",
        label: "PlayStation — GTA VI features",
        type: "primary-official",
        typeLabel: "OFFICIAL — PLATFORM",
        url: "https://www.playstation.com/GTAVIfeatures/",
        note: "Platform-side description of delivered features, used only where it names a place."
    },
    florida: {
        id: "florida",
        label: "Florida DEP / NOAA — real Florida hydrology & ecology",
        type: "real-world",
        typeLabel: "REAL-WORLD — COMPARISON ONLY",
        url: "https://floridadep.gov/land/natural-resources/ecosystems",
        note: "Used strictly to explain what real Leonida-analogous environments are. Never used to assert Leonida geography."
    },
    gtaWiki: {
        id: "gtaWiki",
        label: "GTA Wiki — State of Leonida (third party, leak-flagged)",
        type: "unverified",
        typeLabel: "UNVERIFIED — NOT EVIDENCE",
        url: "https://gta.wiki/w/State_of_Leonida",
        note: "Carries a county and district list, and its own banner warns the page may contain leaked content. Catalogued here ONLY so the unverified section can name and dismiss it."
    }
};

/* ------------------------------------------------------------
   EVIDENCE STATUS VOCABULARY
   Reuses the site's existing status pill classes so the new
   section is colour-identical to editions.html.
   ------------------------------------------------------------ */
const GEO_STATUS = {
    official:   { label: "OFFICIALLY NAMED",  pill: "status-confirmed" },
    observed:   { label: "DIRECTLY OBSERVED", pill: "status-observed" },
    inferred:   { label: "INFERRED",          pill: "status-inferred" },
    unverified: { label: "UNVERIFIED CLAIM",  pill: "status-unresolved" },
    unknown:    { label: "UNKNOWN",           pill: "status-unresolved" }
};

/* ------------------------------------------------------------
   GEO_PLACES
   The official geographic spine. Every entry here is named by
   Rockstar itself. Nothing in this array is inferred.

   Fields appear only where they carry information — an absent
   field means "Rockstar has not said", not "none".
   ------------------------------------------------------------ */
const GEO_PLACES = [
    {
        id: "vice-city",
        name: "Vice City",
        type: "city",
        region: "Leonida",
        status: "official",
        officialCaption: "Vice City, USA.",
        officialQuote: "they find themselves on the darkest side of the sunniest place in America",
        character: "The sunniest place in America — the state's marquee city, and the one Rockstar attaches its tagline to.",
        scale: "Roughly twice the area of Los Santos (GTA V), per Rob Nelson. Still the largest single urban mass in Leonida.",
        environment: [
            "Coastal city presented as bright, humid and neon-lit by night.",
            "Architecture and night-time signage are the state's most densely documented layer.",
            "The Keys, the interior towns and the national park are all positioned around this urban core."
        ],
        built: [
            "High-rise skyline used as the state's visual shorthand.",
            "Dense low-rise and mid-rise fabric implied by 'neon-soaked streets'.",
            "Entertainment, hospitality and real-estate frontage central to the city's stated economy."
        ],
        humanActivity: [
            "Nightlife is the city's headline activity in official copy.",
            "Tourism and hospitality are the state's framing activity.",
            "Real estate, entertainment venues and a recording industry attach to the city."
        ],
        known: [
            "That Vice City exists in GTA VI (CNF-003).",
            "That it is the setting's flagship city, in the 'USA'.",
            "That its night-time neon identity is deliberate, and underpins the Vintage Vice City pack's 'flashback' logic."
        ],
        unknown: [
            "Official district names, neighbourhood names and boundaries.",
            "Population, area in miles, and road network.",
            "Whether specific streets shown in footage are named or merely scenic."
        ],
        images: [
            { src: "images/Vice_City_10.jpg", alt: "Official Grand Theft Auto VI screenshot captioned Vice City by Rockstar Games, showing the city at night.", caption: "OFFICIAL SCREENSHOT — ROCKSTAR GAMES", label: "Vice City 10" },
            { src: "images/Vice_City_11.jpg", alt: "Official Grand Theft Auto VI screenshot captioned Vice City by Rockstar Games, showing city architecture.", caption: "OFFICIAL SCREENSHOT — ROCKSTAR GAMES", label: "Vice City 11" },
            { src: "images/Vice_City_12.jpg", alt: "Official Grand Theft Auto VI screenshot captioned Vice City by Rockstar Games, showing a further part of the city.", caption: "OFFICIAL SCREENSHOT — ROCKSTAR GAMES", label: "Vice City 12" }
        ],
        sources: ["viShots", "viSite", "viPlaces", "nelson", "storeGame"]
    },
    {
        id: "leonida-keys",
        name: "Leonida Keys",
        type: "island-region",
        region: "Leonida",
        status: "official",
        officialQuote: "he found himself in the Keys doing what he knows best",
        character: "An island chain used by Rockstar for smuggling, boat yards, contraband air traffic and leisure — simultaneously criminal infrastructure and tourist coast.",
        scale: "UNKNOWN. Rockstar names the Keys as a region but publishes no area, island count or road mileage.",
        environment: [
            "Island and coastal setting with beaches, open water and low-lying land.",
            "Beach culture is official copy: 'Another day in paradise' and 'Nothing better than a Mudslide at sunset'.",
            "Smuggling heritage is official copy: the 'golden age of smuggling in the Keys'."
        ],
        built: [
            "Boat yards, attested in official copy for Brian Heder's operation.",
            "Low-density, dispersed development rather than a continuous street grid.",
            "Contraband air traffic implied by official copy about hauling product by plane."
        ],
        humanActivity: [
            "Maritime smuggling and boat-yard logistics.",
            "Beach leisure and tourism.",
            "Contraband air freight between the Keys and the mainland."
        ],
        known: [
            "That the Keys exist as a named region of Leonida.",
            "That island smuggling is central to their established in-fiction economy.",
            "That their merchandise identity (crossbody bag, pin set, sticker pack) treats them as a tourist brand."
        ],
        unknown: [
            "Any official island names within the chain.",
            "Bridges, causeways, ferries and airports serving the Keys.",
            "Which named town, if any, is the Keys' principal settlement."
        ],
        images: [
            { src: "images/Leonida_Keys_02.jpg", alt: "Official Grand Theft Auto VI screenshot captioned Leonida Keys by Rockstar Games.", caption: "OFFICIAL SCREENSHOT — ROCKSTAR GAMES", label: "Leonida Keys 02" },
            { src: "images/Leonida_Keys_04.jpg", alt: "Official Grand Theft Auto VI screenshot captioned Leonida Keys by Rockstar Games, showing coastal development.", caption: "OFFICIAL SCREENSHOT — ROCKSTAR GAMES", label: "Leonida Keys 04" },
            { src: "images/Leonida_Keys_06.jpg", alt: "Official Grand Theft Auto VI screenshot captioned Leonida Keys by Rockstar Games, showing a further Keys location.", caption: "OFFICIAL SCREENSHOT — ROCKSTAR GAMES", label: "Leonida Keys 06" }
        ],
        sources: ["viShots", "viPlaces", "storeCollection"]
    },

    {
        id: "grassrivers",
        name: "Grassrivers",
        type: "town",
        region: "Leonida",
        status: "official",
        character: "A named inland destination on Rockstar's list. Publicly the least described of the six, which is itself the finding.",
        scale: "UNKNOWN. No area, population or extent published.",
        environment: ["UNKNOWN. Rockstar publishes no environmental description of Grassrivers."],
        built: ["UNKNOWN. No official architectural description."],
        humanActivity: [
            "Appears in official copy as the locality of the Real Dimez' origin, before their move into the Vice City scene."
        ],
        known: [
            "That Grassrivers is an officially named destination in Leonida.",
            "That official copy associates it with the Real Dimez."
        ],
        unknown: [
            "Almost everything else. Rockstar names it and does not describe it.",
            "Terrain, waterways, districts, population, economy."
        ],
        images: [
            { src: "images/Grassrivers_05.jpg", alt: "Official Grand Theft Auto VI screenshot captioned Grassrivers by Rockstar Games.", caption: "OFFICIAL SCREENSHOT — ROCKSTAR GAMES", label: "Grassrivers 05" },
            { src: "images/Grassrivers_06.jpg", alt: "Official Grand Theft Auto VI screenshot captioned Grassrivers by Rockstar Games, showing a second view.", caption: "OFFICIAL SCREENSHOT — ROCKSTAR GAMES", label: "Grassrivers 06" }
        ],
        sources: ["viShots", "viPlaces"]
    },
    {
        id: "port-gellhorn",
        name: "Port Gellhorn",
        type: "town",
        region: "Leonida",
        status: "official",
        character: "A named Leonida town presented through its music scene. Rockstar's official copy attaches a label and an artist collective to it.",
        scale: "UNKNOWN. No area, population or extent published.",
        environment: ["UNKNOWN. Rockstar publishes no environmental description of Port Gellhorn."],
        built: ["UNKNOWN. No official architectural description."],
        humanActivity: [
            "Live music scene, per official copy tying the town to artists and a label.",
            "Associated in official copy with the Real Dimez."
        ],
        known: [
            "That Port Gellhorn is an officially named destination in Leonida.",
            "That Rockstar markets it through its music scene."
        ],
        unknown: [
            "Terrain, coastline, districts, population, economy.",
            "Any port, harbour, marina or industrial infrastructure — despite the name, none is described officially."
        ],
        images: [
            { src: "images/Port_Gellhorn_06.jpg", alt: "Official Grand Theft Auto VI screenshot captioned Port Gellhorn by Rockstar Games.", caption: "OFFICIAL SCREENSHOT — ROCKSTAR GAMES", label: "Port Gellhorn 06" }
        ],
        sources: ["viShots", "viPlaces"]
    },
    {
        id: "ambrosia",
        name: "Ambrosia",
        type: "town",
        region: "Leonida",
        status: "official",
        character: "A named Leonida town attached in official copy to bank robbery — a heist town rather than a leisure or industrial one.",
        scale: "UNKNOWN. No area, population or extent published.",
        environment: ["UNKNOWN. Rockstar publishes no environmental description of Ambrosia."],
        built: ["UNKNOWN. No official architectural description."],
        humanActivity: [
            "Bank robbery, per the official copy for Raul Bautista, who operates from here.",
            "The site narrative frame places a criminal conspiracy 'across the state of Leonida'."
        ],
        known: [
            "That Ambrosia is an officially named destination in Leonida.",
            "That official copy ties it to an established bank-robbery crew."
        ],
        unknown: [
            "Terrain, districts, population, economy.",
            "Any refinery, port or industrial base — none is described officially."
        ],
        images: [
            { src: "images/Ambrosia_01.jpg", alt: "Official Grand Theft Auto VI screenshot captioned Ambrosia by Rockstar Games.", caption: "OFFICIAL SCREENSHOT — ROCKSTAR GAMES", label: "Ambrosia 01" },
            { src: "images/Ambrosia_05.jpg", alt: "Official Grand Theft Auto VI screenshot captioned Ambrosia by Rockstar Games, showing a second view.", caption: "OFFICIAL SCREENSHOT — ROCKSTAR GAMES", label: "Ambrosia 05" },
            { src: "images/Ambrosia_06.jpg", alt: "Official Grand Theft Auto VI screenshot captioned Ambrosia by Rockstar Games, showing a further view.", caption: "OFFICIAL SCREENSHOT — ROCKSTAR GAMES", label: "Ambrosia 06" }
        ],
        sources: ["viShots", "viPlaces"]
    },
    {
        id: "mount-kalaga",
        name: "Mount Kalaga National Park",
        type: "national-park",
        region: "Leonida",
        status: "official",
        character: "The state's only officially named protected natural area. Rockstar's counterweight to the neon coast: interior, upland and wild.",
        scale: "UNKNOWN. No area, elevation or boundaries published.",
        environment: [
            "The only place in the official set whose name itself asserts a national-park status.",
            "Implies administered, protected land as a category distinct from the towns.",
            "Upland, canyon and wild terrain are the implied counterpoint to the flat coastal imagery."
        ],
        built: [
            "Minimal. No official structures, roads, lodges or visitor facilities are described.",
            "Its value in the state's composition is as undeveloped land."
        ],
        humanActivity: [
            "Protected-land status implies restricted development.",
            "The site's people-and-places framing positions it alongside music, nightlife and smuggling as a distinct register."
        ],
        known: [
            "That Mount Kalaga National Park exists as an officially named destination.",
            "That Leonida contains at least one designated national park."
        ],
        unknown: [
            "Its extent, elevation, ecology and species.",
            "Trails, roads, entrances, visitor facilities.",
            "Whether the 'Mount' denotes a single summit or a general upland region."
        ],
        images: [
            { src: "images/Mount_Kalaga_National_Park_02.jpg", alt: "Official Grand Theft Auto VI screenshot captioned Mount Kalaga National Park by Rockstar Games.", caption: "OFFICIAL SCREENSHOT — ROCKSTAR GAMES", label: "Mount Kalaga National Park 02" },
            { src: "images/Mount_Kalaga_National_Park_04.jpg", alt: "Official Grand Theft Auto VI screenshot captioned Mount Kalaga National Park by Rockstar Games, showing upland terrain.", caption: "OFFICIAL SCREENSHOT — ROCKSTAR GAMES", label: "Mount Kalaga National Park 04" },
            { src: "images/Mount_Kalaga_National_Park_06.jpg", alt: "Official Grand Theft Auto VI screenshot captioned Mount Kalaga National Park by Rockstar Games, showing a further view.", caption: "OFFICIAL SCREENSHOT — ROCKSTAR GAMES", label: "Mount Kalaga National Park 06" }
        ],
        sources: ["viShots", "viPlaces"]
    },
    {
        id: "leonida-penitentiary",
        name: "Leonida Penitentiary",
        type: "facility",
        region: "Leonida",
        status: "official",
        officialQuote: "Fighting for her family landed her in the Leonida penitentiary. Sheer luck got her out.",
        character: "The only non-destination place Rockstar names, and the only officially named institution of confinement in Leonida. Established through character biography rather than a destination page.",
        scale: "UNKNOWN. No capacity, location or security description published.",
        environment: ["UNKNOWN. No site description is published."],
        built: ["UNKNOWN. No architectural description published."],
        humanActivity: [
            "Incarceration. Official copy establishes that Lucia Caminos was imprisoned here.",
            "Functions in official material as a narrative origin rather than a described place."
        ],
        known: [
            "That a Leonida Penitentiary exists.",
            "That Lucia Caminos was imprisoned there and later released."
        ],
        unknown: [
            "Its location within Leonida, its county, and its catchment.",
            "Capacity, staff, security model, architecture.",
            "Whether it is a single facility or a complex."
        ],
        images: [],
        sources: ["viPlaces"]
    }
];

/* ------------------------------------------------------------
   THE STATE ITSELF
   What Rockstar actually asserts about Leonida as a whole.
   ------------------------------------------------------------ */
const GEO_STATE = {
    name: "State of Leonida",
    officialQuote: "a criminal conspiracy stretching across the state of Leonida",
    officialCaption: "Vice City, USA.",
    brand: "The Goodtime State",
    summary:
        "Rockstar establishes Leonida as a US state, unified by a neon-soaked coastal metropolis and a network of smaller destinations distributed around it. What makes it read as one place is the shared commerce of tourism, music and contraband that links the city to the Keys.",
    onePlaceThesis:
        "Leonida holds together because the same money moves through all of it. Tourism pays for the Keys' leisure identity; the Keys' boat yards and air freight feed the city's crime economy; the city's music industry reaches inland to towns like Grassrivers and Port Gellhorn. The official record establishes a coastal core with satellite destinations around a shared economy, not a set of isolated set-pieces.",
    known: [
        "Leonida is a state, and the setting of GTA VI (CNF-001).",
        "It is a US state: 'Vice City, USA.'",
        "Vice City is its principal city and its 'sunniest place'.",
        "It contains an island region (the Keys), a national park (Mount Kalaga), three named towns, and a penitentiary.",
        "A 'Goodtime State' brand is used officially on merchandise.",
        "The scale is large: state map at roughly 2x GTA V (CNF-009)."
    ],
    unknown: [
        "All county-level subdivision. Rockstar has published no Leonida counties.",
        "The state's area, population and coastline length.",
        "Its inland extent, and whether the interior is mostly wetland.",
        "Neighbouring states, and whether Leonida borders other land.",
        "Any official state map at publication time. The souvenir poster is the only map Rockstar has sold, and it is merchandise art, not a reference document."
    ]
};

/* ------------------------------------------------------------
   GEO_RELATIONSHIPS
   How the official places connect. Every edge names the
   evidence it rests on. 'observed' means official copy
   explicitly ties the two together; 'inferred' means the
   link is analytical, not stated.
   ------------------------------------------------------------ */
const GEO_RELATIONSHIPS = [
    { from: "Vice City", to: "Leonida Keys", kind: "tourism + supply", status: "observed",
      basis: "Official copy attaches the Vice City scene to Keys-based operators, and the Keys' tourism identity is sold officially as a Leonida brand." },
    { from: "Vice City", to: "Grassrivers", kind: "migration", status: "observed",
      basis: "Official copy states the Real Dimez came from Grassrivers and set their sights on the Vice City scene." },
    { from: "Vice City", to: "Port Gellhorn", kind: "music circuit", status: "observed",
      basis: "Official copy associates Port Gellhorn with artists and a label, and describes a move from that scene toward Vice City." },
    { from: "Vice City", to: "Ambrosia", kind: "crime economy", status: "observed",
      basis: "Official copy places an established bank-robbery crew in Ambrosia; the site synopsis places a conspiracy 'across the state'." },
    { from: "Leonida Keys", to: "Mount Kalaga National Park", kind: "coast to interior", status: "inferred",
      basis: "INFERENCE. Both are on the official destination list and the state synopsis implies variety within one state. Rockstar does not state a direct connection." },
    { from: "Vice City", to: "Leonida Penitentiary", kind: "institution", status: "observed",
      basis: "Official copy places Lucia Caminos in the Leonida Penitentiary, establishing it as a state institution reached from the urban setting." },
    { from: "Leonida Penitentiary", to: "Vice City", kind: "coastal hinterland", status: "unknown",
      basis: "UNKNOWN. No location for the penitentiary is published, so no spatial relationship can be asserted." }
];


/* ------------------------------------------------------------
   GEO_ENVIRONMENTS
   Environmental categories. Note how few are officially
   characterised — this is the layer with the largest gap
   between what fans expect and what Rockstar has published.
   ------------------------------------------------------------ */
const GEO_ENVIRONMENTS = [
    {
        id: "coastal-urban",
        name: "Coastal urban",
        status: "observed",
        places: ["Vice City", "Leonida Keys"],
        evidence: "The official set is dominated by a coastal city and an island chain. Every official place but one is water-adjacent.",
        observable: [
            "Sea-facing high-rise skyline presented as the state's image.",
            "Beach leisure culture in official character copy ('Another day in paradise').",
            "Night-time neon and dense commercial frontage in Vice City."
        ],
        unknown: ["Tidal range, harbour geography, sea walls and coastal engineering are undescribed."]
    },
    {
        id: "island",
        name: "Island chain",
        status: "observed",
        places: ["Leonida Keys"],
        evidence: "'Leonida Keys' is an official region name; the word 'Keys' denotes an island chain.",
        observable: [
            "Dispersed low-density development.",
            "Boat yards and beach venues.",
            "Air and sea freight as a smuggling corridor."
        ],
        unknown: ["Island count, names, sizes, and the bridges or ferries linking them — all undescribed."]
    },
    {
        id: "protected-wild",
        name: "Protected upland / wild",
        status: "official",
        places: ["Mount Kalaga National Park"],
        evidence: "The name 'National Park' is Rockstar's own and asserts protected status directly.",
        observable: [
            "Administration implying managed access and restricted development.",
            "Interior position away from the coastal destinations."
        ],
        unknown: ["Elevation, flora, fauna, area and any facilities. Rockstar publishes no description."]
    },
    {
        id: "inland-town",
        name: "Inland town",
        status: "official",
        places: ["Grassrivers", "Port Gellhorn", "Ambrosia"],
        evidence: "Three of the six official destinations are towns, all distinct from the coastal and park categories.",
        observable: [
            "Each is presented through a different economy: recorded music, live music, and organised crime respectively.",
            "Each is reachable from, and narratively points back to, Vice City."
        ],
        unknown: ["Terrain, size and built form of all three. Rockstar names them without describing them."]
    },
    {
        id: "wetland-marsh",
        name: "Wetland / marsh",
        status: "unknown",
        places: [],
        evidence: "NO OFFICIAL EVIDENCE. Large wetland systems are strongly expected in a Leonida-analogous setting and are widely depicted in community material, but Rockstar has published no wetland, swamp or marsh destination.",
        observable: [],
        unknown: [
            "Whether Leonida contains any wetland environment at all.",
            "Any wetland place name, acreage or ecology.",
            "This row records an absence, not an anticipation."
        ]
    },
    {
        id: "agricultural",
        name: "Agricultural land",
        status: "unknown",
        places: [],
        evidence: "NO OFFICIAL EVIDENCE. Rockstar has published no farmland, ranch or orchard destination.",
        observable: [],
        unknown: ["Existence, extent and any producer towns."]
    }
];

/* ------------------------------------------------------------
   GEO_WATER
   ------------------------------------------------------------ */
const GEO_WATER = [
    { id: "ocean", name: "Ocean", status: "observed", claim: "Leonida is bounded by sea on the side Vice City and the Keys occupy.", basis: "The official place set is coastal and island-based; 'Vice City, USA.' appears alongside an island chain.", unknown: "Named sea, gulf or bay. Rockstar has published no water-body name for Leonida's offshore water." },
    { id: "shoreline", name: "Shoreline & beaches", status: "observed", claim: "Beaches are a primary official leisure asset of the Keys.", basis: "Official copy: 'Another day in paradise'; Keys merchandise is sold as a beach brand.", unknown: "Beach names, count, and any officially named stretches of coast." },
    { id: "boatyards", name: "Boat yards & marinas", status: "observed", claim: "Boat yards are an established Keys institution.", basis: "Official Brian Heder copy: 'Still moving product through his boat yard'.", unknown: "Whether any marina is named, and its capacity." },
    { id: "rivers", name: "Rivers", status: "unknown", claim: "No river in Leonida is officially named.", basis: "No official source names one.", unknown: "Existence, count and character of Leonida's inland waterways." },
    { id: "lakes", name: "Lakes", status: "unknown", claim: "No lake in Leonida is officially named.", basis: "No official source names one.", unknown: "Existence and extent." },
    { id: "wetlands-water", name: "Wetlands & tidal flats", status: "unknown", claim: "No wetland system is officially named.", basis: "No official source describes one.", unknown: "Whether tidal or freshwater wetlands exist in the state." }
];


/* ------------------------------------------------------------
   GEO_TRANSPORT
   The largest single evidence gap in the geographic record.
   Rockstar has named no highway, road, bridge, railway, port,
   airport or airfield anywhere in Leonida.
   ------------------------------------------------------------ */
const GEO_TRANSPORT = [
    { id: "air", name: "Air transport", status: "observed", claim: "Contraband air freight operates into the Keys.", basis: "Official copy: 'I hauled so much grass in that plane'. Establishes aircraft in use and a landing destination in the Keys.", unknown: "Any named airport, airfield, runway or scheduled service. Rockstar has named none." },
    { id: "sea", name: "Sea & boat routes", status: "observed", claim: "Boat yards and sea freight are established in the Keys.", basis: "Official boat-yard copy, plus the Keys' island-chain status.", unknown: "Any named port, harbour, ferry route or shipping lane." },
    { id: "road", name: "Roads & highways", status: "unknown", claim: "Rockstar has named no road, highway or route in Leonida.", basis: "No official source names one.", unknown: "The entire road network: names, classes, counts and interchanges." },
    { id: "bridges", name: "Bridges & causeways", status: "unknown", claim: "No bridge or causeway is officially named.", basis: "No official source names one, even though an island chain implies crossings.", unknown: "Whether the Keys are reached by bridge, causeway or ferry — a structurally important unanswered question." },
    { id: "rail", name: "Railways", status: "unknown", claim: "No railway is officially named or described.", basis: "No official source mentions rail transport.", unknown: "Existence of any rail network." },
    { id: "public", name: "Public transport", status: "unknown", claim: "No transit system is officially described.", basis: "No official source mentions one.", unknown: "Whether Leonida has urban mass transit at all." },
    { id: "coastguard", name: "Coast Guard", status: "observed", claim: "A Coast Guard exists and monitors the state's coastal waters.", basis: "Official Cal Hampton copy: 'snooping on Coast Guard comms'.", unknown: "Coast Guard stations, vessels and coverage areas." }
];

/* ------------------------------------------------------------
   GEO_WILDLIFE
   Only two animals are named in official material, and both
   are cultural mascots rather than documented fauna.
   ------------------------------------------------------------ */
const GEO_WILDLIFE = [
    { id: "birds", name: "Birds", status: "observed", claim: "Large bird formations are a noted feature of Leonida's environment.", basis: "Official Cal Hampton copy: 'There are way too many birds flying around in perfect formation.'", association: "No habitat is stated. 'Perfect formation' describes behaviour, not an ecosystem.", unknown: "Species, habitat, and whether this is coastal, inland or statewide." },
    { id: "gator", name: "Alligator — state mascot", status: "official", claim: "An alligator is the emblematic animal of Leonida.", basis: "Official merchandise: 'Macca the Gator', described as 'Leonida's hit TV show', under the state brand 'The Goodtime State'.", association: "Mascot status is cultural, not ecological. It does not establish wild populations.", unknown: "Whether gators occur in the wild in Leonida, and in what habitat." },
    { id: "manatee", name: "Manatee — cultural mascot", status: "official", claim: "A manatee named Chunkee is a Leonida cultural fixture.", basis: "Official merchandise: 'Chunkee the Manatee Shot Glass'.", association: "Appears only as merchandise iconography.", unknown: "Any wild population, and any waterway where one might be observed." },
    { id: "wildlife-general", name: "All other fauna", status: "unknown", claim: "No other animal, bird, fish, reptile or insect is named in official material.", basis: "Absence of evidence across the entire official record.", unknown: "Everything else. No species list exists because Rockstar has published none." }
];

/* ------------------------------------------------------------
   GEO_WEATHER
   ------------------------------------------------------------ */
const GEO_WEATHER = [
    { id: "sun", name: "Sunlight", status: "official", claim: "Persistent bright sunlight is the state's defining atmospheric quality.", basis: "The site tagline 'the sunniest place in America', the 'Goodtime State' brand, and merchandise copy about 'blocking out the Leonida sun'.", note: "Reinforced across three independent official properties, making it the most repeated piece of environmental world-building Rockstar has published." },
    { id: "humidity", name: "Humidity & heat", status: "inferred", claim: "Humid heat is implied by the 'paradise', beach and Keys framing.", basis: "INFERENCE from official leisure copy. No official source states temperature, humidity or rainfall.", note: "Framed as inference because a tourism slogan is marketing, not climatology." },
    { id: "storm", name: "Storms & hurricanes", status: "unknown", claim: "No storm, hurricane or severe-weather event is officially named.", basis: "No official source mentions one.", unknown: "Whether Leonida has a storm season, and any named storms." },
    { id: "rain", name: "Rain", status: "unknown", claim: "No rainfall is described in official material.", basis: "No official source mentions rain.", unknown: "Rainfall, wet-road conditions, and any weather-driven systems." },
    { id: "fog", name: "Fog & haze", status: "unknown", claim: "No fog or atmospheric haze is officially described.", basis: "No official source mentions it.", unknown: "Visibility conditions." }
];


/* ------------------------------------------------------------
   GEO_ARCHITECTURE
   ------------------------------------------------------------ */
const GEO_ARCHITECTURE = [
    { id: "viceskyline", name: "City high-rise", status: "observed", where: "Vice City", claim: "A sea-facing high-rise skyline defines the state's urban image.", basis: "Official Vice City artwork and the site synopsis.", distinguish: "OBSERVABLE RESEMBLANCE only. Rockstar has published no statement of architectural inspiration." },
    { id: "neon", name: "Night-time commercial frontage", status: "observed", where: "Vice City", claim: "Dense neon signage and nightlife frontage are an intentional identity.", basis: "Official copy 'neon-soaked streets'; 'When the sun fades and the neon glows'; the Vintage Vice City pack's 'flash back to when the neon burned brightest'.", distinguish: "Three independent official properties reinforce neon as deliberate design language." },
    { id: "midcentury", name: "Mid-century / retro pastiche", status: "official", where: "Vice City", claim: "A deliberate 1980s–90s pastiche runs through the state's presentation.", basis: "OFFICIAL. The Vintage Vice City Pack is sold as a flashback to 'when the neon burned brightest'; Rockstar markets 'Vice City Style'; the state brand is 'The Goodtime State'.", distinguish: "The clearest documented continuity link to Vice City (2002) — but a style of presentation, not a claim about in-fiction history." },
    { id: "lowrise", name: "Low-rise & rural structure", status: "unknown", where: "Grassrivers, Ambrosia, Port Gellhorn", claim: "Built form of the inland towns is not officially described.", basis: "No official architectural description exists for any of them.", distinguish: "The absence is itself the record." },
    { id: "industrial", name: "Industrial & agricultural buildings", status: "unknown", where: "—", claim: "No industrial, warehouse, refinery or agricultural structure is officially described anywhere in Leonida.", basis: "No official source describes one.", distinguish: "Notable given the published map scale, which implies substantial non-urban land whose working use is undescribed." }
];

/* ------------------------------------------------------------
   GEO_ECONOMY
   What official copy says people do, by place. Nothing here is
   inferred from visual impression.
   ------------------------------------------------------------ */
const GEO_ECONOMY = [
    { id: "tourism", activity: "Tourism & hospitality", places: ["Vice City", "Leonida Keys"], status: "official", basis: "The whole state is marketed through leisure: 'sunniest place in America', 'Another day in paradise', Keys beach merchandise, and the 'Goodtime State' brand.", note: "Tourism is not merely an activity in Leonida — it is the state's official self-image, repeated across every Rockstar property." },
    { id: "nightlife", activity: "Nightlife & entertainment", places: ["Vice City"], status: "official", basis: "Official copy ties the city to a strip club, a recording studio and a live music scene.", note: "The one economic layer Rockstar names with actual businesses." },
    { id: "music", activity: "Recorded music industry", places: ["Vice City", "Port Gellhorn", "Grassrivers"], status: "official", basis: "Official copy describes a record label, a signing process, an artist collective and a viral single.", note: "The clearest documented economic chain running from an inland town into the city." },
    { id: "maritime", activity: "Maritime smuggling", places: ["Leonida Keys"], status: "official", basis: "Official copy: 'the golden age of smuggling in the Keys', a working boat yard, and a 'Leonida beach bum' who 'moves like a great white shark'.", note: "Framed with nostalgia — 'golden age' presents it as a past era, not a current legitimate industry." },
    { id: "airfreight", activity: "Contraband air freight", places: ["Leonida Keys"], status: "official", basis: "Official copy: 'I hauled so much grass in that plane, I could make the state of Leonida levitate'.", note: "Establishes the Keys as an air-accessible smuggling destination." },
    { id: "realestate", activity: "Real estate", places: ["Vice City"], status: "official", basis: "Official copy describes a 'legitimate empire spanning real estate, a strip club, and a recording studio'.", note: "The only official mention of property as a business anywhere in the record." },
    { id: "banking", activity: "Organised bank robbery", places: ["Ambrosia"], status: "official", basis: "Official copy establishes a seasoned bank-robbery crew operating from Ambrosia.", note: "Presented as a criminal economy, not a legitimate one." },
    { id: "incarceration", activity: "State corrections", places: ["Leonida Penitentiary"], status: "official", basis: "The penitentiary's existence is established in official character copy.", note: "The state's only publicly named public institution." },
    { id: "industry", activity: "Manufacturing, farming & fishing", places: [], status: "unknown", basis: "NO OFFICIAL EVIDENCE. No industry, agriculture, fishing or extraction is described for any Leonida location.", note: "Recorded as an explicit gap rather than assumed." }
];


/* ------------------------------------------------------------
   GEO_CULTURE
   Where official copy establishes a cultural fact, and where
   it merely implies one.
   ------------------------------------------------------------ */
const GEO_CULTURE = [
    { id: "tourism-culture", item: "Tourism culture", status: "official", detail: "Leonida is publicly framed as a destination people visit: 'Only in Leonida', 'Tour a few of the must-see destinations across the sunshine state', and merchandise sold as souvenirs of a 'road trip to every corner of the Goodtime State'." },
    { id: "television", item: "State television", status: "official", detail: "Leonida has a hit TV show: 'Macca the Gator', described officially as 'Leonida's hit TV show' and used as the basis of a national-level merchandise collection." },
    { id: "nightlife-culture", item: "Nightlife culture", status: "official", detail: "Official copy places a strip club, a real-estate empire and a recording studio inside the city's economy, and describes a signing process and artist scene around them." },
    { id: "smuggling-culture", item: "Smuggling culture", status: "official", detail: "The Keys are officially described through a 'golden age of smuggling', with a nostalgia register — beach bums, boat yards and air freight presented as inherited tradition." },
    { id: "paranoia", item: "Coastal-surveillance culture", status: "official", detail: "Official copy establishes Coast Guard radio monitoring as an ordinary activity, and states the wider frame directly: 'The psychopaths are in charge. Get used to it.'" },
    { id: "inference", item: "What is only implied", status: "inferred", detail: "Regional sub-cultures, class distinctions, local dialects and any demographic character of Leonida's population are NOT established. Nothing in the official record supports claims about who lives where." }
];

/* ------------------------------------------------------------
   GEO_TRANSITIONS
   Where one environment becomes another. Rockstar has not
   published boundary distances, so every distance field reads
   UNKNOWN rather than inventing a figure.
   ------------------------------------------------------------ */
const GEO_TRANSITIONS = [
    { id: "t1", from: "Vice City", to: "Leonida Keys", whatChanges: "Urban density collapses into dispersed low-rise island development; a continuous street grid gives way to boat yards, beaches and open water.", overWhatDistance: "UNKNOWN — no boundary or distance is published.", system: "Water crossing, of an entirely unestablished type: bridge, causeway and ferry are all UNKNOWN.", abruptOrGradual: "UNKNOWN.", note: "Structurally the most important unresolved question in the state's geography — how an island chain connects to the mainland determines the whole Keys' character." },
    { id: "t2", from: "Vice City", to: "Grassrivers / Port Gellhorn / Ambrosia", whatChanges: "The urban core gives way to small-town settings, each presented through a single dominant activity — recorded music, live music, and organised crime respectively.", overWhatDistance: "UNKNOWN — no distances or road links are published.", system: "Road network, which Rockstar has not named or mapped.", abruptOrGradual: "UNKNOWN.", note: "The towns are positioned against the city economically rather than spatially in the official record — each is defined by what flows into the city from it." },
    { id: "t3", from: "Leonida Keys", to: "Mount Kalaga National Park", whatChanges: "Leisure coast and maritime commerce give way to protected upland and undeveloped terrain.", overWhatDistance: "UNKNOWN.", system: "Unknown; the two are separated by an undescribed interior.", abruptOrGradual: "UNKNOWN.", note: "The state's clearest thematic contrast — developed coast versus wild interior — exists in the official record without any described route between them." },
    { id: "t4", from: "Leonida Penitentiary", to: "anywhere", whatChanges: "Cannot be assessed.", overWhatDistance: "UNKNOWN.", system: "Unknown.", abruptOrGradual: "UNKNOWN.", note: "Recorded explicitly because a named state facility with no published location is a genuine gap, not an oversight." }
];


/* ------------------------------------------------------------
   GEO_TECH
   Engineering implications. Every entry is ANALYSIS. None of
   it asserts that Rockstar implemented any particular system.
   ------------------------------------------------------------ */
const GEO_TECH = [
    { id: "te1", environment: "Large state with a coastal city (map ~2x GTA V, Vice City ~2x Los Santos)", implication: "World partitioning, streaming and memory budget remain the dominant engineering constraint, and scale claims of this kind are made precisely because streaming is the limiting factor.", certainty: "ATTRIBUTABLE STATEMENT + ANALYSIS", caution: "The scale figures are Rob Nelson's. The systems behind them are not described by Rockstar." },
    { id: "te2", environment: "Dense neon-lit urban core at night", implication: "Large emissive sign counts, night-time lighting variation and interior/exterior culling all scale with building density — the most expensive region to light and stream.", certainty: "ANALYSIS", caution: "No official statement ties GTA VI's night rendering to any specific technique." },
    { id: "te3", environment: "Island chain requiring crossings", implication: "A bridge, causeway or ferry network implies persistent water simulation, traffic and vessel AI across a boundary players cross often.", certainty: "ANALYSIS", caution: "The crossing type is UNKNOWN. Do not assume a bridge." },
    { id: "te4", environment: "Boat yards and air freight", implication: "Watercraft and aircraft AI, plus persistent maritime activity, sit on top of an already expensive ocean surface.", certainty: "ANALYSIS", caution: "Boat yards and air freight are officially established; their technical implementation is not." },
    { id: "te5", environment: "Named national park of unknown extent", implication: "A protected zone of unknown size is a natural candidate for lower simulation density and relaxed streaming — but this is a design pattern, not a disclosure.", certainty: "SPECULATIVE PATTERN", caution: "Flagged as the weakest item in this table deliberately. A national park is not evidence of a streaming technique." },
    { id: "te6", environment: "Unnamed road network across a large state", implication: "Long-distance traversal, fast travel and traffic simulation all depend on a road graph whose extent Rockstar has not published.", certainty: "ANALYSIS", caution: "The road network's existence is obvious; its size and shape are unknown." }
];


/* ------------------------------------------------------------
   GEO_REALWORLD
   Real-world comparison. Contextual only. The parallel column
   explains what real environments involve — it never asserts
   that Leonida contains them.
   ------------------------------------------------------------ */
const GEO_REALWORLD = [
    { id: "r1", topic: "State identity", leonida: "A US state containing a marquee coastal city, an island chain, inland towns and a national park.", real: "Florida is a US state containing Miami, the Florida Keys, inland towns and Everglades National Park.", parallel: "CLOSE. The official Leonida place set maps onto Florida's structure almost item for item — a coastal metropolis, a 'Keys' island chain, small interior towns, and a single named national park. Rockstar's naming follows Florida vocabulary directly ('Leonida Keys' after the Florida Keys; an alligator and a coastal-leisure identity).", separation: "This similarity is contextual. It explains why Leonida reads as Leonida. It is not evidence of any Leonida boundary, county or landform." },
    { id: "r2", topic: "Coastal cities & tourism", leonida: "A neon-branded coastal city marketed as 'the sunniest place in America'.", real: "Miami, Florida — coastal, tourism-led, with a heavily retro-styled nightlife district and a preserved Art Deco waterfront.", parallel: "STRONG in register. Vice City's neon pastiche and beach-leisure identity correspond closely to real Miami's tourism branding and preserved 1980s imagery.", separation: "OBSERVABLE RESEMBLANCE. Rockstar has published no statement of inspiration, and none is asserted here." },
    { id: "r3", topic: "Islands", leonida: "An officially named 'Leonida Keys' chain used for smuggling and leisure.", real: "The Florida Keys — an arc of roughly 1,700 islands linked by the Overseas Highway, whose bridges run as long as seven miles.", parallel: "The naming and function both follow the real Keys. Real Florida Keys traffic famously includes those causeways, a detail GTA VI has NOT established.", separation: "The real bridge network must not be imported. Whether Leonida's Keys have crossings at all is UNKNOWN." },
    { id: "r4", topic: "National park & interior", leonida: "One named national park, undescribed.", real: "Everglades National Park — a vast subtropical wetland of slow-moving shallow water known as a 'river of grass'.", parallel: "STRUCTURAL. A single flagship national park protecting a distinctive interior is the same device as the Everglades. But the real Everglades is a WETLAND, and GTA VI has established no wetland anywhere.", separation: "The most tempting inference on the page and the most dangerous. 'National park' plus 'Florida' does not license 'swamp' as established Leonida geography. Recorded here as a real-world parallel, explicitly not a Leonida claim." },
    { id: "r5", topic: "Smuggling culture", leonida: "A 'golden age of smuggling' centred on Keys boat yards and air freight.", real: "The Florida Keys' 1970s–80s cocaine-smuggling era, when the islands were a major transshipment route.", parallel: "CLEAR historical analogue, and the official copy's nostalgia register matches the real period's cultural memory closely.", separation: "The real history is real. GTA VI's smuggling era is fictional and its dates are UNKNOWN." },
    { id: "r6", topic: "Scale", leonida: "State map ~2x GTA V; Vice City ~2x Los Santos.", real: "Florida is ~65,758 sq mi (~170,300 km²). GTA V's San Andreas is far larger in-fiction than any real US state.", parallel: "Florida's coastal-plus-interior proportions resemble what the place list implies: a dense coast and a large uncharacterised interior.", separation: "The ~2x figures are RELATIVE to other games, not absolute miles. No square-mile or population figure for Leonida exists." }
];


/* ------------------------------------------------------------
   GEO_UNVERIFIED
   QUARANTINE. Names that circulate widely and are NOT
   established by Rockstar. They appear on this page only so
   they can be identified and dismissed.

   Rules for this array:
     - never plotted on the map
     - never used to infer structure
     - never counted in any total
     - never presented as a Leonida location

   This site does not share leaks. The third-party source
   carrying most of these names banners its own page as
   possibly containing leaked development content, so they are
   recorded as unverified claims rather than repeated as
   geography.
   ------------------------------------------------------------ */
const GEO_UNVERIFIED = [
    { id: "counties", names: ["Vice-Dale County", "Mariana County", "Kelly County", "Ambrosia County", "Leonard County", "Lummox County"], category: "Administrative subdivision", claim: "Leonida is divided into named counties, and the official places sit in specific ones.", provenance: "Third-party wiki and community maps. Not attributable to Rockstar.", status: "NOT ESTABLISHED", why: "Rockstar has published no Leonida counties. The pattern is plausible given the official places involved, but plausibility is not evidence.", doNext: "Upgrade to a place record only when Rockstar publishes a county name on an official property." },
    { id: "districts", names: ["Downtown Vice City", "Ocean Beach", "Washington Beach", "Leaf Links", "Starfish Island", "Little Cuba", "Rockridge", "Southside", "Belville", "Bayside", "Crosstown", "Ekanfinaka", "Tequesta", "Stockyard", "Salton", "La Perle", "Peacock Bay", "Tisha-Wocka", "Vice City Design District", "Vice City International Airport"], category: "City districts & facilities", claim: "Vice City has a named district system of roughly twenty neighbourhoods plus an international airport.", provenance: "Third-party wiki and community maps. Not attributable to Rockstar.", status: "NOT ESTABLISHED", why: "Several carry obvious Vice City (2002) names, which is a reason for caution rather than confidence — GTA VI's continuity is explicitly a reinterpretation, not a map copy.", doNext: "Treat as leads only. Confirm individually against official material before any use." },
    { id: "islands", names: ["Rialto Islands", "Catalan Key", "Catalan Bay", "Gloriana Key", "Dalton Island", "PortViceCity", "Peregrine Bay", "Buckskin", "Bluegrass"], category: "Islands & bays", claim: "Named islands, bays and keys surround Vice City and the Leonida Keys.", provenance: "Third-party wiki.", status: "NOT ESTABLISHED", why: "Several echo GTA Vice City (2002) place names, which points to community extrapolation from the older game rather than new material.", doNext: "Do not map. Re-verify from official footage only." },
    { id: "highways", names: ["Interstate 75 corridor", "Ocean Drive", "Sunset Boulevard", "Route 1"], category: "Roads & highways", claim: "Leonida has a named interstate and named state and city routes.", provenance: "Community maps and fan reconstruction.", status: "NOT ESTABLISHED", why: "Rockstar has named no road anywhere in Leonida. The routes circulating online are overwhelmingly reconstructed from real Florida road names.", doNext: "Requires an official road sign in released material." },
    { id: "raceway", names: ["Gellhorn International Raceway"], category: "Motor sports facility", claim: "Port Gellhorn contains a named international raceway.", provenance: "Third-party wiki.", status: "NOT ESTABLISHED", why: "The association with Port Gellhorn is tempting because of the official music-scene copy, but no raceway appears in any official place material.", doNext: "Confirm via official Port Gellhorn imagery before any use." },
    { id: "speculative", names: ["Everglades-analog swamp regions", "Additional unnamed villages and hamlets", "Crop and ranch regions", "Further unnamed islands"], category: "Community extrapolation", claim: "Further terrain and settlements exist in Leonida beyond the seven official places.", provenance: "Fan maps, wikis, Reddit and video essays.", status: "REASONABLE BUT UNEVIDENCED", why: "Not disputed in kind — a map of this size plainly contains more than seven places. The issue is that no specific additional name is established, so none can be stated as fact.", doNext: "Add individually as Rockstar names them. The section is designed to absorb new records one at a time." }
];


/* ------------------------------------------------------------
   GEO_CHARACTER_LINKS
   Only relationships stated in official copy.
   ------------------------------------------------------------ */
const GEO_CHARACTER_LINKS = [
    { character: "Jason Duval", place: "Leonida Keys", status: "official", basis: "Official copy: 'he found himself in the Keys doing what he knows best, working for local drug runners'." },
    { character: "Jason Duval", place: "Leonida", status: "official", basis: "Official copy establishes the Keys — and therefore Leonida — as his state of residence." },
    { character: "Lucia Caminos", place: "Leonida Penitentiary", status: "official", basis: "Official copy: 'Fighting for her family landed her in the Leonida Penitentiary. Sheer luck got her out.'" },
    { character: "Lucia Caminos", place: "Liberty City", status: "official", basis: "Official copy places her mother's past in Liberty City — the only official reference to another city in the setting's fiction." },
    { character: "Cal Hampton", place: "Coast Guard", status: "official", basis: "Official copy: Cal is 'snooping on Coast Guard comms', placing him in contact with Leonida's maritime enforcement." },
    { character: "Brian Heder", place: "Leonida Keys", status: "official", basis: "Official copy: 'a classic drug runner from the golden age of smuggling in the Keys', with a boat yard and a house in the Keys." },
    { character: "Boobie Ike", place: "Vice City", status: "official", basis: "Official copy: 'a local Vice City legend', with an empire spanning real estate, a strip club and a recording studio." },
    { character: "Raul Bautista", place: "Ambrosia", status: "official", basis: "Official copy presents Ambrosia as the base of a seasoned bank-robbery crew." },
    { character: "Dre'Quan Priest", place: "Grassrivers", status: "official", basis: "Official copy associates Grassrivers with the record-label scene that produced the Real Dimez." },
    { character: "Real Dimez", place: "Grassrivers", status: "official", basis: "Official copy presents Grassrivers as their origin before they set their sights on the Vice City scene." },
    { character: "Real Dimez", place: "Port Gellhorn", status: "official", basis: "Official copy ties Port Gellhorn to the artists and label the duo came out of." },
    { character: "Real Dimez", place: "Vice City", status: "official", basis: "Official copy: Dre'Quan 'sets his sights on the Vice City scene'." }
];

/* ------------------------------------------------------------
   GEO_HISTORY
   Fictional history, and the continuity question.
   ------------------------------------------------------------ */
const GEO_HISTORY = [
    { id: "h1", item: "The 'golden age of smuggling' in the Keys", kind: "official", detail: "Official copy explicitly frames the Keys' criminal maritime history as a past era with a golden age, associated with figures like Brian Heder who are now older and 'let others do his dirty work'.", note: "Establishes that Leonida's smuggling economy is portrayed as a legacy rather than a present-day frontier." },
    { id: "h2", item: "Leonida as a US state with settled modern identity", kind: "official", detail: "A state brand and motto ('The Goodtime State'), a state penitentiary, a Coast Guard and a hit TV show are all officially established.", note: "The breadth of state apparatus implies a long-settled modern setting, even though almost no specific dates are given." },
    { id: "h3", item: "Macca the Gator as state popular culture", kind: "official", detail: "'Leonida's hit TV show' is used by Rockstar to brand a national merchandise collection, implying a widely-known in-state television culture.", note: "The only piece of Leonida popular culture Rockstar has named, and it is a deliberate parody register." },
    { id: "h4", item: "Vice City (2002) continuity", kind: "reference", detail: "The Vintage Vice City Pack is sold as a 'flash back to when the neon burned brightest', and Rockstar markets 'Vice City Style' looks.", note: "REINTERPRETED CONTINUITY, not confirmed continuity. This is a presentation and style link. GTA VI does not import Vice City (2002)'s plot, cast or map. Nothing in the official record establishes that the original's 1980s setting is Leonida's history in the same sense — it is a look." },
    { id: "h5", item: "Dated in-fiction history", kind: "unknown", detail: "No founding date, no named historical events, no in-fiction chronology.", note: "Beyond the implied 'golden age' of smuggling, Rockstar has published no Leonida history at all." }
];


/* ------------------------------------------------------------
   GEO_EVIDENCE
   The location evidence record. Every material geographic
   claim, with what its source establishes, its limitations,
   and what remains unknown. Structure matches editions.html.
   ------------------------------------------------------------ */
const GEO_EVIDENCE = [
    { id: "EV-GEO-001", claim: "Leonida is a US state and the setting of GTA VI.", status: "confirmed", sourceId: "trailer1",
      establishes: "The official synopsis reads: 'they find themselves on the darkest side of the sunniest place in America, in the middle of a criminal conspiracy stretching across the state of Leonida'. The site adds the caption 'Vice City, USA.'",
      limitations: "Establishes a state, not its extent. No boundary, area, population or map has been published by Rockstar." },
    { id: "EV-GEO-002", claim: "Rockstar has officially named seven Leonida places.", status: "observed", sourceId: "viShots",
      establishes: "Rockstar's own screenshot and artwork index titles its place artwork 'Vice City', 'Leonida Keys', 'Port Gellhorn', 'Grassrivers', 'Ambrosia' and 'Mount Kalaga National Park'. The 'Only in Leonida' page links the same six as destinations, and 'Leonida Penitentiary' appears in official character copy.",
      limitations: "This count is the official record as of the verification date. It is a floor, not a ceiling — Rockstar has simply not named more yet. It does not mean Leonida contains only seven places." },
    { id: "EV-GEO-003", claim: "Vice City is Leonida's principal city.", status: "confirmed", sourceId: "viSite",
      establishes: "Vice City is the only city in the official place set, is captioned 'Vice City, USA.', carries the 'darkest side of the sunniest place in America' tagline, and is the setting's recurring location across all official character material.",
      limitations: "'Principal' is an inference from prominence, not a stated rank. Rockstar has published no population ranking or formal capital designation." },
    { id: "EV-GEO-004", claim: "The Leonida Keys are an island region used for smuggling and leisure.", status: "confirmed", sourceId: "viPlaces",
      establishes: "'Leonida Keys' is an official place artwork title and an official destination. Official copy describes 'the golden age of smuggling in the Keys', a working boat yard, a house in the Keys, and beach-leisure language such as 'Another day in paradise'.",
      limitations: "No island within the chain is named, and no bridge, causeway or ferry is established. The chain's size is unknown." },
    { id: "EV-GEO-005", claim: "Mount Kalaga National Park is the state's only officially named protected area.", status: "confirmed", sourceId: "viShots",
      establishes: "'Mount Kalaga National Park' appears as an official place artwork title and an official destination, and the word 'National Park' is Rockstar's own.",
      limitations: "Establishes a name and a protected designation only. Area, boundaries, elevation, ecology, trails and facilities are all UNKNOWN." },
    { id: "EV-GEO-006", claim: "A Leonida Penitentiary exists.", status: "confirmed", sourceId: "viPlaces",
      establishes: "Official Lucia Caminos biography: 'Fighting for her family landed her in the Leonida Penitentiary. Sheer luck got her out.'",
      limitations: "Establishes the institution's existence only. Its location, county, capacity and architecture are unknown, so no spatial relationship can be asserted for it." },
    { id: "EV-GEO-007", claim: "A Coast Guard operates in Leonida's coastal waters.", status: "confirmed", sourceId: "viPlaces",
      establishes: "Official Cal Hampton biography: 'Cal feels safest hanging at home, snooping on Coast Guard comms with a few beers and some private browser tabs open.'",
      limitations: "Establishes the service's existence and Jason's contact with it. No station, vessel, base or coverage area is named." },
    { id: "EV-GEO-008", claim: "Leonida has an official brand identity: 'The Goodtime State'.", status: "confirmed", sourceId: "storeCollection",
      establishes: "Merchandise is sold as 'Grand Theft Auto VI: The Goodtime State – Vice City Collection', with 'The Goodtime State' a registered trademark in the product's trademark notice, and the poster described as 'a full view of the Leonida map'.",
      limitations: "'The Goodtime State' is presented as a brand and motto, not a formal governmental motto. The poster map is merchandise illustration and must not be used as a reference map." },
    { id: "EV-GEO-009", claim: "Rockstar has published no counties, districts, roads, airports or landmarks for Leonida.", status: "observed", sourceId: "viShots",
      establishes: "An exhaustive review of Rockstar's official screenshot and artwork index and the 'Only in Leonida' destination page returns place names only at the scale of state, city, island region, town and national park. No administrative subdivision, road, airport or named landmark appears anywhere in the official record.",
      limitations: "ABSENCE OF EVIDENCE, recorded deliberately. A statement about what Rockstar has published, not a claim that these features do not exist. A map of this size plainly contains unnamed roads and neighbourhoods." },
    { id: "EV-GEO-010", claim: "The circulating county and district lists are not established.", status: "unresolved", sourceId: "gtaWiki",
      establishes: "A third-party wiki publishes a county and district structure for Leonida alongside an explicit banner stating the page is under construction for the upcoming release and 'may contain sensitive leaked content which may or may not appear in the final game'.",
      limitations: "NOT EVIDENCE. The source self-identifies as potentially leaked and is not attributable to Rockstar. These names are quarantined on this page and never mapped or counted." },

    { id: "EV-GEO-011", claim: "Leonida's map is roughly twice the size of GTA V's, with Vice City roughly twice Los Santos.", status: "confirmed", sourceId: "nelson",
      establishes: "Rockstar North co-studio head Rob Nelson is attributed with ~2x GTA V / ~3x RDR2 for the state map and ~2x Los Santos for Vice City. Already logged as CNF-009 in confirmed.html.",
      limitations: "RELATIVE figures only — ratios to other games, not square miles. They imply no coastline length, road mileage or population. Leonida's absolute size remains UNKNOWN." },
    { id: "EV-GEO-012", claim: "Leonida's neon, retro and beach identity is deliberate design language.", status: "confirmed", sourceId: "storeCollection",
      establishes: "Three independent official properties reinforce it: 'neon-soaked streets of Vice City' (site), 'When the sun fades and the neon glows' (places page), and the Vintage Vice City Pack 'flash back to when the neon burned brightest' (store). Merchandise adds 'Goodtime State' and 'Vice City, USA.' branding.",
      limitations: "Establishes intended presentation. It does not establish architectural inspiration for any specific building, and no real-world architectural source is claimed." },
    { id: "EV-GEO-013", claim: "Leonida's documented economy is tourism, nightlife, music, real estate, maritime and air smuggling, and bank robbery.", status: "confirmed", sourceId: "viPlaces",
      establishes: "Official character and destination copy names specific businesses and activities: a strip club, a recording studio, a real-estate empire, a record label, a working boat yard, contraband air freight, and a bank-robbery crew based in Ambrosia.",
      limitations: "No statistical figure of any kind is published — no employment, revenue, population or output. No manufacturing, agriculture or fishing is described for any location." },
    { id: "EV-GEO-014", claim: "No Leonida wildlife distribution is established.", status: "unresolved", sourceId: "viPlaces",
      establishes: "The only fauna named in official material are birds described as flying 'in perfect formation', and two cultural mascots: the alligator of 'Macca the Gator' and Chunkee the Manatee, both appearing as merchandise.",
      limitations: "Mascot status is cultural, not ecological. No species, population, habitat or distribution is established, and mascot iconography must not be treated as a field observation." },
    { id: "EV-GEO-015", claim: "Sunlight is Leonida's only officially stated atmospheric condition.", status: "confirmed", sourceId: "viSite",
      establishes: "'the sunniest place in America' (site), 'block out the Leonida sun' (merchandise), and 'Another day in paradise' (places page) establish persistent bright sunlight.",
      limitations: "No temperature, humidity, rainfall, wind or storm data is published. No storm, hurricane, fog or severe-weather event is named. Climate beyond sunlight is UNKNOWN." },
    { id: "EV-GEO-016", claim: "Leonida's structure is a coastal core with economically-defined satellites.", status: "inferred", sourceId: "viPlaces",
      establishes: "The official destination set is a coastal city plus an island chain plus three inland towns plus one protected upland area. Each inland town is officially defined by a single activity that points back toward Vice City.",
      limitations: "INFERENCE from the shape of the official set, not a Rockstar statement. Rockstar has published no statement that Leonida's destinations relate to one another in this way." },
    { id: "EV-GEO-017", claim: "The Florida parallel explains Leonida's form but is not evidence of its geography.", status: "inferred", sourceId: "florida",
      establishes: "Real Florida's structure — a coastal metropolis, a 'Keys' island chain, inland towns and one flagship national park — maps closely onto Leonida's official place set, and Rockstar's naming follows Florida vocabulary directly.",
      limitations: "REAL-WORLD COMPARISON, not Leonida evidence. The real Everglades is a wetland and GTA VI has established no wetland anywhere. That inference is explicitly refused." }
];


/* ------------------------------------------------------------
   GEO_GLOSSARY
   The distinctions this section exists to preserve.
   ------------------------------------------------------------ */
const GEO_GLOSSARY = [
    { term: "OFFICIALLY NAMED", definition: "The place name appears on a Rockstar property — place artwork, an 'Only in Leonida' destination, or official character copy. The only category treated as fact on this page." },
    { term: "DIRECTLY OBSERVED", definition: "A characteristic visible in official released material. Observation is not naming: Rockstar can show you a beach without ever calling it one." },
    { term: "INFERRED", definition: "An analytical conclusion drawn from official evidence. Always labelled. Never presented as something Rockstar said." },
    { term: "UNVERIFIED CLAIM", definition: "A name circulating in community material with no attributable source. Quarantined in one section, never mapped, never counted." },
    { term: "UNKNOWN", definition: "Rockstar has not said. Used instead of a plausible guess. Most of Leonida's geography is in this category, deliberately." },
    { term: "ABSENCE OF EVIDENCE", definition: "A recorded finding that something has not been published. Distinct from evidence that the thing does not exist. Leonida almost certainly has roads, districts and counties — Rockstar has not named them." },
    { term: "PLACE", definition: "A named location in Leonida. On this page: seven of them." },
    { term: "DESTINATION", definition: "One of the six places Rockstar links to with its own profile on 'Only in Leonida'. A destination is a marketing unit, not the same as a place in the game's world." },
    { term: "REGION", definition: "A named area rather than a settlement — currently the Leonida Keys and Mount Kalaga National Park. Rockstar has published no administrative regions." }
];

