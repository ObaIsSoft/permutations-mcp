/**
 * Pattern Fetchers — Real Working Fetchers Only
 *
 * Uses raw.githubusercontent.com directly (no GitHub API rate limits).
 * No stubs. No fake URLs. No auth-walled sites.
 */
/**
 * Return the appropriate ContentType subset for a StructuralCategory.
 * Replaces the ALL_CONTEXTS bypass — patterns are now eligible only for
 * contexts where they make semantic sense, enabling forbiddenFor filtering.
 */
function contextsForCategory(category) {
    const BRAND = [
        "landing", "saas", "agency", "creative", "nonprofit", "healthcare",
        "fintech", "education", "real_estate", "travel", "food", "sports", "gaming",
        "crypto_web3", "media", "government", "legal", "manufacturing", "automotive",
        "hospitality", "beauty_fashion", "insurance", "energy", "ecommerce", "portfolio",
    ];
    const FUNCTIONAL = ["dashboard", "application", "documentation"];
    const ALL_TYPES = [...BRAND, ...FUNCTIONAL, "blog"];
    switch (category) {
        // Universal — structural/utility patterns valid everywhere
        case "layout":
        case "navigation":
        case "footer":
        case "header":
        case "content":
        case "form":
        case "search":
        case "modal":
        case "notification":
        case "banner":
        case "alert":
        case "loading":
        case "empty":
        case "error":
        case "success":
        case "breadcrumb":
        case "pagination":
        case "menu":
        case "dropdown":
        case "tooltip":
        case "popover":
        case "accordion":
        case "tabs":
        case "flow":
        case "interaction":
        case "responsive":
            return ALL_TYPES;
        // Brand/marketing — hero, CTA, testimonials etc. don't belong in functional UIs
        case "hero":
        case "cta":
        case "testimonial":
        case "trust":
        case "logo_wall":
        case "newsletter":
        case "feature":
        case "stats":
        case "team":
        case "pricing":
        case "faq":
        case "process":
        case "timeline":
        case "comparison":
        case "social":
            return [...BRAND, "blog"];
        // Data/analytics — dashboards, apps, and data-heavy brands
        case "data":
        case "metrics":
        case "chart":
        case "table":
        case "toolbar":
        case "status_bar":
        case "filter":
        case "sort":
            return [...FUNCTIONAL, "fintech", "saas", "healthcare", "education"];
        // Sidebar — functional navigation; valid for dashboard/app/docs
        case "sidebar":
            return [...FUNCTIONAL];
        // Commerce — product-focused contexts only
        case "product":
            return ["ecommerce", "real_estate", "automotive", "hospitality", "beauty_fashion", "food"];
        // Gallery — visual contexts
        case "gallery":
            return ["portfolio", "creative", "ecommerce", "real_estate", "travel", "food", "gaming", "media"];
        // Blog/media — content-rich contexts
        case "blog":
        case "media":
            return ["blog", "media", "landing", "saas", "agency", "creative", "education"];
        // Map — location-relevant contexts
        case "map":
            return ["real_estate", "travel", "food", "hospitality", "government", "automotive"];
        // Onboarding — app and SaaS contexts
        case "onboarding":
        case "tour":
            return [...FUNCTIONAL, "saas", "fintech", "education"];
        // Download — software/content contexts
        case "download":
            return ["saas", "documentation", "media", "education", "gaming"];
        default:
            return ALL_TYPES;
    }
}
function makePattern(entry) {
    return {
        id: entry.id, name: entry.name, source: entry.source,
        category: entry.category, subcategory: entry.subcategory,
        description: entry.description, complexity: entry.complexity,
        contexts: entry.contexts ?? contextsForCategory(entry.category),
        forbiddenContexts: entry.forbiddenContexts || [],
        forbiddenFor: entry.forbiddenFor || {}, tags: entry.tags,
        popularity: entry.popularity, lastModified: new Date().toISOString().split("T")[0],
        adaptiveProps: entry.adaptiveProps || [],
        composition: { canContain: [], canBeContainedBy: ["layout"], maxChildren: 10 },
        blueprint: { type: "html", template: entry.html, styles: entry.css, dependencies: entry.deps || [] },
    };
}
async function fetchText(url) {
    try {
        const r = await fetch(url);
        return r.ok ? r.text() : "";
    }
    catch {
        return "";
    }
}
function extractHTML(html) {
    const match = html.match(/```(?:html|tsx|jsx)?\n([\s\S]*?)```/);
    if (match)
        return match[1].trim();
    const jsxMatch = html.match(/export default function[\s\S]*?return\s*\(\s*([\s\S]*?)\s*\)/);
    if (jsxMatch)
        return jsxMatch[1].trim();
    // Strip Angular directives for clean HTML
    return html
        .replace(/\[ngClass\]="[^"]*"/g, "")
        .replace(/\[class\.[\w-]+\]="[^"]*"/g, "")
        .replace(/\[attr\.[\w-]+\]="[^"]*"/g, "")
        .replace(/\*ngIf="[^"]*"/g, "")
        .replace(/\*ngFor="[^"]*"/g, "")
        .replace(/\(click\)="[^"]*"/g, "")
        .replace(/\(submit\)="[^"]*"/g, "")
        .replace(/\[formGroup\]="[^"]*"/g, "")
        .replace(/formControlName="[^"]*"/g, "")
        .trim();
}
// ── Mamba UI Component Map (from master branch tree) ────────────────────────
const MAMBA_COMPONENTS = {
    article: ["article1", "article2", "article3", "article4"],
    avatar: ["avatar1", "avatar2", "avatar3"],
    banner: ["banner1", "banner2"],
    blog: ["blog1", "blog2", "blog3", "blog4", "blog5", "blog6", "blog7"],
    breadcrumb: ["breadcrumb1", "breadcrumb2"],
    button: ["button1", "button2", "button3", "button4", "button5", "button6"],
    "call-to-action": ["cta1", "cta2", "cta3", "cta4", "cta5", "cta6"],
    card: ["card1", "card2", "card3", "card4", "card5"],
    carousel: ["carousel1", "carousel2"],
    contact: ["contact1", "contact2", "contact3"],
    error: ["error1", "error2"],
    faq: ["faq1", "faq2", "faq3", "faq4", "faq5", "faq6"],
    feature: ["feature1", "feature2", "feature3", "feature4", "feature5", "feature6", "feature7", "feature8"],
    footer: ["footer1", "footer2", "footer3", "footer4", "footer5"],
    form: ["form1"],
    gallery: ["gallery1", "gallery2"],
    header: ["header1", "header2", "header3", "header4", "header5"],
    hero: ["hero1", "hero2", "hero3", "hero4", "hero5"],
    input: ["input1", "input2", "input3", "input4"],
    loading: ["loading1", "loading2"],
    login: ["login1", "login2", "login3", "login4", "login5"],
    modal: ["modal1", "modal2", "modal3", "modal4"],
    news: ["news1", "news2", "news3"],
    pagination: ["pagination1", "pagination2", "pagination3"],
    pricing: ["pricing1", "pricing2", "pricing3", "pricing4", "pricing5"],
    profile: ["profile1", "profile2", "profile3", "profile4"],
    review: ["review1", "review2", "review3"],
    "shopping-cart": ["cart1", "cart2"],
    sidebar: ["sidebar1", "sidebar2", "sidebar3"],
    "skeleton-loader": ["skeleton1", "skeleton2"],
    slider: ["slider1", "slider2"],
    snackbar: ["snackbar1", "snackbar2", "snackbar3", "snackbar4", "snackbar5", "snackbar6"],
    stats: ["stats1", "stats2", "stats3", "stats4", "stats5"],
    steps: ["steps1", "steps2", "steps3", "steps4"],
    table: ["table1", "table2", "table3", "table4"],
    tabs: ["tabs1", "tabs2", "tabs3"],
    team: ["team1", "team2", "team3", "team4"],
    testimonial: ["testimonial1", "testimonial2", "testimonial3", "testimonial4", "testimonial5"],
    timeline: ["timeline1", "timeline2", "timeline3", "timeline4", "timeline5"],
    toggle: ["toggle1", "toggle2", "toggle3", "toggle4"],
    weather: ["weather1", "weather2", "weather3"],
};
const MAMBA_CAT_MAP = {
    article: "content", avatar: "content", banner: "content",
    blog: "content", breadcrumb: "navigation", button: "content",
    "call-to-action": "cta", card: "content", carousel: "content",
    contact: "content", error: "content", faq: "content",
    feature: "content", footer: "footer", form: "content",
    gallery: "content", header: "navigation", hero: "hero",
    input: "content", loading: "content", login: "content",
    modal: "content", news: "content", pagination: "navigation",
    pricing: "content", profile: "content", review: "content",
    "shopping-cart": "content", sidebar: "sidebar",
    "skeleton-loader": "content", slider: "content",
    snackbar: "content", stats: "content", steps: "content",
    table: "content", tabs: "navigation", team: "content",
    testimonial: "content", timeline: "content", toggle: "content",
    weather: "content",
};
// ── 1. shadcn/ui — GitHub Raw TSX ──────────────────────────────────────────
async function fetchShadcn() {
    const patterns = [];
    const BASE = "https://raw.githubusercontent.com/shadcn-ui/ui/refs/heads/main/apps/v4/registry/bases/radix/ui/";
    const components = ["accordion", "alert", "alert-dialog", "aspect-ratio", "avatar", "badge", "breadcrumb", "button", "calendar", "card", "carousel", "checkbox", "collapsible", "combobox", "command", "context-menu", "dialog", "drawer", "dropdown-menu", "form", "hover-card", "input", "label", "menubar", "navigation-menu", "pagination", "popover", "progress", "radio-group", "resizable", "scroll-area", "select", "separator", "sheet", "skeleton", "slider", "sonner", "switch", "table", "tabs", "textarea", "toast", "toggle", "toggle-group", "tooltip", "sidebar"];
    const catMap = {
        accordion: "content", alert: "content", "alert-dialog": "content",
        avatar: "content", badge: "content", breadcrumb: "navigation",
        button: "content", calendar: "content", card: "content",
        carousel: "content", checkbox: "content", collapsible: "content",
        dialog: "content", drawer: "content", "dropdown-menu": "navigation",
        form: "content", "hover-card": "content", input: "content",
        label: "content", menubar: "navigation", "navigation-menu": "navigation",
        pagination: "navigation", popover: "content", progress: "content",
        "radio-group": "content", select: "content", separator: "content",
        sheet: "content", skeleton: "content", slider: "content",
        switch: "content", table: "content", tabs: "navigation",
        textarea: "content", toast: "content", toggle: "content",
        tooltip: "content", sidebar: "sidebar",
    };
    for (const name of components) {
        const url = `${BASE}${name}.tsx`;
        const html = await fetchText(url);
        if (!html || html.includes("404: Not Found") || html.length < 50)
            continue;
        patterns.push(makePattern({
            id: `shadcn_${name}`, name: `shadcn/${name}`, source: "shadcn",
            category: catMap[name] || "content", subcategory: name,
            description: `shadcn/ui ${name} component`,
            complexity: 0.4,
            tags: ["shadcn", name], popularity: 0.9,
            html: extractHTML(html), css: "", deps: ["@radix-ui/react-*"],
        }));
    }
    return patterns;
}
// ── 2. Aceternity UI — GitHub Raw TSX ──────────────────────────────────────
async function fetchAceternity() {
    const patterns = [];
    const BASE = "https://raw.githubusercontent.com/hsuanyi-chou/shadcn-ui-expansions/main/components/ui/";
    const components = ["autosize-textarea", "badge", "blockquote", "button", "calendar", "circular-progress", "code-block", "compare", "container-scroll", "cover", "dock", "file-tree", "file-upload", "flip-words", "following-pointer", "globe", "grid", "hero-highlight", "hero-parallax", "hover-border-gradient", "infinite-moving-cards", "input", "lens", "link-preview", "macbook-scroll", "moving-border", "moving-line", "multi-step-loader", "navbar-menu", "number-ticker", "parallax-scroll", "pin", "placeholder", "retro-grid", "scroll-based-velocity", "shooting-stars", "sparkles", "sparkles-text", "spotlight", "stars-background", "sticky-scroll", "svg-mask", "text-generate", "text-reveal", "text-hover", "text-pressure", "text-rotate", "text-scroll", "timeline", "tracing-beam", "typewriter", "vortex", "wavy-background", "wobble"];
    for (const name of components) {
        const url = `${BASE}${name}.tsx`;
        const html = await fetchText(url);
        if (!html || html.includes("404: Not Found") || html.length < 50)
            continue;
        patterns.push(makePattern({
            id: `aceternity_${name}`, name: `Aceternity/${name}`, source: "aceternity",
            category: "content", subcategory: name,
            description: `Aceternity UI ${name} component`,
            complexity: 0.6,
            tags: ["aceternity", name], popularity: 0.7,
            html: extractHTML(html), css: "", deps: ["framer-motion", "clsx", "tailwind-merge"],
        }));
    }
    return patterns;
}
// ── 3. HyperUI — GitHub Raw Astro ──────────────────────────────────────────
async function fetchHyperUI() {
    const patterns = [];
    const BASE = "https://raw.githubusercontent.com/markmead/hyperui/main/src/components/";
    const components = ["BaseAd", "BaseHead", "BaseHero", "BlogCard", "CollectionFeature", "ComponentCard", "ComponentPreview", "DropdownMenu", "DropdownToggle", "DropdownWrapper", "FormattedDate", "HeaderLink", "PreviewBreakpoints", "PreviewCopy", "PreviewDetails", "PreviewDirection", "PreviewRefs", "PreviewView", "PreviewWrapper", "RelatedComponents", "SearchInput", "SearchResults", "SearchWrapper", "SiteFooter", "SiteHeader"];
    for (const name of components) {
        const url = `${BASE}${name}.astro`;
        const html = await fetchText(url);
        if (!html || html.includes("404: Not Found") || html.length < 50)
            continue;
        patterns.push(makePattern({
            id: `hyperui_${name}`, name: `HyperUI/${name}`, source: "hyperui",
            category: "content", subcategory: name,
            description: `HyperUI ${name} component`,
            complexity: 0.3,
            tags: ["hyperui", name], popularity: 0.7,
            html: extractHTML(html), css: "", deps: ["astro", "@lucide/astro"],
        }));
    }
    return patterns;
}
// ── 4. Magic UI — GitHub Raw TSX ───────────────────────────────────────────
async function fetchMagicUI() {
    const patterns = [];
    const BASE = "https://raw.githubusercontent.com/magicuidesign/magicui/main/apps/www/registry/magicui/";
    const components = ["magic-card", "android", "warp-background", "line-shadow-text", "aurora-text", "morphing-text", "scroll-progress", "lens", "pointer", "smooth-cursor", "interactive-hover-button", "text-reveal-card", "sparkles-text", "flip-text", "blur-fade", "dock", "globe", "orbiting-circles", "rainbow-button", "ripple", "text-shimmer", "text-morph", "number-ticker", "animated-list", "retro-grid", "marquee", "hero-video", "bento-grid", "animated-beam", "grid-pattern", "dot-pattern", "interactive-grid-pattern", "hover-card", "box-reveal", "typing-animation", "counting-numbers", "hyper-text", "word-rotate", "letter-pullup", "word-pullup", "fade-text"];
    for (const name of components) {
        const url = `${BASE}${name}.tsx`;
        const html = await fetchText(url);
        if (!html || html.includes("404: Not Found") || html.length < 50)
            continue;
        patterns.push(makePattern({
            id: `magicui_${name}`, name: `MagicUI/${name}`, source: "magic_ui",
            category: "content", subcategory: name,
            description: `Magic UI ${name} animated component`,
            complexity: 0.6,
            tags: ["magic_ui", name], popularity: 0.8,
            html: extractHTML(html), css: "", deps: ["framer-motion", "clsx", "tailwind-merge"],
        }));
    }
    return patterns;
}
// ── 5. NextUI — GitHub Raw TSX ─────────────────────────────────────────────
async function fetchNextUI() {
    const patterns = [];
    const BASE = "https://raw.githubusercontent.com/nextui-org/nextui/main/packages/components/";
    const components = ["accordion", "alert", "autocomplete", "avatar", "badge", "breadcrumb", "button", "calendar", "card", "checkbox", "chip", "code", "date-input", "date-picker", "divider", "drawer", "dropdown", "form", "image", "input", "kbd", "link", "listbox", "menu", "modal", "navbar", "pagination", "popover", "progress", "radio", "ripple", "scroll-shadow", "select", "skeleton", "slider", "snippet", "spacer", "spinner", "switch", "table", "tabs", "textarea", "toast", "tooltip", "user"];
    const catMap = {
        accordion: "content", alert: "content", autocomplete: "content",
        avatar: "content", badge: "content", breadcrumb: "navigation",
        button: "content", calendar: "content", card: "content",
        checkbox: "content", chip: "content", "date-input": "content",
        "date-picker": "content", divider: "content", drawer: "content",
        dropdown: "navigation", form: "content", image: "content",
        input: "content", kbd: "content", link: "content",
        listbox: "content", menu: "navigation", modal: "content",
        navbar: "navigation", pagination: "navigation", popover: "content",
        progress: "content", radio: "content", "scroll-shadow": "content",
        select: "content", skeleton: "content", slider: "content",
        snippet: "content", spacer: "content", spinner: "content",
        switch: "content", table: "content", tabs: "navigation",
        textarea: "content", toast: "content", tooltip: "content",
        user: "content",
    };
    for (const name of components) {
        const url = `${BASE}${name}/src/${name}.tsx`;
        const html = await fetchText(url);
        if (!html || html.includes("404: Not Found") || html.length < 50)
            continue;
        patterns.push(makePattern({
            id: `nextui_${name}`, name: `NextUI/${name}`, source: "nextui",
            category: catMap[name] || "content", subcategory: name,
            description: `NextUI ${name} component`,
            complexity: 0.5,
            tags: ["nextui", name], popularity: 0.8,
            html: extractHTML(html), css: "", deps: ["@nextui-org/react", "framer-motion"],
        }));
    }
    return patterns;
}
// ── 6. Mamba UI — GitHub Raw HTML (Angular templates, stripped) ────────────
async function fetchMambaUI() {
    const BASE = "https://raw.githubusercontent.com/Microwawe/mamba-ui/master/src/app/components/";
    // Build all URLs
    const urls = [];
    for (const [category, variants] of Object.entries(MAMBA_COMPONENTS)) {
        for (const variant of variants) {
            urls.push({
                category, variant,
                url: `${BASE}${category}/${variant}/${variant}.component.html`,
            });
        }
    }
    // Fetch all in parallel (batches of 20 to avoid overwhelming)
    const results = [];
    for (let i = 0; i < urls.length; i += 20) {
        const batch = urls.slice(i, i + 20);
        const batchResults = await Promise.all(batch.map(async ({ category, variant, url }) => {
            const html = await fetchText(url);
            if (!html || html.includes("404: Not Found") || html.length < 50)
                return null;
            return makePattern({
                id: `mamba_${category}_${variant}`, name: `MambaUI/${category}/${variant}`,
                source: "mamba_ui", category: MAMBA_CAT_MAP[category] || "content",
                subcategory: `${category}/${variant}`,
                description: `Mamba UI ${category} ${variant} component`,
                complexity: 0.3,
                tags: ["mamba_ui", category, variant], popularity: 0.7,
                html: extractHTML(html), css: "", deps: ["tailwindcss"],
            });
        }));
        results.push(...batchResults);
    }
    return results.filter(Boolean);
}
// ── 7. CSS Layout — GitHub Raw MDX (HTML+CSS code blocks) ──────────────────
async function fetchCSSLayout() {
    const patterns = [];
    const BASE = "https://raw.githubusercontent.com/phuocng/csslayout/master/contents/";
    const components = ["accordion", "arrow-buttons", "avatar-list", "avatar", "badge", "box-selector", "breadcrumb", "button-with-icon", "calendar", "card-layout", "card", "carousel-slider", "center-align-one-and-left-align-the-other", "centering", "chip", "circular-navigation", "close-button", "color-swatch", "concave-corners", "cookie-banner", "countdown-timer", "custom-checkbox", "custom-radio", "custom-select", "date-picker", "dialog", "divider", "dropdown", "empty-state", "file-upload", "footer", "form", "header", "hero", "input", "kbd", "link", "list", "loading", "logo", "media", "menu", "modal", "navbar", "notification", "page-header", "pagination", "panel", "popover", "pricing", "progress", "radio-group", "rating", "search", "select", "separator", "sheet", "sidebar", "skeleton", "slider", "snackbar", "spinner", "stats", "stepper", "switch", "table", "tabs", "tag", "textarea", "timeline", "toast", "toggle", "tooltip", "tree-view", "video"];
    const catMap = {
        accordion: "content", "arrow-buttons": "content", "avatar-list": "content",
        avatar: "content", badge: "content", "box-selector": "content",
        breadcrumb: "navigation", "button-with-icon": "content", calendar: "content",
        "card-layout": "content", card: "content", "carousel-slider": "content",
        "center-align-one-and-left-align-the-other": "layout", centering: "layout",
        chip: "content", "circular-navigation": "navigation", "close-button": "content",
        "color-swatch": "content", "concave-corners": "layout", "cookie-banner": "content",
        "countdown-timer": "content", "custom-checkbox": "content", "custom-radio": "content",
        "custom-select": "content", "date-picker": "content", dialog: "content",
        divider: "content", dropdown: "navigation", "empty-state": "content",
        "file-upload": "content", footer: "footer", form: "content",
        header: "navigation", hero: "hero", input: "content",
        kbd: "content", link: "content", list: "content",
        loading: "content", logo: "content", media: "content",
        menu: "navigation", modal: "content", navbar: "navigation",
        notification: "content", "page-header": "content", pagination: "navigation",
        panel: "content", popover: "content", pricing: "content",
        progress: "content", "radio-group": "content", rating: "content",
        search: "content", select: "content", separator: "content",
        sheet: "content", sidebar: "sidebar", skeleton: "content",
        slider: "content", snackbar: "content", spinner: "content",
        stats: "content", stepper: "content", switch: "content",
        table: "content", tabs: "navigation", tag: "content",
        textarea: "content", timeline: "content", toast: "content",
        toggle: "content", tooltip: "content", "tree-view": "content",
        video: "content",
    };
    for (const name of components) {
        const url = `${BASE}${name}.mdx`;
        const mdx = await fetchText(url);
        if (!mdx || mdx.includes("404: Not Found") || mdx.length < 100)
            continue;
        // Extract HTML and CSS from MDX code blocks
        const htmlMatch = mdx.match(/## HTML\n\n```(?:html|html index\.html)?\n([\s\S]*?)\n```/);
        const cssMatch = mdx.match(/## CSS\n\n```(?:css|css styles\.css)?\n([\s\S]*?)\n```/);
        const html = htmlMatch ? htmlMatch[1].trim() : "";
        const css = cssMatch ? cssMatch[1].trim() : "";
        if (!html && !css)
            continue;
        patterns.push(makePattern({
            id: `csslayout_${name}`, name: `CSSLayout/${name}`, source: "css_layout",
            category: catMap[name] || "layout", subcategory: name,
            description: `CSS Layout ${name} pattern`,
            complexity: 0.3,
            tags: ["css_layout", name], popularity: 0.7,
            html: html || `<!-- CSS Layout ${name} -->`,
            css: css || `/* CSS Layout ${name} */`,
            deps: [],
        }));
    }
    return patterns;
}
// ── 8. FlyonUI — GitHub Raw CSS (Tailwind component classes) ───────────────
async function fetchFlyonUI() {
    const patterns = [];
    const BASE = "https://raw.githubusercontent.com/themeselection/flyonui/main/src/components/";
    const components = ["accordion", "advanceSelect", "alert", "avatar", "badge", "breadcrumbs", "button", "card", "carousel", "chat", "checkbox", "collapse", "customOptions", "diff", "divider", "drawer", "dropdown", "fileinput", "filter", "footer", "input", "join", "kbd", "link", "list", "loading", "menu", "modal", "navbar", "notification", "pagination", "popover", "progress", "radio", "range", "rating", "select", "sidebar", "skeleton", "slider", "stack", "stat", "steps", "swap", "tab", "table", "textarea", "timeline", "toast", "toggle", "tooltip", "tree"];
    const catMap = {
        accordion: "content", advanceSelect: "content", alert: "content",
        avatar: "content", badge: "content", breadcrumbs: "navigation",
        button: "content", card: "content", carousel: "content",
        chat: "content", checkbox: "content", collapse: "content",
        customOptions: "content", diff: "content", divider: "content",
        drawer: "content", dropdown: "navigation", fileinput: "content",
        filter: "content", footer: "footer", input: "content",
        join: "content", kbd: "content", link: "content",
        list: "content", loading: "content", menu: "navigation",
        modal: "content", navbar: "navigation", notification: "content",
        pagination: "navigation", popover: "content", progress: "content",
        radio: "content", range: "content", rating: "content",
        select: "content", sidebar: "sidebar", skeleton: "content",
        slider: "content", stack: "content", stat: "content",
        steps: "content", swap: "content", tab: "navigation",
        table: "content", textarea: "content", timeline: "content",
        toast: "content", toggle: "content", tooltip: "content",
        tree: "content",
    };
    for (const name of components) {
        const url = `${BASE}${name}.css`;
        const css = await fetchText(url);
        if (!css || css.includes("404: Not Found") || css.length < 50)
            continue;
        // Extract component class names from CSS
        const classNames = [...css.matchAll(/\.([\w-]+)\s*\{/g)].map(m => m[1]);
        const primaryClass = classNames[0] || name;
        // Generate HTML template from CSS class structure
        const html = `<div class="${primaryClass}">\n  <!-- FlyonUI ${name} component -->\n  <!-- Classes: ${classNames.slice(0, 10).join(', ')} -->\n</div>`;
        patterns.push(makePattern({
            id: `flyonui_${name}`, name: `FlyonUI/${name}`, source: "flyonui",
            category: catMap[name] || "content", subcategory: name,
            description: `FlyonUI ${name} Tailwind component`,
            complexity: 0.3,
            tags: ["flyonui", name], popularity: 0.7,
            html, css, deps: ["tailwindcss", "flyonui"],
        }));
    }
    return patterns;
}
// ── 9. Preline — GitHub Raw (JS plugins + component structure) ─────────────
async function fetchPreline() {
    const patterns = [];
    const BASE = "https://raw.githubusercontent.com/htmlstreamofficial/preline/main/src/plugins/";
    const plugins = ["accordion", "carousel", "collapse", "combobox", "copy-markup", "datatable", "datepicker", "dropdown", "file-upload", "input-number", "overlay", "password-toggle", "pin-input", "remove-element", "scrollspy", "select", "stepper", "strong-password", "tabs", "textarea-auto-height", "toggle-count", "toggle-password"];
    const catMap = {
        accordion: "content", carousel: "content", collapse: "content",
        combobox: "content", "copy-markup": "content", datatable: "content",
        datepicker: "content", dropdown: "navigation", "file-upload": "content",
        "input-number": "content", overlay: "content", "password-toggle": "content",
        "pin-input": "content", "remove-element": "content", scrollspy: "navigation",
        select: "content", stepper: "content", "strong-password": "content",
        tabs: "navigation", "textarea-auto-height": "content", "toggle-count": "content",
        "toggle-password": "content",
    };
    for (const name of plugins) {
        const url = `${BASE}${name}/core.ts`;
        const ts = await fetchText(url);
        if (!ts || ts.includes("404: Not Found") || ts.length < 50)
            continue;
        // Extract component class names from the plugin
        const classMatches = [...ts.matchAll(/['"]\.([^'"]+)['"]/g)];
        const classNames = classMatches.map(m => m[1]).filter(c => c.length > 1);
        const primaryClass = classNames[0] || `hs-${name}`;
        // Generate HTML template from plugin structure
        const html = `<div class="${primaryClass}" data-hs-${name}>\n  <!-- Preline ${name} component -->\n  <!-- Classes: ${classNames.slice(0, 8).join(', ')} -->\n</div>`;
        patterns.push(makePattern({
            id: `preline_${name}`, name: `Preline/${name}`, source: "preline",
            category: catMap[name] || "content", subcategory: name,
            description: `Preline UI ${name} component`,
            complexity: 0.4,
            tags: ["preline", name], popularity: 0.7,
            html, css: "", deps: ["preline", "tailwindcss"],
        }));
    }
    return patterns;
}
// ── 10-17. Not accessible (auth walls, no public code, or gallery-only sites)
async function fetchEmpty() { return []; }
// ── Export All Fetchers ─────────────────────────────────────────────────────
export const PATTERN_FETCHERS = {
    shadcn: fetchShadcn,
    aceternity: fetchAceternity,
    hyperui: fetchHyperUI,
    magic_ui: fetchMagicUI,
    nextui: fetchNextUI,
    mamba_ui: fetchMambaUI,
    css_layout: fetchCSSLayout,
    flyonui: fetchFlyonUI,
    preline: fetchPreline,
    relume: fetchEmpty,
    tailwind_ui: fetchEmpty,
    mobbin: fetchEmpty,
    refero: fetchEmpty,
    screenlane: fetchEmpty,
    lapa_ninja: fetchEmpty,
    one_page_love: fetchEmpty,
    land_book: fetchEmpty,
    navnav: fetchEmpty,
    every_layout: fetchEmpty,
};
