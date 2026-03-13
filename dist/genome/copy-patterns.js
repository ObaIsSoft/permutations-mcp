/**
 * Permutations MCP - Copy Pattern Banks
 *
 * Mathematical copy generation using hash-derived selection.
 * No hardcoded content - only pattern primitives that combine via hash bytes.
 */
// Pattern banks for hash-driven copy generation
export const COPY_PATTERN_BANKS = {
    // CTA verb patterns by aggression level (0.0-1.0)
    ctaVerbs: {
        soft: ["Explore", "Discover", "Learn", "View", "See"],
        moderate: ["Get", "Start", "Try", "Find", "Check"],
        strong: ["Build", "Create", "Join", "Access", "Unlock"],
        aggressive: ["Buy", "Claim", "Grab", "Secure", "Reserve"]
    },
    // CTA noun patterns by sector
    ctaNouns: {
        healthcare: ["Care", "Support", "Help", "Consultation", "Visit"],
        fintech: ["Wealth", "Returns", "Portfolio", "Investing", "Savings"],
        legal: ["Counsel", "Consultation", "Representation", "Advice", "Support"],
        technology: ["Building", "Creating", "Shipping", "Deploying", "Scaling"],
        education: ["Learning", "Skills", "Knowledge", "Courses", "Education"],
        commerce: ["Collection", "Products", "Items", "Goods", "Purchases"],
        automotive: ["Drive", "Performance", "Experience", "Vehicle", "Ride"],
        real_estate: ["Property", "Home", "Space", "Investment", "Location"],
        travel: ["Trip", "Journey", "Adventure", "Experience", "Destination"],
        food: ["Menu", "Taste", "Experience", "Dining", "Flavors"],
        sports: ["Training", "Performance", "Fitness", "Game", "Victory"],
        manufacturing: ["Solutions", "Quality", "Precision", "Products", "Capabilities"],
        entertainment: ["Experience", "Content", "Shows", "Events", "Access"]
    },
    // CTA modifiers by formality
    ctaModifiers: {
        formal: ["Today", "Now", "Immediately", "Professionally"],
        casual: ["Free", "Easy", "Quick", "Simple"],
        premium: ["Exclusive", "Premium", "Priority", "VIP"]
    },
    // Headline pattern fragments (combine 2-3 via hash)
    headlineFragments: {
        benefit_action: ["Save", "Build", "Grow", "Streamline", "Optimize", "Transform", "Accelerate", "Simplify"],
        benefit_object: ["Time", "Money", "Results", "Growth", "Performance", "Success", "Efficiency", "Productivity"],
        benefit_outcome: ["Faster", "Smarter", "Better", "Easier", "Stronger", "Bigger", "Higher", "Deeper"],
        curiosity_setup: ["The", "What", "Why", "How", "When", "Where", "Who"],
        curiosity_subject: ["Secret", "Truth", "Reality", "Method", "Reason", "Way", "System", "Approach"],
        curiosity_hook: ["Nobody Talks About", "Changes Everything", "Actually Works", "You Haven't Tried", "Really Matters"],
        proof_metric: ["Join", "Trusted by", "Loved by", "Used by", "Rated"],
        proof_subject: ["Professionals", "Experts", "Teams", "Companies", "People", "Customers"],
        proof_number: ["10,000+", "Millions", "1000s", "Countless", "Thousands"]
    },
    // Tagline pattern fragments
    taglineFragments: {
        prefix: ["Built for", "Designed for", "Made for", "Created for", "Engineered for"],
        audience: ["Teams", "Professionals", "Leaders", "Creators", "Builders", "Visionaries"],
        suffix: ["Who Demand More", "Who Get Results", "Who Think Different", "Who Lead", "Who Create"]
    },
    // Sentence structure templates
    sentenceTemplates: {
        short_punchy: [
            "{verb}. {noun}.",
            "{adj} {noun}.",
            "{verb} {noun}.",
            "Pure {noun}."
        ],
        balanced: [
            "{verb} {noun} for {audience}.",
            "{adj} {noun} that {verb}.",
            "The {noun} for {adj} {audience}.",
            "{verb} {noun} without {problem}."
        ],
        complex: [
            "When {condition}, {solution}.",
            "For {audience} who {desire}, {offering}.",
            "The {noun} that {benefit}, because {reason}.",
            "{adj} {noun} for those who {criteria}."
        ]
    },
    // Industry term banks by sector (used to fill templates)
    industryTerms: {
        healthcare: ["care", "wellness", "treatment", "recovery", "healing", "patient", "clinical", "medical"],
        fintech: ["wealth", "returns", "portfolio", "assets", "investment", "financial", "capital", "growth"],
        legal: ["counsel", "representation", "jurisdiction", "precedent", "advocacy", "litigation", "compliance"],
        technology: ["integration", "automation", "scalability", "deployment", "infrastructure", "platform"],
        education: ["learning", "mastery", "curriculum", "outcomes", "development", "skills", "knowledge"],
        commerce: ["quality", "collection", "selection", "craftsmanship", "value", "excellence"],
        automotive: ["performance", "handling", "efficiency", "precision", "engineering", "innovation"],
        real_estate: ["property", "investment", "location", "value", "space", "estate"],
        travel: ["adventure", "experience", "journey", "discovery", "exploration", "destination"],
        food: ["flavor", "craft", "quality", "taste", "freshness", "artistry"],
        sports: ["performance", "training", "achievement", "excellence", "victory", "fitness"],
        manufacturing: ["precision", "quality", "capacity", "innovation", "efficiency", "reliability"],
        entertainment: ["experience", "content", "entertainment", "immersion", "storytelling", "discovery"]
    },
    // Adjective banks by emotional register
    adjectives: {
        clinical: ["precise", "clinical", "systematic", "measured", "calibrated", "verified"],
        professional: ["professional", "reliable", "trusted", "proven", "established", "respected"],
        conversational: ["friendly", "approachable", "genuine", "authentic", "real", "human"],
        playful: ["fun", "energetic", "vibrant", "dynamic", "lively", "bold"],
        luxury: ["exclusive", "refined", "elegant", "prestigious", "exceptional", "distinguished"],
        urgent: ["immediate", "critical", "essential", "vital", "crucial", "pressing"]
    },
    // Verb banks by emotional register
    verbs: {
        clinical: ["analyze", "measure", "calibrate", "verify", "optimize", "systematize"],
        professional: ["deliver", "provide", "ensure", "maintain", "support", "enable"],
        conversational: ["help", "guide", "assist", "connect", "share", "collaborate"],
        playful: ["create", "build", "explore", "discover", "play", "experiment"],
        luxury: ["curate", "craft", "refine", "elevate", "perfect", "cultivate"],
        urgent: ["act", "seize", "secure", "claim", "grab", "accelerate"]
    }
};
// Template generators that combine patterns via hash bytes
export function generateHeadlineFromPatterns(style, sector, register, b) {
    const banks = COPY_PATTERN_BANKS;
    const safeStyle = style || "direct";
    const safeRegister = register || "professional";
    if (safeStyle === "benefit_forward") {
        const action = banks.headlineFragments.benefit_action[Math.floor(b(140) * banks.headlineFragments.benefit_action.length)];
        const object = banks.headlineFragments.benefit_object[Math.floor(b(141) * banks.headlineFragments.benefit_object.length)];
        const outcome = banks.headlineFragments.benefit_outcome[Math.floor(b(142) * banks.headlineFragments.benefit_outcome.length)];
        return `${action} ${object} ${outcome}`;
    }
    if (safeStyle === "curiosity_gap") {
        const setup = banks.headlineFragments.curiosity_setup[Math.floor(b(143) * banks.headlineFragments.curiosity_setup.length)];
        const subject = banks.headlineFragments.curiosity_subject[Math.floor(b(144) * banks.headlineFragments.curiosity_subject.length)];
        const hook = banks.headlineFragments.curiosity_hook[Math.floor(b(145) * banks.headlineFragments.curiosity_hook.length)];
        return `${setup} ${subject} ${hook}`;
    }
    if (safeStyle === "social_proof") {
        const metric = banks.headlineFragments.proof_metric[Math.floor(b(146) * banks.headlineFragments.proof_metric.length)];
        const number = banks.headlineFragments.proof_number[Math.floor(b(147) * banks.headlineFragments.proof_number.length)];
        const subject = banks.headlineFragments.proof_subject[Math.floor(b(148) * banks.headlineFragments.proof_subject.length)];
        return `${metric} ${number} ${subject}`;
    }
    // NOTE: Headlines should be derived from user intent, not generic patterns
    // Return placeholder indicating customization needed
    return "Headline Placeholder - Customize with your value proposition";
}
export function generateCTAFromPatterns(aggression, sector, register, b) {
    // NOTE: CTA text should be derived from user intent, not generic patterns
    // Return generic action placeholder
    return "Get Started";
}
export function generateTaglineFromPatterns(sector, register, b) {
    // NOTE: Taglines should be derived from user intent, not generic patterns
    return "Tagline placeholder - your product's unique value proposition";
}
export function generateSentenceFromTemplate(structure, sector, register, b) {
    // NOTE: Subheadlines should be derived from user intent, not generic templates
    // Return placeholder indicating customization needed
    return "Subheadline placeholder - describe your product's key benefit or differentiator";
}
