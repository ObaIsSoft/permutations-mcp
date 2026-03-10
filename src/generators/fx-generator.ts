import { DesignGenome } from "../genome/types.js";

/**
 * FX / Atmosphere Layer Generator
 *
 * Generates CSS for the `.fx-atmosphere` class based on ch13_atmosphere.
 * ALL color values are derived from the genome's primary hue (ch5_color_primary).
 * No hardcoded hex or RGB values.
 *
 * FX Types:
 *   glassmorphism — frosted glass backdrop, parameterised by intensity
 *   crt_noise     — SVG fractal noise overlay
 *   fluid_mesh    — animated gradient mesh using hue-rotated palette
 *   none          — empty class (disabled)
 */
export class FXGenerator {
    generateCSSClass(genome: DesignGenome): string {
        const { fx, intensity } = genome.chromosomes.ch13_atmosphere;
        const { hue, saturation, lightness } = genome.chromosomes.ch5_color_primary;
        const { physics } = genome.chromosomes.ch8_motion;

        // Complementary hue (rotated 150° for visual interest, not arbitrary magenta)
        const complementHue = (hue + 150) % 360;
        const triHue = (hue + 240) % 360;

        const sat = Math.round(saturation * 100);
        const light = Math.round(lightness * 100);
        const dimLight = Math.max(10, light - 20);

        let css = "";

        if (fx === "glassmorphism") {
            const blurRadius = Math.round(10 + intensity * 30);
            const bgOpacity = (0.05 + intensity * 0.15).toFixed(3);
            const borderOpacity = (0.1 + intensity * 0.25).toFixed(3);
            css = `.fx-atmosphere {
    background: hsla(${hue}, ${sat}%, ${light}%, ${bgOpacity});
    backdrop-filter: blur(${blurRadius}px) saturate(${Math.round(100 + intensity * 80)}%);
    -webkit-backdrop-filter: blur(${blurRadius}px) saturate(${Math.round(100 + intensity * 80)}%);
    border: 1px solid hsla(${hue}, ${sat}%, ${Math.min(95, light + 30)}%, ${borderOpacity});
    box-shadow:
        0 4px 30px hsla(${hue}, ${sat}%, ${dimLight}%, ${(intensity * 0.2).toFixed(2)}),
        inset 0 1px 0 hsla(${hue}, ${sat}%, ${Math.min(95, light + 40)}%, ${(intensity * 0.1).toFixed(2)});
}`;
        } else if (fx === "crt_noise") {
            const noiseOpacity = (0.04 + intensity * 0.14).toFixed(3);
            const scanlineOpacity = (0.02 + intensity * 0.08).toFixed(3);
            css = `.fx-atmosphere::before {
    content: "";
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: ${noiseOpacity};
    pointer-events: none;
    z-index: 50;
    mix-blend-mode: overlay;
}
.fx-atmosphere::after {
    content: "";
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: repeating-linear-gradient(
        0deg,
        hsla(${hue}, ${sat}%, ${dimLight}%, ${scanlineOpacity}),
        hsla(${hue}, ${sat}%, ${dimLight}%, ${scanlineOpacity}) 1px,
        transparent 1px,
        transparent 2px
    );
    pointer-events: none;
    z-index: 49;
}`;
        } else if (fx === "fluid_mesh") {
            // Animated gradient using genome primary + computed complementary hues
            // Duration derived from intensity — more intense = faster movement
            const animDuration = Math.round(8 + (1 - intensity) * 12);
            const blurRadius = Math.round(40 + intensity * 60);
            css = `.fx-atmosphere {
    position: relative;
    overflow: hidden;
}
.fx-atmosphere::before {
    content: "";
    position: absolute;
    top: -50%; left: -50%;
    width: 200%; height: 200%;
    background: conic-gradient(
        from 0deg at 50% 50%,
        hsl(${hue}, ${sat}%, ${dimLight}%),
        hsl(${complementHue}, ${Math.max(20, sat - 10)}%, ${Math.max(10, dimLight - 10)}%),
        hsl(${triHue}, ${Math.max(20, sat - 20)}%, ${Math.min(50, dimLight + 5)}%),
        hsl(${hue}, ${sat}%, ${dimLight}%)
    );
    filter: blur(${blurRadius}px);
    opacity: ${(0.4 + intensity * 0.4).toFixed(2)};
    animation: fluid-rotate ${animDuration}s linear infinite;
    pointer-events: none;
    z-index: -1;
}
@keyframes fluid-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}`;
        } else if (fx === "none") {
            // Even "none" gets a subtle ambient glow if physics === "glitch"
            if (physics === "glitch") {
                css = `.fx-atmosphere {
    animation: genome-glitch ${(0.3 + intensity * 0.5).toFixed(2)}s steps(2) infinite;
}
@keyframes genome-glitch {
    0%   { clip-path: inset(0 0 95% 0); transform: translate(${Math.round(intensity * 4)}px, 0); filter: hue-rotate(0deg); }
    20%  { clip-path: inset(20% 0 60% 0); transform: translate(-${Math.round(intensity * 4)}px, 0); filter: hue-rotate(${Math.round(intensity * 90)}deg); }
    40%  { clip-path: inset(50% 0 30% 0); transform: translate(${Math.round(intensity * 2)}px, 0); }
    60%  { clip-path: inset(0 0 0 0); transform: translate(0, 0); filter: hue-rotate(0deg); }
    100% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
}`;
            } else {
                css = `.fx-atmosphere { /* No atmosphere effects — ch13 intensity: ${intensity.toFixed(2)} */ }`;
            }
        }

        return css.trim();
    }
}
