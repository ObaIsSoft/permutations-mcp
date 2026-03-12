/**
 * URL Genome Extractor
 *
 * Reverse-engineers an approximate genome from any website.
 *
 * Use cases:
 * 1. "I love this site's aesthetic, generate something similar but unique"
 * 2. Audit existing sites for slop patterns
 * 3. Migration: existing site → Permutations genome
 */
export class URLGenomeExtractor {
    /**
     * Extract genome from URL
     * Note: This requires a browser automation tool in production.
     * This is the analysis logic that would run after scraping.
     */
    async extract(url, css, computedStyles) {
        const colors = this.extractColors(css, computedStyles);
        const fonts = this.extractFonts(css, computedStyles);
        const radii = this.extractBorderRadii(css);
        const animations = this.extractAnimations(css);
        // Infer primary color
        const primaryColor = this.inferPrimaryColor(colors);
        // Infer sector from content analysis
        const sector = this.inferSector(url, css);
        // Build approximate genome
        const genome = {
            chromosomes: {
                ch0_sector: {
                    primary: sector,
                    secondary: null,
                    subSector: `${sector}_general`,
                    confidence: 0.6
                },
                ch5_color_primary: {
                    hue: primaryColor?.hue || 220,
                    saturation: primaryColor?.saturation || 0.6,
                    lightness: primaryColor?.lightness || 0.5,
                    temperature: this.inferTemperature(primaryColor?.hue || 220),
                    hex: primaryColor?.hex || "#3b82f6",
                    sectorAppropriate: true
                },
                ch3_type_display: {
                    family: fonts[0] || "system-ui",
                    displayName: fonts[0] || "System",
                    importUrl: "",
                    provider: "bunny",
                    charge: this.inferFontCharge(fonts[0]),
                    weight: 700,
                    fallback: "system-ui, sans-serif",
                    tracking: "normal",
                    casing: "normal"
                },
                ch4_type_body: {
                    family: fonts[1] || fonts[0] || "system-ui",
                    displayName: fonts[1] || fonts[0] || "System",
                    importUrl: "",
                    provider: "bunny",
                    charge: this.inferFontCharge(fonts[1] || fonts[0]),
                    xHeightRatio: 0.5,
                    contrast: 1.0,
                    fallback: "system-ui, sans-serif",
                    optimalLineLength: "medium",
                    paragraphSpacing: 1.5,
                    hyphenation: false
                },
                ch7_edge: {
                    radius: this.inferBorderRadius(radii),
                    style: this.inferEdgeStyle(radii),
                    variableRadius: false,
                    componentRadius: this.inferBorderRadius(radii),
                    imageRadius: this.inferBorderRadius(radii),
                    asymmetric: false
                },
                ch8_motion: {
                    physics: this.inferPhysics(animations),
                    durationScale: this.inferDuration(animations),
                    staggerDelay: 0.1,
                    enterDirection: "up",
                    exitBehavior: "fade",
                    hoverIntensity: animations.length > 0 ? 0.5 : 0,
                    reducedMotionFallback: "fade"
                },
                ch9_grid: {
                    logic: this.inferGridLogic(css),
                    asymmetry: 0,
                    columns: this.inferColumnCount(css),
                    gap: this.inferGap(css),
                    mobileColumns: 1,
                    alignment: "stretch"
                }
            }
        };
        const approximations = this.identifyApproximations(genome);
        return {
            genome: genome,
            confidence: this.calculateConfidence(colors, fonts, radii),
            source: {
                url,
                colors: colors.map(c => c.hex),
                fonts: [...new Set(fonts)],
                borderRadii: radii,
                animations
            },
            approximations
        };
    }
    extractColors(css, computedStyles) {
        const colors = [];
        // Extract hex colors
        const hexRegex = /#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/g;
        const hexMatches = css.match(hexRegex) || [];
        for (const hex of hexMatches) {
            colors.push(this.parseHex(hex));
        }
        // Extract rgb/rgba
        const rgbRegex = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/g;
        let match;
        while ((match = rgbRegex.exec(css)) !== null) {
            colors.push(this.rgbToHsl(parseInt(match[1]), parseInt(match[2]), parseInt(match[3])));
        }
        // Count frequency and sort
        const frequency = colors.reduce((acc, c) => {
            acc[c.hex] = (acc[c.hex] || 0) + 1;
            return acc;
        }, {});
        return colors
            .filter((c, i, arr) => arr.findIndex(x => x.hex === c.hex) === i)
            .sort((a, b) => (frequency[b.hex] || 0) - (frequency[a.hex] || 0));
    }
    extractFonts(css, computedStyles) {
        const fonts = [];
        // Extract font-family declarations
        const fontRegex = /font-family:\s*([^;]+)/g;
        let match;
        while ((match = fontRegex.exec(css)) !== null) {
            const families = match[1].split(",").map(f => f.trim().replace(/['"]/g, ""));
            fonts.push(...families.filter(f => f !== "sans-serif" && f !== "serif" && f !== "monospace"));
        }
        // Also check computed styles
        for (const style of computedStyles) {
            if (style.fontFamily) {
                fonts.push(...style.fontFamily.split(",").map(f => f.trim().replace(/['"]/g, "")));
            }
        }
        return [...new Set(fonts)].slice(0, 5);
    }
    extractBorderRadii(css) {
        const radii = [];
        const regex = /border-radius:\s*(\d+)px/g;
        let match;
        while ((match = regex.exec(css)) !== null) {
            radii.push(parseInt(match[1]));
        }
        return [...new Set(radii)].sort((a, b) => a - b);
    }
    extractAnimations(css) {
        const animations = [];
        const regex = /(?:animation|transition):\s*([^;]+)/g;
        let match;
        while ((match = regex.exec(css)) !== null) {
            animations.push(match[1]);
        }
        return animations;
    }
    inferPrimaryColor(colors) {
        if (colors.length === 0)
            return null;
        // Skip neutrals (grays)
        const nonNeutrals = colors.filter(c => c.saturation > 0.1);
        // Return most frequent non-neutral, or first color
        return nonNeutrals[0] || colors[0];
    }
    inferSector(url, css) {
        const lowerUrl = url.toLowerCase();
        const lowerCss = css.toLowerCase();
        // Simple keyword matching
        if (lowerUrl.includes("health") || lowerCss.includes("medical"))
            return "healthcare";
        if (lowerUrl.includes("bank") || lowerUrl.includes("finance") || lowerUrl.includes("pay"))
            return "fintech";
        if (lowerUrl.includes("law") || lowerUrl.includes("legal"))
            return "legal";
        if (lowerUrl.includes("car") || lowerUrl.includes("auto"))
            return "automotive";
        if (lowerUrl.includes("edu") || lowerUrl.includes("school") || lowerUrl.includes("learn"))
            return "education";
        if (lowerUrl.includes("shop") || lowerUrl.includes("store") || lowerUrl.includes("buy"))
            return "commerce";
        if (lowerUrl.includes("travel") || lowerUrl.includes("hotel") || lowerUrl.includes("flight"))
            return "travel";
        if (lowerUrl.includes("food") || lowerUrl.includes("restaurant") || lowerUrl.includes("eat"))
            return "food";
        if (lowerUrl.includes("sport") || lowerUrl.includes("fitness"))
            return "sports";
        return "technology";
    }
    inferTemperature(hue) {
        if (hue >= 15 && hue <= 75)
            return "warm"; // Yellow-Orange
        if (hue >= 165 && hue <= 255)
            return "cool"; // Cyan-Blue
        return "neutral";
    }
    inferFontCharge(fontName) {
        if (!fontName)
            return "transitional";
        const geometric = ["montserrat", "poppins", "raleway", "nunito", "manrope", "plus jakarta sans"];
        const humanist = ["merriweather", "crimson", "source serif", "playfair", "fraunces"];
        const monospace = ["mono", "code", "ibm plex mono", "fira code", "jetbrains"];
        const lower = fontName.toLowerCase();
        if (geometric.some(g => lower.includes(g)))
            return "geometric";
        if (humanist.some(h => lower.includes(h)))
            return "humanist";
        if (monospace.some(m => lower.includes(m)))
            return "monospace";
        return "transitional";
    }
    inferBorderRadius(radii) {
        if (radii.length === 0)
            return 4;
        // Return median
        const sorted = [...radii].sort((a, b) => a - b);
        return sorted[Math.floor(sorted.length / 2)];
    }
    inferEdgeStyle(radii) {
        if (radii.length === 0 || radii.every(r => r === 0))
            return "sharp";
        const max = Math.max(...radii);
        if (max > 20)
            return "organic";
        if (max > 8)
            return "soft";
        return "techno";
    }
    inferPhysics(animations) {
        if (animations.length === 0)
            return "none";
        const animText = animations.join(" ").toLowerCase();
        if (animText.includes("cubic-bezier") || animText.includes("spring"))
            return "spring";
        if (animText.includes("steps") || animText.includes("discrete"))
            return "step";
        return "spring"; // Default assumption
    }
    inferDuration(animations) {
        if (animations.length === 0)
            return 0.3;
        // Extract duration values
        const durations = [];
        const regex = /(\d+(?:\.\d+)?)s/g;
        let match;
        for (const anim of animations) {
            while ((match = regex.exec(anim)) !== null) {
                durations.push(parseFloat(match[1]));
            }
        }
        // Return median duration
        if (durations.length === 0)
            return 0.3;
        const sorted = durations.sort((a, b) => a - b);
        return sorted[Math.floor(sorted.length / 2)];
    }
    inferGridLogic(css) {
        if (css.includes("grid-template-columns"))
            return "column";
        if (css.includes("columns:"))
            return "masonry";
        return "column";
    }
    inferColumnCount(css) {
        const regex = /grid-template-columns:\s*repeat\((\d+)/;
        const match = css.match(regex);
        if (match)
            return parseInt(match[1]);
        // Check for explicit columns
        const colRegex = /grid-template-columns:\s*[^;]+/g;
        const colMatch = colRegex.exec(css);
        if (colMatch) {
            return colMatch[0].split(" ").filter(c => c.trim()).length;
        }
        return 3; // Default
    }
    inferGap(css) {
        const regex = /gap:\s*(\d+)px/;
        const match = css.match(regex);
        return match ? parseInt(match[1]) : 24;
    }
    calculateConfidence(colors, fonts, radii) {
        let score = 0.5; // Base confidence
        // More data = higher confidence
        if (colors.length > 3)
            score += 0.1;
        if (fonts.length > 0)
            score += 0.1;
        if (radii.length > 0)
            score += 0.1;
        // Less confidence if we have to guess a lot
        return Math.min(0.9, score);
    }
    identifyApproximations(genome) {
        const approximations = [];
        if (!genome.chromosomes?.ch26_color_system) {
            approximations.push("No complete color system extracted - using primary color only");
        }
        if (!genome.chromosomes?.ch27_motion_choreography) {
            approximations.push("Motion choreography not detectable from CSS alone");
        }
        if (!genome.chromosomes?.ch28_iconography) {
            approximations.push("Iconography not detectable from CSS alone");
        }
        return approximations;
    }
    // Color utilities
    parseHex(hex) {
        const full = hex.length === 4
            ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
            : hex;
        const r = parseInt(full.slice(1, 3), 16);
        const g = parseInt(full.slice(3, 5), 16);
        const b = parseInt(full.slice(5, 7), 16);
        return this.rgbToHsl(r, g, b);
    }
    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;
        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                    break;
                case g:
                    h = ((b - r) / d + 2) / 6;
                    break;
                case b:
                    h = ((r - g) / d + 4) / 6;
                    break;
            }
        }
        const hex = `#${[r, g, b].map(x => {
            const v = Math.round(x * 255);
            return v.toString(16).padStart(2, "0");
        }).join("")}`;
        return { hue: Math.round(h * 360), saturation: s, lightness: l, hex };
    }
}
export const urlGenomeExtractor = new URLGenomeExtractor();
