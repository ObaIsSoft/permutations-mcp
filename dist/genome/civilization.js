import { ComplexityAnalyzer } from "./complexity-analyzer.js";
export class CivilizationGenerator {
    complexityAnalyzer;
    constructor() {
        this.complexityAnalyzer = new ComplexityAnalyzer();
    }
    generate(intent, context, traits, minTier) {
        // Analyze complexity
        const analysis = minTier
            ? this.complexityAnalyzer.forceMinimumTier(intent, context, traits, minTier)
            : this.complexityAnalyzer.analyze(intent, context, traits);
        // Only generate civilization tier if complexity is high enough
        if (analysis.finalComplexity < 0.70) {
            throw new Error(`Complexity ${analysis.finalComplexity.toFixed(2)} is below civilization threshold (0.70). ` +
                `Add more sophisticated keywords to intent (e.g., "dashboard", "3D", "real-time") ` +
                `or specify minTier explicitly.`);
        }
        // Generate tier-specific outputs
        return this.generateTier(analysis);
    }
    generateTier(analysis) {
        switch (analysis.tier) {
            case 'sentient':
                return this.generateSentientTier(analysis);
            case 'civilized':
                return this.generateCivilizedTier(analysis);
            case 'advanced':
                return this.generateAdvancedTier(analysis);
            default:
                throw new Error(`Cannot generate civilization for tier: ${analysis.tier}`);
        }
    }
    generateSentientTier(analysis) {
        return {
            tier: 'sentient',
            complexity: analysis.finalComplexity,
            architecture: {
                pattern: 'component-based',
                modules: 3,
                stateManagement: 'context',
                routing: 'static'
            },
            components: {
                count: 15,
                list: this.generateComponentLibrary('sentient')
            },
            animations: {
                physics: 'simple',
                types: ['fade', 'slide', 'scale'],
                choreography: 'sequential',
                reducedMotion: 'respect'
            },
            designSystem: {
                count: 40,
                themes: 1,
                modes: ['light'],
                semanticTokens: false
            },
            interactions: {
                gestures: ['click', 'hover'],
                keyboard: 'basic',
                focus: 'basic'
            }
        };
    }
    generateCivilizedTier(analysis) {
        return {
            tier: 'civilized',
            complexity: analysis.finalComplexity,
            architecture: {
                pattern: 'layered',
                layers: ['presentation', 'domain', 'data'],
                modules: 6,
                stateManagement: 'store',
                routing: 'dynamic'
            },
            components: {
                count: 35,
                list: this.generateComponentLibrary('civilized')
            },
            animations: {
                physics: 'advanced',
                types: ['spring', 'glitch', 'morph', 'particle'],
                choreography: 'staggered',
                reducedMotion: 'alternative'
            },
            designSystem: {
                count: 80,
                themes: 2,
                modes: ['light', 'dark', 'high-contrast'],
                semanticTokens: true
            },
            interactions: {
                gestures: ['swipe', 'pinch', 'hover', 'drag'],
                keyboard: 'full',
                focus: 'managed'
            }
        };
    }
    generateAdvancedTier(analysis) {
        return {
            tier: 'advanced',
            complexity: analysis.finalComplexity,
            architecture: {
                pattern: 'micro-frontend',
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
                types: ['procedural'],
                choreography: 'responsive-to-user',
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
    generateComponentLibrary(tier) {
        const baseComponents = [
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
        if (tier === 'sentient') {
            return [
                ...baseComponents,
                this.createNavComponent(),
                this.createModalComponent(),
                this.createDropdownComponent()
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
        // Advanced tier - components are generative/config-driven
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
    createNavComponent() {
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
    createModalComponent() {
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
    createDropdownComponent() {
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
    createDataTableComponent() {
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
    createChartComponent() {
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
    createFormComponent() {
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
    createTabsComponent() {
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
    createAccordionComponent() {
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
    createToastComponent() {
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
    createTooltipComponent() {
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
}
