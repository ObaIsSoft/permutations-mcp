/**
 * L0 Creator Genome Generator
 * 
 * Generates latent space coordinates from seeds.
 * Not random - deterministic from seed for reproducibility.
 * Not categorical - pure continuous values for infinite diversity.
 */

import { 
  CreatorGenome, 
  LatentVector, 
  DistributionCurve, 
  GraphTraversal 
} from './types.js';

/**
 * Seeded random number generator (Mulberry32)
 * Deterministic from seed - same seed = same genome
 */
class SeededRandom {
  private state: number;

  constructor(seed: string) {
    // Hash seed to initial state
    let h = 1779033703 ^ seed.length;
    for (let i = 0; i < seed.length; i++) {
      h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
      h = h << 13 | h >>> 19;
    }
    this.state = h;
  }

  // Returns float in [0, 1)
  next(): number {
    let t = this.state += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  // Returns float in [min, max)
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  // Returns float in [-1, 1)
  signed(): number {
    return this.range(-1, 1);
  }

  // Gaussian distribution (Box-Muller)
  gaussian(mean: number = 0, stdDev: number = 1): number {
    const u1 = this.next();
    const u2 = this.next();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * stdDev + mean;
  }

  // Vector of n dimensions in [-1, 1]
  vector(n: number): LatentVector {
    return Array.from({ length: n }, () => this.signed());
  }
}

/**
 * Extracted style snapshot from URL scraping
 * Used to seed L0 genome with inherited traits
 */
export interface ExtractedStyleSnapshot {
  colors?: {
    primary?: string | null;
    secondary?: string | null;
    background?: string | null;
    text?: string | null;
  };
  typography?: {
    headingFont?: string | null;
    bodyFont?: string | null;
    baseSize?: number;
    lineHeight?: number;
  };
  layout?: {
    density?: 'low' | 'medium' | 'high' | 'compact' | 'normal' | 'spacious';
    edgeStyle?: 'sharp' | 'soft' | 'rounded';
    borderRadius?: number;
  };
  animation?: {
    hasAnimations?: boolean;
    style?: 'minimal' | 'moderate' | 'heavy';
    complexity?: 'minimal' | 'functional' | 'expressive';
  };
}

/**
 * Generate Creator Genome from seed
 */
export function generateCreatorGenome(seed: string): CreatorGenome {
  const rng = new SeededRandom(seed);

  return {
    // c0: Cultural vector (3D) - geographic/cultural latent position
    c0_cultural_vector: rng.vector(3),

    // c1: Temporal nostalgia - weighted distribution across decades
    c1_temporal_nostalgia: generateTemporalNostalgia(rng),

    // c2: Obsession traversal - knowledge graph exploration
    c2_obsession_traversal: generateObsessionTraversal(rng),

    // c3: Formative era (2D) - youth culture coordinates
    c3_formative_era: rng.vector(2),

    // c4: Authorial voice (4D) - linguistic style embedding
    c4_authorial_embedding: rng.vector(4),

    // c5: Technical spectrum (5D) - capabilities + blind spots
    c5_technical_spectrum: rng.vector(5),

    // c6: Aesthetic sensibility (3D) - taste coordinates
    c6_aesthetic_sensibility: rng.vector(3),

    // c7: Cognitive pattern (3D) - thinking style
    c7_cognitive_pattern: rng.vector(3),

    // c8: Social vector (2D) - positioning in culture
    c8_social_vector: rng.vector(2),

    // c9: Material affinity (3D) - texture/material preferences
    c9_material_affinity: rng.vector(3),

    // c10: Narrative pattern (2D) - storytelling approach
    c10_narrative_pattern: rng.vector(2),

    // c11: Chaos tolerance (scalar) - mutation rate
    c11_chaos_tolerance: rng.range(0.1, 0.9), // Avoid extremes

    // c12: Cross-pollination (scalar) - domain bridging
    c12_cross_pollination: rng.range(0.1, 0.9),

    // c13: Temporal sense (2D) - perception of time
    c13_temporal_sense: rng.vector(2),

    // c14: Sensory weights - which senses dominate
    c14_sensory_weights: generateSensoryWeights(rng),

    // c15: Coherence style (scalar) - trait integration
    c15_coherence_style: rng.range(0, 1),

    // Metadata
    seed,
    dna_hash: computeDNAHash(seed, rng),
    generation_timestamp: Date.now(),
  };
}

/**
 * Generate temporal nostalgia distribution
 * Creates weighted nostalgia across decades 1900-2030
 */
function generateTemporalNostalgia(rng: SeededRandom): DistributionCurve {
  const numPeaks = Math.floor(rng.range(1, 4)); // 1-3 nostalgia peaks
  const points: { position: number; weight: number }[] = [];

  for (let i = 0; i < numPeaks; i++) {
    // Position: year normalized to 0-1 (1900-2030)
    const year = rng.range(1900, 2030);
    const position = (year - 1900) / 130;
    
    // Weight: how strong the nostalgia (0.3-1.0)
    const weight = rng.range(0.3, 1.0);
    
    points.push({ position, weight });
  }

  // Sort by position
  points.sort((a, b) => a.position - b.position);

  return {
    points,
    interpolation: rng.next() > 0.5 ? 'gaussian' : 'linear',
  };
}

/**
 * Generate obsession traversal parameters
 */
function generateObsessionTraversal(rng: SeededRandom): GraphTraversal {
  return {
    origin_domain: rng.signed(), // Latent coordinate for starting domain
    depth: rng.range(0.2, 0.9),  // How deep into rabbit holes
    branching_factor: rng.range(0.1, 0.8), // How many tangents
    connection_strength: rng.range(0.2, 0.9), // Weak vs strong associations
  };
}

/**
 * Generate sensory priority weights
 */
function generateSensoryWeights(rng: SeededRandom): DistributionCurve {
  const senses = ['visual', 'tactile', 'auditory', 'spatial', 'kinesthetic'];
  
  // Generate random weights
  let weights = senses.map(() => rng.range(0.1, 1.0));
  
  // Normalize to sum to 1
  const sum = weights.reduce((a, b) => a + b, 0);
  weights = weights.map(w => w / sum);

  return {
    points: senses.map((sense, i) => ({
      position: i / (senses.length - 1), // Evenly spaced
      weight: weights[i],
    })),
    interpolation: 'linear',
  };
}

/**
 * Compute DNA hash for traceability
 */
function computeDNAHash(seed: string, rng: SeededRandom): string {
  // Use the RNG state to create a hash
  // This ensures the hash reflects the actual generated values
  const hashInput = `${seed}:${rng.next()}:${rng.next()}:${Date.now()}`;
  
  // Simple hash function (in production, use crypto)
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return `CREATOR_${Math.abs(hash).toString(16).toUpperCase()}`;
}

/**
 * Mutate an existing genome with controlled chaos
 */
export function mutateGenome(
  genome: CreatorGenome, 
  mutationSeed: string,
  intensity: number = 0.3
): CreatorGenome {
  const rng = new SeededRandom(mutationSeed);
  
  const mutateVector = (vec: LatentVector): LatentVector => {
    return vec.map(v => {
      const mutation = rng.gaussian(0, intensity);
      return Math.max(-1, Math.min(1, v + mutation)); // Clamp to [-1, 1]
    });
  };

  const mutateScalar = (val: number): number => {
    const mutation = rng.gaussian(0, intensity * 0.5);
    return Math.max(0, Math.min(1, val + mutation));
  };

  return {
    ...genome,
    c0_cultural_vector: mutateVector(genome.c0_cultural_vector),
    c3_formative_era: mutateVector(genome.c3_formative_era),
    c4_authorial_embedding: mutateVector(genome.c4_authorial_embedding),
    c5_technical_spectrum: mutateVector(genome.c5_technical_spectrum),
    c6_aesthetic_sensibility: mutateVector(genome.c6_aesthetic_sensibility),
    c7_cognitive_pattern: mutateVector(genome.c7_cognitive_pattern),
    c8_social_vector: mutateVector(genome.c8_social_vector),
    c9_material_affinity: mutateVector(genome.c9_material_affinity),
    c10_narrative_pattern: mutateVector(genome.c10_narrative_pattern),
    c13_temporal_sense: mutateVector(genome.c13_temporal_sense),
    c11_chaos_tolerance: mutateScalar(genome.c11_chaos_tolerance),
    c12_cross_pollination: mutateScalar(genome.c12_cross_pollination),
    c15_coherence_style: mutateScalar(genome.c15_coherence_style),
    seed: `${genome.seed}:MUTATED:${mutationSeed}`,
    dna_hash: computeDNAHash(`${genome.seed}:MUTATED:${mutationSeed}`, rng),
    generation_timestamp: Date.now(),
  };
}

/**
 * Generate Creator Genome from extracted URL style snapshot
 * Inherits visual traits while maintaining unique persona DNA
 */
export function generateCreatorGenomeFromSnapshot(
  seed: string, 
  snapshot: ExtractedStyleSnapshot
): CreatorGenome {
  const rng = new SeededRandom(seed);
  
  // Base genome from seed
  const base = generateCreatorGenome(seed);
  
  // Override with epigenetic influence from extracted snapshot
  return {
    ...base,
    
    // c6: Aesthetic sensibility - influenced by color palette
    c6_aesthetic_sensibility: [
      // High saturation in extracted colors → maximal preference
      snapshot.colors?.primary && isVibrant(snapshot.colors.primary) ? 0.4 : rng.signed(),
      // Clean layout → precise preference  
      snapshot.layout?.density === 'low' ? 0.5 : rng.signed(),
      // Rounded edges → clean preference
      snapshot.layout?.edgeStyle === 'rounded' ? 0.4 : 
        snapshot.layout?.edgeStyle === 'sharp' ? -0.3 : rng.signed(),
    ],
    
    // c9: Material affinity - influenced by edge style and density
    c9_material_affinity: [
      snapshot.layout?.edgeStyle === 'sharp' ? -0.4 : 
        snapshot.layout?.edgeStyle === 'rounded' ? 0.4 : rng.signed(),
      snapshot.layout?.density === 'high' ? 0.5 : 
        snapshot.layout?.density === 'low' ? -0.3 : rng.signed(),
      rng.signed(),
    ],
    
    // c11: Chaos tolerance - influenced by animation style
    c11_chaos_tolerance: snapshot.animation?.style === 'heavy' ? 0.7 :
                         snapshot.animation?.style === 'moderate' ? 0.5 :
                         snapshot.animation?.hasAnimations === false ? 0.2 :
                         rng.range(0.1, 0.9),
    
    // c15: Coherence style - influenced by layout density
    c15_coherence_style: snapshot.layout?.density === 'high' ? 0.3 :
                         snapshot.layout?.density === 'low' ? 0.8 :
                         rng.range(0, 1),
    
    // Metadata reflects hybrid origin
    seed: `${seed}:EPIGENETIC:${JSON.stringify(snapshot).slice(0, 50)}`,
    dna_hash: `URL_${base.dna_hash}`,
    generation_timestamp: Date.now(),
  };
}

/**
 * Check if a hex color is vibrant (high saturation)
 */
function isVibrant(hex: string): boolean {
  // Simple check - if not grayscale-ish
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  return (max - min) > 30; // Not grayscale
}

/**
 * Convert hex to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Cross two genomes to create offspring
 */
export function crossoverGenomes(
  parentA: CreatorGenome,
  parentB: CreatorGenome,
  offspringSeed: string
): CreatorGenome {
  const rng = new SeededRandom(offspringSeed);

  const blendVectors = (a: LatentVector, b: LatentVector): LatentVector => {
    const t = rng.range(0.3, 0.7); // Don't go too extreme
    return a.map((v, i) => v * t + (b[i] || 0) * (1 - t));
  };

  const blendScalars = (a: number, b: number): number => {
    const t = rng.range(0.3, 0.7);
    return a * t + b * (1 - t);
  };

  return {
    c0_cultural_vector: blendVectors(parentA.c0_cultural_vector, parentB.c0_cultural_vector),
    c1_temporal_nostalgia: Math.random() > 0.5 ? parentA.c1_temporal_nostalgia : parentB.c1_temporal_nostalgia,
    c2_obsession_traversal: {
      origin_domain: rng.signed(),
      depth: blendScalars(parentA.c2_obsession_traversal.depth, parentB.c2_obsession_traversal.depth),
      branching_factor: blendScalars(parentA.c2_obsession_traversal.branching_factor, parentB.c2_obsession_traversal.branching_factor),
      connection_strength: blendScalars(parentA.c2_obsession_traversal.connection_strength, parentB.c2_obsession_traversal.connection_strength),
    },
    c3_formative_era: blendVectors(parentA.c3_formative_era, parentB.c3_formative_era),
    c4_authorial_embedding: blendVectors(parentA.c4_authorial_embedding, parentB.c4_authorial_embedding),
    c5_technical_spectrum: blendVectors(parentA.c5_technical_spectrum, parentB.c5_technical_spectrum),
    c6_aesthetic_sensibility: blendVectors(parentA.c6_aesthetic_sensibility, parentB.c6_aesthetic_sensibility),
    c7_cognitive_pattern: blendVectors(parentA.c7_cognitive_pattern, parentB.c7_cognitive_pattern),
    c8_social_vector: blendVectors(parentA.c8_social_vector, parentB.c8_social_vector),
    c9_material_affinity: blendVectors(parentA.c9_material_affinity, parentB.c9_material_affinity),
    c10_narrative_pattern: blendVectors(parentA.c10_narrative_pattern, parentB.c10_narrative_pattern),
    c11_chaos_tolerance: blendScalars(parentA.c11_chaos_tolerance, parentB.c11_chaos_tolerance),
    c12_cross_pollination: blendScalars(parentA.c12_cross_pollination, parentB.c12_cross_pollination),
    c13_temporal_sense: blendVectors(parentA.c13_temporal_sense, parentB.c13_temporal_sense),
    c14_sensory_weights: Math.random() > 0.5 ? parentA.c14_sensory_weights : parentB.c14_sensory_weights,
    c15_coherence_style: blendScalars(parentA.c15_coherence_style, parentB.c15_coherence_style),
    seed: `${parentA.seed}:CROSS:${parentB.seed}:${offspringSeed}`,
    dna_hash: computeDNAHash(`${parentA.seed}:CROSS:${parentB.seed}:${offspringSeed}`, rng),
    generation_timestamp: Date.now(),
  };
}
