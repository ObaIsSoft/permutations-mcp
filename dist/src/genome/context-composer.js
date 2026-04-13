/**
 * Context Composer
 *
 * Composes a complete page specification from:
 * - Genome (design DNA: colors, typography, motion, etc.)
 * - Context (what the page IS: ecommerce, dashboard, landing, etc.)
 * - Structure Selection (patterns from established libraries)
 *
 * Output: PageCompositionSpec — a complete blueprint for React/HTML generation.
 * NOT templates — algorithmic composition based on genome parameters.
 */
import { selectStructure } from "./structure-selector.js";
import { detectPageContext, calculateComplexity } from "./context-detector.js";
import { selectComponentLibrary, COMPONENT_LIBRARY_CATALOG } from "./component-catalog.js";
// ── Composer ────────────────────────────────────────────────────────────────
export class ContextComposer {
    /**
     * Compose complete page specification from genome + intent.
     *
     * This is the main entry point — it:
     * 1. Detects page context from intent
     * 2. Selects structural patterns from catalog
     * 3. Composes genome-derived component specs
     * 4. Selects appropriate libraries
     * 5. Returns a complete composition spec
     */
    async compose(genome, intent) {
        // Step 1: Detect context
        const context = detectPageContext(intent, genome.sectorContext.primary, genome);
        // Step 2: Select structural patterns
        const structure = selectStructure(genome, context);
        // Step 3: Compose full spec
        return this.composeFromStructure(genome, context, structure);
    }
    /**
     * Compose from pre-selected structure (for testing/override)
     */
    async composeFromStructure(genome, context, structure) {
        const ch = genome.chromosomes;
        const selectedLibraries = await this.selectLibraries(genome);
        return {
            layout: this.buildLayout(genome, structure),
            navigation: this.buildNavigation(genome, structure),
            hero: this.buildHero(genome, structure),
            sections: this.buildSections(genome, structure),
            footer: this.buildFooter(genome, structure),
            sidebar: this.buildSidebar(genome, structure),
            cta: this.buildCTA(genome, structure),
            components: this.buildComponents(genome, structure),
            selectedLibraries,
            cssVariables: this.generateCSSVariables(genome),
            animationConfig: this.buildAnimationConfig(genome),
            genome,
            context,
            compositionRationale: structure.rationale,
        };
    }
    // ── Layout ──────────────────────────────────────────────────────────────
    buildLayout(genome, structure) {
        const ch = genome.chromosomes;
        const grid = ch.ch9_grid;
        const comp = ch.ch33_composition_strategy;
        return {
            type: comp?.layoutPattern ?? "single_column",
            pattern: structure.layout,
            grid: {
                logic: grid?.logic ?? "column",
                columns: grid?.columns ?? 2,
                gap: grid?.gap ?? 16,
                asymmetry: grid?.asymmetry ?? 0.5,
            },
            flow: comp?.contentFlow ?? "top_down",
            responsive: comp?.responsiveBehavior ?? "stack",
            density: comp?.densityDistribution ?? "uniform",
        };
    }
    // ── Navigation ──────────────────────────────────────────────────────────
    buildNavigation(genome, structure) {
        const ch = genome.chromosomes;
        const comp = ch.ch33_composition_strategy;
        const ia = ch.ch23_information_architecture;
        if (comp?.navRequirement === "none")
            return null;
        return {
            type: comp?.navRequirement ?? "header_standard",
            pattern: structure.navigation,
            style: ia?.navigationType ?? "header",
            items: this.generateNavItems(genome),
            behavior: {
                sticky: "true",
                backdrop: "var(--nav-backdrop, none)",
                animation: "var(--nav-animation, none)",
            },
        };
    }
    generateNavItems(genome) {
        const sector = genome.sectorContext.primary;
        const items = [];
        // Sector-appropriate default nav items
        const baseItems = {
            ecommerce: ["Shop", "Categories", "About", "Contact"],
            dashboard: ["Overview", "Analytics", "Reports", "Settings"],
            landing: ["Features", "Pricing", "About", "Contact"],
            blog: ["Articles", "Categories", "About", "Subscribe"],
            portfolio: ["Work", "About", "Services", "Contact"],
            documentation: ["Guides", "API Reference", "Examples", "Community"],
            saas: ["Features", "Pricing", "Docs", "Blog", "Contact"],
            agency: ["Services", "Work", "About", "Blog", "Contact"],
            creative: ["Work", "About", "Process", "Contact"],
            healthcare: ["Services", "About", "Providers", "Contact"],
            fintech: ["Products", "Pricing", "About", "Support"],
            education: ["Courses", "About", "Instructors", "Contact"],
        };
        const navLabels = baseItems[sector] ?? baseItems.landing;
        for (const label of navLabels) {
            items.push({
                label,
                href: `/${label.toLowerCase().replace(/\s+/g, "-")}`,
            });
        }
        return items;
    }
    // ── Hero ────────────────────────────────────────────────────────────────
    buildHero(genome, structure) {
        const ch = genome.chromosomes;
        const comp = ch.ch33_composition_strategy;
        if (comp?.heroProminence === "none")
            return null;
        const hero = ch.ch19_hero_type;
        const heroDetail = ch.ch19_hero_variant_detail;
        const colors = ch.ch5_color_primary;
        const motion = ch.ch8_motion;
        const choreography = ch.ch27_motion_choreography;
        return {
            type: hero?.type ?? "manifesto_statement",
            pattern: structure.hero,
            layout: heroDetail?.layout ?? "centered",
            height: heroDetail?.height ?? "full",
            background: colors?.hex ?? "#000000",
            animation: {
                type: motion?.physics ?? "none",
                entrySequence: choreography?.entrySequence ?? "cascade_down",
                staggerInterval: choreography?.staggerInterval ?? 80,
            },
            content: {
                headline: ch.ch25_copy_engine?.headline ?? "Welcome",
                subheadline: ch.ch25_copy_engine?.subheadline ?? "",
                cta: ch.ch25_copy_engine?.cta ?? "Get Started",
                ctaSecondary: ch.ch25_copy_engine?.ctaSecondary ?? "Learn More",
            },
        };
    }
    // ── Sections ────────────────────────────────────────────────────────────
    buildSections(genome, structure) {
        const ch = genome.chromosomes;
        const grid = ch.ch9_grid;
        const motion = ch.ch8_motion;
        const colors = ch.ch5_color_primary;
        const edge = ch.ch7_edge;
        const rhythm = ch.ch2_rhythm;
        return structure.sections.map((pattern, index) => ({
            type: pattern.category,
            pattern,
            order: index,
            props: {
                // Genome-derived props
                colors: {
                    primary: colors?.hex ?? "#000000",
                    secondary: ch.ch26_color_system?.secondary?.hex ?? "#333333",
                    accent: ch.ch26_color_system?.accent?.hex ?? "#ff6600",
                },
                typography: {
                    display: ch.ch3_type_display?.family ?? "system-ui",
                    body: ch.ch4_type_body?.family ?? "system-ui",
                },
                edge: {
                    radius: edge?.radius ?? 8,
                    style: edge?.style ?? "soft",
                },
                motion: {
                    physics: motion?.physics ?? "none",
                    duration: motion?.durationScale ?? 1,
                },
                rhythm: {
                    spacing: rhythm?.baseSpacing ?? 16,
                    sectionGap: rhythm?.sectionSpacing ?? 64,
                },
                // Pattern-specific props from adaptive props
                ...pattern.adaptiveProps.reduce((acc, ap) => {
                    acc[ap.name] = ap.defaultValue ?? "";
                    return acc;
                }, {}),
            },
            children: this.generateSectionChildren(pattern, genome),
        }));
    }
    generateSectionChildren(pattern, genome) {
        const ch = genome.chromosomes;
        const children = [];
        // Use component catalog to find matching components for this section
        const searchTerms = this.getSearchTermsForCategory(pattern.category);
        for (const lib of COMPONENT_LIBRARY_CATALOG) {
            for (const comp of lib.components) {
                // Match component to section by category or name
                if (searchTerms.some(term => comp.category.toLowerCase().includes(term) ||
                    comp.name.toLowerCase().includes(term))) {
                    // Generate component spec from catalog definition
                    children.push({
                        type: comp.name,
                        props: this.deriveComponentProps(comp, genome),
                        library: lib.name,
                    });
                }
            }
        }
        // Fallback: if no catalog match, use genome copy data
        if (children.length === 0) {
            children.push(this.generateFallbackComponent(pattern, genome));
        }
        return children;
    }
    /**
     * Get search terms for a section category
     */
    getSearchTermsForCategory(category) {
        const termMap = {
            hero: ["hero"],
            feature: ["feature"],
            testimonial: ["testimonial"],
            pricing: ["pricing"],
            cta: ["cta", "button"],
            faq: ["faq", "accordion"],
            stats: ["stats", "metrics"],
            team: ["team", "avatar"],
            blog: ["blog", "card"],
            gallery: ["gallery", "image"],
            contact: ["contact", "form", "input"],
            newsletter: ["newsletter", "form", "input"],
            logo_wall: ["logo"],
            trust: ["trust", "badge"],
            social: ["social", "proof"],
            process: ["process", "steps"],
            timeline: ["timeline"],
            content: ["card", "grid", "box"],
            product: ["product", "card"],
            comparison: ["comparison", "table"],
            navigation: ["nav", "menu"],
            footer: ["footer"],
            sidebar: ["sidebar"],
        };
        return termMap[category] || [category];
    }
    /**
     * Derive component props from genome chromosomes
     */
    deriveComponentProps(component, genome) {
        const ch = genome.chromosomes;
        const props = {};
        for (const prop of component.props || []) {
            if (prop.genomeAdaptive) {
                const value = this.resolveGenomeRef(prop.genomeAdaptive.chromosome, prop.genomeAdaptive.property, genome);
                props[prop.name] = this.applyTransform(prop.genomeAdaptive.transform, value);
            }
            else if (prop.defaultValue !== undefined) {
                props[prop.name] = prop.defaultValue;
            }
        }
        return props;
    }
    /**
     * Generate a fallback component when no catalog match
     */
    generateFallbackComponent(pattern, genome) {
        const ch = genome.chromosomes;
        return {
            type: `Section${pattern.category.charAt(0).toUpperCase() + pattern.category.slice(1)}`,
            props: {
                title: ch.ch25_copy_engine?.headline ?? `${pattern.category} Section`,
                description: ch.ch25_copy_engine?.subheadline ?? "",
                columns: ch.ch9_grid?.columns ?? 3,
                gap: ch.ch9_grid?.gap ?? 16,
                radius: ch.ch7_edge?.radius ?? 8,
                style: ch.ch7_edge?.style ?? "soft",
            },
        };
    }
    /**
     * Resolve a genome reference like "ch5_color_primary.hex"
     */
    resolveGenomeRef(ref, property, genome) {
        const parts = ref.split(".");
        let value = genome;
        for (const part of parts) {
            if (value === undefined || value === null)
                return "";
            value = value[part];
        }
        if (property && value && typeof value === "object") {
            return value[property] ?? "";
        }
        return value ?? "";
    }
    /**
     * Apply a transform to a genome value
     */
    applyTransform(transform, value) {
        if (!transform)
            return value;
        switch (transform) {
            case "color_map": return value;
            case "radius_map": return typeof value === "number" ? value : 8;
            case "spacing_map": return typeof value === "number" ? value : 16;
            case "shadow_map": return typeof value === "number" ? value : 0.5;
            case "variant_map": return value === "sharp" ? "outline" : value === "organic" ? "ghost" : "default";
            case "size_map": return value < 12 ? "sm" : value > 24 ? "lg" : "md";
            case "avatar_radius_map": return 9999;
            case "cols_map": return value;
            case "card_variant_map": return value === "flat" ? "flat" : value === "neumorphic" ? "elevated" : "elevated";
            default: return value;
        }
    }
    // ── Footer ──────────────────────────────────────────────────────────────
    buildFooter(genome, structure) {
        const ch = genome.chromosomes;
        const ia = ch.ch23_information_architecture;
        if (!ia?.hasFooter)
            return null;
        return {
            type: ia.footerType ?? "minimal",
            pattern: structure.footer,
            columns: 4,
            links: this.generateFooterLinks(genome),
        };
    }
    generateFooterLinks(genome) {
        const sector = genome.sectorContext.primary;
        const copy = genome.chromosomes.ch25_copy_engine;
        // Sector-appropriate footer columns. Copy engine override takes priority.
        const footerMap = {
            ecommerce: { Shop: ["New Arrivals", "Sale", "Wishlist"], Account: ["Orders", "Returns", "Gift Cards"], Help: ["FAQ", "Shipping", "Contact"], Legal: ["Privacy", "Terms", "Cookies"] },
            dashboard: { Product: ["Features", "Changelog", "Roadmap"], Developers: ["API", "SDKs", "Webhooks"], Support: ["Docs", "Status", "Contact"], Legal: ["Privacy", "Terms", "Security"] },
            landing: { Product: ["Features", "Pricing", "Integrations"], Company: ["About", "Blog", "Careers"], Resources: ["Help", "Community", "Changelog"], Legal: ["Privacy", "Terms", "Cookies"] },
            blog: { Content: ["Articles", "Newsletter", "Archive"], Topics: ["Technology", "Design", "Business"], About: ["Team", "Mission", "Advertise"], Legal: ["Privacy", "Terms", "RSS"] },
            portfolio: { Work: ["Projects", "Case Studies", "Archive"], Services: ["Design", "Strategy", "Consulting"], About: ["Story", "Process", "Clients"], Connect: ["Contact", "LinkedIn", "Twitter"] },
            documentation: { Docs: ["Guides", "API Reference", "Examples"], Community: ["Forum", "GitHub", "Discord"], Company: ["About", "Blog", "Careers"], Legal: ["Privacy", "Terms", "License"] },
            saas: { Product: ["Features", "Pricing", "Security"], Developers: ["API", "Docs", "Status"], Company: ["About", "Blog", "Careers"], Legal: ["Privacy", "Terms", "Cookies"] },
            agency: { Services: ["Strategy", "Design", "Development"], Work: ["Case Studies", "Portfolio", "Awards"], Agency: ["About", "Team", "Culture"], Contact: ["Inquiries", "Press", "Careers"] },
            creative: { Work: ["Portfolio", "Exhibitions", "Collaborations"], Studio: ["About", "Process", "Team"], Contact: ["Commissions", "Press", "Social"], Legal: ["Privacy", "Terms", "Copyright"] },
            healthcare: { Services: ["Treatments", "Specialists", "Facilities"], Patients: ["Appointments", "Patient Portal", "Insurance"], About: ["Mission", "Providers", "Locations"], Legal: ["Privacy", "HIPAA", "Terms"] },
            fintech: { Products: ["Payments", "Lending", "Insurance"], Company: ["About", "Investors", "Press"], Resources: ["API", "Docs", "Status"], Legal: ["Privacy", "Terms", "Compliance"] },
            education: { Programs: ["Courses", "Certificates", "Bootcamps"], Support: ["Tutoring", "Career", "Community"], Institution: ["About", "Faculty", "Admissions"], Legal: ["Privacy", "Terms", "Accreditation"] },
            real_estate: { Buy: ["Search Listings", "Open Houses", "Mortgage"], Sell: ["Home Value", "Agent Match", "Selling Guide"], About: ["Agents", "Reviews", "Press"], Legal: ["Privacy", "Terms", "Fair Housing"] },
            travel: { Explore: ["Destinations", "Packages", "Last Minute"], Plan: ["Hotels", "Flights", "Activities"], About: ["Story", "Partners", "Press"], Legal: ["Privacy", "Terms", "Refunds"] },
            food: { Menu: ["Dine In", "Takeout", "Catering"], About: ["Story", "Chef", "Sourcing"], Visit: ["Locations", "Hours", "Reservations"], Legal: ["Privacy", "Allergens", "Terms"] },
            gaming: { Play: ["Games", "Beta Access", "Leaderboard"], Community: ["Forums", "Discord", "Tournaments"], About: ["Studio", "Careers", "Press"], Legal: ["Privacy", "Terms", "EULA"] },
            crypto_web3: { Protocol: ["Whitepaper", "Tokenomics", "Roadmap"], Developers: ["Docs", "GitHub", "Grants"], Community: ["Discord", "Twitter", "Governance"], Legal: ["Privacy", "Terms", "Risk"] },
        };
        // Use copy engine company name as the brand column label if available
        const links = footerMap[sector] ?? {
            Product: ["Features", "Pricing", "Documentation"],
            Company: ["About", "Blog", "Careers"],
            Resources: ["Help", "Community", "Contact"],
            Legal: ["Privacy", "Terms", "Cookies"],
        };
        return links;
    }
    // ── Sidebar ─────────────────────────────────────────────────────────────
    buildSidebar(genome, structure) {
        const ch = genome.chromosomes;
        const ia = ch.ch23_information_architecture;
        if (!structure.sidebar && ia?.navigationType !== "sidebar")
            return null;
        // Derive sidebar width from grid asymmetry + base spacing.
        // asymmetry 0 = minimal (220px), asymmetry 1 = heavy sidebar (360px).
        const asymmetry = ch.ch9_grid?.asymmetry ?? 0.5;
        const baseSpacing = ch.ch2_rhythm?.baseSpacing ?? 16;
        const sidebarWidth = Math.round(220 + asymmetry * 140 + baseSpacing * 0.5);
        return {
            type: "sidebar",
            pattern: structure.sidebar,
            position: "left",
            collapsible: true,
            width: `${sidebarWidth}px`,
        };
    }
    // ── CTA ─────────────────────────────────────────────────────────────────
    buildCTA(genome, structure) {
        const ch = genome.chromosomes;
        return {
            type: "cta",
            pattern: structure.cta,
            position: "inline",
            style: "primary",
            text: ch.ch25_copy_engine?.cta ?? "Get Started",
        };
    }
    // ── Components ──────────────────────────────────────────────────────────
    buildComponents(genome, structure) {
        const components = [];
        // Add all section children as top-level components
        for (const section of structure.sections) {
            const children = this.generateSectionChildren(section, genome);
            components.push(...children);
        }
        return components;
    }
    // ── Library Selection ───────────────────────────────────────────────────
    async selectLibraries(genome) {
        const ch = genome.chromosomes;
        const complexity = calculateComplexity(genome);
        const hash = genome.dnaHash;
        const b = (index) => parseInt(hash.slice((index % 32) * 2, (index % 32) * 2 + 2), 16);
        // Animation library (from animation-catalog)
        const { selectAnimationLibrary } = await import("../animation-catalog.js");
        const animationLib = selectAnimationLibrary({
            physics: ch.ch8_motion?.physics ?? "none",
            sector: genome.sectorContext.primary,
            complexity,
            dnaHashByte: b(0),
        });
        // Icon library (from icon-catalog)
        const { selectIconLibrary } = await import("../icon-catalog.js");
        const iconLib = selectIconLibrary({
            edgeStyle: ch.ch7_edge?.style ?? "soft",
            typeCharge: ch.ch3_type_display?.charge ?? "geometric",
            sector: genome.sectorContext.primary,
            dnaHashByte: b(1),
        });
        // State library (from state-catalog)
        const { selectStateLibrary } = await import("../state-catalog.js");
        const stateResult = selectStateLibrary(ch.ch30_state_topology?.topology ?? "local", complexity, b(2));
        // Component library (from component-catalog)
        const componentLib = selectComponentLibrary({
            framework: ch.ch34_component_topology?.primaryFramework ?? "react",
            compositionStyle: ch.ch34_component_topology?.compositionStyle ?? "atomic",
            complexity,
            dnaHashByte: b(3),
        });
        // Styling library (from styling-catalog)
        const { selectStylingLibrary } = await import("../styling-catalog.js");
        const stylingResult = selectStylingLibrary(complexity > 0.75 ? "expressive" : complexity > 0.5 ? "bold" : "balanced", ch.ch7_edge?.style ?? "soft", complexity);
        // Font library (from font-catalog)
        const fontLib = {
            name: ch.ch3_type_display?.provider ?? "google_fonts",
            package: "@fontsource/variable",
        };
        return {
            animation: { name: animationLib.name, package: animationLib.package },
            icon: { name: iconLib.name, package: iconLib.package },
            state: { name: stateResult.primary.name, package: stateResult.primary.package },
            components: { name: componentLib.name, package: componentLib.package },
            styling: { name: stylingResult.primary.name, package: stylingResult.primary.package },
            font: fontLib,
        };
    }
    // ── CSS Variables ───────────────────────────────────────────────────────
    generateCSSVariables(genome) {
        const ch = genome.chromosomes;
        const vars = {};
        // Colors
        if (ch.ch5_color_primary?.hex) {
            vars["--color-primary"] = ch.ch5_color_primary.hex;
            vars["--color-primary-dark"] = ch.ch5_color_primary.darkModeHex ?? ch.ch5_color_primary.hex;
        }
        if (ch.ch26_color_system?.secondary?.hex) {
            vars["--color-secondary"] = ch.ch26_color_system.secondary.hex;
        }
        if (ch.ch26_color_system?.accent?.hex) {
            vars["--color-accent"] = ch.ch26_color_system.accent.hex;
        }
        // Typography
        if (ch.ch3_type_display?.family) {
            vars["--font-display"] = ch.ch3_type_display.family;
        }
        if (ch.ch4_type_body?.family) {
            vars["--font-body"] = ch.ch4_type_body.family;
        }
        // Spacing
        if (ch.ch2_rhythm?.baseSpacing) {
            vars["--spacing-base"] = `${ch.ch2_rhythm.baseSpacing}px`;
        }
        if (ch.ch2_rhythm?.sectionSpacing) {
            vars["--spacing-section"] = `${ch.ch2_rhythm.sectionSpacing}px`;
        }
        // Edge
        if (ch.ch7_edge?.radius !== undefined) {
            vars["--radius-container"] = `${ch.ch7_edge.radius}px`;
            vars["--radius-component"] = `${Math.max(2, ch.ch7_edge.radius - 2)}px`;
        }
        // Grid
        if (ch.ch9_grid?.gap) {
            vars["--grid-gap"] = `${ch.ch9_grid.gap}px`;
        }
        return vars;
    }
    // ── Animation Config ────────────────────────────────────────────────────
    buildAnimationConfig(genome) {
        const ch = genome.chromosomes;
        const motion = ch.ch8_motion;
        const choreography = ch.ch27_motion_choreography;
        return {
            physics: motion?.physics ?? "none",
            durationScale: motion?.durationScale ?? 1,
            entrySequence: choreography?.entrySequence ?? "cascade_down",
            staggerInterval: choreography?.staggerInterval ?? 80,
            scrollTrigger: {
                triggerPoint: choreography?.scrollTrigger?.triggerPoint ?? 0.2,
                scrubIntensity: choreography?.scrollTrigger?.scrubIntensity ?? 0.5,
            },
            hoverMicrointeraction: {
                type: choreography?.hoverMicrointeraction?.type ?? "lift",
                intensity: choreography?.hoverMicrointeraction?.intensity ?? 0.5,
                duration: choreography?.hoverMicrointeraction?.duration ?? 200,
            },
        };
    }
}
/**
 * Convenience function: compose a page from genome + intent
 */
export async function composePage(genome, intent) {
    const composer = new ContextComposer();
    return composer.compose(genome, intent);
}
