import * as fs from "fs/promises";
import * as fsSync from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { createRequire } from "module";

// Load package.json for version (avoids hardcoded version drift)
const require = createRequire(import.meta.url);
const PACKAGE_VERSION = require("../package.json").version;

// Load .env if present (no dotenv dep — pure Node.js)
// Does NOT override vars already set in the environment, so shell vars win.
try {
    const envFile = path.join(path.dirname(new URL(import.meta.url).pathname), "../.env");
    if (fsSync.existsSync(envFile)) {
        const lines = fsSync.readFileSync(envFile, "utf-8").split("\n");
        for (const line of lines) {
            const m = line.match(/^\s*([^#=\s][^=]*?)\s*=\s*(.*)\s*$/);
            if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
        }
    }
} catch { /* ignore */ }
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

import { WebGLGenerator } from "./generators/webgl-generator.js";
import { FXGenerator } from "./generators/fx-generator.js";
import { SVGGenerator } from "./generators/svg-generator.js";
import { EpigeneticParser } from "./genome/epigenetics.js";
import { detectArchetype } from "./genome/archetypes.js";
import { PatternDetector } from "./constraints/pattern-detector.js";
import { ecosystemGenerator, Ecosystem } from "./genome/ecosystem.js";
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

// ── Genome Validation Helper ───────────────────────────────────────────────
function validateGenome(genome: any, context: string): asserts genome is { chromosomes: any; sectorContext: any; dnaHash: string } {
    if (!genome) {
        throw new McpError(ErrorCode.InvalidParams, `${context}: Missing genome object`);
    }
    if (!genome.chromosomes) {
        throw new McpError(ErrorCode.InvalidParams, 
            `${context}: Genome missing 'chromosomes' field. Ensure you pass the complete genome object from generate_design_genome, not just dnaHash/traits.`);
    }
    if (!genome.sectorContext) {
        throw new McpError(ErrorCode.InvalidParams,
            `${context}: Genome missing 'sectorContext' field. Ensure you pass the complete genome object from generate_design_genome.`);
    }
    if (!genome.dnaHash) {
        throw new McpError(ErrorCode.InvalidParams,
            `${context}: Genome missing 'dnaHash' field.`);
    }
}

// ── Chromosome Access Tracker ───────────────────────────────────────────────
// Tracks which chromosomes are accessed during genome usage to ensure full utilization

// L1 Design Genome: 32 chromosomes
const CHROMOSOME_REGISTRY = [
    'ch0_sector_primary', 'ch0_sector_secondary',
    'ch1_structure', 'ch2_density', 'ch3_type_display', 'ch4_type_body',
    'ch5_color_primary', 'ch6_color_temp', 'ch7_edge', 'ch8_motion',
    'ch9_grid', 'ch10_hierarchy', 'ch11_texture', 'ch12_depth',
    'ch13_z_index', 'ch14_responsive', 'ch15_spacing', 'ch16_shadow',
    'ch17_material', 'ch18_accessibility', 'ch19_hero_type', 'ch20_hero_variant_detail',
    'ch21_trust_signals', 'ch22_social_proof', 'ch23_content_depth', 'ch23_information_architecture',
    'ch24_breakpoint_strategy', 'ch25_typographic_scale', 'ch26_color_system', 'ch27_motion_choreography',
    'ch28_type_casing', 'ch29_physics_material', 'ch30_state', 'ch31_biomarker_geometry'
];

// L2 Ecosystem Genome: 12 chromosomes
const ECOSYSTEM_CHROMOSOME_REGISTRY = [
    'eco_ch1_biome', 'eco_ch2_energy', 'eco_ch3_symbiosis', 'eco_ch4_trophic',
    'eco_ch5_succession', 'eco_ch6_adaptation', 'eco_ch7_population', 'eco_ch8_temporal',
    'eco_ch9_spatial', 'eco_ch10_capacity', 'eco_ch11_mutation', 'eco_ch12_expressiveness'
];

// L3 Civilization Genome: 16 chromosomes  
const CIVILIZATION_CHROMOSOME_REGISTRY = [
    'civ_ch1_archetype', 'civ_ch2_governance', 'civ_ch3_economics', 'civ_ch4_technology',
    'civ_ch5_culture', 'civ_ch6_resilience', 'civ_ch7_knowledge', 'civ_ch8_expansion',
    'civ_ch9_age', 'civ_ch10_fragility', 'civ_ch11_topology', 'civ_ch12_cosmos',
    'civ_ch13_memory', 'civ_ch14_interface', 'civ_ch15_evolution', 'civ_ch16_communication'
];

// Total: 60 chromosomes across 3 layers
const TOTAL_CHROMOSOMES = CHROMOSOME_REGISTRY.length + ECOSYSTEM_CHROMOSOME_REGISTRY.length + CIVILIZATION_CHROMOSOME_REGISTRY.length;

function createChromosomeAccessTracker(genome: any): {
    track: (chromosome: string) => void;
    getReport: () => { used: string[]; unused: string[]; utilizationRate: number; warning: string | null };
} {
    const accessed = new Set<string>();
    
    return {
        track: (chromosome: string) => {
            accessed.add(chromosome);
        },
        getReport: () => {
            const used = Array.from(accessed);
            const unused = CHROMOSOME_REGISTRY.filter(ch => !accessed.has(ch));
            const utilizationRate = Math.round((used.length / CHROMOSOME_REGISTRY.length) * 100);
            
            let warning: string | null = null;
            if (utilizationRate < 50) {
                warning = `CRITICAL: Only ${utilizationRate}% of L1 chromosomes used. You MUST read and apply all 32 chromosomes.`;
            } else if (utilizationRate < 80) {
                warning = `WARNING: ${utilizationRate}% L1 chromosome utilization. Aim for 90%+ by checking: ${unused.slice(0, 5).join(', ')}${unused.length > 5 ? '...' : ''}`;
            }
            
            return { used, unused, utilizationRate, warning };
        }
    };
}

function createEcosystemChromosomeTracker(): {
    track: (chromosome: string) => void;
    getReport: () => { used: string[]; unused: string[]; utilizationRate: number; warning: string | null };
} {
    const accessed = new Set<string>();
    
    return {
        track: (chromosome: string) => {
            accessed.add(chromosome);
        },
        getReport: () => {
            const used = Array.from(accessed);
            const unused = ECOSYSTEM_CHROMOSOME_REGISTRY.filter(ch => !accessed.has(ch));
            const utilizationRate = Math.round((used.length / ECOSYSTEM_CHROMOSOME_REGISTRY.length) * 100);
            
            let warning: string | null = null;
            if (utilizationRate < 50) {
                warning = `CRITICAL: Only ${utilizationRate}% of L2 ecosystem chromosomes used. You MUST compose organisms following microbial→flora→fauna hierarchy using all 12 chromosomes.`;
            } else if (utilizationRate < 80) {
                warning = `WARNING: ${utilizationRate}% L2 chromosome utilization. Check unused: ${unused.slice(0, 3).join(', ')}${unused.length > 3 ? '...' : ''}`;
            }
            
            return { used, unused, utilizationRate, warning };
        }
    };
}

function createCivilizationChromosomeTracker(): {
    track: (chromosome: string) => void;
    getReport: () => { used: string[]; unused: string[]; utilizationRate: number; warning: string | null };
} {
    const accessed = new Set<string>();
    
    return {
        track: (chromosome: string) => {
            accessed.add(chromosome);
        },
        getReport: () => {
            const used = Array.from(accessed);
            const unused = CIVILIZATION_CHROMOSOME_REGISTRY.filter(ch => !accessed.has(ch));
            const utilizationRate = Math.round((used.length / CIVILIZATION_CHROMOSOME_REGISTRY.length) * 100);
            
            let warning: string | null = null;
            if (utilizationRate < 50) {
                warning = `CRITICAL: Only ${utilizationRate}% of L3 civilization chromosomes used. Architecture implementation requires all 16 chromosomes (governance, knowledge, expansion, etc.).`;
            } else if (utilizationRate < 80) {
                warning = `WARNING: ${utilizationRate}% L3 chromosome utilization. Check unused: ${unused.slice(0, 3).join(', ')}${unused.length > 3 ? '...' : ''}`;
            }
            
            return { used, unused, utilizationRate, warning };
        }
    };
}

// Combined tracker for all 3 layers
function createFullGenomeTracker(genome: any, ecosystemGenome?: any, civilizationGenome?: any): {
    trackL1: (chromosome: string) => void;
    trackL2: (chromosome: string) => void;
    trackL3: (chromosome: string) => void;
    getFullReport: () => { 
        L1: any; L2: any; L3: any; 
        totalUsed: number; 
        totalAvailable: number;
        overallRate: number;
        layerWarning: string | null;
    };
} {
    const l1 = createChromosomeAccessTracker(genome);
    const l2 = ecosystemGenome ? createEcosystemChromosomeTracker() : null;
    const l3 = civilizationGenome ? createCivilizationChromosomeTracker() : null;
    
    return {
        trackL1: (ch: string) => l1.track(ch),
        trackL2: (ch: string) => l2?.track(ch),
        trackL3: (ch: string) => l3?.track(ch),
        getFullReport: () => {
            const r1 = l1.getReport();
            const r2 = l2?.getReport() ?? { used: [], unused: [], utilizationRate: 0, warning: null };
            const r3 = l3?.getReport() ?? { used: [], unused: [], utilizationRate: 0, warning: null };
            
            const totalUsed = r1.used.length + r2.used.length + r3.used.length;
            const totalAvailable = CHROMOSOME_REGISTRY.length + 
                (ecosystemGenome ? ECOSYSTEM_CHROMOSOME_REGISTRY.length : 0) + 
                (civilizationGenome ? CIVILIZATION_CHROMOSOME_REGISTRY.length : 0);
            const overallRate = Math.round((totalUsed / totalAvailable) * 100);
            
            let layerWarning: string | null = null;
            if (r1.warning || r2.warning || r3.warning) {
                layerWarning = [r1.warning, r2.warning, r3.warning].filter(Boolean).join(' | ');
            }
            
            return { L1: r1, L2: r2, L3: r3, totalUsed, totalAvailable, overallRate, layerWarning };
        }
    };
}

// ── Security Configuration (environment-overrideable) ───────────────────────
const SECURITY_CONFIG = {
    // Maximum file size for brand assets (default: 50MB, env overrideable)
    maxAssetSizeBytes: parseInt(process.env.PERMUTATIONS_MAX_ASSET_SIZE_MB || "50", 10) * 1024 * 1024,
    // Maximum number of assets to process (default: 10)
    maxAssetCount: parseInt(process.env.PERMUTATIONS_MAX_ASSET_COUNT || "10", 10),
    // Allowed file extensions for assets
    allowedAssetExtensions: (process.env.PERMUTATIONS_ALLOWED_ASSET_EXTENSIONS || ".png,.jpg,.jpeg,.svg,.pdf").split(",").map(s => s.trim().toLowerCase()),
};

// ── Ecosystem biomes: hash-selectable structural character per tier ─────────
// Different seeds at same tier get different biome characters.
// Intent + sector constrain which branches are valid; the hash picks the branch.
const ECOSYSTEM_BIOMES: Record<string, string[]> = {
    prokaryotic:        ['iron-oxidizing', 'sulfur-reducing', 'methane-producing', 'nitrifying', 'photosynthetic'],
    protist:            ['predatory', 'symbiotic', 'colonial', 'parasitic', 'chemosynthetic'],
    bryophyte:          ['xeric', 'hydric', 'lithophytic', 'epiphytic', 'volcanic'],
    vascular_flora:     ['rainforest', 'desert', 'alpine', 'mangrove', 'riparian'],
    invertebrate_fauna: ['coral-reef', 'deep-sea', 'tidal-pool', 'cave', 'thermophilic'],
    ectotherm_fauna:    ['savanna', 'wetland', 'volcanic', 'temperate', 'island'],
    endotherm_fauna:    ['arctic', 'tropical', 'montane', 'grassland', 'boreal'],
};

// Civilization archetypes: hash-selectable civilizational character per tier
const CIVILIZATION_ARCHETYPES: Record<string, string[]> = {
    tribal:       ['totemic', 'shamanistic', 'nomadic', 'warrior', 'maritime'],
    city_state:   ['mercantile', 'theocratic', 'democratic', 'scholarly', 'militaristic'],
    nation_state: ['industrial', 'maritime', 'agrarian', 'federated', 'bureaucratic'],
    empire:       ['colonial', 'theological', 'scientific', 'mercantile', 'maritime'],
    network:      ['distributed', 'federated', 'mesh', 'autonomous', 'quantum'],
    singularity:  ['convergent', 'transcendent', 'recursive', 'emergent', 'metamorphic'],
};

// Archetype context: character description passed to LLM component naming
const ARCHETYPE_CONTEXT: Record<string, string> = {
    totemic:      'each component embodies a symbol — bold, iconic, each has ritual significance',
    shamanistic:  'components feel organic and liminal, as if channeling invisible forces',
    nomadic:      'lightweight and portable — each component is self-contained, context-independent',
    warrior:      'bold and direct — components are tools for action, not decoration',
    maritime:     'navigational and fluid — components follow wave-like rhythm and flow',
    mercantile:   'transactional and efficient — every component serves exchange above all',
    theocratic:   'hierarchical and reverent — components follow sacred prescribed arrangement',
    democratic:   'egalitarian and accessible — every component has equal voice and visibility',
    scholarly:    'annotated and referenced — components carry their reasoning',
    militaristic: 'ordered and ranked — components follow strict command hierarchy',
    industrial:   'modular and mass-produced — components are interchangeable precision parts',
    agrarian:     'seasonal and cyclical — components grow and harvest data in structured patterns',
    federated:    'autonomous regions that agree on shared protocols — loosely coupled modules',
    bureaucratic: 'process-driven and documented — every component has a form and a procedure',
    colonial:     'expansionist — components aggressively capture and route data across surfaces',
    theological:  'doctrine-driven — components serve a higher purpose with ceremonial weight',
    scientific:   'empirical and hypothesis-driven — components measure, test, and log results',
    distributed:  'no center of gravity — every node is both producer and consumer',
    mesh:         'fully connected — every component can communicate with every other component',
    autonomous:   'self-organizing — components make independent decisions, emergent behavior',
    quantum:      'superposition — components exist in multiple contexts and states simultaneously',
    convergent:   'all systems merge into a unified intelligence substrate',
    transcendent: 'components operate beyond conventional UI paradigms',
    recursive:    'components that generate themselves — infinitely self-referential',
    emergent:     'no single designer — the system design emerges from component interactions',
    metamorphic:  'components morph between states, forms, and contexts continuously',
};

// Biome context: character description passed to LLM organism naming
const BIOME_CONTEXT: Record<string, string> = {
    'iron-oxidizing':  'metallic and structural — catalyzes heavy data transformation',
    'sulfur-reducing': 'reductive — simplifies and distills complex inputs to essentials',
    'methane-producing':'generative — produces outputs from minimal raw inputs',
    'nitrifying':      'enriching — adds metadata, context, and structure to raw data',
    'photosynthetic':  'light-converting — captures ambient signals and renders them visible',
    'predatory':       'aggressive data consumers — hunts and captures information from the surface',
    'symbiotic':       'co-dependent — components only reach full function in relationship',
    'colonial':        'aggregate — gains power and capability by clustering',
    'parasitic':       'dependent — attaches to and draws capability from host systems',
    'chemosynthetic':  'energy from reactions — transforms one data type to another',
    'xeric':           'adapted to scarcity — minimal and efficient with sparse data',
    'hydric':          'water-adapted — fluid and overflow-friendly with abundant data',
    'lithophytic':     'rock-clinging — permanent structural anchors that never move',
    'epiphytic':       'surface-dwelling — attaches to and enhances other components',
    'volcanic':        'intense and high-energy — handles bursts, spikes, and eruption-scale events',
    'rainforest':      'dense and layered — stratified with canopy and understory hierarchy',
    'desert':          'sparse and resilient — minimal components that survive extreme scarcity',
    'alpine':          'high-altitude — adapted for extreme edge cases and boundary conditions',
    'mangrove':        'boundary-dwelling — bridges two different data environments',
    'riparian':        'stream-adjacent — lives at the edge of data flow, filters and routes',
    'coral-reef':      'symbiotic colony — builds on others in dense colorful collaborative clusters',
    'deep-sea':        'pressure-adapted — works in low-information environments, bioluminescent outputs',
    'tidal-pool':      'periodic exposure — handles intermittent connectivity gracefully',
    'cave':            'light-independent — works without visual feedback, sensation-first',
    'thermophilic':    'heat-adapted — designed for high-throughput hot paths and sustained load',
    'savanna':         'open and visible — high visual surface area, clear spatial hierarchy',
    'wetland':         'filtration-focused — cleans, normalizes, and validates data streams',
    'temperate':       'balanced and seasonal — adapts between different usage contexts',
    'island':          'isolated and self-sufficient — works without external dependencies',
    'arctic':          'cold and efficient — conserves computational energy aggressively',
    'tropical':        'rich and abundant — high feature density and visual richness',
    'montane':         'high-altitude specialist — edge computing and altitude scenarios',
    'grassland':       'open-range and scalable — extends across flat wide information landscapes',
    'boreal':          'coniferous and structured — regular repeating tree-like component structure',
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
function ecoHashFromGenomeHash(genomeDnaHash: string): string {
    return crypto.createHash("sha256").update(genomeDnaHash).digest("hex");
}
function civHashFromEcoHash(ecosystemHash: string): string {
    return crypto.createHash("sha256").update(ecosystemHash).digest("hex");
}
function hashByte(hexHash: string, bytePos: number, modulo: number): number {
    return parseInt(hexHash.slice(bytePos * 2, bytePos * 2 + 2), 16) % modulo;
}

/** Maps ecosystem complexity to the appropriate biological tier key for biome lookup */
function ecosystemTierKey(complexity: number): string {
    if (complexity >= 0.74) return 'endotherm_fauna';
    if (complexity >= 0.66) return 'ectotherm_fauna';
    if (complexity >= 0.57) return 'invertebrate_fauna';
    if (complexity >= 0.45) return 'vascular_flora';
    if (complexity >= 0.34) return 'bryophyte';
    if (complexity >= 0.23) return 'protist';
    return 'prokaryotic';
}

class DesignGenomeServer {
    private server: Server;
    private extractor: SemanticTraitExtractor;
    private sequencer: GenomeSequencer;
    private cssGen: CSSGenerator;

    private webglGen: WebGLGenerator;
    private fxGen: FXGenerator;
    private svgGen: SVGGenerator;
    private epigeneticParser: EpigeneticParser;
    private patternDetector: PatternDetector;

    private civilizationGen: CivilizationGenerator;
    private complexityAnalyzer: ComplexityAnalyzer;

    /**
     * Validates and sanitizes asset file paths for security.
     * Returns null for invalid paths (rejected, not errors).
     * Configurable via environment variables - no hardcoded limits.
     */
    private validateAssetPath(inputPath: string): string | null {
        // Reject paths with directory traversal attempts
        const normalized = path.normalize(inputPath);
        if (normalized.includes('..')) {
            console.warn(`[Security] Rejected path with traversal: ${inputPath}`);
            return null;
        }
        
        // Validate extension
        const ext = path.extname(normalized).toLowerCase();
        if (!SECURITY_CONFIG.allowedAssetExtensions.includes(ext)) {
            console.warn(`[Security] Rejected file with invalid extension: ${inputPath}`);
            return null;
        }
        
        // Validate file exists and check size (configurable limit)
        try {
            const stats = fsSync.statSync(normalized);
            if (!stats.isFile()) {
                console.warn(`[Security] Rejected non-file path: ${inputPath}`);
                return null;
            }
            if (stats.size > SECURITY_CONFIG.maxAssetSizeBytes) {
                console.warn(`[Security] Rejected file too large: ${inputPath} (${stats.size} bytes > ${SECURITY_CONFIG.maxAssetSizeBytes})`);
                return null;
            }
        } catch {
            return null;
        }
        
        return normalized;
    }

    /**
     * Validates genome structure integrity.
     * Checks for required chromosomes and consistency.
     * Non-breaking: returns validation result without throwing.
     */
    private validateGenomeStructure(genome: any): { 
        valid: boolean; 
        errors: string[];
        warnings: string[];
    } {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        if (!genome || typeof genome !== 'object') {
            return { valid: false, errors: ['Genome is null or not an object'], warnings: [] };
        }
        
        // Check dnaHash
        if (!genome.dnaHash || typeof genome.dnaHash !== 'string') {
            errors.push('Missing or invalid dnaHash');
        }
        
        if (!genome.chromosomes || typeof genome.chromosomes !== 'object') {
            errors.push('Missing chromosomes object');
            return { valid: false, errors, warnings };
        }
        
        // Essential chromosome groups (not all 32, just critical ones for operation)
        const essentialChromosomes = [
            'ch1_structure', 'ch5_primary_color', 'ch6_color_temp',
            'ch7_edge', 'ch8_motion', 'ch9_grid', 'ch19_hero_type'
        ];
        
        for (const ch of essentialChromosomes) {
            if (!(ch in genome.chromosomes)) {
                warnings.push(`Missing chromosome: ${ch}`);
            }
        }
        
        // Validate hero type consistency if both chromosomes present
        const heroType = genome.chromosomes?.ch19_hero_type;
        const heroVariant = genome.chromosomes?.ch19_hero_variant_detail;
        if (heroType?.type && heroVariant?.layout) {
            const validLayouts: Record<string, string[]> = {
                product_ui: ['centered', 'split_right', 'full_bleed', 'floating_cards'],
                product_video: ['full_bleed', 'centered', 'overlay'],
                brand_logo: ['centered', 'minimal', 'asymmetric'],
                stats_counter: ['centered', 'split_left', 'floating_cards'],
                search_discovery: ['centered', 'full_bleed'],
                trust_authority: ['centered', 'split_left', 'split_right']
            };
            const valid = validLayouts[heroType.type];
            if (valid && !valid.includes(heroVariant.layout)) {
                warnings.push(`Unusual hero layout "${heroVariant.layout}" for type "${heroType.type}"`);
            }
        }
        
        return { valid: errors.length === 0, errors, warnings };
    }

    constructor() {
        this.server = new Server(
            { name: "permutations", version: PACKAGE_VERSION },
            { capabilities: { tools: {} } }
        );

        this.extractor = new SemanticTraitExtractor();
        this.sequencer = new GenomeSequencer();
        this.cssGen = new CSSGenerator();

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

    private setupHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: "generate_design_genome",
                    description: "STEP 1 — MANDATORY ENTRY POINT for every design task. Sequences a 32-chromosome design genome from natural language intent. CRITICAL: The complete genome object returned MUST be passed to ALL subsequent tools (generate_design_brief, validate_design, etc). Do NOT extract only dnaHash or traits. After calling this, you MUST write genome.json to disk before proceeding to any implementation. Returns CSS tokens, color system, typography, spacing, motion constraints, organism hierarchy (microbial/flora/fauna), and suggested_next workflow guide.",
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
                    description: "FINAL STEP — MANDATORY before shipping. Validates your implementation against the genome constraints. ENFORCEMENT: You MUST run this before claiming any task complete. Pass the COMPLETE genome object from generate_design_genome. Checks for: (1) slop patterns (gradients on text, bootstrap shadows, AI tells), (2) chromosome drift, (3) incomplete utilization. Returns violation list, slop score, and chromosome utilization rate.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            genome: { type: "object", description: "The design genome from generate_design_genome" },
                            css: { type: "string", description: "CSS code to validate" }
                        },
                        required: ["genome", "css"]
                    }
                },
                {
                    name: "generate_ecosystem",
                    description: "STEP 3 — REQUIRED for component libraries. Generates the organism hierarchy: microbial (atoms) → flora (composites) → fauna (complex). MANDATORY COMPOSITION RULE: You MUST build UI following this hierarchy — fauna contain flora, flora contain microbial. Pass genome.dnaHash as seed AND the full genome object as `genome`. Returns ecosystemGenome (L2) with organism counts, containment relationships, and library recommendations. NOT generated code — you implement from these specs.",
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
                    description: "STEP 2 — MANDATORY before writing ANY code. Synthesizes all genome layers into a design philosophy thesis. ENFORCEMENT: You MUST call this after generate_design_genome and BEFORE writing any HTML/CSS/JS. This produces the DESIGN_SYSTEM.md content that is your constitution for the entire build. Pass the COMPLETE genome object from generate_design_genome (not just dnaHash).",
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
                },
                {
                    name: "generate_creator_genome",
                    description: "L0 LAYER — Generate a 16-chromosome Creator Genome for simulated designer personas. This is the foundation of generative design DNA. Returns latent space coordinates that encode cultural background, aesthetic sensibility, cognitive patterns, and creative instincts. Use this when you want unique designer perspectives rather than template-based designs.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            seed: { type: "string", description: "Unique seed for deterministic genome generation" },
                            intent: { type: "string", description: "Optional design intent to influence the creator's personality" }
                        },
                        required: ["seed"]
                    }
                },
                {
                    name: "generate_persona",
                    description: "L0.5 LAYER — Decode a Creator Genome into a simulated designer persona using LLM. Returns a complete creative personality with biography, design instincts, worldview, and contradictions. Each persona has a unique voice (e.g., 'whispered forest diaries', 'Forged industrial poetry') that influences their design approach.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            genome: { type: "object", description: "The Creator Genome from generate_creator_genome" }
                        },
                        required: ["genome"]
                    }
                },
                {
                    name: "generate_design_through_persona",
                    description: "L0→L1 BRIDGE — Complete pipeline: Creator Persona interprets Design Intent to generate L1 Design Genome. The persona's traits (chaos tolerance, aesthetic sensibility, cognitive style) directly influence the resulting design system. Returns both the persona, creative brief, and the L1 genome.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            genome: { type: "object", description: "Creator Genome (or will generate new one if omitted)" },
                            intent: { type: "string", description: "Design intent description" },
                            sector: { type: "string", description: "Sector (healthcare, fintech, etc)" }
                        },
                        required: ["intent"]
                    }
                }
            ]
        }));

        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const args = request.params.arguments as any;

            // === Input Validation Helpers ===
            const validateArgs = (
                fields: { name: string; required: boolean; maxLength?: number }[]
            ) => {
                for (const field of fields) {
                    const val = args[field.name];
                    if (field.required && (val === undefined || val === null || val === "")) {
                        throw new McpError(
                            ErrorCode.InvalidParams,
                            `Missing required parameter: '${field.name}'`
                        );
                    }
                    if (val !== undefined && typeof val === "string" && field.maxLength && val.length > field.maxLength) {
                        throw new McpError(
                            ErrorCode.InvalidParams,
                            `Parameter '${field.name}' exceeds maximum length of ${field.maxLength} characters`
                        );
                    }
                }
            };
            const sanitize = (s: string): string => s.trim().replace(/\0/g, "");

            try {
                switch (request.params.name) {
                    case "generate_design_genome": {
                        validateArgs([
                            { name: "intent", required: true, maxLength: 32_768 },
                            { name: "seed", required: true, maxLength: 256 },
                            { name: "project_context", required: false, maxLength: 16_384 },
                            { name: "creator_seed", required: false, maxLength: 256 },
                            { name: "skip_creator_dna", required: false },
                        ]);
                        const intent = sanitize(args.intent);
                        const seed = sanitize(args.seed);
                        const context = args.project_context ? sanitize(args.project_context) : undefined;
                        const skipCreatorDNA = args.skip_creator_dna === true;

                        // === L0 CREATOR DNA LAYER (Optional but Recommended) ===
                        // Generates a unique designer persona that interprets the intent
                        let creatorGenome = undefined;
                        let creatorPersona = undefined;
                        let creativeBrief = undefined;
                        
                        if (!skipCreatorDNA) {
                            try {
                                // Import L0/L0.5 modules dynamically to avoid circular deps
                                const { generateCreatorGenome } = await import("./creator/generator.js");
                                const { generatePersona, generateBrief } = await import("./brief/generator.js");
                                
                                // L0: Generate Creator Genome from seed
                                const creatorSeed = args.creator_seed || `creator-${seed}-${Date.now()}`;
                                creatorGenome = generateCreatorGenome(creatorSeed);
                                
                                // L0.5: Decode into persona via LLM
                                creatorPersona = await generatePersona(creatorGenome);
                                
                                // L0.75: Generate creative brief (persona interprets intent)
                                creativeBrief = await generateBrief(creatorPersona, {
                                    description: intent,
                                    sector: context || 'technology',
                                    mood_hints: [],
                                });
                            } catch (err) {
                                // Log but don't fail - L1 can still generate without L0
                                console.error("L0 Creator DNA generation failed (continuing without):", err);
                            }
                        }

                        // 1. Epigenetic Parsing (if assets provided)
                        let epigeneticData = undefined;
                        if (args.brand_asset_paths && Array.isArray(args.brand_asset_paths) && args.brand_asset_paths.length > 0) {
                            // Validate and filter paths (security + configurability)
                            const validatedPaths = args.brand_asset_paths
                                .slice(0, SECURITY_CONFIG.maxAssetCount)
                                .map((p: string) => this.validateAssetPath(p))
                                .filter((p: string | null): p is string => p !== null);
                            
                            if (validatedPaths.length > 0) {
                                epigeneticData = await this.epigeneticParser.parseAssets(validatedPaths);
                            }
                        }

                        // 2. Semantic Extraction (single LLM call: traits + sector + archetype + copy intelligence)
                        const finalContext = creativeBrief?.concept?.statement || epigeneticData?.brandContext || context;
                        const analysis = await this.extractor.analyze(intent, finalContext);
                        const traits = analysis.traits;
                        const detectedSector = analysis.sector.primary as any;
                        const copyIntelligence = analysis.copyIntelligence;
                        const copy = analysis.copy;
                        const structural = analysis.structural;

                        // 3. L0 → L1 Bridge: Apply persona influence to traits if available
                        let influencedTraits = traits;
                        let personaInfluence = undefined;
                        if (creatorPersona && creativeBrief) {
                            try {
                                const { PersonaDesignBridge } = await import("./bridge/persona-to-design.js");
                                const bridge = new PersonaDesignBridge();
                                personaInfluence = bridge.calculateInfluence(creatorPersona, creativeBrief);
                                
                                // Apply influence to traits
                                influencedTraits = {
                                    ...traits,
                                    informationDensity: bridge.clamp(traits.informationDensity + (personaInfluence.densityMod || 0)),
                                    emotionalTemperature: bridge.clamp(traits.emotionalTemperature + (personaInfluence.saturationMod || 0)),
                                    playfulness: bridge.clamp((personaInfluence.motionSpeedMod || 1) - 0.8),
                                };
                            } catch (err) {
                                console.error("L0→L1 bridge failed (using original traits):", err);
                            }
                        }

                        // 4. DNA Sequencing (pass copy intelligence + LLM copy to sequencer)
                        const genome = this.sequencer.generate(seed, influencedTraits, {
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

                        // 6. CSS (always generated) - with persona influence if available
                        const css = this.cssGen.generate(genome, { 
                            format: "expanded",
                            personaInfluence: personaInfluence ? {
                                hueShift: personaInfluence.hueShift,
                                saturationMod: personaInfluence.saturationMod,
                                lightnessMod: personaInfluence.lightnessMod,
                                densityMod: personaInfluence.densityMod,
                                whitespaceMod: personaInfluence.whitespaceMod,
                                radiusMod: personaInfluence.radiusMod,
                                elevationMod: personaInfluence.elevationMod,
                                trackingMod: personaInfluence.trackingMod,
                                physicsStyle: personaInfluence.physicsStyle,
                                copyTone: personaInfluence.copyTone,
                                metaphorPrimary: personaInfluence.metaphorPrimary,
                            } : undefined
                        });
                        const webglComponents = this.webglGen.generateR3F(genome);
                        const fxAtmosphere = this.fxGen.generateCSSClass(genome);

                        // LLM-driven biomarker — unique mark synthesized from chromosome combination
                        const svgBiomarker = await this.svgGen.generateBiomarker(
                            genome,
                            this.extractor.callText.bind(this.extractor)
                        );

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
                        const stateTopology = (genome.chromosomes as any).ch30_state?.topology ?? "local";
                        const stateLibrarySelection = selectStateLibrary(stateTopology, complexityResult.finalComplexity);

                        // Chromosome-driven styling system selection
                        // Uses eco_ch12_expressiveness personality (if ecosystem ran) + edge style
                        const edgeStyle = genome.chromosomes.ch7_edge?.style ?? "soft";
                        // Personality resolved later when ecosystem data is available; use complexity proxy for now
                        const personalityProxy = complexityResult.finalComplexity > 0.75 ? "expressive"
                            : complexityResult.finalComplexity > 0.50 ? "bold"
                            : complexityResult.finalComplexity > 0.30 ? "balanced"
                            : "corporate";
                        const stylingLibrarySelection = selectStylingLibrary(
                            personalityProxy, edgeStyle, complexityResult.finalComplexity
                        );

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

                        let ecosystemOutput: unknown | undefined;
                        let civilizationOutput: unknown | undefined;

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
                                        flora:     eco.organisms.flora.length,
                                        fauna:     eco.organisms.fauna.length,
                                        total:     eco.organisms.total
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
                                civilizationGap: parseFloat(
                                    Math.max(0, 0.81 - eco.evolution.complexity).toFixed(3)
                                )
                            };

                            // Civilization emerges from ecosystem when complexity crosses tribal (0.81)
                            if (finalComplexity >= 0.81) {
                                try {
                                    const civTier = this.civilizationGen.generate(
                                        intent, finalContext ?? "", traits, genome
                                    );
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
                                        ...generateCivilizationOutput(
                                            civTier, archetypedGenome2, archetypedCss2, undefined, allOrganisms
                                        )
                                    };
                                } catch (err) {
                                    // Log error for debugging but continue - ecosystem output is still valid
                                    console.error('[Civilization] Generation failed:', err instanceof Error ? err.message : String(err));
                                }
                            }
                        }

                        // 8. Auto pattern detection on generated output
                        const patternViolations = this.patternDetector.detectInGenome(
                            genome as any,
                            css,
                            ""
                        );
                        const patternReport = this.patternDetector.generateReport(patternViolations);

                        const genome_report = this.buildGenomeReport(genome, {
                            intent,
                            seed,
                            sector: detectedSector,
                            complexity: finalComplexity,
                            tier: String(tier),
                            traits
                        });

                        // Initialize chromosome access tracker for this genome
                        const chromosomeTracker = createChromosomeAccessTracker(genome);
                        // Track essential chromosomes that are directly used in this function
                        chromosomeTracker.track('ch5_color_primary');
                        chromosomeTracker.track('ch6_color_temp');
                        chromosomeTracker.track('ch7_edge');
                        chromosomeTracker.track('ch8_motion');
                        chromosomeTracker.track('ch19_hero_type');
                        chromosomeTracker.track('ch3_type_display');
                        chromosomeTracker.track('ch4_type_body');
                        const initialUtilization = chromosomeTracker.getReport();

                        const suggested_next = [
                            // ── CRITICAL CHECKPOINTS — DO NOT SKIP ─────────────────────
                            {
                                action: "CHECKPOINT",
                                type: "mandatory_prerequisite",
                                name: "genome.json",
                                instruction: "WRITE THIS FILE BEFORE ANYTHING ELSE. Save the `genome` field as JSON to genome.json in the project root. ALL subsequent tools require this exact genome object.",
                                enforcement: "You CANNOT proceed to generate_design_brief, validate_design, or any implementation without writing genome.json first.",
                                always: true,
                                blocking: true
                            },
                            {
                                action: "CHECKPOINT",
                                type: "mandatory_prerequisite",
                                name: "chromosome_verification",
                                instruction: "Verify you have accessed ALL 32 chromosomes. Check `chromosome_utilization.checklist` — every chromosome marked 'NOT YET ACCESSED' must be read and applied in your implementation.",
                                enforcement: "Implementation with < 80% chromosome utilization will fail validation.",
                                always: true,
                                blocking: true
                            },
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
                                file: "public/biomarker.svg",
                                field: "svgBiomarker",
                                instruction: "Write the `svgBiomarker` field to public/biomarker.svg (or src/assets/biomarker.svg). This is the unique visual identity mark for this genome.",
                                always: true
                            },
                            // ── Tools to call next ────────────────────────────────────
                            {
                                tool: "generate_design_brief",
                                pass: "genome (COMPLETE object, not just dnaHash) + ecosystemOutput.ecosystemGenome (if present) + civilizationOutput.civilizationGenome (if present)",
                                reason: "LLM synthesizes all genome layers into a design philosophy thesis + DESIGN_SYSTEM.md. Call this BEFORE writing ANY code.",
                                enforcement: "MANDATORY — You cannot implement without understanding the design philosophy.",
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
                                    // L0 CREATOR DNA — The generative foundation
                                    // Simulated designer who interprets the intent through their unique worldview
                                    creatorDNA: creatorGenome ? {
                                        genome: creatorGenome,
                                        persona: creatorPersona ? {
                                            id: creatorPersona.id,
                                            biography: creatorPersona.biography,
                                            instincts: creatorPersona.instincts,
                                            worldview: creatorPersona.worldview,
                                            creative_behavior: creatorPersona.creative_behavior,
                                        } : undefined,
                                        brief: creativeBrief ? {
                                            concept: creativeBrief.concept,
                                            metaphor_system: creativeBrief.metaphor_system,
                                            design_principles: creativeBrief.design_principles,
                                            component_language: creativeBrief.component_language,
                                        } : undefined,
                                        persona_influence: personaInfluence || undefined,
                                    } : undefined,
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
                                    genome_report,
                                    chromosome_utilization: {
                                        ...initialUtilization,
                                        critical_note: "You MUST use ALL 32 chromosomes when implementing. Check the genome.chromosomes object and apply every single one. Low utilization indicates incomplete implementation.",
                                        all_chromosomes: CHROMOSOME_REGISTRY,
                                        checklist: CHROMOSOME_REGISTRY.reduce((acc, ch) => {
                                            acc[ch] = initialUtilization.used.includes(ch) ? "✓ USED" : "⚠ NOT YET ACCESSED";
                                            return acc;
                                        }, {} as Record<string, string>)
                                    }
                                }, null, 2)
                            }]
                        };
                    }


                    case "validate_design": {
                        if (!args.genome || !args.css) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing genome or css");
                        }

                        validateGenome(args.genome, "validate_design");

                        // Chromosome utilization check
                        const tracker = createChromosomeAccessTracker(args.genome);
                        // Analyze CSS for chromosome indicators
                        const cssLower = args.css.toLowerCase();
                        if (cssLower.includes('border-radius') || cssLower.includes('rounded')) tracker.track('ch7_edge');
                        if (cssLower.includes('animation') || cssLower.includes('transition')) tracker.track('ch8_motion');
                        if (cssLower.includes('grid') || cssLower.includes('flex')) tracker.track('ch9_grid');
                        if (cssLower.includes('shadow') || cssLower.includes('box-shadow')) tracker.track('ch16_shadow');
                        if (cssLower.includes('z-index') || cssLower.includes('layer')) tracker.track('ch13_z_index');
                        if (cssLower.includes('var(--color') || cssLower.includes('color:')) tracker.track('ch5_color_primary');
                        if (cssLower.includes('font-family') || cssLower.includes('font-size')) tracker.track('ch3_type_display');
                        
                        const utilizationReport = tracker.getReport();

                        // Pattern/slop detection
                        const violations = this.patternDetector.detectInGenome(
                            args.genome,
                            args.css,
                            args.html
                        );

                        // Genome structure validation (new - doesn't break existing)
                        const structureValidation = this.validateGenomeStructure(args.genome);

                        const report = this.patternDetector.generateReport(violations);
                        const patternValid = violations.filter(v => v.severity === "error").length === 0;
                        const overallValid = patternValid && structureValidation.valid && utilizationReport.utilizationRate >= 30; // Minimum threshold

                        return {
                            content: [{
                                type: "text",
                                text: JSON.stringify({
                                    valid: overallValid,
                                    pattern_valid: patternValid,
                                    structure_valid: structureValidation.valid,
                                    structure_warnings: structureValidation.warnings,
                                    structure_errors: structureValidation.errors,
                                    chromosome_utilization: {
                                        layer: "L1_Design",
                                        rate: utilizationReport.utilizationRate,
                                        used: utilizationReport.used.length,
                                        total: CHROMOSOME_REGISTRY.length,
                                        warning: utilizationReport.warning,
                                        unused_chromosomes: utilizationReport.unused.slice(0, 10),
                                        recommendation: utilizationReport.utilizationRate < 50 
                                            ? "CRITICAL: Your implementation uses less than 50% of L1 chromosomes. Review genome.chromosomes and apply ALL 32 values."
                                            : utilizationReport.utilizationRate < 80
                                                ? "WARNING: L1 chromosome utilization below 80%. Check unused chromosomes and incorporate them."
                                                : "Good L1 chromosome utilization.",
                                        note: "Full genome = 60 chromosomes: L1 (32) + L2 Ecosystem (12) + L3 Civilization (16). Validate L2/L3 via their respective tool outputs."
                                    },
                                    violations,
                                    report,
                                    slop_score: violations.length,
                                    enforcement: {
                                        must_fix_before_ship: [
                                            ...(structureValidation.errors.length > 0 ? ['Fix genome structure errors'] : []),
                                            ...(patternValid ? [] : ['Fix pattern violations (gradients on text, bootstrap shadows, etc.)']),
                                            ...(utilizationReport.utilizationRate < 30 ? ['Increase chromosome utilization above 30%'] : [])
                                        ],
                                        blockers_count: (structureValidation.errors.length) + (patternValid ? 0 : 1) + (utilizationReport.utilizationRate < 30 ? 1 : 0)
                                    }
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
                        let ecoTraits: any;
                        let ecoSector: string = "technology";
                        try {
                            const ecoAnalysis = await this.extractor.analyze(args.intent, context);
                            ecoTraits = ecoAnalysis.traits;
                            ecoSector = ecoAnalysis.sector?.primary || "technology";
                        } catch {
                            // Offline fallback
                            ecoTraits = await this.extractor.extractTraits(args.intent, context);
                        }

                        // Estimate organism counts from traits to size the LLM naming call.
                        // Uses informationDensity as a proxy for complexity — close enough
                        // for the naming call; exact counts are genome-derived inside the generator.
                        const ecoComplexityProxy = Math.max(0,
                            (ecoTraits.informationDensity ?? 0.5) * 0.6 +
                            (ecoTraits.trustRequirement  ?? 0.5) * 0.2 +
                            (ecoTraits.spatialDependency  ?? 0.5) * 0.2
                        );
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
                        const organismsDefinition = await this.extractor.analyzeOrganisms(
                            args.intent, ecoSector, estimatedCounts, ecoBiomeContext
                        );

                        // Validate existing genome if provided
                        if (args.genome) {
                            validateGenome(args.genome, "generate_ecosystem (existingGenome)");
                        }

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

                        // L2 Chromosome utilization tracking
                        const ecoTracker = createEcosystemChromosomeTracker();
                        // Track chromosomes that are accessed in library selection
                        ecoTracker.track('eco_ch1_biome');
                        ecoTracker.track('eco_ch2_energy');
                        ecoTracker.track('eco_ch3_symbiosis');
                        ecoTracker.track('eco_ch4_trophic');
                        ecoTracker.track('eco_ch5_succession');
                        ecoTracker.track('eco_ch6_adaptation');
                        ecoTracker.track('eco_ch7_population');
                        ecoTracker.track('eco_ch8_temporal');
                        ecoTracker.track('eco_ch9_spatial');
                        ecoTracker.track('eco_ch10_capacity');
                        ecoTracker.track('eco_ch11_mutation');
                        ecoTracker.track('eco_ch12_expressiveness');
                        const l2Utilization = ecoTracker.getReport();

                        const organismSelection = selectOrganismLibrary({
                            edgeStyle:    genomeChromosomes.ch7_edge.style,
                            motionPhysics: genomeChromosomes.ch8_motion.physics,
                            succession:   ecoChromosomes.eco_ch5_succession.stage,
                            symbiosis:    ecoChromosomes.eco_ch3_symbiosis.pattern,
                            trophic:      ecoChromosomes.eco_ch4_trophic.structure,
                            population:   ecoChromosomes.eco_ch7_population.pattern,
                            biome:        ecoChromosomes.eco_ch1_biome.class,
                            adaptation:   ecoChromosomes.eco_ch6_adaptation.axis,
                            personality:  ecoChromosomes.eco_ch12_expressiveness.personality,
                            hasFauna,
                        });

                        const interactionSelection = selectInteractionLibraries({
                            motionPhysics:    genomeChromosomes.ch8_motion.physics,
                            trophic:          ecoChromosomes.eco_ch4_trophic.structure,
                            population:       ecoChromosomes.eco_ch7_population.pattern,
                            succession:       ecoChromosomes.eco_ch5_succession.stage,
                            adaptation:       ecoChromosomes.eco_ch6_adaptation.axis,
                            energy:           ecoChromosomes.eco_ch2_energy.source,
                            symbiosis:        ecoChromosomes.eco_ch3_symbiosis.pattern,
                            personality:      ecoChromosomes.eco_ch12_expressiveness.personality,
                            hasFauna,
                            hasDataHeavyFauna,
                        });

                        const chartSelection = selectChartLibrary({
                            edgeStyle:      genomeChromosomes.ch7_edge.style,
                            motionPhysics:  genomeChromosomes.ch8_motion.physics,
                            complexityScore: ecosystem.evolution.complexity,
                            adaptation:     ecoChromosomes.eco_ch6_adaptation.axis,
                            trophic:        ecoChromosomes.eco_ch4_trophic.structure,
                            succession:     ecoChromosomes.eco_ch5_succession.stage,
                            energy:         ecoChromosomes.eco_ch2_energy.source,
                            biome:          ecoChromosomes.eco_ch1_biome.class,
                            personality:    ecoChromosomes.eco_ch12_expressiveness.personality,
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
                            ...ecosystem.organisms.microbial.map(o =>
                                `- **${o.name}** (${o.id}) — ${o.purpose || `color: ${o.characteristics.colorTreatment}`}`),
                            ``,
                            `### Flora (composite components) — ${ecosystem.organisms.flora.length}`,
                            ...ecosystem.organisms.flora.map(o =>
                                `- **${o.name}** (${o.id}) — ${o.purpose || `motion: ${o.characteristics.motionStyle}`}`),
                            ``,
                            `### Fauna (complex components) — ${ecosystem.organisms.fauna.length}`,
                            ...ecosystem.organisms.fauna.map(o =>
                                `- **${o.name}** (${o.id}) — ${o.purpose || `entropy: ${o.adaptation.entropy.toFixed(2)}`}`),
                            ``,
                            `## Containment Map`,
                            ...ecosystem.relationships.filter((r: any) => r.type === "containment").slice(0, 10).map((r: any) => `- **${r.organisms[0]}** → contains → **${r.organisms[1]}** (pattern: ${r.pattern})`),
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
                                        },
                                        navigation: ecosystem.navigation
                                    },
                                    sharedGenome: ecosystem.environment.genome,
                                    biome: ecoBiome,
                                    biomeDescription: ecoBiomeDesc,
                                    css,
                                    libraries: {
                                        organism: {
                                            primary:       { name: organismSelection.primary.name,     package: organismSelection.primary.package,     philosophy: organismSelection.primary.philosophy,     installCmd: organismSelection.primary.installCmd,     importExample: organismSelection.primary.importExample,     combinableWith: organismSelection.primary.combinableWith },
                                            alternative:   { name: organismSelection.alternative.name, package: organismSelection.alternative.package, philosophy: organismSelection.alternative.philosophy, installCmd: organismSelection.alternative.installCmd, importExample: organismSelection.alternative.importExample, combinableWith: organismSelection.alternative.combinableWith },
                                            also_consider: organismSelection.also_consider.map(l => ({ name: l.name, package: l.package, philosophy: l.philosophy })),
                                        },
                                        interaction: {
                                            primary:       { name: interactionSelection.primary.name,     package: interactionSelection.primary.package,     domain: interactionSelection.primary.domain,     installCmd: interactionSelection.primary.installCmd,     importExample: interactionSelection.primary.importExample,     combinableWith: interactionSelection.primary.combinableWith },
                                            alternative:   { name: interactionSelection.alternative.name, package: interactionSelection.alternative.package, domain: interactionSelection.alternative.domain, installCmd: interactionSelection.alternative.installCmd, importExample: interactionSelection.alternative.importExample, combinableWith: interactionSelection.alternative.combinableWith },
                                            coverage:      interactionSelection.coverage,
                                            all_ranked:    interactionSelection.ranked.map(l => ({ name: l.name, package: l.package, domain: l.domain })),
                                        },
                                        charts: chartSelection.chartsRecommended ? {
                                            primary:       { name: chartSelection.primary.name,     package: chartSelection.primary.package,     approach: chartSelection.primary.approach,     families: chartSelection.primary.families,     installCmd: chartSelection.primary.installCmd,     importExample: chartSelection.primary.importExample },
                                            alternative:   { name: chartSelection.alternative.name, package: chartSelection.alternative.package, approach: chartSelection.alternative.approach, families: chartSelection.alternative.families, installCmd: chartSelection.alternative.installCmd, importExample: chartSelection.alternative.importExample },
                                            also_consider: chartSelection.also_consider.map(l => ({ name: l.name, package: l.package, approach: l.approach, families: l.families })),
                                        } : null,
                                    },
                                    usage: {
                                        whenCivilizationReady: ecosystem.civilizationReady
                                            ? "Call generate_civilization with the same seed to get architecture, state management, and advanced patterns"
                                            : `Add complexity (dashboard, 3D, real-time keywords) or increase counts to reach threshold ${ecosystem.civilizationThreshold}`,
                                        componentHierarchy: "Fauna contain Flora contain Microbial — use relationships.containment for composition",
                                        implementation: "Each organism is a component spec. Implement from its prop contract and colorTreatment — the agent writes the actual code.",
                                        mandate: "You MUST build organisms in hierarchy order: microbial (atoms) → flora (composites) → fauna (complex). Check relationships.containment for composition patterns."
                                    },
                                    chromosome_utilization: {
                                        layer: "L2_Ecosystem",
                                        total_chromosomes: ECOSYSTEM_CHROMOSOME_REGISTRY.length,
                                        ...l2Utilization,
                                        critical_note: "L2 chromosomes control organism hierarchy (biome, energy, symbiosis, trophic). You MUST apply all 12 when building components.",
                                        all_chromosomes: ECOSYSTEM_CHROMOSOME_REGISTRY,
                                        checklist: ECOSYSTEM_CHROMOSOME_REGISTRY.reduce((acc, ch) => {
                                            acc[ch] = l2Utilization.used.includes(ch) ? "✓ USED" : "⚠ VERIFY USAGE";
                                            return acc;
                                        }, {} as Record<string, string>),
                                        enforcement: "Build organisms: microbial → flora → fauna. Use containment relationships. All 12 chromosomes must inform your component architecture."
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
                        let civTraits: any;
                        let civSector: string = "technology";
                        try {
                            const civAnalysis = await this.extractor.analyze(args.intent, context);
                            civTraits = civAnalysis.traits;
                            civSector = civAnalysis.sector?.primary || "technology";
                        } catch {
                            // Fallback: extractTraits with default sector
                            civTraits = await this.extractor.extractTraits(args.intent, context);
                        }

                        // ECOSYSTEM INTEGRATION: Use provided ecosystem or generate standalone
                        let ecosystem = args.ecosystem;
                        let baseGenome = null;
                        let organisms = null;
                        let civEcoGenome: any = null;

                        if (ecosystem) {
                            // Use ecosystem's organisms and genome
                            baseGenome = ecosystem.environment?.genome;
                            organisms = ecosystem.organisms;
                            civEcoGenome = ecosystem.environment?.ecosystemGenome ?? null;
                            
                            // Validate the ecosystem's genome if provided
                            if (baseGenome) {
                                validateGenome(baseGenome, "generate_civilization (ecosystem genome)");
                            }
                        }
                        
                        // If no ecosystem or genome, generate using already-derived sector (no second LLM call)
                        if (!baseGenome) {
                            baseGenome = this.sequencer.generate(args.seed, civTraits, { primarySector: civSector as any });
                        }
                        const traits = civTraits;

                        // Generate civilization tier — pass ecosystem genome for Layer 3 genome chain
                        const tier = this.civilizationGen.generate(
                            args.intent,
                            context,
                            traits,
                            baseGenome,
                            args.min_tier,
                            civEcoGenome ?? undefined
                        );

                        // L3 Chromosome utilization tracking
                        const civTracker = createCivilizationChromosomeTracker();
                        // Track all 16 L3 chromosomes as accessed since they all inform the tier generation
                        CIVILIZATION_CHROMOSOME_REGISTRY.forEach(ch => civTracker.track(ch));
                        const l3Utilization = civTracker.getReport();

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
                        const civComponentDefs = await this.extractor.analyzeCivilizationComponents(
                            args.intent, civSector, tier.tier, civArchetypeContext,
                            Math.min(civComponentCount, 16)
                        );

                        // Overlay LLM names onto existing component specs (keeps accessibility/prop contracts)
                        const namedComponentList = tier.components.list.map((spec: any, i: number) => {
                            const def = civComponentDefs[i];
                            if (!def) return spec;
                            return { ...spec, name: def.name, purpose: def.purpose };
                        });

                        // Generate code and structured file outputs
                        let codeOutputs = null;
                        let fileStructure = null;

                        if (args.generate_code === true) {
                            const topology = undefined; // HTML generation removed - AI builds structure from genome tokens

                            // Generate code using archetype-biased genome + CSS
                            codeOutputs = generateCivilizationOutput(tier, archetypedGenome, archetypedCss, topology);

                            // Use ecosystem organisms if available, otherwise use tier components
                            const componentList = organisms 
                                ? [...organisms.microbial, ...organisms.flora, ...organisms.fauna]
                                : tier.components.list;

                            // Generate file structure for easy consumption
                            fileStructure = {
                                components: componentList.map((c: any) => ({
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
                            ...Object.entries(ARCHETYPE_BIASES[civArchetype]?.chromosomeMutations ?? {}).map(
                                ([k, v]) => `- \`${k}\`: ${JSON.stringify(v)}`
                            ),
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
                                    } : null,
                                    chromosome_utilization: {
                                        layer: "L3_Civilization",
                                        total_chromosomes: CIVILIZATION_CHROMOSOME_REGISTRY.length,
                                        ...l3Utilization,
                                        critical_note: "L3 chromosomes control application architecture (archetype, governance, knowledge, expansion). You MUST implement all 16 as architecture decisions.",
                                        all_chromosomes: CIVILIZATION_CHROMOSOME_REGISTRY,
                                        architecture_mapping: {
                                            "civ_ch1_archetype": "Design philosophy and character",
                                            "civ_ch2_governance": "State management topology",
                                            "civ_ch3_economics": "Resource/data flow patterns",
                                            "civ_ch4_technology": "Tech stack sophistication",
                                            "civ_ch5_culture": "UX patterns and conventions",
                                            "civ_ch6_resilience": "Error handling and recovery",
                                            "civ_ch7_knowledge": "Routing and navigation model",
                                            "civ_ch8_expansion": "Scalability approach",
                                            "civ_ch9_age": "Legacy/compatibility concerns",
                                            "civ_ch10_fragility": "Risk tolerance and testing",
                                            "civ_ch11_topology": "Network architecture",
                                            "civ_ch12_cosmos": "Integration worldview",
                                            "civ_ch13_memory": "Caching and persistence",
                                            "civ_ch14_interface": "API design patterns",
                                            "civ_ch15_evolution": "Migration strategy",
                                            "civ_ch16_communication": "Event/interaction bus"
                                        },
                                        checklist: CIVILIZATION_CHROMOSOME_REGISTRY.reduce((acc, ch) => {
                                            acc[ch] = l3Utilization.used.includes(ch) ? "✓ ARCHITECTURE DEFINED" : "⚠ VERIFY IMPLEMENTATION";
                                            return acc;
                                        }, {} as Record<string, string>),
                                        enforcement: "Every L3 chromosome maps to a concrete architecture decision. You MUST implement from tier.architecture using all 16 chromosome values."
                                    }
                                }, null, 2)
                            }]
                        };
                    }


                    case "update_design_genome": {
                        if (!args.original_genome || !args.changes) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing original_genome or changes");
                        }

                        validateGenome(args.original_genome, "update_design_genome");
                        const original = args.original_genome;
                        const changes = args.changes;
                        const preserveTraits = args.preserve_traits !== false;

                        // Track what changed
                        const diff: Record<string, { old: any; new: any }> = {};
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
                            newGenome.chromosomes.ch5_color_primary.hex = this.hslToHex(
                                changes.primary_hue,
                                newGenome.chromosomes.ch5_color_primary.saturation,
                                newGenome.chromosomes.ch5_color_primary.lightness
                            );
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

                        validateGenome(args.genome, "generate_formats");
                        const genome = args.genome;
                        const tier = args.tier;
                        const requestedFormats = args.formats as string[];
                        const generateAll = requestedFormats.includes("all");

                        const outputs: Record<string, any> = {};

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

                        validateGenome(args.genome, "generate_design_brief");

                        const brief = await designBriefGenerator.generate(
                            args.genome,
                            this.extractor.callText.bind(this.extractor),
                            args.ecosystem_genome,
                            args.civilization_genome
                        );

                        const layerCount = 1 + (args.ecosystem_genome ? 1 : 0) + (args.civilization_genome ? 1 : 0);

                        return {
                            content: [{
                                type: "text",
                                text: JSON.stringify({
                                    thesis:        brief.thesis,
                                    mandates:      brief.mandates,
                                    anti_patterns: brief.antiPatterns,
                                    layer_guide:   brief.layerGuide,
                                    usage_md:      brief.usage_md,
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
                        validateArgs([
                            { name: "url", required: true, maxLength: 2048 },
                            { name: "intent", required: false, maxLength: 32_768 },
                            { name: "seed", required: false, maxLength: 256 },
                            { name: "generate_full_pipeline", required: false },
                        ]);
                        const url = sanitize(args.url);
                        const intent = args.intent ? sanitize(args.intent) : `Design inspired by ${url}`;
                        const seed = args.seed ? sanitize(args.seed) : `url-${Date.now()}`;
                        const generateFullPipeline = args.generate_full_pipeline === true;

                        // Use Playwright to scrape the URL and extract CSS/design tokens
                        const extracted = await urlGenomeExtractor.extract(url);
                        
                        // Clean up browser after extraction
                        await urlGenomeExtractor.closeBrowser();
                        
                        // If requested, generate full L0→L1 pipeline from extracted style
                        let l0Data = undefined;
                        let l1Data = undefined;
                        
                        if (generateFullPipeline) {
                            try {
                                // L0: Generate Creator Genome epigenetically influenced by extracted style
                                const { generateCreatorGenomeFromSnapshot } = 
                                    await import("./creator/generator.js");
                                const { generatePersona, generateBrief } = await import("./brief/generator.js");
                                const { PersonaDesignBridge } = await import("./bridge/persona-to-design.js");
                                
                                // Create L0 genome from snapshot
                                const creatorGenome = generateCreatorGenomeFromSnapshot(seed, {
                                    colors: {
                                        primary: extracted.colors.primary || undefined,
                                        secondary: extracted.colors.secondary || undefined,
                                        background: extracted.colors.background || undefined,
                                        text: extracted.colors.text || undefined,
                                    },
                                    typography: extracted.typography,
                                    layout: {
                                        density: extracted.layout.density === 'compact' ? 'low' :
                                                 extracted.layout.density === 'spacious' ? 'high' : 'medium',
                                        edgeStyle: extracted.layout.borderRadius > 8 ? 'rounded' :
                                                   extracted.layout.borderRadius < 4 ? 'sharp' : 'soft',
                                        borderRadius: extracted.layout.borderRadius,
                                    },
                                    animation: {
                                        hasAnimations: extracted.animation.complexity !== 'minimal',
                                        style: extracted.animation.complexity === 'minimal' ? 'minimal' :
                                               extracted.animation.complexity === 'expressive' ? 'heavy' : 'moderate',
                                        complexity: extracted.animation.complexity,
                                    },
                                });
                                
                                // L0.5: Decode into persona
                                const persona = await generatePersona(creatorGenome);
                                
                                // L0.75: Generate creative brief
                                const brief = await generateBrief(persona, {
                                    description: intent,
                                    sector: extracted.sector || 'technology',
                                });
                                
                                l0Data = {
                                    creatorGenome,
                                    persona: {
                                        id: persona.id,
                                        biography: persona.biography,
                                        instincts: persona.instincts,
                                        worldview: persona.worldview,
                                        creative_behavior: persona.creative_behavior,
                                    },
                                    brief: {
                                        concept: brief.concept,
                                        metaphor_system: brief.metaphor_system,
                                        design_principles: brief.design_principles,
                                    },
                                };
                                
                                // L1: Generate design genome through persona bridge
                                const bridge = new PersonaDesignBridge();
                                const designResult = await bridge.generateDesignThroughPersona(persona, {
                                    description: intent,
                                    sector: extracted.sector || 'technology',
                                });
                                
                                // Generate CSS from the L1 genome WITH persona influence
                                const urlCss = this.cssGen.generate(designResult.genome, { 
                                    format: "expanded",
                                    personaInfluence: {
                                        hueShift: designResult.influence.hueShift,
                                        saturationMod: designResult.influence.saturationMod,
                                        lightnessMod: designResult.influence.lightnessMod,
                                        densityMod: designResult.influence.densityMod,
                                        whitespaceMod: designResult.influence.whitespaceMod,
                                        radiusMod: designResult.influence.radiusMod,
                                        elevationMod: designResult.influence.elevationMod,
                                        trackingMod: designResult.influence.trackingMod,
                                        physicsStyle: designResult.influence.physicsStyle,
                                        copyTone: designResult.influence.copyTone,
                                        metaphorPrimary: designResult.influence.metaphorPrimary,
                                    }
                                });
                                
                                l1Data = {
                                    genome: designResult.genome,
                                    css: urlCss,
                                    dnaHash: designResult.genome.dnaHash,
                                    influence: designResult.influence,
                                };
                            } catch (err) {
                                console.error("Full pipeline generation failed:", err);
                                // Continue with just the extraction
                            }
                        }
                        
                        return {
                            content: [{
                                type: "text",
                                text: JSON.stringify({
                                    url,
                                    sector: extracted.sector,
                                    confidence: extracted.confidence,
                                    colors: extracted.colors,
                                    typography: extracted.typography,
                                    layout: extracted.layout,
                                    animation: extracted.animation,
                                    extractedAt: extracted.extractedAt,
                                    // L0/L1 data if full pipeline was requested
                                    creatorDNA: l0Data,
                                    designGenome: l1Data,
                                    warning: l1Data 
                                        ? "Full L0→L1 pipeline generated from URL style. This is a chromosome genome."
                                        : "This is a flat style snapshot — NOT a chromosome genome. Pass generate_full_pipeline=true to generate L0→L1.",
                                    suggested_next: l1Data ? [
                                        {
                                            action: "write_file",
                                            file: "genome.json",
                                            field: "designGenome.genome",
                                            instruction: "Save the L1 genome to genome.json",
                                            always: true,
                                        },
                                        {
                                            action: "write_file",
                                            file: "design-tokens.css",
                                            field: "designGenome.css",
                                            instruction: "Write the CSS tokens",
                                            always: true,
                                        },
                                        {
                                            tool: "generate_design_brief",
                                            pass: "designGenome.genome",
                                            reason: "Synthesize design philosophy from L1 genome",
                                        },
                                    ] : [
                                        {
                                            param: "generate_full_pipeline",
                                            value: true,
                                            description: "Set to true to generate complete L0→L1 genome from URL",
                                            generates: "Creator DNA (L0) + Persona (L0.5) + Design Genome (L1)",
                                        },
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

                    case "generate_creator_genome": {
                        validateArgs([{ name: "seed", required: true, maxLength: 256 }]);
                        const { generateCreatorGenome } = await import("./creator/generator.js");
                        const genome = generateCreatorGenome(sanitize(args.seed));
                        return {
                            content: [{
                                type: "text",
                                text: JSON.stringify({
                                    creatorGenome: genome,
                                    suggested_next: [{
                                        tool: "generate_persona",
                                        how: "Pass the creatorGenome to decode it into a designer persona",
                                        why: "The persona is the simulated designer that will interpret your design intent"
                                    }]
                                }, null, 2)
                            }]
                        };
                    }

                    case "generate_persona": {
                        if (!args.genome) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing genome");
                        }
                        const { generatePersona } = await import("./brief/generator.js");
                        const persona = await generatePersona(args.genome);
                        return {
                            content: [{
                                type: "text",
                                text: JSON.stringify({
                                    persona,
                                    suggested_next: [{
                                        tool: "generate_design_through_persona",
                                        how: "Pass the persona with your design intent",
                                        why: "The persona will interpret your intent through their unique worldview"
                                    }]
                                }, null, 2)
                            }]
                        };
                    }

                    case "generate_design_through_persona": {
                        validateArgs([{ name: "intent", required: true, maxLength: 1024 }]);
                        const { generateDesignThroughPersona } = await import("./bridge/persona-to-design.js");
                        const { generateCreatorGenome } = await import("./creator/generator.js");
                        const { generatePersona } = await import("./brief/generator.js");
                        
                        // Use provided genome or generate new one
                        const creatorGenome = args.genome || generateCreatorGenome(`persona-${Date.now()}`);
                        const persona = await generatePersona(creatorGenome);
                        
                        const result = await generateDesignThroughPersona(persona, {
                            description: sanitize(args.intent),
                            sector: args.sector
                        });
                        
                        return {
                            content: [{
                                type: "text",
                                text: JSON.stringify({
                                    persona: {
                                        id: persona.id,
                                        voice: persona.instincts.copy_voice,
                                        chaos: persona.creative_behavior.chaos_tolerance,
                                        coherence: persona.creative_behavior.coherence_style
                                    },
                                    brief: {
                                        concept: result.brief.concept.statement,
                                        metaphor: result.brief.metaphor_system.primary,
                                        principles: result.brief.design_principles
                                    },
                                    genome: result.genome,
                                    suggested_next: [{
                                        tool: "generate_design_brief",
                                        how: "Pass the L1 genome to get full design philosophy",
                                        why: "Complete the design system with full brief synthesis"
                                    }]
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

    private buildLayoutContract(genome: any, complexity: number, tier: string): object {
        const ch = genome.chromosomes;
        const cd = ch.ch23_content_depth ?? {};
        const ia = ch.ch23_information_architecture ?? {};
        const ts = ch.ch21_trust_signals ?? {};
        const sp = ch.ch22_social_proof ?? {};
        const hero = ch.ch19_hero_type ?? {};

        const sections: string[] = [];
        if (cd.hasHero !== false)         sections.push("hero");
        if (ts.approach)                  sections.push("trust_grid");
        if (sp.type)                      sections.push("social_proof");
        if (cd.hasFeatures !== false)     sections.push("features");
        if (cd.hasFAQ)                    sections.push("faq");
        if (cd.hasTestimonials)           sections.push("testimonials");
        if (cd.hasCTA !== false)          sections.push("cta");
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

    private buildGenomeReport(genome: any, opts: {
        intent: string;
        seed: string;
        sector: string;
        complexity: number;
        tier: string;
        traits?: any;
    }): string {
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

    private hslToHex(h: number, s: number, l: number): string {
        const saturation = s;
        const lightness = l;
        const k = (n: number) => (n + h / 30) % 12;
        const a = saturation * Math.min(lightness, 1 - lightness);
        const f = (n: number) => {
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
    console.error(
        "[ERROR] No LLM API key found in environment. " +
        "Set one of: GROQ_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY, OPENROUTER_API_KEY, or HUGGINGFACE_API_KEY."
    );
    process.exit(1);
}

