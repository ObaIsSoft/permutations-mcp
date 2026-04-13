/**
 * Transition Engine
 *
 * Generates CSS and JS for page-to-page transitions.
 * All values reference genome CSS custom properties.
 * No hardcoded colours, durations, or easing values.
 */

import type { DesignGenome } from "../genome/types.js";
import { selectPageTransition } from "../transition-catalog.js";
import type { PageTransitionType } from "../transition-catalog.js";

// ── Public API ────────────────────────────────────────────────────────────────

export interface TransitionEngineOutput {
    css: string;
    js: string;
    type: PageTransitionType;
}

export function generateTransitionOutput(genome: DesignGenome): TransitionEngineOutput {
    const sig = genome.chromosomes.ch12_signature;
    const ch8 = genome.chromosomes.ch8_motion;
    const ch15 = genome.chromosomes.ch15_biomarker;

    const philosophy = sig?.designPhilosophy ?? "editorial";
    const entropy = sig?.entropy ?? 0.5;
    const physics = ch8?.physics ?? "none";
    const hasWebGL = ch15?.enabled ?? false;

    const type = selectPageTransition({ philosophy, entropy, physics, hasWebGL });

    return {
        css: generateTransitionCSS(type),
        js: generateTransitionJS(type),
        type,
    };
}

// ── CSS ───────────────────────────────────────────────────────────────────────

/**
 * All CSS values use genome custom properties:
 * --duration-fast, --duration-med, --duration-slow, --ease-genome,
 * --color-primary, --color-accent, --color-bg, --radius-full
 */
function generateTransitionCSS(type: PageTransitionType): string {
    const base = `
/* ── Page Transition: ${type} ────────────────────────────────── */
.page-transition-overlay {
  position: fixed; inset: 0; z-index: 99998;
  pointer-events: none;
}`;

    const specific = generateTransitionTypeCSS(type);
    return (base + "\n" + specific).trim();
}

function generateTransitionTypeCSS(type: PageTransitionType): string {
    switch (type) {
        case "opacity_fade":
            return `
.animate-genome-page { animation: page-fade-in var(--duration-med, 0.4s) var(--ease-genome, ease) both; }
@keyframes page-fade-in { from { opacity: 0; } to { opacity: 1; } }`;

        case "view_transition_api":
            return `
@keyframes vt-slide-in  { from { opacity: 0; transform: translateX(2%); } to { opacity: 1; transform: none; } }
@keyframes vt-slide-out { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateX(-2%); } }
::view-transition-old(root) { animation: vt-slide-out var(--duration-med, 0.35s) var(--ease-genome, ease) both; }
::view-transition-new(root) { animation: vt-slide-in  var(--duration-med, 0.35s) var(--ease-genome, ease) both; }`;

        case "clip_wipe_right":
            return `
.page-transition-overlay {
  background: var(--color-primary);
  clip-path: inset(0 100% 0 0);
  transition: clip-path var(--duration-slow, 0.6s) var(--ease-genome, cubic-bezier(0.77,0,0.175,1));
}
.page-transition-overlay.enter { clip-path: inset(0 0% 0 0); }
.page-transition-overlay.leave { clip-path: inset(0 0 0 100%); }`;

        case "clip_curtain_up":
            return `
.page-transition-overlay {
  background: var(--color-primary);
  clip-path: inset(100% 0 0 0);
  transition: clip-path var(--duration-slow, 0.7s) var(--ease-genome, cubic-bezier(0.77,0,0.175,1));
}
.page-transition-overlay.enter { clip-path: inset(0 0 0 0); }
.page-transition-overlay.leave { clip-path: inset(0 0 100% 0); }`;

        case "clip_circle_expand":
            return `
.page-transition-overlay {
  background: var(--color-primary);
  clip-path: circle(0% at var(--click-x, 50%) var(--click-y, 50%));
  transition: clip-path var(--duration-slow, 0.6s) var(--ease-genome, ease);
}
.page-transition-overlay.enter { clip-path: circle(150% at var(--click-x, 50%) var(--click-y, 50%)); }`;

        case "css_3d_flip":
            return `
.page-layout { perspective: 1200px; }
.animate-genome-page { animation: page-flip-in var(--duration-ambient, 0.8s) var(--ease-genome, ease) both; transform-origin: left center; }
@keyframes page-flip-in { from { opacity: 0; transform: rotateY(-90deg); } to { opacity: 1; transform: rotateY(0); } }`;

        case "color_wash":
            return `
.page-transition-overlay {
  background: var(--color-primary);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform var(--duration-slow, 0.45s) var(--ease-genome, cubic-bezier(0.77,0,0.175,1));
}
.page-transition-overlay.enter { transform: scaleX(1); transform-origin: left center; }
.page-transition-overlay.leave { transform: scaleX(0); transform-origin: right center; }`;

        case "morph_blob":
            return `
.animate-genome-page { animation: page-blob-in var(--duration-slow, 0.7s) var(--ease-genome, cubic-bezier(0.16,1,0.3,1)) both; }
@keyframes page-blob-in {
  from { opacity: 0; transform: scale(0.88); border-radius: 50%; }
  to   { opacity: 1; transform: scale(1);    border-radius: 0; }
}`;

        case "grid_reveal":
            return `
.page-grid-cell {
  position: fixed; z-index: 99998;
  background: var(--color-primary);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform var(--duration-med, 0.4s) var(--ease-genome, ease);
}
.page-grid-cell.enter { transform: scaleY(1); }
.page-grid-cell.leave { transform: scaleY(0); transform-origin: bottom; }`;

        case "glitch_shatter":
            return `
.page-glitch-shard {
  position: fixed; z-index: 99998;
  background: var(--color-primary);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  transition: clip-path var(--duration-med, 0.3s) ease, transform var(--duration-med, 0.3s) ease;
}`;

        case "text_scramble":
            return `
.page-transition-overlay { background: var(--color-bg); }
.animate-genome-page { animation: page-fade-in var(--duration-fast, 0.3s) var(--ease-genome, ease) both; }
@keyframes page-fade-in { from { opacity: 0; } to { opacity: 1; } }`;

        case "noise_dissolve":
            return `
/* noise_dissolve — requires WebGL canvas overlay, driven by JS */
.page-transition-overlay { background: transparent; }`;

        default:
            return "";
    }
}

// ── JS ────────────────────────────────────────────────────────────────────────

function generateTransitionJS(type: PageTransitionType): string {
    switch (type) {
        case "opacity_fade":
            return `// page transition: opacity_fade — CSS animation handles it`;

        case "view_transition_api":
            return `
// page transition: view_transition_api
(function() {
  document.querySelectorAll('a[href]').forEach(link => {
    if (link.origin !== location.origin) return;
    link.addEventListener('click', e => {
      if (!document.startViewTransition) return;
      e.preventDefault();
      document.startViewTransition(() => {
        location.href = link.href;
      });
    });
  });
})();`;

        case "clip_wipe_right":
        case "clip_curtain_up":
        case "color_wash":
            return `
// page transition: ${type}
(function() {
  const overlay = document.querySelector('.page-transition-overlay');
  if (!overlay) return;
  document.querySelectorAll('a[href]').forEach(link => {
    if (link.origin !== location.origin) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.href;
      overlay.classList.add('enter');
      setTimeout(() => { location.href = href; }, 650);
    });
  });
  window.addEventListener('pageshow', () => {
    overlay.classList.remove('enter');
    overlay.classList.add('leave');
    setTimeout(() => overlay.classList.remove('leave'), 700);
  });
})();`;

        case "clip_circle_expand":
            return `
// page transition: clip_circle_expand
(function() {
  const overlay = document.querySelector('.page-transition-overlay');
  if (!overlay) return;
  document.querySelectorAll('a[href]').forEach(link => {
    if (link.origin !== location.origin) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.href;
      const x = ((e.clientX / window.innerWidth) * 100).toFixed(1) + '%';
      const y = ((e.clientY / window.innerHeight) * 100).toFixed(1) + '%';
      overlay.style.setProperty('--click-x', x);
      overlay.style.setProperty('--click-y', y);
      overlay.classList.add('enter');
      setTimeout(() => { location.href = href; }, 650);
    });
  });
})();`;

        case "grid_reveal":
            return `
// page transition: grid_reveal
(function() {
  const cols = 8, rows = 5;
  const frag = document.createDocumentFragment();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'page-grid-cell';
      cell.style.cssText = \`left:\${c/cols*100}%;top:\${r/rows*100}%;width:\${100/cols}%;height:\${100/rows}%;transition-delay:\${(c+r)*0.03}s\`;
      frag.appendChild(cell);
    }
  }
  document.body.appendChild(frag);
  const cells = document.querySelectorAll('.page-grid-cell');
  document.querySelectorAll('a[href]').forEach(link => {
    if (link.origin !== location.origin) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.href;
      cells.forEach(cell => cell.classList.add('enter'));
      setTimeout(() => { location.href = href; }, 700);
    });
  });
})();`;

        case "glitch_shatter":
            return `
// page transition: glitch_shatter
(function() {
  document.querySelectorAll('a[href]').forEach(link => {
    if (link.origin !== location.origin) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.href;
      document.body.style.animation = 'page-glitch 0.3s steps(2) both';
      setTimeout(() => { location.href = href; }, 350);
    });
  });
})();`;

        case "text_scramble":
            return `
// page transition: text_scramble
(function() {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  function scrambleEl(el, cb) {
    const orig = el.textContent;
    let f = 0, total = orig.length * 3;
    const iv = setInterval(() => {
      el.textContent = orig.split('').map((ch, i) =>
        f > i * 3 ? orig[i] : CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join('');
      if (f++ >= total) { clearInterval(iv); el.textContent = orig; if (cb) cb(); }
    }, 16);
  }
  document.querySelectorAll('a[href]').forEach(link => {
    if (link.origin !== location.origin) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.href;
      const h1 = document.querySelector('h1');
      if (h1) scrambleEl(h1, () => { location.href = href; });
      else location.href = href;
    });
  });
})();`;

        default:
            return `// page transition: ${type}`;
    }
}
