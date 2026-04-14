import { chromium, type Browser, type Page } from "playwright";
import { spawn } from "child_process";
import { writeFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import * as crypto from "crypto";
import { getLimits } from '../config/limits.js';
import { logger } from '../logger.js';

export interface ComputedStyle {
    selector: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    borderRadius?: string;
    margin?: string;
    padding?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textAlign?: string;
    display?: string;
    gap?: string;
    transitionDuration?: string;
    animationDuration?: string;
}

export interface ExtractedGenome {
    url: string;
    sector: string;
    confidence: number;
    colors: {
        primary: string | null;
        secondary: string | null;
        background: string | null;
        surface: string | null;
        text: string | null;
        textMuted: string | null;
        accent: string | null;
        all: Array<{ value: string; frequency: number }>;
    };
    typography: {
        headingFont: string | null;
        bodyFont: string | null;
        baseSize: number;
        scaleRatio: number;
        lineHeight: number;
        letterSpacing: number;
        fontWeights: number[];
    };
    layout: {
        maxWidth: number;
        gridColumns: number;
        spacingBase: number;
        borderRadius: number;
        density: "compact" | "normal" | "spacious";
    };
    animation: {
        durationBase: number;
        easing: string;
        complexity: "minimal" | "functional" | "expressive";
    };
    rawCSS: string;
    computedStyles: ComputedStyle[];
    extractedAt: string;
}

interface ColorMatch {
    value: string;
    frequency: number;
    context: string[];
}

export class URLGenomeExtractor {
    private browser: Browser | null = null;

    async initBrowser(): Promise<void> {
        if (!this.browser) {
            // Try connecting to Lightpanda via CDP first if it's available
            try {
                this.browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
                logger.info("Connected to Lightpanda via CDP");
            } catch {
                // Fallback to standard Chromium launch
                this.browser = await chromium.launch({
                    headless: true,
                });
            }
        }
    }

    async closeBrowser(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    async extract(url: string, options?: { useScrapy?: boolean, useLightpanda?: boolean }): Promise<ExtractedGenome> {
        try {
            logger.info(`Extracting genome from URL: ${url}`);
            
            // Option 1: Lightpanda via CDP (if explicitly requested or available)
            if (options?.useLightpanda) {
                try {
                    await this.initBrowser();
                    // Connect logic is already inside initBrowser
                } catch (lpError) {
                    logger.warn("Lightpanda connection failed: " + (lpError instanceof Error ? lpError.message : String(lpError)));
                }
            }
            
            // Option 1: Use Scrapy if explicitly requested and available
            if (options?.useScrapy) {
                try {
                    return await this.extractWithScrapy(url);
                } catch (scrapyError) {
                    logger.warn("Scrapy failed: " + (scrapyError instanceof Error ? scrapyError.message : String(scrapyError)));
                    // Continue to other methods
                }
            }
            
            // Option 2: Try Playwright first for best results (JavaScript-rendered content)
            try {
                await this.initBrowser();
                const page = await this.browser!.newPage();
                const limits = getLimits();
                await page.goto(url, { waitUntil: "networkidle", timeout: limits.URL_FETCH_TIMEOUT_MS });
                await page.waitForTimeout(2000);
                
                const allCSS = await this.extractAllCSS(page);
                const computedStyles = await this.extractComputedStyles(page);
                
                await page.close();
                
                return this.buildGenome(url, allCSS, computedStyles);
            } catch (browserError) {
                logger.warn("Playwright browser failed, trying fallback: " + (browserError instanceof Error ? browserError.message : String(browserError)));
            }
            
            // Option 3: Try Scrapy if Playwright failed
            try {
                return await this.extractWithScrapy(url);
            } catch (scrapyError) {
                logger.warn("Scrapy not available, falling back to native fetch: " + (scrapyError instanceof Error ? scrapyError.message : String(scrapyError)));
            }
            
            // Option 4: Native fetch (last resort)
            return this.extractWithFetch(url);
        } catch (error) {
            logger.error(`Failed to extract genome from ${url}: ${(error instanceof Error ? error.message : String(error))}`);
            throw error;
        }
    }

    /**
     * Fallback extraction using native fetch (no browser required)
     * Gets static HTML/CSS only - no JavaScript-rendered content
     */
    private async extractWithFetch(url: string): Promise<ExtractedGenome> {
        logger.info(`Using native fetch fallback for: ${url}`);
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const html = await response.text();
        
        // Extract inline styles from HTML
        const allCSS = this.extractCSSFromHTML(html);
        
        // Create minimal computed styles from inline styles
        const computedStyles = this.inferStylesFromHTML(html);
        
        return this.buildGenome(url, allCSS, computedStyles);
    }

    /**
     * Python Scrapy-based extraction
     * Best for: Professional crawling, rate limiting, proxy support
     * Requires: Python + pip install scrapy
     */
    private async extractWithScrapy(url: string): Promise<ExtractedGenome> {
        logger.info(`Using Scrapy (Python) for: ${url}`);
        
        // Check if scrapy is available
        const pythonCmd = await this.findPython();
        if (!pythonCmd) {
            throw new Error("Python not found");
        }
        
        try {
            const limits = getLimits();
            await this.execCommand(pythonCmd, ["-c", "import scrapy"], { timeout: limits.URL_QUICK_TIMEOUT_MS });
        } catch {
            throw new Error("Scrapy not installed. Run: pip install scrapy");
        }
        
        const tempFile = join(tmpdir(), `scrapy_result_${Date.now()}_${crypto.randomBytes(4).toString("hex")}.json`);
        const tempScript = join(tmpdir(), `scrapy_spider_${Date.now()}.py`);
        
        const spiderCode = `
import json
import scrapy
from scrapy.crawler import CrawlerProcess

class CSSSpider(scrapy.Spider):
    name = 'css_spider'
    start_urls = ['${url}']
    
    custom_settings = {
        'LOG_ENABLED': False,
        'DOWNLOAD_DELAY': 0.5,
        'ROBOTSTXT_OBEY': True,
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    }
    
    def parse(self, response):
        css_parts = []
        
        # Extract inline styles
        for style in response.css('style::text').getall():
            css_parts.append(style)
        
        # Extract linked stylesheets (just note them - would need async fetch)
        for link in response.css('link[rel="stylesheet"]::attr(href)').getall():
            css_parts.append(f"/* External: {response.urljoin(link)} */")
        
        # Extract inline element styles
        for elem in response.css('[style]'):
            style_attr = elem.attrib.get('style', '')
            if style_attr:
                tag = elem.root.tag
                css_parts.append(f"{tag}[style] {{ {style_attr} }}")
        
        result = {
            'url': response.url,
            'css': '\\n'.join(css_parts),
            'html': response.text[:50000],
            'status': response.status,
        }
        
        with open('${tempFile}', 'w') as f:
            json.dump(result, f)

process = CrawlerProcess()
process.crawl(CSSSpider)
process.start()
`;
        
        try {
            await writeFile(tempScript, spiderCode);
            
            // Run Scrapy spider
            await this.execCommand(pythonCmd, [tempScript], { timeout: 60000 });
            
            // Read result
            const resultText = await import("fs/promises").then(fs => fs.readFile(tempFile, "utf-8"));
            const result = JSON.parse(resultText);
            
            // Cleanup
            await unlink(tempFile).catch(() => {});
            await unlink(tempScript).catch(() => {});
            
            const computedStyles = this.inferStylesFromHTML(result.html);
            return this.buildGenome(url, result.css, computedStyles);
            
        } catch (error) {
            await unlink(tempFile).catch(() => {});
            await unlink(tempScript).catch(() => {});
            throw error;
        }
    }

    private async findPython(): Promise<string | null> {
        const limits = getLimits();
        for (const cmd of ["python3", "python"]) {
            try {
                await this.execCommand(cmd, ["--version"], { timeout: limits.URL_QUICK_TIMEOUT_MS });
                return cmd;
            } catch {
                continue;
            }
        }
        return null;
    }

    private execCommand(cmd: string, args: string[], options?: { timeout?: number }): Promise<void> {
        return new Promise((resolve, reject) => {
            const proc = spawn(cmd, args, { 
                cwd: tmpdir(),
                timeout: options?.timeout 
            });
            
            let stderr = "";
            proc.stderr?.on("data", (data) => { stderr += data; });
            
            proc.on("close", (code) => {
                if (code === 0) resolve();
                else reject(new Error(`Exit ${code}: ${stderr}`));
            });
            
            proc.on("error", reject);
        });
    }

    private extractCSSFromHTML(html: string): string {
        let css = "";
        
        // Extract <style> tag contents
        const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
        let match;
        while ((match = styleRegex.exec(html)) !== null) {
            css += match[1] + "\n";
        }
        
        // Extract inline styles
        const inlineStyleRegex = /style="([^"]*)"/gi;
        while ((match = inlineStyleRegex.exec(html)) !== null) {
            css += `[style] { ${match[1]} }\n`;
        }
        
        return css;
    }

    private inferStylesFromHTML(html: string): ComputedStyle[] {
        const styles: ComputedStyle[] = [];
        
        // Simple pattern matching for common selectors
        const tagPattern = /<([a-z][a-z0-9]*)[^>]*>/gi;
        const seen = new Set<string>();
        let match;
        let index = 0;
        
        while ((match = tagPattern.exec(html)) !== null && index < 50) {
            const tag = match[1].toLowerCase();
            const attrs = match[0];
            
            const key = `${tag}-${index}`;
            if (seen.has(key)) continue;
            seen.add(key);
            
            const style: ComputedStyle = { selector: key };
            
            // Extract class-based hints
            const classMatch = attrs.match(/class="([^"]*)"/);
            const className = classMatch ? classMatch[1] : "";
            
            if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
                style.fontWeight = tag === 'h1' ? '700' : '600';
            }
            
            styles.push(style);
            index++;
        }
        
        return styles;
    }

    private buildGenome(url: string, allCSS: string, computedStyles: ComputedStyle[]): ExtractedGenome {
        const limits = getLimits();
        const colors = this.analyzeColors(allCSS, computedStyles);
        const typography = this.analyzeTypography(allCSS, computedStyles);
        const layout = this.analyzeLayout(allCSS, computedStyles);
        const animation = this.analyzeAnimation(allCSS);
        const sector = this.inferSector(url, allCSS, computedStyles);
        
        logger.info(`Genome extraction complete: ${colors.all.length} colors, ${computedStyles.length} styles`);
        
        return {
            url,
            sector,
            confidence: this.calculateConfidence(colors, typography, layout),
            colors,
            typography,
            layout,
            animation,
            rawCSS: allCSS.slice(0, limits.URL_CONTENT_MAX_CHARS),
            computedStyles: computedStyles.slice(0, 100),
            extractedAt: new Date().toISOString(),
        };
    }

    private async extractAllCSS(page: Page): Promise<string> {
        return page.evaluate(() => {
            let allCSS = "";
            
            document.querySelectorAll('style').forEach((style) => {
                allCSS += style.textContent + "\n";
            });
            
            document.querySelectorAll('[style]').forEach((el) => {
                const style = el.getAttribute('style');
                if (style) {
                    allCSS += `[style] { ${style} }\n`;
                }
            });
            
            return allCSS;
        });
    }

    private async extractComputedStyles(page: Page): Promise<ComputedStyle[]> {
        return page.evaluate(() => {
            const styles: ComputedStyle[] = [];
            const seen = new Set<string>();
            
            const rgbToHex = (rgb: string): string => {
                const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                if (!match) return rgb;
                
                const r = parseInt(match[1]).toString(16).padStart(2, '0');
                const g = parseInt(match[2]).toString(16).padStart(2, '0');
                const b = parseInt(match[3]).toString(16).padStart(2, '0');
                
                return `#${r}${g}${b}`.toLowerCase();
            };
            
            const elements = document.querySelectorAll(
                'h1, h2, h3, h4, h5, h6, p, a, button, input, nav, header, footer, main, section, article, div, span, li'
            );
            
            elements.forEach((el, index) => {
                const computed = window.getComputedStyle(el);
                const className = el.className || "";
                const id = el.id || "";
                const tag = el.tagName.toLowerCase();
                const selector = id ? `#${id}` : className ? `.${className.split(' ')[0]}` : tag;
                const key = `${selector}-${index}`;
                
                if (seen.has(key)) return;
                seen.add(key);
                
                const fontFamily = computed.fontFamily.split(',')[0].replace(/["']/g, '').trim();
                const color = rgbToHex(computed.color);
                const bgColor = rgbToHex(computed.backgroundColor);
                
                styles.push({
                    selector: key,
                    fontFamily: fontFamily !== "inherit" ? fontFamily : undefined,
                    fontSize: computed.fontSize,
                    fontWeight: computed.fontWeight,
                    color: color !== "#000000" ? color : undefined,
                    backgroundColor: bgColor !== "#00000000" && bgColor !== "#ffffff00" ? bgColor : undefined,
                    borderRadius: computed.borderRadius !== "0px" ? computed.borderRadius : undefined,
                    margin: computed.margin,
                    padding: computed.padding,
                    lineHeight: computed.lineHeight !== "normal" ? computed.lineHeight : undefined,
                    letterSpacing: computed.letterSpacing !== "normal" ? computed.letterSpacing : undefined,
                    textAlign: computed.textAlign !== "start" ? computed.textAlign : undefined,
                    display: computed.display !== "block" ? computed.display : undefined,
                    gap: computed.gap !== "0px" ? computed.gap : undefined,
                    transitionDuration: computed.transitionDuration !== "0s" ? computed.transitionDuration : undefined,
                    animationDuration: computed.animationDuration !== "0s" ? computed.animationDuration : undefined,
                });
            });
            
            return styles;
        });
    }

    private analyzeColors(css: string, computedStyles: ComputedStyle[]): ExtractedGenome["colors"] {
        // Match hex, rgb, rgba, hsl, and named colors
        const colorRegex = /#([a-fA-F0-9]{3,8})|rgb\(([^)]+)\)|rgba\(([^)]+)\)|hsl\(([^)]+)\)|(?<!-)(?:red|blue|green|white|black|yellow|cyan|magenta|gray|grey|orange|purple|pink|brown|lime|navy|teal|silver|gold|transparent)(?!-)/gi;
        const colorMap = new Map<string, { count: number; contexts: Set<string> }>();
        
        let match;
        while ((match = colorRegex.exec(css)) !== null) {
            let color = match[0].toLowerCase();
            
            // Expand shorthand hex
            if (color.startsWith("#") && color.length === 4) {
                color = "#" + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
            }
            
            // Convert named colors to hex
            color = this.normalizeNamedColor(color);
            
            const entry = colorMap.get(color) || { count: 0, contexts: new Set<string>() };
            entry.count++;
            
            const contextStart = Math.max(0, match.index - 50);
            const contextEnd = Math.min(css.length, match.index + match[0].length + 50);
            entry.contexts.add(css.slice(contextStart, contextEnd).replace(/\s+/g, ' '));
            
            colorMap.set(color, entry);
        }
        
        computedStyles.forEach((style) => {
            if (style.color) {
                const entry = colorMap.get(style.color.toLowerCase()) || { count: 0, contexts: new Set<string>() };
                entry.count += 2;
                entry.contexts.add(`computed: ${style.selector}`);
                colorMap.set(style.color.toLowerCase(), entry);
            }
            if (style.backgroundColor) {
                const entry = colorMap.get(style.backgroundColor.toLowerCase()) || { count: 0, contexts: new Set<string>() };
                entry.count += 2;
                entry.contexts.add(`bg: ${style.selector}`);
                colorMap.set(style.backgroundColor.toLowerCase(), entry);
            }
        });
        
        const sortedColors = Array.from(colorMap.entries())
            .sort((a, b) => b[1].count - a[1].count)
            .map(([value, data]) => ({
                value,
                frequency: data.count,
                context: Array.from(data.contexts).slice(0, 3),
            }));
        
        const all = sortedColors.map(({ value, frequency }) => ({ value, frequency }));
        
        const { primary, secondary, background, surface, text, textMuted, accent } = 
            this.categorizeColors(sortedColors);
        
        return {
            primary,
            secondary,
            background,
            surface,
            text,
            textMuted,
            accent,
            all,
        };
    }

    private categorizeColors(colors: Array<{ value: string; frequency: number; context: string[] }>): {
        primary: string | null;
        secondary: string | null;
        background: string | null;
        surface: string | null;
        text: string | null;
        textMuted: string | null;
        accent: string | null;
    } {
        const hexColors = colors
            .filter(c => c.value.startsWith("#"))
            .map(c => ({ ...c, hsl: this.hexToHSL(c.value) }));
        
        const backgrounds = hexColors.filter(c => 
            c.context.some(ctx => ctx.includes("background") || ctx.includes("bg:"))
        );
        
        const texts = hexColors.filter(c => 
            c.context.some(ctx => ctx.includes("color") || ctx.includes("computed:"))
        );
        
        const sorted = [...hexColors].sort((a, b) => b.frequency - a.frequency);
        
        const backgroundColor = backgrounds.find(c => c.hsl.l > 80)?.value || 
                               backgrounds.find(c => c.hsl.l > 50)?.value ||
                               sorted.find(c => c.hsl.l > 90)?.value || "#ffffff";
        
        const surfaceColor = backgrounds.find(c => c.hsl.l > 50 && c.hsl.l < 90)?.value ||
                            sorted.find(c => c.hsl.l > 70 && c.hsl.l < 95)?.value ||
                            this.lightenColor(backgroundColor, 5);
        
        const textColor = texts.find(c => c.hsl.l < 30)?.value ||
                         sorted.find(c => c.hsl.l < 20)?.value ||
                         "#1a1a1a";
        
        const accents = sorted.filter(c => {
            const hue = c.hsl.h;
            return (hue > 0 && hue < 60) || (hue > 120 && hue < 180) || (hue > 220 && hue < 280);
        });
        
        const primary = accents[0]?.value || "#3b82f6";
        const secondary = accents[1]?.value || this.adjustHue(primary, 30);
        const accent = accents[2]?.value || this.adjustHue(primary, -30);
        const textMuted = texts.find(c => {
            const l = this.hexToHSL(c.value).l;
            return l > 30 && l < 60;
        })?.value || this.mixColors(textColor, backgroundColor, 0.6);
        
        return {
            primary,
            secondary,
            background: backgroundColor,
            surface: surfaceColor,
            text: textColor,
            textMuted,
            accent,
        };
    }

    private analyzeTypography(css: string, computedStyles: ComputedStyle[]): ExtractedGenome["typography"] {
        const fontRegex = /font-family:\s*([^;]+)/g;
        const fonts = new Map<string, number>();
        
        let match;
        while ((match = fontRegex.exec(css)) !== null) {
            const font = match[1].split(',')[0].replace(/["']/g, '').trim();
            fonts.set(font, (fonts.get(font) || 0) + 1);
        }
        
        computedStyles.forEach((style) => {
            if (style.fontFamily) {
                fonts.set(style.fontFamily, (fonts.get(style.fontFamily) || 0) + 2);
            }
        });
        
        const sortedFonts = Array.from(fonts.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([name]) => name);
        
        const headingKeywords = ['h1', 'h2', 'h3', 'heading', 'title', 'display'];
        const bodyKeywords = ['body', 'p', 'text', 'content', 'main'];
        
        let headingFont = sortedFonts[0] || null;
        let bodyFont = sortedFonts[1] || headingFont;
        
        computedStyles.forEach((style) => {
            const selector = style.selector.toLowerCase();
            if (headingKeywords.some(k => selector.includes(k)) && style.fontFamily) {
                headingFont = style.fontFamily;
            }
            if (bodyKeywords.some(k => selector.includes(k)) && style.fontFamily) {
                bodyFont = style.fontFamily;
            }
        });
        
        const sizeValues: number[] = [];
        computedStyles.forEach((style) => {
            if (style.fontSize) {
                const px = this.parsePixelValue(style.fontSize);
                if (px > 0) sizeValues.push(px);
            }
        });
        
        const baseSize = sizeValues.length > 0 
            ? sizeValues.sort((a, b) => a - b)[Math.floor(sizeValues.length / 2)]
            : 16;
        
        const weights = computedStyles
            .map(s => parseInt(s.fontWeight || "400"))
            .filter(w => !isNaN(w) && w >= 100 && w <= 900);
        
        const uniqueWeights = [...new Set(weights)].sort((a, b) => a - b);
        
        const lineHeightValues = computedStyles
            .map(s => parseFloat(s.lineHeight || "1.5"))
            .filter(v => !isNaN(v) && v > 0.8 && v < 3);
        
        const avgLineHeight = lineHeightValues.length > 0
            ? lineHeightValues.reduce((a, b) => a + b, 0) / lineHeightValues.length
            : 1.6;
        
        const letterSpacingValues = computedStyles
            .map(s => this.parsePixelValue(s.letterSpacing || "0px"))
            .filter(v => !isNaN(v));
        
        const avgLetterSpacing = letterSpacingValues.length > 0
            ? letterSpacingValues.reduce((a, b) => a + b, 0) / letterSpacingValues.length
            : 0;
        
        return {
            headingFont,
            bodyFont,
            baseSize: Math.round(baseSize),
            scaleRatio: 1.25,
            lineHeight: Math.round(avgLineHeight * 100) / 100,
            letterSpacing: Math.round(avgLetterSpacing * 1000) / 1000,
            fontWeights: uniqueWeights.length > 0 ? uniqueWeights : [400, 600],
        };
    }

    private analyzeLayout(css: string, computedStyles: ComputedStyle[]): ExtractedGenome["layout"] {
        const maxWidthRegex = /max-width:\s*(\d+)px/g;
        const maxWidths: number[] = [];
        let match;
        while ((match = maxWidthRegex.exec(css)) !== null) {
            maxWidths.push(parseInt(match[1]));
        }
        
        const maxWidth = maxWidths.length > 0 
            ? Math.max(...maxWidths.filter(w => w < 2000))
            : 1200;
        
        const gridRegex = /grid-template-columns:\s*repeat\((\d+)/g;
        const grids: number[] = [];
        while ((match = gridRegex.exec(css)) !== null) {
            grids.push(parseInt(match[1]));
        }
        const gridColumns = grids.length > 0 ? Math.max(...grids) : 12;
        
        const spacingValues: number[] = [];
        computedStyles.forEach((style) => {
            if (style.padding) {
                const px = this.parsePixelValue(style.padding);
                if (px > 0) spacingValues.push(px);
            }
            if (style.margin) {
                const px = this.parsePixelValue(style.margin);
                if (px > 0 && px < 100) spacingValues.push(px);
            }
            if (style.gap) {
                const px = this.parsePixelValue(style.gap);
                if (px > 0) spacingValues.push(px);
            }
        });
        
        const spacingBase = spacingValues.length > 0
            ? spacingValues.sort((a, b) => a - b)[Math.floor(spacingValues.length / 4)]
            : 8;
        
        const radiusRegex = /border-radius:\s*(\d+)px/g;
        const radii: number[] = [];
        computedStyles.forEach((style) => {
            if (style.borderRadius) {
                const px = this.parsePixelValue(style.borderRadius);
                if (px >= 0) radii.push(px);
            }
        });
        while ((match = radiusRegex.exec(css)) !== null) {
            radii.push(parseInt(match[1]));
        }
        
        const avgRadius = radii.length > 0
            ? radii.reduce((a, b) => a + b, 0) / radii.length
            : 4;
        
        const density = spacingBase < 8 ? "compact" : spacingBase > 24 ? "spacious" : "normal";
        
        return {
            maxWidth,
            gridColumns,
            spacingBase: Math.round(spacingBase),
            borderRadius: Math.round(avgRadius),
            density,
        };
    }

    private analyzeAnimation(css: string): ExtractedGenome["animation"] {
        const durationRegex = /(?:transition|animation)-duration:\s*(\d+(?:\.\d+)?)(ms|s)/g;
        const durations: number[] = [];
        let match;
        
        while ((match = durationRegex.exec(css)) !== null) {
            const value = parseFloat(match[1]);
            const unit = match[2];
            durations.push(unit === "s" ? value * 1000 : value);
        }
        
        const easingRegex = /(?:transition-timing-function|animation-timing-function):\s*([^;]+)/g;
        const easings: Map<string, number> = new Map();
        while ((match = easingRegex.exec(css)) !== null) {
            const easing = match[1].trim();
            easings.set(easing, (easings.get(easing) || 0) + 1);
        }
        
        const avgDuration = durations.length > 0
            ? durations.reduce((a, b) => a + b, 0) / durations.length
            : 200;
        
        const sortedEasings = Array.from(easings.entries())
            .sort((a, b) => b[1] - a[1]);
        
        const easing = sortedEasings[0]?.[0] || "ease-out";
        
        const keyframeCount = (css.match(/@keyframes/g) || []).length;
        const transitionCount = (css.match(/transition:/g) || []).length;
        
        let complexity: "minimal" | "functional" | "expressive" = "functional";
        if (keyframeCount === 0 && transitionCount < 5) {
            complexity = "minimal";
        } else if (keyframeCount > 5 || transitionCount > 20) {
            complexity = "expressive";
        }
        
        return {
            durationBase: Math.round(avgDuration),
            easing,
            complexity,
        };
    }

    private inferSector(url: string, css: string, computedStyles: ComputedStyle[]): string {
        const urlLower = url.toLowerCase();
        const cssLower = css.toLowerCase();
        
        const sectorKeywords: Record<string, string[]> = {
            healthcare: ["health", "medical", "clinic", "hospital", "doctor", "patient", "care", "wellness"],
            fintech: ["bank", "finance", "money", "pay", "crypto", "invest", "trading", "loan", "credit"],
            ecommerce: ["shop", "store", "product", "cart", "buy", "price", "sale", "checkout"],
            education: ["learn", "course", "school", "university", "student", "academy", "edu"],
            saas: ["app", "software", "platform", "dashboard", "api", "solution"],
            media: ["news", "blog", "magazine", "media", "article", "journal"],
            hospitality: ["hotel", "restaurant", "food", "travel", "booking", "reservation"],
            realestate: ["property", "real estate", "home", "apartment", "rent", "mortgage"],
        };
        
        for (const [sector, keywords] of Object.entries(sectorKeywords)) {
            if (keywords.some(k => urlLower.includes(k) || cssLower.includes(k))) {
                return sector;
            }
        }
        
        const hasDashboard = computedStyles.some(s => 
            s.selector.includes("dashboard") || s.selector.includes("sidebar")
        );
        if (hasDashboard) return "saas";
        
        const hasProductGrid = cssLower.includes("product-grid") || cssLower.includes("product-card");
        if (hasProductGrid) return "ecommerce";
        
        return "generic";
    }

    private calculateConfidence(colors: any, typography: any, layout: any): number {
        let score = 0;
        let maxScore = 0;
        
        maxScore += 20;
        if (colors.primary && colors.background) score += 20;
        
        maxScore += 20;
        if (typography.headingFont && typography.bodyFont) score += 20;
        
        maxScore += 20;
        if (layout.maxWidth > 0) score += 20;
        
        maxScore += 20;
        if (colors.all.length > 3) score += 20;
        
        maxScore += 20;
        if (typography.fontWeights.length > 1) score += 20;
        
        return Math.round((score / maxScore) * 100);
    }

    private rgbToHex(rgb: string): string {
        const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return rgb;
        
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        
        return `#${r}${g}${b}`.toLowerCase();
    }

    private hexToHSL(hex: string): { h: number; s: number; l: number } {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;
        
        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        
        return { h: h * 360, s: s * 100, l: l * 100 };
    }

    private lightenColor(hex: string, percent: number): string {
        const hsl = this.hexToHSL(hex);
        hsl.l = Math.min(100, hsl.l + percent);
        return this.hslToHex(hsl);
    }

    private adjustHue(hex: string, degrees: number): string {
        const hsl = this.hexToHSL(hex);
        hsl.h = (hsl.h + degrees) % 360;
        if (hsl.h < 0) hsl.h += 360;
        return this.hslToHex(hsl);
    }

    private mixColors(color1: string, color2: string, weight: number): string {
        const r1 = parseInt(color1.slice(1, 3), 16);
        const g1 = parseInt(color1.slice(3, 5), 16);
        const b1 = parseInt(color1.slice(5, 7), 16);
        
        const r2 = parseInt(color2.slice(1, 3), 16);
        const g2 = parseInt(color2.slice(3, 5), 16);
        const b2 = parseInt(color2.slice(5, 7), 16);
        
        const r = Math.round(r1 * weight + r2 * (1 - weight));
        const g = Math.round(g1 * weight + g2 * (1 - weight));
        const b = Math.round(b1 * weight + b2 * (1 - weight));
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    private hslToHex({ h, s, l }: { h: number; s: number; l: number }): string {
        const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l / 100 - c / 2;
        
        let r = 0, g = 0, b = 0;
        
        if (h < 60) { r = c; g = x; b = 0; }
        else if (h < 120) { r = x; g = c; b = 0; }
        else if (h < 180) { r = 0; g = c; b = x; }
        else if (h < 240) { r = 0; g = x; b = c; }
        else if (h < 300) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }
        
        const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    private parsePixelValue(value: string): number {
        if (value.includes("rem")) {
            return parseFloat(value) * 16;
        }
        if (value.includes("em")) {
            return parseFloat(value) * 16;
        }
        const px = parseFloat(value);
        return isNaN(px) ? 0 : px;
    }

    private normalizeNamedColor(color: string): string {
        const namedColors: Record<string, string> = {
            red: "#ff0000",
            blue: "#0000ff",
            green: "#008000",
            white: "#ffffff",
            black: "#000000",
            yellow: "#ffff00",
            cyan: "#00ffff",
            magenta: "#ff00ff",
            gray: "#808080",
            grey: "#808080",
            orange: "#ffa500",
            purple: "#800080",
            pink: "#ffc0cb",
            brown: "#a52a2a",
            lime: "#00ff00",
            navy: "#000080",
            teal: "#008080",
            silver: "#c0c0c0",
            gold: "#ffd700",
            transparent: "#00000000",
        };
        
        return namedColors[color.toLowerCase()] || color;
    }
}

export const urlGenomeExtractor = new URLGenomeExtractor();
