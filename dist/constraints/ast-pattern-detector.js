import safeParser from 'postcss-safe-parser';
// Font detection rules
const FONT_RULES = [
    {
        id: "font_inter",
        severity: "error",
        category: "font",
        suggestion: "Use the DNA-assigned display or body font family",
        reason: "Inter is the default AI slop font"
    },
    {
        id: "font_roboto",
        severity: "error",
        category: "font",
        suggestion: "Use the DNA-assigned font family",
        reason: "Roboto is overused and generic"
    }
];
// Gradient detection rules
const GRADIENT_RULES = [
    {
        id: "tailwind_gradient",
        severity: "warning",
        category: "color",
        suggestion: "Use solid colors from DNA palette or fx-atmosphere",
        reason: "Tailwind gradients are overused"
    },
    {
        id: "blue_purple_gradient",
        severity: "error",
        category: "color",
        suggestion: "Use DNA primary color with proper temperature",
        reason: "Blue-purple gradient is ultimate AI slop"
    }
];
// Layout detection rules
const LAYOUT_RULES = [
    {
        id: "excessive_rounding",
        severity: "error",
        category: "layout",
        suggestion: "Use rounded-genome (9px) or brutalist 0px based on DNA",
        reason: "Excessive rounding creates generic SaaS aesthetic"
    },
    {
        id: "heavy_shadow",
        severity: "warning",
        category: "layout",
        suggestion: "Use 1px borders or subtle DNA shadows",
        reason: "Heavy shadows create depth confusion"
    },
    {
        id: "backdrop_blur",
        severity: "warning",
        category: "color",
        suggestion: "Use solid DNA surface colors",
        reason: "Glassmorphism is overused"
    }
];
export class ASTPatternDetector {
    violations = [];
    async detect(css, html, jsx) {
        this.violations = [];
        // Parse CSS with PostCSS
        await this.detectInCSS(css);
        // Detect in HTML/JSX inline styles
        if (html) {
            await this.detectInHTML(html);
        }
        if (jsx) {
            await this.detectInJSX(jsx);
        }
        return this.violations;
    }
    async detectInCSS(css) {
        try {
            const root = safeParser(css);
            root.walkDecls((decl) => {
                this.checkDeclaration(decl);
            });
        }
        catch (e) {
            // CSS parsing error
        }
    }
    checkDeclaration(decl) {
        const prop = decl.prop.toLowerCase();
        const value = decl.value.toLowerCase();
        // Check font-family declarations
        if (prop === 'font-family' || prop === 'font') {
            this.checkFontFamily(decl);
        }
        // Check background/gradient declarations
        if (prop === 'background' || prop === 'background-image') {
            this.checkGradients(decl);
        }
        // Check border-radius
        if (prop === 'border-radius') {
            this.checkBorderRadius(decl);
        }
        // Check box-shadow
        if (prop === 'box-shadow') {
            this.checkShadow(decl);
        }
        // Check backdrop-filter (glassmorphism)
        if (prop === 'backdrop-filter') {
            this.checkBackdropFilter(decl);
        }
    }
    checkFontFamily(decl) {
        const value = decl.value;
        // Check for Inter (various formats)
        if (/inter/i.test(value) && !/system-ui/i.test(value)) {
            this.addViolation({
                ...FONT_RULES[0],
                line: decl.source?.start?.line,
                column: decl.source?.start?.column,
                evidence: value
            });
        }
        // Check for Roboto
        if (/roboto/i.test(value)) {
            this.addViolation({
                ...FONT_RULES[1],
                line: decl.source?.start?.line,
                column: decl.source?.start?.column,
                evidence: value
            });
        }
    }
    checkGradients(decl) {
        const value = decl.value;
        // Check for Tailwind gradient classes in CSS
        if (/bg-gradient-to-(r|l|t|b|tr|tl|br|bl)/.test(value)) {
            this.addViolation({
                ...GRADIENT_RULES[0],
                line: decl.source?.start?.line,
                column: decl.source?.start?.column,
                evidence: value
            });
        }
        // Check for blue-purple gradients
        if (/linear-gradient.*(blue|indigo).*purple|from-blue.*to-purple/i.test(value)) {
            this.addViolation({
                ...GRADIENT_RULES[1],
                line: decl.source?.start?.line,
                column: decl.source?.start?.column,
                evidence: value
            });
        }
    }
    checkBorderRadius(decl) {
        const value = decl.value;
        // Extract pixel values
        const pxMatch = value.match(/(\d+)px/);
        const remMatch = value.match(/([\d.]+)rem/);
        let radius = 0;
        if (pxMatch) {
            radius = parseInt(pxMatch[1]);
        }
        else if (remMatch) {
            radius = parseFloat(remMatch[1]) * 16;
        }
        // Flag excessive rounding (> 16px)
        if (radius > 16) {
            this.addViolation({
                ...LAYOUT_RULES[0],
                line: decl.source?.start?.line,
                column: decl.source?.start?.column,
                evidence: `${decl.prop}: ${value}`
            });
        }
    }
    checkShadow(decl) {
        const value = decl.value;
        // Check for heavy shadows (large blur radius)
        const blurMatches = value.match(/(\d+)px/g);
        if (blurMatches) {
            const blurValues = blurMatches.map(v => parseInt(v));
            const maxBlur = Math.max(...blurValues);
            if (maxBlur > 20) {
                this.addViolation({
                    ...LAYOUT_RULES[1],
                    line: decl.source?.start?.line,
                    column: decl.source?.start?.column,
                    evidence: `${decl.prop}: ${value}`
                });
            }
        }
    }
    checkBackdropFilter(decl) {
        const value = decl.value;
        if (/blur/i.test(value)) {
            this.addViolation({
                ...LAYOUT_RULES[2],
                line: decl.source?.start?.line,
                column: decl.source?.start?.column,
                evidence: `${decl.prop}: ${value}`
            });
        }
    }
    async detectInHTML(html) {
        // Check for inline styles in HTML
        const styleRegex = /style=["']([^"']+)["']/gi;
        let match;
        while ((match = styleRegex.exec(html)) !== null) {
            const inlineCSS = match[1];
            const fakeCSS = `.inline { ${inlineCSS} }`;
            try {
                const root = safeParser(fakeCSS);
                root.walkDecls((decl) => {
                    this.checkDeclaration(decl);
                });
            }
            catch (e) {
                // Ignore invalid inline styles
            }
        }
        // Check for Tailwind classes in HTML
        this.checkTailwindClasses(html);
    }
    async detectInJSX(jsx) {
        // Check CSS-in-JS patterns
        // styled-components: styled.div`...`
        const styledRegex = /styled\.\w+\s*`|styled\([\w\"\']+\)\s*`/g;
        let match;
        while ((match = styledRegex.exec(jsx)) !== null) {
            const templateContent = this.extractTemplateLiteral(jsx, match.index + match[0].length - 1);
            if (templateContent) {
                await this.detectInCSS(templateContent);
            }
        }
        // Emotion: css`...`
        const emotionRegex = /css\s*`/g;
        while ((match = emotionRegex.exec(jsx)) !== null) {
            const templateContent = this.extractTemplateLiteral(jsx, match.index + match[0].length - 1);
            if (templateContent) {
                await this.detectInCSS(templateContent);
            }
        }
        // Inline styles in JSX: style={{...}}
        const jsxStyleRegex = /style=\{\{\s*([^}]+)\}\}/g;
        while ((match = jsxStyleRegex.exec(jsx)) !== null) {
            const styleObj = match[1];
            // Convert JSX style object to CSS
            const css = this.convertJSXStyleToCSS(styleObj);
            await this.detectInCSS(css);
        }
        // Check Tailwind classes
        this.checkTailwindClasses(jsx);
    }
    extractTemplateLiteral(source, startIndex) {
        let depth = 0;
        let result = '';
        let escaped = false;
        for (let i = startIndex + 1; i < source.length; i++) {
            const char = source[i];
            if (escaped) {
                result += char;
                escaped = false;
                continue;
            }
            if (char === '\\') {
                escaped = true;
                result += char;
                continue;
            }
            if (char === '$' && source[i + 1] === '{') {
                depth++;
                i++;
                result += '${';
                continue;
            }
            if (char === '}') {
                if (depth > 0) {
                    depth--;
                    result += char;
                    continue;
                }
            }
            if (char === '`' && depth === 0) {
                return result;
            }
            result += char;
        }
        return null;
    }
    convertJSXStyleToCSS(styleObj) {
        // Convert camelCase to kebab-case
        const css = styleObj
            .replace(/([A-Z])/g, '-$1')
            .toLowerCase()
            .replace(/:\s*/g, ': ')
            .replace(/,\s*/g, '; ');
        return `.jsx-style { ${css} }`;
    }
    checkTailwindClasses(content) {
        // Check for Tailwind font classes
        const fontInterRegex = /\bfont-(inter|Inter)\b/g;
        let match;
        while ((match = fontInterRegex.exec(content)) !== null) {
            this.addViolation({
                ...FONT_RULES[0],
                line: this.estimateLineNumber(content, match.index),
                evidence: match[0]
            });
        }
        // Check for gradient classes
        const gradientRegex = /\bbg-gradient-to-(r|l|t|b|tr|tl|br|bl)\b/g;
        while ((match = gradientRegex.exec(content)) !== null) {
            this.addViolation({
                ...GRADIENT_RULES[0],
                line: this.estimateLineNumber(content, match.index),
                evidence: match[0]
            });
        }
        // Check for excessive rounding
        const roundedRegex = /\brounded-(xl|2xl|3xl|full)\b/g;
        while ((match = roundedRegex.exec(content)) !== null) {
            this.addViolation({
                ...LAYOUT_RULES[0],
                line: this.estimateLineNumber(content, match.index),
                evidence: match[0]
            });
        }
        // Check for backdrop blur
        const blurRegex = /\bbackdrop-blur(-\w+)?\b/g;
        while ((match = blurRegex.exec(content)) !== null) {
            this.addViolation({
                ...LAYOUT_RULES[2],
                line: this.estimateLineNumber(content, match.index),
                evidence: match[0]
            });
        }
    }
    estimateLineNumber(content, index) {
        const lines = content.substring(0, index).split('\n');
        return lines.length;
    }
    addViolation(rule) {
        this.violations.push({
            type: rule.category === "layout" || rule.category === "component" ? "structural" : "visual",
            pattern: rule.id,
            severity: rule.severity,
            line: rule.line,
            column: rule.column,
            suggestion: rule.suggestion,
            reason: rule.reason,
            evidence: rule.evidence || ""
        });
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
                report += `     Evidence: ${v.evidence.slice(0, 60)}${v.evidence.length > 60 ? '...' : ''}\n`;
                report += `     Reason: ${v.reason}\n\n`;
            });
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
