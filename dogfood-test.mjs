#!/usr/bin/env node
/**
 * Quick dogfooding test - generates website with fixed CSS generator
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load story data
const storyData = JSON.parse(readFileSync(join(__dirname, "permutations_story.json"), "utf-8"));

// Import tools
const { GenomeSequencer } = await import("./dist/genome/sequencer.js");
const { CSSGenerator } = await import("./dist/css-generator.js");
const { HTMLGenerator } = await import("./dist/html-generator.js");

console.log("🧬 Permutations MCP - Dogfooding Test");
console.log("=" .repeat(50));

// Generate genome from story
const seed = "permutations-website-v006-" + Date.now();
const traits = {
    informationDensity: 0.7,
    temporalUrgency: 0.4,
    emotionalTemperature: 0.6,
    playfulness: 0.5,
    spatialDependency: 0.3,
    trustRequirement: 0.6,
    visualEmphasis: 0.7,
    conversionFocus: 0.4
};

console.log("\n1️⃣ Generating genome...");
const sequencer = new GenomeSequencer();
const genome = sequencer.generate(seed, traits, { primarySector: "technology" });
console.log(`   ✅ ${genome.chromosomes.length} chromosomes generated`);

console.log("\n2️⃣ Generating CSS...");
const cssGen = new CSSGenerator();
const css = cssGen.generate(genome);
const nanCount = (css.match(/NaN/g) || []).length;
console.log(`   ✅ ${css.split("\n").length} lines of CSS`);
console.log(`   ✅ NaN check: ${nanCount === 0 ? "PASS ✅" : "FAIL ❌ (" + nanCount + " found)"}`);

console.log("\n3️⃣ Generating HTML...");
const htmlGen = new HTMLGenerator();
const html = htmlGen.generate(genome, {
    title: "Permutations MCP",
    description: storyData.story?.elevator_pitch || "Design DNA Generator"
});
const htmlNanCount = (html.match(/NaN/g) || []).length;
console.log(`   ✅ ${html.split("\n").length} lines of HTML`);
console.log(`   ✅ NaN check: ${htmlNanCount === 0 ? "PASS ✅" : "FAIL ❌ (" + htmlNanCount + " found)"}`);

// Save output
const outputDir = join(__dirname, "dogfood-output");
try { mkdirSync(outputDir, { recursive: true }); } catch {}

const cssPath = join(outputDir, "generated.css");
const htmlPath = join(outputDir, "generated.html");
writeFileSync(cssPath, css);
writeFileSync(htmlPath, html);

console.log("\n" + "=".repeat(50));
console.log("🎉 Dogfooding test complete!");
console.log(`   CSS:  ${nanCount === 0 ? "✅ Valid" : "❌ Has NaN"}`);
console.log(`   HTML: ${htmlNanCount === 0 ? "✅ Valid" : "❌ Has NaN"}`);
console.log(`\n📁 Output saved to:`);
console.log(`   ${cssPath}`);
console.log(`   ${htmlPath}`);

// Quick preview of CSS variables
console.log("\n📄 CSS Variables Preview:");
const varLines = css.split("\n").filter(l => l.includes("--") && l.includes(":")).slice(0, 10);
varLines.forEach(l => console.log("   " + l.trim()));
