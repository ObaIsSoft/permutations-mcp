/**
 * Permutations MCP - Content Extractor (DEPRECATED)
 * 
 * This file is kept for backward compatibility.
 * Use SemanticTraitExtractor from semantic/extractor.ts instead.
 * 
 * @deprecated Use SemanticTraitExtractor for LLM-based extraction
 */

import { PrimarySector, SubSector, ContentTraits } from "./types.js";

export interface AnalyzedContent {
    traits: ContentTraits;
    sector: {
        primary: PrimarySector;
        confidence: number;
    };
    subSector: {
        classification: SubSector;
        confidence: number;
    };
    keywords: string[];
    sentiment: {
        urgency: number;
        formality: number;
        confidence: number;
    };
    suggestedStats: string[];
    trustSignals: string[];
}

export interface ExtractionResult {
    success: boolean;
    content: AnalyzedContent | null;
    error?: string;
}

/**
 * @deprecated Use SemanticTraitExtractor from semantic/extractor.ts
 */
export class ContentExtractor {
    analyze(_content: string): ExtractionResult {
        return {
            success: false,
            content: null,
            error: "ContentExtractor is deprecated. Use SemanticTraitExtractor from semantic/extractor.ts for LLM-based extraction."
        };
    }

    extractBrandColors(content: string): { primary?: string; secondary?: string; accent?: string } {
        const hexRegex = /#([0-9A-Fa-f]{6})/g;
        const hexCodes: string[] = [];
        let match;
        while ((match = hexRegex.exec(content)) !== null) {
            hexCodes.push(`#${match[1]}`);
        }
        
        if (hexCodes.length >= 2) {
            return {
                primary: hexCodes[0],
                secondary: hexCodes[1],
                accent: hexCodes[2]
            };
        }
        
        return {};
    }
}

/**
 * @deprecated Use SemanticTraitExtractor from semantic/extractor.ts
 */
export const contentExtractor = new ContentExtractor();
