# Permutations MCP — Usage Guide

## What Is This?

Permutations is a Model Context Protocol (MCP) server that mathematically generates **Design DNA** from your intent. It prevents AI code generators from defaulting to generic "slop" by exposing a single tool: `generate_design_genome`.

The tool takes a natural language prompt + optional context/assets and outputs a complete, parametric design system — Tailwind config, CSS variables, WebGL components, FX layer, and an SVG brand mark — all derived from a SHA-256 hash + semantic trait vectors.

---

## Installation

```bash
# 1. Clone and install
git clone https://github.com/your-username/permutations
cd permutations
npm install

# 2. Set your LLM API key (pick one)
export GROQ_API_KEY=your_key_here
# or
export OPENAI_API_KEY=your_key_here
# or  
export ANTHROPIC_API_KEY=your_key_here

# 3. Build the MCP server
npm run build

# 4. Register in Cursor / Claude Desktop / Windsurf
# See MCP Config section below
```

### MCP Config (cursor_settings.json / claude_desktop_config.json)

```json
{
  "mcpServers": {
    "permutations": {
      "command": "node",
      "args": ["/absolute/path/to/permutations/dist/server.js"],
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
| **Groq** (default, fastest) | `GROQ_API_KEY` | llama-4-scout-17b-16e-instruct |
| **OpenAI** | `OPENAI_API_KEY` | gpt-4.1 |
| **Anthropic** | `ANTHROPIC_API_KEY` | claude-3-7-sonnet-latest |
| **Gemini** | `GEMINI_API_KEY` | gemini-2.5-pro-latest |
| **OpenRouter** | `OPENROUTER_API_KEY` | meta-llama/llama-4-scout |
| **HuggingFace** | `HUGGINGFACE_API_KEY` | meta-llama/Meta-Llama-3-8B-Instruct |
| **Total** | **6 providers** | Fallback priority: Groq → OpenAI → Anthropic → Gemini → OpenRouter → HuggingFace |

---

## The `generate_design_genome` Tool

### Parameters

| Parameter | Required | Description |
|---|---|---|
| `intent` | ✅ | Natural language design prompt. Can be vague ("street fashion brand") or specific ("minimal data dashboard for a crypto trading desk") |
| `seed` | ✅ | Unique string that determines the DNA hash. Same seed always produces the same genome. Use `projectName-componentName` |
| `project_context` | Optional | Overarching brand narrative. If provided, even a partial intent like "pricing table" will be shaped by this context (e.g. "biological planetary adaptation theme") |
| `brand_asset_paths` | Optional | Array of absolute paths to brand PDFs or logos. Images → dominant hue extraction. PDFs → text context extraction. These epigenetically override the hash |

### Output Fields

| Field | Description |
|---|---|
| `genome` | Full 32-chromosome JSON object. All design decisions encoded (ch0-sector through ch32-token_inheritance) |
| `tailwindConfig` | Ready-to-paste `tailwind.config.js` with all chromosome values injected |
| `cssVariableBlock` | CSS custom properties file for runtime injection |
| `topology` | Structural sections object describing the layout skeleton |
| `webglComponents` | JSX code for the DNA-driven 3D element (if `ch18_rendering.primary === "webgl"`) |
| `fxAtmosphere` | `.fx-atmosphere` CSS class (glassmorphism, CRT noise, fluid mesh, or glitch) |
| `svgBiomarker` | Parametric SVG brand mark derived from `ch15_biomarker.geometry` and `ch12_signature.entropy` |

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

## Design Exploration Tools

### Generate Dynamic Component

Generate ANY component type from description + genome. No hardcoded templates—structure is derived from purpose and elements:

```
generate_dynamic_component(
  genome: genome_result.genome,
  purpose: "pricing",
  elements: ["title", "price", "period", "feature_list", "cta"],
  layout: "vertical",
  complexity: "molecular"
)
→ Returns: HTML, CSS, JS with full derivation tracking
```

### Mutate Genome (Breeding)

Generate design variants while preserving what you love:

```
mutate_genome(
  genome: parent_genome,
  preserve: ["ch3_type_display", "ch5_color_primary"],  // Keep these
  target_chromosomes: ["ch7_edge", "ch11_texture"],      // Vary these
  mutation_rate: 0.3,  // 0.1=subtle, 0.5=dramatic
  count: 3             // Generate 3 variants
)
→ Returns: Array of variants with similarity scores
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
| **Playwright** (default) | Browser installed | JavaScript-rendered sites, computed styles | Requires `npx playwright install` |
| **Native fetch** (fallback) | No browser | Zero dependencies, fast | Static HTML only, no JS-rendered content |
| **Scrapy** (optional) | Python available | Professional crawling, rate limiting, proxies | Requires Python + `pip install scrapy` |

**Install Playwright (recommended):**
```bash
npm install
npx playwright install chromium
```

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
| ch5 | color_primary | Primary hue/saturation/lightness |
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
node dist/generate-design.js
```

Or use the MCP tools directly via the server.

---

## Dogfooding

The product website at `website/` was built using the output of this engine. The website's primary color, font family, edge radius, SVG brand mark in the navbar, and 3D element rendering mode are all mathematically determined by the genome — not hand-crafted.
