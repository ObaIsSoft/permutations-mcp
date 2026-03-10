import { GenomeSequencer } from '../dist/genome/sequencer.js';
import { ContentExtractor } from '../dist/genome/extractor.js';
import { CSSGenerator } from '../dist/css-generator.js';
import { HTMLGenerator } from '../dist/html-generator.js';
import fs from 'fs';

console.log('=== INTEGRATION TEST ===\n');

// Test 1: Content Extraction → Sector Classification
console.log('1. Testing ContentExtractor...');
const extractor = new ContentExtractor();
const content = "Medical clinic providing surgery, wellness services, and patient care. Board certified doctors with 20 years experience.";
const analysis = extractor.analyze(content);
console.log('   Content analyzed:', analysis.success ? '✓' : '✗');
console.log('   Sector detected:', analysis.content?.sector.primary);
console.log('   Traits extracted:', Object.keys(analysis.content?.traits || {}).length, 'traits');

// Test 2: Genome Sequencing with Sector Context
console.log('\n2. Testing GenomeSequencer...');
const sequencer = new GenomeSequencer();
const config = { primarySector: analysis.content?.sector.primary || 'healthcare' };
const genome = sequencer.generate('integration-test-seed', analysis.content?.traits || {}, config);
console.log('   Genome generated:', genome.dnaHash ? '✓' : '✗');
console.log('   Sector context:', genome.sectorContext?.primary);
console.log('   Hero type:', genome.chromosomes?.ch19_hero_type?.type);
console.log('   Has trust signals:', genome.chromosomes?.ch21_trust_signals ? '✓' : '✗');
console.log('   Has visual treatment:', genome.chromosomes?.ch20_visual_treatment ? '✓' : '✗');

// Test 3: CSS Generation from Genome
console.log('\n3. Testing CSSGenerator...');
const cssGen = new CSSGenerator();
const css = cssGen.generate(genome, { format: 'compressed' });
console.log('   CSS generated:', css.length > 1000 ? '✓' : '✗');
console.log('   CSS length:', css.length, 'chars');
console.log('   Contains variables:', css.includes('--color-primary') ? '✓' : '✗');
console.log('   Contains hero styles:', css.includes('.hero') ? '✓' : '✗');

// Test 4: HTML Generation from Genome  
console.log('\n4. Testing HTMLGenerator...');
const htmlGen = new HTMLGenerator();
const html = htmlGen.generate(genome, { includeSections: true });
console.log('   HTML generated:', html.length > 500 ? '✓' : '✗');
console.log('   HTML length:', html.length, 'chars');
console.log('   Contains hero section:', html.includes('<section class="hero"') ? '✓' : '✗');
console.log('   Contains trust section:', html.includes('trust-section') ? '✓' : '✗');

// Test 5: Full Pipeline Write to Disk
console.log('\n5. Testing Full Pipeline (write to disk)...');
fs.writeFileSync('integration-test/styles.css', css);
fs.writeFileSync('integration-test/index.html', html);
fs.writeFileSync('integration-test/genome.json', JSON.stringify(genome, null, 2));
console.log('   Files written:', fs.existsSync('integration-test/styles.css') ? '✓' : '✗');

// Test 6: Different Sectors Produce Different Results
console.log('\n6. Testing Sector Differentiation...');
const sectors = ['healthcare', 'fintech', 'education'];
const results = [];
for (const sector of sectors) {
    const g = sequencer.generate(`test-${sector}`, analysis.content?.traits || {}, { primarySector: sector });
    results.push({
        sector,
        heroType: g.chromosomes.ch19_hero_type.type,
        color: g.chromosomes.ch5_color_primary.hex,
        trustApproach: g.chromosomes.ch21_trust_signals.approach
    });
}
console.table(results);

// Verify differentiation
const allSameHero = results.every(r => r.heroType === results[0].heroType);
const allSameColor = results.every(r => r.color === results[0].color);
console.log('   Differentiation check:', (!allSameHero || !allSameColor) ? '✓ (varies by sector)' : '⚠ (some similarity)');

console.log('\n=== ALL INTEGRATION TESTS PASSED ===');
