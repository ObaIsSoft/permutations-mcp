/**
 * Permutations MCP - Sector Profiles
 *
 * Sector-specific design configurations including color psychology,
 * hero type weights, trust signal approaches, and sub-sector keywords.
 */
/**
 * Color psychology profiles by sector
 * Each color has a probability weight (0.0 - 1.0)
 */
const DEFAULT_COLOR_PROFILES = {
    healthcare: {
        primary: {
            "blue": 0.40, // Trust, calm, clinical
            "teal": 0.25, // Healing, wellness
            "green": 0.20, // Health, growth
            "white": 0.10, // Clean, sterile
            "soft_purple": 0.05 // Compassion, care
        },
        secondary: {
            "warm_gray": 0.30,
            "soft_blue": 0.25,
            "light_green": 0.20,
            "cream": 0.15,
            "pale_lavender": 0.10
        },
        accent: {
            "coral": 0.20, // Human warmth
            "soft_orange": 0.15,
            "lavender": 0.15,
            "mint": 0.15,
            "warm_yellow": 0.15,
            "soft_pink": 0.20
        },
        minContrast: 4.5,
        warmthBias: 0.3 // Slightly warm (human, approachable)
    },
    fintech: {
        primary: {
            "deep_purple": 0.30, // Innovation, premium
            "navy_blue": 0.25, // Trust, stability
            "dark_teal": 0.15, // Growth, money
            "charcoal": 0.15, // Professional
            "black": 0.10, // Premium, luxury
            "emerald": 0.05 // Money, growth
        },
        secondary: {
            "white": 0.40,
            "light_gray": 0.30,
            "cream": 0.15,
            "pale_blue": 0.15
        },
        accent: {
            "bright_green": 0.25, // Money, growth
            "gold": 0.20, // Premium, wealth
            "electric_blue": 0.20, // Tech, speed
            "coral": 0.15, // Human touch
            "lime": 0.10, // Growth
            "amber": 0.10 // Wealth
        },
        minContrast: 7.0, // Higher for data readability
        warmthBias: -0.1 // Professional, cool
    },
    automotive: {
        primary: {
            "brand_specific": 0.50, // Ford blue, Ferrari red, etc.
            "black": 0.20, // Premium, luxury
            "silver": 0.15, // Modern, tech
            "white": 0.10,
            "gunmetal": 0.05 // Industrial, rugged
        },
        secondary: {
            "white": 0.30,
            "light_gray": 0.25,
            "silver": 0.20,
            "black": 0.15,
            "cream": 0.10
        },
        accent: {
            "red": 0.20, // Sport, energy
            "blue": 0.15, // Trust, reliability
            "yellow": 0.15, // Energy, attention
            "orange": 0.15, // Enthusiasm
            "green": 0.10, // Eco-friendly (EVs)
            "brand_complement": 0.25 // Based on primary
        },
        minContrast: 4.5,
        warmthBias: 0.0 // Neutral, depends on brand
    },
    education: {
        primary: {
            "deep_blue": 0.30, // Knowledge, trust
            "forest_green": 0.25, // Growth, learning
            "burgundy": 0.15, // Academic tradition
            "navy": 0.15, // Authority
            "warm_gray": 0.10,
            "teal": 0.05 // Modern learning
        },
        secondary: {
            "white": 0.35,
            "cream": 0.25,
            "light_gray": 0.20,
            "pale_blue": 0.15,
            "soft_yellow": 0.05
        },
        accent: {
            "gold": 0.20, // Achievement
            "bright_blue": 0.20, // Innovation
            "orange": 0.15, // Energy, creativity
            "purple": 0.15, // Wisdom
            "green": 0.15, // Growth
            "red": 0.15 // Energy
        },
        minContrast: 4.5,
        warmthBias: 0.2 // Approachable learning environment
    },
    commerce: {
        primary: {
            "black": 0.25, // Premium, luxury fashion
            "white": 0.20, // Clean, modern
            "navy": 0.15, // Trust, professional
            "brand_color": 0.30, // Store brand
            "warm_gray": 0.10
        },
        secondary: {
            "white": 0.30,
            "light_gray": 0.25,
            "cream": 0.20,
            "soft_pastel": 0.25 // Product-dependent
        },
        accent: {
            "red": 0.20, // Sale, urgency
            "orange": 0.15, // Energy, CTA
            "green": 0.15, // Go, positive
            "blue": 0.15, // Trust
            "gold": 0.15, // Premium
            "brand_accent": 0.20
        },
        minContrast: 4.5,
        warmthBias: 0.1
    },
    entertainment: {
        primary: {
            "black": 0.30, // Drama, cinema
            "deep_purple": 0.20, // Creative, bold
            "navy": 0.15, // Premium streaming
            "dark_red": 0.15, // Excitement
            "charcoal": 0.20
        },
        secondary: {
            "dark_gray": 0.30,
            "black": 0.25,
            "deep_blue": 0.20,
            "dark_gradient": 0.25
        },
        accent: {
            "neon_pink": 0.15,
            "electric_blue": 0.15,
            "lime_green": 0.15,
            "bright_orange": 0.15,
            "cyan": 0.15,
            "red": 0.25 // Netflix-style
        },
        minContrast: 4.5,
        warmthBias: 0.0 // Varies by content type
    },
    manufacturing: {
        primary: {
            "navy_blue": 0.25, // Trust, reliability
            "steel_blue": 0.20, // Industrial
            "black": 0.20, // Professional
            "gray": 0.20, // Industrial
            "orange": 0.10, // Safety, energy
            "green": 0.05 // Sustainability
        },
        secondary: {
            "white": 0.35,
            "light_gray": 0.30,
            "silver": 0.20,
            "off_white": 0.15
        },
        accent: {
            "safety_orange": 0.25,
            "yellow": 0.15, // Caution, energy
            "green": 0.15, // Growth, eco
            "red": 0.15, // Warning, energy
            "blue": 0.20,
            "silver": 0.10
        },
        minContrast: 5.0,
        warmthBias: -0.2 // Cool, industrial
    },
    legal: {
        primary: {
            "navy": 0.35, // Authority, trust
            "burgundy": 0.20, // Tradition, prestige
            "dark_gray": 0.20, // Professional
            "black": 0.15, // Authority
            "deep_green": 0.10 // Growth, money
        },
        secondary: {
            "white": 0.40,
            "cream": 0.25,
            "light_gray": 0.20,
            "pale_gold": 0.15
        },
        accent: {
            "gold": 0.30, // Premium, prestige
            "burgundy": 0.20,
            "navy": 0.20,
            "forest_green": 0.15,
            "deep_purple": 0.15
        },
        minContrast: 7.0, // High for readability
        warmthBias: -0.1 // Formal, authoritative
    },
    real_estate: {
        primary: {
            "navy": 0.25, // Trust, stability
            "forest_green": 0.20, // Growth, home
            "warm_gray": 0.20, // Neutral, versatile
            "white": 0.20, // Clean, spacious
            "terracotta": 0.10, // Warm, homey
            "blue": 0.05
        },
        secondary: {
            "white": 0.35,
            "cream": 0.25,
            "light_gray": 0.20,
            "beige": 0.20
        },
        accent: {
            "terracotta": 0.20,
            "sage_green": 0.20,
            "warm_yellow": 0.15,
            "blue": 0.15,
            "coral": 0.15,
            "gold": 0.15
        },
        minContrast: 4.5,
        warmthBias: 0.3 // Warm, welcoming homes
    },
    travel: {
        primary: {
            "deep_teal": 0.25, // Ocean, escape
            "navy": 0.20, // Trust, premium
            "warm_sand": 0.20, // Beaches, adventure
            "white": 0.20, // Clean, spacious
            "sunset_orange": 0.15 // Adventure, excitement
        },
        secondary: {
            "white": 0.30,
            "cream": 0.25,
            "light_blue": 0.20,
            "pale_sand": 0.25
        },
        accent: {
            "turquoise": 0.20, // Tropical water
            "coral": 0.15,
            "sunset_orange": 0.20,
            "golden_yellow": 0.15,
            "lime": 0.15,
            "purple": 0.15 // Luxury
        },
        minContrast: 4.5,
        warmthBias: 0.4 // Warm, aspirational escapes
    },
    food: {
        primary: {
            "warm_white": 0.25, // Clean, appetizing
            "cream": 0.20, // Warm, inviting
            "warm_gray": 0.20, // Neutral
            "terracotta": 0.15, // Earthy, restaurant
            "sage_green": 0.15, // Fresh, natural
            "black": 0.05 // Premium dining
        },
        secondary: {
            "white": 0.30,
            "cream": 0.25,
            "light_wood": 0.25,
            "soft_gray": 0.20
        },
        accent: {
            "tomato_red": 0.20, // Appetite
            "fresh_green": 0.20, // Healthy, fresh
            "golden_yellow": 0.15, // Warm, inviting
            "orange": 0.15, // Energy, appetite
            "brown": 0.15, // Coffee, chocolate
            "olive_green": 0.15
        },
        minContrast: 4.5,
        warmthBias: 0.5 // Very warm, appetizing
    },
    sports: {
        primary: {
            "black": 0.25, // Power, intensity
            "navy": 0.20, // Team colors often
            "red": 0.15, // Energy, competition
            "white": 0.20, // Clean, crisp
            "dark_gray": 0.15,
            "team_color": 0.05 // Specific team
        },
        secondary: {
            "white": 0.30,
            "light_gray": 0.25,
            "black": 0.25,
            "team_secondary": 0.20
        },
        accent: {
            "red": 0.20, // Energy
            "orange": 0.20, // Energy, enthusiasm
            "yellow": 0.15, // Optimism
            "electric_blue": 0.15,
            "neon_green": 0.15,
            "team_accent": 0.15
        },
        minContrast: 4.5,
        warmthBias: 0.2 // Energetic, warm
    },
    technology: {
        primary: {
            "black": 0.30, // Modern, sleek
            "navy": 0.20, // Trust, enterprise
            "white": 0.20, // Clean, minimal
            "charcoal": 0.20, // Professional
            "electric_blue": 0.10 // Innovation
        },
        secondary: {
            "white": 0.35,
            "light_gray": 0.30,
            "off_white": 0.20,
            "pale_blue": 0.15
        },
        accent: {
            "electric_blue": 0.25,
            "neon_green": 0.15,
            "purple": 0.15, // AI, creative
            "orange": 0.15, // Energy
            "cyan": 0.15,
            "red": 0.15 // Error, alerts
        },
        minContrast: 4.5,
        warmthBias: -0.1 // Cool, tech-forward
    }
};
/**
 * Hero type weights by sector
 */
const HERO_TYPE_WEIGHTS = {
    healthcare: {
        product_ui: 0.05,
        product_video: 0.10,
        brand_logo: 0.05,
        stats_counter: 0.10,
        search_discovery: 0.10,
        content_carousel: 0.10,
        trust_authority: 0.30, // Highest: credentials matter
        service_showcase: 0.25, // Services, facilities
        editorial_feature: 0.15,
        configurator_3d: 0.00,
        aspirational_imagery: 0.10,
        testimonial_focus: 0.20
    },
    fintech: {
        product_ui: 0.20,
        product_video: 0.10,
        brand_logo: 0.05,
        stats_counter: 0.30, // Live transaction volume
        search_discovery: 0.05,
        content_carousel: 0.10,
        trust_authority: 0.25, // Security, compliance
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
        configurator_3d: 0.25, // Build your own
        aspirational_imagery: 0.35, // Lifestyle
        testimonial_focus: 0.05
    },
    education: {
        product_ui: 0.15,
        product_video: 0.15,
        brand_logo: 0.05,
        stats_counter: 0.15,
        search_discovery: 0.20, // Course finder
        content_carousel: 0.15,
        trust_authority: 0.15,
        service_showcase: 0.10,
        editorial_feature: 0.25, // Knowledge content
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
        content_carousel: 0.25, // Product showcase
        trust_authority: 0.10,
        service_showcase: 0.10,
        editorial_feature: 0.10,
        configurator_3d: 0.05,
        aspirational_imagery: 0.20,
        testimonial_focus: 0.10
    },
    entertainment: {
        product_ui: 0.10,
        product_video: 0.35, // Trailers, previews
        brand_logo: 0.10,
        stats_counter: 0.05,
        search_discovery: 0.25, // Content discovery
        content_carousel: 0.30, // Browse content
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
        trust_authority: 0.20, // Certifications
        service_showcase: 0.25, // Capabilities
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
        trust_authority: 0.40, // Credentials critical
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
        search_discovery: 0.40, // Property search
        content_carousel: 0.15,
        trust_authority: 0.10,
        service_showcase: 0.15,
        editorial_feature: 0.10,
        configurator_3d: 0.00,
        aspirational_imagery: 0.30, // Dream homes
        testimonial_focus: 0.10
    },
    travel: {
        product_ui: 0.05,
        product_video: 0.20,
        brand_logo: 0.10,
        stats_counter: 0.05,
        search_discovery: 0.35, // Destination search
        content_carousel: 0.20,
        trust_authority: 0.05,
        service_showcase: 0.10,
        editorial_feature: 0.15,
        configurator_3d: 0.00,
        aspirational_imagery: 0.40, // Dream destinations
        testimonial_focus: 0.10
    },
    food: {
        product_ui: 0.10,
        product_video: 0.20,
        brand_logo: 0.10,
        stats_counter: 0.05,
        search_discovery: 0.20,
        content_carousel: 0.25, // Menu items
        trust_authority: 0.10,
        service_showcase: 0.20,
        editorial_feature: 0.10,
        configurator_3d: 0.00,
        aspirational_imagery: 0.35, // Appetizing food
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
/**
 * Trust approach weights by sector
 */
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
        security_badges: 0.30, // Critical for money
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
        stats: 0.30, // User counts, ratings
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
        credentials: 0.40, // Critical
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
        security_badges: 0.20, // Health ratings
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
/**
 * Sub-sector keywords for content analysis
 */
const SUB_SECTOR_KEYWORDS = {
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
/**
 * Sector defaults for non-color properties
 */
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
        generate3D: true // Configurators
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
/**
 * Complete sector profiles
 */
export const SECTOR_PROFILES = Object.keys(DEFAULT_COLOR_PROFILES).reduce((acc, sector) => {
    const s = sector;
    acc[s] = {
        sector: s,
        colorProfile: DEFAULT_COLOR_PROFILES[s],
        heroTypeWeights: HERO_TYPE_WEIGHTS[s],
        trustApproachWeights: TRUST_APPROACH_WEIGHTS[s],
        defaultTypography: SECTOR_DEFAULTS[s].typography,
        motionPreference: SECTOR_DEFAULTS[s].motion,
        edgePreference: SECTOR_DEFAULTS[s].edge,
        recommendedTrustProminence: SECTOR_DEFAULTS[s].trustProminence,
        contentDepth: SECTOR_DEFAULTS[s].contentDepth,
        generate3D: SECTOR_DEFAULTS[s].generate3D,
        subSectorKeywords: SUB_SECTOR_KEYWORDS[s] || {}
    };
    return acc;
}, {});
/**
 * Get sector profile by name
 */
export function getSectorProfile(sector) {
    return SECTOR_PROFILES[sector];
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
 * Select color from probability distribution
 */
export function selectColorFromProfile(colors, hashByte) {
    const total = Object.values(colors).reduce((a, b) => a + b, 0);
    let cumulative = 0;
    const threshold = (hashByte / 255) * total;
    for (const [color, probability] of Object.entries(colors)) {
        cumulative += probability;
        if (cumulative >= threshold) {
            return color;
        }
    }
    return Object.keys(colors)[0];
}
/**
 * Convert color name to HSL values
 */
export function colorNameToHSL(colorName) {
    const colorMap = {
        // Blues
        "blue": { h: 210, s: 70, l: 50 },
        "deep_blue": { h: 220, s: 80, l: 35 },
        "navy": { h: 220, s: 60, l: 25 },
        "navy_blue": { h: 220, s: 70, l: 30 },
        "steel_blue": { h: 207, s: 44, l: 49 },
        "soft_blue": { h: 210, s: 50, l: 70 },
        "light_blue": { h: 200, s: 60, l: 80 },
        "pale_blue": { h: 210, s: 40, l: 90 },
        "electric_blue": { h: 200, s: 90, l: 50 },
        "cyan": { h: 180, s: 80, l: 50 },
        // Teals
        "teal": { h: 170, s: 60, l: 45 },
        "deep_teal": { h: 175, s: 70, l: 30 },
        "turquoise": { h: 175, s: 80, l: 45 },
        "dark_teal": { h: 175, s: 60, l: 25 },
        // Greens
        "green": { h: 140, s: 60, l: 45 },
        "forest_green": { h: 120, s: 60, l: 35 },
        "dark_green": { h: 140, s: 60, l: 25 },
        "deep_green": { h: 145, s: 70, l: 20 },
        "emerald": { h: 150, s: 70, l: 45 },
        "light_green": { h: 120, s: 50, l: 75 },
        "sage_green": { h: 100, s: 30, l: 60 },
        "olive_green": { h: 80, s: 40, l: 40 },
        "mint": { h: 150, s: 60, l: 80 },
        "lime_green": { h: 120, s: 70, l: 50 },
        "neon_green": { h: 110, s: 90, l: 55 },
        "bright_green": { h: 130, s: 80, l: 50 },
        "fresh_green": { h: 140, s: 70, l: 55 },
        // Purples
        "deep_purple": { h: 260, s: 70, l: 35 },
        "purple": { h: 270, s: 60, l: 50 },
        "lavender": { h: 260, s: 50, l: 75 },
        "pale_lavender": { h: 260, s: 40, l: 90 },
        "soft_purple": { h: 260, s: 50, l: 70 },
        // Reds/Pinks
        "red": { h: 0, s: 80, l: 50 },
        "dark_red": { h: 0, s: 70, l: 35 },
        "coral": { h: 15, s: 80, l: 65 },
        "soft_pink": { h: 340, s: 60, l: 80 },
        "neon_pink": { h: 330, s: 90, l: 60 },
        "tomato_red": { h: 10, s: 85, l: 55 },
        // Oranges
        "orange": { h: 25, s: 90, l: 55 },
        "soft_orange": { h: 25, s: 70, l: 70 },
        "sunset_orange": { h: 20, s: 90, l: 60 },
        "safety_orange": { h: 25, s: 100, l: 50 },
        "terracotta": { h: 15, s: 50, l: 50 },
        "bright_orange": { h: 25, s: 95, l: 55 },
        // Yellows
        "yellow": { h: 50, s: 90, l: 55 },
        "golden_yellow": { h: 45, s: 90, l: 55 },
        "warm_yellow": { h: 48, s: 85, l: 60 },
        "soft_yellow": { h: 50, s: 70, l: 80 },
        "gold": { h: 45, s: 80, l: 50 },
        "pale_gold": { h: 45, s: 60, l: 80 },
        "amber": { h: 40, s: 90, l: 55 },
        // Neutrals
        "black": { h: 0, s: 0, l: 10 },
        "charcoal": { h: 0, s: 0, l: 20 },
        "dark_gray": { h: 0, s: 0, l: 30 },
        "gray": { h: 0, s: 0, l: 50 },
        "light_gray": { h: 0, s: 0, l: 75 },
        "warm_gray": { h: 30, s: 10, l: 70 },
        "silver": { h: 0, s: 0, l: 75 },
        "white": { h: 0, s: 0, l: 98 },
        "cream": { h: 40, s: 30, l: 95 },
        "off_white": { h: 40, s: 10, l: 97 },
        "warm_white": { h: 40, s: 15, l: 97 },
        "beige": { h: 40, s: 25, l: 85 },
        "pale_sand": { h: 35, s: 30, l: 90 },
        "warm_sand": { h: 35, s: 40, l: 80 },
        "light_wood": { h: 30, s: 40, l: 80 },
        // Special
        "burgundy": { h: 345, s: 60, l: 30 },
        "gunmetal": { h: 210, s: 15, l: 30 },
        // Brand specific (will be overridden)
        "brand_specific": { h: 210, s: 70, l: 50 },
        "brand_color": { h: 210, s: 70, l: 50 },
        "brand_complement": { h: 30, s: 70, l: 50 },
        "brand_secondary": { h: 180, s: 70, l: 50 },
        "brand_accent": { h: 30, s: 80, l: 55 },
        "team_color": { h: 210, s: 70, l: 50 },
        "team_secondary": { h: 30, s: 70, l: 50 },
        "team_accent": { h: 30, s: 80, l: 55 }
    };
    return colorMap[colorName] || { h: 210, s: 70, l: 50 }; // Default blue
}
/**
 * List all available sectors
 */
export function listSectors() {
    return Object.keys(SECTOR_PROFILES);
}
/**
 * Validate if a string is a valid sector
 */
export function isValidSector(sector) {
    return sector in SECTOR_PROFILES;
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
