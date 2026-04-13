/**
 * Context Detector
 *
 * Analyzes design intent + genome to determine what the page IS —
 * its content type, purpose, audience, and structural requirements.
 *
 * This drives which structural patterns from the catalog are eligible
 * vs forbidden. A shoe store needs different patterns than a fintech dashboard.
 *
 * Philosophy: context is detected from intent keywords + sector + genome traits.
 * NOT hardcoded — the detector uses keyword matching and sector mapping.
 */
const CONTEXT_RULES = {
    ecommerce: {
        requiredSections: ["navigation", "hero", "product", "cta", "footer"],
        optionalSections: ["feature", "testimonial", "faq", "pricing", "blog", "newsletter", "trust", "social", "stats", "logo_wall"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "onboarding", "wizard"],
        purposes: ["conversion", "exploration", "transaction"],
        audiences: ["shopper", "consumer"],
        keywords: ["shoe store", "shoe shop", "shoe ecommerce", "online store", "product store", "shop", "buy", "product", "cart", "checkout", "order", "shopify", "woocommerce", "sell", "marketplace", "catalog", "clothing store", "fashion store", "retail"],
    },
    dashboard: {
        requiredSections: ["navigation", "data", "metrics", "chart"],
        optionalSections: ["table", "activity_feed", "cta", "notification", "filter", "search", "status_bar", "toolbar"],
        forbiddenSections: ["hero", "testimonial", "cta_focused", "newsletter", "pricing"],
        purposes: ["monitoring", "management", "exploration"],
        audiences: ["analyst", "admin", "manager", "enterprise"],
        keywords: ["analytics dashboard", "fintech dashboard", "finance dashboard", "trading dashboard", "banking dashboard", "dashboard", "metrics", "kpi", "monitor", "admin panel", "control panel", "report", "data", "chart", "graph", "stats", "overview"],
    },
    landing: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["testimonial", "faq", "pricing", "team", "stats", "logo_wall", "blog", "newsletter", "trust", "social", "process", "timeline"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "onboarding", "wizard"],
        purposes: ["conversion", "exploration"],
        audiences: ["consumer", "shopper", "general", "professional"],
        keywords: ["landing page", "landing", "homepage", "home", "intro", "welcome", "signup", "get started", "learn more", "hero", "marketing", "campaign", "launch"],
    },
    blog: {
        requiredSections: ["navigation", "content", "footer"],
        optionalSections: ["cta", "newsletter", "social", "testimonial", "about", "author_box", "search", "pagination", "breadcrumb"],
        forbiddenSections: ["product", "metrics", "chart", "pricing", "hero"],
        purposes: ["exploration", "education", "reference"],
        audiences: ["reader", "student", "general", "professional"],
        keywords: ["tech blog", "blog", "article", "post", "news", "journal", "writing", "content", "read", "story", "magazine", "publication", "editorial"],
    },
    portfolio: {
        requiredSections: ["hero", "gallery", "content", "footer"],
        optionalSections: ["testimonial", "cta", "about", "team", "contact", "timeline", "process", "stats", "blog"],
        forbiddenSections: ["product", "metrics", "chart", "pricing", "table", "activity_feed"],
        purposes: ["exploration", "conversion"],
        audiences: ["creator", "professional", "general"],
        keywords: ["portfolio", "work", "projects", "showcase", "gallery", "design", "creative", "photography", "art", "case study", "freelance"],
    },
    documentation: {
        requiredSections: ["navigation", "content", "footer"],
        optionalSections: ["search", "breadcrumb", "toc", "faq", "alert", "banner"],
        forbiddenSections: ["hero", "product", "cta", "testimonial", "pricing", "metrics", "chart"],
        purposes: ["reference", "education"],
        audiences: ["developer", "student", "professional", "general"],
        keywords: ["docs", "documentation", "api", "guide", "tutorial", "reference", "manual", "help", "wiki", "knowledge base", "how to"],
    },
    application: {
        requiredSections: ["navigation", "content"],
        optionalSections: ["sidebar", "toolbar", "status_bar", "notification", "modal", "dialog", "form", "search", "filter", "table", "chart"],
        forbiddenSections: ["hero", "testimonial", "cta", "pricing", "newsletter", "blog"],
        purposes: ["management", "creation", "communication"],
        audiences: ["admin", "manager", "professional", "enterprise"],
        keywords: ["app", "application", "tool", "platform", "software", "workspace", "editor", "builder", "manager", "system"],
    },
    saas: {
        requiredSections: ["hero", "feature", "cta", "pricing", "footer"],
        optionalSections: ["testimonial", "faq", "stats", "logo_wall", "team", "blog", "newsletter", "comparison", "trust", "social", "process", "timeline"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "onboarding", "wizard"],
        purposes: ["conversion", "exploration"],
        audiences: ["professional", "enterprise", "consumer"],
        keywords: ["saas platform", "saas product", "saas solution", "saas tool", "software as a service", "cloud platform", "cloud service", "subscription software"],
    },
    agency: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["testimonial", "portfolio", "team", "process", "stats", "logo_wall", "blog", "contact", "case_study", "service"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "onboarding"],
        purposes: ["conversion", "exploration"],
        audiences: ["professional", "enterprise", "consumer"],
        keywords: ["agency", "studio", "consulting", "services", "firm", "company", "team", "expertise", "portfolio"],
    },
    creative: {
        requiredSections: ["hero", "gallery", "content", "footer"],
        optionalSections: ["about", "contact", "testimonial", "process", "team", "blog", "cta"],
        forbiddenSections: ["metrics", "chart", "table", "pricing", "activity_feed", "onboarding"],
        purposes: ["exploration", "conversion"],
        audiences: ["creator", "general", "professional"],
        keywords: ["creative", "art", "design", "illustration", "animation", "visual", "brand", "identity", "experience", "immersive"],
    },
    nonprofit: {
        requiredSections: ["hero", "cta", "content", "footer"],
        optionalSections: ["testimonial", "stats", "team", "donation", "newsletter", "blog", "trust", "social", "impact", "mission", "values"],
        forbiddenSections: ["metrics", "chart", "table", "pricing", "product"],
        purposes: ["conversion", "exploration"],
        audiences: ["consumer", "general", "professional"],
        keywords: ["nonprofit", "charity", "cause", "donate", "fundraise", "impact", "mission", "community", "social good", "volunteer"],
    },
    healthcare: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["testimonial", "team", "faq", "contact", "trust", "stats", "blog", "service", "booking"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "pricing"],
        purposes: ["conversion", "exploration", "reference"],
        audiences: ["consumer", "professional"],
        keywords: ["healthcare", "medical", "health", "clinic", "hospital", "doctor", "patient", "wellness", "therapy", "treatment"],
    },
    fintech: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["stats", "testimonial", "pricing", "trust", "comparison", "faq", "team", "blog", "security", "compliance"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "gallery"],
        purposes: ["conversion", "exploration", "transaction"],
        audiences: ["professional", "enterprise", "consumer"],
        keywords: ["fintech platform", "fintech product", "fintech solution", "fintech tool", "finance platform", "trading platform", "banking platform", "payment platform"],
    },
    education: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["testimonial", "course", "team", "faq", "blog", "stats", "pricing", "process", "timeline"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "product"],
        purposes: ["conversion", "education", "exploration"],
        audiences: ["student", "professional", "general"],
        keywords: ["education", "learn", "course", "training", "school", "university", "class", "study", "teach", "academy", "e-learning"],
    },
    real_estate: {
        requiredSections: ["hero", "product", "cta", "footer"],
        optionalSections: ["search", "filter", "map", "testimonial", "stats", "team", "faq", "blog", "trust"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "onboarding"],
        purposes: ["conversion", "exploration", "transaction"],
        audiences: ["consumer", "professional"],
        keywords: ["real estate", "property", "house", "home", "rent", "buy", "sell", "agent", "broker", "listing", "mortgage"],
    },
    travel: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["gallery", "testimonial", "search", "filter", "map", "booking", "faq", "blog", "stats"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "pricing"],
        purposes: ["conversion", "exploration", "transaction"],
        audiences: ["consumer", "general"],
        keywords: ["travel", "trip", "vacation", "hotel", "flight", "tour", "destination", "booking", "adventure", "explore"],
    },
    food: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["gallery", "menu", "testimonial", "booking", "map", "faq", "blog", "team", "social"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "pricing"],
        purposes: ["conversion", "exploration", "transaction"],
        audiences: ["consumer", "general"],
        keywords: ["food", "restaurant", "menu", "recipe", "cook", "dining", "catering", "delivery", "cafe", "bakery"],
    },
    sports: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["stats", "gallery", "testimonial", "team", "schedule", "blog", "social", "shop"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "pricing"],
        purposes: ["conversion", "exploration", "entertainment"],
        audiences: ["consumer", "general", "professional"],
        keywords: ["sports", "fitness", "gym", "team", "league", "tournament", "game", "athlete", "training", "workout"],
    },
    gaming: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["gallery", "stats", "testimonial", "blog", "social", "community", "shop", "leaderboard"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "pricing"],
        purposes: ["conversion", "entertainment", "exploration"],
        audiences: ["consumer", "general"],
        keywords: ["gaming", "game", "esports", "play", "stream", "console", "pc gaming", "mobile game", "vr"],
    },
    crypto_web3: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["stats", "testimonial", "pricing", "trust", "community", "blog", "roadmap", "team", "token"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "gallery"],
        purposes: ["conversion", "exploration", "transaction"],
        audiences: ["professional", "consumer", "developer"],
        keywords: ["crypto", "web3", "blockchain", "defi", "nft", "dao", "token", "wallet", "swap", "staking"],
    },
    media: {
        requiredSections: ["hero", "content", "footer"],
        optionalSections: ["gallery", "blog", "social", "newsletter", "testimonial", "stats", "team", "contact"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "pricing"],
        purposes: ["exploration", "entertainment", "education"],
        audiences: ["consumer", "general", "reader"],
        keywords: ["media company", "media platform", "broadcasting", "streaming platform", "video platform", "music platform"],
    },
    government: {
        requiredSections: ["hero", "content", "footer"],
        optionalSections: ["faq", "contact", "search", "breadcrumb", "alert", "banner", "service", "team"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "hero", "pricing", "testimonial"],
        purposes: ["reference", "exploration", "transaction"],
        audiences: ["general", "professional"],
        keywords: ["government", "public", "city", "state", "federal", "municipal", "civic", "official", "agency"],
    },
    legal: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["team", "testimonial", "faq", "contact", "blog", "trust", "service"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "gallery", "pricing"],
        purposes: ["conversion", "reference", "exploration"],
        audiences: ["professional", "consumer"],
        keywords: ["legal", "law", "attorney", "lawyer", "firm", "counsel", "litigation", "corporate law", "ip", "immigration"],
    },
    manufacturing: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["stats", "testimonial", "team", "process", "gallery", "contact", "trust", "blog"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "pricing"],
        purposes: ["conversion", "exploration"],
        audiences: ["enterprise", "professional"],
        keywords: ["manufacturing", "factory", "production", "industrial", "engineering", "supply chain", "logistics", "assembly"],
    },
    automotive: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["gallery", "stats", "comparison", "testimonial", "booking", "faq", "blog", "trust"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "pricing"],
        purposes: ["conversion", "exploration", "transaction"],
        audiences: ["consumer", "professional"],
        keywords: ["automotive", "car", "vehicle", "auto", "dealer", "electric", "ev", "luxury car", "suv", "truck"],
    },
    hospitality: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["gallery", "booking", "testimonial", "map", "faq", "team", "blog", "social", "trust"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "pricing"],
        purposes: ["conversion", "exploration", "transaction"],
        audiences: ["consumer", "general"],
        keywords: ["hospitality", "hotel", "resort", "rental", "vacation rental", "bnb", "lodge", "inn", "boutique hotel"],
    },
    beauty_fashion: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["gallery", "testimonial", "blog", "social", "team", "shop", "newsletter", "trust"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "pricing"],
        purposes: ["conversion", "exploration", "transaction"],
        audiences: ["consumer", "general"],
        keywords: ["beauty", "fashion", "cosmetics", "skincare", "makeup", "luxury beauty", "fragrance", "wellness", "salon"],
    },
    insurance: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["testimonial", "faq", "trust", "stats", "team", "blog", "contact", "comparison"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "gallery"],
        purposes: ["conversion", "exploration", "reference"],
        audiences: ["consumer", "professional", "enterprise"],
        keywords: ["insurance", "coverage", "policy", "claim", "health insurance", "life insurance", "auto insurance", "business insurance"],
    },
    energy: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["stats", "testimonial", "team", "process", "blog", "contact", "trust", "gallery"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "pricing"],
        purposes: ["conversion", "exploration"],
        audiences: ["enterprise", "professional", "consumer"],
        keywords: ["energy", "renewable", "solar", "wind", "oil", "gas", "utilities", "nuclear", "storage", "grid"],
    },
};
// ── Detection Logic ─────────────────────────────────────────────────────────
/**
 * Detect page context from intent + genome
 *
 * Uses keyword matching against intent description + sector mapping
 * to determine what the page IS, its purpose, and audience.
 */
/**
 * Infer content-type signals from a snake_case layoutPattern name.
 *
 * Tokenizes the pattern on "_" and checks each token (and every adjacent 2-gram)
 * against the known ContentType key set. Works for all patterns — existing,
 * future, user-defined — with zero maintenance cost.
 *
 * Examples:
 *   "dashboard_analytics"   → token "dashboard"    → weight 2 (first position)
 *   "ecommerce_grid"        → token "ecommerce"    → weight 2
 *   "real_estate_listings"  → 2-gram "real_estate" → weight 2
 *   "saas_pricing"          → token "saas"         → weight 2
 *   "travel_booking"        → token "travel"       → weight 2
 *   "blog_magazine"         → token "blog"         → weight 2
 *   "crypto_web3_trading"   → 2-gram "crypto_web3" → weight 2
 *   "gallery_showcase"      → no token match       → [] (neutral; intent/sector decides)
 */
function layoutPatternTypeSignals(pattern, validTypes) {
    const results = [];
    const tokens = pattern.split("_");
    for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        if (validTypes.has(tok)) {
            results.push({ type: tok, weight: i === 0 ? 2 : 1 });
        }
        if (i < tokens.length - 1) {
            const bigram = `${tok}_${tokens[i + 1]}`;
            if (validTypes.has(bigram)) {
                results.push({ type: bigram, weight: i === 0 ? 2 : 1 });
            }
        }
    }
    return results;
}
// Soft signals derived from ch33 sub-chromosomes.
// These are finite enums defined in sequencer.ts — a mapping is exhaustive, not a partial list.
/** interactionModel (9 values) → type signals */
const INTERACTION_TYPE_SIGNALS = {
    dashboard_live: [["dashboard", 2]],
    wizard_steps: [["application", 2]],
    explorer: [["portfolio", 1], ["creative", 1], ["application", 1]],
    infinite_feed: [["blog", 1], ["media", 1]],
    pagination: [["blog", 1], ["ecommerce", 1], ["documentation", 1]],
};
/** contentFlow (8 values) → type signals */
const CONTENT_FLOW_TYPE_SIGNALS = {
    data_driven: [["dashboard", 2], ["application", 1]],
    comparison_first: [["saas", 1], ["ecommerce", 1]],
    discovery: [["portfolio", 1], ["creative", 1], ["travel", 1]],
    narrative: [["blog", 1], ["media", 1], ["creative", 1]],
    action_first: [["landing", 1], ["ecommerce", 1]],
    social_first: [["media", 1]],
};
export function detectPageContext(intent, sector, genome) {
    const intentLower = intent.toLowerCase();
    const scores = {};
    // 1. Keyword scoring
    for (const [type, rule] of Object.entries(CONTEXT_RULES)) {
        scores[type] = 0;
        for (const keyword of rule.keywords) {
            if (intentLower.includes(keyword.toLowerCase())) {
                scores[type] += 1;
            }
        }
        // Sector bonus
        if (type === sector)
            scores[type] += 3;
    }
    // 2. Genome ch33 signals — smart inference from composition chromosomes.
    //    Applied AFTER keyword scoring so intent keywords still override genome bias.
    if (genome?.chromosomes?.ch33_composition_strategy) {
        const ch33 = genome.chromosomes.ch33_composition_strategy;
        const validTypes = new Set(Object.keys(CONTEXT_RULES));
        // 2a. layoutPattern: tokenize the snake_case name; credit each token/2-gram
        //     that matches a ContentType key. Covers all current + future patterns with
        //     zero maintenance — a "dashboard_*" pattern always signals dashboard,
        //     an "ecommerce_*" pattern always signals ecommerce, etc.
        if (ch33.layoutPattern) {
            for (const { type, weight } of layoutPatternTypeSignals(String(ch33.layoutPattern), validTypes)) {
                scores[type] = (scores[type] ?? 0) + weight;
            }
        }
        // 2b. interactionModel: finite enum → soft type signals
        const iSigs = INTERACTION_TYPE_SIGNALS[String(ch33.interactionModel ?? "")];
        if (iSigs) {
            for (const [type, weight] of iSigs)
                scores[type] = (scores[type] ?? 0) + weight;
        }
        // 2c. contentFlow: finite enum → soft type signals
        const fSigs = CONTENT_FLOW_TYPE_SIGNALS[String(ch33.contentFlow ?? "")];
        if (fSigs) {
            for (const [type, weight] of fSigs)
                scores[type] = (scores[type] ?? 0) + weight;
        }
        // 2d. heroProminence: none → functional page; full viewport → brand/landing
        const hero = String(ch33.heroProminence ?? "");
        if (hero === "none") {
            scores["dashboard"] = (scores["dashboard"] ?? 0) + 1;
            scores["application"] = (scores["application"] ?? 0) + 1;
            scores["documentation"] = (scores["documentation"] ?? 0) + 1;
        }
        else if (hero === "full_viewport" || hero === "full_bleed_video" || hero === "immersive_3d") {
            scores["landing"] = (scores["landing"] ?? 0) + 1;
            scores["creative"] = (scores["creative"] ?? 0) + 1;
        }
        // 2e. navRequirement: sidebar/command signals functional/app context
        const nav = String(ch33.navRequirement ?? "");
        if (nav === "sidebar_persistent" || nav === "sidebar_collapsible" || nav === "command_palette") {
            scores["dashboard"] = (scores["dashboard"] ?? 0) + 1;
            scores["application"] = (scores["application"] ?? 0) + 1;
            scores["documentation"] = (scores["documentation"] ?? 0) + 1;
        }
    }
    // 3. Pick winner
    let bestType = "landing";
    let bestScore = 0;
    for (const [type, score] of Object.entries(scores)) {
        if (score > bestScore) {
            bestScore = score;
            bestType = type;
        }
    }
    const contentType = bestScore > 0 ? bestType : "landing";
    const rule = CONTEXT_RULES[contentType] || CONTEXT_RULES.landing;
    // Calculate complexity from genome if available
    const complexity = genome
        ? calculateComplexity(genome)
        : 0.5;
    return {
        contentType,
        purpose: rule.purposes[0],
        audience: rule.audiences[0],
        complexity,
        requiredSections: rule.requiredSections,
        optionalSections: rule.optionalSections,
        forbiddenSections: rule.forbiddenSections,
    };
}
/**
 * Calculate complexity score from genome chromosomes.
 * Exported so callers (context-composer, library selectors) can reuse it
 * without duplicating the logic.
 */
export function calculateComplexity(genome) {
    const ch = genome.chromosomes;
    let score = 0;
    // Structure complexity
    if (ch.ch1_structure?.topology === "graph")
        score += 0.3;
    else if (ch.ch1_structure?.topology === "radial")
        score += 0.2;
    else if (ch.ch1_structure?.topology === "deep")
        score += 0.25;
    else
        score += 0.1;
    // Motion complexity
    if (ch.ch8_motion?.physics === "particle" || ch.ch8_motion?.physics === "fluid")
        score += 0.2;
    else if (ch.ch8_motion?.physics === "spring" || ch.ch8_motion?.physics === "elastic")
        score += 0.1;
    // Rendering complexity
    if (ch.ch18_rendering?.primary === "webgl2")
        score += 0.3;
    else if (ch.ch18_rendering?.primary === "canvas2d" || ch.ch18_rendering?.primary === "canvas_bitmap")
        score += 0.15;
    // Atmosphere complexity
    if (ch.ch13_atmosphere?.fx && ch.ch13_atmosphere?.fx !== "none")
        score += 0.1;
    // Content depth
    if (ch.ch23_content_depth?.estimatedSections) {
        score += Math.min(0.2, ch.ch23_content_depth.estimatedSections * 0.02);
    }
    return Math.min(1, Math.max(0, score));
}
/**
 * Get context rules for a content type
 */
export function getContextRules(contentType) {
    return CONTEXT_RULES[contentType];
}
/**
 * List all available content types
 */
export function getAvailableContentTypes() {
    return Object.keys(CONTEXT_RULES);
}
