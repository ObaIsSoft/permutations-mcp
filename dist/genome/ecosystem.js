import { GenomeSequencer } from "./sequencer.js";
export class EcosystemGenerator {
    sequencer;
    constructor() {
        this.sequencer = new GenomeSequencer();
    }
    generate(seed, traits, options) {
        const opts = {
            microbialCount: 8,
            floraCount: 4,
            faunaCount: 2,
            generations: 3,
            ...options
        };
        // Generate base planet DNA
        const baseGenome = this.sequencer.generate(seed, traits);
        // Calculate habitability
        const habitabilityScore = this.calculateHabitability(traits);
        // Generate divergent life forms
        const microbial = this.generateMicrobialColony(seed, traits, opts.microbialCount);
        const flora = this.generateFloraEcosystem(seed, traits, microbial, opts.floraCount);
        const fauna = this.generateFaunaPopulation(seed, traits, flora, opts.faunaCount);
        // Determine dominant life form
        const dominant = this.determineDominantLifeForm(microbial, flora, fauna, baseGenome);
        // Check for civilization
        const civilization = this.detectCivilization(baseGenome, fauna);
        return {
            planet: {
                seed,
                conditions: traits,
                baseGenome,
                habitabilityScore
            },
            lifeForms: {
                microbial,
                flora,
                fauna,
                dominant
            },
            civilization,
            evolution: {
                generations: opts.generations,
                divergenceRate: this.calculateDivergence(microbial, flora),
                extinctionEvents: this.calculateExtinctions(traits)
            }
        };
    }
    calculateHabitability(traits) {
        // Goldilocks zone calculation
        const density = 1 - Math.abs(traits.informationDensity - 0.7); // Optimal around 0.7
        const temperature = 1 - Math.abs(traits.emotionalTemperature - 0.5); // Optimal around 0.5
        const stability = 1 - traits.playfulness; // Lower playfulness = more stable
        return (density * 0.4 + temperature * 0.3 + stability * 0.3);
    }
    generateMicrobialColony(seed, traits, count) {
        const variants = [];
        for (let i = 0; i < count; i++) {
            // Each microbe has slight trait variations
            const variantTraits = {
                informationDensity: this.mutate(traits.informationDensity, 0.1),
                temporalUrgency: this.mutate(traits.temporalUrgency, 0.05),
                emotionalTemperature: this.mutate(traits.emotionalTemperature, 0.08),
                playfulness: Math.max(0, traits.playfulness - (i * 0.05)), // Stabilize over generations
                spatialDependency: this.mutate(traits.spatialDependency, 0.1)
            };
            const variantSeed = `${seed}-microbe-${i}`;
            const genome = this.sequencer.generate(variantSeed, variantTraits);
            variants.push({
                id: `M-${i}`,
                genome,
                mutation: genome.chromosomes.ch12_signature.uniqueMutation,
                entropy: genome.chromosomes.ch12_signature.entropy,
                generation: 1
            });
        }
        return variants;
    }
    generateFloraEcosystem(seed, traits, microbial, count) {
        const variants = [];
        // Flora evolves from microbial base with structural adaptations
        for (let i = 0; i < count; i++) {
            const parentMicrobe = microbial[i % microbial.length];
            // Flora has reduced temporal urgency (plants don't move fast)
            const floraTraits = {
                ...traits,
                temporalUrgency: Math.max(0.1, traits.temporalUrgency - 0.3),
                spatialDependency: Math.min(1, traits.spatialDependency + 0.1), // Need space to grow
                playfulness: Math.min(1, traits.playfulness + 0.1) // Organic growth adds chaos
            };
            const variantSeed = `${seed}-flora-${i}`;
            const genome = this.sequencer.generate(variantSeed, floraTraits);
            variants.push({
                id: `F-${i}`,
                genome,
                topology: genome.chromosomes.ch1_structure.topology,
                geometry: genome.chromosomes.ch15_biomarker.geometry,
                atmosphere: genome.chromosomes.ch13_atmosphere.fx,
                adaptation: this.determineFloraAdaptation(genome, traits)
            });
        }
        return variants;
    }
    generateFaunaPopulation(seed, traits, flora, count) {
        const variants = [];
        for (let i = 0; i < count; i++) {
            // Fauna requires higher complexity
            const faunaTraits = {
                ...traits,
                temporalUrgency: Math.min(1, traits.temporalUrgency + 0.2), // Animals move
                playfulness: Math.min(1, traits.playfulness + 0.15), // Behavior variance
                spatialDependency: Math.min(1, traits.spatialDependency + 0.2) // Navigation needs
            };
            const variantSeed = `${seed}-fauna-${i}`;
            const genome = this.sequencer.generate(variantSeed, faunaTraits);
            variants.push({
                id: `A-${i}`,
                genome,
                behavior: this.determineBehavior(genome),
                movement: genome.chromosomes.ch8_motion.physics,
                complexity: genome.chromosomes.ch15_biomarker.complexity
            });
        }
        return variants;
    }
    detectCivilization(baseGenome, fauna) {
        const complexity = baseGenome.chromosomes.ch15_biomarker.complexity;
        const threshold = 0.85;
        if (complexity < threshold) {
            return null;
        }
        // Determine sentience level
        let sentienceLevel = 'sentient';
        if (complexity > 0.95)
            sentienceLevel = 'advanced';
        else if (complexity > 0.9)
            sentienceLevel = 'civilized';
        // Generate technology tree
        const technologyTree = this.generateTechnologyTree(baseGenome, complexity);
        // Determine social structure
        const socialStructure = this.determineSocialStructure(baseGenome);
        return {
            complexity,
            sentienceLevel,
            technologyTree,
            socialStructure,
            designSophistication: Math.min(1, complexity * 1.2)
        };
    }
    generateTechnologyTree(genome, complexity) {
        const material = genome.chromosomes.ch14_physics.material;
        const tree = [];
        // Era 1: Primitive
        tree.push({
            era: 'Primitive',
            materials: ['organic', material],
            architecture: [genome.chromosomes.ch1_structure.topology],
            communication: ['chemical', 'visual'],
            designPatterns: ['flat', 'minimal']
        });
        // Era 2: Industrial (if complexity > 0.7)
        if (complexity > 0.7) {
            tree.push({
                era: 'Industrial',
                materials: [material, 'metallic', 'composite'],
                architecture: ['column', 'grid'],
                communication: ['electrical', 'mechanical'],
                designPatterns: ['structured', 'hierarchical']
            });
        }
        // Era 3: Information Age (if complexity > 0.85)
        if (complexity > 0.85) {
            tree.push({
                era: 'Information',
                materials: ['glass', 'silicon', 'light'],
                architecture: ['radial', 'network'],
                communication: ['digital', 'instant'],
                designPatterns: ['fluid', 'responsive']
            });
        }
        // Era 4: Post-Singularity (if complexity > 0.95)
        if (complexity > 0.95) {
            tree.push({
                era: 'Transcendent',
                materials: ['quantum', 'conscious', 'energy'],
                architecture: ['fractal', 'infinite'],
                communication: ['telepathic', 'holographic'],
                designPatterns: ['generative', 'alive']
            });
        }
        return tree;
    }
    determineDominantLifeForm(microbial, flora, fauna, baseGenome) {
        const complexity = baseGenome.chromosomes.ch15_biomarker.complexity;
        if (complexity > 0.85)
            return 'civilization';
        if (complexity > 0.6)
            return 'fauna';
        if (complexity > 0.4)
            return 'flora';
        return 'microbial';
    }
    determineFloraAdaptation(genome, traits) {
        const adaptations = [];
        if (traits.spatialDependency > 0.6)
            adaptations.push('aerial');
        if (traits.emotionalTemperature > 0.6)
            adaptations.push('flowering');
        if (traits.informationDensity > 0.7)
            adaptations.push('crystalline');
        if (traits.temporalUrgency < 0.3)
            adaptations.push('ancient');
        return adaptations.join(', ') || 'standard';
    }
    determineBehavior(genome) {
        const physics = genome.chromosomes.ch8_motion.physics;
        const playfulness = genome.chromosomes.ch15_biomarker.complexity;
        if (playfulness > 0.7)
            return 'playful';
        if (physics === 'none')
            return 'static';
        if (physics === 'spring')
            return 'energetic';
        if (physics === 'glitch')
            return 'erratic';
        return 'balanced';
    }
    determineSocialStructure(genome) {
        const topology = genome.chromosomes.ch1_structure.topology;
        const density = genome.chromosomes.ch2_rhythm.density;
        if (topology === 'radial')
            return 'hive';
        if (density === 'airtight')
            return 'collective';
        if (density === 'empty')
            return 'individualist';
        if (topology === 'graph')
            return 'networked';
        return 'tribal';
    }
    mutate(value, rate) {
        const mutation = (Math.random() - 0.5) * 2 * rate;
        return Math.max(0, Math.min(1, value + mutation));
    }
    calculateDivergence(microbial, flora) {
        if (microbial.length < 2)
            return 0;
        // Calculate average entropy difference
        const entropies = microbial.map(m => m.entropy);
        const avg = entropies.reduce((a, b) => a + b, 0) / entropies.length;
        const variance = entropies.reduce((sum, e) => sum + Math.pow(e - avg, 2), 0) / entropies.length;
        return Math.sqrt(variance);
    }
    calculateExtinctions(traits) {
        // High playfulness + low temporal urgency = more extinction events
        const volatility = traits.playfulness * (1 - traits.temporalUrgency);
        return Math.floor(volatility * 5);
    }
}
