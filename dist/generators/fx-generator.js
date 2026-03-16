/**
 * FX / Atmosphere Layer Generator
 *
 * Generates CSS for the `.fx-atmosphere` class based on ch13_atmosphere.
 * ALL color values are derived from the genome's primary hue (ch5_color_primary).
 * No hardcoded hex or RGB values.
 *
 * Supported AtmosphereFX values:
 *   glassmorphism        frosted glass backdrop-filter
 *   crt_noise            scanlines + fractal noise overlay
 *   fluid_mesh           animated conic gradient mesh
 *   aurora               animated borealis-style gradient
 *   noise_gradient       static perlin noise gradient
 *   holographic          iridescent rainbow sheen
 *   scanlines            horizontal rule overlay — retro
 *   pixel_dither         ordered dithering pattern
 *   ink_wash             watercolour bleed at edges
 *   chromatic_aberration RGB channel split / fringe
 *   depth_of_field       foreground blur — lens feel
 *   banding              posterised colour steps — lo-fi
 *   none                 no effect (optional glitch when physics === glitch)
 */
export class FXGenerator {
    generateCSSClass(genome) {
        const { fx, intensity } = genome.chromosomes.ch13_atmosphere;
        const { hue, saturation, lightness } = genome.chromosomes.ch5_color_primary;
        const { physics } = genome.chromosomes.ch8_motion;
        const complementHue = (hue + 150) % 360;
        const triHue = (hue + 240) % 360;
        const anaHue = (hue + 30) % 360;
        const sat = Math.round(saturation * 100);
        const light = Math.round(lightness * 100);
        const dimLight = Math.max(10, light - 20);
        const brightLight = Math.min(95, light + 30);
        let css = "";
        switch (fx) {
            case "glassmorphism": {
                const blur = Math.round(10 + intensity * 30);
                const bgOp = (0.05 + intensity * 0.15).toFixed(3);
                const borderOp = (0.1 + intensity * 0.25).toFixed(3);
                css = `.fx-atmosphere {
    background: hsla(${hue}, ${sat}%, ${light}%, ${bgOp});
    backdrop-filter: blur(${blur}px) saturate(${Math.round(100 + intensity * 80)}%);
    -webkit-backdrop-filter: blur(${blur}px) saturate(${Math.round(100 + intensity * 80)}%);
    border: 1px solid hsla(${hue}, ${sat}%, ${brightLight}%, ${borderOp});
    box-shadow:
        0 4px 30px hsla(${hue}, ${sat}%, ${dimLight}%, ${(intensity * 0.2).toFixed(2)}),
        inset 0 1px 0 hsla(${hue}, ${sat}%, ${brightLight}%, ${(intensity * 0.1).toFixed(2)});
}`;
                break;
            }
            case "crt_noise": {
                const noiseOp = (0.04 + intensity * 0.14).toFixed(3);
                const scanOp = (0.02 + intensity * 0.08).toFixed(3);
                css = `.fx-atmosphere::before {
    content: "";
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: ${noiseOp};
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
        hsla(${hue}, ${sat}%, ${dimLight}%, ${scanOp}),
        hsla(${hue}, ${sat}%, ${dimLight}%, ${scanOp}) 1px,
        transparent 1px,
        transparent 2px
    );
    pointer-events: none;
    z-index: 49;
}`;
                break;
            }
            case "fluid_mesh": {
                const dur = Math.round(8 + (1 - intensity) * 12);
                const blur = Math.round(40 + intensity * 60);
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
    filter: blur(${blur}px);
    opacity: ${(0.4 + intensity * 0.4).toFixed(2)};
    animation: fx-fluid-rotate ${dur}s linear infinite;
    pointer-events: none;
    z-index: -1;
}
@keyframes fx-fluid-rotate {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}`;
                break;
            }
            case "aurora": {
                const dur1 = Math.round(12 + (1 - intensity) * 8);
                const dur2 = Math.round(18 + (1 - intensity) * 10);
                css = `.fx-atmosphere {
    position: relative;
    overflow: hidden;
}
.fx-atmosphere::before,
.fx-atmosphere::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    filter: blur(${Math.round(60 + intensity * 40)}px);
    pointer-events: none;
    opacity: ${(0.25 + intensity * 0.35).toFixed(2)};
}
.fx-atmosphere::before {
    width: 60%; height: 40%;
    top: -10%; left: 10%;
    background: radial-gradient(ellipse,
        hsl(${hue}, ${sat}%, ${brightLight}%),
        hsl(${anaHue}, ${sat}%, ${dimLight}%) 60%,
        transparent
    );
    animation: fx-aurora-drift1 ${dur1}s ease-in-out infinite alternate;
    z-index: -1;
}
.fx-atmosphere::after {
    width: 50%; height: 35%;
    top: 5%; right: 5%;
    background: radial-gradient(ellipse,
        hsl(${complementHue}, ${Math.max(30, sat - 15)}%, ${brightLight}%),
        transparent 70%
    );
    animation: fx-aurora-drift2 ${dur2}s ease-in-out infinite alternate;
    z-index: -1;
}
@keyframes fx-aurora-drift1 {
    from { transform: translateX(-5%) scaleX(1);   }
    to   { transform: translateX(10%) scaleX(1.15); }
}
@keyframes fx-aurora-drift2 {
    from { transform: translateX(5%) scaleY(1);   }
    to   { transform: translateX(-8%) scaleY(1.2); }
}`;
                break;
            }
            case "noise_gradient": {
                css = `.fx-atmosphere {
    position: relative;
}
.fx-atmosphere::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
        url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='ng'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.45' numOctaves='4' seed='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23ng)'/%3E%3C/svg%3E"),
        linear-gradient(135deg,
            hsl(${hue}, ${sat}%, ${dimLight}%),
            hsl(${complementHue}, ${Math.max(20, sat - 10)}%, ${light}%)
        );
    background-blend-mode: soft-light;
    opacity: ${(0.3 + intensity * 0.4).toFixed(2)};
    pointer-events: none;
    z-index: -1;
}`;
                break;
            }
            case "holographic": {
                const dur = Math.round(4 + (1 - intensity) * 6);
                css = `.fx-atmosphere {
    position: relative;
    isolation: isolate;
}
.fx-atmosphere::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
        135deg,
        hsl(${hue}, 100%, 70%) 0%,
        hsl(${(hue + 60) % 360}, 100%, 70%) 16.66%,
        hsl(${(hue + 120) % 360}, 100%, 70%) 33.33%,
        hsl(${(hue + 180) % 360}, 100%, 70%) 50%,
        hsl(${(hue + 240) % 360}, 100%, 70%) 66.66%,
        hsl(${(hue + 300) % 360}, 100%, 70%) 83.33%,
        hsl(${hue}, 100%, 70%) 100%
    );
    background-size: 400% 400%;
    opacity: ${(0.08 + intensity * 0.18).toFixed(2)};
    mix-blend-mode: color-dodge;
    animation: fx-holo-shift ${dur}s linear infinite;
    pointer-events: none;
    z-index: 1;
}
@keyframes fx-holo-shift {
    0%   { background-position: 0% 50%;   }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%;   }
}`;
                break;
            }
            case "scanlines": {
                const lineOp = (0.06 + intensity * 0.16).toFixed(3);
                const gap = Math.max(2, Math.round(3 - intensity));
                css = `.fx-atmosphere {
    position: relative;
}
.fx-atmosphere::after {
    content: "";
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
        180deg,
        transparent 0px,
        transparent ${gap}px,
        hsla(${hue}, ${sat}%, ${dimLight}%, ${lineOp}) ${gap}px,
        hsla(${hue}, ${sat}%, ${dimLight}%, ${lineOp}) ${gap + 1}px
    );
    pointer-events: none;
    z-index: 50;
}`;
                break;
            }
            case "pixel_dither": {
                const ditherOp = (0.05 + intensity * 0.12).toFixed(3);
                css = `.fx-atmosphere {
    position: relative;
}
.fx-atmosphere::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
        radial-gradient(hsla(${hue}, ${sat}%, ${brightLight}%, ${ditherOp}) 1px, transparent 1px),
        radial-gradient(hsla(${complementHue}, ${sat}%, ${brightLight}%, ${ditherOp}) 1px, transparent 1px);
    background-size: 4px 4px, 8px 8px;
    background-position: 0 0, 2px 2px;
    pointer-events: none;
    z-index: 1;
    mix-blend-mode: overlay;
}`;
                break;
            }
            case "ink_wash": {
                const washOp = (0.15 + intensity * 0.25).toFixed(2);
                css = `.fx-atmosphere {
    position: relative;
    overflow: hidden;
}
.fx-atmosphere::before {
    content: "";
    position: absolute;
    inset: -20%;
    background:
        radial-gradient(ellipse 80% 60% at 20% 20%,
            hsla(${hue}, ${Math.max(20, sat - 20)}%, ${dimLight}%, ${washOp}),
            transparent 70%
        ),
        radial-gradient(ellipse 60% 80% at 80% 80%,
            hsla(${complementHue}, ${Math.max(20, sat - 20)}%, ${dimLight}%, ${(parseFloat(washOp) * 0.6).toFixed(2)}),
            transparent 70%
        );
    filter: blur(${Math.round(20 + intensity * 30)}px);
    pointer-events: none;
    z-index: -1;
}`;
                break;
            }
            case "chromatic_aberration": {
                const shift = (1 + intensity * 4).toFixed(1);
                css = `.fx-atmosphere {
    position: relative;
}
.fx-atmosphere::before,
.fx-atmosphere::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: ${(0.15 + intensity * 0.25).toFixed(2)};
}
.fx-atmosphere::before {
    background: inherit;
    mix-blend-mode: screen;
    filter: blur(0.5px);
    transform: translateX(-${shift}px);
    z-index: 51;
    background: hsla(${(hue + 120) % 360}, 100%, 50%, 0.08);
}
.fx-atmosphere::after {
    background: hsla(${(hue + 240) % 360}, 100%, 50%, 0.08);
    mix-blend-mode: screen;
    transform: translateX(${shift}px);
    z-index: 52;
}`;
                break;
            }
            case "depth_of_field": {
                const blurAmount = (1 + intensity * 8).toFixed(1);
                css = `.fx-atmosphere > *:not(:first-child) {
    filter: blur(${blurAmount}px);
    opacity: ${(0.6 + (1 - intensity) * 0.4).toFixed(2)};
    transition: filter 0.4s ease, opacity 0.4s ease;
}
.fx-atmosphere > *:first-child {
    filter: none;
    opacity: 1;
}`;
                break;
            }
            case "banding": {
                const steps = Math.max(3, Math.round(8 - intensity * 5));
                const bands = Array.from({ length: steps }, (_, i) => {
                    const pct = Math.round((i / steps) * 100);
                    const nextPct = Math.round(((i + 1) / steps) * 100);
                    const l = Math.round(dimLight + (i / steps) * (light - dimLight));
                    return `hsl(${hue}, ${sat}%, ${l}%) ${pct}%, hsl(${hue}, ${sat}%, ${l}%) ${nextPct}%`;
                }).join(",\n        ");
                css = `.fx-atmosphere {
    position: relative;
}
.fx-atmosphere::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg,
        ${bands}
    );
    opacity: ${(0.12 + intensity * 0.2).toFixed(2)};
    pointer-events: none;
    mix-blend-mode: overlay;
    z-index: -1;
}`;
                break;
            }
            case "none":
            default: {
                // Glitch ambient even with fx=none when physics === glitch
                if (physics === "glitch") {
                    const glitchOp = (0.3 + intensity * 0.5).toFixed(2);
                    css = `.fx-atmosphere {
    animation: fx-genome-glitch ${glitchOp}s steps(2) infinite;
}
@keyframes fx-genome-glitch {
    0%   { clip-path: inset(0 0 95% 0); transform: translate(${Math.round(intensity * 4)}px, 0); filter: hue-rotate(0deg); }
    20%  { clip-path: inset(20% 0 60% 0); transform: translate(-${Math.round(intensity * 4)}px, 0); filter: hue-rotate(${Math.round(intensity * 90)}deg); }
    40%  { clip-path: inset(50% 0 30% 0); transform: translate(${Math.round(intensity * 2)}px, 0); }
    60%  { clip-path: inset(0 0 0 0); transform: translate(0, 0); filter: hue-rotate(0deg); }
    100% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
}`;
                }
                else {
                    css = `.fx-atmosphere { /* ch13 fx: none — intensity: ${intensity.toFixed(2)} */ }`;
                }
                break;
            }
        }
        return css.trim();
    }
}
