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
    /**
     * Deterministic complexity score from structural product properties.
     * Vocabulary-invariant: computed from what the product DOES, not how it's described.
     *
     * Weights calibrated so:
     *   simple landing page  → ~0.12  (prokaryotic)
     *   blog / portfolio     → ~0.16  (prokaryotic)
     *   workout tracker      → ~0.22  (protist)
     *   e-commerce           → ~0.82  (tribal)
     *   healthcare portal    → ~0.76  (endotherm_fauna)
     *   trading dashboard    → ~1.00  (singularity, capped)
     */
    static computeComplexityFromStructure(s) {
        let score = 0.10; // baseline — every product has some structure
        if (s.realtimeState)
            score += 0.15; // live data spikes architectural complexity
        if (s.sensitiveData)
            score += 0.18; // auth, compliance, encryption, trust signals
        if (s.multiRole)
            score += 0.12; // role-specific UI branches, permission guards
        if (s.financialTransactions)
            score += 0.10; // payment flows, receipts, security surface
        if (s.complexWorkflows)
            score += 0.08; // multi-step state machines, wizard routing
        if (s.deepNavigation)
            score += 0.06; // routing complexity, breadcrumbs, back-stacks
        if (s.externalIntegrations)
            score += 0.05; // API loading states, error handling, retries
        // Entity count — 1 entity = minimal, 10+ = high relational complexity
        score += Math.min(0.12, (s.entityCount / 10) * 0.12);
        // Screen count — 1 screen = trivial, 15+ screens = significant routing surface
        score += Math.min(0.08, (s.screenCount / 15) * 0.08);
        // Primary surface bonus
        if (s.primarySurface === 'data')
            score += 0.06; // data surfaces need more component depth
        else if (s.primarySurface === 'transaction')
            score += 0.04; // transactions need flow/validation
        return Math.min(1.0, score);
    }
    analyze(intent, context, traits, structural) {
        const intent_lower = intent.toLowerCase();
        const context_lower = context.toLowerCase();
        // 1. Base complexity — structural props (vocabulary-invariant) take priority over traits.
        // When structural is available, use deterministic computation from product behavior.
        // Falls back to trait-based scoring when structural analysis is not present.
        const baseComplexity = structural
            ? ComplexityAnalyzer.computeComplexityFromStructure(structural)
            : this.calculateBaseComplexity(traits);
        // 2. Keywords are a small additive nudge when intent is ambiguous.
        // They are NOT the primary pathway to higher tiers.
        // Cap at 0.12 so they can break a tie but not override traits.
        const detectedKeywords = [];
        let keywordBoost = 0;
        for (const [keyword, boost] of Object.entries(ComplexityAnalyzer.COMPLEXITY_KEYWORDS)) {
            if (intent_lower.includes(keyword) || context_lower.includes(keyword)) {
                detectedKeywords.push(keyword);
                keywordBoost += boost;
            }
        }
        keywordBoost = Math.min(0.12, keywordBoost);
        // 3. Sophistication bonus from context quality signals — additive, cap 0.08
        const sophisticationFactors = [];
        let sophisticationBonus = 0;
        if (context.length > 100) {
            sophisticationBonus += 0.02;
            sophisticationFactors.push('detailed_context');
        }
        if (/user|admin|guest|customer|client/i.test(context)) {
            sophisticationBonus += 0.02;
            sophisticationFactors.push('user_types');
        }
        if (/performance|speed|memory|bandwidth|load|cache/i.test(context)) {
            sophisticationBonus += 0.02;
            sophisticationFactors.push('technical_constraints');
        }
        if (/design.system|tokens|components|pattern/i.test(context)) {
            sophisticationBonus += 0.02;
            sophisticationFactors.push('design_system');
        }
        if (/accessibility|a11y|wcag|screen.reader|keyboard/i.test(context)) {
            sophisticationBonus += 0.02;
            sophisticationFactors.push('accessibility');
        }
        if (/60fps|animation|smooth|optimize/i.test(context)) {
            sophisticationBonus += 0.02;
            sophisticationFactors.push('performance');
        }
        sophisticationBonus = Math.min(0.08, sophisticationBonus);
        // 4. Final: traits are primary, keywords and sophistication are additive nudges.
        // intentMultiplier kept at 1.0 (no multiplication — traits already encode intent).
        const intentMultiplier = 1.0;
        let finalComplexity = baseComplexity + keywordBoost + sophisticationBonus;
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
        // All 8 LLM-extracted traits contribute. Weights sum to 1.0.
        // No artificial ceiling — traits drive the full 0.0–1.0 range.
        // Primary: how much content/data/features the product manages
        const densityFactor = traits.informationDensity * 0.30;
        // Auth, permissions, multi-role UI — trust surface adds real component complexity
        const trustFactor = traits.trustRequirement * 0.20;
        // Proportional urgency: real-time features spike architectural complexity
        const urgencyFactor = traits.temporalUrgency * 0.18;
        // 3D, spatial layouts, maps, canvas
        const spatialFactor = traits.spatialDependency * 0.12;
        // Animation, microinteraction richness
        const playfulnessFactor = traits.playfulness * 0.08;
        // Rich media, photography, illustration density
        const visualFactor = traits.visualEmphasis * 0.06;
        // Theming surface and brand expression complexity
        const emotionalFactor = traits.emotionalTemperature * 0.04;
        // Funnel and CTA density
        const conversionFactor = traits.conversionFocus * 0.02;
        const base = densityFactor + trustFactor + urgencyFactor + spatialFactor
            + playfulnessFactor + visualFactor + emotionalFactor + conversionFactor;
        // Minimum 0.10 — even the simplest intent has baseline structural needs
        return Math.max(0.10, base);
    }
    determineTier(complexity) {
        // Civilization tiers (0.81–1.00) — 6 tiers, emerge FROM ecosystem
        if (complexity >= 0.99)
            return 'singularity'; // 0.99–1.00
        if (complexity >= 0.97)
            return 'network'; // 0.97–0.98
        if (complexity >= 0.95)
            return 'empire'; // 0.95–0.96
        if (complexity >= 0.92)
            return 'nation_state'; // 0.92–0.94
        if (complexity >= 0.87)
            return 'city_state'; // 0.87–0.91
        if (complexity >= 0.81)
            return 'tribal'; // 0.81–0.86
        // Ecosystem tiers (0.00–0.80) — 8 tiers, biology before civilization
        if (complexity >= 0.74)
            return 'endotherm_fauna'; // 0.74–0.80 — warm-blooded, all chromosomes active
        if (complexity >= 0.66)
            return 'ectotherm_fauna'; // 0.66–0.73 — cold-blooded, mobile consumers
        if (complexity >= 0.57)
            return 'invertebrate_fauna'; // 0.57–0.65 — first fauna, simple nervous systems
        if (complexity >= 0.45)
            return 'vascular_flora'; // 0.45–0.56 — rooted, complex internal structure
        if (complexity >= 0.34)
            return 'bryophyte'; // 0.34–0.44 — non-vascular, simple containers
        if (complexity >= 0.23)
            return 'protist'; // 0.23–0.33 — unicellular eukaryotes, basic interaction
        if (complexity >= 0.11)
            return 'prokaryotic'; // 0.11–0.22 — first cells, minimal structure
        return 'abiotic'; // 0.00–0.10 — no life, environment only
    }
    // Force minimum complexity for explicit civilization requests
    forceMinimumTier(intent, context, traits, minTier) {
        const analysis = this.analyze(intent, context, traits);
        const TIER_FLOOR = {
            'abiotic': 0.00,
            'prokaryotic': 0.11,
            'protist': 0.23,
            'bryophyte': 0.34,
            'vascular_flora': 0.45,
            'invertebrate_fauna': 0.57,
            'ectotherm_fauna': 0.66,
            'endotherm_fauna': 0.74,
            'tribal': 0.81,
            'city_state': 0.87,
            'nation_state': 0.92,
            'empire': 0.95,
            'network': 0.97,
            'singularity': 0.99,
        };
        const minComplexity = TIER_FLOOR[minTier];
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
