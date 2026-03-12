/**
 * Component Generator
 *
 * Generates UI components from an existing genome.
 * ALL values derive from genome chromosomes - no hardcoding.
 */
import * as crypto from "crypto";
export class ComponentGenerator {
    /**
     * Hash-derived value selector - ensures even component internals are deterministic
     */
    getHashByte(seed, index) {
        const hash = crypto.createHash("sha256").update(seed).digest("hex");
        return parseInt(hash.slice(index * 2, index * 2 + 2), 16) / 255;
    }
    generate(type, genome, seed) {
        const c = genome.chromosomes;
        const componentSeed = seed || genome.dnaHash;
        const derivation = {
            colorSource: `ch5_color_primary.hue: ${c.ch5_color_primary.hue}`,
            typographySource: `ch3_type_display.family: ${c.ch3_type_display.displayName}`,
            spacingSource: `ch2_rhythm.verticalRhythm: ${c.ch2_rhythm.verticalRhythm}`,
            motionSource: `ch8_motion.physics: ${c.ch8_motion.physics}`
        };
        // Hash-derived internal variations
        const b = (idx) => this.getHashByte(componentSeed + type, idx);
        switch (type) {
            case "pricing_table":
                return this.generatePricingTable(c, b, derivation);
            case "nav":
                return this.generateNav(c, b, derivation);
            case "card_grid":
                return this.generateCardGrid(c, b, derivation);
            case "testimonial":
                return this.generateTestimonial(c, b, derivation);
            case "data_table":
                return this.generateDataTable(c, b, derivation);
            case "hero":
                return this.generateHero(c, b, derivation);
            case "feature_list":
                return this.generateFeatureList(c, b, derivation);
            case "stats_counter":
                return this.generateStatsCounter(c, b, derivation);
            case "faq_accordion":
                return this.generateFAQ(c, b, derivation);
            case "cta_section":
                return this.generateCTA(c, b, derivation);
            case "footer":
                return this.generateFooter(c, b, derivation);
            case "form_contact":
                return this.generateContactForm(c, b, derivation);
            default:
                throw new Error(`Unknown component type: ${type}`);
        }
    }
    generatePricingTable(c, b, derivation) {
        const primary = c.ch5_color_primary.hex;
        const secondary = c.ch26_color_system?.secondary?.hex || c.ch6_color_temp.accentColor;
        const bg = c.ch6_color_temp.surfaceColor;
        const surface = c.ch6_color_temp.elevatedSurface;
        // Hash-derived structural values
        const maxWidth = Math.floor(1000 + b(0) * 400); // 1000-1400px
        const cardPadding = c.ch2_rhythm.verticalRhythm * (2 + Math.floor(b(1) * 3)); // 2-4x rhythm
        const gap = c.ch9_grid.gap;
        const html = `<section class="dna-pricing" role="region" aria-label="Pricing plans">
  <div class="dna-pricing__container">
    <h2 class="dna-pricing__title">{{PRICING_TITLE}}</h2>
    <div class="dna-pricing__grid">
      <article class="dna-pricing__card" data-tier="starter">
        <h3 class="dna-pricing__tier">{{TIER_1_NAME}}</h3>
        <div class="dna-pricing__price">{{TIER_1_PRICE}}</div>
        <ul class="dna-pricing__features">{{TIER_1_FEATURES}}</ul>
        <button class="dna-pricing__cta">{{TIER_1_CTA}}</button>
      </article>
      <article class="dna-pricing__card dna-pricing__card--featured" data-tier="pro">
        <span class="dna-pricing__badge">{{BADGE_TEXT}}</span>
        <h3 class="dna-pricing__tier">{{TIER_2_NAME}}</h3>
        <div class="dna-pricing__price">{{TIER_2_PRICE}}</div>
        <ul class="dna-pricing__features">{{TIER_2_FEATURES}}</ul>
        <button class="dna-pricing__cta">{{TIER_2_CTA}}</button>
      </article>
      <article class="dna-pricing__card" data-tier="enterprise">
        <h3 class="dna-pricing__tier">{{TIER_3_NAME}}</h3>
        <div class="dna-pricing__price">{{TIER_3_PRICE}}</div>
        <ul class="dna-pricing__features">{{TIER_3_FEATURES}}</ul>
        <button class="dna-pricing__cta">{{TIER_3_CTA}}</button>
      </article>
    </div>
  </div>
</section>`;
        const css = `.dna-pricing {
  --pricing-primary: ${primary};
  --pricing-secondary: ${secondary};
  --pricing-radius: ${c.ch7_edge.componentRadius}px;
  padding: ${c.ch2_rhythm.sectionSpacing}px ${c.ch2_rhythm.componentSpacing}px;
  background: ${bg};
}
.dna-pricing__container {
  max-width: ${maxWidth}px;
  margin: 0 auto;
}
.dna-pricing__title {
  font-family: ${c.ch3_type_display.family};
  font-size: ${c.ch16_typography.h2.size};
  font-weight: ${c.ch3_type_display.weight};
  text-align: center;
  margin-bottom: ${c.ch2_rhythm.componentSpacing * 2}px;
  color: ${c.ch6_color_temp.isDark ? "#fff" : "#000"};
}
.dna-pricing__grid {
  display: grid;
  grid-template-columns: repeat(${c.ch9_grid.columns}, 1fr);
  gap: ${gap}px;
}
.dna-pricing__card {
  position: relative;
  padding: ${cardPadding}px;
  background: ${surface};
  border-radius: var(--pricing-radius);
  border: 1px solid ${c.ch6_color_temp.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
  transition: transform ${c.ch8_motion.durationScale}s ${c.ch8_motion.physics};
}
.dna-pricing__card:hover {
  transform: translateY(-${Math.floor(b(2) * 8)}px);
}
.dna-pricing__card--featured {
  border-color: var(--pricing-primary);
  box-shadow: 0 0 0 ${Math.floor(b(3) * 3)}px var(--pricing-primary);
}
.dna-pricing__badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: ${Math.floor(b(4) * 4 + 2)}px ${Math.floor(b(5) * 16 + 8)}px;
  background: var(--pricing-primary);
  color: white;
  font-family: ${c.ch4_type_body.family};
  font-size: ${c.ch16_typography.small.size};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: ${(b(6) * 0.1).toFixed(2)}em;
  border-radius: ${Math.floor(c.ch7_edge.componentRadius / 2)}px;
}
.dna-pricing__tier {
  font-family: ${c.ch3_type_display.family};
  font-size: ${c.ch16_typography.h3.size};
  margin-bottom: ${c.ch2_rhythm.verticalRhythm}px;
}
.dna-pricing__price {
  font-family: ${c.ch3_type_display.family};
  font-size: ${Math.floor(32 + b(7) * 24)}px;
  font-weight: ${c.ch3_type_display.weight};
  color: var(--pricing-primary);
  margin-bottom: ${c.ch2_rhythm.componentSpacing * 2}px;
}
.dna-pricing__features {
  list-style: none;
  padding: 0;
  margin: 0 0 ${c.ch2_rhythm.componentSpacing * 2}px;
}
.dna-pricing__features li {
  padding: ${c.ch2_rhythm.verticalRhythm}px 0;
  font-family: ${c.ch4_type_body.family};
  font-size: ${c.ch16_typography.body.size};
  border-bottom: 1px solid ${c.ch6_color_temp.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"};
}
.dna-pricing__cta {
  width: 100%;
  padding: ${c.ch2_rhythm.verticalRhythm * 2}px;
  background: var(--pricing-primary);
  color: white;
  font-family: ${c.ch4_type_body.family};
  font-size: ${c.ch16_typography.body.size};
  font-weight: 600;
  border: none;
  border-radius: var(--pricing-radius);
  cursor: pointer;
}
@media (prefers-reduced-motion: reduce) {
  .dna-pricing__card { transition: none; }
}`;
        return { type: "pricing_table", name: "Pricing Table", html, css, variants: [], accessibility: { roles: ["region"], ariaLabels: {} }, genomeDerivation: derivation };
    }
    generateNav(c, b, derivation) {
        const html = `<nav class="dna-nav" role="navigation" aria-label="Main navigation">
  <div class="dna-nav__container">
    <a href="/" class="dna-nav__logo" aria-label="Home">{{LOGO}}</a>
    <ul class="dna-nav__menu" role="menubar">
      <li role="none"><a href="/" role="menuitem" class="dna-nav__link">{{LINK_1}}</a></li>
      <li role="none"><a href="/features" role="menuitem" class="dna-nav__link">{{LINK_2}}</a></li>
      <li role="none"><a href="/pricing" role="menuitem" class="dna-nav__link">{{LINK_3}}</a></li>
      <li role="none"><a href="/about" role="menuitem" class="dna-nav__link">{{LINK_4}}</a></li>
    </ul>
    <div class="dna-nav__actions">
      <a href="/login" class="dna-nav__link">{{LOGIN_TEXT}}</a>
      <a href="/signup" class="dna-nav__cta">{{CTA_TEXT}}</a>
    </div>
  </div>
</nav>`;
        const navHeight = Math.floor(56 + b(0) * 32); // 56-88px
        const css = `.dna-nav {
  --nav-height: ${navHeight}px;
  position: sticky;
  top: 0;
  z-index: ${Math.floor(50 + b(1) * 100)};
  height: var(--nav-height);
  background: ${c.ch6_color_temp.surfaceColor}${Math.floor(b(2) * 55 + 200).toString(16)};
  backdrop-filter: ${c.ch13_atmosphere.fx === "glassmorphism" ? `blur(${Math.floor(b(3) * 16 + 4)}px)` : "none"};
  border-bottom: 1px solid ${c.ch6_color_temp.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
}
.dna-nav__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: ${Math.floor(1000 + b(4) * 400)}px;
  height: 100%;
  margin: 0 auto;
  padding: 0 ${c.ch2_rhythm.componentSpacing * 2}px;
}
.dna-nav__logo {
  font-family: ${c.ch3_type_display.family};
  font-weight: ${c.ch3_type_display.weight};
  color: inherit;
  text-decoration: none;
}
.dna-nav__menu {
  display: flex;
  gap: ${c.ch2_rhythm.componentSpacing * Math.floor(b(5) * 3 + 1)}px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.dna-nav__link {
  font-family: ${c.ch4_type_body.family};
  font-size: ${c.ch16_typography.body.size};
  color: inherit;
  text-decoration: none;
}
.dna-nav__link:hover {
  color: ${c.ch5_color_primary.hex};
}
.dna-nav__cta {
  padding: ${c.ch2_rhythm.verticalRhythm}px ${c.ch2_rhythm.componentSpacing * 2}px;
  background: ${c.ch5_color_primary.hex};
  color: white;
  font-family: ${c.ch4_type_body.family};
  font-weight: 600;
  text-decoration: none;
  border-radius: ${c.ch7_edge.componentRadius}px;
}
@media (max-width: 768px) {
  .dna-nav__menu { display: none; }
}`;
        return { type: "nav", name: "Navigation", html, css, variants: [], accessibility: { roles: ["navigation"], ariaLabels: {} }, genomeDerivation: derivation };
    }
    generateCardGrid(c, b, derivation) {
        const html = `<section class="dna-card-grid" role="region" aria-label="Feature cards">
  <div class="dna-card-grid__container">
    <article class="dna-card">{{CARD_1_CONTENT}}</article>
    <article class="dna-card">{{CARD_2_CONTENT}}</article>
    <article class="dna-card">{{CARD_3_CONTENT}}</article>
  </div>
</section>`;
        const css = `.dna-card-grid {
  padding: ${c.ch2_rhythm.sectionSpacing}px ${c.ch2_rhythm.componentSpacing * 2}px;
}
.dna-card-grid__container {
  display: grid;
  grid-template-columns: ${c.ch9_grid.logic === "masonry"
            ? "repeat(auto-fill, minmax(${Math.floor(280 + b(0) * 120)}px, 1fr))"
            : `repeat(${c.ch9_grid.columns}, 1fr)`};
  gap: ${c.ch9_grid.gap}px;
  max-width: ${Math.floor(1000 + b(1) * 400)}px;
  margin: 0 auto;
}
.dna-card {
  background: ${c.ch6_color_temp.elevatedSurface};
  border-radius: ${c.ch7_edge.componentRadius}px;
  border: 1px solid ${c.ch6_color_temp.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
  overflow: hidden;
  transition: transform ${c.ch8_motion.durationScale}s ${c.ch8_motion.physics};
}
.dna-card:hover {
  transform: ${c.ch8_motion.physics === "spring" ? `translateY(-${Math.floor(b(2) * 12)}px)` : "none"};
}`;
        return { type: "card_grid", name: "Card Grid", html, css, variants: [], accessibility: { roles: ["region"], ariaLabels: {} }, genomeDerivation: derivation };
    }
    generateTestimonial(c, b, derivation) {
        const html = `<blockquote class="dna-testimonial" role="region" aria-label="Customer testimonial">
  <p class="dna-testimonial__text">{{TESTIMONIAL_TEXT}}</p>
  <footer class="dna-testimonial__author">
    <cite class="dna-testimonial__name">{{AUTHOR_NAME}}</cite>
    <span class="dna-testimonial__title">{{AUTHOR_TITLE}}</span>
  </footer>
</blockquote>`;
        const css = `.dna-testimonial {
  max-width: ${Math.floor(600 + b(0) * 400)}px;
  margin: 0 auto;
  padding: ${c.ch2_rhythm.componentSpacing * 3}px;
  background: ${c.ch6_color_temp.elevatedSurface};
  border-radius: ${c.ch7_edge.componentRadius}px;
  border: ${c.ch21_trust_signals.prominence === "hero_feature" ? "2px" : "1px"} solid ${c.ch6_color_temp.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
}
.dna-testimonial__text {
  font-family: ${c.ch4_type_body.family};
  font-size: ${c.ch16_typography.h3.size};
  line-height: ${c.ch16_typography.body.lineHeight};
  font-style: italic;
  margin-bottom: ${c.ch2_rhythm.componentSpacing * 2}px;
}
.dna-testimonial__name {
  font-family: ${c.ch3_type_display.family};
  font-size: ${c.ch16_typography.body.size};
  font-weight: 600;
  font-style: normal;
}
.dna-testimonial__title {
  font-family: ${c.ch4_type_body.family};
  font-size: ${c.ch16_typography.small.size};
  color: ${c.ch6_color_temp.isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"};
}`;
        return { type: "testimonial", name: "Testimonial", html, css, variants: [], accessibility: { roles: ["blockquote"], ariaLabels: {} }, genomeDerivation: derivation };
    }
    generateDataTable(c, b, derivation) {
        const html = `<div class="dna-data-table" role="region" aria-label="Data table" tabindex="0">
  <table class="dna-data-table__table">
    <thead><tr>{{TABLE_HEADERS}}</tr></thead>
    <tbody>{{TABLE_ROWS}}</tbody>
  </table>
</div>`;
        const css = `.dna-data-table {
  overflow-x: auto;
  border-radius: ${c.ch7_edge.componentRadius}px;
  border: 1px solid ${c.ch6_color_temp.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
}
.dna-data-table__table {
  width: 100%;
  border-collapse: collapse;
  font-family: ${c.ch4_type_body.family};
  font-size: ${c.ch16_typography.body.size};
}
.dna-data-table__table th {
  font-family: ${c.ch3_type_display.family};
  font-weight: 600;
  text-align: left;
  padding: ${c.ch2_rhythm.verticalRhythm * 2}px ${c.ch2_rhythm.componentSpacing * 1.5}px;
  background: ${c.ch6_color_temp.surfaceColor};
  border-bottom: 2px solid ${c.ch6_color_temp.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
}
.dna-data-table__table td {
  padding: ${c.ch2_rhythm.verticalRhythm * 2}px ${c.ch2_rhythm.componentSpacing * 1.5}px;
  border-bottom: 1px solid ${c.ch6_color_temp.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"};
}`;
        return { type: "data_table", name: "Data Table", html, css, variants: [], accessibility: { roles: ["region", "table"], ariaLabels: {} }, genomeDerivation: derivation };
    }
    generateHero(c, b, derivation) {
        const html = `<section class="dna-hero" role="banner" aria-label="Hero section">
  <div class="dna-hero__container">
    <div class="dna-hero__content">
      <h1 class="dna-hero__title">{{HERO_HEADLINE}}</h1>
      <p class="dna-hero__subtitle">{{HERO_SUBHEADLINE}}</p>
      <div class="dna-hero__actions">
        <a href="{{CTA_PRIMARY_URL}}" class="dna-hero__cta dna-hero__cta--primary">{{CTA_PRIMARY_TEXT}}</a>
        <a href="{{CTA_SECONDARY_URL}}" class="dna-hero__cta dna-hero__cta--secondary">{{CTA_SECONDARY_TEXT}}</a>
      </div>
    </div>
    <div class="dna-hero__visual">{{HERO_VISUAL}}</div>
  </div>
</section>`;
        const css = `.dna-hero {
  padding: ${c.ch2_rhythm.sectionSpacing * (1 + b(0))}px ${c.ch2_rhythm.componentSpacing * 2}px;
  background: ${c.ch6_color_temp.surfaceColor};
}
.dna-hero__container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${c.ch9_grid.gap * 2}px;
  max-width: ${Math.floor(1000 + b(1) * 400)}px;
  margin: 0 auto;
  align-items: center;
}
.dna-hero__title {
  font-family: ${c.ch3_type_display.family};
  font-size: ${c.ch16_typography.display.size};
  font-weight: ${c.ch3_type_display.weight};
  line-height: ${c.ch16_typography.display.lineHeight};
  margin-bottom: ${c.ch2_rhythm.componentSpacing * 2}px;
  color: ${c.ch6_color_temp.isDark ? "#fff" : "#000"};
}
.dna-hero__subtitle {
  font-family: ${c.ch4_type_body.family};
  font-size: ${c.ch16_typography.h3.size};
  line-height: ${c.ch16_typography.body.lineHeight};
  margin-bottom: ${c.ch2_rhythm.componentSpacing * 3}px;
  color: ${c.ch6_color_temp.isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)"};
}
.dna-hero__actions {
  display: flex;
  gap: ${c.ch2_rhythm.componentSpacing * Math.floor(b(2) * 2 + 1)}px;
}
.dna-hero__cta {
  padding: ${c.ch2_rhythm.verticalRhythm * 2}px ${c.ch2_rhythm.componentSpacing * 3}px;
  font-family: ${c.ch4_type_body.family};
  font-weight: 600;
  text-decoration: none;
  border-radius: ${c.ch7_edge.componentRadius}px;
}
.dna-hero__cta--primary {
  background: ${c.ch5_color_primary.hex};
  color: white;
}
.dna-hero__cta--secondary {
  background: transparent;
  color: ${c.ch5_color_primary.hex};
  border: 1px solid ${c.ch6_color_temp.isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"};
}
@media (max-width: 768px) {
  .dna-hero__container { grid-template-columns: 1fr; }
}`;
        return { type: "hero", name: "Hero Section", html, css, variants: [], accessibility: { roles: ["banner"], ariaLabels: {} }, genomeDerivation: derivation };
    }
    generateFeatureList(c, b, derivation) {
        const html = `<section class="dna-features" role="region" aria-label="Features">
  <div class="dna-features__container">
    <article class="dna-features__item">{{FEATURE_1}}</article>
    <article class="dna-features__item">{{FEATURE_2}}</article>
    <article class="dna-features__item">{{FEATURE_3}}</article>
  </div>
</section>`;
        const css = `.dna-features {
  padding: ${c.ch2_rhythm.sectionSpacing}px ${c.ch2_rhythm.componentSpacing * 2}px;
}
.dna-features__container {
  display: grid;
  grid-template-columns: repeat(${Math.min(c.ch9_grid.columns, 3)}, 1fr);
  gap: ${c.ch9_grid.gap * Math.floor(b(0) * 2 + 1)}px;
  max-width: ${Math.floor(1000 + b(1) * 400)}px;
  margin: 0 auto;
}
.dna-features__item {
  text-align: center;
  padding: ${c.ch2_rhythm.componentSpacing * 2}px;
}
.dna-features__item h3 {
  font-family: ${c.ch3_type_display.family};
  font-size: ${c.ch16_typography.h3.size};
  margin-bottom: ${c.ch2_rhythm.verticalRhythm}px;
}
.dna-features__item p {
  font-family: ${c.ch4_type_body.family};
  font-size: ${c.ch16_typography.body.size};
  line-height: ${c.ch16_typography.body.lineHeight};
  color: ${c.ch6_color_temp.isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)"};
}`;
        return { type: "feature_list", name: "Feature List", html, css, variants: [], accessibility: { roles: ["region"], ariaLabels: {} }, genomeDerivation: derivation };
    }
    generateStatsCounter(c, b, derivation) {
        const html = `<section class="dna-stats" role="region" aria-label="Statistics">
  <div class="dna-stats__container">
    <div class="dna-stats__item"><span class="dna-stats__number">{{STAT_1}}</span><span class="dna-stats__label">{{LABEL_1}}</span></div>
    <div class="dna-stats__item"><span class="dna-stats__number">{{STAT_2}}</span><span class="dna-stats__label">{{LABEL_2}}</span></div>
    <div class="dna-stats__item"><span class="dna-stats__number">{{STAT_3}}</span><span class="dna-stats__label">{{LABEL_3}}</span></div>
  </div>
</section>`;
        const css = `.dna-stats {
  padding: ${c.ch2_rhythm.sectionSpacing}px ${c.ch2_rhythm.componentSpacing * 2}px;
  background: ${c.ch5_color_primary.hex}${Math.floor(b(0) * 33 + 10).toString(16).padStart(2, '0')};
}
.dna-stats__container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${c.ch9_grid.gap * 2}px;
  max-width: ${Math.floor(1000 + b(1) * 400)}px;
  margin: 0 auto;
  text-align: center;
}
.dna-stats__number {
  display: block;
  font-family: ${c.ch3_type_display.family};
  font-size: ${c.ch16_typography.display.size};
  font-weight: ${c.ch3_type_display.weight};
  color: ${c.ch5_color_primary.hex};
}`;
        return { type: "stats_counter", name: "Stats Counter", html, css, variants: [], accessibility: { roles: ["region"], ariaLabels: {} }, genomeDerivation: derivation };
    }
    generateFAQ(c, b, derivation) {
        const html = `<section class="dna-faq" role="region" aria-label="Frequently asked questions">
  <div class="dna-faq__container">
    <h2 class="dna-faq__title">{{FAQ_TITLE}}</h2>
    <dl class="dna-faq__list">{{FAQ_ITEMS}}</dl>
  </div>
</section>`;
        const css = `.dna-faq {
  padding: ${c.ch2_rhythm.sectionSpacing}px ${c.ch2_rhythm.componentSpacing * 2}px;
}
.dna-faq__container {
  max-width: ${Math.floor(600 + b(0) * 400)}px;
  margin: 0 auto;
}
.dna-faq__title {
  font-family: ${c.ch3_type_display.family};
  font-size: ${c.ch16_typography.h2.size};
  text-align: center;
  margin-bottom: ${c.ch2_rhythm.componentSpacing * 3}px;
}
.dna-faq__list {
  margin: 0;
}
.dna-faq__list dt {
  font-family: ${c.ch3_type_display.family};
  font-size: ${c.ch16_typography.h3.size};
  font-weight: 600;
  padding: ${c.ch2_rhythm.componentSpacing * 1.5}px 0;
  border-bottom: 1px solid ${c.ch6_color_temp.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
}
.dna-faq__list dd {
  padding: ${c.ch2_rhythm.componentSpacing}px 0;
  font-family: ${c.ch4_type_body.family};
  font-size: ${c.ch16_typography.body.size};
  line-height: ${c.ch16_typography.body.lineHeight};
  color: ${c.ch6_color_temp.isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)"};
}`;
        return { type: "faq_accordion", name: "FAQ Accordion", html, css, variants: [], accessibility: { roles: ["region", "dl"], ariaLabels: {} }, genomeDerivation: derivation };
    }
    generateCTA(c, b, derivation) {
        const html = `<section class="dna-cta" role="region" aria-label="Call to action">
  <div class="dna-cta__container">
    <h2 class="dna-cta__title">{{CTA_HEADLINE}}</h2>
    <p class="dna-cta__text">{{CTA_DESCRIPTION}}</p>
    <a href="{{CTA_URL}}" class="dna-cta__button">{{CTA_BUTTON_TEXT}}</a>
  </div>
</section>`;
        const css = `.dna-cta {
  padding: ${c.ch2_rhythm.sectionSpacing * (1 + b(0) * 0.5)}px ${c.ch2_rhythm.componentSpacing * 2}px;
  background: ${c.ch5_color_primary.hex};
  text-align: center;
}
.dna-cta__container {
  max-width: ${Math.floor(500 + b(1) * 300)}px;
  margin: 0 auto;
}
.dna-cta__title {
  font-family: ${c.ch3_type_display.family};
  font-size: ${c.ch16_typography.h2.size};
  color: white;
  margin-bottom: ${c.ch2_rhythm.componentSpacing * 1.5}px;
}
.dna-cta__text {
  font-family: ${c.ch4_type_body.family};
  font-size: ${c.ch16_typography.h3.size};
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: ${c.ch2_rhythm.componentSpacing * 2}px;
}
.dna-cta__button {
  display: inline-block;
  padding: ${c.ch2_rhythm.verticalRhythm * 2}px ${c.ch2_rhythm.componentSpacing * 4}px;
  background: white;
  color: ${c.ch5_color_primary.hex};
  font-family: ${c.ch4_type_body.family};
  font-weight: 600;
  text-decoration: none;
  border-radius: ${c.ch7_edge.componentRadius}px;
}`;
        return { type: "cta_section", name: "CTA Section", html, css, variants: [], accessibility: { roles: ["region"], ariaLabels: {} }, genomeDerivation: derivation };
    }
    generateFooter(c, b, derivation) {
        const html = `<footer class="dna-footer" role="contentinfo">
  <div class="dna-footer__container">
    <div class="dna-footer__brand">{{BRAND}}</div>
    <nav class="dna-footer__nav" aria-label="Footer navigation">{{NAV_LINKS}}</nav>
    <div class="dna-footer__bottom">{{COPYRIGHT}}</div>
  </div>
</footer>`;
        const css = `.dna-footer {
  padding: ${c.ch2_rhythm.sectionSpacing}px ${c.ch2_rhythm.componentSpacing * 2}px ${c.ch2_rhythm.componentSpacing * 2}px;
  background: ${c.ch6_color_temp.isDark ? "#0a0a0a" : "#1a1a1a"};
  color: white;
}
.dna-footer__container {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: ${c.ch9_grid.gap * 2}px;
  max-width: ${Math.floor(1000 + b(0) * 400)}px;
  margin: 0 auto;
}
.dna-footer__brand {
  font-family: ${c.ch3_type_display.family};
}
.dna-footer__nav a {
  font-family: ${c.ch4_type_body.family};
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
}
.dna-footer__nav a:hover {
  color: white;
}
.dna-footer__bottom {
  grid-column: 1 / -1;
  padding-top: ${c.ch2_rhythm.componentSpacing * 2}px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-family: ${c.ch4_type_body.family};
  font-size: ${c.ch16_typography.small.size};
  color: rgba(255, 255, 255, 0.5);
}`;
        return { type: "footer", name: "Footer", html, css, variants: [], accessibility: { roles: ["contentinfo"], ariaLabels: {} }, genomeDerivation: derivation };
    }
    generateContactForm(c, b, derivation) {
        const html = `<form class="dna-form" role="form" aria-label="Contact form">
  <div class="dna-form__field">
    <label for="name" class="dna-form__label">{{LABEL_NAME}}</label>
    <input type="text" id="name" name="name" class="dna-form__input" required>
  </div>
  <div class="dna-form__field">
    <label for="email" class="dna-form__label">{{LABEL_EMAIL}}</label>
    <input type="email" id="email" name="email" class="dna-form__input" required>
  </div>
  <div class="dna-form__field">
    <label for="message" class="dna-form__label">{{LABEL_MESSAGE}}</label>
    <textarea id="message" name="message" class="dna-form__textarea" rows="4" required></textarea>
  </div>
  <button type="submit" class="dna-form__submit">{{SUBMIT_TEXT}}</button>
</form>`;
        const css = `.dna-form {
  display: flex;
  flex-direction: column;
  gap: ${c.ch2_rhythm.componentSpacing * 1.5}px;
  max-width: ${Math.floor(400 + b(0) * 200)}px;
}
.dna-form__field {
  display: flex;
  flex-direction: column;
  gap: ${c.ch2_rhythm.verticalRhythm}px;
}
.dna-form__label {
  font-family: ${c.ch3_type_display.family};
  font-size: ${c.ch16_typography.small.size};
  font-weight: 600;
}
.dna-form__input,
.dna-form__textarea {
  padding: ${c.ch2_rhythm.verticalRhythm * 1.5}px ${c.ch2_rhythm.componentSpacing}px;
  font-family: ${c.ch4_type_body.family};
  font-size: ${c.ch16_typography.body.size};
  border: 1px solid ${c.ch6_color_temp.isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"};
  border-radius: ${c.ch7_edge.componentRadius}px;
  background: ${c.ch6_color_temp.surfaceColor};
}
.dna-form__input:focus,
.dna-form__textarea:focus {
  outline: none;
  border-color: ${c.ch5_color_primary.hex};
  box-shadow: 0 0 0 ${Math.floor(b(1) * 4 + 2)}px ${c.ch5_color_primary.hex}${Math.floor(20 + b(2) * 40).toString(16).padStart(2, '0')};
}
.dna-form__submit {
  padding: ${c.ch2_rhythm.verticalRhythm * 2}px ${c.ch2_rhythm.componentSpacing * 2}px;
  background: ${c.ch5_color_primary.hex};
  color: white;
  font-family: ${c.ch4_type_body.family};
  font-weight: 600;
  border: none;
  border-radius: ${c.ch7_edge.componentRadius}px;
  cursor: pointer;
}
.dna-form__submit:hover {
  background: ${c.ch26_color_system?.secondary?.hex || c.ch6_color_temp.accentColor};
}`;
        return { type: "form_contact", name: "Contact Form", html, css, variants: [], accessibility: { roles: ["form"], ariaLabels: {} }, genomeDerivation: derivation };
    }
}
export const componentGenerator = new ComponentGenerator();
