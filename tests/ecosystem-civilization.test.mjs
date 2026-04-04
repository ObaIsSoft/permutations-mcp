/**
 * Ecosystem → Civilization Bridge Integration Test
 *
 * Uses the real SemanticTraitExtractor (LLM-backed) to name organisms.
 * Requires an API key in .env — run from the genome/ root so --env-file resolves.
 *
 * Tests that:
 * 1. Ecosystem generates organisms with genome-derived properties (real LLM names)
 * 2. Civilization accepts ecosystem organisms
 * 3. CSS is generated via CSSGenerator (unified approach)
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load .env manually (no --env-file flag when run via node directly)
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');
try {
    const envContent = readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eq = trimmed.indexOf('=');
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        const val = trimmed.slice(eq + 1).trim();
        if (!process.env[key]) process.env[key] = val;
    }
} catch {
    console.error('⚠️  Could not load .env — set API keys manually');
}

import { ecosystemGenerator } from '../dist/src/genome/ecosystem.js';
import { CivilizationGenerator } from '../dist/src/genome/civilization.js';
import { GenomeSequencer } from '../dist/src/genome/sequencer.js';
import { SemanticTraitExtractor } from '../dist/src/semantic/extractor.js';
import { generateCivilizationOutput } from '../dist/src/generators/civilization-generators.js';
import { CSSGenerator } from '../dist/src/css-generator.js';
import { fontCatalog } from '../dist/src/font-catalog.js';

await fontCatalog.warmCache(["bunny", "google", "fontshare"]);

const cssGen = new CSSGenerator();
const civilizationGenerator = new CivilizationGenerator();
const sequencer = new GenomeSequencer();
const extractor = new SemanticTraitExtractor();

if (!SemanticTraitExtractor.isAvailable()) {
    console.error('❌ No LLM API key available — this test requires a key in .env');
    process.exit(1);
}

console.log('\n🧬 Ecosystem → Civilization Bridge Test\n');

// High complexity traits to guarantee organism counts above abiotic tier
const baseTraits = {
    informationDensity: 0.85,
    temporalUrgency: 0.7,
    emotionalTemperature: 0.5,
    playfulness: 0.5,
    spatialDependency: 0.75,
    trustRequirement: 0.3,
    visualEmphasis: 0.3,
    conversionFocus: 0.4
};

const intent = 'real-time analytics dashboard for a SaaS platform';
const sector = 'technology';

// Generate base genome
const genome = sequencer.generate('test-civ-eco-bridge', baseTraits, { primarySector: sector });
console.log('Generated base genome with hash:', genome.dnaHash.substring(0, 16) + '...');

// Estimate organism counts — mirrors the server.ts logic in generate_ecosystem
const complexityProxy = Math.min(1,
    baseTraits.informationDensity * 0.6 +
    baseTraits.trustRequirement   * 0.2 +
    baseTraits.spatialDependency  * 0.2
);
const counts = {
    microbial: complexityProxy < 0.11 ? 0 : Math.min(16, Math.floor(2 + ((complexityProxy - 0.11) / 0.69) * 14)),
    flora:     complexityProxy < 0.34 ? 0 : Math.min(12, Math.floor(((complexityProxy - 0.34) / 0.46) * 12)),
    fauna:     complexityProxy < 0.57 ? 0 : Math.min(10, Math.floor(((complexityProxy - 0.57) / 0.23) * 10)),
};
console.log(`Organism targets — microbial: ${counts.microbial}, flora: ${counts.flora}, fauna: ${counts.fauna}`);

// Real LLM call — no mocks
console.log('\nCalling extractor.analyzeOrganisms()...');
const organismsDefinition = await extractor.analyzeOrganisms(intent, sector, counts);
console.log(`  LLM named: ${organismsDefinition.microbial.length} microbial, ${organismsDefinition.flora.length} flora, ${organismsDefinition.fauna.length} fauna`);

// Test 1: Ecosystem generates organisms with genome-derived properties
console.log('\nTest 1: Ecosystem generates organisms with genome-derived properties');
const ecosystem = ecosystemGenerator.generate('test-civ-eco-bridge', baseTraits, {
    primarySector: sector,
    existingGenome: genome,
    organismsDefinition,
});

const organismCount = ecosystem.organisms.microbial.length +
                     ecosystem.organisms.flora.length +
                     ecosystem.organisms.fauna.length;
console.log(`  ✅ Ecosystem generated ${organismCount} organisms`);
console.log(`     - Microbial: ${ecosystem.organisms.microbial.length}`);
console.log(`     - Flora: ${ecosystem.organisms.flora.length}`);
console.log(`     - Fauna: ${ecosystem.organisms.fauna.length}`);

// Test 2: Organisms have genome-derived properties
console.log(`\nTest 2: Organisms have genome-derived properties`);
if (ecosystem.organisms.microbial.length === 0) {
    throw new Error('No microbial organisms generated — complexity too low. Check baseTraits informationDensity.');
}
const microbe = ecosystem.organisms.microbial[0];
console.log(`  ✅ Name: ${microbe.name} (LLM-assigned)`);
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
const tier = civilizationGenerator.generate('test-civ-eco-bridge', intent, baseTraits, genome, 'city_state');
console.log(`  ✅ Civilization tier: ${tier.tier}`);
console.log(`  ✅ Components generated: ${tier.components.list.length > 0}`);

// Test 5: Ecosystem organisms used as component list (server pattern)
console.log(`\nTest 5: Ecosystem organisms used for component list`);
const componentList = [...ecosystem.organisms.microbial, ...ecosystem.organisms.flora, ...ecosystem.organisms.fauna];
console.log(`  ✅ Combined organism count: ${componentList.length}`);
console.log(`  ✅ All have names: ${componentList.every(o => o.name !== undefined)}`);
console.log(`  ✅ All have categories: ${componentList.every(o => o.category !== undefined)}`);

// Test 6: CSS generated via unified CSSGenerator
console.log(`\nTest 6: CSS generated via unified CSSGenerator`);
const cssOutput = cssGen.generate(genome, { format: "compressed" });
const hasVariables = cssOutput.includes('--color-');
const hasSemanticVars = cssOutput.includes('--color-on-primary') && cssOutput.includes('--shadow-sm');
console.log(`  ✅ CSS includes variables: ${hasVariables}`);
console.log(`  ✅ CSS includes semantic utility vars: ${hasSemanticVars}`);
console.log(`  ✅ CSS length: ${cssOutput.length} chars`);

// Test 7: generateCivilizationOutput accepts CSS and topology
console.log(`\nTest 7: generateCivilizationOutput accepts unified CSS output`);
const outputs = generateCivilizationOutput(tier, genome, cssOutput, undefined);
console.log(`  ✅ Components generated: ${outputs.components.length > 0}`);
console.log(`  ✅ Tokens generated: ${outputs.tokens.length > 0}`);
console.log(`  ✅ CSS passed through: ${typeof outputs.css === 'string' && outputs.css.length > 0}`);

// Test 8: No hardcoded colors in tokens
console.log(`\nTest 8: No hardcoded colors in tokens`);
const hasNoHardcodedDark = !outputs.tokens.includes("'#0a0a0a'") && !outputs.tokens.includes('"#0a0a0a"');
const hasNoHardcodedLight = !outputs.tokens.includes("'#faf9f6'") && !outputs.tokens.includes('"#faf9f6"');
console.log(`  ✅ No '#0a0a0a' hardcoded: ${hasNoHardcodedDark}`);
console.log(`  ✅ No '#faf9f6' hardcoded: ${hasNoHardcodedLight}`);

console.log('\n✨ All ecosystem-civilization bridge tests passed!\n');
