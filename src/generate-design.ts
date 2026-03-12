/**
 * Permutations MCP - Generate Design
 * 
 * Main entry point for sector-aware design generation.
 * Demonstrates the complete pipeline from content analysis to output.
 */

import { GenomeSequencer, SequencerConfig } from "./genome/sequencer.js";
import { SemanticTraitExtractor } from "./semantic/extractor.js";
import { CSSGenerator } from "./css-generator.js";
import { HTMLGenerator } from "./html-generator.js";
import { DesignGenome, PrimarySector, ContentTraits } from "./genome/types.js";
import * as fs from "fs";
import * as path from "path";

interface GenerationResult {
    success: boolean;
    genome?: DesignGenome;
    css?: string;
    html?: string;
    error?: string;
    metadata: {
        sector: PrimarySector;
        subSector: string;
        heroType: string;
        generationTime: number;
    };
}

/**
 * Generate a complete design from content text
 */
export async function generateFromContent(
    content: string,
    brandColors?: { primary?: string; secondary?: string },
    options?: { outputDir?: string; heroOnly?: boolean }
): Promise<GenerationResult> {
    const startTime = Date.now();
    
    try {
        // Step 1: Extract traits via LLM
        const extractor = new SemanticTraitExtractor();
        const traits = await extractor.extractTraits(content);
        const sectorResult = await extractor.classifySector(content);
        const sector = { primary: sectorResult.primary as PrimarySector };
        const subSector = { classification: `${sector.primary}_general` };
        
        // Step 2: Configure sequencer
        const config: SequencerConfig = {
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
        const sequencer = new GenomeSequencer();
        const seed = `${content}-${Date.now()}`;
        const genome = sequencer.generate(seed, traits, config);
        
        // Step 4: Generate CSS
        const cssGenerator = new CSSGenerator();
        const css = cssGenerator.generate(genome, {
            includeReset: true,
            includeVariables: true,
            format: "expanded"
        });
        
        // Step 5: Generate HTML
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
            fs.writeFileSync(
                path.join(outputDir, "genome.json"),
                JSON.stringify(genome, null, 2)
            );
            
            // Output saved
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
        
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            metadata: {
                sector: "technology" as PrimarySector,
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
export async function generateFromSector(
    sector: PrimarySector,
    traits: ContentTraits,
    options?: { brandColors?: { primary?: string }; outputDir?: string }
): Promise<GenerationResult> {
    const startTime = Date.now();
    
    try {
        const config: SequencerConfig = {
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
        
    } catch (error) {
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
export async function generateSectorSamples(outputDir: string = "./samples"): Promise<void> {
    const sectors: PrimarySector[] = [
        "healthcare",
        "fintech", 
        "automotive",
        "education",
        "commerce",
        "technology"
    ];
    
    const sampleContent: Record<PrimarySector, string> = {
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
        const result = await generateFromContent(
            sampleContent[sector],
            undefined,
            { outputDir: `${outputDir}/${sector}` }
        );
        
        if (result.success) {
            console.log(`  ✓ ${sector}: ${result.metadata.heroType} hero`);
        } else {
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
} else if (command === "from-content") {
    const content = args[1] || "Sample technology company website";
    generateFromContent(content, undefined, { outputDir: "./output" })
        .then(result => {
            if (result.success) {
                console.log("\n✅ Design generated successfully!");
                console.log(`  Sector: ${result.metadata.sector}`);
                console.log(`  Hero Type: ${result.metadata.heroType}`);
                console.log(`  Generation Time: ${result.metadata.generationTime}ms`);
            } else {
                console.error("❌ Generation failed:", result.error);
                process.exit(1);
            }
        });
} else if (import.meta.url === `file://${process.argv[1]}`) {
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
