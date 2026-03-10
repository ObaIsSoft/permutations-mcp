import { DesignGenome } from "../genome/types.js";

/**
 * CSS Output Generator
 *
 * Generates three formats from the genome:
 *   tailwind — Complete tailwind.config.js with all chromosome values injected
 *   css      — Pure CSS custom properties file (--genome-*)
 *   scss     — SCSS variables and mixin file
 *
 * All ch16_typography values are null-guarded with sensible defaults so the
 * generator never crashes when older genome files are loaded.
 */
export class CSSGenerator {
  generate(genome: DesignGenome, format: "tailwind" | "css" | "scss" = "tailwind"): string {
    if (format === "tailwind") return this.generateTailwindConfig(genome);
    if (format === "css") return this.generateCSSVariables(genome);
    if (format === "scss") return this.generateSCSS(genome);
    return "/* Unknown format */";
  }

  private generateTailwindConfig(genome: DesignGenome): string {
    const ch = genome.chromosomes;
    const typo = ch.ch16_typography; // may be undefined on old genomes
    const primaryColor = this.hslToHex(
      ch.ch5_color_primary.hue,
      ch.ch5_color_primary.saturation * 100,
      ch.ch5_color_primary.lightness * 100
    );

    const bondingRules = genome.constraints.bondingRules.map((r: string) => `// - ${r}`).join('\n');
    const forbiddenPatterns = genome.constraints.forbiddenPatterns.map((p: string) => `// FORBIDDEN: ${p}`).join('\n');
    const requiredPatterns = genome.constraints.requiredPatterns.map((p: string) => `// REQUIRED: ${p}`).join('\n');

    const motionEasing =
      ch.ch8_motion.physics === "spring" ? "cubic-bezier(0.34, 1.56, 0.64, 1)" :
        ch.ch8_motion.physics === "step" ? "steps(8)" :
          ch.ch8_motion.physics === "glitch" ? "steps(2)" :
            "cubic-bezier(0.4, 0, 0.2, 1)";

    return `/** @type {import('tailwindcss').Config} */
// ============================================================
// PERMUTATIONS MCP GENERATED TAILWIND CONFIG
// DNA: ${genome.dnaHash}
// Viability Score: ${genome.viabilityScore}
// ============================================================
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '${primaryColor}',
          hue: ${ch.ch5_color_primary.hue},
        },
        background: '${ch.ch6_color_temp.backgroundTemp === "cool" ? "#0a0a0a" : "#fafaf9"}',
        surface: '${ch.ch6_color_temp.backgroundTemp === "cool" ? "#141414" : "#ffffff"}',
        'surface-elevated': '${ch.ch6_color_temp.backgroundTemp === "cool" ? "#1e1e1e" : "#f4f4f4"}',
      },
      fontFamily: {
        display: ['${ch.ch3_type_display.family}'],
        body: ['${ch.ch4_type_body.family}'],
      },
      fontWeight: {
        display: '${ch.ch3_type_display.weight}',
      },
      spacing: {
        'genome-unit': '${ch.ch2_rhythm.baseSpacing}px',
        'genome-2x': '${ch.ch2_rhythm.baseSpacing * 2}px',
        'genome-4x': '${ch.ch2_rhythm.baseSpacing * 4}px',
      },
      borderRadius: {
        'genome': '${ch.ch7_edge.radius}px',
        'none': '0px',
      },
      fontSize: {
        'display': ['${typo?.display?.size ?? "4rem"}', { lineHeight: '${typo?.display?.lineHeight ?? "1.1"}', letterSpacing: '${typo?.display?.letterSpacing ?? "-0.02em"}' }],
        'h1': ['${typo?.h1?.size ?? "3rem"}', { lineHeight: '${typo?.h1?.lineHeight ?? "1.15"}', letterSpacing: '${typo?.h1?.letterSpacing ?? "-0.015em"}' }],
        'h2': ['${typo?.h2?.size ?? "2rem"}', { lineHeight: '${typo?.h2?.lineHeight ?? "1.25"}', letterSpacing: '${typo?.h2?.letterSpacing ?? "-0.01em"}' }],
        'h3': ['${typo?.h3?.size ?? "1.5rem"}', { lineHeight: '${typo?.h3?.lineHeight ?? "1.35"}', letterSpacing: '${typo?.h3?.letterSpacing ?? "-0.005em"}' }],
        'body': ['${typo?.body?.size ?? "1rem"}', { lineHeight: '${typo?.body?.lineHeight ?? "1.6"}', letterSpacing: '${typo?.body?.letterSpacing ?? "0em"}' }],
        'small': ['${typo?.small?.size ?? "0.875rem"}', { lineHeight: '${typo?.small?.lineHeight ?? "1.5"}', letterSpacing: '${typo?.small?.letterSpacing ?? "0em"}' }],
      },
      transitionTimingFunction: {
        'genome': '${motionEasing}',
      },
      transitionDuration: {
        'genome': '${Math.round(ch.ch8_motion.durationScale * 1000)}ms',
      },
      backdropBlur: {
        'genome': '${Math.round(10 + ch.ch13_atmosphere.intensity * 30)}px',
      },
    },
  },
  plugins: [],
  corePlugins: {
    ${genome.constraints.forbiddenPatterns.includes("heavy_blur_effects") ? "backdropBlur: false," : ""}
  }
};

/*
${bondingRules}
${forbiddenPatterns}
${requiredPatterns}
*/
`;
  }

  private generateCSSVariables(genome: DesignGenome): string {
    const ch = genome.chromosomes;
    const typo = ch.ch16_typography;
    const acc = ch.ch17_accessibility;

    const motionEasing =
      ch.ch8_motion.physics === "spring" ? "cubic-bezier(0.34, 1.56, 0.64, 1)" :
        ch.ch8_motion.physics === "step" ? "steps(8)" :
          ch.ch8_motion.physics === "glitch" ? "steps(2)" :
            "cubic-bezier(0.4, 0, 0.2, 1)";

    return `/* ============================================================
 * PERMUTATIONS MCP — CSS Custom Properties
 * DNA: ${genome.dnaHash}
 * Viability: ${genome.viabilityScore}
 * ============================================================ */

:root {
  /* === Color Chromosome (ch5/ch6) === */
  --genome-hue: ${ch.ch5_color_primary.hue};
  --genome-sat: ${Math.round(ch.ch5_color_primary.saturation * 100)}%;
  --genome-light: ${Math.round(ch.ch5_color_primary.lightness * 100)}%;
  --genome-primary: hsl(var(--genome-hue), var(--genome-sat), var(--genome-light));
  --genome-bg: ${ch.ch6_color_temp.backgroundTemp === "cool" ? "#0a0a0a" : "#fafaf9"};
  --genome-surface: ${ch.ch6_color_temp.backgroundTemp === "cool" ? "#141414" : "#ffffff"};
  --genome-contrast-ratio: ${ch.ch6_color_temp.contrastRatio.toFixed(1)};

  /* === Typography Chromosome (ch3/ch4/ch16) === */
  --genome-font-display: ${ch.ch3_type_display.family};
  --genome-font-body: ${ch.ch4_type_body.family};
  --genome-font-weight-display: ${ch.ch3_type_display.weight};
  --genome-size-display: ${typo?.display?.size ?? "4rem"};
  --genome-size-h1: ${typo?.h1?.size ?? "3rem"};
  --genome-size-h2: ${typo?.h2?.size ?? "2rem"};
  --genome-size-h3: ${typo?.h3?.size ?? "1.5rem"};
  --genome-size-body: ${typo?.body?.size ?? "1rem"};
  --genome-size-small: ${typo?.small?.size ?? "0.875rem"};
  --genome-line-display: ${typo?.display?.lineHeight ?? "1.1"};
  --genome-line-body: ${typo?.body?.lineHeight ?? "1.6"};
  --genome-spacing-letter-display: ${typo?.display?.letterSpacing ?? "-0.02em"};

  /* === Layout/Grid Chromosome (ch1/ch2/ch7/ch9) === */
  --genome-radius: ${ch.ch7_edge.radius}px;
  --genome-spacing: ${ch.ch2_rhythm.baseSpacing}px;
  --genome-asymmetry: ${ch.ch9_grid.asymmetry.toFixed(3)};

  /* === Motion Chromosome (ch8) === */
  --genome-easing: ${motionEasing};
  --genome-duration: ${Math.round(ch.ch8_motion.durationScale * 1000)}ms;

  /* === Atmosphere Chromosome (ch13) === */
  --genome-fx: ${ch.ch13_atmosphere.fx};
  --genome-intensity: ${ch.ch13_atmosphere.intensity.toFixed(3)};
  --genome-blur: ${Math.round(10 + ch.ch13_atmosphere.intensity * 30)}px;

  /* === Accessibility Chromosome (ch17) === */
  --genome-contrast-min: ${acc?.minContrastRatio ?? 4.5};
  --genome-touch-target: ${acc?.minTouchTarget ?? 44}px;
  --genome-focus: ${acc?.focusIndicator ?? "outline"};
}

/* Forbidden pattern enforcement */
${genome.constraints.forbiddenPatterns.map(p => `/* FORBIDDEN: ${p} */`).join('\n')}

/* Required pattern enforcement */
${genome.constraints.requiredPatterns.map(p => `/* REQUIRED: ${p} */`).join('\n')}
`;
  }

  private generateSCSS(genome: DesignGenome): string {
    const ch = genome.chromosomes;
    const typo = ch.ch16_typography;

    return `// ============================================================
// PERMUTATIONS MCP — SCSS Variables
// DNA: ${genome.dnaHash}
// ============================================================

// --- Color ---
$genome-hue: ${ch.ch5_color_primary.hue};
$genome-sat: ${Math.round(ch.ch5_color_primary.saturation * 100)}%;
$genome-light: ${Math.round(ch.ch5_color_primary.lightness * 100)}%;
$genome-primary: hsl($genome-hue, $genome-sat, $genome-light);
$genome-bg: ${ch.ch6_color_temp.backgroundTemp === "cool" ? "#0a0a0a" : "#fafaf9"};
$genome-surface: ${ch.ch6_color_temp.backgroundTemp === "cool" ? "#141414" : "#ffffff"};

// --- Typography ---
$genome-font-display: '${ch.ch3_type_display.family}';
$genome-font-body: '${ch.ch4_type_body.family}';
$genome-weight-display: ${ch.ch3_type_display.weight};
$genome-size-display: ${typo?.display?.size ?? "4rem"};
$genome-size-h1: ${typo?.h1?.size ?? "3rem"};
$genome-size-body: ${typo?.body?.size ?? "1rem"};
$genome-ratio: ${typo?.ratio ?? 1.25};
$genome-base-size: ${typo?.baseSize ?? 16}px;

// --- Layout ---
$genome-radius: ${ch.ch7_edge.radius}px;
$genome-spacing: ${ch.ch2_rhythm.baseSpacing}px;

// --- Motion ---
$genome-duration: ${Math.round(ch.ch8_motion.durationScale * 1000)}ms;
$genome-physics: '${ch.ch8_motion.physics}';

// --- Forbidden Mixins ---
${genome.constraints.forbiddenPatterns.map(p => `// @include enforce-forbidden("${p}");`).join('\n')}
`;
  }

  private hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }
}
