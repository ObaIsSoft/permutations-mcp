/**
 * Genome MCP - Design Genome Types
 * 
 * Extended type system with sector awareness, content analysis,
 * hero types, trust signals, and brand integration.
 */

export {
    LayoutPattern,
    StructuralCategory,
    NavRequirement,
    HeroProminence,
    InteractionModel,
    ContentFlowStrategy,
    DensityDistribution,
    ResponsiveStrategy,
    ComponentFramework,
    CompositionStyle,
    PropComplexity,
    AnimationScope,
} from "./composition-types.js";
import type {
    LayoutPattern,
    StructuralCategory,
    NavRequirement,
    HeroProminence,
    InteractionModel,
    ContentFlowStrategy,
    DensityDistribution,
    ResponsiveStrategy,
    ComponentFramework,
    CompositionStyle,
    PropComplexity,
    AnimationScope,
} from "./composition-types.js";

// ============================================================================
// SECTOR DEFINITIONS
// ============================================================================

export type PrimarySector =
    | "healthcare"
    | "fintech"
    | "automotive"
    | "education"
    | "commerce"
    | "entertainment"
    | "manufacturing"
    | "legal"
    | "real_estate"
    | "travel"
    | "food"
    | "sports"
    | "technology"
    | "nonprofit"
    | "government"
    | "media"
    | "crypto_web3"
    | "gaming"
    | "hospitality"
    | "beauty_fashion"
    | "insurance"
    | "agency"
    | "energy";

export type SecondarySector = PrimarySector | null;

export type SubSector =
    // Healthcare
    | "healthcare_surgical" | "healthcare_wellness" | "healthcare_emergency"
    | "healthcare_pediatric" | "healthcare_geriatric" | "healthcare_cosmetic"
    | "healthcare_dental" | "healthcare_diagnostic" | "healthcare_financial"
    | "healthcare_general"
    // Fintech
    | "fintech_consumer" | "fintech_enterprise" | "fintech_trading"
    | "fintech_lending" | "fintech_payments" | "fintech_wealth"
    | "fintech_general"
    // Automotive
    | "automotive_luxury" | "automotive_economy" | "automotive_electric"
    | "automotive_commercial" | "automotive_general"
    // Education
    | "education_k12" | "education_higher" | "education_corporate"
    | "education_creative" | "education_general"
    // Commerce
    | "commerce_luxury" | "commerce_fast" | "commerce_b2b"
    | "commerce_marketplace" | "commerce_general"
    // Entertainment
    | "entertainment_streaming" | "entertainment_gaming" | "entertainment_music"
    | "entertainment_film" | "entertainment_events" | "entertainment_general"
    // Manufacturing
    | "manufacturing_aerospace" | "manufacturing_automotive" | "manufacturing_pharma"
    | "manufacturing_industrial" | "manufacturing_consumer" | "manufacturing_general"
    // Legal
    | "legal_corporate" | "legal_litigation" | "legal_immigration"
    | "legal_ip" | "legal_family" | "legal_general"
    // Real Estate
    | "real_estate_residential" | "real_estate_commercial" | "real_estate_luxury"
    | "real_estate_rental" | "real_estate_industrial" | "real_estate_general"
    // Travel
    | "travel_luxury" | "travel_budget" | "travel_adventure" | "travel_business"
    | "travel_cruise" | "travel_general"
    // Food
    | "food_restaurant" | "food_delivery" | "food_catering" | "food_cpg"
    | "food_beverage" | "food_general"
    // Sports
    | "sports_fitness" | "sports_professional" | "sports_amateur" | "sports_equipment"
    | "sports_nutrition" | "sports_general"
    // Technology
    | "technology_saas" | "technology_developer" | "technology_infrastructure"
    | "technology_ai" | "technology_security" | "technology_hardware" | "technology_general"
    // Nonprofit
    | "nonprofit_advocacy" | "nonprofit_charity" | "nonprofit_foundation"
    | "nonprofit_community" | "nonprofit_environmental" | "nonprofit_general"
    // Government
    | "government_federal" | "government_state" | "government_municipal"
    | "government_regulatory" | "government_defense" | "government_general"
    // Media
    | "media_news" | "media_magazine" | "media_podcast"
    | "media_newsletter" | "media_publishing" | "media_broadcast" | "media_general"
    // Crypto / Web3
    | "crypto_web3_defi" | "crypto_web3_nft" | "crypto_web3_dao"
    | "crypto_web3_infrastructure" | "crypto_web3_exchange" | "crypto_web3_wallet" | "crypto_web3_general"
    // Gaming
    | "gaming_mobile" | "gaming_console" | "gaming_pc"
    | "gaming_indie" | "gaming_esports" | "gaming_studio" | "gaming_general"
    // Hospitality
    | "hospitality_hotel" | "hospitality_resort" | "hospitality_luxury"
    | "hospitality_boutique" | "hospitality_rental" | "hospitality_general"
    // Beauty & Fashion
    | "beauty_fashion_luxury_beauty" | "beauty_fashion_skincare" | "beauty_fashion_fashion"
    | "beauty_fashion_cosmetics" | "beauty_fashion_fragrance" | "beauty_fashion_wellness" | "beauty_fashion_general"
    // Insurance
    | "insurance_health" | "insurance_life" | "insurance_auto"
    | "insurance_home" | "insurance_business" | "insurance_specialty" | "insurance_general"
    // Agency
    | "agency_creative" | "agency_digital" | "agency_branding"
    | "agency_marketing" | "agency_pr" | "agency_consulting" | "agency_general"
    // Energy
    | "energy_renewable" | "energy_oil_gas" | "energy_utilities"
    | "energy_nuclear" | "energy_storage" | "energy_distribution" | "energy_general"
    // Default
    | "general";

// ============================================================================
// HERO TYPE DEFINITIONS
// ============================================================================

export type HeroType =
    // === PRODUCT-FOCUSED (4) ===
    | "product_ui"           // Live product screenshots
    | "product_video"        // Product demonstration video
    | "configurator_3d"      // Interactive 3D product configurator
    | "product_comparison"   // Side-by-side before/after, vs mode
    // === DATA/PROOF-FOCUSED (4) ===
    | "stats_counter"        // Live statistics display
    | "trust_authority"      // Credentials, awards, certifications
    | "testimonial_focus"    // Customer stories, reviews
    | "social_proof_wall"    // Logos, mentions, press grid
    // === UTILITY-FOCUSED (4) ===
    | "search_discovery"     // Search-first interface
    | "calculator_tool"      // Interactive calculator, estimator
    | "quiz_assessment"      // Questionnaire, personality test
    | "demo_simulator"       // Try-before-buy simulation
    // === CONTENT-FOCUSED (4) ===
    | "content_carousel"     // Rotating showcase
    | "editorial_feature"    // Content-first, articles
    | "documentary_story"    // Long-form narrative, case study
    | "knowledge_base"       // Documentation, wiki-style
    // === BRAND/EMOTION-FOCUSED (4) ===
    | "brand_logo"           // Iconic brand mark only
    | "aspirational_imagery" // Lifestyle, emotional imagery
    | "manifesto_statement"  // Bold declaration, manifesto
    | "cultural_moment"      // Zeitgeist, trend-driven
    // === EXPERIMENTAL/SPATIAL (4) ===
    | "portal_view"          // 3D portal/window into product
    | "constellation_nav"    // Scattered entry points, no center
    | "immersive_void"       // Content floating in darkness
    | "ambient_presence";    // Atmosphere only, minimal content

export type HeroLayoutVariant =
    | "centered"
    | "split_left"
    | "split_right"
    | "full_bleed"
    | "overlay"
    | "floating_cards"
    | "asymmetric"
    | "minimal"
    | "immersive"          // Full viewport with depth
    | "diagonal"           // Angled split composition
    | "orbital"            // Content orbits central visual
    | "cinematic"          // 21:9 aspect with letterboxing
    | "magazine"           // Editorial multi-column
    | "mosaic"             // Grid of tiles
    | "parallax"           // Multi-layer depth
    | "reveal"             // Scroll-triggered unveil
    | "floating"           // Hovering elements
    | "broken_grid"        // Overlapping asymmetric
    | "fullscreen_video";  // Background video focus

// ============================================================================
// VISUAL TREATMENT DEFINITIONS
// ============================================================================

export type VisualTreatment =
    | "product_screenshots"   // Clean UI captures
    | "lifestyle_photography" // People using product
    | "studio_product"        // Professional product photography
    | "documentary"           // Candid, authentic moments
    | "macro_detail"          // Close-up textures, details
    | "architectural"         // Spaces, buildings, environments
    | "candid_moment"         // Natural, unposed
    | "abstract_gradient"     // Color fields, gradients
    | "illustration"          // Custom illustrations
    | "3d_render"             // CGI / product renders (automotive, tech, fashion)
    | "data_viz"              // Charts, graphs, dashboards as primary visual
    | "motion_graphic";       // Animated illustration / lottie as hero

export type VideoStrategy =
    | "background_ambient"    // Atmospheric, no sound
    | "product_demo"          // Feature walkthrough
    | "testimonial"           // Customer speaking
    | "tutorial_walkthrough"  // How-to content
    | "brand_story"           // Mission, values narrative
    | "live_feed"             // Real-time content
    | "none";                 // No video

// ============================================================================
// TRUST SIGNAL DEFINITIONS
// ============================================================================

export type TrustApproach =
    | "credentials"           // Certifications, degrees, affiliations
    | "testimonials"          // Customer quotes, reviews
    | "stats"                 // Numbers, achievements
    | "security_badges"       // Compliance, security certifications
    | "social_proof_logos"    // Customer/partner company logos
    | "case_studies"          // Detailed success stories
    | "guarantees"            // Money-back, satisfaction guarantees
    | "transparency_reports"; // Open data, audits

export type TrustProminence =
    | "subtle"      // Footer or small section
    | "integrated"  // Within content flow
    | "prominent"   // Dedicated section
    | "hero_feature"; // Above the fold, prominent

export type SocialProofType =
    | "none"                // No social proof (hasSocialProof = false)
    | "customer_logos"      // Company logos
    | "user_count"          // "X million users"
    | "rating_stars"        // Star ratings
    | "testimonials_grid"   // Multiple quotes
    | "community_size"      // Forum, member count
    | "press_mentions";     // Media logos

export type ImpactDemonstration =
    | "live_counter"        // Real-time updating numbers
    | "cumulative_stats"    // "$1T processed"
    | "before_after"        // Comparison visuals
    | "roi_calculator"      // Interactive savings/return tool
    | "timeline_progress";  // Journey, milestones

// ============================================================================
// CONTENT STRUCTURE DEFINITIONS
// ============================================================================

export type ContentDepth =
    // === SPARSE (4) ===
    | "micro"         // Single section only
    | "minimal"       // 2-3 sections
    | "focused"       // 3-4 sections, one primary
    | "landing"       // 4-5 sections, conversion-focused
    // === MODERATE (4) ===
    | "moderate"      // 4-6 sections
    | "standard"      // 5-7 sections, typical brochure
    | "scannable"     // 6-8 sections, quick-jump friendly
    | "modular"       // 7-9 sections, interchangeable blocks
    // === EXTENSIVE (4) ===
    | "extensive"     // 7-10 sections
    | "deep"          // 8-12 sections, narrative-driven
    | "comprehensive" // 10-14 sections
    | "encyclopedic"  // 12-16 sections, reference-style
    // === MASSIVE (4) ===
    | "platform"      // 15-20 sections, multi-product
    | "ecosystem"     // 20-30 sections, suite showcase
    | "infinite"      // 30+ sections, scroll-driven
    | "database";     // Dynamic section count, query-driven

export type InformationArchitecture =
    // === LINEAR (4) ===
    | "funnel_linear"    // Sequential conversion flow
    | "step_progress"    // Step-by-step wizard
    | "timeline"         // Chronological progression
    | "onboarding"       // Progressive disclosure
    // === HIERARCHICAL (4) ===
    | "hub_spoke"        // Central page with topic branches
    | "tree_branch"      // Deep category nesting
    | "pyramid"          // Broad top, narrow deep
    | "taxonomy"         // Faceted classification
    // === MODULAR (4) ===
    | "modular_sections" // Independent, scannable blocks
    | "bento_grid"       // Grid-based equal-weight
    | "masonry_flow"     // Pinterest-style cascade
    | "card_deck"        // Stackable, filterable cards
    // === NARRATIVE (4) ===
    | "narrative_scroll" // Story-driven, continuous
    | "scrollytelling"   // Scroll-triggered reveals
    | "parallax_journey" // Depth-based storytelling
    | "chapter_book"     // Clear section boundaries
    // === SPATIAL (4) ===
    | "data_dashboard"   // Dense, interactive data
    | "spatial_canvas"   // 2D zoomable surface
    | "3d_scene"         // Three-dimensional space
    | "immersive_world"; // Full-screen takeovers

export type PersonalizationApproach =
    | "static"            // Same for everyone
    | "location_based"    // Geographic customization
    | "behavior_based"    // Based on past actions
    | "segment_based"     // User type (B2B vs B2C)
    | "fully_dynamic";    // Real-time personalization

// ============================================================================
// CONTENT ANALYSIS (Enhanced)
// ============================================================================

export interface ContentAnalysis {
    visualMarkers: {
        dominantColors: string[];
        colorTemperature: "warm" | "cool" | "neutral";
        textureProfile: "smooth" | "grainy" | "high_contrast" | "minimal" | "rich";
        imageAspectRatios: ("landscape" | "portrait" | "square")[];
        visualDensity: "sparse" | "medium" | "dense";
    };
    textMarkers: {
        averageWordLength: number;
        textVolume: "minimal" | "medium" | "extensive";
        hierarchyDepth: number;
        contentTone: "technical" | "narrative" | "commercial" | "editorial" | "authoritative" | "conversational";
        scanVsReadRatio: number;
        keywords: string[];           // Extracted key terms
        entities: string[];           // Named entities (org, product)
    };
    structuralMarkers: {
        contentType: "high_frequency_data" | "long_form" | "portfolio" | "commerce" | "dashboard" | "editorial" | "directory" | "community" | "tool" | "saas_app";
        updateFrequency: "static" | "periodic" | "realtime";
        itemCount: number;
        chronology: boolean;
        taxonomy: boolean;
    };
    epigeneticFactors: {
        existingBrandColors: string[];
        logoTypography: "serif" | "sans" | "script" | "geometric";
        spatialQuality: "organic" | "orthogonal" | "chaotic";
    };
    // Extended trait properties
    sectorClassification: {
        primary: PrimarySector;
        secondary: SecondarySector;
        subSector: SubSector;
        confidence: number;           // 0.0 - 1.0 classification confidence
    };
    trustIndicators: {
        requiresTrustSignals: boolean;
        trustPriority: "low" | "medium" | "high" | "critical";
        suggestedApproaches: TrustApproach[];
    };
}

// ============================================================================
// CONTENT TRAITS (Enhanced)
// ============================================================================

export interface ContentTraits {
    informationDensity: number;     // 0.0 - 1.0 (sparse to maximal)
    temporalUrgency: number;        // 0.0 - 1.0 (archival to realtime)
    emotionalTemperature: number;   // 0.0 - 1.0 (clinical/cold to warm/humanist)
    playfulness: number;            // 0.0 - 1.0 (brutal/strict to organic/whimsical)
    spatialDependency: number;      // 0.0 - 1.0 (flat 2D to deep immersive 3D)
    // Extended trait properties
    trustRequirement: number;       // 0.0 - 1.0 (low to critical)
    visualEmphasis: number;         // 0.0 - 1.0 (text-heavy to visual-first)
    conversionFocus: number;        // 0.0 - 1.0 (informational to conversion)
}

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export interface TypographyScale {
    display: { size: string; lineHeight: string; letterSpacing: string };
    h1: { size: string; lineHeight: string; letterSpacing: string };
    h2: { size: string; lineHeight: string; letterSpacing: string };
    h3: { size: string; lineHeight: string; letterSpacing: string };
    body: { size: string; lineHeight: string; letterSpacing: string };
    small: { size: string; lineHeight: string; letterSpacing: string };
    ratio: number;
    baseSize: number;
}

// ============================================================================
// ACCESSIBILITY & RENDERING
// ============================================================================

export interface AccessibilityProfile {
    minContrastRatio: number;
    focusIndicator: "outline" | "ring" | "underline" | "none";
    respectMotionPreference: boolean;
    minTouchTarget: number;
    screenReaderOptimized: boolean;
}

export type RenderingPrimary = 
    | "webgl"           // Full WebGL with shaders
    | "webgl2"          // WebGL 2.0 compute shaders
    | "css"             // CSS transforms and animations
    | "css_houdini"     // CSS Paint/Layout API
    | "static"          // No animation, paint once
    | "svg"             // SVG with SMIL/CSS
    | "svg_js"          // SVG manipulated via JS
    | "canvas2d"        // 2D canvas immediate mode
    | "canvas_bitmap"   // OffscreenCanvas + ImageBitmap
    | "video"           // Video textures
    | "dom"             // Pure DOM manipulation
    | "hybrid_gpu"      // WebGL + CSS composite
    | "hybrid_canvas"   // Canvas + DOM overlay
    | "progressive"     // Start static, upgrade to WebGL
    | "regressive";     // Start WebGL, fallback gracefully

export type RenderingComplexity = 
    | "minimal"         // Single pass, no shaders
    | "balanced"        // Standard materials, basic lighting
    | "rich"            // PBR materials, shadows, post-processing
    | "extreme"         // Ray-marching, GI, volumetrics
    | "adaptive";       // Quality scales with device capability

export interface RenderingStrategy {
    primary: RenderingPrimary;
    fallback: "css" | "static" | "none" | "canvas2d" | "svg";
    animate: boolean;
    complexity: RenderingComplexity;
    antialias: "none" | "msaa" | "fxaa" | "taa";
    hdr: boolean;
    shadowQuality: "none" | "hard" | "pcf" | "pcss" | "vsm";
}

// ============================================================================
// BRAND CONFIGURATION
// ============================================================================

export interface BrandConfiguration {
    colors: {
        primary?: string;
        secondary?: string;
        accent?: string;
    };
    fonts?: {
        display?: string;
        body?: string;
    };
    assets?: {
        logo?: string;
        favicon?: string;
        brandGuidelines?: string;
    };
    weight: number;  // 0.0 - 1.0 (sector dominant to brand dominant)
}

// ============================================================================
// GENERATION OPTIONS
// ============================================================================

export interface GenerationOptions {
    disabledChromosomes?: string[];      // User can eliminate chromosomes
    forcedChromosomes?: Partial<DesignGenome["chromosomes"]>;  // Force specific values
    creativityLevel?: "conservative" | "balanced" | "experimental";
    brandWeight?: number;                // Override brand config weight
    sectorWeight?: number;               // Override sector influence
    contentWeight?: number;              // Override content analysis influence
    enable3D?: boolean;                  // Global 3D toggle (default: context-appropriate)
    fontProvider?: FontProvider;         // "bunny" | "google" | "fontshare" | "none" (default: "bunny")
    copyIntelligence?: {                 // LLM-extracted copy guidance
        industryTerminology: string[];
        emotionalRegister: "clinical" | "professional" | "conversational" | "playful" | "luxury" | "urgent";
        formalityLevel: number;
        ctaAggression: number;
        headlineStyle: "benefit_forward" | "curiosity_gap" | "social_proof" | "how_to" | "direct";
        vocabularyComplexity: "simple" | "moderate" | "technical" | "specialized";
        sentenceStructure: "short_punchy" | "balanced" | "complex_periodic";
        emojiUsage: boolean;
        contractionUsage: boolean;
    };
    // Copy content generated from intent by LLM
    copy?: {
        headline: string;
        subheadline: string;
        cta: string;
        tagline: string;
        companyName: string;
        features: { title: string; description: string }[];
        stats: { label: string; value: string }[];
        testimonial: string;
        authorName: string;
        authorTitle: string;
        ctaSecondary: string;
        sectionTitleTestimonials: string;
        sectionTitleFeatures: string;
        sectionTitleFAQ: string;
        faq: { question: string; answer: string }[];
        footerProductTitle: string;
        footerCompanyTitle: string;
        footerNavProduct: string[];
        footerNavCompany: string[];
    };
}

// ============================================================================
// CHROMOSOME VALUE RANGES
// ============================================================================

export type Topology = 
    | "flat"           // Single level, no nesting
    | "deep"           // Hierarchical nesting
    | "graph"          // Network relationships
    | "radial"         // Center-out organization
    | "bento"          // Grid-based modular
    | "editorial"      // Asymmetric magazine-style
    | "masonry"        // Pinterest-style cascading
    | "split"          // 50/50 or 30/70 divides
    | "layered"        // Z-axis depth stacking
    | "orbital"        // Rotating focal points
    | "fractal"        // Self-similar at all scales
    | "liquid"         // Flowing, container-query driven
    | "panoramic"      // Horizontal scroll sections
    | "immersive"      // Full-viewport takeovers
    | "modular"        // Component-based assembly
    | "sequential";    // Step-by-step progression
export type ScrollBehavior = 
    | "paginated"      // Discrete page stops
    | "continuous"     // Smooth free scroll
    | "snap"           // Snap to section boundaries
    | "momentum"       // Physics-based inertia
    | "parallax"       // Multi-layer depth scrolling
    | "horizontal"     // Left-to-right primary
    | "omni"           // 360° free navigation
    | "pin"            // Scroll-triggered pin sections
    | "reveal"         // Content reveals on scroll
    | "smooth"         // Lenis-style smooth dampening
    | "virtual"        // Windowed list virtualization
    | "infinite";      // Endless scroll loading
export type BreakpointStrategy = 
    | "mobile_first"      // Design for mobile, scale up
    | "desktop_first"     // Design for desktop, scale down  
    | "fluid"             // Continuous scaling, no breakpoints
    | "content_based"     // Break at content widths, not device widths
    | "container_query"   // Component-level responsive
    | "macro_micro"       // Separate macro (layout) and micro (component) breakpoints
    | "viewport_only"     // No breakpoints, viewport scaling only
    | "device_specific"   // Break at exact device dimensions
    | "accessibility"     // Break at zoom levels for a11y
    | "hybrid"            // Mix of strategies per section
    | "atomic"            // Per-element responsive behavior
    | "none";             // Single fixed width, no responsiveness
export type ContentFlow = 
    | "reading_order"  // Top-to-bottom, left-to-right
    | "z_pattern"      // Eye tracking in Z shape
    | "f_pattern"      // Eye tracking in F shape
    | "layered"        // Background → midground → foreground
    | "spiral"         // Golden ratio spiral focus
    | "triangle"       // A-frame composition
    | "diagonal"       // Dynamic diagonal tension
    | "center_out"     // Radial from focal point
    | "chaos"          // Intentional disorder
    | "grid"           // Strict matrix alignment
    | "golden"         // Golden section proportions
    | "rule_thirds";   // Photographic composition
export type RhythmDensity = 
    | "empty"          // 90%+ negative space
    | "sparse"         // 70% negative space
    | "breathing"      // 50% negative space
    | "balanced"       // 40% negative space
    | "dense"          // 25% negative space
    | "airtight"       // 15% negative space
    | "maximal"        // 5% negative space
    | "compressed"     // Overlapping elements
    | "expanded"       // Extra generous spacing
    | "rhythmic"       // Musical measure-based
    | "stochastic"     // Randomized spacing
    | "fibonacci";     // Fibonacci sequence spacing
export type TypeCharge = "geometric" | "humanist" | "monospace" | "transitional" | "grotesque" | "slab_serif" | "expressive";
export type FontProvider = "bunny" | "google" | "fontshare" | "none";

// ── Design Philosophy (derived from chromosome combination, not a new chromosome) ──
export type DesignPhilosophy =
    | "minimalist"    // one font, flat depth, whitespace is the design
    | "swiss_grid"    // rigid grid, 1-2 fonts, geometric, no decoration
    | "editorial"     // mixed hierarchy, image-forward, 2-3 fonts, pull quotes
    | "brand_heavy"   // logo-centric, strong palette, shape motifs
    | "technical"     // monospace-dominant, data viz, structured, dark mode
    | "expressive"    // 3 fonts, grain, ghost text, star element, all systems active
    | "chaotic";      // rules deliberately broken — entropy > 0.80 only

// ── Depth Philosophy (genome-driven, not hardcoded) ──
export type DepthPhilosophy =
    | "flat"          // no depth techniques — color and space do all the work
    | "subtle"        // 1-2 techniques: shadow or color-depth only
    | "layered"       // 3-4 techniques stacked deliberately
    | "immersive";    // all applicable techniques — full spatial experience

// ── Font System ──
export type FontStrategy =
    | "single_family_weight"   // 1 font: one variable font, weight axis for all roles
    | "same_charge"            // 2 fonts: same typographic charge
    | "contrast_pair"          // 2 fonts: grotesque anchor + humanist serif body
    | "serif_anchor"           // 2 fonts: high-contrast serif + grotesque body
    | "mono_dominant"          // 2 fonts: monospace anchor + humanist body
    | "foundry_pair"           // 2 fonts: same foundry, different forms
    | "super_family"           // 3 fonts: sans + serif + mono from same family
    | "expressive_pair"        // 3 fonts: display + neutral body + geometric accent
    | "clash";                 // 3 fonts: deliberately mismatched — entropy > 0.7 only

export type HarmonyRule =
    | "monochromatic"          // same hue, 5 lightness steps
    | "analogous_tight"        // primary ±15°, ±30°
    | "analogous_wide"         // primary ±30°, ±60°
    | "complementary"          // primary + 180° + neutrals
    | "split_complementary"    // primary + 150° + 210°
    | "triadic"                // primary + 120° + 240°
    | "tetradic"               // primary + 90° + 180° + 270°
    | "double_complementary"   // two complementary pairs
    | "neutral_dominant"       // one strong hue + 4 near-neutral grays
    | "dark_accent"            // near-black base + one vivid accent
    | "pastel_system"          // all L=0.75-0.90, low saturation
    | "neon_dark";             // dark base + 2-3 neon accents

export interface PaletteColor {
    name: string;                               // natural color name: "forest", "slate", "ember"
    oklch: { l: number; c: number; h: number };
    hex: string;
    role: "primary" | "secondary" | "accent" | "neutral" | "background" | "surface";
    usageHints: string[];                       // ["hero bg", "CTA button"]
}

export interface ColorPalette {
    rule: HarmonyRule;
    colors: PaletteColor[];                     // 5 base, up to 7 on high entropy
    dominant: number;                           // index of loudest color
    background: number;
    text: number;
    accent: number;
    neutral: number;
}
export type TypeTracking = 
    | "ultra_tight"       // -0.1em, aggressive compression
    | "tight"             // -0.05em, slight compression
    | "snug"              // -0.02em, minimal compression
    | "normal"            // 0em, default
    | "relaxed"           // 0.02em, slight expansion
    | "wide"              // 0.05em, expanded
    | "extra_wide"        // 0.1em, very expanded
    | "ultra_wide"        // 0.15em, extreme expansion
    | "variable"          // Dynamic based on size
    | "screaming"         // Extreme expansion for impact
    | "whisper"           // Tight for subtle text
    | "proportional";     // Scales with font size
export type TypeCasing = 
    | "normal"            // Mixed case as typed
    | "uppercase"         // ALL CAPS
    | "lowercase"         // all lowercase
    | "small_caps"        // Small capitals
    | "title_case"        // First Letter Capitalized
    | "sentence_case"     // First letter capitalized
    | "camelCase"         // camelCase for tech
    | "kebab-case"        // kebab-case for css
    | "snake_case"        // snake_case for code
    | "alternating"       // AlTeRnAtInG cAsE
    | "random"            // Random casing
    | "inverted"          // iNVERTED cASE
    | "petite_caps"       // Smaller than small caps
    | "unicase"           // Mix of upper/lower in single height
    | "tall_caps"         // Stretched uppercase
    | "compressed";       // Squashed uppercase
export type ColorTemp = 
    | "warm"              // Yellow/orange bias
    | "cool"              // Blue/cyan bias
    | "neutral"           // No temperature bias
    | "hot"               // Extreme warm, red/orange
    | "cold"              // Extreme cool, blue/purple
    | "daylight"          // 5500K balanced
    | "tungsten"          // 2700K incandescent warm
    | "fluorescent"       // 4100K clinical cool
    | "overcast"          // Diffused cool gray
    | "sunset"            // Golden hour warm
    | "sunrise"           // Pink/orange dawn
    | "moonlight"         // Silvery cool
    | "fire"              // Red/orange flicker
    | "ice"               // Cyan/white arctic
    | "sepia"             // Brown nostalgic
    | "monochrome";       // Grayscale only
export type EdgeStyle =
    | "sharp"        // precise corners, no rounding
    | "soft"         // gentle rounded corners
    | "organic"      // freely curved, no geometric rigidity
    | "techno"       // modular, grid-aligned, digital-mechanical
    | "brutalist"    // raw, heavy, unrefined
    | "serrated"     // jagged / notched edges
    | "hand_drawn"   // irregular, imperfect, sketch-like
    | "chiseled"     // faceted, angular cuts — jewellery/luxury
    | "scalloped"    // wave-like curved edges
    | "beveled"      // 45° angle cuts
    | "pill"         // Full rounded (capsule)
    | "blob"         // Amorphous organic shapes
    | "geometric"    // Polygonal clip-path edges
    | "notched"      // CSS clip-path notches
    | "cutout"       // Corner cutouts
    | "deconstructed"; // Asymmetric broken edges

export type MotionPhysics =
    | "none"         // static — no animation
    | "spring"       // mass-spring-damper system — natural bounce
    | "step"         // discrete state jumps — mechanical precision
    | "glitch"       // corrupted signal — digital artefact
    | "magnetic"     // attraction/repulsion — elements pull toward cursor
    | "inertia"      // momentum-based — elements coast after release
    | "elastic"      // overshoot and snap back — rubber-band feel
    | "particle"     // stochastic — probabilistic swarm behaviour
    | "fluid"        // liquid-like continuous flow
    | "momentum"     // heavy physics, weighty feel
    | "bounce"       // exaggerated elastic collisions
    | "snap"         // magnetic snap-to points
    | "decay"        // exponential slow-down
    | "harmonic"     // sine-wave oscillation
    | "chaos"        // unpredictable, sensitive to initial conditions
    | "orbital"      // circular/elliptical paths
    | "pendulum"     // gravitational swing physics
    | "wave"         // Propagation through medium
    | "ripple"       // Concentric outward propagation
    | "vortex";      // Spiral inward/outward motion

export type EnterDirection =
    | "up" | "down" | "left" | "right"
    | "up_left" | "up_right" | "down_left" | "down_right"
    | "scale"        // grow from zero
    | "scale_x"      // horizontal stretch
    | "scale_y"      // vertical stretch
    | "fade"         // opacity only
    | "blur"         // blur-in
    | "spin_cw"      // clockwise rotation
    | "spin_ccw"     // counter-clockwise rotation
    | "flip_x"       // 3D flip horizontal
    | "flip_y"       // 3D flip vertical
    | "slide"        // slide with fade
    | "reveal"       // clipped reveal
    | "mask"         // masked wipe
    | "typewriter"   // character by character
    | "scramble"     // text decode effect
    | "morph"        // shape morph
    | "draw"         // SVG stroke draw
    | "pop"          // bounce-scale entrance
    | "elastic"      // wobble-scale entrance
    | "glitch"       // digital glitch reveal
    | "pixelate"     // pixel dissolve
    | "ripple"       // ripple from center
    | "vortex";      // spiral in

export type ExitBehavior =
    | "fade"
    | "slide"
    | "none"
    | "shrink"       // collapse to zero scale
    | "explode"      // burst outward + fade
    | "rotate_out"   // spin out
    | "morph_out";   // shape-morph into next element

export type GridLogic = "column" | "masonry" | "radial" | "broken" | "bento" | "editorial";
export type GridAlignment = 
    | "stretch"           // Fill available space
    | "center"            // Center in cell
    | "start"             // Align to start (left/top in LTR)
    | "end"               // Align to end (right/bottom in LTR)
    | "space_between"     // Distribute with space between
    | "space_around"      // Distribute with space around
    | "space_evenly"      // Equal space between and edges
    | "baseline"          // Align to text baseline
    | "first_baseline"    // First line baseline
    | "last_baseline"     // Last line baseline
    | "safe_center"       // Center unless overflow, then start
    | "unsafe_center"     // Center even if overflow
    | "self_start"        // Align to item's start
    | "self_end"          // Align to item's end
    | "anchor_center";    // Center on specific anchor point
export type HierarchyDepth = 
    | "flat"              // Single layer, no z-axis
    | "subtle"            // 2-3 depth levels
    | "layered"           // 4-6 distinct layers
    | "overlapping"       // Elements partially cover each other
    | "3d-stack"          // Strong 3D depth perception
    | "deep"              // Many layers, parallax-ready
    | "infinite"          // Scroll-driven infinite depth
    | "tunnel"            // Center-focused depth recession
    | "floating"          // Elements hover at different heights
    | "sunken"            // Recessed, cave-like depth
    | "stacked_cards"     // Card stack metaphor
    | "origami"           // Folded paper depth
    | "crystal"           // Faceted gemstone layers
    | "nebula"            // Atmospheric, cloud-like depth
    | "microscopic"       // Tiny layered details
    | "cosmic";           // Vast scale depth differences

export type ElevationSystem =
    | "flat"         // no shadows — pure colour separation
    | "material"     // layered drop-shadows, elevation Z
    | "neumorphic"   // extruded from surface, soft inset/outset
    | "claymorphic"  // rounded inflated 3D — thick coloured shadows
    | "brutalist"    // hard offset box-shadows, no blur
    | "glow"         // emissive halo — backlit / neon
    | "embossed"     // pressed-in relief — paper / stamped
    | "frosted";     // backdrop-filter blur depth cue

export type DepthCue = 
    | "blur"              // Distance blur (bokeh effect)
    | "scale"             // Smaller = further
    | "opacity"           // More transparent = further
    | "saturation"        // Less saturated = further
    | "contrast"          // Lower contrast = further
    | "lightness"         // Darker/lighter = further
    | "color_temp"        // Cooler = further
    | "detail"            // Less detail = further (LOD)
    | "motion"            // Parallax speed differences
    | "shadow"            // Softer/lighter shadows = further
    | "overlap"           // What covers what
    | "atmospheric"       // Haze/fog with distance
    | "texture_scale"     // Texture gets smaller with distance
    | "none"              // No depth cues, flat
    | "combined"          // Multiple cues together
    | "psychological";    // Size/position conventions only

export type TextureSurface =
    | "flat"
    | "grain"        // film grain / noise overlay
    | "glass"        // frosted glass — backdrop-filter
    | "chrome"       // reflective metallic sheen
    | "matte_paper"  // uncoated paper — subtle tooth
    | "brushed_metal"// directional grain — aluminium
    | "velvet"       // soft nap — deep shadows, rich colour
    | "concrete"     // coarse aggregate — industrial
    | "canvas"       // woven textile — structured grain
    | "linen"        // tight weave — editorial/luxury
    | "wax"          // semi-transparent waxy sheen
    | "oxidized";    // patina / aged metal — verdigris / rust

export type OverlayBlend = "multiply" | "screen" | "overlay" | "color_dodge" | "color_burn" | "hard_light" | "soft_light" | "difference" | "none";

export type AtmosphereFX =
    | "glassmorphism"         // frosted glass backdrop-filter
    | "crt_noise"             // scanlines + fractal noise
    | "fluid_mesh"            // animated conic gradient mesh
    | "aurora"                // borealis-style animated gradient
    | "noise_gradient"        // static perlin noise gradient
    | "holographic"           // iridescent rainbow sheen
    | "scanlines"             // horizontal rule overlay — retro
    | "pixel_dither"          // ordered dithering pattern
    | "ink_wash"              // watercolour bleed at edges
    | "chromatic_aberration"  // RGB channel split / fringe
    | "depth_of_field"        // foreground blur — lens feel
    | "banding"               // posterised colour steps — lo-fi
    | "none";

export type AtmosphereCoverage = 
    | "full"           // Every surface has atmospheric effects
    | "section"        // One full-bleed atmospheric zone per section
    | "element"        // Only specific elements have atmosphere
    | "gradient_mesh"  // Multi-point gradient overlays
    | "noise_field"    // Procedural noise texture overlays
    | "particles"      // Floating particle systems
    | "fog"            // Depth-based fog layers
    | "glow"           // Bloom/glow post-processing
    | "caustics"       // Light refraction patterns
    | "volumetric"     // 3D volumetric light shafts
    | "aurora"         // Flowing color shifts
    | "holographic";   // Iridescent interference patterns
export type PerformanceBudget = 
    | "ultra"             // 60fps guaranteed, minimal effects
    | "high"              // 60fps target, some effects
    | "medium"            // 30fps acceptable, moderate effects
    | "low"               // Functional over performant
    | "unlimited"         // Desktop-only, max effects
    | "adaptive"          // Scale based on device capability
    | "progressive"       // Enhance from baseline
    | "deferred"          // Load heavy effects after interaction
    | "lazy"              // Only load when visible
    | "static"            // No animation, max quality
    | "motion_only"       // Animate only, no other effects
    | "essential"         // Only critical effects
    | "experimental"      // Push boundaries, may drop frames
    | "measured"          // Instrument and optimize live
    | "greedy"            // Use all available resources
    | "sustainable";      // Long-term energy efficient
export type PhysicsMaterial = 
    | "neumorphism"       // Soft extruded plastic
    | "metallic"          // Reflective metal
    | "glass"             // Transparent refractive
    | "matte"             // Non-reflective diffuse
    | "chrome"            // Mirror-like reflection
    | "brushed"           // Directional metal grain
    | "iridescent"        // Color-shifting surface
    | "pearlescent"       // Soft color shimmer
    | "holographic"       // Rainbow diffraction
    | "velvet"            // Soft light absorption
    | "satin"             // Low sheen, soft reflection
    | "gloss"             // High shine plastic
    | "rubber"            // Matte, slightly textured
    | "ceramic"           // Smooth, slight gloss
    | "wood"              // Natural grain texture
    | "stone";            // Rough, porous surface
export type BiomarkerGeometry = 
    | "monolithic"        // Single solid mass
    | "organic"           // Nature-inspired flowing forms
    | "fractal"           // Self-similar repeating patterns
    | "crystalline"       // Sharp geometric facets
    | "cellular"          // Cell-like structures
    | "fibrous"           // Thread/strand networks
    | "granular"          // Particle clusters
    | "lattice"           // Network of connected nodes
    | "shell"             // Curved hollow forms
    | "spiral"            // Helix or vortex shapes
    | "radial"            // Center-out patterns
    | "linear"            // Straight line arrays
    | "voronoi"           // Cell division patterns
    | "diffusion"         // Spread/reaction patterns
    | "erosion"           // Weathered/worn shapes
    | "growth";           // Branching expansion forms
export type BiomarkerShapeFamily = "geometric" | "biological" | "crystalline" | "fluid" | "architectural";

export type BiomarkerAnimStyle =
    | "rotate"       // continuous rotation
    | "breathe"      // scale pulse — in/out
    | "morph"        // path morphing between states
    | "static"       // no animation
    | "orbit"        // child elements orbit a centre
    | "pulse_ring"   // expanding ring echo
    | "liquid"       // fluid bezier deformation
    | "glitch_flicker" // random clip-path corruption
    | "unfold"       // sequential path draw-on reveal
    | "draw_on";     // SVG stroke-dashoffset trace

export type PolyCount = 
    | "wireframe"         // Lines only, no faces
    | "point_cloud"       // Vertices only
    | "ultra_low"         // < 100 polygons
    | "low"               // 100-500 polygons
    | "reduced"           // 500-1000 polygons
    | "optimized"         // 1000-3000 polygons
    | "medium"            // 3000-10000 polygons
    | "detailed"          // 10000-50000 polygons
    | "high"              // 50000-200000 polygons
    | "very_high"         // 200k-1M polygons
    | "ultra"             // 1M-10M polygons
    | "film"              // 10M+ polygons
    | "procedural"        // Infinite via algorithms
    | "subdiv"            // Catmull-Clark surfaces
    | "nurbs"             // Mathematical curves
    | "voxel";            // Volumetric pixels
export type ColorTreatment = "primary" | "complementary" | "monochrome" | "analogous" | "split_complementary";
export type ImageAspectRatio = 
    | "21:9"              // Ultrawide cinematic
    | "16:9"              // Standard widescreen
    | "16:10"             // Computer displays
    | "3:2"               // Classic photography
    | "4:3"               // Traditional TV
    | "1:1"               // Square
    | "5:4"               // Large format photo
    | "9:16"              // Vertical video
    | "4:5"               // Instagram portrait
    | "2:3"               // 35mm portrait
    | "3:4"               // iPad portrait
    | "3:5"               // Classic portrait
    | "1:2"               // Tall panorama
    | "1:3"               // Extreme vertical
    | "3:1"               // Extreme horizontal
    | "golden";           // 1.618:1 golden ratio

export type ColorGrading =
    | "natural"        // true-to-life, no grading
    | "desaturated"    // muted, editorial grey pull
    | "vibrant"        // boosted saturation + contrast
    | "duotone"        // two-colour tint map
    | "muted_earth"    // warm terracotta / sage palette
    | "cinematic"      // teal shadows + orange skin tones
    | "neon_pop"       // electric saturation — dark bg
    | "bleach_bypass"  // high contrast silver bleach look
    | "teal_orange"    // blockbuster grade — cool+warm split
    | "infrared"       // false-colour foliage red / sky dark
    | "cyanotype"      // prussian blue monochrome
    | "kodachrome";    // warm reds, rich greens, punchy shadows
export type AnimationTrigger = 
    | "page_load"         // When page loads
    | "scroll_enter"      // When element enters viewport
    | "scroll_exit"       // When element leaves viewport
    | "scroll_progress"   // Tied to scroll position (0-100%)
    | "hover"             // Mouse over
    | "hover_out"         // Mouse leave
    | "click"             // On click/tap
    | "double_click"      // On double click
    | "long_press"        // Hold for duration
    | "focus"             // Input focus
    | "blur"              // Input blur
    | "drag_start"        // Begin dragging
    | "drag_end"          // Release drag
    | "drop"              // Drop target hit
    | "voice_command"     // Speech recognition
    | "gesture";          // Swipe/pinch/rotate
export type CounterFormat = 
    | "raw"               // 1234567
    | "full"              // 1,234,567
    | "abbreviated_k"     // 1.2M
    | "abbreviated_m"     // 1.2M
    | "percentage"        // 12%
    | "basis_points"      // 0.12%
    | "ratio"             // 1:4
    | "scientific"        // 1.2e6
    | "hex"               // 0x12D687
    | "binary"            // 0b10010110
    | "octal"             // 0o1234567
    | "roman"             // CXXIV
    | "spelled"           // one million
    | "metric_prefix"     // 1.2 mega
    | "compact"           // 1.2M (locale aware)
    | "accounting";       // (1,234,567) for negatives
export type TrustAnimationType = 
    | "none"              // Static display
    | "fade_in"           // Opacity transition
    | "count_up"          // Number increment animation
    | "count_down"        // Number decrement animation
    | "typewriter"        // Character reveal
    | "scramble"          // Text decode effect
    | "slide_in"          // Translate from offscreen
    | "scale_pop"         // Grow from zero
    | "stagger_reveal"    // Sequential element reveal
    | "checkmark_draw"    // SVG stroke draw
    | "stamp"             // Impact/authority effect
    | "badge_shine"       // Metallic shimmer
    | "pulse_glow"        // Rhythmic glow
    | "counter_flip"      // Airport display style
    | "roll_in"           // 3D tumble
    | "elastic_snap";     // Bounce settle effect
export type SocialDisplayStyle = 
    | "logos_only"        // Just company logos
    | "logos_with_name"   // Logo + company name
    | "logos_with_quote"  // Logo + brief quote
    | "full_testimonial"  // Photo + name + role + quote
    | "video_testimonial" // Video embed format
    | "audio_testimonial" // Audio player format
    | "stats_only"        // Numbers/metrics
    | "awards_badges"     // Certification badges
    | "press_mentions"    // Publication logos + quotes
    | "tweet_embed"       // Social media embeds
    | "case_study_cards"  // Success story summaries
    | "trust_score"       // Aggregate rating display
    | "marquee"           // Scrolling ticker
    | "carousel"          // Rotating display
    | "masonry"           // Pinterest-style grid
    | "comparison_table"; // Side-by-side metrics
export type SocialUpdateFreq = 
    | "static"            // Never updates
    | "manual"            // On user action
    | "hourly"            // Every hour
    | "daily"             // Once per day
    | "weekly"            // Once per week
    | "event_driven"      // On specific events
    | "session_based"     // Per visit/session
    | "realtime"          // Live streaming updates
    | "polling"           // Periodic API checks
    | "push"              // Server-sent events
    | "webhook"           // External trigger
    | "cache_first"       // Show cache, update async
    | "optimistic"        // Update UI immediately
    | "lazy"              // Update when visible
    | "stale_while_revalidate" // Show old, fetch new
    | "batch";            // Queue and update together
export type HeroHeight = 
    | "viewport"          // 100vh, full screen takeover
    | "cinema"            // 75vh, cinematic wide
    | "theater"           // 66vh, presentation style
    | "large"             // 50vh, dominant but partial
    | "medium"            // 40vh, balanced presence
    | "compact"           // 30vh, minimal intrusion
    | "micro"             // 20vh, banner-like
    | "peek"              // 15vh, teases content below
    | "dynamic"           // Scales with content
    | "parallax"          // Larger for scroll effect
    | "vh_90"             // 90vh
    | "vh_80"             // 80vh
    | "vh_60"             // 60vh
    | "aspect_16_9"       // Fixed 16:9 ratio
    | "aspect_21_9"       // Fixed 21:9 ratio
    | "auto";             // Height from content
export type HeroBgTreatment = 
    | "solid"             // Flat color
    | "gradient"          // Linear/radial gradient
    | "animated_gradient" // Shifting color gradient
    | "image"             // Static photograph
    | "image_parallax"    // Moving on scroll
    | "image_ken_burns"   // Slow zoom/pan
    | "video"             // Background video
    | "video_loop"        // Seamless looping
    | "mesh"              // Gradient mesh
    | "shader"            // WebGL procedural
    | "particles"         // Moving particle field
    | "pattern"           // Repeating pattern
    | "texture"           // Noise/grain overlay
    | "blur"              // Frosted glass effect
    | "duotone"           // Two-color treatment
    | "monochrome";       // Grayscale treatment
export type HeroMobileBehavior = 
    | "stack"             // Vertical reflow
    | "collapse_image"    // Hide image, keep text
    | "collapse_text"     // Hide text, keep image
    | "full_bleed"        // Edge-to-edge image
    | "overlay"           // Text over image
    | "swap_orientation"  // Change layout direction
    | "reduce_height"     // Shorter on mobile
    | "hide"              // Remove entirely
    | "carousel"          // Swipeable slides
    | "accordion"         // Collapsible sections
    | "tabbed"            // Switchable tabs
    | "modal_trigger"     // Tap to expand
    | "video_thumbnail"   // Play button overlay
    | "parallax_disabled" // Flat on mobile
    | "text_only"         // Simplify to copy only
    | "image_only";       // Simplify to visual only

// ============================================================================
// DESIGN PERSONALITY — flair axis independent of content traits
// ============================================================================

/**
 * DesignPersonality is a hash-derived chromosome (ch_expressiveness) that
 * controls how bold/expressive the design is, independent of ContentTraits.
 *
 * clinical    → ultra-restrained, no ornamentation, all defaults
 * corporate   → conservative, trustworthy, sector convention
 * balanced    → sector default personality — medium flair
 * bold        → confident statements, strong contrast, punchy motion
 * expressive  → opinionated, unconventional, high flair
 * disruptive  → breaks conventions, brutalist, glitch, maximum flair
 *
 * Each sector defines which personalities are permitted via sector-profiles.ts.
 */
export type DesignPersonality =
    | "clinical"     // 0.00–0.15 expressiveness
    | "corporate"    // 0.15–0.35
    | "balanced"     // 0.35–0.55
    | "bold"         // 0.55–0.75
    | "expressive"   // 0.75–0.90
    | "disruptive";  // 0.90–1.00

// ============================================================================
// CIVILIZATION CHROMOSOME VALUE RANGES (ch30–ch32)
// Latent in genome always; only expressed when complexity >= 0.81 (tribal+)
// ============================================================================

/** How application state is owned and shared across surfaces */
export type StateTopology =
    | "local"           // Component-level only (useState / useReducer)
    | "shared_context"  // Lifted to React Context — single surface
    | "reactive_store"  // External store (Zustand/Redux) — single app
    | "distributed"     // Cross-tab / server-synced state — multi-surface
    | "federated";      // Cross-app shared state (micro-frontend federation)

/** How the application handles URL routing */
export type RoutingPattern =
    // Tier 1: Simple/Static (< 0.34)
    | "single_page"           // One HTML file, scroll navigation
    | "hash_anchor"           // URL hash controls scroll position
    | "hash_state"            // URL hash controls view state
    | "query_param"           // Query params control state
    
    // Tier 2: Component-Level (0.34–0.56)
    | "tab_panel"             // Tabbed interface as primary navigation
    | "accordion_stack"       // Accordion sections as "pages"
    | "carousel_slide"        // Slide-based navigation (/#slide-1)
    
    // Tier 3: SPA Patterns (0.57–0.80)
    | "multi_page"            // Separate HTML files
    | "spa_history"           // History API, clean URLs
    | "modal_overlay"         // Routes as modals over current view
    | "wizard_step"           // Sequential step flow
    | "nested"                // Parent/child routes
    | "sidebar_drawer"        // Persistent sidebar + drawer navigation
    | "breadcrumb_trail"      // Deep hierarchies with breadcrumbs
    
    // Tier 4: Civilization/Enterprise (≥ 0.81)
    | "protected"             // Auth guards on routes
    | "role_based"            // Route access by user roles (admin, editor, viewer)
    | "permission_matrix"     // Granular permissions per route/action
    | "dynamic_route"         // Routes generated from CMS/data
    | "i18n_locale"           // Locale-prefixed routes (/en/about, /fr/about)
    | "subdomain"             // Tenant routing via subdomain (tenant.app.com)
    | "path_tenant"           // Tenant routing via path (/tenant/dashboard)
    | "platform"              // Shell + lazy-loaded remotes
    | "federated"             // Module Federation cross-app
    | "micro_frontend"        // Independent deployable frontend fragments
    | "edge_routing"          // Edge-computed routing (Cloudflare Workers, etc)
    | "ai_adaptive"           // Routes adapt based on user behavior/ML
    | "session_replay"        // Full session state in URL for sharing/replay
    | "realtime_sync"         // Routes sync across clients in real-time
    | "blockchain_verified"   // Route access verified via on-chain state
    | "zero_knowledge"        // Privacy-preserving route authorization
    | "quantum_resistant";    // Post-quantum cryptographic route protection

/** How design tokens are layered and inherited */
export type TokenInheritance =
    | "flat"          // One global :root — all tokens at same level
    | "semantic"      // Global + semantic layer (light/dark modes)
    | "component"     // Global + semantic + component-scoped overrides
    | "governed"      // Global + semantic + component + brand governance layer
    | "cross_system"; // All layers + cross-app token contract (design system)

// ============================================================================
// MAIN DESIGN GENOME INTERFACE
// ============================================================================

export interface DesignGenome {
    dnaHash: string;
    traits: ContentTraits;

    // Sector Context
    sectorContext: {
        primary: PrimarySector;
        secondary: SecondarySector;
        subSector: SubSector;
    };

    chromosomes: {
        // Sector Chromosomes (0.x)
        ch0_sector_primary: {
            sector: PrimarySector;
            influence: number;  // 0.0 - 1.0
        };
        ch0_sector_secondary: {
            sector: SecondarySector;
            influence: number;  // 0.0 - 1.0
        };
        ch0_sub_sector: {
            classification: SubSector;
            confidence: number;
            keywords: string[];  // Keywords that triggered this classification
        };
        ch0_brand_weight: {
            brandVsSector: number;  // 0.0 = sector dominant, 1.0 = brand dominant
            appliedOverrides: string[];  // Which brand values were applied
        };

        // Original Chromosomes (1-18)
        ch1_structure: {
            hasSections: boolean;            // ← SHA-256 derived: does this design have sections?
            sectionCount: number;            // ← SHA-256 derived: how many (only if hasSections)
            topology: Topology;
            maxNesting: number;
            scrollBehavior: ScrollBehavior;
            breakpointStrategy: BreakpointStrategy;
            contentFlow: ContentFlow;
        };
        ch2_rhythm: {
            density: RhythmDensity;
            baseSpacing: number;
            sectionSpacing: number;        // between sections
            componentSpacing: number;      // within component element gap
            verticalRhythm: 4 | 8 | 12;   // base grid unit px
            negativeSpaceRatio: number;    // 0.0-1.0 empty-to-content
        };
        ch3_type_display: {
            family: string;
            displayName: string;
            importUrl: string;
            provider: FontProvider;
            charge: TypeCharge;
            weight: number;
            fallback: string;              // fallback font stack
            tracking: TypeTracking;
            casing: TypeCasing;
        };
        ch4_type_body: {
            family: string;
            displayName: string;
            importUrl: string;
            provider: FontProvider;
            charge: TypeCharge;
            xHeightRatio: number;
            contrast: number;
            fallback: string;
            optimalLineLength: "narrow" | "medium" | "wide";
            paragraphSpacing: number;      // multiplier of line-height
            hyphenation: boolean;
        };
        // Accent font — only populated when fontCount === 3
        ch3_type_accent: {
            family: string;
            displayName: string;
            importUrl: string;
            provider: FontProvider;
            charge: TypeCharge;
            weight: number;
            fallback: string;
            role: "numbers" | "labels" | "code" | "pull_quote" | "small_caps";
        } | null;
        ch5_color_primary: {
            hue: number;
            saturation: number;
            lightness: number;
            /** Lifted lightness (0.58–0.74) for interactive elements on dark surfaces */
            darkModeLightness: number;
            temperature: ColorTemp;
            hex: string;  // computed hex — use for light mode surfaces
            /** Hex at darkModeLightness — use for buttons/links on dark backgrounds */
            darkModeHex: string;
            sectorAppropriate: boolean;  // flag if brand override
        };
        ch6_color_temp: {
            backgroundTemp: ColorTemp;
            contrastRatio: number;
            surfaceColor: string;          // base surface
            elevatedSurface: string;       // raised surface
            isDark: boolean;               // pre-computed for CSS generators
            accentColor: string;           // computed +30° complementary hex
            surfaceStack: string[];        // [base, raised, overlay, modal]
        };
        ch26_color_system: {
            // Primary already in ch5 - this is the COMPLETE system
            secondary: {
                hue: number;               // hash-derived offset from primary (±30-60°)
                saturation: number;
                lightness: number;
                hex: string;
                relationship: "complementary" | "analogous" | "split" | "triadic";
            };
            accent: {
                hue: number;               // hash-derived (triadic or tetradic)
                saturation: number;
                lightness: number;
                hex: string;
                usage: "cta" | "highlight" | "alert" | "success";
            };
            semantic: {
                success: { hue: number; hex: string; };   // sector-biased green
                warning: { hue: number; hex: string; };   // sector-biased yellow/orange
                error: { hue: number; hex: string; };     // sector-biased red
                info: { hue: number; hex: string; };      // sector-biased blue
            };
            neutral: {
                scale: string[];           // 9-step gray with primary tint
                tintStrength: number;      // how much primary hue bleeds into neutrals
            };
            darkMode: {
                surfaceStack: string[];    // dark mode surfaces
                elevationMap: number[];    // lightness boosts per elevation level
            };
            // Palette engine extensions
            harmonyRule: HarmonyRule;      // how the full palette was constructed
            palette: ColorPalette;         // full 5-7 color OKLCH palette
            fontCount: 1 | 2 | 3;          // how many distinct fonts this genome uses
            fontStrategy: FontStrategy;    // which combination strategy
        };
        ch7_edge: {
            radius: number;                // container/section radius
            style: EdgeStyle;
            variableRadius: boolean;       // organic variable radius
            componentRadius: number;       // buttons, inputs, badges
            imageRadius: number;           // image/card crop radius
            asymmetric: boolean;           // use asymmetric corner radii
        };
        ch8_motion: {
            physics: MotionPhysics;
            durationScale: number;
            staggerDelay: number;          // sequential animation delay
            enterDirection: EnterDirection;
            exitBehavior: ExitBehavior;
            hoverIntensity: number;        // 0.0-1.0
            reducedMotionFallback: "fade" | "none";
        };
        ch27_motion_choreography: {
            entrySequence: "hero_first" | "cascade_down" | "cascade_up" | "simultaneous" | "stagger_center";
            staggerInterval: number;        // ms between elements (20-150ms)
            scrollTrigger: {
                triggerPoint: number;       // % of viewport (0.1-0.9)
                scrubIntensity: number;     // 0 = snap, 1 = smooth scrub
            };
            hoverMicrointeraction: {
                type: "scale" | "color_shift" | "shadow" | "lift" | "glow";
                intensity: number;          // 0.0-1.0
                duration: number;           // ms
            };
            pageTransition: "fade" | "slide" | "morph" | "wipe" | "dissolve";
            choreographyStyle: "elegant" | "energetic" | "smooth" | "snappy" | "dramatic";
        };
        ch9_grid: {
            logic: GridLogic;
            asymmetry: number;
            columns: number;               // desktop column count
            gap: number;                   // grid gap px
            mobileColumns: 1 | 2;
            alignment: GridAlignment;
        };
        ch10_hierarchy: {
            depth: HierarchyDepth;
            zIndexBehavior: string;
            layerBlur: number;             // depth-based blur
            elevationSystem: ElevationSystem;
            shadowScale: number;           // 0.0-1.0
            depthCues: DepthCue;
        };
        ch11_texture: {
            surface: TextureSurface;
            noiseLevel: number;            // 0.0-0.5 grain amount
            grainFrequency: number;        // 0.0-1.0 fine to coarse
            overlayBlend: OverlayBlend;    // blend mode for grain layer
            animatedTexture: boolean;      // subtle grain animation
        };
        ch12_signature: {
            entropy: number;
            uniqueMutation: string;
            variantSeed: number;  // for hero/layout variants
            designPhilosophy: DesignPhilosophy;   // derived from chromosome combination
            depthPhilosophy: DepthPhilosophy;      // derived from ch10/ch11/ch13/philosophy
        };
        ch28_iconography: {
            style: "outline" | "filled" | "duotone" | "rounded" | "sharp";
            strokeWeight: "thin" | "regular" | "bold" | "variable";
            cornerTreatment: "sharp" | "rounded" | "pill";
            sizeScale: number;             // ratio to body text (0.8-1.5)
            library: "lucide" | "phosphor" | "heroicons" | "feather" | "radix";
            colorTreatment: "inherit" | "primary" | "secondary" | "muted";
            animation: "none" | "bounce" | "pulse" | "spin" | "draw";
        };
        ch13_atmosphere: {
            fx: AtmosphereFX;
            intensity: number;
            enabled: boolean;              // can be disabled
            coverage: AtmosphereCoverage;
            performanceBudget: PerformanceBudget;
        };
        ch14_physics: {
            material: PhysicsMaterial;
            roughness: number;
            metalness: number;             // PBR metalness 0.0-1.0
            transmission: number;
            emissive: boolean;             // glowing material
            enabled: boolean;              // can be disabled
        };
        ch15_biomarker: {
            geometry: BiomarkerGeometry;
            shapeFamily: BiomarkerShapeFamily;
            animationStyle: BiomarkerAnimStyle;
            polycount: PolyCount;
            colorTreatment: ColorTreatment;
            complexity: number;
            enabled: boolean;              // can be disabled
            usage: "hero" | "decorative" | "none";
        };
        ch16_typography: TypographyScale;
        ch17_accessibility: AccessibilityProfile;
        ch18_rendering: RenderingStrategy;

        // Hero & Visual Chromosomes (19-20)
        ch19_hero_type: {
            hasHero: boolean;                // ← SHA-256 derived: does this design have a hero?
            type: HeroType;                  // ← SHA-256 derived: which type (only if hasHero)
            variant: HeroLayoutVariant;
            variantIndex: number;            // Hash-derived variant selection
            contentSource?: string;          // Path to screenshot/video
        };
        ch19_hero_variant_detail: {
            layout: HeroLayoutVariant;
            elements: string[];            // what elements to include
            alignment: "left" | "center" | "right";
            textPosition: "overlay" | "adjacent" | "below";
            height: HeroHeight;
            backgroundTreatment: HeroBgTreatment;
            overlayOpacity: number;        // 0.0-1.0 for image heroes
            mobileBehavior: HeroMobileBehavior;
        };
        ch20_visual_treatment: {
            treatment: VisualTreatment;
            videoStrategy: VideoStrategy;
            imageTreatment: "natural" | "high_contrast" | "warm" | "cool" | "monochrome";
            hasVideo: boolean;
            imageAspectRatio: ImageAspectRatio;
            colorGrading: ColorGrading;
            imageCount: 1 | 3 | 5 | "many";
        };

        // Trust & Social Chromosomes (21-22)
        ch21_trust_signals: {
            hasTrustSignals: boolean;        // ← SHA-256 derived: does this design have trust signals?
            approach: TrustApproach;         // ← SHA-256 derived: which approach (only if hasTrustSignals)
            prominence: TrustProminence;
            layoutVariant: string;
            contentProvided: boolean;
            suggestedStats?: string[];
            animationType: TrustAnimationType;
        };
        ch21_trust_content: {
            credentials?: string[];
            testimonials?: string[];
            stats?: { label: string; value: string }[];
            securityBadges?: string[];
        };
        ch22_social_proof: {
            hasSocialProof: boolean;         // ← SHA-256 derived: does this design have social proof?
            type: SocialProofType;           // ← SHA-256 derived: which type (only if hasSocialProof)
            prominence: TrustProminence;
            layout: "grid" | "marquee" | "carousel" | "static";
            logoCount: 3 | 5 | 8 | "marquee";
            updateFrequency: SocialUpdateFreq;
            displayStyle: SocialDisplayStyle;
        };
        ch22_impact_demonstration: {
            type: ImpactDemonstration;
            realTime: boolean;
            interactive: boolean;
            animationTrigger: AnimationTrigger;
            counterFormat: CounterFormat;
        };

        // Content Structure Chromosomes (23-24)
        ch23_content_depth: {
            level: ContentDepth;
            estimatedSections: number;
            hasHero: boolean;
            hasFeatures: boolean;
            hasCTA: boolean;
            hasFAQ: boolean;
            hasTestimonials: boolean;
        };
        ch23_information_architecture: {
            pattern: InformationArchitecture;
            navigationType: "header" | "sidebar" | "floating" | "minimal";
            hasFooter: boolean;              // ← SHA-256 derived: does this design have a footer?
            footerType: "full" | "minimal"; // ← SHA-256 derived: which type (only if hasFooter)
        };
        ch24_personalization: {
            approach: PersonalizationApproach;
            dynamicContent: boolean;
            userSegmentation: boolean;
            abTestingReady: boolean;
            segmentCount: 2 | 3 | 4;
        };

        // Copy & Content Chromosomes (25)
        ch25_copy_engine: {
            headline: string;
            subheadline: string;
            cta: string;
            ctaSecondary: string;
            authorName: string;
            authorTitle: string;
            testimonial: string;
            companyName: string;
            tagline: string;
            sectionTitleTestimonials: string;
            sectionTitleFeatures: string;
            sectionTitleFAQ: string;
            stats: { label: string; value: string }[];
            faq: { question: string; answer: string }[];
            features: { title: string; description: string }[];
            footerProductTitle: string;
            footerCompanyTitle: string;
            footerNavProduct: string[];
            footerNavCompany: string[];
        };
        ch29_copy_intelligence: {
            industryTerminology: string[];
            emotionalRegister: "clinical" | "professional" | "conversational" | "playful" | "luxury" | "urgent";
            formalityLevel: number;
            ctaAggression: number;
            headlineStyle: "benefit_forward" | "curiosity_gap" | "social_proof" | "how_to" | "direct";
            vocabularyComplexity: "simple" | "moderate" | "technical" | "specialized";
            sentenceStructure: "short_punchy" | "balanced" | "complex_periodic";
            emojiUsage: boolean;
            contractionUsage: boolean;
        };

        // Civilization Chromosomes (30–32)
        // Always generated from hash; only read by CivilizationGenerator
        // when complexity >= 0.81 (tribal tier or above).
        ch30_state_topology: {
            topology: StateTopology;
            sharedSurfaces: number;  // 0–5: how many surfaces share state
        };
        ch31_routing_pattern: {
            pattern: RoutingPattern;
            guardedRoutes: number;   // 0–8: count of auth-protected routes
        };
        ch32_token_inheritance: {
            inheritance: TokenInheritance;
            themeLayers: number;     // 1–4: stacked theme depth
        };

        // ── Composition Chromosomes (33–34) ─────────────────────────────────
        // Algorithmic page structure selection from established library patterns.
        // NOT finite enums — these drive selection from structural-pattern-catalog.ts
        // which contains 30,000+ patterns from Relume, Tailwind UI, Magic UI,
        // Aceternity, NavNav, Mobbin, Refero, Pageflows, etc.

        ch33_composition_strategy: {
            /** Overall page structure approach — drives layout pattern selection */
            layoutPattern: LayoutPattern;
            /** How many sections this page has (2–14) */
            sectionCount: number;
            /** Which section categories are included */
            sectionTypes: StructuralCategory[];
            /** Navigation requirement — drives nav pattern selection */
            navRequirement: NavRequirement;
            /** Hero prominence — drives hero pattern selection */
            heroProminence: HeroProminence;
            /** How users interact with the page */
            interactionModel: InteractionModel;
            /** How content flows through the page */
            contentFlow: ContentFlowStrategy;
            /** How density distributes across the page */
            densityDistribution: DensityDistribution;
            /** How layout adapts on mobile */
            responsiveBehavior: ResponsiveStrategy;
        };

        ch34_component_topology: {
            /** Primary framework for component generation */
            primaryFramework: ComponentFramework;
            /** How many components per section (0.0–1.0) */
            componentDensity: number;
            /** Nesting depth (1–5 levels) */
            nestingDepth: number;
            /** How components are composed */
            compositionStyle: CompositionStyle;
            /** How many state boundaries exist */
            stateBoundaries: number;
            /** Complexity of component props */
            propComplexity: PropComplexity;
            /** Scope of animations within components */
            animationScope: AnimationScope;
        };
    };

    constraints: {
        forbiddenPatterns: string[];
        requiredPatterns: string[];
        bondingRules: string[];
        compensatorySignals: string[];  // signals added when brand conflicts with sector
    };

    viabilityScore: number;

    // Generation metadata
    generation: {
        timestamp: string;
        version: string;
        options: GenerationOptions;
        brand: BrandConfiguration | null;
        rationale: string[];  // Human-readable generation decisions
    };
}

// ============================================================================
// SECTOR PROFILE TYPE
// ============================================================================

export interface SectorColorProfile {
    primary: Record<string, number>;  // color name -> probability
    secondary: Record<string, number>;
    accent: Record<string, number>;
    minContrast: number;
    warmthBias: number;  // -1.0 (cool) to 1.0 (warm)
}

export interface SectorProfile {
    sector: PrimarySector;
    colorProfile: SectorColorProfile;
    heroTypeWeights: Record<HeroType, number>;
    trustApproachWeights: Record<TrustApproach, number>;
    defaultTypography: TypeCharge;
    motionPreference: MotionPhysics;
    edgePreference: EdgeStyle;
    recommendedTrustProminence: TrustProminence;
    generate3D: boolean;  // Whether 3D is ever appropriate
    contentDepth: ContentDepth;
    subSectorKeywords: Record<string, string[]>;  // sub-sector -> keywords
}

// ============================================================================
// TRUST SIGNAL CONFIGURATION
// ============================================================================

export interface TrustSignalConfig {
    type: TrustApproach;
    layout: string;
    elements: {
        credentials?: {
            icon: string;
            label: string;
        }[];
        stats?: {
            value: string;
            label: string;
            suffix?: string;
        }[];
        testimonials?: {
            quote: string;
            author: string;
            role: string;
        }[];
    };
    style: {
        background: string;
        border: string;
        spacing: string;
    };
}

// ============================================================================
// HERO CONFIGURATION
// ============================================================================

export interface HeroConfig {
    type: HeroType;
    variant: string;
    layout: HeroLayoutVariant;
    content?: {
        headline?: string;
        subheadline?: string;
        cta?: { primary: string; secondary?: string };
        visual?: string;  // Path or reference
    };
    style: {
        height: "full" | "large" | "medium" | "small";
        textAlignment: "left" | "center" | "right";
        textPosition: "overlay" | "adjacent";
        backgroundTreatment: "solid" | "gradient" | "image" | "video";
    };
}
