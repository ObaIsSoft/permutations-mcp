/**
 * Genome-Aware CSS Validator
 *
 * Uses css-tree to parse CSS and validate against genome constraints.
 * Provides drift scoring and auto-correction suggestions.
 */
import * as csstree from 'css-tree';
export class GenomeAwareValidator {
    genome;
    violations = [];
    corrections = new Map();
    validate(css, genome) {
        this.genome = genome;
        this.violations = [];
        this.corrections = new Map();
        const ast = csstree.parse(css, {
            positions: true,
            onParseError: async (error) => {
                // Log parsing errors but continue
                const { logger } = await import('../logger.js');
                logger.error('CSS parse error', 'ASTPatternDetector', error);
            }
        });
        // Walk the AST and validate declarations
        csstree.walk(ast, (node) => {
            if (node.type === 'Declaration') {
                this.validateDeclaration(node);
            }
        });
        // Generate corrected CSS
        const correctedCSS = this.applyCorrections(css, ast);
        // Calculate drift score (0-100)
        const driftScore = this.calculateDriftScore();
        return {
            valid: this.violations.length === 0,
            driftScore,
            violations: this.violations,
            corrections: correctedCSS
        };
    }
    validateDeclaration(node) {
        const property = node.property.toLowerCase();
        const value = csstree.generate(node.value);
        const line = node.loc?.start?.line || 0;
        const column = node.loc?.start?.column || 0;
        switch (property) {
            case 'font-family':
                this.validateFontFamily(value, line, column);
                break;
            case 'color':
            case 'background-color':
            case 'border-color':
                this.validateColor(value, property, line, column);
                break;
            case 'border-radius':
                this.validateBorderRadius(value, line, column);
                break;
            case 'padding':
            case 'margin':
            case 'gap':
                this.validateSpacing(value, property, line, column);
                break;
            case 'font-size':
                this.validateFontSize(value, line, column);
                break;
            case 'transition-duration':
            case 'animation-duration':
                this.validateTiming(value, line, column);
                break;
        }
    }
    validateFontFamily(value, line, column) {
        const expectedDisplay = this.genome.chromosomes.ch3_type_display.family;
        const expectedBody = this.genome.chromosomes.ch4_type_body.family;
        // Check if font matches either display or body
        const valueLower = value.toLowerCase();
        const isDisplay = valueLower.includes(expectedDisplay.toLowerCase());
        const isBody = valueLower.includes(expectedBody.toLowerCase());
        if (!isDisplay && !isBody && !valueLower.includes('system-ui')) {
            this.violations.push({
                chromosome: 'ch3_type_display / ch4_type_body',
                property: 'font-family',
                expected: `${expectedDisplay} or ${expectedBody}`,
                actual: value,
                line,
                column,
                severity: 'warning',
                correction: `font-family: ${expectedBody}, system-ui, sans-serif`
            });
            this.corrections.set(`font-family:${value}`, `font-family: ${expectedBody}, system-ui, sans-serif`);
        }
    }
    validateColor(value, property, line, column) {
        const primary = this.genome.chromosomes.ch5_color_primary;
        const expectedHue = primary.hue;
        // Parse the color value
        const parsed = this.parseColor(value);
        if (!parsed)
            return;
        // Check if it's within ±20° of primary hue
        const hueDiff = Math.abs(this.hueDifference(parsed.hue, expectedHue));
        if (hueDiff > 20 && parsed.saturation > 0.1) {
            this.violations.push({
                chromosome: 'ch5_color_primary',
                property,
                expected: `hue within ±20° of ${expectedHue}`,
                actual: `hue ${parsed.hue}`,
                line,
                column,
                severity: 'warning',
                correction: `${property}: ${this.adjustHue(value, expectedHue, parsed.hue)}`
            });
        }
    }
    validateBorderRadius(value, line, column) {
        const expectedRadius = this.genome.chromosomes.ch7_edge.componentRadius;
        const pxValue = this.extractPx(value);
        if (pxValue !== null && Math.abs(pxValue - expectedRadius) > 2) {
            this.violations.push({
                chromosome: 'ch7_edge',
                property: 'border-radius',
                expected: `${expectedRadius}px`,
                actual: `${pxValue}px`,
                line,
                column,
                severity: 'error',
                correction: `border-radius: ${expectedRadius}px`
            });
            this.corrections.set(`border-radius:${value}`, `border-radius: ${expectedRadius}px`);
        }
    }
    validateSpacing(value, property, line, column) {
        const baseSpacing = this.genome.chromosomes.ch2_rhythm.baseSpacing;
        const pxValue = this.extractPx(value);
        if (pxValue !== null) {
            // Check if it's a multiple of base spacing
            const remainder = pxValue % baseSpacing;
            if (remainder > 2) {
                const corrected = Math.round(pxValue / baseSpacing) * baseSpacing;
                this.violations.push({
                    chromosome: 'ch2_rhythm',
                    property,
                    expected: `multiple of ${baseSpacing}px`,
                    actual: `${pxValue}px`,
                    line,
                    column,
                    severity: 'warning',
                    correction: `${property}: ${corrected}px`
                });
                this.corrections.set(`${property}:${value}`, `${property}: ${corrected}px`);
            }
        }
    }
    validateFontSize(value, line, column) {
        const baseSize = this.genome.chromosomes.ch16_typography.baseSize;
        const ratio = this.genome.chromosomes.ch16_typography.ratio;
        const pxValue = this.extractPx(value);
        if (pxValue !== null) {
            // Check if it follows the type scale
            const expectedSizes = [
                baseSize,
                Math.round(baseSize * ratio),
                Math.round(baseSize * ratio * ratio),
                Math.round(baseSize / ratio)
            ];
            const isValid = expectedSizes.some(size => Math.abs(size - pxValue) <= 2);
            if (!isValid) {
                const closest = expectedSizes.reduce((prev, curr) => Math.abs(curr - pxValue) < Math.abs(prev - pxValue) ? curr : prev);
                this.violations.push({
                    chromosome: 'ch16_typography',
                    property: 'font-size',
                    expected: `type scale multiple of ${baseSize}px (ratio ${ratio.toFixed(2)})`,
                    actual: `${pxValue}px`,
                    line,
                    column,
                    severity: 'warning',
                    correction: `font-size: ${closest}px`
                });
            }
        }
    }
    validateTiming(value, line, column) {
        const durationScale = this.genome.chromosomes.ch8_motion.durationScale;
        const msValue = this.extractMs(value);
        if (msValue !== null) {
            // Expected range based on durationScale
            const expectedFast = 150 * durationScale;
            const expectedNormal = 300 * durationScale;
            const expectedSlow = 500 * durationScale;
            const expectedValues = [expectedFast, expectedNormal, expectedSlow];
            const isValid = expectedValues.some(v => Math.abs(v - msValue) <= 50);
            if (!isValid) {
                const closest = expectedValues.reduce((prev, curr) => Math.abs(curr - msValue) < Math.abs(prev - msValue) ? curr : prev);
                this.violations.push({
                    chromosome: 'ch8_motion',
                    property: 'transition-duration',
                    expected: `${expectedFast.toFixed(0)}ms, ${expectedNormal.toFixed(0)}ms, or ${expectedSlow.toFixed(0)}ms`,
                    actual: `${msValue}ms`,
                    line,
                    column,
                    severity: 'warning',
                    correction: `transition-duration: ${closest.toFixed(0)}ms`
                });
            }
        }
    }
    parseColor(value) {
        // Handle hex
        const hexMatch = value.match(/#([0-9a-fA-F]{3,6})/);
        if (hexMatch) {
            return this.hexToHsl(hexMatch[1]);
        }
        // Handle rgb/rgba
        const rgbMatch = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (rgbMatch) {
            return this.rgbToHsl(parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3]));
        }
        // Handle hsl/hsla
        const hslMatch = value.match(/hsla?\((\d+),\s*(\d+)%,?\s*(\d+)%/);
        if (hslMatch) {
            return {
                hue: parseInt(hslMatch[1]),
                saturation: parseInt(hslMatch[2]) / 100,
                lightness: parseInt(hslMatch[3]) / 100
            };
        }
        return null;
    }
    hexToHsl(hex) {
        // Expand 3-digit hex
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;
        return this.rgbToHsl(r * 255, g * 255, b * 255);
    }
    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;
        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return {
            hue: Math.round(h * 360),
            saturation: s,
            lightness: l
        };
    }
    hueDifference(h1, h2) {
        const diff = Math.abs(h1 - h2);
        return diff > 180 ? 360 - diff : diff;
    }
    adjustHue(originalValue, targetHue, currentHue) {
        // Simple hue shift - preserve format
        const hueShift = targetHue - currentHue;
        if (originalValue.includes('hsl')) {
            return originalValue.replace(/hsl\((\d+)/, `hsl(${targetHue}`);
        }
        // For hex/rgb, convert to HSL and back
        const parsed = this.parseColor(originalValue);
        if (!parsed)
            return originalValue;
        return `hsl(${targetHue}, ${Math.round(parsed.saturation * 100)}%, ${Math.round(parsed.lightness * 100)}%)`;
    }
    extractPx(value) {
        const match = value.match(/(\d+(?:\.\d+)?)px/);
        return match ? parseFloat(match[1]) : null;
    }
    extractMs(value) {
        const msMatch = value.match(/(\d+(?:\.\d+)?)ms/);
        if (msMatch)
            return parseFloat(msMatch[1]);
        const sMatch = value.match(/(\d+(?:\.\d+)?)s/);
        if (sMatch)
            return parseFloat(sMatch[1]) * 1000;
        return null;
    }
    calculateDriftScore() {
        if (this.violations.length === 0)
            return 0;
        // Weight violations by severity
        const errorWeight = 10;
        const warningWeight = 5;
        let totalWeight = 0;
        for (const v of this.violations) {
            totalWeight += v.severity === 'error' ? errorWeight : warningWeight;
        }
        // Cap at 100
        return Math.min(100, totalWeight);
    }
    applyCorrections(css, ast) {
        let corrected = css;
        // Apply corrections in reverse order to preserve positions
        const sortedViolations = [...this.violations].sort((a, b) => b.line - a.line || b.column - a.column);
        for (const violation of sortedViolations) {
            // Simple string replacement - in production, use AST manipulation
            const lines = corrected.split('\n');
            if (violation.line > 0 && violation.line <= lines.length) {
                const line = lines[violation.line - 1];
                if (line.includes(violation.actual)) {
                    lines[violation.line - 1] = line.replace(violation.actual, violation.correction.split(': ')[1] || violation.expected);
                }
            }
            corrected = lines.join('\n');
        }
        return corrected;
    }
    generateReport(result) {
        if (result.valid) {
            return `✅ CSS is fully DNA-compliant (drift score: ${result.driftScore})`;
        }
        let report = `❌ CSS Validation Failed (drift score: ${result.driftScore}/100)\n\n`;
        const errors = result.violations.filter(v => v.severity === 'error');
        const warnings = result.violations.filter(v => v.severity === 'warning');
        if (errors.length > 0) {
            report += `ERRORS (${errors.length}):\n`;
            errors.forEach(v => {
                report += `  [${v.chromosome}] Line ${v.line}:${v.column}\n`;
                report += `    Property: ${v.property}\n`;
                report += `    Expected: ${v.expected}\n`;
                report += `    Actual:   ${v.actual}\n`;
                report += `    → ${v.correction}\n\n`;
            });
        }
        if (warnings.length > 0) {
            report += `WARNINGS (${warnings.length}):\n`;
            warnings.forEach(v => {
                report += `  [${v.chromosome}] Line ${v.line}:${v.column} - ${v.property}\n`;
                report += `    → ${v.correction}\n`;
            });
        }
        return report;
    }
}
export const genomeValidator = new GenomeAwareValidator();
