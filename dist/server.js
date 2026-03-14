import * as fs from "fs/promises";
import * as fsSync from "fs";
import * as path from "path";
// Load .env if present (no dotenv dep — pure Node.js)
// Does NOT override vars already set in the environment, so shell vars win.
try {
    const envFile = path.join(path.dirname(new URL(import.meta.url).pathname), "../.env");
    if (fsSync.existsSync(envFile)) {
        const lines = fsSync.readFileSync(envFile, "utf-8").split("\n");
        for (const line of lines) {
            const m = line.match(/^\s*([^#=\s][^=]*?)\s*=\s*(.*)\s*$/);
            if (m && !process.env[m[1]])
                process.env[m[1]] = m[2];
        }
    }
}
catch { /* ignore */ }
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { SemanticTraitExtractor } from "./semantic/extractor.js";
import { GenomeSequencer } from "./genome/sequencer.js";
import { CSSGenerator } from "./css-generator.js";
import { HTMLGenerator } from "./html-generator.js";
import { WebGLGenerator } from "./generators/webgl-generator.js";
import { FXGenerator } from "./generators/fx-generator.js";
import { SVGGenerator } from "./generators/svg-generator.js";
import { EpigeneticParser } from "./genome/epigenetics.js";
import { detectArchetype } from "./genome/archetypes.js";
import { PatternDetector } from "./constraints/pattern-detector.js";
import { ecosystemGenerator } from "./genome/ecosystem.js";
import { CivilizationGenerator } from "./genome/civilization.js";
import { ComplexityAnalyzer } from "./genome/complexity-analyzer.js";
import { generateCivilizationOutput } from "./generators/civilization-generators.js";
import { DesignFileWriter } from "./generators/file-writer.js";
import { formatGenerator } from "./generators/format-generators.js";
import { componentGenerator } from "./generators/component-generator.js";
import { designBriefGenerator } from "./generators/design-brief-generator.js";
import { genomeMutator } from "./genome/mutation.js";
import { urlGenomeExtractor } from "./genome/extractor-url.js";
class DesignGenomeServer {
    server;
    extractor;
    sequencer;
    cssGen;
    htmlGen;
    webglGen;
    fxGen;
    svgGen;
    epigeneticParser;
    patternDetector;
    civilizationGen;
    complexityAnalyzer;
    fileWriter;
    constructor() {
        this.server = new Server({ name: "permutations", version: "0.0.7" }, { capabilities: { tools: {} } });
        this.extractor = new SemanticTraitExtractor();
        this.sequencer = new GenomeSequencer();
        this.cssGen = new CSSGenerator();
        this.htmlGen = new HTMLGenerator();
        this.webglGen = new WebGLGenerator();
        this.fxGen = new FXGenerator();
        this.svgGen = new SVGGenerator();
        this.epigeneticParser = new EpigeneticParser();
        this.patternDetector = new PatternDetector();
        this.civilizationGen = new CivilizationGenerator();
        this.complexityAnalyzer = new ComplexityAnalyzer();
        this.fileWriter = new DesignFileWriter();
        this.setupHandlers();
    }
    setupHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: "generate_design_genome",
                    description: "Calculates the mathematical design DNA constraints from a fuzzy user prompt",
                    inputSchema: {
                        type: "object",
                        properties: {
                            intent: { type: "string", description: "Natural language design intent (e.g., 'Japanese Y2K football site')" },
                            seed: { type: "string", description: "Unique project seed or timestamp to ensure specific DNA generation" },
                            project_context: { type: "string", description: "Overarching narrative or biological metaphor guiding the project" },
                            brand_asset_paths: {
                                type: "array",
                                items: { type: "string" },
                                description: "Absolute paths to any brand guidelines (PDF) or logos (PNG) for Epigenetic modification"
                            },
                            font_provider: {
                                type: "string",
                                enum: ["bunny", "google"],
                                description: "Typography provider (default: bunny)"
                            }
                        },
                        required: ["intent", "seed"]
                    }
                },
                {
                    name: "generate_from_archetype",
                    description: "Generates design DNA from a functional archetype without requiring LLM API calls. Works offline.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            archetype: {
                                type: "string",
                                enum: [
                                    "dashboard", "documentation", "dev-tool",
                                    "portfolio", "agency-portfolio",
                                    "commerce", "luxury-commerce",
                                    "landing", "saas-landing", "fintech-landing", "medical-landing",
                                    "blog", "magazine",
                                    "real-estate", "restaurant", "non-profit"
                                ],
                                description: "Functional archetype defining the content purpose"
                            },
                            seed: { type: "string", description: "Unique project seed for deterministic generation" },
                            intent: { type: "string", description: "Optional: Natural language intent for archetype auto-detection" },
                            font_provider: {
                                type: "string",
                                enum: ["bunny", "google"],
                                description: "Typography provider (default: bunny)"
                            }
                        },
                        required: ["seed"]
                    }
                },
                {
                    name: "list_archetypes",
                    description: "Returns all available functional archetypes with descriptions",
                    inputSchema: {
                        type: "object",
                        properties: {}
                    }
                },
                {
                    name: "validate_design",
                    description: "Validates CSS/HTML against DNA constraints and forbidden slop patterns",
                    inputSchema: {
                        type: "object",
                        properties: {
                            genome: { type: "object", description: "The design genome from generate_design_genome" },
                            css: { type: "string", description: "CSS code to validate" },
                            html: { type: "string", description: "HTML code to validate (optional)" }
                        },
                        required: ["genome", "css"]
                    }
                },
                {
                    name: "generate_ecosystem",
                    description: "Generates a complete ecosystem of design components - microbial (atomic), flora (growing), fauna (complex) - all sharing ONE genome. Returns component specs, relationships, and civilization readiness.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            intent: { type: "string", description: "Natural language design intent" },
                            seed: { type: "string", description: "Unique ecosystem seed" },
                            project_context: { type: "string", description: "Environment context" },
                            options: {
                                type: "object",
                                properties: {
                                    microbialCount: { type: "number", description: "Number of microbial organisms (default: auto-scaled from complexity tier)" },
                                    floraCount: { type: "number", description: "Number of flora organisms (default: auto-scaled from complexity tier)" },
                                    faunaCount: { type: "number", description: "Number of fauna organisms (default: auto-scaled from complexity tier)" }
                                }
                            }
                        },
                        required: ["intent", "seed"]
                    }
                },
                {
                    name: "generate_civilization",
                    description: "Generates architecture layer for a civilization-tier design system. Takes ecosystem organisms as input and adds state management, routing, and advanced patterns. If ecosystem not provided, generates standalone.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            intent: { type: "string", description: "Natural language design intent. Use complex keywords: dashboard, platform, 3D, real-time, collaborative" },
                            seed: { type: "string", description: "Unique project seed" },
                            project_context: { type: "string", description: "Detailed project context (longer = more sophisticated)" },
                            ecosystem: {
                                type: "object",
                                description: "OPTIONAL: Ecosystem from generate_ecosystem. If provided, civilization will use those organisms and add architecture. Recommended for component library → application flow."
                            },
                            min_tier: {
                                type: "string",
                                enum: ["tribal", "city_state", "nation_state", "empire", "network", "singularity"],
                                description: "Minimum civilization tier (optional - forces complexity). tribal=0.81+, city_state=0.87+, nation_state=0.92+, empire=0.95+, network=0.97+, singularity=0.99+"
                            },
                            generate_code: {
                                type: "boolean",
                                description: "Whether to generate actual React/TypeScript code (default: true)",
                                default: true
                            },
                            font_provider: {
                                type: "string",
                                enum: ["bunny", "google"],
                                description: "Typography provider"
                            }
                        },
                        required: ["intent", "seed"]
                    }
                },
                {
                    name: "write_design_files",
                    description: "Writes generated design outputs to disk as organized component files, styles, and configuration. Creates a complete file structure ready for development.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            genome: {
                                type: "object",
                                description: "The design genome from generate_design_genome or generate_civilization"
                            },
                            outputs: {
                                type: "object",
                                description: "Generated outputs to write",
                                properties: {
                                    components: { type: "string" },
                                    animations: { type: "string" },
                                    architecture: { type: "string" },
                                    tokens: { type: "string" },
                                    interactions: { type: "string" },
                                    css: { type: "string" },
                                    html: { type: "string" },
                                    webgl: { type: "string" },
                                    fx: { type: "string" },
                                    svg: { type: "string" }
                                }
                            },
                            output_dir: {
                                type: "string",
                                description: "Directory to write files to (absolute path)"
                            },
                            framework: {
                                type: "string",
                                enum: ["react", "vue", "svelte", "vanilla"],
                                default: "react"
                            },
                            styling: {
                                type: "string",
                                enum: ["css", "tailwind", "css-in-js", "scss"],
                                default: "css"
                            },
                            typescript: {
                                type: "boolean",
                                default: true
                            },
                            include_preview: {
                                type: "boolean",
                                description: "Generate standalone HTML preview file",
                                default: true
                            }
                        },
                        required: ["genome", "output_dir"]
                    }
                },
                {
                    name: "generate_preview",
                    description: "Generates a standalone HTML preview file that can be opened in a browser to visualize the design without implementation.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            genome: { type: "object", description: "Design genome" },
                            css: { type: "string", description: "Generated CSS" },
                            html: { type: "string", description: "Generated HTML" },
                            output_path: { type: "string", description: "Optional: path to write preview HTML" }
                        },
                        required: ["genome", "css", "html"]
                    }
                },
                {
                    name: "update_design_genome",
                    description: "Updates an existing design genome with specific changes. Returns a diff showing what changed and the new genome.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            original_genome: { type: "object", description: "The original design genome to modify" },
                            changes: {
                                type: "object",
                                description: "Specific changes to apply",
                                properties: {
                                    primary_hue: { type: "number", description: "New primary color hue (0-360)" },
                                    motion_physics: { type: "string", enum: ["none", "spring", "step", "glitch"] },
                                    edge_radius: { type: "number" },
                                    hero_type: { type: "string" },
                                    sector: { type: "string" },
                                    new_seed: { type: "string", description: "Generate completely new DNA with this seed" }
                                }
                            },
                            preserve_traits: {
                                type: "boolean",
                                description: "Keep original trait analysis (default: true)",
                                default: true
                            }
                        },
                        required: ["original_genome", "changes"]
                    }
                },
                {
                    name: "generate_formats",
                    description: "Generates design outputs in alternative formats: Vue, Svelte, Figma Tokens, Style Dictionary, styled-components, or Emotion.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            genome: { type: "object", description: "Design genome from generate_design_genome" },
                            tier: { type: "object", description: "Optional: Civilization tier for component generation" },
                            formats: {
                                type: "array",
                                items: {
                                    type: "string",
                                    enum: ["figma-tokens", "style-dictionary", "styled-components", "emotion", "vue", "svelte", "all"]
                                },
                                description: "Formats to generate"
                            }
                        },
                        required: ["genome", "formats"]
                    }
                },
                {
                    name: "generate_component",
                    description: "Generates ANY UI component dynamically from description + genome. No hardcoded templates - structure is inferred from purpose and elements. Uses ch27_motion_choreography and ch26_color_system.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            genome: {
                                type: "object",
                                description: "The design genome from generate_design_genome or generate_civilization"
                            },
                            purpose: {
                                type: "string",
                                description: "Component purpose (e.g., 'pricing', 'navigation', 'content_display', 'testimonial', 'stats')"
                            },
                            elements: {
                                type: "array",
                                items: { type: "string" },
                                description: "Elements to include (e.g., ['title', 'price', 'cta', 'feature_list'])"
                            },
                            layout: {
                                type: "string",
                                enum: ["horizontal", "vertical", "grid", "layered"],
                                description: "Layout direction (default: vertical)"
                            },
                            complexity: {
                                type: "string",
                                enum: ["atomic", "molecular", "organism"],
                                description: "Component complexity (default: molecular)"
                            }
                        },
                        required: ["genome", "purpose", "elements"]
                    }
                },
                {
                    name: "generate_design_brief",
                    description: "Generates a human-readable design brief from a genome. This is what a designer hands to a developer or a client approves before implementation. Includes visual direction, strategic decisions, and copy intelligence.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            genome: {
                                type: "object",
                                description: "The design genome from generate_design_genome or generate_civilization"
                            },
                            format: {
                                type: "string",
                                enum: ["prose", "json", "markdown"],
                                description: "Output format (default: prose)",
                                default: "prose"
                            }
                        },
                        required: ["genome"]
                    }
                },
                {
                    name: "mutate_genome",
                    description: "Generates variant genomes by mutating specific chromosomes while preserving others. The 'breeding' part of the biological metaphor. Keep what you love, explore variations.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            genome: {
                                type: "object",
                                description: "The parent genome to mutate"
                            },
                            target_chromosomes: {
                                type: "array",
                                items: { type: "string" },
                                description: "Chromosomes to mutate (default: all except preserved)"
                            },
                            preserve: {
                                type: "array",
                                items: { type: "string" },
                                description: "Chromosomes to preserve exactly (e.g., ['ch3_type_display', 'ch9_grid'])"
                            },
                            mutation_rate: {
                                type: "number",
                                minimum: 0,
                                maximum: 1,
                                description: "Mutation intensity 0.0-1.0 (0.1=subtle, 0.5=dramatic)",
                                default: 0.3
                            },
                            count: {
                                type: "number",
                                description: "Number of variants to generate",
                                default: 3
                            }
                        },
                        required: ["genome"]
                    }
                },
                {
                    name: "extract_genome_from_url",
                    description: "Reverse-engineers an approximate genome from any website URL using browser automation (Playwright). Scrapes CSS, extracts colors/fonts/spacing from computed styles, and builds a genome approximation. Use for 'I love this site, make something similar' workflows. No manual CSS required.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            url: {
                                type: "string",
                                description: "Website URL to analyze (e.g., https://stripe.com)"
                            }
                        },
                        required: ["url"]
                    }
                }
            ]
        }));
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const args = request.params.arguments;
            // === Input Validation Helpers ===
            const validateArgs = (fields) => {
                for (const field of fields) {
                    const val = args[field.name];
                    if (field.required && (val === undefined || val === null || val === "")) {
                        throw new McpError(ErrorCode.InvalidParams, `Missing required parameter: '${field.name}'`);
                    }
                    if (val !== undefined && typeof val === "string" && field.maxLength && val.length > field.maxLength) {
                        throw new McpError(ErrorCode.InvalidParams, `Parameter '${field.name}' exceeds maximum length of ${field.maxLength} characters`);
                    }
                }
            };
            const sanitize = (s) => s.trim().replace(/\0/g, "");
            try {
                switch (request.params.name) {
                    case "generate_design_genome": {
                        validateArgs([
                            { name: "intent", required: true, maxLength: 32_768 },
                            { name: "seed", required: true, maxLength: 256 },
                            { name: "project_context", required: false, maxLength: 16_384 },
                        ]);
                        const intent = sanitize(args.intent);
                        const seed = sanitize(args.seed);
                        const context = args.project_context ? sanitize(args.project_context) : undefined;
                        // 1. Epigenetic Parsing (if assets provided)
                        let epigeneticData = undefined;
                        if (args.brand_asset_paths && Array.isArray(args.brand_asset_paths) && args.brand_asset_paths.length > 0) {
                            epigeneticData = await this.epigeneticParser.parseAssets(args.brand_asset_paths.slice(0, 10) // cap at 10 files
                            );
                        }
                        // 2. Semantic Extraction (single LLM call: traits + sector + archetype + copy intelligence)
                        const finalContext = epigeneticData?.brandContext || context;
                        const analysis = await this.extractor.analyze(intent, finalContext);
                        const { traits, sector, copyIntelligence, copy } = analysis;
                        const detectedSector = sector.primary;
                        // 4. DNA Sequencing (pass copy intelligence + LLM copy to sequencer)
                        const genome = this.sequencer.generate(seed, traits, {
                            primarySector: detectedSector,
                            options: {
                                fontProvider: args.font_provider,
                                copyIntelligence,
                                copy
                            }
                        }, epigeneticData);
                        // 5. Complexity Analysis — determines output tier
                        const complexityResult = this.complexityAnalyzer.analyze(intent, finalContext ?? "", traits);
                        const { finalComplexity, tier } = complexityResult;
                        // 6. CSS (always generated)
                        const css = this.cssGen.generate(genome, { format: "expanded" });
                        const topology = this.htmlGen.generateTopology(genome);
                        const webglComponents = this.webglGen.generateR3F(genome);
                        const fxAtmosphere = this.fxGen.generateCSSClass(genome);
                        const svgBiomarker = this.svgGen.generateBiomarker(genome);
                        // 7. Ecosystem-first civilization pipeline
                        //
                        // Biology rule: civilization cannot precede ecosystem.
                        // Ecosystem (organisms + relationships) must exist before civilization
                        // (architecture) can emerge from it.
                        //
                        // Thresholds:
                        //   < 0.11  abiotic           — HTML/CSS only, organism counts are zero
                        //   0.11–0.80 ecosystem tiers — organisms scale from prokaryotic to endotherm_fauna
                        //   0.81+  civilization tiers — emerges FROM ecosystem (tribal → singularity)
                        //
                        // When below civilization threshold: ecosystemOutput is populated,
                        // civilizationOutput is null, and civilizationGap tells the caller
                        // how far complexity needs to increase to cross the tribal (0.81) threshold.
                        // HTML always generated for every tier
                        const html = this.htmlGen.generate(genome, {
                            includeHeader: true,
                            includeFooter: true,
                            includeSections: true
                        });
                        let ecosystemOutput;
                        let civilizationOutput;
                        // Ecosystem always runs — organism counts scale from 0 (abiotic) to max (endotherm_fauna)
                        {
                            const eco = ecosystemGenerator.generate(seed, traits, {
                                primarySector: detectedSector
                            });
                            const allOrganisms = [
                                ...eco.organisms.microbial,
                                ...eco.organisms.flora,
                                ...eco.organisms.fauna
                            ];
                            ecosystemOutput = {
                                organisms: {
                                    counts: {
                                        microbial: eco.organisms.microbial.length,
                                        flora: eco.organisms.flora.length,
                                        fauna: eco.organisms.fauna.length,
                                        total: eco.organisms.total
                                    },
                                    microbial: eco.organisms.microbial.map(o => ({
                                        id: o.id, name: o.name, category: o.category,
                                        colorTreatment: o.characteristics.colorTreatment
                                    })),
                                    flora: eco.organisms.flora.map(o => ({
                                        id: o.id, name: o.name, category: o.category,
                                        motionStyle: o.characteristics.motionStyle
                                    })),
                                    fauna: eco.organisms.fauna.map(o => ({
                                        id: o.id, name: o.name, category: o.category,
                                        complexity: o.adaptation.entropy
                                    }))
                                },
                                relationships: eco.relationships
                                    .filter(r => r.type === "containment")
                                    .slice(0, 10)
                                    .map(r => ({
                                    container: r.organisms[0],
                                    contained: r.organisms[1],
                                    pattern: r.pattern
                                })),
                                evolution: eco.evolution,
                                civilizationReady: eco.civilizationReady,
                                // How far complexity needs to grow to reach tribal (0.81) threshold
                                civilizationGap: parseFloat(Math.max(0, 0.81 - eco.evolution.complexity).toFixed(3))
                            };
                            // Civilization emerges from ecosystem when complexity crosses tribal (0.81)
                            if (finalComplexity >= 0.81) {
                                try {
                                    const civTier = this.civilizationGen.generate(intent, finalContext ?? "", traits, genome);
                                    // Pass ecosystem organisms — civilization uses topology-derived
                                    // organism specs, not the generic tier component list
                                    civilizationOutput = generateCivilizationOutput(civTier, genome, css, undefined, allOrganisms);
                                }
                                catch { /* ecosystem output still valid without civilization */ }
                            }
                        }
                        // 8. Auto pattern detection on generated output
                        const patternViolations = this.patternDetector.detectInGenome(genome, css, html ?? "");
                        const patternReport = this.patternDetector.generateReport(patternViolations);
                        return {
                            content: [{
                                    type: "text",
                                    text: JSON.stringify({
                                        genome,
                                        tier,
                                        finalComplexity,
                                        topology,
                                        css,
                                        html,
                                        // ecosystem: always present — organism counts scale with complexity tier
                                        // abiotic returns empty organism arrays, not null
                                        ecosystemOutput: ecosystemOutput ?? null,
                                        // civilization: present when complexity >= 0.81 (tribal+)
                                        // emerges FROM ecosystem, never standalone
                                        // null when complexity < 0.81 — use ecosystemOutput.civilizationGap
                                        civilizationOutput: civilizationOutput ?? null,
                                        webglComponents,
                                        fxAtmosphere,
                                        svgBiomarker,
                                        patternReport,
                                        patternViolations: patternViolations.filter(v => v.severity === "error")
                                    }, null, 2)
                                }]
                        };
                    }
                    case "generate_from_archetype": {
                        if (!args.seed) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing seed");
                        }
                        if (!args.archetype && !args.intent) {
                            throw new McpError(ErrorCode.InvalidParams, "Provide either archetype or intent for auto-detection");
                        }
                        // Auto-detect archetype from intent if provided
                        let archetype = args.archetype;
                        if (args.intent && !args.archetype) {
                            const detected = detectArchetype(args.intent);
                            if (detected)
                                archetype = detected;
                        }
                        // Generate from archetype (no API calls needed)
                        const genome = this.sequencer.generateFromArchetype(archetype, args.seed);
                        // Component Generation
                        const tailwindConfig = this.cssGen.generate(genome, { format: "compressed" });
                        const topology = this.htmlGen.generateTopology(genome);
                        const webglComponents = this.webglGen.generateR3F(genome);
                        const fxAtmosphere = this.fxGen.generateCSSClass(genome);
                        const svgBiomarker = this.svgGen.generateBiomarker(genome);
                        return {
                            content: [{
                                    type: "text",
                                    text: JSON.stringify({
                                        genome,
                                        topology,
                                        tailwindConfig,
                                        webglComponents,
                                        fxAtmosphere,
                                        svgBiomarker,
                                        mode: "archetype",
                                        archetype
                                    }, null, 2)
                                }]
                        };
                    }
                    case "list_archetypes": {
                        const { ARCHETYPES } = await import("./genome/archetypes.js");
                        const list = Object.entries(ARCHETYPES).map(([key, value]) => ({
                            id: key,
                            name: value.name,
                            description: value.description
                        }));
                        return {
                            content: [{
                                    type: "text",
                                    text: JSON.stringify({ archetypes: list }, null, 2)
                                }]
                        };
                    }
                    case "validate_design": {
                        if (!args.genome || !args.css) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing genome or css");
                        }
                        const violations = this.patternDetector.detectInGenome(args.genome, args.css, args.html);
                        const report = this.patternDetector.generateReport(violations);
                        const valid = violations.filter(v => v.severity === "error").length === 0;
                        return {
                            content: [{
                                    type: "text",
                                    text: JSON.stringify({
                                        valid,
                                        violations,
                                        report,
                                        slop_score: violations.length
                                    }, null, 2)
                                }]
                        };
                    }
                    case "generate_ecosystem": {
                        if (!args.intent || !args.seed) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing intent or seed");
                        }
                        // M-13: Use analyze() to extract traits AND sector together
                        // Previously used extractTraits() which discarded sector info,
                        // then passed args.options (user-supplied) which loses the inferred sector
                        const context = args.project_context || "";
                        let ecoTraits;
                        let ecoSector = "technology";
                        try {
                            const ecoAnalysis = await this.extractor.analyze(args.intent, context);
                            ecoTraits = ecoAnalysis.traits;
                            ecoSector = ecoAnalysis.sector?.primary || "technology";
                        }
                        catch {
                            // Offline fallback
                            ecoTraits = await this.extractor.extractTraits(args.intent, context);
                        }
                        // Generate ecosystem - pass inferred sector so organisms reflect correct domain
                        const ecosystem = ecosystemGenerator.generate(args.seed, ecoTraits, {
                            ...(args.options || {}),
                            primarySector: ecoSector
                        });
                        // Generate CSS from the shared genome
                        const css = this.cssGen.generate(ecosystem.environment.genome, { format: "compressed" });
                        const topology = this.htmlGen.generateTopology(ecosystem.environment.genome);
                        // Organize organisms by category
                        const organisms = {
                            microbial: ecosystem.organisms.microbial.map(o => ({
                                id: o.id,
                                name: o.name,
                                variants: o.spec.variants,
                                props: o.spec.props.map(p => p.name),
                                containedBy: o.relationships.predator,
                                colorTreatment: o.characteristics.colorTreatment
                            })),
                            flora: ecosystem.organisms.flora.map(o => ({
                                id: o.id,
                                name: o.name,
                                variants: o.spec.variants,
                                props: o.spec.props.map(p => p.name),
                                contains: o.relationships.prey,
                                containedBy: o.relationships.predator,
                                motionStyle: o.characteristics.motionStyle
                            })),
                            fauna: ecosystem.organisms.fauna.map(o => ({
                                id: o.id,
                                name: o.name,
                                variants: o.spec.variants,
                                props: o.spec.props.map(p => p.name),
                                contains: o.relationships.prey,
                                complexity: o.adaptation.entropy
                            }))
                        };
                        // Key relationships for composition patterns
                        const keyRelationships = ecosystem.relationships
                            .filter(r => r.type === 'containment')
                            .slice(0, 10)
                            .map(r => ({
                            container: r.organisms[0],
                            contained: r.organisms[1],
                            pattern: r.pattern
                        }));
                        return {
                            content: [{
                                    type: "text",
                                    text: JSON.stringify({
                                        ecosystem: {
                                            environment: {
                                                dnaHash: ecosystem.environment.genome.dnaHash,
                                                habitabilityScore: ecosystem.environment.habitabilityScore,
                                                carryingCapacity: ecosystem.environment.carryingCapacity
                                            },
                                            organisms: {
                                                counts: {
                                                    microbial: ecosystem.organisms.microbial.length,
                                                    flora: ecosystem.organisms.flora.length,
                                                    fauna: ecosystem.organisms.fauna.length,
                                                    total: ecosystem.organisms.total
                                                },
                                                ...organisms
                                            },
                                            evolution: ecosystem.evolution,
                                            relationships: {
                                                total: ecosystem.relationships.length,
                                                containment: keyRelationships,
                                                symbiosis: ecosystem.relationships
                                                    .filter(r => r.type === 'symbiosis')
                                                    .slice(0, 5)
                                                    .map(r => ({ organisms: r.organisms, pattern: r.pattern }))
                                            },
                                            civilization: {
                                                ready: ecosystem.civilizationReady,
                                                threshold: ecosystem.civilizationThreshold,
                                                currentComplexity: ecosystem.evolution.complexity,
                                                gap: Math.max(0, ecosystem.civilizationThreshold - ecosystem.evolution.complexity)
                                            }
                                        },
                                        sharedGenome: ecosystem.environment.genome,
                                        css,
                                        topology,
                                        usage: {
                                            whenCivilizationReady: ecosystem.civilizationReady
                                                ? "Call generate_civilization with the same seed to get architecture, state management, and advanced patterns"
                                                : `Add complexity (dashboard, 3D, real-time keywords) or increase counts to reach threshold ${ecosystem.civilizationThreshold}`,
                                            componentHierarchy: "Fauna contain Flora contain Microbial - use relationships.containment for composition",
                                            fileStructure: "Each organism maps to a component file - use write_design_files to output"
                                        }
                                    }, null, 2)
                                }]
                        };
                    }
                    case "generate_civilization": {
                        if (!args.intent || !args.seed) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing intent or seed");
                        }
                        // M-12: Single LLM call — use analyze() to get both traits AND sector at once
                        const context = args.project_context || "";
                        let civTraits;
                        let civSector = "technology";
                        try {
                            const civAnalysis = await this.extractor.analyze(args.intent, context);
                            civTraits = civAnalysis.traits;
                            civSector = civAnalysis.sector?.primary || "technology";
                        }
                        catch {
                            // Fallback: extractTraits with default sector
                            civTraits = await this.extractor.extractTraits(args.intent, context);
                        }
                        // ECOSYSTEM INTEGRATION: Use provided ecosystem or generate standalone
                        let ecosystem = args.ecosystem;
                        let baseGenome = null;
                        let organisms = null;
                        if (ecosystem) {
                            // Use ecosystem's organisms and genome
                            baseGenome = ecosystem.environment?.genome;
                            organisms = ecosystem.organisms;
                        }
                        // If no ecosystem or genome, generate using already-derived sector (no second LLM call)
                        if (!baseGenome) {
                            baseGenome = this.sequencer.generate(args.seed, civTraits, { primarySector: civSector });
                        }
                        const traits = civTraits;
                        // Generate civilization tier
                        const tier = this.civilizationGen.generate(args.intent, context, traits, baseGenome, args.min_tier);
                        // Generate code and structured file outputs
                        let codeOutputs = null;
                        let fileStructure = null;
                        if (args.generate_code !== false) {
                            // UNIFIED CSS: Use CSSGenerator like other tools
                            const css = this.cssGen.generate(baseGenome, { format: "compressed" });
                            const topology = this.htmlGen.generateTopology(baseGenome);
                            // Generate code using genome with unified CSS/topology
                            codeOutputs = generateCivilizationOutput(tier, baseGenome, css, topology);
                            // Use ecosystem organisms if available, otherwise use tier components
                            const componentList = organisms
                                ? [...organisms.microbial, ...organisms.flora, ...organisms.fauna]
                                : tier.components.list;
                            // Generate file structure for easy consumption
                            fileStructure = {
                                components: componentList.map((c) => ({
                                    name: c.name,
                                    file: `components/${c.name}.tsx`,
                                    category: c.category,
                                    variants: c.spec?.variants || c.variants
                                })),
                                styles: ["styles/tokens.css", "styles/genome.css"],
                                lib: ["lib/animations.ts", "lib/interactions.ts"],
                                config: ["tailwind.config.js"]
                            };
                        }
                        return {
                            content: [{
                                    type: "text",
                                    text: JSON.stringify({
                                        tier: tier.tier,
                                        complexity: tier.complexity,
                                        architecture: tier.architecture,
                                        source: ecosystem ? "ecosystem" : "standalone",
                                        components: {
                                            count: organisms
                                                ? organisms.microbial.length + organisms.flora.length + organisms.fauna.length
                                                : tier.components.count,
                                            list: organisms
                                                ? [...organisms.microbial, ...organisms.flora, ...organisms.fauna].map(o => ({
                                                    name: o.name,
                                                    category: o.category,
                                                    variants: o.spec?.variants
                                                }))
                                                : tier.components.list,
                                            categories: organisms
                                                ? [...new Set([...organisms.microbial, ...organisms.flora, ...organisms.fauna].map(o => o.category))]
                                                : [...new Set(tier.components.list.map(c => c.category))]
                                        },
                                        animations: tier.animations,
                                        designSystem: tier.designSystem,
                                        interactions: tier.interactions,
                                        ai: tier.ai,
                                        files: fileStructure,
                                        code: codeOutputs,
                                        genome: baseGenome,
                                        organisms: organisms ? {
                                            microbial: organisms.microbial.length,
                                            flora: organisms.flora.length,
                                            fauna: organisms.fauna.length
                                        } : null
                                    }, null, 2)
                                }]
                        };
                    }
                    case "write_design_files": {
                        if (!args.genome || !args.output_dir) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing genome or output_dir");
                        }
                        const outputs = args.outputs || {};
                        const options = {
                            baseDir: args.output_dir,
                            framework: args.framework || "react",
                            styling: args.styling || "css",
                            typescript: args.typescript !== false,
                            includePreview: args.include_preview !== false
                        };
                        // Generate preview if requested and HTML/CSS provided
                        if (options.includePreview && outputs.css && outputs.html) {
                            outputs.html = this.fileWriter.generatePreviewHTML(args.genome, outputs.css, outputs.html);
                        }
                        const result = await this.fileWriter.writeDesignSystem(args.genome, outputs, options);
                        const fileStructure = this.fileWriter.generateFileStructure(result.files, options.baseDir);
                        return {
                            content: [{
                                    type: "text",
                                    text: JSON.stringify({
                                        success: result.success,
                                        filesWritten: result.files.length,
                                        fileList: result.files.map(f => path.relative(options.baseDir, f)),
                                        structure: fileStructure,
                                        errors: result.errors,
                                        baseDir: result.baseDir
                                    }, null, 2)
                                }]
                        };
                    }
                    case "generate_preview": {
                        if (!args.genome || !args.css || !args.html) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing genome, css, or html");
                        }
                        const previewHTML = this.fileWriter.generatePreviewHTML(args.genome, args.css, args.html);
                        // Optionally write to disk
                        if (args.output_path) {
                            await fs.mkdir(path.dirname(args.output_path), { recursive: true });
                            await fs.writeFile(args.output_path, previewHTML, "utf-8");
                        }
                        return {
                            content: [{
                                    type: "text",
                                    text: JSON.stringify({
                                        previewHTML: previewHTML.slice(0, 2000) + (previewHTML.length > 2000 ? "..." : ""),
                                        fullLength: previewHTML.length,
                                        writtenTo: args.output_path || null,
                                        instructions: args.output_path
                                            ? `Preview written to ${args.output_path}. Open in browser to visualize.`
                                            : "Use output_path parameter to write to disk, or embed previewHTML in an iframe."
                                    }, null, 2)
                                }]
                        };
                    }
                    case "update_design_genome": {
                        if (!args.original_genome || !args.changes) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing original_genome or changes");
                        }
                        const original = args.original_genome;
                        const changes = args.changes;
                        const preserveTraits = args.preserve_traits !== false;
                        // Track what changed
                        const diff = {};
                        const newGenome = JSON.parse(JSON.stringify(original)); // Deep clone
                        // Apply changes
                        if (changes.new_seed) {
                            // Generate completely new genome
                            const traits = preserveTraits ? original.traits : await this.extractor.extractTraits("updated", "");
                            const config = { primarySector: changes.sector || original.sectorContext.primary };
                            const regenerated = this.sequencer.generate(changes.new_seed, traits, config);
                            diff["dnaHash"] = { old: original.dnaHash, new: regenerated.dnaHash };
                            diff["full_regeneration"] = { old: false, new: true };
                            return {
                                content: [{
                                        type: "text",
                                        text: JSON.stringify({
                                            type: "full_regeneration",
                                            seed: changes.new_seed,
                                            diff,
                                            genome: regenerated,
                                            previousHash: original.dnaHash
                                        }, null, 2)
                                    }]
                            };
                        }
                        // Apply specific chromosome changes
                        if (changes.primary_hue !== undefined) {
                            const oldHue = original.chromosomes?.ch5_color_primary?.hue;
                            newGenome.chromosomes.ch5_color_primary.hue = changes.primary_hue;
                            newGenome.chromosomes.ch5_color_primary.hex = this.hslToHex(changes.primary_hue, newGenome.chromosomes.ch5_color_primary.saturation, newGenome.chromosomes.ch5_color_primary.lightness);
                            diff["ch5_color_primary.hue"] = { old: oldHue, new: changes.primary_hue };
                        }
                        if (changes.motion_physics) {
                            const oldMotion = original.chromosomes?.ch8_motion?.physics;
                            newGenome.chromosomes.ch8_motion.physics = changes.motion_physics;
                            diff["ch8_motion.physics"] = { old: oldMotion, new: changes.motion_physics };
                        }
                        if (changes.edge_radius !== undefined) {
                            const oldRadius = original.chromosomes?.ch7_edge?.radius;
                            newGenome.chromosomes.ch7_edge.radius = changes.edge_radius;
                            diff["ch7_edge.radius"] = { old: oldRadius, new: changes.edge_radius };
                        }
                        if (changes.hero_type) {
                            const oldHero = original.chromosomes?.ch19_hero_type?.type;
                            newGenome.chromosomes.ch19_hero_type.type = changes.hero_type;
                            diff["ch19_hero_type.type"] = { old: oldHero, new: changes.hero_type };
                        }
                        if (changes.sector) {
                            const oldSector = original.sectorContext?.primary;
                            newGenome.sectorContext.primary = changes.sector;
                            diff["sectorContext.primary"] = { old: oldSector, new: changes.sector };
                        }
                        // Recalculate hash if anything changed
                        if (Object.keys(diff).length > 0) {
                            const crypto = await import("crypto");
                            newGenome.dnaHash = crypto.createHash("sha256")
                                .update(JSON.stringify(newGenome.chromosomes))
                                .digest("hex");
                            diff["dnaHash"] = {
                                old: original.dnaHash,
                                new: newGenome.dnaHash
                            };
                        }
                        return {
                            content: [{
                                    type: "text",
                                    text: JSON.stringify({
                                        type: "partial_update",
                                        changesApplied: Object.keys(diff).length,
                                        diff,
                                        genome: newGenome,
                                        canRevert: true
                                    }, null, 2)
                                }]
                        };
                    }
                    case "generate_formats": {
                        if (!args.genome || !args.formats) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing genome or formats");
                        }
                        const genome = args.genome;
                        const tier = args.tier;
                        const requestedFormats = args.formats;
                        const generateAll = requestedFormats.includes("all");
                        const outputs = {};
                        if (generateAll || requestedFormats.includes("figma-tokens")) {
                            outputs.figmaTokens = formatGenerator.generateFigmaTokens(genome);
                        }
                        if (generateAll || requestedFormats.includes("style-dictionary")) {
                            outputs.styleDictionary = formatGenerator.generateStyleDictionary(genome);
                        }
                        if (generateAll || requestedFormats.includes("styled-components")) {
                            outputs.styledComponents = formatGenerator.generateStyledComponents(genome);
                        }
                        if (generateAll || requestedFormats.includes("emotion")) {
                            outputs.emotion = formatGenerator.generateEmotion(genome);
                        }
                        if (generateAll || requestedFormats.includes("vue")) {
                            outputs.vue = formatGenerator.generateVueLibrary(genome, tier);
                        }
                        if (generateAll || requestedFormats.includes("svelte")) {
                            outputs.svelte = formatGenerator.generateSvelteLibrary(genome, tier);
                        }
                        return {
                            content: [{
                                    type: "text",
                                    text: JSON.stringify({
                                        formatsGenerated: Object.keys(outputs).length,
                                        outputs,
                                        usage: {
                                            figmaTokens: "Import into Figma Tokens Studio plugin",
                                            styleDictionary: "Use with Amazon Style Dictionary to generate CSS/SCSS/iOS/Android",
                                            styledComponents: "Import theme into styled-components ThemeProvider",
                                            emotion: "Use with @emotion/react ThemeProvider",
                                            vue: "Single File Components for Vue 3",
                                            svelte: "Svelte components with scoped styles"
                                        }
                                    }, null, 2)
                                }]
                        };
                    }
                    case "generate_component": {
                        if (!args.genome || !args.purpose || !args.elements) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing required parameters: genome, purpose, elements");
                        }
                        const component = componentGenerator.generate({
                            purpose: args.purpose,
                            elements: args.elements,
                            layout: args.layout || "vertical",
                            complexity: args.complexity || "molecular"
                        }, args.genome);
                        return {
                            content: [{
                                    type: "text",
                                    text: JSON.stringify(component, null, 2)
                                }]
                        };
                    }
                    case "generate_design_brief": {
                        if (!args.genome) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing genome");
                        }
                        const brief = designBriefGenerator.generate(args.genome);
                        const format = args.format || "prose";
                        let output;
                        if (format === "prose" || format === "markdown") {
                            output = brief.prose;
                        }
                        else {
                            output = JSON.stringify(brief, null, 2);
                        }
                        return {
                            content: [{
                                    type: "text",
                                    text: output
                                }]
                        };
                    }
                    case "mutate_genome": {
                        if (!args.genome) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing genome");
                        }
                        const variants = genomeMutator.mutate(args.genome, {
                            targetChromosomes: args.target_chromosomes || [],
                            preserve: args.preserve || [],
                            rate: args.mutation_rate || 0.3,
                            count: args.count || 3
                        });
                        return {
                            content: [{
                                    type: "text",
                                    text: JSON.stringify({
                                        parent: { dnaHash: args.genome.dnaHash, seed: args.genome.seed },
                                        variants: variants.map((v, i) => ({
                                            index: i + 1,
                                            id: v.id,
                                            similarityScore: v.similarityScore,
                                            mutations: v.mutations.map(m => ({
                                                chromosome: m.chromosome,
                                                changeType: m.changeType
                                            }))
                                        }))
                                    }, null, 2)
                                }]
                        };
                    }
                    case "extract_genome_from_url": {
                        if (!args.url) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing URL");
                        }
                        // Use Playwright to scrape the URL and extract CSS/design tokens
                        const extracted = await urlGenomeExtractor.extract(args.url);
                        // Clean up browser after extraction
                        await urlGenomeExtractor.closeBrowser();
                        return {
                            content: [{
                                    type: "text",
                                    text: JSON.stringify({
                                        url: args.url,
                                        sector: extracted.sector,
                                        confidence: extracted.confidence,
                                        colors: extracted.colors,
                                        typography: extracted.typography,
                                        layout: extracted.layout,
                                        animation: extracted.animation,
                                        extractedAt: extracted.extractedAt,
                                        note: "This is an approximation based on computed styles. For better results, use generate_design_genome() to create a purpose-built genome."
                                    }, null, 2)
                                }]
                        };
                    }
                    default:
                        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
                }
            }
            catch (error) {
                return {
                    content: [{ type: "text", text: `Error: ${error.message}` }],
                    isError: true
                };
            }
        });
    }
    hslToHex(h, s, l) {
        const saturation = s;
        const lightness = l;
        const k = (n) => (n + h / 30) % 12;
        const a = saturation * Math.min(lightness, 1 - lightness);
        const f = (n) => {
            const color = lightness - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
            return Math.round(255 * color).toString(16).padStart(2, "0");
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("Permutations MCP server running on stdio");
    }
}
const server = new DesignGenomeServer();
server.run().catch(console.error);
// === Startup environment check ===
if (!SemanticTraitExtractor.isAvailable()) {
    console.error("[ERROR] No LLM API key found in environment. " +
        "Set one of: GROQ_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY, OPENROUTER_API_KEY, or HUGGINGFACE_API_KEY.");
    process.exit(1);
}
