import Groq from "groq-sdk";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as crypto from "crypto";
const LLM_TIMEOUT_MS = 30_000; // 30s timeout per attempt (increased for cold starts)
const LLM_MAX_RETRIES = 3; // Retry up to 3 times with exponential backoff + jitter
export class SemanticTraitExtractor {
    apiKeyMissing = false;
    groq;
    openai;
    anthropic;
    gemini;
    openrouter; // OpenRouter uses OpenAI-compatible API
    huggingface;
    provider;
    constructor(apiKey, provider) {
        const groqKey = process.env.GROQ_API_KEY;
        const openaiKey = process.env.OPENAI_API_KEY;
        const anthropicKey = process.env.ANTHROPIC_API_KEY;
        const geminiKey = process.env.GEMINI_API_KEY;
        const openrouterKey = process.env.OPENROUTER_API_KEY;
        const huggingfaceKey = process.env.HUGGINGFACE_API_KEY;
        if (provider) {
            this.provider = provider;
        }
        else if (groqKey) {
            this.provider = "groq";
        }
        else if (openaiKey) {
            this.provider = "openai";
        }
        else if (anthropicKey) {
            this.provider = "anthropic";
        }
        else if (geminiKey) {
            this.provider = "gemini";
        }
        else if (openrouterKey) {
            this.provider = "openrouter";
        }
        else if (huggingfaceKey) {
            this.provider = "huggingface";
        }
        else {
            this.provider = "groq";
        }
        const key = apiKey || groqKey || openaiKey || anthropicKey || geminiKey || openrouterKey || huggingfaceKey;
        if (!key) {
            // M-16: Don't crash at boot. Set a flag so analyze() throws gracefully at call time.
            // This allows offline tools (generate_from_archetype, etc.) to work without an LLM key.
            this.apiKeyMissing = true;
            return;
        }
        switch (this.provider) {
            case "groq":
                this.groq = new Groq({ apiKey: key });
                break;
            case "openai":
                this.openai = new OpenAI({ apiKey: key });
                break;
            case "anthropic":
                this.anthropic = new Anthropic({ apiKey: key });
                break;
            case "gemini":
                const genAI = new GoogleGenerativeAI(key);
                this.gemini = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
                break;
            case "openrouter":
                // OpenRouter uses OpenAI-compatible API
                this.openrouter = new OpenAI({
                    apiKey: key,
                    baseURL: "https://openrouter.ai/api/v1",
                });
                break;
            case "huggingface":
                this.huggingface = key; // Just store the key, we'll use fetch
                break;
        }
    }
    /**
     * Static startup check — call this at server boot to fail fast if no LLM key exists.
     */
    static isAvailable() {
        return !!(process.env.GROQ_API_KEY ||
            process.env.OPENAI_API_KEY ||
            process.env.ANTHROPIC_API_KEY ||
            process.env.GEMINI_API_KEY ||
            process.env.OPENROUTER_API_KEY ||
            process.env.HUGGINGFACE_API_KEY);
    }
    /**
     * Single-call extraction: traits + sector + subSector + archetype
     */
    async analyze(intent, projectContext) {
        // M-16: Graceful error if no API key — deferred from constructor so offline tools still work
        if (this.apiKeyMissing) {
            throw new Error("No LLM API key configured. Set one of: GROQ_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY, OPENROUTER_API_KEY, or HUGGINGFACE_API_KEY. Offline tools (generate_from_archetype, mutate_genome, etc.) work without a key.");
        }
        const prompt = this.buildPrompt(intent, projectContext);
        let lastError = null;
        for (let attempt = 1; attempt <= LLM_MAX_RETRIES; attempt++) {
            try {
                const result = await this.withTimeout(this.callProvider(prompt), LLM_TIMEOUT_MS);
                return {
                    traits: {
                        informationDensity: this.clamp(result.traits?.informationDensity ?? 0.5),
                        temporalUrgency: this.clamp(result.traits?.temporalUrgency ?? 0.5),
                        emotionalTemperature: this.clamp(result.traits?.emotionalTemperature ?? 0.5),
                        playfulness: this.clamp(result.traits?.playfulness ?? 0.5),
                        spatialDependency: this.clamp(result.traits?.spatialDependency ?? 0.5),
                        trustRequirement: this.clamp(result.traits?.trustRequirement ?? 0.5),
                        visualEmphasis: this.clamp(result.traits?.visualEmphasis ?? 0.5),
                        conversionFocus: this.clamp(result.traits?.conversionFocus ?? 0.5),
                    },
                    sector: {
                        primary: result.sector?.primary || "technology",
                        subSector: result.sector?.subSector || "technology_general",
                        confidence: this.clamp(result.sector?.confidence ?? 0.5),
                    },
                    archetype: {
                        type: result.archetype?.type || "landing",
                        confidence: this.clamp(result.archetype?.confidence ?? 0.5),
                    },
                    copyIntelligence: {
                        industryTerminology: result.copyIntelligence?.industryTerminology || [],
                        emotionalRegister: result.copyIntelligence?.emotionalRegister || "professional",
                        formalityLevel: this.clamp(result.copyIntelligence?.formalityLevel ?? 0.5),
                        ctaAggression: this.clamp(result.copyIntelligence?.ctaAggression ?? 0.5),
                        headlineStyle: result.copyIntelligence?.headlineStyle || "benefit_forward",
                        vocabularyComplexity: result.copyIntelligence?.vocabularyComplexity || "moderate",
                        sentenceStructure: result.copyIntelligence?.sentenceStructure || "balanced",
                        emojiUsage: result.copyIntelligence?.emojiUsage ?? false,
                        contractionUsage: result.copyIntelligence?.contractionUsage ?? true,
                    },
                    // Copy content generated from intent
                    copy: {
                        headline: result.copy?.headline || "Headline Placeholder",
                        subheadline: result.copy?.subheadline || "Subheadline placeholder",
                        cta: result.copy?.cta || "Get Started",
                        tagline: result.copy?.tagline || "Tagline placeholder",
                        companyName: result.copy?.companyName || "Your Product",
                        features: result.copy?.features || [
                            { title: "Feature 1", description: "Feature description placeholder" },
                            { title: "Feature 2", description: "Feature description placeholder" },
                            { title: "Feature 3", description: "Feature description placeholder" }
                        ],
                        stats: result.copy?.stats || [
                            { label: "Stat 1", value: "{{VALUE_1}}" },
                            { label: "Stat 2", value: "{{VALUE_2}}" },
                            { label: "Stat 3", value: "{{VALUE_3}}" }
                        ],
                        testimonial: result.copy?.testimonial || "Testimonial placeholder - replace with actual customer quote",
                        faq: result.copy?.faq || [
                            { question: "FAQ Question 1?", answer: "FAQ answer placeholder" },
                            { question: "FAQ Question 2?", answer: "FAQ answer placeholder" }
                        ]
                    },
                };
            }
            catch (e) {
                lastError = e;
                if (attempt < LLM_MAX_RETRIES) {
                    // Deterministic backoff using hash of attempt number
                    const hash = crypto.createHash("sha256").update(`retry_${attempt}_${Date.now()}`).digest("hex");
                    const jitter = (parseInt(hash.slice(0, 2), 16) / 255) * 500; // 0-500ms
                    const baseDelay = 500 * Math.pow(2, attempt - 1);
                    const delay = baseDelay + jitter;
                    await new Promise(r => setTimeout(r, delay));
                }
            }
        }
        throw new Error(`LLM extraction failed after ${LLM_MAX_RETRIES} attempts. ` +
            `Provider: ${this.provider}. ` +
            `Last error: ${lastError?.message || "Unknown error"}. ` +
            `Set a valid API key (GROQ_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY, OPENROUTER_API_KEY, or HUGGINGFACE_API_KEY).`);
    }
    /**
     * Backward compatibility: extract traits only
     */
    async extractTraits(intent, projectContext) {
        const analysis = await this.analyze(intent, projectContext);
        return analysis.traits;
    }
    /**
     * Backward compatibility: classify sector
     */
    async classifySector(content) {
        const analysis = await this.analyze(content);
        return { primary: analysis.sector.primary, confidence: analysis.sector.confidence };
    }
    /** Race a promise against a timeout */
    withTimeout(promise, ms) {
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error(`LLM request timed out after ${ms}ms`)), ms));
        return Promise.race([promise, timeout]);
    }
    /** Dispatch to the configured provider */
    callProvider(prompt) {
        switch (this.provider) {
            case "groq": return this.extractWithGroq(prompt);
            case "openai": return this.extractWithOpenAI(prompt);
            case "anthropic": return this.extractWithAnthropic(prompt);
            case "gemini": return this.extractWithGemini(prompt);
            case "openrouter": return this.extractWithOpenRouter(prompt);
            case "huggingface": return this.extractWithHuggingFace(prompt);
            default: throw new Error(`Unknown provider: ${this.provider}`);
        }
    }
    buildPrompt(intent, projectContext) {
        return `You are a Semantic Trait Extractor for a parametric design system with 26-chromosome DNA generation (ch0-sector through ch25-copy_engine).

Analyze the design intent and map to 8 trait vectors (0.0-1.0). Your output directly generates the design genome.

═══════════════════════════════════════════════════════════════
TRAIT DEFINITIONS (with real-world anchors)
═══════════════════════════════════════════════════════════════

1. informationDensity: Data presentation density
   0.1 = Luxury brand homepage (single hero image, minimal text)
   0.5 = Standard landing page (balanced content)
   0.9 = Bloomberg Terminal (dense data, multiple widgets, real-time feeds)

2. temporalUrgency: Time sensitivity and update frequency
   0.1 = Museum archive (permanent, timeless content)
   0.5 = Blog/news site (daily updates)
   0.9 = Stock trading dashboard (milliseconds matter, live ticker)

3. emotionalTemperature: Human warmth vs clinical precision
   0.1 = Government form, medical diagnostic tool (cold, precise)
   0.5 = Corporate SaaS (neutral professionalism)
   0.9 = Wellness brand, nonprofit (warm, empathetic, humanist)

4. playfulness: Experimental creativity vs strict structure
   0.1 = Legal document, compliance dashboard (rigid, formal)
   0.5 = Standard business site (structured but approachable)
   0.9 = Creative agency, game, children app (whimsical, organic shapes)

5. spatialDependency: Depth and dimensionality
   0.1 = Wikipedia page (flat text, no depth)
   0.5 = Modern marketing site (subtle parallax, layers)
   0.9 = 3D product configurator, metaverse experience (WebGL, immersive)

6. trustRequirement: Need for credibility and security signals
   0.1 = Personal blog, casual social (no credentials needed)
   0.5 = E-commerce (standard trust badges)
   0.9 = Healthcare portal, bank, legal (HIPAA, SOC2, certifications)

7. visualEmphasis: Image-to-text ratio
   0.1 = Documentation, technical manual (text-heavy)
   0.5 = Balanced content site
   0.9 = Photography portfolio, fashion lookbook (image-dominant)

8. conversionFocus: Sales pressure and CTA prominence
   0.1 = Educational resource, nonprofit awareness (pure information)
   0.5 = Standard business (contact forms, newsletter signup)
  0.9 = E-commerce checkout, sales page (aggressive CTAs, scarcity)

═══════════════════════════════════════════════════════════════
COMPLEXITY TIER SYSTEM (civilization thresholds)
═══════════════════════════════════════════════════════════════

Complexity determines the "civilization tier" - how sophisticated the generated system is:

0.00-0.29 (Microbial): Atomic components only (buttons, inputs)
0.30-0.49 (Flora): Growing components (cards, dropdowns)
0.50-0.69 (Fauna): Complex organisms (data tables, wizards)
0.70-0.84 (Sentient): CIVILIZATION BEGINS - Full architecture, state management
0.85-0.94 (Civilized): Multi-page app, routing, advanced patterns
0.95-1.00 (Advanced): AI-driven, micro-frontends, generative components

BOOST COMPLEXITY when intent includes these keywords:
+0.20: dashboard, platform, system, suite, application
+0.18: 3d, webgl, data visualization, real-time, immersive
+0.15: spatial, live, collaborative, multiplayer
+0.12: animation, motion, physics, spring
+0.10: interactive, dynamic, social
+0.08: component, library, accessible

TARGET: If the intent suggests a sophisticated application (not just a landing page),
ensure trait combinations push complexity toward 0.70+ to trigger civilization tier.

═══════════════════════════════════════════════════════════════
EPISTASIS RULES (trait interactions - APPLY THESE CONSTRAINTS)
═══════════════════════════════════════════════════════════════

These rules govern how traits interact. Use them to constrain your output:

RULE 1: High Information + High Urgency = Serious Data
IF informationDensity > 0.7 AND temporalUrgency > 0.7:
  → playfulness MUST be < 0.4 (serious data work, not playful)
  → emotionalTemperature SHOULD be < 0.5 (clinical focus)
  Example: Trading dashboard, emergency response system

RULE 2: High Urgency + Low Playfulness = No Animation
IF temporalUrgency > 0.8 AND playfulness < 0.3:
  → Motion physics suppressed (static for scanning speed)
  Example: Bloomberg Terminal, medical monitoring

RULE 3: Dashboard Data Density = Fade Transitions
IF informationDensity > 0.7:
  → Component enter animations become FADE (not slide/scale)
  → Reason: Sliding distracts from data scanning

RULE 4: Trust + Warmth = Healthcare Pattern
IF trustRequirement > 0.7 AND emotionalTemperature > 0.6:
  → Healthcare/wellness aesthetic (calming, credible, human)
  Example: Patient portal, therapy app

RULE 5: Spatial + Playful = 3D/Immersive
IF spatialDependency > 0.7 AND playfulness > 0.6:
  → WebGL, 3D particles, generative art, creative coding
  Example: Creative agency, portfolio, experiential site

RULE 6: Cold + Rigid = Brutalist/Enterprise
IF emotionalTemperature < 0.3 AND playfulness < 0.3:
  → Brutalist aesthetic (sharp edges, monospace, raw)
  Example: Developer tools, industrial, legal

RULE 7: Visual-First + Timeless = Luxury
IF visualEmphasis > 0.7 AND temporalUrgency < 0.3:
  → Luxury/premium aesthetic (editorial, art direction, gallery)
  Example: Fashion brand, luxury real estate

═══════════════════════════════════════════════════════════════
SECTOR DEFAULTS (apply unless context overrides)
═══════════════════════════════════════════════════════════════

Detected sector context should bias these defaults:

FINTECH: trustRequirement 0.7+, temporalUrgency 0.6+, informationDensity 0.6+
HEALTHCARE: trustRequirement 0.8+, emotionalTemperature 0.6+
CREATIVE/PORTFOLIO: visualEmphasis 0.8+, playfulness 0.6+
DOCUMENTATION: temporalUrgency 0.2, visualEmphasis 0.2, informationDensity 0.5
ECOMMERCE: conversionFocus 0.7+, trustRequirement 0.5+
SAAS/TECH: informationDensity 0.5, playfulness 0.3-0.5, emotionalTemperature 0.3-0.5

═══════════════════════════════════════════════════════════════
INPUT TO ANALYZE
═══════════════════════════════════════════════════════════════

Immediate Intent: "${intent}"
Overarching Project Context: "${projectContext || "No additional context provided."}"

═══════════════════════════════════════════════════════════════
SECTOR & ARCHETYPE CLASSIFICATION
═══════════════════════════════════════════════════════════════

PRIMARY SECTORS (pick one):
- healthcare (medical, wellness, diagnostic, dental)
- fintech (banking, trading, payments, wealth)
- automotive (luxury, electric, commercial)
- education (k12, higher, corporate training)
- commerce (retail, ecommerce, marketplace)
- entertainment (streaming, gaming, media)
- manufacturing (industrial, aerospace, pharmaceutical)
- legal (litigation, corporate, immigration)
- real_estate (residential, commercial, rental)
- travel (luxury, budget, adventure)
- food (restaurant, delivery, catering)
- sports (fitness, professional, amateur)
- technology (saas, developer tools, infrastructure, ai)

FUNCTIONAL ARCHETYPES (pick one):
- dashboard: Data-heavy, scannable, real-time updates
- portfolio: Visual showcase, image-forward, storytelling
- documentation: Reading-focused, hierarchical, searchable
- commerce: Product browsing, conversion-optimized, trust signals
- landing: Single-page, conversion-focused, hero-driven
- blog: Content-heavy, reading flow, editorial

═══════════════════════════════════════════════════════════════
COPY INTELLIGENCE (for ch25_copy_engine)
═══════════════════════════════════════════════════════════════

The copy engine generates actual text content. Extract how the copy should sound:

1. industryTerminology: Array of 3-5 sector-specific terms
   Example fintech: ["portfolio", "returns", "assets under management", "diversification"]
   Example healthcare: ["patient care", "treatment outcomes", "board certified", "clinical excellence"]
   Example legal: ["counsel", "representation", "jurisdiction", "precedent"]

2. emotionalRegister: How the copy should feel
   - clinical: Cold, precise, technical (medical devices, scientific tools)
   - professional: Neutral, credible, business-appropriate (SaaS, consulting)
   - conversational: Friendly, approachable, human (consumer apps, wellness)
   - playful: Fun, energetic, young (games, creative tools, education)
   - luxury: Refined, exclusive, sophisticated (high-end brands, premium services)
   - urgent: Action-oriented, time-sensitive (emergency services, limited offers)

3. formalityLevel: 0.0 = casual ("Hey!"), 1.0 = formal ("Dear Sir/Madam")
   Healthcare/legal: 0.7-0.9, Consumer apps: 0.2-0.4, Fintech: 0.5-0.7

4. ctaAggression: 0.0 = soft ("Learn more"), 1.0 = aggressive ("Buy NOW!")
   Nonprofit: 0.1-0.3, E-commerce: 0.6-0.9, Documentation: 0.0-0.2

5. headlineStyle: Primary headline approach
   - benefit_forward: Lead with value ("Save 10 hours a week")
   - curiosity_gap: Create intrigue ("The productivity trick Wall Street doesn't want you to know")
   - social_proof: Use credibility ("Join 10,000+ teams using...")
   - how_to: Educational promise ("How to streamline your workflow")
   - direct: Simple statement ("Project management software")

6. vocabularyComplexity: Word sophistication level
   - simple: Common words, short sentences (consumer, broad audience)
   - moderate: Standard business vocabulary (general B2B)
   - technical: Industry jargon acceptable (developer tools, specialized software)
   - specialized: Domain-specific terminology (legal, medical, scientific)

7. sentenceStructure: How sentences flow
   - short_punchy: Fragmented. Impactful. Fast. (Urgent, mobile-first)
   - balanced: Mix of short and medium. Natural flow. (Most common)
   - complex_periodic: Sophisticated structures with subordinate clauses. (Legal, academic, luxury)

8. emojiUsage: true/false - Are emojis appropriate? (Consumer/social: yes, Legal/enterprise: no)

9. contractionUsage: true/false - Use "don't", "can't", "won't"? (Conversational: yes, Formal: no)

SECTOR COPY EXAMPLES:
- Fintech trading: "Start building wealth today" (professional, aggressive CTA, benefit-forward)
- Legal services: "Schedule a confidential consultation" (luxury, formal, soft CTA, direct)
- Healthcare wellness: "Feel like yourself again" (conversational, empathetic, benefit-forward)
- Developer tools: "Ship faster with automated workflows" (technical, moderate, how-to)

═══════════════════════════════════════════════════════════════
COPY CONTENT GENERATION (from intent)
═══════════════════════════════════════════════════════════════

Generate ACTUAL copy content by extracting key information from the user's intent:

1. headline: Main hero headline (5-8 words). Extract product name + key benefit from intent.
   Example: "Mathematical Design DNA for AI-Generated Websites"
   Example: "Automated Trading for Serious Investors"

2. subheadline: Supporting text (12-20 words). Expand on the headline with how it works.
   Example: "Generate unique, deterministic design systems from SHA-256 hashes and content intent."
   Example: "Algorithmic portfolio management that adapts to market conditions in real-time."

3. cta: Call-to-action button text (2-4 words). Action-oriented.
   Example: "Generate Your DNA", "Start Free Trial", "View Documentation"

4. tagline: Short brand promise (4-8 words).
   Example: "No Templates. Only Math.", "Build Wealth Automatically"

5. companyName: Product/company name from intent. If not explicitly stated, derive from context.
   Example: "Permutations", "TradeAI", "HealthFlow"

6. features: Array of 3 key features extracted from intent. Each has title (3-5 words) and description (15-25 words).
   Example: [{"title": "SHA-256 Design DNA", "description": "Every design is mathematically generated from a hash, ensuring uniqueness and reproducibility."}, ...]

7. stats: Array of 3 metrics that would matter to this product. Label + value (use realistic placeholders if unknown).
   Example: [{"label": "Designs Generated", "value": "10,000+"}, {"label": "Uptime", "value": "99.9%"}, ...]

8. testimonial: One customer quote (25-40 words). Write from perspective of target user.
   Example: "This completely changed how we approach design. No more template fatigue—every client gets a unique system."

9. faq: Array of 2 FAQ items. Common questions someone would ask about this product.
   Example: [{"question": "How is this different from templates?", "answer": "Templates are static. Our system generates unique designs mathematically from your content."}, ...]

RULE: All copy MUST be derived from intent content. Do NOT use generic placeholders.

═══════════════════════════════════════════════════════════════
OUTPUT INSTRUCTIONS
═══════════════════════════════════════════════════════════════

1. Apply EPISTASIS RULES to constrain traits
2. Detect SECTOR from intent keywords and context
3. Detect SUB-SECTOR (e.g., "healthcare_wellness", "fintech_trading")
4. Detect ARCHETYPE from functional purpose
5. Extract COPY INTELLIGENCE for the copy engine (how text should sound)
6. GENERATE COPY CONTENT from intent (headlines, features, etc.)
7. Output EXACTLY this JSON (no markdown, no explanation):

{
  "traits": {
    "informationDensity": 0.0-1.0,
    "temporalUrgency": 0.0-1.0,
    "emotionalTemperature": 0.0-1.0,
    "playfulness": 0.0-1.0,
    "spatialDependency": 0.0-1.0,
    "trustRequirement": 0.0-1.0,
    "visualEmphasis": 0.0-1.0,
    "conversionFocus": 0.0-1.0
  },
  "sector": {
    "primary": "one_of_13_sectors",
    "subSector": "sector_subcategory",
    "confidence": 0.0-1.0
  },
  "archetype": {
    "type": "dashboard|portfolio|documentation|commerce|landing|blog",
    "confidence": 0.0-1.0
  },
  "copyIntelligence": {
    "industryTerminology": ["term1", "term2", "term3"],
    "emotionalRegister": "clinical|professional|conversational|playful|luxury|urgent",
    "formalityLevel": 0.0-1.0,
    "ctaAggression": 0.0-1.0,
    "headlineStyle": "benefit_forward|curiosity_gap|social_proof|how_to|direct",
    "vocabularyComplexity": "simple|moderate|technical|specialized",
    "sentenceStructure": "short_punchy|balanced|complex_periodic",
    "emojiUsage": true|false,
    "contractionUsage": true|false
  },
  "copy": {
    "headline": "string",
    "subheadline": "string",
    "cta": "string",
    "tagline": "string",
    "companyName": "string",
    "features": [{"title": "string", "description": "string"}],
    "stats": [{"label": "string", "value": "string"}],
    "testimonial": "string",
    "faq": [{"question": "string", "answer": "string"}]
  }
}
`;
    }
    async extractWithGroq(prompt) {
        if (!this.groq)
            throw new Error("Groq client not initialized");
        const response = await this.groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.2,
        });
        const content = response.choices[0].message.content || "{}";
        return JSON.parse(content);
    }
    async extractWithOpenAI(prompt) {
        if (!this.openai)
            throw new Error("OpenAI client not initialized");
        const response = await this.openai.chat.completions.create({
            model: "gpt-4.1",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.2,
        });
        const content = response.choices[0].message.content || "{}";
        return JSON.parse(content);
    }
    async extractWithAnthropic(prompt) {
        if (!this.anthropic)
            throw new Error("Anthropic client not initialized");
        const response = await this.anthropic.messages.create({
            model: "claude-3-7-sonnet-latest",
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }],
        });
        const content = response.content[0];
        let text = "";
        if (content.type === "text") {
            text = content.text;
        }
        else {
            throw new Error("Unexpected response type from Anthropic");
        }
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch)
            throw new Error("No JSON found in Anthropic response");
        return JSON.parse(jsonMatch[0]);
    }
    async extractWithGemini(prompt) {
        if (!this.gemini)
            throw new Error("Gemini client not initialized");
        const result = await this.gemini.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
        });
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch)
            throw new Error("No JSON found in Gemini response");
        return JSON.parse(jsonMatch[0]);
    }
    async extractWithOpenRouter(prompt) {
        if (!this.openrouter)
            throw new Error("OpenRouter client not initialized");
        const response = await this.openrouter.chat.completions.create({
            model: "meta-llama/llama-3.3-70b-versatile", // Default to Llama 4 Scout
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.2,
        });
        const content = response.choices[0].message.content || "{}";
        return JSON.parse(content);
    }
    async extractWithHuggingFace(prompt) {
        if (!this.huggingface)
            throw new Error("HuggingFace key not set");
        const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.huggingface}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    temperature: 0.2,
                    max_new_tokens: 512,
                    return_full_text: false,
                },
            }),
        });
        if (!response.ok) {
            throw new Error(`HuggingFace API error: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        const text = Array.isArray(result) ? result[0]?.generated_text : result.generated_text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch)
            throw new Error("No JSON found in HuggingFace response");
        return JSON.parse(jsonMatch[0]);
    }
    clamp(value) {
        return Math.max(0, Math.min(1, value));
    }
    getProvider() {
        return this.provider;
    }
}
