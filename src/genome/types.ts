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
}

// ============================================================================
// CHROMOSOME VALUE RANGES
// ============================================================================

export type Topology = "flat" | "deep" | "graph" | "radial";
export type RhythmDensity = "airtight" | "breathing" | "maximal" | "empty";
export type TypeCharge = "geometric" | "humanist" | "monospace" | "transitional";
export type ColorTemp = "warm" | "cool" | "neutral";
export type EdgeStyle = "sharp" | "soft" | "organic" | "techno";
export type MotionPhysics = "none" | "spring" | "step" | "glitch";
export type GridLogic = "column" | "masonry" | "radial" | "broken";
export type HierarchyDepth = "flat" | "overlapping" | "3d-stack";
export type TextureSurface = "flat" | "grain" | "glass" | "chrome";
export type AtmosphereFX = "glassmorphism" | "crt_noise" | "fluid_mesh" | "none";
export type PhysicsMaterial = "neumorphism" | "metallic" | "glass" | "matte";
export type BiomarkerGeometry = "monolithic" | "organic" | "fractal";

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
            sectionCount: number;  // estimated section count
        };
        ch2_rhythm: { 
            density: RhythmDensity; 
            baseSpacing: number;
            sectionSpacing: number;  // between sections
        };
        ch3_type_display: { 
            family: string; 
            charge: TypeCharge; 
            weight: number;
            fallback: string;  // fallback font stack
        };
        ch4_type_body: { 
            family: string; 
            xHeightRatio: number; 
            contrast: number;
            fallback: string;
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
            surfaceColor: string;  // computed surface
            elevatedSurface: string;  // computed elevated
        };
        ch7_edge: { 
            radius: number; 
            style: EdgeStyle;
            variableRadius: boolean;  // organic variable radius
        };
        ch8_motion: { 
            physics: MotionPhysics; 
            durationScale: number;
            staggerDelay: number;  // sequential animation delay
        };
        ch9_grid: { 
            logic: GridLogic; 
            asymmetry: number;
            columns: number;  // column count
            gap: number;  // grid gap
        };
        ch10_hierarchy: { 
            depth: HierarchyDepth; 
            zIndexBehavior: string;
            layerBlur: number;  // depth-based blur
        };
        ch11_texture: { 
            surface: TextureSurface; 
            noiseLevel: number;
            pattern: string | null;  // CSS pattern/texture
        };
        ch12_signature: { 
            entropy: number; 
            uniqueMutation: string;
            variantSeed: number;  // for hero/layout variants
        };
        ch13_atmosphere: { 
            fx: AtmosphereFX; 
            intensity: number;
            enabled: boolean;  // can be disabled
        };
        ch14_physics: { 
            material: PhysicsMaterial; 
            roughness: number; 
            transmission: number;
            enabled: boolean;  // can be disabled
        };
        ch15_biomarker: { 
            geometry: BiomarkerGeometry; 
            complexity: number;
            enabled: boolean;  // can be disabled
            usage: "hero" | "decorative" | "none";  // context of use
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
            elements: string[];  // What elements to include
            alignment: "left" | "center" | "right";
            textPosition: "overlay" | "adjacent" | "below";
        };
        ch20_visual_treatment: {
            treatment: VisualTreatment;
            videoStrategy: VideoStrategy;
            imageTreatment: "natural" | "high_contrast" | "warm" | "cool" | "monochrome";
            hasVideo: boolean;
        };
        
        // Trust & Social Chromosomes (21-22)
        ch21_trust_signals: {
            approach: TrustApproach;
            prominence: TrustProminence;
            layoutVariant: string;
            contentProvided: boolean;
            suggestedStats?: string[];
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
        };
        ch22_impact_demonstration: {
            type: ImpactDemonstration;
            realTime: boolean;
            interactive: boolean;
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
