import { 
    GenomeSequencer, 
    ContentExtractor, 
    CSSGenerator, 
    HTMLGenerator,
    getSectorProfile,
    SECTOR_PROFILES 
} from '../dist/genome/index.js';

console.log('Testing all exports from genome/index.js:');
console.log('  GenomeSequencer:', typeof GenomeSequencer);
console.log('  ContentExtractor:', typeof ContentExtractor);
console.log('  CSSGenerator:', typeof CSSGenerator);
console.log('  HTMLGenerator:', typeof HTMLGenerator);
console.log('  getSectorProfile:', typeof getSectorProfile);
console.log('  SECTOR_PROFILES:', Object.keys(SECTOR_PROFILES).length, 'sectors');

// Verify each can be instantiated
const sequencer = new GenomeSequencer();
const extractor = new ContentExtractor();
const cssGen = new CSSGenerator();
const htmlGen = new HTMLGenerator();

console.log('\nAll modules instantiate correctly: ✓');

// Quick functionality test
const traits = {
    informationDensity: 0.5,
    temporalUrgency: 0.5,
    emotionalTemperature: 0.5,
    playfulness: 0.5,
    spatialDependency: 0.3,
    trustRequirement: 0.5,
    visualEmphasis: 0.5,
    conversionFocus: 0.5
};

const genome = sequencer.generate('test', traits, { primarySector: 'technology' });
const css = cssGen.generate(genome);
const html = htmlGen.generate(genome);

console.log('Generated design:');
console.log('  Genome hash:', genome.dnaHash.substring(0, 16) + '...');
console.log('  CSS size:', css.length, 'bytes');
console.log('  HTML size:', html.length, 'bytes');
