/**
 * Permutations MCP - HTML Generator
 * 
 * Generates HTML with hero types, trust signals,
 * and sector-appropriate layouts.
 */

import { DesignGenome, HeroType, HeroLayoutVariant, TrustProminence, SocialProofType } from "./genome/types.js";

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
        parts.push(`  <title>Permutations Design</title>`);
        parts.push(`  <link rel="stylesheet" href="styles.css">`);
        parts.push(`</head>`);
        parts.push(`<body>`);
        
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
        
        return `<header class="header">
  <div class="container">
    <nav class="nav">
      <a href="#" class="logo">Logo</a>
      <ul class="nav-links">
        ${contentDepth.hasHero ? '<li><a href="#hero">Home</a></li>' : ''}
        ${contentDepth.level !== 'minimal' ? '<li><a href="#features">Features</a></li>' : ''}
        ${contentDepth.hasTestimonials ? '<li><a href="#testimonials">Reviews</a></li>' : ''}
        ${contentDepth.hasFAQ ? '<li><a href="#faq">FAQ</a></li>' : ''}
        ${contentDepth.hasCTA ? '<li><a href="#cta" class="btn btn-primary">Get Started</a></li>' : ''}
      </ul>
    </nav>
  </div>
</header>`;
    }
    
    private generateHero(genome: DesignGenome): string {
        const hero = genome.chromosomes.ch19_hero_type;
        const variant = genome.chromosomes.ch19_hero_variant_detail;
        const visual = genome.chromosomes.ch20_visual_treatment;
        const trust = genome.chromosomes.ch21_trust_signals;
        
        const parts: string[] = [];
        
        parts.push(`<section class="hero" id="hero">`);
        
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
    
    private generateTrustAuthorityHero(genome: DesignGenome, layout: HeroLayoutVariant): string {
        const content = genome.chromosomes.ch21_trust_content;
        const credentials = content.credentials || ['Certified', 'Licensed', 'Accredited'];
        
        return `  <div class="hero-content">
    <div class="hero-trust-badges">
      ${credentials.slice(0, 3).map(c => 
        `<span class="hero-trust-badge">✓ ${c}</span>`
      ).join('\n      ')}
    </div>
    <h1 class="text-h1">Trusted by Industry Leaders</h1>
    <p class="hero-subtitle">Join thousands of professionals who rely on our proven solutions for exceptional results.</p>
    <div class="hero-ctas">
      <a href="#cta" class="btn btn-primary">Get Started</a>
      <a href="#learn" class="btn btn-secondary">Learn More</a>
    </div>
  </div>`;
    }
    
    private generateProductUIHero(genome: DesignGenome, layout: HeroLayoutVariant): string {
        const hasVisual = layout === 'split_right' || layout === 'split_left' || layout === 'floating_cards';
        
        const content = `  <div class="hero-content">
    <h1 class="text-h1">Productivity, Simplified</h1>
    <p class="hero-subtitle">Everything you need to manage projects, collaborate with your team, and deliver results faster.</p>
    <div class="hero-ctas">
      <a href="#trial" class="btn btn-primary">Start Free Trial</a>
      <a href="#demo" class="btn btn-secondary">Watch Demo</a>
    </div>
  </div>`;
        
        const visual = `  <div class="hero-visual">
    <div class="hero-screenshot">
      <img src="product-screenshot.jpg" alt="Product Dashboard" />
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
    
    private generateStatsCounterHero(genome: DesignGenome, layout: HeroLayoutVariant): string {
        return `  <div class="hero-content">
    <h1 class="text-h1">Results That Speak</h1>
    <p class="hero-subtitle">Join the growing community achieving measurable outcomes.</p>
    <div class="hero-stats">
      <div class="hero-stat">
        <div class="hero-stat-number">10K+</div>
        <div class="hero-stat-label">Active Users</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-number">99.9%</div>
        <div class="hero-stat-label">Uptime</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-number">4.9</div>
        <div class="hero-stat-label">Rating</div>
      </div>
    </div>
    <div class="hero-ctas">
      <a href="#cta" class="btn btn-primary">Join Now</a>
    </div>
  </div>`;
    }
    
    private generateSearchDiscoveryHero(genome: DesignGenome, layout: HeroLayoutVariant): string {
        return `  <div class="hero-content">
    <h1 class="text-h1">Find What You Need</h1>
    <p class="hero-subtitle">Search through millions of resources, products, and destinations.</p>
    <div class="hero-search">
      <input type="text" class="hero-search-input" placeholder="Search for anything..." />
      <button class="btn btn-primary">Search</button>
    </div>
    <div class="hero-filters">
      <span class="filter-tag">Popular: </span>
      <a href="#" class="filter-link">Design</a>
      <a href="#" class="filter-link">Development</a>
      <a href="#" class="filter-link">Marketing</a>
    </div>
  </div>`;
    }
    
    private generateServiceShowcaseHero(genome: DesignGenome, layout: HeroLayoutVariant): string {
        return `  <div class="hero-content">
    <h1 class="text-h1">Expert Services</h1>
    <p class="hero-subtitle">Comprehensive solutions tailored to your unique needs.</p>
    <div class="hero-services-grid">
      <div class="service-card">
        <h3>Strategy</h3>
        <p>Strategic planning and consulting</p>
      </div>
      <div class="service-card">
        <h3>Design</h3>
        <p>Beautiful, functional design</p>
      </div>
      <div class="service-card">
        <h3>Development</h3>
        <p>Robust, scalable solutions</p>
      </div>
    </div>
  </div>`;
    }
    
    private generateBrandLogoHero(genome: DesignGenome, layout: HeroLayoutVariant): string {
        return `  <div class="hero-content">
    <div class="hero-logo-large">
      <img src="logo.svg" alt="Brand Logo" />
    </div>
    <p class="hero-tagline">Defining the future of excellence</p>
    <div class="hero-ctas">
      <a href="#explore" class="btn btn-primary">Explore</a>
    </div>
  </div>`;
    }
    
    private generateTestimonialFocusHero(genome: DesignGenome, layout: HeroLayoutVariant): string {
        return `  <div class="hero-content">
    <div class="hero-testimonial-featured">
      <blockquote>
        "This solution transformed how we work. The results exceeded all expectations."
      </blockquote>
      <div class="testimonial-author">
        <img src="avatar.jpg" alt="Author" class="author-avatar" />
        <div class="author-info">
          <div class="author-name">Sarah Johnson</div>
          <div class="author-title">CEO, TechCorp</div>
        </div>
      </div>
    </div>
    <div class="hero-ctas">
      <a href="#story" class="btn btn-primary">Read Full Story</a>
    </div>
  </div>`;
    }
    
    private generateEditorialFeatureHero(genome: DesignGenome, layout: HeroLayoutVariant): string {
        return `  <div class="hero-content">
    <span class="hero-category">Featured Story</span>
    <h1 class="text-h1">The Art of Modern Design</h1>
    <p class="hero-excerpt">Exploring the intersection of technology and creativity in today's digital landscape. Discover how leading brands are redefining user experiences.</p>
    <div class="hero-meta">
      <span>By Jane Smith</span>
      <span>•</span>
      <span>5 min read</span>
    </div>
    <div class="hero-ctas">
      <a href="#read" class="btn btn-primary">Read Article</a>
    </div>
  </div>`;
    }
    
    private generateAspirationalImageryHero(genome: DesignGenome, layout: HeroLayoutVariant): string {
        return `  <div class="hero-content">
    <h1 class="text-h1">Live Your Best Life</h1>
    <p class="hero-subtitle">Discover experiences that inspire and transform.</p>
    <div class="hero-ctas">
      <a href="#explore" class="btn btn-primary">Start Exploring</a>
    </div>
  </div>`;
    }
    
    private generateConfigurator3DHero(genome: DesignGenome, layout: HeroLayoutVariant): string {
        return `  <div class="hero-content">
    <h1 class="text-h1">Customize Your Experience</h1>
    <p class="hero-subtitle">Build exactly what you need with our interactive configurator.</p>
    <div class="configurator-preview">
      <div class="config-3d-viewer">
        <!-- 3D Configurator goes here -->
        <div class="config-placeholder">3D Preview</div>
      </div>
      <div class="config-options">
        <div class="option-group">
          <label>Color</label>
          <div class="color-options">
            <button class="color-swatch active" style="background: #333"></button>
            <button class="color-swatch" style="background: #666"></button>
            <button class="color-swatch" style="background: #999"></button>
          </div>
        </div>
        <div class="config-price">
          <span class="price-label">Starting at</span>
          <span class="price-value">$299</span>
        </div>
        <a href="#configure" class="btn btn-primary">Configure Now</a>
      </div>
    </div>
  </div>`;
    }
    
    private generateContentCarouselHero(genome: DesignGenome, layout: HeroLayoutVariant): string {
        return `  <div class="hero-content">
    <h1 class="text-h1">Featured Content</h1>
    <div class="hero-carousel">
      <div class="carousel-item">
        <img src="content-1.jpg" alt="Content 1" />
        <h3>Latest Release</h3>
      </div>
      <div class="carousel-item">
        <img src="content-2.jpg" alt="Content 2" />
        <h3>Trending Now</h3>
      </div>
      <div class="carousel-item">
        <img src="content-3.jpg" alt="Content 3" />
        <h3>Coming Soon</h3>
      </div>
    </div>
  </div>`;
    }
    
    private generateProductVideoHero(genome: DesignGenome, layout: HeroLayoutVariant): string {
        return `  <div class="hero-content">
    <h1 class="text-h1">See It In Action</h1>
    <p class="hero-subtitle">Watch how our product transforms workflows in real-time.</p>
    <div class="hero-video-cta">
      <button class="play-button">
        <span class="play-icon">▶</span>
        <span>Watch Video</span>
      </button>
    </div>
    <div class="hero-ctas">
      <a href="#trial" class="btn btn-primary">Start Free Trial</a>
    </div>
  </div>`;
    }
    
    private generateDefaultHero(genome: DesignGenome): string {
        return `  <div class="hero-content">
    <h1 class="text-h1">Welcome</h1>
    <p class="hero-subtitle">Discover something amazing.</p>
    <div class="hero-ctas">
      <a href="#explore" class="btn btn-primary">Get Started</a>
    </div>
  </div>`;
    }
    
    private generateTrustSection(genome: DesignGenome): string {
        const trust = genome.chromosomes.ch21_trust_signals;
        
        if (trust.prominence === 'subtle') {
            return '';
        }
        
        return `<section class="trust-section" id="trust">
  <div class="container">
    <div class="trust-grid">
      <div class="trust-item">
        <div class="trust-number">10K+</div>
        <div class="trust-label">Customers</div>
      </div>
      <div class="trust-item">
        <div class="trust-number">99%</div>
        <div class="trust-label">Satisfaction</div>
      </div>
      <div class="trust-item">
        <div class="trust-number">24/7</div>
        <div class="trust-label">Support</div>
      </div>
    </div>
  </div>
</section>`;
    }
    
    private generateSocialProofSection(genome: DesignGenome): string {
        const social = genome.chromosomes.ch22_social_proof;
        
        let content = '';
        
        switch (social.type) {
            case 'testimonials_grid':
                content = this.generateTestimonialsGrid();
                break;
            case 'customer_logos':
                content = this.generateCustomerLogos();
                break;
            case 'rating_stars':
                content = this.generateRatingStars();
                break;
            default:
                content = this.generateTestimonialsGrid();
        }
        
        return `<section class="social-proof" id="testimonials">
  <div class="container">
    <h2 class="section-title">What People Say</h2>
    ${content}
  </div>
</section>`;
    }
    
    private generateTestimonialsGrid(): string {
        return `<div class="testimonials-grid">
  <div class="testimonial-card">
    <p>"Exceptional service and outstanding results. Highly recommend!"</p>
    <div class="testimonial-author">
      <strong>John Doe</strong>
      <span>CEO, Company</span>
    </div>
  </div>
  <div class="testimonial-card">
    <p>"Transformed our business operations completely."</p>
    <div class="testimonial-author">
      <strong>Jane Smith</strong>
      <span>CTO, Startup</span>
    </div>
  </div>
  <div class="testimonial-card">
    <p>"The best investment we've made this year."</p>
    <div class="testimonial-author">
      <strong>Mike Johnson</strong>
      <span>Director, Corp</span>
    </div>
  </div>
</div>`;
    }
    
    private generateCustomerLogos(): string {
        return `<div class="logos-row">
  <div class="logo-item">Logo 1</div>
  <div class="logo-item">Logo 2</div>
  <div class="logo-item">Logo 3</div>
  <div class="logo-item">Logo 4</div>
  <div class="logo-item">Logo 5</div>
</div>`;
    }
    
    private generateRatingStars(): string {
        return `<div class="rating-display">
  <div class="rating-stars">★★★★★</div>
  <div class="rating-text">4.9/5 from 2,000+ reviews</div>
</div>`;
    }
    
    private generateContentSections(genome: DesignGenome): string {
        const contentDepth = genome.chromosomes.ch23_content_depth;
        const sections: string[] = [];
        
        if (contentDepth.hasFeatures !== false) {
            sections.push(this.generateFeaturesSection());
        }
        
        if (contentDepth.hasFAQ) {
            sections.push(this.generateFAQSection());
        }
        
        if (contentDepth.hasCTA) {
            sections.push(this.generateCTASection());
        }
        
        return sections.join('\n\n');
    }
    
    private generateFeaturesSection(): string {
        return `<section class="features" id="features">
  <div class="container">
    <h2 class="section-title">Features</h2>
    <div class="features-grid">
      <div class="feature-card">
        <h3>Feature One</h3>
        <p>Description of the first amazing feature.</p>
      </div>
      <div class="feature-card">
        <h3>Feature Two</h3>
        <p>Description of the second amazing feature.</p>
      </div>
      <div class="feature-card">
        <h3>Feature Three</h3>
        <p>Description of the third amazing feature.</p>
      </div>
    </div>
  </div>
</section>`;
    }
    
    private generateFAQSection(): string {
        return `<section class="faq" id="faq">
  <div class="container">
    <h2 class="section-title">Frequently Asked Questions</h2>
    <div class="faq-list">
      <details class="faq-item">
        <summary>How do I get started?</summary>
        <p>Simply sign up for a free account and follow the onboarding process.</p>
      </details>
      <details class="faq-item">
        <summary>Is there a free trial?</summary>
        <p>Yes, we offer a 14-day free trial with full access to all features.</p>
      </details>
    </div>
  </div>
</section>`;
    }
    
    private generateCTASection(): string {
        return `<section class="cta" id="cta">
  <div class="container">
    <h2 class="cta-title">Ready to Get Started?</h2>
    <p class="cta-subtitle">Join thousands of satisfied customers today.</p>
    <a href="#signup" class="btn btn-primary btn-large">Start Free Trial</a>
  </div>
</section>`;
    }
    
    private generateFooter(genome: DesignGenome): string {
        return `<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="logo">Logo</div>
        <p>Building the future, one pixel at a time.</p>
      </div>
      <div class="footer-links">
        <h4>Product</h4>
        <ul>
          <li><a href="#">Features</a></li>
          <li><a href="#">Pricing</a></li>
          <li><a href="#">API</a></li>
        </ul>
      </div>
      <div class="footer-links">
        <h4>Company</h4>
        <ul>
          <li><a href="#">About</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 Company Name. All rights reserved.</p>
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
