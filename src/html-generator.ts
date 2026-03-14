/**
 * Permutations MCP - HTML Generator
 * 
 * Generates HTML with hero types, trust signals,
 * and sector-appropriate layouts.
 */

import { DesignGenome, HeroLayoutVariant } from "./genome/types.js";

export interface HTMLGenerationOptions {
  includeHeader?: boolean;
  includeFooter?: boolean;
  includeSections?: boolean;
  heroOnly?: boolean;
}

export class HTMLGenerator {
  generate(genome: DesignGenome, options: HTMLGenerationOptions = {}): string {
    const {
      includeHeader = true,
      includeFooter = true,
      includeSections = false,
      heroOnly = false
    } = options;

    if (heroOnly) {
      return this.generateHero(genome);
    }

    const parts: string[] = [];

    parts.push(`<!DOCTYPE html>`);
    parts.push(`<html lang="en">`);
    parts.push(`<head>`);
    parts.push(`  <meta charset="UTF-8">`);
    parts.push(`  <meta name="viewport" content="width=device-width, initial-scale=1.0">`);
    const titleName = genome.chromosomes.ch25_copy_engine?.companyName ?? "";
    parts.push(`  <title>${titleName}</title>`);
    parts.push(`  <link rel="stylesheet" href="styles.css">`);

    // Dynamic Font Injection
    const displayFont = genome.chromosomes.ch3_type_display;
    const bodyFont = genome.chromosomes.ch4_type_body;

    if (displayFont.importUrl) {
      parts.push(`  <link rel="stylesheet" href="${displayFont.importUrl}">`);
    }
    if (bodyFont.importUrl && bodyFont.importUrl !== displayFont.importUrl) {
      parts.push(`  <link rel="stylesheet" href="${bodyFont.importUrl}">`);
    }

    // Icon library injection from ch28_iconography
    const iconLib = genome.chromosomes.ch28_iconography.library;
    const iconLibraryCDN: Record<string, string> = {
      lucide:   'https://unpkg.com/lucide@latest',
      phosphor: 'https://unpkg.com/@phosphor-icons/web@2.1.1',
      feather:  'https://unpkg.com/feather-icons/dist/feather.min.js',
      heroicons:'https://unpkg.com/heroicons@2.1.1/dist/index.js',
      radix:    'https://unpkg.com/@radix-ui/react-icons@latest/dist/index.js',
    };
    if (iconLibraryCDN[iconLib]) {
      parts.push(`  <script src="${iconLibraryCDN[iconLib]}" defer></script>`);
    }

    parts.push(`</head>`);
    const isDark = genome.chromosomes.ch6_color_temp.isDark;
    parts.push(`<body${isDark ? ' class="dark"' : ''}>`);

    if (includeHeader) {
      parts.push(this.generateHeader(genome));
    }

    parts.push(this.generateHero(genome));

    if (includeSections) {
      parts.push(this.generateTrustSection(genome));
      parts.push(this.generateSocialProofSection(genome));
      parts.push(this.generateContentSections(genome));
    }

    if (includeFooter) {
      parts.push(this.generateFooter(genome));
    }

    parts.push(`</body>`);
    parts.push(`</html>`);

    return parts.join('\n');
  }

  private generateHeader(genome: DesignGenome): string {
    const contentDepth = genome.chromosomes.ch23_content_depth;
    const ia = genome.chromosomes.ch23_information_architecture;
    const copy = genome.chromosomes.ch25_copy_engine;

    // H-4: Use ia.navigationType to set nav class
    // H-3: Use genome-generated CTA instead of hardcoded "Get Started"
    return `<header class="header nav-${ia.navigationType}">
  <div class="container">
    <nav class="nav">
      <a href="#" class="logo">${copy.companyName}</a>
      <ul class="nav-links">
        ${contentDepth.hasHero ? '<li><a href="#hero">Home</a></li>' : ''}
        ${contentDepth.level !== 'minimal' ? '<li><a href="#features">Features</a></li>' : ''}
        ${contentDepth.hasTestimonials ? '<li><a href="#testimonials">Reviews</a></li>' : ''}
        ${contentDepth.hasFAQ ? '<li><a href="#faq">FAQ</a></li>' : ''}
        ${contentDepth.hasCTA ? `<li><a href="#cta" class="btn btn-primary">${copy.cta}</a></li>` : ''}
      </ul>
    </nav>
  </div>
</header>`;
  }

  private generateHero(genome: DesignGenome): string {
    const hero = genome.chromosomes.ch19_hero_type;
    const variant = genome.chromosomes.ch19_hero_variant_detail;
    const visual = genome.chromosomes.ch20_visual_treatment;

    const parts: string[] = [];

    const atm = genome.chromosomes.ch13_atmosphere;
    const fxClass = atm?.fx && atm.fx !== 'none' ? ' fx-atmosphere' : '';
    parts.push(`<section class="hero${fxClass}" id="hero">`);

    // Video background
    if (visual.hasVideo) {
      parts.push(`  <video class="hero-video" autoplay muted loop playsinline>`);
      parts.push(`    <source src="hero-video.mp4" type="video/mp4">`);
      parts.push(`  </video>`);
    }

    // Hero content based on type
    switch (hero.type) {
      case 'trust_authority':
        parts.push(this.generateTrustAuthorityHero(genome, variant.layout));
        break;
      case 'product_ui':
        parts.push(this.generateProductUIHero(genome, variant.layout));
        break;
      case 'stats_counter':
        parts.push(this.generateStatsCounterHero(genome, variant.layout));
        break;
      case 'search_discovery':
        parts.push(this.generateSearchDiscoveryHero(genome, variant.layout));
        break;
      case 'service_showcase':
        parts.push(this.generateServiceShowcaseHero(genome, variant.layout));
        break;
      case 'brand_logo':
        parts.push(this.generateBrandLogoHero(genome, variant.layout));
        break;
      case 'testimonial_focus':
        parts.push(this.generateTestimonialFocusHero(genome, variant.layout));
        break;
      case 'editorial_feature':
        parts.push(this.generateEditorialFeatureHero(genome, variant.layout));
        break;
      case 'aspirational_imagery':
        parts.push(this.generateAspirationalImageryHero(genome, variant.layout));
        break;
      case 'configurator_3d':
        parts.push(this.generateConfigurator3DHero(genome, variant.layout));
        break;
      case 'content_carousel':
        parts.push(this.generateContentCarouselHero(genome, variant.layout));
        break;
      case 'product_video':
        parts.push(this.generateProductVideoHero(genome, variant.layout));
        break;
      default:
        parts.push(this.generateDefaultHero(genome));
    }

    parts.push(`</section>`);

    return parts.join('\n');
  }

  private generateTrustAuthorityHero(genome: DesignGenome, _layout: HeroLayoutVariant): string {
    const copy = genome.chromosomes.ch25_copy_engine;
    const content = genome.chromosomes.ch21_trust_content;
    const credentials = content.credentials ?? [];

    return `  <div class="hero-content">
    ${credentials.length > 0 ? `<div class="hero-trust-badges">
      ${credentials.slice(0, 3).map(c =>
      `<span class="hero-trust-badge">✓ ${c}</span>`
    ).join('\n      ')}
    </div>` : ''}
    <h1 class="text-h1">${copy.headline}</h1>
    <p class="hero-subtitle">${copy.subheadline}</p>
    <div class="hero-ctas">
      <a href="#cta" class="btn btn-primary">${copy.cta}</a>
      ${copy.ctaSecondary ? `<a href="#learn" class="btn btn-secondary">${copy.ctaSecondary}</a>` : ''}
    </div>
  </div>`;
  }

  private generateProductUIHero(genome: DesignGenome, layout: HeroLayoutVariant): string {
    const copy = genome.chromosomes.ch25_copy_engine;
    const hasVisual = layout === 'split_right' || layout === 'split_left' || layout === 'floating_cards';

    const content = `  <div class="hero-content">
    <h1 class="text-h1">${copy.headline}</h1>
    <p class="hero-subtitle">${copy.subheadline}</p>
    <div class="hero-ctas">
      <a href="#trial" class="btn btn-primary">${copy.cta}</a>
      ${copy.ctaSecondary ? `<a href="#demo" class="btn btn-secondary">${copy.ctaSecondary}</a>` : ''}
    </div>
  </div>`;

    const visual = `  <div class="hero-visual">
    <div class="hero-screenshot">
      <img src="product-screenshot.jpg" alt="${copy.companyName}" />
    </div>
  </div>`;

    if (layout === 'split_left') {
      return visual + '\n' + content;
    } else if (layout === 'floating_cards') {
      return content + `\n  <div class="hero-cards">
    <div class="hero-card">
      <img src="feature-1.jpg" alt="Feature 1" />
    </div>
    <div class="hero-card">
      <img src="feature-2.jpg" alt="Feature 2" />
    </div>
  </div>`;
    }

    return content + (hasVisual ? '\n' + visual : '');
  }

  private generateStatsCounterHero(genome: DesignGenome, _layout: HeroLayoutVariant): string {
    const copy = genome.chromosomes.ch25_copy_engine;
    const stats = copy.stats;

    return `  <div class="hero-content">
    <h1 class="text-h1">${copy.headline}</h1>
    <p class="hero-subtitle">${copy.subheadline}</p>
    <div class="hero-stats">
      ${stats.map(s => `
      <div class="hero-stat">
        <div class="hero-stat-number">${s.value}</div>
        <div class="hero-stat-label">${s.label}</div>
      </div>`).join('')}
    </div>
    <div class="hero-ctas">
      <a href="#cta" class="btn btn-primary">${copy.cta}</a>
    </div>
  </div>`;
  }

  private generateSearchDiscoveryHero(genome: DesignGenome, _layout: HeroLayoutVariant): string {
    const copy = genome.chromosomes.ch25_copy_engine;
    return `  <div class="hero-content">
    <h1 class="text-h1">${copy.headline}</h1>
    <p class="hero-subtitle">${copy.subheadline}</p>
    <div class="hero-search">
      <input type="text" class="hero-search-input" placeholder="${copy.cta || ''}" />
      <button class="btn btn-primary">${copy.cta}</button>
    </div>
    ${copy.features.length > 0 ? `<div class="hero-filters">
      ${copy.features.slice(0, 3).map(f => `<a href="#" class="filter-link">${f.title}</a>`).join('\n      ')}
    </div>` : ''}
  </div>`;
  }

  private generateServiceShowcaseHero(genome: DesignGenome, _layout: HeroLayoutVariant): string {
    const copy = genome.chromosomes.ch25_copy_engine;
    const services = copy.features.slice(0, 3);

    return `  <div class="hero-content">
    <h1 class="text-h1">${copy.headline}</h1>
    <p class="hero-subtitle">${copy.subheadline}</p>
    <div class="hero-services-grid">
      ${services.map(s => `
      <div class="service-card">
        <h3>${s.title}</h3>
        <p>${s.description}</p>
      </div>`).join('')}
    </div>
  </div>`;
  }

  private generateBrandLogoHero(genome: DesignGenome, _layout: HeroLayoutVariant): string {
    const copy = genome.chromosomes.ch25_copy_engine;
    return `  <div class="hero-content">
    <div class="hero-logo-large">
      <img src="logo.svg" alt="${copy.companyName} Logo" />
    </div>
    <p class="hero-tagline">${copy.tagline}</p>
    <div class="hero-ctas">
      <a href="#explore" class="btn btn-primary">${copy.cta}</a>
    </div>
  </div>`;
  }

  private generateTestimonialFocusHero(genome: DesignGenome, _layout: HeroLayoutVariant): string {
    const copy = genome.chromosomes.ch25_copy_engine;
    return `  <div class="hero-content">
    <div class="hero-testimonial-featured">
      <blockquote>
        "${copy.testimonial}"
      </blockquote>
      <div class="testimonial-author">
        <img src="avatar.jpg" alt="${copy.authorName}" class="author-avatar" />
        <div class="author-info">
          <div class="author-name">${copy.authorName}</div>
          <div class="author-title">${copy.authorTitle}, ${copy.companyName}</div>
        </div>
      </div>
    </div>
    <div class="hero-ctas">
      <a href="#story" class="btn btn-primary">${copy.cta}</a>
    </div>
  </div>`;
  }

  private generateEditorialFeatureHero(genome: DesignGenome, _layout: HeroLayoutVariant): string {
    const copy = genome.chromosomes.ch25_copy_engine;
    return `  <div class="hero-content">
    <h1 class="text-h1">${copy.headline}</h1>
    <p class="hero-excerpt">${copy.subheadline}</p>
    <div class="hero-meta">
      <span>By ${copy.authorName}</span>
      <span>•</span>
      <span>${Math.ceil(copy.subheadline.length / 50) + 2} min read</span>
    </div>
    <div class="hero-ctas">
      <a href="#read" class="btn btn-primary">${copy.cta}</a>
    </div>
  </div>`;
  }

  private generateAspirationalImageryHero(genome: DesignGenome, _layout: HeroLayoutVariant): string {
    const copy = genome.chromosomes.ch25_copy_engine;
    return `  <div class="hero-content">
    <h1 class="text-h1">${copy.headline}</h1>
    <p class="hero-subtitle">${copy.subheadline}</p>
    <div class="hero-ctas">
      <a href="#explore" class="btn btn-primary">${copy.cta}</a>
    </div>
  </div>`;
  }

  private generateConfigurator3DHero(genome: DesignGenome, _layout: HeroLayoutVariant): string {
    const copy = genome.chromosomes.ch25_copy_engine;
    const priceStat = copy.stats.find(s => s.label.toLowerCase().includes('price'));
    // Use surface stack for color swatches (dark, medium, light)
    const surfaceStack = genome.chromosomes.ch6_color_temp.surfaceStack;
    const swatch1 = surfaceStack[0] ?? '';
    const swatch2 = surfaceStack[2] ?? '';
    const swatch3 = surfaceStack[3] ?? '';

    return `  <div class="hero-content">
    <h1 class="text-h1">${copy.headline}</h1>
    <p class="hero-subtitle">${copy.subheadline}</p>
    <div class="configurator-preview">
      <div class="config-3d-viewer">
        <div class="config-placeholder">${copy.companyName} 3D Preview</div>
      </div>
      <div class="config-options">
        <div class="option-group">
          <div class="color-options">
            <button class="color-swatch active" style="background: ${swatch1}"></button>
            <button class="color-swatch" style="background: ${swatch2}"></button>
            <button class="color-swatch" style="background: ${swatch3}"></button>
          </div>
        </div>
        ${priceStat ? `<div class="config-price">
          ${priceStat.label ? `<span class="price-label">${priceStat.label}</span>` : ''}
          <span class="price-value">${priceStat.value}</span>
        </div>` : ''}
        <a href="#configure" class="btn btn-primary">${copy.cta}</a>
      </div>
    </div>
  </div>`;
  }

  private generateContentCarouselHero(genome: DesignGenome, _layout: HeroLayoutVariant): string {
    const copy = genome.chromosomes.ch25_copy_engine;
    const items = copy.features.map((feat, idx) => {
      return `
      <div class="carousel-item">
        <img src="content-${idx + 1}.jpg" alt="${feat.title}" />
        <h3>${feat.title}</h3>
        <p>${feat.description}</p>
      </div>`;
    }).join('');
    return `  <div class="hero-content">
    <h1 class="text-h1">${copy.headline}</h1>
    <p class="hero-subtitle">${copy.subheadline}</p>
    <div class="hero-carousel">
      ${items}
    </div>
    <div class="hero-ctas">
      <a href="#explore" class="btn btn-primary">${copy.cta}</a>
    </div>
  </div>`;
  }

  private generateProductVideoHero(genome: DesignGenome, _layout: HeroLayoutVariant): string {
    const copy = genome.chromosomes.ch25_copy_engine;
    return `  <div class="hero-content">
    <h1 class="text-h1">${copy.headline}</h1>
    <p class="hero-subtitle">${copy.subheadline}</p>
    <div class="hero-video-cta">
      <button class="play-button">
        <span class="play-icon">▶</span>
        <span>${copy.ctaSecondary || 'Watch'}</span>
      </button>
    </div>
    <div class="hero-ctas">
      <a href="#trial" class="btn btn-primary">${copy.cta}</a>
    </div>
  </div>`;
  }

  private generateDefaultHero(genome: DesignGenome): string {
    const copy = genome.chromosomes.ch25_copy_engine;
    return `  <div class="hero-content">
    <h1 class="text-h1">${copy.headline}</h1>
    <p class="hero-subtitle">${copy.subheadline}</p>
    <div class="hero-ctas">
      <a href="#explore" class="btn btn-primary">${copy.cta}</a>
    </div>
  </div>`;
  }

  private generateTrustSection(genome: DesignGenome): string {
    const trust = genome.chromosomes.ch21_trust_signals;
    const copy = genome.chromosomes.ch25_copy_engine;

    if (trust.prominence === 'subtle') {
      return '';
    }

    return `<section class="trust-section" id="trust">
  <div class="container">
    <div class="trust-grid">
      ${copy.stats.map(s => `
      <div class="trust-item">
        <div class="trust-number">${s.value}</div>
        <div class="trust-label">${s.label}</div>
      </div>`).join('')}
    </div>
  </div>
</section>`;
  }

  private generateSocialProofSection(genome: DesignGenome): string {
    const social = genome.chromosomes.ch22_social_proof;

    let content = '';

    switch (social.type) {
      case 'testimonials_grid':
        content = this.generateTestimonialsGrid(genome);
        break;
      case 'customer_logos':
        content = this.generateCustomerLogos(genome);
        break;
      case 'rating_stars':
        content = this.generateRatingStars(genome);
        break;
      default:
        content = this.generateTestimonialsGrid(genome);
    }

    const sectionTitle = genome.chromosomes.ch25_copy_engine.sectionTitleTestimonials;
    return `<section class="social-proof" id="testimonials">
  <div class="container">
    ${sectionTitle ? `<h2 class="section-title">${sectionTitle}</h2>` : ''}
    ${content}
  </div>
</section>`;
  }

  private generateTestimonialsGrid(genome: DesignGenome): string {
    const copy = genome.chromosomes.ch25_copy_engine;
    if (!copy.testimonial) return '';
    return `<div class="testimonials-grid">
  <div class="testimonial-card">
    <p>"${copy.testimonial}"</p>
    ${copy.authorName ? `<div class="testimonial-author">
      <strong>${copy.authorName}</strong>
      ${copy.authorTitle ? `<span>${copy.authorTitle}</span>` : ''}
    </div>` : ''}
  </div>
</div>`;
  }

  private generateCustomerLogos(genome: DesignGenome): string {
    const social = genome.chromosomes.ch22_social_proof;
    const count = typeof social.logoCount === 'number' ? Math.min(social.logoCount, 8) : 5;
    // Brand names derived from dnaHash bytes — no hardcoded names
    const prefixes = ['Apex','Stratum','Nexus','Vertex','Zenith','Cascade','Prism','Epoch','Vantage','Meridian'];
    const suffixes = ['Group','Labs','Ventures','Partners','Corp','Works','Systems','Co'];
    const h = genome.dnaHash;
    const items = Array.from({ length: count }, (_, i) => {
      const pre = prefixes[parseInt(h.slice(i*4,   i*4+2), 16) % prefixes.length];
      const suf = suffixes[parseInt(h.slice(i*4+2, i*4+4), 16) % suffixes.length];
      const brand = `${pre} ${suf}`;
      return `  <div class="logo-item" aria-label="${brand}">
    <span class="logo-wordmark">${brand}</span>
  </div>`;
    }).join('\n');
    return `<div class="logos-row">
${items}
</div>`;
  }

  private generateRatingStars(genome: DesignGenome): string {
    const copy = genome.chromosomes.ch25_copy_engine;
    const ratingStat = copy.stats.find(s => s.label.toLowerCase().includes('rating'));
    if (!ratingStat) return '';

    const numericRating = parseFloat(ratingStat.value);
    const starCount = !isNaN(numericRating) ? Math.round(Math.min(numericRating, 5)) : 5;
    const stars = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);

    return `<div class="rating-display">
  <div class="rating-stars">${stars}</div>
  <div class="rating-text">${ratingStat.value} ${ratingStat.label}</div>
</div>`;
  }

  private generateContentSections(genome: DesignGenome): string {
    const contentDepth = genome.chromosomes.ch23_content_depth;
    const sections: string[] = [];

    if (contentDepth.hasFeatures !== false) {
      sections.push(this.generateFeaturesSection(genome));
    }

    if (contentDepth.hasFAQ) {
      sections.push(this.generateFAQSection(genome));
    }

    if (contentDepth.hasCTA) {
      sections.push(this.generateCTASection(genome));
    }

    return sections.join('\n\n');
  }

  private generateFeaturesSection(genome: DesignGenome): string {
    const copy = genome.chromosomes.ch25_copy_engine;
    return `<section class="features" id="features">
  <div class="container">
    ${copy.sectionTitleFeatures ? `<h2 class="section-title">${copy.sectionTitleFeatures}</h2>` : ''}
    <div class="features-grid">
      ${copy.features.map(f => `
      <div class="feature-card">
        <h3>${f.title}</h3>
        <p>${f.description}</p>
      </div>`).join('')}
    </div>
  </div>
</section>`;
  }

  private generateFAQSection(genome: DesignGenome): string {
    const copy = genome.chromosomes.ch25_copy_engine;
    return `<section class="faq" id="faq">
  <div class="container">
    ${copy.sectionTitleFAQ ? `<h2 class="section-title">${copy.sectionTitleFAQ}</h2>` : ''}
    <div class="faq-list">
      ${copy.faq.map(f => `
      <details class="faq-item">
        <summary>${f.question}</summary>
        <p>${f.answer}</p>
      </details>`).join('')}
    </div>
  </div>
</section>`;
  }

  private generateCTASection(genome: DesignGenome): string {
    const copy = genome.chromosomes.ch25_copy_engine;
    return `<section class="cta" id="cta">
  <div class="container">
    ${copy.headline ? `<h2 class="cta-title">${copy.headline}</h2>` : ''}
    ${copy.tagline ? `<p class="cta-subtitle">${copy.tagline}</p>` : ''}
    ${copy.cta ? `<a href="#signup" class="btn btn-primary btn-large">${copy.cta}</a>` : ''}
  </div>
</section>`;
  }

  private generateFooter(genome: DesignGenome): string {
    const copy = genome.chromosomes.ch25_copy_engine;
    const productCol = copy.footerNavProduct.length > 0
      ? `<div class="footer-links">
        ${copy.footerProductTitle ? `<h4>${copy.footerProductTitle}</h4>` : ''}
        <ul>
          ${copy.footerNavProduct.map(link => `<li><a href="#">${link}</a></li>`).join('\n          ')}
        </ul>
      </div>`
      : '';
    const companyCol = copy.footerNavCompany.length > 0
      ? `<div class="footer-links">
        ${copy.footerCompanyTitle ? `<h4>${copy.footerCompanyTitle}</h4>` : ''}
        <ul>
          ${copy.footerNavCompany.map(link => `<li><a href="#">${link}</a></li>`).join('\n          ')}
        </ul>
      </div>`
      : '';
    return `<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="logo">${copy.companyName}</div>
        ${copy.tagline ? `<p>${copy.tagline}</p>` : ''}
      </div>
      ${productCol}
      ${companyCol}
    </div>
    <div class="footer-bottom">
      <p>&copy; ${new Date().getFullYear()} ${copy.companyName}. All rights reserved.</p>
    </div>
  </div>
</footer>`;
  }

  /**
   * Generate topology description for the design
   */
  generateTopology(genome: DesignGenome): any {
    const { chromosomes } = genome;
    return {
      structure: chromosomes.ch1_structure,
      hierarchy: chromosomes.ch10_hierarchy,
      sections: chromosomes.ch23_content_depth.estimatedSections,
      hasHero: chromosomes.ch23_content_depth.hasHero,
      hasFeatures: chromosomes.ch23_content_depth.hasFeatures,
      hasCTA: chromosomes.ch23_content_depth.hasCTA,
      hasFAQ: chromosomes.ch23_content_depth.hasFAQ,
      hasTestimonials: chromosomes.ch23_content_depth.hasTestimonials,
      heroType: chromosomes.ch19_hero_type.type,
      layout: chromosomes.ch19_hero_variant_detail.layout
    };
  }
}
