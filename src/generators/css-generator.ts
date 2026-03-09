import { DesignGenome } from "../genome/types.js";

export class CSSGenerator {
    generate(genome: DesignGenome, format: "tailwind" | "css" | "scss" = "tailwind"): string {
        if (format === "tailwind") {
            return this.generateTailwindConfig(genome);
        }
        return "/* CSS generation not implemented for this format */";
    }

    private generateTailwindConfig(genome: DesignGenome): string {
        const ch = genome.chromosomes;
        const primaryColor = this.hslToHex(
            ch.ch5_color_primary.hue,
            ch.ch5_color_primary.saturation * 100,
            ch.ch5_color_primary.lightness * 100
        );

        const bondingRules = genome.constraints.bondingRules.map((r: string) => `// - ${r}`).join('\n');
        const forbiddenPatterns = genome.constraints.forbiddenPatterns.map((p: string) => `// - ${p}`).join('\n');
        const requiredPatterns = genome.constraints.requiredPatterns.map((p: string) => `// + ${p}`).join('\n');

        return `
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '${primaryColor}',
          hue: ${ch.ch5_color_primary.hue},
        },
        background: '${ch.ch6_color_temp.backgroundTemp === "cool" ? "#0a0a0a" : "#f5f5f5"}',
        surface: '${ch.ch6_color_temp.backgroundTemp === "cool" ? "#141414" : "#ffffff"}',
      },
      fontFamily: {
        display: ['${ch.ch3_type_display.family}'],
        body: ['${ch.ch4_type_body.family}'],
      },
      spacing: {
        'genome-unit': '${ch.ch2_rhythm.baseSpacing}px',
      },
      borderRadius: {
        'genome': '${ch.ch7_edge.radius}px',
        'none': '0px',
      },
      fontSize: {
        'display': ['${ch.ch16_typography.display.size}', { lineHeight: '${ch.ch16_typography.display.lineHeight}', letterSpacing: '${ch.ch16_typography.display.letterSpacing}' }],
        'h1': ['${ch.ch16_typography.h1.size}', { lineHeight: '${ch.ch16_typography.h1.lineHeight}', letterSpacing: '${ch.ch16_typography.h1.letterSpacing}' }],
        'h2': ['${ch.ch16_typography.h2.size}', { lineHeight: '${ch.ch16_typography.h2.lineHeight}', letterSpacing: '${ch.ch16_typography.h2.letterSpacing}' }],
        'h3': ['${ch.ch16_typography.h3.size}', { lineHeight: '${ch.ch16_typography.h3.lineHeight}', letterSpacing: '${ch.ch16_typography.h3.letterSpacing}' }],
        'body': ['${ch.ch16_typography.body.size}', { lineHeight: '${ch.ch16_typography.body.lineHeight}', letterSpacing: '${ch.ch16_typography.body.letterSpacing}' }],
        'small': ['${ch.ch16_typography.small.size}', { lineHeight: '${ch.ch16_typography.small.lineHeight}', letterSpacing: '${ch.ch16_typography.small.letterSpacing}' }],
      },
      transitionTimingFunction: {
        'genome': '${ch.ch8_motion.physics === "spring" ? "cubic-bezier(0.34, 1.56, 0.64, 1)" : ch.ch8_motion.physics === "step" ? "steps(8)" : "cubic-bezier(0.4, 0, 0.2, 1)"}',
      },
      transitionDuration: {
        'genome': '${ch.ch8_motion.durationScale * 1000}ms',
      },
    },
  },
  plugins: [],
  corePlugins: {
    ${genome.constraints.forbiddenPatterns.includes("heavy_blur_effects") ? "backdropBlur: false," : ""}
  }
};

/*
Design Genome DNA: ${genome.dnaHash}
Viability Score: ${genome.viabilityScore}
Bonding Rules Applied:
${bondingRules}

Forbidden Patterns:
${forbiddenPatterns}

Required Patterns:
${requiredPatterns}
*/
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
