import { SemanticTraitExtractor } from "./src/semantic/extractor.js";
import { CivilizationGenerator } from "./src/genome/civilization.js";
import { GenomeSequencer } from "./src/genome/sequencer.js";
import { generateCivilizationOutput } from "./src/generators/civilization-generators.js";
import { writeFileSync } from "fs";

async function generateWebsiteCivilization() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error("ERROR: Missing GROQ_API_KEY environment variable.");
        console.error("Run: GROQ_API_KEY=your_key npm run generate");
        process.exit(1);
    }

    const extractor = new SemanticTraitExtractor(apiKey);
    const civGen = new CivilizationGenerator();
    const sequencer = new GenomeSequencer();

    // Intent that will trigger high complexity
    const intent = "A sophisticated product marketing website with immersive storytelling, interactive demonstrations, and generative design elements";

    const projectContext = "The Permutations Engine: A biological, planetary adaptation system where designs emerge as living organisms. Technical manifesto—avant-garde, uncompromising, deeply parametric. Multi-section layout with hero, feature blocks, documentation, and footer. Rich animations, dark mode support, and accessible navigation.";

    console.log("🧬 GENERATING WEBSITE CIVILIZATION\n");
    console.log("Intent:", intent);
    console.log("Context:", projectContext.slice(0, 100) + "...\n");

    try {
        // Extract traits
        const traits = await extractor.extractTraits(intent, projectContext);
        console.log("✅ Extracted Traits:", JSON.stringify(traits, null, 2));

        // Generate civilization tier (force at least civilized)
        const tier = civGen.generate(intent, projectContext, traits, 'civilized');

        console.log("\n🏛️ CIVILIZATION TIER ACHIEVED\n");
        console.log("Tier:", tier.tier.toUpperCase());
        console.log("Complexity:", tier.complexity.toFixed(3));
        console.log("Architecture:", tier.architecture.pattern);
        console.log("Components:", tier.components.count);
        console.log("Animation Physics:", tier.animations.physics);

        // Generate base genome for color/motion values
        const genome = sequencer.generate("Permutations Website v2", traits, { primarySector: "technology" });

        console.log("\n🎨 GENOME DNA");
        console.log("Hash:", genome.dnaHash.slice(0, 24) + "...");
        console.log("Primary Hue:", genome.chromosomes.ch5_color_primary.hue);
        console.log("Edge Radius:", genome.chromosomes.ch7_edge.radius);
        console.log("Motion:", genome.chromosomes.ch8_motion.physics);

        // Generate civilization code outputs
        const outputs = generateCivilizationOutput(tier, genome);

        // Save component code
        writeFileSync(
            './website/src/generated/components.tsx',
            outputs.components
        );
        console.log("\n📁 Generated: website/src/generated/components.tsx");

        writeFileSync(
            './website/src/generated/animations.ts',
            outputs.animations
        );
        console.log("📁 Generated: website/src/generated/animations.ts");

        writeFileSync(
            './website/src/generated/architecture.ts',
            outputs.architecture
        );
        console.log("📁 Generated: website/src/generated/architecture.ts");

        writeFileSync(
            './website/src/generated/tokens.css',
            outputs.tokens
        );
        console.log("📁 Generated: website/src/generated/tokens.css");

        // Create genome.json for dynamic theming
        const genomeOutput = {
            dnaHash: genome.dnaHash,
            traits,
            tier: tier.tier,
            complexity: tier.complexity,
            chromosomes: genome.chromosomes,
            components: tier.components.list.map(c => ({
                name: c.name,
                category: c.category,
                variants: c.variants
            })),
            constraints: genome.constraints,
            viabilityScore: genome.viabilityScore
        };

        writeFileSync(
            './website/public/genome.json',
            JSON.stringify(genomeOutput, null, 2)
        );
        console.log("📁 Generated: website/public/genome.json");

        // Print summary
        console.log("\n✨ WEBSITE REGENERATION COMPLETE\n");
        console.log("The website now uses:");
        console.log("  •", tier.components.count, "component design system");
        console.log("  •", tier.architecture.pattern, "architecture");
        console.log("  •", tier.animations.physics, "animation physics");
        console.log("  •", tier.designSystem.themes, "themes");
        console.log("  • DNA-driven colors from genome");
        console.log("\nRebuild the website to see the changes:");
        console.log("  cd website && npm run build");

    } catch (e) {
        console.error("❌ Error:", e);
        process.exit(1);
    }
}

generateWebsiteCivilization();
