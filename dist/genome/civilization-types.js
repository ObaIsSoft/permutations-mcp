/**
 * Permutations — CivilizationGenome Type System
 *
 * Layer 3 of the SHA-256 hash chain.
 *   hash = sha256(ecosystemGenome.hash)
 *   Each chromosome pair: [class byte] + [intensity byte]
 *   24 of 32 hash bytes consumed (bytes[0–23]) — 12 newly activated
 *
 * The civilization grows FROM ecological pressures.
 * A parasitic-predatory ecosystem tends toward extractive governance.
 * A mutualistic-photosynthetic ecosystem tends toward cooperative governance.
 * Every chromosome must change something an agent implements differently.
 *
 * These are APPLICATION PHILOSOPHY descriptors, not library prescriptions.
 * The civilization metaphor is the character of the product — how it
 * thinks, moves, remembers, and relates to its users.
 */
// ── Derived sub-field lookup maps ───────────────────────────────────────────
// These are intentionally exported so agents can read them in design briefs.
export const ARCHETYPE_UNLOCKS = {
    theological: 'ceremony',
    scientific: 'measurement',
    mercantile: 'conversion',
    maritime: 'navigation',
    warrior: 'command',
    democratic: 'consensus',
    industrial: 'production',
    emergent: 'emergence',
    monastic: 'contemplation',
    nomadic: 'migration',
    revolutionary: 'disruption',
    totemic: 'invocation',
    byzantine: 'negotiation',
    spartan: 'discipline',
    renaissance: 'synthesis',
    colonial: 'extraction',
};
export const TECHNOLOGY_PARADIGMS = {
    biological: 'growth_model',
    mechanical: 'precision_model',
    digital: 'event_model',
    quantum: 'superposition',
    neural: 'inference_model',
    hybrid: 'composite_model',
    crystalline: 'lattice_model',
    volcanic: 'pressure_model',
    tidal: 'rhythm_model',
    acoustic: 'resonance_model',
    optical: 'wave_model',
    alchemical: 'transform_model',
    atmospheric: 'flow_model',
    spectral: 'spectrum_model',
};
export const CULTURE_MEDIUMS = {
    oral: 'voice',
    written: 'document',
    visual: 'image',
    numeric: 'dashboard',
    ritual: 'sequence',
    algorithmic: 'computation',
    tactile: 'surface',
    spatial: 'space',
    gestural: 'gesture',
    sonic: 'sound',
    archival: 'record',
    mythological: 'story',
    performative: 'performance',
    material: 'material',
};
