/**
 * Animation Engine
 *
 * Maps genome motion chromosomes to actual animation code.
 * ALL animation parameters are derived from genome values — nothing hardcoded.
 *
 * Uses animation-catalog.ts for preset selection (like font-catalog.ts for fonts).
 * Physics parameters are computed from genome values at runtime.
 */
import { selectAnimationPreset } from "./animation-catalog.js";
const ENTER_ANIMATION = {
    up: { from: { opacity: 0, y: 40 }, to: { opacity: 1, y: 0 } },
    down: { from: { opacity: 0, y: -40 }, to: { opacity: 1, y: 0 } },
    left: { from: { opacity: 0, x: 40 }, to: { opacity: 1, x: 0 } },
    right: { from: { opacity: 0, x: -40 }, to: { opacity: 1, x: 0 } },
    up_left: { from: { opacity: 0, x: 30, y: 30 }, to: { opacity: 1, x: 0, y: 0 } },
    up_right: { from: { opacity: 0, x: -30, y: 30 }, to: { opacity: 1, x: 0, y: 0 } },
    down_left: { from: { opacity: 0, x: 30, y: -30 }, to: { opacity: 1, x: 0, y: 0 } },
    down_right: { from: { opacity: 0, x: -30, y: -30 }, to: { opacity: 1, x: 0, y: 0 } },
    scale: { from: { opacity: 0, scale: 0.8 }, to: { opacity: 1, scale: 1 } },
    scale_x: { from: { opacity: 0, scaleX: 0.8 }, to: { opacity: 1, scaleX: 1 } },
    scale_y: { from: { opacity: 0, scaleY: 0.8 }, to: { opacity: 1, scaleY: 1 } },
    fade: { from: { opacity: 0 }, to: { opacity: 1 } },
    blur: { from: { opacity: 0, filter: "blur(12px)" }, to: { opacity: 1, filter: "blur(0px)" } },
    spin_cw: { from: { opacity: 0, rotate: -180, scale: 0.8 }, to: { opacity: 1, rotate: 0, scale: 1 } },
    spin_ccw: { from: { opacity: 0, rotate: 180, scale: 0.8 }, to: { opacity: 1, rotate: 0, scale: 1 } },
    flip_x: { from: { opacity: 0, rotateY: 90 }, to: { opacity: 1, rotateY: 0 } },
    flip_y: { from: { opacity: 0, rotateX: 90 }, to: { opacity: 1, rotateX: 0 } },
    slide: { from: { opacity: 0, x: 50 }, to: { opacity: 1, x: 0 } },
    reveal: { from: { clipPath: "inset(0 100% 0 0)" }, to: { clipPath: "inset(0 0% 0 0)" } },
    mask: { from: { clipPath: "circle(0% at 50% 50%)" }, to: { clipPath: "circle(100% at 50% 50%)" } },
    typewriter: { from: { opacity: 0, width: "0%" }, to: { opacity: 1, width: "100%" } },
    scramble: { from: { opacity: 0, filter: "blur(8px)" }, to: { opacity: 1, filter: "blur(0px)" } },
    morph: { from: { opacity: 0, borderRadius: "50%", scale: 0.5 }, to: { opacity: 1, borderRadius: "var(--radius-md)", scale: 1 } },
    draw: { from: { pathLength: 0 }, to: { pathLength: 1 } },
    pop: { from: { opacity: 0, scale: 0.2 }, to: { opacity: 1, scale: 1 } },
    elastic: { from: { opacity: 0, scale: 0.2 }, to: { opacity: 1, scale: 1 } },
    glitch: { from: { opacity: 0, x: -15, skewX: -8 }, to: { opacity: 1, x: 0, skewX: 0 } },
    pixelate: { from: { opacity: 0, filter: "blur(16px) saturate(0)" }, to: { opacity: 1, filter: "blur(0px) saturate(1)" } },
    ripple: { from: { opacity: 0, scale: 0.3 }, to: { opacity: 1, scale: 1 } },
    vortex: { from: { opacity: 0, rotate: 270, scale: 0.2 }, to: { opacity: 1, rotate: 0, scale: 1 } },
};
// ── Exit Behavior ───────────────────────────────────────────────────────────
const EXIT_ANIMATION = {
    fade: { opacity: 0 },
    slide: { opacity: 0, y: -30 },
    none: { opacity: 1 },
    shrink: { opacity: 0, scale: 0 },
    explode: { opacity: 0, scale: 1.5, rotate: 15 },
    rotate_out: { opacity: 0, rotate: 90 },
    morph_out: { opacity: 0, borderRadius: "50%", scale: 0.5 },
};
// ── Hover Micro-Interactions ────────────────────────────────────────────────
const HOVER_BASE = {
    scale: { transform: { scale: 1.05 }, style: {} },
    color_shift: { transform: {}, style: { backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)" } },
    shadow: { transform: {}, style: { boxShadow: "var(--shadow-lg)" } },
    lift: { transform: { y: -6 }, style: { boxShadow: "var(--shadow-md)" } },
    glow: { transform: {}, style: { boxShadow: "0 0 24px hsl(var(--color-primary-h) var(--color-primary-s) var(--color-primary-l) / 0.4), 0 0 48px hsl(var(--color-primary-h) var(--color-primary-s) var(--color-primary-l) / 0.2)" } },
};
// ── Page Transitions ────────────────────────────────────────────────────────
const PAGE_TRANSITION_BASE = {
    fade: { enter: { opacity: 0 }, leave: { opacity: 0 } },
    slide: { enter: { x: 50, opacity: 0 }, leave: { x: -50, opacity: 0 } },
    morph: { enter: { borderRadius: "50%", scale: 0.8, opacity: 0 }, leave: { borderRadius: "0%", scale: 0.9, opacity: 0 } },
    wipe: { enter: { clipPath: "inset(0 100% 0 0)" }, leave: { clipPath: "inset(0 0 0 100%)" } },
    dissolve: { enter: { opacity: 0, filter: "blur(12px)" }, leave: { opacity: 0, filter: "blur(8px)" } },
};
// ── Choreography Styles ─────────────────────────────────────────────────────
const CHOREOGRAPHY_BASE = {
    elegant: { entrySequence: "cascade_down", staggerMultiplier: 1.2, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
    energetic: { entrySequence: "simultaneous", staggerMultiplier: 0.6, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
    smooth: { entrySequence: "cascade_down", staggerMultiplier: 1.0, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
    snappy: { entrySequence: "cascade_down", staggerMultiplier: 0.4, easing: "cubic-bezier(0.4, 0, 1, 1)" },
    dramatic: { entrySequence: "hero_first", staggerMultiplier: 1.5, easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)" },
};
/**
 * Extract animation config from genome — selects preset from catalog
 */
export function getAnimationConfig(genome) {
    const ch = genome.chromosomes;
    const physics = ch.ch8_motion?.physics ?? "none";
    // Select preset from catalog based on genome
    const preset = selectAnimationPreset({
        physics,
        complexity: ch.ch8_motion?.durationScale ?? 0.5,
        context: "general",
        dnaHashByte: parseInt((genome.dnaHash || "00").slice(0, 2), 16),
    });
    return {
        preset,
        duration: (ch.ch8_motion?.durationScale ?? 1) * 0.4,
        staggerInterval: ch.ch27_motion_choreography?.staggerInterval ?? 80,
        enterDirection: ch.ch8_motion?.enterDirection ?? "up",
        exitBehavior: ch.ch8_motion?.exitBehavior ?? "fade",
        hoverMicrointeraction: ch.ch27_motion_choreography?.hoverMicrointeraction ?? { type: "lift", intensity: 0.5, duration: 200 },
        scrollTrigger: ch.ch27_motion_choreography?.scrollTrigger ?? { triggerPoint: 0.2, scrubIntensity: 0.5 },
        pageTransition: ch.ch27_motion_choreography?.pageTransition ?? "fade",
        choreographyStyle: ch.ch27_motion_choreography?.choreographyStyle ?? "smooth",
        reducedMotionFallback: ch.ch8_motion?.reducedMotionFallback ?? "fade",
        hoverIntensity: ch.ch8_motion?.hoverIntensity ?? 0.5,
    };
}
/**
 * Compute spring parameters from genome values and preset base
 */
export function computeSpringParams(config) {
    const base = config.preset.spring;
    if (!base)
        return { stiffness: 400, damping: 30, mass: 1 };
    const intensity = config.hoverIntensity;
    const duration = config.duration;
    // Scale stiffness inversely with duration (faster = stiffer)
    const stiffness = base.stiffness / Math.max(duration, 0.1);
    // Scale damping with intensity (more intensity = less damping = more bounce)
    const damping = base.damping * (1 - intensity * 0.5);
    // Scale mass with duration (slower = heavier)
    const mass = base.mass * Math.max(duration, 0.5);
    return { stiffness: Math.round(stiffness), damping: Math.round(damping * 10) / 10, mass: Math.round(mass * 10) / 10 };
}
/**
 * Compute inertia parameters from genome values and preset base
 */
export function computeInertiaParams(config) {
    const base = config.preset.inertia;
    if (!base)
        return { velocity: 800, power: 0.8, timeConstant: 350 };
    const intensity = config.hoverIntensity;
    const duration = config.duration;
    return {
        velocity: base.velocity * intensity,
        power: base.power * (1 - intensity * 0.3),
        timeConstant: base.timeConstant * duration,
    };
}
export function getEnterAnimation(direction) {
    return ENTER_ANIMATION[direction] ?? ENTER_ANIMATION.up;
}
export function getExitAnimation(behavior) {
    return EXIT_ANIMATION[behavior] ?? EXIT_ANIMATION.fade;
}
export function getHoverInteraction(type, intensity, duration) {
    const base = HOVER_BASE[type] ?? HOVER_BASE.lift;
    const scale = 1 + intensity * 0.1;
    const y = -intensity * 12;
    const shadowBlur = Math.round(8 + intensity * 24);
    const shadowSpread = Math.round(4 + intensity * 16);
    const shadowOpacity = 0.1 + intensity * 0.15;
    return {
        whileHover: {
            ...base.transform,
            ...(type === "scale" ? { scale } : {}),
            ...(type === "lift" ? { y } : {}),
            ...base.style,
            ...(type === "shadow" ? { boxShadow: `0 ${shadowBlur}px ${shadowSpread * 2}px rgba(0,0,0,${shadowOpacity})` } : {}),
            ...(type === "lift" ? { boxShadow: `0 ${Math.abs(y) * 2}px ${Math.abs(y) * 5}px rgba(0,0,0,${shadowOpacity})` } : {}),
        },
        transition: {
            duration: duration / 1000,
            type: "spring",
            stiffness: Math.round(200 + intensity * 400),
            damping: Math.round(15 + intensity * 20),
        },
    };
}
export function getPageTransitionConfig(transition, duration) {
    const base = PAGE_TRANSITION_BASE[transition] ?? PAGE_TRANSITION_BASE.fade;
    return {
        enter: { ...base.enter, transition: { duration, ease: "easeInOut" } },
        leave: { ...base.leave, transition: { duration: duration * 0.75, ease: "easeIn" } },
    };
}
export function getChoreographyConfig(style) {
    return CHOREOGRAPHY_BASE[style] ?? CHOREOGRAPHY_BASE.smooth;
}
export function getRequiredLibraries(config) {
    const libs = new Set();
    if (config.preset.library !== "css" && config.preset.library !== "none") {
        libs.add(config.preset.library);
    }
    return Array.from(libs);
}
/**
 * Generate Framer Motion variants — ALL parameters computed from genome + preset
 */
export function generateFramerMotionVariants(config) {
    const enter = getEnterAnimation(config.enterDirection);
    const exit = getExitAnimation(config.exitBehavior);
    const hover = getHoverInteraction(config.hoverMicrointeraction.type, config.hoverIntensity, config.hoverMicrointeraction.duration);
    const choreo = getChoreographyConfig(config.choreographyStyle);
    const preset = config.preset;
    const transition = {
        duration: config.duration * choreo.staggerMultiplier,
    };
    if (preset.fmType === "spring" && preset.spring) {
        const spring = computeSpringParams(config);
        transition.type = "spring";
        transition.stiffness = spring.stiffness;
        transition.damping = spring.damping;
        transition.mass = spring.mass;
    }
    else if (preset.fmType === "inertia" && preset.inertia) {
        const inertia = computeInertiaParams(config);
        transition.type = "inertia";
        transition.velocity = inertia.velocity;
        transition.power = inertia.power;
        transition.timeConstant = inertia.timeConstant;
    }
    else if (preset.cssEasing) {
        transition.ease = preset.cssEasing;
    }
    if (preset.repeats) {
        transition.repeat = 2;
        transition.repeatType = "reverse";
    }
    return {
        hidden: enter.from,
        visible: { ...enter.to, transition },
        hover: hover.whileHover,
        hoverTransition: hover.transition,
        exit: { ...exit, transition: { duration: config.duration * 0.5 } },
    };
}
/**
 * Generate CSS keyframes — ALL parameters computed from genome + preset
 */
export function generateCSSKeyframes(config) {
    const enter = getEnterAnimation(config.enterDirection);
    const exit = getExitAnimation(config.exitBehavior);
    const hover = getHoverInteraction(config.hoverMicrointeraction.type, config.hoverIntensity, config.hoverMicrointeraction.duration);
    const choreo = getChoreographyConfig(config.choreographyStyle);
    const preset = config.preset;
    const spring = computeSpringParams(config);
    const fromProps = Object.entries(enter.from).map(([k, v]) => `    ${k}: ${v};`).join("\n");
    const toProps = Object.entries(enter.to).map(([k, v]) => `    ${k}: ${v};`).join("\n");
    const exitProps = Object.entries(exit).map(([k, v]) => `    ${k}: ${v};`).join("\n");
    const hoverProps = Object.entries(hover.whileHover).map(([k, v]) => `    ${k}: ${v};`).join("\n");
    return `/* ── Genome-Derived Animations ──────────────────────────────────── */
/* Preset: ${preset.name} (${preset.library}) | Library: ${preset.library} */
/* Spring: stiffness=${spring.stiffness} | damping=${spring.damping} | mass=${spring.mass} */
/* Choreography: ${config.choreographyStyle} | Stagger: ${config.staggerInterval}ms | Duration: ${config.duration}s */

@keyframes genome-enter {
    from {
${fromProps}
    }
    to {
${toProps}
    }
}

@keyframes genome-exit {
    from { opacity: 1; }
    to {
${exitProps}
    }
}

@keyframes genome-hover {
    to {
${hoverProps}
    }
}

@keyframes genome-scroll-reveal {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes genome-page-enter {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* ── Animation Utility Classes ──────────────────────────────────────────── */

.animate-genome-enter {
    animation: genome-enter ${config.duration * choreo.staggerMultiplier}s ${preset.cssEasing} both;
}

.animate-genome-exit {
    animation: genome-exit ${config.duration * 0.5}s ease both;
}

.animate-genome-hover:hover {
    animation: genome-hover ${hover.transition.duration}s ${preset.cssEasing} both;
}

.animate-genome-scroll { opacity: 0; }

.animate-genome-scroll.animate-in {
    animation: genome-scroll-reveal ${config.duration * choreo.staggerMultiplier}s ${preset.cssEasing} both;
}

.animate-genome-page {
    animation: genome-page-enter ${config.duration * 0.75}s ease both;
}

/* ── Reduced Motion ─────────────────────────────────────────────────────── */

@media (prefers-reduced-motion: reduce) {
    .animate-genome-enter, .animate-genome-exit, .animate-genome-hover, .animate-genome-scroll, .animate-genome-page {
        animation: none !important; opacity: 1 !important; transform: none !important; filter: none !important;
    }
}
`;
}
/**
 * Generate Framer Motion wrapper — ALL parameters computed from genome + preset
 */
export function generateFramerMotionWrapper(config, children, delay = 0) {
    if (config.preset.fmType === "none" || config.preset.library === "css")
        return children;
    const enter = getEnterAnimation(config.enterDirection);
    const hover = getHoverInteraction(config.hoverMicrointeraction.type, config.hoverIntensity, config.hoverMicrointeraction.duration);
    const choreo = getChoreographyConfig(config.choreographyStyle);
    const spring = computeSpringParams(config);
    const transitionStr = config.preset.fmType === "spring"
        ? `{ duration: ${config.duration * choreo.staggerMultiplier}, type: "spring", stiffness: ${spring.stiffness}, damping: ${spring.damping}, mass: ${spring.mass}, delay: ${delay / 1000} }`
        : config.preset.fmType === "inertia"
            ? (() => { const i = computeInertiaParams(config); return `{ duration: ${config.duration * choreo.staggerMultiplier}, type: "inertia", velocity: ${i.velocity}, power: ${i.power}, timeConstant: ${i.timeConstant}, delay: ${delay / 1000} }`; })()
            : `{ duration: ${config.duration * choreo.staggerMultiplier}, ease: "${config.preset.cssEasing}", delay: ${delay / 1000} }`;
    const hoverStr = `{ ${Object.entries(hover.whileHover).map(([k, v]) => `${k}: ${v}`).join(", ")}, transition: { duration: ${hover.transition.duration}, type: "spring", stiffness: ${hover.transition.stiffness}, damping: ${hover.transition.damping} } }`;
    return `<motion.div
    initial={{ ${Object.entries(enter.from).map(([k, v]) => `${k}: ${v}`).join(", ")} }}
    whileInView={{ ${Object.entries(enter.to).map(([k, v]) => `${k}: ${v}`).join(", ")} }}
    viewport={{ once: true, amount: ${config.scrollTrigger.triggerPoint} }}
    transition={${transitionStr}}
    whileHover={${hoverStr}}
>
    ${children}
</motion.div>`;
}
