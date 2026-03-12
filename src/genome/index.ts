/**
 * Permutations MCP - Genome System
 * 
 * Main exports for the design genome system
 */

// Types
export {
    // Extended Types
    PrimarySector,
    SecondarySector,
    SubSector,
    HeroType,
    HeroLayoutVariant,
    TrustApproach,
    TrustProminence,
    TypeCharge,
    MotionPhysics,
    EdgeStyle,
    VisualTreatment,
    VideoStrategy,
    ContentDepth,
    InformationArchitecture,
    PersonalizationApproach,
    BrandConfiguration,
    GenerationOptions,
    ContentTraits,
    HeroConfig,
    TypographyScale,
    AccessibilityProfile,
    RenderingStrategy,
    SocialProofType,
    ImpactDemonstration,
    DesignGenome
} from './types.js';

// Sector Profiles
export {
    getSectorProfile,
    classifySubSector,
    isValidSector,
    SUB_SECTOR_KEYWORDS
} from './sector-profiles.js';

// Sequencer
export { GenomeSequencer, SequencerConfig } from './sequencer.js';

// Extractors
export { ContentExtractor, AnalyzedContent, ExtractionResult } from './extractor.js';
export { SemanticTraitExtractor } from '../semantic/extractor.js';

// Constraint Solver
export { GenomeConstraintSolver, SolverResult } from './constraint-solver.js';

// Epigenetics
export { EpigeneticData } from './epigenetics.js';

// Archetypes
export { ARCHETYPES, detectArchetype, FunctionalArchetype } from './archetypes.js';

// Generators
export { CSSGenerator, CSSGenerationOptions } from '../css-generator.js';
export { HTMLGenerator, HTMLGenerationOptions } from '../html-generator.js';

// File Writer
export { DesignFileWriter, WriteOptions, WrittenFiles, FileOutput } from '../generators/file-writer.js';

// Format Generators
export { FormatGenerator, FormatOptions, GeneratedFormat } from '../generators/format-generators.js';
