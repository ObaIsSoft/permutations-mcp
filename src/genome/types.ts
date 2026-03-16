/**
 * Permutations MCP - Design Genome Types
 * 
 * Extended type system with sector awareness, content analysis,
 * hero types, trust signals, and brand integration.
 */

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
    | "product_ui"           // Live product screenshots (Linear, Figma)
    | "product_video"        // Product demonstration video (Shopify, Notion)
    | "brand_logo"           // Iconic brand mark only (Vercel)
    | "stats_counter"        // Live statistics display (Stripe GDP counter)
    | "search_discovery"     // Search-first interface (Zillow, Booking.com)
    | "content_carousel"     // Rotating showcase (Figma use cases)
    | "trust_authority"      // Credentials, awards, certifications
    | "service_showcase"     // Services, facilities, capabilities
    | "editorial_feature"    // Content-first, articles, stories
    | "configurator_3d"      // Interactive 3D product configurator
    | "aspirational_imagery" // Lifestyle, emotional imagery (fashion, travel)
    | "testimonial_focus";   // Customer stories, reviews

export type HeroLayoutVariant =
    | "centered"
    | "split_left"
    | "split_right"
    | "full_bleed"
    | "overlay"
    | "floating_cards"
    | "asymmetric"
    | "minimal";

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
    | "minimal"       // 2-3 sections
    | "moderate"      // 4-6 sections
    | "extensive"     // 7-10 sections
    | "comprehensive"; // 10+ sections

export type InformationArchitecture =
    | "funnel_linear"    // Sequential conversion flow
    | "hub_spoke"        // Central page with topic branches
    | "modular_sections" // Independent, scannable blocks
    | "narrative_scroll" // Story-driven, continuous
    | "data_dashboard";  // Dense, interactive data

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

export interface RenderingStrategy {
    primary: "webgl" | "css" | "static" | "svg";
    fallback: "css" | "static" | "none";
    animate: boolean;
    complexity: "minimal" | "balanced" | "rich";
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

export type Topology = "flat" | "deep" | "graph" | "radial" | "bento" | "editorial";
export type ScrollBehavior = "paginated" | "continuous" | "snap";
export type BreakpointStrategy = "mobile_first" | "desktop_first" | "fluid";
export type ContentFlow = "reading_order" | "z_pattern" | "f_pattern";
export type RhythmDensity = "airtight" | "breathing" | "maximal" | "empty";
export type TypeCharge = "geometric" | "humanist" | "monospace" | "transitional" | "grotesque" | "slab_serif" | "expressive";
export type FontProvider = "bunny" | "google" | "fontshare" | "none";
export type TypeTracking = "tight" | "normal" | "wide" | "ultra";
export type TypeCasing = "normal" | "uppercase" | "small_caps";
export type ColorTemp = "warm" | "cool" | "neutral";
export type EdgeStyle =
    | "sharp"        // precise corners, no rounding
    | "soft"         // gentle rounded corners
    | "organic"      // freely curved, no geometric rigidity
    | "techno"       // modular, grid-aligned, digital-mechanical
    | "brutalist"    // raw, heavy, unrefined
    | "serrated"     // jagged / notched edges
    | "hand_drawn"   // irregular, imperfect, sketch-like
    | "chiseled";    // faceted, angular cuts — jewellery/luxury

export type MotionPhysics =
    | "none"         // static — no animation
    | "spring"       // mass-spring-damper system — natural bounce
    | "step"         // discrete state jumps — mechanical precision
    | "glitch"       // corrupted signal — digital artefact
    | "magnetic"     // attraction/repulsion — elements pull toward cursor
    | "inertia"      // momentum-based — elements coast after release
    | "elastic"      // overshoot and snap back — rubber-band feel
    | "particle";    // stochastic — probabilistic swarm behaviour

export type EnterDirection =
    | "up" | "down" | "left" | "right"
    | "scale"        // grow from zero
    | "fade"         // opacity only
    | "radial_in"    // expand from center point
    | "flip_x"       // rotate on X axis (card flip)
    | "flip_y"       // rotate on Y axis
    | "spiral"       // arc + scale combined
    | "bounce";      // enter with elastic overshoot

export type ExitBehavior =
    | "fade"
    | "slide"
    | "none"
    | "shrink"       // collapse to zero scale
    | "explode"      // burst outward + fade
    | "rotate_out"   // spin out
    | "morph_out";   // shape-morph into next element

export type GridLogic = "column" | "masonry" | "radial" | "broken" | "bento" | "editorial";
export type GridAlignment = "stretch" | "center" | "start";
export type HierarchyDepth = "flat" | "overlapping" | "3d-stack";

export type ElevationSystem =
    | "flat"         // no shadows — pure colour separation
    | "material"     // layered drop-shadows, elevation Z
    | "neumorphic"   // extruded from surface, soft inset/outset
    | "claymorphic"  // rounded inflated 3D — thick coloured shadows
    | "brutalist"    // hard offset box-shadows, no blur
    | "glow"         // emissive halo — backlit / neon
    | "embossed"     // pressed-in relief — paper / stamped
    | "frosted";     // backdrop-filter blur depth cue

export type DepthCue = "blur" | "scale" | "opacity" | "none";

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

export type AtmosphereCoverage = "full" | "section" | "element";
export type PerformanceBudget = "high" | "medium" | "low";
export type PhysicsMaterial = "neumorphism" | "metallic" | "glass" | "matte";
export type BiomarkerGeometry = "monolithic" | "organic" | "fractal";
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

export type PolyCount = "low" | "medium" | "high";
export type ColorTreatment = "primary" | "complementary" | "monochrome" | "analogous" | "split_complementary";
export type ImageAspectRatio = "16:9" | "4:3" | "1:1" | "portrait";

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
export type AnimationTrigger = "scroll_enter" | "page_load" | "hover";
export type CounterFormat = "abbreviated" | "full" | "percentage";
export type TrustAnimationType = "count_up" | "fade_in" | "none";
export type SocialDisplayStyle = "logos_only" | "logos_with_name" | "full_testimonial";
export type SocialUpdateFreq = "static" | "daily" | "realtime";
export type HeroHeight = "full" | "large" | "medium" | "compact";
export type HeroBgTreatment = "solid" | "image" | "video" | "mesh";
export type HeroMobileBehavior = "stack" | "collapse_image" | "full_bleed";

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
    | "single_page"   // No router — single route, hash state only
    | "multi_page"    // React Router — multiple pages, public routes only
    | "protected"     // React Router — auth guards on restricted routes
    | "platform"      // Shell + lazy-loaded feature remotes
    | "federated";    // Module Federation — cross-app navigation

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
            topology: Topology;
            maxNesting: number;
            sectionCount: number;          // estimated section count
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
            type: HeroType;
            variant: HeroLayoutVariant;
            variantIndex: number;  // Hash-derived variant selection
            contentSource?: string;  // Path to screenshot/video
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
            approach: TrustApproach;
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
            type: SocialProofType;
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
            footerType: "full" | "minimal" | "none";
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
