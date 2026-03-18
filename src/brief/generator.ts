/**
 * Epigenetic Brief Generator
 * 
 * Decodes L0 Creator Genome latent coordinates into creative personas and briefs.
 * Uses LLM (Groq/Gemini/OpenAI) - NO FALLBACK. LLM failures are real failures.
 */

import { 
  CreatorGenome, 
  CreatorPersona, 
  CreativeBrief, 
  DesignIntent 
} from '../creator/types.js';
import { SemanticTraitExtractor } from '../semantic/extractor.js';

/**
 * Latent Space Interpretation
 * Maps continuous coordinates to semantic hints
 */
export interface LatentInterpretation {
  cultural_hint: string;
  temporal_hints: string[];
  aesthetic_hint: string;
  cognitive_hint: string;
  social_hint: string;
  material_hint: string;
  narrative_hint: string;
  sensory_weights: Record<string, number>;
}

// Cache for LLM extractor (lazy init)
let llmExtractor: SemanticTraitExtractor | null = null;

function getLLM(): SemanticTraitExtractor {
  if (!llmExtractor) {
    // Prefer OpenRouter over Groq to avoid rate limits
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    if (openrouterKey) {
      llmExtractor = new SemanticTraitExtractor(openrouterKey, 'openrouter');
    } else {
      llmExtractor = new SemanticTraitExtractor();
    }
  }
  return llmExtractor;
}

/**
 * Decode latent space coordinates into semantic hints
 */
export function decodeLatentSpace(genome: CreatorGenome): LatentInterpretation {
  return {
    cultural_hint: decodeCulturalVector(genome.c0_cultural_vector),
    temporal_hints: decodeTemporalNostalgia(genome.c1_temporal_nostalgia),
    aesthetic_hint: decodeAestheticSensibility(genome.c6_aesthetic_sensibility),
    cognitive_hint: decodeCognitivePattern(genome.c7_cognitive_pattern),
    social_hint: decodeSocialVector(genome.c8_social_vector),
    material_hint: decodeMaterialAffinity(genome.c9_material_affinity),
    narrative_hint: decodeNarrativePattern(genome.c10_narrative_pattern, genome.c4_authorial_embedding),
    sensory_weights: decodeSensoryWeights(genome.c14_sensory_weights),
  };
}

/**
 * Generate persona from genome using LLM
 * NO FALLBACK - if LLM fails, this fails
 */
export async function generatePersona(genome: CreatorGenome): Promise<CreatorPersona> {
  const llm = getLLM();
  return generatePersonaWithLLM(genome, llm);
}

/**
 * Generate creative brief from persona and intent using LLM
 * NO FALLBACK - if LLM fails, this fails
 */
export async function generateBrief(
  persona: CreatorPersona, 
  intent: DesignIntent
): Promise<CreativeBrief> {
  const llm = getLLM();
  return generateBriefWithLLM(persona, intent, llm);
}

// ===== LLM GENERATION =====

async function generatePersonaWithLLM(
  genome: CreatorGenome,
  llm: SemanticTraitExtractor
): Promise<CreatorPersona> {
  const interp = decodeLatentSpace(genome);
  
  const prompt = `Generate a fictional designer persona with these specific latent characteristics:

CULTURAL BACKGROUND: ${interp.cultural_hint}
TEMPORAL NOSTALGIA: ${interp.temporal_hints.join(', ')}
AESTHETIC SENSIBILITY: ${interp.aesthetic_hint}
COGNITIVE STYLE: ${interp.cognitive_hint}
SOCIAL POSITIONING: ${interp.social_hint}
MATERIAL PREFERENCE: ${interp.material_hint}
NARRATIVE INSTINCT: ${interp.narrative_hint}
SENSORY PRIORITIES: ${JSON.stringify(interp.sensory_weights)}

CHAOS TOLERANCE: ${genome.c11_chaos_tolerance.toFixed(2)} (0=strict, 1=chaotic)
CROSS-POLLINATION: ${genome.c12_cross_pollination.toFixed(2)} (0=focused, 1=eclectic)
COHERENCE STYLE: ${genome.c15_coherence_style > 0.6 ? 'integrated' : genome.c15_coherence_style > 0.3 ? 'contradictory' : 'fragmented'}

Generate a detailed persona. Make them feel like a real person with specific quirks, not an archetype. Include surprising details.

CRITICAL: The copy_voice MUST be a unique, descriptive phrase (2-4 words) that captures their writing style. NOT a category. Examples: "whispered technical poetry", "aggressive academic precision", "warm conspiratorial tone", "detached observational clarity".

Return ONLY valid JSON:
{
  "biography": {
    "origin": "specific geographic/cultural background",
    "formative_years": "youth influences and pivots",
    "journey": "career/life path",
    "current": "present context",
    "contradictions": ["2-3 internal tensions"]
  },
  "instincts": {
    "visual_language": ["3-4 descriptive phrases"],
    "interaction_metaphors": ["2-3 metaphors"],
    "aesthetic_principles": ["2-3 principles"],
    "copy_voice": "UNIQUE descriptive phrase (2-4 words), NOT a category"
  },
  "worldview": {
    "core_metaphor": "how they see the world",
    "design_philosophy": "their stance on design",
    "unusual_connections": ["2-3 unexpected domain bridges"],
    "blind_spots": ["1-2 things they miss"]
  }
}`;

  const response = await llm.callText(prompt);
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON in LLM response');
  }
  
  const parsed = JSON.parse(jsonMatch[0]);
  
  // Validate required fields
  if (!parsed.biography?.contradictions?.length) {
    throw new Error('Persona missing contradictions');
  }
  if (!parsed.instincts?.copy_voice) {
    throw new Error('Persona missing copy_voice');
  }
  
  return {
    id: genome.dna_hash,
    biography: parsed.biography,
    instincts: parsed.instincts,
    worldview: parsed.worldview,
    creative_behavior: {
      chaos_tolerance: genome.c11_chaos_tolerance,
      cross_pollination: genome.c12_cross_pollination,
      coherence_style: genome.c15_coherence_style > 0.6 ? 'integrated' : 
                       genome.c15_coherence_style > 0.3 ? 'contradictory' : 'fragmented',
    },
    genome,
  };
}

async function generateBriefWithLLM(
  persona: CreatorPersona,
  intent: DesignIntent,
  llm: SemanticTraitExtractor
): Promise<CreativeBrief> {
  
  const prompt = `You are a designer with this background: ${persona.biography.origin}

Your design philosophy: ${persona.worldview.design_philosophy}
You see the world as: ${persona.worldview.core_metaphor}
You write in a ${persona.instincts.copy_voice} voice.
Your visual language: ${persona.instincts.visual_language.join(', ')}

CHAOS TOLERANCE: ${persona.creative_behavior.chaos_tolerance.toFixed(2)}
CROSS-POLLINATION: ${persona.creative_behavior.cross_pollination.toFixed(2)}

A client comes to you with: "${intent.description}"
${intent.sector ? `Sector: ${intent.sector}` : ''}
${intent.audience ? `Audience: ${intent.audience}` : ''}

As this persona, generate a creative brief. Return ONLY valid JSON:
{
  "concept": {
    "statement": "What if...",
    "insight": "The creative insight",
    "tension": "Productive friction"
  },
  "metaphor_system": {
    "primary": "main metaphor",
    "secondary": "counterpoint metaphor",
    ${persona.creative_behavior.chaos_tolerance > 0.6 ? '"tertiary": "unexpected disruption",' : ''}
    "tension_description": "how they interact"
  },
  "design_principles": ["3-4 principles"],
  "component_language": {
    "buttons": "how buttons work",
    "navigation": "how navigation works",
    "forms": "how forms work",
    "cards": "how cards work",
    "feedback": "success/error states"
  },
  "sensory_design": {
    "visual_approach": "...",
    "motion_philosophy": "...",
    "texture_strategy": "...",
    "sound_feel": "..."
  },
  "copy_system": {
    "voice_description": "...",
    "vocabulary_tendencies": ["..."],
    "sentence_patterns": ["..."],
    "microcopy_examples": {
      "submit": "...",
      "cancel": "...",
      "loading": "...",
      "success": "...",
      "error": "..."
    }
  }
}`;

  const response = await llm.callText(prompt);
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON in LLM response');
  }
  
  const parsed = JSON.parse(jsonMatch[0]);
  
  return {
    id: `${persona.id}:BRIEF:${Date.now()}`,
    concept: parsed.concept,
    metaphor_system: parsed.metaphor_system,
    design_principles: parsed.design_principles,
    component_language: parsed.component_language,
    sensory_design: parsed.sensory_design,
    copy_system: parsed.copy_system,
    generated_by: persona,
    generation_metadata: {
      timestamp: Date.now(),
      intent,
      mutation_applied: persona.creative_behavior.chaos_tolerance > 0.6,
      cross_pollination_applied: persona.creative_behavior.cross_pollination > 0.6,
    },
  };
}

// ===== LATENT DECODERS (for LLM context) =====

function decodeCulturalVector(vec: number[] | undefined): string {
  if (!vec || vec.length < 3) return "Transitional/Mixed, suburban/small-city, balanced exposure";
  const [x, y, z] = vec;
  const regions: string[] = [];
  
  if (x > 0.3) regions.push("Mediterranean/European");
  else if (x < -0.3) regions.push("East Asian/Pacific");
  else regions.push("Transitional/Mixed");

  if (y > 0.3) regions.push("post-industrial urban");
  else if (y < -0.3) regions.push("traditional/agrarian roots");
  else regions.push("suburban/small-city");

  if (z > 0.3) regions.push("globalized/cosmopolitan");
  else if (z < -0.3) regions.push("regional/local identity");
  else regions.push("balanced exposure");

  return regions.join(', ');
}

function decodeTemporalNostalgia(curve: { points: { position: number; weight: number }[] } | undefined): string[] {
  if (!curve?.points || !Array.isArray(curve.points)) {
    return ['moderate contemporary'];
  }
  return curve.points.slice(0, 3).map(p => {
    const year = 1900 + (p.position ?? 0.5) * 130;
    const weight = p.weight ?? 0.5;
    const intensity = weight > 0.7 ? 'strong' : weight > 0.4 ? 'moderate' : 'subtle';
    
    if (year < 1940) return `${intensity} early-20th-century`;
    if (year < 1970) return `${intensity} mid-century`;
    if (year < 1990) return `${intensity} late-20th-century`;
    if (year < 2005) return `${intensity} early-digital era`;
    return `${intensity} contemporary`;
  });
}

function decodeAestheticSensibility(vec: number[] | undefined): string {
  if (!vec || vec.length < 3) return 'eclectic';
  const [a1, a2, a3] = vec;
  const prefs: string[] = [];
  
  if (a1 > 0.3) prefs.push("minimal");
  else if (a1 < -0.3) prefs.push("maximal");
  
  if (a2 > 0.3) prefs.push("precise");
  else if (a2 < -0.3) prefs.push("organic");
  
  if (a3 > 0.3) prefs.push("clean");
  else if (a3 < -0.3) prefs.push("textured");

  return prefs.length > 0 ? prefs.join(', ') : 'eclectic';
}

function decodeCognitivePattern(vec: number[] | undefined): string {
  if (!vec || vec.length < 3) return 'balanced';
  const [c1, c2, c3] = vec;
  const patterns: string[] = [];
  
  if (c1 > 0.3) patterns.push("systematic");
  else if (c1 < -0.3) patterns.push("intuitive");
  
  if (c2 > 0.3) patterns.push("abstract");
  else if (c2 < -0.3) patterns.push("concrete");
  
  if (c3 > 0.3) patterns.push("analytical");
  else if (c3 < -0.3) patterns.push("holistic");

  return patterns.length > 0 ? patterns.join('/') : 'balanced';
}

function decodeSocialVector(vec: number[] | undefined): string {
  if (!vec || vec.length < 2) return 'observer';
  const [s1, s2] = vec;
  const positions: string[] = [];
  
  if (s1 > 0.3) positions.push("outsider");
  else if (s1 < -0.3) positions.push("insider");
  
  if (s2 > 0.3) positions.push("rebel");
  else if (s2 < -0.3) positions.push("traditional");

  return positions.length > 0 ? positions.join('/') : 'observer';
}

function decodeMaterialAffinity(vec: number[] | undefined): string {
  if (!vec || vec.length < 3) return 'material-agnostic';
  const [m1, m2, m3] = vec;
  const materials: string[] = [];
  
  if (m1 > 0.3) materials.push("digital");
  else if (m1 < -0.3) materials.push("analog");
  
  if (m2 > 0.3) materials.push("polished");
  else if (m2 < -0.3) materials.push("rough");
  
  if (m3 > 0.3) materials.push("synthetic");
  else if (m3 < -0.3) materials.push("natural");

  return materials.length > 0 ? materials.join(', ') : 'material-agnostic';
}

function decodeNarrativePattern(vec: number[] | undefined, authorial: number[] | undefined): string {
  const n1 = vec?.[0] ?? 0;
  const a1 = authorial?.[0] ?? 0;
  const a2 = authorial?.[1] ?? 0;
  
  const patterns: string[] = [];
  if (n1 > 0.3) patterns.push("hero-journey");
  else if (n1 < -0.3) patterns.push("fragmented");
  else patterns.push("processual");
  
  const voices: string[] = [];
  if (a1 > 0.3) voices.push("technical");
  else if (a1 < -0.3) voices.push("poetic");
  if (a2 > 0.3) voices.push("direct");
  else if (a2 < -0.3) voices.push("allusive");

  return `${patterns.join(' ')} ${voices.length > 0 ? 'with ' + voices.join('/') + ' voice' : ''}`;
}

function decodeSensoryWeights(curve: { points: { position: number; weight: number }[] } | undefined): Record<string, number> {
  const senses = ['visual', 'tactile', 'auditory', 'spatial', 'kinesthetic'];
  const weights: Record<string, number> = {};
  
  if (!curve?.points || !Array.isArray(curve.points)) {
    // Return default equal weights
    senses.forEach((sense, i) => {
      weights[sense] = 0.2;
    });
    return weights;
  }
  
  curve.points.forEach((p, i) => {
    weights[senses[i] || `sense_${i}`] = p.weight ?? 0.2;
  });
  
  return weights;
}
