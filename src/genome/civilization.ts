import { DesignGenome, ContentTraits, StateTopology, RoutingPattern, TokenInheritance } from "./types.js";
import { ComplexityAnalyzer, ComplexityAnalysis } from "./complexity-analyzer.js";
import { EcosystemGenome } from "./ecosystem-types.js";
import { CivilizationGenome } from "./civilization-types.js";
import { sequenceCivilizationGenome } from "./civilization-sequencer.js";
import { getLimits } from '../config/limits.js';
import { CIVILIZATION_COMPLEXITY_THRESHOLDS, CIVILIZATION_COMPONENT_COUNTS, CIVILIZATION_MODULES } from '../constants.js';

// ── Civilization genome → architecture mappings ──────────────────────────────

const GOVERNANCE_TO_STATE: Record<string, StateTopology> = {
    centralized:  'local',
    federated:    'distributed',
    democratic:   'shared_context',
    theocratic:   'local',
    oligarchic:   'shared_context',
    anarchic:     'distributed',
    militaristic: 'reactive_store',
    technocratic: 'reactive_store',
};

const KNOWLEDGE_TO_ROUTING: Record<string, RoutingPattern> = {
    centralized: 'single_page',
    distributed: 'federated',
    oral:        'multi_page',
    recorded:    'platform',
    emergent:    'platform',
};

// [min, max] inclusive range — communicates that actual counts vary with content complexity
export type TierRange = [number, number];

// Tier-specific output types

export interface ComponentSpec {
    name: string;
    category: 'layout' | 'input' | 'feedback' | 'navigation' | 'data' | 'overlay' | 'media';
    props: Array<{ name: string; type: string; required: boolean; default?: any }>;
    variants: string[];
    composition?: boolean;
    compound?: string[];
    accessibility: {
        role: string;
        ariaProps: string[];
        keyboard: string[];
    };
}

export interface AnimationSystem {
    physics: 'simple' | 'spring' | 'advanced' | 'custom-engine';
    types: string[];
    choreography: 'sequential' | 'staggered' | 'responsive-to-user' | 'procedural';
    reducedMotion: 'ignore' | 'reduce' | 'respect' | 'alternative';
    mlOptimized?: boolean;
}

export interface ArchitectureSpec {
    pattern: 'component-based' | 'layered' | 'micro-frontend' | 'fractal';
    layers?: string[];
    modules: number | 'dynamic';
    stateTopology: StateTopology;
    routingPattern: RoutingPattern;
    tokenInheritance: TokenInheritance;
    edge?: boolean;
}

export interface DesignTokenSystem {
    count: TierRange | 'semantic-graph';
    themes: TierRange | 'adaptive';
    modes: string[] | 'contextual';
    semanticTokens: boolean;
    generative?: boolean;
}

export interface InteractionSystem {
    gestures: string[] | 'predictive';
    keyboard: 'basic' | 'full' | 'command-palette';
    focus: 'none' | 'basic' | 'managed';
    voice?: boolean;
    haptic?: boolean;
}

export interface CivilizationTier {
    tier: 'tribal' | 'city_state' | 'nation_state' | 'empire' | 'network' | 'singularity';
    complexity: number;
    /** Layer 3 genome — present when ecosystemGenome was supplied to generate() */
    civilizationGenome?: CivilizationGenome;
    architecture: ArchitectureSpec;
    components: {
        count: TierRange | 'generative';
        list: ComponentSpec[];
    };
    animations: AnimationSystem;
    designSystem: DesignTokenSystem;
    interactions: InteractionSystem;
    ai?: {
        layout?: boolean;
        content?: boolean;
        personalization?: boolean;
    };
}

export class CivilizationGenerator {
    private complexityAnalyzer: ComplexityAnalyzer;

    constructor() {
        this.complexityAnalyzer = new ComplexityAnalyzer();
    }

    generate(
        intent: string,
        context: string,
        traits: ContentTraits,
        genome?: DesignGenome,
        minTier?: CivilizationTier['tier'],
        ecosystemGenome?: EcosystemGenome
    ): CivilizationTier {
        // minTier must be a civilization tier — reject ecosystem tiers at call site
        const civMinTier = minTier as ComplexityAnalysis['tier'] | undefined;

        const analysis = civMinTier
            ? this.complexityAnalyzer.forceMinimumTier(intent, context, traits, civMinTier)
            : this.complexityAnalyzer.analyze(intent, context, traits);

        // Civilization requires at least tribal tier (0.81+)
        if (analysis.finalComplexity < CIVILIZATION_COMPLEXITY_THRESHOLDS.tribal) {
            throw new Error(
                `Complexity ${analysis.finalComplexity.toFixed(2)} is below civilization threshold (${CIVILIZATION_COMPLEXITY_THRESHOLDS.tribal}). ` +
                `Current tier: ${analysis.tier}. ` +
                `Add sophistication keywords (dashboard, platform, real-time, collaborative) ` +
                `or specify minTier: 'tribal' to force it.`
            );
        }

        const result = this.generateTier(analysis, genome);

        // Layer 3: sequence civilization genome from ecosystem genome and apply overrides
        if (ecosystemGenome) {
            const civGenome = sequenceCivilizationGenome(ecosystemGenome);
            result.civilizationGenome = civGenome;
            // Governance model drives state topology; knowledge model drives routing pattern
            const stateOverride = GOVERNANCE_TO_STATE[civGenome.chromosomes.civ_ch2_governance.model];
            const routingOverride = KNOWLEDGE_TO_ROUTING[civGenome.chromosomes.civ_ch7_knowledge.model];
            if (stateOverride) result.architecture.stateTopology = stateOverride;
            if (routingOverride) result.architecture.routingPattern = routingOverride;
        }

        return result;
    }

    private generateTier(analysis: ComplexityAnalysis, genome?: DesignGenome): CivilizationTier {
        switch (analysis.tier) {
            case 'tribal':      return this.generateTribalTier(analysis, genome);
            case 'city_state':  return this.generateCityStateTier(analysis, genome);
            case 'nation_state':return this.generateNationStateTier(analysis, genome);
            case 'empire':      return this.generateEmpireTier(analysis, genome);
            case 'network':     return this.generateNetworkTier(analysis, genome);
            case 'singularity': return this.generateSingularityTier(analysis, genome);
            default:
                throw new Error(`Cannot generate civilization for ecosystem tier: ${analysis.tier}`);
        }
    }

    // ── HELPER: read ch30–ch32 from genome, capped to the tier's allowed values ──────

    private resolveStateTopology(
        genome: DesignGenome | undefined,
        allowed: StateTopology[]
    ): StateTopology {
        const raw = genome?.chromosomes.ch30_state_topology?.topology;
        if (raw && allowed.includes(raw)) return raw;
        return allowed[allowed.length - 1]; // default to most expressive allowed
    }

    private resolveRoutingPattern(
        genome: DesignGenome | undefined,
        allowed: RoutingPattern[]
    ): RoutingPattern {
        const raw = genome?.chromosomes.ch31_routing_pattern?.pattern;
        if (raw && allowed.includes(raw)) return raw;
        return allowed[allowed.length - 1];
    }

    private resolveTokenInheritance(
        genome: DesignGenome | undefined,
        allowed: TokenInheritance[]
    ): TokenInheritance {
        const raw = genome?.chromosomes.ch32_token_inheritance?.inheritance;
        if (raw && allowed.includes(raw)) return raw;
        return allowed[allowed.length - 1];
    }

    // ── TRIBAL (0.81–0.86) ─────────────────────────────────────────────────────────
    // First settlement — component library crystallises from ecosystem organisms.
    // Single surface, local state, simple navigation, flat tokens.
    private generateTribalTier(analysis: ComplexityAnalysis, genome?: DesignGenome): CivilizationTier {
        return {
            tier: 'tribal',
            complexity: analysis.finalComplexity,
            architecture: {
                pattern: 'component-based',
                modules: CIVILIZATION_MODULES.tribal,
                stateTopology: this.resolveStateTopology(genome, ['local']),
                routingPattern: this.resolveRoutingPattern(genome, ['single_page', 'multi_page']),
                tokenInheritance: this.resolveTokenInheritance(genome, ['flat', 'semantic'])
            },
            components: {
                count: asTierRange(CIVILIZATION_COMPONENT_COUNTS.tribal),
                list: this.generateComponentLibrary('tribal')
            },
            animations: {
                physics: 'simple',
                types: ['fade', 'slide'],
                choreography: 'sequential',
                reducedMotion: 'reduce'
            },
            designSystem: {
                count: [18, 28],
                themes: [1, 1],
                modes: ['light'],
                semanticTokens: false
            },
            interactions: {
                gestures: ['click', 'hover', 'focus'],
                keyboard: 'basic',
                focus: 'basic'
            }
        };
    }

    // ── CITY-STATE (0.87–0.91) ─────────────────────────────────────────────────────
    // Governed settlement — shared context lifts state, routes proliferate,
    // light/dark modes appear, semantic tokens emerge.
    private generateCityStateTier(analysis: ComplexityAnalysis, genome?: DesignGenome): CivilizationTier {
        return {
            tier: 'city_state',
            complexity: analysis.finalComplexity,
            architecture: {
                pattern: 'component-based',
                layers: ['view', 'logic'],
                modules: CIVILIZATION_MODULES.cityState,
                stateTopology: this.resolveStateTopology(genome, ['local', 'shared_context']),
                routingPattern: this.resolveRoutingPattern(genome, ['single_page', 'multi_page', 'protected']),
                tokenInheritance: this.resolveTokenInheritance(genome, ['flat', 'semantic'])
            },
            components: {
                count: asTierRange(CIVILIZATION_COMPONENT_COUNTS.cityState),
                list: this.generateComponentLibrary('city_state')
            },
            animations: {
                physics: 'spring',
                types: ['fade', 'slide', 'scale', 'spring'],
                choreography: 'sequential',
                reducedMotion: 'respect'
            },
            designSystem: {
                count: [28, 45],
                themes: [1, 2],
                modes: ['light', 'dark'],
                semanticTokens: true
            },
            interactions: {
                gestures: ['click', 'hover', 'focus'],
                keyboard: 'basic',
                focus: 'basic'
            }
        };
    }

    // ── NATION-STATE (0.92–0.94) ───────────────────────────────────────────────────
    // Organised society — reactive store, protected routes, component-scoped tokens,
    // full keyboard access, staggered animation choreography.
    private generateNationStateTier(analysis: ComplexityAnalysis, genome?: DesignGenome): CivilizationTier {
        return {
            tier: 'nation_state',
            complexity: analysis.finalComplexity,
            architecture: {
                pattern: 'layered',
                layers: ['presentation', 'domain', 'data'],
                modules: CIVILIZATION_MODULES.nationState,
                stateTopology: this.resolveStateTopology(genome, ['local', 'shared_context', 'reactive_store']),
                routingPattern: this.resolveRoutingPattern(genome, ['multi_page', 'protected', 'platform']),
                tokenInheritance: this.resolveTokenInheritance(genome, ['flat', 'semantic', 'component'])
            },
            components: {
                count: asTierRange(CIVILIZATION_COMPONENT_COUNTS.nationState),
                list: this.generateComponentLibrary('nation_state')
            },
            animations: {
                physics: 'spring',
                types: ['fade', 'slide', 'scale', 'spring', 'stagger'],
                choreography: 'staggered',
                reducedMotion: 'respect'
            },
            designSystem: {
                count: [45, 65],
                themes: [2, 3],
                modes: ['light', 'dark', 'high-contrast'],
                semanticTokens: true
            },
            interactions: {
                gestures: ['click', 'hover', 'swipe', 'focus'],
                keyboard: 'full',
                focus: 'managed'
            }
        };
    }

    // ── EMPIRE (0.95–0.96) ─────────────────────────────────────────────────────────
    // Distributed governance — micro-frontend architecture, distributed state,
    // platform routing (shell + remotes), governed token system.
    private generateEmpireTier(analysis: ComplexityAnalysis, genome?: DesignGenome): CivilizationTier {
        return {
            tier: 'empire',
            complexity: analysis.finalComplexity,
            architecture: {
                pattern: 'micro-frontend',
                layers: ['shell', 'feature', 'shared', 'platform'],
                modules: CIVILIZATION_MODULES.empire,
                stateTopology: this.resolveStateTopology(genome, ['shared_context', 'reactive_store', 'distributed']),
                routingPattern: this.resolveRoutingPattern(genome, ['protected', 'platform', 'federated']),
                tokenInheritance: this.resolveTokenInheritance(genome, ['semantic', 'component', 'governed']),
                edge: true
            },
            components: {
                count: asTierRange(CIVILIZATION_COMPONENT_COUNTS.empire),
                list: this.generateComponentLibrary('empire')
            },
            animations: {
                physics: 'advanced',
                types: ['spring', 'morph', 'particle', 'stagger'],
                choreography: 'staggered',
                reducedMotion: 'alternative'
            },
            designSystem: {
                count: [75, 100],
                themes: [2, 4],
                modes: ['light', 'dark', 'high-contrast', 'print'],
                semanticTokens: true,
                generative: true
            },
            interactions: {
                gestures: ['swipe', 'pinch', 'hover', 'drag', 'long-press'],
                keyboard: 'full',
                focus: 'managed'
            }
        };
    }

    // ── NETWORK (0.97–0.98) ────────────────────────────────────────────────────────
    // Federated civilisation — real-time, edge-first, cross-app state federation,
    // module-federation routing, cross-system design token contract.
    private generateNetworkTier(analysis: ComplexityAnalysis, genome?: DesignGenome): CivilizationTier {
        return {
            tier: 'network',
            complexity: analysis.finalComplexity,
            architecture: {
                pattern: 'micro-frontend',
                layers: ['shell', 'feature', 'shared', 'platform', 'edge'],
                modules: CIVILIZATION_MODULES.network,
                stateTopology: this.resolveStateTopology(genome, ['reactive_store', 'distributed', 'federated']),
                routingPattern: this.resolveRoutingPattern(genome, ['platform', 'federated']),
                tokenInheritance: this.resolveTokenInheritance(genome, ['component', 'governed', 'cross_system']),
                edge: true
            },
            components: {
                count: asTierRange(CIVILIZATION_COMPONENT_COUNTS.network),
                list: this.generateComponentLibrary('network')
            },
            animations: {
                physics: 'advanced',
                types: ['spring', 'morph', 'particle', 'procedural', 'physics-sim'],
                choreography: 'responsive-to-user',
                reducedMotion: 'alternative'
            },
            designSystem: {
                count: asTierRange(CIVILIZATION_COMPONENT_COUNTS.singularity),
                themes: [3, 6],
                modes: ['light', 'dark', 'high-contrast', 'print', 'motion-reduced'],
                semanticTokens: true,
                generative: true
            },
            interactions: {
                gestures: ['swipe', 'pinch', 'drag', 'multi-touch', 'long-press', 'hover'],
                keyboard: 'command-palette',
                focus: 'managed',
                haptic: true
            }
        };
    }

    // ── SINGULARITY (0.99–1.00) ────────────────────────────────────────────────────
    // Post-civilisation — generative components, federated state, intent-based
    // routing, adaptive cross-system token graph, ML-driven personalisation.
    private generateSingularityTier(analysis: ComplexityAnalysis, genome?: DesignGenome): CivilizationTier {
        return {
            tier: 'singularity',
            complexity: analysis.finalComplexity,
            architecture: {
                pattern: 'fractal',
                layers: ['intent', 'generation', 'surface', 'data', 'edge'],
                modules: 'dynamic',
                stateTopology: this.resolveStateTopology(genome, ['distributed', 'federated']),
                routingPattern: this.resolveRoutingPattern(genome, ['platform', 'federated']),
                tokenInheritance: this.resolveTokenInheritance(genome, ['governed', 'cross_system']),
                edge: true
            },
            components: {
                count: 'generative',
                list: this.generateComponentLibrary('singularity')
            },
            animations: {
                physics: 'custom-engine',
                types: ['procedural', 'physics-sim', 'ml-driven', 'reactive'],
                choreography: 'procedural',
                reducedMotion: 'alternative',
                mlOptimized: true
            },
            designSystem: {
                count: 'semantic-graph',
                themes: 'adaptive',
                modes: 'contextual',
                semanticTokens: true,
                generative: true
            },
            interactions: {
                gestures: 'predictive',
                keyboard: 'command-palette',
                focus: 'managed',
                voice: true,
                haptic: true
            },
            ai: {
                layout: true,
                content: true,
                personalization: true
            }
        };
    }

    private generateComponentLibrary(tier: CivilizationTier['tier']): ComponentSpec[] {
        const base: ComponentSpec[] = [
            {
                name: 'Button',
                category: 'input',
                props: [
                    { name: 'variant', type: '"primary" | "secondary" | "ghost"', required: false, default: '"primary"' },
                    { name: 'size',    type: '"sm" | "md" | "lg"',               required: false, default: '"md"' },
                    { name: 'disabled',type: 'boolean',                          required: false, default: false },
                    { name: 'onClick', type: '() => void',                       required: false }
                ],
                variants: ['primary', 'secondary', 'ghost', 'danger'],
                accessibility: { role: 'button', ariaProps: ['aria-disabled', 'aria-pressed'], keyboard: ['Enter', 'Space'] }
            },
            {
                name: 'Card',
                category: 'layout',
                props: [
                    { name: 'elevation',   type: 'number',  required: false, default: 1 },
                    { name: 'interactive', type: 'boolean', required: false, default: false }
                ],
                variants: ['default', 'elevated', 'outlined'],
                accessibility: { role: 'article', ariaProps: ['aria-label'], keyboard: [] }
            },
            {
                name: 'Input',
                category: 'input',
                props: [
                    { name: 'type',     type: '"text" | "email" | "password"',  required: false, default: '"text"' },
                    { name: 'value',    type: 'string',                         required: true },
                    { name: 'onChange', type: '(value: string) => void',        required: true },
                    { name: 'error',    type: 'string',                         required: false }
                ],
                variants: ['default', 'error', 'disabled'],
                accessibility: { role: 'textbox', ariaProps: ['aria-invalid', 'aria-errormessage', 'aria-required'], keyboard: ['Tab', 'Enter'] }
            }
        ];

        if (tier === 'tribal') {
            return [
                ...base,
                this.createNavComponent(),
                this.createToastComponent(),
                this.createTooltipComponent()
            ];
        }

        if (tier === 'city_state') {
            return [
                ...base,
                this.createNavComponent(),
                this.createModalComponent(),
                this.createDropdownComponent(),
                this.createToastComponent(),
                this.createTooltipComponent()
            ];
        }

        if (tier === 'nation_state') {
            return [
                ...base,
                this.createNavComponent(),
                this.createModalComponent(),
                this.createDropdownComponent(),
                this.createTabsComponent(),
                this.createAccordionComponent(),
                this.createToastComponent(),
                this.createTooltipComponent()
            ];
        }

        if (tier === 'empire') {
            return [
                ...base,
                this.createNavComponent(),
                this.createModalComponent(),
                this.createDropdownComponent(),
                this.createDataTableComponent(),
                this.createChartComponent(),
                this.createFormComponent(),
                this.createTabsComponent(),
                this.createAccordionComponent(),
                this.createToastComponent(),
                this.createTooltipComponent()
            ];
        }

        if (tier === 'network') {
            return [
                ...base,
                this.createNavComponent(),
                this.createModalComponent(),
                this.createDropdownComponent(),
                this.createDataTableComponent(),
                this.createChartComponent(),
                this.createFormComponent(),
                this.createTabsComponent(),
                this.createAccordionComponent(),
                this.createToastComponent(),
                this.createTooltipComponent(),
                this.createCommandPaletteComponent(),
                this.createVirtualListComponent(),
                this.createComboboxComponent()
            ];
        }

        // singularity — components are generative / config-driven
        return [
            ...base,
            {
                name: 'GenerativeLayout',
                category: 'layout',
                props: [
                    { name: 'intent',   type: 'string',  required: true },
                    { name: 'content',  type: 'any[]',   required: true },
                    { name: 'adaptive', type: 'boolean', required: false, default: true }
                ],
                variants: ['adaptive', 'fixed', 'ml-optimized'],
                accessibility: { role: 'region', ariaProps: ['aria-label', 'aria-live'], keyboard: ['Tab', 'ArrowKeys'] }
            },
            {
                name: 'SmartComponent',
                category: 'data',
                props: [
                    { name: 'dataSource',      type: 'string | Function',               required: true },
                    { name: 'renderStrategy',  type: '"list" | "grid" | "spatial"',     required: false, default: '"list"' },
                    { name: 'personalize',     type: 'boolean',                         required: false, default: true }
                ],
                variants: ['adaptive'],
                accessibility: { role: 'region', ariaProps: ['aria-busy', 'aria-live'], keyboard: ['Tab', 'ArrowKeys', 'Enter'] }
            }
        ];
    }

    private createNavComponent(): ComponentSpec {
        return {
            name: 'Navigation',
            category: 'navigation',
            props: [
                { name: 'items',       type: 'NavItem[]',                       required: true },
                { name: 'orientation', type: '"horizontal" | "vertical"',       required: false, default: '"horizontal"' }
            ],
            variants: ['horizontal', 'vertical', 'mobile'],
            accessibility: { role: 'navigation', ariaProps: ['aria-label'], keyboard: ['Tab', 'ArrowKeys', 'Enter'] }
        };
    }

    private createModalComponent(): ComponentSpec {
        return {
            name: 'Modal',
            category: 'overlay',
            props: [
                { name: 'isOpen',  type: 'boolean',     required: true },
                { name: 'onClose', type: '() => void',  required: true },
                { name: 'title',   type: 'string',      required: true },
                { name: 'size',    type: '"sm" | "md" | "lg" | "fullscreen"', required: false, default: '"md"' }
            ],
            variants: ['default', 'fullscreen', 'side-panel'],
            accessibility: { role: 'dialog', ariaProps: ['aria-modal', 'aria-labelledby'], keyboard: ['Escape', 'Tab'] }
        };
    }

    private createDropdownComponent(): ComponentSpec {
        return {
            name: 'Dropdown',
            category: 'input',
            props: [
                { name: 'options',   type: 'Option[]',                         required: true },
                { name: 'value',     type: 'string | string[]',               required: true },
                { name: 'onChange',  type: '(value: string | string[]) => void', required: true },
                { name: 'multi',     type: 'boolean',                          required: false, default: false }
            ],
            variants: ['single', 'multi', 'searchable'],
            accessibility: { role: 'combobox', ariaProps: ['aria-expanded', 'aria-haspopup', 'aria-activedescendant'], keyboard: ['Enter', 'Space', 'ArrowKeys', 'Escape'] }
        };
    }

    private createDataTableComponent(): ComponentSpec {
        return {
            name: 'DataTable',
            category: 'data',
            props: [
                { name: 'columns',    type: 'Column[]', required: true },
                { name: 'data',       type: 'any[]',    required: true },
                { name: 'sortable',   type: 'boolean',  required: false, default: false },
                { name: 'paginated',  type: 'boolean',  required: false, default: false },
                { name: 'selectable', type: 'boolean',  required: false, default: false }
            ],
            variants: ['default', 'compact', 'expanded'],
            composition: true,
            accessibility: { role: 'table', ariaProps: ['aria-sort', 'aria-selected'], keyboard: ['Tab', 'ArrowKeys', 'Enter', 'Space'] }
        };
    }

    private createChartComponent(): ComponentSpec {
        return {
            name: 'Chart',
            category: 'data',
            props: [
                { name: 'type',     type: '"line" | "bar" | "pie" | "area"', required: true },
                { name: 'data',     type: 'DataPoint[]',                     required: true },
                { name: 'animated', type: 'boolean',                         required: false, default: true }
            ],
            variants: ['line', 'bar', 'pie', 'area', 'composed'],
            accessibility: { role: 'img', ariaProps: ['aria-label'], keyboard: ['Tab', 'ArrowKeys'] }
        };
    }

    private createFormComponent(): ComponentSpec {
        return {
            name: 'Form',
            category: 'input',
            props: [
                { name: 'schema',     type: 'FieldSchema[]',               required: true },
                { name: 'onSubmit',   type: '(values: any) => void',       required: true },
                { name: 'validation', type: '"onChange" | "onBlur" | "onSubmit"', required: false, default: '"onBlur"' }
            ],
            variants: ['default', 'inline', 'wizard'],
            compound: ['Form.Field', 'Form.Error', 'Form.Submit'],
            accessibility: { role: 'form', ariaProps: ['aria-label', 'aria-describedby'], keyboard: ['Tab', 'Enter', 'Escape'] }
        };
    }

    private createTabsComponent(): ComponentSpec {
        return {
            name: 'Tabs',
            category: 'navigation',
            props: [
                { name: 'tabs',      type: 'Tab[]',                   required: true },
                { name: 'activeTab', type: 'string',                  required: true },
                { name: 'onChange',  type: '(tab: string) => void',  required: true }
            ],
            variants: ['default', 'pills', 'underlined'],
            composition: true,
            accessibility: { role: 'tablist', ariaProps: ['aria-selected', 'aria-controls'], keyboard: ['Tab', 'ArrowKeys', 'Enter'] }
        };
    }

    private createAccordionComponent(): ComponentSpec {
        return {
            name: 'Accordion',
            category: 'navigation',
            props: [
                { name: 'items',    type: 'AccordionItem[]', required: true },
                { name: 'multiple', type: 'boolean',         required: false, default: false }
            ],
            variants: ['default', 'bordered', 'separated'],
            accessibility: { role: 'region', ariaProps: ['aria-expanded', 'aria-controls'], keyboard: ['Tab', 'Enter', 'Space', 'ArrowKeys'] }
        };
    }

    private createToastComponent(): ComponentSpec {
        return {
            name: 'Toast',
            category: 'feedback',
            props: [
                { name: 'message',  type: 'string',                                required: true },
                { name: 'type',     type: '"info" | "success" | "warning" | "error"', required: false, default: '"info"' },
                { name: 'duration', type: 'number',                                required: false, default: getLimits().DEFAULT_ANIMATION_DURATION_MS }
            ],
            variants: ['info', 'success', 'warning', 'error'],
            accessibility: { role: 'alert', ariaProps: ['aria-live', 'aria-atomic'], keyboard: ['Escape'] }
        };
    }

    private createTooltipComponent(): ComponentSpec {
        return {
            name: 'Tooltip',
            category: 'feedback',
            props: [
                { name: 'content',   type: 'ReactNode',                            required: true },
                { name: 'placement', type: '"top" | "bottom" | "left" | "right"', required: false, default: '"top"' },
                { name: 'delay',     type: 'number',                               required: false, default: 200 }
            ],
            variants: ['default', 'rich'],
            accessibility: { role: 'tooltip', ariaProps: ['aria-describedby'], keyboard: [] }
        };
    }

    private createCommandPaletteComponent(): ComponentSpec {
        return {
            name: 'CommandPalette',
            category: 'overlay',
            props: [
                { name: 'isOpen',      type: 'boolean',    required: true },
                { name: 'onClose',     type: '() => void', required: true },
                { name: 'commands',    type: 'Command[]',  required: true },
                { name: 'placeholder', type: 'string',     required: false, default: '"Search commands…"' }
            ],
            variants: ['default', 'compact'],
            accessibility: { role: 'dialog', ariaProps: ['aria-modal', 'aria-label', 'aria-activedescendant'], keyboard: ['Escape', 'ArrowKeys', 'Enter', 'Cmd+K'] }
        };
    }

    private createVirtualListComponent(): ComponentSpec {
        return {
            name: 'VirtualList',
            category: 'data',
            props: [
                { name: 'items',      type: 'any[]',                                              required: true },
                { name: 'itemHeight', type: 'number',                                             required: true },
                { name: 'renderItem', type: '(item: any, index: number) => ReactNode',            required: true },
                { name: 'overscan',   type: 'number',                                             required: false, default: 5 }
            ],
            variants: ['default', 'infinite'],
            accessibility: { role: 'list', ariaProps: ['aria-rowcount', 'aria-rowindex'], keyboard: ['Tab', 'ArrowKeys', 'PageUp', 'PageDown'] }
        };
    }

    private createComboboxComponent(): ComponentSpec {
        return {
            name: 'Combobox',
            category: 'input',
            props: [
                { name: 'options',   type: 'Option[]',                              required: true },
                { name: 'value',     type: 'string | string[]',                    required: true },
                { name: 'onChange',  type: '(value: string | string[]) => void',   required: true },
                { name: 'creatable', type: 'boolean',                              required: false, default: false },
                { name: 'async',     type: 'boolean',                              required: false, default: false }
            ],
            variants: ['single', 'multi', 'creatable', 'async'],
            accessibility: { role: 'combobox', ariaProps: ['aria-expanded', 'aria-haspopup', 'aria-activedescendant', 'aria-autocomplete'], keyboard: ['Enter', 'Space', 'ArrowKeys', 'Escape', 'Tab'] }
        };
    }
}

export function asTierRange(arr: number[]): [number, number] {
    if (arr.length === 2) return [arr[0], arr[1]];
    if (arr.length === 1) return [arr[0], arr[0]];
    return [0, 0];
}

