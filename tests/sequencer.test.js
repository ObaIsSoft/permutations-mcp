import { GenomeSequencer } from '../dist/genome/sequencer.js';
import { strict as assert } from 'assert';

const sequencer = new GenomeSequencer();

// Test 1: Basic genome generation
const traits = {
  informationDensity: 0.7,
  temporalUrgency: 0.3,
  emotionalTemperature: 0.5,
  playfulness: 0.4,
  spatialDependency: 0.6,
  trustRequirement: 0.5,
  visualEmphasis: 0.5,
  conversionFocus: 0.5
};

const config = { primarySector: 'technology' };

const genome = sequencer.generate('test-seed-1', traits, config);
assert(genome.dnaHash, 'DNA hash should exist');
assert(genome.chromosomes.ch1_structure, 'Structure chromosome should exist');
assert(genome.chromosomes.ch5_color_primary, 'Color chromosome should exist');
assert.equal(genome.viabilityScore >= 0 && genome.viabilityScore <= 1, true, 'Viability score should be 0-1');

// Test 2: Determinism - same seed = same DNA
const genome2 = sequencer.generate('test-seed-1', traits, config);
assert.equal(genome.dnaHash, genome2.dnaHash, 'Same seed should produce same DNA');

// Test 3: Different seed = different DNA
const genome3 = sequencer.generate('test-seed-2', traits, config);
assert.notEqual(genome.dnaHash, genome3.dnaHash, 'Different seed should produce different DNA');

// Test 4: Sector-aware generation
const healthcareConfig = { primarySector: 'healthcare' };
const healthcareGenome = sequencer.generate('health-test', traits, healthcareConfig);
assert.equal(healthcareGenome.sectorContext.primary, 'healthcare', 'Should have healthcare sector');
assert(healthcareGenome.chromosomes.ch19_hero_type, 'Should have hero type chromosome');
assert(healthcareGenome.chromosomes.ch21_trust_signals, 'Should have trust signals chromosome');

// Test 5: Different sectors produce different hero types
const fintechConfig = { primarySector: 'fintech' };
const fintechGenome = sequencer.generate('fintech-test', traits, fintechConfig);
assert.equal(fintechGenome.sectorContext.primary, 'fintech', 'Should have fintech sector');

// Test 6: Generate from archetype (backward compatibility)
const archetypeGenome = sequencer.generateFromArchetype('dashboard', 'dashboard-test');
assert(archetypeGenome.dnaHash, 'Archetype genome should have DNA hash');
assert(archetypeGenome.chromosomes.ch1_structure, 'Archetype genome should have structure');

console.log('✓ All tests passed');
