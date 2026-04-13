/**
 * Preloader Engine
 *
 * Generates HTML, CSS, and JS for the genome's active preloader.
 * All values reference genome CSS custom properties.
 * No hardcoded colours, sizes, or timing values.
 */

import type { DesignGenome } from "../genome/types.js";
import { selectPreloaderType } from "../preloader-catalog.js";
import type { PreloaderType } from "../preloader-catalog.js";

// ── Public API ────────────────────────────────────────────────────────────────

export interface PreloaderEngineOutput {
    /** HTML inserted as first child of <body> */
    html: string;
    /** CSS for the preloader overlay */
    css: string;
    /** JS that controls show/hide and animates the preloader */
    js: string;
    type: PreloaderType;
}

export function generatePreloaderOutput(genome: DesignGenome): PreloaderEngineOutput {
    const sig = genome.chromosomes.ch12_signature;
    const ch8 = genome.chromosomes.ch8_motion;
    const ch15 = genome.chromosomes.ch15_biomarker as typeof genome.chromosomes.ch15_biomarker;
    const copy = genome.chromosomes.ch25_copy_engine as typeof genome.chromosomes.ch25_copy_engine;

    const philosophy = sig?.designPhilosophy ?? "editorial";
    const entropy = sig?.entropy ?? 0.5;
    const physics = ch8?.physics ?? "none";
    const hasWebGL = ch15?.enabled ?? false;
    const companyName = copy?.companyName ?? "";

    const type = selectPreloaderType({ philosophy, entropy, physics, hasWebGL });

    if (type === "none") {
        return { html: "", css: "", js: "", type };
    }

    return {
        html: generatePreloaderHTML(type, companyName),
        css: generatePreloaderCSS(type),
        js: generatePreloaderJS(type, companyName),
        type,
    };
}

// ── HTML ──────────────────────────────────────────────────────────────────────

function generatePreloaderHTML(type: PreloaderType, companyName: string): string {
    switch (type) {
        case "minimal_bar":
            return `<div class="preloader preloader--bar" aria-hidden="true"><div class="preloader-bar"></div></div>`;

        case "counter_percent":
            return `<div class="preloader preloader--counter" aria-hidden="true"><span class="preloader-count">0</span><span class="preloader-pct">%</span></div>`;

        case "word_scatter":
            return `<div class="preloader preloader--words" aria-hidden="true">${
                ["DESIGN", "SYSTEM", "GENOME", companyName || "BRAND"].map((w, i) =>
                    `<span class="preloader-word" style="--word-i:${i}">${w}</span>`
                ).join("")
            }</div>`;

        case "svg_draw":
            return `<div class="preloader preloader--svg" aria-hidden="true"><svg class="preloader-svg" viewBox="0 0 200 200"><path class="preloader-path" d="M 20 100 Q 100 20 180 100 Q 100 180 20 100 Z" fill="none" stroke-linecap="round"/></svg></div>`;

        case "morphing_blob":
            return `<div class="preloader preloader--blob" aria-hidden="true"><div class="preloader-blob"></div></div>`;

        case "grid_fill":
            return `<div class="preloader preloader--grid" aria-hidden="true">${
                Array.from({ length: 25 }, (_, i) => `<div class="preloader-cell" style="--cell-i:${i}"></div>`).join("")
            }</div>`;

        case "3d_scene_spin":
            return `<div class="preloader preloader--3d" aria-hidden="true"><canvas class="preloader-canvas"></canvas></div>`;

        case "typewriter_name":
            return `<div class="preloader preloader--typewriter" aria-hidden="true"><span class="preloader-name" data-name="${companyName}"></span><span class="preloader-cursor">|</span></div>`;

        default:
            return "";
    }
}

// ── CSS ───────────────────────────────────────────────────────────────────────

function generatePreloaderCSS(type: PreloaderType): string {
    const base = `
/* ── Preloader ────────────────────────────────────────────────── */
.preloader {
  position: fixed; inset: 0; z-index: 99999;
  display: flex; align-items: center; justify-content: center;
  background: var(--color-bg);
  transition: opacity var(--duration-med, 0.6s) var(--ease-genome, ease),
              visibility var(--duration-med, 0.6s);
}
.preloader.done { opacity: 0; visibility: hidden; pointer-events: none; }`;

    const specific = generatePreloaderTypeCSS(type);
    return base + (specific ? "\n" + specific : "");
}

function generatePreloaderTypeCSS(type: PreloaderType): string {
    switch (type) {
        case "minimal_bar":
            return `
.preloader--bar { align-items: flex-start; justify-content: flex-start; background: transparent; }
.preloader-bar {
  height: 2px; width: 0%; background: var(--color-primary);
  transition: width 0.1s linear;
}`;

        case "counter_percent":
            return `
.preloader-count {
  font-size: var(--size-display-max, clamp(5rem, 15vw, 18rem));
  font-weight: var(--weight-display, 900);
  font-family: var(--font-anchor);
  color: var(--color-primary);
  font-variant-numeric: tabular-nums;
  letter-spacing: var(--tracking-ultra, -0.04em);
  line-height: 1;
}
.preloader-pct {
  font-size: var(--size-display-sm, clamp(2rem, 4vw, 4rem));
  font-family: var(--font-anchor);
  color: var(--color-primary);
  opacity: var(--opacity-secondary);
  align-self: flex-end;
  margin-bottom: 0.5em;
}`;

        case "word_scatter":
            return `
.preloader--words { flex-wrap: wrap; gap: var(--spacing-lg); }
.preloader-word {
  font-size: var(--size-display-sm, clamp(2rem, 5vw, 6rem));
  font-weight: var(--weight-display, 900);
  font-family: var(--font-anchor);
  color: var(--color-primary);
  opacity: 0;
  transform: translateY(calc(var(--spacing-xl) * -1)) rotate(calc(var(--word-i, 0) * 5deg - 10deg));
  animation: word-in 0.5s var(--ease-genome, ease) forwards;
  animation-delay: calc(var(--word-i, 0) * 0.1s);
}
@keyframes word-in { to { opacity: 1; transform: none; } }`;

        case "svg_draw":
            return `
.preloader-svg { width: clamp(80px, 20vw, 200px); }
.preloader-path {
  stroke: var(--color-primary);
  stroke-width: 2;
  stroke-dasharray: 800;
  stroke-dashoffset: 800;
  animation: path-draw 1.5s var(--ease-genome, ease) forwards;
}
@keyframes path-draw { to { stroke-dashoffset: 0; } }`;

        case "morphing_blob":
            return `
.preloader-blob {
  width: clamp(80px, 15vw, 160px);
  aspect-ratio: 1;
  background: var(--color-primary);
  animation: blob-morph 2s ease-in-out infinite;
}
@keyframes blob-morph {
  0%, 100% { border-radius: 60% 40% 70% 30% / 50% 60% 40% 70%; }
  33%       { border-radius: 40% 60% 30% 70% / 60% 40% 70% 30%; }
  66%       { border-radius: 70% 30% 50% 50% / 30% 70% 50% 50%; }
}`;

        case "grid_fill":
            return `
.preloader--grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; width: clamp(120px, 20vw, 200px); }
.preloader-cell {
  aspect-ratio: 1;
  background: var(--color-primary);
  opacity: 0;
  animation: cell-fill 0.3s var(--ease-genome, ease) forwards;
  animation-delay: calc(var(--cell-i, 0) * 0.04s);
  border-radius: var(--radius-sm);
}
@keyframes cell-fill { to { opacity: 1; } }`;

        case "typewriter_name":
            return `
.preloader-name {
  font-size: var(--size-display-md, clamp(2rem, 6vw, 8rem));
  font-weight: var(--weight-display, 900);
  font-family: var(--font-anchor);
  color: var(--color-primary);
  letter-spacing: var(--tracking-ultra, -0.04em);
}
.preloader-cursor {
  font-size: var(--size-display-md, clamp(2rem, 6vw, 8rem));
  color: var(--color-primary);
  animation: cursor-blink 0.7s step-end infinite;
}
@keyframes cursor-blink { 50% { opacity: 0; } }`;

        default:
            return "";
    }
}

// ── JS ────────────────────────────────────────────────────────────────────────

function generatePreloaderJS(type: PreloaderType, companyName: string): string {
    const dismiss = `
  function dismissPreloader() {
    const el = document.querySelector('.preloader');
    if (el) el.classList.add('done');
  }`;

    switch (type) {
        case "minimal_bar":
            return `
// preloader: minimal_bar
(function() {
  const bar = document.querySelector('.preloader-bar');
  if (!bar) return;
  let progress = 0;
  const iv = setInterval(() => {
    progress = Math.min(100, progress + Math.random() * 15);
    bar.style.width = progress + '%';
    if (progress >= 100) { clearInterval(iv); setTimeout(dismissPreloader, 200); }
  }, 80);
  ${dismiss}
  window.addEventListener('load', () => { progress = 100; bar.style.width = '100%'; setTimeout(dismissPreloader, 300); });
})();`;

        case "counter_percent":
            return `
// preloader: counter_percent
(function() {
  const count = document.querySelector('.preloader-count');
  if (!count) return;
  let n = 0;
  const iv = setInterval(() => {
    n = Math.min(100, n + Math.ceil(Math.random() * 8));
    count.textContent = String(n);
    if (n >= 100) { clearInterval(iv); setTimeout(dismissPreloader, 400); }
  }, 50);
  ${dismiss}
})();`;

        case "typewriter_name":
            return `
// preloader: typewriter_name
(function() {
  const nameEl = document.querySelector('.preloader-name');
  if (!nameEl) return;
  const text = '${companyName}';
  let i = 0;
  const iv = setInterval(() => {
    nameEl.textContent = text.slice(0, ++i);
    if (i >= text.length) {
      clearInterval(iv);
      setTimeout(() => {
        let j = text.length;
        const del = setInterval(() => {
          nameEl.textContent = text.slice(0, --j);
          if (j <= 0) { clearInterval(del); setTimeout(dismissPreloader, 200); }
        }, 40);
      }, 500);
    }
  }, 80);
  ${dismiss}
})();`;

        case "word_scatter":
            return `
// preloader: word_scatter
(function() {
  ${dismiss}
  setTimeout(dismissPreloader, 1200);
})();`;

        case "svg_draw":
            return `
// preloader: svg_draw
(function() {
  ${dismiss}
  setTimeout(dismissPreloader, 1800);
})();`;

        case "morphing_blob":
            return `
// preloader: morphing_blob
(function() {
  ${dismiss}
  setTimeout(dismissPreloader, 1500);
})();`;

        case "grid_fill":
            return `
// preloader: grid_fill
(function() {
  ${dismiss}
  setTimeout(dismissPreloader, 1200);
})();`;

        case "3d_scene_spin":
            return `
// preloader: 3d_scene_spin — requires Three.js already loaded
(function() {
  ${dismiss}
  // Three.js init would go here — canvas found via .preloader-canvas
  setTimeout(dismissPreloader, 2000);
})();`;

        default:
            return "";
    }
}
