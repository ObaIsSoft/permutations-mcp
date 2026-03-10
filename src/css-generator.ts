/**
 * Permutations MCP - CSS Generator
 * 
 * Generates CSS with hero type support, trust signals,
 * and sector-aware styling.
 */

import { DesignGenome } from "./genome/types.js";

export interface CSSGenerationOptions {
    includeReset?: boolean;
    includeVariables?: boolean;
    format?: "compressed" | "expanded";
}

export class CSSGenerator {
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
        parts.push(this.generateHeroStyles(genome, indent, newline));
        parts.push(this.generateTrustSignalStyles(genome, indent, newline));
        parts.push(this.generateMotionStyles(genome, indent, newline));
        parts.push(this.generateResponsiveStyles(genome, indent, newline));
        
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
    
    private generateVariables(genome: DesignGenome, indent: string, newline: string): string {
        const { chromosomes } = genome;
        const parts: string[] = [];
        
        parts.push(`:root {`);
        
        // Colors
        const primaryHue = Math.round(chromosomes.ch5_color_primary.hue);
        const primarySat = Math.round(chromosomes.ch5_color_primary.saturation * 100);
        const primaryLight = Math.round(chromosomes.ch5_color_primary.lightness * 100);
        const primaryHex = chromosomes.ch5_color_primary.hex;
        
        parts.push(`${indent}/* Color System */`);
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
        
        // Surface colors
        const temp = chromosomes.ch6_color_temp.backgroundTemp;
        if (temp === "cool") {
            parts.push(`${indent}--color-surface: #0a0a0a;`);
            parts.push(`${indent}--color-surface-elevated: #141414;`);
            parts.push(`${indent}--color-surface-hover: #1e1e1e;`);
            parts.push(`${indent}--color-text: #ffffff;`);
            parts.push(`${indent}--color-text-secondary: rgba(255, 255, 255, 0.7);`);
            parts.push(`${indent}--color-text-tertiary: rgba(255, 255, 255, 0.5);`);
        } else {
            parts.push(`${indent}--color-surface: #ffffff;`);
            parts.push(`${indent}--color-surface-elevated: #f8f8f8;`);
            parts.push(`${indent}--color-surface-hover: #f0f0f0;`);
            parts.push(`${indent}--color-text: #0a0a0a;`);
            parts.push(`${indent}--color-text-secondary: rgba(0, 0, 0, 0.7);`);
            parts.push(`${indent}--color-text-tertiary: rgba(0, 0, 0, 0.5);`);
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
    
    private generateBaseStyles(genome: DesignGenome, indent: string, newline: string): string {
        const parts: string[] = [];
        
        // Structure
        const structure = genome.chromosomes.ch1_structure;
        parts.push(`/* Layout */`);
        parts.push(`.container {
${indent}max-width: ${structure.maxNesting > 2 ? '1200px' : '900px'};
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
        
        parts.push(`.btn-primary {
${indent}background: var(--color-primary);
${indent}color: white;
}`);
        
        parts.push(`.btn-primary:hover {
${indent}background: var(--color-primary-600);
${indent}transform: translateY(-2px);
}`);
        
        return parts.join(newline + newline);
    }
    
    private generateHeroStyles(genome: DesignGenome, indent: string, newline: string): string {
        const hero = genome.chromosomes.ch19_hero_type;
        const variant = genome.chromosomes.ch19_hero_variant_detail;
        const visual = genome.chromosomes.ch20_visual_treatment;
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
        switch (variant.layout) {
            case 'centered':
                parts.push(`.hero-content {
${indent}width: 100%;
${indent}max-width: 800px;
${indent}margin-inline: auto;
${indent}text-align: center;
${indent}padding: var(--space-xl);
}`);
                break;
                
            case 'split_left':
                parts.push(`.hero-content {
${indent}width: 50%;
${indent}padding: var(--space-xl);
}${indent}.hero-visual {
${indent}position: absolute;
${indent}right: 0;
${indent}top: 0;
${indent}width: 50%;
${indent}height: 100%;
}`);
                break;
                
            case 'split_right':
                parts.push(`.hero-content {
${indent}width: 50%;
${indent}margin-left: 50%;
${indent}padding: var(--space-xl);
}${indent}.hero-visual {
${indent}position: absolute;
${indent}left: 0;
${indent}top: 0;
${indent}width: 50%;
${indent}height: 100%;
}`);
                break;
                
            case 'full_bleed':
                parts.push(`.hero-content {
${indent}position: absolute;
${indent}inset: 0;
${indent}display: flex;
${indent}flex-direction: column;
${indent}justify-content: center;
${indent}padding: var(--space-xl);
${indent}background: ${visual.hasVideo ? 'transparent' : 'linear-gradient(to right, rgba(0,0,0,0.7), transparent)'};
${indent}color: ${visual.hasVideo ? 'inherit' : 'white'};
}`);
                break;
                
            case 'floating_cards':
                parts.push(`.hero-content {
${indent}max-width: 600px;
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
${indent}grid-template-columns: 1fr 2fr;
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
${indent}grid-template-columns: repeat(3, 1fr);
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
                parts.push(`.hero-search {
${indent}width: 100%;
${indent}max-width: 600px;
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
                parts.push(`.hero-screenshot {
${indent}border-radius: var(--radius-lg);
${indent}box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
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
${indent}grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
                parts.push(`.rating-display {
${indent}display: flex;
${indent}align-items: center;
${indent}gap: var(--space-sm);
}${indent}.rating-stars {
${indent}color: #f59e0b;
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
        
        // Entry animations
        parts.push(`@keyframes fadeInUp {
${indent}from {
${indent}${indent}opacity: 0;
${indent}${indent}transform: translateY(20px);
${indent}}
${indent}to {
${indent}${indent}opacity: 1;
${indent}${indent}transform: translateY(0);
${indent}}
}`);
        
        parts.push(`@keyframes scaleIn {
${indent}from {
${indent}${indent}opacity: 0;
${indent}${indent}transform: scale(0.95);
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
${indent}transform: translateY(-4px);
}`);
        
        // Scroll-triggered animations (if supported)
        if (rendering.animate) {
            parts.push(`@media (prefers-reduced-motion: no-preference) {
${indent}.reveal {
${indent}${indent}opacity: 0;
${indent}${indent}transform: translateY(20px);
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
    
    private generateResponsiveStyles(genome: DesignGenome, indent: string, newline: string): string {
        const parts: string[] = [];
        
        parts.push(`/* Responsive */`);
        
        // Mobile adjustments
        parts.push(`@media (max-width: 768px) {
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
${indent}${indent}height: 300px;
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
        parts.push(`@media (min-width: 769px) and (max-width: 1024px) {
${indent}.grid {
${indent}${indent}grid-template-columns: repeat(2, 1fr);
${indent}}
${indent}.hero-content {
${indent}${indent}width: 60%;
${indent}}
}`);
        
        // Large screens
        parts.push(`@media (min-width: 1400px) {
${indent}.container {
${indent}${indent}max-width: 1320px;
${indent}}
}`);
        
        return parts.join(newline + newline);
    }
}
