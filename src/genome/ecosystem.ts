import { DesignGenome, ContentTraits } from "./types.js";
import { GenomeSequencer } from "./sequencer.js";

export interface MicrobialVariant {
    id: string;
    genome: DesignGenome;
    mutation: string;
    entropy: number;
    generation: number;
}

export interface FloraVariant {
    id: string;
    genome: DesignGenome;
    topology: string;
    geometry: string;
    atmosphere: string;
    adaptation: string;
}

export interface FaunaVariant {
    id: string;
    genome: DesignGenome;
    behavior: string;
    movement: string;
    complexity: number;
}

export interface Technology {
    era: string;
    materials: string[];
    architecture: string[];
    communication: string[];
    designPatterns: string[];
}

export interface Civilization {
    complexity: number;
    sentienceLevel: 'microbial' | 'flora' | 'fauna' | 'sentient' | 'civilized' | 'advanced';
    technologyTree: Technology[];
    socialStructure: string;
    designSophistication: number;
}

export interface Ecosystem {
    planet: {
        seed: string;
        conditions: ContentTraits;
        baseGenome: DesignGenome;
        habitabilityScore: number;
    };
    lifeForms: {
        microbial: MicrobialVariant[];
        flora: FloraVariant[];
        fauna: FaunaVariant[];
        dominant: 'microbial' | 'flora' | 'fauna' | 'civilization';
    };
    civilization: Civilization | null;
    evolution: {
        generations: number;
        divergenceRate: number;
        extinctionEvents: number;
    };
}

export class EcosystemGenerator {
    private sequencer: GenomeSequencer;
    
    constructor() {
        this.sequencer = new GenomeSequencer();
    }
    
    generate(seed: string, traits: ContentTraits, options?: {
        microbialCount?: number;
        floraCount?: number;
        faunaCount?: number;
        generations?: number;
    }): Ecosystem {
        const opts = {
            microbialCount: 8,
            floraCount: 4,
            faunaCount: 2,
            generations: 3,
            ...options
        };
        
        // Generate base planet DNA
        const baseGenome = this.sequencer.generate(seed, traits, { primarySector: "technology" });
        
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
    
    private calculateHabitability(traits: ContentTraits): number {
        // Goldilocks zone calculation
        const density = 1 - Math.abs(traits.informationDensity - 0.7); // Optimal around 0.7
        const temperature = 1 - Math.abs(traits.emotionalTemperature - 0.5); // Optimal around 0.5
        const stability = 1 - traits.playfulness; // Lower playfulness = more stable
        
        return (density * 0.4 + temperature * 0.3 + stability * 0.3);
    }
    
    private generateMicrobialColony(
        seed: string, 
        traits: ContentTraits, 
        count: number
    ): MicrobialVariant[] {
        const variants: MicrobialVariant[] = [];
        
        for (let i = 0; i < count; i++) {
            // Each microbe has slight trait variations
            const variantTraits: ContentTraits = {
                informationDensity: this.mutate(traits.informationDensity, 0.1),
                temporalUrgency: this.mutate(traits.temporalUrgency, 0.05),
                emotionalTemperature: this.mutate(traits.emotionalTemperature, 0.08),
                playfulness: Math.max(0, traits.playfulness - (i * 0.05)), // Stabilize over generations
                spatialDependency: this.mutate(traits.spatialDependency, 0.1),
                trustRequirement: traits.trustRequirement,
                visualEmphasis: traits.visualEmphasis,
                conversionFocus: traits.conversionFocus
            };
            
            const variantSeed = `${seed}-microbe-${i}`;
            const genome = this.sequencer.generate(variantSeed, variantTraits, { primarySector: "technology" });
            
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
    
    private generateFloraEcosystem(
        seed: string,
        traits: ContentTraits,
        microbial: MicrobialVariant[],
        count: number
    ): FloraVariant[] {
        const variants: FloraVariant[] = [];
        
        // Flora evolves from microbial base with structural adaptations
        for (let i = 0; i < count; i++) {
            const parentMicrobe = microbial[i % microbial.length];
            
            // Flora has reduced temporal urgency (plants don't move fast)
            const floraTraits: ContentTraits = {
                ...traits,
                temporalUrgency: Math.max(0.1, traits.temporalUrgency - 0.3),
                spatialDependency: Math.min(1, traits.spatialDependency + 0.1), // Need space to grow
                playfulness: Math.min(1, traits.playfulness + 0.1) // Organic growth adds chaos
            };
            
            const variantSeed = `${seed}-flora-${i}`;
            const genome = this.sequencer.generate(variantSeed, floraTraits, { primarySector: "technology" });
            
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
    
    private generateFaunaPopulation(
        seed: string,
        traits: ContentTraits,
        flora: FloraVariant[],
        count: number
    ): FaunaVariant[] {
        const variants: FaunaVariant[] = [];
        
        for (let i = 0; i < count; i++) {
            // Fauna requires higher complexity
            const faunaTraits: ContentTraits = {
                ...traits,
                temporalUrgency: Math.min(1, traits.temporalUrgency + 0.2), // Animals move
                playfulness: Math.min(1, traits.playfulness + 0.15), // Behavior variance
                spatialDependency: Math.min(1, traits.spatialDependency + 0.2) // Navigation needs
            };
            
            const variantSeed = `${seed}-fauna-${i}`;
            const genome = this.sequencer.generate(variantSeed, faunaTraits, { primarySector: "technology" });
            
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
    
    private detectCivilization(baseGenome: DesignGenome, fauna: FaunaVariant[]): Civilization | null {
        const complexity = baseGenome.chromosomes.ch15_biomarker.complexity;
        const threshold = 0.85;
        
        if (complexity < threshold) {
            return null;
        }
        
        // Determine sentience level
        let sentienceLevel: Civilization['sentienceLevel'] = 'sentient';
        if (complexity > 0.95) sentienceLevel = 'advanced';
        else if (complexity > 0.9) sentienceLevel = 'civilized';
        
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
    
    private generateTechnologyTree(genome: DesignGenome, complexity: number): Technology[] {
        const material = genome.chromosomes.ch14_physics.material;
        const tree: Technology[] = [];
        
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
    
    private determineDominantLifeForm(
        microbial: MicrobialVariant[],
        flora: FloraVariant[],
        fauna: FaunaVariant[],
        baseGenome: DesignGenome
    ): 'microbial' | 'flora' | 'fauna' | 'civilization' {
        const complexity = baseGenome.chromosomes.ch15_biomarker.complexity;
        
        if (complexity > 0.85) return 'civilization';
        if (complexity > 0.6) return 'fauna';
        if (complexity > 0.4) return 'flora';
        return 'microbial';
    }
    
    private determineFloraAdaptation(genome: DesignGenome, traits: ContentTraits): string {
        const adaptations: string[] = [];
        
        if (traits.spatialDependency > 0.6) adaptations.push('aerial');
        if (traits.emotionalTemperature > 0.6) adaptations.push('flowering');
        if (traits.informationDensity > 0.7) adaptations.push('crystalline');
        if (traits.temporalUrgency < 0.3) adaptations.push('ancient');
        
        return adaptations.join(', ') || 'standard';
    }
    
    private determineBehavior(genome: DesignGenome): string {
        const physics = genome.chromosomes.ch8_motion.physics;
        const playfulness = genome.chromosomes.ch15_biomarker.complexity;
        
        if (playfulness > 0.7) return 'playful';
        if (physics === 'none') return 'static';
        if (physics === 'spring') return 'energetic';
        if (physics === 'glitch') return 'erratic';
        return 'balanced';
    }
    
    private determineSocialStructure(genome: DesignGenome): string {
        const topology = genome.chromosomes.ch1_structure.topology;
        const density = genome.chromosomes.ch2_rhythm.density;
        
        if (topology === 'radial') return 'hive';
        if (density === 'airtight') return 'collective';
        if (density === 'empty') return 'individualist';
        if (topology === 'graph') return 'networked';
        return 'tribal';
    }
    
    private mutate(value: number, rate: number): number {
        const mutation = (Math.random() - 0.5) * 2 * rate;
        return Math.max(0, Math.min(1, value + mutation));
    }
    
    private calculateDivergence(microbial: MicrobialVariant[], flora: FloraVariant[]): number {
        if (microbial.length < 2) return 0;
        
        // Calculate average entropy difference
        const entropies = microbial.map(m => m.entropy);
        const avg = entropies.reduce((a, b) => a + b, 0) / entropies.length;
        const variance = entropies.reduce((sum, e) => sum + Math.pow(e - avg, 2), 0) / entropies.length;
        
        return Math.sqrt(variance);
    }
    
    private calculateExtinctions(traits: ContentTraits): number {
        // High playfulness + low temporal urgency = more extinction events
        const volatility = traits.playfulness * (1 - traits.temporalUrgency);
        return Math.floor(volatility * 5);
    }
}
