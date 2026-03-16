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

// ── Derived sub-field types ─────────────────────────────────────────────────

/**
 * What the civilization unlocks for its inhabitants.
 * Derived from CivilizationArchetype class.
 * Tells agents what kind of interaction contract the product implicitly offers.
 */
export type CivilizationUnlock =
    | 'ceremony'        // theological: step-by-step ritual flows, sacred proportions
    | 'measurement'     // scientific: annotation, instrumentation, feedback loops
    | 'conversion'      // mercantile: funnel-first, every screen accountable to a goal
    | 'navigation'      // maritime: routing IS the product, wayfinding over content
    | 'command'         // warrior: decisive CTA, zero ambiguity, no softening
    | 'consensus'       // democratic: equal-weight inputs, accessibility as first-class
    | 'production'      // industrial: throughput, modular stamping, blueprint aesthetic
    | 'emergence'       // emergent: self-organising, no fixed shape, generative surfaces
    | 'contemplation'   // monastic: whitespace, slowness, depth over breadth
    | 'migration'       // nomadic: lightweight, portable, no permanent home
    | 'disruption'      // revolutionary: breaks conventions intentionally, provocation
    | 'invocation'      // totemic: symbolic density, icons over text, ritual triggers
    | 'negotiation'     // byzantine: layered access, indirect paths, bureaucratic grace
    | 'discipline'      // spartan: radical subtraction, utility as beauty
    | 'synthesis'       // renaissance: cross-domain borrowing, polymathic surfaces
    | 'extraction';     // colonial: aggressive capture, asymmetric value flows

/**
 * The technological paradigm — how the product reasons about its own processes.
 * Derived from TechnologyClass class.
 */
export type TechnologyParadigm =
    | 'growth_model'    // biological: adaptive, organism-like self-correction
    | 'precision_model' // mechanical: step-driven, deterministic, audit trails
    | 'event_model'     // digital: async, reactive, event streams first
    | 'superposition'   // quantum: parallel states, branch-resolve, probabilistic UI
    | 'inference_model' // neural: pattern-recognition, learned behaviour, adaptive UI
    | 'composite_model' // hybrid: multi-paradigm, pragmatic combination
    | 'lattice_model'   // crystalline: rigid structure, predictable geometry
    | 'pressure_model'  // volcanic: sudden release, burst patterns, high-energy events
    | 'rhythm_model'    // tidal: periodic cycles, in/out flows, predictable oscillation
    | 'resonance_model' // acoustic: signal propagation, feedback, harmonic patterns
    | 'wave_model'      // optical: light-speed transmission, line-of-sight dependencies
    | 'transform_model' // alchemical: irreversible state change, transmutation flows
    | 'flow_model'      // atmospheric: pressure differentials, ambient distribution
    | 'spectrum_model'; // spectral: frequency-band thinking, filtered layers

/**
 * The primary medium through which the civilization records and transmits.
 * Derived from CultureEmphasis class.
 */
export type CultureMedium =
    | 'voice'           // oral: narrative, conversational UI, progressive disclosure
    | 'document'        // written: long-form, annotation-heavy, searchable archives
    | 'image'           // visual: show-don't-tell, spatial layout as meaning
    | 'dashboard'       // numeric: data-first, KPI surfaces, measurement UI
    | 'sequence'        // ritual: step-by-step, wizard flows, ceremony
    | 'computation'     // algorithmic: generated surfaces, no fixed content
    | 'surface'         // tactile: physical metaphor, haptic-aware, touch-native
    | 'space'           // spatial: 3D thinking, depth, placement-as-meaning
    | 'gesture'         // gestural: motion-as-input, trajectory, direction
    | 'sound'           // sonic: audio-first, non-visual transmission
    | 'record'          // archival: preservation, provenance, time-stamped truth
    | 'story'           // mythological: archetypal narrative, hero flows
    | 'performance'     // performative: live, ephemeral, time-bound
    | 'material';       // material: weight, texture, physicality as metaphor

// ── Chromosome value types ─────────────────────────────────────────────────

/** The civilizational character — drives design philosophy + chromosome mutations */
export type CivilizationArchetype =
    | 'theological'   // doctrine-driven, ceremonial, sacred proportions
    | 'scientific'    // measurement-first, observable, annotation-rich
    | 'mercantile'    // transaction-optimised, conversion-ruthless
    | 'maritime'      // navigational, routing-primary, flow-visible
    | 'warrior'       // decisive, bold, zero-ambiguity command
    | 'democratic'    // equal-weight, accessible, no VIP treatment
    | 'industrial'    // modular, mass-produced, blueprint aesthetic
    | 'emergent'      // generative, self-organising, no fixed shape
    | 'monastic'      // contemplative, whitespace-rich, depth over speed
    | 'nomadic'       // portable, lightweight, no permanent state
    | 'revolutionary' // convention-breaking, provocative, anti-pattern
    | 'totemic'       // symbolic density, icon-over-text, ritual triggers
    | 'byzantine'     // layered access, indirect paths, bureaucratic grace
    | 'spartan'       // radical subtraction, utility as beauty
    | 'renaissance'   // cross-domain synthesis, polymathic surfaces
    | 'colonial';     // aggressive capture, asymmetric value extraction

/** How authority and decision-making are structured */
export type GovernanceModel =
    | 'centralized'   // single authority — simple state, one source of truth
    | 'federated'     // regional autonomy — module federation, zone independence
    | 'democratic'    // distributed authority — flat hierarchy, consensus
    | 'theocratic'    // doctrine authority — immutable truth, downward flow
    | 'oligarchic'    // small council — shared context, restricted routes
    | 'anarchic'      // no authority — each component self-governs
    | 'militaristic'  // command chain — strict routing, audit logs
    | 'technocratic'  // expertise authority — algorithm-driven decisions
    | 'tribal'        // kinship groups — context-local, no global state
    | 'nomadic'       // no fixed authority — floating coordination
    | 'meritocratic'  // earned authority — contribution-weighted voice
    | 'consensual'    // unanimous agreement — blocking UI on conflict
    | 'colonial'      // imposed authority — asymmetric data ownership
    | 'insurgent';    // counter-authority — anti-pattern by design

/** How value is produced and distributed in the system */
export type EconomicModel =
    | 'command'       // central allocation — top-down data distribution
    | 'market'        // exchange-driven — real-time data, bidirectional
    | 'gift'          // freely shared — open APIs, no gatekeeping
    | 'commons'       // shared resource — pooled state, collaborative
    | 'extractive'    // resource capture — aggressive data collection
    | 'planned'       // scheduled cycles — batch processing, periodic sync
    | 'barter'        // direct exchange — peer-to-peer, no intermediary
    | 'ritual'        // ceremony-locked — gated by completion of flows
    | 'creative'      // production-driven — make-to-share, creator economy
    | 'attention'     // engagement-currency — time-on-surface as value
    | 'reputation'    // trust-weighted — social proof as transaction
    | 'abundance';    // post-scarcity — unlimited access, zero gatekeeping

/** Technology generation and approach */
export type TechnologyClass =
    | 'biological'    // organic, adaptive, growth-based patterns
    | 'mechanical'    // engineered, precise, step-driven
    | 'digital'       // network-native, async, event-driven
    | 'quantum'       // superposition, parallel states, branching
    | 'neural'        // learning, adaptive, pattern-recognition
    | 'hybrid'        // composite, multi-paradigm
    | 'crystalline'   // rigid structure, geometric precision, lattice order
    | 'volcanic'      // burst energy, sudden release, high-intensity events
    | 'tidal'         // rhythmic cycles, predictable oscillation, in/out flows
    | 'acoustic'      // signal propagation, resonance, harmonic feedback
    | 'optical'       // light-speed, line-of-sight, projection-based
    | 'alchemical'    // irreversible transformation, transmutation
    | 'atmospheric'   // ambient distribution, pressure differentials
    | 'spectral';     // frequency-filtered, layered band thinking

/** Primary cultural emphasis — how the civilization records and transmits */
export type CultureEmphasis =
    | 'oral'          // narrative, story-driven, conversational UI
    | 'written'       // document-first, long-form, annotation-heavy
    | 'visual'        // image-primary, show-don't-tell
    | 'numeric'       // data-first, measurement, dashboard-heavy
    | 'ritual'        // ceremony, process, step-by-step flows
    | 'algorithmic'   // computed, emergent, no fixed content
    | 'tactile'       // physical metaphor, touch-native, weight/texture
    | 'spatial'       // 3D thinking, depth, placement-as-meaning
    | 'gestural'      // motion-as-input, trajectory, swipe-native
    | 'sonic'         // audio-first, non-visual transmission
    | 'archival'      // preservation, provenance, time-stamped truth
    | 'mythological'  // archetypal narrative, hero journey, story arcs
    | 'performative'  // live, ephemeral, time-bound experience
    | 'material';     // weight, texture, physicality as UI metaphor

/** How the civilization survives disruption */
export type ResiliencePattern =
    | 'redundant'     // multiple fallbacks — deep error boundary trees
    | 'antifragile'   // grows stronger under stress — adaptive error handling
    | 'modular'       // isolated failures — component-level error boundaries
    | 'distributed'   // no single point of failure — graceful degradation
    | 'brittle'       // fragile but fast — minimal error handling
    | 'regenerative'  // self-healing — auto-recovery, retry-first patterns
    | 'adaptive'      // context-switching — environment-responsive fallbacks
    | 'sacrificial'   // planned failure — fallback replaces, not recovers
    | 'camouflage'    // hides failure — silent error swallowing, graceful masks
    | 'symbiotic'     // failure-sharing — cross-component error propagation
    | 'dormant';      // pause-not-fail — suspend state, retry on resume

/** How knowledge is stored and accessed */
export type KnowledgeModel =
    | 'centralized'   // single library — one router, one data source
    | 'distributed'   // many nodes — federated routing, many data sources
    | 'oral'          // passed between components — prop drilling, callbacks
    | 'recorded'      // persistent log — event sourcing, history
    | 'emergent'      // derived at runtime — computed state, no raw storage
    | 'encrypted'     // gated knowledge — access-controlled, permissioned
    | 'palimpsest'    // layered over old — versioned, never-delete, overwrite
    | 'indexical'     // pointer-based — references over copies, ID-first
    | 'mythological'  // narrative truth — canonical stories, not raw data
    | 'tacit'         // embodied knowledge — learned via use, not docs
    | 'archipelagic'  // island clusters — local-first, periodic sync
    | 'holographic';  // whole in every part — replicated, fractal consistency

/** How the civilization grows and expands */
export type ExpansionMode =
    | 'organic'       // grows where needed — lazy loading, on-demand
    | 'aggressive'    // captures territory — eager loading, prefetch
    | 'sustainable'   // controlled growth — code-split, budget-aware
    | 'contracting'   // shrinking — remove, simplify, reduce
    | 'stable'        // no growth — fixed scope, no new features
    | 'viral'         // exponential spread — sharing mechanics, referral loops
    | 'rhizomatic'    // lateral expansion — horizontal growth, no root
    | 'colonial'      // occupation — consumes existing surfaces
    | 'missionary'    // conversion-first — onboarding as primary product
    | 'symbiotic'     // grows with host — embedded, parasitic-positive
    | 'tectonic'      // sudden displacement — big-bang releases, batch migrations
    | 'crystalline';  // structured growth — schema-first, geometry-constrained

/** Civilizational age — how mature and established the system is */
export type CivilizationAge =
    | 'nascent'         // just forming — rough edges, rapid change
    | 'developing'      // growing — active construction, frequent updates
    | 'mature'          // established — stable, well-tested
    | 'declining'       // degrading — tech debt, legacy patterns
    | 'resurgent'       // rebuilding — refactor, modernisation
    | 'ancient'         // pre-modern — stripped back, foundational only
    | 'mythological'    // legendary status — beyond measurable history
    | 'revolutionary'   // in active upheaval — nothing stable yet
    | 'post_collapse'   // after failure — skeleton crew, survival mode
    | 'liminal'         // in-between — transitional, identity uncertain
    | 'petrified'       // frozen — change prohibited, preserve at all costs
    | 'renaissance';    // flourishing after dark age — creative explosion

/**
 * The structural topology of the application — how regions relate spatially.
 * civ_ch11: bytes[20,21]
 */
export type TopologyShape =
    | 'radial'          // hub-and-spoke — central authority, radiating routes
    | 'hierarchical'    // tree structure — parent owns children, top-down
    | 'rhizomatic'      // no centre — lateral connections, any-to-any
    | 'fractal'         // self-similar at every scale — recursive nesting
    | 'linear'          // sequential — pipeline, one-way flow
    | 'archipelagic'    // islands with bridges — clusters, periodic connection
    | 'crystalline'     // geometric lattice — ordered grid, predictable adjacency
    | 'chaotic'         // no discernible structure — emergent adjacency
    | 'spiral'          // expanding from origin — progressive depth
    | 'cellular'        // adjacent cells — membrane boundaries, local exchange
    | 'layered'         // horizontal strata — depth as metaphor
    | 'distributed';    // fully decentralised — no privileged topology

/**
 * The civilizational cosmology — the product's philosophy of causation and time.
 * civ_ch12: bytes[22,23]
 */
export type CosmologyBelief =
    | 'deterministic'     // fixed outcomes — predictable, auditable, no surprise
    | 'probabilistic'     // stochastic — confidence intervals, uncertainty surfaced
    | 'cyclical'          // repeating patterns — seasons, periodic UI gestures
    | 'entropic'          // moving toward disorder — intentional degradation arcs
    | 'generative'        // creation-first — always making, never preserving
    | 'teleological'      // goal-directed — everything toward an end state
    | 'dialectical'       // thesis/antithesis — tension drives progress
    | 'phenomenological'  // experience-first — perception over measurement
    | 'emergent'          // bottom-up causation — complex from simple rules
    | 'mythological'      // narrative causation — story explains everything
    | 'mechanistic'       // cause-effect chains — Newtonian, no mystery
    | 'vitalist';         // life-force driven — organic will, not just mechanics

// ── Chromosome structure ────────────────────────────────────────────────────

export interface CivilizationChromosomes {
    /** bytes[0,1] — archetype class + intensity (0–1) */
    civ_ch1_archetype:  {
        class:     CivilizationArchetype;
        intensity: number;
        /** Derived: what kind of interaction contract this archetype unlocks */
        unlocks:   CivilizationUnlock;
    };
    /** bytes[2,3] — governance model + rigidity (0–1, high = inflexible) */
    civ_ch2_governance: {
        model:    GovernanceModel;
        rigidity: number;
    };
    /** bytes[4,5] — economic model + pressure (0–1, high = aggressive) */
    civ_ch3_economics:  {
        model:    EconomicModel;
        pressure: number;
    };
    /** bytes[6,7] — technology class + maturity (0–1) */
    civ_ch4_technology: {
        class:    TechnologyClass;
        maturity: number;
        /** Derived: how the product reasons about its own processes */
        paradigm: TechnologyParadigm;
    };
    /** bytes[8,9] — culture emphasis + cohesion (0–1) */
    civ_ch5_culture:    {
        emphasis: CultureEmphasis;
        cohesion: number;
        /** Derived: the primary transmission medium this culture uses */
        medium:   CultureMedium;
    };
    /** bytes[10,11] — resilience pattern + depth (0–1) */
    civ_ch6_resilience: {
        pattern: ResiliencePattern;
        depth:   number;
    };
    /** bytes[12,13] — knowledge model + entropy (0–1, high = chaotic) */
    civ_ch7_knowledge:  {
        model:   KnowledgeModel;
        entropy: number;
    };
    /** bytes[14,15] — expansion mode + velocity (0–1) */
    civ_ch8_expansion:  {
        mode:     ExpansionMode;
        velocity: number;
    };
    /** bytes[16,17] — age class + stability (0–1) */
    civ_ch9_age:        {
        class:     CivilizationAge;
        stability: number;
    };
    /** bytes[18,19] — fragility rate (0–1) + variance (0–1) */
    civ_ch10_fragility: {
        rate:     number;
        variance: number;
    };
    /** bytes[20,21] — structural topology + density (0–1) */
    civ_ch11_topology:  {
        shape:   TopologyShape;
        density: number;
    };
    /** bytes[22,23] — cosmological belief + conviction (0–1, high = doctrinaire) */
    civ_ch12_cosmology: {
        belief:     CosmologyBelief;
        conviction: number;
    };
}

// ── Derived sub-field lookup maps ───────────────────────────────────────────
// These are intentionally exported so agents can read them in design briefs.

export const ARCHETYPE_UNLOCKS: Record<CivilizationArchetype, CivilizationUnlock> = {
    theological:   'ceremony',
    scientific:    'measurement',
    mercantile:    'conversion',
    maritime:      'navigation',
    warrior:       'command',
    democratic:    'consensus',
    industrial:    'production',
    emergent:      'emergence',
    monastic:      'contemplation',
    nomadic:       'migration',
    revolutionary: 'disruption',
    totemic:       'invocation',
    byzantine:     'negotiation',
    spartan:       'discipline',
    renaissance:   'synthesis',
    colonial:      'extraction',
};

export const TECHNOLOGY_PARADIGMS: Record<TechnologyClass, TechnologyParadigm> = {
    biological:  'growth_model',
    mechanical:  'precision_model',
    digital:     'event_model',
    quantum:     'superposition',
    neural:      'inference_model',
    hybrid:      'composite_model',
    crystalline: 'lattice_model',
    volcanic:    'pressure_model',
    tidal:       'rhythm_model',
    acoustic:    'resonance_model',
    optical:     'wave_model',
    alchemical:  'transform_model',
    atmospheric: 'flow_model',
    spectral:    'spectrum_model',
};

export const CULTURE_MEDIUMS: Record<CultureEmphasis, CultureMedium> = {
    oral:          'voice',
    written:       'document',
    visual:        'image',
    numeric:       'dashboard',
    ritual:        'sequence',
    algorithmic:   'computation',
    tactile:       'surface',
    spatial:       'space',
    gestural:      'gesture',
    sonic:         'sound',
    archival:      'record',
    mythological:  'story',
    performative:  'performance',
    material:      'material',
};

// ── Genome ──────────────────────────────────────────────────────────────────

export interface CivilizationGenome {
    /** sha256(ecosystemGenome.hash) — Layer 3 hash */
    hash: string;
    /** The ecosystemHash this was derived from — maintains chain provenance */
    parentHash: string;
    chromosomes: CivilizationChromosomes;
}
