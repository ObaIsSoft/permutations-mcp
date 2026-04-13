import Groq from "groq-sdk";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as crypto from "crypto";
const LLM_TIMEOUT_MS = 30_000;
const LLM_MAX_RETRIES = 3;
/**
 * Safely parse JSON with comprehensive error handling.
 * Throws descriptive errors on failure to facilitate debugging.
 */
function safeJSONParse(json, context) {
    try {
        return JSON.parse(json);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`JSON parse failed in ${context}: ${message}. Input: "${json.substring(0, 100)}${json.length > 100 ? '...' : ''}"`);
    }
}
function createLLMClient(provider, apiKey) {
    switch (provider) {
        case "groq": {
            const c = new Groq({ apiKey });
            return {
                async chatJSON(p, opts) {
                    const r = await c.chat.completions.create({ model: opts.model, messages: [{ role: "user", content: p }], response_format: { type: "json_object" }, temperature: opts.temperature });
                    return safeJSONParse(r.choices[0].message.content || "{}", "groq");
                },
                async chatText(p, opts) {
                    const r = await c.chat.completions.create({ model: opts.model, messages: [{ role: "user", content: p }], temperature: opts.temperature, max_tokens: opts.maxTokens });
                    return r.choices[0].message.content || "";
                },
            };
        }
        case "openai": {
            const c = new OpenAI({ apiKey });
            return {
                async chatJSON(p, opts) {
                    const r = await c.chat.completions.create({ model: opts.model, messages: [{ role: "user", content: p }], response_format: { type: "json_object" }, temperature: opts.temperature });
                    return safeJSONParse(r.choices[0].message.content || "{}", "openai");
                },
                async chatText(p, opts) {
                    const r = await c.chat.completions.create({ model: opts.model, messages: [{ role: "user", content: p }], temperature: opts.temperature, max_tokens: opts.maxTokens });
                    return r.choices[0].message.content || "";
                },
            };
        }
        case "anthropic": {
            const c = new Anthropic({ apiKey });
            return {
                async chatJSON(p, opts) {
                    const r = await c.messages.create({ model: opts.model, max_tokens: opts.maxTokens || 4096, messages: [{ role: "user", content: p }] });
                    const t = r.content[0];
                    if (t.type !== "text")
                        throw new Error("Unexpected response type");
                    const m = t.text.match(/\{[\s\S]*\}/);
                    if (!m)
                        throw new Error("No JSON in response");
                    return safeJSONParse(m[0], "anthropic");
                },
                async chatText(p, opts) {
                    const r = await c.messages.create({ model: opts.model, max_tokens: opts.maxTokens, messages: [{ role: "user", content: p }] });
                    const t = r.content[0];
                    if (t.type !== "text")
                        throw new Error("Unexpected response type");
                    return t.text;
                },
            };
        }
        case "gemini": {
            const gm = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: "gemini-2.0-flash" });
            return {
                async chatJSON(_p, opts) {
                    const r = await gm.generateContent({ contents: [{ role: "user", parts: [{ text: _p }] }], generationConfig: { temperature: opts.temperature, responseMimeType: "application/json" } });
                    const t = r.response.text();
                    const j = t.match(/\{[\s\S]*\}/);
                    if (!j)
                        throw new Error("No JSON in response");
                    return safeJSONParse(j[0], "gemini");
                },
                async chatText(p, opts) {
                    const r = await gm.generateContent({ contents: [{ role: "user", parts: [{ text: p }] }], generationConfig: { temperature: opts.temperature } });
                    return r.response.text();
                },
            };
        }
        case "openrouter": {
            const c = new OpenAI({ apiKey, baseURL: "https://openrouter.ai/api/v1" });
            return {
                async chatJSON(p, opts) {
                    const r = await c.chat.completions.create({ model: opts.model, messages: [{ role: "user", content: p }], response_format: { type: "json_object" }, temperature: opts.temperature });
                    return safeJSONParse(r.choices[0].message.content || "{}", "openrouter");
                },
                async chatText(p, opts) {
                    const r = await c.chat.completions.create({ model: opts.model, messages: [{ role: "user", content: p }], temperature: opts.temperature, max_tokens: opts.maxTokens });
                    return r.choices[0].message.content || "";
                },
            };
        }
        case "hf-inference": {
            const c = new OpenAI({ apiKey, baseURL: "https://router.huggingface.co/together/v1" });
            return {
                async chatJSON(p, opts) {
                    const r = await c.chat.completions.create({ model: opts.model, messages: [{ role: "user", content: p }], response_format: { type: "json_object" }, temperature: opts.temperature });
                    return safeJSONParse(r.choices[0].message.content || "{}", "hf-inference");
                },
                async chatText(p, opts) {
                    const r = await c.chat.completions.create({ model: opts.model, messages: [{ role: "user", content: p }], temperature: opts.temperature, max_tokens: opts.maxTokens });
                    return r.choices[0].message.content || "";
                },
            };
        }
    }
}
export class SemanticTraitExtractor {
    apiKeyMissing = false;
    client;
    provider;
    constructor(apiKey, provider) {
        const groqKey = process.env.GROQ_API_KEY;
        const openaiKey = process.env.OPENAI_API_KEY;
        const anthropicKey = process.env.ANTHROPIC_API_KEY;
        const geminiKey = process.env.GEMINI_API_KEY;
        const openrouterKey = process.env.OPENROUTER_API_KEY;
        const hfKey = process.env.HUGGINGFACE_API_KEY;
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
        else if (hfKey) {
            this.provider = "hf-inference";
        }
        else {
            this.provider = "groq";
        }
        const key = apiKey || groqKey || openaiKey || anthropicKey || geminiKey || openrouterKey || hfKey;
        if (!key) {
            throw new Error("No LLM API key configured. Set one of: GROQ_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY, OPENROUTER_API_KEY, or HUGGINGFACE_API_KEY.");
        }
        this.client = createLLMClient(this.provider, key);
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
     * When personaContext is provided, the LLM answers structural questions through
     * the persona's lens — their worldview, instincts, and creative behavior shape
     * the trait extraction directly, rather than applying post-hoc numeric tweaks.
     */
    async analyze(intent, projectContext, personaContext) {
        const prompt = this.buildPrompt(intent, projectContext, personaContext);
        let lastError = null;
        for (let attempt = 1; attempt <= LLM_MAX_RETRIES; attempt++) {
            try {
                const result = await this.withTimeout(this.callProvider(prompt), LLM_TIMEOUT_MS);
                const s = result.structural ?? {};
                const toBool = (v) => v === true || v === 'true' || v === 1;
                return {
                    structural: {
                        realtimeState: toBool(s.realtimeState),
                        entityCount: Math.max(1, Math.min(30, Math.round(Number(s.entityCount) || 1))),
                        sensitiveData: toBool(s.sensitiveData),
                        multiRole: toBool(s.multiRole),
                        financialTransactions: toBool(s.financialTransactions),
                        complexWorkflows: toBool(s.complexWorkflows),
                        deepNavigation: toBool(s.deepNavigation),
                        externalIntegrations: toBool(s.externalIntegrations),
                        screenCount: Math.max(1, Math.min(50, Math.round(Number(s.screenCount) || 1))),
                        primarySurface: (['data', 'content', 'media', 'transaction', 'balanced'].includes(s.primarySurface)
                            ? s.primarySurface
                            : 'balanced'),
                    },
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
                        emotionalRegister: (typeof result.copyIntelligence?.emotionalRegister === 'string' &&
                            ["clinical", "professional", "conversational", "playful", "luxury", "urgent"].includes(result.copyIntelligence.emotionalRegister))
                            ? result.copyIntelligence.emotionalRegister
                            : "professional",
                        formalityLevel: this.clamp(result.copyIntelligence?.formalityLevel ?? 0.5),
                        ctaAggression: this.clamp(result.copyIntelligence?.ctaAggression ?? 0.5),
                        headlineStyle: (typeof result.copyIntelligence?.headlineStyle === 'string' &&
                            ["benefit_forward", "curiosity_gap", "social_proof", "how_to", "direct"].includes(result.copyIntelligence.headlineStyle))
                            ? result.copyIntelligence.headlineStyle
                            : "benefit_forward",
                        vocabularyComplexity: (typeof result.copyIntelligence?.vocabularyComplexity === 'string' &&
                            ["simple", "moderate", "technical", "specialized"].includes(result.copyIntelligence.vocabularyComplexity))
                            ? result.copyIntelligence.vocabularyComplexity
                            : "moderate",
                        sentenceStructure: (typeof result.copyIntelligence?.sentenceStructure === 'string' &&
                            ["balanced", "short_punchy", "complex_periodic"].includes(result.copyIntelligence.sentenceStructure))
                            ? result.copyIntelligence.sentenceStructure
                            : "balanced",
                        emojiUsage: result.copyIntelligence?.emojiUsage ?? false,
                        contractionUsage: result.copyIntelligence?.contractionUsage ?? true,
                    },
                    // Copy content generated from intent — no fallbacks, empty = not rendered
                    copy: {
                        headline: result.copy?.headline ?? "",
                        subheadline: result.copy?.subheadline ?? "",
                        cta: result.copy?.cta ?? "",
                        tagline: result.copy?.tagline ?? "",
                        companyName: result.copy?.companyName ?? "",
                        features: result.copy?.features ?? [],
                        stats: result.copy?.stats ?? [],
                        testimonial: result.copy?.testimonial ?? "",
                        authorName: result.copy?.authorName ?? "",
                        authorTitle: result.copy?.authorTitle ?? "",
                        ctaSecondary: result.copy?.ctaSecondary ?? "",
                        sectionTitleTestimonials: result.copy?.sectionTitleTestimonials ?? "",
                        sectionTitleFeatures: result.copy?.sectionTitleFeatures ?? "",
                        sectionTitleFAQ: result.copy?.sectionTitleFAQ ?? "",
                        faq: result.copy?.faq ?? [],
                        footerProductTitle: result.copy?.footerProductTitle ?? "",
                        footerCompanyTitle: result.copy?.footerCompanyTitle ?? "",
                        footerNavProduct: result.copy?.footerNavProduct ?? [],
                        footerNavCompany: result.copy?.footerNavCompany ?? [],
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
     * Identify the actual UI components (organisms) for this product.
     * The genome/complexity tier determines HOW MANY organisms exist.
     * This call determines WHAT they are — product-specific, not abstract topology names.
     *
     * Returns organism definitions that the ecosystem generator uses for naming.
     * Falls back gracefully (returns empty arrays) if LLM unavailable.
     */
    async analyzeOrganisms(intent, sector, counts, biomeContext) {
        if (this.apiKeyMissing) {
            throw new Error(`LLM API key missing. Provider: ${this.provider}. ` +
                `Set GROQ_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY, OPENROUTER_API_KEY, or HUGGINGFACE_API_KEY.`);
        }
        if ((counts.microbial + counts.flora + counts.fauna) === 0) {
            return { microbial: [], flora: [], fauna: [] };
        }
        const biomeIntro = biomeContext
            ? `\nEcosystem biome: ${biomeContext}\nLet this biome subtly flavor component naming (e.g., in a 'deep-sea' fintech ecosystem, components might evoke depth/discovery; in a 'volcanic' context, intensity/heat).\n`
            : '';
        const prompt = `You are naming UI components for a ${sector} product.
Product: ${intent}
${biomeIntro}
Generate exactly:
- ${counts.microbial} atomic components (microbial): smallest interactive/display elements — buttons, status indicators, badges, input fields, icons, loaders, price cells
- ${counts.flora} composite components (flora): groups of atomic elements — forms, cards, nav bars, dropdowns, list items, filter panels
- ${counts.fauna} complex components (fauna): full orchestrators with state — tables, charts, dialogs, editors, page shells, data grids

Return ONLY this JSON, no explanation:
{
  "microbial": [{ "name": "PascalCase", "purpose": "one sentence" }],
  "flora":     [{ "name": "PascalCase", "purpose": "one sentence" }],
  "fauna":     [{ "name": "PascalCase", "purpose": "one sentence" }]
}

Rules:
- Names must be specific to this product's domain (e.g. PriceCell, PatientCard, OrderForm — not GenericButton, BaseCard)
- No "Generic", "Base", "Component", "Element", "Widget" suffixes
- Purpose: one sentence describing what the user sees or does with it
- Exactly ${counts.microbial} microbial, ${counts.flora} flora, ${counts.fauna} fauna entries`;
        try {
            const result = await this.withTimeout(this.callOrganismsProvider(prompt), LLM_TIMEOUT_MS);
            return {
                microbial: (result.microbial || []).slice(0, counts.microbial),
                flora: (result.flora || []).slice(0, counts.flora),
                fauna: (result.fauna || []).slice(0, counts.fauna),
            };
        }
        catch (e) {
            throw new Error(`Organism naming failed: ${e instanceof Error ? e.message : String(e)}. ` +
                `Provider: ${this.provider}. Intent: "${intent.slice(0, 100)}${intent.length > 100 ? '...' : ''}". ` +
                `Counts: microbial=${counts.microbial}, flora=${counts.flora}, fauna=${counts.fauna}`);
        }
    }
    /** Dispatch to providers for organism naming — larger token budget than trait extraction */
    async callOrganismsProvider(prompt) {
        const models = {
            groq: "llama-3.3-70b-versatile",
            openai: "gpt-4.1",
            anthropic: "claude-3-7-sonnet-latest",
            gemini: "gemini-2.0-flash",
            openrouter: "meta-llama/llama-3-70b-instruct",
            "hf-inference": "meta-llama/Llama-3.3-70B-Instruct",
        };
        return this.client.chatJSON(prompt, { model: models[this.provider], temperature: 0.4, maxTokens: 2048 });
    }
    /**
     * Names UI components for a civilization tier — product-specific, archetype-flavored.
     * Same pattern as analyzeOrganisms but for application-level components at civilization tiers.
     * Falls back gracefully (returns empty array) if LLM unavailable.
     */
    async analyzeCivilizationComponents(intent, sector, tier, archetypeContext, count) {
        if (this.apiKeyMissing) {
            throw new Error(`LLM API key missing. Provider: ${this.provider}. ` +
                `Set GROQ_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY, OPENROUTER_API_KEY, or HUGGINGFACE_API_KEY.`);
        }
        if (count === 0)
            return [];
        const prompt = `You are naming UI components for a ${sector} product.
Product: ${intent}
Civilization tier: ${tier}
Archetype: ${archetypeContext}

Generate exactly ${count} component names for this ${tier}-level product.
Components at this tier span atomic elements, composite containers, complex orchestrators, and full application surfaces.

Return ONLY this JSON, no explanation:
{
  "components": [{ "name": "PascalCase", "purpose": "one sentence" }]
}

Rules:
- Names must be specific to this product's domain (e.g. TradingTerminal, PatientSummary — not GenericDashboard)
- The archetype character should flavor the naming register
- No "Generic", "Base", "Component", "Element", "Widget" suffixes
- Exactly ${count} entries`;
        try {
            const result = await this.withTimeout(this.callCivilizationComponentsProvider(prompt), LLM_TIMEOUT_MS);
            return (result.components || []).slice(0, count);
        }
        catch (e) {
            throw new Error(`Civilization component naming failed: ${e instanceof Error ? e.message : String(e)}. ` +
                `Provider: ${this.provider}. Intent: "${intent.slice(0, 100)}${intent.length > 100 ? '...' : ''}". ` +
                `Tier: ${tier}, Count: ${count}`);
        }
    }
    /** Dispatch to providers for civilization component naming */
    async callCivilizationComponentsProvider(prompt) {
        const models = {
            groq: "llama-3.3-70b-versatile",
            openai: "gpt-4.1",
            anthropic: "claude-3-7-sonnet-latest",
            gemini: "gemini-2.0-flash",
            openrouter: "meta-llama/llama-3-70b-instruct",
            "hf-inference": "meta-llama/Llama-3.3-70B-Instruct",
        };
        return this.client.chatJSON(prompt, { model: models[this.provider], temperature: 0.4, maxTokens: 2048 });
    }
    /**
     * Free-form text LLM call — used by design brief synthesis and other philosophy generators.
     * Returns raw text (not JSON). Retries with backoff.
     */
    async callText(prompt) {
        let lastError = null;
        for (let attempt = 1; attempt <= LLM_MAX_RETRIES; attempt++) {
            try {
                return await this.withTimeout(this.callTextProvider(prompt), LLM_TIMEOUT_MS);
            }
            catch (e) {
                lastError = e;
                if (attempt < LLM_MAX_RETRIES) {
                    const hash = crypto.createHash("sha256").update(`retry_${attempt}_${Date.now()}`).digest("hex");
                    const jitter = (parseInt(hash.slice(0, 2), 16) / 255) * 500;
                    await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempt - 1) + jitter));
                }
            }
        }
        throw new Error(`LLM text call failed after ${LLM_MAX_RETRIES} attempts. Last error: ${lastError?.message}`);
    }
    async callTextProvider(prompt) {
        const models = {
            groq: "llama-3.3-70b-versatile",
            openai: "gpt-4.1",
            anthropic: "claude-3-7-sonnet-latest",
            gemini: "gemini-2.0-flash",
            openrouter: "meta-llama/llama-3-70b-instruct",
            "hf-inference": "meta-llama/Llama-3.3-70B-Instruct",
        };
        return this.client.chatText(prompt, { model: models[this.provider], temperature: 0.7, maxTokens: 4096 });
    }
    /** Race a promise against a timeout */
    withTimeout(promise, ms) {
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error(`LLM request timed out after ${ms}ms`)), ms));
        return Promise.race([promise, timeout]);
    }
    /** Dispatch to the configured provider */
    callProvider(prompt) {
        const models = {
            groq: "llama-3.3-70b-versatile",
            openai: "gpt-4.1",
            anthropic: "claude-3-7-sonnet-latest",
            gemini: "gemini-2.0-flash",
            openrouter: "meta-llama/llama-3-70b-versatile",
            "hf-inference": "meta-llama/Llama-3.3-70B-Instruct",
        };
        return this.client.chatJSON(prompt, { model: models[this.provider], temperature: 0.2 });
    }
    buildPrompt(intent, projectContext, personaContext) {
        const personaSection = personaContext ? `
═══════════════════════════════════════════════════════════════
CREATOR PERSONA CONTEXT — ANSWER THROUGH THIS DESIGNER'S LENS
═══════════════════════════════════════════════════════════════

You are analyzing this product's design requirements as if you were this designer:

Background: ${personaContext.biography}
Instincts: ${personaContext.instincts.join(', ')}
Worldview: ${personaContext.worldview}
Creative Behavior: ${personaContext.creativeBehavior}

This designer would naturally emphasize their instincts and approach problems with their creative behavior.
Answer the following structural and trait questions as this designer would — let their
perspective shape your assessment of information density, emotional temperature, playfulness,
spatial dependency, and all other traits. Their worldview should influence how you interpret
the product's needs.

═══════════════════════════════════════════════════════════════
` : '';
        return `You are a Semantic Trait Extractor for a parametric design system with 32-chromosome DNA generation (ch0-sector through ch32-token_inheritance).

${personaSection}Analyze the design intent and map to 8 trait vectors (0.0-1.0). Your output directly generates the design genome.

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
   Example: "Genome", "TradeAI", "HealthFlow"

6. features: Array of 3 key features extracted from intent. Each has title (3-5 words) and description (15-25 words).
   Example: [{"title": "SHA-256 Design DNA", "description": "Every design is mathematically generated from a hash, ensuring uniqueness and reproducibility."}, ...]

7. stats: Array of 3 metrics that would matter to this product. Label + value (use realistic placeholders if unknown).
   Example: [{"label": "Designs Generated", "value": "10,000+"}, {"label": "Uptime", "value": "99.9%"}, ...]

8. testimonial: One customer quote (25-40 words). Write from perspective of a real user of this product.
   Example: "This completely changed how we approach design. No more template fatigue—every client gets a unique system."

9. faq: Array of 2 FAQ items. Common questions someone would ask about this product.
   Example: [{"question": "How is this different from templates?", "answer": "Templates are static. Our system generates unique designs mathematically from your content."}, ...]

10. authorName: Full name of the testimonial author. A plausible, realistic name fitting the sector and target persona.
    Example fintech: "Sarah Chen", Example healthcare: "Dr. Marcus Webb", Example legal: "James Thornton"

11. authorTitle: Professional title of the testimonial author. Appropriate seniority for the sector.
    Example fintech: "VP of Investments, Meridian Capital", Example healthcare: "Chief Medical Officer, Riverside Health"

12. ctaSecondary: Secondary call-to-action text (2-4 words). Softer than primary CTA.
    Example: "Watch Demo", "See How It Works", "Learn More", "View Case Studies"

13. sectionTitleTestimonials: Title for the testimonials/social proof section (3-6 words).
    Example: "What Our Customers Say", "Real Results", "Trusted by Industry Leaders"

14. sectionTitleFeatures: Title for the features section (2-5 words).
    Example: "How It Works", "What You Get", "Built for Performance"

15. sectionTitleFAQ: Title for the FAQ section (3-6 words).
    Example: "Frequently Asked Questions", "Common Questions", "You Asked, We Answered"

16. footerProductTitle: Heading for the product/services column in the footer (1-2 words).
    Example: "Product", "Services", "Platform", "Solutions"

17. footerCompanyTitle: Heading for the company column in the footer (1-2 words).
    Example: "Company", "About", "Organization", "Studio"

18. footerNavProduct: Array of 3-4 product/service navigation links for the footer. Derived from copy.features titles or product capabilities.
    Example: ["Features", "Pricing", "API", "Changelog"]
    Example healthcare: ["Treatments", "Providers", "Patient Portal", "Insurance"]

19. footerNavCompany: Array of 3-4 company navigation links for the footer. Standard company pages appropriate for the sector.
    Example: ["About", "Careers", "Press", "Contact"]
    Example legal: ["Our Attorneys", "Case Results", "Pro Bono", "Contact"]

RULE: All copy MUST be derived from intent content. Do NOT use generic placeholders. Names and titles must feel authentic to the sector.

═══════════════════════════════════════════════════════════════
STRUCTURAL ANALYSIS (complexity is computed from this — not from vocabulary)
═══════════════════════════════════════════════════════════════

Answer based on what the product DOES, not the words used to describe it.
"a tool doctors use to track patients" and "clinical monitoring dashboard" are the same product.

1. realtimeState (boolean): Does the user see data change while looking at the screen?
   YES: stock ticker, live chat, sensor monitoring, collaborative editing, notifications
   NO: blog, document editor with manual save, booking form, product catalogue

2. entityCount (integer 1–20): How many distinct types of data objects does this product manage?
   Count each unique thing that has its own properties and can be listed/viewed separately.
   "log sets and reps" → workouts, exercises, sets = 3
   "hospital portal" → patients, appointments, medications, lab results, doctors = 5
   "landing page" → 1 (no data management, just content)

3. sensitiveData (boolean): Does this product handle sensitive personal data?
   YES: medical records, financial account data, legal documents, passwords, payment cards, personal health info
   NO: public blog posts, product catalogues, general appointment scheduling without PII

4. multiRole (boolean): Do different users see different interfaces based on role/permission?
   YES: admin vs end-user, doctor vs patient, manager vs employee, buyer vs seller
   NO: single user type, everyone sees the same screens

5. financialTransactions (boolean): Does this product process payments or manage financial accounts?
   YES: checkout, subscription billing, invoice generation, trading, banking, crypto
   NO: displaying prices, financial education, expense tracking without payment processing

6. complexWorkflows (boolean): Does this product guide users through multi-step processes?
   YES: onboarding wizards, approval chains, multi-step forms (3+ steps), diagnostic flows, booking with configuration
   NO: simple CRUD operations, single-step actions, read-only content

7. deepNavigation (boolean): Does navigation have 3 or more levels of hierarchy?
   YES: home → category → subcategory → item → detail panel (3+ levels)
   NO: home → about → contact (flat, 1–2 levels)

8. externalIntegrations (boolean): Does this product consume data from external APIs or services?
   YES: weather APIs, payment processors, OAuth providers, calendar sync, analytics, map data
   NO: standalone, self-contained, no external data feeds

9. screenCount (integer 1–30): How many distinct screens or views does this product have?
   Count each unique view a user navigates to as one screen.
   Simple landing page = 1 | Blog = 3–5 | E-commerce = 8–12 | SaaS dashboard = 10–20

10. primarySurface (one of: "data" | "content" | "media" | "transaction" | "balanced"):
    data        = tables, charts, metrics, real-time feeds (primary purpose: managing/displaying data)
    content     = articles, docs, long-form text (primary purpose: reading)
    media       = images, video, portfolio (primary purpose: visual media)
    transaction = checkout, booking, form submission (primary purpose: completing an action)
    balanced    = roughly equal mix

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
  "structural": {
    "realtimeState": true|false,
    "entityCount": 1-20,
    "sensitiveData": true|false,
    "multiRole": true|false,
    "financialTransactions": true|false,
    "complexWorkflows": true|false,
    "deepNavigation": true|false,
    "externalIntegrations": true|false,
    "screenCount": 1-30,
    "primarySurface": "data|content|media|transaction|balanced"
  },
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
    "authorName": "string",
    "authorTitle": "string",
    "ctaSecondary": "string",
    "sectionTitleTestimonials": "string",
    "sectionTitleFeatures": "string",
    "sectionTitleFAQ": "string",
    "faq": [{"question": "string", "answer": "string"}],
    "footerProductTitle": "string",
    "footerCompanyTitle": "string",
    "footerNavProduct": ["string", "string", "string"],
    "footerNavCompany": ["string", "string", "string"]
  }
}
`;
    }
    clamp(value) {
        return Math.max(0, Math.min(1, value));
    }
    getProvider() {
        return this.provider;
    }
}
