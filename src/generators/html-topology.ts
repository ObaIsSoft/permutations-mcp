import { DesignGenome } from "../genome/types.js";

/**
 * HTML Topology Generator
 * Generates layout section structure from the genome's topology and trait values.
 * ALL four topology types emit distinct section structures.
 * Forbidden/required patterns actively modify the output.
 */
export class HTMLTopologyGenerator {
    generateTopology(genome: DesignGenome) {
        const { topology, maxNesting } = genome.chromosomes.ch1_structure;
        const { logic: gridLogic, asymmetry } = genome.chromosomes.ch9_grid;
        const { density } = genome.chromosomes.ch2_rhythm;
        const { depth } = genome.chromosomes.ch10_hierarchy;
        const traits = genome.traits;
        const forbidden = genome.constraints.forbiddenPatterns;
        const required = genome.constraints.requiredPatterns;

        let sections: any[] = [];

        // ------------------------------------------------------------------
        // Topology: FLAT — Dashboards, SaaS tools, high-density data UIs
        // Characteristics: sticky header, modular cards, sidebar possible
        // ------------------------------------------------------------------
        if (topology === "flat") {
            const hasSidebar = traits.informationDensity > 0.7;
            sections = [
                {
                    type: "topbar",
                    sticky: true,
                    compact: density === "maximal" || density === "airtight",
                    showBreadcrumb: traits.informationDensity > 0.8,
                    hasSearch: traits.informationDensity > 0.6,
                },
                ...(hasSidebar ? [{
                    type: "sidebar",
                    collapsible: true,
                    width: asymmetry > 1.0 ? "240px" : "320px",
                    navItems: Math.floor(traits.informationDensity * 10) + 4,
                }] : []),
                {
                    type: "main_grid",
                    columns: density === "maximal" ? "auto-fit, minmax(200px, 1fr)" : "auto-fit, minmax(300px, 1fr)",
                    cardStyle: forbidden.includes("rounded_cards") ? "sharp" : "default",
                    showFilters: traits.temporalUrgency > 0.6,
                    showMetrics: traits.informationDensity > 0.7,
                },
                {
                    type: "status_bar",
                    fixed: "bottom",
                    showLogs: traits.informationDensity > 0.8,
                },
            ];
        }

        // ------------------------------------------------------------------
        // Topology: DEEP — Editorial, long-form reading, documentation
        // Characteristics: narrow centered column, sticky ToC, generous space
        // ------------------------------------------------------------------
        else if (topology === "deep") {
            const maxWidth = traits.informationDensity < 0.4 ? "65ch" : "80ch";
            sections = [
                {
                    type: "reading_header",
                    minimalNav: true,
                    showProgress: traits.temporalUrgency < 0.4,
                },
                {
                    type: "toc",
                    sticky: true,
                    side: asymmetry > 1.0 ? "right" : "left",
                    depth: maxNesting,
                    floating: depth === "overlapping",
                },
                {
                    type: "article",
                    maxWidth,
                    centered: true,
                    dropCaps: traits.emotionalTemperature > 0.5,
                    pullQuotes: traits.playfulness > 0.5,
                    sidenotes: traits.informationDensity > 0.5,
                },
                ...(forbidden.includes("large_hero_images") ? [] : [{
                    type: "hero_image",
                    fullWidth: false,
                    maxWidth: "100%",
                    caption: true,
                }]),
                {
                    type: "related_content",
                    layout: "horizontal",
                    count: 3,
                },
            ];
        }

        // ------------------------------------------------------------------
        // Topology: RADIAL — Orbital/hub designs, portfolio showcases, spatial
        // Characteristics: central hub element, orbiting nodes, z-depth layers
        // ------------------------------------------------------------------
        else if (topology === "radial") {
            const orbitCount = Math.max(2, Math.floor(traits.informationDensity * maxNesting * 3));
            sections = [
                {
                    type: "radial_hub",
                    central: {
                        type: "identity_core",
                        size: traits.spatialDependency > 0.6 ? "large" : "medium",
                        rotate: traits.playfulness > 0.5,
                    },
                    orbits: Array.from({ length: orbitCount }, (_, i) => ({
                        radius: `${(i + 1) * Math.round(120 / orbitCount)}px`,
                        items: Math.max(2, Math.round(maxNesting - i)),
                        speed: traits.playfulness > 0.6 ? `${20 + i * 10}s` : "none",
                    })),
                    depth: traits.spatialDependency > 0.5 ? "3d" : "2d",
                },
                {
                    type: "satellite_panels",
                    count: orbitCount,
                    expandable: true,
                    cardStyle: forbidden.includes("rounded_cards") ? "sharp" : "orbital",
                },
                {
                    type: "footer",
                    minimal: traits.informationDensity < 0.5,
                },
            ];
        }

        // ------------------------------------------------------------------
        // Topology: GRAPH — Network/portfolio, case studies, complex navigation
        // Characteristics: node connections, non-linear flow, linkages
        // ------------------------------------------------------------------
        else if (topology === "graph") {
            const nodeCount = Math.floor(traits.informationDensity * asymmetry * 8) + 3;
            sections = [
                {
                    type: "network_canvas",
                    nodes: nodeCount,
                    edges: Math.floor(nodeCount * traits.informationDensity * 1.5),
                    layout: asymmetry > 1.2 ? "force-directed" : "hierarchical",
                    interactive: traits.temporalUrgency < 0.7,
                    zoomable: traits.spatialDependency > 0.3,
                    labelDensity: density,
                },
                {
                    type: "node_detail_panel",
                    slide: true,
                    maxWidth: "40%",
                    showMetadata: traits.informationDensity > 0.5,
                },
                {
                    type: "filter_toolbar",
                    sticky: true,
                    categorical: traits.informationDensity > 0.6,
                    temporal: traits.temporalUrgency > 0.5,
                },
            ];
        }

        // Apply constraint modifiers (forbidden/required patterns)
        sections = this.applyConstraints(sections, forbidden, required, traits);

        return {
            topology,
            gridType: gridLogic,
            maxNesting,
            sections,
            forbidden,
            required,
            reasoning: this.buildReasoning(topology, traits),
        };
    }

    private applyConstraints(
        sections: any[],
        forbidden: string[],
        required: string[],
        traits: { temporalUrgency: number; informationDensity: number; playfulness: number }
    ): any[] {
        return sections.map(section => {
            const modified = { ...section };

            // Forbidden: scroll animations → disable motion on section
            if (forbidden.includes("scroll_animations")) {
                modified.scrollAnimation = false;
                modified.parallax = false;
            }

            // Forbidden: parallax → disable parallax
            if (forbidden.includes("parallax")) {
                modified.parallax = false;
            }

            // Forbidden: large_hero_images → forces compact hero
            if (forbidden.includes("large_hero_images") && section.type === "hero_image") {
                modified.compact = true;
                modified.maxHeight = "200px";
            }

            // Required: high_contrast_text → force high contrast on headings
            if (required.includes("high_contrast_text")) {
                modified.headingContrast = "enforce";
            }

            // Required: tabular_numerals → enforce tabular number rendering
            if (required.includes("tabular_numerals")) {
                modified.numberStyle = "tabular";
            }

            // Required: compact_base_spacing → override spacious layouts
            if (required.includes("compact_base_spacing")) {
                modified.spacing = "compact";
            }

            return modified;
        });
    }

    private buildReasoning(topology: string, traits: { informationDensity: number; temporalUrgency: number; spatialDependency: number; playfulness: number }): string {
        const reasons: string[] = [];
        if (topology === "flat") reasons.push(`High density ${traits.informationDensity.toFixed(2)} → flat modular cards`);
        if (topology === "deep") reasons.push(`Low urgency ${traits.temporalUrgency.toFixed(2)} + long-form → deep reading topology`);
        if (topology === "radial") reasons.push(`High spatial ${traits.spatialDependency.toFixed(2)} → orbital/hub layout`);
        if (topology === "graph") reasons.push(`Playful ${traits.playfulness.toFixed(2)} + spatial → network/graph structure`);
        return reasons.join(" | ") || "Default topology selected from hash";
    }
}
