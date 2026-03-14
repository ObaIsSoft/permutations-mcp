/**
 * Permutations MCP - CSS Generator
 * 
 * Generates CSS with hero type support, trust signals,
 * and sector-aware styling.
 */

import { DesignGenome } from "./genome/types.js";
import * as crypto from "crypto";
import { FXGenerator } from "./generators/fx-generator.js";

export interface CSSGenerationOptions {
    includeReset?: boolean;
    includeVariables?: boolean;
    format?: "compressed" | "expanded";
}

export class CSSGenerator {
    private getHashByte(seed: string, index: number): number {
        const hash = crypto.createHash("sha256").update(seed).digest("hex");
        // Wrap around hash for indices > 31 (SHA-256 produces 32 bytes = 64 hex chars)
        const wrappedIndex = index % 32;
        return parseInt(hash.slice(wrappedIndex * 2, wrappedIndex * 2 + 2), 16) / 255;
    }

    generate(genome: DesignGenome, options: CSSGenerationOptions = {}): string {
        const { includeReset = true, includeVariables = true, format = "expanded" } = options;
        const indent = format === "expanded" ? "  " : "";
        const newline = format === "expanded" ? "\n" : "";
        
        const parts: string[] = [];
        
        if (includeReset) {
            parts.push(this.generateReset(indent, newline));
        }
        
        if (includeVariables) {
            parts.push(this.generateVariables(genome, indent, newline));
        }
        
        parts.push(this.generateBaseStyles(genome, indent, newline));
        parts.push(this.generatePageSectionStyles(genome, indent, newline));
        parts.push(this.generateHeroStyles(genome, indent, newline));
        parts.push(this.generateTrustSignalStyles(genome, indent, newline));
        parts.push(this.generateMotionStyles(genome, indent, newline));
        parts.push(this.generateChoreographyStyles(genome, indent, newline));
        parts.push(this.generateIconographyStyles(genome, indent, newline));
        parts.push(this.generateTextureStyles(genome, indent, newline));
        parts.push(this.generateResponsiveStyles(genome, indent, newline));

        // Merge FX atmosphere CSS — hero gets .fx-atmosphere class when ch13 fx !== 'none'
        const fxGen = new FXGenerator();
        const fxCSS = fxGen.generateCSSClass(genome);
        if (fxCSS) {
            parts.push(fxCSS);
        }

        return parts.join(newline + newline);
    }
    
    private generateReset(indent: string, newline: string): string {
        return `/* Permutations CSS Reset */
*, *::before, *::after {
${indent}box-sizing: border-box;
${indent}margin: 0;
${indent}padding: 0;
}

html {
${indent}scroll-behavior: smooth;
}

body {
${indent}font-family: var(--font-body, system-ui, sans-serif);
${indent}background: var(--color-bg, var(--color-surface));
${indent}color: var(--color-text);
${indent}line-height: 1.6;
}

img, picture, video, canvas, svg {
${indent}display: block;
${indent}max-width: 100%;
}

input, button, textarea, select {
${indent}font: inherit;
}

:focus-visible {
${indent}outline: var(--focus-indicator, 2px solid var(--color-primary));
${indent}outline-offset: 2px;
}`;
    }
    
    private generateVariables(genome: DesignGenome, indent: string, newline: string): string {
        const { chromosomes } = genome;
        const parts: string[] = [];
        
        parts.push(`:root {`);
        
        // Colors
        const primaryHue = Math.round(chromosomes.ch5_color_primary.hue);
        const primarySat = Math.round(chromosomes.ch5_color_primary.saturation * 100);
        const primaryLight = Math.round(chromosomes.ch5_color_primary.lightness * 100);
        const primaryHex = chromosomes.ch5_color_primary.hex;
        
        parts.push(`${indent}/* Colors */`);
        parts.push(`${indent}--color-primary: ${primaryHex};`);
        parts.push(`${indent}--color-primary-h: ${primaryHue};`);
        parts.push(`${indent}--color-primary-s: ${primarySat}%;`);
        parts.push(`${indent}--color-primary-l: ${primaryLight}%;`);
        // HSL component aliases — required for atmosphere effects and alpha variants
        parts.push(`${indent}--primary-hue: ${primaryHue};`);
        parts.push(`${indent}--primary-sat: ${primarySat}%;`);
        parts.push(`${indent}--primary-light: ${primaryLight}%;`);
        parts.push(`${indent}--color-primary-dim: hsla(${primaryHue}, ${primarySat}%, ${primaryLight}%, 0.12);`);
        parts.push(`${indent}--color-primary-glow: hsla(${primaryHue}, ${primarySat}%, ${primaryLight}%, 0.35);`);

        // Generate color variants
        parts.push(`${indent}--color-primary-50: hsl(${primaryHue}, ${primarySat}%, ${Math.max(5, primaryLight + 40)}%);`);
        parts.push(`${indent}--color-primary-100: hsl(${primaryHue}, ${primarySat}%, ${Math.max(10, primaryLight + 30)}%);`);
        parts.push(`${indent}--color-primary-200: hsl(${primaryHue}, ${primarySat}%, ${Math.max(15, primaryLight + 20)}%);`);
        parts.push(`${indent}--color-primary-300: hsl(${primaryHue}, ${primarySat}%, ${Math.max(20, primaryLight + 10)}%);`);
        parts.push(`${indent}--color-primary-400: hsl(${primaryHue}, ${primarySat}%, ${Math.max(30, primaryLight + 5)}%);`);
        parts.push(`${indent}--color-primary-500: ${primaryHex};`);
        parts.push(`${indent}--color-primary-600: hsl(${primaryHue}, ${primarySat}%, ${Math.max(5, primaryLight - 10)}%);`);
        parts.push(`${indent}--color-primary-700: hsl(${primaryHue}, ${primarySat}%, ${Math.max(5, primaryLight - 20)}%);`);
        parts.push(`${indent}--color-primary-800: hsl(${primaryHue}, ${primarySat}%, ${Math.max(5, primaryLight - 30)}%);`);
        parts.push(`${indent}--color-primary-900: hsl(${primaryHue}, ${primarySat}%, ${Math.max(5, primaryLight - 40)}%);`);
        
        // H-5: ch26_color_system — secondary, accent, semantic, and neutral vars
        const colorSystem = chromosomes.ch26_color_system;
        if (colorSystem) {
            // Secondary
            parts.push(`${indent}/* Secondary Color */`);
            parts.push(`${indent}--color-secondary: ${colorSystem.secondary.hex};`);
            parts.push(`${indent}--color-secondary-h: ${Math.round(colorSystem.secondary.hue)};`);
            parts.push(`${indent}--color-secondary-s: ${Math.round(colorSystem.secondary.saturation * 100)}%;`);
            parts.push(`${indent}--color-secondary-l: ${Math.round(colorSystem.secondary.lightness * 100)}%;`);
            parts.push(`${indent}--color-secondary-light: hsl(${Math.round(colorSystem.secondary.hue)}, ${Math.round(colorSystem.secondary.saturation * 100)}%, ${Math.min(95, Math.round(colorSystem.secondary.lightness * 100) + 20)}%);`);
            parts.push(`${indent}--color-secondary-dark: hsl(${Math.round(colorSystem.secondary.hue)}, ${Math.round(colorSystem.secondary.saturation * 100)}%, ${Math.max(5, Math.round(colorSystem.secondary.lightness * 100) - 20)}%);`);
            // Accent
            parts.push(`${indent}/* Accent Color */`);
            parts.push(`${indent}--color-accent: ${colorSystem.accent.hex};`);
            parts.push(`${indent}--color-accent-light: hsl(${Math.round(colorSystem.accent.hue)}, ${Math.round(colorSystem.accent.saturation * 100)}%, ${Math.min(95, Math.round(colorSystem.accent.lightness * 100) + 20)}%);`);
            // Semantic
            parts.push(`${indent}/* Semantic Colors */`);
            parts.push(`${indent}--color-success: ${colorSystem.semantic.success.hex};`);
            parts.push(`${indent}--color-warning: ${colorSystem.semantic.warning.hex};`);
            parts.push(`${indent}--color-error: ${colorSystem.semantic.error.hex};`);
            parts.push(`${indent}--color-info: ${colorSystem.semantic.info.hex};`);
            // Neutral scale
            if (colorSystem.neutral?.scale?.length) {
                parts.push(`${indent}/* Neutral Scale */`);
                colorSystem.neutral.scale.forEach((shade, idx) => {
                    const step = (idx + 1) * 100;
                    parts.push(`${indent}--color-neutral-${step}: ${shade};`);
                });
            }
            // Dark mode surfaces
            if (colorSystem.darkMode?.surfaceStack?.length) {
                parts.push(`${indent}/* Dark Mode */`);
                colorSystem.darkMode.surfaceStack.forEach((surface, idx) => {
                    parts.push(`${indent}--color-dark-surface-${idx}: ${surface};`);
                });
            }
        }
        
        // Surface colors - FROM GENOME surfaceStack
        const surfaceStack = chromosomes.ch6_color_temp.surfaceStack;
        const isDark = chromosomes.ch6_color_temp.isDark;
        
        if (surfaceStack && surfaceStack.length >= 4) {
            // Use genome-derived surface stack
            parts.push(`${indent}--color-surface: ${surfaceStack[0]};`);
            parts.push(`${indent}--color-surface-elevated: ${surfaceStack[1]};`);
            parts.push(`${indent}--color-surface-overlay: ${surfaceStack[2]};`);
            parts.push(`${indent}--color-surface-modal: ${surfaceStack[3]};`);
        }

        // --color-bg: near-black for dark themes, near-white for light — hue-tinted
        if (isDark) {
            parts.push(`${indent}--color-bg: hsl(${primaryHue}, 8%, 4%);`);
        } else {
            parts.push(`${indent}--color-bg: hsl(${primaryHue}, 5%, 98%);`);
        }

        // Text colors - derived from genome hash, not hardcoded
        const hash = crypto.createHash("sha256").update(genome.dnaHash + "text_colors").digest("hex");
        const textDarkness = parseInt(hash.slice(0, 2), 16) / 255;
        
        if (isDark) {
            // Light text for dark backgrounds - hash-derived brightness
            const textLightness = Math.floor(95 + textDarkness * 5); // 95-100%
            parts.push(`${indent}--color-text: hsl(0, 0%, ${textLightness}%);`);
            parts.push(`${indent}--color-text-secondary: hsla(0, 0%, ${textLightness}%, 0.7);`);
            parts.push(`${indent}--color-text-tertiary: hsla(0, 0%, ${textLightness}%, 0.5);`);
        } else {
            // Dark text for light backgrounds
            const textDarknessVal = Math.floor(5 + textDarkness * 10); // 5-15%
            parts.push(`${indent}--color-text: hsl(0, 0%, ${textDarknessVal}%);`);
            parts.push(`${indent}--color-text-secondary: hsla(0, 0%, ${textDarknessVal}%, 0.7);`);
            parts.push(`${indent}--color-text-tertiary: hsla(0, 0%, ${textDarknessVal}%, 0.5);`);
        }
        
        // Typography
        const typography = chromosomes.ch16_typography;
        parts.push(`${indent}/* Typography */`);
        parts.push(`${indent}--font-display: ${chromosomes.ch3_type_display.family};`);
        parts.push(`${indent}--font-body: ${chromosomes.ch4_type_body.family};`);
        parts.push(`${indent}--font-mono: 'SF Mono', Monaco, monospace;`);
        parts.push(`${indent}--text-ratio: ${typography.ratio.toFixed(2)};`);
        parts.push(`${indent}--text-base: ${typography.baseSize}px;`);
        
        // Parse px → number for clamp() construction
        const parsePx = (v: string | number): number => typeof v === "number" ? v : parseFloat(String(v));
        const toRem = (px: number) => (px / 16).toFixed(3).replace(/\.?0+$/, "");
        // clamp(min, preferred_vw, max) — preferred is ~1% per 4px of max size
        const fluidType = (size: string | number): string => {
            const px = parsePx(size);
            const rem = px / 16;
            const minRem = Math.max(0.875, rem * 0.55); // floor at 14px
            const vw = +(rem * 0.9).toFixed(2);        // scale with viewport
            return `clamp(${toRem(minRem * 16)}rem, ${vw}vw + 0.5rem, ${toRem(px)}rem)`;
        };

        parts.push(`${indent}--text-display: ${fluidType(typography.display.size)};`);
        parts.push(`${indent}--text-h1: ${fluidType(typography.h1.size)};`);
        parts.push(`${indent}--text-h2: ${fluidType(typography.h2.size)};`);
        parts.push(`${indent}--text-h3: ${fluidType(typography.h3.size)};`);
        parts.push(`${indent}--text-body: ${fluidType(typography.body.size)};`);
        parts.push(`${indent}--text-small: ${fluidType(typography.small.size)};`);
        
        parts.push(`${indent}--leading-display: ${typography.display.lineHeight};`);
        parts.push(`${indent}--leading-h1: ${typography.h1.lineHeight};`);
        parts.push(`${indent}--leading-h2: ${typography.h2.lineHeight};`);
        parts.push(`${indent}--leading-h3: ${typography.h3.lineHeight};`);
        parts.push(`${indent}--leading-body: ${typography.body.lineHeight};`);
        
        // Spacing
        const rhythm = chromosomes.ch2_rhythm;
        const baseSpacing = rhythm.baseSpacing;
        parts.push(`${indent}/* Spacing */`);
        parts.push(`${indent}--space-xs: ${baseSpacing * 0.25}px;`);
        parts.push(`${indent}--space-sm: ${baseSpacing * 0.5}px;`);
        parts.push(`${indent}--space-md: ${baseSpacing}px;`);
        parts.push(`${indent}--space-lg: ${baseSpacing * 2}px;`);
        parts.push(`${indent}--space-xl: ${baseSpacing * 4}px;`);
        parts.push(`${indent}--space-2xl: ${baseSpacing * 8}px;`);
        
        // Edge radius
        const edgeRadius = chromosomes.ch7_edge.radius;
        parts.push(`${indent}/* Radii */`);
        parts.push(`${indent}--radius-sm: ${Math.max(0, edgeRadius * 0.5)}px;`);
        parts.push(`${indent}--radius-md: ${edgeRadius}px;`);
        parts.push(`${indent}--radius-lg: ${edgeRadius * 2}px;`);
        parts.push(`${indent}--radius-xl: ${edgeRadius * 4}px;`);
        parts.push(`${indent}--radius-full: 9999px;`);
        
        // Motion
        const motion = chromosomes.ch8_motion;
        parts.push(`${indent}/* Motion */`);
        parts.push(`${indent}--duration-fast: ${(0.15 * motion.durationScale).toFixed(2)}s;`);
        parts.push(`${indent}--duration-normal: ${(0.3 * motion.durationScale).toFixed(2)}s;`);
        parts.push(`${indent}--duration-slow: ${(0.6 * motion.durationScale).toFixed(2)}s;`);
        parts.push(`${indent}--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);`);
        parts.push(`${indent}--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);`);
        
        // Focus indicator
        const accessibility = chromosomes.ch17_accessibility;
        parts.push(`${indent}/* Accessibility */`);
        parts.push(`${indent}--focus-indicator: ${accessibility.focusIndicator};`);
        parts.push(`${indent}--touch-target: ${accessibility.minTouchTarget}px;`);
        
        parts.push(`}`);
        
        return parts.join(newline);
    }
    
    private generateBaseStyles(genome: DesignGenome, indent: string, newline: string): string {
        const parts: string[] = [];
        
        // Structure - hash-derived max-width
        const structure = genome.chromosomes.ch1_structure;
        const b = (idx: number) => this.getHashByte(genome.dnaHash, idx);
        // Container max-width: 900-1400px based on nesting preference + hash
        const baseWidth = structure.maxNesting > 2 ? 1100 : 900;
        const maxWidth = baseWidth + Math.floor(b(200) * 300); // 900-1400px range
        
        parts.push(`/* Grid */`);
        parts.push(`.container {
${indent}max-width: ${maxWidth}px;
${indent}margin-inline: auto;
${indent}padding-inline: var(--space-lg);
}`);
        
        // Grid
        const grid = genome.chromosomes.ch9_grid;
        parts.push(`.grid {
${indent}display: grid;
${indent}gap: var(--space-md);
${indent}${grid.columns > 2 ? `grid-template-columns: repeat(${grid.columns}, 1fr);` : 'grid-template-columns: repeat(2, 1fr);'}
}`);
        
        // Typography
        parts.push(`.text-display {
${indent}font-family: var(--font-display);
${indent}font-size: var(--text-display);
${indent}line-height: var(--leading-display);
${indent}font-weight: 700;
}`);
        
        parts.push(`.text-h1 {
${indent}font-family: var(--font-display);
${indent}font-size: var(--text-h1);
${indent}line-height: var(--leading-h1);
${indent}font-weight: 700;
}`);
        
        // Buttons
        const edge = genome.chromosomes.ch7_edge;
        parts.push(`.btn {
${indent}display: inline-flex;
${indent}align-items: center;
${indent}justify-content: center;
${indent}gap: var(--space-xs);
${indent}padding: var(--space-lg) var(--space-xl);
${indent}font-size: var(--text-body);
${indent}font-weight: 500;
${indent}border-radius: ${edge.radius > 0 ? 'var(--radius-md)' : '0'};
${indent}border: none;
${indent}cursor: pointer;
${indent}transition: all var(--duration-fast) var(--ease-smooth);
}`);
        
        // M-10: Contrast-aware text color for btn-primary
        // If primary is very light (lightness > 60%) use dark text; else use white
        const primaryLightness = Math.round(genome.chromosomes.ch5_color_primary.lightness * 100);
        const btnTextColor = primaryLightness > 60 ? 'var(--color-text)' : 'white';
        parts.push(`.btn-primary {
${indent}background: var(--color-primary);
${indent}color: ${btnTextColor};
}`);
        
        // Hash-derived hover lift: 1-4px
        const hoverLift = 1 + Math.floor(this.getHashByte(genome.dnaHash, 230) * 3);
        parts.push(`.btn-primary:hover {
${indent}background: var(--color-primary-600);
${indent}transform: translateY(-${hoverLift}px);
}`);
        
        return parts.join(newline + newline);
    }

    private generatePageSectionStyles(genome: DesignGenome, indent: string, newline: string): string {
        const parts: string[] = [];
        const edge = genome.chromosomes.ch7_edge;

        // ── Navigation ─────────────────────────────────────────────
        parts.push(`/* Navigation */`);
        parts.push(`.header {
${indent}position: sticky;
${indent}top: 0;
${indent}z-index: 100;
${indent}background: var(--color-surface);
${indent}border-bottom: 1px solid var(--color-primary-100);
${indent}padding: var(--space-md) 0;
}`);
        parts.push(`.nav {
${indent}display: flex;
${indent}align-items: center;
${indent}justify-content: space-between;
${indent}gap: var(--space-lg);
}`);
        parts.push(`.logo {
${indent}font-family: var(--font-display);
${indent}font-weight: 700;
${indent}font-size: var(--text-h3);
${indent}color: var(--color-primary);
${indent}text-decoration: none;
}`);
        parts.push(`.nav-links {
${indent}display: flex;
${indent}align-items: center;
${indent}gap: var(--space-lg);
${indent}list-style: none;
}
.nav-links a {
${indent}color: var(--color-text-secondary);
${indent}text-decoration: none;
${indent}font-size: var(--text-body);
${indent}transition: color var(--duration-fast) var(--ease-smooth);
}
.nav-links a:hover {
${indent}color: var(--color-primary);
}`);

        // ── Secondary button ────────────────────────────────────────
        parts.push(`/* Buttons */`);
        parts.push(`.btn-secondary {
${indent}background: transparent;
${indent}color: var(--color-primary);
${indent}border: 2px solid var(--color-primary);
${indent}border-radius: ${edge.radius > 0 ? 'var(--radius-md)' : '0'};
}
.btn-secondary:hover {
${indent}background: var(--color-primary);
${indent}color: white;
}
.btn-large {
${indent}padding: var(--space-lg) var(--space-2xl);
${indent}font-size: var(--text-h3);
}`);

        // ── Hero shared elements ────────────────────────────────────
        parts.push(`/* Hero shared */`);
        parts.push(`.hero-ctas {
${indent}display: flex;
${indent}gap: var(--space-md);
${indent}flex-wrap: wrap;
${indent}margin-top: var(--space-lg);
}`);
        parts.push(`.hero-subtitle,
.hero-tagline,
.hero-excerpt {
${indent}font-size: var(--text-h3);
${indent}color: var(--color-text-secondary);
${indent}line-height: var(--leading-h3);
${indent}margin-top: var(--space-md);
}`);
        parts.push(`.hero-meta {
${indent}display: flex;
${indent}gap: var(--space-md);
${indent}color: var(--color-text-tertiary);
${indent}font-size: var(--text-small);
${indent}margin-top: var(--space-sm);
}`);
        parts.push(`.hero-services-grid {
${indent}display: grid;
${indent}grid-template-columns: repeat(3, 1fr);
${indent}gap: var(--space-lg);
${indent}margin-top: var(--space-xl);
}
.service-card {
${indent}background: var(--color-surface-elevated);
${indent}padding: var(--space-lg);
${indent}border-radius: var(--radius-md);
}`);
        parts.push(`.hero-carousel {
${indent}display: flex;
${indent}gap: var(--space-lg);
${indent}overflow-x: auto;
${indent}scroll-snap-type: x mandatory;
${indent}margin-top: var(--space-lg);
}
.carousel-item {
${indent}flex: 0 0 280px;
${indent}scroll-snap-align: start;
}`);
        parts.push(`.hero-filters {
${indent}display: flex;
${indent}gap: var(--space-sm);
${indent}flex-wrap: wrap;
${indent}margin-top: var(--space-md);
}
.filter-link {
${indent}padding: var(--space-xs) var(--space-md);
${indent}background: var(--color-surface-elevated);
${indent}border-radius: var(--radius-full);
${indent}font-size: var(--text-small);
${indent}text-decoration: none;
${indent}color: var(--color-text-secondary);
}`);
        parts.push(`.play-button {
${indent}display: flex;
${indent}align-items: center;
${indent}gap: var(--space-sm);
${indent}background: transparent;
${indent}border: 2px solid var(--color-primary);
${indent}border-radius: var(--radius-full);
${indent}padding: var(--space-md) var(--space-lg);
${indent}cursor: pointer;
${indent}color: var(--color-primary);
${indent}font-size: var(--text-body);
}`);
        parts.push(`.hero-testimonial-featured {
${indent}max-width: 700px;
${indent}margin: var(--space-xl) auto;
}
.hero-testimonial-featured blockquote {
${indent}font-family: var(--font-display);
${indent}font-size: var(--text-h3);
${indent}font-style: italic;
${indent}color: var(--color-text);
${indent}margin-bottom: var(--space-lg);
}`);
        parts.push(`.configurator-preview {
${indent}display: grid;
${indent}grid-template-columns: 1fr 1fr;
${indent}gap: var(--space-xl);
${indent}margin-top: var(--space-xl);
}
.config-3d-viewer {
${indent}background: var(--color-surface-elevated);
${indent}border-radius: var(--radius-lg);
${indent}aspect-ratio: 1;
${indent}display: flex;
${indent}align-items: center;
${indent}justify-content: center;
}
.config-placeholder {
${indent}color: var(--color-text-secondary);
${indent}font-size: var(--text-small);
}
.config-options {
${indent}display: flex;
${indent}flex-direction: column;
${indent}gap: var(--space-lg);
}
.config-price {
${indent}display: flex;
${indent}align-items: baseline;
${indent}gap: var(--space-sm);
}
.price-label {
${indent}font-size: var(--text-small);
${indent}color: var(--color-text-secondary);
}
.price-value {
${indent}font-family: var(--font-display);
${indent}font-size: var(--text-h2);
${indent}font-weight: 700;
${indent}color: var(--color-primary);
}
.color-options {
${indent}display: flex;
${indent}gap: var(--space-sm);
}
.color-swatch {
${indent}width: 32px;
${indent}height: 32px;
${indent}border-radius: var(--radius-full);
${indent}border: 2px solid transparent;
${indent}cursor: pointer;
}
.color-swatch.active {
${indent}border-color: var(--color-text);
}`);

        // ── Sections shared ─────────────────────────────────────────
        parts.push(`/* Sections */`);
        parts.push(`.section-title {
${indent}font-family: var(--font-display);
${indent}font-size: var(--text-h2);
${indent}line-height: var(--leading-h2);
${indent}font-weight: 700;
${indent}margin-bottom: var(--space-lg);
}
.section-intro {
${indent}font-size: var(--text-body);
${indent}color: var(--color-text-secondary);
${indent}margin-bottom: var(--space-xl);
${indent}max-width: 640px;
}`);

        // ── Trust grid ──────────────────────────────────────────────
        parts.push(`/* Trust grid */`);
        parts.push(`.trust-section {
${indent}padding: var(--space-2xl) 0;
}
.trust-grid {
${indent}display: grid;
${indent}grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
${indent}gap: var(--space-xl);
${indent}text-align: center;
}
.trust-number {
${indent}font-family: var(--font-display);
${indent}font-size: var(--text-h1);
${indent}font-weight: 700;
${indent}color: var(--color-primary);
}
.trust-label {
${indent}font-size: var(--text-small);
${indent}color: var(--color-text-secondary);
${indent}margin-top: var(--space-xs);
}`);

        // ── Social proof ────────────────────────────────────────────
        parts.push(`/* Social proof */`);
        parts.push(`.social-proof {
${indent}padding: var(--space-2xl) 0;
${indent}background: var(--color-surface-elevated);
}
.testimonial-author {
${indent}display: flex;
${indent}align-items: center;
${indent}gap: var(--space-md);
${indent}margin-top: var(--space-md);
}
.author-avatar {
${indent}width: 48px;
${indent}height: 48px;
${indent}border-radius: var(--radius-full);
${indent}object-fit: cover;
}`);

        // ── Features ────────────────────────────────────────────────
        parts.push(`/* Features */`);
        parts.push(`.features {
${indent}padding: var(--space-2xl) 0;
}
.features-grid {
${indent}display: grid;
${indent}grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
${indent}gap: var(--space-lg);
}
.feature-card {
${indent}background: var(--color-surface-elevated);
${indent}padding: var(--space-lg);
${indent}border-radius: var(--radius-md);
${indent}border: 1px solid var(--color-primary-100);
}
.feature-card h3 {
${indent}font-family: var(--font-display);
${indent}font-size: var(--text-h3);
${indent}font-weight: 600;
${indent}margin-bottom: var(--space-sm);
${indent}color: var(--color-text);
}
.feature-card p {
${indent}color: var(--color-text-secondary);
${indent}font-size: var(--text-body);
}`);

        // ── FAQ ─────────────────────────────────────────────────────
        parts.push(`/* FAQ */`);
        parts.push(`.faq {
${indent}padding: var(--space-2xl) 0;
}
.faq-list {
${indent}display: flex;
${indent}flex-direction: column;
${indent}gap: var(--space-md);
}
.faq-item {
${indent}border: 1px solid var(--color-primary-100);
${indent}border-radius: var(--radius-md);
${indent}overflow: hidden;
}
.faq-item summary {
${indent}cursor: pointer;
${indent}padding: var(--space-lg);
${indent}font-weight: 600;
${indent}list-style: none;
${indent}color: var(--color-text);
}
.faq-item summary::-webkit-details-marker { display: none; }
.faq-item p {
${indent}padding: 0 var(--space-lg) var(--space-lg);
${indent}color: var(--color-text-secondary);
}`);

        // ── CTA ─────────────────────────────────────────────────────
        parts.push(`/* CTA */`);
        parts.push(`.cta {
${indent}padding: var(--space-2xl) 0;
${indent}background: var(--color-primary);
${indent}text-align: center;
}
.cta-title {
${indent}font-family: var(--font-display);
${indent}font-size: var(--text-h2);
${indent}font-weight: 700;
${indent}color: white;
${indent}margin-bottom: var(--space-md);
}
.cta-subtitle {
${indent}color: rgba(255,255,255,0.8);
${indent}font-size: var(--text-body);
${indent}margin-bottom: var(--space-xl);
}`);

        // ── Footer ──────────────────────────────────────────────────
        parts.push(`/* Footer */`);
        parts.push(`.footer {
${indent}padding: var(--space-2xl) 0;
${indent}background: var(--color-surface-elevated);
${indent}border-top: 1px solid var(--color-primary-100);
}
.footer-grid {
${indent}display: grid;
${indent}grid-template-columns: 2fr 1fr 1fr;
${indent}gap: var(--space-2xl);
${indent}margin-bottom: var(--space-xl);
}
.footer-brand p {
${indent}color: var(--color-text-secondary);
${indent}margin-top: var(--space-sm);
${indent}font-size: var(--text-small);
}
.footer-links h4 {
${indent}font-weight: 600;
${indent}margin-bottom: var(--space-md);
${indent}color: var(--color-text);
}
.footer-links ul {
${indent}list-style: none;
${indent}display: flex;
${indent}flex-direction: column;
${indent}gap: var(--space-sm);
}
.footer-links a {
${indent}color: var(--color-text-secondary);
${indent}text-decoration: none;
${indent}font-size: var(--text-small);
${indent}transition: color var(--duration-fast) var(--ease-smooth);
}
.footer-links a:hover {
${indent}color: var(--color-primary);
}
.footer-bottom {
${indent}padding-top: var(--space-lg);
${indent}border-top: 1px solid var(--color-primary-100);
${indent}display: flex;
${indent}justify-content: space-between;
${indent}align-items: center;
${indent}font-size: var(--text-small);
${indent}color: var(--color-text-tertiary);
}`);

        // ── Logo wordmark (customer logos) ──────────────────────────
        parts.push(`.logo-wordmark {
${indent}font-family: var(--font-display);
${indent}font-size: var(--text-h3);
${indent}font-weight: 700;
${indent}color: var(--color-text-secondary);
}`);

        return parts.join(newline + newline);
    }

    private generateHeroStyles(genome: DesignGenome, indent: string, newline: string): string {
        const hero = genome.chromosomes.ch19_hero_type;
        const variant = genome.chromosomes.ch19_hero_variant_detail;
        const visual = genome.chromosomes.ch20_visual_treatment;
        const grid = genome.chromosomes.ch9_grid;
        const parts: string[] = [];
        
        parts.push(`/* Hero Section */`);
        parts.push(`.hero {
${indent}position: relative;
${indent}min-height: ${hero.type === 'product_video' || hero.type === 'aspirational_imagery' ? '100vh' : '80vh'};
${indent}display: flex;
${indent}align-items: center;
${indent}overflow: hidden;
}`);
        
        // Layout variant
        const getByte = (idx: number) => this.getHashByte(genome.dnaHash, idx);
        switch (variant.layout) {
            case 'centered':
                // Hash-derived content max-width: 700-900px
                const contentWidth = 700 + Math.floor(getByte(201) * 200);
                parts.push(`.hero-content {
${indent}width: 100%;
${indent}max-width: ${contentWidth}px;
${indent}margin-inline: auto;
${indent}text-align: center;
${indent}padding: var(--space-xl);
}`);
                break;
                
            case 'split_left':
                parts.push(`.hero {
${indent}display: grid;
${indent}grid-template-columns: 1fr 1fr;
${indent}align-items: center;
}
.hero-content {
${indent}padding: var(--space-xl);
}
.hero-visual {
${indent}height: 100%;
${indent}min-height: 400px;
}
@media (max-width: 768px) {
${indent}.hero {
${indent}${indent}grid-template-columns: 1fr;
${indent}${indent}grid-template-rows: auto auto;
${indent}}
${indent}.hero-visual {
${indent}${indent}order: -1;
${indent}${indent}min-height: 250px;
${indent}}
}`);
                break;
                
            case 'split_right':
                parts.push(`.hero {
${indent}display: grid;
${indent}grid-template-columns: 1fr 1fr;
${indent}align-items: center;
}
.hero-visual {
${indent}height: 100%;
${indent}min-height: 400px;
}
.hero-content {
${indent}padding: var(--space-xl);
}
@media (max-width: 768px) {
${indent}.hero {
${indent}${indent}grid-template-columns: 1fr;
${indent}}
${indent}.hero-visual {
${indent}${indent}min-height: 250px;
${indent}}
}`);
                break;
                
            case 'full_bleed':
                // Hash-derived gradient opacity: 0.5-0.8
                const gradientAlpha = 0.5 + (this.getHashByte(genome.dnaHash, 237) * 0.3);
                const gradientColor = genome.chromosomes.ch6_color_temp.isDark 
                    ? `rgba(0,0,0,${gradientAlpha.toFixed(2)})`
                    : `rgba(255,255,255,${gradientAlpha.toFixed(2)})`;
                parts.push(`.hero-content {
${indent}position: absolute;
${indent}inset: 0;
${indent}display: flex;
${indent}flex-direction: column;
${indent}justify-content: center;
${indent}padding: var(--space-xl);
${indent}background: ${visual.hasVideo ? 'transparent' : `linear-gradient(to right, ${gradientColor}, transparent)`};
${indent}color: ${visual.hasVideo ? 'inherit' : 'white'};
}`);
                break;
                
            case 'floating_cards':
                // Hash-derived: 500-700px
                const floatingWidth = 500 + Math.floor(getByte(202) * 200);
                parts.push(`.hero-content {
${indent}max-width: ${floatingWidth}px;
${indent}padding: var(--space-xl);
}${indent}.hero-cards {
${indent}position: absolute;
${indent}right: var(--space-xl);
${indent}top: 50%;
${indent}transform: translateY(-50%);
${indent}display: flex;
${indent}gap: var(--space-md);
}`);
                break;
                
            case 'asymmetric':
                parts.push(`.hero-asymmetric {
${indent}display: grid;
${indent}grid-template-columns: ${Math.round(100/(grid.columns+1))}fr ${Math.round(100*grid.columns/(grid.columns+1))}fr;
${indent}gap: var(--space-xl);
${indent}padding: var(--space-xl);
}`);
                break;
                
            case 'minimal':
                parts.push(`.hero-minimal {
${indent}padding: var(--space-xl);
${indent}text-align: center;
}`);
                break;
        }
        
        // Hero type specific styles
        switch (hero.type) {
            case 'trust_authority':
                parts.push(`.hero-trust-badges {
${indent}display: flex;
${indent}gap: var(--space-md);
${indent}margin-top: var(--space-lg);
}${indent}.hero-trust-badge {
${indent}display: flex;
${indent}align-items: center;
${indent}gap: var(--space-xs);
${indent}font-size: var(--text-small);
${indent}color: var(--color-text-secondary);
}`);
                break;
                
            case 'stats_counter':
                parts.push(`.hero-stats {
${indent}display: grid;
${indent}grid-template-columns: repeat(${Math.min(grid.columns, 3)}, 1fr);
${indent}gap: var(--space-lg);
${indent}margin-top: var(--space-xl);
}${indent}.hero-stat-number {
${indent}font-family: var(--font-display);
${indent}font-size: var(--text-h1);
${indent}font-weight: 700;
${indent}color: var(--color-primary);
}${indent}.hero-stat-label {
${indent}font-size: var(--text-small);
${indent}color: var(--color-text-secondary);
}`);
                break;
                
            case 'search_discovery':
                // Hash-derived search width: 500-700px
                const searchWidth = 500 + Math.floor(getByte(203) * 200);
                parts.push(`.hero-search {
${indent}width: 100%;
${indent}max-width: ${searchWidth}px;
${indent}margin-top: var(--space-lg);
}${indent}.hero-search-input {
${indent}width: 100%;
${indent}padding: var(--space-md) var(--space-lg);
${indent}font-size: var(--text-body);
${indent}border: 2px solid var(--color-primary-200);
${indent}border-radius: var(--radius-full);
${indent}background: var(--color-surface-elevated);
}${indent}.hero-search-input:focus {
${indent}outline: none;
${indent}border-color: var(--color-primary);
}`);
                break;
                
            case 'product_ui':
                // Hash-derived shadow: y-offset 20-40px, blur 40-60px
                const shadowY = 20 + Math.floor(this.getHashByte(genome.dnaHash, 234) * 20);
                const shadowBlur = 40 + Math.floor(this.getHashByte(genome.dnaHash, 235) * 20);
                const shadowAlpha = 0.15 + (this.getHashByte(genome.dnaHash, 236) * 0.15);
                parts.push(`.hero-screenshot {
${indent}border-radius: var(--radius-lg);
${indent}box-shadow: 0 ${shadowY}px ${shadowBlur}px -12px rgba(0, 0, 0, ${shadowAlpha.toFixed(2)});
${indent}overflow: hidden;
}`);
                break;
        }
        
        // Video background
        if (visual.hasVideo) {
            parts.push(`.hero-video {
${indent}position: absolute;
${indent}inset: 0;
${indent}width: 100%;
${indent}height: 100%;
${indent}object-fit: cover;
${indent}z-index: -1;
}`);
        }
        
        return parts.join(newline + newline);
    }
    
    private generateTrustSignalStyles(genome: DesignGenome, indent: string, newline: string): string {
        const trust = genome.chromosomes.ch21_trust_signals;
        const social = genome.chromosomes.ch22_social_proof;
        const grid = genome.chromosomes.ch9_grid;
        const parts: string[] = [];
        
        parts.push(`/* Trust Signals */`);
        
        // Trust signal prominence
        switch (trust.prominence) {
            case 'hero_feature':
                parts.push(`.trust-feature {
${indent}background: var(--color-surface-elevated);
${indent}padding: var(--space-xl);
${indent}border-radius: var(--radius-lg);
}`);
                break;
                
            case 'prominent':
                parts.push(`.trust-section {
${indent}padding: var(--space-2xl) var(--space-xl);
${indent}background: var(--color-surface-elevated);
}`);
                break;
                
            case 'subtle':
                parts.push(`.trust-footer {
${indent}padding: var(--space-md) var(--space-xl);
${indent}border-top: 1px solid var(--color-primary-100);
}`);
                break;
        }
        
        // Social proof type
        switch (social.type) {
            case 'testimonials_grid':
                parts.push(`.testimonials-grid {
${indent}display: grid;
${indent}grid-template-columns: repeat(auto-fit, minmax(${Math.max(250, Math.round(960 / grid.columns))}px, 1fr));
${indent}gap: var(--space-lg);
}`);
                parts.push(`.testimonial-card {
${indent}background: var(--color-surface);
${indent}padding: var(--space-lg);
${indent}border-radius: var(--radius-md);
${indent}border: 1px solid var(--color-primary-100);
}`);
                break;
                
            case 'customer_logos':
                parts.push(`.logos-row {
${indent}display: flex;
${indent}align-items: center;
${indent}justify-content: center;
${indent}gap: var(--space-2xl);
${indent}flex-wrap: wrap;
}${indent}.logo-item {
${indent}opacity: 0.6;
${indent}filter: grayscale(100%);
${indent}transition: all var(--duration-fast) var(--ease-smooth);
}${indent}.logo-item:hover {
${indent}opacity: 1;
${indent}filter: grayscale(0%);
}`);
                break;
                
            case 'rating_stars':
                // Hash-derived star color (warm accent) - not hardcoded #f59e0b
                const starHash = crypto.createHash("sha256").update(genome.dnaHash + "star_color").digest("hex");
                const starHue = Math.floor(30 + (parseInt(starHash.slice(0, 2), 16) / 255) * 30); // 30-60 (orange-gold)
                const starSat = Math.floor(70 + (parseInt(starHash.slice(2, 4), 16) / 255) * 20); // 70-90%
                const starLight = Math.floor(50 + (parseInt(starHash.slice(4, 6), 16) / 255) * 10); // 50-60%
                parts.push(`.rating-display {
${indent}display: flex;
${indent}align-items: center;
${indent}gap: var(--space-sm);
}${indent}.rating-stars {
${indent}color: hsl(${starHue}, ${starSat}%, ${starLight}%);
${indent}font-size: var(--text-h3);
}${indent}.rating-text {
${indent}font-size: var(--text-small);
${indent}color: var(--color-text-secondary);
}`);
                break;
        }
        
        // Credentials for authority-focused
        if (trust.approach === 'credentials' || trust.approach === 'security_badges') {
            parts.push(`.credentials-list {
${indent}display: flex;
${indent}flex-wrap: wrap;
${indent}gap: var(--space-md);
}${indent}.credential-badge {
${indent}display: inline-flex;
${indent}align-items: center;
${indent}gap: var(--space-xs);
${indent}padding: var(--space-xs) var(--space-sm);
${indent}background: var(--color-primary-100);
${indent}border-radius: var(--radius-sm);
${indent}font-size: var(--text-small);
}`);
        }
        
        return parts.join(newline + newline);
    }
    
    private generateMotionStyles(genome: DesignGenome, indent: string, newline: string): string {
        const motion = genome.chromosomes.ch8_motion;
        const rendering = genome.chromosomes.ch18_rendering;
        const parts: string[] = [];
        
        if (!rendering.animate) {
            return '';
        }
        
        parts.push(`/* Motion & Animation */`);
        
        // Hash-derived animation values
        const fadeDistance = 10 + Math.floor(this.getHashByte(genome.dnaHash, 231) * 20); // 10-30px
        const scaleStart = 0.92 + (this.getHashByte(genome.dnaHash, 232) * 0.06); // 0.92-0.98
        const liftAmount = 2 + Math.floor(this.getHashByte(genome.dnaHash, 233) * 4); // 2-6px
        
        // Entry animations
        parts.push(`@keyframes fadeInUp {
${indent}from {
${indent}${indent}opacity: 0;
${indent}${indent}transform: translateY(${fadeDistance}px);
${indent}}
${indent}to {
${indent}${indent}opacity: 1;
${indent}${indent}transform: translateY(0);
${indent}}
}`);
        
        parts.push(`@keyframes scaleIn {
${indent}from {
${indent}${indent}opacity: 0;
${indent}${indent}transform: scale(${scaleStart.toFixed(2)});
${indent}}
${indent}to {
${indent}${indent}opacity: 1;
${indent}${indent}transform: scale(1);
${indent}}
}`);
        
        // Physics-based spring
        if (motion.physics === 'spring') {
            parts.push(`@keyframes bounceIn {
${indent}0% {
${indent}${indent}opacity: 0;
${indent}${indent}transform: scale(0.3);
${indent}}
${indent}50% {
${indent}${indent}transform: scale(1.05);
${indent}}
${indent}70% {
${indent}${indent}transform: scale(0.9);
${indent}}
${indent}100% {
${indent}${indent}opacity: 1;
${indent}${indent}transform: scale(1);
${indent}}
}`);
        }
        
        // Apply animations
        parts.push(`.animate-fade-in {
${indent}animation: fadeInUp var(--duration-normal) var(--ease-smooth) forwards;
}`);
        
        parts.push(`.animate-scale-in {
${indent}animation: scaleIn var(--duration-normal) var(--ease-smooth) forwards;
}`);
        
        // Hover effects
        parts.push(`.hover-lift {
${indent}transition: transform var(--duration-fast) var(--ease-smooth);
}${indent}.hover-lift:hover {
${indent}transform: translateY(-${liftAmount}px);
}`);
        
        // Scroll-triggered animations (if supported)
        if (rendering.animate) {
            parts.push(`@media (prefers-reduced-motion: no-preference) {
${indent}.reveal {
${indent}${indent}opacity: 0;
${indent}${indent}transform: translateY(${fadeDistance}px);
${indent}${indent}transition: opacity var(--duration-slow) var(--ease-smooth),
${indent}${indent}${indent}${indent}${indent}transform var(--duration-slow) var(--ease-smooth);
${indent}}
${indent}.reveal.visible {
${indent}${indent}opacity: 1;
${indent}${indent}transform: translateY(0);
${indent}}
}`);
        }
        
        return parts.join(newline + newline);
    }
    
    private generateChoreographyStyles(genome: DesignGenome, indent: string, newline: string): string {
        const choreography = genome.chromosomes.ch27_motion_choreography;
        const rendering = genome.chromosomes.ch18_rendering;
        const parts: string[] = [];

        if (!rendering.animate) return '';

        parts.push(`/* Motion Choreography - ch27 */`);

        const easingMap: Record<string, string> = {
            elegant:   'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            energetic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            smooth:    'cubic-bezier(0.4, 0, 0.2, 1)',
            snappy:    'cubic-bezier(0.77, 0, 0.175, 1)',
            dramatic:  'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        };
        const easing = easingMap[choreography.choreographyStyle] ?? 'cubic-bezier(0.4, 0, 0.2, 1)';
        const staggerMs = choreography.staggerInterval;

        parts.push(`:root {
${indent}--stagger-interval: ${staggerMs}ms;
${indent}--easing-choreography: ${easing};
}`);

        // Stagger delays for up to 8 child elements
        const staggerLines = Array.from({ length: 8 }, (_, i) =>
            `.stagger-child:nth-child(${i + 1}) { transition-delay: ${staggerMs * i}ms; animation-delay: ${staggerMs * i}ms; }`
        ).join('\n');
        parts.push(`/* Stagger delays */\n${staggerLines}`);

        // Entry sequence
        switch (choreography.entrySequence) {
            case 'hero_first':
                parts.push(`.hero { --entry-order: 0; }\n.hero ~ * { --entry-order: 1; }`);
                break;
            case 'cascade_down':
                parts.push(`[data-reveal] { transform-origin: top center; }`);
                break;
            case 'cascade_up':
                parts.push(`[data-reveal] { transform-origin: bottom center; }`);
                break;
            case 'stagger_center':
                parts.push(`[data-reveal] { transform-origin: center center; }`);
                break;
            case 'simultaneous':
                parts.push(`.stagger-child { transition-delay: 0ms !important; animation-delay: 0ms !important; }`);
                break;
        }

        // Hover microinteraction
        const micro = choreography.hoverMicrointeraction;
        switch (micro.type) {
            case 'scale': {
                const scaleVal = (1 + micro.intensity * 0.1).toFixed(3);
                parts.push(`.micro-hover { transition: transform ${micro.duration}ms ${easing}; }\n.micro-hover:hover { transform: scale(${scaleVal}); }`);
                break;
            }
            case 'color_shift':
                parts.push(`.micro-hover { transition: color ${micro.duration}ms ${easing}, background-color ${micro.duration}ms ${easing}; }\n.micro-hover:hover { color: var(--color-primary); }`);
                break;
            case 'shadow': {
                const spread = Math.round(micro.intensity * 20);
                parts.push(`.micro-hover { transition: box-shadow ${micro.duration}ms ${easing}; }\n.micro-hover:hover { box-shadow: 0 ${spread}px ${spread * 2}px rgba(0,0,0,${(micro.intensity * 0.3).toFixed(2)}); }`);
                break;
            }
            case 'lift': {
                const liftPx = Math.round(micro.intensity * 8);
                parts.push(`.micro-hover { transition: transform ${micro.duration}ms ${easing}, box-shadow ${micro.duration}ms ${easing}; }\n.micro-hover:hover { transform: translateY(-${liftPx}px); box-shadow: 0 ${liftPx * 2}px ${liftPx * 3}px rgba(0,0,0,0.15); }`);
                break;
            }
            case 'glow':
                parts.push(`.micro-hover { transition: box-shadow ${micro.duration}ms ${easing}; }\n.micro-hover:hover { box-shadow: 0 0 ${Math.round(micro.intensity * 30)}px var(--color-primary); }`);
                break;
        }

        // Page transition
        switch (choreography.pageTransition) {
            case 'fade':
                parts.push(`@keyframes page-enter { from { opacity: 0; } to { opacity: 1; } }\n.page-transition { animation: page-enter 0.3s ${easing}; }`);
                break;
            case 'slide':
                parts.push(`@keyframes page-enter { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }\n.page-transition { animation: page-enter 0.3s ${easing}; }`);
                break;
            case 'morph':
                parts.push(`@keyframes page-enter { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }\n.page-transition { animation: page-enter 0.4s ${easing}; }`);
                break;
            case 'wipe':
                parts.push(`@keyframes page-enter { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0% 0 0); } }\n.page-transition { animation: page-enter 0.5s ${easing}; }`);
                break;
            case 'dissolve':
                parts.push(`@keyframes page-enter { from { opacity: 0; filter: blur(8px); } to { opacity: 1; filter: blur(0); } }\n.page-transition { animation: page-enter 0.4s ${easing}; }`);
                break;
        }

        return parts.filter(Boolean).join(newline + newline);
    }

    private generateIconographyStyles(genome: DesignGenome, indent: string, newline: string): string {
        const icon = genome.chromosomes.ch28_iconography;
        const parts: string[] = [];

        parts.push(`/* Iconography - ch28 */`);

        const strokeWeightMap: Record<string, number> = { thin: 1, regular: 1.5, bold: 2.5, variable: 2 };
        const strokePx = strokeWeightMap[icon.strokeWeight] ?? 1.5;

        const colorTreatmentMap: Record<string, string> = {
            inherit:   'currentColor',
            primary:   'var(--color-primary)',
            secondary: 'var(--color-secondary)',
            muted:     'var(--color-text-secondary)',
        };
        const iconColor = colorTreatmentMap[icon.colorTreatment] ?? 'currentColor';

        const cornerMap: Record<string, string> = { sharp: '0', rounded: 'var(--radius-sm)', pill: 'var(--radius-full)' };
        const iconRadius = cornerMap[icon.cornerTreatment] ?? '0';

        parts.push(`:root {
${indent}--icon-size: ${icon.sizeScale.toFixed(2)}em;
${indent}--icon-stroke: ${strokePx}px;
${indent}--icon-color: ${iconColor};
${indent}--icon-radius: ${iconRadius};
}`);

        parts.push(`.icon {
${indent}width: var(--icon-size);
${indent}height: var(--icon-size);
${indent}stroke: var(--icon-color);
${indent}stroke-width: var(--icon-stroke);
${indent}fill: ${icon.style === 'filled' ? 'var(--icon-color)' : 'none'};
${indent}color: var(--icon-color);
${indent}flex-shrink: 0;
}`);

        if (icon.animation !== 'none') {
            const animMap: Record<string, string> = {
                bounce: `@keyframes icon-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }\n.icon-animate { animation: icon-bounce 1s ease-in-out infinite; }`,
                pulse:  `@keyframes icon-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }\n.icon-animate { animation: icon-pulse 2s ease-in-out infinite; }`,
                spin:   `@keyframes icon-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }\n.icon-animate { animation: icon-spin 1s linear infinite; }`,
                draw:   `@keyframes icon-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }\n.icon-animate { animation: icon-draw 0.8s ease forwards; stroke-dasharray: 1; stroke-dashoffset: 1; }`,
            };
            if (animMap[icon.animation]) {
                parts.push(animMap[icon.animation]);
            }
        }

        return parts.join(newline + newline);
    }

    private generateTextureStyles(genome: DesignGenome, indent: string, newline: string): string {
        const texture = genome.chromosomes.ch11_texture;
        const parts: string[] = [];

        if (texture.surface === 'flat') return '';

        parts.push(`/* Texture - ch11 */`);

        switch (texture.surface) {
            case 'grain': {
                const opacity = (texture.noiseLevel * 0.8).toFixed(2);
                const blendMode = texture.overlayBlend === 'none' ? 'normal' : texture.overlayBlend;
                const freq = (0.65 + texture.grainFrequency * 0.35).toFixed(2);
                const svgNoise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;
                parts.push(`.grain-overlay::after {
${indent}content: '';
${indent}position: fixed;
${indent}inset: 0;
${indent}background-image: ${svgNoise};
${indent}background-repeat: repeat;
${indent}opacity: ${opacity};
${indent}mix-blend-mode: ${blendMode};
${indent}pointer-events: none;
${indent}z-index: 9999;
}`);
                if (texture.animatedTexture) {
                    parts.push(`@keyframes grain-shift {
${indent}0%, 100% { transform: translate(0, 0); }
${indent}25%  { transform: translate(-2%, 1%); }
${indent}50%  { transform: translate(1%, -2%); }
${indent}75%  { transform: translate(-1%, 2%); }
}
.grain-overlay::after { animation: grain-shift 8s steps(1) infinite; }`);
                }
                break;
            }
            case 'glass': {
                const blur = Math.round(8 + texture.noiseLevel * 24);
                const bgOpacity = (0.1 + (1 - texture.noiseLevel) * 0.2).toFixed(2);
                parts.push(`.glass-surface {
${indent}background: rgba(255, 255, 255, ${bgOpacity});
${indent}backdrop-filter: blur(${blur}px) saturate(180%);
${indent}-webkit-backdrop-filter: blur(${blur}px) saturate(180%);
${indent}border: 1px solid rgba(255, 255, 255, 0.2);
}`);
                break;
            }
            case 'chrome': {
                const angle = Math.round(120 + texture.grainFrequency * 60);
                parts.push(`.chrome-surface {
${indent}background: linear-gradient(
${indent}${indent}${angle}deg,
${indent}${indent}hsl(0, 0%, 20%) 0%,
${indent}${indent}hsl(0, 0%, 70%) 30%,
${indent}${indent}hsl(0, 0%, 95%) 50%,
${indent}${indent}hsl(0, 0%, 60%) 70%,
${indent}${indent}hsl(0, 0%, 25%) 100%
${indent});
${indent}background-size: 200% 200%;
}
.chrome-surface:hover {
${indent}background-position: 100% 100%;
${indent}transition: background-position 0.5s ease;
}`);
                break;
            }
        }

        return parts.filter(Boolean).join(newline + newline);
    }

    private generateResponsiveStyles(genome: DesignGenome, indent: string, newline: string): string {
        const parts: string[] = [];
        const b = (idx: number) => this.getHashByte(genome.dnaHash + "responsive", idx);
        
        // Hash-derived breakpoints
        const mobileBreakpoint = 700 + Math.floor(b(210) * 100);  // 700-800px
        const tabletBreakpoint = 1000 + Math.floor(b(211) * 200); // 1000-1200px
        const desktopBreakpoint = 1300 + Math.floor(b(212) * 200); // 1300-1500px
        const largeMaxWidth = 1200 + Math.floor(b(213) * 200);    // 1200-1400px
        
        parts.push(`/* Responsive */`);
        
        // Mobile adjustments
        parts.push(`@media (max-width: ${mobileBreakpoint}px) {
${indent}.hero {
${indent}${indent}min-height: auto;
${indent}${indent}padding: var(--space-xl) 0;
${indent}}
${indent}.hero-content {
${indent}${indent}width: 100% !important;
${indent}${indent}margin-left: 0 !important;
${indent}${indent}text-align: center;
${indent}}
${indent}.hero-visual {
${indent}${indent}position: relative;
${indent}${indent}width: 100%;
${indent}${indent}height: ${Math.floor(250 + b(214) * 150)}px;
${indent}${indent}margin-top: var(--space-lg);
${indent}}
${indent}.grid,
${indent}.features-grid,
${indent}.trust-grid,
${indent}.hero-services-grid,
${indent}.footer-grid {
${indent}${indent}grid-template-columns: 1fr;
${indent}}
${indent}.hero-stats {
${indent}${indent}grid-template-columns: 1fr;
${indent}${indent}gap: var(--space-md);
${indent}}
${indent}.testimonials-grid {
${indent}${indent}grid-template-columns: 1fr;
${indent}}
${indent}.nav-links {
${indent}${indent}display: none;
${indent}}
${indent}.hero-ctas {
${indent}${indent}justify-content: center;
${indent}}
}`);
        
        // Tablet
        parts.push(`@media (min-width: ${mobileBreakpoint + 1}px) and (max-width: ${tabletBreakpoint}px) {
${indent}.grid {
${indent}${indent}grid-template-columns: repeat(2, 1fr);
${indent}}
${indent}.hero-content {
${indent}${indent}width: 60%;
${indent}}
}`);
        
        // Large screens
        parts.push(`@media (min-width: ${desktopBreakpoint}px) {
${indent}.container {
${indent}${indent}max-width: ${largeMaxWidth}px;
${indent}}
}`);
        
        return parts.join(newline + newline);
    }
}
