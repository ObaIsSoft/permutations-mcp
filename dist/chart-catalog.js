/**
 * Data Visualization / Chart Library Catalog
 *
 * Chromosome-driven scoring — no hard exclusions.
 * Relevant primarily at fauna tier — complex components that render data.
 *
 * These libraries span the spectrum from declarative (Recharts, Tremor) to
 * grammar-of-graphics (Observable Plot, Nivo) to composable D3 primitives
 * (visx) to raw D3 — all valid depending on chromosome combination.
 *
 * Draws from BOTH layers:
 *   L1 DesignGenome  — ch15_biomarker (complexity), ch8_motion (physics),
 *                      ch5_color_primary (hue/sat), ch7_edge (style)
 *   L2 EcosystemGenome — eco_ch6_adaptation, eco_ch4_trophic, eco_ch5_succession,
 *                        eco_ch2_energy, eco_ch12_expressiveness
 */
// ── Catalog ───────────────────────────────────────────────────────────────────
export const CHART_LIBRARY_CATALOG = [
    // ── Declarative ──────────────────────────────────────────────────────────
    {
        name: "Recharts",
        package: "recharts",
        version: "^3.8",
        bundleSize: "~100kb",
        license: "MIT",
        approach: "declarative",
        families: ["statistical", "temporal", "compositional"],
        description: "React-first declarative charts — SVG-based, genome color vars via stroke/fill props, composable layouts",
        devxScore: 0.88,
        ssrSafe: true,
        typescript: "first-class",
        installCmd: "npm i recharts",
        importExample: `import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';`,
        minimalExample: `<ResponsiveContainer width="100%" height={300}>\n  <LineChart data={data}>\n    <Line type="monotone" dataKey="value" stroke="var(--color-primary)" />\n    <XAxis dataKey="name" />\n    <YAxis />\n    <Tooltip />\n  </LineChart>\n</ResponsiveContainer>`,
        combinableWith: ["@tanstack/react-virtual", "@tanstack/react-table", "@mantine/core", "@chakra-ui/react"],
        fitsPersonality: ["balanced", "bold", "expressive", "corporate"],
        fitsEdge: ["soft", "organic", "hand_drawn"],
        fitsMotion: ["spring", "elastic", "none"],
        fitsSuccession: ["mid", "climax", "post-climax"],
        fitsTrophic: ["bottom-up", "cascade", "web"],
        fitsAdaptation: ["temporal", "radiation", "chemical"],
        fitsEnergy: ["photosynthetic", "mixotrophic"],
        fitsBiome: ["reef", "hydrothermal", "tidal", "savanna"],
        complexityFloor: 0.35,
    },
    // ── Grammar of Graphics ───────────────────────────────────────────────────
    {
        name: "Observable Plot",
        package: "@observablehq/plot",
        version: "^0.6",
        bundleSize: "~25kb",
        license: "ISC",
        approach: "grammar",
        families: ["statistical", "temporal", "relational", "compositional"],
        description: "Grammar-of-graphics for exploratory visualization — terse mark-based API, automatic scales and axes",
        devxScore: 0.87,
        ssrSafe: true,
        typescript: "first-class",
        installCmd: "npm i @observablehq/plot",
        importExample: `import * as Plot from '@observablehq/plot';`,
        minimalExample: `const chart = Plot.plot({\n  marks: [\n    Plot.barY(data, { x: 'name', y: 'value', fill: 'var(--color-primary)' }),\n    Plot.ruleY([0])\n  ]\n});\nuseEffect(() => { containerRef.current?.append(chart); }, []);`,
        combinableWith: ["d3", "@tanstack/react-virtual", "react-aria-components"],
        fitsPersonality: ["clinical", "corporate", "balanced"],
        fitsEdge: ["sharp", "chiseled", "techno"],
        fitsMotion: ["none", "step"],
        fitsSuccession: ["climax", "post-climax"],
        fitsTrophic: ["linear", "bottom-up", "cascade"],
        fitsAdaptation: ["chemical", "pressure", "radiation"],
        fitsEnergy: ["chemosynthetic", "photosynthetic"],
        fitsBiome: ["arctic", "alpine", "steppe", "desert"],
        complexityFloor: 0.50,
    },
    // ── Composable ────────────────────────────────────────────────────────────
    {
        name: "Nivo",
        package: "@nivo/core",
        version: "^0.99",
        bundleSize: "~30kb core + per-chart",
        license: "MIT",
        approach: "composable",
        families: ["statistical", "temporal", "relational", "compositional"],
        description: "Themed, server-renderable React charts — genome tokens via theme prop, 30+ chart types, motion control",
        devxScore: 0.85,
        ssrSafe: true,
        typescript: "first-class",
        installCmd: "npm i @nivo/core @nivo/bar @nivo/line @nivo/pie",
        importExample: `import { ResponsiveBar } from '@nivo/bar';\nimport { ResponsiveLine } from '@nivo/line';`,
        minimalExample: `<ResponsiveBar\n  data={data}\n  theme={{ textColor: 'var(--color-text-primary)', fontSize: 12 }}\n  colors={{ scheme: 'nivo' }}\n  animate={true}\n  motionConfig="gentle"\n/>`,
        combinableWith: ["recharts", "@visx/visx", "@tanstack/react-table"],
        fitsPersonality: ["clinical", "balanced", "corporate", "expressive"],
        fitsEdge: ["sharp", "soft", "organic", "chiseled"],
        fitsMotion: ["spring", "none", "step", "elastic"],
        fitsSuccession: ["mid", "climax", "post-climax"],
        fitsTrophic: ["bottom-up", "web", "cascade"],
        fitsAdaptation: ["chemical", "thermal", "radiation"],
        fitsEnergy: ["photosynthetic", "chemosynthetic", "mixotrophic"],
        fitsBiome: ["urban", "boreal", "wetland", "alpine"],
        complexityFloor: 0.40,
    },
    {
        name: "Visx",
        package: "@visx/visx",
        version: "^3.12",
        bundleSize: "~50kb+",
        license: "MIT",
        approach: "composable",
        families: ["statistical", "temporal", "relational", "geospatial", "compositional", "grammar"],
        description: "D3-powered composable primitives from Airbnb — full control over every visual mark, React + D3 harmony",
        devxScore: 0.82,
        ssrSafe: true,
        typescript: "first-class",
        installCmd: "npm i @visx/visx",
        importExample: `import { BarGroup } from '@visx/shape';\nimport { scaleBand, scaleLinear } from '@visx/scale';\nimport { AxisBottom, AxisLeft } from '@visx/axis';`,
        minimalExample: `<svg width={width} height={height}>\n  <BarGroup data={data} keys={keys} xScale={xScale} yScale={yScale} color={colorScale} />\n  <AxisBottom scale={xScale} top={yMax} />\n</svg>`,
        combinableWith: ["d3", "@observablehq/plot", "@use-gesture/react", "framer-motion"],
        fitsPersonality: ["clinical", "disruptive", "bold", "expressive"],
        fitsEdge: ["sharp", "chiseled", "brutalist", "techno"],
        fitsMotion: ["none", "spring", "particle", "glitch"],
        fitsSuccession: ["climax", "post-climax"],
        fitsTrophic: ["web", "cascade", "bottom-up"],
        fitsAdaptation: ["radiation", "chemical", "pressure"],
        fitsEnergy: ["chemosynthetic", "predatory", "mixotrophic"],
        fitsBiome: ["cave", "abyssal", "volcanic", "hydrothermal"],
        complexityFloor: 0.60,
    },
    // ── Business / Dashboard ──────────────────────────────────────────────────
    {
        name: "Tremor",
        package: "@tremor/react",
        version: "^3.18",
        bundleSize: "~30kb",
        license: "Apache-2.0",
        approach: "declarative",
        families: ["statistical", "temporal", "compositional"],
        description: "Tailwind-based dashboard components — pre-composed KPI cards, sparklines, progress bars, area charts",
        devxScore: 0.83,
        ssrSafe: true,
        typescript: "first-class",
        installCmd: "npm i @tremor/react",
        importExample: `import { AreaChart, BarList, DonutChart, Card, Metric } from '@tremor/react';`,
        minimalExample: `<Card>\n  <Metric>$1,234</Metric>\n  <AreaChart data={chartData} index="date" categories={['Revenue']} colors={['blue']} />\n</Card>`,
        combinableWith: ["tailwindcss", "recharts", "@tanstack/react-table"],
        fitsPersonality: ["corporate", "balanced", "bold"],
        fitsEdge: ["sharp", "soft", "chiseled"],
        fitsMotion: ["none", "spring"],
        fitsSuccession: ["mid", "climax"],
        fitsTrophic: ["top-down", "linear"],
        fitsAdaptation: ["pressure", "temporal"],
        fitsEnergy: ["photosynthetic", "chemosynthetic"],
        fitsBiome: ["urban", "steppe", "boreal"],
        complexityFloor: 0.30,
    },
    // ── Imperative ────────────────────────────────────────────────────────────
    {
        name: "D3",
        package: "d3",
        version: "^7.9",
        bundleSize: "~45kb full, modular",
        license: "ISC",
        approach: "imperative",
        families: ["statistical", "temporal", "relational", "geospatial", "compositional", "grammar"],
        description: "The root of all web visualization — full data-join model, infinite chart types, use when nothing else fits",
        devxScore: 0.70,
        ssrSafe: true,
        typescript: "supported",
        installCmd: "npm i d3",
        importExample: `import { select, scaleLinear, axisBottom, line, area } from 'd3';`,
        minimalExample: `const svg = select('#chart').append('svg').attr('width', w).attr('height', h);\nsvg.selectAll('rect').data(data).join('rect')\n  .attr('x', d => x(d.name))\n  .attr('height', d => h - y(d.value))\n  .attr('fill', 'var(--color-primary)');`,
        combinableWith: ["@visx/visx", "@observablehq/plot", "@use-gesture/react"],
        fitsPersonality: ["clinical", "disruptive", "bold"],
        fitsEdge: ["sharp", "brutalist", "techno", "chiseled"],
        fitsMotion: ["none", "glitch", "particle"],
        fitsSuccession: ["post-climax", "climax"],
        fitsTrophic: ["web", "cascade", "bottom-up"],
        fitsAdaptation: ["radiation", "chemical", "pressure"],
        fitsEnergy: ["chemosynthetic", "predatory"],
        fitsBiome: ["abyssal", "cave", "volcanic", "hydrothermal"],
        complexityFloor: 0.70,
    },
];
/**
 * Score-ranked chart selection.
 * Complexity floor acts as a soft filter — libraries below their floor get
 * a score penalty but are never fully excluded.
 */
export function selectChartLibrary(input) {
    const chartsRecommended = input.hasFauna && input.complexityScore >= 0.30;
    function score(lib) {
        let s = lib.devxScore * 50;
        // L1 bonuses
        if (lib.fitsEdge?.includes(input.edgeStyle))
            s += 12;
        if (lib.fitsMotion?.includes(input.motionPhysics))
            s += 10;
        // L2 bonuses
        if (lib.fitsPersonality?.includes(input.personality))
            s += 20;
        if (lib.fitsSuccession?.includes(input.succession))
            s += 15;
        if (lib.fitsTrophic?.includes(input.trophic))
            s += 12;
        if (lib.fitsAdaptation?.includes(input.adaptation))
            s += 15;
        if (lib.fitsEnergy?.includes(input.energy))
            s += 8;
        if (lib.fitsBiome?.includes(input.biome))
            s += 8;
        // Complexity floor — soft penalty if genome is below the library's floor
        if (lib.complexityFloor && input.complexityScore < lib.complexityFloor) {
            s -= (lib.complexityFloor - input.complexityScore) * 40;
        }
        return s;
    }
    const ranked = [...CHART_LIBRARY_CATALOG]
        .map(lib => ({ lib, score: score(lib) }))
        .sort((a, b) => b.score - a.score);
    return {
        primary: ranked[0].lib,
        alternative: ranked[1].lib,
        also_consider: ranked.slice(2, 5).map(r => r.lib),
        chartsRecommended,
    };
}
