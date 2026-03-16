/**
 * Permutations — Ecosystem Sequencer
 *
 * Sequences EcosystemGenome from a DesignGenome.
 * This is Layer 2 of the SHA-256 hash chain:
 *   ecosystemHash = sha256(designGenome.dnaHash)
 *
 * Two forces drive every chromosome value:
 *   1. Hash bytes — pure entropy from the chain (75% weight)
 *   2. Gravity — predecessor DesignGenome chromosome values bias toward
 *      ecologically coherent selections (25% weight)
 *
 * The gravity system makes the ecosystem GROW FROM the chromosomes,
 * not just share a common hash ancestor.
 */

import * as crypto from "crypto";
import { DesignGenome, DesignPersonality } from "./types.js";
import {
    EcosystemGenome, EcosystemChromosomes,
    BiomeClass, EnergySource, SymbiosisPattern, TrophicStructure,
    SuccessionStage, AdaptationAxis, PopulationPattern,
    TemporalRhythm, SpatialAxis, CapacityClass,
} from "./ecosystem-types.js";

// ── Option arrays (order matters — gravity offsets index into these) ────────

const BIOME_CLASSES: BiomeClass[] = [
    'volcanic', 'abyssal', 'arctic', 'rainforest', 'desert',
    'tidal', 'alpine', 'cave', 'hydrothermal', 'steppe',
    'wetland', 'reef', 'boreal', 'savanna', 'mangrove', 'urban',
];

const ENERGY_SOURCES: EnergySource[] = [
    'photosynthetic', 'chemosynthetic', 'predatory',
    'decomposer', 'parasitic', 'mixotrophic',
];

const SYMBIOSIS_PATTERNS: SymbiosisPattern[] = [
    'mutualistic', 'commensal', 'parasitic',
    'competitive', 'neutral', 'allelopathic',
];

const TROPHIC_STRUCTURES: TrophicStructure[] = [
    'bottom-up', 'top-down', 'cascade', 'web', 'linear', 'detrital',
];

const SUCCESSION_STAGES: SuccessionStage[] = [
    'pioneer', 'early', 'mid', 'climax', 'post-climax', 'disturbed',
];

const ADAPTATION_AXES: AdaptationAxis[] = [
    'thermal', 'pressure', 'chemical', 'radiation', 'temporal', 'gravitational',
];

const POPULATION_PATTERNS: PopulationPattern[] = [
    'sparse', 'clustered', 'gradient', 'fractal', 'uniform', 'stratified',
];

const TEMPORAL_RHYTHMS: TemporalRhythm[] = [
    'diurnal', 'nocturnal', 'tidal', 'seasonal', 'continuous',
];

const SPATIAL_AXES: SpatialAxis[] = [
    'surface', 'subsurface', 'pelagic', 'benthic', 'terrestrial',
];

const CAPACITY_CLASSES: CapacityClass[] = [
    'minimal', 'sparse', 'optimal', 'dense', 'maximal',
];

// ── Gravity functions — predecessor DesignGenome biases successor ───────────
// Each returns an integer offset (bounded to ±25% of option array length).
// The hash byte provides 75% of entropy; gravity shifts by up to 25%.

function biomeGravity(g: DesignGenome): number {
    // Returns a TARGET INDEX into BIOME_CLASSES (not an offset).
    // Priority order: first matching condition wins.
    const c = g.chromosomes;
    // Dark + metallic → hydrothermal (8): mineral, reactive, high-energy
    if (c.ch6_color_temp.isDark && c.ch14_physics.material === 'metallic') return 8;
    // Dark + glass → abyssal (1): deep, pressured, translucent
    if (c.ch6_color_temp.isDark && c.ch14_physics.material === 'glass') return 1;
    // Dark → cave (7): enclosed, bioluminescent layers
    if (c.ch6_color_temp.isDark) return 7;
    // Glass → tidal (5): rhythmic, oscillating, transparent
    if (c.ch14_physics.material === 'glass') return 5;
    // Organic edge → rainforest (3): dense, layered, biological
    if (c.ch7_edge.style === 'organic') return 3;
    // Sharp/brutalist → arctic (2): cold, sparse, exposed
    if (c.ch7_edge.style === 'sharp' || c.ch7_edge.style === 'brutalist') return 2;
    // Maximal density → reef (11): high diversity, colour-dense
    if (c.ch2_rhythm.density === 'maximal') return 11;
    // Empty density → desert (4): minimal, vast spacing
    if (c.ch2_rhythm.density === 'empty') return 4;
    // Default → steppe (9): flat, wide, open — neutral fallback
    return 9;
}

function energyGravity(g: DesignGenome): number {
    // Spring physics → photosynthetic (generative, alive)
    if (g.chromosomes.ch8_motion.physics === 'spring') return 0;
    // Glitch physics → predatory (aggressive, chaotic)
    if (g.chromosomes.ch8_motion.physics === 'glitch') return 2;
    // No motion → decomposer (static, recycling)
    if (g.chromosomes.ch8_motion.physics === 'none') return 3;
    // Step → chemosynthetic (mechanical, internal)
    return 1;
}

function symbiosisGravity(g: DesignGenome): number {
    // Breathing/relaxed → mutualistic (collaborative)
    if (g.chromosomes.ch2_rhythm.density === 'breathing') return 0;
    // Airtight → commensal (efficient, one-sided)
    if (g.chromosomes.ch2_rhythm.density === 'airtight') return 1;
    // Maximal density → parasitic (extractive)
    if (g.chromosomes.ch2_rhythm.density === 'maximal') return 2;
    // Empty → neutral/independent
    return 4;
}

function trophicGravity(g: DesignGenome): number {
    // Hierarchical topology → top-down command
    if (g.chromosomes.ch1_structure.topology === 'deep') return 1;
    // Radial topology → web (many-to-many)
    if (g.chromosomes.ch1_structure.topology === 'radial') return 3;
    // Graph topology → web
    if (g.chromosomes.ch1_structure.topology === 'graph') return 3;
    // Flat topology → linear pipeline
    if (g.chromosomes.ch1_structure.topology === 'flat') return 4;
    return 0; // default bottom-up
}

function successionGravity(g: DesignGenome, complexity: number): number {
    // Low complexity → pioneer/early stage
    if (complexity < 0.3) return 0;
    // High complexity → climax/post-climax
    if (complexity > 0.8) return 3;
    // Glitch physics → disturbed (unstable, recovering)
    if (g.chromosomes.ch8_motion.physics === 'glitch') return 5;
    // Mid complexity → mid stage
    if (complexity < 0.6) return 2;
    return 3;
}

function adaptationGravity(g: DesignGenome): number {
    // Urgency / temporal traits → temporal adaptation
    if (g.traits.temporalUrgency > 0.7) return 4;
    // High trust → pressure adaptation (high-stakes environment)
    if (g.traits.trustRequirement > 0.7) return 1;
    // Visual emphasis → radiation (exposure-first)
    if (g.traits.visualEmphasis > 0.7) return 3;
    // Dense information → chemical (data-rich transformation)
    if (g.traits.informationDensity > 0.7) return 2;
    return 0; // thermal default
}

function populationGravity(g: DesignGenome): number {
    // Grid topology → uniform
    if (g.chromosomes.ch9_grid.logic === 'column') return 4;
    // Masonry/bento → clustered
    if (g.chromosomes.ch9_grid.logic === 'masonry' ||
        g.chromosomes.ch9_grid.logic === 'bento') return 1;
    // High asymmetry → fractal
    if (g.chromosomes.ch9_grid.asymmetry > 0.6) return 3;
    // Broken/editorial → sparse
    if (g.chromosomes.ch9_grid.logic === 'broken' ||
        g.chromosomes.ch9_grid.logic === 'editorial') return 0;
    return 2; // gradient default
}

function temporalGravity(g: DesignGenome): number {
    // Dark mode → nocturnal
    if (g.chromosomes.ch6_color_temp.isDark) return 1;
    // High urgency → continuous (always active)
    if (g.traits.temporalUrgency > 0.7) return 4;
    // Step motion → tidal (rhythmic, oscillating)
    if (g.chromosomes.ch8_motion.physics === 'step') return 2;
    return 0; // diurnal default (light mode)
}

function spatialGravity(g: DesignGenome): number {
    // Deep topology → subsurface nesting
    if (g.chromosomes.ch1_structure.topology === 'deep') return 1;
    // 3d-stack hierarchy → pelagic (z-depth layers)
    if (g.chromosomes.ch10_hierarchy.depth === '3d-stack') return 2;
    return 0; // surface default
}

function capacityGravity(g: DesignGenome): number {
    // Maximal density → dense/maximal capacity
    if (g.chromosomes.ch2_rhythm.density === 'maximal') return 3;
    // Empty density → minimal capacity
    if (g.chromosomes.ch2_rhythm.density === 'empty') return 0;
    // High information density → optimal/dense
    if (g.traits.informationDensity > 0.7) return 2;
    return 2; // optimal default
}

// ── Biased selection ────────────────────────────────────────────────────────

/**
 * Weighted probability pick — gravity is the preferred TARGET INDEX (not an offset).
 * Weight distribution: target = 4×, target ± 1 = 2×, all others = 1×.
 * This gives ~30% pull toward the ecologically coherent choice while preserving
 * broad hash-driven diversity across the remaining options.
 * Previously used rotation + clamp which collapsed predatory/decomposer/photosynthetic
 * to identical effective shifts for small arrays.
 */
function biasedPick<T>(options: T[], rawByte: number, gravity: number): T {
    const len = options.length;
    const target = ((Math.round(gravity) % len) + len) % len;

    // Build cumulative weights
    const cumulative: number[] = [];
    let total = 0;
    for (let i = 0; i < len; i++) {
        const d = Math.min(Math.abs(i - target), len - Math.abs(i - target));
        const w = d === 0 ? 4 : d === 1 ? 2 : 1;
        total += w;
        cumulative.push(total);
    }

    // Map rawByte (0–255) uniformly into weight-space
    const pos = Math.floor((rawByte / 256) * total);
    for (let i = 0; i < len; i++) {
        if (pos < cumulative[i]) return options[i];
    }
    return options[len - 1];
}

function norm(byte: number): number {
    return byte / 255;
}

// ── Main sequencer ──────────────────────────────────────────────────────────

export function sequenceEcosystemGenome(
    designGenome: DesignGenome,
    complexityHint: number = 0.5,
): EcosystemGenome {
    const hash = crypto.createHash("sha256").update(designGenome.dnaHash).digest("hex");
    const b = Buffer.from(hash, "hex");

    const chromosomes: EcosystemChromosomes = {
        // bytes[0,1] — biome (full byte, not nibble — weighted biasedPick needs 0–255 range)
        eco_ch1_biome: {
            class:     biasedPick(BIOME_CLASSES, b[0], biomeGravity(designGenome)),
            intensity: norm(b[1]),
        },
        // bytes[2,3] — energy
        eco_ch2_energy: {
            source: biasedPick(ENERGY_SOURCES, b[2], energyGravity(designGenome)),
            flux:   norm(b[3]),
        },
        // bytes[4,5] — symbiosis
        eco_ch3_symbiosis: {
            pattern: biasedPick(SYMBIOSIS_PATTERNS, b[4], symbiosisGravity(designGenome)),
            depth:   norm(b[5]),
        },
        // bytes[6,7] — trophic
        eco_ch4_trophic: {
            structure: biasedPick(TROPHIC_STRUCTURES, b[6], trophicGravity(designGenome)),
            cascade:   norm(b[7]),
        },
        // bytes[8,9] — succession
        eco_ch5_succession: {
            stage: biasedPick(SUCCESSION_STAGES, b[8], successionGravity(designGenome, complexityHint)),
            drift: norm(b[9]),
        },
        // bytes[10,11] — adaptation
        eco_ch6_adaptation: {
            axis:     biasedPick(ADAPTATION_AXES, b[10], adaptationGravity(designGenome)),
            strength: norm(b[11]),
        },
        // bytes[12,13] — population
        eco_ch7_population: {
            pattern:  biasedPick(POPULATION_PATTERNS, b[12], populationGravity(designGenome)),
            variance: norm(b[13]),
        },
        // bytes[14,15] — temporal
        eco_ch8_temporal: {
            rhythm:    biasedPick(TEMPORAL_RHYTHMS, b[14], temporalGravity(designGenome)),
            intensity: norm(b[15]),
        },
        // bytes[16,17] — spatial
        eco_ch9_spatial: {
            axis:      biasedPick(SPATIAL_AXES, b[16], spatialGravity(designGenome)),
            isolation: norm(b[17]),
        },
        // bytes[18,19] — carrying capacity
        eco_ch10_capacity: {
            class:    biasedPick(CAPACITY_CLASSES, b[18], capacityGravity(designGenome)),
            pressure: norm(b[19]),
        },
        // bytes[20,21] — mutation
        eco_ch11_mutation: {
            rate:     norm(b[20]),
            variance: norm(b[21]),
        },
        // bytes[22,23] — design personality / expressiveness
        // No sector gate — any personality is valid in any sector.
        // The hash alone determines what personality emerges.
        eco_ch12_expressiveness: sequenceExpressiveness(b[22], b[23]),
    };

    return { hash, parentHash: designGenome.dnaHash, chromosomes };
}

// ── Expressiveness sequencer ─────────────────────────────────────────────────

const PERSONALITIES: DesignPersonality[] = [
    'clinical', 'corporate', 'balanced', 'bold', 'expressive', 'disruptive',
];

const PERSONALITY_RANGES: Record<DesignPersonality, [number, number]> = {
    clinical:   [0.00, 0.15],
    corporate:  [0.15, 0.35],
    balanced:   [0.35, 0.55],
    bold:       [0.55, 0.75],
    expressive: [0.75, 0.90],
    disruptive: [0.90, 1.00],
};

function sequenceExpressiveness(classByte: number, scoreByte: number) {
    // byte[22] → personality (uniform across 6 options — no sector gate)
    const personality = PERSONALITIES[Math.floor((classByte / 256) * PERSONALITIES.length)];
    const [lo, hi] = PERSONALITY_RANGES[personality];
    const score = lo + norm(scoreByte) * (hi - lo);

    const unlocks: Array<"expressive_type" | "brutalist_edge" | "glitch_motion" | "bold_fx" | "asymmetric_layout"> = [];
    if (score >= 0.55) unlocks.push("expressive_type");
    if (score >= 0.65) unlocks.push("bold_fx");
    if (score >= 0.75) unlocks.push("asymmetric_layout");
    if (score >= 0.85) unlocks.push("brutalist_edge");
    if (score >= 0.90) unlocks.push("glitch_motion");

    return { personality, score, unlocks };
}
