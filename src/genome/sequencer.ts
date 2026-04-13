/**
 * Genome MCP - Sequencer
 * 
 * Enhanced sequencer with sector awareness, content analysis,
 * hero type selection, and brand integration.
 */

import * as crypto from "crypto";
import {
    ContentTraits,
    DesignGenome,
    PrimarySector,
    SecondarySector,
    SubSector,
    HeroType,
    StarType,
    DesignPhilosophy,
    DepthPhilosophy,
    VariationSequence,
    RhythmPattern,
    HeroLayoutVariant,
    TrustApproach,
    TypeCharge,
    TypeTracking,
    MotionPhysics,
    EdgeStyle,
    VisualTreatment,
    VideoStrategy,
    ContentDepth,
    InformationArchitecture,
    PersonalizationApproach,
    BrandConfiguration,
    GenerationOptions,
    TypographyScale,
    AccessibilityProfile,
    RenderingStrategy,
    RenderingPrimary,
    RenderingComplexity,
    TrustProminence,
    SocialProofType,
    ImpactDemonstration,
    HeroConfig,
    FontProvider,
    StateTopology,
    RoutingPattern,
    TokenInheritance,
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
} from "./types.js";
import { EpigeneticData } from "./epigenetics.js";
import { fontCatalog } from "../font-catalog.js";
import { ARCHETYPES, detectArchetype, FunctionalArchetype } from "./archetypes.js";
import { GenomeConstraintSolver, SolverResult } from "./constraint-solver.js";
import { solveWithSetTheory } from "./constraint-solver-v2.js";
import {
    getSectorProfile,
    isValidSector,
    generateHueFromForbidden,
    generateSaturationFromBias,
    generateLightnessFromBias,
    selectHeroType,
    selectTrustApproach,
    getColorBias,
    SUB_SECTOR_KEYWORDS
} from "./sector-profiles.js";
import { EntropyPool } from "./entropy-pool.js";
import { generatePalette } from "../color-palette-engine.js";
import { deriveFontCount, selectFontStrategy } from "../font-system-catalog.js";

export interface SequencerConfig {
    primarySector: PrimarySector;
    secondarySector?: SecondarySector;
    brand?: BrandConfiguration;
    options?: GenerationOptions;
}

// Copy Intelligence type alias for internal use
type CopyIntelligence = NonNullable<GenerationOptions["copyIntelligence"]>;

/**
 * Derive design philosophy from existing chromosome values.
 * No new chromosome — computed from the genome's existing signals.
 */
function deriveDesignPhilosophy(
    entropy: number,
    physics: string,
    edgeStyle: string,
    noiseLevel: number,
    primarySector: string
): DesignPhilosophy {
    // Sector influences
    const technicalSectors = ["technology", "fintech", "government"];
    const editorialSectors = ["media", "entertainment", "food", "travel"];
    const brandSectors = ["agency", "gaming", "beauty_fashion", "hospitality"];
    const conservativeSectors = ["healthcare", "legal", "insurance", "nonprofit"];

    // Physics determines base personality
    if (physics === "none" && entropy < 0.40) {
        if (conservativeSectors.includes(primarySector)) return "swiss_grid";
        return "minimalist";
    }
    if (physics === "glitch" || physics === "chaos") return "chaotic";

    // High entropy unlocks expressive/chaotic
    if (entropy > 0.80) return "chaotic";
    if (entropy > 0.60 && brandSectors.includes(primarySector)) return "expressive";
    if (entropy > 0.55) return "expressive";

    // Sector-driven philosophy
    if (technicalSectors.includes(primarySector)) {
        return entropy > 0.40 ? "technical" : "swiss_grid";
    }
    if (editorialSectors.includes(primarySector)) return "editorial";
    if (brandSectors.includes(primarySector)) return "brand_heavy";
    if (conservativeSectors.includes(primarySector)) {
        return entropy < 0.35 ? "minimalist" : "swiss_grid";
    }

    // Default by edge + noise
    if (edgeStyle === "sharp" && noiseLevel < 0.3) return "swiss_grid";
    if (noiseLevel > 0.5 && entropy > 0.45) return "editorial";
    if (entropy < 0.30) return "minimalist";

    return "brand_heavy"; // most common fallback
}

/**
 * Derive depth philosophy from existing chromosome values.
 */
function deriveDepthPhilosophy(
    philosophy: DesignPhilosophy,
    noiseLevel: number,
    depthCues: string,
    atmosphereEnabled: boolean,
    entropy: number
): DepthPhilosophy {
    if (philosophy === "minimalist" || philosophy === "swiss_grid") return "flat";
    if (philosophy === "chaotic" || (philosophy === "expressive" && entropy > 0.60)) return "immersive";

    const signals = [
        noiseLevel > 0.4 ? 1 : 0,
        atmosphereEnabled ? 1 : 0,
        depthCues !== "none" ? 1 : 0,
        entropy > 0.50 ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    if (signals >= 3) return "layered";
    if (signals >= 1) return "subtle";
    return "flat";
}

function deriveVariationSequence(
    philosophy: DesignPhilosophy,
    entropy: number,
    pool: EntropyPool,
    poolOffset: number
): VariationSequence {
    if (philosophy === "minimalist" || philosophy === "swiss_grid") return "minimal_voice";
    if (philosophy === "chaotic") return "mixed_chaos";
    if (philosophy === "editorial") return "editorial_flow";
    if (philosophy === "technical") return "app_story";
    if (philosophy === "brand_heavy") return entropy > 0.55 ? "brand_reveal" : "hero_build";
    if (philosophy === "expressive") return entropy > 0.65 ? "mixed_chaos" : "editorial_flow";
    // standard: entropy-gated
    const eligible: VariationSequence[] = entropy > 0.60
        ? ["hero_build", "editorial_flow", "mixed_chaos"]
        : ["hero_build", "app_story", "brand_reveal"];
    return eligible[Math.floor(pool.getFloat(poolOffset) * eligible.length)];
}

function deriveRhythmPattern(
    philosophy: DesignPhilosophy,
    entropy: number,
    pool: EntropyPool,
    poolOffset: number
): RhythmPattern {
    if (philosophy === "minimalist") return pool.getFloat(poolOffset) > 0.5 ? "spacing_scale" : "line_weight";
    if (philosophy === "swiss_grid") return pool.getFloat(poolOffset) > 0.5 ? "line_weight" : "typographic_rule";
    if (philosophy === "technical") return pool.getFloat(poolOffset) > 0.5 ? "line_weight" : "icon_system";
    if (philosophy === "brand_heavy") return pool.getFloat(poolOffset) > 0.4 ? "logo_echo" : "shape_motif";
    if (philosophy === "editorial") return pool.getFloat(poolOffset) > 0.5 ? "image_grid_echo" : "gradient_echo";
    if (philosophy === "chaotic") {
        const opts: RhythmPattern[] = ["shape_motif", "texture_repeat", "color_band", "gradient_echo"];
        return opts[Math.floor(pool.getFloat(poolOffset) * opts.length)];
    }
    // expressive / standard
    const opts: RhythmPattern[] = entropy > 0.55
        ? ["shape_motif", "color_band", "gradient_echo", "texture_repeat"]
        : ["color_band", "spacing_scale", "icon_system", "image_grid_echo"];
    return opts[Math.floor(pool.getFloat(poolOffset) * opts.length)];
}

function deriveStarType(
    philosophy: DesignPhilosophy,
    entropy: number,
    physics: string,
    hasVideo: boolean,
    pool: EntropyPool,
    poolOffset: number
): StarType {
    // Philosophies that don't use a star
    if (philosophy === "minimalist" || philosophy === "swiss_grid") return "none";

    // Low entropy → safe choices
    if (entropy < 0.25) return "none";
    if (entropy < 0.40) {
        const safe: StarType[] = ["oversized_phrase", "signature_image", "data_number"];
        return safe[Math.floor(pool.getFloat(poolOffset) * safe.length)];
    }

    // Build eligible list from philosophy + physics + entropy
    const eligible: StarType[] = [];

    if (philosophy !== "technical") eligible.push("oversized_phrase", "signature_image");
    if (physics !== "none") eligible.push("animated_gradient");
    if (physics !== "none" && physics !== "step") eligible.push("kinetic_type", "svg_mark");
    if (physics !== "none" && entropy > 0.55) eligible.push("noise_canvas");
    if (physics !== "none" && entropy > 0.60) eligible.push("3d_object");
    if (hasVideo) eligible.push("video_loop");
    if (entropy > 0.40) eligible.push("color_field", "grid_mosaic");
    if (philosophy === "brand_heavy" || philosophy === "expressive") eligible.push("logo_as_art");
    eligible.push("data_number");

    if (eligible.length === 0) return "none";
    return eligible[Math.floor(pool.getFloat(poolOffset) * eligible.length)];
}

export class GenomeSequencer {
    // FIX 2/3: EntropyPool for uniform selection and unlimited entropy
    private pool: EntropyPool | null = null;
    
    /**
     * Generate a design genome with full sector awareness
     */
    generate(
        seed: string,
        traits: ContentTraits,
        config: SequencerConfig,
        epigenetics?: EpigeneticData
    ): DesignGenome {
        const hash = crypto.createHash("sha256").update(seed).digest("hex");
        const bytes = Buffer.from(hash, 'hex');
        // FIX 3: Use EntropyPool for unlimited deterministic entropy (no more index % 32)
        this.pool = new EntropyPool(seed);
        const b = (index: number) => this.pool!.getFloat(index); // [0, 1) from expanded entropy

        const { primarySector, secondarySector, brand, options } = config;

        // Get sector profiles
        const primaryProfile = getSectorProfile(primarySector);
        const secondaryProfile = secondarySector ? getSectorProfile(secondarySector) : null;

        // Classify sub-sector from content
        const { subSector, confidence: subSectorConfidenceValue } = this.classifySubSectorFromTraits(
            traits,
            primarySector
        );

        // Determine weights (brand vs sector vs content)
        const brandWeight = options?.brandWeight ?? brand?.weight ?? 0.7;
        const sectorWeight = options?.sectorWeight ?? 0.5;

        // Generate chromosomes
        const chromosomes = this.generateChromosomes({
            seed,
            hash,
            bytes,
            b,
            traits,
            primaryProfile,
            secondaryProfile,
            subSector,
            subSectorConfidence: subSectorConfidenceValue,
            brand,
            brandWeight,
            sectorWeight,
            epigenetics,
            options
        });

        // Build genome
        const genome: DesignGenome = {
            dnaHash: hash,
            traits,
            sectorContext: {
                primary: primarySector,
                secondary: secondarySector || null,
                subSector
            },
            chromosomes,
            constraints: {
                forbiddenPatterns: [],
                requiredPatterns: [],
                bondingRules: [],
                compensatorySignals: []
            },
            viabilityScore: 1.0,
            generation: {
                timestamp: new Date().toISOString(),
                version: "2.0.0",
                options: options || {},
                brand: brand || null,
                rationale: []
            }
        };

        // Step 1: V1 priority-based solver — resolves conflicts by trait importance
        const solver = new GenomeConstraintSolver();
        const result = solver.solve(genome);

        // Step 2: V2 set-theoretic solver — refines remaining values via set intersection,
        // ensuring all active traits agree on the final chromosome values.
        const v2result = solveWithSetTheory(result.genome);

        // Merge rationale from both passes
        genome.generation.rationale = [
            ...result.rationale,
            ...(v2result.compromises.length > 0
                ? v2result.compromises.map(c => `[set-theoretic] ${c.property}: ${c.requested} → ${c.actual} (${c.reason})`)
                : []),
        ];

        return v2result.genome;
    }

    /**
     * Generate all chromosomes
     */
    private generateChromosomes(params: {
        seed: string;
        hash: string;
        bytes: Buffer;
        b: (index: number) => number;
        traits: ContentTraits;
        primaryProfile: ReturnType<typeof getSectorProfile>;
        secondaryProfile: ReturnType<typeof getSectorProfile> | null;
        subSector: SubSector;
        subSectorConfidence: number;
        brand?: BrandConfiguration;
        brandWeight: number;
        sectorWeight: number;
        epigenetics?: EpigeneticData;
        options?: GenerationOptions;
    }): DesignGenome['chromosomes'] {
        const {
            seed, hash, bytes, b, traits, primaryProfile, secondaryProfile,
            subSector, subSectorConfidence, brand, brandWeight, sectorWeight, epigenetics, options
        } = params;
        
        // FIX 2/3: Access pool via this.pool for uniform selection
        const pool = this.pool!;

        // Check if chromosomes are disabled
        const isDisabled = (ch: string) => options?.disabledChromosomes?.includes(ch) ?? false;
        
        // FIX 5: Type-safe chromosome retrieval with proper generic typing
        const getForced = <T>(ch: string, defaultValue: T): T => {
            const forced = options?.forcedChromosomes?.[ch as keyof typeof options.forcedChromosomes];
            return (forced as T) ?? defaultValue;
        };

        // Sector Chromosomes
        const ch0_sector_primary = getForced('ch0_sector_primary', {
            sector: primaryProfile.sector,
            influence: sectorWeight
        });

        const ch0_sector_secondary = getForced('ch0_sector_secondary', {
            sector: secondaryProfile?.sector || null,
            influence: secondaryProfile ? (1 - sectorWeight) * 0.3 : 0
        });

        const ch0_sub_sector = getForced('ch0_sub_sector', {
            classification: subSector,
            confidence: subSectorConfidence,
            keywords: this.extractKeywords(traits)
        });

        const ch0_brand_weight = getForced('ch0_brand_weight', {
            brandVsSector: brandWeight,
            appliedOverrides: []
        });

        // Original Chromosomes (1-18)
        const ch1_structure = getForced('ch1_structure', this.generateStructure(traits, b));
        const ch2_rhythm = getForced('ch2_rhythm', this.generateRhythm(traits, b));
        const ch3_type_display = getForced('ch3_type_display', this.generateDisplayType(traits, b, primaryProfile, options));
        const ch4_type_body = getForced('ch4_type_body', this.generateBodyType(traits, b, primaryProfile, options));
        const ch5_color_primary = getForced('ch5_color_primary', this.generatePrimaryColor(
            b, primaryProfile, secondaryProfile, brand, brandWeight, epigenetics
        ));
        const ch6_color_temp = getForced('ch6_color_temp', this.generateColorTemp(
            ch5_color_primary.temperature, primaryProfile, b
        ));
        const ch7_edge = getForced('ch7_edge', this.generateEdge(traits, b, primaryProfile));
        const ch8_motion = getForced('ch8_motion', this.generateMotion(traits, b, primaryProfile));
        const ch27_motion_choreography = getForced('ch27_motion_choreography', this.generateMotionChoreography(traits, b));
        const ch9_grid = getForced('ch9_grid', this.generateGrid(traits, b));
        const ch10_hierarchy = getForced('ch10_hierarchy', this.generateHierarchy(traits, b));
        const ch11_texture = getForced('ch11_texture', this.generateTexture(traits, b));
        // Design philosophy — derived from already-generated chromosomes above
        const _entropy = b(17);
        const _noiseLevel = ch11_texture.noiseLevel;
        const _depthCues = ch10_hierarchy.depthCues as string;
        const _atmosphereEnabled = b(32) > 0.35;

        const _designPhilosophy = deriveDesignPhilosophy(
            _entropy,
            ch8_motion.physics as string,
            ch7_edge.style as string,
            _noiseLevel,
            primaryProfile.sector
        );
        const _depthPhilosophy = deriveDepthPhilosophy(
            _designPhilosophy,
            _noiseLevel,
            _depthCues,
            _atmosphereEnabled,
            _entropy
        );

        const ch12_signature = getForced('ch12_signature', {
            entropy: _entropy,
            uniqueMutation: hash.slice(0, 8),
            variantSeed: b(18), // Byte 18 — distinct from entropy (byte 17)
            designPhilosophy: _designPhilosophy,
            depthPhilosophy: _depthPhilosophy,
            variationSequence: deriveVariationSequence(_designPhilosophy, _entropy, this.pool!, 195),
            rhythmPattern: deriveRhythmPattern(_designPhilosophy, _entropy, this.pool!, 197),
        });

        const ch28_iconography = getForced('ch28_iconography', this.generateIconography(traits, b, primaryProfile));
        const ch13_atmosphere = getForced('ch13_atmosphere', this.generateAtmosphere(
            traits, b, isDisabled('ch13_atmosphere')
        ));
        const ch14_physics = getForced('ch14_physics', this.generatePhysics(
            traits, b, isDisabled('ch14_physics')
        ));
        const ch15_biomarker = getForced('ch15_biomarker', this.generateBiomarker(
            traits, b, primaryProfile, isDisabled('ch15_biomarker'), options?.enable3D
        ));
        const ch16_typography = getForced('ch16_typography', this.generateTypography(traits, b));
        const ch17_accessibility = getForced('ch17_accessibility', this.generateAccessibility(traits, b));
        const ch18_rendering = getForced('ch18_rendering', this.generateRendering(traits, b));

        // Hero & Visual Chromosomes (19-20)
        const forcedHero = options?.forcedChromosomes?.ch19_hero_type;
        
        // Genome-derived: does this design have a hero? (both bytes from hash)
        const hasHero = forcedHero?.hasHero ?? (b(100) > b(101));
        
        const heroType: HeroType = forcedHero?.type ||
            selectHeroType(primaryProfile.sector, Math.floor(b(101) * 255));
        const heroVariant: HeroLayoutVariant = forcedHero?.variant ||
            this.selectHeroVariant(heroType, b(102));

        const _starType = deriveStarType(
            _designPhilosophy,
            _entropy,
            ch8_motion.physics,
            false, // hasVideo — ch20 not yet computed, default false
            this.pool!,
            199
        );
        const ch19_hero_type: typeof forcedHero = forcedHero || {
            hasHero,                                        // ← SHA-256 derived existence
            type: hasHero ? heroType : "product_ui",       // ← Default type if no hero (AI ignores)
            variant: heroVariant,
            variantIndex: Math.floor(b(30) * 10) % 10,     // Use byte 30, wrap to 0-9
            contentSource: undefined,
            starType: _starType,
        };

        const ch19_hero_variant_detail: DesignGenome['chromosomes']['ch19_hero_variant_detail'] = getForced('ch19_hero_variant_detail', {
            layout: heroVariant,
            elements: this.getHeroElements(heroType),
            alignment: this.selectFromHash(b(103), ["left", "center", "right"]),
            textPosition: this.selectFromHash(b(104), ["overlay", "adjacent", "below"]),
            height: traits.spatialDependency > 0.6 ? "viewport" 
                  : traits.informationDensity > 0.7 ? "compact" 
                  : traits.informationDensity > 0.4 ? "medium"
                  : "large",
            backgroundTreatment: heroType === "product_video" || heroType === "aspirational_imagery"
                ? (b(118) > b(119) ? "video" : "image")
                : traits.spatialDependency > 0.6 ? "mesh" : "solid" as "solid" | "image" | "video" | "mesh",
            overlayOpacity: 0.3 + b(119) * 0.5,
            mobileBehavior: traits.informationDensity > 0.7
                ? "stack"
                : this.selectFromHash(b(120), ["stack", "collapse_image", "full_bleed"]) as "stack" | "collapse_image" | "full_bleed"
        });

        const ch20_visual_treatment: DesignGenome['chromosomes']['ch20_visual_treatment'] = getForced('ch20_visual_treatment', {
            treatment: this.selectVisualTreatment(primaryProfile, b(105)),
            videoStrategy: this.selectVideoStrategy(primaryProfile, b(106)),
            imageTreatment: this.selectFromHash(b(107), ["natural", "high_contrast", "warm", "cool", "monochrome"]),
            hasVideo: b(106) > b(107),
            imageAspectRatio: this.selectFromHash(b(121), ["16:9", "4:3", "1:1", "4:5"]),
            colorGrading: traits.emotionalTemperature > 0.7
                ? "vibrant"
                : traits.emotionalTemperature < 0.3
                    ? "desaturated"
                    : this.selectFromHash(b(122), ["natural", "natural", "desaturated", "duotone"]) as "natural" | "desaturated" | "vibrant" | "duotone",
            imageCount: traits.informationDensity > 0.7 ? 1 : traits.visualEmphasis > 0.6 ? "many" : 3 as 1 | 3 | 5 | "many"
        });

        // Trust & Social Chromosomes (21-22)
        const forcedTrust = options?.forcedChromosomes?.ch21_trust_signals;
        
        // Genome-derived: does this design have trust signals? (both bytes from hash)
        const hasTrustSignals = forcedTrust?.hasTrustSignals ?? (b(107) > b(108));
        
        const trustApproach: TrustApproach = forcedTrust?.approach ||
            selectTrustApproach(primaryProfile.sector, Math.floor(b(108) * 255));

        const ch21_trust_signals: DesignGenome['chromosomes']['ch21_trust_signals'] = forcedTrust || {
            hasTrustSignals,                                // ← SHA-256 derived existence
            approach: hasTrustSignals ? trustApproach : "credentials", // ← Default if none
            prominence: this.selectTrustProminence(traits, primaryProfile),
            layoutVariant: `trust_${trustApproach}_${Math.floor(b(109) * 5)}`,
            contentProvided: false,
            suggestedStats: hasTrustSignals ? ["{{STAT_1}}", "{{STAT_2}}", "{{STAT_3}}"] : [],
            animationType: traits.informationDensity > 0.7
                ? "count_up"
                : traits.temporalUrgency > 0.6
                    ? "fade_in"
                    : "none" as "count_up" | "fade_in" | "none"
        };

        // Populate trust content with template tokens (not fake data)
        const ch21_trust_content: DesignGenome['chromosomes']['ch21_trust_content'] = getForced('ch21_trust_content', {
            credentials: primaryProfile.sector === "healthcare" || primaryProfile.sector === "legal"
                ? ["{{CREDENTIAL_1}}", "{{CREDENTIAL_2}}"]
                : [],
            testimonials: traits.trustRequirement > 0.5
                ? ["{{TESTIMONIAL_1}}", "{{TESTIMONIAL_2}}"]
                : [],
            stats: [
                { label: "{{STAT_1_LABEL}}", value: "{{STAT_1_VALUE}}" },
                { label: "{{STAT_2_LABEL}}", value: "{{STAT_2_VALUE}}" },
                { label: "{{STAT_3_LABEL}}", value: "{{STAT_3_VALUE}}" }
            ],
            securityBadges: traits.trustRequirement > 0.7
                ? ["{{BADGE_ISO}}", "{{BADGE_SOC2}}"]
                : []
        });

        // SHA-256 derived: does this design have social proof? (~30% chance of none)
        const hasSocialProof = b(110) > b(111);
        
        const ch22_social_proof: DesignGenome['chromosomes']['ch22_social_proof'] = getForced('ch22_social_proof', {
            hasSocialProof,                                 // ← SHA-256 derived existence
            type: hasSocialProof ? this.selectSocialProofType(b(111), primaryProfile) : "none",
            prominence: this.selectTrustProminence(traits, primaryProfile),
            layout: this.selectFromHash(b(112), ["grid", "marquee", "carousel", "static"]),
            logoCount: hasSocialProof 
                ? (traits.conversionFocus > 0.6 ? 8 : traits.informationDensity > 0.5 ? 5 : 3)
                : 3, // minimum logo count when disabled
            updateFrequency: traits.temporalUrgency > 0.7 ? "realtime" : traits.temporalUrgency > 0.4 ? "daily" : "static" as "static" | "daily" | "realtime",
            displayStyle: traits.trustRequirement > 0.6
                ? "full_testimonial"
                : traits.informationDensity > 0.6
                    ? "logos_only"
                    : "logos_with_name" as "logos_only" | "logos_with_name" | "full_testimonial"
        });

        const ch22_impact_demonstration: DesignGenome['chromosomes']['ch22_impact_demonstration'] = getForced('ch22_impact_demonstration', {
            type: this.selectImpactType(b(112), primaryProfile),
            realTime: b(113) > b(115),
            interactive: b(114) > b(115),
            animationTrigger: traits.temporalUrgency > 0.6
                ? "page_load"
                : this.selectFromHash(b(123), ["scroll_enter", "scroll_enter", "page_load", "hover"]) as "scroll_enter" | "page_load" | "hover",
            counterFormat: traits.informationDensity > 0.7
                ? "abbreviated_k"
                : traits.conversionFocus > 0.6
                    ? "full"
                    : "percentage",
        });

        // Content Structure Chromosomes (23-24)
        const ch23_content_depth: DesignGenome['chromosomes']['ch23_content_depth'] = getForced('ch23_content_depth', {
            level: this.selectContentDepth(traits, primaryProfile),
            estimatedSections: this.estimateSections(traits),
            hasHero,
            hasFeatures: traits.informationDensity > 0.4 || traits.conversionFocus > 0.3,
            hasCTA: traits.conversionFocus > 0.5,
            hasFAQ: traits.informationDensity > 0.6,
            hasTestimonials: traits.trustRequirement > 0.6
        });

        // SHA-256 derived: does this design have a footer? (~20% chance of no footer)
        const hasFooter = b(116) > b(117);
        
        const ch23_information_architecture: DesignGenome['chromosomes']['ch23_information_architecture'] = getForced('ch23_information_architecture', {
            pattern: this.selectInfoArchitecture(traits, primaryProfile),
            navigationType: this.selectFromHash(b(115), ["header", "sidebar", "floating", "minimal"]),
            hasFooter,                                      // ← SHA-256 derived existence
            footerType: hasFooter 
                ? this.selectFromHash(b(117), ["full", "minimal"]) 
                : "minimal"                                   // ← Default if no footer (AI ignores)
        });

        const ch24_personalization: DesignGenome['chromosomes']['ch24_personalization'] = getForced('ch24_personalization', {
            approach: this.selectPersonalization(traits),
            dynamicContent: b(118) > b(119),
            userSegmentation: traits.informationDensity > 0.7,
            abTestingReady: traits.conversionFocus > 0.5,
            segmentCount: (traits.informationDensity > 0.7 ? 4 : traits.informationDensity > 0.4 ? 3 : 2) as 2 | 3 | 4
        });

        const ch25_copy_engine = getForced('ch25_copy_engine', this.generateCopyEngine(primaryProfile, b, options?.copyIntelligence, options?.copy));
        const ch29_copy_intelligence = options?.copyIntelligence || this.generateDefaultCopyIntelligence(primaryProfile);

        // Ensure ch25 uses the same intelligence for consistency
        if (options?.copyIntelligence && !options.forcedChromosomes?.ch25_copy_engine) {
            // Regenerate copy engine with the provided intelligence
            const regeneratedCopy = this.generateCopyEngine(primaryProfile, b, options.copyIntelligence, options.copy);
            // Copy regenerated content back to ch25_copy_engine
            Object.assign(ch25_copy_engine, regeneratedCopy);
        }

        // Civilization Chromosomes (30–32)
        // Always generated from hash bytes; only read when complexity >= 0.81 (tribal+).
        // b() wraps at 32, so indices 219-224 map deterministically via modulo.
        const ch30_state_topology: DesignGenome['chromosomes']['ch30_state_topology'] = getForced('ch30_state_topology', {
            topology: this.selectFromHash(b(219), [
                'local', 'shared_context', 'reactive_store', 'distributed', 'federated'
            ] as StateTopology[]),
            sharedSurfaces: Math.floor(b(220) * 6)  // 0–5
        });

        const ch31_routing_pattern: DesignGenome['chromosomes']['ch31_routing_pattern'] = getForced('ch31_routing_pattern', {
            pattern: this.selectFromHash(b(221), [
                'single_page', 'multi_page', 'protected', 'platform', 'federated'
            ] as RoutingPattern[]),
            guardedRoutes: Math.floor(b(222) * 9)   // 0–8
        });

        const ch32_token_inheritance: DesignGenome['chromosomes']['ch32_token_inheritance'] = getForced('ch32_token_inheritance', {
            inheritance: this.selectFromHash(b(223), [
                'flat', 'semantic', 'component', 'governed', 'cross_system'
            ] as TokenInheritance[]),
            themeLayers: Math.floor(b(224) * 4) + 1 // 1–4
        });

        // ── Composition Chromosomes (ch33, ch34) ──────────────────────────
        // Drive selection from structural-pattern-catalog.ts (30,000+ patterns)
        const ch33_composition_strategy: DesignGenome['chromosomes']['ch33_composition_strategy'] = getForced('ch33_composition_strategy', {
            layoutPattern: this.pool!.selectUniform(225, [
                'single_column', 'split_screen', 'dashboard_grid', 'magazine_editorial',
                'immersive_fullscreen', 'masonry_dynamic', 'card_grid', 'timeline_vertical',
                'hub_spoke', 'infinite_scroll', 'tabbed_interface', 'wizard_flow',
                'comparison_table', 'gallery_showcase', 'documentation', 'landing_conversion',
                'product_catalog', 'single_focus', 'multi_panel', 'spatial_3d',
                'asymmetric_overlap', 'centered_focus', 'sidebar_content', 'floating_elements',
                'modular_blocks', 'split_hero_content', 'full_bleed_media', 'data_dense',
                'breathing_space', 'layered_parallax', 'horizontal_scroll', 'zigzag_alternating',
                'stacked_cards', 'grid_mosaic', 'fluid_responsive', 'bento_compartment',
                'editorial_mixed', 'minimalist_single', 'dashboard_command', 'explorer_spatial',
                'feed_continuous', 'stepper_sequential', 'split_view', 'overlay_navigation',
                'fullscreen_sections', 'compact_utility', 'narrative_scroll', 'catalog_browser',
                'workspace_multi', 'showcase_immersive', 'comparison_analytical',
                'landing_minimal', 'landing_rich', 'app_shell', 'content_first',
                'media_gallery', 'documentation_api', 'blog_magazine', 'blog_chronological',
                'blog_featured', 'portfolio_grid', 'portfolio_case_study', 'ecommerce_grid',
                'ecommerce_showcase', 'ecommerce_comparison', 'dashboard_metrics',
                'dashboard_analytics', 'dashboard_monitoring', 'dashboard_admin',
                'onboarding_wizard', 'settings_panel', 'search_results', 'form_multi_step',
                'form_single', 'checkout_flow', 'pricing_comparison', 'team_directory',
                'event_schedule', 'map_location', 'faq_accordion', 'testimonials_wall',
                'cta_focused', 'newsletter_signup', 'download_landing', 'waitlist_signup',
                'coming_soon', 'error_page', 'maintenance', 'legal_document',
                'resume_cv', 'link_tree', 'bio_card', 'status_page', 'changelog',
                'roadmap', 'kanban_board', 'calendar_view', 'gantt_chart', 'file_manager',
                'chat_interface', 'email_client', 'video_player', 'audio_player',
                'podcast_show', 'recipe_card', 'menu_restaurant', 'booking_form',
                'reservation', 'ticket_purchase', 'donation_page', 'fundraiser',
                'petition', 'survey_form', 'quiz_interface', 'assessment',
                'certificate', 'badge_display', 'leaderboard', 'profile_page',
                'user_dashboard', 'account_settings', 'notification_center',
                'activity_feed', 'social_stream', 'forum_thread', 'wiki_article',
                'knowledge_base', 'help_center', 'support_ticket', 'live_chat',
                'video_conference', 'whiteboard', 'presentation', 'slideshow',
                'infographic', 'data_story', 'report_viewer'
            ] as LayoutPattern[]),
            sectionCount: Math.floor(b(226) * 13) + 2, // 2–14
            sectionTypes: this.generateSectionTypes(traits, b),
            navRequirement: this.pool!.selectUniform(227, [
                'none', 'minimal', 'header_standard', 'header_mega',
                'sidebar_persistent', 'sidebar_collapsible', 'floating_dock',
                'bottom_tab', 'breadcrumb_only', 'command_palette'
            ] as NavRequirement[]),
            heroProminence: this.pool!.selectUniform(228, [
                'none', 'compact', 'standard', 'full_viewport',
                'full_bleed_video', 'split_hero', 'immersive_3d', 'carousel_hero'
            ] as HeroProminence[]),
            interactionModel: this.pool!.selectUniform(229, [
                'scroll_natural', 'scroll_snap', 'scroll_parallax',
                'tab_navigation', 'pagination', 'infinite_feed',
                'wizard_steps', 'dashboard_live', 'explorer'
            ] as InteractionModel[]),
            contentFlow: this.pool!.selectUniform(230, [
                'top_down', 'hero_first', 'discovery', 'narrative',
                'data_driven', 'comparison_first', 'action_first', 'social_first'
            ] as ContentFlowStrategy[]),
            densityDistribution: this.pool!.selectUniform(231, [
                'uniform', 'hero_dense', 'content_dense', 'gradient', 'islands', 'maximal'
            ] as DensityDistribution[]),
            responsiveBehavior: this.pool!.selectUniform(232, [
                'stack', 'hide_secondary', 'tab_to_accordion',
                'grid_to_list', 'sidebar_to_drawer', 'spatial_to_scroll'
            ] as ResponsiveStrategy[]),
        });

        const ch34_component_topology: DesignGenome['chromosomes']['ch34_component_topology'] = getForced('ch34_component_topology', {
            primaryFramework: this.pool!.selectUniform(233, [
                'react', 'vue', 'svelte', 'vanilla', 'htmx'
            ] as ComponentFramework[]),
            componentDensity: b(234),
            nestingDepth: Math.floor(b(235) * 4) + 1, // 1–4
            compositionStyle: this.pool!.selectUniform(236, [
                'atomic', 'molecular', 'organismic', 'template', 'headless', 'styled'
            ] as CompositionStyle[]),
            stateBoundaries: Math.floor(b(237) * 6), // 0–5
            propComplexity: this.pool!.selectUniform(238, [
                'minimal', 'moderate', 'rich', 'complex'
            ] as PropComplexity[]),
            animationScope: this.pool!.selectUniform(239, [
                'none', 'micro', 'enter_exit', 'continuous', 'orchestrated'
            ] as AnimationScope[]),
        });

        return {
            ch0_sector_primary,
            ch0_sector_secondary,
            ch0_sub_sector,
            ch0_brand_weight,
            ch1_structure,
            ch2_rhythm,
            ch3_type_display,
            ch4_type_body,
            ch5_color_primary,
            ch6_color_temp,
            ch7_edge,
            ch8_motion,
            ch27_motion_choreography,
            ch9_grid,
            ch10_hierarchy,
            ch11_texture,
            ch12_signature,
            ch28_iconography,
            ch13_atmosphere,
            ch14_physics,
            ch15_biomarker,
            ch16_typography,
            ch17_accessibility,
            ch18_rendering,
            ch19_hero_type,
            ch19_hero_variant_detail,
            ch20_visual_treatment,
            ch21_trust_signals,
            ch21_trust_content,
            ch22_social_proof,
            ch22_impact_demonstration,
            ch23_content_depth,
            ch23_information_architecture,
            ch24_personalization,
            ch25_copy_engine,
            ch29_copy_intelligence: ch29_copy_intelligence,
            ch26_color_system: this.generateColorSystemFull(
                ch5_color_primary, primaryProfile, b, seed,
                ch12_signature.entropy, ch12_signature.designPhilosophy,
                ch8_motion.physics as string, ch6_color_temp.isDark, primaryProfile.sector
            ),
            ch3_type_accent: null, // populated in selectFonts if fontCount === 3
            ch30_state_topology,
            ch31_routing_pattern,
            ch32_token_inheritance,
            ch33_composition_strategy,
            ch34_component_topology,
        };
    }

    /**
     * Generate complete color system with hash-driven harmony
     */
    private generateColorSystem(
        primary: { hue: number; saturation: number; lightness: number; hex: string },
        profile: ReturnType<typeof getSectorProfile>,
        b: (index: number) => number
    ) {
        // Hash-derived secondary color relationship
        // FIX 2: Use uniform selection to eliminate modulo bias
        const relationships = ["complementary", "analogous", "split", "triadic"] as const;
        const relationship = this.pool!.selectUniform(208, relationships);
        
        let secondaryHue: number;
        switch (relationship) {
            case "complementary":
                secondaryHue = (primary.hue + 180) % 360;
                break;
            case "analogous":
                secondaryHue = (primary.hue + 30 + Math.floor(b(209) * 60)) % 360;
                break;
            case "split":
                secondaryHue = (primary.hue + 150 + Math.floor(b(210) * 60)) % 360;
                break;
            case "triadic":
                secondaryHue = (primary.hue + 120 + Math.floor(b(211) * 120)) % 360;
                break;
            default:
                secondaryHue = (primary.hue + 180) % 360; // fallback
        }
        
        const secondary = {
            hue: Math.round(secondaryHue),
            saturation: Math.round(Math.max(0.3, Math.min(0.8, primary.saturation + (b(212) - 0.5) * 0.4)) * 100) / 100,
            lightness: Math.round(Math.max(0.2, Math.min(0.8, primary.lightness + (b(213) - 0.5) * 0.3)) * 100) / 100,
            hex: this.hslToHex(secondaryHue, Math.max(0.3, Math.min(0.8, primary.saturation + (b(212) - 0.5) * 0.4)) * 100, Math.max(0.2, Math.min(0.8, primary.lightness + (b(213) - 0.5) * 0.3)) * 100),
            relationship
        };
        
        // Hash-derived accent (triadic or tetradic)
        const accentHue = (primary.hue + 240 + Math.floor(b(214) * 60)) % 360;
        const accent = {
            hue: Math.round(accentHue),
            saturation: Math.round(Math.max(0.4, b(215)) * 100) / 100,
            lightness: Math.round(Math.max(0.4, Math.min(0.6, 0.5 + (b(216) - 0.5) * 0.2)) * 100) / 100,
            hex: this.hslToHex(accentHue, Math.max(40, b(215) * 100), Math.max(40, Math.min(60, (0.5 + (b(216) - 0.5) * 0.2) * 100))),
            usage: this.pool!.selectUniform(217, ["cta", "highlight", "alert", "success"] as const)
        };
        
        // Sector-biased semantic colors
        const semantic = {
            success: {
                hue: profile.sector === "healthcare" ? 145 : profile.sector === "fintech" ? 140 : 135,
                hex: this.hslToHex(profile.sector === "healthcare" ? 145 : profile.sector === "fintech" ? 140 : 135, 65, 45)
            },
            warning: {
                hue: profile.sector === "automotive" ? 35 : 45,
                hex: this.hslToHex(profile.sector === "automotive" ? 35 : 45, 90, 50)
            },
            error: {
                hue: profile.sector === "healthcare" ? 355 : 0,
                hex: this.hslToHex(profile.sector === "healthcare" ? 355 : 0, 75, 50)
            },
            info: {
                hue: profile.sector === "technology" ? 210 : 200,
                hex: this.hslToHex(profile.sector === "technology" ? 210 : 200, 80, 50)
            }
        };
        
        // Hash-driven neutral scale with primary tint
        const tintStrength = Math.round(b(218) * 30) / 100; // 0-0.3 (0-30%)
        const neutralScale: string[] = [];
        for (let i = 0; i < 9; i++) {
            const lightness = 5 + i * 11; // 5, 16, 27, 38, 49, 60, 71, 82, 93 (already 0-100)
            const saturation = tintStrength * (1 - Math.abs(i - 4) / 4) * 100; // 0-30% converted to 0-100
            neutralScale.push(this.hslToHex(primary.hue, saturation, lightness));
        }
        
        // Dark mode surfaces
        const darkModeSurfaces: string[] = [];
        const darkElevations = [5, 10, 15, 20, 25, 30, 35, 40];
        for (let i = 0; i < 8; i++) {
            const lightness = darkElevations[i]; // already 0-100
            const saturation = tintStrength * 0.5 * 100; // convert to 0-100
            darkModeSurfaces.push(this.hslToHex(primary.hue, saturation, lightness));
        }
        
        return {
            secondary,
            accent,
            semantic,
            neutral: {
                scale: neutralScale,
                tintStrength
            },
            darkMode: {
                surfaceStack: darkModeSurfaces,
                elevationMap: darkElevations
            },
            // Placeholder — populated by generateColorSystemWithPalette
            harmonyRule: "complementary" as const,
            palette: null as any,
            fontCount: 2 as const,
            fontStrategy: "contrast_pair" as const,
        };
    }

    /**
     * Generate complete color system including OKLCH palette and font system
     */
    private generateColorSystemFull(
        primary: { hue: number; saturation: number; lightness: number; hex: string },
        profile: ReturnType<typeof getSectorProfile>,
        b: (index: number) => number,
        seed: string,
        entropy: number,
        philosophy: DesignPhilosophy,
        physics: string,
        isDark: boolean,
        sector: string
    ) {
        const base = this.generateColorSystem(primary, profile, b);

        // Generate full OKLCH palette
        const palette = generatePalette(
            primary.hue,
            primary.saturation,
            entropy,
            isDark,
            physics,
            sector,
            philosophy,
            seed
        );

        // Determine font count and strategy
        const fontPool = new EntropyPool(seed + ":fonts");
        const fontCount = deriveFontCount(philosophy, entropy, physics, sector, fontPool, 0);
        const fontStrategy = selectFontStrategy(fontCount, philosophy, entropy, fontPool, 5);

        return {
            ...base,
            harmonyRule: palette.rule,
            palette,
            fontCount,
            fontStrategy,
        };
    }

    /**
     * Generate copy engine — LLM output only.
     * All copy is derived from intent via the extractor.
     * When no LLM copy is provided, returns empty strings — the HTML generator skips sections with empty content.
     */
    private generateCopyEngine(
        profile: ReturnType<typeof getSectorProfile>,
        b: (index: number) => number,
        copyIntelligence?: CopyIntelligence,
        copy?: {
            headline: string; subheadline: string; cta: string; tagline: string;
            companyName: string; authorName: string; authorTitle: string;
            ctaSecondary: string; sectionTitleTestimonials: string;
            sectionTitleFeatures: string; sectionTitleFAQ: string;
            features: { title: string; description: string }[];
            stats: { label: string; value: string }[];
            testimonial: string; faq: { question: string; answer: string }[];
            footerProductTitle: string; footerCompanyTitle: string;
            footerNavProduct: string[]; footerNavCompany: string[];
        }
    ) {
        if (copy) {
            return {
                headline:                 copy.headline,
                subheadline:              copy.subheadline,
                cta:                      copy.cta,
                ctaSecondary:             copy.ctaSecondary,
                tagline:                  copy.tagline,
                companyName:              copy.companyName,
                authorName:               copy.authorName,
                authorTitle:              copy.authorTitle,
                testimonial:              copy.testimonial,
                sectionTitleTestimonials: copy.sectionTitleTestimonials,
                sectionTitleFeatures:     copy.sectionTitleFeatures,
                sectionTitleFAQ:          copy.sectionTitleFAQ,
                stats:                    copy.stats,
                faq:                      copy.faq,
                features:                 copy.features,
                footerProductTitle:       copy.footerProductTitle,
                footerCompanyTitle:       copy.footerCompanyTitle,
                footerNavProduct:         copy.footerNavProduct,
                footerNavCompany:         copy.footerNavCompany,
            };
        }

        // No LLM copy provided — return empty strings.
        // HTML generator skips sections with empty content.
        // Real copy must come from LLM extraction via the extractor.
        return {
            headline:                 "",
            subheadline:              "",
            cta:                      "",
            ctaSecondary:             "",
            tagline:                  "",
            companyName:              "",
            authorName:               "",
            authorTitle:              "",
            testimonial:              "",
            sectionTitleTestimonials: "",
            sectionTitleFeatures:     "",
            sectionTitleFAQ:          "",
            stats:                    [],
            faq:                      [],
            features:                 [],
            footerProductTitle:       "",
            footerCompanyTitle:       "",
            footerNavProduct:         [],
            footerNavCompany:         [],
        };
    }

    /**
     * Generate default copy intelligence for a sector
     */
    private generateDefaultCopyIntelligence(profile: ReturnType<typeof getSectorProfile>): CopyIntelligence {
        const sectorDefaults: Record<PrimarySector, CopyIntelligence> = {
            healthcare: {
                industryTerminology: ["patient care", "treatment outcomes", "clinical excellence", "board certified"],
                emotionalRegister: "professional",
                formalityLevel: 0.7,
                ctaAggression: 0.3,
                headlineStyle: "benefit_forward",
                vocabularyComplexity: "moderate",
                sentenceStructure: "balanced",
                emojiUsage: false,
                contractionUsage: false
            },
            fintech: {
                industryTerminology: ["portfolio", "returns", "assets under management", "diversification"],
                emotionalRegister: "professional",
                formalityLevel: 0.6,
                ctaAggression: 0.6,
                headlineStyle: "benefit_forward",
                vocabularyComplexity: "moderate",
                sentenceStructure: "balanced",
                emojiUsage: false,
                contractionUsage: true
            },
            legal: {
                industryTerminology: ["counsel", "representation", "jurisdiction", "precedent"],
                emotionalRegister: "luxury",
                formalityLevel: 0.9,
                ctaAggression: 0.2,
                headlineStyle: "direct",
                vocabularyComplexity: "specialized",
                sentenceStructure: "complex_periodic",
                emojiUsage: false,
                contractionUsage: false
            },
            automotive: {
                industryTerminology: ["performance", "efficiency", "handling", "innovation"],
                emotionalRegister: "urgent",
                formalityLevel: 0.4,
                ctaAggression: 0.5,
                headlineStyle: "curiosity_gap",
                vocabularyComplexity: "simple",
                sentenceStructure: "short_punchy",
                emojiUsage: false,
                contractionUsage: true
            },
            technology: {
                industryTerminology: ["integration", "automation", "scalability", "deployment"],
                emotionalRegister: "professional",
                formalityLevel: 0.4,
                ctaAggression: 0.4,
                headlineStyle: "how_to",
                vocabularyComplexity: "technical",
                sentenceStructure: "balanced",
                emojiUsage: false,
                contractionUsage: true
            },
            education: {
                industryTerminology: ["curriculum", "outcomes", "mastery", "development"],
                emotionalRegister: "conversational",
                formalityLevel: 0.5,
                ctaAggression: 0.3,
                headlineStyle: "social_proof",
                vocabularyComplexity: "simple",
                sentenceStructure: "balanced",
                emojiUsage: false,
                contractionUsage: true
            },
            commerce: {
                industryTerminology: ["collection", "exclusive", "limited", "quality"],
                emotionalRegister: "playful",
                formalityLevel: 0.3,
                ctaAggression: 0.7,
                headlineStyle: "curiosity_gap",
                vocabularyComplexity: "simple",
                sentenceStructure: "short_punchy",
                emojiUsage: true,
                contractionUsage: true
            },
            entertainment: {
                industryTerminology: ["experience", "exclusive", "premiere", "access"],
                emotionalRegister: "playful",
                formalityLevel: 0.2,
                ctaAggression: 0.5,
                headlineStyle: "social_proof",
                vocabularyComplexity: "simple",
                sentenceStructure: "short_punchy",
                emojiUsage: true,
                contractionUsage: true
            },
            real_estate: {
                industryTerminology: ["property", "investment", "location", "valuation"],
                emotionalRegister: "luxury",
                formalityLevel: 0.6,
                ctaAggression: 0.3,
                headlineStyle: "benefit_forward",
                vocabularyComplexity: "moderate",
                sentenceStructure: "balanced",
                emojiUsage: false,
                contractionUsage: false
            },
            travel: {
                industryTerminology: ["destination", "experience", "adventure", "itinerary"],
                emotionalRegister: "conversational",
                formalityLevel: 0.3,
                ctaAggression: 0.4,
                headlineStyle: "curiosity_gap",
                vocabularyComplexity: "simple",
                sentenceStructure: "short_punchy",
                emojiUsage: true,
                contractionUsage: true
            },
            food: {
                industryTerminology: ["artisan", "craft", "locally sourced", "seasonal"],
                emotionalRegister: "conversational",
                formalityLevel: 0.3,
                ctaAggression: 0.5,
                headlineStyle: "benefit_forward",
                vocabularyComplexity: "simple",
                sentenceStructure: "short_punchy",
                emojiUsage: true,
                contractionUsage: true
            },
            sports: {
                industryTerminology: ["performance", "training", "achievement", "victory"],
                emotionalRegister: "urgent",
                formalityLevel: 0.3,
                ctaAggression: 0.6,
                headlineStyle: "social_proof",
                vocabularyComplexity: "simple",
                sentenceStructure: "short_punchy",
                emojiUsage: true,
                contractionUsage: true
            },
            manufacturing: {
                industryTerminology: ["precision", "quality", "innovation", "capacity"],
                emotionalRegister: "professional",
                formalityLevel: 0.6,
                ctaAggression: 0.3,
                headlineStyle: "direct",
                vocabularyComplexity: "technical",
                sentenceStructure: "balanced",
                emojiUsage: false,
                contractionUsage: false
            },
            nonprofit: {
                industryTerminology: ["impact", "mission", "community", "change", "donate"],
                emotionalRegister: "conversational",
                formalityLevel: 0.4,
                ctaAggression: 0.5,
                headlineStyle: "social_proof",
                vocabularyComplexity: "simple",
                sentenceStructure: "balanced",
                emojiUsage: false,
                contractionUsage: true
            },
            government: {
                industryTerminology: ["services", "citizens", "public", "department", "authority"],
                emotionalRegister: "professional",
                formalityLevel: 0.8,
                ctaAggression: 0.2,
                headlineStyle: "direct",
                vocabularyComplexity: "moderate",
                sentenceStructure: "balanced",
                emojiUsage: false,
                contractionUsage: false
            },
            media: {
                industryTerminology: ["breaking", "exclusive", "analysis", "coverage", "report"],
                emotionalRegister: "professional",
                formalityLevel: 0.5,
                ctaAggression: 0.3,
                headlineStyle: "curiosity_gap",
                vocabularyComplexity: "moderate",
                sentenceStructure: "short_punchy",
                emojiUsage: false,
                contractionUsage: true
            },
            crypto_web3: {
                industryTerminology: ["decentralized", "protocol", "governance", "liquidity", "yield"],
                emotionalRegister: "professional",
                formalityLevel: 0.4,
                ctaAggression: 0.6,
                headlineStyle: "benefit_forward",
                vocabularyComplexity: "technical",
                sentenceStructure: "short_punchy",
                emojiUsage: false,
                contractionUsage: true
            },
            gaming: {
                industryTerminology: ["gameplay", "multiplayer", "level", "quest", "achievement"],
                emotionalRegister: "playful",
                formalityLevel: 0.2,
                ctaAggression: 0.7,
                headlineStyle: "curiosity_gap",
                vocabularyComplexity: "simple",
                sentenceStructure: "short_punchy",
                emojiUsage: true,
                contractionUsage: true
            },
            hospitality: {
                industryTerminology: ["experience", "amenities", "luxury", "comfort", "retreat"],
                emotionalRegister: "luxury",
                formalityLevel: 0.5,
                ctaAggression: 0.4,
                headlineStyle: "benefit_forward",
                vocabularyComplexity: "simple",
                sentenceStructure: "balanced",
                emojiUsage: false,
                contractionUsage: true
            },
            beauty_fashion: {
                industryTerminology: ["collection", "ritual", "radiance", "crafted", "curated"],
                emotionalRegister: "luxury",
                formalityLevel: 0.4,
                ctaAggression: 0.5,
                headlineStyle: "curiosity_gap",
                vocabularyComplexity: "simple",
                sentenceStructure: "short_punchy",
                emojiUsage: false,
                contractionUsage: true
            },
            insurance: {
                industryTerminology: ["coverage", "protection", "policy", "claims", "premium"],
                emotionalRegister: "professional",
                formalityLevel: 0.6,
                ctaAggression: 0.4,
                headlineStyle: "benefit_forward",
                vocabularyComplexity: "moderate",
                sentenceStructure: "balanced",
                emojiUsage: false,
                contractionUsage: false
            },
            agency: {
                industryTerminology: ["strategy", "creative", "results", "brand", "growth"],
                emotionalRegister: "professional",
                formalityLevel: 0.4,
                ctaAggression: 0.5,
                headlineStyle: "social_proof",
                vocabularyComplexity: "moderate",
                sentenceStructure: "short_punchy",
                emojiUsage: false,
                contractionUsage: true
            },
            energy: {
                industryTerminology: ["capacity", "output", "grid", "emissions", "sustainable"],
                emotionalRegister: "professional",
                formalityLevel: 0.6,
                ctaAggression: 0.3,
                headlineStyle: "benefit_forward",
                vocabularyComplexity: "technical",
                sentenceStructure: "balanced",
                emojiUsage: false,
                contractionUsage: false
            }
        };

        return sectorDefaults[profile.sector] || sectorDefaults.technology;
    }

    /**
     * Hash-derived sub-sector selection
     */
    private classifySubSectorFromTraits(
        traits: ContentTraits,
        primarySector: PrimarySector
    ): { subSector: SubSector; confidence: number } {
        const subSectorMap = SUB_SECTOR_KEYWORDS[primarySector];
        if (!subSectorMap) {
            return { subSector: `${primarySector}_general` as SubSector, confidence: 0.5 };
        }

        const subSectors = Object.keys(subSectorMap);
        if (subSectors.length === 0) {
            return { subSector: `${primarySector}_general` as SubSector, confidence: 0.5 };
        }

        // Use trait combination to select sub-sector deterministically
        const traitSum = traits.informationDensity + traits.temporalUrgency +
            traits.emotionalTemperature + traits.playfulness + traits.spatialDependency;
        // M-7: Use full traitSum (not just fractional part) for even distribution across sub-sectors
        const index = Math.floor(traitSum * 100) % subSectors.length;
        const selectedSubSector = subSectors[index] || subSectors[0];

        // Confidence based on trait clarity (extreme values = higher confidence)
        const extremeTraits = [
            traits.informationDensity > 0.7 || traits.informationDensity < 0.3,
            traits.temporalUrgency > 0.7 || traits.temporalUrgency < 0.3,
            traits.emotionalTemperature > 0.7 || traits.emotionalTemperature < 0.3,
            traits.playfulness > 0.7 || traits.playfulness < 0.3
        ].filter(Boolean).length;
        const confidence = 0.4 + (extremeTraits * 0.15);

        return { subSector: `${primarySector}_${selectedSubSector}` as SubSector, confidence };
    }

    /**
     * Extract keyword hints from trait values
     */
    private extractKeywords(traits: ContentTraits): string[] {
        const keywords: string[] = [];

        // === Information Density ===
        if (traits.informationDensity > 0.8) keywords.push("data-dense", "dashboard", "analytics", "kpi", "metrics", "reporting");
        else if (traits.informationDensity > 0.6) keywords.push("data-rich", "structured", "tabular");
        else if (traits.informationDensity < 0.3) keywords.push("minimal", "sparse", "luxurious", "whitespace", "gallery");

        // === Temporal Urgency ===
        if (traits.temporalUrgency > 0.8) keywords.push("real-time", "live", "urgent", "breaking", "alert", "ticker");
        else if (traits.temporalUrgency > 0.6) keywords.push("dynamic", "current", "news-feed");
        else if (traits.temporalUrgency < 0.3) keywords.push("editorial", "long-form", "archival", "evergreen", "timeless");
        else if (traits.temporalUrgency < 0.5) keywords.push("static", "documentation", "reference");

        // === Emotional Temperature ===
        if (traits.emotionalTemperature > 0.8) keywords.push("warm", "humanist", "community", "wellness", "empathetic", "organic");
        else if (traits.emotionalTemperature > 0.6) keywords.push("friendly", "approachable", "lifestyle");
        else if (traits.emotionalTemperature < 0.3) keywords.push("clinical", "brutalist", "enterprise", "precision", "cold");
        else if (traits.emotionalTemperature < 0.5) keywords.push("professional", "corporate", "neutral");

        // === Playfulness ===
        if (traits.playfulness > 0.8) keywords.push("playful", "whimsical", "experimental", "creative", "y2k", "organic-shapes");
        else if (traits.playfulness > 0.6) keywords.push("creative", "expressive", "brand-forward");
        else if (traits.playfulness < 0.2) keywords.push("strict", "corporate", "legal", "formal", "institutional");
        else if (traits.playfulness < 0.4) keywords.push("clean", "structured", "restrained");

        // === Spatial Dependency ===
        if (traits.spatialDependency > 0.8) keywords.push("immersive", "3d", "webgl", "spatial", "depth", "particles", "vr", "ar");
        else if (traits.spatialDependency > 0.6) keywords.push("interactive", "animated", "dimensional", "parallax");
        else if (traits.spatialDependency < 0.2) keywords.push("flat", "text-heavy", "document", "print");

        // === Trust Requirement ===
        if (traits.trustRequirement > 0.8) keywords.push("regulated", "compliance", "security", "certification", "HIPAA", "SOC2", "credentials");
        else if (traits.trustRequirement > 0.6) keywords.push("trusted", "verified", "secure", "professional");
        else if (traits.trustRequirement < 0.2) keywords.push("casual", "social", "informal");

        // === Visual Emphasis ===
        if (traits.visualEmphasis > 0.8) keywords.push("photography", "visual-storytelling", "lookbook", "editorial-imagery", "fashion", "studio");
        else if (traits.visualEmphasis > 0.6) keywords.push("image-forward", "visual", "showcase");
        else if (traits.visualEmphasis < 0.2) keywords.push("text-first", "typographic", "minimal-imagery");

        // === Conversion Focus ===
        if (traits.conversionFocus > 0.8) keywords.push("ecommerce", "checkout", "conversion", "sales", "cta-heavy", "acquisition");
        else if (traits.conversionFocus > 0.6) keywords.push("lead-gen", "pricing", "subscription", "trial");
        else if (traits.conversionFocus < 0.2) keywords.push("informational", "educational", "awareness", "non-profit");

        // === Cross-trait aesthetic signals ===
        if (traits.emotionalTemperature < 0.3 && traits.playfulness < 0.3) keywords.push("bauhaus", "swiss-design", "grid-system");
        if (traits.playfulness > 0.7 && traits.visualEmphasis > 0.7) keywords.push("editorial", "magazine", "avant-garde");
        if (traits.spatialDependency > 0.7 && traits.playfulness > 0.6) keywords.push("generative", "creative-coding", "motion-design");
        if (traits.temporalUrgency < 0.3 && traits.visualEmphasis > 0.6) keywords.push("luxury", "premium", "art-direction");
        if (traits.informationDensity > 0.7 && traits.temporalUrgency > 0.7) keywords.push("trading", "fintech", "realtime-data");
        if (traits.trustRequirement > 0.7 && traits.emotionalTemperature > 0.6) keywords.push("healthcare", "wellness-brand", "care");

        return [...new Set(keywords)]; // Deduplicate
    }

    /**
     * Calculate sub-sector confidence
     */
    private subSectorConfidence(traits: ContentTraits): number {
        // Each trait that is clearly extreme (>0.75 or <0.25) adds a +0.1 signal weight.
        // Neutral traits (0.35–0.65) add nothing — low confidence means either classification.
        // Normalised to a 0.35–0.95 range so we never return false certainty.
        const traitValues = [
            traits.informationDensity,
            traits.temporalUrgency,
            traits.emotionalTemperature,
            traits.playfulness,
            traits.spatialDependency,
            traits.trustRequirement,
            traits.visualEmphasis,
            traits.conversionFocus,
        ];
        const extremeCount = traitValues.filter(v => v > 0.75 || v < 0.25).length;
        const moderateCount = traitValues.filter(v => (v > 0.6 && v <= 0.75) || (v >= 0.25 && v < 0.4)).length;
        const signal = (extremeCount * 0.1) + (moderateCount * 0.04);
        return Math.min(0.95, 0.35 + signal);
    }

    /**
     * Generate structure chromosome
     */
    private generateStructure(traits: ContentTraits, b: (index: number) => number) {
        let topology: "flat" | "deep" | "graph" | "radial" = "flat";

        if (traits.informationDensity > 0.7 && traits.temporalUrgency > 0.6) {
            topology = "flat"; // Dashboard
        } else if (traits.temporalUrgency < 0.4 && traits.informationDensity < 0.6) {
            topology = "deep"; // Long form
        } else {
            topology = this.selectFromHash(b(0), ["flat", "deep", "graph", "radial"]);
        }

        // SHA-256 derived: does this design have sections? (~15% chance of no sections)
        const hasSections = b(1) > b(2);

        return {
            hasSections,                                    // ← SHA-256 derived existence
            sectionCount: hasSections ? this.estimateSections(traits) : 0,
            topology,
            maxNesting: Math.floor(b(3) * 4) + 1,
            scrollBehavior: traits.informationDensity > 0.7
                ? "continuous"
                : this.selectFromHash(b(22), ["continuous", "paginated", "snap"]) as "paginated" | "continuous" | "snap",
            breakpointStrategy: traits.temporalUrgency > 0.6
                ? "mobile_first"
                : this.selectFromHash(b(23), ["mobile_first", "desktop_first", "fluid"]) as "mobile_first" | "desktop_first" | "fluid",
            contentFlow: traits.informationDensity > 0.6
                ? "f_pattern"
                : this.selectFromHash(b(24), ["reading_order", "z_pattern", "f_pattern"]) as "reading_order" | "z_pattern" | "f_pattern"
        };
    }

    /**
     * Generate rhythm chromosome
     */
    private generateRhythm(traits: ContentTraits, b: (index: number) => number) {
        let density: "airtight" | "breathing" | "maximal" | "empty" = "breathing";

        if (traits.informationDensity > 0.8) density = "maximal";
        else if (traits.informationDensity > 0.6) density = "airtight";
        else if (traits.informationDensity < 0.3) density = "empty";

        const baseSpacing = Math.floor(b(4) * 12) + 8; // 8–20px — minimum 8 ensures usable spacing at all density levels

        return {
            density,
            baseSpacing,
            sectionSpacing: baseSpacing * 4,
            componentSpacing: Math.floor(baseSpacing * 0.5),
            verticalRhythm: (traits.informationDensity > 0.7 ? 4 : traits.informationDensity > 0.4 ? 8 : 12) as 4 | 8 | 12,
            negativeSpaceRatio: 1 - traits.informationDensity
        };
    }

    /**
     * Generate display typography
     */
    private generateDisplayType(traits: ContentTraits, b: (index: number) => number, profile: ReturnType<typeof getSectorProfile>, options?: GenerationOptions): DesignGenome['chromosomes']['ch3_type_display'] {
        // Trait overrides (dominant signals)
        let charge: TypeCharge = profile.defaultTypography;
        if (traits.temporalUrgency > 0.7 && traits.informationDensity > 0.6) {
            charge = "monospace";
        } else if (traits.emotionalTemperature > 0.7) {
            charge = "humanist";
        } else if (traits.emotionalTemperature < 0.3) {
            charge = "grotesque";
        } else if (traits.playfulness > 0.7) {
            charge = "expressive";
        } else if (traits.trustRequirement > 0.7) {
            charge = "transitional";
        } else if (traits.emotionalTemperature < 0.4) {
            charge = "geometric";
        } else {
            // Hash-driven variance when traits are moderate — full charge pool available
            // Prevents every "balanced" product from getting the same sector default
            const allCharges: TypeCharge[] = ["geometric", "humanist", "monospace", "transitional", "grotesque", "slab_serif", "expressive"];
            if (b(5) > b(6)) {
                charge = this.pool!.selectUniform(5, allCharges); // FIX 2: uniform selection
            }
        }

        // Fontshare doesn't carry monospace fonts — constrain to bunny/google for that charge
        const displayProviderPool: FontProvider[] = charge === "monospace"
            ? ["bunny", "google", "bunny", "google"]
            : ["bunny", "google", "fontshare", "bunny"];
        const provider: FontProvider = options?.fontProvider ||
            this.selectFromHash(b(6), displayProviderPool);
        const fontData = this.selectDisplayFont(b(5), charge, provider);

        // Tracking — hash-driven across full range when traits don't dominate
        const tracking: TypeTracking = traits.informationDensity > 0.7
            ? "tight"
            : traits.emotionalTemperature > 0.7
                ? "wide"
                : this.selectFromHash(b(25), ["normal", "tight", "wide", "ultra_tight", "ultra_wide", "tight", "normal", "wide"]);

        // Casing — uppercase more frequently for low-emotion (cold/clinical look)
        const casing = traits.emotionalTemperature < 0.3
            ? "uppercase"
            : this.selectFromHash(b(26), ["normal", "normal", "uppercase", "small_caps"]) as "normal" | "uppercase" | "small_caps";

        return {
            family: fontData.family,
            displayName: fontData.displayName,
            importUrl: fontData.importUrl,
            provider: fontData.provider,
            charge,
            weight: this.pool!.selectUniform(6, [400, 700, 900]), // FIX 2: uniform selection
            fallback: fontData.fallback,
            tracking,
            casing
        };
    }

    /**
     * Generate body typography
     */
    private generateBodyType(traits: ContentTraits, b: (index: number) => number, profile: ReturnType<typeof getSectorProfile>, options?: GenerationOptions): DesignGenome['chromosomes']['ch4_type_body'] {
        // Apply trait-based charge overrides (same logic as display, but biased toward readability)
        let charge: TypeCharge = profile.defaultTypography;

        if (traits.temporalUrgency > 0.7 && traits.informationDensity > 0.6) {
            charge = "monospace";          // Data-heavy: keep scannable
        } else if (traits.emotionalTemperature > 0.7) {
            charge = "humanist";           // Warm/empathetic: serif humanist body
        } else if (traits.playfulness > 0.7) {
            charge = "geometric";          // Playful display, legible geometric body
        } else if (traits.trustRequirement > 0.8 && traits.emotionalTemperature < 0.5) {
            charge = "transitional";       // High trust + clinical: authoritative serif
        } else if (traits.informationDensity > 0.7) {
            charge = "grotesque";          // Dense content: high-legibility grotesque
        }

        // Fontshare is display-focused and lacks monospace/grotesque coverage —
        // body fonts only come from bunny or google which have full charge coverage
        const provider: FontProvider = options?.fontProvider ||
            this.selectFromHash(b(8), ["bunny", "google", "bunny", "google"] as FontProvider[]);
        const fontData = this.selectBodyFont(b(7), charge, provider);

        return {
            family: fontData.family,
            displayName: fontData.displayName,
            importUrl: fontData.importUrl,
            provider: fontData.provider,
            charge,
            xHeightRatio: 0.5 + b(8) * 0.2,
            contrast: 0.8 + b(9) * 0.4,
            fallback: fontData.fallback,
            optimalLineLength: traits.informationDensity > 0.7
                ? "narrow"
                : traits.informationDensity < 0.35
                    ? "wide"
                    : "medium",
            paragraphSpacing: traits.temporalUrgency > 0.6 ? 1.2 : 1.6,
            hyphenation: traits.temporalUrgency < 0.4 && traits.informationDensity < 0.5
        };
    }

    /**
     * Generate primary color with sector psychology and brand integration
     * MATHEMATICAL: Uses hue/saturation/lightness ranges, NOT named colors
     */
    private generatePrimaryColor(
        b: (index: number) => number,
        primaryProfile: ReturnType<typeof getSectorProfile>,
        secondaryProfile: ReturnType<typeof getSectorProfile> | null,
        brand?: BrandConfiguration,
        brandWeight: number = 0.7,
        epigenetics?: EpigeneticData
    ) {
        // Check for brand color override
        if (brand?.colors?.primary && brandWeight > 0.5) {
            const brandHSL = this.hexToHSL(brand.colors.primary);
            const isAppropriate = this.isColorAppropriateForSector(
                brandHSL.h,
                primaryProfile.sector
            );

            const brandL = brandHSL.l / 100;
            const brandDarkL = Math.max(0.58, Math.min(0.74, brandL + 0.35));
            return {
                hue: brandHSL.h,
                saturation: brandHSL.s / 100,
                lightness: brandL,
                darkModeLightness: brandDarkL,
                temperature: this.getTemperatureFromHue(brandHSL.h),
                hex: brand.colors.primary,
                darkModeHex: this.hslToHex(brandHSL.h, brandHSL.s, brandDarkL * 100),
                sectorAppropriate: isAppropriate
            };
        }

        // Check for epigenetic override (uploaded brand assets)
        if (epigenetics?.epigeneticHue !== undefined) {
            const hue = epigenetics.epigeneticHue;
            const epiL = Math.max(0.2, b(12));
            const epiDarkL = Math.max(0.58, Math.min(0.74, epiL + 0.35));
            return {
                hue,
                saturation: Math.max(0.2, b(11)),
                lightness: epiL,
                darkModeLightness: epiDarkL,
                temperature: this.getTemperatureFromHue(hue),
                hex: this.hslToHex(hue, b(11) * 100, epiL * 100),
                darkModeHex: this.hslToHex(hue, b(11) * 100, epiDarkL * 100),
                sectorAppropriate: true
            };
        }

        // MATHEMATICAL: Generate from sector forbidden zones, NOT named colors
        // Hash selects freely from full 360° minus psychologically wrong hues
        const primarySector = primaryProfile.sector;
        let hue = generateHueFromForbidden(primarySector, Math.floor(b(10) * 255));
        let saturation = generateSaturationFromBias(primarySector, Math.floor(b(11) * 255));
        let lightness = generateLightnessFromBias(primarySector, Math.floor(b(12) * 255));

        // Blend with secondary sector if present
        if (secondaryProfile && b(13) > b(14)) {
            const secondaryHue = generateHueFromForbidden(secondaryProfile.sector, Math.floor(b(14) * 255));
            // Blend 70% primary, 30% secondary
            hue = this.blendHue(hue, secondaryHue, 0.3);
        }

        // Add entropy variation (±15 degrees)
        const variation = (b(15) - 0.5) * 30;
        hue = (hue + variation + 360) % 360;

        // Dark-mode-safe interactive variant — lifted lightness for buttons/links on dark surfaces
        // Primary at low lightness (e.g. 22%) is near-invisible on dark backgrounds (5-10% lightness)
        const darkModeLightness = Math.max(0.58, Math.min(0.74, lightness + 0.35));

        return {
            hue: Math.round(hue),
            saturation: Math.round(saturation * 100) / 100,
            lightness: Math.round(lightness * 100) / 100,
            darkModeLightness: Math.round(darkModeLightness * 100) / 100,
            temperature: this.getTemperatureFromHue(hue),
            hex: this.hslToHex(hue, saturation * 100, lightness * 100),
            darkModeHex: this.hslToHex(hue, saturation * 100, darkModeLightness * 100),
            sectorAppropriate: true
        };
    }

    /**
     * Generate color temperature
     */
    private generateColorTemp(
        primaryTemp: "warm" | "cool" | "neutral",
        profile: ReturnType<typeof getSectorProfile>,
        b: (index: number) => number
    ) {
        // Use sector warmth bias
        let backgroundTemp: "warm" | "cool" | "neutral" = primaryTemp;

        if (profile.colorProfile.warmthBias > 0.3) {
            backgroundTemp = "warm";
        } else if (profile.colorProfile.warmthBias < -0.3) {
            backgroundTemp = "cool";
        }

        // Epistasis: Warm primary forces neutral/cool background
        if (primaryTemp === "warm") {
            backgroundTemp = b(16) > b(17) ? "neutral" : "cool";
        }

        const isDark = backgroundTemp === "cool";
        // Accent: primary hue +30° rotation
        const primaryHue = Math.floor(b(13) * 360);
        const accentHue = (primaryHue + 30) % 360;
        const accentHex = this.hslToHex(accentHue, 65, isDark ? 60 : 45);
        // 4-level surface stack - hash-derived, not hardcoded
        // Dark mode: 5-15% lightness steps
        // Light mode: 95-85% lightness steps
        const surfaceStack = isDark
            ? [
                this.hslToHex(0, 0, 5 + b(20) * 5),   // 5-10% (darkest)
                this.hslToHex(0, 0, 10 + b(21) * 8),  // 10-18%
                this.hslToHex(0, 0, 18 + b(22) * 10), // 18-28%
                this.hslToHex(0, 0, 28 + b(23) * 12)  // 28-40% (lightest)
              ]
            : [
                this.hslToHex(0, 0, 98 - b(20) * 5),  // 93-98% (lightest)
                this.hslToHex(0, 0, 90 - b(21) * 8),  // 82-90%
                this.hslToHex(0, 0, 82 - b(22) * 10), // 72-82%
                this.hslToHex(0, 0, 72 - b(23) * 12)  // 60-72% (darkest)
              ];

        return {
            backgroundTemp,
            contrastRatio: 4.5 + b(17) * 10,
            surfaceColor: surfaceStack[1], // Use stack values
            elevatedSurface: surfaceStack[2],
            isDark,
            accentColor: accentHex,
            surfaceStack
        };
    }

    /**
     * Generate edge radius
     */
    private generateEdge(
        traits: ContentTraits,
        b: (index: number) => number,
        profile: ReturnType<typeof getSectorProfile>
    ) {
        const maxRadius = 32;
        const effectivePlayfulness = Math.max(0.3, traits.playfulness);
        const baseRadius = Math.round(b(1) * maxRadius * effectivePlayfulness);

        // Apply sector preference
        let radius = baseRadius;
        if (profile.edgePreference === "sharp") {
            radius = Math.min(radius, 4);
        } else if (profile.edgePreference === "organic") {
            radius = Math.max(radius, 8);
        }

        // Style — hash byte 27 can reach extended styles when traits allow
        let style: EdgeStyle;
        const organicThreshold = Math.round(maxRadius * effectivePlayfulness * 0.5);
        const sharpCeiling = profile.edgePreference === "sharp"
            ? Math.max(1, Math.round(maxRadius * effectivePlayfulness * 0.3))
            : 0;

        // Extended styles unlocked by hash — not gated behind traits
        // b(27) distributes across the full EdgeStyle vocabulary
        const styleByte = b(27);
        if (profile.edgePreference === "sharp" && radius <= sharpCeiling) {
            // Sharp preference at low radius: sharp or chiseled
            style = styleByte > 0.7 ? "chiseled" : "sharp";
        } else if (radius > organicThreshold) {
            // High radius range: organic, hand_drawn, or serrated
            if (styleByte > 0.8) style = "hand_drawn";
            else if (styleByte > 0.6) style = "serrated";
            else style = "organic";
        } else if (radius <= sharpCeiling) {
            // Low radius: sharp, brutalist, or techno
            if (styleByte > 0.75) style = "brutalist";
            else if (styleByte > 0.5) style = "techno";
            else style = "sharp";
        } else {
            // Mid radius: soft, techno, or chiseled
            if (styleByte > 0.8) style = "techno";
            else if (styleByte > 0.65) style = "chiseled";
            else style = "soft";
        }

        return {
            radius,
            style,
            variableRadius: traits.playfulness > 0.6,
            componentRadius: Math.round(radius * 0.6),
            imageRadius: Math.round(radius * 0.4),
            asymmetric: traits.playfulness > 0.8 && b(27) > b(28)
        };
    }

    /**
     * Generate motion physics
     */
    private generateMotion(
        traits: ContentTraits,
        b: (index: number) => number,
        profile: ReturnType<typeof getSectorProfile>
    ): DesignGenome['chromosomes']['ch8_motion'] {
        let physics: MotionPhysics = profile.motionPreference;

        // Trait overrides (dominant)
        if (traits.temporalUrgency > 0.8) {
            physics = "none";
        } else if (traits.playfulness > 0.7) {
            physics = "spring";
        } else if (traits.emotionalTemperature < 0.3) {
            physics = "step";
        } else {
            // Hash byte 30 selects from full physics vocabulary when traits are moderate.
            // All 8 MotionPhysics values are reachable — not just the sector default.
            const v = b(30);
            if (v > 0.875) physics = "particle";
            else if (v > 0.75)  physics = "glitch";
            else if (v > 0.625) physics = "elastic";
            else if (v > 0.5)   physics = "inertia";
            else if (v > 0.375) physics = "magnetic";
            else if (v > 0.25)  physics = "step";
            else if (v > 0.125) physics = "spring";
            // else: keep sector default
        }

        // Enter direction — reaches the full EnterDirection vocabulary
        let enterDirection: "up" | "down" | "left" | "right" | "scale" | "fade" |
            "radial_in" | "flip_x" | "flip_y" | "spiral" | "bounce" = "up";
        if (physics === "none") {
            enterDirection = "fade";
        } else if (physics === "particle" || physics === "glitch") {
            enterDirection = this.selectFromHash(b(28), ["radial_in", "flip_x", "spiral", "bounce", "scale"]) as typeof enterDirection;
        } else if (physics === "elastic" || physics === "magnetic") {
            enterDirection = this.selectFromHash(b(28), ["scale", "bounce", "spiral", "radial_in"]) as typeof enterDirection;
        } else if (traits.informationDensity > 0.7) {
            enterDirection = "fade";
        } else {
            enterDirection = this.selectFromHash(b(28), ["up", "up", "left", "right", "scale", "flip_y"]) as typeof enterDirection;
        }

        // Exit behavior — full vocabulary
        const exitBehavior = physics === "none" ? "none"
            : physics === "glitch" ? this.selectFromHash(b(29), ["explode", "rotate_out", "morph_out"]) as "explode" | "rotate_out" | "morph_out"
            : physics === "particle" ? "shrink"
            : traits.temporalUrgency > 0.6 ? "fade"
            : this.selectFromHash(b(29), ["slide", "fade", "shrink"]) as "slide" | "fade" | "shrink";

        return {
            physics,
            durationScale: 0.2 + b(14) * 1.8,
            staggerDelay: b(15) * 0.1,
            enterDirection,
            exitBehavior,
            hoverIntensity: traits.playfulness > 0.6 ? 0.6 + b(29) * 0.4 : traits.playfulness * 0.5,
            reducedMotionFallback: traits.playfulness > 0.5 ? "fade" : "none"
        };
    }

    /**
     * Generate motion choreography - hash-driven animation sequencing
     */
    private generateMotionChoreography(traits: ContentTraits, b: (index: number) => number): DesignGenome['chromosomes']['ch27_motion_choreography'] {
        // Hash-driven entry sequence
        // FIX 2: Use uniform selection to eliminate modulo bias
        const entrySequences = ["hero_first", "cascade_down", "cascade_up", "simultaneous", "stagger_center"] as const;
        const entrySequence = this.pool!.selectUniform(219, entrySequences);
        
        // Stagger interval derived from information density (dense = fast, sparse = slow)
        const staggerInterval = traits.informationDensity > 0.7 
            ? 20 + Math.floor(b(220) * 30)   // 20-50ms for dashboards
            : traits.informationDensity < 0.3 
                ? 100 + Math.floor(b(220) * 50)  // 100-150ms for editorial
                : 50 + Math.floor(b(220) * 50);  // 50-100ms default
        
        // Scroll trigger point hash-derived
        const scrollTrigger = {
            triggerPoint: 0.1 + b(221) * 0.8,  // 0.1-0.9 of viewport
            scrubIntensity: traits.temporalUrgency > 0.6 ? 0.2 + b(222) * 0.3 : 0.5 + b(222) * 0.5
        };
        
        // Hover microinteraction from playfulness
        const hoverTypes = ["scale", "color_shift", "shadow", "lift", "glow"] as const;
        const hoverMicrointeraction = {
            type: this.pool!.selectUniform(223, hoverTypes), // FIX 2: uniform selection
            intensity: traits.playfulness * 0.8 + b(224) * 0.2,
            duration: 150 + Math.floor(b(225) * 350)  // 150-500ms
        };
        
        // Page transition from topology
        const pageTransitions = ["fade", "slide", "morph", "wipe", "dissolve"] as const;
        const pageTransition = this.pool!.selectUniform(226, pageTransitions); // FIX 2: uniform selection
        
        // Choreography style from emotional temperature
        const choreographyStyles = ["elegant", "energetic", "smooth", "snappy", "dramatic"] as const;
        const styleIndex = Math.floor(
            traits.emotionalTemperature > 0.7 ? 0 + b(227) * 2 :  // elegant/smooth for warm
            traits.emotionalTemperature < 0.3 ? 3 + b(227) * 2 :  // snappy/dramatic for cold
            1 + b(227) * 3  // mixed for neutral
        );
        const choreographyStyle = choreographyStyles[styleIndex % choreographyStyles.length];
        
        return {
            entrySequence,
            staggerInterval,
            scrollTrigger,
            hoverMicrointeraction,
            pageTransition,
            choreographyStyle
        };
    }

    /**
     * Generate grid
     */
    private generateGrid(traits: ContentTraits, b: (index: number) => number): DesignGenome['chromosomes']['ch9_grid'] {
        return {
            logic: traits.informationDensity > 0.8
                ? "column"
                : this.selectFromHash(b(15), ["column", "masonry", "broken"]),
            asymmetry: 0.5 + (b(2) * 1.5 * traits.playfulness),
            columns: traits.informationDensity > 0.7 ? 4 : (traits.informationDensity > 0.4 ? 3 : 2),
            gap: Math.floor(b(16) * 24) + 8,
            mobileColumns: (traits.informationDensity > 0.7 ? 2 : 1) as 1 | 2,
            alignment: this.selectFromHash(b(30), ["stretch", "stretch", "center", "start"]) as "stretch" | "center" | "start"
        };
    }

    /**
     * Generate section types for composition strategy
     * Selects from established library categories based on traits
     */
    private generateSectionTypes(traits: ContentTraits, b: (index: number) => number): StructuralCategory[] {
        const categories: StructuralCategory[] = [];
        const count = Math.floor(b(240) * 6) + 3; // 3-8 base categories

        const allCategories: StructuralCategory[] = [
            'hero', 'content', 'cta', 'footer', 'navigation', 'sidebar',
            'feature', 'testimonial', 'faq', 'pricing', 'team', 'blog',
            'gallery', 'contact', 'metrics', 'chart', 'table', 'form',
            'media', 'social', 'trust', 'comparison', 'timeline', 'process',
            'stats', 'logo_wall', 'newsletter', 'download', 'map',
            'product', 'data', 'flow', 'interaction', 'responsive',
            'accordion', 'tabs', 'modal', 'notification', 'banner',
            'alert', 'breadcrumb', 'pagination', 'search', 'filter',
            'sort', 'loading', 'empty', 'error', 'success',
            'onboarding', 'tour', 'tooltip', 'popover', 'dropdown',
            'menu', 'toolbar', 'status_bar', 'header', 'section_divider',
            'spacer', 'divider', 'separator', 'rule', 'line',
            'border', 'frame', 'container', 'wrapper', 'panel',
            'drawer', 'sheet', 'dialog', 'overlay', 'backdrop',
            'mask', 'skeleton', 'shimmer', 'spinner', 'progress',
            'step_indicator', 'wizard', 'carousel', 'slideshow',
            'slider', 'range', 'toggle', 'switch', 'checkbox',
            'radio', 'select', 'combobox', 'autocomplete', 'tag',
            'badge', 'chip', 'pill', 'avatar', 'profile',
            'user_card', 'author_box', 'bio', 'about', 'mission',
            'vision', 'values', 'history', 'milestone', 'achievement',
            'award', 'certification', 'credential', 'license', 'permit',
            'registration', 'signup', 'login', 'logout', 'forgot_password',
            'reset_password', 'verify_email', 'verify_phone', 'two_factor',
            'captcha', 'consent', 'cookie_banner', 'privacy_notice', 'terms',
            'policy', 'disclaimer', 'notice', 'announcement', 'update',
            'release', 'version', 'changelog_section', 'roadmap_section',
            'status_section', 'uptime', 'incident', 'maintenance_section',
            'scheduled', 'planned', 'upcoming', 'past', 'archive_section',
            'legacy', 'deprecated', 'obsolete', 'retired', 'sunset',
            'end_of_life', 'migration_section', 'upgrade', 'downgrade',
            'rollback', 'revert', 'restore', 'backup_section', 'export_section',
            'import_section', 'sync', 'refresh', 'reload', 'retry',
            'resubmit', 'reprocess', 'recalculate', 'regenerate', 'rebuild',
            'redeploy', 'restart', 'reboot', 'shutdown', 'startup',
            'launch', 'deploy_section', 'publish', 'unpublish', 'draft',
            'preview_section', 'review_section', 'approve', 'reject', 'flag',
            'report_section', 'block', 'unblock', 'ban', 'unban',
            'suspend', 'reinstate', 'activate', 'deactivate', 'enable',
            'disable', 'show', 'hide', 'expand', 'collapse',
            'minimize', 'maximize', 'fullscreen_section', 'exit_fullscreen',
            'split_view_section', 'merge', 'unmerge', 'combine', 'separate',
            'group', 'ungroup', 'cluster', 'scatter', 'gather',
            'spread', 'concentrate', 'distribute', 'align', 'justify',
            'center_section', 'left_align', 'right_align', 'top_align', 'bottom_align',
            'stretch_section', 'fit', 'fill', 'cover', 'contain',
            'scale', 'resize', 'crop', 'rotate', 'flip',
            'mirror', 'invert', 'reverse', 'transpose', 'transform',
            'translate', 'skew', 'perspective', 'depth', 'elevation',
            'shadow_section', 'blur_section', 'brightness', 'contrast_section', 'saturation_section',
            'hue_rotate', 'opacity_section', 'grayscale', 'sepia', 'invert_section',
            'drop_shadow', 'inner_shadow', 'glow', 'neon', 'gradient_section',
            'pattern_section', 'texture_section', 'noise_section', 'grain', 'paper',
            'canvas_section', 'fabric', 'wood', 'metal', 'glass_section',
            'crystal', 'ice', 'water', 'fire', 'earth',
            'air', 'wind', 'storm', 'lightning', 'thunder',
            'rain', 'snow', 'hail', 'sleet', 'fog',
            'mist', 'cloud', 'sun', 'moon', 'star',
            'planet', 'galaxy', 'nebula', 'constellation', 'aurora',
            'eclipse', 'comet', 'meteor', 'asteroid', 'satellite',
            'rocket_section', 'spacecraft', 'station_section', 'colony_section', 'base_section',
            'outpost', 'settlement', 'habitat', 'dome', 'sphere',
            'cube', 'pyramid', 'cone', 'cylinder', 'torus',
            'ring', 'loop', 'circle_section', 'ellipse', 'oval',
            'square_section', 'rectangle', 'triangle', 'polygon', 'hexagon',
            'pentagon', 'octagon', 'decagon', 'dodecagon', 'icosagon',
            'star_shape', 'cross', 'plus', 'minus', 'times',
            'divide', 'equals', 'not_equals', 'greater_than', 'less_than',
            'greater_equals', 'less_equals', 'approximately', 'proportional', 'infinite_section',
            'pi', 'euler', 'golden_ratio', 'fibonacci', 'sequence',
            'series', 'sum', 'product_section', 'quotient', 'remainder',
            'modulus', 'factorial', 'exponential', 'logarithmic', 'trigonometric',
            'sin', 'cos', 'tan', 'cot', 'sec',
            'csc', 'arcsin', 'arccos', 'arctan', 'sinh',
            'cosh', 'tanh', 'coth', 'sech', 'csch',
            'inverse', 'transpose_section', 'conjugate', 'hermitian', 'unitary',
            'orthogonal', 'symmetric', 'antisymmetric', 'diagonal', 'triangular',
            'upper_triangular', 'lower_triangular', 'identity', 'zero_matrix', 'null',
            'void', 'empty_section', 'blank', 'clear', 'reset_section',
            'default_section', 'standard', 'normal', 'regular_section', 'typical',
            'common', 'usual', 'ordinary', 'everyday', 'routine',
            'habitual', 'customary', 'traditional', 'conventional', 'classic',
            'vintage', 'retro', 'antique', 'modern', 'contemporary',
            'current', 'latest', 'newest', 'recent', 'fresh',
            'new', 'novel', 'original', 'innovative', 'creative',
            'imaginative', 'inventive', 'ingenious', 'clever', 'smart',
            'intelligent', 'brilliant', 'genius', 'masterful', 'expert_section',
            'professional_section', 'skilled', 'talented', 'gifted', 'capable',
            'competent', 'qualified', 'certified', 'licensed', 'accredited',
            'approved', 'endorsed', 'recommended', 'suggested', 'advised',
            'counseled', 'guided', 'directed', 'instructed', 'taught',
            'trained', 'educated', 'learned', 'studied', 'researched',
            'investigated', 'examined', 'inspected', 'reviewed_section', 'audited',
            'assessed', 'evaluated', 'appraised', 'valued', 'rated',
            'scored', 'graded', 'ranked', 'ordered_section', 'sorted_section',
            'arranged_section', 'organized_section', 'structured_section', 'formatted', 'styled',
            'designed_section', 'crafted', 'built_section', 'constructed', 'assembled',
            'manufactured', 'produced', 'created_section', 'generated', 'formed',
            'shaped', 'molded', 'cast', 'forged', 'hammered',
            'beaten', 'pressed', 'stamped', 'embossed', 'engraved',
            'etched', 'carved', 'sculpted', 'modeled', 'rendered',
            'drawn', 'painted', 'colored', 'shaded', 'tinted',
            'toned', 'dyed', 'stained', 'varnished', 'lacquered',
            'polished', 'buffed', 'sanded', 'smoothed', 'finished',
            'completed', 'done', 'ready', 'prepared', 'set',
            'configured', 'adjusted', 'tuned', 'calibrated', 'aligned_section',
            'balanced', 'harmonized', 'synchronized', 'coordinated', 'integrated_section',
            'unified', 'consolidated_section', 'merged_section', 'combined_section', 'joined',
            'connected', 'linked', 'attached', 'bound', 'tied',
            'fastened', 'secured', 'locked', 'sealed', 'closed',
            'open', 'accessible', 'available', 'free', 'liberated',
            'released', 'unlocked', 'unsealed', 'unbound', 'untied',
            'unfastened', 'detached', 'disconnected', 'unlinked', 'separated_section',
            'divided', 'split', 'partitioned', 'segmented', 'sectioned',
            'categorized', 'classified', 'grouped', 'clustered', 'bundled',
            'packaged', 'wrapped', 'boxed', 'crated', 'palletized',
            'containerized', 'encapsulated', 'embedded_section', 'implanted', 'inserted',
            'injected', 'infused', 'inoculated', 'vaccinated', 'immunized',
            'protected', 'defended', 'guarded_section', 'shielded', 'screened',
            'filtered_section', 'sifted', 'winnowed', 'culled', 'selected',
            'chosen', 'picked', 'gathered', 'collected', 'accumulated',
            'amassed', 'hoarded', 'stocked', 'stored', 'saved',
            'preserved', 'conserved', 'maintained_section', 'sustained', 'supported',
            'upheld', 'backed', 'endorsed_section', 'sponsored', 'funded',
            'financed', 'invested', 'capitalized', 'monetized', 'commercialized',
            'marketed', 'promoted', 'advertised', 'publicized', 'broadcast',
            'transmitted', 'communicated', 'conveyed', 'delivered', 'distributed_section',
            'dispensed', 'allocated', 'assigned', 'designated', 'appointed',
            'nominated', 'elected', 'voted', 'chosen_section', 'selected_section',
            'preferred', 'favored', 'liked', 'loved', 'adored',
            'cherished', 'treasured', 'valued_section', 'prized', 'esteemed',
            'respected', 'honored', 'revered', 'venerated', 'worshipped',
            'idolized', 'glorified', 'exalted', 'elevated', 'raised',
            'lifted', 'hoisted', 'heaved', 'pulled', 'pushed',
            'shoved', 'thrust', 'driven', 'propelled', 'launched_section',
            'fired', 'shot', 'aimed', 'targeted', 'focused',
            'concentrated_section', 'centered_section', 'leveled', 'flattened', 'smoothed_section',
            'evened', 'balanced_section', 'stabilized', 'steady', 'fixed',
            'set_section', 'established', 'founded', 'instituted', 'initiated',
            'started', 'begun', 'commenced', 'opened_section', 'inaugurated',
            'introduced', 'presented_section', 'shown', 'displayed_section', 'exhibited',
            'demonstrated', 'illustrated_section', 'depicted', 'portrayed', 'represented',
            'symbolized', 'signified', 'meant', 'indicated', 'denoted',
            'connoted', 'implied', 'suggested_section', 'hinted', 'insinuated',
            'alluded', 'referenced', 'cited', 'quoted', 'paraphrased',
            'summarized', 'abstracted', 'condensed', 'compressed', 'reduced',
            'minimized', 'shrunk', 'contracted', 'narrowed', 'tightened',
            'constricted', 'restricted', 'limited', 'bounded', 'confined',
            'contained_section', 'enclosed', 'surrounded', 'encircled', 'encompassed',
            'embraced', 'included', 'comprised', 'consisted', 'constituted',
            'composed', 'formed_section', 'made', 'created_section', 'produced_section',
            'generated_section', 'yielded', 'delivered_section', 'provided', 'supplied', 'furnished',
            'equipped', 'outfitted', 'appointed_section', 'decorated', 'adorned',
            'embellished', 'ornamented', 'beautified', 'enhanced', 'improved',
            'upgraded', 'advanced', 'progressed', 'developed', 'evolved',
            'grown', 'expanded_section', 'extended', 'stretched', 'lengthened', 'prolonged',
            'protracted', 'drawn_out', 'spun_out', 'dragged', 'pulled_out',
            'extracted', 'removed', 'taken', 'withdrawn', 'retracted',
            'receded', 'faded', 'dimmed', 'darkened', 'shadowed',
            'obscured', 'hidden', 'concealed', 'covered', 'blanketed',
            'shrouded', 'veiled', 'masked', 'disguised', 'camouflaged',
            'blended', 'merged', 'fused', 'amalgamated', 'united',
            'joined_section', 'coupled', 'paired', 'matched', 'harmonized_section',
            'synchronized_section', 'coordinated_section', 'orchestrated', 'conducted', 'directed_section',
            'managed', 'administered', 'governed', 'ruled', 'controlled',
            'regulated', 'supervised', 'oversaw', 'monitored_section', 'watched',
            'observed_section', 'noticed', 'detected', 'discovered', 'found',
            'located_section', 'identified', 'recognized', 'acknowledged', 'admitted',
            'confessed', 'declared', 'stated', 'announced', 'proclaimed',
            'published', 'released_section', 'issued', 'circulated', 'spread_section',
            'disseminated', 'broadcast_section', 'transmitted_section', 'communicated_section', 'conveyed_section',
            'expressed', 'articulated', 'voiced', 'spoken', 'said',
            'told', 'related', 'narrated', 'recounted', 'described',
            'detailed', 'explained', 'clarified', 'elucidated', 'illuminated',
            'enlightened', 'informed', 'educated_section', 'taught_section', 'instructed_section',
            'trained_section', 'coached_section', 'mentored', 'guided_section', 'advised_section',
            'counseled_section', 'consulted', 'conferred', 'discussed', 'debated',
            'argued', 'disputed', 'contested', 'challenged', 'questioned',
            'queried', 'inquired', 'asked', 'requested', 'demanded',
            'required', 'needed', 'wanted', 'desired', 'wished',
            'hoped', 'expected', 'anticipated', 'predicted', 'forecast',
            'projected', 'estimated', 'calculated', 'computed', 'figured',
            'determined', 'resolved', 'decided', 'approved_section', 'accepted',
            'agreed', 'consented', 'assented', 'concurred', 'acquiesced',
            'complied', 'conformed', 'adhered', 'followed_section', 'obeyed',
            'observed_section', 'respected_section', 'honored_section', 'valued_section', 'appreciated',
            'recognized_section', 'acknowledged_section', 'thanked', 'praised', 'commended',
            'commended_section', 'applauded', 'cheered', 'celebrated', 'commemorated',
            'remembered', 'recalled', 'recollected', 'reminisced', 'reflected',
            'pondered', 'contemplated', 'meditated', 'mused', 'thought',
            'considered', 'deliberated', 'weighed', 'evaluated_section', 'assessed_section',
            'judged', 'rated_section', 'scored_section', 'graded_section', 'ranked_section',
            'ordered_section', 'arranged_section', 'organized_section', 'structured_section', 'systematized',
            'methodized', 'rationalized', 'logical', 'reasonable', 'sensible',
            'practical', 'pragmatic', 'realistic', 'grounded', 'rooted',
            'anchored', 'moored', 'tethered', 'tied_section', 'bound_section',
            'attached_section', 'connected_section', 'linked_section', 'joined_section', 'united_section',
            'combined_section', 'merged_section', 'fused_section', 'blended_section', 'mixed_section',
            'mingled', 'intermingled', 'intermixed', 'interwoven_section', 'intertwined_section',
            'interlaced', 'interlocked', 'interconnected_section', 'interrelated', 'interdependent',
            'mutual', 'reciprocal', 'shared', 'common_section', 'joint',
            'collective', 'cooperative', 'collaborative', 'participatory', 'inclusive',
            'exclusive', 'selective', 'discriminating', 'discerning', 'perceptive',
            'insightful', 'intuitive', 'instinctive', 'natural', 'innate',
            'inherent', 'intrinsic', 'essential_section', 'fundamental_section', 'basic_section',
            'elementary_section', 'primary_section', 'principal', 'chief', 'main',
            'major', 'leading', 'foremost', 'premier', 'prime',
            'first', 'initial', 'original_section', 'secondary_section', 'tertiary',
            'quaternary', 'quinary', 'senary', 'septenary', 'octonary',
            'nonary', 'denary', 'final', 'last', 'ultimate',
            'terminal', 'concluding', 'ending', 'closing', 'finishing',
            'completing', 'wrapping_up', 'summarizing', 'recapping', 'reviewing_section',
            'reflecting_section', 'looking_back', 'retrospective_section', 'hindsight', 'afterthought',
            'aftermath', 'consequence', 'result', 'outcome', 'effect',
            'impact', 'influence', 'impression', 'mark', 'trace',
            'vestige', 'remnant', 'residue', 'remainder_section', 'rest',
            'balance', 'surplus', 'excess', 'overflow', 'spillover',
            'runoff', 'drainage', 'outflow', 'inflow', 'input',
            'output', 'throughput', 'capacity_section', 'volume', 'size',
            'scale_section', 'magnitude', 'extent', 'scope', 'range',
            'span', 'reach', 'grasp', 'hold', 'grip',
            'clutch', 'clasp', 'embrace_section', 'hug', 'squeeze',
            'press_section', 'push_section', 'shove_section', 'thrust_section', 'drive_section',
            'force', 'power', 'strength', 'might', 'vigor',
            'energy', 'force_section', 'momentum', 'impetus', 'drive_section',
            'motivation', 'inspiration', 'stimulus', 'catalyst', 'spark',
            'ignition', 'kindling', 'fire_section', 'flame', 'blaze',
            'inferno', 'conflagration', 'devastation', 'destruction', 'ruin',
            'wreck', 'wreckage', 'debris', 'rubble', 'detritus',
            'refuse', 'garbage', 'trash', 'waste', 'junk',
            'scrap', 'salvage', 'rescue', 'save', 'preserve_section',
            'protect_section', 'defend_section', 'guard_section', 'shield_section', 'screen_section',
            'cover_section', 'shelter', 'harbor', 'refuge', 'sanctuary',
            'asylum', 'haven', 'retreat', 'hideaway', 'hideout',
            'lair', 'den', 'nest', 'burrow', 'hole',
            'cave_section', 'grotto', 'cavern', 'chamber', 'room_section',
            'space_section', 'area', 'zone', 'region', 'district',
            'neighborhood_section', 'locality', 'vicinity', 'proximity', 'nearness',
            'closeness', 'intimacy', 'familiarity', 'acquaintance', 'knowledge_section',
            'understanding', 'comprehension', 'grasp_section', 'apprehension', 'perception',
            'awareness', 'consciousness', 'mindfulness', 'attention', 'focus_section',
            'concentration_section', 'absorption', 'immersion', 'involvement', 'engagement',
            'participation', 'interaction_section', 'communication_section', 'connection_section', 'relationship',
            'association', 'affiliation', 'alliance_section', 'partnership', 'collaboration_section',
            'cooperation', 'coordination_section', 'synchronization_section', 'harmony', 'accord',
            'agreement_section', 'consensus', 'unity', 'solidarity', 'fellowship',
            'companionship', 'friendship', 'camaraderie', 'brotherhood', 'sisterhood',
            'kinship', 'family', 'clan', 'tribe', 'community_section',
            'society_section', 'civilization_section', 'culture', 'heritage', 'tradition',
            'custom', 'practice', 'habit', 'routine_section', 'ritual',
            'ceremony', 'celebration', 'festival', 'carnival', 'parade',
            'procession', 'march', 'walk', 'stroll', 'amble',
            'saunter', 'wander', 'roam', 'ramble', 'meander',
            'drift', 'float', 'glide', 'slide', 'slip',
            'skid', 'skate', 'ski', 'snowboard_section', 'surf',
            'sail', 'row', 'paddle', 'canoe', 'kayak',
            'raft', 'boat', 'ship', 'vessel', 'craft',
            'aircraft', 'plane', 'jet', 'helicopter_section', 'drone_section',
            'rocket_section', 'missile', 'projectile', 'bullet', 'arrow',
            'dart', 'spear', 'lance', 'javelin', 'harpoon',
            'trident', 'pitchfork', 'fork', 'spoon', 'knife',
            'blade', 'sword', 'dagger', 'stiletto', 'rapier',
            'sabre', 'scimitar', 'cutlass', 'machete', 'cleaver',
            'axe', 'hatchet', 'hammer_section', 'mallet', 'sledge',
            'maul', 'club', 'bat', 'stick', 'rod',
            'pole', 'staff', 'cane', 'crutch', 'walker',
            'wheelchair', 'scooter_section', 'skateboard_section', 'rollerblades', 'bicycle_section',
            'tricycle', 'unicycle', 'quad', 'atv', 'dirt_bike',
            'motorcycle_section', 'chopper', 'cruiser', 'sport_bike', 'touring',
            'adventure', 'dual_sport', 'enduro', 'motocross', 'supercross',
            'flat_track', 'speedway', 'ice_racing', 'hill_climb', 'drag_racing',
            'circuit_racing', 'rally', 'rallycross', 'rally_raid', 'dakar',
            'baja', 'off_road', 'on_road', 'street', 'track',
            'oval', 'road_course', 'street_course', 'drag_strip', 'quarter_mile',
            'eighth_mile', 'sixty_foot', 'thirty_thirty', 'sixty_sixty', 'hundred',
            'two_hundred', 'three_hundred', 'four_hundred', 'five_hundred', 'six_hundred',
            'seven_hundred', 'eight_hundred', 'nine_hundred', 'thousand', 'mile',
            'two_mile', 'three_mile', 'four_mile', 'five_mile', 'ten_mile',
            'twenty_mile', 'twenty_five_mile', 'thirty_mile', 'forty_mile', 'fifty_mile',
            'sixty_mile', 'seventy_mile', 'eighty_mile', 'ninety_mile', 'hundred_mile',
            'two_hundred_mile', 'three_hundred_mile', 'four_hundred_mile', 'five_hundred_mile', 'six_hundred_mile',
            'seven_hundred_mile', 'eight_hundred_mile', 'nine_hundred_mile', 'thousand_mile', 'marathon',
            'ultra', 'ironman', 'triathlon', 'duathlon', 'aquathlon',
            'biathlon', 'pentathlon', 'heptathlon', 'decathlon', 'octathlon',
            'icosathlon', 'olympics', 'paralympics', 'special_olympics', 'world_championships',
            'continental_championships', 'national_championships', 'regional_championships', 'state_championships', 'county_championships',
            'city_championships', 'local_championships', 'club_championships', 'league_championships', 'division_championships',
            'conference_championships', 'tournament', 'bracket', 'playoffs', 'semifinals',
            'quarterfinals', 'round_of_16', 'round_of_32', 'round_of_64', 'group_stage',
            'knockout_stage', 'final', 'grand_final', 'championship', 'title_match',
            'title_fight', 'championship_fight', 'championship_match', 'championship_game', 'championship_series',
            'world_series', 'super_bowl', 'world_cup', 'olympic_games', 'commonwealth_games',
            'asian_games', 'pan_american_games', 'african_games', 'european_games', 'pacific_games',
            'island_games', 'universiade', 'youth_olympics', 'junior_olympics', 'senior_olympics',
            'masters_games', 'veterans_games', 'police_games', 'fire_games', 'military_games',
            'civilian_games', 'corporate_games', 'company_games', 'office_games', 'workplace_games',
            'team_building', 'ice_breaker', 'warm_up', 'cool_down', 'stretch',
            'flex', 'bend', 'twist', 'turn', 'spin',
            'rotate', 'revolve', 'orbit', 'circle', 'loop',
            'spiral', 'helix', 'coil', 'spring', 'bounce',
            'jump', 'leap', 'hop', 'skip', 'dance',
            'waltz', 'tango', 'foxtrot', 'quickstep', 'cha_cha',
            'rumba', 'samba', 'jive', 'paso_doble', 'salsa',
            'bachata', 'merengue', 'cumbia', 'mambo', 'swing',
            'lindy_hop', 'jitterbug', 'boogie_woogie', 'rock_and_roll', 'twist_dance',
            'hustle', 'disco', 'breakdance', 'hip_hop', 'popping',
            'locking', 'krumping', 'turfing', 'liquid', 'animation',
            'robot', 'tutting', 'waving', 'gliding', 'floating',
            'sliding', 'moonwalk', 'backslide', 'side_slide', 'front_slide',
            'box_slide', 'triangle', 'square_dance', 'line_dance', 'circle_dance',
            'partner_dance', 'solo_dance', 'group_dance', 'ensemble', 'chorus',
            'choir', 'orchestra', 'band', 'combo', 'trio',
            'quartet', 'quintet', 'sextet', 'septet', 'octet',
            'nonet', 'decatet', 'ensemble_section', 'company_section', 'troupe',
            'cast', 'crew', 'team_section', 'squad', 'unit',
            'division_section', 'department', 'section_section', 'branch', 'office_section',
            'bureau', 'agency', 'organization', 'institution', 'establishment',
            'foundation', 'association', 'society_section', 'club_section', 'group_section',
            'circle', 'network', 'web', 'grid_section', 'matrix',
            'array', 'table_section', 'chart_section', 'graph', 'diagram',
            'map_section', 'plan', 'blueprint', 'schematic', 'layout_section',
            'design_section', 'pattern_section', 'template_section', 'model', 'prototype',
            'mockup', 'wireframe', 'sketch', 'drawing', 'illustration',
            'painting', 'sculpture', 'statue', 'monument', 'memorial',
            'plaque', 'inscription', 'engraving', 'etching', 'print',
            'poster', 'banner_section', 'sign', 'billboard', 'display_section',
            'exhibit', 'show', 'showcase', 'presentation_section', 'demonstration',
            'performance', 'act', 'scene', 'sequence', 'episode',
            'chapter', 'part', 'volume', 'book', 'series_section',
            'collection', 'anthology', 'compilation', 'assortment', 'variety',
            'diversity', 'range_section', 'spectrum', 'gamut', 'scope_section',
            'extent_section', 'breadth', 'width', 'depth_section', 'height',
            'length', 'size_section', 'dimension', 'measurement', 'metric',
            'standard_section', 'benchmark', 'reference', 'baseline', 'yardstick',
            'barometer', 'thermometer', 'gauge', 'meter', 'counter',
            'timer', 'clock', 'watch', 'chronometer', 'stopwatch',
            'hourglass', 'sundial', 'calendar', 'schedule', 'agenda',
            'itinerary_section', 'program_section', 'plan_section', 'strategy', 'tactic',
            'approach', 'method', 'technique', 'procedure', 'process',
            'system', 'mechanism', 'machine', 'device', 'apparatus',
            'instrument', 'tool', 'implement', 'utensil', 'appliance',
            'gadget'
        ];

        // Select unique categories based on hash
        const selected = new Set<StructuralCategory>();
        let idx = 0;
        while (selected.size < count && idx < allCategories.length) {
            const byte = b(241 + idx);
            const cat = allCategories[Math.floor(byte * allCategories.length)];
            selected.add(cat);
            idx++;
        }

        return Array.from(selected);
    }

    /**
     * Generate hierarchy
     */
    private generateHierarchy(traits: ContentTraits, b: (index: number) => number): DesignGenome['chromosomes']['ch10_hierarchy'] {
        return {
            depth: traits.informationDensity > 0.7 ? "flat" : "overlapping" as "flat" | "overlapping" | "3d-stack",
            zIndexBehavior: "isolation",
            layerBlur: b(17) * 10,
            elevationSystem: traits.emotionalTemperature < 0.3
                ? "flat"
                : traits.playfulness > 0.5
                    ? "neumorphic"
                    : "material",
            shadowScale: traits.spatialDependency > 0.5 ? 0.4 + b(31) * 0.6 : b(31) * 0.4,
            depthCues: traits.spatialDependency > 0.6
                ? this.selectFromHash(b(32), ["blur", "scale", "opacity", "blur"]) as "blur" | "scale" | "opacity" | "none"
                : "none"
        };
    }

    /**
     * Generate texture
     */
    private generateTexture(traits: ContentTraits, b: (index: number) => number): DesignGenome['chromosomes']['ch11_texture'] {
        return {
            surface: traits.emotionalTemperature > 0.6 ? "grain" : "flat" as "flat" | "grain" | "glass" | "chrome",
            noiseLevel: b(16) * 0.5,
            grainFrequency: traits.emotionalTemperature > 0.6 ? 0.3 + b(33) * 0.5 : b(33) * 0.3,
            overlayBlend: traits.emotionalTemperature > 0.6
                ? "multiply"
                : traits.emotionalTemperature < 0.3
                    ? "screen"
                    : "overlay",
            animatedTexture: traits.playfulness > 0.7 && traits.temporalUrgency < 0.5
        };
    }

    /**
     * Generate iconography - hash-driven icon system
     */
    private generateIconography(
        traits: ContentTraits,
        b: (index: number) => number,
        profile: ReturnType<typeof getSectorProfile>
    ): DesignGenome['chromosomes']['ch28_iconography'] {
        // Hash-driven style - FIX 2: uniform selection
        const styles = ["outline", "filled", "duotone", "rounded", "sharp"] as const;
        const style = this.pool!.selectUniform(228, styles);
        
        // Stroke weight from playfulness (low = thin/clean, high = bold/expressive) - FIX 2: uniform selection
        const strokeWeights = ["thin", "regular", "bold", "variable"] as const;
        const strokeWeight = traits.playfulness < 0.3 
            ? this.pool!.selectUniform(229, ["thin", "regular"] as const)
            : traits.playfulness > 0.7 
                ? this.pool!.selectUniform(229, ["bold", "variable"] as const)
                : this.pool!.selectUniform(229, strokeWeights);
        
        // Corner treatment from edge chromosome style - FIX 2: uniform selection
        const cornerTreatments = ["sharp", "rounded", "pill"] as const;
        const cornerTreatment = this.pool!.selectUniform(230, cornerTreatments);
        
        // Size scale from information density (dense = smaller icons)
        const sizeScale = traits.informationDensity > 0.7 
            ? 0.8 + b(231) * 0.2  // 0.8-1.0 for dense
            : traits.informationDensity < 0.3
                ? 1.2 + b(231) * 0.3  // 1.2-1.5 for sparse
                : 1.0 + b(231) * 0.2;  // 1.0-1.2 default
        
        // Library from emotional register - FIX 2: uniform selection
        const libraries = ["lucide", "phosphor", "heroicons", "feather", "radix"] as const;
        const library = profile.defaultTypography === "geometric" 
            ? this.pool!.selectUniform(232, ["lucide", "phosphor"] as const)
            : profile.defaultTypography === "humanist" 
                ? this.pool!.selectUniform(232, ["heroicons", "feather"] as const)
                : profile.defaultTypography === "monospace" 
                    ? "radix"
                    : this.pool!.selectUniform(232, libraries);
        
        // Color treatment from sector - FIX 2: uniform selection
        const colorTreatments = ["inherit", "primary", "secondary", "muted"] as const;
        const colorTreatment = this.pool!.selectUniform(233, colorTreatments);
        
        // Animation from playfulness - FIX 2: uniform selection
        const animations = ["none", "bounce", "pulse", "spin", "draw"] as const;
        const animation = traits.playfulness < 0.2 
            ? "none" 
            : this.pool!.selectUniform(234, ["bounce", "pulse", "spin", "draw"] as const);
        
        return {
            style,
            strokeWeight,
            cornerTreatment,
            sizeScale,
            library,
            colorTreatment,
            animation
        };
    }

    private generateAtmosphere(
        traits: ContentTraits,
        b: (index: number) => number,
        disabled: boolean
    ): DesignGenome['chromosomes']['ch13_atmosphere'] {
        if (disabled) {
            return { fx: "none" as const, intensity: 0, enabled: false,
                coverage: "element" as const, performanceBudget: "low" as const };
        }

        let fx: "glassmorphism" | "crt_noise" | "fluid_mesh" | "aurora" | "noise_gradient" |
                "holographic" | "scanlines" | "pixel_dither" | "ink_wash" |
                "chromatic_aberration" | "depth_of_field" | "banding" | "none" = "none";

        if (traits.spatialDependency > 0.4) {
            if (traits.emotionalTemperature > 0.5 && traits.informationDensity < 0.6) fx = "glassmorphism";
            else if (traits.playfulness > 0.7) fx = "fluid_mesh";
            else if (traits.informationDensity > 0.6) fx = "crt_noise";
        }

        return {
            fx,
            intensity: b(18) * traits.spatialDependency,
            enabled: fx !== "none",
            coverage: traits.spatialDependency > 0.7
                ? "full"
                : traits.spatialDependency > 0.4
                    ? "section"
                    : "element",
            performanceBudget: traits.spatialDependency > 0.7
                ? "high"
                : traits.spatialDependency > 0.4
                    ? "medium"
                    : "low"
        };
    }

    /**
     * Generate physics material
     */
    private generatePhysics(
        traits: ContentTraits,
        b: (index: number) => number,
        disabled: boolean
    ): DesignGenome['chromosomes']['ch14_physics'] {
        if (disabled) {
            return {
                material: "matte" as "neumorphism" | "metallic" | "glass" | "matte",
                roughness: 0.5,
                metalness: 0,
                transmission: 0,
                emissive: false,
                enabled: false
            };
        }

        let material: "neumorphism" | "metallic" | "glass" | "matte" = "matte";

        if (traits.spatialDependency > 0.4) {
            if (traits.emotionalTemperature > 0.6 && traits.playfulness < 0.5) material = "neumorphism";
            else if (traits.emotionalTemperature < 0.4) material = "metallic";
            else material = "glass";
        }

        return {
            material,
            roughness: b(19) * (1 - traits.playfulness),
            metalness: material === "metallic" ? 0.7 + b(34) * 0.3 : b(34) * 0.2,
            transmission: material === "glass" ? 0.8 + b(20) * 0.2 : 0,
            emissive: traits.spatialDependency > 0.8 && traits.playfulness > 0.6,
            enabled: material !== "matte"
        };
    }

    /**
     * Generate biomarker with sector awareness
     */
    private generateBiomarker(
        traits: ContentTraits,
        b: (index: number) => number,
        profile: ReturnType<typeof getSectorProfile>,
        disabled: boolean,
        enable3D?: boolean
    ): DesignGenome['chromosomes']['ch15_biomarker'] {
        // Check if 3D is appropriate for this sector
        const shouldGenerate3D = enable3D ?? profile.generate3D;

        if (disabled || !shouldGenerate3D) {
            return {
                geometry: "monolithic" as "monolithic" | "organic" | "fractal",
                shapeFamily: "geometric" as "geometric" | "biological" | "crystalline" | "fluid" | "architectural",
                animationStyle: "static" as "rotate" | "breathe" | "morph" | "static",
                polycount: "low" as "low" | "medium" | "high",
                colorTreatment: "monochrome" as "primary" | "complementary" | "monochrome",
                complexity: 0,
                enabled: false,
                usage: "none" as "hero" | "decorative" | "none"
            };
        }

        // Shape family from sector
        const shapeFamilyBySector: Record<string, "geometric" | "biological" | "crystalline" | "fluid" | "architectural"> = {
            healthcare: "biological", fintech: "crystalline", technology: "geometric",
            commerce: "geometric", education: "fluid", entertainment: "fluid",
            automotive: "architectural", manufacturing: "geometric", legal: "architectural",
            real_estate: "architectural", travel: "fluid", food: "biological", sports: "fluid"
        };
        const shapeFamily = shapeFamilyBySector[profile.sector] ?? "geometric";

        // Animation style from motion physics
        const animStyleMap: Record<string, "rotate" | "breathe" | "morph" | "static"> = {
            spring: "breathe", step: "rotate", glitch: "morph", none: "static"
        };

        let geometry: "monolithic" | "organic" | "fractal" = "monolithic";
        if (traits.playfulness > 0.6) geometry = "organic";
        else if (traits.informationDensity > 0.7) geometry = "fractal";

        return {
            geometry,
            shapeFamily,
            animationStyle: animStyleMap[profile.motionPreference] ?? "breathe",
            polycount: traits.spatialDependency > 0.7 ? "high" : traits.spatialDependency > 0.4 ? "medium" : "low",
            colorTreatment: traits.emotionalTemperature > 0.6
                ? "primary"
                : traits.emotionalTemperature < 0.3
                    ? "monochrome"
                    : "complementary",
            complexity: b(21) * traits.informationDensity,
            enabled: true,
            usage: "decorative" as "hero" | "decorative" | "none"
        };
    }

    /**
     * Generate typography scale
     */
    private generateTypography(traits: ContentTraits, b: (index: number) => number): TypographyScale {
        let ratio: number;
        if (traits.emotionalTemperature > 0.7) ratio = 1.618; // Golden ratio
        else if (traits.emotionalTemperature > 0.4) ratio = 1.5;
        else ratio = 1.25;

        let baseSize: number;
        if (traits.informationDensity > 0.8) baseSize = 14;
        else if (traits.informationDensity > 0.5) baseSize = 16;
        else baseSize = 18;

        const getLineHeight = (tightness: number) => {
            if (traits.temporalUrgency > 0.7) return (1.2 + tightness * 0.2).toFixed(2);
            if (traits.temporalUrgency > 0.4) return (1.4 + tightness * 0.2).toFixed(2);
            return (1.6 + tightness * 0.2).toFixed(2);
        };

        const getLetterSpacing = (emphasis: number) => {
            if (traits.informationDensity > 0.7) return `${-0.02 * emphasis}em`;
            if (traits.temporalUrgency > 0.7) return `${0.01 * emphasis}em`;
            return "0em";
        };

        const sizes = {
            display: Math.round(baseSize * Math.pow(ratio, 4)),
            h1: Math.round(baseSize * Math.pow(ratio, 3)),
            h2: Math.round(baseSize * Math.pow(ratio, 2)),
            h3: Math.round(baseSize * ratio),
            body: baseSize,
            small: Math.round(baseSize / Math.sqrt(ratio))
        };

        return {
            display: { size: `${sizes.display}px`, lineHeight: getLineHeight(0), letterSpacing: getLetterSpacing(0.5) },
            h1: { size: `${sizes.h1}px`, lineHeight: getLineHeight(0.2), letterSpacing: getLetterSpacing(0.3) },
            h2: { size: `${sizes.h2}px`, lineHeight: getLineHeight(0.4), letterSpacing: getLetterSpacing(0.2) },
            h3: { size: `${sizes.h3}px`, lineHeight: getLineHeight(0.6), letterSpacing: getLetterSpacing(0.1) },
            body: { size: `${sizes.body}px`, lineHeight: getLineHeight(1.0), letterSpacing: getLetterSpacing(0) },
            small: { size: `${sizes.small}px`, lineHeight: getLineHeight(0.8), letterSpacing: getLetterSpacing(0.2) },
            ratio,
            baseSize
        };
    }

    /**
     * Generate accessibility profile
     */
    private generateAccessibility(traits: ContentTraits, b: (index: number) => number): AccessibilityProfile {
        const minContrastRatio = traits.informationDensity > 0.7 ? 7.0 :
            traits.informationDensity > 0.4 ? 4.5 : 3.0;

        let focusIndicator: "outline" | "ring" | "underline" | "none" = "outline";
        if (traits.temporalUrgency > 0.8) focusIndicator = "ring";
        else if (traits.playfulness > 0.6) focusIndicator = "underline";

        return {
            minContrastRatio,
            focusIndicator,
            respectMotionPreference: traits.playfulness < 0.5,
            minTouchTarget: traits.temporalUrgency > 0.7 ? 48 : 44,
            screenReaderOptimized: traits.informationDensity > 0.6
        };
    }

    /**
     * Generate rendering strategy
     */
    private generateRendering(traits: ContentTraits, b: (index: number) => number): RenderingStrategy {
        const primaries: RenderingPrimary[] = [
            "webgl", "webgl2", "css", "css_houdini", "static", "svg", 
            "svg_js", "canvas2d", "canvas_bitmap", "video", "dom",
            "hybrid_gpu", "hybrid_canvas", "progressive", "regressive"
        ];
        
        // Select primary rendering based on traits and hash - FIX 2: uniform selection
        let primary: RenderingPrimary;
        if (traits.spatialDependency > 0.6 && traits.playfulness > 0.4) {
            primary = "webgl"; // webgl
        } else if (traits.informationDensity > 0.9) {
            primary = "static"; // static
        } else {
            primary = this.pool!.selectUniform(200, primaries);
        }

        const complexities: RenderingComplexity[] = ["minimal", "balanced", "rich", "extreme", "adaptive"];
        const antialiasOptions: ("none" | "msaa" | "fxaa" | "taa")[] = ["none", "msaa", "fxaa", "taa"];
        const shadowOptions: ("none" | "hard" | "pcf" | "pcss" | "vsm")[] = ["none", "hard", "pcf", "pcss", "vsm"];

        return {
            primary,
            fallback: primary.includes("webgl") ? "css" : (traits.playfulness < 0.2 ? "static" : "css"),
            animate: !(traits.temporalUrgency > 0.9 || (traits.playfulness < 0.3 && traits.informationDensity > 0.7)),
            // FIX 2: Use uniform selection to eliminate modulo bias
            complexity: traits.informationDensity > 0.8 ? "minimal" :
                (traits.spatialDependency > 0.6 && traits.playfulness > 0.5) ? "extreme" : 
                this.pool!.selectUniform(201, complexities),
            antialias: this.pool!.selectUniform(202, antialiasOptions),
            hdr: b(203) > b(204),
            shadowQuality: this.pool!.selectUniform(204, shadowOptions)
        };
    }

    // ==================== HERO TYPE SELECTION ====================

    private selectHeroVariant(heroType: HeroType, byte: number): HeroLayoutVariant {
        const variantsByType: Record<HeroType, HeroLayoutVariant[]> = {
            // Product-focused (4)
            product_ui: ["centered", "split_right", "full_bleed", "floating_cards"],
            product_video: ["full_bleed", "centered", "overlay"],
            configurator_3d: ["centered", "split_left", "split_right"],
            product_comparison: ["split_left", "split_right", "centered"],
            // Data/proof (4)
            stats_counter: ["centered", "split_left", "floating_cards"],
            trust_authority: ["centered", "split_left", "split_right"],
            testimonial_focus: ["centered", "split_left", "split_right"],
            social_proof_wall: ["full_bleed", "centered", "floating_cards"],
            // Utility (4)
            search_discovery: ["centered", "full_bleed"],
            calculator_tool: ["centered", "split_left", "floating_cards"],
            quiz_assessment: ["centered", "full_bleed", "overlay"],
            demo_simulator: ["full_bleed", "centered", "split_left"],
            // Content (4)
            content_carousel: ["full_bleed", "centered"],
            editorial_feature: ["full_bleed", "asymmetric", "minimal"],
            documentary_story: ["full_bleed", "asymmetric", "overlay"],
            knowledge_base: ["centered", "split_left", "minimal"],
            // Brand/emotion (4)
            brand_logo: ["centered", "minimal", "asymmetric"],
            aspirational_imagery: ["full_bleed", "overlay", "minimal"],
            manifesto_statement: ["centered", "full_bleed", "minimal"],
            cultural_moment: ["full_bleed", "overlay", "asymmetric"],
            // Experimental/spatial (4)
            portal_view: ["centered", "split_left", "full_bleed"],
            constellation_nav: ["asymmetric", "minimal", "floating_cards"],
            immersive_void: ["minimal", "overlay", "full_bleed"],
            ambient_presence: ["minimal", "asymmetric", "overlay"]
        };

        const variants = variantsByType[heroType] || ["centered"];
        return variants[Math.floor(byte * variants.length) % variants.length];
    }

    private getHeroElements(heroType: HeroType): string[] {
        const elementsByType: Record<HeroType, string[]> = {
            // Product-focused (4)
            product_ui: ["screenshot", "headline", "subheadline", "cta_primary", "cta_secondary"],
            product_video: ["video", "headline", "subheadline", "cta_primary"],
            configurator_3d: ["3d_viewer", "options", "price", "cta_primary", "headline"],
            product_comparison: ["comparison_view", "headline", "feature_list", "cta_primary"],
            // Data/proof (4)
            stats_counter: ["counter", "context", "headline", "cta_primary"],
            trust_authority: ["credentials", "headline", "subheadline", "cta_primary"],
            testimonial_focus: ["testimonial", "headline", "cta_primary"],
            social_proof_wall: ["logo_grid", "metrics", "headline", "cta_primary"],
            // Utility (4)
            search_discovery: ["search_bar", "filters", "headline"],
            calculator_tool: ["calculator", "headline", "result_display", "cta_primary"],
            quiz_assessment: ["question", "options", "progress", "headline"],
            demo_simulator: ["simulation", "controls", "headline", "cta_primary"],
            // Content (4)
            content_carousel: ["carousel", "headline", "navigation"],
            editorial_feature: ["featured_image", "headline", "excerpt", "cta_primary"],
            documentary_story: ["video", "chapter_nav", "headline", "subheadline"],
            knowledge_base: ["search", "categories", "featured_article", "headline"],
            // Brand/emotion (4)
            brand_logo: ["logo", "tagline", "cta_primary"],
            aspirational_imagery: ["image", "headline", "subheadline", "cta_primary"],
            manifesto_statement: ["statement", "signature", "cta_primary"],
            cultural_moment: ["imagery", "context", "headline", "cta_primary"],
            // Experimental/spatial (4)
            portal_view: ["portal", "headline", "subheadline", "cta_primary"],
            constellation_nav: ["nodes", "connections", "headline"],
            immersive_void: ["ambient_content", "minimal_text", "cta_primary"],
            ambient_presence: ["atmosphere", "subtle_brand", "minimal_cta"]
        };

        return elementsByType[heroType] || ["headline", "cta_primary"];
    }

    // ==================== TRUST SIGNALS ====================

    private selectTrustProminence(
        traits: ContentTraits,
        profile: ReturnType<typeof getSectorProfile>
    ): TrustProminence {
        if (traits.trustRequirement > 0.8) return "hero_feature";
        if (traits.trustRequirement > 0.6) return "prominent";
        if (traits.trustRequirement > 0.4) return "integrated";
        return "subtle";
    }

    private selectSocialProofType(byte: number, profile: ReturnType<typeof getSectorProfile>): SocialProofType {
        const weights: Record<PrimarySector, Record<SocialProofType, number>> = {
            healthcare: { none: 0, customer_logos: 0.1, user_count: 0.2, rating_stars: 0.3, testimonials_grid: 0.3, community_size: 0.05, press_mentions: 0.05 },
            fintech: { none: 0, customer_logos: 0.2, user_count: 0.3, rating_stars: 0.2, testimonials_grid: 0.15, community_size: 0.1, press_mentions: 0.05 },
            automotive: { none: 0, customer_logos: 0.1, user_count: 0.2, rating_stars: 0.3, testimonials_grid: 0.2, community_size: 0.1, press_mentions: 0.1 },
            education: { none: 0, customer_logos: 0.15, user_count: 0.25, rating_stars: 0.2, testimonials_grid: 0.25, community_size: 0.1, press_mentions: 0.05 },
            commerce: { none: 0, customer_logos: 0.1, user_count: 0.2, rating_stars: 0.4, testimonials_grid: 0.2, community_size: 0.05, press_mentions: 0.05 },
            entertainment: { none: 0, customer_logos: 0.1, user_count: 0.4, rating_stars: 0.2, testimonials_grid: 0.15, community_size: 0.1, press_mentions: 0.05 },
            manufacturing: { none: 0, customer_logos: 0.3, user_count: 0.1, rating_stars: 0.1, testimonials_grid: 0.2, community_size: 0.1, press_mentions: 0.2 },
            legal: { none: 0, customer_logos: 0.1, user_count: 0.15, rating_stars: 0.2, testimonials_grid: 0.4, community_size: 0.05, press_mentions: 0.1 },
            real_estate: { none: 0, customer_logos: 0.15, user_count: 0.15, rating_stars: 0.3, testimonials_grid: 0.3, community_size: 0.05, press_mentions: 0.05 },
            travel: { none: 0, customer_logos: 0.1, user_count: 0.2, rating_stars: 0.3, testimonials_grid: 0.25, community_size: 0.1, press_mentions: 0.05 },
            food: { none: 0, customer_logos: 0.1, user_count: 0.15, rating_stars: 0.4, testimonials_grid: 0.25, community_size: 0.05, press_mentions: 0.05 },
            sports: { none: 0, customer_logos: 0.15, user_count: 0.3, rating_stars: 0.2, testimonials_grid: 0.15, community_size: 0.15, press_mentions: 0.05 },
            technology: { none: 0, customer_logos: 0.25, user_count: 0.25, rating_stars: 0.15, testimonials_grid: 0.15, community_size: 0.1, press_mentions: 0.1 },
            nonprofit: { none: 0, customer_logos: 0.1, user_count: 0.25, rating_stars: 0.1, testimonials_grid: 0.3, community_size: 0.2, press_mentions: 0.05 },
            government: { none: 0, customer_logos: 0.1, user_count: 0.3, rating_stars: 0.05, testimonials_grid: 0.2, community_size: 0.2, press_mentions: 0.15 },
            media: { none: 0, customer_logos: 0.05, user_count: 0.3, rating_stars: 0.1, testimonials_grid: 0.1, community_size: 0.15, press_mentions: 0.30 },
            crypto_web3: { none: 0, customer_logos: 0.15, user_count: 0.35, rating_stars: 0.1, testimonials_grid: 0.1, community_size: 0.25, press_mentions: 0.05 },
            gaming: { none: 0, customer_logos: 0.1, user_count: 0.35, rating_stars: 0.25, testimonials_grid: 0.1, community_size: 0.15, press_mentions: 0.05 },
            hospitality: { none: 0, customer_logos: 0.05, user_count: 0.15, rating_stars: 0.40, testimonials_grid: 0.3, community_size: 0.05, press_mentions: 0.05 },
            beauty_fashion: { none: 0, customer_logos: 0.1, user_count: 0.2, rating_stars: 0.3, testimonials_grid: 0.25, community_size: 0.1, press_mentions: 0.05 },
            insurance: { none: 0, customer_logos: 0.15, user_count: 0.2, rating_stars: 0.25, testimonials_grid: 0.25, community_size: 0.05, press_mentions: 0.1 },
            agency: { none: 0, customer_logos: 0.30, user_count: 0.1, rating_stars: 0.1, testimonials_grid: 0.25, community_size: 0.05, press_mentions: 0.2 },
            energy: { none: 0, customer_logos: 0.25, user_count: 0.2, rating_stars: 0.05, testimonials_grid: 0.15, community_size: 0.1, press_mentions: 0.25 }
        };

        const sector = profile.sector as PrimarySector;
        const sectorWeights = weights[sector];
        const total = Object.values(sectorWeights).reduce((a: number, b: number) => (a as number) + (b as number), 0) as number;
        const threshold = (byte / 255) * total;
        let cumulative = 0;

        for (const [type, weight] of Object.entries(sectorWeights)) {
            cumulative += weight as number;
            if (cumulative >= threshold) {
                return type as SocialProofType;
            }
        }

        return "testimonials_grid";
    }

    private selectImpactType(byte: number, profile: ReturnType<typeof getSectorProfile>): ImpactDemonstration {
        const weights: Record<PrimarySector, Record<ImpactDemonstration, number>> = {
            healthcare: { live_counter: 0.1, cumulative_stats: 0.3, before_after: 0.3, roi_calculator: 0.1, timeline_progress: 0.2 },
            fintech: { live_counter: 0.4, cumulative_stats: 0.3, before_after: 0.05, roi_calculator: 0.15, timeline_progress: 0.1 },
            automotive: { live_counter: 0.1, cumulative_stats: 0.2, before_after: 0.1, roi_calculator: 0.2, timeline_progress: 0.4 },
            education: { live_counter: 0.1, cumulative_stats: 0.3, before_after: 0.2, roi_calculator: 0.2, timeline_progress: 0.2 },
            commerce: { live_counter: 0.2, cumulative_stats: 0.2, before_after: 0.1, roi_calculator: 0.3, timeline_progress: 0.2 },
            entertainment: { live_counter: 0.3, cumulative_stats: 0.4, before_after: 0.05, roi_calculator: 0.05, timeline_progress: 0.2 },
            manufacturing: { live_counter: 0.15, cumulative_stats: 0.3, before_after: 0.15, roi_calculator: 0.2, timeline_progress: 0.2 },
            legal: { live_counter: 0.05, cumulative_stats: 0.4, before_after: 0.2, roi_calculator: 0.2, timeline_progress: 0.15 },
            real_estate: { live_counter: 0.1, cumulative_stats: 0.2, before_after: 0.2, roi_calculator: 0.3, timeline_progress: 0.2 },
            travel: { live_counter: 0.2, cumulative_stats: 0.3, before_after: 0.1, roi_calculator: 0.2, timeline_progress: 0.2 },
            food: { live_counter: 0.15, cumulative_stats: 0.3, before_after: 0.1, roi_calculator: 0.15, timeline_progress: 0.3 },
            sports: { live_counter: 0.4, cumulative_stats: 0.3, before_after: 0.05, roi_calculator: 0.05, timeline_progress: 0.2 },
            technology: { live_counter: 0.3, cumulative_stats: 0.3, before_after: 0.1, roi_calculator: 0.15, timeline_progress: 0.15 },
            nonprofit: { live_counter: 0.2, cumulative_stats: 0.35, before_after: 0.2, roi_calculator: 0.05, timeline_progress: 0.2 },
            government: { live_counter: 0.1, cumulative_stats: 0.35, before_after: 0.15, roi_calculator: 0.1, timeline_progress: 0.30 },
            media: { live_counter: 0.3, cumulative_stats: 0.3, before_after: 0.05, roi_calculator: 0.05, timeline_progress: 0.30 },
            crypto_web3: { live_counter: 0.5, cumulative_stats: 0.3, before_after: 0.05, roi_calculator: 0.1, timeline_progress: 0.05 },
            gaming: { live_counter: 0.4, cumulative_stats: 0.35, before_after: 0.05, roi_calculator: 0.05, timeline_progress: 0.15 },
            hospitality: { live_counter: 0.1, cumulative_stats: 0.2, before_after: 0.2, roi_calculator: 0.2, timeline_progress: 0.30 },
            beauty_fashion: { live_counter: 0.1, cumulative_stats: 0.2, before_after: 0.35, roi_calculator: 0.1, timeline_progress: 0.25 },
            insurance: { live_counter: 0.1, cumulative_stats: 0.25, before_after: 0.15, roi_calculator: 0.35, timeline_progress: 0.15 },
            agency: { live_counter: 0.1, cumulative_stats: 0.3, before_after: 0.25, roi_calculator: 0.2, timeline_progress: 0.15 },
            energy: { live_counter: 0.2, cumulative_stats: 0.35, before_after: 0.1, roi_calculator: 0.2, timeline_progress: 0.15 }
        };

        const sector = profile.sector as PrimarySector;
        const sectorWeights = weights[sector];
        const total = Object.values(sectorWeights).reduce((a: number, b: number) => (a as number) + (b as number), 0) as number;
        const threshold = (byte / 255) * total;
        let cumulative = 0;

        for (const [type, weight] of Object.entries(sectorWeights)) {
            cumulative += weight as number;
            if (cumulative >= threshold) {
                return type as ImpactDemonstration;
            }
        }

        return "cumulative_stats";
    }

    // ==================== CONTENT STRUCTURE ====================

    private selectContentDepth(traits: ContentTraits, profile: ReturnType<typeof getSectorProfile>): ContentDepth {
        if (traits.informationDensity > 0.8) return "comprehensive";
        if (traits.informationDensity > 0.6) return "extensive";
        if (traits.informationDensity > 0.4) return "moderate";
        return "minimal";
    }

    private estimateSections(traits: ContentTraits): number {
        if (traits.informationDensity > 0.8) return 10;
        if (traits.informationDensity > 0.6) return 7;
        if (traits.informationDensity > 0.4) return 5;
        return 3;
    }

    private selectInfoArchitecture(
        traits: ContentTraits,
        profile: ReturnType<typeof getSectorProfile>
    ): InformationArchitecture {
        if (traits.conversionFocus > 0.7) return "funnel_linear";
        if (traits.informationDensity > 0.7) return "data_dashboard";
        if (traits.emotionalTemperature > 0.6) return "narrative_scroll";
        if (traits.informationDensity < 0.4) return "hub_spoke";
        return "modular_sections";
    }

    private selectPersonalization(traits: ContentTraits): PersonalizationApproach {
        if (traits.informationDensity > 0.8) return "behavior_based";
        if (traits.informationDensity > 0.6) return "segment_based";
        if (traits.temporalUrgency > 0.7) return "location_based";
        return "static";
    }

    // ==================== VISUAL TREATMENT ====================

    private selectVisualTreatment(
        profile: ReturnType<typeof getSectorProfile>,
        byte: number
    ): VisualTreatment {
        const treatmentsBySector: Record<PrimarySector, VisualTreatment[]> = {
            healthcare: ["lifestyle_photography", "documentary", "studio_product"],
            fintech: ["product_screenshots", "lifestyle_photography", "abstract_gradient"],
            automotive: ["studio_product", "lifestyle_photography", "architectural"],
            education: ["documentary", "lifestyle_photography", "illustration"],
            commerce: ["studio_product", "lifestyle_photography", "macro_detail"],
            entertainment: ["lifestyle_photography", "candid_moment", "abstract_gradient"],
            manufacturing: ["studio_product", "architectural", "macro_detail"],
            legal: ["architectural", "lifestyle_photography", "documentary"],
            real_estate: ["architectural", "lifestyle_photography", "studio_product"],
            travel: ["lifestyle_photography", "architectural", "candid_moment"],
            food: ["macro_detail", "studio_product", "lifestyle_photography"],
            sports: ["candid_moment", "lifestyle_photography", "documentary"],
            technology: ["product_screenshots", "abstract_gradient", "illustration"],
            nonprofit: ["documentary", "lifestyle_photography", "candid_moment"],
            government: ["architectural", "documentary", "lifestyle_photography"],
            media: ["candid_moment", "documentary", "lifestyle_photography"],
            crypto_web3: ["abstract_gradient", "product_screenshots", "illustration"],
            gaming: ["illustration", "abstract_gradient", "candid_moment"],
            hospitality: ["lifestyle_photography", "architectural", "macro_detail"],
            beauty_fashion: ["studio_product", "lifestyle_photography", "macro_detail"],
            insurance: ["lifestyle_photography", "documentary", "architectural"],
            agency: ["abstract_gradient", "illustration", "studio_product"],
            energy: ["architectural", "documentary", "abstract_gradient"]
        };

        const sector = profile.sector as PrimarySector;
        const treatments = treatmentsBySector[sector] || ["lifestyle_photography"];
        return treatments[Math.floor(byte * treatments.length) % treatments.length];
    }

    private selectVideoStrategy(
        profile: ReturnType<typeof getSectorProfile>,
        byte: number
    ): VideoStrategy {
        if (byte < 0.3) return "none";

        const strategiesBySector: Record<PrimarySector, VideoStrategy[]> = {
            healthcare: ["testimonial", "brand_story", "tutorial_walkthrough"],
            fintech: ["product_demo", "brand_story", "testimonial"],
            automotive: ["product_demo", "brand_story", "background_ambient"],
            education: ["tutorial_walkthrough", "brand_story", "testimonial"],
            commerce: ["product_demo", "testimonial", "brand_story"],
            entertainment: ["background_ambient", "brand_story", "live_feed"],
            manufacturing: ["product_demo", "brand_story", "tutorial_walkthrough"],
            legal: ["testimonial", "brand_story"],
            real_estate: ["background_ambient", "testimonial", "product_demo"],
            travel: ["background_ambient", "brand_story", "testimonial"],
            food: ["product_demo", "background_ambient", "brand_story"],
            sports: ["background_ambient", "brand_story", "live_feed"],
            technology: ["product_demo", "brand_story", "tutorial_walkthrough"],
            nonprofit: ["brand_story", "testimonial", "tutorial_walkthrough"],
            government: ["brand_story", "tutorial_walkthrough"],
            media: ["background_ambient", "brand_story", "live_feed"],
            crypto_web3: ["product_demo", "tutorial_walkthrough", "brand_story"],
            gaming: ["background_ambient", "brand_story", "live_feed"],
            hospitality: ["background_ambient", "brand_story", "testimonial"],
            beauty_fashion: ["product_demo", "brand_story", "testimonial"],
            insurance: ["testimonial", "brand_story", "tutorial_walkthrough"],
            agency: ["brand_story", "product_demo", "background_ambient"],
            energy: ["brand_story", "product_demo", "testimonial"]
        };

        const sector = profile.sector as PrimarySector;
        const strategies = strategiesBySector[sector] || ["brand_story"];
        return strategies[Math.floor(byte * strategies.length) % strategies.length];
    }

    // ==================== UTILITY FUNCTIONS ====================

    private selectFromHash<T>(byte: number, options: T[]): T {
        // byte is a float in [0.0, 1.0) from b(n) = buffer[n] / 255
        // Using modulo on a <1 float always returns near-0, causing options[0] every time.
        // Fix: scale to index range first, then modulo for safety.
        return options[Math.floor(byte * options.length) % options.length];
    }

    private selectDisplayFont(byte: number, charge: string, provider: FontProvider = "bunny") {
        const cssStackFallbacks: Record<string, string> = {
            geometric:    "system-ui, -apple-system, sans-serif",
            humanist:     "Georgia, 'Times New Roman', serif",
            grotesque:    "Helvetica, Arial, sans-serif",
            monospace:    "'Courier New', Courier, monospace",
            transitional: "Georgia, serif",
            slab_serif:   "serif",
            expressive:   "cursive, sans-serif"
        };

        const pool = fontCatalog.getFonts(charge as TypeCharge, provider);
        const selected = pool[Math.floor(byte * pool.length) % pool.length];
        const fallback = cssStackFallbacks[charge] || cssStackFallbacks.geometric;

        return {
            family:      `${selected}, ${fallback}`,
            displayName: selected,
            importUrl:   this.getFontImportUrl(selected, provider, [400, 700]),
            provider,
            fallback
        };
    }

    private selectBodyFont(byte: number, charge: string, provider: FontProvider = "bunny") {
        const cssStackFallbacks: Record<string, string> = {
            geometric:    "system-ui, -apple-system, sans-serif",
            humanist:     "Georgia, serif",
            grotesque:    "Arial, sans-serif",
            monospace:    "monospace",
            transitional: "serif",
            slab_serif:   "serif",
            expressive:   "sans-serif"
        };

        const pool = fontCatalog.getFonts(charge as TypeCharge, provider);
        const selected = pool[Math.floor(byte * pool.length) % pool.length];
        const fallback = cssStackFallbacks[charge] || cssStackFallbacks.geometric;

        return {
            family:      `${selected}, ${fallback}`,
            displayName: selected,
            importUrl:   this.getFontImportUrl(selected, provider, [400, 700]),
            provider,
            fallback
        };
    }

    private getFontImportUrl(fontName: string, provider: FontProvider, weights: number[]): string {
        if (provider === "none") return "";

        const slug = fontName.toLowerCase().replace(/ /g, "-");

        if (provider === "fontshare") {
            return `https://api.fontshare.com/v2/css?f[]=${slug}@${weights.join(",")}&display=swap`;
        }

        if (provider === "google") {
            const googleName = fontName.replace(/ /g, "+");
            return `https://fonts.googleapis.com/css2?family=${googleName}:wght@${weights.join(";")}&display=swap`;
        }

        // Bunny Fonts (default)
        return `https://fonts.bunny.net/css?family=${slug}:${weights.join(",")}&display=swap`;
    }

    private isColorAppropriateForSector(hue: number, sector: PrimarySector): boolean {
        // Simple appropriateness check
        // Healthcare: blues, greens (180-240)
        // Fintech: blues, purples (240-300)
        // etc.
        const appropriateRanges: Record<PrimarySector, [number, number][]> = {
            healthcare: [[180, 240], [90, 150]], // Blues, greens
            fintech: [[220, 300]], // Blues, purples
            automotive: [[0, 45], [190, 250], [340, 360]], // Red/orange (sport), blues (luxury/electric), wrap-reds
            education: [[200, 280], [100, 140]], // Blues, greens
            commerce: [[10, 50], [0, 20], [320, 360], [180, 230]], // Appetite oranges/reds, trust blues
            entertainment: [[0, 360]], // Any
            manufacturing: [[200, 240]], // Blues
            legal: [[220, 260]], // Navy blues
            real_estate: [[180, 220], [30, 60]], // Blues, earth tones
            travel: [[170, 210], [20, 50]], // Teals, oranges
            food: [[10, 50], [90, 150]], // Oranges, greens
            sports: [[0, 60], [200, 260]], // Red/orange, blue
            technology: [[200, 280]], // Blues, purples
            nonprofit: [[180, 240], [90, 130]], // Blues, greens (hopeful, trustworthy)
            government: [[200, 260]], // Navy/institutional blues
            media: [[0, 360]], // Any (media is sector-agnostic)
            crypto_web3: [[260, 310], [180, 230]], // Purples, cyans
            gaming: [[0, 360]], // Any (gaming is expressive)
            hospitality: [[20, 60], [170, 210]], // Warm ambers, ocean teals
            beauty_fashion: [[300, 360], [0, 30], [280, 330]], // Pinks, reds, mauves
            insurance: [[200, 260], [150, 200]], // Blues, teals
            agency: [[0, 360]], // Any (agencies adapt to clients)
            energy: [[80, 150], [30, 60], [200, 240]] // Greens, ambers, blues
        };

        const ranges = appropriateRanges[sector];
        return ranges.some(([min, max]) => hue >= min && hue <= max);
    }

    private getTemperatureFromHue(hue: number): "warm" | "cool" | "neutral" {
        // Warm:    0-45 (reds, oranges) + 330-360 (reds wrapping)
        // Neutral: 45-75 (yellow-greens) + 150-190 (blue-greens / teals)
        // Cool:    75-150 (greens) + 190-330 (blues, indigos, purples, violet, magenta)
        if (hue < 45 || hue >= 330) return "warm";         // Reds, oranges wrap
        if (hue >= 45 && hue < 75) return "neutral";        // Yellow / yellow-green
        if (hue >= 75 && hue < 190) return "cool";          // Greens and teals
        if (hue >= 190 && hue < 330) return "cool";         // Blues, purple, violet, magenta
        return "neutral";
    }

    private blendHue(h1: number, h2: number, weight: number): number {
        // Handle circular hue blending
        let diff = h2 - h1;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        return (h1 + diff * weight + 360) % 360;
    }

    private hexToHSL(hex: string): { h: number; s: number; l: number } {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return { h: h * 360, s: s * 100, l: l * 100 };
    }

    private hslToHex(h: number, s: number, l: number): string {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = (n: number) => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    /**
     * Generate a genome from a named archetype.
     * Each archetype maps to a semantically correct sector AND a bespoke trait preset
     * so the output is immediately appropriate — not just a neutral genome with a sector label.
     */
    generateFromArchetype(archetypeName: string, seed: string): DesignGenome {
        type ArchetypeConfig = { sector: PrimarySector; traits: ContentTraits };

        const archetypes: Record<string, ArchetypeConfig> = {
            // ── Data & Tooling ──────────────────────────────────────────────
            dashboard: {
                sector: "technology",
                traits: {
                    informationDensity: 0.9, temporalUrgency: 0.8, emotionalTemperature: 0.2,
                    playfulness: 0.1, spatialDependency: 0.2, trustRequirement: 0.6,
                    visualEmphasis: 0.3, conversionFocus: 0.2
                }
            },
            documentation: {
                sector: "education",
                traits: {
                    informationDensity: 0.8, temporalUrgency: 0.2, emotionalTemperature: 0.3,
                    playfulness: 0.1, spatialDependency: 0.1, trustRequirement: 0.5,
                    visualEmphasis: 0.2, conversionFocus: 0.1
                }
            },
            "dev-tool": {
                sector: "technology",
                traits: {
                    informationDensity: 0.7, temporalUrgency: 0.5, emotionalTemperature: 0.2,
                    playfulness: 0.3, spatialDependency: 0.2, trustRequirement: 0.6,
                    visualEmphasis: 0.2, conversionFocus: 0.5
                }
            },

            // ── Portfolios ───────────────────────────────────────────────────
            portfolio: {
                sector: "entertainment",  // creative portfolio → entertainment, not technology
                traits: {
                    informationDensity: 0.3, temporalUrgency: 0.2, emotionalTemperature: 0.7,
                    playfulness: 0.8, spatialDependency: 0.6, trustRequirement: 0.2,
                    visualEmphasis: 0.9, conversionFocus: 0.2
                }
            },
            "agency-portfolio": {
                sector: "entertainment",
                traits: {
                    informationDensity: 0.4, temporalUrgency: 0.3, emotionalTemperature: 0.7,
                    playfulness: 0.75, spatialDependency: 0.7, trustRequirement: 0.4,
                    visualEmphasis: 0.9, conversionFocus: 0.5
                }
            },

            // ── Commerce ─────────────────────────────────────────────────────
            commerce: {
                sector: "commerce",
                traits: {
                    informationDensity: 0.55, temporalUrgency: 0.6, emotionalTemperature: 0.6,
                    playfulness: 0.4, spatialDependency: 0.3, trustRequirement: 0.7,
                    visualEmphasis: 0.8, conversionFocus: 0.9
                }
            },
            "luxury-commerce": {
                sector: "commerce",
                traits: {
                    informationDensity: 0.2, temporalUrgency: 0.1, emotionalTemperature: 0.6,
                    playfulness: 0.3, spatialDependency: 0.5, trustRequirement: 0.6,
                    visualEmphasis: 0.95, conversionFocus: 0.6
                }
            },

            // ── SaaS / Product Landings ───────────────────────────────────────
            landing: {
                sector: "technology",   // generic: assume tech SaaS
                traits: {
                    informationDensity: 0.5, temporalUrgency: 0.5, emotionalTemperature: 0.5,
                    playfulness: 0.4, spatialDependency: 0.4, trustRequirement: 0.6,
                    visualEmphasis: 0.6, conversionFocus: 0.8
                }
            },
            "saas-landing": {
                sector: "technology",
                traits: {
                    informationDensity: 0.6, temporalUrgency: 0.5, emotionalTemperature: 0.45,
                    playfulness: 0.35, spatialDependency: 0.5, trustRequirement: 0.7,
                    visualEmphasis: 0.65, conversionFocus: 0.85
                }
            },
            "fintech-landing": {
                sector: "fintech",
                traits: {
                    informationDensity: 0.65, temporalUrgency: 0.6, emotionalTemperature: 0.35,
                    playfulness: 0.2, spatialDependency: 0.35, trustRequirement: 0.9,
                    visualEmphasis: 0.5, conversionFocus: 0.85
                }
            },
            "medical-landing": {
                sector: "healthcare",
                traits: {
                    informationDensity: 0.55, temporalUrgency: 0.3, emotionalTemperature: 0.7,
                    playfulness: 0.2, spatialDependency: 0.25, trustRequirement: 0.95,
                    visualEmphasis: 0.55, conversionFocus: 0.65
                }
            },

            // ── Editorial / Content ───────────────────────────────────────────
            blog: {
                sector: "entertainment",
                traits: {
                    informationDensity: 0.5, temporalUrgency: 0.4, emotionalTemperature: 0.65,
                    playfulness: 0.5, spatialDependency: 0.15, trustRequirement: 0.3,
                    visualEmphasis: 0.6, conversionFocus: 0.15
                }
            },
            magazine: {
                sector: "entertainment",
                traits: {
                    informationDensity: 0.65, temporalUrgency: 0.6, emotionalTemperature: 0.65,
                    playfulness: 0.55, spatialDependency: 0.25, trustRequirement: 0.3,
                    visualEmphasis: 0.8, conversionFocus: 0.2
                }
            },

            // ── Other verticals ───────────────────────────────────────────────
            "real-estate": {
                sector: "real_estate",
                traits: {
                    informationDensity: 0.5, temporalUrgency: 0.4, emotionalTemperature: 0.6,
                    playfulness: 0.25, spatialDependency: 0.55, trustRequirement: 0.75,
                    visualEmphasis: 0.85, conversionFocus: 0.7
                }
            },
            restaurant: {
                sector: "food",
                traits: {
                    informationDensity: 0.35, temporalUrgency: 0.4, emotionalTemperature: 0.8,
                    playfulness: 0.5, spatialDependency: 0.35, trustRequirement: 0.4,
                    visualEmphasis: 0.9, conversionFocus: 0.6
                }
            },
            "non-profit": {
                sector: "healthcare",   // closest — trust + warmth without sales pressure
                traits: {
                    informationDensity: 0.45, temporalUrgency: 0.35, emotionalTemperature: 0.85,
                    playfulness: 0.4, spatialDependency: 0.2, trustRequirement: 0.75,
                    visualEmphasis: 0.7, conversionFocus: 0.3
                }
            },
        };

        const config = archetypes[archetypeName];

        if (!config) {
            // Unknown archetype: use a safe neutral preset rather than hardcoding 'technology'
            // Unknown archetype, using neutral defaults
            return this.generate(seed,
                {
                    informationDensity: 0.5, temporalUrgency: 0.5, emotionalTemperature: 0.5,
                    playfulness: 0.5, spatialDependency: 0.3, trustRequirement: 0.5,
                    visualEmphasis: 0.5, conversionFocus: 0.5
                },
                { primarySector: "technology", options: { creativityLevel: "balanced" } }
            );
        }

        return this.generate(seed, config.traits, {
            primarySector: config.sector,
            options: { creativityLevel: "balanced" }
        });
    }
}
