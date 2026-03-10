export const FORBIDDEN_PATTERNS = [
    {
        id: "font_inter",
        regex: /font-(inter|Inter)/i,
        severity: "error",
        category: "font",
        suggestion: "Use the DNA-assigned display or body font family",
        reason: "Inter is the default AI slop font"
    },
    {
        id: "font_roboto",
        regex: /font-(roboto|Roboto)/i,
        severity: "error",
        category: "font",
        suggestion: "Use the DNA-assigned font family",
        reason: "Roboto is overused and generic"
    },
    {
        id: "tailwind_gradient",
        regex: /bg-gradient-to-(r|l|t|b|tr|tl|br|bl)/i,
        severity: "warning",
        category: "color",
        suggestion: "Use solid colors from DNA palette or fx-atmosphere",
        reason: "Tailwind gradients are overused"
    },
    {
        id: "blue_purple_gradient",
        regex: /from-blue-\d+.*to-purple-\d+|from-indigo-\d+.*to-purple-\d+/i,
        severity: "error",
        category: "color",
        suggestion: "Use DNA primary color with proper temperature",
        reason: "Blue-purple gradient is ultimate AI slop"
    },
    {
        id: "excessive_rounding",
        regex: /rounded-(xl|2xl|3xl|full)\s+/i,
        severity: "error",
        category: "layout",
        suggestion: "Use rounded-genome (9px) or brutalist 0px based on DNA",
        reason: "Excessive rounding creates generic SaaS aesthetic"
    },
    {
        id: "hero_section",
        regex: /<section[^>]*className=["'][^"']*hero/i,
        severity: "warning",
        category: "layout",
        suggestion: "Use DNA topology structure (flat/deep/graph/radial)",
        reason: "Hero sections are template patterns"
    },
    {
        id: "three_column_pricing",
        regex: /grid-cols-3.*pricing|pricing.*grid-cols-3/i,
        severity: "error",
        category: "layout",
        suggestion: "Use DNA grid logic (masonry/broken/radial)",
        reason: "3-column pricing is the most overused pattern"
    },
    {
        id: "testimonial_carousel",
        regex: /testimonial.*carousel|carousel.*testimonial/i,
        severity: "error",
        category: "component",
        suggestion: "Use static DNA biomarker or organic SVG patterns",
        reason: "Testimonial carousels are conversion anti-patterns"
    },
    {
        id: "parallax_scroll",
        regex: /parallax|scroll-triggered/i,
        severity: "error",
        category: "motion",
        suggestion: "Use DNA physics: spring/step/glitch/none",
        reason: "Parallax creates motion sickness"
    },
    {
        id: "heavy_shadow",
        regex: /shadow-(lg|xl|2xl)\s+/i,
        severity: "warning",
        category: "layout",
        suggestion: "Use 1px borders or subtle DNA shadows",
        reason: "Heavy shadows create depth confusion"
    },
    {
        id: "backdrop_blur",
        regex: /backdrop-blur|backdrop_blur/i,
        severity: "warning",
        category: "color",
        suggestion: "Use solid DNA surface colors",
        reason: "Glassmorphism is overused"
    },
    {
        id: "button_gradient",
        regex: /btn.*gradient|button.*gradient/i,
        severity: "error",
        category: "component",
        suggestion: "Use DNA dna-btn class with solid primary color",
        reason: "Gradient buttons are 2019 aesthetics"
    }
];
export class PatternDetector {
    detect(css, html) {
        const violations = [];
        const source = html ? `${css}\n${html}` : css;
        for (const pattern of FORBIDDEN_PATTERNS) {
            // IMPORTANT: regex.exec() with non-global regex never advances lastIndex
            // → infinite loop → OOM. Force global flag so matchAll() terminates.
            const flags = pattern.regex.flags.includes('g')
                ? pattern.regex.flags
                : pattern.regex.flags + 'g';
            const globalRegex = new RegExp(pattern.regex.source, flags);
            for (const match of source.matchAll(globalRegex)) {
                const lineIndex = source.substring(0, match.index).split('\n').length - 1;
                violations.push({
                    type: pattern.category === "layout" || pattern.category === "component"
                        ? "structural"
                        : "visual",
                    pattern: pattern.id,
                    severity: pattern.severity,
                    line: lineIndex + 1,
                    suggestion: pattern.suggestion
                });
            }
        }
        return violations;
    }
    detectInGenome(genome, css, html) {
        const violations = this.detect(css, html);
        const enforced = [];
        if (genome?.constraints?.forbiddenPatterns) {
            genome.constraints.forbiddenPatterns.forEach((pattern) => {
                const regex = new RegExp(pattern, 'i');
                if (regex.test(css) || (html && regex.test(html))) {
                    enforced.push({
                        type: "semantic",
                        pattern: `dna_forbidden_${pattern}`,
                        severity: "error",
                        suggestion: `Remove ${pattern} - forbidden by DNA constraints`,
                    });
                }
            });
        }
        return [...violations, ...enforced];
    }
    generateReport(violations) {
        if (violations.length === 0) {
            return "✅ No slop patterns detected. Design is DNA-compliant.";
        }
        const errors = violations.filter(v => v.severity === "error");
        const warnings = violations.filter(v => v.severity === "warning");
        let report = `❌ Pattern Analysis Failed\n`;
        report += `   Errors: ${errors.length} | Warnings: ${warnings.length}\n\n`;
        if (errors.length > 0) {
            report += `ERRORS (must fix):\n`;
            errors.forEach(v => {
                report += `  [${v.pattern}] Line ${v.line || '?'}: ${v.suggestion}\n`;
            });
            report += `\n`;
        }
        if (warnings.length > 0) {
            report += `WARNINGS:\n`;
            warnings.forEach(v => {
                report += `  [${v.pattern}] Line ${v.line || '?'}: ${v.suggestion}\n`;
            });
        }
        return report;
    }
}
