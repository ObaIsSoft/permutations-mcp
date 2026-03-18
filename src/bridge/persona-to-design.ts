/**
 * L0 → L1 Bridge
 * 
 * Transforms Creator Persona + Design Intent → L1 Design Genome
 * 
 * The simulated designer interprets the project through their unique worldview,
 * creating a design genome that reflects their aesthetic sensibilities,
 * cognitive patterns, and creative instincts.
 */

import { CreatorPersona, CreativeBrief, DesignIntent } from '../creator/types.js';
import { DesignGenome, ContentTraits, PrimarySector } from '../genome/types.js';
import { GenomeSequencer, SequencerConfig } from '../genome/sequencer.js';
import { SemanticTraitExtractor } from '../semantic/extractor.js';

/**
 * Persona influence on design genome generation
 */
interface PersonaInfluence {
  hueShift: number;
  saturationMod: number;
  lightnessMod: number;
  displayFontBias: number;
  bodyFontBias: number;
  trackingMod: number;
  densityMod: number;
  whitespaceMod: number;
  asymmetryBias: number;
  motionSpeedMod: number;
  physicsStyle: 'spring' | 'glitch' | 'step' | 'none';
  radiusMod: number;
  elevationMod: number;
  copyTone: string;
  metaphorPrimary: string;
  metaphorSecondary: string;
}

/**
 * Bridge: Creator Persona → Design Genome
 */
export class PersonaDesignBridge {
  private sequencer: GenomeSequencer;
  private extractor: SemanticTraitExtractor;

  constructor() {
    this.sequencer = new GenomeSequencer();
    this.extractor = new SemanticTraitExtractor();
  }

  /**
   * Generate L1 Design Genome through persona's creative lens
   */
  async generateDesignThroughPersona(
    persona: CreatorPersona,
    intent: DesignIntent
  ): Promise<{
    genome: DesignGenome;
    brief: CreativeBrief;
    influence: PersonaInfluence;
  }> {
    
    // Step 1: Generate creative brief (persona interprets intent)
    const brief = await this.generateBrief(persona, intent);
    
    // Step 2: Calculate persona influence on design parameters
    const influence = this.calculateInfluence(persona, brief);
    
    // Step 3: Generate L1 genome with persona-influenced traits
    const genome = await this.generateInfluencedGenome(
      intent,
      influence
    );
    
    return { genome, brief, influence };
  }

  /**
   * Calculate how persona traits influence design parameters
   */
  calculateInfluence(
    persona: CreatorPersona,
    brief: CreativeBrief
  ): PersonaInfluence {
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

  private selectPhysics(genome: CreatorPersona['genome']): PersonaInfluence['physicsStyle'] {
    if (genome.c11_chaos_tolerance > 0.7) return 'glitch';
    if (genome.c15_coherence_style > 0.7 && genome.c13_temporal_sense[0] > 0) return 'spring';
    if (genome.c15_coherence_style < 0.3) return 'step';
    return 'spring';
  }

  private async generateBrief(
    persona: CreatorPersona,
    intent: DesignIntent
  ): Promise<CreativeBrief> {
    const { generateBrief } = await import('../brief/generator.js');
    return generateBrief(persona, intent);
  }

  /**
   * Generate L1 genome through sequencer with persona-influenced traits
   */
  private async generateInfluencedGenome(
    intent: DesignIntent,
    influence: PersonaInfluence
  ): Promise<DesignGenome> {
    
    // Extract traits from intent
    const traits = await this.extractor.extractTraits(intent.description);
    
    // Apply persona influence to traits
    const influencedTraits: ContentTraits = {
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
    const config: SequencerConfig = {
      primarySector: (intent.sector as PrimarySector) || 'technology',
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
    
    // Generate genome through sequencer
    return this.sequencer.generate(seed, influencedTraits, config);
  }

  clamp(val: number): number {
    return Math.max(0, Math.min(1, val));
  }

  private mapToneToRegister(tone: string): 'clinical' | 'professional' | 'conversational' | 'playful' | 'luxury' | 'urgent' {
    const toneLower = tone.toLowerCase();
    if (toneLower.includes('technical') || toneLower.includes('precision')) return 'professional';
    if (toneLower.includes('warm') || toneLower.includes('conversational')) return 'conversational';
    if (toneLower.includes('poetic') || toneLower.includes('luxury')) return 'luxury';
    if (toneLower.includes('playful') || toneLower.includes('wit')) return 'playful';
    if (toneLower.includes('clinical') || toneLower.includes('detached')) return 'clinical';
    return 'professional';
  }
}

/**
 * Convenience function: Single call to generate design through persona
 */
export async function generateDesignThroughPersona(
  persona: CreatorPersona,
  intent: DesignIntent
): Promise<{
  genome: DesignGenome;
  brief: CreativeBrief;
  influence: PersonaInfluence;
}> {
  const bridge = new PersonaDesignBridge();
  return bridge.generateDesignThroughPersona(persona, intent);
}

/**
 * Generate multiple design variations from different personas
 */
export async function generateDesignVariations(
  intent: DesignIntent,
  personaCount: number = 3
): Promise<Array<{
  persona: CreatorPersona;
  genome: DesignGenome;
  brief: CreativeBrief;
}>> {
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

export type { PersonaInfluence };
