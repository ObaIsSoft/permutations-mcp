/**
 * Typography Engine
 *
 * Generates CSS and JS for the active typography treatments.
 * All values reference genome CSS custom properties — no hardcoded
 * colours, font sizes, or timing values.
 *
 * CSS is injected into the main stylesheet alongside other genome CSS.
 * JS handles the DOM-splitting logic (split_char, split_word) and
 * runtime animations (kinetic_weight, scramble_reveal).
 */

import type { DesignGenome } from "../genome/types.js";
import { selectTypographyTreatments } from "../typography-catalog.js";
import type { TypographyTreatment } from "../typography-catalog.js";

// ── Public API ────────────────────────────────────────────────────────────────

export interface TypographyEngineOutput {
    css: string;
    js: string;
}

/**
 * Generate CSS + JS for all active typography treatments in this genome.
 */
export function generateTypographyOutput(genome: DesignGenome): TypographyEngineOutput {
    const sig = genome.chromosomes.ch12_signature;
    const ch3 = genome.chromosomes.ch3_type_display as any;
    const ch8 = genome.chromosomes.ch8_motion;

    const philosophy = sig?.designPhilosophy ?? "editorial";
    const entropy = sig?.entropy ?? 0.5;
    const physics = ch8?.physics ?? "none";
    // Defensive: allow isVariable to be present or not
    const isVariableFont = typeof ch3?.isVariable === 'boolean' ? ch3.isVariable : false;

    const treatments = selectTypographyTreatments({ philosophy, entropy, physics, isVariableFont });

    const cssParts: string[] = ["/* ── Typography Treatments ─────────────────────────────────────── */"];
    const jsParts: string[] = [];

    for (const treatment of treatments) {
        cssParts.push(generateTreatmentCSS(treatment));
        const js = generateTreatmentJS(treatment);
        if (js) jsParts.push(js);
    }

    return {
        css: cssParts.join("\n\n"),
        js: jsParts.length > 0 ? wrapJS(jsParts) : "",
    };
}

// ── CSS per treatment ─────────────────────────────────────────────────────────

/**
 * All CSS values reference genome custom properties.
 * Font sizes use --size-display-* vars set by the genome variable system.
 * Colours use --color-primary, --color-accent, --color-text.
 * Timing uses --duration-*, --ease-genome.
 * Tracking/leading use --tracking-* and --leading-* vars.
 */
function generateTreatmentCSS(treatment: TypographyTreatment): string {
    switch (treatment) {

        case "oversized_display":
            return `/* oversized_display */
.type-oversized {
  font-size: var(--size-display-max, clamp(4rem, 12vw, 14rem));
  font-weight: var(--weight-display, 900);
  letter-spacing: var(--tracking-display, -0.03em);
  line-height: var(--leading-display, 0.9);
  font-family: var(--font-anchor);
}`;

        case "split_char":
            return `/* split_char — JS populates .char > .char-inner at runtime */
.type-split-char .char {
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
}
.type-split-char .char-inner {
  display: inline-block;
  transform: translateY(110%);
  transition: transform var(--duration-fast, 0.4s) var(--ease-genome, cubic-bezier(0.16,1,0.3,1));
}
.type-split-char.revealed .char-inner {
  transform: translateY(0);
}`;

        case "split_word":
            return `/* split_word — JS populates .word at runtime */
.type-split-word .word {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
}
.type-split-word .word-inner {
  display: inline-block;
  transform: translateY(105%);
  transition: transform var(--duration-med, 0.55s) var(--ease-genome, cubic-bezier(0.16,1,0.3,1));
}
.type-split-word.revealed .word-inner {
  transform: translateY(0);
}`;

        case "kinetic_weight":
            return `/* kinetic_weight — requires variable font with 'wght' axis */
.type-kinetic-weight {
  font-variation-settings: "wght" var(--kinetic-weight, 400);
  transition: font-variation-settings var(--duration-med, 0.4s) var(--ease-genome, ease);
}
.type-kinetic-weight:hover {
  font-variation-settings: "wght" var(--weight-display, 900);
}`;

        case "scramble_reveal":
            return `/* scramble_reveal — JS handles character scrambling */
.type-scramble {
  font-family: var(--font-anchor);
}
.type-scramble[data-scrambling="true"] {
  opacity: var(--opacity-secondary);
}`;

        case "stagger_line":
            return `/* stagger_line */
.type-stagger-line .line {
  display: block;
  overflow: hidden;
}
.type-stagger-line .line-inner {
  display: block;
  transform: translateY(100%);
  transition: transform var(--duration-slow, 0.7s) var(--ease-genome, cubic-bezier(0.16,1,0.3,1));
}
.type-stagger-line.revealed .line-inner {
  transform: translateY(0);
}
.type-stagger-line.revealed .line-inner:nth-child(2) { transition-delay: var(--stagger-line-2, 0.08s); }
.type-stagger-line.revealed .line-inner:nth-child(3) { transition-delay: var(--stagger-line-3, 0.16s); }
.type-stagger-line.revealed .line-inner:nth-child(4) { transition-delay: var(--stagger-line-4, 0.24s); }`;

        case "ghost_text":
            return `/* ghost_text */
.type-ghost {
  position: absolute;
  font-size: var(--size-display-max, clamp(8rem, 25vw, 22rem));
  font-weight: var(--weight-display, 900);
  font-family: var(--font-anchor);
  color: var(--color-primary);
  opacity: var(--opacity-ghost, 0.05);
  pointer-events: none;
  user-select: none;
  letter-spacing: var(--tracking-ultra, -0.05em);
  line-height: 0.85;
  white-space: nowrap;
  overflow: hidden;
  z-index: 0;
}`;

        case "inverted_hierarchy":
            return `/* inverted_hierarchy — display headline smaller than body lead */
.type-inverted {
  font-size: var(--size-body-lg, clamp(1rem, 1.5vw, 1.25rem));
  font-weight: var(--weight-body, 300);
  letter-spacing: var(--tracking-loose, 0.08em);
  font-family: var(--font-anchor);
  text-transform: uppercase;
}
.type-inverted + .section-body {
  font-size: var(--size-display-sm, clamp(2rem, 4vw, 4rem));
  font-weight: var(--weight-display, 700);
  letter-spacing: var(--tracking-tight, -0.02em);
  line-height: var(--leading-display, 1.0);
}`;

        case "color_split":
            return `/* color_split — first span primary, second span accent */
.type-color-split .split-primary { color: var(--color-primary); }
.type-color-split .split-accent  { color: var(--color-accent); }`;

        case "outline_solid":
            return `/* outline_solid — alternating outline / solid per line */
.type-outline-solid .line-solid {
  color: var(--color-primary);
}
.type-outline-solid .line-outline {
  color: transparent;
  -webkit-text-stroke: var(--line-weight, 1px) var(--color-primary);
}`;

        case "massive_numeral":
            return `/* massive_numeral */
.type-massive-numeral {
  font-size: var(--size-display-max, clamp(6rem, 18vw, 22rem));
  font-weight: var(--weight-display, 900);
  font-family: var(--font-accent, var(--font-anchor));
  font-variant-numeric: tabular-nums;
  color: var(--color-primary);
  letter-spacing: var(--tracking-ultra, -0.04em);
  line-height: 1;
}`;

        case "optical_tight":
            return `/* optical_tight */
.type-optical-tight,
.type-optical-tight h1,
.type-optical-tight h2 {
  letter-spacing: var(--tracking-ultra, -0.04em);
}`;

        case "text_wrap_balance":
            return `/* text_wrap_balance */
h1, h2, h3, .type-wrap-balance { text-wrap: balance; }
p, .type-wrap-balance p { text-wrap: pretty; }`;

        default:
            return `/* typography treatment: ${treatment} */`;
    }
}

// ── JS per treatment ──────────────────────────────────────────────────────────

function generateTreatmentJS(treatment: TypographyTreatment): string {
    switch (treatment) {

        case "split_char":
            return `
  // split_char — wrap each character in .char > .char-inner
  function initSplitChar() {
    document.querySelectorAll('.type-split-char').forEach(el => {
      const text = el.textContent || '';
      el.innerHTML = text.split('').map((ch, i) =>
        \`<span class="char" aria-hidden="true" style="--char-index:\${i}"><span class="char-inner">\${ch === ' ' ? '&nbsp;' : ch}</span></span>\`
      ).join('');
      el.setAttribute('aria-label', text);
      requestAnimationFrame(() => el.classList.add('revealed'));
    });
  }`;

        case "split_word":
            return `
  // split_word — wrap each word in .word > .word-inner
  function initSplitWord() {
    document.querySelectorAll('.type-split-word').forEach(el => {
      const text = el.textContent || '';
      el.innerHTML = text.split(' ').map((word, i) =>
        \`<span class="word" style="--word-index:\${i}"><span class="word-inner">\${word}</span></span>\`
      ).join(' ');
      requestAnimationFrame(() => el.classList.add('revealed'));
    });
  }`;

        case "stagger_line":
            return `
  // stagger_line — observe and reveal
  function initStaggerLine() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.type-stagger-line').forEach(el => obs.observe(el));
  }`;

        case "kinetic_weight":
            return `
  // kinetic_weight — drive weight via scroll position
  function initKineticWeight() {
    const els = document.querySelectorAll('.type-kinetic-weight');
    if (!els.length) return;
    window.addEventListener('scroll', () => {
      const progress = Math.min(1, window.scrollY / (document.body.scrollHeight - window.innerHeight));
      const weight = Math.round(100 + progress * 800); // 100–900 range
      els.forEach(el => el.style.setProperty('--kinetic-weight', String(weight)));
    }, { passive: true });
  }`;

        case "scramble_reveal":
            return `
  // scramble_reveal — characters scramble then settle
  function initScrambleReveal() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    function scramble(el) {
      const original = el.textContent;
      el.dataset.scrambling = 'true';
      let frame = 0;
      const total = original.length * 3;
      function step() {
        el.textContent = original.split('').map((ch, i) => {
          if (ch === ' ') return ' ';
          return frame > i * 3 ? original[i] : chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        if (frame < total) { frame++; requestAnimationFrame(step); }
        else { el.textContent = original; delete el.dataset.scrambling; }
      }
      step();
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { scramble(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.3 });
    document.querySelectorAll('.type-scramble').forEach(el => obs.observe(el));
  }`;

        default:
            return "";
    }
}

// ── JS wrapper ────────────────────────────────────────────────────────────────

function wrapJS(parts: string[]): string {
    const calls = parts
        .map(p => {
            const match = p.match(/function (\w+)\(/);
            return match ? `  ${match[1]}();` : "";
        })
        .filter(Boolean);

    return `
// ── Typography Engine ───────────────────────────────────────────────────────
(function() {
  'use strict';
${parts.join("\n")}

  function initTypography() {
${calls.join("\n")}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTypography);
  } else {
    initTypography();
  }
})();`;
}
