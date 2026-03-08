import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import pdfParse from 'pdf-parse';
export class EpigeneticParser {
    /**
     * Parses an array of absolute file paths (brand assets like PDFs and PNGs)
     * and extracts epigenetic constraints to feed into the genome engine.
     */
    async parseAssets(filePaths) {
        const data = {};
        const contextSegments = [];
        for (const filePath of filePaths) {
            try {
                if (!fs.existsSync(filePath)) {
                    console.warn(`[Epigenetics] File not found: ${filePath}`);
                    continue;
                }
                const ext = path.extname(filePath).toLowerCase();
                if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.svg') {
                    // Extract dominant color from image (Logo)
                    const hue = await this.extractHueFromImage(filePath);
                    if (hue !== undefined) {
                        data.epigeneticHue = hue;
                        console.log(`[Epigenetics] Extracted dominant hue ${hue} from ${path.basename(filePath)}`);
                    }
                }
                else if (ext === '.pdf') {
                    // Extract text context from PDF (Brand Guidelines)
                    const text = await this.extractTextFromPDF(filePath);
                    if (text) {
                        contextSegments.push(text);
                        console.log(`[Epigenetics] Extracted ${text.length} characters of brand context from ${path.basename(filePath)}`);
                    }
                }
                else {
                    console.warn(`[Epigenetics] Unsupported asset format: ${ext}`);
                }
            }
            catch (e) {
                console.error(`[Epigenetics] Failed to parse asset ${filePath}:`, e);
            }
        }
        if (contextSegments.length > 0) {
            // Take the first 5000 chars to avoid blowing up the LLM token limit
            data.brandContext = contextSegments.join(" | ").slice(0, 5000);
        }
        return data;
    }
    async extractHueFromImage(filePath) {
        try {
            const stats = await sharp(filePath).stats();
            const dominant = stats.dominant;
            if (!dominant)
                return undefined;
            return this.rgbToHue(dominant.r, dominant.g, dominant.b);
        }
        catch (e) {
            console.error(`Error analyzing image ${filePath}:`, e);
            return undefined;
        }
    }
    async extractTextFromPDF(filePath) {
        try {
            const dataBuffer = fs.readFileSync(filePath);
            const result = await pdfParse(dataBuffer);
            return result.text.trim();
        }
        catch (e) {
            console.error(`Error analyzing PDF ${filePath}:`, e);
            return undefined;
        }
    }
    // Mathematical formula to convert RGB to Hue [0, 360]
    rgbToHue(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        if (max === min) {
            return 0; // Grayscale has no hue
        }
        const d = max - min;
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
        return Math.round(h * 360);
    }
}
