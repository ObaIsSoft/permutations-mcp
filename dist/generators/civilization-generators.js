/**
 * Generates React component code from component specs
 */
export function generateComponentCode(spec, genome) {
    const edgeRadius = genome.chromosomes.ch7_edge.radius;
    const primaryColor = genome.chromosomes.ch5_color_primary;
    const motion = genome.chromosomes.ch8_motion.physics;
    const propsInterface = spec.props
        .map(p => `  ${p.name}${p.required ? '' : '?'}: ${p.type}${p.default !== undefined ? `; // default: ${JSON.stringify(p.default)}` : ''}`)
        .join('\n');
    const propsDestructuring = spec.props.map(p => p.name).join(', ');
    const variantsHandling = spec.variants.length > 1
        ? `const variantStyles = {
${spec.variants.map(v => `    ${v}: "${generateVariantStyle(v, genome)}",`).join('\n')}
  };`
        : '';
    const animationProps = motion !== 'none'
        ? `  transition={{ duration: ${genome.chromosomes.ch8_motion.durationScale}, ease: "${genome.chromosomes.ch8_motion.physics}" }}`
        : '';
    // Scaffold note: aria attributes listed as comments — wire up to props in implementation
    const ariaComment = spec.accessibility.ariaProps.length > 0
        ? `      {/* aria: ${spec.accessibility.ariaProps.join(', ')} — add to element when implementing */}`
        : '';
    return `import React from 'react';
import { motion } from 'framer-motion';

// SCAFFOLD — civilized tier output. Implement props/logic before shipping.
// Required aria: ${spec.accessibility.ariaProps.join(', ') || 'none'}
// Keyboard: ${spec.accessibility.keyboard.join(', ') || 'none'}

interface ${spec.name}Props {
${propsInterface}
}

export function ${spec.name}({ ${propsDestructuring} }: ${spec.name}Props) {
  ${variantsHandling}

  return (
    <motion.div
      role="${spec.accessibility.role}"
      style={{
        borderRadius: '${edgeRadius}px',
        // Primary color: hsl(${primaryColor.hue}, ${Math.round(primaryColor.saturation * 100)}%, ${Math.round(primaryColor.lightness * 100)}%)
      }}
      ${animationProps}
    >
${ariaComment}
      {/* ${spec.name} implementation goes here */}
    </motion.div>
  );
}
`;
}
function generateVariantStyle(variant, genome) {
    const hue = genome.chromosomes.ch5_color_primary.hue;
    const sat = Math.round(genome.chromosomes.ch5_color_primary.saturation * 100);
    const light = Math.round(genome.chromosomes.ch5_color_primary.lightness * 100);
    const accentHue = (hue + 30) % 360; // Complementary for danger
    switch (variant) {
        case 'primary': return `bg-[hsl(${hue},${sat}%,${light}%)] text-white`;
        case 'secondary': return `bg-[hsl(${hue},${Math.max(20, sat - 20)}%,${Math.min(95, light + 40)}%)] text-[hsl(${hue},${sat}%,${Math.max(20, light - 20)}%)]`;
        case 'ghost': return `bg-transparent border border-[hsl(${hue},${sat}%,${light}%)]`;
        case 'danger': return `bg-[hsl(${accentHue},${sat}%,${Math.min(50, light)}%)] text-white`;
        default: return '';
    }
}
/**
 * Generates animation configuration based on animation system spec
 */
export function generateAnimationConfig(system, genome) {
    const configs = [];
    // Physics configuration
    configs.push(`export const physics = {
  type: "${system.physics}",
  stiffness: ${genome.chromosomes.ch8_motion.physics === 'spring' ? 100 : 50},
  damping: ${genome.chromosomes.ch8_motion.physics === 'spring' ? 10 : 20},
};`);
    // Animation variants
    configs.push(`export const transitions = {
${system.types.map(type => `  ${type}: {
    duration: ${genome.chromosomes.ch8_motion.durationScale},
    ease: "${genome.chromosomes.ch8_motion.physics}",
  },`).join('\n')}
};`);
    // Choreography patterns
    if (system.choreography === 'staggered') {
        configs.push(`export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};`);
    }
    // Reduced motion support
    configs.push(`export const prefersReducedMotion = typeof window !== 'undefined' 
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
  : false;`);
    return configs.join('\n\n');
}
/**
 * Generates architecture setup (routing, state management)
 */
export function generateArchitectureSetup(arch, genome) {
    const outputs = [];
    // State management
    if (arch.stateManagement === 'store') {
        outputs.push(`// State Management: Zustand Store
import { create } from 'zustand';

interface AppState {
  // Define your state here
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));`);
    }
    else if (arch.stateManagement === 'context') {
        outputs.push(`// State Management: React Context
import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  return (
    <AppContext.Provider value={{ theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};`);
    }
    // Routing
    if (arch.routing === 'dynamic') {
        outputs.push(`// Routing: React Router with lazy loading
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/settings', element: <Settings /> },
]);

export function Router() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}`);
    }
    return outputs.join('\n\n');
}
/**
 * Generates design tokens as a CSS :root block (tokens.css)
 */
export function generateDesignTokensCSS(tier, genome) {
    const primary = genome.chromosomes.ch5_color_primary;
    const ch6 = genome.chromosomes.ch6_color_temp;
    const radius = genome.chromosomes.ch7_edge.radius;
    const motion = genome.chromosomes.ch8_motion;
    const surfaceStack = ch6.surfaceStack;
    return `:root {
  /* Colors — from genome chromosomes */
  --color-primary: hsl(${primary.hue}, ${Math.round(primary.saturation * 100)}%, ${Math.round(primary.lightness * 100)}%);
  --primary-hue: ${primary.hue};
  --primary-sat: ${Math.round(primary.saturation * 100)}%;
  --primary-light: ${Math.round(primary.lightness * 100)}%;
  --color-primary-dim: hsla(${primary.hue}, ${Math.round(primary.saturation * 100)}%, ${Math.round(primary.lightness * 100)}%, 0.12);
  --color-primary-glow: hsla(${primary.hue}, ${Math.round(primary.saturation * 100)}%, ${Math.round(primary.lightness * 100)}%, 0.35);
  --color-background: ${surfaceStack[0]};
  --color-surface: ${surfaceStack[1]};
  --color-surface-elevated: ${surfaceStack[2]};
  --color-surface-overlay: ${surfaceStack[3]};

  /* Spacing — base unit: ${genome.chromosomes.ch2_rhythm.baseSpacing}px */
  --spacing-unit: ${genome.chromosomes.ch2_rhythm.baseSpacing}px;
  --space-xs: ${Math.round(genome.chromosomes.ch2_rhythm.baseSpacing * 0.25)}px;
  --space-sm: ${Math.round(genome.chromosomes.ch2_rhythm.baseSpacing * 0.5)}px;
  --space-md: ${genome.chromosomes.ch2_rhythm.baseSpacing}px;
  --space-lg: ${genome.chromosomes.ch2_rhythm.baseSpacing * 2}px;
  --space-xl: ${genome.chromosomes.ch2_rhythm.baseSpacing * 4}px;
  --space-2xl: ${genome.chromosomes.ch2_rhythm.baseSpacing * 8}px;

  /* Typography */
  --font-display: ${genome.chromosomes.ch3_type_display.family};
  --font-body: ${genome.chromosomes.ch4_type_body.family};

  /* Shape */
  --radius-genome: ${radius}px;
  --radius-sm: ${Math.max(0, Math.round(radius * 0.5))}px;
  --radius-lg: ${radius * 2}px;

  /* Motion */
  --duration-genome: ${Math.round(motion.durationScale * 1000)}ms;
  --easing-genome: ${motion.physics === 'spring' ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'ease-out'};

  /* Accessibility */
  --focus-ring: 0 0 0 3px hsla(${primary.hue}, ${Math.round(primary.saturation * 100)}%, ${Math.round(primary.lightness * 100)}%, 0.5);
}`;
}
/**
 * Generates Tailwind config extension (tailwind.config.js)
 */
export function generateTailwindConfig(tier, genome) {
    const primary = genome.chromosomes.ch5_color_primary;
    const motion = genome.chromosomes.ch8_motion;
    const radius = genome.chromosomes.ch7_edge.radius;
    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          dim: 'var(--color-primary-dim)',
          glow: 'var(--color-primary-glow)',
        },
        background: 'var(--color-background)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          elevated: 'var(--color-surface-elevated)',
          overlay: 'var(--color-surface-overlay)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        genome: '${radius}px',
      },
      transitionTimingFunction: {
        genome: '${motion.physics === 'spring' ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'ease-out'}',
      },
      transitionDuration: {
        genome: '${Math.round(motion.durationScale * 1000)}ms',
      },
    },
  },
};`;
}
/**
 * @deprecated Use generateDesignTokensCSS + generateTailwindConfig separately.
 * Kept for call-site compatibility — returns CSS only.
 */
export function generateDesignTokens(tier, genome) {
    return generateDesignTokensCSS(tier, genome);
}
/**
 * Generates the full component library index file
 */
export function generateComponentLibraryIndex(components, tier) {
    const exports = components.map(c => `export { ${c.name} } from './${c.name}';`).join('\n');
    const compoundExports = components
        .filter(c => c.compound)
        .flatMap(c => c.compound || [])
        .map(name => `export { ${name.split('.')[0]} } from './${name.split('.')[0]}';`)
        .join('\n');
    return `// Component Library: ${tier} tier
// Generated by Permutations MCP

${exports}
${compoundExports}

// Types
export type {
${components.map(c => `  ${c.name}Props,`).join('\n')}
} from './types';
`;
}
/**
 * Generates interaction/gesture handlers
 */
export function generateInteractionHandlers(interactions) {
    const handlers = [];
    if (interactions.gestures.includes('swipe') || interactions.gestures === 'predictive') {
        handlers.push(`// Swipe gesture handler
export function useSwipe(onSwipeLeft?: () => void, onSwipeRight?: () => void) {
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
  
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe && onSwipeLeft) onSwipeLeft();
    if (isRightSwipe && onSwipeRight) onSwipeRight();
  };
  
  return { onTouchStart, onTouchMove, onTouchEnd };
}`);
    }
    if (interactions.keyboard === 'full' || interactions.keyboard === 'command-palette') {
        handlers.push(`// Keyboard navigation
export function useKeyboardNavigation(
  items: string[],
  onSelect: (item: string) => void
) {
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case 'Enter':
        onSelect(items[focusedIndex]);
        break;
    }
  };
  
  return { focusedIndex, handleKeyDown };
}`);
    }
    if (interactions.keyboard === 'command-palette') {
        handlers.push(`// Command palette
export function useCommandPalette(commands: Command[]) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );
  
  return { isOpen, setIsOpen, search, setSearch, filteredCommands };
}`);
    }
    return handlers.join('\n\n');
}
/**
 * Generates the complete civilization tier output.
 * tokensCss  → write as tokens.css (CSS :root block only)
 * tailwindConfig → write as tailwind.config.js (module.exports block only)
 * components → valid TypeScript file with multiple named exports, no --- separators
 *
 * @param organisms - When provided (from EcosystemGenerator), uses their topology-derived
 *   specs instead of the tier's generic component list. Civilization should always emerge
 *   from an ecosystem — pass organisms whenever available.
 */
export function generateCivilizationOutput(tier, genome, cssOutput, topologyOutput, organisms // ecosystem organisms, preferred over tier.components.list
) {
    const tokensCss = generateDesignTokensCSS(tier, genome);
    const tailwindConfig = generateTailwindConfig(tier, genome);
    // Use ecosystem organisms (topology-derived, relationship-aware) when provided.
    // Fall back to tier's generic component list only when no ecosystem was run.
    const componentSpecs = organisms
        ? organisms.map(o => o.spec)
        : tier.components.list;
    return {
        // Valid TS file: named exports separated by blank lines, no --- markers
        components: componentSpecs
            .map(c => generateComponentCode(c, genome))
            .join('\n\n'),
        animations: generateAnimationConfig(tier.animations, genome),
        architecture: generateArchitectureSetup(tier.architecture, genome),
        tokens: tokensCss, // kept for backwards compat — CSS only
        tokensCss,
        tailwindConfig,
        interactions: generateInteractionHandlers(tier.interactions),
        index: generateComponentLibraryIndex(tier.components.list, tier.tier),
        css: cssOutput, // UNIFIED: Pass through from CSSGenerator
        topology: topologyOutput // UNIFIED: Pass through from HTMLGenerator
    };
}
