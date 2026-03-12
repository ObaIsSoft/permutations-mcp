/**
 * Permutations MCP - Additional Format Generators
 *
 * Generates output in various formats:
 * - Vue/Svelte components
 * - Figma Design Tokens
 * - CSS-in-JS (styled-components, emotion)
 * - Style Dictionary
 */
import * as crypto from "crypto";
/**
 * Generates design outputs in various formats
 */
export class FormatGenerator {
    getHashByte(seed, index) {
        const hash = crypto.createHash("sha256").update(seed).digest("hex");
        return parseInt(hash.slice(index * 2, index * 2 + 2), 16) / 255;
    }
    /**
     * Generate all alternative formats for a design genome
     */
    generateAllFormats(genome, tier) {
        return {
            figmaTokens: this.generateFigmaTokens(genome),
            styleDictionary: this.generateStyleDictionary(genome),
            styledComponents: this.generateStyledComponents(genome),
            emotion: this.generateEmotion(genome),
            vueComponents: this.generateVueLibrary(genome, tier),
            svelteComponents: this.generateSvelteLibrary(genome, tier)
        };
    }
    /**
     * Generate Figma Design Tokens (Tokens Studio format)
     */
    generateFigmaTokens(genome) {
        const primary = genome.chromosomes.ch5_color_primary;
        const ch6 = genome.chromosomes.ch6_color_temp;
        const ch2 = genome.chromosomes.ch2_rhythm;
        const ch7 = genome.chromosomes.ch7_edge;
        const ch8 = genome.chromosomes.ch8_motion;
        const display = genome.chromosomes.ch3_type_display;
        const body = genome.chromosomes.ch4_type_body;
        const tokens = {
            global: {
                color: {
                    primary: {
                        value: `hsl(${primary.hue}, ${Math.round(primary.saturation * 100)}%, ${Math.round(primary.lightness * 100)}%)`,
                        type: "color"
                    },
                    "primary-hue": {
                        value: primary.hue,
                        type: "number"
                    },
                    background: {
                        value: ch6.surfaceStack[0],
                        type: "color"
                    },
                    surface: {
                        value: ch6.surfaceStack[1],
                        type: "color"
                    },
                    "surface-elevated": {
                        value: ch6.elevatedSurface,
                        type: "color"
                    },
                    accent: {
                        value: ch6.accentColor,
                        type: "color"
                    }
                },
                font: {
                    display: {
                        value: display.family,
                        type: "fontFamilies"
                    },
                    body: {
                        value: body.family,
                        type: "fontFamilies"
                    }
                },
                spacing: {
                    unit: {
                        value: ch2.baseSpacing,
                        type: "spacing"
                    },
                    "section-gap": {
                        value: ch2.sectionSpacing,
                        type: "spacing"
                    },
                    "component-gap": {
                        value: ch2.componentSpacing,
                        type: "spacing"
                    }
                },
                "border-radius": {
                    genome: {
                        value: `${ch7.radius}px`,
                        type: "borderRadius"
                    },
                    component: {
                        value: `${ch7.componentRadius}px`,
                        type: "borderRadius"
                    }
                },
                animation: {
                    duration: {
                        value: `${ch8.durationScale}s`,
                        type: "time"
                    },
                    "stagger-delay": {
                        value: `${ch8.staggerDelay}s`,
                        type: "time"
                    }
                }
            },
            "$themes": [],
            "$metadata": {
                tokenSetOrder: ["global"],
                version: "1.0.0",
                generator: "Permutations MCP",
                dnaHash: genome.dnaHash
            }
        };
        return {
            format: "figma-tokens",
            content: JSON.stringify(tokens, null, 2),
            fileExtension: "tokens.json",
            dependencies: []
        };
    }
    /**
     * Generate Style Dictionary compatible JSON
     */
    generateStyleDictionary(genome) {
        const primary = genome.chromosomes.ch5_color_primary;
        const ch6 = genome.chromosomes.ch6_color_temp;
        const ch2 = genome.chromosomes.ch2_rhythm;
        const ch7 = genome.chromosomes.ch7_edge;
        const display = genome.chromosomes.ch3_type_display;
        const body = genome.chromosomes.ch4_type_body;
        const b = (idx) => this.getHashByte(genome.dnaHash + "tokens", idx);
        // Hash-derived timing values: 100-200ms fast, 250-400ms normal, 400-700ms slow
        const timingFast = 100 + Math.floor(b(220) * 100);
        const timingNormal = 250 + Math.floor(b(221) * 150);
        const timingSlow = 400 + Math.floor(b(222) * 300);
        const tokens = {
            color: {
                primary: { value: `hsl(${primary.hue}, ${Math.round(primary.saturation * 100)}%, ${Math.round(primary.lightness * 100)}%)` },
                background: { value: ch6.surfaceStack[0] },
                surface: { value: ch6.surfaceStack[1] },
                accent: { value: ch6.accentColor }
            },
            font: {
                display: { value: display.family },
                body: { value: body.family }
            },
            spacing: {
                xs: { value: `${ch2.baseSpacing * 0.5}px` },
                sm: { value: `${ch2.baseSpacing}px` },
                md: { value: `${ch2.baseSpacing * 2}px` },
                lg: { value: `${ch2.baseSpacing * 4}px` },
                xl: { value: `${ch2.sectionSpacing}px` }
            },
            "border-radius": {
                sm: { value: `${ch7.componentRadius}px` },
                md: { value: `${ch7.radius}px` },
                lg: { value: `${ch7.radius * 2}px` }
            },
            transition: {
                fast: { value: `${timingFast}ms` },
                normal: { value: `${timingNormal}ms` },
                slow: { value: `${timingSlow}ms` }
            }
        };
        return {
            format: "style-dictionary",
            content: JSON.stringify(tokens, null, 2),
            fileExtension: "json",
            dependencies: ["style-dictionary"]
        };
    }
    /**
     * Generate styled-components theme
     */
    generateStyledComponents(genome) {
        const primary = genome.chromosomes.ch5_color_primary;
        const ch6 = genome.chromosomes.ch6_color_temp;
        const ch2 = genome.chromosomes.ch2_rhythm;
        const ch7 = genome.chromosomes.ch7_edge;
        const ch8 = genome.chromosomes.ch8_motion;
        const display = genome.chromosomes.ch3_type_display;
        const body = genome.chromosomes.ch4_type_body;
        const content = `// Generated by Permutations MCP
// DNA Hash: ${genome.dnaHash}

import { DefaultTheme } from 'styled-components';

export const genomeTheme: DefaultTheme = {
  colors: {
    primary: {
      hue: ${primary.hue},
      saturation: ${Math.round(primary.saturation * 100)},
      lightness: ${Math.round(primary.lightness * 100)},
      hex: '${primary.hex}',
      css: 'hsl(${primary.hue}, ${Math.round(primary.saturation * 100)}%, ${Math.round(primary.lightness * 100)}%)',
    },
    background: '${ch6.surfaceStack[0]}',
    surface: '${ch6.surfaceStack[1]}',
    elevated: '${ch6.elevatedSurface}',
    accent: '${ch6.accentColor}',
  },
  fonts: {
    display: '${display.family}',
    body: '${body.family}',
  },
  spacing: {
    unit: ${ch2.baseSpacing},
    section: ${ch2.sectionSpacing},
    component: ${ch2.componentSpacing},
  },
  borderRadius: {
    genome: ${ch7.radius},
    component: ${ch7.componentRadius},
  },
  animation: {
    duration: ${ch8.durationScale},
    staggerDelay: ${ch8.staggerDelay},
    physics: '${ch8.physics}',
  },
};

// Helper functions
export const getPrimaryColor = (alpha?: number) => 
  alpha !== undefined 
    ? \`hsl(\${genomeTheme.colors.primary.hue}, \${genomeTheme.colors.primary.saturation}%, \${genomeTheme.colors.primary.lightness}%, \${alpha})\`
    : genomeTheme.colors.primary.css;
`;
        return {
            format: "styled-components",
            content,
            fileExtension: "ts",
            dependencies: ["styled-components"]
        };
    }
    /**
     * Generate Emotion theme
     */
    generateEmotion(genome) {
        const primary = genome.chromosomes.ch5_color_primary;
        const ch6 = genome.chromosomes.ch6_color_temp;
        const ch2 = genome.chromosomes.ch2_rhythm;
        const ch7 = genome.chromosomes.ch7_edge;
        const ch8 = genome.chromosomes.ch8_motion;
        const display = genome.chromosomes.ch3_type_display;
        const body = genome.chromosomes.ch4_type_body;
        const content = `/** @jsxImportSource @emotion/react */
// Generated by Permutations MCP
// DNA Hash: ${genome.dnaHash}

import { Theme } from '@emotion/react';

export const genomeTheme: Theme = {
  colors: {
    primary: 'hsl(${primary.hue}, ${Math.round(primary.saturation * 100)}%, ${Math.round(primary.lightness * 100)}%)',
    background: '${ch6.surfaceStack[0]}',
    surface: '${ch6.surfaceStack[1]}',
    accent: '${ch6.accentColor}',
  },
  fonts: {
    display: '${display.family}',
    body: '${body.family}',
  },
  spacing: {
    unit: ${ch2.baseSpacing},
    section: ${ch2.sectionSpacing},
    component: ${ch2.componentSpacing},
  },
  borderRadius: ${ch7.radius},
  animation: {
    duration: ${ch8.durationScale},
    physics: '${ch8.physics}',
  },
};

// Utility for creating component styles
export const genomeStyles = {
  container: {
    backgroundColor: 'var(--color-background)',
    borderRadius: ${ch7.radius},
    padding: ${ch2.baseSpacing * 2},
  },
  primaryButton: {
    backgroundColor: 'var(--color-primary)',
    borderRadius: ${ch7.componentRadius},
    padding: \`${ch2.baseSpacing}px ${ch2.baseSpacing * 2}px\`,
    transition: 'all ${ch8.durationScale}s ${ch8.physics === "spring" ? "cubic-bezier(0.34, 1.56, 0.64, 1)" : "ease-out"}',
  },
};
`;
        return {
            format: "emotion",
            content,
            fileExtension: "ts",
            dependencies: ["@emotion/react", "@emotion/styled"]
        };
    }
    /**
     * Generate Vue component library
     */
    generateVueLibrary(genome, tier) {
        const components = tier?.components.list || [];
        const componentFiles = components.map(spec => {
            return this.generateVueComponent(spec, genome);
        }).join("\n\n");
        const content = `<!-- Generated by Permutations MCP -->
<!-- DNA Hash: ${genome.dnaHash} -->

${componentFiles}

<!-- Theme Configuration -->
<script>
export const genomeConfig = ${JSON.stringify({
            primaryHue: genome.chromosomes.ch5_color_primary.hue,
            isDark: genome.chromosomes.ch6_color_temp.isDark,
            radius: genome.chromosomes.ch7_edge.radius,
            motion: genome.chromosomes.ch8_motion.physics,
            displayFont: genome.chromosomes.ch3_type_display.family,
            bodyFont: genome.chromosomes.ch4_type_body.family,
        }, null, 2)};
<\/script>
`;
        return {
            format: "vue",
            content,
            fileExtension: "vue",
            dependencies: ["vue"]
        };
    }
    /**
     * Generate Svelte component library
     */
    generateSvelteLibrary(genome, tier) {
        const components = tier?.components.list || [];
        const componentFiles = components.map(spec => {
            return this.generateSvelteComponent(spec, genome);
        }).join("\n\n");
        const content = `<!-- Generated by Permutations MCP -->
<!-- DNA Hash: ${genome.dnaHash} -->

${componentFiles}

<!-- Stores -->
<script context="module">
  import { writable } from 'svelte/store';
  
  export const genomeConfig = writable(${JSON.stringify({
            primaryHue: genome.chromosomes.ch5_color_primary.hue,
            isDark: genome.chromosomes.ch6_color_temp.isDark,
            radius: genome.chromosomes.ch7_edge.radius,
            motion: genome.chromosomes.ch8_motion.physics,
        }, null, 2)});
<\/script>
`;
        return {
            format: "svelte",
            content,
            fileExtension: "svelte",
            dependencies: ["svelte"]
        };
    }
    generateVueComponent(spec, genome) {
        const edgeRadius = genome.chromosomes.ch7_edge.radius;
        const primary = genome.chromosomes.ch5_color_primary;
        return `<!-- ${spec.name}.vue -->
<template>
  <div
    class="${spec.name.toLowerCase()}"
    :class="variantClass"
    role="${spec.accessibility.role}"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
${spec.props.map(p => `  ${p.name}: ${this.vuePropType(p)},`).join("\n")}
});

const variantClass = computed(() => props.variant || 'default');
<\/script>

<style scoped>
.${spec.name.toLowerCase()} {
  border-radius: ${edgeRadius}px;
  /* Primary: hsl(${primary.hue}, ${Math.round(primary.saturation * 100)}%, ${Math.round(primary.lightness * 100)}%) */
}
</style>`;
    }
    generateSvelteComponent(spec, genome) {
        const edgeRadius = genome.chromosomes.ch7_edge.radius;
        const primary = genome.chromosomes.ch5_color_primary;
        const props = spec.props.map(p => {
            const defaultVal = p.default !== undefined ? ` = ${JSON.stringify(p.default)}` : "";
            return `  export let ${p.name}${defaultVal};`;
        }).join("\n");
        return `<!-- ${spec.name}.svelte -->
<script>
${props}
<\/script>

<div
  class="${spec.name.toLowerCase()}"
  class:variant--primary={variant === 'primary'}
  role="${spec.accessibility.role}"
>
  <slot />
</div>

<style>
  .${spec.name.toLowerCase()} {
    border-radius: ${edgeRadius}px;
    /* Primary: hsl(${primary.hue}, ${Math.round(primary.saturation * 100)}%, ${Math.round(primary.lightness * 100)}%) */
  }
</style>`;
    }
    vuePropType(prop) {
        if (prop.type.includes("boolean")) {
            return `{ type: Boolean, default: ${prop.default ?? false} }`;
        }
        if (prop.type.includes("number")) {
            return `{ type: Number, default: ${prop.default ?? 0} }`;
        }
        if (prop.type.includes("string") || prop.type.includes('"')) {
            return `{ type: String, default: ${prop.default ? `"${prop.default}"` : "undefined"} }`;
        }
        return `{ type: Object, default: () => (${prop.default ?? "undefined"}) }`;
    }
}
// Singleton instance
export const formatGenerator = new FormatGenerator();
