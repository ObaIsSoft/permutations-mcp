import Groq from "groq-sdk";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ContentTraits } from "../genome/types.js";

type LLMProvider = "groq" | "openai" | "anthropic" | "gemini" | "openrouter" | "huggingface";

const LLM_TIMEOUT_MS = 30_000;   // 30s timeout per attempt (increased for cold starts)
const LLM_MAX_RETRIES = 3;       // Retry up to 3 times with exponential backoff + jitter

interface LLMResponse {
    informationDensity: number;
    temporalUrgency: number;
    emotionalTemperature: number;
    playfulness: number;
    spatialDependency: number;
    trustRequirement: number;
    visualEmphasis: number;
    conversionFocus: number;
}

export class SemanticTraitExtractor {
    private groq?: Groq;
    private openai?: OpenAI;
    private anthropic?: Anthropic;
    private gemini?: any;
    private openrouter?: OpenAI; // OpenRouter uses OpenAI-compatible API
    private huggingface?: any;
    private provider: LLMProvider;

    constructor(apiKey?: string, provider?: LLMProvider) {
        const groqKey = process.env.GROQ_API_KEY;
        const openaiKey = process.env.OPENAI_API_KEY;
        const anthropicKey = process.env.ANTHROPIC_API_KEY;
        const geminiKey = process.env.GEMINI_API_KEY;
        const openrouterKey = process.env.OPENROUTER_API_KEY;
        const huggingfaceKey = process.env.HUGGINGFACE_API_KEY;

        if (provider) {
            this.provider = provider;
        } else if (groqKey) {
            this.provider = "groq";
        } else if (openaiKey) {
            this.provider = "openai";
        } else if (anthropicKey) {
            this.provider = "anthropic";
        } else if (geminiKey) {
            this.provider = "gemini";
        } else if (openrouterKey) {
            this.provider = "openrouter";
        } else if (huggingfaceKey) {
            this.provider = "huggingface";
        } else {
            this.provider = "groq";
        }

        const key = apiKey || groqKey || openaiKey || anthropicKey || geminiKey || openrouterKey || huggingfaceKey;

        if (!key) {
            throw new Error(
                "No API key provided. Set one of: GROQ_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY, OPENROUTER_API_KEY, or HUGGINGFACE_API_KEY"
            );
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
                this.gemini = genAI.getGenerativeModel({ model: "gemini-2.5-pro-latest" });
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
    static isAvailable(): boolean {
        return !!(
            process.env.GROQ_API_KEY ||
            process.env.OPENAI_API_KEY ||
            process.env.ANTHROPIC_API_KEY ||
            process.env.GEMINI_API_KEY ||
            process.env.OPENROUTER_API_KEY ||
            process.env.HUGGINGFACE_API_KEY
        );
    }

    async extractTraits(intent: string, projectContext?: string): Promise<ContentTraits> {
        const prompt = this.buildPrompt(intent, projectContext);
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= LLM_MAX_RETRIES; attempt++) {
            try {
                const result = await this.withTimeout(
                    this.callProvider(prompt),
                    LLM_TIMEOUT_MS
                );
                return {
                    informationDensity: this.clamp(result.informationDensity ?? 0.5),
                    temporalUrgency: this.clamp(result.temporalUrgency ?? 0.5),
                    emotionalTemperature: this.clamp(result.emotionalTemperature ?? 0.5),
                    playfulness: this.clamp(result.playfulness ?? 0.5),
                    spatialDependency: this.clamp(result.spatialDependency ?? 0.5),
                    trustRequirement: this.clamp(result.trustRequirement ?? 0.3),
                    visualEmphasis: this.clamp(result.visualEmphasis ?? 0.3),
                    conversionFocus: this.clamp(result.conversionFocus ?? 0.4),
                };
            } catch (e: any) {
                lastError = e;
                if (attempt < LLM_MAX_RETRIES) {
                    const baseDelay = 500 * Math.pow(2, attempt - 1); // 500ms, 1000ms, 2000ms
                    const jitter = Math.random() * 500; // Add 0-500ms random jitter
                    const delay = baseDelay + jitter;
                    // Retry attempt failed, will retry
                    await new Promise(r => setTimeout(r, delay));
                }
            }
        }

        // All retries failed - LLM is required, no fallback
        throw new Error(
            `LLM extraction failed after ${LLM_MAX_RETRIES} attempts. ` +
            `Provider: ${this.provider}. ` +
            `Last error: ${lastError?.message || "Unknown error"}. ` +
            `Set a valid API key (GROQ_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY, OPENROUTER_API_KEY, or HUGGINGFACE_API_KEY).`
        );
    }

    /** Race a promise against a timeout */
    private withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
        const timeout = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`LLM request timed out after ${ms}ms`)), ms)
        );
        return Promise.race([promise, timeout]);
    }

    /** Dispatch to the configured provider */
    private callProvider(prompt: string): Promise<LLMResponse> {
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

    private buildPrompt(intent: string, projectContext?: string): string {
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
OUTPUT INSTRUCTIONS
═══════════════════════════════════════════════════════════════

1. Apply the EPISTASIS RULES to constrain trait combinations
2. Check for COMPLEXITY KEYWORDS and adjust toward appropriate tier
3. Apply SECTOR DEFAULTS if context suggests a specific industry
4. Output EXACTLY this JSON structure (no markdown, no explanation):

{
  "informationDensity": 0.0-1.0,
  "temporalUrgency": 0.0-1.0,
  "emotionalTemperature": 0.0-1.0,
  "playfulness": 0.0-1.0,
  "spatialDependency": 0.0-1.0,
  "trustRequirement": 0.0-1.0,
  "visualEmphasis": 0.0-1.0,
  "conversionFocus": 0.0-1.0
}`;
    }

    private async extractWithGroq(prompt: string): Promise<LLMResponse> {
        if (!this.groq) throw new Error("Groq client not initialized");
        const response = await this.groq.chat.completions.create({
            model: "llama-4-scout-17b-16e-instruct",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.2,
        });
        const content = response.choices[0].message.content || "{}";
        return JSON.parse(content);
    }

    private async extractWithOpenAI(prompt: string): Promise<LLMResponse> {
        if (!this.openai) throw new Error("OpenAI client not initialized");
        const response = await this.openai.chat.completions.create({
            model: "gpt-4.1",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.2,
        });
        const content = response.choices[0].message.content || "{}";
        return JSON.parse(content);
    }

    private async extractWithAnthropic(prompt: string): Promise<LLMResponse> {
        if (!this.anthropic) throw new Error("Anthropic client not initialized");
        const response = await this.anthropic.messages.create({
            model: "claude-3-7-sonnet-latest",
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }],
        });
        const content = response.content[0];
        let text = "";
        if (content.type === "text") {
            text = content.text;
        } else {
            throw new Error("Unexpected response type from Anthropic");
        }
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found in Anthropic response");
        return JSON.parse(jsonMatch[0]);
    }

    private async extractWithGemini(prompt: string): Promise<LLMResponse> {
        if (!this.gemini) throw new Error("Gemini client not initialized");
        const result = await this.gemini.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
        });
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found in Gemini response");
        return JSON.parse(jsonMatch[0]);
    }

    private async extractWithOpenRouter(prompt: string): Promise<LLMResponse> {
        if (!this.openrouter) throw new Error("OpenRouter client not initialized");
        const response = await this.openrouter.chat.completions.create({
            model: "meta-llama/llama-4-scout-17b-16e-instruct", // Default to Llama 4 Scout
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.2,
        });
        const content = response.choices[0].message.content || "{}";
        return JSON.parse(content);
    }

    private async extractWithHuggingFace(prompt: string): Promise<LLMResponse> {
        if (!this.huggingface) throw new Error("HuggingFace key not set");
        
        const response = await fetch(
            "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct",
            {
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
            }
        );
        
        if (!response.ok) {
            throw new Error(`HuggingFace API error: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        const text = Array.isArray(result) ? result[0]?.generated_text : result.generated_text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found in HuggingFace response");
        return JSON.parse(jsonMatch[0]);
    }

    private clamp(value: number): number {
        return Math.max(0, Math.min(1, value));
    }

    getProvider(): LLMProvider {
        return this.provider;
    }

    /**
     * Classify sector from content using LLM
     */
    async classifySector(content: string): Promise<{ primary: string; confidence: number }> {
        const prompt = `Analyze this content and classify it into ONE primary sector.

Available sectors: healthcare, fintech, automotive, education, commerce, entertainment, manufacturing, legal, real_estate, travel, food, sports, technology

Content: "${content.slice(0, 2000)}"

Respond with EXACTLY this JSON (no markdown):
{
  "sector": "one_of_the_above",
  "confidence": 0.0-1.0
}`;

        try {
            const response = await this.withTimeout(
                this.callProviderForSector(prompt),
                LLM_TIMEOUT_MS
            );
            return {
                primary: response.seector || response.sector || "technology",
                confidence: this.clamp(response.confidence ?? 0.5)
            };
        } catch {
            return { primary: "technology", confidence: 0.3 };
        }
    }

    private async callProviderForSector(prompt: string): Promise<{ sector?: string; seector?: string; confidence: number }> {
        switch (this.provider) {
            case "groq":
                if (!this.groq) throw new Error("Groq not initialized");
                const groqRes = await this.groq.chat.completions.create({
                    model: "llama-4-scout-17b-16e-instruct",
                    messages: [{ role: "user", content: prompt }],
                    response_format: { type: "json_object" },
                    temperature: 0.2,
                });
                return JSON.parse(groqRes.choices[0].message.content || "{}");
            case "openai":
                if (!this.openai) throw new Error("OpenAI not initialized");
                const openaiRes = await this.openai.chat.completions.create({
                    model: "gpt-4.1",
                    messages: [{ role: "user", content: prompt }],
                    response_format: { type: "json_object" },
                    temperature: 0.2,
                });
                return JSON.parse(openaiRes.choices[0].message.content || "{}");
            case "anthropic":
                if (!this.anthropic) throw new Error("Anthropic not initialized");
                const anthropicRes = await this.anthropic.messages.create({
                    model: "claude-3-7-sonnet-latest",
                    max_tokens: 256,
                    messages: [{ role: "user", content: prompt }],
                });
                const text = anthropicRes.content[0].type === "text" ? anthropicRes.content[0].text : "";
                const match = text.match(/\{[\s\S]*\}/);
                return match ? JSON.parse(match[0]) : { sector: "technology", confidence: 0.3 };
            case "gemini":
                if (!this.gemini) throw new Error("Gemini not initialized");
                const geminiRes = await this.gemini.generateContent({
                    contents: [{ role: "user", parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
                });
                const geminiText = geminiRes.response.text();
                const geminiMatch = geminiText.match(/\{[\s\S]*\}/);
                return geminiMatch ? JSON.parse(geminiMatch[0]) : { sector: "technology", confidence: 0.3 };
            default:
                return { sector: "technology", confidence: 0.3 };
        }
    }
}
