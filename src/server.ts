import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ErrorCode,
    McpError
} from "@modelcontextprotocol/sdk/types.js";
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
import { EcosystemGenerator } from "./genome/ecosystem.js";
import { CivilizationGenerator } from "./genome/civilization.js";
import { generateCivilizationOutput } from "./generators/civilization-generators.js";

class DesignGenomeServer {
    private server: Server;
    private extractor: SemanticTraitExtractor;
    private sequencer: GenomeSequencer;
    private cssGen: CSSGenerator;
    private htmlGen: HTMLGenerator;
    private webglGen: WebGLGenerator;
    private fxGen: FXGenerator;
    private svgGen: SVGGenerator;
    private epigeneticParser: EpigeneticParser;
    private patternDetector: PatternDetector;
    private ecosystemGen: EcosystemGenerator;
    private civilizationGen: CivilizationGenerator;

    constructor() {
        this.server = new Server(
            { name: "permutations", version: "1.0.0" },
            { capabilities: { tools: {} } }
        );

        this.extractor = new SemanticTraitExtractor();
        this.sequencer = new GenomeSequencer();
        this.cssGen = new CSSGenerator();
        this.htmlGen = new HTMLGenerator();
        this.webglGen = new WebGLGenerator();
        this.fxGen = new FXGenerator();
        this.svgGen = new SVGGenerator();
        this.epigeneticParser = new EpigeneticParser();
        this.patternDetector = new PatternDetector();
        this.ecosystemGen = new EcosystemGenerator();
        this.civilizationGen = new CivilizationGenerator();

        this.setupHandlers();
    }

    private setupHandlers() {
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
                                enum: ["dashboard", "portfolio", "documentation", "commerce", "landing", "blog"],
                                description: "Functional archetype defining the content purpose"
                            },
                            seed: { type: "string", description: "Unique project seed for deterministic generation" },
                            intent: { type: "string", description: "Optional: Natural language intent for archetype auto-detection" }
                        },
                        required: ["archetype", "seed"]
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
                    description: "Generates a complete planetary ecosystem with divergent evolution - microbes, flora, fauna, and civilization detection",
                    inputSchema: {
                        type: "object",
                        properties: {
                            intent: { type: "string", description: "Natural language design intent" },
                            seed: { type: "string", description: "Unique planet seed" },
                            project_context: { type: "string", description: "Planetary environment context" },
                            options: {
                                type: "object",
                                properties: {
                                    microbialCount: { type: "number", description: "Number of microbial variants (default: 8)" },
                                    floraCount: { type: "number", description: "Number of flora variants (default: 4)" },
                                    faunaCount: { type: "number", description: "Number of fauna variants (default: 2)" }
                                }
                            }
                        },
                        required: ["intent", "seed"]
                    }
                },
                {
                    name: "generate_civilization",
                    description: "Generates a civilization-tier sophisticated design system with component libraries, animation systems, and architectural patterns. Requires intent with complexity keywords (e.g., 'dashboard', '3D', 'real-time') or explicit minTier.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            intent: { type: "string", description: "Natural language design intent. Use complex keywords: dashboard, platform, 3D, real-time, collaborative" },
                            seed: { type: "string", description: "Unique project seed" },
                            project_context: { type: "string", description: "Detailed project context (longer = more sophisticated)" },
                            min_tier: { 
                                type: "string", 
                                enum: ["sentient", "civilized", "advanced"],
                                description: "Minimum civilization tier to generate (optional - forces complexity)"
                            },
                            generate_code: {
                                type: "boolean",
                                description: "Whether to generate actual React/TypeScript code (default: true)",
                                default: true
                            }
                        },
                        required: ["intent", "seed"]
                    }
                }
            ]
        }));

        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const args = request.params.arguments as any;

            try {
                switch (request.params.name) {
                    case "generate_design_genome": {
                        if (!args.intent || !args.seed) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing intent or seed");
                        }

                        // 1. Epigenetic Parsing (if assets provided)
                        let epigeneticData = undefined;
                        if (args.brand_asset_paths && args.brand_asset_paths.length > 0) {
                            epigeneticData = await this.epigeneticParser.parseAssets(args.brand_asset_paths);
                        }

                        // 2. Semantic Extraction (Context overrides)
                        const finalContext = epigeneticData?.brandContext || args.project_context;
                        const traits = await this.extractor.extractTraits(args.intent, finalContext);

                        // 3. DNA Sequencing (Hash + Traits + Config + Epigenetics)
                        const genome = this.sequencer.generate(args.seed, traits, { primarySector: "technology" }, epigeneticData);

                        // 4. Component Generation
                        const tailwindConfig = this.cssGen.generate(genome, { format: "compressed" });
                        const topology = this.htmlGen.generateTopology(genome);
                        const webglComponents = this.webglGen.generateR3F(genome);
                        const fxAtmosphere = this.fxGen.generateCSSClass(genome);
                        const svgBiomarker = this.svgGen.generateBiomarker(genome);

                        return {
                            content: [{
                                type: "text",
                                text: JSON.stringify({ genome, topology, tailwindConfig, webglComponents, fxAtmosphere, svgBiomarker }, null, 2)
                            }]
                        };
                    }

                    case "generate_from_archetype": {
                        if (!args.archetype || !args.seed) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing archetype or seed");
                        }

                        // Auto-detect archetype from intent if provided
                        let archetype = args.archetype;
                        if (args.intent && !args.archetype) {
                            const detected = detectArchetype(args.intent);
                            if (detected) archetype = detected;
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

                        const violations = this.patternDetector.detectInGenome(
                            args.genome,
                            args.css,
                            args.html
                        );

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

                        // Extract traits from intent
                        const context = args.project_context || "";
                        const traits = await this.extractor.extractTraits(args.intent, context);

                        // Generate full ecosystem with divergent evolution
                        const ecosystem = this.ecosystemGen.generate(args.seed, traits, args.options);

                        // Generate component outputs for each life form
                        const outputs = {
                            planet: {
                                tailwind: this.cssGen.generate(ecosystem.planet.baseGenome, { format: "compressed" }),
                                topology: this.htmlGen.generateTopology(ecosystem.planet.baseGenome)
                            },
                            microbial: ecosystem.lifeForms.microbial.map(m => ({
                                id: m.id,
                                tailwind: this.cssGen.generate(m.genome, { format: "compressed" })
                            })),
                            flora: ecosystem.lifeForms.flora.map(f => ({
                                id: f.id,
                                tailwind: this.cssGen.generate(f.genome, { format: "compressed" })
                            })),
                            civilization: ecosystem.civilization ? {
                                level: ecosystem.civilization.sentienceLevel,
                                techEras: ecosystem.civilization.technologyTree.map(t => t.era),
                                designPatterns: ecosystem.civilization.technologyTree.flatMap(t => t.designPatterns)
                            } : null
                        };

                        return {
                            content: [{
                                type: "text",
                                text: JSON.stringify({
                                    ecosystem: {
                                        planet: {
                                            seed: ecosystem.planet.seed,
                                            conditions: ecosystem.planet.conditions,
                                            habitabilityScore: ecosystem.planet.habitabilityScore,
                                            dnaHash: ecosystem.planet.baseGenome.dnaHash
                                        },
                                        lifeForms: {
                                            microbialCount: ecosystem.lifeForms.microbial.length,
                                            floraCount: ecosystem.lifeForms.flora.length,
                                            faunaCount: ecosystem.lifeForms.fauna.length,
                                            dominant: ecosystem.lifeForms.dominant
                                        },
                                        civilization: ecosystem.civilization,
                                        evolution: ecosystem.evolution
                                    },
                                    outputs
                                }, null, 2)
                            }]
                        };
                    }

                    case "generate_civilization": {
                        if (!args.intent || !args.seed) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing intent or seed");
                        }

                        // Extract traits
                        const context = args.project_context || "";
                        const traits = await this.extractor.extractTraits(args.intent, context);

                        // Generate civilization tier
                        const tier = this.civilizationGen.generate(
                            args.intent, 
                            context, 
                            traits, 
                            args.min_tier
                        );

                        // Generate code if requested
                        let codeOutputs = null;
                        if (args.generate_code !== false) {
                            // Get base genome for the tier
                            const baseGenome = this.sequencer.generate(args.seed, traits, { primarySector: "technology" });
                            codeOutputs = generateCivilizationOutput(tier, baseGenome);
                        }

                        return {
                            content: [{
                                type: "text",
                                text: JSON.stringify({
                                    tier: tier.tier,
                                    complexity: tier.complexity,
                                    architecture: tier.architecture,
                                    components: {
                                        count: tier.components.count,
                                        categories: [...new Set(tier.components.list.map(c => c.category))]
                                    },
                                    animations: {
                                        physics: tier.animations.physics,
                                        types: tier.animations.types,
                                        choreography: tier.animations.choreography
                                    },
                                    designSystem: tier.designSystem,
                                    interactions: tier.interactions,
                                    ai: tier.ai,
                                    code: codeOutputs
                                }, null, 2)
                            }]
                        };
                    }

                    default:
                        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
                }
            } catch (error: any) {
                return {
                    content: [{ type: "text", text: `Error: ${error.message}` }],
                    isError: true
                };
            }
        });
    }

    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("Permutations MCP server running on stdio");
    }
}

const server = new DesignGenomeServer();
server.run().catch(console.error);
