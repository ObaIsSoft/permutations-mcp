/**
 * Genome — Civilization Sequencer
 *
 * Sequences CivilizationGenome from an EcosystemGenome.
 * This is Layer 3 of the SHA-256 hash chain:
 *   civilizationHash = sha256(ecosystemGenome.hash)
 *
 * Ecological pressures bias civilizational character:
 *   parasitic ecosystem  → extractive/theocratic governance
 *   mutualistic ecosystem → cooperative/democratic governance
 *   predatory energy     → warrior/colonial archetype
 *   climax succession    → mature/federated civilization
 */

import * as crypto from "crypto";
import { EcosystemGenome } from "./ecosystem-types.js";
import {
    CivilizationGenome, CivilizationChromosomes,
    CivilizationArchetype, GovernanceModel, EconomicModel,
    TechnologyClass, CultureEmphasis, ResiliencePattern,
    KnowledgeModel, ExpansionMode, CivilizationAge,
    TopologyShape, CosmologyBelief,
    MemoryModel, InterfaceMode, EvolutionStrategy, CommunicationProtocol,
    ARCHETYPE_UNLOCKS, TECHNOLOGY_PARADIGMS, CULTURE_MEDIUMS,
} from "./civilization-types.js";

// ── Option arrays ───────────────────────────────────────────────────────────

const ARCHETYPES: CivilizationArchetype[] = [
    'theological', 'scientific', 'mercantile', 'maritime',
    'warrior', 'democratic', 'industrial', 'emergent',
    'monastic', 'nomadic', 'revolutionary', 'totemic',
    'byzantine', 'spartan', 'renaissance', 'colonial',
];

const GOVERNANCE_MODELS: GovernanceModel[] = [
    'centralized', 'federated', 'democratic', 'theocratic',
    'oligarchic', 'anarchic', 'militaristic', 'technocratic',
    'tribal', 'nomadic', 'meritocratic', 'consensual',
    'colonial', 'insurgent',
];

const ECONOMIC_MODELS: EconomicModel[] = [
    'command', 'market', 'gift', 'commons',
    'extractive', 'planned', 'barter', 'ritual',
    'creative', 'attention', 'reputation', 'abundance',
];

const TECHNOLOGY_CLASSES: TechnologyClass[] = [
    'biological', 'mechanical', 'digital', 'quantum',
    'neural', 'hybrid', 'crystalline', 'volcanic',
    'tidal', 'acoustic', 'optical', 'alchemical',
    'atmospheric', 'spectral', 'entanglement',
    'gravitational', 'thermodynamic', 'fractal',
    'chaotic', 'stochastic', 'genetic', 'memetic',
    'symbiotic', 'autopoietic',
];

const CULTURE_EMPHASES: CultureEmphasis[] = [
    'oral', 'written', 'visual', 'numeric',
    'ritual', 'algorithmic', 'tactile', 'spatial',
    'gestural', 'sonic', 'archival', 'mythological',
    'performative', 'material', 'code', 'data',
    'symbol', 'network', 'simulation', 'game',
    'meme', 'artifact', 'experience', 'energy',
    'smell', 'taste', 'touch', 'intuition',
];

const RESILIENCE_PATTERNS: ResiliencePattern[] = [
    'redundant', 'antifragile', 'modular', 'distributed',
    'brittle', 'regenerative', 'adaptive', 'sacrificial',
    'camouflage', 'symbiotic', 'dormant',
];

const KNOWLEDGE_MODELS: KnowledgeModel[] = [
    'centralized', 'distributed', 'oral', 'recorded',
    'emergent', 'encrypted', 'palimpsest', 'indexical',
    'mythological', 'tacit', 'archipelagic', 'holographic',
];

const EXPANSION_MODES: ExpansionMode[] = [
    'organic', 'aggressive', 'sustainable', 'contracting',
    'stable', 'viral', 'rhizomatic', 'colonial',
    'missionary', 'symbiotic', 'tectonic', 'crystalline',
];

const CIVILIZATION_AGES: CivilizationAge[] = [
    'nascent', 'developing', 'mature', 'declining',
    'resurgent', 'ancient', 'mythological', 'revolutionary',
    'post_collapse', 'liminal', 'petrified', 'renaissance',
];

const TOPOLOGY_SHAPES: TopologyShape[] = [
    'radial', 'hierarchical', 'rhizomatic', 'fractal',
    'linear', 'archipelagic', 'crystalline', 'chaotic',
    'spiral', 'cellular', 'layered', 'distributed',
];

const COSMOLOGY_BELIEFS: CosmologyBelief[] = [
    'deterministic', 'probabilistic', 'cyclical', 'entropic',
    'generative', 'teleological', 'dialectical', 'phenomenological',
    'emergent', 'mythological', 'mechanistic', 'vitalist',
    'multiversal', 'simulationist', 'hyperstitional', 'accelerationist',
];

const MEMORY_MODELS: MemoryModel[] = [
    'ephemeral', 'session', 'persistent', 'synced',
    'blockchain', 'distributed', 'muscle', 'collective',
    'ancestral', 'external', 'compressed', 'holographic',
];

const INTERFACE_MODES: InterfaceMode[] = [
    'direct', 'indirect', 'gestural', 'vocal',
    'neural', 'haptic', 'ambient', 'tangible',
    'augmented', 'virtual', 'multimodal', 'predictive',
    'adaptive', 'proactive', 'reactive', 'autonomous',
];

const EVOLUTION_STRATEGIES: EvolutionStrategy[] = [
    'gradual', 'punctuated', 'revolutionary', 'convergent',
    'divergent', 'parallel', 'speciated', 'hybridized',
    'engineered', 'emergent', 'market_driven', 'planned',
    'responsive', 'resistant', 'destructive', 'modular',
];

const COMMUNICATION_PROTOCOLS: CommunicationProtocol[] = [
    'synchronous', 'asynchronous', 'streaming', 'batch',
    'event_driven', 'polling', 'push', 'pull',
    'pub_sub', 'peer_to_peer', 'gossip', 'broadcast',
    'multicast', 'unicast', 'mesh', 'quantum',
];

// ── Gravity functions — ecosystem chromosome values bias civilization ────────

function archetypeGravity(eco: EcosystemGenome): number {
    const c = eco.chromosomes;
    // eco_ch12_expressiveness: EXTREME personalities override energy signal —
    // the product's flair IS the civilizational character in these cases.
    // disruptive → revolutionary (10, convention-breaking is the product)
    if (c.eco_ch12_expressiveness.personality === 'disruptive') return 10;
    // expressive → totemic (11, symbolic density, ritual triggers)
    if (c.eco_ch12_expressiveness.personality === 'expressive') return 11;
    // Energy source signals (fires for clinical/corporate/balanced/bold personalities)
    // Predatory energy → warrior (4)
    if (c.eco_ch2_energy.source === 'predatory') return 4;
    // Parasitic → theological (0, doctrine-extractive)
    if (c.eco_ch2_energy.source === 'parasitic') return 0;
    // Photosynthetic → democratic (5)
    if (c.eco_ch2_energy.source === 'photosynthetic') return 5;
    // Decomposer → industrial (6, recycling/transformative)
    if (c.eco_ch2_energy.source === 'decomposer') return 6;
    // Chemosynthetic → scientific (1, internal processes, analytical)
    if (c.eco_ch2_energy.source === 'chemosynthetic') return 1;
    // Mixotrophic → maritime (3, adaptive, context-switching)
    if (c.eco_ch2_energy.source === 'mixotrophic') return 3;
    // High mutation → emergent (7)
    if (c.eco_ch11_mutation.rate > 0.7) return 7;
    // High isolation + pioneer → monastic (8)
    if (c.eco_ch9_spatial.isolation > 0.75 && c.eco_ch5_succession.stage === 'pioneer') return 8;
    // Post-climax + competitive → spartan (13) — distillation under pressure
    if (c.eco_ch5_succession.stage === 'post-climax' && c.eco_ch3_symbiosis.pattern === 'competitive') return 13;
    // bold → warrior (4, decisive, zero ambiguity) — fallback only
    if (c.eco_ch12_expressiveness.personality === 'bold') return 4;
    // clinical → spartan (13, radical subtraction, utility as beauty) — fallback only
    if (c.eco_ch12_expressiveness.personality === 'clinical') return 13;
    return 2; // mercantile default
}

function governanceGravity(eco: EcosystemGenome): number {
    const c = eco.chromosomes;
    // Parasitic symbiosis → theocratic (3)
    if (c.eco_ch3_symbiosis.pattern === 'parasitic') return 3;
    // Mutualistic → federated (1)
    if (c.eco_ch3_symbiosis.pattern === 'mutualistic') return 1;
    // Competitive → oligarchic (4)
    if (c.eco_ch3_symbiosis.pattern === 'competitive') return 4;
    // Neutral/allelopathic → anarchic (5)
    if (c.eco_ch3_symbiosis.pattern === 'neutral' ||
        c.eco_ch3_symbiosis.pattern === 'allelopathic') return 5;
    // Top-down trophic → centralized (0)
    if (c.eco_ch4_trophic.structure === 'top-down') return 0;
    // Web/cascade → federated (1)
    if (c.eco_ch4_trophic.structure === 'web' ||
        c.eco_ch4_trophic.structure === 'cascade') return 1;
    // High mutation → insurgent (13) — no fixed authority
    if (c.eco_ch11_mutation.rate > 0.8) return 13;
    // Pioneer succession → tribal (8, kinship-local, commensal-only remaining)
    if (c.eco_ch5_succession.stage === 'pioneer') return 8;
    return 0; // centralized default
}

function economicsGravity(eco: EcosystemGenome): number {
    const c = eco.chromosomes;
    // Predatory/parasitic → extractive (4)
    if (c.eco_ch2_energy.source === 'predatory' ||
        c.eco_ch2_energy.source === 'parasitic') return 4;
    // Decomposer → planned (5, cyclical batch processing)
    if (c.eco_ch2_energy.source === 'decomposer') return 5;
    // Chemosynthetic → gift (2, self-contained, freely produced)
    if (c.eco_ch2_energy.source === 'chemosynthetic') return 2;
    // Mixotrophic → market (1, adaptive, real-time bidirectional)
    if (c.eco_ch2_energy.source === 'mixotrophic') return 1;
    // Photosynthetic + mutualistic → commons (3)
    if (c.eco_ch2_energy.source === 'photosynthetic' &&
        c.eco_ch3_symbiosis.pattern === 'mutualistic') return 3;
    // Web trophic → market (1, many-to-many exchange)
    if (c.eco_ch4_trophic.structure === 'web') return 1;
    // High cascade (>0.8) + large population → attention (9, engagement-currency)
    if (c.eco_ch4_trophic.cascade > 0.8) return 9;
    // Pioneer succession → creative (8, make-to-share)
    if (c.eco_ch5_succession.stage === 'pioneer') return 8;
    // eco_ch10_capacity: carrying capacity pressure biases economic model
    // maximal + high pressure → attention (9, fighting for space = engagement-currency)
    if (c.eco_ch10_capacity.class === 'maximal' && c.eco_ch10_capacity.pressure > 0.7) return 9;
    // dense + high pressure → extractive (4, aggressive capture under pressure)
    if (c.eco_ch10_capacity.class === 'dense' && c.eco_ch10_capacity.pressure > 0.8) return 4;
    // minimal + low pressure → gift (2, abundance → freely shared)
    if (c.eco_ch10_capacity.class === 'minimal' && c.eco_ch10_capacity.pressure < 0.3) return 2;
    // optimal → market (1, healthy exchange, no scarcity or ceiling pressure)
    if (c.eco_ch10_capacity.class === 'optimal') return 1;
    return 0; // command default
}

function technologyGravity(eco: EcosystemGenome): number {
    const c = eco.chromosomes;
    // High mutation rate → neural (4, learning/adaptive)
    if (c.eco_ch11_mutation.rate > 0.75) return 4;
    // Chemosynthetic → mechanical (1, internal, self-sufficient)
    if (c.eco_ch2_energy.source === 'chemosynthetic') return 1;
    // Fractal population → quantum (3, parallel states)
    if (c.eco_ch7_population.pattern === 'fractal') return 3;
    // Photosynthetic → biological (0, organic, adaptive)
    if (c.eco_ch2_energy.source === 'photosynthetic') return 0;
    // High symbiosis depth → acoustic (9, resonance/feedback)
    if (c.eco_ch3_symbiosis.depth > 0.8) return 9;
    // Predatory + mature → crystalline (6, rigid, precise)
    if (c.eco_ch2_energy.source === 'predatory' &&
        c.eco_ch5_succession.stage === 'climax') return 6;
    // Decomposer → alchemical (11, irreversible transformation)
    if (c.eco_ch2_energy.source === 'decomposer') return 11;
    return 2; // digital default
}

function cultureGravity(eco: EcosystemGenome): number {
    const c = eco.chromosomes;
    // eco_ch12_expressiveness: EXTREME personalities override trophic signal —
    // how the product communicates IS shaped more by flair than by flow structure.
    // disruptive → sonic (9, non-visual, breaks the visual convention of culture)
    if (c.eco_ch12_expressiveness.personality === 'disruptive') return 9;
    // expressive → mythological (11, archetypal narrative, rich story arcs)
    if (c.eco_ch12_expressiveness.personality === 'expressive') return 11;
    // Trophic signals (fire for clinical/corporate/balanced/bold personalities)
    // Top-down trophic → ritual (4, process-driven)
    if (c.eco_ch4_trophic.structure === 'top-down') return 4;
    // High cascade → numeric (3, data-driven measurement)
    if (c.eco_ch4_trophic.cascade > 0.7) return 3;
    // Web trophic → oral (0, passed between components)
    if (c.eco_ch4_trophic.structure === 'web') return 0;
    // Linear → written (1, document-first)
    if (c.eco_ch4_trophic.structure === 'linear') return 1;
    // High adaptation strength → algorithmic (5)
    if (c.eco_ch6_adaptation.strength > 0.8) return 5;
    // Pioneer + isolation → mythological (11, narrative-first)
    if (c.eco_ch5_succession.stage === 'pioneer' &&
        c.eco_ch9_spatial.isolation > 0.65) return 11;
    // High mutation → gestural (8, motion-as-input)
    if (c.eco_ch11_mutation.rate > 0.7) return 8;
    // clinical → algorithmic (5, computed, no fixed content) — fallback only
    if (c.eco_ch12_expressiveness.personality === 'clinical') return 5;
    // corporate → numeric (3, data-first, KPI surfaces) — fallback only
    if (c.eco_ch12_expressiveness.personality === 'corporate') return 3;
    return 2; // visual default
}

function resilienceGravity(eco: EcosystemGenome): number {
    const c = eco.chromosomes;
    // High symbiosis depth → redundant (0, tightly coupled backups)
    if (c.eco_ch3_symbiosis.depth > 0.7) return 0;
    // Web trophic → distributed (3)
    if (c.eco_ch4_trophic.structure === 'web') return 3;
    // Low mutation → brittle (4, stable but fragile)
    if (c.eco_ch11_mutation.rate < 0.2) return 4;
    // Pioneer succession → antifragile (1, grows under pressure)
    if (c.eco_ch5_succession.stage === 'pioneer') return 1;
    // High mutation + mutualistic → regenerative (5, self-healing)
    if (c.eco_ch11_mutation.rate > 0.6 &&
        c.eco_ch3_symbiosis.pattern === 'mutualistic') return 5;
    // Post-climax → adaptive (6, context-switching fallbacks)
    if (c.eco_ch5_succession.stage === 'post-climax') return 6;
    // Parasitic → camouflage (8, hides failure)
    if (c.eco_ch3_symbiosis.pattern === 'parasitic') return 8;
    return 2; // modular default
}

function knowledgeGravity(eco: EcosystemGenome): number {
    const c = eco.chromosomes;
    // Decomposer → recorded (3, event sourcing)
    if (c.eco_ch2_energy.source === 'decomposer') return 3;
    // Web trophic → distributed (1)
    if (c.eco_ch4_trophic.structure === 'web') return 1;
    // High isolation → centralized (0)
    if (c.eco_ch9_spatial.isolation > 0.7) return 0;
    // High mutation → emergent (4, computed at runtime)
    if (c.eco_ch11_mutation.rate > 0.7) return 4;
    // Parasitic + predatory → encrypted (5, gated knowledge)
    if (c.eco_ch2_energy.source === 'parasitic' ||
        c.eco_ch2_energy.source === 'predatory') return 5;
    // Pioneer + isolation → tacit (9, learned via use)
    if (c.eco_ch5_succession.stage === 'pioneer' &&
        c.eco_ch9_spatial.isolation > 0.5) return 9;
    // Climax + mutualistic → holographic (11, fractal consistency)
    if (c.eco_ch5_succession.stage === 'climax' &&
        c.eco_ch3_symbiosis.pattern === 'mutualistic') return 11;
    return 0; // centralized default
}

function expansionGravity(eco: EcosystemGenome): number {
    const c = eco.chromosomes;
    // Pioneer succession → organic (0, grow where needed)
    if (c.eco_ch5_succession.stage === 'pioneer' ||
        c.eco_ch5_succession.stage === 'early') return 0;
    // Predatory energy → aggressive (1)
    if (c.eco_ch2_energy.source === 'predatory') return 1;
    // Post-climax → contracting (3)
    if (c.eco_ch5_succession.stage === 'post-climax') return 3;
    // Climax → stable (4, no new features)
    if (c.eco_ch5_succession.stage === 'climax') return 4;
    // Photosynthetic + mutualistic → symbiotic (9, grows with host)
    if (c.eco_ch2_energy.source === 'photosynthetic' &&
        c.eco_ch3_symbiosis.pattern === 'mutualistic') return 9;
    // High mutation → viral (5, exponential spread)
    if (c.eco_ch11_mutation.rate > 0.75) return 5;
    // Web trophic → rhizomatic (6, lateral expansion)
    if (c.eco_ch4_trophic.structure === 'web') return 6;
    // eco_ch10_capacity: capacity pressure biases expansion mode
    // maximal + very high pressure → contracting (3, already at ceiling — must shrink)
    if (c.eco_ch10_capacity.class === 'maximal' && c.eco_ch10_capacity.pressure > 0.85) return 3;
    // dense + high pressure → stable (4, no room to grow without conflict)
    if (c.eco_ch10_capacity.class === 'dense' && c.eco_ch10_capacity.pressure > 0.7) return 4;
    // minimal + low pressure → organic (0, open territory, grow where needed)
    if (c.eco_ch10_capacity.class === 'minimal' && c.eco_ch10_capacity.pressure < 0.4) return 0;
    return 2; // sustainable default
}

function ageGravity(eco: EcosystemGenome): number {
    const c = eco.chromosomes;
    const stage = c.eco_ch5_succession.stage;
    const mutationRate = c.eco_ch11_mutation.rate;
    
    // Mutation-driven exceptions first (can override base stage)
    // Very low mutation + climax/post-climax → petrified (10, frozen)
    if (mutationRate < 0.15 && (stage === 'climax' || stage === 'post-climax')) return 10;
    // High mutation + pioneer/early → revolutionary (7, in upheaval)
    if (mutationRate > 0.8 && (stage === 'pioneer' || stage === 'early')) return 7;
    
    // Base stage mapping
    switch (stage) {
        case 'pioneer':     return 0; // nascent
        case 'early':       return 1; // developing
        case 'mid':         return 1; // developing/mature
        case 'climax':      return 2; // mature
        case 'post-climax': return 3; // declining
        case 'disturbed':   return 4; // resurgent
        case 'degraded':    return 5; // dark age
        case 'renascent':   return 6; // revolutionary
        case 'stable':      return 2; // mature (stable equilibrium)
        case 'cyclic':      return 1; // developing (cyclical renewal)
        case 'chaotic':     return 7; // upheaval
        case 'frozen':      return 10; // petrified
        default:            return 2; // mature default
    }
    // eco_ch8_temporal: rhythm signals civilizational time-sense
    // continuous → mature (2, no downtime = established, always-on)
    if (c.eco_ch8_temporal.rhythm === 'continuous') return 2;
    // seasonal → developing (1, cyclical growth = active construction phase)
    if (c.eco_ch8_temporal.rhythm === 'seasonal') return 1;
    // nocturnal → liminal (9, active in the dark = identity uncertain)
    if (c.eco_ch8_temporal.rhythm === 'nocturnal') return 9;
    // tidal → resurgent (4, rhythmic ebb/flow = rebuilding in cycles)
    if (c.eco_ch8_temporal.rhythm === 'tidal') return 4;
    return 2; // mature default
}

function topologyGravity(eco: EcosystemGenome): number {
    const c = eco.chromosomes;
    // Top-down trophic → hierarchical (1)
    if (c.eco_ch4_trophic.structure === 'top-down') return 1;
    // Web trophic → rhizomatic (2, no centre)
    if (c.eco_ch4_trophic.structure === 'web') return 2;
    // Linear → linear (4)
    if (c.eco_ch4_trophic.structure === 'linear') return 4;
    // Cascade → layered (10, horizontal strata)
    if (c.eco_ch4_trophic.structure === 'cascade') return 10;
    // Fractal population → fractal (3)
    if (c.eco_ch7_population.pattern === 'fractal') return 3;
    // High isolation → archipelagic (5, island clusters)
    if (c.eco_ch9_spatial.isolation > 0.7) return 5;
    // High symbiosis depth + mutualistic → cellular (9, adjacent cells)
    if (c.eco_ch3_symbiosis.depth > 0.7 &&
        c.eco_ch3_symbiosis.pattern === 'mutualistic') return 9;
    // Pioneer → radial (0, hub-and-spoke, simple centre)
    if (c.eco_ch5_succession.stage === 'pioneer') return 0;
    // eco_ch1_biome: physical environment character maps to structural topology
    // volcanic → chaotic (7, burst structure, no predictable geometry)
    if (c.eco_ch1_biome.class === 'volcanic') return 7;
    // cave → fractal (3, nested depth, self-similar at every scale)
    if (c.eco_ch1_biome.class === 'cave') return 3;
    // abyssal → layered (10, depth as metaphor, horizontal strata)
    if (c.eco_ch1_biome.class === 'abyssal') return 10;
    // reef → cellular (9, adjacent cells, dense symbiotic colony)
    if (c.eco_ch1_biome.class === 'reef') return 9;
    // boreal → hierarchical (1, regular tree-like repeating structure)
    if (c.eco_ch1_biome.class === 'boreal') return 1;
    // tidal → spiral (8, expanding from origin, oscillating depth)
    if (c.eco_ch1_biome.class === 'tidal') return 8;
    // arctic → linear (4, strict pipeline, minimal branching)
    if (c.eco_ch1_biome.class === 'arctic') return 4;
    // urban → crystalline (6, ordered grid, predictable adjacency)
    if (c.eco_ch1_biome.class === 'urban') return 6;
    // mangrove → archipelagic (5, boundary-dwelling, bridge clusters)
    if (c.eco_ch1_biome.class === 'mangrove') return 5;
    // steppe → distributed (11, open range, no privileged topology)
    if (c.eco_ch1_biome.class === 'steppe') return 11;
    return 0; // radial default
}

function cosmologyGravity(eco: EcosystemGenome): number {
    const c = eco.chromosomes;
    // Decomposer → cyclical (2, recycling/periodic)
    if (c.eco_ch2_energy.source === 'decomposer') return 2;
    // High mutation → emergent (8, bottom-up complexity)
    if (c.eco_ch11_mutation.rate > 0.7) return 8;
    // Low mutation + climax → deterministic (0, predictable/auditable)
    if (c.eco_ch11_mutation.rate < 0.2 &&
        c.eco_ch5_succession.stage === 'climax') return 0;
    // Predatory + web → dialectical (6, tension drives progress)
    if (c.eco_ch2_energy.source === 'predatory' &&
        c.eco_ch4_trophic.structure === 'web') return 6;
    // Pioneer + isolation → mythological (9, narrative causation)
    if (c.eco_ch5_succession.stage === 'pioneer' &&
        c.eco_ch9_spatial.isolation > 0.6) return 9;
    // Photosynthetic + pioneer → generative (4, always making)
    if (c.eco_ch2_energy.source === 'photosynthetic' &&
        c.eco_ch5_succession.stage === 'pioneer') return 4;
    // Post-climax → entropic (3, moving toward disorder)
    if (c.eco_ch5_succession.stage === 'post-climax') return 3;
    // Chemosynthetic → mechanistic (10, cause-effect chains)
    if (c.eco_ch2_energy.source === 'chemosynthetic') return 10;
    // eco_ch8_temporal: time rhythm encodes the product's causal worldview
    // continuous → generative (4, always making, no rest between creations)
    if (c.eco_ch8_temporal.rhythm === 'continuous') return 4;
    // tidal → cyclical (2, in/out flows = repeating pattern belief)
    if (c.eco_ch8_temporal.rhythm === 'tidal') return 2;
    // seasonal → teleological (5, everything moves toward seasonal end-state)
    if (c.eco_ch8_temporal.rhythm === 'seasonal') return 5;
    // nocturnal → phenomenological (7, experience-first, darkness as perception)
    if (c.eco_ch8_temporal.rhythm === 'nocturnal') return 7;
    // eco_ch1_biome: physical character encodes cosmological flavour
    // volcanic → vitalist (11, life-force/pressure as world-model)
    if (c.eco_ch1_biome.class === 'volcanic') return 11;
    // cave → mythological (9, enclosed → narrative causation, legend-driven)
    if (c.eco_ch1_biome.class === 'cave') return 9;
    // arctic → deterministic (0, cold + sparse = fixed, auditable outcomes)
    if (c.eco_ch1_biome.class === 'arctic') return 0;
    // reef → emergent (8, dense symbiosis = complex from simple rules)
    if (c.eco_ch1_biome.class === 'reef') return 8;
    // abyssal → entropic (3, pressure + darkness = moving toward disorder)
    if (c.eco_ch1_biome.class === 'abyssal') return 3;
    return 1; // probabilistic default
}

// ── Biased selection ────────────────────────────────────────────────────────

/**
 * Deterministic selection — gravity is the preferred TARGET INDEX.
 * 75% of the time: use the gravity target directly (ecological coherence).
 * 25% of the time: use hash byte for diversity (adjacent option).
 * Same seed → same output always. No probability distributions.
 */
function deterministicPick<T>(options: T[], rawByte: number, gravity: number): T {
    const len = options.length;
    const target = ((Math.round(gravity) % len) + len) % len;

    if (rawByte < 192) {
        // 75%: gravity target — ecologically coherent
        return options[target];
    } else {
        // 25%: hash-driven diversity — pick adjacent option
        const adjacent = ((target + (rawByte % 3) - 1) % len + len) % len;
        return options[adjacent];
    }
}

function norm(byte: number): number {
    return byte / 255;
}

// ── Main sequencer ──────────────────────────────────────────────────────────

export function sequenceCivilizationGenome(
    ecosystemGenome: EcosystemGenome,
): CivilizationGenome {
    const hash = crypto.createHash("sha256").update(ecosystemGenome.hash).digest("hex");
    const b = Buffer.from(hash, "hex");
    const eco = ecosystemGenome;

    // Sequence class values first so derived sub-fields can reference them
    const archetypeClass     = deterministicPick(ARCHETYPES,         b[0],  archetypeGravity(eco));
    const technologyClass    = deterministicPick(TECHNOLOGY_CLASSES, b[6],  technologyGravity(eco));
    const cultureEmphasis    = deterministicPick(CULTURE_EMPHASES,   b[8],  cultureGravity(eco));

    const chromosomes: CivilizationChromosomes = {
        // bytes[0,1] — archetype
        civ_ch1_archetype: {
            class:     archetypeClass,
            intensity: norm(b[1]),
            unlocks:   ARCHETYPE_UNLOCKS[archetypeClass],
        },
        // bytes[2,3] — governance
        civ_ch2_governance: {
            model:    deterministicPick(GOVERNANCE_MODELS, b[2], governanceGravity(eco)),
            rigidity: norm(b[3]),
        },
        // bytes[4,5] — economics
        civ_ch3_economics: {
            model:    deterministicPick(ECONOMIC_MODELS, b[4], economicsGravity(eco)),
            pressure: norm(b[5]),
        },
        // bytes[6,7] — technology
        civ_ch4_technology: {
            class:    technologyClass,
            maturity: norm(b[7]),
            paradigm: TECHNOLOGY_PARADIGMS[technologyClass],
        },
        // bytes[8,9] — culture
        civ_ch5_culture: {
            emphasis: cultureEmphasis,
            cohesion: norm(b[9]),
            medium:   CULTURE_MEDIUMS[cultureEmphasis],
        },
        // bytes[10,11] — resilience
        civ_ch6_resilience: {
            pattern: deterministicPick(RESILIENCE_PATTERNS, b[10], resilienceGravity(eco)),
            depth:   norm(b[11]),
        },
        // bytes[12,13] — knowledge
        civ_ch7_knowledge: {
            model:   deterministicPick(KNOWLEDGE_MODELS, b[12], knowledgeGravity(eco)),
            entropy: norm(b[13]),
        },
        // bytes[14,15] — expansion
        civ_ch8_expansion: {
            mode:     deterministicPick(EXPANSION_MODES, b[14], expansionGravity(eco)),
            velocity: norm(b[15]),
        },
        // bytes[16,17] — age
        civ_ch9_age: {
            class:     deterministicPick(CIVILIZATION_AGES, b[16], ageGravity(eco)),
            stability: norm(b[17]),
        },
        // bytes[18,19] — fragility
        civ_ch10_fragility: {
            rate:     norm(b[18]),
            variance: norm(b[19]),
        },
        // bytes[20,21] — topology
        civ_ch11_topology: {
            shape:   deterministicPick(TOPOLOGY_SHAPES, b[20], topologyGravity(eco)),
            density: norm(b[21]),
        },
        // bytes[22,23] — cosmology
        civ_ch12_cosmology: {
            belief:     deterministicPick(COSMOLOGY_BELIEFS, b[22], cosmologyGravity(eco)),
            conviction: norm(b[23]),
        },
        // bytes[24,25] — memory
        civ_ch13_memory: {
            model:       deterministicPick(MEMORY_MODELS, b[24], 0),
            persistence: norm(b[25]),
        },
        // bytes[26,27] — interface
        civ_ch14_interface: {
            mode:          deterministicPick(INTERFACE_MODES, b[26], 0),
            responsiveness: norm(b[27]),
        },
        // bytes[28,29] — evolution
        civ_ch15_evolution: {
            strategy: deterministicPick(EVOLUTION_STRATEGIES, b[28], 0),
            rate:     norm(b[29]),
        },
        // bytes[30,31] — communication
        civ_ch16_communication: {
            protocol:  deterministicPick(COMMUNICATION_PROTOCOLS, b[30], 0),
            bandwidth: norm(b[31]),
        },
    };

    return { hash, parentHash: ecosystemGenome.hash, chromosomes };
}
