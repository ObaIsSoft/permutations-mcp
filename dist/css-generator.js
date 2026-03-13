/**
 * Permutations MCP - CSS Generator
 *
 * Generates CSS with hero type support, trust signals,
 * and sector-aware styling.
 */
import * as crypto from "crypto";
export class CSSGenerator {
    getHashByte(seed, index) {
        const hash = crypto.createHash("sha256").update(seed).digest("hex");
        // Wrap around hash for indices > 31 (SHA-256 produces 32 bytes = 64 hex chars)
        const wrappedIndex = index % 32;
        return parseInt(hash.slice(wrappedIndex * 2, wrappedIndex * 2 + 2), 16) / 255;
    }
    generate(genome, options = {}) {
        const { includeReset = true, includeVariables = true, format = "expanded" } = options;
        const indent = format === "expanded" ? "  " : "";
        const newline = format === "expanded" ? "\n" : "";
        const parts = [];
        if (includeReset) {
            parts.push(this.generateReset(indent, newline));
        }
        if (includeVariables) {
            parts.push(this.generateVariables(genome, indent, newline));
        }
        parts.push(this.generateBaseStyles(genome, indent, newline));
        parts.push(this.generateHeroStyles(genome, indent, newline));
        parts.push(this.generateTrustSignalStyles(genome, indent, newline));
        parts.push(this.generateMotionStyles(genome, indent, newline));
        parts.push(this.generateResponsiveStyles(genome, indent, newline));
        return parts.join(newline + newline);
    }
    generateReset(indent, newline) {
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
${indent}background: var(--color-surface);
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
    generateVariables(genome, indent, newline) {
        const { chromosomes } = genome;
        const parts = [];
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
        // Text colors - derived from genome hash, not hardcoded
        const hash = crypto.createHash("sha256").update(genome.dnaHash + "text_colors").digest("hex");
        const textDarkness = parseInt(hash.slice(0, 2), 16) / 255;
        if (isDark) {
            // Light text for dark backgrounds - hash-derived brightness
            const textLightness = Math.floor(95 + textDarkness * 5); // 95-100%
            parts.push(`${indent}--color-text: hsl(0, 0%, ${textLightness}%);`);
            parts.push(`${indent}--color-text-secondary: hsla(0, 0%, ${textLightness}%, 0.7);`);
            parts.push(`${indent}--color-text-tertiary: hsla(0, 0%, ${textLightness}%, 0.5);`);
        }
        else {
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
        parts.push(`${indent}--text-display: ${typography.display.size};`);
        parts.push(`${indent}--text-h1: ${typography.h1.size};`);
        parts.push(`${indent}--text-h2: ${typography.h2.size};`);
        parts.push(`${indent}--text-h3: ${typography.h3.size};`);
        parts.push(`${indent}--text-body: ${typography.body.size};`);
        parts.push(`${indent}--text-small: ${typography.small.size};`);
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
    generateBaseStyles(genome, indent, newline) {
        const parts = [];
        // Structure - hash-derived max-width
        const structure = genome.chromosomes.ch1_structure;
        const b = (idx) => this.getHashByte(genome.dnaHash, idx);
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
${indent}padding: var(--space-sm) var(--space-md);
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
    generateHeroStyles(genome, indent, newline) {
        const hero = genome.chromosomes.ch19_hero_type;
        const variant = genome.chromosomes.ch19_hero_variant_detail;
        const visual = genome.chromosomes.ch20_visual_treatment;
        const grid = genome.chromosomes.ch9_grid;
        const parts = [];
        parts.push(`/* Hero Section */`);
        parts.push(`.hero {
${indent}position: relative;
${indent}min-height: ${hero.type === 'product_video' || hero.type === 'aspirational_imagery' ? '100vh' : '80vh'};
${indent}display: flex;
${indent}align-items: center;
${indent}overflow: hidden;
}`);
        // Layout variant
        const getByte = (idx) => this.getHashByte(genome.dnaHash, idx);
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
${indent}grid-template-columns: ${Math.round(100 / (grid.columns + 1))}fr ${Math.round(100 * grid.columns / (grid.columns + 1))}fr;
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
    generateTrustSignalStyles(genome, indent, newline) {
        const trust = genome.chromosomes.ch21_trust_signals;
        const social = genome.chromosomes.ch22_social_proof;
        const grid = genome.chromosomes.ch9_grid;
        const parts = [];
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
    generateMotionStyles(genome, indent, newline) {
        const motion = genome.chromosomes.ch8_motion;
        const rendering = genome.chromosomes.ch18_rendering;
        const parts = [];
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
    generateResponsiveStyles(genome, indent, newline) {
        const parts = [];
        const b = (idx) => this.getHashByte(genome.dnaHash + "responsive", idx);
        // Hash-derived breakpoints
        const mobileBreakpoint = 700 + Math.floor(b(210) * 100); // 700-800px
        const tabletBreakpoint = 1000 + Math.floor(b(211) * 200); // 1000-1200px
        const desktopBreakpoint = 1300 + Math.floor(b(212) * 200); // 1300-1500px
        const largeMaxWidth = 1200 + Math.floor(b(213) * 200); // 1200-1400px
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
${indent}.grid {
${indent}${indent}grid-template-columns: 1fr;
${indent}}
${indent}.hero-stats {
${indent}${indent}grid-template-columns: 1fr;
${indent}${indent}gap: var(--space-md);
${indent}}
${indent}.testimonials-grid {
${indent}${indent}grid-template-columns: 1fr;
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
