import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment } from '@react-three/drei';
import type { Mesh } from 'three';

/* Permutations Generated DNA:
 * Material: glass
 * Roughness: 0.048627450980392145
 * Transmission: 0.8949019607843138
 * Geometry: torusKnot
 */

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

        // Check for WebGL2 for advanced features
        const gl2 = canvas.getContext('webgl2');
        if (!gl2) {
            // WebGL1 is still usable but may have limitations
            return { supported: true };
        }

        return { supported: true };
    } catch (e) {
        return { supported: false, fallbackReason: 'WebGL detection failed' };
    }
}

/**
 * CSS-based fallback animation for when WebGL is unavailable
 * Respects prefers-reduced-motion
 */
function CSSFallback3D() {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* DNA-inspired organic shape using CSS */}
            <div 
                className="relative w-48 h-48 md:w-64 md:h-64"
                style={{
                    // Static fallback that respects motion preferences
                }}
            >
                {/* Primary ring */}
                <div 
                    className="absolute inset-0 border-2 border-primary/30"
                    style={{
                        borderRadius: '50%',
                        animation: 'gentle-rotate 20s linear infinite',
                        // Pause animation if user prefers reduced motion
                        animationPlayState: 'var(--motion-play-state, running)'
                    }}
                />
                {/* Secondary ring - offset */}
                <div 
                    className="absolute inset-4 border border-primary/20"
                    style={{
                        borderRadius: '50%',
                        animation: 'gentle-rotate 15s linear infinite reverse',
                        animationPlayState: 'var(--motion-play-state, running)'
                    }}
                />
                {/* Core glow */}
                <div className="absolute inset-8 bg-gradient-radial from-primary/20 to-transparent" style={{ borderRadius: '50%' }} />
                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary" style={{ borderRadius: '50%' }} />
                </div>
            </div>
            
            <style>{`
                @keyframes gentle-rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                /* Respect prefers-reduced-motion */
                @media (prefers-reduced-motion: reduce) {
                    :root {
                        --motion-play-state: paused;
                    }
                }
            `}</style>
        </div>
    );
}

function GlassOrganism() {
    const meshRef = useRef<Mesh>(null);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.15;
            meshRef.current.rotation.y += delta * 0.25;
        }
    });

    return (
        <mesh ref={meshRef} scale={1.2} position={[2, 0, 0]}>
            <torusKnotGeometry args={[1, 0.3, 128, 32]} />
            <MeshTransmissionMaterial
                roughness={0.048627450980392145}
                transmission={0.8949019607843138}
                thickness={0.5}
                ior={1.5}
                color="#7f93c9"
            />
        </mesh>
    );
}

export function Procedural3D() {
    const [webglSupport, setWebglSupport] = useState<{ supported: boolean; fallbackReason?: string } | null>(null);

    useEffect(() => {
        setWebglSupport(getWebGLSupport());
    }, []);

    // Show nothing during SSR/hydration
    if (webglSupport === null) {
        return <div className="w-full h-full" />;
    }

    // Show CSS fallback if WebGL not available
    if (!webglSupport.supported) {
        return <CSSFallback3D />;
    }

    // Attempt WebGL render - errors will trigger React error boundary
    return (
        <Canvas 
            camera={{ position: [0, 0, 8], fov: 50 }}
            fallback={<CSSFallback3D />}
        >
            <ambientLight intensity={0.5} />
            <Environment preset="city" />
            <GlassOrganism />
        </Canvas>
    );
}
