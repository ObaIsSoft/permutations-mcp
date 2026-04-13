/**
 * Font System Catalog
 *
 * Determines how many fonts a genome uses and which combination strategy —
 * driven by design philosophy and entropy, not hardcoded to always-3.
 *
 * Philosophy: the genome IS the designer. A minimalist designer uses 1 font
 * and lets weight variation do the work. A swiss-grid designer uses 2 carefully
 * chosen fonts. Only an expressive or editorial designer reaches for 3.
 *
 * Font count is decided FIRST. All downstream font loading, CSS vars, and
 * ch3_type_accent existence gates on this value.
 */
// ── Font count decision ────────────────────────────────────────────────────────
/**
 * Determine how many distinct fonts this genome needs.
 * This is a philosophical decision, not a default.
 */
export function deriveFontCount(philosophy, entropy, physics, sector, pool, poolOffset) {
    // Philosophy-first rules
    if (philosophy === "minimalist")
        return 1;
    if (philosophy === "swiss_grid")
        return entropy < 0.50 ? 1 : 2;
    if (philosophy === "technical")
        return physics === "none" ? 1 : 2;
    if (philosophy === "chaotic")
        return 3;
    if (philosophy === "expressive")
        return 3;
    // Standard and editorial are entropy-dependent
    if (entropy < 0.30)
        return 1;
    if (entropy > 0.65)
        return 3;
    // editorial leans toward 2-3
    if (philosophy === "editorial")
        return pool.getFloat(poolOffset) > 0.40 ? 3 : 2;
    // brand_heavy: almost always 2
    if (philosophy === "brand_heavy")
        return pool.getFloat(poolOffset) > 0.70 ? 3 : 2;
    // Default: 2
    return 2;
}
export const FONT_STRATEGY_CATALOG = [
    // ── 1-font strategies ──
    {
        strategy: "single_family_weight",
        fontCount: 1,
        anchorCharge: ["geometric", "humanist", "grotesque"], // any sans works; variable fonts common
        description: "One variable font carries all roles via font-weight axis — ultra-minimal, deliberate",
        forbiddenFor: {
            philosophies: ["expressive", "chaotic", "editorial"],
        },
    },
    // ── 2-font strategies ──
    {
        strategy: "same_charge",
        fontCount: 2,
        anchorCharge: ["geometric", "grotesque"],
        bodyCharge: ["geometric", "grotesque"],
        description: "Both fonts from same typographic charge — restrained, precise",
        forbiddenFor: {
            philosophies: ["expressive", "chaotic"],
        },
    },
    {
        strategy: "contrast_pair",
        fontCount: 2,
        anchorCharge: ["grotesque", "geometric"],
        bodyCharge: ["humanist", "transitional"],
        description: "Grotesque anchor + humanist serif body — classic editorial tension",
        forbiddenFor: {},
    },
    {
        strategy: "serif_anchor",
        fontCount: 2,
        anchorCharge: ["humanist", "transitional", "slab_serif"],
        bodyCharge: ["grotesque", "geometric"],
        description: "High-contrast serif anchor + grotesque body — luxury editorial",
        forbiddenFor: {
            philosophies: ["technical"],
        },
    },
    {
        strategy: "mono_dominant",
        fontCount: 2,
        anchorCharge: "monospace",
        bodyCharge: ["humanist", "transitional"],
        description: "Monospace anchor + humanist body — technical, developer tone",
        forbiddenFor: {
            philosophies: ["brand_heavy", "editorial"],
        },
    },
    {
        strategy: "foundry_pair",
        fontCount: 2,
        anchorCharge: ["geometric", "grotesque", "humanist", "transitional"],
        bodyCharge: ["geometric", "grotesque", "humanist", "transitional"],
        description: "Two fonts that feel like they were chosen together — brand-coherent",
        forbiddenFor: {},
    },
    // ── 3-font strategies ──
    {
        strategy: "super_family",
        fontCount: 3,
        anchorCharge: ["geometric", "grotesque", "humanist"],
        bodyCharge: ["humanist", "transitional"],
        accentCharge: "monospace",
        description: "Sans + serif + mono variants from same type family — coherent system",
        forbiddenFor: {
            philosophies: ["minimalist", "swiss_grid", "technical"],
        },
    },
    {
        strategy: "expressive_pair",
        fontCount: 3,
        anchorCharge: "expressive",
        bodyCharge: ["grotesque", "geometric", "humanist"],
        accentCharge: ["geometric", "monospace"],
        description: "Display anchor + neutral body + geometric accent — maximum personality",
        forbiddenFor: {
            philosophies: ["minimalist", "swiss_grid", "technical"],
            entropyFloor: 0.45, // needs some entropy to make sense
        },
    },
    {
        strategy: "clash",
        fontCount: 3,
        anchorCharge: "expressive",
        bodyCharge: "monospace",
        accentCharge: "slab_serif",
        description: "Deliberately mismatched — rule-breaking, entropy > 0.7 only",
        forbiddenFor: {
            philosophies: ["minimalist", "swiss_grid", "technical", "brand_heavy"],
            entropyFloor: 0.70,
        },
    },
];
// ── Strategy selector ─────────────────────────────────────────────────────────
export function selectFontStrategy(fontCount, philosophy, entropy, pool, poolOffset) {
    const eligible = FONT_STRATEGY_CATALOG.filter(entry => {
        if (entry.fontCount !== fontCount)
            return false;
        if (entry.forbiddenFor.philosophies?.includes(philosophy))
            return false;
        if (entry.forbiddenFor.entropyCeiling !== undefined && entropy > entry.forbiddenFor.entropyCeiling)
            return false;
        if (entry.forbiddenFor.entropyFloor !== undefined && entropy < entry.forbiddenFor.entropyFloor)
            return false;
        return true;
    });
    if (eligible.length === 0) {
        // Fallback: pick the first strategy that matches fontCount
        const fallback = FONT_STRATEGY_CATALOG.find(e => e.fontCount === fontCount);
        return fallback?.strategy ?? "contrast_pair";
    }
    const idx = Math.floor(pool.getFloat(poolOffset) * eligible.length);
    return eligible[Math.min(eligible.length - 1, idx)].strategy;
}
/**
 * Get the required charge for each font role given a strategy.
 * Used by the sequencer to filter the font catalog to only eligible fonts.
 */
export function getFontChargesForStrategy(strategy) {
    const entry = FONT_STRATEGY_CATALOG.find(e => e.strategy === strategy);
    if (!entry) {
        return { anchor: "grotesque", body: "humanist", accent: undefined };
    }
    return {
        anchor: entry.anchorCharge,
        body: entry.bodyCharge,
        accent: entry.accentCharge,
    };
}
// ── CSS font variables ────────────────────────────────────────────────────────
/**
 * Generate CSS custom properties for the font system.
 * When fontCount < 3, accent and body resolve to the appropriate fallback.
 */
export function generateFontSystemCSS(fontCount, anchorFamily, bodyFamily, accentFamily) {
    const anchor = `'${anchorFamily}'`;
    const body = bodyFamily ? `'${bodyFamily}'` : anchor;
    const accent = accentFamily ? `'${accentFamily}'` : (bodyFamily ? `'${bodyFamily}'` : anchor);
    return `:root {
  /* Font system — ${fontCount} font${fontCount > 1 ? "s" : ""} */
  --font-anchor: ${anchor};   /* display headlines, large statements */
  --font-body:   ${body};   /* long-form reading, UI labels */
  --font-accent: ${accent};   /* numbers, code, labels, pull quotes */
}`;
}
/**
 * Generate @font-face preload link tags for the font system.
 * Only generates preloads for unique fonts (fontCount governs how many).
 */
export function generateFontPreloads(fontCount, anchorImportUrl, bodyImportUrl, accentImportUrl) {
    const preloads = [];
    // Anchor always gets block strategy (300ms block, prevent jarring hero shift)
    // Body gets swap (immediate fallback, reflows acceptable)
    // Accent gets optional (enhancement only)
    if (anchorImportUrl && anchorImportUrl !== "none") {
        preloads.push(`<link rel="preload" as="font" href="${anchorImportUrl}" type="font/woff2" crossorigin>`);
    }
    if (fontCount >= 2 && bodyImportUrl && bodyImportUrl !== anchorImportUrl && bodyImportUrl !== "none") {
        preloads.push(`<link rel="preload" as="font" href="${bodyImportUrl}" type="font/woff2" crossorigin>`);
    }
    if (fontCount === 3 && accentImportUrl && accentImportUrl !== bodyImportUrl && accentImportUrl !== anchorImportUrl && accentImportUrl !== "none") {
        preloads.push(`<link rel="preload" as="font" href="${accentImportUrl}" type="font/woff2" crossorigin>`);
    }
    return preloads;
}
