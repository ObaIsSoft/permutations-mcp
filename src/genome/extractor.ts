/**
 * Permutations MCP - Content Extractor
 * 
 * Enhanced content analyzer with sector classification,
 * sub-sector detection, and brand asset extraction.
 */

import { PrimarySector, SubSector, ContentTraits, BrandConfiguration } from "./types.js";
import { SECTOR_PROFILES, classifySubSector } from "./sector-profiles.js";

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
 * Enhanced content analyzer with ML-style classification
 */
export class ContentExtractor {
    /**
     * Main entry point - analyze content and extract traits
     */
    analyze(content: string): ExtractionResult {
        try {
            const traits = this.extractTraits(content);
            const sector = this.classifySector(content, traits);
            const subSector = this.classifySubSector(content, sector.primary);
            const keywords = this.extractKeywords(content);
            const sentiment = this.analyzeSentiment(content);
            const suggestedStats = this.suggestStats(sector.primary);
            const trustSignals = this.identifyTrustSignals(content);
            
            return {
                success: true,
                content: {
                    traits,
                    sector,
                    subSector: {
                        classification: subSector.subSector,
                        confidence: subSector.confidence
                    },
                    keywords,
                    sentiment,
                    suggestedStats,
                    trustSignals
                }
            };
        } catch (error) {
            return {
                success: false,
                content: null,
                error: error instanceof Error ? error.message : "Unknown error"
            };
        }
    }
    
    /**
     * Extract content traits from text
     */
    private extractTraits(content: string): ContentTraits {
        const normalized = content.toLowerCase();
        const wordCount = content.split(/\s+/).length;
        const sentences = content.split(/[.!?]+/).length;
        
        // Information density (0-1)
        // Higher = more complex, data-rich, documentation
        const informationDensity = Math.min(1, 
            (wordCount > 1000 ? 0.3 : 0) +
            (normalized.includes('data') || normalized.includes('analytics') ? 0.2 : 0) +
            (normalized.includes('api') || normalized.includes('documentation') ? 0.3 : 0) +
            (sentences > 20 ? 0.1 : 0) +
            (normalized.includes('dashboard') || normalized.includes('metrics') ? 0.3 : 0) +
            (normalized.includes('features') || normalized.includes('services') ? 0.2 : 0)
        );
        
        // Temporal urgency (0-1)
        // Higher = time-sensitive, deadline-driven
        const temporalUrgency = Math.min(1,
            (normalized.includes('limited time') || normalized.includes('flash sale') ? 0.5 : 0) +
            (normalized.includes('now') || normalized.includes('today') ? 0.3 : 0) +
            (normalized.includes('deadline') || normalized.includes('expires') ? 0.4 : 0) +
            (normalized.includes('urgent') || normalized.includes('breaking') ? 0.5 : 0)
        );
        
        // Emotional temperature (0-1)
        // Higher = emotional, lifestyle, aspirational
        const emotionalTemperature = Math.min(1,
            (normalized.includes('transform') || normalized.includes('inspire') ? 0.3 : 0) +
            (normalized.includes('lifestyle') || normalized.includes('wellness') ? 0.4 : 0) +
            (normalized.includes('passion') || normalized.includes('love') ? 0.3 : 0) +
            (normalized.includes('dream') || normalized.includes('future') ? 0.2 : 0) +
            (normalized.includes('luxury') || normalized.includes('exclusive') ? 0.3 : 0)
        );
        
        // Playfulness (0-1)
        // Higher = creative, unconventional, fun
        const playfulness = Math.min(1,
            (normalized.includes('creative') || normalized.includes('innovative') ? 0.3 : 0) +
            (normalized.includes('fun') || normalized.includes('playful') ? 0.4 : 0) +
            (normalized.includes('unique') || normalized.includes('quirky') ? 0.3 : 0) +
            (normalized.includes('game') || normalized.includes('interactive') ? 0.3 : 0) +
            (wordCount < 200 ? 0.2 : 0) // Short content tends to be more playful
        );
        
        // Spatial dependency (0-1)
        // Higher = needs 3D, complex layouts, spatial awareness
        const spatialDependency = Math.min(1,
            (normalized.includes('3d') || normalized.includes('immersive') ? 0.5 : 0) +
            (normalized.includes('spatial') || normalized.includes('virtual') ? 0.4 : 0) +
            (normalized.includes('visualization') || normalized.includes('render') ? 0.4 : 0) +
            (normalized.includes('map') || normalized.includes('spatial') ? 0.3 : 0)
        );
        
        // Trust requirement (0-1)
        // Higher = needs trust signals, credentials, testimonials
        const trustRequirement = Math.min(1,
            (normalized.includes('doctor') || normalized.includes('medical') ? 0.5 : 0) +
            (normalized.includes('finance') || normalized.includes('banking') ? 0.5 : 0) +
            (normalized.includes('lawyer') || normalized.includes('legal') ? 0.4 : 0) +
            (normalized.includes('security') || normalized.includes('safe') ? 0.4 : 0) +
            (normalized.includes('certified') || normalized.includes('accredited') ? 0.3 : 0) +
            (normalized.includes('testimonial') || normalized.includes('review') ? 0.2 : 0) +
            (normalized.includes('insurance') || normalized.includes('guarantee') ? 0.3 : 0)
        );
        
        // Visual emphasis (0-1)
        // Higher = image-heavy, visual-first
        const visualEmphasis = Math.min(1,
            (normalized.includes('gallery') || normalized.includes('portfolio') ? 0.4 : 0) +
            (normalized.includes('visual') || normalized.includes('design') ? 0.3 : 0) +
            (normalized.includes('photo') || normalized.includes('image') ? 0.4 : 0) +
            (wordCount < 100 ? 0.3 : 0) // Visual-first sites have less text
        );
        
        // Conversion focus (0-1)
        // Higher = sales-focused, CTA-driven
        const conversionFocus = Math.min(1,
            (normalized.includes('buy') || normalized.includes('purchase') ? 0.4 : 0) +
            (normalized.includes('sale') || normalized.includes('discount') ? 0.4 : 0) +
            (normalized.includes('sign up') || normalized.includes('subscribe') ? 0.3 : 0) +
            (normalized.includes('free trial') || normalized.includes('demo') ? 0.3 : 0) +
            (normalized.includes('get started') || normalized.includes('order now') ? 0.4 : 0)
        );
        
        return {
            informationDensity,
            temporalUrgency,
            emotionalTemperature,
            playfulness,
            spatialDependency,
            trustRequirement,
            visualEmphasis,
            conversionFocus
        };
    }
    
    /**
     * Classify primary sector using keyword matching
     */
    private classifySector(content: string, traits: ContentTraits): { primary: PrimarySector; confidence: number } {
        const normalized = content.toLowerCase();
        const scores: Record<PrimarySector, number> = {
            healthcare: 0,
            fintech: 0,
            automotive: 0,
            education: 0,
            commerce: 0,
            entertainment: 0,
            manufacturing: 0,
            legal: 0,
            real_estate: 0,
            travel: 0,
            food: 0,
            sports: 0,
            technology: 0
        };
        
        // Keyword scoring
        const keywordScores: Record<string, PrimarySector[]> = {
            // Healthcare
            'health': ['healthcare'], 'medical': ['healthcare'], 'hospital': ['healthcare'], 'doctor': ['healthcare'],
            'clinic': ['healthcare'], 'wellness': ['healthcare'], 'patient': ['healthcare'], 'care': ['healthcare'],
            'therapy': ['healthcare'], 'surgery': ['healthcare'], 'mental health': ['healthcare'],
            
            // Fintech
            'finance': ['fintech'], 'banking': ['fintech'], 'payment': ['fintech'], 'investment': ['fintech'],
            'crypto': ['fintech'], 'wealth': ['fintech'], 'mortgage': ['fintech', 'real_estate'],
            'loan': ['fintech'], 'credit': ['fintech'], 'insurance': ['fintech'], 'tax': ['fintech'],
            
            // Automotive
            'car': ['automotive'], 'vehicle': ['automotive'], 'auto': ['automotive'], 'dealer': ['automotive'],
            'electric': ['automotive', 'technology'], 'automotive': ['automotive'], 'motor': ['automotive'],
            
            // Education
            'school': ['education'], 'university': ['education'], 'course': ['education'], 'learn': ['education'],
            'education': ['education'], 'academic': ['education'], 'student': ['education'], 'class': ['education'],
            'training': ['education'], 'certification': ['education'], 'degree': ['education'],
            
            // Commerce
            'shop': ['commerce'], 'store': ['commerce'], 'buy': ['commerce'], 'product': ['commerce'],
            'cart': ['commerce'], 'checkout': ['commerce'], 'ecommerce': ['commerce'], 'retail': ['commerce'],
            'marketplace': ['commerce'], 'catalog': ['commerce'],
            
            // Entertainment
            'movie': ['entertainment'], 'music': ['entertainment'], 'game': ['entertainment', 'sports'],
            'stream': ['entertainment'], 'video': ['entertainment'], 'entertainment': ['entertainment'],
            'media': ['entertainment'], 'netflix': ['entertainment'], 'spotify': ['entertainment'],
            
            // Manufacturing
            'manufacturing': ['manufacturing'], 'factory': ['manufacturing'], 'industrial': ['manufacturing'],
            'production': ['manufacturing'], 'machinery': ['manufacturing'], 'supply chain': ['manufacturing'],
            
            // Legal
            'law': ['legal'], 'attorney': ['legal'], 'lawyer': ['legal'],
            'litigation': ['legal'], 'court': ['legal'], 'contract': ['legal', 'fintech'],
            
            // Real Estate
            'property': ['real_estate'], 'real estate': ['real_estate'], 'house': ['real_estate'],
            'apartment': ['real_estate'], 'rent': ['real_estate'],
            'agent': ['real_estate'], 'broker': ['real_estate', 'fintech'], 'listing': ['real_estate'],
            
            // Travel
            'travel': ['travel'], 'hotel': ['travel'], 'flight': ['travel'], 'vacation': ['travel'],
            'booking': ['travel'], 'tour': ['travel'], 'destination': ['travel'], 'trip': ['travel'],
            
            // Food
            'restaurant': ['food'], 'food': ['food'], 'cafe': ['food'], 'menu': ['food'],
            'kitchen': ['food'], 'catering': ['food'], 'chef': ['food'], 'cuisine': ['food'],
            
            // Sports
            'sports': ['sports'], 'fitness': ['sports', 'healthcare'], 'gym': ['sports', 'healthcare'],
            'team': ['sports'], 'athletic': ['sports'], 'league': ['sports'], 'stadium': ['sports'],
            
            // Technology
            'software': ['technology'], 'tech': ['technology'], 'app': ['technology'],
            'platform': ['technology'], 'startup': ['technology'], 'saas': ['technology'],
            'cloud': ['technology'], 'ai': ['technology'], 'code': ['technology'], 'developer': ['technology'],
            'api': ['technology'], 'database': ['technology'], 'server': ['technology']
        };
        
        // Score keywords
        for (const [keyword, sectors] of Object.entries(keywordScores)) {
            if (normalized.includes(keyword)) {
                for (const sector of sectors) {
                    scores[sector] += 2;
                }
            }
        }
        
        // Trait-based scoring
        if (traits.informationDensity > 0.7 && traits.trustRequirement < 0.3) {
            scores.technology += 2;
        }
        if (traits.trustRequirement > 0.6) {
            scores.healthcare += 1;
            scores.fintech += 1;
            scores.legal += 1;
        }
        if (traits.conversionFocus > 0.7) {
            scores.commerce += 1;
            scores.real_estate += 1;
        }
        if (traits.emotionalTemperature > 0.6) {
            scores.entertainment += 1;
            scores.travel += 1;
            scores.food += 1;
        }
        
        // Find highest score
        let maxScore = 0;
        let primarySector: PrimarySector = 'technology';
        
        for (const [sector, score] of Object.entries(scores)) {
            if (score > maxScore) {
                maxScore = score;
                primarySector = sector as PrimarySector;
            }
        }
        
        // Calculate confidence (0-1)
        const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
        const confidence = totalScore > 0 ? maxScore / totalScore : 0.3;
        
        return { primary: primarySector, confidence };
    }
    
    /**
     * Classify sub-sector based on content
     */
    private classifySubSector(content: string, primarySector: PrimarySector): { subSector: SubSector; confidence: number } {
        // Use the sector profiles to classify
        return classifySubSector(content, primarySector);
    }
    
    /**
     * Extract keywords from content
     */
    private extractKeywords(content: string): string[] {
        const normalized = content.toLowerCase();
        const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
            'to', 'of', 'in', 'for', 'on', 'at', 'by', 'with', 'from', 'as', 'and', 'or', 'but']);
        
        const words = normalized.split(/\s+/)
            .map(w => w.replace(/[^a-z]/g, ''))
            .filter(w => w.length > 3 && !stopWords.has(w));
        
        // Count frequencies
        const frequencies: Record<string, number> = {};
        for (const word of words) {
            frequencies[word] = (frequencies[word] || 0) + 1;
        }
        
        // Return top 10
        return Object.entries(frequencies)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word]) => word);
    }
    
    /**
     * Analyze sentiment of content
     */
    private analyzeSentiment(content: string): { urgency: number; formality: number; confidence: number } {
        const normalized = content.toLowerCase();
        
        // Urgency
        const urgencyWords = ['now', 'today', 'immediately', 'urgent', 'hurry', 'limited', 'expires'];
        const urgencyCount = urgencyWords.filter(w => normalized.includes(w)).length;
        const urgency = Math.min(1, urgencyCount / 3);
        
        // Formality
        const formalWords = ['however', 'therefore', 'furthermore', 'consequently', 'pursuant', 'hereby'];
        const informalWords = ['hey', 'wow', 'cool', 'awesome', 'guys', 'folks'];
        const formalCount = formalWords.filter(w => normalized.includes(w)).length;
        const informalCount = informalWords.filter(w => normalized.includes(w)).length;
        const formality = Math.min(1, Math.max(0, 0.5 + (formalCount - informalCount) * 0.2));
        
        // Confidence (based on assertiveness)
        const confidentWords = ['best', 'top', 'leading', 'premier', 'guaranteed', 'proven'];
        const confidenceCount = confidentWords.filter(w => normalized.includes(w)).length;
        const confidence = Math.min(1, 0.3 + confidenceCount * 0.15);
        
        return { urgency, formality, confidence };
    }
    
    /**
     * Suggest statistics based on sector
     */
    private suggestStats(sector: PrimarySector): string[] {
        const statsMap: Record<PrimarySector, string[]> = {
            healthcare: ['patients', 'years of experience', 'satisfaction rate', 'awards'],
            fintech: ['transactions', 'users', 'uptime', 'countries served'],
            automotive: ['vehicles sold', 'dealer locations', 'customer satisfaction'],
            education: ['students', 'courses', 'graduation rate', 'years'],
            commerce: ['products', 'customers', 'shipping speed', 'return rate'],
            entertainment: ['subscribers', 'hours of content', 'ratings'],
            manufacturing: ['units produced', 'facilities', 'quality certifications'],
            legal: ['cases won', 'years in practice', 'attorneys'],
            real_estate: ['properties sold', 'agents', 'customer rating'],
            travel: ['destinations', 'travelers', 'positive reviews'],
            food: ['restaurants', 'meals served', 'rating'],
            sports: ['members', 'championships', 'facilities'],
            technology: ['users', 'integrations', 'uptime', 'performance']
        };
        
        return statsMap[sector] || ['customers', 'years of experience'];
    }
    
    /**
     * Identify trust signals in content
     */
    private identifyTrustSignals(content: string): string[] {
        const normalized = content.toLowerCase();
        const signals: string[] = [];
        
        if (normalized.includes('certified') || normalized.includes('accredited')) signals.push('certifications');
        if (normalized.includes('award') || normalized.includes('recognized')) signals.push('awards');
        if (normalized.includes('testimonial') || normalized.includes('review')) signals.push('testimonials');
        if (normalized.includes('security') || normalized.includes('encrypted')) signals.push('security badges');
        if (normalized.includes('insurance') || normalized.includes('guarantee')) signals.push('guarantees');
        if (normalized.includes('years') || normalized.includes('since')) signals.push('years in business');
        if (normalized.includes('customer') || normalized.includes('client')) signals.push('customer count');
        
        return signals;
    }
    
    /**
     * Extract brand colors from content (placeholder for now)
     * In production, this would analyze images, logos, and brand assets
     */
    extractBrandColors(content: string): { primary?: string; secondary?: string; accent?: string } {
        // Look for hex codes
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

// Singleton instance
export const contentExtractor = new ContentExtractor();
