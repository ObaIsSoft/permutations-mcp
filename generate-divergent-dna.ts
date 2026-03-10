import { GenomeSequencer } from "./src/genome/sequencer.js";
import { SemanticTraitExtractor } from "./src/semantic/extractor.js";
import * as fs from "fs";

// Test the divergent evolution concept using an async wrapper
async function run() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error("ERROR: GROQ_API_KEY is required for trait extraction.");
        console.error("Run: GROQ_API_KEY=your_key node --loader ts-node/esm generate-divergent-dna.ts");
        process.exit(1);
    }

    const extractor = new SemanticTraitExtractor(apiKey);
    const sequencer = new GenomeSequencer();

    const intent = "Japanese Y2K brutalist fashion e-commerce site with maximalist typography and metallic chrome materials";
    const context = "Alien high-fashion on a gas giant moon with crystalline atmosphere";

    // Infer a reasonable sector from the intent
    const sectorConfig = { primarySector: "commerce" as const };

    console.log("=== PLANETARY SURVEY ===");
    console.log("Intent:", intent);
    console.log("Context:", context);
    console.log("");

    const traits = await extractor.extractTraits(intent, context);

    console.log("Atmospheric Conditions (Traits):");
    console.log("  Information Density:", traits.informationDensity, "- Data-rich environment");
    console.log("  Temporal Urgency:", traits.temporalUrgency, "- Active tectonics");
    console.log("  Emotional Temperature:", traits.emotionalTemperature, "- Cool climate");
    console.log("  Playfulness:", traits.playfulness, "- Chaotic weather patterns");
    console.log("  Spatial Dependency:", traits.spatialDependency, "- Deep atmosphere");
    console.log("");

    // Generate base planet DNA (dominant life form)
    const baseGenome = sequencer.generate("planet-y2k-moon", traits, sectorConfig);

    console.log("=== DIVERGENT EVOLUTION SIMULATION ===");
    console.log("Base Organism DNA Hash:", baseGenome.dnaHash.slice(0, 16));
    console.log("");

    // Simulate microbial variations (same base, tiny mutations)
    const microbialVariants = [];

    for (let i = 0; i < 8; i++) {
        const variantSeed = `planet-y2k-moon-microbe-${i}`;
        const variant = sequencer.generate(variantSeed, traits, sectorConfig);
        microbialVariants.push({
            id: `M-${i}`,
            material: variant.chromosomes.ch14_physics.material,
            edgeRadius: variant.chromosomes.ch7_edge.radius,
            entropy: variant.chromosomes.ch12_signature.entropy,
            mutation: variant.chromosomes.ch12_signature.uniqueMutation
        });
    }

    console.log("🦠 MICROBIAL COLONY (8 variants detected):");
    microbialVariants.forEach(m => {
        console.log(`  ${m.id}: ${m.material}, ${m.edgeRadius}px edges, entropy: ${m.entropy.toFixed(2)}`);
    });
    console.log("");

    // Flora variants (structural adaptations)
    const floraVariants = [];
    for (let i = 0; i < 4; i++) {
        // Slightly different traits for flora (more spatial, less temporal)
        const floraTraits = {
            ...traits,
            temporalUrgency: Math.max(0.1, traits.temporalUrgency - 0.3),
            spatialDependency: Math.min(1.0, traits.spatialDependency + 0.1)
        };
        const variant = sequencer.generate(`planet-y2k-moon-flora-${i}`, floraTraits, sectorConfig);
        floraVariants.push({
            id: `F-${i}`,
            topology: variant.chromosomes.ch1_structure.topology,
            geometry: variant.chromosomes.ch15_biomarker.geometry,
            fx: variant.chromosomes.ch13_atmosphere.fx
        });
    }

    console.log("🌿 FLORA ECOSYSTEM (4 structural variants):");
    floraVariants.forEach(f => {
        console.log(`  ${f.id}: ${f.topology} topology, ${f.geometry} geometry, ${f.fx} atmosphere`);
    });
    console.log("");

    // Check if civilization possible
    const complexityThreshold = 0.85;
    const canSupportCivilization = baseGenome.chromosomes.ch15_biomarker.complexity > complexityThreshold;

    console.log("🏛️ CIVILIZATION STATUS:");
    console.log(`  Life Complexity: ${baseGenome.chromosomes.ch15_biomarker.complexity.toFixed(2)}`);
    console.log(`  Threshold: ${complexityThreshold}`);
    console.log(`  Status: ${canSupportCivilization ? "TECHNOLOGICAL CIVILIZATION DETECTED" : "No sentient life (complexity too low)"}`);
    console.log("");

    if (canSupportCivilization) {
        console.log("  Technology Tree:");
        console.log("    ├─ Material Science: Glassworking (transmission high)");
        console.log("    ├─ Architecture: Organic brutalism");
        console.log("    └─ Communication: CRT noise signaling");
    }

    console.log("");
    console.log("=== EXPORT ===");
    console.log("Generated ecosystem data written to: website/src/ecosystem.json");

    const ecosystemData = {
        planet: {
            seed: "planet-y2k-moon",
            conditions: traits,
            baseGenome: {
                dnaHash: baseGenome.dnaHash,
                primaryColor: baseGenome.chromosomes.ch5_color_primary.hue,
                material: baseGenome.chromosomes.ch14_physics.material,
                complexity: baseGenome.chromosomes.ch15_biomarker.complexity
            }
        },
        lifeForms: {
            microbial: microbialVariants,
            flora: floraVariants,
            civilization: canSupportCivilization ? {
                complexity: baseGenome.chromosomes.ch15_biomarker.complexity,
                techLevel: "glass-civilization"
            } : null
        }
    };

    fs.writeFileSync("website/src/ecosystem.json", JSON.stringify(ecosystemData, null, 2));
}

run().catch(e => {
    console.error("❌ Error:", e);
    process.exit(1);
});
