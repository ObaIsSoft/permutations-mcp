import { SemanticTraitExtractor } from "./src/semantic/extractor.js";
import { GenomeSequencer } from "./src/genome/sequencer.js";
import { CSSGenerator } from "./src/css-generator.js";
import { HTMLGenerator } from "./src/html-generator.js";
import { WebGLGenerator } from "./src/generators/webgl-generator.js";
import { FXGenerator } from "./src/generators/fx-generator.js";
import { SVGGenerator } from "./src/generators/svg-generator.js";
import { EpigeneticParser } from "./src/genome/epigenetics.js";

async function run() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error("ERROR: Missing GROQ_API_KEY environment variable.");
        console.error("Run: GROQ_API_KEY=your_key npm run generate");
        process.exit(1);
    }

    // Dogfooding: Test the actual SemanticTraitExtractor class
    const extractor = new SemanticTraitExtractor(apiKey);
    const sequencer = new GenomeSequencer();
    const cssGen = new CSSGenerator();
    const htmlGen = new HTMLGenerator();
    const webglGen = new WebGLGenerator();
    const fxGen = new FXGenerator();
    const svgGen = new SVGGenerator();
    const epigeneticParser = new EpigeneticParser();

    // The payload structure - rich, opinionated prompt that reflects the full story
    const intent = "A dark, avant-garde product landing page for a parametric design engine that mathematically generates unique design systems from biological metaphors. The page should feel like a living organism — alien, technical, and visually uncompromising. High spatial complexity, experimental typography, and atmospheric depth are essential. This is NOT a SaaS landing page. It is a manifesto.";
    const projectContext = "Permutations is an MCP (Model Context Protocol) server that intercepts AI code generation and forces it to produce mathematically unique UI systems instead of template-based slop. Every design decision — typography, color, spacing, motion, 3D geometry — is derived from a SHA-256 hash of semantic intent vectors. The design philosophy: as life evolves distinct organisms to survive on different planets (atmospheric pressure, radiation, gravity), Permutations evolves distinct design organisms to survive in different content environments. The brand must feel:  1) Technical and precise — monospace fonts, data-dense layouts, exact mathematical values  2) Biological and spatial — organic shapes, membrane-like transparency, 3D depth  3) Avant-garde and uncompromising — not a startup, not a SaaS, a manifesto. 4) Dark and atmospheric — deep space energy, bioluminescent accents, zero whitespace generosity. The audience is senior designers and developers who hate generic AI output. The visual DNA should make them immediately recognize this is different.";

    console.log("🧬 PERMUTATIONS DOGFOODING\n");
    console.log("Intent:", intent);
    console.log("Context:", projectContext.slice(0, 80) + "...\n");

    try {
        // Use the ACTUAL SemanticTraitExtractor (not inline duplication)
        const traits = await extractor.extractTraits(intent, projectContext);
        console.log("✅ Extracted Traits:", JSON.stringify(traits, null, 2));

        // Parse any brand assets (V3 Epigenetics)
        const epigeneticData = await epigeneticParser.parseAssets([]);

        // Generate the full DNA
        const genome = sequencer.generate("Permutations Product Page", traits, { primarySector: "technology" }, epigeneticData);

        // Generate all design outputs
        const tailwindConfig = cssGen.generate(genome, { format: "expanded" });
        const topology = htmlGen.generateTopology(genome);
        const webglComponents = webglGen.generateR3F(genome);
        const fxAtmosphere = fxGen.generateCSSClass(genome);
        const svgBiomarker = svgGen.generateBiomarker(genome);

        console.log("\n========= GENOME DNA =========");
        console.log(`Hash: ${genome.dnaHash.slice(0, 24)}...`);
        console.log(`Topology: ${genome.chromosomes.ch1_structure.topology}`);
        console.log(`Grid: ${genome.chromosomes.ch9_grid.logic}`);
        console.log(`Motion: ${genome.chromosomes.ch8_motion.physics}`);
        console.log(`FX: ${genome.chromosomes.ch13_atmosphere.fx}`);
        console.log(`Material: ${genome.chromosomes.ch14_physics.material}`);
        console.log(`Biomarker: ${genome.chromosomes.ch15_biomarker.geometry}`);
        console.log(`Viability Score: ${genome.viabilityScore}`);

        console.log("\n========= TAILWIND CONFIG =========");
        console.log(tailwindConfig);

        console.log("\n========= HTML TOPOLOGY =========");
        console.log(JSON.stringify(topology, null, 2));

        console.log("\n========= WEBGL / 3D =========");
        console.log(webglComponents);

        console.log("\n========= FX ATMOSPHERE =========");
        console.log(fxAtmosphere);

        console.log("\n========= SVG BIOMARKER =========");
        console.log(svgBiomarker);
        // Write genome.json to website public folder so the site picks it up
        import("fs").then(fs => {
            const genomeJson = JSON.stringify(genome, null, 2);
            fs.writeFileSync("website/public/genome.json", genomeJson, "utf-8");
            fs.writeFileSync("website/src/genome.json", genomeJson, "utf-8"); // for IDE imports
            console.log("\n✅ genome.json written to website/public/genome.json (served at /genome.json)");
            console.log(`   Primary Hue: ${genome.chromosomes.ch5_color_primary.hue}° (${genome.chromosomes.ch5_color_primary.temperature})`);
            console.log(`   Font: ${genome.chromosomes.ch3_type_display.family.split(",")[0].trim()}`);
            console.log(`   Radius: ${genome.chromosomes.ch7_edge.radius}px`);
            console.log(`   Biomarker: ${genome.chromosomes.ch15_biomarker.geometry}`);
            console.log(`   Rendering: ${genome.chromosomes.ch18_rendering.primary}`);

            // Also write full output dump for debugging
            const fullOutput = [
                "=== TAILWIND CONFIG ===", tailwindConfig,
                "=== HTML TOPOLOGY ===", JSON.stringify(topology, null, 2),
                "=== WEBGL COMPONENTS ===", webglComponents,
                "=== FX ATMOSPHERE ===", fxAtmosphere,
                "=== SVG BIOMARKER ===", svgBiomarker,
            ].join("\n\n");
            fs.writeFileSync("dna_output_v2.txt", fullOutput, "utf-8");
            console.log("✅ Full output written to dna_output_v2.txt");
        });


        // Demonstrate archetype mode (no API key required)
        console.log("\n\n========= ARCHETYPE MODE (No API Key) =========");
        console.log("Generating dashboard archetype...\n");

        const archetypeGenome = sequencer.generateFromArchetype("dashboard", "demo-dashboard-001");
        console.log(`Archetype: Departure Board (dashboard)`);
        console.log(`Topology: ${archetypeGenome.chromosomes.ch1_structure.topology}`);
        console.log(`Motion: ${archetypeGenome.chromosomes.ch8_motion.physics}`);
        console.log(`Edge: ${archetypeGenome.chromosomes.ch7_edge.style} (${archetypeGenome.chromosomes.ch7_edge.radius}px)`);
        console.log(`Type: ${archetypeGenome.chromosomes.ch3_type_display.charge}`);
        console.log(`Forbidden: ${archetypeGenome.constraints.forbiddenPatterns.join(", ") || "none"}`);
        console.log(`Bonding Rules: ${archetypeGenome.constraints.bondingRules.join("; ")}`);

    } catch (e) {
        console.error("❌ Error generating DNA:", e);
        process.exit(1);
    }
}

run();
