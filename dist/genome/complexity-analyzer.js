export class ComplexityAnalyzer {
    // Keywords that boost complexity when detected in intent
    static COMPLEXITY_KEYWORDS = {
        // High impact (+0.15-0.20)
        'dashboard': 0.18,
        'platform': 0.20,
        'system': 0.18,
        'suite': 0.16,
        'application': 0.15,
        '3d': 0.18,
        'immersive': 0.16,
        'spatial': 0.15,
        'webgl': 0.17,
        'data visualization': 0.19,
        'real-time': 0.18,
        'live': 0.15,
        // Medium impact (+0.10-0.14)
        'animation': 0.12,
        'motion': 0.10,
        'physics': 0.12,
        'spring': 0.10,
        'multiplayer': 0.14,
        'collaborative': 0.13,
        'social': 0.11,
        'interactive': 0.10,
        'dynamic': 0.10,
        // Lower impact (+0.05-0.09)
        'component': 0.08,
        'library': 0.07,
        'modular': 0.06,
        'scalable': 0.06,
        'accessible': 0.08,
        'responsive': 0.05,
        'dark mode': 0.06,
        'theme': 0.05,
    };
    analyze(intent, context, traits) {
        const intent_lower = intent.toLowerCase();
        const context_lower = context.toLowerCase();
        // 1. Calculate base complexity from traits (normal range 0.3-0.6)
        const baseComplexity = this.calculateBaseComplexity(traits);
        // 2. Detect complexity keywords in intent
        const detectedKeywords = [];
        let keywordBoost = 0;
        for (const [keyword, boost] of Object.entries(ComplexityAnalyzer.COMPLEXITY_KEYWORDS)) {
            if (intent_lower.includes(keyword) || context_lower.includes(keyword)) {
                detectedKeywords.push(keyword);
                keywordBoost += boost;
            }
        }
        // Cap keyword boost at 0.5 (prevent guaranteed 1.0)
        keywordBoost = Math.min(0.5, keywordBoost);
        // 3. Calculate sophistication bonus from context quality
        const sophisticationFactors = [];
        let sophisticationBonus = 0;
        // Length bonus (detailed context = +0.05)
        if (context.length > 100) {
            sophisticationBonus += 0.05;
            sophisticationFactors.push('detailed_context');
        }
        // Multiple user types mentioned
        if (/user|admin|guest|customer|client/i.test(context)) {
            sophisticationBonus += 0.05;
            sophisticationFactors.push('user_types');
        }
        // Technical constraints specified
        if (/performance|speed|memory|bandwidth|load|cache/i.test(context)) {
            sophisticationBonus += 0.05;
            sophisticationFactors.push('technical_constraints');
        }
        // Design system references
        if (/design.system|tokens|components|pattern/i.test(context)) {
            sophisticationBonus += 0.05;
            sophisticationFactors.push('design_system');
        }
        // Accessibility requirements
        if (/accessibility|a11y|wcag|screen.reader|keyboard/i.test(context)) {
            sophisticationBonus += 0.05;
            sophisticationFactors.push('accessibility');
        }
        // Performance needs
        if (/60fps|animation|smooth|optimize/i.test(context)) {
            sophisticationBonus += 0.05;
            sophisticationFactors.push('performance');
        }
        // Cap sophistication bonus at 0.3
        sophisticationBonus = Math.min(0.3, sophisticationBonus);
        // 4. Calculate final complexity
        const intentMultiplier = 1 + keywordBoost;
        let finalComplexity = baseComplexity * intentMultiplier + sophisticationBonus;
        // Ensure we don't exceed 1.0
        finalComplexity = Math.min(1.0, finalComplexity);
        // 5. Determine tier
        const tier = this.determineTier(finalComplexity);
        return {
            baseComplexity,
            intentMultiplier,
            sophisticationBonus,
            finalComplexity,
            tier,
            detectedKeywords,
            sophisticationFactors
        };
    }
    calculateBaseComplexity(traits) {
        // Information density is the primary driver of complexity
        // Higher density = more components, more sophisticated layouts
        const densityFactor = traits.informationDensity * 0.4;
        // Spatial dependency adds 3D/complex layout requirements
        const spatialFactor = traits.spatialDependency * 0.2;
        // Playfulness adds animation/interaction complexity
        const playfulnessFactor = traits.playfulness * 0.15;
        // Emotional temperature affects theming complexity
        const emotionalFactor = traits.emotionalTemperature * 0.15;
        // Temporal urgency usually simplifies (get to the point)
        // But can add real-time complexity if very high
        const urgencyFactor = traits.temporalUrgency > 0.8
            ? 0.15 // Real-time features
            : 0.05;
        const base = densityFactor + spatialFactor + playfulnessFactor + emotionalFactor + urgencyFactor;
        // Normalize to 0.3-0.6 range for "normal" designs
        return Math.min(0.6, Math.max(0.3, base));
    }
    determineTier(complexity) {
        if (complexity >= 0.95)
            return 'advanced';
        if (complexity >= 0.85)
            return 'civilized';
        if (complexity >= 0.70)
            return 'sentient';
        if (complexity >= 0.50)
            return 'fauna';
        if (complexity >= 0.30)
            return 'flora';
        return 'microbial';
    }
    // Force minimum complexity for explicit civilization requests
    forceMinimumTier(intent, context, traits, minTier) {
        const analysis = this.analyze(intent, context, traits);
        const minComplexity = {
            'microbial': 0.0,
            'flora': 0.30,
            'fauna': 0.50,
            'sentient': 0.70,
            'civilized': 0.85,
            'advanced': 0.95
        }[minTier];
        if (analysis.finalComplexity < minComplexity) {
            // Boost complexity to reach minimum tier
            const boostNeeded = minComplexity - analysis.finalComplexity;
            analysis.finalComplexity = minComplexity;
            analysis.sophisticationBonus += boostNeeded;
            analysis.tier = minTier;
            analysis.sophisticationFactors.push('explicit_tier_request');
        }
        return analysis;
    }
}
