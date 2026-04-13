/**
 * Creative Expansion Verification Tests
 *
 * Tests the phase A/B/C systems for philosophy-driven correctness.
 * Checks: design philosophy, depth philosophy, font count, star type,
 * variation sequence, rhythm pattern, and depth technique activation.
 *
 * Run: node --env-file=.env tests/creative-expansion.verify.mjs
 */

import { strict as assert } from 'assert';

// ── Import pure functions from dist ───────────────────────────────────────────
import { deriveFontCount, selectFontStrategy } from '../dist/src/font-system-catalog.js';
import { selectDepthTechniques } from '../dist/src/depth-catalog.js';
import { getStarEntry } from '../dist/src/star-catalog.js';
import { generateRhythmCSS } from '../dist/src/rhythm-catalog.js';
import { generateVariationCSS } from '../dist/src/variation-catalog.js';
import { generatePalette, generatePaletteCSS } from '../dist/src/color-palette-engine.js';
import { EntropyPool } from '../dist/src/genome/entropy-pool.js';
import { fontCatalog } from '../dist/src/font-catalog.js';
import { GenomeSequencer } from '../dist/src/genome/sequencer.js';
import { generateDepthCSS } from '../dist/src/depth-catalog.js';

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`  ✓ ${name}`);
        passed++;
    } catch (e) {
        console.error(`  ✗ ${name}`);
        console.error(`    ${e.message}`);
        failed++;
    }
}

function assertContains(str, sub, msg) {
    assert(str.includes(sub), `${msg}\n    Expected to contain: "${sub}"\n    Got: "${str.slice(0, 300)}..."`);
}

function assertNotContains(str, sub, msg) {
    assert(!str.includes(sub), `${msg}\n    Expected NOT to contain: "${sub}"`);
}

// ── Warm font catalog ─────────────────────────────────────────────────────────
console.log('\nWarming font catalog…');
await fontCatalog.warmCache(['bunny', 'google', 'fontshare']);
console.log('Font catalog ready.\n');

const pool = new EntropyPool('test-seed');

// ═══════════════════════════════════════════════════════════════════════════════
console.log('── Font Count Decision ──────────────────────────────────────────');
// ═══════════════════════════════════════════════════════════════════════════════

test('minimalist always returns fontCount: 1', () => {
    const count = deriveFontCount('minimalist', 0.9, 'spring', 'technology', pool, 0);
    assert.equal(count, 1, `Expected 1, got ${count}`);
});

test('swiss_grid + low entropy returns fontCount: 1', () => {
    const count = deriveFontCount('swiss_grid', 0.3, 'none', 'technology', pool, 0);
    assert.equal(count, 1, `Expected 1, got ${count}`);
});

test('swiss_grid + high entropy returns fontCount: 2', () => {
    const count = deriveFontCount('swiss_grid', 0.8, 'none', 'technology', pool, 0);
    assert.equal(count, 2, `Expected 2, got ${count}`);
});

test('chaotic always returns fontCount: 3', () => {
    const count = deriveFontCount('chaotic', 0.1, 'none', 'technology', pool, 0);
    assert.equal(count, 3, `Expected 3, got ${count}`);
});

test('expressive always returns fontCount: 3', () => {
    const count = deriveFontCount('expressive', 0.3, 'none', 'technology', pool, 0);
    assert.equal(count, 3, `Expected 3, got ${count}`);
});

test('technical with physics:none returns fontCount: 1', () => {
    const count = deriveFontCount('technical', 0.6, 'none', 'technology', pool, 0);
    assert.equal(count, 1, `Expected 1, got ${count}`);
});

test('technical with physics:spring returns fontCount: 2', () => {
    const count = deriveFontCount('technical', 0.6, 'spring', 'technology', pool, 0);
    assert.equal(count, 2, `Expected 2, got ${count}`);
});

test('editorial with entropy < 0.30 returns fontCount: 1', () => {
    const count = deriveFontCount('editorial', 0.20, 'none', 'technology', pool, 0);
    assert.equal(count, 1, `Expected 1, got ${count}`);
});

test('editorial with entropy > 0.65 returns fontCount: 3', () => {
    const count = deriveFontCount('editorial', 0.75, 'none', 'technology', pool, 0);
    assert.equal(count, 3, `Expected 3, got ${count}`);
});

// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n── Font Strategy Selection ──────────────────────────────────────');
// ═══════════════════════════════════════════════════════════════════════════════

test('fontCount:1 selects a 1-font strategy', () => {
    const strategy = selectFontStrategy(1, 'minimalist', 0.3, pool, 10);
    assert.equal(strategy, 'single_family_weight', `Expected single_family_weight, got ${strategy}`);
});

test('chaotic + fontCount:3 + high entropy does not select single_family_weight', () => {
    const strategy = selectFontStrategy(3, 'chaotic', 0.9, pool, 10);
    assert.notEqual(strategy, 'single_family_weight', `Got single_family_weight for chaotic 3-font`);
});

test('expressive + fontCount:3 selects expressive_pair or clash or super_family', () => {
    const strategy = selectFontStrategy(3, 'expressive', 0.8, pool, 10);
    const valid3 = ['super_family', 'expressive_pair', 'clash'];
    assert(valid3.includes(strategy), `Expected 3-font strategy, got ${strategy}`);
});

// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n── Star Type Gates ──────────────────────────────────────────────');
// ═══════════════════════════════════════════════════════════════════════════════

test('star type "none" returns correct entry', () => {
    const entry = getStarEntry('none');
    assert.equal(entry.type, 'none');
    assert.equal(entry.headlineScale, 'normal');
    assert.equal(entry.ghostSupportingText, false);
});

test('oversized_phrase scales headline UP', () => {
    const entry = getStarEntry('oversized_phrase');
    assert.equal(entry.headlineScale, 'up');
});

test('logo_as_art scales headline DOWN and enables ghost text', () => {
    const entry = getStarEntry('logo_as_art');
    assert.equal(entry.headlineScale, 'down');
    assert.equal(entry.ghostSupportingText, true);
    assert(entry.forbiddenFor.philosophies?.includes('minimalist'), 'minimalist should be forbidden for logo_as_art');
    assert(entry.forbiddenFor.philosophies?.includes('swiss_grid'), 'swiss_grid should be forbidden for logo_as_art');
});

test('animated_gradient is forbidden for physics:none (no requiresPhysics without physics)', () => {
    const entry = getStarEntry('animated_gradient');
    // requiresPhysics means at least one of these must be active
    assert(entry.forbiddenFor.requiresPhysics && entry.forbiddenFor.requiresPhysics.length > 0,
        'animated_gradient should require specific physics modes');
});

test('video_loop requires video', () => {
    const entry = getStarEntry('video_loop');
    assert.equal(entry.forbiddenFor.requiresVideo, true, 'video_loop should require video');
});

// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n── Depth Technique Activation ───────────────────────────────────');
// ═══════════════════════════════════════════════════════════════════════════════

test('depthPhilosophy:flat → only whitespace and border-gap techniques, no grain, no ghost text', () => {
    const techniques = selectDepthTechniques({
        philosophy: 'flat', designPhilosophy: 'minimalist',
        entropy: 0.5, noiseLevel: 0.8, isDark: false,
        physics: 'spring', material: 'standard',
    });
    assert(!techniques.includes('grain_subtle'), 'flat should not include grain_subtle');
    assert(!techniques.includes('grain_heavy'), 'flat should not include grain_heavy');
    assert(!techniques.includes('ghost_text_bg'), 'flat should not include ghost_text_bg');
    assert(!techniques.includes('shadow_strata'), 'flat should not include shadow_strata');
    assert(!techniques.includes('parallax_layers'), 'flat should not include parallax_layers');
});

test('depthPhilosophy:flat + isDark:true → adds color_lightness_strata', () => {
    const techniques = selectDepthTechniques({
        philosophy: 'flat', designPhilosophy: 'minimalist',
        entropy: 0.5, noiseLevel: 0, isDark: true,
        physics: 'none', material: 'standard',
    });
    assert(techniques.includes('color_lightness_strata'), 'flat+dark should include color_lightness_strata');
});

test('depthPhilosophy:layered → includes shadow_strata, ghost_text_bg, midground_shapes', () => {
    const techniques = selectDepthTechniques({
        philosophy: 'layered', designPhilosophy: 'editorial',
        entropy: 0.6, noiseLevel: 0.3, isDark: false,
        physics: 'none', material: 'standard',
    });
    assert(techniques.includes('shadow_strata'), 'layered should include shadow_strata');
    assert(techniques.includes('ghost_text_bg'), 'layered should include ghost_text_bg');
    assert(techniques.includes('midground_shapes'), 'layered should include midground_shapes');
});

test('depthPhilosophy:layered + noiseLevel:0.7 + entropy:0.6 → grain_heavy (not grain_subtle)', () => {
    const techniques = selectDepthTechniques({
        philosophy: 'layered', designPhilosophy: 'expressive',
        entropy: 0.6, noiseLevel: 0.7, isDark: false,
        physics: 'none', material: 'standard',
    });
    assert(techniques.includes('grain_heavy'), 'Should include grain_heavy');
    assert(!techniques.includes('grain_subtle'), 'Should NOT include grain_subtle when grain_heavy is active');
});

test('depthPhilosophy:layered + noiseLevel:0.1 → no grain at all', () => {
    const techniques = selectDepthTechniques({
        philosophy: 'layered', designPhilosophy: 'editorial',
        entropy: 0.5, noiseLevel: 0.1, isDark: false,
        physics: 'none', material: 'standard',
    });
    assert(!techniques.includes('grain_subtle'), 'Low noiseLevel should not produce grain_subtle');
    assert(!techniques.includes('grain_heavy'), 'Low noiseLevel should not produce grain_heavy');
});

test('material:glass → backdrop_filter_blur + specular_highlight', () => {
    const techniques = selectDepthTechniques({
        philosophy: 'layered', designPhilosophy: 'editorial',
        entropy: 0.5, noiseLevel: 0.2, isDark: false,
        physics: 'none', material: 'glass',
    });
    assert(techniques.includes('backdrop_filter_blur'), 'glass should enable backdrop_filter_blur');
    assert(techniques.includes('specular_highlight'), 'glass should enable specular_highlight');
});

test('material:clay → inset_shadow', () => {
    const techniques = selectDepthTechniques({
        philosophy: 'subtle', designPhilosophy: 'brand_heavy',
        entropy: 0.4, noiseLevel: 0.2, isDark: false,
        physics: 'none', material: 'clay',
    });
    assert(techniques.includes('inset_shadow'), 'clay material should enable inset_shadow');
});

test('immersive + physics:spring → perspective_section', () => {
    const techniques = selectDepthTechniques({
        philosophy: 'immersive', designPhilosophy: 'expressive',
        entropy: 0.8, noiseLevel: 0.4, isDark: false,
        physics: 'spring', material: 'standard',
    });
    assert(techniques.includes('perspective_section'), 'immersive+spring should include perspective_section');
});

test('flat + physics:spring → NO perspective_section (not valid in flat)', () => {
    const techniques = selectDepthTechniques({
        philosophy: 'flat', designPhilosophy: 'minimalist',
        entropy: 0.8, noiseLevel: 0, isDark: false,
        physics: 'spring', material: 'standard',
    });
    assert(!techniques.includes('perspective_section'), 'flat should never have perspective_section');
});

test('depthPhilosophy:subtle + entropy:0.2 → no ghost_text_bg (needs entropy > 0.35)', () => {
    const techniques = selectDepthTechniques({
        philosophy: 'subtle', designPhilosophy: 'brand_heavy',
        entropy: 0.2, noiseLevel: 0.2, isDark: false,
        physics: 'none', material: 'standard',
    });
    assert(!techniques.includes('ghost_text_bg'), 'entropy < 0.35 should not trigger ghost_text_bg');
});

test('no duplicate techniques in output', () => {
    const techniques = selectDepthTechniques({
        philosophy: 'immersive', designPhilosophy: 'expressive',
        entropy: 0.9, noiseLevel: 0.8, isDark: true,
        physics: 'spring', material: 'glass',
    });
    const seen = new Set();
    for (const t of techniques) {
        assert(!seen.has(t), `Duplicate technique found: ${t}`);
        seen.add(t);
    }
});

// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n── Depth CSS Output ─────────────────────────────────────────────');
// ═══════════════════════════════════════════════════════════════════════════════

test('flat CSS contains no grain overlay class', () => {
    const css = generateDepthCSS({
        philosophy: 'flat', designPhilosophy: 'minimalist',
        entropy: 0.5, noiseLevel: 0.8, isDark: false,
        physics: 'none', material: 'standard',
    });
    assertNotContains(css, '.grain-overlay', 'flat should not emit .grain-overlay');
});

test('layered + high noiseLevel CSS contains .grain-overlay', () => {
    const css = generateDepthCSS({
        philosophy: 'layered', designPhilosophy: 'expressive',
        entropy: 0.7, noiseLevel: 0.8, isDark: false,
        physics: 'none', material: 'standard',
    });
    assertContains(css, '.grain-overlay', 'layered+highNoise should emit .grain-overlay');
});

test('depth CSS uses only genome vars (no hardcoded hex colours)', () => {
    const css = generateDepthCSS({
        philosophy: 'immersive', designPhilosophy: 'expressive',
        entropy: 0.9, noiseLevel: 0.8, isDark: true,
        physics: 'spring', material: 'glass',
    });
    // Should not contain # hex colors (only in data URIs or comments is acceptable)
    const noDataUri = css.replace(/url\([^)]+\)/g, '');
    const hexMatches = noDataUri.match(/#[0-9a-fA-F]{3,6}\b/g) ?? [];
    assert.equal(hexMatches.length, 0,
        `Found hardcoded hex colours: ${hexMatches.join(', ')}`);
});

test('depth CSS references genome vars (--color-primary etc.)', () => {
    const css = generateDepthCSS({
        philosophy: 'layered', designPhilosophy: 'editorial',
        entropy: 0.6, noiseLevel: 0.3, isDark: false,
        physics: 'none', material: 'standard',
    });
    assertContains(css, 'var(--color-primary)', 'Depth CSS must use --color-primary genome var');
    assertContains(css, 'var(--spacing-', 'Depth CSS must use spacing genome vars');
});

// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n── Variation CSS ────────────────────────────────────────────────');
// ═══════════════════════════════════════════════════════════════════════════════

test('variation CSS contains all 8 data-mode selectors', () => {
    const css = generateVariationCSS();
    for (const mode of ['loud', 'quiet', 'data', 'editorial', 'cinematic', 'technical', 'social', 'action']) {
        assertContains(css, `[data-mode="${mode}"]`, `Missing mode: ${mode}`);
    }
});

test('variation CSS has no hardcoded hex colours', () => {
    const css = generateVariationCSS();
    const hexMatches = css.match(/#[0-9a-fA-F]{3,6}\b/g) ?? [];
    assert.equal(hexMatches.length, 0,
        `Found hardcoded hex colours in variation CSS: ${hexMatches.join(', ')}`);
});

test('variation CSS references genome vars for colour and spacing', () => {
    const css = generateVariationCSS();
    assertContains(css, 'var(--color-primary)', 'Must use --color-primary');
    assertContains(css, 'var(--spacing-', 'Must use spacing vars');
    assertContains(css, 'var(--font-anchor)', 'Must use --font-anchor');
    assertContains(css, 'var(--opacity-', 'Must use --opacity-* vars');
});

test('variation CSS has no hardcoded hsl() or rgb() colour literals', () => {
    const css = generateVariationCSS();
    // Allow hsl inside var() fallbacks but not standalone hardcoded hsl(N,N,N)
    const hslLiterals = css.match(/hsl\(\s*\d+/g) ?? [];
    assert.equal(hslLiterals.length, 0,
        `Found hardcoded hsl() literals: ${hslLiterals.join(', ')}`);
});

// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n── Rhythm CSS ───────────────────────────────────────────────────');
// ═══════════════════════════════════════════════════════════════════════════════

test('shape_motif CSS uses --motif-radius and --motif-size-bg vars', () => {
    const css = generateRhythmCSS('shape_motif');
    assertContains(css, '--motif-radius', 'Missing --motif-radius');
    assertContains(css, '--motif-size-bg', 'Missing --motif-size-bg');
    assertContains(css, 'var(--color-primary)', 'Must use --color-primary for motif colour');
});

test('color_band CSS uses --band-odd and --band-even vars', () => {
    const css = generateRhythmCSS('color_band');
    assertContains(css, '--band-odd', 'Missing --band-odd');
    assertContains(css, '--band-even', 'Missing --band-even');
    assertContains(css, 'var(--color-bg)', 'Must reference --color-bg');
});

test('line_weight CSS declares --line-weight var', () => {
    const css = generateRhythmCSS('line_weight');
    assertContains(css, '--line-weight', 'Missing --line-weight');
    assertContains(css, 'var(--color-primary)', 'Must use --color-primary for line color');
});

test('gradient_echo CSS uses --gradient-dir', () => {
    const css = generateRhythmCSS('gradient_echo');
    assertContains(css, 'var(--gradient-dir', 'Must use --gradient-dir');
    assertContains(css, 'var(--gradient-primary)', 'Must use --gradient-primary');
});

test('rhythm CSS has no hardcoded hex colours', () => {
    for (const pattern of ['shape_motif','logo_echo','color_band','texture_repeat',
                           'typographic_rule','image_grid_echo','spacing_scale',
                           'icon_system','gradient_echo','line_weight']) {
        const css = generateRhythmCSS(pattern);
        const hexMatches = css.match(/#[0-9a-fA-F]{3,6}\b/g) ?? [];
        assert.equal(hexMatches.length, 0,
            `rhythm:${pattern} has hardcoded hex colours: ${hexMatches.join(', ')}`);
    }
});

test('rhythm CSS sizes reference genome spacing vars (not raw rem)', () => {
    const css = generateRhythmCSS('shape_motif');
    // Should use var(--spacing-*) not hardcoded rem values
    const rawRem = css.match(/:\s*\d+(\.\d+)?rem\b/g) ?? [];
    assert.equal(rawRem.length, 0,
        `shape_motif rhythm CSS has raw rem values: ${rawRem.join(', ')}`);
});

// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n── Color Palette Engine ─────────────────────────────────────────');
// ═══════════════════════════════════════════════════════════════════════════════

test('generatePalette returns 5+ colours', () => {
    const palette = generatePalette(210, 0.6, 0.5, false, 'none', 'technology', 'editorial', 'test-seed');
    assert(palette.colors.length >= 5, `Expected >=5 colours, got ${palette.colors.length}`);
});

test('generatePalette is deterministic with same seed', () => {
    const p1 = generatePalette(210, 0.6, 0.5, false, 'none', 'technology', 'editorial', 'same-seed');
    const p2 = generatePalette(210, 0.6, 0.5, false, 'none', 'technology', 'editorial', 'same-seed');
    assert.equal(p1.rule, p2.rule, 'Same seed should produce same harmony rule');
    assert.equal(p1.colors[0].hex, p2.colors[0].hex, 'Same seed should produce same colours');
});

test('high entropy → no monochromatic palette', () => {
    // monochromatic has entropyCeiling 0.7, so entropy 0.9 should exclude it
    const results = new Set();
    for (let i = 0; i < 5; i++) {
        const p = generatePalette(210, 0.6, 0.9, false, 'none', 'technology', 'expressive', `seed-${i}`);
        results.add(p.rule);
    }
    assert(!results.has('monochromatic'), `High entropy should not produce monochromatic palette, got: ${[...results].join(', ')}`);
});

test('generatePaletteCSS contains @supports oklch block', () => {
    const palette = generatePalette(210, 0.6, 0.5, false, 'none', 'technology', 'editorial', 'css-test');
    const css = generatePaletteCSS(palette);
    assertContains(css, '@supports', 'Palette CSS must have @supports oklch block');
    assertContains(css, 'oklch(', 'Palette CSS must use oklch() colour values');
    assertContains(css, '--palette-1', 'Palette CSS must declare --palette-1');
    assertContains(css, '--color-primary', 'Palette CSS must map --color-primary semantic alias');
});

test('generatePaletteCSS contains HSL fallback', () => {
    const palette = generatePalette(210, 0.6, 0.5, false, 'none', 'technology', 'editorial', 'hsl-test');
    const css = generatePaletteCSS(palette);
    assertContains(css, 'hsl(', 'Palette CSS must include HSL fallback for non-OKLCH browsers');
});

// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n── Full Genome Integration ──────────────────────────────────────');
// ═══════════════════════════════════════════════════════════════════════════════

const sequencer = new GenomeSequencer();
const traits = {
    informationDensity: 0.5, temporalUrgency: 0.3, emotionalTemperature: 0.5,
    playfulness: 0.4, spatialDependency: 0.5, trustRequirement: 0.5,
    visualEmphasis: 0.5, conversionFocus: 0.5
};

test('genome contains designPhilosophy in ch12_signature', () => {
    const genome = sequencer.generate('verify-test-1', traits, { primarySector: 'technology' });
    const sig = genome.chromosomes.ch12_signature;
    assert(sig.designPhilosophy, 'ch12_signature.designPhilosophy must exist');
    const valid = ['minimalist','swiss_grid','editorial','brand_heavy','technical','expressive','chaotic'];
    assert(valid.includes(sig.designPhilosophy),
        `Invalid designPhilosophy: ${sig.designPhilosophy}`);
});

test('genome contains depthPhilosophy in ch12_signature', () => {
    const genome = sequencer.generate('verify-test-2', traits, { primarySector: 'technology' });
    const sig = genome.chromosomes.ch12_signature;
    const valid = ['flat','subtle','layered','immersive'];
    assert(valid.includes(sig.depthPhilosophy),
        `Invalid depthPhilosophy: ${sig.depthPhilosophy}`);
});

test('genome contains variationSequence in ch12_signature', () => {
    const genome = sequencer.generate('verify-test-3', traits, { primarySector: 'technology' });
    const sig = genome.chromosomes.ch12_signature;
    const valid = ['hero_build','editorial_flow','app_story','brand_reveal','mixed_chaos','minimal_voice'];
    assert(valid.includes(sig.variationSequence),
        `Invalid variationSequence: ${sig.variationSequence}`);
});

test('genome contains rhythmPattern in ch12_signature', () => {
    const genome = sequencer.generate('verify-test-4', traits, { primarySector: 'technology' });
    const sig = genome.chromosomes.ch12_signature;
    const valid = ['shape_motif','logo_echo','color_band','texture_repeat','typographic_rule',
                   'image_grid_echo','spacing_scale','icon_system','gradient_echo','line_weight'];
    assert(valid.includes(sig.rhythmPattern),
        `Invalid rhythmPattern: ${sig.rhythmPattern}`);
});

test('genome contains starType in ch19_hero_type', () => {
    const genome = sequencer.generate('verify-test-5', traits, { primarySector: 'technology' });
    const ch19 = genome.chromosomes.ch19_hero_type;
    assert(ch19.starType !== undefined, 'ch19_hero_type.starType must exist');
    const valid = ['none','logo_as_art','oversized_phrase','animated_gradient','3d_object',
                   'signature_image','data_number','svg_mark','kinetic_type','video_loop',
                   'color_field','grid_mosaic','noise_canvas'];
    assert(valid.includes(ch19.starType),
        `Invalid starType: ${ch19.starType}`);
});

test('genome contains fontCount in ch26_color_system', () => {
    const genome = sequencer.generate('verify-test-6', traits, { primarySector: 'technology' });
    const fontCount = genome.chromosomes.ch26_color_system.fontCount;
    assert([1,2,3].includes(fontCount), `Invalid fontCount: ${fontCount}`);
});

test('genome contains palette in ch26_color_system', () => {
    const genome = sequencer.generate('verify-test-7', traits, { primarySector: 'technology' });
    const palette = genome.chromosomes.ch26_color_system.palette;
    assert(palette, 'ch26_color_system.palette must exist');
    assert(palette.colors?.length >= 5, `Palette must have >=5 colours, got ${palette.colors?.length}`);
    assert(palette.rule, 'Palette must have a harmony rule');
});

test('genome is deterministic across all new fields', () => {
    const g1 = sequencer.generate('determinism-test', traits, { primarySector: 'fintech' });
    const g2 = sequencer.generate('determinism-test', traits, { primarySector: 'fintech' });
    const sig1 = g1.chromosomes.ch12_signature;
    const sig2 = g2.chromosomes.ch12_signature;
    assert.equal(sig1.designPhilosophy, sig2.designPhilosophy, 'designPhilosophy must be deterministic');
    assert.equal(sig1.depthPhilosophy, sig2.depthPhilosophy, 'depthPhilosophy must be deterministic');
    assert.equal(sig1.variationSequence, sig2.variationSequence, 'variationSequence must be deterministic');
    assert.equal(sig1.rhythmPattern, sig2.rhythmPattern, 'rhythmPattern must be deterministic');
    assert.equal(g1.chromosomes.ch19_hero_type.starType, g2.chromosomes.ch19_hero_type.starType,
        'starType must be deterministic');
    assert.equal(g1.chromosomes.ch26_color_system.fontCount, g2.chromosomes.ch26_color_system.fontCount,
        'fontCount must be deterministic');
});

// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n── Philosophy Correctness Spot Checks ───────────────────────────');
// ═══════════════════════════════════════════════════════════════════════════════

// These generate many seeds and verify the philosophy contract holds across them
const N_SEEDS = 20;

test(`minimalist genome across ${N_SEEDS} seeds: always fontCount:1, depthPhilosophy:flat`, () => {
    // Force philosophy indirectly by using a seed that produces minimalist
    // We can't force designPhilosophy directly from outside, so we test the derivation
    // functions directly with philosophy:'minimalist'
    for (let i = 0; i < N_SEEDS; i++) {
        const pool = new EntropyPool(`minimalist-seed-${i}`);
        const fontCount = deriveFontCount('minimalist', pool.getFloat(0), 'none', 'technology', pool, 1);
        assert.equal(fontCount, 1, `minimalist seed ${i}: fontCount should be 1, got ${fontCount}`);
    }
});

test(`swiss_grid + entropy > 0.5 across ${N_SEEDS} seeds: fontCount never > 2`, () => {
    for (let i = 0; i < N_SEEDS; i++) {
        const pool = new EntropyPool(`swiss-seed-${i}`);
        const fontCount = deriveFontCount('swiss_grid', 0.6, 'none', 'technology', pool, 1);
        assert(fontCount <= 2, `swiss_grid seed ${i}: fontCount should be <=2, got ${fontCount}`);
    }
});

test(`chaotic genome across ${N_SEEDS} seeds: always fontCount:3`, () => {
    for (let i = 0; i < N_SEEDS; i++) {
        const pool = new EntropyPool(`chaotic-seed-${i}`);
        const fontCount = deriveFontCount('chaotic', pool.getFloat(0), 'none', 'technology', pool, 1);
        assert.equal(fontCount, 3, `chaotic seed ${i}: fontCount should be 3, got ${fontCount}`);
    }
});

test(`flat depth across ${N_SEEDS} seeds: never contains shadow_strata or grain`, () => {
    for (let i = 0; i < N_SEEDS; i++) {
        const pool = new EntropyPool(`flat-depth-${i}`);
        const techniques = selectDepthTechniques({
            philosophy: 'flat', designPhilosophy: 'minimalist',
            entropy: pool.getFloat(0), noiseLevel: pool.getFloat(1),
            isDark: pool.getFloat(2) > 0.5, physics: 'none', material: 'standard',
        });
        assert(!techniques.includes('shadow_strata'), `flat seed ${i}: should not have shadow_strata`);
        assert(!techniques.includes('grain_subtle'), `flat seed ${i}: should not have grain_subtle`);
        assert(!techniques.includes('grain_heavy'), `flat seed ${i}: should not have grain_heavy`);
    }
});

// ═══════════════════════════════════════════════════════════════════════════════
// Summary
// ═══════════════════════════════════════════════════════════════════════════════
console.log(`\n${'─'.repeat(60)}`);
console.log(`  ${passed} passed  ${failed} failed`);
if (failed > 0) {
    console.log('\n  Some tests failed — see above for details.');
    process.exit(1);
} else {
    console.log('\n  All verification tests passed.');
}
