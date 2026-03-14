import { DesignGenome, ContentTraits } from "./types.js";
import { ComplexityAnalyzer, ComplexityAnalysis } from "./complexity-analyzer.js";

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
    stateManagement: 'context' | 'store' | 'distributed';
    routing: 'static' | 'dynamic' | 'intent-based';
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
    tier: 'neural' | 'sentient' | 'civilized' | 'networked' | 'advanced';
    complexity: number;
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
        minTier?: CivilizationTier['tier']
    ): CivilizationTier {
        const analysis = minTier
            ? this.complexityAnalyzer.forceMinimumTier(intent, context, traits, minTier)
            : this.complexityAnalyzer.analyze(intent, context, traits);

        // Civilization requires at least neural tier (0.55+)
        if (analysis.finalComplexity < 0.55) {
            throw new Error(
                `Complexity ${analysis.finalComplexity.toFixed(2)} is below civilization threshold (0.55). ` +
                `Current tier: ${analysis.tier}. Add sophistication keywords or specify minTier.`
            );
        }

        return this.generateTier(analysis);
    }

    private generateTier(analysis: ComplexityAnalysis): CivilizationTier {
        switch (analysis.tier) {
            case 'neural':
                return this.generateNeuralTier(analysis);
            case 'sentient':
                return this.generateSentientTier(analysis);
            case 'civilized':
                return this.generateCivilizedTier(analysis);
            case 'networked':
                return this.generateNetworkedTier(analysis);
            case 'advanced':
                return this.generateAdvancedTier(analysis);
            default:
                throw new Error(`Cannot generate civilization for tier: ${analysis.tier}`);
        }
    }

    // 0.55–0.68 — Signal propagation: nervous system forms, components wire together
    private generateNeuralTier(analysis: ComplexityAnalysis): CivilizationTier {
        return {
            tier: 'neural',
            complexity: analysis.finalComplexity,
            architecture: {
                pattern: 'component-based',
                modules: 4,
                stateManagement: 'context',
                routing: 'static'
            },
            components: {
                count: [14, 22],
                list: this.generateComponentLibrary('neural')
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
                semanticTokens: false
            },
            interactions: {
                gestures: ['click', 'hover', 'focus'],
                keyboard: 'basic',
                focus: 'basic'
            }
        };
    }

    // 0.68–0.80 — Consciousness: intent-aware, multi-modal, motion system active
    private generateSentientTier(analysis: ComplexityAnalysis): CivilizationTier {
        return {
            tier: 'sentient',
            complexity: analysis.finalComplexity,
            architecture: {
                pattern: 'component-based',
                layers: ['view', 'logic'],
                modules: 5,
                stateManagement: 'context',
                routing: 'static'
            },
            components: {
                count: [20, 35],
                list: this.generateComponentLibrary('sentient')
            },
            animations: {
                physics: 'spring',
                types: ['fade', 'slide', 'scale', 'spring', 'stagger'],
                choreography: 'staggered',
                reducedMotion: 'respect'
            },
            designSystem: {
                count: [45, 65],
                themes: [1, 2],
                modes: ['light', 'dark'],
                semanticTokens: true
            },
            interactions: {
                gestures: ['click', 'hover', 'swipe', 'focus'],
                keyboard: 'full',
                focus: 'basic'
            }
        };
    }

    // 0.80–0.90 — Society: organized, composable, token-driven, data-rich
    private generateCivilizedTier(analysis: ComplexityAnalysis): CivilizationTier {
        return {
            tier: 'civilized',
            complexity: analysis.finalComplexity,
            architecture: {
                pattern: 'layered',
                layers: ['presentation', 'domain', 'data'],
                modules: 8,
                stateManagement: 'store',
                routing: 'dynamic'
            },
            components: {
                count: [32, 50],
                list: this.generateComponentLibrary('civilized')
            },
            animations: {
                physics: 'advanced',
                types: ['spring', 'glitch', 'morph', 'particle', 'stagger'],
                choreography: 'staggered',
                reducedMotion: 'alternative'
            },
            designSystem: {
                count: [75, 100],
                themes: [2, 4],
                modes: ['light', 'dark', 'high-contrast'],
                semanticTokens: true
            },
            interactions: {
                gestures: ['swipe', 'pinch', 'hover', 'drag', 'long-press'],
                keyboard: 'full',
                focus: 'managed'
            }
        };
    }

    // 0.90–0.95 — Networked civilization: distributed, real-time, multi-surface
    private generateNetworkedTier(analysis: ComplexityAnalysis): CivilizationTier {
        return {
            tier: 'networked',
            complexity: analysis.finalComplexity,
            architecture: {
                pattern: 'micro-frontend',
                layers: ['shell', 'feature', 'shared', 'platform'],
                modules: 12,
                stateManagement: 'distributed',
                routing: 'dynamic',
                edge: true
            },
            components: {
                count: [48, 72],
                list: this.generateComponentLibrary('networked')
            },
            animations: {
                physics: 'advanced',
                types: ['spring', 'morph', 'particle', 'procedural', 'physics-sim'],
                choreography: 'responsive-to-user',
                reducedMotion: 'alternative'
            },
            designSystem: {
                count: [100, 160],
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

    // 0.95–1.00 — Post-civilization: generative, ML-optimized, intent-based, adaptive
    private generateAdvancedTier(analysis: ComplexityAnalysis): CivilizationTier {
        return {
            tier: 'advanced',
            complexity: analysis.finalComplexity,
            architecture: {
                pattern: 'fractal',
                layers: ['intent', 'generation', 'surface', 'data', 'edge'],
                modules: 'dynamic',
                stateManagement: 'distributed',
                routing: 'intent-based',
                edge: true
            },
            components: {
                count: 'generative',
                list: this.generateComponentLibrary('advanced')
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
        const baseComponents: ComponentSpec[] = [
            {
                name: 'Button',
                category: 'input',
                props: [
                    { name: 'variant', type: '"primary" | "secondary" | "ghost"', required: false, default: '"primary"' },
                    { name: 'size', type: '"sm" | "md" | "lg"', required: false, default: '"md"' },
                    { name: 'disabled', type: 'boolean', required: false, default: false },
                    { name: 'onClick', type: '() => void', required: false }
                ],
                variants: ['primary', 'secondary', 'ghost', 'danger'],
                accessibility: {
                    role: 'button',
                    ariaProps: ['aria-disabled', 'aria-pressed'],
                    keyboard: ['Enter', 'Space']
                }
            },
            {
                name: 'Card',
                category: 'layout',
                props: [
                    { name: 'elevation', type: 'number', required: false, default: 1 },
                    { name: 'interactive', type: 'boolean', required: false, default: false }
                ],
                variants: ['default', 'elevated', 'outlined'],
                accessibility: {
                    role: 'article',
                    ariaProps: ['aria-label'],
                    keyboard: []
                }
            },
            {
                name: 'Input',
                category: 'input',
                props: [
                    { name: 'type', type: '"text" | "email" | "password"', required: false, default: '"text"' },
                    { name: 'value', type: 'string', required: true },
                    { name: 'onChange', type: '(value: string) => void', required: true },
                    { name: 'error', type: 'string', required: false }
                ],
                variants: ['default', 'error', 'disabled'],
                accessibility: {
                    role: 'textbox',
                    ariaProps: ['aria-invalid', 'aria-errormessage', 'aria-required'],
                    keyboard: ['Tab', 'Enter']
                }
            }
        ];

        if (tier === 'neural') {
            return [
                ...baseComponents,
                this.createNavComponent(),
                this.createModalComponent(),
                this.createDropdownComponent(),
                this.createToastComponent(),
                this.createTooltipComponent()
            ];
        }

        if (tier === 'sentient') {
            return [
                ...baseComponents,
                this.createNavComponent(),
                this.createModalComponent(),
                this.createDropdownComponent(),
                this.createTabsComponent(),
                this.createAccordionComponent(),
                this.createToastComponent(),
                this.createTooltipComponent()
            ];
        }

        if (tier === 'civilized') {
            return [
                ...baseComponents,
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

        if (tier === 'networked') {
            return [
                ...baseComponents,
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

        // Advanced tier — components are generative/config-driven
        return [
            ...baseComponents,
            {
                name: 'GenerativeLayout',
                category: 'layout',
                props: [
                    { name: 'intent', type: 'string', required: true },
                    { name: 'content', type: 'any[]', required: true },
                    { name: 'adaptive', type: 'boolean', required: false, default: true }
                ],
                variants: ['adaptive', 'fixed', 'ml-optimized'],
                accessibility: {
                    role: 'region',
                    ariaProps: ['aria-label', 'aria-live'],
                    keyboard: ['Tab', 'ArrowKeys']
                }
            },
            {
                name: 'SmartComponent',
                category: 'data',
                props: [
                    { name: 'dataSource', type: 'string | Function', required: true },
                    { name: 'renderStrategy', type: '"list" | "grid" | "spatial"', required: false, default: '"list"' },
                    { name: 'personalize', type: 'boolean', required: false, default: true }
                ],
                variants: ['adaptive'],
                accessibility: {
                    role: 'region',
                    ariaProps: ['aria-busy', 'aria-live'],
                    keyboard: ['Tab', 'ArrowKeys', 'Enter']
                }
            }
        ];
    }

    private createNavComponent(): ComponentSpec {
        return {
            name: 'Navigation',
            category: 'navigation',
            props: [
                { name: 'items', type: 'NavItem[]', required: true },
                { name: 'orientation', type: '"horizontal" | "vertical"', required: false, default: '"horizontal"' }
            ],
            variants: ['horizontal', 'vertical', 'mobile'],
            accessibility: {
                role: 'navigation',
                ariaProps: ['aria-label'],
                keyboard: ['Tab', 'ArrowKeys', 'Enter']
            }
        };
    }

    private createModalComponent(): ComponentSpec {
        return {
            name: 'Modal',
            category: 'overlay',
            props: [
                { name: 'isOpen', type: 'boolean', required: true },
                { name: 'onClose', type: '() => void', required: true },
                { name: 'title', type: 'string', required: true },
                { name: 'size', type: '"sm" | "md" | "lg" | "fullscreen"', required: false, default: '"md"' }
            ],
            variants: ['default', 'fullscreen', 'side-panel'],
            accessibility: {
                role: 'dialog',
                ariaProps: ['aria-modal', 'aria-labelledby'],
                keyboard: ['Escape', 'Tab']
            }
        };
    }

    private createDropdownComponent(): ComponentSpec {
        return {
            name: 'Dropdown',
            category: 'input',
            props: [
                { name: 'options', type: 'Option[]', required: true },
                { name: 'value', type: 'string | string[]', required: true },
                { name: 'onChange', type: '(value: string | string[]) => void', required: true },
                { name: 'multi', type: 'boolean', required: false, default: false }
            ],
            variants: ['single', 'multi', 'searchable'],
            accessibility: {
                role: 'combobox',
                ariaProps: ['aria-expanded', 'aria-haspopup', 'aria-activedescendant'],
                keyboard: ['Enter', 'Space', 'ArrowKeys', 'Escape']
            }
        };
    }

    private createDataTableComponent(): ComponentSpec {
        return {
            name: 'DataTable',
            category: 'data',
            props: [
                { name: 'columns', type: 'Column[]', required: true },
                { name: 'data', type: 'any[]', required: true },
                { name: 'sortable', type: 'boolean', required: false, default: false },
                { name: 'paginated', type: 'boolean', required: false, default: false },
                { name: 'selectable', type: 'boolean', required: false, default: false }
            ],
            variants: ['default', 'compact', 'expanded'],
            composition: true,
            accessibility: {
                role: 'table',
                ariaProps: ['aria-sort', 'aria-selected'],
                keyboard: ['Tab', 'ArrowKeys', 'Enter', 'Space']
            }
        };
    }

    private createChartComponent(): ComponentSpec {
        return {
            name: 'Chart',
            category: 'data',
            props: [
                { name: 'type', type: '"line" | "bar" | "pie" | "area"', required: true },
                { name: 'data', type: 'DataPoint[]', required: true },
                { name: 'animated', type: 'boolean', required: false, default: true }
            ],
            variants: ['line', 'bar', 'pie', 'area', 'composed'],
            accessibility: {
                role: 'img',
                ariaProps: ['aria-label'],
                keyboard: ['Tab', 'ArrowKeys']
            }
        };
    }

    private createFormComponent(): ComponentSpec {
        return {
            name: 'Form',
            category: 'input',
            props: [
                { name: 'schema', type: 'FieldSchema[]', required: true },
                { name: 'onSubmit', type: '(values: any) => void', required: true },
                { name: 'validation', type: '"onChange" | "onBlur" | "onSubmit"', required: false, default: '"onBlur"' }
            ],
            variants: ['default', 'inline', 'wizard'],
            compound: ['Form.Field', 'Form.Error', 'Form.Submit'],
            accessibility: {
                role: 'form',
                ariaProps: ['aria-label', 'aria-describedby'],
                keyboard: ['Tab', 'Enter', 'Escape']
            }
        };
    }

    private createTabsComponent(): ComponentSpec {
        return {
            name: 'Tabs',
            category: 'navigation',
            props: [
                { name: 'tabs', type: 'Tab[]', required: true },
                { name: 'activeTab', type: 'string', required: true },
                { name: 'onChange', type: '(tab: string) => void', required: true }
            ],
            variants: ['default', 'pills', 'underlined'],
            composition: true,
            accessibility: {
                role: 'tablist',
                ariaProps: ['aria-selected', 'aria-controls'],
                keyboard: ['Tab', 'ArrowKeys', 'Enter']
            }
        };
    }

    private createAccordionComponent(): ComponentSpec {
        return {
            name: 'Accordion',
            category: 'navigation',
            props: [
                { name: 'items', type: 'AccordionItem[]', required: true },
                { name: 'multiple', type: 'boolean', required: false, default: false }
            ],
            variants: ['default', 'bordered', 'separated'],
            accessibility: {
                role: 'region',
                ariaProps: ['aria-expanded', 'aria-controls'],
                keyboard: ['Tab', 'Enter', 'Space', 'ArrowKeys']
            }
        };
    }

    private createToastComponent(): ComponentSpec {
        return {
            name: 'Toast',
            category: 'feedback',
            props: [
                { name: 'message', type: 'string', required: true },
                { name: 'type', type: '"info" | "success" | "warning" | "error"', required: false, default: '"info"' },
                { name: 'duration', type: 'number', required: false, default: 5000 }
            ],
            variants: ['info', 'success', 'warning', 'error'],
            accessibility: {
                role: 'alert',
                ariaProps: ['aria-live', 'aria-atomic'],
                keyboard: ['Escape']
            }
        };
    }

    private createTooltipComponent(): ComponentSpec {
        return {
            name: 'Tooltip',
            category: 'feedback',
            props: [
                { name: 'content', type: 'ReactNode', required: true },
                { name: 'placement', type: '"top" | "bottom" | "left" | "right"', required: false, default: '"top"' },
                { name: 'delay', type: 'number', required: false, default: 200 }
            ],
            variants: ['default', 'rich'],
            accessibility: {
                role: 'tooltip',
                ariaProps: ['aria-describedby'],
                keyboard: []
            }
        };
    }

    private createCommandPaletteComponent(): ComponentSpec {
        return {
            name: 'CommandPalette',
            category: 'overlay',
            props: [
                { name: 'isOpen', type: 'boolean', required: true },
                { name: 'onClose', type: '() => void', required: true },
                { name: 'commands', type: 'Command[]', required: true },
                { name: 'placeholder', type: 'string', required: false, default: '"Search commands…"' }
            ],
            variants: ['default', 'compact'],
            accessibility: {
                role: 'dialog',
                ariaProps: ['aria-modal', 'aria-label', 'aria-activedescendant'],
                keyboard: ['Escape', 'ArrowKeys', 'Enter', 'Cmd+K']
            }
        };
    }

    private createVirtualListComponent(): ComponentSpec {
        return {
            name: 'VirtualList',
            category: 'data',
            props: [
                { name: 'items', type: 'any[]', required: true },
                { name: 'itemHeight', type: 'number', required: true },
                { name: 'renderItem', type: '(item: any, index: number) => ReactNode', required: true },
                { name: 'overscan', type: 'number', required: false, default: 5 }
            ],
            variants: ['default', 'infinite'],
            accessibility: {
                role: 'list',
                ariaProps: ['aria-rowcount', 'aria-rowindex'],
                keyboard: ['Tab', 'ArrowKeys', 'PageUp', 'PageDown']
            }
        };
    }

    private createComboboxComponent(): ComponentSpec {
        return {
            name: 'Combobox',
            category: 'input',
            props: [
                { name: 'options', type: 'Option[]', required: true },
                { name: 'value', type: 'string | string[]', required: true },
                { name: 'onChange', type: '(value: string | string[]) => void', required: true },
                { name: 'creatable', type: 'boolean', required: false, default: false },
                { name: 'async', type: 'boolean', required: false, default: false }
            ],
            variants: ['single', 'multi', 'creatable', 'async'],
            accessibility: {
                role: 'combobox',
                ariaProps: ['aria-expanded', 'aria-haspopup', 'aria-activedescendant', 'aria-autocomplete'],
                keyboard: ['Enter', 'Space', 'ArrowKeys', 'Escape', 'Tab']
            }
        };
    }
}
