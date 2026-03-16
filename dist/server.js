import * as fsSync from "fs";
import * as path from "path";
import * as crypto from "crypto";
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
import { PatternDetector } from "./constraints/pattern-detector.js";
import { ecosystemGenerator } from "./genome/ecosystem.js";
import { CivilizationGenerator } from "./genome/civilization.js";
import { ComplexityAnalyzer } from "./genome/complexity-analyzer.js";
import { generateCivilizationOutput } from "./generators/civilization-generators.js";
import { applyArchetypeBias, ARCHETYPE_BIASES } from "./genome/archetype-biases.js";
import { formatGenerator } from "./generators/format-generators.js";
import { fontCatalog } from "./font-catalog.js";
import { designBriefGenerator } from "./generators/design-brief-generator.js";
import { urlGenomeExtractor } from "./genome/extractor-url.js";
import { selectIconLibrary, formatIconLibraryNote } from "./icon-catalog.js";
import { selectAnimationLibrary, formatAnimationLibraryNote } from "./animation-catalog.js";
import { selectStateLibrary } from "./state-catalog.js";
import { selectStylingLibrary } from "./styling-catalog.js";
import { selectOrganismLibrary } from "./organism-catalog.js";
import { selectInteractionLibraries } from "./interaction-catalog.js";
import { selectChartLibrary } from "./chart-catalog.js";
// ── Ecosystem biomes: hash-selectable structural character per tier ─────────
// Different seeds at same tier get different biome characters.
// Intent + sector constrain which branches are valid; the hash picks the branch.
const ECOSYSTEM_BIOMES = {
    prokaryotic: ['iron-oxidizing', 'sulfur-reducing', 'methane-producing', 'nitrifying', 'photosynthetic'],
    protist: ['predatory', 'symbiotic', 'colonial', 'parasitic', 'chemosynthetic'],
    bryophyte: ['xeric', 'hydric', 'lithophytic', 'epiphytic', 'volcanic'],
    vascular_flora: ['rainforest', 'desert', 'alpine', 'mangrove', 'riparian'],
    invertebrate_fauna: ['coral-reef', 'deep-sea', 'tidal-pool', 'cave', 'thermophilic'],
    ectotherm_fauna: ['savanna', 'wetland', 'volcanic', 'temperate', 'island'],
    endotherm_fauna: ['arctic', 'tropical', 'montane', 'grassland', 'boreal'],
};
// Civilization archetypes: hash-selectable civilizational character per tier
const CIVILIZATION_ARCHETYPES = {
    tribal: ['totemic', 'shamanistic', 'nomadic', 'warrior', 'maritime'],
    city_state: ['mercantile', 'theocratic', 'democratic', 'scholarly', 'militaristic'],
    nation_state: ['industrial', 'maritime', 'agrarian', 'federated', 'bureaucratic'],
    empire: ['colonial', 'theological', 'scientific', 'mercantile', 'maritime'],
    network: ['distributed', 'federated', 'mesh', 'autonomous', 'quantum'],
    singularity: ['convergent', 'transcendent', 'recursive', 'emergent', 'metamorphic'],
};
// Archetype context: character description passed to LLM component naming
const ARCHETYPE_CONTEXT = {
    totemic: 'each component embodies a symbol — bold, iconic, each has ritual significance',
    shamanistic: 'components feel organic and liminal, as if channeling invisible forces',
    nomadic: 'lightweight and portable — each component is self-contained, context-independent',
    warrior: 'bold and direct — components are tools for action, not decoration',
    maritime: 'navigational and fluid — components follow wave-like rhythm and flow',
    mercantile: 'transactional and efficient — every component serves exchange above all',
    theocratic: 'hierarchical and reverent — components follow sacred prescribed arrangement',
    democratic: 'egalitarian and accessible — every component has equal voice and visibility',
    scholarly: 'annotated and referenced — components carry their reasoning',
    militaristic: 'ordered and ranked — components follow strict command hierarchy',
    industrial: 'modular and mass-produced — components are interchangeable precision parts',
    agrarian: 'seasonal and cyclical — components grow and harvest data in structured patterns',
    federated: 'autonomous regions that agree on shared protocols — loosely coupled modules',
    bureaucratic: 'process-driven and documented — every component has a form and a procedure',
    colonial: 'expansionist — components aggressively capture and route data across surfaces',
    theological: 'doctrine-driven — components serve a higher purpose with ceremonial weight',
    scientific: 'empirical and hypothesis-driven — components measure, test, and log results',
    distributed: 'no center of gravity — every node is both producer and consumer',
    mesh: 'fully connected — every component can communicate with every other component',
    autonomous: 'self-organizing — components make independent decisions, emergent behavior',
    quantum: 'superposition — components exist in multiple contexts and states simultaneously',
    convergent: 'all systems merge into a unified intelligence substrate',
    transcendent: 'components operate beyond conventional UI paradigms',
    recursive: 'components that generate themselves — infinitely self-referential',
    emergent: 'no single designer — the system design emerges from component interactions',
    metamorphic: 'components morph between states, forms, and contexts continuously',
};
// Biome context: character description passed to LLM organism naming
const BIOME_CONTEXT = {
    'iron-oxidizing': 'metallic and structural — catalyzes heavy data transformation',
    'sulfur-reducing': 'reductive — simplifies and distills complex inputs to essentials',
    'methane-producing': 'generative — produces outputs from minimal raw inputs',
    'nitrifying': 'enriching — adds metadata, context, and structure to raw data',
    'photosynthetic': 'light-converting — captures ambient signals and renders them visible',
    'predatory': 'aggressive data consumers — hunts and captures information from the surface',
    'symbiotic': 'co-dependent — components only reach full function in relationship',
    'colonial': 'aggregate — gains power and capability by clustering',
    'parasitic': 'dependent — attaches to and draws capability from host systems',
    'chemosynthetic': 'energy from reactions — transforms one data type to another',
    'xeric': 'adapted to scarcity — minimal and efficient with sparse data',
    'hydric': 'water-adapted — fluid and overflow-friendly with abundant data',
    'lithophytic': 'rock-clinging — permanent structural anchors that never move',
    'epiphytic': 'surface-dwelling — attaches to and enhances other components',
    'volcanic': 'intense and high-energy — handles bursts, spikes, and eruption-scale events',
    'rainforest': 'dense and layered — stratified with canopy and understory hierarchy',
    'desert': 'sparse and resilient — minimal components that survive extreme scarcity',
    'alpine': 'high-altitude — adapted for extreme edge cases and boundary conditions',
    'mangrove': 'boundary-dwelling — bridges two different data environments',
    'riparian': 'stream-adjacent — lives at the edge of data flow, filters and routes',
    'coral-reef': 'symbiotic colony — builds on others in dense colorful collaborative clusters',
    'deep-sea': 'pressure-adapted — works in low-information environments, bioluminescent outputs',
    'tidal-pool': 'periodic exposure — handles intermittent connectivity gracefully',
    'cave': 'light-independent — works without visual feedback, sensation-first',
    'thermophilic': 'heat-adapted — designed for high-throughput hot paths and sustained load',
    'savanna': 'open and visible — high visual surface area, clear spatial hierarchy',
    'wetland': 'filtration-focused — cleans, normalizes, and validates data streams',
    'temperate': 'balanced and seasonal — adapts between different usage contexts',
    'island': 'isolated and self-sufficient — works without external dependencies',
    'arctic': 'cold and efficient — conserves computational energy aggressively',
    'tropical': 'rich and abundant — high feature density and visual richness',
    'montane': 'high-altitude specialist — edge computing and altitude scenarios',
    'grassland': 'open-range and scalable — extends across flat wide information landscapes',
    'boreal': 'coniferous and structured — regular repeating tree-like component structure',
};
/**
 * SHA-256 hash chain helpers.
 * Layer 1: sha256(seed)                       → genome.dnaHash      (chromosomes)
 * Layer 2: sha256(genome.dnaHash)             → ecosystemHash       (biome / organisms)
 * Layer 3: sha256(ecosystemHash)              → civilizationHash    (archetype / components)
 *
 * Each layer is derived FROM the previous layer's hash, not from a parallel tap on the seed.
 * Same seed → same chain. Different seeds → avalanche effect ensures differentiation per layer.
 */
function ecoHashFromGenomeHash(genomeDnaHash) {
    return crypto.createHash("sha256").update(genomeDnaHash).digest("hex");
}
function civHashFromEcoHash(ecosystemHash) {
    return crypto.createHash("sha256").update(ecosystemHash).digest("hex");
}
function hashByte(hexHash, bytePos, modulo) {
    return parseInt(hexHash.slice(bytePos * 2, bytePos * 2 + 2), 16) % modulo;
}
/** Maps ecosystem complexity to the appropriate biological tier key for biome lookup */
function ecosystemTierKey(complexity) {
    if (complexity >= 0.74)
        return 'endotherm_fauna';
    if (complexity >= 0.66)
        return 'ectotherm_fauna';
    if (complexity >= 0.57)
        return 'invertebrate_fauna';
    if (complexity >= 0.45)
        return 'vascular_flora';
    if (complexity >= 0.34)
        return 'bryophyte';
    if (complexity >= 0.23)
        return 'protist';
    return 'prokaryotic';
}
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
        // Pre-warm font catalogs at startup — non-blocking, failures fall back to hardcoded lists
        fontCatalog.warmCache(["bunny", "google", "fontshare"]);
        this.setupHandlers();
    }
    setupHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: "generate_design_genome",
                    description: "STEP 1 — Start here for every design task. Sequences a 32-chromosome design genome from a natural language intent. Returns CSS tokens, color system, typography, spacing, motion constraints, and a suggested_next workflow guide. All other tools require the genome this produces.",
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
                                enum: ["bunny", "google", "fontshare", "none"],
                                description: "Typography CDN (default: bunny). bunny/google pull from their full live catalogs. fontshare pulls from Fontshare's full catalog with richer semantic tags (geometric, grotesque, humanist, slab…). none emits the font family name only — use when fonts are self-hosted or loaded via npm."
                            }
                        },
                        required: ["intent", "seed"]
                    }
                },
                {
                    name: "validate_design",
                    description: "FINAL STEP — Call before shipping any CSS or HTML. Validates code against genome DNA constraints and checks for forbidden slop patterns (gradients on text, bootstrap shadows, AI tells). Returns violation list and slop score.",
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
                    description: "STEP 3 (optional) — Call after generate_design_genome when building a component library or design system. Pass genome.dnaHash as seed AND the full genome object as `genome` to wire L1 chromosomes directly into L2 gravity — this ensures the ecosystem inherits the exact same edge, motion, color, and density values the design genome produced. Without `genome`, L2 gravity runs on a re-derived child genome (one SHA-256 level deeper) which is coherent but not the same L1 the agent is building from. Returns ecosystemGenome (L2): microbial (atomic), flora (composite), fauna (complex) component hierarchy, organism library + interaction + chart recommendations. NOT generated code.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            intent: { type: "string", description: "Natural language design intent" },
                            seed: { type: "string", description: "Pass genome.dnaHash from generate_design_genome to maintain SHA-256 hash chain (L1→L2)." },
                            genome: {
                                type: "object",
                                description: "RECOMMENDED — Pass the full genome object returned by generate_design_genome. Wires L1 chromosomes directly into L2 gravity so the ecosystem inherits the exact same design character (edge style, motion physics, color, spacing) the agent is working from. Without this, L2 gravity uses a re-derived genome one hash level deeper."
                            },
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
                    description: "STEP 4 (optional) — Call after generate_ecosystem when complexity >= 0.68. Returns application architecture direction: state topology, routing patterns, token inheritance rules, and component composition contracts. Does NOT generate code by default (set generate_code: true to opt in). The agent implements from these specs.",
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
                                description: "Whether to generate actual React/TypeScript code (default: false — returns architecture specs only)",
                                default: false
                            },
                            font_provider: {
                                type: "string",
                                enum: ["bunny", "google", "fontshare", "none"],
                                description: "Typography CDN (default: bunny)"
                            }
                        },
                        required: ["intent", "seed"]
                    }
                },
                {
                    name: "update_design_genome",
                    description: "ITERATE — Call after generate_design_genome to adjust specific chromosomes. Use for 'make it warmer', 'increase motion', 'change the sector to fintech' workflows. Returns a diff of changed chromosomes and the updated genome.",
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
                    description: "EXPORT — Call after generate_design_genome to export design tokens for external tools. Outputs Figma Tokens, Style Dictionary (CSS/SCSS/iOS/Android), styled-components theme, Emotion theme, Vue 3 SFC, or Svelte scoped styles.",
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
                    name: "generate_design_brief",
                    description: "STEP 2 — Call after generate_design_genome before writing any code. Synthesizes all genome layers into a design philosophy thesis — what organism this design is, what it mandates, what it forbids. Also generates a DESIGN_SYSTEM.md (usage_md field) to save in the project. Pass all available genome layers for the fullest synthesis.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            genome: {
                                type: "object",
                                description: "L1 — The design genome from generate_design_genome (required)"
                            },
                            ecosystem_genome: {
                                type: "object",
                                description: "L2 — The ecosystem genome from generate_ecosystem (optional, enriches component philosophy)"
                            },
                            civilization_genome: {
                                type: "object",
                                description: "L3 — The civilization genome from generate_civilization (optional, enriches architecture philosophy)"
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
                    name: "extract_genome_from_url",
                    description: "ALTERNATIVE ENTRY — Call BEFORE generate_design_genome when you have a reference site. Returns a flat style snapshot (colors, fonts, spacing, animation) — NOT a chromosome genome. Pass the output as project_context into generate_design_genome to influence the generated genome. Do NOT pass this output directly to generate_design_brief, generate_ecosystem, or generate_civilization — those require a chromosome genome from generate_design_genome.",
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
                        const traits = analysis.traits;
                        const detectedSector = analysis.sector.primary;
                        const copyIntelligence = analysis.copyIntelligence;
                        const copy = analysis.copy;
                        const structural = analysis.structural;
                        // 4. DNA Sequencing (pass copy intelligence + LLM copy to sequencer)
                        const genome = this.sequencer.generate(seed, traits, {
                            primarySector: detectedSector,
                            options: {
                                fontProvider: args.font_provider,
                                copyIntelligence,
                                copy
                            }
                        }, epigeneticData);
                        // 5. Complexity Analysis — structural props take priority over traits.
                        // structural is vocabulary-invariant (computed from what the product DOES).
                        const complexityResult = this.complexityAnalyzer.analyze(intent, finalContext ?? "", traits, structural);
                        const { finalComplexity, tier } = complexityResult;
                        // 6. CSS (always generated)
                        const css = this.cssGen.generate(genome, { format: "expanded" });
                        const webglComponents = this.webglGen.generateR3F(genome);
                        const fxAtmosphere = this.fxGen.generateCSSClass(genome);
                        // LLM-driven biomarker — unique mark synthesized from chromosome combination
                        const svgBiomarker = await this.svgGen.generateBiomarker(genome, this.extractor.callText.bind(this.extractor));
                        // Chromosome-driven icon library selection
                        const iconLibrary = selectIconLibrary({
                            edgeStyle: genome.chromosomes.ch7_edge?.style ?? "sharp",
                            typeCharge: genome.chromosomes.ch3_type_display?.charge ?? "geometric",
                            sector: detectedSector,
                            dnaHashByte: parseInt(genome.dnaHash.slice(0, 2), 16),
                        });
                        // Chromosome-driven animation library selection
                        const animationLibrary = selectAnimationLibrary({
                            physics: genome.chromosomes.ch8_motion?.physics ?? "none",
                            choreographyStyle: genome.chromosomes.ch27_motion_choreography?.choreographyStyle ?? "smooth",
                            sector: detectedSector,
                            complexity: complexityResult.finalComplexity,
                            dnaHashByte: parseInt(genome.dnaHash.slice(2, 4), 16),
                        });
                        // Chromosome-driven state management selection
                        // Uses ch30_state topology + complexity score
                        const stateTopology = genome.chromosomes.ch30_state?.topology ?? "local";
                        const stateLibrarySelection = selectStateLibrary(stateTopology, complexityResult.finalComplexity);
                        // Chromosome-driven styling system selection
                        // Uses eco_ch12_expressiveness personality (if ecosystem ran) + edge style
                        const edgeStyle = genome.chromosomes.ch7_edge?.style ?? "soft";
                        // Personality resolved later when ecosystem data is available; use complexity proxy for now
                        const personalityProxy = complexityResult.finalComplexity > 0.75 ? "expressive"
                            : complexityResult.finalComplexity > 0.50 ? "bold"
                                : complexityResult.finalComplexity > 0.30 ? "balanced"
                                    : "corporate";
                        const stylingLibrarySelection = selectStylingLibrary(personalityProxy, edgeStyle, complexityResult.finalComplexity);
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
                        // layout_contract replaces html scaffold — spec not markup.
                        // Agents implement structure from this contract; no HTML template to anchor on.
                        const layout_contract = this.buildLayoutContract(genome, finalComplexity, tier);
                        let ecosystemOutput;
                        let civilizationOutput;
                        // SHA-256 hash chain — each layer derived from the previous layer's output
                        const genomeEcoHash = ecoHashFromGenomeHash(genome.dnaHash);
                        const genomeCivHash = civHashFromEcoHash(genomeEcoHash);
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
                            const ecoTierKey2 = ecosystemTierKey(finalComplexity < 0.81 ? finalComplexity : 0.79);
                            const ecoBiomeOptions2 = ECOSYSTEM_BIOMES[ecoTierKey2] ?? ['balanced'];
                            const ecoBiome2 = ecoBiomeOptions2[hashByte(genomeEcoHash, 0, ecoBiomeOptions2.length)];
                            const ecoBiomeDesc2 = BIOME_CONTEXT[ecoBiome2] ?? ecoBiome2;
                            ecosystemOutput = {
                                biome: ecoBiome2,
                                biomeDescription: ecoBiomeDesc2,
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
                                    const civArchetypeOptions2 = CIVILIZATION_ARCHETYPES[civTier.tier] ?? ['balanced'];
                                    const civArch2 = civArchetypeOptions2[hashByte(genomeCivHash, 0, civArchetypeOptions2.length)];
                                    const civArchDesc2 = ARCHETYPE_CONTEXT[civArch2] ?? civArch2;
                                    // Apply archetype chromosome biases to genome before generating civilization output
                                    const archetypedGenome2 = applyArchetypeBias(genome, civArch2);
                                    const archetypedCss2 = this.cssGen.generate(archetypedGenome2, { format: "compressed" });
                                    civilizationOutput = {
                                        archetype: civArch2,
                                        archetypeDescription: civArchDesc2,
                                        designPhilosophy: ARCHETYPE_BIASES[civArch2]?.designPhilosophy ?? civArchDesc2,
                                        ...generateCivilizationOutput(civTier, archetypedGenome2, archetypedCss2, undefined, allOrganisms)
                                    };
                                }
                                catch { /* ecosystem output still valid without civilization */ }
                            }
                        }
                        // 8. Auto pattern detection on generated output
                        const patternViolations = this.patternDetector.detectInGenome(genome, css, "");
                        const patternReport = this.patternDetector.generateReport(patternViolations);
                        const genome_report = this.buildGenomeReport(genome, {
                            intent,
                            seed,
                            sector: detectedSector,
                            complexity: finalComplexity,
                            tier: String(tier),
                            traits
                        });
                        const suggested_next = [
                            // ── Files to write immediately ───────────────────────────
                            {
                                action: "write_file",
                                file: "design-tokens.css",
                                field: "css",
                                instruction: "Write the `css` field to your project's stylesheet — e.g. src/styles/design-tokens.css or public/design-tokens.css. Import it at the root of your app.",
                                always: true
                            },
                            {
                                action: "write_file",
                                file: "genome.json",
                                field: "genome",
                                instruction: "Write the `genome` field as JSON to genome.json in the project root. Used for reproducibility — pass this seed + intent to regenerate the same genome.",
                                always: true
                            },
                            {
                                action: "write_file",
                                file: "public/biomarker.svg",
                                field: "svgBiomarker",
                                instruction: "Write the `svgBiomarker` field to public/biomarker.svg (or src/assets/biomarker.svg). This is the unique visual identity mark for this genome.",
                                always: true
                            },
                            // ── Tools to call next ────────────────────────────────────
                            {
                                tool: "generate_design_brief",
                                pass: "genome + ecosystemOutput.ecosystemGenome (if present) + civilizationOutput.civilizationGenome (if present)",
                                reason: "LLM synthesizes all genome layers into a design philosophy thesis + DESIGN_SYSTEM.md. Call this before writing any component code.",
                                always: true
                            },
                            {
                                tool: "generate_ecosystem",
                                pass: "intent + seed: genome.dnaHash (maintains SHA-256 hash chain from L1)",
                                reason: "Component organism hierarchy — microbial (atoms), flora (composites), fauna (complex). Returns ecosystemGenome (L2).",
                                genome_produced: "ecosystemOutput.ecosystemGenome — L2, controls component hierarchy and containment depth",
                                when: "building a design system, component library, or any multi-component UI"
                            },
                            ...(finalComplexity >= 0.68 ? [{
                                    tool: "generate_civilization",
                                    pass: "intent + seed + ecosystem: ecosystemOutput (entire object from generate_ecosystem)",
                                    reason: `Application architecture direction — state topology, routing, token inheritance. Complexity ${finalComplexity.toFixed(2)} qualifies.`,
                                    genome_produced: "civilizationOutput.civilizationGenome — L3, controls state/routing architecture",
                                    when: `complexity >= 0.68 — this genome qualifies (${finalComplexity.toFixed(2)})`
                                }] : []),
                            {
                                tool: "validate_design",
                                pass: "genome (L1) + your implemented css string",
                                reason: "Run before shipping — catches slop patterns and genome drift",
                                always: true
                            }
                        ];
                        return {
                            content: [{
                                    type: "text",
                                    text: JSON.stringify({
                                        genome,
                                        tier,
                                        finalComplexity,
                                        css,
                                        layout_contract,
                                        // Three-layer genome guide — which field drives which implementation concern
                                        genome_layer_guide: {
                                            L1_design_genome: {
                                                field: "genome",
                                                controls: ["CSS custom properties", "color system", "typography scale", "spacing rhythm", "motion physics", "edge treatment", "visual character"],
                                                pass_to: ["validate_design (required — pass as genome param)", "generate_design_brief (required — pass as genome param)"],
                                                do_not_use_for: "state management, routing, component hierarchy — those come from L2/L3"
                                            },
                                            L2_ecosystem_genome: {
                                                field: "ecosystemOutput.ecosystemGenome",
                                                controls: ["component organism type (microbial/flora/fauna)", "containment hierarchy (predator→prey)", "organism count scaling", "biome character"],
                                                pass_to: ["generate_civilization as the `ecosystem` parameter — this wires L2 into L3"],
                                                chain_note: "To call generate_ecosystem as a standalone tool: pass genome.dnaHash as `seed` to maintain SHA-256 chain continuity"
                                            },
                                            L3_civilization_genome: {
                                                field: "civilizationOutput.civilizationGenome",
                                                controls: ["state topology (civ_ch2_governance.model → useState/context/zustand/federated)", "routing pattern (civ_ch7_knowledge.model → single-page/multi-page/platform/federated)", "token inheritance model", "application tier"],
                                                implement_as: finalComplexity >= 0.97 ? "Module Federation — distributed state + event bus"
                                                    : finalComplexity >= 0.92 ? "Zustand store + platform shell routing"
                                                        : finalComplexity >= 0.87 ? "shared context + protected routing"
                                                            : finalComplexity >= 0.81 ? "useState/useReducer + single/multi-page routing"
                                                                : "ecosystem tier — no civilization layer (complexity below tribal threshold)"
                                            }
                                        },
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
                                        icon_library: {
                                            name: iconLibrary.name,
                                            package: iconLibrary.reactPackage,
                                            style: iconLibrary.style,
                                            count: iconLibrary.count,
                                            license: iconLibrary.license,
                                            description: iconLibrary.description,
                                            import_example: iconLibrary.importExample,
                                            cdn: iconLibrary.cdn,
                                            weight_variants: iconLibrary.weightVariants,
                                            note: formatIconLibraryNote(iconLibrary),
                                        },
                                        animation_library: {
                                            name: animationLibrary.name,
                                            package: animationLibrary.reactPackage ?? animationLibrary.package,
                                            style: animationLibrary.style,
                                            bundle_size: animationLibrary.bundleSize,
                                            license: animationLibrary.license,
                                            description: animationLibrary.description,
                                            choreography: animationLibrary.choreography,
                                            import_example: animationLibrary.importExample,
                                            usage_example: animationLibrary.usageExample,
                                            cdn: animationLibrary.cdn,
                                            note: formatAnimationLibraryNote(animationLibrary),
                                        },
                                        state_library: {
                                            primary: {
                                                name: stateLibrarySelection.primary.name,
                                                package: stateLibrarySelection.primary.package,
                                                paradigm: stateLibrarySelection.primary.paradigm,
                                                bundle_size: stateLibrarySelection.primary.bundleSize,
                                                description: stateLibrarySelection.primary.description,
                                                install: stateLibrarySelection.primary.installCmd,
                                                import_example: stateLibrarySelection.primary.importExample,
                                                minimal_example: stateLibrarySelection.primary.minimalExample,
                                            },
                                            alternative: {
                                                name: stateLibrarySelection.alternative.name,
                                                package: stateLibrarySelection.alternative.package,
                                                paradigm: stateLibrarySelection.alternative.paradigm,
                                                description: stateLibrarySelection.alternative.description,
                                            },
                                            topology: stateTopology,
                                        },
                                        styling_system: {
                                            primary: {
                                                name: stylingLibrarySelection.primary.name,
                                                package: stylingLibrarySelection.primary.package,
                                                paradigm: stylingLibrarySelection.primary.paradigm,
                                                bundle_size: stylingLibrarySelection.primary.bundleSize,
                                                description: stylingLibrarySelection.primary.description,
                                                install: stylingLibrarySelection.primary.installCmd,
                                                import_example: stylingLibrarySelection.primary.importExample,
                                                minimal_example: stylingLibrarySelection.primary.minimalExample,
                                                ssr_safe: stylingLibrarySelection.primary.ssrSafe,
                                            },
                                            alternative: {
                                                name: stylingLibrarySelection.alternative.name,
                                                package: stylingLibrarySelection.alternative.package,
                                                paradigm: stylingLibrarySelection.alternative.paradigm,
                                                description: stylingLibrarySelection.alternative.description,
                                            },
                                            personality: personalityProxy,
                                            edge_style: edgeStyle,
                                        },
                                        patternReport,
                                        patternViolations: patternViolations.filter(v => v.severity === "error"),
                                        suggested_next,
                                        genome_report
                                    }, null, 2)
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
                        // Estimate organism counts from traits to size the LLM naming call.
                        // Uses informationDensity as a proxy for complexity — close enough
                        // for the naming call; exact counts are genome-derived inside the generator.
                        const ecoComplexityProxy = Math.max(0, (ecoTraits.informationDensity ?? 0.5) * 0.6 +
                            (ecoTraits.trustRequirement ?? 0.5) * 0.2 +
                            (ecoTraits.spatialDependency ?? 0.5) * 0.2);
                        const estimatedCounts = {
                            microbial: ecoComplexityProxy < 0.11 ? 0
                                : Math.min(16, Math.floor(2 + ((ecoComplexityProxy - 0.11) / 0.69) * 14)),
                            flora: ecoComplexityProxy < 0.34 ? 0
                                : Math.min(12, Math.floor(((ecoComplexityProxy - 0.34) / 0.46) * 12)),
                            fauna: ecoComplexityProxy < 0.57 ? 0
                                : Math.min(10, Math.floor(((ecoComplexityProxy - 0.57) / 0.23) * 10)),
                        };
                        // SHA-256 chain: ecosystem hash derived from genome hash (sha256(sha256(seed)))
                        // Keeps biome selection on the same chain as chromosomes, not a parallel tap
                        const ecoSeedHash = crypto.createHash("sha256").update(args.seed).digest("hex");
                        const ecoBiomeHash = ecoHashFromGenomeHash(ecoSeedHash);
                        const ecoTierKey = ecosystemTierKey(ecoComplexityProxy);
                        const ecoBiomeOptions = ECOSYSTEM_BIOMES[ecoTierKey] ?? ['balanced'];
                        const ecoBiome = ecoBiomeOptions[hashByte(ecoBiomeHash, 0, ecoBiomeOptions.length)];
                        const ecoBiomeDesc = BIOME_CONTEXT[ecoBiome] ?? ecoBiome;
                        const ecoBiomeContext = `${ecoBiome} — ${ecoBiomeDesc}`;
                        // LLM names the organisms — product-specific, not abstract topology names.
                        // Non-fatal: ecosystemGenerator falls back to topology-derived names if this fails.
                        const organismsDefinition = await this.extractor.analyzeOrganisms(args.intent, ecoSector, estimatedCounts, ecoBiomeContext);
                        // Generate ecosystem.
                        // If the caller passes the full L1 genome (from generate_design_genome),
                        // use it directly so L2 gravity reads L1_original chromosomes — not a
                        // re-derived child genome one SHA-256 level deeper.
                        const ecosystem = ecosystemGenerator.generate(args.seed, ecoTraits, {
                            ...(args.options || {}),
                            primarySector: ecoSector,
                            organismsDefinition,
                            existingGenome: args.genome ?? undefined,
                        });
                        // Generate CSS from the shared genome
                        const css = this.cssGen.generate(ecosystem.environment.genome, { format: "compressed" });
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
                        // ── L2 library catalog selections ─────────────────────────────────
                        const ecoChromosomes = ecosystem.environment.ecosystemGenome.chromosomes;
                        const genomeChromosomes = ecosystem.environment.genome.chromosomes;
                        const hasFauna = ecosystem.organisms.fauna.length > 0;
                        const hasDataHeavyFauna = hasFauna && ecosystem.organisms.fauna.length >= 3;
                        const organismSelection = selectOrganismLibrary({
                            edgeStyle: genomeChromosomes.ch7_edge.style,
                            motionPhysics: genomeChromosomes.ch8_motion.physics,
                            succession: ecoChromosomes.eco_ch5_succession.stage,
                            symbiosis: ecoChromosomes.eco_ch3_symbiosis.pattern,
                            trophic: ecoChromosomes.eco_ch4_trophic.structure,
                            population: ecoChromosomes.eco_ch7_population.pattern,
                            biome: ecoChromosomes.eco_ch1_biome.class,
                            adaptation: ecoChromosomes.eco_ch6_adaptation.axis,
                            personality: ecoChromosomes.eco_ch12_expressiveness.personality,
                            hasFauna,
                        });
                        const interactionSelection = selectInteractionLibraries({
                            motionPhysics: genomeChromosomes.ch8_motion.physics,
                            trophic: ecoChromosomes.eco_ch4_trophic.structure,
                            population: ecoChromosomes.eco_ch7_population.pattern,
                            succession: ecoChromosomes.eco_ch5_succession.stage,
                            adaptation: ecoChromosomes.eco_ch6_adaptation.axis,
                            energy: ecoChromosomes.eco_ch2_energy.source,
                            symbiosis: ecoChromosomes.eco_ch3_symbiosis.pattern,
                            personality: ecoChromosomes.eco_ch12_expressiveness.personality,
                            hasFauna,
                            hasDataHeavyFauna,
                        });
                        const chartSelection = selectChartLibrary({
                            edgeStyle: genomeChromosomes.ch7_edge.style,
                            motionPhysics: genomeChromosomes.ch8_motion.physics,
                            complexityScore: ecosystem.evolution.complexity,
                            adaptation: ecoChromosomes.eco_ch6_adaptation.axis,
                            trophic: ecoChromosomes.eco_ch4_trophic.structure,
                            succession: ecoChromosomes.eco_ch5_succession.stage,
                            energy: ecoChromosomes.eco_ch2_energy.source,
                            biome: ecoChromosomes.eco_ch1_biome.class,
                            personality: ecoChromosomes.eco_ch12_expressiveness.personality,
                            hasFauna,
                        });
                        const ecosystemReportLines = [
                            `# Ecosystem Report`,
                            ``,
                            `## Seed → Organisms`,
                            `| Field | Value |`,
                            `|---|---|`,
                            `| Intent | ${args.intent} |`,
                            `| Seed | \`${args.seed}\` |`,
                            `| Sector | **${ecoSector}** |`,
                            `| Complexity | ${ecosystem.evolution.complexity.toFixed(3)} |`,
                            `| Civilization ready | ${ecosystem.civilizationReady ? "Yes — call generate_civilization" : `No — gap: ${(ecosystem.civilizationThreshold - ecosystem.evolution.complexity).toFixed(3)}`} |`,
                            ``,
                            `## Ecosystem Character`,
                            `**Biome:** ${ecoBiome} — *${ecoBiomeDesc}*`,
                            ``,
                            `## Organism Hierarchy`,
                            ``,
                            `### Microbial (atomic components) — ${ecosystem.organisms.microbial.length}`,
                            ...ecosystem.organisms.microbial.map(o => `- **${o.name}** (${o.id}) — ${o.purpose || `color: ${o.characteristics.colorTreatment}`}`),
                            ``,
                            `### Flora (composite components) — ${ecosystem.organisms.flora.length}`,
                            ...ecosystem.organisms.flora.map(o => `- **${o.name}** (${o.id}) — ${o.purpose || `motion: ${o.characteristics.motionStyle}`}`),
                            ``,
                            `### Fauna (complex components) — ${ecosystem.organisms.fauna.length}`,
                            ...ecosystem.organisms.fauna.map(o => `- **${o.name}** (${o.id}) — ${o.purpose || `entropy: ${o.adaptation.entropy.toFixed(2)}`}`),
                            ``,
                            `## Containment Map`,
                            ...ecosystem.relationships.filter((r) => r.type === "containment").slice(0, 10).map((r) => `- **${r.organisms[0]}** → contains → **${r.organisms[1]}** (pattern: ${r.pattern})`),
                            ``,
                            `## What This Means for Implementation`,
                            `- Microbial = atoms: build these first`,
                            `- Flora = molecules: compose from microbial`,
                            `- Fauna = organisms: compose from flora + microbial`,
                            `- All components share one genome — colors, spacing, and motion are inherited, not redefined per component`,
                        ];
                        const ecosystem_report = ecosystemReportLines.join("\n");
                        return {
                            content: [{
                                    type: "text",
                                    text: JSON.stringify({
                                        ecosystem_report,
                                        ecosystem: {
                                            environment: {
                                                dnaHash: ecosystem.environment.genome.dnaHash,
                                                habitabilityScore: ecosystem.environment.habitabilityScore,
                                                carryingCapacity: ecosystem.environment.carryingCapacity,
                                                ecosystemGenome: ecosystem.environment.ecosystemGenome
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
                                        biome: ecoBiome,
                                        biomeDescription: ecoBiomeDesc,
                                        css,
                                        libraries: {
                                            organism: {
                                                primary: { name: organismSelection.primary.name, package: organismSelection.primary.package, philosophy: organismSelection.primary.philosophy, installCmd: organismSelection.primary.installCmd, importExample: organismSelection.primary.importExample, combinableWith: organismSelection.primary.combinableWith },
                                                alternative: { name: organismSelection.alternative.name, package: organismSelection.alternative.package, philosophy: organismSelection.alternative.philosophy, installCmd: organismSelection.alternative.installCmd, importExample: organismSelection.alternative.importExample, combinableWith: organismSelection.alternative.combinableWith },
                                                also_consider: organismSelection.also_consider.map(l => ({ name: l.name, package: l.package, philosophy: l.philosophy })),
                                            },
                                            interaction: {
                                                primary: { name: interactionSelection.primary.name, package: interactionSelection.primary.package, domain: interactionSelection.primary.domain, installCmd: interactionSelection.primary.installCmd, importExample: interactionSelection.primary.importExample, combinableWith: interactionSelection.primary.combinableWith },
                                                alternative: { name: interactionSelection.alternative.name, package: interactionSelection.alternative.package, domain: interactionSelection.alternative.domain, installCmd: interactionSelection.alternative.installCmd, importExample: interactionSelection.alternative.importExample, combinableWith: interactionSelection.alternative.combinableWith },
                                                coverage: interactionSelection.coverage,
                                                all_ranked: interactionSelection.ranked.map(l => ({ name: l.name, package: l.package, domain: l.domain })),
                                            },
                                            charts: chartSelection.chartsRecommended ? {
                                                primary: { name: chartSelection.primary.name, package: chartSelection.primary.package, approach: chartSelection.primary.approach, families: chartSelection.primary.families, installCmd: chartSelection.primary.installCmd, importExample: chartSelection.primary.importExample },
                                                alternative: { name: chartSelection.alternative.name, package: chartSelection.alternative.package, approach: chartSelection.alternative.approach, families: chartSelection.alternative.families, installCmd: chartSelection.alternative.installCmd, importExample: chartSelection.alternative.importExample },
                                                also_consider: chartSelection.also_consider.map(l => ({ name: l.name, package: l.package, approach: l.approach, families: l.families })),
                                            } : null,
                                        },
                                        usage: {
                                            whenCivilizationReady: ecosystem.civilizationReady
                                                ? "Call generate_civilization with the same seed to get architecture, state management, and advanced patterns"
                                                : `Add complexity (dashboard, 3D, real-time keywords) or increase counts to reach threshold ${ecosystem.civilizationThreshold}`,
                                            componentHierarchy: "Fauna contain Flora contain Microbial — use relationships.containment for composition",
                                            implementation: "Each organism is a component spec. Implement from its prop contract and colorTreatment — the agent writes the actual code."
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
                        let civEcoGenome = null;
                        if (ecosystem) {
                            // Use ecosystem's organisms and genome
                            baseGenome = ecosystem.environment?.genome;
                            organisms = ecosystem.organisms;
                            civEcoGenome = ecosystem.environment?.ecosystemGenome ?? null;
                        }
                        // If no ecosystem or genome, generate using already-derived sector (no second LLM call)
                        if (!baseGenome) {
                            baseGenome = this.sequencer.generate(args.seed, civTraits, { primarySector: civSector });
                        }
                        const traits = civTraits;
                        // Generate civilization tier — pass ecosystem genome for Layer 3 genome chain
                        const tier = this.civilizationGen.generate(args.intent, context, traits, baseGenome, args.min_tier, civEcoGenome ?? undefined);
                        // SHA-256 chain: civilization hash derived from ecosystem hash derived from genome hash
                        const civEcoHash = ecoHashFromGenomeHash(baseGenome.dnaHash);
                        const civCivHash = civHashFromEcoHash(civEcoHash);
                        const civArchetypeOptions = CIVILIZATION_ARCHETYPES[tier.tier] ?? ['balanced'];
                        const civArchetype = civArchetypeOptions[hashByte(civCivHash, 0, civArchetypeOptions.length)];
                        const civArchetypeDesc = ARCHETYPE_CONTEXT[civArchetype] ?? civArchetype;
                        const civArchetypeContext = `${civArchetype} — ${civArchetypeDesc}`;
                        // Apply archetype chromosome biases — mutates edge, motion, grid, material
                        const archetypedGenome = applyArchetypeBias(baseGenome, civArchetype);
                        // Regenerate CSS from the archetype-biased genome
                        const archetypedCss = this.cssGen.generate(archetypedGenome, { format: "compressed" });
                        // LLM names civilization components — product-specific, archetype-flavored
                        const civComponentCount = Array.isArray(tier.components.count)
                            ? tier.components.count[1]
                            : tier.components.list.length;
                        const civComponentDefs = await this.extractor.analyzeCivilizationComponents(args.intent, civSector, tier.tier, civArchetypeContext, Math.min(civComponentCount, 16));
                        // Overlay LLM names onto existing component specs (keeps accessibility/prop contracts)
                        const namedComponentList = tier.components.list.map((spec, i) => {
                            const def = civComponentDefs[i];
                            if (!def)
                                return spec;
                            return { ...spec, name: def.name, purpose: def.purpose };
                        });
                        // Generate code and structured file outputs
                        let codeOutputs = null;
                        let fileStructure = null;
                        if (args.generate_code === true) {
                            const topology = this.htmlGen.generateTopology(archetypedGenome);
                            // Generate code using archetype-biased genome + CSS
                            codeOutputs = generateCivilizationOutput(tier, archetypedGenome, archetypedCss, topology);
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
                        const civReportLines = [
                            `# Civilization Report`,
                            ``,
                            `## Intent → Architecture`,
                            `| Field | Value |`,
                            `|---|---|`,
                            `| Intent | ${args.intent} |`,
                            `| Seed | \`${args.seed}\` |`,
                            `| Sector | **${civSector}** |`,
                            `| Tier reached | **${tier.tier}** (complexity: ${tier.complexity.toFixed(3)}) |`,
                            `| Source | ${ecosystem ? "ecosystem-derived" : "standalone (no ecosystem provided)"} |`,
                            `| Code generated | ${args.generate_code === true ? "Yes" : "No — architecture specs only"} |`,
                            ``,
                            `## Civilization Character`,
                            `**Tier:** ${tier.tier} · **Archetype:** ${civArchetype}`,
                            ``,
                            `### Design Philosophy`,
                            ARCHETYPE_BIASES[civArchetype]?.designPhilosophy ?? civArchetypeDesc,
                            ``,
                            `### Architecture Intent`,
                            ARCHETYPE_BIASES[civArchetype]?.architectureIntent ?? '',
                            ``,
                            `### Chromosome Mutations Applied`,
                            ...Object.entries(ARCHETYPE_BIASES[civArchetype]?.chromosomeMutations ?? {}).map(([k, v]) => `- \`${k}\`: ${JSON.stringify(v)}`),
                            ``,
                            `## Architecture Direction`,
                            ...(tier.architecture ? Object.entries(tier.architecture).map(([k, v]) => `- **${k}:** ${JSON.stringify(v)}`) : ["- (no architecture data)"]),
                            ``,
                            `## Design System Constraints`,
                            ...(tier.designSystem ? Object.entries(tier.designSystem).map(([k, v]) => `- **${k}:** ${JSON.stringify(v)}`) : ["- (no design system data)"]),
                            ``,
                            `## What This Means for Implementation`,
                            `- This is architecture direction, NOT code — implement from these specs`,
                            `- State topology, routing patterns, and token inheritance tell you HOW to structure your app`,
                            `- Component composition contracts tell you WHAT components to build and how they nest`,
                            `- Run validate_design on any CSS/HTML you produce from this direction`,
                        ];
                        const civilization_report = civReportLines.join("\n");
                        return {
                            content: [{
                                    type: "text",
                                    text: JSON.stringify({
                                        civilization_report,
                                        tier: tier.tier,
                                        complexity: tier.complexity,
                                        archetype: civArchetype,
                                        archetypeDescription: civArchetypeDesc,
                                        designPhilosophy: ARCHETYPE_BIASES[civArchetype]?.designPhilosophy ?? civArchetypeDesc,
                                        architectureIntent: ARCHETYPE_BIASES[civArchetype]?.architectureIntent ?? '',
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
                                                : namedComponentList,
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
                    case "generate_design_brief": {
                        if (!args.genome) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing genome");
                        }
                        const brief = await designBriefGenerator.generate(args.genome, this.extractor.callText.bind(this.extractor), args.ecosystem_genome, args.civilization_genome);
                        const layerCount = 1 + (args.ecosystem_genome ? 1 : 0) + (args.civilization_genome ? 1 : 0);
                        return {
                            content: [{
                                    type: "text",
                                    text: JSON.stringify({
                                        thesis: brief.thesis,
                                        mandates: brief.mandates,
                                        anti_patterns: brief.antiPatterns,
                                        layer_guide: brief.layerGuide,
                                        usage_md: brief.usage_md,
                                        layers_synthesized: layerCount,
                                        note: layerCount < 3
                                            ? `Synthesized from ${layerCount} layer(s). Pass ecosystem_genome and civilization_genome for full 3-layer philosophy.`
                                            : "Full 3-layer synthesis complete.",
                                        suggested_next: [
                                            {
                                                action: "write_file",
                                                file: "DESIGN_SYSTEM.md",
                                                field: "usage_md",
                                                instruction: "Write the `usage_md` field to DESIGN_SYSTEM.md in the project root. This is the design constitution the entire build must follow.",
                                                always: true,
                                            },
                                            {
                                                tool: "generate_ecosystem",
                                                reason: "Build a component library architecture — biome, energy, symbiosis patterns. Call when building a full design system.",
                                                when: "building multiple components or a full UI library",
                                            },
                                            {
                                                tool: "validate_design",
                                                reason: "Run before shipping any CSS or HTML. Validates genome against accessibility, contrast, and motion constraints.",
                                                always: true,
                                            },
                                        ],
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
                                        warning: "This is a flat style snapshot — NOT a chromosome genome. Do not pass this to generate_design_brief, generate_ecosystem, or generate_civilization.",
                                        suggested_next: [
                                            {
                                                tool: "generate_design_genome",
                                                how: "Pass this snapshot as project_context (stringified or summarized). Example: generate_design_genome({ intent: 'your intent here', seed: 'your-seed', project_context: JSON.stringify(this_output) })",
                                                why: "generate_design_genome produces the chromosome genome that all other tools require. This URL extraction informs it — it does not replace it."
                                            }
                                        ]
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
    buildLayoutContract(genome, complexity, tier) {
        const ch = genome.chromosomes;
        const cd = ch.ch23_content_depth ?? {};
        const ia = ch.ch23_information_architecture ?? {};
        const ts = ch.ch21_trust_signals ?? {};
        const sp = ch.ch22_social_proof ?? {};
        const hero = ch.ch19_hero_type ?? {};
        const sections = [];
        if (cd.hasHero !== false)
            sections.push("hero");
        if (ts.approach)
            sections.push("trust_grid");
        if (sp.type)
            sections.push("social_proof");
        if (cd.hasFeatures !== false)
            sections.push("features");
        if (cd.hasFAQ)
            sections.push("faq");
        if (cd.hasTestimonials)
            sections.push("testimonials");
        if (cd.hasCTA !== false)
            sections.push("cta");
        sections.push("footer");
        return {
            _note: "Implement each section from scratch using design brief constraints. Do not treat this as HTML boilerplate to fill in — it is a structural spec that your implementation must interpret.",
            hero: {
                type: hero.type ?? "default",
                layout: hero.variant ?? "centered",
            },
            navigation: {
                type: ia.navigationType ?? "header",
                footer: ia.footerType ?? "minimal",
            },
            sections,
            trust: {
                approach: ts.approach ?? null,
                prominence: ts.prominence ?? null,
                layout: ts.layoutVariant ?? null,
            },
            social_proof: {
                type: sp.type ?? null,
                layout: sp.layout ?? null,
            },
            content: {
                depth: cd.level ?? null,
                estimated_sections: cd.estimatedSections ?? sections.length,
                information_architecture: ia.pattern ?? null,
            },
            implementation_tier: complexity >= 0.81
                ? {
                    tier,
                    mandate: "Build as a framework application (React/Vue/Svelte). civilizationOutput.architecture defines state and routing. Do NOT flatten to a static HTML page.",
                    state: "See civilizationOutput.civilizationGenome.chromosomes.civ_ch2_governance.model",
                    routing: "See civilizationOutput.civilizationGenome.chromosomes.civ_ch7_knowledge.model"
                }
                : {
                    tier,
                    mandate: "Progressive enhancement — HTML structure first, CSS tokens second, interaction third. ecosystemOutput defines component organism counts and hierarchy.",
                }
        };
    }
    buildGenomeReport(genome, opts) {
        const ch = genome?.chromosomes ?? {};
        const primary = ch.ch5_color_primary ?? {};
        const temp = ch.ch6_color_temp ?? {};
        const structure = ch.ch1_structure ?? {};
        const motion = ch.ch8_motion ?? {};
        const edge = ch.ch7_edge ?? {};
        const typeDisplay = ch.ch3_type_display ?? {};
        const typeBody = ch.ch4_type_body ?? {};
        const hero = ch.ch19_hero_type ?? {};
        const texture = ch.ch11_texture ?? {};
        const hierarchy = ch.ch10_hierarchy ?? {};
        const colorSystem = ch.ch26_color_system ?? {};
        const pHue = typeof primary.hue === "number" ? `${primary.hue}°` : "–";
        const pSat = typeof primary.saturation === "number" ? `${Math.round(primary.saturation * 100)}%` : "–";
        const pLight = typeof primary.lightness === "number" ? `${Math.round(primary.lightness * 100)}%` : "–";
        const pDark = typeof primary.darkModeLightness === "number" ? `${Math.round(primary.darkModeLightness * 100)}%` : "–";
        const lines = [
            `# Genome Report`,
            ``,
            `## Intent → DNA`,
            `| Field | Value |`,
            `|---|---|`,
            `| Intent | ${opts.intent} |`,
            `| Seed | \`${opts.seed}\` |`,
            `| DNA Hash | \`${genome?.dnaHash ?? "–"}\` |`,
            `| Sector detected | **${opts.sector}** |`,
            `| Complexity | ${opts.complexity.toFixed(3)} → **${opts.tier}** tier |`,
            ``,
            `## Chromosomes Sequenced`,
            ``,
            `### ch0 — Sector Identity`,
            `- Primary: **${ch.ch0_sector_primary?.name ?? opts.sector}**`,
            ...(ch.ch0_sector_secondary?.name ? [`- Secondary: ${ch.ch0_sector_secondary.name}`] : []),
            ``,
            `### ch5 + ch6 — Color System`,
            `- Primary hex: \`${primary.hex ?? "–"}\` (hue ${pHue}, sat ${pSat}, light ${pLight})`,
            `- Dark mode interactive: \`${primary.darkModeHex ?? "–"}\` (lightness ${pDark} — visible on dark surfaces)`,
            `- Temperature: ${primary.temperature ?? "–"} | Mode: ${temp.isDark ? "dark" : "light"}`,
            ...(colorSystem.palette ? [`- Palette scale: ${Array.isArray(colorSystem.palette) ? colorSystem.palette.length : "–"} steps`] : []),
            ``,
            `### ch3 + ch4 — Typography`,
            `- Display: **${typeDisplay.family ?? typeDisplay.name ?? "–"}** @ ${typeDisplay.size ?? "–"}`,
            `- Body: **${typeBody.family ?? typeBody.name ?? "–"}** @ ${typeBody.size ?? "–"}`,
            ``,
            `### ch1 + ch9 — Layout & Grid`,
            `- Structure: ${structure.layout ?? structure.type ?? structure.name ?? JSON.stringify(structure).slice(0, 80)}`,
            ``,
            `### ch7 — Edge Geometry`,
            `- Radius: ${edge.radius ?? edge.corner ?? edge.value ?? JSON.stringify(edge).slice(0, 60)}`,
            ``,
            `### ch8 — Motion`,
            `- Physics: ${motion.physics ?? motion.type ?? motion.name ?? JSON.stringify(motion).slice(0, 60)}`,
            ``,
            `### ch11 — Texture`,
            `- Treatment: ${texture.type ?? texture.name ?? JSON.stringify(texture).slice(0, 60)}`,
            ``,
            `### ch10 — Visual Hierarchy`,
            `- Strategy: ${hierarchy.strategy ?? hierarchy.type ?? JSON.stringify(hierarchy).slice(0, 60)}`,
            ``,
            `### ch19 — Hero`,
            `- Type: ${hero.type ?? hero.name ?? JSON.stringify(hero).slice(0, 60)}`,
            ``,
            `## Active Constraints`,
            `- Sector **${opts.sector}** forbidden hue ranges excluded from palette — primary is freely selected from valid spectrum`,
            `- Dark mode buttons use \`darkModeHex\` (${pDark} lightness) to remain visible on dark surfaces`,
            `- All slop patterns (gradient text, generic shadows, generic font stacks) are enforced by \`validate_design\``,
            ``,
            `## Suggested Workflow`,
            `\`\`\``,
            `generate_design_genome  ← you are here`,
            `  ↓`,
            `generate_design_brief   ← read before writing any code`,
            `  ↓ (if building a UI library)`,
            `generate_ecosystem      ← component specs + containment map`,
            ...(opts.complexity >= 0.68 ? [
                `  ↓ (complexity ${opts.complexity.toFixed(2)} qualifies)`,
                `generate_civilization   ← architecture direction`
            ] : []),
            `  ↓`,
            `validate_design         ← run before shipping CSS/HTML`,
            `\`\`\``,
        ];
        return lines.join("\n");
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
