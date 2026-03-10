/**
 * Permutations MCP - Genome Sequencer
 *
 * Enhanced sequencer with sector awareness, content analysis,
 * hero type selection, and brand integration.
 */
import * as crypto from "crypto";
import { GenomeConstraintSolver } from "./constraint-solver.js";
import { getSectorProfile, classifySubSector, selectColorFromProfile, colorNameToHSL } from "./sector-profiles.js";
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
        const ch3_type_display = isForced('ch3_type_display') || this.generateDisplayType(traits, b, primaryProfile);
        const ch4_type_body = isForced('ch4_type_body') || this.generateBodyType(traits, b, primaryProfile);
        const ch5_color_primary = isForced('ch5_color_primary') || this.generatePrimaryColor(b, primaryProfile, secondaryProfile, brand, brandWeight, epigenetics);
        const ch6_color_temp = isForced('ch6_color_temp') || this.generateColorTemp(ch5_color_primary.temperature, primaryProfile, b);
        const ch7_edge = isForced('ch7_edge') || this.generateEdge(traits, b, primaryProfile);
        const ch8_motion = isForced('ch8_motion') || this.generateMotion(traits, b, primaryProfile);
        const ch9_grid = isForced('ch9_grid') || this.generateGrid(traits, b);
        const ch10_hierarchy = isForced('ch10_hierarchy') || this.generateHierarchy(traits, b);
        const ch11_texture = isForced('ch11_texture') || this.generateTexture(traits, b);
        const ch12_signature = isForced('ch12_signature') || {
            entropy: b(17),
            uniqueMutation: hash.slice(0, 8),
            variantSeed: b(17) // Use existing byte, SHA256 only has 32 bytes
        };
        const ch13_atmosphere = isForced('ch13_atmosphere') || this.generateAtmosphere(traits, b, isDisabled('ch13_atmosphere'));
        const ch14_physics = isForced('ch14_physics') || this.generatePhysics(traits, b, isDisabled('ch14_physics'));
        const ch15_biomarker = isForced('ch15_biomarker') || this.generateBiomarker(traits, b, primaryProfile, isDisabled('ch15_atmosphere'), options?.enable3D);
        const ch16_typography = isForced('ch16_typography') || this.generateTypography(traits, b);
        const ch17_accessibility = isForced('ch17_accessibility') || this.generateAccessibility(traits, b);
        const ch18_rendering = isForced('ch18_rendering') || this.generateRendering(traits, b);
        // Hero & Visual Chromosomes (19-20)
        const forcedHero = isForced('ch19_hero_type');
        const heroType = forcedHero?.type ||
            this.selectHeroType(b(101), primaryProfile, secondaryProfile);
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
            textPosition: this.selectFromHash(b(104), ["overlay", "adjacent", "below"])
        };
        const ch20_visual_treatment = isForced('ch20_visual_treatment') || {
            treatment: this.selectVisualTreatment(primaryProfile, b(105)),
            videoStrategy: this.selectVideoStrategy(primaryProfile, b(106)),
            imageTreatment: this.selectFromHash(b(107), ["natural", "high_contrast", "warm", "cool", "monochrome"]),
            hasVideo: b(106) > 0.7
        };
        // Trust & Social Chromosomes (21-22)
        const forcedTrust = isForced('ch21_trust_signals');
        const trustApproach = forcedTrust?.approach ||
            this.selectTrustApproach(b(108), primaryProfile);
        const ch21_trust_signals = forcedTrust || {
            approach: trustApproach,
            prominence: this.selectTrustProminence(traits, primaryProfile),
            layoutVariant: `trust_${trustApproach}_${Math.floor(b(109) * 5)}`,
            contentProvided: false,
            suggestedStats: this.suggestStats(primaryProfile)
        };
        const ch21_trust_content = isForced('ch21_trust_content') || {
            credentials: [],
            testimonials: [],
            stats: [],
            securityBadges: []
        };
        const ch22_social_proof = isForced('ch22_social_proof') || {
            type: this.selectSocialProofType(b(110), primaryProfile),
            prominence: this.selectTrustProminence(traits, primaryProfile),
            layout: this.selectFromHash(b(111), ["grid", "marquee", "carousel", "static"])
        };
        const ch22_impact_demonstration = isForced('ch22_impact_demonstration') || {
            type: this.selectImpactType(b(112), primaryProfile),
            realTime: b(113) > 0.7,
            interactive: b(114) > 0.6
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
            userSegmentation: traits.informationDensity > 0.7
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
            ch9_grid,
            ch10_hierarchy,
            ch11_texture,
            ch12_signature,
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
            ch24_personalization
        };
    }
    /**
     * Classify sub-sector from content traits
     */
    classifySubSectorFromTraits(traits, primarySector) {
        // In a real implementation, this would analyze actual content
        // For now, use trait heuristics
        const { subSector, confidence } = classifySubSector("", primarySector);
        return { subSector: subSector, confidence };
    }
    /**
     * Extract keywords from traits (placeholder)
     */
    extractKeywords(traits) {
        return [];
    }
    /**
     * Calculate sub-sector confidence
     */
    subSectorConfidence(traits) {
        return 0.5 + (traits.informationDensity * 0.3);
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
            sectionCount: this.estimateSections(traits)
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
        const baseSpacing = Math.floor(b(4) * 16) + 4;
        return {
            density,
            baseSpacing,
            sectionSpacing: baseSpacing * 4
        };
    }
    /**
     * Generate display typography
     */
    generateDisplayType(traits, b, profile) {
        let charge = profile.defaultTypography;
        if (traits.temporalUrgency > 0.7 && traits.informationDensity > 0.6) {
            charge = "monospace";
        }
        else if (traits.emotionalTemperature > 0.7) {
            charge = "humanist";
        }
        else if (traits.emotionalTemperature < 0.4) {
            charge = "geometric";
        }
        return {
            family: this.selectDisplayFont(b(5), charge),
            charge,
            weight: [400, 700, 900][b(6) % 3],
            fallback: "system-ui, -apple-system, sans-serif"
        };
    }
    /**
     * Generate body typography
     */
    generateBodyType(traits, b, profile) {
        const charge = profile.defaultTypography;
        return {
            family: this.selectBodyFont(b(7), charge),
            xHeightRatio: 0.5 + b(8) * 0.2,
            contrast: 0.8 + b(9) * 0.4,
            fallback: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        };
    }
    /**
     * Generate primary color with sector psychology and brand integration
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
        // Select from sector color profile
        const colorName = selectColorFromProfile(primaryProfile.colorProfile.primary, Math.floor(b(10) * 255));
        const hsl = colorNameToHSL(colorName);
        // Blend with secondary sector if present
        if (secondaryProfile && b(11) > 0.5) {
            const secondaryColor = selectColorFromProfile(secondaryProfile.colorProfile.primary, Math.floor(b(12) * 255));
            const secondaryHSL = colorNameToHSL(secondaryColor);
            // Blend 70% primary, 30% secondary
            hsl.h = this.blendHue(hsl.h, secondaryHSL.h, 0.3);
            hsl.s = hsl.s * 0.7 + secondaryHSL.s * 0.3;
            hsl.l = hsl.l * 0.7 + secondaryHSL.l * 0.3;
        }
        // Add entropy variation (±15 degrees)
        const variation = (b(13) - 0.5) * 30;
        hsl.h = (hsl.h + variation + 360) % 360;
        return {
            hue: Math.round(hsl.h),
            saturation: Math.round(hsl.s) / 100,
            lightness: Math.round(hsl.l) / 100,
            temperature: this.getTemperatureFromHue(hsl.h),
            hex: this.hslToHex(hsl.h, hsl.s, hsl.l),
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
            backgroundTemp = b(13) > 0.5 ? "neutral" : "cool";
        }
        return {
            backgroundTemp,
            contrastRatio: 4.5 + b(13) * 10,
            surfaceColor: backgroundTemp === "cool" ? "#141414" : "#ffffff",
            elevatedSurface: backgroundTemp === "cool" ? "#1e1e1e" : "#f4f4f4"
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
            variableRadius: traits.playfulness > 0.6
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
        return {
            physics,
            durationScale: 0.2 + b(14) * 1.8,
            staggerDelay: b(15) * 0.1
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
            gap: Math.floor(b(16) * 24) + 8
        };
    }
    /**
     * Generate hierarchy
     */
    generateHierarchy(traits, b) {
        return {
            depth: traits.informationDensity > 0.7 ? "flat" : "overlapping",
            zIndexBehavior: "isolation",
            layerBlur: b(17) * 10
        };
    }
    /**
     * Generate texture
     */
    generateTexture(traits, b) {
        return {
            surface: traits.emotionalTemperature > 0.6 ? "grain" : "flat",
            noiseLevel: b(16) * 0.5,
            pattern: null
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
            enabled: fx !== "none"
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
            transmission: material === "glass" ? 0.8 + b(20) * 0.2 : 0,
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
                complexity: 0.5,
                enabled: false,
                usage: "none"
            };
        }
        let geometry = "monolithic";
        if (traits.playfulness > 0.6)
            geometry = "organic";
        else if (traits.informationDensity > 0.7)
            geometry = "fractal";
        return {
            geometry,
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
    selectHeroType(byte, primaryProfile, secondaryProfile) {
        // Blend primary and secondary sector weights
        const weights = { ...primaryProfile.heroTypeWeights };
        if (secondaryProfile) {
            for (const [type, weight] of Object.entries(secondaryProfile.heroTypeWeights)) {
                weights[type] = weights[type] * 0.7 + weight * 0.3;
            }
        }
        // Normalize and select
        const total = Object.values(weights).reduce((a, b) => a + b, 0);
        const threshold = (byte / 255) * total;
        let cumulative = 0;
        for (const [type, weight] of Object.entries(weights)) {
            cumulative += weight;
            if (cumulative >= threshold) {
                return type;
            }
        }
        return "product_ui";
    }
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
    selectTrustApproach(byte, profile) {
        const weights = profile.trustApproachWeights;
        const total = Object.values(weights).reduce((a, b) => a + b, 0);
        const threshold = (byte / 255) * total;
        let cumulative = 0;
        for (const [approach, weight] of Object.entries(weights)) {
            cumulative += weight;
            if (cumulative >= threshold) {
                return approach;
            }
        }
        return "credentials";
    }
    selectTrustProminence(traits, profile) {
        if (traits.trustRequirement > 0.8)
            return "hero_feature";
        if (traits.trustRequirement > 0.6)
            return "prominent";
        if (traits.trustRequirement > 0.4)
            return "integrated";
        return "subtle";
    }
    suggestStats(profile) {
        const statsBySector = {
            healthcare: ["patients_served", "success_rate", "years_experience", "awards"],
            fintech: ["transaction_volume", "users", "uptime", "security_rating"],
            automotive: ["vehicles_sold", "satisfaction_rate", "years_warranty", "dealerships"],
            education: ["students_enrolled", "graduation_rate", "alumni_network", "courses"],
            commerce: ["customers", "products", "shipping_speed", "return_rate"],
            entertainment: ["subscribers", "content_hours", "ratings", "awards"],
            manufacturing: ["units_produced", "quality_certifications", "countries", "years_experience"],
            legal: ["cases_won", "years_practice", "attorneys", "client_satisfaction"],
            real_estate: ["properties_sold", "agents", "years_experience", "customer_rating"],
            travel: ["destinations", "travelers", "reviews", "partners"],
            food: ["locations", "meals_served", "rating", "years_open"],
            sports: ["members", "championships", "athletes", "facilities"],
            technology: ["users", "uptime", "performance", "integrations"]
        };
        return statsBySector[profile.sector] || ["customers", "years_experience"];
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
            technology: { customer_logos: 0.25, user_count: 0.25, rating_stars: 0.15, testimonials_grid: 0.15, community_size: 0.1, press_mentions: 0.1 }
        };
        const sectorWeights = weights[profile.sector];
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
            technology: { live_counter: 0.3, cumulative_stats: 0.3, before_after: 0.1, roi_calculator: 0.15, timeline_progress: 0.15 }
        };
        const sectorWeights = weights[profile.sector];
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
            technology: ["product_screenshots", "abstract_gradient", "illustration"]
        };
        const treatments = treatmentsBySector[profile.sector] || ["lifestyle_photography"];
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
            technology: ["product_demo", "brand_story", "tutorial_walkthrough"]
        };
        const strategies = strategiesBySector[profile.sector] || ["brand_story"];
        return strategies[Math.floor(byte * strategies.length) % strategies.length];
    }
    // ==================== UTILITY FUNCTIONS ====================
    selectFromHash(byte, options) {
        return options[byte % options.length];
    }
    selectDisplayFont(byte, charge) {
        if (charge === "monospace")
            return "Space Mono, JetBrains Mono, monospace";
        if (charge === "humanist")
            return "Fraunces, Playfair Display, serif";
        if (charge === "geometric")
            return "Space Grotesk, system-ui, sans-serif";
        return "system-ui, -apple-system, sans-serif";
    }
    selectBodyFont(byte, charge) {
        if (charge === "monospace")
            return "IBM Plex Mono, Courier, monospace";
        if (charge === "humanist")
            return "Merriweather, Georgia, serif";
        return "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    }
    isColorAppropriateForSector(hue, sector) {
        // Simple appropriateness check
        // Healthcare: blues, greens (180-240)
        // Fintech: blues, purples (240-300)
        // etc.
        const appropriateRanges = {
            healthcare: [[180, 240], [90, 150]], // Blues, greens
            fintech: [[220, 300]], // Blues, purples
            automotive: [[0, 360]], // Any (brand dependent)
            education: [[200, 280], [100, 140]], // Blues, greens
            commerce: [[0, 360]], // Any
            entertainment: [[0, 360]], // Any
            manufacturing: [[200, 240]], // Blues
            legal: [[220, 260]], // Navy blues
            real_estate: [[180, 220], [30, 60]], // Blues, earth tones
            travel: [[170, 210], [20, 50]], // Teals, oranges
            food: [[10, 50], [90, 150]], // Oranges, greens
            sports: [[0, 60], [200, 260]], // Red/orange, blue
            technology: [[200, 280]] // Blues, purples
        };
        const ranges = appropriateRanges[sector];
        return ranges.some(([min, max]) => hue >= min && hue <= max);
    }
    getTemperatureFromHue(hue) {
        if (hue >= 0 && hue < 60)
            return "warm";
        if (hue >= 60 && hue < 170)
            return "neutral";
        if (hue >= 170 && hue < 260)
            return "cool";
        if (hue >= 260 && hue < 330)
            return "neutral";
        return "warm";
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
     * Legacy API for backwards compatibility
     */
    generateFromArchetype(archetypeName, seed) {
        // Map archetype to sector
        const sectorMap = {
            dashboard: "technology",
            portfolio: "technology",
            documentation: "education",
            commerce: "commerce",
            landing: "technology",
            blog: "entertainment"
        };
        const sector = sectorMap[archetypeName] || "technology";
        // Generate neutral traits
        const traits = {
            informationDensity: 0.5,
            temporalUrgency: 0.5,
            emotionalTemperature: 0.5,
            playfulness: 0.5,
            spatialDependency: 0.3,
            trustRequirement: 0.5,
            visualEmphasis: 0.5,
            conversionFocus: 0.5
        };
        return this.generate(seed, traits, {
            primarySector: sector,
            options: { creativityLevel: "balanced" }
        });
    }
}
