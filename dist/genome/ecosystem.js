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
        { prefix: 'separator', patterns: ['divider', 'spacer', 'rule'] }
    ],
    flora: [
        { prefix: 'input', patterns: ['field', 'control', 'selector'] },
        { prefix: 'container', patterns: ['card', 'panel', 'section'] },
        { prefix: 'navigation', patterns: ['menu', 'tabs', 'breadcrumb'] },
        { prefix: 'reveal', patterns: ['dropdown', 'tooltip', 'popover'] },
        { prefix: 'organization', patterns: ['list', 'accordion', 'tree'] },
        { prefix: 'selection', patterns: ['toggle', 'switch', 'radio'] }
    ],
    fauna: [
        { prefix: 'overlay', patterns: ['modal', 'dialog', 'drawer'] },
        { prefix: 'data', patterns: ['table', 'chart', 'grid'] },
        { prefix: 'media', patterns: ['carousel', 'gallery', 'player'] },
        { prefix: 'search', patterns: ['finder', 'explorer', 'filter'] },
        { prefix: 'structure', patterns: ['layout', 'shell', 'frame'] },
        { prefix: 'input', patterns: ['form', 'wizard', 'editor'] }
    ]
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
        // Generate the shared environment (ONE genome for entire ecosystem)
        const genome = this.sequencer.generate(seed, traits, { primarySector: inferredSector });
        // Calculate how well this environment supports life
        const habitabilityScore = this.calculateHabitability(traits);
        // CHROMOSOME-DRIVEN: Counts determined by genome, not just traits
        const counts = this.calculateOrganismCounts(genome, options);
        // Generate organisms from the shared environment
        const microbial = this.generateMicrobialColony(genome, counts.microbial);
        const flora = this.generateFloraEcosystem(genome, microbial, counts.flora);
        const fauna = this.generateFaunaPopulation(genome, flora, counts.fauna);
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
    // === MICROBIAL COLONY ===
    // Atomic components: topology-derived, not named templates
    generateMicrobialColony(genome, count) {
        const organisms = [];
        const baseEntropy = genome.chromosomes.ch12_signature.entropy;
        const patterns = TOPOLOGY_PATTERNS.microbial;
        for (let i = 0; i < count; i++) {
            const mutation = this.generateMutation(genome, i);
            // CHROMOSOME-DRIVEN: Select pattern based on hash entropy
            const patternIndex = Math.floor(this.deriveFromHash(mutation, patterns.length));
            const pattern = patterns[patternIndex % patterns.length];
            // CHROMOSOME-DRIVEN: Generate variants based on genome, not hardcoded list
            const variantCount = Math.floor(this.deriveFromHash(mutation, 4)) + 2; // 2-5 variants
            const variants = this.generateVariantNames(pattern.patterns, variantCount, mutation);
            // CHROMOSOME-DRIVEN: Derive name from topology
            const name = this.deriveOrganismName(pattern.prefix, mutation, i, 'microbial');
            organisms.push({
                id: `M-${i}`,
                name,
                category: 'microbial',
                spec: this.createComponentSpec(name, variants, 'microbial', genome),
                adaptation: {
                    mutation,
                    entropy: baseEntropy * (1 + i * 0.05),
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
    // Growing components: containers with containment relationships
    generateFloraEcosystem(genome, microbial, count) {
        const organisms = [];
        const baseEntropy = genome.chromosomes.ch12_signature.entropy;
        const patterns = TOPOLOGY_PATTERNS.flora;
        for (let i = 0; i < count; i++) {
            const mutation = this.generateMutation(genome, i + 100);
            // CHROMOSOME-DRIVEN: Select pattern
            const patternIndex = Math.floor(this.deriveFromHash(mutation, patterns.length));
            const pattern = patterns[patternIndex % patterns.length];
            // CHROMOSOME-DRIVEN: Generate variants
            const variantCount = Math.floor(this.deriveFromHash(mutation, 5)) + 2;
            const variants = this.generateVariantNames(pattern.patterns, variantCount, mutation);
            // CHROMOSOME-DRIVEN: Derive name from topology
            const name = this.deriveOrganismName(pattern.prefix, mutation, i, 'flora');
            // CHROMOSOME-DRIVEN: Which microbes this flora contains
            const preyCount = Math.min(4, Math.floor(this.deriveFromHash(mutation, 4)) + 1);
            const prey = [];
            for (let p = 0; p < preyCount && p < microbial.length; p++) {
                const microIndex = Math.floor(this.deriveFromHash(mutation + p, microbial.length));
                prey.push(microbial[microIndex]?.id || `M-${p}`);
            }
            organisms.push({
                id: `F-${i}`,
                name,
                category: 'flora',
                spec: this.createComponentSpec(name, variants, 'flora', genome),
                adaptation: {
                    mutation,
                    entropy: baseEntropy * (1.2 + i * 0.08),
                    generation: 2
                },
                characteristics: {
                    colorTreatment: this.deriveColorTreatment(genome, i + 100),
                    motionStyle: this.deriveMotionStyle(genome, 'flora'),
                    scale: this.deriveScale(genome, 'medium', 'flora'),
                    texture: this.deriveTexture(genome)
                },
                topology: {
                    containmentDepth: 1, // Flora contain microbes
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
    // Complex moving components: orchestrators
    generateFaunaPopulation(genome, flora, count) {
        const organisms = [];
        const baseEntropy = genome.chromosomes.ch12_signature.entropy;
        const patterns = TOPOLOGY_PATTERNS.fauna;
        for (let i = 0; i < count; i++) {
            const mutation = this.generateMutation(genome, i + 200);
            // CHROMOSOME-DRIVEN: Select pattern
            const patternIndex = Math.floor(this.deriveFromHash(mutation, patterns.length));
            const pattern = patterns[patternIndex % patterns.length];
            // CHROMOSOME-DRIVEN: Generate variants
            const variantCount = Math.floor(this.deriveFromHash(mutation, 5)) + 2;
            const variants = this.generateVariantNames(pattern.patterns, variantCount, mutation);
            // CHROMOSOME-DRIVEN: Derive name from topology
            const name = this.deriveOrganismName(pattern.prefix, mutation, i, 'fauna');
            // CHROMOSOME-DRIVEN: Which flora this fauna contains
            const preyCount = Math.min(5, Math.floor(this.deriveFromHash(mutation, 5)) + 2);
            const prey = [];
            for (let p = 0; p < preyCount && p < flora.length; p++) {
                const floraIndex = Math.floor(this.deriveFromHash(mutation + p, flora.length));
                prey.push(flora[floraIndex]?.id || `F-${p}`);
            }
            organisms.push({
                id: `A-${i}`,
                name,
                category: 'fauna',
                spec: this.createComponentSpec(name, variants, 'fauna', genome),
                adaptation: {
                    mutation,
                    entropy: baseEntropy * (1.5 + i * 0.1),
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
        if (flora.length > 2) {
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
