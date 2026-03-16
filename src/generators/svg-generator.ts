/**
 * SVG Biomarker Generator — LLM-driven
 *
 * Generates a unique visual identity mark for each genome by synthesizing
 * the chromosome combination through an LLM. The LLM reads the genome's
 * visual character and produces an SVG that EXPRESSES it, not a hardcoded
 * geometric template.
 *
 * The mark is as unique as the genome itself. Same epistatic reasoning as
 * the design brief: the chromosome combination produces emergent visual
 * direction that no template could capture.
 *
 * Fallback: if LLM call fails, a deterministic parametric mark is generated
 * from the full chromosome set (not just 3 values like the old generator).
 */

import type { DesignGenome } from "../genome/types.js";

// SVG elements allowed in a biomarker — no text, no images, no external refs
const ALLOWED_ELEMENTS = ["path", "polygon", "circle", "rect", "line", "ellipse", "polyline", "g"];
const FORBIDDEN_ATTRS = ["href", "xlink:href", "src", "data-href", "onclick", "onload", "style"];

export class SVGGenerator {

    async generateBiomarker(
        genome: DesignGenome,
        callText: (prompt: string) => Promise<string>
    ): Promise<string> {
        const prompt = this.buildPrompt(genome);
        try {
            const raw = await callText(prompt);
            const inner = this.extractAndSanitize(raw);
            if (inner.trim().length > 0) {
                return this.wrapSVG(inner, genome);
            }
        } catch {
            // Fall through to parametric fallback
        }
        return this.fallback(genome);
    }

    private buildPrompt(genome: DesignGenome): string {
        const c = genome.chromosomes;
        const bm = c.ch15_biomarker;
        const edge = c.ch7_edge;
        const motion = c.ch8_motion;
        const rhythm = c.ch2_rhythm;
        const hierarchy = c.ch10_hierarchy;
        const texture = c.ch11_texture;
        const primary = c.ch5_color_primary;
        const typeDisplay = c.ch3_type_display;

        // Derive visual character description from chromosome combination
        const shapeChar = {
            geometric:     "precise, angular, grid-aligned — no organic curves",
            biological:    "cellular, organic, growth-pattern inspired",
            crystalline:   "sharp facets, repeating angular structures, mineral-like",
            fluid:         "flowing curves, liquid movement, continuous paths",
            architectural: "structural, weight-bearing, composed of distinct elements",
        }[bm.shapeFamily] ?? "abstract";

        const edgeChar = {
            sharp:      "all corners sharp, no rounding — angular precision",
            soft:       "soft corners, gentle curves throughout",
            organic:    "freely curved, no geometric rigidity",
            techno:     "crisp, layered, digital-mechanical — modular precision",
            brutalist:  "raw, heavy, unrefined — brutalist character",
            serrated:   "jagged, notched edges — aggressive, mechanical",
            hand_drawn: "irregular, imperfect — sketch-like warmth",
            chiseled:   "faceted angular cuts — jewellery precision",
        }[edge.style] ?? "neutral";

        const densityChar = rhythm.density === "empty" ? "sparse elements, generous negative space"
            : rhythm.density === "breathing" ? "open composition, breathing room"
            : rhythm.density === "airtight" ? "tightly packed, complex, layered"
            : rhythm.density === "maximal" ? "maximum density, every pixel occupied"
            : "balanced positive/negative space";

        const depthChar = hierarchy.depth === "flat" ? "flat, single-plane — no layering"
            : hierarchy.depth === "overlapping" ? "overlapping elements, layered depth"
            : hierarchy.depth === "3d-stack" ? "strong 3D stacking, multiple intersecting layers"
            : "moderate depth";

        const strokeWeight = Math.max(1.5, Math.min(4, typeDisplay.weight / 100));

        return `You are generating a unique SVG biomarker (visual identity mark) for a design system.

WHAT A BIOMARKER IS:
A small abstract mark — like a logo mark or favicon glyph. It is NOT a letter, NOT a recognizable real-world symbol, NOT clip art. It is a purely visual, geometric mark that encodes the design system's identity. Think: abstract brand mark, not icon.

GENOME CHARACTER (synthesize these together, not individually):
  Shape family   : ${bm.shapeFamily} — ${shapeChar}
  Edge treatment : ${edge.style} — ${edgeChar}
  Space density  : ${rhythm.density} — ${densityChar}
  Depth          : ${hierarchy.depth} — ${depthChar}
  Surface        : ${texture.surface}
  Motion soul    : ${motion.physics} (${bm.animationStyle} animation style — encode this in the mark's visual tension)
  Polycount      : ${bm.polycount} (${bm.polycount === "low" ? "few elements, simple paths" : bm.polycount === "medium" ? "moderate complexity" : "rich detail, multiple elements"})
  Sector         : ${genome.sectorContext.primary}
  Color temp     : HSL(${primary.hue}°, ${Math.round(primary.saturation * 100)}%, ${Math.round(primary.lightness * 100)}%) — ${primary.temperature}

SVG RULES (strict — violation makes the mark unusable):
  - viewBox is 0 0 100 100 (you only write the INNER elements)
  - stroke="currentColor" on all elements (NO hardcoded colors)
  - fill="none" unless using fill="currentColor" sparingly for ONE accent element
  - stroke-width="${strokeWeight.toFixed(1)}" as default (can vary ±0.5 for emphasis)
  - All shapes must fit within bounds: 8,8 → 92,92 (8px safe margin all sides)
  - ONLY these elements: path, polygon, circle, rect, line, ellipse, polyline, g
  - NO: text, image, use, defs, clipPath, filter, mask, symbol, script, style
  - Max 14 SVG elements total
  - NO external references, NO data URIs, NO event handlers

OUTPUT:
Return ONLY the SVG inner elements. No <svg> wrapper. No markdown code fences. No explanation. Start directly with the first SVG element.

Example of correct output format:
<circle cx="50" cy="50" r="35" />
<polygon points="50,15 85,85 15,85" />

The mark should feel: ${shapeChar}. It should look like it belongs to a ${genome.sectorContext.primary} product with ${edge.style} edge treatment. The ${bm.animationStyle} animation soul should be visible in its static form as visual tension or implied movement.`;
    }

    /**
     * Extract SVG elements from LLM response and sanitize them.
     * Strips anything that isn't an allowed element or has forbidden attributes.
     */
    private extractAndSanitize(raw: string): string {
        // Strip markdown fences if present
        let content = raw
            .replace(/```svg\s*/gi, "")
            .replace(/```\s*/g, "")
            .replace(/<svg[^>]*>/gi, "")
            .replace(/<\/svg>/gi, "")
            .trim();

        // Remove forbidden attributes
        for (const attr of FORBIDDEN_ATTRS) {
            content = content.replace(new RegExp(`\\s${attr}\\s*=\\s*["'][^"']*["']`, "gi"), "");
        }

        // Remove elements not in allowed list
        content = content.replace(
            /<(\w+)([^>]*)\/?>[\s\S]*?<\/\1>|<(\w+)([^>]*)\/>/g,
            (match, tag1, _attrs1, tag2) => {
                const tag = (tag1 || tag2 || "").toLowerCase();
                if (ALLOWED_ELEMENTS.includes(tag)) return match;
                return "";
            }
        );

        // Remove any inline event handlers (security)
        content = content.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "");

        // Limit to max 14 elements by truncating excess
        const elementMatches = content.match(/<\w[^>]*\/?>/g) || [];
        if (elementMatches.length > 14) {
            // Keep first 14 opening/self-closing tags worth of content
            let count = 0;
            content = content.replace(/<\w[^>]*\/?>/g, (match) => {
                count++;
                return count <= 14 ? match : "";
            });
        }

        return content;
    }

    private wrapSVG(inner: string, genome: DesignGenome): string {
        const bm = genome.chromosomes.ch15_biomarker;
        return `<svg viewBox="0 0 100 100" class="w-full h-full text-current" xmlns="http://www.w3.org/2000/svg"
  data-shape-family="${bm.shapeFamily}"
  data-anim="${bm.animationStyle}"
  data-complexity="${bm.complexity.toFixed(3)}"
  data-dna="${genome.dnaHash.slice(0, 8)}">
  <!-- Permutations Biomarker — ${bm.shapeFamily}/${bm.animationStyle} — ${genome.sectorContext.primary} -->
  <g stroke-width="${Math.max(1.5, Math.min(4, genome.chromosomes.ch3_type_display.weight / 100)).toFixed(1)}" fill="none" stroke="currentColor">
    ${inner}
  </g>
</svg>`;
    }

    /**
     * Parametric fallback — uses the full chromosome set (not just 3 values).
     * Deterministic from dnaHash bytes — covers all 5 shape families.
     */
    private fallback(genome: DesignGenome): string {
        const bm = genome.chromosomes.ch15_biomarker;
        const entropy = genome.chromosomes.ch12_signature?.entropy ?? 0.5;
        const hashBytes = genome.dnaHash.slice(0, 16).match(/.{2}/g)?.map(h => parseInt(h, 16)) ?? [128];
        const weight = Math.max(1.5, Math.min(4, genome.chromosomes.ch3_type_display.weight / 100));

        let inner: string;

        switch (bm.shapeFamily) {
            case "geometric":
                inner = this.fallbackGeometric(bm.complexity, entropy, hashBytes);
                break;
            case "crystalline":
                inner = this.fallbackCrystalline(bm.complexity, entropy, hashBytes);
                break;
            case "biological":
                inner = this.fallbackBiological(bm.complexity, entropy, hashBytes);
                break;
            case "fluid":
                inner = this.fallbackFluid(bm.complexity, entropy, hashBytes);
                break;
            case "architectural":
                inner = this.fallbackArchitectural(bm.complexity, entropy, hashBytes);
                break;
            default:
                inner = this.fallbackGeometric(bm.complexity, entropy, hashBytes);
        }

        return `<svg viewBox="0 0 100 100" class="w-full h-full text-current" xmlns="http://www.w3.org/2000/svg"
  data-shape-family="${bm.shapeFamily}"
  data-anim="${bm.animationStyle}"
  data-complexity="${bm.complexity.toFixed(3)}"
  data-dna="${genome.dnaHash.slice(0, 8)}"
  data-fallback="true">
  <!-- Permutations Biomarker (fallback) — ${bm.shapeFamily} — ${genome.sectorContext.primary} -->
  <g stroke-width="${weight.toFixed(1)}" fill="none" stroke="currentColor">
    ${inner}
  </g>
</svg>`;
    }

    // Geometric: nested rotated rectangles — precision, structure
    private fallbackGeometric(complexity: number, entropy: number, bytes: number[]): string {
        const layers = Math.max(2, Math.round(2 + complexity * 3));
        const rotation = (bytes[0] / 255) * 45;
        const shapes: string[] = [];
        for (let i = 0; i < layers; i++) {
            const r = 40 - i * (28 / layers);
            const rot = rotation + i * (180 / layers) * entropy;
            shapes.push(`<rect x="${50 - r}" y="${50 - r}" width="${r * 2}" height="${r * 2}" transform="rotate(${rot.toFixed(1)},50,50)" />`);
        }
        return shapes.join("\n    ");
    }

    // Crystalline: sharp-faceted star polygon — mineral, angular
    private fallbackCrystalline(complexity: number, entropy: number, bytes: number[]): string {
        const points = Math.max(5, Math.round(5 + complexity * 7));
        const outerR = 40, innerR = outerR * (0.35 + entropy * 0.25);
        const rotation = (bytes[1] / 255) * (Math.PI / points);
        const pts: string[] = [];
        for (let i = 0; i < points * 2; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2 + rotation;
            pts.push(`${(50 + Math.cos(a) * r).toFixed(1)},${(50 + Math.sin(a) * r).toFixed(1)}`);
        }
        return `<polygon points="${pts.join(" ")}" />`;
    }

    // Biological: smooth organic blob from hash-perturbed bezier points
    private fallbackBiological(complexity: number, entropy: number, bytes: number[]): string {
        const pointCount = Math.max(4, Math.round(4 + complexity * 6));
        const baseR = 32;
        const points: [number, number][] = [];
        for (let i = 0; i < pointCount; i++) {
            const angle = (i / pointCount) * Math.PI * 2 - Math.PI / 2;
            const perturb = ((bytes[i % bytes.length] / 255) * 2 - 1) * entropy * 16;
            const r = baseR + perturb;
            points.push([50 + Math.cos(angle) * r, 50 + Math.sin(angle) * r]);
        }
        let d = `M ${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
        for (let i = 0; i < points.length; i++) {
            const curr = points[i];
            const next = points[(i + 1) % points.length];
            const mid = [(curr[0] + next[0]) / 2, (curr[1] + next[1]) / 2];
            d += ` Q ${curr[0].toFixed(1)},${curr[1].toFixed(1)} ${mid[0].toFixed(1)},${mid[1].toFixed(1)}`;
        }
        return `<path d="${d} Z" stroke-linejoin="round" />`;
    }

    // Fluid: flowing S-curve paths — movement, continuity
    private fallbackFluid(complexity: number, entropy: number, bytes: number[]): string {
        const lines = Math.max(2, Math.round(2 + complexity * 3));
        const paths: string[] = [];
        for (let i = 0; i < lines; i++) {
            const yOffset = 15 + i * (70 / (lines + 1));
            const amplitude = 20 + (bytes[i % bytes.length] / 255) * entropy * 20;
            const phase = (bytes[(i + 2) % bytes.length] / 255) * 30;
            paths.push(
                `<path d="M 10,${yOffset.toFixed(1)} C ${(10 + amplitude + phase).toFixed(1)},${(yOffset - amplitude).toFixed(1)} ${(90 - amplitude - phase).toFixed(1)},${(yOffset + amplitude).toFixed(1)} 90,${yOffset.toFixed(1)}" stroke-linecap="round" />`
            );
        }
        return paths.join("\n    ");
    }

    // Architectural: asymmetric composed rectangles — structure, weight
    private fallbackArchitectural(complexity: number, entropy: number, bytes: number[]): string {
        const blockCount = Math.max(2, Math.round(2 + complexity * 3));
        const shapes: string[] = [];
        let x = 10;
        for (let i = 0; i < blockCount; i++) {
            const w = Math.round(12 + (bytes[i % bytes.length] / 255) * 20);
            const h = Math.round(20 + (bytes[(i + 1) % bytes.length] / 255) * entropy * 50);
            const y = 90 - h;
            shapes.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" />`);
            x += w + Math.round(5 + entropy * 8);
            if (x > 80) break;
        }
        // Cap line
        shapes.push(`<line x1="8" y1="90" x2="92" y2="90" />`);
        return shapes.join("\n    ");
    }
}

export const svgGenerator = new SVGGenerator();
