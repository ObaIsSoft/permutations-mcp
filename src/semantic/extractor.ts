import Groq from "groq-sdk";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ContentTraits } from "../genome/types.js";

type LLMProvider = "groq" | "openai" | "anthropic" | "gemini";

interface LLMResponse {
    informationDensity: number;
    temporalUrgency: number;
    emotionalTemperature: number;
    playfulness: number;
    spatialDependency: number;
}

export class SemanticTraitExtractor {
    private groq?: Groq;
    private openai?: OpenAI;
    private anthropic?: Anthropic;
    private gemini?: any; // GoogleGenerativeAI model instance
    private provider: LLMProvider;

    constructor(apiKey?: string, provider?: LLMProvider) {
        // Determine which key is available
        const groqKey = process.env.GROQ_API_KEY;
        const openaiKey = process.env.OPENAI_API_KEY;
        const anthropicKey = process.env.ANTHROPIC_API_KEY;
        const geminiKey = process.env.GEMINI_API_KEY;

        // Provider priority if not specified: Groq > OpenAI > Anthropic > Gemini
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
            this.provider = "groq"; // Default fallback (will error if no key)
        }

        const key = apiKey || groqKey || openaiKey || anthropicKey || geminiKey;

        if (!key) {
            throw new Error(
                "No API key provided. Set one of: GROQ_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, or GEMINI_API_KEY"
            );
        }

        // Initialize the appropriate client
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
                this.gemini = genAI.getGenerativeModel({ model: "gemini-2.5-pro-latest" }); // Best multimodal, 1M context, reasoning
                break;
        }
    }

    async extractTraits(intent: string, projectContext?: string): Promise<ContentTraits> {
        const prompt = this.buildPrompt(intent, projectContext);

        try {
            let result: LLMResponse;

            switch (this.provider) {
                case "groq":
                    result = await this.extractWithGroq(prompt);
                    break;
                case "openai":
                    result = await this.extractWithOpenAI(prompt);
                    break;
                case "anthropic":
                    result = await this.extractWithAnthropic(prompt);
                    break;
                case "gemini":
                    result = await this.extractWithGemini(prompt);
                    break;
                default:
                    throw new Error(`Unknown provider: ${this.provider}`);
            }

            return {
                informationDensity: this.clamp(result.informationDensity ?? 0.5),
                temporalUrgency: this.clamp(result.temporalUrgency ?? 0.5),
                emotionalTemperature: this.clamp(result.emotionalTemperature ?? 0.5),
                playfulness: this.clamp(result.playfulness ?? 0.5),
                spatialDependency: this.clamp(result.spatialDependency ?? 0.5),
                trustRequirement: 0.5,
                visualEmphasis: 0.5,
                conversionFocus: 0.5,
            };
        } catch (e) {
            console.error(`Trait extraction failed with ${this.provider}:`, e);
            // Return neutral traits as fallback
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
    }

    private buildPrompt(intent: string, projectContext?: string): string {
        return `You are a Semantic Trait Extractor for a parametric design system.
Analyze the following design intent and overarching project context, then map it to five continuous trait vectors between 0.0 and 1.0.

Traits:
1. informationDensity: 0.1 (sparse, luxurious, minimal) to 0.9 (chaotic, data-heavy, dashboard)
2. temporalUrgency: 0.1 (timeless, archival, deep reading) to 0.9 (real-time, scanning, high-frequency)
3. emotionalTemperature: 0.1 (clinical, technical, brutalist) to 0.9 (warm, humanist, empathetic)
4. playfulness: 0.1 (strict, rigid, enterprise) to 0.9 (organic, whimsical, experimental)
5. spatialDependency: 0.1 (flat, Cartesian CSS, text-heavy) to 0.9 (immersive, WebGL, 3D particles, z-depth)

Immediate Intent: "${intent}"
Overarching Project Context: "${projectContext || "No additional context provided."}"

IMPORTANT V3 OVERRIDE RULE: If the immediate intent is a simple partial prompt like "build a pricing table", you MUST rely heavily on the Overarching Project Context to determine the aesthetic vectors (e.g. if the context is biological adaptation, the table MUST be extremely playful and spatial).

Respond ONLY with a valid JSON object matching this exact shape:
{
  "informationDensity": 0.5,
  "temporalUrgency": 0.5,
  "emotionalTemperature": 0.5,
  "playfulness": 0.5,
  "spatialDependency": 0.5
}`;
    }

    private async extractWithGroq(prompt: string): Promise<LLMResponse> {
        if (!this.groq) throw new Error("Groq client not initialized");

        const response = await this.groq.chat.completions.create({
            model: "llama-4-scout-17b-16e-instruct", // Fast, 10M context, open source
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
            model: "gpt-4.1", // Best cost/performance, 1M context
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
            model: "claude-3-7-sonnet-latest", // Best for coding/reasoning
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }],
        });

        // Handle different content block types
        const content = response.content[0];
        let text = "";
        if (content.type === "text") {
            text = content.text;
        } else {
            throw new Error("Unexpected response type from Anthropic");
        }

        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No JSON found in Anthropic response");
        }

        return JSON.parse(jsonMatch[0]);
    }

    private async extractWithGemini(prompt: string): Promise<LLMResponse> {
        if (!this.gemini) throw new Error("Gemini client not initialized");

        const result = await this.gemini.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.2,
                responseMimeType: "application/json",
            },
        });

        const text = result.response.text();

        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No JSON found in Gemini response");
        }

        return JSON.parse(jsonMatch[0]);
    }

    private clamp(value: number): number {
        return Math.max(0, Math.min(1, value));
    }

    getProvider(): LLMProvider {
        return this.provider;
    }
}
