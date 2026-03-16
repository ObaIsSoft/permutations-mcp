/**
 * CSS Styling System Catalog
 *
 * Chromosome-driven selection — mirrors animation-catalog and state-catalog.
 * Maps genome EdgeStyle, TypeCharge, complexity, and sector character
 * to the most appropriate CSS styling approach.
 *
 * Selection is deterministic given genome chromosomes — same genome always
 * produces the same recommendation.
 */

import type { EdgeStyle, TypeCharge } from "./genome/types.js";

// ── Styling paradigm taxonomy ─────────────────────────────────────────────────

export type StylingParadigm =
    | "vanilla_css"      // Plain CSS / custom properties — zero runtime
    | "css_modules"      // Scoped CSS modules — file-based encapsulation
    | "tailwind"         // Utility-first — atomic classes, purge-optimised
    | "css_in_js"        // Runtime CSS-in-JS — dynamic styles from props
    | "zero_runtime"     // Build-time CSS-in-JS — Linaria, vanilla-extract
    | "component_lib"    // Pre-built design system — Radix, shadcn, MUI
    | "sass_scss";       // Preprocessor — nesting, mixins, functions

// ── Library entry ─────────────────────────────────────────────────────────────

export interface StylingLibraryEntry {
    name: string;
    package: string;
    version: string;
    bundleSize: string;        // approx runtime cost (0kb = build-time only)
    license: "MIT" | "Apache-2.0";
    paradigm: StylingParadigm;
    description: string;       // one-line design character
    devxScore: number;         // 0–1, developer ergonomics
    installCmd: string;
    importExample: string;
    minimalExample: string;
    complexity: "any" | "low" | "medium" | "high";
    ssrSafe: boolean;          // safe for Next.js App Router / SSR
    typescript: "first-class" | "supported" | "not-needed";
    /** Which edge/type personalities this fits well */
    fitsEdge?: EdgeStyle[];
    fitsCharge?: TypeCharge[];
    fitsPersonality?: string[]; // "clinical" | "corporate" | "bold" | "expressive" | "disruptive"
}

// ── Catalog ───────────────────────────────────────────────────────────────────

export const STYLING_LIBRARY_CATALOG: StylingLibraryEntry[] = [
    // ── Vanilla / Custom Properties ──────────────────────────────────────────
    {
        name: "Vanilla CSS + Custom Properties",
        package: "none",
        version: "n/a",
        bundleSize: "0kb",
        license: "MIT",
        paradigm: "vanilla_css",
        description: "Zero-dep styling — genome CSS variables consumed directly, maximum performance",
        devxScore: 0.80,
        installCmd: "# no install required",
        importExample: `/* styles.css */\n.button { background: var(--color-primary); }`,
        minimalExample: `.card {\n  background: var(--color-surface-1);\n  border-radius: var(--radius-component);\n  font-family: var(--font-display);\n}`,
        complexity: "any",
        ssrSafe: true,
        typescript: "not-needed",
        fitsPersonality: ["clinical", "corporate"]
    },

    // ── CSS Modules ──────────────────────────────────────────────────────────
    {
        name: "CSS Modules",
        package: "none",
        version: "n/a",
        bundleSize: "0kb",
        license: "MIT",
        paradigm: "css_modules",
        description: "Locally-scoped CSS with genome token integration — no runtime, Vite/Next native",
        devxScore: 0.85,
        installCmd: "# built into Vite and Next.js",
        importExample: `import styles from './Component.module.css';`,
        minimalExample: `/* Component.module.css */\n.card {\n  background: var(--color-surface-1);\n  border-radius: var(--radius-component);\n}\n\n/* Component.tsx */\n<div className={styles.card}>`,
        complexity: "any",
        ssrSafe: true,
        typescript: "supported",
        fitsPersonality: ["clinical", "corporate", "balanced"]
    },

    // ── Tailwind CSS ─────────────────────────────────────────────────────────
    {
        name: "Tailwind CSS",
        package: "tailwindcss",
        version: "^3.4",
        bundleSize: "0kb",
        license: "MIT",
        paradigm: "tailwind",
        description: "Utility-first atomic classes — extend theme with genome tokens for zero divergence",
        devxScore: 0.92,
        installCmd: "npm i -D tailwindcss postcss autoprefixer && npx tailwindcss init -p",
        importExample: `// tailwind.config.ts\ntheme: { extend: { colors: { primary: 'var(--color-primary)' } } }`,
        minimalExample: `<div className="bg-surface-1 rounded-component font-display text-text-primary">`,
        complexity: "any",
        ssrSafe: true,
        typescript: "first-class",
        fitsPersonality: ["balanced", "bold", "expressive"],
        fitsEdge: ["sharp", "soft", "organic"]
    },

    // ── CSS-in-JS (runtime) ──────────────────────────────────────────────────
    {
        name: "styled-components",
        package: "styled-components",
        version: "^6.1",
        bundleSize: "~12kb",
        license: "MIT",
        paradigm: "css_in_js",
        description: "CSS-in-JS with genome prop interpolation — dynamic styles from chromosome values",
        devxScore: 0.82,
        installCmd: "npm i styled-components",
        importExample: `import styled from 'styled-components';`,
        minimalExample: `const Card = styled.div\`\n  background: \${p => p.theme.colors.surface1};\n  border-radius: \${p => p.theme.radius.component}px;\n\`;`,
        complexity: "medium",
        ssrSafe: true,
        typescript: "first-class",
        fitsPersonality: ["bold", "expressive"]
    },
    {
        name: "Emotion",
        package: "@emotion/react",
        version: "^11.13",
        bundleSize: "~7.9kb",
        license: "MIT",
        paradigm: "css_in_js",
        description: "Emotion CSS-in-JS — css prop + styled, lighter than styled-components, great DX",
        devxScore: 0.86,
        installCmd: "npm i @emotion/react @emotion/styled",
        importExample: `/** @jsxImportSource @emotion/react */\nimport { css } from '@emotion/react';`,
        minimalExample: `<div css={css\`\n  background: var(--color-surface-1);\n  border-radius: var(--radius-component);\n\`}>`,
        complexity: "medium",
        ssrSafe: true,
        typescript: "first-class",
        fitsPersonality: ["bold", "expressive", "disruptive"]
    },

    // ── Zero-runtime CSS-in-JS ────────────────────────────────────────────────
    {
        name: "vanilla-extract",
        package: "@vanilla-extract/css",
        version: "^1.15",
        bundleSize: "0kb",
        license: "MIT",
        paradigm: "zero_runtime",
        description: "Type-safe zero-runtime CSS — genome tokens as typed TS contracts, no style drift",
        devxScore: 0.88,
        installCmd: "npm i @vanilla-extract/css @vanilla-extract/vite-plugin",
        importExample: `import { style, createTheme } from '@vanilla-extract/css';`,
        minimalExample: `export const card = style({\n  background: vars.color.surface1,\n  borderRadius: vars.radius.component\n});`,
        complexity: "high",
        ssrSafe: true,
        typescript: "first-class",
        fitsPersonality: ["clinical", "corporate", "balanced"],
        fitsCharge: ["geometric", "grotesque", "monospace"]
    },
    {
        name: "Linaria",
        package: "@linaria/core",
        version: "^6.2",
        bundleSize: "0kb",
        license: "MIT",
        paradigm: "zero_runtime",
        description: "Zero-runtime CSS-in-JS using tagged template literals — extracted at build time",
        devxScore: 0.80,
        installCmd: "npm i @linaria/core @linaria/react @linaria/vite",
        importExample: `import { css, styled } from '@linaria/core';`,
        minimalExample: `const card = css\`\n  background: var(--color-surface-1);\n  border-radius: var(--radius-component);\n\`;`,
        complexity: "high",
        ssrSafe: true,
        typescript: "supported",
        fitsPersonality: ["balanced", "bold"]
    },

    // ── Component libraries ───────────────────────────────────────────────────
    {
        name: "shadcn/ui",
        package: "shadcn-ui",
        version: "latest",
        bundleSize: "0kb",
        license: "MIT",
        paradigm: "component_lib",
        description: "Copy-own Radix primitives + Tailwind — genome tokens override CSS vars directly",
        devxScore: 0.95,
        installCmd: "npx shadcn-ui@latest init",
        importExample: `import { Button } from '@/components/ui/button';`,
        minimalExample: `<Button variant="default" className="bg-primary text-primary-foreground">`,
        complexity: "any",
        ssrSafe: true,
        typescript: "first-class",
        fitsPersonality: ["balanced", "bold"],
        fitsEdge: ["sharp", "soft"]
    },
    {
        name: "Radix UI (headless)",
        package: "@radix-ui/react-primitive",
        version: "^2.0",
        bundleSize: "~2kb",
        license: "MIT",
        paradigm: "component_lib",
        description: "Accessible unstyled primitives — bring your own genome CSS, full design freedom",
        devxScore: 0.90,
        installCmd: "npm i @radix-ui/react-dialog @radix-ui/react-dropdown-menu ...",
        importExample: `import * as Dialog from '@radix-ui/react-dialog';`,
        minimalExample: `<Dialog.Root>\n  <Dialog.Trigger>Open</Dialog.Trigger>\n  <Dialog.Content className={styles.dialog}>...</Dialog.Content>\n</Dialog.Root>`,
        complexity: "any",
        ssrSafe: true,
        typescript: "first-class",
        fitsPersonality: ["clinical", "corporate", "balanced", "bold", "expressive", "disruptive"]
    },

    // ── SASS / SCSS ───────────────────────────────────────────────────────────
    {
        name: "SASS / SCSS",
        package: "sass",
        version: "^1.77",
        bundleSize: "0kb",
        license: "MIT",
        paradigm: "sass_scss",
        description: "SCSS with genome custom property integration — mixins, nesting, functions, zero runtime",
        devxScore: 0.78,
        installCmd: "npm i -D sass",
        importExample: `@use 'tokens' as *;\n.card { background: var(--color-surface-1); }`,
        minimalExample: `.card {\n  background: var(--color-surface-1);\n  border-radius: var(--radius-component);\n\n  &:hover {\n    background: var(--color-surface-2);\n  }\n}`,
        complexity: "any",
        ssrSafe: true,
        typescript: "not-needed",
        fitsPersonality: ["clinical", "corporate", "balanced"]
    }
];

// ── Selector ──────────────────────────────────────────────────────────────────

/**
 * Select the best-fit styling system for a given personality + edge style.
 * Returns primary recommendation + one alternative.
 */
export function selectStylingLibrary(
    personality: string,
    edgeStyle: EdgeStyle,
    complexityScore: number
): { primary: StylingLibraryEntry; alternative: StylingLibraryEntry } {
    const candidates = STYLING_LIBRARY_CATALOG.filter(lib => {
        const personalityOk = !lib.fitsPersonality || lib.fitsPersonality.includes(personality);
        const edgeOk = !lib.fitsEdge || lib.fitsEdge.includes(edgeStyle);
        const complexityOk = lib.complexity === "any" ||
            (lib.complexity === "low"    && complexityScore <= 0.35) ||
            (lib.complexity === "medium" && complexityScore > 0.25 && complexityScore <= 0.70) ||
            (lib.complexity === "high"   && complexityScore > 0.55);
        return personalityOk && edgeOk && complexityOk;
    });

    const sorted = candidates.sort((a, b) => b.devxScore - a.devxScore);
    const primary     = sorted[0] ?? STYLING_LIBRARY_CATALOG[0];
    const alternative = sorted[1] ?? STYLING_LIBRARY_CATALOG[1];

    return { primary, alternative };
}
