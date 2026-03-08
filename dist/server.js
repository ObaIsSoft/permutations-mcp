import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { SemanticTraitExtractor } from "./semantic/extractor.js";
import { GenomeSequencer } from "./genome/sequencer.js";
import { CSSGenerator } from "./generators/css-generator.js";
import { HTMLTopologyGenerator } from "./generators/html-topology.js";
import { WebGLGenerator } from "./generators/webgl-generator.js";
import { FXGenerator } from "./generators/fx-generator.js";
import { SVGGenerator } from "./generators/svg-generator.js";
import { EpigeneticParser } from "./genome/epigenetics.js";
import { detectArchetype } from "./genome/archetypes.js";
import { PatternDetector } from "./constraints/pattern-detector.js";
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
    constructor() {
        this.server = new Server({ name: "permutations", version: "1.0.0" }, { capabilities: { tools: {} } });
        this.extractor = new SemanticTraitExtractor();
        this.sequencer = new GenomeSequencer();
        this.cssGen = new CSSGenerator();
        this.htmlGen = new HTMLTopologyGenerator();
        this.webglGen = new WebGLGenerator();
        this.fxGen = new FXGenerator();
        this.svgGen = new SVGGenerator();
        this.epigeneticParser = new EpigeneticParser();
        this.patternDetector = new PatternDetector();
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
                }
            ]
        }));
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const args = request.params.arguments;
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
                        // 3. DNA Sequencing (Hash + Traits + Epigenetics)
                        const genome = this.sequencer.generate(args.seed, traits, epigeneticData);
                        // 4. Component Generation
                        const tailwindConfig = this.cssGen.generate(genome, "tailwind");
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
                            if (detected)
                                archetype = detected;
                        }
                        // Generate from archetype (no API calls needed)
                        const genome = this.sequencer.generateFromArchetype(archetype, args.seed);
                        // Component Generation
                        const tailwindConfig = this.cssGen.generate(genome, "tailwind");
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
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("Permutations MCP server running on stdio");
    }
}
const server = new DesignGenomeServer();
server.run().catch(console.error);
