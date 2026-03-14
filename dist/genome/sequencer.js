/**
 * Permutations MCP - Genome Sequencer
 *
 * Enhanced sequencer with sector awareness, content analysis,
 * hero type selection, and brand integration.
 */
import * as crypto from "crypto";
import { GenomeConstraintSolver } from "./constraint-solver.js";
import { getSectorProfile, generateHueFromBias, generateSaturationFromBias, generateLightnessFromBias, selectHeroType, selectTrustApproach, SUB_SECTOR_KEYWORDS } from "./sector-profiles.js";
import { COPY_PATTERN_BANKS, generateHeadlineFromPatterns, generateCTAFromPatterns, generateTaglineFromPatterns, generateSentenceFromTemplate } from "./copy-patterns.js";
export class GenomeSequencer {
    /**
     * Generate a design genome with full sector awareness
     */
    generate(seed, traits, config, epigenetics) {
        const hash = crypto.createHash("sha256").update(seed).digest("hex");
        const bytes = Buffer.from(hash, 'hex');
        const b = (index) => bytes[index % 32] / 255; // Wrap around 32-byte hash
        const { primarySector, secondarySector, brand, options } = config;
        // Get sector profiles
        const primaryProfile = getSectorProfile(primarySector);
        const secondaryProfile = secondarySector ? getSectorProfile(secondarySector) : null;
        // Classify sub-sector from content
        const { subSector, confidence: subSectorConfidenceValue } = this.classifySubSectorFromTraits(traits, primarySector);
        // Determine weights (brand vs sector vs content)
        const brandWeight = options?.brandWeight ?? brand?.weight ?? 0.7;
        const sectorWeight = options?.sectorWeight ?? 0.5;
        // Generate chromosomes
        const chromosomes = this.generateChromosomes({
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
        const genome = {
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
        // Apply constraint solver
        const solver = new GenomeConstraintSolver();
        const result = solver.solve(genome);
        // Add generation rationale
        genome.generation.rationale = result.rationale;
        return result.genome;
    }
    /**
     * Generate all chromosomes
     */
    generateChromosomes(params) {
        const { hash, bytes, b, traits, primaryProfile, secondaryProfile, subSector, subSectorConfidence, brand, brandWeight, sectorWeight, epigenetics, options } = params;
        // Check if chromosomes are disabled
        const isDisabled = (ch) => options?.disabledChromosomes?.includes(ch) ?? false;
        const isForced = (ch) => options?.forcedChromosomes?.[ch];
        // Sector Chromosomes
        const ch0_sector_primary = isForced('ch0_sector_primary') || {
            sector: primaryProfile.sector,
            influence: sectorWeight
        };
        const ch0_sector_secondary = isForced('ch0_sector_secondary') || {
            sector: secondaryProfile?.sector || null,
            influence: secondaryProfile ? (1 - sectorWeight) * 0.3 : 0
        };
        const ch0_sub_sector = isForced('ch0_sub_sector') || {
            classification: subSector,
            confidence: subSectorConfidence,
            keywords: this.extractKeywords(traits)
        };
        const ch0_brand_weight = isForced('ch0_brand_weight') || {
            brandVsSector: brandWeight,
            appliedOverrides: []
        };
        // Original Chromosomes (1-18)
        const ch1_structure = isForced('ch1_structure') || this.generateStructure(traits, b);
        const ch2_rhythm = isForced('ch2_rhythm') || this.generateRhythm(traits, b);
        const ch3_type_display = isForced('ch3_type_display') || this.generateDisplayType(traits, b, primaryProfile, options);
        const ch4_type_body = isForced('ch4_type_body') || this.generateBodyType(traits, b, primaryProfile, options);
        const ch5_color_primary = isForced('ch5_color_primary') || this.generatePrimaryColor(b, primaryProfile, secondaryProfile, brand, brandWeight, epigenetics);
        const ch6_color_temp = isForced('ch6_color_temp') || this.generateColorTemp(ch5_color_primary.temperature, primaryProfile, b);
        const ch7_edge = isForced('ch7_edge') || this.generateEdge(traits, b, primaryProfile);
        const ch8_motion = isForced('ch8_motion') || this.generateMotion(traits, b, primaryProfile);
        const ch27_motion_choreography = isForced('ch27_motion_choreography') || this.generateMotionChoreography(traits, b);
        const ch9_grid = isForced('ch9_grid') || this.generateGrid(traits, b);
        const ch10_hierarchy = isForced('ch10_hierarchy') || this.generateHierarchy(traits, b);
        const ch11_texture = isForced('ch11_texture') || this.generateTexture(traits, b);
        const ch12_signature = isForced('ch12_signature') || {
            entropy: b(17),
            uniqueMutation: hash.slice(0, 8),
            variantSeed: b(18) // Byte 18 — distinct from entropy (byte 17)
        };
        const ch28_iconography = isForced('ch28_iconography') || this.generateIconography(traits, b, primaryProfile);
        const ch13_atmosphere = isForced('ch13_atmosphere') || this.generateAtmosphere(traits, b, isDisabled('ch13_atmosphere'));
        const ch14_physics = isForced('ch14_physics') || this.generatePhysics(traits, b, isDisabled('ch14_physics'));
        const ch15_biomarker = isForced('ch15_biomarker') || this.generateBiomarker(traits, b, primaryProfile, isDisabled('ch15_biomarker'), options?.enable3D);
        const ch16_typography = isForced('ch16_typography') || this.generateTypography(traits, b);
        const ch17_accessibility = isForced('ch17_accessibility') || this.generateAccessibility(traits, b);
        const ch18_rendering = isForced('ch18_rendering') || this.generateRendering(traits, b);
        // Hero & Visual Chromosomes (19-20)
        const forcedHero = isForced('ch19_hero_type');
        const heroType = forcedHero?.type ||
            selectHeroType(primaryProfile.sector, Math.floor(b(101) * 255));
        const heroVariant = forcedHero?.variant ||
            this.selectHeroVariant(heroType, b(102));
        const ch19_hero_type = forcedHero || {
            type: heroType,
            variant: heroVariant,
            variantIndex: Math.floor(b(30) * 10) % 10, // Use byte 30, wrap to 0-9
            contentSource: undefined
        };
        const ch19_hero_variant_detail = isForced('ch19_hero_variant_detail') || {
            layout: heroVariant,
            elements: this.getHeroElements(heroType),
            alignment: this.selectFromHash(b(103), ["left", "center", "right"]),
            textPosition: this.selectFromHash(b(104), ["overlay", "adjacent", "below"]),
            height: traits.spatialDependency > 0.6 ? "full" : traits.informationDensity > 0.7 ? "compact" : "large",
            backgroundTreatment: heroType === "product_video" || heroType === "aspirational_imagery"
                ? (b(118) > 0.5 ? "video" : "image")
                : traits.spatialDependency > 0.6 ? "mesh" : "solid",
            overlayOpacity: 0.3 + b(119) * 0.5,
            mobileBehavior: traits.informationDensity > 0.7
                ? "stack"
                : this.selectFromHash(b(120), ["stack", "collapse_image", "full_bleed"])
        };
        const ch20_visual_treatment = isForced('ch20_visual_treatment') || {
            treatment: this.selectVisualTreatment(primaryProfile, b(105)),
            videoStrategy: this.selectVideoStrategy(primaryProfile, b(106)),
            imageTreatment: this.selectFromHash(b(107), ["natural", "high_contrast", "warm", "cool", "monochrome"]),
            hasVideo: b(106) > 0.7,
            imageAspectRatio: this.selectFromHash(b(121), ["16:9", "4:3", "1:1", "portrait"]),
            colorGrading: traits.emotionalTemperature > 0.7
                ? "vibrant"
                : traits.emotionalTemperature < 0.3
                    ? "desaturated"
                    : this.selectFromHash(b(122), ["natural", "natural", "desaturated", "duotone"]),
            imageCount: traits.informationDensity > 0.7 ? 1 : traits.visualEmphasis > 0.6 ? "many" : 3
        };
        // Trust & Social Chromosomes (21-22)
        const forcedTrust = isForced('ch21_trust_signals');
        const trustApproach = forcedTrust?.approach ||
            selectTrustApproach(primaryProfile.sector, Math.floor(b(108) * 255));
        const ch21_trust_signals = forcedTrust || {
            approach: trustApproach,
            prominence: this.selectTrustProminence(traits, primaryProfile),
            layoutVariant: `trust_${trustApproach}_${Math.floor(b(109) * 5)}`,
            contentProvided: false,
            suggestedStats: ["{{STAT_1}}", "{{STAT_2}}", "{{STAT_3}}"],
            animationType: traits.informationDensity > 0.7
                ? "count_up"
                : traits.temporalUrgency > 0.6
                    ? "fade_in"
                    : "none"
        };
        // Populate trust content with template tokens (not fake data)
        const ch21_trust_content = isForced('ch21_trust_content') || {
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
        };
        const ch22_social_proof = isForced('ch22_social_proof') || {
            type: this.selectSocialProofType(b(110), primaryProfile),
            prominence: this.selectTrustProminence(traits, primaryProfile),
            layout: this.selectFromHash(b(111), ["grid", "marquee", "carousel", "static"]),
            logoCount: (traits.conversionFocus > 0.6 ? 8 : traits.informationDensity > 0.5 ? 5 : 3),
            updateFrequency: traits.temporalUrgency > 0.7 ? "realtime" : traits.temporalUrgency > 0.4 ? "daily" : "static",
            displayStyle: traits.trustRequirement > 0.6
                ? "full_testimonial"
                : traits.informationDensity > 0.6
                    ? "logos_only"
                    : "logos_with_name"
        };
        const ch22_impact_demonstration = isForced('ch22_impact_demonstration') || {
            type: this.selectImpactType(b(112), primaryProfile),
            realTime: b(113) > 0.7,
            interactive: b(114) > 0.6,
            animationTrigger: traits.temporalUrgency > 0.6
                ? "page_load"
                : this.selectFromHash(b(123), ["scroll_enter", "scroll_enter", "page_load", "hover"]),
            counterFormat: traits.informationDensity > 0.7
                ? "abbreviated"
                : traits.conversionFocus > 0.6
                    ? "full"
                    : "abbreviated"
        };
        // Content Structure Chromosomes (23-24)
        const ch23_content_depth = isForced('ch23_content_depth') || {
            level: this.selectContentDepth(traits, primaryProfile),
            estimatedSections: this.estimateSections(traits),
            hasHero: true,
            hasFeatures: traits.informationDensity > 0.4 || traits.conversionFocus > 0.3,
            hasCTA: traits.conversionFocus > 0.5,
            hasFAQ: traits.informationDensity > 0.6,
            hasTestimonials: traits.trustRequirement > 0.6
        };
        const ch23_information_architecture = isForced('ch23_information_architecture') || {
            pattern: this.selectInfoArchitecture(traits, primaryProfile),
            navigationType: this.selectFromHash(b(115), ["header", "sidebar", "floating", "minimal"]),
            footerType: this.selectFromHash(b(116), ["full", "minimal", "none"])
        };
        const ch24_personalization = isForced('ch24_personalization') || {
            approach: this.selectPersonalization(traits),
            dynamicContent: b(117) > 0.7,
            userSegmentation: traits.informationDensity > 0.7,
            abTestingReady: traits.conversionFocus > 0.5,
            segmentCount: (traits.informationDensity > 0.7 ? 4 : traits.informationDensity > 0.4 ? 3 : 2)
        };
        const ch25_copy_engine = isForced('ch25_copy_engine') || this.generateCopyEngine(primaryProfile, b, options?.copyIntelligence, options?.copy);
        const ch26_copy_intelligence = options?.copyIntelligence || this.generateDefaultCopyIntelligence(primaryProfile);
        // Ensure ch25 uses the same intelligence for consistency
        if (options?.copyIntelligence && !isForced('ch25_copy_engine')) {
            // Regenerate copy engine with the provided intelligence
            const regeneratedCopy = this.generateCopyEngine(primaryProfile, b, options.copyIntelligence, options.copy);
            // Copy regenerated content back to ch25_copy_engine
            Object.assign(ch25_copy_engine, regeneratedCopy);
        }
        // Civilization Chromosomes (30–32)
        // Always generated from hash bytes; only read when complexity >= 0.81 (tribal+).
        // b() wraps at 32, so indices 219-224 map deterministically via modulo.
        const ch30_state_topology = isForced('ch30_state_topology') || {
            topology: this.selectFromHash(b(219), [
                'local', 'shared_context', 'reactive_store', 'distributed', 'federated'
            ]),
            sharedSurfaces: Math.floor(b(220) * 6) // 0–5
        };
        const ch31_routing_pattern = isForced('ch31_routing_pattern') || {
            pattern: this.selectFromHash(b(221), [
                'single_page', 'multi_page', 'protected', 'platform', 'federated'
            ]),
            guardedRoutes: Math.floor(b(222) * 9) // 0–8
        };
        const ch32_token_inheritance = isForced('ch32_token_inheritance') || {
            inheritance: this.selectFromHash(b(223), [
                'flat', 'semantic', 'component', 'governed', 'cross_system'
            ]),
            themeLayers: Math.floor(b(224) * 4) + 1 // 1–4
        };
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
            ch29_copy_intelligence: ch26_copy_intelligence,
            ch26_color_system: this.generateColorSystem(ch5_color_primary, primaryProfile, b),
            ch30_state_topology,
            ch31_routing_pattern,
            ch32_token_inheritance
        };
    }
    /**
     * Generate complete color system with hash-driven harmony
     */
    generateColorSystem(primary, profile, b) {
        // Hash-derived secondary color relationship
        const relationships = ["complementary", "analogous", "split", "triadic"];
        const relationship = relationships[Math.floor(b(208) * relationships.length)];
        let secondaryHue;
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
            usage: ["cta", "highlight", "alert", "success"][Math.floor(b(217) * 4)]
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
        const neutralScale = [];
        for (let i = 0; i < 9; i++) {
            const lightness = 5 + i * 11; // 5, 16, 27, 38, 49, 60, 71, 82, 93 (already 0-100)
            const saturation = tintStrength * (1 - Math.abs(i - 4) / 4) * 100; // 0-30% converted to 0-100
            neutralScale.push(this.hslToHex(primary.hue, saturation, lightness));
        }
        // Dark mode surfaces
        const darkModeSurfaces = [];
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
            }
        };
    }
    /**
     * Generate copy engine — LLM output only, no pattern fallback.
     * All copy is derived from intent via the extractor. Pattern banks are not used here.
     */
    generateCopyEngine(profile, b, copyIntelligence, copy) {
        if (copy) {
            return {
                headline: copy.headline,
                subheadline: copy.subheadline,
                cta: copy.cta,
                ctaSecondary: copy.ctaSecondary,
                tagline: copy.tagline,
                companyName: copy.companyName,
                authorName: copy.authorName,
                authorTitle: copy.authorTitle,
                testimonial: copy.testimonial,
                sectionTitleTestimonials: copy.sectionTitleTestimonials,
                sectionTitleFeatures: copy.sectionTitleFeatures,
                sectionTitleFAQ: copy.sectionTitleFAQ,
                stats: copy.stats,
                faq: copy.faq,
                features: copy.features,
                footerProductTitle: copy.footerProductTitle,
                footerCompanyTitle: copy.footerCompanyTitle,
                footerNavProduct: copy.footerNavProduct,
                footerNavCompany: copy.footerNavCompany,
            };
        }
        // No LLM — structural copy from pattern banks, all personal/content fields empty.
        // HTML generator skips sections with empty content.
        const ci = copyIntelligence || this.generateDefaultCopyIntelligence(profile);
        const sector = profile.sector;
        return {
            headline: generateHeadlineFromPatterns(ci.headlineStyle, sector, ci.emotionalRegister, b),
            subheadline: generateSentenceFromTemplate(ci.sentenceStructure, sector, ci.emotionalRegister, b),
            cta: generateCTAFromPatterns(ci.ctaAggression, sector, ci.emotionalRegister, b),
            ctaSecondary: "",
            tagline: generateTaglineFromPatterns(sector, ci.emotionalRegister, b),
            companyName: "",
            authorName: "",
            authorTitle: "",
            testimonial: "",
            sectionTitleTestimonials: "",
            sectionTitleFeatures: "",
            sectionTitleFAQ: "",
            stats: this.generateStatsFromPatterns(sector, b),
            faq: this.generateFAQFromPatterns(sector, ci, b),
            features: this.generateFeaturesFromPatterns(sector, ci, b),
            footerProductTitle: "",
            footerCompanyTitle: "",
            footerNavProduct: [],
            footerNavCompany: [],
        };
    }
    /**
     * Generate default copy intelligence for a sector
     */
    generateDefaultCopyIntelligence(profile) {
        const sectorDefaults = {
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
     * Generate stats with sector-appropriate labels
     * Values remain as placeholders — real numbers must come from actual business data
     */
    generateStatsFromPatterns(sector, b) {
        const statLabels = {
            healthcare: ["Patients Served", "Satisfaction Rate", "Years of Experience"],
            fintech: ["Assets Managed", "Average Returns", "Clients Worldwide"],
            legal: ["Cases Won", "Years of Practice", "Client Satisfaction"],
            technology: ["Users Onboarded", "Uptime", "Customer Satisfaction"],
            education: ["Students Enrolled", "Completion Rate", "Course Satisfaction"],
            commerce: ["Products Sold", "Customer Rating", "Repeat Buyers"],
            automotive: ["Vehicles Serviced", "Customer Satisfaction", "Years of Excellence"],
            real_estate: ["Properties Sold", "Client Satisfaction", "Years in Market"],
            travel: ["Trips Booked", "Traveler Rating", "Destinations Covered"],
            food: ["Dishes Served", "Customer Rating", "Years of Craft"],
            sports: ["Athletes Trained", "Win Rate", "Championships"],
            manufacturing: ["Units Produced", "Quality Rate", "Years of Precision"],
            entertainment: ["Events Hosted", "Audience Rating", "Content Hours"]
        };
        const labels = statLabels[sector] || statLabels.technology;
        return [
            { label: labels[0], value: "{{VALUE_1}}" },
            { label: labels[1], value: "{{VALUE_2}}" },
            { label: labels[2], value: "{{VALUE_3}}" }
        ];
    }
    /**
     * Generate FAQ from copy pattern banks
     */
    generateFAQFromPatterns(sector, ci, b) {
        const banks = COPY_PATTERN_BANKS;
        const terms = banks.industryTerms[sector] || banks.industryTerms.technology;
        const verbs = banks.verbs[ci.emotionalRegister] || banks.verbs.professional;
        const t0 = terms[Math.floor(b(200) * terms.length)];
        const t1 = terms[Math.floor(b(201) * terms.length)];
        const t2 = terms[Math.floor(b(202) * terms.length)];
        const v0 = verbs[Math.floor(b(203) * verbs.length)];
        const v1 = verbs[Math.floor(b(204) * verbs.length)];
        return [
            {
                question: `How does your ${t0} approach work?`,
                answer: `We ${v0} ${t0} through a process built around your specific needs and goals.`
            },
            {
                question: `What makes your ${t1} different?`,
                answer: `Our ${t1} is designed to ${v1} outcomes that matter — faster and more reliably than alternatives.`
            },
            {
                question: `Can I get started with ${t2} right away?`,
                answer: `Yes. Getting started takes minutes. Our onboarding is designed to deliver value from day one.`
            }
        ];
    }
    /**
     * Generate features from copy pattern banks
     */
    generateFeaturesFromPatterns(sector, ci, b) {
        const banks = COPY_PATTERN_BANKS;
        const terms = banks.industryTerms[sector] || banks.industryTerms.technology;
        const adjs = banks.adjectives[ci.emotionalRegister] || banks.adjectives.professional;
        const actions = banks.headlineFragments.benefit_action;
        const outcomes = banks.headlineFragments.benefit_outcome;
        return [0, 1, 2].map(i => {
            const term = terms[Math.floor(b(210 + i) * terms.length)];
            const adj = adjs[Math.floor(b(213 + i) * adjs.length)];
            const action = actions[Math.floor(b(216 + i) * actions.length)];
            const outcome = outcomes[Math.floor(b(219 + i) * outcomes.length)];
            const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
            return {
                title: `${action} ${cap(term)}`,
                description: `${cap(adj)} ${term} that ${outcome.toLowerCase()}s your results.`
            };
        });
    }
    /**
     * Hash-derived sub-sector selection
     */
    classifySubSectorFromTraits(traits, primarySector) {
        const subSectorMap = SUB_SECTOR_KEYWORDS[primarySector];
        if (!subSectorMap) {
            return { subSector: `${primarySector}_general`, confidence: 0.5 };
        }
        const subSectors = Object.keys(subSectorMap);
        if (subSectors.length === 0) {
            return { subSector: `${primarySector}_general`, confidence: 0.5 };
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
        return { subSector: `${primarySector}_${selectedSubSector}`, confidence };
    }
    /**
     * Extract keyword hints from trait values
     */
    extractKeywords(traits) {
        const keywords = [];
        // === Information Density ===
        if (traits.informationDensity > 0.8)
            keywords.push("data-dense", "dashboard", "analytics", "kpi", "metrics", "reporting");
        else if (traits.informationDensity > 0.6)
            keywords.push("data-rich", "structured", "tabular");
        else if (traits.informationDensity < 0.3)
            keywords.push("minimal", "sparse", "luxurious", "whitespace", "gallery");
        // === Temporal Urgency ===
        if (traits.temporalUrgency > 0.8)
            keywords.push("real-time", "live", "urgent", "breaking", "alert", "ticker");
        else if (traits.temporalUrgency > 0.6)
            keywords.push("dynamic", "current", "news-feed");
        else if (traits.temporalUrgency < 0.3)
            keywords.push("editorial", "long-form", "archival", "evergreen", "timeless");
        else if (traits.temporalUrgency < 0.5)
            keywords.push("static", "documentation", "reference");
        // === Emotional Temperature ===
        if (traits.emotionalTemperature > 0.8)
            keywords.push("warm", "humanist", "community", "wellness", "empathetic", "organic");
        else if (traits.emotionalTemperature > 0.6)
            keywords.push("friendly", "approachable", "lifestyle");
        else if (traits.emotionalTemperature < 0.3)
            keywords.push("clinical", "brutalist", "enterprise", "precision", "cold");
        else if (traits.emotionalTemperature < 0.5)
            keywords.push("professional", "corporate", "neutral");
        // === Playfulness ===
        if (traits.playfulness > 0.8)
            keywords.push("playful", "whimsical", "experimental", "creative", "y2k", "organic-shapes");
        else if (traits.playfulness > 0.6)
            keywords.push("creative", "expressive", "brand-forward");
        else if (traits.playfulness < 0.2)
            keywords.push("strict", "corporate", "legal", "formal", "institutional");
        else if (traits.playfulness < 0.4)
            keywords.push("clean", "structured", "restrained");
        // === Spatial Dependency ===
        if (traits.spatialDependency > 0.8)
            keywords.push("immersive", "3d", "webgl", "spatial", "depth", "particles", "vr", "ar");
        else if (traits.spatialDependency > 0.6)
            keywords.push("interactive", "animated", "dimensional", "parallax");
        else if (traits.spatialDependency < 0.2)
            keywords.push("flat", "text-heavy", "document", "print");
        // === Trust Requirement ===
        if (traits.trustRequirement > 0.8)
            keywords.push("regulated", "compliance", "security", "certification", "HIPAA", "SOC2", "credentials");
        else if (traits.trustRequirement > 0.6)
            keywords.push("trusted", "verified", "secure", "professional");
        else if (traits.trustRequirement < 0.2)
            keywords.push("casual", "social", "informal");
        // === Visual Emphasis ===
        if (traits.visualEmphasis > 0.8)
            keywords.push("photography", "visual-storytelling", "lookbook", "editorial-imagery", "fashion", "studio");
        else if (traits.visualEmphasis > 0.6)
            keywords.push("image-forward", "visual", "showcase");
        else if (traits.visualEmphasis < 0.2)
            keywords.push("text-first", "typographic", "minimal-imagery");
        // === Conversion Focus ===
        if (traits.conversionFocus > 0.8)
            keywords.push("ecommerce", "checkout", "conversion", "sales", "cta-heavy", "acquisition");
        else if (traits.conversionFocus > 0.6)
            keywords.push("lead-gen", "pricing", "subscription", "trial");
        else if (traits.conversionFocus < 0.2)
            keywords.push("informational", "educational", "awareness", "non-profit");
        // === Cross-trait aesthetic signals ===
        if (traits.emotionalTemperature < 0.3 && traits.playfulness < 0.3)
            keywords.push("bauhaus", "swiss-design", "grid-system");
        if (traits.playfulness > 0.7 && traits.visualEmphasis > 0.7)
            keywords.push("editorial", "magazine", "avant-garde");
        if (traits.spatialDependency > 0.7 && traits.playfulness > 0.6)
            keywords.push("generative", "creative-coding", "motion-design");
        if (traits.temporalUrgency < 0.3 && traits.visualEmphasis > 0.6)
            keywords.push("luxury", "premium", "art-direction");
        if (traits.informationDensity > 0.7 && traits.temporalUrgency > 0.7)
            keywords.push("trading", "fintech", "realtime-data");
        if (traits.trustRequirement > 0.7 && traits.emotionalTemperature > 0.6)
            keywords.push("healthcare", "wellness-brand", "care");
        return [...new Set(keywords)]; // Deduplicate
    }
    /**
     * Calculate sub-sector confidence
     */
    subSectorConfidence(traits) {
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
    generateStructure(traits, b) {
        let topology = "flat";
        if (traits.informationDensity > 0.7 && traits.temporalUrgency > 0.6) {
            topology = "flat"; // Dashboard
        }
        else if (traits.temporalUrgency < 0.4 && traits.informationDensity < 0.6) {
            topology = "deep"; // Long form
        }
        else {
            topology = this.selectFromHash(b(0), ["flat", "deep", "graph", "radial"]);
        }
        return {
            topology,
            maxNesting: Math.floor(b(3) * 4) + 1,
            sectionCount: this.estimateSections(traits),
            scrollBehavior: traits.informationDensity > 0.7
                ? "continuous"
                : this.selectFromHash(b(22), ["continuous", "paginated", "snap"]),
            breakpointStrategy: traits.temporalUrgency > 0.6
                ? "mobile_first"
                : this.selectFromHash(b(23), ["mobile_first", "desktop_first", "fluid"]),
            contentFlow: traits.informationDensity > 0.6
                ? "f_pattern"
                : this.selectFromHash(b(24), ["reading_order", "z_pattern", "f_pattern"])
        };
    }
    /**
     * Generate rhythm chromosome
     */
    generateRhythm(traits, b) {
        let density = "breathing";
        if (traits.informationDensity > 0.8)
            density = "maximal";
        else if (traits.informationDensity > 0.6)
            density = "airtight";
        else if (traits.informationDensity < 0.3)
            density = "empty";
        const baseSpacing = Math.floor(b(4) * 12) + 8; // 8–20px — minimum 8 ensures usable spacing at all density levels
        return {
            density,
            baseSpacing,
            sectionSpacing: baseSpacing * 4,
            componentSpacing: Math.floor(baseSpacing * 0.5),
            verticalRhythm: (traits.informationDensity > 0.7 ? 4 : traits.informationDensity > 0.4 ? 8 : 12),
            negativeSpaceRatio: 1 - traits.informationDensity
        };
    }
    /**
     * Generate display typography
     */
    generateDisplayType(traits, b, profile, options) {
        let charge = profile.defaultTypography;
        if (traits.temporalUrgency > 0.7 && traits.informationDensity > 0.6) {
            charge = "monospace";
        }
        else if (traits.emotionalTemperature > 0.7) {
            charge = "humanist";
        }
        else if (traits.emotionalTemperature < 0.3) {
            charge = "grotesque";
        }
        else if (traits.playfulness > 0.7) {
            charge = "expressive";
        }
        else if (traits.trustRequirement > 0.7) {
            charge = "transitional";
        }
        else if (traits.emotionalTemperature < 0.4) {
            charge = "geometric";
        }
        const provider = options?.fontProvider || "bunny";
        const fontData = this.selectDisplayFont(b(5), charge, provider);
        return {
            family: fontData.family,
            displayName: fontData.displayName,
            importUrl: fontData.importUrl,
            provider: fontData.provider,
            charge,
            weight: [400, 700, 900][Math.floor(b(6) * 3) % 3],
            fallback: fontData.fallback,
            tracking: traits.informationDensity > 0.7
                ? "tight"
                : traits.emotionalTemperature > 0.7
                    ? "wide"
                    : this.selectFromHash(b(25), ["normal", "tight", "wide", "ultra"]),
            casing: traits.emotionalTemperature < 0.3
                ? "uppercase"
                : this.selectFromHash(b(26), ["normal", "normal", "uppercase", "small_caps"])
        };
    }
    /**
     * Generate body typography
     */
    generateBodyType(traits, b, profile, options) {
        // Apply trait-based charge overrides (same logic as display, but biased toward readability)
        let charge = profile.defaultTypography;
        if (traits.temporalUrgency > 0.7 && traits.informationDensity > 0.6) {
            charge = "monospace"; // Data-heavy: keep scannable
        }
        else if (traits.emotionalTemperature > 0.7) {
            charge = "humanist"; // Warm/empathetic: serif humanist body
        }
        else if (traits.playfulness > 0.7) {
            charge = "geometric"; // Playful display, legible geometric body
        }
        else if (traits.trustRequirement > 0.8 && traits.emotionalTemperature < 0.5) {
            charge = "transitional"; // High trust + clinical: authoritative serif
        }
        else if (traits.informationDensity > 0.7) {
            charge = "grotesque"; // Dense content: high-legibility grotesque
        }
        const provider = options?.fontProvider || "bunny";
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
    generatePrimaryColor(b, primaryProfile, secondaryProfile, brand, brandWeight = 0.7, epigenetics) {
        // Check for brand color override
        if (brand?.colors?.primary && brandWeight > 0.5) {
            const brandHSL = this.hexToHSL(brand.colors.primary);
            const isAppropriate = this.isColorAppropriateForSector(brandHSL.h, primaryProfile.sector);
            return {
                hue: brandHSL.h,
                saturation: brandHSL.s / 100,
                lightness: brandHSL.l / 100,
                temperature: this.getTemperatureFromHue(brandHSL.h),
                hex: brand.colors.primary,
                sectorAppropriate: isAppropriate
            };
        }
        // Check for epigenetic override (uploaded brand assets)
        if (epigenetics?.epigeneticHue !== undefined) {
            const hue = epigenetics.epigeneticHue;
            return {
                hue,
                saturation: Math.max(0.2, b(11)),
                lightness: Math.max(0.2, b(12)),
                temperature: this.getTemperatureFromHue(hue),
                hex: this.hslToHex(hue, b(11) * 100, b(12) * 100),
                sectorAppropriate: true
            };
        }
        // MATHEMATICAL: Generate from sector bias ranges, NOT named colors
        const primarySector = primaryProfile.sector;
        let hue = generateHueFromBias(primarySector, Math.floor(b(10) * 255));
        let saturation = generateSaturationFromBias(primarySector, Math.floor(b(11) * 255));
        let lightness = generateLightnessFromBias(primarySector, Math.floor(b(12) * 255));
        // Blend with secondary sector if present
        if (secondaryProfile && b(13) > 0.5) {
            const secondaryHue = generateHueFromBias(secondaryProfile.sector, Math.floor(b(14) * 255));
            // Blend 70% primary, 30% secondary
            hue = this.blendHue(hue, secondaryHue, 0.3);
        }
        // Add entropy variation (±15 degrees)
        const variation = (b(15) - 0.5) * 30;
        hue = (hue + variation + 360) % 360;
        return {
            hue: Math.round(hue),
            saturation: Math.round(saturation * 100) / 100,
            lightness: Math.round(lightness * 100) / 100,
            temperature: this.getTemperatureFromHue(hue),
            hex: this.hslToHex(hue, saturation * 100, lightness * 100),
            sectorAppropriate: true
        };
    }
    /**
     * Generate color temperature
     */
    generateColorTemp(primaryTemp, profile, b) {
        // Use sector warmth bias
        let backgroundTemp = primaryTemp;
        if (profile.colorProfile.warmthBias > 0.3) {
            backgroundTemp = "warm";
        }
        else if (profile.colorProfile.warmthBias < -0.3) {
            backgroundTemp = "cool";
        }
        // Epistasis: Warm primary forces neutral/cool background
        if (primaryTemp === "warm") {
            backgroundTemp = b(16) > 0.5 ? "neutral" : "cool";
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
                this.hslToHex(0, 0, 5 + b(20) * 5), // 5-10% (darkest)
                this.hslToHex(0, 0, 10 + b(21) * 8), // 10-18%
                this.hslToHex(0, 0, 18 + b(22) * 10), // 18-28%
                this.hslToHex(0, 0, 28 + b(23) * 12) // 28-40% (lightest)
            ]
            : [
                this.hslToHex(0, 0, 98 - b(20) * 5), // 93-98% (lightest)
                this.hslToHex(0, 0, 90 - b(21) * 8), // 82-90%
                this.hslToHex(0, 0, 82 - b(22) * 10), // 72-82%
                this.hslToHex(0, 0, 72 - b(23) * 12) // 60-72% (darkest)
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
    generateEdge(traits, b, profile) {
        const maxRadius = 32;
        const baseRadius = Math.round(b(1) * maxRadius * traits.playfulness);
        // Apply sector preference
        let radius = baseRadius;
        if (profile.edgePreference === "sharp") {
            radius = Math.min(radius, 4);
        }
        else if (profile.edgePreference === "organic") {
            radius = Math.max(radius, 8);
        }
        return {
            radius,
            style: radius === 0 ? "sharp" : (radius > 16 ? "organic" : "soft"),
            variableRadius: traits.playfulness > 0.6,
            componentRadius: Math.round(radius * 0.6), // smaller for buttons/inputs
            imageRadius: Math.round(radius * 0.4), // even smaller for image crops
            asymmetric: traits.playfulness > 0.8 && b(27) > 0.6
        };
    }
    /**
     * Generate motion physics
     */
    generateMotion(traits, b, profile) {
        let physics = profile.motionPreference;
        // Trait overrides
        if (traits.temporalUrgency > 0.8)
            physics = "none";
        else if (traits.playfulness > 0.7)
            physics = "spring";
        else if (traits.emotionalTemperature < 0.3)
            physics = "step";
        // Enter direction from physics + traits
        let enterDirection = "up";
        if (physics === "none")
            enterDirection = "fade";
        else if (physics === "spring" && traits.playfulness > 0.6)
            enterDirection = "scale";
        else if (traits.informationDensity > 0.7)
            enterDirection = "fade"; // dashboards fade, don't slide
        else
            enterDirection = this.selectFromHash(b(28), ["up", "up", "left", "right", "scale"]);
        return {
            physics,
            durationScale: 0.2 + b(14) * 1.8,
            staggerDelay: b(15) * 0.1,
            enterDirection,
            exitBehavior: physics === "none" ? "none" : (traits.temporalUrgency > 0.6 ? "fade" : "slide"),
            hoverIntensity: traits.playfulness > 0.6 ? 0.6 + b(29) * 0.4 : traits.playfulness * 0.5,
            reducedMotionFallback: traits.playfulness > 0.5 ? "fade" : "none"
        };
    }
    /**
     * Generate motion choreography - hash-driven animation sequencing
     */
    generateMotionChoreography(traits, b) {
        // Hash-driven entry sequence
        const entrySequences = ["hero_first", "cascade_down", "cascade_up", "simultaneous", "stagger_center"];
        const entrySequence = entrySequences[Math.floor(b(219) * entrySequences.length)];
        // Stagger interval derived from information density (dense = fast, sparse = slow)
        const staggerInterval = traits.informationDensity > 0.7
            ? 20 + Math.floor(b(220) * 30) // 20-50ms for dashboards
            : traits.informationDensity < 0.3
                ? 100 + Math.floor(b(220) * 50) // 100-150ms for editorial
                : 50 + Math.floor(b(220) * 50); // 50-100ms default
        // Scroll trigger point hash-derived
        const scrollTrigger = {
            triggerPoint: 0.1 + b(221) * 0.8, // 0.1-0.9 of viewport
            scrubIntensity: traits.temporalUrgency > 0.6 ? 0.2 + b(222) * 0.3 : 0.5 + b(222) * 0.5
        };
        // Hover microinteraction from playfulness
        const hoverTypes = ["scale", "color_shift", "shadow", "lift", "glow"];
        const hoverMicrointeraction = {
            type: hoverTypes[Math.floor(b(223) * hoverTypes.length)],
            intensity: traits.playfulness * 0.8 + b(224) * 0.2,
            duration: 150 + Math.floor(b(225) * 350) // 150-500ms
        };
        // Page transition from topology
        const pageTransitions = ["fade", "slide", "morph", "wipe", "dissolve"];
        const pageTransition = pageTransitions[Math.floor(b(226) * pageTransitions.length)];
        // Choreography style from emotional temperature
        const choreographyStyles = ["elegant", "energetic", "smooth", "snappy", "dramatic"];
        const styleIndex = Math.floor(traits.emotionalTemperature > 0.7 ? 0 + b(227) * 2 : // elegant/smooth for warm
            traits.emotionalTemperature < 0.3 ? 3 + b(227) * 2 : // snappy/dramatic for cold
                1 + b(227) * 3 // mixed for neutral
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
    generateGrid(traits, b) {
        return {
            logic: traits.informationDensity > 0.8
                ? "column"
                : this.selectFromHash(b(15), ["column", "masonry", "broken"]),
            asymmetry: 0.5 + (b(2) * 1.5 * traits.playfulness),
            columns: traits.informationDensity > 0.7 ? 4 : (traits.informationDensity > 0.4 ? 3 : 2),
            gap: Math.floor(b(16) * 24) + 8,
            mobileColumns: (traits.informationDensity > 0.7 ? 2 : 1),
            alignment: this.selectFromHash(b(30), ["stretch", "stretch", "center", "start"])
        };
    }
    /**
     * Generate hierarchy
     */
    generateHierarchy(traits, b) {
        return {
            depth: traits.informationDensity > 0.7 ? "flat" : "overlapping",
            zIndexBehavior: "isolation",
            layerBlur: b(17) * 10,
            elevationSystem: traits.emotionalTemperature < 0.3
                ? "flat"
                : traits.playfulness > 0.5
                    ? "neumorphic"
                    : "material",
            shadowScale: traits.spatialDependency > 0.5 ? 0.4 + b(31) * 0.6 : b(31) * 0.4,
            depthCues: traits.spatialDependency > 0.6
                ? this.selectFromHash(b(32), ["blur", "scale", "opacity", "blur"])
                : "none"
        };
    }
    /**
     * Generate texture
     */
    generateTexture(traits, b) {
        return {
            surface: traits.emotionalTemperature > 0.6 ? "grain" : "flat",
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
    generateIconography(traits, b, profile) {
        // Hash-driven style
        const styles = ["outline", "filled", "duotone", "rounded", "sharp"];
        const style = styles[Math.floor(b(228) * styles.length)];
        // Stroke weight from playfulness (low = thin/clean, high = bold/expressive)
        const strokeWeights = ["thin", "regular", "bold", "variable"];
        const strokeWeight = strokeWeights[Math.floor(traits.playfulness < 0.3 ? b(229) * 2 : // thin/regular for strict
            traits.playfulness > 0.7 ? 2 + b(229) * 2 : // bold/variable for playful
                b(229) * 4 // any for neutral
        )];
        // Corner treatment from edge chromosome style
        const cornerTreatments = ["sharp", "rounded", "pill"];
        const cornerTreatment = cornerTreatments[Math.floor(b(230) * cornerTreatments.length)];
        // Size scale from information density (dense = smaller icons)
        const sizeScale = traits.informationDensity > 0.7
            ? 0.8 + b(231) * 0.2 // 0.8-1.0 for dense
            : traits.informationDensity < 0.3
                ? 1.2 + b(231) * 0.3 // 1.2-1.5 for sparse
                : 1.0 + b(231) * 0.2; // 1.0-1.2 default
        // Library from emotional register
        const libraries = ["lucide", "phosphor", "heroicons", "feather", "radix"];
        const libraryIndex = Math.floor(profile.defaultTypography === "geometric" ? b(232) * 2 : // lucide/phosphor
            profile.defaultTypography === "humanist" ? 2 + b(232) * 2 : // heroicons/feather
                profile.defaultTypography === "monospace" ? 4 : // radix for tech
                    b(232) * 5);
        const library = libraries[libraryIndex % libraries.length];
        // Color treatment from sector
        const colorTreatments = ["inherit", "primary", "secondary", "muted"];
        const colorTreatment = colorTreatments[Math.floor(b(233) * colorTreatments.length)];
        // Animation from playfulness
        const animations = ["none", "bounce", "pulse", "spin", "draw"];
        const animation = traits.playfulness < 0.2
            ? "none"
            : animations[Math.floor(b(234) * (animations.length - 1)) + 1];
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
    /**
     * Generate atmosphere FX
     */
    generateAtmosphere(traits, b, disabled) {
        if (disabled) {
            return { fx: "none", intensity: 0, enabled: false };
        }
        let fx = "none";
        if (traits.spatialDependency > 0.4) {
            if (traits.emotionalTemperature > 0.5 && traits.informationDensity < 0.6)
                fx = "glassmorphism";
            else if (traits.playfulness > 0.7)
                fx = "fluid_mesh";
            else if (traits.informationDensity > 0.6)
                fx = "crt_noise";
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
    generatePhysics(traits, b, disabled) {
        if (disabled) {
            return {
                material: "matte",
                roughness: 0.5,
                transmission: 0,
                enabled: false
            };
        }
        let material = "matte";
        if (traits.spatialDependency > 0.4) {
            if (traits.emotionalTemperature > 0.6 && traits.playfulness < 0.5)
                material = "neumorphism";
            else if (traits.emotionalTemperature < 0.4)
                material = "metallic";
            else
                material = "glass";
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
    generateBiomarker(traits, b, profile, disabled, enable3D) {
        // Check if 3D is appropriate for this sector
        const shouldGenerate3D = enable3D ?? profile.generate3D;
        if (disabled || !shouldGenerate3D) {
            return {
                geometry: "monolithic",
                shapeFamily: "geometric",
                animationStyle: "static",
                polycount: "low",
                colorTreatment: "monochrome",
                complexity: 0,
                enabled: false,
                usage: "none"
            };
        }
        // Shape family from sector
        const shapeFamilyBySector = {
            healthcare: "biological", fintech: "crystalline", technology: "geometric",
            commerce: "geometric", education: "fluid", entertainment: "fluid",
            automotive: "architectural", manufacturing: "geometric", legal: "architectural",
            real_estate: "architectural", travel: "fluid", food: "biological", sports: "fluid"
        };
        const shapeFamily = shapeFamilyBySector[profile.sector] ?? "geometric";
        // Animation style from motion physics
        const animStyleMap = {
            spring: "breathe", step: "rotate", glitch: "morph", none: "static"
        };
        let geometry = "monolithic";
        if (traits.playfulness > 0.6)
            geometry = "organic";
        else if (traits.informationDensity > 0.7)
            geometry = "fractal";
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
            usage: "decorative"
        };
    }
    /**
     * Generate typography scale
     */
    generateTypography(traits, b) {
        let ratio;
        if (traits.emotionalTemperature > 0.7)
            ratio = 1.618; // Golden ratio
        else if (traits.emotionalTemperature > 0.4)
            ratio = 1.5;
        else
            ratio = 1.25;
        let baseSize;
        if (traits.informationDensity > 0.8)
            baseSize = 14;
        else if (traits.informationDensity > 0.5)
            baseSize = 16;
        else
            baseSize = 18;
        const getLineHeight = (tightness) => {
            if (traits.temporalUrgency > 0.7)
                return (1.2 + tightness * 0.2).toFixed(2);
            if (traits.temporalUrgency > 0.4)
                return (1.4 + tightness * 0.2).toFixed(2);
            return (1.6 + tightness * 0.2).toFixed(2);
        };
        const getLetterSpacing = (emphasis) => {
            if (traits.informationDensity > 0.7)
                return `${-0.02 * emphasis}em`;
            if (traits.temporalUrgency > 0.7)
                return `${0.01 * emphasis}em`;
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
    generateAccessibility(traits, b) {
        const minContrastRatio = traits.informationDensity > 0.7 ? 7.0 :
            traits.informationDensity > 0.4 ? 4.5 : 3.0;
        let focusIndicator = "outline";
        if (traits.temporalUrgency > 0.8)
            focusIndicator = "ring";
        else if (traits.playfulness > 0.6)
            focusIndicator = "underline";
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
    generateRendering(traits, b) {
        let primary = "css";
        if (traits.spatialDependency > 0.6 && traits.playfulness > 0.4)
            primary = "webgl";
        else if (traits.spatialDependency > 0.4 && traits.playfulness > 0.3)
            primary = "css";
        else if (traits.informationDensity > 0.8 && traits.playfulness < 0.3)
            primary = "svg";
        else if (traits.informationDensity > 0.9)
            primary = "static";
        return {
            primary,
            fallback: primary === "webgl" ? "css" : (traits.playfulness < 0.2 ? "static" : "css"),
            animate: !(traits.temporalUrgency > 0.9 || (traits.playfulness < 0.3 && traits.informationDensity > 0.7)),
            complexity: traits.informationDensity > 0.8 ? "minimal" :
                (traits.spatialDependency > 0.6 && traits.playfulness > 0.5) ? "rich" : "balanced"
        };
    }
    // ==================== HERO TYPE SELECTION ====================
    selectHeroVariant(heroType, byte) {
        const variantsByType = {
            product_ui: ["centered", "split_right", "full_bleed", "floating_cards"],
            product_video: ["full_bleed", "centered", "overlay"],
            brand_logo: ["centered", "minimal", "asymmetric"],
            stats_counter: ["centered", "split_left", "floating_cards"],
            search_discovery: ["centered", "full_bleed"],
            content_carousel: ["full_bleed", "centered"],
            trust_authority: ["centered", "split_left", "split_right"],
            service_showcase: ["centered", "split_left", "asymmetric"],
            editorial_feature: ["full_bleed", "asymmetric", "minimal"],
            configurator_3d: ["centered", "split_left"],
            aspirational_imagery: ["full_bleed", "overlay", "minimal"],
            testimonial_focus: ["centered", "split_left", "split_right"]
        };
        const variants = variantsByType[heroType] || ["centered"];
        return variants[Math.floor(byte * variants.length) % variants.length];
    }
    getHeroElements(heroType) {
        const elementsByType = {
            product_ui: ["screenshot", "headline", "subheadline", "cta_primary", "cta_secondary"],
            product_video: ["video", "headline", "subheadline", "cta_primary"],
            brand_logo: ["logo", "tagline", "cta_primary"],
            stats_counter: ["counter", "context", "headline", "cta_primary"],
            search_discovery: ["search_bar", "filters", "headline"],
            content_carousel: ["carousel", "headline", "navigation"],
            trust_authority: ["credentials", "headline", "subheadline", "cta_primary"],
            service_showcase: ["services", "headline", "cta_primary"],
            editorial_feature: ["featured_image", "headline", "excerpt", "cta_primary"],
            configurator_3d: ["3d_viewer", "options", "price", "cta_primary"],
            aspirational_imagery: ["image", "headline", "subheadline", "cta_primary"],
            testimonial_focus: ["testimonial", "headline", "cta_primary"]
        };
        return elementsByType[heroType] || ["headline", "cta_primary"];
    }
    // ==================== TRUST SIGNALS ====================
    selectTrustProminence(traits, profile) {
        if (traits.trustRequirement > 0.8)
            return "hero_feature";
        if (traits.trustRequirement > 0.6)
            return "prominent";
        if (traits.trustRequirement > 0.4)
            return "integrated";
        return "subtle";
    }
    selectSocialProofType(byte, profile) {
        const weights = {
            healthcare: { customer_logos: 0.1, user_count: 0.2, rating_stars: 0.3, testimonials_grid: 0.3, community_size: 0.05, press_mentions: 0.05 },
            fintech: { customer_logos: 0.2, user_count: 0.3, rating_stars: 0.2, testimonials_grid: 0.15, community_size: 0.1, press_mentions: 0.05 },
            automotive: { customer_logos: 0.1, user_count: 0.2, rating_stars: 0.3, testimonials_grid: 0.2, community_size: 0.1, press_mentions: 0.1 },
            education: { customer_logos: 0.15, user_count: 0.25, rating_stars: 0.2, testimonials_grid: 0.25, community_size: 0.1, press_mentions: 0.05 },
            commerce: { customer_logos: 0.1, user_count: 0.2, rating_stars: 0.4, testimonials_grid: 0.2, community_size: 0.05, press_mentions: 0.05 },
            entertainment: { customer_logos: 0.1, user_count: 0.4, rating_stars: 0.2, testimonials_grid: 0.15, community_size: 0.1, press_mentions: 0.05 },
            manufacturing: { customer_logos: 0.3, user_count: 0.1, rating_stars: 0.1, testimonials_grid: 0.2, community_size: 0.1, press_mentions: 0.2 },
            legal: { customer_logos: 0.1, user_count: 0.15, rating_stars: 0.2, testimonials_grid: 0.4, community_size: 0.05, press_mentions: 0.1 },
            real_estate: { customer_logos: 0.15, user_count: 0.15, rating_stars: 0.3, testimonials_grid: 0.3, community_size: 0.05, press_mentions: 0.05 },
            travel: { customer_logos: 0.1, user_count: 0.2, rating_stars: 0.3, testimonials_grid: 0.25, community_size: 0.1, press_mentions: 0.05 },
            food: { customer_logos: 0.1, user_count: 0.15, rating_stars: 0.4, testimonials_grid: 0.25, community_size: 0.05, press_mentions: 0.05 },
            sports: { customer_logos: 0.15, user_count: 0.3, rating_stars: 0.2, testimonials_grid: 0.15, community_size: 0.15, press_mentions: 0.05 },
            technology: { customer_logos: 0.25, user_count: 0.25, rating_stars: 0.15, testimonials_grid: 0.15, community_size: 0.1, press_mentions: 0.1 },
            nonprofit: { customer_logos: 0.1, user_count: 0.25, rating_stars: 0.1, testimonials_grid: 0.3, community_size: 0.2, press_mentions: 0.05 },
            government: { customer_logos: 0.1, user_count: 0.3, rating_stars: 0.05, testimonials_grid: 0.2, community_size: 0.2, press_mentions: 0.15 },
            media: { customer_logos: 0.05, user_count: 0.3, rating_stars: 0.1, testimonials_grid: 0.1, community_size: 0.15, press_mentions: 0.30 },
            crypto_web3: { customer_logos: 0.15, user_count: 0.35, rating_stars: 0.1, testimonials_grid: 0.1, community_size: 0.25, press_mentions: 0.05 },
            gaming: { customer_logos: 0.1, user_count: 0.35, rating_stars: 0.25, testimonials_grid: 0.1, community_size: 0.15, press_mentions: 0.05 },
            hospitality: { customer_logos: 0.05, user_count: 0.15, rating_stars: 0.40, testimonials_grid: 0.3, community_size: 0.05, press_mentions: 0.05 },
            beauty_fashion: { customer_logos: 0.1, user_count: 0.2, rating_stars: 0.3, testimonials_grid: 0.25, community_size: 0.1, press_mentions: 0.05 },
            insurance: { customer_logos: 0.15, user_count: 0.2, rating_stars: 0.25, testimonials_grid: 0.25, community_size: 0.05, press_mentions: 0.1 },
            agency: { customer_logos: 0.30, user_count: 0.1, rating_stars: 0.1, testimonials_grid: 0.25, community_size: 0.05, press_mentions: 0.2 },
            energy: { customer_logos: 0.25, user_count: 0.2, rating_stars: 0.05, testimonials_grid: 0.15, community_size: 0.1, press_mentions: 0.25 }
        };
        const sector = profile.sector;
        const sectorWeights = weights[sector];
        const total = Object.values(sectorWeights).reduce((a, b) => a + b, 0);
        const threshold = (byte / 255) * total;
        let cumulative = 0;
        for (const [type, weight] of Object.entries(sectorWeights)) {
            cumulative += weight;
            if (cumulative >= threshold) {
                return type;
            }
        }
        return "testimonials_grid";
    }
    selectImpactType(byte, profile) {
        const weights = {
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
        const sector = profile.sector;
        const sectorWeights = weights[sector];
        const total = Object.values(sectorWeights).reduce((a, b) => a + b, 0);
        const threshold = (byte / 255) * total;
        let cumulative = 0;
        for (const [type, weight] of Object.entries(sectorWeights)) {
            cumulative += weight;
            if (cumulative >= threshold) {
                return type;
            }
        }
        return "cumulative_stats";
    }
    // ==================== CONTENT STRUCTURE ====================
    selectContentDepth(traits, profile) {
        if (traits.informationDensity > 0.8)
            return "comprehensive";
        if (traits.informationDensity > 0.6)
            return "extensive";
        if (traits.informationDensity > 0.4)
            return "moderate";
        return "minimal";
    }
    estimateSections(traits) {
        if (traits.informationDensity > 0.8)
            return 10;
        if (traits.informationDensity > 0.6)
            return 7;
        if (traits.informationDensity > 0.4)
            return 5;
        return 3;
    }
    selectInfoArchitecture(traits, profile) {
        if (traits.conversionFocus > 0.7)
            return "funnel_linear";
        if (traits.informationDensity > 0.7)
            return "data_dashboard";
        if (traits.emotionalTemperature > 0.6)
            return "narrative_scroll";
        if (traits.informationDensity < 0.4)
            return "hub_spoke";
        return "modular_sections";
    }
    selectPersonalization(traits) {
        if (traits.informationDensity > 0.8)
            return "behavior_based";
        if (traits.informationDensity > 0.6)
            return "segment_based";
        if (traits.temporalUrgency > 0.7)
            return "location_based";
        return "static";
    }
    // ==================== VISUAL TREATMENT ====================
    selectVisualTreatment(profile, byte) {
        const treatmentsBySector = {
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
        const sector = profile.sector;
        const treatments = treatmentsBySector[sector] || ["lifestyle_photography"];
        return treatments[Math.floor(byte * treatments.length) % treatments.length];
    }
    selectVideoStrategy(profile, byte) {
        if (byte < 0.3)
            return "none";
        const strategiesBySector = {
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
        const sector = profile.sector;
        const strategies = strategiesBySector[sector] || ["brand_story"];
        return strategies[Math.floor(byte * strategies.length) % strategies.length];
    }
    // ==================== UTILITY FUNCTIONS ====================
    selectFromHash(byte, options) {
        // byte is a float in [0.0, 1.0) from b(n) = buffer[n] / 255
        // Using modulo on a <1 float always returns near-0, causing options[0] every time.
        // Fix: scale to index range first, then modulo for safety.
        return options[Math.floor(byte * options.length) % options.length];
    }
    selectDisplayFont(byte, charge, provider = "bunny") {
        const fonts = {
            geometric: [
                "Space Grotesk", "DM Sans", "Outfit", "Cabinet Grotesk", "Plus Jakarta Sans",
                "Barlow", "Syne", "Unbounded", "Lexend", "Urbanist", "Questrial",
                "Work Sans", "Montserrat", "Jost", "Manrope", "Sen", "Tenor Sans"
            ],
            humanist: [
                "Fraunces", "Playfair Display", "Cormorant", "Lora", "Libre Baskerville",
                "Spectral", "DM Serif Display", "Gloock", "Cinzel", "Crimson Text",
                "Eczar", "Gentium Book Plus", "Inknut Antiqua", "Quattrocento", "Unna"
            ],
            grotesque: [
                "Inter", "Public Sans", "Arimo", "Heebo", "IBM Plex Sans", "Karla",
                "Red Hat Display", "Sora", "Chivo",
                "Figtree", "Instrument Sans", "Schibsted Grotesk", "Hanken Grotesk"
            ],
            transitional: [
                "Libre Baskerville", "Cardo", "EB Garamond", "Literata", "Newsreader",
                "Source Serif 4", "Bitter", "Baskervville", "Bodoni Moda", "Domine",
                "Zilla Slab", "Prata", "Fraunces"
            ],
            slab_serif: [
                "Arvo", "Josefin Slab", "Roboto Slab", "Zilla Slab", "BioRhyme",
                "Alfa Slab One", "Cousine", "Martel Sans", "Poly", "Rokkitt"
            ],
            monospace: [
                "Space Mono", "JetBrains Mono", "Fira Code", "IBM Plex Mono", "Geist Mono",
                "Commit Mono", "Martian Mono", "Nanum Gothic Coding", "Overpass Mono",
                "Roboto Mono", "Source Code Pro", "Ubuntu Mono", "VT323"
            ],
            expressive: [
                "Syne", "Unbounded", "Bungee", "Faster One", "Monoton", "Nabla",
                "Righteous", "Rubik Beastly", "Tourney", "Ultra", "Yeseva One"
            ]
        };
        const fallbacks = {
            geometric: "system-ui, -apple-system, sans-serif",
            humanist: "Georgia, 'Times New Roman', serif",
            grotesque: "Helvetica, Arial, sans-serif",
            monospace: "'Courier New', Courier, monospace",
            transitional: "Georgia, serif",
            slab_serif: "serif",
            expressive: "cursive, sans-serif"
        };
        const pool = fonts[charge] ?? fonts.geometric;
        const selected = pool[Math.floor(byte * pool.length) % pool.length];
        return {
            family: `${selected}, ${fallbacks[charge] || fallbacks.geometric}`,
            displayName: selected,
            importUrl: this.getFontImportUrl(selected, provider, [400, 700]),
            provider,
            fallback: fallbacks[charge] || fallbacks.geometric
        };
    }
    selectBodyFont(byte, charge, provider = "bunny") {
        const fonts = {
            geometric: [
                "DM Sans", "Inter", "Geist", "Nunito", "Atkinson Hyperlegible",
                "Lexend Deca", "Plus Jakarta Sans", "Outfit", "Albert Sans"
            ],
            humanist: [
                "Merriweather", "Source Serif 4", "Lora", "Literata", "Palatino Linotype",
                "Crimson Text", "Domine", "Libre Franklin", "Spectral"
            ],
            grotesque: [
                "Inter", "Public Sans", "IBM Plex Sans", "Karla", "Work Sans",
                "Figtree", "Hanken Grotesk", "Chivo", "Schibsted Grotesk"
            ],
            transitional: [
                "Newsreader", "Source Serif 4", "EB Garamond", "Cardo", "Libre Baskerville",
                "Domine", "Cormorant", "Baskervville"
            ],
            slab_serif: [
                "Roboto Slab", "Arvo", "Domine", "Josefin Slab", "Zilla Slab"
            ],
            monospace: [
                "IBM Plex Mono", "Fira Code", "JetBrains Mono", "Geist Mono", "Roboto Mono"
            ],
            expressive: [
                "Rubik", "Outfit", "Space Grotesk", "Syne"
            ]
        };
        const pool = fonts[charge] ?? fonts.geometric;
        const selected = pool[Math.floor(byte * pool.length) % pool.length];
        const fallbacks = {
            geometric: "system-ui, -apple-system, sans-serif",
            humanist: "Georgia, serif",
            grotesque: "Arial, sans-serif",
            monospace: "monospace",
            transitional: "serif",
            slab_serif: "serif",
            expressive: "sans-serif"
        };
        return {
            family: `${selected}, ${fallbacks[charge] || fallbacks.geometric}`,
            displayName: selected,
            importUrl: this.getFontImportUrl(selected, provider, [400, 700]),
            provider,
            fallback: fallbacks[charge] || fallbacks.geometric
        };
    }
    getFontImportUrl(fontName, provider, weights) {
        const slug = fontName.toLowerCase().replace(/ /g, '-');
        const weightString = weights.join(';');
        if (provider === "google") {
            const googleName = fontName.replace(/ /g, '+');
            return `https://fonts.googleapis.com/css2?family=${googleName}:wght@${weightString}&display=swap`;
        }
        // Bunny Fonts default
        return `https://fonts.bunny.net/css?family=${slug}:${weights.join(',')}&display=swap`;
    }
    isColorAppropriateForSector(hue, sector) {
        // Simple appropriateness check
        // Healthcare: blues, greens (180-240)
        // Fintech: blues, purples (240-300)
        // etc.
        const appropriateRanges = {
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
    getTemperatureFromHue(hue) {
        // Warm:    0-45 (reds, oranges) + 330-360 (reds wrapping)
        // Neutral: 45-75 (yellow-greens) + 150-190 (blue-greens / teals)
        // Cool:    75-150 (greens) + 190-330 (blues, indigos, purples, violet, magenta)
        if (hue < 45 || hue >= 330)
            return "warm"; // Reds, oranges wrap
        if (hue >= 45 && hue < 75)
            return "neutral"; // Yellow / yellow-green
        if (hue >= 75 && hue < 190)
            return "cool"; // Greens and teals
        if (hue >= 190 && hue < 330)
            return "cool"; // Blues, purple, violet, magenta
        return "neutral";
    }
    blendHue(h1, h2, weight) {
        // Handle circular hue blending
        let diff = h2 - h1;
        if (diff > 180)
            diff -= 360;
        if (diff < -180)
            diff += 360;
        return (h1 + diff * weight + 360) % 360;
    }
    hexToHSL(hex) {
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
                case r:
                    h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                    break;
                case g:
                    h = ((b - r) / d + 2) / 6;
                    break;
                case b:
                    h = ((r - g) / d + 4) / 6;
                    break;
            }
        }
        return { h: h * 360, s: s * 100, l: l * 100 };
    }
    hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = (n) => {
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
    generateFromArchetype(archetypeName, seed) {
        const archetypes = {
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
                sector: "entertainment", // creative portfolio → entertainment, not technology
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
                sector: "technology", // generic: assume tech SaaS
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
                sector: "healthcare", // closest — trust + warmth without sales pressure
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
            return this.generate(seed, {
                informationDensity: 0.5, temporalUrgency: 0.5, emotionalTemperature: 0.5,
                playfulness: 0.5, spatialDependency: 0.3, trustRequirement: 0.5,
                visualEmphasis: 0.5, conversionFocus: 0.5
            }, { primarySector: "technology", options: { creativityLevel: "balanced" } });
        }
        return this.generate(seed, config.traits, {
            primarySector: config.sector,
            options: { creativityLevel: "balanced" }
        });
    }
}
