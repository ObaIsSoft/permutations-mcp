import { GenomeSequencer } from '../dist/genome/sequencer.js';
import { strict as assert } from 'assert';

const sequencer = new GenomeSequencer();

// Test 1: Basic genome generation
const traits = {
  informationDensity: 0.7,
  temporalUrgency: 0.3,
  emotionalTemperature: 0.5,
  playfulness: 0.4,
  spatialDependency: 0.6
};

const genome = sequencer.generate('test-seed-1', traits);
assert(genome.dnaHash, 'DNA hash should exist');
assert(genome.chromosomes.ch1_structure, 'Structure chromosome should exist');
assert(genome.chromosomes.ch5_color_primary, 'Color chromosome should exist');
assert.equal(genome.viabilityScore >= 0 && genome.viabilityScore <= 1, true, 'Viability score should be 0-1');

// Test 2: Determinism - same seed = same DNA
const genome2 = sequencer.generate('test-seed-1', traits);
assert.equal(genome.dnaHash, genome2.dnaHash, 'Same seed should produce same DNA');

// Test 3: Different seed = different DNA
const genome3 = sequencer.generate('test-seed-2', traits);
assert.notEqual(genome.dnaHash, genome3.dnaHash, 'Different seed should produce different DNA');

// Test 4: Archetype generation (no API)
const archetypeGenome = sequencer.generateFromArchetype('dashboard', 'dashboard-test');
assert.equal(archetypeGenome.chromosomes.ch1_structure.topology, 'flat', 'Dashboard should have flat topology');
assert.equal(archetypeGenome.chromosomes.ch3_type_display.charge, 'monospace', 'Dashboard should use monospace');

console.log('✓ All tests passed');
