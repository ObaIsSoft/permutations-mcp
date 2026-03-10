/**
 * Permutations MCP - Genome System
 *
 * Main exports for the design genome system
 */
// Sector Profiles
export { SECTOR_PROFILES, getSectorProfile, classifySubSector, selectColorFromProfile, colorNameToHSL, isValidSector } from './sector-profiles.js';
// Sequencer
export { GenomeSequencer } from './sequencer.js';
// Extractor
export { ContentExtractor } from './extractor.js';
// Constraint Solver
export { GenomeConstraintSolver } from './constraint-solver.js';
// Archetypes
export { ARCHETYPES, detectArchetype } from './archetypes.js';
// Generators
export { CSSGenerator } from '../css-generator.js';
export { HTMLGenerator } from '../html-generator.js';
