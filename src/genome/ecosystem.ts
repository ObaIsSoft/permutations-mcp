/**
 * Genome MCP - Ecosystem Generator
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

import { DesignGenome, ContentTraits } from "./types.js";
import { ComponentSpec } from "./civilization.js";
import { EcosystemGenome } from "./ecosystem-types.js";
import { sequenceEcosystemGenome } from "./ecosystem-sequencer.js";

// LLM-supplied identity for an organism — product-specific name and purpose
export interface OrganismDefinition {
    name: string;    // PascalCase component name specific to this product (e.g. PriceCell, PatientCard)
    purpose: string; // One sentence: what the user sees or does with this component
}

// Organism = Component that lives in the ecosystem
export interface Organism {
    id: string;
    name: string;    // Product-specific name supplied by LLM semantic analysis
    purpose: string; // What this component does — populated by LLM, empty string in fallback
    category: 'microbial' | 'flora' | 'fauna';
    // Component specification (props, variants, accessibility)
    spec: ComponentSpec;
    // How this organism adapts to the environment
    adaptation: {
        mutation: string;           // Unique trait from genome signature
        entropy: number;           // How much it varies from base
        generation: number;        // Evolutionary generation
    };
    // Visual/behavioral characteristics derived from genome
    characteristics: {
        colorTreatment: 'primary' | 'secondary' | 'accent' | 'neutral';
        motionStyle: 'none' | 'subtle' | 'active' | 'complex';
        scale: 'micro' | 'small' | 'medium' | 'large';
        texture: 'flat' | 'elevated' | 'glass' | 'material';
    };
    // Topology signature - the mathematical identity of this organism
    topology: {
        containmentDepth: number;  // Derived from ch1_structure
        edgeProfile: number;       // Derived from ch7_edge
        motionComplexity: number;  // Derived from ch8_motion
        interactionPattern: string; // Derived from physics + traits
    };
    // Relationships with other organisms
    relationships: {
        symbiosis: string[];       // Organisms it commonly pairs with
        predator?: string;         // Larger organism that contains this
        prey?: string[];           // Smaller organisms it contains
    };
}

// Relationship patterns between organisms
export interface OrganismRelationship {
    type: 'symbiosis' | 'containment' | 'sequence' | 'alternation';
    organisms: [string, string];  // IDs of related organisms
    pattern: string;              // How they relate
    example: string;              // Usage example
}

// The complete ecosystem
export interface Ecosystem {
    environment: {
        genome: DesignGenome;               // Shared DNA (not multiple genomes)
        ecosystemGenome: EcosystemGenome;   // Layer 2 genome derived from design genome
        habitabilityScore: number;          // 0-1 how well traits support life
        carryingCapacity: number;           // Max complexity supported
    };
    organisms: {
        microbial: Organism[];     // atomic components — count scales with complexity tier
        flora: Organism[];         // growing components — emerge at bryophyte (0.34+)
        fauna: Organism[];         // complex components — emerge at invertebrate_fauna (0.57+)
        total: number;
    };
    relationships: OrganismRelationship[];
    evolution: {
        complexity: number;        // Overall ecosystem complexity
        diversity: number;         // Range of adaptations
        stability: number;         // 1 - extinctionRisk
        generations: number;
    };
    // Path to civilization
    civilizationReady: boolean;    // complexity >= 0.81 (tribal tier threshold)
    civilizationThreshold: number; // 0.81
    // Navigation & routing guidance — available at ALL tiers, not just civilization
    // 28 routing types covering everything from simple anchors to quantum-resistant routing
    navigation: {
        routingPattern: 
            // Tier 1: Simple (< 0.34)
            | 'single_page' | 'hash_anchor' | 'hash_state' | 'query_param'
            // Tier 2: Component (0.34–0.56)
            | 'tab_panel' | 'accordion_stack' | 'carousel_slide'
            // Tier 3: SPA (0.57–0.80)
            | 'multi_page' | 'spa_history' | 'modal_overlay' | 'wizard_step' 
            | 'nested' | 'sidebar_drawer' | 'breadcrumb_trail'
            // Tier 4: Civilization (≥ 0.81)
            | 'protected' | 'role_based' | 'permission_matrix' | 'dynamic_route'
            | 'i18n_locale' | 'subdomain' | 'path_tenant' | 'platform' | 'federated'
            | 'micro_frontend' | 'edge_routing' | 'ai_adaptive' | 'session_replay'
            | 'realtime_sync' | 'blockchain_verified' | 'zero_knowledge' | 'quantum_resistant';
        routingGuidance: string;
        stateApproach: 'none' | 'minimal' | 'component' | 'context' | 'store' | 'federated' | 'distributed';
        stateGuidance: string;
        complexityTier: string;
        note: string;
    };
}

/**
 * Generates a complete ecosystem of design components
 * All organisms share ONE genome (the environment)
 */
export class EcosystemGenerator {
    generate(
        seed: string,
        traits: ContentTraits,
        options?: {
            microbialCount?: number;   // 0–18, overrides tier-scaled default
            floraCount?: number;       // 0–12, overrides tier-scaled default
            faunaCount?: number;       // 0–10, overrides tier-scaled default
            complexityTarget?: number; // 0–1
            primarySector?: string;    // sector override from caller
            /**
             * Pre-existing L1 DesignGenome from a prior generate_design_genome call.
             *
             * When provided, skips internal L1 regeneration — the ecosystem uses
             * this genome directly so that L2 gravity reads the SAME chromosome
             * values the user already has, not a newly-derived child genome.
             *
             * Hash chain integrity is preserved: L2 hash still = sha256(genome.dnaHash).
             * The only difference is which L1 genome the gravity system reads from.
             *
             * Without this: L2 gravity uses sha256(dnaHash) chromosomes (L1_internal).
             * With this:    L2 gravity uses dnaHash chromosomes (L1_original) — correct.
             * 
             * FIX 7: Made required to prevent hash divergence. Caller MUST pass genome from generate_design_genome.
             */
            existingGenome: DesignGenome; // FIX 7: Required to prevent hash divergence
            // LLM-supplied organism identities — product-specific names and purposes.
            // When provided, overrides topology-derived abstract naming.
            // Falls back to TOPOLOGY_PATTERNS if empty or not supplied.
            organismsDefinition?: {
                microbial: OrganismDefinition[];
                flora:     OrganismDefinition[];
                fauna:     OrganismDefinition[];
            };
        }
    ): Ecosystem {
        // Derive sector from caller or infer from trait signature
        type InferrableSector = "technology" | "healthcare" | "fintech" | "commerce" | "education" | "entertainment" | "legal" | "manufacturing";
        let inferredSector: InferrableSector = "technology";
        if (options?.primarySector) {
            inferredSector = options.primarySector as InferrableSector;
        } else if (traits.trustRequirement > 0.7 && traits.emotionalTemperature > 0.6) {
            inferredSector = "healthcare";
        } else if (traits.trustRequirement > 0.7 && traits.emotionalTemperature < 0.4) {
            inferredSector = "fintech";
        } else if (traits.conversionFocus > 0.7 && traits.visualEmphasis > 0.6) {
            inferredSector = "commerce";
        } else if (traits.playfulness > 0.6 && traits.temporalUrgency < 0.4) {
            inferredSector = "entertainment";
        } else if (traits.informationDensity > 0.7 && traits.emotionalTemperature < 0.3) {
            inferredSector = "manufacturing";
        }

        // FIX 7: L1 genome — MUST be provided to maintain hash chain integrity.
        // Caller is responsible for passing genome from generate_design_genome.
        if (!options?.existingGenome) {
            throw new Error(
                "FIX 7: existingGenome is required. " +
                "Pass the full genome object from generate_design_genome to maintain hash chain continuity. " +
                "Do not call generate_ecosystem without a genome - this creates hash divergence."
            );
        }
        const genome = options.existingGenome;

        // Layer 2: sequence ecosystem genome from design genome.
        // Hash = sha256(genome.dnaHash) — chain integrity holds whether genome
        // is L1_original or L1_internal. Gravity reads genome.chromosomes directly.
        // Defensive: ensure chromosomes exist
        if (!genome.chromosomes) {
            throw new Error("Genome missing chromosomes. Ensure you pass the full genome object from generate_design_genome, not just dnaHash/traits.");
        }
        // Product complexity — trait-derived, same formula as server.ts estimatedCounts.
        // ch15_biomarker.complexity is 3D/WebGL complexity (0 when 3D disabled) and
        // must NOT be used here; it tells nothing about product information complexity.
        const productComplexity = Math.min(1,
            (traits.informationDensity ?? 0.5) * 0.6 +
            (traits.trustRequirement   ?? 0.5) * 0.2 +
            (traits.spatialDependency  ?? 0.5) * 0.2
        );
        const ecosystemGenome = sequenceEcosystemGenome(genome, productComplexity);

        // Calculate how well this environment supports life
        const habitabilityScore = this.calculateHabitability(traits);

        const counts = this.calculateOrganismCounts(productComplexity, genome, options);

        // Generate organisms from the shared environment.
        // LLM-supplied names and purposes are required.
        const defs = options?.organismsDefinition;
        if (!defs) {
            throw new Error("organismsDefinition is required. Call extractor.analyzeOrganisms() to get product-specific component names.");
        }
        const microbial = this.generateMicrobialColony(genome, ecosystemGenome, counts.microbial, defs.microbial);
        const flora = this.generateFloraEcosystem(genome, ecosystemGenome, microbial, counts.flora, defs.flora);
        const fauna = this.generateFaunaPopulation(genome, ecosystemGenome, flora, counts.fauna, defs.fauna);
        
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
    private deriveNavigationGuidance(
        genome: DesignGenome,
        complexity: number
    ): Ecosystem['navigation'] {
        const ch30 = genome.chromosomes?.ch30_state_topology;
        const ch31 = genome.chromosomes?.ch31_routing_pattern;
        
        // Read actual chromosome values if present, otherwise derive from complexity
        const stateTopology = ch30?.topology ?? 'local';
        const routingPattern = ch31?.pattern ?? 'single_page';
        
        // Map complexity tier to expanded routing/state guidance (13 routing types)
        let routingPatternOut: Ecosystem['navigation']['routingPattern'];
        let routingGuidance: string;
        let stateApproach: Ecosystem['navigation']['stateApproach'];
        let stateGuidance: string;
        let complexityTier: string;
        
        if (complexity < 0.34) {
            // Prokaryotic/Protist tier — very simple, no JS frameworks
            const patterns: Array<{p: typeof routingPatternOut, g: string}> = [
                { p: 'single_page', g: 'Pure HTML/CSS. Single scrollable page. Anchor links scroll to sections.' },
                { p: 'hash_anchor', g: 'URL hash controls scroll position. Users can share links to specific sections.' }
            ];
            const selected = routingPattern === 'hash_anchor' ? patterns[1] : patterns[0];
            routingPatternOut = selected.p;
            routingGuidance = selected.g;
            stateApproach = 'none';
            stateGuidance = 'No state management. Pure HTML/CSS. Any interactivity uses :checked pseudo-class or minimal JS.';
            complexityTier = 'abiotic/prokaryotic — simplest possible';
        } else if (complexity < 0.57) {
            // Bryophyte tier — simple with some interactivity, minimal JS
            const patterns: Record<string, {p: typeof routingPatternOut, g: string}> = {
                'single_page':      { p: 'single_page',      g: 'One page with progressive disclosure. Accordions, tabs, or steppers.' },
                'hash_anchor':      { p: 'hash_anchor',      g: 'URL hash scrolls to sections. Good for long-form content with deep links.' },
                'hash_state':       { p: 'hash_state',       g: 'URL hash controls views (/#tab1, /#modal). Simple state machine via hashchange.' },
                'query_param':      { p: 'query_param',      g: 'Query params drive state (?view=grid). Good for shareable filter states.' },
                'tab_panel':        { p: 'tab_panel',        g: 'Tabbed interface as primary nav. Each tab is a "page" without route changes.' },
                'accordion_stack':  { p: 'accordion_stack',  g: 'Accordion sections expand/collapse. URL hash tracks open section.' },
                'carousel_slide':   { p: 'carousel_slide',   g: 'Slide-based navigation with URL hash (/#slide-1, /#slide-2).' }
            };
            const selected = patterns[routingPattern] ?? patterns['hash_state'];
            routingPatternOut = selected.p;
            routingGuidance = selected.g;
            stateApproach = 'minimal';
            stateGuidance = 'Minimal state: URL hash/query drives view, or CSS :target. No state library needed.';
            complexityTier = 'bryophyte — simple but living';
        } else if (complexity < 0.81) {
            // Vascular flora / invertebrate fauna tier — complex components, SPA patterns
            const patterns: Record<string, {p: typeof routingPatternOut, g: string}> = {
                'hash_state':       { p: 'hash_state',       g: 'Hash-based SPA views. No server config needed. Good for static hosting.' },
                'spa_history':      { p: 'spa_history',      g: 'History API (pushState) for clean URLs. Requires server fallback to index.html.' },
                'multi_page':       { p: 'multi_page',       g: 'Separate HTML files. Traditional server-rendered pages with links.' },
                'modal_overlay':    { p: 'modal_overlay',    g: 'Routes open as modals over current page. Deep linking to modal state.' },
                'nested':           { p: 'nested',           g: 'Parent/child routes like /dashboard/settings. Layout persistence.' },
                'wizard_step':      { p: 'wizard_step',      g: 'Sequential step flow with progress. Can go back/forward through steps.' },
                'sidebar_drawer':   { p: 'sidebar_drawer',   g: 'Collapsible sidebar + drawer navigation. Good for documentation, dashboards.' },
                'breadcrumb_trail': { p: 'breadcrumb_trail', g: 'Deep category hierarchies with breadcrumbs. E-commerce, file explorers.' }
            };
            const selected = patterns[routingPattern] ?? patterns['spa_history'];
            routingPatternOut = selected.p;
            routingGuidance = selected.g;
            stateApproach = 'component';
            stateGuidance = 'Component-level state (useState). Some shared state via props or lightweight context.';
            complexityTier = 'vascular/invertebrate — complex organisms';
        } else {
            // Civilization tier — full architecture (tribal+) with 28 routing types
            const patterns: Record<string, {p: typeof routingPatternOut, g: string}> = {
                // Core SPA patterns
                'spa_history':          { p: 'spa_history',          g: 'Full SPA with History API. Clean URLs, code-splitting, lazy loading.' },
                'nested':               { p: 'nested',               g: 'Deeply nested routes with layouts. Breadcrumbs, persistent navigation.' },
                'sidebar_drawer':       { p: 'sidebar_drawer',       g: 'Persistent sidebar + collapsible drawer pattern. Complex admin interfaces.' },
                'breadcrumb_trail':     { p: 'breadcrumb_trail',     g: 'Deep hierarchies with breadcrumb navigation. E-commerce categories, org charts.' },
                
                // Authentication & authorization
                'protected':            { p: 'protected',            g: 'Auth guards on routes. Login wall for restricted content.' },
                'role_based':           { p: 'role_based',           g: 'Route access controlled by user roles (admin, editor, viewer, guest).' },
                'permission_matrix':    { p: 'permission_matrix',    g: 'Granular permissions per route AND action. Can view but not edit, etc.' },
                
                // Multi-tenancy & internationalization
                'i18n_locale':          { p: 'i18n_locale',          g: 'Locale-prefixed routes (/en/about, /fr/about). SEO-friendly i18n.' },
                'subdomain':            { p: 'subdomain',            g: 'Tenant routing via subdomain (acme.app.com, widgets.app.com).' },
                'path_tenant':          { p: 'path_tenant',          g: 'Tenant routing via path (/acme/dashboard, /widgets/dashboard).' },
                
                // Micro-frontends & platform
                'platform':             { p: 'platform',             g: 'Micro-frontend shell with lazy-loaded remotes. Independent deployments.' },
                'federated':            { p: 'federated',            g: 'Cross-app navigation. Multiple apps share routing state. Module Federation.' },
                'micro_frontend':       { p: 'micro_frontend',       g: 'Independent deployable frontend fragments. Team autonomy, shared shell.' },
                
                // Dynamic & data-driven
                'dynamic_route':        { p: 'dynamic_route',        g: 'Routes generated from CMS/database. Marketing pages, user-generated content.' },
                'ai_adaptive':          { p: 'ai_adaptive',          g: 'Routes adapt based on user behavior/ML. Personalized navigation paths.' },
                
                // Advanced synchronization
                'session_replay':       { p: 'session_replay',       g: 'Full session state in URL for sharing/replay. Collaborative debugging.' },
                'realtime_sync':        { p: 'realtime_sync',        g: 'Routes sync across clients in real-time. Multiplayer editing, live cursors.' },
                
                // Edge & security
                'edge_routing':         { p: 'edge_routing',         g: 'Edge-computed routing (Cloudflare Workers, Vercel Edge). Geo-routing, A/B.' },
                'blockchain_verified':  { p: 'blockchain_verified',  g: 'Route access verified via on-chain state. Token-gated communities, NFT access.' },
                'zero_knowledge':       { p: 'zero_knowledge',       g: 'Privacy-preserving route authorization. Prove access without revealing identity.' },
                'quantum_resistant':    { p: 'quantum_resistant',    g: 'Post-quantum cryptographic route protection. Future-proof security.' }
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
    
    // === MICROBIAL COLONY ===
    // Atomic components: LLM-named (definitions required)
    private generateMicrobialColony(genome: DesignGenome, eco: EcosystemGenome, count: number, definitions: OrganismDefinition[]): Organism[] {
        const organisms: Organism[] = [];
        const baseEntropy = genome.chromosomes.ch12_signature.entropy;
        const mutationRate = eco.chromosomes.eco_ch11_mutation.rate;

        for (let i = 0; i < Math.min(count, definitions.length); i++) {
            const mutation = this.generateMutation(genome, i);
            const def = definitions[i];

            organisms.push({
                id: `M-${i}-${def.name}`,
                name: def.name,
                purpose: def.purpose,
                category: 'microbial',
                spec: this.createComponentSpec(def.name, ['default', 'active', 'disabled'], 'microbial', genome),
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
                    containmentDepth: 0,
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
    // Growing components: LLM-named (definitions required)
    private generateFloraEcosystem(
        genome: DesignGenome,
        eco: EcosystemGenome,
        microbial: Organism[],
        count: number,
        definitions: OrganismDefinition[]
    ): Organism[] {
        const organisms: Organism[] = [];
        const baseEntropy = genome.chromosomes.ch12_signature.entropy;
        const symbiosisDepth = eco.chromosomes.eco_ch3_symbiosis.depth;
        const trophicCascade = eco.chromosomes.eco_ch4_trophic.cascade;
        const mutationRate = eco.chromosomes.eco_ch11_mutation.rate;

        for (let i = 0; i < Math.min(count, definitions.length); i++) {
            const mutation = this.generateMutation(genome, i + 100);
            const def = definitions[i];

            const preyCount = Math.min(4, Math.floor(mutationRate * 4 * (1 + trophicCascade)) + 1);
            const prey: string[] = [];
            for (let p = 0; p < preyCount && p < microbial.length; p++) {
                const microIndex = Math.floor((parseInt(mutation.slice(0, 4), 16) + p) % microbial.length);
                prey.push(microbial[microIndex]?.id || `M-${p}`);
            }
            
            organisms.push({
                id: `F-${i}-${def.name}`,
                name: def.name,
                purpose: def.purpose,
                category: 'flora',
                spec: this.createComponentSpec(def.name, ['default', 'active', 'disabled', 'loading'], 'flora', genome),
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
                    containmentDepth: Math.max(1, Math.round(1 + symbiosisDepth)),
                    edgeProfile: genome.chromosomes.ch7_edge.radius / 32,
                    motionComplexity: genome.chromosomes.ch8_motion.physics === 'spring' ? 0.6 : 0.3,
                    interactionPattern: `${genome.chromosomes.ch8_motion.physics}-container`
                },
                relationships: {
                    symbiosis: this.findSymbioticFlora(i, count),
                    prey: [...new Set(prey)],
                    predator: i < 4 ? `A-${Math.floor(i / 2)}` : undefined
                }
            });
        }
        
        return organisms;
    }
    
    // === FAUNA POPULATION ===
    // Complex moving components: LLM-named (definitions required)
    private generateFaunaPopulation(
        genome: DesignGenome,
        eco: EcosystemGenome,
        flora: Organism[],
        count: number,
        definitions: OrganismDefinition[]
    ): Organism[] {
        const organisms: Organism[] = [];
        const baseEntropy = genome.chromosomes.ch12_signature.entropy;
        const trophicCascade = eco.chromosomes.eco_ch4_trophic.cascade;
        const energyFlux = eco.chromosomes.eco_ch2_energy.flux;

        for (let i = 0; i < Math.min(count, definitions.length); i++) {
            const mutation = this.generateMutation(genome, i + 200);
            const def = definitions[i];

            const preyCount = Math.min(5, Math.floor(energyFlux * 5 * (1 + trophicCascade)) + 2);
            const prey: string[] = [];
            for (let p = 0; p < preyCount && p < flora.length; p++) {
                const floraIndex = Math.floor((parseInt(mutation.slice(0, 4), 16) + p) % flora.length);
                prey.push(flora[floraIndex]?.id || `F-${p}`);
            }
            
            organisms.push({
                id: `A-${i}-${def.name}`,
                name: def.name,
                purpose: def.purpose,
                category: 'fauna',
                spec: this.createComponentSpec(def.name, ['default', 'active', 'disabled', 'loading', 'error'], 'fauna', genome),
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
                    containmentDepth: 2,
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
    
    /**
     * Generate variant names from component category
     */
    private generateVariantNames(category: 'microbial' | 'flora' | 'fauna', mutation: string): string[] {
        const variantSets: Record<string, string[]> = {
            microbial: ['default', 'active', 'disabled'],
            flora: ['default', 'active', 'disabled', 'loading'],
            fauna: ['default', 'active', 'disabled', 'loading', 'error']
        };
        return variantSets[category] || ['default'];
    }
    
    // === RELATIONSHIP GENERATION ===
    private generateRelationships(
        microbial: Organism[],
        flora: Organism[],
        fauna: Organism[]
    ): OrganismRelationship[] {
        const relationships: OrganismRelationship[] = [];
        
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
    
    private createComponentSpec(
        name: string,
        variants: string[],
        category: 'microbial' | 'flora' | 'fauna',
        genome: DesignGenome
    ): ComponentSpec {
        const baseProps = [
            { name: 'className', type: 'string', required: false },
            { name: 'style', type: 'CSSProperties', required: false }
        ];
        
        const categoryProps: Record<string, Array<{name: string; type: string; required: boolean; default?: any}>> = {
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
        
        const ariaProps: Record<string, string[]> = {
            microbial: ['aria-label', 'aria-pressed', 'aria-disabled'],
            flora: ['aria-expanded', 'aria-haspopup', 'aria-activedescendant'],
            fauna: ['aria-modal', 'aria-labelledby', 'aria-describedby']
        };
        
        const keyboard: Record<string, string[]> = {
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
    
    private generateMutation(genome: DesignGenome, index: number): string {
        const variantSeed = `${genome.dnaHash}-${index}`;
        let hash = 0;
        for (let i = 0; i < variantSeed.length; i++) {
            const char = variantSeed.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).slice(0, 8);
    }
    
    private deriveColorTreatment(genome: DesignGenome, index: number): Organism['characteristics']['colorTreatment'] {
        const cs = genome.chromosomes.ch26_color_system;
        if (cs) {
            const treatments: Organism['characteristics']['colorTreatment'][] = ['primary', 'secondary', 'accent', 'neutral'];
            const relationshipSeed = cs.secondary.relationship === "complementary" ? 0 : 
                                     cs.secondary.relationship === "analogous" ? 1 :
                                     cs.secondary.relationship === "split" ? 2 : 3;
            return treatments[(relationshipSeed + index) % 4];
        }
        const hue = genome.chromosomes.ch5_color_primary.hue;
        const treatments: Organism['characteristics']['colorTreatment'][] = ['primary', 'secondary', 'accent', 'neutral'];
        const quadrant = Math.floor(hue / 90);
        return treatments[(quadrant + index) % 4];
    }
    
    private deriveMotionStyle(genome: DesignGenome, category: 'microbial' | 'flora' | 'fauna'): Organism['characteristics']['motionStyle'] {
        const mc = genome.chromosomes.ch27_motion_choreography;
        if (mc) {
            if (mc.choreographyStyle === "elegant" || mc.choreographyStyle === "smooth") return 'subtle';
            if (mc.choreographyStyle === "energetic" || mc.choreographyStyle === "snappy") return 'active';
            if (mc.choreographyStyle === "dramatic") return 'complex';
        }
        
        const physics = genome.chromosomes.ch8_motion.physics;
        const complexity = genome.chromosomes.ch15_biomarker.complexity;
        
        if (physics === 'none') return 'none';
        if (category === 'microbial') return 'subtle';
        if (category === 'flora' && physics === 'spring') return 'subtle';
        if (category === 'fauna' && complexity > 0.7) return 'complex';
        return 'active';
    }
    
    private deriveScale(
        genome: DesignGenome, 
        baseScale: Organism['characteristics']['scale'],
        category: 'microbial' | 'flora' | 'fauna'
    ): Organism['characteristics']['scale'] {
        const density = genome.chromosomes.ch2_rhythm.density;
        const radius = genome.chromosomes.ch7_edge.radius;
        
        if (density === 'airtight' && radius < 5) return 'micro';
        if (density === 'maximal' && radius > 15) return 'large';
        if (category === 'fauna') return 'large';
        if (category === 'microbial' && density === 'empty') return 'micro';
        return baseScale;
    }
    
    private deriveTexture(genome: DesignGenome): Organism['characteristics']['texture'] {
        const material = genome.chromosomes.ch14_physics.material;
        const elevation = genome.chromosomes.ch10_hierarchy.elevationSystem;
        
        if (material === 'glass') return 'glass';
        if (material === 'neumorphism' || elevation === 'neumorphic') return 'elevated';
        if (material === 'metallic') return 'material';
        return 'flat';
    }
    
    /**
     * Find symbiotic relationships for microbial organisms
     */
    private findSymbioticMicrobes(index: number, total: number): string[] {
        const symbiosis: string[] = [];
        if (index + 1 < total) symbiosis.push(`M-${index + 1}`);
        if (index + 2 < total) symbiosis.push(`M-${index + 2}`);
        return symbiosis;
    }
    
    /**
     * Find symbiotic relationships for flora organisms
     */
    private findSymbioticFlora(index: number, total: number): string[] {
        const symbiosis: string[] = [];
        if (index + 1 < total) symbiosis.push(`F-${index + 1}`);
        return symbiosis;
    }
    
    /**
     * Find symbiotic relationships for fauna organisms
     */
    private findSymbioticFauna(index: number, total: number): string[] {
        const symbiosis: string[] = [];
        if (index + 1 < total) symbiosis.push(`A-${index + 1}`);
        return symbiosis;
    }
    
    /**
     * Calculate habitability score from traits
     */
    private calculateHabitability(traits: ContentTraits): number {
        const density = 1 - Math.abs(traits.informationDensity - 0.7);
        const temperature = 1 - Math.abs(traits.emotionalTemperature - 0.5);
        const stability = 1 - traits.playfulness;
        return (density * 0.4 + temperature * 0.3 + stability * 0.3);
    }
    
    private calculateOrganismCounts(
        comp: number,
        genome: DesignGenome,
        options?: { microbialCount?: number; floraCount?: number; faunaCount?: number }
    ): { microbial: number; flora: number; fauna: number; carryingCapacity: number } {

        const baseMicrobial = comp < 0.11
            ? 0
            : Math.min(16, Math.floor(2 + ((comp - 0.11) / 0.69) * 14));

        const baseFlora = comp < 0.34
            ? 0
            : Math.min(12, Math.floor(((comp - 0.34) / 0.46) * 12));

        const baseFauna = comp < 0.57
            ? 0
            : Math.min(10, Math.floor(((comp - 0.57) / 0.23) * 10));

        const topology = genome.chromosomes.ch1_structure?.topology;
        const topologyMultiplier = topology === 'graph'  ? 1.3 :
                                   topology === 'radial' ? 1.2 : 1.0;

        const total = baseMicrobial + baseFlora + baseFauna;
        const carryingCapacity = Math.min(1, (total / 38) * topologyMultiplier);

        return {
            microbial: options?.microbialCount ?? baseMicrobial,
            flora:     options?.floraCount     ?? baseFlora,
            fauna:     options?.faunaCount     ?? baseFauna,
            carryingCapacity
        };
    }
    
    private calculateComplexity(
        genome: DesignGenome,
        microbial: Organism[],
        flora: Organism[],
        fauna: Organism[]
    ): number {
        const baseComplexity = genome.chromosomes.ch15_biomarker.complexity;
        const organismCount = (microbial.length + flora.length + fauna.length) / 30;
        const entropyFactor = genome.chromosomes.ch12_signature.entropy;
        
        return Math.min(1, baseComplexity * 0.4 + organismCount * 0.4 + entropyFactor * 0.2);
    }
    
    private calculateDiversity(microbial: Organism[], flora: Organism[], fauna: Organism[]): number {
        const totalVariants = [...microbial, ...flora, ...fauna]
            .reduce((sum, org) => sum + org.spec.variants.length, 0);
        return Math.min(1, totalVariants / 100);
    }
    
    private calculateStability(traits: ContentTraits, complexity: number): number {
        const stability = 1 - traits.playfulness * complexity;
        return Math.max(0, Math.min(1, stability));
    }
    
    /**
     * Generate icon organisms from ch28_iconography
     */
    generateIconOrganisms(genome: DesignGenome): Organism[] {
        const iconography = genome.chromosomes.ch28_iconography;
        if (!iconography) return [];
        
        const organisms: Organism[] = [];
        const count = Math.floor(iconography.sizeScale * 8) + 4;
        
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
                    interactionPattern: iconography.animation
                },
                relationships: {
                    symbiosis: [],
                    prey: undefined,
                    predator: undefined
                }
            });
        }
        
        return organisms;
    }
}

export const ecosystemGenerator = new EcosystemGenerator();
