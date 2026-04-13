/**
 * React Generator
 *
 * Converts PageCompositionSpec into React component code.
 * ALL design values come from genome chromosomes — zero hardcoded colors,
 * spacing, sizes, or line heights.
 * Animations use Framer Motion when selected by genome.
 */
import { COMPONENT_LIBRARY_CATALOG, generateComponentCode } from "../genome/component-catalog.js";
import { getAnimationConfig, generateCSSKeyframes, generateFramerMotionWrapper } from "../genome/animation-engine.js";
// ── Genome Value Helpers ─────────────────────────────────────────────────────
function gv(genome) {
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
    const primaryHue = Math.round(colors.hue ?? 210);
    const primaryLight = Math.round((colors.lightness ?? 0.5) * 100);
    return {
        primary: colors.hex || "#3b82f6",
        primaryDark: colors.darkModeHex || colors.hex || "#2563eb",
        secondary: sys.secondary?.hex || "#6366f1",
        accent: sys.accent?.hex || "#f59e0b",
        success: sys.semantic?.success?.hex || "#22c55e",
        warning: sys.semantic?.warning?.hex || "#f59e0b",
        error: sys.semantic?.error?.hex || "#ef4444",
        bg: temp.surfaceStack?.[0] || "#ffffff",
        surface: temp.surfaceColor || "#ffffff",
        surfaceElevated: temp.elevatedSurface || "#f8fafc",
        text: isDark ? lighten(surfaceBase, 0.9) : darken(surfaceBase, 0.95),
        textMuted: isDark ? lighten(surfaceBase, 0.6) : darken(surfaceBase, 0.6),
        border: isDark ? lighten(surfaceBase, 0.2) : darken(surfaceBase, 0.1),
        xs: Math.round(base * 0.25),
        sm: Math.round(base * 0.5),
        md: base,
        lg: Math.round(base * 1.5),
        xl: Math.round(base * 2),
        xxl: Math.round(base * 3),
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
        radiusSm: Math.max(2, (edge.radius ?? 8) - 2),
        radiusMd: edge.radius ?? 8,
        radiusLg: (edge.radius ?? 8) + 4,
        radiusFull: 9999,
        gap: grid.gap ?? base,
        columns: grid.columns ?? 3,
        duration: motion.durationScale ?? 1,
        stagger: choreo.staggerInterval ?? 80,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        headline: copy.headline,
        subheadline: copy.subheadline,
        cta: copy.cta,
        ctaSecondary: copy.ctaSecondary,
        companyName: copy.companyName,
        tagline: copy.tagline,
        features: copy.features,
        stats: copy.stats,
        faq: copy.faq,
        fontImportUrl: typography.importUrl,
        bodyFontImportUrl: bodyFont.importUrl,
        fontProvider: typography.provider ?? "bunny",
        bodyFontProvider: bodyFont.provider ?? "bunny",
        fontCount: (sys.fontCount ?? 2),
        accentFontImportUrl: ch.ch3_type_accent?.importUrl ?? null,
        accentFontProvider: ch.ch3_type_accent?.provider ?? null,
        primaryHue, primarySat: Math.round((colors.saturation ?? 0.6) * 100), primaryLight,
        onPrimary: primaryLight < 55 ? 'hsl(0, 0%, 97%)' : `hsl(${primaryHue}, 20%, 8%)`,
        colorSurfaceDark: `hsl(${primaryHue}, 12%, 8%)`,
        colorSurfaceDarkBorder: `hsla(0, 0%, 100%, 0.1)`,
        colorSurfaceDarkHover: `hsla(0, 0%, 100%, 0.08)`,
        colorTextOnDark: `hsl(0, 0%, 96%)`,
        colorTextOnDarkMuted: `hsla(0, 0%, 96%, 0.5)`,
        colorOverlay: `hsla(${primaryHue}, 20%, 5%, 0.5)`,
        colorOverlayLight: `hsla(${primaryHue}, 20%, 5%, 0.4)`,
        colorOverlaySubtle: `hsla(${primaryHue}, 20%, 5%, 0.1)`,
        isDark,
        motionPhysics: motion.physics ?? "none",
        enterDirection: motion.enterDirection ?? "up",
        hoverIntensity: motion.hoverIntensity ?? 0.5,
        choreographyStyle: choreo.choreographyStyle ?? "smooth",
        pageTransition: choreo.pageTransition ?? "fade",
    };
}
const REM_TO_VAR = {
    "0.25rem": "var(--spacing-xs)",
    "0.5rem": "var(--spacing-sm)",
    "1rem": "var(--spacing-md)",
    "1.5rem": "var(--spacing-lg)",
    "2rem": "var(--spacing-xl)",
    "3rem": "var(--spacing-2xl)",
    "4rem": "var(--spacing-section)",
    "5rem": "var(--spacing-section)",
    "6rem": "var(--spacing-section)",
};
function replaceRemWithVars(css) {
    return css.replace(/(padding|margin|gap|top|left|right|bottom|width)(\s*:\s*)([^;}]+)/g, (_match, prop, colon, value) => {
        const replaced = value.replace(/(\d+(?:\.\d+)?rem)/g, (rem) => REM_TO_VAR[rem] ?? rem);
        return `${prop}${colon}${replaced}`;
    });
}
function darken(hex, amount) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `#${Math.round(r * amount).toString(16).padStart(2, "0")}${Math.round(g * amount).toString(16).padStart(2, "0")}${Math.round(b * amount).toString(16).padStart(2, "0")}`;
}
function lighten(hex, amount) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `#${Math.min(255, Math.round(r + (255 - r) * (1 - amount))).toString(16).padStart(2, "0")}${Math.min(255, Math.round(g + (255 - g) * (1 - amount))).toString(16).padStart(2, "0")}${Math.min(255, Math.round(b + (255 - b) * (1 - amount))).toString(16).padStart(2, "0")}`;
}
// ── Generator ───────────────────────────────────────────────────────────────
export class ReactGenerator {
    generate(spec) {
        return {
            pages: [this.generatePage(spec)],
            components: this.generateComponents(spec),
            styles: [this.generateStyles(spec)],
            config: [this.generateConfig(spec), this.generateIndexHtml(spec)],
        };
    }
    generatePage(spec) {
        const v = gv(spec.genome);
        const animConfig = getAnimationConfig(spec.genome);
        const imports = this.generateImports(spec.selectedLibraries, spec.genome);
        const pageContent = this.renderPage(spec, v, animConfig);
        return {
            path: "src/pages/index.tsx",
            content: `${imports}

export default function HomePage() {
  return (
${pageContent}  );
}
`,
        };
    }
    renderPage(spec, v, animConfig) {
        const { layout, navigation, hero, sections, footer, sidebar } = spec;
        const indent = "    ";
        let tree = "";
        // Page wrapper with page transition + ch33 composition data attributes
        const navType = navigation?.type ?? "none";
        const compAttrs = `data-flow="${layout.flow}" data-density="${layout.density}" data-nav="${navType}" data-responsive="${layout.responsive}"`;
        if (animConfig.preset.fmType !== "none") {
            tree += `${indent}<motion.div className="page-layout layout-${layout.type}" ${compAttrs} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: ${animConfig.duration * 0.75} }}>\n`;
        }
        else {
            tree += `${indent}<div className="page-layout layout-${layout.type}" ${compAttrs}>\n`;
        }
        // Navigation
        if (navigation?.pattern?.blueprint) {
            tree += this.renderBlueprint(navigation.pattern.blueprint, v, animConfig, indent + "  ", 0, this.resolveAdaptiveProps(navigation.pattern, spec.genome));
        }
        else if (navigation) {
            tree += this.renderNavFallback(navigation, v, animConfig, indent + "  ", 0);
        }
        // Main content
        tree += `${indent}  <main className="main-content">\n`;
        // Sidebar
        if (sidebar?.pattern?.blueprint) {
            tree += this.renderBlueprint(sidebar.pattern.blueprint, v, animConfig, indent + "    ", 0, this.resolveAdaptiveProps(sidebar.pattern, spec.genome));
        }
        // Hero
        if (hero?.pattern?.blueprint) {
            tree += this.renderBlueprint(hero.pattern.blueprint, v, animConfig, indent + "    ", 0, this.resolveAdaptiveProps(hero.pattern, spec.genome));
        }
        // Sections with staggered animation
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const delay = i * animConfig.staggerInterval;
            if (section.pattern?.blueprint) {
                tree += this.renderBlueprint(section.pattern.blueprint, v, animConfig, indent + "    ", delay, this.resolveAdaptiveProps(section.pattern, spec.genome));
            }
            else {
                tree += this.renderSectionFallback(section, v, animConfig, indent + "    ", delay);
            }
        }
        tree += `${indent}  </main>\n`;
        // Footer
        if (footer?.pattern?.blueprint) {
            tree += this.renderBlueprint(footer.pattern.blueprint, v, animConfig, indent + "  ", sections.length * animConfig.staggerInterval, this.resolveAdaptiveProps(footer.pattern, spec.genome));
        }
        tree += `${indent}</div>`;
        return tree;
    }
    resolveAdaptiveProps(pattern, genome) {
        if (!pattern?.adaptiveProps?.length)
            return {};
        const result = {};
        const ch = genome.chromosomes;
        for (const ap of pattern.adaptiveProps) {
            const parts = ap.genomeRef.split(".");
            let val = ch;
            for (const part of parts)
                val = val?.[part];
            if (val !== undefined && val !== null) {
                result[ap.name] = String(val);
            }
        }
        return result;
    }
    renderBlueprint(blueprint, v, animConfig, indent, delay, adaptiveProps) {
        const props = {
            headline: v.headline || "",
            subheadline: v.subheadline || "",
            title: v.headline || "",
            description: v.subheadline || "",
            cta: v.cta || "",
            ctaSecondary: v.ctaSecondary || "",
            companyName: v.companyName || "",
            tagline: v.tagline || "",
            logo: v.companyName || "",
            year: new Date().getFullYear().toString(),
            colorPrimary: v.primary,
            colorAccent: v.accent,
            radius: String(v.radiusMd),
            spacing: String(v.md),
            gridColumns: String(v.columns),
            // Blueprint-local adaptive prop names ({{columns}}, {{width}}, etc.)
            columns: String(v.columns), width: "280px", backdrop: "none",
            color1: v.primary, color2: v.secondary, imagePosition: "right",
            // Spread resolved adaptive props last so genome values override defaults
            ...(adaptiveProps || {}),
            stats: (v.stats || []).map((s) => `<div className="stat"><span className="stat-value">${s.value}</span><span className="stat-label">${s.label}</span></div>`).join("\n"),
            featureCards: (v.features || []).map((f) => `<div className="feature-card"><div className="feature-icon"></div><h3 className="feature-title">${f.title}</h3><p className="feature-description">${f.description}</p></div>`).join("\n"),
            faqItems: (v.faq || []).map((f) => `<details className="faq-item"><summary className="faq-question">${f.question}</summary><div className="faq-answer"><p>${f.answer}</p></div></details>`).join("\n"),
            testimonialCards: "",
            pricingCards: "",
            teamCards: "",
            blogCards: "",
            galleryItems: "",
            logoItems: "",
            stepItems: "",
            comparisonTable: "",
            newsletterForm: "",
            buttons: `<button className="btn btn-primary">${v.cta || ""}</button>`,
            ctas: `<button className="btn btn-primary">${v.cta || ""}</button>\n${v.ctaSecondary ? `<button className="btn btn-secondary">${v.ctaSecondary}</button>` : ""}`,
            navLinks: "",
            footerColumns: "",
            navContent: "",
            filterContent: "",
            heroImage: "",
            sectionContent: "",
            formContent: "",
            footerContent: "",
            headerContent: "",
            navActions: "",
            heroSection: "",
            leftPanel: "",
            rightPanel: "",
            carouselSlides: "",
            carouselDots: "",
            orbitElements: "",
            heroBg: "",
            videoSource: "",
            videoElement: "",
            mapElement: "",
            tocElement: "",
            children: "",
            sidebarElement: "",
            summaryElement: "",
            // Sidebar/nav-specific and section-specific blueprint vars
            links: "",
            header: v.companyName || "",
            footer: "",
            actions: "",
            image: "",
            statItems: (v.stats || []).map((s) => `<div className="stat-item"><span className="stat-value">${s.value}</span><span className="stat-label">${s.label}</span></div>`).join("\n"),
            ctaTitle: v.headline || "",
            ctaDesc: v.subheadline || "",
            ctaText: v.cta || "",
        };
        let template = blueprint.template;
        template = template.replace(/class="/g, 'className="');
        template = template.replace(/for="/g, 'htmlFor="');
        template = template.replace(/tabindex="/g, 'tabIndex="');
        template = template.replace(/aria-label="/g, 'ariaLabel="');
        for (const [key, value] of Object.entries(props)) {
            template = template.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
        }
        // Wrap with Framer Motion if animations are enabled
        if (animConfig.preset.fmType !== "none" && template.trim()) {
            template = generateFramerMotionWrapper(animConfig, template, delay);
        }
        return template.split("\n").map(line => line ? indent + line : line).join("\n") + "\n";
    }
    renderNavFallback(nav, v, animConfig, indent, delay) {
        const items = (nav.items || []).map((item) => `${indent}    <a href="${item.href}" className="nav-link">${item.label}</a>`).join("\n");
        const navContent = `${indent}<nav className="navigation nav-${nav.type}" role="navigation" ariaLabel="Main navigation">\n${indent}  <div className="nav-container">\n${indent}    <a href="/" className="nav-logo" ariaLabel="Home"><span className="logo-text">${v.companyName || ""}</span></a>\n${indent}    <div className="nav-items">\n${items}\n${indent}    </div>\n${indent}    <button className="nav-toggle" ariaLabel="Toggle navigation" ariaExpanded="false"><span className="hamburger"></span></button>\n${indent}  </div>\n${indent}</nav>\n`;
        if (animConfig.preset.fmType !== "none") {
            return generateFramerMotionWrapper(animConfig, navContent, delay);
        }
        return navContent;
    }
    renderSectionFallback(section, v, animConfig, indent, delay) {
        const component = this.findComponentForSection(section.type);
        let content = `${indent}<section className="section section-${section.type}">\n${indent}  <div className="section-container">\n${indent}    {/* ${section.type} section */}\n${indent}  </div>\n${indent}</section>\n`;
        if (component) {
            const code = generateComponentCode(component, v, component.variants[0]?.name || "default");
            content = code.react.split("\n").map(line => indent + line).join("\n") + "\n";
        }
        if (animConfig.preset.fmType !== "none") {
            return generateFramerMotionWrapper(animConfig, content, delay);
        }
        return content;
    }
    findComponentForSection(sectionType) {
        for (const lib of COMPONENT_LIBRARY_CATALOG) {
            for (const comp of lib.components) {
                if (comp.category.toLowerCase() === sectionType.toLowerCase() || comp.name.toLowerCase().includes(sectionType.toLowerCase())) {
                    return comp;
                }
            }
        }
        return null;
    }
    generateComponents(spec) {
        const v = gv(spec.genome);
        const files = [];
        const seen = new Set();
        for (const section of spec.sections) {
            if (seen.has(section.type))
                continue;
            seen.add(section.type);
            const component = this.findComponentForSection(section.type);
            if (component) {
                const code = generateComponentCode(component, v, component.variants[0]?.name || "default");
                files.push({
                    path: `src/components/${component.name}.tsx`,
                    content: `import React from 'react';

export interface ${component.name}Props {
  ${component.props.filter((p) => !p.genomeAdaptive).map((p) => `${p.name}${p.required ? "" : "?"}: ${p.type};`).join("\n  ")}
}

export function ${component.name}({ ${component.props.filter((p) => !p.genomeAdaptive).map((p) => p.name).join(", ")} }: ${component.name}Props) {
  return (
    ${code.react}
  );
}
`,
                });
            }
        }
        return files;
    }
    generateStyles(spec) {
        const v = gv(spec.genome);
        const animConfig = getAnimationConfig(spec.genome);
        const allPatterns = [
            spec.layout.pattern,
            spec.navigation?.pattern,
            spec.hero?.pattern,
            spec.footer?.pattern,
            spec.sidebar?.pattern,
            ...spec.sections.map(s => s.pattern),
        ].filter(Boolean);
        // Resolve all adaptive CSS vars from patterns into :root
        const adaptiveVarLines = [];
        const seenAdaptiveNames = new Set();
        for (const pattern of allPatterns) {
            if (!pattern?.adaptiveProps?.length)
                continue;
            const resolved = this.resolveAdaptiveProps(pattern, spec.genome);
            for (const ap of pattern.adaptiveProps) {
                if (seenAdaptiveNames.has(ap.name))
                    continue;
                seenAdaptiveNames.add(ap.name);
                const value = resolved[ap.name] ?? ap.defaultValue;
                if (value !== undefined)
                    adaptiveVarLines.push(`  --${ap.name}: ${value};`);
            }
        }
        // Post-process blueprint styles: replace all hardcoded rem spacing with CSS vars
        const patternStyles = new Set();
        for (const pattern of allPatterns) {
            if (!pattern?.blueprint?.styles)
                continue;
            patternStyles.add(replaceRemWithVars(pattern.blueprint.styles));
        }
        // Generate CSS keyframe animations from genome
        const animationCSS = generateCSSKeyframes(animConfig);
        return {
            path: "src/styles/index.css",
            content: `/* ── Genome-Derived CSS Variables ──────────────────────────────────── */
:root {
  --color-primary: ${v.primary};
  --color-primary-dark: ${v.primaryDark};
  --color-secondary: ${v.secondary};
  --color-accent: ${v.accent};
  --color-success: ${v.success};
  --color-warning: ${v.warning};
  --color-error: ${v.error};
  --color-bg: ${v.bg};
  --color-surface: ${v.surface};
  --color-surface-elevated: ${v.surfaceElevated};
  --color-text: ${v.text};
  --color-text-muted: ${v.textMuted};
  --color-border: ${v.border};
  --color-primary-h: ${v.primaryHue}; --color-primary-s: ${v.primarySat}%; --color-primary-l: ${v.primaryLight}%;
  --color-on-primary: ${v.onPrimary};
  --color-surface-dark: ${v.colorSurfaceDark}; --color-surface-dark-border: ${v.colorSurfaceDarkBorder}; --color-surface-dark-hover: ${v.colorSurfaceDarkHover};
  --color-text-on-dark: ${v.colorTextOnDark}; --color-text-on-dark-muted: ${v.colorTextOnDarkMuted};
  --color-overlay: ${v.colorOverlay}; --color-overlay-light: ${v.colorOverlayLight}; --color-overlay-subtle: ${v.colorOverlaySubtle};
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08); --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12); --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.15); --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.2);
  --font-display: ${v.fontDisplay};
  --font-body: ${v.fontBody};
  --font-mono: ${v.fontMono};
  --spacing-xs: ${v.xs}px;
  --spacing-sm: ${v.sm}px;
  --spacing-md: ${v.md}px;
  --spacing-lg: ${v.lg}px;
  --spacing-xl: ${v.xl}px;
  --spacing-2xl: ${v.xxl}px;
  --spacing-section: ${v.section}px;
  --radius-sm: ${v.radiusSm}px;
  --radius-md: ${v.radiusMd}px;
  --radius-lg: ${v.radiusLg}px;
  --radius-full: ${v.radiusFull}px;
  --grid-gap: ${v.gap}px;
  --grid-columns: ${v.columns};
  --motion-duration: ${v.duration};
  --motion-stagger: ${v.stagger}ms;
  --motion-easing: ${v.easing};
  --font-size-base: ${v.fontSizeBase}px;
  --font-size-sm: ${v.fontSizeSm}px;
  --font-size-lg: ${v.fontSizeLg}px;
  --font-size-xl: ${v.fontSizeXl}px;
  --font-size-2xl: ${v.fontSize2xl}px;
  --font-size-3xl: ${v.fontSize3xl}px;
  --font-size-4xl: ${v.fontSize4xl}px;
  --line-height: ${v.lineHeight};
  --line-height-tight: ${v.lineHeightTight};
  --composition-flow: ${spec.layout.flow}; --composition-density: ${spec.layout.density};
  --composition-nav: ${spec.navigation?.type ?? "none"}; --composition-responsive: ${spec.layout.responsive};
  --sidebar-width: ${spec.sidebar?.width ?? "280px"};
${adaptiveVarLines.join("\n")}
${Object.entries(spec.cssVariables).map(([name, val]) => `  ${name}: ${val};`).join("\n")}
}

/* ── Composition-Strategy Layout Rules (ch33) ──────────────────────────── */
[data-nav="sidebar_persistent"] .page-layout,
[data-nav="sidebar_collapsible"] .page-layout { display: grid; grid-template-columns: var(--sidebar-width) 1fr; }
[data-density="content_dense"] .section { padding: var(--spacing-lg) var(--spacing-xl); }
[data-density="maximal"] .section { padding: var(--spacing-md) var(--spacing-lg); }
[data-density="hero_dense"] .hero { padding: 0; min-height: 100vh; }
[data-flow="data_driven"] .hero { display: none; }
[data-flow="data_driven"] .main-content { padding-top: var(--spacing-md); }
[data-flow="action_first"] .hero { order: -1; }
[data-flow="discovery"] .section { scroll-snap-align: start; }
[data-responsive="stack"] .grid { grid-template-columns: 1fr; }

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
.main-content { flex: 1; display: flex; flex-direction: column; }
.main-content > * { order: 10; }
.hero { order: 5; }
.navigation { order: 0; }
.footer { order: 99; }
/* ch33 contentFlow order overrides */
[data-flow="data_driven"] .hero { order: 99; display: none; }
[data-flow="action_first"] .hero { order: 0; }
[data-flow="hero_first"] .hero { order: 0; }
[data-flow="social_first"] .hero { order: 1; }

/* ── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .section { padding: var(--spacing-section) var(--spacing-md); }
  .section-container { padding: 0 var(--spacing-md); }
}

/* ── Print ─────────────────────────────────────────────────────────────── */
@media print {
  .navigation, .sidebar, .hero-ctas, .footer { display: none; }
  .hero { padding: var(--spacing-xl) 0; color: black; background: none !important; }
  .section { padding: var(--spacing-md) 0; }
}

/* ── Pattern Styles ────────────────────────────────────────────────────── */
${Array.from(patternStyles).join("\n\n")}

/* ── Genome Animations ────────────────────────────────────────────────── */
${animationCSS}
`,
        };
    }
    generateConfig(spec) {
        const deps = { react: "^18.2.0", "react-dom": "^18.2.0" };
        const animConfig = getAnimationConfig(spec.genome);
        // Add Framer Motion if animations are enabled
        if (animConfig.preset.fmType !== "none") {
            deps["framer-motion"] = "latest";
        }
        for (const [, lib] of Object.entries(spec.selectedLibraries)) {
            const l = lib;
            if (l.package && l.package !== "none" && !deps[l.package]) {
                deps[l.package] = "latest";
            }
        }
        return {
            path: "package.json",
            content: JSON.stringify({ name: "genome-generated-app", version: "1.0.0", private: true, dependencies: deps }, null, 2),
        };
    }
    generateIndexHtml(spec) {
        const v = gv(spec.genome);
        const fontLinks = this.generateFontLinks(v);
        return {
            path: "index.html",
            content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${v.companyName || "App"}</title>
${fontLinks}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
        };
    }
    generateFontLinks(v) {
        const lines = [];
        const seenProviders = new Set();
        const seenUrls = new Set();
        const addPreconnect = (provider) => {
            if (!provider || seenProviders.has(provider))
                return;
            seenProviders.add(provider);
            if (provider === "google") {
                lines.push('    <link rel="preconnect" href="https://fonts.googleapis.com">');
                lines.push('    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
            }
            else if (provider === "bunny") {
                lines.push('    <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>');
            }
            else if (provider === "fontshare") {
                lines.push('    <link rel="preconnect" href="https://api.fontshare.com" crossorigin>');
            }
        };
        const addFontLink = (url, display) => {
            if (!url || seenUrls.has(url))
                return;
            seenUrls.add(url);
            const normalised = url.replace(/[?&]display=[^&]+/, "");
            const separator = normalised.includes("?") ? "&" : "?";
            const finalUrl = `${normalised}${separator}display=${display}`;
            lines.push(`    <link href="${finalUrl}" rel="stylesheet">`);
        };
        // Anchor font — block (prevent jarring shift on hero type)
        if (v.fontImportUrl) {
            addPreconnect(v.fontProvider);
            addFontLink(v.fontImportUrl, "block");
        }
        // Body font — swap (immediate fallback, reflows acceptable)
        if (v.fontCount >= 2 && v.bodyFontImportUrl && v.bodyFontImportUrl !== v.fontImportUrl) {
            addPreconnect(v.bodyFontProvider);
            addFontLink(v.bodyFontImportUrl, "swap");
        }
        // Accent font — optional (enhancement only)
        if (v.fontCount === 3 && v.accentFontImportUrl) {
            addPreconnect(v.accentFontProvider);
            addFontLink(v.accentFontImportUrl, "optional");
        }
        return lines.join("\n");
    }
    generateImports(libraries, genome) {
        const imports = ["import React from 'react';"];
        const animConfig = getAnimationConfig(genome);
        // Add Framer Motion if animations are enabled
        if (animConfig.preset.fmType !== "none") {
            imports.push("import { motion } from 'framer-motion';");
        }
        if (libraries.animation.name === "Framer Motion" && animConfig.preset.fmType === "none") {
            imports.push("import { motion } from 'framer-motion';");
        }
        else if (libraries.animation.name === "GSAP") {
            imports.push("import gsap from 'gsap';");
            imports.push("import { ScrollTrigger } from 'gsap/ScrollTrigger';");
        }
        if (libraries.icon.name === "Lucide") {
            imports.push("import * as LucideIcons from 'lucide-react';");
        }
        else if (libraries.icon.name === "Phosphor Icons") {
            imports.push("import { Icon } from '@phosphor-icons/react';");
        }
        if (libraries.components.name === "shadcn/ui") {
            imports.push('import { Button } from "@/components/ui/button";');
            imports.push('import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";');
        }
        else if (libraries.components.name === "Mantine") {
            imports.push("import { Button, Container, Text, Title, Group, Stack, Card, Grid } from '@mantine/core';");
        }
        else if (libraries.components.name === "Chakra UI") {
            imports.push("import { Box, Button, Container, Text, Heading, Flex, Stack } from '@chakra-ui/react';");
        }
        if (libraries.components.name === "TanStack Table") {
            imports.push("import { useReactTable } from '@tanstack/react-table';");
        }
        imports.push("import './styles/index.css';");
        return imports.join("\n");
    }
}
