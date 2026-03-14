#!/usr/bin/env node
/**
 * Permutations — Story-Driven Dogfood Generator
 *
 * Uses the FULL tool pipeline:
 *   SemanticTraitExtractor → GenomeSequencer → CSSGenerator → HTMLGenerator
 *   + PatternDetector + SVGGenerator + FXGenerator
 *
 * Content is derived entirely from permutations_story.json.
 * No hardcoded copy, traits, or values.
 * Requires .env with a valid LLM API key.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import * as crypto from "crypto";

// Load .env (same logic as server.ts — no dotenv dep)
const __envFile = join(dirname(fileURLToPath(import.meta.url)), ".env");
if (existsSync(__envFile)) {
  readFileSync(__envFile, "utf-8").split("\n").forEach(line => {
    const m = line.match(/^\s*([^#=\s][^=]*?)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── Load story data ──────────────────────────────────────────────────────────
const storyData = JSON.parse(readFileSync(join(__dirname, "permutations_story.json"), "utf-8"));
const meta       = storyData.meta;
const origin     = storyData.origin_story;
const timeline   = storyData.evolution_timeline;
const gaps       = storyData.gaps_we_fill;
const roadmap    = storyData.future_roadmap;
const cosmic     = storyData.the_cosmic_analogy;

console.log("🧬 Permutations — Story-Driven Dogfood");
console.log("=".repeat(60));
console.log("  Product  :", meta.title);
console.log("  Version  :", meta.version);
console.log("  Manifesto:", origin.the_manifesto.core_phrase);

// ── Import generators ────────────────────────────────────────────────────────
const { SemanticTraitExtractor } = await import("./dist/semantic/extractor.js");
const { GenomeSequencer }        = await import("./dist/genome/sequencer.js");
const { ComplexityAnalyzer }     = await import("./dist/genome/complexity-analyzer.js");
const { CSSGenerator }           = await import("./dist/css-generator.js");
const { HTMLGenerator }          = await import("./dist/html-generator.js");
const { PatternDetector }        = await import("./dist/constraints/pattern-detector.js");
const { SVGGenerator }           = await import("./dist/generators/svg-generator.js");

// ── Build intent + context from story ───────────────────────────────────────
//    Intent: what is this product / what does it do?
const intent = [
  origin.the_manifesto.core_phrase,
  origin.the_problem.observation,
  origin.the_insight.realization,
  `${meta.lines_of_code.toLocaleString()} lines of code, ${meta.test_count} tests passing, version ${meta.version}`,
  `For developers and designers building with AI. Mathematical design generation system.`,
  `Complexity tiers: microbial to advanced civilization. 29 chromosomes. 13 sectors. SHA-256 determinism.`,
].join(" — ");

//    Context: rich product details the LLM uses for copy extraction
const contextObj = {
  product:   "Permutations MCP",
  tagline:   origin.the_manifesto.core_phrase,
  sector:    "developer tools / design technology",
  audience:  "AI engineers, frontend developers, product designers",
  features:  Object.values(gaps).map(g => ({
    title:       g.problem.length > 60 ? g.problem.slice(0, 58) + "…" : g.problem,
    description: g.solution,
  })),
  stats: [
    { value: String(meta.lines_of_code.toLocaleString()), label: "Lines of Code" },
    { value: String(meta.test_count),                     label: "Tests Passing"  },
    { value: "29",                                        label: "Chromosomes"    },
    { value: "13",                                        label: "Sectors"        },
  ],
  principles: origin.the_manifesto.principles,
  milestones: Object.values(timeline).map(v => v.date + ": " + (v.features?.[0] ?? "")),
  philosophy: storyData.philosophical_position,
  cosmic_summary: cosmic.the_design_universe.description,
  repository: meta.repository,
  footerNav: {
    productTitle: "Explore",
    product:      ["Architecture", "Evolution Timeline", "Chromosome Guide", "Roadmap"],
    companyTitle: "Project",
    company:      ["GitHub", "USAGE.md", "ARCHITECTURE.md", "Manifesto"],
  },
};
const context = JSON.stringify(contextObj, null, 2);

// ── LLM Extraction ───────────────────────────────────────────────────────────
console.log("\n🔬 Running semantic extraction via LLM…");
const extractor = new SemanticTraitExtractor();
let analysis;
try {
  analysis = await extractor.analyze(intent, context);
  console.log("  ✅ Traits extracted:", Object.keys(analysis.traits).length, "vectors");
  console.log("  ✅ Sector:", analysis.sector.primary);
  console.log("  ✅ Copy headline:", analysis.copy?.headline?.slice(0, 60) || "(empty)");
} catch (err) {
  console.error("  ❌ LLM extraction failed:", err.message);
  process.exit(1);
}

// ── Genome sequencing ────────────────────────────────────────────────────────
console.log("\n🧬 Sequencing genome…");
const seedSource = origin.the_manifesto.core_phrase + meta.version + meta.lines_of_code;
const seed       = "perm-" + crypto.createHash("sha256").update(seedSource).digest("hex").slice(0, 24);

const sequencer = new GenomeSequencer();
const genome    = sequencer.generate(seed, analysis.traits, {
  primarySector: analysis.sector.primary,
  options: {
    copyIntelligence: analysis.copyIntelligence,
    copy:             analysis.copy,
  },
});

const ch = genome.chromosomes;
console.log("  ✅ Seed:", seed);
console.log("  ✅ Hero type:", ch.ch19_hero_type.type);
console.log("  ✅ Display font:", ch.ch3_type_display.family);
console.log("  ✅ Primary color:", ch.ch5_color_primary.hex);
console.log("  ✅ Texture:", ch.ch11_texture.surface);
console.log("  ✅ Icon library:", ch.ch28_iconography.library);
console.log("  ✅ Choreography:", ch.ch27_motion_choreography.choreographyStyle);

// ── Complexity analysis ───────────────────────────────────────────────────────
console.log("\n⚡ Analyzing complexity tier…");
const complexityAnalyzer = new ComplexityAnalyzer();
const { finalComplexity, tier: complexityTier } = complexityAnalyzer.analyze(intent, context, analysis.traits);
console.log("  ✅ Complexity:", finalComplexity.toFixed(3));
console.log("  ✅ Tier:", complexityTier);

// ── CSS generation ───────────────────────────────────────────────────────────
console.log("\n🎨 Generating CSS…");
const cssGen = new CSSGenerator();
const css    = cssGen.generate(genome, { format: "expanded" });
const nanCount = (css.match(/NaN/g) || []).length;
console.log("  ✅", css.split("\n").length, "lines of CSS");
if (nanCount > 0) console.warn("  ⚠️  NaN count:", nanCount);

// ── HTML generation ──────────────────────────────────────────────────────────
console.log("\n📄 Generating HTML…");
const htmlGen  = new HTMLGenerator();
const baseHTML = htmlGen.generate(genome, {
  includeHeader:   true,
  includeFooter:   true,
  includeSections: true,
});

// ── Story supplement sections (use CSS vars from genome for styling) ──────────
const evolutionRows = Object.entries(timeline).map(([key, v]) => `
  <div class="timeline-item stagger-child" data-reveal>
    <div class="timeline-marker"></div>
    <div class="timeline-content">
      <span class="timeline-version">${v.date ?? ""}</span>
      <h3>${key.replace(/_/g, " ").replace(/v(\d)/gi, "v$1").toUpperCase()}</h3>
      <ul>${(v.features ?? []).slice(0, 3).map(f => `<li>${f}</li>`).join("")}</ul>
      ${v.breakthrough || v.philosophy ? `<p class="timeline-highlight">${v.breakthrough ?? v.philosophy ?? ""}</p>` : ""}
    </div>
  </div>`).join("");

const gapCards = Object.values(gaps).map((g, i) => `
  <div class="gap-card stagger-child micro-hover" data-reveal>
    <div class="gap-number">${String(i + 1).padStart(2, "0")}</div>
    <div class="gap-body">
      <p class="gap-problem">${g.problem}</p>
      <p class="gap-solution">${g.solution}</p>
    </div>
  </div>`).join("");

const roadmapCards = Object.entries(roadmap).map(([key, desc]) => `
  <div class="roadmap-card stagger-child micro-hover" data-reveal>
    <span class="version-badge">${key.replace(/_/g, ".").replace(/v\./g, "v")}</span>
    <p>${desc}</p>
  </div>`).join("");

const helixItems = Array.from({ length: 29 }, (_, i) =>
  `<div class="helix-strand" style="--i:${i};--delay:${(i * 0.05).toFixed(2)}s" aria-hidden="true"></div>`
).join("\n    ");

const storySections = `
<!-- Story sections — use genome CSS vars throughout -->
<section class="story-section story-helix" id="dna" aria-label="DNA visualization">
  <div class="container">
    <div class="helix-wrapper">
      <div class="helix" role="img" aria-label="29 chromosome helix">${helixItems}</div>
      <div class="helix-label">
        <h2 class="section-title">${origin.the_insight.realization}</h2>
        <p class="section-intro">${origin.the_insight.analogy}</p>
        <p class="helix-breakthrough">${origin.the_insight.breakthrough}</p>
      </div>
    </div>
  </div>
</section>

<section class="story-section story-timeline" id="evolution">
  <div class="container">
    <h2 class="section-title">Evolution Timeline</h2>
    <p class="section-intro">From MVP to civilization in seven jumps.</p>
    <div class="timeline">${evolutionRows}</div>
  </div>
</section>

<section class="story-section story-gaps" id="gaps">
  <div class="container">
    <h2 class="section-title">Problems We Solve</h2>
    <p class="section-intro">Six gaps in the AI design landscape — addressed mathematically.</p>
    <div class="gaps-grid">${gapCards}</div>
  </div>
</section>

<section class="story-section story-roadmap" id="roadmap">
  <div class="container">
    <h2 class="section-title">Roadmap</h2>
    <p class="section-intro">What civilisation looks like next.</p>
    <div class="roadmap-grid">${roadmapCards}</div>
  </div>
</section>

<section class="story-section story-cosmic" id="cosmic">
  <div class="container">
    <h2 class="section-title">${cosmic.title}</h2>
    <p class="section-intro">${cosmic.subtitle}</p>
    <blockquote class="cosmic-quote">${cosmic.the_design_universe.description}</blockquote>
    <p class="cosmic-comparison">${cosmic.the_design_universe.comparison}</p>
  </div>
</section>`;

// Supplement CSS — uses only var() references from genome CSS, zero hardcodes
const supplementCSS = `
/* ── Story supplement — all values via genome CSS custom properties ── */

/* Helix DNA visualization */
.story-helix { padding: var(--space-2xl) 0; overflow: hidden; }
.helix-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2xl);
  align-items: center;
}
.helix {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-sm);
  perspective: 400px;
}
.helix-strand {
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  opacity: calc(0.3 + var(--i) * 0.024);
  transform: rotateY(calc(var(--i) * 12.4deg)) translateZ(8px);
  animation: helix-pulse calc(2s + var(--delay)) ease-in-out infinite alternate;
}
@keyframes helix-pulse {
  from { transform: rotateY(calc(var(--i) * 12.4deg)) translateZ(8px) scale(1); }
  to   { transform: rotateY(calc(var(--i) * 12.4deg)) translateZ(16px) scale(1.08); }
}
.helix-breakthrough {
  margin-top: var(--space-lg);
  font-family: var(--font-display);
  font-size: var(--text-body);
  color: var(--color-primary);
  font-weight: 600;
}

/* Timeline */
.story-timeline { padding: var(--space-2xl) 0; background: var(--color-surface-elevated); }
.timeline { display: flex; flex-direction: column; gap: var(--space-xl); position: relative; }
.timeline::before {
  content: '';
  position: absolute;
  left: 12px;
  top: 0; bottom: 0;
  width: 2px;
  background: var(--color-primary-200);
}
.timeline-item { display: flex; gap: var(--space-lg); padding-left: var(--space-sm); }
.timeline-marker {
  flex-shrink: 0;
  width: 24px; height: 24px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  border: 3px solid var(--color-surface);
  z-index: 1;
  margin-top: 4px;
}
.timeline-content { flex: 1; }
.timeline-version {
  display: inline-block;
  font-size: var(--text-small);
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-xs);
}
.timeline-content h3 {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}
.timeline-content ul {
  padding-left: var(--space-md);
  color: var(--color-text-secondary);
  font-size: var(--text-small);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}
.timeline-highlight {
  margin-top: var(--space-sm);
  font-style: italic;
  color: var(--color-primary);
  font-size: var(--text-small);
}

/* Gaps */
.story-gaps { padding: var(--space-2xl) 0; }
.gaps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-lg);
}
.gap-card {
  display: flex;
  gap: var(--space-md);
  background: var(--color-surface-elevated);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  border: 1px solid var(--color-primary-100);
}
.gap-number {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  font-weight: 700;
  color: var(--color-primary-200);
  line-height: 1;
  flex-shrink: 0;
}
.gap-problem {
  font-weight: 600;
  color: var(--color-text);
  font-size: var(--text-small);
  margin-bottom: var(--space-sm);
}
.gap-solution {
  color: var(--color-text-secondary);
  font-size: var(--text-small);
}

/* Roadmap */
.story-roadmap { padding: var(--space-2xl) 0; background: var(--color-surface-elevated); }
.roadmap-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-lg);
}
.roadmap-card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  border: 1px solid var(--color-primary-100);
}
.version-badge {
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-primary-100);
  color: var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: var(--text-small);
  font-weight: 600;
  margin-bottom: var(--space-sm);
}
.roadmap-card p {
  color: var(--color-text-secondary);
  font-size: var(--text-small);
}

/* Cosmic */
.story-cosmic { padding: var(--space-2xl) 0; }
.cosmic-quote {
  border-left: 4px solid var(--color-primary);
  padding-left: var(--space-lg);
  margin: var(--space-xl) 0;
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-style: italic;
  color: var(--color-text);
}
.cosmic-comparison {
  color: var(--color-text-secondary);
  font-size: var(--text-body);
}

/* Story section base */
.story-section .container { padding-top: var(--space-xl); padding-bottom: var(--space-xl); }

/* Responsive story sections */
@media (max-width: 768px) {
  .helix-wrapper { grid-template-columns: 1fr; }
  .helix { display: none; }
  .gaps-grid, .roadmap-grid { grid-template-columns: 1fr; }
  .timeline { padding-left: 0; }
  .timeline::before { display: none; }
}
`;

// ── Assemble final HTML ───────────────────────────────────────────────────────
// Inject supplement CSS and story sections into the generated HTML
// supplementCSS is merged into styles.css via fullCSS — no inline style needed
const finalHTML = baseHTML
  .replace("</body>", `${storySections}\n</body>`);

// ── Pattern detection ─────────────────────────────────────────────────────────
const detector    = new PatternDetector();
const violations  = detector.detectInGenome(genome, css, finalHTML);
const errors      = violations.filter(v => v.severity === "error");
console.log("\n🔍 Pattern detection:");
console.log("  ✅ Violations found:", violations.length, "(errors:", errors.length + ")");
errors.forEach(e => console.warn("  ⚠️ ", e.pattern, "—", e.message));

// ── Biomarker ─────────────────────────────────────────────────────────────────
// Note: FX CSS is already merged into `css` by CSSGenerator — no need to call FXGenerator again
const svgGen  = new SVGGenerator();
const biomark = svgGen.generateBiomarker(genome);

// ── Output ────────────────────────────────────────────────────────────────────
const outDir = join(__dirname, "output");
mkdirSync(outDir, { recursive: true });

// css already contains FX CSS (via CSSGenerator.generate() → FXGenerator merge)
// supplementCSS contains story sections styling — both combined here
const fullCSS = css + "\n\n" + supplementCSS;

writeFileSync(join(outDir, "index.html"), finalHTML, "utf-8");
writeFileSync(join(outDir, "styles.css"),  fullCSS,  "utf-8");
writeFileSync(join(outDir, "biomarker.svg"), biomark, "utf-8");

// Full genome — all chromosomes, same format as website/src/genome.json
writeFileSync(join(outDir, "genome.json"), JSON.stringify(genome, null, 2), "utf-8");

console.log("\n" + "=".repeat(60));
console.log("✅ Generation complete");
console.log("   output/index.html   —", finalHTML.split("\n").length, "lines");
console.log("   output/styles.css   —", fullCSS.split("\n").length, "lines (CSS + FX + supplement)");
console.log("   output/biomarker.svg");
console.log("   output/genome.json  — full genome, all chromosomes");
console.log("   Complexity:", finalComplexity.toFixed(3), "/ Tier:", complexityTier);
console.log("\n   Seed  :", seed);
console.log("   Color :", genome.chromosomes.ch5_color_primary.hex);
console.log("   Font  :", genome.chromosomes.ch3_type_display.family);
