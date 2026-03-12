import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
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
                    // File not found, skip
                    continue;
                }
                const ext = path.extname(filePath).toLowerCase();
                if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.svg') {
                    // Extract dominant color from image (Logo)
                    const hue = await this.extractHueFromImage(filePath);
                    if (hue !== undefined) {
                        data.epigeneticHue = hue;
                        // Extracted hue from image
                    }
                }
                else if (ext === '.pdf') {
                    // Extract text context from PDF (Brand Guidelines)
                    const text = await this.extractTextFromPDF(filePath);
                    if (text) {
                        contextSegments.push(text);
                        // Extracted text from PDF
                    }
                }
                else {
                    // Unsupported format, skip
                }
            }
            catch (e) {
                // Failed to parse asset
            }
        }
        if (contextSegments.length > 0) {
            // Take the first 5000 chars to avoid blowing up the LLM token limit
            data.brandContext = contextSegments.join(" | ").slice(0, 5000);
        }
        return data;
    }
    async extractTextFromPDF(filePath) {
        try {
            // Use pdf2json instead of pdf-parse (pdf-parse has a bug with missing test files)
            const PDFParser = (await import('pdf2json')).default;
            return new Promise((resolve, reject) => {
                const pdfParser = new PDFParser();
                pdfParser.on('pdfParser_dataReady', (pdfData) => {
                    // Extract text from all pages
                    let fullText = '';
                    if (pdfData.Pages) {
                        for (const page of pdfData.Pages) {
                            if (page.Texts) {
                                for (const textItem of page.Texts) {
                                    if (textItem.R) {
                                        for (const r of textItem.R) {
                                            if (r.T) {
                                                // URL decode the text (pdf2json encodes it)
                                                fullText += decodeURIComponent(r.T) + ' ';
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    resolve(fullText.trim() || undefined);
                });
                pdfParser.on('pdfParser_dataError', (err) => {
                    reject(err);
                });
                pdfParser.loadPDF(filePath);
            });
        }
        catch (e) {
            // Error analyzing PDF
            return undefined;
        }
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
            // Error analyzing image
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
