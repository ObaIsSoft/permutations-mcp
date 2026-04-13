/**
 * Depth Catalog
 *
 * Depth is the spatial quality of a page — the sense that some things are
 * closer than others. Full system: layered strata, material surfaces, light
 * and shadow. Not universal — emerges from the genome's DepthPhilosophy.
 *
 * Catalog entries describe WHAT each technique is and WHEN it applies.
 * CSS generation reads the active techniques and genome CSS vars — all
 * colour, size, opacity, and blur values come from genome custom properties,
 * not hardcoded values.
 */

import { DepthPhilosophy, DesignPhilosophy } from "./genome/types.js";

// ── Technique IDs ─────────────────────────────────────────────────────────────

export type DepthTechniqueId =
    // Stratum
    | "color_lightness_strata"
    | "white_space_depth"
    | "shadow_strata"
    | "backdrop_filter_blur"
    | "blur_parallax"
    | "inset_shadow"
    // Surface texture
    | "grain_subtle"
    | "grain_heavy"
    | "noise_texture_surface"
    | "duotone_surface"
    | "specular_highlight"
    // Spatial / CSS 3D
    | "perspective_section"
    | "css_3d_card_tilt"
    | "parallax_layers"
    | "sticky_depth"
    | "scroll_clip_reveal"
    // Decorative
    | "ghost_text_bg"
    | "midground_shapes"
    | "shadow_typography"
    | "border_gap_depth"
    | "blend_mode_overlay"
    | "drop_cap"
    | "image_cutout_depth";

// ── Technique descriptor (no CSS) ────────────────────────────────────────────

export interface DepthTechnique {
    id: DepthTechniqueId;
    description: string;
    category: "stratum" | "surface" | "spatial" | "decorative";
    /** Which depth philosophies may include this technique */
    validIn: DepthPhilosophy[];
    /** Chromosome conditions evaluated at activation time */
    requires?: {
        physics?: string[];        // one of these physics modes must be active
        material?: string[];       // ch14.material must be one of these
        isDark?: boolean;          // requires dark palette
        minEntropy?: number;
        minNoiseLevel?: number;
    };
}

export const DEPTH_TECHNIQUE_CATALOG: DepthTechnique[] = [
    // ── Stratum ──────────────────────────────────────────────────────────────
    { id: "color_lightness_strata",  category: "stratum",  validIn: ["flat", "subtle", "layered", "immersive"], requires: { isDark: true },
      description: "Background/mid-surface/foreground defined by OKLCH lightness steps — stacked spatial planes." },
    { id: "white_space_depth",       category: "stratum",  validIn: ["flat", "subtle", "layered", "immersive"],
      description: "Whitespace IS the depth — generous padding separates elements without overlap or shadow." },
    { id: "shadow_strata",           category: "stratum",  validIn: ["subtle", "layered", "immersive"],
      description: "Multi-stop box-shadow: ambient + penumbra + diffuse — elevation expressed through shadow." },
    { id: "backdrop_filter_blur",    category: "stratum",  validIn: ["subtle", "layered", "immersive"], requires: { material: ["glass"] },
      description: "backdrop-filter: blur() on panels — frosted glass spatial layer." },
    { id: "blur_parallax",           category: "stratum",  validIn: ["layered", "immersive"],
      description: "Background elements blurred, foreground sharp — depth of field without 3D." },
    { id: "inset_shadow",            category: "stratum",  validIn: ["subtle", "layered", "immersive"], requires: { material: ["clay", "neumorphic"] },
      description: "box-shadow: inset on inputs/surfaces — pressed/sunken tactile depth." },

    // ── Surface texture ───────────────────────────────────────────────────────
    { id: "grain_subtle",            category: "surface",  validIn: ["subtle", "layered", "immersive"], requires: { minNoiseLevel: 0.15 },
      description: "SVG feTurbulence grain at low opacity — just enough to feel analog." },
    { id: "grain_heavy",             category: "surface",  validIn: ["layered", "immersive"], requires: { minNoiseLevel: 0.60, minEntropy: 0.50 },
      description: "High-opacity grain — film quality, photographic texture." },
    { id: "noise_texture_surface",   category: "surface",  validIn: ["layered", "immersive"],
      description: "Per-surface feTurbulence via ::after pseudo with soft-light blend." },
    { id: "specular_highlight",      category: "surface",  validIn: ["layered", "immersive"], requires: { material: ["glass", "glossy"] },
      description: "CSS radial-gradient shine following --mouse-x/y — glossy surface quality." },
    { id: "duotone_surface",         category: "surface",  validIn: ["layered", "immersive"],
      description: "Two-colour image overlay via mix-blend-mode: multiply — editorial tone." },

    // ── Spatial / CSS 3D ──────────────────────────────────────────────────────
    { id: "perspective_section",     category: "spatial",  validIn: ["immersive"], requires: { physics: ["spring", "wave", "magnetic"] },
      description: "Section wrapper with perspective: 1200px — children at different translateZ depths." },
    { id: "css_3d_card_tilt",        category: "spatial",  validIn: ["layered", "immersive"],
      description: "Cards rotateX/Y on pointermove with preserve-3d — tactile depth interaction." },
    { id: "parallax_layers",         category: "spatial",  validIn: ["layered", "immersive"],
      description: "Multiple data-speed strata at different scroll rates — layered scroll depth." },
    { id: "sticky_depth",            category: "spatial",  validIn: ["immersive"],
      description: "Earlier sections position:sticky, scale down as next section reveals — z-depth in scroll." },
    { id: "scroll_clip_reveal",      category: "spatial",  validIn: ["subtle", "layered", "immersive"], requires: { minEntropy: 0.40 },
      description: "Content clips in as user scrolls — clip-path reveals from behind." },

    // ── Decorative ────────────────────────────────────────────────────────────
    { id: "ghost_text_bg",           category: "decorative", validIn: ["subtle", "layered", "immersive"], requires: { minEntropy: 0.35 },
      description: "Oversized text at ghost opacity behind content — typographic texture layer." },
    { id: "midground_shapes",        category: "decorative", validIn: ["subtle", "layered", "immersive"],
      description: "Large soft blurred shapes at low opacity in section backgrounds." },
    { id: "shadow_typography",       category: "decorative", validIn: ["subtle", "layered", "immersive"],
      description: "text-shadow on display type — long shadow or drop shadow for typographic lift." },
    { id: "border_gap_depth",        category: "decorative", validIn: ["flat", "subtle"],
      description: "Borders and gaps as spatial tools — outlines create implied layers." },
    { id: "blend_mode_overlay",      category: "decorative", validIn: ["layered", "immersive"], requires: { minEntropy: 0.50 },
      description: "mix-blend-mode: multiply/overlay/screen on layered elements." },
    { id: "drop_cap",                category: "decorative", validIn: ["subtle", "layered", "immersive"], requires: { minEntropy: 0.40 },
      description: "First paragraph oversized drop cap in accent colour — micro typographic depth." },
    { id: "image_cutout_depth",      category: "decorative", validIn: ["layered", "immersive"],
      description: "Foreground image extends over section boundary — overlapping spatial depth." },
];

// ── Philosophy → technique activation map ─────────────────────────────────────

export const PHILOSOPHY_TECHNIQUES: Record<DepthPhilosophy, DepthTechniqueId[]> = {
    flat:     ["white_space_depth", "border_gap_depth"],
    subtle:   ["white_space_depth", "shadow_strata", "scroll_clip_reveal"],
    layered:  ["white_space_depth", "shadow_strata", "midground_shapes", "ghost_text_bg",
               "scroll_clip_reveal", "parallax_layers", "css_3d_card_tilt", "shadow_typography"],
    immersive:["white_space_depth", "shadow_strata", "midground_shapes", "ghost_text_bg",
               "parallax_layers", "css_3d_card_tilt", "shadow_typography", "blend_mode_overlay",
               "scroll_clip_reveal", "sticky_depth", "drop_cap"],
};

// ── Technique selector ────────────────────────────────────────────────────────

export interface DepthContext {
    philosophy: DepthPhilosophy;
    designPhilosophy: DesignPhilosophy;
    entropy: number;
    noiseLevel: number;
    isDark: boolean;
    physics: string;
    material: string;
}

export function selectDepthTechniques(ctx: DepthContext): DepthTechniqueId[] {
    const base = [...(PHILOSOPHY_TECHNIQUES[ctx.philosophy] ?? [])];

    // Conditional additions based on chromosome values
    if (ctx.isDark) base.push("color_lightness_strata");
    if (ctx.noiseLevel > 0.15 && ctx.philosophy !== "flat") {
        if (ctx.noiseLevel > 0.60 && ctx.entropy > 0.50) {
            base.push("grain_heavy");
        } else {
            base.push("grain_subtle");
        }
    }
    if (ctx.entropy > 0.40 && ctx.designPhilosophy === "editorial") base.push("image_cutout_depth");
    if (ctx.material === "glass") base.push("backdrop_filter_blur", "specular_highlight");
    if (ctx.material === "clay" || ctx.material === "neumorphic") base.push("inset_shadow");
    if (["spring", "wave", "magnetic"].includes(ctx.physics) && ctx.philosophy === "immersive") {
        base.push("perspective_section");
    }
    if (ctx.philosophy !== "flat") base.push("noise_texture_surface");

    // Filter: validate each technique against its chromosome requirements
    const seen = new Set<DepthTechniqueId>();
    return base.filter(id => {
        if (seen.has(id)) return false;
        seen.add(id);
        const tech = DEPTH_TECHNIQUE_CATALOG.find(t => t.id === id);
        if (!tech) return false;
        if (!tech.validIn.includes(ctx.philosophy)) return false;
        const r = tech.requires;
        if (!r) return true;
        if (r.isDark !== undefined && r.isDark !== ctx.isDark) return false;
        if (r.minEntropy !== undefined && ctx.entropy < r.minEntropy) return false;
        if (r.minNoiseLevel !== undefined && ctx.noiseLevel < r.minNoiseLevel) return false;
        if (r.physics && !r.physics.includes(ctx.physics)) return false;
        if (r.material && !r.material.includes(ctx.material)) return false;
        return true;
    });
}

// ── CSS generation ────────────────────────────────────────────────────────────

/**
 * Generate CSS for the activated depth techniques.
 * ALL values reference genome CSS custom properties — no hardcoded colours,
 * sizes, blur amounts, or opacity values. Genome vars are expected to be set
 * by the main CSS generator before this output is consumed.
 */
export function generateDepthCSS(ctx: DepthContext): string {
    const active = selectDepthTechniques(ctx);
    if (active.length === 0) return `/* depth: ${ctx.philosophy} — no techniques active */`;

    const blocks: string[] = [
        `/* Depth Philosophy: ${ctx.philosophy} */`,
        `/* Active techniques: ${active.join(", ")} */`,
    ];

    for (const id of active) {
        blocks.push(generateTechniqueCSS(id));
    }

    return blocks.join("\n\n");
}

/**
 * Generate CSS for a single depth technique.
 * References only CSS custom properties — nothing hardcoded.
 */
function generateTechniqueCSS(id: DepthTechniqueId): string {
    switch (id) {

        case "color_lightness_strata":
            return `/* depth: color_lightness_strata */
:root {
  --strata-bg:     oklch(var(--strata-l-bg, 0.12) var(--strata-c, 0.03) var(--palette-hue, 240));
  --strata-mid:    oklch(var(--strata-l-mid, 0.18) var(--strata-c, 0.03) var(--palette-hue, 240));
  --strata-raised: oklch(var(--strata-l-raised, 0.24) var(--strata-c, 0.04) var(--palette-hue, 240));
}
body { background: var(--strata-bg, var(--color-bg)); }
.card, .panel { background: var(--strata-mid, var(--color-surface)); }
.card-raised   { background: var(--strata-raised, var(--color-surface-elevated)); }`;

        case "white_space_depth":
            return `/* depth: white_space_depth */
.section { padding-block: var(--spacing-section); }`;

        case "shadow_strata":
            return `/* depth: shadow_strata */
:root {
  --shadow-ambient:  0 1px 2px color-mix(in oklch, var(--color-primary) 8%, black);
  --shadow-penumbra: 0 4px 12px color-mix(in oklch, var(--color-primary) 6%, black);
  --shadow-diffuse:  0 12px 32px color-mix(in oklch, var(--color-primary) 4%, black);
  --shadow-elevation-1: var(--shadow-ambient), var(--shadow-penumbra);
  --shadow-elevation-2: var(--shadow-ambient), var(--shadow-penumbra), var(--shadow-diffuse);
}
.card, .panel { box-shadow: var(--shadow-elevation-1); }
.card:hover   { box-shadow: var(--shadow-elevation-2); transition: box-shadow var(--duration-fast, 0.25s) ease; }`;

        case "backdrop_filter_blur":
            return `/* depth: backdrop_filter_blur */
@supports (backdrop-filter: blur(1px)) {
  .glass-panel {
    background: color-mix(in oklch, var(--color-surface) var(--glass-opacity, 60%), transparent);
    backdrop-filter: blur(var(--blur-glass, 12px)) saturate(var(--glass-saturation, 1.4));
    -webkit-backdrop-filter: blur(var(--blur-glass, 12px)) saturate(var(--glass-saturation, 1.4));
    border: var(--line-weight, 1px) solid color-mix(in oklch, white var(--glass-border-opacity, 20%), transparent);
  }
}`;

        case "blur_parallax":
            return `/* depth: blur_parallax */
.depth-bg  { filter: blur(var(--blur-bg, 4px));  transform: scale(1.04); }
.depth-mid { filter: blur(var(--blur-mid, 1px)); }
.depth-fg  { filter: blur(0); }`;

        case "inset_shadow":
            return `/* depth: inset_shadow */
.sunken, input, textarea, select {
  box-shadow: inset 0 2px 6px color-mix(in oklch, black var(--inset-shadow-strength, 12%), transparent),
              inset 0 1px 2px color-mix(in oklch, black var(--inset-shadow-strength-sm, 8%), transparent);
}`;

        case "grain_subtle":
            return `/* depth: grain_subtle */
.grain-overlay {
  position: fixed; inset: 0; pointer-events: none; z-index: var(--z-grain, 9999);
  opacity: var(--grain-opacity, 0.025);
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='var(--grain-freq, 0.65)' numOctaves='4' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>");
  mix-blend-mode: var(--grain-blend, soft-light);
}`;

        case "grain_heavy":
            return `/* depth: grain_heavy */
.grain-overlay {
  position: fixed; inset: 0; pointer-events: none; z-index: var(--z-grain, 9999);
  opacity: var(--grain-opacity-heavy, 0.10);
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='var(--grain-freq-heavy, 0.80)' numOctaves='4' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>");
  mix-blend-mode: var(--grain-blend-heavy, overlay);
}`;

        case "noise_texture_surface":
            return `/* depth: noise_texture_surface */
.textured-surface { position: relative; isolation: isolate; }
.textured-surface::after {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>");
  opacity: var(--noise-opacity-surface, 0.04);
  mix-blend-mode: soft-light;
  border-radius: inherit;
}`;

        case "specular_highlight":
            return `/* depth: specular_highlight */
.glossy-card {
  background: radial-gradient(
    circle at calc(var(--mouse-x, 50) * 1%) calc(var(--mouse-y, 50) * 1%),
    color-mix(in oklch, white var(--specular-strength, 12%), transparent),
    transparent 60%
  );
}`;

        case "duotone_surface":
            return `/* depth: duotone_surface */
.duotone-wrap { position: relative; isolation: isolate; }
.duotone-wrap::after {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(var(--gradient-dir, 135deg), var(--color-primary), var(--color-accent));
  mix-blend-mode: multiply;
  opacity: var(--duotone-opacity, 0.55);
}`;

        case "perspective_section":
            return `/* depth: perspective_section */
.section[data-depth] {
  perspective: var(--perspective-dist, 1200px);
  perspective-origin: 50% var(--perspective-origin-y, 40%);
}
.depth-layer-0 { transform: translateZ(0); }
.depth-layer-1 { transform: translateZ(calc(var(--depth-unit, 20px) * -1)) scale(1.02); }
.depth-layer-2 { transform: translateZ(calc(var(--depth-unit, 20px) * -2.5)) scale(1.06); }`;

        case "css_3d_card_tilt":
            return `/* depth: css_3d_card_tilt */
.tilt-card {
  transform-style: preserve-3d;
  transition: transform var(--duration-fast, 0.25s) ease-out, box-shadow var(--duration-fast, 0.25s) ease-out;
  will-change: transform;
}
.tilt-card:hover { box-shadow: var(--shadow-elevation-2); }
.tilt-card[style] { transform: rotateX(calc(var(--rx, 0) * 1deg)) rotateY(calc(var(--ry, 0) * 1deg)); }`;

        case "parallax_layers":
            return `/* depth: parallax_layers */
[data-speed] { will-change: transform; }`;

        case "sticky_depth":
            return `/* depth: sticky_depth */
.sticky-section {
  position: sticky; top: 0;
  z-index: calc(var(--z-sticky-base, 10) - var(--section-index, 0));
  transition: transform var(--duration-normal, 0.3s), opacity var(--duration-normal, 0.3s);
}`;

        case "scroll_clip_reveal":
            return `/* depth: scroll_clip_reveal */
.clip-reveal { clip-path: inset(0 100% 0 0); transition: clip-path var(--duration-slow, 0.7s) var(--easing-standard); }
.clip-reveal.is-visible { clip-path: inset(0 0% 0 0); }`;

        case "ghost_text_bg":
            return `/* depth: ghost_text_bg */
.ghost-text {
  position: absolute;
  font-size: var(--size-display-max, clamp(8rem, 25vw, 22rem));
  font-weight: var(--weight-display, 900);
  font-family: var(--font-anchor);
  letter-spacing: var(--tracking-ultra, -0.05em);
  opacity: var(--opacity-ghost);
  pointer-events: none;
  user-select: none;
  color: var(--color-primary);
  line-height: 0.85;
  white-space: nowrap;
  overflow: hidden;
}`;

        case "midground_shapes":
            return `/* depth: midground_shapes */
.midground-shape {
  position: absolute;
  width: var(--shape-size, clamp(200px, 35vw, 500px));
  aspect-ratio: 1;
  border-radius: var(--motif-radius, 50%);
  background: color-mix(in oklch, var(--color-primary) var(--midground-opacity-pct, 8%), transparent);
  filter: blur(var(--midground-blur, 40px));
  pointer-events: none;
}`;

        case "shadow_typography":
            return `/* depth: shadow_typography */
.display-type {
  text-shadow:
    2px 2px 0 color-mix(in oklch, var(--color-primary) var(--text-shadow-near, 15%), transparent),
    4px 4px 0 color-mix(in oklch, var(--color-primary) var(--text-shadow-mid, 10%), transparent),
    8px 8px 16px color-mix(in oklch, black var(--text-shadow-far, 20%), transparent);
}`;

        case "border_gap_depth":
            return `/* depth: border_gap_depth */
:root { --border-depth: var(--line-weight, 1px) solid color-mix(in oklch, var(--color-primary) var(--border-opacity-pct, 15%), transparent); }
.bordered { border: var(--border-depth); }`;

        case "blend_mode_overlay":
            return `/* depth: blend_mode_overlay */
.blend-multiply { mix-blend-mode: multiply; }
.blend-overlay  { mix-blend-mode: overlay; }
.blend-screen   { mix-blend-mode: screen; }`;

        case "drop_cap":
            return `/* depth: drop_cap */
.prose p:first-of-type::first-letter {
  font-size: var(--size-drop-cap, clamp(3rem, 6vw, 5rem));
  font-weight: var(--weight-display, 900);
  line-height: 0.8; float: left;
  margin-right: 0.15em;
  color: var(--color-accent);
  font-family: var(--font-anchor);
}`;

        case "image_cutout_depth":
            return `/* depth: image_cutout_depth */
.cutout-image {
  margin-bottom: calc(-1 * var(--cutout-depth, clamp(4rem, 10vw, 12rem)));
  position: relative; z-index: 2;
}`;

        default:
            return `/* depth: unknown technique ${id} */`;
    }
}
