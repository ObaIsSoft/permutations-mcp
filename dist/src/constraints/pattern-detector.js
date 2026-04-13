/** Returns true if the character at matchIndex is inside a CSS block whose opening
 *  @-rule or selector header matches blockHeaderRegex. Walks backwards from matchIndex,
 *  counting braces to find the enclosing block, then tests the 200 chars preceding the '{'. */
function isInsideBlock(source, matchIndex, blockHeaderRegex) {
    let depth = 0;
    for (let i = matchIndex - 1; i >= 0; i--) {
        if (source[i] === '}') {
            depth++;
        }
        else if (source[i] === '{') {
            if (depth === 0) {
                // Found the brace that opens the block containing matchIndex
                const headerStart = Math.max(0, i - 300);
                const header = source.substring(headerStart, i);
                return blockHeaderRegex.test(header);
            }
            depth--;
        }
    }
    return false;
}
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
    },
    // ─── Slop fonts (beyond Inter/Roboto) ────────────────────────────────────
    {
        id: "font_poppins",
        regex: /font-(poppins|Poppins)/i,
        severity: "error",
        category: "font",
        suggestion: "Use the DNA-assigned display font",
        reason: "Poppins is the default Figma template font — universally overused"
    },
    {
        id: "font_open_sans",
        regex: /font-(open.?sans|OpenSans)/i,
        severity: "warning",
        category: "font",
        suggestion: "Use the DNA-assigned body font",
        reason: "Open Sans is a safe-choice fallback, not a design decision"
    },
    {
        id: "font_lato",
        regex: /font-(lato|Lato)/i,
        severity: "warning",
        category: "font",
        suggestion: "Use the DNA-assigned body font",
        reason: "Lato signals default thinking, not intentional design"
    },
    // ─── AI layout slop ──────────────────────────────────────────────────────
    {
        id: "three_col_features",
        regex: /grid-cols-3[^}]*icon|features.*grid-cols-3|grid-cols-3.*features/i,
        severity: "error",
        category: "layout",
        suggestion: "Use DNA grid logic (masonry/broken/radial) for feature sections",
        reason: "Icon + title + desc in a 3-col grid is the most overused landing page pattern"
    },
    {
        id: "trusted_by_logos",
        regex: /trusted.by|logo.?wall|logo.?bar/i,
        severity: "warning",
        category: "component",
        suggestion: "Use DNA social proof approach from ch22_social_proof",
        reason: "Generic logo bars are background noise — users ignore them"
    },
    {
        id: "sticky_nav_blur",
        regex: /sticky.*backdrop-blur|backdrop-blur.*sticky|fixed.*backdrop-blur/i,
        severity: "warning",
        category: "layout",
        suggestion: "Use solid DNA surface-0 color for sticky navigation",
        reason: "Sticky blur nav is now universal SaaS slop"
    },
    {
        id: "ready_to_get_started",
        regex: /ready.to.get.started|ready.to.start|start.for.free.today/i,
        severity: "error",
        category: "component",
        suggestion: "Use the DNA copy_engine ch25 CTA copy",
        reason: "Generic CTA copy — no differentiation, no DNA-derived voice"
    },
    {
        id: "loading_skeleton_generic",
        regex: /animate-pulse.*bg-gray|bg-gray.*animate-pulse/i,
        severity: "warning",
        category: "component",
        suggestion: "Use DNA primary color shimmer: bg-primary/10 animate-pulse",
        reason: "Gray loading skeletons are disconnected from the design system"
    },
    // ─── Dark patterns (deceptive UX — source: deceptive.design taxonomy) ────
    {
        id: "fake_urgency_timer",
        regex: /countdown|timer.*sale|sale.*timer|limited.time.offer|ends.in/i,
        severity: "error",
        category: "dark_pattern",
        suggestion: "Only use countdowns tied to real, verifiable deadlines",
        reason: "Fake urgency timers (deceptive.design: Fake Urgency) erode user trust"
    },
    {
        id: "fake_scarcity",
        regex: /only.*left.in.stock|limited.spots|spots.remaining|\d+.people.viewing/i,
        severity: "error",
        category: "dark_pattern",
        suggestion: "Only show real stock/availability data from your backend",
        reason: "Fake scarcity (deceptive.design: Fake Scarcity) is legally actionable in many jurisdictions"
    },
    {
        id: "preselected_upsell",
        regex: /defaultChecked.*upsell|defaultChecked.*premium|checked.*add.?on/i,
        severity: "error",
        category: "dark_pattern",
        suggestion: "All opt-in checkboxes must default to unchecked",
        reason: "Pre-selected upsells (deceptive.design: Preselection) deceive users into purchases"
    },
    {
        id: "confirmshaming",
        regex: /no.*thanks.*hate|decline.*i.don.t.want|no.*i.prefer.not.to/i,
        severity: "error",
        category: "dark_pattern",
        suggestion: "Use neutral decline text: 'No thanks' or 'Maybe later'",
        reason: "Confirmshaming (deceptive.design) manipulates through guilt"
    },
    {
        id: "hidden_unsubscribe",
        regex: /unsubscribe.*font-size.*[89]px|unsubscribe.*text-xs.*opacity/i,
        severity: "error",
        category: "dark_pattern",
        suggestion: "Unsubscribe/cancel links must be clearly visible, same size as surrounding text",
        reason: "Obstruction (deceptive.design: Hard to Cancel) violates CAN-SPAM and GDPR"
    },
    // ─── Accessibility anti-patterns (WCAG 2.1/2.2) ──────────────────────────
    {
        id: "outline_none_no_replacement",
        regex: /outline:\s*none|outline:\s*0(?!.*focus-visible)/i,
        severity: "error",
        category: "accessibility",
        suggestion: "Replace outline:none with a custom :focus-visible style (WCAG 2.4.11)",
        reason: "Removing focus outlines breaks keyboard navigation for all users"
    },
    {
        id: "autoplay_media",
        regex: /autoplay(?!.*controls)|autoPlay(?!.*controls)/i,
        severity: "error",
        category: "accessibility",
        suggestion: "Add controls and remove autoplay, or mute + provide pause (WCAG 1.4.2)",
        reason: "Autoplay audio is a WCAG 1.4.2 failure and dark pattern (deceptive.design: Forced Action)"
    },
    {
        id: "color_only_status",
        regex: /className=["'][^"']*text-(red|green|yellow)-\d+["'](?![^<]*aria-label)/i,
        severity: "warning",
        category: "accessibility",
        suggestion: "Add an icon or text label alongside color to convey status (WCAG 1.4.1)",
        reason: "Color-only information excludes colorblind users (8% of males)"
    },
    {
        id: "infinite_scroll_no_escape",
        regex: /onScroll.*fetchMore|IntersectionObserver.*loadMore(?!.*button)/i,
        severity: "warning",
        category: "accessibility",
        suggestion: "Add a 'Load more' button as an alternative to infinite scroll (WCAG 2.1.1)",
        reason: "Infinite scroll traps keyboard users and makes footer unreachable"
    },
    // ─── Motion anti-patterns ─────────────────────────────────────────────────
    {
        id: "infinite_loop_animation",
        regex: /animation-iteration-count:\s*infinite|animate-spin|animate-bounce/i,
        severity: "warning",
        category: "motion",
        suggestion: "Wrap looping animations in @media (prefers-reduced-motion: no-preference)",
        reason: "Infinite animations trigger vestibular disorders and are distracting",
        skipIfInBlock: /prefers-reduced-motion:\s*no-preference/i
    },
    {
        id: "no_reduced_motion",
        regex: /transition:|animation:|@keyframes/i,
        severity: "info",
        category: "motion",
        suggestion: "Wrap all animations in @media (prefers-reduced-motion: no-preference)",
        reason: "WCAG 2.3.3 — all motion must respect prefers-reduced-motion",
        skipIfInBlock: /prefers-reduced-motion:\s*no-preference/i
    },
    // ─── Typography anti-patterns ─────────────────────────────────────────────
    {
        id: "justified_body_text",
        regex: /text-justify|text-align:\s*justify/i,
        severity: "warning",
        category: "typography",
        suggestion: "Use text-left for body copy — justified text creates readability rivers",
        reason: "Justified text without hyphenation creates uneven word spacing (rivers)"
    },
    {
        id: "all_caps_body",
        regex: /text-transform:\s*uppercase(?!.*letter-spacing)|uppercase(?!.*tracking)/i,
        severity: "warning",
        category: "typography",
        suggestion: "Reserve uppercase for labels/badges only, always with letter-spacing: 0.08em+",
        reason: "All-caps without tracking reduces reading speed by up to 14%"
    }
];
export class PatternDetector {
    // Configurable max input size to prevent ReDoS (default 1MB, env overrideable)
    static MAX_INPUT_SIZE = parseInt(process.env.GENOME_MAX_PATTERN_INPUT_BYTES || "1048576", 10);
    detect(css, html) {
        // Guard against huge inputs (ReDoS protection) - truncates with warning
        // Import logger once at the top of the function
        // (dynamic import not needed, use static import if possible)
        // If logger must be dynamic, wrap in async and refactor API
        // Here, fallback to static import
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { logger } = require('../logger.js');
        if (css.length > PatternDetector.MAX_INPUT_SIZE) {
            logger.warn(`CSS input too large, truncating`, 'PatternDetector', { input: css.length, max: PatternDetector.MAX_INPUT_SIZE });
            css = css.substring(0, PatternDetector.MAX_INPUT_SIZE);
        }
        if (html && html.length > PatternDetector.MAX_INPUT_SIZE) {
            logger.warn(`HTML input too large, truncating`, 'PatternDetector', { input: html.length, max: PatternDetector.MAX_INPUT_SIZE });
            html = html.slice(0, PatternDetector.MAX_INPUT_SIZE);
        }
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
                // Skip match if it falls inside a CSS block the pattern exempts
                if (pattern.skipIfInBlock && isInsideBlock(source, match.index, pattern.skipIfInBlock)) {
                    continue;
                }
                const lineIndex = source.substring(0, match.index).split('\n').length - 1;
                const violationType = pattern.category === "dark_pattern" || pattern.category === "accessibility" ? "semantic"
                    : pattern.category === "layout" || pattern.category === "component" || pattern.category === "typography" ? "structural"
                        : "visual";
                violations.push({
                    type: violationType,
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
        const darkPatterns = violations.filter(v => v.pattern.startsWith('fake_') || v.pattern === 'preselected_upsell' || v.pattern === 'confirmshaming' || v.pattern === 'hidden_unsubscribe');
        const a11yViolations = violations.filter(v => v.pattern === 'outline_none_no_replacement' || v.pattern === 'autoplay_media' || v.pattern === 'color_only_status' || v.pattern === 'infinite_scroll_no_escape');
        const slopPatterns = violations.filter(v => !darkPatterns.includes(v) && !a11yViolations.includes(v));
        const errors = violations.filter(v => v.severity === "error");
        const warnings = violations.filter(v => v.severity === "warning");
        let report = `❌ Pattern Analysis: ${errors.length} errors | ${warnings.length} warnings\n\n`;
        if (darkPatterns.length > 0) {
            report += `DARK PATTERNS (ethical violations — remove immediately):\n`;
            darkPatterns.forEach(v => {
                report += `  [${v.pattern}] Line ${v.line || '?'}: ${v.suggestion}\n`;
            });
            report += `\n`;
        }
        if (a11yViolations.length > 0) {
            report += `ACCESSIBILITY (WCAG violations):\n`;
            a11yViolations.forEach(v => {
                report += `  [${v.pattern}] Line ${v.line || '?'}: ${v.suggestion}\n`;
            });
            report += `\n`;
        }
        const slopErrors = slopPatterns.filter(v => v.severity === "error");
        const slopWarnings = slopPatterns.filter(v => v.severity === "warning");
        const slopInfo = slopPatterns.filter(v => v.severity === "info");
        if (slopErrors.length > 0) {
            report += `SLOP ERRORS (breaks DNA contract):\n`;
            slopErrors.forEach(v => {
                report += `  [${v.pattern}] Line ${v.line || '?'}: ${v.suggestion}\n`;
            });
            report += `\n`;
        }
        if (slopWarnings.length > 0) {
            report += `WARNINGS:\n`;
            slopWarnings.forEach(v => {
                report += `  [${v.pattern}] Line ${v.line || '?'}: ${v.suggestion}\n`;
            });
            report += `\n`;
        }
        if (slopInfo.length > 0) {
            report += `INFO:\n`;
            slopInfo.forEach(v => {
                report += `  [${v.pattern}] Line ${v.line || '?'}: ${v.suggestion}\n`;
            });
        }
        return report;
    }
}
