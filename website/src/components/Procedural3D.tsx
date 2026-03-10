import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment } from '@react-three/drei';
import type { Mesh } from 'three';

/* Permutations Generated DNA - DYNAMIC FROM GENOME:
 * Material: glass (from ch14_physics)
 * Primary Color: from ch5_color_primary
 * Rendering Strategy: from ch18_rendering
 */

// Get genome color from CSS variable or fallback
function getGenomeColor(): string {
  if (typeof document === 'undefined') return '#4ade80';
  const root = getComputedStyle(document.documentElement);
  const hue = root.getPropertyValue('--primary-hue').trim() || '145';
  const sat = root.getPropertyValue('--primary-sat').trim() || '27%';
  const light = root.getPropertyValue('--primary-light').trim() || '53%';
  return `hsl(${hue}, ${sat}, ${light})`;
}

/** Rendering strategy from genome - determines how to render visual elements */
interface RenderingStrategy {
    /** Primary rendering approach */
    primary: string;
    /** Fallback if primary fails or unsupported */
    fallback: string;
    /** Whether to animate (respects accessibility settings) */
    animate: boolean;
    /** Complexity level - affects performance vs quality tradeoff */
    complexity: string;
}

/**
 * Detect WebGL support and capabilities
 */
function getWebGLSupport(): { supported: boolean; fallbackReason?: string } {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            return { supported: false, fallbackReason: 'WebGL not available' };
        }

        return { supported: true };
    } catch (e) {
        return { supported: false, fallbackReason: 'WebGL detection failed' };
    }
}

/**
 * DNA-Driven CSS Fallback
 * 
 * The fallback appearance is determined by the genome's rendering strategy,
 * not hardcoded design decisions. Complexity and animation are controlled
 * by the DNA, not the component.
 */
function CSSFallback3D({ strategy }: { strategy: RenderingStrategy }) {
    // DNA-driven: complexity controls the number of elements
    const ringCount = strategy.complexity === "minimal" ? 1 : 
                      strategy.complexity === "rich" ? 3 : 2;
    
    // DNA-driven: animation controlled by genome + user preference
    const shouldAnimate = strategy.animate;

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64">
                {/* DNA-driven number of rings based on complexity */}
                {Array.from({ length: ringCount }).map((_, i) => (
                    <div 
                        key={i}
                        className="absolute border border-primary/30"
                        style={{
                            inset: `${i * 16}px`,
                            borderRadius: '50%',
                            borderWidth: i === 0 ? '2px' : '1px',
                            opacity: 1 - (i * 0.2),
                            // DNA-driven animation
                            animation: shouldAnimate 
                                ? `gentle-rotate ${20 - i * 5}s linear infinite ${i % 2 === 1 ? 'reverse' : ''}`
                                : 'none',
                            animationPlayState: 'var(--motion-play-state, running)'
                        }}
                    />
                ))}
                
                {/* Core - only in balanced/rich modes */}
                {strategy.complexity !== "minimal" && (
                    <div 
                        className="absolute inset-8 bg-gradient-radial from-primary/20 to-transparent" 
                        style={{ borderRadius: '50%' }} 
                    />
                )}
                
                {/* Center element */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                        className="bg-primary" 
                        style={{ 
                            width: strategy.complexity === "rich" ? '12px' : '8px',
                            height: strategy.complexity === "rich" ? '12px' : '8px',
                            borderRadius: '50%' 
                        }} 
                    />
                </div>
            </div>
            
            <style>{`
                @keyframes gentle-rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                @media (prefers-reduced-motion: reduce) {
                    :root { --motion-play-state: paused; }
                }
            `}</style>
        </div>
    );
}

function GlassOrganism({ animate }: { animate: boolean }) {
    const meshRef = useRef<Mesh>(null);
    const [color, setColor] = useState('#4ade80');

    useEffect(() => {
        setColor(getGenomeColor());
    }, []);

    useFrame((_, delta) => {
        if (meshRef.current && animate) {
            meshRef.current.rotation.x += delta * 0.15;
            meshRef.current.rotation.y += delta * 0.25;
        }
    });

    return (
        <>
            {/* Background glow for visibility */}
            <mesh scale={2} position={[2, 0, -1]}>
                <sphereGeometry args={[1.5, 32, 32]} />
                <meshBasicMaterial color={color} transparent opacity={0.1} />
            </mesh>
            {/* Main glass organism */}
            <mesh ref={meshRef} scale={1.2} position={[2, 0, 0]}>
                <torusKnotGeometry args={[1, 0.35, 128, 32]} />
                <MeshTransmissionMaterial
                    roughness={0.1}
                    transmission={0.8}
                    thickness={1.5}
                    ior={1.8}
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.2}
                />
            </mesh>
            {/* Point light to illuminate the glass */}
            <pointLight position={[2, 2, 2]} intensity={2} color={color} />
        </>
    );
}

interface Procedural3DProps {
    /** Rendering strategy from genome ch18_rendering */
    strategy?: RenderingStrategy;
}

/**
 * DNA-Driven 3D Visualization
 * 
 * Rendering is controlled by the genome's ch18_rendering strategy:
 * - primary: webgl | css | static | svg
 * - fallback: what to use if primary fails
 * - animate: whether motion is allowed (from accessibility)
 * - complexity: minimal | balanced | rich
 * 
 * The component reads these values from props - no hardcoded design decisions.
 */
export function Procedural3D({ strategy }: Procedural3DProps) {
    const [webglSupport, setWebglSupport] = useState<{ supported: boolean; fallbackReason?: string } | null>(null);

    // Default strategy if none provided (uses DNA-like defaults)
    const effectiveStrategy: RenderingStrategy = strategy || {
        primary: "webgl",
        fallback: "css",
        animate: true,
        complexity: "balanced"
    };

    useEffect(() => {
        // Only detect WebGL if the strategy says we should try
        if (effectiveStrategy.primary === "webgl") {
            setWebglSupport(getWebGLSupport());
        } else {
            // For non-webgl strategies, we don't need to detect
            setWebglSupport({ supported: false });
        }
    }, [effectiveStrategy.primary]);

    // Show nothing during SSR/hydration
    if (webglSupport === null) {
        return <div className="w-full h-full" />;
    }

    // If strategy says use CSS (not WebGL), render CSS directly
    if (effectiveStrategy.primary === "css") {
        return <CSSFallback3D strategy={effectiveStrategy} />;
    }

    // If strategy says static (no visuals), return empty
    if (effectiveStrategy.primary === "static") {
        return <div className="w-full h-full" />;
    }

    // WebGL path: check support
    if (effectiveStrategy.primary === "webgl") {
        // Use fallback if WebGL not supported
        if (!webglSupport.supported && effectiveStrategy.fallback === "css") {
            return <CSSFallback3D strategy={effectiveStrategy} />;
        }

        // Attempt WebGL render
        return (
            <Canvas 
                camera={{ position: [0, 0, 8], fov: 50 }}
                fallback={effectiveStrategy.fallback === "css" ? <CSSFallback3D strategy={effectiveStrategy} /> : undefined}
            >
                <ambientLight intensity={0.5} />
                <Environment preset="city" />
                <GlassOrganism animate={effectiveStrategy.animate} />
            </Canvas>
        );
    }

    // Default fallback
    return <CSSFallback3D strategy={effectiveStrategy} />;
}
