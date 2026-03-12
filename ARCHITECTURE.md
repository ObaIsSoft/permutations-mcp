# Permutations Architecture
## Context-Aware, Sector-Mapped, Anti-Slop Design Generation

---

## Core Principle: Correlation to Context

The design genome must correlate to:
1. **Sector** (primary + secondary blending)
2. **Content** (analyzed text/images for sub-sector variation)
3. **Intent** (user's stated purpose)
4. **Brand** (identity overrides sector with weighted influence)

---

## The Generation Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                         INPUT LAYER                                  │
├─────────────────────────────────────────────────────────────────────┤
│  Sector: "healthcare" (primary) + "fintech" (secondary)             │
│  Content: PDFs, images, text (analyzed for sub-sector variation)    │
│  Intent: "Patient billing portal for high-net-worth individuals"    │
│  Brand Assets: Logo (red), guidelines (luxury positioning)          │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      CONTENT ANALYSIS LAYER                          │
├─────────────────────────────────────────────────────────────────────┤
│  Text Analysis:                                                      │
│    - "billing", "portal" → high information density                  │
│    - "high-net-worth" → luxury positioning, trust critical           │
│    - "patient" → healthcare context (empathy needed)                 │
│                                                                      │
│  Image Analysis:                                                     │
│    - Logo color: #E53935 (red)                                       │
│    - Brand positioning: luxury, exclusive                            │
│                                                                      │
│  Sub-Sector Classification: "healthcare_financial_luxury"            │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    SECTOR CONSTRAINT LAYER                           │
├─────────────────────────────────────────────────────────────────────┤
│  Primary Sector (healthcare, 70% influence):                         │
│    - Trust signals: REQUIRED (patient data)                          │
│    - Color bias: blues/greens (80% probability)                      │
│    - Hero type: trust_focused OR service_showcase                    │
│    - Typography: humanist or geometric (readable, professional)      │
│                                                                      │
│  Secondary Sector (fintech, 30% influence):                          │
│    - Security signals: HIGH priority                                 │
│    - Color bias: deep purples/navy (added to palette)                │
│    - Motion: minimal, functional (transaction-focused)               │
│                                                                      │
│  Sub-Sector Override (luxury):                                       │
│    - Spacing: generous (maximal rhythm)                              │
│    - Typography: high contrast, dramatic scale                       │
│    - Materials: metallic, glass (premium feel)                       │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     BRAND INTEGRATION LAYER                          │
├─────────────────────────────────────────────────────────────────────┤
│  Brand Color (#E53935 red) vs Sector Bias (blue/green):              │
│                                                                      │
│  Resolution Strategy:                                                │
│    - Primary: Brand red (70% weight) - "We respect your identity"    │
│    - Influence: Red triggers "energy/urgency" in healthcare context  │
│    - Compensation: Increase trust signal prominence (counter urgency)│
│    - Accent: Sector-appropriate blues as secondary palette           │
│                                                                      │
│  Result: Red primary + Blue accents + Enhanced trust signals         │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    GENOME SEQUENCING LAYER                           │
├─────────────────────────────────────────────────────────────────────┤
│  Seed + Sector Profile + Brand Constraints + Content Markers         │
│                                                                      │
│  Generates 20 chromosomes with:                                     │
│    - Constrained randomness (sector-weighted probabilities)          │
│    - Epistasis rules (chromosome interactions)                       │
│    - User-eliminable chromosomes (opt-out flexibility)               │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     OUTPUT GENERATION LAYER                          │
├─────────────────────────────────────────────────────────────────────┤
│  CSS: Sector-appropriate variables + brand overrides                │
│  Hero: Content-aware selection (trust grid, not 3D biomarker)       │
│  Trust Signals: Chromosome-generated structure + content-filled     │
│  3D Elements: ELIMINATED (user preference: no decorative 3D)        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## New Chromosomes (20 Total)

### Sector & Context Chromosomes

| Chromosome | Code | Purpose | Range |
|------------|------|---------|-------|
| ch0_sector_primary | `sec_p` | Primary sector classification | healthcare, fintech, automotive, education, commerce, entertainment, manufacturing, legal, real_estate, travel, food, sports |
| ch0_sector_secondary | `sec_s` | Secondary sector influence (blended) | same as above + null |
| ch0_sub_sector | `sub_sec` | Content-derived sub-classification | e.g., "healthcare_surgical", "healthcare_wellness", "fintech_consumer", "fintech_enterprise" |
| ch0_brand_weight | `brand_w` | Brand vs sector influence ratio | 0.0 (sector dominant) to 1.0 (brand dominant), default 0.7 |

### Hero & Visual Strategy Chromosomes

| Chromosome | Code | Purpose | Range |
|------------|------|---------|-------|
| ch19_hero_type | `hero_t` | Hero visual strategy | product_ui, product_video, brand_logo, stats_counter, search_discovery, content_carousel, trust_authority, service_showcase, editorial_feature, configurator_3d, aspirational_imagery |
| ch19_hero_variant | `hero_v` | Variation within type (hash-derived) | 0.0 - 1.0 (selects layout variant) |
| ch20_visual_treatment | `vis_t` | Image/photography treatment | product_screenshots, lifestyle_photography, studio_product, documentary, macro_detail, architectural, candid_moment |
| ch20_video_strategy | `vid_s` | Video usage approach | background_ambient, product_demo, testimonial, tutorial_walkthrough, brand_story, live_feed |

### Trust & Social Impact Chromosomes

| Chromosome | Code | Purpose | Range |
|------------|------|---------|-------|
| ch21_trust_signals | `trust` | Trust-building approach | credentials, testimonials, stats_counter, security_badges, social_proof_logos, case_studies, guarantees, transparency_reports |
| ch21_trust_prominence | `trust_p` | How prominent trust signals are | subtle, integrated, prominent, hero_feature |
| ch22_social_proof | `social` | Social validation type | customer_logos, user_count, rating_stars, testimonials_grid, community_size, press_mentions |
| ch22_impact_demonstration | `impact` | How impact is shown | live_counter, cumulative_stats, before_after, roi_calculator, timeline_progress |

### Content Structure Chromosomes

| Chromosome | Code | Purpose | Range |
|------------|------|---------|-------|
| ch23_content_depth | `depth` | Number of sections appropriate | minimal (2-3), moderate (4-6), extensive (7-10), comprehensive (10+) |
| ch23_information_architecture | `ia` | How content is organized | funnel_linear, hub_spoke, modular_sections, narrative_scroll, data_dashboard |
| ch24_personalization | `personal` | Dynamic content approach | static, location_based, behavior_based, segment_based, fully_dynamic |

---

## Sector Color Psychology Profiles

### Probability-Based Color Selection

Not rigid rules—weighted probabilities that brand can override.

```typescript
const SECTOR_COLOR_PROFILES = {
  healthcare: {
    primary: {
      blue: 0.40,      // Trust, calm, clinical
      teal: 0.25,      // Healing, wellness
      green: 0.20,     // Health, growth
      white: 0.10,     // Clean, sterile
      other: 0.05      // Brand colors, etc.
    },
    secondary: {
      warm_gray: 0.30,
      soft_blue: 0.25,
      light_green: 0.20,
      cream: 0.15,
      other: 0.10
    },
    accent: {
      coral: 0.20,     // Human warmth
      soft_orange: 0.15,
      lavender: 0.15,
      mint: 0.15,
      other: 0.35
    },
    // Accessibility requirement
    min_contrast: 4.5,
    // Warmth balance (healthcare should feel human, not cold)
    warmth_bias: 0.3   // 30% warmer than pure clinical
  },
  
  fintech: {
    primary: {
      deep_purple: 0.30,  // Innovation, premium
      navy_blue: 0.25,    // Trust, stability
      dark_teal: 0.15,    // Growth, money
      charcoal: 0.15,     // Professional
      other: 0.15
    },
    secondary: {
      white: 0.40,
      light_gray: 0.30,
      cream: 0.15,
      pale_blue: 0.15
    },
    accent: {
      bright_green: 0.25,  // Money, growth
      gold: 0.20,          // Premium, wealth
      electric_blue: 0.20, // Tech, speed
      coral: 0.15,         // Human touch
      other: 0.20
    },
    min_contrast: 7.0,  // Higher for data readability
    warmth_bias: 0.1    // Professional, cooler
  },
  
  automotive: {
    primary: {
      brand_specific: 0.50,  // Ford blue, Ferrari red, etc.
      black: 0.20,           // Premium, luxury
      silver: 0.15,          // Modern, tech
      white: 0.10,
      other: 0.05
    },
    // Secondary and accent depend heavily on brand
    // System suggests based on brand color wheel
  },
  
  education: {
    primary: {
      deep_blue: 0.30,    // Knowledge, trust
      forest_green: 0.25, // Growth, learning
      burgundy: 0.15,     // Academic tradition
      warm_gray: 0.15,
      other: 0.15
    },
    accent: {
      gold: 0.20,         // Achievement
      bright_blue: 0.20,  // Innovation
      orange: 0.15,       // Energy, creativity
      purple: 0.15,       // Wisdom
      other: 0.30
    },
    warmth_bias: 0.4  // Approachable learning environment
  }
};
```

### Brand + Sector Color Resolution

```typescript
function resolvePrimaryColor(
  brandColor: Color | null,
  sector: Sector,
  brandWeight: number = 0.7
): Color {
  
  // If no brand color, use sector probability
  if (!brandColor) {
    return selectFromSectorProfile(SECTOR_COLOR_PROFILES[sector].primary);
  }
  
  // Check brand color against sector appropriateness
  const brandHue = brandColor.hue;
  const sectorAppropriate = isHueAppropriateForSector(brandHue, sector);
  
  if (sectorAppropriate) {
    // Brand color works for sector—use it
    return brandColor;
  }
  
  // Brand color conflicts with sector norms
  if (brandWeight > 0.8) {
    // Brand insists—use their color but add compensatory signals
    return {
      ...brandColor,
      compensatorySignals: getCompensatorySignals(sector, brandColor)
    };
  } else if (brandWeight > 0.5) {
    // Blend brand color toward sector-appropriate
    return blendColors(brandColor, getSectorRecommendedColor(sector), brandWeight);
  } else {
    // Sector appropriateness wins
    return getSectorRecommendedColor(sector);
  }
}
```

---

## Hero Type Selection with Constrained Randomness

### Hero Type by Sector (Weighted)

```typescript
const HERO_TYPE_BY_SECTOR = {
  healthcare: {
    trust_authority: 0.30,      // Credentials, awards
    service_showcase: 0.25,     // Facilities, services
    testimonial_video: 0.20,    // Patient stories
    editorial_feature: 0.15,    // Health articles, education
    stats_counter: 0.10,        // Patients served, outcomes
    product_ui: 0.00            // Rare—only for apps
  },
  
  fintech: {
    stats_counter: 0.30,        // Live transaction volume
    trust_authority: 0.25,      // Security badges, compliance
    product_ui: 0.20,           // Dashboard preview
    stats_social_proof: 0.15,   // Customer count, ratings
    brand_logo: 0.10            // Minimal for established brands
  },
  
  automotive: {
    aspirational_imagery: 0.35, // Lifestyle, adventure
    configurator_3d: 0.25,      // Build your own (functional 3D)
    product_showcase: 0.20,     // Hero vehicle shot
    video_background: 0.15,     // Driving footage
    brand_logo: 0.05
  },
  
  education: {
    editorial_feature: 0.30,    // Knowledge content
    community_showcase: 0.25,   // Students, campus
    search_discovery: 0.20,     // Course finder
    stats_counter: 0.15,        // Alumni success stats
    product_ui: 0.10            // Learning platform preview
  }
};
```

### Hero Variant (Hash-Derived Uniqueness)

```typescript
// Once hero_type is selected, variant determines layout
const HERO_VARIANTS = {
  trust_authority: [
    { id: "credentials_grid", layout: "3x2_grid", elements: ["awards", "certifications", "partnerships"] },
    { id: "hero_stat_cards", layout: "overlay_cards", elements: ["patients_served", "success_rate", "years_experience"] },
    { id: "featured_testimonial", layout: "split_screen", elements: ["video", "quote", "credentials_row"] },
    { id: "trust_badges_bar", layout: "bottom_bar", elements: ["logos", "certifications", "ratings"] },
    { id: "doctor_spotlight", layout: "portrait_focus", elements: ["photo", "credentials", "specialty"] }
  ],
  
  product_ui: [
    { id: "screenshot_hero", layout: "centered_device", elements: ["screenshot", "floating_features"] },
    { id: "split_demo", layout: "text_left_ui_right", elements: ["headline", "device_mockup"] },
    { id: "dashboard_preview", layout: "full_width", elements: ["blurred_background", "focused_module"] },
    { id: "annotation_showcase", layout: "annotated_screenshot", elements: ["image", "callouts", "feature_list"] },
    { id: "multi_device", layout: "responsive_showcase", elements: ["desktop", "tablet", "mobile"] }
  ]
};

// Variant selection from hash
generateHeroVariant(heroType: string, hash: string): HeroVariant {
  const variants = HERO_VARIANTS[heroType];
  const hashByte = parseInt(hash.slice(0, 2), 16);
  return variants[hashByte % variants.length];
}
```

---

## Trust Signal Architecture

### Chromosome-Generated Structure + Content-Filled

```typescript
interface TrustChromosome {
  // Structural (always generated)
  approach: "credentials" | "testimonials" | "stats" | "social_proof" | "security" | "transparency";
  prominence: "subtle" | "integrated" | "prominent" | "hero_feature";
  layout_variant: string; // Hash-derived
  
  // Content (filled by user or placeholder)
  content_source?: "user_provided" | "placeholder" | "chromosome_generated";
  stats?: StatItem[];
  testimonials?: Testimonial[];
  credentials?: Credential[];
}

// Example generation
const trustConfig = {
  approach: "credentials",  // From sector profile
  prominence: "prominent",   // From intent analysis (high-net-worth = trust critical)
  layout_variant: "credentials_grid_with_counter", // Hash-derived
  
  // Content provided by user
  content: {
    credentials: [
      { type: "board_certification", text: "American Board of Surgery" },
      { type: "hospital_affiliation", text: "Johns Hopkins Medicine" },
      { type: "award", text: "Top Doctor 2024" }
    ],
    stats: [
      { value: "15,000+", label: "Procedures Performed" },
      { value: "99.2%", label: "Patient Satisfaction" }
    ]
  }
};
```

---

## Content-Aware Sub-Sector Classification

### Text Analysis for Sub-Sector

```typescript
const SUB_SECTOR_KEYWORDS = {
  healthcare: {
    surgical: ["surgery", "surgeon", "operating", "procedure", "OR", "cutting", "incision"],
    wellness: ["wellness", "preventive", "holistic", "nutrition", "fitness", "mental health"],
    emergency: ["ER", "emergency", "urgent care", "trauma", "critical"],
    pediatric: ["pediatric", "children", "kids", "child", "adolescent"],
    geriatric: ["geriatric", "elderly", "senior", "aging", "memory care"],
    cosmetic: ["cosmetic", "plastic surgery", "aesthetic", "beauty", "rejuvenation"],
    dental: ["dental", "dentist", "orthodontics", "oral"],
    diagnostic: ["imaging", "MRI", "CT scan", "lab", "diagnostic", "testing"],
    financial: ["billing", "insurance", "payment", "financial", "cost", "price"]
  },
  
  fintech: {
    consumer: ["personal finance", "budgeting", "savings", "checking", "app"],
    enterprise: ["B2B", "enterprise", "corporate", "treasury", "institutional"],
    trading: ["trading", "stocks", "crypto", "investment", "portfolio"],
    lending: ["loan", "credit", "mortgage", "lending", "borrow"],
    payments: ["payment", "checkout", "POS", "merchant", "transaction"],
    wealth: ["wealth management", "HNW", "private banking", "advisor"]
  }
};

// Classification
function classifySubSector(text: string, primarySector: Sector): SubSector {
  const keywords = SUB_SECTOR_KEYWORDS[primarySector];
  let bestMatch = null;
  let maxScore = 0;
  
  for (const [subSector, terms] of Object.entries(keywords)) {
    const score = terms.reduce((acc, term) => 
      acc + (text.toLowerCase().includes(term) ? 1 : 0), 0
    );
    if (score > maxScore) {
      maxScore = score;
      bestMatch = subSector;
    }
  }
  
  return bestMatch || "general";
}
```

### Sub-Sector Influences Genome

```typescript
const SUB_SECTOR_OVERRIDES = {
  "healthcare_surgical": {
    emotionalTemperature: { min: 0.3, max: 0.5 },  // Clinical precision
    trust_signals: "credentials",                   // Board certifications critical
    color_bias: { blue: 0.50, white: 0.30 },        // Sterile, clean
    typography: "geometric",                        // Precision, technical
    motion: "minimal"                               // Serious, focused
  },
  
  "healthcare_wellness": {
    emotionalTemperature: { min: 0.6, max: 0.8 },  // Warm, approachable
    trust_signals: "testimonials",                  // Community stories
    color_bias: { green: 0.40, teal: 0.30 },        // Growth, nature
    typography: "humanist",                         // Friendly, organic
    motion: "gentle_spring"                         // Calming, breathing
  },
  
  "healthcare_financial": {
    // Blended healthcare + fintech
    trust_signals: ["security", "transparency"],    // Both sectors' concerns
    color_bias: { blue: 0.35, green: 0.25, purple: 0.20 },
    hero_type: "stats_counter",                     // Show cost savings
    motion: "functional_only"                       // Calculators, not decoration
  }
};
```

---

## Chromosome Elimination (User Opt-Out)

### Flexible Architecture

```typescript
interface GenerationRequest {
  intent: string;
  sector: { primary: Sector; secondary?: Sector };
  content?: ContentAssets;
  brand?: BrandAssets;
  
  // User preferences
  options: {
    // Eliminate specific chromosomes
    disabledChromosomes: string[]; // e.g., ["ch15_biomarker", "ch13_atmosphere"]
    
    // Force specific values
    forcedChromosomes: Partial<Genome>; // e.g., { ch19_hero_type: "product_ui" }
    
    // Influence weights
    brandWeight: number;        // 0.0 - 1.0 (default 0.7)
    sectorWeight: number;       // 0.0 - 1.0 (default 0.5)
    contentWeight: number;      // 0.0 - 1.0 (default 0.6)
    
    // Exploration vs appropriateness
    creativityLevel: "conservative" | "balanced" | "experimental"; // How far from sector norms
  };
}
```

### Example: Eliminating Decorative 3D

```typescript
const request = {
  intent: "Patient billing portal",
  sector: { primary: "healthcare", secondary: "fintech" },
  options: {
    disabledChromosomes: [
      "ch15_biomarker",     // No decorative 3D shapes
      "ch14_physics",       // No glass/metallic materials
      "ch13_atmosphere"     // No glassmorphism/FX
    ],
    forcedChromosomes: {
      ch19_hero_type: "trust_authority",
      ch21_trust_prominence: "prominent"
    },
    brandWeight: 0.8,
    creativityLevel: "balanced"
  }
};
```

---

## Anti-Slop Guarantees

### 1. Hash-Derived Variation Within Constraints

Same sector + same intent → Different genome every time (thanks to SHA-256 hash)

```typescript
// Example: Three "healthcare patient portal" requests
generate("healthcare-portal-v1") → Blue primary, trust grid hero, geometric fonts
generate("healthcare-portal-v2") → Teal primary, stat cards hero, humanist fonts  
generate("healthcare-portal-v3") → Green primary, testimonial split, transitional fonts
```

All appropriate for healthcare, all functionally equivalent, all visually distinct.

### 2. No Template Selection

Sector profiles are **probability weights**, not templates.

```typescript
// BAD (template approach)
if (sector === "healthcare") return HEALTHCARE_TEMPLATE;

// GOOD (probability approach)
if (sector === "healthcare") {
  color = weightedRandom({ blue: 0.4, teal: 0.25, green: 0.2 });
  hero = weightedRandom({ trust: 0.3, service: 0.25, testimonial: 0.2 });
  // ... infinite combinations
}
```

### 3. Epistasis Prevents "Slop Combinations"

```typescript
// Forbidden: Inter font + Blue gradient (the ultimate SaaS slop)
if (font === "inter" && hasGradient) {
  constraint.forbid("inter");
  rationale.push("Inter + gradient = slop pattern detected");
}

// Forbidden: Healthcare site with red primary (unless brand insists)
if (sector === "healthcare" && color.hue < 20 && !brandOverride) {
  constraint.warn("red_primary_in_healthcare", 
    "Red can trigger urgency/anxiety in healthcare context");
}
```

### 4. Exploration Through Constrained Mutation

```typescript
// V2: Visual breeding / mutation
function mutateGenome(parent: Genome, mutationRate: number): Genome {
  const child = clone(parent);
  
  // Mutate within sector-appropriate bounds
  if (random() < mutationRate) {
    child.ch5_color_primary.hue = mutateWithinSector(
      parent.ch5_color_primary.hue,
      parent.ch0_sector_primary,
      maxDelta: 30  // Don't drift into inappropriate colors
    );
  }
  
  // Mutate hero variant
  if (random() < mutationRate) {
    child.ch19_hero_variant = (parent.ch19_hero_variant + 0.1) % 1.0;
  }
  
  return child;
}
```

---

## Implementation Roadmap

### Phase 1: Core Infrastructure
1. Add sector chromosomes (ch0_sector_primary, ch0_sector_secondary)
2. Implement sector color probability profiles
3. Add hero type chromosome with variants
4. Content analysis for sub-sector classification

### Phase 2: Trust & Social Signals
1. Add trust signal chromosomes
2. Build trust signal layout variants
3. Content integration (user-provided stats/testimonials)
4. Social proof pattern library

### Phase 3: Content Awareness
1. Text analysis for sub-sector keywords
2. Image analysis for visual treatment
3. Content depth chromosome
4. Information architecture patterns

### Phase 4: Brand Integration
1. Brand color extraction from assets
2. Brand vs sector resolution logic
3. Compensatory signal generation
4. Brand weight configuration

### Phase 5: Elimination & Control
1. Chromosome opt-out system
2. Forced chromosome values
3. Creativity level tuning
4. User preference persistence

---

*Architecture: Context-aware, sector-mapped, anti-slop design generation*
*Date: March 2026*
