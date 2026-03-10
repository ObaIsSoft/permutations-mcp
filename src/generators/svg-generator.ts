import { DesignGenome } from "../genome/types.js";

/**
 * SVG Biomarker Generator
 *
 * Generates a mathematically parametric SVG unique to each genome.
 * Shapes are NOT hardcoded — they are derived from ch15_biomarker values:
 *
 *   organic   → Variable-point smooth bezier polygon (complexity → num points,
 *               entropy → angular radius deviation)
 *   fractal   → Recursive nested polygon (complexity → num sides, depth from hash)
 *   monolithic → Structural P(n,r) letterform path, stroke weight from typography
 */
export class SVGGenerator {
    generateBiomarker(genome: DesignGenome): string {
        const { geometry, complexity } = genome.chromosomes.ch15_biomarker;
        const { entropy } = genome.chromosomes.ch12_signature;
        const { weight } = genome.chromosomes.ch3_type_display;
        const { hue, saturation, lightness } = genome.chromosomes.ch5_color_primary;

        let innerSVG = "";

        if (geometry === "organic") {
            innerSVG = this.buildOrganicBezier(complexity, entropy);
        } else if (geometry === "fractal") {
            innerSVG = this.buildFractalPolygon(complexity, entropy);
        } else {
            // monolithic
            innerSVG = this.buildMonolithicP(weight, complexity);
        }

        const strokeWidth = Math.max(2, Math.round(weight / 100));

        return `<svg viewBox="0 0 100 100" class="w-full h-full text-current" xmlns="http://www.w3.org/2000/svg"
  data-geometry="${geometry}"
  data-complexity="${complexity.toFixed(3)}"
  data-entropy="${entropy.toFixed(3)}"
  data-dna="${genome.dnaHash.slice(0, 8)}">
  <!-- Permutations P(n,r) Biomarker — ${geometry} / complexity=${complexity.toFixed(2)} / entropy=${entropy.toFixed(2)} -->
  <g stroke-width="${strokeWidth}" fill="none" stroke="currentColor">
    ${innerSVG}
  </g>
</svg>`;
    }

    /**
     * Organic: variable-point blob using smooth quadratic bezier
     * Points distributed around a circle, radius perturbed by entropy
     */
    private buildOrganicBezier(complexity: number, entropy: number): string {
        const pointCount = Math.max(3, Math.round(3 + complexity * 9)); // 3 → 12 points
        const baseRadius = 35;
        const radiusVariance = entropy * 20; // How much each point deviates from circle
        const cx = 50, cy = 50;

        const points: [number, number][] = [];
        for (let i = 0; i < pointCount; i++) {
            const angle = (i / pointCount) * Math.PI * 2 - Math.PI / 2;
            // Each point gets a unique radius perturbation seeded from i and entropy
            const perturbSeed = Math.sin(i * entropy * Math.PI * 7.3);
            const r = baseRadius + perturbSeed * radiusVariance;
            points.push([
                cx + Math.cos(angle) * r,
                cy + Math.sin(angle) * r,
            ]);
        }

        // Build smooth closed cubic bezier through all points
        if (points.length < 2) return "";

        let d = `M ${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
        for (let i = 0; i < points.length; i++) {
            const curr = points[i];
            const next = points[(i + 1) % points.length];
            const mid = [(curr[0] + next[0]) / 2, (curr[1] + next[1]) / 2];
            d += ` Q ${curr[0].toFixed(1)},${curr[1].toFixed(1)} ${mid[0].toFixed(1)},${mid[1].toFixed(1)}`;
        }
        d += " Z";
        return `<path d="${d}" stroke-linejoin="round" />`;
    }

    /**
     * Fractal: recursive nested polygon — sides derived from complexity,
     * layers from entropy, each layer rotated by 180/sides degrees
     */
    private buildFractalPolygon(complexity: number, entropy: number): string {
        const sides = Math.max(3, Math.round(3 + complexity * 7)); // 3 (triangle) → 10 (decagon)
        const layers = Math.max(2, Math.round(2 + entropy * 3)); // 2-5 layers
        const outerRadius = 42;
        const cx = 50, cy = 50;
        const paths: string[] = [];

        for (let layer = 0; layer < layers; layer++) {
            const r = outerRadius * (1 - (layer / layers) * 0.65);
            const rotation = (layer * Math.PI) / sides; // Rotate each layer
            const pointsArr: string[] = [];
            for (let i = 0; i < sides; i++) {
                const angle = (i / sides) * Math.PI * 2 - Math.PI / 2 + rotation;
                const px = cx + Math.cos(angle) * r;
                const py = cy + Math.sin(angle) * r;
                pointsArr.push(`${px.toFixed(1)},${py.toFixed(1)}`);
            }
            paths.push(`<polygon points="${pointsArr.join(" ")}" opacity="${(1 - layer * 0.15).toFixed(2)}" />`);
        }
        return paths.join("\n    ");
    }

    /**
     * Monolithic: draws the mathematical P(n,r) letterform structurally.
     * The vertical stem height is driven by complexity.
     * The bowl radius is driven by entropy.
     * Stroke weight from type weight chromosome.
     */
    private buildMonolithicP(weight: number, complexity: number): string {
        const stemX = 25;
        const stemTop = 8;
        const stemBottom = 92;
        const bowlTop = stemTop;
        const bowlMid = stemTop + (stemBottom - stemTop) * (0.3 + complexity * 0.2);
        const bowlRight = 75 + complexity * 10; // Bowl extends further for higher complexity
        const bowlCx = bowlRight - 5;
        const bowlCy = (bowlTop + bowlMid) / 2;

        return [
            // Vertical stem
            `<line x1="${stemX}" y1="${stemTop}" x2="${stemX}" y2="${stemBottom}" stroke-linecap="square" />`,
            // Top horizontal serif
            `<line x1="${stemX - 6}" y1="${stemTop}" x2="${stemX + 6}" y2="${stemTop}" stroke-linecap="square" />`,
            // Bottom horizontal serif
            `<line x1="${stemX - 6}" y1="${stemBottom}" x2="${stemX + 6}" y2="${stemBottom}" stroke-linecap="square" />`,
            // Bowl arc (top of the P)
            `<path d="M ${stemX},${bowlTop} C ${stemX + 10},${bowlTop} ${bowlCx},${bowlTop + 5} ${bowlCx},${bowlCy} C ${bowlCx},${bowlMid - 5} ${stemX + 10},${bowlMid} ${stemX},${bowlMid}" stroke-linecap="square" />`,
            // Crossbar (midline where bowl meets stem)
            `<line x1="${stemX}" y1="${bowlMid}" x2="${stemX + 15}" y2="${bowlMid}" stroke-linecap="square" />`,
        ].join("\n    ");
    }
}
