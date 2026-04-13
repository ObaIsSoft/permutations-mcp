/**
 * Variation Catalog
 *
 * Variation is how the page breathes. Same grid, same alignment, same
 * background for every section = boring. Like music: loud sections, quiet
 * sections, fast sections, slow sections.
 *
 * Each section gets an aesthetic "mode". The sequencing pattern is
 * genome-driven — not alternating but patterned, driven by philosophy.
 */

import { SectionMode, VariationSequence, DesignPhilosophy } from "./genome/types.js";

// ── Section mode definitions ──────────────────────────────────────────────────

export interface SectionModeDefinition {
    mode: SectionMode;
    description: string;
    /** Layout approach for this mode */
    layout: string;
    /** Typography character */
    typography: string;
    /** Background approach */
    background: string;
    /** Content density */
    density: "dense" | "comfortable" | "spacious" | "empty";
    /** CSS data attributes to inject */
    dataAttrs: Record<string, string>;
    /** Min-height hint */
    minHeight?: string;
}

export const SECTION_MODE_CATALOG: SectionModeDefinition[] = [
    {
        mode: "loud",
        description: "Full-bleed, asymmetric, vivid — maximum density and colour.",
        layout: "full-bleed asymmetric",
        typography: "large bold tight — var(--font-anchor)",
        background: "vivid primary or gradient",
        density: "dense",
        dataAttrs: { "data-mode": "loud" },
    },
    {
        mode: "quiet",
        description: "Centred narrow column, generous whitespace — space as the message.",
        layout: "centred max-width 65ch",
        typography: "small light weight — var(--font-body)",
        background: "clean surface",
        density: "spacious",
        dataAttrs: { "data-mode": "quiet" },
    },
    {
        mode: "data",
        description: "Grid or bento layout, structured — numbers first.",
        layout: "auto-fit grid minmax(280px,1fr)",
        typography: "monospace accent for numbers, regular body for labels",
        background: "neutral",
        density: "dense",
        dataAttrs: { "data-mode": "data" },
    },
    {
        mode: "editorial",
        description: "Magazine layout, pull quote, unequal columns — content-rich.",
        layout: "asymmetric multi-column",
        typography: "mixed hierarchy — anchor for pull quotes, body for prose",
        background: "light + image",
        density: "comfortable",
        dataAttrs: { "data-mode": "editorial" },
    },
    {
        mode: "cinematic",
        description: "Full viewport, minimal text — one phrase, maximum impact.",
        layout: "full viewport centred",
        typography: "one phrase, massive — clamp(5rem, 15vw, 18rem)",
        background: "dark + image/video/gradient",
        density: "empty",
        minHeight: "100vh",
        dataAttrs: { "data-mode": "cinematic" },
    },
    {
        mode: "technical",
        description: "Code-style, monospace dominant, dark terminal feel.",
        layout: "tight, precise, structured",
        typography: "monospace at regular weight — var(--font-accent, --font-body)",
        background: "dark terminal",
        density: "dense",
        dataAttrs: { "data-mode": "technical" },
    },
    {
        mode: "social",
        description: "Logo wall, testimonial grid, faces — trust by density.",
        layout: "masonry or uniform grid",
        typography: "captions, small labels",
        background: "surface",
        density: "comfortable",
        dataAttrs: { "data-mode": "social" },
    },
    {
        mode: "action",
        description: "CTA-focused, button large, supporting copy minimal — convert.",
        layout: "centred, focused",
        typography: "medium weight, punchy",
        background: "accent colour",
        density: "comfortable",
        dataAttrs: { "data-mode": "action" },
    },
];

// ── Sequence pattern definitions ──────────────────────────────────────────────

export interface SequencePattern {
    sequence: VariationSequence;
    description: string;
    /** Ordered section modes — first = hero area, last = footer area */
    modes: SectionMode[];
    /** Which philosophies this sequence is ideal for */
    idealFor: DesignPhilosophy[];
}

export const SEQUENCE_CATALOG: SequencePattern[] = [
    {
        sequence: "hero_build",
        description: "Dramatic then explains then converts — standard product narrative.",
        modes: ["cinematic", "loud", "quiet", "data", "action"],
        idealFor: ["brand_heavy"],
    },
    {
        sequence: "editorial_flow",
        description: "Magazine narrative — image-forward, content-rich, then social proof.",
        modes: ["loud", "editorial", "quiet", "social", "action"],
        idealFor: ["editorial", "expressive"],
    },
    {
        sequence: "app_story",
        description: "Product story — cinematic hook, technical proof, data, feature narrative.",
        modes: ["cinematic", "technical", "data", "editorial", "action"],
        idealFor: ["technical"],
    },
    {
        sequence: "brand_reveal",
        description: "Slow build to big moment — quiet restraint then cinematic impact.",
        modes: ["quiet", "quiet", "loud", "cinematic", "action"],
        idealFor: ["minimalist", "swiss_grid", "brand_heavy"],
    },
    {
        sequence: "mixed_chaos",
        description: "High entropy genre-switching — constantly subverting expectation.",
        modes: ["loud", "cinematic", "data", "quiet", "loud", "action"],
        idealFor: ["chaotic", "expressive"],
    },
    {
        sequence: "minimal_voice",
        description: "One clear voice — low entropy, restrained, typographically led.",
        modes: ["quiet", "quiet", "editorial", "quiet", "action"],
        idealFor: ["minimalist", "swiss_grid"],
    },
];

// ── CSS generation ────────────────────────────────────────────────────────────

/**
 * Generate CSS for all section modes — applied via data-mode attributes.
 * Each section gets [data-mode="X"] and optional [data-parity="odd/even"].
 *
 * All colour, spacing, font, and sizing values reference genome CSS custom
 * properties. Nothing is hardcoded — values emerge from the genome's variable
 * system (--color-*, --spacing-*, --font-*, --opacity-*, --palette-*, etc.).
 */
export function generateVariationCSS(): string {
    return `
/* ── Section Mode System ────────────────────────────────────────────────── */
/* All values reference genome CSS vars — no hardcoded colours or sizes.    */

/* loud — full-bleed, asymmetric, vivid, dense */
[data-mode="loud"] {
  padding: var(--spacing-lg) 0;
  background: linear-gradient(
    var(--gradient-dir, 135deg),
    var(--color-primary),
    var(--color-accent)
  );
  color: var(--color-on-primary);
  overflow: hidden;
}
[data-mode="loud"] .section-headline {
  font-size: var(--size-display-xl, clamp(3rem, 8vw, 10rem));
  font-weight: var(--weight-display, 900);
  letter-spacing: var(--tracking-display, -0.03em);
  line-height: var(--leading-display, 0.9);
  font-family: var(--font-anchor);
}

/* quiet — centred narrow, generous space */
[data-mode="quiet"] {
  max-width: 65ch;
  margin-inline: auto;
  padding: var(--spacing-2xl) var(--spacing-md);
}
[data-mode="quiet"] .section-headline {
  font-size: var(--size-display-sm, clamp(1.75rem, 3vw, 3rem));
  font-weight: var(--weight-body, 400);
  letter-spacing: var(--tracking-tight, -0.01em);
  font-family: var(--font-anchor);
  color: var(--color-text);
}
[data-mode="quiet"] .section-body {
  font-size: var(--size-body-lg, clamp(1rem, 1.5vw, 1.25rem));
  line-height: var(--leading-body, 1.7);
  font-family: var(--font-body, var(--font-anchor));
  color: var(--color-text);
  opacity: var(--opacity-secondary);
}

/* data — grid/bento, structured, numbers first */
[data-mode="data"] {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-md);
  padding: var(--spacing-xl) var(--spacing-lg);
  background: var(--color-surface);
}
[data-mode="data"] .stat-value {
  font-size: var(--size-display-lg, clamp(2.5rem, 6vw, 7rem));
  font-weight: var(--weight-display, 900);
  font-family: var(--font-accent, var(--font-anchor));
  font-variant-numeric: tabular-nums;
  color: var(--color-primary);
}
[data-mode="data"] .stat-label {
  font-size: var(--size-label, clamp(0.75rem, 1.2vw, 1rem));
  font-family: var(--font-body, var(--font-anchor));
  color: var(--color-text);
  opacity: var(--opacity-tertiary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* editorial — magazine, pull quote, unequal columns */
[data-mode="editorial"] {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: var(--spacing-xl);
  padding: var(--spacing-xl) var(--spacing-lg);
  align-items: start;
  background: var(--color-bg);
}
@media (max-width: 768px) {
  [data-mode="editorial"] { grid-template-columns: 1fr; }
}
[data-mode="editorial"] .pull-quote {
  font-size: var(--size-display-sm, clamp(1.5rem, 3vw, 3rem));
  font-family: var(--font-anchor);
  font-weight: var(--weight-display, 700);
  letter-spacing: var(--tracking-tight, -0.02em);
  border-left: var(--line-weight, 3px) solid var(--color-primary);
  padding-left: var(--spacing-md);
  color: var(--color-text);
  font-style: italic;
}

/* cinematic — full viewport, one phrase, maximum impact */
[data-mode="cinematic"] {
  min-height: 100vh;
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;
  background: var(--strata-bg, var(--color-bg));
}
[data-mode="cinematic"] .section-headline {
  font-size: var(--size-display-max, clamp(5rem, 15vw, 18rem));
  font-weight: var(--weight-display, 900);
  letter-spacing: var(--tracking-ultra, -0.04em);
  line-height: var(--leading-display, 0.85);
  font-family: var(--font-anchor);
  color: var(--color-on-surface-dark, var(--color-on-primary));
  text-align: center;
}

/* technical — code-style, monospace, dark terminal */
[data-mode="technical"] {
  padding: var(--spacing-xl) var(--spacing-lg);
  background: var(--strata-bg, color-mix(in oklch, var(--color-bg) 95%, black));
  color: var(--color-terminal, color-mix(in oklch, var(--color-primary) 80%, oklch(0.9 0.1 150)));
}
[data-mode="technical"] * {
  font-family: var(--font-accent, var(--font-anchor));
}
[data-mode="technical"] .section-headline {
  font-size: var(--size-display-sm, clamp(1.5rem, 3vw, 2.5rem));
  font-weight: var(--weight-body, 400);
  letter-spacing: 0.02em;
  opacity: var(--opacity-secondary);
}
[data-mode="technical"] .code-prefix {
  opacity: var(--opacity-tertiary);
}

/* social — logo wall, testimonials, faces */
[data-mode="social"] {
  padding: var(--spacing-xl) var(--spacing-lg);
  background: var(--color-surface);
}
[data-mode="social"] .logo-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
  align-items: center;
  justify-content: center;
  opacity: var(--opacity-secondary);
}
[data-mode="social"] .testimonial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

/* action — CTA-focused, convert */
[data-mode="action"] {
  padding: var(--spacing-2xl) var(--spacing-lg);
  text-align: center;
  background: var(--color-accent);
  color: var(--color-on-accent, var(--color-on-primary));
}
[data-mode="action"] .cta-headline {
  font-size: var(--size-display-md, clamp(2rem, 5vw, 5rem));
  font-weight: var(--weight-display, 900);
  letter-spacing: var(--tracking-tight, -0.02em);
  font-family: var(--font-anchor);
  margin-bottom: var(--spacing-md);
}
[data-mode="action"] .btn-primary {
  font-size: var(--size-body-lg, clamp(1rem, 2vw, 1.375rem));
  padding: 1em 2.5em;
  border-radius: var(--radius-full);
  background: var(--color-on-accent, var(--color-surface));
  color: var(--color-accent);
  font-weight: var(--weight-display, 700);
  border: none;
  cursor: pointer;
  transition: transform var(--duration-fast, 0.2s), box-shadow var(--duration-fast, 0.2s);
}
[data-mode="action"] .btn-primary:hover {
  transform: scale(1.04);
  box-shadow: var(--shadow-elevation-2, 0 8px 24px color-mix(in oklch, var(--color-accent) 30%, transparent));
}

/* parity alternation for color_band and spacing_scale rhythms */
[data-parity="odd"]  { background: var(--band-odd, var(--color-bg)); }
[data-parity="even"] { background: var(--band-even, var(--color-surface)); }
`.trim();
}

// ── Sequence resolver ─────────────────────────────────────────────────────────

/**
 * Given a sequence pattern and a section index, return the SectionMode
 * for that section. Wraps around if index exceeds the mode list.
 */
export function getModeForSection(sequence: VariationSequence, sectionIndex: number): SectionMode {
    const pattern = SEQUENCE_CATALOG.find(s => s.sequence === sequence);
    if (!pattern) return "quiet";
    return pattern.modes[sectionIndex % pattern.modes.length];
}

/**
 * Get the full ordered mode list for a sequence.
 */
export function getSequenceModes(sequence: VariationSequence): SectionMode[] {
    return SEQUENCE_CATALOG.find(s => s.sequence === sequence)?.modes ?? ["quiet", "action"];
}
