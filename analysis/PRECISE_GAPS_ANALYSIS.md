# Precise Gap Analysis: Permutations Generation vs Real-World Designs

## How Designs Are Actually Generated

### The Generation Pipeline

```
Intent String → LLM Extractor → 5 Traits → Sequencer → 18 Chromosomes → Generators → Output
                (Groq/OpenAI/                    (SHA-256 +        (CSS, WebGL,
                 Anthropic)                      Trait Logic)       SVG, HTML)
```

### Step 1: Trait Extraction (LLM)

**Input:** Intent string (e.g., "A dark, avant-garde product landing page...")

**Output:** 5 normalized traits (0.0 - 1.0)
```typescript
interface ContentTraits {
    informationDensity: 0.5,      // 0.1 (sparse) to 0.9 (data-heavy)
    temporalUrgency: 0.5,         // 0.1 (archival) to 0.9 (real-time)
    emotionalTemperature: 0.5,    // 0.1 (clinical) to 0.9 (warm)
    playfulness: 0.5,             // 0.1 (strict) to 0.9 (whimsical)
    spatialDependency: 0.5,       // 0.1 (flat CSS) to 0.9 (immersive 3D)
}
```

**The Problem:** These 5 traits don't capture sector-specific needs.
- "Healthcare patient portal" and "Crypto trading dashboard" might both score high on `informationDensity` and `temporalUrgency`
- But they need completely different: hero types, trust signals, color psychology, imagery
- The LLM has no training on the 100-site analysis - it extracts generic vibes, not functional patterns

### Step 2: Genome Sequencing (Deterministic + Trait-Driven)

**Mechanism:** SHA-256 hash of seed + trait-based chromosome selection

**Key Code Paths:**
```typescript
// From sequencer.ts

// 1. Topology selection (lines 17-24)
if (traits.informationDensity > 0.7 && traits.temporalUrgency > 0.6) {
    topology = "flat"; // Dashboards
} else if (traits.temporalUrgency < 0.4 && traits.informationDensity < 0.6) {
    topology = "deep"; // Long form
} else {
    topology = selectFromHash(bytes[0], ["flat", "deep", "graph", "radial"]);
}

// 2. 3D Biomarker (lines 78-80) - ALWAYS GENERATED
let geometry: "monolithic" | "organic" | "fractal" = "monolithic";
if (traits.playfulness > 0.6) geometry = "organic";
else if (traits.informationDensity > 0.7) geometry = "fractal";

// 3. Color generation (lines 83-87)
let hue = Math.round(b(10) * 360); // 0-360 random
if (epigenetics?.epigeneticHue !== undefined) {
    hue = epigenetics.epigeneticHue; // Only override if brand asset uploaded
}

// 4. Background temp (line 108)
backgroundTemp: temp === "warm" ? "neutral" : "cool"
```

### Step 3: Constraint Solving

**Applied Constraints (from constraint-solver.ts):**

| Trigger | Constraint | Priority |
|---------|-----------|----------|
| temporalUrgency > 0.8 | physics = "none" | 9 |
| informationDensity > 0.8 | density = "airtight" | 8 |
| playfulness < 0.2 | radius = 0 | 8 |
| playfulness > 0.7 | physics = "spring" | 7 |
| emotionalTemperature > 0.7 | charge = "humanist" | 6 |
| emotionalTemperature < 0.3 | charge = "geometric" | 6 |

**Missing Constraints:**
- Sector-appropriate hero types
- Color psychology by industry
- Trust signal requirements
- Image treatment styles
- Content depth modeling

### Step 4: Output Generation

**CSS Generator:**
- Primary color: HSL from ch5_color_primary
- Background: Binary cool (#0a0a0a) vs warm (#fafaf9)
- Typography: 4 font families per charge type
- Spacing: baseSpacing from ch2_rhythm

**WebGL Generator:**
- ALWAYS generates a 3D shape (organic=torusKnot, fractal=icosahedron, monolithic=box)
- ALWAYS includes in generated code
- Material from ch14_physics

**SVG Generator:**
- Biomarker shape based on ch15_biomarker.geometry
- Complexity drives point count/segmentation

---

## The Gaps: Mapped to Real-World Analysis

### Gap 1: The 3D Biomarker Problem

**Generation Logic:**
```typescript
// webgl-generator.ts lines 15-30
const { geometry, complexity } = genome.chromosomes.ch15_biomarker;
// ... generates R3F component with rotating 3D shape
```

**Real-World Usage (from compiled analysis):**

| Sector | Sites Analyzed | Decorative 3D Usage | Functional 3D Usage |
|--------|---------------|--------------------|---------------------|
| Tech/SaaS | 12 | 0% | 0% |
| Healthcare | 9 | 0% | 0% |
| Education | 8 | 0% | 0% |
| Real Estate | 8 | 0% | 0% |
| Food | 8 | 0% | 0% |
| Fashion | 8 | 0% | 0% |
| Automotive | 8 | **0%** | **~25%** (configurators only) |
| Entertainment | 8 | 0% | 0% |
| Banking | 8 | 0% | 0% |
| Travel | 8 | 0% | 0% |
| Manufacturing | 8 | 0% | 0% |
| Legal | 8 | 0% | 0% |
| Sports | 8 | 0% | 0% |
| **TOTAL** | **111 sites** | **<1%** | **<2%** |

**The Disconnect:**
- Permutations generates `ch15_biomarker` for **100%** of outputs
- Real sites use decorative 3D in **<1%** of cases
- Automotive configurators (BMW, Mercedes) use functional 3D - not decorative torusKnots

**Specific Mismatches from Analysis:**

| Site | Real Hero | Permutations Generates |
|------|-----------|----------------------|
| Linear (line 19) | Live product UI screenshots | torusKnot 3D shape ❌ |
| Stripe (line 25) | Live GDP counter + screenshots | icosahedron 3D shape ❌ |
| Vercel (line 27) | Single brand triangle logo | torusKnot 3D shape ❌ |
| Shopify (line 29) | Full-bleed product video | torusKnot 3D shape ❌ |
| Mayo Clinic | Trust imagery, credentials | torusKnot 3D shape ❌ |
| Harvard | Content grid, editorial | torusKnot 3D shape ❌ |
| Zillow | Search-first, map integration | torusKnot 3D shape ❌ |
| Nike | Product grid, athlete imagery | torusKnot 3D shape ❌ |

### Gap 2: Hero Type Selection

**Current State:** No hero type chromosome exists
**Result:** Every site gets a 3D biomarker hero

**Real Hero Types Found (from analysis lines 19-57):**

```
Product UI Hero:        35% (Linear, Figma, Asana)
Stats/Social Proof:     18% (Stripe live counter)
Video Background:       15% (Shopify, Notion)
Brand Logo Only:        12% (Vercel minimalism)
Content Carousel:       10% (Figma use cases)
Search/Discovery:       45% (Real estate, travel, education)
Trust/Authority:        60% (Healthcare, banking, legal)
Aspirational Imagery:   40% (Fashion, automotive, travel)
Editorial Content:      25% (Education, news)
Product Configurator:   25% (Automotive only - functional)
```

**Missing Generation Logic:**
```typescript
// Does not exist in codebase
interface HeroChromosome {
    type: "product_ui" | "product_video" | "brand_logo" | 
          "stats_counter" | "search_discovery" | "content_carousel" |
          "trust_authority" | "aspirational" | "configurator" | "editorial";
    contentSource: string; // Path to screenshots, video URL, etc.
    layout: "centered" | "split" | "fullbleed" | "overlay";
}
```

### Gap 3: Color Psychology

**Current Logic:**
```typescript
// sequencer.ts line 83-87
let hue = Math.round(b(10) * 360); // Random 0-360
// OR override if brand asset uploaded
if (epigenetics?.epigeneticHue !== undefined) {
    hue = epigenetics.epigeneticHue;
}

// css-generator.ts lines 56-58
background: ch6_color_temp.backgroundTemp === "cool" ? "#0a0a0a" : "#fafaf9"
```

**Real Color Patterns (from analysis extraction):**

| Site | Primary Color | Psychology | Sector |
|------|---------------|------------|--------|
| Stripe | `rgb(83,58,253)` (purple) | Trust, innovation | Fintech |
| Toyota | `rgb(225,10,29)` (red) | Energy, reliability | Automotive |
| Apple | `rgb(0,113,227)` (blue) | Clean, premium | Tech |
| Linear | `#0D0D0D` (OLED black) | Technical precision | Developer Tool |
| Mayo Clinic | Warm blues | Trust, calm | Healthcare |
| Chase Bank | Deep blue | Security, stability | Banking |

**Gap:** No sector-based color psychology mapping
- Healthcare should bias toward: blues, greens, warm whites (trust, calm, healing)
- Fintech should bias toward: deep purples, navy blues (trust, stability)
- Automotive should use: brand colors, energetic accents
- Legal should use: navy, gold, traditional authority colors

### Gap 4: Typography System

**Current Selection (sequencer.ts lines 147-158):**
```typescript
// Only 4 options per category
selectDisplayFont(byte, charge):
  monospace → "Space Mono, JetBrains Mono, monospace"
  humanist → "Fraunces, Playfair Display, serif"
  geometric → "Space Grotesk, system-ui, sans-serif"
  transitional → "system-ui, -apple-system, sans-serif"

selectBodyFont(byte, charge):
  monospace → "IBM Plex Mono, Courier, monospace"
  humanist → "Merriweather, Georgia, serif"
  geometric/transitional → "system-ui..."
```

**Real Typography (from browser extraction):**

| Site | Display Font | Body Font | Type |
|------|--------------|-----------|------|
| Stripe | `sohne-var` (custom) | `sohne-var` (custom) | Custom designed |
| Apple | `SF Pro Display` | `SF Pro Text` | System font |
| Linear | `Inter` / System | `Inter` / System | Modern sans |
| Toyota | `tcomMed` (custom) | `HelveticaNeueMedium` | Custom hybrid |
| Vercel | `Geist` (custom) | `Geist` (custom) | Custom designed |

**Gap:**
1. Permutations offers 4 font families
2. Real sites use custom-designed fonts
3. No variable font support
4. No web font loading mechanism (Google Fonts, Adobe Fonts, etc.)

### Gap 5: Motion Physics

**Current Options (ch8_motion):** none, spring, step, glitch

**Real Motion Patterns (from analysis):**

| Site | Motion Type | Purpose | Physics |
|------|-------------|---------|---------|
| Stripe | Live GDP counter | Functional proof | Number animation |
| Linear | Product UI hover | Functional demo | Subtle interaction |
| Notion | Savings calculator | Functional tool | Value animation |
| Figma | Use case carousel | Navigation | Slide transition |
| Shopify | Video backgrounds | Aspirational | Video playback |
| Vercel | Logo ray effects | Brand identity | CSS gradient animation |

**Gap:** Permutations treats motion as decorative (`spring`, `glitch`) when real sites use motion for:
- Functional demonstrations (counters, calculators)
- Navigation (carousels, tabs)
- Brand expression (subtle effects)
- NEVER for abstract 3D rotation (which Permutations always includes)

### Gap 6: Archetype Coverage

**Current Archetypes (6):**
1. dashboard - Departure Board
2. portfolio - Gallery
3. documentation - Monastic Library
4. commerce - Bazaar
5. landing - Ritual Space
6. blog - Periodical

**Missing Archetypes (12+ needed based on analysis):**

| Archetype | Sector | Key Pattern | Current Coverage |
|-----------|--------|-------------|------------------|
| healthcare_trust | Healthcare | Credentials, warm, accessible | ❌ None |
| education_discovery | Education | Search, course grid, hierarchy | ❌ None |
| realestate_search | Real Estate | Map+list, filters, location | ❌ None |
| fintech_security | Banking | Trust signals, security badges | ❌ None |
| automotive_configurator | Automotive | 3D product, options, pricing | ❌ None |
| fashion_editorial | Fashion | Visual-first, lifestyle, grid | ❌ None |
| food_service | Food | Appetite imagery, location, order | ❌ None |
| travel_discovery | Travel | Destination search, deals, booking | ❌ None |
| manufacturing_capability | Manufacturing | Specs, innovation, process | ❌ None |
| legal_authority | Legal | Credentials, expertise, formal | ❌ None |
| entertainment_content | Entertainment | Discovery, personalization, grid | ❌ None |
| sports_energy | Sports | Action, schedules, community | ❌ None |

---

## The Combinatorics Problem

### Claimed Diversity
> "360 hues × 3 temperatures × 4 topologies × 4 densities × 4 motions × 4 grids = ~27,000 variants"

### Actual Useful Diversity

**For a healthcare site, constraints are:**
- Background: Light (professional) = 1 option
- Hero: Trust-focused imagery = **NOT AVAILABLE**
- Typography: Humanist, readable = 1 option
- Color: Blue/green range (trust/calm) = ~60 hues
- 3D Elements: **NONE** (inappropriate) = 0 options
- Motion: Minimal, functional = 1 option

**Actual useful variants: ~60**
**Permutations generates: 27,000**
**Success rate: 0.2%**

### Per-Sector Analysis

| Sector | Useful Permutations | Generated | Success Rate |
|--------|--------------------|-----------|--------------|
| Healthcare | ~50 | 27,000 | 0.2% |
| Fintech | ~100 | 27,000 | 0.4% |
| Automotive | ~200 | 27,000 | 0.7% |
| E-commerce | ~500 | 27,000 | 1.9% |
| Dashboard | ~1,000 | 27,000 | 3.7% |

---

## Specific Code-Level Gaps

### In `sequencer.ts`:

**Lines 78-80:** Always generates 3D biomarker
```typescript
// SHOULD BE:
if (sector === "automotive" && intent.includes("configurator")) {
    // Generate functional 3D
} else if (sectorRequires3D(sector)) {
    // Skip 3D for 99% of sectors
}
```

**Lines 83-87:** Random hue without sector bias
```typescript
// SHOULD BE:
let hue = getSectorBaseHue(sector); // Healthcare = 200-240 (blues)
hue += varianceFromHash(bytes[10]); // ±30° variation
```

**Line 108:** Binary background temp
```typescript
backgroundTemp: temp === "warm" ? "neutral" : "cool"
// RESULT: #0a0a0a or #fafaf9

// SHOULD BE:
background: getSectorBackground(sector, temp)
// Healthcare: #FFFFFF (clean, clinical)
// Fintech: #FFFFFF (trust) or #0D0D0D (premium)
// Automotive: brand colors
```

### In `webgl-generator.ts`:

**Lines 14-70:** Always generates R3F component
```typescript
generateR3F(genome): string {
    // ALWAYS returns 3D component
}

// SHOULD BE:
generateHeroVisual(genome): string {
    switch(genome.chromosomes.ch19_hero_type) {
        case "product_ui": return generateProductScreenshots();
        case "brand_logo": return generateLogoHero();
        case "stats_counter": return generateLiveCounter();
        case "configurator": return generateR3F(); // Only here!
        default: return generateStandardHero();
    }
}
```

### In `css-generator.ts`:

**Lines 56-58:** Binary color choice
```typescript
background: ch6_color_temp.backgroundTemp === "cool" ? "#0a0a0a" : "#fafaf9"

// SHOULD BE:
background: generateSectorBackground(sector, temp, brandColors)
```

**Lines 60-62:** 4 font families
```typescript
fontFamily: {
    display: [ch.ch3_type_display.family], // 4 options
    body: [ch.ch4_type_body.family],       // 3 options
}

// SHOULD BE:
fontFamily: {
    display: [getSectorFont(sector, charge)], // Load from Google/Adobe/custom
    body: [getSectorBodyFont(sector)],
}
```

---

## Recommendations

### Immediate (Fixes Current Architecture)

1. **Add sector parameter to extraction**
```typescript
extractTraits(intent: string, sector: Sector, projectContext?: string)
// sector: "healthcare" | "fintech" | "automotive" | "education" | ...
```

2. **Make ch15_biomarker optional**
```typescript
// In archetypes.ts
const ARCHETYPES = {
    healthcare: {
        generate3D: false, // Never
    },
    automotive_configurator: {
        generate3D: true, // Functional only
    }
}
```

3. **Add sector-based color psychology**
```typescript
const SECTOR_COLOR_PROFILES = {
    healthcare: { hueRange: [200, 240], saturation: [0.3, 0.6], lightness: [0.9, 1.0] },
    fintech: { hueRange: [240, 280], saturation: [0.5, 0.8], lightness: [0.15, 0.95] },
    automotive: { hueRange: [0, 360], saturation: [0.7, 1.0], lightness: [0.1, 0.9] }, // Brand colors
}
```

### Architectural (Next Version)

1. **Add ch19_hero_type chromosome**
   - 10+ hero types based on analysis
   - Content source handling (screenshots, videos, logos)

2. **Add sector-specific archetypes**
   - 12+ missing archetypes
   - Per-sector constraint profiles

3. **Real-world pattern training**
   - Feed 100-site analysis into LLM training
   - Validate generated designs against real patterns

4. **Functional vs Decorative separation**
   - Decorative 3D: opt-in only
   - Functional motion: default

---

*Analysis based on codebase review + 111-site compiled analysis*
*Date: March 2026*
