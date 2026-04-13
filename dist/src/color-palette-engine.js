/**
 * Color Palette Engine
 *
 * Generates full OKLCH palettes with named harmony rules — like coolors.co but
 * deterministic from the genome SHA-256 chain.
 *
 * Philosophy: the genome picks a harmony RULE that defines relationships between
 * all palette colors. Not "primary + offset by 30°" — a named rule with a reason.
 *
 * Output: 5 colors always, up to 7 on high entropy. Every color has an OKLCH
 * value, an HSL fallback, a natural name, and usage hints for the generators.
 */
import { EntropyPool } from "./genome/entropy-pool.js";
// ── Natural color name vocabulary ─────────────────────────────────────────────
// Mapped from OKLCH hue + lightness zone — LLM-style naming without an LLM
const HUE_NAMES = [
    { hMin: 0, hMax: 15, lDark: "garnet", lMid: "crimson", lLight: "blush" },
    { hMin: 15, hMax: 40, lDark: "ember", lMid: "coral", lLight: "peach" },
    { hMin: 40, hMax: 65, lDark: "amber", lMid: "gold", lLight: "cream" },
    { hMin: 65, hMax: 100, lDark: "olive", lMid: "chartreuse", lLight: "mint" },
    { hMin: 100, hMax: 145, lDark: "forest", lMid: "sage", lLight: "moss" },
    { hMin: 145, hMax: 180, lDark: "teal", lMid: "seafoam", lLight: "aqua" },
    { hMin: 180, hMax: 220, lDark: "ocean", lMid: "azure", lLight: "mist" },
    { hMin: 220, hMax: 260, lDark: "navy", lMid: "cobalt", lLight: "periwinkle" },
    { hMin: 260, hMax: 300, lDark: "violet", lMid: "iris", lLight: "lavender" },
    { hMin: 300, hMax: 340, lDark: "plum", lMid: "mauve", lLight: "rose" },
    { hMin: 340, hMax: 360, lDark: "maroon", lMid: "berry", lLight: "blush" },
];
const NEUTRAL_NAMES = ["coal", "slate", "stone", "pewter", "ash", "dove", "pearl", "ghost", "chalk", "snow"];
function nameFromOklch(l, c, h) {
    // Low chroma = neutral
    if (c < 0.04) {
        const idx = Math.min(NEUTRAL_NAMES.length - 1, Math.floor(l * NEUTRAL_NAMES.length));
        return NEUTRAL_NAMES[idx];
    }
    // Normalize hue to 0-360
    const hue = ((h % 360) + 360) % 360;
    const entry = HUE_NAMES.find(e => hue >= e.hMin && hue < e.hMax) ?? HUE_NAMES[0];
    if (l < 0.35)
        return entry.lDark;
    if (l < 0.65)
        return entry.lMid;
    return entry.lLight;
}
// ── OKLCH → HSL conversion (for fallback) ────────────────────────────────────
function oklchToRgb(l, c, h) {
    // OKLCH → OKLab
    const hRad = (h * Math.PI) / 180;
    const a = c * Math.cos(hRad);
    const bVal = c * Math.sin(hRad);
    // OKLab → LMS (using the standard OKLAB matrix)
    const l_ = l + 0.3963377774 * a + 0.2158037573 * bVal;
    const m_ = l - 0.1055613458 * a - 0.0638541728 * bVal;
    const s_ = l - 0.0894841775 * a - 1.2914855480 * bVal;
    const lms = l_ ** 3;
    const mms = m_ ** 3;
    const sms = s_ ** 3;
    // LMS → linear sRGB
    const lr = 4.0767416621 * lms - 3.3077115913 * mms + 0.2309699292 * sms;
    const lg = -1.2684380046 * lms + 2.6097574011 * mms - 0.3413193965 * sms;
    const lb = -0.0041960863 * lms - 0.7034186147 * mms + 1.7076147010 * sms;
    // Clamp and gamma-compress
    const gamma = (x) => x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(Math.max(0, x), 1 / 2.4) - 0.055;
    return {
        r: Math.round(Math.min(255, Math.max(0, gamma(lr) * 255))),
        g: Math.round(Math.min(255, Math.max(0, gamma(lg) * 255))),
        b: Math.round(Math.min(255, Math.max(0, gamma(lb) * 255))),
    };
}
function rgbToHex(r, g, b) {
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
function oklchToHex(l, c, h) {
    const { r, g, b } = oklchToRgb(l, c, h);
    return rgbToHex(r, g, b);
}
// ── Palette color constructor ─────────────────────────────────────────────────
function makeColor(l, c, h, role, usageHints) {
    // Clamp OKLCH values to valid ranges
    l = Math.max(0.05, Math.min(0.98, l));
    c = Math.max(0, Math.min(0.4, c));
    h = ((h % 360) + 360) % 360;
    return {
        name: nameFromOklch(l, c, h),
        oklch: { l, c, h },
        hex: oklchToHex(l, c, h),
        role,
        usageHints,
    };
}
// ── Harmony rule generators ───────────────────────────────────────────────────
function buildMonochromatic(baseH, baseC, _pool, offset) {
    const lightnessSteps = [0.15, 0.35, 0.55, 0.75, 0.90];
    const roles = ["background", "primary", "secondary", "surface", "neutral"];
    const hints = [["page bg"], ["headlines, CTAs"], ["subheads, icons"], ["card surfaces"], ["borders, labels"]];
    return lightnessSteps.map((l, i) => makeColor(l, baseC * (1 - i * 0.12), baseH, roles[i], hints[i]));
}
function buildAnalogousTight(baseH, baseC, _pool, _offset) {
    // Primary ±15°, ±30° on the color wheel
    const hues = [baseH, baseH + 15, baseH - 15, baseH + 30, baseH - 30];
    const lightnesses = [0.45, 0.55, 0.55, 0.85, 0.92];
    const sats = [baseC, baseC * 0.9, baseC * 0.9, baseC * 0.5, baseC * 0.2];
    const roles = ["primary", "secondary", "accent", "surface", "background"];
    const hints = [["CTAs, headlines"], ["subheads"], ["highlights"], ["cards"], ["page bg"]];
    return hues.map((h, i) => makeColor(lightnesses[i], sats[i], h, roles[i], hints[i]));
}
function buildAnalogousWide(baseH, baseC, _pool, _offset) {
    const hues = [baseH, baseH + 30, baseH - 30, baseH + 60, baseH - 60];
    const lightnesses = [0.45, 0.52, 0.52, 0.80, 0.14];
    const sats = [baseC, baseC * 0.85, baseC * 0.85, baseC * 0.4, baseC * 0.6];
    const roles = ["primary", "secondary", "accent", "neutral", "background"];
    const hints = [["CTAs"], ["subheads"], ["highlights"], ["muted text"], ["page bg"]];
    return hues.map((h, i) => makeColor(lightnesses[i], sats[i], h, roles[i], hints[i]));
}
function buildComplementary(baseH, baseC, _pool, _offset) {
    const compH = baseH + 180;
    return [
        makeColor(0.45, baseC, baseH, "primary", ["CTAs, headlines"]),
        makeColor(0.55, baseC * 0.85, compH, "accent", ["highlights, hover states"]),
        makeColor(0.88, baseC * 0.15, baseH, "surface", ["card backgrounds"]),
        makeColor(0.35, baseC * 0.1, baseH, "neutral", ["muted text, borders"]),
        makeColor(0.96, baseC * 0.05, baseH, "background", ["page background"]),
    ];
}
function buildSplitComplementary(baseH, baseC, _pool, _offset) {
    return [
        makeColor(0.45, baseC, baseH, "primary", ["CTAs, headlines"]),
        makeColor(0.55, baseC * 0.8, baseH + 150, "secondary", ["subheads, icons"]),
        makeColor(0.55, baseC * 0.8, baseH + 210, "accent", ["highlights"]),
        makeColor(0.85, baseC * 0.12, baseH, "surface", ["cards"]),
        makeColor(0.97, baseC * 0.04, baseH, "background", ["page bg"]),
    ];
}
function buildTriadic(baseH, baseC, _pool, _offset) {
    return [
        makeColor(0.45, baseC, baseH, "primary", ["CTAs, headlines"]),
        makeColor(0.52, baseC * 0.85, baseH + 120, "secondary", ["subheads"]),
        makeColor(0.52, baseC * 0.85, baseH + 240, "accent", ["highlights"]),
        makeColor(0.86, baseC * 0.1, baseH, "surface", ["cards"]),
        makeColor(0.14, baseC * 0.15, baseH, "background", ["page bg — dark"]),
    ];
}
function buildTetradic(baseH, baseC, pool, offset) {
    const colors = [
        makeColor(0.45, baseC, baseH, "primary", ["CTAs, headlines"]),
        makeColor(0.52, baseC * 0.8, baseH + 90, "secondary", ["subheads"]),
        makeColor(0.52, baseC * 0.8, baseH + 180, "accent", ["highlights"]),
        makeColor(0.52, baseC * 0.8, baseH + 270, "surface", ["decorative"]),
        makeColor(0.95, baseC * 0.05, baseH, "background", ["page bg"]),
    ];
    return colors;
}
function buildDoubleComplementary(baseH, baseC, _pool, _offset) {
    return [
        makeColor(0.45, baseC, baseH, "primary", ["CTAs"]),
        makeColor(0.55, baseC * 0.85, baseH + 180, "secondary", ["alternate primary"]),
        makeColor(0.58, baseC * 0.85, baseH + 30, "accent", ["highlights"]),
        makeColor(0.55, baseC * 0.85, baseH + 210, "surface", ["decorative"]),
        makeColor(0.93, baseC * 0.06, baseH, "background", ["page bg"]),
    ];
}
function buildNeutralDominant(baseH, baseC, _pool, _offset) {
    // One strong hue + 4 near-neutral grays with hue tint
    return [
        makeColor(0.45, baseC, baseH, "primary", ["CTAs, primary actions"]),
        makeColor(0.75, 0.02, baseH, "secondary", ["muted text"]),
        makeColor(0.88, 0.015, baseH, "surface", ["cards, panels"]),
        makeColor(0.93, 0.01, baseH, "neutral", ["borders, dividers"]),
        makeColor(0.97, 0.005, baseH, "background", ["page bg"]),
    ];
}
function buildDarkAccent(baseH, baseC, _pool, _offset) {
    return [
        makeColor(0.12, 0.03, baseH, "background", ["page bg — near black"]),
        makeColor(0.18, 0.04, baseH, "surface", ["cards, panels"]),
        makeColor(0.60, baseC, baseH, "primary", ["CTAs, bright accent"]),
        makeColor(0.30, 0.02, baseH, "neutral", ["muted text, borders"]),
        makeColor(0.85, 0.01, baseH, "secondary", ["body text on dark"]),
    ];
}
function buildPastelSystem(baseH, baseC, _pool, _offset) {
    return [
        makeColor(0.82, 0.06, baseH, "primary", ["headlines, light CTAs"]),
        makeColor(0.85, 0.05, baseH + 30, "secondary", ["subheads"]),
        makeColor(0.88, 0.04, baseH + 60, "accent", ["highlights"]),
        makeColor(0.92, 0.02, baseH, "surface", ["cards"]),
        makeColor(0.97, 0.01, baseH, "background", ["page bg"]),
    ];
}
function buildNeonDark(baseH, baseC, _pool, _offset) {
    return [
        makeColor(0.10, 0.02, baseH, "background", ["page bg — near black"]),
        makeColor(0.15, 0.03, baseH, "surface", ["cards, panels"]),
        makeColor(0.70, Math.min(0.38, baseC * 1.8), baseH, "primary", ["neon primary CTA"]),
        makeColor(0.65, Math.min(0.35, baseC * 1.5), baseH + 120, "accent", ["neon accent"]),
        makeColor(0.88, 0.02, baseH, "neutral", ["body text on dark"]),
    ];
}
// ── Harmony rule catalog ───────────────────────────────────────────────────────
const HARMONY_BUILDERS = {
    monochromatic: buildMonochromatic,
    analogous_tight: buildAnalogousTight,
    analogous_wide: buildAnalogousWide,
    complementary: buildComplementary,
    split_complementary: buildSplitComplementary,
    triadic: buildTriadic,
    tetradic: buildTetradic,
    double_complementary: buildDoubleComplementary,
    neutral_dominant: buildNeutralDominant,
    dark_accent: buildDarkAccent,
    pastel_system: buildPastelSystem,
    neon_dark: buildNeonDark,
};
// ── Harmony rule eligibility (forbiddenFor logic) ────────────────────────────
export function selectHarmonyRule(entropy, isDark, physics, sector, philosophy, seed, poolOffset) {
    const all = [
        "monochromatic", "analogous_tight", "analogous_wide",
        "complementary", "split_complementary", "triadic", "tetradic",
        "double_complementary", "neutral_dominant", "dark_accent",
        "pastel_system", "neon_dark",
    ];
    const eligible = all.filter(rule => {
        // Harmony rules with entropy requirements
        if (rule === "monochromatic" && entropy > 0.70)
            return false; // too safe for chaotic
        if (rule === "triadic" && entropy < 0.40)
            return false; // too bold for conservative
        if (rule === "tetradic" && entropy < 0.50)
            return false;
        if (rule === "double_complementary" && entropy < 0.60)
            return false;
        if (rule === "neon_dark" && !["glitch", "particle"].includes(physics))
            return false;
        if (rule === "neon_dark" && entropy < 0.55)
            return false;
        if (rule === "dark_accent" && !isDark && entropy < 0.40)
            return false;
        // Pastel appropriate for specific sectors and philosophies
        if (rule === "pastel_system" && !["beauty_fashion", "education", "healthcare"].includes(sector)) {
            if (entropy > 0.55)
                return false; // bold genomes don't do pastels
        }
        // Philosophy gates
        if (rule === "neutral_dominant" && philosophy === "expressive")
            return false;
        if (rule === "neutral_dominant" && philosophy === "chaotic")
            return false;
        if (rule === "monochromatic" && philosophy === "chaotic")
            return false;
        return true;
    });
    const pool2 = new EntropyPool(seed + ":harmony");
    const idx = Math.floor(pool2.getFloat(poolOffset) * eligible.length);
    return eligible[Math.min(eligible.length - 1, idx)];
}
// ── Main palette generator ────────────────────────────────────────────────────
export function generatePalette(primaryHue, // from ch5_color_primary.hue (0-360)
primarySat, // 0-1
entropy, // from ch12_signature.entropy
isDark, physics, sector, philosophy, seed) {
    const pool = new EntropyPool(seed + ":palette");
    // Convert HSL saturation/hue to OKLCH chroma approximation
    // (rough mapping: high-sat HSL ≈ high chroma OKLCH, capped at 0.35)
    const baseC = Math.min(0.35, primarySat * 0.35);
    const baseH = primaryHue;
    const rule = selectHarmonyRule(entropy, isDark, physics, sector, philosophy, seed + ":palette", 0);
    const builder = HARMONY_BUILDERS[rule];
    let colors = builder(baseH, baseC, pool, 0);
    // On high entropy, expand to 7 colors
    if (entropy > 0.70 && colors.length === 5) {
        // Add two variant colors — tonal shift of primary and accent
        const primary = colors.find(c => c.role === "primary");
        const accent = colors.find(c => c.role === "accent");
        if (primary) {
            const variantL = primary.oklch.l < 0.5 ? primary.oklch.l + 0.25 : primary.oklch.l - 0.25;
            colors.push(makeColor(variantL, primary.oklch.c * 0.7, primary.oklch.h + 10, "surface", ["tonal variant"]));
        }
        if (accent) {
            const variantL = accent.oklch.l < 0.5 ? accent.oklch.l + 0.2 : accent.oklch.l - 0.2;
            colors.push(makeColor(variantL, accent.oklch.c * 0.6, accent.oklch.h - 15, "surface", ["accent variant"]));
        }
    }
    // Determine semantic index roles
    const bgIdx = colors.findIndex(c => c.role === "background");
    const primaryIdx = colors.findIndex(c => c.role === "primary");
    const accentIdx = colors.findIndex(c => c.role === "accent");
    const neutralIdx = colors.findIndex(c => c.role === "neutral");
    // Fallbacks — ensure all indices are valid
    const bgFallback = bgIdx >= 0 ? bgIdx : colors.length - 1;
    const primaryFallback = primaryIdx >= 0 ? primaryIdx : 0;
    const accentFallback = accentIdx >= 0 ? accentIdx : 2;
    const neutralFallback = neutralIdx >= 0 ? neutralIdx : 3;
    // "Text" index = color with highest contrast against background
    const bgL = colors[bgFallback].oklch.l;
    const textIdx = bgL < 0.5
        ? colors.reduce((best, c, i) => c.oklch.l > colors[best].oklch.l ? i : best, 0)
        : colors.reduce((best, c, i) => c.oklch.l < colors[best].oklch.l ? i : best, 0);
    return {
        rule,
        colors,
        dominant: primaryFallback,
        background: bgFallback,
        text: textIdx,
        accent: accentFallback,
        neutral: neutralFallback,
    };
}
// ── CSS generation helper ────────────────────────────────────────────────────
/**
 * Generate CSS custom properties from a ColorPalette.
 * Returns two blocks: @supports oklch and HSL fallbacks.
 */
export function generatePaletteCSS(palette) {
    const parts = [];
    // OKLCH — browsers that support it get perceptually uniform colors
    const oklchVars = palette.colors.map((c, i) => `  --palette-${i + 1}: oklch(${c.oklch.l.toFixed(3)} ${c.oklch.c.toFixed(3)} ${c.oklch.h.toFixed(1)}); /* ${c.name} — ${c.role} */`).join("\n");
    parts.push(`@supports (color: oklch(0 0 0)) {\n  :root {\n${oklchVars}\n  }\n}`);
    // HSL fallbacks for Safari 15 and older browsers
    const fallbackVars = palette.colors.map((c, i) => {
        const { r, g, b } = oklchToRgb(c.oklch.l, c.oklch.c, c.oklch.h);
        // Approximate HSL from RGB for fallback
        const [h, s, l] = rgbToHsl(r, g, b);
        return `  --palette-${i + 1}: hsl(${h.toFixed(0)}, ${(s * 100).toFixed(1)}%, ${(l * 100).toFixed(1)}%); /* ${c.name} fallback */`;
    }).join("\n");
    parts.push(`:root {\n${fallbackVars}\n}`);
    // Semantic aliases
    const bg = palette.colors[palette.background];
    const primary = palette.colors[palette.dominant];
    const accent = palette.colors[palette.accent];
    const neutral = palette.colors[palette.neutral];
    const text = palette.colors[palette.text];
    const semanticVars = [
        `  --color-bg:         var(--palette-${palette.background + 1}); /* ${bg.name} */`,
        `  --color-primary:    var(--palette-${palette.dominant + 1}); /* ${primary.name} */`,
        `  --color-accent:     var(--palette-${palette.accent + 1}); /* ${accent.name} */`,
        `  --color-neutral:    var(--palette-${palette.neutral + 1}); /* ${neutral.name} */`,
        `  --color-text:       var(--palette-${palette.text + 1}); /* ${text.name} */`,
    ].join("\n");
    // color-mix() derived variants for opacity/tint work
    const mixVars = [
        `  --color-primary-10:  color-mix(in oklch, var(--color-primary) 10%, transparent);`,
        `  --color-primary-20:  color-mix(in oklch, var(--color-primary) 20%, transparent);`,
        `  --color-primary-50:  color-mix(in oklch, var(--color-primary) 50%, transparent);`,
        `  --color-accent-10:   color-mix(in oklch, var(--color-accent) 10%, transparent);`,
        `  --color-accent-on-dark: color-mix(in oklch, var(--color-accent) 85%, white);`,
        `  --color-neutral-10:  color-mix(in oklch, var(--color-neutral) 10%, transparent);`,
        `  --color-surface:     color-mix(in oklch, var(--color-bg) 85%, var(--color-primary));`,
    ].join("\n");
    parts.push(`:root {\n/* Semantic palette aliases */\n${semanticVars}\n\n/* color-mix() derived variants */\n${mixVars}\n}`);
    return parts.join("\n\n");
}
// ── RGB → HSL helper ─────────────────────────────────────────────────────────
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min)
        return [0, 0, l];
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = 0;
    if (max === r)
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g)
        h = ((b - r) / d + 2) / 6;
    else
        h = ((r - g) / d + 4) / 6;
    return [h * 360, s, l];
}
