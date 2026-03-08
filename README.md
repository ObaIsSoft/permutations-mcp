# Permutations MCP Engine

A Model Context Protocol (MCP) server that generates **unique, reproducible design systems** using biological inheritance metaphors. Prevents AI-generated "slop" (identical Tailwind UI) by enforcing mathematical constraints.

**No Templates. No Slop. Only Math.**

---

## The Problem

Every AI-generated website looks the same:
- Inter font + blue-purple gradients
- Rounded-xl cards in a 3-column grid
- Generic hero section with "Trusted by" logos
- Parallax scroll that makes you dizzy

**This isn't a design choice—it's a failure of imagination.** LLMs default to "safe" patterns because they have no constraints forcing creativity.

## The Solution

Permutations treats design like **biological inheritance**. Each project gets a unique 15-chromosome DNA that:
- ✅ Guarantees unique output (different seed = different design)
- ✅ Guarantees reproducibility (same seed = same design forever)
- ✅ Forbids generic patterns (no Inter font, no blue-purple gradients)
- ✅ Respects functional requirements (dashboards MUST be scannable)

**Output:** A complete design system—Tailwind config, CSS variables, layout topology, WebGL components, atmospheric effects.

---

## Quick Start

### 1. Install

```bash
npm install -g permutations-mcp
# or clone and build
git clone https://github.com/ObaIsSoft/Permutations.git
cd Permutations && npm install && npm run build
```

### 2. Configure Your IDE

Add to Cursor/Claude Desktop/Windsurf:

```json
{
  "mcpServers": {
    "permutations": {
      "command": "node",
      "args": ["/path/to/permutations/dist/server.js"],
      "env": {
        "GROQ_API_KEY": "gsk_..."
      }
    }
  }
}
```

### 3. Generate DNA

Ask your AI to design something:

```
"Generate a design genome for a Japanese Y2K football stats dashboard"
```

Your AI receives:
- 15-chromosome DNA (colors, typography, motion, grid)
- Tailwind config
- CSS atmospheric effects
- WebGL component specs
- **Forbidden patterns list** (enforced at generation)

### 4. Build the UI

Your AI generates code using the DNA constraints. The `validate_design` tool checks for slop violations.

---

## Two Modes of Operation

### Mode 1: Content-Aware (With LLM)

Upload brand assets. The engine extracts:
- **Logo colors** → Primary hue override
- **PDF content** → Typography tone
- **Image textures** → Surface quality

```json
{
  "intent": "Architect portfolio",
  "seed": "client-smith-2024",
  "brand_asset_paths": ["/assets/logo.png", "/assets/brief.pdf"]
}
```

Requires: Groq, OpenAI, Anthropic, or Gemini API key.

### Mode 2: Archetype (Offline)

No API key? No problem. Use functional archetypes:

```json
{
  "archetype": "dashboard",
  "seed": "crypto-tracker-v2"
}
```

| Archetype | Function | Key Traits |
|-----------|----------|------------|
| `dashboard` | Data scanning | Flat, monospace, no motion, sharp edges |
| `portfolio` | Work showcase | Deep topology, spring physics, masonry |
| `documentation` | Reading | Single column, humanist serif, static |
| `commerce` | Product browsing | Graph topology, organic edges, tactile |
| `landing` | Conversion | Flat, bold display type, high contrast |
| `blog` | Long-form reading | Deep, high x-height, breathing rhythm |

---

## Available MCP Tools

### `generate_design_genome`
Full pipeline: content analysis → LLM extraction → DNA sequencing.

### `generate_from_archetype`
Offline generation using functional archetypes. No API calls.

### `validate_design`
Check generated CSS/HTML against DNA constraints. Returns slop score.

### `list_archetypes`
List all 6 archetypes with descriptions.

---

## What You Get

```json
{
  "genome": {
    "dnaHash": "2f51eec6c7043eedf0fc9f69a4181997...",
    "chromosomes": {
      "ch1_structure": { "topology": "flat", "maxNesting": 2 },
      "ch3_type_display": { "family": "Space Grotesk", "charge": "geometric" },
      "ch5_color_primary": { "hue": 224, "saturation": 0.4, "lightness": 0.6 },
      "ch8_motion": { "physics": "spring", "durationScale": 0.3 },
      "ch9_grid": { "logic": "masonry", "asymmetry": 0.7 }
    },
    "constraints": {
      "forbiddenPatterns": ["parallax", "bg-gradient-to-r", "rounded-3xl"],
      "bondingRules": ["High temporal urgency → No animations"]
    },
    "viabilityScore": 0.94
  },
  "tailwindConfig": "/* Generated tailwind.config.js */",
  "topology": { "gridType": "masonry", "sections": [...] },
  "webglComponents": "/* React Three Fiber components */",
  "fxAtmosphere": "/* CSS atmospheric effects */",
  "svgBiomarker": "/* Unique SVG generative art */"
}
```

---

## Anti-Slop Pattern Detection

The system detects and forbids:

| Pattern | Why It's Slop |
|---------|---------------|
| `font-inter` | Default AI font, overused |
| `bg-gradient-to-r from-blue-* to-purple-*` | Ultimate SaaS trope |
| `grid-cols-3` pricing | Most overused layout |
| `parallax` | Motion sickness trigger |
| `rounded-xl` cards | Generic component library look |

---

## How It Works

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Content Input  │────▶│  LLM Analysis   │────▶│  15-Chromosome  │
│  (text/images)  │     │  (5 trait axes) │     │  DNA Generation │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                              ┌──────────────────────────┘
                              ▼
                    ┌─────────────────┐
                    │  Epistasis Rules │  (cross-chromosome constraints)
                    │  ├─ Warm color → Cool background
                    │  ├─ Geometric font → Sharp edges
                    │  └─ Dashboard → No animations
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ Tailwind │  │   CSS    │  │  WebGL   │
        │  Config  │  │ Effects  │  │Components│
        └──────────┘  └──────────┘  └──────────┘
```

---

## Supported LLM Providers

| Provider | Model | Best For | Environment Variable |
|----------|-------|----------|---------------------|
| Groq | llama-3.3-70b-versatile | Speed, cost | `GROQ_API_KEY` |
| OpenAI | gpt-4o-mini | JSON reliability | `OPENAI_API_KEY` |
| Anthropic | claude-3-5-sonnet | Reasoning quality | `ANTHROPIC_API_KEY` |
| Google | gemini-1.5-flash | Lowest latency | `GEMINI_API_KEY` |

Auto-detection priority: Groq → OpenAI → Anthropic → Gemini

---

## Website Demo

The `website/` directory is built entirely from Permutations DNA:

```bash
cd website
npm install
npm run build
npm run preview
```

---

## Development

```bash
# Run tests
npm test

# Type check
npx tsc --noEmit

# Build
npm run build

# Watch mode
npm run dev

# Generate DNA for this project
GROQ_API_KEY=xxx npx tsx generate-product-dna.ts
```

---

## Documentation

- **[DESIGN.md](./DESIGN.md)** — Full technical architecture, epistasis rules, 15-chromosome reference

---

## License

MIT
