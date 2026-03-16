/**
 * Interaction Library Catalog
 *
 * Chromosome-driven scoring — no hard exclusions.
 * Covers: drag-drop, gestures, virtual scroll, keyboard, focus management.
 *
 * Multiple interaction libraries can and should be combined — this catalog
 * returns ranked recommendations + combinability hints.
 *
 * Draws from BOTH layers:
 *   L1 DesignGenome  — ch8_motion (physics), ch9_grid (logic), ch2_rhythm (density)
 *   L2 EcosystemGenome — eco_ch4_trophic, eco_ch7_population, eco_ch5_succession,
 *                        eco_ch6_adaptation, eco_ch2_energy, eco_ch12_expressiveness
 */
// ── Catalog ───────────────────────────────────────────────────────────────────
export const INTERACTION_LIBRARY_CATALOG = [
    // ── Drag & Drop ──────────────────────────────────────────────────────────
    {
        name: "@dnd-kit",
        package: "@dnd-kit/core",
        version: "^6.3",
        bundleSize: "~22kb",
        license: "MIT",
        domain: ["drag_drop"],
        description: "Accessible, modular drag-and-drop — sortable, multi-container, tree, pointer + keyboard support",
        devxScore: 0.93,
        ssrSafe: true,
        typescript: "first-class",
        installCmd: "npm i @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities",
        importExample: `import { DndContext, useDraggable, useDroppable, useSortable } from '@dnd-kit/core';`,
        minimalExample: `<DndContext onDragEnd={handleDragEnd}>\n  <SortableContext items={items}>\n    {items.map(id => <SortableItem key={id} id={id} />)}\n  </SortableContext>\n</DndContext>`,
        combinableWith: ["@use-gesture/react", "@tanstack/react-virtual", "@tanstack/react-table", "framer-motion"],
        fitsPersonality: ["balanced", "bold", "expressive", "disruptive"],
        fitsMotion: ["spring", "elastic", "inertia", "magnetic", "particle"],
        fitsSuccession: ["mid", "climax", "post-climax"],
        fitsTrophic: ["web", "cascade", "top-down"],
        fitsPopulation: ["clustered", "fractal", "stratified", "gradient"],
        fitsAdaptation: ["temporal", "gravitational", "pressure"],
        fitsEnergy: ["photosynthetic", "mixotrophic", "predatory"],
        fitsSymbiosis: ["mutualistic", "commensal"],
    },
    {
        name: "Pragmatic Drag and Drop",
        package: "@atlaskit/pragmatic-drag-and-drop",
        version: "^1.7",
        bundleSize: "~3kb",
        license: "Apache-2.0",
        domain: ["drag_drop"],
        description: "Atlassian's ultra-lightweight DnD — any tech stack, native browser APIs, no virtual DOM dependency",
        devxScore: 0.85,
        ssrSafe: true,
        typescript: "first-class",
        installCmd: "npm i @atlaskit/pragmatic-drag-and-drop",
        importExample: `import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';`,
        minimalExample: `draggable({ element: myElement });\ndropTargetForElements({ element: dropZone, onDrop: ({ source }) => console.log(source.data) });`,
        combinableWith: ["@atlaskit/pragmatic-drag-and-drop-hitbox", "@tanstack/react-virtual"],
        fitsPersonality: ["clinical", "corporate", "balanced"],
        fitsMotion: ["none", "step", "spring"],
        fitsSuccession: ["early", "mid", "climax", "post-climax"],
        fitsTrophic: ["linear", "top-down", "cascade"],
        fitsPopulation: ["uniform", "stratified", "clustered"],
        fitsAdaptation: ["pressure", "gravitational"],
        fitsEnergy: ["chemosynthetic", "mixotrophic"],
        fitsSymbiosis: ["neutral", "commensal"],
    },
    // ── Gestures ─────────────────────────────────────────────────────────────
    {
        name: "@use-gesture/react",
        package: "@use-gesture/react",
        version: "^10.3",
        bundleSize: "~7kb",
        license: "MIT",
        domain: ["gesture", "pointer"],
        description: "Hook-based gesture recognition — drag, pinch, scroll, wheel, hover, move; pairs with any animation lib",
        devxScore: 0.91,
        ssrSafe: false, // requires browser event APIs
        typescript: "first-class",
        installCmd: "npm i @use-gesture/react",
        importExample: `import { useDrag, usePinch, useScroll, useGesture } from '@use-gesture/react';`,
        minimalExample: `const bind = useDrag(({ offset: [x, y] }) => api.start({ x, y }));\n<div {...bind()} style={{ touchAction: 'none' }}>Drag me</div>`,
        combinableWith: ["@react-spring/web", "framer-motion", "@dnd-kit/core", "@floating-ui/react"],
        fitsPersonality: ["bold", "expressive", "disruptive", "balanced"],
        fitsMotion: ["spring", "elastic", "inertia", "magnetic", "particle"],
        fitsSuccession: ["mid", "climax", "post-climax", "disturbed"],
        fitsTrophic: ["web", "cascade"],
        fitsPopulation: ["fractal", "clustered", "gradient"],
        fitsAdaptation: ["temporal", "radiation", "thermal"],
        fitsEnergy: ["photosynthetic", "mixotrophic", "predatory"],
        fitsSymbiosis: ["mutualistic", "commensal"],
    },
    // ── Virtual Scroll ────────────────────────────────────────────────────────
    {
        name: "TanStack Virtual",
        package: "@tanstack/react-virtual",
        version: "^3.13",
        bundleSize: "~6kb",
        license: "MIT",
        domain: ["virtual_scroll"],
        description: "Headless virtualizer — rows, columns, grids, infinite scroll; integrates with any UI framework",
        devxScore: 0.94,
        ssrSafe: true,
        typescript: "first-class",
        installCmd: "npm i @tanstack/react-virtual",
        importExample: `import { useVirtualizer } from '@tanstack/react-virtual';`,
        minimalExample: `const rowVirtualizer = useVirtualizer({\n  count: rows.length,\n  getScrollElement: () => parentRef.current,\n  estimateSize: () => 35,\n});\n{rowVirtualizer.getVirtualItems().map(row => <div key={row.key}>...</div>)}`,
        combinableWith: ["@tanstack/react-table", "@dnd-kit/core", "recharts", "@nivo/core"],
        fitsPersonality: ["clinical", "corporate", "balanced", "bold"],
        fitsMotion: ["none", "spring", "step", "inertia"],
        fitsSuccession: ["mid", "climax", "post-climax"],
        fitsTrophic: ["linear", "bottom-up", "top-down"],
        fitsPopulation: ["uniform", "stratified", "clustered"],
        fitsAdaptation: ["pressure", "temporal", "gravitational"],
        fitsEnergy: ["chemosynthetic", "photosynthetic"],
        fitsSymbiosis: ["neutral", "commensal"],
    },
    {
        name: "Virtua",
        package: "virtua",
        version: "^0.48",
        bundleSize: "~3kb",
        license: "MIT",
        domain: ["virtual_scroll"],
        description: "Zero-config virtual list and grid — React/Vue/Solid/Svelte, smallest runtime, drop-in replacement",
        devxScore: 0.89,
        ssrSafe: true,
        typescript: "first-class",
        installCmd: "npm i virtua",
        importExample: `import { VList, VGrid } from 'virtua';`,
        minimalExample: `<VList style={{ height: '100%' }}>\n  {items.map(item => <div key={item.id}>{item.name}</div>)}\n</VList>`,
        combinableWith: ["@dnd-kit/core", "recharts"],
        fitsPersonality: ["clinical", "corporate", "balanced"],
        fitsMotion: ["none", "step", "spring"],
        fitsSuccession: ["pioneer", "early", "mid", "climax"],
        fitsTrophic: ["linear", "bottom-up"],
        fitsPopulation: ["uniform", "sparse"],
        fitsAdaptation: ["pressure", "thermal"],
        fitsEnergy: ["chemosynthetic"],
        fitsSymbiosis: ["neutral"],
    },
    // ── Keyboard ─────────────────────────────────────────────────────────────
    {
        name: "tinykeys",
        package: "tinykeys",
        version: "^3.0",
        bundleSize: "~650B",
        license: "MIT",
        domain: ["keyboard"],
        description: "650B keyboard shortcut library — chord sequences, modifier keys, cross-platform",
        devxScore: 0.90,
        ssrSafe: true,
        typescript: "first-class",
        installCmd: "npm i tinykeys",
        importExample: `import tinykeys from 'tinykeys';`,
        minimalExample: `tinykeys(window, {\n  '$mod+k': e => { e.preventDefault(); openSearch(); },\n  'g h':   () => navigate('/'),\n  'Shift+?': () => openHelp(),\n});`,
        combinableWith: ["focus-trap-react", "@ark-ui/react", "react-aria-components"],
        fitsPersonality: ["clinical", "corporate", "balanced", "bold", "expressive", "disruptive"],
        fitsMotion: ["none", "spring", "step", "glitch"],
        fitsSuccession: ["early", "mid", "climax", "post-climax"],
        fitsTrophic: ["linear", "bottom-up", "web"],
        fitsPopulation: ["sparse", "uniform", "clustered"],
        fitsAdaptation: ["temporal", "pressure"],
        fitsEnergy: ["chemosynthetic", "photosynthetic"],
        fitsSymbiosis: ["neutral", "commensal"],
    },
    {
        name: "hotkeys-js",
        package: "hotkeys-js",
        version: "^4.0",
        bundleSize: "~2kb",
        license: "MIT",
        domain: ["keyboard"],
        description: "Simple no-dependency keyboard shortcut dispatcher — scope-aware, multiple bindings per key",
        devxScore: 0.82,
        ssrSafe: true,
        typescript: "supported",
        installCmd: "npm i hotkeys-js",
        importExample: `import hotkeys from 'hotkeys-js';`,
        minimalExample: `hotkeys('ctrl+s, command+s', (e) => { e.preventDefault(); save(); });\nhotkeys('esc', 'modal', () => closeModal());`,
        combinableWith: ["focus-trap-react", "@headlessui/react"],
        fitsPersonality: ["balanced", "bold", "corporate"],
        fitsMotion: ["none", "step"],
        fitsSuccession: ["mid", "climax"],
        fitsTrophic: ["linear", "top-down"],
        fitsPopulation: ["uniform", "stratified"],
        fitsAdaptation: ["temporal"],
        fitsEnergy: ["chemosynthetic"],
        fitsSymbiosis: ["neutral"],
    },
    // ── Focus Management ─────────────────────────────────────────────────────
    {
        name: "focus-trap-react",
        package: "focus-trap-react",
        version: "^12.0",
        bundleSize: "~2kb",
        license: "MIT",
        domain: ["focus_management"],
        description: "React focus trap — modals, dialogs, drawers; keeps keyboard focus contained + restores on close",
        devxScore: 0.87,
        ssrSafe: true,
        typescript: "first-class",
        installCmd: "npm i focus-trap-react",
        importExample: `import FocusTrap from 'focus-trap-react';`,
        minimalExample: `<FocusTrap active={isOpen} focusTrapOptions={{ initialFocus: '#first-field' }}>\n  <dialog open={isOpen}>\n    <button id="first-field">Close</button>\n  </dialog>\n</FocusTrap>`,
        combinableWith: ["react-aria-components", "@ark-ui/react", "@radix-ui/react-dialog", "tinykeys"],
        fitsPersonality: ["clinical", "corporate", "balanced", "bold", "expressive", "disruptive"],
        fitsMotion: ["none", "spring", "step", "glitch", "magnetic", "inertia", "elastic", "particle"],
        fitsSuccession: ["pioneer", "early", "mid", "climax", "post-climax", "disturbed"],
        fitsTrophic: ["bottom-up", "top-down", "cascade", "web", "linear"],
        fitsPopulation: ["sparse", "clustered", "gradient", "fractal", "uniform", "stratified"],
        fitsAdaptation: ["pressure", "thermal", "temporal"],
        fitsEnergy: ["chemosynthetic", "photosynthetic", "mixotrophic"],
        fitsSymbiosis: ["mutualistic", "commensal", "neutral"],
    },
];
/**
 * Score-ranked selection — returns ALL libraries ranked by chromosome fit.
 * Caller picks as many as needed — no hard cutoff.
 */
export function selectInteractionLibraries(input) {
    function score(lib) {
        let s = lib.devxScore * 50;
        // L1
        if (lib.fitsMotion?.includes(input.motionPhysics))
            s += 15;
        // L2
        if (lib.fitsPersonality?.includes(input.personality))
            s += 20;
        if (lib.fitsSuccession?.includes(input.succession))
            s += 15;
        if (lib.fitsTrophic?.includes(input.trophic))
            s += 12;
        if (lib.fitsPopulation?.includes(input.population))
            s += 10;
        if (lib.fitsAdaptation?.includes(input.adaptation))
            s += 10;
        if (lib.fitsEnergy?.includes(input.energy))
            s += 8;
        if (lib.fitsSymbiosis?.includes(input.symbiosis))
            s += 8;
        // Context boosts
        if (input.hasFauna && lib.domain.includes("virtual_scroll"))
            s += 10;
        if (input.hasDataHeavyFauna && lib.domain.includes("drag_drop"))
            s += 15;
        if (input.hasDataHeavyFauna && lib.domain.includes("virtual_scroll"))
            s += 15;
        return s;
    }
    const ranked = [...INTERACTION_LIBRARY_CATALOG]
        .map(lib => ({ lib, score: score(lib) }))
        .sort((a, b) => b.score - a.score)
        .map(r => r.lib);
    // Primary = top overall
    const primary = ranked[0];
    // Alternative = top from a different domain than primary
    const alternative = ranked.find(lib => !lib.domain.some(d => primary.domain.includes(d))) ?? ranked[1];
    const coverageSet = new Set([
        ...primary.domain,
        ...alternative.domain,
    ]);
    return {
        primary,
        alternative,
        ranked,
        coverage: [...coverageSet],
    };
}
