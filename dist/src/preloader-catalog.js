/**
 * Preloader Catalog
 *
 * 9 preloader types — the loading experience before the page reveals.
 * Selection driven by entropy, physics, and WebGL availability.
 * Catalog describes WHAT each preloader is. CSS/JS in preloader-engine.ts.
 */
import { ENTROPY_THRESHOLDS } from './constants';
export const PRELOADER_CATALOG = [
    {
        type: "none",
        description: "Immediate show — no loading experience.",
        forbiddenFor: {},
    },
    {
        type: "minimal_bar",
        description: "Thin progress bar at top — understated, performance-first.",
        forbiddenFor: {},
    },
    {
        type: "counter_percent",
        description: "Large 0→100% counter — the number is the performance.",
        forbiddenFor: {
            requiresPhysicsNot: ["none"],
        },
    },
    {
        type: "word_scatter",
        description: "Brand words appear scattered, then clear — narrative tension.",
        forbiddenFor: {
            requiresPhysicsNot: ["none"],
            philosophies: ["minimalist", "swiss_grid", "technical"],
            minEntropy: 0.40,
        },
    },
    {
        type: "svg_draw",
        description: "SVG path stroke-dashoffset animation — brand mark reveals.",
        forbiddenFor: {
            requiresPhysicsNot: ["none"],
            philosophies: ["minimalist"],
            minEntropy: 0.30,
        },
    },
    {
        type: "morphing_blob",
        description: "CSS blob morphs between 3 shapes — organic, alive.",
        forbiddenFor: {
            requiresPhysicsNot: ["none"],
            philosophies: ["minimalist", "swiss_grid", "technical"],
            minEntropy: 0.45,
        },
    },
    {
        type: "grid_fill",
        description: "Grid of cells fills progressively — structured emergence.",
        forbiddenFor: {
            requiresPhysicsNot: ["none"],
            minEntropy: 0.30,
        },
    },
    {
        type: "3d_scene_spin",
        description: "Three.js scene rotates as preloader — 3D as the first impression.",
        forbiddenFor: {
            requiresWebGL: true,
            requiresPhysicsNot: ["none"],
            minEntropy: 0.50,
        },
    },
    {
        type: "typewriter_name",
        description: "Company name types in then clears — name as promise.",
        forbiddenFor: {
            requiresPhysicsNot: ["none"],
            philosophies: ["minimalist", "swiss_grid"],
            minEntropy: 0.25,
        },
    },
];
// ── Selector ──────────────────────────────────────────────────────────────────
export function getPreloaderEntry(type) {
    return PRELOADER_CATALOG.find(p => p.type === type) ?? PRELOADER_CATALOG[0];
}
export function selectPreloaderType(opts) {
    const { philosophy, entropy, physics, hasWebGL } = opts;
    // entropy < 0.30 or physics:none → none or minimal_bar
    if (entropy < ENTROPY_THRESHOLDS.low || physics === "none") {
        return entropy < 0.20 ? "none" : "minimal_bar";
    }
    // minimalist always gets minimal_bar
    if (philosophy === "minimalist")
        return "minimal_bar";
    // 3d_scene_spin — highest fidelity, requires WebGL and high entropy
    if (hasWebGL && entropy > 0.50)
        return "3d_scene_spin";
    // high entropy expressive types
    if (entropy > ENTROPY_THRESHOLDS.high) {
        if (philosophy === "brand_heavy" || philosophy === "expressive")
            return "svg_draw";
        if (philosophy === "chaotic")
            return "word_scatter";
    }
    // mid entropy
    if (entropy > ENTROPY_THRESHOLDS.mid) {
        if (philosophy === "technical")
            return "counter_percent";
        return "typewriter_name";
    }
    return "minimal_bar";
}
