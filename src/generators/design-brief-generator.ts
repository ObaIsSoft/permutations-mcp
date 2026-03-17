/**
 * Design Brief Generator — LLM-driven cross-layer philosophy synthesizer.
 *
 * Reads all three genome layers (L1 + optional L2 + optional L3) and asks
 * the LLM to synthesize a design philosophy from the full chromosome combination.
 *
 * Output is a creative THESIS — what organism is this design — not a token list.
 * Token application instructions are secondary to the philosophy.
 */

import type { DesignGenome } from "../genome/types.js";
import type { EcosystemGenome } from "../genome/ecosystem-types.js";
import type { CivilizationGenome } from "../genome/civilization-types.js";

// ═══════════════════════════════════════════════════════════════════════════════
// L2 ECOSYSTEM GLOSSARY — What each value means for design
// ═══════════════════════════════════════════════════════════════════════════════

const ECOSYSTEM_GLOSSARY = {
    // Biome Classes (32) — The environmental character
    biome: {
        volcanic:     'Harsh, mineral surfaces. High contrast, aggressive transitions, raw energy. Design feels intense and unrefined.',
        abyssal:      'Deep, pressured, dark. Minimal light, bioluminescent accents. Mystery and depth.',
        arctic:      'Cold-efficient, sparse, high negative space. Clean, crystalline, survival-focused.',
        rainforest:  'Dense, layered, rich feature count. Abundant, overlapping, lush complexity.',
        desert:      'Minimal, vast spacing, heat-shimmer effects. Scarcity-adapted, essential only.',
        tidal:       'Rhythmic, responsive, oscillating patterns. Ebb and flow, periodic change.',
        alpine:      'Precise, high-altitude, clean edges. Thin atmosphere, clarity at extremes.',
        cave:        'Enclosed, layered depth, bioluminescent. Hidden chambers, discovery-focused.',
        hydrothermal: 'Reactive, warm-to-cool gradients, high energy. Thermal vents, mineral-rich.',
        steppe:      'Flat, wide, open-range scalability. Horizon-focused, breathing room.',
        wetland:     'Composite, layered, hybrid patterns. Transitional zones, filtering.',
        reef:        'High diversity, color-dense, shallow depth. Collaborative colonies, vibrant.',
        boreal:      'Structured, repeating, tree-like hierarchy. Coniferous, evergreen patterns.',
        savanna:     'Open, spread, wide information landscapes. Grassland visibility, scattered trees.',
        mangrove:    'Tangled roots, multi-level nesting. Boundary-dwelling, protective.',
        urban:       'Grid-dense, modular, rectilinear. City blocks, infrastructure, density.',
        jungle:      'Chaotic, overgrown, dense interconnections. Vine-like navigation, wild growth.',
        tundra:      'Frozen, static, endurance-focused. Permafrost, minimal change, survival.',
        prairie:     'Vast, horizon-focused, breathing room. Grassland openness, wind-swept.',
        marsh:       'Murky, transitional, boundary-blurring. Slow movement, sediment-rich.',
        coral:       'Fragile, interconnected, symbiotic. Colony organisms, calcium structures.',
        kelp_forest: 'Vertical, swaying, layered depth. Underwater towers, light filtering.',
        polar:       'Extreme, minimal, survival-focused. Ice-adapted, stark contrast.',
        temperate:   'Balanced, seasonal, moderate cycles. Four-season thinking, equilibrium.',
        monsoon:     'Intense bursts, rapid change, high throughput. Seasonal flooding, abundance.',
        dune:        'Shifting, wind-sculpted, impermanent. Sand landscapes, erosion patterns.',
        oasis:       'Concentrated resources in sparse context. Water in desert, life pockets.',
        crater:      'Enclosed, focused, impact-origin. Bowl-shaped, contained energy.',
        fjord:       'Narrow, deep, dramatic contrast. Glacial valleys, steep walls.',
        atoll:       'Circular, protective, lagoon-centered. Ring structures, central calm.',
        trench:      'Deepest, pressurized, hidden. Abyssal plains, extreme depth.',
        astrobleme:  'Ancient impact, scarred, resilient. Crater geology, recovery patterns.',
    },
    // Energy Sources (16) — What drives the system
    energy: {
        photosynthetic: 'Open, generative, abundance-oriented. Light-capturing, growth-focused.',
        chemosynthetic: 'Self-sufficient, internal, hidden processes. Deep-energy, independent.',
        predatory:      'Extractive, aggressive, acquisition-driven. Hunt-focused, competitive.',
        decomposer:     'Recycling, transformative, cyclical. Breaking down, nutrient cycling.',
        parasitic:      'Dependent, attached, host-reliant. Resource-draining, attached.',
        mixotrophic:    'Adaptive, context-switching, hybrid. Flexible energy strategy.',
        thermal:        'Heat-driven, gradient-powered. Temperature differences, volcanic.',
        kinetic:        'Motion-driven, event-powered. Movement, momentum, activity.',
        electric:       'Spark-driven, high-voltage bursts. Quick, shocking, energetic.',
        magnetic:       'Field-aligned, pull-oriented. Attraction, alignment, polarization.',
        gravitational:  'Weight-driven, potential energy. Mass attraction, heavy influence.',
        nuclear:        'Intense, high-output, chain-reactive. Fission/fusion, power density.',
        quantum:        'Probabilistic, uncertainty-based. Superposition, entanglement effects.',
        sonic:          'Vibration-driven, resonance-powered. Sound waves, frequency-based.',
        crystalline:    'Structured, lattice-organized. Geometric, mineral, ordered.',
        void:           'Absence-driven, negative-space powered. Darkness, emptiness, vacuum.',
    },
    // Symbiosis Patterns (16) — How components relate
    symbiosis: {
        mutualistic:  'Both benefit — tightly coupled, collaborative. Win-win relationships.',
        commensal:    'One benefits, one neutral — loose coupling. No harm, passive benefit.',
        parasitic:    'One benefits at other\'s cost — extraction. Resource draining.',
        competitive:  'Both compete — minimal shared interface. Rivalry, resource conflict.',
        neutral:      'Independent — modular, decoupled. No interaction, isolation.',
        allelopathic: 'One inhibits others — exclusive, gatekeeping. Chemical suppression.',
        amensalism:   'One harmed, one neutral. Asymmetric negative impact.',
        antagonistic: 'Active opposition, destructive. Active conflict, fighting.',
        cooperative:  'Loose collaboration, shared goals. Working together, coordination.',
        colonial:     'Collective organism, shared identity. Group as unit, hive mind.',
        dominant:     'Master-slave hierarchy. Control, subordination, power imbalance.',
        facultative:  'Optional relationship, conditional. Flexible, context-dependent.',
        obligate:     'Mandatory relationship, dependent. Required, cannot survive alone.',
        protective:   'Shielding, defensive alliance. Guarding, sheltering, defense.',
        scavenging:   'Secondary beneficiary of waste. Cleanup, recycling dead matter.',
        epiphytic:    'Surface-mounted, non-intrusive. Perching, using without harming.',
    },
    // Trophic Structures (16) — Information flow patterns
    trophic: {
        'bottom-up':       'Atomic drives whole — data feeds up. Foundation-driven, grassroots.',
        'top-down':        'Orchestrators drive atoms — command flows down. Hierarchical control.',
        cascade:           'Event chain — one change ripples through all. Domino effects.',
        web:               'Graph — every organism connects to many others. Network mesh.',
        linear:            'Strict pipeline — A → B → C, no branching. Sequential flow.',
        detrital:          'Decomposition-based — recycle, reuse, transform. Breaking down cycles.',
        'hub_spoke':       'Central node, radial connections. Star topology, centralization.',
        mesh:              'Redundant multi-path connections. Many routes, resilience.',
        star:              'Single center, no inter-node links. Centralized, dependent leaves.',
        ring:              'Circular, cyclic dependencies. Loop topology, each connects two.',
        tree:              'Hierarchical, parent-child. Branching structure, root to leaf.',
        dag:               'Directed acyclic, no cycles. Flow one way, no loops.',
        fully_connected:   'Every node connects to every other. Complete graph, maximum edges.',
        small_world:       'Local clusters, global shortcuts. Six degrees, network theory.',
        scale_free:        'Power-law distribution, hub-heavy. Preferential attachment, few big hubs.',
        random:            'Stochastic connections, no pattern. Erdős–Rényi, unpredictable.',
    },
    // Succession Stages (12) — Maturity levels
    succession: {
        pioneer:     'Bare substrate, first arrivals, minimal structure. Early, experimental.',
        early:       'Colonization underway, sparse, fast-changing. Rapid growth, unstable.',
        mid:         'Establishing, moderate complexity, stabilizing. Growth phase, finding footing.',
        climax:      'Mature, stable, high diversity, slow change. Peak performance, equilibrium.',
        'post-climax':'Old-growth, maximum complexity, slow decay. Past prime, maintaining.',
        disturbed:   'Recovering from disruption, chaotic, rebuilding. After shock, resilience.',
        degraded:    'Declining, resource-depleted. Deteriorating, losing function.',
        renascent:   'Rebirth, new growth from ashes. Phoenix-like, regenerating.',
        stable:      'Equilibrium, balanced inputs/outputs. Steady-state, homeostasis.',
        cyclic:      'Seasonal/repeating patterns. Periodic, predictable oscillation.',
        chaotic:     'Unpredictable, non-linear dynamics. Sensitivity, butterfly effect.',
        frozen:      'Static, preserved, no change. Cryogenic, suspended animation.',
    },
    // Adaptation Axes (16) — Environmental pressures
    adaptation: {
        thermal:       'Temperature extremes — performance under heat/cold.',
        pressure:      'High-load, compressed environments. Stress handling.',
        chemical:      'Reactive, data-rich, transformation focus. Processing change.',
        radiation:     'High-exposure, visibility-first. Bright light, transparency.',
        temporal:      'Time-sensitive, urgency-driven. Speed, deadlines, pacing.',
        gravitational: 'Weight, hierarchy, elevation-conscious. Heavy data, stacking.',
        electric:      'Shock-resistant, conductive. Quick responses, spark-like.',
        magnetic:      'Field-sensitive, aligned. Attraction-based, polarization.',
        sonic:         'Vibration-adapted, resonant. Sound-reactive, frequency-aware.',
        optic:         'Light-sensitive, visual-acuity. Image processing, sight.',
        tactile:       'Touch-responsive, haptic. Feel, texture, pressure.',
        kinetic:       'Motion-adapted, momentum-based. Movement, animation, flow.',
        social:        'Interaction-optimized, collaborative. Multi-user, communication.',
        cognitive:     'Complexity-adapted, learning. AI, ML, pattern recognition.',
        competitive:   'Rivalrous, edge-seeking. Market competition, advantage.',
        symbiotic:     'Cooperation-optimized, mutualistic. Partnership, mutual benefit.',
    },
    // Population Patterns (16) — Distribution strategies
    population: {
        sparse:      'Few, spread, high breathing room. Minimal density, isolation.',
        clustered:   'Grouped, hub-and-spoke, focal points. Aggregation, centers.',
        gradient:    'Density changes smoothly across surface. Gradual transitions.',
        fractal:     'Self-similar at every scale. Recursive patterns, zoom symmetry.',
        uniform:     'Evenly distributed, grid-like. Regular spacing, tessellation.',
        stratified:  'Layered bands, distinct zones. Horizontal layers, classes.',
        random:      'Stochastic placement. Poisson distribution, unpredictable.',
        regular:     'Evenly spaced intervals. Periodic, rhythmic spacing.',
        aggregated:  'Clumped, patchy distribution. Clustering, uneven density.',
        dispersed:   'Actively spread out. Anti-clustering, maximized distance.',
        colonial:    'Clustered around origin points. Source-based, radial growth.',
        linear:      'Arranged in lines or strips. String-like, corridor patterns.',
        radial:      'Circular arrangement from center. Hub and spoke, sunburst.',
        checkerboard:'Alternating occupied/empty. Chessboard, binary pattern.',
        network:     'Connected node distribution. Graph-based, linked points.',
        percolated:  'Near-critical connectivity. Threshold states, phase transitions.',
    },
    // Temporal Rhythms (16) — Activity patterns
    temporal: {
        diurnal:        'Active in light — light-mode primary. Day-focused, sun-driven.',
        nocturnal:      'Active in dark — dark-mode primary. Night-focused, shadow.',
        tidal:          'Oscillating, bidirectional, rhythmic. Ebb and flow, periodic.',
        seasonal:       'Periodic, batch-cycle updates. Quarterly, yearly patterns.',
        continuous:     'Always active, real-time, no rest state. 24/7, always-on.',
        crepuscular:    'Active at dawn/dusk, twilight-focused. Transition times.',
        cathemeral:     'Irregular activity throughout day. Sporadic, unpredictable.',
        circadian:      '~24 hour internal cycle. Biological rhythm, day-night.',
        ultradian:      'Cycles shorter than 24 hours. Multiple per day, frequent.',
        infradian:      'Cycles longer than 24 hours. Weekly, monthly patterns.',
        arhythmic:      'No discernible pattern. Random activity, noise.',
        pulsed:         'Burst activity, then rest. Sprint and recovery, intermittent.',
        aperiodic:      'Random timing. Unpredictable, no cycle.',
        entrained:      'Synchronized to external cue. Locked to stimulus, triggered.',
        free_running:   'Internal rhythm, no external sync. Independent clock.',
        biphasic:       'Two distinct active periods. Split schedule, siesta-style.',
    },
    // Spatial Axes (16) — Dimensional orientation
    spatial: {
        surface:       'Top-level, above-fold primary. Visible, immediate, prominent.',
        subsurface:    'Below surface, nested, contextual. Hidden, depth-required.',
        pelagic:       'Mid-water, floating layers, z-depth. Suspended, middle zone.',
        benthic:       'Bottom-dwelling, footer, persistent chrome. Foundation, base.',
        terrestrial:   'Ground level, full viewport. Surface-based, earth-bound.',
        arboreal:      'Tree-like, vertical hierarchy. Canopy, branches, climbing.',
        aerial:        'Above, overlay, floating. Sky, clouds, suspension.',
        subterranean:  'Deep nested, hidden underground. Buried, excavation.',
        littoral:      'Edge, boundary, transition zone. Shoreline, beach, interface.',
        riparian:      'Along flow, stream-like. Riverbank, flowing water edge.',
        montane:       'Elevated, peaks and valleys. Mountains, altitude zones.',
        lacustrine:    'Lake-like, contained bodies. Still water, enclosed.',
        estuarine:     'Mixing zone, brackish. Fresh-salt transition, delta.',
        hadal:         'Deepest trench levels. Ultra-deep, extreme pressure.',
        intertidal:    'Alternating exposed/submerged. Tide zones, changing state.',
        supralittoral: 'Splash zone, occasionally wet. Above high tide, spray.',
    },
    // Capacity Classes (16) — Density levels
    capacity: {
        void:           '0 organisms — empty, vacuum, null state.',
        single:         '1 organism — solitary, lone, unique.',
        minimal:        '2–6 organisms — sparse, limited, boutique.',
        sparse:         '7–14 organisms — scattered, selective, curated.',
        sub_optimal:    '15–19 organisms — below ideal, growing room.',
        optimal:        '20–24 organisms — ideal range, balanced.',
        super_optimal:  '25–29 organisms — slightly dense, efficient.',
        dense:          '30–38 organisms — packed, information-rich.',
        high_density:   '39–49 organisms — crowded, urban, complex.',
        maximal:        '50–64 organisms — ceiling reached, full.',
        saturated:      '65–80 organisms — beyond ideal, crowded.',
        supersaturated: '81–100 organisms — unstable, crystallizing.',
        extreme:        '101–128 organisms — chaos, emergence risk.',
        critical:       '129–200 organisms — system stress, near collapse.',
        collapse_risk:  '201–500 organisms — unsustainable, failure imminent.',
        infinite:       '500+ organisms — uncountable, boundless.',
    },
};

// ═══════════════════════════════════════════════════════════════════════════════
// L3 CIVILIZATION GLOSSARY — What each value means for application architecture
// ═══════════════════════════════════════════════════════════════════════════════

const CIVILIZATION_GLOSSARY = {
    // Archetypes (16) — Civilizational character
    archetype: {
        theological:   'Doctrine-driven, ceremonial, sacred proportions. Belief-first, ritual-heavy.',
        scientific:    'Measurement-first, observable, annotation-rich. Evidence-based, documented.',
        mercantile:    'Transaction-optimized, conversion-ruthless. Commerce-first, profit-driven.',
        maritime:      'Navigational, routing-primary, flow-visible. Journey-focused, wayfinding.',
        warrior:       'Decisive, bold, zero-ambiguity command. Action-first, decisive.',
        democratic:    'Equal-weight, accessible, no VIP treatment. Fair, inclusive, flat.',
        industrial:    'Modular, mass-produced, blueprint aesthetic. Factory-efficient, standardized.',
        emergent:      'Generative, self-organizing, no fixed shape. Bottom-up, evolving.',
        monastic:      'Contemplative, whitespace-rich, depth over speed. Slow, thoughtful, deep.',
        nomadic:       'Portable, lightweight, no permanent state. Mobile, transient, flexible.',
        revolutionary: 'Convention-breaking, provocative, anti-pattern. Disruptive, challenging.',
        totemic:       'Symbolic density, icon-over-text, ritual triggers. Symbol-first, meaningful.',
        byzantine:     'Layered access, indirect paths, bureaucratic grace. Complex, ornate.',
        spartan:       'Radical subtraction, utility as beauty. Minimal, essential, austere.',
        renaissance:   'Cross-domain synthesis, polymathic surfaces. Multi-disciplinary, fusion.',
        colonial:      'Aggressive capture, asymmetric value extraction. Expansionist, extractive.',
    },
    // Governance Models (14) — Authority structures
    governance: {
        centralized:   'Single authority — simple state, one source of truth. Top-down control.',
        federated:     'Regional autonomy — module federation, zone independence. Distributed power.',
        democratic:    'Distributed authority — flat hierarchy, consensus. Vote-based, participatory.',
        theocratic:    'Doctrine authority — immutable truth, downward flow. Dogma-driven, sacred.',
        oligarchic:    'Small council — shared context, restricted routes. Elite control, exclusive.',
        anarchic:      'No authority — each component self-governs. Chaotic, autonomous, free.',
        militaristic:  'Command chain — strict routing, audit logs. Rank-based, disciplined.',
        technocratic:  'Expertise authority — algorithm-driven decisions. Merit-based, data-driven.',
        tribal:        'Kinship groups — context-local, no global state. Community-based, intimate.',
        nomadic:       'No fixed authority — floating coordination. Temporary leaders, fluid.',
        meritocratic:  'Earned authority — contribution-weighted voice. Performance-based, earned.',
        consensual:    'Unanimous agreement — blocking UI on conflict. Agreement-required, slow.',
        colonial:      'Occupation authority — external control, extractive. Foreign rule, imposed.',
        insurgent:     'Resistance governance — underground, oppositional. Rebel, counter-culture.',
    },
    // Economic Models (12) — Value exchange
    economics: {
        command:       'Central planning — top-down allocation, quotas. State-controlled, planned.',
        market:        'Supply-demand — price signals, competition. Free market, capitalist.',
        gift:          'Reciprocity — social debt, generosity economy. Potlatch, relationship-based.',
        commons:       'Shared resources — collective ownership, open access. Public goods, shared.',
        extractive:    'Resource mining — depleting, one-way flow. Taking without giving back.',
        planned:       'Roadmap-driven — scheduled releases, milestones. Predictable, organized.',
        barter:        'Direct exchange — goods for goods, no currency. Trade, swap.',
        ritual:        'Ceremonial exchange — symbolic value, tradition. Religious, meaningful.',
        creative:      'IP generation — patents, copyrights, innovation. Ideas as currency.',
        attention:     'Engagement economy — eyeballs, time-spent. Ads, clicks, views.',
        reputation:    'Status-based — karma, badges, social proof. Trust networks, status.',
        abundance:     'Post-scarcity — unlimited replication, free. Open source, shared.',
    },
    // Technology Classes (24) — Technical paradigm
    technology: {
        biological:   'Organic, adaptive, growth-based. Living systems, evolution.',
        mechanical:   'Engineered, precise, step-driven. Gears, pistons, deterministic.',
        digital:      'Network-native, async, event-driven. Bits, streams, packets.',
        quantum:      'Superposition, parallel states, branching. Qubits, uncertainty.',
        neural:       'Learning, adaptive, pattern-recognition. AI, ML, networks.',
        hybrid:       'Composite, multi-paradigm. Mixed approaches, best-of-breed.',
        crystalline:  'Rigid structure, geometric precision. Lattices, minerals, ordered.',
        volcanic:     'Burst energy, sudden release, high-intensity. Spikes, eruptions.',
        tidal:        'Rhythmic cycles, predictable oscillation. Waves, periodic flow.',
        acoustic:     'Signal propagation, resonance. Sound, vibration, echo.',
        optical:      'Light-speed, line-of-sight. Photons, lenses, vision.',
        alchemical:   'Irreversible transformation, transmutation. Chemistry, change.',
        atmospheric:  'Ambient distribution, pressure. Air, weather, diffusion.',
        spectral:     'Frequency-filtered, layered bands. Prism, rainbow, spectrum.',
        entanglement: 'Instant correlation across distance. Quantum-locked, spooky action.',
        gravitational:'Mass-attraction, weight-driven. Heavy objects pull light.',
        thermodynamic:'Entropy, heat death, energy dissipation. Second law, cooling.',
        fractal:      'Self-similar, patterns repeat at scale. Recursive, zoom symmetry.',
        chaotic:      'Butterfly effect, sensitive to initial conditions. Unpredictable.',
        stochastic:   'Probabilistic, random walks. Monte Carlo, chance-based.',
        genetic:      'Evolutionary, selection, inheritance. DNA, mutation, breeding.',
        memetic:      'Idea transmission, viral concepts. Thoughts, culture spread.',
        symbiotic:    'Mutual enhancement, cross-platform. Partnership, cooperation.',
        autopoietic:  'Self-creating, regenerating components. Self-maintaining, living.',
    },
    // Culture Emphases (28) — Communication medium
    culture: {
        oral:         'Narrative, story-driven, conversational UI. Speaking, listening.',
        written:      'Document-first, long-form, annotation-heavy. Text, reading.',
        visual:       'Image-primary, show-don\'t-tell. Pictures, graphics, icons.',
        numeric:      'Data-first, measurement, dashboard-heavy. Numbers, stats.',
        ritual:       'Ceremony, process, step-by-step flows. Rituals, sequences.',
        algorithmic:  'Computed, emergent, no fixed content. Generative, procedural.',
        tactile:      'Physical metaphor, touch-native. Texture, haptics, feel.',
        spatial:      '3D thinking, depth, placement. Space, position, volume.',
        gestural:     'Motion-as-input, trajectory. Swipes, waves, movement.',
        sonic:        'Audio-first, non-visual. Sound, music, voice.',
        archival:     'Preservation, provenance, timestamped. History, records.',
        mythological: 'Archetypal narrative, hero journey. Stories, legends.',
        performative: 'Live, ephemeral, time-bound. Theater, presence, now.',
        material:     'Weight, texture, physicality. Real objects, matter.',
        code:         'Executable, programs as culture. Software, scripts.',
        data:         'Quantitative, numbers tell story. Datasets, analytics.',
        symbol:       'Semiotic, signs, abstract. Icons, sigils, meaning.',
        network:      'Relational, connections as meaning. Graphs, links.',
        simulation:   'Modeled, virtual worlds. Fake environments, models.',
        game:         'Ludic, play, rules. Games, fun, winning.',
        meme:         'Viral, rapidly spreading. Internet culture, remix.',
        artifact:     'Object-oriented, physical/digital. Things, objects.',
        experience:   'Phenomenological, felt sense. Feeling, sensation.',
        energy:       'Vibrational, frequencies. Auras, vibes, fields.',
        smell:        'Olfactory, scent-based. Perfume, odor, fragrance.',
        taste:        'Gustatory, flavor. Food, drink, culinary.',
        touch:        'Haptic, texture, pressure. Skin, contact.',
        intuition:    'Non-verbal, gut feeling. Instinct, sixth sense.',
    },
    // Expansion Modes (20) — Growth patterns
    expansion: {
        organic:       'Grows where needed — lazy loading, on-demand. Natural growth.',
        aggressive:    'Captures territory — eager loading, prefetch. Expansionist.',
        sustainable:   'Controlled growth — code-split, budget-aware. Green, responsible.',
        contracting:   'Shrinking — remove, simplify, reduce. Downsizing, minimal.',
        stable:        'No growth — fixed scope, no new features. Static, maintaining.',
        viral:         'Exponential spread — sharing mechanics, referral. Network effects.',
        rhizomatic:    'Lateral expansion — horizontal, no root. Spreading sideways.',
        colonial:      'Occupation — consumes existing surfaces. Taking over.',
        missionary:    'Conversion-first — onboarding primary. Evangelizing, recruiting.',
        symbiotic:     'Grows with host — embedded, positive. Mutual growth.',
        explosive:     'Rapid burst, then plateau. Big bang, then stable.',
        cyclic:        'Periodic expansion/contraction. Breathing, seasons.',
        fractal:       'Self-similar growth at all scales. Recursive expansion.',
        meristematic:  'Growing from tips, apical dominance. Branch tips, active growth.',
        diffuse:       'Slow, uniform spread. Even distribution, gradual.',
        saltatory:     'Jumps, punctuated equilibrium. Leapfrogging, sudden.',
        centripetal:   'Inward growth, consolidation. Center-focused, gathering.',
        centrifugal:   'Outward push, boundary expansion. Edge-focused, pushing.',
        accretionary:  'Layer-by-layer accumulation. Building up, sedimentary.',
        involutional:  'Complex internal folding. Folding in, complexifying.',
        tectonic:      'Sudden displacement — big-bang releases, batch migrations. Plate shifting, sudden moves.',
        crystalline:   'Structured growth — schema-first, geometry-constrained. Crystal formation, ordered expansion.',
    },
    // Topology Shapes (12) — Structural patterns
    topology: {
        radial:        'Hub-and-spoke — central authority, radiating routes. Star, centralized.',
        hierarchical:  'Tree structure — parent owns children, top-down. Pyramid, boss.',
        rhizomatic:    'No centre — lateral connections, any-to-any. Flat, networked.',
        fractal:       'Self-similar at every scale — recursive nesting. Russian doll.',
        linear:        'Sequential — pipeline, one-way flow. Assembly line, straight.',
        archipelagic:  'Islands with bridges — clusters, periodic connection. Clusters.',
        crystalline:   'Geometric lattice — ordered grid, predictable. Crystal, regular.',
        chaotic:       'No discernible structure — emergent adjacency. Random, messy.',
        spiral:        'Expanding from origin — progressive depth. Vortex, growth.',
        cellular:      'Adjacent cells — membrane boundaries, local exchange. Compartments.',
        layered:       'Horizontal strata — depth as metaphor. Stacks, levels.',
        distributed:   'Fully decentralized — no privileged topology. Peer-to-peer.',
    },
    // Cosmology Beliefs (16) — Philosophy of causation
    cosmology: {
        deterministic:    'Fixed outcomes — predictable, auditable, no surprise. Clockwork.',
        probabilistic:    'Stochastic — confidence intervals, uncertainty. Maybe, perhaps.',
        cyclical:         'Repeating patterns — seasons, periodic UI. Circles, loops.',
        entropic:         'Moving toward disorder — degradation arcs. Decay, rust.',
        generative:       'Creation-first — always making, never preserving. Birth, growth.',
        teleological:     'Goal-directed — everything toward end state. Purpose-driven.',
        dialectical:      'Thesis/antithesis — tension drives progress. Conflict, synthesis.',
        phenomenological: 'Experience-first — perception over measurement. Feeling, being.',
        emergent:         'Bottom-up causation — complex from simple. Swarm, hive.',
        mythological:     'Narrative causation — story explains everything. Legends, tales.',
        mechanistic:      'Cause-effect chains — Newtonian, no mystery. Push-pull.',
        vitalist:         'Life-force driven — organic will, not mechanics. Energy, spirit.',
        multiversal:      'Many-worlds — parallel states, branch exploration. Alternate realities.',
        simulationist:    'Simulated reality — nested realities, glitches. Matrix, fake.',
        hyperstitional:   'Fiction makes itself real — belief becomes fact. Self-fulfilling.',
        accelerationist:  'Speed as virtue — faster is always better. Velocity, rush.',
    },
    // Memory Models (12) — Persistence strategies
    memory: {
        ephemeral:   'Momentary — RAM only, disappear on refresh. Temporary, fleeting.',
        session:     'Tab-lifetime — sessionStorage. While open, then gone.',
        persistent:  'Permanent — localStorage, survives forever. Always there.',
        synced:      'Cloud-backed — multi-device continuity. Everywhere, synchronized.',
        blockchain:  'Immutable ledger — append-only, verified. Forever, verified.',
        distributed: 'Shared memory — collective knowledge base. Group mind, shared.',
        muscle:      'Procedural — learned habits, not facts. Skills, motor memory.',
        collective:  'Group memory — shared cultural archive. Culture, tradition.',
        ancestral:   'Inherited — pre-loaded wisdom, genetic. Born knowing, instinct.',
        external:    'Offloaded — books, devices, not in brain. Look it up, google.',
        compressed:  'Lossy — summaries, not full fidelity. Gist, overview.',
        holographic: 'Whole in every part — distributed encoding. Every piece contains all.',
    },
    // Interface Modes (16) — Interaction paradigms
    interface: {
        direct:       'Immediate manipulation — touch, click. Direct action, no中介.',
        indirect:     'Mediated — mouse, pointer, indirect. Through tool, instrument.',
        gestural:     'Body movement — Kinect, camera, motion. Wave, dance, move.',
        vocal:        'Voice-first — speech, conversation. Talk, speak, command.',
        neural:       'Brain-computer — BCI, thought control. Think, mind control.',
        haptic:       'Touch-feedback — force feedback, vibration. Feel, touch response.',
        ambient:      'Always-on — environmental awareness. Background, peripheral.',
        tangible:     'Physical objects — graspable interfaces. Hold, manipulate real.',
        augmented:    'AR overlay — digital on physical. Glasses, mixed reality.',
        virtual:      'VR immersion — fully digital space. Headset, simulated world.',
        multimodal:   'Combined inputs — voice + gesture + touch. Many methods together.',
        predictive:   'Anticipatory — system acts before asked. Pre-cognition, early.',
        adaptive:     'Personalized — changes to fit user. Learning, customizing.',
        proactive:    'Initiative-taking — suggests before request. Helping, anticipating.',
        reactive:     'Responsive — waits for user action. On-demand, responsive.',
        autonomous:   'Self-directed — minimal human input. Independent, automatic.',
    },
    // Evolution Strategies (16) — Change patterns
    evolution: {
        gradual:       'Slow, continuous — Kaizen, iterative. Step by step, steady.',
        punctuated:    'Long stability, sudden jumps. Quiet then boom, leap.',
        revolutionary: 'Abrupt, total overhaul. Tear down, rebuild.',
        convergent:    'Toward optimal solution. Narrowing, focusing, best.',
        divergent:     'Exploring many paths. Spreading, branching, options.',
        parallel:      'Multiple simultaneous experiments. Many at once, racing.',
        speciated:     'Branching into distinct forms. Splitting, different species.',
        hybridized:    'Combining different lineages. Cross-breeding, mixing.',
        engineered:    'Designed, top-down change. Planned, architected.',
        emergent:      'Bottom-up, self-organized. From below, spontaneous.',
        market_driven: 'Competition selects winners. Survival of fittest, compete.',
        planned:       'Roadmap, scheduled releases. Predictable, scheduled.',
        responsive:    'Adapting to environment changes. Reactive, adjusting.',
        resistant:     'Avoiding change, stability-first. Conservative, maintaining.',
        destructive:   'Creative destruction, burn and rebuild. Tear down, renew.',
        modular:       'Component-wise independent evolution. Pieces evolve alone.',
    },
    // Communication Protocols (16) — Data exchange patterns
    communication: {
        synchronous:   'Real-time — immediate response. Now, instant, live.',
        asynchronous:  'Delayed — queue-based, at convenience. Later, when ready.',
        streaming:     'Continuous flow — never-ending data. Firehose, constant.',
        batch:         'Periodic bursts — aggregated delivery. Bundled, periodic.',
        event_driven:  'Reactive — triggered by occurrences. When happens, respond.',
        polling:       'Periodic check — request-response cycle. Ask repeatedly.',
        push:          'Server-initiated — client receives. Sent to you, delivery.',
        pull:          'Client-initiated — on demand. Fetch when needed, request.',
        pub_sub:       'Broadcast — many listeners, one source. Publish, subscribe.',
        peer_to_peer:  'Decentralized — direct node connection. Node to node, direct.',
        gossip:        'Viral spread — neighbor to neighbor. Word of mouth, viral.',
        broadcast:     'One-to-all — universal message. Everyone, all at once.',
        multicast:     'One-to-many — selected group. Group, targeted many.',
        unicast:       'One-to-one — private channel. Personal, individual, direct.',
        mesh:          'Many-to-many — network flooding. Everyone talks to everyone.',
        quantum:       'Entangled — instant correlation. Spooky action, linked.',
    },
};

export interface DesignBrief {
    thesis: string;          // The design philosophy — what organism this design is
    mandates: string[];      // What this design MUST implement
    antiPatterns: string[];  // What would betray this genome
    layerGuide: {
        l1: string;          // How L1 chromosomes direct CSS/token implementation
        l2?: string;         // How L2 ecosystem chromosomes shape component architecture
        l3?: string;         // How L3 civilization chromosomes shape application architecture
    };
    usage_md: string;        // Complete DESIGN_SYSTEM.md ready to write to the project
}

export class DesignBriefGenerator {

    async generate(
        designGenome: DesignGenome,
        callText: (prompt: string) => Promise<string>,
        ecosystemGenome?: EcosystemGenome,
        civilizationGenome?: CivilizationGenome
    ): Promise<DesignBrief> {
        const prompt = this.buildSynthesisPrompt(designGenome, ecosystemGenome, civilizationGenome);
        const raw = await callText(prompt);
        return this.parseResponse(raw, designGenome, ecosystemGenome, civilizationGenome);
    }

    private buildSynthesisPrompt(
        dg: DesignGenome,
        eg?: EcosystemGenome,
        cg?: CivilizationGenome
    ): string {
        // Defensive checks for incomplete genome objects
        if (!dg.chromosomes) {
            throw new Error("DesignGenome missing chromosomes. Ensure you pass the full genome object from generate_design_genome, not just dnaHash/traits.");
        }
        if (!dg.sectorContext) {
            throw new Error("DesignGenome missing sectorContext. Ensure you pass the full genome object from generate_design_genome.");
        }
        
        const c = dg.chromosomes;
        const totalChromosomes = eg && cg ? 64 : eg ? 48 : 32;  // Updated: L1=32, L2=16, L3=16

        const primary = c.ch5_color_primary;
        const pHue = primary?.hue ?? 0;
        const pSat = Math.round((primary?.saturation ?? 0) * 100);
        const pLight = Math.round((primary?.lightness ?? 0) * 100);
        const pDarkLight = Math.round((primary?.darkModeLightness ?? 0) * 100);

        const sectorPrimary = dg.sectorContext?.primary ?? 'unknown';
        const sectorSub = dg.sectorContext?.subSector ?? 'general';

        let prompt = `You are synthesizing a design philosophy from a ${totalChromosomes}-chromosome genome chain.

Your task is NOT to describe tokens. Your task is to describe the ORGANISM — what kind of design does this chromosome combination produce, what creative philosophy emerges from their interaction, and what it mandates and forbids.

Think epistatically: each chromosome's meaning changes in context of the others. A "volcanic biome" + "warrior archetype" produces something very different from "volcanic biome" + "democratic archetype". Read the COMBINATION, not the individual values.

═══════════════════════════════════════
LAYER 1 — DESIGN GENOME (32 chromosomes)
═══════════════════════════════════════
Sector: ${sectorPrimary} / ${sectorSub}
DNA Hash: ${dg.dnaHash?.slice(0, 16) ?? 'unknown'}...

Structure & Space:
  ch1 topology: ${c.ch1_structure?.topology} — ${c.ch1_structure?.sectionCount} sections
  ch2 rhythm density: ${c.ch2_rhythm?.density}
  ch9 grid: ${c.ch9_grid?.columns}-column, ${c.ch9_grid?.logic} logic
  ch10 hierarchy depth: ${c.ch10_hierarchy?.depth}

Typography:
  ch3 display font: ${c.ch3_type_display?.displayName} — charge: ${c.ch3_type_display?.charge}, tracking: ${c.ch3_type_display?.tracking}
  ch4 body font: ${c.ch4_type_body?.displayName} — line length: ${c.ch4_type_body?.optimalLineLength}
  ch16 type scale ratio: ${c.ch16_typography?.ratio?.toFixed(2)}

Color & Surface:
  ch5 primary: HSL(${pHue}°, ${pSat}%, ${pLight}%) — ${primary?.temperature} — dark mode: ${pDarkLight}% lightness
  ch6 temperature: ${c.ch6_color_temp?.backgroundTemp} (dark: ${c.ch6_color_temp?.isDark})
  ch11 surface texture: ${c.ch11_texture?.surface}
  ch7 edge style: ${c.ch7_edge?.style}

Motion & Interaction:
  ch8 physics: ${c.ch8_motion?.physics} — ${c.ch8_motion?.durationScale}s duration
  ch14 physics material: ${c.ch14_physics?.material ?? "–"} (roughness: ${c.ch14_physics?.roughness?.toFixed(2) ?? "–"}, metalness: ${c.ch14_physics?.metalness?.toFixed(2) ?? "–"})
  ch17 accessibility: WCAG ${c.ch17_accessibility?.minContrastRatio}:1, motion-safe: ${c.ch17_accessibility?.respectMotionPreference}

Content & Trust:
  ch19 hero: ${c.ch19_hero_type?.type} — ${c.ch19_hero_variant_detail?.layout} layout
  ch21 trust signals: ${c.ch21_trust_signals?.prominence} prominence, ${c.ch21_trust_signals?.approach}
  ch22 social proof: ${c.ch22_social_proof?.type}
  ch23 content depth: ${c.ch23_content_depth?.level} (${c.ch23_content_depth?.estimatedSections} sections)
  ch29 copy: ${c.ch29_copy_intelligence?.emotionalRegister} register, ${Math.round((c.ch29_copy_intelligence?.formalityLevel ?? 0.5) * 100)}% formality

Constraints:
  Forbidden patterns: ${dg.constraints?.forbiddenPatterns?.join(", ") || "none"}
  Required patterns: ${dg.constraints?.requiredPatterns?.join(", ") || "none"}
`;

        if (eg) {
            const ec = eg.chromosomes;
            const biomeDesc = ECOSYSTEM_GLOSSARY.biome[ec.eco_ch1_biome.class] || '';
            const energyDesc = ECOSYSTEM_GLOSSARY.energy[ec.eco_ch2_energy.source] || '';
            const symbiosisDesc = ECOSYSTEM_GLOSSARY.symbiosis[ec.eco_ch3_symbiosis.pattern] || '';
            const trophicDesc = ECOSYSTEM_GLOSSARY.trophic[ec.eco_ch4_trophic.structure] || '';
            const successionDesc = ECOSYSTEM_GLOSSARY.succession[ec.eco_ch5_succession.stage] || '';
            const adaptationDesc = ECOSYSTEM_GLOSSARY.adaptation[ec.eco_ch6_adaptation.axis] || '';
            const populationDesc = ECOSYSTEM_GLOSSARY.population[ec.eco_ch7_population.pattern] || '';
            const temporalDesc = ECOSYSTEM_GLOSSARY.temporal[ec.eco_ch8_temporal.rhythm] || '';
            const spatialDesc = ECOSYSTEM_GLOSSARY.spatial[ec.eco_ch9_spatial.axis] || '';
            const capacityDesc = ECOSYSTEM_GLOSSARY.capacity[ec.eco_ch10_capacity.class] || '';
            
            prompt += `
═══════════════════════════════════════
LAYER 2 — ECOSYSTEM GENOME (11 chromosomes)
sha256(L1 hash) — derived from L1
═══════════════════════════════════════
  eco_ch1 biome: ${ec.eco_ch1_biome.class} (intensity ${ec.eco_ch1_biome.intensity.toFixed(2)})
    → ${biomeDesc}
  eco_ch2 energy source: ${ec.eco_ch2_energy.source} (flux ${ec.eco_ch2_energy.flux.toFixed(2)})
    → ${energyDesc}
  eco_ch3 symbiosis: ${ec.eco_ch3_symbiosis.pattern} (depth ${ec.eco_ch3_symbiosis.depth.toFixed(2)})
    → ${symbiosisDesc}
  eco_ch4 trophic structure: ${ec.eco_ch4_trophic.structure} (cascade ${ec.eco_ch4_trophic.cascade.toFixed(2)})
    → ${trophicDesc}
  eco_ch5 succession: ${ec.eco_ch5_succession.stage} (drift ${ec.eco_ch5_succession.drift.toFixed(2)})
    → ${successionDesc}
  eco_ch6 adaptation axis: ${ec.eco_ch6_adaptation.axis} (strength ${ec.eco_ch6_adaptation.strength.toFixed(2)})
    → ${adaptationDesc}
  eco_ch7 population: ${ec.eco_ch7_population.pattern} (variance ${ec.eco_ch7_population.variance.toFixed(2)})
    → ${populationDesc}
  eco_ch8 temporal rhythm: ${ec.eco_ch8_temporal.rhythm} (intensity ${ec.eco_ch8_temporal.intensity.toFixed(2)})
    → ${temporalDesc}
  eco_ch9 spatial axis: ${ec.eco_ch9_spatial.axis} (isolation ${ec.eco_ch9_spatial.isolation.toFixed(2)})
    → ${spatialDesc}
  eco_ch10 capacity: ${ec.eco_ch10_capacity.class} (pressure ${ec.eco_ch10_capacity.pressure.toFixed(2)})
    → ${capacityDesc}
  eco_ch11 mutation rate: ${ec.eco_ch11_mutation.rate.toFixed(2)} (variance ${ec.eco_ch11_mutation.variance.toFixed(2)})
    → How rapidly organisms evolve and adapt
`;
        }

        if (cg) {
            const cc = cg.chromosomes;
            const archetypeDesc = CIVILIZATION_GLOSSARY.archetype[cc.civ_ch1_archetype.class] || '';
            const governanceDesc = CIVILIZATION_GLOSSARY.governance[cc.civ_ch2_governance.model] || '';
            const economicsDesc = CIVILIZATION_GLOSSARY.economics[cc.civ_ch3_economics.model] || '';
            const technologyDesc = CIVILIZATION_GLOSSARY.technology[cc.civ_ch4_technology.class] || '';
            const cultureDesc = CIVILIZATION_GLOSSARY.culture[cc.civ_ch5_culture.emphasis] || '';
            const expansionDesc = CIVILIZATION_GLOSSARY.expansion[cc.civ_ch8_expansion.mode] || '';
            const topologyDesc = CIVILIZATION_GLOSSARY.topology[cc.civ_ch11_topology.shape] || '';
            const cosmologyDesc = CIVILIZATION_GLOSSARY.cosmology[cc.civ_ch12_cosmology.belief] || '';
            const memoryDesc = CIVILIZATION_GLOSSARY.memory[cc.civ_ch13_memory.model] || '';
            const interfaceDesc = CIVILIZATION_GLOSSARY.interface[cc.civ_ch14_interface.mode] || '';
            const evolutionDesc = CIVILIZATION_GLOSSARY.evolution[cc.civ_ch15_evolution.strategy] || '';
            const communicationDesc = CIVILIZATION_GLOSSARY.communication[cc.civ_ch16_communication.protocol] || '';
            
            prompt += `
═══════════════════════════════════════
LAYER 3 — CIVILIZATION GENOME (16 chromosomes)
sha256(L2 hash) — derived from L2
═══════════════════════════════════════
  civ_ch1 archetype: ${cc.civ_ch1_archetype.class} (intensity ${cc.civ_ch1_archetype.intensity.toFixed(2)})
    → ${archetypeDesc}
  civ_ch2 governance: ${cc.civ_ch2_governance.model} (rigidity ${cc.civ_ch2_governance.rigidity.toFixed(2)})
    → ${governanceDesc}
  civ_ch3 economics: ${cc.civ_ch3_economics.model} (pressure ${cc.civ_ch3_economics.pressure.toFixed(2)})
    → ${economicsDesc}
  civ_ch4 technology: ${cc.civ_ch4_technology.class} (maturity ${cc.civ_ch4_technology.maturity.toFixed(2)})
    → ${technologyDesc}
  civ_ch5 culture: ${cc.civ_ch5_culture.emphasis} (cohesion ${cc.civ_ch5_culture.cohesion.toFixed(2)})
    → ${cultureDesc}
  civ_ch6 resilience: ${cc.civ_ch6_resilience.pattern} (depth ${cc.civ_ch6_resilience.depth.toFixed(2)})
    → How the system survives disruption and stress
  civ_ch7 knowledge: ${cc.civ_ch7_knowledge.model} (entropy ${cc.civ_ch7_knowledge.entropy.toFixed(2)})
    → How information is organized and accessed
  civ_ch8 expansion: ${cc.civ_ch8_expansion.mode} (velocity ${cc.civ_ch8_expansion.velocity.toFixed(2)})
    → ${expansionDesc}
  civ_ch9 age: ${cc.civ_ch9_age.class} (stability ${cc.civ_ch9_age.stability.toFixed(2)})
    → Maturity stage of the civilization
  civ_ch10 fragility: ${cc.civ_ch10_fragility.rate.toFixed(2)} (variance ${cc.civ_ch10_fragility.variance.toFixed(2)})
    → Vulnerability to collapse or disruption
  civ_ch11 topology: ${cc.civ_ch11_topology.shape} (density ${cc.civ_ch11_topology.density.toFixed(2)})
    → ${topologyDesc}
  civ_ch12 cosmology: ${cc.civ_ch12_cosmology.belief} (conviction ${cc.civ_ch12_cosmology.conviction.toFixed(2)})
    → ${cosmologyDesc}
  civ_ch13 memory: ${cc.civ_ch13_memory.model} (persistence ${cc.civ_ch13_memory.persistence.toFixed(2)})
    → ${memoryDesc}
  civ_ch14 interface: ${cc.civ_ch14_interface.mode} (responsiveness ${cc.civ_ch14_interface.responsiveness.toFixed(2)})
    → ${interfaceDesc}
  civ_ch15 evolution: ${cc.civ_ch15_evolution.strategy} (rate ${cc.civ_ch15_evolution.rate.toFixed(2)})
    → ${evolutionDesc}
  civ_ch16 communication: ${cc.civ_ch16_communication.protocol} (bandwidth ${cc.civ_ch16_communication.bandwidth.toFixed(2)})
    → ${communicationDesc}
`;
        }

        prompt += `
═══════════════════════════════════════
SYNTHESIS TASK
═══════════════════════════════════════
Read these ${totalChromosomes} chromosomes as a system. Find the tensions and alignments. What does this specific combination produce?

Return your response using EXACTLY these section headers (no extra text before ## THESIS):

## THESIS
[2-4 sentences. What kind of organism is this design? Not what tokens it has — what is its essential character? What creative philosophy emerges from THIS specific chromosome combination? Be concrete and evocative.]

## MANDATES
[Bullet list starting with -. What MUST this design implement, given these chromosomes? Be specific — reference the chromosome values. Not generic advice.]

## ANTI-PATTERNS
[Bullet list starting with -. What approaches would betray this genome? What would feel wrong for this specific organism? Reference chromosome tensions where relevant.]

## L1 IMPLEMENTATION
[How these L1 chromosomes direct the CSS/visual implementation. What does the motion physics + edge style + typography charge combination mean concretely? How should the builder read the color system for this genome?]
${eg ? `
## L2 COMPONENT PHILOSOPHY
[How the ecosystem chromosomes — biome + energy + symbiosis + trophic — shape how components should be built. What kind of organisms live in this biome? How should they relate to each other? What animation/interaction character follows from this ecosystem?]
` : ""}${cg ? `
## L3 ARCHITECTURE PHILOSOPHY
[How the civilization chromosomes — archetype + governance + economics + knowledge model — shape application architecture. State topology, routing character, resilience strategy. What does it mean to build a ${cg?.chromosomes.civ_ch1_archetype.class} civilization with ${cg?.chromosomes.civ_ch2_governance.model} governance?]
` : ""}
## USAGE.MD
[Write a complete DESIGN_SYSTEM.md for this project. Include: the thesis paragraph, a token quick-reference table (CSS variable name | purpose | do not use for), implementation mandates checklist, forbidden patterns with reason, font loading snippet, and which genome layer drives which implementation concern. Make it specific to THIS genome — not generic. The builder should read this and know exactly what kind of design organism they are building.]
`;

        return prompt;
    }

    private parseResponse(
        raw: string,
        dg: DesignGenome,
        eg?: EcosystemGenome,
        cg?: CivilizationGenome
    ): DesignBrief {
        const extract = (section: string): string => {
            const regex = new RegExp(`## ${section}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`, 'i');
            const m = raw.match(regex);
            return m ? m[1].trim() : '';
        };

        const parseBullets = (s: string): string[] =>
            s.split('\n')
             .map(l => l.replace(/^[-*•]\s*/, '').trim())
             .filter(Boolean);

        const thesis        = extract('THESIS');
        const mandatesRaw   = extract('MANDATES');
        const antiRaw       = extract('ANTI-PATTERNS');
        const l1            = extract('L1 IMPLEMENTATION');
        const l2            = eg ? extract('L2 COMPONENT PHILOSOPHY') : undefined;
        const l3            = cg ? extract('L3 ARCHITECTURE PHILOSOPHY') : undefined;
        const usage_md_raw  = extract('USAGE\\.MD');

        return {
            thesis:       thesis || "Design philosophy synthesis unavailable.",
            mandates:     parseBullets(mandatesRaw),
            antiPatterns: parseBullets(antiRaw),
            layerGuide:   { l1, l2, l3 },
            usage_md:     usage_md_raw || this.buildFallbackUsageMd(dg, thesis),
        };
    }

    private buildFallbackUsageMd(dg: DesignGenome, thesis: string): string {
        const c = dg.chromosomes;
        return `# Design System — ${dg.sectorContext.primary}

## Philosophy
${thesis}

## Token Quick Reference
| CSS Variable | Purpose |
|---|---|
| \`--color-primary\` | Primary brand color (light mode) |
| \`--color-primary-interactive\` | Buttons and interactive elements (dark mode safe) |
| \`--color-surface-0\` | Page background |
| \`--color-surface-1\` | Card backgrounds |
| \`--color-surface-2\` | Elevated surfaces |
| \`--color-surface-3\` | Highest elevation |
| \`--genome-easing\` | All transition timing functions |
| \`--genome-duration\` | Base animation duration |

## Constraints
- **Forbidden:** ${dg.constraints?.forbiddenPatterns?.join(", ") || "none"}
- **Required:** ${dg.constraints?.requiredPatterns?.join(", ") || "none"}

## Layer Guide
- **L1 genome** → CSS variables, color system, typography, spacing, motion tokens
- **L2 ecosystemGenome** → Component hierarchy, organism relationships, biome character
- **L3 civilizationGenome** → State topology, routing pattern, token inheritance

## DNA
- Hash: \`${dg.dnaHash}\`
- Sector: ${dg.sectorContext.primary} / ${dg.sectorContext.subSector}
- Fonts: ${c.ch3_type_display?.displayName} (display) · ${c.ch4_type_body?.displayName} (body)
`;
    }
}

export const designBriefGenerator = new DesignBriefGenerator();
