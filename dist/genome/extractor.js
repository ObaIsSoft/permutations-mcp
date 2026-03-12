/**
 * Permutations MCP - Content Extractor (DEPRECATED)
 *
 * This file is kept for backward compatibility.
 * Use SemanticTraitExtractor from semantic/extractor.ts instead.
 *
 * @deprecated Use SemanticTraitExtractor for LLM-based extraction
 */
/**
 * @deprecated Use SemanticTraitExtractor from semantic/extractor.ts
 */
export class ContentExtractor {
    analyze(_content) {
        return {
            success: false,
            content: null,
            error: "ContentExtractor is deprecated. Use SemanticTraitExtractor from semantic/extractor.ts for LLM-based extraction."
        };
    }
    extractBrandColors(content) {
        const hexRegex = /#([0-9A-Fa-f]{6})/g;
        const hexCodes = [];
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
