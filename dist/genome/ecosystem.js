/**
 * Permutations MCP - Ecosystem Generator
 *
 * A living design system where components are organisms in a shared environment.
 *
 * Architecture:
 * - ONE shared genome (the environment/DNA)
 * - Microbial = Atomic components (topology-derived, not named templates)
 * - Flora = Growing components (containers with nested relationships)
 * - Fauna = Complex moving components (orchestrators)
 * - Relationships = How organisms interact (composition patterns, communication)
 *
 * Civilization emerges when ecosystem complexity crosses threshold (0.81)
 *
 * NOTE: Names are DERIVED from topology, not hardcoded. A developer might look at
 * the topology signature and say "this looks like a button" - but the system
 * generates the topology, not the name.
 */
import { GenomeSequencer } from "./sequencer.js";
import { sequenceEcosystemGenome } from "./ecosystem-sequencer.js";
/**
 * Topology-derived organism descriptors
 * NOT templates - these describe mathematical patterns that emerge from chromosomes
 */
const TOPOLOGY_PATTERNS = {
    microbial: [
        { prefix: 'action', patterns: ['clickable', 'trigger', 'toggle'] },
        { prefix: 'indicator', patterns: ['status', 'badge', 'signal'] },
        { prefix: 'token', patterns: ['chip', 'tag', 'pill'] },
        { prefix: 'identity', patterns: ['avatar', 'icon', 'glyph'] },
        { prefix: 'loader', patterns: ['spinner', 'skeleton', 'progress'] },
        { prefix: 'separator', patterns: ['divider', 'spacer', 'rule'] },
        // NEW: Network connectors (fungi-like)
        { prefix: 'bridge', patterns: ['connector', 'sync', 'relay'] },
        { prefix: 'mycelium', patterns: ['bus', 'channel', 'stream'] },
        // NEW: Ephemeral (virus-like)
        { prefix: 'spore', patterns: ['toast', 'notification', 'alert'] },
        { prefix: 'phage', patterns: ['tooltip', 'hint', 'help'] }
    ],
    flora: [
        { prefix: 'input', patterns: ['field', 'control', 'selector'] },
        { prefix: 'container', patterns: ['card', 'panel', 'section'] },
        { prefix: 'navigation', patterns: ['menu', 'tabs', 'breadcrumb'] },
        { prefix: 'reveal', patterns: ['dropdown', 'tooltip', 'popover'] },
        { prefix: 'organization', patterns: ['list', 'accordion', 'tree'] },
        { prefix: 'selection', patterns: ['toggle', 'switch', 'radio'] },
        // NEW: Network structures
        { prefix: 'rhizome', patterns: ['network', 'mesh', 'graph'] },
        { prefix: 'hyphae', patterns: ['thread', 'connection', 'link'] }
    ],
    fauna: [
        { prefix: 'overlay', patterns: ['modal', 'dialog', 'drawer'] },
        { prefix: 'data', patterns: ['table', 'chart', 'grid'] },
        { prefix: 'media', patterns: ['carousel', 'gallery', 'player'] },
        { prefix: 'search', patterns: ['finder', 'explorer', 'filter'] },
        { prefix: 'structure', patterns: ['layout', 'shell', 'frame'] },
        { prefix: 'input', patterns: ['form', 'wizard', 'editor'] },
        // NEW: Spatial/Experiential
        { prefix: 'viewport', patterns: ['stage', 'canvas', 'portal'] },
        { prefix: 'lens', patterns: ['magnifier', 'inspector', 'detail'] }
    ]
};
// Organism IDs for hash-driven selection
const ORGANISM_REGISTRY = {
    microbial: ['action', 'indicator', 'token', 'identity', 'loader', 'separator', 'bridge', 'mycelium', 'spore', 'phage'],
    flora: ['input', 'container', 'navigation', 'reveal', 'organization', 'selection', 'rhizome', 'hyphae'],
    fauna: ['overlay', 'data', 'media', 'search', 'structure', 'input', 'viewport', 'lens']
};
/**
 * Generates a complete ecosystem of design components
 * All organisms share ONE genome (the environment)
 */
export class EcosystemGenerator {
    sequencer;
    constructor() {
        this.sequencer = new GenomeSequencer();
    }
    generate(seed, traits, options) {
        let inferredSector = "technology";
        if (options?.primarySector) {
            inferredSector = options.primarySector;
        }
        else if (traits.trustRequirement > 0.7 && traits.emotionalTemperature > 0.6) {
            inferredSector = "healthcare";
        }
        else if (traits.trustRequirement > 0.7 && traits.emotionalTemperature < 0.4) {
            inferredSector = "fintech";
        }
        else if (traits.conversionFocus > 0.7 && traits.visualEmphasis > 0.6) {
            inferredSector = "commerce";
        }
        else if (traits.playfulness > 0.6 && traits.temporalUrgency < 0.4) {
            inferredSector = "entertainment";
        }
        else if (traits.informationDensity > 0.7 && traits.emotionalTemperature < 0.3) {
            inferredSector = "manufacturing";
        }
        // L1 genome — use existing if provided (correct chain), otherwise generate fresh.
        // Passing the genome from generate_design_genome ensures L2 gravity reads
        // L1_original chromosomes, not a newly-derived L1_internal child.
        const genome = options?.existingGenome
            ?? this.sequencer.generate(seed, traits, { primarySector: inferredSector, options: { enable3D: true } });
        // Layer 2: sequence ecosystem genome from design genome.
        // Hash = sha256(genome.dnaHash) — chain integrity holds whether genome
        // is L1_original or L1_internal. Gravity reads genome.chromosomes directly.
        // Defensive: ensure chromosomes exist
        if (!genome.chromosomes) {
            throw new Error("Genome missing chromosomes. Ensure you pass the full genome object from generate_design_genome, not just dnaHash/traits.");
        }
        const ecosystemGenome = sequenceEcosystemGenome(genome, genome.chromosomes.ch15_biomarker?.complexity ?? 0.5);
        // Calculate how well this environment supports life
        const habitabilityScore = this.calculateHabitability(traits);
        // CHROMOSOME-DRIVEN: Counts determined by genome, not just traits
        const counts = this.calculateOrganismCounts(genome, options);
        // Generate organisms from the shared environment.
        // When organismsDefinition is provided, LLM-supplied names and purposes are used.
        // Falls back to topology-derived abstract naming when not provided.
        const defs = options?.organismsDefinition;
        const microbial = this.generateMicrobialColony(genome, ecosystemGenome, counts.microbial, defs?.microbial);
        const flora = this.generateFloraEcosystem(genome, ecosystemGenome, microbial, counts.flora, defs?.flora);
        const fauna = this.generateFaunaPopulation(genome, ecosystemGenome, flora, counts.fauna, defs?.fauna);
        // Calculate ecosystem complexity
        const complexity = this.calculateComplexity(genome, microbial, flora, fauna);
        const diversity = this.calculateDiversity(microbial, flora, fauna);
        const stability = this.calculateStability(traits, complexity);
        // Determine relationships between organisms
        const relationships = this.generateRelationships(microbial, flora, fauna);
        // CHROMOSOME-DRIVEN: Counts already calculated above
        const { carryingCapacity } = counts;
        // NAVIGATION & ROUTING — derive from ch30/ch31 even at ecosystem tier
        // These chromosomes exist in L1 but are "latent" until civilization tier
        // We expose them here so even simple sites get routing guidance
        // Uses expanded routing types suitable for ALL complexity tiers
        const navigation = this.deriveNavigationGuidance(genome, complexity);
        return {
            environment: {
                genome,
                ecosystemGenome,
                habitabilityScore,
                carryingCapacity
            },
            organisms: {
                microbial,
                flora,
                fauna,
                total: microbial.length + flora.length + fauna.length
            },
            relationships,
            evolution: {
                complexity,
                diversity,
                stability,
                generations: Math.floor(complexity * 10)
            },
            civilizationReady: complexity >= 0.81,
            civilizationThreshold: 0.81,
            navigation
        };
    }
    /**
     * Derive navigation and routing guidance from L1 chromosomes (ch30, ch31).
     * These exist in the genome but are "latent" until civilization tier.
     * We expose them at ecosystem tier so even simple sites get routing guidance.
     */
    deriveNavigationGuidance(genome, complexity) {
        const ch30 = genome.chromosomes?.ch30_state_topology;
        const ch31 = genome.chromosomes?.ch31_routing_pattern;
        // Read actual chromosome values if present, otherwise derive from complexity
        const stateTopology = ch30?.topology ?? 'local';
        const routingPattern = ch31?.pattern ?? 'single_page';
        // Map complexity tier to expanded routing/state guidance (13 routing types)
        let routingPatternOut;
        let routingGuidance;
        let stateApproach;
        let stateGuidance;
        let complexityTier;
        if (complexity < 0.34) {
            // Prokaryotic/Protist tier — very simple, no JS frameworks
            const patterns = [
                { p: 'single_page', g: 'Pure HTML/CSS. Single scrollable page. Anchor links scroll to sections.' },
                { p: 'hash_anchor', g: 'URL hash controls scroll position. Users can share links to specific sections.' }
            ];
            const selected = routingPattern === 'hash_anchor' ? patterns[1] : patterns[0];
            routingPatternOut = selected.p;
            routingGuidance = selected.g;
            stateApproach = 'none';
            stateGuidance = 'No state management. Pure HTML/CSS. Any interactivity uses :checked pseudo-class or minimal JS.';
            complexityTier = 'abiotic/prokaryotic — simplest possible';
        }
        else if (complexity < 0.57) {
            // Bryophyte tier — simple with some interactivity, minimal JS
            const patterns = {
                'single_page': { p: 'single_page', g: 'One page with progressive disclosure. Accordions, tabs, or steppers.' },
                'hash_anchor': { p: 'hash_anchor', g: 'URL hash scrolls to sections. Good for long-form content with deep links.' },
                'hash_state': { p: 'hash_state', g: 'URL hash controls views (/#tab1, /#modal). Simple state machine via hashchange.' },
                'query_param': { p: 'query_param', g: 'Query params drive state (?view=grid). Good for shareable filter states.' },
                'tab_panel': { p: 'tab_panel', g: 'Tabbed interface as primary nav. Each tab is a "page" without route changes.' },
                'accordion_stack': { p: 'accordion_stack', g: 'Accordion sections expand/collapse. URL hash tracks open section.' },
                'carousel_slide': { p: 'carousel_slide', g: 'Slide-based navigation with URL hash (/#slide-1, /#slide-2).' }
            };
            const selected = patterns[routingPattern] ?? patterns['hash_state'];
            routingPatternOut = selected.p;
            routingGuidance = selected.g;
            stateApproach = 'minimal';
            stateGuidance = 'Minimal state: URL hash/query drives view, or CSS :target. No state library needed.';
            complexityTier = 'bryophyte — simple but living';
        }
        else if (complexity < 0.81) {
            // Vascular flora / invertebrate fauna tier — complex components, SPA patterns
            const patterns = {
                'hash_state': { p: 'hash_state', g: 'Hash-based SPA views. No server config needed. Good for static hosting.' },
                'spa_history': { p: 'spa_history', g: 'History API (pushState) for clean URLs. Requires server fallback to index.html.' },
                'multi_page': { p: 'multi_page', g: 'Separate HTML files. Traditional server-rendered pages with links.' },
                'modal_overlay': { p: 'modal_overlay', g: 'Routes open as modals over current page. Deep linking to modal state.' },
                'nested': { p: 'nested', g: 'Parent/child routes like /dashboard/settings. Layout persistence.' },
                'wizard_step': { p: 'wizard_step', g: 'Sequential step flow with progress. Can go back/forward through steps.' },
                'sidebar_drawer': { p: 'sidebar_drawer', g: 'Collapsible sidebar + drawer navigation. Good for documentation, dashboards.' },
                'breadcrumb_trail': { p: 'breadcrumb_trail', g: 'Deep category hierarchies with breadcrumbs. E-commerce, file explorers.' }
            };
            const selected = patterns[routingPattern] ?? patterns['spa_history'];
            routingPatternOut = selected.p;
            routingGuidance = selected.g;
            stateApproach = 'component';
            stateGuidance = 'Component-level state (useState). Some shared state via props or lightweight context.';
            complexityTier = 'vascular/invertebrate — complex organisms';
        }
        else {
            // Civilization tier — full architecture (tribal+) with 28 routing types
            const patterns = {
                // Core SPA patterns
                'spa_history': { p: 'spa_history', g: 'Full SPA with History API. Clean URLs, code-splitting, lazy loading.' },
                'nested': { p: 'nested', g: 'Deeply nested routes with layouts. Breadcrumbs, persistent navigation.' },
                'sidebar_drawer': { p: 'sidebar_drawer', g: 'Persistent sidebar + collapsible drawer pattern. Complex admin interfaces.' },
                'breadcrumb_trail': { p: 'breadcrumb_trail', g: 'Deep hierarchies with breadcrumb navigation. E-commerce categories, org charts.' },
                // Authentication & authorization
                'protected': { p: 'protected', g: 'Auth guards on routes. Login wall for restricted content.' },
                'role_based': { p: 'role_based', g: 'Route access controlled by user roles (admin, editor, viewer, guest).' },
                'permission_matrix': { p: 'permission_matrix', g: 'Granular permissions per route AND action. Can view but not edit, etc.' },
                // Multi-tenancy & internationalization
                'i18n_locale': { p: 'i18n_locale', g: 'Locale-prefixed routes (/en/about, /fr/about). SEO-friendly i18n.' },
                'subdomain': { p: 'subdomain', g: 'Tenant routing via subdomain (acme.app.com, widgets.app.com).' },
                'path_tenant': { p: 'path_tenant', g: 'Tenant routing via path (/acme/dashboard, /widgets/dashboard).' },
                // Micro-frontends & platform
                'platform': { p: 'platform', g: 'Micro-frontend shell with lazy-loaded remotes. Independent deployments.' },
                'federated': { p: 'federated', g: 'Cross-app navigation. Multiple apps share routing state. Module Federation.' },
                'micro_frontend': { p: 'micro_frontend', g: 'Independent deployable frontend fragments. Team autonomy, shared shell.' },
                // Dynamic & data-driven
                'dynamic_route': { p: 'dynamic_route', g: 'Routes generated from CMS/database. Marketing pages, user-generated content.' },
                'ai_adaptive': { p: 'ai_adaptive', g: 'Routes adapt based on user behavior/ML. Personalized navigation paths.' },
                // Advanced synchronization
                'session_replay': { p: 'session_replay', g: 'Full session state in URL for sharing/replay. Collaborative debugging.' },
                'realtime_sync': { p: 'realtime_sync', g: 'Routes sync across clients in real-time. Multiplayer editing, live cursors.' },
                // Edge & security
                'edge_routing': { p: 'edge_routing', g: 'Edge-computed routing (Cloudflare Workers, Vercel Edge). Geo-routing, A/B.' },
                'blockchain_verified': { p: 'blockchain_verified', g: 'Route access verified via on-chain state. Token-gated communities, NFT access.' },
                'zero_knowledge': { p: 'zero_knowledge', g: 'Privacy-preserving route authorization. Prove access without revealing identity.' },
                'quantum_resistant': { p: 'quantum_resistant', g: 'Post-quantum cryptographic route protection. Future-proof security.' }
            };
            const selected = patterns[routingPattern] ?? patterns['spa_history'];
            routingPatternOut = selected.p;
            routingGuidance = selected.g;
            // Extended state approaches for civilization tier
            stateApproach = stateTopology === 'federated' ? 'federated'
                : stateTopology === 'distributed' ? 'distributed'
                    : stateTopology === 'reactive_store' ? 'store'
                        : stateTopology === 'shared_context' ? 'context'
                            : 'component';
            stateGuidance = stateApproach === 'federated'
                ? 'Federated state across micro-frontends. Shared context + isolated stores.'
                : stateApproach === 'distributed'
                    ? 'Distributed state (Zustand, Redux, Pinia). Cross-tab sync, server persistence.'
                    : stateApproach === 'store'
                        ? 'Global state store (Zustand/Redux/Pinia). State spans routes and surfaces.'
                        : stateApproach === 'context'
                            ? 'React Context for shared state across component tree.'
                            : 'Component-level state with composition patterns.';
            complexityTier = 'civilization tier — full architecture (28 routing types available)';
        }
        return {
            routingPattern: routingPatternOut,
            routingGuidance,
            stateApproach,
            stateGuidance,
            complexityTier,
            note: `Derived from ch30 (state: ${stateTopology}) and ch31 (routing: ${routingPattern}). Available at ALL tiers — not just civilization.`
        };
    }
    /**
     * HASH-DRIVEN: Select which organism types exist in this ecosystem.
     * Not all sites have the same anatomy - navigation might not exist,
     * or might be replaced by constellation_nav, etc.
     */
    selectOrganismTypes(genome, category, maxCount) {
        const registry = ORGANISM_REGISTRY[category];
        const selected = [];
        // Use genome hash to determine which organisms exist
        // Each organism has a presence probability based on hash bytes
        const hash = genome.dnaHash;
        for (let i = 0; i < registry.length && selected.length < maxCount; i++) {
            // Use different parts of hash for each organism decision
            const byteIndex = (i * 2) % 32;
            const byteValue = parseInt(hash.slice(byteIndex * 2, byteIndex * 2 + 2), 16);
            // Threshold varies by organism category and ecosystem needs
            // Some organisms are more likely than others based on genome traits
            const threshold = category === 'flora' && registry[i] === 'navigation'
                ? 128 // 50% chance of navigation in flora
                : category === 'fauna' && registry[i] === 'structure'
                    ? 100 // 40% chance of structure shell
                    : 180; // ~70% chance for others
            if (byteValue > threshold) {
                selected.push(registry[i]);
            }
        }
        // Ensure at least some organisms exist
        if (selected.length === 0 && maxCount > 0) {
            const fallbackIndex = parseInt(hash.slice(0, 2), 16) % registry.length;
            selected.push(registry[fallbackIndex]);
        }
        return selected;
    }
    // === MICROBIAL COLONY ===
    // Atomic components: LLM-named when definitions provided, topology-derived as fallback
    // HASH-DRIVEN: Which microbes exist depends on genome, not template
    generateMicrobialColony(genome, eco, count, definitions) {
        const organisms = [];
        const baseEntropy = genome.chromosomes.ch12_signature.entropy;
        const mutationRate = eco.chromosomes.eco_ch11_mutation.rate;
        // HASH-DRIVEN: Select which organism types exist
        const organismTypes = this.selectOrganismTypes(genome, 'microbial', count);
        const patterns = TOPOLOGY_PATTERNS.microbial;
        for (let i = 0; i < organismTypes.length; i++) {
            const mutation = this.generateMutation(genome, i);
            const def = definitions?.[i];
            // Find pattern for this organism type
            const organismId = organismTypes[i];
            const pattern = patterns.find(p => p.prefix === organismId) || patterns[i % patterns.length];
            const variantCount = Math.floor(this.deriveFromHash(mutation, 4)) + 2;
            const variants = this.generateVariantNames(pattern.patterns, variantCount, mutation);
            const name = def?.name ?? this.deriveOrganismName(pattern.prefix, mutation, i, 'microbial');
            organisms.push({
                id: `M-${i}-${organismId}`,
                name,
                purpose: def?.purpose ?? '',
                category: 'microbial',
                spec: this.createComponentSpec(name, variants, 'microbial', genome),
                adaptation: {
                    mutation,
                    entropy: baseEntropy * (1 + i * 0.05) * (0.5 + mutationRate),
                    generation: 1
                },
                characteristics: {
                    colorTreatment: this.deriveColorTreatment(genome, i),
                    motionStyle: this.deriveMotionStyle(genome, 'microbial'),
                    scale: this.deriveScale(genome, 'micro', 'microbial'),
                    texture: this.deriveTexture(genome)
                },
                topology: {
                    containmentDepth: 0, // Microbes have no children
                    edgeProfile: genome.chromosomes.ch7_edge.componentRadius / 32,
                    motionComplexity: genome.chromosomes.ch8_motion.physics === 'none' ? 0 :
                        genome.chromosomes.ch8_motion.physics === 'spring' ? 0.8 : 0.4,
                    interactionPattern: genome.chromosomes.ch8_motion.physics
                },
                relationships: {
                    symbiosis: this.findSymbioticMicrobes(i, count),
                    prey: undefined,
                    predator: i < 3 ? undefined : `F-${Math.floor(i / 3)}`
                }
            });
        }
        return organisms;
    }
    // === FLORA ECOSYSTEM ===
    // Growing components: LLM-named when definitions provided, topology-derived as fallback
    // HASH-DRIVEN: Which flora types exist depends on genome
    generateFloraEcosystem(genome, eco, microbial, count, definitions) {
        const organisms = [];
        const baseEntropy = genome.chromosomes.ch12_signature.entropy;
        const symbiosisDepth = eco.chromosomes.eco_ch3_symbiosis.depth;
        const trophicCascade = eco.chromosomes.eco_ch4_trophic.cascade;
        const mutationRate = eco.chromosomes.eco_ch11_mutation.rate;
        // HASH-DRIVEN: Select which organism types exist
        const organismTypes = this.selectOrganismTypes(genome, 'flora', count);
        const patterns = TOPOLOGY_PATTERNS.flora;
        for (let i = 0; i < organismTypes.length; i++) {
            const mutation = this.generateMutation(genome, i + 100);
            const def = definitions?.[i];
            // Find pattern for this organism type
            const organismId = organismTypes[i];
            const pattern = patterns.find(p => p.prefix === organismId) || patterns[i % patterns.length];
            const variantCount = Math.floor(this.deriveFromHash(mutation, 5)) + 2;
            const variants = this.generateVariantNames(pattern.patterns, variantCount, mutation);
            const name = def?.name ?? this.deriveOrganismName(pattern.prefix, mutation, i, 'flora');
            // CHROMOSOME-DRIVEN: trophic cascade modulates how many microbes this flora contains
            const preyCount = Math.min(4, Math.floor(this.deriveFromHash(mutation, 4) * (1 + trophicCascade)) + 1);
            const prey = [];
            for (let p = 0; p < preyCount && p < microbial.length; p++) {
                const microIndex = Math.floor(this.deriveFromHash(mutation + p, microbial.length));
                prey.push(microbial[microIndex]?.id || `M-${p}`);
            }
            organisms.push({
                id: `F-${i}-${organismId}`,
                name,
                purpose: def?.purpose ?? '',
                category: 'flora',
                spec: this.createComponentSpec(name, variants, 'flora', genome),
                adaptation: {
                    mutation,
                    entropy: baseEntropy * (1.2 + i * 0.08) * (0.5 + mutationRate),
                    generation: 2
                },
                characteristics: {
                    colorTreatment: this.deriveColorTreatment(genome, i + 100),
                    motionStyle: this.deriveMotionStyle(genome, 'flora'),
                    scale: this.deriveScale(genome, 'medium', 'flora'),
                    texture: this.deriveTexture(genome)
                },
                topology: {
                    containmentDepth: Math.max(1, Math.round(1 + symbiosisDepth)), // eco_ch3_symbiosis.depth drives nesting depth
                    edgeProfile: genome.chromosomes.ch7_edge.radius / 32,
                    motionComplexity: genome.chromosomes.ch8_motion.physics === 'spring' ? 0.6 : 0.3,
                    interactionPattern: `${genome.chromosomes.ch8_motion.physics}-container`
                },
                relationships: {
                    symbiosis: this.findSymbioticFlora(i, count),
                    prey: [...new Set(prey)], // Deduplicate
                    predator: i < 4 ? `A-${Math.floor(i / 2)}` : undefined
                }
            });
        }
        return organisms;
    }
    // === FAUNA POPULATION ===
    // Complex moving components: LLM-named when definitions provided, topology-derived as fallback
    // HASH-DRIVEN: Which fauna types exist depends on genome
    generateFaunaPopulation(genome, eco, flora, count, definitions) {
        const organisms = [];
        const baseEntropy = genome.chromosomes.ch12_signature.entropy;
        const trophicCascade = eco.chromosomes.eco_ch4_trophic.cascade;
        const energyFlux = eco.chromosomes.eco_ch2_energy.flux;
        // HASH-DRIVEN: Select which organism types exist
        const organismTypes = this.selectOrganismTypes(genome, 'fauna', count);
        const patterns = TOPOLOGY_PATTERNS.fauna;
        for (let i = 0; i < organismTypes.length; i++) {
            const mutation = this.generateMutation(genome, i + 200);
            const def = definitions?.[i];
            // Find pattern for this organism type
            const organismId = organismTypes[i];
            const pattern = patterns.find(p => p.prefix === organismId) || patterns[i % patterns.length];
            const variantCount = Math.floor(this.deriveFromHash(mutation, 5)) + 2;
            const variants = this.generateVariantNames(pattern.patterns, variantCount, mutation);
            const name = def?.name ?? this.deriveOrganismName(pattern.prefix, mutation, i, 'fauna');
            // CHROMOSOME-DRIVEN: trophic cascade modulates how many flora this fauna orchestrates
            const preyCount = Math.min(5, Math.floor(this.deriveFromHash(mutation, 5) * (1 + trophicCascade)) + 2);
            const prey = [];
            for (let p = 0; p < preyCount && p < flora.length; p++) {
                const floraIndex = Math.floor(this.deriveFromHash(mutation + p, flora.length));
                prey.push(flora[floraIndex]?.id || `F-${p}`);
            }
            organisms.push({
                id: `A-${i}-${organismId}`,
                name,
                purpose: def?.purpose ?? '',
                category: 'fauna',
                spec: this.createComponentSpec(name, variants, 'fauna', genome),
                adaptation: {
                    mutation,
                    entropy: baseEntropy * (1.5 + i * 0.1) * (0.5 + energyFlux),
                    generation: 3
                },
                characteristics: {
                    colorTreatment: 'neutral',
                    motionStyle: this.deriveMotionStyle(genome, 'fauna'),
                    scale: this.deriveScale(genome, 'large', 'fauna'),
                    texture: this.deriveTexture(genome)
                },
                topology: {
                    containmentDepth: 2, // Fauna contain flora which contain microbes
                    edgeProfile: genome.chromosomes.ch7_edge.radius / 32,
                    motionComplexity: genome.chromosomes.ch15_biomarker.complexity > 0.7 ? 0.9 : 0.6,
                    interactionPattern: `${genome.chromosomes.ch8_motion.physics}-orchestrator`
                },
                relationships: {
                    symbiosis: this.findSymbioticFauna(i, count),
                    prey: [...new Set(prey)],
                    predator: undefined
                }
            });
        }
        return organisms;
    }
    // === TOPOLOGY-DERIVED NAMING ===
    /**
     * Derive organism name from topology signature
     * NOT from a hardcoded template list
     */
    deriveOrganismName(prefix, mutation, index, category) {
        // Use mutation hash to select suffix
        const suffixes = {
            microbial: ['Atom', 'Bit', 'Unit', 'Cell', 'Node', 'Point'],
            flora: ['Pod', 'Cluster', 'Group', 'Set', 'Bundle', 'Block'],
            fauna: ['Stack', 'Flow', 'Chain', 'Array', 'Grid', 'Tree']
        };
        const hash = parseInt(mutation.slice(0, 4), 16);
        const suffix = suffixes[category][hash % suffixes[category].length];
        // Capitalize prefix + suffix
        const capitalizedPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1);
        return `${capitalizedPrefix}${suffix}`;
    }
    /**
     * Generate variant names from pattern pool
     * NOT from hardcoded arrays
     */
    generateVariantNames(patterns, count, mutation) {
        const variants = [];
        const hash = parseInt(mutation.slice(0, 8), 16);
        for (let i = 0; i < count && i < patterns.length; i++) {
            const index = (hash + i) % patterns.length;
            variants.push(patterns[index]);
        }
        // Add state variants based on mutation
        const states = ['default', 'active', 'disabled', 'loading'];
        const stateIndex = hash % states.length;
        if (!variants.includes(states[stateIndex])) {
            variants.push(states[stateIndex]);
        }
        return variants;
    }
    /**
     * Derive value from hash string (0-1 range)
     */
    deriveFromHash(hash, max) {
        const num = parseInt(hash.slice(0, 4), 16);
        return (num / 65536) * max;
    }
    // === RELATIONSHIP GENERATION ===
    generateRelationships(microbial, flora, fauna) {
        const relationships = [];
        // Containment relationships (already defined in organisms)
        for (const org of [...microbial, ...flora, ...fauna]) {
            if (org.relationships.prey) {
                for (const preyId of org.relationships.prey) {
                    relationships.push({
                        type: 'containment',
                        organisms: [org.id, preyId],
                        pattern: `${org.name} contains ${preyId}`,
                        example: `<${org.name}><${preyId} /></${org.name}>`
                    });
                }
            }
        }
        // Symbiosis relationships
        for (const org of [...microbial, ...flora, ...fauna]) {
            for (const symId of org.relationships.symbiosis) {
                relationships.push({
                    type: 'symbiosis',
                    organisms: [org.id, symId],
                    pattern: `${org.name} + ${symId} work together`,
                    example: `<${org.name} /><${symId} />`
                });
            }
        }
        // Sequence patterns
        if (microbial.length > 0 && flora.length > 0) {
            relationships.push({
                type: 'sequence',
                organisms: [microbial[0].id, flora[0].id],
                pattern: 'Action triggers input',
                example: `<${microbial[0].name} onClick={() => ${flora[0].name}Ref.focus()} />`
            });
        }
        if (flora.length > 5) {
            relationships.push({
                type: 'sequence',
                organisms: [flora[2].id, flora[5].id],
                pattern: 'Selection populates list',
                example: `<${flora[2].name} onSelect={item => setList([...list, item])} />`
            });
        }
        return relationships;
    }
    // === HELPER METHODS ===
    createComponentSpec(name, variants, category, genome) {
        const baseProps = [
            { name: 'className', type: 'string', required: false },
            { name: 'style', type: 'CSSProperties', required: false }
        ];
        // Add category-specific props
        const categoryProps = {
            microbial: [
                { name: 'onClick', type: '() => void', required: false },
                { name: 'disabled', type: 'boolean', required: false, default: false }
            ],
            flora: [
                { name: 'value', type: 'string | string[]', required: true },
                { name: 'onChange', type: '(value: any) => void', required: true },
                { name: 'error', type: 'string', required: false }
            ],
            fauna: [
                { name: 'isOpen', type: 'boolean', required: true },
                { name: 'onClose', type: '() => void', required: true },
                { name: 'title', type: 'string', required: false }
            ]
        };
        const ariaProps = {
            microbial: ['aria-label', 'aria-pressed', 'aria-disabled'],
            flora: ['aria-expanded', 'aria-haspopup', 'aria-activedescendant'],
            fauna: ['aria-modal', 'aria-labelledby', 'aria-describedby']
        };
        const keyboard = {
            microbial: ['Enter', 'Space'],
            flora: ['Tab', 'ArrowKeys', 'Enter', 'Escape'],
            fauna: ['Tab', 'Escape', 'ArrowKeys']
        };
        return {
            name,
            category: category === 'microbial' ? 'input' : category === 'flora' ? 'feedback' : 'overlay',
            props: [...baseProps, ...categoryProps[category]],
            variants,
            accessibility: {
                role: category === 'microbial' ? 'button' : category === 'flora' ? 'region' : 'dialog',
                ariaProps: ariaProps[category],
                keyboard: keyboard[category]
            }
        };
    }
    generateMutation(genome, index) {
        const baseMutation = genome.chromosomes.ch12_signature.uniqueMutation;
        const variantSeed = `${genome.dnaHash}-${index}`;
        let hash = 0;
        for (let i = 0; i < variantSeed.length; i++) {
            const char = variantSeed.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).slice(0, 8);
    }
    deriveColorTreatment(genome, index) {
        // Use ch26_color_system if available, fallback to ch5
        const cs = genome.chromosomes.ch26_color_system;
        if (cs) {
            const treatments = ['primary', 'secondary', 'accent', 'neutral'];
            // Hash-derived from secondary color relationship
            const relationshipSeed = cs.secondary.relationship === "complementary" ? 0 :
                cs.secondary.relationship === "analogous" ? 1 :
                    cs.secondary.relationship === "split" ? 2 : 3;
            return treatments[(relationshipSeed + index) % 4];
        }
        // Fallback to ch5
        const hue = genome.chromosomes.ch5_color_primary.hue;
        const treatments = ['primary', 'secondary', 'accent', 'neutral'];
        const quadrant = Math.floor(hue / 90);
        return treatments[(quadrant + index) % 4];
    }
    deriveMotionStyle(genome, category) {
        // Prefer ch27_motion_choreography if available
        const mc = genome.chromosomes.ch27_motion_choreography;
        if (mc) {
            if (mc.choreographyStyle === "elegant" || mc.choreographyStyle === "smooth")
                return 'subtle';
            if (mc.choreographyStyle === "energetic" || mc.choreographyStyle === "snappy")
                return 'active';
            if (mc.choreographyStyle === "dramatic")
                return 'complex';
        }
        // Fallback to ch8
        const physics = genome.chromosomes.ch8_motion.physics;
        const complexity = genome.chromosomes.ch15_biomarker.complexity;
        if (physics === 'none')
            return 'none';
        if (category === 'microbial')
            return 'subtle';
        if (category === 'flora' && physics === 'spring')
            return 'subtle';
        if (category === 'fauna' && complexity > 0.7)
            return 'complex';
        return 'active';
    }
    deriveScale(genome, baseScale, category) {
        const density = genome.chromosomes.ch2_rhythm.density;
        const radius = genome.chromosomes.ch7_edge.radius;
        if (density === 'airtight' && radius < 5)
            return 'micro';
        if (density === 'maximal' && radius > 15)
            return 'large';
        if (category === 'fauna')
            return 'large';
        if (category === 'microbial' && density === 'empty')
            return 'micro';
        return baseScale;
    }
    deriveTexture(genome) {
        const material = genome.chromosomes.ch14_physics.material;
        const elevation = genome.chromosomes.ch10_hierarchy.elevationSystem;
        if (material === 'glass')
            return 'glass';
        if (material === 'neumorphism' || elevation === 'neumorphic')
            return 'elevated';
        if (material === 'metallic')
            return 'material';
        return 'flat';
    }
    /**
     * Generate icon organisms from ch28_iconography
     * Icons are microbial organisms with specific characteristics
     */
    generateIconOrganisms(genome) {
        const iconography = genome.chromosomes.ch28_iconography;
        if (!iconography)
            return [];
        const organisms = [];
        const count = Math.floor(iconography.sizeScale * 8) + 4; // 4-16 icons based on scale
        for (let i = 0; i < count; i++) {
            const mutation = this.generateMutation(genome, i + 1000);
            organisms.push({
                id: `I-${i}`,
                name: `Icon${iconography.style.charAt(0).toUpperCase() + iconography.style.slice(1)}-${i}`,
                purpose: `${iconography.style} icon using ${iconography.library} at ${iconography.strokeWeight} stroke weight`,
                category: 'microbial',
                spec: {
                    name: `icon-${i}`,
                    category: 'input',
                    props: [
                        { name: 'name', type: 'string', required: true },
                        { name: 'size', type: 'number', required: false, default: iconography.sizeScale },
                        { name: 'strokeWidth', type: 'number', required: false, default: iconography.strokeWeight === 'thin' ? 1 : iconography.strokeWeight === 'bold' ? 3 : 2 }
                    ],
                    variants: [iconography.style, iconography.cornerTreatment, `${iconography.animation}`],
                    accessibility: {
                        role: 'img',
                        ariaProps: ['aria-label', 'aria-hidden'],
                        keyboard: []
                    }
                },
                adaptation: {
                    mutation,
                    entropy: genome.chromosomes.ch12_signature.entropy * 0.5,
                    generation: 1
                },
                characteristics: {
                    colorTreatment: iconography.colorTreatment === 'inherit' ? 'neutral' :
                        iconography.colorTreatment === 'primary' ? 'primary' :
                            iconography.colorTreatment === 'secondary' ? 'secondary' : 'accent',
                    motionStyle: iconography.animation === 'none' ? 'none' : 'subtle',
                    scale: iconography.sizeScale < 1 ? 'small' : iconography.sizeScale > 1.2 ? 'medium' : 'micro',
                    texture: 'flat'
                },
                topology: {
                    containmentDepth: 0,
                    edgeProfile: iconography.cornerTreatment === 'sharp' ? 0 :
                        iconography.cornerTreatment === 'rounded' ? 0.5 : 1,
                    motionComplexity: iconography.animation === 'none' ? 0 :
                        iconography.animation === 'draw' ? 0.8 : 0.4,
                    interactionPattern: `${iconography.library}-icon`
                },
                relationships: {
                    symbiosis: [],
                    prey: [],
                    predator: undefined
                }
            });
        }
        return organisms;
    }
    findSymbioticMicrobes(index, total) {
        const symbiosis = [];
        // Each microbe symbioses with 1-2 neighbors
        if (index > 0)
            symbiosis.push(`M-${index - 1}`);
        if (index < total - 1)
            symbiosis.push(`M-${index + 1}`);
        return symbiosis;
    }
    findSymbioticFlora(index, total) {
        const symbiosis = [];
        // Flora symbioses with adjacent flora
        if (index > 0)
            symbiosis.push(`F-${index - 1}`);
        if (index < total - 1)
            symbiosis.push(`F-${index + 1}`);
        return symbiosis;
    }
    findSymbioticFauna(index, total) {
        const symbiosis = [];
        // Fauna symbioses with adjacent fauna
        if (index > 0)
            symbiosis.push(`A-${index - 1}`);
        if (index < total - 1)
            symbiosis.push(`A-${index + 1}`);
        return symbiosis;
    }
    calculateHabitability(traits) {
        const density = 1 - Math.abs(traits.informationDensity - 0.7);
        const temperature = 1 - Math.abs(traits.emotionalTemperature - 0.5);
        const stability = 1 - traits.playfulness;
        return (density * 0.4 + temperature * 0.3 + stability * 0.3);
    }
    calculateOrganismCounts(genome, options) {
        const ch = genome.chromosomes;
        const comp = ch.ch15_biomarker.complexity; // 0.0–1.0, drives tier scaling
        // Organism counts scale with complexity tier — biology before civilization.
        // Microbial first appears at prokaryotic (0.11), scales to 16 at endotherm (0.80).
        // Flora first appears at bryophyte (0.34), scales to 12 at endotherm (0.80).
        // Fauna first appears at invertebrate_fauna (0.57), scales to 10 at endotherm (0.80).
        const baseMicrobial = comp < 0.11
            ? 0
            : Math.min(16, Math.floor(2 + ((comp - 0.11) / 0.69) * 14));
        const baseFlora = comp < 0.34
            ? 0
            : Math.min(12, Math.floor(((comp - 0.34) / 0.46) * 12));
        const baseFauna = comp < 0.57
            ? 0
            : Math.min(10, Math.floor(((comp - 0.57) / 0.23) * 10));
        const topologyMultiplier = ch.ch1_structure.topology === 'graph' ? 1.3 :
            ch.ch1_structure.topology === 'radial' ? 1.2 : 1.0;
        const total = baseMicrobial + baseFlora + baseFauna;
        const carryingCapacity = Math.min(1, (total / 38) * topologyMultiplier);
        return {
            microbial: options?.microbialCount ?? baseMicrobial,
            flora: options?.floraCount ?? baseFlora,
            fauna: options?.faunaCount ?? baseFauna,
            carryingCapacity
        };
    }
    calculateComplexity(genome, microbial, flora, fauna) {
        const baseComplexity = genome.chromosomes.ch15_biomarker.complexity;
        const organismCount = (microbial.length + flora.length + fauna.length) / 30;
        const entropyFactor = genome.chromosomes.ch12_signature.entropy;
        return Math.min(1, baseComplexity * 0.4 + organismCount * 0.4 + entropyFactor * 0.2);
    }
    calculateDiversity(microbial, flora, fauna) {
        const totalVariants = [...microbial, ...flora, ...fauna]
            .reduce((sum, org) => sum + org.spec.variants.length, 0);
        return Math.min(1, totalVariants / 100);
    }
    calculateStability(traits, complexity) {
        const volatility = traits.playfulness * complexity;
        return Math.max(0, 1 - volatility);
    }
}
export const ecosystemGenerator = new EcosystemGenerator();
