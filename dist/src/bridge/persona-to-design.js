/**
 * L0 → L1 Bridge
 *
 * Transforms Creator Persona + Design Intent → L1 Design Genome
 *
 * The simulated designer interprets the project through their unique worldview,
 * creating a design genome that reflects their aesthetic sensibilities,
 * cognitive patterns, and creative instincts.
 */
import { GenomeSequencer } from '../genome/sequencer.js';
import { SemanticTraitExtractor } from '../semantic/extractor.js';
/**
 * Bridge: Creator Persona → Design Genome
 */
export class PersonaDesignBridge {
    sequencer;
    extractor;
    constructor() {
        this.sequencer = new GenomeSequencer();
        this.extractor = new SemanticTraitExtractor();
    }
    /**
     * Generate L1 Design Genome through persona's creative lens
     */
    async generateDesignThroughPersona(persona, intent) {
        // Step 1: Generate creative brief (persona interprets intent)
        const brief = await this.generateBrief(persona, intent);
        // Step 2: Calculate persona influence on design parameters
        const influence = this.calculateInfluence(persona, brief);
        // Step 3: Generate L1 genome with persona-influenced traits + direct chromosome expression
        const genome = await this.generateInfluencedGenome(intent, influence, persona);
        return { genome, brief, influence };
    }
    /**
     * Calculate how persona traits influence design parameters
     */
    calculateInfluence(persona, brief) {
        const genome = persona.genome;
        return {
            hueShift: genome.c0_cultural_vector[0] * 30,
            saturationMod: genome.c6_aesthetic_sensibility[0] * 0.3,
            lightnessMod: genome.c9_material_affinity[1] * 0.2,
            displayFontBias: genome.c7_cognitive_pattern[0],
            bodyFontBias: genome.c7_cognitive_pattern[1],
            trackingMod: genome.c4_authorial_embedding[0] * 0.02,
            densityMod: (genome.c11_chaos_tolerance - 0.5) * 0.4,
            whitespaceMod: (1 - genome.c15_coherence_style) * 0.3,
            asymmetryBias: genome.c8_social_vector[0],
            motionSpeedMod: 0.8 + (genome.c11_chaos_tolerance * 0.4),
            physicsStyle: this.selectPhysics(genome),
            radiusMod: genome.c9_material_affinity[0] * 8,
            elevationMod: genome.c9_material_affinity[2] * 0.5,
            copyTone: persona.instincts.copy_voice,
            metaphorPrimary: brief.metaphor_system.primary,
            metaphorSecondary: brief.metaphor_system.secondary,
        };
    }
    selectPhysics(genome) {
        if (genome.c11_chaos_tolerance > 0.7)
            return 'glitch';
        if (genome.c15_coherence_style > 0.7 && genome.c13_temporal_sense[0] > 0)
            return 'spring';
        if (genome.c15_coherence_style < 0.3)
            return 'step';
        return 'spring';
    }
    async generateBrief(persona, intent) {
        const { generateBrief } = await import('../brief/generator.js');
        return generateBrief(persona, intent);
    }
    /**
     * Generate L1 genome through sequencer with persona-influenced traits,
     * then directly express the persona's latent vectors onto key chromosomes.
     *
     * Two-pass approach:
     * 1. Trait nudging — biases hash-based chromosome selection
     * 2. Chromosome expression — directly sets character-defining chromosome values
     *    so the same intent through different personas produces genuinely different designs.
     */
    async generateInfluencedGenome(intent, influence, persona) {
        // Extract traits from intent — persona context shapes the LLM's analysis
        const analysis = await this.extractor.analyze(intent.description, undefined, {
            biography: persona.biography.origin,
            instincts: persona.instincts.visual_language,
            worldview: persona.worldview.design_philosophy,
            creativeBehavior: persona.creative_behavior.chaos_tolerance > 0.5 ? "experimental" : "systematic",
        });
        const traits = analysis.traits;
        // Apply persona influence to traits
        const influencedTraits = {
            informationDensity: this.clamp(traits.informationDensity + influence.densityMod),
            temporalUrgency: influence.physicsStyle === 'glitch' ? 0.8 : traits.temporalUrgency,
            emotionalTemperature: this.clamp(traits.emotionalTemperature + influence.saturationMod),
            playfulness: this.clamp(influence.motionSpeedMod - 0.8),
            spatialDependency: this.clamp(traits.spatialDependency + influence.elevationMod),
            trustRequirement: intent.sector === 'healthcare' || intent.sector === 'fintech' ? 0.8 : traits.trustRequirement,
            visualEmphasis: influence.whitespaceMod > 0 ? 0.7 : traits.visualEmphasis,
            conversionFocus: traits.conversionFocus,
        };
        // Build sequencer config
        const config = {
            primarySector: intent.sector || 'technology',
            options: {
                copyIntelligence: {
                    industryTerminology: [],
                    emotionalRegister: this.mapToneToRegister(influence.copyTone),
                    formalityLevel: 0.5,
                    ctaAggression: 0.5,
                    headlineStyle: 'benefit_forward',
                    vocabularyComplexity: 'moderate',
                    sentenceStructure: 'balanced',
                    emojiUsage: false,
                    contractionUsage: true,
                }
            }
        };
        // Generate seed from intent + persona
        const seed = `${intent.description}:${influence.metaphorPrimary}:${influence.copyTone}:${Date.now()}`;
        // Pass 1: generate genome from hash + influenced traits
        const genome = this.sequencer.generate(seed, influencedTraits, config);
        // Pass 2: directly express persona latent vectors onto chromosomes
        // This makes same-intent + different-persona produce genuinely distinct designs,
        // not just slight color/density variations.
        this.applyPersonaToChromosomes(genome, persona);
        return genome;
    }
    /**
     * Directly express persona latent vectors onto key L1 chromosomes.
     * These are strong, opinionated overrides — the persona's worldview
     * physically reshapes the design character, not just nudges it.
     */
    applyPersonaToChromosomes(genome, persona) {
        const g = persona.genome;
        const ch = genome.chromosomes;
        // ── Motion physics (ch8) ────────────────────────────────────────
        // c11_chaos_tolerance: ordered (0) → step/none; chaotic (1) → glitch/elastic
        // c7_cognitive_pattern[0]: systematic (0) → step; intuitive (1) → spring
        if (g.c11_chaos_tolerance > 0.75) {
            ch.ch8_motion.physics = 'glitch';
        }
        else if (g.c11_chaos_tolerance < 0.2 && g.c7_cognitive_pattern[0] < 0.4) {
            ch.ch8_motion.physics = 'step';
        }
        else if (g.c7_cognitive_pattern[0] > 0.7) {
            ch.ch8_motion.physics = 'spring';
        }
        else if (g.c11_chaos_tolerance > 0.55) {
            ch.ch8_motion.physics = 'elastic';
        }
        // Duration: ordered personas = slower, more deliberate; chaotic = fast
        ch.ch8_motion.durationScale = this.clamp(0.5 + (1 - g.c11_chaos_tolerance) * 1.0);
        // ── Grid (ch9) ──────────────────────────────────────────────────
        // c11_chaos_tolerance + c7_cognitive_pattern[0] → asymmetry + logic
        ch.ch9_grid.asymmetry = this.clamp((g.c11_chaos_tolerance * 0.6) + (g.c7_cognitive_pattern[0] * 0.4));
        if (g.c11_chaos_tolerance > 0.75) {
            ch.ch9_grid.logic = 'broken';
        }
        else if (g.c7_cognitive_pattern[0] > 0.65) {
            ch.ch9_grid.logic = 'masonry';
        }
        else if (g.c7_cognitive_pattern[0] < 0.3 && g.c11_chaos_tolerance < 0.4) {
            ch.ch9_grid.logic = 'column';
        }
        // ── Rhythm / whitespace (ch2) ────────────────────────────────────
        // c6_aesthetic_sensibility[1]: sparse (0) → empty/breathing; dense (1) → airtight
        const aestheticDensity = g.c6_aesthetic_sensibility?.[1] ?? 0.5;
        if (aestheticDensity < 0.25) {
            ch.ch2_rhythm.density = 'empty';
            ch.ch2_rhythm.negativeSpaceRatio = 0.72;
        }
        else if (aestheticDensity < 0.45) {
            ch.ch2_rhythm.density = 'breathing';
            ch.ch2_rhythm.negativeSpaceRatio = 0.55;
        }
        else if (aestheticDensity > 0.78) {
            ch.ch2_rhythm.density = 'airtight';
            ch.ch2_rhythm.negativeSpaceRatio = 0.18;
        }
        // ── Edge style (ch7) ─────────────────────────────────────────────
        // c9_material_affinity[0]: smooth/digital (0) → sharp; analog/tactile (1) → organic
        const materialAnalog = g.c9_material_affinity?.[0] ?? 0.5;
        if (materialAnalog < 0.18) {
            ch.ch7_edge.radius = 2;
            ch.ch7_edge.style = 'sharp';
            ch.ch7_edge.variableRadius = false;
        }
        else if (materialAnalog > 0.82) {
            ch.ch7_edge.radius = Math.max(ch.ch7_edge.radius ?? 8, 18);
            ch.ch7_edge.style = 'organic';
            ch.ch7_edge.variableRadius = true;
        }
        // ── Atmosphere / FX (ch13) ───────────────────────────────────────
        // c11_chaos_tolerance + c6_aesthetic_sensibility[2] (experimental) → FX intensity + type
        // c12_cross_pollination → unusual/unexpected FX choices
        const experimental = g.c6_aesthetic_sensibility?.[2] ?? 0.5;
        const atmosphereStrength = (g.c11_chaos_tolerance + experimental) / 2;
        if (atmosphereStrength < 0.18) {
            ch.ch13_atmosphere.fx = 'none';
            ch.ch13_atmosphere.intensity = 0;
            ch.ch13_atmosphere.enabled = false;
        }
        else if (g.c12_cross_pollination > 0.72 && g.c11_chaos_tolerance > 0.5) {
            const crossFx = ['chromatic_aberration', 'scanlines', 'pixel_dither', 'holographic'];
            ch.ch13_atmosphere.fx = crossFx[Math.floor(g.c12_cross_pollination * crossFx.length) % crossFx.length];
            ch.ch13_atmosphere.intensity = atmosphereStrength;
            ch.ch13_atmosphere.enabled = true;
        }
        else if ((g.c9_material_affinity?.[0] ?? 0.5) > 0.65) {
            ch.ch13_atmosphere.fx = 'ink_wash';
            ch.ch13_atmosphere.intensity = Math.min(0.7, (g.c9_material_affinity?.[0] ?? 0.5) * 0.8);
            ch.ch13_atmosphere.enabled = true;
        }
        else if (experimental > 0.6 && ch.ch13_atmosphere.fx === 'none') {
            ch.ch13_atmosphere.fx = 'noise_gradient';
            ch.ch13_atmosphere.intensity = experimental * 0.6;
            ch.ch13_atmosphere.enabled = true;
        }
        // ── Motion choreography (ch27) ───────────────────────────────────
        // c7_cognitive_pattern[0]: systematic → ordered cascade; intuitive → simultaneous/hero_first
        // c11_chaos_tolerance: high → burst/simultaneous
        if (g.c7_cognitive_pattern[0] < 0.3) {
            ch.ch27_motion_choreography.entrySequence = 'cascade_down';
            ch.ch27_motion_choreography.staggerInterval = 90;
        }
        else if (g.c11_chaos_tolerance > 0.72) {
            ch.ch27_motion_choreography.entrySequence = 'simultaneous';
            ch.ch27_motion_choreography.staggerInterval = 0;
        }
        else if ((g.c8_social_vector?.[0] ?? 0.5) > 0.7) {
            ch.ch27_motion_choreography.entrySequence = 'hero_first';
            ch.ch27_motion_choreography.staggerInterval = 130;
        }
        // ── Copy intelligence (ch29) ─────────────────────────────────────
        // c8_social_vector[0]: outsider/accessible (0) → low formality; insider/exclusive (1) → high formality
        // c11_chaos_tolerance → CTA aggression
        // c4_authorial_embedding[0] → vocabulary/sentence complexity
        const insiderScore = g.c8_social_vector?.[0] ?? 0.5;
        const linguisticDepth = g.c4_authorial_embedding?.[0] ?? 0.5;
        const observerScore = g.c8_social_vector?.[1] ?? 0.5;
        ch.ch29_copy_intelligence.formalityLevel = this.clamp(0.25 + insiderScore * 0.55);
        ch.ch29_copy_intelligence.ctaAggression = this.clamp(0.25 + g.c11_chaos_tolerance * 0.55);
        if (linguisticDepth < 0.3) {
            ch.ch29_copy_intelligence.vocabularyComplexity = 'simple';
            ch.ch29_copy_intelligence.sentenceStructure = 'short_punchy';
        }
        else if (linguisticDepth > 0.72) {
            ch.ch29_copy_intelligence.vocabularyComplexity = 'technical';
            ch.ch29_copy_intelligence.sentenceStructure = 'complex_periodic';
        }
        if (observerScore < 0.28) {
            ch.ch29_copy_intelligence.emotionalRegister = 'clinical';
        }
        else if (observerScore > 0.72 && g.c11_chaos_tolerance > 0.5) {
            ch.ch29_copy_intelligence.emotionalRegister = 'playful';
        }
        else if (insiderScore > 0.7 && linguisticDepth > 0.6) {
            ch.ch29_copy_intelligence.emotionalRegister = 'luxury';
        }
        // ── Hierarchy / depth (ch10) ─────────────────────────────────────
        // c9_material_affinity[2]: flat (0) → flat depth; elevated (1) → overlapping/3d
        const elevation = g.c9_material_affinity?.[2] ?? 0.5;
        if (elevation < 0.2) {
            ch.ch10_hierarchy.depth = 'flat';
        }
        else if (elevation > 0.75) {
            ch.ch10_hierarchy.depth = 'overlapping';
        }
        // ── Temporal nostalgia (c1) → texture era feel ───────────────────
        // DistributionCurve peak: low position (≈0) = vintage; high (≈1) = contemporary/future
        const nostalgiaPeak = (g.c1_temporal_nostalgia?.points ?? []).reduce((max, p) => p.weight > max.weight ? p : max, { position: 0.5, weight: 0 }).position;
        if (nostalgiaPeak < 0.35) {
            // Vintage nostalgia → analog grain, multiply blend
            ch.ch11_texture.noiseLevel = Math.min(0.45, 0.25 + (0.35 - nostalgiaPeak) * 0.57);
            ch.ch11_texture.grainFrequency = Math.min(0.8, 0.4 + (0.35 - nostalgiaPeak));
            ch.ch11_texture.overlayBlend = 'multiply';
        }
        else if (nostalgiaPeak > 0.68) {
            // Contemporary/future nostalgia → clean surface, low noise
            ch.ch11_texture.noiseLevel = Math.max(0, ch.ch11_texture.noiseLevel - 0.12);
            ch.ch11_texture.overlayBlend = 'none';
        }
        // ── Obsession traversal (c2) → content depth + structure depth ───
        // depth: how deep into a subject; branching_factor: how many tangents
        const obsessionDepth = g.c2_obsession_traversal?.depth ?? 0.5;
        const obsessionBranching = g.c2_obsession_traversal?.branching_factor ?? 0.5;
        if (obsessionDepth > 0.72 && obsessionBranching > 0.5) {
            ch.ch23_content_depth.level = 'encyclopedic';
            ch.ch23_content_depth.estimatedSections = Math.max(ch.ch23_content_depth.estimatedSections, Math.round(4 + obsessionDepth * obsessionBranching * 6));
            ch.ch1_structure.maxNesting = Math.max(ch.ch1_structure.maxNesting, 4);
        }
        else if (obsessionDepth < 0.28 && obsessionBranching < 0.35) {
            ch.ch23_content_depth.level = 'minimal';
            ch.ch23_content_depth.estimatedSections = Math.min(ch.ch23_content_depth.estimatedSections, 3);
            ch.ch1_structure.maxNesting = Math.min(ch.ch1_structure.maxNesting, 2);
        }
        // ── Formative era (c3) → surface material + overlay blend ────────
        // c3[0]: era coordinate (0=vintage/retro, 1=contemporary/futuristic)
        // c3[1]: subculture intensity (0=mainstream, 1=niche/underground)
        const eraPosition = g.c3_formative_era?.[0] ?? 0.5;
        const eraNiche = g.c3_formative_era?.[1] ?? 0.5;
        if (eraPosition < 0.3) {
            ch.ch11_texture.surface = ch.ch11_texture.surface === 'flat' ? 'matte_paper' : ch.ch11_texture.surface;
            ch.ch11_texture.overlayBlend = ch.ch11_texture.overlayBlend === 'none' ? 'multiply' : ch.ch11_texture.overlayBlend;
        }
        else if (eraPosition > 0.75) {
            ch.ch11_texture.surface = 'chrome';
            ch.ch11_texture.overlayBlend = eraNiche > 0.65 ? 'screen' : 'overlay';
        }
        // ── Technical spectrum (c5) → trust signal type + vocabulary ─────
        // c5[0]: overall tech depth (0=intuitive/visual, 1=deeply technical)
        // c5[2]: systems thinking depth
        const techLevel = g.c5_technical_spectrum?.[0] ?? 0.5;
        const systemsIQ = g.c5_technical_spectrum?.[2] ?? 0.5;
        if (techLevel > 0.72) {
            if (ch.ch21_trust_signals.hasTrustSignals) {
                ch.ch21_trust_signals.approach = 'credentials';
            }
            if (ch.ch29_copy_intelligence.vocabularyComplexity !== 'technical') {
                ch.ch29_copy_intelligence.vocabularyComplexity = 'specialized';
            }
        }
        else if (techLevel < 0.28) {
            if (ch.ch21_trust_signals.hasTrustSignals) {
                ch.ch21_trust_signals.approach = 'testimonials';
            }
            ch.ch29_copy_intelligence.vocabularyComplexity = 'simple';
        }
        if (systemsIQ > 0.68 && ch.ch23_content_depth.level === 'minimal') {
            ch.ch23_content_depth.level = 'standard';
        }
        // ── Narrative pattern (c10) → hero type + CTA + content structure ─
        // c10[0]: narrative linearity (0=fragmented, 1=clear linear progression)
        // c10[1]: exposition build (0=in-medias-res/direct, 1=slow-build/context-first)
        const narrativeArc = g.c10_narrative_pattern?.[0] ?? 0.5;
        const expositionBuild = g.c10_narrative_pattern?.[1] ?? 0.5;
        if (narrativeArc > 0.7) {
            ch.ch23_content_depth.hasCTA = true;
            ch.ch23_content_depth.hasTestimonials = true;
            if (ch.ch19_hero_type.hasHero && ch.ch19_hero_type.type === 'product_ui') {
                ch.ch19_hero_type.type = 'stats_counter';
            }
        }
        else if (narrativeArc < 0.28) {
            ch.ch23_content_depth.hasCTA = false;
            if (ch.ch19_hero_type.hasHero && expositionBuild < 0.3) {
                ch.ch19_hero_type.type = 'brand_logo';
            }
        }
        if (expositionBuild > 0.65) {
            ch.ch23_content_depth.hasFAQ = true;
        }
        // ── Sensory weights (c14) → texture intensity + hover + scrollBehavior
        // DistributionCurve positions: 0-0.25=visual, 0.25-0.5=tactile, 0.5-0.75=auditory, 0.75-1=spatial
        const sensoryPoints = g.c14_sensory_weights?.points ?? [];
        const dominantSense = sensoryPoints.length > 0
            ? sensoryPoints.reduce((max, p) => p.weight > max.weight ? p : max, sensoryPoints[0])
            : null;
        const dominantPos = dominantSense?.position ?? 0.5;
        if (dominantPos < 0.25) {
            // Visual dominant → high contrast, strong hover response
            ch.ch8_motion.hoverIntensity = Math.max(ch.ch8_motion.hoverIntensity, 0.72);
            ch.ch20_visual_treatment.colorGrading =
                ch.ch20_visual_treatment.colorGrading === 'natural' ? 'vibrant' : ch.ch20_visual_treatment.colorGrading;
        }
        else if (dominantPos >= 0.25 && dominantPos < 0.5) {
            // Tactile dominant → rough surfaces, prominent grain
            ch.ch11_texture.noiseLevel = Math.max(ch.ch11_texture.noiseLevel, 0.3);
            ch.ch11_texture.grainFrequency = Math.max(ch.ch11_texture.grainFrequency, 0.55);
            ch.ch11_texture.surface = 'canvas';
        }
        else if (dominantPos >= 0.75) {
            // Spatial dominant → depth, overlapping layers, parallax scroll
            ch.ch10_hierarchy.depth = ch.ch10_hierarchy.depth === 'flat' ? 'layered' : ch.ch10_hierarchy.depth;
            ch.ch1_structure.scrollBehavior = 'parallax';
        }
    }
    clamp(val) {
        return Math.max(0, Math.min(1, val));
    }
    mapToneToRegister(tone) {
        const toneLower = tone.toLowerCase();
        if (toneLower.includes('technical') || toneLower.includes('precision'))
            return 'professional';
        if (toneLower.includes('warm') || toneLower.includes('conversational'))
            return 'conversational';
        if (toneLower.includes('poetic') || toneLower.includes('luxury'))
            return 'luxury';
        if (toneLower.includes('playful') || toneLower.includes('wit'))
            return 'playful';
        if (toneLower.includes('clinical') || toneLower.includes('detached'))
            return 'clinical';
        return 'professional';
    }
}
/**
 * Convenience function: Single call to generate design through persona
 */
export async function generateDesignThroughPersona(persona, intent) {
    const bridge = new PersonaDesignBridge();
    return bridge.generateDesignThroughPersona(persona, intent);
}
/**
 * Generate multiple design variations from different personas
 */
export async function generateDesignVariations(intent, personaCount = 3) {
    const { generateCreatorGenome } = await import('../creator/generator.js');
    const { generatePersona } = await import('../brief/generator.js');
    const bridge = new PersonaDesignBridge();
    const variations = [];
    for (let i = 0; i < personaCount; i++) {
        const seed = `${intent.description}:variation-${i}:${Date.now()}`;
        const creatorGenome = generateCreatorGenome(seed);
        const persona = await generatePersona(creatorGenome);
        const result = await bridge.generateDesignThroughPersona(persona, intent);
        variations.push({
            persona,
            ...result,
        });
    }
    return variations;
}
