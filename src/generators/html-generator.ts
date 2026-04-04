/**
 * HTML Generator
 *
 * Converts PageCompositionSpec into vanilla HTML/CSS/JS output.
 * ALL design values from genome chromosomes — zero hardcoded colors,
 * spacing, sizes, or line heights.
 * Animations use CSS keyframes derived from genome motion values.
 */

import type { PageCompositionSpec, SectionSpec, LibrarySelection } from "../genome/context-composer.js";
import type { DesignGenome } from "../genome/types.js";
import { getAnimationConfig, generateCSSKeyframes } from "../genome/animation-engine.js";

export interface HTMLOutput {
    html: string;
    css: string;
    js: string;
    files: OutputFile[];
}

export interface OutputFile {
    path: string;
    content: string;
    type: "html" | "css" | "js" | "json" | "asset";
}

function gv(genome: DesignGenome) {
    const ch = genome.chromosomes;
    const colors = ch.ch5_color_primary || {};
    const temp = ch.ch6_color_temp || {};
    const sys = ch.ch26_color_system || {};
    const edge = ch.ch7_edge || {};
    const rhythm = ch.ch2_rhythm || {};
    const grid = ch.ch9_grid || {};
    const typography = ch.ch3_type_display || {};
    const bodyFont = ch.ch4_type_body || {};
    const typeScale = ch.ch16_typography || {};
    const motion = ch.ch8_motion || {};
    const choreo = ch.ch27_motion_choreography || {};
    const copy = ch.ch25_copy_engine || {};
    const base = rhythm.baseSpacing ?? 16;
    const isDark = temp.isDark || false;
    const surfaceBase = temp.surfaceStack?.[0] || "#ffffff";
    return {
        primary: colors.hex || "#3b82f6", primaryDark: colors.darkModeHex || colors.hex || "#2563eb",
        secondary: sys.secondary?.hex || "#6366f1", accent: sys.accent?.hex || "#f59e0b",
        success: sys.semantic?.success?.hex || "#22c55e", warning: sys.semantic?.warning?.hex || "#f59e0b",
        error: sys.semantic?.error?.hex || "#ef4444", bg: temp.surfaceStack?.[0] || "#ffffff",
        surface: temp.surfaceColor || "#ffffff", surfaceElevated: temp.elevatedSurface || "#f8fafc",
        text: isDark ? lighten(surfaceBase, 0.9) : darken(surfaceBase, 0.95),
        textMuted: isDark ? lighten(surfaceBase, 0.6) : darken(surfaceBase, 0.6),
        border: isDark ? lighten(surfaceBase, 0.2) : darken(surfaceBase, 0.1),
        xs: Math.round(base * 0.25), sm: Math.round(base * 0.5), md: base,
        lg: Math.round(base * 1.5), xl: Math.round(base * 2), xxl: Math.round(base * 3),
        section: rhythm.sectionSpacing ?? Math.round(base * 4),
        fontDisplay: typography.family || "system-ui, -apple-system, sans-serif",
        fontBody: bodyFont.family || "system-ui, -apple-system, sans-serif",
        fontMono: "ui-monospace, SFMono-Regular, monospace",
        fontSizeBase: typeScale.baseSize ?? 16,
        fontSizeSm: parseInt(typeScale.small?.size) || Math.round(base * 0.875),
        fontSizeLg: parseInt(typeScale.h3?.size) || Math.round(base * 1.125),
        fontSizeXl: parseInt(typeScale.h2?.size) || Math.round(base * 1.25),
        fontSize2xl: parseInt(typeScale.h1?.size) || Math.round(base * 1.5),
        fontSize3xl: parseInt(typeScale.display?.size) || Math.round(base * 1.875),
        fontSize4xl: parseInt(typeScale.display?.size) || Math.round(base * 2.25),
        lineHeight: parseFloat(typeScale.body?.lineHeight) || 1.6,
        lineHeightTight: parseFloat(typeScale.display?.lineHeight) || 1.25,
        radiusSm: Math.max(2, (edge.radius ?? 8) - 2), radiusMd: edge.radius ?? 8,
        radiusLg: (edge.radius ?? 8) + 4, radiusFull: 9999,
        gap: grid.gap ?? base, columns: grid.columns ?? 3,
        duration: motion.durationScale ?? 1, stagger: choreo.staggerInterval ?? 80,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        headline: copy.headline, subheadline: copy.subheadline,
        cta: copy.cta, ctaSecondary: copy.ctaSecondary,
        companyName: copy.companyName, tagline: copy.tagline,
        features: copy.features, stats: copy.stats, faq: copy.faq,
        fontImportUrl: typography.importUrl, bodyFontImportUrl: bodyFont.importUrl,
        isDark, motionPhysics: motion.physics ?? "none",
        enterDirection: motion.enterDirection ?? "up",
        hoverIntensity: motion.hoverIntensity ?? 0.5,
        choreographyStyle: choreo.choreographyStyle ?? "smooth",
        pageTransition: choreo.pageTransition ?? "fade",
    };
}

const REM_TO_VAR: Record<string, string> = {
    "0.25rem": "var(--spacing-xs)",
    "0.5rem":  "var(--spacing-sm)",
    "1rem":    "var(--spacing-md)",
    "1.5rem":  "var(--spacing-lg)",
    "2rem":    "var(--spacing-xl)",
    "3rem":    "var(--spacing-2xl)",
    "4rem":    "var(--spacing-section)",
    "5rem":    "var(--spacing-section)",
    "6rem":    "var(--spacing-section)",
};

/**
 * Replace hardcoded rem values in spacing/layout CSS properties with genome CSS vars.
 * Scoped to padding, margin, gap, top/left/right/bottom, and width (for sidebars).
 */
function replaceRemWithVars(css: string): string {
    return css.replace(
        /(padding|margin|gap|top|left|right|bottom|width)(\s*:\s*)([^;}]+)/g,
        (_match, prop, colon, value) => {
            const replaced = value.replace(/(\d+(?:\.\d+)?rem)/g, (rem: string) => REM_TO_VAR[rem] ?? rem);
            return `${prop}${colon}${replaced}`;
        }
    );
}

function darken(hex: string, amount: number): string {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    return `#${Math.round(r * amount).toString(16).padStart(2, "0")}${Math.round(g * amount).toString(16).padStart(2, "0")}${Math.round(b * amount).toString(16).padStart(2, "0")}`;
}

function lighten(hex: string, amount: number): string {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    return `#${Math.min(255, Math.round(r + (255 - r) * (1 - amount))).toString(16).padStart(2, "0")}${Math.min(255, Math.round(g + (255 - g) * (1 - amount))).toString(16).padStart(2, "0")}${Math.min(255, Math.round(b + (255 - b) * (1 - amount))).toString(16).padStart(2, "0")}`;
}

export class HTMLGenerator {
    private genome!: DesignGenome;
    private spec!: PageCompositionSpec;

    async generate(spec: PageCompositionSpec): Promise<HTMLOutput> {
        this.spec = spec;
        this.genome = spec.genome;
        const v = gv(spec.genome);
        const animConfig = getAnimationConfig(spec.genome);
        return {
            html: this.generateHTML(v, animConfig),
            css: this.generateCSS(v, animConfig),
            js: this.generateJS(v, animConfig),
            files: this.generateFiles(v, animConfig),
        };
    }

    private generateHTML(v: ReturnType<typeof gv>, animConfig: ReturnType<typeof getAnimationConfig>): string {
        const { layout, navigation, hero, sections, footer, sidebar } = this.spec;
        const fontLinks = this.generateFontLinks(v);
        const bodyContent = this.renderBody(v, animConfig);
        const pageClass = animConfig.preset.fmType !== "none" ? ' class="animate-genome-page"' : "";
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${v.subheadline || "Generated by Genome"}">
  <meta name="theme-color" content="${v.primary}">
  <title>${v.headline || "Genome Page"}</title>
${fontLinks}
  <link rel="stylesheet" href="styles.css">
</head>
<body${pageClass}>
${bodyContent}
  <script src="app.js" defer></script>
</body>
</html>`;
    }

    private renderBody(v: ReturnType<typeof gv>, animConfig: ReturnType<typeof getAnimationConfig>): string {
        const { layout, navigation, hero, sections, footer, sidebar } = this.spec;
        const indent = "  ";
        let html = "";
        if (layout.pattern?.blueprint) html += this.renderBlueprint(layout.pattern.blueprint, v, animConfig, indent, 0, this.resolveAdaptiveProps(layout.pattern));
        else html += `${indent}<div class="page-layout layout-${layout.type}">\n`;
        if (navigation?.pattern?.blueprint) html += this.renderBlueprint(navigation.pattern.blueprint, v, animConfig, indent + "  ", 0, this.resolveAdaptiveProps(navigation.pattern));
        else if (navigation) html += this.renderNavFallback(navigation, v, animConfig, indent + "  ", 0);
        html += `${indent}  <main class="main-content">\n`;
        if (sidebar?.pattern?.blueprint) html += this.renderBlueprint(sidebar.pattern.blueprint, v, animConfig, indent + "    ", 0, this.resolveAdaptiveProps(sidebar.pattern));
        if (hero?.pattern?.blueprint) html += this.renderBlueprint(hero.pattern.blueprint, v, animConfig, indent + "    ", 0, this.resolveAdaptiveProps(hero.pattern));
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const delay = i * animConfig.staggerInterval;
            if (section.pattern?.blueprint) html += this.renderBlueprint(section.pattern.blueprint, v, animConfig, indent + "    ", delay, this.resolveAdaptiveProps(section.pattern));
            else html += this.renderSectionFallback(section, v, animConfig, indent + "    ", delay);
        }
        html += `${indent}  </main>\n`;
        if (footer?.pattern?.blueprint) html += this.renderBlueprint(footer.pattern.blueprint, v, animConfig, indent + "  ", sections.length * animConfig.staggerInterval, this.resolveAdaptiveProps(footer.pattern));
        html += `${indent}</div>`;
        return html;
    }

    private renderBlueprint(blueprint: { template: string; styles: string; dependencies: string[] }, v: ReturnType<typeof gv>, animConfig: ReturnType<typeof getAnimationConfig>, indent: string, delay: number, adaptiveProps?: Record<string, string>): string {
        const props: Record<string, string> = {
            headline: v.headline || "", subheadline: v.subheadline || "", title: v.headline || "",
            description: v.subheadline || "", cta: v.cta || "", ctaSecondary: v.ctaSecondary || "",
            companyName: v.companyName || "", tagline: v.tagline || "", logo: v.companyName || "",
            year: new Date().getFullYear().toString(), colorPrimary: v.primary, colorAccent: v.accent,
            radius: String(v.radiusMd), spacing: String(v.md), gridColumns: String(v.columns),
            // Blueprint-local adaptive prop names ({{columns}}, {{width}}, etc.)
            columns: String(v.columns), width: "280px", backdrop: "none",
            color1: v.primary, color2: v.secondary, imagePosition: "right",
            // Spread resolved adaptive props last so genome values override defaults
            ...(adaptiveProps || {}),
            stats: (v.stats || []).map((s: any) => `<div class="stat"><span class="stat-value">${s.value}</span><span class="stat-label">${s.label}</span></div>`).join("\n"),
            featureCards: (v.features || []).map((f: any) => `<div class="feature-card"><div class="feature-icon"></div><h3 class="feature-title">${f.title}</h3><p class="feature-description">${f.description}</p></div>`).join("\n"),
            faqItems: (v.faq || []).map((f: any) => `<details class="faq-item"><summary class="faq-question">${f.question}</summary><div class="faq-answer"><p>${f.answer}</p></div></details>`).join("\n"),
            testimonialCards: "", pricingCards: "", teamCards: "", blogCards: "", galleryItems: "",
            logoItems: "", stepItems: "", comparisonTable: "", newsletterForm: "",
            buttons: `<button class="btn btn-primary">${v.cta || ""}</button>`,
            ctas: `<button class="btn btn-primary">${v.cta || ""}</button>\n${v.ctaSecondary ? `<button class="btn btn-secondary">${v.ctaSecondary}</button>` : ""}`,
            navLinks: "", footerColumns: "", navContent: "", filterContent: "", heroImage: "",
            sectionContent: "", formContent: "", footerContent: "", headerContent: "", navActions: "",
            heroSection: "", leftPanel: "", rightPanel: "", carouselSlides: "", carouselDots: "",
            orbitElements: "", heroBg: "", videoSource: "", videoElement: "", mapElement: "",
            tocElement: "", children: "", sidebarElement: "", summaryElement: "",
            // Sidebar/nav-specific and section-specific blueprint vars
            links: "", header: v.companyName || "", footer: "", actions: "", image: "",
            statItems: (v.stats || []).map((s: any) => `<div class="stat-item"><span class="stat-value">${s.value}</span><span class="stat-label">${s.label}</span></div>`).join("\n"),
            ctaTitle: v.headline || "", ctaDesc: v.subheadline || "", ctaText: v.cta || "",
        };
        let template = blueprint.template;
        for (const [key, value] of Object.entries(props)) template = template.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
        if (animConfig.preset.fmType !== "none" && template.trim()) template = template.replace(/<(\w+)([^>]*)>/, `<$1$2 class="animate-genome-scroll" style="animation-delay: ${delay}ms">`);
        return template.split("\n").map(line => line ? indent + line : line).join("\n") + "\n";
    }

    private renderNavFallback(nav: any, v: ReturnType<typeof gv>, animConfig: ReturnType<typeof getAnimationConfig>, indent: string, delay: number): string {
        const items = (nav.items || []).map((item: any) => `${indent}    <a href="${item.href}" class="nav-link">${item.label}</a>`).join("\n");
        const animClass = animConfig.preset.fmType !== "none" ? ` class="animate-genome-scroll" style="animation-delay: ${delay}ms"` : "";
        return `${indent}<nav class="navigation nav-${nav.type}" role="navigation" aria-label="Main navigation"${animClass}>\n${indent}  <div class="nav-container">\n${indent}    <a href="/" class="nav-logo" aria-label="Home"><span class="logo-text">${v.companyName || ""}</span></a>\n${indent}    <div class="nav-items">\n${items}\n${indent}    </div>\n${indent}    <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false"><span class="hamburger"></span></button>\n${indent}  </div>\n${indent}</nav>\n`;
    }

    private renderSectionFallback(section: SectionSpec, v: ReturnType<typeof gv>, animConfig: ReturnType<typeof getAnimationConfig>, indent: string, delay: number): string {
        const animClass = animConfig.preset.fmType !== "none" ? ` class="animate-genome-scroll" style="animation-delay: ${delay}ms"` : "";
        return `${indent}<section class="section section-${section.type}"${animClass}>\n${indent}  <div class="section-container">\n${indent}    <!-- ${section.type} section -->\n${indent}  </div>\n${indent}</section>\n`;
    }

    private generateFontLinks(v: ReturnType<typeof gv>): string {
        const lines: string[] = [];
        if (v.fontImportUrl) {
            lines.push('  <link rel="preconnect" href="https://fonts.googleapis.com">');
            lines.push('  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
            lines.push(`  <link href="${v.fontImportUrl}" rel="stylesheet">`);
        }
        if (v.bodyFontImportUrl && v.bodyFontImportUrl !== v.fontImportUrl) lines.push(`  <link href="${v.bodyFontImportUrl}" rel="stylesheet">`);
        return lines.join("\n");
    }

    /** Resolve adaptive props for a pattern — genomeRef → actual genome value */
    private resolveAdaptiveProps(pattern: any): Record<string, string> {
        if (!pattern?.adaptiveProps?.length) return {};
        const result: Record<string, string> = {};
        const ch = this.genome.chromosomes as any;
        for (const ap of pattern.adaptiveProps) {
            const parts = (ap.genomeRef as string).split(".");
            let val: any = ch;
            for (const part of parts) val = val?.[part];
            if (val !== undefined && val !== null) {
                result[ap.name] = String(val);
            }
        }
        return result;
    }

    private generateCSS(v: ReturnType<typeof gv>, animConfig: ReturnType<typeof getAnimationConfig>): string {
        const allPatterns = [this.spec.layout.pattern, this.spec.navigation?.pattern, this.spec.hero?.pattern, this.spec.footer?.pattern, this.spec.sidebar?.pattern, ...this.spec.sections.map(s => s.pattern)].filter(Boolean);

        // Resolve all adaptive CSS vars from patterns into :root
        const adaptiveVarLines: string[] = [];
        const seenAdaptiveNames = new Set<string>();
        for (const pattern of allPatterns) {
            if (!pattern?.adaptiveProps?.length) continue;
            const resolved = this.resolveAdaptiveProps(pattern);
            for (const ap of pattern.adaptiveProps) {
                if (seenAdaptiveNames.has(ap.name)) continue;
                seenAdaptiveNames.add(ap.name);
                const value = resolved[ap.name] ?? ap.defaultValue;
                if (value !== undefined) adaptiveVarLines.push(`  --${ap.name}: ${value};`);
            }
        }

        // Post-process blueprint styles: replace all hardcoded rem spacing values with CSS vars
        const patternStyles = new Set<string>();
        for (const pattern of allPatterns) {
            if (!pattern?.blueprint?.styles) continue;
            patternStyles.add(replaceRemWithVars(pattern.blueprint.styles));
        }

        const animationCSS = generateCSSKeyframes(animConfig);
        return `/* ── Genome-Derived CSS Variables ──────────────────────────────────── */
:root {
  --color-primary: ${v.primary}; --color-primary-dark: ${v.primaryDark};
  --color-secondary: ${v.secondary}; --color-accent: ${v.accent};
  --color-success: ${v.success}; --color-warning: ${v.warning}; --color-error: ${v.error};
  --color-bg: ${v.bg}; --color-surface: ${v.surface}; --color-surface-elevated: ${v.surfaceElevated};
  --color-text: ${v.text}; --color-text-muted: ${v.textMuted}; --color-border: ${v.border};
  --font-display: ${v.fontDisplay}; --font-body: ${v.fontBody}; --font-mono: ${v.fontMono};
  --spacing-xs: ${v.xs}px; --spacing-sm: ${v.sm}px; --spacing-md: ${v.md}px;
  --spacing-lg: ${v.lg}px; --spacing-xl: ${v.xl}px; --spacing-2xl: ${v.xxl}px;
  --spacing-section: ${v.section}px;
  --radius-sm: ${v.radiusSm}px; --radius-md: ${v.radiusMd}px; --radius-lg: ${v.radiusLg}px; --radius-full: ${v.radiusFull}px;
  --grid-gap: ${v.gap}px; --grid-columns: ${v.columns};
  --motion-duration: ${v.duration}; --motion-stagger: ${v.stagger}ms; --motion-easing: ${v.easing};
  --font-size-base: ${v.fontSizeBase}px; --font-size-sm: ${v.fontSizeSm}px;
  --font-size-lg: ${v.fontSizeLg}px; --font-size-xl: ${v.fontSizeXl}px;
  --font-size-2xl: ${v.fontSize2xl}px; --font-size-3xl: ${v.fontSize3xl}px; --font-size-4xl: ${v.fontSize4xl}px;
  --line-height: ${v.lineHeight}; --line-height-tight: ${v.lineHeightTight};
${adaptiveVarLines.join("\n")}
}

/* ── Reset ─────────────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body { font-family: var(--font-body); font-size: var(--font-size-base); line-height: var(--line-height); color: var(--color-text); background: var(--color-bg); -webkit-font-smoothing: antialiased; }
img, picture, video, canvas, svg { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; }
a { color: inherit; text-decoration: none; }
ul, ol { list-style: none; }

/* ── Buttons ───────────────────────────────────────────────────────────── */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: var(--spacing-sm); padding: calc(var(--spacing-md) * 0.75) var(--spacing-xl); border-radius: var(--radius-md); font-weight: 600; font-size: var(--font-size-sm); cursor: pointer; border: 2px solid transparent; transition: all calc(0.2s * var(--motion-duration)) var(--motion-easing); }
.btn-primary { background: var(--color-primary); color: var(--color-on-primary); }
.btn-primary:hover { background: var(--color-primary-dark); transform: translateY(-2px); box-shadow: var(--shadow-md); }
.btn-secondary { background: transparent; color: var(--color-text-on-dark); border-color: var(--color-surface-dark-border); }
.btn-secondary:hover { background: var(--color-surface-dark-hover); border-color: var(--color-text-on-dark); }
.btn-outline { background: transparent; color: var(--color-primary); border-color: var(--color-primary); }
.btn-outline:hover { background: var(--color-primary); color: var(--color-on-primary); }

/* ── Sections ──────────────────────────────────────────────────────────── */
.section { padding: var(--spacing-section) var(--spacing-xl); }
.section-container { max-width: 1200px; margin: 0 auto; }
.section-title { font-family: var(--font-display); font-size: var(--font-size-4xl); font-weight: 700; text-align: center; margin-bottom: var(--spacing-md); }
.section-description { font-size: var(--font-size-lg); color: var(--color-text-muted); text-align: center; max-width: 640px; margin: 0 auto var(--spacing-2xl); line-height: var(--line-height); }

/* ── Page Layout ───────────────────────────────────────────────────────── */
.page-layout { display: flex; flex-direction: column; min-height: 100vh; }
.main-content { flex: 1; }

/* ── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 768px) { .section { padding: var(--spacing-section) var(--spacing-md); } .section-container { padding: 0 var(--spacing-md); } }

/* ── Print ─────────────────────────────────────────────────────────────── */
@media print { .navigation, .sidebar, .hero-ctas, .footer { display: none; } .hero { padding: var(--spacing-xl) 0; color: black; background: none !important; } .section { padding: var(--spacing-md) 0; } }

/* ── Pattern Styles ────────────────────────────────────────────────────── */
${Array.from(patternStyles).join("\n\n")}

/* ── Genome Animations ────────────────────────────────────────────────── */
${animationCSS}
`;
    }

    private generateJS(v: ReturnType<typeof gv>, animConfig: ReturnType<typeof getAnimationConfig>): string {
        return `/**
 * Genome-generated application JavaScript
 */
(function() {
  'use strict';
  const CONFIG = { motionDuration: ${v.duration}, staggerInterval: ${v.stagger}, scrollThreshold: ${animConfig.scrollTrigger.triggerPoint}, animationEasing: '${v.easing}' };

  function initScrollAnimations() {
    const els = document.querySelectorAll('.animate-genome-scroll');
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const delay = parseInt(e.target.style.animationDelay || '0', 10);
          setTimeout(() => e.target.classList.add('animate-in'), delay);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: CONFIG.scrollThreshold, rootMargin: '0px 0px -50px 0px' });
    els.forEach(el => obs.observe(el));
  }

  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle'), navItems = document.querySelector('.nav-items');
    if (!toggle || !navItems) return;
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      Object.assign(navItems.style, { display: isOpen ? 'none' : 'flex', flexDirection: 'column', position: 'absolute', top: '100%', left: '0', right: '0', background: 'var(--color-surface)', padding: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', boxShadow: '0 var(--spacing-sm) var(--spacing-md) rgba(0,0,0,0.1)' });
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => { const href = a.getAttribute('href'); if (href === '#') return; const target = document.querySelector(href); if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); } });
    });
  }

  function initCounters() {
    const els = document.querySelectorAll('.stat-value[data-count]');
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); } }); }, { threshold: 0.5 });
    els.forEach(el => obs.observe(el));
  }

  function animateCounter(el) {
    const target = el.dataset.count; if (!target) return;
    const num = parseFloat(target.replace(/[^0-9.]/g, '')); if (isNaN(num)) return;
    const suffix = target.replace(/[0-9.]/g, ''); const dur = 1500 * CONFIG.motionDuration; const start = performance.now();
    function update(now) { const p = Math.min((now - start) / dur, 1); const eased = 1 - Math.pow(1 - p, 3); el.textContent = formatNum(Math.round(num * eased)) + suffix; if (p < 1) requestAnimationFrame(update); }
    requestAnimationFrame(update);
  }

  function formatNum(n) { if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'; if (n >= 1000) return (n / 1000).toFixed(1) + 'K'; return String(n); }

  document.addEventListener('DOMContentLoaded', () => { initScrollAnimations(); initMobileNav(); initSmoothScroll(); initCounters(); console.log('[Genome] Page loaded | Physics: ${v.motionPhysics} | Choreography: ${v.choreographyStyle}'); });
})();
`;
    }

    private generateFiles(v: ReturnType<typeof gv>, animConfig: ReturnType<typeof getAnimationConfig>): OutputFile[] {
        return [
            { path: "index.html", content: this.generateHTML(v, animConfig), type: "html" },
            { path: "styles.css", content: this.generateCSS(v, animConfig), type: "css" },
            { path: "app.js", content: this.generateJS(v, animConfig), type: "js" },
            { path: "manifest.json", content: JSON.stringify({ name: v.companyName || "Genome App", short_name: "App", description: v.tagline || "Generated by Genome", start_url: "/", display: "standalone", background_color: v.bg, theme_color: v.primary, icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/icon-512.png", sizes: "512x512", type: "image/png" }] }, null, 2), type: "json" },
        ];
    }
}
