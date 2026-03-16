/**
 * Permutations MCP - Sector Profiles
 *
 * Mathematical trait biases for chromosome-derived generation.
 * NO named colors. NO templates. Only mathematical constraints.
 *
 * Philosophy: Sector provides BIAS, not SELECTION.
 * The SHA-256 hash + 32 chromosomes generate infinitely.
 */
/**
 * Mathematical color biases by sector.
 * Derived from real-world analysis, expressed as ranges for generative output.
 */
const SECTOR_COLOR_BIAS = {
    healthcare: {
        // Forbidden: blood red [0-20] and garish magenta [320-360] — signal danger/emergency
        forbiddenRanges: [[0, 20], [320, 360]],
        saturationBase: 0.45,
        saturationVariance: 0.15,
        lightnessBase: 0.40,
        lightnessVariance: 0.10,
        temperature: "neutral"
    },
    fintech: {
        // Forbidden: casual yellow-green [60-100] — reads amateur/untrustworthy
        forbiddenRanges: [[60, 100]],
        saturationBase: 0.50,
        saturationVariance: 0.20,
        lightnessBase: 0.35,
        lightnessVariance: 0.10,
        temperature: "cool"
    },
    automotive: {
        // Unrestricted — automotive varies wildly by brand (Ferrari=red, BMW=blue, etc.)
        forbiddenRanges: [],
        saturationBase: 0.60,
        saturationVariance: 0.30,
        lightnessBase: 0.35,
        lightnessVariance: 0.15,
        temperature: "neutral"
    },
    education: {
        // Forbidden: aggressive warm tones [0-20] and garish magenta [320-360] — unsafe for learning
        forbiddenRanges: [[0, 20], [320, 360]],
        saturationBase: 0.40,
        saturationVariance: 0.15,
        lightnessBase: 0.35,
        lightnessVariance: 0.10,
        temperature: "neutral"
    },
    commerce: {
        // Unrestricted — brand-led positioning (Amazon=orange, eBay=multi, Shopify=green)
        forbiddenRanges: [],
        saturationBase: 0.55,
        saturationVariance: 0.25,
        lightnessBase: 0.40,
        lightnessVariance: 0.15,
        temperature: "warm"
    },
    entertainment: {
        // Unrestricted — energy and drama can come from any hue
        forbiddenRanges: [],
        saturationBase: 0.65,
        saturationVariance: 0.20,
        lightnessBase: 0.40,
        lightnessVariance: 0.15,
        temperature: "warm"
    },
    manufacturing: {
        // Forbidden: garish pinks/magentas [300-360] and warm reds [0-20] — feel unsafe/industrial-wrong
        forbiddenRanges: [[300, 360], [0, 20]],
        saturationBase: 0.30,
        saturationVariance: 0.10,
        lightnessBase: 0.35,
        lightnessVariance: 0.10,
        temperature: "cool"
    },
    legal: {
        // Forbidden: warm/playful [0-50] and casual greens [80-150] — undermine authority
        forbiddenRanges: [[0, 50], [80, 150]],
        saturationBase: 0.35,
        saturationVariance: 0.10,
        lightnessBase: 0.25,
        lightnessVariance: 0.08,
        temperature: "cool"
    },
    real_estate: {
        // Forbidden: cold corporate blue [220-280] — undermines warmth/welcome
        forbiddenRanges: [[220, 280]],
        saturationBase: 0.35,
        saturationVariance: 0.15,
        lightnessBase: 0.45,
        lightnessVariance: 0.10,
        temperature: "warm"
    },
    travel: {
        // Forbidden: cold corporate blue [220-280] — undermines escape/adventure warmth
        forbiddenRanges: [[220, 280]],
        saturationBase: 0.50,
        saturationVariance: 0.20,
        lightnessBase: 0.40,
        lightnessVariance: 0.15,
        temperature: "warm"
    },
    food: {
        // Forbidden: cold corporate blue [220-280] — kills appetite
        forbiddenRanges: [[220, 280]],
        saturationBase: 0.55,
        saturationVariance: 0.20,
        lightnessBase: 0.45,
        lightnessVariance: 0.15,
        temperature: "warm"
    },
    sports: {
        // Unrestricted — full spectrum valid (team colors span everything)
        forbiddenRanges: [],
        saturationBase: 0.70,
        saturationVariance: 0.20,
        lightnessBase: 0.45,
        lightnessVariance: 0.15,
        temperature: "warm"
    },
    technology: {
        // Unrestricted — tech spans full spectrum (Cloudflare=orange, GitHub=dark, Stripe=purple, Figma=multi)
        forbiddenRanges: [],
        saturationBase: 0.50,
        saturationVariance: 0.25,
        lightnessBase: 0.38,
        lightnessVariance: 0.15,
        temperature: "cool"
    },
    nonprofit: {
        // Forbidden: alarming red [0-20] and garish magenta/red-pink [300-360] — undermine compassion
        forbiddenRanges: [[0, 20], [300, 360]],
        saturationBase: 0.45,
        saturationVariance: 0.15,
        lightnessBase: 0.40,
        lightnessVariance: 0.10,
        temperature: "warm"
    },
    government: {
        // Forbidden: warm/casual [0-60] and casual greens [80-160] — undermine civic authority
        forbiddenRanges: [[0, 60], [80, 160]],
        saturationBase: 0.35,
        saturationVariance: 0.10,
        lightnessBase: 0.28,
        lightnessVariance: 0.08,
        temperature: "cool"
    },
    media: {
        // Unrestricted — editorial voice and brand define the palette
        forbiddenRanges: [],
        saturationBase: 0.50,
        saturationVariance: 0.25,
        lightnessBase: 0.35,
        lightnessVariance: 0.15,
        temperature: "neutral"
    },
    crypto_web3: {
        // Forbidden: natural greens [60-130] — feel naïve/organic in speculative/tech context
        forbiddenRanges: [[60, 130]],
        saturationBase: 0.65,
        saturationVariance: 0.20,
        lightnessBase: 0.45,
        lightnessVariance: 0.15,
        temperature: "cool"
    },
    gaming: {
        // Forbidden: clinical teal [160-200] — kills competitive energy
        forbiddenRanges: [[160, 200]],
        saturationBase: 0.70,
        saturationVariance: 0.20,
        lightnessBase: 0.45,
        lightnessVariance: 0.15,
        temperature: "warm"
    },
    hospitality: {
        // Forbidden: cold corporate blue [220-280] — undermines welcome/warmth
        forbiddenRanges: [[220, 280]],
        saturationBase: 0.40,
        saturationVariance: 0.15,
        lightnessBase: 0.48,
        lightnessVariance: 0.12,
        temperature: "warm"
    },
    beauty_fashion: {
        // Unrestricted — brand-led, palette is the brand identity
        forbiddenRanges: [],
        saturationBase: 0.45,
        saturationVariance: 0.30,
        lightnessBase: 0.50,
        lightnessVariance: 0.20,
        temperature: "warm"
    },
    insurance: {
        // Forbidden: casual yellow-green [60-100] and alarming red [0-20] — undermine reliability/safety
        forbiddenRanges: [[0, 20], [60, 100]],
        saturationBase: 0.40,
        saturationVariance: 0.12,
        lightnessBase: 0.35,
        lightnessVariance: 0.10,
        temperature: "cool"
    },
    agency: {
        // Unrestricted — expressive, design language defines palette
        forbiddenRanges: [],
        saturationBase: 0.60,
        saturationVariance: 0.30,
        lightnessBase: 0.40,
        lightnessVariance: 0.20,
        temperature: "neutral"
    },
    energy: {
        // Unrestricted — renewable=greens, fossil=ambers, nuclear=blue, all valid
        forbiddenRanges: [],
        saturationBase: 0.50,
        saturationVariance: 0.20,
        lightnessBase: 0.38,
        lightnessVariance: 0.12,
        temperature: "neutral"
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
    },
    nonprofit: {
        product_ui: 0.05,
        product_video: 0.20,
        brand_logo: 0.05,
        stats_counter: 0.25,
        search_discovery: 0.05,
        content_carousel: 0.10,
        trust_authority: 0.15,
        service_showcase: 0.10,
        editorial_feature: 0.20,
        configurator_3d: 0.00,
        aspirational_imagery: 0.25,
        testimonial_focus: 0.20
    },
    government: {
        product_ui: 0.10,
        product_video: 0.05,
        brand_logo: 0.05,
        stats_counter: 0.15,
        search_discovery: 0.25,
        content_carousel: 0.05,
        trust_authority: 0.30,
        service_showcase: 0.30,
        editorial_feature: 0.15,
        configurator_3d: 0.00,
        aspirational_imagery: 0.00,
        testimonial_focus: 0.05
    },
    media: {
        product_ui: 0.10,
        product_video: 0.20,
        brand_logo: 0.10,
        stats_counter: 0.05,
        search_discovery: 0.15,
        content_carousel: 0.25,
        trust_authority: 0.05,
        service_showcase: 0.05,
        editorial_feature: 0.40,
        configurator_3d: 0.00,
        aspirational_imagery: 0.10,
        testimonial_focus: 0.05
    },
    crypto_web3: {
        product_ui: 0.30,
        product_video: 0.10,
        brand_logo: 0.15,
        stats_counter: 0.30,
        search_discovery: 0.05,
        content_carousel: 0.10,
        trust_authority: 0.10,
        service_showcase: 0.10,
        editorial_feature: 0.05,
        configurator_3d: 0.05,
        aspirational_imagery: 0.05,
        testimonial_focus: 0.05
    },
    gaming: {
        product_ui: 0.15,
        product_video: 0.40,
        brand_logo: 0.10,
        stats_counter: 0.10,
        search_discovery: 0.05,
        content_carousel: 0.25,
        trust_authority: 0.00,
        service_showcase: 0.05,
        editorial_feature: 0.10,
        configurator_3d: 0.10,
        aspirational_imagery: 0.30,
        testimonial_focus: 0.05
    },
    hospitality: {
        product_ui: 0.05,
        product_video: 0.20,
        brand_logo: 0.10,
        stats_counter: 0.05,
        search_discovery: 0.20,
        content_carousel: 0.25,
        trust_authority: 0.10,
        service_showcase: 0.25,
        editorial_feature: 0.10,
        configurator_3d: 0.00,
        aspirational_imagery: 0.40,
        testimonial_focus: 0.20
    },
    beauty_fashion: {
        product_ui: 0.05,
        product_video: 0.25,
        brand_logo: 0.10,
        stats_counter: 0.05,
        search_discovery: 0.10,
        content_carousel: 0.25,
        trust_authority: 0.05,
        service_showcase: 0.10,
        editorial_feature: 0.25,
        configurator_3d: 0.05,
        aspirational_imagery: 0.45,
        testimonial_focus: 0.15
    },
    insurance: {
        product_ui: 0.10,
        product_video: 0.05,
        brand_logo: 0.05,
        stats_counter: 0.20,
        search_discovery: 0.15,
        content_carousel: 0.05,
        trust_authority: 0.35,
        service_showcase: 0.20,
        editorial_feature: 0.10,
        configurator_3d: 0.00,
        aspirational_imagery: 0.05,
        testimonial_focus: 0.15
    },
    agency: {
        product_ui: 0.15,
        product_video: 0.15,
        brand_logo: 0.10,
        stats_counter: 0.10,
        search_discovery: 0.05,
        content_carousel: 0.20,
        trust_authority: 0.10,
        service_showcase: 0.15,
        editorial_feature: 0.20,
        configurator_3d: 0.05,
        aspirational_imagery: 0.10,
        testimonial_focus: 0.10
    },
    energy: {
        product_ui: 0.05,
        product_video: 0.15,
        brand_logo: 0.10,
        stats_counter: 0.30,
        search_discovery: 0.10,
        content_carousel: 0.10,
        trust_authority: 0.15,
        service_showcase: 0.25,
        editorial_feature: 0.15,
        configurator_3d: 0.00,
        aspirational_imagery: 0.10,
        testimonial_focus: 0.05
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
    },
    nonprofit: {
        credentials: 0.15,
        testimonials: 0.20,
        stats: 0.30,
        security_badges: 0.05,
        social_proof_logos: 0.10,
        case_studies: 0.10,
        guarantees: 0.05,
        transparency_reports: 0.05
    },
    government: {
        credentials: 0.30,
        testimonials: 0.05,
        stats: 0.25,
        security_badges: 0.15,
        social_proof_logos: 0.05,
        case_studies: 0.05,
        guarantees: 0.05,
        transparency_reports: 0.10
    },
    media: {
        credentials: 0.10,
        testimonials: 0.10,
        stats: 0.25,
        security_badges: 0.05,
        social_proof_logos: 0.25,
        case_studies: 0.10,
        guarantees: 0.10,
        transparency_reports: 0.05
    },
    crypto_web3: {
        credentials: 0.10,
        testimonials: 0.05,
        stats: 0.25,
        security_badges: 0.30,
        social_proof_logos: 0.10,
        case_studies: 0.05,
        guarantees: 0.05,
        transparency_reports: 0.10
    },
    gaming: {
        credentials: 0.05,
        testimonials: 0.20,
        stats: 0.35,
        security_badges: 0.05,
        social_proof_logos: 0.15,
        case_studies: 0.05,
        guarantees: 0.10,
        transparency_reports: 0.05
    },
    hospitality: {
        credentials: 0.10,
        testimonials: 0.30,
        stats: 0.15,
        security_badges: 0.10,
        social_proof_logos: 0.15,
        case_studies: 0.05,
        guarantees: 0.10,
        transparency_reports: 0.05
    },
    beauty_fashion: {
        credentials: 0.05,
        testimonials: 0.25,
        stats: 0.15,
        security_badges: 0.10,
        social_proof_logos: 0.20,
        case_studies: 0.05,
        guarantees: 0.10,
        transparency_reports: 0.10
    },
    insurance: {
        credentials: 0.25,
        testimonials: 0.15,
        stats: 0.20,
        security_badges: 0.20,
        social_proof_logos: 0.05,
        case_studies: 0.05,
        guarantees: 0.05,
        transparency_reports: 0.05
    },
    agency: {
        credentials: 0.10,
        testimonials: 0.15,
        stats: 0.15,
        security_badges: 0.05,
        social_proof_logos: 0.20,
        case_studies: 0.30,
        guarantees: 0.03,
        transparency_reports: 0.02
    },
    energy: {
        credentials: 0.20,
        testimonials: 0.10,
        stats: 0.30,
        security_badges: 0.15,
        social_proof_logos: 0.10,
        case_studies: 0.10,
        guarantees: 0.03,
        transparency_reports: 0.02
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
    },
    nonprofit: {
        advocacy: ["advocacy", "campaign", "petition", "awareness", "activism"],
        charity: ["charity", "donation", "fundraising", "giving", "volunteer"],
        foundation: ["foundation", "grant", "endowment", "scholarship"],
        community: ["community", "neighborhood", "local", "mutual aid"],
        environmental: ["environment", "climate", "sustainability", "conservation", "green"]
    },
    government: {
        federal: ["federal", "national", "congress", "senate", "department"],
        state: ["state", "governor", "legislature", "county"],
        municipal: ["city", "town", "municipal", "mayor", "local government"],
        regulatory: ["regulation", "compliance", "agency", "authority", "oversight"],
        defense: ["defense", "military", "security", "intelligence", "national security"]
    },
    media: {
        news: ["news", "breaking", "journalism", "reporter", "press", "headline"],
        magazine: ["magazine", "feature", "editorial", "publication", "issue"],
        podcast: ["podcast", "episode", "audio", "listen", "show"],
        newsletter: ["newsletter", "subscribe", "weekly", "digest", "inbox"],
        publishing: ["publishing", "book", "author", "manuscript", "imprint"],
        broadcast: ["broadcast", "TV", "radio", "network", "channel", "streaming"]
    },
    crypto_web3: {
        defi: ["DeFi", "yield", "liquidity", "protocol", "AMM", "lending", "staking"],
        nft: ["NFT", "mint", "collection", "token", "marketplace", "opensea"],
        dao: ["DAO", "governance", "vote", "proposal", "treasury", "community"],
        infrastructure: ["Layer 2", "rollup", "node", "validator", "RPC", "indexer"],
        exchange: ["exchange", "DEX", "CEX", "swap", "trading", "orderbook"],
        wallet: ["wallet", "custody", "key", "seed phrase", "hardware wallet"]
    },
    gaming: {
        mobile: ["mobile game", "iOS", "Android", "casual", "hypercasual", "gacha"],
        console: ["console", "PlayStation", "Xbox", "Nintendo", "controller"],
        pc: ["PC gaming", "Steam", "Epic", "launcher", "desktop game"],
        indie: ["indie", "small studio", "itch.io", "solo dev", "jam"],
        esports: ["esports", "tournament", "competitive", "team", "league", "pro"],
        studio: ["game studio", "developer", "publisher", "AAA", "team"]
    },
    hospitality: {
        hotel: ["hotel", "room", "check-in", "amenities", "concierge", "lobby"],
        resort: ["resort", "all-inclusive", "spa", "pool", "beach resort"],
        luxury: ["luxury hotel", "five star", "boutique", "suite", "villa"],
        boutique: ["boutique", "design hotel", "lifestyle", "curated"],
        rental: ["vacation rental", "Airbnb", "VRBO", "short-term", "holiday home"]
    },
    beauty_fashion: {
        luxury_beauty: ["luxury beauty", "prestige", "high-end skincare", "premium"],
        skincare: ["skincare", "serum", "moisturizer", "SPF", "retinol", "cleanser"],
        fashion: ["fashion", "clothing", "apparel", "style", "collection", "runway"],
        cosmetics: ["makeup", "cosmetics", "foundation", "lipstick", "eyeshadow"],
        fragrance: ["fragrance", "perfume", "cologne", "scent", "eau de parfum"],
        wellness: ["wellness", "self-care", "beauty routine", "clean beauty", "natural"]
    },
    insurance: {
        health: ["health insurance", "medical", "coverage", "deductible", "premium", "HMO"],
        life: ["life insurance", "term", "whole life", "beneficiary", "policy"],
        auto: ["auto insurance", "car", "vehicle", "collision", "liability"],
        home: ["home insurance", "property", "homeowners", "renters", "flood"],
        business: ["business insurance", "commercial", "liability", "workers comp", "E&O"],
        specialty: ["specialty", "cyber", "marine", "aviation", "events"]
    },
    agency: {
        creative: ["creative agency", "design studio", "art direction", "campaign"],
        digital: ["digital agency", "web", "UI/UX", "product", "development"],
        branding: ["branding", "brand identity", "logo", "brand strategy", "rebrand"],
        marketing: ["marketing agency", "growth", "demand gen", "performance", "SEO"],
        pr: ["PR", "public relations", "communications", "press", "media relations"],
        consulting: ["consulting", "strategy", "advisory", "transformation", "management"]
    },
    energy: {
        renewable: ["solar", "wind", "renewable", "clean energy", "sustainable", "green energy"],
        oil_gas: ["oil", "gas", "petroleum", "upstream", "downstream", "refinery", "drilling"],
        utilities: ["utility", "electric", "grid", "power", "water", "natural gas"],
        nuclear: ["nuclear", "reactor", "fission", "fusion", "uranium", "power plant"],
        storage: ["battery storage", "energy storage", "grid storage", "ESS", "lithium"],
        distribution: ["transmission", "distribution", "pipeline", "infrastructure", "smart grid"]
    }
};
const SECTOR_DEFAULTS = {
    healthcare: {
        typography: "humanist",
        motion: "spring",
        edge: "soft",
        trustProminence: "prominent",
        contentDepth: "extensive",
        generate3D: false,
    },
    fintech: {
        typography: "geometric",
        motion: "step",
        edge: "sharp",
        trustProminence: "prominent",
        contentDepth: "extensive",
        generate3D: false,
    },
    automotive: {
        typography: "transitional",
        motion: "spring",
        edge: "soft",
        trustProminence: "integrated",
        contentDepth: "moderate",
        generate3D: true,
    },
    education: {
        typography: "humanist",
        motion: "spring",
        edge: "soft",
        trustProminence: "integrated",
        contentDepth: "comprehensive",
        generate3D: false,
    },
    commerce: {
        typography: "geometric",
        motion: "spring",
        edge: "soft",
        trustProminence: "integrated",
        contentDepth: "extensive",
        generate3D: false,
    },
    entertainment: {
        typography: "transitional",
        motion: "spring",
        edge: "organic",
        trustProminence: "subtle",
        contentDepth: "moderate",
        generate3D: false,
    },
    manufacturing: {
        typography: "geometric",
        motion: "none",
        edge: "sharp",
        trustProminence: "prominent",
        contentDepth: "extensive",
        generate3D: false,
    },
    legal: {
        typography: "transitional",
        motion: "none",
        edge: "sharp",
        trustProminence: "hero_feature",
        contentDepth: "moderate",
        generate3D: false,
    },
    real_estate: {
        typography: "humanist",
        motion: "spring",
        edge: "soft",
        trustProminence: "integrated",
        contentDepth: "extensive",
        generate3D: false,
    },
    travel: {
        typography: "humanist",
        motion: "spring",
        edge: "organic",
        trustProminence: "integrated",
        contentDepth: "moderate",
        generate3D: false,
    },
    food: {
        typography: "humanist",
        motion: "spring",
        edge: "organic",
        trustProminence: "prominent",
        contentDepth: "moderate",
        generate3D: false,
    },
    sports: {
        typography: "geometric",
        motion: "spring",
        edge: "sharp",
        trustProminence: "subtle",
        contentDepth: "moderate",
        generate3D: false,
    },
    technology: {
        typography: "geometric",
        motion: "spring",
        edge: "soft",
        trustProminence: "integrated",
        contentDepth: "moderate",
        generate3D: false,
    },
    nonprofit: {
        typography: "humanist",
        motion: "spring",
        edge: "organic",
        trustProminence: "prominent",
        contentDepth: "extensive",
        generate3D: false,
    },
    government: {
        typography: "transitional",
        motion: "none",
        edge: "sharp",
        trustProminence: "hero_feature",
        contentDepth: "comprehensive",
        generate3D: false,
    },
    media: {
        typography: "slab_serif",
        motion: "spring",
        edge: "sharp",
        trustProminence: "subtle",
        contentDepth: "comprehensive",
        generate3D: false,
    },
    crypto_web3: {
        typography: "geometric",
        motion: "glitch",
        edge: "techno",
        trustProminence: "integrated",
        contentDepth: "moderate",
        generate3D: true,
    },
    gaming: {
        typography: "expressive",
        motion: "spring",
        edge: "sharp",
        trustProminence: "subtle",
        contentDepth: "moderate",
        generate3D: true,
    },
    hospitality: {
        typography: "humanist",
        motion: "spring",
        edge: "organic",
        trustProminence: "integrated",
        contentDepth: "extensive",
        generate3D: false,
    },
    beauty_fashion: {
        typography: "expressive",
        motion: "spring",
        edge: "soft",
        trustProminence: "subtle",
        contentDepth: "moderate",
        generate3D: false,
    },
    insurance: {
        typography: "humanist",
        motion: "none",
        edge: "soft",
        trustProminence: "hero_feature",
        contentDepth: "extensive",
        generate3D: false,
    },
    agency: {
        typography: "grotesque",
        motion: "spring",
        edge: "organic",
        trustProminence: "integrated",
        contentDepth: "moderate",
        generate3D: true,
    },
    energy: {
        typography: "geometric",
        motion: "step",
        edge: "sharp",
        trustProminence: "prominent",
        contentDepth: "extensive",
        generate3D: false,
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
 * Build valid hue ranges from the full 0-360 spectrum minus forbidden zones.
 * Merges and sorts forbidden ranges, then inverts them.
 */
function buildValidRanges(forbidden) {
    if (forbidden.length === 0)
        return [[0, 360]];
    // Sort forbidden ranges by start
    const sorted = [...forbidden].sort((a, b) => a[0] - b[0]);
    const valid = [];
    let cursor = 0;
    for (const [fMin, fMax] of sorted) {
        if (cursor < fMin)
            valid.push([cursor, fMin]);
        cursor = Math.max(cursor, fMax);
    }
    if (cursor < 360)
        valid.push([cursor, 360]);
    return valid.length > 0 ? valid : [[0, 360]];
}
/**
 * Generate hue from sector forbidden zones using hash-derived entropy.
 * The hash selects freely from the full 360° spectrum minus psychologically
 * wrong hues for the sector. Two products in the same sector will have
 * different hues — only truly inappropriate choices are blocked.
 * Returns actual hue value (0-360), not a color name.
 */
export function generateHueFromForbidden(sector, hashByte) {
    const bias = SECTOR_COLOR_BIAS[sector];
    const valid = buildValidRanges(bias.forbiddenRanges);
    const totalDegrees = valid.reduce((sum, [a, b]) => sum + (b - a), 0);
    const position = (hashByte / 255) * totalDegrees;
    let accumulated = 0;
    for (const [min, max] of valid) {
        const size = max - min;
        if (position <= accumulated + size) {
            return Math.round(min + (position - accumulated));
        }
        accumulated += size;
    }
    return 0;
}
/** @deprecated Use generateHueFromForbidden instead */
export function generateHueFromBias(sector, hashByte) {
    return generateHueFromForbidden(sector, hashByte);
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
