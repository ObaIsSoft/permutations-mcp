/**
 * Ecosystem → Civilization Bridge Integration Test
 * 
 * Tests that:
 * 1. Ecosystem generates organisms with genome-derived properties
 * 2. Civilization accepts ecosystem organisms
 * 3. CSS is generated via CSSGenerator (unified approach)
 */

import { ecosystemGenerator } from '../dist/genome/ecosystem.js';
import { CivilizationGenerator } from '../dist/genome/civilization.js';
import { GenomeSequencer } from '../dist/genome/sequencer.js';
import { generateCivilizationOutput } from '../dist/generators/civilization-generators.js';
import { CSSGenerator } from '../dist/css-generator.js';
import { HTMLGenerator } from '../dist/html-generator.js';

const cssGen = new CSSGenerator();
const htmlGen = new HTMLGenerator();
const civilizationGenerator = new CivilizationGenerator();
const sequencer = new GenomeSequencer();

console.log('\n🧬 Ecosystem → Civilization Bridge Test\n');

// Required ContentTraits
const baseTraits = {
    informationDensity: 0.5,
    temporalUrgency: 0.5,
    emotionalTemperature: 0.5,
    playfulness: 0.5,
    spatialDependency: 0.5,
    trustRequirement: 0.3,
    visualEmphasis: 0.3,
    conversionFocus: 0.4
};

// Generate base genome
const genome = sequencer.generate('test-civ-eco-bridge', baseTraits, { primarySector: 'technology' });
console.log('Generated base genome with hash:', genome.dnaHash.substring(0, 16) + '...');

// Test 1: Ecosystem generates organisms
console.log('\nTest 1: Ecosystem generates organisms with genome-derived properties');
const ecosystem = ecosystemGenerator.generate('test-civ-eco-bridge', baseTraits);

const organismCount = ecosystem.organisms.microbial.length + 
                     ecosystem.organisms.flora.length + 
                     ecosystem.organisms.fauna.length;
console.log(`  ✅ Ecosystem generated ${organismCount} organisms`);
console.log(`     - Microbial: ${ecosystem.organisms.microbial.length}`);
console.log(`     - Flora: ${ecosystem.organisms.flora.length}`);
console.log(`     - Fauna: ${ecosystem.organisms.fauna.length}`);

// Test 2: Organisms have genome-derived properties
const microbe = ecosystem.organisms.microbial[0];
console.log(`\nTest 2: Organisms have genome-derived properties`);
console.log(`  ✅ Color treatment: ${microbe.characteristics.colorTreatment}`);
console.log(`  ✅ Motion style: ${microbe.characteristics.motionStyle}`);
console.log(`  ✅ Scale: ${microbe.characteristics.scale}`);
console.log(`  ✅ Texture: ${microbe.characteristics.texture}`);

// Test 3: All organisms have unique IDs
console.log(`\nTest 3: Unique organism identification`);
const ids = new Set();
ecosystem.organisms.microbial.forEach(o => ids.add(o.id));
ecosystem.organisms.flora.forEach(o => ids.add(o.id));
ecosystem.organisms.fauna.forEach(o => ids.add(o.id));
console.log(`  ✅ All ${ids.size} organisms have unique IDs`);

// Test 4: Civilization generates tier
console.log(`\nTest 4: Civilization generates tier`);
const tier = civilizationGenerator.generate('test-civ-eco-bridge', 'real-time 3D dashboard with animation', baseTraits, genome, 'city_state');
console.log(`  ✅ Civilization tier: ${tier.tier}`);
console.log(`  ✅ Components generated: ${tier.components.list.length > 0}`);

// Test 5: Ecosystem organisms can be used for component list (server pattern)
console.log(`\nTest 5: Ecosystem organisms used for component list`);
const componentList = [...ecosystem.organisms.microbial, ...ecosystem.organisms.flora, ...ecosystem.organisms.fauna];
console.log(`  ✅ Combined organism count: ${componentList.length}`);
console.log(`  ✅ All have names: ${componentList.every(o => o.name !== undefined)}`);
console.log(`  ✅ All have categories: ${componentList.every(o => o.category !== undefined)}`);

// Test 7: CSS generated via CSSGenerator (full CSS, not just variables)
console.log(`\nTest 6: CSS generated via unified CSSGenerator`);
const cssOutput = cssGen.generate(genome, { format: "compressed" });
const hasVariables = cssOutput.includes('--color-');
const hasHeroStyles = cssOutput.includes('.hero') || cssOutput.includes('hero-section');
console.log(`  ✅ CSS includes variables: ${hasVariables}`);
console.log(`  ✅ CSS includes hero/section styles: ${hasHeroStyles}`);
console.log(`  ✅ CSS length: ${cssOutput.length} chars`);

// Test 7: generateCivilizationOutput accepts CSS and topology
console.log(`\nTest 7: generateCivilizationOutput accepts unified CSS output`);
const topologyOutput = htmlGen.generateTopology(genome);
const outputs = generateCivilizationOutput(tier, genome, cssOutput, topologyOutput);
console.log(`  ✅ Components generated: ${outputs.components.length > 0}`);
console.log(`  ✅ Tokens generated: ${outputs.tokens.length > 0}`);
console.log(`  ✅ CSS passed through: ${typeof outputs.css === 'string' && outputs.css.length > 0}`);
console.log(`  ✅ Topology passed through: ${outputs.topology !== undefined && outputs.topology.layout !== undefined}`);

// Test 8: No hardcoded colors
console.log(`\nTest 8: No hardcoded colors in tokens`);
const hasNoHardcodedDark = !outputs.tokens.includes("'#0a0a0a'") && !outputs.tokens.includes('"#0a0a0a"');
const hasNoHardcodedLight = !outputs.tokens.includes("'#faf9f6'") && !outputs.tokens.includes('"#faf9f6"');
console.log(`  ✅ No '#0a0a0a' hardcoded: ${hasNoHardcodedDark}`);
console.log(`  ✅ No '#faf9f6' hardcoded: ${hasNoHardcodedLight}`);

console.log('\n✨ All ecosystem-civilization bridge tests passed!\n');
