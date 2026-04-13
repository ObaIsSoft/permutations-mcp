/**
 * Rhythm Catalog
 *
 * Visual rhythm is what happens when you scroll past the hero. It's the
 * repeating pattern of visual elements — the same shape used five different
 * ways, the same colour temperature across alternating sections.
 *
 * Catalog entries describe WHAT each pattern is. CSS generation references
 * genome CSS custom properties — no hardcoded sizes, colours, or opacities.
 */

import { RhythmPattern } from "./genome/types.js";

// ── Rhythm pattern definitions (metadata only) ────────────────────────────────

export interface RhythmDefinition {
    pattern: RhythmPattern;
    description: string;
    /** What visual element repeats across the page */
    repeatElement: string;
    /** HTML data-attribute emitted on sections */
    sectionAttr: string;
}

export const RHYTHM_CATALOG: RhythmDefinition[] = [
    {
        pattern: "shape_motif",
        description: "One shape (circle, hexagon, organic blob) appears in backgrounds, dividers, icon containers, and image frames.",
        repeatElement: "clip-path shape via --motif-radius",
        sectionAttr: `data-rhythm="shape_motif"`,
    },
    {
        pattern: "logo_echo",
        description: "Brand mark reused at small/full/outline scale — small as texture, large as section bg, outline as divider.",
        repeatElement: "SVG brand mark at three scales and opacities",
        sectionAttr: `data-rhythm="logo_echo"`,
    },
    {
        pattern: "color_band",
        description: "Alternating section backgrounds from palette — odd/even sections use palette-bg vs palette-surface.",
        repeatElement: "Background colour alternation via data-parity",
        sectionAttr: `data-rhythm="color_band"`,
    },
    {
        pattern: "texture_repeat",
        description: "Same grain/noise texture applied across all surfaces at different opacities.",
        repeatElement: "SVG feTurbulence grain overlay with --noise-opacity-* scale",
        sectionAttr: `data-rhythm="texture_repeat"`,
    },
    {
        pattern: "typographic_rule",
        description: "Horizontal rules between sections always the same width — typographic discipline.",
        repeatElement: "hr.section-rule with consistent --rule-width and --rule-weight",
        sectionAttr: `data-rhythm="typographic_rule"`,
    },
    {
        pattern: "image_grid_echo",
        description: "Images always appear in the same aspect ratio — visual consistency across the page.",
        repeatElement: "aspect-ratio on all .img-container elements",
        sectionAttr: `data-rhythm="image_grid_echo"`,
    },
    {
        pattern: "spacing_scale",
        description: "Section vertical spacing alternates between --spacing-2xl and --spacing-section.",
        repeatElement: "padding-block alternation via data-parity",
        sectionAttr: `data-rhythm="spacing_scale"`,
    },
    {
        pattern: "icon_system",
        description: "One icon style throughout — consistent size, stroke weight, and colour from genome vars.",
        repeatElement: ".icon elements with --icon-size and --icon-stroke",
        sectionAttr: `data-rhythm="icon_system"`,
    },
    {
        pattern: "gradient_echo",
        description: "Same gradient direction reused across hero, CTA, and footer.",
        repeatElement: "--gradient-dir applied to all .gradient-element instances",
        sectionAttr: `data-rhythm="gradient_echo"`,
    },
    {
        pattern: "line_weight",
        description: "One border/stroke weight throughout — borders, underlines, dividers, all from --line-weight.",
        repeatElement: "--line-weight applied to all bordered elements",
        sectionAttr: `data-rhythm="line_weight"`,
    },
];

// ── CSS generation ────────────────────────────────────────────────────────────

/**
 * Generate CSS for the selected rhythm pattern.
 * ALL sizing, colour, and opacity values reference genome CSS custom properties
 * that are declared by the main genome variable system. No hardcoded values.
 *
 * Genome vars expected to exist:
 * --color-primary, --color-accent, --color-bg, --color-surface
 * --spacing-xs, --spacing-sm, --spacing-md, --spacing-xl, --spacing-2xl, --spacing-section
 * --radius-sm, --radius-md, --radius-full
 * --opacity-ghost, --opacity-secondary, --opacity-tertiary, --opacity-border
 * --line-weight (if line_weight pattern is active, set by this function)
 * --font-anchor, --font-body, --font-accent
 */
export function generateRhythmCSS(pattern: RhythmPattern): string {
    switch (pattern) {

        case "shape_motif":
            return `/* Rhythm: shape_motif */
:root {
  --motif-radius: var(--radius-full, 50%);
  --motif-size-bg: clamp(var(--spacing-2xl), 40vw, 60vw);
  --motif-size-icon: var(--spacing-xl);
  --rhythm-pattern: shape_motif;
}
[data-rhythm="shape_motif"] { position: relative; overflow: hidden; }
[data-rhythm="shape_motif"] .section-bg-shape {
  width: var(--motif-size-bg); aspect-ratio: 1;
  border-radius: var(--motif-radius);
  background: color-mix(in oklch, var(--color-primary) var(--midground-opacity-pct, 6%), transparent);
  position: absolute; right: -10%; top: 50%; transform: translateY(-50%);
  pointer-events: none;
}
.icon-container {
  border-radius: var(--motif-radius);
  background: color-mix(in oklch, var(--color-primary) var(--midground-opacity-pct, 10%), transparent);
  width: var(--motif-size-icon); aspect-ratio: 1;
  display: grid; place-items: center;
}
.img-frame { border-radius: var(--motif-radius); overflow: hidden; }`;

        case "logo_echo":
            return `/* Rhythm: logo_echo */
:root {
  --logo-echo-sm: var(--spacing-md);
  --logo-echo-md: var(--spacing-2xl);
  --logo-echo-bg: 40vw;
  --rhythm-pattern: logo_echo;
}
.logo-bg {
  position: absolute; inset: 0; pointer-events: none;
  display: flex; align-items: center; justify-content: center;
  opacity: var(--opacity-ghost);
}
.logo-bg svg { width: var(--logo-echo-bg); max-width: 90vw; }
.logo-texture svg { width: var(--logo-echo-sm); opacity: var(--opacity-border); }
.logo-divider svg { width: var(--logo-echo-md); stroke: var(--color-primary); fill: none; opacity: var(--opacity-tertiary); }`;

        case "color_band":
            return `/* Rhythm: color_band */
:root {
  --band-odd: var(--color-bg);
  --band-even: var(--color-surface);
  --rhythm-pattern: color_band;
}
[data-parity="odd"]  { background: var(--band-odd); }
[data-parity="even"] { background: var(--band-even); }`;

        case "texture_repeat":
            return `/* Rhythm: texture_repeat */
:root {
  --noise-opacity-surface: var(--opacity-border, 0.03);
  --noise-opacity-card: 0.05;
  --noise-opacity-hero: var(--grain-opacity, 0.08);
  --rhythm-pattern: texture_repeat;
}
[data-rhythm="texture_repeat"] { position: relative; isolation: isolate; }
[data-rhythm="texture_repeat"]::after {
  content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 1;
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>");
  opacity: var(--noise-opacity-surface);
  mix-blend-mode: soft-light;
}`;

        case "typographic_rule":
            return `/* Rhythm: typographic_rule */
:root {
  --rule-width: min(80vw, 1200px);
  --rule-weight: var(--line-weight, 1px);
  --rule-color: color-mix(in oklch, var(--color-primary) var(--border-opacity-pct, 20%), transparent);
  --rhythm-pattern: typographic_rule;
}
hr.section-rule {
  width: var(--rule-width); border: none;
  border-top: var(--rule-weight) solid var(--rule-color);
  margin: var(--spacing-2xl) auto;
}`;

        case "image_grid_echo":
            return `/* Rhythm: image_grid_echo */
:root {
  --image-aspect: 4 / 3;
  --rhythm-pattern: image_grid_echo;
}
.img-container { aspect-ratio: var(--image-aspect); overflow: hidden; }
.img-container img { width: 100%; height: 100%; object-fit: cover; display: block; }`;

        case "spacing_scale":
            return `/* Rhythm: spacing_scale */
:root {
  --rhythm-space-odd: var(--spacing-2xl);
  --rhythm-space-even: var(--spacing-section);
  --rhythm-pattern: spacing_scale;
}
[data-parity="odd"]  { padding-block: var(--rhythm-space-odd); }
[data-parity="even"] { padding-block: var(--rhythm-space-even); }`;

        case "icon_system":
            return `/* Rhythm: icon_system */
:root {
  --icon-size: var(--spacing-lg);
  --icon-stroke: 1.5;
  --icon-color: currentColor;
  --rhythm-pattern: icon_system;
}
.icon, svg.icon {
  width: var(--icon-size); height: var(--icon-size);
  stroke-width: var(--icon-stroke); color: var(--icon-color);
  flex-shrink: 0;
}`;

        case "gradient_echo":
            return `/* Rhythm: gradient_echo */
:root {
  --gradient-primary: var(--color-primary);
  --gradient-accent: var(--color-accent);
  --rhythm-pattern: gradient_echo;
}
.gradient-element {
  background: linear-gradient(var(--gradient-dir, 135deg), var(--gradient-primary), var(--gradient-accent));
}`;

        case "line_weight":
            return `/* Rhythm: line_weight */
:root {
  --line-weight: 1px;
  --line-color: color-mix(in oklch, var(--color-primary) var(--border-opacity-pct, 15%), transparent);
  --rhythm-pattern: line_weight;
}
hr, .divider { border: none; border-top: var(--line-weight) solid var(--line-color); }
.bordered { border: var(--line-weight) solid var(--line-color); }`;

        default:
            return `/* Rhythm: unknown pattern ${pattern} */`;
    }
}

/**
 * Get the RhythmDefinition for a given pattern.
 */
export function getRhythmDef(pattern: RhythmPattern): RhythmDefinition | undefined {
    return RHYTHM_CATALOG.find(r => r.pattern === pattern);
}
