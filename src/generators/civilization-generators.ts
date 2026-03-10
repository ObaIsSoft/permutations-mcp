import { DesignGenome } from "../genome/types.js";
import { CivilizationTier, ComponentSpec, AnimationSystem, ArchitectureSpec } from "../genome/civilization.js";

/**
 * Generates React component code from component specs
 */
export function generateComponentCode(spec: ComponentSpec, genome: DesignGenome): string {
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
    
    return `import React from 'react';
import { motion } from 'framer-motion';

interface ${spec.name}Props {
${propsInterface}
}

export function ${spec.name}({ ${propsDestructuring} }: ${spec.name}Props) {
  ${variantsHandling}
  
  return (
    <motion.div
      role="${spec.accessibility.role}"
      ${spec.accessibility.ariaProps.map(a => `${a}={${a}}`).join('\n      ')}
      style={{
        borderRadius: '${edgeRadius}px',
        // Primary color: hsl(${primaryColor.hue}, ${primaryColor.saturation * 100}%, ${primaryColor.lightness * 100}%)
      }}
      ${animationProps}
    >
      {/* Component implementation */}
    </motion.div>
  );
}
`;
}

function generateVariantStyle(variant: string, genome: DesignGenome): string {
    const hue = genome.chromosomes.ch5_color_primary.hue;
    switch (variant) {
        case 'primary': return `bg-[hsl(${hue},60%,50%)] text-white`;
        case 'secondary': return `bg-[hsl(${hue},40%,90%)] text-[hsl(${hue},60%,30%)]`;
        case 'ghost': return `bg-transparent border border-[hsl(${hue},60%,50%)]`;
        case 'danger': return `bg-red-500 text-white`;
        default: return '';
    }
}

/**
 * Generates animation configuration based on animation system spec
 */
export function generateAnimationConfig(system: AnimationSystem, genome: DesignGenome): string {
    const configs: string[] = [];
    
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
export function generateArchitectureSetup(arch: ArchitectureSpec, genome: DesignGenome): string {
    const outputs: string[] = [];
    
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
    } else if (arch.stateManagement === 'context') {
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
 * Generates design tokens as CSS variables and JS config
 */
export function generateDesignTokens(tier: CivilizationTier, genome: DesignGenome): string {
    const primary = genome.chromosomes.ch5_color_primary;
    const radius = genome.chromosomes.ch7_edge.radius;
    const motion = genome.chromosomes.ch8_motion;
    
    // CSS Custom Properties
    const cssVars = `:root {
  /* Colors */
  --color-primary: hsl(${primary.hue}, ${primary.saturation * 100}%, ${primary.lightness * 100}%);
  --color-primary-hue: ${primary.hue};
  --color-background: ${primary.temperature === 'warm' ? '#faf9f6' : '#0a0a0a'};
  --color-surface: ${primary.temperature === 'warm' ? '#ffffff' : '#141414'};
  
  /* Spacing */
  --spacing-unit: ${genome.chromosomes.ch2_rhythm.baseSpacing}px;
  --spacing-density: ${genome.chromosomes.ch2_rhythm.density};
  
  /* Typography */
  --font-display: ${genome.chromosomes.ch3_type_display.family};
  --font-body: ${genome.chromosomes.ch4_type_body.family};
  
  /* Border Radius */
  --radius-genome: ${radius}px;
  
  /* Motion */
  --duration-genome: ${motion.durationScale * 1000}ms;
  --easing-genome: ${motion.physics === 'spring' ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'ease-out'};
  
  /* Accessibility */
  --focus-ring: 0 0 0 3px hsl(${primary.hue}, ${primary.saturation * 100}%, ${primary.lightness * 100}%, 0.5);
}`;

    // Tailwind extension
    const tailwindConfig = `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hue: ${primary.hue},
        },
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        genome: 'var(--radius-genome)',
      },
      transitionTimingFunction: {
        genome: 'var(--easing-genome)',
      },
      transitionDuration: {
        genome: 'var(--duration-genome)',
      },
    },
  },
};`;

    return `${cssVars}\n\n${tailwindConfig}`;
}

/**
 * Generates the full component library index file
 */
export function generateComponentLibraryIndex(components: ComponentSpec[], tier: CivilizationTier['tier']): string {
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
export function generateInteractionHandlers(interactions: CivilizationTier['interactions']): string {
    const handlers: string[] = [];
    
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
 * Generates the complete civilization tier output
 */
export function generateCivilizationOutput(tier: CivilizationTier, genome: DesignGenome): {
    components: string;
    animations: string;
    architecture: string;
    tokens: string;
    interactions: string;
    index: string;
} {
    return {
        components: tier.components.list
            .map(c => generateComponentCode(c, genome))
            .join('\n\n---\n\n'),
        animations: generateAnimationConfig(tier.animations, genome),
        architecture: generateArchitectureSetup(tier.architecture, genome),
        tokens: generateDesignTokens(tier, genome),
        interactions: generateInteractionHandlers(tier.interactions),
        index: generateComponentLibraryIndex(tier.components.list, tier.tier)
    };
}
