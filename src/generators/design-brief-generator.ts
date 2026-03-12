/**
 * Design Brief Generator
 * 
 * Generates human-readable design brief from genome.
 * ALL content derives from genome - prose templates are structural only.
 */

import type { DesignGenome } from "../genome/types.js";

export interface DesignBrief {
    title: string;
    summary: string;
    visualDirection: {
        color: string;
        typography: string;
        motion: string;
        layout: string;
    };
    strategy: {
        trust: string;
        hero: string;
        content: string;
    };
    specifications: {
        chromosomes: number;
        dnaHash: string;
        viabilityScore: number;
    };
    prose: string;
}

export class DesignBriefGenerator {
    generate(genome: DesignGenome): DesignBrief {
        const c = genome.chromosomes;
        
        // Title from genome sectors
        const title = genome.sectorContext.subSector !== `${genome.sectorContext.primary}_general`
            ? `${genome.sectorContext.primary} — ${genome.sectorContext.subSector.replace(`${genome.sectorContext.primary}_`, "")}`
            : `${genome.sectorContext.primary} Design System`;
        
        // Summary from chromosomes
        const summary = `A ${c.ch2_rhythm.density} design system for ${genome.sectorContext.primary} ` +
                       `with ${c.ch29_copy_intelligence?.emotionalRegister || "professional"} tone. ` +
                       `Optimized for ${c.ch17_accessibility.screenReaderOptimized ? "accessibility-first" : "visual impact"} ` +
                       `with ${c.ch8_motion.physics === "none" ? "minimal" : c.ch8_motion.physics} motion.`;
        
        const visualDirection = {
            color: this.describeColor(c),
            typography: this.describeTypography(c),
            motion: this.describeMotion(c),
            layout: this.describeLayout(c)
        };
        
        const strategy = {
            trust: this.describeTrust(c),
            hero: this.describeHero(c),
            content: this.describeContent(c)
        };
        
        const prose = this.generateProse(title, summary, visualDirection, strategy, genome);
        
        return {
            title,
            summary,
            visualDirection,
            strategy,
            specifications: {
                chromosomes: Object.keys(c).length,
                dnaHash: genome.dnaHash.slice(0, 16) + "...",
                viabilityScore: Math.round(genome.viabilityScore * 100) / 100
            },
            prose
        };
    }
    
    private describeColor(c: DesignGenome["chromosomes"]): string {
        const primary = c.ch5_color_primary;
        let desc = `Primary: HSL(${primary.hue}°, ${Math.round(primary.saturation * 100)}%, ${Math.round(primary.lightness * 100)}%) — ${primary.temperature}`;
        
        if (c.ch26_color_system) {
            const cs = c.ch26_color_system;
            desc += `. Secondary: ${cs.secondary.relationship} at HSL(${cs.secondary.hue}°, ...). ` +
                   `Semantic success: HSL(${cs.semantic.success.hue}°, ...)`;
        }
        
        return desc;
    }
    
    private describeTypography(c: DesignGenome["chromosomes"]): string {
        return `${c.ch3_type_display.displayName} display (${c.ch3_type_display.charge}, ${c.ch3_type_display.tracking}). ` +
               `${c.ch4_type_body.displayName} body (${c.ch4_type_body.optimalLineLength} line-length). ` +
               `Scale ratio: ${c.ch16_typography.ratio.toFixed(2)}.`;
    }
    
    private describeMotion(c: DesignGenome["chromosomes"]): string {
        let desc = `${c.ch8_motion.physics} physics, ${c.ch8_motion.durationScale}s duration`;
        
        if (c.ch27_motion_choreography) {
            desc += `, ${c.ch27_motion_choreography.entrySequence} entry`;
        }
        
        return desc;
    }
    
    private describeLayout(c: DesignGenome["chromosomes"]): string {
        return `${c.ch1_structure.topology} topology, ${c.ch9_grid.columns}-column ${c.ch9_grid.logic} grid. ` +
               `${c.ch1_structure.sectionCount} sections.`;
    }
    
    private describeTrust(c: DesignGenome["chromosomes"]): string {
        return `${c.ch21_trust_signals.prominence} prominence, ${c.ch21_trust_signals.approach} approach. ` +
               `Social proof: ${c.ch22_social_proof.type}.`;
    }
    
    private describeHero(c: DesignGenome["chromosomes"]): string {
        return `${c.ch19_hero_type.type} hero, ${c.ch19_hero_variant_detail.layout} layout, ` +
               `${c.ch19_hero_variant_detail.alignment} alignment. Elements: ${c.ch19_hero_variant_detail.elements.join(", ")}.`;
    }
    
    private describeContent(c: DesignGenome["chromosomes"]): string {
        const ci = c.ch29_copy_intelligence;
        return `${c.ch23_content_depth.level} depth (${c.ch23_content_depth.estimatedSections} sections). ` +
               (ci ? `Tone: ${ci.emotionalRegister}. Formality: ${Math.round(ci.formalityLevel * 100)}%.` : "");
    }
    
    private generateProse(
        title: string,
        summary: string,
        visual: DesignBrief["visualDirection"],
        strategy: DesignBrief["strategy"],
        genome: DesignGenome
    ): string {
        const c = genome.chromosomes;
        
        return `# Design Brief — ${title}

## Summary
${summary}

## Visual Direction

**Color Palette**
${visual.color}

**Typography**
${visual.typography}

**Motion Language**
${visual.motion}

**Layout System**
${visual.layout}

## Strategic Decisions

**Trust Architecture**
${strategy.trust}

**Hero Approach**
${strategy.hero}

**Content Strategy**
${strategy.content}

## Technical Specs

- DNA Hash: \`${genome.dnaHash.slice(0, 24)}...\`
- Viability Score: ${Math.round(genome.viabilityScore * 100)}%
- Chromosomes: ${Object.keys(c).length}
- Accessibility: WCAG ${c.ch17_accessibility.minContrastRatio}:1 contrast

## Copy Intelligence

- Industry Terms: ${c.ch29_copy_intelligence?.industryTerminology.slice(0, 5).join(", ") || "N/A"}
- Emotional Register: ${c.ch29_copy_intelligence?.emotionalRegister || "N/A"}
- Formality Level: ${Math.round((c.ch29_copy_intelligence?.formalityLevel || 0.5) * 100)}%

---
Generated by Permutations MCP v0.0.6
`;
    }
}

export const designBriefGenerator = new DesignBriefGenerator();
