/**
 * Organism / Component Library Catalog
 *
 * Chromosome-driven scoring — no hard exclusions.
 * Every library is a candidate for every genome.
 * Chromosome matches add bonus points; misses don't penalise.
 *
 * Draws from BOTH layers:
 *   L1 DesignGenome  — ch7_edge, ch8_motion, ch14_physics, ch6_color_temp
 *   L2 EcosystemGenome — eco_ch1_biome, eco_ch3_symbiosis, eco_ch4_trophic,
 *                        eco_ch5_succession, eco_ch6_adaptation, eco_ch7_population,
 *                        eco_ch12_expressiveness
 *
 * Distinct from styling-catalog: that answers HOW you write CSS.
 * This answers WHICH component primitives you pull in — headless shells,
 * styled systems, or nothing at all.
 *
 * Selection deterministic — same chromosomes always produce the same ranking.
 */
// ── Catalog ───────────────────────────────────────────────────────────────────
export const ORGANISM_LIBRARY_CATALOG = [
    // ── Headless ─────────────────────────────────────────────────────────────
    {
        name: "React Aria Components",
        package: "react-aria-components",
        version: "^1.16",
        bundleSize: "~50kb",
        license: "Apache-2.0",
        philosophy: "headless",
        description: "Adobe's full accessible headless suite — WAI-ARIA complete, internationalized, zero style opinions",
        devxScore: 0.88,
        tiers: ["any"],
        ssrSafe: true,
        typescript: "first-class",
        installCmd: "npm i react-aria-components",
        importExample: `import { Button, Dialog, TextField } from 'react-aria-components';`,
        minimalExample: `<Button onPress={() => {}}>Click me</Button>`,
        combinableWith: ["@floating-ui/react", "tailwindcss", "@vanilla-extract/css"],
        fitsPersonality: ["clinical", "corporate", "balanced"],
        fitsEdge: ["sharp", "techno", "chiseled"],
        fitsMotion: ["none", "spring", "step"],
        fitsSuccession: ["pioneer", "early", "mid", "climax", "post-climax"],
        fitsSymbiosis: ["neutral", "commensal"],
        fitsTrophic: ["bottom-up", "linear"],
        fitsPopulation: ["uniform", "sparse"],
        fitsBiome: ["arctic", "alpine", "steppe"],
        fitsAdaptation: ["pressure", "thermal"],
    },
    {
        name: "Ark UI",
        package: "@ark-ui/react",
        version: "^5.34",
        bundleSize: "~30kb",
        license: "MIT",
        philosophy: "headless",
        description: "State-machine-powered headless components — 40+ organisms, Zag.js under the hood, framework-agnostic",
        devxScore: 0.87,
        tiers: ["flora", "fauna"],
        ssrSafe: true,
        typescript: "first-class",
        installCmd: "npm i @ark-ui/react",
        importExample: `import { Dialog, DatePicker, Select } from '@ark-ui/react';`,
        minimalExample: `<Dialog.Root>\n  <Dialog.Trigger>Open</Dialog.Trigger>\n  <Dialog.Content>Content</Dialog.Content>\n</Dialog.Root>`,
        combinableWith: ["@pandacss/dev", "@radix-ui/react-primitive", "@use-gesture/react"],
        fitsPersonality: ["balanced", "bold", "expressive"],
        fitsEdge: ["organic", "soft", "hand_drawn"],
        fitsMotion: ["spring", "elastic", "step"],
        fitsSuccession: ["mid", "climax", "post-climax"],
        fitsSymbiosis: ["mutualistic", "commensal"],
        fitsTrophic: ["cascade", "web"],
        fitsPopulation: ["clustered", "fractal"],
        fitsBiome: ["boreal", "wetland", "tidal"],
        fitsAdaptation: ["chemical", "temporal"],
    },
    {
        name: "Headless UI",
        package: "@headlessui/react",
        version: "^2.2",
        bundleSize: "~12kb",
        license: "MIT",
        philosophy: "headless",
        description: "Tailwind Labs unstyled components — designed to pair with Tailwind CSS, minimal API surface",
        devxScore: 0.83,
        tiers: ["flora", "fauna"],
        ssrSafe: true,
        typescript: "first-class",
        installCmd: "npm i @headlessui/react",
        importExample: `import { Dialog, Menu, Transition } from '@headlessui/react';`,
        minimalExample: `<Menu>\n  <Menu.Button>Options</Menu.Button>\n  <Menu.Items>\n    <Menu.Item>{({ active }) => <a className={active ? 'bg-blue' : ''}>Edit</a>}</Menu.Item>\n  </Menu.Items>\n</Menu>`,
        combinableWith: ["tailwindcss", "@dnd-kit/core", "react-aria-components"],
        fitsPersonality: ["balanced", "bold", "expressive"],
        fitsEdge: ["soft", "organic", "sharp"],
        fitsMotion: ["spring", "none"],
        fitsSuccession: ["early", "mid", "climax"],
        fitsSymbiosis: ["commensal", "neutral"],
        fitsTrophic: ["cascade", "linear", "bottom-up"],
        fitsPopulation: ["clustered", "gradient"],
        fitsBiome: ["steppe", "savanna", "urban"],
        fitsAdaptation: ["thermal", "temporal"],
    },
    {
        name: "Radix UI Primitives",
        package: "@radix-ui/react-primitive",
        version: "^2.0",
        bundleSize: "~2kb core + per-component",
        license: "MIT",
        philosophy: "headless",
        description: "Accessible unstyled primitives — each component is a separate package, tree-shakeable to zero",
        devxScore: 0.90,
        tiers: ["microbial", "flora"],
        ssrSafe: true,
        typescript: "first-class",
        installCmd: "npm i @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tooltip",
        importExample: `import * as Dialog from '@radix-ui/react-dialog';\nimport * as DropdownMenu from '@radix-ui/react-dropdown-menu';`,
        minimalExample: `<Dialog.Root>\n  <Dialog.Trigger asChild><button>Open</button></Dialog.Trigger>\n  <Dialog.Portal>\n    <Dialog.Overlay />\n    <Dialog.Content>...</Dialog.Content>\n  </Dialog.Portal>\n</Dialog.Root>`,
        combinableWith: ["@floating-ui/react", "tailwindcss", "css_modules", "@vanilla-extract/css", "@use-gesture/react"],
        fitsPersonality: ["clinical", "corporate", "balanced", "bold", "expressive", "disruptive"],
        fitsEdge: ["sharp", "soft", "organic", "techno", "brutalist", "serrated", "hand_drawn", "chiseled"],
        fitsMotion: ["none", "spring", "step", "glitch", "magnetic", "inertia", "elastic", "particle"],
        fitsSuccession: ["pioneer", "early", "mid", "climax", "post-climax", "disturbed"],
        fitsSymbiosis: ["mutualistic", "commensal", "competitive", "neutral"],
        fitsTrophic: ["bottom-up", "top-down", "cascade", "web", "linear", "detrital"],
        fitsPopulation: ["sparse", "clustered", "gradient", "fractal", "uniform", "stratified"],
        fitsBiome: ["arctic", "alpine", "steppe", "urban", "boreal", "savanna", "desert", "abyssal", "tidal", "volcanic", "rainforest", "cave", "hydrothermal", "wetland", "reef", "mangrove"],
        fitsAdaptation: ["thermal", "pressure", "chemical", "radiation", "temporal", "gravitational"],
    },
    // ── Positioning ──────────────────────────────────────────────────────────
    {
        name: "Floating UI",
        package: "@floating-ui/react",
        version: "^0.27",
        bundleSize: "~10kb",
        license: "MIT",
        philosophy: "positioning",
        description: "Collision-aware positioning for tooltips, popovers, menus — the layer all headless libs build on",
        devxScore: 0.89,
        tiers: ["flora", "fauna", "positioning"],
        ssrSafe: true,
        typescript: "first-class",
        installCmd: "npm i @floating-ui/react",
        importExample: `import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/react';`,
        minimalExample: `const { refs, floatingStyles } = useFloating({\n  middleware: [offset(10), flip(), shift()],\n  whileElementsMounted: autoUpdate,\n});\n<div ref={refs.setReference}>Trigger</div>\n<div ref={refs.setFloating} style={floatingStyles}>Tooltip</div>`,
        combinableWith: ["react-aria-components", "@radix-ui/react-primitive", "@ark-ui/react", "@headlessui/react", "@chakra-ui/react"],
        fitsPersonality: ["clinical", "corporate", "balanced", "bold", "expressive", "disruptive"],
        fitsEdge: ["sharp", "soft", "organic", "techno", "brutalist", "serrated", "hand_drawn", "chiseled"],
        fitsMotion: ["none", "spring", "step", "glitch", "magnetic", "inertia", "elastic", "particle"],
        fitsSuccession: ["pioneer", "early", "mid", "climax", "post-climax", "disturbed"],
        fitsSymbiosis: ["mutualistic", "commensal", "competitive", "neutral", "allelopathic"],
        fitsTrophic: ["bottom-up", "top-down", "cascade", "web", "linear", "detrital"],
        fitsPopulation: ["sparse", "clustered", "gradient", "fractal", "uniform", "stratified"],
        fitsBiome: ["cave", "abyssal", "tidal", "urban", "wetland", "mangrove", "reef"],
        fitsAdaptation: ["thermal", "pressure", "chemical", "radiation", "temporal", "gravitational"],
    },
    // ── Styled ────────────────────────────────────────────────────────────────
    {
        name: "Radix Themes",
        package: "@radix-ui/themes",
        version: "^3.3",
        bundleSize: "~50kb",
        license: "MIT",
        philosophy: "styled",
        description: "Pre-styled Radix components with CSS custom properties — override genome tokens directly in :root",
        devxScore: 0.85,
        tiers: ["any"],
        ssrSafe: true,
        typescript: "first-class",
        installCmd: "npm i @radix-ui/themes",
        importExample: `import { Theme, Button, Card, Flex } from '@radix-ui/themes';\nimport '@radix-ui/themes/styles.css';`,
        minimalExample: `<Theme accentColor="blue" radius="medium" scaling="100%">\n  <Card><Flex gap="2"><Button>Action</Button></Flex></Card>\n</Theme>`,
        combinableWith: ["@radix-ui/react-primitive", "tailwindcss", "@use-gesture/react", "@tanstack/react-virtual"],
        fitsPersonality: ["balanced", "bold", "corporate"],
        fitsEdge: ["soft", "sharp", "chiseled"],
        fitsMotion: ["spring", "none", "step"],
        fitsSuccession: ["mid", "climax"],
        fitsSymbiosis: ["mutualistic", "commensal"],
        fitsTrophic: ["top-down", "cascade"],
        fitsPopulation: ["uniform", "clustered"],
        fitsBiome: ["urban", "boreal", "steppe", "alpine"],
        fitsAdaptation: ["pressure", "gravitational"],
    },
    {
        name: "Mantine",
        package: "@mantine/core",
        version: "^8.3",
        bundleSize: "~200kb",
        license: "MIT",
        philosophy: "styled",
        description: "Full-featured React component library — 100+ components, genome CSS variable integration, built-in theming",
        devxScore: 0.88,
        tiers: ["any"],
        ssrSafe: true,
        typescript: "first-class",
        installCmd: "npm i @mantine/core @mantine/hooks",
        importExample: `import { Button, Modal, TextInput, MantineProvider } from '@mantine/core';`,
        minimalExample: `<MantineProvider theme={{ primaryColor: 'blue' }}>\n  <Button variant="filled">Click</Button>\n  <TextInput label="Name" placeholder="Enter name" />\n</MantineProvider>`,
        combinableWith: ["@mantine/hooks", "@mantine/notifications", "@mantine/dates", "@tanstack/react-virtual", "@dnd-kit/core"],
        fitsPersonality: ["balanced", "expressive", "bold"],
        fitsEdge: ["soft", "organic", "hand_drawn", "techno"],
        fitsMotion: ["spring", "elastic", "inertia"],
        fitsSuccession: ["climax", "post-climax"],
        fitsSymbiosis: ["mutualistic"],
        fitsTrophic: ["web", "cascade", "bottom-up"],
        fitsPopulation: ["stratified", "clustered", "gradient"],
        fitsBiome: ["rainforest", "reef", "hydrothermal", "wetland"],
        fitsAdaptation: ["chemical", "radiation", "temporal"],
    },
    {
        name: "Chakra UI",
        package: "@chakra-ui/react",
        version: "^3.34",
        bundleSize: "~120kb",
        license: "MIT",
        philosophy: "styled",
        description: "Design-token native components — genome CSS variables map directly to Chakra's token system",
        devxScore: 0.85,
        tiers: ["any"],
        ssrSafe: true,
        typescript: "first-class",
        installCmd: "npm i @chakra-ui/react",
        importExample: `import { Button, Box, Text, ChakraProvider } from '@chakra-ui/react';`,
        minimalExample: `<ChakraProvider>\n  <Box p="4" bg="gray.100"><Text fontSize="xl">Hello</Text></Box>\n</ChakraProvider>`,
        combinableWith: ["@chakra-ui/icons", "@use-gesture/react", "@tanstack/react-virtual", "recharts"],
        fitsPersonality: ["balanced", "expressive", "bold"],
        fitsEdge: ["soft", "organic", "techno"],
        fitsMotion: ["spring", "elastic", "step"],
        fitsSuccession: ["mid", "climax", "post-climax"],
        fitsSymbiosis: ["mutualistic", "commensal"],
        fitsTrophic: ["cascade", "web", "top-down"],
        fitsPopulation: ["clustered", "gradient", "fractal"],
        fitsBiome: ["tidal", "hydrothermal", "wetland", "reef"],
        fitsAdaptation: ["thermal", "radiation", "temporal"],
    },
    {
        name: "daisyUI",
        package: "daisyui",
        version: "^5.5",
        bundleSize: "0kb runtime",
        license: "MIT",
        philosophy: "styled",
        description: "Tailwind CSS plugin — semantic component classes with CSS variable theming, zero JS runtime",
        devxScore: 0.87,
        tiers: ["any"],
        ssrSafe: true,
        typescript: "not-needed",
        installCmd: "npm i -D daisyui",
        importExample: `// tailwind.config.ts\nplugins: [require('daisyui')],\ndaisyui: { themes: ['light', 'dark'] }`,
        minimalExample: `<button class="btn btn-primary">Click</button>\n<div class="card"><div class="card-body"><h2 class="card-title">Card</h2></div></div>`,
        combinableWith: ["tailwindcss", "@headlessui/react", "@floating-ui/react", "@dnd-kit/core"],
        fitsPersonality: ["bold", "expressive", "disruptive", "balanced"],
        fitsEdge: ["organic", "soft", "hand_drawn", "serrated"],
        fitsMotion: ["none", "step"],
        fitsSuccession: ["pioneer", "early", "mid", "climax", "disturbed"],
        fitsSymbiosis: ["commensal", "neutral", "competitive"],
        fitsTrophic: ["bottom-up", "cascade"],
        fitsPopulation: ["clustered", "stratified", "gradient"],
        fitsBiome: ["reef", "savanna", "hydrothermal", "volcanic", "mangrove"],
        fitsAdaptation: ["radiation", "chemical", "temporal"],
    },
    // ── Primitive ─────────────────────────────────────────────────────────────
    {
        name: "Vanilla Primitives",
        package: "none",
        version: "n/a",
        bundleSize: "0kb",
        license: "MIT",
        philosophy: "primitive",
        description: "Raw HTML + ARIA — zero dependencies, full control, genome CSS variables consumed directly",
        devxScore: 0.75,
        tiers: ["any"],
        ssrSafe: true,
        typescript: "first-class",
        installCmd: "# no install required",
        importExample: `// No import — native HTML with genome CSS variables`,
        minimalExample: `<button\n  role="button"\n  aria-pressed="false"\n  style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-component)' }}\n>Click</button>`,
        combinableWith: ["@floating-ui/react", "tinykeys", "focus-trap-react", "@tanstack/react-virtual", "@dnd-kit/core"],
        fitsPersonality: ["clinical", "corporate", "disruptive"],
        fitsEdge: ["sharp", "brutalist", "chiseled", "techno"],
        fitsMotion: ["none", "glitch"],
        fitsSuccession: ["pioneer", "early", "disturbed"],
        fitsSymbiosis: ["allelopathic", "neutral", "competitive"],
        fitsTrophic: ["linear", "bottom-up"],
        fitsPopulation: ["sparse", "uniform"],
        fitsBiome: ["arctic", "desert", "abyssal", "cave"],
        fitsAdaptation: ["pressure", "thermal"],
    },
];
/**
 * Score-ranked selection — chromosome matches add bonuses, nothing is excluded.
 * Same chromosomes always produce the same ranking.
 */
export function selectOrganismLibrary(input) {
    function score(lib) {
        let s = lib.devxScore * 50; // 0–50 base from devx quality
        // L1 bonuses (design genome)
        if (lib.fitsEdge?.includes(input.edgeStyle))
            s += 15;
        if (lib.fitsMotion?.includes(input.motionPhysics))
            s += 10;
        // L2 bonuses (ecosystem genome)
        if (lib.fitsPersonality?.includes(input.personality))
            s += 20;
        if (lib.fitsSuccession?.includes(input.succession))
            s += 15;
        if (lib.fitsSymbiosis?.includes(input.symbiosis))
            s += 10;
        if (lib.fitsTrophic?.includes(input.trophic))
            s += 10;
        if (lib.fitsPopulation?.includes(input.population))
            s += 10;
        if (lib.fitsBiome?.includes(input.biome))
            s += 10;
        if (lib.fitsAdaptation?.includes(input.adaptation))
            s += 10;
        // Tier relevance
        const hasFaunaBonus = input.hasFauna &&
            (lib.tiers.includes("fauna") || lib.tiers.includes("any"));
        if (hasFaunaBonus)
            s += 5;
        return s;
    }
    const ranked = [...ORGANISM_LIBRARY_CATALOG]
        .map(lib => ({ lib, score: score(lib) }))
        .sort((a, b) => b.score - a.score);
    return {
        primary: ranked[0].lib,
        alternative: ranked[1].lib,
        also_consider: ranked.slice(2, 5).map(r => r.lib),
    };
}
