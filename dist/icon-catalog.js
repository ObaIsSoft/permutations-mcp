/**
 * Icon Catalog Service
 *
 * Chromosome-driven icon library selection — mirrors the font catalog pattern.
 * Maps genome visual character (edge style, type charge, sector, density) to
 * the most appropriate icon library from a diverse set.
 *
 * Libraries span the full range of visual philosophies:
 *   thin/elegant → Iconoir, Feather
 *   sharp/precise → Heroicons, Material Symbols, Tabler
 *   rounded/friendly → Lucide, Phosphor
 *   bold/assertive → Bootstrap Icons, Remix
 *   expressive/personality → Hugeicons, Solar
 *   systematic/UI-focused → Radix Icons
 *
 * Selection is deterministic given genome chromosomes — same genome always
 * produces the same icon library recommendation.
 */
export const ICON_CATALOG = [
    // ── Thin / Elegant ────────────────────────────────────────────────────────
    {
        name: "Iconoir",
        package: "iconoir",
        reactPackage: "iconoir-react",
        cdn: "https://unpkg.com/iconoir@latest/icons",
        style: "thin",
        weightVariants: ["regular"],
        count: 1500,
        license: "MIT",
        description: "Clean thin-stroke icons with architectural precision — editorial and premium feel",
        importExample: `import { Home, User } from "iconoir-react";`,
        fitsWith: {
            edgeStyles: ["soft", "sharp"],
            typeCharges: ["humanist", "transitional", "expressive"],
            sectors: ["real_estate", "travel", "beauty_fashion", "media"],
        },
    },
    {
        name: "Feather",
        package: "feather",
        reactPackage: "feather-icons-react",
        cdn: "https://unpkg.com/feather-icons@latest/dist/feather.min.js",
        style: "thin",
        weightVariants: ["regular"],
        count: 287,
        license: "MIT",
        description: "Minimal open-source icons — sparse, airy, developer-beloved simplicity",
        importExample: `import FeatherIcon from "feather-icons-react"; // <FeatherIcon icon="home" />`,
        fitsWith: {
            edgeStyles: ["soft", "sharp"],
            typeCharges: ["geometric", "grotesque"],
            sectors: ["technology", "agency"],
        },
    },
    // ── Sharp / Precise ───────────────────────────────────────────────────────
    {
        name: "Heroicons",
        package: "@heroicons/react",
        reactPackage: "@heroicons/react",
        cdn: "https://unpkg.com/@heroicons/react@latest",
        style: "sharp",
        weightVariants: ["outline", "solid", "mini", "micro"],
        count: 300,
        license: "MIT",
        description: "Tailwind's icons — crisp outlines and solid fills, system-quality precision",
        importExample: `import { HomeIcon } from "@heroicons/react/24/outline";`,
        fitsWith: {
            edgeStyles: ["sharp", "techno"],
            typeCharges: ["geometric", "grotesque"],
            sectors: ["technology", "fintech", "commerce"],
        },
    },
    {
        name: "Material Symbols",
        package: "@mui/icons-material",
        reactPackage: "@mui/icons-material",
        cdn: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined",
        style: "sharp",
        weightVariants: ["outlined", "rounded", "sharp", "variable-weight"],
        count: 2500,
        license: "Apache-2.0",
        description: "Google's variable-weight symbol system — vast coverage, systematic, scalable",
        importExample: `import HomeIcon from "@mui/icons-material/Home";`,
        fitsWith: {
            edgeStyles: ["sharp", "techno", "soft"],
            typeCharges: ["geometric", "grotesque", "monospace"],
            sectors: ["technology", "healthcare", "education", "government"],
        },
    },
    {
        name: "Tabler Icons",
        package: "@tabler/icons-react",
        reactPackage: "@tabler/icons-react",
        cdn: "https://unpkg.com/@tabler/icons@latest/icons-sprite.svg",
        style: "sharp",
        weightVariants: ["outline", "filled"],
        count: 5000,
        license: "MIT",
        description: "Massive 2px-stroke library — the most comprehensive sharp set available",
        importExample: `import { IconHome } from "@tabler/icons-react";`,
        fitsWith: {
            edgeStyles: ["sharp", "techno"],
            typeCharges: ["geometric", "grotesque", "monospace"],
            sectors: ["technology", "fintech", "manufacturing", "legal"],
        },
    },
    // ── Rounded / Friendly ────────────────────────────────────────────────────
    {
        name: "Lucide",
        package: "lucide",
        reactPackage: "lucide-react",
        cdn: "https://unpkg.com/lucide@latest",
        style: "rounded",
        weightVariants: ["regular"],
        count: 1400,
        license: "ISC",
        description: "The most beautiful rounded icon set — consistent, warm, widely used",
        importExample: `import { Home, User } from "lucide-react";`,
        fitsWith: {
            edgeStyles: ["soft", "organic"],
            typeCharges: ["humanist", "grotesque", "geometric"],
            sectors: ["healthcare", "education", "nonprofit", "food"],
        },
    },
    {
        name: "Phosphor Icons",
        package: "@phosphor-icons/core",
        reactPackage: "@phosphor-icons/react",
        cdn: "https://unpkg.com/@phosphor-icons/web@latest",
        style: "rounded",
        weightVariants: ["thin", "light", "regular", "bold", "fill", "duotone"],
        count: 1200,
        license: "MIT",
        description: "Six-weight flexible system — the most versatile rounded library, duotone capable",
        importExample: `import { House } from "@phosphor-icons/react";`,
        fitsWith: {
            edgeStyles: ["soft", "organic"],
            typeCharges: ["humanist", "transitional", "grotesque"],
            sectors: ["healthcare", "entertainment", "sports", "food", "travel"],
        },
    },
    // ── Bold / Assertive ──────────────────────────────────────────────────────
    {
        name: "Bootstrap Icons",
        package: "bootstrap-icons",
        reactPackage: "react-bootstrap-icons",
        cdn: "https://cdn.jsdelivr.net/npm/bootstrap-icons@latest/font/bootstrap-icons.css",
        style: "bold",
        weightVariants: ["regular", "filled"],
        count: 2000,
        license: "MIT",
        description: "Solid, chunky icons with strong visual weight — assertive, no-nonsense",
        importExample: `import { HouseFill } from "react-bootstrap-icons";`,
        fitsWith: {
            edgeStyles: ["sharp", "soft"],
            typeCharges: ["slab_serif", "grotesque"],
            sectors: ["commerce", "insurance", "legal", "manufacturing"],
        },
    },
    {
        name: "Remix Icon",
        package: "remixicon",
        reactPackage: "remixicon-react",
        cdn: "https://cdn.jsdelivr.net/npm/remixicon@latest/fonts/remixicon.css",
        style: "bold",
        weightVariants: ["line", "fill"],
        count: 2800,
        license: "Apache-2.0",
        description: "Dual-mode line/fill library — functional and expressive, media-native feel",
        importExample: `import HomeSmileLine from "remixicon-react/HomeSmileLine";`,
        fitsWith: {
            edgeStyles: ["soft", "sharp"],
            typeCharges: ["grotesque", "slab_serif"],
            sectors: ["media", "entertainment", "crypto_web3", "gaming"],
        },
    },
    // ── Expressive / Personality ───────────────────────────────────────────────
    {
        name: "Hugeicons",
        package: "@hugeicons/react",
        reactPackage: "@hugeicons/react",
        cdn: "https://unpkg.com/@hugeicons/core-free@latest",
        style: "expressive",
        weightVariants: ["stroke", "solid", "bulk", "duotone", "twotone"],
        count: 4000,
        license: "MIT",
        description: "Rich multi-style system — the most expressive and personality-forward library",
        importExample: `import { Home01Icon } from "@hugeicons/react";`,
        fitsWith: {
            edgeStyles: ["organic", "soft"],
            typeCharges: ["expressive", "humanist"],
            sectors: ["beauty_fashion", "entertainment", "gaming", "sports", "food"],
        },
    },
    {
        name: "Solar Icons",
        package: "@iconscout/react-unicons",
        reactPackage: "@solar-icons/react",
        cdn: "https://unpkg.com/solar-icon-set@latest",
        style: "expressive",
        weightVariants: ["outline", "bold", "broken", "linear", "line-duotone", "bold-duotone"],
        count: 7500,
        license: "MIT",
        description: "Ultra-comprehensive premium system — six weights including broken/duotone styles",
        importExample: `// Import by weight variant from solar-icon-set`,
        fitsWith: {
            edgeStyles: ["organic", "soft", "sharp"],
            typeCharges: ["expressive", "humanist", "geometric"],
            sectors: ["beauty_fashion", "real_estate", "automotive", "travel", "agency"],
        },
    },
    // ── Systematic / UI-focused ──────────────────────────────────────────────
    {
        name: "Radix Icons",
        package: "@radix-ui/react-icons",
        reactPackage: "@radix-ui/react-icons",
        cdn: "https://unpkg.com/@radix-ui/react-icons@latest",
        style: "systematic",
        weightVariants: ["regular"],
        count: 318,
        license: "MIT",
        description: "Small curated UI-component set — precise, systematic, built for design systems",
        importExample: `import { HomeIcon } from "@radix-ui/react-icons";`,
        fitsWith: {
            edgeStyles: ["sharp", "techno"],
            typeCharges: ["geometric", "monospace"],
            sectors: ["technology", "fintech"],
        },
    },
];
// ── Selection logic ──────────────────────────────────────────────────────────
/**
 * Select the best-matching icon library for a given genome.
 * Deterministic: same inputs always return same library.
 */
export function selectIconLibrary(params) {
    const { edgeStyle, typeCharge, sector, dnaHashByte } = params;
    // Score each library by chromosome fit
    const scored = ICON_CATALOG.map(lib => {
        let score = 0;
        // Edge style match — primary signal
        if (lib.fitsWith.edgeStyles.includes(edgeStyle))
            score += 3;
        // Type charge match — secondary signal
        if (lib.fitsWith.typeCharges.includes(typeCharge))
            score += 2;
        // Sector affinity — tertiary
        if (lib.fitsWith.sectors?.includes(sector))
            score += 1;
        return { lib, score };
    });
    // Sort by score descending, use dnaHashByte to break ties deterministically
    scored.sort((a, b) => {
        if (b.score !== a.score)
            return b.score - a.score;
        // Same score — use hash byte to pick consistently within the score tier
        const aIdx = ICON_CATALOG.indexOf(a.lib);
        const bIdx = ICON_CATALOG.indexOf(b.lib);
        return ((aIdx + dnaHashByte) % ICON_CATALOG.length) -
            ((bIdx + dnaHashByte) % ICON_CATALOG.length);
    });
    // Never return the same top-N without variety — ensure selection spans the catalog
    // Pick from top-3 candidates, biased by dnaHashByte
    const topCandidates = scored.slice(0, 3);
    return topCandidates[dnaHashByte % topCandidates.length].lib;
}
/**
 * Format the icon library selection as a CSS comment + import guidance block
 * for inclusion in the generated CSS output.
 */
export function formatIconLibraryNote(lib) {
    return `/* ── Icon Library ───────────────────────────────────────────
   Library  : ${lib.name}
   Style    : ${lib.style} — ${lib.description}
   Package  : ${lib.reactPackage}
   Count    : ~${lib.count.toLocaleString()} icons
   License  : ${lib.license}
   Variants : ${lib.weightVariants.join(", ")}

   Install  : npm install ${lib.reactPackage}
   Import   : ${lib.importExample}
   CDN      : ${lib.cdn}
─────────────────────────────────────────────────────────── */`;
}
