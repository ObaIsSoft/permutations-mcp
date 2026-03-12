/**
 * Dynamic Component Generator
 *
 * Generates ANY component type from description + genome.
 * No hardcoded component types - structure derived from intent.
 */
import * as crypto from "crypto";
export class DynamicComponentGenerator {
    getHashByte(seed, index) {
        const hash = crypto.createHash("sha256").update(seed).digest("hex");
        return parseInt(hash.slice(index * 2, index * 2 + 2), 16) / 255;
    }
    /**
     * Generate any component from description + genome
     */
    generate(description, genome, seed) {
        const c = genome.chromosomes;
        const componentSeed = seed || genome.dnaHash;
        const b = (idx) => this.getHashByte(componentSeed + description.purpose, idx);
        const derivation = {
            colorSource: `ch5: ${c.ch5_color_primary.hue}°, ch26: ${c.ch26_color_system?.secondary?.relationship || "none"}`,
            typographySource: `ch3: ${c.ch3_type_display.displayName}, ch16 ratio: ${c.ch16_typography.ratio.toFixed(2)}`,
            spacingSource: `ch2: ${c.ch2_rhythm.density} (${c.ch2_rhythm.verticalRhythm}px)`,
            motionSource: `ch8: ${c.ch8_motion.physics}, ch27: ${c.ch27_motion_choreography?.entrySequence || "none"}`
        };
        // Generate structure based on description
        const structure = this.inferStructure(description, c);
        // Generate HTML from structure
        const html = this.generateHTML(description, structure, c, b);
        // Generate CSS from genome
        const css = this.generateCSS(description, structure, c, b);
        // Generate name from purpose + topology
        const name = this.generateName(description, c, b);
        return {
            type: description.purpose,
            name,
            html,
            css,
            accessibility: this.inferAccessibility(description),
            derivation
        };
    }
    /**
     * Infer component structure from description + genome
     */
    inferStructure(desc, c) {
        // Hash-derived structure decisions
        const seed = desc.purpose + c.ch12_signature.uniqueMutation;
        const b = (i) => this.getHashByte(seed, i);
        // Container type from topology
        const containers = ["section", "article", "div", "nav", "aside"];
        const container = containers[Math.floor(b(0) * containers.length)];
        // Element order from genome signature
        const shuffled = [...desc.elements].sort(() => b(1) - 0.5);
        // Nesting from structure chromosome
        const nestingDepth = Math.min(desc.elements.length, Math.floor(b(2) * c.ch1_structure.maxNesting) + 1);
        // Grid from grid chromosome (if layout is grid)
        let gridConfig;
        if (desc.layout === "grid") {
            gridConfig = {
                columns: c.ch9_grid.columns,
                gap: c.ch9_grid.gap
            };
        }
        return { container, elementOrder: shuffled, nestingDepth, gridConfig };
    }
    /**
     * Generate HTML from structure
     */
    generateHTML(desc, structure, c, b) {
        const attrs = this.generateAttributes(desc, c);
        const content = structure.elementOrder.map(el => this.generateElement(el, c, b)).join("\n");
        return `<${structure.container} class="dna-${desc.purpose}"${attrs}>
  <div class="dna-${desc.purpose}__container">
    ${content}
  </div>
</${structure.container}>`;
    }
    /**
     * Generate individual element HTML
     */
    generateElement(elementType, c, b) {
        // Element type → HTML mapping (structural, not content)
        const elementMap = {
            title: () => `<h2 class="dna-title">{{${elementType.toUpperCase()}}}</h2>`,
            heading: () => `<h3 class="dna-heading">{{${elementType.toUpperCase()}}}</h3>`,
            subtitle: () => `<p class="dna-subtitle">{{${elementType.toUpperCase()}}}</p>`,
            price: () => `<div class="dna-price">{{${elementType.toUpperCase()}}}</div>`,
            cta: () => `<button class="dna-cta">{{${elementType.toUpperCase()}}}</button>`,
            cta_primary: () => `<button class="dna-cta dna-cta--primary">{{${elementType.toUpperCase()}}}</button>`,
            cta_secondary: () => `<a href="{{URL}}" class="dna-cta dna-cta--secondary">{{${elementType.toUpperCase()}}}</a>`,
            feature_list: () => `<ul class="dna-feature-list">{{${elementType.toUpperCase()}}}</ul>`,
            visual: () => `<div class="dna-visual">{{${elementType.toUpperCase()}}}</div>`,
            metadata: () => `<div class="dna-metadata">{{${elementType.toUpperCase()}}}</div>`,
            badge: () => `<span class="dna-badge">{{${elementType.toUpperCase()}}}</span>`,
            input: () => `<input type="text" class="dna-input" placeholder="{{PLACEHOLDER}}" />`,
            textarea: () => `<textarea class="dna-textarea" placeholder="{{PLACEHOLDER}}"></textarea>`,
            label: () => `<label class="dna-label">{{${elementType.toUpperCase()}}}</label>`,
            logo: () => `<div class="dna-logo">{{${elementType.toUpperCase()}}}</div>`,
            nav_links: () => `<nav class="dna-nav-links">{{${elementType.toUpperCase()}}}</nav>`,
            stats: () => `<div class="dna-stats">{{${elementType.toUpperCase()}}}</div>`,
            testimonial: () => `<blockquote class="dna-testimonial">{{${elementType.toUpperCase()}}}</blockquote>`,
            author: () => `<div class="dna-author">{{${elementType.toUpperCase()}}}</div>`,
            icon: () => `<span class="dna-icon" aria-hidden="true">{{${elementType.toUpperCase()}}}</span>`,
            card: () => `<article class="dna-card">{{${elementType.toUpperCase()}}}</article>`,
            grid: () => `<div class="dna-grid">{{${elementType.toUpperCase()}}}</div>`,
            container: () => `<div class="dna-container">{{${elementType.toUpperCase()}}}</div>`,
        };
        const generator = elementMap[elementType] || (() => `<div class="dna-${elementType}">{{${elementType.toUpperCase()}}}</div>`);
        return generator();
    }
    /**
     * Generate CSS from genome + description
     */
    generateCSS(desc, structure, c, b) {
        const maxWidth = Math.floor(1000 + b(0) * 400);
        const hoverOffset = Math.floor(b(1) * 8);
        const focusRing = Math.floor(b(2) * 4 + 2);
        let css = `/* ${desc.purpose} - derived from genome ${c.ch12_signature.uniqueMutation} */
.dna-${desc.purpose} {
  --primary: ${c.ch5_color_primary.hex};
  --secondary: ${c.ch26_color_system?.secondary?.hex || c.ch6_color_temp.accentColor};
  --surface: ${c.ch6_color_temp.surfaceColor};
  --elevated: ${c.ch6_color_temp.elevatedSurface};
  --radius: ${c.ch7_edge.componentRadius}px;
  --motion: ${c.ch8_motion.durationScale}s ${c.ch8_motion.physics};
  padding: ${c.ch2_rhythm.sectionSpacing}px ${c.ch2_rhythm.componentSpacing}px;
  background: var(--surface);
}
.dna-${desc.purpose}__container {
  max-width: ${maxWidth}px;
  margin: 0 auto;
  display: ${this.layoutToDisplay(desc.layout)};
  ${this.generateLayoutStyles(desc.layout, structure.gridConfig, c, b)}
}
`;
        // Generate styles for each element type
        const uniqueElements = [...new Set(structure.elementOrder)];
        css += uniqueElements.map(el => this.generateElementStyles(el, c, b, hoverOffset, focusRing)).join("\n");
        // Motion choreography from ch27
        if (c.ch27_motion_choreography) {
            css += this.generateMotionStyles(desc.purpose, c.ch27_motion_choreography, c.ch8_motion.physics, b);
        }
        // Accessibility
        css += `
@media (prefers-reduced-motion: reduce) {
  .dna-${desc.purpose} * {
    animation: none !important;
    transition: none !important;
  }
}`;
        return css;
    }
    generateElementStyles(elementType, c, b, hoverOffset, focusRing) {
        const baseStyles = {
            title: `font-family: ${c.ch3_type_display.family}; font-size: ${c.ch16_typography.h2.size}; font-weight: ${c.ch3_type_display.weight};`,
            heading: `font-family: ${c.ch3_type_display.family}; font-size: ${c.ch16_typography.h3.size};`,
            subtitle: `font-family: ${c.ch4_type_body.family}; font-size: ${c.ch16_typography.body.size}; color: ${c.ch6_color_temp.isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)"};`,
            price: `font-family: ${c.ch3_type_display.family}; font-size: ${Math.floor(32 + b(3) * 24)}px; font-weight: ${c.ch3_type_display.weight}; color: var(--primary);`,
            cta: `padding: ${c.ch2_rhythm.verticalRhythm * 2}px ${c.ch2_rhythm.componentSpacing * 2}px; background: var(--primary); color: white; font-family: ${c.ch4_type_body.family}; font-weight: 600; border: none; border-radius: var(--radius); cursor: pointer;`,
            "cta_primary": `padding: ${c.ch2_rhythm.verticalRhythm * 2}px ${c.ch2_rhythm.componentSpacing * 3}px; background: var(--primary); color: white; font-family: ${c.ch4_type_body.family}; font-weight: 600; border: none; border-radius: var(--radius); cursor: pointer;`,
            "cta_secondary": `padding: ${c.ch2_rhythm.verticalRhythm * 2}px ${c.ch2_rhythm.componentSpacing * 3}px; background: transparent; color: var(--primary); font-family: ${c.ch4_type_body.family}; font-weight: 600; border: 1px solid ${c.ch6_color_temp.isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}; border-radius: var(--radius);`,
            feature_list: `list-style: none; padding: 0; margin: 0;`,
            visual: `border-radius: ${c.ch7_edge.imageRadius}px; overflow: hidden;`,
            metadata: `font-family: ${c.ch4_type_body.family}; font-size: ${c.ch16_typography.small.size}; color: ${c.ch6_color_temp.isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"};`,
            badge: `display: inline-block; padding: ${Math.floor(b(4) * 4 + 2)}px ${Math.floor(b(5) * 8 + 8)}px; background: var(--primary); color: white; font-family: ${c.ch4_type_body.family}; font-size: ${c.ch16_typography.small.size}; font-weight: 600; text-transform: uppercase; letter-spacing: ${(b(6) * 0.1).toFixed(2)}em; border-radius: ${Math.floor(c.ch7_edge.componentRadius / 2)}px;`,
            input: `padding: ${c.ch2_rhythm.verticalRhythm * 1.5}px ${c.ch2_rhythm.componentSpacing}px; font-family: ${c.ch4_type_body.family}; font-size: ${c.ch16_typography.body.size}; border: 1px solid ${c.ch6_color_temp.isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}; border-radius: var(--radius); background: var(--surface);`,
            textarea: `padding: ${c.ch2_rhythm.verticalRhythm * 1.5}px ${c.ch2_rhythm.componentSpacing}px; font-family: ${c.ch4_type_body.family}; font-size: ${c.ch16_typography.body.size}; border: 1px solid ${c.ch6_color_temp.isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}; border-radius: var(--radius); background: var(--surface); resize: vertical;`,
            label: `font-family: ${c.ch3_type_display.family}; font-size: ${c.ch16_typography.small.size}; font-weight: 600;`,
            logo: `font-family: ${c.ch3_type_display.family}; font-weight: ${c.ch3_type_display.weight};`,
            card: `background: var(--elevated); border-radius: var(--radius); border: 1px solid ${c.ch6_color_temp.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};`,
            grid: `display: grid; grid-template-columns: repeat(${c.ch9_grid.columns}, 1fr); gap: ${c.ch9_grid.gap}px;`,
            testimonial: `font-style: italic;`,
            author: `display: flex; align-items: center; gap: ${c.ch2_rhythm.componentSpacing}px;`,
            icon: `width: ${Math.floor(20 + b(7) * 28)}px; height: ${Math.floor(20 + b(7) * 28)}px; color: var(--primary);`,
        };
        const specific = baseStyles[elementType] || "";
        const hover = elementType.includes("cta") || elementType === "card" ? `
.dna-${elementType}:hover {
  transform: translateY(-${hoverOffset}px);
}` : "";
        const focus = elementType === "input" || elementType === "textarea" ? `
.dna-${elementType}:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 ${focusRing}px var(--primary)${Math.floor(20 + b(8) * 40).toString(16).padStart(2, '0')};
}` : "";
        return `.dna-${elementType} { ${specific} }${hover}${focus}`;
    }
    generateMotionStyles(componentName, motion, physics, b) {
        const staggerDelay = motion.staggerInterval;
        return `
/* Motion choreography from ch27 */
.dna-${componentName}__container > * {
  animation: fadeInUp ${motion.entrySequence === "simultaneous" ? "0s" : `${staggerDelay}ms ${physics}`} forwards;
  opacity: 0;
}
${Array.from({ length: 5 }, (_, i) => `
.dna-${componentName}__container > *:nth-child(${i + 1}) {
  animation-delay: ${i * staggerDelay}ms;
}`).join("\n")}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(${Math.floor(b(9) * 20 + 10)}px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.dna-${componentName} [class*="cta"]:hover {
  transition: transform ${motion.hoverMicrointeraction.duration}ms ${physics};
}`;
    }
    layoutToDisplay(layout) {
        switch (layout) {
            case "horizontal": return "flex";
            case "vertical": return "flex";
            case "grid": return "grid";
            case "layered": return "block";
            default: return "block";
        }
    }
    generateLayoutStyles(layout, gridConfig, c, b) {
        switch (layout) {
            case "horizontal":
                return `flex-direction: row; align-items: center; justify-content: space-between; gap: ${c.ch9_grid.gap}px;`;
            case "vertical":
                return `flex-direction: column; gap: ${c.ch2_rhythm.componentSpacing}px;`;
            case "grid":
                if (gridConfig) {
                    return `grid-template-columns: repeat(${gridConfig.columns}, 1fr); gap: ${gridConfig.gap}px;`;
                }
                return `grid-template-columns: repeat(${c.ch9_grid.columns}, 1fr); gap: ${c.ch9_grid.gap}px;`;
            default:
                return "";
        }
    }
    generateAttributes(desc, c) {
        const attrs = [];
        if (desc.purpose === "navigation") {
            attrs.push('role="navigation"');
            attrs.push('aria-label="Main navigation"');
        }
        else if (desc.purpose === "pricing") {
            attrs.push('role="region"');
            attrs.push('aria-label="Pricing plans"');
        }
        else if (desc.complexity === "organism") {
            attrs.push('role="region"');
        }
        return attrs.length > 0 ? " " + attrs.join(" ") : "";
    }
    inferAccessibility(desc) {
        const roles = [];
        const ariaLabels = {};
        if (desc.purpose === "navigation")
            roles.push("navigation");
        if (desc.purpose === "pricing")
            roles.push("region");
        if (desc.elements.includes("testimonial"))
            roles.push("blockquote");
        if (desc.layout === "grid")
            roles.push("grid");
        return { roles, ariaLabels };
    }
    generateName(desc, c, b) {
        // Generate descriptive name from topology
        const prefixes = ["adaptive", "dynamic", "responsive", "semantic", "systematic"];
        const prefix = prefixes[Math.floor(b(10) * prefixes.length)];
        return `${prefix}_${desc.purpose}_${c.ch12_signature.uniqueMutation.slice(0, 4)}`;
    }
}
export const dynamicComponentGenerator = new DynamicComponentGenerator();
