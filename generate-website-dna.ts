import { GenomeSequencer } from "./src/genome/sequencer.js";
import { CSSGenerator } from "./src/css-generator.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Generate genome for the Permutations product page
const sequencer = new GenomeSequencer();
const generator = new CSSGenerator();

// Content traits for the Permutations website:
// - High information density (technical docs, code, features)
// - Medium temporal urgency (product page - not dashboard, not novel)
// - Clinical/technical tone (developer tool, not emotional)
// - Low playfulness (serious, brutalist aesthetic)
// - Medium spatial dependency (some 3D element, mostly flat UI)
const genome = sequencer.generate("permutations-website-v1", {
    informationDensity: 0.75,    // Technical documentation + code samples
    temporalUrgency: 0.5,        // Product page - not urgent but not slow
    emotionalTemperature: 0.3,   // Clinical/technical
    playfulness: 0.25,           // Serious developer tool
    spatialDependency: 0.45,     // Some depth but mostly flat
    trustRequirement: 0.2,       // Developer tool — low trust pressure
    visualEmphasis: 0.45,        // Balanced: code + visuals
    conversionFocus: 0.4         // Moderate — manifesto first, conversion second
}, { primarySector: "technology" });

console.log("=== Generated Genome for Website ===");
console.log("DNA Hash:", genome.dnaHash);
console.log("");
console.log("Colors:");
console.log("  Primary hue:", genome.chromosomes.ch5_color_primary.hue);
console.log("  Saturation:", genome.chromosomes.ch5_color_primary.saturation.toFixed(2));
console.log("  Lightness:", genome.chromosomes.ch5_color_primary.lightness.toFixed(2));
console.log("  Temperature:", genome.chromosomes.ch5_color_primary.temperature);
console.log("");
console.log("Typography:");
console.log("  Display font:", genome.chromosomes.ch3_type_display.family);
console.log("  Body font:", genome.chromosomes.ch4_type_body.family);
console.log("  Display size:", genome.chromosomes.ch16_typography.display.size);
console.log("  Body size:", genome.chromosomes.ch16_typography.body.size);
console.log("  Scale ratio:", genome.chromosomes.ch16_typography.ratio);
console.log("");
console.log("Layout:");
console.log("  Edge radius:", genome.chromosomes.ch7_edge.radius, "px");
console.log("  Rhythm density:", genome.chromosomes.ch2_rhythm.density);
console.log("  Base spacing:", genome.chromosomes.ch2_rhythm.baseSpacing);
console.log("");
console.log("Rendering:");
console.log("  Primary:", genome.chromosomes.ch18_rendering.primary);
console.log("  Fallback:", genome.chromosomes.ch18_rendering.fallback);
console.log("  Complexity:", genome.chromosomes.ch18_rendering.complexity);
console.log("  Animate:", genome.chromosomes.ch18_rendering.animate);
console.log("");
console.log("Accessibility:");
console.log("  Min contrast:", genome.chromosomes.ch17_accessibility.minContrastRatio, ":1");
console.log("  Focus indicator:", genome.chromosomes.ch17_accessibility.focusIndicator);
console.log("  Touch target:", genome.chromosomes.ch17_accessibility.minTouchTarget, "px");

// Generate Tailwind config from genome
const tailwindConfig = generator.generate(genome, { format: "expanded" });

// Write files for website
const websiteDir = path.join(__dirname, "website");
const genomePath = path.join(websiteDir, "src", "genome.json");
const tailwindPath = path.join(websiteDir, "tailwind.config.js");

fs.writeFileSync(genomePath, JSON.stringify(genome, null, 2));
fs.writeFileSync(tailwindPath, tailwindConfig);

console.log("");
console.log("✓ Generated files:");
console.log("  - website/src/genome.json");
console.log("  - website/tailwind.config.js");
