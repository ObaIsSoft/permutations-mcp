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
    | "technology";

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
    | "illustration";         // Custom illustrations

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
        textureProfile: "smooth" | "grainy" | "high_contrast";
        imageAspectRatios: ("landscape" | "portrait" | "square")[];
        visualDensity: "sparse" | "medium" | "dense";
    };
    textMarkers: {
        averageWordLength: number;
        textVolume: "minimal" | "medium" | "extensive";
        hierarchyDepth: number;
        contentTone: "technical" | "narrative" | "commercial";
        scanVsReadRatio: number;
        keywords: string[];           // Extracted key terms
        entities: string[];           // Named entities (org, product)
    };
    structuralMarkers: {
        contentType: "high_frequency_data" | "long_form" | "portfolio" | "commerce" | "dashboard";
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
    fontProvider?: FontProvider;         // "bunny" | "google" (default: "bunny")
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
        faq: { question: string; answer: string }[];
    };
}

// ============================================================================
// CHROMOSOME VALUE RANGES
// ============================================================================

export type Topology = "flat" | "deep" | "graph" | "radial";
export type ScrollBehavior = "paginated" | "continuous" | "snap";
export type BreakpointStrategy = "mobile_first" | "desktop_first" | "fluid";
export type ContentFlow = "reading_order" | "z_pattern" | "f_pattern";
export type RhythmDensity = "airtight" | "breathing" | "maximal" | "empty";
export type TypeCharge = "geometric" | "humanist" | "monospace" | "transitional" | "grotesque" | "slab_serif" | "expressive";
export type FontProvider = "bunny" | "google";
export type TypeTracking = "tight" | "normal" | "wide" | "ultra";
export type TypeCasing = "normal" | "uppercase" | "small_caps";
export type ColorTemp = "warm" | "cool" | "neutral";
export type EdgeStyle = "sharp" | "soft" | "organic" | "techno";
export type MotionPhysics = "none" | "spring" | "step" | "glitch";
export type EnterDirection = "up" | "down" | "left" | "right" | "scale" | "fade";
export type ExitBehavior = "fade" | "slide" | "none";
export type GridLogic = "column" | "masonry" | "radial" | "broken";
export type GridAlignment = "stretch" | "center" | "start";
export type HierarchyDepth = "flat" | "overlapping" | "3d-stack";
export type ElevationSystem = "flat" | "material" | "neumorphic";
export type DepthCue = "blur" | "scale" | "opacity" | "none";
export type TextureSurface = "flat" | "grain" | "glass" | "chrome";
export type OverlayBlend = "multiply" | "screen" | "overlay" | "none";
export type AtmosphereFX = "glassmorphism" | "crt_noise" | "fluid_mesh" | "none";
export type AtmosphereCoverage = "full" | "section" | "element";
export type PerformanceBudget = "high" | "medium" | "low";
export type PhysicsMaterial = "neumorphism" | "metallic" | "glass" | "matte";
export type BiomarkerGeometry = "monolithic" | "organic" | "fractal";
export type BiomarkerShapeFamily = "geometric" | "biological" | "crystalline" | "fluid" | "architectural";
export type BiomarkerAnimStyle = "rotate" | "breathe" | "morph" | "static";
export type PolyCount = "low" | "medium" | "high";
export type ColorTreatment = "primary" | "complementary" | "monochrome";
export type ImageAspectRatio = "16:9" | "4:3" | "1:1" | "portrait";
export type ColorGrading = "natural" | "desaturated" | "vibrant" | "duotone";
export type AnimationTrigger = "scroll_enter" | "page_load" | "hover";
export type CounterFormat = "abbreviated" | "full" | "percentage";
export type TrustAnimationType = "count_up" | "fade_in" | "none";
export type SocialDisplayStyle = "logos_only" | "logos_with_name" | "full_testimonial";
export type SocialUpdateFreq = "static" | "daily" | "realtime";
export type HeroHeight = "full" | "large" | "medium" | "compact";
export type HeroBgTreatment = "solid" | "image" | "video" | "mesh";
export type HeroMobileBehavior = "stack" | "collapse_image" | "full_bleed";

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
            temperature: ColorTemp;
            hex: string;  // computed hex
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
            authorName: string;
            authorTitle: string;
            testimonial: string;
            companyName: string;
            tagline: string;
            stats: { label: string; value: string }[];
            faq: { question: string; answer: string }[];
            features: { title: string; description: string }[];
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
