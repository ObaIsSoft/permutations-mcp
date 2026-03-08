import * as crypto from "crypto";
import { ARCHETYPES } from "./archetypes.js";
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
                ch15_biomarker: { geometry, complexity: b(21) * traits.informationDensity }
            },
            constraints: {
                forbiddenPatterns: [],
                requiredPatterns: [],
                bondingRules: []
            },
            viabilityScore: 1.0
        };
        return this.applyViabilityConstraints(genome);
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
    applyViabilityConstraints(genome) {
        // Determine strict required/forbidden patterns based on mathematical traits
        if (genome.traits.temporalUrgency > 0.8) {
            genome.constraints.forbiddenPatterns.push("scroll_animations", "parallax", "heavy_blur_effects");
            genome.constraints.requiredPatterns.push("high_contrast_text", "tabular_numerals");
            genome.constraints.bondingRules.push("High Temporal Urgency -> Forbidden complex animations.");
        }
        if (genome.traits.informationDensity > 0.8) {
            genome.constraints.forbiddenPatterns.push("large_hero_images", "generous_whitespace", "rounded_cards");
            genome.constraints.requiredPatterns.push("compact_base_spacing");
            genome.constraints.bondingRules.push("High Information Density -> Forced compact rhythm.");
        }
        if (genome.traits.playfulness < 0.2) {
            genome.chromosomes.ch7_edge.radius = 0;
            genome.constraints.forbiddenPatterns.push("bounce_animations", "comic_sans");
            genome.constraints.bondingRules.push("Low Playfulness -> Forced brutalist radius (0px).");
        }
        return genome;
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
