import { SemanticTraitExtractor } from '../dist/semantic/extractor.js';
import { GenomeSequencer } from '../dist/genome/sequencer.js';
import { CSSGenerator } from '../dist/css-generator.js';
import { HTMLGenerator } from '../dist/html-generator.js';

console.log('=== LLM INTEGRATION TEST ===\n');

// Check for API keys
const hasGroq = process.env.GROQ_API_KEY;
const hasOpenAI = process.env.OPENAI_API_KEY;
const hasAnthropic = process.env.ANTHROPIC_API_KEY;
const hasGemini = process.env.GEMINI_API_KEY;

console.log('API Keys detected:');
console.log('  GROQ_API_KEY:', hasGroq ? '✓' : '✗');
console.log('  OPENAI_API_KEY:', hasOpenAI ? '✓' : '✗');
console.log('  ANTHROPIC_API_KEY:', hasAnthropic ? '✓' : '✗');
console.log('  GEMINI_API_KEY:', hasGemini ? '✓' : '✗');

if (!hasGroq && !hasOpenAI && !hasAnthropic && !hasGemini) {
    console.log('\n⚠️  No API keys found. Skipping LLM tests.');
    console.log('   Set one of: GROQ_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY');
    process.exit(0);
}

// Test with available provider
const providers = [
    hasGroq && 'groq',
    hasOpenAI && 'openai', 
    hasAnthropic && 'anthropic',
    hasGemini && 'gemini'
].filter(Boolean);

console.log(`\nTesting with providers: ${providers.join(', ')}\n`);

const testContent = "Fintech banking platform for secure payments, wealth management, and cryptocurrency trading. Trusted by millions of users worldwide.";

for (const provider of providers) {
    console.log(`\n--- Testing ${provider.toUpperCase()} ---`);
    
    try {
        // Step 1: LLM Extraction
        console.log('1. SemanticTraitExtractor.extractTraits()...');
        const extractor = new SemanticTraitExtractor(undefined, provider);
        const traits = await extractor.extractTraits(testContent, "Financial technology company");
        console.log('   ✓ Traits extracted:', JSON.stringify(traits, null, 2).replace(/\n/g, '\n     '));
        
        // Step 2: Genome Generation
        console.log('2. GenomeSequencer.generate()...');
        const sequencer = new GenomeSequencer();
        const genome = sequencer.generate(`${provider}-test-seed`, traits, { primarySector: 'fintech' });
        console.log('   ✓ Genome generated');
        console.log('   Sector:', genome.sectorContext?.primary);
        console.log('   Hero type:', genome.chromosomes?.ch19_hero_type?.type);
        console.log('   Color:', genome.chromosomes?.ch5_color_primary?.hex);
        
        // Step 3: CSS Generation
        console.log('3. CSSGenerator.generate()...');
        const cssGen = new CSSGenerator();
        const css = cssGen.generate(genome, { format: 'compressed' });
        console.log('   ✓ CSS generated:', css.length, 'chars');
        
        // Step 4: HTML Generation
        console.log('4. HTMLGenerator.generate()...');
        const htmlGen = new HTMLGenerator();
        const html = htmlGen.generate(genome, { includeSections: true });
        console.log('   ✓ HTML generated:', html.length, 'chars');
        
        console.log(`\n✅ ${provider.toUpperCase()} pipeline complete`);
        
    } catch (error) {
        console.error(`\n❌ ${provider.toUpperCase()} failed:`, error.message);
    }
}

console.log('\n=== LLM TEST COMPLETE ===');
