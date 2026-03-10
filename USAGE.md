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
| **Groq** (default, fastest) | `GROQ_API_KEY` | llama-3.1-70b-versatile |
| **OpenAI** | `OPENAI_API_KEY` | gpt-4o-mini |
| **Anthropic** | `ANTHROPIC_API_KEY` | claude-3-haiku-20240307 |

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
| `genome` | Full 18-chromosome JSON object. All design decisions encoded as floats |
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

| Chromosome | Controls |
|---|---|
| ch1_structure | Layout topology (flat/deep/radial/graph) |
| ch2_rhythm | Spacing density |
| ch3_type_display | Display font family + weight |
| ch4_type_body | Body font family |
| ch5_color_primary | Primary hue/saturation/lightness |
| ch6_color_temp | Background temperature |
| ch7_edge | Border radius |
| ch8_motion | Animation physics |
| ch9_grid | Grid logic (column/masonry/radial/broken) |
| ch10_hierarchy | Element depth/z-index strategy |
| ch11_texture | Surface material (grain, flat, glass) |
| ch12_signature | Unique entropy/mutation identifier |
| ch13_atmosphere | FX layer (glassmorphism/crt_noise/fluid_mesh) |
| ch14_physics | 3D material (glass/metallic/neumorphism/matte) |
| ch15_biomarker | SVG geometry (organic/fractal/monolithic) |
| ch16_typography | Full type scale (display → small sizes and ratios) |
| ch17_accessibility | WCAG profile (contrast ratio, motion, touch target) |
| ch18_rendering | Rendering strategy (webgl/css/svg/static) |

---

## Standlone Generation Script

To regenerate the product page DNA independently without an AI IDE:

```bash
GROQ_API_KEY=your_key npx tsx generate-product-dna.ts
```

This outputs a `dna_output_v2.txt` and `website/src/genome.json` with the full genome used by the product website.

---

## Dogfooding

The product website at `website/` was built using the output of this engine. To verify:

1. Run `npx tsx generate-product-dna.ts` to regenerate `genome.json`
2. Run `cd website && npm run dev`
3. Inspect `localStorage` or the page source — the primary color, fonts, border-radius, and SVG biomarker are all injected from `genome.json` at runtime via CSS custom properties

The website's primary color, font family, edge radius, SVG brand mark in the navbar, and 3D element rendering mode are all mathematically determined by the genome — not hand-crafted.
