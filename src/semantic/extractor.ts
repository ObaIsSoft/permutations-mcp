import Groq from "groq-sdk";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ContentTraits } from "../genome/types.js";

type LLMProvider = "groq" | "openai" | "anthropic" | "gemini";

const LLM_TIMEOUT_MS = 15_000;   // 15s hard timeout per attempt
const LLM_MAX_RETRIES = 3;       // Retry up to 3 times with backoff

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
    private provider: LLMProvider;

    constructor(apiKey?: string, provider?: LLMProvider) {
        const groqKey = process.env.GROQ_API_KEY;
        const openaiKey = process.env.OPENAI_API_KEY;
        const anthropicKey = process.env.ANTHROPIC_API_KEY;
        const geminiKey = process.env.GEMINI_API_KEY;

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
        } else {
            this.provider = "groq";
        }

        const key = apiKey || groqKey || openaiKey || anthropicKey || geminiKey;

        if (!key) {
            throw new Error(
                "No API key provided. Set one of: GROQ_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, or GEMINI_API_KEY"
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
            process.env.GEMINI_API_KEY
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
                    const delay = 500 * Math.pow(2, attempt - 1); // 500ms, 1000ms, 2000ms
                    console.error(`[extractor] Attempt ${attempt}/${LLM_MAX_RETRIES} failed, retrying in ${delay}ms:`, e?.message);
                    await new Promise(r => setTimeout(r, delay));
                }
            }
        }

        console.error(`[extractor] All ${LLM_MAX_RETRIES} attempts failed (${this.provider}):`, lastError?.message);
        // Neutral fallback — sequencer will still produce a valid genome
        return {
            informationDensity: 0.5,
            temporalUrgency: 0.5,
            emotionalTemperature: 0.5,
            playfulness: 0.5,
            spatialDependency: 0.5,
            trustRequirement: 0.5,
            visualEmphasis: 0.5,
            conversionFocus: 0.5,
        };
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
            default: throw new Error(`Unknown provider: ${this.provider}`);
        }
    }

    private buildPrompt(intent: string, projectContext?: string): string {
        return `You are a Semantic Trait Extractor for a parametric design system.
Analyze the following design intent and overarching project context, then map it to eight continuous trait vectors between 0.0 and 1.0.

Traits:
1. informationDensity: 0.1 (sparse, luxurious, minimal) to 0.9 (chaotic, data-heavy, dashboard)
2. temporalUrgency: 0.1 (timeless, archival, deep reading) to 0.9 (real-time, scanning, high-frequency)
3. emotionalTemperature: 0.1 (clinical, technical, brutalist) to 0.9 (warm, humanist, empathetic)
4. playfulness: 0.1 (strict, rigid, enterprise) to 0.9 (organic, whimsical, experimental)
5. spatialDependency: 0.1 (flat, Cartesian CSS, text-heavy) to 0.9 (immersive, WebGL, 3D particles, z-depth)
6. trustRequirement: 0.1 (casual, no credentials needed) to 0.9 (high-stakes, security-critical, requires proof)
7. visualEmphasis: 0.1 (text-first, minimal imagery) to 0.9 (image-dominant, photography-heavy, visual storytelling)
8. conversionFocus: 0.1 (purely informational, no CTA) to 0.9 (sales-heavy, e-commerce, aggressive CTA)

Immediate Intent: "${intent}"
Overarching Project Context: "${projectContext || "No additional context provided."}"

IMPORTANT V3 OVERRIDE RULE: If the immediate intent is a simple partial prompt like "build a pricing table", you MUST rely heavily on the Overarching Project Context to determine the aesthetic vectors (e.g. if the context is biological adaptation, the table MUST be extremely playful and spatial).

Respond ONLY with a valid JSON object matching this exact shape:
{
  "informationDensity": 0.5,
  "temporalUrgency": 0.5,
  "emotionalTemperature": 0.5,
  "playfulness": 0.5,
  "spatialDependency": 0.5,
  "trustRequirement": 0.3,
  "visualEmphasis": 0.3,
  "conversionFocus": 0.4
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

    private clamp(value: number): number {
        return Math.max(0, Math.min(1, value));
    }

    getProvider(): LLMProvider {
        return this.provider;
    }
}
