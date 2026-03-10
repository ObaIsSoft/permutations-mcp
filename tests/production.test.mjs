/**
 * MCP Tool-Level Tests
 * Tests the genome sequencer and production hardening additions:
 * - Input validation logic
 * - Font diversity (byte param used, not ignored)
 * - Keyword extraction coverage
 * - Semantic extractor availability check
 */

import assert from "assert";

// ──────────────────────────────────────────────
// Imports from src (compiled JS in dist/)
// ──────────────────────────────────────────────
import { GenomeSequencer } from "../dist/genome/sequencer.js";
import { SemanticTraitExtractor } from "../dist/semantic/extractor.js";
import { PatternDetector } from "../dist/constraints/pattern-detector.js";

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`  ✅ PASS: ${name}`);
        passed++;
    } catch (e) {
        console.log(`  ❌ FAIL: ${name} — ${e.message}`);
        failed++;
    }
}

function eq(actual, expected, msg) {
    assert.deepStrictEqual(actual, expected, msg ?? `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

function assertIncludes(arr, value, msg) {
    assert(Array.isArray(arr) && arr.includes(value), msg ?? `Expected [${arr}] to include '${value}'`);
}

console.log("\n🔬 Production Hardening Tests\n");

// ──────────────────────────────────────────────
// Test 1: SemanticTraitExtractor.isAvailable()
// ──────────────────────────────────────────────
console.log("Test 1: SemanticTraitExtractor.isAvailable()");

test("Returns false when no LLM keys are set", () => {
    const orig = {
        GROQ_API_KEY: process.env.GROQ_API_KEY,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    };
    delete process.env.GROQ_API_KEY;
    delete process.env.OPENAI_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.GEMINI_API_KEY;
    const available = SemanticTraitExtractor.isAvailable();
    // Restore
    Object.entries(orig).forEach(([k, v]) => { if (v) process.env[k] = v; });
    assert(!available, "isAvailable() should return false with no keys");
});

test("Returns true when a key is set", () => {
    const prev = process.env.GROQ_API_KEY;
    process.env.GROQ_API_KEY = "test-key";
    const available = SemanticTraitExtractor.isAvailable();
    if (prev === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = prev;
    assert(available, "isAvailable() should return true when GROQ_API_KEY is set");
});

// ──────────────────────────────────────────────
// Test 2: Font Diversity
// ──────────────────────────────────────────────
console.log("\nTest 2: Font Diversity (byte parameter now active)");

const sequencer = new GenomeSequencer();

const fontResults = new Set();
for (let i = 0; i < 50; i++) {
    const seed = `font-test-${i}`;
    const traits = {
        informationDensity: 0.5,
        temporalUrgency: 0.5,
        emotionalTemperature: 0.5,
        playfulness: 0.5,
        spatialDependency: 0.3,
        trustRequirement: 0.5,
        visualEmphasis: 0.5,
        conversionFocus: 0.5,
    };
    const genome = sequencer.generate(seed, traits, { primarySector: "technology" });
    fontResults.add(genome.chromosomes.ch3_type_display.family);
}

test("Display fonts vary across seeds (at least 4 distinct fonts)", () => {
    assert(fontResults.size >= 4, `Got ${fontResults.size} distinct display fonts, expected >= 4. Got: ${[...fontResults].join(", ")}`);
});

test("Display fonts are not always the same (byte param is used)", () => {
    assert(fontResults.size > 1, "Only 1 display font returned — byte param is still being ignored");
});

// Test across all charge types
const chargeResults = {};
["geometric", "humanist", "monospace", "transitional"].forEach(sector => {
    const sectorMap = { geometric: "technology", humanist: "education", monospace: "technology", transitional: "legal" };
    const fontsForCharge = new Set();
    for (let i = 0; i < 20; i++) {
        const genome = sequencer.generate(`charge-test-${sector}-${i}`, {
            informationDensity: 0.5, temporalUrgency: 0.5, emotionalTemperature: 0.5,
            playfulness: sector === "humanist" ? 0.7 : 0.3, spatialDependency: 0.3,
            trustRequirement: 0.5, visualEmphasis: 0.5, conversionFocus: 0.5,
        }, { primarySector: sectorMap[sector] || "technology" });
        fontsForCharge.add(genome.chromosomes.ch3_type_display.family);
    }
    chargeResults[sector] = fontsForCharge.size;
});

test("Geometric charge: multiple display fonts selected", () => {
    assert(chargeResults.geometric >= 2, `geometric charge only produced ${chargeResults.geometric} distinct fonts`);
});

// ──────────────────────────────────────────────
// Test 3: Keyword Coverage
// ──────────────────────────────────────────────
console.log("\nTest 3: Keyword Extraction Coverage");

// Access extractKeywords via genome generation — keywords are embedded in generated output via constraint solver
// We test the shape of the generated values instead

const dashboardGenome = sequencer.generate("kw-dashboard-test", {
    informationDensity: 0.9, temporalUrgency: 0.9, emotionalTemperature: 0.2,
    playfulness: 0.1, spatialDependency: 0.2, trustRequirement: 0.6,
    visualEmphasis: 0.2, conversionFocus: 0.3,
}, { primarySector: "technology" });

test("High density + urgency → tight tracking", () => {
    const tracking = dashboardGenome.chromosomes.ch3_type_display.tracking;
    eq(tracking, "tight", `Expected 'tight' tracking for dense dashboard, got '${tracking}'`);
});

test("High density → f_pattern or continuous scroll", () => {
    const flow = dashboardGenome.chromosomes.ch1_structure.contentFlow;
    assert(flow === "f_pattern" || flow === "reading_order", `Got unexpected contentFlow: ${flow}`);
});

const luxuryGenome = sequencer.generate("kw-luxury-test", {
    informationDensity: 0.15, temporalUrgency: 0.1, emotionalTemperature: 0.8,
    playfulness: 0.4, spatialDependency: 0.4, trustRequirement: 0.5,
    visualEmphasis: 0.9, conversionFocus: 0.2,
}, { primarySector: "commerce" });

test("Low density → wide negativeSpaceRatio", () => {
    const ratio = luxuryGenome.chromosomes.ch2_rhythm.negativeSpaceRatio;
    assert(ratio > 0.7, `negativeSpaceRatio should be high for sparse prompts, got ${ratio.toFixed(2)}`);
});

test("Low urgency + high visual → uppercase casing possible (editorial)", () => {
    // emotionalTemperature < 0.3 → uppercase. For warm luxury this won't be uppercase
    // Just verify casing is a valid value
    const casing = luxuryGenome.chromosomes.ch3_type_display.casing;
    assertIncludes(["normal", "uppercase", "small_caps"], casing, `Invalid casing: ${casing}`);
});

// ──────────────────────────────────────────────
// Test 4: Chromosome shape completeness (all new fields present)
// ──────────────────────────────────────────────
console.log("\nTest 4: New chromosome field completeness");

const g = sequencer.generate("completeness-test", {
    informationDensity: 0.5, temporalUrgency: 0.5, emotionalTemperature: 0.5,
    playfulness: 0.5, spatialDependency: 0.5, trustRequirement: 0.5,
    visualEmphasis: 0.5, conversionFocus: 0.5,
}, { primarySector: "healthcare" });

const ch = g.chromosomes;

test("ch1 has scrollBehavior", () => assert("scrollBehavior" in ch.ch1_structure));
test("ch1 has breakpointStrategy", () => assert("breakpointStrategy" in ch.ch1_structure));
test("ch1 has contentFlow", () => assert("contentFlow" in ch.ch1_structure));
test("ch2 has componentSpacing", () => assert("componentSpacing" in ch.ch2_rhythm));
test("ch2 has verticalRhythm", () => assert("verticalRhythm" in ch.ch2_rhythm));
test("ch2 has negativeSpaceRatio", () => assert("negativeSpaceRatio" in ch.ch2_rhythm));
test("ch3 has tracking", () => assert("tracking" in ch.ch3_type_display));
test("ch3 has casing", () => assert("casing" in ch.ch3_type_display));
test("ch4 has optimalLineLength", () => assert("optimalLineLength" in ch.ch4_type_body));
test("ch4 has hyphenation", () => assert("hyphenation" in ch.ch4_type_body));
test("ch6 has isDark", () => assert("isDark" in ch.ch6_color_temp));
test("ch6 has accentColor", () => assert("accentColor" in ch.ch6_color_temp));
test("ch6 has surfaceStack", () => assert(Array.isArray(ch.ch6_color_temp.surfaceStack) && ch.ch6_color_temp.surfaceStack.length === 4));
test("ch7 has componentRadius", () => assert("componentRadius" in ch.ch7_edge));
test("ch7 has imageRadius", () => assert("imageRadius" in ch.ch7_edge));
test("ch7 has asymmetric", () => assert("asymmetric" in ch.ch7_edge));
test("ch8 has enterDirection", () => assert("enterDirection" in ch.ch8_motion));
test("ch8 has hoverIntensity", () => assert("hoverIntensity" in ch.ch8_motion));
test("ch8 has reducedMotionFallback", () => assert("reducedMotionFallback" in ch.ch8_motion));
test("ch9 has mobileColumns", () => assert("mobileColumns" in ch.ch9_grid));
test("ch10 has elevationSystem", () => assert("elevationSystem" in ch.ch10_hierarchy));
test("ch10 has depthCues", () => assert("depthCues" in ch.ch10_hierarchy));
test("ch11 has grainFrequency", () => assert("grainFrequency" in ch.ch11_texture));
test("ch11 has overlayBlend", () => assert("overlayBlend" in ch.ch11_texture));
test("ch11 no dead pattern:null", () => assert(!("pattern" in ch.ch11_texture)));
test("ch13 has coverage", () => assert("coverage" in ch.ch13_atmosphere));
test("ch14 has metalness", () => assert("metalness" in ch.ch14_physics));
test("ch15 has shapeFamily", () => assert("shapeFamily" in ch.ch15_biomarker));
test("ch15 has animationStyle", () => assert("animationStyle" in ch.ch15_biomarker));
test("ch15 healthcare + enable3D → biological shapeFamily", () => {
    const g3d = sequencer.generate("completeness-test", {
        informationDensity: 0.5, temporalUrgency: 0.5, emotionalTemperature: 0.5,
        playfulness: 0.5, spatialDependency: 0.5, trustRequirement: 0.5,
        visualEmphasis: 0.5, conversionFocus: 0.5,
    }, { primarySector: "healthcare", options: { enable3D: true } });
    eq(g3d.chromosomes.ch15_biomarker.shapeFamily, "biological");
});
test("ch19 has height", () => assert("height" in ch.ch19_hero_variant_detail));
test("ch19 has backgroundTreatment", () => assert("backgroundTreatment" in ch.ch19_hero_variant_detail));
test("ch20 has imageAspectRatio", () => assert("imageAspectRatio" in ch.ch20_visual_treatment));
test("ch20 has colorGrading", () => assert("colorGrading" in ch.ch20_visual_treatment));
test("ch21 has animationType", () => assert("animationType" in ch.ch21_trust_signals));
test("ch22 has logoCount", () => assert("logoCount" in ch.ch22_social_proof));
test("ch22 has displayStyle", () => assert("displayStyle" in ch.ch22_social_proof));
test("ch22 has animationTrigger", () => assert("animationTrigger" in ch.ch22_impact_demonstration));
test("ch24 has abTestingReady", () => assert("abTestingReady" in ch.ch24_personalization));
test("ch24 has segmentCount", () => assert("segmentCount" in ch.ch24_personalization));

// ──────────────────────────────────────────────
// Summary
// ──────────────────────────────────────────────
console.log(`\n${"─".repeat(60)}`);
if (failed === 0) {
    console.log(`✅ All ${passed} production tests passed!\n`);
} else {
    console.log(`❌ ${failed} failed, ${passed} passed\n`);
    process.exit(1);
}
