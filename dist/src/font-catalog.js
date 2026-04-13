/**
 * Font Catalog Service
 *
 * Fetches full font catalogs from each provider at runtime and caches them
 * in-memory with a 24-hour TTL. selectDisplayFont/selectBodyFont in the
 * sequencer call getFonts() synchronously — the catalog is pre-warmed at
 * server startup so the first genome generation already has the full pool.
 *
 * Providers:
 *   bunny      — Bunny Fonts (mirrors Google catalog, privacy-friendly CDN)
 *   google     — Google Fonts (optional GOOGLE_FONTS_API_KEY, else public metadata)
 *   fontshare  — Fontshare (independent catalog, rich semantic tags)
 *   none       — No CDN. Font name is emitted in CSS, user loads it themselves.
 *
 * When a provider's API is unreachable, warmCache() rejects and the server
 * exits — genome generation requires a live font catalog.
 */
import { logger } from "./logger.js";
const FETCH_TIMEOUT_MS = 30_000; // Fontshare returns ~830KB; Google ~500KB
const TTL_MS = 24 * 60 * 60 * 1000;
// ── Charge → provider category tag mapping ───────────────────────────────────
//
// All providers expose broad categories only. Tags are normalized to
// lowercase-hyphen (e.g. "sans-serif", "serif", "display", "monospace").
//
// Google/Bunny: "Sans Serif" → "sans-serif", "Serif" → "serif", etc.
// Fontshare:    "Sans Serif" → "sans-serif", "Display" → "display", etc.
//
// geometric and grotesque both map to "sans-serif" — no provider exposes
// that level of distinction in their API metadata. The full sans-serif
// pool (700+ on Google, ~50 on Fontshare) still gives far more variety
// than the old hardcoded list of 15.
const CHARGE_TAGS = {
    geometric: ["sans-serif", "sans"], // google/bunny: "sans-serif" | fontshare: "sans"
    grotesque: ["sans-serif", "sans"],
    humanist: ["serif"],
    transitional: ["serif"],
    slab_serif: ["slab", "serif"], // fontshare: "slab" | google/bunny: "serif"
    monospace: ["monospace"],
    expressive: ["display"],
};
/**
 * Fonts excluded from ALL selections — overused to the point of being slop.
 * Same philosophy as forbidden hue ranges: these aren't wrong for every context,
 * but they're so ubiquitous that the anti-slop pattern detector would flag them.
 *
 * Applied at getFonts() time — removed from live API results.
 * The genome hash then picks freely from everything that remains.
 */
const SLOP_FONTS = new Set([
    "Inter", // #1 SaaS slop font — anti-slop detector explicitly blocks "Inter + blue gradient"
    "Roboto", // Google's default — 1B+ uses, instantly generic
    "Open Sans", // Second most ubiquitous, no character
    "Lato", // Overused corporate SaaS fallback
    "Noto Sans", // System default fallback — signals no font decision was made
    "Noto Serif", // Same issue as Noto Sans
]);
// "Sans Serif" → "sans-serif", "SANS_SERIF" → "sans-serif", "Display" → "display"
const normalizeCategory = (cat) => cat.trim().toLowerCase().replace(/[\s_]+/g, "-").replace(/^-|-$/g, "");
// "Serif, Display" → ["serif", "display"] — handles Fontshare composite categories
const splitCategory = (cat) => (cat ?? "sans-serif").split(/[,;]+/).map(normalizeCategory).filter(Boolean);
export class FontCatalogService {
    cache = new Map();
    inflight = new Map();
    /**
     * Pre-warm the font catalog at server startup.
     * Returns a promise that resolves when all providers are loaded.
     * Rejects if any provider fails — genome generation requires the catalog.
     */
    async warmCache(providers) {
        const loads = providers
            .filter(p => p !== "none")
            .map(p => this.load(p));
        await Promise.all(loads);
    }
    /**
     * Synchronous lookup — returns cached font names filtered by charge.
     * Throws if the catalog hasn't been loaded yet — call warmCache() at startup
     * and await the returned promises before generating genomes.
     */
    getFonts(charge, provider) {
        // "none" means no CDN — use bunny catalog for name selection
        const src = provider === "none" ? "bunny" : provider;
        const cached = this.cache.get(src);
        if (!cached || cached.fonts.length === 0) {
            // Lazy init: trigger load in background so next call may succeed
            this.load(src).catch(err => {
                // Log but don't re-throw so caller gets the proper error message below
                logger.warn(`Background load failed for ${src}`, "FontCatalog", err);
            });
            throw new Error(`Font catalog not loaded for provider "${src}" — call await fontCatalog.warmCache() before genome generation (load initiated)`);
        }
        const tags = CHARGE_TAGS[charge] ?? [];
        const filtered = cached.fonts
            .filter(f => f.tags.some(t => tags.includes(t)))
            .filter(f => !SLOP_FONTS.has(f.name));
        if (filtered.length === 0) {
            throw new Error(`No fonts found for charge "${charge}" in provider "${src}" after slop exclusion — ` +
                `check CHARGE_TAGS mapping and SLOP_FONTS list`);
        }
        return filtered.map(f => f.name);
    }
    // ── Private ───────────────────────────────────────────────────────────────
    async load(provider) {
        // Deduplicate concurrent fetches for the same provider
        if (this.inflight.has(provider))
            return this.inflight.get(provider);
        const cached = this.cache.get(provider);
        if (cached && Date.now() - cached.fetchedAt < TTL_MS)
            return cached.fonts;
        const promise = this.fetchCatalog(provider)
            .then(fonts => {
            this.cache.set(provider, { fonts, fetchedAt: Date.now() });
            this.inflight.delete(provider);
            return fonts;
        })
            .catch(err => {
            this.inflight.delete(provider);
            throw new Error(`[FontCatalog] ${provider} fetch failed: ${err.message}`);
        });
        this.inflight.set(provider, promise);
        return promise;
    }
    fetchCatalog(provider) {
        switch (provider) {
            case "fontshare": return this.fetchFontshare();
            case "google":
            case "bunny": return this.fetchGoogle(); // Bunny mirrors the Google catalog
            default: return Promise.resolve([]);
        }
    }
    async fetchFontshare() {
        // Fontshare returns its full catalog (~100 fonts) in one response.
        // The response body is ~830KB (includes designer bios, axes, feature flags)
        // so FETCH_TIMEOUT_MS must be generous. perpage is ignored by their API.
        const res = await fetch("https://api.fontshare.com/v2/fonts?page=1&perpage=200", { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
        if (!res.ok)
            throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list = data.fonts ?? data.data ?? [];
        return list
            .filter((f) => !!f.name)
            .map((f) => ({
            name: f.name,
            // Fontshare uses "Sans" (not "Sans Serif") and composite categories
            // like "Serif, Display" — split and normalize each part.
            tags: splitCategory(f.category),
        }));
    }
    async fetchGoogle() {
        // Official API with key → all metadata; public metadata endpoint → no key needed
        const apiKey = process.env.GOOGLE_FONTS_API_KEY;
        const url = apiKey
            ? `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`
            : "https://fonts.google.com/metadata/fonts";
        const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
        if (!res.ok)
            throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Official API: { items: [...] } — Public metadata: { familyMetadataList: [...] }
        const list = data.items ?? data.familyMetadataList ?? [];
        return list
            .filter((f) => !!f.family)
            .map((f) => ({
            name: f.family,
            // Normalize "Sans Serif" → "sans-serif", "SANS_SERIF" → "sans-serif"
            tags: [normalizeCategory(f.category)],
        }));
    }
}
export const fontCatalog = new FontCatalogService();
