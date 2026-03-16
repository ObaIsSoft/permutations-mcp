/**
 * Permutations — EcosystemGenome Type System
 *
 * Layer 2 of the SHA-256 hash chain.
 *   hash = sha256(designGenome.dnaHash)
 *   Each chromosome pair: [class byte] + [intensity byte]
 *   24 of 32 hash bytes consumed → ~75% entropy used
 *
 * Every chromosome must change something real in the output.
 * No decorative chromosomes.
 */

import type { DesignPersonality } from "./types.js";

// ── Chromosome value types ─────────────────────────────────────────────────

/** 16 biome categories — derived from high nibble of byte[0] */
export type BiomeClass =
    | 'volcanic'     // harsh, mineral, high-contrast surfaces
    | 'abyssal'      // deep, pressured, dark, minimal light
    | 'arctic'       // cold-efficient, sparse, high negative space
    | 'rainforest'   // dense, layered, rich feature count
    | 'desert'       // minimal, vast spacing, heat-shimmer effects
    | 'tidal'        // rhythmic, responsive, oscillating patterns
    | 'alpine'       // precise, high-altitude, clean edges
    | 'cave'         // enclosed, layered depth, bioluminescent accents
    | 'hydrothermal' // reactive, warm-to-cool gradients, high energy
    | 'steppe'       // flat, wide, open-range scalability
    | 'wetland'      // composite, layered, hybrid component patterns
    | 'reef'         // high diversity, colour-dense, shallow depth
    | 'boreal'       // structured, repeating, tree-like hierarchy
    | 'savanna'      // open, spread, wide information landscapes
    | 'mangrove'     // tangled roots, multi-level nesting patterns
    | 'urban';       // grid-dense, modular, rectilinear

/** How the ecosystem produces and exchanges energy */
export type EnergySource =
    | 'photosynthetic'  // open, generative, abundance-oriented
    | 'chemosynthetic'  // self-sufficient, internal, hidden processes
    | 'predatory'       // extractive, aggressive, acquisition-driven
    | 'decomposer'      // recycling, transformative, cyclical
    | 'parasitic'       // dependent, attached, host-reliant
    | 'mixotrophic';    // adaptive, context-switching, hybrid

/** How organisms relate to and depend on each other */
export type SymbiosisPattern =
    | 'mutualistic'   // both benefit — tightly coupled, collaborative
    | 'commensal'     // one benefits, one neutral — loose coupling
    | 'parasitic'     // one benefits at other's cost — extraction
    | 'competitive'   // both compete — minimal shared interface
    | 'neutral'       // independent — modular, decoupled
    | 'allelopathic'; // one inhibits others — exclusive, gatekeeping

/** How energy and information flows through the trophic chain */
export type TrophicStructure =
    | 'bottom-up'  // atomic drives whole — data feeds up
    | 'top-down'   // orchestrators drive atoms — command flows down
    | 'cascade'    // event chain — one change ripples through all
    | 'web'        // graph — every organism connects to many others
    | 'linear'     // strict pipeline — A → B → C, no branching
    | 'detrital';  // decomposition-based — recycle, reuse, transform

/** Ecological succession — how established/mature the ecosystem is */
export type SuccessionStage =
    | 'pioneer'      // bare substrate, first arrivals, minimal structure
    | 'early'        // colonisation underway, sparse, fast-changing
    | 'mid'          // establishing, moderate complexity, stabilising
    | 'climax'       // mature, stable, high diversity, slow change
    | 'post-climax'  // old-growth, maximum complexity, slow decay
    | 'disturbed';   // recovering from disruption, chaotic, rebuilding

/** Primary environmental pressure organisms have adapted to */
export type AdaptationAxis =
    | 'thermal'       // temperature extremes — performance, efficiency
    | 'pressure'      // high-load, compressed environments
    | 'chemical'      // reactive, data-rich, transformation focus
    | 'radiation'     // high-exposure, visibility-first
    | 'temporal'      // time-sensitive, urgency-driven
    | 'gravitational';// weight, hierarchy, elevation-conscious

/** How organisms are distributed across the spatial landscape */
export type PopulationPattern =
    | 'sparse'     // few, spread, high breathing room
    | 'clustered'  // grouped, hub-and-spoke, focal points
    | 'gradient'   // density changes smoothly across the surface
    | 'fractal'    // self-similar at every scale
    | 'uniform'    // evenly distributed, grid-like
    | 'stratified';// layered bands, distinct zones

/** Temporal activity rhythm of organisms */
export type TemporalRhythm =
    | 'diurnal'    // active in light — light-mode primary
    | 'nocturnal'  // active in dark — dark-mode primary
    | 'tidal'      // oscillating, bidirectional, rhythmic
    | 'seasonal'   // periodic, batch-cycle updates
    | 'continuous';// always active, real-time, no rest state

/** Primary spatial axis organisms inhabit */
export type SpatialAxis =
    | 'surface'    // top-level, above-fold primary
    | 'subsurface' // below surface, nested, contextual
    | 'pelagic'    // mid-water, floating layers, z-depth
    | 'benthic'    // bottom-dwelling, footer, persistent chrome
    | 'terrestrial';// ground level, full viewport

/** Carrying capacity class — max organism density */
export type CapacityClass =
    | 'minimal'  // 0–6 organisms
    | 'sparse'   // 7–14 organisms
    | 'optimal'  // 15–24 organisms
    | 'dense'    // 25–38 organisms
    | 'maximal'; // 39+ organisms

// ── Chromosome structure ────────────────────────────────────────────────────

export interface EcosystemChromosomes {
    /** bytes[0,1] — biome class (16 options) + intensity (0–1) */
    eco_ch1_biome:      { class: BiomeClass;        intensity: number };
    /** bytes[2,3] — energy source + flux (0–1, high = active energy flow) */
    eco_ch2_energy:     { source: EnergySource;     flux: number };
    /** bytes[4,5] — symbiosis pattern + depth (0–1, high = tight coupling) */
    eco_ch3_symbiosis:  { pattern: SymbiosisPattern; depth: number };
    /** bytes[6,7] — trophic structure + cascade strength (0–1) */
    eco_ch4_trophic:    { structure: TrophicStructure; cascade: number };
    /** bytes[8,9] — succession stage + drift (0–1, high = unstable) */
    eco_ch5_succession: { stage: SuccessionStage;   drift: number };
    /** bytes[10,11] — adaptation axis + strength (0–1) */
    eco_ch6_adaptation: { axis: AdaptationAxis;     strength: number };
    /** bytes[12,13] — population pattern + variance (0–1) */
    eco_ch7_population: { pattern: PopulationPattern; variance: number };
    /** bytes[14,15] — temporal rhythm + intensity (0–1) */
    eco_ch8_temporal:   { rhythm: TemporalRhythm;   intensity: number };
    /** bytes[16,17] — spatial axis + isolation (0–1, high = isolated zones) */
    eco_ch9_spatial:    { axis: SpatialAxis;         isolation: number };
    /** bytes[18,19] — capacity class + pressure (0–1, high = near ceiling) */
    eco_ch10_capacity:  { class: CapacityClass;      pressure: number };
    /** bytes[20,21] — mutation rate (0–1) + variance (0–1) */
    eco_ch11_mutation:  { rate: number;              variance: number };
    /**
     * bytes[22,23] — design personality + expressiveness score.
     *
     * Sector does NOT gate this. Any personality is valid in any sector.
     * Oscar Health (healthcare) is expressive. Vercel (technology) is disruptive.
     * The hash alone determines which personality emerges.
     *
     * Expressiveness score drives bold choices in L1 generators:
     *   ≥0.55 → expressive_type   ≥0.75 → asymmetric_layout
     *   ≥0.65 → bold_fx           ≥0.85 → brutalist_edge
     *                              ≥0.90 → glitch_motion
     */
    eco_ch12_expressiveness: {
        personality: DesignPersonality;
        score: number;   // 0.0–1.0, monotonically mapped from personality bucket
        unlocks: Array<"expressive_type" | "brutalist_edge" | "glitch_motion" | "bold_fx" | "asymmetric_layout">;
    };
}

// ── Genome ──────────────────────────────────────────────────────────────────

export interface EcosystemGenome {
    /** sha256(designGenome.dnaHash) — Layer 2 hash */
    hash: string;
    /** The dnaHash this was derived from — maintains chain provenance */
    parentHash: string;
    chromosomes: EcosystemChromosomes;
}
