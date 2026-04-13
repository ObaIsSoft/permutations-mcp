/**
 * Star Catalog
 *
 * The Star is the one hero element in the first viewport that makes a user
 * stop scrolling. Everything else in the hero exists to support it.
 *
 * The Star can be `none` — a swiss_grid or minimalist genome wouldn't use
 * one. The headline IS the hero. Restraint is the statement.
 *
 * Catalog entries describe WHAT a star type is and its layout rules.
 * CSS generation reads the active StarEntry and genome CSS vars — no
 * hardcoded colours, sizes, or values in the catalog itself.
 */
export const STAR_CATALOG = [
    {
        type: "none",
        description: "No star — headline + whitespace carry the hero. Restraint is the statement.",
        forbiddenFor: {},
        headlineScale: "normal",
        ghostSupportingText: false,
        ctaAnchor: "below_center",
        dimensionVars: { width: "unset" },
    },
    {
        type: "logo_as_art",
        description: "Brand mark blown up to 40–80vw — the logo becomes the experience.",
        forbiddenFor: {
            philosophies: ["swiss_grid", "technical", "minimalist"],
            entropyFloor: 0.45,
        },
        headlineScale: "down",
        ghostSupportingText: true,
        ctaAnchor: "bottom_right_of_star",
        dimensionVars: { width: "clamp(var(--spacing-2xl), 60vw, 90vw)" },
    },
    {
        type: "oversized_phrase",
        description: "3–6 words at display scale, filling full viewport width.",
        forbiddenFor: {},
        headlineScale: "up",
        ghostSupportingText: false,
        ctaAnchor: "below_center",
        dimensionVars: { width: "100%" },
    },
    {
        type: "animated_gradient",
        description: "Full-viewport animated mesh gradient — colour in motion.",
        forbiddenFor: {
            requiresPhysics: ["spring", "wave", "ripple", "magnetic", "particle", "glitch"],
            entropyFloor: 0.35,
        },
        headlineScale: "normal",
        ghostSupportingText: false,
        ctaAnchor: "overlay_bottom",
        dimensionVars: { width: "100vw", height: "100vh" },
    },
    {
        type: "3d_object",
        description: "Three.js scene centred in hero, content overlaid or adjacent.",
        forbiddenFor: {
            requiresPhysics: ["spring", "wave", "magnetic", "particle"],
            philosophies: ["minimalist", "swiss_grid"],
            entropyFloor: 0.50,
        },
        headlineScale: "down",
        ghostSupportingText: true,
        ctaAnchor: "bottom_right_of_star",
        dimensionVars: { width: "clamp(var(--spacing-section), 50vw, 80vw)" },
    },
    {
        type: "signature_image",
        description: "Full-bleed photography/illustration with blend mode — editorial gravitas.",
        forbiddenFor: {},
        headlineScale: "down",
        ghostSupportingText: false,
        ctaAnchor: "overlay_bottom",
        dimensionVars: { width: "100%", height: "100vh" },
    },
    {
        type: "data_number",
        description: "One enormous animated stat/counter — the number speaks.",
        forbiddenFor: {
            philosophies: ["chaotic"],
        },
        headlineScale: "down",
        ghostSupportingText: true,
        ctaAnchor: "below_center",
        dimensionVars: { width: "clamp(var(--spacing-2xl), 40vw, 60vw)" },
    },
    {
        type: "svg_mark",
        description: "Animated SVG path draw — brand mark reveals stroke by stroke.",
        forbiddenFor: {
            requiresPhysics: ["spring", "wave", "magnetic", "particle"],
            philosophies: ["minimalist"],
            entropyFloor: 0.40,
        },
        headlineScale: "down",
        ghostSupportingText: false,
        ctaAnchor: "bottom_right_of_star",
        dimensionVars: { width: "clamp(var(--spacing-xl), 35vw, 55vw)" },
    },
    {
        type: "kinetic_type",
        description: "Per-character animation on one hero phrase — type as performance.",
        forbiddenFor: {
            requiresPhysics: ["spring", "wave", "magnetic", "particle"],
            philosophies: ["swiss_grid", "technical"],
            entropyFloor: 0.45,
        },
        headlineScale: "up",
        ghostSupportingText: false,
        ctaAnchor: "below_center",
        dimensionVars: { width: "100%" },
    },
    {
        type: "video_loop",
        description: "Muted autoplay video loop — product/lifestyle in motion.",
        forbiddenFor: {
            requiresVideo: true,
            philosophies: ["minimalist", "swiss_grid"],
        },
        headlineScale: "normal",
        ghostSupportingText: false,
        ctaAnchor: "overlay_bottom",
        dimensionVars: { width: "100vw", height: "100vh" },
    },
    {
        type: "color_field",
        description: "A section of pure intense colour — the palette becomes the hero.",
        forbiddenFor: {
            philosophies: ["technical"],
            entropyFloor: 0.40,
        },
        headlineScale: "normal",
        ghostSupportingText: false,
        ctaAnchor: "below_center",
        dimensionVars: { width: "100%", height: "100vh" },
    },
    {
        type: "grid_mosaic",
        description: "Asymmetric image grid occupying left ~60% of viewport.",
        forbiddenFor: {
            philosophies: ["minimalist", "technical"],
            entropyFloor: 0.35,
        },
        headlineScale: "down",
        ghostSupportingText: false,
        ctaAnchor: "adjacent_right",
        dimensionVars: { width: "60%" },
    },
    {
        type: "noise_canvas",
        description: "Animated canvas noise field — textural, generative, alive.",
        forbiddenFor: {
            requiresPhysics: ["spring", "wave", "magnetic", "particle"],
            philosophies: ["minimalist", "swiss_grid", "brand_heavy"],
            entropyFloor: 0.55,
        },
        headlineScale: "normal",
        ghostSupportingText: true,
        ctaAnchor: "overlay_bottom",
        dimensionVars: { width: "100vw", height: "100vh" },
    },
];
// ── Star lookup ───────────────────────────────────────────────────────────────
export function getStarEntry(type) {
    return STAR_CATALOG.find(e => e.type === type) ?? STAR_CATALOG[0];
}
// ── CSS generation ────────────────────────────────────────────────────────────
/**
 * Generate CSS custom properties and structural rules for the star system.
 * All colour/size values reference genome CSS custom properties set by the
 * main generator — no hardcoded values here.
 */
export function generateStarCSS(star) {
    if (star.type === "none") {
        return `/* star: none — headline + whitespace carry the hero */\n:root { --star-type: none; }`;
    }
    const lines = [
        `/* Star: ${star.type} — ${star.description} */`,
        `:root {`,
        `  --star-type: ${star.type};`,
        `  --star-width: ${star.dimensionVars.width};`,
        star.dimensionVars.height ? `  --star-height: ${star.dimensionVars.height};` : "",
        `  --star-cta-anchor: ${star.ctaAnchor};`,
        `}`,
        ``,
        `.hero-star {`,
        `  width: var(--star-width);`,
        star.dimensionVars.height ? `  height: var(--star-height);` : "",
        `  max-width: 100%;`,
        `  position: relative;`,
        `}`,
    ].filter(Boolean);
    // Type-specific structural rules — all values via genome vars
    if (star.type === "oversized_phrase" || star.type === "kinetic_type") {
        lines.push(``, `.hero-star-type {`, `  font-size: var(--size-display-max, clamp(5rem, 14vw, 18rem));`, `  font-weight: var(--weight-display, 900);`, `  letter-spacing: var(--tracking-ultra, -0.04em);`, `  font-family: var(--font-anchor);`, `  color: var(--color-text);`, `}`, `.hero-star-type .char { display: inline-block; }`);
    }
    else if (star.type === "logo_as_art") {
        lines.push(``, `.hero-star-logo {`, `  width: var(--star-width);`, `  opacity: var(--opacity-primary);`, `  display: block;`, `}`);
    }
    else if (star.type === "data_number") {
        lines.push(``, `.hero-star-number {`, `  font-size: var(--size-display-max, clamp(6rem, 18vw, 22rem));`, `  font-weight: var(--weight-display, 900);`, `  font-family: var(--font-accent, var(--font-anchor));`, `  font-variant-numeric: tabular-nums;`, `  color: var(--color-primary);`, `}`);
    }
    else if (star.type === "animated_gradient") {
        lines.push(``, `.hero-star-gradient {`, `  position: absolute; inset: 0; z-index: 0;`, `  background:`, `    radial-gradient(ellipse at 20% 50%, color-mix(in oklch, var(--color-primary) 40%, transparent) 0%, transparent 50%),`, `    radial-gradient(ellipse at 80% 20%, color-mix(in oklch, var(--color-accent) 35%, transparent) 0%, transparent 50%),`, `    radial-gradient(ellipse at 50% 80%, color-mix(in oklch, var(--color-primary) 25%, transparent) 0%, transparent 60%);`, `  background-color: var(--color-bg);`, `  animation: hero-gradient-drift var(--duration-ambient, 8s) ease-in-out infinite alternate;`, `}`, `@keyframes hero-gradient-drift {`, `  0%   { background-position: 0% 50%; }`, `  100% { background-position: 100% 50%; }`, `}`);
    }
    else if (star.type === "noise_canvas") {
        lines.push(``, `.hero-star-noise { position: absolute; inset: 0; z-index: 0; }`, `.hero-star-noise canvas { width: 100%; height: 100%; display: block; }`);
    }
    else if (star.type === "color_field") {
        lines.push(``, `.hero-star-color-field {`, `  position: absolute; inset: 0; z-index: 0;`, `  background: var(--color-primary);`, `}`);
    }
    else if (star.type === "grid_mosaic") {
        lines.push(``, `.hero-star-mosaic {`, `  display: grid;`, `  grid-template-columns: repeat(2, 1fr);`, `  grid-template-rows: repeat(3, 1fr);`, `  gap: var(--spacing-xs);`, `  width: var(--star-width);`, `  max-height: 100vh;`, `}`, `.hero-star-mosaic .mosaic-item:first-child { grid-row: 1 / 3; }`, `.hero-star-mosaic .mosaic-item:last-child  { grid-column: 2; grid-row: 2 / 4; }`, `.hero-star-mosaic .mosaic-item { overflow: hidden; border-radius: var(--radius-md); }`, `.hero-star-mosaic .mosaic-item img { width: 100%; height: 100%; object-fit: cover; }`);
    }
    else if (star.type === "video_loop") {
        lines.push(``, `.hero-star-video { position: absolute; inset: 0; z-index: 0; }`, `.hero-star-video video { width: 100%; height: 100%; object-fit: cover; }`);
    }
    else if (star.type === "signature_image") {
        lines.push(``, `.hero-star-image { position: absolute; inset: 0; z-index: 0; }`, `.hero-star-image img { width: 100%; height: 100%; object-fit: cover; }`);
    }
    else if (star.type === "svg_mark") {
        lines.push(``, `.hero-star-svg {`, `  width: var(--star-width);`, `  stroke: var(--color-primary);`, `  stroke-dasharray: 1000;`, `  stroke-dashoffset: 1000;`, `  animation: svg-draw var(--duration-slow, 2s) ease-out forwards;`, `}`, `@keyframes svg-draw { to { stroke-dashoffset: 0; } }`);
    }
    // Ghost supporting text — uses genome opacity var, not hardcoded opacity
    if (star.ghostSupportingText) {
        lines.push(``, `.hero-supporting {`, `  font-size: var(--size-display-max, clamp(8rem, 25vw, 22rem));`, `  font-weight: var(--weight-display, 900);`, `  font-family: var(--font-anchor);`, `  color: var(--color-primary);`, `  opacity: var(--opacity-ghost);`, `  position: absolute;`, `  pointer-events: none;`, `  user-select: none;`, `  letter-spacing: var(--tracking-ultra, -0.05em);`, `  line-height: 0.85;`, `  white-space: nowrap;`, `  overflow: hidden;`, `}`);
    }
    return lines.join("\n");
}
