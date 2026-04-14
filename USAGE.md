# Genome MCP — Usage Guide

## What Is This?

Genome is a Model Context Protocol (MCP) server that mathematically generates **Design DNA** from your intent. It prevents AI code generators from defaulting to generic "slop" by exposing a single tool: `generate_design_genome`.

The tool takes a natural language prompt + optional context/assets and outputs a complete, parametric design system — Tailwind config, CSS variables, WebGL components, FX layer, and an SVG brand mark — all derived from a SHA-256 hash + semantic trait vectors.

---

## 🚀 Quick Start (Marketplace)

To install and register the **Genome MCP** server automatically in your MCP client (Claude Desktop, etc.), run:

```bash
npx -y genome-setup
```

This interactive utility will:
1.  **Configure API Keys**: Choose your provider (Groq, OpenAI, Anthropic, or Gemini).
2.  **Install Playwright (Optional but Recommended)**: Installs the Chromium browser required for extracting designs from URLs.
3.  **Auto-Register**: Automatically updates your `claude_desktop_config.json` to include the `genome` server.

---

## 🛠️ Manual Installation (For Contributors)

If you prefer to build from source:

```bash
# 1. Clone and install
git clone https://github.com/your-username/genome
cd genome
npm install

# 2. Build the project
npm run build

# 3. Add to your MCP Config
```

### MCP Config (claude_desktop_config.json)

For manual configuration without the setup script, add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "genome": {
      "command": "node",
      "args": ["/absolute/path/to/genome/dist/src/server.js"],
      "env": {
        "GROQ_API_KEY": "your_key_here"
      }
    }
  }
}
```

### Supported LLMs

| Provider | API Key Env Var | Notes |
|---|---|---|
| **Groq** (default) | `GROQ_API_KEY` | Fastest generation times |
| **OpenAI** | `OPENAI_API_KEY` | High reasoning capability |
| **Anthropic** | `ANTHROPIC_API_KEY` | Best for complex design briefs |
| **Gemini** | `GEMINI_API_KEY` | Largest context window |
| **Total** | **6 providers** | Fallback priority: Groq → OpenAI → Anthropic → Gemini |

---

## ⚠️ MANDATORY Workflow Enforcement

The Genome MCP server **enforces** a strict workflow. AI agents CANNOT skip steps.

### Required Sequence (Standard L1 Entry)

```
STEP 1 → generate_design_genome
    ↓ [MUST write genome.json]
STEP 2 → generate_design_brief  
    ↓ [MUST read before any code]
STEP 3 → generate_ecosystem (if building components)
    ↓ [MUST compose: microbial → flora → fauna]
STEP 4 → generate_civilization (if complexity ≥ 0.68)
    ↓
IMPLEMENTATION → Use ALL 32 chromosomes
    ↓
FINAL → validate_design [MUST pass before shipping]
```

### Alternative: L0 Creator DNA Entry (Simulated Designer Personas)

For truly unique creative directions, start with a **simulated designer persona**:

```
STEP 1 → generate_creator_genome    ← 16-chromosome creator DNA
    ↓
STEP 2 → generate_persona           ← LLM decodes into unique designer
    ↓
STEP 3 → generate_design_through_persona  ← Persona interprets intent → L1
    ↓
STEP 4 → generate_design_brief      ← Read before writing code
    ↓
... continue with standard workflow
```

**Why use L0?** Each creator persona has a unique voice (e.g., "whispered forest diaries", "Forged industrial poetry"), worldview, and creative instincts. The same intent interpreted by different personas produces meaningfully different design genomes.

**Example:**
```typescript
// Generate creator
const creator = await generate_creator_genome({ seed: "wilderness-architect" });

// Decode into persona  
const persona = await generate_persona({ genome: creator.creatorGenome });
// → Voice: "rough-hewn wilderness blueprints"
// → Philosophy: "Technology should feel like it grew from the earth"

// Persona interprets your intent
const design = await generate_design_through_persona({
  genome: creator.creatorGenome,  // optional - will generate new one if omitted
  intent: "A portfolio site for a photographer",
  sector: "commerce"
});
// → L1 genome influenced by persona's chaos tolerance, aesthetic sensibility, etc.
```

### Critical Enforcement Rules

| Rule | Violation Consequence |
|------|----------------------|
| **Write genome.json first** | All subsequent tools will fail validation |
| **Use complete genome object** | Passing only `dnaHash` or `traits` throws error |
| **Apply ALL 32 chromosomes** | < 50% utilization = validation failure |
| **Follow organism hierarchy** | fauna → contains → flora → contains → microbial |
| **Call validate_design before ship** | Cannot mark task complete without validation |

### Chromosome Utilization Check

Every `generate_design_genome` response includes:

```json
{
  "chromosome_utilization": {
    "utilizationRate": 85,
    "used": ["ch5_color_primary", "ch7_edge", "ch8_motion", ...],
    "unused": ["ch11_texture", "ch13_z_index"],
    "warning": null,
    "critical_note": "You MUST use ALL 32 chromosomes...",
    "checklist": {
      "ch5_color_primary": "✓ USED",
      "ch11_texture": "⚠ NOT YET ACCESSED",
      ...
    }
  }
}
```

**AI must check every chromosome marked "⚠ NOT YET ACCESSED" and apply it.**

### The Genome Object Contract

When calling subsequent tools, you MUST pass the **complete** genome:

```typescript
// ✅ CORRECT — Full genome object
validate_design({
  genome: genome_result.genome,  // Complete object with chromosomes, sectorContext, dnaHash
  css: myCss
})

// ❌ WRONG — Partial genome
validate_design({
  genome: { dnaHash: "abc123", traits: [...] },  // Missing chromosomes!
  css: myCss
})
// → Error: "Genome missing 'chromosomes' field"
```

---

## The `generate_design_genome` Tool

### Parameters

| Parameter | Required | Description |
|---|---|---|
| `intent` | ✅ | Natural language design prompt. Can be vague ("street fashion brand") or specific ("minimal data dashboard for a crypto trading desk") |
| `seed` | ✅ | Unique string that determines the DNA hash. Same seed always produces the same genome. Use `projectName-componentName` |
| `project_context` | Optional | Overarching brand narrative. If provided, even a partial intent like "pricing table" will be shaped by this context |
| `brand_asset_paths` | Optional | Array of absolute paths to brand PDFs or logos. Images → dominant hue extraction. PDFs → text context extraction. These epigenetically override the hash |
| `offline` | Optional | `true` to skip LLM entirely — uses hash-based trait inference. No API key needed. Deterministic. |
| `font_provider` | Optional | `"bunny"` (default) or `"google"` — typography CDN |

### Output Fields

| Field | Description |
|---|---|
| `genome` | Full 32-chromosome JSON object. All design decisions encoded (ch0-sector through ch32-token_inheritance) |
| `css` | Complete CSS token stylesheet — inject into `:root`. Includes `--color-primary`, `--color-primary-interactive` (dark mode safe), full type scale, spacing, and motion vars |
| `topology` | Structural sections object describing the layout skeleton |
| `webglComponents` | JSX code for the DNA-driven 3D element (if `ch18_rendering.primary === "webgl"`) |
| `fxAtmosphere` | `.fx-atmosphere` CSS class (glassmorphism, CRT noise, fluid mesh, or glitch) |
| `svgBiomarker` | Parametric SVG brand mark derived from `ch15_biomarker.geometry` and `ch12_signature.entropy` |
| `genome_report` | Markdown explainability doc — which chromosomes were sequenced, sector detected, forbidden hue ranges in effect, dark mode handling, workflow map |
| `suggested_next` | Array of tool recommendations — which tools to call next and when, based on this genome's complexity score |

---

## How AI Knows When to Use These Tools

**The AI doesn't automatically know when to call MCP tools.** It decides based on three signals:

### 1. Tool Descriptions
Each tool has a `description` field that the AI reads. Descriptions include keywords like "design genome", "ecosystem", "validate" — these help the AI match your intent to the right tool.

### 2. Your Explicit Request
**Be explicit in your prompts.** The AI matches your words against tool descriptions:

| If you say... | AI will likely call... |
|---------------|------------------------|
| "Generate a **design genome** for..." | `generate_design_genome` |
| "Create **design DNA** from..." | `generate_design_genome` |
| "**Update** the colors to..." | `update_design_genome` |
| "**Extract design** from this URL..." | `extract_genome_from_url` |
| "Create a **design brief**..." | `generate_design_brief` |
| "Generate the **ecosystem**..." | `generate_ecosystem` |
| "**Validate** this design..." | `validate_design` |
| "Export to **CSS/Tailwind**..." | `generate_formats` |

### 3. Context Matching
Keywords in conversation trigger tool selection:
- "design tokens", "genome", "chromosomes", "DNA" → Design tools
- "components", "organisms", "ecosystem" → Ecosystem tools
- "slop", "validation", "check constraints" → Validate tool

### Bad vs Good Prompts

❌ **Too vague** — "Make my app look good"
→ AI may not trigger any MCP tool; might generate generic CSS

✅ **Explicit** — "Generate a design genome for a fintech dashboard with dark mode"
→ AI sees "design genome" → calls `generate_design_genome`

✅ **With context** — "Use genome to extract the design from https://example.com"
→ AI sees "genome" + "extract" → calls `extract_genome_from_url`

### The `suggested_next` Field
Every `generate_design_genome` response includes `suggested_next` — an array telling you (and the AI) which tools to call next:

```json
{
  "suggested_next": [
    {
      "tool": "generate_design_brief",
      "reason": "Complexity tier 0.74 requires philosophy documentation",
      "when": "Before writing any CSS"
    },
    {
      "tool": "generate_ecosystem",
      "reason": "Component library needed for tier ≥ 0.68",
      "when": "After brief, before implementation"
    }
  ]
}
```

The AI reads these suggestions and may automatically invoke the next tool if your follow-up prompt implies continuation (e.g., "What's next?", "Generate the ecosystem too").

---

## Usage Examples

### Simple Landing Page

```
generate_design_genome(
  intent: "A landing page for an urban architecture studio",
  seed: "firma-landing-2025"
)
```

### Narrow Intent + Strong Context

```
generate_design_genome(
  intent: "pricing table component",
  seed: "bio-app-pricing",
  project_context: "An app simulating planetary ecosystems and biological adaptation. Think bioluminescence, cellular membranes, and deep ocean aesthetics."
)
```
→ The LLM uses the overarching context to skew trait vectors. The pricing table will be extremely spatial and organic, not a plain Bootstrap grid.

### With Brand Assets (Epigenetic Mode)

```
generate_design_genome(
  intent: "homepage hero section",
  seed: "nike-campaign-2025",
  brand_asset_paths: [
    "/Users/me/design/nike-logo.png",
    "/Users/me/design/brand-guidelines.pdf"
  ]
)
```
→ `sharp` extracts the dominant hue from the logo → injects it as `ch5_color_primary.hue`.
→ `pdf-parse` extracts brand text → feeds into `project_context` for trait extraction.

### Re-Generating A Specific Component

```
generate_design_genome(
  intent: "sidebar navigation",
  seed: "acme-dashboard-sidebar"  // Same seed = same DNA every time
)
```

### Ecosystem → Civilization Flow

The system uses a **14-tier biological complexity model**:

| Layer | Tiers | Complexity | Generator |
|-------|-------|------------|-----------|
| Ecosystem | abiotic → prokaryotic → protist → bryophyte → vascular_flora → invertebrate_fauna → ectotherm_fauna → endotherm_fauna | 0.00–0.80 | `generate_ecosystem` |
| Civilization | tribal → city_state → nation_state → empire → network → singularity | 0.81–1.00 | `generate_civilization` |

Civilization is not random — it requires **intent complexity** (keywords like `dashboard`, `platform`, `3d`, `real-time` boost the score). Use `min_tier` to force a minimum civilization tier.

For complex applications, generate organisms first, then add architecture:

```
// Step 1: Generate component ecosystem
const ecosystem = generate_ecosystem(
  intent: "fintech dashboard with real-time data",
  seed: "trading-platform-v2"
)

// Step 2: Add civilization layer (requires complexity >= 0.81)
// Activates ch30 stateTopology, ch31 routingPattern, ch32 tokenInheritance
const civilization = generate_civilization(
  intent: "real-time 3D dashboard with animation",
  seed: "trading-platform-v2",
  ecosystem: ecosystem,
  min_tier: "city_state"  // optional: "tribal" | "city_state" | "nation_state" | "empire" | "network" | "singularity"
)
```

---

## All 8 Tools

### Tool Workflow (Enforced)

```
STEP 1  generate_design_genome    ← ALWAYS START HERE
        [OUTPUT: Write genome.json — BLOCKING]
        [VERIFY: Check chromosome_utilization.checklist]
        
STEP 2  generate_design_brief     ← MANDATORY before any code
        [INPUT: Full genome object]
        [OUTPUT: DESIGN_SYSTEM.md constitution]
        
STEP 3  generate_ecosystem        ← REQUIRED for components
        [RULE: Compose microbial → flora → fauna]
        [RULE: Use containment relationships]
        
STEP 4  generate_civilization     ← REQUIRED if complexity ≥ 0.68
        [INPUT: Ecosystem from Step 3]
        [OUTPUT: State/routing architecture]
        
IMPLEMENT  Build from genome specs
        [RULE: Apply ALL 32 chromosomes]
        [RULE: Follow organism hierarchy]
        
FINAL   validate_design           ← MANDATORY GATE
        [BLOCKING: Cannot ship without passing]
        [CHECK: Pattern violations, chromosome drift, utilization rate]

ALTERNATIVE  extract_genome_from_url  ← Reference site analysis
EXPORT       generate_formats         ← External tool export
ITERATE      update_design_genome     ← Chromosome adjustments
```

**Enforcement Notes:**
- `generate_design_brief` is now **mandatory** — the AI cannot write code before calling it
- `validate_design` is a **shipping gate** — it blocks completion until all checks pass
- Chromosome utilization must be ≥ 80% for validation to pass

### Iterate: Update Genome

Adjust specific chromosomes without re-running the full pipeline:

```
update_design_genome(
  original_genome: genome_result.genome,
  changes: {
    primary_hue: 28,          // override hue directly
    motion_physics: "spring", // "none" | "spring" | "step" | "glitch"
    edge_radius: 0,           // sharp edges
    sector: "fintech",        // re-classify sector
    new_seed: "v2"            // completely new DNA from this seed
  }
)
→ Returns: diff of changed chromosomes + updated genome
```

### Export: Generate Formats

Export design tokens for external tools:

```
generate_formats(
  genome: genome_result.genome,
  formats: ["figma-tokens", "style-dictionary", "styled-components"]
  // options: "figma-tokens" | "style-dictionary" | "styled-components" | "emotion" | "vue" | "svelte" | "all"
)
→ Returns: Token outputs for each requested format
```

### Extract Genome from URL

Reverse-engineer a genome from any website. Automatically scrapes CSS/design tokens:

```
extract_genome_from_url(
  url: "https://example.com"
)
→ Returns: Approximate genome with confidence score
```

**Scraping Backends (auto-selected):**

| Backend | When Used | Pros | Cons |
|---------|-----------|------|------|
| **Lightpanda** | `GENOME_USE_LIGHTPANDA=true` | Ultra-lightweight, high performance, uses CDP |
| **Playwright** (default) | Browser installed | JavaScript-rendered sites, computed styles | Requires `npx playwright install` |
| **Native fetch** (fallback) | No browser | Zero dependencies, fast | Static HTML only, no JS-rendered content |
| **Scrapy** (optional) | Python available | Professional crawling, rate limiting, proxies | Requires Python + `pip install scrapy` |

**Option A: Install Playwright (Standard):**
```bash
npx playwright install chromium
```

**Option B: Use Lightpanda (Ultra-lightweight):**
Lightpanda is a high-performance, low-memory browser.
1. [Download Lightpanda](https://github.com/lightpanda-io/lightpanda)
2. Start it with CDP enabled:
```bash
lightpanda --cdp 9222
```
3. Set `GENOME_USE_LIGHTPANDA=true` in your MCP environment.

**Capabilities:**
- Color palette extraction (hex, rgb, hsl, named colors) → ch5, ch26
- Typography detection (font-family, weights, sizes) → ch3, ch4, ch16
- Spacing inference (margin, padding, gaps) → ch2
- Border radius patterns → ch7
- Animation detection (durations, easings) → ch8, ch27
- Sector inference from URL + content (fintech, healthcare, etc.) → ch0

### Generate Design Brief

Convert genome to human-readable prose for client approval:

```
generate_design_brief(
  genome: genome_result.genome,
  format: "prose"  // or "markdown", "json"
)
→ Returns: Visual direction, strategic decisions, copy intelligence
```

---

## Interpreting The Genome

### Trait Vectors (0.0–1.0)

| Trait | Low (0.1) | High (0.9) |
|---|---|---|
| `informationDensity` | Luxurious, sparse, editorial | Chaotic, data-heavy, dashboard |
| `temporalUrgency` | Timeless, archival, slow reading | Real-time, scanning, high-frequency |
| `emotionalTemperature` | Clinical, technical, brutalist | Warm, humanist, empathetic |
| `playfulness` | Strict, enterprise, rigid | Organic, whimsical, experimental |
| `spatialDependency` | Flat 2D, CSS only | Immersive WebGL, 3D particles |

### Chromosome Quick Reference

| ID | Chromosome | Controls |
|---|---|---|
| ch0 | sector | Industry sector + sub-sector classification |
| ch1 | structure | Layout topology (flat/deep/radial/graph) |
| ch2 | rhythm | Spacing density + vertical rhythm |
| ch3 | type_display | Display font family + weight |
| ch4 | type_body | Body font family |
| ch5 | color_primary | Primary hue/saturation/lightness. Also `darkModeHex` (lightness 58–74%) for buttons on dark surfaces, `darkModeLightness`. Use `--color-primary-interactive` CSS var in dark mode. |
| ch6 | color_temp | Background temperature |
| ch7 | edge | Border radius + corner treatment |
| ch8 | motion | Animation physics (spring/tween/physics) |
| ch9 | grid | Grid logic (column/masonry/radial/broken) |
| ch10 | hierarchy | Element depth/z-index strategy |
| ch11 | texture | Surface material (grain, flat, glass) |
| ch12 | signature | Unique entropy/mutation identifier |
| ch13 | atmosphere | FX layer (glassmorphism/crt_noise/fluid_mesh) |
| ch14 | physics | 3D material (glass/metallic/neumorphism/matte) |
| ch15 | biomarker | SVG geometry (organic/fractal/monolithic) |
| ch16 | typography | Full type scale (display → small sizes and ratios) |
| ch17 | accessibility | WCAG profile (contrast ratio, motion, touch target) |
| ch18 | rendering | Rendering strategy (webgl/css/svg/static) |
| ch19 | hero_type | Hero section strategy (product_ui, brand_logo, editorial_feature) |
| ch20 | visual_treatment | Image/photography treatment approach |
| ch21 | trust_signals | Trust-building elements (testimonials, stats, security badges) |
| ch22 | social_proof | Social validation (logos, ratings, community size) |
| ch23 | content_depth | Number of sections (minimal/moderate/extensive/comprehensive) |
| ch24 | personalization | Dynamic content approach (static/behavior_based/fully_dynamic) |
| ch25 | copy_engine | Copywriting system (headline, CTA, tagline, testimonials, FAQ) |
| ch26 | color_system | Complete palette (secondary, accent, semantic, neutral scale) |
| ch27 | motion_choreography | Entry sequences, stagger timing, scroll triggers, hover micro-interactions |
| ch28 | iconography | Icon system (style, stroke weight, library: lucide/phosphor/heroicons) |
| ch29 | copy_intelligence | Linguistic patterns (terminology, emotional register, vocabulary complexity, CTA aggression) |
| ch30 | state_topology | State management architecture (local → shared_context → reactive_store → distributed → federated) |
| ch31 | routing_pattern | Routing architecture (single_page → multi_page → protected → platform → federated) |
| ch32 | token_inheritance | Design token governance (flat → semantic → component → governed → cross_system) |

---

## Standalone CLI Usage

To generate designs without an MCP-enabled IDE:

```bash
npm run build
node dist/src/server.js
```

Or use the MCP tools directly via the server.

---

## Dogfooding

The product website at `website/` was built using the output of this engine. The website's primary color, font family, edge radius, SVG brand mark in the navbar, and 3D element rendering mode are all mathematically determined by the genome — not hand-crafted.
