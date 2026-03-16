/**
 * State Management Library Catalog
 *
 * Chromosome-driven selection — mirrors animation-catalog and font-catalog.
 * Maps genome state topology (ch30_state), complexity score, and sector
 * to the most appropriate state management library.
 *
 * Selection is deterministic given genome chromosomes — same genome always
 * produces the same recommendation.
 */
// ── Catalog ───────────────────────────────────────────────────────────────────
export const STATE_LIBRARY_CATALOG = [
    // ── Local / no-library ──────────────────────────────────────────────────
    {
        name: "React Built-ins",
        package: "react",
        version: "18+",
        bundleSize: "0kb",
        license: "MIT",
        paradigm: "local",
        description: "useState + useReducer — zero extra dependencies, perfect for co-located state",
        devxScore: 0.85,
        topologies: ["local"],
        installCmd: "# already in React",
        importExample: `import { useState, useReducer, useContext } from 'react';`,
        minimalExample: `const [count, setCount] = useState(0);`,
        complexity: "low",
        reactFirst: true,
        typescript: "first-class"
    },
    // ── Context ─────────────────────────────────────────────────────────────
    {
        name: "React Context",
        package: "react",
        version: "18+",
        bundleSize: "0kb",
        license: "MIT",
        paradigm: "context",
        description: "React Context + useReducer — lifted state across a single surface, no dep",
        devxScore: 0.75,
        topologies: ["shared_context"],
        installCmd: "# already in React",
        importExample: `import { createContext, useContext, useReducer } from 'react';`,
        minimalExample: `const Ctx = createContext(null);\nconst [state, dispatch] = useReducer(reducer, init);`,
        complexity: "low",
        reactFirst: true,
        typescript: "first-class"
    },
    // ── Flux / stores ────────────────────────────────────────────────────────
    {
        name: "Zustand",
        package: "zustand",
        version: "^4.5",
        bundleSize: "~1.1kb",
        license: "MIT",
        paradigm: "flux",
        description: "Minimal bear-necessities store — flat API, no boilerplate, works outside React",
        devxScore: 0.95,
        topologies: ["reactive_store"],
        installCmd: "npm i zustand",
        importExample: `import { create } from 'zustand';`,
        minimalExample: `const useStore = create((set) => ({\n  count: 0,\n  inc: () => set((s) => ({ count: s.count + 1 }))\n}));`,
        complexity: "medium",
        reactFirst: false,
        typescript: "first-class"
    },
    {
        name: "Redux Toolkit",
        package: "@reduxjs/toolkit",
        version: "^2.2",
        bundleSize: "~18kb",
        license: "MIT",
        paradigm: "flux",
        description: "Official Redux — opinionated slice pattern, RTK Query, DevTools — for complex apps",
        devxScore: 0.78,
        topologies: ["reactive_store", "distributed"],
        installCmd: "npm i @reduxjs/toolkit react-redux",
        importExample: `import { createSlice, configureStore } from '@reduxjs/toolkit';`,
        minimalExample: `const slice = createSlice({ name: 'counter', initialState: 0,\n  reducers: { inc: (s) => s + 1 } });`,
        complexity: "high",
        reactFirst: true,
        typescript: "first-class"
    },
    // ── Reactive / signals ───────────────────────────────────────────────────
    {
        name: "Jotai",
        package: "jotai",
        version: "^2.8",
        bundleSize: "~3.2kb",
        license: "MIT",
        paradigm: "reactive",
        description: "Atomic state model — bottom-up composability, minimal re-renders, derived atoms",
        devxScore: 0.92,
        topologies: ["reactive_store", "shared_context"],
        installCmd: "npm i jotai",
        importExample: `import { atom, useAtom } from 'jotai';`,
        minimalExample: `const countAtom = atom(0);\nconst [count, setCount] = useAtom(countAtom);`,
        complexity: "medium",
        reactFirst: true,
        typescript: "first-class"
    },
    {
        name: "Valtio",
        package: "valtio",
        version: "^1.13",
        bundleSize: "~3.4kb",
        license: "MIT",
        paradigm: "reactive",
        description: "Proxy-based mutable state — write naturally, reads are automatically reactive",
        devxScore: 0.88,
        topologies: ["reactive_store"],
        installCmd: "npm i valtio",
        importExample: `import { proxy, useSnapshot } from 'valtio';`,
        minimalExample: `const state = proxy({ count: 0 });\nconst snap = useSnapshot(state);`,
        complexity: "medium",
        reactFirst: true,
        typescript: "supported"
    },
    {
        name: "MobX",
        package: "mobx",
        version: "^6.12",
        bundleSize: "~16kb",
        license: "MIT",
        paradigm: "reactive",
        description: "Observable object graph — automatic derivations, mature ecosystem, OOP-friendly",
        devxScore: 0.80,
        topologies: ["reactive_store", "distributed"],
        installCmd: "npm i mobx mobx-react-lite",
        importExample: `import { makeAutoObservable } from 'mobx';\nimport { observer } from 'mobx-react-lite';`,
        minimalExample: `class Store { count = 0; constructor() { makeAutoObservable(this); } inc() { this.count++; } }`,
        complexity: "high",
        reactFirst: false,
        typescript: "first-class"
    },
    // ── Server state ─────────────────────────────────────────────────────────
    {
        name: "TanStack Query",
        package: "@tanstack/react-query",
        version: "^5.50",
        bundleSize: "~13kb",
        license: "MIT",
        paradigm: "server",
        description: "Async state powerhouse — caching, invalidation, optimistic updates, SSR-ready",
        devxScore: 0.94,
        topologies: ["reactive_store", "distributed"],
        installCmd: "npm i @tanstack/react-query",
        importExample: `import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';`,
        minimalExample: `const { data } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });`,
        complexity: "any",
        reactFirst: true,
        typescript: "first-class"
    },
    {
        name: "SWR",
        package: "swr",
        version: "^2.2",
        bundleSize: "~4.5kb",
        license: "MIT",
        paradigm: "server",
        description: "Stale-while-revalidate — minimal API, built for Next.js patterns, auto-revalidation",
        devxScore: 0.90,
        topologies: ["reactive_store"],
        installCmd: "npm i swr",
        importExample: `import useSWR from 'swr';`,
        minimalExample: `const { data, error } = useSWR('/api/user', fetcher);`,
        complexity: "medium",
        reactFirst: true,
        typescript: "first-class"
    },
    // ── State machines ────────────────────────────────────────────────────────
    {
        name: "XState",
        package: "xstate",
        version: "^5.14",
        bundleSize: "~22kb",
        license: "MIT",
        paradigm: "machine",
        description: "Finite state machines + statecharts — predictable flows, visual debugging, actor model",
        devxScore: 0.82,
        topologies: ["reactive_store", "distributed"],
        installCmd: "npm i xstate @xstate/react",
        importExample: `import { createMachine } from 'xstate';\nimport { useMachine } from '@xstate/react';`,
        minimalExample: `const machine = createMachine({ id: 'light', initial: 'green',\n  states: { green: { on: { NEXT: 'yellow' } }, yellow: { on: { NEXT: 'red' } }, red: { on: { NEXT: 'green' } } } });`,
        complexity: "high",
        reactFirst: false,
        typescript: "first-class"
    },
    // ── Federated / cross-app ─────────────────────────────────────────────────
    {
        name: "Zustand + persist",
        package: "zustand",
        version: "^4.5",
        bundleSize: "~1.1kb",
        license: "MIT",
        paradigm: "federated",
        description: "Zustand with persist middleware — localStorage/sessionStorage synced cross-tab state",
        devxScore: 0.88,
        topologies: ["distributed", "federated"],
        installCmd: "npm i zustand",
        importExample: `import { create } from 'zustand';\nimport { persist } from 'zustand/middleware';`,
        minimalExample: `const useStore = create(persist((set) => ({ bears: 0 }), { name: 'bear-storage' }));`,
        complexity: "high",
        reactFirst: false,
        typescript: "first-class"
    }
];
// ── Selector ──────────────────────────────────────────────────────────────────
/**
 * Select the best-fit state library for a given topology + complexity.
 * Returns primary recommendation + one alternative.
 */
export function selectStateLibrary(topology, complexityScore) {
    const candidates = STATE_LIBRARY_CATALOG.filter(lib => lib.topologies.includes(topology) &&
        (lib.complexity === "any" ||
            (lib.complexity === "low" && complexityScore <= 0.35) ||
            (lib.complexity === "medium" && complexityScore > 0.25 && complexityScore <= 0.70) ||
            (lib.complexity === "high" && complexityScore > 0.55)));
    // Sort by devxScore descending
    const sorted = candidates.sort((a, b) => b.devxScore - a.devxScore);
    const primary = sorted[0] ?? STATE_LIBRARY_CATALOG[0];
    const alternative = sorted[1] ?? STATE_LIBRARY_CATALOG[1];
    return { primary, alternative };
}
