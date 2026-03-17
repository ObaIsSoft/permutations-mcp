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

import { DesignGenome, ContentTraits } from "./types.js";
import { GenomeSequencer } from "./sequencer.js";
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
}

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
    private sequencer: GenomeSequencer;
    
    constructor() {
        this.sequencer = new GenomeSequencer();
    }
    
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
             */
            existingGenome?: DesignGenome;
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
            civilizationThreshold: 0.81
        };
    }
    
    /**
     * HASH-DRIVEN: Select which organism types exist in this ecosystem.
     * Not all sites have the same anatomy - navigation might not exist,
     * or might be replaced by constellation_nav, etc.
     */
    private selectOrganismTypes(
        genome: DesignGenome, 
        category: 'microbial' | 'flora' | 'fauna',
        maxCount: number
    ): string[] {
        const registry = ORGANISM_REGISTRY[category];
        const selected: string[] = [];
        
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
                ? 128  // 50% chance of navigation in flora
                : category === 'fauna' && registry[i] === 'structure'
                ? 100  // 40% chance of structure shell
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
    private generateMicrobialColony(genome: DesignGenome, eco: EcosystemGenome, count: number, definitions?: OrganismDefinition[]): Organism[] {
        const organisms: Organism[] = [];
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
    private generateFloraEcosystem(
        genome: DesignGenome,
        eco: EcosystemGenome,
        microbial: Organism[],
        count: number,
        definitions?: OrganismDefinition[]
    ): Organism[] {
        const organisms: Organism[] = [];
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
            const prey: string[] = [];
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
    private generateFaunaPopulation(
        genome: DesignGenome,
        eco: EcosystemGenome,
        flora: Organism[],
        count: number,
        definitions?: OrganismDefinition[]
    ): Organism[] {
        const organisms: Organism[] = [];
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
            const prey: string[] = [];
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
    private deriveOrganismName(
        prefix: string,
        mutation: string,
        index: number,
        category: 'microbial' | 'flora' | 'fauna'
    ): string {
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
    private generateVariantNames(patterns: string[], count: number, mutation: string): string[] {
        const variants: string[] = [];
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
    private deriveFromHash(hash: string, max: number): number {
        const num = parseInt(hash.slice(0, 4), 16);
        return (num / 65536) * max;
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
        
        // Add category-specific props
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
    
    private deriveColorTreatment(genome: DesignGenome, index: number): Organism['characteristics']['colorTreatment'] {
        // Use ch26_color_system if available, fallback to ch5
        const cs = genome.chromosomes.ch26_color_system;
        if (cs) {
            const treatments: Organism['characteristics']['colorTreatment'][] = ['primary', 'secondary', 'accent', 'neutral'];
            // Hash-derived from secondary color relationship
            const relationshipSeed = cs.secondary.relationship === "complementary" ? 0 : 
                                     cs.secondary.relationship === "analogous" ? 1 :
                                     cs.secondary.relationship === "split" ? 2 : 3;
            return treatments[(relationshipSeed + index) % 4];
        }
        // Fallback to ch5
        const hue = genome.chromosomes.ch5_color_primary.hue;
        const treatments: Organism['characteristics']['colorTreatment'][] = ['primary', 'secondary', 'accent', 'neutral'];
        const quadrant = Math.floor(hue / 90);
        return treatments[(quadrant + index) % 4];
    }
    
    private deriveMotionStyle(genome: DesignGenome, category: 'microbial' | 'flora' | 'fauna'): Organism['characteristics']['motionStyle'] {
        // Prefer ch27_motion_choreography if available
        const mc = genome.chromosomes.ch27_motion_choreography;
        if (mc) {
            if (mc.choreographyStyle === "elegant" || mc.choreographyStyle === "smooth") return 'subtle';
            if (mc.choreographyStyle === "energetic" || mc.choreographyStyle === "snappy") return 'active';
            if (mc.choreographyStyle === "dramatic") return 'complex';
        }
        
        // Fallback to ch8
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
     * Generate icon organisms from ch28_iconography
     * Icons are microbial organisms with specific characteristics
     */
    generateIconOrganisms(genome: DesignGenome): Organism[] {
        const iconography = genome.chromosomes.ch28_iconography;
        if (!iconography) return [];
        
        const organisms: Organism[] = [];
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
    
    private findSymbioticMicrobes(index: number, total: number): string[] {
        const symbiosis: string[] = [];
        // Each microbe symbioses with 1-2 neighbors
        if (index > 0) symbiosis.push(`M-${index - 1}`);
        if (index < total - 1) symbiosis.push(`M-${index + 1}`);
        return symbiosis;
    }
    
    private findSymbioticFlora(index: number, total: number): string[] {
        const symbiosis: string[] = [];
        // Flora symbioses with adjacent flora
        if (index > 0) symbiosis.push(`F-${index - 1}`);
        if (index < total - 1) symbiosis.push(`F-${index + 1}`);
        return symbiosis;
    }
    
    private findSymbioticFauna(index: number, total: number): string[] {
        const symbiosis: string[] = [];
        // Fauna symbioses with adjacent fauna
        if (index > 0) symbiosis.push(`A-${index - 1}`);
        if (index < total - 1) symbiosis.push(`A-${index + 1}`);
        return symbiosis;
    }
    
    private calculateHabitability(traits: ContentTraits): number {
        const density = 1 - Math.abs(traits.informationDensity - 0.7);
        const temperature = 1 - Math.abs(traits.emotionalTemperature - 0.5);
        const stability = 1 - traits.playfulness;
        return (density * 0.4 + temperature * 0.3 + stability * 0.3);
    }
    
    private calculateOrganismCounts(
        genome: DesignGenome,
        options?: { microbialCount?: number; floraCount?: number; faunaCount?: number }
    ): { microbial: number; flora: number; fauna: number; carryingCapacity: number } {
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

        const topologyMultiplier = ch.ch1_structure.topology === 'graph'  ? 1.3 :
                                   ch.ch1_structure.topology === 'radial' ? 1.2 : 1.0;

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
        const volatility = traits.playfulness * complexity;
        return Math.max(0, 1 - volatility);
    }
}

export const ecosystemGenerator = new EcosystemGenerator();
