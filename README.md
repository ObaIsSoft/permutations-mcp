# Permutations MCP Engine

A Model Context Protocol (MCP) server that generates **unique, reproducible design systems** from a three-layer SHA-256 genome chain. Prevents AI-generated "slop" (identical Tailwind UI) by enforcing mathematical constraints at every layer.

**No Templates. No Slop. Only Math.**

---

## The Problem

Every AI-generated website looks the same:
- Inter font + blue-purple gradients
- Rounded-xl cards in a 3-column grid
- Generic hero section with "Trusted by" logos
- Parallax scroll that makes you dizzy

**This isn't a design choice — it's a failure of constraints.** LLMs default to "safe" patterns because they have no guardrails forcing creativity.

## What This Tool Does

Permutations generates three interlocking genomes from a single seed:

**Layer 1 — DesignGenome:** *What does it look like?*
32-chromosome DNA: color system (with dark-mode-safe variants), typography, motion physics, grid logic, edge style, hero strategy, trust signals, copy intelligence, state topology, routing pattern, token inheritance.

**Layer 2 — EcosystemGenome:** *What kind of components are these?*
12-chromosome ecology derived from the design genome. Biome (32 classes), energy source (16 types), symbiosis pattern (16 types), trophic structure (16 types), succession stage (12 stages), adaptation axis (16 axes), population pattern (16 patterns), temporal rhythm (16 rhythms), spatial axis (16 dimensions), capacity class (16 levels), mutation rate, and expressiveness — each a functional metaphor that answers: how many components, how tightly coupled, how data flows between them.

**Layer 3 — CivilizationGenome:** *How is the application structured?*
16-chromosome architecture derived from the ecosystem. Archetype (16 types), governance model (14 types), economics (12 models), technology class (24 types), culture emphasis (28 types), resilience pattern, knowledge model, expansion mode (20 types), age class, fragility rate, topology shape (12 types), cosmology belief (16 types), memory model (12 types), interface mode (16 types), evolution strategy (16 types), and communication protocol (16 types). Each chromosome maps to a concrete architecture decision with LLM glossary explanations.

**What it is not:** a code generator. Ecosystem and civilization tools return specs and architecture direction. You — or your agent — implement from those constraints.

---

## The Solution

**Three-layer SHA-256 hash chain:** `seed → DesignGenome → EcosystemGenome → CivilizationGenome`

Each layer is deterministic (same seed = same result forever) and derived from the previous layer's hash. Predecessor chromosome values bias successor selections via a weighted gravity system — this is not just hash ancestry, the actual design values flow downstream.

**Vocabulary-invariant complexity scoring:** Complexity tier is computed from what the product *does*, not how it's described. "A tool doctors use to track patients" and "clinical monitoring dashboard" produce the same tier. The LLM answers 10 binary/count structural questions about product behavior; deterministic code maps those answers to a complexity score.

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

Add to Cursor/Claude Desktop/Windsurf `mcp.json`:

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

```
"Generate a design genome for a Japanese Y2K football stats dashboard"
```

The tool runs a single LLM call to extract structural properties (complexity tier, entity types, real-time requirements) and design character (sector, traits, copy intelligence). Then it sequences all three genome layers deterministically from the SHA-256 hash.

### 4. Read the Brief

Call `generate_design_brief` before writing any code. It converts all three genome layers into plain language: visual strategy, component relationships, architecture direction, copy tone.

### 5. Build from It

Your agent builds from the genome tokens and brief. Call `validate_design` before shipping — it checks constraint violations and slop patterns, returns a `slop_score`.

---

## Tool Workflow (8 tools) — ENFORCED

```
STEP 1  generate_design_genome    ← ALWAYS START HERE
        [BLOCKING: Write genome.json checkpoint]
        [VERIFY: 32 chromosomes accessible]
        
STEP 2  generate_design_brief     ← MANDATORY before any code
        [OUTPUT: DESIGN_SYSTEM.md constitution]
        
STEP 3  generate_ecosystem        ← REQUIRED for components
        [RULE: microbial → flora → fauna hierarchy]
        [RULE: Use containment relationships]
        
STEP 4  generate_civilization     ← REQUIRED if complexity ≥ 0.68
        [INPUT: ecosystem from Step 3]
        
FINAL   validate_design           ← SHIPPING GATE (blocking)
        [CHECK: slop patterns, chromosome drift, utilization ≥ 80%]

ALTERNATIVE  extract_genome_from_url  ← use instead of STEP 1 when you have a reference site
EXPORT       generate_formats         ← export tokens to Figma/Style Dictionary after STEP 1
ITERATE      update_design_genome     ← adjust chromosomes after STEP 1 ("make it warmer")
```

The `generate_design_genome` response includes `suggested_next` — a dynamic list telling the agent which tools to call next based on the genome's complexity score.

---

## Available MCP Tools

### `generate_design_genome` — STEP 1
Full pipeline: structural analysis → LLM extraction → DNA sequencing across all three layers. Returns genome, CSS, topology, and `genome_report` markdown explaining every chromosome.

Pass `offline: true` to skip LLM and use hash-based inference (no API key needed, fully deterministic).

**Font providers:**
- `"google"` — Google Fonts (1000+ fonts) *(default)*
- `"bunny"` — Bunny Fonts, privacy-focused, mirrors Google catalog
- `"fontshare"` — Fontshare (~100 curated fonts: Satoshi, Cabinet Grotesk, etc.)
- `"none"` — returns family name only — use when you manage font loading yourself

Match the provider to the font. If `extract_genome_from_url` returns a Fontshare font (e.g., `satoshi`), pass `font_provider: "fontshare"`.

### `generate_design_brief` — STEP 2
Converts all three genome layers into human/agent-readable design direction: visual strategy, component relationships, architecture direction, copy tone. Read this before writing any code.

### `generate_ecosystem` — STEP 3 (optional)
Generates a biological component hierarchy from the EcosystemGenome (L2): microbial (atomic), flora (composite), fauna (complex). Returns component specs, prop contracts, and containment relationships — **not code**. Includes `ecosystem_report` markdown and `ecosystemGenome` for the civilization layer.

### `generate_civilization` — STEP 4 (optional, complexity ≥ 0.68)
Returns application architecture direction from the CivilizationGenome (L3): state topology, routing patterns, token inheritance rules. **Specs by default.** Pass `generate_code: true` to opt into TSX output. Includes `civilization_report` markdown.

### `validate_design` — FINAL STEP
Checks generated CSS/HTML against genome DNA constraints and forbidden slop patterns. Returns violation list and `slop_score`.

### `extract_genome_from_url` — ALTERNATIVE ENTRY
Reverse-engineer a genome from any website URL using Playwright. Use for "I love this site, make something like it" workflows.

### `generate_formats` — EXPORT
Export design tokens to Figma Tokens, Style Dictionary (CSS/SCSS/iOS/Android), styled-components, Emotion, Vue 3 SFC, or Svelte.

### `update_design_genome` — ITERATE
Adjust specific chromosomes in an existing genome. Use for "make it warmer", "change sector to fintech", "reduce motion" workflows.

---

## Two Modes of Operation

### Mode 1: LLM-Aware (Default)

Requires one API key. Single LLM call returns structural props + traits + sector + copy intelligence.

```json
{
  "intent": "Japanese Y2K football stats dashboard",
  "seed": "project-v1",
  "project_context": "Built for hardcore fans who live in the data",
  "brand_asset_paths": ["/assets/logo.png"]
}
```

Supported providers: Groq, OpenAI, Anthropic, Google Gemini, OpenRouter, HuggingFace.

### Mode 2: Offline (No LLM)

```json
{
  "intent": "minimal portfolio site",
  "seed": "studio-portfolio-2026",
  "offline": true
}
```

No API key required. Hash-based trait inference. Sector defaults to `technology`. Fully deterministic.

---

## What You Get

```json
{
  "genome": {
    "dnaHash": "2f51eec6c7043eedf0fc9f69a4181997...",
    "chromosomes": {
      "ch5_color_primary": {
        "hue": 28,
        "hex": "#8b3a12",
        "darkModeHex": "#d4824a",
        "darkModeLightness": 0.62
      },
      "ch3_type_display": { "family": "Space Grotesk", "charge": "geometric" },
      "ch8_motion": { "physics": "spring", "durationScale": 0.3 },
      "ch9_grid": { "logic": "masonry", "asymmetry": 0.7 },
      "ch30_state_topology": "distributed",
      "ch31_routing_pattern": "federated"
    }
  },
  "ecosystemGenome": {
    "chromosomes": {
      "eco_ch1_biome": { "class": "rainforest", "intensity": 0.74 },
      "eco_ch3_symbiosis": { "pattern": "mutualistic", "depth": 0.68 },
      "eco_ch4_trophic": { "structure": "web", "cascade": 0.51 }
    }
  },
  "civilizationGenome": {
    "chromosomes": {
      "civ_ch1_archetype": { "class": "maritime", "intensity": 0.82 },
      "civ_ch2_governance": { "model": "federated", "rigidity": 0.31 },
      "civ_ch7_knowledge": { "model": "distributed", "entropy": 0.44 }
    }
  },
  "css": "/* Full design token stylesheet */",
  "genome_report": "# Genome Report\n\n## Intent → DNA\n...",
  "suggested_next": [
    { "tool": "generate_design_brief", "reason": "Read before writing any code", "always": true },
    { "tool": "generate_ecosystem", "reason": "Building a component library", "when": "complexity >= 0.45" }
  ]
}
```

---

## How It Works

```
Intent + Seed + Context
         │
         ▼
  LLM: 10 structural questions (binary/count)    ← vocabulary-invariant complexity
  + 8 design character traits (0.0–1.0)          ← visual/interaction character
  + sector detection + copy intelligence
         │
         ▼
  computeComplexityFromStructure()               ← deterministic — no LLM
  → finalComplexity → tier
         │
         ▼
  SHA-256 → 32 Chromosomes (L1: DesignGenome)
  Epistasis rules  + forbiddenRanges + gravity
         │ sha256(dnaHash)
         ▼
  EcosystemGenome (L2: 11 chromosomes)
  Gravity: design values → ecological selections
  ├─ dark + metallic  → hydrothermal biome
  ├─ spring physics   → photosynthetic energy
  └─ deep topology    → top-down trophic
         │ sha256(ecoHash)
         ▼
  CivilizationGenome (L3: 10 chromosomes)
  Gravity: ecosystem values → architecture selections
  ├─ mutualistic symbiosis → federated governance → distributed state
  ├─ web trophic           → distributed knowledge → federated routing
  └─ predatory energy      → warrior archetype
         │
    ┌────┴────┐
    ▼         ▼
  CSS       genome_report + ecosystem_report + civilization_report
  Tokens    (explainability markdown for every decision)
```

---

## Color Philosophy

Sectors define **forbidden hue ranges** — what's psychologically wrong. The hash selects freely from the rest.

| Sector | Forbidden | Rationale |
|---|---|---|
| technology | none | Cloudflare=orange, GitHub=dark, Stripe=purple — all correct |
| healthcare | `[0°–20°]`, `[320°–360°]` | Blood red + magenta signal danger |
| fintech | `[60°–100°]` | Casual yellow-green reads amateur |
| food | `[220°–280°]` | Cold corporate blue kills appetite |
| gaming | `[160°–200°]` | Clinical teal kills energy |

Two different technology products with different seeds get different hues. **No more blue-purple prison.**

Dark mode: `darkModeHex` is always generated at 58–74% lightness. The base `hex` (22–35%) is for light mode only. Use `--color-primary-interactive` for buttons and links on dark backgrounds.

---

## Anti-Slop Pattern Detection

| Pattern | Why It's Slop |
|---|---|
| `font: Inter` + blue gradient | Ultimate SaaS trope |
| `bg-gradient-to-r from-blue-* to-purple-*` | Signals zero design intent |
| `grid-cols-3` pricing | Most overused layout |
| `parallax` | Motion sickness trigger |
| `rounded-xl` on every card | Generic component library look |

---

## Supported LLM Providers

| Provider | Environment Variable |
|---|---|
| Groq (llama-3.3-70b) | `GROQ_API_KEY` |
| OpenAI (gpt-4.1) | `OPENAI_API_KEY` |
| Anthropic (claude-3-7-sonnet) | `ANTHROPIC_API_KEY` |
| Google Gemini (gemini-2.0-flash) | `GEMINI_API_KEY` |
| OpenRouter | `OPENROUTER_API_KEY` |
| HuggingFace | `HUGGINGFACE_API_KEY` |

Auto-detection priority: Groq → OpenAI → Anthropic → Gemini → OpenRouter → HuggingFace

---

## Development

```bash
npm run build   # compile TypeScript
npm test        # run 49 tests (requires Node.js 20+)
npm run dev     # watch mode
```

Tests cover: determinism, uniqueness (10 seeds), sector-awareness, epistasis enforcement, ecosystem-civilization bridge, pattern detection.

---

## Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Three-layer genome chain, StructuralProps, chromosome reference, gravity system, tier calibration
- **[.cursorrules](./.cursorrules)** — Agent workflow rules (10 rules for correct tool usage)

---

## License

MIT
