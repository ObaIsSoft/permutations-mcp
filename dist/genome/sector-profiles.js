/**
 * Permutations MCP - Sector Profiles
 *
 * Mathematical trait biases for chromosome-derived generation.
 * NO named colors. NO templates. Only mathematical constraints.
 *
 * Philosophy: Sector provides BIAS, not SELECTION.
 * The SHA-256 hash + 26 chromosomes generate infinitely.
 */
/**
 * Mathematical color biases by sector.
 * Derived from real-world analysis, expressed as ranges for generative output.
 */
const SECTOR_COLOR_BIAS = {
    healthcare: {
        // Blue-cyan range (200-220°): trust, calm, clinical
        // NOT "blue" - a mathematical range
        hueRange: [200, 220],
        saturationBase: 0.45,
        saturationVariance: 0.15,
        lightnessBase: 0.40,
        lightnessVariance: 0.10,
        temperature: "neutral"
    },
    fintech: {
        // Purple-blue range (250-270°): innovation, premium, trust
        hueRange: [250, 270],
        saturationBase: 0.50,
        saturationVariance: 0.20,
        lightnessBase: 0.35,
        lightnessVariance: 0.10,
        temperature: "cool"
    },
    automotive: {
        // Wide range - depends on brand, but tends toward neutral/cool
        hueRange: [0, 360], // Unrestricted - automotive varies wildly by brand
        saturationBase: 0.60,
        saturationVariance: 0.30,
        lightnessBase: 0.35,
        lightnessVariance: 0.15,
        temperature: "neutral"
    },
    education: {
        // Blue-green range (180-210°): knowledge, growth, trust
        hueRange: [180, 210],
        saturationBase: 0.40,
        saturationVariance: 0.15,
        lightnessBase: 0.35,
        lightnessVariance: 0.10,
        temperature: "neutral"
    },
    commerce: {
        // Wide range - depends on brand positioning
        hueRange: [0, 360], // Unrestricted
        saturationBase: 0.55,
        saturationVariance: 0.25,
        lightnessBase: 0.40,
        lightnessVariance: 0.15,
        temperature: "warm"
    },
    entertainment: {
        // Red-purple range (320-280°): excitement, drama, creativity
        hueRange: [280, 340],
        saturationBase: 0.65,
        saturationVariance: 0.20,
        lightnessBase: 0.40,
        lightnessVariance: 0.15,
        temperature: "warm"
    },
    manufacturing: {
        // Blue-gray range (200-220°): industrial, reliable, professional
        hueRange: [200, 220],
        saturationBase: 0.30,
        saturationVariance: 0.10,
        lightnessBase: 0.35,
        lightnessVariance: 0.10,
        temperature: "cool"
    },
    legal: {
        // Deep blue range (220-240°): authority, trust, tradition
        hueRange: [220, 240],
        saturationBase: 0.35,
        saturationVariance: 0.10,
        lightnessBase: 0.25,
        lightnessVariance: 0.08,
        temperature: "cool"
    },
    real_estate: {
        // Warm neutral range (30-50°): homes, warmth, welcoming
        hueRange: [30, 60],
        saturationBase: 0.35,
        saturationVariance: 0.15,
        lightnessBase: 0.45,
        lightnessVariance: 0.10,
        temperature: "warm"
    },
    travel: {
        // Teal-cyan range (170-190°): ocean, escape, adventure
        hueRange: [170, 200],
        saturationBase: 0.50,
        saturationVariance: 0.20,
        lightnessBase: 0.40,
        lightnessVariance: 0.15,
        temperature: "warm"
    },
    food: {
        // Warm earth tones (15-45°): appetizing, fresh, natural
        hueRange: [15, 45],
        saturationBase: 0.55,
        saturationVariance: 0.20,
        lightnessBase: 0.45,
        lightnessVariance: 0.15,
        temperature: "warm"
    },
    sports: {
        // High energy range (0-30° and 340-360): red, orange, energy
        hueRange: [0, 30],
        saturationBase: 0.70,
        saturationVariance: 0.20,
        lightnessBase: 0.45,
        lightnessVariance: 0.15,
        temperature: "warm"
    },
    technology: {
        // Wide range but tends blue-purple (240-270°): innovation, trust
        hueRange: [240, 270],
        saturationBase: 0.45,
        saturationVariance: 0.20,
        lightnessBase: 0.35,
        lightnessVariance: 0.15,
        temperature: "cool"
    }
};
// ============================================================================
// HERO TYPE WEIGHTS (Mathematical bias, not template)
// ============================================================================
/**
 * Hero type selection weights by sector.
 * Used to bias ch19_hero_type selection from SHA-256 hash.
 * NOT a template - just shifts probability distribution.
 */
const HERO_TYPE_WEIGHTS = {
    healthcare: {
        product_ui: 0.05,
        product_video: 0.10,
        brand_logo: 0.05,
        stats_counter: 0.10,
        search_discovery: 0.10,
        content_carousel: 0.10,
        trust_authority: 0.30,
        service_showcase: 0.25,
        editorial_feature: 0.15,
        configurator_3d: 0.00,
        aspirational_imagery: 0.10,
        testimonial_focus: 0.20
    },
    fintech: {
        product_ui: 0.20,
        product_video: 0.10,
        brand_logo: 0.05,
        stats_counter: 0.30,
        search_discovery: 0.05,
        content_carousel: 0.10,
        trust_authority: 0.25,
        service_showcase: 0.10,
        editorial_feature: 0.05,
        configurator_3d: 0.00,
        aspirational_imagery: 0.05,
        testimonial_focus: 0.10
    },
    automotive: {
        product_ui: 0.05,
        product_video: 0.15,
        brand_logo: 0.10,
        stats_counter: 0.05,
        search_discovery: 0.10,
        content_carousel: 0.15,
        trust_authority: 0.05,
        service_showcase: 0.10,
        editorial_feature: 0.05,
        configurator_3d: 0.25,
        aspirational_imagery: 0.35,
        testimonial_focus: 0.05
    },
    education: {
        product_ui: 0.15,
        product_video: 0.15,
        brand_logo: 0.05,
        stats_counter: 0.15,
        search_discovery: 0.20,
        content_carousel: 0.15,
        trust_authority: 0.15,
        service_showcase: 0.10,
        editorial_feature: 0.25,
        configurator_3d: 0.00,
        aspirational_imagery: 0.10,
        testimonial_focus: 0.15
    },
    commerce: {
        product_ui: 0.10,
        product_video: 0.15,
        brand_logo: 0.10,
        stats_counter: 0.05,
        search_discovery: 0.20,
        content_carousel: 0.25,
        trust_authority: 0.10,
        service_showcase: 0.10,
        editorial_feature: 0.10,
        configurator_3d: 0.05,
        aspirational_imagery: 0.20,
        testimonial_focus: 0.10
    },
    entertainment: {
        product_ui: 0.10,
        product_video: 0.35,
        brand_logo: 0.10,
        stats_counter: 0.05,
        search_discovery: 0.25,
        content_carousel: 0.30,
        trust_authority: 0.00,
        service_showcase: 0.05,
        editorial_feature: 0.10,
        configurator_3d: 0.00,
        aspirational_imagery: 0.15,
        testimonial_focus: 0.05
    },
    manufacturing: {
        product_ui: 0.10,
        product_video: 0.15,
        brand_logo: 0.10,
        stats_counter: 0.20,
        search_discovery: 0.10,
        content_carousel: 0.15,
        trust_authority: 0.20,
        service_showcase: 0.25,
        editorial_feature: 0.10,
        configurator_3d: 0.05,
        aspirational_imagery: 0.05,
        testimonial_focus: 0.10
    },
    legal: {
        product_ui: 0.05,
        product_video: 0.05,
        brand_logo: 0.05,
        stats_counter: 0.15,
        search_discovery: 0.15,
        content_carousel: 0.05,
        trust_authority: 0.40,
        service_showcase: 0.20,
        editorial_feature: 0.15,
        configurator_3d: 0.00,
        aspirational_imagery: 0.00,
        testimonial_focus: 0.15
    },
    real_estate: {
        product_ui: 0.05,
        product_video: 0.10,
        brand_logo: 0.05,
        stats_counter: 0.10,
        search_discovery: 0.40,
        content_carousel: 0.15,
        trust_authority: 0.10,
        service_showcase: 0.15,
        editorial_feature: 0.10,
        configurator_3d: 0.00,
        aspirational_imagery: 0.30,
        testimonial_focus: 0.10
    },
    travel: {
        product_ui: 0.05,
        product_video: 0.20,
        brand_logo: 0.10,
        stats_counter: 0.05,
        search_discovery: 0.35,
        content_carousel: 0.20,
        trust_authority: 0.05,
        service_showcase: 0.10,
        editorial_feature: 0.15,
        configurator_3d: 0.00,
        aspirational_imagery: 0.40,
        testimonial_focus: 0.10
    },
    food: {
        product_ui: 0.10,
        product_video: 0.20,
        brand_logo: 0.10,
        stats_counter: 0.05,
        search_discovery: 0.20,
        content_carousel: 0.25,
        trust_authority: 0.10,
        service_showcase: 0.20,
        editorial_feature: 0.10,
        configurator_3d: 0.00,
        aspirational_imagery: 0.35,
        testimonial_focus: 0.15
    },
    sports: {
        product_ui: 0.10,
        product_video: 0.25,
        brand_logo: 0.15,
        stats_counter: 0.20,
        search_discovery: 0.15,
        content_carousel: 0.20,
        trust_authority: 0.05,
        service_showcase: 0.10,
        editorial_feature: 0.15,
        configurator_3d: 0.00,
        aspirational_imagery: 0.30,
        testimonial_focus: 0.10
    },
    technology: {
        product_ui: 0.30,
        product_video: 0.15,
        brand_logo: 0.10,
        stats_counter: 0.15,
        search_discovery: 0.05,
        content_carousel: 0.10,
        trust_authority: 0.10,
        service_showcase: 0.15,
        editorial_feature: 0.10,
        configurator_3d: 0.00,
        aspirational_imagery: 0.05,
        testimonial_focus: 0.10
    }
};
// ============================================================================
// TRUST APPROACH WEIGHTS (Mathematical bias)
// ============================================================================
const TRUST_APPROACH_WEIGHTS = {
    healthcare: {
        credentials: 0.35,
        testimonials: 0.20,
        stats: 0.15,
        security_badges: 0.10,
        social_proof_logos: 0.05,
        case_studies: 0.05,
        guarantees: 0.05,
        transparency_reports: 0.05
    },
    fintech: {
        credentials: 0.15,
        testimonials: 0.10,
        stats: 0.20,
        security_badges: 0.30,
        social_proof_logos: 0.10,
        case_studies: 0.05,
        guarantees: 0.05,
        transparency_reports: 0.05
    },
    automotive: {
        credentials: 0.10,
        testimonials: 0.15,
        stats: 0.20,
        security_badges: 0.15,
        social_proof_logos: 0.05,
        case_studies: 0.10,
        guarantees: 0.15,
        transparency_reports: 0.10
    },
    education: {
        credentials: 0.25,
        testimonials: 0.20,
        stats: 0.20,
        security_badges: 0.05,
        social_proof_logos: 0.15,
        case_studies: 0.10,
        guarantees: 0.03,
        transparency_reports: 0.02
    },
    commerce: {
        credentials: 0.05,
        testimonials: 0.20,
        stats: 0.10,
        security_badges: 0.25,
        social_proof_logos: 0.15,
        case_studies: 0.05,
        guarantees: 0.15,
        transparency_reports: 0.05
    },
    entertainment: {
        credentials: 0.05,
        testimonials: 0.15,
        stats: 0.30,
        security_badges: 0.05,
        social_proof_logos: 0.10,
        case_studies: 0.05,
        guarantees: 0.05,
        transparency_reports: 0.05
    },
    manufacturing: {
        credentials: 0.25,
        testimonials: 0.15,
        stats: 0.25,
        security_badges: 0.10,
        social_proof_logos: 0.10,
        case_studies: 0.10,
        guarantees: 0.03,
        transparency_reports: 0.02
    },
    legal: {
        credentials: 0.40,
        testimonials: 0.15,
        stats: 0.20,
        security_badges: 0.05,
        social_proof_logos: 0.05,
        case_studies: 0.10,
        guarantees: 0.03,
        transparency_reports: 0.02
    },
    real_estate: {
        credentials: 0.15,
        testimonials: 0.20,
        stats: 0.15,
        security_badges: 0.10,
        social_proof_logos: 0.15,
        case_studies: 0.10,
        guarantees: 0.10,
        transparency_reports: 0.05
    },
    travel: {
        credentials: 0.05,
        testimonials: 0.25,
        stats: 0.15,
        security_badges: 0.15,
        social_proof_logos: 0.20,
        case_studies: 0.10,
        guarantees: 0.05,
        transparency_reports: 0.05
    },
    food: {
        credentials: 0.10,
        testimonials: 0.25,
        stats: 0.15,
        security_badges: 0.20,
        social_proof_logos: 0.10,
        case_studies: 0.05,
        guarantees: 0.10,
        transparency_reports: 0.05
    },
    sports: {
        credentials: 0.10,
        testimonials: 0.20,
        stats: 0.30,
        security_badges: 0.05,
        social_proof_logos: 0.15,
        case_studies: 0.10,
        guarantees: 0.05,
        transparency_reports: 0.05
    },
    technology: {
        credentials: 0.10,
        testimonials: 0.15,
        stats: 0.20,
        security_badges: 0.15,
        social_proof_logos: 0.20,
        case_studies: 0.10,
        guarantees: 0.05,
        transparency_reports: 0.05
    }
};
// ============================================================================
// SUB-SECTOR KEYWORDS (Kept - used for content classification)
// ============================================================================
export const SUB_SECTOR_KEYWORDS = {
    healthcare: {
        surgical: ["surgery", "surgeon", "operating", "procedure", "OR", "cutting", "incision", "scalpel", "anesthesia"],
        wellness: ["wellness", "preventive", "holistic", "nutrition", "fitness", "mental health", "yoga", "meditation"],
        emergency: ["ER", "emergency", "urgent care", "trauma", "critical", "ambulance", "911"],
        pediatric: ["pediatric", "children", "kids", "child", "adolescent", "newborn", "infant"],
        geriatric: ["geriatric", "elderly", "senior", "aging", "memory care", "nursing home"],
        cosmetic: ["cosmetic", "plastic surgery", "aesthetic", "beauty", "rejuvenation", "botox"],
        dental: ["dental", "dentist", "orthodontics", "oral", "teeth", "braces"],
        diagnostic: ["imaging", "MRI", "CT scan", "lab", "diagnostic", "testing", "x-ray", "ultrasound"],
        financial: ["billing", "insurance", "payment", "financial", "cost", "price", "claims"]
    },
    fintech: {
        consumer: ["personal finance", "budgeting", "savings", "checking", "app", "consumer"],
        enterprise: ["B2B", "enterprise", "corporate", "treasury", "institutional"],
        trading: ["trading", "stocks", "crypto", "investment", "portfolio", "brokerage"],
        lending: ["loan", "credit", "mortgage", "lending", "borrow", "debt"],
        payments: ["payment", "checkout", "POS", "merchant", "transaction", "gateway"],
        wealth: ["wealth management", "HNW", "high net worth", "private banking", "advisor", "retirement"]
    },
    automotive: {
        luxury: ["luxury", "premium", "high-end", "exclusive", "prestige", "BMW", "Mercedes"],
        economy: ["budget", "economy", "affordable", "value", "compact"],
        electric: ["EV", "electric", "tesla", "battery", "zero emission", "green"],
        commercial: ["fleet", "commercial", "truck", "van", "business"]
    },
    education: {
        k12: ["K-12", "school", "elementary", "middle school", "high school", "primary"],
        higher: ["university", "college", "undergraduate", "graduate", "PhD", "academic"],
        corporate: ["corporate training", "professional development", "workplace learning"],
        creative: ["art school", "design", "creative", "portfolio", "studio"]
    },
    commerce: {
        luxury: ["luxury", "designer", "high-end", "boutique", "exclusive"],
        fast: ["fast fashion", "trendy", "affordable", "quick"],
        b2b: ["wholesale", "B2B", "business", "bulk", "trade"],
        marketplace: ["marketplace", "platform", "seller", "vendor", "multi-vendor"]
    },
    entertainment: {
        streaming: ["streaming", "video", "movie", "TV", "show", "series"],
        gaming: ["game", "gaming", "esports", "player", "console"],
        music: ["music", "streaming", "artist", "album", "playlist"],
        live: ["live", "event", "concert", "ticket", "venue"]
    },
    manufacturing: {
        industrial: ["industrial", "heavy", "machinery", "equipment"],
        consumer: ["consumer goods", "product", "retail"],
        electronics: ["electronics", "tech", "semiconductor", "circuit"],
        textile: ["textile", "fabric", "apparel", "clothing"]
    },
    legal: {
        corporate: ["corporate", "business", "M&A", "contract", "commercial"],
        criminal: ["criminal", "defense", "prosecution", "trial"],
        family: ["family", "divorce", "custody", "estate", "will"],
        personal_injury: ["injury", "accident", "personal injury", "compensation"]
    },
    real_estate: {
        residential: ["home", "house", "apartment", "condo", "residential"],
        commercial: ["commercial", "office", "retail", "industrial"],
        rental: ["rent", "lease", "tenant", "landlord", "property management"],
        luxury: ["luxury", "estate", "mansion", "high-end"]
    },
    travel: {
        leisure: ["vacation", "holiday", "leisure", "resort", "beach"],
        business: ["business travel", "corporate", "conference"],
        adventure: ["adventure", "trekking", "expedition", "outdoor"],
        budget: ["budget", "backpacking", "hostel", "cheap"]
    },
    food: {
        restaurant: ["restaurant", "dining", "chef", "menu", "cuisine"],
        delivery: ["delivery", "takeout", "order", "food delivery"],
        grocery: ["grocery", "supermarket", "market", "fresh"],
        beverage: ["coffee", "bar", "drink", "beverage", "cafe"]
    },
    sports: {
        professional: ["professional", "league", "NBA", "NFL", "premier"],
        fitness: ["fitness", "gym", "workout", "training", "exercise"],
        outdoor: ["outdoor", "hiking", "cycling", "running"],
        esports: ["esports", "gaming", "competitive", "tournament"]
    },
    technology: {
        saas: ["SaaS", "software", "platform", "cloud"],
        ai: ["AI", "machine learning", "artificial intelligence", "LLM"],
        infrastructure: ["infrastructure", "devops", "cloud", "server"],
        consumer: ["app", "consumer", "mobile", "social"]
    }
};
const SECTOR_DEFAULTS = {
    healthcare: {
        typography: "humanist",
        motion: "spring",
        edge: "soft",
        trustProminence: "prominent",
        contentDepth: "extensive",
        generate3D: false
    },
    fintech: {
        typography: "geometric",
        motion: "step",
        edge: "sharp",
        trustProminence: "prominent",
        contentDepth: "extensive",
        generate3D: false
    },
    automotive: {
        typography: "transitional",
        motion: "spring",
        edge: "soft",
        trustProminence: "integrated",
        contentDepth: "moderate",
        generate3D: true
    },
    education: {
        typography: "humanist",
        motion: "spring",
        edge: "soft",
        trustProminence: "integrated",
        contentDepth: "comprehensive",
        generate3D: false
    },
    commerce: {
        typography: "geometric",
        motion: "spring",
        edge: "soft",
        trustProminence: "integrated",
        contentDepth: "extensive",
        generate3D: false
    },
    entertainment: {
        typography: "transitional",
        motion: "spring",
        edge: "organic",
        trustProminence: "subtle",
        contentDepth: "moderate",
        generate3D: false
    },
    manufacturing: {
        typography: "geometric",
        motion: "none",
        edge: "sharp",
        trustProminence: "prominent",
        contentDepth: "extensive",
        generate3D: false
    },
    legal: {
        typography: "transitional",
        motion: "none",
        edge: "sharp",
        trustProminence: "hero_feature",
        contentDepth: "moderate",
        generate3D: false
    },
    real_estate: {
        typography: "humanist",
        motion: "spring",
        edge: "soft",
        trustProminence: "integrated",
        contentDepth: "extensive",
        generate3D: false
    },
    travel: {
        typography: "humanist",
        motion: "spring",
        edge: "organic",
        trustProminence: "integrated",
        contentDepth: "moderate",
        generate3D: false
    },
    food: {
        typography: "humanist",
        motion: "spring",
        edge: "organic",
        trustProminence: "prominent",
        contentDepth: "moderate",
        generate3D: false
    },
    sports: {
        typography: "geometric",
        motion: "spring",
        edge: "sharp",
        trustProminence: "subtle",
        contentDepth: "moderate",
        generate3D: false
    },
    technology: {
        typography: "geometric",
        motion: "spring",
        edge: "soft",
        trustProminence: "integrated",
        contentDepth: "moderate",
        generate3D: false
    }
};
// ============================================================================
// PUBLIC API
// ============================================================================
/**
 * Get color bias for a sector - mathematical ranges, not named colors
 */
export function getColorBias(sector) {
    return SECTOR_COLOR_BIAS[sector];
}
/**
 * Generate hue from sector bias using hash-derived entropy
 * Returns actual hue value (0-360), not a color name
 */
export function generateHueFromBias(sector, hashByte) {
    const bias = SECTOR_COLOR_BIAS[sector];
    const [min, max] = bias.hueRange;
    // Use hash byte to select position within range
    const normalized = hashByte / 255;
    return Math.round(min + (normalized * (max - min)));
}
/**
 * Generate saturation from sector bias
 */
export function generateSaturationFromBias(sector, hashByte) {
    const bias = SECTOR_COLOR_BIAS[sector];
    const normalized = hashByte / 255;
    // Center around base with variance
    const variance = (normalized - 0.5) * 2 * bias.saturationVariance;
    return Math.max(0, Math.min(1, bias.saturationBase + variance));
}
/**
 * Generate lightness from sector bias
 */
export function generateLightnessFromBias(sector, hashByte) {
    const bias = SECTOR_COLOR_BIAS[sector];
    const normalized = hashByte / 255;
    const variance = (normalized - 0.5) * 2 * bias.lightnessVariance;
    return Math.max(0, Math.min(1, bias.lightnessBase + variance));
}
/**
 * Select hero type using weighted distribution
 */
export function selectHeroType(sector, hashByte) {
    const weights = HERO_TYPE_WEIGHTS[sector];
    const normalized = hashByte / 255;
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let cumulative = 0;
    const threshold = normalized * total;
    for (const [type, weight] of Object.entries(weights)) {
        cumulative += weight;
        if (cumulative >= threshold) {
            return type;
        }
    }
    return Object.keys(weights)[0];
}
/**
 * Select trust approach using weighted distribution
 */
export function selectTrustApproach(sector, hashByte) {
    const weights = TRUST_APPROACH_WEIGHTS[sector];
    const normalized = hashByte / 255;
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let cumulative = 0;
    const threshold = normalized * total;
    for (const [approach, weight] of Object.entries(weights)) {
        cumulative += weight;
        if (cumulative >= threshold) {
            return approach;
        }
    }
    return Object.keys(weights)[0];
}
/**
 * Classify sub-sector based on content keywords
 */
export function classifySubSector(text, primarySector) {
    const keywords = SUB_SECTOR_KEYWORDS[primarySector];
    if (!keywords) {
        return { subSector: `${primarySector}_general`, confidence: 0.5 };
    }
    const textLower = text.toLowerCase();
    let bestMatch = null;
    let maxScore = 0;
    for (const [subSector, terms] of Object.entries(keywords)) {
        const score = terms.reduce((acc, term) => {
            const regex = new RegExp(`\\b${term.toLowerCase()}\\b`, 'g');
            const matches = (textLower.match(regex) || []).length;
            return acc + matches;
        }, 0);
        if (score > maxScore) {
            maxScore = score;
            bestMatch = subSector;
        }
    }
    // Calculate confidence based on keyword density
    const wordCount = text.split(/\s+/).length;
    const confidence = Math.min(maxScore / Math.max(wordCount * 0.01, 1), 1);
    const subSector = bestMatch
        ? `${primarySector}_${bestMatch}`
        : `${primarySector}_general`;
    return { subSector, confidence };
}
/**
 * Get sector defaults (trait biases, not templates)
 */
export function getSectorDefaults(sector) {
    return SECTOR_DEFAULTS[sector];
}
/**
 * Validate sector name
 */
export function isValidSector(sector) {
    return sector in SECTOR_COLOR_BIAS;
}
/**
 * List all available sectors
 */
export function listSectors() {
    return Object.keys(SECTOR_COLOR_BIAS);
}
/**
 * Get sub-sectors for a primary sector
 */
export function getSubSectors(sector) {
    const keywords = SUB_SECTOR_KEYWORDS[sector];
    if (!keywords)
        return [];
    return Object.keys(keywords).map(k => `${sector}_${k}`);
}
export function getSectorProfile(sector) {
    const defaults = SECTOR_DEFAULTS[sector];
    const colorBias = SECTOR_COLOR_BIAS[sector];
    return {
        sector,
        colorProfile: {
            warmthBias: colorBias.temperature === "warm" ? 0.3 : colorBias.temperature === "cool" ? -0.3 : 0,
            minContrast: 4.5
        },
        defaultTypography: defaults.typography,
        motionPreference: defaults.motion,
        edgePreference: defaults.edge,
        recommendedTrustProminence: defaults.trustProminence,
        contentDepth: defaults.contentDepth,
        generate3D: defaults.generate3D,
        subSectorKeywords: SUB_SECTOR_KEYWORDS[sector]
    };
}
