import { DesignGenome, ContentTraits } from "./types.js";

export interface Constraint {
    id: string;
    target: string; // Path to genome property (e.g., "chromosomes.ch8_motion.physics")
    value: any;
    priority: number; // 1-10, higher = more important
    source: string; // Which trait/archetype triggered this
    reason: string; // Human-readable explanation
}

export interface Conflict {
    constraint1: Constraint;
    constraint2: Constraint;
    property: string;
    resolution?: Constraint;
    explanation: string;
}

export interface SolverResult {
    genome: DesignGenome;
    appliedConstraints: Constraint[];
    conflicts: Conflict[];
    resolutions: string[];
    rationale: string[]; // Explanations for each decision
}

/**
 * Constraint Satisfaction Solver for Design Genome
 * 
 * Replaces procedural if/else with proper conflict detection and resolution.
 * When constraints conflict, finds compromise based on priority and trait importance.
 */
export class GenomeConstraintSolver {
    private constraints: Constraint[] = [];
    private conflicts: Conflict[] = [];
    private rationale: string[] = [];

    solve(genome: DesignGenome): SolverResult {
        this.constraints = [];
        this.conflicts = [];
        this.rationale = [];

        // Step 1: Collect all constraints from traits
        this.collectConstraints(genome);

        // Step 2: Detect conflicts
        this.detectConflicts();

        // Step 3: Resolve conflicts
        this.resolveConflicts(genome);

        // Step 4: Apply non-conflicting constraints
        this.applyConstraints(genome);

        return {
            genome,
            appliedConstraints: this.constraints,
            conflicts: this.conflicts,
            resolutions: this.rationale,
            rationale: this.rationale
        };
    }

    private collectConstraints(genome: DesignGenome): void {
        const traits = genome.traits;

        // ACCESSIBILITY ENFORCEMENT: WCAG Requirements
        this.collectAccessibilityConstraints(genome);

        // Constraint: High temporal urgency → No animations
        if (traits.temporalUrgency > 0.8) {
            this.addConstraint({
                id: "urgency_no_motion",
                target: "chromosomes.ch8_motion.physics",
                value: "none",
                priority: 9,
                source: `temporalUrgency: ${traits.temporalUrgency.toFixed(2)}`,
                reason: "High temporal urgency (>0.8) requires instant state changes for scanning"
            });

            this.addConstraint({
                id: "urgency_high_contrast",
                target: "constraints.requiredPatterns",
                value: "high_contrast_text",
                priority: 8,
                source: `temporalUrgency: ${traits.temporalUrgency.toFixed(2)}`,
                reason: "High-frequency scanning requires maximum legibility"
            });

            this.addConstraint({
                id: "urgency_no_blur",
                target: "constraints.forbiddenPatterns",
                value: "backdrop_blur",
                priority: 7,
                source: `temporalUrgency: ${traits.temporalUrgency.toFixed(2)}`,
                reason: "Blur effects reduce scanning speed"
            });
        }

        // Constraint: High information density → Compact layout
        if (traits.informationDensity > 0.8) {
            this.addConstraint({
                id: "density_compact",
                target: "chromosomes.ch2_rhythm.density",
                value: "airtight",
                priority: 8,
                source: `informationDensity: ${traits.informationDensity.toFixed(2)}`,
                reason: "High information density requires compact spacing"
            });

            this.addConstraint({
                id: "density_no_hero",
                target: "constraints.forbiddenPatterns",
                value: "hero_section",
                priority: 7,
                source: `informationDensity: ${traits.informationDensity.toFixed(2)}`,
                reason: "Hero sections waste space in data-dense interfaces"
            });

            this.addConstraint({
                id: "density_flat",
                target: "chromosomes.ch1_structure.topology",
                value: "flat",
                priority: 7,
                source: `informationDensity: ${traits.informationDensity.toFixed(2)}`,
                reason: "Flat topology maximizes scanability for dense data"
            });
        }

        // Constraint: Low playfulness → Brutalist edges
        if (traits.playfulness < 0.2) {
            this.addConstraint({
                id: "serious_sharp_edges",
                target: "chromosomes.ch7_edge.radius",
                value: 0,
                priority: 8,
                source: `playfulness: ${traits.playfulness.toFixed(2)}`,
                reason: "Low playfulness requires brutalist 0px radius"
            });

            this.addConstraint({
                id: "serious_no_animations",
                target: "chromosomes.ch8_motion.physics",
                value: "none",
                priority: 7,
                source: `playfulness: ${traits.playfulness.toFixed(2)}`,
                reason: "Serious interfaces should not distract with motion"
            });
        }

        // Constraint: High playfulness → Spring physics
        if (traits.playfulness > 0.7) {
            this.addConstraint({
                id: "playful_spring",
                target: "chromosomes.ch8_motion.physics",
                value: "spring",
                priority: 7,
                source: `playfulness: ${traits.playfulness.toFixed(2)}`,
                reason: "High playfulness benefits from organic spring physics"
            });

            this.addConstraint({
                id: "playful_organic_edges",
                target: "chromosomes.ch7_edge.style",
                value: "organic",
                priority: 6,
                source: `playfulness: ${traits.playfulness.toFixed(2)}`,
                reason: "Organic edges feel more approachable and human"
            });
        }

        // Constraint: High emotional temperature → Warm colors
        if (traits.emotionalTemperature > 0.7) {
            this.addConstraint({
                id: "warm_humanist_font",
                target: "chromosomes.ch3_type_display.charge",
                value: "humanist",
                priority: 6,
                source: `emotionalTemperature: ${traits.emotionalTemperature.toFixed(2)}`,
                reason: "Warm emotional tone requires humanist typography"
            });
        }

        // Constraint: Low emotional temperature → Geometric/cold
        if (traits.emotionalTemperature < 0.3) {
            this.addConstraint({
                id: "cold_geometric",
                target: "chromosomes.ch3_type_display.charge",
                value: "geometric",
                priority: 6,
                source: `emotionalTemperature: ${traits.emotionalTemperature.toFixed(2)}`,
                reason: "Cold emotional tone requires geometric precision"
            });

            this.addConstraint({
                id: "cold_metallic",
                target: "chromosomes.ch14_physics.material",
                value: "metallic",
                priority: 5,
                source: `emotionalTemperature: ${traits.emotionalTemperature.toFixed(2)}`,
                reason: "Metallic material conveys clinical precision"
            });
        }

        // Constraint: Dashboard archetype → Monospace + No motion
        if (traits.informationDensity > 0.7 && traits.temporalUrgency > 0.6) {
            this.addConstraint({
                id: "dashboard_monospace",
                target: "chromosomes.ch3_type_display.charge",
                value: "monospace",
                priority: 9,
                source: `archetype_detection: dashboard`,
                reason: "Dashboards require monospace for tabular data alignment"
            });
        }
    }

    /**
     * Collect WCAG accessibility constraints based on genome traits.
     * These are non-negotiable requirements for inclusive design.
     */
    private collectAccessibilityConstraints(genome: DesignGenome): void {
        const traits = genome.traits;
        const a11y = genome.chromosomes.ch17_accessibility;

        // WCAG 1.4.3 Contrast - Enforce minimum contrast ratio
        this.addConstraint({
            id: "wcag_contrast_minimum",
            target: "chromosomes.ch6_color_temp.contrastRatio",
            value: Math.max(genome.chromosomes.ch6_color_temp.contrastRatio, a11y.minContrastRatio),
            priority: 10, // Highest priority - accessibility is non-negotiable
            source: `WCAG 1.4.3, informationDensity: ${traits.informationDensity.toFixed(2)}`,
            reason: `Minimum contrast ratio ${a11y.minContrastRatio}:1 required for ${traits.informationDensity > 0.7 ? 'WCAG AAA' : 'WCAG AA'}`
        });

        // WCAG 2.3.3 Animation from Interactions - Respect motion preferences
        if (a11y.respectMotionPreference) {
            this.addConstraint({
                id: "wcag_reduced_motion",
                target: "chromosomes.ch8_motion.physics",
                value: "none",
                priority: 10,
                source: `WCAG 2.3.3, respectMotionPreference: ${a11y.respectMotionPreference}`,
                reason: "Respect prefers-reduced-motion for users with vestibular disorders"
            });

            this.rationale.push("[Accessibility] Motion physics disabled per WCAG 2.3.3 (reduced motion preference)");
        }

        // WCAG 2.5.5 Target Size - Minimum touch target size
        if (traits.temporalUrgency > 0.6) {
            this.addConstraint({
                id: "wcag_target_size",
                target: "chromosomes.ch17_accessibility.minTouchTarget",
                value: Math.max(a11y.minTouchTarget, 44),
                priority: 9,
                source: `WCAG 2.5.5, temporalUrgency: ${traits.temporalUrgency.toFixed(2)}`,
                reason: `Minimum ${Math.max(a11y.minTouchTarget, 44)}px touch targets for urgent interactions`
            });
        }

        // WCAG 1.4.12 Text Spacing - Ensure readable line heights
        const minLineHeight = traits.informationDensity > 0.8 ? 1.2 : 1.5;
        this.addConstraint({
            id: "wcag_text_spacing",
            target: "chromosomes.ch16_typography.body.lineHeight",
            value: Math.max(parseFloat(genome.chromosomes.ch16_typography.body.lineHeight), minLineHeight).toFixed(2),
            priority: 8,
            source: `WCAG 1.4.12, informationDensity: ${traits.informationDensity.toFixed(2)}`,
            reason: `Line height ${minLineHeight} minimum for readability`
        });

        // WCAG 2.4.7 Focus Visible - Prominent focus indicators
        if (traits.temporalUrgency > 0.7) {
            this.addConstraint({
                id: "wcag_focus_visible",
                target: "chromosomes.ch17_accessibility.focusIndicator",
                value: "ring",
                priority: 8,
                source: `WCAG 2.4.7, temporalUrgency: ${traits.temporalUrgency.toFixed(2)}`,
                reason: "High-contrast focus ring for fast keyboard navigation"
            });
        }

        // Screen reader optimization for data-dense interfaces
        if (a11y.screenReaderOptimized) {
            this.rationale.push("[Accessibility] Screen reader landmarks enabled per WCAG 1.3.1 (info and relationships)");
            this.rationale.push("[Accessibility] ARIA labels required for data tables and complex components");
        }

        // Record accessibility profile in rationale
        this.rationale.push(`[Accessibility Profile] Contrast: ${a11y.minContrastRatio}:1, Motion: ${a11y.respectMotionPreference ? 'reduced' : 'full'}, Touch: ${a11y.minTouchTarget}px`);
    }

    /**
     * Generate comprehensive design rationale report explaining
     * why each design decision was made.
     */
    generateRationaleReport(genome: DesignGenome, result: SolverResult): string {
        const lines: string[] = [];
        
        lines.push("# Design Genome Rationale Report");
        lines.push(`DNA Hash: ${genome.dnaHash}`);
        lines.push(`Viability Score: ${genome.viabilityScore.toFixed(2)}`);
        lines.push("");

        // Content traits analysis
        lines.push("## Content Trait Analysis");
        lines.push(`- Information Density: ${genome.traits.informationDensity.toFixed(2)} ${this.describeDensity(genome.traits.informationDensity)}`);
        lines.push(`- Temporal Urgency: ${genome.traits.temporalUrgency.toFixed(2)} ${this.describeUrgency(genome.traits.temporalUrgency)}`);
        lines.push(`- Emotional Temperature: ${genome.traits.emotionalTemperature.toFixed(2)} ${this.describeTemperature(genome.traits.emotionalTemperature)}`);
        lines.push(`- Playfulness: ${genome.traits.playfulness.toFixed(2)} ${this.describePlayfulness(genome.traits.playfulness)}`);
        lines.push(`- Spatial Dependency: ${genome.traits.spatialDependency.toFixed(2)} ${this.describeSpatial(genome.traits.spatialDependency)}`);
        lines.push("");

        // Typography rationale
        const type = genome.chromosomes.ch16_typography;
        lines.push("## Typography Scale (DNA-Generated)");
        lines.push(`Base size: ${type.baseSize}px | Scale ratio: ${type.ratio}`);
        lines.push(`Display: ${type.display.size} / ${type.display.lineHeight} line-height`);
        lines.push(`Body: ${type.body.size} / ${type.body.lineHeight} line-height`);
        lines.push(`Rationale: ${this.getTypographyRationale(genome.traits)}`);
        lines.push("");

        // Accessibility rationale
        const a11y = genome.chromosomes.ch17_accessibility;
        lines.push("## Accessibility Requirements (WCAG)");
        lines.push(`- Minimum contrast: ${a11y.minContrastRatio}:1`);
        lines.push(`- Respect motion preference: ${a11y.respectMotionPreference}`);
        lines.push(`- Minimum touch target: ${a11y.minTouchTarget}px`);
        lines.push(`- Focus indicator: ${a11y.focusIndicator}`);
        lines.push(`- Screen reader optimized: ${a11y.screenReaderOptimized}`);
        lines.push("");

        // Constraint decisions
        lines.push("## Constraint Resolution Decisions");
        if (result.rationale.length === 0) {
            lines.push("No conflicts detected - all constraints compatible.");
        } else {
            result.rationale.forEach(r => lines.push(`- ${r}`));
        }
        lines.push("");

        // Forbidden/required patterns
        lines.push("## Pattern Constraints");
        lines.push("Forbidden:");
        genome.constraints.forbiddenPatterns.forEach(p => lines.push(`  - ${p}`));
        lines.push("Required:");
        genome.constraints.requiredPatterns.forEach(p => lines.push(`  + ${p}`));

        return lines.join("\n");
    }

    private describeDensity(v: number): string {
        if (v > 0.8) return "(maximal - dashboard/data interface)";
        if (v > 0.5) return "(moderate - content site)";
        return "(sparse - editorial/portfolio)";
    }

    private describeUrgency(v: number): string {
        if (v > 0.8) return "(realtime - trading/dashboard)";
        if (v > 0.5) return "(active - app interface)";
        return "(archival - reading/exploration)";
    }

    private describeTemperature(v: number): string {
        if (v > 0.7) return "(warm/humanist)";
        if (v > 0.4) return "(neutral)";
        return "(clinical/geometric)";
    }

    private describePlayfulness(v: number): string {
        if (v > 0.7) return "(organic/whimsical)";
        if (v > 0.3) return "(balanced)";
        return "(brutalist/strict)";
    }

    private describeSpatial(v: number): string {
        if (v > 0.6) return "(immersive 3D)";
        if (v > 0.3) return "(layered 2.5D)";
        return "(flat 2D)";
    }

    private getTypographyRationale(traits: ContentTraits): string {
        const parts: string[] = [];
        if (traits.informationDensity > 0.8) parts.push("compact for density");
        if (traits.temporalUrgency < 0.4) parts.push("generous for reading");
        if (traits.emotionalTemperature > 0.7) parts.push("dramatic scale ratio");
        return parts.join(", ") || "balanced defaults";
    }

    private addConstraint(constraint: Constraint): void {
        this.constraints.push(constraint);
    }

    private detectConflicts(): void {
        // Group constraints by target property
        const byTarget = new Map<string, Constraint[]>();
        
        for (const constraint of this.constraints) {
            const existing = byTarget.get(constraint.target) || [];
            existing.push(constraint);
            byTarget.set(constraint.target, existing);
        }

        // Check each target for conflicting values
        for (const [target, constraints] of byTarget) {
            if (constraints.length < 2) continue;

            // Find pairs with different values
            for (let i = 0; i < constraints.length; i++) {
                for (let j = i + 1; j < constraints.length; j++) {
                    const c1 = constraints[i];
                    const c2 = constraints[j];

                    if (!this.valuesEqual(c1.value, c2.value)) {
                        this.conflicts.push({
                            constraint1: c1,
                            constraint2: c2,
                            property: target,
                            explanation: `${c1.id} (priority ${c1.priority}) vs ${c2.id} (priority ${c2.priority})`
                        });
                    }
                }
            }
        }
    }

    private valuesEqual(v1: any, v2: any): boolean {
        if (Array.isArray(v1) && Array.isArray(v2)) {
            return v1.length === v2.length && v1.every((v, i) => v === v2[i]);
        }
        return v1 === v2;
    }

    private resolveConflicts(genome: DesignGenome): void {
        for (const conflict of this.conflicts) {
            const winner = conflict.constraint1.priority >= conflict.constraint2.priority 
                ? conflict.constraint1 
                : conflict.constraint2;
            const loser = conflict.constraint1.priority >= conflict.constraint2.priority 
                ? conflict.constraint2 
                : conflict.constraint1;

            // Mark loser as overridden
            loser.priority = -1; // Negative priority means overridden

            // Record resolution
            const resolution = `[${winner.id}] wins over [${loser.id}] for ${conflict.property}: ${winner.reason}`;
            this.rationale.push(resolution);

            // Special case: Find compromise for certain conflicts
            const compromise = this.findCompromise(conflict, winner, loser);
            if (compromise) {
                this.applyCompromise(genome, conflict.property, compromise);
            }
        }
    }

    private findCompromise(
        conflict: Conflict, 
        winner: Constraint, 
        loser: Constraint
    ): any | null {
        // Motion physics conflict: If one wants "none" and other wants "spring"
        // Compromise: "step" (discrete but not animated)
        if (conflict.property.includes("physics")) {
            if ((winner.value === "none" && loser.value === "spring") ||
                (winner.value === "spring" && loser.value === "none")) {
                return "step"; // Compromise
            }
        }

        // Edge radius conflict: If one wants 0 and other wants large
        // Compromise: Small but non-zero (2-4px)
        if (conflict.property.includes("radius")) {
            if ((winner.value === 0 && typeof loser.value === "number" && loser.value > 8) ||
                (typeof winner.value === "number" && winner.value > 8 && loser.value === 0)) {
                return 4; // Compromise: subtle rounding
            }
        }

        return null;
    }

    private applyCompromise(genome: DesignGenome, property: string, value: any): void {
        this.setProperty(genome, property, value);
        this.rationale.push(`  → Applied compromise value: ${value}`);
    }

    private applyConstraints(genome: DesignGenome): void {
        // Ensure constraints object and arrays exist
        if (!genome.constraints) {
            genome.constraints = { forbiddenPatterns: [], requiredPatterns: [], bondingRules: [] };
        }
        if (!Array.isArray(genome.constraints.forbiddenPatterns)) genome.constraints.forbiddenPatterns = [];
        if (!Array.isArray(genome.constraints.requiredPatterns)) genome.constraints.requiredPatterns = [];
        if (!Array.isArray(genome.constraints.bondingRules)) genome.constraints.bondingRules = [];

        for (const constraint of this.constraints) {
            if (constraint.priority < 0) continue; // Skip overridden constraints

            // Handle array-type targets (pattern constraints) specially
            if (constraint.target === "constraints.forbiddenPatterns") {
                genome.constraints.forbiddenPatterns.push(constraint.value);
            } else if (constraint.target === "constraints.requiredPatterns") {
                genome.constraints.requiredPatterns.push(constraint.value);
            } else {
                // Regular property setting for chromosome mutations
                this.setProperty(genome, constraint.target, constraint.value);
            }

            // Add bonding rule with full explanation
            genome.constraints.bondingRules.push(
                `[${constraint.id}] ${constraint.source} → ${constraint.reason}`
            );
        }
    }

    private setProperty(obj: any, path: string, value: any): void {
        const parts = path.split(".");
        let current = obj;
        
        for (let i = 0; i < parts.length - 1; i++) {
            current = current[parts[i]];
        }
        
        current[parts[parts.length - 1]] = value;
    }

    /**
     * Generate detailed explanation of why design choices were made
     */
    generateRationale(result: SolverResult): string[] {
        const explanations: string[] = [];

        // Explain each conflict resolution
        for (const conflict of result.conflicts) {
            explanations.push(`CONFLICT: ${conflict.explanation}`);
            
            const winner = conflict.constraint1.priority >= conflict.constraint2.priority 
                ? conflict.constraint1 
                : conflict.constraint2;
            
            explanations.push(`  → Resolution: ${winner.reason}`);
            explanations.push(`  → Applied: ${winner.target} = ${winner.value}`);
        }

        // Explain non-conflicting constraints
        for (const constraint of result.appliedConstraints) {
            if (constraint.priority < 0) continue; // Skip overridden
            
            explanations.push(`${constraint.id}: ${constraint.reason}`);
        }

        return explanations;
    }
}
