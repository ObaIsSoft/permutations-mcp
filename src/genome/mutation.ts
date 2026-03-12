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

            // Populate mutations log: record which chromosomes came from which parent
            for (const key of Object.keys(mixedGenome.chromosomes)) {
                const fromA = JSON.stringify((parentA.chromosomes as any)[key]);
                const fromB = JSON.stringify((parentB.chromosomes as any)[key]);
                const result = JSON.stringify((mixedGenome.chromosomes as any)[key]);
                if (result === fromA && fromA !== fromB) {
                    mutations.push({ chromosome: key, property: 'source', oldValue: 'parentB', newValue: 'parentA', changeType: 'flip' });
                } else if (result === fromB && fromA !== fromB) {
                    mutations.push({ chromosome: key, property: 'source', oldValue: 'parentA', newValue: 'parentB', changeType: 'flip' });
                }
            }

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
        // Structure mutations
        if (key === "ch1_structure") {
            return this.mutateStructure(chromosome, changeType, seed);
        }
        // Rhythm/spacing mutations
        if (key === "ch2_rhythm") {
            return this.mutateRhythm(chromosome, changeType, seed);
        }
        // Grid mutations
        if (key === "ch9_grid") {
            return this.mutateGrid(chromosome, changeType, seed);
        }
        // Texture mutations
        if (key === "ch11_texture") {
            return this.mutateTexture(chromosome, changeType, seed);
        }
        // Atmosphere mutations
        if (key === "ch13_atmosphere") {
            return this.mutateAtmosphere(chromosome, changeType, seed);
        }
        // Physics mutations
        if (key === "ch14_physics") {
            return this.mutatePhysics(chromosome, changeType, seed);
        }
        // Biomarker mutations
        if (key === "ch15_biomarker") {
            return this.mutateBiomarker(chromosome, changeType, seed);
        }
        // Typography scale mutations
        if (key === "ch16_typography") {
            return this.mutateTypographyScale(chromosome, changeType, seed);
        }
        // Accessibility mutations
        if (key === "ch17_accessibility") {
            return this.mutateAccessibility(chromosome, changeType, seed);
        }
        // Rendering mutations
        if (key === "ch18_rendering") {
            return this.mutateRendering(chromosome, changeType, seed);
        }
        // Hero mutations
        if (key === "ch19_hero_type") {
            return this.mutateHero(chromosome, changeType, seed);
        }
        // Visual treatment mutations
        if (key === "ch20_visual_treatment") {
            return this.mutateVisualTreatment(chromosome, changeType, seed);
        }
        // Trust signals mutations
        if (key === "ch21_trust_signals") {
            return this.mutateTrustSignals(chromosome, changeType, seed);
        }
        // Social proof mutations
        if (key === "ch22_social_proof") {
            return this.mutateSocialProof(chromosome, changeType, seed);
        }
        // Content depth mutations
        if (key === "ch23_content_depth") {
            return this.mutateContentDepth(chromosome, changeType, seed);
        }
        // Personalization mutations
        if (key === "ch24_personalization") {
            return this.mutatePersonalization(chromosome, changeType, seed);
        }
        // Copy engine mutations
        if (key === "ch25_copy_engine") {
            return this.mutateCopyEngine(chromosome, changeType, seed);
        }
        // Copy intelligence mutations
        if (key === "ch29_copy_intelligence") {
            return this.mutateCopyIntelligence(chromosome, changeType, seed);
        }
        // Sector mutations (rare, affects entire genome)
        if (key === "ch0_sector") {
            return this.mutateSector(chromosome, changeType, seed);
        }
        // Signature mutations (entropy/identifier)
        if (key === "ch12_signature") {
            return this.mutateSignature(chromosome, changeType, seed);
        }
        // Hierarchy mutations
        if (key === "ch10_hierarchy") {
            return this.mutateHierarchy(chromosome, changeType, seed);
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

    // === Additional chromosome mutations ===

    private mutateStructure(
        structure: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        const topologies = ["flat", "deep", "graph", "radial"];
        const oldTopology = structure.topology;
        structure.topology = topologies[Math.floor(b * topologies.length)];

        return {
            chromosome: "ch1_structure",
            property: "topology",
            oldValue: oldTopology,
            newValue: structure.topology,
            changeType
        };
    }

    private mutateRhythm(
        rhythm: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        const oldSpacing = rhythm.baseSpacing;
        
        // Adjust base spacing by ±20%
        const adjustment = 0.8 + (b * 0.4);
        rhythm.baseSpacing = Math.round(oldSpacing * adjustment);

        return {
            chromosome: "ch2_rhythm",
            property: "baseSpacing",
            oldValue: oldSpacing,
            newValue: rhythm.baseSpacing,
            changeType
        };
    }

    private mutateGrid(
        grid: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        const logics = ["column", "masonry", "radial", "broken"];
        const oldLogic = grid.logic;
        grid.logic = logics[Math.floor(b * logics.length)];

        return {
            chromosome: "ch9_grid",
            property: "logic",
            oldValue: oldLogic,
            newValue: grid.logic,
            changeType
        };
    }

    private mutateTexture(
        texture: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        const surfaces = ["flat", "grain", "glass", "chrome"];
        const oldSurface = texture.surface;
        texture.surface = surfaces[Math.floor(b * surfaces.length)];

        return {
            chromosome: "ch11_texture",
            property: "surface",
            oldValue: oldSurface,
            newValue: texture.surface,
            changeType
        };
    }

    private mutateAtmosphere(
        atmosphere: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        const effects = ["glassmorphism", "crt_noise", "fluid_mesh", "none"];
        const oldFx = atmosphere.fx;
        atmosphere.fx = effects[Math.floor(b * effects.length)];

        return {
            chromosome: "ch13_atmosphere",
            property: "fx",
            oldValue: oldFx,
            newValue: atmosphere.fx,
            changeType
        };
    }

    private mutatePhysics(
        physics: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        const materials = ["neumorphism", "metallic", "glass", "matte"];
        const oldMaterial = physics.material;
        physics.material = materials[Math.floor(b * materials.length)];

        return {
            chromosome: "ch14_physics",
            property: "material",
            oldValue: oldMaterial,
            newValue: physics.material,
            changeType
        };
    }

    private mutateBiomarker(
        biomarker: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        const geometries = ["monolithic", "organic", "fractal"];
        const oldGeometry = biomarker.geometry;
        biomarker.geometry = geometries[Math.floor(b * geometries.length)];

        return {
            chromosome: "ch15_biomarker",
            property: "geometry",
            oldValue: oldGeometry,
            newValue: biomarker.geometry,
            changeType
        };
    }

    private mutateTypographyScale(
        typography: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        const oldRatio = typography.ratio;
        
        // Adjust ratio slightly: 1.067 to 1.618 range
        const ratios = [1.067, 1.125, 1.2, 1.25, 1.333, 1.414, 1.5, 1.618];
        const currentIndex = ratios.indexOf(oldRatio);
        const newIndex = Math.max(0, Math.min(ratios.length - 1, 
            currentIndex + Math.floor((b - 0.5) * 4)));
        typography.ratio = ratios[newIndex];

        return {
            chromosome: "ch16_typography",
            property: "ratio",
            oldValue: oldRatio,
            newValue: typography.ratio,
            changeType
        };
    }

    private mutateAccessibility(
        accessibility: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        const oldMinTouch = accessibility.minTouchTarget;
        
        // Toggle between 44px and 48px
        accessibility.minTouchTarget = b > 0.5 ? 48 : 44;

        return {
            chromosome: "ch17_accessibility",
            property: "minTouchTarget",
            oldValue: oldMinTouch,
            newValue: accessibility.minTouchTarget,
            changeType
        };
    }

    private mutateRendering(
        rendering: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        const strategies = ["webgl", "css", "svg", "static"];
        const oldStrategy = rendering.primary;
        rendering.primary = strategies[Math.floor(b * strategies.length)];

        return {
            chromosome: "ch18_rendering",
            property: "strategy",
            oldValue: oldStrategy,
            newValue: rendering.primary,
            changeType
        };
    }

    private mutateHero(
        hero: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        const types = ["trust_authority", "product_ui", "stats_counter", "search_discovery", 
                       "service_showcase", "brand_logo", "testimonial_focus", "editorial_feature",
                       "aspirational_imagery", "configurator_3d", "content_carousel", "product_video"];
        const oldType = hero.type;
        hero.type = types[Math.floor(b * types.length)];

        return {
            chromosome: "ch19_hero_type",
            property: "type",
            oldValue: oldType,
            newValue: hero.type,
            changeType
        };
    }

    private mutateVisualTreatment(
        visual: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        const treatments = ["natural", "high_contrast", "warm", "cool", "monochrome"];
        const oldTreatment = visual.imageTreatment;
        visual.imageTreatment = treatments[Math.floor(b * treatments.length)];

        return {
            chromosome: "ch20_visual_treatment",
            property: "imageTreatment",
            oldValue: oldTreatment,
            newValue: visual.imageTreatment,
            changeType
        };
    }

    private mutateTrustSignals(
        trust: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        const prominences = ["subtle", "prominent", "hero_feature"];
        const oldProminence = trust.prominence;
        trust.prominence = prominences[Math.floor(b * prominences.length)];

        return {
            chromosome: "ch21_trust_signals",
            property: "prominence",
            oldValue: oldProminence,
            newValue: trust.prominence,
            changeType
        };
    }

    private mutateSocialProof(
        social: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        const types = ["testimonials_grid", "customer_logos", "rating_stars", "none"];
        const oldType = social.type;
        social.type = types[Math.floor(b * types.length)];

        return {
            chromosome: "ch22_social_proof",
            property: "type",
            oldValue: oldType,
            newValue: social.type,
            changeType
        };
    }

    private mutateContentDepth(
        depth: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        const levels = ["minimal", "moderate", "extensive", "comprehensive"];
        const oldLevel = depth.level;
        depth.level = levels[Math.floor(b * levels.length)];

        return {
            chromosome: "ch23_content_depth",
            property: "level",
            oldValue: oldLevel,
            newValue: depth.level,
            changeType
        };
    }

    private mutatePersonalization(
        personalization: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        const approaches = ["static", "behavior_based", "fully_dynamic"];
        const oldApproach = personalization.approach;
        personalization.approach = approaches[Math.floor(b * approaches.length)];

        return {
            chromosome: "ch24_personalization",
            property: "approach",
            oldValue: oldApproach,
            newValue: personalization.approach,
            changeType
        };
    }

    private mutateCopyEngine(
        copy: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        // Preserve pattern-generated CTA, only apply aggression-level shift
        // rather than overwriting with a generic hardcoded list
        const oldCta = copy.cta;
        const aggressionStyles = ["soft", "direct", "urgent"];
        const style = aggressionStyles[Math.floor(b * aggressionStyles.length)];
        // Keep existing value unless it looks like a raw placeholder
        if (!oldCta || oldCta.includes('{{')) {
            const fallbackCtas = ["Get Started", "Learn More", "Try Free", "Book Demo"];
            copy.cta = fallbackCtas[Math.floor(b * fallbackCtas.length)];
        }
        // For non-placeholder CTAs, leave them as-is (the pattern engine generated them correctly)

        return {
            chromosome: "ch25_copy_engine",
            property: "cta",
            oldValue: oldCta,
            newValue: copy.cta,
            changeType
        };
    }

    private mutateCopyIntelligence(
        intel: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        const registers = ["clinical", "professional", "conversational", "playful", "luxury", "urgent"];
        const oldRegister = intel.emotionalRegister;
        intel.emotionalRegister = registers[Math.floor(b * registers.length)];

        return {
            chromosome: "ch29_copy_intelligence",
            property: "emotionalRegister",
            oldValue: oldRegister,
            newValue: intel.emotionalRegister,
            changeType
        };
    }

    private mutateSector(
        sector: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        const sectors = ["healthcare", "fintech", "technology", "education", "commerce", 
                         "food", "travel", "entertainment", "legal", "automotive"];
        const oldSector = sector.primary;
        sector.primary = sectors[Math.floor(b * sectors.length)];

        return {
            chromosome: "ch0_sector",
            property: "primary",
            oldValue: oldSector,
            newValue: sector.primary,
            changeType
        };
    }

    private mutateSignature(
        signature: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const oldMutation = signature.uniqueMutation;
        // Generate a new mutation identifier based on seed
        signature.uniqueMutation = crypto.createHash("sha256")
            .update(seed + oldMutation)
            .digest("hex")
            .slice(0, 8);

        return {
            chromosome: "ch12_signature",
            property: "uniqueMutation",
            oldValue: oldMutation,
            newValue: signature.uniqueMutation,
            changeType
        };
    }

    private mutateHierarchy(
        hierarchy: any,
        changeType: MutationRecord["changeType"],
        seed: string
    ): MutationRecord {
        const b = this.getHashByte(seed, 1);
        const depths = ["flat", "overlapping", "3d-stack"];
        const oldDepth = hierarchy.depth;
        hierarchy.depth = depths[Math.floor(b * depths.length)];

        return {
            chromosome: "ch10_hierarchy",
            property: "depth",
            oldValue: oldDepth,
            newValue: hierarchy.depth,
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
