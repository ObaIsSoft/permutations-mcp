import * as crypto from "crypto";
import { ARCHETYPES } from "./archetypes.js";
import { GenomeConstraintSolver } from "./constraint-solver.js";
export class GenomeSequencer {
    generate(seed, traits, epigenetics) {
        const hash = crypto.createHash("sha256").update(seed).digest("hex");
        const bytes = Buffer.from(hash, 'hex');
        // 1. Base generation from hash (0.0 to 1.0)
        const b = (index) => bytes[index] / 255;
        // 2. Mathematical Epistasis (Hash + Traits)
        // Structure Topology
        let topology = "flat";
        if (traits.informationDensity > 0.7 && traits.temporalUrgency > 0.6) {
            topology = "flat"; // Dashboards
        }
        else if (traits.temporalUrgency < 0.4 && traits.informationDensity < 0.6) {
            topology = "deep"; // Long form reading
        }
        else {
            topology = this.selectFromHash(bytes[0], ["flat", "deep", "graph", "radial"]);
        }
        // Rhythm Density
        let density = "breathing";
        if (traits.informationDensity > 0.8)
            density = "maximal";
        else if (traits.informationDensity > 0.6)
            density = "airtight";
        else if (traits.informationDensity < 0.3)
            density = "empty";
        // Edge Radius (Brutal/Strict = 0px, Organic/Whimsical = higher)
        // Map playfulness 0.0-1.0 to a radius multiplier
        const maxRadius = 32;
        const radius = Math.round(b(1) * maxRadius * traits.playfulness);
        // Grid Asymmetry (Organic = more asymmetry)
        const asymmetry = 0.5 + (b(2) * 1.5 * traits.playfulness);
        // Color Temperature
        let temp = "neutral";
        if (traits.emotionalTemperature > 0.6)
            temp = "warm";
        else if (traits.emotionalTemperature < 0.4)
            temp = "cool";
        // Motion Physics
        let physics = "none";
        if (traits.temporalUrgency > 0.8)
            physics = "none"; // Instant for fast scanning
        else if (traits.playfulness > 0.7)
            physics = "spring";
        else if (traits.emotionalTemperature < 0.3)
            physics = "step";
        // Type Charge
        let charge = "transitional";
        if (traits.temporalUrgency > 0.7 && traits.informationDensity > 0.6) {
            charge = "monospace";
        }
        else if (traits.emotionalTemperature > 0.7) {
            charge = "humanist";
        }
        else if (traits.emotionalTemperature < 0.4) {
            charge = "geometric";
        }
        // Atmosphere FX (Glassmorphism, noise, etc)
        let fx = "none";
        if (traits.spatialDependency > 0.4) {
            if (traits.emotionalTemperature > 0.5 && traits.informationDensity < 0.6)
                fx = "glassmorphism";
            else if (traits.playfulness > 0.7)
                fx = "fluid_mesh";
            else if (traits.informationDensity > 0.6)
                fx = "crt_noise";
        }
        // Physics Material (Neumorphism, glass, metallic)
        let material = "matte";
        if (traits.spatialDependency > 0.4) {
            if (traits.emotionalTemperature > 0.6 && traits.playfulness < 0.5)
                material = "neumorphism";
            else if (traits.emotionalTemperature < 0.4)
                material = "metallic";
            else
                material = "glass";
        }
        // Biomarker Geometry
        let geometry = "monolithic";
        if (traits.playfulness > 0.6)
            geometry = "organic";
        else if (traits.informationDensity > 0.7)
            geometry = "fractal";
        // Base Hue from hash
        let hue = Math.round(b(10) * 360);
        // Epigenetic Override: Let the uploaded Brand Logo dictate the exact Hue
        if (epigenetics?.epigeneticHue !== undefined) {
            hue = epigenetics.epigeneticHue;
        }
        // Generate DNA-driven typography scale
        const typographyScale = this.generateTypographyScale(traits, b);
        // Generate accessibility profile based on traits
        const accessibilityProfile = this.generateAccessibilityProfile(traits, b);
        // Generate rendering strategy based on traits
        const renderingStrategy = this.generateRenderingStrategy(traits, b);
        // Assemble Genome
        const genome = {
            dnaHash: hash,
            traits,
            chromosomes: {
                ch1_structure: { topology, maxNesting: Math.floor(b(3) * 4) + 1 },
                ch2_rhythm: { density, baseSpacing: Math.floor(b(4) * 16) + 4 },
                ch3_type_display: { family: this.selectDisplayFont(bytes[5], charge), charge, weight: [400, 700, 900][bytes[6] % 3] },
                ch4_type_body: { family: this.selectBodyFont(bytes[7], charge), xHeightRatio: 0.5 + b(8) * 0.2, contrast: 0.8 + b(9) * 0.4 },
                ch5_color_primary: { hue, saturation: Math.max(0.2, b(11)), lightness: Math.max(0.2, b(12)), temperature: temp },
                ch6_color_temp: { backgroundTemp: temp === "warm" ? "cool" : "neutral", contrastRatio: 4.5 + b(13) * 10 },
                ch7_edge: { radius, style: radius === 0 ? "sharp" : (radius > 16 ? "organic" : "soft") },
                ch8_motion: { physics, durationScale: 0.2 + b(14) * 1.8 },
                ch9_grid: { logic: traits.informationDensity > 0.8 ? "column" : this.selectFromHash(bytes[15], ["column", "masonry", "broken"]), asymmetry },
                ch10_hierarchy: { depth: traits.informationDensity > 0.7 ? "flat" : "overlapping", zIndexBehavior: "isolation" },
                ch11_texture: { surface: traits.emotionalTemperature > 0.6 ? "grain" : "flat", noiseLevel: b(16) * 0.5 },
                ch12_signature: { entropy: b(17), uniqueMutation: hash.slice(0, 8) },
                ch13_atmosphere: { fx, intensity: b(18) * traits.spatialDependency },
                ch14_physics: { material, roughness: b(19) * (1 - traits.playfulness), transmission: material === "glass" ? 0.8 + b(20) * 0.2 : 0 },
                ch15_biomarker: { geometry, complexity: b(21) * traits.informationDensity },
                ch16_typography: typographyScale,
                ch17_accessibility: accessibilityProfile,
                ch18_rendering: renderingStrategy
            },
            constraints: {
                forbiddenPatterns: [],
                requiredPatterns: [],
                bondingRules: []
            },
            viabilityScore: 1.0
        };
        // Apply constraint solver for proper conflict resolution
        const solver = new GenomeConstraintSolver();
        const result = solver.solve(genome);
        // Log rationale for debugging
        if (result.rationale.length > 0) {
            console.log("[Constraint Solver] Decisions:");
            result.rationale.forEach(r => console.log(`  ${r}`));
        }
        return result.genome;
    }
    selectFromHash(byte, options) {
        return options[byte % options.length];
    }
    selectDisplayFont(byte, charge) {
        if (charge === "monospace")
            return "Space Mono, JetBrains Mono, monospace";
        if (charge === "humanist")
            return "Fraunces, Playfair Display, serif";
        if (charge === "geometric")
            return "Space Grotesk, Inter, sans-serif";
        return "Helvetica Neue, system-ui, sans-serif";
    }
    selectBodyFont(byte, charge) {
        if (charge === "monospace")
            return "IBM Plex Mono, Courier, monospace";
        if (charge === "humanist")
            return "Merriweather, Georgia, serif";
        return "Inter, Roboto, sans-serif";
    }
    /**
     * Generate DNA-driven typography scale based on content traits.
     *
     * High information density → smaller sizes, tighter leading, compact scale
     * Low temporal urgency (reading) → larger sizes, generous leading
     * High emotional temperature → more dramatic scale ratios
     */
    generateTypographyScale(traits, b) {
        // Select scale ratio based on emotional temperature
        // Warm/emotional = dramatic ratios (golden ratio, perfect fifth)
        // Cool/clinical = conservative ratios (major second, minor third)
        let ratio;
        if (traits.emotionalTemperature > 0.7) {
            ratio = 1.618; // Golden ratio - dramatic
        }
        else if (traits.emotionalTemperature > 0.4) {
            ratio = 1.5; // Perfect fifth - balanced
        }
        else {
            ratio = 1.25; // Major third - conservative
        }
        // Base size varies by information density
        // Dense interfaces need smaller base text to fit more content
        let baseSize;
        if (traits.informationDensity > 0.8) {
            baseSize = 14; // Dashboard/data-dense
        }
        else if (traits.informationDensity > 0.5) {
            baseSize = 16; // Standard
        }
        else {
            baseSize = 18; // Editorial/long-form
        }
        // Line height varies by temporal urgency
        // Fast scanning needs tighter lines, reading needs more breathing room
        const getLineHeight = (tightness) => {
            if (traits.temporalUrgency > 0.7)
                return (1.2 + tightness * 0.2).toFixed(2);
            if (traits.temporalUrgency > 0.4)
                return (1.4 + tightness * 0.2).toFixed(2);
            return (1.6 + tightness * 0.2).toFixed(2); // Relaxed for reading
        };
        // Letter spacing varies by density and urgency
        const getLetterSpacing = (emphasis) => {
            if (traits.informationDensity > 0.7)
                return `${-0.02 * emphasis}em`; // Tight for dense
            if (traits.temporalUrgency > 0.7)
                return `${0.01 * emphasis}em`; // Slight spread for scanning
            return "0em";
        };
        // Calculate sizes using the ratio
        const sizes = {
            display: Math.round(baseSize * Math.pow(ratio, 4)),
            h1: Math.round(baseSize * Math.pow(ratio, 3)),
            h2: Math.round(baseSize * Math.pow(ratio, 2)),
            h3: Math.round(baseSize * ratio),
            body: baseSize,
            small: Math.round(baseSize / Math.sqrt(ratio))
        };
        return {
            display: {
                size: `${sizes.display}px`,
                lineHeight: getLineHeight(0),
                letterSpacing: getLetterSpacing(0.5)
            },
            h1: {
                size: `${sizes.h1}px`,
                lineHeight: getLineHeight(0.2),
                letterSpacing: getLetterSpacing(0.3)
            },
            h2: {
                size: `${sizes.h2}px`,
                lineHeight: getLineHeight(0.4),
                letterSpacing: getLetterSpacing(0.2)
            },
            h3: {
                size: `${sizes.h3}px`,
                lineHeight: getLineHeight(0.6),
                letterSpacing: getLetterSpacing(0.1)
            },
            body: {
                size: `${sizes.body}px`,
                lineHeight: getLineHeight(1.0),
                letterSpacing: getLetterSpacing(0)
            },
            small: {
                size: `${sizes.small}px`,
                lineHeight: getLineHeight(0.8),
                letterSpacing: getLetterSpacing(0.2)
            },
            ratio,
            baseSize
        };
    }
    /**
     * Generate WCAG accessibility profile based on content traits.
     *
     * High temporal urgency → stronger focus indicators, larger touch targets
     * High information density → higher contrast requirements
     * Low playfulness (serious) → respect motion preferences strictly
     */
    generateAccessibilityProfile(traits, b) {
        // Contrast ratio: higher for data-dense interfaces
        const minContrastRatio = traits.informationDensity > 0.7 ? 7.0 :
            traits.informationDensity > 0.4 ? 4.5 : 3.0;
        // Focus indicator: more prominent for urgent/fast-scanning interfaces
        let focusIndicator = "outline";
        if (traits.temporalUrgency > 0.8) {
            focusIndicator = "ring"; // Very prominent for urgent interfaces
        }
        else if (traits.playfulness > 0.6) {
            focusIndicator = "underline"; // Subtle for playful interfaces
        }
        // Motion preference: strict for serious/professional, relaxed for playful
        const respectMotionPreference = traits.playfulness < 0.5;
        // Touch target: larger for urgent interfaces (fast interactions)
        const minTouchTarget = traits.temporalUrgency > 0.7 ? 48 : 44;
        // Screen reader optimization: important for dense data interfaces
        const screenReaderOptimized = traits.informationDensity > 0.6;
        return {
            minContrastRatio,
            focusIndicator,
            respectMotionPreference,
            minTouchTarget,
            screenReaderOptimized
        };
    }
    /**
     * Generate rendering strategy based on content traits.
     *
     * High spatial dependency + playfulness → WebGL for immersive 3D
     * Low spatial dependency → CSS for performance
     * High information density → Static for simplicity
     * Low playfulness + high density → SVG for precision
     */
    generateRenderingStrategy(traits, b) {
        // Determine primary renderer based on spatial needs
        let primary = "css";
        if (traits.spatialDependency > 0.6 && traits.playfulness > 0.4) {
            primary = "webgl"; // 3D immersive experience
        }
        else if (traits.spatialDependency > 0.4 && traits.playfulness > 0.3) {
            primary = "css"; // CSS 3D transforms
        }
        else if (traits.informationDensity > 0.8 && traits.playfulness < 0.3) {
            primary = "svg"; // Precision for data viz
        }
        else if (traits.informationDensity > 0.9) {
            primary = "static"; // Maximal performance
        }
        // Determine fallback based on primary and accessibility
        let fallback = "css";
        if (primary === "webgl") {
            // WebGL → CSS animated fallback
            fallback = "css";
        }
        else if (primary === "css") {
            // CSS → static fallback if motion not allowed
            fallback = traits.playfulness < 0.2 ? "static" : "css";
        }
        else {
            // SVG/static → no fallback needed
            fallback = "none";
        }
        // Animation depends on accessibility and urgency
        const animate = !(traits.temporalUrgency > 0.9 || // Too urgent for motion
            (traits.playfulness < 0.3 && traits.informationDensity > 0.7) // Serious + dense
        );
        // Complexity based on information density and device capability assumptions
        let complexity = "balanced";
        if (traits.informationDensity > 0.8) {
            complexity = "minimal"; // Keep it simple for dense UIs
        }
        else if (traits.spatialDependency > 0.6 && traits.playfulness > 0.5) {
            complexity = "rich"; // Go all out for immersive playful
        }
        return {
            primary,
            fallback,
            animate,
            complexity
        };
    }
    /**
     * @deprecated Use GenomeConstraintSolver instead
     */
    applyViabilityConstraints(genome) {
        const solver = new GenomeConstraintSolver();
        return solver.solve(genome);
    }
    /**
     * Generate genome from functional archetype without requiring API calls.
     * Uses deterministic hash + archetype constraints for API-free generation.
     */
    generateFromArchetype(archetypeName, seed) {
        const archetype = ARCHETYPES[archetypeName];
        if (!archetype) {
            throw new Error(`Unknown archetype: ${archetypeName}. Available: ${Object.keys(ARCHETYPES).join(", ")}`);
        }
        // Get base genome from hash
        const hash = crypto.createHash("sha256").update(seed).digest("hex");
        const genome = this.hashToGenome(hash);
        // Apply archetype constraints
        genome.chromosomes.ch1_structure.topology = archetype.constraints.preferredTopology;
        genome.chromosomes.ch8_motion.physics = archetype.constraints.motionPreference;
        genome.chromosomes.ch7_edge.style = archetype.constraints.edgePreference;
        if (archetype.constraints.edgePreference === "sharp") {
            genome.chromosomes.ch7_edge.radius = 0;
        }
        // Force typography based on archetype
        if (archetype.constraints.requiredCharge) {
            genome.chromosomes.ch3_type_display.charge = archetype.constraints.requiredCharge;
        }
        // Add forbidden patterns from archetype
        archetype.constraints.forbiddenFonts.forEach(font => {
            genome.constraints.forbiddenPatterns.push(font);
        });
        // Set viability markers
        genome.constraints.bondingRules.push(`Archetype: ${archetype.name} - ${archetype.description}`);
        return genome;
    }
    hashToGenome(hash) {
        const bytes = Buffer.from(hash, 'hex');
        const b = (index) => bytes[index] / 255;
        // Generate traits from hash
        const traits = {
            informationDensity: b(0),
            temporalUrgency: b(1),
            emotionalTemperature: b(2),
            playfulness: b(3),
            spatialDependency: b(4),
        };
        // Use existing generate logic
        return this.generate(hash, traits);
    }
}
