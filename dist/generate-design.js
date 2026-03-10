/**
 * Permutations MCP - Generate Design
 *
 * Main entry point for sector-aware design generation.
 * Demonstrates the complete pipeline from content analysis to output.
 */
import { GenomeSequencer } from "./genome/sequencer.js";
import { ContentExtractor } from "./genome/extractor.js";
import { CSSGenerator } from "./css-generator.js";
import { HTMLGenerator } from "./html-generator.js";
import * as fs from "fs";
import * as path from "path";
/**
 * Generate a complete design from content text
 */
export async function generateFromContent(content, brandColors, options) {
    const startTime = Date.now();
    try {
        // Step 1: Analyze content
        console.log("📊 Analyzing content...");
        const extractor = new ContentExtractor();
        const analysis = extractor.analyze(content);
        if (!analysis.success || !analysis.content) {
            return {
                success: false,
                error: analysis.error || "Failed to analyze content",
                metadata: {
                    sector: "technology",
                    subSector: "unknown",
                    heroType: "unknown",
                    generationTime: Date.now() - startTime
                }
            };
        }
        const { traits, sector, subSector } = analysis.content;
        // Step 2: Configure sequencer
        const config = {
            primarySector: sector.primary,
            brand: brandColors ? {
                colors: brandColors,
                weight: 0.7
            } : undefined,
            options: {
                creativityLevel: "balanced",
                brandWeight: 0.7,
                sectorWeight: 0.5
            }
        };
        // Step 3: Generate genome
        console.log(`🧬 Generating genome for ${sector.primary} sector...`);
        const sequencer = new GenomeSequencer();
        const seed = `${content}-${Date.now()}`;
        const genome = sequencer.generate(seed, traits, config);
        // Step 4: Generate CSS
        console.log("🎨 Generating CSS...");
        const cssGenerator = new CSSGenerator();
        const css = cssGenerator.generate(genome, {
            includeReset: true,
            includeVariables: true,
            format: "expanded"
        });
        // Step 5: Generate HTML
        console.log("📝 Generating HTML...");
        const htmlGenerator = new HTMLGenerator();
        const html = htmlGenerator.generate(genome, {
            heroOnly: options?.heroOnly ?? false,
            includeSections: !options?.heroOnly
        });
        // Step 6: Save output if requested
        if (options?.outputDir) {
            const outputDir = options.outputDir;
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            fs.writeFileSync(path.join(outputDir, "styles.css"), css);
            fs.writeFileSync(path.join(outputDir, "index.html"), html);
            fs.writeFileSync(path.join(outputDir, "genome.json"), JSON.stringify(genome, null, 2));
            console.log(`💾 Output saved to ${outputDir}`);
        }
        const generationTime = Date.now() - startTime;
        return {
            success: true,
            genome,
            css,
            html,
            metadata: {
                sector: sector.primary,
                subSector: subSector.classification,
                heroType: genome.chromosomes.ch19_hero_type.type,
                generationTime
            }
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            metadata: {
                sector: "technology",
                subSector: "unknown",
                heroType: "unknown",
                generationTime: Date.now() - startTime
            }
        };
    }
}
/**
 * Generate design from sector and traits directly
 */
export async function generateFromSector(sector, traits, options) {
    const startTime = Date.now();
    try {
        const config = {
            primarySector: sector,
            brand: options?.brandColors ? {
                colors: options.brandColors,
                weight: 0.7
            } : undefined,
            options: {
                creativityLevel: "balanced"
            }
        };
        const sequencer = new GenomeSequencer();
        const seed = `${sector}-${Date.now()}`;
        const genome = sequencer.generate(seed, traits, config);
        const cssGenerator = new CSSGenerator();
        const css = cssGenerator.generate(genome);
        const htmlGenerator = new HTMLGenerator();
        const html = htmlGenerator.generate(genome);
        if (options?.outputDir) {
            const outputDir = options.outputDir;
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            fs.writeFileSync(path.join(outputDir, "styles.css"), css);
            fs.writeFileSync(path.join(outputDir, "index.html"), html);
        }
        return {
            success: true,
            genome,
            css,
            html,
            metadata: {
                sector,
                subSector: genome.sectorContext?.subSector || "unknown",
                heroType: genome.chromosomes.ch19_hero_type.type,
                generationTime: Date.now() - startTime
            }
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            metadata: {
                sector,
                subSector: "unknown",
                heroType: "unknown",
                generationTime: Date.now() - startTime
            }
        };
    }
}
/**
 * Demo function - generate samples for all sectors
 */
export async function generateSectorSamples(outputDir = "./samples") {
    const sectors = [
        "healthcare",
        "fintech",
        "automotive",
        "education",
        "commerce",
        "technology"
    ];
    const sampleContent = {
        healthcare: "Medical clinic specializing in patient care. Board certified doctors providing wellness services, surgery, and preventive healthcare. Trusted by thousands of patients for over 20 years.",
        fintech: "Secure banking platform for digital payments. Manage investments, loans, and wealth with enterprise-grade security. Trusted by millions for fast, reliable transactions.",
        automotive: "Premium vehicle dealership offering new and used cars. Electric vehicles, SUVs, and luxury sedans. Test drive today and experience the difference.",
        education: "Online learning platform with courses in technology, business, and design. Expert instructors, certification programs, and flexible scheduling for students worldwide.",
        commerce: "E-commerce marketplace with thousands of products. Fast shipping, easy returns, and great prices. Shop electronics, fashion, home goods, and more.",
        entertainment: "Streaming service with movies, TV shows, and original content. Watch anywhere, anytime on any device. Start your free trial today.",
        technology: "Cloud software platform for development teams. API-first architecture, real-time collaboration, and scalable infrastructure for modern applications.",
        manufacturing: "Industrial equipment manufacturer. Precision machinery, automation systems, and quality engineering. Serving factories worldwide for over 50 years.",
        legal: "Law firm specializing in corporate law, litigation, and contracts. Experienced attorneys providing strategic counsel. Proven track record of success.",
        real_estate: "Real estate agency helping buyers and sellers. Residential properties, commercial spaces, and investment opportunities. Find your dream home today.",
        travel: "Travel booking platform for flights, hotels, and experiences. Explore destinations worldwide with exclusive deals. Plan your next adventure.",
        food: "Restaurant serving fresh, locally-sourced cuisine. Chef-prepared meals, catering services, and private dining. Book your table today.",
        sports: "Sports facility with training programs, leagues, and fitness classes. State-of-the-art equipment, professional coaches, and community events."
    };
    console.log("🎨 Generating sector samples...\n");
    for (const sector of sectors) {
        console.log(`Generating ${sector}...`);
        const result = await generateFromContent(sampleContent[sector], undefined, { outputDir: `${outputDir}/${sector}` });
        if (result.success) {
            console.log(`  ✓ ${sector}: ${result.metadata.heroType} hero`);
        }
        else {
            console.log(`  ✗ ${sector}: ${result.error}`);
        }
    }
    console.log(`\n✅ Samples saved to ${outputDir}`);
}
// CLI entry point
const args = process.argv.slice(2);
const command = args[0];
if (command === "demo") {
    generateSectorSamples(args[1] || "./samples");
}
else if (command === "from-content") {
    const content = args[1] || "Sample technology company website";
    generateFromContent(content, undefined, { outputDir: "./output" })
        .then(result => {
        if (result.success) {
            console.log("\n✅ Design generated successfully!");
            console.log(`  Sector: ${result.metadata.sector}`);
            console.log(`  Hero Type: ${result.metadata.heroType}`);
            console.log(`  Generation Time: ${result.metadata.generationTime}ms`);
        }
        else {
            console.error("❌ Generation failed:", result.error);
            process.exit(1);
        }
    });
}
else if (import.meta.url === `file://${process.argv[1]}`) {
    // Only show help when run directly
    console.log(`
Permutations MCP - Design Generator

Usage:
  node generate-design.js demo [output-dir]     Generate sample designs for all sectors
  node generate-design.js from-content "text"   Generate from content text

Examples:
  node generate-design.js demo ./samples
  node generate-design.js from-content "Healthcare clinic providing medical services"
`);
}
