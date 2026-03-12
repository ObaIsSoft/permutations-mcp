/**
 * Genome Mutation Engine
 * 
 * Implements the "breeding" part of the biological metaphor.
 * Keep what you love, explore variations on what you don't.
 */

import type { DesignGenome, ContentTraits } from "./types.js";
import { GenomeSequencer } from "./sequencer.js";
import * as crypto from "crypto";

export interface MutationOptions {
    /** Chromosomes to mutate (default: all except preserved) */
    targetChromosomes?: string[];
    /** Chromosomes to preserve exactly */
    preserve?: string[];
    /** Mutation rate 0.0-1.0 (0.1 = subtle, 0.5 = dramatic) */
    rate?: number;
    /** Number of variants to generate */
    count?: number;
}

export interface GenomeVariant {
    id: string;
    genome: DesignGenome;
    mutations: MutationRecord[];
    similarityScore: number; // 0-1 how similar to parent
}

export interface MutationRecord {
    chromosome: string;
    property: string;
    oldValue: any;
    newValue: any;
    changeType: "shift" | "flip" | "drift" | "jump";
}

export class GenomeMutator {
    private sequencer = new GenomeSequencer();

    /**
     * Generate variants by mutating specific chromosomes while preserving others
     */
    mutate(
        parentGenome: DesignGenome,
        options: MutationOptions = {}
    ): GenomeVariant[] {
        const {
            targetChromosomes,
            preserve = [],
            rate = 0.3,
            count = 3
        } = options;

        const variants: GenomeVariant[] = [];
        const baseSeed = parentGenome.dnaHash;

        for (let i = 0; i < count; i++) {
            const variantSeed = this.deriveVariantSeed(baseSeed, i);
            const mutations: MutationRecord[] = [];

            // Deep clone the genome
            const variantGenome = this.cloneGenome(parentGenome);
            variantGenome.dnaHash = variantSeed;

            // Apply mutations
            const chromosomesToMutate = targetChromosomes || 
                Object.keys(variantGenome.chromosomes).filter(k => !preserve.includes(k));

            for (const chromKey of chromosomesToMutate) {
                const mutation = this.mutateChromosome(
                    variantGenome.chromosomes[chromKey as keyof DesignGenome["chromosomes"]],
                    chromKey,
                    rate,
                    variantSeed + chromKey
                );
                if (mutation) {
                    mutations.push(mutation);
                }
            }

            // Recalculate viability after mutations
            variantGenome.viabilityScore = this.calculateViability(variantGenome, parentGenome);

            variants.push({
                id: `variant-${i}`,
                genome: variantGenome,
                mutations,
                similarityScore: this.calculateSimilarity(parentGenome, variantGenome)
            });
        }

        return variants;
    }

    /**
     * Breed two genomes - combine traits from both
     */
    breed(
        parentA: DesignGenome,
        parentB: DesignGenome,
        options: { crossoverRate?: number; count?: number } = {}
    ): GenomeVariant[] {
        const { crossoverRate = 0.5, count = 2 } = options;
        const variants: GenomeVariant[] = [];

        for (let i = 0; i < count; i++) {
            const seed = this.deriveBreedSeed(parentA.dnaHash, parentB.dnaHash, i);
            const mutations: MutationRecord[] = [];

            // Create mixed genome
            const mixedGenome = this.createMixedGenome(parentA, parentB, crossoverRate, seed);

            variants.push({
                id: `breed-${i}`,
                genome: mixedGenome,
                mutations,
                similarityScore: (this.calculateSimilarity(parentA, mixedGenome) + 
                                 this.calculateSimilarity(parentB, mixedGenome)) / 2
            });
        }

        return variants;
    }

    private mutateChromosome(
        chromosome: any,
        key: string,
        rate: number,
        seed: string
    ): MutationRecord | null {
        const b = this.getHashByte(seed, 0);
        
        // Determine mutation type based on rate and hash
        if (b > rate) return null; // No mutation this time

        const changeType: MutationRecord["changeType"] = 
            b < rate * 0.3 ? "jump" :
            b < rate * 0.6 ? "drift" :
            b < rate * 0.8 ? "flip" : "shift";

        // Apply mutation based on chromosome type
        if (key === "ch5_color_primary") {
            return this.mutateColor(chromosome, changeType, seed);
        }
        if (key === "ch26_color_system") {
            return this.mutateColorSystem(chromosome, changeType, seed);
        }
        if (key === "ch3_type_display" || key === "ch4_type_body") {
            return this.mutateTypography(chromosome, key, changeType, seed);
        }
        if (key === "ch8_motion" || key === "ch27_motion_choreography") {
            return this.mutateMotion(chromosome, key, changeType, seed);
        }
        if (key === "ch7_edge") {
            return this.mutateEdge(chromosome, changeType, seed);
        }
        if (key === "ch28_iconography") {
            return this.mutateIconography(chromosome, changeType, seed);
        }

        return null;
    }

    private mutateColor(
        color: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b1 = this.getHashByte(seed, 1);
        const b2 = this.getHashByte(seed, 2);
        
        const oldHue = color.hue;
        let newHue = oldHue;

        switch (changeType) {
            case "shift": // Small shift ±15°
                newHue = (oldHue + (b1 - 0.5) * 30 + 360) % 360;
                break;
            case "drift": // Medium drift ±45°
                newHue = (oldHue + (b1 - 0.5) * 90 + 360) % 360;
                break;
            case "flip": // Complementary ±180°
                newHue = (oldHue + 180 + (b1 - 0.5) * 30) % 360;
                break;
            case "jump": // Big jump ±90°
                newHue = (oldHue + (b1 - 0.5) * 180 + 360) % 360;
                break;
        }

        color.hue = Math.round(newHue);
        color.hex = this.hslToHex(color.hue, color.saturation, color.lightness);

        return {
            chromosome: "ch5_color_primary",
            property: "hue",
            oldValue: oldHue,
            newValue: color.hue,
            changeType
        };
    }

    private mutateColorSystem(
        cs: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        
        // Cycle through relationships
        const relationships = ["complementary", "analogous", "split", "triadic"];
        const oldRelationship = cs.secondary.relationship;
        const newIndex = Math.floor(b * relationships.length);
        cs.secondary.relationship = relationships[newIndex];

        return {
            chromosome: "ch26_color_system",
            property: "secondary.relationship",
            oldValue: oldRelationship,
            newValue: cs.secondary.relationship,
            changeType
        };
    }

    private mutateTypography(
        type: any,
        key: string,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        const oldWeight = type.weight;
        
        // Small weight shifts
        type.weight = Math.max(400, Math.min(900, 
            oldWeight + Math.round((b - 0.5) * 200)
        ));

        return {
            chromosome: key,
            property: "weight",
            oldValue: oldWeight,
            newValue: type.weight,
            changeType
        };
    }

    private mutateMotion(
        motion: any,
        key: string,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        
        if (key === "ch8_motion") {
            const physicsOptions = ["none", "spring", "step", "glitch"];
            const oldPhysics = motion.physics;
            motion.physics = physicsOptions[Math.floor(b * physicsOptions.length)];
            
            return {
                chromosome: key,
                property: "physics",
                oldValue: oldPhysics,
                newValue: motion.physics,
                changeType
            };
        }
        
        // ch27_motion_choreography
        const styles = ["elegant", "energetic", "smooth", "snappy", "dramatic"];
        const oldStyle = motion.choreographyStyle;
        motion.choreographyStyle = styles[Math.floor(b * styles.length)];
        
        return {
            chromosome: key,
            property: "choreographyStyle",
            oldValue: oldStyle,
            newValue: motion.choreographyStyle,
            changeType
        };
    }

    private mutateEdge(
        edge: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        const oldRadius = edge.radius;
        
        edge.radius = Math.max(0, Math.min(32,
            oldRadius + Math.round((b - 0.5) * 8)
        ));

        return {
            chromosome: "ch7_edge",
            property: "radius",
            oldValue: oldRadius,
            newValue: edge.radius,
            changeType
        };
    }

    private mutateIconography(
        icon: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        
        const styles = ["outline", "filled", "duotone", "rounded", "sharp"];
        const oldStyle = icon.style;
        icon.style = styles[Math.floor(b * styles.length)];

        return {
            chromosome: "ch28_iconography",
            property: "style",
            oldValue: oldStyle,
            newValue: icon.style,
            changeType
        };
    }

    private createMixedGenome(
        parentA: DesignGenome,
        parentB: DesignGenome,
        crossoverRate: number,
        seed: string
    ): DesignGenome {
        const mixed = this.cloneGenome(parentA);
        const b = (i: number) => this.getHashByte(seed, i);
        
        const keys = Object.keys(parentA.chromosomes) as Array<keyof DesignGenome["chromosomes"]>;
        
        for (let i = 0; i < keys.length; i++) {
            if (b(i) > crossoverRate) {
                // Take from parent B
                (mixed.chromosomes[keys[i]] as any) = JSON.parse(
                    JSON.stringify(parentB.chromosomes[keys[i]])
                );
            }
        }

        // Generate new hash for mixed genome
        mixed.dnaHash = crypto.createHash("sha256")
            .update(parentA.dnaHash + parentB.dnaHash + seed)
            .digest("hex");

        return mixed;
    }

    private calculateViability(genome: DesignGenome, parent: DesignGenome): number {
        // Check epistasis rules
        const c = genome.chromosomes;
        let score = 1.0;

        // Penalize clashing colors
        if (c.ch5_color_primary.temperature === "warm" && 
            c.ch6_color_temp.backgroundTemp === "warm" &&
            c.ch26_color_system?.secondary?.relationship === "complementary") {
            score -= 0.1;
        }

        // Penalize excessive motion with high density
        if (c.ch2_rhythm.density === "maximal" && 
            c.ch8_motion.physics === "spring" &&
            c.ch27_motion_choreography?.choreographyStyle === "energetic") {
            score -= 0.15;
        }

        return Math.max(0, Math.min(1, score));
    }

    private calculateSimilarity(a: DesignGenome, b: DesignGenome): number {
        // Simple similarity based on key chromosomes
        let matches = 0;
        let total = 0;

        // Compare color
        if (Math.abs(a.chromosomes.ch5_color_primary.hue - b.chromosomes.ch5_color_primary.hue) < 30) {
            matches++;
        }
        total++;

        // Compare typography
        if (a.chromosomes.ch3_type_display.displayName === b.chromosomes.ch3_type_display.displayName) {
            matches++;
        }
        total++;

        // Compare motion
        if (a.chromosomes.ch8_motion.physics === b.chromosomes.ch8_motion.physics) {
            matches++;
        }
        total++;

        return matches / total;
    }

    private cloneGenome(genome: DesignGenome): DesignGenome {
        return JSON.parse(JSON.stringify(genome));
    }

    private deriveVariantSeed(baseSeed: string, index: number): string {
        return crypto.createHash("sha256")
            .update(baseSeed + "-variant-" + index)
            .digest("hex");
    }

    private deriveBreedSeed(seedA: string, seedB: string, index: number): string {
        return crypto.createHash("sha256")
            .update(seedA + seedB + "-breed-" + index)
            .digest("hex");
    }

    private getHashByte(seed: string, index: number): number {
        const hash = crypto.createHash("sha256").update(seed).digest("hex");
        return parseInt(hash.slice(index * 2, index * 2 + 2), 16) / 255;
    }

    private hslToHex(h: number, s: number, l: number): string {
        s /= 100;
        l /= 100;
        const k = (n: number) => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = (n: number) => {
            const color = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
            return Math.round(color * 255).toString(16).padStart(2, "0");
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }
}

export const genomeMutator = new GenomeMutator();
