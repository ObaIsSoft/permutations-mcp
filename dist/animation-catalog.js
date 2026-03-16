/**
 * Animation Library Catalog
 *
 * Chromosome-driven animation library selection — mirrors font-catalog and icon-catalog.
 * Maps genome motion character (physics, choreography, atmosphere, sector, complexity)
 * to the most appropriate animation library from a diverse ecosystem.
 *
 * Libraries span the full range of animation philosophies:
 *   css/declarative  → Animate.css, Motion One
 *   spring/physics   → Framer Motion, react-spring, Popmotion
 *   timeline/orchestration → GSAP, Anime.js, Theatre.js
 *   scroll-driven    → AOS, ScrollReveal, Lottie
 *   gesture/interactive → Framer Motion, use-gesture
 *   3d/webgl         → Three.js + GSAP, Theatre.js
 *
 * Selection is deterministic given genome chromosomes — same genome always
 * produces the same animation library recommendation.
 */
export const ANIMATION_CATALOG = [
    // ── CSS / Declarative ─────────────────────────────────────────────────────
    {
        name: "Animate.css",
        package: "animate.css",
        cdn: "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css",
        style: "css",
        bundleSize: "~78kb",
        license: "MIT",
        description: "80+ ready-to-use CSS animations via class names — zero JS, instant integration",
        choreography: ["snappy", "energetic"],
        importExample: `import "animate.css";`,
        usageExample: `<div class="animate__animated animate__fadeInUp">...</div>`,
        fitsWith: {
            physics: ["none", "step"],
            sectors: ["education", "nonprofit", "healthcare", "commerce"],
            complexity: "low",
        },
        deps: [],
    },
    {
        name: "Motion One",
        package: "motion",
        reactPackage: "motion",
        cdn: "https://cdn.jsdelivr.net/npm/motion@latest/dist/motion.js",
        style: "css",
        bundleSize: "~3.8kb",
        license: "MIT",
        description: "Web Animations API wrapper — standards-based, near-zero bundle cost, hardware accelerated",
        choreography: ["smooth", "snappy", "elegant"],
        importExample: `import { animate, inView, scroll } from "motion";`,
        usageExample: `animate(".card", { opacity: [0, 1], y: [20, 0] }, { duration: 0.4, easing: [0.25, 0.1, 0.25, 1] });`,
        fitsWith: {
            physics: ["none", "step"],
            sectors: ["technology", "fintech", "agency"],
            complexity: "any",
        },
        deps: [],
    },
    {
        name: "Hover.css",
        package: "hover.css",
        cdn: "https://cdnjs.cloudflare.com/ajax/libs/hover.css/2.3.1/css/hover-min.css",
        style: "css",
        bundleSize: "~20kb",
        license: "MIT",
        description: "CSS hover effect collection — 100+ effects, pure CSS micro-interactions",
        choreography: ["smooth", "elegant"],
        importExample: `import "hover.css";`,
        usageExample: `<button class="hvr-grow">Hover me</button>`,
        fitsWith: {
            physics: ["none"],
            sectors: ["beauty_fashion", "media", "travel", "real_estate"],
            complexity: "low",
        },
        deps: [],
    },
    // ── Spring / Physics ──────────────────────────────────────────────────────
    {
        name: "Framer Motion",
        package: "framer-motion",
        reactPackage: "framer-motion",
        cdn: "https://cdn.jsdelivr.net/npm/framer-motion@latest/dist/framer-motion.js",
        style: "spring",
        bundleSize: "~50kb",
        license: "MIT",
        description: "React-first production-grade animation — spring physics, gesture recognition, layout animation",
        choreography: ["elegant", "smooth", "energetic"],
        importExample: `import { motion, AnimatePresence } from "framer-motion";`,
        usageExample: `<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} />`,
        fitsWith: {
            physics: ["spring"],
            sectors: ["technology", "saas", "agency", "fintech", "crypto_web3"],
            complexity: "any",
        },
        deps: ["react"],
    },
    {
        name: "react-spring",
        package: "@react-spring/web",
        reactPackage: "@react-spring/web",
        cdn: "https://cdn.jsdelivr.net/npm/@react-spring/web@latest",
        style: "spring",
        bundleSize: "~40kb",
        license: "MIT",
        description: "Headless physics spring system — interpolates any value, framework-agnostic logic",
        choreography: ["smooth", "elegant", "snappy"],
        importExample: `import { useSpring, animated } from "@react-spring/web";`,
        usageExample: `const springs = useSpring({ from: { opacity: 0 }, to: { opacity: 1 }, config: { tension: 280, friction: 60 } });`,
        fitsWith: {
            physics: ["spring"],
            sectors: ["technology", "gaming", "entertainment", "sports"],
            complexity: "any",
        },
        deps: ["react"],
    },
    {
        name: "Popmotion",
        package: "popmotion",
        cdn: "https://cdn.jsdelivr.net/npm/popmotion@latest",
        style: "spring",
        bundleSize: "~12kb",
        license: "MIT",
        description: "Low-level animation primitives — tween, spring, decay; the engine under Framer Motion",
        choreography: ["snappy", "smooth"],
        importExample: `import { spring, animate } from "popmotion";`,
        usageExample: `spring({ from: 0, to: 100, stiffness: 300, damping: 20 }).start(v => el.style.transform = \`translateY(\${v}px)\`);`,
        fitsWith: {
            physics: ["spring"],
            sectors: ["technology", "fintech"],
            complexity: "any",
        },
        deps: [],
    },
    // ── Timeline / Orchestration ──────────────────────────────────────────────
    {
        name: "GSAP",
        package: "gsap",
        cdn: "https://cdn.jsdelivr.net/npm/gsap@latest/dist/gsap.min.js",
        style: "timeline",
        bundleSize: "~30kb core + plugins",
        license: "commercial",
        description: "Industry-standard animation platform — ScrollTrigger, SplitText, MorphSVG; the professional choice",
        choreography: ["dramatic", "elegant", "energetic", "smooth"],
        importExample: `import gsap from "gsap"; import { ScrollTrigger } from "gsap/ScrollTrigger";`,
        usageExample: `gsap.timeline().from(".hero", { opacity: 0, y: 60, duration: 1, ease: "power3.out" }).from(".nav", { opacity: 0, duration: 0.4 }, "-=0.6");`,
        fitsWith: {
            physics: ["glitch", "spring", "step", "none"],
            sectors: ["agency", "entertainment", "gaming", "beauty_fashion", "automotive", "media"],
            complexity: "high",
        },
        deps: [],
    },
    {
        name: "Anime.js",
        package: "animejs",
        cdn: "https://cdn.jsdelivr.net/npm/animejs@latest/lib/anime.min.js",
        style: "timeline",
        bundleSize: "~17kb",
        license: "MIT",
        description: "Lightweight timeline orchestrator — SVG morphing, path animation, stagger control",
        choreography: ["elegant", "smooth", "dramatic"],
        importExample: `import anime from "animejs";`,
        usageExample: `anime.timeline({ easing: "easeOutExpo" }).add({ targets: ".element", translateX: 250, duration: 800 }).add({ targets: ".element", scale: 2, duration: 800 }, "-=600");`,
        fitsWith: {
            physics: ["step", "glitch", "none"],
            sectors: ["agency", "media", "education", "nonprofit"],
            complexity: "any",
        },
        deps: [],
    },
    {
        name: "Theatre.js",
        package: "@theatre/core",
        reactPackage: "@theatre/react",
        cdn: "https://cdn.jsdelivr.net/npm/@theatre/core@latest",
        style: "timeline",
        bundleSize: "~100kb",
        license: "MIT",
        description: "Professional animation studio tooling — visual editor, sequencer, Three.js integration",
        choreography: ["dramatic", "elegant"],
        importExample: `import { getProject, types } from "@theatre/core";`,
        usageExample: `const project = getProject("MyProject"); const sheet = project.sheet("Main"); const obj = sheet.object("Box", { x: types.number(0) });`,
        fitsWith: {
            physics: ["glitch", "spring"],
            sectors: ["agency", "entertainment", "automotive", "gaming"],
            complexity: "high",
        },
        deps: [],
    },
    // ── Scroll-driven ─────────────────────────────────────────────────────────
    {
        name: "AOS",
        package: "aos",
        cdn: "https://cdn.jsdelivr.net/npm/aos@latest/dist/aos.css",
        style: "scroll",
        bundleSize: "~13kb",
        license: "MIT",
        description: "Animate on scroll — dead-simple data-attribute API, 20+ preset animations",
        choreography: ["smooth", "snappy"],
        importExample: `import AOS from "aos"; import "aos/dist/aos.css"; AOS.init();`,
        usageExample: `<div data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">...</div>`,
        fitsWith: {
            physics: ["none", "step"],
            sectors: ["education", "healthcare", "nonprofit", "real_estate", "hospitality"],
            complexity: "low",
        },
        deps: [],
    },
    {
        name: "ScrollReveal",
        package: "scrollreveal",
        cdn: "https://cdn.jsdelivr.net/npm/scrollreveal@latest/dist/scrollreveal.min.js",
        style: "scroll",
        bundleSize: "~5kb",
        license: "commercial",
        description: "Minimal scroll reveal with clean configuration API — easy, flexible, lightweight",
        choreography: ["smooth", "elegant"],
        importExample: `import ScrollReveal from "scrollreveal";`,
        usageExample: `ScrollReveal().reveal(".section", { distance: "30px", origin: "bottom", duration: 800, interval: 100 });`,
        fitsWith: {
            physics: ["none"],
            sectors: ["real_estate", "hospitality", "travel", "beauty_fashion"],
            complexity: "low",
        },
        deps: [],
    },
    {
        name: "Auto-Animate",
        package: "@formkit/auto-animate",
        reactPackage: "@formkit/auto-animate",
        cdn: "https://cdn.jsdelivr.net/npm/@formkit/auto-animate@latest",
        style: "scroll",
        bundleSize: "~2.3kb",
        license: "MIT",
        description: "Zero-config list/DOM transition animations — add/remove/reorder with one line",
        choreography: ["smooth", "snappy"],
        importExample: `import autoAnimate from "@formkit/auto-animate";`,
        usageExample: `const parent = useRef(null); useAutoAnimate(parent); // done — all child changes animate automatically`,
        fitsWith: {
            physics: ["none", "spring"],
            sectors: ["technology", "saas", "healthcare", "education"],
            complexity: "any",
        },
        deps: [],
    },
    // ── Lottie / Rich Illustration ────────────────────────────────────────────
    {
        name: "Lottie Web",
        package: "lottie-web",
        reactPackage: "@lottiefiles/react-lottie-player",
        cdn: "https://cdn.jsdelivr.net/npm/lottie-web@latest/build/player/lottie.min.js",
        style: "lottie",
        bundleSize: "~260kb / ~58kb light",
        license: "MIT",
        description: "After Effects JSON animation playback — complex illustration animation, brand storytelling",
        choreography: ["elegant", "dramatic", "smooth"],
        importExample: `import Lottie from "@lottiefiles/react-lottie-player";`,
        usageExample: `<Player autoplay loop src="https://assets.lottiefiles.com/animation.json" style={{ height: "300px" }} />`,
        fitsWith: {
            physics: ["none", "spring"],
            sectors: ["healthcare", "fintech", "education", "entertainment", "saas"],
            complexity: "any",
        },
        deps: [],
    },
    // ── 3D / WebGL ────────────────────────────────────────────────────────────
    {
        name: "Three.js",
        package: "three",
        reactPackage: "@react-three/fiber",
        cdn: "https://cdn.jsdelivr.net/npm/three@latest/build/three.min.js",
        style: "3d",
        bundleSize: "~160kb",
        license: "MIT",
        description: "WebGL 3D scene graph — the foundation for spatial/immersive web experiences",
        choreography: ["dramatic", "elegant"],
        importExample: `import * as THREE from "three"; // or: import { Canvas } from "@react-three/fiber";`,
        usageExample: `const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: 0x3b82f6 })); scene.add(mesh);`,
        fitsWith: {
            physics: ["spring", "glitch"],
            sectors: ["automotive", "gaming", "agency", "entertainment", "crypto_web3"],
            complexity: "high",
        },
        deps: [],
    },
    {
        name: "use-gesture",
        package: "@use-gesture/react",
        reactPackage: "@use-gesture/react",
        cdn: "https://cdn.jsdelivr.net/npm/@use-gesture/react@latest",
        style: "gesture",
        bundleSize: "~15kb",
        license: "MIT",
        description: "Pointer/touch/scroll/drag gesture bindings — pairs with react-spring or Framer Motion",
        choreography: ["energetic", "snappy", "smooth"],
        importExample: `import { useDrag, useScroll } from "@use-gesture/react";`,
        usageExample: `const bind = useDrag(({ offset: [x, y] }) => api.start({ x, y })); return <animated.div {...bind()} style={springs} />;`,
        fitsWith: {
            physics: ["spring"],
            sectors: ["gaming", "entertainment", "sports", "crypto_web3"],
            complexity: "high",
        },
        deps: ["react"],
    },
];
// ── Selection logic ───────────────────────────────────────────────────────────
/**
 * Select the best-matching animation library for a given genome.
 * Deterministic: same inputs always return same library.
 */
export function selectAnimationLibrary(params) {
    const { physics, choreographyStyle, sector, complexity, dnaHashByte } = params;
    const scored = ANIMATION_CATALOG.map(lib => {
        let score = 0;
        // Physics match — primary signal
        if (lib.fitsWith.physics.includes(physics))
            score += 4;
        // Choreography match — secondary signal
        if (lib.choreography.includes(choreographyStyle))
            score += 2;
        // Sector affinity — tertiary
        if (lib.fitsWith.sectors?.includes(sector))
            score += 1;
        // Complexity match
        if (lib.fitsWith.complexity === "any")
            score += 1;
        else if (lib.fitsWith.complexity === "high" && complexity >= 0.57)
            score += 1;
        else if (lib.fitsWith.complexity === "low" && complexity < 0.34)
            score += 1;
        return { lib, score };
    });
    // Sort by score, use dnaHashByte to break ties
    scored.sort((a, b) => {
        if (b.score !== a.score)
            return b.score - a.score;
        const aIdx = ANIMATION_CATALOG.indexOf(a.lib);
        const bIdx = ANIMATION_CATALOG.indexOf(b.lib);
        return ((aIdx + dnaHashByte) % ANIMATION_CATALOG.length) -
            ((bIdx + dnaHashByte) % ANIMATION_CATALOG.length);
    });
    // Pick from top-3, biased by dnaHashByte for variety
    const topCandidates = scored.slice(0, 3);
    return topCandidates[dnaHashByte % topCandidates.length].lib;
}
/**
 * Format the animation library selection as a CSS comment block
 * for inclusion in the generated CSS output.
 */
export function formatAnimationLibraryNote(lib) {
    return `/* ── Animation Library ───────────────────────────────────────
   Library  : ${lib.name}
   Style    : ${lib.style} — ${lib.description}
   Package  : ${lib.package}${lib.reactPackage && lib.reactPackage !== lib.package ? `\n   React    : ${lib.reactPackage}` : ""}
   Size     : ${lib.bundleSize}
   License  : ${lib.license}
   Timing   : ${lib.choreography.join(", ")}

   Install  : npm install ${lib.reactPackage ?? lib.package}
   Import   : ${lib.importExample}

   Usage    :
   ${lib.usageExample}
   CDN      : ${lib.cdn}
─────────────────────────────────────────────────────────── */`;
}
